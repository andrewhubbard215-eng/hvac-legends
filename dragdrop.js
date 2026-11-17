/* Pointer drag-and-drop + HTML5 custom drag images */
(function (global) {
  "use strict";

  let ghost = null;

  function ensureGhost() {
    if (ghost && ghost.isConnected) return ghost;
    ghost = document.createElement("div");
    ghost.className = "lt-drag-ghost";
    ghost.setAttribute("aria-hidden", "true");
    document.body.appendChild(ghost);
    return ghost;
  }

  function killGhost() {
    document.querySelectorAll(".lt-drag-ghost").forEach(function (n) {
      n.className = "lt-drag-ghost";
      n.classList.remove("on");
      n.style.display = "none";
      n.style.left = "-9999px";
      n.style.top = "0px";
      n.innerHTML = "";
    });
    document.querySelectorAll(".dragging").forEach(function (n) {
      n.classList.remove("dragging");
    });
  }

  function makeCustomImage(opts) {
    const node = document.createElement("div");
    node.className = "lt-custom-drag-img";
    node.setAttribute("aria-hidden", "true");
    const html = (opts && opts.html) || "";
    const label = (opts && opts.label) || "";
    node.innerHTML = html + (label ? "<strong>" + label + "</strong>" : "");
    node.style.cssText =
      "position:absolute;left:-9999px;top:0;width:168px;padding:10px;border-radius:14px;" +
      "background:#efe6d6;border:3px solid #CE0034;color:#1a1612;text-align:center;" +
      "font:700 12px/1.2 system-ui,sans-serif;box-shadow:0 16px 36px rgba(0,0,0,.5);z-index:99998;";
    document.body.appendChild(node);
    return node;
  }

  /** HTML5 DnD: custom drag ghost (compressor photo, not the default grey box). */
  function setHtml5Image(e, opts) {
    if (!e || !e.dataTransfer || !e.dataTransfer.setDragImage) return;
    const node = makeCustomImage(opts || {});
    void node.offsetWidth;
    try {
      e.dataTransfer.setDragImage(node, 84, 90);
    } catch (_) {}
    setTimeout(function () {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    }, 0);
  }

  function slotUnder(x, y, selector) {
    const g = ghost;
    const hide = [
      document.querySelector("#sandbox-root .sb-palette"),
      document.querySelector("#sandbox-root .lab-veil"),
      document.getElementById("shop-chat"),
      document.getElementById("drip-ear"),
      document.querySelector(".hub-ai-panel"),
      document.querySelector(".hub-ai-fab"),
      document.getElementById("el-zoom-spools"),
      document.querySelector(".el-guide"),
      document.querySelector(".el-layout .sb-palette"),
      document.querySelector(".el-meter"),
    ];
    document.querySelectorAll(
      "#sandbox-root .sb-palette .sb-item, #sandbox-root .sb-palette .sb-items, #sandbox-root .sb-palette .sb-tabs, #sandbox-root .sb-palette .sb-tray-handle, .el-layout .sb-palette .sb-item, .lab-veil"
    ).forEach(function (n) { hide.push(n); });
    const prev = [];
    const seen = [];
    hide.forEach(function (n) {
      if (!n || seen.indexOf(n) >= 0) return;
      seen.push(n);
      prev.push({
        n: n,
        pe: n.style.getPropertyValue("pointer-events"),
        pri: n.style.getPropertyPriority("pointer-events"),
      });
      n.style.setProperty("pointer-events", "none", "important");
    });
    const gPrev = g && g.style.display;
    if (g) g.style.display = "none";
    let node = document.elementFromPoint(x, y);
    if (g) g.style.display = gPrev || "";
    prev.forEach(function (p) {
      if (p.pe) p.n.style.setProperty("pointer-events", p.pe, p.pri || "");
      else p.n.style.removeProperty("pointer-events");
    });
    while (node) {
      if (node.matches && node.matches(selector)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function slotNear(x, y, selector, pad) {
    const hit = slotUnder(x, y, selector);
    if (hit) return hit;
    pad = pad == null ? 36 : pad;
    let best = null;
    let bestD = Infinity;
    document.querySelectorAll(selector).forEach(function (s) {
      const r = s.getBoundingClientRect();
      if (x < r.left - pad || x > r.right + pad || y < r.top - pad || y > r.bottom + pad) return;
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    });
    return best;
  }

  function rowScroller(node) {
    if (!node) return false;
    const cs = getComputedStyle(node);
    return cs.flexDirection === "row" || cs.flexDirection === "row-reverse";
  }

  const dragSources = new WeakMap();
  let touchWired = false;
  let touchSession = null;

  function sourceEl(node) {
    while (node && node !== document) {
      if (dragSources.has(node)) return node;
      node = node.parentElement || node.parentNode;
    }
    return null;
  }

  function asPointer(e, t) {
    return {
      pointerId: t.identifier,
      clientX: t.clientX,
      clientY: t.clientY,
      pointerType: "touch",
      target: e.target,
      isPrimary: true,
      button: 0,
      preventDefault: function () {
        try { e.preventDefault(); } catch (_) {}
      },
    };
  }

  function touchHit(e) {
    const lists = [e.changedTouches, e.touches];
    for (let n = 0; n < lists.length; n++) {
      const list = lists[n];
      if (!list) continue;
      for (let i = 0; i < list.length; i++) {
        if (!touchSession || list[i].identifier === touchSession.pid) return list[i];
      }
    }
    return null;
  }

  function onTouchStart(e) {
    if (touchSession) return;
    const el = sourceEl(e.target);
    if (!el) return;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const opts = dragSources.get(el);
    if (!opts.allowButtons && e.target && e.target.closest && e.target.closest("button, input, select, a")) return;
    touchSession = beginDrag(el, opts, asPointer(e, t), false);
  }

  function onTouchMove(e) {
    if (!touchSession) return;
    const t = touchHit(e);
    if (!t) return;
    touchSession.move(asPointer(e, t));
  }

  function onTouchEnd(e) {
    if (!touchSession) return;
    const t = touchHit(e);
    if (!t) return;
    touchSession.up(asPointer(e, t));
    touchSession = null;
  }

  function ensureTouchDelegate() {
    if (touchWired) return;
    touchWired = true;
    document.addEventListener("touchstart", onTouchStart, { capture: true, passive: false });
    document.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    document.addEventListener("touchend", onTouchEnd, { capture: true, passive: false });
    document.addEventListener("touchcancel", onTouchEnd, { capture: true, passive: false });
  }

  function beginDrag(el, opts, ev, listen) {
    const dropSel = opts.dropSelector || opts.slotSelector;
    const pid = ev.pointerId;
    const x0 = ev.clientX;
    const y0 = ev.clientY;
    let dragging = false;
    let lastSlot = null;
    const g = ensureGhost();
    const tray = el.closest && el.closest(".sb-palette, .sb-gauges, .el-layout .sb-palette, .el-meter, .gs-hoses, .el-zoom-spools");
    const scroller = el.closest && el.closest(".sb-items, .sb-palette, .sb-gauges, .el-meter, .el-zoom-spools");
    const row = rowScroller(scroller);
    let lastX = x0;
    let lastY = y0;
    let intent = "";
    const samples = [];
    if (scroller && scroller._ltCoast) {
      cancelAnimationFrame(scroller._ltCoast);
      scroller._ltCoast = 0;
    }
    function note(point) {
      samples.push({ x: point.clientX, y: point.clientY, t: Date.now() });
      if (samples.length > 5) samples.shift();
    }
    function coast() {
      if (!scroller || samples.length < 2 || intent !== "scroll") return;
      const a = samples[0];
      const b = samples[samples.length - 1];
      const dt = b.t - a.t;
      if (dt < 16 || dt > 200) return;
      let vel = ((row ? a.x - b.x : a.y - b.y) / dt) * 16;
      if (Math.abs(vel) < 4) return;
      function step() {
        vel *= 0.92;
        if (Math.abs(vel) < 0.5) {
          scroller._ltCoast = 0;
          return;
        }
        if (row) scroller.scrollLeft += vel;
        else scroller.scrollTop += vel;
        scroller._ltCoast = requestAnimationFrame(step);
      }
      scroller._ltCoast = requestAnimationFrame(step);
    }
    function chooseIntent(dx, dy) {
      if (row) return Math.abs(dy) > Math.abs(dx) ? "drag" : "scroll";
      if (dx >= 6 && Math.abs(dy) < Math.abs(dx) * 1.8) return "drag";
      return Math.abs(dx) > Math.abs(dy) ? "drag" : "scroll";
    }
    if (listen) {
      try { el.setPointerCapture(pid); } catch (_) {}
    }

    function leftTray(point) {
      if (!tray) return true;
      const r = tray.getBoundingClientRect();
      if (row) return point.clientY < r.top - 6 || point.clientY > r.bottom + 6;
      return point.clientX < r.left - 6 || point.clientX > r.right + 6;
    }

    function startDrag(point) {
      if (dragging) return;
      dragging = true;
      document.body.classList.add("lt-dragging-part");
      document.querySelectorAll(".sb-palette.drawer-open, .sb-gauges.drawer-open, .el-meter.drawer-open").forEach(function (n) {
        n.classList.remove("drawer-open");
      });
      document.querySelectorAll(".lab-veil.show").forEach(function (n) {
        n.classList.remove("show");
      });
      el.style.touchAction = "none";
      try { point.preventDefault(); } catch (_) {}
      g.style.display = "";
      g.className = "lt-drag-ghost on" + (opts.ghostClass ? " " + opts.ghostClass : "");
      g.innerHTML = opts.html || el.innerHTML;
      g.style.left = point.clientX + "px";
      g.style.top = point.clientY + "px";
      el.classList.add("dragging");
      if (listen) {
        try { el.setPointerCapture(pid); } catch (_) {}
      }
      if (typeof opts.onDragStart === "function") opts.onDragStart(opts.id, point);
    }

    function move(point) {
      if (point.pointerId !== pid) return;
      if (!dragging) {
        const dx = point.clientX - x0;
        const dy = point.clientY - y0;
        const dist = Math.hypot(dx, dy);
        if (!intent) {
          if (leftTray(point) && dist >= 8) intent = "drag";
          else if (dist < 10) return;
          else intent = chooseIntent(dx, dy);
        }
        if (intent === "scroll" && leftTray(point)) intent = "drag";
        if (intent === "scroll") {
          note(point);
          if (scroller) {
            if (row) scroller.scrollLeft += lastX - point.clientX;
            else scroller.scrollTop += lastY - point.clientY;
          }
          lastX = point.clientX;
          lastY = point.clientY;
          return;
        }
        lastX = point.clientX;
        lastY = point.clientY;
        startDrag(point);
      }
      try { point.preventDefault(); } catch (_) {}
      g.style.left = point.clientX + "px";
      g.style.top = point.clientY + "px";
      document.querySelectorAll(dropSel).forEach(function (s) {
        s.classList.remove("over");
      });
      const pad = point.pointerType === "touch" ? 64 : 36;
      const slot = slotNear(point.clientX, point.clientY, dropSel, pad);
      lastSlot = slot || lastSlot;
      if (slot) slot.classList.add("over");
      if (typeof opts.onHover === "function") opts.onHover(slot, opts.id, point);
    }

    function up(point) {
      if (point.pointerId !== pid) return;
      if (listen) {
        window.removeEventListener("pointermove", move, true);
        window.removeEventListener("pointerup", up, true);
        window.removeEventListener("pointercancel", up, true);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        try { el.releasePointerCapture(pid); } catch (_) {}
      }
      const pad = point.pointerType === "touch" ? 64 : 36;
      const slot = dragging
        ? (slotNear(point.clientX, point.clientY, dropSel, pad) || lastSlot)
        : null;
      document.body.classList.remove("lt-dragging-part");
      document.querySelectorAll(dropSel).forEach(function (s) {
        s.classList.remove("over");
      });
      el.classList.remove("dragging");
      killGhost();
      if (typeof opts.onHoverEnd === "function") opts.onHoverEnd();
      if (!dragging) {
        if (!intent) intent = "tap";
        coast();
        return;
      }
      if (slot && typeof opts.onDrop === "function") {
        slot.classList.add("snap");
        setTimeout(function () {
          slot.classList.remove("snap");
        }, 280);
        opts.onDrop(slot.dataset.slot || slot.dataset.lug || slot.dataset.port, opts.id, slot);
      }
    }

    if (listen) {
      window.addEventListener("pointermove", move, { capture: true, passive: false });
      window.addEventListener("pointerup", up, true);
      window.addEventListener("pointercancel", up, true);
      el.addEventListener("pointermove", move, { passive: false });
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    }
    return { pid: pid, move: move, up: up };
  }

  function bindSource(el, opts) {
    if (!el || !opts || !opts.id) return;
    const dropSel = opts.dropSelector || opts.slotSelector;
    if (!dropSel) return;
    dragSources.set(el, opts);
    el.classList.add("lt-drag-src");
    el.style.touchAction = "none";
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.style.webkitUserDrag = "none";
    if (el.dataset.ltDragBound) {
      ensureTouchDelegate();
      return;
    }
    el.dataset.ltDragBound = "1";
    el.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.isPrimary === false) return;
      const live = dragSources.get(el) || opts;
      if (!live.allowButtons && e.target && e.target.closest && e.target.closest("button, input, select, a")) return;
      beginDrag(el, live, e, true);
    });
    ensureTouchDelegate();
  }

  function makeMoveable(handle, win, key) {
    if (!handle || !win) return;
    handle.style.cursor = "grab";
    handle.style.touchAction = "none";
    handle.style.userSelect = "none";
    handle.style.webkitUserSelect = "none";
    let press = false;
    let moved = false;
    let pid = 0;
    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;
    function clamp(x, y) {
      const pad = 8;
      const w = Math.min(win.offsetWidth || 280, window.innerWidth - pad * 2);
      const h = Math.min(win.offsetHeight || 56, window.innerHeight - pad * 2);
      x = Math.max(pad, Math.min(window.innerWidth - w - pad, x));
      y = Math.max(pad, Math.min(window.innerHeight - h - pad, y));
      win.style.setProperty("position", "fixed", "important");
      win.style.setProperty("left", x + "px", "important");
      win.style.setProperty("top", y + "px", "important");
      win.style.setProperty("right", "auto", "important");
      win.style.setProperty("bottom", "auto", "important");
      if (key) {
        try { localStorage.setItem(key, JSON.stringify({ x: x, y: y })); } catch (_) {}
      }
    }
    handle.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.isPrimary === false) return;
      const t = e.target;
      if (handle.tagName !== "BUTTON" && t.closest && t.closest("button, input, a, select, textarea")) return;
      const r = win.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      ox = r.left;
      oy = r.top;
      pid = e.pointerId;
      press = true;
      moved = false;
      handle.style.cursor = "grabbing";
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });
    handle.addEventListener("pointermove", function (e) {
      if (!press || e.pointerId !== pid) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 8) return;
      moved = true;
      win.dataset.dragged = "1";
      try { e.preventDefault(); } catch (_) {}
      clamp(ox + dx, oy + dy);
    }, { passive: false });
    function up(e) {
      if (e.pointerId !== pid && e.type !== "pointercancel") return;
      press = false;
      handle.style.cursor = "grab";
      if (moved) {
        try { e.preventDefault(); e.stopPropagation(); } catch (_) {}
        setTimeout(function () { win.dataset.dragged = ""; }, 50);
      }
    }
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
    handle.addEventListener("click", function (e) {
      if (win.dataset.dragged === "1") {
        e.preventDefault();
        e.stopPropagation();
        win.dataset.dragged = "";
      }
    }, true);
    try {
      const p = JSON.parse(localStorage.getItem(key) || "null");
      if (p && typeof p.x === "number" && typeof p.y === "number") clamp(p.x, p.y);
    } catch (_) {}
  }

  global.LtDrag = { bindSource, slotUnder, slotNear, killGhost, setHtml5Image, makeCustomImage, makeMoveable };
})(window);
