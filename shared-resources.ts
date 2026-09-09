(function (global: any) {
  "use strict";

  const definitions = [
    { id: "ffmpeg-core-js", fileName: "ffmpeg-core.js", downloadUrl: "https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.12.10/umd/ffmpeg-core.js", descriptionKey: "ffmpegCoreJsDesc" },
    { id: "ffmpeg-core-wasm", fileName: "ffmpeg-core.wasm", downloadUrl: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm", descriptionKey: "ffmpegCoreWasmDesc" },
    { id: "pdf-lib-js", fileName: "pdf-lib.min.js", downloadUrl: "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js", descriptionKey: "pdfLibDesc" }
  ];
  const downloads = new Map<string, Promise<void>>();
  let channel: BroadcastChannel | null = null;
  try { channel = new BroadcastChannel("web-tools-resources"); } catch (_) {}
  function announce() {
    global.dispatchEvent(new Event("web-tools-resources-changed"));
    channel?.postMessage("changed");
  }
  if (channel) channel.onmessage = () => global.dispatchEvent(new Event("web-tools-resources-changed"));

  function transaction<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) { reject(new Error("IndexedDB unavailable")); return; }
      const request = indexedDB.open("web-tools-resource-cache", 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains("resources")) request.result.createObjectStore("resources", { keyPath: "id" });
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Resource cache is blocked"));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        try {
          const tx = db.transaction("resources", mode);
          const operation = callback(tx.objectStore("resources"));
          // Success is reported only after the transaction commits, including quota errors.
          tx.oncomplete = () => { db.close(); if (mode === "readwrite") announce(); resolve(operation.result); };
          tx.onabort = tx.onerror = () => { db.close(); reject(tx.error || operation.error || new Error("Cache transaction failed")); };
        } catch (error) { db.close(); reject(error); }
      };
    });
  }
  function read(id: string) { return transaction<any>("readonly", store => store.get(id)).then(record => record instanceof Blob ? { id, content: record } : record); }
  function sizeOf(content: any) {
    return content instanceof Blob ? content.size : typeof content === "string" ? content.length : content?.byteLength || 0;
  }
  function available(record: any) { return Boolean(record && sizeOf(record.content) > 0); }
  function put(id: string, content: ArrayBuffer, mimeType: string) {
    const resource = definitions.find(item => item.id === id);
    if (!resource || !content.byteLength) return Promise.reject(new Error("Empty or unknown resource"));
    const record = { id, fileName: resource.fileName, content, mimeType, size: content.byteLength, updatedAt: Date.now() };
    return transaction("readwrite", store => store.keyPath ? store.put(record) : store.put(record, id));
  }
  function download(id: string, onProgress: (percent: number | null, received: number) => void = () => {}): Promise<void> {
    const existing = downloads.get(id);
    if (existing) return existing;
    const resource = definitions.find(item => item.id === id);
    if (!resource) return Promise.reject(new Error("Unknown resource"));
    const task = (async () => {
      const controller = new AbortController();
      let timer = 0;
      const touch = () => { clearTimeout(timer); timer = global.setTimeout(() => controller.abort(), 60000); };
      try {
        touch();
        const response = await fetch(resource.downloadUrl, { signal: controller.signal });
        if (!response.ok) throw new Error("HTTP " + response.status);
        if (/text\/html/i.test(response.headers.get("content-type") || "")) throw new Error("Unexpected HTML response");
        const total = Number(response.headers.get("content-length")) || 0;
        let content: ArrayBuffer;
        if (response.body) {
          const reader = response.body.getReader();
          const chunks: ArrayBuffer[] = [];
          let received = 0, lastUpdate = 0;
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            touch();
            chunks.push(value.slice().buffer);
            received += value.byteLength;
            if (Date.now() - lastUpdate > 100) {
              onProgress(total > 0 ? Math.min(99, Math.floor(received / total * 100)) : null, received);
              lastUpdate = Date.now();
            }
          }
          content = await new Blob(chunks).arrayBuffer();
        } else content = await response.arrayBuffer();
        if (!content.byteLength) throw new Error("Empty resource");
        const header = new Uint8Array(content, 0, Math.min(64, content.byteLength));
        if (resource.fileName.endsWith(".wasm")) {
          if (header[0] !== 0 || header[1] !== 97 || header[2] !== 115 || header[3] !== 109) throw new Error("Invalid WASM resource");
        } else if (/^\s*</.test(new TextDecoder().decode(header))) throw new Error("Unexpected HTML response");
        await put(id, content, response.headers.get("content-type") || "application/octet-stream");
        onProgress(100, content.byteLength);
      } finally { clearTimeout(timer); }
    })();
    downloads.set(id, task);
    task.finally(() => downloads.delete(id)).catch(() => {});
    return task;
  }

  function createCard(host: HTMLElement, ids: string[]) {
    const resources = ids.map(id => definitions.find(item => item.id === id));
    if (resources.some(item => !item)) throw new Error("Unknown resource group");
    host.classList.add("wt-resource-card");
    host.innerHTML = '<div class="wt-resource-head"><strong></strong><span class="wt-resource-badge" role="status" aria-live="polite"></span></div><p class="wt-resource-summary"></p><div class="wt-resource-actions"><button type="button" class="btn primary" data-download></button><button type="button" class="btn" data-import></button><button type="button" class="btn" data-check></button></div><progress max="100" hidden></progress><p class="wt-resource-message" role="status" aria-live="polite" hidden></p><details><summary></summary><ul></ul></details><input type="file" accept=".js,.wasm" multiple hidden>';
    const title = host.querySelector("strong")!;
    const badge = host.querySelector(".wt-resource-badge") as HTMLElement;
    const summary = host.querySelector(".wt-resource-summary")!;
    const downloadButton = host.querySelector("[data-download]") as HTMLButtonElement;
    const importButton = host.querySelector("[data-import]") as HTMLButtonElement;
    const checkButton = host.querySelector("[data-check]") as HTMLButtonElement;
    const bar = host.querySelector("progress")!;
    const message = host.querySelector(".wt-resource-message") as HTMLElement;
    const list = host.querySelector("ul")!;
    const input = host.querySelector("input") as HTMLInputElement;
    let states = new Map<string, boolean>();
    let state = "checking", busy = false, errorKey = "", file = "", received = 0;
    let percent: number | null = null, refreshPromise: Promise<void> | null = null;
    const words = {
      zh: { title: "本地资源", checking: "检查中", ready: "已就绪", missing: "缺少资源", downloading: "下载中", importing: "导入中", error: "检查失败", cached: "已缓存", absent: "未缓存", hint: "处理时自动加载", download: "下载缺失资源", retry: "重试下载", import: "导入文件", check: "重新检查", details: "资源详情", downloadError: "下载或缓存写入失败，请检查网络及浏览器存储空间后重试，也可导入本地文件。", checkError: "无法访问浏览器缓存，请检查浏览器存储权限后重新检查。", importError: "导入失败，请选择详情中列出的资源文件并检查存储空间。" },
      en: { title: "Local resources", checking: "Checking", ready: "Ready", missing: "Missing", downloading: "Downloading", importing: "Importing", error: "Check failed", cached: "cached", absent: "Missing", hint: "Loads automatically when needed", download: "Download missing resources", retry: "Retry download", import: "Import files", check: "Check again", details: "Resource details", downloadError: "Download or cache write failed. Check your connection and browser storage, then retry or import local files.", checkError: "Cannot access browser cache. Check storage permissions and try again.", importError: "Import failed. Choose the files listed in Resource details and check available storage." }
    };
    function render() {
      const w = words[document.documentElement.lang.startsWith("zh") ? "zh" : "en"];
      const count = resources.filter(item => states.get(item.id)).length;
      const group = ids.includes("pdf-lib-js") ? "pdf-lib" : "FFmpeg";
      title.textContent = w.title;
      badge.textContent = w[state];
      host.dataset.state = state;
      summary.textContent = group + " · " + count + "/" + resources.length + " " + w.cached + (state === "ready" ? " · " + w.hint : "");
      downloadButton.textContent = errorKey === "downloadError" ? w.retry : w.download;
      downloadButton.hidden = state === "ready";
      downloadButton.disabled = busy || state === "checking" || state === "error";
      importButton.textContent = w.import;
      importButton.hidden = state === "ready";
      importButton.disabled = busy || state === "checking" || state === "error";
      checkButton.textContent = w.check;
      checkButton.disabled = busy;
      bar.hidden = !busy;
      bar.setAttribute("aria-label", w[state]);
      if (percent === null) bar.removeAttribute("value"); else bar.value = percent;
      message.hidden = !errorKey && !busy;
      message.textContent = errorKey ? w[errorKey] : file + (percent === null ? " · " + (received / 1048576).toFixed(1) + " MB" : " · " + percent + "%");
      host.querySelector("summary")!.textContent = w.details;
      list.replaceChildren();
      resources.forEach(item => {
        const row = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = item.fileName;
        const status = document.createElement("span");
        status.textContent = states.get(item.id) ? w.cached : w.absent;
        row.append(name, status);
        list.append(row);
      });
    }
    async function refresh() {
      if (busy) return;
      if (refreshPromise) return refreshPromise;
      state = "checking";
      render();
      refreshPromise = (async () => {
        try {
          const records = await Promise.all(resources.map(item => read(item.id)));
          states = new Map(resources.map((item, index) => [item.id, available(records[index])]));
          state = resources.every(item => states.get(item.id)) ? "ready" : "missing";
          if (state === "ready" || errorKey === "checkError") errorKey = "";
        } catch (_) { state = "error"; errorKey = "checkError"; }
        finally { refreshPromise = null; render(); }
      })();
      return refreshPromise;
    }
    downloadButton.onclick = async () => {
      if (busy) return;
      busy = true; errorKey = ""; state = "downloading"; received = 0; percent = null;
      render();
      try {
        for (const item of resources) {
          // Recheck to preserve resources downloaded in another tab.
          if (available(await read(item.id))) { states.set(item.id, true); continue; }
          file = item.fileName; received = 0; percent = null; render();
          await download(item.id, (value, bytes) => { percent = value; received = bytes; render(); });
          states.set(item.id, true);
        }
      } catch (_) { errorKey = "downloadError"; }
      finally { busy = false; await refresh(); }
    };
    importButton.onclick = () => input.click();
    input.onchange = async () => {
      if (busy || !input.files?.length) return;
      busy = true; errorKey = ""; state = "importing"; percent = null; received = 0; render();
      try {
        for (const selected of Array.from(input.files)) {
          const item = resources.find(resource => resource.fileName === selected.name);
          if (!item || !selected.size) throw new Error("Resource name mismatch");
          file = selected.name; render();
          await put(item.id, await selected.arrayBuffer(), selected.type || "application/octet-stream");
          states.set(item.id, true);
        }
      } catch (_) { errorKey = "importError"; }
      finally { input.value = ""; busy = false; await refresh(); }
    };
    checkButton.onclick = () => { errorKey = ""; void refresh(); };
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    global.addEventListener("web-tools-resources-changed", () => void refresh());
    global.addEventListener("focus", () => void refresh());
    document.addEventListener("visibilitychange", () => { if (!document.hidden) void refresh(); });
    void refresh();
    return { refresh };
  }

  global.WebToolsResources = { definitions, transaction, read, available, put, download, createCard };
})(window);
