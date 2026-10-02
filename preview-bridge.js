/* Shop cards stay tiles. Parts tray scrolls. Guide bar stays one line. */
(function () {
  var css = document.createElement("style");
  css.id = "pc-card-fix";
  css.textContent = [
    "#screen-title:not(.active) { display: none !important; height: 0 !important; }",
    "#sb-palette, .sb-palette { max-height: 42vh !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; }",
    "#sb-items, .sb-items, #sb-xtra { overflow-y: auto !important; overflow-x: hidden !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-y !important; max-height: 36vh !important; min-height: 120px !important; padding-bottom: 12px !important; }",
    ".sb-rail { overflow-x: auto !important; overflow-y: hidden !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-x !important; max-height: 96px !important; }",
    "#student-dock { position: fixed !important; left: 8px !important; right: 8px !important; bottom: 8px !important; max-height: 56px !important; overflow: hidden !important; z-index: 30 !important; pointer-events: none !important; display: flex !important; gap: 8px; align-items: center; background: #14110c; border: 1px solid #c9a227; border-radius: 12px; padding: 6px; }",
    "#student-dock[hidden] { display: none !important; }",
    "#student-dock button { pointer-events: auto !important; min-height: 44px; }",
    "#student-dock span { pointer-events: none !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f3e2b0; font-size: 12px; }",
    "#screen-sandbox { padding-bottom: 64px !important; }"
  ].join("");
  document.head.appendChild(css);

  function scrollTray() {
    var box = document.getElementById("sb-items") || document.querySelector(".sb-items");
    if (!box) return;
    box.style.overflowY = "auto";
    box.style.webkitOverflowScrolling = "touch";
    box.style.touchAction = "pan-y";
    box.style.maxHeight = "36vh";
  }
  setInterval(scrollTray, 800);
})();
