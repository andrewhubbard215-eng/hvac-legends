/* Shop cards stay tiles. Guide bar stays one line. Black title screen cannot cover the floor. */
(function () {
  var css = document.createElement("style");
  css.id = "pc-card-fix";
  css.textContent = [
    "#screen-title:not(.active) { display: none !important; height: 0 !important; min-height: 0 !important; overflow: hidden !important; }",
    "#screen-hub.screen.active { display: block !important; position: relative !important; min-height: 100vh; background: #14171a; }",
    "#screen-hub #hub-options.hub-grid, .hub-grid.hub-nav { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; justify-content: start !important; }",
    "#screen-hub #hub-options .mode-card, #screen-hub #hub-options .mode-card-hero { grid-column: auto !important; flex-direction: column !important; max-width: none !important; width: auto !important; min-height: 0 !important; }",
    ".mode-card img, .start-door img { width: 100% !important; height: 96px !important; max-height: 96px !important; object-fit: cover !important; }",
    "#student-dock { position: fixed !important; left: 8px !important; right: 8px !important; bottom: 8px !important; height: auto !important; max-height: 64px !important; overflow: hidden !important; z-index: 40 !important; pointer-events: none !important; display: flex !important; gap: 8px; align-items: center; background: #14110c; border: 1px solid #c9a227; border-radius: 12px; padding: 6px; }",
    "#student-dock[hidden] { display: none !important; }",
    "#student-dock .btn, #student-dock button { pointer-events: auto !important; min-height: 44px; }",
    "#student-dock span { pointer-events: none !important; flex: 1; font-size: 12px; line-height: 1.2; color: #f3e2b0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }",
    "body.student-on { padding-bottom: 76px; }"
  ].join("");
  document.head.appendChild(css);

  function unblock() {
    var hub = document.getElementById("screen-hub");
    var title = document.getElementById("screen-title");
    if (hub && hub.classList.contains("active") && title) {
      title.classList.remove("active");
      title.style.display = "none";
      title.style.height = "0";
    }
    var dock = document.getElementById("student-dock");
    if (dock) {
      dock.style.maxHeight = "64px";
      dock.style.pointerEvents = "none";
      var btns = dock.querySelectorAll("button");
      for (var i = 0; i < btns.length; i++) btns[i].style.pointerEvents = "auto";
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unblock);
  else unblock();
  setInterval(unblock, 700);
})();
