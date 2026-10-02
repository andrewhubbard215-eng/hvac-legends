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
    ];
    const prev = hide.map(function (n) {
      if (!n) return null;
      const pe = n.style.pointerEvents;
      n.style.pointerEvents = "none";
      return { n: n, pe: pe };
    });
    const gPrev = g && g.style.display;
    if (g) g.style.display = "none";
    let node = document.elementFromPoint(x, y);
    if (g) g.style.display = gPrev || "";
    prev.forEach(function (p) {
      if (p) p.n.style.pointerEvents = p.pe;
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

  function bindSource(el, opts) {
    if (!el || !opts || !opts.id) return;
    const dropSel = opts.dropSelector || opts.slotSelector;
    if (!dropSel) return;
    el.style.touchAction = "pan-y";
    el.style.userSelect = "none";
    el.style.webkitUserSelect = "none";
    el.style.webkitUserDrag = "none";
    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.isPrimary === false) return;
      if (!opts.allowButtons && e.target && e.target.closest && e.target.closest("button, input, select, a")) return;
      const pid = e.pointerId;
      const x0 = e.clientX;
      const y0 = e.clientY;
      let dragging = false;
      let lastSlot = null;
      const g = ensureGhost();
      const tray = el.closest && el.closest(".sb-palette, .sb-gauges, .el-layout .sb-palette, .el-meter, .gs-hoses, .el-zoom-spools");
      const scroller = el.closest && el.closest(".sb-items, .sb-palette, .sb-gauges, .el-meter, .el-zoom-spools");
      let lastY = y0;
      try { el.setPointerCapture(pid); } catch (_) {}

      function leftTray(ev) {
        if (!tray) return true;
        const r = tray.getBoundingClientRect();
        return ev.clientX < r.left - 6 || ev.clientX > r.right + 6 || ev.clientY < r.top - 6 || ev.clientY > r.bottom + 6;
      }

      function startDrag(ev) {
        if (dragging) return;
        dragging = true;
        document.body.classList.add("lt-dragging-part");
        el.style.touchAction = "none";
        try { ev.preventDefault(); } catch (_) {}
        g.style.display = "";
        g.className = "lt-drag-ghost on" + (opts.ghostClass ? " " + opts.ghostClass : "");
        g.innerHTML = opts.html || el.innerHTML;
        g.style.left = ev.clientX + "px";
        g.style.top = ev.clientY + "px";
        el.classList.add("dragging");
        try { el.setPointerCapture(pid); } catch (_) {}
        if (typeof opts.onDragStart === "function") opts.onDragStart(opts.id, ev);
      }

      function move(ev) {
        if (ev.pointerId !== pid) return;
        if (!dragging) {
          const dx = ev.clientX - x0;
          const dy = ev.clientY - y0;
          const dist = Math.hypot(dx, dy);
          const sideways = Math.abs(dx) >= 14 && Math.abs(dx) >= Math.abs(dy) * 0.7;
          if (tray && !leftTray(ev) && !sideways && Math.abs(dy) > Math.abs(dx)) {
            if (scroller) scroller.scrollTop += lastY - ev.clientY;
            lastY = ev.clientY;
            return;
          }
          lastY = ev.clientY;
          if (leftTray(ev) || sideways || dist >= 14) startDrag(ev);
          else return;
        }
        try { ev.preventDefault(); } catch (_) {}
        g.style.left = ev.clientX + "px";
        g.style.top = ev.clientY + "px";
        document.querySelectorAll(dropSel).forEach(function (s) {
          s.classList.remove("over");
        });
        const slot = slotNear(ev.clientX, ev.clientY, dropSel, 36);
        lastSlot = slot || lastSlot;
        if (slot) slot.classList.add("over");
        if (typeof opts.onHover === "function") opts.onHover(slot, opts.id, ev);
      }

      function up(ev) {
        if (ev.pointerId !== pid) return;
        window.removeEventListener("pointermove", move, true);
        window.removeEventListener("pointerup", up, true);
        window.removeEventListener("pointercancel", up, true);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        document.body.classList.remove("lt-dragging-part");
        el.style.touchAction = "pan-y";
        try { el.releasePointerCapture(pid); } catch (_) {}
        const slot = dragging
          ? (slotNear(ev.clientX, ev.clientY, dropSel, 36) || lastSlot)
          : null;
        document.querySelectorAll(dropSel).forEach(function (s) {
          s.classList.remove("over");
        });
        el.classList.remove("dragging");
        killGhost();
        if (typeof opts.onHoverEnd === "function") opts.onHoverEnd();
        if (!dragging) return;
        if (slot && typeof opts.onDrop === "function") {
          slot.classList.add("snap");
          setTimeout(function () {
            slot.classList.remove("snap");
          }, 280);
          opts.onDrop(slot.dataset.slot || slot.dataset.lug || slot.dataset.port, opts.id, slot);
        }
      }

      window.addEventListener("pointermove", move, { capture: true, passive: false });
      window.addEventListener("pointerup", up, true);
      window.addEventListener("pointercancel", up, true);
      el.addEventListener("pointermove", move, { passive: false });
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
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
      win.style.position = "fixed";
      win.style.left = x + "px";
      win.style.top = y + "px";
      win.style.right = "auto";
      win.style.bottom = "auto";
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
