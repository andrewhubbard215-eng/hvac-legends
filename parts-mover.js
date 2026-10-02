(function () {
  function sandboxOn() {
    var s = document.getElementById("screen-sandbox");
    return s && s.classList.contains("active");
  }
  function arm() {
    var box = document.getElementById("parts-real");
    if (!sandboxOn()) {
      if (box) box.style.display = "none";
      return;
    }
    var items = document.querySelectorAll(".sb-item");
    if (!items.length) return;
    if (!box) {
      box = document.createElement("div");
      box.id = "parts-real";
      box.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:200;background:#121820;border-top:1px solid #c9a227;padding:8px;";
      box.innerHTML = "<div style=\"display:flex;gap:8px;margin-bottom:6px\"><button type=\"button\" id=\"parts-left\" style=\"min-height:44px;flex:1\">More left</button><button type=\"button\" id=\"parts-right\" style=\"min-height:44px;flex:1\">More right</button></div><div id=\"parts-row\" style=\"display:flex;gap:8px;overflow-x:scroll;overflow-y:hidden;-webkit-overflow-scrolling:touch;touch-action:pan-x\"></div>";
      document.body.appendChild(box);
      var row = document.getElementById("parts-row");
      document.getElementById("parts-left").onclick = function () { row.scrollLeft -= 180; };
      document.getElementById("parts-right").onclick = function () { row.scrollLeft += 180; };
      items.forEach(function (el) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = (el.textContent || "Part").replace(/\s+/g, " ").trim().slice(0, 28);
        b.style.cssText = "flex:0 0 auto;min-width:120px;min-height:44px;background:#1c2630;color:#f3e2b0;border:1px solid #3d4a58;border-radius:8px;";
        b.onclick = function () { el.click(); };
        row.appendChild(b);
      });
    }
    box.style.display = "block";
  }
  setInterval(arm, 700);
})();
