"use strict";
(function (global) {
    "use strict";
    var controllers = new WeakMap();
    var activeSession = null;
    var announcer = null;
    function getItems(controller) {
        return Array.from(controller.options.container.children).filter(function (child) {
            return child instanceof HTMLElement && child.matches(controller.options.itemSelector);
        });
    }
    function getOrder(controller) {
        return getItems(controller).map(function (item) { return item.dataset.sortId || ""; }).filter(Boolean);
    }
    function ensureAnnouncer() {
        if (announcer && announcer.isConnected)
            return announcer;
        announcer = document.createElement("p");
        announcer.className = "sort-announcer";
        announcer.setAttribute("aria-live", "polite");
        document.body.appendChild(announcer);
        return announcer;
    }
    function announce(message) {
        var region = ensureAnnouncer();
        region.textContent = "";
        window.setTimeout(function () { region.textContent = message; }, 0);
    }
    function createHandle(label) {
        var handle = document.createElement("button");
        handle.className = "sort-handle";
        handle.type = "button";
        handle.draggable = false;
        handle.setAttribute("aria-label", label);
        handle.title = label;
        handle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
        return handle;
    }
    function animateReflow(controller, mutate) {
        var items = getItems(controller);
        var positions = new Map();
        items.forEach(function (item) { positions.set(item, item.getBoundingClientRect()); });
        mutate();
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        items.forEach(function (item) {
            var before = positions.get(item);
            var after = item.getBoundingClientRect();
            if (!before)
                return;
            var deltaX = before.left - after.left;
            var deltaY = before.top - after.top;
            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1)
                return;
            item.animate([
                { transform: "translate(" + deltaX + "px, " + deltaY + "px)" },
                { transform: "translate(0, 0)" }
            ], { duration: 190, easing: "cubic-bezier(.22, 1, .36, 1)" });
        });
    }
    function restoreOrder(controller, ids) {
        var byId = new Map();
        getItems(controller).forEach(function (item) {
            if (item.dataset.sortId)
                byId.set(item.dataset.sortId, item);
        });
        ids.forEach(function (id) {
            var item = byId.get(id);
            if (item)
                controller.options.container.appendChild(item);
        });
    }
    function createGhost(item) {
        var bounds = item.getBoundingClientRect();
        var ghost = item.cloneNode(true);
        ghost.classList.remove("sort-placeholder");
        ghost.classList.add("sort-ghost");
        ghost.removeAttribute("data-sort-id");
        ghost.querySelectorAll("[id]").forEach(function (node) { node.removeAttribute("id"); });
        ghost.querySelectorAll("button").forEach(function (button) { button.setAttribute("tabindex", "-1"); });
        ghost.querySelectorAll("audio, canvas, embed, video").forEach(function (media) { media.remove(); });
        ghost.setAttribute("aria-hidden", "true");
        ghost.style.width = bounds.width + "px";
        ghost.style.height = bounds.height + "px";
        document.body.appendChild(ghost);
        return { ghost: ghost, bounds: bounds };
    }
    function activateSession(session) {
        if (session.started)
            return;
        var result = createGhost(session.item);
        session.ghost = result.ghost;
        session.offsetX = session.startX - result.bounds.left;
        session.offsetY = session.startY - result.bounds.top;
        session.started = true;
        session.item.dataset.dropLabel = session.controller.options.getDropLabel();
        session.item.classList.add("sort-placeholder");
        session.controller.options.container.classList.add("is-sorting");
        document.documentElement.classList.add("is-sorting");
    }
    function positionGhost(session, clientX, clientY) {
        if (!session.ghost)
            return;
        var width = session.ghost.offsetWidth;
        var height = session.ghost.offsetHeight;
        var left = Math.max(8, Math.min(window.innerWidth - width - 8, clientX - session.offsetX));
        var top = Math.max(8, Math.min(window.innerHeight - height - 8, clientY - session.offsetY));
        session.ghost.style.left = left + "px";
        session.ghost.style.top = top + "px";
    }
    function columnCount(controller) {
        if (controller.options.axis === "vertical")
            return 1;
        if (controller.options.axis === "horizontal")
            return Math.max(2, getItems(controller).length);
        var template = window.getComputedStyle(controller.options.container).gridTemplateColumns.trim();
        if (!template || template === "none")
            return 1;
        return template.split(/\s+/).length;
    }
    function findTarget(session, clientX, clientY) {
        var controller = session.controller;
        var containerBounds = controller.options.container.getBoundingClientRect();
        var margin = 24;
        if (clientX < containerBounds.left - margin ||
            clientX > containerBounds.right + margin ||
            clientY < containerBounds.top - margin ||
            clientY > containerBounds.bottom + margin) {
            return null;
        }
        var hit = document.elementFromPoint(clientX, clientY);
        var direct = hit && hit.closest(controller.options.itemSelector);
        if (direct && direct.parentElement === controller.options.container) {
            return direct === session.item ? null : direct;
        }
        var nearest = null;
        var nearestDistance = Number.POSITIVE_INFINITY;
        getItems(controller).forEach(function (candidate) {
            if (candidate === session.item)
                return;
            var bounds = candidate.getBoundingClientRect();
            var deltaX = clientX - (bounds.left + bounds.width / 2);
            var deltaY = clientY - (bounds.top + bounds.height / 2);
            var distance = deltaX * deltaX + deltaY * deltaY;
            if (distance < nearestDistance) {
                nearest = candidate;
                nearestDistance = distance;
            }
        });
        return nearest;
    }
    function previewOrder(controller) {
        if (controller.options.onOrderPreview)
            controller.options.onOrderPreview(getOrder(controller));
    }
    function movePlaceholder(session, clientX, clientY) {
        var controller = session.controller;
        var target = findTarget(session, clientX, clientY);
        if (!target)
            return;
        var bounds = target.getBoundingClientRect();
        var after = columnCount(controller) > 1
            ? clientX > bounds.left + bounds.width / 2
            : clientY > bounds.top + bounds.height / 2;
        var reference = after ? target.nextElementSibling : target;
        if (reference === session.item || reference === session.item.nextElementSibling)
            return;
        animateReflow(controller, function () {
            controller.options.container.insertBefore(session.item, reference);
        });
        previewOrder(controller);
        announce(controller.options.getMovedLabel(getItems(controller).indexOf(session.item) + 1));
    }
    function autoScroll(clientY) {
        var edge = Math.min(84, window.innerHeight * .14);
        var distance = 0;
        if (clientY < edge)
            distance = -Math.ceil((edge - clientY) / 5);
        else if (clientY > window.innerHeight - edge)
            distance = Math.ceil((clientY - window.innerHeight + edge) / 5);
        if (distance)
            window.scrollBy(0, Math.max(-18, Math.min(18, distance)));
    }
    function releasePointer(session) {
        try {
            if (session.handle.hasPointerCapture(session.pointerId))
                session.handle.releasePointerCapture(session.pointerId);
        }
        catch (_error) {
            // The browser may have released the pointer already.
        }
    }
    function finishSession(cancelled) {
        var session = activeSession;
        if (!session)
            return;
        activeSession = null;
        releasePointer(session);
        if (!session.started)
            return;
        var controller = session.controller;
        if (cancelled) {
            animateReflow(controller, function () { restoreOrder(controller, session.originalOrder); });
            previewOrder(controller);
        }
        else {
            var ids = getOrder(controller);
            controller.options.onOrderChange(ids);
            previewOrder(controller);
            announce(controller.options.getMovedLabel(ids.indexOf(session.item.dataset.sortId || "") + 1));
        }
        session.item.classList.remove("sort-placeholder");
        delete session.item.dataset.dropLabel;
        controller.options.container.classList.remove("is-sorting");
        document.documentElement.classList.remove("is-sorting");
        if (session.ghost)
            session.ghost.remove();
    }
    function beginSession(event, controller, item, handle) {
        if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0))
            return;
        if (activeSession)
            finishSession(true);
        event.preventDefault();
        event.stopPropagation();
        var bounds = item.getBoundingClientRect();
        activeSession = {
            controller: controller,
            pointerId: event.pointerId,
            item: item,
            handle: handle,
            originalOrder: getOrder(controller),
            startX: event.clientX,
            startY: event.clientY,
            offsetX: event.clientX - bounds.left,
            offsetY: event.clientY - bounds.top,
            started: false,
            ghost: null
        };
        handle.focus({ preventScroll: true });
        try {
            handle.setPointerCapture(event.pointerId);
        }
        catch (_error) {
            // Document-level listeners keep sorting active without pointer capture.
        }
    }
    function pointerMove(event) {
        var session = activeSession;
        if (!session || event.pointerId !== session.pointerId)
            return;
        var distanceX = event.clientX - session.startX;
        var distanceY = event.clientY - session.startY;
        if (!session.started && Math.hypot(distanceX, distanceY) < 5)
            return;
        event.preventDefault();
        activateSession(session);
        positionGhost(session, event.clientX, event.clientY);
        autoScroll(event.clientY);
        movePlaceholder(session, event.clientX, event.clientY);
    }
    function pointerEnd(event) {
        if (!activeSession || event.pointerId !== activeSession.pointerId)
            return;
        if (activeSession.started)
            event.preventDefault();
        finishSession(event.type === "pointercancel");
    }
    function moveWithKeyboard(event, controller, item, handle) {
        var items = getItems(controller);
        var currentIndex = items.indexOf(item);
        var columns = columnCount(controller);
        var offset = 0;
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
        var targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + offset));
        if (targetIndex === currentIndex)
            return;
        event.preventDefault();
        event.stopPropagation();
        var target = items[targetIndex];
        var reference = targetIndex > currentIndex ? target.nextElementSibling : target;
        animateReflow(controller, function () {
            controller.options.container.insertBefore(item, reference);
        });
        var ids = getOrder(controller);
        controller.options.onOrderChange(ids);
        previewOrder(controller);
        announce(controller.options.getMovedLabel(ids.indexOf(item.dataset.sortId || "") + 1));
        handle.focus({ preventScroll: true });
    }
    function bind(options) {
        var existing = controllers.get(options.container);
        if (existing) {
            existing.options = options;
            return;
        }
        var controller = {
            options: options,
            pointerDown: function (event) {
                var target = event.target;
                var handle = target && target.closest(".sort-handle");
                if (!handle || !options.container.contains(handle))
                    return;
                var item = handle.closest(controller.options.itemSelector);
                if (!item || item.parentElement !== controller.options.container)
                    return;
                beginSession(event, controller, item, handle);
            },
            keyDown: function (event) {
                var target = event.target;
                var handle = target && target.closest(".sort-handle");
                if (!handle || !options.container.contains(handle))
                    return;
                var item = handle.closest(controller.options.itemSelector);
                if (!item || item.parentElement !== controller.options.container)
                    return;
                moveWithKeyboard(event, controller, item, handle);
            }
        };
        options.container.classList.add("sortable-container");
        options.container.addEventListener("pointerdown", controller.pointerDown);
        options.container.addEventListener("keydown", controller.keyDown);
        controllers.set(options.container, controller);
    }
    document.addEventListener("pointermove", pointerMove, { passive: false });
    document.addEventListener("pointerup", pointerEnd, { passive: false });
    document.addEventListener("pointercancel", pointerEnd, { passive: false });
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !activeSession)
            return;
        event.preventDefault();
        finishSession(true);
    });
    global.WebToolsSortable = {
        bind: bind,
        createHandle: createHandle
    };
})(window);
