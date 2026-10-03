/* Parts trays: vertical scroll inside a capped height. Seats and hose drag stay. */
(function () {
  var css = [
    "#sandbox-root #sb-items,#sandbox-root #sb-xtra{min-height:0!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior:contain!important}",
    "#sandbox-root .sb-item{touch-action:pan-y!important;flex:0 0 auto!important}",
    "@media (max-width:800px){",
    "#sandbox-root .sb-palette{position:relative!important;transform:none!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;height:auto!important;max-height:min(32dvh,210px)!important;min-height:88px!important;overflow:hidden!important;display:flex!important;flex-direction:column!important}",
    "#sandbox-root #sb-items,#sandbox-root #sb-xtra{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;overflow-x:hidden!important;overflow-y:auto!important;min-height:0!important;max-height:none!important;flex:1 1 0!important;touch-action:pan-y!important}",
    "#sandbox-root .sb-xtra-wrap{display:flex!important;flex-direction:column!important;min-height:0!important;overflow:hidden!important;flex:1 1 0!important}",
    "#sandbox-root .sb-item{width:100%!important;min-width:0!important;max-width:100%!important;flex:0 0 auto!important}",
    "}",
    "#recover-root .rc-bin{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important;min-height:0!important;max-height:min(42dvh,320px)!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior:contain!important}",
    "#recover-root .rc-piece{touch-action:pan-y!important;flex:0 0 auto!important}",
    "@media (max-width:720px){",
    "#recover-root .rc-bin{max-height:min(30dvh,200px)!important;flex-direction:column!important;overflow-x:hidden!important;overflow-y:auto!important}",
    "#recover-root .rc-bin .rc-piece{width:100%!important;flex:0 0 auto!important}",
    "}"
  ].join("");

  function arm() {
    var st = document.getElementById("lg-parts-scroll");
    if (!st) {
      st = document.createElement("style");
      st.id = "lg-parts-scroll";
      (document.head || document.documentElement).appendChild(st);
    }
    st.textContent = css;
    if (st.parentNode && st.parentNode.lastElementChild !== st) st.parentNode.appendChild(st);
  }
  arm();
  setInterval(arm, 400);

  function wrapPiece(el) {
    if (!el) return;
    var orig = el.onpointerdown;
    if (typeof orig !== "function" || orig._lgWrap) return;
    function wrapped(e) {
      if (e.button && e.button !== 0) return;
      var bin = el.closest && el.closest(".rc-bin");
      var x0 = e.clientX;
      var y0 = e.clientY;
      var lastY = y0;
      var mode = "";
      function choose(ev) {
        var dx = ev.clientX - x0;
        var dy = ev.clientY - y0;
        if (Math.hypot(dx, dy) < 10) return "";
        if (bin && Math.abs(dy) >= Math.abs(dx)) return "scroll";
        return "drag";
      }
      function move(ev) {
        if (ev.pointerId !== e.pointerId) return;
        if (!mode) mode = choose(ev);
        if (mode === "scroll" && bin) {
          bin.scrollTop += lastY - ev.clientY;
          lastY = ev.clientY;
          ev.preventDefault();
          ev.stopPropagation();
        } else if (mode === "drag") {
          cleanup();
          orig.call(el, e);
        }
      }
      function up(ev) {
        if (ev.pointerId !== e.pointerId) return;
        cleanup();
        if (mode === "scroll") return;
        if (!mode) {
          orig.call(el, e);
          try { el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: ev.clientX, clientY: ev.clientY, pointerId: ev.pointerId })); } catch (err) {}
        }
      }
      function cleanup() {
        window.removeEventListener("pointermove", move, true);
        window.removeEventListener("pointerup", up, true);
        window.removeEventListener("pointercancel", up, true);
      }
      window.addEventListener("pointermove", move, true);
      window.addEventListener("pointerup", up, true);
      window.addEventListener("pointercancel", up, true);
    }
    wrapped._lgWrap = true;
    el.onpointerdown = wrapped;
  }

  function wrapRoot(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll("[data-piece]").forEach(wrapPiece);
  }

  function hookLab() {
    var lab = window.RecoverLab;
    if (!lab || lab._lgTray || typeof lab.start !== "function") return false;
    lab._lgTray = true;
    var start = lab.start;
    lab.start = function (root, opts) {
      var ret = start.call(this, root, opts);
      wrapRoot(root);
      if (root && window.MutationObserver && !root._lgObs) {
        root._lgObs = new MutationObserver(function () { wrapRoot(root); });
        root._lgObs.observe(root, { childList: true, subtree: true });
      }
      return ret;
    };
    return true;
  }
  if (!hookLab()) {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (hookLab() || tries > 40) clearInterval(timer);
    }, 250);
  }
  setInterval(function () { wrapRoot(document.getElementById("recover-root")); }, 500);
})();
