(function () {
  "use strict";

  type SupportedLanguage = "zh" | "en";

  const LANGUAGE_STORAGE_KEY = "web-tools-language";
  const THEME_STORAGE_KEY = "web-tools-theme";
  const LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
  const LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
  const RESOURCE_CACHE_DB_NAME = "web-tools-resource-cache";
  const RESOURCE_CACHE_STORE_NAME = "resources";
  const RESOURCE_CACHE_DB_VERSION = 1;
  const FFMPEG_CORE_JS_RESOURCE_ID = "ffmpeg-core-js";
  const FFMPEG_CORE_WASM_RESOURCE_ID = "ffmpeg-core-wasm";

  const MIME: Record<string, string> = {
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
      files: "文件数",
      previewFile: "当前预览",
      previewSelect: "预览音频",
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
      files: "Files",
      previewFile: "Preview",
      previewSelect: "Preview audio",
      remove: "Remove"
    }
  };

  var $ = function (selector): any { return document.querySelector(selector); };
  var $$ = function (selector): any[] { return Array.from(document.querySelectorAll(selector)) as any[]; };
  var currentLanguage = resolveInitialLanguage();
  var selectedFiles: File[] = [];
  var currentTool = "convert";
  var singleFile: File | null = null;
  var previewUrl = "";
  var previewStopTimer: number | null = null;
  var lastValidStart = 0;
  var lastValidEnd = 10;
  var corePromise: Promise<any> | null = null;
  var ffmpegCore: any = null;
  var localWasmBinary: ArrayBuffer | null = null;
  var logLines: string[] = [];
  var running = false;

  function t(key: string): string {
    return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
  }

  function resolveInitialLanguage(): SupportedLanguage {
    var saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
    var browserLanguage = (navigator.language || "").toLowerCase();
    if (browserLanguage.startsWith("zh")) return "zh";
    if (browserLanguage.startsWith("en")) return "en";
    return "en";
  }

  function resolveInitialTheme() {
    var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme: string) {
    document.documentElement.dataset.theme = theme;
    $("#themeButton").setAttribute("aria-label", t("themeToggle"));
  }

  function setText(selector: string, key: string) {
    var element = $(selector);
    if (element) element.textContent = t(key);
  }

  function setButtonText(selector: string, key: string) {
    $$(selector).forEach(function (button) { button.textContent = t(key); });
  }

  function applyLanguage(language: SupportedLanguage) {
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
    if (!$("#resultBox").dataset.hasOutput) $("#resultBox").textContent = t("noOutput");
    if (!singleFile) $("#statusLine").textContent = t("waitingInput");
  }

  function updateEngineStatus() {
    if (ffmpegCore) $("#engineStatus").textContent = t("engineReady");
    else if (corePromise) $("#engineStatus").textContent = t("engineLoading");
    else $("#engineStatus").textContent = t("engineIdle");
  }

  function appendLog(message: string) {
    logLines.push("[" + new Date().toLocaleTimeString() + "] " + message);
    $("#logBox").textContent = logLines.join("\n");
    $("#logBox").scrollTop = $("#logBox").scrollHeight;
  }

  function setStatus(key: string) {
    $("#statusLine").textContent = t(key);
  }

  function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    var units = ["B", "KB", "MB", "GB"];
    var value = bytes;
    var index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index++;
    }
    return (index === 0 ? value.toFixed(0) : value.toFixed(2)) + " " + units[index];
  }

  function formatSeconds(value: number) {
    return value.toFixed(1);
  }

  function getExt(name: string) {
    var match = /\.([^.]+)$/.exec(name);
    return match ? match[1].toLowerCase() : "bin";
  }

  function fileName(sourceName: string, suffix: string) {
    return sourceName.replace(/\.[^.]+$/, "") + "." + suffix;
  }

  function safeZipName(name: string) {
    return (name || "output").replace(/[\\/:*?"<>|]+/g, "-");
  }

  function uniqueName(name: string, used: Record<string, boolean>) {
    var clean = safeZipName(name);
    if (!used[clean]) {
      used[clean] = true;
      return clean;
    }
    var dot = clean.lastIndexOf(".");
    var base = dot > 0 ? clean.slice(0, dot) : clean;
    var ext = dot > 0 ? clean.slice(dot) : "";
    var index = 2;
    while (used[base + "-" + index + ext]) index++;
    var next = base + "-" + index + ext;
    used[next] = true;
    return next;
  }

  var crcTable: number[] | null = null;

  function getCrcTable() {
    if (crcTable) return crcTable;
    crcTable = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
    return crcTable;
  }

  function crc32(bytes: Uint8Array) {
    var table = getCrcTable();
    var crc = 0xffffffff;
    for (var index = 0; index < bytes.length; index++) {
      crc = table[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function dosDateTime(date: Date) {
    var time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    var day = (date.getFullYear() - 1980) << 9 | ((date.getMonth() + 1) << 5) | date.getDate();
    return { time: time, date: day };
  }

  function writeUint16(bytes: Uint8Array, offset: number, value: number) {
    bytes[offset] = value & 0xff;
    bytes[offset + 1] = (value >>> 8) & 0xff;
  }

  function writeUint32(bytes: Uint8Array, offset: number, value: number) {
    bytes[offset] = value & 0xff;
    bytes[offset + 1] = (value >>> 8) & 0xff;
    bytes[offset + 2] = (value >>> 16) & 0xff;
    bytes[offset + 3] = (value >>> 24) & 0xff;
  }

  async function createZip(files: Array<{ name: string; blob: Blob }>) {
    var encoder = new TextEncoder();
    var now = dosDateTime(new Date());
    var localParts: Uint8Array[] = [];
    var centralParts: Uint8Array[] = [];
    var offset = 0;
    for (var index = 0; index < files.length; index++) {
      var file = files[index];
      var nameBytes = encoder.encode(file.name);
      var data = new Uint8Array(await file.blob.arrayBuffer());
      var crc = crc32(data);
      var local = new Uint8Array(30 + nameBytes.length + data.length);
      writeUint32(local, 0, 0x04034b50);
      writeUint16(local, 4, 20);
      writeUint16(local, 6, 0x0800);
      writeUint16(local, 8, 0);
      writeUint16(local, 10, now.time);
      writeUint16(local, 12, now.date);
      writeUint32(local, 14, crc);
      writeUint32(local, 18, data.length);
      writeUint32(local, 22, data.length);
      writeUint16(local, 26, nameBytes.length);
      local.set(nameBytes, 30);
      local.set(data, 30 + nameBytes.length);
      localParts.push(local);

      var central = new Uint8Array(46 + nameBytes.length);
      writeUint32(central, 0, 0x02014b50);
      writeUint16(central, 4, 20);
      writeUint16(central, 6, 20);
      writeUint16(central, 8, 0x0800);
      writeUint16(central, 10, 0);
      writeUint16(central, 12, now.time);
      writeUint16(central, 14, now.date);
      writeUint32(central, 16, crc);
      writeUint32(central, 20, data.length);
      writeUint32(central, 24, data.length);
      writeUint16(central, 28, nameBytes.length);
      writeUint32(central, 42, offset);
      central.set(nameBytes, 46);
      centralParts.push(central);
      offset += local.length;
    }
    var centralSize = centralParts.reduce(function (sum, part) { return sum + part.length; }, 0);
    var end = new Uint8Array(22);
    writeUint32(end, 0, 0x06054b50);
    writeUint16(end, 8, files.length);
    writeUint16(end, 10, files.length);
    writeUint32(end, 12, centralSize);
    writeUint32(end, 16, offset);
    var parts = localParts.concat(centralParts, [end]);
    var totalLength = parts.reduce(function (sum, part) { return sum + part.length; }, 0);
    var zipBuffer = new ArrayBuffer(totalLength);
    var zipBytes = new Uint8Array(zipBuffer);
    var zipOffset = 0;
    parts.forEach(function (part) {
      zipBytes.set(part, zipOffset);
      zipOffset += part.length;
    });
    return new Blob([zipBuffer], { type: "application/zip" });
  }

  function splitArgs(text: string) {
    var matches = (text || "").match(/"[^"]*"|'[^']*'|\S+/g) || [];
    return matches.map(function (part) { return part.replace(/^["']|["']$/g, ""); });
  }

  function audioEncodeArgs(format: string) {
    var args: Record<string, string> = {
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

  function cutEncodeArgs(format: string) {
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

  function clamp(value: number, min: number, max: number) {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  function getMediaDuration() {
    var audio = $("#audioPlayer");
    var duration = Number(audio.duration);
    var fallbackEnd = Number($("#cutEnd").value) || 10;
    return Math.max(0.1, Number.isFinite(duration) && duration > 0 ? duration : fallbackEnd);
  }

  function updateRangeFill(start: number, end: number, max: number) {
    var left = clamp(start / max * 100, 0, 100);
    var right = clamp(end / max * 100, 0, 100);
    $("#cutRangeFill").style.left = left + "%";
    $("#cutRangeFill").style.width = Math.max(0, right - left) + "%";
  }

  function setCutBounds(start: number, end: number) {
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

  function showRangeError(message: string, modal: boolean) {
    $("#statusLine").textContent = message;
    if (modal) alert(message);
  }

  function requestCutBounds(start: number, end: number, changed: "start" | "end" | "both", modal: boolean) {
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
    if (!audio.src) return;
    var start = Number($("#cutStart").value) || 0;
    var end = Number($("#cutEnd").value) || (start + 10);
    if (!requestCutBounds(start, end, "both", true)) return;
    audio.currentTime = start;
    audio.play();
    clearPreviewStopTimer();
    previewStopTimer = window.setTimeout(function () {
      audio.pause();
    }, Math.max(0.1, end - start) * 1000);
  }

  function renderWaveform(buffer: AudioBuffer | null) {
    var canvas = $("#waveformCanvas") as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--soft").trim() || "#eef2f7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!buffer) return;
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
        if (sample < min) min = sample;
        if (sample > max) max = sample;
      }
      ctx.moveTo(x, (1 + min) * amp);
      ctx.lineTo(x, (1 + max) * amp);
    }
    ctx.stroke();
  }

  async function drawWaveform(file: File) {
    try {
      var AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) throw new Error("No AudioContext");
      var context = new AudioContextClass();
      var buffer = await context.decodeAudioData(await file.arrayBuffer());
      renderWaveform(buffer);
      if (typeof context.close === "function") context.close();
    } catch (_error) {
      renderWaveform(null);
      appendLog(t("waveformFailed"));
    }
  }

  function renderFile() {
    var box = $("#fileBox");
    box.innerHTML = "";
    if (selectedFiles.length) {
      var selectorLabel = document.createElement("label");
      selectorLabel.className = "preview-selector";
      selectorLabel.textContent = t("previewSelect");

      var selector = document.createElement("select");
      selectedFiles.forEach(function (file, index) {
        var option = document.createElement("option");
        option.value = String(index);
        option.textContent = String(index + 1) + ". " + file.name;
        selector.appendChild(option);
      });
      selector.value = String(Math.max(0, selectedFiles.indexOf(singleFile as File)));
      selector.addEventListener("change", function () {
        var nextFile = selectedFiles[Number(selector.value)] || selectedFiles[0] || null;
        void setPreviewFile(nextFile);
      });
      selectorLabel.appendChild(selector);
      box.appendChild(selectorLabel);
    }

    selectedFiles.forEach(function (file, index) {
      var card = document.createElement("div");
      var isPreview = file === singleFile;
      card.className = "file-card" + (isPreview ? " active" : "");

      var info = document.createElement("div");
      var name = document.createElement("div");
      name.className = "file-name";
      name.textContent = file.name;
      var meta = document.createElement("div");
      meta.className = "file-meta";
      meta.textContent = formatBytes(file.size) + " · " + (file.type || getExt(file.name)) + (isPreview ? " · " + t("previewFile") : "");
      info.appendChild(name);
      info.appendChild(meta);

      var removeButton = document.createElement("button");
      removeButton.className = "icon-btn";
      removeButton.type = "button";
      removeButton.setAttribute("aria-label", t("remove"));
      removeButton.textContent = "×";

      card.addEventListener("click", function () {
        void setPreviewFile(file);
      });
      removeButton.addEventListener("click", function (event) {
        event.stopPropagation();
        var wasPreview = file === singleFile;
        selectedFiles = selectedFiles.filter(function (_file, fileIndex) { return fileIndex !== index; });
        if (wasPreview) {
          void setPreviewFile(selectedFiles[Math.min(index, selectedFiles.length - 1)] || null);
        } else {
          renderFile();
        }
        if (!selectedFiles.length) setStatus("waitingInput");
      });
      card.appendChild(info);
      card.appendChild(removeButton);
      box.appendChild(card);
    });
  }

  async function setPreviewFile(file: File | null) {
    singleFile = file;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
    if (!file) {
      $("#audioPlayer").removeAttribute("src");
      $("#audioPlayer").load();
      $("#playerBox").classList.remove("show");
      renderWaveform(null);
      renderFile();
      return;
    }
    previewUrl = URL.createObjectURL(file);
    $("#audioPlayer").src = previewUrl;
    $("#audioPlayer").volume = 0.5;
    $("#playerBox").classList.add("show");
    renderFile();
    setStatus("loadingFile");
    await drawWaveform(file);
    $("#statusLine").textContent = t("done");
  }

  async function loadFiles(files: FileList | File[]) {
    selectedFiles = Array.from(files);
    await setPreviewFile(selectedFiles[0] || null);
    renderFile();
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
      if (event.dataTransfer.files && event.dataTransfer.files.length) void loadFiles(event.dataTransfer.files);
    });
    $("#fileInput").addEventListener("change", function (event) {
      if (event.target.files && event.target.files.length) void loadFiles(event.target.files);
      event.target.value = "";
    });
  }

  function openResourceCacheDb() {
    return new Promise<any>(function (resolve, reject) {
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

  function getCachedResource(resourceId: string) {
    return openResourceCacheDb().then(function (db) {
      return new Promise<any>(function (resolve, reject) {
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

  function loadScript(src: string) {
    return new Promise<void>(function (resolve, reject) {
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

  async function loadCachedScript(resourceId: string) {
    var record: any = await getCachedResource(resourceId);
    if (!record || !record.content) return false;
    var blob = new Blob([record.content], { type: record.mimeType || "text/javascript" });
    var blobUrl = URL.createObjectURL(blob);
    try {
      await loadScript(blobUrl);
      return true;
    } finally {
      setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);
    }
  }

  async function loadWasmBinary() {
    if (localWasmBinary) return localWasmBinary;
    try {
      var cached: any = await getCachedResource(FFMPEG_CORE_WASM_RESOURCE_ID);
      if (cached && cached.content) {
        localWasmBinary = cached.content;
        appendLog(t("wasmSelected"));
        updateEngineStatus();
        return localWasmBinary;
      }
    } catch (_cacheError) {}
    throw new Error(t("wasmNeedsCache"));
  }

  async function getCore() {
    if (ffmpegCore) return ffmpegCore;
    if (!corePromise) {
      corePromise = (async function () {
        updateEngineStatus();
        var scriptLoadedFromCache = false;
        try {
          scriptLoadedFromCache = await loadCachedScript(FFMPEG_CORE_JS_RESOURCE_ID);
        } catch (_cacheError) {}
        if (!scriptLoadedFromCache) throw new Error(t("wasmNeedsCache"));
        var wasmBinary = await loadWasmBinary();
        var factory = (window as any).createFFmpegCore;
        if (typeof factory !== "function") throw new Error(t("engineMissing"));
        var core = await factory({
          wasmBinary: wasmBinary,
          logger: function (event) {
            if (event && event.message) appendLog(event.message);
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

  function safeUnlink(core: any, path: string) {
    try { core.FS.unlink(path); } catch (_error) {}
  }

  async function writeFileToCore(core: any, path: string, file: File) {
    setStatus("loadingFile");
    var bytes = new Uint8Array(await file.arrayBuffer());
    setStatus("writingFile");
    safeUnlink(core, path);
    core.FS.writeFile(path, bytes);
  }

  function readOutputBlob(core: any, path: string, ext: string) {
    var data = core.FS.readFile(path);
    return new Blob([data.buffer || data], { type: MIME[ext] || "application/octet-stream" });
  }

  function showDownload(blob: Blob, name: string) {
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

  function showSummary(items: Array<{ label: string; value: string }>) {
    $("#summary").innerHTML = items.map(function (item) {
      return '<div class="summary-item"><strong>' + item.label + "</strong>" + item.value + "</div>";
    }).join("");
  }

  function showTextOutput(text: string) {
    var box = $("#resultBox");
    box.dataset.hasOutput = "true";
    box.innerHTML = "<pre></pre>";
    box.querySelector("pre").textContent = text || "-";
  }

  async function prepareInput(file?: File) {
    var targetFile = file || singleFile;
    if (!targetFile) throw new Error(t("needFile"));
    var core = await getCore();
    core.reset();
    var inputName = "input." + getExt(targetFile.name);
    await writeFileToCore(core, inputName, targetFile);
    return { core: core, inputName: inputName, file: targetFile };
  }

  async function runFFmpeg(args: string[]) {
    var core = await getCore();
    setStatus("running");
    appendLog("$ ffmpeg " + args.join(" "));
    var ret = core.exec.apply(core, args);
    if (ret !== 0) throw new Error("FFmpeg exited with code " + ret);
    return core;
  }

  async function runFFprobe(args: string[]) {
    var core = await getCore();
    setStatus("running");
    appendLog("$ ffprobe " + args.join(" "));
    var stdout: string[] = [];
    core.setLogger(function (event) {
      if (!event || !event.message) return;
      if (event.type === "stdout") stdout.push(event.message);
      appendLog(event.message);
    });
    var ret = core.ffprobe.apply(core, args);
    var output = stdout.join("\n").trim();
    if (ret !== 0 && !output) throw new Error("FFprobe exited with code " + ret);
    return output;
  }

  async function handleReadMetadata() {
    var prepared = await prepareInput();
    var output = await runFFprobe(["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", prepared.inputName]);
    var parsed: any = null;
    try { parsed = JSON.parse(output); } catch (_error) {}
    if (parsed && parsed.format && parsed.format.tags) fillMetadata(parsed.format.tags);
    showTextOutput(parsed ? JSON.stringify(parsed, null, 2) : output);
    safeUnlink(prepared.core, prepared.inputName);
  }

  function fillMetadata(tags: Record<string, string>) {
    var lower: Record<string, string> = {};
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
      if (index > 0) pairs.push([line.slice(0, index).trim(), line.slice(index + 1).trim()]);
    });
    var args: string[] = [];
    pairs.forEach(function (pair) {
      if (!pair[0] || !pair[1]) return;
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
    if (!selectedFiles.length) throw new Error(t("needFile"));
    var format = $("#convertFormat").value;
    var zipFiles: Array<{ name: string; blob: Blob }> = [];
    var usedNames: Record<string, boolean> = {};
    var totalSize = 0;
    for (var index = 0; index < selectedFiles.length; index++) {
      var prepared = await prepareInput(selectedFiles[index]);
      var outputName = uniqueName(fileName(prepared.file.name, format), usedNames);
      appendLog("[" + (index + 1) + "/" + selectedFiles.length + "] " + prepared.file.name);
      var args = ["-i", prepared.inputName].concat(splitArgs($("#encodeArgs").value), splitArgs($("#convertAdvancedArgs").value), [outputName]);
      var core = await runFFmpeg(args);
      var blob = readOutputBlob(core, outputName, format);
      totalSize += blob.size;
      zipFiles.push({ name: outputName, blob: blob });
      safeUnlink(core, prepared.inputName);
      safeUnlink(core, outputName);
    }
    var zip = await createZip(zipFiles);
    showDownload(zip, "converted-audio.zip");
    showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("files"), value: String(zipFiles.length) }, { label: t("size"), value: formatBytes(totalSize) }]);
  }

  async function handleCut() {
    var prepared = await prepareInput();
    var start = Number($("#cutStart").value) || 0;
    var end = Number($("#cutEnd").value) || (start + 10);
    if (!requestCutBounds(start, end, "both", true)) return;
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
    if (!selectedFiles.length) throw new Error(t("needFile"));
    var format = $("#remuxFormat").value;
    var zipFiles: Array<{ name: string; blob: Blob }> = [];
    var usedNames: Record<string, boolean> = {};
    var totalSize = 0;
    for (var index = 0; index < selectedFiles.length; index++) {
      var prepared = await prepareInput(selectedFiles[index]);
      var outputName = uniqueName(fileName(prepared.file.name, "remux." + format), usedNames);
      appendLog("[" + (index + 1) + "/" + selectedFiles.length + "] " + prepared.file.name);
      var args = ["-i", prepared.inputName].concat(splitArgs($("#remuxArgs").value), [outputName]);
      var core = await runFFmpeg(args);
      var blob = readOutputBlob(core, outputName, format);
      totalSize += blob.size;
      zipFiles.push({ name: outputName, blob: blob });
      safeUnlink(core, prepared.inputName);
      safeUnlink(core, outputName);
    }
    var zip = await createZip(zipFiles);
    showDownload(zip, "remuxed-audio.zip");
    showSummary([{ label: t("format"), value: format.toUpperCase() }, { label: t("files"), value: String(zipFiles.length) }, { label: t("size"), value: formatBytes(totalSize) }]);
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

  async function runAction(action: string) {
    if (running) return;
    running = true;
    $$(".run-btn").forEach(function (button) { button.disabled = true; });
    clearRunOutput();
    setStatus("running");
    try {
      if (action === "convert") await handleConvert();
      if (action === "cut") await handleCut();
      if (action === "remux") await handleRemux();
      if (action === "read-metadata") await handleReadMetadata();
      if (action === "write-metadata") await handleWriteMetadata();
      if (action === "volume") await handleVolume();
      setStatus("done");
    } catch (error) {
      setStatus("failed");
      var message = (error && error.message) || String(error);
      appendLog(message);
      $("#resultBox").textContent = message;
    } finally {
      running = false;
      $$(".run-btn").forEach(function (button) { button.disabled = false; });
    }
  }

  function setTool(tool: string) {
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

  document.querySelectorAll<HTMLButtonElement>(".language button[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      var nextLanguage = button.dataset.lang;
      if (nextLanguage !== "zh" && nextLanguage !== "en") return;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      applyLanguage(nextLanguage);
    });
  });

  $("#themeButton").addEventListener("click", function () {
    var nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    if (singleFile) void drawWaveform(singleFile);
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
    } catch (error) {
      alert((error && error.message) || String(error));
    }
  });

  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
      var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return;
    applyTheme(event.matches ? "dark" : "light");
  });

  applyTheme(resolveInitialTheme());
  applyLanguage(currentLanguage);
  syncDefaultArgs();
  syncCutDefaultArgs();
  syncRemuxDefaultArgs();
  setTool("convert");
})();
