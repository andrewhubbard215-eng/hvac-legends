/* Field formulas — original Ohm's-law card. Not a copy of any pocket reference. */
(function (global) {
  "use strict";

  const FIND = {
    P: {
      name: "Watts",
      unit: "W",
      pairs: [
        { have: ["E", "I"], text: "E × I", run: function (v) { return v.E * v.I; } },
        { have: ["E", "R"], text: "E² ÷ R", run: function (v) { return (v.E * v.E) / v.R; } },
        { have: ["I", "R"], text: "I² × R", run: function (v) { return v.I * v.I * v.R; } },
      ],
    },
    E: {
      name: "Volts",
      unit: "V",
      pairs: [
        { have: ["I", "R"], text: "I × R", run: function (v) { return v.I * v.R; } },
        { have: ["P", "I"], text: "P ÷ I", run: function (v) { return v.P / v.I; } },
        { have: ["P", "R"], text: "√(P × R)", run: function (v) { return Math.sqrt(v.P * v.R); } },
      ],
    },
    I: {
      name: "Amps",
      unit: "A",
      pairs: [
        { have: ["E", "R"], text: "E ÷ R", run: function (v) { return v.E / v.R; } },
        { have: ["P", "E"], text: "P ÷ E", run: function (v) { return v.P / v.E; } },
        { have: ["P", "R"], text: "√(P ÷ R)", run: function (v) { return Math.sqrt(v.P / v.R); } },
      ],
    },
    R: {
      name: "Ohms",
      unit: "Ω",
      pairs: [
        { have: ["E", "I"], text: "E ÷ I", run: function (v) { return v.E / v.I; } },
        { have: ["E", "P"], text: "E² ÷ P", run: function (v) { return (v.E * v.E) / v.P; } },
        { have: ["P", "I"], text: "P ÷ I²", run: function (v) { return v.P / (v.I * v.I); } },
      ],
    },
  };

  const LABEL = { P: "Watts", E: "Volts", I: "Amps", R: "Ohms" };
  const UNIT = { P: "W", E: "V", I: "A", R: "Ω" };

  const JOBS = [
    { name: "Contactor coil", want: "P", values: { E: 24, I: 0.5 }, say: "24 V across a coil pulling half an amp." },
    { name: "3-ton condenser", want: "P", values: { E: 240, I: 13.4 }, say: "Nameplate-ish running amps on 240 V." },
    { name: "5 kW heat strip", want: "I", values: { P: 5000, E: 240 }, say: "Watts and volts. You need the breaker size." },
    { name: "Crankcase heater", want: "I", values: { E: 240, R: 480 }, say: "Heater ohms on 240 V." },
  ];

  function FieldFormulas(host, opts) {
    const onHub = opts && opts.onHub;
    let want = "I";
    let pair = 0;
    let values = { E: 240, I: "", R: "", P: "" };
    let answer = "";
    let say = "Pick what you need. Type the two numbers you have.";

    function paint() {
      const spec = FIND[want];
      const use = spec.pairs[pair];
      host.innerHTML =
        '<div class="ff-lab">' +
        "<style>" +
        "#formulas-root{height:100%;overflow:auto;background:#10161c;color:#f4efe6}" +
        "#formulas-root .ff-lab{padding:12px;max-width:880px;margin:0 auto;box-sizing:border-box}" +
        "#formulas-root .ff-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
        "#formulas-root h2{margin:0;font-size:22px}" +
        "#formulas-root .ff-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0}" +
        "#formulas-root .ff-pick,#formulas-root .ff-pair,#formulas-root .ff-job{border:1px solid #3a424a;background:#1c2126;color:#f4efe6;border-radius:10px;padding:8px;font-weight:700}" +
        "#formulas-root .ff-pick.on,#formulas-root .ff-pair.on,#formulas-root .ff-job.on{border-color:#e8c450;color:#e8c450}" +
        "#formulas-root .ff-face{font-size:56px;line-height:1;margin:8px 0;color:#b6f5c4;font-variant-numeric:tabular-nums}" +
        "#formulas-root .ff-formula{font-size:20px;color:#e8c450}" +
        "#formulas-root label{display:flex;flex-direction:column;gap:4px;font-size:13px}" +
        "#formulas-root input{font-size:22px;padding:8px;border-radius:8px;border:1px solid #3a424a;background:#0c1014;color:#f4efe6}" +
        "#formulas-root .ff-ins{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
        "#formulas-root .ff-jobs{display:flex;flex-wrap:wrap;gap:8px}" +
        "#formulas-root .ff-wheel{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:14px}" +
        "#formulas-root .ff-wheel div{background:#1c2126;border-radius:10px;padding:8px}" +
        "#formulas-root .ff-wheel b{color:#e8c450}" +
        "#formulas-root .ff-wheel li{margin:2px 0}" +
        "@media (max-width:640px){#formulas-root .ff-grid{grid-template-columns:1fr 1fr}#formulas-root .ff-face{font-size:40px}}" +
        "</style>" +
        '<header class="ff-top">' +
        '<button type="button" class="btn" id="ff-hub">Shop floor</button>' +
        "<h2>Field formulas</h2>" +
        "</header>" +
        "<p>Volts, amps, ohms, watts. Same relationships on every truck card. This one is ours.</p>" +
        '<div class="ff-grid" id="ff-want">' +
        Object.keys(FIND).map(function (k) {
          return '<button type="button" class="ff-pick' + (k === want ? " on" : "") + '" data-want="' + k + '">Find ' + FIND[k].name + "</button>";
        }).join("") +
        "</div>" +
        '<div class="ff-jobs" id="ff-pairs">' +
        spec.pairs.map(function (p, i) {
          return '<button type="button" class="ff-pair' + (i === pair ? " on" : "") + '" data-pair="' + i + '">' + p.text + "</button>";
        }).join("") +
        "</div>" +
        '<p class="ff-formula">' + spec.name + " = " + use.text + "</p>" +
        '<div class="ff-ins">' +
        use.have.map(function (k) {
          return '<label>' + LABEL[k] + " (" + UNIT[k] + ')<input inputmode="decimal" data-k="' + k + '" value="' + (values[k] === "" || values[k] == null ? "" : values[k]) + '" /></label>';
        }).join("") +
        "</div>" +
        '<p class="ff-face" id="ff-ans">' + (answer || "—") + "</p>" +
        "<p>" + say + "</p>" +
        '<div class="ff-jobs" id="ff-jobs">' +
        JOBS.map(function (j, i) {
          return '<button type="button" class="ff-job" data-job="' + i + '">' + j.name + "</button>";
        }).join("") +
        "</div>" +
        '<div class="ff-wheel">' +
        Object.keys(FIND).map(function (k) {
          return "<div><b>" + FIND[k].name + "</b><ul>" +
            FIND[k].pairs.map(function (p) { return "<li>" + p.text + "</li>"; }).join("") +
            "</ul></div>";
        }).join("") +
        "</div></div>";

      host.querySelector("#ff-hub").onclick = function () { if (onHub) onHub(); };
      host.querySelectorAll("[data-want]").forEach(function (b) {
        b.onclick = function () {
          want = b.getAttribute("data-want");
          pair = 0;
          answer = "";
          say = "Now the two numbers you measured.";
          paint();
        };
      });
      host.querySelectorAll("[data-pair]").forEach(function (b) {
        b.onclick = function () {
          pair = +b.getAttribute("data-pair");
          answer = "";
          solve();
        };
      });
      host.querySelectorAll("[data-k]").forEach(function (input) {
        input.oninput = function () {
          values[input.getAttribute("data-k")] = input.value;
          solve(true);
        };
      });
      host.querySelectorAll("[data-job]").forEach(function (b) {
        b.onclick = function () {
          const job = JOBS[+b.getAttribute("data-job")];
          want = job.want;
          values = { E: "", I: "", R: "", P: "" };
          Object.keys(job.values).forEach(function (k) { values[k] = job.values[k]; });
          const keys = Object.keys(job.values);
          pair = FIND[want].pairs.findIndex(function (p) {
            return p.have.indexOf(keys[0]) >= 0 && p.have.indexOf(keys[1]) >= 0;
          });
          if (pair < 0) pair = 0;
          say = job.say;
          solve();
        };
      });
    }

    function solve(live) {
      const spec = FIND[want];
      const use = spec.pairs[pair];
      const a = parseFloat(values[use.have[0]]);
      const b = parseFloat(values[use.have[1]]);
      const bad = !isFinite(a) || !isFinite(b) || (b === 0 && (use.text.indexOf("÷") >= 0 || use.text.indexOf("I²") >= 0));
      if (bad) {
        answer = "—";
        const face = host.querySelector("#ff-ans");
        if (live && face) {
          face.textContent = "—";
          return;
        }
        say = "Both numbers have to be real. Don't divide by zero.";
        paint();
        return;
      }
      const bag = {};
      bag[use.have[0]] = a;
      bag[use.have[1]] = b;
      const n = use.run(bag);
      if (!isFinite(n)) {
        answer = "—";
        if (live) {
          const face = host.querySelector("#ff-ans");
          if (face) face.textContent = "—";
          return;
        }
        say = "That pair doesn't make a real number.";
        paint();
        return;
      }
      const fixed = Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(2);
      answer = fixed + " " + spec.unit;
      if (!live) say = spec.name + " = " + use.text + ". That's the number.";
      const face = host.querySelector("#ff-ans");
      if (face && live) {
        face.textContent = answer;
        return;
      }
      paint();
    }

    paint();
    return { stop: function () {} };
  }

  global.FieldFormulas = {
    start: function (host, opts) { return FieldFormulas(host, opts || {}); },
  };
})(window);
