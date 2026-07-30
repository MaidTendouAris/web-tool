"use strict";
(function () {
    "use strict";
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
            title: "PDF 工具",
            home: "工具集",
            themeToggle: "切换主题",
            lead: "在浏览器本地完成图片转 PDF、合并拆分、页面管理、水印页码和元数据清理。",
            engineIdle: "尚未加载",
            engineLoading: "正在加载本地 pdf-lib...",
            engineReady: "已加载，可开始处理",
            engineLoadButton: "加载本地库",
            engineMissing: "未找到 pdf-lib.min.js，请先在入口页资源管理中导入或下载到浏览器缓存。",
            inputTitle: "输入文件",
            outputTitle: "输出",
            settingsTitle: "处理设置",
            noOutput: "暂无输出",
            waitingInput: "等待输入文件",
            resourceWarning: "需要先在入口页资源管理中导入或下载 pdf-lib.min.js 到浏览器缓存。进入本页后仍需点击“加载本地库”或在处理时自动加载。",
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
            engineIdle: "Not loaded",
            engineLoading: "Loading local pdf-lib...",
            engineReady: "Loaded and ready",
            engineLoadButton: "Load Local Library",
            engineMissing: "pdf-lib.min.js was not found. Import or download it into browser cache from Resource Management first.",
            inputTitle: "Input Files",
            outputTitle: "Output",
            settingsTitle: "Settings",
            noOutput: "No output yet",
            waitingInput: "Waiting for files",
            resourceWarning: "Import or download pdf-lib.min.js into browser cache from Resource Management first. This page still loads the local library before processing.",
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
    const $ = function (selector) { return document.querySelector(selector); };
    const $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
    let currentLanguage = resolveInitialLanguage();
    let currentTool = "images";
    let images = [];
    let mergePdfs = [];
    let managedPdfs = new Map();
    let managedPages = [];
    let watermarkPdf = null;
    let metadataPdf = null;
    let sortSession = null;
    let activePreviewUrl = "";
    let pdfLibPromise = null;
    let pdfLibReady = false;
    const pagePreviewCache = new Map();
    function t(key) {
        return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
    }
    function resolveInitialLanguage() {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
        if (saved === "zh" || saved === "en")
            return saved;
        const browserLanguage = (navigator.language || "").toLowerCase();
        if (browserLanguage.startsWith("zh"))
            return "zh";
        if (browserLanguage.startsWith("en"))
            return "en";
        return "en";
    }
    function resolveInitialTheme() {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return saved;
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
    }
    function setText(selector, key) {
        const element = $(selector);
        if (element)
            element.textContent = t(key);
    }
    function applyLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = t("htmlLang");
        document.title = t("title");
        setText("#homeLink", "home");
        setText("#pageTitle", "title");
        setText("#pageLead", "lead");
        setText("#loadPdfLibButton", "engineLoadButton");
        setText("#inputTitle", "inputTitle");
        setText("#outputTitle", "outputTitle");
        setText("#settingsTitle", "settingsTitle");
        setText("#resourceWarning", "resourceWarning");
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
        const tabKeys = { images: "imagesTab", merge: "mergeTab", pages: "pagesTab", watermark: "watermarkTab", metadata: "metadataTab" };
        $$(".tabs button").forEach((button) => {
            button.textContent = t(tabKeys[button.dataset.tool] || "imagesTab");
            button.classList.toggle("active", button.dataset.tool === currentTool);
        });
        $$(".language button[data-lang]").forEach((button) => {
            button.classList.toggle("active", button.dataset.lang === language);
        });
        updateEngineStatus();
        renderAll();
        if (!$("#resultBox").dataset.hasOutput)
            $("#resultBox").textContent = t("noOutput");
        if (!$("#statusLine").dataset.locked)
            $("#statusLine").textContent = t("waitingInput");
    }
    function updateEngineStatus() {
        if (pdfLibReady)
            $("#engineStatus").textContent = t("engineReady");
        else if (pdfLibPromise)
            $("#engineStatus").textContent = t("engineLoading");
        else
            $("#engineStatus").textContent = t("engineIdle");
    }
    function setStatus(key) {
        $("#statusLine").dataset.locked = "";
        $("#statusLine").textContent = t(key);
    }
    function formatBytes(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0)
            return "0 B";
        const units = ["B", "KB", "MB", "GB"];
        let value = bytes;
        let index = 0;
        while (value >= 1024 && index < units.length - 1) {
            value /= 1024;
            index += 1;
        }
        return (index === 0 ? value.toFixed(0) : value.toFixed(2)) + " " + units[index];
    }
    function normalizePdfName(name) {
        const cleaned = (name || "output.pdf").trim().replace(/[\\/:*?"<>|]+/g, "-");
        return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : cleaned + ".pdf";
    }
    function isSupportedImage(file) {
        const type = (file.type || "").toLowerCase();
        const name = file.name.toLowerCase();
        return type === "image/jpeg" || type === "image/png" || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
    }
    function isPdf(file) {
        return (file.type || "").toLowerCase() === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    }
    function fileBytes(file) {
        return file.arrayBuffer().then((buffer) => new Uint8Array(buffer));
    }
    function loadImageDimensions(file, url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
            image.onerror = () => reject(new Error(file.name));
            image.src = url;
        });
    }
    function openResourceDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(RESOURCE_CACHE_DB_NAME, RESOURCE_CACHE_DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(RESOURCE_CACHE_STORE_NAME))
                    db.createObjectStore(RESOURCE_CACHE_STORE_NAME);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    function cachedResourceToBlob(record) {
        if (!record)
            return null;
        if (record instanceof Blob)
            return record;
        const content = record.content;
        if (!content)
            return null;
        const mimeType = record.mimeType || "application/javascript";
        if (content instanceof Blob)
            return content;
        if (content instanceof ArrayBuffer)
            return new Blob([content], { type: mimeType });
        if (ArrayBuffer.isView(content)) {
            const view = content;
            const source = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
            const buffer = new ArrayBuffer(source.byteLength);
            new Uint8Array(buffer).set(source);
            return new Blob([buffer], { type: mimeType });
        }
        return null;
    }
    async function readCachedResource(id) {
        const db = await openResourceDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(RESOURCE_CACHE_STORE_NAME, "readonly");
            const request = tx.objectStore(RESOURCE_CACHE_STORE_NAME).get(id);
            request.onsuccess = () => resolve(cachedResourceToBlob(request.result));
            request.onerror = () => reject(request.error);
            tx.oncomplete = () => db.close();
            tx.onerror = () => db.close();
        });
    }
    async function getPdfLib() {
        const existing = window.PDFLib;
        if (existing) {
            pdfLibReady = true;
            updateEngineStatus();
            return existing;
        }
        if (pdfLibPromise)
            return pdfLibPromise;
        pdfLibPromise = (async () => {
            updateEngineStatus();
            const blob = await readCachedResource(PDF_LIB_RESOURCE_ID);
            if (!blob)
                throw new Error(t("engineMissing"));
            const url = URL.createObjectURL(blob);
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = url;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(t("engineMissing")));
                document.head.appendChild(script);
            });
            URL.revokeObjectURL(url);
            const lib = window.PDFLib;
            if (!lib)
                throw new Error(t("engineMissing"));
            pdfLibReady = true;
            updateEngineStatus();
            return lib;
        })().catch((error) => {
            pdfLibPromise = null;
            updateEngineStatus();
            throw error;
        });
        return pdfLibPromise;
    }
    async function loadPdfEntry(file) {
        const lib = await getPdfLib();
        const bytes = await fileBytes(file);
        const doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
        return {
            id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
            file,
            bytes,
            url: URL.createObjectURL(file),
            pageCount: doc.getPageCount()
        };
    }
    async function addImages(files) {
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
    async function addMergePdfs(files) {
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
    async function addManagedPdfs(files) {
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
    async function setSinglePdf(file, target) {
        if (!isPdf(file)) {
            alert(t("unsupportedPdf") + file.name);
            return;
        }
        setStatus("loadingFiles");
        const entry = await loadPdfEntry(file);
        if (target === "watermark") {
            watermarkPdf = entry;
            renderSinglePdf("#watermarkPdfList", entry);
        }
        else {
            metadataPdf = entry;
            renderMetadata(entry);
        }
        setStatus("ready");
    }
    function fileItem(entry, extra, onRemove) {
        const item = document.createElement("div");
        item.className = "file-item";
        const content = document.createElement("div");
        content.innerHTML = '<div class="file-name"></div><div class="muted"></div>';
        content.querySelector(".file-name").textContent = entry.file.name;
        content.querySelector(".muted").textContent = extra;
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
    function getSortableItems(container) {
        return Array.from(container.children).filter((child) => {
            return child instanceof HTMLElement && Boolean(child.dataset.sortId);
        });
    }
    function createSortHandle(kind, id, item) {
        const handle = document.createElement("button");
        handle.className = "sort-handle";
        handle.type = "button";
        handle.draggable = false;
        handle.setAttribute("aria-label", t("sortHandle"));
        handle.title = t("sortHandle");
        handle.addEventListener("pointerdown", (event) => beginSort(event, kind, id, item, handle));
        handle.addEventListener("keydown", (event) => moveSortItemWithKeyboard(event, kind, id, handle));
        return handle;
    }
    function animateSortReflow(container, mutate) {
        const items = getSortableItems(container);
        const positions = new Map();
        items.forEach((item) => positions.set(item, item.getBoundingClientRect()));
        mutate();
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
            return;
        items.forEach((item) => {
            const before = positions.get(item);
            const after = item.getBoundingClientRect();
            if (!before)
                return;
            const deltaX = before.left - after.left;
            const deltaY = before.top - after.top;
            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1)
                return;
            item.animate([
                { transform: "translate(" + deltaX + "px, " + deltaY + "px)" },
                { transform: "translate(0, 0)" }
            ], { duration: 190, easing: "cubic-bezier(.22, 1, .36, 1)" });
        });
    }
    function syncSortOrder(kind, container) {
        const ids = getSortableItems(container).map((item) => item.dataset.sortId || "");
        if (kind === "pages") {
            const byId = new Map(managedPages.map((page) => [page.id, page]));
            managedPages = ids.map((id) => byId.get(id)).filter((page) => Boolean(page));
        }
        else {
            const byId = new Map(images.map((image) => [image.id, image]));
            images = ids.map((id) => byId.get(id)).filter((image) => Boolean(image));
        }
    }
    function restoreSortOrder(container, ids) {
        const byId = new Map(getSortableItems(container).map((item) => [item.dataset.sortId || "", item]));
        ids.forEach((id) => {
            const item = byId.get(id);
            if (item)
                container.appendChild(item);
        });
    }
    function updatePageOrderBadges() {
        getSortableItems($("#pageGrid")).forEach((card, index) => {
            const fallback = card.querySelector(".thumb-fallback");
            if (fallback)
                fallback.textContent = String(index + 1);
        });
    }
    function announceSortPosition(item, container) {
        const position = getSortableItems(container).indexOf(item) + 1;
        if (position <= 0)
            return;
        const status = $("#sortStatus");
        status.textContent = t("movedToPosition").replace("{position}", String(position));
    }
    function createSortGhost(item) {
        const bounds = item.getBoundingClientRect();
        const ghost = item.cloneNode(true);
        ghost.classList.remove("sort-placeholder");
        ghost.classList.add("sort-ghost");
        ghost.removeAttribute("data-sort-id");
        ghost.removeAttribute("data-sort-kind");
        ghost.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        ghost.querySelectorAll("button").forEach((button) => button.setAttribute("tabindex", "-1"));
        ghost.querySelectorAll("embed").forEach((embed) => embed.remove());
        ghost.style.width = bounds.width + "px";
        ghost.style.height = bounds.height + "px";
        document.body.appendChild(ghost);
        return { ghost, bounds };
    }
    function positionSortGhost(session, clientX, clientY) {
        const width = session.ghost.offsetWidth;
        const height = session.ghost.offsetHeight;
        const left = Math.max(8, Math.min(window.innerWidth - width - 8, clientX - session.offsetX));
        const top = Math.max(8, Math.min(window.innerHeight - height - 8, clientY - session.offsetY));
        session.ghost.style.left = left + "px";
        session.ghost.style.top = top + "px";
    }
    function beginSort(event, kind, id, item, handle) {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0))
            return;
        if (sortSession)
            finishSort(true);
        event.preventDefault();
        const container = item.parentElement;
        if (!container)
            return;
        const { ghost, bounds } = createSortGhost(item);
        sortSession = {
            kind,
            pointerId: event.pointerId,
            item,
            handle,
            container,
            ghost,
            originalOrder: getSortableItems(container).map((entry) => entry.dataset.sortId || ""),
            offsetX: event.clientX - bounds.left,
            offsetY: event.clientY - bounds.top,
            lastX: event.clientX,
            lastY: event.clientY
        };
        item.dataset.dropLabel = t("dropHere");
        item.classList.add("sort-placeholder");
        container.classList.add("sortable-container", "is-sorting");
        document.documentElement.classList.add("is-sorting");
        try {
            handle.setPointerCapture(event.pointerId);
        }
        catch (error) {
            // Pointer capture is optional; document-level listeners still keep sorting active.
        }
        positionSortGhost(sortSession, event.clientX, event.clientY);
    }
    function gridColumnCount(container) {
        const template = window.getComputedStyle(container).gridTemplateColumns.trim();
        if (!template || template === "none")
            return 1;
        return template.split(/\s+/).length;
    }
    function findSortTarget(session, clientX, clientY) {
        const containerBounds = session.container.getBoundingClientRect();
        const margin = 24;
        if (clientX < containerBounds.left - margin ||
            clientX > containerBounds.right + margin ||
            clientY < containerBounds.top - margin ||
            clientY > containerBounds.bottom + margin) {
            return null;
        }
        const hit = document.elementFromPoint(clientX, clientY);
        const direct = hit?.closest("[data-sort-id]");
        if (direct && direct.parentElement === session.container) {
            return direct === session.item ? null : direct;
        }
        let nearest = null;
        let nearestDistance = Number.POSITIVE_INFINITY;
        getSortableItems(session.container).forEach((candidate) => {
            if (candidate === session.item)
                return;
            const bounds = candidate.getBoundingClientRect();
            const deltaX = clientX - (bounds.left + bounds.width / 2);
            const deltaY = clientY - (bounds.top + bounds.height / 2);
            const distance = deltaX * deltaX + deltaY * deltaY;
            if (distance < nearestDistance) {
                nearest = candidate;
                nearestDistance = distance;
            }
        });
        return nearest;
    }
    function moveSortPlaceholder(session, clientX, clientY) {
        const target = findSortTarget(session, clientX, clientY);
        if (!target)
            return;
        const bounds = target.getBoundingClientRect();
        const after = gridColumnCount(session.container) > 1
            ? clientX > bounds.left + bounds.width / 2
            : clientY > bounds.top + bounds.height / 2;
        const reference = after ? target.nextElementSibling : target;
        if (reference === session.item || reference === session.item.nextElementSibling)
            return;
        animateSortReflow(session.container, () => {
            session.container.insertBefore(session.item, reference);
        });
        if (session.kind === "pages")
            updatePageOrderBadges();
        announceSortPosition(session.item, session.container);
    }
    function autoScrollForSort(clientY) {
        const edge = Math.min(84, window.innerHeight * .14);
        let distance = 0;
        if (clientY < edge)
            distance = -Math.ceil((edge - clientY) / 5);
        else if (clientY > window.innerHeight - edge)
            distance = Math.ceil((clientY - window.innerHeight + edge) / 5);
        if (distance)
            window.scrollBy(0, Math.max(-18, Math.min(18, distance)));
    }
    function handleSortPointerMove(event) {
        const session = sortSession;
        if (!session || event.pointerId !== session.pointerId)
            return;
        event.preventDefault();
        session.lastX = event.clientX;
        session.lastY = event.clientY;
        positionSortGhost(session, event.clientX, event.clientY);
        autoScrollForSort(event.clientY);
        moveSortPlaceholder(session, event.clientX, event.clientY);
    }
    function finishSort(cancelled) {
        const session = sortSession;
        if (!session)
            return;
        sortSession = null;
        if (cancelled) {
            animateSortReflow(session.container, () => restoreSortOrder(session.container, session.originalOrder));
        }
        else {
            syncSortOrder(session.kind, session.container);
        }
        session.item.classList.remove("sort-placeholder");
        delete session.item.dataset.dropLabel;
        session.container.classList.remove("is-sorting");
        document.documentElement.classList.remove("is-sorting");
        session.ghost.remove();
        try {
            if (session.handle.hasPointerCapture(session.pointerId))
                session.handle.releasePointerCapture(session.pointerId);
        }
        catch (error) {
            // The pointer may already have been released by the browser.
        }
        if (session.kind === "pages")
            updatePageOrderBadges();
        if (!cancelled)
            announceSortPosition(session.item, session.container);
    }
    function handleSortPointerEnd(event) {
        if (!sortSession || event.pointerId !== sortSession.pointerId)
            return;
        event.preventDefault();
        finishSort(event.type === "pointercancel");
    }
    function moveSortItemWithKeyboard(event, kind, id, handle) {
        const container = (kind === "pages" ? $("#pageGrid") : $("#imageList"));
        const items = getSortableItems(container);
        const item = items.find((entry) => entry.dataset.sortId === id);
        if (!item)
            return;
        const currentIndex = items.indexOf(item);
        const columns = gridColumnCount(container);
        let offset = 0;
        if (event.key === "ArrowLeft")
            offset = -1;
        else if (event.key === "ArrowRight")
            offset = 1;
        else if (event.key === "ArrowUp")
            offset = -columns;
        else if (event.key === "ArrowDown")
            offset = columns;
        else
            return;
        const targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + offset));
        if (targetIndex === currentIndex)
            return;
        event.preventDefault();
        const target = items[targetIndex];
        const reference = targetIndex > currentIndex ? target.nextElementSibling : target;
        animateSortReflow(container, () => container.insertBefore(item, reference));
        syncSortOrder(kind, container);
        if (kind === "pages")
            updatePageOrderBadges();
        announceSortPosition(item, container);
        handle.focus();
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
            item.classList.add("sortable");
            item.dataset.sortId = image.id;
            item.dataset.sortKind = "images";
            item.insertBefore(createSortHandle("images", image.id, item), item.firstChild);
            list.appendChild(item);
        });
    }
    function renderMergePdfs() {
        const list = $("#mergePdfList");
        list.innerHTML = "";
        mergePdfs.forEach((entry) => {
            list.appendChild(fileItem(entry, entry.pageCount + " " + t("pages") + " · " + formatBytes(entry.file.size), () => {
                mergePdfs = mergePdfs.filter((item) => item.id !== entry.id);
                renderMergePdfs();
            }));
        });
    }
    function renderSinglePdf(selector, entry) {
        const list = $(selector);
        list.innerHTML = "";
        if (entry)
            list.appendChild(fileItem(entry, entry.pageCount + " " + t("pages") + " · " + formatBytes(entry.file.size)));
    }
    async function getPagePreviewUrl(page) {
        const key = page.id + ":" + page.rotation;
        const cached = pagePreviewCache.get(key);
        if (cached)
            return cached;
        const lib = await getPdfLib();
        const entry = managedPdfs.get(page.sourceId);
        if (!entry)
            return "";
        const source = await lib.PDFDocument.load(entry.bytes, { ignoreEncryption: true });
        const preview = await lib.PDFDocument.create();
        const [copied] = await preview.copyPages(source, [page.pageIndex]);
        const existing = copied.getRotation ? copied.getRotation().angle : 0;
        copied.setRotation(lib.degrees((existing + page.rotation) % 360));
        preview.addPage(copied);
        const bytes = await preview.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        pagePreviewCache.set(key, url);
        return url;
    }
    function updatePagePreview(card, page, visibleIndex) {
        const thumb = card.querySelector(".thumb");
        const key = page.id + ":" + page.rotation;
        const fallback = card.querySelector(".thumb-fallback");
        if (fallback)
            fallback.textContent = String(visibleIndex + 1);
        if (thumb.dataset.previewKey === key)
            return;
        thumb.dataset.previewKey = key;
        thumb.querySelectorAll("embed").forEach((node) => node.remove());
        void getPagePreviewUrl(page).then((url) => {
            if (!url || thumb.dataset.previewKey !== key)
                return;
            const embed = document.createElement("embed");
            embed.type = "application/pdf";
            embed.src = url + "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";
            thumb.insertBefore(embed, thumb.firstChild);
        });
    }
    function openPagePreview(page) {
        void getPagePreviewUrl(page).then((url) => {
            if (!url)
                return;
            activePreviewUrl = url;
            const modal = $("#pagePreviewModal");
            const embed = $("#pagePreviewEmbed");
            const title = $("#pagePreviewTitle");
            title.textContent = page.sourceName + " · p." + (page.pageIndex + 1) + "/" + page.pageCount;
            embed.src = url + "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";
            modal.hidden = false;
        });
    }
    function closePagePreview() {
        const modal = $("#pagePreviewModal");
        const embed = $("#pagePreviewEmbed");
        embed.removeAttribute("src");
        activePreviewUrl = "";
        modal.hidden = true;
    }
    function createPageCard(page) {
        const card = document.createElement("div");
        card.className = "page-card";
        card.dataset.pageId = page.id;
        card.dataset.sortId = page.id;
        card.dataset.sortKind = "pages";
        card.innerHTML =
            '<button class="thumb" type="button"></button><div class="file-name"></div><div class="muted"></div><div class="page-actions"></div>';
        card.insertBefore(createSortHandle("pages", page.id, card), card.firstChild);
        const thumb = card.querySelector(".thumb");
        const fallback = document.createElement("span");
        fallback.className = "thumb-fallback";
        thumb.appendChild(fallback);
        thumb.addEventListener("click", () => openPagePreview(page));
        const actions = card.querySelector(".page-actions");
        const rotate = document.createElement("button");
        rotate.className = "btn";
        rotate.type = "button";
        rotate.dataset.pageAction = "rotate";
        rotate.textContent = t("rotate");
        rotate.addEventListener("click", () => {
            page.rotation = (page.rotation + 90) % 360;
            updatePageCard(card, page, managedPages.findIndex((entry) => entry.id === page.id));
        });
        const remove = document.createElement("button");
        remove.className = "btn";
        remove.type = "button";
        remove.dataset.pageAction = "remove";
        remove.textContent = t("remove");
        remove.addEventListener("click", () => {
            managedPages = managedPages.filter((entry) => entry.id !== page.id);
            card.remove();
            renderManagedPages();
        });
        actions.append(rotate, remove);
        return card;
    }
    function updatePageCard(card, page, visibleIndex) {
        card.querySelector(".file-name").textContent = page.sourceName;
        card.querySelector(".muted").textContent = "p." + (page.pageIndex + 1) + "/" + page.pageCount + " · " + page.rotation + "°";
        const handle = card.querySelector(".sort-handle");
        handle.setAttribute("aria-label", t("sortHandle"));
        handle.title = t("sortHandle");
        card.querySelector('[data-page-action="rotate"]').textContent = t("rotate");
        card.querySelector('[data-page-action="remove"]').textContent = t("remove");
        updatePagePreview(card, page, visibleIndex);
    }
    function renderManagedPages() {
        const grid = $("#pageGrid");
        const existingCards = new Map();
        Array.from(grid.querySelectorAll(".page-card")).forEach((card) => {
            if (card.dataset.pageId)
                existingCards.set(card.dataset.pageId, card);
        });
        managedPages.forEach((page, visibleIndex) => {
            const card = existingCards.get(page.id) || createPageCard(page);
            updatePageCard(card, page, visibleIndex);
            grid.appendChild(card);
            existingCards.delete(page.id);
        });
        existingCards.forEach((card) => card.remove());
    }
    async function renderMetadata(entry) {
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
            item.querySelector("strong").textContent = t(row[0]);
            item.querySelector(".muted").textContent = value || t("metadataEmpty");
            details.appendChild(item);
        });
        list.appendChild(details);
    }
    function renderAll() {
        renderImages();
        renderMergePdfs();
        renderManagedPages();
        renderSinglePdf("#watermarkPdfList", watermarkPdf);
        if (metadataPdf)
            void renderMetadata(metadataPdf);
    }
    function pageSizeForImage(image, mode) {
        if (mode === "a4-portrait")
            return A4_PORTRAIT;
        if (mode === "a4-landscape")
            return A4_LANDSCAPE;
        return [image.width, image.height];
    }
    function drawRectForFit(pageWidth, pageHeight, mediaWidth, mediaHeight, margin, fit) {
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
        if (!images.length)
            throw new Error(t("needImages"));
        const lib = await getPdfLib();
        const doc = await lib.PDFDocument.create();
        const margin = Math.max(0, Number($("#marginInput").value) || 0);
        const pageSize = $("#pageSize").value;
        const fit = $("#fitMode").value;
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
        if (!mergePdfs.length)
            throw new Error(t("needPdfs"));
        const lib = await getPdfLib();
        const output = await lib.PDFDocument.create();
        for (const entry of mergePdfs) {
            const source = await lib.PDFDocument.load(entry.bytes, { ignoreEncryption: true });
            const pages = await output.copyPages(source, source.getPageIndices());
            pages.forEach((page) => output.addPage(page));
        }
        await downloadDoc(output, $("#mergeOutputName").value);
    }
    function parseRanges(text, max) {
        const indices = new Set();
        (text || "").split(",").forEach((part) => {
            const trimmed = part.trim();
            if (!trimmed)
                return;
            const match = /^(\d+)(?:-(\d+))?$/.exec(trimmed);
            if (!match)
                return;
            const start = Math.max(1, Number(match[1]));
            const end = Math.min(max, Number(match[2] || match[1]));
            for (let page = Math.min(start, end); page <= Math.max(start, end); page++)
                indices.add(page - 1);
        });
        return Array.from(indices).filter((index) => index >= 0 && index < max).sort((a, b) => a - b);
    }
    async function splitPdfAction() {
        if (!mergePdfs.length)
            throw new Error(t("needOnePdf"));
        const lib = await getPdfLib();
        const source = await lib.PDFDocument.load(mergePdfs[0].bytes, { ignoreEncryption: true });
        const ranges = parseRanges($("#splitRangeInput").value, source.getPageCount());
        if (!ranges.length)
            throw new Error(t("range"));
        const output = await lib.PDFDocument.create();
        const pages = await output.copyPages(source, ranges);
        pages.forEach((page) => output.addPage(page));
        await downloadDoc(output, $("#mergeOutputName").value || "split.pdf");
    }
    async function exportManagedPages() {
        if (!managedPages.length)
            throw new Error(t("needPdfs"));
        const lib = await getPdfLib();
        const output = await lib.PDFDocument.create();
        const docCache = new Map();
        for (const page of managedPages) {
            let source = docCache.get(page.sourceId);
            if (!source) {
                const entry = managedPdfs.get(page.sourceId);
                if (!entry)
                    continue;
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
        if (!watermarkPdf)
            throw new Error(t("needOnePdf"));
        const lib = await getPdfLib();
        const doc = await lib.PDFDocument.load(watermarkPdf.bytes, { ignoreEncryption: true });
        const font = await doc.embedFont(lib.StandardFonts.Helvetica);
        const text = ($("#watermarkText").value || "").trim();
        const header = ($("#headerText").value || "").trim();
        const footer = ($("#footerText").value || "").trim();
        const opacity = Math.max(0.05, Math.min(1, Number($("#watermarkOpacity").value) || 0.18));
        const pageNumberMode = $("#pageNumberMode").value;
        let imageWatermark = null;
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
            if (header)
                page.drawText(header, { x: 36, y: size.height - 28, size: 10, font, color: lib.rgb(0.25, 0.25, 0.25) });
            if (footer)
                page.drawText(footer, { x: 36, y: 18, size: 10, font, color: lib.rgb(0.25, 0.25, 0.25) });
            if (pageNumberMode !== "none") {
                const label = String(index + 1) + " / " + pages.length;
                const x = pageNumberMode === "bottom-right" ? size.width - 72 : (size.width - font.widthOfTextAtSize(label, 10)) / 2;
                page.drawText(label, { x, y: 18, size: 10, font, color: lib.rgb(0.25, 0.25, 0.25) });
            }
        });
        await downloadDoc(doc, $("#watermarkOutputName").value);
    }
    async function clearMetadata() {
        if (!metadataPdf)
            throw new Error(t("needOnePdf"));
        const lib = await getPdfLib();
        const doc = await lib.PDFDocument.load(metadataPdf.bytes, { ignoreEncryption: true });
        if (doc.setTitle)
            doc.setTitle("");
        if (doc.setAuthor)
            doc.setAuthor("");
        if (doc.setSubject)
            doc.setSubject("");
        if (doc.setKeywords)
            doc.setKeywords([]);
        if (doc.setCreator)
            doc.setCreator("");
        if (doc.setProducer)
            doc.setProducer("");
        const now = new Date(0);
        if (doc.setCreationDate)
            doc.setCreationDate(now);
        if (doc.setModificationDate)
            doc.setModificationDate(now);
        await downloadDoc(doc, $("#metadataOutputName").value);
    }
    async function downloadDoc(doc, name) {
        const bytes = await doc.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = normalizePdfName(name);
        link.textContent = t("download") + " · " + formatBytes(blob.size);
        $("#resultBox").dataset.hasOutput = "true";
        $("#resultBox").innerHTML = "";
        $("#resultBox").appendChild(link);
        setStatus("done");
    }
    async function run(action) {
        try {
            setStatus("loadingFiles");
            await action();
        }
        catch (error) {
            setStatus("failed");
            alert(error instanceof Error ? error.message : String(error));
        }
    }
    function setTool(tool) {
        currentTool = tool;
        $$(".tabs button").forEach((button) => button.classList.toggle("active", button.dataset.tool === tool));
        $$(".tool-panel").forEach((panel) => {
            const id = panel.id || "";
            panel.classList.toggle("active", id === "panel-" + tool || id === "settings-" + tool);
        });
    }
    function wireDrop(label, input, handler) {
        label.addEventListener("dragover", (event) => {
            event.preventDefault();
            label.classList.add("dragover");
        });
        label.addEventListener("dragleave", () => label.classList.remove("dragover"));
        label.addEventListener("drop", (event) => {
            event.preventDefault();
            label.classList.remove("dragover");
            if (event.dataTransfer?.files)
                void handler(event.dataTransfer.files);
        });
        input.addEventListener("change", () => {
            if (input.files)
                void handler(input.files);
            input.value = "";
        });
    }
    wireDrop($("#imageUpload"), $("#imageInput"), addImages);
    wireDrop($("#pdfUploadMerge"), $("#mergePdfInput"), addMergePdfs);
    wireDrop($("#pdfUploadPages"), $("#pagesPdfInput"), addManagedPdfs);
    wireDrop($("#pdfUploadWatermark"), $("#watermarkPdfInput"), (files) => {
        const file = Array.from(files)[0];
        if (file)
            void setSinglePdf(file, "watermark");
    });
    wireDrop($("#pdfUploadMetadata"), $("#metadataPdfInput"), (files) => {
        const file = Array.from(files)[0];
        if (file)
            void setSinglePdf(file, "metadata");
    });
    $("#loadPdfLibButton").addEventListener("click", () => run(async () => { await getPdfLib(); setStatus("ready"); }));
    $("#generateImagesButton").addEventListener("click", () => run(generateImagesPdf));
    $("#mergeButton").addEventListener("click", () => run(mergePdfsAction));
    $("#splitButton").addEventListener("click", () => run(splitPdfAction));
    $("#exportPagesButton").addEventListener("click", () => run(exportManagedPages));
    $("#applyWatermarkButton").addEventListener("click", () => run(applyWatermark));
    $("#clearMetadataButton").addEventListener("click", () => run(clearMetadata));
    $("#pagePreviewClose").addEventListener("click", closePagePreview);
    $("#pagePreviewModal").addEventListener("click", (event) => {
        if (event.target === $("#pagePreviewModal"))
            closePagePreview();
    });
    document.addEventListener("pointermove", handleSortPointerMove, { passive: false });
    document.addEventListener("pointerup", handleSortPointerEnd, { passive: false });
    document.addEventListener("pointercancel", handleSortPointerEnd, { passive: false });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && sortSession) {
            event.preventDefault();
            finishSort(true);
            return;
        }
        if (event.key === "Escape" && !$("#pagePreviewModal").hidden)
            closePagePreview();
    });
    $$(".tabs button").forEach((button) => {
        button.addEventListener("click", () => setTool(button.dataset.tool));
    });
    $$(".language button[data-lang]").forEach((button) => {
        button.addEventListener("click", () => {
            const next = button.dataset.lang;
            if (next !== "zh" && next !== "en")
                return;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
            applyLanguage(next);
        });
    });
    $("#themeButton").addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    });
    window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return;
        applyTheme(event.matches ? "dark" : "light");
    });
    applyTheme(resolveInitialTheme());
    applyLanguage(currentLanguage);
    setTool("images");
})();
