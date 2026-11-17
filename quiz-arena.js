/* All-Star Exam Board — EPA 608 · OSHA 30 · Lincoln Tech HVAC */
(function (global) {
  "use strict";

  // ---------- Question banks ----------
  const BANK = {
    epa608: [
      {
        q: "Before opening a system that contains refrigerant, you must:",
        choices: ["Vent to atmosphere carefully", "Recover the refrigerant", "Add nitrogen until empty", "Run the compressor in pump-down only"],
        a: 1,
        why: "EPA Section 608 requires recovery before opening. Venting is illegal.",
      },
      {
        q: "Which device measures deep vacuum most accurately for evacuation?",
        choices: ["Compound manifold gauge", "Digital micron gauge", "Pocket thermometer", "Amp clamp"],
        a: 1,
        why: "Microns measure absolute pressure. Compound gauges are not precise enough for deep vacuum.",
      },
      {
        q: "A common deep-vacuum target before opening service valves on a new install is:",
        choices: ["30 psig", "0 psig on the compound gauge only", "500 microns or less", "29 inHg for 30 seconds"],
        a: 2,
        why: "≤500 microns with a holding/decay test is industry standard practice.",
      },
      {
        q: "Recovered refrigerant should be stored in:",
        choices: ["Any empty paint can", "DOT-approved recovery cylinders", "Plastic jugs", "Open buckets outdoors"],
        a: 1,
        why: "Only approved refillable recovery cylinders, used within fill limits.",
      },
      {
        q: "Mixing different refrigerants in a recovery cylinder is:",
        choices: ["Fine if pressures are similar", "Recommended for capacity", "Not allowed / creates hazardous mixtures", "Required for Type III"],
        a: 2,
        why: "Never mix refrigerants in recovery tanks.",
      },
      {
        q: "Type II certification primarily covers:",
        choices: ["Small appliances only", "High-pressure and very high-pressure appliances (excluding small appliances & MVAC)", "Motor vehicle AC only", "Only chillers using low-pressure refrigerants"],
        a: 1,
        why: "Type II is for high-pressure equipment excluding small appliances and MVAC.",
      },
      {
        q: "Ozone depletion is associated most with which older refrigerant class?",
        choices: ["HFCs only", "CFCs and HCFCs", "Hydrocarbons only", "CO₂ (R-744)"],
        a: 1,
        why: "CFCs/HCFCs contain chlorine that depletes ozone; HFCs are greenhouse gases but not ODP in the same way.",
      },
      {
        q: "The sale of CFC and HCFC refrigerants is restricted to:",
        choices: ["Anyone over 18", "Certified technicians", "Homeowners only", "Only EPA employees"],
        a: 1,
        why: "Technician certification is required to purchase restricted refrigerants.",
      },
      {
        q: "When using nitrogen to leak-test, you should:",
        choices: ["Use pure oxygen for better detection", "Pressurize with dry nitrogen and never oxygen", "Mix nitrogen with refrigerant vapor freely", "Skip gauges and listen only"],
        a: 1,
        why: "Dry nitrogen only. Oxygen + oil is a serious hazard.",
      },
      {
        q: "A system with a known leak should be:",
        choices: ["Topped off weekly forever", "Repaired before charging (with proper recovery/evac)", "Charged hotter to hide the leak", "Abandoned without recovery"],
        a: 1,
        why: "Find and repair leaks; recover, repair, evacuate, charge correctly.",
      },
      {
        q: "Self-contained recovery equipment:",
        choices: ["Has its own means to remove refrigerant", "Always requires the system compressor", "Is illegal after 2010", "Only works on R-22"],
        a: 0,
        why: "Self-contained recovery has its own pump/compressor to pull refrigerant.",
      },
      {
        q: "Filling a recovery cylinder beyond safe limits is dangerous because:",
        choices: ["The paint scratches", "Liquid expansion with temperature can rupture the cylinder", "EPA requires 100% full tanks", "It makes recovery faster"],
        a: 1,
        why: "Never overfill; leave vapor headspace. Use a scale.",
      },
      {
        q: "Under AIM leak repair rules (2026+), a covered comfort-cooling appliance exceeds its threshold when the calculated leak rate is above:",
        choices: ["5%", "10%", "20%", "30%"],
        a: 1,
        why: "Comfort cooling, refrigerated transport, and other covered appliances use a 10% leak-rate threshold. Commercial refrigeration is 20%; industrial process refrigeration is 30%.",
      },
      {
        q: "A 100 lb full-charge comfort system had 8 lb of HFC added 73 days after the last addition. Using annualizing: (8/100)×(365/73)×100% ≈ 40%. What does that mean?",
        choices: [
          "Below all AIM thresholds — no repair duty",
          "Above the 10% comfort-cooling threshold — repair obligations are triggered",
          "Only Section 609 MVAC rules apply",
          "It automatically voids EPA 608 certification"
        ],
        a: 1,
        why: "≈40% annualized is above the 10% comfort-cooling threshold. Owners/operators must identify and repair on EPA timelines (often 30 days). This is training math — use official methods and records on real jobs.",
      },
      {
        q: "AIM Act leak-repair provisions generally apply to appliances with a full charge of at least:",
        choices: ["5 pounds", "15 pounds", "50 pounds", "1,500 pounds"],
        a: 1,
        why: "15 pounds or more of a refrigerant containing an HFC (or certain high-GWP substitutes). 1,500 lb is related to some automatic leak detection (ALD) triggers, not the basic 15 lb leak-repair scope.",
      },
      {
        q: "Type I certification covers:",
        choices: ["All comfort cooling", "Small appliances with 5 lb or less of refrigerant", "Low-pressure chillers only", "MVAC on cars"],
        a: 1,
        why: "Type I is small appliances (typically 5 lb or less).",
      },
      {
        q: "Type III certification covers:",
        choices: ["Window units only", "Low-pressure appliances such as many centrifugal chillers", "Domestic refrigerators only", "MVAC recovery"],
        a: 1,
        why: "Type III is low-pressure appliances.",
      },
      {
        q: "Universal 608 certification means you passed:",
        choices: ["Core only", "Core plus Types I, II, and III", "OSHA 30 only", "A manufacturer class"],
        a: 1,
        why: "Universal = Core + I + II + III.",
      },
      {
        q: "A recovery cylinder should be filled to no more than about:",
        choices: ["100% liquid", "80% of its capacity by weight (leave headspace)", "Until the relief valve dumps", "Whatever fits"],
        a: 1,
        why: "Leave vapor headspace. Weigh it. Never fill solid liquid.",
      },
      {
        q: "Disposable cylinders (like some virgin refrigerant jugs) should be:",
        choices: ["Reused as recovery tanks", "Used as designed, then properly recycled — not used for recovery", "Heated with a torch to empty", "Vent-purged into the alley"],
        a: 1,
        why: "Don't recover into disposable cylinders.",
      },
      {
        q: "A 3-ton R-410A split recovered with a modern (post-1993) machine must be pulled to:",
        choices: ["10 inches Hg vacuum", "15 inches Hg vacuum", "0 inches Hg vacuum (0 psig)", "25 mm Hg absolute"],
        a: 2,
        why: "High-pressure appliance under 200 lb, post-1993 recovery equipment: 0\" Hg = 0 psig. 10\" is for high-pressure 200 lb or more.",
      },
      {
        q: "High-pressure appliance, 200 lb or more, recovery machine made after Nov 15, 1993. Required vacuum:",
        choices: ["0 inches Hg", "4 inches Hg", "10 inches Hg", "15 inches Hg"],
        a: 2,
        why: "Post-1993, high-pressure ≥200 lb = 10\" Hg. 15\" is medium-pressure ≥200 lb. 4\" is the pre-1993 number.",
      },
      {
        q: "On Type I small appliances with a running compressor (post-1993 recovery gear) you must recover at least:",
        choices: ["50% of the charge", "80% of the charge", "90% of the charge or 4 inches Hg", "10 inches Hg always"],
        a: 2,
        why: "90% if the compressor operates, 80% if it does not, or evacuate to 4\" Hg.",
      },
      {
        q: "0 inches of mercury vacuum on the 608 recovery table means:",
        choices: ["500 microns", "0 psig / atmospheric", "29.9 inHg on a compound gauge", "A Type III chiller pull"],
        a: 1,
        why: "0\" vacuum is atmospheric pressure (0 psig). It is not a dehydration vacuum.",
      },
    ],
    osha30: [
      {
        q: "Before working on electrical equipment, the safest practice is:",
        choices: ["Wear extra rings for grounding", "Lockout/tagout and verify de-energized", "Work one-handed only", "Hold the conduit for stability"],
        a: 1,
        why: "LOTO and verify with a meter. Jewelry is a hazard, not PPE.",
      },
      {
        q: "A common leading cause of construction fatalities is:",
        choices: ["Paper cuts", "Falls", "Loud music", "Too much training"],
        a: 1,
        why: "Falls are a top cause of construction deaths — ladders, roofs, lifts.",
      },
      {
        q: "Extension ladders should extend above the landing at least:",
        choices: ["6 inches", "1 foot", "3 feet", "6 feet"],
        a: 2,
        why: "Typically 3 feet above the landing surface for safe transition.",
      },
      {
        q: "GFCI protection is especially important when:",
        choices: ["Using electrical tools outdoors or in wet areas", "Reading a manual indoors", "Driving the work truck", "Sorting copper scraps"],
        a: 0,
        why: "GFCIs reduce shock risk in wet/outdoor conditions.",
      },
      {
        q: "SDS (Safety Data Sheets) provide information about:",
        choices: ["Customer credit scores", "Chemical hazards and safe handling", "Union dues", "Compressor SEER ratings only"],
        a: 1,
        why: "Hazard communication: SDS explains chemical risks and protections.",
      },
      {
        q: "Hard hats, safety glasses, and gloves are examples of:",
        choices: ["Optional fashion", "PPE (personal protective equipment)", "Tools of the trade only", "EPA 608 recovery gear"],
        a: 1,
        why: "PPE reduces exposure to hazards when engineering controls aren't enough.",
      },
      {
        q: "Heat illness prevention includes:",
        choices: ["Ignoring breaks to finish faster", "Water, rest, shade, and recognizing symptoms", "Working in black hoodies at noon", "Salt tablets only with no water"],
        a: 1,
        why: "Hydration, rest, shade, and early recognition of heat stress save lives.",
      },
      {
        q: "When lifting heavy equipment you should:",
        choices: ["Twist at the waist with a full load", "Lift with your back rounded", "Plan the path, lift with legs, get help for heavy loads", "Hold your breath and jerk upward"],
        a: 2,
        why: "Proper lifting mechanics and teamwork prevent injuries.",
      },
      {
        q: "A confined space may require:",
        choices: ["No special precautions", "Atmospheric testing, permits, and attendant procedures as applicable", "Only a stronger flashlight", "Playing music louder"],
        a: 1,
        why: "Confined spaces can have oxygen deficiency or toxic atmospheres.",
      },
      {
        q: "Damaged power cords on tools should be:",
        choices: ["Taped with electrical tape forever", "Removed from service and repaired/replaced properly", "Ignored if the tool still runs", "Used only on rainy days"],
        a: 1,
        why: "Damaged cords are shock/fire hazards — tag out and fix properly.",
      },
      {
        q: "Eye protection is required when:",
        choices: ["Only on formal inspections", "Cutting, grinding, brazing, chemical handling, and similar hazards", "Never outdoors", "Only if the customer is watching"],
        a: 1,
        why: "Protect eyes whenever flying particles, UV, or chemicals are risks.",
      },
      {
        q: "The hierarchy of controls prioritizes first:",
        choices: ["PPE only", "Eliminating the hazard when feasible", "Warning signs only", "Worker attitude"],
        a: 1,
        why: "Eliminate/substitute before relying on PPE as last line.",
      },
      {
        q: "On a roof, fall protection is generally required when working how high (construction, typical OSHA)?",
        choices: ["Any height", "6 feet or more when exposed to a fall hazard", "Only above 30 feet", "Never if you feel confident"],
        a: 1,
        why: "Construction fall protection commonly triggers at 6 feet. Use guardrails, PFAS, or covers.",
      },
      {
        q: "Lockout devices should be removed by:",
        choices: ["Anyone in a hurry", "The authorized worker who applied them (or following employer procedure)", "The customer", "Whoever has pliers"],
        a: 1,
        why: "Don't pull someone else's lock. Follow the LOTO program.",
      },
      {
        q: "A fire extinguisher class for energized electrical equipment is typically:",
        choices: ["Class A water only", "Class C (or multi-class rated for energized electrical)", "Class K kitchen only", "Dirt from the truck"],
        a: 1,
        why: "Class C is electrical. Don't throw water on live gear.",
      },
      {
        q: "Scaffolding should be inspected:",
        choices: ["Never — it's always fine", "Before use / by a competent person as required", "Only after a collapse", "Once a year in January"],
        a: 1,
        why: "Inspect before use. Don't climb damaged scaffold.",
      },
    ],
    refov: [
      {
        q: "What two points in the refrigeration system divide the low-pressure side and the high-pressure side?",
        choices: ["The compressor and the evaporator", "The compressor and the liquid receiver", "The condenser and the evaporator", "The compressor and the metering device"],
        a: 3,
        why: "The compressor raises the pressure. The metering device drops it. Those two points split the high side from the low side.",
      },
      {
        q: "What state does the refrigerant enter the compressor as?",
        choices: ["A high-pressure, low-temperature liquid", "A high-pressure, high-temperature superheated vapor", "A high-pressure subcooled liquid", "A low-pressure, low-temperature superheated vapor"],
        a: 3,
        why: "The evaporator finishes the boil and adds superheat. The compressor must see vapor, not liquid.",
      },
      {
        q: "The blue gauge on a gauge manifold set is the:",
        choices: ["High pressure gauge", "Low-pressure compound gauge", "Recovery gauge", "Evacuation gauge"],
        a: 1,
        why: "Blue is the compound gauge. It reads pressure and vacuum on the low side.",
      },
      {
        q: "Where in the refrigeration cycle is the pressure reduced, causing a small percentage of the refrigerant to flash to a vapor (flash-gas)?",
        choices: ["The compressor", "The condenser", "The metering device", "The liquid receiver"],
        a: 2,
        why: "The metering device drops the pressure. Part of the liquid flashes so the rest can boil in the evaporator.",
      },
      {
        q: "What is a de-minimis release of refrigerant?",
        choices: ["Refrigerant released from an old refrigerant cylinder", "A minor release of refrigerant such as removing hoses", "A major release of refrigerant that must be reported", "Refrigerant released through a purge unit as a result of adding nitrogen to a charged system"],
        a: 1,
        why: "De minimis is a small release you cannot avoid, such as disconnecting hoses. It is not a vent, and it is not a leak you leave.",
      },
      {
        q: "The center port and hose of a gauge manifold is used for which of the following?",
        choices: ["All of these: recovery, charging, and evacuation", "Recovery", "Charging", "Evacuation"],
        a: 0,
        why: "The center hose is the utility hose. Recovery, charging, and evacuation all use it.",
      },
    ],
    leak: [
      {
        q: "After determining the general area of a leak, what can be used to pinpoint it?",
        choices: ["Recovery unit", "Soap bubbles", "Vacuum pump", "Laser"],
        a: 1,
        why: "An electronic detector finds the area. Soap bubbles show the exact fitting that is leaking.",
      },
      {
        q: "What is the most effective way to determine the general area of a leak?",
        choices: ["Nitrogen leak test", "Use an electronic or ultrasonic leak detector", "Use a recovery unit", "Use a vacuum pump"],
        a: 1,
        why: "A detector sweeps the system and tells you which section is leaking. Then you pinpoint it.",
      },
      {
        q: "What is the first issue a technician can look for when inspecting a refrigeration system known to be leaking?",
        choices: ["Dust or dirt inside the machine", "Traces of oil around fittings", "Excessive condensation", "Rat droppings"],
        a: 1,
        why: "Oil travels with the refrigerant. Oil at a fitting is the first sign of where it left.",
      },
    ],
    curriculum: [
      {
        q: "High superheat AND low subcooling most often indicates:",
        choices: ["Overcharge", "Dirty condenser only", "Undercharge / leak", "Failed blower only"],
        a: 2,
        why: "Starved evaporator (high SH) + thin condenser liquid (low SC) = undercharge fingerprint.",
      },
      {
        q: "On many TXV systems, preferred charging method includes:",
        choices: ["Superheat only always", "Subcooling and/or weigh-in per OEM", "Sight glass until clear only", "Match suction pressure to outdoor dry bulb only"],
        a: 1,
        why: "TXV holds SH; charge often by SC and nameplate weight.",
      },
      {
        q: "Before opening mini-split service valves on a new install, you should:",
        choices: ["Skip straight to charging", "Pressure test with N₂ and pull a deep vacuum with decay", "Open valves then vacuum", "Use oxygen to push moisture out"],
        a: 1,
        why: "N₂ test → vacuum ≤500 µm → decay → then open valves.",
      },
      {
        q: "A dirty condenser typically shows:",
        choices: ["Low head pressure", "High head pressure and reduced capacity", "Zero compressor amps", "High superheat only with low head"],
        a: 1,
        why: "Can't reject heat → head rises, capacity drops, amps often rise.",
      },
      {
        q: "Flare nut goes on the copper tubing:",
        choices: ["After flaring", "Before cutting/flaring", "Never on mini-splits", "Only on the suction line"],
        a: 1,
        why: "Nut on first — classic mistake to flare then realize the nut is missing.",
      },
      {
        q: "On most heat pumps, the reversing-valve solenoid is energized in:",
        choices: ["Heat (B on every brand)", "Cool (O on most brands; some use B in heat)", "Defrost only", "Anytime Y is calling"],
        a: 1,
        why: "Most brands use O energized in COOL. Rheem/Ruud often energize B in HEAT. Know the board.",
      },
      {
        q: "24V at the reversing-valve coil, no click, indoor still heating on a cool call means:",
        choices: ["Add 410A", "Stuck 4-way slider — replace the valve", "TXV is flooding", "Capacitor is open"],
        a: 1,
        why: "Solenoid is alive; the slider didn't move. Don't condemn the compressor first.",
      },
      {
        q: "During a heat-pump defrost, the outdoor fan should be:",
        choices: ["High speed to melt faster", "OFF so head heat stays in the outdoor coil", "Locked on with the RV in heat", "Replaced with nitrogen flow"],
        a: 1,
        why: "Fan off, RV in cool: hot gas sits in the iced outdoor coil and melts it.",
      },
      {
        q: "An iced-solid outdoor coil in heat with no defrost is usually:",
        choices: ["Low on 410A — add gas", "Defrost sensor/board, not a charge problem first", "TXV stuck open", "Dirty indoor filter only"],
        a: 1,
        why: "Force defrost. Confirm RV shift and fan stop. Then sensors/board. Don't top off a glacier.",
      },
      {
        q: "Ice on the suction line with near-zero superheat often points first to:",
        choices: ["Need more refrigerant immediately", "Low airflow or overcharge issues — diagnose before adding gas", "Failed crankcase heater only", "Wrong thermostat color wires"],
        a: 1,
        why: "Fix airflow (filter/blower/coil) before pouring in refrigerant.",
      },
      {
        q: "MCA on a nameplate is used primarily to:",
        choices: ["Set the thermostat schedule", "Size wire/circuit ampacity minimum", "Choose refrigerant type", "Measure superheat"],
        a: 1,
        why: "Minimum Circuit Ampacity guides conductor sizing; MOP guides max OCPD.",
      },
      {
        q: "Factory charge on a mini-split covers:",
        choices: ["Any lineset length worldwide", "The rated lineset length; longer runs need weighed-in additional charge", "Only the indoor unit", "Only winter operation"],
        a: 1,
        why: "Longer linesets need additional charge per OEM chart.",
      },
      {
        q: "Communication wires swapped on a ductless system often cause:",
        choices: ["Perfect cooling", "No operation / error codes / no cool", "Higher SEER automatically", "Free refrigerant upgrades"],
        a: 1,
        why: "Comms polarity/order matters — classic no-cool after install.",
      },
      {
        q: "Non-condensables left in a system tend to:",
        choices: ["Lower head pressure usefully", "Raise head pressure and hurt efficiency", "Replace the need for oil", "Improve vacuum readings forever"],
        a: 1,
        why: "Air/nitrogen in the circuit raises head and reduces capacity.",
      },
      {
        q: "A liquid-line restriction / stuck TXV often shows:",
        choices: ["Low SH and low SC", "High SH with normal/high SC", "High suction and low head only", "No change in any reading"],
        a: 1,
        why: "Condenser still has liquid (SC) but evaporator is starved (high SH).",
      },
      {
        q: "POE oil is:",
        choices: ["Hydrophobic and ignores moisture", "Hygroscopic — absorbs moisture; keep containers capped", "Identical to mineral oil for R-22 top-offs always", "Optional on all compressors"],
        a: 1,
        why: "POE + moisture is trouble. Cap the oil.",
      },
      {
        q: ((window.LtBrand && window.LtBrand.org) || "Shop") + " standard: after brazing a copper joint you should:",
        choices: ["Charge immediately while it's hot", "N₂ purge while brazing, then pressure test and vacuum", "Skip the vacuum if it looks pretty", "Use R-22 leftover to push moisture"],
        a: 1,
        why: "Purge with nitrogen while brazing, then test and evacuate.",
      },
      {
        q: "On a voltmeter, to check 24V control you typically measure:",
        choices: ["Across the run capacitor only", "Between the 24V transformer secondary (R to C) with the right scale", "L1 to ground on the 480V tap", "The crankcase heater in amps mode"],
        a: 1,
        why: "R to C on the transformer / control circuit. Right scale. Don't put the meter in amps across voltage.",
      },
      {
        q: "Manifold gauges: the blue hose is typically:",
        choices: ["Liquid / high side", "Suction / low side", "The vacuum pump exhaust", "The condensate drain"],
        a: 1,
        why: "Blue = low/suction. Red = high/liquid. Yellow = utility.",
      },
      {
        q: "Target superheat on a fixed-orifice system is mainly a function of:",
        choices: ["Indoor wet-bulb and outdoor dry-bulb (OEM chart)", "Whatever 20°F you like", "Head pressure only", "The color of the paint"],
        a: 0,
        why: "Use the OEM / P-T target SH chart for piston systems.",
      },
      {
        q: "A contactor that chatters on a call for cool often has:",
        choices: ["Perfect 24V", "Low control voltage, pitted points, or a failing coil", "Too much superheat only", "A happy condenser"],
        a: 1,
        why: "Measure 24V at the coil. Clean/replace the contactor. Don't keep it chattering.",
      },
    ],
    commandments: [
      {
        q: "HVAC Commandment 1 — before opening a charged system you must:",
        choices: ["Vent carefully outdoors", "Recover into an approved cylinder", "Run it in pump-down forever", "Add a pound and hope"],
        a: 1,
        why: "Recover first. Venting is illegal.",
      },
      {
        q: "HVAC Commandment 2 — the flare nut goes on:",
        choices: ["After the flare is made", "The tube first, then cut / deburr / flare", "Only on the outdoor unit", "Never — compression fittings only"],
        a: 1,
        why: "Nut on first. Forever.",
      },
      {
        q: "HVAC Commandment 3 — leak-test pressure comes from:",
        choices: ["Shop compressed air", "Pure oxygen for a hotter test", "Dry nitrogen only", "The system's own refrigerant"],
        a: 2,
        why: "Dry N₂ only. Oxygen + oil is a bomb.",
      },
      {
        q: "HVAC Commandment 4 — prove a deep vacuum with:",
        choices: ["Compound gauge at 29 inHg", "A micron gauge on the system", "How the pump sounds", "Five minutes on a kitchen timer"],
        a: 1,
        why: "Microns at the system. Compound gauges are cosplay.",
      },
      {
        q: "HVAC Commandment 5 — high SH and low SC means:",
        choices: ["Top it off and leave", "Undercharge / leak — recover, repair, evacuate, weigh in", "Dirty condenser only", "Overcharge — recover a little"],
        a: 1,
        why: "Don't top off a leaker.",
      },
      {
        q: "HVAC Commandment 6 — ohms or µF on a capacitor require:",
        choices: ["Power on so you see real values", "Lockout, verify dead, discharge the cap", "A jumper across L1–L2", "The thermostat set to Cool"],
        a: 1,
        why: "Lock it out. Live circuits bite.",
      },
      {
        q: "HVAC Commandment 8 — superheat is:",
        choices: ["Cond sat minus liquid temp", "Suction temp minus evaporator sat", "Head pressure minus suction", "Whatever the analog gauges say"],
        a: 1,
        why: "SH = suction temp − evap sat. SC = cond sat − liquid temp.",
      },
      {
        q: "HVAC Commandment 9 — iced suction and near-zero SH is usually:",
        choices: ["Low charge — add gas", "Airflow (filter, blower, coil) — don't add gas yet", "A good TXV", "Normal on R-410A"],
        a: 1,
        why: "Airflow before charge.",
      },
    ],
  };

  function lethalCause(text) {
    const t = String(text || "").trim().toLowerCase();
    const exact = {
      "use pure oxygen for better detection": "an oxygen explosion",
      "use oxygen to push moisture out": "an oxygen explosion",
      "pure oxygen for a hotter test": "an oxygen explosion",
      "heated with a torch to empty": "a cylinder explosion",
      "until the relief valve dumps": "a ruptured cylinder",
      "100% liquid": "a ruptured cylinder",
      "whatever fits": "a ruptured cylinder",
      "class a water only": "electrocution",
      "a jumper across l1–l2": "electrocution",
      "power on so you see real values": "electrocution",
      "no special precautions": "bad air",
    };
    return exact[t] || "";
  }

  function shuffleQuestion(q) {
    const n = (q.choices || []).length;
    if (n < 2) return Object.assign({}, q);
    const order = [];
    for (let i = 0; i < n; i++) order.push(i);
    for (let i = n - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = order[i];
      order[i] = order[j];
      order[j] = t;
    }
    const choices = order.map((i) => q.choices[i]);
    const correct = order.indexOf(q.a);
    let wrong = q.wrong;
    if (wrong && typeof wrong === "object") {
      const nw = {};
      order.forEach((oldI, newI) => {
        if (wrong[oldI] != null) nw[newI] = wrong[oldI];
      });
      wrong = nw;
    }
    return Object.assign({}, q, { choices: choices, a: correct, wrong: wrong });
  }

  function mixBanks(keys) {
    let all = [];
    keys.forEach((k) => {
      (BANK[k] || []).forEach((q) => all.push(shuffleQuestion(Object.assign({ pack: k }, q))));
    });
    for (let i = all.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }

  const PACKS = [
    { id: "epa608", name: "EPA 608 Universal", blurb: "100 Q · 25 Core + I + II + III · 18/25 each (2026 paper)" },
    { id: "epa608-core", name: "EPA 608 Core", blurb: "25 questions · 18 to pass · ozone, venting, cylinders" },
    { id: "epa608-type1", name: "EPA 608 Type I", blurb: "25 questions · small appliances ≤5 lb" },
    { id: "epa608-type2", name: "EPA 608 Type II", blurb: "25 questions · splits, vacuums, 10/20/30% leaks" },
    { id: "epa608-type3", name: "EPA 608 Type III", blurb: "25 questions · low-pressure chillers · 25 mm Hg abs" },
    { id: "leak", name: "Leak Detection", blurb: "3 questions · oil at the fitting, electronic detector, soap bubbles" },
    { id: "curriculum", name: (window.LtBrand && window.LtBrand.packCurriculum) || "HVAC Legends", blurb: "Cycle, SH/SC, gauges, DMM, mini-split, airflow" },
    { id: "mixed", name: "Quiz Game mix", blurb: "EPA 608 + OSHA 30 + " + ((window.LtBrand && window.LtBrand.packCurriculum) || "HVAC Legends") },
  ];

  const LETTERS = ["A", "B", "C", "D"];

  let root = null;
  let hooks = {};
  let mode = "lobby"; // lobby | host | play | results
  let role = "solo"; // solo | host | player
  let packId = "mixed";
  let questions = [];
  let qi = 0;
  let scores = {}; // name -> score
  let nickname = "Tech";
  let roomPin = "";
  let channel = null;
  let selected = null;
  let locked = false;
  let timer = 0;
  let timerMax = 0;
  let timerId = 0;
  let lastAward = 0;
  let players = [];
  let pollId = 0;
  let net = "local"; // local BroadcastChannel | server PIN rooms
  let extraSpicy = false;
  let roastLevel = 1;
  let sectionMarks = {};
  let examMode = false;
  let examLevel = "hard";
  let uniLeft = [];

  function isEpaPack(id) {
    return String(id || "").indexOf("epa608") === 0;
  }

  function buildDeck(id) {
    const E = global.Epa608Exam;
    if (E && isEpaPack(id)) {
      const kind =
        id === "epa608-core" ? "core" :
        id === "epa608-type1" ? "type1" :
        id === "epa608-type2" ? "type2" :
        id === "epa608-type3" ? "type3" :
        "universal";
      return E.deck(kind, examLevel);
    }
    const keys = id === "mixed" ? ["epa608", "osha30", "curriculum"] : [id];
    return mixBanks(keys).slice(0, 12);
  }

  function printPackKey() {
    const packSel = root && root.querySelector("#qa-pack");
    const id = (packSel && packSel.value) || packId || "mixed";
    const pack = PACKS.find((p) => p.id === id);
    const title = (pack && pack.name) || "All-Star Exam";
    let items = [];
    const E = global.Epa608Exam;
    if (E && isEpaPack(id)) {
      const kind =
        id === "epa608-core" ? "core" :
        id === "epa608-type1" ? "type1" :
        id === "epa608-type2" ? "type2" :
        id === "epa608-type3" ? "type3" :
        "universal";
      items = E.paper ? E.paper(kind, examLevel) : E.deck(kind, examLevel);
    } else {
      const keys = id === "mixed" ? ["epa608", "osha30", "curriculum"] : [id];
      items = mixBanks(keys);
    }
    if (global.ShopSchool && global.ShopSchool.printQuiz) {
      global.ShopSchool.printQuiz(title, items);
    }
  }

  function pinGen() {
    return String((Math.random() * 900000 + 100000) | 0);
  }

  async function roomPost(body) {
    const r = await fetch("/api/quiz-room", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "Room error");
    return data;
  }

  async function roomGet(pin) {
    const r = await fetch("/api/quiz-room?pin=" + encodeURIComponent(pin), { credentials: "include" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "Room error");
    return data;
  }

  function stopPoll() {
    if (pollId) {
      clearInterval(pollId);
      pollId = 0;
    }
  }

  function applyServerSnap(snap) {
    if (!snap) return;
    const st = snap.state || {};
    if (st.players) players = st.players;
    if (st.scores) scores = st.scores;
    if (st.questions && st.questions.length) questions = st.questions;
    if (typeof snap.qi === "number") qi = snap.qi;
    packId = snap.packId || packId;
    if (snap.status === "play" && mode !== "play" && mode !== "results") {
      mode = "play";
      selected = null;
      locked = false;
      startTimer();
    }
    if (snap.status === "done") {
      mode = "results";
      stopTimer();
    }
    render();
  }

  function startPoll() {
    stopPoll();
    pollId = setInterval(async () => {
      if (!roomPin || role === "solo") return;
      try {
        const snap = await roomGet(roomPin);
        if (role === "player") applyServerSnap(snap);
        else if (role === "host" && snap.state && snap.state.answers) {
          window.__answers = Object.assign({}, window.__answers, snap.state.answers);
          if (snap.state.players) {
            players = snap.state.players;
            if (mode === "host") render();
          }
        }
      } catch (_) {}
    }, 1200);
  }

  function hubLine(kind) {
    if (!global.ProfessorHUB) return "";
    const ctx = { extra: extraSpicy || roastLevel >= 3, level: roastLevel };
    if (kind === "ok") return " " + global.ProfessorHUB.banter("service-ok", ctx);
    if (kind === "bad") return " " + global.ProfessorHUB.banter("service-bad", ctx);
    return " " + global.ProfessorHUB.banter("hub", ctx);
  }

  function broadcast(msg) {
    if (channel) channel.postMessage(msg);
  }

  function ensureChannel(pin) {
    if (channel) try { channel.close(); } catch (_) {}
    channel = null;
    if (typeof BroadcastChannel === "undefined") return;
    try {
      channel = new BroadcastChannel("lt-quiz-" + pin);
      channel.onmessage = (ev) => onNet(ev.data);
    } catch (_) {
      channel = null;
    }
  }

  function onNet(msg) {
    if (!msg || !msg.type) return;
    if (role === "host") {
      if (msg.type === "join") {
        if (!scores[msg.name]) scores[msg.name] = 0;
        if (!players.includes(msg.name)) players.push(msg.name);
        broadcast({ type: "lobby", players: players.slice(), scores: { ...scores }, packId, host: nickname });
        render();
      }
      if (msg.type === "answer" && !locked) {
        // host authoritative scoring happens on host timer end; store early answers
        if (!window.__answers) window.__answers = {};
        window.__answers[msg.name] = { i: msg.i, t: msg.t };
      }
    }
    if (role === "player") {
      if (msg.type === "lobby") {
        players = msg.players || [];
        scores = msg.scores || scores;
        render();
      }
      if (msg.type === "question") {
        questions = msg.questions;
        qi = msg.qi;
        timerMax = msg.timerMax != null ? msg.timerMax : 0;
        selected = null;
        locked = false;
        mode = "play";
        startTimer();
        render();
      }
      if (msg.type === "reveal") {
        locked = true;
        scores = msg.scores || scores;
        lastAward = msg.awards && msg.awards[nickname] ? msg.awards[nickname] : 0;
        stopTimer();
        renderReveal(msg.correct, msg.why);
      }
      if (msg.type === "results") {
        scores = msg.scores || scores;
        mode = "results";
        stopTimer();
        render();
      }
    }
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = 0;
  }

  function startTimer() {
    stopTimer();
    if (!timerMax) {
      timer = 0;
      return;
    }
    timer = timerMax;
    timerId = setInterval(() => {
      if (!root) {
        stopTimer();
        return;
      }
      timer -= 0.1;
      const el = root.querySelector(".qa-timer-bar > i");
      if (el) el.style.width = Math.max(0, (timer / timerMax) * 100) + "%";
      const tx = root.querySelector(".qa-timer-text");
      if (tx) tx.textContent = Math.max(0, Math.ceil(timer)) + "s";
      if (timer <= 0) {
        stopTimer();
        if (role === "solo" || role === "host") finishQuestion();
        else if (role === "player" && !locked) {
          locked = true;
          // wait for host reveal
        }
      }
    }, 100);
  }

  function pointsForSpeed() {
    if (examMode) return 1;
    if (!timerMax) return 1000;
    const frac = Math.max(0, timer / timerMax);
    return Math.round(500 + 500 * frac);
  }

  function examPlace(item) {
    if (!examMode || !item || !item.section) return "Item " + (qi + 1) + " / " + questions.length;
    const names = { core: "Core", type1: "Type I", type2: "Type II", type3: "Type III" };
    let seen = 0;
    let total = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].section !== item.section) continue;
      total++;
      if (i <= qi) seen++;
    }
    return (names[item.section] || "Section") + " · " + seen + " / " + total;
  }

  function finishQuestion() {
    locked = true;
    stopTimer();
    const item = questions[qi];
    if (!item) return;
    const awards = {};
    if (role === "solo") {
      const ok = selected === item.a;
      const got = ok ? pointsForSpeed() : 0;
      awards[nickname] = got;
      scores[nickname] = (scores[nickname] || 0) + got;
      lastAward = got;
      const sec = item.section || "core";
      if (!sectionMarks[sec]) sectionMarks[sec] = { right: 0, total: 0 };
      sectionMarks[sec].total++;
      if (ok) sectionMarks[sec].right++;
      renderReveal(item.a, item.why);
      return;
    }
    if (role === "host") {
      const ans = window.__answers || {};
      // host's own answer
      if (selected != null) ans[nickname] = { i: selected, t: timer };
      Object.keys(ans).forEach((name) => {
        const ok = ans[name].i === item.a;
        const frac = timerMax ? Math.max(0, (ans[name].t || 0) / timerMax) : 1;
        const got = ok ? (examMode ? 1 : Math.round(500 + 500 * frac)) : 0;
        awards[name] = got;
        scores[name] = (scores[name] || 0) + got;
      });
      if (examMode && item.section) {
        if (!sectionMarks[item.section]) sectionMarks[item.section] = { right: 0, total: 0 };
        sectionMarks[item.section].total++;
        if (selected === item.a) sectionMarks[item.section].right++;
      }
      window.__answers = {};
      if (net === "server") {
        roomPost({
          action: "sync",
          pin: roomPin,
          status: "play",
          qi,
          state: { questions, players, scores, answers: {} },
        }).catch(() => {});
      } else {
        broadcast({
          type: "reveal",
          correct: item.a,
          why: item.why,
          scores: { ...scores },
          awards,
        });
      }
      lastAward = awards[nickname] || 0;
      renderReveal(item.a, item.why);
    }
  }

  function continueUniversal() {
    const kind = uniLeft.shift();
    if (!kind || !global.Epa608Exam) {
      finishSat();
      return;
    }
    questions = global.Epa608Exam.deck(kind, examLevel);
    qi = 0;
    selected = null;
    locked = false;
    mode = "play";
    render();
  }

  function finishSat() {
    mode = "results";
    stopTimer();
    render();
    if (hooks.onComplete) {
      try {
        const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        hooks.onComplete({ scores, winner: list[0], total: 100, packId: "epa608", marks: sectionMarks });
      } catch (err) {
        console.warn("quiz complete", err);
      }
    }
  }

  function nextQuestion() {
    var trail = document.getElementById("c90-trail");
    if (trail) trail.remove();
    qi++;
    selected = null;
    locked = false;
    window.__answers = {};
    if (qi >= questions.length) {
      if (role === "solo" && uniLeft.length) {
        mode = "gate";
        stopTimer();
        render();
        return;
      }
      mode = "results";
      stopTimer();
      if (role === "host") {
        if (net === "server") {
          roomPost({
            action: "sync",
            pin: roomPin,
            status: "done",
            qi,
            state: { questions, players, scores, answers: {} },
          }).catch(() => {});
        } else {
          broadcast({ type: "results", scores: { ...scores } });
        }
      }
      render();
      if (hooks.onComplete) {
        try {
          const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
          hooks.onComplete({ scores, winner: list[0], total: questions.length, packId, marks: sectionMarks });
        } catch (err) {
          console.warn("quiz complete", err);
        }
      }
      return;
    }
    if (role === "host") {
      if (net === "server") {
        roomPost({
          action: "sync",
          pin: roomPin,
          status: "play",
          qi,
          state: { questions, players, scores, answers: {} },
        }).catch(() => {});
      } else {
        broadcast({ type: "question", questions, qi, timerMax });
      }
    }
    startTimer();
    render();
  }

  function shortStem(q) {
    var s = String(q || "").replace(/\s+/g, " ").trim();
    var seen = [
      [/HFC substitutes such as R-134a/i, "HFC venting (R-134a) was banned on:"],
      [/reached 0 psig/i, "Recovered to 0 psig. Before charging, it:"],
      [/zeotropic blend has been leaking/i, "Leaked blend. Topping off by gauge is wrong because:"],
      [/Which container and fill are legal/i, "Legal recovery cylinder and fill?"],
      [/still destroy ozone/i, "R-22 still destroys ozone because it:"],
      [/not certified asks the supply house/i, "Selling R-410A to a homeowner is:"],
      [/shop vacuum/i, "Using a shop vacuum to recover refrigerant is:"],
      [/4-pound window unit is being scrapped/i, "Cutting the lines on a 4 lb window unit is:"],
      [/wholesaler still has virgin R-22/i, "New R-22 equipment in 2015. Which was already true?"],
      [/old machine still holds R-12/i, "R-12, then R-22, then R-134a are:"],
      [/jug of R-22, a jug of R-410A/i, "Which jug contains chlorine?"],
      [/Ozone loss lets more ultraviolet/i, "Ozone loss. Which health effect is on the 608 list?"],
      [/Two refrigerants are compared/i, "Low-pressure or high-pressure is decided by:"],
      [/owner wants to sell it to another contractor/i, "Selling that reclaimed R-410A is legal only when:"],
      [/pulls refrigerant with a compressor built into the machine/i, "This machine has its own compressor. It is:"],
      [/cleaned for reuse by the same owner/i, "Remove, clean for the same owner, then AHRI 700. Those steps are:"],
    ];
    for (var i = 0; i < seen.length; i++) {
      if (seen[i][0].test(s)) return seen[i][1];
    }
    var parts = s.split(/(?<=[.?!])\s+/);
    var last = parts.length > 1 ? parts[parts.length - 1] : "";
    if (last && last.length >= 36 && last.length <= 84 && /[?:]$/.test(last) && !/^(this|that|those|it|the sale|the machine|under section)\b/i.test(last)) return last;
    return s;
  }

  function firstLine(s) {
    var t = String(s || "").replace(/\s+/g, " ").trim();
    var p = t.split(/(?<=[.?!])\s+/)[0];
    return p || t;
  }

  function renderReveal(correct, why) {
    const item = questions[qi];
    if (!item) return;
    root.querySelectorAll(".qa-choice, .qa-k-btn").forEach((btn, i) => {
      btn.classList.add("locked");
      if (i === correct) btn.classList.add("correct");
      else btn.classList.add("wrong");
      if (selected === i) btn.classList.add("picked");
    });
    const explain = firstLine(why || item.why || "Not that one.");
    const ok = selected === correct;
    if (window.LtSfx) {
      try {
        if (ok && window.LtSfx.correct) window.LtSfx.correct();
        else if (!ok && window.LtSfx.wrong) window.LtSfx.wrong();
      } catch (_) {}
    }
    if (window.LtHaptic) {
      if (ok) window.LtHaptic.ok();
      else window.LtHaptic.bad();
    }
    const fb = root.querySelector(".qa-feedback");
    if (fb) {
      fb.innerHTML = '<p class="qa-explain-result">' + (ok ? "Right. " : "Wrong. ") + explain.replace(/[&<>]/g, function (c) { return c === "&" ? "&" : c === "<" ? "<" : ">"; }) + "</p>";
      fb.className = "qa-feedback " + (ok ? "good" : "bad");
    }
    const scoreEl = root.querySelector(".qa-exam-score");
    if (scoreEl) {
      scoreEl.textContent = examMode ? (scores[nickname] || 0) + " right" : (scores[nickname] || 0) + " pts";
    }
    const next = root.querySelector(".qa-next");
    if (next) {
      next.classList.remove("hidden");
      next.textContent = qi + 1 < questions.length ? "Next question" : uniLeft.length ? "Score this section" : "See final scores";
      next.onclick = () => nextQuestion();
      try { next.focus(); } catch (_) {}
    }
    if (!ok && item.choices && global.HvacTrail) {
      const cause = lethalCause(item.choices[selected]);
      if (cause) global.HvacTrail.show(cause, "Back to the quiz");
    }
  }

  function startSolo() {
    role = "solo";
    nickname = (root.querySelector("#qa-nick") && root.querySelector("#qa-nick").value.trim()) || "Tech";
    packId = (root.querySelector("#qa-pack") && root.querySelector("#qa-pack").value) || "mixed";
    examMode = isEpaPack(packId);
    timerMax = 0;
    if (packId === "epa608" && global.Epa608Exam) {
      uniLeft = ["type1", "type2", "type3"];
      questions = global.Epa608Exam.deck("core", examLevel);
    } else {
      uniLeft = [];
      questions = buildDeck(packId);
    }
    qi = 0;
    scores = {};
    scores[nickname] = 0;
    players = [nickname];
    sectionMarks = {};
    mode = "play";
    selected = null;
    locked = false;
    startTimer();
    render();
  }

  async function startHost() {
    role = "host";
    nickname = (root.querySelector("#qa-nick") && root.querySelector("#qa-nick").value.trim()) || "Host";
    packId = (root.querySelector("#qa-pack") && root.querySelector("#qa-pack").value) || "mixed";
    examMode = isEpaPack(packId);
    timerMax = 0;
    scores = {};
    scores[nickname] = 0;
    players = [nickname];
    try {
      const created = await roomPost({ action: "create", host: nickname, packId });
      roomPin = created.pin;
      net = "server";
      startPoll();
    } catch (_) {
      roomPin = pinGen();
      net = "local";
      ensureChannel(roomPin);
    }
    mode = "host";
    render();
  }

  async function hostBegin() {
    questions = buildDeck(packId);
    qi = 0;
    sectionMarks = {};
    mode = "play";
    selected = null;
    locked = false;
    window.__answers = {};
    if (net === "server") {
      try {
        await roomPost({
          action: "sync",
          pin: roomPin,
          status: "play",
          qi: 0,
          state: { questions, players, scores, answers: {} },
        });
      } catch (_) {}
    } else {
      broadcast({ type: "question", questions, qi, timerMax });
    }
    startTimer();
    render();
  }

  async function joinRoom() {
    role = "player";
    nickname = (root.querySelector("#qa-nick") && root.querySelector("#qa-nick").value.trim()) || "Player";
    roomPin = (root.querySelector("#qa-pin") && root.querySelector("#qa-pin").value.trim()) || "";
    if (!/^\d{6}$/.test(roomPin)) {
      alert("Enter the 6-digit room PIN from the host.");
      return;
    }
    scores = {};
    scores[nickname] = 0;
    try {
      const snap = await roomPost({ action: "join", pin: roomPin, callsign: nickname });
      net = "server";
      applyServerSnap(snap);
      startPoll();
    } catch (_) {
      net = "local";
      ensureChannel(roomPin);
      broadcast({ type: "join", name: nickname });
    }
    mode = "host";
    render();
  }

  function keepExplainVisible(item) {
    if (!item || !root) return;
    const fb = root.querySelector(".qa-feedback");
    if (!fb) return;
    fb.hidden = false;
    if (fb.classList) fb.classList.remove("hidden");
    if (fb.style && fb.style.display === "none") fb.style.display = "";
  }

  function pick(i) {
    if (locked || mode !== "play") return;
    selected = i;
    locked = true;
    if (role === "player") {
      if (net === "server") {
        roomPost({ action: "answer", pin: roomPin, callsign: nickname, i, t: timer }).catch(() => {});
      } else {
        broadcast({ type: "answer", name: nickname, i, t: timer });
      }
      const fb = root.querySelector(".qa-feedback");
      if (fb) {
        const item = questions[qi];
        const explain = item && (item.explanation || item.why);
        const already = explain && String(fb.textContent || "").indexOf(String(explain)) !== -1;
        if (!already) {
          fb.textContent = "Answer locked in. Waiting for timer…";
          fb.className = "qa-feedback";
        }
      }
      root.querySelectorAll(".qa-choice, .qa-k-btn").forEach((b, idx) => {
        b.classList.add("locked");
        if (idx === i) b.classList.add("picked");
      });
    } else if (role === "solo") {
      // solo waits for timer OR allow instant resolve for snappy feel
      finishQuestion();
    } else if (role === "host") {
      root.querySelectorAll(".qa-choice, .qa-k-btn").forEach((b, idx) => {
        b.classList.add("locked");
        if (idx === i) b.classList.add("picked");
      });
      // host waits for timer to score everyone
    }
    const PF = window.PlayFeel;
    const item = questions[qi];
    if (!PF || !item || typeof item.a !== "number") return;
    const buttons = root ? root.querySelectorAll(".qa-choice, .qa-k-btn") : null;
    const anchor = (buttons && buttons[i]) || (root && root.querySelector(".qa-feedback")) || root;
    if (i === item.a) {
      PF.pop(anchor, "Correct", "ok");
      if (typeof streak === "number" && streak >= 2) PF.pop(anchor, "Streak x" + streak, "xp");
    } else {
      PF.pop(anchor, "Not that", "bad");
      if (role === "solo") keepExplainVisible(item);
    }
  }

  function leaderboardHtml() {
    const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (!list.length) return "<p class='qa-muted'>No scores yet</p>";
    return (
      '<ol class="qa-lb">' +
      list
        .map(
          ([n, s], i) =>
            "<li" +
            (n === nickname ? ' class="me"' : "") +
            "><span>" +
            (i + 1) +
            ". " +
            n +
            "</span><strong>" +
            s +
            "</strong></li>"
        )
        .join("") +
      "</ol>"
    );
  }

  function render() {
    if (!root) return;
    var trail = document.getElementById("c90-trail");
    if (trail && mode !== "play") trail.remove();
    try {
      paint();
    } catch (err) {
      console.warn("quiz render", err);
      try {
        root.innerHTML =
          '<div class="qa-shell"><p class="qa-lede">Exam hit a snag. Hit Shop floor and run it again.</p>' +
          '<button class="btn primary" id="qa-hub">Shop floor</button></div>';
        const b = root.querySelector("#qa-hub");
        if (b) b.onclick = () => hooks.onHub && hooks.onHub();
      } catch (_) {}
    }
  }

  function paint() {
    if (mode === "lobby") {
      root.innerHTML = `
        <div class="qa-shell">
          <header class="qa-head">
            <div class="brand-bar" style="justify-content:flex-start">
              <div class="brand-mark" style="width:28px;height:28px;font-size:14px">LT</div>
              <div class="brand-word"><strong style="font-size:15px">EPA 608 PAPER</strong><span>Core · Type I · Type II · Type III · 18 of 25</span></div>
            </div>
            <button class="btn" id="qa-hub">Shop floor</button>
          </header>
          <div class="qa-lobby">
            <p class="qa-lede">Sit one section, or sit all four. 25 questions. 18 to pass. Miss more than seven and that section does not stamp. These are original questions on the EPA topic list, not the ESCO card.</p>
            <div class="qa-diff" role="group" aria-label="Difficulty">
              <button type="button" class="qa-diff-btn${examLevel === "straight" ? " on" : ""}" data-level="straight">Straight</button>
              <button type="button" class="qa-diff-btn${examLevel === "hard" ? " on" : ""}" data-level="hard">Hard</button>
            </div>
            <p class="qa-muted" id="qa-diff-note">${examLevel === "straight" ? "Straight asks the rule." : "Hard gives you the refrigerant, the pounds, and the year."}</p>
            <div class="qa-outline">
              <button type="button" class="qa-pack-btn" data-pack="epa608-core"><b>Core</b><span>Chlorine, the venting dates, the three R's, cylinders, oils</span></button>
              <button type="button" class="qa-pack-btn" data-pack="epa608-type1"><b>Type I</b><span>Factory-sealed, 5 lb. 90 percent, 80 percent, or 4 in Hg</span></button>
              <button type="button" class="qa-pack-btn" data-pack="epa608-type2"><b>Type II</b><span>Splits. 0 psig, 10 in, 15 in. Leak rates 10 / 20 / 30</span></button>
              <button type="button" class="qa-pack-btn" data-pack="epa608-type3"><b>Type III</b><span>Chillers. 25 mm Hg absolute. Leak test stops at 10 psig</span></button>
              <button type="button" class="qa-pack-btn" data-pack="epa608"><b>Universal</b><span>Core, then Type I, II, and III. You see the score before the next section</span></button>
            </div>
            <p class="qa-muted">Other packs stay below. OSHA and the shop mix are timed games. The 608 buttons are the paper.</p>
            <label class="spicy-toggle qa-heat">HUB roast
              <input type="range" id="qa-roast" min="0" max="3" step="1" value="${roastLevel}" />
              <span id="qa-roast-lab"></span>
            </label>
            <div class="qa-pack-row" id="qa-pack-row">
              <button type="button" class="qa-pack-btn" data-pack="refov">Refrigeration Overview</button>
              <button type="button" class="qa-pack-btn" data-pack="leak">Leak Detection</button>
              <button type="button" class="qa-pack-btn" data-pack="osha30">OSHA 30</button>
              <button type="button" class="qa-pack-btn" data-pack="curriculum">${(window.LtBrand && window.LtBrand.packCurriculum) || "HVAC Legends"}</button>
              <button type="button" class="qa-pack-btn" data-pack="mixed">Mix all</button>
            </div>
            <label>Nickname<input id="qa-nick" maxlength="14" value="${nickname}" placeholder="Your name"/></label>
            <label>Question pack
              <select id="qa-pack">
                ${PACKS.map((p) => `<option value="${p.id}">${p.name} — ${p.blurb}</option>`).join("")}
              </select>
            </label>
            <div class="qa-actions">
              <button class="btn primary" id="qa-solo">Solo game</button>
              <button class="btn" id="qa-host">Host classroom</button>
              <button class="btn" id="qa-print">Print test + key</button>
            </div>
            <div class="qa-join-box">
              <p class="eyebrow">Join a room</p>
              <label>Room PIN<input id="qa-pin" maxlength="6" placeholder="6-digit PIN"/></label>
              <button class="btn primary" id="qa-join">Join</button>
              <p class="qa-muted">Online classroom: host a room, share the 6-digit PIN. Students join from any phone or laptop. Signed-in scores hit the All-Star board.</p>
            </div>
          </div>
        </div>`;
      root.querySelector("#qa-hub") && (root.querySelector("#qa-hub").onclick = () => hooks.onHub && hooks.onHub());
      root.querySelector("#qa-solo") && (root.querySelector("#qa-solo").onclick = startSolo);
      root.querySelector("#qa-host") && (root.querySelector("#qa-host").onclick = startHost);
      root.querySelector("#qa-print") && (root.querySelector("#qa-print").onclick = printPackKey);
      root.querySelector("#qa-join") && (root.querySelector("#qa-join").onclick = joinRoom);
      const roastEl = root.querySelector("#qa-roast");
      const roastLab = root.querySelector("#qa-roast-lab");
      const labs = ["Classroom", "Mild", "Spicy", "Extra"];
      function paintRoast() {
        if (roastLab) roastLab.textContent = labs[roastLevel] || "Mild";
      }
      paintRoast();
      if (roastEl) {
        roastEl.value = String(roastLevel);
        roastEl.oninput = () => {
          roastLevel = +roastEl.value;
          extraSpicy = roastLevel >= 3;
          paintRoast();
          if (hooks.onRoast) hooks.onRoast(roastLevel);
          if (hooks.onExtra) hooks.onExtra(extraSpicy);
        };
      }
      const packSel = root.querySelector("#qa-pack");
      root.querySelectorAll(".qa-diff-btn").forEach((b) => {
        b.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          examLevel = b.getAttribute("data-level") === "straight" ? "straight" : "hard";
          root.querySelectorAll(".qa-diff-btn").forEach((x) => x.classList.toggle("on", x === b));
          const note = root.querySelector("#qa-diff-note");
          if (note) note.textContent = examLevel === "straight" ? "Straight asks the rule." : "Hard gives you the refrigerant, the pounds, and the year.";
        };
      });
      root.querySelectorAll(".qa-pack-btn").forEach((b) => {
        b.onclick = () => {
          if (packSel) packSel.value = b.dataset.pack;
          root.querySelectorAll(".qa-pack-btn").forEach((x) => x.classList.toggle("on", x === b));
          packId = b.dataset.pack;
          startSolo();
        };
      });
      return;
    }

    if (mode === "host" && role !== "solo") {
      root.innerHTML = `
        <div class="qa-shell">
          <header class="qa-head">
            <div><p class="eyebrow">Room lobby</p><h2>PIN ${roomPin}</h2></div>
            <button class="btn" id="qa-hub">Shop floor</button>
          </header>
          <div class="qa-lobby">
            <p class="qa-lede">Players join with this PIN on the same game site. Pack: <strong>${PACKS.find((p) => p.id === packId)?.name || packId}</strong></p>
            <div class="qa-pin-big">${roomPin}</div>
            <h3>Players</h3>
            ${leaderboardHtml()}
            ${
              role === "host"
                ? '<button class="btn primary" id="qa-begin">Start quiz</button>'
                : '<p class="qa-muted">Waiting for host to start…</p>'
            }
          </div>
        </div>`;
      root.querySelector("#qa-hub").onclick = () => hooks.onHub && hooks.onHub();
      const b = root.querySelector("#qa-begin");
      if (b) b.onclick = hostBegin;
      return;
    }

    if (mode === "gate") {
      const labels = { core: "Core", type1: "Type I", type2: "Type II", type3: "Type III" };
      const nextKind = uniLeft[0];
      const lines = ["core", "type1", "type2", "type3"]
        .filter(function (s) { return sectionMarks[s] && sectionMarks[s].total; })
        .map(function (s) {
          const m = sectionMarks[s];
          const pass = m.right >= 18;
          return '<p class="' + (pass ? "pass" : "fail") + '"><strong>' + labels[s] + "</strong> " + m.right + "/" + m.total + (pass ? " PASS" : " FAIL — need 18") + "</p>";
        })
        .join("");
      root.innerHTML =
        '<div class="qa-shell"><header class="qa-head"><div><p class="eyebrow">Universal</p><h2>Section scored</h2></div><button class="btn" id="qa-hub">Shop floor</button></header>' +
        '<div class="qa-lobby"><div class="qa-608-stamp">' + lines + "</div>" +
        "<p class=\"qa-lede\">Next is " + labels[nextKind] + ". 25 questions. 18 to pass. A miss does not stop the card. Universal needs 18 on every section.</p>" +
        '<div class="qa-actions"><button class="btn primary" id="qa-uni-next">Continue · ' + labels[nextKind] + '</button>' +
        '<button class="btn" id="qa-uni-stop">Score and stop</button></div></div></div>';
      root.querySelector("#qa-hub").onclick = function () { if (hooks.onHub) hooks.onHub(); };
      root.querySelector("#qa-uni-next").onclick = continueUniversal;
      root.querySelector("#qa-uni-stop").onclick = function () {
        uniLeft = [];
        finishSat();
      };
      return;
    }

    if (mode === "results") {
      const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const labels = { core: "Core", type1: "Type I", type2: "Type II", type3: "Type III" };
      const secs = ["core", "type1", "type2", "type3"].filter(function (s) {
        return sectionMarks[s] && sectionMarks[s].total;
      });
      let stamp = "";
      if (secs.length) {
        let allPass = secs.length > 0;
        stamp =
          '<div class="qa-608-stamp">' +
          secs
            .map(function (s) {
              const m = sectionMarks[s];
              const pass = m.right >= 18;
              if (!pass) allPass = false;
              return (
                '<p class="' +
                (pass ? "pass" : "fail") +
                '"><strong>' +
                labels[s] +
                "</strong> " +
                m.right +
                "/" +
                m.total +
                (pass ? " PASS" : " FAIL — need 18") +
                "</p>"
              );
            })
            .join("") +
          (secs.length === 4
            ? '<p class="qa-608-uni">' +
              (allPass ? "Universal: stamped. All four sections 18+." : "Universal not stamped — retake the failed section(s).") +
              "</p>"
            : "") +
          '<p class="qa-muted">Training paper on the EPA topic list. Not the ESCO bank. The real card is sat with a proctor.</p>' +
          "</div>";
      }
      root.innerHTML = `
        <div class="qa-shell">
          <header class="qa-head">
            <div><p class="eyebrow">${examMode ? "EPA 608 2026 paper" : "Final podium"}</p><h2>${examMode ? "Section scores" : "Quiz complete"}</h2></div>
            <button class="btn" id="qa-hub">Shop floor</button>
          </header>
          <div class="qa-lobby">
            ${stamp}
            ${leaderboardHtml()}
            <p class="qa-feedback good">${list[0] ? (examMode ? "" : "🏆 " + list[0][0] + " leads with " + list[0][1] + " pts. ") : ""}${examMode ? "" : hubLine("ok")}</p>
            <button class="btn primary" id="qa-again">Sit again</button>
          </div>
        </div>`;
      root.querySelector("#qa-hub").onclick = () => hooks.onHub && hooks.onHub();
      root.querySelector("#qa-again").onclick = () => {
        mode = "lobby";
        render();
      };
      return;
    }

    // play
    const item = questions[qi];
    if (!item) {
      mode = "results";
      render();
      return;
    }
    root.innerHTML = `
      <div class="qa-exam">
        <div class="qa-exam-body">
        <header class="qa-exam-top">
          <span class="qa-exam-pack">${
            item.section
              ? (({ core: "Core", type1: "Type I", type2: "Type II", type3: "Type III" }[item.section] || item.section) + (examMode ? " · " + (examLevel === "straight" ? "Straight" : "Hard") : ""))
              : (item.pack || packId || "")
                  .replace("curriculum", (window.LtBrand && window.LtBrand.packCurriculum) || "HVAC Legends")
                  .replace("epa608", "EPA 608")
                  .replace("osha30", "OSHA 30")
          }</span>
          <span class="qa-exam-qnum">${examPlace(item)}</span>
          <span class="qa-timer-text qa-exam-time">${examMode ? "18 to pass" : timerMax ? Math.ceil(timer) + "s" : "untimed"}</span>
          <span class="qa-exam-score">${examMode ? (scores[nickname] || 0) + " right" : (scores[nickname] || 0) + " pts"}</span>
          <button class="btn" id="qa-hub">Shop floor</button>
        </header>
        <div class="qa-timer-bar qa-exam-bar"${timerMax ? "" : " hidden"}><i style="width:${timerMax ? (timer / timerMax) * 100 : 100}%"></i></div>
        <h2 class="qa-exam-question">${shortStem(item.q)}</h2>
        <div class="qa-exam-grid">
          ${(item.choices || [])
            .map(
              (c, i) =>
                `<button class="qa-k-btn qa-exam-btn" data-i="${i}"><span class="qa-exam-letter">${LETTERS[i]}</span><span class="qa-k-txt">${c}</span></button>`
            )
            .join("")}
        </div>
        <p class="qa-feedback"></p>
        </div>
        <div class="qa-exam-foot">
          <button class="btn primary qa-next hidden">Next item</button>
        </div>
      </div>`;
    root.querySelectorAll(".qa-k-btn").forEach((btn) => {
      btn.onclick = () => pick(+btn.dataset.i);
    });
    const hubBtn = root.querySelector("#qa-hub");
    if (hubBtn) hubBtn.onclick = () => {
      stopTimer();
      if (hooks.onHub) hooks.onHub();
    };
  }

  function start(host, opts) {
    if (!document.getElementById("qa-diff-css")) {
      const st = document.createElement("style");
      st.id = "qa-diff-css";
      st.textContent = ".qa-diff{display:flex;gap:8px;margin:0 0 6px}.qa-diff-btn{flex:1 1 0;min-height:48px;border-radius:12px;border:1px solid #6d5b3c;background:#1c2126;color:#f6f0e2;font:700 16px/1 system-ui,sans-serif;cursor:pointer}.qa-diff-btn.on{background:#e8c450;color:#1a1408;border-color:#e8c450}#qa-diff-note{margin:0 0 8px}#screen-quiz .qa-exam-question{font-size:16px!important;line-height:1.25!important;margin:2px 0 8px!important}#screen-quiz .qa-feedback{margin:8px 0 0;font-size:15px;line-height:1.3}";
      document.head.appendChild(st);
    }
    root = host;
    hooks = opts || {};
    mode = "lobby";
    role = "solo";
    nickname = (opts && opts.nickname) || "Tech";
    extraSpicy = !!(opts && (opts.extraSpicy || opts.roastLevel >= 3));
    roastLevel = typeof (opts && opts.roastLevel) === "number" ? opts.roastLevel : extraSpicy ? 3 : 1;
    scores = {};
    players = [];
    stopTimer();
    function onKey(e) {
      if (e.key === "Escape" && !/input|textarea|select/i.test(e.target.tagName || "")) {
        stopTimer();
        if (hooks.onHub) hooks.onHub();
      }
    }
    document.addEventListener("keydown", onKey);
    render();
    if (opts && /^\d{6}$/.test(String(opts.joinPin || ""))) {
      nickname = (opts.nickname || nickname || "Student").slice(0, 14);
      roomPin = String(opts.joinPin);
      const nickEl = root.querySelector("#qa-nick");
      const pinEl = root.querySelector("#qa-pin");
      if (nickEl) nickEl.value = nickname;
      if (pinEl) pinEl.value = roomPin;
      joinRoom();
    }
    return {
      stop() {
        stopTimer();
        stopPoll();
        document.removeEventListener("keydown", onKey);
        if (channel) try { channel.close(); } catch (_) {}
      },
    };
  }

  global.QuizArena = { start, BANK, PACKS };
})(window);
