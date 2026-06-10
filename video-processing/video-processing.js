"use strict";
(function () {
    "use strict";
    var LANGUAGE_STORAGE_KEY = "web-tools-language";
    var THEME_STORAGE_KEY = "web-tools-theme";
    var LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
    var LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
    var FFMPEG_WASM_FILE_NAME = "ffmpeg-core.wasm";
    var RESOURCE_CACHE_DB_NAME = "web-tools-resource-cache";
    var RESOURCE_CACHE_STORE_NAME = "resources";
    var RESOURCE_CACHE_DB_VERSION = 1;
    var FFMPEG_CORE_JS_RESOURCE_ID = "ffmpeg-core-js";
    var FFMPEG_CORE_WASM_RESOURCE_ID = "ffmpeg-core-wasm";
    var TEXT = {
        zh: {
            htmlLang: "zh-CN",
            title: "视频处理",
            home: "工具集",
            navLabel: "页面导航",
            themeToggle: "切换主题",
            lead: "使用本地 FFmpeg.wasm 资源进行音频提取、拼接、转封装、GIF 生成和元数据读取。",
            engineTitle: "FFmpeg Core",
            engineIdle: "尚未加载",
            engineLoading: "正在加载本地 FFmpeg 资源...",
            engineReady: "已加载，可开始处理",
            engineResourceReady: "已读取 WASM，点击处理时会加载核心",
            engineLoadButton: "加载本地核心",
            engineMissing: "未找到 FFmpeg 资源，请先在入口页资源管理中放置资源",
            wasmNeedsCache: "浏览器无法读取 FFmpeg 资源。请回到入口页资源管理，导入或下载 ffmpeg-core.js 与 ffmpeg-core.wasm 到浏览器缓存。",
            wasmSelected: "已读取 ffmpeg-core.wasm",
            toolLabel: "视频工具",
            metadataTab: "元数据",
            audioTab: "音频提取",
            remuxTab: "转封装",
            clipTab: "截取片段",
            concatTab: "拼接",
            gifTab: "GIF 生成",
            inputTitle: "输入文件",
            settingsTitle: "处理设置",
            outputTitle: "输出",
            logTitle: "日志",
            chooseFile: "选择或拖放音视频文件",
            chooseFileHint: "用于元数据、音频提取、转封装、截取片段和 GIF 生成",
            chooseFiles: "选择或拖放多个视频文件",
            chooseFilesHint: "用于无重编码拼接，建议同编码、同分辨率",
            resourceWarning: "需要先在入口页资源管理中导入或下载 ffmpeg-core.js 和 ffmpeg-core.wasm 到浏览器缓存。进入本页后仍需点击“加载本地核心”或在处理时自动加载。",
            metadataHelp: "读取容器、时长、码率和音视频流信息。",
            readMetadata: "读取元数据",
            audioFormat: "输出格式",
            extractAudio: "提取音频",
            targetContainer: "目标容器",
            remux: "转封装",
            clipStart: "开始时间（秒）",
            clipEnd: "结束时间（秒）",
            clipDuration: "时长（秒）",
            clipTimeline: "截取范围",
            clipFormat: "输出容器",
            clip: "截取片段",
            usePreviewStart: "使用当前时间为开始",
            usePreviewEnd: "使用当前时间为结束",
            previewClipRange: "预览片段范围",
            invalidPreviewTime: "无法读取当前预览时间，请先选择视频并等待预览加载完成。",
            invalidStartAfterEnd: "开始时间必须早于结束时间。",
            invalidEndBeforeStart: "结束时间必须晚于开始时间。",
            invalidTimeRange: "时间范围超出视频时长，请重新选择。",
            concatHelp: "使用 concat demuxer 进行无重编码拼接。文件编码参数不一致时可能失败。",
            concat: "拼接视频",
            gifTimeline: "GIF 范围",
            gifStart: "开始时间（秒）",
            gifEnd: "结束时间（秒）",
            gifDuration: "时长（秒）",
            gifWidth: "宽度 px",
            gifFps: "帧率",
            makeGif: "生成 GIF",
            waitingInput: "等待输入文件",
            noOutput: "暂无输出",
            processing: "处理中，请保持页面打开...",
            done: "处理完成",
            failed: "处理失败",
            needSingle: "请先选择一个音视频文件。",
            needMultiple: "请至少选择两个视频文件。",
            loadingFile: "正在读取文件...",
            writingFile: "正在写入虚拟文件系统...",
            running: "正在运行 FFmpeg...",
            download: "下载",
            format: "格式",
            duration: "时长",
            bitrate: "码率",
            size: "大小",
            streams: "流",
            moveUp: "上移",
            moveDown: "下移",
            remove: "移除"
        },
        en: {
            htmlLang: "en",
            title: "Video Processing",
            home: "Tools",
            navLabel: "Page navigation",
            themeToggle: "Toggle theme",
            lead: "Use local FFmpeg.wasm resources to extract audio, stitch clips, remux containers, generate GIFs, and read metadata.",
            engineTitle: "FFmpeg Core",
            engineIdle: "Not loaded",
            engineLoading: "Loading local FFmpeg resources...",
            engineReady: "Loaded and ready",
            engineResourceReady: "WASM loaded. The core will initialize when processing starts.",
            engineLoadButton: "Load Local Core",
            engineMissing: "FFmpeg resources were not found. Place them from Resource Management on the entry page first.",
            wasmNeedsCache: "The browser could not read FFmpeg resources. Go back to Resource Management and import or download ffmpeg-core.js and ffmpeg-core.wasm into browser cache.",
            wasmSelected: "ffmpeg-core.wasm loaded",
            toolLabel: "Video tools",
            metadataTab: "Metadata",
            audioTab: "Audio Extract",
            remuxTab: "Remux",
            clipTab: "Clip",
            concatTab: "Stitch",
            gifTab: "GIF",
            inputTitle: "Input Files",
            settingsTitle: "Settings",
            outputTitle: "Output",
            logTitle: "Log",
            chooseFile: "Choose or drop an audio/video file",
            chooseFileHint: "Used for metadata, audio extraction, remuxing, clipping, and GIF generation",
            chooseFiles: "Choose or drop video files",
            chooseFilesHint: "Used for no-reencode stitching. Matching codecs and dimensions are recommended.",
            resourceWarning: "Import or download ffmpeg-core.js and ffmpeg-core.wasm into browser cache from Resource Management first. This page still loads the local core before processing.",
            metadataHelp: "Read container, duration, bitrate, and audio/video stream information.",
            readMetadata: "Read Metadata",
            audioFormat: "Output format",
            extractAudio: "Extract Audio",
            targetContainer: "Target container",
            remux: "Remux",
            clipStart: "Start time (s)",
            clipEnd: "End time (s)",
            clipDuration: "Duration (s)",
            clipTimeline: "Clip range",
            clipFormat: "Output container",
            clip: "Clip Video",
            usePreviewStart: "Use Current Time as Start",
            usePreviewEnd: "Use Current Time as End",
            previewClipRange: "Preview Range",
            invalidPreviewTime: "Cannot read the current preview time. Choose a video and wait for the preview to load.",
            invalidStartAfterEnd: "Start time must be earlier than end time.",
            invalidEndBeforeStart: "End time must be later than start time.",
            invalidTimeRange: "The time range is outside the video duration. Choose another range.",
            concatHelp: "Uses the concat demuxer without re-encoding. It may fail if codec settings differ.",
            concat: "Stitch Videos",
            gifTimeline: "GIF range",
            gifStart: "Start time (s)",
            gifEnd: "End time (s)",
            gifDuration: "Duration (s)",
            gifWidth: "Width px",
            gifFps: "Frame rate",
            makeGif: "Generate GIF",
            waitingInput: "Waiting for input",
            noOutput: "No output yet",
            processing: "Processing. Keep this page open...",
            done: "Done",
            failed: "Failed",
            needSingle: "Choose one audio/video file first.",
            needMultiple: "Choose at least two video files first.",
            loadingFile: "Reading file...",
            writingFile: "Writing to virtual file system...",
            running: "Running FFmpeg...",
            download: "Download",
            format: "Format",
            duration: "Duration",
            bitrate: "Bitrate",
            size: "Size",
            streams: "Streams",
            moveUp: "Move up",
            moveDown: "Move down",
            remove: "Remove"
        }
    };
    var MIME = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        aac: "audio/aac",
        m4a: "audio/mp4",
        mp4: "video/mp4",
        mkv: "video/x-matroska",
        webm: "video/webm",
        mov: "video/quicktime",
        gif: "image/gif"
    };
    var $ = function (selector) { return document.querySelector(selector); };
    var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
    var currentLanguage = resolveInitialLanguage();
    var currentTool = "metadata";
    var singleFile = null;
    var multiFiles = [];
    var previewUrl = "";
    var previewStopTimer = null;
    var lastValidClipStart = 0;
    var lastValidClipEnd = 10;
    var lastValidGifStart = 0;
    var lastValidGifEnd = 3;
    var corePromise = null;
    var ffmpegCore = null;
    var localWasmBinary = null;
    var logLines = [];
    var running = false;
    function t(key) {
        return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
    }
    function resolveInitialLanguage() {
        var saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
        if (saved === "zh" || saved === "en")
            return saved;
        var browserLanguage = (navigator.language || "").toLowerCase();
        if (browserLanguage.indexOf("zh") === 0)
            return "zh";
        if (browserLanguage.indexOf("en") === 0)
            return "en";
        return "en";
    }
    function getSystemTheme() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function resolveInitialTheme() {
        var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return saved;
        return getSystemTheme();
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
    }
    function setText(selector, key) {
        var element = $(selector);
        if (element)
            element.textContent = t(key);
    }
    function setButtonText(selector, key) {
        var element = $(selector);
        if (!element)
            return;
        var nodes = Array.from(element.childNodes).reverse();
        var textNode = nodes.find(function (node) { return node.nodeType === Node.TEXT_NODE; });
        if (textNode)
            textNode.nodeValue = " " + t(key);
        else
            element.appendChild(document.createTextNode(t(key)));
    }
    function applyLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = t("htmlLang");
        document.title = t("title");
        $(".topbar").setAttribute("aria-label", t("navLabel"));
        $(".tabs").setAttribute("aria-label", t("toolLabel"));
        $("#themeButton").setAttribute("title", t("themeToggle"));
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
        setText("#homeText", "home");
        setText("#pageTitle", "title");
        setText("#pageLead", "lead");
        setText("#engineTitle", "engineTitle");
        setText("#pickResourceDirButton", "engineLoadButton");
        setText("#inputTitle", "inputTitle");
        setText("#settingsTitle", "settingsTitle");
        setText("#outputTitle", "outputTitle");
        setText("#logTitle", "logTitle");
        setText('[data-tool="metadata"]', "metadataTab");
        setText('[data-tool="audio"]', "audioTab");
        setText('[data-tool="remux"]', "remuxTab");
        setText('[data-tool="clip"]', "clipTab");
        setText('[data-tool="concat"]', "concatTab");
        setText('[data-tool="gif"]', "gifTab");
        setText("#singleUploadTitle", "chooseFile");
        setText("#singleUploadHint", "chooseFileHint");
        setText("#multiUploadTitle", "chooseFiles");
        setText("#multiUploadHint", "chooseFilesHint");
        setText("#resourceWarning", "resourceWarning");
        setText("#metadataHelp", "metadataHelp");
        setText("#audioFormatLabel", "audioFormat");
        setText("#containerLabel", "targetContainer");
        setText("#clipTimelineLabel", "clipTimeline");
        setText("#clipStartLabel", "clipStart");
        setText("#clipEndLabel", "clipEnd");
        setText("#clipDurationLabel", "clipDuration");
        setText("#clipFormatLabel", "clipFormat");
        setText("#concatHelp", "concatHelp");
        setText("#gifStartLabel", "gifStart");
        setText("#gifDurationLabel", "gifDuration");
        setText("#gifWidthLabel", "gifWidth");
        setText("#gifFpsLabel", "gifFps");
        setButtonText('[data-action="metadata"]', "readMetadata");
        setButtonText('[data-action="audio"]', "extractAudio");
        setButtonText('[data-action="remux"]', "remux");
        setButtonText('[data-action="clip"]', "clip");
        setButtonText('[data-action="concat"]', "concat");
        setButtonText('[data-action="gif"]', "makeGif");
        setText("#usePreviewStart", "usePreviewStart");
        setText("#usePreviewEnd", "usePreviewEnd");
        setText("#previewClipRange", "previewClipRange");
        setText("#gifTimelineLabel", "gifTimeline");
        setText("#gifEndLabel", "gifEnd");
        $$(".language button[data-lang]").forEach(function (button) {
            button.classList.toggle("active", button.dataset.lang === language);
        });
        updateEngineStatus();
        renderFiles();
        if (!$("#resultBox").dataset.hasOutput)
            $("#resultBox").textContent = t("noOutput");
        if (!singleFile && multiFiles.length === 0)
            $("#statusLine").textContent = t("waitingInput");
    }
    function updateEngineStatus() {
        if (ffmpegCore)
            $("#engineStatus").textContent = t("engineReady");
        else if (corePromise)
            $("#engineStatus").textContent = t("engineLoading");
        else if (localWasmBinary)
            $("#engineStatus").textContent = t("engineResourceReady");
        else
            $("#engineStatus").textContent = t("engineIdle");
    }
    function setupUpload(label, input, callback) {
        label.addEventListener("click", function (event) {
            if (event.target === input)
                return;
            event.preventDefault();
            input.click();
        });
        input.addEventListener("change", function () {
            callback(Array.from(input.files || []));
            input.value = "";
        });
        ["dragenter", "dragover"].forEach(function (type) {
            label.addEventListener(type, function (event) {
                event.preventDefault();
                label.classList.add("drag");
            });
        });
        ["dragleave", "drop"].forEach(function (type) {
            label.addEventListener(type, function (event) {
                event.preventDefault();
                label.classList.remove("drag");
            });
        });
        label.addEventListener("drop", function (event) {
            callback(Array.from(event.dataTransfer.files || []));
        });
    }
    function formatBytes(bytes) {
        if (!Number.isFinite(bytes))
            return "-";
        if (bytes < 1024)
            return bytes + " B";
        if (bytes < 1024 * 1024)
            return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
    }
    function formatDuration(seconds) {
        var value = Number(seconds);
        if (!Number.isFinite(value))
            return "-";
        var h = Math.floor(value / 3600);
        var m = Math.floor((value % 3600) / 60);
        var s = Math.round(value % 60);
        return (h ? h + ":" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }
    function getExt(fileName) {
        var match = String(fileName).match(/\.([a-z0-9]+)$/i);
        return match ? match[1].toLowerCase() : "bin";
    }
    function fileName(base, ext) {
        return base.replace(/[^\w.-]+/g, "_").replace(/\.[^.]+$/, "") + "." + ext;
    }
    function setStatus(key) {
        $("#statusLine").textContent = t(key);
    }
    function appendLog(message) {
        logLines.push(message);
        var box = $("#logBox");
        box.textContent = logLines.join("\n");
        box.scrollTop = box.scrollHeight;
    }
    function clearRunOutput() {
        logLines = [];
        $("#logBox").textContent = "";
        $("#summary").innerHTML = "";
        $("#resultBox").dataset.hasOutput = "";
        $("#resultBox").textContent = t("noOutput");
    }
    function clearPreviewStopTimer() {
        if (previewStopTimer) {
            window.clearTimeout(previewStopTimer);
            previewStopTimer = null;
        }
    }
    function clampNumber(value, min, max) {
        if (!Number.isFinite(value))
            return min;
        return Math.min(max, Math.max(min, value));
    }
    function formatSeconds(value) {
        return value.toFixed(1);
    }
    function showRangeError(message, modal) {
        $("#statusLine").textContent = message;
        if (modal)
            alert(message);
    }
    function updateRangeFill(fillSelector, start, end, max) {
        var fill = $(fillSelector);
        var safeMax = Math.max(0.1, max);
        var left = clampNumber(start / safeMax * 100, 0, 100);
        var right = clampNumber(end / safeMax * 100, 0, 100);
        fill.style.left = left + "%";
        fill.style.width = Math.max(0, right - left) + "%";
    }
    function getPreviewCurrentTime() {
        var video = $("#videoPreview");
        var current = Number(video.currentTime);
        if (!video.src || !Number.isFinite(current))
            return null;
        return current;
    }
    function canApplyRange(start, end, max, changed, modal) {
        var minGap = 0.1;
        if (!Number.isFinite(start) || !Number.isFinite(end)) {
            showRangeError(t("invalidTimeRange"), modal);
            return false;
        }
        if (start < 0 || end > max) {
            showRangeError(t("invalidTimeRange"), modal);
            return false;
        }
        if (end - start < minGap) {
            showRangeError(changed === "end" ? t("invalidEndBeforeStart") : t("invalidStartAfterEnd"), modal);
            return false;
        }
        return true;
    }
    function getClipRangeMax() {
        var video = $("#videoPreview");
        var videoDuration = Number(video.duration);
        var inputEnd = Number($("#clipEnd").value);
        var inputDuration = Number($("#clipDuration").value);
        var fallbackEnd = Number.isFinite(inputEnd) && inputEnd > 0 ? inputEnd : 10;
        var fallbackDuration = Number.isFinite(inputDuration) && inputDuration > 0 ? inputDuration : 10;
        return Math.max(0.1, Number.isFinite(videoDuration) && videoDuration > 0 ? videoDuration : Math.max(fallbackEnd, fallbackDuration));
    }
    function getGifRangeMax() {
        var video = $("#videoPreview");
        var videoDuration = Number(video.duration);
        var inputEnd = Number($("#gifEnd").value);
        var inputDuration = Number($("#gifDuration").value);
        var fallbackEnd = Number.isFinite(inputEnd) && inputEnd > 0 ? inputEnd : 3;
        var fallbackDuration = Number.isFinite(inputDuration) && inputDuration > 0 ? inputDuration : 3;
        return Math.max(0.1, Number.isFinite(videoDuration) && videoDuration > 0 ? videoDuration : Math.max(fallbackEnd, fallbackDuration));
    }
    function setClipBounds(start, end, changed) {
        var max = getClipRangeMax();
        var minGap = 0.1;
        var nextStart = clampNumber(start, 0, max);
        var nextEnd = clampNumber(end, 0, max);
        if (nextEnd - nextStart < minGap) {
            if (changed === "start")
                nextStart = Math.max(0, nextEnd - minGap);
            else
                nextEnd = Math.min(max, nextStart + minGap);
        }
        if (nextEnd - nextStart < minGap) {
            nextStart = 0;
            nextEnd = Math.min(max, minGap);
        }
        var duration = Math.max(minGap, nextEnd - nextStart);
        $("#clipStart").value = formatSeconds(nextStart);
        $("#clipEnd").value = formatSeconds(nextEnd);
        $("#clipDuration").value = formatSeconds(duration);
        $("#clipStartRange").max = formatSeconds(max);
        $("#clipEndRange").max = formatSeconds(max);
        $("#clipStartRange").value = formatSeconds(nextStart);
        $("#clipEndRange").value = formatSeconds(nextEnd);
        $("#clipRangeLabel").textContent = formatSeconds(nextStart) + "s - " + formatSeconds(nextEnd) + "s";
        updateRangeFill("#clipRangeFill", nextStart, nextEnd, max);
        lastValidClipStart = nextStart;
        lastValidClipEnd = nextEnd;
    }
    function setGifBounds(start, end, changed) {
        var max = getGifRangeMax();
        var minGap = 0.1;
        var nextStart = clampNumber(start, 0, max);
        var nextEnd = clampNumber(end, 0, max);
        if (nextEnd - nextStart < minGap) {
            if (changed === "start")
                nextStart = Math.max(0, nextEnd - minGap);
            else
                nextEnd = Math.min(max, nextStart + minGap);
        }
        if (nextEnd - nextStart < minGap) {
            nextStart = 0;
            nextEnd = Math.min(max, minGap);
        }
        var duration = Math.max(minGap, nextEnd - nextStart);
        $("#gifStart").value = formatSeconds(nextStart);
        $("#gifEnd").value = formatSeconds(nextEnd);
        $("#gifDuration").value = formatSeconds(duration);
        $("#gifStartRange").max = formatSeconds(max);
        $("#gifEndRange").max = formatSeconds(max);
        $("#gifStartRange").value = formatSeconds(nextStart);
        $("#gifEndRange").value = formatSeconds(nextEnd);
        $("#gifRangeLabel").textContent = formatSeconds(nextStart) + "s - " + formatSeconds(nextEnd) + "s";
        updateRangeFill("#gifRangeFill", nextStart, nextEnd, max);
        lastValidGifStart = nextStart;
        lastValidGifEnd = nextEnd;
    }
    function requestClipBounds(start, end, changed, modal) {
        var max = getClipRangeMax();
        if (!canApplyRange(start, end, max, changed, modal)) {
            setClipBounds(lastValidClipStart, lastValidClipEnd, "both");
            return false;
        }
        setClipBounds(start, end, changed);
        return true;
    }
    function requestGifBounds(start, end, changed, modal) {
        var max = getGifRangeMax();
        if (!canApplyRange(start, end, max, changed, modal)) {
            setGifBounds(lastValidGifStart, lastValidGifEnd, "both");
            return false;
        }
        setGifBounds(start, end, changed);
        return true;
    }
    function updateClipRangeLimits() {
        setClipBounds(Number($("#clipStart").value) || 0, Number($("#clipEnd").value) || 10, "both");
    }
    function updateGifRangeLimits() {
        setGifBounds(Number($("#gifStart").value) || 0, Number($("#gifEnd").value) || 3, "both");
    }
    function updateTimelineLimits() {
        updateClipRangeLimits();
        updateGifRangeLimits();
    }
    function updateVideoPreview() {
        var box = $("#videoPreviewBox");
        var video = $("#videoPreview");
        var shouldShow = !!singleFile && (currentTool === "clip" || currentTool === "gif") && String(singleFile.type || "").indexOf("video/") === 0;
        box.classList.toggle("show", shouldShow);
        clearPreviewStopTimer();
        if (!shouldShow) {
            video.pause();
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                previewUrl = "";
            }
            video.removeAttribute("src");
            video.load();
            return;
        }
        if (!previewUrl) {
            previewUrl = URL.createObjectURL(singleFile);
            video.src = previewUrl;
        }
        updateTimelineLimits();
    }
    function syncClipStartFromPreview() {
        var start = getPreviewCurrentTime();
        if (start === null) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        if (currentTool === "gif") {
            requestGifBounds(start, Number($("#gifEnd").value) || 3, "start", true);
        }
        else {
            requestClipBounds(start, Number($("#clipEnd").value) || 10, "start", true);
        }
    }
    function syncClipEndFromPreview() {
        var end = getPreviewCurrentTime();
        if (end === null) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        if (currentTool === "gif") {
            var gifStart = Number($("#gifStart").value) || 0;
            requestGifBounds(gifStart, end, "end", true);
        }
        else {
            var clipStart = Number($("#clipStart").value) || 0;
            requestClipBounds(clipStart, end, "end", true);
        }
    }
    function previewClipRange() {
        var video = $("#videoPreview");
        if (!video.src)
            return;
        var isGif = currentTool === "gif";
        var start = Math.max(0, Number($(isGif ? "#gifStart" : "#clipStart").value) || 0);
        var end = Number($(isGif ? "#gifEnd" : "#clipEnd").value) || (start + (isGif ? 3 : 10));
        var max = isGif ? getGifRangeMax() : getClipRangeMax();
        if (!canApplyRange(start, end, max, "both", true))
            return;
        var duration = Math.max(0.1, end - start);
        video.currentTime = start;
        video.play();
        clearPreviewStopTimer();
        previewStopTimer = window.setTimeout(function () {
            video.pause();
        }, duration * 1000);
    }
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var existing = document.querySelector('script[data-ffmpeg-core="true"]');
            if (existing) {
                resolve();
                return;
            }
            var script = document.createElement("script");
            script.src = src;
            script.dataset.ffmpegCore = "true";
            script.onload = function () { resolve(); };
            script.onerror = function () { reject(new Error(t("engineMissing"))); };
            document.head.appendChild(script);
        });
    }
    function openResourceCacheDb() {
        return new Promise(function (resolve, reject) {
            if (!("indexedDB" in window)) {
                reject(new Error("IndexedDB unavailable"));
                return;
            }
            var request = indexedDB.open(RESOURCE_CACHE_DB_NAME, RESOURCE_CACHE_DB_VERSION);
            request.onupgradeneeded = function () {
                var db = request.result;
                if (!db.objectStoreNames.contains(RESOURCE_CACHE_STORE_NAME)) {
                    db.createObjectStore(RESOURCE_CACHE_STORE_NAME, { keyPath: "id" });
                }
            };
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error); };
        });
    }
    function getCachedResource(resourceId) {
        return openResourceCacheDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                var transaction = db.transaction(RESOURCE_CACHE_STORE_NAME, "readonly");
                var request = transaction.objectStore(RESOURCE_CACHE_STORE_NAME).get(resourceId);
                request.onsuccess = function () { resolve(request.result || null); };
                request.onerror = function () { reject(request.error); };
                transaction.oncomplete = function () { db.close(); };
                transaction.onerror = function () {
                    db.close();
                    reject(transaction.error);
                };
            });
        });
    }
    async function loadCachedScript(resourceId) {
        var record = await getCachedResource(resourceId);
        if (!record || !record.content)
            return false;
        var blob = new Blob([record.content], { type: record.mimeType || "text/javascript" });
        var blobUrl = URL.createObjectURL(blob);
        try {
            await loadScript(blobUrl);
            return true;
        }
        finally {
            setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);
        }
    }
    async function loadWasmBinary() {
        if (localWasmBinary)
            return localWasmBinary;
        try {
            var cached = await getCachedResource(FFMPEG_CORE_WASM_RESOURCE_ID);
            if (cached && cached.content) {
                localWasmBinary = cached.content;
                appendLog(t("wasmSelected"));
                updateEngineStatus();
                return localWasmBinary;
            }
        }
        catch (_cacheError) { }
        throw new Error(t("wasmNeedsCache"));
    }
    async function getCore() {
        if (ffmpegCore)
            return ffmpegCore;
        if (!corePromise) {
            corePromise = (async function () {
                updateEngineStatus();
                var scriptLoadedFromCache = false;
                try {
                    scriptLoadedFromCache = await loadCachedScript(FFMPEG_CORE_JS_RESOURCE_ID);
                }
                catch (_cacheError) { }
                if (!scriptLoadedFromCache)
                    throw new Error(t("wasmNeedsCache"));
                var wasmBinary = await loadWasmBinary();
                var factory = window.createFFmpegCore;
                if (typeof factory !== "function")
                    throw new Error(t("engineMissing"));
                var core = await factory({
                    wasmBinary: wasmBinary,
                    logger: function (event) {
                        if (event && event.message)
                            appendLog(event.message);
                    },
                    progress: function (event) {
                        if (event && Number.isFinite(event.progress)) {
                            $("#statusLine").textContent = t("running") + " " + Math.round(event.progress * 100) + "%";
                        }
                    }
                });
                ffmpegCore = core;
                updateEngineStatus();
                return core;
            })().catch(function (error) {
                corePromise = null;
                updateEngineStatus();
                throw error;
            });
        }
        return corePromise;
    }
    function safeUnlink(core, path) {
        try {
            core.FS.unlink(path);
        }
        catch (_error) { }
    }
    async function writeFileToCore(core, path, file) {
        setStatus("loadingFile");
        var bytes = new Uint8Array(await file.arrayBuffer());
        setStatus("writingFile");
        safeUnlink(core, path);
        core.FS.writeFile(path, bytes);
    }
    function readOutputBlob(core, path, ext) {
        var data = core.FS.readFile(path);
        return new Blob([data.buffer || data], { type: MIME[ext] || "application/octet-stream" });
    }
    function showDownload(blob, name) {
        var url = URL.createObjectURL(blob);
        var box = $("#resultBox");
        box.dataset.hasOutput = "true";
        box.innerHTML = "";
        var link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.textContent = t("download") + " " + name;
        box.appendChild(link);
    }
    function showSummary(items) {
        $("#summary").innerHTML = items.map(function (item) {
            return '<div class="summary-item"><strong>' + item.label + "</strong>" + item.value + "</div>";
        }).join("");
    }
    function showTextOutput(text) {
        var box = $("#resultBox");
        box.dataset.hasOutput = "true";
        box.innerHTML = "<pre></pre>";
        box.querySelector("pre").textContent = text || "-";
    }
    async function runFFmpeg(args) {
        var core = await getCore();
        setStatus("running");
        appendLog("$ ffmpeg " + args.join(" "));
        var ret = core.exec.apply(core, args);
        if (ret !== 0)
            throw new Error("FFmpeg exited with code " + ret);
        return core;
    }
    async function runFFprobe(args) {
        var core = await getCore();
        setStatus("running");
        appendLog("$ ffprobe " + args.join(" "));
        var stdout = [];
        var oldLogger = null;
        core.setLogger(function (event) {
            if (!event || !event.message)
                return;
            if (event.type === "stdout")
                stdout.push(event.message);
            appendLog(event.message);
        });
        var ret = 0;
        var probeError = null;
        try {
            ret = core.ffprobe.apply(core, args);
        }
        catch (error) {
            ret = -1;
            probeError = error;
        }
        core.setLogger(function (event) {
            if (event && event.message)
                appendLog(event.message);
        });
        var output = stdout.join("\n");
        if (probeError)
            appendLog((probeError && probeError.message) || String(probeError));
        if (ret !== 0 && !output.trim())
            throw new Error("FFprobe exited with code " + ret);
        if (ret !== 0)
            appendLog("FFprobe returned " + ret + ", using captured output.");
        return output;
    }
    async function runFFmpegProbe(inputName) {
        var core = await getCore();
        setStatus("running");
        appendLog("$ ffmpeg -hide_banner -i " + inputName);
        var lines = [];
        core.setLogger(function (event) {
            if (!event || !event.message)
                return;
            lines.push(event.message);
            appendLog(event.message);
        });
        var execError = null;
        try {
            core.exec("-hide_banner", "-i", inputName);
        }
        catch (error) {
            execError = error;
        }
        core.setLogger(function (event) {
            if (event && event.message)
                appendLog(event.message);
        });
        var output = lines.join("\n");
        if (!output.trim())
            throw new Error("Unable to read metadata.");
        if (execError)
            appendLog("FFmpeg probe returned a non-zero exit after printing metadata.");
        return output;
    }
    function durationToSeconds(value) {
        var match = String(value || "").match(/(\d+):(\d+):(\d+(?:\.\d+)?)/);
        if (!match)
            return null;
        return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    }
    function parseFfmpegProbeOutput(text, file) {
        var formatMatch = text.match(/Input #0,\s*([^,]+(?:,[^,]+)*),\s*from/);
        var durationMatch = text.match(/Duration:\s*([^,]+),/);
        var bitrateMatch = text.match(/bitrate:\s*([0-9.]+)\s*kb\/s/i);
        var streams = [];
        text.split(/\r?\n/).forEach(function (line) {
            var streamMatch = line.match(/Stream #\d+:\d+(?:\([^)]+\))?(?:\[[^\]]+\])?:\s*([^:]+):\s*([^,\s]+)/);
            if (!streamMatch)
                return;
            streams.push({
                codec_type: streamMatch[1].trim().toLowerCase(),
                codec_name: streamMatch[2].trim(),
                raw: line.trim()
            });
        });
        var duration = durationMatch ? durationToSeconds(durationMatch[1]) : null;
        return {
            format: {
                filename: file.name,
                format_name: formatMatch ? formatMatch[1].trim() : getExt(file.name),
                duration: duration,
                bit_rate: bitrateMatch ? String(Math.round(Number(bitrateMatch[1]) * 1000)) : ""
            },
            streams: streams,
            raw: text
        };
    }
    function renderMetadata(parsed, fallbackText) {
        if (parsed && parsed.format) {
            var streams = (parsed.streams || []).map(function (stream) {
                return (stream.codec_type || "?") + ": " + (stream.codec_name || "?");
            }).join(", ");
            showSummary([
                { label: t("format"), value: parsed.format.format_name || "-" },
                { label: t("duration"), value: formatDuration(parsed.format.duration) },
                { label: t("bitrate"), value: parsed.format.bit_rate ? Math.round(Number(parsed.format.bit_rate) / 1000) + " kbps" : "-" },
                { label: t("streams"), value: streams || "-" }
            ]);
            showTextOutput(JSON.stringify(parsed, null, 2));
        }
        else {
            showTextOutput(fallbackText || logLines.join("\n"));
        }
    }
    async function prepareSingleInput() {
        if (!singleFile)
            throw new Error(t("needSingle"));
        var core = await getCore();
        core.reset();
        var inputName = "input." + getExt(singleFile.name);
        await writeFileToCore(core, inputName, singleFile);
        return { core: core, inputName: inputName, file: singleFile };
    }
    async function handleMetadata() {
        var prepared = await prepareSingleInput();
        var parsed = null;
        var output = "";
        try {
            output = await runFFprobe(["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", prepared.inputName]);
            try {
                parsed = JSON.parse(output);
            }
            catch (_parseError) { }
        }
        catch (error) {
            appendLog((error && error.message) || String(error));
        }
        if (!parsed || !parsed.format) {
            output = await runFFmpegProbe(prepared.inputName);
            parsed = parseFfmpegProbeOutput(output, prepared.file);
        }
        renderMetadata(parsed, output);
        safeUnlink(prepared.core, prepared.inputName);
    }
    async function handleAudio() {
        var prepared = await prepareSingleInput();
        var format = $("#audioFormat").value;
        var outputName = fileName(prepared.file.name, format);
        var args = ["-i", prepared.inputName, "-vn"];
        if (format === "mp3")
            args.push("-codec:a", "libmp3lame", "-q:a", "2");
        if (format === "wav")
            args.push("-acodec", "pcm_s16le");
        if (format === "aac")
            args.push("-acodec", "aac", "-b:a", "192k");
        if (format === "m4a")
            args.push("-c:a", "aac", "-b:a", "192k");
        args.push(outputName);
        var core = await runFFmpeg(args);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleRemux() {
        var prepared = await prepareSingleInput();
        var format = $("#containerFormat").value;
        var outputName = fileName(prepared.file.name, format);
        var core = await runFFmpeg(["-i", prepared.inputName, "-map", "0", "-c", "copy", outputName]);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleClip() {
        var prepared = await prepareSingleInput();
        var start = Math.max(0, Number($("#clipStart").value) || 0);
        var end = Number($("#clipEnd").value) || (start + 10);
        if (!canApplyRange(start, end, getClipRangeMax(), "both", true))
            return;
        var duration = Math.max(0.1, end - start);
        var format = $("#clipFormat").value;
        var outputName = fileName(prepared.file.name, "clip." + format);
        var core = await runFFmpeg(["-ss", String(start), "-t", String(duration), "-i", prepared.inputName, "-map", "0", "-c", "copy", "-avoid_negative_ts", "make_zero", outputName]);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("duration"), value: duration + "s" }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleConcat() {
        if (multiFiles.length < 2)
            throw new Error(t("needMultiple"));
        var core = await getCore();
        core.reset();
        var listText = "";
        for (var i = 0; i < multiFiles.length; i++) {
            var inputName = "concat_" + i + "." + getExt(multiFiles[i].name);
            await writeFileToCore(core, inputName, multiFiles[i]);
            listText += "file '" + inputName + "'\n";
        }
        safeUnlink(core, "concat.txt");
        core.FS.writeFile("concat.txt", listText);
        var outputName = "stitched-output.mp4";
        await runFFmpeg(["-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", outputName]);
        showDownload(readOutputBlob(core, outputName, "mp4"), outputName);
        showSummary([{ label: t("streams"), value: String(multiFiles.length) }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        multiFiles.forEach(function (file, index) { safeUnlink(core, "concat_" + index + "." + getExt(file.name)); });
        safeUnlink(core, "concat.txt");
        safeUnlink(core, outputName);
    }
    async function handleGif() {
        var prepared = await prepareSingleInput();
        var start = Math.max(0, Number($("#gifStart").value) || 0);
        var end = Number($("#gifEnd").value) || (start + 3);
        if (!canApplyRange(start, end, getGifRangeMax(), "both", true))
            return;
        var duration = Math.max(0.1, end - start);
        var width = Math.max(80, Number($("#gifWidth").value) || 480);
        var fps = Math.max(1, Math.min(30, Number($("#gifFps").value) || 12));
        var outputName = fileName(prepared.file.name, "gif");
        var filter = "fps=" + fps + ",scale=" + width + ":-1:flags=lanczos";
        var core = await runFFmpeg(["-ss", String(start), "-t", String(duration), "-i", prepared.inputName, "-vf", filter, "-loop", "0", outputName]);
        showDownload(readOutputBlob(core, outputName, "gif"), outputName);
        showSummary([{ label: t("duration"), value: duration + "s" }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function runAction(action) {
        if (running)
            return;
        running = true;
        $$(".run-btn").forEach(function (button) { button.disabled = true; });
        clearRunOutput();
        setStatus("processing");
        try {
            if (action === "metadata")
                await handleMetadata();
            if (action === "audio")
                await handleAudio();
            if (action === "remux")
                await handleRemux();
            if (action === "clip")
                await handleClip();
            if (action === "concat")
                await handleConcat();
            if (action === "gif")
                await handleGif();
            setStatus("done");
        }
        catch (error) {
            setStatus("failed");
            appendLog((error && error.message) || String(error));
            $("#resultBox").textContent = (error && error.message) || String(error);
            $("#resultBox").dataset.hasOutput = "true";
        }
        finally {
            running = false;
            $$(".run-btn").forEach(function (button) { button.disabled = false; });
        }
    }
    function renderFiles() {
        var files = currentTool === "concat" ? multiFiles : (singleFile ? [singleFile] : []);
        $("#fileList").innerHTML = "";
        files.forEach(function (file, index) {
            var li = document.createElement("li");
            li.className = "file-item";
            li.innerHTML = [
                "<div>",
                '<div class="file-name">' + escapeHtml(file.name) + "</div>",
                '<div class="file-sub">' + formatBytes(file.size) + " · " + (file.type || getExt(file.name)) + "</div>",
                "</div>",
                '<div class="mini-actions">',
                currentTool === "concat" ? '<button type="button" data-action="up" title="' + t("moveUp") + '">↑</button>' : "",
                currentTool === "concat" ? '<button type="button" data-action="down" title="' + t("moveDown") + '">↓</button>' : "",
                '<button type="button" data-action="remove" title="' + t("remove") + '">×</button>',
                "</div>"
            ].join("");
            li.querySelector(".mini-actions").addEventListener("click", function (event) {
                var action = event.target.dataset.action;
                if (currentTool === "concat" && action === "up" && index > 0) {
                    var up = multiFiles.splice(index, 1)[0];
                    multiFiles.splice(index - 1, 0, up);
                }
                if (currentTool === "concat" && action === "down" && index < multiFiles.length - 1) {
                    var down = multiFiles.splice(index, 1)[0];
                    multiFiles.splice(index + 1, 0, down);
                }
                if (action === "remove") {
                    if (currentTool === "concat")
                        multiFiles.splice(index, 1);
                    else
                        singleFile = null;
                }
                renderFiles();
                updateVideoPreview();
            });
            $("#fileList").appendChild(li);
        });
    }
    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (char) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
        });
    }
    function setTool(tool) {
        currentTool = tool;
        $$(".tabs button").forEach(function (button) {
            button.classList.toggle("active", button.dataset.tool === tool);
        });
        $$(".tool-panel").forEach(function (panel) {
            panel.classList.toggle("active", panel.id === "panel-" + tool);
        });
        $("#singleUpload").classList.toggle("hidden", tool === "concat");
        $("#multiUpload").classList.toggle("hidden", tool !== "concat");
        renderFiles();
        updateVideoPreview();
    }
    setupUpload($("#singleUpload"), $("#singleFileInput"), function (files) {
        singleFile = files.find(function (file) { return file.type.indexOf("video/") === 0 || file.type.indexOf("audio/") === 0; }) || files[0] || null;
        renderFiles();
        updateVideoPreview();
        if (singleFile)
            $("#statusLine").textContent = singleFile.name;
    });
    setupUpload($("#multiUpload"), $("#multiFileInput"), function (files) {
        multiFiles = multiFiles.concat(files.filter(function (file) {
            return file.type.indexOf("video/") === 0 || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);
        }));
        renderFiles();
        if (multiFiles.length)
            $("#statusLine").textContent = multiFiles.length + " " + t("concatTab");
    });
    $$(".tabs button").forEach(function (button) {
        button.addEventListener("click", function () { setTool(button.dataset.tool); });
    });
    $$(".run-btn").forEach(function (button) {
        button.addEventListener("click", function () { runAction(button.dataset.action); });
    });
    $("#usePreviewStart").addEventListener("click", syncClipStartFromPreview);
    $("#usePreviewEnd").addEventListener("click", syncClipEndFromPreview);
    $("#previewClipRange").addEventListener("click", previewClipRange);
    $("#clipStartRange").addEventListener("input", function () {
        requestClipBounds(Number($("#clipStartRange").value) || 0, Number($("#clipEndRange").value) || 10, "start", false);
    });
    $("#clipEndRange").addEventListener("input", function () {
        requestClipBounds(Number($("#clipStartRange").value) || 0, Number($("#clipEndRange").value) || 10, "end", false);
    });
    $("#clipStart").addEventListener("change", function () {
        requestClipBounds(Number($("#clipStart").value) || 0, Number($("#clipEnd").value) || 10, "start", true);
    });
    $("#clipEnd").addEventListener("change", function () {
        requestClipBounds(Number($("#clipStart").value) || 0, Number($("#clipEnd").value) || 10, "end", true);
    });
    $("#gifStartRange").addEventListener("input", function () {
        requestGifBounds(Number($("#gifStartRange").value) || 0, Number($("#gifEndRange").value) || 3, "start", false);
    });
    $("#gifEndRange").addEventListener("input", function () {
        requestGifBounds(Number($("#gifStartRange").value) || 0, Number($("#gifEndRange").value) || 3, "end", false);
    });
    $("#gifStart").addEventListener("change", function () {
        requestGifBounds(Number($("#gifStart").value) || 0, Number($("#gifEnd").value) || 3, "start", true);
    });
    $("#gifEnd").addEventListener("change", function () {
        requestGifBounds(Number($("#gifStart").value) || 0, Number($("#gifEnd").value) || 3, "end", true);
    });
    $("#videoPreview").addEventListener("pause", clearPreviewStopTimer);
    $("#videoPreview").addEventListener("loadedmetadata", updateTimelineLimits);
    $("#pickResourceDirButton").addEventListener("click", async function () {
        if (running || ffmpegCore || corePromise)
            return;
        clearRunOutput();
        try {
            setStatus("loadingFile");
            await getCore();
        }
        catch (error) {
            setStatus("failed");
            appendLog((error && error.message) || String(error));
            $("#resultBox").textContent = (error && error.message) || String(error);
            $("#resultBox").dataset.hasOutput = "true";
        }
    });
    $$(".language button[data-lang]").forEach(function (button) {
        button.addEventListener("click", function () {
            var nextLanguage = button.dataset.lang;
            if (nextLanguage !== "zh" && nextLanguage !== "en")
                return;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
            applyLanguage(nextLanguage);
        });
    });
    $("#themeButton").addEventListener("click", function () {
        var nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    });
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
            var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
            if (saved === "dark" || saved === "light")
                return;
            applyTheme(event.matches ? "dark" : "light");
        });
    }
    applyTheme(resolveInitialTheme());
    applyLanguage(currentLanguage);
    setTool("metadata");
})();
