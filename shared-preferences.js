"use strict";
(function (global) {
    "use strict";
    const memory = new Map();
    const listeners = new Set();
    function getItem(key) {
        if (memory.has(key))
            return memory.get(key);
        try {
            return global.localStorage.getItem(key);
        }
        catch (_) {
            return null;
        }
    }
    function setItem(key, value) {
        memory.set(key, value);
        try {
            global.localStorage.setItem(key, value);
        }
        catch (_) { }
    }
    function language() {
        const saved = getItem("web-tools-language") || getItem("web-tool-language");
        return saved === "zh" || saved === "en" ? saved : (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
    }
    function systemTheme() {
        return global.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function theme() {
        const saved = getItem("web-tools-theme") || getItem("web-tool-theme");
        return saved === "dark" || saved === "light" ? saved : systemTheme();
    }
    global.addEventListener("storage", (event) => {
        if (event.key && !["web-tools-language", "web-tool-language", "web-tools-theme", "web-tool-theme"].includes(event.key))
            return;
        if (event.key)
            memory.delete(event.key);
        else
            memory.clear();
        listeners.forEach(listener => listener());
    });
    global.WebToolsPreferences = { getItem, setItem, language, theme, systemTheme,
        subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
    };
})(window);
