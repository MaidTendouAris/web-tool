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
    const FFMPEG_CORE_JS_RESOURCE_ID = "ffmpeg-core-js";
    const FFMPEG_CORE_WASM_RESOURCE_ID = "ffmpeg-core-wasm";
    const MIME = {
        mp3: "audio/mpeg",
        aac: "audio/aac",
        ogg: "audio/ogg",
        m4a: "audio/mp4",
        wav: "audio/wav",
        flac: "audio/flac",
        opus: "audio/opus"
    };
    const TEXT = {
        zh: {
            htmlLang: "zh-CN",
            title: "音频处理",
            home: "工具集",
            themeToggle: "切换主题",
            lead: "使用本地 FFmpeg.wasm 资源进行音频转换、剪切、转封装、元数据编辑、预览和音量处理。",
            engineIdle: "尚未加载",
            engineLoading: "正在加载本地 FFmpeg 资源...",
            engineReady: "已加载，可开始处理",
            engineLoadButton: "加载本地核心",
            engineMissing: "未找到 FFmpeg 资源，请先在入口页资源管理中导入或下载。",
            wasmNeedsCache: "浏览器无法读取 FFmpeg 资源。请回到入口页资源管理，导入或下载 ffmpeg-core.js 与 ffmpeg-core.wasm 到浏览器缓存。",
            wasmSelected: "已读取 ffmpeg-core.wasm",
            convertTab: "格式转换",
            cutTab: "裁剪片段",
            remuxTab: "转封装",
            metadataTab: "元数据",
            volumeTab: "音量增益",
            inputTitle: "输入文件",
            uploadTitle: "选择或拖放音频文件",
            uploadHint: "支持 MP3/AAC/OGG/M4A/WAV/FLAC/OPUS 等常见格式。",
            resourceWarning: "需要先在入口页资源管理中导入或下载 ffmpeg-core.js 和 ffmpeg-core.wasm 到浏览器缓存。进入本页后仍需点击“加载本地核心”或在处理时自动加载。",
            usePreviewStart: "使用当前时间为开始",
            usePreviewEnd: "使用当前时间为结束",
            previewRange: "预览片段范围",
            settingsTitle: "处理设置",
            convertFormat: "输出格式",
            quality: "编码参数",
            advancedArgs: "高级 FFmpeg 参数",
            convert: "转换音频",
            range: "裁剪范围",
            start: "开始时间（秒）",
            end: "结束时间（秒）",
            duration: "时长（秒）",
            cutFormat: "输出容器",
            cutArgs: "剪切参数",
            cut: "裁剪片段",
            remuxFormat: "目标容器",
            remuxArgs: "转封装参数",
            remux: "转封装",
            metadataHelp: "读取完整媒体元数据；可编辑常见标签并写入新文件。",
            readMetadata: "读取元数据",
            writeMetadata: "写入元数据",
            metaTitle: "标题",
            metaArtist: "艺术家",
            metaAlbum: "专辑",
            metaAlbumArtist: "专辑艺术家",
            metaDate: "日期",
            metaGenre: "流派",
            metaTrack: "音轨",
            metaComposer: "作曲",
            metaComment: "注释",
            metaExtra: "额外标签（每行 key=value）",
            gain: "音量增益（dB）",
            volumeFormat: "输出格式",
            volumeArgs: "编码参数",
            volume: "应用增益",
            outputTitle: "输出",
            logTitle: "日志",
            waitingInput: "等待输入文件",
            noOutput: "暂无输出",
            loadingFile: "正在读取文件...",
            writingFile: "正在写入虚拟文件系统...",
            running: "正在运行 FFmpeg...",
            done: "处理完成",
            failed: "处理失败",
            needFile: "请先选择一个音频文件。",
            waveformFailed: "浏览器无法解码该音频用于波形预览，但仍可用 FFmpeg 处理。",
            invalidPreviewTime: "无法读取当前播放时间，请先选择音频并等待预览加载完成。",
            invalidStartAfterEnd: "开始时间必须早于结束时间。",
            invalidEndBeforeStart: "结束时间必须晚于开始时间。",
            invalidTimeRange: "时间范围超出音频时长，请重新选择。",
            download: "下载",
            format: "格式",
            size: "大小",
            bitrate: "码率",
            streams: "流",
            remove: "移除"
        },
        en: {
            htmlLang: "en",
            title: "Audio Processing",
            home: "Tools",
            themeToggle: "Toggle theme",
            lead: "Use local FFmpeg.wasm resources for audio conversion, trimming, remuxing, metadata editing, preview, and gain processing.",
            engineIdle: "Not loaded",
            engineLoading: "Loading local FFmpeg resources...",
            engineReady: "Loaded and ready",
            engineLoadButton: "Load Local Core",
            engineMissing: "FFmpeg resources were not found. Import or download them from Resource Management first.",
            wasmNeedsCache: "The browser could not read FFmpeg resources. Go back to Resource Management and import or download ffmpeg-core.js and ffmpeg-core.wasm into browser cache.",
            wasmSelected: "ffmpeg-core.wasm loaded",
            convertTab: "Convert",
            cutTab: "Trim",
            remuxTab: "Remux",
            metadataTab: "Metadata",
            volumeTab: "Gain",
            inputTitle: "Input File",
            uploadTitle: "Choose or drop an audio file",
            uploadHint: "Supports common formats such as MP3, AAC, OGG, M4A, WAV, FLAC, and OPUS.",
            resourceWarning: "Import or download ffmpeg-core.js and ffmpeg-core.wasm into browser cache from Resource Management first. This page still loads the local core before processing.",
            usePreviewStart: "Use Current Time as Start",
            usePreviewEnd: "Use Current Time as End",
            previewRange: "Preview Range",
            settingsTitle: "Settings",
            convertFormat: "Output format",
            quality: "Encoding args",
            advancedArgs: "Advanced FFmpeg args",
            convert: "Convert Audio",
            range: "Trim range",
            start: "Start time (s)",
            end: "End time (s)",
            duration: "Duration (s)",
            cutFormat: "Output container",
            cutArgs: "Trim args",
            cut: "Trim Clip",
            remuxFormat: "Target container",
            remuxArgs: "Remux args",
            remux: "Remux",
            metadataHelp: "Read full media metadata. Edit common tags and write them into a new file.",
            readMetadata: "Read Metadata",
            writeMetadata: "Write Metadata",
            metaTitle: "Title",
            metaArtist: "Artist",
            metaAlbum: "Album",
            metaAlbumArtist: "Album artist",
            metaDate: "Date",
            metaGenre: "Genre",
            metaTrack: "Track",
            metaComposer: "Composer",
            metaComment: "Comment",
            metaExtra: "Extra tags (one key=value per line)",
            gain: "Gain (dB)",
            volumeFormat: "Output format",
            volumeArgs: "Encoding args",
            volume: "Apply Gain",
            outputTitle: "Output",
            logTitle: "Log",
            waitingInput: "Waiting for input",
            noOutput: "No output yet",
            loadingFile: "Reading file...",
            writingFile: "Writing virtual file system...",
            running: "Running FFmpeg...",
            done: "Done",
            failed: "Failed",
            needFile: "Choose one audio file first.",
            waveformFailed: "The browser could not decode this audio for waveform preview, but FFmpeg processing can still run.",
            invalidPreviewTime: "Cannot read the current playback time. Choose audio and wait for preview metadata.",
            invalidStartAfterEnd: "Start time must be earlier than end time.",
            invalidEndBeforeStart: "End time must be later than start time.",
            invalidTimeRange: "The time range is outside the audio duration. Choose another range.",
            download: "Download",
            format: "Format",
            size: "Size",
            bitrate: "Bitrate",
            streams: "Streams",
            remove: "Remove"
        }
    };
    var $ = function (selector) { return document.querySelector(selector); };
    var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };
    var currentLanguage = resolveInitialLanguage();
    var currentTool = "convert";
    var singleFile = null;
    var previewUrl = "";
    var previewStopTimer = null;
    var lastValidStart = 0;
    var lastValidEnd = 10;
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
        if (browserLanguage.startsWith("zh"))
            return "zh";
        if (browserLanguage.startsWith("en"))
            return "en";
        return "en";
    }
    function resolveInitialTheme() {
        var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return saved;
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
    }
    function setText(selector, key) {
        var element = $(selector);
        if (element)
            element.textContent = t(key);
    }
    function setButtonText(selector, key) {
        $$(selector).forEach(function (button) { button.textContent = t(key); });
    }
    function applyLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = t("htmlLang");
        document.title = t("title");
        setText("#homeLink", "home");
        setText("#pageTitle", "title");
        setText("#pageLead", "lead");
        setText("#loadCoreButton", "engineLoadButton");
        setText('[data-tool="convert"]', "convertTab");
        setText('[data-tool="cut"]', "cutTab");
        setText('[data-tool="remux"]', "remuxTab");
        setText('[data-tool="metadata"]', "metadataTab");
        setText('[data-tool="volume"]', "volumeTab");
        setText("#inputTitle", "inputTitle");
        setText("#uploadTitle", "uploadTitle");
        setText("#uploadHint", "uploadHint");
        setText("#resourceWarning", "resourceWarning");
        setText("#usePreviewStart", "usePreviewStart");
        setText("#usePreviewEnd", "usePreviewEnd");
        setText("#previewRange", "previewRange");
        setText("#settingsTitle", "settingsTitle");
        setText("#convertFormatLabel", "convertFormat");
        setText("#qualityLabel", "quality");
        setText("#advancedArgsLabel", "advancedArgs");
        setText("#rangeLabel", "range");
        setText("#startLabel", "start");
        setText("#endLabel", "end");
        setText("#durationLabel", "duration");
        setText("#cutFormatLabel", "cutFormat");
        setText("#cutArgsLabel", "cutArgs");
        setText("#remuxFormatLabel", "remuxFormat");
        setText("#remuxArgsLabel", "remuxArgs");
        setText("#metadataHelp", "metadataHelp");
        setText("#metaTitleLabel", "metaTitle");
        setText("#metaArtistLabel", "metaArtist");
        setText("#metaAlbumLabel", "metaAlbum");
        setText("#metaAlbumArtistLabel", "metaAlbumArtist");
        setText("#metaDateLabel", "metaDate");
        setText("#metaGenreLabel", "metaGenre");
        setText("#metaTrackLabel", "metaTrack");
        setText("#metaComposerLabel", "metaComposer");
        setText("#metaCommentLabel", "metaComment");
        setText("#metaExtraLabel", "metaExtra");
        setText("#gainLabel", "gain");
        setText("#volumeFormatLabel", "volumeFormat");
        setText("#volumeArgsLabel", "volumeArgs");
        setText("#outputTitle", "outputTitle");
        setText("#logTitle", "logTitle");
        setButtonText('[data-action="convert"]', "convert");
        setButtonText('[data-action="cut"]', "cut");
        setButtonText('[data-action="remux"]', "remux");
        setButtonText('[data-action="read-metadata"]', "readMetadata");
        setButtonText('[data-action="write-metadata"]', "writeMetadata");
        setButtonText('[data-action="volume"]', "volume");
        $$(".language button[data-lang]").forEach(function (button) {
            button.classList.toggle("active", button.dataset.lang === language);
        });
        updateEngineStatus();
        renderFile();
        if (!$("#resultBox").dataset.hasOutput)
            $("#resultBox").textContent = t("noOutput");
        if (!singleFile)
            $("#statusLine").textContent = t("waitingInput");
    }
    function updateEngineStatus() {
        if (ffmpegCore)
            $("#engineStatus").textContent = t("engineReady");
        else if (corePromise)
            $("#engineStatus").textContent = t("engineLoading");
        else
            $("#engineStatus").textContent = t("engineIdle");
    }
    function appendLog(message) {
        logLines.push("[" + new Date().toLocaleTimeString() + "] " + message);
        $("#logBox").textContent = logLines.join("\n");
        $("#logBox").scrollTop = $("#logBox").scrollHeight;
    }
    function setStatus(key) {
        $("#statusLine").textContent = t(key);
    }
    function formatBytes(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0)
            return "0 B";
        var units = ["B", "KB", "MB", "GB"];
        var value = bytes;
        var index = 0;
        while (value >= 1024 && index < units.length - 1) {
            value /= 1024;
            index++;
        }
        return (index === 0 ? value.toFixed(0) : value.toFixed(2)) + " " + units[index];
    }
    function formatSeconds(value) {
        return value.toFixed(1);
    }
    function getExt(name) {
        var match = /\.([^.]+)$/.exec(name);
        return match ? match[1].toLowerCase() : "bin";
    }
    function fileName(sourceName, suffix) {
        return sourceName.replace(/\.[^.]+$/, "") + "." + suffix;
    }
    function splitArgs(text) {
        var matches = (text || "").match(/"[^"]*"|'[^']*'|\S+/g) || [];
        return matches.map(function (part) { return part.replace(/^["']|["']$/g, ""); });
    }
    function audioEncodeArgs(format) {
        var args = {
            mp3: "-vn -c:a libmp3lame -b:a 192k",
            aac: "-vn -c:a aac -b:a 192k",
            ogg: "-vn -c:a libvorbis -q:a 5",
            m4a: "-vn -c:a aac -b:a 192k",
            wav: "-vn -c:a pcm_s16le",
            flac: "-vn -c:a flac",
            opus: "-vn -c:a libopus -b:a 128k"
        };
        return args[format] || "-vn";
    }
    function cutEncodeArgs(format) {
        return audioEncodeArgs(format) + " -avoid_negative_ts make_zero";
    }
    function clearPreviewStopTimer() {
        if (previewStopTimer) {
            window.clearTimeout(previewStopTimer);
            previewStopTimer = null;
        }
    }
    function clearRunOutput() {
        $("#summary").innerHTML = "";
        $("#resultBox").dataset.hasOutput = "";
        $("#resultBox").textContent = t("noOutput");
    }
    function clamp(value, min, max) {
        if (!Number.isFinite(value))
            return min;
        return Math.min(max, Math.max(min, value));
    }
    function getMediaDuration() {
        var audio = $("#audioPlayer");
        var duration = Number(audio.duration);
        var fallbackEnd = Number($("#cutEnd").value) || 10;
        return Math.max(0.1, Number.isFinite(duration) && duration > 0 ? duration : fallbackEnd);
    }
    function updateRangeFill(start, end, max) {
        var left = clamp(start / max * 100, 0, 100);
        var right = clamp(end / max * 100, 0, 100);
        $("#cutRangeFill").style.left = left + "%";
        $("#cutRangeFill").style.width = Math.max(0, right - left) + "%";
    }
    function setCutBounds(start, end) {
        var max = getMediaDuration();
        var nextStart = clamp(start, 0, max);
        var nextEnd = clamp(end, 0, max);
        if (nextEnd - nextStart < 0.1) {
            nextStart = lastValidStart;
            nextEnd = lastValidEnd;
        }
        var duration = Math.max(0.1, nextEnd - nextStart);
        $("#cutStart").value = formatSeconds(nextStart);
        $("#cutEnd").value = formatSeconds(nextEnd);
        $("#cutDuration").value = formatSeconds(duration);
        $("#cutStartRange").max = formatSeconds(max);
        $("#cutEndRange").max = formatSeconds(max);
        $("#cutStartRange").value = formatSeconds(nextStart);
        $("#cutEndRange").value = formatSeconds(nextEnd);
        $("#cutRangeLabel").textContent = formatSeconds(nextStart) + "s - " + formatSeconds(nextEnd) + "s";
        updateRangeFill(nextStart, nextEnd, max);
        lastValidStart = nextStart;
        lastValidEnd = nextEnd;
    }
    function showRangeError(message, modal) {
        $("#statusLine").textContent = message;
        if (modal)
            alert(message);
    }
    function requestCutBounds(start, end, changed, modal) {
        var max = getMediaDuration();
        if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > max) {
            showRangeError(t("invalidTimeRange"), modal);
            setCutBounds(lastValidStart, lastValidEnd);
            return false;
        }
        if (end - start < 0.1) {
            showRangeError(changed === "end" ? t("invalidEndBeforeStart") : t("invalidStartAfterEnd"), modal);
            setCutBounds(lastValidStart, lastValidEnd);
            return false;
        }
        setCutBounds(start, end);
        return true;
    }
    function syncStartFromPreview() {
        var audio = $("#audioPlayer");
        var current = Number(audio.currentTime);
        if (!audio.src || !Number.isFinite(current)) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        requestCutBounds(current, Number($("#cutEnd").value), "start", true);
    }
    function syncEndFromPreview() {
        var audio = $("#audioPlayer");
        var current = Number(audio.currentTime);
        if (!audio.src || !Number.isFinite(current)) {
            showRangeError(t("invalidPreviewTime"), true);
            return;
        }
        requestCutBounds(Number($("#cutStart").value), current, "end", true);
    }
    function previewRange() {
        var audio = $("#audioPlayer");
        if (!audio.src)
            return;
        var start = Number($("#cutStart").value) || 0;
        var end = Number($("#cutEnd").value) || (start + 10);
        if (!requestCutBounds(start, end, "both", true))
            return;
        audio.currentTime = start;
        audio.play();
        clearPreviewStopTimer();
        previewStopTimer = window.setTimeout(function () {
            audio.pause();
        }, Math.max(0.1, end - start) * 1000);
    }
    function renderWaveform(buffer) {
        var canvas = $("#waveformCanvas");
        var ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--soft").trim() || "#eef2f7";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!buffer)
            return;
        var data = buffer.getChannelData(0);
        var step = Math.ceil(data.length / canvas.width);
        var amp = canvas.height / 2;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--blue").trim() || "#2563eb";
        ctx.beginPath();
        for (var x = 0; x < canvas.width; x++) {
            var min = 1;
            var max = -1;
            for (var i = 0; i < step; i++) {
                var sample = data[(x * step) + i] || 0;
                if (sample < min)
                    min = sample;
                if (sample > max)
                    max = sample;
            }
            ctx.moveTo(x, (1 + min) * amp);
            ctx.lineTo(x, (1 + max) * amp);
        }
        ctx.stroke();
    }
    async function drawWaveform(file) {
        try {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass)
                throw new Error("No AudioContext");
            var context = new AudioContextClass();
            var buffer = await context.decodeAudioData(await file.arrayBuffer());
            renderWaveform(buffer);
            if (typeof context.close === "function")
                context.close();
        }
        catch (_error) {
            renderWaveform(null);
            appendLog(t("waveformFailed"));
        }
    }
    function renderFile() {
        var box = $("#fileBox");
        box.innerHTML = "";
        if (!singleFile)
            return;
        var card = document.createElement("div");
        card.className = "file-card";
        card.innerHTML = [
            "<div>",
            '<div class="file-name">' + singleFile.name + "</div>",
            '<div class="file-meta">' + formatBytes(singleFile.size) + " · " + (singleFile.type || getExt(singleFile.name)) + "</div>",
            "</div>",
            '<button class="icon-btn" type="button" aria-label="' + t("remove") + '">×</button>'
        ].join("");
        card.querySelector("button")?.addEventListener("click", function () {
            singleFile = null;
            if (previewUrl)
                URL.revokeObjectURL(previewUrl);
            previewUrl = "";
            $("#audioPlayer").removeAttribute("src");
            $("#audioPlayer").load();
            $("#playerBox").classList.remove("show");
            renderWaveform(null);
            renderFile();
            setStatus("waitingInput");
        });
        box.appendChild(card);
    }
    async function loadFile(file) {
        singleFile = file;
        if (previewUrl)
            URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(file);
        $("#audioPlayer").src = previewUrl;
        $("#playerBox").classList.add("show");
        renderFile();
        setStatus("loadingFile");
        await drawWaveform(file);
        $("#statusLine").textContent = t("done");
    }
    function setupUpload() {
        var upload = $("#uploadLabel");
        upload.addEventListener("dragover", function (event) {
            event.preventDefault();
            upload.classList.add("dragover");
        });
        upload.addEventListener("dragleave", function () {
            upload.classList.remove("dragover");
        });
        upload.addEventListener("drop", function (event) {
            event.preventDefault();
            upload.classList.remove("dragover");
            var file = event.dataTransfer.files && event.dataTransfer.files[0];
            if (file)
                void loadFile(file);
        });
        $("#fileInput").addEventListener("change", function (event) {
            var file = event.target.files && event.target.files[0];
            if (file)
                void loadFile(file);
            event.target.value = "";
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
    async function prepareInput() {
        if (!singleFile)
            throw new Error(t("needFile"));
        var core = await getCore();
        core.reset();
        var inputName = "input." + getExt(singleFile.name);
        await writeFileToCore(core, inputName, singleFile);
        return { core: core, inputName: inputName, file: singleFile };
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
        core.setLogger(function (event) {
            if (!event || !event.message)
                return;
            if (event.type === "stdout")
                stdout.push(event.message);
            appendLog(event.message);
        });
        var ret = core.ffprobe.apply(core, args);
        var output = stdout.join("\n").trim();
        if (ret !== 0 && !output)
            throw new Error("FFprobe exited with code " + ret);
        return output;
    }
    async function handleReadMetadata() {
        var prepared = await prepareInput();
        var output = await runFFprobe(["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", prepared.inputName]);
        var parsed = null;
        try {
            parsed = JSON.parse(output);
        }
        catch (_error) { }
        if (parsed && parsed.format && parsed.format.tags)
            fillMetadata(parsed.format.tags);
        showTextOutput(parsed ? JSON.stringify(parsed, null, 2) : output);
        safeUnlink(prepared.core, prepared.inputName);
    }
    function fillMetadata(tags) {
        var lower = {};
        Object.keys(tags).forEach(function (key) { lower[key.toLowerCase()] = tags[key]; });
        $("#metaTitle").value = lower.title || "";
        $("#metaArtist").value = lower.artist || "";
        $("#metaAlbum").value = lower.album || "";
        $("#metaAlbumArtist").value = lower.album_artist || lower.albumartist || "";
        $("#metaDate").value = lower.date || lower.year || "";
        $("#metaGenre").value = lower.genre || "";
        $("#metaTrack").value = lower.track || "";
        $("#metaComposer").value = lower.composer || "";
        $("#metaComment").value = lower.comment || "";
    }
    function metadataArgs() {
        var pairs = [
            ["title", $("#metaTitle").value],
            ["artist", $("#metaArtist").value],
            ["album", $("#metaAlbum").value],
            ["album_artist", $("#metaAlbumArtist").value],
            ["date", $("#metaDate").value],
            ["genre", $("#metaGenre").value],
            ["track", $("#metaTrack").value],
            ["composer", $("#metaComposer").value],
            ["comment", $("#metaComment").value]
        ];
        ($("#metaExtra").value || "").split(/\r?\n/).forEach(function (line) {
            var index = line.indexOf("=");
            if (index > 0)
                pairs.push([line.slice(0, index).trim(), line.slice(index + 1).trim()]);
        });
        var args = [];
        pairs.forEach(function (pair) {
            if (!pair[0] || !pair[1])
                return;
            args.push("-metadata", pair[0] + "=" + pair[1]);
        });
        return args;
    }
    async function handleWriteMetadata() {
        var prepared = await prepareInput();
        var ext = getExt(prepared.file.name);
        var outputName = fileName(prepared.file.name, "metadata." + ext);
        var args = ["-i", prepared.inputName, "-map", "0", "-c", "copy"].concat(metadataArgs(), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(readOutputBlob(core, outputName, ext), outputName);
        showSummary([{ label: t("format"), value: ext.toUpperCase() }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleConvert() {
        var prepared = await prepareInput();
        var format = $("#convertFormat").value;
        var outputName = fileName(prepared.file.name, format);
        var args = ["-i", prepared.inputName].concat(splitArgs($("#encodeArgs").value), splitArgs($("#convertAdvancedArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleCut() {
        var prepared = await prepareInput();
        var start = Number($("#cutStart").value) || 0;
        var end = Number($("#cutEnd").value) || (start + 10);
        if (!requestCutBounds(start, end, "both", true))
            return;
        var format = $("#cutFormat").value;
        var outputName = fileName(prepared.file.name, "cut." + format);
        var args = ["-ss", String(start), "-to", String(end), "-i", prepared.inputName].concat(splitArgs($("#cutArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("duration"), value: formatSeconds(end - start) + "s" }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleRemux() {
        var prepared = await prepareInput();
        var format = $("#remuxFormat").value;
        var outputName = fileName(prepared.file.name, "remux." + format);
        var args = ["-i", prepared.inputName].concat(splitArgs($("#remuxArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function handleVolume() {
        var prepared = await prepareInput();
        var format = $("#volumeFormat").value;
        var gain = Number($("#gainInput").value) || 0;
        var outputName = fileName(prepared.file.name, "gain." + format);
        var args = ["-i", prepared.inputName, "-af", "volume=" + gain + "dB"].concat(splitArgs($("#volumeArgs").value), [outputName]);
        var core = await runFFmpeg(args);
        showDownload(readOutputBlob(core, outputName, format), outputName);
        showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("size"), value: formatBytes(core.FS.stat(outputName).size) }]);
        safeUnlink(core, prepared.inputName);
        safeUnlink(core, outputName);
    }
    async function runAction(action) {
        if (running)
            return;
        running = true;
        $$(".run-btn").forEach(function (button) { button.disabled = true; });
        clearRunOutput();
        setStatus("running");
        try {
            if (action === "convert")
                await handleConvert();
            if (action === "cut")
                await handleCut();
            if (action === "remux")
                await handleRemux();
            if (action === "read-metadata")
                await handleReadMetadata();
            if (action === "write-metadata")
                await handleWriteMetadata();
            if (action === "volume")
                await handleVolume();
            setStatus("done");
        }
        catch (error) {
            setStatus("failed");
            var message = (error && error.message) || String(error);
            appendLog(message);
            $("#resultBox").textContent = message;
        }
        finally {
            running = false;
            $$(".run-btn").forEach(function (button) { button.disabled = false; });
        }
    }
    function setTool(tool) {
        currentTool = tool;
        $$(".tabs button").forEach(function (button) {
            button.classList.toggle("active", button.dataset.tool === tool);
        });
        $$(".tool-panel").forEach(function (panel) {
            panel.classList.toggle("active", panel.id === "panel-" + tool);
        });
    }
    function syncDefaultArgs() {
        var format = $("#convertFormat").value;
        $("#encodeArgs").value = audioEncodeArgs(format);
    }
    function syncCutDefaultArgs() {
        $("#cutArgs").value = cutEncodeArgs($("#cutFormat").value);
    }
    function syncRemuxDefaultArgs() {
        $("#remuxArgs").value = audioEncodeArgs($("#remuxFormat").value);
    }
    setupUpload();
    $$(".tabs button").forEach(function (button) {
        button.addEventListener("click", function () { setTool(button.dataset.tool); });
    });
    document.querySelectorAll(".language button[data-lang]").forEach(function (button) {
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
        if (singleFile)
            void drawWaveform(singleFile);
    });
    $("#audioPlayer").addEventListener("loadedmetadata", function () {
        setCutBounds(0, Math.min(10, getMediaDuration()));
    });
    $("#audioPlayer").addEventListener("pause", clearPreviewStopTimer);
    $("#usePreviewStart").addEventListener("click", syncStartFromPreview);
    $("#usePreviewEnd").addEventListener("click", syncEndFromPreview);
    $("#previewRange").addEventListener("click", previewRange);
    $("#cutStartRange").addEventListener("input", function () { requestCutBounds(Number($("#cutStartRange").value) || 0, Number($("#cutEndRange").value) || 10, "start", false); });
    $("#cutEndRange").addEventListener("input", function () { requestCutBounds(Number($("#cutStartRange").value) || 0, Number($("#cutEndRange").value) || 10, "end", false); });
    $("#cutStart").addEventListener("change", function () { requestCutBounds(Number($("#cutStart").value) || 0, Number($("#cutEnd").value) || 10, "start", true); });
    $("#cutEnd").addEventListener("change", function () { requestCutBounds(Number($("#cutStart").value) || 0, Number($("#cutEnd").value) || 10, "end", true); });
    $("#convertFormat").addEventListener("change", syncDefaultArgs);
    $("#cutFormat").addEventListener("change", syncCutDefaultArgs);
    $("#remuxFormat").addEventListener("change", syncRemuxDefaultArgs);
    $("[data-action='read-metadata']").addEventListener("click", function () { runAction("read-metadata"); });
    $("[data-action='write-metadata']").addEventListener("click", function () { runAction("write-metadata"); });
    $$(".run-btn").forEach(function (button) {
        button.addEventListener("click", function () { runAction(button.dataset.action); });
    });
    $("#loadCoreButton").addEventListener("click", async function () {
        try {
            await getCore();
        }
        catch (error) {
            alert((error && error.message) || String(error));
        }
    });
    window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
        var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return;
        applyTheme(event.matches ? "dark" : "light");
    });
    applyTheme(resolveInitialTheme());
    applyLanguage(currentLanguage);
    syncDefaultArgs();
    syncCutDefaultArgs();
    syncRemuxDefaultArgs();
    setTool("convert");
})();
