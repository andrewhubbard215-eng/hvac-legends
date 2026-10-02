/* Manifold school — analog set, hose hookup, superheat / subcooling.
   Blue = suction. Red = liquid. Yellow = utility. Valves seated to READ. */
(function (global) {
  "use strict";

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
      [120, 260.0], [130, 297.0],
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

  function satTDew(ref, p) {
    if (global.PtChart && global.PtChart.satTDew) return global.PtChart.satTDew(ref, p);
    return satT(ref, p);
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

  const GUIDE = [
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
      say: "Yellow is utility: recovery, vacuum, cylinder. To READ, drag YELLOW onto the CAP.",
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

  function simulate(job, running, purged) {
    const ref = job.ref || "R-410A";
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
        evapSat -= 14;
        condSat -= 22;
        sh = 28;
        sc = 2;
        status = "Low side AND high side down. High SH, almost no SC.";
        fp = "HUB: LOW/LOW + high SH + low SC = undercharge. Find the leak.";
        break;
      case "overcharge":
        evapSat += 4;
        condSat += 20;
        sh = job.metering === "piston" ? 3 : 8;
        sc = 20;
        status = "High head, high SC. TXV still holds SH.";
        fp = "HUB: HIGH SC is overcharge. SH will lie to you on a TXV.";
        break;
      case "dirty_cond":
        condSat += 20;
        sc = tgtSC;
        sh = tgtSH;
        status = "High head, subcooling about normal. Dirty outdoor coil. Wash it. Not an overcharge — don't add gas.";
        fp = "HUB: high head + SC in band = condenser airflow. Overcharge would be HIGH SC.";
        break;
      case "restricted":
        evapSat -= 16;
        condSat -= 6;
        sh = 30;
        sc = 22;
        status = "Low suction, high SH, high SC. Liquid-line restriction.";
        fp = "HUB: HIGH SH + HIGH SC = restriction. Feel both sides of the drier. Don't add gas.";
        break;
      case "dirty_evap":
        evapSat -= 12;
        sh = 0;
        sc = 13;
        status = "Low suction, superheat collapsed toward 0, A-coil icing. Filter / indoor coil / blower. Don't add gas.";
        fp = "HUB: SH toward 0 = starved for AIR, not gas. Don't add gas.";
        break;
      case "weak_comp":
        evapSat += 16;
        condSat -= 22;
        sh = 18;
        sc = 4;
        status = "High suction, low head. Weak valves. Capacity is gone.";
        fp = "HUB: opposite of a restriction. Amp draw is low. That's the pump.";
        break;
      default:
        status = "Healthy " + ref + " · SH/SC in band.";
        fp = "HUB: SH/SC in band. That's a charged, breathing system.";
        break;
    }

    if (!purged && running) {
      condSat += 6;
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
      status,
      fp,
    };
  }

  function GaugeSchool(host, opts) {
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let mode = opts && (opts.unguided || opts.practice) ? "unguided" : "guide";
    if (!(opts && (opts.unguided || opts.practice || opts.guide))) {
      if (global.LtDiff === "easy") mode = "guide";
      else if (global.LtDiff === "spicy") mode = "unguided";
    }
    let step = 0;
    let job = mode === "guide" ? JOBS[0] : JOBS[1];
    let blue = null;
    let red = null;
    let yellow = null;
    let loOpen = false;
    let hiOpen = false;
    let purged = false;
    let running = mode === "unguided";
    let clampS = false;
    let clampL = false;
    let hosePick = null;
    let blown = false;
    let shIn = "";
    let scIn = "";
    let guess = null;
    let banner = "";
    let passedGuide = false;
    let needleL = 0;
    let needleH = 0;
    let raf = 0;
    let mounted = false;
    let skipClick = false;
    let revealed = false;

    function sim() {
      return simulate(job, running, purged);
    }

    function liveRead() {
      const s = sim();
      let pL = 0;
      let pH = 0;
      if (blown) return { pL: 520, pH: s.pHigh, s: s, peg: true };
      if (blue === "suction") pL = s.pLow;
      else if (blue === "liquid") pL = s.pHigh;
      else if (blue === "vac") pL = -20;
      else if (blue === "cyl") pL = 130;
      else if (blue) pL = 0;
      if (red === "liquid") pH = s.pHigh;
      else if (red === "suction") pH = s.pLow;
      else if (red === "vac") pH = 0;
      else if (red === "cyl") pH = 130;
      else if (red) pH = 0;
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
      if (loOpen && hiOpen && running) return "Both valves OPEN on a running unit — high is feeding the low through yellow. SEAT the handles to READ.";
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

    function hubLine() {
      if (blown) return "HUB: Blue on liquid is how a first-year buys a new compound. Reset. Blue is suction only.";
      if (mode === "guide") return (GUIDE[step] || GUIDE[0]).hub;
      if (revealed) return sim().fp;
      return "HUB: Same needles you see. You call it. I'm here if you're stuck — I won't give the answer away.";
    }

    function explainPressures(s) {
      const healthyLo = satP(job.ref, job.indoor - 35);
      const healthyHi = satP(job.ref, job.outdoor + 18);
      const loWord = s.pLow < healthyLo - 18 ? "LOW" : s.pLow > healthyLo + 18 ? "HIGH" : "in band";
      const hiWord = s.pHigh < healthyHi - 40 ? "LOW" : s.pHigh > healthyHi + 30 ? "HIGH" : "in band";
      const blue =
        "Blue " +
        Math.round(s.pLow) +
        " psig is evaporator pressure. P/T on " +
        job.ref +
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
          story = "Both needles where a 410A split lives on a " + job.outdoor + "° day. Charge is not the complaint.";
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

    function denyHose(msg) {
      banner = msg;
      hosePick = null;
      paint();
    }

    function landHose(hose, port) {
      banner = "";
      if (!hose || !port) return;
      if (hose === "blue" && port !== "suction") {
        return denyHose(
          port === "liquid"
            ? "Wrong hose. Blue on liquid pegs the compound. Blue is suction — the fat vapor line."
            : port === "vac"
              ? "Wrong hose. Blue does not go on the vacuum pump. Blue is suction."
              : port === "cyl"
                ? "Wrong hose. Blue does not go on the cylinder. Blue is suction."
                : "Wrong hose. Blue only lands on suction."
        );
      }
      if (hose === "red" && port !== "liquid") {
        return denyHose(
          port === "suction"
            ? "Wrong hose. Red does not go on suction. Red is the liquid line. The high needle is not for the low side."
            : port === "vac"
              ? "Wrong hose. Red does not go on the vacuum pump. Red is liquid."
              : port === "cyl"
                ? "Wrong hose. Red does not go on the cylinder. Yellow carries the jug."
                : "Wrong hose. Red only lands on liquid."
        );
      }
      if (hose === "blue") {
        blue = port;
      } else if (hose === "red") {
        red = port;
      } else if (hose === "yellow") {
        if (port === "suction" || port === "liquid") {
          return denyHose("Wrong hose. Yellow does not go on a king valve. Cap it to READ, or hang it on the pump / cylinder.");
        }
        yellow = port;
        if (port === "vac") banner = "Yellow is on the vacuum pump. The hose moved. Cap it when you want system pressure.";
        else if (port === "cyl") banner = "Yellow is on the cylinder. The hose moved. Cap it to read the system.";
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
      if (global.LtHaptic && global.LtHaptic.land) global.LtHaptic.land();
      maybeAdvance();
      paint();
    }

    function land(port) {
      if (!hosePick) {
        banner = "Drag a hose onto the port — or tap a hose first, then the port.";
        return paint();
      }
      landHose(hosePick, port);
    }

    function maybeAdvance() {
      if (mode !== "guide") return;
      if (step < 5 && blue === "suction" && red === "liquid" && yellow === "capped" && !loOpen && !hiOpen) {
        step = Math.max(step, 5);
      }
      const id = GUIDE[step] && GUIDE[step].id;
      if (id === "blue" && blue === "suction") step++;
      else if (id === "red" && red === "liquid") step++;
      else if (id === "yellow" && yellow === "capped") step++;
      else if (id === "purge" && purged) step++;
      else if (id === "run" && running) step++;
      else if (id === "clamps" && clampS && clampL) step++;
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
        if (mode === "guide" && GUIDE[step].id === "math") step++;
        if (onXp) onXp(25);
        if (global.LtHaptic && global.LtHaptic.land) global.LtHaptic.land();
      } else {
        banner =
          "Not yet. Evap dew is " +
          s.tSatLow.toFixed(0) +
          "°F at " +
          Math.round(s.pLow) +
          " psig. Start of boiling is " +
          s.tSatHigh.toFixed(0) +
          "°F at " +
          Math.round(s.pHigh) +
          " psig. SH = " +
          s.tSuction.toFixed(0) +
          " − " +
          s.tSatLow.toFixed(0) +
          ". SC = " +
          s.tSatHigh.toFixed(0) +
          " − " +
          s.tLiquid.toFixed(0) +
          ".";
      }
      paint();
    }

    function gradeCall() {
      if (guess == null) {
        banner = "Pick a call.";
        return paint();
      }
      if (guess === job.answer) {
        banner = "Correct. " + job.explain;
        revealed = true;
        if (mode === "guide") {
          passedGuide = true;
          if (onXp) onXp(40);
        } else if (onXp) onXp(50);
        if (global.LtHaptic && global.LtHaptic.land) global.LtHaptic.land();
        if (global.CurriculumTrain) global.CurriculumTrain.stamp("gauges");
      } else {
        banner = "Wrong. " + job.explain;
        revealed = true;
        if (global.LtHaptic && global.LtHaptic.play) global.LtHaptic.play("trip");
      }
      if (global.LtDrip) global.LtDrip.say(job.fault === "undercharge" || job.fault === "overcharge" ? "gauges.sh" : "gauges.txv", true);
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
      clampS = false;
      clampL = false;
      hosePick = null;
      blown = false;
      shIn = "";
      scIn = "";
      guess = null;
      revealed = false;
      banner = "Set reset. Blue suction, red liquid, yellow cap, handles seated.";
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
      ctx.arc(0, 0, r + 7, 0, Math.PI * 2);
      ctx.fillStyle = "#2a3238";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = opts.bezel;
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#0c1014";
      ctx.fill();

      const min = opts.min;
      const max = opts.max;
      ctx.font = "600 9px IBM Plex Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i <= opts.steps; i++) {
        const v = min + ((max - min) * i) / opts.steps;
        const a = ang(v, min, max);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (r - (i % 2 === 0 ? 16 : 10)), Math.sin(a) * (r - (i % 2 === 0 ? 16 : 10)));
        ctx.lineTo(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4));
        ctx.strokeStyle = i % 2 === 0 ? "#f4efe6" : "#8b98a5";
        ctx.lineWidth = i % 2 === 0 ? 2 : 1;
        ctx.stroke();
        if (i % 2 === 0) {
          ctx.fillStyle = "#d8dde3";
          const label = v < 0 ? String(Math.round(-v)) + '"' : String(Math.round(v));
          ctx.fillText(label, Math.cos(a) * (r - 26), Math.sin(a) * (r - 26));
        }
      }

      if (opts.sat) {
        ctx.fillStyle = "rgba(232,196,80,0.85)";
        ctx.font = "600 8px IBM Plex Sans, sans-serif";
        [40, 70, 100, 115].forEach(function (tF) {
          const p = satP(job.ref, tF);
          if (p < min || p > max) return;
          const a = ang(p, min, max);
          ctx.fillText(String(tF) + "°", Math.cos(a) * (r - 42), Math.sin(a) * (r - 42));
        });
      }

      ctx.fillStyle = opts.bezel;
      ctx.font = "700 11px IBM Plex Sans, sans-serif";
      ctx.fillText(opts.name, 0, r * 0.22);
      ctx.fillStyle = "#9aa3ad";
      ctx.font = "600 9px IBM Plex Sans, sans-serif";
      ctx.fillText(opts.unit, 0, r * 0.38);

      const a = ang(opts.value, min, max);
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = opts.peg ? "#F43F5E" : "#f4efe6";
      ctx.beginPath();
      ctx.moveTo(r - 18, 0);
      ctx.lineTo(-10, 3.5);
      ctx.lineTo(-10, -3.5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#c4a45a";
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }

    function hose(ctx, x1, y1, x2, y2, color, on) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo((x1 + x2) / 2, y1 + (on ? 36 : 18), x2, y2);
      ctx.strokeStyle = on ? color : "rgba(80,88,96,0.4)";
      ctx.lineWidth = on ? 8 : 5;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    function draw() {
      const c = host.querySelector("#gs-canvas");
      if (!c || !c.getContext) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = 640;
      const h = 280;
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const live = liveRead();
      needleL += (live.pL - needleL) * 0.18;
      needleH += (live.pH - needleH) * 0.18;

      ctx.fillStyle = "#3a434c";
      ctx.beginPath();
      ctx.moveTo(188, 108);
      ctx.arcTo(318, 108, 318, 194, 10);
      ctx.arcTo(318, 194, 188, 194, 10);
      ctx.arcTo(188, 194, 188, 108, 10);
      ctx.arcTo(188, 108, 318, 108, 10);
      ctx.fill();
      ctx.fillStyle = "#c4a45a";
      ctx.font = "700 12px IBM Plex Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MANIFOLD", 253, 132);
      ctx.fillStyle = "#9aa3ad";
      ctx.font = "600 10px IBM Plex Sans, sans-serif";
      ctx.fillText(job.ref, 253, 148);
      ctx.fillText(loOpen || hiOpen ? "VALVES OPEN" : "VALVES SEATED", 253, 164);

      ctx.beginPath();
      ctx.arc(216, 178, 11, 0, Math.PI * 2);
      ctx.fillStyle = loOpen ? "#3d8bd4" : "#1a2026";
      ctx.fill();
      ctx.strokeStyle = "#3d8bd4";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(290, 178, 11, 0, Math.PI * 2);
      ctx.fillStyle = hiOpen ? "#CE0034" : "#1a2026";
      ctx.fill();
      ctx.strokeStyle = "#CE0034";
      ctx.stroke();

      ctx.fillStyle = "#1c242c";
      ctx.fillRect(530, 24, 100, 148);
      ctx.strokeStyle = "#5a6570";
      ctx.strokeRect(530, 24, 100, 148);
      ctx.fillStyle = "#e8edf2";
      ctx.font = "700 11px IBM Plex Sans, sans-serif";
      ctx.fillText("ODU", 580, 44);
      ctx.fillStyle = "#9aa3ad";
      ctx.font = "600 9px IBM Plex Sans, sans-serif";
      ctx.fillText("king valves", 580, 60);
      ctx.fillStyle = "#CE0034";
      ctx.beginPath();
      ctx.arc(556, 100, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3d8bd4";
      ctx.beginPath();
      ctx.arc(604, 132, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#9aa3ad";
      ctx.font = "600 9px IBM Plex Sans, sans-serif";
      ctx.fillText("LIQ 3/8", 556, 120);
      ctx.fillText("SUC 3/4", 604, 154);

      drawDial(ctx, 100, 120, 78, {
        name: "LOW · COMPOUND",
        unit: needleL < 0 ? "inHg" : "psig",
        bezel: "#3d8bd4",
        min: -30,
        max: job.ref === "R-22" ? 250 : 500,
        steps: 10,
        value: needleL,
        sat: true,
        peg: live.peg,
      });
      drawDial(ctx, 390, 120, 78, {
        name: "HIGH",
        unit: "psig",
        bezel: "#CE0034",
        min: 0,
        max: job.ref === "R-22" ? 500 : 800,
        steps: 8,
        value: needleH,
        sat: true,
        peg: false,
      });

      function hoseEnd(port, fallback) {
        if (port === "suction") return [604, 132];
        if (port === "liquid") return [556, 100];
        if (port === "capped") return [253, 250];
        if (port === "vac") return [70, 250];
        if (port === "cyl") return [180, 250];
        return fallback;
      }
      const blueEnd = hoseEnd(blue, [100, 230]);
      const redEnd = hoseEnd(red, [390, 230]);
      const yelEnd = hoseEnd(yellow, [253, 220]);
      hose(ctx, 100, 192, blueEnd[0], blueEnd[1], "#3d8bd4", !!blue);
      hose(ctx, 390, 192, redEnd[0], redEnd[1], "#CE0034", !!red);
      hose(ctx, 253, 178, yelEnd[0], yelEnd[1], "#e8c450", !!yellow);
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

    function paint() {
      if (!mounted) return;
      const s = sim();
      const live = liveRead();
      const g = GUIDE[step] || GUIDE[GUIDE.length - 1];

      host.querySelector("#gs-coach").textContent = coach();
      host.querySelector("#gs-hubtalk").textContent = hubLine();
      const ban = host.querySelector("#gs-banner");
      ban.textContent = banner;
      ban.classList.toggle("hidden", !banner);
      ban.classList.toggle("good", /Correct|That's the math|in band|leave-it/i.test(banner));
      ban.classList.toggle("bad", /Wrong|PEGGED|OPEN|Not yet|dead gauge/i.test(banner));
      const hint = host.querySelector(".gs-drag-hint");
      if (hint) {
        hint.textContent = /Wrong hose/i.test(banner)
          ? banner
          : "Drag the hose onto the port. Chip hides when it lands. Hose stays on the set.";
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
        el.hidden = !!landed;
        el.style.display = landed ? "none" : "";
      });

      host.querySelectorAll("[data-port]").forEach(function (el) {
        const p = el.getAttribute("data-port");
        el.classList.toggle("on", blue === p || red === p || yellow === p);
      });

      host.querySelector("#gs-clamp-s").classList.toggle("on", clampS);
      host.querySelector("#gs-clamp-l").classList.toggle("on", clampL);

      host.querySelector("#gs-pl").textContent = blue ? fmtGauge(live.pL, live.peg) : "—";
      host.querySelector("#gs-ph").textContent = red ? fmtGauge(live.pH, false) : "—";
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

      host.querySelectorAll(".gs-step").forEach(function (el, i) {
        el.classList.toggle("on", mode === "guide" && i === step);
        el.classList.toggle("ok", mode === "guide" && i < step);
      });

      host.querySelector("#gs-guide-ui").classList.toggle("hidden", mode !== "guide");
      host.querySelector("#gs-practice-ui").classList.remove("hidden");
      host.querySelector("#gs-math").classList.toggle("hidden", !(clampS && clampL && running));
      host.querySelector("#gs-prints").classList.toggle("hidden", !(mode === "guide" || revealed));

      const mean = host.querySelector("#gs-meaning");
      if (mean) {
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

      const hintId = mode === "guide" && GUIDE[step] ? GUIDE[step].id : "";
      host.querySelectorAll(".gs-drop").forEach(function (el) {
        const slot = el.getAttribute("data-slot");
        const hint =
          (hintId === "blue" && slot === "suction") ||
          (hintId === "red" && slot === "liquid") ||
          (hintId === "yellow" && slot === "capped");
        el.classList.toggle("hint", !!hint);
      });

      host.querySelectorAll("[data-mode]").forEach(function (b) {
        b.classList.toggle("primary", b.getAttribute("data-mode") === mode);
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
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function bind() {
      var _gsN = host.querySelector("#gs-hub"); if (_gsN) _gsN.onclick = function () {
        if (onHub) onHub();
      };
      var _gsN = host.querySelector("#gs-stuck"); if (_gsN) _gsN.onclick = stuck;
      var _gsN = host.querySelector("#gs-reset"); if (_gsN) _gsN.onclick = function () {
        resetSet();
        paint();
      };
      var _gsN = host.querySelector("#gs-lo"); if (_gsN) _gsN.onclick = function () {
        loOpen = !loOpen;
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-hi"); if (_gsN) _gsN.onclick = function () {
        hiOpen = !hiOpen;
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-run"); if (_gsN) _gsN.onclick = function () {
        if (!hookOk() && !running) {
          banner = "Hook blue suction, red liquid, yellow cap, handles seated — then start it.";
          return paint();
        }
        running = !running;
        maybeAdvance();
        if (mode === "guide" && GUIDE[step] && GUIDE[step].id === "readp" && running) {
          step++;
        }
        paint();
      };
      var _gsN = host.querySelector("#gs-purge"); if (_gsN) _gsN.onclick = function () {
        if (!blue && !red) {
          banner = "Land the hoses first. Then clear hose air with low-loss fittings — don't crack a hose and vent.";
          return paint();
        }
        purged = true;
        maybeAdvance();
        banner = "Hoses purged. Now you're reading refrigerant, not air.";
        paint();
      };
      var _gsN = host.querySelector("#gs-clamp-s"); if (_gsN) _gsN.onclick = function () {
        clampS = !clampS;
        maybeAdvance();
        paint();
      };
      var _gsN = host.querySelector("#gs-clamp-l"); if (_gsN) _gsN.onclick = function () {
        clampL = !clampL;
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
        if (h === "blue" && blue) return;
        if (h === "red" && red) return;
        if (h === "yellow" && yellow) return;
        hosePick = hosePick === h ? null : h;
        paint();
      };
      var _gsN = host.querySelector("#gs-ports"); if (_gsN) _gsN.onclick = function (e) {
        if (skipClick) return;
        const b = e.target.closest("[data-port], .gs-drop");
        if (!b) return;
        land(b.getAttribute("data-port") || b.getAttribute("data-slot"));
      };
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
              landHose(hoseId, slot);
              setTimeout(function () { skipClick = false; }, 0);
            },
          });
        });
      }
      var _gsN = host.querySelector("#gs-modes"); if (_gsN) _gsN.onclick = function (e) {
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
        running = mode === "unguided";
        clampS = false;
        clampL = false;
        purged = false;
        if (mode === "unguided") job = JOBS[1];
        else job = JOBS[0];
        paint();
      };
      var _gsN = host.querySelector("#gs-next"); if (_gsN) _gsN.onclick = function () {
        if (mode !== "guide") return;
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
        blue = null;
        red = null;
        yellow = null;
        blown = false;
        hosePick = null;
        running = mode === "unguided";
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
          const x = ((ev.clientX - rect.left) / rect.width) * 640;
          const y = ((ev.clientY - rect.top) / rect.height) * 280;
          if (Math.hypot(x - 216, y - 178) < 22) {
            loOpen = !loOpen;
            maybeAdvance();
            paint();
          } else if (Math.hypot(x - 290, y - 178) < 22) {
            hiOpen = !hiOpen;
            maybeAdvance();
            paint();
          }
        };
      }
    }

    function mount() {
      host.innerHTML =
        '<div class="gs-lab">' +
        '<header class="gs-head">' +
        '<button type="button" class="btn" id="gs-hub">Shop floor</button>' +
        '<div class="brand-bar"><div class="brand-mark">' +
        ((global.LtBrand && global.LtBrand.mark) || "LT") +
        '</div><div class="brand-word"><strong>MANIFOLD SCHOOL</strong><span>Blue suction · red liquid · yellow utility · SH & SC</span></div></div>' +
        '<div class="gs-modes" id="gs-modes">' +
        '<button type="button" class="btn primary" data-mode="guide">Guided</button>' +
        '<button type="button" class="btn" data-mode="unguided">Unguided</button>' +
        "</div>" +
        '<button type="button" class="btn" id="gs-stuck">HUB · I\'m stuck</button>' +
        "</header>" +
        '<ol class="gs-steps" id="gs-guide-ui">' +
        GUIDE.map(function (g, i) {
          return '<li class="gs-step" data-step="' + i + '">' + (i + 1) + " " + g.title + "</li>";
        }).join("") +
        "</ol>" +
        '<div class="gs-practice" id="gs-practice-ui"><p class="eyebrow" id="gs-job-brief"></p><div class="gs-jobs" id="gs-jobs">' +
        JOBS.map(function (j) {
          return '<button type="button" class="btn" data-job="' + j.id + '">' + j.title + "</button>";
        }).join("") +
        "</div></div>" +
        '<p class="gs-coach" id="gs-coach"></p>' +
        '<p class="gs-hub" id="gs-hubtalk"></p>' +
        '<p class="gs-banner hidden" id="gs-banner"></p>' +
        '<canvas id="gs-canvas" width="640" height="280" aria-label="Analog manifold gauge set"></canvas>' +
        '<p class="gs-drag-hint">Drag the hose onto the port. Chip hides when it lands. Hose stays on the set.</p>' +
        '<div class="gs-hoses" id="gs-hoses">' +
        '<button type="button" class="gs-hose blue" data-hose="blue">Blue hose · suction</button>' +
        '<button type="button" class="gs-hose yellow" data-hose="yellow">Yellow hose · cap</button>' +
        '<button type="button" class="gs-hose red" data-hose="red">Red hose · liquid</button>' +
        "</div>" +
        '<div class="gs-ports" id="gs-ports">' +
        '<button type="button" class="gs-drop suction" data-slot="suction" data-port="suction"><strong>Suction</strong><span>Fat vapor · blue</span></button>' +
        '<button type="button" class="gs-drop liquid" data-slot="liquid" data-port="liquid"><strong>Liquid</strong><span>3/8″ · red</span></button>' +
        '<button type="button" class="gs-drop capped" data-slot="capped" data-port="capped"><strong>Yellow cap</strong><span>Read · yellow</span></button>' +
        '<button type="button" class="gs-drop vac" data-slot="vac" data-port="vac"><strong>Vacuum pump</strong><span>Utility</span></button>' +
        '<button type="button" class="gs-drop cyl" data-slot="cyl" data-port="cyl"><strong>Cylinder</strong><span>Charge / recover</span></button>' +
        "</div>" +
        '<div class="gs-meaning" id="gs-meaning"></div>' +
        '<div class="gs-acts">' +
        '<button type="button" class="btn" id="gs-lo">Low seated</button>' +
        '<button type="button" class="btn" id="gs-hi">High seated</button>' +
        '<button type="button" class="btn" id="gs-purge">Purge hoses</button>' +
        '<button type="button" class="btn primary" id="gs-run">Start compressor</button>' +
        '<button type="button" class="btn" id="gs-clamp-s">Suction clamp</button>' +
        '<button type="button" class="btn" id="gs-clamp-l">Liquid clamp</button>' +
        '<button type="button" class="btn" id="gs-reset">Reset set</button>' +
        "</div>" +
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
        '<div class="gs-nav">' +
        '<button type="button" class="btn" id="gs-back">Back</button>' +
        '<button type="button" class="btn" id="gs-next">Next step</button>' +
        '<button type="button" class="btn primary" id="gs-grade">Lock the call</button>' +
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
      raf = requestAnimationFrame(loop);
    }

    mount();
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
