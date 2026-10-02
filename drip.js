/* Shop-floor drip — teach in the wrench, not a lecture.
   Call LtDrip.say("ohms.smoke"). Never says "today's lesson." */
(function (global) {
  "use strict";
  var KEY = "lt-drip";
  var lastAt = 0;
  var COOL = 14000;
  var DAY = 6 * 60 * 60 * 1000;

  var LINES = {
    "hub.floor": [
      "Needles before you add a pound. Iced coil is air, not gas.",
      "24 V at the transformer is not 24 V at the coil. Walk the loop.",
      "TXV holds superheat. You charge that box by subcooling.",
    ],
    "ohms": "Push = flow × squeeze. V = I × R. The transformer only budgets so many amps.",
    "ohms.smoke": "R dropped, amps exploded. That 40 VA can only give 1.67 A. The coil is a dead short — the transformer is the fuse with manners.",
    "ohms.coil": "Healthy 24 V coil is about 48 Ω, half an amp. That's a pull-in, not a heater.",
    "ohms.drop": "The 24 V got spent in the wire. Coil only saw 21. That's the loop adding up — not a bad coil.",
    "ohms.va": "Every amp on C has to come back through that transformer. Add the rungs before you add a humidistat.",
    "gauges": "Blue on the fat line, red on the skinny, yellow capped to read. Handwheels closed or you mix the sides.",
    "gauges.blown": "Blue on liquid pegs the compound. That's a dead gauge in the truck. Blue is suction only.",
    "gauges.hooked": "Needles are pressure. Inner ring is sat °F. Clamp is pipe temp. Two numbers make SH. Two make SC.",
    "gauges.sh": "SH = vapor clamp minus dew sat. SC = start of boiling minus the liquid-line temperature. High head with low SC is a dirty roof, not extra gas.",
    "gauges.txv": "Piston is charged by SH. TXV is charged by SC. Don't twist the stem to fix a charge.",
    "ptchart": "454B isn't 410A. Two sats at one pressure — dew for superheat, start of boiling for subcooling.",
    "electrical": "Closed switch reads about 0 V. The coil eats the 24. If the coil reads 0, the open is somewhere else on that rung.",
    "elec.ok": "Black is hot, off-white is neutral, green is ground. Landed like the can.",
    "elec.bad": "Wrong color on that screw. The board doesn't care what you meant — current takes the path you landed.",
    "elec.kvl": "Meter across the load. That's the only volts the coil cares about. Chassis ground is not common.",
    "vm.class": "Black in COM. Red in VΩ. Dial VAC. Two leads or you're reading air.",
    "vm.fuse": "Voltage in the amp jack. That's a fuse, not a measurement.",
    "vm.ohm-live": "Ω on a live circuit. Kill the disconnect first — then the dial is legal.",
    "sandbox": "Running system only. Static both sides equal outdoor sat — that's not a charge.",
    "sandbox.job": "High SH + low SC is starved. High SC + high SH is a restriction. Low SH + ice is a filter. Don't mix those.",
    "epa608": "Recover, vacuum, weigh in. Topping a zeotrope leak is how you cocktail the blend.",
    "quiz": "If you guess, read the why. The why is the job.",
  };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }

  function pickHub() {
    var a = LINES["hub.floor"];
    return a[((Date.now() / 40000) | 0) % a.length];
  }

  function lineFor(id) {
    if (id === "hub.floor") return pickHub();
    var v = LINES[id];
    if (Array.isArray(v)) return v[0];
    return v || "";
  }

  function ear() {
    var el = document.getElementById("drip-ear");
    if (el) return el;
    el = document.createElement("div");
    el.id = "drip-ear";
    el.className = "drip-ear";
    el.hidden = true;
    el.setAttribute("role", "status");
    (document.getElementById("app") || document.body).appendChild(el);
    el.addEventListener("click", function () {
      el.hidden = true;
    });
    return el;
  }

  function say(id, force) {
    var text = lineFor(id);
    if (!text) return;
    var now = Date.now();
    if (!force && now - lastAt < COOL) return;
    var seen = load();
    if (!force && seen[id] && now - seen[id] < DAY) return;
    seen[id] = now;
    save(seen);
    lastAt = now;
    var el = ear();
    el.innerHTML =
      '<img src="hub-portrait.jpg?v=3" alt="" />' +
      "<div><strong>HUB</strong><p>" +
      text +
      "</p></div>";
    el.hidden = false;
    clearTimeout(say._t);
    say._t = setTimeout(function () {
      el.hidden = true;
    }, 7000);
  }

  function onMode(m) {
    var map = {
      ohms: "ohms",
      gauges: "gauges",
      gaugeguide: "gauges",
      electrical: "electrical",
      elguide: "elec.ok",
      meter: "elec.kvl",
      voltmeter: "vm.class",
      sandbox: "sandbox",
      ptchart: "ptchart",
      epa608: "epa608",
      quiz: "quiz",
      hub: "hub.floor",
    };
    var id = map[m];
    if (id) setTimeout(function () { say(id); }, 600);
  }

  global.LtDrip = { say: say, onMode: onMode };
})(window);
