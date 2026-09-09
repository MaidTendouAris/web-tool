(function () {
  "use strict";
  const preferences = (window as any).WebToolsPreferences;

  (window as any).WebToolsResources.createCard(document.getElementById("resourceCard"), ["pdf-lib-js"]);

  type SupportedLanguage = "zh" | "en";
  type ToolMode = "images" | "merge" | "pages" | "watermark" | "metadata";
  type FitMode = "contain" | "cover";
  type PageSizeMode = "image" | "a4-portrait" | "a4-landscape";

  type ImageEntry = {
    id: string;
    file: File;
    url: string;
    width: number;
    height: number;
  };

  type PdfEntry = {
    id: string;
    file: File;
    bytes: Uint8Array;
    url: string;
    pageCount: number;
  };

  type ManagedPage = {
    id: string;
    sourceId: string;
    sourceName: string;
    pageIndex: number;
    pageCount: number;
    rotation: number;
  };

  const LANGUAGE_STORAGE_KEY = "web-tools-language";
  const THEME_STORAGE_KEY = "web-tools-theme";
  const LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
  const LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
  const PDF_LIB_RESOURCE_ID = "pdf-lib-js";
  const A4_PORTRAIT = [595.28, 841.89];
  const A4_LANDSCAPE = [841.89, 595.28];

  const TEXT = {
    zh: {
      htmlLang: "zh-CN",
      title: "PDF 工具",
      home: "工具集",
      themeToggle: "切换主题",
      lead: "在浏览器本地完成图片转 PDF、合并拆分、页面管理、水印页码和元数据清理。",
      engineMissing: "缺少 PDF 处理资源，请使用页面顶部的本地资源卡片下载或导入。",
      inputTitle: "输入文件",
      outputTitle: "输出",
      settingsTitle: "处理设置",
      noOutput: "暂无输出",
      waitingInput: "等待输入文件",
      imagesTab: "图片转 PDF",
      mergeTab: "合并与拆分",
      pagesTab: "页面管理",
      watermarkTab: "水印与页码",
      metadataTab: "元数据清理",
      imageUploadTitle: "选择或拖放 JPG/PNG 图片",
      imageUploadHint: "支持多选；拖拽列表项可调整 PDF 页面顺序。",
      pdfUploadTitle: "选择或拖放 PDF 文件",
      pdfUploadHint: "多个 PDF 会按列表顺序本地合并；拆分使用列表中的第一个 PDF。",
      pagesUploadTitle: "选择 PDF 以管理页面",
      pagesUploadHint: "导入后可拖拽排序、删除或旋转页面。",
      watermarkUploadTitle: "选择要处理的 PDF",
      watermarkUploadHint: "可添加文字水印、图片水印、页码、页眉和页脚。",
      metadataUploadTitle: "选择 PDF 查看元数据",
      metadataUploadHint: "可查看并清除标题、作者、主题、关键词、创建工具等信息。",
      pageSize: "页面尺寸",
      pageImage: "跟随图片",
      pageA4Portrait: "A4 纵向",
      pageA4Landscape: "A4 横向",
      fitMode: "适配方式",
      fitContain: "等比适应",
      fitCover: "等比填充",
      margin: "边距（pt）",
      outputName: "输出文件名",
      generateImages: "生成 PDF",
      range: "拆分页码范围",
      mergePdf: "合并 PDF",
      splitPdf: "按范围拆分",
      exportPages: "导出页面",
      pagePreviewNote: "缩略图显示页码、来源和旋转状态；所有页面操作都在本地完成。",
      watermarkText: "文字水印",
      watermarkOpacity: "水印透明度",
      imageWatermark: "图片水印",
      pageNumber: "页码",
      pageNumberNone: "不添加",
      pageNumberCenter: "底部居中",
      pageNumberRight: "底部右侧",
      header: "页眉",
      footer: "页脚",
      applyWatermark: "应用水印与页码",
      clearMetadata: "清除元数据并导出",
      needImages: "请先选择 JPG 或 PNG 图片。",
      needPdfs: "请先选择 PDF 文件。",
      needOnePdf: "请先选择一个 PDF 文件。",
      unsupportedImage: "仅支持 JPG/PNG 图片：",
      unsupportedPdf: "仅支持 PDF 文件：",
      loadingFiles: "正在读取文件...",
      ready: "已准备",
      done: "处理完成",
      failed: "处理失败",
      download: "下载 PDF",
      pages: "页",
      size: "大小",
      remove: "删除",
      rotate: "旋转",
      sortHandle: "拖动调整顺序；也可使用方向键移动",
      dropHere: "放置到这里",
      movedToPosition: "已移动到第 {position} 位",
      metadataEmpty: "未读取到元数据。",
      previewFailed: "预览失败，点击重试",
      titleMeta: "标题",
      authorMeta: "作者",
      subjectMeta: "主题",
      keywordsMeta: "关键词",
      creatorMeta: "创建工具",
      producerMeta: "生成工具",
      creationDateMeta: "创建时间",
      modificationDateMeta: "修改时间"
    },
    en: {
      htmlLang: "en",
      title: "PDF Tools",
      home: "Tools",
      themeToggle: "Toggle theme",
      lead: "Work locally with images to PDF, merging, splitting, page management, watermarks, page numbers, and metadata cleanup.",
      engineMissing: "PDF resources are missing. Download or import them using Local resources at the top of this page.",
      inputTitle: "Input Files",
      outputTitle: "Output",
      settingsTitle: "Settings",
      noOutput: "No output yet",
      waitingInput: "Waiting for files",
      imagesTab: "Images to PDF",
      mergeTab: "Merge & Split",
      pagesTab: "Page Manager",
      watermarkTab: "Watermark & Numbers",
      metadataTab: "Metadata Cleanup",
      imageUploadTitle: "Choose or drop JPG/PNG images",
      imageUploadHint: "Multiple images are supported. Drag list items to adjust PDF page order.",
      pdfUploadTitle: "Choose or drop PDF files",
      pdfUploadHint: "PDFs merge in list order. Splitting uses the first PDF in the list.",
      pagesUploadTitle: "Choose PDFs to manage pages",
      pagesUploadHint: "After import, drag to reorder, delete, or rotate pages.",
      watermarkUploadTitle: "Choose a PDF to process",
      watermarkUploadHint: "Add text watermark, image watermark, page numbers, headers, and footers.",
      metadataUploadTitle: "Choose a PDF to inspect metadata",
      metadataUploadHint: "View and clear title, author, subject, keywords, creator, and producer fields.",
      pageSize: "Page size",
      pageImage: "Follow image",
      pageA4Portrait: "A4 portrait",
      pageA4Landscape: "A4 landscape",
      fitMode: "Fit mode",
      fitContain: "Fit proportionally",
      fitCover: "Fill proportionally",
      margin: "Margin (pt)",
      outputName: "Output file name",
      generateImages: "Generate PDF",
      range: "Split page ranges",
      mergePdf: "Merge PDF",
      splitPdf: "Split by range",
      exportPages: "Export pages",
      pagePreviewNote: "Thumbnails show page number, source, and rotation. All page operations run locally.",
      watermarkText: "Text watermark",
      watermarkOpacity: "Watermark opacity",
      imageWatermark: "Image watermark",
      pageNumber: "Page numbers",
      pageNumberNone: "None",
      pageNumberCenter: "Bottom center",
      pageNumberRight: "Bottom right",
      header: "Header",
      footer: "Footer",
      applyWatermark: "Apply watermark & numbers",
      clearMetadata: "Clear metadata and export",
      needImages: "Choose JPG or PNG images first.",
      needPdfs: "Choose PDF files first.",
      needOnePdf: "Choose a PDF file first.",
      unsupportedImage: "Only JPG/PNG images are supported: ",
      unsupportedPdf: "Only PDF files are supported: ",
      loadingFiles: "Reading files...",
      ready: "Ready",
      done: "Done",
      failed: "Failed",
      download: "Download PDF",
      pages: "pages",
      size: "Size",
      remove: "Remove",
      rotate: "Rotate",
      sortHandle: "Drag to reorder; arrow keys also move this item",
      dropHere: "Drop here",
      movedToPosition: "Moved to position {position}",
      metadataEmpty: "No metadata found.",
      previewFailed: "Preview failed. Click to retry.",
      titleMeta: "Title",
      authorMeta: "Author",
      subjectMeta: "Subject",
      keywordsMeta: "Keywords",
      creatorMeta: "Creator",
      producerMeta: "Producer",
      creationDateMeta: "Creation date",
      modificationDateMeta: "Modification date"
    }
  };

  const $ = function (selector): any { return document.querySelector(selector); };
  const $$ = function (selector): any[] { return Array.from(document.querySelectorAll(selector)) as any[]; };
  const sortable = (window as any).WebToolsSortable;

  let currentLanguage = resolveInitialLanguage();
  let currentTool: ToolMode = "images";
  let images: ImageEntry[] = [];
  let mergePdfs: PdfEntry[] = [];
  let managedPdfs = new Map<string, PdfEntry>();
  let managedPages: ManagedPage[] = [];
  let watermarkPdf: PdfEntry | null = null;
  let metadataPdf: PdfEntry | null = null;
  let activePreviewUrl = "";
  let pdfLibPromise: Promise<any> | null = null;
  const pagePreviewCache = new Map<string, string>();
  const previewSources = new Map<string, Promise<any>>();
  const previewTasks = new Map<string, Promise<string>>();
  let previewQueue = Promise.resolve();
  let modalRevision = 0;
  let outputUrl = "";
  let actionRunning = false;
  const visiblePages = new Set<string>();
  const pageObserver = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target as HTMLElement;
      const page = managedPages.find(page => page.id === card.dataset.pageId);
      if (!page) return;
      if (entry.isIntersecting) {
        visiblePages.add(page.id);
        updatePagePreview(card, page, managedPages.indexOf(page));
      } else {
        visiblePages.delete(page.id);
        card.querySelectorAll("embed").forEach(node => node.remove());
        delete (card.querySelector(".thumb") as HTMLElement).dataset.previewKey;
      }
    });
    prunePreviewCache();
  }, { rootMargin: "100px" });
  function rememberSource(id: string, doc: Promise<any>) {
    previewSources.delete(id); previewSources.set(id, doc);
    while (previewSources.size > 2) previewSources.delete(previewSources.keys().next().value);
    return doc;
  }
  function getPreviewSource(entry: PdfEntry, lib: any) {
    const existing = previewSources.get(entry.id);
    if (existing) return rememberSource(entry.id, existing);
    const pending = lib.PDFDocument.load(entry.bytes, { ignoreEncryption: true });
    rememberSource(entry.id, pending);
    pending.catch(() => { if (previewSources.get(entry.id) === pending) previewSources.delete(entry.id); });
    return pending;
  }
  function prunePreviewCache(protectedUrl = "") {
    const valid = new Set(managedPages.map(page => page.id + ":" + page.rotation));
    for (const [key, url] of pagePreviewCache) {
      const pageId = key.slice(0, key.lastIndexOf(":"));
      if (url !== activePreviewUrl && url !== protectedUrl && (!valid.has(key) || (pagePreviewCache.size > 16 && !visiblePages.has(pageId)))) {
        URL.revokeObjectURL(url); pagePreviewCache.delete(key);
      }
    }
    const usedSources = new Set(managedPages.map(page => page.sourceId));
    for (const [id, entry] of managedPdfs) {
      if (!usedSources.has(id)) { URL.revokeObjectURL(entry.url); managedPdfs.delete(id); previewSources.delete(id); }
    }
  }

  function t(key: string): string {
    return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
  }

  function resolveInitialLanguage(): SupportedLanguage {
    return preferences.language();
  }

  function resolveInitialTheme() {
    return preferences.theme();
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
    setText("#inputTitle", "inputTitle");
    setText("#outputTitle", "outputTitle");
    setText("#settingsTitle", "settingsTitle");
    setText("#imageUploadTitle", "imageUploadTitle");
    setText("#imageUploadHint", "imageUploadHint");
    setText("#pdfUploadTitle", "pdfUploadTitle");
    setText("#pdfUploadHint", "pdfUploadHint");
    setText("#pagesUploadTitle", "pagesUploadTitle");
    setText("#pagesUploadHint", "pagesUploadHint");
    setText("#watermarkUploadTitle", "watermarkUploadTitle");
    setText("#watermarkUploadHint", "watermarkUploadHint");
    setText("#metadataUploadTitle", "metadataUploadTitle");
    setText("#metadataUploadHint", "metadataUploadHint");
    setText("#pageSizeLabel", "pageSize");
    setText('#pageSize option[value="image"]', "pageImage");
    setText('#pageSize option[value="a4-portrait"]', "pageA4Portrait");
    setText('#pageSize option[value="a4-landscape"]', "pageA4Landscape");
    setText("#fitModeLabel", "fitMode");
    setText('#fitMode option[value="contain"]', "fitContain");
    setText('#fitMode option[value="cover"]', "fitCover");
    setText("#marginLabel", "margin");
    setText("#imageOutputNameLabel", "outputName");
    setText("#generateImagesButton", "generateImages");
    setText("#rangeLabel", "range");
    setText("#mergeOutputNameLabel", "outputName");
    setText("#mergeButton", "mergePdf");
    setText("#splitButton", "splitPdf");
    setText("#pagesOutputNameLabel", "outputName");
    setText("#exportPagesButton", "exportPages");
    setText("#pagePreviewNote", "pagePreviewNote");
    setText("#watermarkTextLabel", "watermarkText");
    setText("#watermarkOpacityLabel", "watermarkOpacity");
    setText("#pageNumberLabel", "pageNumber");
    setText('#pageNumberMode option[value="none"]', "pageNumberNone");
    setText('#pageNumberMode option[value="bottom-center"]', "pageNumberCenter");
    setText('#pageNumberMode option[value="bottom-right"]', "pageNumberRight");
    setText("#imageWatermarkLabel", "imageWatermark");
    setText("#headerLabel", "header");
    setText("#footerLabel", "footer");
    setText("#watermarkOutputNameLabel", "outputName");
    setText("#applyWatermarkButton", "applyWatermark");
    setText("#metadataOutputNameLabel", "outputName");
    setText("#clearMetadataButton", "clearMetadata");
    const tabKeys: Record<string, string> = { images: "imagesTab", merge: "mergeTab", pages: "pagesTab", watermark: "watermarkTab", metadata: "metadataTab" };
    $$(".tabs button").forEach((button) => {
      button.textContent = t(tabKeys[button.dataset.tool] || "imagesTab");
      button.classList.toggle("active", button.dataset.tool === currentTool);
    });
    $$(".language button[data-lang]").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === language);
    });

    renderAll();
    if (!$("#resultBox").dataset.hasOutput) $("#resultBox").textContent = t("noOutput");
    if (!$("#statusLine").dataset.locked) $("#statusLine").textContent = t("waitingInput");
  }

  function setStatus(key: string) {
    $("#statusLine").dataset.locked = "";
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
    const cleaned = (name || "output.pdf").trim().replace(/[\\/:*?"<>|]+/g, "-");
    return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : cleaned + ".pdf";
  }

  function isSupportedImage(file: File) {
    const type = (file.type || "").toLowerCase();
    const name = file.name.toLowerCase();
    return type === "image/jpeg" || type === "image/png" || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
  }

  function isPdf(file: File) {
    return (file.type || "").toLowerCase() === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  }

  function fileBytes(file: File): Promise<Uint8Array> {
    return file.arrayBuffer().then((buffer) => new Uint8Array(buffer));
  }

  function loadImageDimensions(file: File, url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
      image.onerror = () => reject(new Error(file.name));
      image.src = url;
    });
  }

  function cachedResourceToBlob(record: any): Blob | null {
    if (!record) return null;
    if (record instanceof Blob) return record;
    const content = record.content;
    if (!content) return null;
    const mimeType = record.mimeType || "application/javascript";
    if (content instanceof Blob) return content;
    if (content instanceof ArrayBuffer) return new Blob([content], { type: mimeType });
    if (ArrayBuffer.isView(content)) {
      const view = content as ArrayBufferView;
      const source = new Uint8Array(view.buffer as ArrayBufferLike, view.byteOffset, view.byteLength);
      const buffer = new ArrayBuffer(source.byteLength);
      new Uint8Array(buffer).set(source);
      return new Blob([buffer], { type: mimeType });
    }
    return null;
  }

  async function readCachedResource(id: string): Promise<Blob | null> {
    const record = await (window as any).WebToolsResources.read(id);
    return (window as any).WebToolsResources.available(record) ? cachedResourceToBlob(record) : null;
  }

  async function getPdfLib() {
    const existing = (window as any).PDFLib;
    if (existing) {
      return existing;
    }
    if (pdfLibPromise) return pdfLibPromise;
    pdfLibPromise = (async () => {
      const blob = await readCachedResource(PDF_LIB_RESOURCE_ID);
      if (!blob) throw new Error(t("engineMissing"));
      const url = URL.createObjectURL(blob);
      const script = document.createElement("script");
      try {
        await new Promise<void>((resolve, reject) => {
          script.src = url;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(t("engineMissing")));
          document.head.appendChild(script);
        });
      } finally { URL.revokeObjectURL(url); script.remove(); }
      const lib = (window as any).PDFLib;
      if (!lib) throw new Error(t("engineMissing"));
      return lib;
    })().catch((error) => {
      pdfLibPromise = null;

      throw error;
    });
    return pdfLibPromise;
  }

  async function loadPdfEntry(file: File): Promise<PdfEntry> {
    const lib = await getPdfLib();
    const bytes = await fileBytes(file);
    const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
    const entry = {
      id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
      file, bytes, url: URL.createObjectURL(file), pageCount: doc.getPageCount()
    };
    rememberSource(entry.id, Promise.resolve(doc));
    return entry;
  }

  async function addImages(files: FileList | File[]) {
    setStatus("loadingFiles");
    for (const file of Array.from(files)) {
      if (!isSupportedImage(file)) {
        alert(t("unsupportedImage") + file.name);
        continue;
      }
      const url = URL.createObjectURL(file);
      const size = await loadImageDimensions(file, url);
      images.push({ id: String(Date.now()) + "-" + Math.random().toString(16).slice(2), file, url, width: size.width, height: size.height });
    }
    renderImages();
    setStatus("ready");
  }

  async function addMergePdfs(files: FileList | File[]) {
    setStatus("loadingFiles");
    for (const file of Array.from(files)) {
      if (!isPdf(file)) {
        alert(t("unsupportedPdf") + file.name);
        continue;
      }
      mergePdfs.push(await loadPdfEntry(file));
    }
    renderMergePdfs();
    setStatus("ready");
  }

  async function addManagedPdfs(files: FileList | File[]) {
    setStatus("loadingFiles");
    for (const file of Array.from(files)) {
      if (!isPdf(file)) {
        alert(t("unsupportedPdf") + file.name);
        continue;
      }
      const entry = await loadPdfEntry(file);
      managedPdfs.set(entry.id, entry);
      for (let index = 0; index < entry.pageCount; index++) {
        managedPages.push({
          id: entry.id + "-" + index + "-" + Math.random().toString(16).slice(2),
          sourceId: entry.id,
          sourceName: entry.file.name,
          pageIndex: index,
          pageCount: entry.pageCount,
          rotation: 0
        });
      }
    }
    renderManagedPages();
    setStatus("ready");
  }

  async function setSinglePdf(file: File, target: "watermark" | "metadata") {
    if (!isPdf(file)) {
      alert(t("unsupportedPdf") + file.name);
      return;
    }
    setStatus("loadingFiles");
    const entry = await loadPdfEntry(file);
    if (target === "watermark") {
      if (watermarkPdf) URL.revokeObjectURL(watermarkPdf.url);
      watermarkPdf = entry;
      renderSinglePdf("#watermarkPdfList", entry);
    } else {
      if (metadataPdf) URL.revokeObjectURL(metadataPdf.url);
      metadataPdf = entry;
      await renderMetadata(entry);
    }
    setStatus("ready");
  }

  function fileItem(entry: PdfEntry | ImageEntry, extra: string, onRemove?: () => void) {
    const item = document.createElement("div");
    item.className = "file-item";
    const content = document.createElement("div");
    content.innerHTML = '<div class="file-name"></div><div class="muted"></div>';
    content.querySelector(".file-name")!.textContent = entry.file.name;
    content.querySelector(".muted")!.textContent = extra;
    item.appendChild(content);
    if (onRemove) {
      const button = document.createElement("button");
      button.className = "icon-btn";
      button.type = "button";
      button.textContent = "×";
      button.setAttribute("aria-label", t("remove"));
      button.addEventListener("click", onRemove);
      item.appendChild(button);
    }
    return item;
  }

  function movedLabel(position: number) {
    return t("movedToPosition").replace("{position}", String(position));
  }

  function syncImageOrder(ids: string[]) {
    const byId = new Map(images.map((image) => [image.id, image]));
    images = ids.map((id) => byId.get(id)).filter((image): image is ImageEntry => Boolean(image));
  }

  function syncMergePdfOrder(ids: string[]) {
    const byId = new Map(mergePdfs.map((entry) => [entry.id, entry]));
    mergePdfs = ids.map((id) => byId.get(id)).filter((entry): entry is PdfEntry => Boolean(entry));
  }

  function syncPageOrder(ids: string[]) {
    const byId = new Map(managedPages.map((page) => [page.id, page]));
    managedPages = ids.map((id) => byId.get(id)).filter((page): page is ManagedPage => Boolean(page));
  }

  function updatePageOrderBadges(ids?: string[]) {
    const order = ids || managedPages.map((page) => page.id);
    const positions = new Map(order.map((id, index) => [id, index + 1]));
    Array.from(($("#pageGrid") as HTMLElement).children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      const fallback = child.querySelector(".thumb-fallback") as HTMLElement | null;
      const position = positions.get(child.dataset.sortId || "");
      if (fallback && position) fallback.textContent = String(position);
    });
  }

  function renderImages() {
    const list = $("#imageList");
    list.innerHTML = "";
    images.forEach((image) => {
      const item = fileItem(image, image.width + " × " + image.height + " · " + formatBytes(image.file.size), () => {
        URL.revokeObjectURL(image.url);
        images = images.filter((entry) => entry.id !== image.id);
        renderImages();
      });
      item.classList.add("sortable", "sortable-item");
      item.dataset.sortId = image.id;
      item.insertBefore(sortable.createHandle(t("sortHandle")), item.firstChild);
      list.appendChild(item);
    });
  }

  function renderMergePdfs() {
    const list = $("#mergePdfList");
    list.innerHTML = "";
    mergePdfs.forEach((entry) => {
      const item = fileItem(entry, entry.pageCount + " " + t("pages") + " · " + formatBytes(entry.file.size), () => {
        URL.revokeObjectURL(entry.url); previewSources.delete(entry.id);
      mergePdfs = mergePdfs.filter((item) => item.id !== entry.id);
        renderMergePdfs();
      });
      item.classList.add("sortable", "sortable-item");
      item.dataset.sortId = entry.id;
      item.insertBefore(sortable.createHandle(t("sortHandle")), item.firstChild);
      list.appendChild(item);
    });
  }

  function renderSinglePdf(selector: string, entry: PdfEntry | null) {
    const list = $(selector);
    list.innerHTML = "";
    if (entry) list.appendChild(fileItem(entry, entry.pageCount + " " + t("pages") + " · " + formatBytes(entry.file.size)));
  }

  function getPagePreviewUrl(page: ManagedPage, force = false): Promise<string> {
    const rotation = page.rotation;
    const key = page.id + ":" + rotation;
    const cached = pagePreviewCache.get(key);
    if (cached) {
      pagePreviewCache.delete(key); pagePreviewCache.set(key, cached);
      return Promise.resolve(cached);
    }
    if (previewTasks.has(key)) return previewTasks.get(key)!;
    const task = previewQueue.then(async () => {
      // One generation at a time; yield between pages so input and scrolling remain responsive.
      await new Promise(resolve => setTimeout(resolve, 0));
      if (!managedPages.includes(page) || page.rotation !== rotation || (!force && !visiblePages.has(page.id))) return "";
      const entry = managedPdfs.get(page.sourceId);
      if (!entry) return "";
      const lib = await getPdfLib();
      const source = await getPreviewSource(entry, lib);
      const preview = await lib.PDFDocument.create();
      const [copied] = await preview.copyPages(source, [page.pageIndex]);
      const existing = copied.getRotation ? copied.getRotation().angle : 0;
      copied.setRotation(lib.degrees((existing + rotation) % 360));
      preview.addPage(copied);
      const bytes = await preview.save();
      if (!managedPages.includes(page) || page.rotation !== rotation || (!force && !visiblePages.has(page.id))) return "";
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      pagePreviewCache.set(key, url);
      prunePreviewCache(url);
      return url;
    });
    previewTasks.set(key, task);
    previewQueue = task.then(() => {}, () => {});
    task.finally(() => previewTasks.delete(key)).catch(() => {});
    return task;
  }

  function updatePagePreview(card: HTMLElement, page: ManagedPage, visibleIndex: number) {
    const thumb = card.querySelector(".thumb") as HTMLElement;
    const key = page.id + ":" + page.rotation;
    const fallback = card.querySelector(".thumb-fallback") as HTMLElement;
    if (fallback) fallback.textContent = String(visibleIndex + 1);
    if (!visiblePages.has(page.id)) return;
    if (thumb.dataset.previewKey === key) return;
    thumb.dataset.previewKey = key;
    thumb.querySelectorAll("embed").forEach((node) => node.remove());
    void getPagePreviewUrl(page).then((url) => {
      if (!url || !card.isConnected || !visiblePages.has(page.id) || thumb.dataset.previewKey !== key) {
        if (thumb.dataset.previewKey === key) delete thumb.dataset.previewKey;
        return;
      }
      const embed = document.createElement("embed");
      embed.type = "application/pdf";
      embed.src = url + "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";
      thumb.insertBefore(embed, thumb.firstChild);
    }).catch(() => {
      if (thumb.dataset.previewKey === key) {
        delete thumb.dataset.previewKey;
        thumb.title = t("previewFailed");
      }
    });
  }

  function openPagePreview(page: ManagedPage) {
    const revision = ++modalRevision;
    // A visible thumbnail may already have queued this page. Retry once if it left the viewport.
    void getPagePreviewUrl(page, true).then(url => url || getPagePreviewUrl(page, true)).then((url) => {
      if (!url || revision !== modalRevision || !managedPages.includes(page)) return;
      activePreviewUrl = url;
      const modal = $("#pagePreviewModal") as HTMLElement;
      const embed = $("#pagePreviewEmbed") as HTMLEmbedElement;
      const title = $("#pagePreviewTitle") as HTMLElement;
      title.textContent = page.sourceName + " · p." + (page.pageIndex + 1) + "/" + page.pageCount;
      embed.src = url + "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";
      modal.hidden = false;
    }).catch(error => { if (revision === modalRevision) showError(error); });
  }

  function closePagePreview() {
    modalRevision++;
    const modal = $("#pagePreviewModal") as HTMLElement;
    const embed = $("#pagePreviewEmbed") as HTMLEmbedElement;
    embed.removeAttribute("src");
    activePreviewUrl = "";
    modal.hidden = true;
    prunePreviewCache();
  }

  function createPageCard(page: ManagedPage) {
    const card = document.createElement("div");
    card.className = "page-card sortable-item";
    card.dataset.pageId = page.id;
    card.dataset.sortId = page.id;
    card.innerHTML =
      '<button class="thumb" type="button"></button><div class="file-name"></div><div class="muted"></div><div class="page-actions"></div>';
    card.insertBefore(sortable.createHandle(t("sortHandle")), card.firstChild);
    const thumb = card.querySelector(".thumb") as HTMLElement;
    const fallback = document.createElement("span");
    fallback.className = "thumb-fallback";
    thumb.appendChild(fallback);
    thumb.addEventListener("click", () => openPagePreview(page));
    const actions = card.querySelector(".page-actions") as HTMLElement;
    const rotate = document.createElement("button");
    rotate.className = "btn";
    rotate.type = "button";
    rotate.dataset.pageAction = "rotate";
    rotate.textContent = t("rotate");
    rotate.addEventListener("click", () => {
      page.rotation = (page.rotation + 90) % 360;
      updatePageCard(card, page, managedPages.findIndex((entry) => entry.id === page.id));
      prunePreviewCache();
    });
    const remove = document.createElement("button");
    remove.className = "btn";
    remove.type = "button";
    remove.dataset.pageAction = "remove";
    remove.textContent = t("remove");
    remove.addEventListener("click", () => {
      managedPages = managedPages.filter((entry) => entry.id !== page.id);
      pageObserver?.unobserve(card);
      visiblePages.delete(page.id);
      if (activePreviewUrl && pagePreviewCache.get(page.id + ":" + page.rotation) === activePreviewUrl) closePagePreview();
      card.remove();
      renderManagedPages();
    });
    actions.append(rotate, remove);
    return card;
  }

  function updatePageCard(card: HTMLElement, page: ManagedPage, visibleIndex: number) {
    card.querySelector(".file-name")!.textContent = page.sourceName;
    card.querySelector(".muted")!.textContent = "p." + (page.pageIndex + 1) + "/" + page.pageCount + " · " + page.rotation + "°";
    const handle = card.querySelector(".sort-handle") as HTMLElement;
    handle.setAttribute("aria-label", t("sortHandle"));
    handle.title = t("sortHandle");
    (card.querySelector('[data-page-action="rotate"]') as HTMLButtonElement).textContent = t("rotate");
    (card.querySelector('[data-page-action="remove"]') as HTMLButtonElement).textContent = t("remove");
    updatePagePreview(card, page, visibleIndex);
  }

  function renderManagedPages() {
    const grid = $("#pageGrid") as HTMLElement;
    const existingCards = new Map<string, HTMLElement>();
    Array.from(grid.querySelectorAll(".page-card") as NodeListOf<HTMLElement>).forEach((card) => {
      if (card.dataset.pageId) existingCards.set(card.dataset.pageId, card);
    });
    managedPages.forEach((page, visibleIndex) => {
      const card = existingCards.get(page.id) || createPageCard(page);
      updatePageCard(card, page, visibleIndex);
      grid.appendChild(card);
      if (pageObserver) pageObserver.observe(card);
      else { visiblePages.add(page.id); updatePagePreview(card, page, visibleIndex); }
      existingCards.delete(page.id);
    });
    existingCards.forEach((card) => { pageObserver?.unobserve(card); visiblePages.delete(card.dataset.pageId!); card.remove(); });
    prunePreviewCache();
  }

  async function renderMetadata(entry: PdfEntry) {
    const lib = await getPdfLib();
    const doc = await lib.PDFDocument.load(entry.bytes, { ignoreEncryption: true });
    const rows = [
      ["titleMeta", doc.getTitle && doc.getTitle()],
      ["authorMeta", doc.getAuthor && doc.getAuthor()],
      ["subjectMeta", doc.getSubject && doc.getSubject()],
      ["keywordsMeta", doc.getKeywords && (doc.getKeywords() || []).join(", ")],
      ["creatorMeta", doc.getCreator && doc.getCreator()],
      ["producerMeta", doc.getProducer && doc.getProducer()],
      ["creationDateMeta", doc.getCreationDate && String(doc.getCreationDate() || "")],
      ["modificationDateMeta", doc.getModificationDate && String(doc.getModificationDate() || "")]
    ];
    const list = $("#metadataList");
    list.innerHTML = "";
    renderSinglePdf("#metadataList", entry);
    const details = document.createElement("div");
    details.className = "metadata-grid";
    rows.forEach((row) => {
      const value = row[1] || "";
      const item = document.createElement("div");
      item.className = "metadata-row";
      item.innerHTML = '<strong></strong><div class="muted"></div>';
      item.querySelector("strong")!.textContent = t(row[0]);
      item.querySelector(".muted")!.textContent = value || t("metadataEmpty");
      details.appendChild(item);
    });
    list.appendChild(details);
  }

  function renderAll() {
    renderImages();
    renderMergePdfs();
    renderManagedPages();
    renderSinglePdf("#watermarkPdfList", watermarkPdf);
    if (metadataPdf) void renderMetadata(metadataPdf);
  }

  function pageSizeForImage(image: ImageEntry, mode: PageSizeMode) {
    if (mode === "a4-portrait") return A4_PORTRAIT;
    if (mode === "a4-landscape") return A4_LANDSCAPE;
    return [image.width, image.height];
  }

  function drawRectForFit(pageWidth: number, pageHeight: number, mediaWidth: number, mediaHeight: number, margin: number, fit: FitMode) {
    const availableWidth = Math.max(1, pageWidth - margin * 2);
    const availableHeight = Math.max(1, pageHeight - margin * 2);
    const scale = fit === "cover"
      ? Math.max(availableWidth / mediaWidth, availableHeight / mediaHeight)
      : Math.min(availableWidth / mediaWidth, availableHeight / mediaHeight);
    const width = mediaWidth * scale;
    const height = mediaHeight * scale;
    return { x: (pageWidth - width) / 2, y: (pageHeight - height) / 2, width, height };
  }

  async function generateImagesPdf() {
    if (!images.length) throw new Error(t("needImages"));
    const lib = await getPdfLib();
    const doc = await lib.PDFDocument.create();
    const margin = Math.max(0, Number($("#marginInput").value) || 0);
    const pageSize = $("#pageSize").value as PageSizeMode;
    const fit = $("#fitMode").value as FitMode;
    for (const image of images) {
      const bytes = await fileBytes(image.file);
      const lowerName = image.file.name.toLowerCase();
      const embedded = lowerName.endsWith(".png") || image.file.type === "image/png"
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);
      const size = pageSizeForImage(image, pageSize);
      const page = doc.addPage(size);
      const rect = drawRectForFit(size[0], size[1], embedded.width, embedded.height, margin, fit);
      page.drawImage(embedded, rect);
    }
    await downloadDoc(doc, $("#imageOutputName").value);
  }

  async function mergePdfsAction() {
    if (!mergePdfs.length) throw new Error(t("needPdfs"));
    const lib = await getPdfLib();
    const output = await lib.PDFDocument.create();
    for (const entry of mergePdfs) {
      const source = await lib.PDFDocument.load(entry.bytes, { ignoreEncryption: true });
      const pages = await output.copyPages(source, source.getPageIndices());
      pages.forEach((page) => output.addPage(page));
    }
    await downloadDoc(output, $("#mergeOutputName").value);
  }

  function parseRanges(text: string, max: number) {
    const indices = new Set<number>();
    (text || "").split(",").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      const match = /^(\d+)(?:-(\d+))?$/.exec(trimmed);
      if (!match) return;
      const start = Math.max(1, Number(match[1]));
      const end = Math.min(max, Number(match[2] || match[1]));
      for (let page = Math.min(start, end); page <= Math.max(start, end); page++) indices.add(page - 1);
    });
    return Array.from(indices).filter((index) => index >= 0 && index < max).sort((a, b) => a - b);
  }

  async function splitPdfAction() {
    if (!mergePdfs.length) throw new Error(t("needOnePdf"));
    const lib = await getPdfLib();
    const source = await lib.PDFDocument.load(mergePdfs[0].bytes, { ignoreEncryption: true });
    const ranges = parseRanges($("#splitRangeInput").value, source.getPageCount());
    if (!ranges.length) throw new Error(t("range"));
    const output = await lib.PDFDocument.create();
    const pages = await output.copyPages(source, ranges);
    pages.forEach((page) => output.addPage(page));
    await downloadDoc(output, $("#mergeOutputName").value || "split.pdf");
  }

  async function exportManagedPages() {
    if (!managedPages.length) throw new Error(t("needPdfs"));
    const lib = await getPdfLib();
    const output = await lib.PDFDocument.create();
    const docCache = new Map<string, any>();
    for (const page of managedPages) {
      let source = docCache.get(page.sourceId);
      if (!source) {
        const entry = managedPdfs.get(page.sourceId);
        if (!entry) continue;
        source = await lib.PDFDocument.load(entry.bytes, { ignoreEncryption: true });
        docCache.set(page.sourceId, source);
      }
      const [copied] = await output.copyPages(source, [page.pageIndex]);
      const existing = copied.getRotation ? copied.getRotation().angle : 0;
      copied.setRotation(lib.degrees((existing + page.rotation) % 360));
      output.addPage(copied);
    }
    await downloadDoc(output, $("#pagesOutputName").value);
  }

  async function applyWatermark() {
    if (!watermarkPdf) throw new Error(t("needOnePdf"));
    const lib = await getPdfLib();
    const doc = await lib.PDFDocument.load(watermarkPdf.bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(lib.StandardFonts.Helvetica);
    const text = ($("#watermarkText").value || "").trim();
    const header = ($("#headerText").value || "").trim();
    const footer = ($("#footerText").value || "").trim();
    const opacity = Math.max(0.05, Math.min(1, Number($("#watermarkOpacity").value) || 0.18));
    const pageNumberMode = $("#pageNumberMode").value;
    let imageWatermark: any = null;
    const imageFile = $("#watermarkImageInput").files && $("#watermarkImageInput").files[0];
    if (imageFile && isSupportedImage(imageFile)) {
      const bytes = await fileBytes(imageFile);
      imageWatermark = imageFile.type === "image/png" || imageFile.name.toLowerCase().endsWith(".png")
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);
    }
    const pages = doc.getPages();
    pages.forEach((page, index) => {
      const size = page.getSize();
      if (text) {
        page.drawText(text, {
          x: size.width * 0.18,
          y: size.height * 0.48,
          size: Math.max(28, Math.min(size.width, size.height) * 0.08),
          font,
          color: lib.rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: lib.degrees(-35)
        });
      }
      if (imageWatermark) {
        const width = size.width * 0.32;
        const height = width * (imageWatermark.height / imageWatermark.width);
        page.drawImage(imageWatermark, { x: (size.width - width) / 2, y: (size.height - height) / 2, width, height, opacity });
      }
      if (header) page.drawText(header, { x: 36, y: size.height - 28, size: 10, font, color: lib.rgb(0.25, 0.25, 0.25) });
      if (footer) page.drawText(footer, { x: 36, y: 18, size: 10, font, color: lib.rgb(0.25, 0.25, 0.25) });
      if (pageNumberMode !== "none") {
        const label = String(index + 1) + " / " + pages.length;
        const x = pageNumberMode === "bottom-right" ? size.width - 72 : (size.width - font.widthOfTextAtSize(label, 10)) / 2;
        page.drawText(label, { x, y: 18, size: 10, font, color: lib.rgb(0.25, 0.25, 0.25) });
      }
    });
    await downloadDoc(doc, $("#watermarkOutputName").value);
  }

  async function clearMetadata() {
    if (!metadataPdf) throw new Error(t("needOnePdf"));
    const lib = await getPdfLib();
    const doc = await lib.PDFDocument.load(metadataPdf.bytes, { ignoreEncryption: true });
    if (doc.setTitle) doc.setTitle("");
    if (doc.setAuthor) doc.setAuthor("");
    if (doc.setSubject) doc.setSubject("");
    if (doc.setKeywords) doc.setKeywords([]);
    if (doc.setCreator) doc.setCreator("");
    if (doc.setProducer) doc.setProducer("");
    const now = new Date(0);
    if (doc.setCreationDate) doc.setCreationDate(now);
    if (doc.setModificationDate) doc.setModificationDate(now);
    await downloadDoc(doc, $("#metadataOutputName").value);
  }

  async function downloadDoc(doc: any, name: string) {
    const bytes = await doc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    const url = outputUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = normalizePdfName(name);
    link.textContent = t("download") + " · " + formatBytes(blob.size);
    $("#resultBox").dataset.hasOutput = "true";
    $("#resultBox").innerHTML = "";
    $("#resultBox").appendChild(link);
    (window as any).WebToolsControls.addOutputClear($("#resultBox"), () => {
      URL.revokeObjectURL(outputUrl); outputUrl = "";
      $("#resultBox").textContent = t("noOutput"); $("#resultBox").dataset.hasOutput = "";
    });
    setStatus("done");
  }

  function showError(error: unknown) {
    setStatus("failed");
    $("#statusLine").textContent = (window as any).WebToolsControls.describeError(error);
  }
  async function run(action: () => Promise<void>) {
    if (actionRunning) return;
    actionRunning = true;
    const controls = Array.from(document.querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLSelectElement>("main input, main button, main select"));
    const disabled = controls.map(control => control.disabled);
    controls.forEach(control => control.disabled = true);
    try {
      setStatus("loadingFiles");
      await action();
    } catch (error) { showError(error); }
    finally {
      actionRunning = false;
      controls.forEach((control, index) => control.disabled = disabled[index]);
    }
  }

  function setTool(tool: ToolMode) {
    currentTool = tool;
    $$(".tabs button").forEach((button) => button.classList.toggle("active", button.dataset.tool === tool));
    $$(".tool-panel").forEach((panel) => {
      const id = panel.id || "";
      panel.classList.toggle("active", id === "panel-" + tool || id === "settings-" + tool);
    });
  }

  function wireDrop(label: HTMLElement, input: HTMLInputElement, handler: (files: FileList | File[]) => void | Promise<void>) {
    label.addEventListener("dragover", (event) => {
      event.preventDefault();
      label.classList.add("dragover");
    });
    label.addEventListener("dragleave", () => label.classList.remove("dragover"));
    label.addEventListener("drop", (event) => {
      event.preventDefault();
      label.classList.remove("dragover");
      if (event.dataTransfer?.files && !actionRunning) void run(async () => { await handler(Array.from(event.dataTransfer.files)); });
    });
    input.addEventListener("change", () => {
      const files = Array.from(input.files || []);
      if (files.length) void run(async () => { await handler(files); });
      input.value = "";
    });
  }

  wireDrop($("#imageUpload"), $("#imageInput"), addImages);
  wireDrop($("#pdfUploadMerge"), $("#mergePdfInput"), addMergePdfs);
  wireDrop($("#pdfUploadPages"), $("#pagesPdfInput"), addManagedPdfs);
  wireDrop($("#pdfUploadWatermark"), $("#watermarkPdfInput"), (files) => {
    const file = Array.from(files)[0];
    if (file) return setSinglePdf(file, "watermark");
  });
  wireDrop($("#pdfUploadMetadata"), $("#metadataPdfInput"), (files) => {
    const file = Array.from(files)[0];
    if (file) return setSinglePdf(file, "metadata");
  });
  sortable.bind({
    container: $("#imageList"),
    itemSelector: ".file-item.sortable",
    axis: "vertical",
    getDropLabel: () => t("dropHere"),
    getMovedLabel: movedLabel,
    onOrderChange: syncImageOrder
  });
  sortable.bind({
    container: $("#pageGrid"),
    itemSelector: ".page-card",
    axis: "auto",
    getDropLabel: () => t("dropHere"),
    getMovedLabel: movedLabel,
    onOrderChange: syncPageOrder,
    onOrderPreview: updatePageOrderBadges
  });
  sortable.bind({
    container: $("#mergePdfList"),
    itemSelector: ".file-item.sortable",
    axis: "vertical",
    getDropLabel: () => t("dropHere"),
    getMovedLabel: movedLabel,
    onOrderChange: syncMergePdfOrder
  });


  $("#generateImagesButton").addEventListener("click", () => run(generateImagesPdf));
  $("#mergeButton").addEventListener("click", () => run(mergePdfsAction));
  $("#splitButton").addEventListener("click", () => run(splitPdfAction));
  $("#exportPagesButton").addEventListener("click", () => run(exportManagedPages));
  $("#applyWatermarkButton").addEventListener("click", () => run(applyWatermark));
  $("#clearMetadataButton").addEventListener("click", () => run(clearMetadata));
  $("#pagePreviewClose").addEventListener("click", closePagePreview);
  $("#pagePreviewModal").addEventListener("click", (event) => {
    if (event.target === $("#pagePreviewModal")) closePagePreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !($("#pagePreviewModal") as HTMLElement).hidden) closePagePreview();
  });

  $$(".tabs button").forEach((button) => {
    button.addEventListener("click", () => setTool(button.dataset.tool as ToolMode));
  });
  $$(".language button[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.lang;
      if (next !== "zh" && next !== "en") return;
      preferences.setItem(LANGUAGE_STORAGE_KEY, next);
      applyLanguage(next);
    });
  });
  $("#themeButton").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    preferences.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    const saved = preferences.getItem(THEME_STORAGE_KEY) || preferences.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return;
    applyTheme(event.matches ? "dark" : "light");
  });

  preferences.subscribe(() => { applyLanguage(resolveInitialLanguage()); applyTheme(resolveInitialTheme()); });
  applyTheme(resolveInitialTheme());
  applyLanguage(currentLanguage);
  setTool("images");
})();
