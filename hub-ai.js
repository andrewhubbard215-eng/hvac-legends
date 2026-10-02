/* Professor HUB — In-game AI mentor
   Installation + troubleshooting genius. Deadpool wit. Offline knowledge engine. */
(function (global) {
  "use strict";

  const KB = [
    {
      tags: ["iconnect", "tu-522", "tu522", "fault board", "pump down switch", "potential relay"],
      topic: "TU-522 compressor fault board",
      answer:
        "TU-522 is the single-phase board in the lab. R-134a only. If the contactor is out, meter the control string: temperature control, pump-down switch, low pressure control, high pressure control, then the coil. If the contactor is in and the compressor is dead, meter the overload, the run capacitor, and the potential relay. Do not jumper a safety to make it run. The solid-state relay is on the board so you can see it. It is not in every circuit.",
    },
    {
      tags: ["tu-601", "tu601", "multi-head", "mini-split trainer", "daikin trainer"],
      topic: "TU-601 mini-split trainer",
      answer:
        "TU-601 is the multi-head mini-split heat pump. Plate: R-410A only, 208/240 volts, 20 amps, 60 hertz. The Daikin on the floor is the outdoor unit. The cassette is an indoor head. Each head has its own line set. Blue gauge is suction. A 24-volt Nest does not run this compressor.",
    },
    {
      tags: ["tu-210", "tu210", "gas boiler", "hydronic trainer", "north park"],
      topic: "TU-210G hydronic boiler",
      answer:
        "TU-210G is a gas boiler hydronic trainer from North Park Innovations, Ellicottville, NY. Water moves the heat. The copper is a water pipe, not a suction line. The duplex outlet on the cabinet is not the gas valve. Prove water is in the boiler and the high limit is closed before anyone opens the gas.",
    },
    {
      tags: ["commandment", "commandments", "ten commandments", "shop law", "hvac jesus", "gauges of god"],
      topic: "The HVAC Commandments",
      answer:
        "The ten shop laws: 1) Recover first — never vent. 2) Nut on the tube before you flare. 3) Dry nitrogen only. 4) Microns at the system, not a compound gauge. 5) Don't top off a leaker — recover, repair, evacuate, weigh in. 6) Lockout before ohms or µF. 7) Nameplate is law (MCA/MOP/charge). 8) SH = suction temp − evap sat; SC = cond sat − liquid temp. 9) Airflow before charge. 10) " + ((window.LtBrand && window.LtBrand.isStore) ? "The shop is home base" : "The shop is home base") + " — log it, teach the next helper. Open HVAC Commandments on the shop floor or ask me any one of them.",
    },
    {
      tags: ["nameplate", "data plate", "label", "model number", "serial number", "read plate"],
      topic: "Reading nameplates",
      answer:
        "Use 📷 Read label — photo the data plate square-on with good light. I'll OCR model, serial, refrigerant, charge, MCA/MOP, voltage. Always verify OCR against the sticker. Log it before you open the system.",
    },

    {
      tags: ["leak rate", "annualizing", "aim act", "15 pounds", "10 percent", "20 percent", "30 percent", "leak repair threshold"],
      topic: "AIM leak rate example",
      answer:
        "AIM leak repair (40 CFR 84.106) from Jan 1, 2026: systems with ≥15 lb of HFC (or high-GWP substitute) — not typical residential light AC. Thresholds: comfort cooling/other 10%, commercial refrigeration 20%, industrial process 30%. Example (annualizing method): Comfort-cooling package, full charge 100 lb. You add 8 lb of HFC and it has been 73 days since the last addition. Annualized leak rate ≈ (8 / 100) × (365 / 73) × 100% ≈ 40%. That is above the 10% comfort-cooling threshold — repair clock starts (generally 30 days). Short time between top-offs makes the rate look worse. Always use the official EPA method and owner records; this is training math, not a compliance filing.",
    },
    {
      tags: ["checklist", "install checklist", "job checklist", "before start"],
      topic: "Install checklist",
      answer:
        "Pre-job: model match, correct line sizes, electrical capacity, pad/bracket, disconnect, permits if required. Process: mount IDU level → slope penetration out → set ODU with clearance → flare/torque → N₂ pressure test → ≤500 micron vacuum + decay → open valves → land power & comms → additional charge by weight if lineset long → commission ΔT/drain/codes → seal wall → educate customer. Skip vacuum = time bomb.",
    },
    {
      tags: ["tools", "tool list", "what tools", "tool bag"],
      topic: "Core tool bag",
      answer:
        "Must-haves: manifold gauges (or digital), micron gauge, vacuum pump, recovery machine + tank, torque wrench, flaring tool, tube cutter, deburr, nitrogen + regulator, soap solution, multimeter, amp clamp, thermometers/probes, allen keys for service valves, core tools, leak detector, PPE. Nice: wireless probes, scale for weigh-in, inspection mirror, fin comb. If you're missing micron gauge and torque wrench, you're guessing — and guessing is expensive.",
    },
    {
      tags: ["safety", "lockout", "ppe", "shock", "burn"],
      topic: "Safety",
      answer:
        "PPE: glasses, gloves as needed, hearing protection on recovery. Electrical: kill power, verify dead with meter, lockout/tagout when required. Never work a live contactor with jewelry and optimism. Nitrogen only for pressure tests — oxygen is a bomb recipe with oil. Hot copper and brazing = burn risk. Ladders tied off, not heroic. Call 911 for real emergencies; I'm witty, not EMS.",
    },
    {
      tags: ["diagnose", "diagnostic", "where to start", "troubleshooting steps", "flowchart"],
      topic: "Diagnostic order",
      answer:
        "1) Verify complaint (no cool, ice, noise, trip). 2) Thermostat calling? Mode correct? 3) Indoor airflow — filter, blower, coil. 4) Outdoor unit running? Contactor, cap, voltage. 5) Gauges: suction, head, SH, SC together. 6) Compare to fingerprint chart (undercharge vs restriction vs dirty condenser vs overcharge). 7) Electrical only after mechanical sense. Don't condemn the compressor first; it's the expensive scapegoat.",
    },
    {
      tags: ["fingerprint", "pressure diagnosis", "gauge reading", "what do pressures mean"],
      topic: "Pressure fingerprints",
      answer:
        "High SH + low SC → undercharge/leak. High SH + high/normal SC → liquid-line restriction or TXV issue. Low SH + high SC → overcharge or low evaporator load/airflow on some systems. High head + high SC + high amps → dirty condenser or non-condensables. Low head + low suction both → severe undercharge or weak compressor. Always pair SH with SC. One number is a coin flip.",
    },
    {
      tags: ["manifold", "gauges", "hose", "blue hose", "red hose", "yellow hose", "compound", "handwheel", "hook up gauges"],
      topic: "Manifold hookup",
      answer:
        "Blue hose → suction king valve (fat vapor line). Red hose → liquid king valve (skinny line). Yellow is utility — recovery, vacuum, cylinder. To READ: both handwheels seated, yellow capped. Open a valve and that side dumps into yellow. Purge a second of vapor so you're not reading hose air. Never put blue on the liquid — 410A high side will peg a compound gauge. SH = suction line temp − evap sat from blue psig. SC = cond sat from red psig − liquid line temp. TXV charged by SC. Piston charged by SH. Open Manifold school on the floor and walk it.",
    },
    {
      tags: ["superheat", "how to measure superheat", "calculate superheat"],
      topic: "Measuring superheat",
      answer:
        "Superheat = suction line temperature at the evaporator outlet (or compressor inlet, be consistent) minus saturated suction temperature from the PT chart at suction pressure. TXV systems often target moderate SH (OEM range). Fixed orifice often charged by superheat charts vs outdoor/indoor wet bulb. Low SH risks liquid floodback. High SH means starved evaporator.",
    },
    {
      tags: ["subcooling", "how to measure subcooling", "calculate subcooling"],
      topic: "Measuring subcooling",
      answer:
        "Subcooling = saturated liquid temp from PT chart at liquid-line pressure minus actual liquid-line temperature. TXV systems are often charged by SC + weigh-in. High SC can mean overcharge or restricted condenser flow. Low SC often undercharge. Measure liquid line temp with good contact, out of direct sun when possible.",
    },
    {
      tags: ["short cycle", "short cycling", "turns on and off", "cycling"],
      topic: "Short cycling",
      answer:
        "Causes: oversized equipment, thermostat in supply airstream, low charge trips, high-pressure resets (dirty condenser), low-pressure trips (airflow/charge), failing control board, hard-start issues. Check amp draw, pressures, thermostat placement, dirty filter. Rapid cycling kills compressors. Fix the cause; don't just strap on a hard-start and pray.",
    },
    {
      tags: ["voltmeter", "multimeter", "dmm", "vac", "vdc", "com jack", "how to meter", "use a meter", "leads", "probes"],
      topic: "Using a voltmeter",
      answer:
        "Black in COM. Red in VΩ for volts and ohms. Dial VAC for HVAC — transformers are AC, VDC lies. Voltage is parallel across the load. L1–L2 ~240, L1–GND ~120 on split-phase, R–C 24–28 VAC. Never ohm a live circuit. Never put voltage into the A jack — that's a meter fuse. Clamp one hot for amps. If you're stuck: confirm jacks, confirm dial, then walk L1-L2, then R-C, then Y through the safeties.",
    },
    {
      tags: ["ohm live", "meter fuse", "amp jack", "continuity live"],
      topic: "Meter mistakes",
      answer:
        "Two ways techs kill a meter: (1) Ohms/continuity on a live circuit — lockout first. (2) Red in the 10A jack while measuring volts — that's a dead fuse. COM + VΩ + VAC for voltage. COM + A only when you mean current.",
    },
    {
      tags: ["capacitor", "cap", "dual run", "hard start", "humming not start"],
      topic: "Capacitors",
      answer:
        "Power off, discharge the cap safely. Read microfarads with a meter that does capacitance — ±6% of rating is a common tolerance (check OEM). Bulged or leaking = replace. Dual run: C, FAN, HERM terminals. Humming compressor that won't start often weak start/run cap or mechanical seize. Hard-start kits are a bandage, not a diagnosis.",
    },
    {
      tags: ["contactor", "relay", "pitted", "points"],
      topic: "Contactors",
      answer:
        "Pitted/burned contacts, welded closed, or weak coil. Check coil voltage when calling, amp side for voltage drop across contacts under load. Buzzing contactor = low voltage or failing coil. Replace with correct FLA rating. A welded contactor can run the unit when the thermostat is off — classic 'won't shut off' call.",
    },
    {
      tags: ["thermostat", "stat wiring", "r w y g c", "common wire"],
      topic: "Thermostat basics",
      answer:
        "R power, C common, Y compressor, G fan, W heat, O/B heat pump reversing. Floating rings and bad C wire cause random Wi-Fi stat death. Verify 24V between R and C. Heat pump: confirm O vs B energized in cool or heat per OEM. Don't assume colors are gospel — meter and diagram beat tradition.",
    },
    {
      tags: ["heat pump", "reversing valve", "defrost", "aux heat", "emergency heat"],
      topic: "Heat pumps",
      answer:
        "Reversing valve shifts cool/heat. Defrost melts outdoor ice in heat mode — hiss, steam, cool air indoors briefly is normal during defrost. Aux/emergency heat is electric strips — expensive, for low ambient or defrost. Diagnose: mode correct, outdoor coil clean, proper charge (critical on heat pumps), sensors intact. Don't condemn the valve first without temperature change across it when energized.",
    },
    {
      tags: ["furnace", "gas heat", "ignitor", "flame sensor", "inducer"],
      topic: "Gas furnace quick path",
      answer:
        "Call for heat → inducer → pressure switch → ignition → flame sense → gas valve stays. Clean flame sensor with emery cloth carefully. Inducer and pressure switch are common no-heat. Limit trips = airflow (filter/coil/duct). Carbon monoxide is not a training sim problem — real world, use CO sense and respect venting. If unsure on gas, escalate.",
    },
    {
      tags: ["condensate", "drain", "water leak", "float switch", "pan"],
      topic: "Condensate",
      answer:
        "Drain must slope downhill continuously. Clean trap and line (vinegar/bleach per practice, or nitrogen blow-out carefully). Float switch should kill Y on overflow — test it. Secondary pan and wet switch save ceilings. Algae tablets help. Water on the floor is a customer relationship problem as much as a mechanical one.",
    },
    {
      tags: ["airflow", "filter", "cfm", "static pressure", "blower"],
      topic: "Airflow",
      answer:
        "Dirty filter, blocked return, closed supply registers, dirty indoor coil, wrong blower speed, undersized duct. Low airflow → ice, high SH sometimes, high delta-T, unhappy TXV. Measure static if you can. 'Add gas' will not fix a stuffed filter. Change the filter before you change the compressor.",
    },
    {
      tags: ["noncondensable", "non-condensable", "air in system", "nitrogen left"],
      topic: "Non-condensables",
      answer:
        "Air/nitrogen left in the system raises head pressure and SC weirdly, reduces capacity, can look like overcharge. Cure: recover, evacuate properly to ≤500 microns with decay, recharge by weight. This is why vacuum discipline exists — not to torture apprentices.",
    },
    {
      tags: ["pump down", "front seat", "back seat", "mid seat", "service valve positions"],
      topic: "Service valve positions",
      answer:
        "Back seated: normal run, gauge port closed. Mid seated: gauges can read. Front seated: valve closed to coil/lines — used carefully for pump-down on some systems. Know the valve before you spin it. Mini-splits often use hex service valves to release factory charge after vacuum — different muscle memory than old residential king valves.",
    },
    {
      tags: ["specific gravity", "r-410a", "410a", "water capacity", "tare weight", "0.8472", "1.059", "tank fill", "80 percent"],
      topic: "R-410A specific gravity",
      answer:
        "R-410A specific gravity at 77°F is 1.059. AHRI Guideline K already folds the 80% into the multiplier 0.8472, because 0.8 times 1.059 is 0.8472. Max refrigerant in the tank is 0.8472 times the water capacity stamped on the tank. Max gross on the scale is that number plus the tare weight. A tank marked 30 lb is not a 30 lb water capacity. One common cylinder is WC 26.2 and TW 17: stop at 22.2 lb of R-410A, 39.2 lb gross. Ice lowers tank pressure. It does not raise the fill limit. At about 130°F the liquid is lighter, so a hot van should hold less than the 77°F number. R-134a is not 1.059. Its 77°F multiplier is 0.9656.",
    },
    {
      tags: ["recovery", "recover refrigerant", "push pull", "tank"],
      topic: "Recovery",
      answer:
        "EPA 608: recover before opening. Use recovery machine and DOT tank rated for the refrigerant. Tank upright for vapor, correct for liquid per procedure. Don't overfill (80% rule / scale). Push-pull for large liquid loads. Label recovered refrigerant. Venting is illegal and on-brand for villains only.",
    },
    {
      tags: ["vacuum pump oil", "pump maintenance", "micron won't drop"],
      topic: "Vacuum won't pull down",
      answer:
        "Change vacuum pump oil when milky or after wet systems. Use short large-diameter vacuum-rated hoses. Remove schrader cores. Check for leaks on gauge manifold. System leak or moisture will stop you at a plateau. Isolate and decay-test. If pump and blank-off pull deep but system won't, the leak is in the circuit — not the multiverse.",
    },
    {
      tags: ["lineset size", "pipe size", "suction size", "liquid size"],
      topic: "Line sizing",
      answer:
        "Follow OEM charts for suction and liquid diameter vs capacity and length. Undersized suction = capacity loss and oil return risk. Oversized can hurt oil return too. Insulate suction fully; UV-protect outdoor insulation. Minimize elbows. Trap rules for long vertical lifts — OEM dependent. When in doubt, the manual beats the supply-house guess.",
    },
    {
      tags: ["insulation", "uv tape", "armaflex", "suction insulation"],
      topic: "Insulation",
      answer:
        "Suction line insulation prevents condensation and capacity loss. Seal seams; cover outdoor sections from sun (UV tape or jacket). Missing insulation = sweaty lines, ceiling stains, efficiency loss. Liquid line usually uninsulated unless OEM says otherwise or runs through hot attic in special cases.",
    },
    {
      tags: ["oil", "poe", "pag", "oil return", "acid"],
      topic: "Oil & acid",
      answer:
        "POE is hygroscopic — keep containers capped. After burnout, use burnout drier procedures and proper flush practices per OEM. Acid test kits exist for a reason. Moisture + refrigerant + oil → acid → dead compressor windings. Vacuum and driers are how you avoid that horror movie.",
    },
    {
      tags: ["burnout", "compressor failure", "replace compressor"],
      topic: "Compressor burnout",
      answer:
        "Confirm electrically (windings to ground, open windings) and mechanically. After burnout: recover, replace compressor, replace drier(s), clean up contaminants per procedure, evacuate deep, charge by weight. Find WHY it failed (airflow, charge, short cycling, electrical) or the new one dies for the same reason — expensive déjà vu.",
    },
    {
      tags: ["customer", "explain", "talk to customer", "how to explain"],
      topic: "Customer talk",
      answer:
        "Plain language: 'Your outdoor coil is clogged so heat can't leave the system' beats 'elevated SC with non-optimal heat rejection.' Show the dirty filter. Offer options with prices if you're in that role. Spicy jokes stay in the truck unless you know the customer. Document what you found. Callbacks hate surprises.",
    },
    {
      tags: ["weigh", "scale", "charge by weight", "critical charge"],
      topic: "Weigh-in charging",
      answer:
        "Many modern systems are critical charge. Recover fully if needed, evacuate, weigh in nameplate amount plus lineset adder. Digital scale under the cylinder. Liquid charge into high side when appropriate with compressor off, or follow OEM. Then fine-tune with SC/SH as specified. Cans without a scale is cowboy math.",
    },
    {
      tags: ["leak detect", "electronic leak", "sniffer", "ultraviolet", "dye"],
      topic: "Finding leaks",
      answer:
        "Soap bubbles for joints you can reach. Electronic detector for trace. Ultrasonic in noisy environments with skill. UV dye only if acceptable to OEM/oil type — some compressors hate surprise dye. Nitrogen pressure test for new installs before vacuum. Check service ports, flares, schraders, coil returns, inverted traps.",
    },
    {
      tags: ["mini split", "minisplit", "ductless", "flare install"],
      topic: "Mini-split install order",
      answer:
        "Mount IDU → slope wall hole out → set ODU → flare & torque → N₂ test → deep vacuum ≤500 µm → decay → open service valves → power & comms → additional charge if needed → commission. Communication wire polarity matters. Condensate must drain. Don't leave UV-exposed foam to die in a summer.",
    },
    {
      tags: ["flare", "flaring", "flare nut"],
      topic: "Flaring copper",
      answer:
        "Nut on FIRST. Square cut. Deburr. Eccentric 45° flare. Inspect. Lube face lightly. Torque to OEM. Bad flare = #1 ductless leak. If it looks like a smashed penny, cut it off and redo. Pride is cheaper than a callback.",
    },
    {
      tags: ["torque", "ft-lb", "ft lb"],
      topic: "Torque",
      answer:
        "Use a torque wrench. Typical training ballparks (confirm OEM): ~12–13 ft-lb on 1/4″, higher on larger sizes. Backup wrench on the body. Over-tight cracks flares; under-tight weeps refrigerant all summer.",
    },
    {
      tags: ["defrost", "frost", "ice outdoor", "heat pump defrost", "defrost sensor", "glacier"],
      topic: "Heat pump defrost",
      answer:
        "In HEAT the outdoor coil is the evaporator — it ices below ~40°F. Defrost: board puts the 4-way into COOL, outdoor FAN OFF, compressor on, indoor often aux heat so the house isn't dumped with cold air. Time/temp or demand (coil vs outdoor). Terminate when the outdoor coil hits ~50–70°F or max time (~10 min). Never starts: bad coil sensor, outdoor sensor, or board. Never ends (steaming, cool air inside): sensor/board stuck. Don't add refrigerant to an iced ODU. Force defrost from the board, confirm RV shift + fan stop.",
    },
    {
      tags: ["reversing", "reversing valve", "4-way", "4 way", "heat pump", "o/b", "stuck in heat"],
      topic: "Heat pump reversing valve",
      answer:
        "The 4-way (reversing) valve swaps which coil is the condenser. Discharge is always the middle tube. Most brands energize O in COOL; Rheem/Ruud often energize B in HEAT. Diagnose: 1) 24V at the solenoid when the mode should shift. 2) Listen/feel the click. 3) Pressures and indoor vs outdoor coil roles must swap. Stuck slider = 24V present, no shift — replace the valve. Internal bleed = suction warm, capacity gone, discharge/suction closer than they should be — also replace the valve, not a charge problem. Don't condemn the compressor first.",
    },
    {
      tags: ["nitrogen", "n2", "pressure test", "oxygen", "asphyxiation", "regulator"],
      topic: "Nitrogen safety",
      answer:
        "N₂ SAFETY, not a suggestion: 1) Regulator on the cylinder — bottles are ~2200+ psig. Never open a bottle into a hose. 2) Dry nitrogen GAS only. Never oxygen. Never shop compressed air. Oil + oxygen can detonate. 3) Stay at or below OEM test pressure; watch the gauge; use the regulator relief. 4) Nitrogen displaces oxygen — confined space / van / crawl = asphyxiation. 5) Low-flow purge while brazing; standing test is a hold, not 'fill until it pops.' 6) This is not liquid nitrogen. If someone hands you an O2 bottle for a leak test, send them to class.",
    },
    {
      tags: ["vacuum", "micron", "evacuate", "decay"],
      topic: "Deep vacuum",
      answer:
        "Micron gauge at the system. ≤500 microns. Core tools out. Short fat hoses. Decay test 10–15 min. Rise forever = leak. High plateau = moisture. Triple evacuate with N₂ breaks when wet or long lines. Compound gauges are not micron gauges — stop cosplaying.",
    },
    {
      tags: ["undercharge", "low on charge", "leak", "top off"],
      topic: "Undercharge / leak",
      answer:
        "High SH + low SC fingerprint. Find leak, recover, repair, evacuate, charge correctly. Topping off a leaker funds the refrigerant company and your callback calendar. 🔍 Scan unit photos for oil stains; soap the joints.",
    },
    {
      tags: ["overcharge", "too much refrigerant"],
      topic: "Overcharge",
      answer:
        "High head, high SC, possible low SH, higher amps. Recover to correct weight. Don't vent to 'bleed it down.' Law + physics both say no.",
    },
    {
      tags: ["ice", "icing", "frozen", "frost"],
      topic: "Icing",
      answer:
        "Usually low airflow or undercharge (or metering issues). Power off, thaw, fix filter/blower/coil first. Adding refrigerant to an airflow problem builds a bigger Otter Pop. 🔍 Scan unit if you want a second opinion on the frost pattern.",
    },
    {
      tags: ["dirty condenser", "dirty coil", "high head"],
      topic: "Dirty condenser",
      answer:
        "High head, high SC, high amps. Clean coil, clear bushes, recheck. Don't remove charge to mask high head. 🔍 Scan unit photos often catch matted fins and juniper attacks.",
    },
    {
      tags: ["txv", "restriction", "filter drier", "metering"],
      topic: "Restriction / TXV",
      answer:
        "High SH with healthy/high SC — liquid is in the condenser, evaporator is starved. Check drier delta-T, TXV bulb mount/powerhead, inlet screen. Replace drier anytime you open a burned-out or dirty system.",
    },
    {
      tags: ["no cool", "not cooling", "warm air", "blowing warm"],
      topic: "No cooling",
      answer:
        "Triage: thermostat → airflow → outdoor run → gauges SH/SC → electrical. Don't start at compressor replacement speeches. Start at 'is it even trying.'",
    },
    {
      tags: ["electrical", "multimeter", "voltage", "amps", "comms"],
      topic: "Electrical",
      answer:
        "Verify power with meter. Capacitor, contactor, voltage under load, amp draw vs RLA. Mini-split: swapped comms wires = classic no-cool. Dedicated breaker and proper disconnect. Electricity bites harder than customers.",
    },
    {
      tags: ["epa", "608", "vent", "recover"],
      topic: "EPA 608",
      answer:
        "Recover before opening charged systems. No venting. Correct cylinders and paperwork. Core + Type certs for what you service. DIY Dave's sky-charge is not a procedure.",
    },
    {
      tags: ["goodman", "carrier", "daikin", "trane", "rheem", "lennox", "mitsubishi", "brand"],
      topic: "Brand systems",
      answer:
        "Physics is universal; manuals are not. Torque, charge adders, vacuum, and wiring diagrams are OEM-specific. Sandbox templates help practice. Warranty loves paperwork and hates freestyle.",
    },
    {
      tags: ["r-410a", "r410a", "r-22", "r22", "r-32", "r32", "refrigerant"],
      topic: "Refrigerants",
      answer:
        "Match PT chart to refrigerant. R-410A higher pressure than R-22. R-32 on many new ductless. Don't mix. POE stays capped. Hoses and manifold rated for the pressure.",
    },
    {
      tags: ["commission", "startup", "start up", "delta t"],
      topic: "Commissioning",
      answer:
        "Run cool (and heat if HP). Check supply ΔT, drain flow, error codes, amp draw, SH/SC vs target. Log model/serial/lineset/extra charge. Seal penetration. Explain filter maintenance to the human who owns the house.",
    },
    {
      tags: ["additional charge", "weigh in", "long line", "lineset length"],
      topic: "Additional charge",
      answer:
        "Factory charge covers rated lineset only. Longer runs: weigh extra per OEM oz/ft chart. Then verify SC/SH. Guessing from a can is how 11 p.m. callbacks are born.",
    },
    {
      tags: ["braze", "brazing", "purge", "solder"],
      topic: "Brazing",
      answer:
        "Flow dry nitrogen while heating to limit oxidation. Protect valves. Right alloy, neutral flame skill. Wet rag or heat sink on sensitive parts. Shop practice before live systems. Charred joints are not a personality trait.",
    },
    {
      tags: ["interplay", "boring", "clunky", "hate training"],
      topic: "Meta",
      answer:
        "This isn't the clunky quiz software you hate. Ask me real symptoms, 📷 plates, 🔍 unit photos. Competence optional? No. Competence mandatory. Sass included free.",
    },
    {
      tags: ["help", "what can you do", "who are you", "hello", "hi ", "hey hub"],
      topic: "Intro",
      answer:
        "Professor HUB — install & troubleshooting mentor. Ask about SH/SC, vacuum, flares, ice, capacitors, heat pumps, drains, recovery, nameplates. 📷 Read label. 🔍 Scan unit photo. I'll answer accurate with Deadpool energy.",
    },
  ];

  const FALLBACKS = (window.LtBrand && window.LtBrand.isStore)
    ? [
        "Stay on EPA 608, OSHA 30, and the shop course. Try: recover, vacuum, LOTO, fall protection, superheat, TXV, mini-split.",
        "That's off the manifold. Ask 608 recovery, OSHA LOTO/falls/PPE, or the cycle, SH, SC, and gauges.",
        "I only coach EPA 608, OSHA 30, and the refrigeration course. Rephrase like a tech: 'Type II recovery' or '6-foot fall rule'.",
      ]
    : [
        "Stay on the three packs: EPA 608, OSHA 30, or the shop course. Try: recover, vacuum, LOTO, fall protection, superheat, TXV, mini-split.",
        "That's off the manifold. Ask 608 recovery, OSHA LOTO/falls/PPE, or LT cycle/SH-SC/gauges.",
        "I only coach EPA 608, OSHA 30, and the shop course. Rephrase like a tech: 'Type II recovery' or '6-foot fall rule'.",
      ];

  const TOPIC_TIPS = {
    epa608: [
      "EPA 608: recover before you open it. Venting is illegal — not a personality.",
      "608: evacuate to 500 microns or less on most high-pressure work, measured with a micron gauge at the system.",
      "608: recovery cylinders — DOT, labeled, 80% fill by weight. Leave headspace or the tank becomes a pipe bomb with paperwork.",
      "608 Type I is small appliances (5 lb or less). Type II high-pressure, Type III low-pressure. Universal is Core + I + II + III.",
      "608: never mix refrigerants. Never use oxygen or shop air for leak tests. Dry nitrogen, regulator on.",
      "608: a leak gets repaired, then recover/repair/evac/weigh-in. Top-off of a known leaker is how you fail the exam and the planet.",
    ],
    osha30: [
      "OSHA 30: lockout/tagout — verify dead with a meter. The only person who pulls the lock is the one who hung it (or the written procedure).",
      "OSHA: fall protection when you're exposed at 6 feet or more in construction. Tie off. Heroics are for movies.",
      "OSHA: GFCI for tools in wet/outdoor work. Jewelry + live 240 is how we write accident reports.",
      "OSHA hierarchy: eliminate the hazard when you can. PPE is last, not first.",
      "OSHA: SDS exists so you don't drink the coil cleaner. Read it. Heat illness = water, rest, shade, don't be a martyr.",
      "OSHA: damaged cords out of service. Class C (or rated multi-class) extinguisher for energized electrical — not the kitchen K can.",
    ],
    lincoln: (window.LtBrand && window.LtBrand.isStore)
      ? [
          "Shop: SH = suction temp minus evap sat. SC = cond sat minus liquid temp. Read both or you're guessing.",
          "Shop course: airflow before charge. Iced suction + near-zero SH is usually filter/blower/coil, not 'add gas.'",
          "Shop: nut on the tube before you flare. Deburr. Torque. That's the lab, not optional flavor.",
          "Shop: nameplate is law — refrigerant, charge, MCA/MOP. OCR is a hint; your eyes are the final.",
          "Shop: TXV is often charged by subcooling + weigh-in. Fixed orifice by superheat chart. OEM still wins.",
          "Shop: four core parts close the cycle — compressor, condenser, metering, evaporator. Sandbox it before you torch a real unit.",
        ]
      : [
          "Shop: SH = suction temp minus evap sat. SC = cond sat minus liquid temp. Read both or you're guessing.",
          "LT curriculum: airflow before charge. Iced suction + near-zero SH is usually filter/blower/coil, not 'add gas.'",
          "Shop: nut on the tube before you flare. Deburr. Torque. That's the lab, not optional flavor.",
          "LT: nameplate is law — refrigerant, charge, MCA/MOP. OCR is a hint; your eyes are the final.",
          "LT: TXV is often charged by subcooling + weigh-in. Fixed orifice by superheat chart. OEM still wins.",
          "LT: four core parts close the cycle — compressor, condenser, metering, evaporator. Sandbox it before you torch a real unit.",
        ],
  };

  const TOPIC_LABEL = {
    epa608: "EPA 608",
    osha30: "OSHA 30",
    lincoln: (window.LtBrand && window.LtBrand.isStore) ? "Shop course" : "the shop course",
  };

  const DIRTY = [
    "Your TXV is starving. Join the club. Weigh in, don't just top off.",
    "Don't blow in the lineset. That's not nitrogen and it's a weird look on a roof.",
    "LOTO isn't a kink. Tag the disconnect, then take your break.",
    "If you're gonna tighten something till it squeals, make it a flare nut to torque spec.",
    "Keep it in the recovery cylinder. 80% fill. Not a metaphor.",
    "Venting is illegal. Oversharing with the customer is just tacky.",
    "Maximum effort. Minimum pants-optional humor on the customer's lawn.",
    "I'm Deadpool with a manifold. Save the filthy jokes for the van — after LOTO.",
  ];

  function randomPackTip() {
    const keys = ["epa608", "osha30", "lincoln"];
    const k = keys[(Math.random() * keys.length) | 0];
    const list = TOPIC_TIPS[k];
    const tip = list[(Math.random() * list.length) | 0];
    return { key: k, label: TOPIC_LABEL[k], tip: tip };
  }

  const JOKES = [
    "Chimichanga later. Microns now.",
    "Maximum effort. Minimum venting.",
    "I'm Deadpool with a manifold. You're the sequel.",
    "Fourth wall's gone. Your charge still has to be weighed.",
    "Spoiler: it's the filter. It's always the filter until it isn't.",
    "I'd break more walls but OSHA already wrote me up for the last one.",
    "Plot twist: nitrogen isn't for lungs. Dry N₂ only.",
    "Regeneration is for mutants. Compressors just seize. LOTO.",
    "Red leather optional. Recovery cylinder labeled. Always.",
    "This answer is canon. Your 'just add gas' theory is fanfic.",
  ];

  function dress(answer) {
    let out = answer;
    const roll = Math.random();
    if (roll < 0.16) {
      out = answer + " " + DIRTY[(Math.random() * DIRTY.length) | 0];
    } else if (roll < 0.5) {
      const joke = JOKES[(Math.random() * JOKES.length) | 0];
      out = Math.random() < 0.45 ? joke + " — " + answer : answer + " " + joke;
    }
    const pre = WIT_PREFIX[(Math.random() * WIT_PREFIX.length) | 0];
    const suf = WIT_SUFFIX[(Math.random() * WIT_SUFFIX.length) | 0];
    return pre + out + suf;
  }

  const WIT_PREFIX = [
    "",
    "Listen carefully — ",
    "Okay, plot armor off for a second. ",
    "Real talk between chaos: ",
    "Put the witty banter on mute for 10 seconds: ",
  ];

  const WIT_SUFFIX = [
    "",
    " Now go be dangerous in a competent way.",
    " You're welcome. Don't make me say it twice.",
    " Try it in the sim before you embarrass us in lab.",
    " Fourth wall says you're still reading. Good.",
    " If that was on a service call, you might keep your stars.",
  ];

  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function score(query, entry) {
    const q = normalize(query);
    let s = 0;
    for (const tag of entry.tags) {
      if (q.includes(tag.toLowerCase())) s += tag.length > 3 ? 3 : 2;
    }
    // bonus for topic words
    for (const w of entry.topic.toLowerCase().split(/\s+/)) {
      if (w.length > 3 && q.includes(w)) s += 1;
    }
    return s;
  }

  function match(query) {
    let best = null;
    let bestScore = 0;
    for (const e of KB) {
      const sc = score(query, e);
      if (sc > bestScore) {
        bestScore = sc;
        best = e;
      }
    }
    if (bestScore < 2) return null;
    return best;
  }

  function contextHint(ctx) {
    if (!ctx) return "";
    if (ctx.unit) {
      const map = {
        bench: "the bench",
        copper: "copper",
        charge: "the charge",
        controls: "the circuit",
        install: "the install",
        card: "the 608 card",
        epa608: "EPA 608 prep",
        piping: "copper",
      };
      const label = map[ctx.unit] || ctx.unit;
      return " [Curriculum focus: " + label + " — keep answers aligned to that unit.]";
    }
    if (ctx.mode === "minisplit" && ctx.step) {
      return " (You're on mini-split step: " + ctx.step + " — don't skip N₂ or microns.)";
    }
    if (ctx.mode === "sandbox") {
      return " (Sandbox is live — watch SH/SC and flow while you poke the system.)";
    }
    if (ctx.mode === "service") {
      return " (Service route active — read the vitals before you hero-quote the customer.)";
    }
    if (ctx.mode === "curriculum") {
      return " (You're in the curriculum planner — ask for a study plan or unit drills.)";
    }
    if (ctx.mode === "quiz") {
      return " (Quiz Arena mode — I'll coach EPA 608, OSHA 30, and LT curriculum.)";
    }
    return "";
  }

  function ask(query, ctx) {
    const q = normalize(query);
    const wantRandom = !q || /^(joke|jokes|random|teach|teach me|quiz|quiz me|anything|go|hit me|another)$/.test(q) || q.length < 3;
    if (wantRandom) {
      const r = randomPackTip();
      return {
        topic: r.label,
        text: dress("[" + r.label + "] " + r.tip),
      };
    }
    const hit = match(q);
    if (!hit) {
      const r = randomPackTip();
      return {
        topic: r.label,
        text: dress("I stay on EPA 608, OSHA 30, and " + ((window.LtBrand && window.LtBrand.isStore) ? "the shop course" : "the shop course") + ". Random " + r.label + ": " + r.tip),
      };
    }
    return {
      topic: hit.topic,
      text: dress(hit.answer + contextHint(ctx)),
    };
  }

  // ---- UI ----
  // ---- Nameplate / label OCR helpers ----
  function parseNameplate(text) {
    const t = text || "";
    const up = t.toUpperCase();
    const fields = {};

    const model =
      t.match(/\b(?:MODEL|MDL|MOD)[:\s#]*([A-Z0-9][A-Z0-9\-\/]{3,})/i) ||
      t.match(/\b([A-Z]{2,}\d{2,}[A-Z0-9\-]{2,})\b/);
    if (model) fields.model = model[1];

    const serial =
      t.match(/\b(?:SERIAL|SER|S\/N|SN)[:\s#]*([A-Z0-9\-]{5,})/i);
    if (serial) fields.serial = serial[1];

    const refrig =
      t.match(/\b(R-?22|R-?410A|R-?32|R-?134A|R-?407C|R-?454B|R-?290)\b/i);
    if (refrig) fields.refrigerant = refrig[1].toUpperCase().replace(/^R([0-9])/, "R-$1").replace("R-410A", "R-410A");

    const charge =
      t.match(/\b(?:FACTORY\s*)?CHARGE[:\s]*([\d.]+)\s*(OZ|LB|LBS|KG|G)\b/i) ||
      t.match(/\b([\d.]+)\s*(OZ|LB)\s*(?:OF\s+)?(?:R-?\d)/i);
    if (charge) fields.charge = charge[1] + " " + charge[2].toUpperCase();

    const volts =
      t.match(/\b(\d{3})\s*[/V]?\s*(\d{2,3})?\s*V\b/i) ||
      t.match(/\b(?:VOLTAGE|VOLTS|V)[:\s]*(\d{3})/i);
    if (volts) fields.voltage = volts[0].replace(/\s+/g, " ").trim();

    const phase = t.match(/\b(1|3)\s*PH\b/i) || t.match(/\bSINGLE\s*PHASE\b/i) || t.match(/\bTHREE\s*PHASE\b/i);
    if (phase) fields.phase = phase[0];

    const mca = t.match(/\bMCA[:\s]*([\d.]+)/i);
    if (mca) fields.mca = mca[1] + " A";
    const mop = t.match(/\b(?:MOP|MAX\s*FUSE|MOCP)[:\s]*([\d.]+)/i);
    if (mop) fields.mop = mop[1] + " A";

    const rla = t.match(/\bRLA[:\s]*([\d.]+)/i);
    if (rla) fields.rla = rla[1] + " A";
    const lra = t.match(/\bLRA[:\s]*([\d.]+)/i);
    if (lra) fields.lra = lra[1] + " A";

    const ton = t.match(/\b([\d.]+)\s*(?:TON|TONS)\b/i);
    if (ton) fields.capacity = ton[1] + " ton";

    const seer = t.match(/\bSEER2?[:\s]*([\d.]+)/i);
    if (seer) fields.seer = seer[0];

    const brandHints = [
      ["GOODMAN", "Goodman"],
      ["CARRIER", "Carrier"],
      ["DAIKIN", "Daikin"],
      ["TRANE", "Trane"],
      ["RHEEM", "Rheem"],
      ["LENNOX", "Lennox"],
      ["MITSUBISHI", "Mitsubishi"],
      ["YORK", "York"],
      ["BRYANT", "Bryant"],
      ["AMANA", "Amana"],
      ["LG ", "LG"],
      ["SAMSUNG", "Samsung"],
      ["BOSCH", "Bosch"],
      ["AMERICAN STANDARD", "American Standard"],
    ];
    for (const [k, v] of brandHints) {
      if (up.includes(k.trim())) {
        fields.brand = v;
        break;
      }
    }

    return fields;
  }

  function interpretLabel(rawText, fields) {
    const lines = [];
    lines.push("I stared at that nameplate so you don't have to. Here's the field readout:");

    const order = [
      ["brand", "Brand"],
      ["model", "Model"],
      ["serial", "Serial"],
      ["refrigerant", "Refrigerant"],
      ["charge", "Factory charge"],
      ["voltage", "Voltage"],
      ["phase", "Phase"],
      ["capacity", "Capacity"],
      ["mca", "MCA"],
      ["mop", "MOP / max fuse"],
      ["rla", "RLA"],
      ["lra", "LRA"],
      ["seer", "Efficiency"],
    ];
    let found = 0;
    for (const [k, label] of order) {
      if (fields[k]) {
        lines.push("• " + label + ": " + fields[k]);
        found++;
      }
    }

    if (!found) {
      lines.push("• Couldn't lock clean fields — OCR saw noise. Retake closer, brighter, square-on.");
    }

    lines.push("");
    if (fields.refrigerant) {
      lines.push(
        "Refrigerant " +
          fields.refrigerant +
          " — use the matching PT chart and rated hoses/gauges. Don't freestyle mix."
      );
    }
    if (fields.charge) {
      lines.push(
        "Factory charge " +
          fields.charge +
          " is for the rated lineset. Longer copper = weigh in extra per the chart, not vibes."
      );
    }
    if (fields.mca || fields.mop) {
      lines.push(
        "Breaker / wire sizing: respect MCA and MOP on the plate. Upsizing breakers to 'make it stop tripping' is a villain move."
      );
    }
    if (fields.voltage) {
      lines.push("Confirm supply voltage matches the plate under load before you condemn a compressor.");
    }

    lines.push("");
    lines.push("Raw OCR (so you can double-check):");
    lines.push(rawText.slice(0, 500) + (rawText.length > 500 ? "…" : ""));

    lines.push("");
    lines.push("Pro tip: photo the plate on every job before you tear into it. Future-you sends a thank-you card.");

    return lines.join("\n");
  }

  function loadTesseract() {
    return new Promise((resolve, reject) => {
      if (global.Tesseract) return resolve(global.Tesseract);
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      s.onload = () => resolve(global.Tesseract);
      s.onerror = () => reject(new Error("OCR library failed to load (need network once)"));
      document.head.appendChild(s);
    });
  }

  function analyzeImagePixels(img) {
    const canvas = document.createElement("canvas");
    const maxW = 320;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = Math.max(1, Math.floor(img.width * scale));
    canvas.height = Math.max(1, Math.floor(img.height * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let n = 0,
      bright = 0,
      dark = 0,
      greenish = 0,
      brownish = 0,
      rusty = 0,
      blueish = 0,
      grayMetal = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      n++;
      if (lum > 210 && max - min < 35) bright++; // ice / frost / white paint
      if (lum < 45) dark++;
      if (g > r + 15 && g > b + 10 && lum > 40 && lum < 180) greenish++; // algae / outdoor growth
      if (r > 70 && g > 40 && b < 55 && r > b + 25 && lum < 160) brownish++; // dirt / dust
      if (r > 100 && g < 90 && b < 70 && r > g + 20) rusty++; // rust
      if (b > r + 10 && b > g + 5 && lum > 50 && lum < 190) blueish++; // copper patina / blue film
      if (max - min < 25 && lum > 60 && lum < 170) grayMetal++;
    }
    const pct = (x) => Math.round((x / n) * 1000) / 10;
    return {
      bright: pct(bright),
      dark: pct(dark),
      greenish: pct(greenish),
      brownish: pct(brownish),
      rusty: pct(rusty),
      blueish: pct(blueish),
      grayMetal: pct(grayMetal),
    };
  }

  function loadImageFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not load image"));
      };
      img.src = url;
    });
  }

  function visualProblems(stats, ocrText) {
    const findings = [];
    const up = (ocrText || "").toUpperCase();

    if (stats.bright >= 18) {
      findings.push({
        id: "ice",
        severity: "high",
        title: "Possible ice / frost",
        detail:
          "Large bright/white regions — classic iced evaporator or suction line look. Kill power, thaw, check airflow (filter/blower/coil) and charge. Don't add gas to an ice rink.",
      });
    }
    if (stats.brownish >= 12 || (stats.dark >= 25 && stats.brownish >= 6)) {
      findings.push({
        id: "dirt",
        severity: "high",
        title: "Dirty coil / heavy soil",
        detail:
          "Brown/dark texture dominance — outdoor or indoor coil likely fouled. High head, high SC, sad capacity. Clean the coil; don't 'fix' head pressure by recovering charge.",
      });
    }
    if (stats.greenish >= 8) {
      findings.push({
        id: "growth",
        severity: "med",
        title: "Growth / vegetation near unit",
        detail:
          "Green tones in frame — algae, grass, or a bush eating the condenser. Clear 18–24\" service clearance. Uncle Ray's junipers are not an accessory.",
      });
    }
    if (stats.rusty >= 7) {
      findings.push({
        id: "rust",
        severity: "med",
        title: "Rust / corrosion",
        detail:
          "Rust-colored pixels — cabinet, fasteners, or coil end plates aging out. Check for cabinet integrity, loose panels, and electrical ground paths.",
      });
    }
    if (stats.dark >= 35 && stats.bright < 8) {
      findings.push({
        id: "dark",
        severity: "low",
        title: "Very dark photo / blocked view",
        detail:
          "Frame is mostly dark — either a night shot, closed cabinet, or something blocking the coil face. Retake with light, or open the panel safely with power off.",
      });
    }

    // OCR-assisted problem cues
    if (/\bLEAK\b|\bOIL\b|\bWET\b|\bSTAIN\b/i.test(ocrText || "")) {
      findings.push({
        id: "leak_text",
        severity: "high",
        title: "Leak-related text / oil cues in frame",
        detail:
          "OCR picked up leak/oil language near the unit. Look for oil stains at joints, schrader, and coil returns. Soap test; never use oxygen for pressure tests.",
      });
    }
    if (/\bWARNING\b|\bHIGH\s*VOLTAGE\b|\bDANGER\b/i.test(ocrText || "")) {
      findings.push({
        id: "electrical",
        severity: "med",
        title: "Electrical hazard markings visible",
        detail:
          "Warning / high voltage markings in view. Kill power, verify with a meter, lockout if required before deep work.",
      });
    }
    if (/\bR-?22\b/i.test(ocrText || "")) {
      findings.push({
        id: "r22",
        severity: "med",
        title: "R-22 equipment indicated",
        detail:
          "Plate or text suggests R-22. Plan recovery with correct cylinder, discuss retrofit vs replacement with the customer — don't treat it like 410A pressures.",
      });
    }

    // de-dupe by id
    const seen = {};
    return findings.filter((f) => (seen[f.id] ? false : (seen[f.id] = true)));
  }

  function formatProblemReport(findings, fields, stats, raw) {
    const lines = [];
    lines.push("Unit photo scan complete. Here's what jumped out:");
    lines.push("");

    if (findings.length) {
      findings
        .sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.severity] - { high: 0, med: 1, low: 2 }[b.severity]))
        .forEach((f, i) => {
          const tag = f.severity === "high" ? "🔴" : f.severity === "med" ? "🟡" : "🟢";
          lines.push(tag + " " + (i + 1) + ". " + f.title);
          lines.push("   " + f.detail);
          lines.push("");
        });
    } else {
      lines.push("No strong visual red flags from pixel heuristics — doesn't mean the unit is healthy, just that the photo didn't scream ice/dirt/rust.");
      lines.push("Shoot the coil face, suction line, filter slot, and nameplate if you want a better roast.");
      lines.push("");
    }

    if (fields && (fields.model || fields.refrigerant || fields.brand)) {
      lines.push("Nameplate crumbs I also pulled:");
      if (fields.brand) lines.push("• Brand: " + fields.brand);
      if (fields.model) lines.push("• Model: " + fields.model);
      if (fields.refrigerant) lines.push("• Refrigerant: " + fields.refrigerant);
      if (fields.charge) lines.push("• Charge: " + fields.charge);
      if (fields.voltage) lines.push("• Voltage: " + fields.voltage);
      lines.push("");
    }

    lines.push("Field checklist while you're there:");
    lines.push("• Filter & indoor airflow");
    lines.push("• Outdoor coil cleanliness & clearance");
    lines.push("• Ice on suction / distributor");
    lines.push("• Oil stains at joints (leak map)");
    lines.push("• Breaker, disconnect, contactor, capacitor");
    lines.push("• Gauges: SH + SC together, never one number heroics");
    lines.push("");
    lines.push("Stats nerd view — bright:" + stats.bright + "% dirt:" + stats.brownish + "% rust:" + stats.rusty + "% green:" + stats.greenish + "%");
    lines.push("");
    lines.push("I'm an AI with attitude, not a psychic. Confirm everything with gauges, a meter, and your own eyes before you order parts.");

    return lines.join("\n");
  }

  async function scanUnitPhoto(file, mode) {
    // mode: "label" | "problems" | "both"
    mode = mode || "both";
    pushHub({
      topic: "Scanning unit",
      text:
        mode === "label"
          ? "OCR on the nameplate… hold still, mortal."
          : "Scanning for ice, dirt, rust, and other crimes against HVAC… plus OCR if there's a plate in frame.",
    });

    try {
      const img = await loadImageFile(file);
      const stats = analyzeImagePixels(img);

      let raw = "";
      try {
        const Tesseract = await loadTesseract();
        const result = await Tesseract.recognize(file, "eng", { logger: () => {} });
        raw = ((result && result.data && result.data.text) || "")
          .replace(/[|]/g, "I")
          .replace(/\s+/g, " ")
          .trim();
      } catch (ocrErr) {
        raw = "";
      }

      const fields = raw ? parseNameplate(raw) : {};

      if (mode === "label") {
        if (!raw || raw.length < 8) {
          return {
            topic: "Label blur",
            text: "Couldn't read a plate. Get closer, more light, fill the frame with the sticker.",
          };
        }
        return { topic: "Nameplate read", text: interpretLabel(raw, fields) };
      }

      const findings = visualProblems(stats, raw);
      return {
        topic: findings.length ? "Problems found" : "Scan complete",
        text: formatProblemReport(findings, fields, stats, raw),
      };
    } catch (err) {
      return {
        topic: "Scan error",
        text:
          "Scan failed. " +
          (err && err.message ? err.message : "Unknown error") +
          ". Try a clearer photo; first OCR load needs network.",
      };
    }
  }

  async function readLabelImage(file) {
    return scanUnitPhoto(file, "label");
  }

  let panel = null;
  let getContext = () => null;

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "hub-ai-panel";
    panel.className = "hub-ai-panel hidden";
    panel.innerHTML = `
      <header class="hub-ai-head">
        <div class="hub-ai-title">
          <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
          <div>
            <strong>Professor Andrew Hubbard</strong>
            <em>${(window.LtBrand && window.LtBrand.org) || "HVAC Legends"} · Install · Troubleshoot · Labels</em>
          </div>
        </div>
        <button type="button" class="btn" id="hub-ai-close">Close</button>
      </header>
      <div class="hub-ai-log" id="hub-ai-log"></div>
      <div class="hub-ai-quick" id="hub-ai-quick"></div>
      <div class="hub-ai-photo-bar">
        <label class="hub-ai-photo-btn" title="Read nameplate text from a photo">
          📷 Read label
          <input type="file" id="hub-ai-file-label" accept="image/*" capture="environment" hidden />
        </label>
        <label class="hub-ai-photo-btn hub-ai-photo-btn-scan" title="Scan photo for ice, dirt, rust, install issues">
          🔍 Scan unit
          <input type="file" id="hub-ai-file-scan" accept="image/*" capture="environment" hidden />
        </label>
        <span class="hub-ai-photo-hint">Field photos: plate or whole unit</span>
      </div>
      <form class="hub-ai-form" id="hub-ai-form">
        <input id="hub-ai-input" maxlength="200" placeholder="Ask HUB or paste plate text…" autocomplete="off" />
        <button class="btn primary" type="submit">Ask</button>
      </form>
    `;
    document.getElementById("app").appendChild(panel);
    if (window.LtDrag && window.LtDrag.makeMoveable) {
      window.LtDrag.makeMoveable(panel.querySelector(".hub-ai-head"), panel, "lt-hub-panel-pos");
    }

    panel.querySelector("#hub-ai-close").onclick = close;
    panel.querySelector("#hub-ai-form").onsubmit = (e) => {
      e.preventDefault();
      const input = panel.querySelector("#hub-ai-input");
      const q = input.value.trim();
      if (!q) return;
      input.value = "";
      pushUser(q);
      // If it looks like pasted plate text, parse it directly
      if (/model|serial|r-?410|r-?22|charge|mca|rla/i.test(q) && q.length > 40) {
        const fields = parseNameplate(q);
        pushHub({ topic: "Nameplate text", text: interpretLabel(q, fields) });
      } else {
        pushHub(ask(q, getContext()));
      }
    };

    async function handlePhoto(file, mode) {
      if (!file) return;
      const tag = mode === "label" ? "📷 [Label]" : "🔍 [Unit scan]";
      pushUser(tag + " " + (file.name || "camera"));
      try {
        const url = URL.createObjectURL(file);
        const log = panel.querySelector("#hub-ai-log");
        const row = document.createElement("div");
        row.className = "hub-ai-msg user";
        row.innerHTML = '<strong>You</strong><div class="hub-ai-thumb-wrap"><img class="hub-ai-thumb" alt="unit"/></div>';
        row.querySelector("img").src = url;
        log.appendChild(row);
        log.scrollTop = log.scrollHeight;
      } catch (_) {}
      const res = await scanUnitPhoto(file, mode === "label" ? "label" : "both");
      pushHub(res);
    }

    const fileLabel = panel.querySelector("#hub-ai-file-label");
    const fileScan = panel.querySelector("#hub-ai-file-scan");
    if (fileLabel) {
      fileLabel.onchange = async () => {
        const file = fileLabel.files && fileLabel.files[0];
        fileLabel.value = "";
        await handlePhoto(file, "label");
      };
    }
    if (fileScan) {
      fileScan.onchange = async () => {
        const file = fileScan.files && fileScan.files[0];
        fileScan.value = "";
        await handlePhoto(file, "problems");
      };
    }

    const quick = [
      "Install checklist",
      "Diagnostic order",
      "High SH and low SC means?",
      "How do I pull a vacuum?",
      "System icing up",
      "Capacitor testing",
      "Tools I need",
      "Read a nameplate",
    ];
    const qbox = panel.querySelector("#hub-ai-quick");
    quick.forEach((q) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hub-ai-chip";
      b.textContent = q;
      b.onclick = () => {
        if (q === "Read a nameplate") {
          pushHub({
            topic: "Photo help",
            text: "📷 Read label = OCR the data plate. 🔍 Scan unit = look for ice, dirty coils, rust, vegetation, leak cues — and still grab plate text if it's in frame. Bright light, fill the frame, square-on.",
          });
          return;
        }
        pushUser(q);
        pushHub(ask(q, getContext()));
      };
      qbox.appendChild(b);
    });

    pushHub({
      topic: "Online",
      text: "Professor Andrew Hubbard online — Grok-powered. Ask text questions, 📷 read a nameplate, or 🔍 scan a unit photo for ice, dirt, rust, and other field problems.",
    });

    return panel;
  }

  function pushUser(text) {
    const log = panel.querySelector("#hub-ai-log");
    const row = document.createElement("div");
    row.className = "hub-ai-msg user";
    row.innerHTML = "<strong>You</strong><p></p>";
    row.querySelector("p").textContent = text;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function pushHub(res) {
    const log = panel.querySelector("#hub-ai-log");
    const row = document.createElement("div");
    row.className = "hub-ai-msg hub";
    row.innerHTML = "<strong>Hubbard · " + (res.topic || "Advice") + "</strong><p></p>";
    row.querySelector("p").textContent = res.text;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function say(query) {
    open();
    ensurePanel();
    if (query) pushUser(query);
    pushHub(ask(query || "How do I use a voltmeter on HVAC?", getContext()));
  }

  function open() {
    if (!enabled) return;
    ensurePanel();
    panel.classList.remove("hidden");
    const fab = document.getElementById("hub-ai-fab");
    if (fab) parkPanel(fab);
    if (global.Badges) global.Badges.unlock("hub_friend");
    setTimeout(() => {
      const input = panel.querySelector("#hub-ai-input");
      if (input) input.focus();
    }, 50);
  }

  function close() {
    if (panel) panel.classList.add("hidden");
  }

  function toggle() {
    if (!enabled) return;
    ensurePanel();
    if (panel.classList.contains("hidden")) open();
    else close();
  }

  function mountButton() {
    if (document.getElementById("hub-ai-fab")) return;
    const fab = document.createElement("button");
    fab.id = "hub-ai-fab";
    fab.className = "hub-ai-fab";
    fab.type = "button";
    fab.title = "Drag to move · tap to Ask HUB";
    fab.innerHTML = '<img src="hub-portrait.jpg?v=3" alt="" /><span>Ask HUB</span>';
    let dragged = false;
    fab.addEventListener("click", (e) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
        return;
      }
      toggle();
    });
    enableFabDrag(fab, () => {
      dragged = true;
    });
    document.body.appendChild(fab);
    restoreFabPos(fab);
  }

  function restoreFabPos(fab) {
    try {
      const raw = localStorage.getItem("lt-hub-fab-pos");
      if (!raw) return;
      const p = JSON.parse(raw);
      if (typeof p.x === "number" && typeof p.y === "number") clampFab(fab, p.x, p.y);
    } catch (_) {}
  }

  function clampFab(fab, x, y) {
    const pad = 8;
    const w = fab.offsetWidth || 128;
    const h = fab.offsetHeight || 48;
    x = Math.max(pad, Math.min(window.innerWidth - w - pad, x));
    y = Math.max(pad, Math.min(window.innerHeight - h - pad, y));
    fab.style.left = x + "px";
    fab.style.top = y + "px";
    fab.style.right = "auto";
    fab.style.bottom = "auto";
    try {
      localStorage.setItem("lt-hub-fab-pos", JSON.stringify({ x, y }));
    } catch (_) {}
    parkPanel(fab);
    return { x, y };
  }

  function parkPanel(fab) {
    if (!panel || panel.classList.contains("hidden")) return;
    try {
      if (localStorage.getItem("lt-hub-panel-pos")) return;
    } catch (_) {}
    const r = fab.getBoundingClientRect();
    const pw = Math.min(400, window.innerWidth - 24);
    const ph = Math.min(520, window.innerHeight - 100);
    let left = r.left;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (left < 8) left = 8;
    let top = r.top - ph - 10;
    if (top < 8) top = r.bottom + 10;
    if (top + 200 > window.innerHeight) top = 8;
    panel.style.left = left + "px";
    panel.style.top = top + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  }

  function enableFabDrag(fab, onDrag) {
    let sx = 0,
      sy = 0,
      ox = 0,
      oy = 0,
      moving = false,
      press = false;
    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const r = fab.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      ox = r.left;
      oy = r.top;
      moving = false;
      press = true;
      fab.classList.add("dragging");
    };
    const move = (e) => {
      if (!press) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!moving && dx * dx + dy * dy < 9) return;
      moving = true;
      e.preventDefault();
      if (onDrag) onDrag();
      clampFab(fab, ox + dx, oy + dy);
    };
    const up = () => {
      press = false;
      fab.classList.remove("dragging");
    };
    fab.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("resize", () => {
      const r = fab.getBoundingClientRect();
      clampFab(fab, r.left, r.top);
    });
  }

  function coachUnit(unitId, coach) {
    ensurePanel();
    open();
    const c = coach || {};
    const title = (unitId || "unit").toUpperCase();
    pushHub({
      topic: "Curriculum coach",
      text:
        "Curriculum link locked: " +
        title +
        ". " +
        (c.open ||
          "Ask me anything for this unit — install, theory, or lab prep. I'll stay on-topic with Deadpool energy."),
    });
    if (c.drills && c.drills.length) {
      pushHub({
        topic: "Suggested drills",
        text: "Try asking: " + c.drills.map((d) => '"' + d + '"').join(" · "),
      });
    }
    if (c.focus && c.focus.length) {
      pushHub({
        topic: "Focus topics",
        text: "Stay sharp on: " + c.focus.join(", ") + ". Lab is not a dress rehearsal for chaos — unless it's controlled chaos.",
      });
    }
  }

  let enabled = true;

  function setEnabled(on) {
    enabled = on !== false;
    const fab = document.getElementById("hub-ai-fab");
    if (fab) fab.classList.toggle("hub-ai-off", !enabled);
    if (!enabled) close();
  }

  function isEnabled() {
    return enabled;
  }

  function init(opts) {
    if (opts && opts.getContext) getContext = opts.getContext;
    mountButton();
    ensurePanel();
    close();
    setEnabled(enabled);
  }

  global.HubAI = {
    init,
    open,
    close,
    toggle,
    ask,
    say,
    setEnabled,
    isEnabled,
    KB,
    parseNameplate,
    readLabelImage,
    scanUnitPhoto,
    coachUnit,
  };
})(window);
