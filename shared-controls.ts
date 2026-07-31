(function (global: any) {
  "use strict";

  type MediaElement = HTMLAudioElement | HTMLVideoElement;

  type SelectController = {
    select: HTMLSelectElement;
    root: HTMLElement;
    button: HTMLButtonElement;
    value: HTMLElement;
    menu: HTMLElement;
    observer: MutationObserver;
    activeIndex: number;
    open: boolean;
    typeahead: string;
    typeaheadTimer: number | null;
  };

  type NumberController = {
    input: HTMLInputElement;
    root: HTMLElement;
    decrement: HTMLButtonElement;
    increment: HTMLButtonElement;
    observer: MutationObserver;
  };

  type RangeController = {
    input: HTMLInputElement;
    observer: MutationObserver;
  };

  type MediaController = {
    media: MediaElement;
    root: HTMLElement;
    playButton: HTMLButtonElement;
    seek: HTMLInputElement;
    time: HTMLElement;
    muteButton: HTMLButtonElement;
    volume: HTMLInputElement;
    rate: HTMLElement;
    fullscreenButton: HTMLButtonElement | null;
    seeking: boolean;
  };

  var TEXT = {
    zh: {
      choose: "选择选项",
      decrease: "减少{label}",
      increase: "增加{label}",
      play: "播放",
      pause: "暂停",
      seek: "播放进度",
      mute: "静音",
      unmute: "取消静音",
      volume: "音量",
      fullscreen: "全屏查看",
      exitFullscreen: "退出全屏",
      audioPlayer: "音频播放器",
      videoPlayer: "视频播放器"
    },
    en: {
      choose: "Choose an option",
      decrease: "Decrease {label}",
      increase: "Increase {label}",
      play: "Play",
      pause: "Pause",
      seek: "Playback position",
      mute: "Mute",
      unmute: "Unmute",
      volume: "Volume",
      fullscreen: "Enter fullscreen",
      exitFullscreen: "Exit fullscreen",
      audioPlayer: "Audio player",
      videoPlayer: "Video player"
    }
  };

  var selectControllers = new WeakMap<HTMLSelectElement, SelectController>();
  var selectControllerSet = new Set<SelectController>();
  var numberControllers = new WeakMap<HTMLInputElement, NumberController>();
  var numberControllerSet = new Set<NumberController>();
  var rangeControllers = new WeakMap<HTMLInputElement, RangeController>();
  var rangeControllerSet = new Set<RangeController>();
  var mediaControllers = new WeakMap<MediaElement, MediaController>();
  var mediaControllerSet = new Set<MediaController>();
  var openSelect: SelectController | null = null;
  var selectId = 0;
  var refreshFrame = 0;

  function locale(): "zh" | "en" {
    return document.documentElement.lang.toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  function text(key: keyof typeof TEXT.zh) {
    return TEXT[locale()][key];
  }

  function replaceLabel(template: string, label: string) {
    return template.replace("{label}", label);
  }

  function controlLabel(element: HTMLElement) {
    var ariaLabel = element.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel.trim();
    var labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      var labelledElement = document.getElementById(labelledBy);
      if (labelledElement && labelledElement.textContent) return labelledElement.textContent.trim();
    }
    var label = element.closest("label");
    if (label) {
      var labelText = label.querySelector("span");
      if (labelText && labelText.textContent) return labelText.textContent.trim();
    }
    return element.getAttribute("name") || element.id || "";
  }

  function collect<T extends Element>(root: ParentNode, selector: string): T[] {
    var result: T[] = [];
    if (root instanceof Element && root.matches(selector)) result.push(root as T);
    return result.concat(Array.from(root.querySelectorAll<T>(selector)));
  }

  function copyControlDimensions(source: HTMLElement, target: HTMLElement) {
    var style = window.getComputedStyle(source);
    var minHeight = parseFloat(style.minHeight);
    var height = source.getBoundingClientRect().height;
    var resolvedHeight = Number.isFinite(minHeight) && minHeight > 0 ? minHeight : height;
    target.style.setProperty("--wt-control-height", (resolvedHeight > 0 ? resolvedHeight : 38) + "px");
    target.style.setProperty("--wt-control-radius", style.borderRadius || "8px");
  }

  function createButton(className: string) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    return button;
  }

  function positionSelectMenu(controller: SelectController) {
    if (!controller.open) return;
    var rect = controller.button.getBoundingClientRect();
    var gap = 6;
    var viewportPadding = 8;
    controller.menu.style.width = rect.width + "px";
    controller.menu.style.left = Math.max(
      viewportPadding,
      Math.min(window.innerWidth - rect.width - viewportPadding, rect.left)
    ) + "px";
    var menuHeight = controller.menu.offsetHeight;
    var below = window.innerHeight - rect.bottom - gap - viewportPadding;
    var above = rect.top - gap - viewportPadding;
    var placeAbove = below < Math.min(menuHeight, 180) && above > below;
    var top = placeAbove
      ? Math.max(viewportPadding, rect.top - menuHeight - gap)
      : Math.min(window.innerHeight - menuHeight - viewportPadding, rect.bottom + gap);
    controller.menu.style.top = Math.max(viewportPadding, top) + "px";
  }

  function setActiveOption(controller: SelectController, index: number) {
    var options = Array.from(controller.select.options);
    if (!options.length) {
      controller.activeIndex = -1;
      controller.button.removeAttribute("aria-activedescendant");
      return;
    }
    var nextIndex = Math.max(0, Math.min(options.length - 1, index));
    var direction = nextIndex >= controller.activeIndex ? 1 : -1;
    while (options[nextIndex] && options[nextIndex].disabled) {
      nextIndex += direction;
      if (nextIndex < 0 || nextIndex >= options.length) return;
    }
    controller.activeIndex = nextIndex;
    controller.button.setAttribute("aria-activedescendant", controller.menu.id + "-option-" + nextIndex);
    Array.from(controller.menu.children).forEach(function (child, childIndex) {
      if (!(child instanceof HTMLElement)) return;
      child.classList.toggle("active", childIndex === nextIndex);
      if (childIndex === nextIndex) child.scrollIntoView({ block: "nearest" });
    });
  }

  function chooseOption(controller: SelectController, index: number) {
    var option = controller.select.options[index];
    if (!option || option.disabled) return;
    controller.select.selectedIndex = index;
    controller.select.dispatchEvent(new Event("input", { bubbles: true }));
    controller.select.dispatchEvent(new Event("change", { bubbles: true }));
    syncSelect(controller);
    closeSelectMenu(controller, true);
  }

  function renderSelectMenu(controller: SelectController) {
    controller.menu.innerHTML = "";
    Array.from(controller.select.options).forEach(function (option, index) {
      var item = createButton("wt-select-option");
      item.setAttribute("role", "option");
      item.id = controller.menu.id + "-option-" + index;
      item.setAttribute("aria-selected", option.selected ? "true" : "false");
      item.disabled = option.disabled;
      item.textContent = option.textContent || option.label;
      if (option.selected) item.classList.add("selected");
      item.addEventListener("pointermove", function () {
        if (!option.disabled) setActiveOption(controller, index);
      });
      item.addEventListener("click", function () { chooseOption(controller, index); });
      controller.menu.appendChild(item);
    });
  }

  function syncSelect(controller: SelectController) {
    var selected = controller.select.options[controller.select.selectedIndex];
    controller.value.textContent = selected ? selected.textContent || selected.label : text("choose");
    controller.button.disabled = controller.select.disabled;
    controller.root.classList.toggle("disabled", controller.select.disabled);
    controller.button.setAttribute("aria-label", controlLabel(controller.select) || text("choose"));
    renderSelectMenu(controller);
    if (controller.open) {
      setActiveOption(controller, controller.select.selectedIndex);
      positionSelectMenu(controller);
    }
  }

  function closeSelectMenu(controller: SelectController, restoreFocus: boolean) {
    if (!controller.open) return;
    controller.open = false;
    controller.menu.hidden = true;
    controller.button.setAttribute("aria-expanded", "false");
    controller.root.classList.remove("open");
    controller.button.removeAttribute("aria-activedescendant");
    controller.typeahead = "";
    if (controller.typeaheadTimer) window.clearTimeout(controller.typeaheadTimer);
    controller.typeaheadTimer = null;
    if (openSelect === controller) openSelect = null;
    if (restoreFocus && controller.button.isConnected) controller.button.focus({ preventScroll: true });
  }

  function openSelectMenu(controller: SelectController) {
    if (controller.select.disabled) return;
    if (openSelect && openSelect !== controller) closeSelectMenu(openSelect, false);
    syncSelect(controller);
    controller.open = true;
    controller.menu.hidden = false;
    controller.button.setAttribute("aria-expanded", "true");
    controller.root.classList.add("open");
    openSelect = controller;
    setActiveOption(controller, Math.max(0, controller.select.selectedIndex));
    positionSelectMenu(controller);
  }

  function moveSelectActive(controller: SelectController, offset: number) {
    if (!controller.open) openSelectMenu(controller);
    var options = Array.from(controller.select.options);
    if (!options.length) return;
    var index = controller.activeIndex;
    for (var attempts = 0; attempts < options.length; attempts += 1) {
      index = Math.max(0, Math.min(options.length - 1, index + offset));
      if (!options[index].disabled) {
        setActiveOption(controller, index);
        return;
      }
      if (index === 0 || index === options.length - 1) return;
    }
  }

  function typeaheadSelect(controller: SelectController, character: string) {
    if (controller.typeaheadTimer) window.clearTimeout(controller.typeaheadTimer);
    controller.typeahead += character.toLocaleLowerCase();
    controller.typeaheadTimer = window.setTimeout(function () {
      controller.typeahead = "";
      controller.typeaheadTimer = null;
    }, 650);
    if (!controller.open) openSelectMenu(controller);
    var options = Array.from(controller.select.options);
    if (!options.length) return;
    var start = Math.max(0, controller.activeIndex + 1);
    for (var offset = 0; offset < options.length; offset += 1) {
      var index = (start + offset) % options.length;
      var option = options[index];
      if (!option.disabled && (option.textContent || option.label).trim().toLocaleLowerCase().startsWith(controller.typeahead)) {
        setActiveOption(controller, index);
        return;
      }
    }
  }

  function enhanceSelect(select: HTMLSelectElement) {
    if (selectControllers.has(select) || select.multiple || select.dataset.nativeControl === "true") return;
    var root = document.createElement("div");
    root.className = "wt-select";
    copyControlDimensions(select, root);
    select.parentNode!.insertBefore(root, select);
    root.appendChild(select);
    select.classList.add("wt-native-select");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");

    var button = createButton("wt-select-button");
    button.setAttribute("role", "combobox");
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    var value = document.createElement("span");
    value.className = "wt-select-value";
    var chevron = document.createElement("span");
    chevron.className = "wt-select-chevron";
    chevron.setAttribute("aria-hidden", "true");
    button.append(value, chevron);
    root.appendChild(button);

    selectId += 1;
    var menu = document.createElement("div");
    menu.className = "wt-select-menu";
    menu.id = "wt-select-menu-" + selectId;
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    document.body.appendChild(menu);
    button.setAttribute("aria-controls", menu.id);

    var observer = new MutationObserver(function () { syncSelect(controller); });
    var controller: SelectController = {
      select: select,
      root: root,
      button: button,
      value: value,
      menu: menu,
      observer: observer,
      activeIndex: select.selectedIndex,
      open: false,
      typeahead: "",
      typeaheadTimer: null
    };
    selectControllers.set(select, controller);
    selectControllerSet.add(controller);
    observer.observe(select, {
      attributes: true,
      attributeFilter: ["disabled"],
      childList: true,
      subtree: true,
      characterData: true
    });

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (controller.open) closeSelectMenu(controller, false);
      else openSelectMenu(controller);
    });
    button.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelectActive(controller, 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelectActive(controller, -1);
      } else if (event.key === "Home") {
        event.preventDefault();
        if (!controller.open) openSelectMenu(controller);
        setActiveOption(controller, 0);
      } else if (event.key === "End") {
        event.preventDefault();
        if (!controller.open) openSelectMenu(controller);
        setActiveOption(controller, controller.select.options.length - 1);
      } else if ((event.key === "Enter" || event.key === " ") && controller.open) {
        event.preventDefault();
        chooseOption(controller, controller.activeIndex);
      } else if (event.key === "Escape" && controller.open) {
        event.preventDefault();
        closeSelectMenu(controller, true);
      } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        typeaheadSelect(controller, event.key);
      }
    });
    select.addEventListener("input", function () { syncSelect(controller); });
    select.addEventListener("change", function () { syncSelect(controller); });
    select.addEventListener("focus", function () { button.focus({ preventScroll: true }); });
    syncSelect(controller);
  }

  function readNumber(input: HTMLInputElement) {
    var value = Number(input.value);
    return Number.isFinite(value) ? value : null;
  }

  function syncNumber(controller: NumberController) {
    var input = controller.input;
    var value = readNumber(input);
    var min = input.min === "" ? null : Number(input.min);
    var max = input.max === "" ? null : Number(input.max);
    var unavailable = input.disabled || input.readOnly;
    controller.root.classList.toggle("disabled", unavailable);
    controller.decrement.disabled = unavailable || (value !== null && min !== null && value <= min);
    controller.increment.disabled = unavailable || (value !== null && max !== null && value >= max);
    var label = controlLabel(input);
    controller.decrement.setAttribute("aria-label", replaceLabel(text("decrease"), label));
    controller.increment.setAttribute("aria-label", replaceLabel(text("increase"), label));
    controller.decrement.dataset.tooltip = controller.decrement.getAttribute("aria-label") || "";
    controller.increment.dataset.tooltip = controller.increment.getAttribute("aria-label") || "";
  }

  function stepNumber(controller: NumberController, direction: number) {
    var input = controller.input;
    if (input.disabled || input.readOnly) return;
    try {
      if (direction > 0) input.stepUp();
      else input.stepDown();
    } catch (_error) {
      var step = input.step === "any" ? 1 : Number(input.step) || 1;
      var current = readNumber(input);
      input.value = String((current === null ? 0 : current) + step * direction);
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    syncNumber(controller);
    input.focus({ preventScroll: true });
  }

  function enhanceNumber(input: HTMLInputElement) {
    if (numberControllers.has(input) || input.dataset.nativeControl === "true") return;
    input.classList.add("wt-number-input");
    if (input.readOnly) return;
    var root = document.createElement("div");
    root.className = "wt-number";
    copyControlDimensions(input, root);
    input.parentNode!.insertBefore(root, input);
    root.appendChild(input);
    var steps = document.createElement("div");
    steps.className = "wt-number-steps";
    var decrement = createButton("wt-number-button");
    decrement.textContent = "-";
    var increment = createButton("wt-number-button");
    increment.textContent = "+";
    steps.append(decrement, increment);
    root.appendChild(steps);
    var observer = new MutationObserver(function () { syncNumber(controller); });
    var controller: NumberController = {
      input: input,
      root: root,
      decrement: decrement,
      increment: increment,
      observer: observer
    };
    numberControllers.set(input, controller);
    numberControllerSet.add(controller);
    observer.observe(input, {
      attributes: true,
      attributeFilter: ["disabled", "readonly", "min", "max", "step"]
    });
    decrement.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      stepNumber(controller, -1);
    });
    increment.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      stepNumber(controller, 1);
    });
    input.addEventListener("input", function () { syncNumber(controller); });
    input.addEventListener("change", function () { syncNumber(controller); });
    syncNumber(controller);
  }

  function syncRange(controller: RangeController) {
    var input = controller.input;
    var min = Number(input.min);
    var max = Number(input.max);
    var value = Number(input.value);
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max) || max <= min) max = min + 100;
    if (!Number.isFinite(value)) value = min;
    var progress = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    input.style.setProperty("--wt-range-progress", progress + "%");
    input.classList.toggle("disabled", input.disabled);
  }

  function enhanceRange(input: HTMLInputElement) {
    if (rangeControllers.has(input) || input.dataset.nativeControl === "true") return;
    input.classList.add("wt-range-control");
    var observer = new MutationObserver(function () { syncRange(controller); });
    var controller: RangeController = { input: input, observer: observer };
    rangeControllers.set(input, controller);
    rangeControllerSet.add(controller);
    observer.observe(input, {
      attributes: true,
      attributeFilter: ["disabled", "min", "max", "step", "value"]
    });
    input.addEventListener("input", function () { syncRange(controller); });
    input.addEventListener("change", function () { syncRange(controller); });
    syncRange(controller);
  }

  function enhanceCheckbox(input: HTMLInputElement) {
    if (input.dataset.nativeControl === "true") return;
    input.classList.add("wt-checkbox");
  }

  function enhanceColor(input: HTMLInputElement) {
    if (input.dataset.nativeControl === "true") return;
    copyControlDimensions(input, input);
    input.classList.add("wt-color");
  }

  function formatTime(value: number) {
    if (!Number.isFinite(value) || value < 0) return "--:--";
    var total = Math.floor(value);
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var seconds = total % 60;
    if (hours > 0) {
      return hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }
    return minutes + ":" + String(seconds).padStart(2, "0");
  }

  function hasMediaSource(media: MediaElement) {
    return Boolean(media.currentSrc || media.getAttribute("src") || media.querySelector("source"));
  }

  function setTooltip(button: HTMLButtonElement, label: string) {
    button.setAttribute("aria-label", label);
    button.dataset.tooltip = label;
  }

  function syncMediaText(controller: MediaController) {
    var media = controller.media;
    controller.root.setAttribute("aria-label", text(media instanceof HTMLVideoElement ? "videoPlayer" : "audioPlayer"));
    setTooltip(controller.playButton, media.paused ? text("play") : text("pause"));
    setTooltip(controller.muteButton, media.muted || media.volume === 0 ? text("unmute") : text("mute"));
    controller.seek.setAttribute("aria-label", text("seek"));
    controller.volume.setAttribute("aria-label", text("volume"));
    if (controller.fullscreenButton) {
      setTooltip(
        controller.fullscreenButton,
        document.fullscreenElement === controller.root ? text("exitFullscreen") : text("fullscreen")
      );
    }
  }

  function syncMedia(controller: MediaController) {
    var media = controller.media;
    var duration = Number(media.duration);
    var current = Number(media.currentTime);
    var validDuration = Number.isFinite(duration) && duration > 0;
    var fraction = validDuration ? Math.max(0, Math.min(1, current / duration)) : 0;
    var buffered = 0;
    if (validDuration && media.buffered.length) {
      try {
        buffered = Math.max(0, Math.min(1, media.buffered.end(media.buffered.length - 1) / duration));
      } catch (_error) {
        buffered = 0;
      }
    }
    if (!controller.seeking) controller.seek.value = String(Math.round(fraction * 1000));
    controller.seek.disabled = !validDuration;
    controller.seek.style.setProperty("--wt-range-buffered", buffered * 100 + "%");
    syncRange(rangeControllers.get(controller.seek)!);
    controller.time.textContent = formatTime(Number.isFinite(current) ? current : 0) + " / " + formatTime(duration);
    controller.seek.setAttribute("aria-valuetext", controller.time.textContent);
    controller.playButton.classList.toggle("playing", !media.paused);
    controller.playButton.disabled = !hasMediaSource(media);
    controller.muteButton.classList.toggle("muted", media.muted || media.volume === 0);
    controller.volume.value = String(media.muted ? 0 : media.volume);
    controller.volume.setAttribute("aria-valuetext", Math.round((media.muted ? 0 : media.volume) * 100) + "%");
    syncRange(rangeControllers.get(controller.volume)!);
    var rate = Number(media.playbackRate) || 1;
    controller.rate.textContent = rate.toFixed(rate % 1 === 0 ? 0 : 2).replace(/0+$/, "").replace(/\.$/, "") + "x";
    controller.rate.hidden = Math.abs(rate - 1) < .001;
    controller.root.classList.toggle("has-error", Boolean(media.error));
    syncMediaText(controller);
  }

  function toggleMedia(controller: MediaController) {
    var media = controller.media;
    if (!hasMediaSource(media)) return;
    if (media.paused) {
      var result = media.play();
      if (result && typeof result.catch === "function") result.catch(function () {});
    } else {
      media.pause();
    }
  }

  function toggleFullscreen(controller: MediaController) {
    if (document.fullscreenElement === controller.root) {
      if (document.exitFullscreen) void document.exitFullscreen();
      return;
    }
    if (controller.root.requestFullscreen) {
      void controller.root.requestFullscreen();
      return;
    }
    var video = controller.media as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  }

  function mediaIconButton(action: string) {
    var button = createButton("wt-media-button wt-media-" + action);
    var icon = document.createElement("span");
    icon.className = "wt-media-icon";
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);
    return button;
  }

  function enhanceMedia(media: MediaElement) {
    if (mediaControllers.has(media) || media.dataset.nativeControl === "true") return;
    var isVideo = media instanceof HTMLVideoElement;
    var root = document.createElement("div");
    root.className = "wt-media-player wt-media-player--" + (isVideo ? "video" : "audio");
    root.setAttribute("role", "group");
    media.parentNode!.insertBefore(root, media);
    root.appendChild(media);
    media.controls = false;
    media.classList.add("wt-media-element");
    if (isVideo) (media as HTMLVideoElement).playsInline = true;

    var controls = document.createElement("div");
    controls.className = "wt-media-controls";
    var playButton = mediaIconButton("play");
    var timeNode = document.createElement("span");
    timeNode.className = "wt-media-time";
    var seek = document.createElement("input");
    seek.type = "range";
    seek.className = "wt-media-seek";
    seek.min = "0";
    seek.max = "1000";
    seek.step = "1";
    seek.value = "0";
    var muteButton = mediaIconButton("mute");
    var volume = document.createElement("input");
    volume.type = "range";
    volume.className = "wt-media-volume";
    volume.min = "0";
    volume.max = "1";
    volume.step = "0.01";
    volume.value = String(media.volume);
    var rate = document.createElement("span");
    rate.className = "wt-media-rate";
    rate.hidden = true;
    controls.append(playButton, timeNode, seek, muteButton, volume, rate);

    var fullscreenButton: HTMLButtonElement | null = null;
    if (isVideo) {
      fullscreenButton = mediaIconButton("fullscreen");
      controls.appendChild(fullscreenButton);
    }
    root.appendChild(controls);
    enhanceRange(seek);
    enhanceRange(volume);

    var controller: MediaController = {
      media: media,
      root: root,
      playButton: playButton,
      seek: seek,
      time: timeNode,
      muteButton: muteButton,
      volume: volume,
      rate: rate,
      fullscreenButton: fullscreenButton,
      seeking: false
    };
    mediaControllers.set(media, controller);
    mediaControllerSet.add(controller);

    playButton.addEventListener("click", function () { toggleMedia(controller); });
    muteButton.addEventListener("click", function () {
      media.muted = !(media.muted || media.volume === 0);
      if (!media.muted && media.volume === 0) media.volume = .5;
    });
    seek.addEventListener("pointerdown", function () { controller.seeking = true; });
    seek.addEventListener("pointerup", function () { controller.seeking = false; });
    seek.addEventListener("pointercancel", function () { controller.seeking = false; });
    seek.addEventListener("input", function () {
      var duration = Number(media.duration);
      if (Number.isFinite(duration) && duration > 0) {
        media.currentTime = (Number(seek.value) / 1000) * duration;
        controller.time.textContent = formatTime(media.currentTime) + " / " + formatTime(duration);
      }
    });
    volume.addEventListener("input", function () {
      media.volume = Math.max(0, Math.min(1, Number(volume.value)));
      media.muted = media.volume === 0;
    });
    if (fullscreenButton) {
      fullscreenButton.addEventListener("click", function () { toggleFullscreen(controller); });
      media.addEventListener("dblclick", function () { toggleFullscreen(controller); });
    }
    if (isVideo) media.addEventListener("click", function () { toggleMedia(controller); });
    [
      "durationchange",
      "emptied",
      "ended",
      "error",
      "loadstart",
      "loadedmetadata",
      "pause",
      "play",
      "playing",
      "progress",
      "ratechange",
      "timeupdate",
      "volumechange",
      "waiting"
    ].forEach(function (eventName) {
      media.addEventListener(eventName, function () { syncMedia(controller); });
    });
    syncMedia(controller);
  }

  function pruneDisconnected() {
    selectControllerSet.forEach(function (controller) {
      if (controller.select.isConnected) return;
      if (openSelect === controller) openSelect = null;
      controller.observer.disconnect();
      controller.menu.remove();
      selectControllerSet.delete(controller);
    });
    numberControllerSet.forEach(function (controller) {
      if (controller.input.isConnected) return;
      controller.observer.disconnect();
      numberControllerSet.delete(controller);
    });
    rangeControllerSet.forEach(function (controller) {
      if (controller.input.isConnected) return;
      controller.observer.disconnect();
      rangeControllerSet.delete(controller);
    });
    mediaControllerSet.forEach(function (controller) {
      if (!controller.media.isConnected) mediaControllerSet.delete(controller);
    });
  }

  function enhance(root: ParentNode) {
    collect<HTMLSelectElement>(root, "select").forEach(enhanceSelect);
    collect<HTMLInputElement>(root, 'input[type="number"]').forEach(enhanceNumber);
    collect<HTMLInputElement>(root, 'input[type="range"]').forEach(enhanceRange);
    collect<HTMLInputElement>(root, 'input[type="checkbox"]').forEach(enhanceCheckbox);
    collect<HTMLInputElement>(root, 'input[type="color"]').forEach(enhanceColor);
    collect<MediaElement>(root, "audio, video").forEach(enhanceMedia);
  }

  function refreshAll() {
    pruneDisconnected();
    selectControllerSet.forEach(syncSelect);
    numberControllerSet.forEach(syncNumber);
    rangeControllerSet.forEach(syncRange);
    mediaControllerSet.forEach(syncMedia);
  }

  function scheduleRefresh() {
    if (refreshFrame) return;
    refreshFrame = window.requestAnimationFrame(function () {
      refreshFrame = 0;
      refreshAll();
    });
  }

  function initialize() {
    enhance(document);
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.from(mutation.addedNodes).forEach(function (node) {
          if (node instanceof Element) enhance(node);
        });
      });
      pruneDisconnected();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    var languageObserver = new MutationObserver(refreshAll);
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    document.addEventListener("input", scheduleRefresh);
    document.addEventListener("change", scheduleRefresh);
    document.addEventListener("pointerdown", function (event) {
      if (!openSelect) return;
      var target = event.target as Node;
      if (openSelect.root.contains(target) || openSelect.menu.contains(target)) return;
      closeSelectMenu(openSelect, false);
    });
    document.addEventListener("focusin", function (event) {
      if (!openSelect) return;
      var target = event.target as Node;
      if (openSelect.root.contains(target) || openSelect.menu.contains(target)) return;
      closeSelectMenu(openSelect, false);
    });
    document.addEventListener("fullscreenchange", function () {
      mediaControllerSet.forEach(syncMediaText);
    });
    window.addEventListener("resize", function () {
      if (openSelect) positionSelectMenu(openSelect);
    });
    window.addEventListener("scroll", function () {
      if (openSelect) positionSelectMenu(openSelect);
    }, true);
  }

  global.WebToolsControls = {
    enhance: enhance,
    refresh: refreshAll,
    refreshSelect: function (select: HTMLSelectElement) {
      var controller = selectControllers.get(select);
      if (controller) syncSelect(controller);
    },
    refreshRange: function (input: HTMLInputElement) {
      var controller = rangeControllers.get(input);
      if (controller) syncRange(controller);
    },
    getMediaController: function (media: MediaElement) {
      return mediaControllers.get(media) || null;
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})(window);
