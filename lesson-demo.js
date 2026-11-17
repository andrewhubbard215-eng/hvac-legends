/* Short animated demo at the top of each lesson. Close it and the lab is yours. */
(function (global) {
  var REELS = {
    hub: { title: "Shop floor", scene: "floor", lines: [
      "Start in the gold bar. Four labs. A new tech can finish them on a phone.",
      "Take the call first. Hear the house, then say the move. The gauges come after.",
      "See inside, then land the lugs. Watch the refrigerant. Drag the wire onto the screw.",
      "Build the system. Recovery, the meter, and the book are the rest of the floor."
    ]},
    recover: { title: "Recovery bench", scene: "recover", lines: [
      "Blue hose on suction. The fat vapor line.",
      "Red hose on liquid. A reach-in has no liquid port, so the red hose stays in the tray.",
      "Yellow hose on the machine inlet. That port is on the machine, not on the condenser.",
      "Cores out. Open the tank vapor valve and the manifold valves.",
      "Recovery on. Both needles fall. The scale climbs. The gas goes into the tank, not the air.",
      "Ice a hot tank on a big system. Stop at 80%. That is a stop, not a goal.",
      "Close the tank. 0 psi is not an empty system. The scale is the proof.",
      "Vacuum pump only after the tank is shut. Under 500, valve it off and watch it hold."
    ]},
    gauges: { title: "Manifold", scene: "hoses", lines: [
      "Blue gauge, blue hose, suction port.",
      "Red gauge, red hose, liquid port.",
      "Yellow is the center hose. Recovery, vacuum, or nitrogen. Not a system port.",
      "Both knobs shut and the gauges still read. Open a knob and that side can move."
    ]},
    boardwalk: { title: "Board walk", scene: "meter", lines: [
      "Black lead on COM. Red lead on VΩ.",
      "Prove the meter on a known live outlet before you trust it.",
      "Open switch, about 120. The door switch held, about 0.",
      "R to C is about 24. W is heat. G is the fan call, not ground."
    ]},
    voltmeter: { title: "Multimeter", scene: "meter", lines: [
      "Black in COM. Red in VΩ. Red in the amp jack cooks the fuse.",
      "Dial on V~ for line voltage. V⎓ will not show 120.",
      "Hot to neutral, about 120. Neutral to ground, about 0.",
      "Lock out before ohms. Live ohms open the fuse."
    ]},
    electrical: { title: "Land the lugs", scene: "meter", lines: [
      "Green lands on the ground lug. G on the stat is the fan, not ground.",
      "Line on top of the disconnect. Load on the bottom.",
      "Follow the 24-volt string in order. A dark box is not the next box.",
      "Meter it, then replace it. Do not jump a safety."
    ]},
    ohms: { title: "Ohm's law", scene: "ohms", lines: [
      "Volts equals amps times ohms.",
      "Same volts, more ohms, fewer amps.",
      "A heat strip is a real load. Use the nameplate, not a guess.",
      "The bay wants the number, then the next call."
    ]},
    cutaway: { title: "See inside", scene: "loop", lines: [
      "Hot vapor leaves the compressor. Red.",
      "The condenser turns it to warm liquid. Orange.",
      "The TXV flashes it. Blue starts at the seat, not in the power head.",
      "The evaporator boils it. Vapor comes home in the suction line."
    ]},
    sandbox: { title: "System sandbox", scene: "loop", lines: [
      "Drop the part on its own pad. The box is the part, not a big empty card.",
      "High side stays red and orange. Low side stays blue.",
      "A fault moves the gauges. Airflow before charge.",
      "Read the needles after the part is in, not before."
    ]},
    flare: { title: "Flaring", scene: "flare", lines: [
      "Flare nut on the tube before the cut.",
      "Square cut. Then deburr the inside.",
      "Clamp it in the block and flare.",
      "12 ft-lb with a backup wrench. Oil on the flare is not a seal."
    ]},
    braze: { title: "Brazing", scene: "braze", lines: [
      "Cores out. Wet rag on the valve body.",
      "Nitrogen through the tube. Not oxygen. Not shop air.",
      "Light the torch only after the nitrogen is flowing.",
      "A joint lit on oxygen still fails if you switch the hose later."
    ]},
    furnace: { title: "Furnace sequence", scene: "furnace", lines: [
      "Call for heat. W comes up.",
      "The inducer runs and proves draft before the igniter.",
      "The hot surface glows, then the gas valve.",
      "No flame signal, the valve shuts. Do not jump the limit."
    ]},
    call: { title: "Take the call", scene: "call", lines: [
      "Hear the house before you touch a gauge.",
      "Say the first move. Airflow before charge.",
      "Then the pressures prove you right or wrong.",
      "Do not add gas to a leak. Do not jump a float."
    ]},
    service: { title: "Service call", scene: "call", lines: [
      "Read both needles and the temperatures.",
      "Low superheat is an overfed coil. Do not add gas.",
      "High head and normal subcool is airflow or a dirty condenser.",
      "Pick the safe next move. A jumper is not a repair."
    ]},
    minisplit: { title: "Mini-split", scene: "flare", lines: [
      "Level the head. The drill does not level it.",
      "Nut on, then cut, then flare the lineset.",
      "Torque the flares. Nitrogen on a tight joint.",
      "Pull below 500 microns and valve the pump off. A rise is a leak or moisture."
    ]},
    compchange: { title: "Compressor change-out", scene: "braze", lines: [
      "Recover into the tank first. The pump does not recover.",
      "Lock out. Meter the compressor before it is brazed in.",
      "Nitrogen on, then braze. New filter-drier.",
      "Weigh the charge. Do not charge until it sweats."
    ]},
    ptchart: { title: "P/T chart", scene: "pt", lines: [
      "Pick the refrigerant. The chart marks that pressure.",
      "Superheat is suction-line temperature minus the dew point.",
      "Subcooling is the bubble point minus the liquid-line temperature.",
      "R-410A glide is about zero. A zeotropic blend is not."
    ]},
    fieldsoft: { title: "Field software", scene: "pt", lines: [
      "The slider is a calculator. The gauges still win.",
      "Low superheat, stem in. Clockwise. A quarter turn, then wait.",
      "Do not add gas to an overfed coil.",
      "A piston has no stem. Charge it by superheat, not subcooling."
    ]},
    epa608: { title: "EPA 608", scene: "loop", lines: [
      "Core first. Venting is not a recovery method.",
      "Type I is a small appliance. Type II is high pressure.",
      "Type III, before November 15, 1993, is 25 inches of mercury.",
      "On or after that date, 25 millimeters of mercury absolute."
    ]},
    iconnect: { title: (window.LtBrand && window.LtBrand.trainer) || "Hubconnect", scene: "meter", lines: [
      "The trainer is the unit. Read the plate before you meter.",
      "TU-522 is the fault board. Find the open part.",
      "The mini-split plate is R-410A. The boiler plate is water.",
      "A pump-down is a closed valve, not a guess."
    ]},
    bible: { title: "HVAC Bible", scene: "loop", lines: [
      "Look the part up before you condemn it.",
      "What it does in the system. How you prove it.",
      "What usually kills it, and what does not.",
      "Then go back to the gauges."
    ]},
    commandments: { title: "Shop rules", scene: "call", lines: [
      "Never vent.",
      "Never jump a safety to finish the call.",
      "Lock out before ohms.",
      "The scale proves the charge. The needle does not."
    ]},
    quiz: { title: "All-star exam", scene: "call", lines: [
      "Read the question like a call.",
      "Pick the safe next move, not the clever one.",
      "A wrong answer shows the right one.",
      "Then the next bay."
    ]},
    phonetools: { title: "Phone testers", scene: "meter", lines: [
      "Pick the tester that matches the job.",
      "The reading has to carry the right unit.",
      "A beep is not a number.",
      "If the tool cannot see it, do not invent it."
    ]},
    factory: { title: "Factory apps", scene: "pt", lines: [
      "The brand app is a helper. Trane, Rheem, LG, the rest.",
      "It does not replace the manifold.",
      "Superheat and subcooling still come from your gauges.",
      "If the app and the needles disagree, believe the needles."
    ]},
    curriculum: { title: "Curriculum", scene: "call", lines: [
      "Each lab is a credit.",
      "Finish the work on the screen. The mark follows the lab.",
      "Skipping a step does not count.",
      "Then the next course."
    ]}
  };

  function svg(scene, step) {
    if (scene === "hoses") return hoses(step);
    if (scene === "recover") return recoverScene(step);
    if (scene === "floor") return floor(step);
    if (scene === "meter") return meter(step);
    if (scene === "ohms") return ohms(step);
    if (scene === "loop") return loop(step);
    if (scene === "flare") return flare(step);
    if (scene === "braze") return braze(step);
    if (scene === "furnace") return furnace(step);
    if (scene === "pt") return pt(step);
    return call(step);
  }

  function recoverScene(step) {
    var blue = step >= 1 ? "#3d8bfd" : "#31404c";
    var red = step >= 2 ? "#e23b4a" : "#31404c";
    var gold = step >= 3 ? "#e8c450" : "#31404c";
    var running = step === 5 || step === 6;
    var closed = step >= 7;
    var vac = step === 8;
    var nLo = running ? -50 : closed ? -72 : 28;
    var nHi = running ? -30 : closed ? -72 : 36;
    var fill = step >= 6 ? 80 : step === 5 ? 46 : 12;
    var machine = vac ? "VACUUM" : "MACHINE";
    var inlet = vac ? "PUMP" : "IN";
    var scale = step === 6 ? "80% STOP" : step === 5 ? "4.2 lb" : closed ? "held" : "0.0 lb";
    var cores = step >= 4 ? "Cores out" : "Cores in";
    var valve = step >= 4 && step < 7 ? "Vapor OPEN" : closed ? "Vapor SHUT" : "Vapor shut";
    return frame(
      '<rect x="8" y="22" width="92" height="72" rx="8" fill="#1a1e23" stroke="#6a5a32"/>' +
      '<text x="16" y="38" fill="#d5dde4" font-size="10">CONDENSER</text>' +
      port(28, 62, "", blue) +
      '<text x="16" y="84" fill="#9ec5ff" font-size="9">SUC</text>' +
      port(72, 62, "", red) +
      '<text x="60" y="84" fill="#f0a8ae" font-size="9">LIQ</text>' +
      (step >= 1 ? '<path d="M28 72 C 36 108, 90 112, 132 78" fill="none" stroke="' + blue + '" stroke-width="4" class="ld-flow"/>' : "") +
      (step >= 2 ? '<path d="M72 72 C 96 100, 120 104, 176 74" fill="none" stroke="' + red + '" stroke-width="4"/>' : "") +
      (step >= 3 ? '<path d="M154 86 C 190 108, 220 96, 248 58" fill="none" stroke="' + gold + '" stroke-width="4" class="ld-flow"/>' : "") +
      dial(148, 62, nLo, "#3d8bfd") +
      dial(196, 62, nHi, "#e23b4a") +
      '<rect x="236" y="18" width="116" height="52" rx="8" fill="#1a1e23" stroke="' + (running || vac ? "#e8c450" : "#3d4a58") + '"/>' +
      '<text x="246" y="36" fill="#f3e2b0" font-size="11">' + machine + "</text>" +
      port(248, 52, "", gold) +
      (vac
        ? '<text x="268" y="56" fill="#9fd" font-size="13">420 µm</text>'
        : '<text x="260" y="56" fill="#f0d878" font-size="9">' + inlet + "</text>") +
      '<rect x="236" y="96" width="116" height="36" rx="8" fill="#12181c" stroke="#3d4a58"/>' +
      '<rect x="244" y="112" width="' + Math.round(fill) + '" height="8" rx="4" fill="' + (step === 6 ? "#e08a2c" : "#3d8bfd") + '"/>' +
      '<text x="244" y="110" fill="#d5dde4" font-size="10">TANK  ' + scale + "</text>" +
      (step === 6 ? '<rect x="188" y="112" width="40" height="22" rx="4" fill="#16324a" stroke="#7eb6ff"/><text x="196" y="126" fill="#9fd" font-size="9">ICE</text>' : "") +
      '<text x="8" y="144" fill="#f3e2b0" font-size="11">' + cores + " · " + valve + "</text>"
    );
  }

  function hoses(step) {
    var blue = step >= 1 ? "#3d8bfd" : "#2a3340";
    var red = step >= 2 ? "#e23b4a" : "#2a3340";
    var gold = step >= 3 ? "#e8c450" : "#2a3340";
    var needle = step >= 4 ? -40 : 20;
    return frame(
      '<rect x="18" y="28" width="150" height="86" rx="8" fill="#1a1e23" stroke="#6a5a32"/>' +
      '<text x="28" y="48" fill="#d5dde4" font-size="11">CONDENSER</text>' +
      port(36, 78, "SUC", blue) + port(92, 78, "LIQ", red) + port(148, 78, "IN", gold) +
      '<path d="M36 92 C 36 120, 70 124, 210 110" fill="none" stroke="' + blue + '" stroke-width="4" class="ld-flow"/>' +
      '<path d="M92 92 C 100 120, 120 128, 210 118" fill="none" stroke="' + red + '" stroke-width="4"/>' +
      '<path d="M148 92 C 170 100, 190 80, 230 70" fill="none" stroke="' + gold + '" stroke-width="4"/>' +
      dial(250, 78, needle, "#3d8bfd") + dial(312, 78, step >= 4 ? -20 : 30, "#e23b4a")
    );
  }

  function floor(step) {
    var names = ["Call", "See inside", "Lugs", "Sandbox"];
    var boxes = "";
    for (var i = 0; i < 4; i++) {
      var on = i === step - 1;
      boxes += '<rect x="' + (18 + i * 86) + '" y="58" width="78" height="52" rx="8" fill="' + (on ? "#2a2418" : "#1a1e23") + '" stroke="' + (on ? "#e8c450" : "#3d4a58") + '" stroke-width="' + (on ? 3 : 1) + '"/>';
      boxes += '<text x="' + (28 + i * 86) + '" y="88" fill="' + (on ? "#f0d878" : "#d5dde4") + '" font-size="11">' + names[i] + "</text>";
    }
    return frame('<text x="18" y="36" fill="#f0d878" font-size="14">Shop floor</text>' + boxes);
  }

  function meter(step) {
    var reading = step < 2 ? "—.—" : step === 2 ? "121.4" : step === 3 ? "0.2" : "26.4";
    var unit = step < 3 ? "V~" : step === 3 ? "V~" : "V";
    return frame(
      '<rect x="24" y="36" width="120" height="78" rx="10" fill="#121418" stroke="#3d4a58"/>' +
      '<text x="36" y="78" fill="#f3e2b0" font-size="22" font-family="ui-monospace,monospace">' + reading + "</text>" +
      '<text x="108" y="78" fill="#9ec5ff" font-size="12">' + unit + "</text>" +
      lead(170, 50, step >= 1 ? 250 : 190, "#111") +
      lead(170, 90, step >= 2 ? 300 : 190, "#e23b4a") +
      '<circle cx="250" cy="50" r="8" fill="#111" stroke="#e8c450"/>' +
      '<text x="262" y="54" fill="#d5dde4" font-size="11">COM</text>' +
      '<circle cx="300" cy="90" r="8" fill="#3a1218" stroke="#e23b4a"/>' +
      '<text x="312" y="94" fill="#d5dde4" font-size="11">VΩ</text>'
    );
  }

  function ohms(step) {
    var v = [24, 24, 48, 48][step - 1] || 24;
    var r = [12, 24, 12, 8][step - 1] || 12;
    var a = (v / r).toFixed(1);
    return frame(
      '<text x="28" y="48" fill="#d5dde4" font-size="16">V = I × R</text>' +
      '<text x="28" y="84" fill="#f3e2b0" font-size="22" font-family="ui-monospace,monospace">' + v + " V  ·  " + r + " Ω  ·  " + a + " A</text>" +
      '<rect x="28" y="100" width="' + (40 + step * 50) + '" height="10" rx="5" fill="#e8c450"/>'
    );
  }

  function loop(step) {
    var colors = ["#e23b4a", "#e08a2c", "#3d8bfd", "#7eb6ff"];
    return frame(
      '<rect x="40" y="40" width="70" height="44" rx="6" fill="#1a1e23" stroke="' + colors[0] + '" stroke-width="' + (step === 1 ? 3 : 1) + '"/>' +
      '<text x="52" y="66" fill="#d5dde4" font-size="10">COMP</text>' +
      '<rect x="150" y="28" width="70" height="44" rx="6" fill="#1a1e23" stroke="' + colors[1] + '" stroke-width="' + (step === 2 ? 3 : 1) + '"/>' +
      '<text x="162" y="54" fill="#d5dde4" font-size="10">COND</text>' +
      '<rect x="230" y="78" width="70" height="44" rx="6" fill="#1a1e23" stroke="' + colors[2] + '" stroke-width="' + (step === 3 ? 3 : 1) + '"/>' +
      '<text x="250" y="104" fill="#d5dde4" font-size="10">TXV</text>' +
      '<rect x="70" y="100" width="70" height="44" rx="6" fill="#1a1e23" stroke="' + colors[3] + '" stroke-width="' + (step === 4 ? 3 : 1) + '"/>' +
      '<text x="86" y="126" fill="#d5dde4" font-size="10">EVAP</text>' +
      '<path d="M110 62 H150 M220 50 H250 M230 100 H140 M110 100 V84" fill="none" stroke="' + colors[step - 1] + '" stroke-width="3" class="ld-flow"/>'
    );
  }

  function flare(step) {
    return frame(
      '<rect x="40" y="70" width="240" height="14" rx="4" fill="#c47a3a"/>' +
      (step >= 1 ? '<polygon points="70,64 86,64 82,84 74,84" fill="#e8c450"/>' : "") +
      (step >= 2 ? '<path d="M150 60 V96" stroke="#d5dde4" stroke-width="2"/>' : "") +
      (step >= 3 ? '<circle cx="200" cy="77" r="8" fill="none" stroke="#9fd" stroke-width="2"/>' : "") +
      (step >= 4 ? '<text x="230" y="82" fill="#f3e2b0" font-size="14">12 ft-lb</text>' : "") +
      '<text x="40" y="48" fill="#d5dde4" font-size="13">' + ["Nut on first", "Square cut", "Deburr the ID", "Torque it"][step - 1] + "</text>"
    );
  }

  function braze(step) {
    var gas = step >= 2 ? "#7fd99a" : "#5a4038";
    return frame(
      '<rect x="30" y="80" width="200" height="16" rx="6" fill="#b87333"/>' +
      '<rect x="120" y="68" width="28" height="40" rx="4" fill="#8a5a32"/>' +
      '<text x="30" y="48" fill="' + gas + '" font-size="14">' + (step < 2 ? "Oxygen stays a fail" : "Nitrogen flowing") + "</text>" +
      (step >= 3 ? '<path d="M134 68 C 140 40, 150 36, 146 20" fill="none" stroke="#7fd99a" stroke-width="3" class="ld-flow"/>' : "") +
      (step >= 4 ? '<circle cx="250" cy="86" r="16" fill="none" stroke="#e8c450" stroke-width="3"/>' : "")
    );
  }

  function furnace(step) {
    var labels = ["W call", "Inducer", "Igniter", "Gas valve"];
    var on = step;
    var boxes = "";
    for (var i = 0; i < 4; i++) {
      boxes += '<rect x="' + (24 + i * 80) + '" y="60" width="68" height="36" rx="8" fill="' + (i < on ? "#143024" : "#1a1e23") + '" stroke="' + (i < on ? "#7fd99a" : "#3d4a58") + '"/>';
      boxes += '<text x="' + (32 + i * 80) + '" y="82" fill="#d5dde4" font-size="10">' + labels[i] + "</text>";
    }
    return frame('<text x="24" y="40" fill="#f3e2b0" font-size="14">Call for heat</text>' + boxes);
  }

  function pt(step) {
    var psi = [118, 118, 318, 118][step - 1];
    var tag = ["R-410A", "Superheat", "Subcooling", "Glide ~ 0"][step - 1];
    return frame(
      '<text x="28" y="48" fill="#d5dde4" font-size="14">' + tag + "</text>" +
      '<text x="28" y="88" fill="#f3e2b0" font-size="28" font-family="ui-monospace,monospace">' + psi + " psig</text>" +
      '<path d="M28 110 H 300" stroke="#3d4a58" stroke-width="2"/>' +
      '<circle cx="' + (40 + step * 50) + '" cy="110" r="6" fill="#e8c450"/>'
    );
  }

  function call(step) {
    var lines = ["Hear it", "First move", "Gauges", "Prove it"];
    return frame(
      '<rect x="24" y="28" width="120" height="96" rx="10" fill="#1c140c" stroke="#6a5a32"/>' +
      '<text x="36" y="58" fill="#f3e2b0" font-size="13">' + lines[step - 1] + "</text>" +
      '<text x="160" y="70" fill="#9fd" font-size="18" font-family="ui-monospace,monospace">' + (step >= 3 ? "118 / 320" : "— / —") + "</text>" +
      '<text x="160" y="96" fill="#d5dde4" font-size="12">' + (step >= 4 ? "Airflow first" : "Do not add gas yet") + "</text>"
    );
  }

  function frame(inner) {
    return '<svg viewBox="0 0 360 150" width="100%" height="140" role="img">' + inner + "</svg>";
  }

  function port(x, y, name, color) {
    return '<circle cx="' + x + '" cy="' + y + '" r="10" fill="' + color + '"/><text x="' + (x - 10) + '" y="' + (y + 22) + '" fill="#d5dde4" font-size="9">' + name + "</text>";
  }

  function dial(x, y, angle, color) {
    return '<circle cx="' + x + '" cy="' + y + '" r="28" fill="#121418" stroke="' + color + '"/>' +
      '<line x1="' + x + '" y1="' + y + '" x2="' + (x + Math.sin(angle * Math.PI / 180) * 18) + '" y2="' + (y - Math.cos(angle * Math.PI / 180) * 18) + '" stroke="' + color + '" stroke-width="2"/>';
  }

  function lead(x1, y1, x2, color) {
    return '<path d="M' + x1 + " " + y1 + " H " + x2 + '" fill="none" stroke="' + color + '" stroke-width="3"/>';
  }

  function ensureStyle() {
    if (document.getElementById("ld-style")) return;
    var st = document.createElement("style");
    st.id = "ld-style";
    st.textContent = [
      ".ld-player{position:fixed;z-index:40;left:auto;right:12px;top:72px;width:min(420px,calc(100% - 24px));max-width:420px;margin:0;border:1px solid rgba(232,196,80,.55);border-radius:14px;background:#0e1216;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.45)}",
      ".ld-top{display:flex;align-items:center;gap:8px;padding:6px 8px;background:#16130f;cursor:grab;touch-action:none}",
      ".ld-top b{color:#f0d878;font-size:13px;flex:1}",
      ".ld-top button,.ld-replay{min-height:44px;border-radius:8px;border:1px solid #6a5a32;background:#1c1814;color:#f3e2b0;font-weight:700;padding:0 12px}",
      "#ld-close{background:#e8c450;color:#1a1408;border-color:transparent}",
      ".ld-stage{background:#0b0e12;min-height:140px}",
      ".ld-stage text{font-family:inherit}",
      ".ld-flow{stroke-dasharray:6 4;animation:ld-flow .6s linear infinite}",
      "@keyframes ld-flow{to{stroke-dashoffset:-20}}",
      ".ld-cap{margin:0;padding:6px 10px 8px;color:#f3e2b0;font-size:14px;line-height:1.35}",
      ".ld-bar{height:4px;background:#2a2418}",
      ".ld-bar i{display:block;height:100%;width:0;background:#e8c450}",
      ".ld-replay{position:fixed;z-index:78;top:auto;bottom:8px;right:8px;left:auto;margin:0}",
      ".ld-picks{display:flex;gap:6px;overflow-x:auto;padding:8px;background:#12100e;-webkit-overflow-scrolling:touch}",
      ".ld-picks button{flex:0 0 auto;min-height:36px;border-radius:999px;border:1px solid #3d4a58;background:#1a1e23;color:#d5dde4;font-weight:700;padding:0 12px}",
      ".ld-picks button.on{border-color:#e8c450;color:#f0d878;background:#2a2418}",
      "@media (prefers-reduced-motion:reduce){.ld-flow{animation:none}}"
    ].join("");
    document.head.appendChild(st);
  }

  var timer = 0;

  function stop() {
    if (timer) clearInterval(timer);
    timer = 0;
  }

  function mount(screen, id) {
    ensureStyle();
    stop();
    var old = document.querySelector(".ld-player");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var replay = document.querySelector(".ld-replay");
    if (replay && replay.parentNode) replay.parentNode.removeChild(replay);
    if (!screen || !REELS[id] || id === "hub") return;
    var again = document.createElement("button");
    again.type = "button";
    again.className = "ld-replay";
    again.textContent = "Watch the demo";
    again.title = "Drag to move";
    again.onclick = function () { openPlayer(screen, id); };
    screen.appendChild(again);
    if (global.LtDrag && global.LtDrag.makeMoveable) {
      global.LtDrag.makeMoveable(again, again, "lt-ld-replay-pos");
    }
  }

  function openPlayer(screen, id) {
    ensureStyle();
    stop();
    var old = document.querySelector(".ld-player");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var replay = document.querySelector(".ld-replay");
    if (replay && replay.parentNode) replay.parentNode.removeChild(replay);
    if (!screen || !REELS[id]) return;
    var reel = REELS[id];
    var pickId = id;
    var step = 1;
    var playing = true;
    var picks = id === "hub"
      ? [["hub", "The floor"], ["call", "Take the call"], ["cutaway", "See inside"], ["electrical", "Lugs"], ["sandbox", "Build it"], ["recover", "Recovery"], ["gauges", "Manifold"], ["boardwalk", "Board"], ["flare", "Flare"], ["furnace", "Furnace"]]
      : [];
    var box = document.createElement("div");
    box.className = "ld-player";
    box.innerHTML =
      '<div class="ld-top"><b id="ld-title">' + reel.title + " · demo</b>" +
      '<button type="button" id="ld-play">Pause</button>' +
      '<button type="button" id="ld-close">Start the lab</button></div>' +
      (picks.length ? '<div class="ld-picks">' + picks.map(function (p) {
        return '<button type="button" data-pick="' + p[0] + '">' + p[1] + "</button>";
      }).join("") + "</div>" : "") +
      '<div class="ld-bar"><i id="ld-fill"></i></div>' +
      '<div class="ld-stage" id="ld-stage"></div>' +
      '<p class="ld-cap" id="ld-cap"></p>';
    screen.insertBefore(box, screen.firstChild);
    if (global.LtDrag && global.LtDrag.makeMoveable) {
      global.LtDrag.makeMoveable(box.querySelector(".ld-top"), box, "lt-ld-pos");
    }
    function paint() {
      var stage = box.querySelector("#ld-stage");
      var cap = box.querySelector("#ld-cap");
      var fill = box.querySelector("#ld-fill");
      var title = box.querySelector("#ld-title");
      if (!stage) return;
      stage.innerHTML = svg(reel.scene, step);
      cap.textContent = reel.lines[step - 1];
      fill.style.width = (step / reel.lines.length * 100) + "%";
      if (title) title.textContent = reel.title + " · demo";
      box.querySelectorAll("[data-pick]").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-pick") === pickId);
      });
    }
    function tick() {
      step = step % reel.lines.length + 1;
      paint();
    }
    paint();
    if (!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      timer = setInterval(tick, 2200);
    }
    box.querySelector("#ld-play").onclick = function () {
      playing = !playing;
      this.textContent = playing ? "Pause" : "Play";
      stop();
      if (playing) timer = setInterval(tick, 2200);
    };
    box.querySelectorAll("[data-pick]").forEach(function (b) {
      b.onclick = function () {
        var next = REELS[b.getAttribute("data-pick")];
        if (!next) return;
        pickId = b.getAttribute("data-pick");
        reel = next;
        step = 1;
        paint();
      };
    });
    box.querySelector("#ld-close").onclick = function () {
      stop();
      if (box.parentNode) box.parentNode.removeChild(box);
      mount(screen, id);
    };
  }

  global.LessonDemo = {
    mount: mount,
    stop: stop,
    frameOf: function (id, step) {
      var reel = REELS[id];
      if (!reel) return null;
      return { title: reel.title, line: reel.lines[step - 1], svg: svg(reel.scene, step) };
    }
  };
})(window);
