/* Manifold school — analog set, hose hookup, superheat / subcooling.
   Blue = suction. Red = liquid. Yellow = utility. Valves seated to READ. */
(function (global) {
  "use strict";
  function landTurn(screenId) {
    try {
      if (sessionStorage.getItem("land-upright-off")) return;
    } catch (e) {}
    var cssId = "land-css-" + screenId;
    if (!document.getElementById(cssId)) {
      var st = document.createElement("style");
      st.id = cssId;
      st.textContent = ".land-turn{display:none}@media (orientation:landscape) and (max-height:500px){body.land-on:has(#" + screenId + ".active) .land-turn{display:flex;position:fixed;z-index:220;inset:0;align-items:center;justify-content:center;padding:8px;background:rgba(8,10,12,.55);color:#f6f0e2;box-sizing:border-box}body.land-on:has(#" + screenId + ".active) .land-card{display:flex;flex-direction:column;align-items:center;gap:4px;width:min(200px,52vw);padding:8px 10px;background:#1c2126;border:1px solid #e8c450;border-radius:12px;text-align:center}body.land-on:has(#" + screenId + ".active) .land-phone{width:22px;height:36px;border:2px solid #e8c450;border-radius:6px;position:relative}body.land-on:has(#" + screenId + ".active) .land-phone:before{content:\"\";position:absolute;left:50%;bottom:3px;width:10px;height:2px;margin-left:-5px;background:#e8c450;border-radius:2px}body.land-on:has(#" + screenId + ".active) .land-turn strong{font:700 15px/1.2 system-ui,sans-serif;color:#fff}body.land-on:has(#" + screenId + ".active) .land-turn span{font:600 12px/1.3 system-ui,sans-serif;color:#d7d0c4;max-width:180px}body.land-on:has(#" + screenId + ".active) .land-turn button{min-height:32px;margin-top:2px;padding:0 10px;background:transparent;color:#f6f0e2;border:1px solid #6d5b3c;border-radius:8px;cursor:pointer;font:600 13px system-ui,sans-serif}}";
      document.head.appendChild(st);
    }
    document.body.classList.add("land-on");
    if (!document.getElementById("land-turn")) {
      var bar = document.createElement("div");
      bar.className = "land-turn";
      bar.id = "land-turn";
      bar.innerHTML = "<div class=\"land-card\"><div class=\"land-phone\" aria-hidden=\"true\"></div><strong>Turn the phone upright</strong><span>Rotate it. This card goes away on its own.</span><button type=\"button\" id=\"land-dismiss-btn\">Stay sideways</button></div>";
      document.body.appendChild(bar);
      document.getElementById("land-dismiss-btn").addEventListener("click", function () {
        try { sessionStorage.setItem("land-upright-off", "1"); } catch (e2) {}
        document.body.classList.remove("land-on");
        bar.remove();
      });
    }
  }
  function floorFit(id, css) {
    let st = document.getElementById(id);
    if (!st) { st = document.createElement("style"); st.id = id; document.head.appendChild(st); }
    st.textContent = css;
    document.head.appendChild(st);
    function bump() { if (st.parentNode) document.head.appendChild(st); }
    requestAnimationFrame(bump);
    setTimeout(bump, 80);
    setTimeout(bump, 400);
  }

  const PT = {
    "R-410A": [
      [-40, 10.8], [-20, 24.8], [0, 48.6], [20, 78.3], [32, 101.0],
      [35, 107.0], [40, 118.0], [45, 130.0], [50, 142.0], [55, 155.0],
      [60, 170.0], [70, 201.0], [80, 235.0], [90, 274.0], [95, 295.0],
      [100, 317.0], [105, 340.0], [110, 365.0], [115, 391.0], [120, 418.0],
      [125, 446.0], [130, 476.0], [140, 539.0],
    ],
    "R-22": [
      [-40, 0.5], [-20, 10.1], [0, 24.0], [20, 43.0], [32, 57.5],
      [40, 68.5], [45, 76.0], [50, 84.0], [60, 101.6], [70, 121.4],
      [80, 143.6], [90, 168.4], [100, 195.9], [110, 226.4], [115, 242.8],
      [120, 260.0], [130, 297.0], [140, 337.0], [150, 381.0],
    ],
    "R-134a": [
      [-40, -7.4], [-30, -3.0], [-20, 0.6], [-10, 1.9], [0, 6.5],
      [10, 12.0], [20, 18.4], [30, 26.1], [32, 27.8], [40, 35.0],
      [50, 45.4], [60, 57.4], [70, 71.1], [80, 86.7], [90, 104.3],
      [100, 124.2], [110, 146.4], [120, 171.1], [130, 198.7], [140, 229.0],
      [150, 263.0],
    ],
    "R-32": [
      [-40, 11.0], [-20, 26.8], [0, 49.3], [20, 80.0], [30, 99.1],
      [32, 103.2], [40, 121.0], [50, 145.8], [60, 174.0], [70, 205.8],
      [80, 241.5], [90, 281.3], [100, 325.7], [110, 374.9], [120, 429.3],
      [130, 489.5], [140, 555.8], [150, 628.8],
    ],
    "R-454B": [
      [-40, 9.5], [-20, 24.3], [0, 45.3], [20, 74.0], [30, 91.7],
      [32, 95.7], [40, 111.9], [50, 135.0], [60, 161.0], [70, 190.4],
      [80, 223.3], [90, 260.0], [100, 300.8], [110, 346.0], [120, 395.9],
      [130, 450.9], [140, 511.3], [150, 577.4],
    ],
  };

  function chartOf(ref) {
    if (global.PtChart && global.PtChart.TABLES && global.PtChart.TABLES[ref]) {
      return global.PtChart.TABLES[ref].rows;
    }
    return PT[ref] || PT["R-410A"];
  }

  function satP(ref, tF) {
    if (global.PtChart && global.PtChart.satP) return global.PtChart.satP(ref, tF);
    const chart = chartOf(ref);
    if (tF <= chart[0][0]) return chart[0][1];
    if (tF >= chart[chart.length - 1][0]) return chart[chart.length - 1][1];
    for (let i = 0; i < chart.length - 1; i++) {
      const t0 = chart[i][0], p0 = chart[i][1];
      const t1 = chart[i + 1][0], p1 = chart[i + 1][1];
      if (tF >= t0 && tF <= t1) return p0 + ((tF - t0) / (t1 - t0)) * (p1 - p0);
    }
    return chart[0][1];
  }

  function satT(ref, p) {
    if (global.PtChart && global.PtChart.satT) return global.PtChart.satT(ref, p);
    const chart = chartOf(ref);
    if (p <= chart[0][1]) return chart[0][0];
    if (p >= chart[chart.length - 1][1]) return chart[chart.length - 1][0];
    for (let i = 0; i < chart.length - 1; i++) {
      const t0 = chart[i][0], p0 = chart[i][1];
      const t1 = chart[i + 1][0], p1 = chart[i + 1][1];
      if (p >= p0 && p <= p1) return t0 + ((p - p0) / (p1 - p0)) * (t1 - t0);
    }
    return chart[0][0];
  }

  function glideOf(ref) {
    return ref === "R-454B" ? 2.2 : 0;
  }

  function satTDew(ref, p) {
    if (global.PtChart && global.PtChart.satTDew) return global.PtChart.satTDew(ref, p);
    return satT(ref, p) + glideOf(ref);
  }

  function satTBubble(ref, p) {
    if (global.PtChart && global.PtChart.satTBubble) return global.PtChart.satTBubble(ref, p);
    return satT(ref, p);
  }


  const FINGERPRINTS = [
    { sh: "High", sc: "Low", call: "Undercharge / leak", why: "Starved coil (high SH) and thin liquid (low SC). Find the leak. Don't top off." },
    { sh: "Low", sc: "High", call: "Overcharge", why: "Stacked liquid in the condenser. Recover to the nameplate." },
    { sh: "High", sc: "High", call: "Liquid-line restriction", why: "Drier / kink backs liquid up (SC) and starves the coil (SH). Feel both sides of the drier. Don't add gas." },
    { sh: "Low", sc: "Low / normal", call: "Low indoor airflow", why: "Filter, blower, dirty A-coil. Suction drops, SH collapses, ice. Don't add gas." },
    { sh: "Normal", sc: "About normal + high head", call: "Dirty condenser", why: "Can't reject heat. Wash the coil. Subcooling stays about normal — not an overcharge. Overcharge would be HIGH SC." },
    { sh: "Near 0", sc: "Low", call: "TXV stuck open / flood", why: "Liquid in the suction. Kill it before you wash the compressor." },
    { sh: "High suction, low head", sc: "Low", call: "Weak compressor", why: "Pressures walking toward each other. Amp draw is light. That's the pump." },
  ];

  const READ = [
    {
      id: "nameplate",
      title: "Read the can",
      say: "Nameplate first. This unit is R-410A. Compound on the left, high on the right. 410A fittings are 5/16\" — don't jam a 1/4\" R-22 hose on it.",
      hub: "Wrong refrigerant on the inner ring and you're diagnosing a ghost. Match the jug to the plate.",
    },
    {
      id: "seat",
      title: "Seat the handles",
      say: "Both handwheels CLOSED. Gauges read the hose, not the yellow. Open is how you dump high into low through the center.",
      hub: "Closed to READ. Open to CHARGE, RECOVER, or VAC. Never leave both cracked on a running unit.",
    },
    {
      id: "blue",
      title: "Blue → suction",
      say: "Drag BLUE onto the SUCTION king valve — fat vapor line, bigger port on the outdoor.",
      hub: "Blue is the compound. It reads vacuum AND low-side psig. Put it on the liquid and you peg it. That's a dead gauge.",
    },
    {
      id: "red",
      title: "Red → liquid",
      say: "Drag RED onto the LIQUID king valve — skinny 3/8″ line. That's high-side / liquid pressure.",
      hub: "Red is head / liquid. On a 410A split at 95°F outdoor you're staring at ~350–400 psig. That's normal, not a trip.",
    },
    {
      id: "yellow",
      title: "Yellow stays capped",
      say: "Yellow is utility: the recovery machine or the vacuum pump. No charging cylinder. To READ, drag YELLOW onto the CAP.",
      hub: "Yellow is not a fourth color of pressure. Cap it or you leak the reading into whatever is hanging on the center.",
    },
    {
      id: "purge",
      title: "Purge the hoses",
      say: "Hoses are full of air. Low-loss fittings keep that air out of the reading and keep refrigerant in the system. Do not crack a hose and vent.",
      hub: "Leave the air in and the first reading is a lie — extra head, fake low SC. That's hose air, not the system. Never vent the charge.",
    },
    {
      id: "run",
      title: "Start it and wait",
      say: "Compressor on. In the field you wait 5–10 minutes for SH/SC to settle. Here it settles when you hit Start compressor.",
      hub: "Static (off) both sides equal outdoor sat. That's not a charge. You diagnose a RUNNING system.",
    },
    {
      id: "readp",
      title: "Read the needles",
      say: "Blue = suction psig. Red = liquid psig. Low-side ring is evaporator dew °F. High-side ring is the start of boiling °F. That's saturation — not the pipe temp.",
      hub: "Pressure is only half. Dew from suction pressure. Bubble from liquid pressure. Pipe temp from a clamp. On a blend those are two different columns.",
    },
    {
      id: "clamps",
      title: "Clamp the lines",
      say: "Suction clamp on the big vapor line (after the coil / near the compressor, insulated). Liquid clamp on the small line leaving the condenser, out of the sun.",
      hub: "A clamp in the sun or sitting on the cabinet is a lie. Metal-to-metal, shade, then do the math.",
    },
    {
      id: "math",
      title: "Do the math",
      say: "SH = suction line °F − evap dew °F (saturation from suction pressure). SC = start of boiling °F − liquid line °F. On a blend, the dew point is for the evaporator and the start of boiling is for the condenser. Punch the numbers. TXV is charged by SC. Piston is charged by SH.",
      hub: "One number is a coin flip. High SH with low SC is a leak. High SH with high SC is a restriction. You need both.",
    },
    {
      id: "call",
      title: "Call the system",
      say: "Healthy TXV 410A: SH and SC both sitting ~8–14°F. That's a leave-it-alone charge. Walk the fingerprints if they aren't.",
      hub: "If SH/SC are in band and the house is still hot, it's airflow, duct, or the load — not another pound of 410A.",
    },
  ];

  const FIELD = [
    { id: "look-suc", title: "The big valve", say: "One picture of the real pad. Tap the big suction valve on the condenser. It is the upper brass valve. The fat line. Blue goes here later. Not yet." },
    { id: "look-liq", title: "The small valve", say: "Tap the small liquid valve. Lower brass valve. Skinny line. Red goes here later." },
    { id: "look-mac", title: "The recovery machine", say: "Tap the recovery machine. It has the tank beside it. That machine puts refrigerant in the tank. It is not the vacuum pump." },
    { id: "look-pump", title: "The vacuum pump", say: "Tap the yellow vacuum pump. It pulls the air and water out after the charge is already in the tank." },
    { id: "nameplate", title: "Read the plate", say: "Nothing moves until you read the plate. This unit is R-410A. The tank has to say the same thing. 410A fittings are 5/16. Do not force a 1/4 hose on it.", hub: "Wrong gas in the tank is a contaminated recovery. You do not mix it and you do not vent it." },
    { id: "seat", title: "Both handles shut", say: "Both handwheels seated before the hoses go on. The gauges can see the hoses. The center port cannot. That keeps the charge from blowing out the yellow hose while you hook up.", hub: "Shut to hook up. You open a side only when the machine is ready to take the gas." },
    { id: "blue", title: "Blue on suction", say: "Blue hose on the big suction valve. That is the upper valve on the condenser in the picture. Low-loss fitting. Blue is the compound gauge. It is the only face that can show vacuum later.", hub: "Blue on the liquid valve pegs the compound. That gauge is done." },
    { id: "red", title: "Red on liquid", say: "Red hose on the small liquid valve, the lower one. Crack the service valve so the gauge sees the system. Red is head pressure. It does not go to the vacuum pump.", hub: "Both hoses on, both manifold handles still shut. You are not open to the center yet." },
    { id: "yrec", title: "Yellow to the machine", say: "Yellow hose from the center of the manifold to the recovery machine INLET. In the picture the outlet hose is already on the tank vapor valve. Tank upright, on a scale, stop at 80%.", hub: "Inlet is the system. Outlet is the tank. Backwards and you push tank pressure into the condenser." },
    { id: "loopen", title: "Open the low side", say: "Open the LOW handwheel only. High stays shut. This is vapor recovery. Opening both on a full system can liquid-slug the machine.", hub: "Vapor out the suction. A 3-ton does not get a liquid push-pull on this rep." },
    { id: "recrun", title: "Machine on", say: "Recovery machine ON. Watch the blue needle fall to 0 psig. On a small 410A system that is the 608 level for a modern machine. 0 psig is not 500 microns.", hub: "The charge is going into the tank. You are not dehydrating the system yet." },
    { id: "recoff", title: "Close, then off", say: "Needle is at 0. Close the low handwheel FIRST. Then turn the recovery machine OFF. Machine off with the valve still open lets the tank push gas back in.", hub: "Valve, then the switch. Same order every time." },
    { id: "yvac", title: "Yellow to the pump", say: "Move the yellow hose off the recovery machine and onto the vacuum pump. Tank valve stays shut. The pump does not fill a tank. The system is already empty.", hub: "One machine stores refrigerant. The other boils water out of the pipes. They are not interchangeable." },
    { id: "cores", title: "Cores out", say: "Schrader cores out. A core is a restriction. You will not get to 500 microns with the cores in and a long 1/4 hose. Hit Cores out.", hub: "Cores go back in the port before you ever charge. Not yet. There is no charge." },
    { id: "bothopen", title: "Open both sides", say: "System is empty. Open BOTH handwheels so the pump sees the suction line and the liquid line. Compressor stays OFF. You never start a compressor in a vacuum.", hub: "Both open is right here. Both open on a running charged unit dumps head into the suction hose." },
    { id: "pumpon", title: "Pump on", say: "Vacuum pump ON. The compound gauge drops into inches of mercury. That only proves you left 0 psig. A micron gauge on the system, not on the pump, is the real number. About 500 microns, then a hold.", hub: "A micron gauge on the pump, valved off, proves the pump. It does not prove the pipes." },
    { id: "hold", title: "Isolate and hold", say: "Close both handwheels. That isolates the system from the pump. The needle should sit. If it climbs, you have a leak or the cores are still in. On this rep it holds.", hub: "A number that only looks good while the pump is wide open is the pump, not the system." },
  ];

  const LADDER = [
    { name: "1 · Name it", ids: ["look-suc", "look-liq", "look-mac", "look-pump"] },
    { name: "2 · Two hoses", ids: ["seat", "blue", "red"] },
    { name: "3 · Recover", ids: ["yrec", "loopen", "recrun", "recoff"] },
    { name: "4 · Vacuum", ids: ["yvac", "cores", "bothopen", "pumpon", "hold"] },
  ];

  function guideFor(i) {
    var row = LADDER[i];
    if (!row) return FIELD;
    return row.ids.map(function (id) {
      return FIELD.find(function (s) { return s.id === id; });
    }).filter(Boolean);
  }

  let GUIDE = READ;
  let drill = 0;
  let drillClear = [false, false, false, false];

  const JOBS = [
    {
      id: "healthy",
      title: "Healthy 3-ton 410A TXV",
      brief: "95°F outdoor, 75° indoor, clean coils. Hook up, read SH/SC, don't add gas.",
      ref: "R-410A",
      outdoor: 95,
      indoor: 75,
      metering: "txv",
      fault: "none",
      prompt: "SH and SC both near 10°F on a TXV. Call it.",
      choices: [
        "Undercharged — add a pound",
        "In spec — walk away from the valves",
        "Overcharged — recover some",
        "Restricted drier",
      ],
      answer: 1,
      explain: "TXV is charged by subcooling. ~8–14°F SH and SC on a clean 410A split is a leave-it-alone system.",
    },
    {
      id: "low",
      title: "Barely cools · suction frosting",
      brief: "2.5-ton piston. Runs all day, barely cools. Suction line sweating hard.",
      ref: "R-410A",
      outdoor: 88,
      indoor: 76,
      metering: "piston",
      fault: "undercharge",
      prompt: "High SH, low SC, both pressures down. First honest call?",
      choices: [
        "Undercharge / leak — find it before you weigh in",
        "Overcharge",
        "Dirty condenser",
        "TXV stuck open",
      ],
      answer: 0,
      explain: "Starved evaporator (high SH) and a thin liquid line (low SC) is low charge. Do not top off a leaker.",
    },
    {
      id: "over",
      title: "New install · HPC tripped once",
      brief: "3-ton TXV. High-pressure switch kicked once. Outdoor coil is clean.",
      ref: "R-410A",
      outdoor: 92,
      indoor: 74,
      metering: "txv",
      fault: "overcharge",
      prompt: "Head high, SC high, SH still in band. That's…",
      choices: [
        "Dirty condenser",
        "Undercharge",
        "Overcharge — recover to nameplate",
        "Restricted indoor filter",
      ],
      answer: 2,
      explain: "Extra liquid stacked in the condenser raises SC and head. A dirty condenser raises head with subcooling about normal — not an overcharge.",
    },
    {
      id: "dirtyod",
      title: "Restaurant roof · roaring ODU",
      brief: "Fins packed with grease. Unit screaming. Don't touch the charge yet.",
      ref: "R-410A",
      outdoor: 91,
      indoor: 75,
      metering: "txv",
      fault: "dirty_cond",
      prompt: "High head, SC about normal. Air-starved condenser or overcharge?",
      choices: [
        "Overcharge — recover",
        "Dirty condenser / no outdoor air — wash it",
        "Low charge",
        "Bad TXV",
      ],
      answer: 1,
      explain: "Lint and grease kill outdoor airflow. Head climbs, subcooling stays about normal. Not an overcharge — wash it. Don't add gas.",
    },
    {
      id: "restrict",
      title: "Drier never changed after a burnout",
      brief: "TXV split. High SH AND high SC. Suction low, head not collapsed.",
      ref: "R-410A",
      outdoor: 90,
      indoor: 75,
      metering: "txv",
      fault: "restricted",
      prompt: "High SH and high SC at the same time usually means…",
      choices: [
        "Undercharge",
        "Overcharge",
        "Restriction in the liquid line / drier",
        "Oversized TXV",
      ],
      answer: 2,
      explain: "Restriction backs liquid up (high SC) and starves the coil (high SH). Don't add refrigerant. Replace the drier after recovery and vacuum.",
    },
    {
      id: "airflow",
      title: "Iced A-coil · filter looks like a rug",
      brief: "House 78°, supply barely moving. Suction line a popsicle.",
      ref: "R-410A",
      outdoor: 90,
      indoor: 78,
      metering: "txv",
      fault: "dirty_evap",
      prompt: "Low suction, superheat collapsed toward 0, ice on the indoor coil. Next move?",
      choices: [
        "Add 410A until SH comes up",
        "Airflow — filter / coil / blower. Don't add gas",
        "Replace the TXV",
        "Recover the whole charge",
      ],
      answer: 1,
      explain: "Starved for AIR, not gas. High indoor TD + ice = low CFM. Filter first. Charging an iced coil is how you flood it later.",
    },
    {
      id: "weak",
      title: "Runs forever, never gets cold",
      brief: "Amp draw is light. Suction and head are walking toward each other.",
      ref: "R-410A",
      outdoor: 95,
      indoor: 78,
      metering: "txv",
      fault: "weak_comp",
      prompt: "High suction, low head, low SC, lazy amps. That's…",
      choices: [
        "Undercharge",
        "Dirty condenser",
        "Weak compressor / valves",
        "Overcharge",
      ],
      answer: 2,
      explain: "Gauges look like the opposite of a restriction. The pump isn't pumping. Amp draw confirms it.",
    },
  ];

  function simulate(job, running, purged, refName) {
    const ref = refName || job.ref || "R-410A";
    const outdoor = job.outdoor;
    const indoor = job.indoor;
    const tgtSH = job.metering === "piston" ? 12 : 10;
    const tgtSC = 10;
    let condSat = outdoor + 18;
    let evapSat = indoor - 35;
    let sh = tgtSH;
    let sc = tgtSC;
    let status = "Cycle running.";
    let fp = "HUB: SH and SC together.";

    switch (job.fault) {
      case "undercharge":
        evapSat -= 18;
        condSat -= 28;
        sh = 32;
        sc = 1;
        status = "Both sides low. High superheat, almost no subcooling. Find the leak before you weigh in.";
        fp = "HUB: LOW/LOW + high SH + low SC = undercharge. Find the leak.";
        break;
      case "overcharge":
        evapSat += 2;
        condSat += 35;
        sh = job.metering === "piston" ? 4 : 8;
        sc = 22;
        status = ref === "R-410A"
          ? "Head is up near the high-pressure switch. A 410A switch often opens around 610 psig. Subcooling is stacked. Recover to the nameplate."
          : "Head is up and subcooling is stacked on " + ref + ". Extra liquid in the condenser. Recover to the nameplate. The switch setting follows this refrigerant, not the 410A number.";
        fp = "HUB: HIGH SC is overcharge. SH will lie to you on a TXV.";
        break;
      case "dirty_cond":
        condSat += 28;
        sc = 11;
        sh = tgtSH;
        status = "Head is high. Subcooling stays about normal. That is a dirty outdoor coil, not an overcharge. Wash it. Don't add gas.";
        fp = "HUB: high head + SC in band = condenser airflow. Overcharge would be HIGH SC.";
        break;
      case "restricted":
        evapSat -= 22;
        sh = 32;
        sc = 24;
        status = "Suction is low. Head is still about where this outdoor temperature says it should be. High superheat and high subcooling together is a liquid-line restriction.";
        fp = "HUB: HIGH SH + HIGH SC = restriction. Feel both sides of the drier. Don't add gas.";
        break;
      case "dirty_evap":
        evapSat -= 22;
        sh = 0;
        sc = 10;
        status = "Suction is low and superheat is at 0. The suction line is at saturation, so it ices. Filter, coil, or blower. Don't add gas.";
        fp = "HUB: SH toward 0 = starved for AIR, not gas. Don't add gas.";
        break;
      case "weak_comp":
        evapSat += 22;
        condSat -= 28;
        sh = 16;
        sc = 2;
        status = "Suction is high and head is low. The two needles are walking toward each other. Light amps. The compressor is not pumping.";
        fp = "HUB: opposite of a restriction. Amp draw is low. That's the pump.";
        break;
      default:
        status = "Healthy " + ref + " · SH/SC in band.";
        fp = "HUB: SH/SC in band. That's a charged, breathing system.";
        break;
    }

    if (!purged && running) {
      // A couple degrees of hose air — still inside a normal 95°F 410A head (~370–400).
      condSat += 2;
      sc = Math.max(0, sc - 4);
    }

    const staticP = satP(ref, outdoor);
    if (!running) {
      return {
        running: false,
        pLow: staticP,
        pHigh: staticP,
        tSatLow: outdoor,
        tSatHigh: outdoor,
        tSuction: outdoor,
        tLiquid: outdoor,
        sh: 0,
        sc: 0,
        tgtSH,
        tgtSC,
        status: "Static " + Math.round(staticP) + " psig both sides · sitting at " + outdoor + "°F outdoor.",
        fp: "HUB: equalized is normal OFF. Start it, then read SH and SC together.",
      };
    }

    const pHigh = satP(ref, condSat);
    const pLow = Math.max(0, satP(ref, evapSat));
    const tSatHigh = satTBubble(ref, pHigh);
    const tSatLow = satTDew(ref, pLow);
    return {
      running: true,
      pLow,
      pHigh,
      tSatLow,
      tSatHigh,
      tSuction: tSatLow + sh,
      tLiquid: tSatHigh - sc,
      sh,
      sc,
      tgtSH,
      tgtSC,
      status:
        "Suction " + Math.round(pLow) + " psig (" + Math.round(tSatLow) + "°F sat) · head " +
        Math.round(pHigh) + " psig (" + Math.round(tSatHigh) + "°F sat). " + status,
      fp,
    };
  }

  function GaugeSchool(host, opts) {
    floorFit("gs-floor-fit", [
      "@media (max-width:720px){",
      "#screen-gauges.screen.active{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}",
      "#screen-gauges .gs-lab{display:flex!important;flex-direction:column!important;gap:4px!important;height:100dvh!important;max-height:100dvh!important;overflow:auto!important;padding:2px 8px 8px!important;box-sizing:border-box!important}",
      "#screen-gauges .gs-head{flex:0 0 auto!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:4px!important;max-height:40px!important;overflow-x:auto!important;overflow-y:hidden!important;margin:0!important;padding-right:8px!important}",
      "#screen-gauges .gs-head .btn,#screen-gauges .gs-modes .btn,#screen-gauges .gs-drills button{height:32px!important;min-height:32px!important;max-height:32px!important;padding:4px 8px!important;line-height:1!important}",
      "#screen-gauges .gs-head .brand-bar{display:none!important}",
      "#screen-gauges .gs-modes,#screen-gauges .gs-drills{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:4px!important;margin:0!important;max-height:36px!important}",
      "#screen-gauges .gs-bench{display:flex!important;flex-direction:column!important;gap:4px!important;margin:0!important;min-width:0!important}",
      "#screen-gauges .gs-scene{order:-1!important;display:block!important;position:relative!important;z-index:4!important;width:100%!important;height:auto!important;max-height:none!important;aspect-ratio:16/9!important;margin:0!important;overflow:visible!important;flex:0 0 auto!important}",
      "#screen-gauges .gs-lab.is-read .gs-scene{height:auto!important;max-height:none!important;aspect-ratio:16/9!important}",
      "#screen-gauges .gs-scene img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important}",
      "#screen-gauges .gs-valve{min-width:64px!important;min-height:44px!important}",
      "#screen-gauges .gs-acts .btn[hidden]{display:none!important}",
      "#screen-gauges .gs-arrow{opacity:0!important}#screen-gauges .gs-arrow.on{opacity:1!important}",
      "#screen-gauges .gs-stepcap{position:absolute!important;left:8px!important;top:8px!important;z-index:7!important;margin:0!important;padding:4px 8px!important;border-radius:8px!important;background:rgba(12,10,8,.9)!important;color:#f5d76e!important;font:700 14px/1.2 system-ui,sans-serif!important;pointer-events:none!important}",
      "#screen-gauges .gs-drag-hint,#screen-gauges .gs-check{display:none!important}",
      "#screen-gauges .gs-acts{order:1!important}",
      "#screen-gauges .gs-lab > :not(.gs-head):not(.gs-bench):not(.gs-acts){order:3!important}",
      "#screen-gauges #gs-canvas{width:min(100%,320px)!important;max-height:160px!important;height:auto!important;aspect-ratio:2/1!important;margin:0 auto!important}",
      "body:has(#screen-gauges.active) #drip-ear{display:none!important}",
      "#screen-gauges .brand-bar{margin-top:0!important}",
      "#screen-gauges .gs-drills{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;max-height:36px!important}",
      "#screen-gauges .gs-read{gap:4px!important}",
      "#screen-gauges .gs-read div{padding:2px 6px!important}",
      "#screen-gauges .gs-read strong{font-size:16px!important;line-height:1.1!important}",
      "#screen-gauges #gs-stuck{min-height:32px!important;padding:4px 8px!important}",
      "body:has(#screen-gauges.active) .walk-chip{top:52px!important;bottom:auto!important;right:8px!important;left:auto!important;width:auto!important;max-width:160px!important;max-height:36px!important}",
      "body:has(#screen-gauges.active) #pf-coach-open,body:has(#screen-gauges.active) .pf-coach{top:54px!important;bottom:auto!important;right:8px!important;left:auto!important;width:auto!important;max-width:120px!important;max-height:36px!important}",
      "body:has(#screen-gauges.active) #toast-host{top:auto!important;bottom:8px!important;right:8px!important;left:auto!important;width:min(150px,42vw)!important}",
      "#screen-gauges .gs-reads{display:flex!important;flex-wrap:nowrap!important;gap:8px!important;overflow-x:auto!important;overflow-y:hidden!important;width:100%!important;max-width:100%!important;min-width:0!important;-webkit-overflow-scrolling:touch!important;margin:0 0 8px!important}",
      "#screen-gauges .gs-readcard{flex:0 0 148px!important;min-width:148px!important;max-width:148px!important}",
      "}",
      "@media (min-width:721px) and (max-height:820px){",
      "#screen-gauges .gs-scene{max-height:110px!important;height:110px!important;width:min(100%,calc(110px * 16 / 9))!important}",
      "#screen-gauges .gs-scene img{max-height:110px!important;height:110px!important;object-fit:contain!important}",
      "#screen-gauges .gs-lab{max-height:100dvh!important;overflow:auto!important}",
      "}",
      "@media (orientation:landscape) and (max-height:500px){",
      "#screen-gauges.screen.active{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}",
      "#screen-gauges .gs-lab{display:flex!important;flex-direction:column!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;gap:2px!important;padding:6px 6px 4px!important;box-sizing:border-box!important;max-width:100%!important}",
      "#screen-gauges .gs-head{flex:0 0 auto!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:6px!important;max-height:40px!important;overflow-x:auto!important;overflow-y:hidden!important;padding-right:248px!important;box-sizing:border-box!important}",
      "#screen-gauges .gs-head .brand-bar,#screen-gauges .gs-head a,#screen-gauges .gs-drag-hint,#screen-gauges .gs-prints,#screen-gauges .gs-formula,#screen-gauges .gs-meaning,#screen-gauges .gs-hub,#screen-gauges .gs-pt,#screen-gauges .gs-reads,#screen-gauges .gs-practice,#screen-gauges .gs-math,#screen-gauges .gs-call,#screen-gauges .gs-banner{display:none!important}",
      "#screen-gauges .gs-modes,#screen-gauges .gs-drills{display:flex!important;flex-wrap:nowrap!important;margin:0!important;gap:4px!important}",
      "#screen-gauges .gs-bench{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:row!important;align-items:stretch!important;gap:6px!important;overflow:hidden!important;margin:0!important;max-width:100%!important}",
      "#screen-gauges .gs-manifold{flex:0 0 42%!important;min-width:0!important;max-width:42%!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;overflow:hidden!important;margin:0!important}",
      "#screen-gauges #gs-canvas{position:relative!important;top:auto!important;width:min(100%,220px)!important;max-width:100%!important;height:auto!important;max-height:110px!important;aspect-ratio:2/1!important;margin:0 auto!important;object-fit:contain!important}",
      "#screen-gauges .gs-hoses{display:flex!important;flex-wrap:nowrap!important;gap:4px!important}",
      "#screen-gauges .gs-hose{flex:1 1 0!important;min-height:32px!important;padding:2px!important}",
      "#screen-gauges .gs-hose svg{height:14px!important;width:100%!important}",
      "#screen-gauges .gs-hose span{font-size:11px!important}",
      "#screen-gauges .gs-y{min-height:30px!important;padding:2px 6px!important;font-size:12px!important}",
      "#screen-gauges .gs-scene{display:block!important;flex:0 1 auto!important;align-self:center!important;position:relative!important;height:100%!important;width:auto!important;max-width:58%!important;max-height:100%!important;aspect-ratio:16/9!important;margin:0!important;overflow:hidden!important}",
      "#screen-gauges .gs-scene img{width:100%!important;height:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important}",
      "#screen-gauges .sf-row{display:flex!important;flex:0 0 auto!important;gap:6px!important;margin:0!important}",
      "#screen-gauges .sf-face{padding:2px 8px!important}",
      "#screen-gauges .sf-face strong{font-size:18px!important}",
      "#screen-gauges .gs-ref{display:flex!important;flex:0 0 auto!important;margin:0!important;font-size:12px!important}",
      "#screen-gauges .gs-coach{display:block!important;flex:0 0 auto!important;max-height:28px!important;overflow:hidden!important;margin:0!important;font-size:13px!important}",
      "#screen-gauges .gs-acts,#screen-gauges .gs-nav{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;flex:0 0 auto!important;gap:6px!important;max-height:38px!important}",
      "#screen-gauges .gs-acts .btn,#screen-gauges .gs-nav .btn{flex:0 0 auto!important;min-height:34px!important}",
      "#screen-gauges .gs-read{display:none!important}",
      "body:has(#screen-gauges.active) #form-badge,body:has(#screen-gauges.active) #drip-ear,body:has(#screen-gauges.active) .walk-chip{display:none!important}",
      "body:has(#screen-gauges.active) .pf-coach,body:has(#screen-gauges.active) #pf-coach-bar{top:4px!important;right:128px!important;left:auto!important;bottom:auto!important;width:min(160px,22vw)!important;max-height:28px!important;overflow:hidden!important}",
      "body:has(#screen-gauges.active) .ld-replay{top:4px!important;right:8px!important;bottom:auto!important;left:auto!important;max-width:112px!important;max-height:28px!important}",
      "body:has(#screen-gauges.active) #toast-host{top:4px!important;left:8px!important;right:auto!important;bottom:auto!important;width:min(140px,24vw)!important;max-height:28px!important}",
      "#screen-gauges .gs-head .btn,#screen-gauges .gs-drills button,#screen-gauges .gs-modes .btn{min-height:32px!important;max-height:32px!important;margin:0!important;padding:4px 8px!important}",
      "#screen-gauges .sf-face{max-height:32px!important;padding:1px 8px!important;overflow:hidden!important}",
      "#screen-gauges .gs-scene{flex:0 1 auto!important;align-self:center!important;height:100%!important;width:auto!important;max-width:100%!important;max-height:100%!important;aspect-ratio:16/9!important;overflow:visible!important}",
      "#screen-gauges .gs-acts .btn,#screen-gauges .gs-nav .btn{flex:1 1 0!important;min-width:0!important;padding:4px 6px!important;font-size:12px!important}",
      "}",
    ].join(""));
    landTurn("screen-gauges");
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let mode = opts && (opts.unguided || opts.practice) ? "unguided" : "guide";
    if (!(opts && (opts.unguided || opts.practice || opts.guide))) {
      if (global.LtDiff === "easy") mode = "guide";
      else if (global.LtDiff === "spicy") mode = "unguided";
    }
    let step = 2;
    let job = mode === "guide" ? JOBS[0] : JOBS[1];
    let blue = null;
    let red = null;
    let yellow = null;
    let loOpen = false;
    let hiOpen = false;
    let purged = false;
    let running = mode === "unguided";
    let heldOff = false;
    let clampS = false;
    let clampL = false;
    let hosePick = null;
    let blown = false;
    let shIn = "";
    let scIn = "";
    let guess = null;
    let banner = "";
    let holdLine = "";
    let passedGuide = false;
    let needleL = 0;
    let needleH = 0;
    let raf = 0;
    let mounted = false;
    let skipClick = false;
    let refPick = null;
    let revealed = false;
    let rep = "read";
    let faceMode = "analog";
    let machineOn = false;
    let pumpOn = false;
    let coresOut = false;
    let empty = false;
    let pulled = false;

    function sim() {
      // 295/295 is R-410A equalized at 95°F with the compressor off. A running
      // split is suction near 40°F sat and head about 20°F over outdoor.
      if (!heldOff && !empty && !machineOn && !pumpOn && blue === "suction" && red === "liquid" && !loOpen && !hiOpen) {
        running = true;
      }
      return simulate(job, running, purged, refPick || job.ref);
    }

    function liveRead() {
      const s = sim();
      let pL = 0;
      let pH = 0;
      if (blown) return { pL: 520, pH: s.pHigh, s: s, peg: true };
      if (blue === "suction") pL = s.pLow;
      else if (blue === "liquid") pL = s.pHigh;
      else if (blue === "vac") pL = -20;
      else if (blue === "recover") pL = 130;
      else if (blue) pL = 0;
      if (red === "liquid") pH = s.pHigh;
      else if (red === "suction") pH = s.pLow;
      else if (red === "vac") pH = 0;
      else if (red === "recover") pH = 130;
      else if (red) pH = 0;
      if (empty && !running) {
        if (blue === "suction") pL = pulled ? -29 : 0;
        if (red === "liquid") pH = 0;
      }
      if (pumpOn && yellow === "vac" && blue === "suction" && (loOpen || hiOpen) && !running) {
        pL = coresOut ? -29 : -18;
      }
      if (machineOn && yellow === "recover" && blue === "suction" && loOpen && !running) {
        pL = 0;
        if (red === "liquid") pH = 0;
      }
      if (loOpen && hiOpen && running && blue && red) {
        const mix = (s.pLow + s.pHigh) / 2;
        pL = mix;
        pH = mix;
      }
      return { pL: pL, pH: pH, s: s, peg: false };
    }

    function hookOk() {
      return blue === "suction" && red === "liquid" && yellow === "capped" && !loOpen && !hiOpen && !blown;
    }

    function coach() {
      if (blown) return "Compound is PEGGED. You put blue on the liquid. That's a dead gauge in the truck. Reset the set.";
      if (mode === "guide" && rep === "field") {
        const g = GUIDE[step] || GUIDE[GUIDE.length - 1];
        return g.say;
      }
      if (loOpen || hiOpen) {
        return loOpen && hiOpen
          ? "Both handwheels are OPEN. High side is feeding the low side through the center of the manifold. Seat them to read. That is how you slug a compressor."
          : (loOpen ? "Low-side handwheel is open. " : "High-side handwheel is open. ") +
            "Seat it. You read with both handles closed. Open is for charge, recovery, or vacuum — never both at once on a running unit.";
      }
      if (mode === "guide") {
        const g = GUIDE[step] || GUIDE[GUIDE.length - 1];
        return g.say;
      }
      if (!hookOk()) return "Unguided. You're on the call. Drag BLUE → suction, RED → liquid, YELLOW → cap. I don't talk until you lock it.";
      if (!running) return "Static is not a diagnosis. Start the compressor.";
      if (!clampS || !clampL) return "Needles are live. Clamp both lines, punch SH and SC, lock the call.";
      if (revealed) return job.explain;
      return "Needles and clamps are yours. Punch the math. Lock the call. I grade after.";
    }

    function hookBlock() {
      if (blown) return "Compound is pegged. Reset the set. Blue hose goes on the fat suction line only.";
      if (blue !== "suction") return "Blue hose is not on the suction valve. Low side is the big vapor line. Liquid pressure is what kills that gauge.";
      if (red !== "liquid") return "Red hose is not on the liquid valve. High side is the small line. Red does not belong on suction.";
      if (yellow !== "capped") {
        if (yellow === "vac") return "Yellow is on the vacuum pump. Cap it to read a running system. The pump is not this step.";
        if (yellow === "recover") return "Yellow is on the recovery machine. Cap it to read a running system. You are not recovering on this step.";
        return "Yellow hose is not capped. Cap the center hose or the gauge reads whatever is hanging on it.";
      }
      if (loOpen || hiOpen) return "A handwheel is open. Seat both handles. Two open valves let head pressure slam into the suction hose.";
      return "";
    }

    function nextMove() {
      const refNow = refPick || job.ref || "R-410A";
      if (blown) return "Reset the set. Blue hose only goes on the big suction valve.";
      if (mode === "guide" && rep === "field") {
        const id = GUIDE[step] ? GUIDE[step].id : "";
        if (id === "look-suc") return "Tap the upper brass valve on the condenser. The fat one.";
        if (id === "look-liq") return "Tap the lower brass valve. The skinny line.";
        if (id === "look-mac") return "Tap the recovery machine. The tank is next to it.";
        if (id === "look-pump") return "Tap the yellow vacuum pump. Not the recovery machine.";
        if (id === "nameplate") return "Plate says " + job.ref + ". Hit Next.";
        if (id === "seat") return !loOpen && !hiOpen ? "Both handles are shut. Hit Next." : "Seat both handwheels before you go on.";
        if (id === "blue") return blue === "suction" ? "Blue is on the big valve. Hit Next." : "Put the blue hose on the big suction valve in the picture.";
        if (id === "red") return red === "liquid" ? "Red is on the small valve. Hit Next." : "Put the red hose on the small liquid valve.";
        if (id === "yrec") return yellow === "recover" ? "Yellow is on the recovery machine inlet. Hit Next." : "Put the yellow hose on the recovery machine. Not the pump. Not the cap.";
        if (id === "loopen") {
          if (hiOpen) return "High side stays shut for vapor recovery. Close it.";
          if (!loOpen) return "Open the low-side handwheel only.";
          return "Low side is open. High side is shut. Hit Next.";
        }
        if (id === "recrun") return machineOn ? "Machine is on. Blue needle falls to 0 psig. Hit Next." : "Turn the recovery machine ON.";
        if (id === "recoff") {
          if (loOpen) return "Close the low-side handwheel before you kill the machine.";
          if (machineOn) return "Low side is shut. Now turn the recovery machine OFF.";
          return "Valve first, then the switch. Hit Next.";
        }
        if (id === "yvac") return yellow === "vac" ? "Yellow is on the vacuum pump. Hit Next." : "Move the yellow hose from the recovery machine to the vacuum pump.";
        if (id === "cores") return coresOut ? "Cores are out. Hit Next." : "Hit Cores out.";
        if (id === "bothopen") {
          if (running) return "Compressor stays off. You do not run a motor in a vacuum.";
          if (!loOpen || !hiOpen) return "Open both handwheels so the pump sees both lines.";
          return "Both sides are open to the pump. Hit Next.";
        }
        if (id === "pumpon") return pumpOn ? "Pump is on. The compound is in the inches. Hit Next." : "Turn the vacuum pump ON.";
        if (id === "hold") {
          if (!pulled) return "Run the pump with the cores out and both valves open before you isolate.";
          if (loOpen || hiOpen) return "Close both handwheels. Isolate the system from the pump.";
          return "It holds. Hit Next. Empty and dry. Do not start the compressor.";
        }
        return "Rep is done. Charge is in the tank. System is empty and dry. Weigh the new charge in on the real job.";
      }
      if (loOpen || hiOpen) return "Seat the handwheels. Open valves connect the center hose. Both open dumps head into suction.";
      if (mode === "guide") {
        const id = GUIDE[step] ? GUIDE[step].id : "call";
        const pastHoses = id !== "nameplate" && id !== "seat" && id !== "blue" && id !== "red" && id !== "yellow";
        if (pastHoses && blue !== "suction") return "Drag the blue hose onto the big suction valve.";
        if (pastHoses && red !== "liquid") return "Drag the red hose onto the small liquid valve.";
        if (pastHoses && yellow !== "capped") return "Cap the yellow hose. The pump and the recovery machine are not how you read pressures.";
        if (id === "nameplate") return "Nameplate is " + job.ref + ". Hit Next.";
        if (id === "seat") return "Both handles stay seated to read. Hit Next.";
        if (id === "blue") return blue === "suction" ? "Blue is on suction. Hit Next." : "Drag the blue hose onto the big suction valve.";
        if (id === "red") return red === "liquid" ? "Red is on liquid. Hit Next." : "Drag the red hose onto the small liquid valve.";
        if (id === "yellow") return yellow === "capped" ? "Yellow is capped. Hit Next." : "Drag the yellow hose onto Cap. Not the pump. Not the recovery machine.";
        if (id === "purge") return "Hit Purge hoses. Air in the hose is not the charge. Do not vent.";
        if (id === "run" || !running) return running ? "Hit Next." : "Hit Start compressor. Equalized pressure is not a diagnosis.";
        if (id === "readp") return "Read the blue needle, then the red. Hit Next.";
        if (id === "clamps" || !clampS || !clampL) {
          if (!clampS) return "Put the suction clamp on the big vapor line.";
          if (!clampL) return "Put the liquid clamp on the small liquid line.";
          if (id === "clamps") return "Both clamps are on. Hit Next.";
        }
        if (id === "math") return "Type SH and SC. Suction line minus evap dew. Start of boiling minus liquid line. Then check the math.";
        if (refNow !== job.ref) return "Nameplate is " + job.ref + ". You are on the " + refNow + " column. Tap " + job.ref + " before you call it.";
        if (guess == null) return "Pick the call, then Lock the call.";
        if (!revealed) return "Lock the call.";
        return "Call is locked. Pick another job when you want a new system.";
      }
      if (blue !== "suction") return "Drag the blue hose onto the big suction valve.";
      if (red !== "liquid") return "Drag the red hose onto the small liquid valve.";
      if (yellow !== "capped") return "Cap the yellow hose. You are reading the system, not filling it.";
      if (!running) return "Start the compressor. Static pressure is not a charge.";
      if (!clampS) return "Clamp the big suction line.";
      if (!clampL) return "Clamp the small liquid line.";
      if (refNow !== job.ref) return "This job's nameplate is " + job.ref + ". Switch back to it before you call the charge.";
      if (shIn === "" || scIn === "") return "Punch superheat and subcooling from the line temps and the saturation temps.";
      if (guess == null) return "Pick the call that matches those two numbers.";
      if (!revealed) return "Lock the call.";
      return "Graded. Pick another job.";
    }

    function toggleHandwheel(which) {
      if (which === "lo") loOpen = !loOpen;
      else hiOpen = !hiOpen;
      const open = which === "lo" ? loOpen : hiOpen;
      const name = which === "lo" ? "Low-side" : "High-side";
      const id = mode === "guide" && GUIDE[step] ? GUIDE[step].id : "";
      const allow = rep === "field" && (
        (which === "lo" && (id === "loopen" || id === "bothopen" || id === "pumpon" || id === "recoff" || id === "hold")) ||
        (which === "hi" && (id === "bothopen" || id === "pumpon" || id === "hold"))
      );
      if (open && loOpen && hiOpen && !(rep === "field" && (id === "bothopen" || id === "pumpon"))) {
        shopBad(name + " handwheel is open, and so is the other one. High pressure feeds suction through the center of the manifold — seat both before you trust a number.");
      } else if (open && allow) {
        banner = name + " is open to the center hose. That is this step.";
        feel("ok", "Open");
      } else if (open) {
        shopBad(name + " handwheel is open. Seat it unless this step told you to open it.");
      } else {
        banner = name + " handwheel is seated. That side is shut off from the center hose.";
        feel("ok", "Seated");
      }
      maybeAdvance();
      paint();
    }

    function shopBad(msg) {
      holdLine = msg;
      if (!window.PlayFeel) {
        banner = msg;
        return;
      }
      banner = "";
      var stage = gaugesStage();
      if (!stage) return;
      window.PlayFeel.deny(stage);
      window.PlayFeel.pop(stage, msg, "bad");
    }

    function feel(kind, text) {
      if (!window.PlayFeel) return;
      const stage = gaugesStage();
      if (!stage) return;
      if (kind === "bad") {
        window.PlayFeel.deny(stage);
        window.PlayFeel.pop(stage, text || "Not that", "bad");
      } else {
        window.PlayFeel.bump(stage);
        window.PlayFeel.pop(stage, text || "Good", "ok");
      }
    }

    function hubLine() {
      if (blown) return "HUB: Blue on liquid is how a first-year buys a new compound. Reset. Blue is suction only.";
      if (mode === "guide") {
        var gHub = GUIDE[step] || GUIDE[0];
        return (gHub && (gHub.hub || gHub.say)) || "";
      }
      if (revealed) return sim().fp;
      return "HUB: Same needles you see. You call it. I'm here if you're stuck — I won't give the answer away.";
    }

    function explainPressures(s) {
      const healthyLo = satP(refPick || job.ref, job.indoor - 35);
      const healthyHi = satP(refPick || job.ref, job.outdoor + 18);
      const loWord = s.pLow < healthyLo - 18 ? "LOW" : s.pLow > healthyLo + 18 ? "HIGH" : "in band";
      const hiWord = s.pHigh < healthyHi - 40 ? "LOW" : s.pHigh > healthyHi + 30 ? "HIGH" : "in band";
      const blue =
        "Blue " +
        Math.round(s.pLow) +
        " psig is evaporator pressure. P/T on " +
        (refPick || job.ref) +
        " says that's " +
        s.tSatLow.toFixed(0) +
        "°F dew. Healthy suction here is about " +
        Math.round(healthyLo) +
        " psig. This needle is <b>" +
        loWord +
        "</b>.";
      const red =
        "Red " +
        Math.round(s.pHigh) +
        " psig is liquid / head. Start of boiling is " +
        s.tSatHigh.toFixed(0) +
        "°F. Outdoor is " +
        job.outdoor +
        "°F so a clean coil sits near " +
        Math.round(healthyHi) +
        " psig. This needle is <b>" +
        hiWord +
        "</b>.";
      let story = "";
      switch (job.fault) {
        case "undercharge":
          story = "Both needles DOWN. Coil is starved (that low suction) and the condenser is thin (low head). That is a leak or a light charge — not a dirty roof.";
          break;
        case "overcharge":
          story = "Head is UP. Extra liquid is stacked in the condenser. A dirty coil raises head too, but overcharge also packs subcooling. Don't confuse them.";
          break;
        case "dirty_cond":
          story = "Head is UP because the outdoor coil can't reject heat. Subcooling stays about normal. Wash it. Overcharge would stack liquid (high SC). This one is airflow — don't add gas.";
          break;
        case "restricted":
          story = "Suction DOWN, head not collapsed. Liquid is backing up behind a drier or kink. Feel both sides of the drier — that's the split.";
          break;
        case "dirty_evap":
          story = "Suction DOWN because the indoor coil isn't seeing air. Filter, blower, A-coil. Ice is the giveaway. Do not add gas.";
          break;
        case "weak_comp":
          story = "Suction HIGH and head LOW — pressures walking toward each other. The pump isn't pumping. Amp draw will be lazy.";
          break;
        default:
          story = "Both needles where a " + (refPick || job.ref) + " split lives on a " + job.outdoor + "° day. Charge is not the complaint.";
          break;
      }
      return { blue: blue, red: red, story: story };
    }

    function explainShSc(s) {
      const shWord = s.sh >= 18 ? "HIGH" : s.sh <= 5 ? "LOW" : "in band";
      const scWord = s.sc >= 16 ? "HIGH" : s.sc <= 4 ? "LOW" : "in band";
      return (
        "SH = " +
        s.tSuction.toFixed(0) +
        "°F suction line − " +
        s.tSatLow.toFixed(0) +
        "°F evap dew = <b>" +
        s.sh.toFixed(0) +
        "°F (" +
        shWord +
        ")</b>. SC = " +
        s.tSatHigh.toFixed(0) +
        "°F start of boiling − " +
        s.tLiquid.toFixed(0) +
        "°F liquid line = <b>" +
        s.sc.toFixed(0) +
        "°F (" +
        scWord +
        ")</b>. " +
        job.explain
      );
    }

    function gaugesStage() {
      if (host) return host;
      return document.getElementById("gauges-root") || document.getElementById("screen-gauges");
    }

    function denyHose(msg) {
      shopBad(msg);
      hosePick = null;
      paint();
    }

    function landHose(hose, port) {
      banner = "";
      if (!hose || !port) return;
      if (hose === "blue" && port !== "suction") {
        return denyHose(
          port === "liquid"
            ? "Blue is the compound — liquid pressure pegs it, so it only goes on the fat vapor line."
            : port === "vac"
              ? "Blue does not go on the vacuum pump — it only goes on suction."
              : port === "recover"
                ? "Blue does not go on the recovery machine — it only goes on suction."
                : "Blue only lands on suction."
        );
      }
      if (hose === "red" && port !== "liquid") {
        return denyHose(
          port === "suction"
            ? "Red does not go on suction — red is the liquid line, and that needle is not for the low side."
            : port === "vac"
              ? "Red does not go on the vacuum pump — red is the liquid line."
              : port === "recover"
                ? "Red does not go on the recovery machine — yellow carries the center hose."
                : "Red only lands on liquid."
        );
      }
      if (hose === "blue") {
        blue = port;
      } else if (hose === "red") {
        red = port;
      } else if (hose === "yellow") {
        if (port === "suction" || port === "liquid") {
          return denyHose("Yellow does not go on a king valve — cap it to read, or hang it on the vacuum pump or the recovery machine.");
        }
        yellow = port;
        if (port === "vac") banner = empty ? "Yellow is on the vacuum pump. Tank stays shut. This machine does not recover." : "Yellow is on the vacuum pump. The hose moved. Cap it when you want system pressure.";
        else if (port === "recover") banner = "Yellow is on the recovery machine. The hose moved. Cap it when you want system pressure.";
        else if (port === "capped") banner = "Yellow is capped. Center hose stays shut. You're reading the system, not filling it.";
      }
      hosePick = null;
      if (mode === "unguided" && blue === "suction" && red === "liquid" && yellow === "capped" && !blown) {
        purged = true;
        running = true;
        clampS = true;
        clampL = true;
        banner = "Hoses landed. Unit is running. Read the needles. You call it.";
        if (global.LtDrip) global.LtDrip.say("gauges.hooked", true);
      }
      if (window.PlayFeel) {
        const stage = gaugesStage();
        if (stage) {
          window.PlayFeel.bump(stage);
          window.PlayFeel.pop(stage, yellow === "capped" || hose !== "yellow" ? "On the valve" : "Hose moved", "ok");
        }
      }
      if (global.LtHaptic && global.LtHaptic.land) global.LtHaptic.land();
      maybeAdvance();
      paint();
    }

    function land(port) {
      if (!hosePick) {
        shopBad("Pick a hose first, then the port. Blue is suction, red is liquid, yellow stays capped to read.");
        return paint();
      }
      landHose(hosePick, port);
    }

    function maybeAdvance() {
      if (mode !== "guide") return;
      if (rep === "read" && blue === "suction" && red === "liquid" && yellow === "capped" && !loOpen && !hiOpen && step < 8) {
        step = 8;
      }
      const idNow = GUIDE[step] && GUIDE[step].id;
      if (rep === "field") {
        let guard = 0;
        while (guard++ < 12 && fieldDone(GUIDE[step] && GUIDE[step].id)) step++;
      } else if (idNow === "blue" && blue === "suction") step++;
      else if (idNow === "red" && red === "liquid") step++;
      else if (idNow === "yellow" && yellow === "capped") step++;
      else if (idNow === "purge" && purged) step++;
      else if (idNow === "run" && running) step++;
      else if (idNow === "clamps" && clampS && clampL) step++;
    }

    function fieldDone(id) {
      if (id === "blue") return blue === "suction";
      if (id === "red") return red === "liquid";
      if (id === "yrec") return yellow === "recover";
      if (id === "loopen") return loOpen && !hiOpen;
      if (id === "recrun") return !!machineOn;
      if (id === "recoff") return empty && !machineOn && !loOpen;
      if (id === "yvac") return yellow === "vac";
      if (id === "cores") return coresOut;
      if (id === "bothopen") return loOpen && hiOpen && !running;
      if (id === "pumpon") return pumpOn && coresOut;
      return false;
    }

    function gradeMath() {
      const s = sim();
      const sh = parseFloat(shIn);
      const sc = parseFloat(scIn);
      if (!clampS || !clampL) {
        banner = "Clamp both lines before you claim a number.";
        return paint();
      }
      if (isNaN(sh) || isNaN(sc)) {
        banner = "Punch SH and SC. SH = suction °F − evap dew. SC = start of boiling − liquid °F.";
        return paint();
      }
      const shOk = Math.abs(sh - s.sh) <= 2.5;
      const scOk = Math.abs(sc - s.sc) <= 2.5;
      if (shOk && scOk) {
        banner = "That's the math. SH " + s.sh.toFixed(0) + "°F · SC " + s.sc.toFixed(0) + "°F. Next — call the system.";
        if (mode === "guide" && GUIDE[step] && GUIDE[step].id === "math") step++;
        if (onXp) onXp(25);
        if (global.LtHaptic && global.LtHaptic.land) global.LtHaptic.land();
        feel("ok", "Math checks");
      } else {
        banner =
          "Not yet. SH is suction line minus evap dew: " +
          s.tSuction.toFixed(0) +
          " − " +
          s.tSatLow.toFixed(0) +
          ". SC is start of boiling minus liquid line: " +
          s.tSatHigh.toFixed(0) +
          " − " +
          s.tLiquid.toFixed(0) +
          ". Dew is " +
          s.tSatLow.toFixed(0) +
          "°F at " +
          Math.round(s.pLow) +
          " psig. Start of boiling is " +
          s.tSatHigh.toFixed(0) +
          "°F at " +
          Math.round(s.pHigh) +
          " psig.";
        feel("bad", "Check the subtract");
      }
      paint();
    }

    function pickNextTicket(exceptFault) {
      var pool = JOBS.filter(function (j) { return j.fault !== exceptFault; });
      if (!pool.length) pool = JOBS.slice();
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function gradeCall() {
      if (guess == null) {
        banner = "Pick a call.";
        return paint();
      }
      var graded = job;
      if (guess === graded.answer) {
        banner = "Correct. " + graded.explain;
        if (mode === "guide") {
          passedGuide = true;
          if (onXp) onXp(40);
        } else if (onXp) onXp(50);
        if (global.LtHaptic && global.LtHaptic.land) global.LtHaptic.land();
        if (global.CurriculumTrain) global.CurriculumTrain.stamp("gauges");
        feel("ok", "That's the call");
      } else {
        banner = "Not that call. " + graded.explain;
        if (global.LtHaptic && global.LtHaptic.play) global.LtHaptic.play("trip");
        feel("bad", "Not that call");
      }
      if (global.LtDrip) global.LtDrip.say(graded.fault === "undercharge" || graded.fault === "overcharge" ? "gauges.sh" : "gauges.txv", true);
      job = pickNextTicket(graded.fault);
      guess = null;
      revealed = false;
      shIn = "";
      scIn = "";
      paint();
    }

    function stuck() {
      if (mode === "unguided" && !revealed) {
        if (!hookOk()) {
          banner = "HUB: Blue is the fat vapor line. Red is the skinny liquid. Yellow stays capped to READ.";
        } else {
          banner =
            "HUB: Write two columns — suction and head, HIGH / LOW / in band. Then SH and SC. High SH + low SC is a leak. High SH + high SC is a restriction. High head + SC about normal is a dirty condenser. I won't name this job.";
        }
      } else {
        banner = hubLine();
      }
      if (global.HubAI && typeof global.HubAI.say === "function") {
        try {
          global.HubAI.say(mode === "guide" ? GUIDE[step].title + " manifold" : job.title + " SH SC");
        } catch (_) {}
      }
      paint();
    }

    function resetSet() {
      blue = null;
      red = null;
      yellow = null;
      loOpen = false;
      hiOpen = false;
      purged = false;
      running = false;
      heldOff = false;
      machineOn = false;
      pumpOn = false;
      coresOut = false;
      empty = false;
      pulled = false;
      clampS = false;
      clampL = false;
      hosePick = null;
      blown = false;
      shIn = "";
      scIn = "";
      guess = null;
      revealed = false;
      banner = rep === "field"
        ? "Set reset. Blue on the big valve, red on the small valve, yellow to the recovery machine."
        : "Set reset. Blue suction, red liquid, yellow cap, handles seated.";
      needleL = 0;
      needleH = 0;
    }

    function ang(val, min, max) {
      const t = (val - min) / (max - min);
      return Math.PI * 0.75 + Math.PI * 1.5 * Math.max(0, Math.min(1, t));
    }

    function drawDial(ctx, x, y, r, opts) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(0, 0, r + 16, 0, Math.PI * 2);
      ctx.fillStyle = opts.boot;
      ctx.fill();
      const ring = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.2, 0, 0, r + 12);
      ring.addColorStop(0, "#f7fafb");
      ring.addColorStop(0.55, "#c5ced4");
      ring.addColorStop(1, "#5e6970");
      ctx.beginPath();
      ctx.arc(0, 0, r + 9, 0, Math.PI * 2);
      ctx.fillStyle = ring;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#f6f3ec";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const min = opts.min;
      const max = opts.max;
      if (min < 0) {
        ctx.beginPath();
        const a0 = ang(min, min, max);
        const a1 = ang(0, min, max);
        ctx.arc(0, 0, r - 5, a0, a1);
        ctx.arc(0, 0, r - 20, a1, a0, true);
        ctx.closePath();
        ctx.fillStyle = "rgba(176, 42, 42, 0.22)";
        ctx.fill();
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let v = min; v <= max + 0.01; v += opts.minor) {
        const a = ang(v, min, max);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (r - 11), Math.sin(a) * (r - 11));
        ctx.lineTo(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4));
        ctx.strokeStyle = "#2a2a2a";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      opts.majors.forEach(function (v) {
        const a = ang(v, min, max);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (r - 18), Math.sin(a) * (r - 18));
        ctx.lineTo(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4));
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.fillStyle = "#111";
        ctx.font = "700 16px IBM Plex Sans, sans-serif";
        ctx.fillText(v < 0 ? String(-v) + '"' : String(v), Math.cos(a) * (r - 32), Math.sin(a) * (r - 32));
      });

      ctx.fillStyle = opts.tempColor;
      ctx.font = "800 36px IBM Plex Sans, sans-serif";
      ctx.fillText(opts.peg ? "PEG" : String(Math.round(opts.value)), 0, 42);
      ctx.font = "700 13px IBM Plex Sans, sans-serif";
      ctx.fillText("psig", 0, 62);
      ctx.font = "700 12px IBM Plex Sans, sans-serif";
      ctx.fillText(opts.name, 0, -r + 26);
      ctx.fillStyle = opts.tempColor;
      ctx.font = "700 12px IBM Plex Sans, sans-serif";
      ctx.fillText(refPick || job.ref || "R-410A", 0, -r + 42);

      const a = ang(opts.value, min, max);
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = opts.peg ? "#b42318" : "#111";
      ctx.beginPath();
      ctx.moveTo(r - 14, 0);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-14, -2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#1c1c1c";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#d5d8dc";
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.ellipse(-r * 0.2, -r * 0.42, r * 0.42, r * 0.18, -0.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fill();
      ctx.restore();
    }

    function hose(ctx, x1, y1, x2, y2, color, on) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + 28, x2, y2);
      ctx.strokeStyle = on ? color : "rgba(90,96,102,0.35)";
      ctx.lineWidth = on ? 9 : 6;
      ctx.lineCap = "round";
      ctx.stroke();
      if (on) {
        ctx.beginPath();
        ctx.arc(x2, y2, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
      }
    }

    function knob(ctx, x, y, color, open) {
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fillStyle = open ? color : "#1c2126";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 7, y);
      ctx.lineTo(x + 7, y);
      ctx.strokeStyle = open ? "#fff" : "#9aa3ad";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const FACE_W = 720;
    const FACE_H = 360;
    const KNOB_LO = { x: 286, y: 176 };
    const KNOB_HI = { x: 434, y: 176 };

    function layoutCanvas(c) {
      if (!document.getElementById("gs-phone-fit")) {
        const st = document.createElement("style");
        st.id = "gs-phone-fit";
        st.textContent = "@media (max-width:720px){body:has(#screen-gauges.active) #drip-ear{display:none!important}body:has(#screen-gauges.active) .ld-replay{display:none!important}body:has(#screen-gauges.active) .pf-coach,body:has(#screen-gauges.active) #pf-coach-bar{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important;width:min(160px,46vw)!important;max-height:44px!important}#screen-gauges .gs-scene{display:block!important;position:relative!important;z-index:4!important;width:100%!important;height:auto!important;max-height:none!important;aspect-ratio:16/9!important;margin:0!important;overflow:visible!important}#screen-gauges .gs-lab.is-read .gs-scene{height:auto!important;max-height:none!important;aspect-ratio:16/9!important}#screen-gauges .gs-scene img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important}#screen-gauges .gs-valve{min-width:64px!important;min-height:44px!important}#screen-gauges .gs-acts .btn[hidden]{display:none!important}#screen-gauges #gs-canvas{max-height:160px!important;width:min(100%,320px)!important;height:auto!important;aspect-ratio:2/1!important}#screen-gauges .gs-manifold.is-digital #gs-canvas{display:none!important}#screen-gauges .gs-acts{gap:4px!important}#screen-gauges .gs-acts .btn,#screen-gauges .gs-nav .btn{min-height:36px!important;padding:4px 8px!important}body:has(#screen-gauges.active) #form-badge{max-width:72px!important;width:auto!important;overflow:hidden!important;top:4px!important;left:auto!important;right:6px!important}body:has(#screen-gauges.active) #form-badge .form-badge-extra{display:none!important}body:has(#screen-gauges.active) #screen-gauges .gs-lab{padding-top:2px!important;padding-bottom:8px!important}}@media (max-width:720px){body:has(#screen-gauges.active) #toast-host{top:auto!important;bottom:8px!important;left:auto!important;right:6px!important;width:min(150px,42vw)!important;max-height:64px!important}}@media (min-width:721px){body:has(#screen-gauges.active) .ld-replay{bottom:78px!important;right:8px!important;top:auto!important;left:auto!important}}@media (orientation:landscape) and (max-height:500px){body:has(#screen-gauges.active) .ld-replay{top:4px!important;right:8px!important;bottom:auto!important;left:auto!important;max-width:112px!important;display:block!important}body:has(#screen-gauges.active) .walk-chip,body:has(#screen-gauges.active) #form-badge,body:has(#screen-gauges.active) #drip-ear{display:none!important}#screen-gauges .gs-scene{display:block!important}}";
        document.head.appendChild(st);
      }
      var lab = c.closest(".gs-lab");
      if ((window.innerHeight || 800) <= 500 && (window.innerWidth || 0) > 720) {
        c.style.position = "relative";
        c.style.top = "auto";
        c.style.margin = "0 auto";
        c.style.width = "100%";
        c.style.maxWidth = "220px";
        c.style.maxHeight = "110px";
        if (lab) {
          lab.style.paddingTop = "0px";
          lab.style.paddingBottom = "0px";
        }
        return;
      }
      var screen = document.getElementById("screen-gauges");
      var stick = 0;
      var padTop = 0;
      var padBot = window.innerWidth <= 720 ? 8 : 160;
      var drip = document.getElementById("drip-ear");
      if (drip && !drip.hidden && lab) {
        var dr = drip.getBoundingClientRect();
        var lr = lab.getBoundingClientRect();
        var covers = dr.width > 8 && dr.height > 8 && dr.bottom > 0 && dr.top < window.innerHeight && dr.left < lr.right - 8 && dr.right > lr.left + 8;
        var deep = covers && dr.left < lr.left + lr.width * 0.45;
        if (deep && dr.top < window.innerHeight * 0.5) {
          stick = Math.ceil(dr.bottom + 8);
          padTop = stick;
        } else if (covers && dr.top > window.innerHeight * 0.45) {
          padBot = Math.max(padBot, Math.ceil(window.innerHeight - dr.top + 16));
        }
      }
      c.style.boxSizing = "border-box";
      c.style.width = "";
      c.style.height = "";
      c.style.maxWidth = "100%";
      c.style.maxHeight = "";
      c.style.minHeight = "0";
      c.style.aspectRatio = "";
      c.style.position = "sticky";
      c.style.top = stick + "px";
      c.style.zIndex = "4";
      c.style.margin = "8px auto";
      c.style.display = "block";
      c.style.background = "#1a1e22";
      if (lab) {
        lab.style.paddingTop = padTop + "px";
        lab.style.paddingBottom = padBot + "px";
      }
      if (screen) {
        var h = c.getBoundingClientRect().height || 180;
        screen.style.scrollPaddingTop = (stick + h + 12) + "px";
        screen.style.scrollPaddingBottom = padBot + "px";
      }
    }

    function drawHookups() {
      var old = host.querySelector("#gs-hose-svg");
      var rig = host.querySelector("#gs-rig-svg");
      if (old) old.innerHTML = "";
      if (rig) rig.innerHTML = "";
    }

    function draw() {
      const c = host.querySelector("#gs-canvas");
      if (!c || !c.getContext) return;
      layoutCanvas(c);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (c.width !== FACE_W * dpr || c.height !== FACE_H * dpr) {
        c.width = FACE_W * dpr;
        c.height = FACE_H * dpr;
      }
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, FACE_W, FACE_H);
      ctx.fillStyle = "#1a1e22";
      ctx.fillRect(0, 0, FACE_W, FACE_H);

      const live = liveRead();
      needleL += (live.pL - needleL) * 0.18;
      needleH += (live.pH - needleH) * 0.18;
      const refNow = refPick || job.ref || "R-410A";
      const loMax = refNow === "R-22" ? 250 : refNow === "R-134a" ? 150 : 500;
      const hiMax = refNow === "R-22" ? 500 : refNow === "R-134a" ? 300 : 800;
      const tempColor = refNow === "R-22" ? "#1d7a32" : refNow === "R-134a" ? "#1d4e89" : refNow === "R-32" ? "#c2410c" : refNow === "R-454B" ? "#6d28d9" : "#b4234a";
      const loMajors = loMax <= 150 ? [-30, 0, 50, 100, 150] : loMax <= 250 ? [-30, 0, 50, 100, 150, 200, 250] : [-30, 0, 100, 200, 300, 400, 500];
      const hiMajors = hiMax <= 300 ? [0, 50, 100, 150, 200, 250, 300] : hiMax <= 500 ? [0, 100, 200, 300, 400, 500] : [0, 100, 200, 300, 400, 500, 600, 700, 800];
      drawDial(ctx, 150, 132, 112, {
        name: "COMPOUND",
        boot: "#1f4f86",
        tempColor: tempColor,
        min: -30,
        max: loMax,
        minor: loMax <= 250 ? 25 : 25,
        majors: loMajors,
        temps: [-20, 0, 20, 40, 60, 80, 100, 120],
        value: needleL,
        peg: live.peg,
      });
      drawDial(ctx, 570, 132, 112, {
        name: "HIGH",
        boot: "#8e1c2a",
        tempColor: tempColor,
        min: 0,
        max: hiMax,
        minor: 50,
        majors: hiMajors,
        temps: [40, 60, 80, 100, 120, 140],
        value: needleH,
        peg: false,
      });

      ctx.fillStyle = "#c3923c";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(248, 118, 224, 58, 8);
      else ctx.rect(248, 118, 224, 58);
      ctx.fill();
      ctx.strokeStyle = "#7a5924";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(360, 140, 13, 0, Math.PI * 2);
      ctx.fillStyle = "#d5eef8";
      ctx.fill();
      ctx.strokeStyle = "#6d5428";
      ctx.stroke();
      ctx.fillStyle = "#2a2116";
      ctx.font = "700 10px IBM Plex Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(loOpen || hiOpen ? "OPEN" : "SEATED", 360, 166);
      knob(ctx, KNOB_LO.x, KNOB_LO.y, "#1f6feb", loOpen);
      knob(ctx, KNOB_HI.x, KNOB_HI.y, "#c81e1e", hiOpen);
      function nipple(x, color) {
        ctx.fillStyle = "#22282d";
        ctx.fillRect(x - 7, 214, 14, 18);
        ctx.fillStyle = color;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x - 6, 228, 12, 28, 4);
        else ctx.rect(x - 6, 228, 12, 28);
        ctx.fill();
      }
      nipple(150, "#1f6feb");
      nipple(360, "#e2b43a");
      nipple(570, "#c81e1e");
      function tail(x, color) {
        ctx.beginPath();
        ctx.moveTo(x, 256);
        ctx.bezierCurveTo(x - 26, 292, x + 34, 318, x + 6, 348);
        ctx.strokeStyle = "#1a120c";
        ctx.lineWidth = 16;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, 256);
        ctx.bezierCurveTo(x - 26, 292, x + 34, 318, x + 6, 348);
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 6, 348, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#e6c98a";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#6b4a22";
        ctx.stroke();
      }
      tail(150, "#1f6feb");
      tail(360, "#e2b43a");
      tail(570, "#c81e1e");
      drawHookups();
      var loFace = host.querySelector("#gs-lo-face");
      var hiFace = host.querySelector("#gs-hi-face");
      if (loFace) {
        var loUnit = needleL < 0 ? "inHg" : "psig";
        loFace.querySelector("strong").textContent = String(Math.round(needleL));
        loFace.querySelector("span").textContent = loUnit;
        if (window.ShopFace) window.ShopFace.dress(loFace, String(Math.round(needleL)), loUnit);
      }
      if (hiFace) {
        hiFace.querySelector("strong").textContent = String(Math.round(needleH));
        hiFace.querySelector("span").textContent = "psig";
        if (window.ShopFace) window.ShopFace.dress(hiFace, String(Math.round(needleH)), "psig");
      }
    }

    function formulaHtml(s) {
      if (!clampS && !clampL) {
        return "Clamps off. Pressure without pipe temp is not SH or SC.";
      }
      const shPart = clampS
        ? s.tSuction.toFixed(0) + "°F suction − " + s.tSatLow.toFixed(0) + "°F evap dew = <b>" + s.sh.toFixed(0) + "°F SH</b>"
        : "Suction clamp off";
      const scPart = clampL
        ? s.tSatHigh.toFixed(0) + "°F start of boiling − " + s.tLiquid.toFixed(0) + "°F liquid = <b>" + s.sc.toFixed(0) + "°F SC</b>"
        : "Liquid clamp off";
      return shPart + " · " + scPart;
    }

    function fmtGauge(p, peg) {
      if (peg) return "PEG";
      if (typeof p !== "number" || !isFinite(p)) return "—";
      if (p < -0.05) return Math.round(-p) + '" Hg';
      return Math.round(p) + " psig";
    }

    let insideTimer = 0;
    function playInside(on) {
      const card = host.querySelector("#gs-inside-card");
      if (!card) return;
      card.hidden = !on;
      if (insideTimer) clearInterval(insideTimer);
      insideTimer = 0;
      if (!on) return;
      if (card.scrollIntoView) card.scrollIntoView({ block: "start" });
      const lines = [
        "Handles shut. Blue sees only the suction hose. Red sees only the liquid hose. The center port is dead, so you can read.",
        "The low wheel cracked opens the body to the blue hose. That is vapor charge, not a reading.",
        "Both wheels open. Head pressure crosses the body into the blue hose. That is how you slug a compressor.",
      ];
      const line = host.querySelector("#gs-inside-line");
      const svg = host.querySelector(".gs-cut");
      let n = 0;
      function frame() {
        if (line) line.textContent = lines[n % 3];
        if (svg) svg.setAttribute("data-frame", String(n % 3));
        n += 1;
      }
      frame();
      insideTimer = setInterval(frame, 2400);
    }
    function paintFace(live, s) {
      const man = host.querySelector(".gs-manifold");
      if (man) {
        man.classList.toggle("is-digital", faceMode === "digital");
        man.classList.toggle("is-analog", faceMode !== "digital");
      }
      const analogBtn = host.querySelector("#gs-face-analog");
      const digitalBtn = host.querySelector("#gs-face-digital");
      if (analogBtn) analogBtn.classList.toggle("primary", faceMode !== "digital");
      if (digitalBtn) digitalBtn.classList.toggle("primary", faceMode === "digital");
      const lcd = host.querySelector("#gs-lcd");
      const canvas = host.querySelector("#gs-canvas");
      if (lcd) lcd.hidden = faceMode !== "digital";
      if (canvas) canvas.hidden = faceMode === "digital";
      const refEl = host.querySelector("#gs-lcd-ref");
      if (refEl) refEl.textContent = refPick || job.ref || "R-410A";
      const lo = host.querySelector("#gs-lcd-lo");
      const hi = host.querySelector("#gs-lcd-hi");
      if (lo) lo.textContent = blue ? (live.peg ? "PEG" : String(Math.round(live.pL))) : "—";
      if (hi) hi.textContent = red ? String(Math.round(live.pH)) : "—";
      const loSat = host.querySelector("#gs-lcd-losat");
      const hiSat = host.querySelector("#gs-lcd-hisat");
      if (loSat) loSat.textContent = blue && running ? s.tSatLow.toFixed(1) + "°F sat" : "sat —";
      if (hiSat) hiSat.textContent = red && running ? s.tSatHigh.toFixed(1) + "°F sat" : "sat —";
      const shEl = host.querySelector("#gs-lcd-sh");
      const scEl = host.querySelector("#gs-lcd-sc");
      if (shEl) shEl.textContent = clampS && running ? "SH " + s.sh.toFixed(1) + "°F" : "SH —";
      if (scEl) scEl.textContent = clampL && running ? "SC " + s.sc.toFixed(1) + "°F" : "SC —";
    }
    function paintHoseCheck() {
      const list = host.querySelector("#gs-hose-check");
      if (!list) return;
      if (rep !== "read") { list.hidden = true; return; }
      list.hidden = false;
      const rows = [
        [blue === "suction", "Blue on suction"],
        [red === "liquid", "Red on liquid"],
        [yellow === "capped", "Yellow capped"],
        [running && blue === "suction" && red === "liquid" && yellow === "capped", "Read the needles"],
      ];
      list.innerHTML = rows.map(function (row) {
        return '<li class="' + (row[0] ? "done" : "") + '">' + (row[0] ? "Done · " : "Drag · ") + row[1] + "</li>";
      }).join("");
    }
    function paint() {
      if (!mounted) return;
      const s = sim();
      const live = liveRead();
      const g = GUIDE[step] || GUIDE[GUIDE.length - 1];

      const coachEl = host.querySelector("#gs-coach");
      if (coachEl) {
        coachEl.hidden = true;
        coachEl.textContent = "";
      }
      var hubEl = host.querySelector("#gs-hubtalk");
      if (hubEl) {
        hubEl.hidden = rep === "field";
        hubEl.textContent = rep === "field" ? "" : hubLine();
      }
      const ban = host.querySelector("#gs-banner");
      ban.textContent = banner;
      ban.classList.toggle("hidden", !banner);
      ban.classList.toggle("good", /Correct|That's the math|in band|leave-it/i.test(banner));
      ban.classList.toggle("bad", /Wrong|PEGGED|OPEN|Not yet|dead gauge/i.test(banner));
      const hint = host.querySelector(".gs-drag-hint");
      if (hint) {
        hint.hidden = rep === "field";
        hint.textContent = rep === "field" ? "" : hosePick
          ? "Now tap the valve that hose belongs on."
          : "Tap a hose, then tap the valve. Or drag the hose onto the valve.";
      }

      host.querySelector("#gs-lo").textContent = loOpen ? "Low OPEN" : "Low seated";
      host.querySelector("#gs-hi").textContent = hiOpen ? "High OPEN" : "High seated";
      host.querySelector("#gs-lo").classList.toggle("open", loOpen);
      host.querySelector("#gs-hi").classList.toggle("open", hiOpen);
      host.querySelector("#gs-run").textContent = running ? "Stop compressor" : "Start compressor";

      ["blue", "red", "yellow"].forEach(function (h) {
        const el = host.querySelector('[data-hose="' + h + '"]');
        if (!el) return;
        const landed = h === "blue" ? blue : h === "red" ? red : yellow;
        el.classList.toggle("pick", hosePick === h);
        el.classList.toggle("landed", !!landed);
        el.hidden = false;
        el.style.display = "";
        var label = el.querySelector("span");
        if (label) {
          var where = h === "blue" ? blue : h === "red" ? red : yellow;
          label.textContent = where
            ? (h === "blue" ? "Blue" : h === "red" ? "Red" : "Yellow") + " · on " + where
            : h === "blue" ? "Blue · suction" : h === "red" ? "Red · liquid" : "Yellow · cap";
        }
      });

      host.querySelectorAll("[data-port]").forEach(function (el) {
        const p = el.getAttribute("data-port");
        const who = blue === p ? "blue" : red === p ? "red" : yellow === p ? "yellow" : "";
        el.classList.toggle("on", !!who);
        el.classList.toggle("got-blue", who === "blue");
        el.classList.toggle("got-red", who === "red");
        el.classList.toggle("got-yellow", who === "yellow");
        var legal = hosePick === "blue" ? p === "suction" : hosePick === "red" ? p === "liquid" : hosePick === "yellow" ? (p === "capped" || p === "vac" || p === "recover") : false;
        el.classList.toggle("hint", legal);
      });
      var bench = host.querySelector("#gs-bench");
      if (bench) bench.classList.toggle("armed", !!hosePick);
      var cond = host.querySelector("#gs-cond");
      var img = host.querySelector("#gs-cond-img");
      var hooked = blue === "suction" || red === "liquid";
      if (cond) cond.classList.toggle("hooked", hooked);
      if (img && cond) {
        var src = "gauges/hook-open.jpg";
        var hook = "open";
        if (yellow === "recover") { src = "gauges/hook-recover.jpg"; hook = "recover"; }
        else if (yellow === "vac") { src = "gauges/hook-vac.jpg"; hook = "vac"; }
        else if (blue === "suction" && red === "liquid") { src = "gauges/hook-read.jpg"; hook = "read"; }
        if (img.getAttribute("src") !== src) img.src = src;
        cond.classList.remove("hook-open", "hook-read", "hook-recover", "hook-vac");
        cond.classList.add("hook-" + hook);
      }
      var pt = host.querySelector("#gs-pt");
      if (pt) {
        var ref = refPick || job.ref || "R-410A";
        var bits = [
          ref,
          "40°F sat " + Math.round(satP(ref, 40)) + " psig",
          job.outdoor + "°F outdoor static " + Math.round(satP(ref, job.outdoor)) + " psig",
        ];
        if (running) {
          bits.push("suction " + Math.round(s.pLow) + " psig / " + Math.round(s.tSatLow) + "°F");
          bits.push("head " + Math.round(s.pHigh) + " psig / " + Math.round(s.tSatHigh) + "°F");
          if (clampS) bits.push("suction line " + Math.round(s.tSuction) + "°F");
          if (clampL) bits.push("liquid line " + Math.round(s.tLiquid) + "°F");
        }
        pt.textContent = bits.join(" · ");
      }
      var reads = host.querySelector("#gs-reads");
      if (reads) {
        var names = ["R-410A", "R-22", "R-134a", "R-32", "R-454B"];
        var picked = refPick || job.ref || "R-410A";
        reads.innerHTML = names.map(function (name) {
          var one = simulate(job, running, purged, name);
          return '<button type="button" class="gs-readcard' + (name === picked ? " on" : "") + '" data-ref="' + name + '">' +
            "<b>" + name + "</b>" +
            "<span>40°F sat " + Math.round(satP(name, 40)) + " psig</span>" +
            "<span>" + job.outdoor + "°F static " + Math.round(satP(name, job.outdoor)) + " psig</span>" +
            (running
              ? "<span>Suction " + Math.round(one.pLow) + " psig · " + Math.round(one.tSatLow) + "°F</span>" +
                "<span>Head " + Math.round(one.pHigh) + " psig · " + Math.round(one.tSatHigh) + "°F</span>"
              : "<span>Off · both sides " + Math.round(one.pLow) + " psig</span>") +
            "</button>";
        }).join("");
      }
      var sel = host.querySelector("#gs-ref");
      if (sel && sel.value !== (refPick || job.ref || "R-410A")) sel.value = refPick || job.ref || "R-410A";

      host.querySelector("#gs-clamp-s").classList.toggle("on", clampS);
      host.querySelector("#gs-clamp-l").classList.toggle("on", clampL);

      host.querySelector("#gs-pl").textContent = blue ? fmtGauge(live.pL, live.peg) : "—";
      host.querySelector("#gs-ph").textContent = red ? fmtGauge(live.pH, false) : "—";
      paintFace(live, s);
      host.querySelector("#gs-tsl").textContent = blue && running ? s.tSatLow.toFixed(0) + "°F dew" : "—";
      host.querySelector("#gs-tsh").textContent = red && running ? s.tSatHigh.toFixed(0) + "°F start of boiling" : "—";
      host.querySelector("#gs-tsuc").textContent = clampS && running ? s.tSuction.toFixed(0) + "°F" : "clamp off";
      host.querySelector("#gs-tliq").textContent = clampL && running ? s.tLiquid.toFixed(0) + "°F" : "clamp off";
      host.querySelector("#gs-formula").innerHTML =
        running && hookOk()
          ? mode === "unguided" && !revealed
            ? "Needles and clamps are live. Punch SH and SC yourself — I don't show the answer until you lock the call."
            : formulaHtml(s)
          : "Hook up, seat valves, start it, then clamp.";
      var shinEl = host.querySelector("#gs-shin");
      var scinEl = host.querySelector("#gs-scin");
      if (shinEl && document.activeElement !== shinEl && shinEl.value !== shIn) shinEl.value = shIn;
      if (scinEl && document.activeElement !== scinEl && scinEl.value !== scIn) scinEl.value = scIn;

      host.querySelectorAll(".gs-step").forEach(function (el, i) {
        el.classList.toggle("on", mode === "guide" && i === step);
        el.classList.toggle("ok", mode === "guide" && i < step);
      });

      var guideUi = host.querySelector("#gs-guide-ui");
      if (guideUi) guideUi.hidden = true;
      host.querySelector("#gs-practice-ui").classList.remove("hidden");
      host.querySelector("#gs-math").classList.toggle("hidden", !(clampS && clampL && running));
      host.querySelector("#gs-prints").classList.toggle("hidden", !(mode === "guide" || revealed));

      const mean = host.querySelector("#gs-meaning");
      if (mean && rep === "field") {
        mean.classList.add("hidden");
        mean.innerHTML = "";
      } else if (mean) {
        const spoil = mode === "guide" || revealed;
        if (!hookOk()) {
          mean.innerHTML =
            mode === "guide"
              ? "<p class=\"eyebrow\">Guided</p><p>Gold pad is the next land. Drag <b>blue → suction</b>, <b>red → liquid</b>, <b>yellow → cap</b>. I walk the needles after they land.</p>"
              : "<p class=\"eyebrow\">Unguided</p><p>Same hookup — no gold hint, no answer. Drag the hoses. Needles go live. You call it, then I grade.</p>";
        } else if (!running) {
          mean.innerHTML = "<p class=\"eyebrow\">Static</p><p>" + sim().status + " Start the compressor to diagnose.</p>";
        } else if (!spoil) {
          mean.innerHTML =
            "<p class=\"eyebrow\">Live gauges · you call it</p><p>Blue " +
            fmtGauge(live.pL, false) +
            " · Red " +
            fmtGauge(live.pH, false) +
            ". I will not tell you HIGH/LOW or the fingerprint until you lock the call.</p>";
        } else {
          const ex = explainPressures(s);
          let html =
            "<p class=\"eyebrow\">What these pressures mean · " +
            job.title +
            "</p>" +
            "<p>" +
            ex.blue +
            "</p><p>" +
            ex.red +
            "</p><p>" +
            ex.story +
            "</p>";
          if (clampS && clampL) html += "<p>" + explainShSc(s) + "</p>";
          else html += "<p>Clamp both lines next. Pressure is half. Pipe temp makes SH and SC.</p>";
          mean.innerHTML = html;
        }
        mean.classList.remove("hidden");
      }

      const gId = g && g.id;
      const callBox = host.querySelector("#gs-call");
      if (mode === "unguided" || (mode === "guide" && (gId === "call" || hookOk()))) {
        callBox.classList.remove("hidden");
        callBox.innerHTML = job.choices
          .map(function (c, i) {
            return (
              '<button type="button" class="btn' +
              (guess === i ? " primary" : "") +
              '" data-guess="' +
              i +
              '">' +
              c +
              "</button>"
            );
          })
          .join("");
      } else {
        callBox.classList.add("hidden");
      }

      const ol = host.querySelector("#gs-guide-ui");
      if (ol) ol.hidden = true;
      var machBtn = host.querySelector("#gs-machine");
      var pumpBtn = host.querySelector("#gs-pump");
      var coreBtn = host.querySelector("#gs-cores");
      var cap = host.querySelector("#gs-stepcap");
      if (machBtn) {
        machBtn.hidden = !(rep === "field" && drill >= 2);
        machBtn.textContent = machineOn ? "Recovery machine OFF" : "Recovery machine ON";
        machBtn.classList.toggle("primary", machineOn);
      }
      if (pumpBtn) {
        pumpBtn.hidden = !(rep === "field" && drill >= 3);
        pumpBtn.textContent = pumpOn ? "Vacuum pump OFF" : "Vacuum pump ON";
        pumpBtn.classList.toggle("primary", pumpOn);
      }
      if (coreBtn) {
        coreBtn.hidden = !(rep === "field" && drill >= 3);
        coreBtn.textContent = coresOut ? "Cores are out" : "Cores out";
        coreBtn.classList.toggle("primary", coresOut);
      }
      if (cap && mode === "guide" && GUIDE[step]) cap.textContent = GUIDE[step].title;
      else if (cap) cap.textContent = "";
      host.querySelectorAll("[data-drill]").forEach(function (b) {
        var i = +b.getAttribute("data-drill");
        b.disabled = i > 0 && !drillClear[i - 1];
        b.classList.toggle("on", rep === "field" && drill === i);
      });
      var man = host.querySelector(".gs-manifold");
      var lab = host.querySelector(".gs-lab");
      if (lab) lab.classList.toggle("is-read", rep === "read");
      if (man) man.hidden = rep === "field" && drill === 0;
      var scene = host.querySelector("#gs-cond");
      if (scene) scene.classList.toggle("is-look", rep === "field" && drill === 0);
      ["#gs-reads", ".gs-ref", "#gs-pt", ".gs-practice"].forEach(function (sel) {
        var el = host.querySelector(sel);
        if (el) el.hidden = rep === "field";
      });
      var nextBtn = host.querySelector("#gs-next");
      if (nextBtn) nextBtn.hidden = rep === "field" && drill === 0;

      const hintId = mode === "guide" && GUIDE[step] ? GUIDE[step].id : "";
      var actNeed = {
        seat: ["gs-lo", "gs-hi"],
        loopen: ["gs-lo"],
        recrun: ["gs-machine"],
        recoff: ["gs-lo", "gs-machine"],
        cores: ["gs-cores"],
        bothopen: ["gs-lo", "gs-hi"],
        pumpon: ["gs-pump"],
        hold: ["gs-lo", "gs-hi"],
        clamps: ["gs-clamp-s", "gs-clamp-l"],
        run: ["gs-run"],
      };
      var actIds = ["gs-lo", "gs-hi", "gs-purge", "gs-machine", "gs-pump", "gs-cores", "gs-run", "gs-clamp-s", "gs-clamp-l", "gs-reset"];
      var focusActs = rep === "field" && mode === "guide";
      actIds.forEach(function (id) {
        var b = host.querySelector("#" + id);
        if (!b) return;
        if (!focusActs) {
          if (id === "gs-machine" || id === "gs-pump" || id === "gs-cores") return;
          b.hidden = false;
          return;
        }
        b.hidden = (actNeed[hintId] || []).indexOf(id) < 0;
      });
      if (rep === "read") {
        ["gs-machine", "gs-pump", "gs-cores", "gs-purge", "gs-lo", "gs-hi", "gs-reset"].forEach(function (id) {
          var b = host.querySelector("#" + id);
          if (b) b.hidden = true;
        });
        var runB = host.querySelector("#gs-run");
        if (runB) runB.hidden = !(blue === "suction" && red === "liquid");
        var cS = host.querySelector("#gs-clamp-s");
        var cL = host.querySelector("#gs-clamp-l");
        if (cS) cS.hidden = !running;
        if (cL) cL.hidden = !running;
      }
      paintHoseCheck();
      host.querySelectorAll(".gs-drop").forEach(function (el) {
        const slot = el.getAttribute("data-slot");
        const hint =
          (hintId === "look-suc" && slot === "suction") ||
          (hintId === "look-liq" && slot === "liquid") ||
          (hintId === "look-mac" && slot === "recover") ||
          (hintId === "look-pump" && slot === "vac") ||
          (hintId === "blue" && slot === "suction") ||
          (hintId === "red" && slot === "liquid") ||
          (hintId === "yellow" && slot === "capped") ||
          (hintId === "yrec" && slot === "recover") ||
          (hintId === "yvac" && slot === "vac");
        el.classList.toggle("hint", !!hint);
      });
      var aim = "suction";
      if (hintId === "look-liq" || hintId === "red") aim = "liquid";
      else if (hintId === "look-mac" || hintId === "yrec" || hintId === "loopen" || hintId === "recrun" || hintId === "recoff") aim = "recover";
      else if (hintId === "look-pump" || hintId === "yvac" || hintId === "cores" || hintId === "bothopen" || hintId === "pumpon" || hintId === "hold") aim = "vac";
      else if (hintId === "seat") aim = "valves";
      else if (hintId === "clamps") aim = !clampS ? "suction" : "liquid";
      host.querySelectorAll(".gs-arrow").forEach(function (el) {
        var a = el.getAttribute("data-arrow");
        el.classList.toggle("on", aim === "valves" ? a === "suction" || a === "liquid" : a === aim);
      });

      host.querySelectorAll("[data-mode]").forEach(function (b) {
        b.classList.toggle("primary", b.getAttribute("data-mode") === mode);
      });
      host.querySelectorAll("[data-rep]").forEach(function (b) {
        b.classList.toggle("primary", b.getAttribute("data-rep") === rep);
      });

      const jobs = host.querySelector("#gs-jobs");
      if (jobs) {
        jobs.querySelectorAll("[data-job]").forEach(function (b) {
          b.classList.toggle("on", b.getAttribute("data-job") === job.id);
        });
      }
      const brief = host.querySelector("#gs-job-brief");
      if (brief) brief.textContent = job.title + " — " + job.brief;

      draw();
      var stage = host || gaugesStage();
      var line = holdLine || nextMove();
      holdLine = "";
      if (window.PlayFeel) window.PlayFeel.coach(stage, line);
      parkPhoneCoach();
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function bind() {
      var hoseArm = null;
      var _gsN = host.querySelector("#gs-hub"); if (_gsN) _gsN.onclick = function () {
        if (onHub) onHub();
      };
      var _gsIn = host.querySelector("#gs-inside"); if (_gsIn) _gsIn.onclick = function () { playInside(true); };
      var _gsFA = host.querySelector("#gs-face-analog"); if (_gsFA) _gsFA.onclick = function () { faceMode = "analog"; paint(); };
      var _gsFD = host.querySelector("#gs-face-digital"); if (_gsFD) _gsFD.onclick = function () { faceMode = "digital"; paint(); };
      var _gsX = host.querySelector("#gs-inside-x"); if (_gsX) _gsX.onclick = function () { playInside(false); };
      var _gsN = host.querySelector("#gs-stuck"); if (_gsN) _gsN.onclick = stuck;
      var _gsN = host.querySelector("#gs-reset"); if (_gsN) _gsN.onclick = function () {
        resetSet();
        paint();
      };
      var _gsN = host.querySelector("#gs-lo"); if (_gsN) _gsN.onclick = function () { toggleHandwheel("lo"); };
      var _gsN = host.querySelector("#gs-hi"); if (_gsN) _gsN.onclick = function () { toggleHandwheel("hi"); };
      var _gsN = host.querySelector("#gs-run"); if (_gsN) _gsN.onclick = function () {
        if (rep === "field") {
          shopBad("This rep is recovery and vacuum. The compressor stays off. You do not start a motor in a vacuum.");
          return paint();
        }
        if (!running) {
          const why = hookBlock();
          if (why) {
            shopBad(why);
            return paint();
          }
        }
        running = !running;
        heldOff = !running;
        maybeAdvance();
        if (mode === "guide" && GUIDE[step] && GUIDE[step].id === "readp" && running) {
          step++;
        }
        banner = running
          ? "Compressor is on. Wait for the needles to settle, then read superheat and subcooling together."
          : "Compressor is off. Both sides will equalize to outdoor temperature. That is not a charge.";
        if (running) feel("ok", "Running");
        paint();
      };
      var _gsN = host.querySelector("#gs-purge"); if (_gsN) _gsN.onclick = function () {
        if (blue !== "suction" || red !== "liquid") {
          banner = "Land blue on suction and red on liquid first. Purging an open hose vents refrigerant. Use the low-loss fittings. Do not crack a hose to atmosphere.";
          feel("bad", "Hoses first");
          return paint();
        }
        purged = true;
        maybeAdvance();
        banner = "Hoses purged. The air that was in the hoses is not part of the reading anymore. Do not vent the charge.";
        feel("ok", "Purged");
        paint();
      };
      var _gsMach = host.querySelector("#gs-machine"); if (_gsMach) _gsMach.onclick = function () {
        if (rep !== "field") {
          shopBad("You are reading a running system. Cap the yellow hose. The recovery machine stays off.");
          return paint();
        }
        if (yellow !== "recover" || blue !== "suction" || red !== "liquid") {
          shopBad("Blue on suction, red on liquid, yellow on the recovery machine inlet. Then the machine.");
          return paint();
        }
        if (!loOpen && !machineOn) {
          shopBad("Open the low-side handwheel first. The machine has nothing to pull.");
          return paint();
        }
        machineOn = !machineOn;
        if (machineOn) {
          empty = true;
          banner = "Machine is on. Vapor is going into the tank. Blue needle falls to 0 psig. That is the 608 level on this small system. It is not 500 microns.";
          feel("ok", "Recovering");
        } else {
          banner = loOpen
            ? "Machine is off and the low side is still open. Close the handwheel first or the tank pushes back."
            : "Machine is off. Low side was already shut. The charge stays in the tank.";
          feel("ok", "Machine off");
        }
        maybeAdvance();
        paint();
      };
      var _gsPump = host.querySelector("#gs-pump"); if (_gsPump) _gsPump.onclick = function () {
        if (rep !== "field") {
          shopBad("You are reading a running system. The vacuum pump stays off.");
          return paint();
        }
        if (!empty) {
          shopBad("Recover to 0 psig first. The pump is not a recovery machine.");
          return paint();
        }
        if (yellow !== "vac") {
          shopBad("Move the yellow hose onto the vacuum pump. The recovery machine is done.");
          return paint();
        }
        if (!coresOut && !pumpOn) {
          shopBad("Cores out before the pump. A core in the port will not let you finish.");
          return paint();
        }
        if ((!loOpen || !hiOpen) && !pumpOn) {
          shopBad("Open both handwheels. The pump has to see both lines.");
          return paint();
        }
        pumpOn = !pumpOn;
        if (pumpOn && coresOut && loOpen && hiOpen) pulled = true;
        banner = pumpOn
          ? (coresOut ? "Pump is on. Compound is in the inches. Prove 500 microns on a micron gauge at the system, then isolate." : "Pump is on, but the cores are still in. It will stall short of a deep vacuum.")
          : "Pump is off.";
        feel(pumpOn ? "ok" : "bad", pumpOn ? "Pump on" : "Pump off");
        maybeAdvance();
        paint();
      };
      var _gsCores = host.querySelector("#gs-cores"); if (_gsCores) _gsCores.onclick = function () {
        if (rep !== "field" || !empty) {
          shopBad("Cores come out after the charge is in the tank, before the vacuum pump.");
          return paint();
        }
        coresOut = true;
        banner = "Cores are out. Less restriction. They go back in the port before you charge. Not before.";
        feel("ok", "Cores out");
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-clamp-s"); if (_gsN) _gsN.onclick = function () {
        if (!running && !clampS) {
          banner = "Start the compressor before the suction clamp. A clamp on a dead unit reads outdoor temperature, not superheat.";
          feel("bad", "Run it first");
          return paint();
        }
        clampS = !clampS;
        banner = clampS
          ? "Suction clamp is on the big vapor line. Metal to metal, out of the sun. Superheat is that temp minus evap dew."
          : "Suction clamp is off. You do not have a line temperature, so you do not have superheat.";
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-clamp-l"); if (_gsN) _gsN.onclick = function () {
        if (!running && !clampL) {
          banner = "Start the compressor before the liquid clamp. Subcooling is a running-condenser number.";
          feel("bad", "Run it first");
          return paint();
        }
        clampL = !clampL;
        banner = clampL
          ? "Liquid clamp is on the small line leaving the condenser. Subcooling is the start of boiling minus that temp."
          : "Liquid clamp is off. Pressure alone is not subcooling.";
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-hoses"); if (_gsN) _gsN.onclick = function (e) {
        if (skipClick) {
          skipClick = false;
          return;
        }
        const b = e.target.closest("[data-hose]");
        if (!b) return;
        const h = b.getAttribute("data-hose");
        if (h === "blue" && blue) { blue = null; running = false; hosePick = h; banner = "Blue hose is in your hand. Put it back on the big suction valve."; paint(); return; }
        if (h === "red" && red) { red = null; running = false; hosePick = h; banner = "Red hose is in your hand. Put it back on the small liquid valve."; paint(); return; }
        if (h === "yellow" && yellow) { yellow = null; hosePick = h; banner = "Yellow hose is in your hand. Recovery machine, vacuum pump, or the cap."; paint(); return; }
        hosePick = hoseArm === h ? null : h;
        hoseArm = null;
        paint();
      };
      function onPortClick(e) {
        if (skipClick) {
          skipClick = false;
          return;
        }
        const b = e.target.closest("[data-port], .gs-drop");
        if (!b) return;
        const port = b.getAttribute("data-port") || b.getAttribute("data-slot");
        const id = mode === "guide" && GUIDE[step] ? GUIDE[step].id : "";
        if (id.indexOf("look-") === 0 && !hosePick) {
          const want = id === "look-suc" ? "suction" : id === "look-liq" ? "liquid" : id === "look-mac" ? "recover" : "vac";
          if (port !== want) {
            shopBad(nextMove());
            return paint();
          }
          feel("ok", "That's it");
          if (step < GUIDE.length - 1) {
            step++;
            banner = GUIDE[step].say;
          } else {
            drillClear[0] = true;
            banner = "You can name the pad. Drill 2 is only two hoses.";
            if (onXp) onXp(15);
          }
          paint();
          return;
        }
        land(port);
      }
      var ports = host.querySelector("#gs-bench");
      if (ports) ports.onclick = onPortClick;
      if (global.LtDrag && global.LtDrag.bindSource) {
        host.querySelectorAll("[data-hose]").forEach(function (el) {
          const id = el.getAttribute("data-hose");
          global.LtDrag.bindSource(el, {
            id: id,
            allowButtons: true,
            dropSelector: ".gs-drop",
            ghostClass: "gs-ghost-" + id,
            html: '<span class="gs-ghost-hose ' + id + '">' + id.toUpperCase() + " HOSE</span>",
            onDrop: function (slot, hoseId) {
              skipClick = true;
              hosePick = hoseId;
              landHose(hoseId, slot);
              setTimeout(function () { skipClick = false; }, 0);
            },
          });
          el.addEventListener("pointerdown", function () {
            hoseArm = hosePick;
            hosePick = id;
          });
        });
        host.querySelectorAll(".gs-drop").forEach(function (port) {
          port.addEventListener("pointerup", function () {
            if (!hosePick) return;
            const slot = port.getAttribute("data-port") || port.getAttribute("data-slot");
            if (hosePick === "blue" && blue === "suction" && slot === "suction") return;
            if (hosePick === "red" && red === "liquid" && slot === "liquid") return;
            if (hosePick === "yellow" && yellow === slot) return;
            skipClick = true;
            landHose(hosePick, slot);
            setTimeout(function () { skipClick = false; }, 0);
          });
        });
      }
      var _gsN = host.querySelector("#gs-reads"); if (_gsN) _gsN.onclick = function (e) {
        var b = e.target.closest("[data-ref]");
        if (!b) return;
        refPick = b.getAttribute("data-ref");
        var sel = host.querySelector("#gs-ref");
        if (sel) sel.value = refPick;
        banner = refPick === job.ref
          ? "Reading the nameplate gas. " + job.ref + "."
          : "That column is " + refPick + ". This unit's nameplate is " + job.ref + ". Same coil temperatures, different saturation. Call the system on the nameplate gas.";
        paint();
      };
      var _gsRef = host.querySelector("#gs-ref"); if (_gsRef) _gsRef.onchange = function () {
        refPick = _gsRef.value;
        banner = refPick === job.ref
          ? "Reading the nameplate gas. " + job.ref + "."
          : "That column is " + refPick + ". This unit's nameplate is " + job.ref + ". Same coil temperatures, different saturation. Call the system on the nameplate gas.";
        paint();
      };
      var _gsN = host.querySelector("#gs-modes"); if (_gsN) _gsN.onclick = function (e) {
        var drillBtn = e.target.closest("[data-drill]");
        if (drillBtn) {
          var i = +drillBtn.getAttribute("data-drill");
          if (i > 0 && !drillClear[i - 1]) {
            shopBad("Finish the short one first. Then this one unlocks.");
            return paint();
          }
          drill = i;
          rep = "field";
          mode = "guide";
          GUIDE = guideFor(drill);
          step = 0;
          banner = (GUIDE[0] && GUIDE[0].say) || "";
          paint();
          return;
        }
        const repBtn = e.target.closest("[data-rep]");
        if (repBtn) {
          var which = repBtn.getAttribute("data-rep");
          if (which === "field") {
            rep = "field";
            mode = "guide";
            GUIDE = guideFor(drill);
            step = 0;
            banner = (GUIDE[0] && GUIDE[0].say) || "";
            paint();
            return;
          }
          rep = which;
          GUIDE = READ;
          mode = "guide";
          step = 0;
          resetSet();
          banner = "Charged system. Cap the yellow hose, run it, then superheat and subcooling.";
          paint();
          return;
        }
        const b = e.target.closest("[data-mode]");
        if (!b) return;
        mode = b.getAttribute("data-mode");
        step = 0;
        guess = null;
        revealed = false;
        banner = "";
        blue = null;
        red = null;
        yellow = null;
        blown = false;
        hosePick = null;
        loOpen = false;
        hiOpen = false;
        refPick = null;
        shIn = "";
        scIn = "";
        running = mode === "unguided";
        machineOn = false;
        pumpOn = false;
        coresOut = false;
        empty = false;
        pulled = false;
        clampS = false;
        clampL = false;
        purged = false;
        if (mode === "unguided") job = JOBS[1];
        else job = JOBS[0];
        paint();
      };
      var _gsN = host.querySelector("#gs-next"); if (_gsN) _gsN.onclick = function () {
        if (mode !== "guide") return;
        if (rep === "field") {
          const id = GUIDE[step] && GUIDE[step].id;
          const ready = {
            nameplate: true,
            seat: !loOpen && !hiOpen,
            blue: blue === "suction",
            red: red === "liquid",
            yrec: yellow === "recover",
            loopen: loOpen && !hiOpen,
            recrun: machineOn,
            recoff: !machineOn && !loOpen,
            yvac: yellow === "vac",
            cores: coresOut,
            bothopen: loOpen && hiOpen && !running,
            pumpon: pumpOn && coresOut,
            hold: pulled && !loOpen && !hiOpen,
          }[id];
          if (id && id.indexOf("look-") === 0) {
            shopBad("Tap it on the picture.");
            return paint();
          }
          if (!ready) {
            shopBad(nextMove());
            return paint();
          }
          if (step >= GUIDE.length - 1) {
            drillClear[drill] = true;
            if (onXp) onXp(20);
            feel("ok", "Drill done");
            banner = drill < LADDER.length - 1
              ? "Drill done. Hit " + LADDER[drill + 1].name + ". Same picture."
              : "Vacuum rep is done. Charge is in the tank. System is empty and dry. Read a running system is the last card, and only after this.";
            paint();
            return;
          }
        }
        if (step < GUIDE.length - 1) step++;
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-back"); if (_gsN) _gsN.onclick = function () {
        if (mode !== "guide") return;
        if (step > 0) step--;
        paint();
      };
      var _gsN = host.querySelector("#gs-check"); if (_gsN) _gsN.onclick = gradeMath;
      var _gsN = host.querySelector("#gs-grade"); if (_gsN) _gsN.onclick = gradeCall;
      var _gsN = host.querySelector("#gs-call"); if (_gsN) _gsN.onclick = function (e) {
        const b = e.target.closest("[data-guess]");
        if (!b) return;
        guess = +b.getAttribute("data-guess");
        paint();
      };
      var _gsN = host.querySelector("#gs-jobs"); if (_gsN) _gsN.onclick = function (e) {
        const b = e.target.closest("[data-job]");
        if (!b) return;
        job = JOBS.find(function (j) {
          return j.id === b.getAttribute("data-job");
        }) || JOBS[0];
        guess = null;
        revealed = false;
        banner = job.brief;
        step = 0;
        refPick = null;
        blue = null;
        red = null;
        yellow = null;
        blown = false;
        hosePick = null;
        loOpen = false;
        hiOpen = false;
        shIn = "";
        scIn = "";
        running = mode === "unguided";
        machineOn = false;
        pumpOn = false;
        coresOut = false;
        empty = false;
        pulled = false;
        clampS = false;
        clampL = false;
        purged = false;
        needleL = 0;
        needleH = 0;
        paint();
      };
      const shi = host.querySelector("#gs-shin");
      const sci = host.querySelector("#gs-scin");
      if (shi) shi.oninput = function () {
        shIn = shi.value;
      };
      if (sci) sci.oninput = function () {
        scIn = sci.value;
      };
      const cvs = host.querySelector("#gs-canvas");
      if (cvs) {
        cvs.onclick = function (ev) {
          const rect = cvs.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const x = ((ev.clientX - rect.left) / rect.width) * FACE_W;
          const y = ((ev.clientY - rect.top) / rect.height) * FACE_H;
          if (Math.hypot(x - KNOB_LO.x, y - KNOB_LO.y) < 22) {
            toggleHandwheel("lo");
          } else if (Math.hypot(x - KNOB_HI.x, y - KNOB_HI.y) < 22) {
            toggleHandwheel("hi");
          }
        };
      }
    }

    var gsCoachBoot = false;

    function dressToast(el) {
      if (!el || !el.classList || !el.classList.contains("toast")) return;
      if (el.querySelector(".gs-toast-x")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gs-toast-x";
      btn.textContent = "Close";
      btn.setAttribute("aria-label", "Close");
      btn.onclick = function (ev) {
        if (ev) ev.stopPropagation();
        if (el.parentNode) el.parentNode.removeChild(el);
      };
      el.appendChild(btn);
    }

    function armToastClose() {
      document.querySelectorAll("#toast-host .toast").forEach(dressToast);
      var hostEl = document.getElementById("toast-host");
      if (!hostEl || hostEl.getAttribute("data-gs-toast") === "1") return;
      hostEl.setAttribute("data-gs-toast", "1");
      if (!global.MutationObserver) return;
      new MutationObserver(function (recs) {
        recs.forEach(function (rec) {
          rec.addedNodes.forEach(function (node) {
            if (node && node.nodeType === 1) dressToast(node);
          });
        });
      }).observe(hostEl, { childList: true });
    }

    function parkPhoneCoach() {
      if (gsCoachBoot) return;
      if (!(global.matchMedia && global.matchMedia("(max-width: 720px)").matches)) return;
      var bar = document.getElementById("pf-coach-bar");
      if (!bar) return;
      gsCoachBoot = true;
      bar.dataset.shut = "1";
      bar.hidden = true;
      if (global.PlayFeel) global.PlayFeel.coach(host, holdLine || nextMove());
    }

    function ensureGsScale() {
      var prev = document.getElementById("gs-scale") || document.getElementById("gs-scale-v21") || document.getElementById("gs-scale-v22") || document.getElementById("gs-scale-v24") || document.getElementById("gs-scale-v25") || document.getElementById("gs-scale-v26") || document.getElementById("gs-scale-v27") || document.getElementById("gs-scale-v31") || document.getElementById("gs-scale-v32") || document.getElementById("gs-scale-v33");
      if (prev) prev.remove();
      if (document.getElementById("gs-scale-v34")) return;
      const style = document.createElement("style");
      style.id = "gs-scale-v34";
      style.textContent = [
        "#screen-gauges.screen.active{max-width:100%;overflow-x:hidden;overflow-y:auto}",
        "@media (max-width:720px){#screen-gauges.screen.active{height:100dvh;max-height:100dvh}#screen-gauges .gs-lab{max-width:100%;min-width:0;overflow-x:hidden;box-sizing:border-box}}",
        "#screen-gauges #gs-canvas{box-sizing:border-box!important;display:block!important;width:min(100%,calc(min(40dvh,320px) * 2))!important;max-width:100%!important;height:auto!important;max-height:min(40dvh,320px)!important;min-height:0!important;aspect-ratio:2/1!important;margin:8px auto!important;background:#1a1e22!important;border-radius:12px}",
        "#screen-gauges .gs-bench{position:relative;display:flex;flex-direction:column;gap:8px;align-items:stretch;max-width:1100px;min-width:0;margin:8px auto}",
        "@media (max-width:720px){#screen-gauges .gs-bench{max-width:100%}}",
        "#screen-gauges .gs-rig{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3}",
        "#screen-gauges .gs-manifold{position:relative;z-index:2;display:flex;flex-direction:column;gap:8px;min-width:0;max-width:100%}",
        "#screen-gauges .gs-hoses{display:flex;flex-direction:row;flex-wrap:wrap;gap:8px;align-items:stretch;max-width:100%;min-width:0}",
        "#screen-gauges .gs-hose{display:flex!important;flex-direction:row;align-items:center;justify-content:flex-start;gap:8px;flex:1 1 140px;min-width:0;max-width:100%;min-height:0;height:auto;padding:8px 10px;border-radius:12px;border:2px solid #3a424a;background:#10161c;color:#f4efe6;cursor:grab;box-sizing:border-box;touch-action:none}",
        "#screen-gauges .gs-hose svg{width:120px;height:auto;aspect-ratio:140/32;flex:0 0 auto;max-width:46%;display:block}",
        "#screen-gauges .gs-hose span{font-size:14px;font-weight:700;line-height:1.2;text-align:left;min-width:0}",
        "#screen-gauges .gs-hose.blue{box-shadow:inset 6px 0 0 #1f6feb}",
        "#screen-gauges .gs-hose.red{box-shadow:inset 6px 0 0 #c81e1e}",
        "#screen-gauges .gs-hose.yellow{box-shadow:inset 6px 0 0 #e2b43a}",
        "#screen-gauges .gs-hose.pick{outline:3px solid #e8c450;outline-offset:2px}",
        "#screen-gauges .gs-hose.landed{opacity:1}",
        "#screen-gauges .gs-yellows{display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
        "#screen-gauges .gs-yellows p{margin:0;flex:1 1 100%;font-size:13px;color:#e2b43a;font-weight:700}",
        "#screen-gauges .gs-y{flex:0 1 220px;min-height:44px;border-radius:10px;border:2px solid #8a6a12;background:#1a160c;color:#f4efe6;font-weight:700;padding:8px}",
        "#screen-gauges .gs-scene{position:relative;z-index:2;width:min(100%,calc(min(72vh,720px) * 16 / 9));max-width:100%;aspect-ratio:16/9;margin:0 auto;background:#c8c4bc;border-radius:12px;overflow:hidden}",
        "#screen-gauges .gs-scene img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;background:#c8c4bc}",
        "#screen-gauges .gs-drills{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 6px}",
        "#screen-gauges .gs-drills button{border-radius:8px;border:1px solid #3a424a;background:#10161c;color:#f4efe6;padding:7px 10px;font-weight:700}",
        "#screen-gauges .gs-drills button.on{border-color:#e8c450;color:#e8c450}",
        "#screen-gauges .gs-drills button:disabled{opacity:.35}",
        "#screen-gauges .gs-manifold[hidden],#screen-gauges #gs-next[hidden],#screen-gauges #gs-reads[hidden],#screen-gauges .gs-ref[hidden],#screen-gauges #gs-pt[hidden],#screen-gauges .gs-practice[hidden],#screen-gauges #gs-machine[hidden],#screen-gauges #gs-pump[hidden],#screen-gauges #gs-cores[hidden]{display:none !important}",
        "#screen-gauges .gs-drag-hint[hidden],#screen-gauges .gs-hub[hidden],#screen-gauges .gs-coach[hidden],#screen-gauges .gs-meaning.hidden,#screen-gauges #gs-guide-ui{display:none !important}",
        "#screen-gauges .gs-arrows{position:absolute;inset:0;width:100%;height:100%;z-index:6;pointer-events:none}",
        "#screen-gauges .gs-arrow line{stroke:#f6f1e4;stroke-width:3;stroke-linecap:round}",
        "#screen-gauges .gs-arrow text{font:700 16px sans-serif;fill:#111;stroke:#f6f1e4;stroke-width:4;paint-order:stroke}",
        "#screen-gauges .gs-arrow{opacity:0}",
        "#screen-gauges .gs-arrow.on{opacity:1}",
        "#screen-gauges .gs-arrow.on line{stroke:#f5d76e;stroke-width:4;marker-end:url(#gs-ah-on)}",
        "#screen-gauges .gs-arrow line{marker-end:url(#gs-ah)}",
        "#screen-gauges .gs-arrow.on text{fill:#f5d76e;font-size:16px}",
        "@keyframes gs-arrow-move{50%{transform:translateY(10px)}}",
        "#screen-gauges .gs-arrow.on{animation:gs-arrow-move .7s ease-in-out infinite}",
        "#screen-gauges .gs-scene .gs-tag{display:none}",
        "#screen-gauges .gs-machine{position:absolute;z-index:4;transform:translate(-50%,-50%);width:18%;height:28%;padding:0;border:0;background:transparent;cursor:pointer}",
        "#screen-gauges .gs-machine.vac{left:57%;top:54%;width:16%;height:24%}",
        "#screen-gauges .gs-machine.recover{left:74%;top:40%;width:16%;height:28%}",
        "#screen-gauges .gs-machine .gs-tag{position:absolute;left:0;bottom:0;min-width:0;padding:3px 6px;border-radius:6px;border:2px solid #e2b43a;background:rgba(12,10,8,.88)}",
        "#screen-gauges .gs-machine.on,#screen-gauges .gs-machine.got-yellow{outline:3px solid #e2b43a;outline-offset:2px;background:rgba(226,180,58,.18)}",
        "#screen-gauges .gs-valve{position:absolute;z-index:4;width:auto;min-height:0;margin:0;padding:0;border:0;background:transparent;box-shadow:none;transform:translate(-50%,-50%);color:#f4efe6}",
        "#screen-gauges .gs-pin{display:block;width:34px;height:34px;border-radius:50%;border:3px solid #e8c450;background:rgba(232,196,80,.28);box-shadow:0 0 0 3px rgba(0,0,0,.55)}",
        "#screen-gauges .gs-valve.suction .gs-pin{border-color:#7eb6ff;background:rgba(31,111,235,.35)}",
        "#screen-gauges .gs-valve.liquid .gs-pin{border-color:#ff8d8d;background:rgba(200,30,30,.35)}",
        "#screen-gauges .gs-tag{position:absolute;left:40px;display:block;min-width:108px;padding:4px 8px;border-radius:8px;border:2px solid #e8c450;background:rgba(12,10,8,.9);text-align:left;line-height:1.15}",
        "#screen-gauges .gs-tag strong{display:block;font-size:13px;color:#f0d878}",
        "#screen-gauges .gs-tag em{display:block;font-style:normal;font-size:11px;color:#f4efe6}",
        "#screen-gauges .gs-valve.suction{left:32%;top:31%}",
        "#screen-gauges .gs-valve.suction .gs-tag{top:-8px;left:auto;right:42px}",
        "#screen-gauges .gs-valve.liquid{left:33%;top:50%}",
        "#screen-gauges .gs-valve.liquid .gs-tag{top:6px;left:auto;right:42px}",
        "#screen-gauges .gs-valve.liquid .gs-tag{top:8px}",
        "#screen-gauges .gs-valve.on .gs-pin{box-shadow:0 0 0 3px #fff,0 0 12px #e8c450}",
        "#screen-gauges .gs-valve.got-blue .gs-pin{background:#1f6feb}",
        "#screen-gauges .gs-valve.got-red .gs-pin{background:#c81e1e}",
        "#screen-gauges .gs-y.on, #screen-gauges .gs-y.got-yellow{border-color:#e2b43a;box-shadow:inset 0 0 0 3px #e2b43a}",
        "#screen-gauges .gs-drop.hint{outline:3px solid #e8c450;outline-offset:3px}",
        "#screen-gauges .gs-ref{display:flex;align-items:center;gap:8px;margin:8px auto;max-width:860px;font-weight:700}",
        "#screen-gauges .gs-ref select{font:600 16px/1.2 inherit;padding:8px 10px;border-radius:8px;background:#10161c;color:#f4efe6;border:1px solid #3a424a}",
        "#screen-gauges .gs-pt{margin:0 auto 8px;max-width:860px;color:#e8c450;font-size:14px;line-height:1.4}",
        "#screen-gauges .gs-reads{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;max-width:860px;margin:0 auto 10px}",
        "#screen-gauges .gs-readcard{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;background:#10161c;color:#f4efe6;border:1px solid #3a424a;border-radius:10px;padding:8px 10px;cursor:pointer}",
        "#screen-gauges .gs-readcard b{color:#e8c450;font-size:14px}",
        "#screen-gauges .gs-readcard span{font-size:12px;line-height:1.3;color:#d5dde4}",
        "#screen-gauges .gs-readcard.on{border-color:#e8c450;box-shadow:inset 0 0 0 1px #e8c450}",
        "#screen-gauges .gs-ports{display:flex;flex-wrap:wrap;gap:8px;max-width:860px;margin:8px auto}",
        "#screen-gauges .gs-ports .gs-drop{min-height:48px;padding:6px 10px}",
        ".lt-drag-ghost .gs-ghost-hose{display:block;padding:8px 10px;border-radius:8px;font-weight:700}",
        ".lt-drag-ghost .gs-ghost-hose.blue{background:#1f6feb}",
        ".lt-drag-ghost .gs-ghost-hose.red{background:#c81e1e}",
        ".lt-drag-ghost .gs-ghost-hose.yellow{background:#e2b43a;color:#1a1408}",
        "#screen-gauges.screen.active{overflow-x:hidden!important;max-width:100vw!important}",
        "#screen-gauges .gs-lab,#screen-gauges .gs-bench,#screen-gauges .gs-head,#screen-gauges .gs-acts,#screen-gauges .gs-nav,#screen-gauges .gs-read,#screen-gauges .sf-row,#screen-gauges .gs-scene,#screen-gauges .gs-manifold{max-width:min(880px,100%)!important;min-width:0!important;box-sizing:border-box!important}",
        "#screen-gauges .gs-lab{margin-left:auto!important;margin-right:auto!important}",
        "#screen-gauges .gs-scene{width:min(100%,calc(min(42vh,420px) * 16 / 9))!important;max-height:min(42vh,420px)!important;height:auto!important;aspect-ratio:16/9!important;overflow:hidden!important}",
        "#screen-gauges .gs-scene img,#screen-gauges img{width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important}",
        "#screen-gauges #gs-canvas{object-fit:contain!important;max-width:100%!important;width:min(100%,calc(min(28vh,240px) * 2))!important;max-height:min(28vh,240px)!important;height:auto!important;aspect-ratio:2/1!important}",
        "#screen-gauges .sf-row{display:flex!important;flex-wrap:nowrap!important;gap:8px!important;width:100%!important;margin:8px auto 12px!important}",
        "#screen-gauges .sf-face{flex:1 1 0!important;min-width:0!important;overflow:visible!important;padding:8px 12px 8px 16px!important}",
        "#screen-gauges .sf-face strong{font-size:clamp(22px,4vw,28px)!important;line-height:1.05!important;transform:none!important;animation:none!important;display:block!important;position:static!important}",
        "body:has(#screen-gauges.active) .pf-coach{left:8px!important;right:auto!important;bottom:8px!important;top:auto!important;width:min(220px,calc(100vw - 24px))!important;max-height:96px!important;overflow:auto!important;z-index:70!important}",
        "body:has(#screen-gauges.active) .pf-coach-open{top:auto!important;bottom:10px!important;left:8px!important;right:auto!important}",
        "@media (max-width:720px){body:has(#screen-gauges.active) .pf-coach{left:8px!important;right:auto!important;bottom:80px!important;width:min(188px,calc(100vw - 24px))!important;max-height:84px!important}body:has(#screen-gauges.active) .pf-coach-open{top:auto!important;left:auto!important;right:8px!important;bottom:80px!important}}",
        "body:has(#screen-gauges.active) #toast-host{pointer-events:auto!important;top:8px!important;right:8px!important;left:auto!important;bottom:auto!important;width:min(220px,calc(100vw - 16px))!important;z-index:90!important}",
        "body:has(#screen-gauges.active) .toast{pointer-events:auto!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;text-align:left!important}",
        "body:has(#screen-gauges.active) .gs-toast-x{flex:0 0 auto;margin:0;min-height:28px;padding:2px 8px;border-radius:8px;border:1px solid #7fd99a;background:#10161c;color:#f4efe6;font-weight:700}",
        "body:has(#screen-gauges.active) #form-badge{position:fixed!important;z-index:96!important;top:8px!important;left:8px!important;right:auto!important;bottom:auto!important;width:max-content!important;max-width:min(220px,calc((100vw - 880px) / 2 - 12px))!important;margin:0!important;padding:4px 8px!important;background:#14181c!important;color:#f4efe6!important;border:1px solid #e8c450!important;border-radius:10px!important;display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:6px!important;box-sizing:border-box!important}",
        "body:has(#screen-gauges.active) #form-badge .form-badge-extra{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:6px!important;width:auto!important}",
        "body:has(#screen-gauges.active) #form-badge button{margin:0!important}",
        "@media (max-width:900px){body:has(#screen-gauges.active) #form-badge{display:none!important}body:has(#screen-gauges.active) #screen-gauges .gs-lab{padding-top:4px!important;padding-bottom:64px!important}body:has(#screen-gauges.active) #toast-host{top:40px!important;left:6px!important;right:auto!important;width:min(240px,calc(100vw - 12px))!important}body:has(#screen-gauges.active) #drip-ear{top:50px!important;bottom:auto!important;left:8px!important;right:auto!important;width:min(210px,56vw)!important;max-height:44px!important}}",
        "#screen-gauges .gs-check{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;margin:4px 8px!important;padding:0!important;list-style:none!important;overflow:visible!important;max-width:100%!important;width:auto!important}",
        "#screen-gauges .gs-check li{min-width:0!important;max-width:100%!important;padding:4px 8px!important;border:1px solid #3a4654!important;border-radius:8px!important;color:#f6f0e2!important;font:600 12px/1.2 system-ui,sans-serif!important;white-space:normal!important}",
        "@media (max-width:420px){#screen-gauges .gs-check{grid-template-columns:1fr!important}}",
        "#screen-gauges .gs-check li.done{color:#7fd99a;border-color:#246b45}",
        "#screen-gauges .gs-inside{margin:8px;padding:8px;border:1px solid #d7b56a;border-radius:12px;background:#10161c;color:#f6f0e2}",
        "#screen-gauges .gs-inside-head{display:flex;justify-content:space-between;align-items:center;gap:8px}",
        "#screen-gauges .gs-cut{width:100%;height:auto;max-height:220px;background:#0c1014;border-radius:8px}",
        "#screen-gauges .gs-cut .lowflow,#screen-gauges .gs-cut .cross{opacity:0}",
        "#screen-gauges .gs-cut[data-frame='1'] .lowflow{opacity:1}",
        "#screen-gauges .gs-cut[data-frame='2'] .cross{opacity:1}",
        "body.land-on:has(#screen-gauges.active) .land-turn{top:auto!important;bottom:8px!important;left:8px!important;z-index:30!important}",
        "#screen-gauges .gs-lab.is-read{overflow-x:hidden!important;overflow-y:auto!important;max-height:100dvh!important;-webkit-overflow-scrolling:touch!important}",
        "#screen-gauges .gs-lcd{background:#0c110e;color:#c6f59a;border:1px solid #2c4630;border-radius:12px;padding:8px 10px;margin:0 0 6px;font-family:ui-monospace,monospace}",
        "#screen-gauges .gs-lcd[hidden]{display:none!important}",
        "#screen-gauges .gs-manifold.is-digital #gs-canvas{display:none!important}",
        "#screen-gauges .gs-lcd-top{display:flex;justify-content:space-between;font-size:12px;letter-spacing:.04em}",
        "#screen-gauges .gs-lcd-row{display:flex;gap:8px;margin-top:6px}",
        "#screen-gauges .gs-lcd-side{flex:1 1 0;min-width:0;border:1px solid #244028;border-radius:8px;padding:6px 8px}",
        "#screen-gauges .gs-lcd-side.lo{box-shadow:inset 4px 0 0 #1f6feb}",
        "#screen-gauges .gs-lcd-side.hi{box-shadow:inset 4px 0 0 #c81e1e}",
        "#screen-gauges .gs-lcd-side em{font-style:normal;color:#8fbf73;font-size:12px}",
        "#screen-gauges .gs-lcd-side strong{display:block;font-size:clamp(36px,9vw,56px);line-height:.95;color:#e7ffc4;letter-spacing:-1px}",
        "#screen-gauges .gs-lcd-side small{display:block;color:#b7e48a;font-size:13px}",
        "#screen-gauges .gs-lcd-math{display:flex;justify-content:space-between;margin-top:6px;font-weight:700;font-size:16px}",
        "#screen-gauges .sf-face strong{font-size:clamp(26px,6vw,36px)!important}",
        "#screen-gauges .gs-hose-svg,#screen-gauges .gs-rig,#screen-gauges .gs-arrows{display:none!important}",
        "#screen-gauges .gs-scene{overflow:hidden!important}",
        "#screen-gauges .gs-pin{width:16px;height:16px;background:transparent;border-width:2px;box-shadow:0 0 0 2px rgba(0,0,0,.7)}",
        "#screen-gauges .gs-valve.got-blue .gs-pin{background:transparent;border-color:#7eb6ff;box-shadow:0 0 0 2px #1f6feb}",
        "#screen-gauges .gs-valve.got-red .gs-pin{background:transparent;border-color:#ff8d8d;box-shadow:0 0 0 2px #c81e1e}",
        "#screen-gauges .gs-scene.hook-open .gs-valve.suction{left:22%;top:38%}",
        "#screen-gauges .gs-scene.hook-open .gs-valve.liquid{left:24%;top:52%}",
        "#screen-gauges .gs-scene.hook-open .gs-machine.vac{left:58%;top:45%}",
        "#screen-gauges .gs-scene.hook-open .gs-machine.recover{left:75%;top:40%}",
        "#screen-gauges .gs-scene.hook-read .gs-valve.suction{left:27%;top:42%}",
        "#screen-gauges .gs-scene.hook-read .gs-valve.liquid{left:28%;top:58%}",
        "#screen-gauges .gs-scene.hook-read .gs-machine.vac{left:65%;top:45%}",
        "#screen-gauges .gs-scene.hook-read .gs-machine.recover{left:80%;top:42%}",
        "#screen-gauges .gs-scene.hook-recover .gs-valve.suction{left:22%;top:40%}",
        "#screen-gauges .gs-scene.hook-recover .gs-valve.liquid{left:24%;top:55%}",
        "#screen-gauges .gs-scene.hook-recover .gs-machine.vac{left:58%;top:48%}",
        "#screen-gauges .gs-scene.hook-recover .gs-machine.recover{left:78%;top:45%}",
        "#screen-gauges .gs-scene.hook-vac .gs-valve.suction{left:20%;top:42%}",
        "#screen-gauges .gs-scene.hook-vac .gs-valve.liquid{left:22%;top:58%}",
        "#screen-gauges .gs-scene.hook-vac .gs-machine.vac{left:62%;top:48%}",
        "#screen-gauges .gs-scene.hook-vac .gs-machine.recover{left:85%;top:42%}",
        "@media (max-width:720px){#screen-gauges .gs-scene{overflow:hidden!important}#screen-gauges .gs-hose-svg,#screen-gauges .gs-rig,#screen-gauges .gs-arrows{display:none!important}}",
      ].join("");
      document.head.appendChild(style);
    }

    function mount() {
      host.innerHTML =
        '<div class="gs-lab">' +
        '<header class="gs-head">' +
        '<button type="button" class="btn" id="gs-hub">Shop floor</button>' +
        '<button type="button" class="btn primary" id="gs-face-analog">Analog</button>' +
        '<button type="button" class="btn" id="gs-face-digital">Digital</button>' +
        '<button type="button" class="btn" id="gs-inside">See inside</button>' +
        '<a class="btn" href="sh-sc-sheet.html" target="_blank" rel="noopener">Print SH / SC sheet</a>' +
        '<div class="brand-bar"><div class="brand-mark">' +
        ((global.LtBrand && global.LtBrand.mark) || "LT") +
        '</div><div class="brand-word"><strong>MANIFOLD SCHOOL</strong><span>Blue suction · red liquid · yellow utility · SH & SC</span></div></div>' +
        '<div class="gs-modes" id="gs-modes">' +
        '<div class="gs-drills" id="gs-drills">' +
        '<button type="button" data-drill="0">1 · Name it</button>' +
        '<button type="button" data-drill="1">2 · Two hoses</button>' +
        '<button type="button" data-drill="2">3 · Recover</button>' +
        '<button type="button" data-drill="3">4 · Vacuum</button>' +
        '<button type="button" data-rep="read">5 · Read it running</button>' +
        "</div>" +
        '<button type="button" class="btn" data-mode="guide">Guided</button>' +
        '<button type="button" class="btn" data-mode="unguided">Unguided</button>' +
        "</div>" +
        '<button type="button" class="btn" id="gs-stuck">HUB · I\'m stuck</button>' +
        "</header>" +
        '<p class="gs-drag-hint">Drag blue onto the big valve. Drag red onto the small valve. Cap the yellow hose. Then read the needles.</p>' +
        '<ol class="gs-check" id="gs-hose-check"></ol>' +
        '<div class="gs-bench" id="gs-bench">' +
        '<svg class="gs-hose-svg" id="gs-hose-svg" aria-hidden="true"></svg>' +
        '<div class="gs-manifold">' +
        '<canvas id="gs-canvas" width="720" height="360" aria-label="Analog manifold gauge set"></canvas>' +
        '<div class="gs-lcd" id="gs-lcd" hidden>' +
        '<div class="gs-lcd-top"><b id="gs-lcd-ref">R-410A</b><span>Digital manifold</span></div>' +
        '<div class="gs-lcd-row">' +
        '<div class="gs-lcd-side lo"><em>Low</em><strong id="gs-lcd-lo">—</strong><span>psig</span><small id="gs-lcd-losat">sat —</small></div>' +
        '<div class="gs-lcd-side hi"><em>High</em><strong id="gs-lcd-hi">—</strong><span>psig</span><small id="gs-lcd-hisat">sat —</small></div>' +
        '</div>' +
        '<div class="gs-lcd-math"><span id="gs-lcd-sh">SH —</span><span id="gs-lcd-sc">SC —</span></div>' +
        '</div>' +
        '<div class="gs-hoses" id="gs-hoses">' +
        '<button type="button" class="gs-hose blue" data-hose="blue" id="gs-hose-blue"><svg viewBox="0 0 140 32" aria-hidden="true"><path d="M8 16 C 36 2, 78 30, 124 16" stroke="#1f6feb" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="126" cy="16" r="7" fill="#d7b56a" stroke="#6b4a22" stroke-width="2"/></svg><span>Blue hose</span></button>' +
        '<button type="button" class="gs-hose yellow" data-hose="yellow" id="gs-hose-yellow"><svg viewBox="0 0 140 32" aria-hidden="true"><path d="M8 16 C 36 30, 78 2, 124 16" stroke="#e2b43a" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="126" cy="16" r="7" fill="#d7b56a" stroke="#6b4a22" stroke-width="2"/></svg><span>Yellow hose</span></button>' +
        '<button type="button" class="gs-hose red" data-hose="red" id="gs-hose-red"><svg viewBox="0 0 140 32" aria-hidden="true"><path d="M8 16 C 40 4, 90 28, 124 16" stroke="#c81e1e" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="126" cy="16" r="7" fill="#d7b56a" stroke="#6b4a22" stroke-width="2"/></svg><span>Red hose</span></button>' +
        "</div>" +
        '<div class="gs-yellows" id="gs-yellows">' +
        '<button type="button" class="gs-drop gs-y" data-slot="capped" data-port="capped">Cap the yellow hose · read the system</button>' +
        "</div></div>" +
        '<div class="gs-scene" id="gs-cond">' +
        '<img id="gs-cond-img" src="gauges/hook-open.jpg" alt="Condenser, manifold, vacuum pump, and recovery machine on one pad" draggable="false" />' +
        '<svg class="gs-rig" id="gs-rig-svg" aria-hidden="true"></svg>' +
        '<svg class="gs-arrows" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        '<defs>' +
        '<marker id="gs-ah" markerUnits="userSpaceOnUse" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="28" markerHeight="28" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f6f1e4"/></marker>' +
        '<marker id="gs-ah-on" markerUnits="userSpaceOnUse" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="36" markerHeight="36" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#f5d76e"/></marker>' +
        "</defs>" +
        '<g class="gs-arrow" data-arrow="suction"><line x1="230" y1="210" x2="470" y2="300"/><text x="24" y="200">Suction</text></g>' +
        '<g class="gs-arrow" data-arrow="liquid"><line x1="200" y1="430" x2="470" y2="455"/><text x="24" y="420">Liquid</text></g>' +
        '<g class="gs-arrow" data-arrow="vac"><line x1="340" y1="600" x2="860" y2="520"/><text x="24" y="630">Vacuum pump</text></g>' +
        '<g class="gs-arrow" data-arrow="recover"><line x1="340" y1="740" x2="1140" y2="360"/><text x="24" y="790">Recovery</text></g>' +
        "</svg>" +
        '<p class="gs-stepcap" id="gs-stepcap"></p>' +
        '<button type="button" class="gs-drop gs-machine vac" data-slot="vac" data-port="vac" aria-label="Vacuum pump"><span class="gs-tag"><strong>Vacuum pump</strong></span></button>' +
        '<button type="button" class="gs-drop gs-machine recover" data-slot="recover" data-port="recover" aria-label="Recovery machine"><span class="gs-tag"><strong>Recovery machine</strong></span></button>' +
        '<button type="button" class="gs-drop gs-valve suction" data-slot="suction" data-port="suction"><i class="gs-pin"></i><span class="gs-tag"><strong>Suction valve</strong><em>Big line · blue hose</em></span></button>' +
        '<button type="button" class="gs-drop gs-valve liquid" data-slot="liquid" data-port="liquid"><i class="gs-pin"></i><span class="gs-tag"><strong>Liquid valve</strong><em>Small line · red hose</em></span></button>' +
        "</div></div>" +
        '<div class="sf-row"><div class="sf-face" id="gs-lo-face"><em>Low side</em><strong>0</strong><span>psig</span></div><div class="sf-face" id="gs-hi-face"><em>High side</em><strong>0</strong><span>psig</span></div></div>' +
        '<label class="gs-ref">Refrigerant <select id="gs-ref" aria-label="Refrigerant">' +
        '<option value="R-410A">R-410A</option><option value="R-22">R-22</option><option value="R-134a">R-134a</option><option value="R-32">R-32</option><option value="R-454B">R-454B</option>' +
        '</select></label>' +
        '<p class="gs-pt" id="gs-pt"></p>' +
        '<div class="gs-reads" id="gs-reads" aria-label="Pressure by refrigerant"></div>' +
        '<div class="gs-inside" id="gs-inside-card" hidden>' +
        '<div class="gs-inside-head"><strong>Inside the manifold</strong><button type="button" id="gs-inside-x">Close</button></div>' +
        '<svg class="gs-cut" viewBox="0 0 640 240" data-frame="0" aria-label="Cutaway of a manifold gauge set">' +
        '<rect x="70" y="70" width="500" height="100" rx="18" fill="#1c242c" stroke="#d7b56a" stroke-width="3"/>' +
        '<circle cx="150" cy="120" r="36" fill="#0e2a44" stroke="#1f6feb" stroke-width="6"/>' +
        '<circle cx="490" cy="120" r="36" fill="#3a1010" stroke="#c81e1e" stroke-width="6"/>' +
        '<text x="150" y="126" text-anchor="middle" fill="#d7ecff" font-size="14" font-weight="700">LOW</text>' +
        '<text x="490" y="126" text-anchor="middle" fill="#ffd0d0" font-size="14" font-weight="700">HIGH</text>' +
        '<path class="seat" d="M210 120 H270" stroke="#9ad" stroke-width="10" stroke-linecap="round"/>' +
        '<path class="seat" d="M370 120 H430" stroke="#e88" stroke-width="10" stroke-linecap="round"/>' +
        '<path class="lowflow" d="M210 120 H300" stroke="#1f6feb" stroke-width="8" stroke-linecap="round" stroke-dasharray="10 8"/>' +
        '<path class="cross" d="M250 120 H390" stroke="#e2b43a" stroke-width="8" stroke-linecap="round" stroke-dasharray="10 8"/>' +
        '<rect x="300" y="96" width="18" height="48" rx="4" fill="#6d5b3c"/>' +
        '<rect x="322" y="96" width="18" height="48" rx="4" fill="#6d5b3c"/>' +
        '<text x="309" y="188" text-anchor="middle" fill="#f6f0e2" font-size="12">low wheel</text>' +
        '<text x="331" y="188" text-anchor="middle" fill="#f6f0e2" font-size="12">high wheel</text>' +
        '<path d="M320 96 V52 H320" stroke="#e2b43a" stroke-width="8" fill="none"/>' +
        '<text x="360" y="46" fill="#e2b43a" font-size="13" font-weight="700">yellow · center</text>' +
        '</svg>' +
        '<p id="gs-inside-line">Handles shut. Each gauge sees only its own hose.</p>' +
        '</div>' +
        '<div class="gs-acts">' +
        '<button type="button" class="btn" id="gs-lo">Low seated</button>' +
        '<button type="button" class="btn" id="gs-hi">High seated</button>' +
        '<button type="button" class="btn" id="gs-purge">Purge hoses</button>' +
        '<button type="button" class="btn" id="gs-machine">Recovery machine ON</button>' +
        '<button type="button" class="btn" id="gs-pump">Vacuum pump ON</button>' +
        '<button type="button" class="btn" id="gs-cores">Cores out</button>' +
        '<button type="button" class="btn primary" id="gs-run">Start compressor</button>' +
        '<button type="button" class="btn" id="gs-clamp-s">Suction clamp</button>' +
        '<button type="button" class="btn" id="gs-clamp-l">Liquid clamp</button>' +
        '<button type="button" class="btn" id="gs-reset">Reset set</button>' +
        "</div>" +
        '<div class="gs-nav">' +
        '<button type="button" class="btn" id="gs-back">Back</button>' +
        '<button type="button" class="btn" id="gs-next">Next step</button>' +
        '<button type="button" class="btn primary" id="gs-grade">Lock the call</button>' +
        "</div>" +
        '<div class="gs-practice" id="gs-practice-ui"><p class="eyebrow" id="gs-job-brief"></p><div class="gs-jobs" id="gs-jobs">' +
        JOBS.map(function (j) {
          return '<button type="button" class="btn" data-job="' + j.id + '">' + j.title + "</button>";
        }).join("") +
        "</div></div>" +
        '<p class="gs-coach" id="gs-coach"></p>' +
        '<p class="gs-hub" id="gs-hubtalk"></p>' +
        '<p class="gs-banner hidden" id="gs-banner"></p>' +
        '<div class="gs-meaning" id="gs-meaning"></div>' +
        '<div class="gs-read">' +
        '<div><span>Blue</span><strong id="gs-pl">—</strong><small id="gs-tsl">—</small></div>' +
        '<div><span>Red</span><strong id="gs-ph">—</strong><small id="gs-tsh">—</small></div>' +
        '<div><span>Suction line</span><strong id="gs-tsuc">clamp off</strong></div>' +
        '<div><span>Liquid line</span><strong id="gs-tliq">clamp off</strong></div>' +
        "</div>" +
        '<p class="gs-formula" id="gs-formula"></p>' +
        '<div class="gs-math hidden" id="gs-math">' +
        "<label>Your SH °F <input id=\"gs-shin\" type=\"number\" inputmode=\"decimal\" placeholder=\"suction − evap dew\"></label>" +
        "<label>Your SC °F <input id=\"gs-scin\" type=\"number\" inputmode=\"decimal\" placeholder=\"start of boiling − liquid\"></label>" +
        '<button type="button" class="btn primary" id="gs-check">Check my math</button>' +
        "</div>" +
        '<div class="gs-call hidden" id="gs-call"></div>' +
        '<div class="gs-prints hidden" id="gs-prints"><p class="eyebrow">What the numbers mean</p><table><thead><tr><th>SH</th><th>SC</th><th>Call</th></tr></thead><tbody>' +
        FINGERPRINTS.map(function (f) {
          return "<tr><td>" + f.sh + "</td><td>" + f.sc + "</td><td><strong>" + f.call + "</strong><br><span>" + f.why + "</span></td></tr>";
        }).join("") +
        "</tbody></table></div>" +
        "</div>";
      mounted = true;
      bind();
      paint();
      armToastClose();
      raf = requestAnimationFrame(loop);
    }

    ensureGsScale();
    mount();
    if (!document.getElementById("gs-nav-pin")) {
      const pin = document.createElement("style");
      pin.id = "gs-nav-pin";
      pin.textContent = "@media (max-height:900px) and (min-height:501px){#screen-gauges .gs-nav{position:fixed!important;bottom:8px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;width:min(856px,calc(100vw - 16px))!important;z-index:80!important;background:#14181e!important;padding:6px!important;border-radius:12px!important;box-sizing:border-box!important;margin:0!important}#screen-gauges .gs-nav .btn{min-height:40px!important}body:has(#screen-gauges.active) .pf-coach,body:has(#screen-gauges.active) #pf-coach-bar,body:has(#screen-gauges.active) #toast-host{bottom:64px!important}}";
      document.head.appendChild(pin);
    }
    return {
      stop: function () {
        mounted = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        host.innerHTML = "";
      },
    };
  }

  global.GaugeSchool = {
    start: function (root, opts) {
      return GaugeSchool(root, opts || {});
    },
  };
})(window);
