(function () {
  var css = document.createElement("style");
  css.id = "fit-board";
  css.textContent = [
    ".sb-item, .sb-slot { max-width: 88px !important; min-width: 72px !important; font-size: 11px !important; }",
    ".sb-item img, .sb-slot img { max-height: 48px !important; object-fit: contain !important; }",
    "#student-dock { max-height: 48px !important; width: auto !important; right: auto !important; left: 8px !important; cursor: move; z-index: 40 !important; }",
    "#student-dock .fit-x { pointer-events: auto; min-width: 44px; min-height: 44px; }"
  ].join("");
  document.head.appendChild(css);

  function drag(el) {
    if (!el || el.dataset.fitDrag) return;
    el.dataset.fitDrag = "1";
    var on = false, x = 0, y = 0;
    el.addEventListener("pointerdown", function (e) {
      if (e.target && e.target.tagName === "BUTTON" && e.target.className !== "fit-x") return;
      on = true;
      x = e.clientX - el.offsetLeft;
      y = e.clientY - el.offsetTop;
      el.style.position = "fixed";
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });
    el.addEventListener("pointermove", function (e) {
      if (!on) return;
      el.style.left = (e.clientX - x) + "px";
      el.style.top = (e.clientY - y) + "px";
      el.style.bottom = "auto";
      el.style.right = "auto";
    });
    el.addEventListener("pointerup", function () { on = false; });
  }

  function arm() {
    var dock = document.getElementById("student-dock");
    if (dock && !dock.querySelector(".fit-x")) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fit-x";
      b.textContent = "Move";
      b.onclick = function (e) {
        e.stopPropagation();
        dock.hidden = true;
        dock.style.display = "none";
      };
      dock.appendChild(b);
    }
    drag(dock);
    var gauges = document.querySelectorAll(".gauge-window, #sb-gauges, .sb-question, .q-window");
    for (var i = 0; i < gauges.length; i++) drag(gauges[i]);
  }
  setInterval(arm, 800);
})();
