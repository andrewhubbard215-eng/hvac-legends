/* Hubbard's Electrical Reference Guide. Original shop card.
   The twelve power formulas are standard circuit math, not a pocket-book copy. */
(function (global) {
  "use strict";

  var BENDS = {
    "10": { mult: 6, shrink: 1 / 16 },
    "22.5": { mult: 2.6, shrink: 3 / 16 },
    "30": { mult: 2, shrink: 1 / 4 },
    "45": { mult: 1.4, shrink: 3 / 8 },
    "60": { mult: 1.2, shrink: 1 / 2 },
  };
  var CMIL = { "14": 4110, "12": 6530, "10": 10380, "8": 16510, "6": 26240, "4": 41740, "2": 66360, "1/0": 105600, "2/0": 133100 };
  var CHAPTERS = [
    { page: "wheel", title: "Power wheel", keys: "calculator watts volts amps ohms power formula" },
    { page: "xfmr", title: "Transformer VA", keys: "calculator transformer va 24 volt coil" },
    { page: "heat", title: "Heat strip and motor amps", keys: "calculator heat strip motor three phase watts" },
    { page: "loop", title: "Series and parallel", keys: "calculator series parallel ohms coil" },
    { page: "drop", title: "Voltage drop", keys: "calculator voltage drop wire copper feet" },
    { page: "bend", title: "Conduit bend", keys: "conduit bending offset multiplier emt tutorial" },
    { page: "nema", title: "NEMA configurations", keys: "nema wiring plug receptacle 5-15 5-20 6-15 6-20 6-30 6-50 14-30 14-50 l14-30 dryer window air" },
  ];
  var NEMAS = [
    { id: "5-15", v: "125 V", a: "15 A", wires: "Hot, neutral, ground", use: "The wall outlet. Furnace controls, a condensate pump, a shop charger." },
    { id: "5-20", v: "125 V", a: "20 A", wires: "Hot, neutral, ground", use: "Same idea, 20 A. One blade is turned so a 15 A plug still fits and a 20 A plug does not fit a 5-15." },
    { id: "6-15", v: "250 V", a: "15 A", wires: "Two hots and a ground. No neutral.", use: "Small cord-connected air conditioners. Both blades are flat and parallel." },
    { id: "6-20", v: "250 V", a: "20 A", wires: "Two hots and a ground. No neutral.", use: "Window units and small packaged units on a cord. One blade is turned. Do not land a white as a neutral." },
    { id: "6-30", v: "250 V", a: "30 A", wires: "Two hots and a ground. No neutral.", use: "Larger cord-and-plug equipment. Still no neutral." },
    { id: "6-50", v: "250 V", a: "50 A", wires: "Two hots and a ground. No neutral.", use: "Shop equipment. This is not a dryer outlet." },
    { id: "14-30", v: "125/250 V", a: "30 A", wires: "Two hots, neutral, ground", use: "Electric dryer. The neutral is the L-shaped blade. The 120 V controls need it." },
    { id: "14-50", v: "125/250 V", a: "50 A", wires: "Two hots, neutral, ground", use: "Range. Some RV pedestals. Neutral is straight, not the old 10-50 with no ground." },
    { id: "10-30", v: "125/250 V", a: "30 A", wires: "Two hots and a neutral. No equipment ground.", use: "Old dryer. Do not reuse it for new equipment. The frame was bonded to the neutral." },
    { id: "L14-30", v: "125/250 V", a: "30 A", wires: "Two hots, neutral, ground. Locking.", use: "Generator inlet. Twist it. A straight 14-30 will not seat." },
    { id: "L6-30", v: "250 V", a: "30 A", wires: "Two hots and a ground. Locking. No neutral.", use: "Gear that must not fall out of the receptacle. Rooftop and equipment rooms." },
  ];
  var NAME = { P: "Watts", E: "Volts", I: "Amps", R: "Ohms" };
  var UNIT = { P: "W", E: "V", I: "A", R: "Ω" };
  var SLICES = [
    { q: "P", text: "E × I", keys: ["E", "I"], run: function (v) { return v.E * v.I; } },
    { q: "P", text: "E² ÷ R", keys: ["E", "R"], run: function (v) { return (v.E * v.E) / v.R; } },
    { q: "P", text: "I² × R", keys: ["I", "R"], run: function (v) { return v.I * v.I * v.R; } },
    { q: "E", text: "I × R", keys: ["I", "R"], run: function (v) { return v.I * v.R; } },
    { q: "E", text: "P ÷ I", keys: ["P", "I"], run: function (v) { return v.P / v.I; } },
    { q: "E", text: "√(P×R)", keys: ["P", "R"], run: function (v) { return Math.sqrt(v.P * v.R); } },
    { q: "I", text: "E ÷ R", keys: ["E", "R"], run: function (v) { return v.E / v.R; } },
    { q: "I", text: "P ÷ E", keys: ["P", "E"], run: function (v) { return v.P / v.E; } },
    { q: "I", text: "√(P÷R)", keys: ["P", "R"], run: function (v) { return Math.sqrt(v.P / v.R); } },
    { q: "R", text: "E ÷ I", keys: ["E", "I"], run: function (v) { return v.E / v.I; } },
    { q: "R", text: "E² ÷ P", keys: ["E", "P"], run: function (v) { return (v.E * v.E) / v.P; } },
    { q: "R", text: "P ÷ I²", keys: ["P", "I"], run: function (v) { return v.P / (v.I * v.I); } },
  ];

  function arc(i, r0, r1) {
    var n = 12;
    var a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    var a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
    function pt(a, r) { return [180 + Math.cos(a) * r, 180 + Math.sin(a) * r]; }
    var p0 = pt(a0, r1), p1 = pt(a1, r1), p2 = pt(a1, r0), p3 = pt(a0, r0);
    return "M " + p0[0].toFixed(1) + " " + p0[1].toFixed(1) +
      " A " + r1 + " " + r1 + " 0 0 1 " + p1[0].toFixed(1) + " " + p1[1].toFixed(1) +
      " L " + p2[0].toFixed(1) + " " + p2[1].toFixed(1) +
      " A " + r0 + " " + r0 + " 0 0 0 " + p3[0].toFixed(1) + " " + p3[1].toFixed(1) + " Z";
  }

  function mid(i, r) {
    var a = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 12;
    return { x: 180 + Math.cos(a) * r, y: 180 + Math.sin(a) * r };
  }

  function fmt(n) {
    if (!isFinite(n)) return "—";
    if (Math.abs(n) >= 100) return n.toFixed(1);
    if (Math.abs(n) >= 10) return n.toFixed(2);
    return n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  }

  function start(host, opts) {
    var onHub = opts && opts.onHub;
    var page = "cover";
    var slice = 0;
    var vals = { E: "240", I: "10", R: "24", P: "2400" };
    var va = "40";
    var vSec = "24";
    var watts = "5000";
    var heatV = "240";
    var phase = "1";
    var pf = "1";
    var r1 = "48";
    var r2 = "48";
    var q = "";
    var rise = "6";
    var ang = "30";
    var step = 0;
    var bendTimer = 0;
    var vdI = "20";
    var vdFt = "80";
    var vdG = "10";
    var vdE = "240";

    function wheelSvg() {
      var rings = SLICES.map(function (s, i) {
        var on = i === slice ? "#e8c450" : (s.q === "P" ? "#3a2e1c" : s.q === "E" ? "#1a2c40" : s.q === "I" ? "#163028" : "#2a1c32");
        var ink = i === slice ? "#1a1408" : "#f4efe6";
        var p = mid(i, 118);
        return '<path data-slice="' + i + '" d="' + arc(i, 62, 168) + '" fill="' + on + '" stroke="#0c1014" stroke-width="2"/>' +
          '<text data-slice="' + i + '" x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" text-anchor="middle" dominant-baseline="middle" fill="' + ink + '" font-size="11" font-weight="700">' + s.text + "</text>";
      }).join("");
      var cores = [
        { q: "P", label: "WATTS", at: 1.5 },
        { q: "E", label: "VOLTS", at: 4.5 },
        { q: "I", label: "AMPS", at: 7.5 },
        { q: "R", label: "OHMS", at: 10.5 },
      ].map(function (c) {
        var p = mid(c.at - 0.5, 36);
        return '<text x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) + '" text-anchor="middle" fill="#e8c450" font-size="9" font-weight="700">' + c.label + "</text>";
      }).join("");
      return '<svg class="hr-wheel" viewBox="0 0 360 360" role="img" aria-label="Power wheel. Twelve formulas.">' +
        rings +
        '<circle cx="180" cy="180" r="60" fill="#10161c" stroke="#e8c450" stroke-width="2"/>' +
        cores +
        "</svg>";
    }

    function solveSlice() {
      var s = SLICES[slice];
      var a = parseFloat(vals[s.keys[0]]);
      var b = parseFloat(vals[s.keys[1]]);
      if (!isFinite(a) || !isFinite(b) || b === 0 && s.text.indexOf("÷") >= 0) return "—";
      var bag = {};
      bag[s.keys[0]] = a;
      bag[s.keys[1]] = b;
      var n = s.run(bag);
      if (!isFinite(n)) return "—";
      return fmt(n) + " " + UNIT[s.q];
    }

    function paint() {
      var s = SLICES[slice];
      var body = "";
      if (page === "cover") {
        body =
          '<figure class="hr-cover"><img src="hub-ref-cover.jpg" alt="Cloth cover of Hubbard\'s Electrical Reference Guide" /></figure>' +
          '<div class="hr-flap"><p class="hr-lead">Field copy. Search the index. The wheel, the transformer, voltage drop, a conduit offset, and the cords you meet on a job. Stays in the pocket once the app is open.</p>' +
          '<button type="button" id="hr-open">Open the guide</button></div>';
      } else if (page === "wheel") {
        body =
          wheelSvg() +
          '<p class="hr-formula">Find ' + NAME[s.q] + " = " + s.text + "</p>" +
          '<div class="hr-ins">' +
          s.keys.map(function (k) {
            return "<label>" + NAME[k] + " (" + UNIT[k] + ')<input inputmode="decimal" data-k="' + k + '" value="' + (vals[k] || "") + '" /></label>';
          }).join("") +
          "</div>" +
          '<p class="hr-face">' + solveSlice() + "</p>" +
          '<p class="hr-note">Same three relationships in every quadrant. E = I × R. P = E × I. R = E ÷ I.</p>';
      } else if (page === "xfmr") {
        var amps = parseFloat(va) / parseFloat(vSec);
        body =
          "<h3>Transformer budget</h3>" +
          "<p>The stamp is VA, not amps. Amps you can pull = VA ÷ secondary volts. Every coil on C has to fit in that budget.</p>" +
          '<div class="hr-ins">' +
          '<label>VA<input inputmode="decimal" id="hr-va" value="' + va + '" /></label>' +
          '<label>Secondary volts<input inputmode="decimal" id="hr-vsec" value="' + vSec + '" /></label>' +
          "</div>" +
          '<p class="hr-face">' + (isFinite(amps) ? fmt(amps) + " A" : "—") + "</p>" +
          '<div class="hr-chips">' +
          '<button type="button" data-va="40" data-v="24">40 VA · 24 V</button>' +
          '<button type="button" data-va="75" data-v="24">75 VA · 24 V</button>' +
          '<button type="button" data-va="100" data-v="24">100 VA · 24 V</button>' +
          "</div>" +
          "<p class=\"hr-note\">40 VA at 24 V is about 1.67 A. A healthy contactor coil is about half an amp. Add a board, a gas valve, and a relay before you blame the transformer.</p>";
      } else if (page === "heat") {
        var p = parseFloat(watts);
        var e = parseFloat(heatV);
        var f = parseFloat(pf);
        var iHeat = phase === "3" ? p / (e * 1.732 * f) : p / e;
        body =
          "<h3>Heat strip and motor amps</h3>" +
          "<p>A strip is a resistor. Amps = watts ÷ volts. A three-phase load uses 1.732 and the power factor. A house condenser is almost always single phase. Don't put 1.732 on it.</p>" +
          '<div class="hr-ins">' +
          '<label>Watts<input inputmode="decimal" id="hr-w" value="' + watts + '" /></label>' +
          '<label>Volts<input inputmode="decimal" id="hr-hv" value="' + heatV + '" /></label>' +
          '<label>Power factor<input inputmode="decimal" id="hr-pf" value="' + pf + '" /></label>' +
          "</div>" +
          '<div class="hr-chips">' +
          '<button type="button" data-phase="1"' + (phase === "1" ? ' class="on"' : "") + ">Single phase</button>" +
          '<button type="button" data-phase="3"' + (phase === "3" ? ' class="on"' : "") + ">Three phase</button>" +
          '<button type="button" data-w="5000" data-hv="240">5 kW · 240 V</button>' +
          '<button type="button" data-w="10000" data-hv="240">10 kW · 240 V</button>' +
          "</div>" +
          '<p class="hr-face">' + (isFinite(iHeat) ? fmt(iHeat) + " A" : "—") + "</p>" +
          "<p class=\"hr-note\">Compressor amps come off the nameplate RLA. Locked rotor is not running amps. A rough field check is 5 to 7 times RLA, then you read the plate.</p>";
      } else if (page === "drop") {
        var cm = CMIL[vdG] || 0;
        var vd = (2 * 12.9 * parseFloat(vdI) * parseFloat(vdFt)) / cm;
        var pct = vd / parseFloat(vdE) * 100;
        body =
          "<h3>Voltage drop</h3>" +
          "<p>Single-phase copper. Drop = 2 × 12.9 × amps × one-way feet ÷ circular mils. Training estimate. Use the wire you actually pulled.</p>" +
          '<div class="hr-ins">' +
          '<label>Amps<input inputmode="decimal" id="hr-vdi" value="' + vdI + '" /></label>' +
          '<label>One-way feet<input inputmode="decimal" id="hr-vdft" value="' + vdFt + '" /></label>' +
          '<label>Volts<input inputmode="decimal" id="hr-vde" value="' + vdE + '" /></label>' +
          '<label>Copper AWG<select id="hr-vdg">' +
          Object.keys(CMIL).map(function (g) {
            return "<option" + (g === vdG ? " selected" : "") + ">" + g + "</option>";
          }).join("") +
          "</select></label></div>" +
          '<p class="hr-face">' + (isFinite(vd) ? fmt(vd) + " V" : "—") + "</p>" +
          '<p class="hr-note">' + (isFinite(pct) ? fmt(pct) + "% of " + vdE + " V. Techs start asking questions around 3% on a branch. A long whip on 14 AWG shows up here before it shows up as a weak compressor." : "Need amps, feet, and a wire size.") + "</p>";
      } else if (page === "bend") {
        var specB = BENDS[ang];
        var spacing = parseFloat(rise) * specB.mult;
        var shrinkIn = parseFloat(rise) * specB.shrink;
        var lines = [
          "Mark the first bend where the pipe has to leave the wall.",
          "Hook the shoe. Bend to the angle. Stop when the pipe hits your mark.",
          "Roll the pipe over. Measure the spacing from the back of that bend.",
          "Second bend, same angle, the other way.",
          "The offset should clear the box. Short spacing makes a short offset. The angle was not the problem.",
        ];
        var paths = [
          "M 16 78 H 250",
          "M 16 78 H 70 L 120 36 H 250",
          "M 16 78 H 70 L 120 36 H 250",
          "M 16 78 H 70 L 118 34 H 168 L 214 78 H 270",
          "M 16 86 H 64 L 112 28 H 176 L 222 86 H 280",
        ];
        body =
          "<h3>Conduit offset</h3>" +
          "<p>Distance between bends = how far the pipe has to move × the multiplier. Shrink is how much the stub gets shorter. Typical hand bender. The arrow on your shoe still wins.</p>" +
          '<div class="hr-ins">' +
          '<label>Offset rise, inches<input inputmode="decimal" id="hr-rise" value="' + rise + '" /></label>' +
          '<label>Angle<select id="hr-ang">' +
          Object.keys(BENDS).map(function (k) {
            return '<option value="' + k + '"' + (k === ang ? " selected" : "") + ">" + k + "°</option>";
          }).join("") +
          "</select></label></div>" +
          '<div class="hr-pair"><div><span>Spacing</span><b>' + (isFinite(spacing) ? fmt(spacing) + " in" : "—") + "</b></div>" +
          '<div><span>Shrink</span><b>' + (isFinite(shrinkIn) ? fmt(shrinkIn) + " in" : "—") + "</b></div></div>" +
          '<svg class="hr-bend" viewBox="0 0 300 120" aria-label="Offset bend step ' + (step + 1) + '">' +
          '<rect x="150" y="70" width="36" height="28" rx="3" fill="#2a2418" stroke="#e8c450"/>' +
          '<path d="' + paths[step] + '" fill="none" stroke="#3a342c" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
          "</svg>" +
          '<p class="hr-formula">Step ' + (step + 1) + " of 5. " + lines[step] + "</p>" +
          '<div class="hr-chips"><button type="button" id="hr-bend-back">Back</button><button type="button" id="hr-bend-next">Next</button><button type="button" id="hr-bend-play">Play the bend</button></div>' +
          '<p class="hr-note">10° uses 6. 22.5° uses 2.6. 30° uses 2. 45° uses 1.4. 60° uses 1.2. Those multipliers are 1 ÷ sin(angle), rounded the way a shoe is marked.</p>';
      } else if (page === "nema") {
        var needle = q.trim().toLowerCase();
        var rows = NEMAS.filter(function (n) {
          if (!needle) return true;
          return (n.id + " " + n.v + " " + n.wires + " " + n.use).toLowerCase().indexOf(needle) >= 0;
        });
        body =
          "<h3>NEMA configurations</h3>" +
          "<p>Match the receptacle in your hand. These cards are the volts, the wires, and where HVAC meets them. Do not land a cord from memory.</p>" +
          '<div class="hr-nema">' +
          (rows.length ? rows.map(function (n) {
            return "<article><b>" + n.id + "</b><span>" + n.v + " · " + n.a + "</span><p>" + n.wires + "</p><p>" + n.use + "</p></article>";
          }).join("") : "<p>No configuration matches that search.</p>") +
          "</div>";
      } else {
        var a = parseFloat(r1);
        var b = parseFloat(r2);
        var series = a + b;
        var parallel = (a * b) / (a + b);
        body =
          "<h3>Series and parallel</h3>" +
          "<p>Series adds. The safeties and the coil are in series on a 24 V string. Parallel splits the current. Two equal coils in parallel draw twice one coil.</p>" +
          '<div class="hr-ins">' +
          '<label>R1 ohms<input inputmode="decimal" id="hr-r1" value="' + r1 + '" /></label>' +
          '<label>R2 ohms<input inputmode="decimal" id="hr-r2" value="' + r2 + '" /></label>' +
          "</div>" +
          '<div class="hr-pair">' +
          "<div><span>Series</span><b>" + (isFinite(series) ? fmt(series) + " Ω" : "—") + "</b></div>" +
          "<div><span>Parallel</span><b>" + (isFinite(parallel) ? fmt(parallel) + " Ω" : "—") + "</b></div>" +
          "</div>" +
          '<div class="hr-chips"><button type="button" data-r="48">Two 48 Ω coils</button><button type="button" data-r="10">Two 10 Ω heaters</button></div>' +
          "<p class=\"hr-note\">A coil that reads about half its stamped ohms is usually shorted turns, not a loose wire. Open is infinite. Short to the case is a ground.</p>";
      }

      host.innerHTML =
        '<div class="hr">' +
        "<style>" +
        "#hubref-root{height:100%;overflow:auto;color:#24180f;background:repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 1px,transparent 1px 9px),repeating-linear-gradient(0deg,rgba(255,255,255,.04) 0 1px,transparent 1px 14px),linear-gradient(165deg,#7a614b,#3c2c20 70%)}" +
        "#hubref-root .hr{min-height:100%;box-sizing:border-box;padding:18px 12px 48px}" +
        "#hubref-root #hr-hub{display:inline-block;margin:0 0 10px 8px;background:#5c3a28;color:#f3e6d0;border:0;border-bottom:2px solid #2a1a12;border-radius:2px;padding:7px 12px;font-family:Georgia,serif;letter-spacing:.08em;text-transform:uppercase;font-size:12px;box-shadow:0 1px 0 rgba(255,255,255,.15) inset}" +
        "#hubref-root .hr-book{position:relative;max-width:740px;margin:8px auto 0;filter:drop-shadow(0 18px 14px rgba(0,0,0,.45))}" +
        "#hubref-root .hr-book.is-cover{max-width:460px}" +
        "#hubref-root .hr-block{position:absolute;top:6px;bottom:4px;right:-11px;width:14px;border-radius:0 3px 3px 0;background:repeating-linear-gradient(#f6efe2 0 1px,#cbbfa6 1px 2px);box-shadow:3px 8px 10px rgba(0,0,0,.28)}" +
        "#hubref-root .hr-sheet{position:relative;overflow:hidden;background:linear-gradient(90deg,rgba(30,18,8,.35),rgba(30,18,8,.05) 18px,transparent 28px),radial-gradient(120% 80% at 80% 0%,rgba(255,255,255,.45),transparent 42%),#f4ead6;color:#24180f;min-height:68vh;padding:18px 62px 28px 28px;border-radius:1px 2px 3px 1px;box-shadow:inset 0 0 40px rgba(90,60,20,.12),-7px 0 0 #4a3828;font-family:Georgia,'Palatino Linotype',Palatino,serif}" +
        "#hubref-root .hr-grain{position:absolute;inset:0;pointer-events:none;opacity:.28;mix-blend-mode:multiply;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E');background-size:160px}" +
        "#hubref-root .hr-book:not(.is-cover) .hr-sheet::after{content:'';position:absolute;right:48px;bottom:0;width:26px;height:26px;background:linear-gradient(135deg,transparent 50%,#e7d7b8 50%);box-shadow:-2px -2px 3px rgba(0,0,0,.12)}" +
        "#hubref-root .hr-run{display:flex;justify-content:space-between;gap:8px;border-bottom:2px solid #9c2b2b;padding-bottom:4px;margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6b5344}" +
        "#hubref-root h2{margin:0;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}" +
        "#hubref-root h3{margin:4px 0 8px;font-size:26px;color:#7d1f1f;font-variant:small-caps;letter-spacing:.03em}" +
        "#hubref-root p{line-height:1.4}" +
        "#hubref-root .hr-tabs{position:absolute;right:0;top:52px;display:flex;flex-direction:column;gap:5px;margin:0;z-index:3}" +
        "#hubref-root .hr-tabs button{writing-mode:vertical-rl;text-orientation:mixed;width:auto;border:0;border-radius:4px 0 0 4px;padding:9px 5px;color:#f6f0e2;font-family:Georgia,serif;font-size:12px;font-weight:700;letter-spacing:.06em;background-image:linear-gradient(90deg,rgba(255,255,255,.28),transparent 40%,rgba(0,0,0,.18));box-shadow:-1px 1px 0 rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.25)}" +
        "#hubref-root .hr-tabs button.on{padding-left:9px;filter:brightness(1.12)}" +
        "#hubref-root .hr-book.is-cover .hr-sheet{background:#16130f;color:#f6f0e2;padding:0;box-shadow:-6px 0 0 #2a2118}" +
        "#hubref-root .hr-book.is-cover .hr-sheet::after{display:none}" +
        "#hubref-root .hr-book.is-cover .hr-run{display:none}" +
        "#hubref-root .hr-cover{margin:0;position:relative}" +
        "#hubref-root .hr-cover img{display:block;width:100%;max-height:min(62vh,640px);object-fit:cover;object-position:center;background:#100e0c}" +
        "#hubref-root .hr-cover::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.16),transparent 26%,transparent 62%,rgba(0,0,0,.28))}" +
        "#hubref-root .hr-flap{position:relative;background:linear-gradient(180deg,#f7f1e4,#eadfc8);color:#24180f;padding:14px 18px 16px;border-top:2px solid #9c2b2b;box-shadow:inset 0 8px 12px rgba(60,40,20,.08)}" +
        "#hubref-root .hr-lead{margin:0 0 8px;font-size:16px}" +
        "#hubref-root #hr-open{background:#7d1f1f;color:#f6f0e2;border:0;padding:8px 14px;font-family:Georgia,serif;letter-spacing:.06em;text-transform:uppercase}" +
        "#hubref-root .hr-wheel{width:min(100%,420px);height:auto;display:block;margin:4px auto;touch-action:manipulation;filter:drop-shadow(0 2px 0 rgba(60,40,20,.25))}" +
        "#hubref-root .hr-wheel path,#hubref-root .hr-wheel text{cursor:pointer}" +
        "#hubref-root .hr-formula{color:#7d1f1f;font-size:18px;text-align:center}" +
        "#hubref-root .hr-ins{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px}" +
        "#hubref-root label{display:flex;flex-direction:column;gap:2px;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#6b5344}" +
        "#hubref-root input,#hubref-root select{font-size:22px;padding:2px 2px 3px;border:0;border-bottom:1px solid rgba(36,24,15,.55);border-radius:0;background:linear-gradient(transparent 70%,rgba(26,39,68,.06));color:#1a2744;font-family:'Segoe Print','Bradley Hand',cursive;box-shadow:0 1px 0 rgba(255,255,255,.4)}" +
        "#hubref-root .hr-search{width:100%;margin:0 0 8px;font-size:18px}" +
        "#hubref-root .hr-face{display:block;width:fit-content;margin:12px auto;padding:0 16px;font-size:40px;line-height:1.2;color:#1a3a6b;border:2px solid rgba(26,58,107,.75);transform:rotate(-1.2deg);font-family:'Segoe Print','Bradley Hand',cursive;background:rgba(255,255,255,.2);box-shadow:1px 1px 0 rgba(26,58,107,.25)}" +
        "#hubref-root .hr-note{color:#6b3a32;font-style:italic}" +
        "#hubref-root .hr-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}" +
        "#hubref-root .hr-chips button,#hubref-root .hr-hits button{border:1px dashed #7d1f1f;background:transparent;color:#7d1f1f;border-radius:2px;padding:6px 8px;font-family:Georgia,serif}" +
        "#hubref-root .hr-chips button.on{background:#7d1f1f;color:#f6f0e2}" +
        "#hubref-root .hr-hits{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}" +
        "#hubref-root .hr-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
        "#hubref-root .hr-pair div{background:transparent;border-top:1px solid #c4b49a;border-radius:0;padding:8px 0}" +
        "#hubref-root .hr-pair span{display:block;color:#6b5344;font-size:11px;letter-spacing:.08em;text-transform:uppercase}" +
        "#hubref-root .hr-pair b{font-size:26px;font-family:'Segoe Print','Bradley Hand',cursive;font-weight:400}" +
        "#hubref-root .hr-nema{display:block}" +
        "#hubref-root .hr-nema article{background:transparent;border:0;border-bottom:1px solid #c4b49a;border-radius:0;padding:8px 0}" +
        "#hubref-root .hr-nema b{color:#7d1f1f;font-size:18px}" +
        "#hubref-root .hr-nema span{color:#6b5344;font-size:12px;letter-spacing:.04em}" +
        "#hubref-root .hr-nema p{margin:2px 0 0}" +
        "#hubref-root .hr-bend{width:100%;height:auto;background:transparent;margin:8px 0}" +
        "#hubref-root .hr-folio{margin-top:16px;border-top:1px solid #c4b49a;padding-top:6px;text-align:center;font-size:12px;letter-spacing:.14em;color:#6b5344}" +
        "#hubref-root .hr-book.is-cover .hr-folio{display:none}" +
        "@media (max-width:640px){#hubref-root .hr-ins,#hubref-root .hr-pair{grid-template-columns:1fr}#hubref-root .hr-sheet{padding-right:46px}#hubref-root .hr-tabs button{font-size:10px;padding:6px 2px}}" +
        "</style>" +
        '<button type="button" id="hr-hub">Shop floor</button>' +
        '<div class="hr-book' + (page === "cover" ? " is-cover" : "") + '">' +
        '<div class="hr-block" aria-hidden="true"></div>' +
        '<article class="hr-sheet"><div class="hr-grain" aria-hidden="true"></div>' +
        '<header class="hr-run"><h2>Hubbard\'s Electrical Reference Guide</h2><b>' + folio(page) + "</b></header>" +
        (page === "cover" ? "" : '<input class="hr-search" id="hr-q" type="search" placeholder="Index" value="' + q.replace(/"/g, "&" + "quot;") + '" />') +
        (page === "cover" ? "" : hitsHtml()) +
        '<nav class="hr-tabs">' +
        tab("cover", "Cover", "#2a241c") + tab("wheel", "Wheel", "#8a6a22") + tab("xfmr", "Xfmr", "#1e4d73") + tab("heat", "Heat", "#8d2a22") + tab("drop", "Drop", "#2d6a45") + tab("bend", "Bend", "#a85a12") + tab("nema", "NEMA", "#3d3a78") + tab("loop", "Ohms", "#5c4636") +
        "</nav>" + body +
        '<p class="hr-folio">' + folio(page) + "</p>" +
        "</article></div></div>";

      host.querySelector("#hr-hub").onclick = function () { if (onHub) onHub(); };
      host.querySelectorAll("[data-page]").forEach(function (b) {
        b.onclick = function () { page = b.getAttribute("data-page"); paint(); };
      });
      var open = host.querySelector("#hr-open");
      if (open) open.onclick = function () { page = "wheel"; paint(); };
      host.querySelectorAll("[data-slice]").forEach(function (el) {
        el.onclick = function () { slice = +el.getAttribute("data-slice"); paint(); };
      });
      host.querySelectorAll("[data-k]").forEach(function (input) {
        input.oninput = function () { vals[input.getAttribute("data-k")] = input.value; paintFace(); };
      });
      var vaEl = host.querySelector("#hr-va");
      var vsEl = host.querySelector("#hr-vsec");
      if (vaEl) vaEl.oninput = function () { va = vaEl.value; paintFace(); };
      if (vsEl) vsEl.oninput = function () { vSec = vsEl.value; paintFace(); };
      host.querySelectorAll("[data-va]").forEach(function (b) {
        b.onclick = function () { va = b.getAttribute("data-va"); vSec = b.getAttribute("data-v"); paint(); };
      });
      var wEl = host.querySelector("#hr-w");
      var hvEl = host.querySelector("#hr-hv");
      var pfEl = host.querySelector("#hr-pf");
      if (wEl) wEl.oninput = function () { watts = wEl.value; paintFace(); };
      if (hvEl) hvEl.oninput = function () { heatV = hvEl.value; paintFace(); };
      if (pfEl) pfEl.oninput = function () { pf = pfEl.value; paintFace(); };
      host.querySelectorAll("[data-phase]").forEach(function (b) {
        b.onclick = function () { phase = b.getAttribute("data-phase"); paint(); };
      });
      host.querySelectorAll("[data-w]").forEach(function (b) {
        b.onclick = function () { watts = b.getAttribute("data-w"); heatV = b.getAttribute("data-hv"); phase = "1"; pf = "1"; paint(); };
      });
      var aEl = host.querySelector("#hr-r1");
      var bEl = host.querySelector("#hr-r2");
      if (aEl) aEl.oninput = function () { r1 = aEl.value; paintFace(); };
      if (bEl) bEl.oninput = function () { r2 = bEl.value; paintFace(); };
      host.querySelectorAll("[data-r]").forEach(function (b) {
        b.onclick = function () { r1 = b.getAttribute("data-r"); r2 = b.getAttribute("data-r"); paint(); };
      });
      var qEl = host.querySelector("#hr-q");
      if (qEl) qEl.oninput = function () {
        q = qEl.value;
        var pos = qEl.selectionStart;
        paint();
        var again = host.querySelector("#hr-q");
        if (again) { again.focus(); try { again.setSelectionRange(pos, pos); } catch (e) {} }
      };
      var vdi = host.querySelector("#hr-vdi");
      var vdft = host.querySelector("#hr-vdft");
      var vde = host.querySelector("#hr-vde");
      var vdg = host.querySelector("#hr-vdg");
      if (vdi) vdi.oninput = function () { vdI = vdi.value; paintFace(); };
      if (vdft) vdft.oninput = function () { vdFt = vdft.value; paintFace(); };
      if (vde) vde.oninput = function () { vdE = vde.value; paintFace(); };
      if (vdg) vdg.onchange = function () { vdG = vdg.value; paint(); };
      var riseEl = host.querySelector("#hr-rise");
      var angEl = host.querySelector("#hr-ang");
      if (riseEl) riseEl.oninput = function () { rise = riseEl.value; paintFace(); };
      if (angEl) angEl.onchange = function () { ang = angEl.value; paint(); };
      var back = host.querySelector("#hr-bend-back");
      var next = host.querySelector("#hr-bend-next");
      var play = host.querySelector("#hr-bend-play");
      if (back) back.onclick = function () { step = (step + 4) % 5; paint(); };
      if (next) next.onclick = function () { step = (step + 1) % 5; paint(); };
      if (play) play.onclick = function () {
        if (bendTimer) { clearInterval(bendTimer); bendTimer = 0; paint(); return; }
        bendTimer = setInterval(function () { step = (step + 1) % 5; paint(); }, 1400);
      };
    }

    function hitsHtml() {
      var s = q.trim().toLowerCase();
      if (!s) return "";
      var list = CHAPTERS.filter(function (c) {
        return (c.title + " " + c.keys).toLowerCase().indexOf(s) >= 0;
      });
      if (!list.length) return '<p class="hr-note">Nothing in the book matches that.</p>';
      return '<div class="hr-hits">' + list.map(function (c) {
        return '<button type="button" data-page="' + c.page + '">' + c.title + "</button>";
      }).join("") + "</div>";
    }

    function folio(id) {
      return { cover: "Cover", wheel: "12", xfmr: "18", heat: "24", drop: "28", bend: "34", nema: "41", loop: "48" }[id] || "";
    }

    function tab(id, label, ink) {
      return '<button type="button" data-page="' + id + '" style="background:' + ink + '"' + (page === id ? ' class="on"' : "") + ">" + label + "</button>";
    }

    function paintFace() {
      if (page === "wheel") {
        var face = host.querySelector(".hr-face");
        if (face) face.textContent = solveSlice();
        return;
      }
      if (page === "xfmr") {
        var faceX = host.querySelector(".hr-face");
        var amps = parseFloat(va) / parseFloat(vSec);
        if (faceX) faceX.textContent = isFinite(amps) ? fmt(amps) + " A" : "—";
        return;
      }
      if (page === "heat") {
        var faceH = host.querySelector(".hr-face");
        var p = parseFloat(watts);
        var e = parseFloat(heatV);
        var f = parseFloat(pf);
        var iHeat = phase === "3" ? p / (e * 1.732 * f) : p / e;
        if (faceH) faceH.textContent = isFinite(iHeat) ? fmt(iHeat) + " A" : "—";
        return;
      }
      if (page === "loop") {
        var boxes = host.querySelectorAll(".hr-pair b");
        var a = parseFloat(r1);
        var b = parseFloat(r2);
        if (boxes[0]) boxes[0].textContent = isFinite(a + b) ? fmt(a + b) + " Ω" : "—";
        if (boxes[1]) boxes[1].textContent = isFinite((a * b) / (a + b)) ? fmt((a * b) / (a + b)) + " Ω" : "—";
        return;
      }
      if (page === "drop") {
        var faceD = host.querySelector(".hr-face");
        var cm = CMIL[vdG] || 0;
        var vd = (2 * 12.9 * parseFloat(vdI) * parseFloat(vdFt)) / cm;
        if (faceD) faceD.textContent = isFinite(vd) ? fmt(vd) + " V" : "—";
        return;
      }
      if (page === "bend") {
        var specB = BENDS[ang];
        var boxesB = host.querySelectorAll(".hr-pair b");
        var spacing = parseFloat(rise) * specB.mult;
        var shrinkIn = parseFloat(rise) * specB.shrink;
        if (boxesB[0]) boxesB[0].textContent = isFinite(spacing) ? fmt(spacing) + " in" : "—";
        if (boxesB[1]) boxesB[1].textContent = isFinite(shrinkIn) ? fmt(shrinkIn) + " in" : "—";
      }
    }

    paint();
    return { stop: function () { if (bendTimer) clearInterval(bendTimer); bendTimer = 0; } };
  }

  global.HubRef = { start: start };
})(window);
