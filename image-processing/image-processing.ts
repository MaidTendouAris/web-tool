(function () {
      "use strict";

      var $ = function (selector) { return document.querySelector(selector); };
      var $$ = function (selector) { return Array.from(document.querySelectorAll(selector)); };

      var LANGUAGE_STORAGE_KEY = "web-tools-language";
      var THEME_STORAGE_KEY = "web-tools-theme";
      var LEGACY_LANGUAGE_STORAGE_KEY = "web-tool-language";
      var LEGACY_THEME_STORAGE_KEY = "web-tool-theme";
      var TEXT = {
        zh: {
          htmlLang: "zh-CN",
          title: "图片处理",
          home: "工具集",
          navLabel: "页面导航",
          themeToggle: "切换主题",
          lead: "裁剪、拼接、压缩图片。所有处理都在当前浏览器完成。",
          cropTab: "裁剪",
          stitchTab: "拼接",
          compressTab: "压缩",
          imageTools: "图片工具",
          chooseImage: "选择或拖放图片",
          chooseImages: "选择或拖放多张图片",
          imageTypes: "JPG、PNG、GIF、WebP",
          stitchLimit: "最多 20 张，可调整顺序",
          compressHint: "调整质量、格式与输出尺寸",
          cropArea: "裁剪区域",
          preview: "预览",
          waitingImage: "等待图片",
          free: "自由",
          reset: "重置",
          downloadPng: "下载 PNG",
          download: "下载",
          imageList: "图片列表",
          clear: "清空",
          stitchSettings: "拼接设置",
          direction: "布局",
          vertical: "纵向",
          horizontal: "横向",
          grid2: "2×2",
          grid3: "3×3",
          grid4: "4×4",
          align: "对齐",
          center: "居中",
          start: "起始",
          end: "末尾",
          fit: "缩放",
          fitNone: "保持原尺寸",
          fitWidth: "统一宽度",
          fitHeight: "统一高度",
          targetSize: "目标尺寸 px",
          gap: "间距 px",
          radius: "圆角 px",
          background: "背景",
          format: "格式",
          compressSettings: "压缩设置",
          outputFormat: "输出格式",
          quality: "质量",
          maxWidth: "最大宽度 px",
          maxHeight: "最大高度 px",
          restoreSize: "恢复原尺寸",
          selectImageError: "请选择图片文件",
          readError: "文件读取失败",
          imageLoadError: "图片加载失败",
          original: "原图",
          output: "输出",
          size: "大小",
          change: "变化",
          imagesUnit: "张",
          moveUp: "上移",
          moveDown: "下移",
          remove: "移除"
        },
        en: {
          htmlLang: "en",
          title: "Image Processing",
          home: "Tools",
          navLabel: "Page navigation",
          themeToggle: "Toggle theme",
          lead: "Crop, stitch, and compress images. Everything runs inside your current browser.",
          cropTab: "Crop",
          stitchTab: "Stitch",
          compressTab: "Compress",
          imageTools: "Image tools",
          chooseImage: "Choose or drop an image",
          chooseImages: "Choose or drop images",
          imageTypes: "JPG, PNG, GIF, WebP",
          stitchLimit: "Up to 20 images, order can be adjusted",
          compressHint: "Adjust quality, format, and output dimensions",
          cropArea: "Crop Area",
          preview: "Preview",
          waitingImage: "Waiting for image",
          free: "Free",
          reset: "Reset",
          downloadPng: "Download PNG",
          download: "Download",
          imageList: "Image List",
          clear: "Clear",
          stitchSettings: "Stitch Settings",
          direction: "Layout",
          vertical: "Vertical",
          horizontal: "Horizontal",
          grid2: "2×2",
          grid3: "3×3",
          grid4: "4×4",
          align: "Align",
          center: "Center",
          start: "Start",
          end: "End",
          fit: "Scale",
          fitNone: "Keep original size",
          fitWidth: "Match width",
          fitHeight: "Match height",
          targetSize: "Target size px",
          gap: "Gap px",
          radius: "Radius px",
          background: "Background",
          format: "Format",
          compressSettings: "Compression Settings",
          outputFormat: "Output format",
          quality: "Quality",
          maxWidth: "Max width px",
          maxHeight: "Max height px",
          restoreSize: "Restore original size",
          selectImageError: "Please choose an image file",
          readError: "File read failed",
          imageLoadError: "Image load failed",
          original: "Original",
          output: "Output",
          size: "Size",
          change: "Change",
          imagesUnit: "images",
          moveUp: "Move up",
          moveDown: "Move down",
          remove: "Remove"
        }
      };
      var currentLanguage = resolveInitialLanguage();

      function resolveInitialLanguage() {
        var saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
        if (saved === "zh" || saved === "en") return saved;
        var browserLanguage = (navigator.language || "").toLowerCase();
        if (browserLanguage.indexOf("zh") === 0) return "zh";
        if (browserLanguage.indexOf("en") === 0) return "en";
        return "en";
      }

      function t(key) {
        return (TEXT[currentLanguage] && TEXT[currentLanguage][key]) || key;
      }

      function setText(selector, key) {
        var element = $(selector);
        if (element) element.textContent = t(key);
      }

      function setButtonText(selector, key) {
        var element = $(selector);
        if (!element) return;
        var nodes = Array.from(element.childNodes).reverse();
        var textNode = nodes.find(function (node) { return node.nodeType === Node.TEXT_NODE; });
        if (textNode) textNode.nodeValue = " " + t(key);
        else element.appendChild(document.createTextNode(t(key)));
      }

      function setInputLabel(inputId, key) {
        var input = document.getElementById(inputId);
        var label = input && input.closest("label");
        if (!label) return;
        var textNode = Array.from(label.childNodes).find(function (node) {
          return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim();
        });
        if (textNode) textNode.nodeValue = "\n              " + t(key) + "\n              ";
      }

      function setOptions(selector, keys) {
        var select = $(selector);
        if (!select) return;
        Array.from(select.options).forEach(function (option, index) {
          if (keys[index]) option.textContent = t(keys[index]);
        });
      }

      function applyLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = t("htmlLang");
        document.title = t("title");
        $(".topbar").setAttribute("aria-label", t("navLabel"));
        $("#themeButton").setAttribute("title", t("themeToggle"));
        $("#themeButton").setAttribute("aria-label", t("themeToggle"));
        document.querySelectorAll(".language button[data-lang]").forEach(function (button) {
          button.classList.toggle("active", button.dataset.lang === language);
        });

        setText("#homeText", "home");
        setText(".hero h1", "title");
        setText(".lead", "lead");
        $(".tabs").setAttribute("aria-label", t("imageTools"));
        setText('[data-tool="crop"]', "cropTab");
        setText('[data-tool="stitch"]', "stitchTab");
        setText('[data-tool="compress"]', "compressTab");
        setText("#cropUpload strong", "chooseImage");
        setText("#cropUpload span", "imageTypes");
        setText("#stitchUpload strong", "chooseImages");
        setText("#stitchUpload span", "stitchLimit");
        setText("#compressUpload strong", "chooseImage");
        setText("#compressUpload span", "compressHint");
        setText("#panel-crop .card:nth-of-type(1) h2", "cropArea");
        setText("#panel-crop .card:nth-of-type(2) h2", "preview");
        setText("#panel-stitch .card:nth-of-type(1) h2", "imageList");
        setText("#panel-stitch .card:nth-of-type(2) h2", "stitchSettings");
        setText("#panel-compress .card:nth-of-type(1) h2", "compressSettings");
        setText("#panel-compress .card:nth-of-type(2) h2", "preview");
        setText('#aspectButtons [data-ratio="free"]', "free");
        setButtonText("#cropReset", "reset");
        setButtonText("#cropDownload", "downloadPng");
        setButtonText("#stitchClear", "clear");
        setButtonText("#stitchDownload", "download");
        setButtonText("#compressDownload", "download");
        setButtonText("#resetSize", "restoreSize");
        setInputLabel("stitchDirection", "direction");
        setInputLabel("stitchAlign", "align");
        setInputLabel("stitchFit", "fit");
        setInputLabel("stitchSize", "targetSize");
        setInputLabel("stitchGap", "gap");
        setInputLabel("stitchRadius", "radius");
        setInputLabel("stitchBg", "background");
        setInputLabel("stitchFormat", "format");
        setInputLabel("compressFormat", "outputFormat");
        setInputLabel("compressQuality", "quality");
        setInputLabel("maxWidth", "maxWidth");
        setInputLabel("maxHeight", "maxHeight");
        setOptions("#stitchDirection", ["vertical", "horizontal", "grid2", "grid3", "grid4"]);
        setOptions("#stitchAlign", ["center", "start", "end"]);
        setOptions("#stitchFit", ["fitNone", "fitWidth", "fitHeight"]);
        if (!crop.img) $("#cropPreview").innerHTML = '<span class="empty">' + t("waitingImage") + "</span>";
        if (stitch.images.length === 0) $("#stitchPreview").innerHTML = '<span class="empty">' + t("waitingImage") + "</span>";
        if (!compress.img) $("#compressPreview").innerHTML = '<span class="empty">' + t("waitingImage") + "</span>";
        renderStitchList();
        updateCrop();
        updateStitchPreview();
        updateCompress();
      }

      function getSystemTheme() {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }

      function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
      }

      function resolveInitialTheme() {
        var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
        if (saved === "dark" || saved === "light") return saved;
        return getSystemTheme();
      }

      function formatBytes(bytes) {
        if (!Number.isFinite(bytes)) return "-";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / 1024 / 1024).toFixed(2) + " MB";
      }

      function safeName(file, suffix, mime) {
        var base = file && file.name ? file.name.replace(/\.[^.]+$/, "") : "image";
        var ext = mime === "image/jpeg" ? ".jpg" : mime === "image/webp" ? ".webp" : ".png";
        return base + suffix + ext;
      }

      function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (char) {
          return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
        });
      }

      function loadImage(file) {
        return new Promise(function (resolve, reject) {
          if (!file || !/^image\//.test(file.type)) {
            reject(new Error(t("selectImageError")));
            return;
          }
          var reader = new FileReader();
          reader.onerror = function () { reject(new Error(t("readError"))); };
          reader.onload = function () {
            var img = new Image();
            img.onerror = function () { reject(new Error(t("imageLoadError"))); };
            img.onload = function () {
              resolve({ file: file, img: img, dataUrl: reader.result });
            };
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        });
      }

      function canvasToBlob(canvas, mime, quality) {
        return new Promise(function (resolve) {
          canvas.toBlob(resolve, mime, quality);
        });
      }

      function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 800);
      }

      function setupUpload(label, input, callback) {
        label.addEventListener("click", function (event) {
          if (event.target === input) return;
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

      function setPreviewImage(container, blob) {
        container.innerHTML = "";
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function () { URL.revokeObjectURL(url); };
        img.src = url;
        container.appendChild(img);
      }

      function setTool(tool) {
        $$(".tabs button").forEach(function (item) { item.classList.toggle("active", item.dataset.tool === tool); });
        $$(".tool-panel").forEach(function (panel) { panel.classList.toggle("active", panel.id === "panel-" + tool); });
      }

      $(".tabs").addEventListener("click", function (event) {
        var target = event.target;
        var button = target && target.closest ? target.closest("button[data-tool]") : null;
        if (!button) return;
        setTool(button.dataset.tool);
      });

      var crop = {
        img: null,
        file: null,
        ratio: "free",
        displayW: 0,
        displayH: 0,
        rect: { x: 0, y: 0, w: 0, h: 0 },
        canvas: null,
        drag: null
      };

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function resetCropRect() {
        var margin = Math.round(Math.min(crop.displayW, crop.displayH) * 0.08);
        var w = crop.displayW - margin * 2;
        var h = crop.displayH - margin * 2;
        if (crop.ratio !== "free") {
          var ratio = Number(crop.ratio);
          if (w / h > ratio) w = h * ratio;
          else h = w / ratio;
        }
        crop.rect = {
          x: Math.round((crop.displayW - w) / 2),
          y: Math.round((crop.displayH - h) / 2),
          w: Math.round(w),
          h: Math.round(h)
        };
        updateCrop();
      }

      function updateCrop() {
        if (!crop.img) return;
        var r = crop.rect;
        $("#cropRect").style.left = r.x + "px";
        $("#cropRect").style.top = r.y + "px";
        $("#cropRect").style.width = r.w + "px";
        $("#cropRect").style.height = r.h + "px";

        $("#maskTop").style.cssText = "left:0;top:0;width:100%;height:" + r.y + "px";
        $("#maskBottom").style.cssText = "left:0;top:" + (r.y + r.h) + "px;width:100%;height:" + (crop.displayH - r.y - r.h) + "px";
        $("#maskLeft").style.cssText = "left:0;top:" + r.y + "px;width:" + r.x + "px;height:" + r.h + "px";
        $("#maskRight").style.cssText = "left:" + (r.x + r.w) + "px;top:" + r.y + "px;width:" + (crop.displayW - r.x - r.w) + "px;height:" + r.h + "px";

        var scaleX = crop.img.naturalWidth / crop.displayW;
        var scaleY = crop.img.naturalHeight / crop.displayH;
        var sx = Math.round(r.x * scaleX);
        var sy = Math.round(r.y * scaleY);
        var sw = Math.max(1, Math.round(r.w * scaleX));
        var sh = Math.max(1, Math.round(r.h * scaleY));
        var canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        canvas.getContext("2d").drawImage(crop.img, sx, sy, sw, sh, 0, 0, sw, sh);
        crop.canvas = canvas;

        var preview = $("#cropPreview");
        preview.innerHTML = "";
        preview.appendChild(canvas);
        $("#cropDownload").disabled = false;
        $("#cropMeta").innerHTML = "<span>" + t("original") + " <strong>" + crop.img.naturalWidth + " x " + crop.img.naturalHeight + " px</strong></span>";
        $("#cropOutputMeta").innerHTML = "<span>" + t("output") + " <strong>" + sw + " x " + sh + " px</strong></span>";
      }

      function cropPointerPosition(event) {
        var rect = $("#cropOverlay").getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      }

      function resizeCrop(pos) {
        var start = crop.drag.start;
        var handle = crop.drag.handle;
        var dx = pos.x - crop.drag.x;
        var dy = pos.y - crop.drag.y;
        var r = { x: start.x, y: start.y, w: start.w, h: start.h };
        var min = Math.max(1, Math.min(28, crop.displayW, crop.displayH));

        if (handle === "move") {
          r.x = clamp(start.x + dx, 0, crop.displayW - start.w);
          r.y = clamp(start.y + dy, 0, crop.displayH - start.h);
          crop.rect = r;
          updateCrop();
          return;
        }

        if (handle.indexOf("w") >= 0) {
          r.x = clamp(start.x + dx, 0, start.x + start.w - min);
          r.w = start.x + start.w - r.x;
        }
        if (handle.indexOf("e") >= 0) {
          r.w = clamp(start.w + dx, min, crop.displayW - start.x);
        }
        if (handle.indexOf("n") >= 0) {
          r.y = clamp(start.y + dy, 0, start.y + start.h - min);
          r.h = start.y + start.h - r.y;
        }
        if (handle.indexOf("s") >= 0) {
          r.h = clamp(start.h + dy, min, crop.displayH - start.y);
        }

        if (crop.ratio !== "free") {
          var ratio = Number(crop.ratio);
          var useWidth = handle.indexOf("e") >= 0 || handle.indexOf("w") >= 0;
          if ((handle.length === 2) && Math.abs(dx) < Math.abs(dy)) useWidth = false;
          if (useWidth) r.h = r.w / ratio;
          else r.w = r.h * ratio;
          if (handle.indexOf("n") >= 0) r.y = start.y + start.h - r.h;
          if (handle.indexOf("w") >= 0) r.x = start.x + start.w - r.w;
        }

        if (r.x < 0) r.x = 0;
        if (r.y < 0) r.y = 0;
        if (r.x + r.w > crop.displayW) r.w = crop.displayW - r.x;
        if (r.y + r.h > crop.displayH) r.h = crop.displayH - r.y;
        crop.rect = {
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.max(min, Math.round(r.w)),
          h: Math.max(min, Math.round(r.h))
        };
        updateCrop();
      }

      $("#cropOverlay").addEventListener("pointerdown", function (event) {
        if (!crop.img) return;
        var pos = cropPointerPosition(event);
        var handle = event.target.closest(".handle");
        var r = crop.rect;
        var mode = handle ? handle.dataset.handle : null;
        if (!mode && pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h) mode = "move";
        if (!mode) return;
        event.preventDefault();
        crop.drag = { handle: mode, x: pos.x, y: pos.y, start: Object.assign({}, r) };
      });

      window.addEventListener("pointermove", function (event) {
        if (!crop.drag) return;
        event.preventDefault();
        resizeCrop(cropPointerPosition(event));
      });

      window.addEventListener("pointerup", function () {
        crop.drag = null;
      });

      $("#aspectButtons").addEventListener("click", function (event) {
        var button = event.target.closest("button[data-ratio]");
        if (!button) return;
        crop.ratio = button.dataset.ratio;
        $$("#aspectButtons button").forEach(function (item) { item.classList.toggle("active", item === button); });
        if (crop.img) resetCropRect();
      });

      $("#cropReset").addEventListener("click", resetCropRect);

      $("#cropDownload").addEventListener("click", function () {
        if (!crop.canvas) return;
        canvasToBlob(crop.canvas, "image/png").then(function (blob) {
          downloadBlob(blob, safeName(crop.file, "-crop", "image/png"));
        });
      });

      setupUpload($("#cropUpload"), $("#cropFile"), function (files) {
        if (!files[0]) return;
        loadImage(files[0]).then(function (result) {
          crop.img = result.img;
          crop.file = result.file;
          var scale = Math.min(1, 760 / result.img.naturalWidth, 560 / result.img.naturalHeight);
          crop.displayW = Math.max(1, Math.round(result.img.naturalWidth * scale));
          crop.displayH = Math.max(1, Math.round(result.img.naturalHeight * scale));
          $("#cropImage").src = result.dataUrl;
          $("#cropImage").style.width = crop.displayW + "px";
          $("#cropImage").style.height = crop.displayH + "px";
          $("#cropBox").style.width = crop.displayW + "px";
          $("#cropBox").style.height = crop.displayH + "px";
          $("#cropWorkspace").classList.remove("hidden");
          resetCropRect();
        }).catch(function (error) {
          alert(error.message);
        });
      });

      var stitch = {
        images: [],
        canvas: null,
        blob: null,
        draggedIndex: null
      };

      function getStitchSettings() {
        return {
          direction: $("#stitchDirection").value,
          align: $("#stitchAlign").value,
          fit: $("#stitchFit").value,
          target: Math.max(1, Number($("#stitchSize").value) || 1),
          gap: Math.max(0, Number($("#stitchGap").value) || 0),
          radius: Math.max(0, Number($("#stitchRadius").value) || 0),
          bg: $("#stitchBg").value,
          format: $("#stitchFormat").value
        };
      }

      function roundedRect(ctx, x, y, w, h, radius) {
        var r = Math.min(radius, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      function moveStitchItem(from, to) {
        if (to < 0 || to >= stitch.images.length || from === to) return;
        var item = stitch.images.splice(from, 1)[0];
        stitch.images.splice(to, 0, item);
        renderStitchList();
        updateStitchPreview();
      }

      function renderStitchList() {
        var list = $("#stitchList");
        list.innerHTML = "";
        stitch.images.forEach(function (item, index) {
          var li = document.createElement("li");
          li.className = "image-item";
          li.draggable = true;
          li.innerHTML = [
            '<span class="drag-handle" aria-hidden="true">⋮⋮</span>',
            '<img class="thumb" src="' + item.dataUrl + '" alt="">',
            "<div>",
            '<div class="name">' + escapeHtml(item.file.name) + "</div>",
            '<div class="sub">' + item.img.naturalWidth + " x " + item.img.naturalHeight + " px · " + formatBytes(item.file.size) + "</div>",
            "</div>",
            '<div class="mini-actions">',
            '<button type="button" data-action="up" title="' + t("moveUp") + '">↑</button>',
            '<button type="button" data-action="down" title="' + t("moveDown") + '">↓</button>',
            '<button type="button" data-action="remove" title="' + t("remove") + '">×</button>',
            "</div>"
          ].join("");
          li.addEventListener("dragstart", function () {
            stitch.draggedIndex = index;
            li.classList.add("dragging");
          });
          li.addEventListener("dragend", function () {
            stitch.draggedIndex = null;
            li.classList.remove("dragging");
            $$("#stitchList .image-item").forEach(function (item) { item.classList.remove("drag-over"); });
          });
          li.addEventListener("dragover", function (event) {
            event.preventDefault();
            if (stitch.draggedIndex !== null && stitch.draggedIndex !== index) li.classList.add("drag-over");
          });
          li.addEventListener("dragleave", function () {
            li.classList.remove("drag-over");
          });
          li.addEventListener("drop", function (event) {
            event.preventDefault();
            li.classList.remove("drag-over");
            moveStitchItem(stitch.draggedIndex, index);
          });
          li.querySelector(".mini-actions").addEventListener("click", function (event) {
            var action = event.target.dataset.action;
            if (action === "up") moveStitchItem(index, index - 1);
            if (action === "down") moveStitchItem(index, index + 1);
            if (action === "remove") {
              stitch.images.splice(index, 1);
              renderStitchList();
              updateStitchPreview();
            }
          });
          list.appendChild(li);
        });
        $("#stitchWorkspace").classList.toggle("hidden", stitch.images.length === 0);
        $("#stitchCount").textContent = stitch.images.length + " / 20 " + t("imagesUnit");
      }

      function makeStitchCanvas() {
        var settings = getStitchSettings();
        var isVertical = settings.direction === "vertical";
        var gridSize = settings.direction === "grid2" ? 2 : settings.direction === "grid3" ? 3 : settings.direction === "grid4" ? 4 : 0;
        var items = stitch.images.map(function (item) {
          var w = item.img.naturalWidth;
          var h = item.img.naturalHeight;
          if (settings.fit === "width") {
            w = settings.target;
            h = item.img.naturalHeight * (settings.target / item.img.naturalWidth);
          }
          if (settings.fit === "height") {
            h = settings.target;
            w = item.img.naturalWidth * (settings.target / item.img.naturalHeight);
          }
          return { item: item, w: Math.round(w), h: Math.round(h) };
        });

        if (gridSize > 0) {
          var rows = Math.ceil(items.length / gridSize);
          var cellW = Math.max.apply(null, items.map(function (item) { return item.w; }));
          var cellH = Math.max.apply(null, items.map(function (item) { return item.h; }));
          var gridCanvas = document.createElement("canvas");
          gridCanvas.width = Math.max(1, gridSize * cellW + Math.max(0, gridSize - 1) * settings.gap);
          gridCanvas.height = Math.max(1, rows * cellH + Math.max(0, rows - 1) * settings.gap);
          var gridCtx = gridCanvas.getContext("2d");
          gridCtx.fillStyle = settings.bg;
          gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
          items.forEach(function (entry, index) {
            var col = index % gridSize;
            var row = Math.floor(index / gridSize);
            var cellX = col * (cellW + settings.gap);
            var cellY = row * (cellH + settings.gap);
            var x = cellX + (settings.align === "center" ? (cellW - entry.w) / 2 : settings.align === "end" ? cellW - entry.w : 0);
            var y = cellY + (cellH - entry.h) / 2;
            if (settings.radius > 0) {
              gridCtx.save();
              roundedRect(gridCtx, x, y, entry.w, entry.h, settings.radius);
              gridCtx.clip();
              gridCtx.drawImage(entry.item.img, x, y, entry.w, entry.h);
              gridCtx.restore();
            } else {
              gridCtx.drawImage(entry.item.img, x, y, entry.w, entry.h);
            }
          });
          return gridCanvas;
        }

        var gapTotal = Math.max(0, items.length - 1) * settings.gap;
        var canvasW = isVertical
          ? Math.max.apply(null, items.map(function (item) { return item.w; }))
          : items.reduce(function (sum, item) { return sum + item.w; }, 0) + gapTotal;
        var canvasH = isVertical
          ? items.reduce(function (sum, item) { return sum + item.h; }, 0) + gapTotal
          : Math.max.apply(null, items.map(function (item) { return item.h; }));

        var canvas = document.createElement("canvas");
        canvas.width = Math.max(1, canvasW);
        canvas.height = Math.max(1, canvasH);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = settings.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var offset = 0;
        items.forEach(function (entry) {
          var x = 0;
          var y = 0;
          if (isVertical) {
            y = offset;
            x = settings.align === "center" ? (canvas.width - entry.w) / 2 : settings.align === "end" ? canvas.width - entry.w : 0;
            offset += entry.h + settings.gap;
          } else {
            x = offset;
            y = settings.align === "center" ? (canvas.height - entry.h) / 2 : settings.align === "end" ? canvas.height - entry.h : 0;
            offset += entry.w + settings.gap;
          }
          if (settings.radius > 0) {
            ctx.save();
            roundedRect(ctx, x, y, entry.w, entry.h, settings.radius);
            ctx.clip();
            ctx.drawImage(entry.item.img, x, y, entry.w, entry.h);
            ctx.restore();
          } else {
            ctx.drawImage(entry.item.img, x, y, entry.w, entry.h);
          }
        });
        return canvas;
      }

      function updateStitchPreview() {
        if (stitch.images.length === 0) {
          $("#stitchPreview").innerHTML = '<span class="empty">' + t("waitingImage") + "</span>";
          $("#stitchDownload").disabled = true;
          $("#stitchMeta").textContent = "";
          return;
        }
        var canvas = makeStitchCanvas();
        stitch.canvas = canvas;
        var preview = $("#stitchPreview");
        preview.innerHTML = "";
        preview.appendChild(canvas);
        $("#stitchDownload").disabled = false;
        $("#stitchMeta").innerHTML = "<span>" + t("output") + " <strong>" + canvas.width + " x " + canvas.height + " px</strong></span>";
      }

      setupUpload($("#stitchUpload"), $("#stitchFiles"), function (files) {
        var slots = 20 - stitch.images.length;
        var selected = files.filter(function (file) { return /^image\//.test(file.type); }).slice(0, slots);
        if (selected.length === 0) return;
        Promise.all(selected.map(loadImage)).then(function (results) {
          stitch.images = stitch.images.concat(results);
          renderStitchList();
          updateStitchPreview();
        }).catch(function (error) {
          alert(error.message);
        });
      });

      ["stitchDirection", "stitchAlign", "stitchFit", "stitchSize", "stitchGap", "stitchRadius", "stitchBg", "stitchFormat"].forEach(function (id) {
        $("#" + id).addEventListener("input", updateStitchPreview);
        $("#" + id).addEventListener("change", updateStitchPreview);
      });

      $("#stitchClear").addEventListener("click", function () {
        stitch.images = [];
        stitch.canvas = null;
        renderStitchList();
        updateStitchPreview();
      });

      $("#stitchDownload").addEventListener("click", function () {
        if (!stitch.canvas) return;
        var settings = getStitchSettings();
        canvasToBlob(stitch.canvas, settings.format, .92).then(function (blob) {
          downloadBlob(blob, safeName(stitch.images[0] && stitch.images[0].file, "-stitch", settings.format));
        });
      });

      var compress = {
        img: null,
        file: null,
        canvas: null,
        blob: null,
        timer: 0
      };

      function getCompressedSize() {
        var maxW = Math.max(1, Number($("#maxWidth").value) || compress.img.naturalWidth);
        var maxH = Math.max(1, Number($("#maxHeight").value) || compress.img.naturalHeight);
        var scale = Math.min(1, maxW / compress.img.naturalWidth, maxH / compress.img.naturalHeight);
        return {
          w: Math.max(1, Math.round(compress.img.naturalWidth * scale)),
          h: Math.max(1, Math.round(compress.img.naturalHeight * scale))
        };
      }

      function updateCompress() {
        if (!compress.img) return;
        var size = getCompressedSize();
        var format = $("#compressFormat").value;
        var quality = Number($("#compressQuality").value) / 100;
        var canvas = document.createElement("canvas");
        canvas.width = size.w;
        canvas.height = size.h;
        var ctx = canvas.getContext("2d");
        if (format === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(compress.img, 0, 0, size.w, size.h);
        compress.canvas = canvas;
        canvasToBlob(canvas, format, quality).then(function (blob) {
          compress.blob = blob;
          setPreviewImage($("#compressPreview"), blob);
          $("#compressDownload").disabled = false;
          var saved = compress.file.size > 0 ? (1 - blob.size / compress.file.size) * 100 : 0;
          $("#compressOutputMeta").innerHTML = [
            "<span>" + t("output") + " <strong>" + size.w + " x " + size.h + " px</strong></span>",
            "<span>" + t("size") + " <strong>" + formatBytes(blob.size) + "</strong></span>",
            "<span>" + t("change") + " <strong>" + saved.toFixed(1) + "%</strong></span>"
          ].join("");
        });
      }

      function queueCompress() {
        clearTimeout(compress.timer);
        compress.timer = setTimeout(updateCompress, 120);
      }

      setupUpload($("#compressUpload"), $("#compressFile"), function (files) {
        if (!files[0]) return;
        loadImage(files[0]).then(function (result) {
          compress.img = result.img;
          compress.file = result.file;
          $("#maxWidth").value = result.img.naturalWidth;
          $("#maxHeight").value = result.img.naturalHeight;
          $("#compressWorkspace").classList.remove("hidden");
          $("#compressMeta").innerHTML = [
            "<span>" + t("original") + " <strong>" + result.img.naturalWidth + " x " + result.img.naturalHeight + " px</strong></span>",
            "<span>" + t("size") + " <strong>" + formatBytes(result.file.size) + "</strong></span>"
          ].join("");
          updateCompress();
        }).catch(function (error) {
          alert(error.message);
        });
      });

      ["compressFormat", "compressQuality", "maxWidth", "maxHeight"].forEach(function (id) {
        $("#" + id).addEventListener("input", function () {
          $("#qualityText").textContent = $("#compressQuality").value + "%";
          queueCompress();
        });
        $("#" + id).addEventListener("change", queueCompress);
      });

      $("#resetSize").addEventListener("click", function () {
        if (!compress.img) return;
        $("#maxWidth").value = compress.img.naturalWidth;
        $("#maxHeight").value = compress.img.naturalHeight;
        updateCompress();
      });

      $("#compressDownload").addEventListener("click", function () {
        if (!compress.blob) return;
        downloadBlob(compress.blob, safeName(compress.file, "-compressed", $("#compressFormat").value));
      });

      document.querySelectorAll(".language button[data-lang]").forEach(function (button) {
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
      });

      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
          var saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
          if (saved === "dark" || saved === "light") return;
          applyTheme(event.matches ? "dark" : "light");
        });
      }

      applyTheme(resolveInitialTheme());
      applyLanguage(currentLanguage);
    })();
