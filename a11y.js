/* Phone a11y: type size, drawer labels. Pinch-zoom is on in the viewport. */
(function () {
  "use strict";
  function apply(size) {
    if (size !== "sm" && size !== "lg") size = "md";
    document.documentElement.classList.remove("type-sm", "type-md", "type-lg");
    document.documentElement.classList.add("type-" + size);
    try { localStorage.setItem("lt-type", size); } catch (_) {}
  }
  var start = "md";
  try { start = localStorage.getItem("lt-type") || "md"; } catch (_) {}
  apply(start);
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-type]");
    if (!b) return;
    apply(b.getAttribute("data-type"));
  });
  window.LtA11y = { apply: apply };
})();
