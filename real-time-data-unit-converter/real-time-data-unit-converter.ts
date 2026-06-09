(function () {
  "use strict";

  var LANGUAGE_STORAGE_KEY = "web-tool-language";
  var THEME_STORAGE_KEY = "web-tool-theme";

  var TEXT = {
    zh: {
      htmlLang: "zh-CN",
      title: "数据单位转换",
      home: "工具集",
      navLabel: "页面导航",
      themeToggle: "切换主题",
      lead: "实时换算网络速率与数据容量，清楚区分 bit、Byte、1000 进制和 1024 进制。",
      rateMode: "传输速率",
      storageMode: "数据容量",
      conversionType: "换算类型",
      value: "数值",
      inputValue: "输入数值",
      unit: "单位",
      chooseUnit: "选择单位",
      capacityStandard: "容量标准",
      binary: "1024 进制",
      decimal: "1000 进制",
      presets: "常用数值",
      keyResults: "重点结果",
      downloadSpeed: "下载速度",
      perMinute: "每分钟传输",
      perHour: "每小时传输",
      bytes: "字节数",
      decimalGb: "十进制 GB",
      binaryGib: "二进制 GiB",
      invalidInput: "请输入有效数值。",
      copy: "复制",
      copied: "已复制",
      rateNote: "宽带套餐常写作 Mbps，下载软件常显示 MB/s。1 Byte = 8 bit，所以 100 Mbps 约等于 12.5 MB/s。",
      binaryNote: "1024 进制常用于操作系统显示容量，单位更准确地写作 KiB、MiB、GiB、TiB。",
      decimalNote: "1000 进制常用于硬盘、网络设备等厂商标注容量，1 TB = 1000 GB。"
    },
    en: {
      htmlLang: "en",
      title: "Data Unit Converter",
      home: "Tools",
      navLabel: "Page navigation",
      themeToggle: "Toggle theme",
      lead: "Convert network rates and data capacity in real time, with clear bit, Byte, base-1000, and base-1024 handling.",
      rateMode: "Transfer Rate",
      storageMode: "Data Capacity",
      conversionType: "Conversion type",
      value: "Value",
      inputValue: "Input value",
      unit: "Unit",
      chooseUnit: "Choose unit",
      capacityStandard: "Capacity standard",
      binary: "Base 1024",
      decimal: "Base 1000",
      presets: "Presets",
      keyResults: "Key results",
      downloadSpeed: "Download speed",
      perMinute: "Per minute",
      perHour: "Per hour",
      bytes: "Bytes",
      decimalGb: "Decimal GB",
      binaryGib: "Binary GiB",
      invalidInput: "Please enter a valid value.",
      copy: "Copy",
      copied: "Copied",
      rateNote: "Broadband plans are usually written in Mbps, while download apps often show MB/s. 1 Byte = 8 bits, so 100 Mbps is about 12.5 MB/s.",
      binaryNote: "Base 1024 is commonly used by operating systems. The precise units are KiB, MiB, GiB, and TiB.",
      decimalNote: "Base 1000 is commonly used by drive and network-device manufacturers. 1 TB = 1000 GB."
    }
  };

  var UNIT_FULL = {
    zh: {
      bps: "bit/s，比特每秒",
      Kbps: "kilobit/s，千比特每秒",
      Mbps: "megabit/s，兆比特每秒",
      Gbps: "gigabit/s，吉比特每秒",
      "B/s": "Byte/s，字节每秒",
      "KB/s": "kilobyte/s，千字节每秒",
      "MB/s": "megabyte/s，兆字节每秒",
      "GB/s": "gigabyte/s，吉字节每秒",
      B: "Byte，字节",
      KiB: "kibibyte，1024 字节",
      MiB: "mebibyte，1024 KiB",
      GiB: "gibibyte，1024 MiB",
      TiB: "tebibyte，1024 GiB",
      PiB: "pebibyte，1024 TiB",
      KB: "kilobyte，1000 字节",
      MB: "megabyte，1000 KB",
      GB: "gigabyte，1000 MB",
      TB: "terabyte，1000 GB",
      PB: "petabyte，1000 TB"
    },
    en: {
      bps: "Bits per second",
      Kbps: "Kilobits per second",
      Mbps: "Megabits per second",
      Gbps: "Gigabits per second",
      "B/s": "Bytes per second",
      "KB/s": "Kilobytes per second",
      "MB/s": "Megabytes per second",
      "GB/s": "Gigabytes per second",
      B: "Byte",
      KiB: "Kibibyte, 1024 bytes",
      MiB: "Mebibyte, 1024 KiB",
      GiB: "Gibibyte, 1024 MiB",
      TiB: "Tebibyte, 1024 GiB",
      PiB: "Pebibyte, 1024 TiB",
      KB: "Kilobyte, 1000 bytes",
      MB: "Megabyte, 1000 KB",
      GB: "Gigabyte, 1000 MB",
      TB: "Terabyte, 1000 GB",
      PB: "Petabyte, 1000 TB"
    }
  };

  var state = {
    mode: "rate",
    storageStandard: "binary",
    value: "100",
    unit: "Mbps"
  };

  var config = {
    rate: [
      { name: "bps", base: 1 },
      { name: "Kbps", base: 1e3 },
      { name: "Mbps", base: 1e6 },
      { name: "Gbps", base: 1e9 },
      { name: "B/s", base: 8 },
      { name: "KB/s", base: 8e3 },
      { name: "MB/s", base: 8e6 },
      { name: "GB/s", base: 8e9 }
    ],
    storageBinary: [
      { name: "B", base: 1 },
      { name: "KiB", base: Math.pow(1024, 1) },
      { name: "MiB", base: Math.pow(1024, 2) },
      { name: "GiB", base: Math.pow(1024, 3) },
      { name: "TiB", base: Math.pow(1024, 4) },
      { name: "PiB", base: Math.pow(1024, 5) }
    ],
    storageDecimal: [
      { name: "B", base: 1 },
      { name: "KB", base: 1e3 },
      { name: "MB", base: 1e6 },
      { name: "GB", base: 1e9 },
      { name: "TB", base: 1e12 },
      { name: "PB", base: 1e15 }
    ]
  };

  var presets = {
    rate: [
      { label: "100 Mbps", value: "100", unit: "Mbps" },
      { label: "1 Gbps", value: "1", unit: "Gbps" },
      { label: "12.5 MB/s", value: "12.5", unit: "MB/s" }
    ],
    storage: [
      { label: "1 GB", value: "1", unit: "GB", standard: "decimal" },
      { label: "1 GiB", value: "1", unit: "GiB", standard: "binary" },
      { label: "1 TB", value: "1", unit: "TB", standard: "decimal" }
    ]
  };

  var currentLanguage = resolveInitialLanguage();
  var valueInput = document.getElementById("valueInput");
  var unitSelect = document.getElementById("unitSelect");
  var resultsEl = document.getElementById("results");
  var presetsEl = document.getElementById("presets");
  var storageStandardEl = document.getElementById("storageStandard");
  var noteEl = document.getElementById("note");
  var toastEl = document.getElementById("toast");

  function t(key) {
    return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
  }

  function resolveInitialLanguage() {
    var saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
    var browserLanguage = (navigator.language || "").toLowerCase();
    if (browserLanguage.indexOf("zh") === 0) return "zh";
    if (browserLanguage.indexOf("en") === 0) return "en";
    return "en";
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function resolveInitialTheme() {
    var saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return getSystemTheme();
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  function setInputLabel(inputId, key) {
    var input = document.getElementById(inputId);
    var label = input && input.closest("label");
    if (!label) return;
    var textNode = Array.from(label.childNodes).find(function (node) {
      return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim();
    });
    if (textNode) textNode.nodeValue = "\n          " + t(key) + "\n          ";
  }

  function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = t("htmlLang");
    document.title = t("title");
    document.querySelector(".topbar").setAttribute("aria-label", t("navLabel"));
    document.getElementById("homeText").textContent = t("home");
    document.getElementById("themeButton").setAttribute("title", t("themeToggle"));
    document.getElementById("themeButton").setAttribute("aria-label", t("themeToggle"));
    document.querySelector(".hero h1").textContent = t("title");
    document.querySelector(".lead").textContent = t("lead");
    document.querySelector(".mode-tabs").setAttribute("aria-label", t("conversionType"));
    document.querySelector('[data-mode="rate"]').textContent = t("rateMode");
    document.querySelector('[data-mode="storage"]').textContent = t("storageMode");
    document.querySelector(".summary").setAttribute("aria-label", t("keyResults"));
    setInputLabel("valueInput", "value");
    setInputLabel("unitSelect", "unit");
    valueInput.setAttribute("aria-label", t("inputValue"));
    unitSelect.setAttribute("aria-label", t("chooseUnit"));
    storageStandardEl.querySelector("span").textContent = t("capacityStandard");
    storageStandardEl.querySelector('[data-standard="binary"]').textContent = t("binary");
    storageStandardEl.querySelector('[data-standard="decimal"]').textContent = t("decimal");
    presetsEl.setAttribute("aria-label", t("presets"));
    toastEl.textContent = t("copied");
    document.querySelectorAll(".language button[data-lang]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.lang === language);
    });
    render();
  }

  function getUnitList() {
    if (state.mode === "rate") return config.rate;
    return state.storageStandard === "binary" ? config.storageBinary : config.storageDecimal;
  }

  function findUnit(name) {
    return getUnitList().find(function (unit) { return unit.name === name; }) || getUnitList()[0];
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "-";
    if (value === 0) return "0";
    var abs = Math.abs(value);
    if (abs >= 1e12 || abs < 0.000001) return value.toExponential(5);
    return new Intl.NumberFormat(currentLanguage === "zh" ? "zh-CN" : "en-US", {
      maximumFractionDigits: abs >= 100 ? 2 : abs >= 1 ? 4 : 8
    }).format(value).replace(/,/g, " ");
  }

  function parseValue(raw) {
    var trimmed = String(raw).trim();
    var match = trimmed.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*([a-zA-Z/]+))?$/);
    if (!match) return { number: Number(trimmed), hintedUnit: null };
    return { number: Number(match[1]), hintedUnit: match[2] || null };
  }

  function applyHintedUnit(raw) {
    var parsed = parseValue(raw);
    if (!parsed.hintedUnit) return;
    var hinted = parsed.hintedUnit.toLowerCase();
    var match = getUnitList().find(function (unit) { return unit.name.toLowerCase() === hinted; });
    if (match) {
      state.unit = match.name;
      unitSelect.value = match.name;
      valueInput.value = parsed.number;
    }
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode === "rate") {
      state.unit = "Mbps";
      state.value = "100";
    } else {
      state.storageStandard = "binary";
      state.unit = "GiB";
      state.value = "1";
    }
    valueInput.value = state.value;
    document.querySelectorAll(".mode-tabs button").forEach(function (button) {
      button.classList.toggle("active", button.dataset.mode === mode);
    });
    render();
  }

  function renderUnitSelect() {
    var list = getUnitList();
    if (!list.some(function (unit) { return unit.name === state.unit; })) {
      state.unit = list[1] ? list[1].name : list[0].name;
    }
    unitSelect.innerHTML = "";
    list.forEach(function (unit) {
      var option = document.createElement("option");
      option.value = unit.name;
      option.textContent = unit.name;
      unitSelect.appendChild(option);
    });
    unitSelect.value = state.unit;
  }

  function renderPresets() {
    presetsEl.innerHTML = "";
    presets[state.mode].forEach(function (preset) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = preset.label;
      button.addEventListener("click", function () {
        if (preset.standard) state.storageStandard = preset.standard;
        state.value = preset.value;
        state.unit = preset.unit;
        valueInput.value = state.value;
        render();
      });
      presetsEl.appendChild(button);
    });
  }

  function renderStandard() {
    storageStandardEl.hidden = state.mode !== "storage";
    storageStandardEl.querySelectorAll("button").forEach(function (button) {
      button.classList.toggle("active", button.dataset.standard === state.storageStandard);
    });
  }

  function renderSummary(baseValue) {
    var labelA = document.getElementById("summaryLabelA");
    var labelB = document.getElementById("summaryLabelB");
    var labelC = document.getElementById("summaryLabelC");
    var summaryA = document.getElementById("summaryA");
    var summaryB = document.getElementById("summaryB");
    var summaryC = document.getElementById("summaryC");

    if (!Number.isFinite(baseValue)) {
      summaryA.textContent = summaryB.textContent = summaryC.textContent = "-";
      return;
    }

    if (state.mode === "rate") {
      labelA.textContent = t("downloadSpeed");
      labelB.textContent = t("perMinute");
      labelC.textContent = t("perHour");
      var bytesPerSecond = baseValue / 8;
      summaryA.textContent = formatNumber(bytesPerSecond / 1e6) + " MB/s";
      summaryB.textContent = formatNumber(bytesPerSecond * 60 / Math.pow(1024, 3)) + " GiB";
      summaryC.textContent = formatNumber(bytesPerSecond * 3600 / Math.pow(1024, 3)) + " GiB";
    } else {
      labelA.textContent = t("bytes");
      labelB.textContent = t("decimalGb");
      labelC.textContent = t("binaryGib");
      summaryA.textContent = formatNumber(baseValue) + " B";
      summaryB.textContent = formatNumber(baseValue / 1e9) + " GB";
      summaryC.textContent = formatNumber(baseValue / Math.pow(1024, 3)) + " GiB";
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showToast).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showToast();
  }

  function showToast() {
    toastEl.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1300);
  }

  function renderResults(baseValue) {
    resultsEl.innerHTML = "";
    if (!Number.isFinite(baseValue)) {
      var empty = document.createElement("div");
      empty.className = "note";
      empty.textContent = t("invalidInput");
      resultsEl.appendChild(empty);
      return;
    }

    getUnitList().forEach(function (unit) {
      var converted = baseValue / unit.base;
      var valueText = formatNumber(converted);
      var card = document.createElement("article");
      card.className = "result" + (unit.name === state.unit ? " current" : "");
      card.innerHTML = [
        "<div>",
        '<div class="unit">' + unit.name + "</div>",
        '<div class="unit-full">' + UNIT_FULL[currentLanguage][unit.name] + "</div>",
        '<div class="value">' + valueText + "</div>",
        "</div>",
        '<button class="copy-btn" type="button" title="' + t("copy") + '" aria-label="' + t("copy") + " " + unit.name + '">',
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg>',
        "</button>"
      ].join("");
      card.querySelector("button").addEventListener("click", function () {
        copyText(valueText + " " + unit.name);
      });
      resultsEl.appendChild(card);
    });
  }

  function renderNote() {
    if (state.mode === "rate") {
      noteEl.textContent = t("rateNote");
    } else if (state.storageStandard === "binary") {
      noteEl.textContent = t("binaryNote");
    } else {
      noteEl.textContent = t("decimalNote");
    }
  }

  function calculateBase() {
    var parsed = parseValue(valueInput.value);
    var number = parsed.number;
    var currentUnit = findUnit(state.unit);
    if (!Number.isFinite(number)) return NaN;
    return number * currentUnit.base;
  }

  function render() {
    renderStandard();
    renderUnitSelect();
    renderPresets();
    var baseValue = calculateBase();
    renderSummary(baseValue);
    renderResults(baseValue);
    renderNote();
  }

  document.querySelectorAll(".mode-tabs button").forEach(function (button) {
    button.addEventListener("click", function () {
      setMode(button.dataset.mode);
    });
  });

  document.querySelectorAll(".language button[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      var nextLanguage = button.dataset.lang;
      if (nextLanguage !== "zh" && nextLanguage !== "en") return;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      applyLanguage(nextLanguage);
    });
  });

  valueInput.addEventListener("input", function () {
    state.value = valueInput.value;
    applyHintedUnit(valueInput.value);
    render();
  });

  unitSelect.addEventListener("change", function () {
    state.unit = unitSelect.value;
    render();
  });

  storageStandardEl.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-standard]");
    if (!button) return;
    state.storageStandard = button.dataset.standard;
    state.unit = state.storageStandard === "binary" ? "GiB" : "GB";
    render();
  });

  document.getElementById("themeButton").addEventListener("click", function () {
    var nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
      var saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") return;
      applyTheme(event.matches ? "dark" : "light");
    });
  }

  applyTheme(resolveInitialTheme());
  applyLanguage(currentLanguage);
})();

export {};
