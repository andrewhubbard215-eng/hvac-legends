/* Shop cards stay tiles. No full-width strips. */
(function () {
  var css = document.createElement("style");
  css.id = "pc-card-fix";
  css.textContent = [
    "#screen-hub #hub-options.hub-grid, .hub-grid.hub-nav {",
    "  grid-template-columns: repeat(auto-fill, minmax(200px, 240px)) !important;",
    "  justify-content: start !important;",
    "}",
    "#screen-hub #hub-options .mode-card, #screen-hub #hub-options .mode-card-hero {",
    "  grid-column: auto !important;",
    "  flex-direction: column !important;",
    "  max-width: 240px !important;",
    "  min-height: 0 !important;",
    "}",
    ".mode-card img, .start-door img, .rr-grid .mode-card img {",
    "  width: 100% !important;",
    "  height: 140px !important;",
    "  max-height: 140px !important;",
    "  object-fit: cover !important;",
    "  object-position: center !important;",
    "}",
    ".floor-start { max-width: 1040px; }",
    ".floor-start-row { grid-template-columns: repeat(4, minmax(160px, 220px)) !important; }",
    ".start-door, .call-door { max-width: 240px !important; }"
  ].join("");
  document.head.appendChild(css);

  function fit() {
    document.querySelectorAll(".mode-card, .start-door").forEach(function (el) {
      el.style.maxWidth = "240px";
      el.style.width = "240px";
      var img = el.querySelector("img");
      if (!img) return;
      img.style.height = "140px";
      img.style.width = "100%";
      img.style.objectFit = "cover";
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fit);
  else fit();
  setTimeout(fit, 400);

  if (typeof window === "undefined" || window.parent === window) return;
  var CHANNEL = "grok-preview-bridge";
  var parentOrigin = null;
  var ancestor = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length ? location.ancestorOrigins[0] : "";
  var candidates = [document.referrer, ancestor].filter(Boolean);
  for (var i = 0; i < candidates.length; i++) {
    try {
      var c = candidates[i];
      var u = new URL(c.indexOf("://") >= 0 ? c : "https://" + c);
      if (u.protocol === "https:" || u.protocol === "http:") { parentOrigin = u.origin; break; }
    } catch (_) {}
  }
  if (!parentOrigin) return;
  function post(extra) {
    var msg = { channel: CHANNEL, version: 1 };
    for (var k in extra) msg[k] = extra[k];
    window.parent.postMessage(msg, parentOrigin);
  }
  function announce() {
    post({ type: "location", path: "/", search: "", hash: "" });
    post({ type: "routes", paths: ["/"] });
    post({ type: "ready" });
  }
  window.addEventListener("message", function (ev) {
    if (ev.source !== window.parent) return;
    if (ev.origin !== parentOrigin) return;
    if (!ev.data || ev.data.channel !== CHANNEL) return;
    if (ev.data.type === "hello") announce();
  });
  announce();
})();
