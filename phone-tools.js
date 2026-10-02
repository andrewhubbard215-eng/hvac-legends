/* Field instruments on the phone lab — the tool you tap is the reading you get.
   Psychrometer: wet bulb. Manometer: inches of water column, not psi. Anemometer: CFM. */
(function (global) {
  "use strict";

  const TOOLS = {
    psych: {
      name: "Psychrometer",
      unit: "°F wet bulb",
      reading: "63°F WB",
      detail: "Dry bulb 75°F · wet bulb 63°F WB. The number that matters here is wet bulb, not a pressure.",
    },
    mano: {
      name: "Manometer",
      unit: "in. w.c.",
      reading: "0.52 in. w.c.",
      detail: "Total external static 0.52 inches of water column. A manometer is inches of water, not psi.",
    },
    anem: {
      name: "Anemometer",
      unit: "CFM",
      reading: "860 CFM",
      detail: "Supply airflow 860 cubic feet per minute. That is CFM, not static pressure and not psi.",
    },
  };

  let root = null;
  let hooks = {};
  let which = "";

  function render() {
    if (!root) return;
    const tool = TOOLS[which];
    root.innerHTML =
      '<div class="ptool-shell">' +
      '<header class="ptool-head"><div><p class="eyebrow">Phone tools</p><h2>Field instruments</h2></div>' +
      '<button class="btn" id="ptool-hub" type="button">Shop floor</button></header>' +
      '<p class="ptool-warn">Tap the tool. The reading that shows is that tool, with the unit labeled. A manometer is inches of water, not psi.</p>' +
      '<div class="ptool-tabs">' +
      '<button type="button" class="btn' + (which === "psych" ? " primary" : "") + '" data-tool="psych">Psychrometer</button>' +
      '<button type="button" class="btn' + (which === "mano" ? " primary" : "") + '" data-tool="mano">Manometer</button>' +
      '<button type="button" class="btn' + (which === "anem" ? " primary" : "") + '" data-tool="anem">Anemometer</button>' +
      "</div>" +
      '<div id="ptool-body">' +
      (tool
        ? "<h3>" + tool.name + "</h3>" +
          '<p class="ptool-st live" id="ptool-st">' + tool.unit + "</p>" +
          '<p class="pt-sat" id="ptool-b">' + tool.reading + "</p>" +
          '<p id="ptool-why" class="pt-note">' + tool.detail + "</p>"
        : "<h3>Pick a tool</h3><p class='pt-note'>Nothing on the screen until you tap the tool that takes that reading.</p>") +
      "</div></div>";
    const hub = root.querySelector("#ptool-hub");
    if (hub) hub.onclick = function () { if (hooks.onHub) hooks.onHub(); };
    root.querySelectorAll("[data-tool]").forEach(function (b) {
      b.onclick = function () {
        which = b.getAttribute("data-tool");
        render();
      };
    });
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    which = "";
    render();
    return { stop: function () { root = null; } };
  }

  global.PhoneTools = { start: start };
})(window);
