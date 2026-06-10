(function () {
  "use strict";

  type SupportedLanguage = "zh" | "en";
  type FitMode = "contain" | "cover";
  type PageSizeMode = "image" | "a4-portrait" | "a4-landscape";

  type ImageEntry = {
    id: string;
    file: File;
    url: string;
    width: number;
    height: number;
  };

  const LANGUAGE_STORAGE_KEY = "web-tools-language";
  const THEME_STORAGE_KEY = "web-tools-theme";
  const LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
  const LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
  const RESOURCE_CACHE_DB_NAME = "web-tools-resource-cache";
  const RESOURCE_CACHE_STORE_NAME = "resources";
  const RESOURCE_CACHE_DB_VERSION = 1;
  const PDF_LIB_RESOURCE_ID = "pdf-lib-js";
  const A4_PORTRAIT = [595.28, 841.89];
  const A4_LANDSCAPE = [841.89, 595.28];

  const TEXT = {
    zh: {
      htmlLang: "zh-CN",
      title: "图片转 PDF",
      home: "工具集",
      themeToggle: "切换主题",
      lead: "将 JPG/PNG 图片按当前顺序合成为 PDF，所有处理都在浏览器本地完成。",
      engineIdle: "尚未加载",
      engineLoading: "正在加载本地 pdf-lib...",
      engineReady: "已加载，可开始生成",
      engineLoadButton: "加载本地库",
      engineMissing: "未找到 pdf-lib.min.js，请先在入口页资源管理中导入或下载到浏览器缓存。",
      inputTitle: "输入图片",
      uploadTitle: "选择或拖放 JPG/PNG 图片",
      uploadHint: "支持多选；拖拽列表项可调整 PDF 页面顺序。",
      resourceWarning: "需要先在入口页资源管理中导入或下载 pdf-lib.min.js 到浏览器缓存。进入本页后仍需点击“加载本地库”或在生成时自动加载。",
      settingsTitle: "生成设置",
      pageSize: "页面尺寸",
      pageImage: "跟随图片",
      pageA4Portrait: "A4 纵向",
      pageA4Landscape: "A4 横向",
      fitMode: "适配方式",
      fitContain: "等比适应",
      fitCover: "等比填充",
      margin: "边距（pt）",
      outputName: "输出文件名",
      generate: "生成 PDF",
      outputTitle: "输出",
      logTitle: "日志",
      waitingInput: "等待输入图片",
      noOutput: "暂无输出",
      loadingImages: "正在读取图片...",
      readyImages: "已加载图片",
      generating: "正在生成 PDF...",
      done: "PDF 已生成",
      failed: "生成失败",
      needImages: "请先选择 JPG 或 PNG 图片。",
      unsupportedImage: "仅支持 JPG/PNG 图片：",
      download: "下载 PDF",
      pages: "页数",
      size: "大小",
      fileName: "文件名",
      moveUp: "上移",
      moveDown: "下移",
      remove: "移除"
    },
    en: {
      htmlLang: "en",
      title: "Images to PDF",
      home: "Tools",
      themeToggle: "Toggle theme",
      lead: "Convert JPG/PNG images into a PDF in the current order. Everything runs locally in your browser.",
      engineIdle: "Not loaded",
      engineLoading: "Loading local pdf-lib...",
      engineReady: "Loaded and ready",
      engineLoadButton: "Load Local Library",
      engineMissing: "pdf-lib.min.js was not found. Import or download it into browser cache from Resource Management first.",
      inputTitle: "Input Images",
      uploadTitle: "Choose or drop JPG/PNG images",
      uploadHint: "Multiple images are supported. Drag list items to adjust PDF page order.",
      resourceWarning: "Import or download pdf-lib.min.js into browser cache from Resource Management first. This page still loads the local library before generating.",
      settingsTitle: "PDF Settings",
      pageSize: "Page size",
      pageImage: "Follow image",
      pageA4Portrait: "A4 portrait",
      pageA4Landscape: "A4 landscape",
      fitMode: "Fit mode",
      fitContain: "Fit proportionally",
      fitCover: "Fill proportionally",
      margin: "Margin (pt)",
      outputName: "Output file name",
      generate: "Generate PDF",
      outputTitle: "Output",
      logTitle: "Log",
      waitingInput: "Waiting for images",
      noOutput: "No output yet",
      loadingImages: "Reading images...",
      readyImages: "Images loaded",
      generating: "Generating PDF...",
      done: "PDF generated",
      failed: "Generation failed",
      needImages: "Choose JPG or PNG images first.",
      unsupportedImage: "Only JPG/PNG images are supported: ",
      download: "Download PDF",
      pages: "Pages",
      size: "Size",
      fileName: "File name",
      moveUp: "Move up",
      moveDown: "Move down",
      remove: "Remove"
    }
  };

  const $ = function (selector): any { return document.querySelector(selector); };
  const $$ = function (selector): any[] { return Array.from(document.querySelectorAll(selector)) as any[]; };

  let currentLanguage = resolveInitialLanguage();
  let images: ImageEntry[] = [];
  let draggedId = "";
  let pdfLibPromise: Promise<any> | null = null;
  let pdfLibReady = false;
  let generating = false;

  function t(key: string): string {
    return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
  }

  function resolveInitialLanguage(): SupportedLanguage {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
    const browserLanguage = (navigator.language || "").toLowerCase();
    if (browserLanguage.startsWith("zh")) return "zh";
    if (browserLanguage.startsWith("en")) return "en";
    return "en";
  }

  function resolveInitialTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme: string) {
    document.documentElement.dataset.theme = theme;
    $("#themeButton").setAttribute("aria-label", t("themeToggle"));
  }

  function setText(selector: string, key: string) {
    const element = $(selector);
    if (element) element.textContent = t(key);
  }

  function applyLanguage(language: SupportedLanguage) {
    currentLanguage = language;
    document.documentElement.lang = t("htmlLang");
    document.title = t("title");
    setText("#homeLink", "home");
    setText("#pageTitle", "title");
    setText("#pageLead", "lead");
    setText("#loadPdfLibButton", "engineLoadButton");
    setText("#inputTitle", "inputTitle");
    setText("#uploadTitle", "uploadTitle");
    setText("#uploadHint", "uploadHint");
    setText("#resourceWarning", "resourceWarning");
    setText("#settingsTitle", "settingsTitle");
    setText("#pageSizeLabel", "pageSize");
    setText('#pageSize option[value="image"]', "pageImage");
    setText('#pageSize option[value="a4-portrait"]', "pageA4Portrait");
    setText('#pageSize option[value="a4-landscape"]', "pageA4Landscape");
    setText("#fitModeLabel", "fitMode");
    setText('#fitMode option[value="contain"]', "fitContain");
    setText('#fitMode option[value="cover"]', "fitCover");
    setText("#marginLabel", "margin");
    setText("#outputNameLabel", "outputName");
    setText("#generateButton", "generate");
    setText("#outputTitle", "outputTitle");
    setText("#logTitle", "logTitle");
    $$(".language button[data-lang]").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === language);
    });
    updateEngineStatus();
    renderImages();
    if (!$("#resultBox").dataset.hasOutput) $("#resultBox").textContent = t("noOutput");
    if (images.length === 0) $("#statusLine").textContent = t("waitingInput");
  }

  function updateEngineStatus() {
    if (pdfLibReady) $("#engineStatus").textContent = t("engineReady");
    else if (pdfLibPromise) $("#engineStatus").textContent = t("engineLoading");
    else $("#engineStatus").textContent = t("engineIdle");
  }

  function appendLog(message: string) {
    const time = new Date().toLocaleTimeString();
    $("#logBox").textContent += "[" + time + "] " + message + "\n";
    $("#logBox").scrollTop = $("#logBox").scrollHeight;
  }

  function setStatus(key: string) {
    $("#statusLine").textContent = t(key);
  }

  function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return (index === 0 ? value.toFixed(0) : value.toFixed(2)) + " " + units[index];
  }

  function normalizePdfName(name: string) {
    const cleaned = (name || "images.pdf").trim().replace(/[\\/:*?"<>|]+/g, "-");
    return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : cleaned + ".pdf";
  }

  function isSupportedImage(file: File) {
    const type = (file.type || "").toLowerCase();
    const name = file.name.toLowerCase();
    return type === "image/jpeg" || type === "image/png" || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
  }

  function loadImageDimensions(file: File, url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
      image.onerror = () => reject(new Error(file.name));
      image.src = url;
    });
  }

  async function addFiles(files: FileList | File[]) {
    const selected = Array.from(files);
    if (selected.length === 0) return;
    setStatus("loadingImages");
    for (const file of selected) {
      if (!isSupportedImage(file)) {
        alert(t("unsupportedImage") + file.name);
        continue;
      }
      const url = URL.createObjectURL(file);
      try {
        const size = await loadImageDimensions(file, url);
        images.push({
          id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
          file,
          url,
          width: size.width,
          height: size.height
        });
      } catch (_error) {
        URL.revokeObjectURL(url);
        alert(t("unsupportedImage") + file.name);
      }
    }
    renderImages();
    $("#statusLine").textContent = images.length ? images.length + " " + t("readyImages") : t("waitingInput");
  }

  function moveImage(index: number, offset: number) {
    const target = index + offset;
    if (target < 0 || target >= images.length) return;
    const [entry] = images.splice(index, 1);
    images.splice(target, 0, entry);
    renderImages();
  }

  function removeImage(index: number) {
    const [entry] = images.splice(index, 1);
    if (entry) URL.revokeObjectURL(entry.url);
    renderImages();
    if (!images.length) setStatus("waitingInput");
  }

  function renderImages() {
    const list = $("#imageList");
    list.innerHTML = "";
    images.forEach((entry, index) => {
      const item = document.createElement("article");
      item.className = "image-item";
      item.draggable = true;
      item.dataset.id = entry.id;
      item.innerHTML = [
        '<img class="thumb" src="' + entry.url + '" alt="">',
        "<div>",
        '<div class="file-name">' + entry.file.name + "</div>",
        '<div class="file-meta">' + entry.width + " x " + entry.height + " · " + formatBytes(entry.file.size) + "</div>",
        "</div>",
        '<div class="item-actions">',
        '<button class="icon-btn" type="button" data-action="up" aria-label="' + t("moveUp") + '">↑</button>',
        '<button class="icon-btn" type="button" data-action="down" aria-label="' + t("moveDown") + '">↓</button>',
        '<button class="icon-btn" type="button" data-action="remove" aria-label="' + t("remove") + '">×</button>',
        "</div>"
      ].join("");
      item.addEventListener("dragstart", () => {
        draggedId = entry.id;
        item.classList.add("dragging");
      });
      item.addEventListener("dragend", () => {
        draggedId = "";
        item.classList.remove("dragging");
      });
      item.addEventListener("dragover", (event) => event.preventDefault());
      item.addEventListener("drop", (event) => {
        event.preventDefault();
        if (!draggedId || draggedId === entry.id) return;
        const from = images.findIndex((image) => image.id === draggedId);
        const to = images.findIndex((image) => image.id === entry.id);
        if (from < 0 || to < 0) return;
        const [moved] = images.splice(from, 1);
        images.splice(to, 0, moved);
        renderImages();
      });
      item.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.action;
          if (action === "up") moveImage(index, -1);
          if (action === "down") moveImage(index, 1);
          if (action === "remove") removeImage(index);
        });
      });
      list.appendChild(item);
    });
  }

  function openResourceCacheDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(RESOURCE_CACHE_DB_NAME, RESOURCE_CACHE_DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(RESOURCE_CACHE_STORE_NAME)) {
          db.createObjectStore(RESOURCE_CACHE_STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function getCachedResource(resourceId: string): Promise<any> {
    return openResourceCacheDb().then((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(RESOURCE_CACHE_STORE_NAME, "readonly");
      const request = transaction.objectStore(RESOURCE_CACHE_STORE_NAME).get(resourceId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    }));
  }

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).PDFLib) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[data-pdf-lib="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(t("engineMissing"))), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.dataset.pdfLib = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(t("engineMissing")));
      document.head.appendChild(script);
    });
  }

  async function loadCachedPdfLib() {
    if ((window as any).PDFLib) {
      pdfLibReady = true;
      updateEngineStatus();
      return (window as any).PDFLib;
    }
    if (!pdfLibPromise) {
      pdfLibPromise = (async () => {
        updateEngineStatus();
        const record = await getCachedResource(PDF_LIB_RESOURCE_ID);
        if (!record || !record.content) throw new Error(t("engineMissing"));
        const blob = new Blob([record.content], { type: record.mimeType || "text/javascript" });
        const blobUrl = URL.createObjectURL(blob);
        try {
          await loadScript(blobUrl);
        } finally {
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
        if (!(window as any).PDFLib) throw new Error(t("engineMissing"));
        pdfLibReady = true;
        updateEngineStatus();
        appendLog(t("engineReady"));
        return (window as any).PDFLib;
      })().catch((error) => {
        pdfLibPromise = null;
        updateEngineStatus();
        throw error;
      });
    }
    return pdfLibPromise;
  }

  function getPageSize(entry: ImageEntry, margin: number): number[] {
    const mode = $("#pageSize").value as PageSizeMode;
    if (mode === "a4-portrait") return A4_PORTRAIT.slice();
    if (mode === "a4-landscape") return A4_LANDSCAPE.slice();
    return [entry.width + margin * 2, entry.height + margin * 2];
  }

  function getDrawBox(pageWidth: number, pageHeight: number, imageWidth: number, imageHeight: number, margin: number, fit: FitMode) {
    const contentWidth = Math.max(1, pageWidth - margin * 2);
    const contentHeight = Math.max(1, pageHeight - margin * 2);
    const scale = fit === "cover"
      ? Math.max(contentWidth / imageWidth, contentHeight / imageHeight)
      : Math.min(contentWidth / imageWidth, contentHeight / imageHeight);
    const width = imageWidth * scale;
    const height = imageHeight * scale;
    return {
      x: margin + (contentWidth - width) / 2,
      y: margin + (contentHeight - height) / 2,
      width,
      height
    };
  }

  async function generatePdf() {
    if (generating) return;
    if (!images.length) {
      alert(t("needImages"));
      return;
    }
    generating = true;
    $("#generateButton").disabled = true;
    $("#summary").innerHTML = "";
    $("#resultBox").dataset.hasOutput = "";
    $("#resultBox").textContent = t("noOutput");
    setStatus("generating");
    try {
      const PDFLib = await loadCachedPdfLib();
      const pdfDoc = await PDFLib.PDFDocument.create();
      const fit = $("#fitMode").value as FitMode;
      const margin = Math.max(0, Math.min(240, Number($("#marginInput").value) || 0));
      for (const entry of images) {
        const bytes = await entry.file.arrayBuffer();
        const lowerName = entry.file.name.toLowerCase();
        const embedded = lowerName.endsWith(".png") || entry.file.type === "image/png"
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);
        const [pageWidth, pageHeight] = getPageSize(entry, margin);
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const box = getDrawBox(pageWidth, pageHeight, embedded.width, embedded.height, margin, fit);
        page.drawImage(embedded, box);
      }
      const output = await pdfDoc.save();
      const fileName = normalizePdfName($("#outputName").value);
      const blob = new Blob([output], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.className = "download-link";
      link.href = url;
      link.download = fileName;
      link.textContent = t("download");
      $("#resultBox").innerHTML = "";
      $("#resultBox").dataset.hasOutput = "true";
      $("#resultBox").appendChild(link);
      $("#summary").innerHTML = [
        "<div><span>" + t("pages") + "</span><strong>" + images.length + "</strong></div>",
        "<div><span>" + t("size") + "</span><strong>" + formatBytes(blob.size) + "</strong></div>",
        "<div><span>" + t("fileName") + "</span><strong>" + fileName + "</strong></div>"
      ].join("");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("done");
      appendLog(t("done") + ": " + fileName);
    } catch (error) {
      setStatus("failed");
      const message = (error && error.message) || String(error);
      $("#resultBox").textContent = message;
      appendLog(message);
    } finally {
      generating = false;
      $("#generateButton").disabled = false;
    }
  }

  $("#uploadLabel").addEventListener("dragover", (event) => {
    event.preventDefault();
    $("#uploadLabel").classList.add("dragover");
  });

  $("#uploadLabel").addEventListener("dragleave", () => {
    $("#uploadLabel").classList.remove("dragover");
  });

  $("#uploadLabel").addEventListener("drop", (event) => {
    event.preventDefault();
    $("#uploadLabel").classList.remove("dragover");
    void addFiles(event.dataTransfer.files);
  });

  $("#fileInput").addEventListener("change", (event) => {
    void addFiles(event.target.files);
    event.target.value = "";
  });

  $("#loadPdfLibButton").addEventListener("click", async () => {
    try {
      await loadCachedPdfLib();
    } catch (error) {
      alert((error && error.message) || String(error));
    }
  });

  $("#generateButton").addEventListener("click", generatePdf);

  document.querySelectorAll<HTMLButtonElement>(".language button[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextLanguage = button.dataset.lang;
      if (nextLanguage !== "zh" && nextLanguage !== "en") return;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      applyLanguage(nextLanguage);
    });
  });

  $("#themeButton").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });

  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return;
    applyTheme(event.matches ? "dark" : "light");
  });

  applyTheme(resolveInitialTheme());
  applyLanguage(currentLanguage);
})();
