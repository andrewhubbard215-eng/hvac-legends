/* Truck pouch — fat numbers, offline. Practice chart, not a manufacturer book. */
(function () {
  "use strict";

  var PT = {
    "410A": [[60, 8], [80, 22], [100, 33], [118, 40], [140, 50], [170, 60], [200, 70], [235, 80], [275, 90], [317, 100], [365, 110], [420, 120]],
    "22": [[30, 8], [43, 20], [58, 32], [68, 40], [84, 50], [100, 58], [121, 70], [145, 80], [168, 90], [196, 100], [226, 110], [260, 120]],
    "134a": [[12, 10], [22, 24], [30, 34], [35, 40], [45, 50], [57, 60], [72, 70], [87, 80], [104, 90], [124, 100], [146, 110], [171, 120]],
    "32": [[70, 8], [95, 22], [120, 34], [140, 42], [170, 52], [200, 62], [240, 72], [280, 82], [330, 92], [380, 102], [440, 112]],
    "454B": [[58, 8], [78, 22], [98, 33], [115, 40], [138, 50], [165, 60], [195, 70], [230, 80], [268, 90], [310, 100], [355, 110], [410, 120]]
  };
  var GLIDE = { "454B": 4 };
  var CM = { 18: 1620, 16: 2580, 14: 4110, 12: 6530, 10: 10380 };
  var gas = "410A";

  function sat(table, psig) {
    if (psig == null || isNaN(psig)) return null;
    var t = PT[table];
    if (psig <= t[0][0]) return t[0][1];
    if (psig >= t[t.length - 1][0]) return t[t.length - 1][1];
    for (var i = 1; i < t.length; i++) {
      if (psig <= t[i][0]) {
        var a = t[i - 1];
        var b = t[i];
        return a[1] + ((psig - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
      }
    }
    return null;
  }

  function num(id) {
    var el = document.getElementById(id);
    if (!el || el.value === "") return null;
    var n = parseFloat(el.value);
    return isNaN(n) ? null : n;
  }

  function round(n) {
    return n == null || isNaN(n) ? "—" : String(Math.round(n));
  }

  function fingerprint(sh, sc, liqSat) {
    if (sh == null || sc == null) return "Need all four numbers.";
    if (liqSat > 115 && sc < 8) return "High head, weak subcool. Dirty roof before you add gas.";
    if (sh > 18 && sc > 16) return "High superheat and high subcool. Restriction. Don't add gas.";
    if (sh > 15 && sc < 6) return "Starved. High superheat, low subcool. Undercharge or low airflow — air first.";
    if (sh < 6 && sc > 14) return "Overcharged. Superheat is gone and the liquid line is stacked.";
    if (sh < 6) return "Low superheat. Flooding or low airflow. Check the filter before the charge.";
    if (sh >= 8 && sh <= 16 && sc >= 8 && sc <= 14) return "Looks like a normal running box. Confirm airflow before you leave.";
    return "Read it again. Superheat " + round(sh) + "°, subcool " + round(sc) + "°.";
  }

  function root() {
    var el = document.getElementById("pouch-root");
    if (el) return el;
    el = document.createElement("div");
    el.id = "pouch-root";
    el.hidden = true;
    el.innerHTML =
      '<div class="pouch-top">' +
      '<button type="button" class="pouch-x" id="pouch-x">Close</button>' +
      '<p class="pouch-hint" id="pouch-hint">Practice chart. Not the manufacturer book.</p>' +
      '<h2 class="pouch-title">ON THE JOB</h2></div>' +
      '<button type="button" class="pouch-live" id="pouch-live">See it on a live box</button>' +
      '<div class="pouch-tabs" id="pouch-tabs">' +
      '<button type="button" data-tab="pt" class="on">Charge</button>' +
      '<button type="button" data-tab="vd">Volts</button>' +
      '<button type="button" data-tab="ohm">Ohms</button>' +
      '<button type="button" data-tab="epa">608</button>' +
      '<button type="button" data-tab="air">Air</button></div>' +
      '<section class="pouch-panel" data-panel="pt">' +
      '<div class="pouch-chips" id="pouch-gas"></div>' +
      '<label class="pouch-field"><span>Suction psig</span><input id="pt-sp" inputmode="decimal" placeholder="118"></label>' +
      '<label class="pouch-field"><span>Suction line °F</span><input id="pt-st" inputmode="decimal" placeholder="55"></label>' +
      '<label class="pouch-field"><span>Liquid psig</span><input id="pt-lp" inputmode="decimal" placeholder="320"></label>' +
      '<label class="pouch-field"><span>Liquid line °F</span><input id="pt-lt" inputmode="decimal" placeholder="95"></label>' +
      '<div class="pouch-outs">' +
      '<div class="pouch-out"><i>Suction sat</i><b id="pt-ss">—</b></div>' +
      '<div class="pouch-out"><i>Superheat</i><b id="pt-sh">—</b></div>' +
      '<div class="pouch-out"><i>Liquid sat</i><b id="pt-ls">—</b></div>' +
      '<div class="pouch-out"><i>Subcool</i><b id="pt-sc">—</b></div>' +
      '<div class="pouch-out wide"><i>Fingerprint</i><b id="pt-fp" style="font-size:28px">—</b></div></div>' +
      '<p class="pouch-line" id="pt-line"></p></section>' +
      '<section class="pouch-panel" data-panel="vd" hidden>' +
      '<div class="pouch-chips" id="pouch-awg"></div>' +
      '<div class="pouch-chips" id="pouch-volt"><button type="button" data-v="24" class="on">24 V</button><button type="button" data-v="240">240 V</button></div>' +
      '<label class="pouch-field"><span>One-way feet</span><input id="vd-ft" inputmode="decimal" placeholder="80"></label>' +
      '<label class="pouch-field"><span>Amps</span><input id="vd-a" inputmode="decimal" placeholder="1"></label>' +
      '<div class="pouch-outs">' +
      '<div class="pouch-out"><i>Drop</i><b id="vd-drop">—</b></div>' +
      '<div class="pouch-out"><i>Percent</i><b id="vd-pct">—</b></div>' +
      '<div class="pouch-out wide"><i>Volts at the load</i><b id="vd-load">—</b></div></div>' +
      '<p class="pouch-line" id="vd-line"></p></section>' +
      '<section class="pouch-panel" data-panel="ohm" hidden>' +
      '<button type="button" class="pouch-preset" id="ohm-40">40 VA transformer</button>' +
      '<label class="pouch-field"><span>Volts</span><input id="ohm-v" inputmode="decimal" placeholder="24"></label>' +
      '<label class="pouch-field"><span>Amps</span><input id="ohm-i" inputmode="decimal" placeholder="0.5"></label>' +
      '<label class="pouch-field"><span>Ohms</span><input id="ohm-r" inputmode="decimal" placeholder="48"></label>' +
      '<div class="pouch-outs">' +
      '<div class="pouch-out"><i>Volts</i><b id="ohm-ov">—</b></div>' +
      '<div class="pouch-out"><i>Amps</i><b id="ohm-oi">—</b></div>' +
      '<div class="pouch-out"><i>Ohms</i><b id="ohm-or">—</b></div>' +
      '<div class="pouch-out"><i>Watts</i><b id="ohm-op">—</b></div></div>' +
      '<p class="pouch-line" id="ohm-line"></p></section>' +
      '<section class="pouch-panel" data-panel="epa" hidden>' +
      '<p class="pouch-tag">Leak rate, practice</p>' +
      '<label class="pouch-field"><span>Charge, pounds</span><input id="epa-lb" inputmode="decimal" placeholder="8"></label>' +
      '<div class="pouch-chips" id="epa-rate"><button type="button" data-r="0.10">10%</button><button type="button" data-r="0.20" class="on">20%</button><button type="button" data-r="0.30">30%</button></div>' +
      '<div class="pouch-outs"><div class="pouch-out wide"><i>Pounds a year</i><b id="epa-yr">—</b></div></div>' +
      '<div class="pouch-ex"><p id="epa-15"></p><p id="epa-50"></p>' +
      '<p>Recover, vacuum, weigh in. Do not pull vapor off a blend. This is not an EPA card.</p></div></section>' +
      '<section class="pouch-panel" data-panel="air" hidden>' +
      '<label class="pouch-field"><span>BTU per hour</span><input id="air-b" inputmode="decimal" placeholder="24000"></label>' +
      '<label class="pouch-field"><span>Temperature rise °F</span><input id="air-d" inputmode="decimal" placeholder="20"></label>' +
      '<div class="pouch-outs"><div class="pouch-out wide"><i>CFM</i><b id="air-c">—</b></div></div>' +
      '<p class="pouch-line">CFM ≈ BTU ÷ (1.08 × rise). Air before charge.</p></section>';
    document.body.appendChild(el);
    wire(el);
    return el;
  }

  function wire(el) {
    var chips = document.getElementById("pouch-gas");
    ["410A", "22", "134a", "32", "454B"].forEach(function (g) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = "R-" + g;
      b.dataset.g = g;
      if (g === gas) b.className = "on";
      b.addEventListener("click", function () {
        gas = g;
        chips.querySelectorAll("button").forEach(function (n) { n.classList.toggle("on", n === b); });
        calcPt();
      });
      chips.appendChild(b);
    });
    var awg = document.getElementById("pouch-awg");
    var gauge = 18;
    [18, 16, 14, 12, 10].forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = n + " AWG";
      if (n === 18) b.className = "on";
      b.addEventListener("click", function () {
        gauge = n;
        awg.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
        calcVd();
      });
      awg.appendChild(b);
    });
    var volts = 24;
    document.getElementById("pouch-volt").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      volts = parseFloat(b.dataset.v);
      document.querySelectorAll("#pouch-volt button").forEach(function (n) { n.classList.toggle("on", n === b); });
      calcVd();
    });
    var rate = 0.2;
    document.getElementById("epa-rate").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      rate = parseFloat(b.dataset.r);
      document.querySelectorAll("#epa-rate button").forEach(function (n) { n.classList.toggle("on", n === b); });
      calcEpa();
    });
    el.addEventListener("input", function () {
      calcPt();
      calcVd();
      calcOhm();
      calcEpa();
      calcAir();
    });
    document.getElementById("pouch-tabs").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      document.querySelectorAll("#pouch-tabs button").forEach(function (n) { n.classList.toggle("on", n === b); });
      document.querySelectorAll("#pouch-root .pouch-panel").forEach(function (p) {
        p.hidden = p.dataset.panel !== b.dataset.tab;
      });
    });
    document.getElementById("pouch-x").addEventListener("click", function () { el.hidden = true; });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.hidden) el.hidden = true;
    });
    document.getElementById("pouch-live").addEventListener("click", function () {
      el.hidden = true;
      var bay = document.querySelector('[data-mode="sandbox"]');
      if (bay) bay.click();
    });
    document.getElementById("ohm-40").addEventListener("click", function () {
      document.getElementById("ohm-v").value = "24";
      document.getElementById("ohm-i").value = "1.67";
      document.getElementById("ohm-r").value = "";
      calcOhm();
      document.getElementById("ohm-line").textContent = "40 VA at 24 V can only give about 1.67 A. A shorted coil asks for 6.";
    });
    el._calcVd = function () { calcVdInner(gauge, volts); };
    function calcVd() { calcVdInner(gauge, volts); }
    function calcEpa() { calcEpaInner(rate); }
    calcPt();
    calcVd();
    calcOhm();
    calcEpa();
    calcAir();
  }

  function calcPt() {
    var sp = num("pt-sp");
    var st = num("pt-st");
    var lp = num("pt-lp");
    var lt = num("pt-lt");
    var dewS = sat(gas, sp);
    var dewL = sat(gas, lp);
    var glide = GLIDE[gas] || 0;
    var bubL = dewL == null ? null : dewL - glide;
    var sh = dewS == null || st == null ? null : st - dewS;
    var sc = bubL == null || lt == null ? null : bubL - lt;
    var ss = document.getElementById("pt-ss");
    if (!ss) return;
    ss.textContent = round(dewS);
    document.getElementById("pt-sh").textContent = round(sh);
    document.getElementById("pt-ls").textContent = glide ? round(bubL) : round(dewL);
    document.getElementById("pt-sc").textContent = round(sc);
    document.getElementById("pt-fp").textContent = fingerprint(sh, sc, dewL);
    document.getElementById("pt-line").textContent = glide
      ? "R-454B glide. Superheat uses dew. Subcool uses bubble, about " + glide + "° under dew. Practice, not the book."
      : "Superheat is vapor clamp minus sat. Subcool is sat minus the liquid line.";
  }

  function calcVdInner(gauge, volts) {
    var ft = num("vd-ft");
    var a = num("vd-a");
    var drop = ft == null || a == null ? null : (2 * 12.9 * a * ft) / CM[gauge];
    var load = drop == null ? null : volts - drop;
    var pct = drop == null ? null : (drop / volts) * 100;
    var d = document.getElementById("vd-drop");
    if (!d) return;
    d.textContent = drop == null ? "—" : drop.toFixed(1);
    document.getElementById("vd-pct").textContent = pct == null ? "—" : pct.toFixed(1);
    document.getElementById("vd-load").textContent = load == null ? "—" : load.toFixed(1);
    document.getElementById("vd-line").textContent =
      volts === 24 && load != null && load < 21 ? "The 24 got spent in the wire." : "";
  }

  function calcOhm() {
    var v = num("ohm-v");
    var i = num("ohm-i");
    var r = num("ohm-r");
    if (v != null && i != null && r == null) r = v / i;
    else if (v != null && r != null && i == null) i = v / r;
    else if (i != null && r != null && v == null) v = i * r;
    var p = v != null && i != null ? v * i : null;
    var ov = document.getElementById("ohm-ov");
    if (!ov) return;
    ov.textContent = v == null ? "—" : v.toFixed(1);
    document.getElementById("ohm-oi").textContent = i == null ? "—" : i.toFixed(2);
    document.getElementById("ohm-or").textContent = r == null ? "—" : r.toFixed(1);
    document.getElementById("ohm-op").textContent = p == null ? "—" : p.toFixed(0);
  }

  function calcEpaInner(rate) {
    var lb = num("epa-lb");
    var yr = lb == null ? null : lb * rate;
    var el = document.getElementById("epa-yr");
    if (!el) return;
    el.textContent = yr == null ? "—" : yr.toFixed(1);
    document.getElementById("epa-15").textContent = "15 lb at " + Math.round(rate * 100) + "% is " + (15 * rate).toFixed(1) + " lb a year.";
    document.getElementById("epa-50").textContent = "50 lb at " + Math.round(rate * 100) + "% is " + (50 * rate).toFixed(1) + " lb a year.";
  }

  function calcAir() {
    var b = num("air-b");
    var d = num("air-d");
    var cfm = b == null || d == null || d === 0 ? null : b / (1.08 * d);
    var el = document.getElementById("air-c");
    if (!el) return;
    el.textContent = cfm == null ? "—" : String(Math.round(cfm));
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest('[data-mode="pouch"]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    root().hidden = false;
  }, true);
  window.TruckPouch = {
    open: function () { root().hidden = false; },
    close: function () { var el = document.getElementById("pouch-root"); if (el) el.hidden = true; }
  };
})();
