/* Instructor desk only. Students never load this file.
   iConnect did not ship a lab with these trainers. This is the department run-of-show
   for the three machines on the floor, written from the catalog and from the plates. */
(function (global) {
  "use strict";

  var LABS = [
    {
      id: "tu522",
      title: "TU-522 compressor board",
      time: "45 minutes",
      before: [
        "The catalog calls this job a TU-521. Our board says TU-522. Same single-phase compressor, patch cords, R-134a.",
        "The catalog TU-521 is listed at 120 volts, 15 amps. Read the plate on our board before you tell the class a voltage.",
        ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + " is the lab for these three machines. Read the plate on the board before you tell the class a voltage.",
        "Disconnect off. Cords in the tray, not already landed. No jumper sitting across a safety.",
      ],
      say: [
        "This board is how a single-phase compressor gets a call. The cord is the wire.",
        "Control string first: L1, temperature control, pump-down, low pressure, high pressure, contactor coil, L2.",
        "Then the load: T1 to the overload, overload to common, run winding to the run capacitor, start capacitor only through the potential relay.",
        "The shut-off valves on the suction and pressure lines are how you open the pressure controls on purpose. You do not jumper them.",
      ],
      students: "Phones on " + ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + ", TU-522, At the machine. They mark each cord as you land it together. They do not go ahead.",
      watch: [
        "A cord from the temperature control straight to the coil. That skips the safeties.",
        "Start capacitor landed on the run winding and left there.",
        "Someone ohming the compressor with the disconnect still on.",
      ],
      key: [
        "Refrigerant on our plate: R-134a. Not 410A.",
        "Disconnect: off before the first cord.",
        "Jumper on a safety: the only acceptable answer is no.",
        "A humming compressor with a closed overload is a capacitor or the relay, not a new compressor.",
      ],
    },
    {
      id: "tu601",
      title: "TU-601 mini-split",
      time: "40 minutes",
      before: [
        "Two indoor heads on the frame: high wall and ceiling cassette. The Daikin on the floor is the outdoor unit.",
        "The catalog unit has six sight glasses and a louver on the outdoor fan, plus toggle switches that insert electrical faults.",
        "Do not open a service valve. This period is identify, trace, and read. Charging is a later lab.",
      ],
      say: [
        "Read the plate out loud before a hose comes off the rack. Our plate is R-410A, 208/240, 20 amps.",
        "Each indoor head has its own line set. The wall is one pair. The cassette is another pair.",
        "Blue hose is suction. Red is liquid. Yellow stays capped.",
        "This compressor does not take a 24-volt Nest. Leave the factory control on it.",
        "If you use a fault switch, tell them which one you flipped. One fault. Then put the switch back.",
      ],
      students: "Phones on TU-601, At the machine. They write the refrigerant, the voltage, which box is outdoor, and that the Nest is not landed.",
      watch: [
        "A hose on a port before anyone has read the plate.",
        "Both line sets treated as one pair.",
        "A student about to open a service valve.",
      ],
      key: [
        "Refrigerant: R-410A. Voltage: 208/240.",
        "Outdoor unit: the Daikin on the floor.",
        "Line sets: two.",
        "Blue hose: suction. Nest: no.",
      ],
    },
    {
      id: "tu210",
      title: "TU-210G gas boiler",
      time: "40 minutes",
      before: [
        "This is the gas option of the TU-210. Water moves the heat. Radiator, baseboard, unit heater. Three zone valves, three thermostats, an expansion tank.",
        "The catalog unit has fault switches for failed parts. Know which switch you will use before class. Use one.",
        "Manifold stays on the cart. There is no refrigerant port on this copper.",
      ],
      say: [
        "Point at the plate. Gas boiler. If someone calls it a condenser, stop and correct it.",
        "Have three students each own a zone and name the valve and the thermostat.",
        "The tank on the water is an expansion tank, not a receiver.",
        "Prove water is in the boiler and the high limit is closed. Only then is the gas valve in the conversation.",
        "A fault switch is a failed part, not a jumper around the limit.",
      ],
      students: "Phones on TU-210G, At the machine. They cannot go on until they answer water, name the zones, and say the gauges are not on the copper.",
      watch: [
        "Gauges walking toward the boiler.",
        "Someone at the gas valve before the water is proved.",
        "A zone called 'the other one' with no valve named.",
      ],
      key: [
        "Heat moves by water.",
        "Zones: radiator, baseboard, unit heater.",
        "Tank: expansion tank.",
        "Water in the boiler and high limit closed: yes, before gas.",
        "Manifold on the copper: no.",
      ],
    },
  ];

  function mount(host) {
    if (!host) return;
    var openId = "";
    var sayIndex = 0;
    var keyOpen = false;
    function render() {
      var lab = null;
      if (openId.indexOf("L:") === 0) {
        var les = (global.TrainerLessons || {})[openId.slice(2)];
        if (les) {
          lab = {
            title: les.model + " · " + les.name,
            time: "One period",
            before: les.need,
            say: les.steps.map(function (s) { return s.look + ". " + s.say; }),
            students: les.cover + " They mark each step on the phone while they stand at the trainer.",
            watch: les.need,
            key: les.steps.filter(function (s) { return s.must; }).map(function (s) { return s.look + " — " + s.must + "."; }),
          };
        }
      } else {
        lab = LABS.filter(function (l) { return l.id === openId; })[0];
      }
      host.innerHTML = lab ? one(lab) : list();
      var back = host.querySelector("#it-back");
      if (back) back.onclick = function () { openId = ""; render(); };
      var sayBack = host.querySelector("#it-say-back");
      var sayNext = host.querySelector("#it-say-next");
      var keyBtn = host.querySelector("#it-key-btn");
      if (sayBack) sayBack.onclick = function () {
        if (sayIndex > 0) sayIndex -= 1;
        render();
      };
      if (sayNext) sayNext.onclick = function () {
        var total = lab && lab.say ? lab.say.length : 0;
        if (sayIndex < total - 1) sayIndex += 1;
        render();
      };
      if (keyBtn) keyBtn.onclick = function () {
        keyOpen = !keyOpen;
        render();
      };
      host.querySelectorAll("[data-lab]").forEach(function (b) {
        b.onclick = function () {
          openId = b.getAttribute("data-lab");
          sayIndex = 0;
          keyOpen = false;
          render();
        };
      });
    }
    function list() {
      var more = global.TrainerLessons || {};
      var rest = Object.keys(more).filter(function (id) {
        return !LABS.some(function (l) { return l.id === id; });
      }).map(function (id) {
        var les = more[id];
        return '<button type="button" class="it-card" data-lab="L:' + id + '"><b>' + les.model + " · " + les.name + '</b><span>Full lesson</span></button>';
      }).join("");
      return (
        '<div class="it">' +
        '<p class="it-note">Desk only. ' + ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + ' is this lab. Students follow it on their phones. The answer key stays here.</p>' +
        LABS.map(function (l) {
          return '<button type="button" class="it-card" data-lab="' + l.id + '"><b>' + l.title + "</b><span>" + l.time + "</span></button>";
        }).join("") +
        rest +
        "</div>"
      );
    }
    function block(title, items) {
      return "<h3>" + title + "</h3><ol>" + items.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>";
    }
    function one(lab) {
      if (!document.getElementById("it-now-css")) {
        var style = document.createElement("style");
        style.id = "it-now-css";
        style.textContent = [
          ".it{max-width:100%;overflow-x:hidden;box-sizing:border-box}",
          ".it h2{font-size:22px;line-height:1.25;overflow-wrap:anywhere}",
          ".it-now{margin:10px 0;padding:14px 16px;border:2px solid #e8c450;border-radius:14px;background:#1a160e;max-width:100%;box-sizing:border-box}",
          ".it-now-title{margin:0;font-size:22px;line-height:1.2;color:#e8c450;font-weight:700;overflow-wrap:anywhere}",
          ".it-say{margin:8px 0 0;font-size:18px;line-height:1.35;color:#f6f1e6;font-weight:700;overflow-wrap:anywhere}",
          ".it-now-row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}",
          ".it-now-row .btn{flex:1 1 0;min-width:0;margin:0;min-height:48px}",
          ".it .btn{min-height:48px;box-sizing:border-box;max-width:100%}",
          "#it-key-btn{display:block;width:100%;margin:8px 0 0}",
          ".it details{margin:12px 0;max-width:100%}",
          ".it details summary{min-height:48px;display:flex;align-items:center;cursor:pointer;overflow-wrap:anywhere}",
          ".it p,.it li,.it h3{overflow-wrap:anywhere;max-width:100%}",
          "@media (max-width:390px){.it{overflow-x:hidden}.it h2,.it-now-title{font-size:22px}.it-say{font-size:18px}.it .btn{min-height:48px}}"
        ].join("");
        (document.head || document.documentElement).appendChild(style);
      }
      var lines = lab.say || [];
      var i = sayIndex;
      if (i < 0) i = 0;
      if (lines.length && i > lines.length - 1) i = lines.length - 1;
      if (!lines.length) i = 0;
      var n = lines.length ? i + 1 : 0;
      var say = lines.length ? lines[i] : "";
      return (
        '<div class="it">' +
        '<button type="button" class="btn" id="it-back">All three trainers</button>' +
        "<h2>" + lab.title + "</h2><p class=\"it-note\">" + lab.time + " · you stay at the machine · they stay on the sheet</p>" +
        '<div class="it-now">' +
        '<p class="it-now-title">Say this · ' + n + " / " + lines.length + "</p>" +
        '<p class="it-say">' + say + "</p>" +
        '<div class="it-now-row">' +
        '<button type="button" class="btn" id="it-say-back">Back</button>' +
        '<button type="button" class="btn" id="it-say-next">Next</button>' +
        "</div></div>" +
        '<button type="button" class="btn" id="it-key-btn">' + (keyOpen ? "Hide the answer key" : "Show the answer key") + "</button>" +
        (keyOpen
          ? '<div class="it-key"><ul>' + lab.key.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>"
          : "") +
        "<details>" +
        "<summary>Before they walk up · What they do · Stop the class if you see this</summary>" +
        block("Before they walk up", lab.before) +
        "<h3>What they do</h3><p>" + lab.students + "</p>" +
        block("Stop the class if you see this", lab.watch) +
        "</details>" +
        "<h3>After</h3><p>Tell them to open the same trainer at home and pick Practice. The picture is the same order. It is not a substitute for standing here.</p>" +
        "</div>"
      );
    }
    render();
  }

  global.IConnectTeach = { mount: mount };
})(window);
