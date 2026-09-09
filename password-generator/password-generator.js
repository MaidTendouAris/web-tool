"use strict";
(function () {
    "use strict";
    const preferences = window.WebToolsPreferences;
    const LANGUAGE_STORAGE_KEY = "web-tools-language";
    const THEME_STORAGE_KEY = "web-tools-theme";
    const LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
    const LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
    const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LOWER = "abcdefghijklmnopqrstuvwxyz";
    const NUMBERS = "0123456789";
    const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/|~";
    const SIMILAR = "O0Iil1";
    const WORDS = [
        "amber", "anchor", "april", "artist", "atlas", "aurora", "baker", "basil", "beacon", "birch",
        "breeze", "bridge", "canyon", "cedar", "circle", "cobalt", "comet", "copper", "coral", "cotton",
        "crystal", "delta", "drift", "ember", "falcon", "fern", "field", "forest", "garden", "harbor",
        "hazel", "island", "jasmine", "kernel", "lagoon", "lantern", "lemon", "lunar", "maple", "marble",
        "meadow", "meteor", "mist", "nectar", "north", "oasis", "olive", "opal", "orbit", "pepper",
        "petal", "pixel", "plum", "prairie", "quartz", "quiet", "raven", "river", "saffron", "shadow",
        "silver", "soda", "solar", "spruce", "stone", "summer", "sunset", "thunder", "timber", "topaz",
        "tulip", "velvet", "violet", "willow", "winter", "zephyr"
    ];
    const TEXT = {
        zh: {
            htmlLang: "zh-CN",
            title: "密码生成器",
            home: "工具集",
            navLabel: "页面导航",
            themeToggle: "切换主题",
            lead: "使用浏览器本地随机数生成密码或密码短语；结果不会上传，也不会被保存。",
            passwordMode: "密码",
            passphraseMode: "密码短语",
            settings: "生成设置",
            length: "长度",
            count: "生成数量",
            lengthSlider: "快速调整长度",
            upper: "包含大写字母",
            lower: "包含小写字母",
            number: "包含数字",
            symbol: "包含符号",
            similar: "排除相似字符 O/0/I/l",
            wordCount: "单词数量",
            separator: "分隔符",
            space: "空格",
            noSeparator: "无分隔符",
            generate: "生成",
            copyAll: "复制全部",
            privacy: "所有生成过程都在当前浏览器中完成；本工具不会上传、保存或记录生成的密码。",
            results: "生成结果",
            strength: "强度提示",
            notGenerated: "尚未生成",
            empty: "点击生成开始。",
            copy: "复制",
            copied: "已复制",
            copiedAll: "已复制全部",
            chooseCharset: "请至少选择一种字符类型。",
            veryWeak: "很弱",
            weak: "较弱",
            fair: "一般",
            strong: "强",
            veryStrong: "很强"
        },
        en: {
            htmlLang: "en",
            title: "Password Generator",
            home: "Tools",
            navLabel: "Page navigation",
            themeToggle: "Toggle theme",
            lead: "Generate passwords or passphrases with local browser randomness. Results are never uploaded or saved.",
            passwordMode: "Password",
            passphraseMode: "Passphrase",
            settings: "Generation Settings",
            length: "Length",
            count: "Quantity",
            lengthSlider: "Quick length",
            upper: "Include uppercase",
            lower: "Include lowercase",
            number: "Include numbers",
            symbol: "Include symbols",
            similar: "Exclude similar characters O/0/I/l",
            wordCount: "Word count",
            separator: "Separator",
            space: "Space",
            noSeparator: "None",
            generate: "Generate",
            copyAll: "Copy all",
            privacy: "Everything is generated in this browser. This tool does not upload, save, or log generated passwords.",
            results: "Results",
            strength: "Strength",
            notGenerated: "Not generated",
            empty: "Click Generate to start.",
            copy: "Copy",
            copied: "Copied",
            copiedAll: "Copied all",
            chooseCharset: "Choose at least one character type.",
            veryWeak: "Very weak",
            weak: "Weak",
            fair: "Fair",
            strong: "Strong",
            veryStrong: "Very strong"
        }
    };
    let currentLanguage = resolveInitialLanguage();
    let mode = "password";
    let results = [];
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));
    function t(key) {
        return TEXT[currentLanguage][key] || key;
    }
    function resolveInitialLanguage() {
        return preferences.language();
    }
    function getSystemTheme() {
        return preferences.systemTheme();
    }
    function resolveInitialTheme() {
        return preferences.theme();
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
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
        $("#navLabel").setAttribute("aria-label", t("navLabel"));
        $("#themeButton").setAttribute("title", t("themeToggle"));
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
        setText("#homeText", "home");
        setText("#pageTitle", "title");
        setText("#leadText", "lead");
        setText("#settingsTitle", "settings");
        setText("#lengthLabel", "length");
        setText("#countLabel", "count");
        setText("#lengthSliderLabel", "lengthSlider");
        setText("#upperLabel", "upper");
        setText("#lowerLabel", "lower");
        setText("#numberLabel", "number");
        setText("#symbolLabel", "symbol");
        setText("#similarLabel", "similar");
        setText("#wordCountLabel", "wordCount");
        setText("#separatorLabel", "separator");
        setText("#generateButton", "generate");
        setText("#copyAllButton", "copyAll");
        setText("#privacyText", "privacy");
        setText("#resultsTitle", "results");
        setText("#strengthLabel", "strength");
        $$("[data-mode]").forEach((button) => {
            button.textContent = t(button.dataset.mode === "passphrase" ? "passphraseMode" : "passwordMode");
            button.classList.toggle("active", button.dataset.mode === mode);
        });
        $$(".language button[data-lang]").forEach((button) => {
            button.classList.toggle("active", button.dataset.lang === language);
        });
        const spaceOption = $("#separatorInput option[value=' ']");
        if (spaceOption)
            spaceOption.textContent = t("space");
        const noSeparatorOption = $("#separatorInput option[value='']");
        if (noSeparatorOption)
            noSeparatorOption.textContent = t("noSeparator");
        if (results.length)
            renderResults();
        else {
            setText("#strengthText", "notGenerated");
            setText("#emptyText", "empty");
        }
    }
    function clampNumber(value, min, max) {
        if (!Number.isFinite(value))
            return min;
        return Math.min(max, Math.max(min, Math.floor(value)));
    }
    function randomInt(max) {
        const limit = Math.floor(0x100000000 / max) * max;
        const buffer = new Uint32Array(1);
        do {
            crypto.getRandomValues(buffer);
        } while (buffer[0] >= limit);
        return buffer[0] % max;
    }
    function randomFrom(value) {
        return value[randomInt(value.length)];
    }
    function shuffle(value) {
        for (let index = value.length - 1; index > 0; index--) {
            const swapIndex = randomInt(index + 1);
            const current = value[index];
            value[index] = value[swapIndex];
            value[swapIndex] = current;
        }
        return value;
    }
    function removeSimilar(value) {
        return value.split("").filter((char) => !SIMILAR.includes(char)).join("");
    }
    function getPasswordSets() {
        const excludeSimilar = $("#similarInput").checked;
        const sets = [];
        if ($("#upperInput").checked)
            sets.push(excludeSimilar ? removeSimilar(UPPER) : UPPER);
        if ($("#lowerInput").checked)
            sets.push(excludeSimilar ? removeSimilar(LOWER) : LOWER);
        if ($("#numberInput").checked)
            sets.push(excludeSimilar ? removeSimilar(NUMBERS) : NUMBERS);
        if ($("#symbolInput").checked)
            sets.push(SYMBOLS);
        return sets.filter(Boolean);
    }
    function generatePassword() {
        const length = clampNumber(Number($("#lengthInput").value), 4, 128);
        const sets = getPasswordSets();
        if (!sets.length)
            throw new Error(t("chooseCharset"));
        const all = sets.join("");
        const chars = sets.map((set) => randomFrom(set));
        while (chars.length < length)
            chars.push(randomFrom(all));
        return shuffle(chars).join("");
    }
    function generatePassphrase() {
        const wordCount = clampNumber(Number($("#wordCountInput").value), 3, 8);
        const separator = $("#separatorInput").value;
        const words = [];
        for (let index = 0; index < wordCount; index++) {
            words.push(WORDS[randomInt(WORDS.length)]);
        }
        return words.join(separator);
    }
    function estimateBits(secret) {
        if (mode === "passphrase") {
            const wordCount = clampNumber(Number($("#wordCountInput").value), 3, 8);
            return wordCount * Math.log2(WORDS.length);
        }
        const poolSize = getPasswordSets().join("").length || 1;
        return secret.length * Math.log2(poolSize);
    }
    function strengthInfo(bits) {
        if (bits < 36)
            return { label: t("veryWeak"), width: 18, color: "var(--danger)" };
        if (bits < 60)
            return { label: t("weak"), width: 38, color: "var(--amber)" };
        if (bits < 80)
            return { label: t("fair"), width: 58, color: "var(--blue)" };
        if (bits < 110)
            return { label: t("strong"), width: 78, color: "var(--green)" };
        return { label: t("veryStrong"), width: 100, color: "var(--green)" };
    }
    function updateStrength() {
        const sample = results[0] || "";
        if (!sample) {
            $("#strengthText").textContent = t("notGenerated");
            $("#strengthFill").style.width = "0%";
            return;
        }
        const info = strengthInfo(estimateBits(sample));
        $("#strengthText").textContent = info.label;
        $("#strengthFill").style.width = info.width + "%";
        $("#strengthFill").style.background = info.color;
    }
    function renderResults() {
        const list = $("#resultList");
        list.innerHTML = "";
        results.forEach((secret, index) => {
            const item = document.createElement("div");
            item.className = "result";
            const value = document.createElement("div");
            value.className = "secret";
            value.textContent = secret;
            const button = document.createElement("button");
            button.className = "icon-btn";
            button.type = "button";
            button.title = t("copy");
            button.setAttribute("aria-label", t("copy"));
            button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            button.addEventListener("click", () => copyText(results[index], t("copied")));
            item.append(value, button);
            list.append(item);
        });
        updateStrength();
    }
    function generate() {
        try {
            const count = clampNumber(Number($("#countInput").value), 1, 20);
            $("#countInput").value = String(count);
            results = [];
            for (let index = 0; index < count; index++) {
                results.push(mode === "password" ? generatePassword() : generatePassphrase());
            }
            renderResults();
        }
        catch (error) {
            showToast(error instanceof Error ? error.message : String(error));
        }
    }
    async function copyText(value, message) {
        try {
            await navigator.clipboard.writeText(value);
        }
        catch (error) {
            const textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.append(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
        }
        showToast(message);
    }
    function showToast(message) {
        const toast = $("#toast");
        toast.textContent = message;
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 1500);
    }
    function syncMode() {
        $$(".password-settings").forEach((element) => { element.hidden = mode !== "password"; });
        $$(".passphrase-settings").forEach((element) => { element.hidden = mode !== "passphrase"; });
        $("#lengthInput").disabled = mode === "passphrase";
        $$("[data-mode]").forEach((button) => {
            button.classList.toggle("active", button.dataset.mode === mode);
        });
    }
    $("#generateButton").addEventListener("click", generate);
    $("#copyAllButton").addEventListener("click", () => {
        if (results.length)
            void copyText(results.join("\n"), t("copiedAll"));
    });
    $("#lengthInput").addEventListener("input", () => {
        const value = clampNumber(Number($("#lengthInput").value), 4, 128);
        $("#lengthSlider").value = String(value);
    });
    $("#lengthSlider").addEventListener("input", () => {
        $("#lengthInput").value = $("#lengthSlider").value;
    });
    $$("[data-mode]").forEach((button) => {
        button.addEventListener("click", () => {
            mode = button.dataset.mode === "passphrase" ? "passphrase" : "password";
            syncMode();
            generate();
        });
    });
    $$(".language button[data-lang]").forEach((button) => {
        button.addEventListener("click", () => {
            const nextLanguage = button.dataset.lang;
            if (nextLanguage !== "zh" && nextLanguage !== "en")
                return;
            preferences.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
            applyLanguage(nextLanguage);
        });
    });
    $("#themeButton").addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        preferences.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    });
    window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        const saved = preferences.getItem(THEME_STORAGE_KEY) || preferences.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light")
            return;
        applyTheme(event.matches ? "dark" : "light");
    });
    preferences.subscribe(() => { applyLanguage(resolveInitialLanguage()); applyTheme(resolveInitialTheme()); });
    applyTheme(resolveInitialTheme());
    syncMode();
    applyLanguage(currentLanguage);
    generate();
})();
