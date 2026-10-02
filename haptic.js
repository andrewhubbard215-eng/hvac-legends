/* Shop haptics: native LRA click on the Android wrapper, else Web Vibration (ERM buzz). */
(function (global) {
  "use strict";
  var KEY = "lt-haptic";

  function nativeBridge() {
    try {
      return global.LtNativeHaptic && typeof global.LtNativeHaptic.pulse === "function"
        ? global.LtNativeHaptic
        : null;
    } catch (_) {
      return null;
    }
  }

  function allowed() {
    try {
      if (localStorage.getItem(KEY) === "0") return false;
    } catch (_) {}
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return true;
  }

  function go(kind, pattern) {
    if (!allowed()) return;
    var n = nativeBridge();
    if (n) {
      try { n.pulse(kind); return; } catch (_) {}
    }
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try { navigator.vibrate(pattern); } catch (_) {}
    }
  }

  function hw() {
    var n = nativeBridge();
    if (n) {
      try {
        if (!n.hasMotor()) return "none";
        var k = n.kind();
        var p = n.primitives ? n.primitives() : "";
        var e = n.engines ? n.engines() : "";
        var lim = n.limits ? n.limits() : "";
        var bits = [];
        if (k) bits.push(k);
        if (p) bits.push("[" + p + "]");
        if (e) bits.push(e);
        if (lim) bits.push(lim);
        return bits.join(" ");
      } catch (_) {}
    }
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") return "web";
    return "none";
  }

  global.LtHaptic = {
    tick: function () { go("tick", 10); },
    land: function () { go("land", [12, 18, 22]); },
    ok: function () { go("ok", 16); },
    bad: function () { go("bad", [28, 36, 28]); },
    kick: function () { go("kick", [40, 40, 55, 30, 80]); },
    stop: function () { go("stop", 40); },
    warn: function () { go("warn", [24, 70, 24]); },
    boom: function () { go("boom", [80, 40, 110]); },
    hw: hw,
    patterns: [
      { id: "tick", label: "Tick", job: "Light confirm" },
      { id: "land", label: "Land", job: "Part / wire seats" },
      { id: "ok", label: "Right", job: "Exam correct" },
      { id: "bad", label: "Wrong", job: "Bad lug / miss" },
      { id: "kick", label: "Kick", job: "Compressor start" },
      { id: "stop", label: "Stop", job: "Compressor off" },
      { id: "warn", label: "HPC", job: "Pressure switch trip" },
      { id: "boom", label: "Boom", job: "Callback time-out" },
    ],
    play: function (id) {
      var fn = global.LtHaptic[id];
      if (typeof fn === "function") fn();
    },
    setOn: function (v) {
      try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (_) {}
    },
    isOn: function () {
      try { return localStorage.getItem(KEY) !== "0"; } catch (_) { return true; }
    },
  };
})(window);
