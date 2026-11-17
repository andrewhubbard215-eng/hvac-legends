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
  let coil = null;

  function freshCoil() {
    const kinds = ["good", "open", "short"];
    coil = { kind: kinds[Math.floor(Math.random() * kinds.length)], ohm: false, fed: false, smoked: false, called: "" };
  }

  function say(msg, ok) {
    const el = root && root.querySelector("#ptool-why");
    if (el) {
      el.textContent = msg;
      el.className = "pt-note" + (ok === true ? " good" : ok === false ? " bad" : "");
    }
    const btn = root && root.querySelector("#ptool-body");
    if (window.PlayFeel && btn && ok != null) window.PlayFeel.pop(btn, ok ? "Coil called" : "Hold on", ok ? "ok" : "bad");
  }

  function coilHtml() {
    if (!coil) freshCoil();
    const read = !coil.ohm
      ? "Leads are off the coil."
      : coil.kind === "open"
        ? "OL"
        : coil.kind === "short"
          ? "0.2 Ω"
          : "16 Ω";
    const pull = !coil.fed
      ? "24 V has not been applied."
      : coil.kind === "good"
        ? "Click. The steel sticks."
        : coil.kind === "short"
          ? "The fuse opened. No pull."
          : "No click. Nothing sticks.";
    return (
      "<h3>Solenoid tester</h3>" +
      '<p class="ptool-st live">24 V coil · liquid line</p>' +
      '<p class="pt-sat">' + read + "</p>" +
      "<p class='pt-note'>" + pull + (coil.smoked ? " The coil smoked on 120 V." : "") + "</p>" +
      '<div class="ptool-tabs">' +
      '<button type="button" class="btn primary" id="sol-ohm">Ohm the coil</button>' +
      '<button type="button" class="btn" id="sol-24">Apply 24 V</button>' +
      '<button type="button" class="btn" id="sol-120">Apply 120 V</button>' +
      "</div>" +
      (coil.ohm
        ? '<div class="ptool-tabs">' +
          '<button type="button" class="btn" data-call="good">Good coil</button>' +
          '<button type="button" class="btn" data-call="open">Open coil</button>' +
          '<button type="button" class="btn" data-call="short">Shorted coil</button>' +
          "</div>"
        : "<p class='pt-note'>Power is off. Ohm the coil before you feed it.</p>") +
      (coil.called ? '<button type="button" class="btn" id="sol-next">Next coil</button>' : "") +
      '<p id="ptool-why" class="pt-note"></p>'
    );
  }

  function bindCoil() {
    const ohm = root.querySelector("#sol-ohm");
    if (ohm) ohm.onclick = function () {
      coil.ohm = true;
      render();
      const line = coil.kind === "open"
        ? "OL. No path through the windings."
        : coil.kind === "short"
          ? "Near zero. That winding is shorted. Do not feed it."
          : "About 16 ohms. The coil has a path. Now see if 24 volts makes it pull.";
      say(line, null);
    };
    const v24 = root.querySelector("#sol-24");
    if (v24) v24.onclick = function () {
      if (!coil.ohm) return say("Ohm it first. You don't feed a coil you haven't read.", false);
      if (coil.kind === "short") return say("Don't. A shorted coil opens the fuse and never clicks.", false);
      coil.fed = true;
      render();
      say(coil.kind === "good" ? "Click. The steel sticks. This coil pulls." : "No click. An open coil will not pull.", null);
    };
    const v120 = root.querySelector("#sol-120");
    if (v120) v120.onclick = function () {
      coil.smoked = true;
      render();
      say("Line voltage on a 24-volt coil. It burns. The tester stays on 24.", false);
    };
    root.querySelectorAll("[data-call]").forEach(function (b) {
      b.onclick = function () {
        const call = b.getAttribute("data-call");
        if (coil.kind === "good" && !coil.fed) return say("You read the ohms. You have not heard it pull.", false);
        if (call !== coil.kind) {
          const why = coil.kind === "open"
            ? "OL is an open coil. A good coil reads a number."
            : coil.kind === "short"
              ? "Near zero is a short. A good coil is not zero."
              : "It read a number and it pulled. That is a good coil.";
          return say(why, false);
        }
        coil.called = call;
        render();
        say(call === "good" ? "Good coil. It read a number and it pulled." : call === "open" ? "Open coil. Replace it. Do not jump the valve." : "Shorted coil. Replace it. Leave the 24 off.", true);
      };
    });
    const next = root.querySelector("#sol-next");
    if (next) next.onclick = function () { freshCoil(); render(); };
  }

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
      '<button type="button" class="btn' + (which === "sol" ? " primary" : "") + '" data-tool="sol">Solenoid tester</button>' +
      "</div>" +
      '<div id="ptool-body">' +
      (which === "sol"
        ? coilHtml()
        : tool
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
        if (which === "sol" && !coil) freshCoil();
        render();
      };
    });
    if (which === "sol") bindCoil();
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    which = "";
    coil = null;
    if (!document.getElementById("ptool-scroll")) {
      const st = document.createElement("style");
      st.id = "ptool-scroll";
      st.textContent = "#screen-phonetools.screen.active{display:block!important;overflow-x:hidden!important;overflow-y:auto!important;height:100%!important;max-height:100dvh!important}#phonetools-root{height:auto!important;overflow:visible!important;flex:none!important;padding-bottom:80px}.pt-note.good{color:#7fd99a}.pt-note.bad{color:#ff8d7a}";
      document.head.appendChild(st);
    }
    render();
    return { stop: function () { root = null; } };
  }

  global.PhoneTools = { start: start };
})(window);
