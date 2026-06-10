type SupportedLanguage = "zh" | "en";

type LanguagePack = {
  htmlLang: string;
  documentTitle: string;
  eyebrow: string;
  title: string;
  lead: string;
  statusLabel: string;
  statusServerless: string;
  statusBuildless: string;
  statusOffline: string;
  searchPlaceholder: string;
  searchLabel: string;
  clearSearch: string;
  themeToggle: string;
  toolListLabel: string;
  open: string;
  imageTitle: string;
  imageDesc: string;
  imageTagCrop: string;
  imageTagStitch: string;
  imageTagCompress: string;
  converterTitle: string;
  converterDesc: string;
  converterTagCopy: string;
  converterTagRealtime: string;
  videoTitle: string;
  videoDesc: string;
  videoTagAudio: string;
  videoTagClip: string;
  videoTagConcat: string;
  videoTagRemux: string;
  videoTagMetadata: string;
  audioTitle: string;
  audioDesc: string;
  audioTagConvert: string;
  audioTagCut: string;
  audioTagMetadata: string;
  audioTagWaveform: string;
  pdfTitle: string;
  pdfDesc: string;
  pdfTagUpload: string;
  pdfTagSort: string;
  pdfTagLayout: string;
  pdfTagDownload: string;
  resourceTitle: string;
  resourceDesc: string;
  resourceModeCache: string;
  refreshResources: string;
  resourcePending: string;
  resourceReady: string;
  resourceMissing: string;
  resourceError: string;
  resourceDownloading: string;
  resourceDownload: string;
  resourceDownloadToCache: string;
  resourceImport: string;
  resourceClearCache: string;
  resourceDownloadFailed: string;
  resourceImportFailed: string;
  resourceImportMismatch: string;
  resourceCacheHint: string;
  resourceCacheUnsupported: string;
  ffmpegCoreJsDesc: string;
  ffmpegCoreWasmDesc: string;
  pdfLibDesc: string;
  emptyState: string;
  footer: string;
};

type I18nKey = keyof LanguagePack;

type ResourceState = "pending" | "ready" | "missing" | "error" | "downloading";

type ManagedResource = {
  id: string;
  fileName: string;
  downloadUrl: string;
  descriptionKey: I18nKey;
};

const LANGUAGE_TABLE: Record<SupportedLanguage, LanguagePack> = {
  zh: {
    htmlLang: "zh-CN",
    documentTitle: "Web Tool",
    eyebrow: "Browser only",
    title: "Web Tool",
    lead: "一个只依赖浏览器的本地工具集合。打开 HTML 文件即可使用，图片和数据都留在当前浏览器里处理。",
    statusLabel: "项目特点",
    statusServerless: "无服务端",
    statusBuildless: "无构建步骤",
    statusOffline: "离线可用",
    searchPlaceholder: "搜索工具、功能或格式，例如：压缩、Mbps、WebP",
    searchLabel: "搜索工具",
    clearSearch: "清空搜索",
    themeToggle: "切换主题",
    toolListLabel: "工具列表",
    open: "打开",
    imageTitle: "图片处理",
    imageDesc: "裁剪、拼接、压缩图片，支持拖放上传、实时预览和本地导出。",
    imageTagCrop: "裁剪",
    imageTagStitch: "拼接",
    imageTagCompress: "压缩",
    converterTitle: "数据单位转换",
    converterDesc: "在网络速率和数据容量之间实时换算，清楚区分 bit、Byte、1000 进制与 1024 进制。",
    converterTagCopy: "一键复制",
    converterTagRealtime: "实时计算",
    videoTitle: "视频处理",
    videoDesc: "基于本地 FFmpeg.wasm 执行音频提取、片段截取、视频拼接、转封装、GIF 生成和元数据读取。",
    videoTagAudio: "音频提取",
    videoTagClip: "截取片段",
    videoTagConcat: "拼接",
    videoTagRemux: "转封装",
    videoTagMetadata: "元数据",
    audioTitle: "音频处理",
    audioDesc: "基于本地 FFmpeg.wasm 执行格式转换、无损剪切、转封装、元数据编辑、波形预览和音量增益。",
    audioTagConvert: "格式转换",
    audioTagCut: "裁剪片段",
    audioTagMetadata: "元数据编辑",
    audioTagWaveform: "波形预览",
    pdfTitle: "图片转 PDF",
    pdfDesc: "将多张 JPG/PNG 图片按顺序转换为 PDF，支持页面尺寸、适配方式、边距和文件名设置。",
    pdfTagUpload: "多图上传",
    pdfTagSort: "拖拽排序",
    pdfTagLayout: "页面布局",
    pdfTagDownload: "下载 PDF",
    resourceTitle: "资源管理",
    resourceDesc: "为需要额外运行库的工具准备本地资源。首次导入或下载到浏览器缓存后，工具会自动从缓存加载。",
    resourceModeCache: "导入到浏览器缓存",
    refreshResources: "刷新检查",
    resourcePending: "待检查",
    resourceReady: "已就绪",
    resourceMissing: "缺失",
    resourceError: "检查失败",
    resourceDownloading: "下载中",
    resourceDownload: "下载",
    resourceDownloadToCache: "下载到缓存",
    resourceImport: "导入",
    resourceClearCache: "清除缓存",
    resourceDownloadFailed: "下载失败，请复制下载地址后手动保存。",
    resourceImportFailed: "导入失败，请确认选择了正确的资源文件。",
    resourceImportMismatch: "文件名不匹配，请选择：",
    resourceCacheHint: "浏览器缓存键：",
    resourceCacheUnsupported: "当前浏览器不支持 IndexedDB 缓存导入。",
    ffmpegCoreJsDesc: "FFmpeg.wasm 单线程核心脚本，供后续音视频处理工具加载。",
    ffmpegCoreWasmDesc: "FFmpeg.wasm 单线程 WebAssembly 二进制文件，体积较大，建议本地缓存。",
    pdfLibDesc: "pdf-lib UMD 静态脚本，用于在浏览器本地生成 PDF。",
    emptyState: "没有找到匹配的工具。",
    footer: "所有工具均为静态页面。直接双击入口文件或部署到任意静态站点即可使用。"
  },
  en: {
    htmlLang: "en",
    documentTitle: "Web Tool",
    eyebrow: "Browser only",
    title: "Web Tool",
    lead: "A local collection of browser-only tools. Open the HTML files directly; images and data stay inside your current browser.",
    statusLabel: "Project traits",
    statusServerless: "No server",
    statusBuildless: "No build step",
    statusOffline: "Works offline",
    searchPlaceholder: "Search tools, features, or formats, e.g. compress, Mbps, WebP",
    searchLabel: "Search tools",
    clearSearch: "Clear search",
    themeToggle: "Toggle theme",
    toolListLabel: "Tool list",
    open: "Open",
    imageTitle: "Image Processing",
    imageDesc: "Crop, stitch, and compress images with drag-and-drop upload, live previews, and local export.",
    imageTagCrop: "Crop",
    imageTagStitch: "Stitch",
    imageTagCompress: "Compress",
    converterTitle: "Data Unit Converter",
    converterDesc: "Convert network rates and data capacity in real time, with clear bit, Byte, base-1000, and base-1024 handling.",
    converterTagCopy: "Copy result",
    converterTagRealtime: "Realtime",
    videoTitle: "Video Processing",
    videoDesc: "Use local FFmpeg.wasm to extract audio, clip video ranges, stitch clips, remux containers, generate GIFs, and read metadata.",
    videoTagAudio: "Extract audio",
    videoTagClip: "Clip",
    videoTagConcat: "Stitch",
    videoTagRemux: "Remux",
    videoTagMetadata: "Metadata",
    audioTitle: "Audio Processing",
    audioDesc: "Use local FFmpeg.wasm for conversion, lossless trimming, remuxing, metadata editing, waveform preview, and gain processing.",
    audioTagConvert: "Convert",
    audioTagCut: "Trim",
    audioTagMetadata: "Metadata",
    audioTagWaveform: "Waveform",
    pdfTitle: "Images to PDF",
    pdfDesc: "Convert multiple JPG/PNG images into a PDF with ordering, page size, fitting, margins, and output name controls.",
    pdfTagUpload: "Multi-upload",
    pdfTagSort: "Drag sort",
    pdfTagLayout: "Page layout",
    pdfTagDownload: "PDF download",
    resourceTitle: "Resource Management",
    resourceDesc: "Prepare local runtime assets for tools that need extra libraries. Import or download them into browser cache once, then tools load them automatically.",
    resourceModeCache: "Import to browser cache",
    refreshResources: "Refresh check",
    resourcePending: "Pending",
    resourceReady: "Ready",
    resourceMissing: "Missing",
    resourceError: "Check failed",
    resourceDownloading: "Downloading",
    resourceDownload: "Download",
    resourceDownloadToCache: "Download to cache",
    resourceImport: "Import",
    resourceClearCache: "Clear cache",
    resourceDownloadFailed: "Download failed. Copy the download URL and save it manually.",
    resourceImportFailed: "Import failed. Make sure you selected the correct resource file.",
    resourceImportMismatch: "File name mismatch. Choose: ",
    resourceCacheHint: "Browser cache key: ",
    resourceCacheUnsupported: "This browser does not support IndexedDB cache imports.",
    ffmpegCoreJsDesc: "FFmpeg.wasm single-thread core script for future audio and video tools.",
    ffmpegCoreWasmDesc: "FFmpeg.wasm single-thread WebAssembly binary. It is large, so local caching is recommended.",
    pdfLibDesc: "pdf-lib UMD static script for generating PDFs locally in the browser.",
    emptyState: "No matching tools found.",
    footer: "All tools are static pages. Use them by opening the entry file directly or deploying to any static host."
  }
};

const LANGUAGE_STORAGE_KEY = "web-tool-language";
const THEME_STORAGE_KEY = "web-tool-theme";
const RESOURCE_CACHE_DB_NAME = "web-tool-resource-cache";
const RESOURCE_CACHE_STORE_NAME = "resources";
const RESOURCE_CACHE_DB_VERSION = 1;

const RESOURCE_TABLE: ManagedResource[] = [
  {
    id: "ffmpeg-core-js",
    fileName: "ffmpeg-core.js",
    downloadUrl: "https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.12.10/umd/ffmpeg-core.js",
    descriptionKey: "ffmpegCoreJsDesc"
  },
  {
    id: "ffmpeg-core-wasm",
    fileName: "ffmpeg-core.wasm",
    downloadUrl: "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm",
    descriptionKey: "ffmpegCoreWasmDesc"
  },
  {
    id: "pdf-lib-js",
    fileName: "pdf-lib.min.js",
    downloadUrl: "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js",
    descriptionKey: "pdfLibDesc"
  }
];

const searchInput = document.getElementById("toolSearch") as HTMLInputElement | null;
const clearSearchButton = document.getElementById("clearSearch") as HTMLButtonElement | null;
const themeButton = document.getElementById("themeButton") as HTMLButtonElement | null;
const emptyState = document.getElementById("emptyState") as HTMLElement | null;
const refreshResourcesButton = document.getElementById("refreshResources") as HTMLButtonElement | null;
const resourceDirectoryNote = document.getElementById("resourceDirectoryNote") as HTMLElement | null;
const resourceSupportNote = document.getElementById("resourceSupportNote") as HTMLElement | null;
const resourceList = document.getElementById("resourceList") as HTMLElement | null;
const cards = Array.from(document.querySelectorAll<HTMLElement>(".tool-card"));

let currentLanguage: SupportedLanguage = resolveInitialLanguage();
const cacheResourceStates = new Map<string, ResourceState>();
const cacheResourceDownloadProgress = new Map<string, number | null>();

function resolveInitialLanguage(): SupportedLanguage {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved === "zh" || saved === "en") return saved;

  const browserLanguage = (navigator.language || "").toLowerCase();
  if (browserLanguage.startsWith("zh")) return "zh";
  if (browserLanguage.startsWith("en")) return "en";
  return "en";
}

function getText(key: string): string {
  const languagePack = LANGUAGE_TABLE[currentLanguage] as Record<string, string>;
  return languagePack[key] || key;
}

function applyLanguage(language: SupportedLanguage): void {
  currentLanguage = language;
  const table = LANGUAGE_TABLE[language];

  document.documentElement.lang = table.htmlLang;
  document.title = table.documentTitle;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n as I18nKey | undefined;
    if (!key) return;
    element.textContent = table[key];
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((element) => {
    const definitions = (element.dataset.i18nAttr || "").split(";");
    definitions.forEach((definition) => {
      const [attribute, key] = definition.split(":").map((part) => part.trim());
      if (!attribute || !key) return;
      element.setAttribute(attribute, getText(key));
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".language button[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });

  filterTools();
  renderResourceDirectoryNote();
  renderResourceSupport();
  renderResources();
}

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

function getCardSearchText(card: HTMLElement): string {
  const current = card.dataset[currentLanguage === "zh" ? "searchZh" : "searchEn"] || "";
  const fallback = card.dataset[currentLanguage === "zh" ? "searchEn" : "searchZh"] || "";
  return normalizeSearchText(`${current} ${fallback} ${card.textContent || ""}`);
}

function filterTools(): void {
  const query = normalizeSearchText(searchInput?.value || "");
  let visibleCount = 0;

  cards.forEach((card) => {
    const visible = !query || getCardSearchText(card).includes(query);
    card.classList.toggle("hidden", !visible);
    if (visible) visibleCount += 1;
  });

  if (emptyState) {
    emptyState.classList.toggle("show", visibleCount === 0);
  }
  if (clearSearchButton) {
    clearSearchButton.classList.toggle("show", query.length > 0);
  }
}

function getSystemTheme(): "dark" | "light" {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "dark" | "light"): void {
  document.documentElement.dataset.theme = theme;
}

function resolveInitialTheme(): "dark" | "light" {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return getSystemTheme();
}

function supportsResourceCache(): boolean {
  return "indexedDB" in window;
}

function getResourceStatusText(resource: ManagedResource, state: ResourceState): string {
  if (state === "ready") return getText("resourceReady");
  if (state === "missing") return getText("resourceMissing");
  if (state === "error") return getText("resourceError");
  if (state === "downloading") {
    const progress = cacheResourceDownloadProgress.get(resource.id);
    return typeof progress === "number" ? progress + "%" : getText("resourceDownloading");
  }
  return getText("resourcePending");
}

function renderResourceSupport(): void {
  if (!resourceSupportNote) return;
  if (refreshResourcesButton) {
    refreshResourcesButton.disabled = !supportsResourceCache();
  }
  resourceSupportNote.textContent = supportsResourceCache() ? "" : getText("resourceCacheUnsupported");
}

function renderResourceDirectoryNote(): void {
  if (!resourceDirectoryNote) return;
  resourceDirectoryNote.textContent = supportsResourceCache() ? getText("resourceModeCache") : getText("resourceCacheUnsupported");
}

function renderResources(): void {
  if (!resourceList) return;
  resourceList.innerHTML = "";
  RESOURCE_TABLE.forEach((resource) => {
    const state = cacheResourceStates.get(resource.id) || "pending";
    const pathText = getText("resourceCacheHint") + resource.id;
    const disabledAttribute = state === "downloading" ? " disabled" : "";
    const primaryAction = '<button class="resource-download" type="button" data-resource-action="import" data-resource-id="' + resource.id + '"' + disabledAttribute + ">" + getText("resourceImport") + "</button>"
      + '<button class="resource-download" type="button" data-resource-action="download-cache" data-resource-id="' + resource.id + '"' + disabledAttribute + ">" + getText("resourceDownloadToCache") + "</button>";
    const secondaryAction = state === "ready"
      ? '<button class="resource-download" type="button" data-resource-action="clear" data-resource-id="' + resource.id + '">' + getText("resourceClearCache") + "</button>"
      : "";
    const item = document.createElement("article");
    item.className = "resource-item";
    item.innerHTML = [
      "<div>",
      '<div class="resource-name">' + resource.fileName + "</div>",
      '<div class="resource-desc">' + getText(resource.descriptionKey) + "</div>",
      "</div>",
      "<div>",
      '<div class="resource-path">' + pathText + "</div>",
      "</div>",
      "<div>",
      '<div class="resource-status ' + state + '">' + getResourceStatusText(resource, state) + "</div>",
      primaryAction,
      secondaryAction,
      "</div>"
    ].join("");
    item.querySelectorAll<HTMLButtonElement>("[data-resource-id]").forEach((button) => {
      button.addEventListener("click", () => handleResourceAction(resource, button.dataset.resourceAction || ""));
    });
    resourceList.appendChild(item);
  });
}

async function handleResourceAction(resource: ManagedResource, action: string): Promise<void> {
  if (cacheResourceStates.get(resource.id) === "downloading") return;
  if (action === "download-cache") await downloadResourceToCache(resource);
  if (action === "import") await importManagedResource(resource);
  if (action === "clear") await clearCachedResource(resource);
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

function runResourceCacheTransaction<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openResourceCacheDb().then((db) => new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(RESOURCE_CACHE_STORE_NAME, mode);
    const request = callback(transaction.objectStore(RESOURCE_CACHE_STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  }));
}

function getCachedResource(resource: ManagedResource): Promise<any> {
  return runResourceCacheTransaction<any>("readonly", (store) => store.get(resource.id));
}

async function checkCachedResource(resource: ManagedResource): Promise<ResourceState> {
  if (!supportsResourceCache()) return "error";
  try {
    const record = await getCachedResource(resource);
    return record && record.content ? "ready" : "missing";
  } catch (_error) {
    return "error";
  }
}

function chooseResourceFile(resource: ManagedResource): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = resource.fileName.endsWith(".wasm") ? ".wasm,application/wasm" : ".js,text/javascript,application/javascript";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error(getText("resourceImportFailed")));
        return;
      }
      resolve(file);
    };
    input.click();
  });
}

async function importManagedResource(resource: ManagedResource): Promise<void> {
  if (!supportsResourceCache()) {
    alert(getText("resourceCacheUnsupported"));
    return;
  }
  try {
    const file = await chooseResourceFile(resource);
    if (file.name !== resource.fileName) {
      alert(getText("resourceImportMismatch") + resource.fileName);
      return;
    }
    const content = await file.arrayBuffer();
    await runResourceCacheTransaction("readwrite", (store) => store.put({
      id: resource.id,
      fileName: resource.fileName,
      content,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      updatedAt: Date.now()
    }));
    cacheResourceStates.set(resource.id, "ready");
    renderResources();
  } catch (_error) {
    alert(getText("resourceImportFailed"));
  }
}

async function readResponseContentWithProgress(resource: ManagedResource, response: Response): Promise<ArrayBuffer> {
  const total = Number(response.headers.get("content-length")) || 0;
  if (total <= 0) {
    cacheResourceDownloadProgress.set(resource.id, null);
    renderResources();
  }
  if (!response.body) {
    cacheResourceDownloadProgress.set(resource.id, null);
    renderResources();
    return response.arrayBuffer();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let lastPercent = -1;

  while (true) {
    const result = await reader.read();
    if (result.done) break;
    if (!result.value) continue;

    chunks.push(result.value);
    received += result.value.byteLength;

    if (total > 0) {
      const percent = Math.min(99, Math.floor((received / total) * 100));
      if (percent !== lastPercent) {
        lastPercent = percent;
        cacheResourceDownloadProgress.set(resource.id, percent);
        renderResources();
      }
    }
  }

  const content = new Uint8Array(received);
  let offset = 0;
  chunks.forEach((chunk) => {
    content.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return content.buffer;
}

async function downloadResourceToCache(resource: ManagedResource): Promise<void> {
  if (!supportsResourceCache()) {
    alert(getText("resourceCacheUnsupported"));
    return;
  }
  cacheResourceStates.set(resource.id, "downloading");
  cacheResourceDownloadProgress.set(resource.id, 0);
  renderResources();
  try {
    const response = await fetch(resource.downloadUrl);
    if (!response.ok) throw new Error(String(response.status));
    const content = await readResponseContentWithProgress(resource, response);
    await runResourceCacheTransaction("readwrite", (store) => store.put({
      id: resource.id,
      fileName: resource.fileName,
      content,
      mimeType: response.headers.get("content-type") || "application/octet-stream",
      size: content.byteLength,
      updatedAt: Date.now()
    }));
    cacheResourceDownloadProgress.delete(resource.id);
    cacheResourceStates.set(resource.id, "ready");
    renderResources();
  } catch (_error) {
    cacheResourceDownloadProgress.delete(resource.id);
    cacheResourceStates.set(resource.id, await checkCachedResource(resource));
    renderResources();
    alert(getText("resourceDownloadFailed"));
  }
}

async function clearCachedResource(resource: ManagedResource): Promise<void> {
  if (!supportsResourceCache()) return;
  try {
    await runResourceCacheTransaction("readwrite", (store) => store.delete(resource.id));
    cacheResourceStates.set(resource.id, "missing");
    renderResources();
  } catch (_error) {
    cacheResourceStates.set(resource.id, "error");
    renderResources();
  }
}

async function checkResources(): Promise<void> {
  await Promise.all(RESOURCE_TABLE.map(async (resource) => {
    if (cacheResourceStates.get(resource.id) === "downloading") return;
    cacheResourceStates.set(resource.id, await checkCachedResource(resource));
  }));
  renderResources();
}

function refreshResourcePanel(): void {
  renderResourceDirectoryNote();
  renderResourceSupport();
  void checkResources();
  renderResources();
}

document.querySelectorAll<HTMLButtonElement>(".language button[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextLanguage = button.dataset.lang;
    if (nextLanguage !== "zh" && nextLanguage !== "en") return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    applyLanguage(nextLanguage);
  });
});

searchInput?.addEventListener("input", filterTools);

clearSearchButton?.addEventListener("click", () => {
  if (!searchInput) return;
  searchInput.value = "";
  searchInput.focus();
  filterTools();
});

themeButton?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

refreshResourcesButton?.addEventListener("click", async () => {
  await checkResources();
});

window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") return;
  applyTheme(event.matches ? "dark" : "light");
});

applyTheme(resolveInitialTheme());
applyLanguage(currentLanguage);
refreshResourcePanel();
