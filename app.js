/* HVAC Legends — shop navigation */
(function () {
  "use strict";

  var SCREENS = ["shop", "recovery", "lugs"];

  function show(id) {
    SCREENS.forEach(function (name) {
      var el = document.getElementById("screen-" + name);
      if (!el) return;
      var on = name === id;
      el.classList.toggle("active", on);
      if (on) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    });
    if (id === "recovery" && window.LegendsRecovery && typeof window.LegendsRecovery.enter === "function") {
      window.LegendsRecovery.enter();
    }
    try { window.scrollTo(0, 0); } catch (_) {}
  }

  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest && e.target.closest("[data-go]");
    if (!btn) return;
    var go = btn.getAttribute("data-go");
    if (SCREENS.indexOf(go) >= 0) {
      e.preventDefault();
      show(go);
    }
  });

  window.LegendsNav = { show: show };
  show("shop");
})();
