"use strict";
const preferences = window.WebToolsPreferences;
const LANGUAGE_TABLE = {
    zh: {
        htmlLang: "zh-CN",
        documentTitle: "web-tools",
        eyebrow: "Browser only",
        title: "web-tools",
        lead: "一个只依赖浏览器的本地工具集合。打开 HTML 文件即可使用，图片和数据都留在当前浏览器里处理。",
        statusLabel: "项目特点",
        statusServerless: "无服务端",
        statusBuildless: "无构建步骤",
        statusOffline: "离线可用",
        searchPlaceholder: "搜索工具、功能或格式，例如：压缩、Mbps、WebP",
        searchLabel: "搜索工具",
        clearSearch: "清空搜索",
        themeToggle: "切换主题",
        feedback: "问题反馈",
        toolListLabel: "工具列表",
        open: "打开",
        passwordTitle: "密码生成器",
        passwordDesc: "使用浏览器本地随机数生成密码和密码短语，支持长度、字符类型、批量生成、强度提示和一键复制。",
        passwordTagLength: "长度设置",
        passwordTagOptions: "字符选项",
        passwordTagPassphrase: "密码短语",
        passwordTagCopy: "一键复制",
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
        pdfTitle: "PDF 工具",
        pdfDesc: "本地处理 PDF：图片转 PDF、合并拆分、页面排序删除旋转、水印页码和元数据清理。",
        pdfTagUpload: "图片转 PDF",
        pdfTagSort: "合并拆分",
        pdfTagLayout: "页面管理",
        pdfTagDownload: "水印页码",
        resourceTitle: "资源管理",
        resourceDesc: "为需要额外运行库的工具准备本地资源。首次导入或下载到浏览器缓存后，工具会自动从缓存加载。",
        resourceModeCache: "导入到浏览器缓存",
        refreshResources: "刷新检查",
        resourcePending: "待检查",
        resourceReady: "已就绪",
        resourceMissing: "缺失",
        resourceError: "检查失败",
        resourceChecking: "检查中",
        resourceDownloading: "下载中",
        resourceDownload: "下载",
        resourceManualDownload: "手动下载",
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
        documentTitle: "web-tools",
        eyebrow: "Browser only",
        title: "web-tools",
        lead: "A local collection of browser-only tools. Open the HTML files directly; images and data stay inside your current browser.",
        statusLabel: "Project traits",
        statusServerless: "No server",
        statusBuildless: "No build step",
        statusOffline: "Works offline",
        searchPlaceholder: "Search tools, features, or formats, e.g. compress, Mbps, WebP",
        searchLabel: "Search tools",
        clearSearch: "Clear search",
        themeToggle: "Toggle theme",
        feedback: "Feedback",
        toolListLabel: "Tool list",
        open: "Open",
        passwordTitle: "Password Generator",
        passwordDesc: "Generate passwords and passphrases locally in the browser, with length controls, character options, batch output, strength hints, and copy actions.",
        passwordTagLength: "Length",
        passwordTagOptions: "Character options",
        passwordTagPassphrase: "Passphrase",
        passwordTagCopy: "Copy",
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
        pdfTitle: "PDF Tools",
        pdfDesc: "Work with PDFs locally: images to PDF, merge, split, reorder, delete, rotate, watermark, number pages, and clean metadata.",
        pdfTagUpload: "Images to PDF",
        pdfTagSort: "Merge & split",
        pdfTagLayout: "Page manager",
        pdfTagDownload: "Watermarks",
        resourceTitle: "Resource Management",
        resourceDesc: "Prepare local runtime assets for tools that need extra libraries. Import or download them into browser cache once, then tools load them automatically.",
        resourceModeCache: "Import to browser cache",
        refreshResources: "Refresh check",
        resourcePending: "Pending",
        resourceReady: "Ready",
        resourceMissing: "Missing",
        resourceError: "Check failed",
        resourceChecking: "Checking",
        resourceDownloading: "Downloading",
        resourceDownload: "Download",
        resourceManualDownload: "Manual download",
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
const LANGUAGE_STORAGE_KEY = "web-tools-language";
const THEME_STORAGE_KEY = "web-tools-theme";
const LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
const LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
const RESOURCE_TABLE = window.WebToolsResources.definitions;
const searchInput = document.getElementById("toolSearch");
const clearSearchButton = document.getElementById("clearSearch");
const themeButton = document.getElementById("themeButton");
const emptyState = document.getElementById("emptyState");
const refreshResourcesButton = document.getElementById("refreshResources");
const resourceDirectoryNote = document.getElementById("resourceDirectoryNote");
const resourceSupportNote = document.getElementById("resourceSupportNote");
const resourceList = document.getElementById("resourceList");
const cards = Array.from(document.querySelectorAll(".tool-card"));
let currentLanguage = resolveInitialLanguage();
const cacheResourceStates = new Map();
const cacheResourceDownloadProgress = new Map();
function resolveInitialLanguage() {
    return preferences.language();
}
function getText(key) {
    const languagePack = LANGUAGE_TABLE[currentLanguage];
    return languagePack[key] || key;
}
function applyLanguage(language) {
    currentLanguage = language;
    const table = LANGUAGE_TABLE[language];
    document.documentElement.lang = table.htmlLang;
    document.title = table.documentTitle;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (!key)
            return;
        element.textContent = table[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
        const definitions = (element.dataset.i18nAttr || "").split(";");
        definitions.forEach((definition) => {
            const [attribute, key] = definition.split(":").map((part) => part.trim());
            if (!attribute || !key)
                return;
            element.setAttribute(attribute, getText(key));
        });
    });
    document.querySelectorAll(".language button[data-lang]").forEach((button) => {
        button.classList.toggle("active", button.dataset.lang === language);
    });
    filterTools();
    renderResourceDirectoryNote();
    renderResourceSupport();
    renderResources();
}
function normalizeSearchText(value) {
    return value.trim().toLowerCase();
}
function getCardSearchText(card) {
    const current = card.dataset[currentLanguage === "zh" ? "searchZh" : "searchEn"] || "";
    const fallback = card.dataset[currentLanguage === "zh" ? "searchEn" : "searchZh"] || "";
    return normalizeSearchText(`${current} ${fallback} ${card.textContent || ""}`);
}
function filterTools() {
    const query = normalizeSearchText(searchInput?.value || "");
    let visibleCount = 0;
    cards.forEach((card) => {
        const visible = !query || getCardSearchText(card).includes(query);
        card.classList.toggle("hidden", !visible);
        if (visible)
            visibleCount += 1;
    });
    if (emptyState) {
        emptyState.classList.toggle("show", visibleCount === 0);
    }
    if (clearSearchButton) {
        clearSearchButton.classList.toggle("show", query.length > 0);
    }
}
function getSystemTheme() {
    return preferences.systemTheme();
}
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}
function resolveInitialTheme() {
    return preferences.theme();
}
function supportsResourceCache() {
    return "indexedDB" in window;
}
function getResourceStatusText(resource, state) {
    if (state === "ready")
        return getText("resourceReady");
    if (state === "missing")
        return getText("resourceMissing");
    if (state === "error")
        return getText("resourceError");
    if (state === "checking")
        return getText("resourceChecking");
    if (state === "downloading") {
        const progress = cacheResourceDownloadProgress.get(resource.id);
        return typeof progress === "number" ? progress + "%" : getText("resourceDownloading");
    }
    return getText("resourcePending");
}
function renderResourceSupport() {
    if (!resourceSupportNote)
        return;
    if (refreshResourcesButton) {
        refreshResourcesButton.disabled = !supportsResourceCache();
    }
    resourceSupportNote.textContent = supportsResourceCache() ? "" : getText("resourceCacheUnsupported");
}
function renderResourceDirectoryNote() {
    if (!resourceDirectoryNote)
        return;
    resourceDirectoryNote.textContent = supportsResourceCache() ? getText("resourceModeCache") : getText("resourceCacheUnsupported");
}
function renderResources() {
    if (!resourceList)
        return;
    resourceList.innerHTML = "";
    RESOURCE_TABLE.forEach((resource) => {
        const state = cacheResourceStates.get(resource.id) || "pending";
        const disabledAttribute = state === "downloading" || state === "checking" ? " disabled" : "";
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
            '<div class="resource-path"><span>' + getText("resourceManualDownload") + ":</span> "
                + '<a href="' + resource.downloadUrl + '" target="_blank" rel="noopener noreferrer">' + resource.fileName + "</a></div>",
            "</div>",
            "<div>",
            '<div class="resource-status ' + state + '">' + getResourceStatusText(resource, state) + "</div>",
            primaryAction,
            secondaryAction,
            "</div>"
        ].join("");
        item.querySelectorAll("[data-resource-id]").forEach((button) => {
            button.addEventListener("click", () => handleResourceAction(resource, button.dataset.resourceAction || ""));
        });
        resourceList.appendChild(item);
    });
}
async function handleResourceAction(resource, action) {
    if (cacheResourceStates.get(resource.id) === "downloading")
        return;
    if (action === "download-cache")
        await downloadResourceToCache(resource);
    if (action === "import")
        await importManagedResource(resource);
    if (action === "clear")
        await clearCachedResource(resource);
}
function runResourceCacheTransaction(mode, callback) {
    return window.WebToolsResources.transaction(mode, callback);
}
function getCachedResource(resource) {
    return window.WebToolsResources.read(resource.id);
}
async function checkCachedResource(resource) {
    if (!supportsResourceCache())
        return "missing";
    try {
        const record = await getCachedResource(resource);
        return window.WebToolsResources.available(record) ? "ready" : "missing";
    }
    catch (_error) {
        return "missing";
    }
}
function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}
function chooseResourceFile(resource) {
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
async function importManagedResource(resource) {
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
        await window.WebToolsResources.put(resource.id, content, file.type || "application/octet-stream");
        cacheResourceStates.set(resource.id, "ready");
        renderResources();
    }
    catch (_error) {
        alert(getText("resourceImportFailed"));
    }
}
async function downloadResourceToCache(resource) {
    if (!supportsResourceCache()) {
        alert(getText("resourceCacheUnsupported"));
        return;
    }
    cacheResourceStates.set(resource.id, "downloading");
    cacheResourceDownloadProgress.set(resource.id, 0);
    renderResources();
    try {
        await window.WebToolsResources.download(resource.id, (percent) => {
            cacheResourceDownloadProgress.set(resource.id, percent);
            renderResources();
        });
        cacheResourceDownloadProgress.delete(resource.id);
        cacheResourceStates.set(resource.id, "ready");
        renderResources();
    }
    catch (_error) {
        cacheResourceDownloadProgress.delete(resource.id);
        cacheResourceStates.set(resource.id, await checkCachedResource(resource));
        renderResources();
        alert(getText("resourceDownloadFailed"));
    }
}
async function clearCachedResource(resource) {
    if (!supportsResourceCache())
        return;
    try {
        await runResourceCacheTransaction("readwrite", (store) => store.delete(resource.id));
        cacheResourceStates.set(resource.id, "missing");
        renderResources();
    }
    catch (_error) {
        cacheResourceStates.set(resource.id, "error");
        renderResources();
    }
}
async function checkResources(showChecking = false) {
    const resourcesToCheck = RESOURCE_TABLE.filter((resource) => cacheResourceStates.get(resource.id) !== "downloading");
    if (showChecking) {
        resourcesToCheck.forEach((resource) => cacheResourceStates.set(resource.id, "checking"));
        renderResources();
    }
    const checkTask = Promise.all(resourcesToCheck.map(async (resource) => ({
        resource,
        state: await checkCachedResource(resource)
    })));
    const results = showChecking
        ? await Promise.all([checkTask, delay(600)]).then(([states]) => states)
        : await checkTask;
    results.forEach(({ resource, state }) => {
        cacheResourceStates.set(resource.id, state);
    });
    renderResources();
}
function refreshResourcePanel() {
    renderResourceDirectoryNote();
    renderResourceSupport();
    void checkResources();
    renderResources();
}
document.querySelectorAll(".language button[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
        const nextLanguage = button.dataset.lang;
        if (nextLanguage !== "zh" && nextLanguage !== "en")
            return;
        preferences.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
        applyLanguage(nextLanguage);
    });
});
searchInput?.addEventListener("input", filterTools);
clearSearchButton?.addEventListener("click", () => {
    if (!searchInput)
        return;
    searchInput.value = "";
    searchInput.focus();
    filterTools();
});
themeButton?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    preferences.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
});
refreshResourcesButton?.addEventListener("click", async () => {
    refreshResourcesButton.disabled = true;
    try {
        await checkResources(true);
    }
    finally {
        refreshResourcesButton.disabled = !supportsResourceCache();
    }
});
window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    const saved = preferences.getItem(THEME_STORAGE_KEY) || preferences.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light")
        return;
    applyTheme(event.matches ? "dark" : "light");
});
preferences.subscribe(() => { applyLanguage(resolveInitialLanguage()); applyTheme(resolveInitialTheme()); });
applyTheme(resolveInitialTheme());
applyLanguage(currentLanguage);
refreshResourcePanel();
window.addEventListener("web-tools-resources-changed", () => { void checkResources(); });
