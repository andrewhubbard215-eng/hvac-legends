/* iConnect trainers in the HVAC Legends lab.
   TU-522 single-phase compressor board with faults (R-134a).
   TU-601 multi-head mini-split heat pump (R-410A, 208/240).
   TU-210G gas boiler, hydronic. */
(function () {
  const FAULTS = [
    {
      id: "pump",
      say: "Call for cool is in. Contactor is out. Compressor is quiet.",
      why: "The manual pump-down switch is OPEN. This board will not run a compressor in pump-down. Close it to run.",
    },
    {
      id: "hpc",
      say: "Call for cool is in. Contactor is out. The high-side line is hot to the touch.",
      why: "High pressure control is OPEN. It sits in series with the contactor coil. Fix the high head before you jumper it.",
    },
    {
      id: "lpc",
      say: "Call for cool is in. Contactor is out. Suction line is warm, not cold.",
      why: "Low pressure control is OPEN. Low suction, empty, or a restriction. Do not jumper it and walk away.",
    },
    {
      id: "ol",
      say: "Contactor is pulled in. Compressor does not start. No hum from the start circuit.",
      why: "Overload is OPEN, in series with common. The contacts can be in and the compressor still dead.",
    },
    {
      id: "run",
      say: "Contactor is in. Compressor hums and does not start. Overload is still closed.",
      why: "Run capacitor is OPEN. A single-phase compressor will not start on the run winding alone.",
    },
    {
      id: "pot",
      say: "Contactor is in. Compressor hums. The start capacitor never leaves the circuit, then the overload opens.",
      why: "Potential relay did not drop the start capacitor. Start cap is only for the start.",
    },
    {
      id: "coil",
      say: "Safety string is closed. You read voltage to the contactor coil. It does not pull.",
      why: "Contactor coil is OPEN. The controls told it to close. The coil cannot.",
    },
    {
      id: "tstat",
      say: "Room is hot. Nothing on the board pulls in.",
      why: "Temperature control is OPEN. No call, no contactor. Prove the stat before you condemn the compressor.",
    },
  ];

  const PARTS = [
    { id: "pump", name: "Manual pump down", good: "CLOSED · 0.2 Ω", bad: "OPEN · OL" },
    { id: "tstat", name: "Temperature control", good: "CLOSED · 0.2 Ω", bad: "OPEN · OL" },
    { id: "lpc", name: "Low pressure control", good: "CLOSED · 0.3 Ω", bad: "OPEN · OL" },
    { id: "hpc", name: "High pressure control", good: "CLOSED · 0.3 Ω", bad: "OPEN · OL" },
    { id: "coil", name: "Contactor coil", good: "Coil · 14 Ω", bad: "OPEN · OL" },
    { id: "ol", name: "Overload", good: "CLOSED · 0.2 Ω", bad: "OPEN · OL" },
    { id: "run", name: "Run capacitor", good: "In circuit · µF on the can", bad: "OPEN · no µF" },
    { id: "pot", name: "Potential relay", good: "Start contacts make, then open", bad: "Start contacts stay shut" },
    { id: "start", name: "Start capacitor", good: "In only while starting", bad: "In only while starting" },
    { id: "ss", name: "Solid state current relay", good: "Not in this circuit", bad: "Not in this circuit" },
    { id: "defrost", name: "Defrost timer", good: "On cool · compressor allowed", bad: "On cool · compressor allowed" },
    { id: "crank", name: "Crankcase heater", good: "Heater ohms · not the start circuit", bad: "Heater ohms · not the start circuit" },
  ];

  const SPLIT = [
    {
      q: "The plate on the TU-601 says which refrigerant?",
      choices: ["R-22", "R-134a", "R-410A only", "R-454B"],
      a: 2,
      why: "The plate says USE R-410A REFRIGERANT ONLY. Do not put R-22 in it.",
    },
    {
      q: "What power does that same plate call for?",
      choices: ["120 V, 15 A", "208/240 V, 20 A, 60 Hz", "24 V only", "460 V, 3 phase"],
      a: 1,
      why: "208/240 V, 20 A, 60 Hz. This is not a 24-volt stat circuit.",
    },
    {
      q: "Which box is the outdoor unit on this trainer?",
      choices: ["The ceiling cassette", "The Daikin condenser on the floor", "The gas boiler", "The TU-522 fault board"],
      a: 1,
      why: "The Daikin outdoor unit is on the floor. The cassette in the rack is an indoor head.",
    },
    {
      q: "This is a multi-head unit. What does that mean on the copper?",
      choices: [
        "One line set feeds every room",
        "Each indoor head has its own pair of copper",
        "The boiler pipe is the suction line",
        "You only need the high-side hose",
      ],
      a: 1,
      why: "Multi-head means a line set per head. Cross two rooms and one of them never cools.",
    },
    {
      q: "Can you pull the Daikin controller and land a 24-volt Nest?",
      choices: [
        "Yes, any smart stat works",
        "No. This head speaks the unit's own control, not R W Y G",
        "Yes, if you add a C wire",
        "Only if the refrigerant is R-134a",
      ],
      a: 1,
      why: "A mini-split is not a 24-volt furnace. Use the Daikin control. A Nest does not run this compressor.",
    },
    {
      q: "The four gauges on the copper rack. Which hose is the low side?",
      choices: ["Red", "Blue", "Yellow", "Either red or blue"],
      a: 1,
      why: "Blue is suction, the low side. Red is the high side. Yellow is the center, the hose you charge or recover with.",
    },
  ];

  const BOILER = [
    {
      q: "The TU-210G plate says this trainer is a what?",
      choices: ["Mini-split", "Gas boiler, hydronic heat", "R-410A condenser", "Compressor fault board"],
      a: 1,
      why: "MODEL TU-210G GAS BOILER. HYDRONIC HEATING TRAINING UNIT. North Park Innovations, Ellicottville, NY.",
    },
    {
      q: "What moves the heat in this unit?",
      choices: ["R-410A", "R-134a", "Water", "The same gauges as the mini-split"],
      a: 2,
      why: "Hydronic means water. Do not hook a manifold to that copper.",
    },
    {
      q: "The white receptacle on the cabinet is what?",
      choices: [
        "The gas valve",
        "A 120 V convenience outlet, not the gas circuit",
        "The high pressure control",
        "The compressor common",
      ],
      a: 1,
      why: "That duplex is a wall outlet on the cabinet. It is not the gas valve and it is not the circulator circuit.",
    },
    {
      q: "Before anyone opens a gas valve on this boiler, what has to be true?",
      choices: [
        "The system is charged with R-410A",
        "Water is in the boiler and the high limit is closed",
        "The potential relay has dropped out",
        "The Nest app is online",
      ],
      a: 1,
      why: "A dry boiler and an open high limit are how a gas boiler gets hurt. Prove water. Prove the limit. Then gas.",
    },
    {
      q: "The big copper leaving the cabinet is a what?",
      choices: ["Suction line", "Liquid line", "Hydronic pipe", "Discharge to the Daikin"],
      a: 2,
      why: "That pipe carries water. It is not a refrigeration line. Do not braze it like a line set.",
    },
  ];

  const GUIDE = [
    {
      title: "Three trainers, two places",
      real: "In the lab you have three separate machines. TU-522 is the compressor fault board. TU-601 is the mini-split. TU-210G is the gas boiler. They do not share refrigerant, and they do not share a procedure.",
      here: "On this screen those are the three tabs. Start on TU-522. The other two are questions taken off the plates on the real trainers.",
    },
    {
      title: "TU-522 on the bench",
      real: "R-134a only. Read the silk screen before you pull a wire. If the contactor is out, meter the control string. If the contactor is in and the compressor is quiet or humming, meter the load. Never jumper a pressure control to make it run.",
      here: "HUB marks one part. Tap it. That tap is the meter. Closed means leave it and go to the next mark. Open means tap that same part again and call the fault. Tapping a good part does not clear the ticket.",
    },
    {
      title: "Which part is next",
      real: "Contactor out: temperature control, manual pump-down, low-pressure control, high-pressure control, then the contactor coil. Contactor in: overload, run capacitor, potential relay. The start capacitor is only in the circuit while it is starting.",
      here: "The virtual board uses that same order. The solid-state relay is on the screen because it is on the real board. It is not in this circuit. Do not chase it.",
    },
    {
      title: "TU-601 on the floor",
      real: "Read the plate out loud before a hose goes on. R-410A only. 208/240 volts, 20 amps, 60 hertz. The Daikin on the floor is the outdoor unit. The cassette in the rack is an indoor head. Each head has its own line set. Do not land a Nest. This unit does not speak R, W, Y, G.",
      here: "The tab is the plate, one question at a time. A wrong answer stays there and tells you why. It does not skip you ahead.",
    },
    {
      title: "Gauges on the TU-601 rack",
      real: "Blue hose is suction, the low side. Red is liquid, the high side. Yellow is the utility hose. Handles closed means you are only reading. Do not open the yellow hose into the room.",
      here: "One question asks which hose is the low side. The answer is blue, same as the manifold on the rack.",
    },
    {
      title: "TU-210G, the boiler",
      real: "This is a gas hydronic boiler from North Park Innovations, Ellicottville, New York. The heat moves in water. The white duplex on the cabinet is a convenience outlet, not the gas valve. Prove there is water in the boiler and the high limit is closed before anyone opens gas. Do not hook gauges to that copper, and do not braze it like a line set.",
      here: "The questions are that plate. If an answer says refrigerant, it is wrong. The big copper is a water pipe.",
    },
    {
      title: "How you leave the bay",
      real: "Caps back on. Tools off the trainer. Take the lock off only when the instructor says the bay is clear. The next class finds the same three machines you found.",
      here: "Shop floor brings you back here. Three called faults on the TU-522 finishes the virtual lab. Then go do that same order on the real board.",
    },
  ];

  function start(root) {
    if (!root) return;
    let tab = "tu522";
    let fault = FAULTS[Math.floor(Math.random() * FAULTS.length)];
    let metered = {};
    let found = 0;
    let splitI = 0;
    let boilI = 0;
    let note = "";
    let hub = "I'm HUB. Same boards as the lab. Meter first. Call the fault second. No jumping a safety to make it run.";
    let showGuide = true;
    let guideI = 0;

    const CONTROL = ["tstat", "pump", "lpc", "hpc", "coil"];
    const LOAD = ["ol", "run", "pot"];

    function order() {
      return CONTROL.indexOf(fault.id) >= 0 ? CONTROL : LOAD;
    }

    function nextId() {
      const list = order();
      for (let i = 0; i < list.length; i++) {
        if (!metered[list[i]]) return list[i];
      }
      return fault.id;
    }

    function partName(id) {
      const p = PARTS.find((x) => x.id === id);
      return p ? p.name : id;
    }

    function hubCard() {
      return (
        '<div class="ic-hub">' +
        '<img src="hub-portrait.jpg?v=3" alt="Professor HUB" />' +
        "<div><p class=\"eyebrow\">Professor HUB</p><p>" +
        hub +
        "</p></div></div>"
      );
    }

    function nextFault(praise) {
      const pool = FAULTS.filter((f) => f.id !== fault.id);
      fault = pool[Math.floor(Math.random() * pool.length)];
      metered = {};
      note = "";
      const startAt = partName(order()[0]);
      hub = (praise || "Called it.") + " New ticket. I marked " + startAt + ". " + fault.say;
    }

    function paint() {
      const tabs =
        '<div class="ic-tabs">' +
        btn("tu522", "TU-522 fault board") +
        btn("tu601", "TU-601 mini-split") +
        btn("tu210", "TU-210G boiler") +
        "</div>";
      root.innerHTML =
        '<header class="hub-head ic-head">' +
        "<div><p class=\"eyebrow\">iConnect · " + ((window.LtBrand && window.LtBrand.org) || "HVAC Legends") + "</p><h2>Virtual trainers</h2></div>" +
        '<button type="button" class="btn" id="ic-how">How to use it</button>' +
        '<button type="button" class="btn" id="ic-back">Shop floor</button></header>' +
        tabs +
        '<div class="ic-body">' +
        (showGuide ? guideCard() : hubCard() + (tab === "tu522" ? board() : tab === "tu601" ? quiz(SPLIT, splitI, "tu601") : quiz(BOILER, boilI, "tu210"))) +
        "</div>";
      root.querySelector("#ic-back").onclick = () => {
        if (typeof window.ltPlay === "function") window.ltPlay("hub");
        else if (window.ltGo) window.ltGo("hub");
      };
      const how = root.querySelector("#ic-how");
      if (how) how.onclick = () => {
        showGuide = true;
        guideI = 0;
        paint();
      };
      root.querySelectorAll(".ic-tabs [data-tab]").forEach((b) => {
        b.onclick = () => {
          showGuide = false;
          tab = b.getAttribute("data-tab");
          note = "";
          if (tab === "tu522") hub = "TU-522. R-134a only. " + fault.say + " I marked the first part. Meter that one.";
          else if (tab === "tu601") hub = "TU-601. Read the plate out loud before you touch a hose. R-410A only. 208/240. The Daikin is the outdoor unit.";
          else hub = "TU-210G. Gas boiler. Water, not refrigerant. If you hook gauges to that copper, you and I are going to talk.";
          paint();
        };
      });
      if (showGuide) {
        bindGuide();
        return;
      }
      if (tab === "tu522") bindBoard();
      else bindQuiz(tab === "tu601" ? SPLIT : BOILER, tab);
    }

    function guideCard() {
      const g = GUIDE[guideI];
      return (
        '<article class="ic-guide">' +
        '<p class="eyebrow">Real lab and this screen · ' + (guideI + 1) + " / " + GUIDE.length + "</p>" +
        "<h3>" + g.title + "</h3>" +
        '<p class="ic-where">In the lab</p><p>' + g.real + "</p>" +
        '<p class="ic-where">On this screen</p><p>' + g.here + "</p>" +
        '<div class="ms-actions">' +
        '<button type="button" class="btn" id="ic-gback"' + (guideI === 0 ? " disabled" : "") + ">Back</button>" +
        '<button type="button" class="btn primary" id="ic-gnext">' + (guideI === GUIDE.length - 1 ? "Start on the TU-522" : "Next") + "</button>" +
        "</div></article>"
      );
    }

    function bindGuide() {
      const back = root.querySelector("#ic-gback");
      const next = root.querySelector("#ic-gnext");
      if (back) back.onclick = () => {
        if (guideI > 0) guideI -= 1;
        paint();
      };
      if (next) next.onclick = () => {
        if (guideI < GUIDE.length - 1) {
          guideI += 1;
          paint();
          return;
        }
        showGuide = false;
        tab = "tu522";
        hub = "TU-522. R-134a only. " + fault.say + " The part with HUB on it is your first meter.";
        paint();
      };
    }

    function btn(id, label) {
      return (
        '<button type="button" class="btn' +
        (tab === id ? " primary" : "") +
        '" data-tab="' +
        id +
        '">' +
        label +
        "</button>"
      );
    }

    function board() {
      const hint = nextId();
      const cells = PARTS.map((p) => {
        const reading = metered[p.id];
        const mark = !reading && p.id === hint ? " next" : "";
        return (
          '<button type="button" class="ic-part' +
          (reading ? " on" : "") +
          mark +
          '" data-part="' +
          p.id +
          '"><strong>' +
          p.name +
          (p.id === hint && !reading ? " · HUB" : "") +
          "</strong><span>" +
          (reading || "Tap to meter") +
          "</span></button>"
        );
      }).join("");
      return (
        '<p class="ic-plate">TU-522 · single phase · compressor control board with faults · R-134a only. Same silk screen as the board on the bench.</p>' +
        '<p class="ic-say"><b>Ticket.</b> ' +
        fault.say +
        "</p>" +
        '<p class="ic-found">Found ' +
        found +
        " of 3</p>" +
        '<div class="ic-grid">' +
        cells +
        "</div>" +
        '<p class="ic-note">' +
        (note || "Meter the string. Then mark the open part. Do not jumper a safety to make it run.") +
        "</p>"
      );
    }

    function bindBoard() {
      root.querySelectorAll("[data-part]").forEach((el) => {
        el.onclick = () => {
          const id = el.getAttribute("data-part");
          const part = PARTS.find((p) => p.id === id);
          if (!metered[id]) {
            metered[id] = id === fault.id ? part.bad : part.good;
            if (id === fault.id) {
              hub = part.name + " reads " + metered[id] + ". That's the ghost. Tap it again and call it out loud.";
              note = part.name + " reads " + metered[id] + ".";
            } else {
              const nxt = partName(nextId());
              hub = part.name + " reads in range. Leave it. Next one I marked: " + nxt + ".";
              note = part.name + " reads " + metered[id] + ".";
            }
            paint();
            return;
          }
          if (id === fault.id) {
            found += 1;
            const praise = found >= 3
              ? "Bay clear. Three faults and you did not jump a safety. Show the real TU-522 that same order."
              : "Yes. " + fault.why;
            if (found >= 3 && window.CurriculumTrain) window.CurriculumTrain.stamp("iconnect");
            if (found >= 3) found = 0;
            nextFault(praise);
            paint();
            return;
          }
          hub = id === "ss"
            ? "That relay is on the board so you can see it. It is not in this circuit. Three start methods. Only one is wired."
            : part.name + " is a good part. Techs who change good parts buy the next callback.";
          note = hub;
          paint();
        };
      });
    }

    function quiz(list, i, which) {
      const item = list[i];
      const plate =
        which === "tu601"
          ? "TU-601 · multi-head mini-split heat pump · serial on the lab plate · 208/240 V · 20 A · 60 Hz · R-410A only. Daikin outdoor. Cassette indoor. Copper rack with the gauges is the line-set trainer."
          : "TU-210G · gas boiler · hydronic heating · North Park Innovations Group, Ellicottville, NY · serial 3323. Water, not refrigerant.";
      return (
        '<p class="ic-plate">' +
        plate +
        "</p>" +
        '<p class="ic-say"><b>Q ' +
        (i + 1) +
        " / " +
        list.length +
        ".</b> " +
        item.q +
        "</p>" +
        '<div class="ic-choices">' +
        item.choices
          .map(
            (c, n) =>
              '<button type="button" class="btn ic-choice" data-n="' + n + '">' + c + "</button>"
          )
          .join("") +
        "</div>" +
        '<p class="ic-note">' +
        (note || "Answer from the plate and the rack, not from a guess.") +
        "</p>"
      );
    }

    function bindQuiz(list, which) {
      root.querySelectorAll(".ic-choice").forEach((el) => {
        el.onclick = () => {
          const i = which === "tu601" ? splitI : boilI;
          const item = list[i];
          const n = Number(el.getAttribute("data-n"));
          if (n === item.a) {
            hub = "That's the plate talking. " + item.why;
            note = hub;
            if (i + 1 >= list.length) {
              hub = "Bay clear. Say it back to me once without looking. " + item.why;
              note = hub;
              if (which === "tu601") splitI = 0;
              else boilI = 0;
            } else if (which === "tu601") splitI = i + 1;
            else boilI = i + 1;
          } else {
            hub = "Nope. Stay on the trainer, not the internet. " + item.why;
            note = hub;
          }
          paint();
        };
      });
    }

    hub = "TU-522. R-134a only. " + fault.say + " The part with HUB on it is your first meter.";
    paint();
  }

  window.IConnectLab = { start };
})();
