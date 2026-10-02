/* Grok live-preview handshake — no nested iframe. */
(function () {
  if (typeof window === "undefined" || window.parent === window) return;
  var CHANNEL = "grok-preview-bridge";
  var parentOrigin = null;
  var ancestor =
    typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length
      ? location.ancestorOrigins[0]
      : "";
  var candidates = [document.referrer, ancestor].filter(Boolean);
  for (var i = 0; i < candidates.length; i++) {
    try {
      var c = candidates[i];
      var u = new URL(c.indexOf("://") >= 0 ? c : "https://" + c);
      if (u.protocol === "https:" || u.protocol === "http:") {
        parentOrigin = u.origin;
        break;
      }
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
    post({ type: "routes", paths: ["/", "/allstars/index.html"] });
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
