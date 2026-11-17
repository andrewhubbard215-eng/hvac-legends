/* HVAC Allstars — Shop School. Public trainer desk + Instructor toggle.
   Industry modules. Printable student copy / key. Not Lincoln catalog. Not ESCO IP. */
(function (global) {
  "use strict";

  var KEY = "lt-shop-school-v1";
  var MODS = [
    { id: "safety", name: "Safety & tools" },
    { id: "elec", name: "Electrical" },
    { id: "ref", name: "Refrigeration cycle" },
    { id: "epa", name: "EPA 608" },
    { id: "hp", name: "Heat pumps" },
    { id: "air", name: "Airflow" },
    { id: "ctrl", name: "Controls" },
  ];

  /* Canvas HVAC is day-by-day. These are OUR trainer beats, not a cloned catalog. */
  function campusOn() {
    try {
      return window.SchoolPack && window.SchoolPack.id === "lincoln";
    } catch (e) {
      return false;
    }
  }
  function COURSES() {
    var c = campusOn();
    return [
      { id: "safety", days: 6, name: "Safety & tools", label: "Safety & tools", mod: "safety" },
      { id: "elec", days: 20, name: "Electrical", label: c ? "HCR102 · Electrical" : "Electrical", mod: "elec" },
      { id: "ref", days: 20, name: "Refrigeration", label: c ? "HCR105 · Refrigeration" : "Refrigeration", mod: "ref" },
      { id: "ac", days: 16, name: "Air conditioning", label: c ? "HCR117 · Air conditioning" : "Air conditioning", mod: "hp" },
      { id: "epa", days: 8, name: "EPA 608", label: "EPA 608", mod: "epa" },
      { id: "hp", days: 12, name: "Heat pumps", label: c ? "HCR117 · Heat pumps" : "Heat pumps", mod: "hp" },
      { id: "air", days: 10, name: "Airflow", label: c ? "HCR108 · Airflow" : "Airflow", mod: "air" },
      { id: "ctrl", days: 12, name: "Controls", label: c ? "HCR110 · Controls" : "Controls", mod: "ctrl" },
      { id: "pipe", days: 10, name: "Brazing & pipe", label: "Brazing & pipe", mod: "safety" },
    ];
  }
  var BEATS = {
    safety: [
      { a: 1, b: 2, title: "PPE and LOTO", lab: "electrical", sheet: "s-ppe" },
      { a: 3, b: 4, title: "Meter and tools", lab: "voltmeter", sheet: "s-ppe" },
      { a: 5, b: 6, title: "Shop discipline", lab: "ohms", sheet: "s-ppe" },
    ],
    elec: [
      { a: 1, b: 4, title: "Ohm's law and 24V", lab: "ohms", sheet: "s-ohm" },
      { a: 5, b: 8, title: "Meter the string", lab: "voltmeter", sheet: "s-24v" },
      { a: 9, b: 12, title: "Land lugs", lab: "electrical", sheet: "s-24v" },
      { a: 13, b: 16, title: "Follow the call", lab: "elguide", sheet: "s-24v" },
      { a: 17, b: 20, title: "Saturday callback", lab: "defusal", sheet: "s-24v" },
    ],
    ref: [
      { a: 1, b: 4, title: "Four parts of the cycle", lab: "cutaway", sheet: "s-shsc" },
      { a: 5, b: 8, title: "Manifold and SH/SC", lab: "gauges", sheet: "s-shsc" },
      { a: 9, b: 12, title: "TXV and restriction", lab: "sandbox", sheet: "s-shsc" },
      { a: 13, b: 16, title: "Charge and vacuum", lab: "sandbox", sheet: "s-rec" },
      { a: 17, b: 20, title: "Live fault tickets", lab: "service", sheet: "s-shsc" },
    ],
    ac: [
      { a: 1, b: 4, title: "Split and package", lab: "sandbox", sheet: "s-shsc" },
      { a: 5, b: 10, title: "Mini-split install", lab: "minisplit", sheet: "s-cfm" },
      { a: 11, b: 16, title: "Start-up and charge", lab: "gauges", sheet: "s-shsc" },
    ],
    epa: [
      { a: 1, b: 2, title: "Core — venting and cylinders", lab: "epa608", sheet: "s-rec" },
      { a: 3, b: 5, title: "Type II vacuum table", lab: "epa608", sheet: "s-rec" },
      { a: 6, b: 8, title: "Sit the 100", lab: "quiz", sheet: "s-rec" },
    ],
    hp: [
      { a: 1, b: 4, title: "Reversing valve", lab: "sandbox", sheet: "s-hp" },
      { a: 5, b: 8, title: "Defrost", lab: "furnace", sheet: "s-hp" },
      { a: 9, b: 12, title: "Heat-pump SH/SC", lab: "gauges", sheet: "s-shsc" },
    ],
    air: [
      { a: 1, b: 4, title: "CFM and static", lab: "sandbox", sheet: "s-cfm" },
      { a: 5, b: 7, title: "Filter and blower", lab: "furnace", sheet: "s-cfm" },
      { a: 8, b: 10, title: "Low airflow tickets", lab: "service", sheet: "s-cfm" },
    ],
    ctrl: [
      { a: 1, b: 4, title: "24V string", lab: "electrical", sheet: "s-24v" },
      { a: 5, b: 8, title: "Safeties in series", lab: "voltmeter", sheet: "s-24v" },
      { a: 9, b: 12, title: "No-cool walk", lab: "defusal", sheet: "s-24v" },
    ],
    pipe: [
      { a: 1, b: 4, title: "Flare and torque", lab: "flare", sheet: "s-ppe" },
      { a: 5, b: 8, title: "Braze with nitrogen", lab: "braze", sheet: "s-ppe" },
      { a: 9, b: 10, title: "Pressure test", lab: "minisplit", sheet: "s-ppe" },
    ],
  };

  function esc(s) {
    return String(s || "").split("&").join("and").split("<").join(" ").split('"').join("'");
  }
  function courseOf(id) {
    return COURSES().find(function (x) { return x.id === id; }) || COURSES()[1];
  }
  function beatOf(courseId, day) {
    var list = BEATS[courseId] || [];
    var hit = list.find(function (b) { return day >= b.a && day <= b.b; });
    return hit || list[0] || { title: "Shop day", lab: "shopschool", sheet: "" };
  }
  function migrate(s) {
    s = s || {};
    if (!Array.isArray(s.classes) || !s.classes.length) {
      s.classes = [
        {
          id: "c0",
          name: s.className || "HVAC class",
          course: "elec",
          day: 1,
          canvas: "",
          plan: s.plan || "",
          roster: Array.isArray(s.roster) ? s.roster : [],
          roll: s.roll && typeof s.roll === "object" ? s.roll : {},
        },
      ];
      s.active = "c0";
    }
    if (!s.active || !s.classes.some(function (c) { return c.id === s.active; })) {
      s.active = s.classes[0].id;
    }
    return s;
  }
  function activeCls() {
    var s = migrate(load());
    return s.classes.find(function (c) { return c.id === s.active; }) || s.classes[0];
  }
  function saveCls(patch) {
    var s = migrate(load());
    var c = s.classes.find(function (x) { return x.id === s.active; }) || s.classes[0];
    Object.keys(patch || {}).forEach(function (k) { c[k] = patch[k]; });
    save(s);
    return c;
  }
  function dayTitle() {
    var c = activeCls();
    var co = courseOf(c.course);
    var n = Math.max(1, Math.min(co.days, Number(c.day) || 1));
    return (c.name || "Class") + " · Day " + n + "/" + co.days + " · " + (co.name || "");
  }
  function clampDay(c) {
    var co = courseOf(c.course);
    var n = Math.max(1, Math.min(co.days, parseInt(c.day, 10) || 1));
    c.day = n;
    return n;
  }

  var SHEETS = [
    {
      id: "s-ppe",
      mod: "safety",
      kind: "worksheet",
      title: "PPE and LOTO — start of day",
      min: 10,
      student:
        "<p>Name _____________ Date _____________</p>" +
        "<ol><li>List four pieces of PPE you wear on a live 240V disconnect.</li>" +
        "<li>LOTO means: ________________________________</li>" +
        "<li>True or false: You may ohm a winding with the disconnect on if you're quick.</li>" +
        "<li>Who holds the only key to your lock? _____________</li></ol>",
      key:
        "<ol><li>Glasses, gloves, leather/arc-rated as required, boots. Hard hat on a roof. No jewelry.</li>" +
        "<li>Lockout / tagout — energy isolated, locked, tagged, tried.</li>" +
        "<li>False. Kill it, lock it, then ohm.</li>" +
        "<li>You. One person, one lock, one key.</li></ol>",
    },
    {
      id: "s-ohm",
      mod: "elec",
      kind: "quiz",
      title: "Ohm's law — 24V coil",
      min: 12,
      student:
        "<p>Cover the letter you want. V = I × R. I = V ÷ R. R = V ÷ I.</p>" +
        "<ol><li>Healthy coil: 24 V, 0.50 A. R = ____ Ω</li>" +
        "<li>Same coil reads 4 Ω. I = ____ A. 40 VA transformer max I = ____ A. Hold or smoke?</li>" +
        "<li>Transformer 24.0 V, coil 21.0 V, I = 0.50 A. Wire resistance = ____ Ω</li></ol>",
      key:
        "<ol><li>R = 24 / 0.50 = 48 Ω</li>" +
        "<li>I = 24 / 4 = 6 A. Max = 40 / 24 = 1.67 A. Smoke. Swap the coil.</li>" +
        "<li>Drop 3 V. R = 3 / 0.50 = 6 Ω of skinny wire.</li></ol>",
    },
    {
      id: "s-rec",
      mod: "epa",
      kind: "quiz",
      title: "Type II recovery table (legal minimum)",
      min: 12,
      student:
        "<p>Inches of Hg. Machine date is the recovery unit. 0\" = 0 psig = air. Not 500 microns.</p>" +
        "<ol><li>3-ton 410A, 2020 machine: ______</li>" +
        "<li>250 lb R-22 rack, 2020 machine: ______</li>" +
        "<li>300 lb R-134a, 2020 machine: ______</li>" +
        "<li>True or false: Hitting 0 psig dries the system.</li></ol>",
      key:
        "<ol><li>0\" Hg (0 psig) — high-pressure under 200 lb, post-1993.</li>" +
        "<li>10\" Hg — high-pressure ≥ 200 lb, post-1993.</li>" +
        "<li>15\" Hg — medium-pressure ≥ 200 lb, post-1993.</li>" +
        "<li>False. That is 608. Microns are a different pump.</li></ol>",
    },
    {
      id: "s-shsc",
      mod: "ref",
      kind: "worksheet",
      title: "Superheat and subcooling — read the box",
      min: 15,
      student:
        "<p>SH = suction line temp − evaporator sat (dew on a blend). SC = condenser sat (start of boiling on a blend) − liquid line temp.</p>" +
        "<ol><li>R-410A. Suction 70 psig, suction line 50°F. SH ≈ ____ (use your P/T)</li>" +
        "<li>High SH + high SC usually means: _______________</li>" +
        "<li>Low SH + low SC usually means: _______________</li>" +
        "<li>Dirty outdoor coil typically: head ____  SC ____</li></ol>",
      key:
        "<ol><li>410A sat ~32°F at 70 psig ballpark on many charts — SH ~18°F. Chart on the truck wins.</li>" +
        "<li>Restriction / starved evaporator (undercharge can look similar — confirm both).</li>" +
        "<li>Overcharge or dirty indoor / low airflow (ice risk).</li>" +
        "<li>Head high, subcooling low — can't reject heat.</li></ol>",
    },
    {
      id: "s-24v",
      mod: "ctrl",
      kind: "quiz",
      title: "24V string — gold is live",
      min: 10,
      student:
        "<ol><li>Transformer C is tied to: _____________</li>" +
        "<li>Closed switch should read about ____ V across it. Open switch about ____ V.</li>" +
        "<li>You have 24 V at R, 0 V at Y with a call. Next place to land the meter: _____________</li></ol>",
      key:
        "<ol><li>Common / chassis common on the 24V secondary.</li>" +
        "<li>Closed ~0 V (it's a jumper). Open ~24 V (the coil is eating it).</li>" +
        "<li>Walk the string — thermostat Y, then the board, then the coil. Don't guess the contactor first.</li></ol>",
    },
    {
      id: "s-hp",
      mod: "hp",
      kind: "worksheet",
      title: "Heat pump — reversing valve",
      min: 10,
      student:
        "<ol><li>In cool, the indoor coil is the _____________.</li>" +
        "<li>Defrost is there to: _____________</li>" +
        "<li>True or false: A reversing-valve solenoid that is de-energized is always heating. (Depends on OEM — explain.)</li></ol>",
      key:
        "<ol><li>Evaporator.</li>" +
        "<li>Melt outdoor frost so the coil can pick up heat again.</li>" +
        "<li>False as a universal. O vs B: energized in cool vs heat. Read the diagram.</li></ol>",
    },
    {
      id: "s-cfm",
      mod: "air",
      kind: "worksheet",
      title: "Airflow — 400 CFM/ton is a start, not a religion",
      min: 10,
      student:
        "<ol><li>3-ton at 400 CFM/ton is ____ CFM.</li>" +
        "<li>Low indoor airflow on cooling typically: SH ____  ice? ____</li>" +
        "<li>Static you measure is: _____________</li></ol>",
      key:
        "<ol><li>1200 CFM.</li>" +
        "<li>SH low, coil can ice.</li>" +
        "<li>External static across the blower (return + supply). Filter + coil sit in that path.</li></ol>",
    },
    {
      id: "s-er-ref",
      mod: "ref",
      kind: "study guide",
      title: "Employment Ready — Basic Refrigeration and Charging",
      min: 40,
      student:
        "<p>Name _____________ Date _____________ &nbsp; 50 questions. Pass 70% (35). Certificate of achievement. Not Section 608.</p>" +
        "<h2>How to sit it</h2>" +
        "<ul><li>Closed book. Photo ID. Phone off the table.</li>" +
        "<li>Read the whole stem. The last line is the question. The first lines are the story.</li>" +
        "<li>Throw out the two answers that hurt the equipment or the person. Then pick between the last two.</li>" +
        "<li>Do not change an answer unless you misread the stem. The first clean read is usually right.</li>" +
        "<li>Skip a stuck item and come back. A 50-question paper still punishes the person who dies on question 12.</li></ul>" +
        "<h2>What this paper fails people on</h2>" +
        "<ul><li>They ask for the pair. High SH + low SC is undercharge. Do not condemn the TXV first.</li>" +
        "<li>Piston: charge by superheat. TXV: charge by subcooling. The stem is not a charge tool.</li>" +
        "<li>On a blend, dew for superheat, start of boiling for subcooling.</li>" +
        "<li>Weigh a blend in as liquid. Vapor out of the tank is the wrong mix.</li>" +
        "<li>Airflow before refrigerant. A packed filter looks like a bad charge.</li></ul>" +
        "<h2>What this exam is checking</h2>" +
        "<p>AC and refrigeration theory. Systems and components. Air supply and delivery. Troubleshooting. Special components. Charging.</p>" +
        "<h2>The loop</h2>" +
        "<p>Heat moves. The compressor does not make cold. It raises pressure and temperature so the outdoor coil can reject heat.</p>" +
        "<ol><li>Compressor: low-pressure vapor in, high-pressure hot vapor out. Vapor only. Liquid in a scroll is a slug.</li>" +
        "<li>Condenser: desuperheat, then condense, then subcool. Vapor in the top. Warm liquid out the bottom. Still warm. Not cold.</li>" +
        "<li>Metering device: pressure drop. Part of the liquid flashes. That mist is two-phase and cold. TXV bulb is on the suction line. Do not twist the stem to fix a charge.</li>" +
        "<li>Evaporator: boils, picks up room heat, leaves as superheated vapor. Water on the fins is that heat, made visible.</li></ol>" +
        "<h2>Superheat and subcooling</h2>" +
        "<p>SH = suction-line temperature minus evaporator saturation. On a blend use the <strong>dew</strong> column. SC = condenser saturation minus liquid-line temperature. On a blend use the start of boiling. Clamp on clean copper. Evaporator SH and compressor SH are not the same number.</p>" +
        "<p>Read them as a pair. High SH + low SC = undercharge. Low SH + high SC = overcharge. High SH + high SC = restriction (drier outlet is the cold one). Low airflow collapses SH. Do not add gas. Dirty condenser: head climbs, SC does not stack like an overcharge.</p>" +
        "<h2>How you charge</h2>" +
        "<ul><li>Fixed orifice / piston: superheat. It moves with the load. Use the chart.</li>" +
        "<li>TXV: subcooling. The valve is already holding superheat.</li>" +
        "<li>Blend into an empty system: liquid, by weight, from the manufacturer. Invert the tank or use the liquid valve.</li>" +
        "<li>Airflow first. A starved blower looks like a charge problem.</li>" +
        "<li>Recovery to the legal inches is 608. Drying the system is microns. They are not the same pump job.</li></ul>" +
        "<h2>Check — write the call</h2>" +
        "<ol><li>410A. Suction line 58 F. Dew point at the suction pressure is 42 F. SH = ____</li>" +
        "<li>Bubble point 100 F. Liquid line 90 F. SC = ____ &nbsp; TXV or piston target?</li>" +
        "<li>SH 28 F, SC 3 F. Most likely: _____________</li>" +
        "<li>SH 2 F, SC 18 F. Most likely: _____________</li>" +
        "<li>SH 26 F, SC 16 F. Liquid-line drier inlet warm, outlet sweating. Call: _____________</li>" +
        "<li>Indoor coil icing, SH near 0, filter packed. First move: _____________</li>" +
        "<li>Why weigh a blend in as liquid? _____________</li>" +
        "<li>Name the four components in the order the refrigerant travels.</li></ol>",
      key:
        "<ol><li>16 F.</li>" +
        "<li>10 F. TXV systems are charged by subcooling. A piston is charged by superheat.</li>" +
        "<li>Undercharge. Do not condemn the TXV first.</li>" +
        "<li>Overcharge. Liquid is stacked in the condenser.</li>" +
        "<li>Restriction at the drier. Liquid stacks ahead of the plug (high SC). The evaporator is starved, so suction superheat is high. The cold spot is the drier outlet, not superheat.</li>" +
        "<li>Airflow. Change the filter and prove CFM. Do not add gas.</li>" +
        "<li>A blend fractionates. Vapor out of the tank is the wrong mix. Liquid keeps the recipe.</li>" +
        "<li>Compressor, condenser, metering device, evaporator.</li></ol>",
    },
    {
      id: "s-er-elec",
      mod: "elec",
      kind: "study guide",
      title: "Employment Ready — Electrical",
      min: 45,
      student:
        "<p>Name _____________ Date _____________ &nbsp; 100 questions. Pass 70% (70). Not a license. Not 608.</p>" +
        "<h2>How to sit it</h2>" +
        "<ul><li>Closed book. Photo ID. Phone off the table.</li>" +
        "<li>Read the whole stem. The last line is the question.</li>" +
        "<li>Throw out the two answers that hurt the equipment or the person. Then pick between the last two.</li>" +
        "<li>Do not change an answer unless you misread the stem.</li>" +
        "<li>Skip a stuck item and come back. Do not die on one question in a 100-question paper.</li></ul>" +
        "<h2>What this paper fails people on</h2>" +
        "<ul><li>Volts across a closed switch are about 0. Volts across an open switch in a live string are about source voltage.</li>" +
        "<li>Ohms with the power off and the part isolated. A clamp goes around one conductor.</li>" +
        "<li>Walk the 24 V string from the transformer. A safety in series can be doing its job.</li>" +
        "<li>A capacitor is still charged with the disconnect open. Out of the stamped microfarad window, replace it. Do not upsize it.</li>" +
        "<li>C-to-S plus C-to-R should about equal S-to-R. Any terminal to the shell that is not OL is a grounded compressor.</li></ul>" +
        "<h2>What this exam is checking</h2>" +
        "<p>Components. Meter use. Safety. Theory. Troubleshooting. Motors and capacitors. Reading diagrams.</p>" +
        "<h2>Stay alive</h2>" +
        "<p>Lock it, tag it, try it. Meter the lugs dead before your hands go in. One lock, one key, and the key stays on you. No jewelry. A capacitor holds a charge after the disconnect is off. Discharge it with a rated resistor, then prove it dead.</p>" +
        "<h2>The three numbers</h2>" +
        "<p>V = I × R. I = V ÷ R. R = V ÷ I. Power: P = V × I. A 40 VA transformer on 24 V can feed about 1.67 A. A shorted contactor coil will cook it.</p>" +
        "<p>Series: one path, current is the same, voltages add, an open kills the whole string. Parallel: voltage is the same, currents add, one open load does not kill the others.</p>" +
        "<h2>How a meter lies if you let it</h2>" +
        "<ul><li>Volts across a closed switch: about 0. It is a wire.</li>" +
        "<li>Volts across an open switch in a live string: about source voltage. The load is waiting on the other side.</li>" +
        "<li>Ohms: power off, isolate the part. A winding to ground should be OL. A shorted winding is near 0 and it should not be.</li>" +
        "<li>Amps: meter in series, or a clamp around one conductor. Clamping the whole cable reads nothing useful.</li>" +
        "<li>Walk the 24 V string from the transformer, not from the part you feel like changing.</li></ul>" +
        "<h2>Motors and capacitors</h2>" +
        "<p>A run capacitor stays in the circuit. It is oil-filled, marked in microfarads, with a tolerance. A start capacitor is in only for the start, then the relay drops it out. Measure microfarads with the capacitor isolated and discharged. Out of the stamped range, replace it. Do not 'just try a bigger one.'</p>" +
        "<p>Compressor terminals: C is common. The start winding is the higher ohms (C to S). The run winding is the lower ohms (C to R). C-to-S plus C-to-R should equal S-to-R, close enough. Any terminal to the shell that is not OL is a grounded compressor.</p>" +
        "<h2>The diagram</h2>" +
        "<p>Read the legend. Follow the call from the thermostat through every safety in series before you condemn a board. A pressure switch, a limit, and a float are just switches. Open in series means the load never sees power, and that can be the right answer.</p>" +
        "<h2>Check</h2>" +
        "<ol><li>24 V coil, 0.5 A. Resistance = ____ ohms.</li>" +
        "<li>Same coil now reads 4 ohms. Current = ____ A. 40 VA transformer. Hold or smoke?</li>" +
        "<li>Closed contactor coil circuit, meter across the coil contacts of a closed door switch. Expected volts: ____</li>" +
        "<li>You read 24 V at R and 0 V at Y on a cool call. Next landing: _____________</li>" +
        "<li>C to S = 8 ohms. C to R = 2 ohms. S to R should be about ____. Shell to C reads 0 ohms. Call: _____________</li>" +
        "<li>Run capacitor stamped 40 µF ±6%. You measure 28 µF, isolated. Keep or replace?</li>" +
        "<li>Why discharge a capacitor after LOTO? _____________</li>" +
        "<li>A high-pressure switch is open and the contactor is out. Is the contactor the first part you buy?</li></ol>",
      key:
        "<ol><li>48 ohms. R = 24 / 0.5.</li>" +
        "<li>6 A. Max on 40 VA is about 1.67 A. Smoke. The coil is shorted.</li>" +
        "<li>About 0 V. A closed switch is a jumper.</li>" +
        "<li>The thermostat Y, then every device in that string, then the board. Do not start at the contactor.</li>" +
        "<li>About 10 ohms. Grounded compressor. Do not put it back on the truck as a good pump.</li>" +
        "<li>Replace. 28 is well outside ±6% of 40 (the window is about 37.6 to 42.4).</li>" +
        "<li>It can still be charged with the disconnect open. It will weld a screwdriver and it can stop a heart.</li>" +
        "<li>No. Find out why the switch is open. Head pressure, a failed switch, or a broken wire. The contactor may be doing its job.</li></ol>",
    },
    {
      id: "s-er-hp",
      mod: "hp",
      kind: "study guide",
      title: "Employment Ready — Heat Pump 2024 (Low GWP / A3 bucket)",
      min: 45,
      student:
        "<p>Name _____________ Date _____________ &nbsp; Published Heat Pumps Employment Ready is 100 questions. Pass 70% (70). The button on our proctor screen is Heat Pump ER Exam 2024 inside the Low GWP / A3 bucket. This guide is the published topic list plus the refrigerant class that folder name is warning you about. It is not the live form.</p>" +
        "<h2>How to sit it</h2>" +
        "<ul><li>Closed book. Photo ID. Phone off the table.</li>" +
        "<li>Read the whole stem. The last line is the question. Heat-pump stories hide the mode in the first sentence.</li>" +
        "<li>Throw out the two answers that hurt the equipment or the person. Then pick between the last two.</li>" +
        "<li>Do not change an answer unless you misread the stem.</li>" +
        "<li>Skip a stuck item and come back. Do not buy a compressor in your head on question 8.</li></ul>" +
        "<h2>What this paper fails people on</h2>" +
        "<ul><li>In heat, the outdoor coil is the evaporator. A cold suction line outside is normal. That is not a bad reversing valve by itself.</li>" +
        "<li>The diagram decides O versus B. O energized in cool is common. It is not a law.</li>" +
        "<li>A block of ice on the outdoor coil in heat is a defrost call until you prove the board, the sensor, and that the valve shifted.</li>" +
        "<li>A2L and A3 are not the same gas. Do not mix them. Do not leak-check either with a torch. Charge by the data plate.</li></ul>" +
        "<h2>What this exam is checking</h2>" +
        "<p>Components and controls. The heat-pump cycle. Service. Theory. Troubleshooting. Reading schematics.</p>" +
        "<h2>The cycle, both ways</h2>" +
        "<p>Same four parts. The reversing valve decides which coil is the condenser.</p>" +
        "<ul><li>Cooling: indoor coil is the evaporator (cold, wet). Outdoor coil is the condenser (hot).</li>" +
        "<li>Heating: outdoor coil is the evaporator. It is picking heat out of cold air. Indoor coil is the condenser. Supply air should be warm, not icy.</li>" +
        "<li>The suction line is always the line going back to the compressor. In heat, that cold line is outside.</li></ul>" +
        "<h2>Reversing valve</h2>" +
        "<p>The solenoid does not 'always mean heat' when it is off. O is energized in cool on many thermostats. B is energized in heat. The diagram wins. A valve that will not shift can stick from sludge, a dead solenoid, or no pressure difference to move the slide. Do not replace it because the mode feels wrong until you prove the call and the coil.</p>" +
        "<h2>Defrost</h2>" +
        "<p>Frost on the outdoor coil in heat is normal until it blocks the air. Defrost flips the valve back to cooling for a few minutes so the outdoor coil becomes the condenser and melts the ice. Auxiliary heat usually comes on indoors so the house does not get a face full of cold air. A board that never defrosts ices the outdoor coil solid. A board that never comes out of defrost heats the outdoors and cools the house.</p>" +
        "<h2>When heat-pump heat is not enough</h2>" +
        "<p>Balance point is the outdoor temperature where the pump's heat output equals the house loss. Below that, auxiliary heat makes up the difference. Electric strips are the expensive heat. A strip that is welded on is a high bill and a cooked cabinet. A strip that never comes on below balance point is a cold house. Prove the outdoor sensor and the thermostat staging before you condemn the compressor.</p>" +
        "<h2>Low GWP, and do not mix the letters</h2>" +
        "<p>A2L (R-32, R-454B) is mildly flammable. A3 (R-290 propane class) is flammable. They are not the same refrigerant and you do not top one with the other. No open flame on a leak check. Use the detector the job calls for. Charge by weight from the data plate. Recovery cylinders and oil have to match the refrigerant. If you do not know the charge limit for that model, you do not guess it.</p>" +
        "<h2>Check</h2>" +
        "<ol><li>In heating, which coil is the evaporator? _____________</li>" +
        "<li>O vs B. Where do you read which one this stat uses? _____________</li>" +
        "<li>Outdoor coil is a block of ice in heat, indoor air is barely warm. First system, not the first part: _____________</li>" +
        "<li>During a normal defrost, the outdoor fan is usually ____ and the indoor strips are usually ____.</li>" +
        "<li>Balance point means: _____________</li>" +
        "<li>Can you add R-410A to an R-454B system to 'get it through the night'?</li>" +
        "<li>A2L leak check. Is a torch acceptable if you are careful?</li>" +
        "<li>Suction line in heat mode is cold and it is the outdoor vapor line. Is that a failed reversing valve by itself?</li></ol>",
      key:
        "<ol><li>The outdoor coil.</li>" +
        "<li>The thermostat and the unit diagram. O energized in cool is common. B energized in heat is common. It is not a law of physics.</li>" +
        "<li>Defrost. Sensor, board, and whether the valve actually shifted. Do not condemn the compressor for ice.</li>" +
        "<li>Outdoor fan usually off. Indoor auxiliary heat usually on. Confirm on that OEM. Some fans behave differently. The diagram wins.</li>" +
        "<li>The outdoor temperature where pump capacity equals the building loss. Below it, auxiliary heat has to help.</li>" +
        "<li>No. Different refrigerants do not get mixed. Recover and weigh in the name on the plate.</li>" +
        "<li>No. No open flame. Use a detector rated for that refrigerant.</li>" +
        "<li>No. In heat the outdoor coil is the evaporator, so that line is supposed to be cold. Prove the mode before you buy a valve.</li></ol>",
    },
    {
      id: "s-epa",
      mod: "epa",
      kind: "study guide",
      title: "EPA 608 · sit and pass",
      min: 40,
      student:
        "<p>Name _____________ Date _____________ &nbsp; 25 questions a section. Closed-book pass is typically <strong>18/25 (72%)</strong>. Each section is scored alone. Universal is 100 questions, still scored as four sections. This is not an Employment Ready exam.</p>" +
        "<h2>How to sit it</h2>" +
        "<ul><li>Closed book when it is the proctored card. Photo ID. Phone off the table. Open-book Core does not stack into Universal.</li>" +
        "<li>Read the whole stem. The last line is the question. Dates and units are the trap.</li>" +
        "<li>Throw out the answer that vents refrigerant, uses oxygen, or mixes the wrong units. Then pick between what is left.</li>" +
        "<li>Do not change an answer unless you misread the stem.</li>" +
        "<li>Skip a stuck item and come back. Do not die on one recovery-table row.</li></ul>" +
        "<h2>How the paper is built</h2>" +
        "<ul><li>Core: ozone, venting, the three R's, cylinders. Fail Core and you fail the card. Core alone does not let you open a box.</li>" +
        "<li>Type I: factory-sealed and 5 lb or less. Window units, PTACs, household refrigerators.</li>" +
        "<li>Type II: high-pressure appliances. Splits, heat pumps, RTUs, racks. This is the HVAC card.</li>" +
        "<li>Type III: low-pressure chillers. 25 mm Hg absolute.</li>" +
        "<li>HVAC truck = Core + Type II. Universal if they might see a chiller. 608 does not expire. 609 is cars. There is no Type IV. A2L lives inside Core and Type II.</li></ul>" +
        "<h2>What this paper fails people on</h2>" +
        "<ul><li>0 inches Hg on a house 410A is 0 psig. That is atmospheric. You did not pull a vacuum. That number is 608 recovery, not microns.</li>" +
        "<li>The date on the recovery table is the recovery machine, not the condensing unit. A modern machine on a 3-ton 410A under 200 lb stops at 0 psig. A 250 lb high-pressure rack on a modern machine is 10 inches Hg. 15 inches is the big medium-pressure number, not the high-pressure one.</li>" +
        "<li>Type I needs both: factory sealed and a manufactured charge of 5 lb or less. A split is Type II even if somebody says it is small.</li>" +
        "<li>Type III recovery follows the machine date. Before November 15, 1993: 25 inches of mercury vacuum. On or after that date: 25 mm Hg absolute. Do not swap the units.</li>" +
        "<li>Recover is into a cylinder. Recycle stays with the same owner. Reclaim to AHRI 700 is what can be sold to a new owner.</li>" +
        "<li>Gray body, yellow top. 80% by weight. Never recover into a disposable. Never mix refrigerants in one bottle. Leak-check with dry nitrogen, never oxygen.</li>" +
        "<li>July 1, 1992: illegal to vent CFC and HCFC. November 15, 1995: illegal to vent HFC. A card does not make venting legal.</li></ul>" +
        "<h2>7–14 day plan</h2>" +
        "<ol><li>Core, two days. Families, dates, three R's, the bottle.</li>" +
        "<li>Type II, three days. The vacuum table until you can say the row out loud.</li>" +
        "<li>Type I, one sitting. 90/80 or 4 inches. Passive recovery is Type I only.</li>" +
        "<li>Type III, one sitting. 25 mm Hg absolute. Say the units.</li>" +
        "<li>Untimed 100, then timed. Tables only the night before.</li></ol>",
      key:
        "<ol><li>House 3-ton 410A, machine made after Nov 15, 1993: recover to 0 psig. That satisfies 608. It does not dry the system.</li>" +
        "<li>250 lb R-22 rack, same machine: 10 inches Hg.</li>" +
        "<li>Type III: 25 mm Hg absolute if the recovery machine is on or after November 15, 1993. 25 inches Hg if the machine is older.</li>" +
        "<li>A window unit is Type I. A split is Type II. The refrigerant name does not pick the card. The appliance does.</li>" +
        "<li>Passive recovery is Type I only.</li>" +
        "<li>609 is motor vehicles. A2L is not a fourth 608 type.</li></ol>",
    },
  ];

  var LABS = [
    {
      id: "l-rec",
      mod: "epa",
      title: "Recover a 3-ton 410A to the legal minimum, then dry it",
      safety: "Glasses. Gloves. Recovery machine grounded. Gray/yellow tank, weigh to 80%. No oxygen.",
      procedure: [
        "ID the refrigerant. 410A is high-pressure under 200 lb on a house box.",
        "Hook recovery: liquid and vapor as the machine allows. Purge hoses.",
        "Recover to 0 psig (0\" Hg). That is 608 on this box — not microns.",
        "Close tank. Pull cores. Nitrogen break. Then vacuum pump to ≤500 microns.",
        "Standing decay. Then charge / braze as the job needs.",
      ],
      table: ["Start lbs in system", "Tank start lbs", "Tank end lbs", "608 level hit (psig / in Hg)", "Final microns", "Decay 10 min"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
    {
      id: "l-lugs",
      mod: "elec",
      title: "Land a 240V disconnect — real stamps",
      safety: "LOTO. Prove it dead. Black L1, red L2, green ground. No fake N on a three-wire disconnect.",
      procedure: [
        "Lock out. Meter the lugs dead.",
        "Land ground first.",
        "L1 LINE / L2 LINE — torque to the listing, not 'good and tight.'",
        "Energize. Meter L1-L2 ~240, L1-G and L2-G ~120.",
      ],
      table: ["L1-L2 V", "L1-G V", "L2-G V", "Torque (in-lb)", "Pass / fail"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
    {
      id: "l-flare",
      mod: "ref",
      title: "Mini-split flare, torque, nitrogen, vacuum",
      safety: "Nut on the tube first. No oxygen. Service valves stay closed until decay passes.",
      procedure: [
        "Square cut, deburr, 45° flare. Inspect.",
        "Torque to OEM (1/4\" often ~10–13 ft-lb). Backup wrench on the body.",
        "Nitrogen 450–550 psig. Soap. Hold.",
        "Vacuum ≤500 microns. Isolate. Decay.",
        "Open liquid, then suction. Commission ΔT.",
      ],
      table: ["Flare visual", "Torque", "N2 psig / hold", "Microns", "Decay", "ΔT cool"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
    {
      id: "l-gauges",
      mod: "ref",
      title: "Hang manifold — blue suction, red liquid, yellow utility",
      safety: "Hoses on last, off first on the high side habit. A2L: no open flame, leak-detect at 25% LFL class.",
      procedure: [
        "Valves closed on the manifold. Blue to suction service port.",
        "Red to liquid. Yellow to tank or recovery as the job needs.",
        "Crack, purge the hose, then read.",
        "Write P/T, SH, SC. Fingerprint the fault before you change a part.",
      ],
      table: ["P low", "P high", "Suction °F", "Liquid °F", "SH", "SC", "Fault call"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
    {
      id: "l-tu522",
      mod: "elec",
      title: "TU-522 — meter the fault board, do not jump the safety",
      safety: "R-134a only on this board. Power as the instructor set it. No jumper across HPC, LPC, or the overload.",
      procedure: [
        "Read the ticket. Contactor out means the coil string. Contactor in means the load.",
        "Meter in HUB's order: temperature control, pump-down switch, low pressure, high pressure, coil.",
        "If the contactor is in: overload, run capacitor, potential relay.",
        "Call the open part. Say why. Then the next ticket.",
      ],
      table: ["Ticket", "Contactor in or out", "Part metered", "Ohms", "Fault called", "Why"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
    {
      id: "l-tu601",
      mod: "ref",
      title: "TU-601 — multi-head mini-split, read the plate",
      safety: "R-410A only. 208/240 V, 20 A. Do not land a 24V Nest on the Daikin. Do not mix line sets.",
      procedure: [
        "Read the plate: model, volts, refrigerant.",
        "Point to the outdoor Daikin and the cassette.",
        "Trace one head's line set. Blue gauge is suction. Red is liquid.",
        "Say what a crossed pair does to one room.",
      ],
      table: ["Refrigerant", "Volts", "Outdoor unit", "Indoor head", "Blue hose lands on", "Pass / fail"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
    {
      id: "l-tu210",
      mod: "ctrl",
      title: "TU-210G — gas boiler, hydronic",
      safety: "Water, not refrigerant. Do not hook a manifold to the copper. Prove water and a closed high limit before gas.",
      procedure: [
        "Read the plate. North Park Innovations. Serial on the unit.",
        "Name the medium. Water.",
        "The duplex outlet is not the gas valve.",
        "The copper leaving the cabinet is a hydronic pipe.",
      ],
      table: ["Model", "Medium", "What the duplex is", "What the copper is", "High limit closed Y/N", "Pass / fail"],
      sign: "Tech ________  Instructor ________  Date ________  Competent: Y / N",
    },
  ];

  /* One station of reusable gear. Consumables are per student who does the lab. */
  var MATS = {
    "l-rec": {
      basis: "One 3-ton R-410A system. About 8 lb is in the box. It moves into the tank. It is not used up.",
      reusable: [
        ["Recovery machine", 1, ""],
        ["DOT recovery tank", 1, ""],
        ["Scale", 1, ""],
        ["Manifold and hoses", 1, "set"],
        ["Vacuum pump", 1, ""],
        ["Micron gauge", 1, ""],
        ["Core tools", 2, ""],
        ["Nitrogen cylinder and regulator", 1, ""],
        ["Glasses and gloves", 1, "set"],
      ],
      consumable: [
        ["Nitrogen, break and purge", 15, "cu ft"],
        ["Spare valve cores", 2, ""],
        ["Filter-drier, only if the loop is opened", 1, ""],
      ],
    },
    "l-lugs": {
      basis: "One 240 V disconnect. The disconnect and the meter stay. New wire is what gets cut.",
      reusable: [
        ["Disconnect", 1, ""],
        ["Multimeter", 1, ""],
        ["Lockout kit", 1, ""],
        ["Torque driver", 1, ""],
        ["Wire strippers", 1, ""],
      ],
      consumable: [
        ["#10 THHN black", 3, "ft"],
        ["#10 THHN red", 3, "ft"],
        ["#10 THHN green", 3, "ft"],
        ["Electrical tape", 2, "ft"],
      ],
    },
    "l-flare": {
      basis: "One mini-split flare practice. Bad flares get cut off. Factory charge stays in the outdoor unit until the valves open.",
      reusable: [
        ["Tube cutter", 1, ""],
        ["Deburr tool", 1, ""],
        ["Flaring tool", 1, ""],
        ["Torque wrench and backup wrench", 1, "set"],
        ["Nitrogen cylinder and regulator", 1, ""],
        ["Manifold", 1, ""],
        ["Vacuum pump", 1, ""],
        ["Micron gauge", 1, ""],
      ],
      consumable: [
        ['1/4" ACR copper', 3, "ft"],
        ['3/8" ACR copper', 3, "ft"],
        ["3/8 flare nuts", 2, ""],
        ["3/8 flare caps", 1, ""],
        ["3/8 flare couplings", 1, ""],
        ["Flare nuts, 1/4", 2, ""],
        ["Nitrogen, pressure test and purge", 10, "cu ft"],
        ["Line insulation", 4, "ft"],
        ["Nylog or POE", 1, "drop"],
      ],
    },
    "l-gauges": {
      basis: "Hanging gauges to read. Nothing is built. A live purge wastes a little gas. Capped ports waste none.",
      reusable: [
        ["Manifold and three hoses", 1, "set"],
        ["Thermometer", 1, ""],
        ["P/T chart", 1, ""],
      ],
      consumable: [
        ["Refrigerant lost purging a live hose", 0.1, "lb"],
        ["Spare valve cores", 2, ""],
      ],
    },
    "l-tu522": {
      basis: "Meter the TU-522. Do not jumper a safety. No gas and no copper.",
      reusable: [
        ["TU-522 fault board", 1, ""],
        ["Multimeter", 1, ""],
      ],
      consumable: [],
    },
    "l-tu601": {
      basis: "Read the TU-601 plate and trace one line set. Do not open the refrigerant circuit.",
      reusable: [
        ["TU-601 mini-split trainer", 1, ""],
        ["Manifold on the rack", 1, ""],
        ["Multimeter", 1, ""],
      ],
      consumable: [],
    },
    "l-tu210": {
      basis: "TU-210G is a gas boiler. Water, not refrigerant. Do not plan copper or a recovery tank.",
      reusable: [
        ["TU-210G boiler", 1, ""],
        ["Multimeter", 1, ""],
      ],
      consumable: [],
    },
  };

  /* Days that burn or wear something. Any day not listed uses nothing up.
     Quantities are per student, once for that day, from MATS. */
  var MOD_DAYS = {
    safety: [
      { day: 3, name: "Meter and tools", use: [], wear: [{ id: "leads", item: "Meter leads", note: "Order when a lead is cracked or the probe is gone." }] },
    ],
    elec: [
      { day: 5, name: "Meter the string", use: [], wear: [{ id: "leads", item: "Meter leads", note: "Order when a lead is cracked or the probe is gone." }] },
      { day: 9, name: "Land lugs", use: [
        { item: "#10 THHN black", size: "#10", qty: 3, unit: "ft", shelf: "blk", roll: 50 },
        { item: "#10 THHN red", size: "#10", qty: 3, unit: "ft", shelf: "red", roll: 50 },
        { item: "#10 THHN green", size: "#10", qty: 3, unit: "ft", shelf: "grn", roll: 50 },
        { item: "Electrical tape", size: "", qty: 2, unit: "ft", shelf: "tape", roll: 66 },
      ], wear: [] },
    ],
    ref: [
      { day: 5, name: "Hang the manifold", use: [
        { item: "Refrigerant lost purging a live hose", size: "R-410A", qty: 0.1, unit: "lb", shelf: "ref410" },
        { item: "Spare valve cores", size: "", qty: 2, unit: "ea", shelf: "" },
      ], wear: [{ id: "gaskets", item: "Hose gaskets", note: "Order when a gasket is torn or the hose will not seal." }] },
      { day: 13, name: "Recover, then pull a vacuum", use: [
        { item: "Nitrogen, break and purge", size: "", qty: 15, unit: "cu ft", shelf: "nitrogen" },
        { item: "Spare valve cores", size: "", qty: 2, unit: "ea", shelf: "" },
        { item: "Filter-drier, only if the loop is opened", size: "", qty: 1, unit: "ea", shelf: "driers" },
      ], wear: [{ id: "recoil", item: "Recovery-machine oil", note: "Order when the oil is milky or the sight glass is low." }] },
    ],
    ac: [
      { day: 5, name: "Mini-split flare", use: [
        { item: '1/4" ACR copper', size: "1/4", qty: 3, unit: "ft", shelf: "cu14", roll: 25 },
        { item: '3/8" ACR copper', size: "3/8", qty: 3, unit: "ft", shelf: "cu38", roll: 25 },
        { item: "Flare nuts, 1/4", size: "1/4", qty: 2, unit: "ea", shelf: "" },
        { item: "3/8 flare nuts", size: "3/8", qty: 2, unit: "ea", shelf: "nut38" },
        { item: "3/8 flare caps", size: "3/8", qty: 1, unit: "ea", shelf: "cap38" },
        { item: "3/8 flare couplings", size: "3/8", qty: 1, unit: "ea", shelf: "coup38" },
        { item: "Nitrogen, pressure test and purge", size: "", qty: 10, unit: "cu ft", shelf: "nitrogen" },
        { item: "Line insulation", size: "", qty: 4, unit: "ft", shelf: "insul" },
        { item: "Nylog or POE", size: "", qty: 1, unit: "drop", shelf: "" },
      ], wear: [{ id: "flareblock", item: "Flare block", note: "Order when the cone is scored or the block slips." }] },
    ],
    epa: [],
    hp: [
      { day: 9, name: "Heat-pump manifold", use: [
        { item: "Refrigerant lost purging a live hose", size: "R-410A", qty: 0.1, unit: "lb", shelf: "ref410" },
      ], wear: [{ id: "gaskets", item: "Hose gaskets", note: "Order when a gasket is torn or the hose will not seal." }] },
    ],
    air: [],
    ctrl: [
      { day: 5, name: "Meter the safeties", use: [], wear: [{ id: "leads", item: "Meter leads", note: "Order when a lead is cracked or the probe is gone." }] },
    ],
    pipe: [
      { day: 1, name: "Flare and torque", use: [
        { item: '1/4" ACR copper', size: "1/4", qty: 3, unit: "ft", shelf: "cu14", roll: 25 },
        { item: '3/8" ACR copper', size: "3/8", qty: 3, unit: "ft", shelf: "cu38", roll: 25 },
        { item: "Flare nuts, 1/4", size: "1/4", qty: 2, unit: "ea", shelf: "" },
        { item: "3/8 flare nuts", size: "3/8", qty: 2, unit: "ea", shelf: "nut38" },
        { item: "Nitrogen, pressure test and purge", size: "", qty: 10, unit: "cu ft", shelf: "nitrogen" },
      ], wear: [{ id: "flareblock", item: "Flare block", note: "Order when the cone is scored or the block slips." }] },
      { day: 5, name: "Braze with nitrogen", use: [
        { item: "Nitrogen, pressure test and purge", size: "", qty: 10, unit: "cu ft", shelf: "nitrogen" },
      ], wear: [{ id: "tips", item: "Torch tips", note: "Order when the tip is clogged or the flame will not settle." }] },
    ],
  };

  function campusMats() {
    return true;
  }

  var FILMS = [
    { id: "f-ohm", title: "Ohm's law — drag the kink", mode: "ohms", ticket: "What happens to amps when R drops? Why does a 40 VA die at 4 Ω?" },
    { id: "f-lug", title: "Land lugs — left-rail chips", mode: "electrical", ticket: "Which stamp is ground? Why is there no N on this disconnect?" },
    { id: "f-g", title: "Manifold school — three hoses", mode: "gauges", ticket: "Blue goes where? What does high SH + high SC usually mean?" },
    { id: "f-ms", title: "Mini-split 11 steps", mode: "minisplit", ticket: "When do you open service valves? What if decay climbs without bound?" },
    { id: "f-608", title: "608 vacuum table", mode: "epa608", ticket: "3-ton 410A, modern machine: what inches? Is that microns?" },
    { id: "f-cut", title: "See inside — TXV cutaway", mode: "cutaway", ticket: "Where does liquid flash? What does the bulb do with superheat?" },
    { id: "f-ic", title: ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + " lab — HUB walks the three trainers", mode: "iconnect", ticket: "TU-522: what is open? TU-601: what refrigerant? TU-210G: what is in the pipe?" },
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (_) {
      return {};
    }
  }
  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (_) {}
  }
  function isInstructor() {
    return !!load().instructor;
  }
  function setInstructor(on) {
    var s = load();
    s.instructor = !!on;
    save(s);
  }
  function studentHome() {
    var pack = global.SchoolPack;
    if ((pack && pack.id === "lincoln") || /\/allstars(\/|$)/.test(location.pathname || "")) {
      return "/allstars/index.html";
    }
    return "/legends/index.html";
  }
  function goMode(mode) {
    if (!mode) return;
    if (typeof global.ltPlay === "function") {
      global.ltPlay(mode);
      return;
    }
    var sku = (global.LtBrand && global.LtBrand.sku) || "";
    var u = studentHome() + "?play=1&open=" + encodeURIComponent(mode);
    if (sku) u += "&sku=" + encodeURIComponent(sku);
    location.href = u;
  }
  function roster() {
    var c = activeCls();
    if (!Array.isArray(c.roster)) c.roster = [];
    return c.roster;
  }
  function modName(id) {
    var m = MODS.find(function (x) { return x.id === id; });
    return m ? m.name : id;
  }

  function printBlock(html) {
    var w = window.open("", "_blank");
    if (!w) {
      document.body.classList.add("ss-printing");
      var box = document.createElement("div");
      box.className = "ss-print-fallback";
      box.innerHTML = html;
      document.body.appendChild(box);
      window.print();
      document.body.removeChild(box);
      document.body.classList.remove("ss-printing");
      return;
    }
    w.document.write(
      "<!DOCTYPE html><html><head><title>Shop School</title>" +
        "<style>body{font-family:Georgia,serif;color:#111;padding:24px;max-width:800px;margin:0 auto}" +
        "h1,h2{font-family:Arial,sans-serif}table{width:100%;border-collapse:collapse}td,th{border:1px solid #333;padding:6px;font-size:13px}" +
        "ol,ul{line-height:1.45}.page{page-break-after:always}.key{background:#f4f4f4;padding:8px} .muted{color:#444;font-size:12px}" +
        "@media print{.noprint{display:none}}</style></head><body>" +
        html +
        "</body></html>"
    );
    w.document.close();
    w.focus();
    setTimeout(function () { w.print(); }, 250);
  }

  function sheetHtml(sh, withKey) {
    var student =
      '<div class="page"><h1>' +
      sh.title +
      "</h1><p class='muted'>HVAC Allstars · Shop School · " +
      modName(sh.mod) +
      " · " +
      sh.kind +
      " · ~" +
      sh.min +
      " min · STUDENT COPY</p>" +
      sh.student +
      "<p class='muted'>Original shop drill. Not the live EPA/ESCO bank.</p></div>";
    if (!withKey) return student;
    return (
      student +
      '<div class="page"><h1>' +
      sh.title +
      " — INSTRUCTOR KEY</h1><p class='muted'>Do not hand this stack to the class.</p><div class='key'>" +
      sh.key +
      "</div></div>"
    );
  }

  function quizHtml(title, items) {
    var letters = "ABCD";
    var list = items || [];
    var student = list
      .map(function (it, n) {
        var ch = it.choices || [];
        return (
          "<p><b>" +
          (n + 1) +
          ".</b> " +
          it.q +
          "</p><ol type='A'>" +
          ch.map(function (c) { return "<li>" + c + "</li>"; }).join("") +
          "</ol>"
        );
      })
      .join("");
    var key = list
      .map(function (it, n) {
        var L = letters.charAt(it.a) || "?";
        var ans = (it.choices && it.choices[it.a]) || "";
        return (
          "<p><b>" +
          (n + 1) +
          ". " +
          L +
          "</b> — " +
          ans +
          "<br><span class='muted'>" +
          (it.why || "") +
          "</span></p>"
        );
      })
      .join("");
    return (
      '<div class="page"><h1>' +
      title +
      "</h1><p class='muted'>STUDENT COPY · HVAC Allstars training bank — not the live EPA/ESCO form.</p>" +
      student +
      "</div><div class='page'><h1>" +
      title +
      " — INSTRUCTOR KEY</h1><p class='muted'>Do not hand this stack to the class.</p>" +
      key +
      "</div>"
    );
  }

  function printQuiz(title, items) {
    printBlock(quizHtml(title, items));
  }

  function labHtml(lab) {
    return (
      '<div class="page"><h1>' +
      lab.title +
      "</h1><p class='muted'>HVAC Allstars · Shop School lab · " +
      modName(lab.mod) +
      "</p><h2>Safety</h2><p>" +
      lab.safety +
      "</p><h2>Procedure</h2><ol>" +
      lab.procedure.map(function (p) { return "<li>" + p + "</li>"; }).join("") +
      "</ol><h2>Data</h2><table><tr>" +
      lab.table.map(function (c) { return "<th>" + c + "</th>"; }).join("") +
      "</tr><tr>" +
      lab.table.map(function () { return "<td style='height:36px'></td>"; }).join("") +
      "</tr></table><h2>Competency</h2><p>" +
      lab.sign +
      "</p></div>"
    );
  }

  function courseHtml() {
    var track = (window.CurriculumTrain && window.CurriculumTrain.view && window.CurriculumTrain.view()) || (window.CurriculumTrain && window.CurriculumTrain.TRACK) || [];
    var prog = { done: {}, xp: 0 };
    try { prog = JSON.parse(localStorage.getItem("lt-course-v1") || "{}"); } catch (e) {}
    var done = prog.done || {};
    var rows = track.map(function (c) {
      var labs = c.labs.map(function (l) {
        var on = !!done[l.id];
        if (!l.mode) {
          return "<li>" + (on ? "Done" : "Read") + " · " + l.label + " — " + (l.what || "Reading.") + "</li>";
        }
        return "<li><button type='button' class='ss-row' data-course-lab='" + l.mode + "'>" +
          (on ? "Done" : "Open") + " · " + l.label + " · " + l.xp + " XP</button></li>";
      }).join("");
      return "<div class='card'><h3>" + c.code + " · " + c.title + "</h3><p>" + c.blurb + "</p><ul>" + labs + "</ul></div>";
    }).join("");
    return (
      "<p>Same five courses as the student app. Experience posts when the lab is finished, not when it is opened. This desk shows the progress stored on this device.</p>" +
      "<p><strong>" + (prog.xp || 0) + " course XP</strong> on this device.</p>" +
      rows +
      '<p><a class="btn primary" id="ss-open-course" href="' + studentHome() + '?play=1&sku=' + ((global.LtBrand && global.LtBrand.sku) || "campus") + '&course=1">Open the course</a></p>'
    );
  }

  function ShopSchool(host, opts) {
    var onHub = opts && opts.onHub;
    var tab = "today";
    var viewSheet = null;
    var viewLab = null;
    var showKey = false;
    var gClass = "hcr200";
    var gStudent = null;
    var gScore = 100;
    var gSharp = 10;
    var gNotes = "";
    var gOpen = "";
    var gScanning = false;
    var gScanFor = "";
    var gKeepScan = false;
    var gPicture = "";
    var gStatus = "";
    var gStatusBad = false;
    var scanTimer = null;
    var scanStream = null;
    var GRADE_BUILTIN = {
      hcr200: {
        name: "HCR200 Morning – Advanced Electrical",
        roster: {
          "hcr200-01": "Gray Alcide",
          "hcr200-02": "Mohammed Alshehari",
          "hcr200-03": "Amneyll Estevez",
          "hcr200-04": "Dalonte Jackson",
          "hcr200-05": "Mohammad Kanan",
          "hcr200-06": "Eugene Martin",
          "hcr200-07": "Tyler Moore",
          "hcr200-08": "Joshua Pintella",
          "hcr200-09": "Rashone Stevenson"
        }
      },
      hcr101: {
        name: "HCR101 Night",
        roster: {
          "hcr101-01": "Iyanna Austin",
          "hcr101-02": "Samir Austin",
          "hcr101-03": "Aidan Buckley",
          "hcr101-04": "Janelies Casiano",
          "hcr101-05": "Christopher Colon",
          "hcr101-06": "Travis Crosby",
          "hcr101-07": "Anthony Deleon",
          "hcr101-08": "Isaiah Gallashaw",
          "hcr101-09": "Amiir Griffin",
          "hcr101-10": "Hyzear Henry",
          "hcr101-11": "Michael Hillian",
          "hcr101-12": "Javian McKnight",
          "hcr101-13": "Tycorie McKnight",
          "hcr101-14": "Andrew Melnyk",
          "hcr101-15": "Angel Pena-Perez",
          "hcr101-16": "Vincent Perkins",
          "hcr101-17": "Chaz Sterling Jr",
          "hcr101-18": "Izale Thomas",
          "hcr101-19": "Corey Worthy",
          "hcr101-20": "Zackary Wynne"
        }
      }
    };

    function releaseCam() {
      if (scanTimer) clearInterval(scanTimer);
      scanTimer = null;
      if (scanStream) {
        scanStream.getTracks().forEach(function (t) { try { t.stop(); } catch (e) {} });
        scanStream = null;
      }
    }
    function stopScan() {
      gScanning = false;
      releaseCam();
    }
    function customClasses() {
      try { return JSON.parse(localStorage.getItem("customClasses") || "{}"); }
      catch (e) { return {}; }
    }
    function saveCustomMap(map) {
      localStorage.setItem("customClasses", JSON.stringify(map));
    }
    function gradeMeta(id) {
      if (GRADE_BUILTIN[id]) return GRADE_BUILTIN[id];
      var c = customClasses()[id];
      if (!c) return null;
      return { name: c.name || "Class", roster: c.roster || {} };
    }
    function gradeRoster(id) {
      var m = gradeMeta(id);
      return (m && m.roster) || {};
    }
    function gradeDay() {
      return new Date().toISOString().slice(0, 10);
    }
    function gradeKey() {
      return "grades_" + gClass + "_" + gradeDay();
    }
    function loadGradeLog() {
      try { return JSON.parse(localStorage.getItem(gradeKey()) || "[]"); }
      catch (e) { return []; }
    }

    function paint() {
      releaseCam();
      try {
        if (tab === "materials" && !campusMats()) tab = "today";
        if (viewSheet) return paintSheet(viewSheet);
        if (viewLab) return paintLab(viewLab);
        if (tab === "today") paintToday();
        else if (tab === "sheets") paintList("sheets");
        else if (tab === "labs") paintList("labs");
        else if (tab === "epa") paintEpa();
        else if (tab === "film") paintFilm();
        else if (tab === "gauges") paintGauges();
        else if (tab === "course") paintCourse();
        else if (tab === "trainers" && opts && opts.desk) paintTrainers();
        else if (tab === "class") paintClass();
        else if (tab === "extra") paintExtra();
        else if (tab === "materials") paintMaterials();
        else if (tab === "grades" && opts && opts.desk) paintGrades();
      } catch (err) {
        if (!host) return;
        host.innerHTML = "<div class='ss-shell'><p>Shop School hit a snag. The desk is still here.</p><p class='ss-fine'>" + esc(err && err.message) + "</p><button type='button' class='btn' id='ss-hub'>Shop floor</button></div>";
        var back = host.querySelector("#ss-hub");
        if (back) back.onclick = function () { try { if (onHub) onHub(); } catch (e) {} };
      }
    }

    function chrome(title, extra) {
      var inst = isInstructor();
      return (
        '<div class="ss-shell">' +
        '<header class="ss-head">' +
        '<button type="button" class="btn" id="ss-hub">' + ((opts && opts.hubLabel) || "Shop floor") + "</button>" +
        '<button type="button" class="btn" id="ss-hear">Hear HUB</button>' +
        (opts && opts.desk ? '<button type="button" class="btn" id="ss-pass">Password</button><button type="button" class="btn" id="ss-logout">Log out</button>' : "") +
        '<audio id="ss-hub-voice" preload="none" src="hub-desk.mp3?v=1"></audio>' +
        "<h2>" + (title === "Shop School" ? "Instructor desk" : title) + "</h2>" +
        "<p class='ss-fine'>" + ((global.LtBrand && global.LtBrand.title) || "HVAC Allstars") + "</p>" +
        '<label class="ss-toggle"><input type="checkbox" id="ss-inst"' +
        (inst ? " checked" : "") +
        "/> Show keys and class</label></header>" +
        '<nav class="ss-tabs" id="ss-tabs">' +
        (opts && opts.desk ? btn("grades", "Grade scanner") : "") +
        btn("today", "Today") +
        btn("sheets", "Sheets") +
        btn("labs", "Labs") +
        btn("epa", "EPA 608") +
        btn("film", "Film") +
        btn("gauges", "Gauges") +
        btn("course", "Course") +
        (opts && opts.desk ? btn("trainers", "Trainers") : "") +
        (opts && opts.desk ? btn("materials", "Materials used") : (inst && campusMats() ? btn("materials", "Materials used") : "")) +
        (opts && opts.desk ? btn("extra", "Extra labs") : "") +
        (inst ? btn("class", "Class") : "") +
        "</nav>" +
        (extra || "")
      );
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
    function bindChrome() {
      var hub = host.querySelector("#ss-hub");
      if (hub) hub.onclick = function () { if (onHub) onHub(); };
      var hear = host.querySelector("#ss-hear");
      if (hear) hear.onclick = function () {
        var a = host.querySelector("#ss-hub-voice");
        var chip = host.querySelector(".hub-chip p");
        var line = chip ? chip.textContent.replace(/\s+/g, " ").trim() : "";
        if (!line) line = "Set the Canvas day for this class. Then open today's lab. The answer key stays on this desk.";
        function speak() {
          if (!global.speechSynthesis) return;
          global.speechSynthesis.cancel();
          var u = new SpeechSynthesisUtterance(line);
          u.rate = 0.96;
          global.speechSynthesis.speak(u);
        }
        if (!a) { speak(); return; }
        a.onerror = speak;
        var played = a.play();
        if (played && played.catch) played.catch(speak);
      };
      var passBtn = host.querySelector("#ss-pass");
      if (passBtn) passBtn.onclick = function () { if (global.LtDesk) global.LtDesk.change(); };
      var outBtn = host.querySelector("#ss-logout");
      if (outBtn) outBtn.onclick = function () { if (global.LtDesk) global.LtDesk.logout(); };
      var inst = host.querySelector("#ss-inst");
      if (inst) {
        inst.onchange = function () {
          setInstructor(inst.checked);
          if (tab === "class" && !inst.checked) tab = "today";
          if (tab === "materials" && !inst.checked && !(opts && opts.desk)) tab = "today";
          if (tab === "extra" && !(opts && opts.desk)) tab = "today";
          if (tab === "trainers" && !(opts && opts.desk)) tab = "today";
          paint();
        };
      }
      var tabs = host.querySelector("#ss-tabs");
      if (tabs) {
        tabs.onclick = function (e) {
          var b = e.target.closest("[data-tab]");
          if (!b) return;
          tab = b.getAttribute("data-tab");
          viewSheet = null;
          viewLab = null;
          paint();
        };
      }
    }

    function dayBoardHtml() {
      var c = activeCls();
      var co = courseOf(c.course);
      var n = clampDay(c);
      var beat = beatOf(c.course, n);
      var s = migrate(load());
      var opts = COURSES()
        .map(function (x) {
          return (
            '<option value="' +
            x.id +
            '"' +
            (x.id === c.course ? " selected" : "") +
            ">" +
            x.label +
            " · " +
            x.days +
            " days</option>"
          );
        })
        .join("");
      var classOpts = s.classes
        .map(function (x) {
          var xc = courseOf(x.course);
          return (
            '<option value="' +
            x.id +
            '"' +
            (x.id === s.active ? " selected" : "") +
            ">" +
            (x.name || "Class") +
            " · Day " +
            clampDay(x) +
            "/" +
            xc.days +
            "</option>"
          );
        })
        .join("");
      return (
        '<div class="ss-day" id="ss-day">' +
        "<p class='eyebrow'>Canvas day · each class keeps its own number</p>" +
        '<div class="ss-day-row">' +
        '<label>Class<select id="ss-class">' +
        classOpts +
        "</select></label>" +
        '<button type="button" class="btn" id="ss-class-add">New class</button>' +
        (s.classes.length > 1 ? '<button type="button" class="btn" id="ss-class-del">Remove class</button>' : "") +
        "</div>" +
        '<div class="ss-day-row">' +
        '<label>Module<select id="ss-course">' +
        opts +
        "</select></label></div>" +
        '<div class="ss-day-num">' +
        '<button type="button" class="btn" id="ss-day-minus" aria-label="Back one day">−</button>' +
        '<input id="ss-day-n" type="number" min="1" max="' +
        co.days +
        '" value="' +
        n +
        '" inputmode="numeric"/>' +
        '<button type="button" class="btn" id="ss-day-plus" aria-label="Forward one day">+</button>' +
        "<span>of " +
        co.days +
        "</span></div>" +
        '<label class="ss-day-canvas">Canvas heading (paste what the module says today)' +
        '<input id="ss-canvas" maxlength="80" placeholder="Day ' +
        n +
        " — " +
        beat.title +
        '" value="' +
        esc(c.canvas) +
        '"/></label>' +
        "<p class='ss-day-beat'><strong>Day " +
        n +
        " · " +
        beat.title +
        "</strong> — trainer door: " +
        beat.lab +
        ". Correct the number if you skipped a snow day or doubled a lab. Canvas is day-by-day — this number is the source of truth for this class.</p>" +
        '<div class="ss-actions">' +
        '<button type="button" class="btn primary" id="ss-day-lab">Open today\'s lab</button>' +
        (beat.sheet ? '<button type="button" class="btn" id="ss-day-sheet">Today\'s sheet</button>' : "") +
        "</div></div>"
      );
    }
    function bindDayBoard() {
      var s = migrate(load());
      var clsSel = host.querySelector("#ss-class");
      if (clsSel) {
        clsSel.onchange = function () {
          s = migrate(load());
          s.active = clsSel.value;
          save(s);
          paint();
        };
      }
      var add = host.querySelector("#ss-class-add");
      if (add) {
        add.onclick = function () {
          var name = window.prompt("Class name (AM HVAC, Section 2, Saturday…)", "");
          if (!name) return;
          s = migrate(load());
          var id = "c" + Date.now().toString(36);
          s.classes.push({
            id: id,
            name: String(name).trim().slice(0, 32),
            course: "elec",
            day: 1,
            canvas: "",
            plan: "",
            roster: [],
            roll: {},
          });
          s.active = id;
          save(s);
          paint();
        };
      }
      var del = host.querySelector("#ss-class-del");
      if (del) {
        del.onclick = function () {
          s = migrate(load());
          if (s.classes.length < 2) return;
          s.classes = s.classes.filter(function (x) { return x.id !== s.active; });
          s.active = s.classes[0].id;
          save(s);
          paint();
        };
      }
      var course = host.querySelector("#ss-course");
      if (course) {
        course.onchange = function () {
          var c = saveCls({ course: course.value });
          var co = courseOf(c.course);
          if (c.day > co.days) saveCls({ day: co.days });
          paint();
        };
      }
      function nudge(d) {
        var c = activeCls();
        var co = courseOf(c.course);
        var n = Math.max(1, Math.min(co.days, (Number(c.day) || 1) + d));
        saveCls({ day: n });
        setTimeout(paint, 0);
      }
      var minus = host.querySelector("#ss-day-minus");
      var plus = host.querySelector("#ss-day-plus");
      var inp = host.querySelector("#ss-day-n");
      if (minus) minus.onclick = function () { nudge(-1); };
      if (plus) plus.onclick = function () { nudge(1); };
      if (inp) {
        inp.onchange = function () {
          var c = activeCls();
          var co = courseOf(c.course);
          var n = Math.max(1, Math.min(co.days, parseInt(inp.value, 10) || 1));
          saveCls({ day: n });
          setTimeout(paint, 0);
        };
      }
      var canvas = host.querySelector("#ss-canvas");
      if (canvas) {
        canvas.onchange = function () {
          saveCls({ canvas: (canvas.value || "").slice(0, 80) });
        };
      }
      var labBtn = host.querySelector("#ss-day-lab");
      if (labBtn) {
        labBtn.onclick = function () {
          var c = activeCls();
          var beat = beatOf(c.course, clampDay(c));
          goMode(beat.lab);
        };
      }
      var shBtn = host.querySelector("#ss-day-sheet");
      if (shBtn) {
        shBtn.onclick = function () {
          var c = activeCls();
          var beat = beatOf(c.course, clampDay(c));
          var sh = SHEETS.find(function (x) { return x.id === beat.sheet; });
          if (sh) {
            viewSheet = sh;
            paint();
          }
        };
      }
    }

    function paintToday() {
      var inst = isInstructor();
      var c = activeCls();
      var co = courseOf(c.course);
      var n = clampDay(c);
      var beat = beatOf(c.course, n);
      host.innerHTML =
        chrome("Shop School") +
        '<div class="ss-body">' +
        '<div class="hub-chip" style="max-width:none;margin:0 0 14px">' +
        '<img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo"/>' +
        "<div><strong>Professor HUB</strong><p>" +
        (inst
          ? "Canvas is day-by-day. Correct the number for this class. Snow day? Don't bump it. Doubled a lab? Jump two."
          : "Print the sheet. Run the lab. Sit 608 when the table is in your sleep. I will not hand you the live federal form.") +
        "</p></div></div>" +
        (opts && opts.desk
          ? '<button type="button" class="btn primary" id="ss-grade-scan">Grade scanner</button>'
          : "") +
        (inst ? dayBoardHtml() : "") +
        (inst
          ? "<p class='eyebrow'>" +
            (c.name || "Class") +
            " · Day " +
            n +
            "/" +
            co.days +
            " · " +
            beat.title +
            (c.canvas ? " · " + c.canvas : "") +
            "</p>"
          : "<p class='eyebrow'>Today · pick a module</p>") +
        (inst && global.LtCache ? global.LtCache.html() : "") +
        '<div class="ss-mods">' +
        MODS.map(function (m) {
          return (
            '<button type="button" class="ss-mod" data-mod="' +
            m.id +
            '"><strong>' +
            m.name +
            "</strong> <span>Sheets + labs</span></button>"
          );
        }).join("") +
        "</div>" +
        "<p class='ss-fine'>Students get the trainer and a blank sheet. Flip Instructor desk for the Canvas day, the roster, and the answer key. No fake roster.</p>" +
        "</div></div>";
      bindChrome();
      if (inst && global.LtCache) global.LtCache.mount(host);
      if (inst) bindDayBoard();
      var openScan = host.querySelector("#ss-grade-scan");
      if (openScan) openScan.onclick = function () { tab = "grades"; paint(); };
      host.querySelectorAll("[data-mod]").forEach(function (b) {
        b.onclick = function () {
          tab = "sheets";
          paint();
          var id = b.getAttribute("data-mod");
          var first = SHEETS.find(function (s) { return s.mod === id; });
          if (first) {
            viewSheet = first;
            paint();
          }
        };
      });
    }

    function paintList(kind) {
      var items = kind === "labs" ? LABS : SHEETS;
      host.innerHTML =
        chrome(kind === "labs" ? "Labs" : "Sheets") +
        '<div class="ss-body"><ul class="ss-list">' +
        items
          .map(function (it) {
            return (
              "<li><button type='button' class='ss-row' data-id='" +
              it.id +
              "'><strong>" +
              it.title +
              "</strong><span>" +
              modName(it.mod) +
              (it.kind ? " · " + it.kind : "") +
              "</span></button></li>"
            );
          })
          .join("") +
        "</ul></div></div>";
      bindChrome();
      host.querySelectorAll("[data-id]").forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute("data-id");
          if (kind === "labs") viewLab = LABS.find(function (x) { return x.id === id; });
          else viewSheet = SHEETS.find(function (x) { return x.id === id; });
          paint();
        };
      });
    }

    function paintSheet(sh) {
      var inst = isInstructor();
      if (!inst) showKey = false;
      host.innerHTML =
        chrome("Sheet") +
        '<div class="ss-body ss-doc">' +
        "<p class='eyebrow'>" +
        modName(sh.mod) +
        " · " +
        sh.kind +
        "</p><h3>" +
        sh.title +
        "</h3>" +
        '<div class="ss-paper">' +
        sh.student +
        "</div>" +
        (inst && showKey ? '<div class="ss-key"><p class="eyebrow">Instructor key</p>' + sh.key + "</div>" : "") +
        '<div class="ss-actions">' +
        '<button type="button" class="btn" id="ss-back">All sheets</button>' +
        (inst
          ? '<button type="button" class="btn" id="ss-key">' + (showKey ? "Hide key" : "Show key") + "</button>" +
            '<button type="button" class="btn primary" id="ss-print-k">Print student + key</button>'
          : "") +
        '<button type="button" class="btn' + (inst ? "" : " primary") + '" id="ss-print-s">Print student copy</button>' +
        "</div></div></div>";
      bindChrome();
      var _ssN = host.querySelector("#ss-back"); if (_ssN) _ssN.onclick = function () {
        viewSheet = null;
        tab = "sheets";
        paint();
      };
      var keyBtn = host.querySelector("#ss-key");
      if (keyBtn) keyBtn.onclick = function () {
        showKey = !showKey;
        paint();
      };
      var _ssN = host.querySelector("#ss-print-s"); if (_ssN) _ssN.onclick = function () { printBlock(sheetHtml(sh, false)); };
      var printK = host.querySelector("#ss-print-k");
      if (printK) printK.onclick = function () { printBlock(sheetHtml(sh, true)); };
    }

    function paintLab(lab) {
      host.innerHTML =
        chrome("Lab") +
        '<div class="ss-body ss-doc">' +
        "<h3>" +
        lab.title +
        "</h3><p><strong>Safety.</strong> " +
        lab.safety +
        "</p><ol>" +
        lab.procedure.map(function (p) { return "<li>" + p + "</li>"; }).join("") +
        "</ol><p class='eyebrow'>Data table · print it</p>" +
        "<p>" +
        lab.sign +
        "</p>" +
        matCard(lab) +
        '<div class="ss-actions">' +
        '<button type="button" class="btn" id="ss-back">All labs</button>' +
        '<button type="button" class="btn primary" id="ss-print-l">Print lab packet</button>' +
        "</div></div></div>";
      bindChrome();
      bindMatCards();
      var _ssN = host.querySelector("#ss-back"); if (_ssN) _ssN.onclick = function () {
        viewLab = null;
        tab = "labs";
        paint();
      };
      var _ssN = host.querySelector("#ss-print-l"); if (_ssN) _ssN.onclick = function () { printBlock(labHtml(lab)); };
    }

    function paintEpa() {
      host.innerHTML =
        chrome("EPA 608 desk") +
        '<div class="ss-body">' +
        "<p>Closed-book: 25 questions a section, typically <strong>18/25 (72%)</strong> to pass. Universal = 100. Each section scored alone. Type II is the HVAC floor. Card does not expire. Core must be proctored for Universal. <strong>609 is cars.</strong> No Type IV for A2Ls — they live inside Core/II.</p>" +
        "<p>Recovery table = legal minimum (in. Hg vs machine date). Service work still pulls to microns.</p>" +
        "<h3>608 labs — finish the call</h3>" +
        "<p>Four shop labs, then the 80% drill. A wrong call does not advance. Not the live exam bank.</p>" +
        '<div class="ss-actions">' +
        '<a class="btn" href="' + studentHome() + '?play=1&sku=campus&lab=e608type">Which card</a>' +
        '<a class="btn" href="' + studentHome() + '?play=1&sku=campus&lab=e608vac">How empty</a>' +
        '<a class="btn" href="' + studentHome() + '?play=1&sku=campus&lab=e608cyl">Cylinder</a>' +
        '<a class="btn" href="' + studentHome() + '?play=1&sku=campus&lab=e608rrr">Three R\'s</a>' +
        "</div>" +
        (isInstructor()
          ? "<table class='ss-table'><tr><th>Lab</th><th>Right call</th></tr>" +
            "<tr><td>Which card</td><td>Window unit Type I. Split Type II. R-123 chiller Type III. 6 lb walk-in is still Type II.</td></tr>" +
            "<tr><td>How empty</td><td>House 410A: 0 in. Hg (0 psig). 250 lb R-22: 10 in. Hg. Running window: 90% or 4 in. Chiller: 25 mm Hg absolute.</td></tr>" +
            "<tr><td>Cylinder</td><td>80% by weight. Gray body, yellow top. Do not mix. Do not refill a disposable. Leak check with dry nitrogen.</td></tr>" +
            "<tr><td>Three R's</td><td>Pull it = recover. Truck drier, same owner = recycle. AHRI 700 = reclaim. A different customer needs reclaim.</td></tr>" +
            "</table>"
          : "") +
        '<div class="ss-actions">' +
        '<button type="button" class="btn primary" id="ss-tutor">Open 608 tutor + pass guide</button>' +
        '<button type="button" class="btn" id="ss-exam">All-Star 608 pack (study)</button>' +
        '<button type="button" class="btn" id="ss-print-q">' +
        (isInstructor() ? "Print Type II quiz + key" : "Print Type II quiz") +
        "</button>" +
        '<button type="button" class="btn" id="ss-print-g">Print 608 study guide</button>' +
        "</div>" +
        "<h3>Employment Ready — the three exams this site can seat</h3>" +
        "<p>Proctor screen: <strong>HVAC Excellence Employment Ready / Low GWP / A3</strong>. 3 variants, 35 credits in the bucket when that screen was shot. Seats move. Check escotesting before you promise a class. Pass is <strong>70%</strong>. That is a certificate of achievement for students, not the technician-level exam, and not Section 608.</p>" +
        "<ol class='ss-list'>" +
        "<li><strong>Basic Refrigeration & Charging Procedures</strong> — 50 questions. 11 credits on that screen. Theory, systems and components, air supply, troubleshooting, special components, system charging.</li>" +
        "<li><strong>Electrical Employment Ready</strong> — 100 questions. 12 credits. Components, meter use, safety, theory, troubleshooting, motors and capacitors, reading diagrams.</li>" +
        "<li><strong>Heat Pump ER Exam 2024</strong> — the published Heat Pumps Employment Ready is 100 questions: components, controls, the heat-pump cycle, service, theory, troubleshooting, schematics. This button sits in the Low GWP / A3 bucket, so it is the 2024 form, not an R-22-only test. 12 credits.</li>" +
        "</ol>" +
        "<p>Create Session is the room. Create Remote is off-site. Test Now opens that variant. A2L (R-32, R-454B) is mildly flammable. A3 (propane class) is flammable. Do not treat them as the same refrigerant.</p>" +
        '<div class="ss-actions">' +
        '<button type="button" class="btn" id="ss-g-ref">Charging study guide</button>' +
        '<button type="button" class="btn" id="ss-g-el">Electrical study guide</button>' +
        '<button type="button" class="btn" id="ss-g-hp">Heat pump study guide</button>' +
        '<button type="button" class="btn" id="ss-print-er">Print all three guides</button>' +
        "</div>" +
        "<h3>EPA 608 bank — different product</h3>" +
        "<p><strong>10th-edition practice = 2026 exam bank.</strong> 9th edition EN/ES is the older bank. After 1 Jan 2027 that old bank is dead. We link out. We do not copy ESCO items or the live federal form.</p>" +
        '<p><a class="btn primary" href="https://www.escogroup.org/certifications/employmentready.aspx" target="_blank" rel="noopener">Employment Ready topics</a> ' +
        '<a class="btn" href="https://www.escogroup.org/practice" target="_blank" rel="noopener">608 practice hub</a> ' +
        '<a class="btn" href="https://www.epa.gov/section608" target="_blank" rel="noopener">EPA Section 608</a></p>' +
        "<p class='ss-fine'>Drills in this app are original shop questions from published topics. Labeled study. Not the live ESCO form.</p>" +
        "</div></div>";
      bindChrome();
      var _ssN = host.querySelector("#ss-tutor"); if (_ssN) _ssN.onclick = function () {
        goMode("epa608");
      };
      var _ssN = host.querySelector("#ss-exam"); if (_ssN) _ssN.onclick = function () {
        goMode("quiz");
      };
      var _ssN = host.querySelector("#ss-print-q"); if (_ssN) _ssN.onclick = function () {
        var sh = SHEETS.find(function (s) { return s.id === "s-rec"; });
        printBlock(sheetHtml(sh, isInstructor()));
      };
      function guide(id) {
        return SHEETS.find(function (s) { return s.id === id; });
      }
      var _ssN = host.querySelector("#ss-g-ref"); if (_ssN) _ssN.onclick = function () { viewSheet = guide("s-er-ref"); paint(); };
      var _ssN = host.querySelector("#ss-g-el"); if (_ssN) _ssN.onclick = function () { viewSheet = guide("s-er-elec"); paint(); };
      var _ssN = host.querySelector("#ss-g-hp"); if (_ssN) _ssN.onclick = function () { viewSheet = guide("s-er-hp"); paint(); };
      var _ssN = host.querySelector("#ss-print-er"); if (_ssN) _ssN.onclick = function () {
        var withKey = isInstructor();
        printBlock(["s-er-ref", "s-er-elec", "s-er-hp"].map(function (id) {
          return sheetHtml(guide(id), withKey);
        }).join(""));
      };
      var _ssN = host.querySelector("#ss-print-g"); if (_ssN) _ssN.onclick = function () {
        var sh = SHEETS.find(function (s) { return s.id === "s-epa"; });
        printBlock(sheetHtml(sh, isInstructor()));
      };
    }

    function paintFilm() {
      host.innerHTML =
        chrome("Film") +
        '<div class="ss-body"><p>These open the live sim — that is the film. Print the exit ticket when they walk out.</p><ul class="ss-list">' +
        FILMS.map(function (f) {
          return (
            "<li><button type='button' class='ss-row' data-film='" +
            f.id +
            "'><strong>" +
            f.title +
            "</strong><span>Play · then print ticket</span></button></li>"
          );
        }).join("") +
        "</ul></div></div>";
      bindChrome();
      host.querySelectorAll("[data-film]").forEach(function (b) {
        b.onclick = function () {
          var f = FILMS.find(function (x) { return x.id === b.getAttribute("data-film"); });
          if (!f) return;
          printBlock(
            "<div class='page'><h1>Exit ticket</h1><p>" +
              f.title +
              "</p><p>" +
              f.ticket +
              "</p><p>Name _____________  Answer:</p><p style='height:120px;border:1px solid #333'></p></div>"
          );
          goMode(f.mode);
        };
      });
    }

    function paintTrainers() {
      host.innerHTML = chrome("Trainers") + '<div class="ss-body" id="it-host"></div></div>';
      bindChrome();
      if (global.IConnectTeach) global.IConnectTeach.mount(host.querySelector("#it-host"));
    }

    function paintGauges() {
      host.innerHTML =
        chrome("Gauges") +
        '<div class="ss-body"><p>Blue suction. Red liquid. Yellow utility. SH = suction temp − evap sat (dew on a blend). SC = cond sat (start of boiling) − liquid temp.</p>' +
        '<button type="button" class="btn primary" id="ss-go-g">Open manifold school</button> ' +
        '<button type="button" class="btn" id="ss-go-pt">P/T chart</button> ' +
        '<button type="button" class="btn" id="ss-go-sb">Sandbox</button>' +
        "</div></div>";
      bindChrome();
      var _ssN = host.querySelector("#ss-go-g"); if (_ssN) _ssN.onclick = function () { goMode("gauges"); };
      var _ssN = host.querySelector("#ss-go-pt"); if (_ssN) _ssN.onclick = function () { goMode("ptchart"); };
      var _ssN = host.querySelector("#ss-go-sb"); if (_ssN) _ssN.onclick = function () { goMode("sandbox"); };
    }

    function paintCourse() {
      host.innerHTML = chrome("Course") + '<div class="ss-body">' + courseHtml() + "</div></div>";
      bindChrome();
      var go = host.querySelector("#ss-open-course");
      if (go) go.onclick = function (e) {
        if (e && e.preventDefault) e.preventDefault();
        goMode("curriculum");
      };
      host.querySelectorAll("[data-course-lab]").forEach(function (b) {
        b.onclick = function () {
          var mode = b.getAttribute("data-course-lab");
          goMode(mode);
        };
      });
    }

    var matPick = { lab: "l-rec", stations: 1, students: 1 };
    var ROLLS = [
      { id: "cu14", label: '1/4" copper', ft: 25, kind: "copper", size: "1/4" },
      { id: "cu38", label: '3/8" copper', ft: 25, kind: "copper", size: "3/8" },
      { id: "cu12", label: '1/2" copper', ft: 25, kind: "copper", size: "1/2" },
      { id: "cu58", label: '5/8" copper', ft: 25, kind: "copper", size: "5/8" },
      { id: "cu34", label: '3/4" copper', ft: 25, kind: "copper", size: "3/4" },
      { id: "cu78", label: '7/8" copper', ft: 25, kind: "copper", size: "7/8" },
      { id: "tape", label: "Electrical tape", ft: 66, kind: "tape" },
      { id: "cork", label: "Cork tape", ft: 30, kind: "cork" },
      { id: "blk", label: "#10 black", ft: 50, kind: "blk" },
      { id: "red", label: "#10 red", ft: 50, kind: "red" },
      { id: "grn", label: "#10 green", ft: 50, kind: "grn" },
      { id: "stat", label: "Control cable", ft: 250, kind: "stat" },
      { id: "nm142", label: "14/2 Romex", ft: 100, kind: "romex", size: "14/2" },
      { id: "nm122", label: "12/2 Romex", ft: 100, kind: "romex", size: "12/2" },
      { id: "nm123", label: "12/3 Romex", ft: 100, kind: "romex", size: "12/3" },
      { id: "nm102", label: "10/2 Romex", ft: 100, kind: "romex", size: "10/2" },
      { id: "nm103", label: "10/3 Romex", ft: 100, kind: "romex", size: "10/3" },
    ];

    function matRows() {
      try {
        var raw = JSON.parse(localStorage.getItem("lt-mat-used-v1") || "[]");
        return Array.isArray(raw) ? raw : [];
      } catch (e) {
        return [];
      }
    }

    function stockGet() {
      try {
        var s = JSON.parse(localStorage.getItem("lt-mat-stock-v1") || "{}");
        var rolls = Object.assign({}, s.rolls || {});
        if (rolls.cu12 == null && s.copperRolls != null) rolls.cu12 = Number(s.copperRolls) || 0;
        var out = {};
        ROLLS.forEach(function (r) { out[r.id] = Number(rolls[r.id]) || 0; });
        return {
          rolls: out,
          rods: Number(s.rods) || 0,
          nitrogen: Number(s.nitrogen) || 0,
          ref410: Number(s.ref410) || 0,
          driers: Number(s.driers) || 0,
          insul: Number(s.insul) || 0,
          nut38: Number(s.nut38) || 0,
          cap38: Number(s.cap38) || 0,
          coup38: Number(s.coup38) || 0,
          cont: Number(s.cont) || 0,
          relay: Number(s.relay) || 0,
          ledBlue: Number(s.ledBlue) || 0,
          ledRed: Number(s.ledRed) || 0,
          socket: Number(s.socket) || 0,
        };
      } catch (e) {
        var empty = {};
        ROLLS.forEach(function (r) { empty[r.id] = 0; });
        return { rolls: empty, rods: 0, nitrogen: 0, ref410: 0, driers: 0, insul: 0, nut38: 0, cap38: 0, coup38: 0, cont: 0, relay: 0, ledBlue: 0, ledRed: 0, socket: 0 };
      }
    }

    function burnRate() {
      var rows = matRows();
      var used = { rods: 0, nitrogen: 0, ref: 0, driers: 0, insul: 0, nut38: 0, cap38: 0, coup38: 0, cont: 0, relay: 0, ledBlue: 0, ledRed: 0, socket: 0 };
      var rollFt = {};
      ROLLS.forEach(function (spec) { rollFt[spec.id] = 0; });
      var dates = [];
      rows.forEach(function (r) {
        used.rods += Number(r.rods) || 0;
        used.nitrogen += Number(r.nitrogen) || 0;
        if (r.ref === "R-410A") used.ref += Number(r.refLb) || 0;
        used.driers += Number(r.driers) || 0;
        used.insul += Number(r.insul) || 0;
        used.nut38 += Number(r.nut38) || 0;
        used.cap38 += Number(r.cap38) || 0;
        used.coup38 += Number(r.coup38) || 0;
        used.cont += Number(r.cont) || 0;
        used.relay += Number(r.relay) || 0;
        used.ledBlue += Number(r.ledBlue) || 0;
        used.ledRed += Number(r.ledRed) || 0;
        used.socket += Number(r.socket) || 0;
        var size = r.size || "1/2";
        ROLLS.forEach(function (spec) {
          if (spec.kind === "copper") {
            if (size === spec.size) rollFt[spec.id] += Number(r.copper) || 0;
          } else if (spec.kind === "romex") {
            if ((r.romexSize || "12/2") === spec.size) rollFt[spec.id] += Number(r.romex) || 0;
          } else rollFt[spec.id] += Number(r[spec.kind]) || 0;
        });
        if (r.date) dates.push(r.date);
      });
      dates.sort();
      var days = 1;
      if (dates.length >= 2) {
        var span = (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 86400000;
        days = Math.max(1, Math.round(span) || 1);
      }
      return { used: used, rolls: rollFt, days: days, n: rows.length };
    }

    function rollLine(spec, usedFt, rolls, n, days) {
      var fmt = function (x) { return (Math.round(x * 10) / 10).toString(); };
      var shelfFt = rolls * spec.ft;
      if (!usedFt && !rolls) return "<li><b>" + spec.label + "</b> · no use logged, shelf empty · " + spec.ft + " ft roll</li>";
      var perLab = n ? usedFt / n : 0;
      var perWeek = days ? (usedFt / days) * 7 : 0;
      var labsLeft = perLab > 0 && shelfFt > 0 ? Math.floor(shelfFt / perLab) : null;
      var weeksLeft = perWeek > 0 && shelfFt > 0 ? shelfFt / perWeek : null;
      return (
        "<li><b>" + spec.label + "</b> · used " + fmt(usedFt) + " ft (" + fmt(usedFt / spec.ft) + " of a " + spec.ft + " ft roll)" +
        " · " + fmt(perLab) + " ft/lab · shelf " + fmt(rolls) + (Number(rolls) === 1 ? " roll" : " rolls") +
        " (" + shelfFt + " ft)" +
        (labsLeft === null ? "" : " · about " + labsLeft + " labs left") +
        (weeksLeft === null ? "" : " · about " + fmt(weeksLeft) + " weeks") +
        (shelfFt > 0 && labsLeft !== null && labsLeft < 2 ? " · order 1 roll (" + spec.ft + " ft)" : "") +
        "</li>"
      );
    }

    function rateLine(name, unit, used, shelf, n, days) {
      var fmt = function (x) { return (Math.round(x * 10) / 10).toString(); };
      if (!used && !shelf) return "<li><b>" + name + "</b> · no use logged, shelf empty</li>";
      var perLab = n ? used / n : 0;
      var perWeek = days ? (used / days) * 7 : 0;
      var labsLeft = perLab > 0 && shelf > 0 ? Math.floor(shelf / perLab) : null;
      var weeksLeft = perWeek > 0 && shelf > 0 ? shelf / perWeek : null;
      return (
        "<li><b>" + name + "</b> · used " + fmt(used) + " " + unit +
        " · " + fmt(perLab) + " " + unit + "/lab · " + fmt(perWeek) + " " + unit + "/week" +
        " · shelf " + fmt(shelf) + " " + unit +
        (labsLeft === null ? "" : " · about " + labsLeft + " labs left") +
        (weeksLeft === null ? "" : " · about " + (Math.round(weeksLeft * 10) / 10) + " weeks") +
        (shelf > 0 && labsLeft !== null && labsLeft < 2 ? " · order it" : "") +
        "</li>"
      );
    }

    var LAB_FIELDS = {
      "l-rec": [
        { key: "nitrogen", label: "Nitrogen", unit: "cu ft" },
        { key: "driers", label: "Filter-driers", unit: "ea" },
      ],
      "l-lugs": [
        { key: "blk", label: "#10 black", unit: "ft", roll: 50 },
        { key: "red", label: "#10 red", unit: "ft", roll: 50 },
        { key: "grn", label: "#10 green", unit: "ft", roll: 50 },
        { key: "tape", label: "Electrical tape", unit: "ft", roll: 66 },
        { key: "romex", label: "Romex", unit: "ft", roll: 100, sizeKey: "romexSize", sizes: ["14/2", "12/2", "12/3", "10/2", "10/3"] },
      ],
      "l-flare": [
        { key: "copper", label: "Copper", unit: "ft", roll: 25, sizeKey: "size", sizes: ["1/4", "3/8", "1/2", "5/8", "3/4", "7/8"] },
        { key: "nut38", label: "3/8 flare nuts", unit: "ea" },
        { key: "cap38", label: "3/8 flare caps", unit: "ea" },
        { key: "coup38", label: "3/8 flare couplings", unit: "ea" },
        { key: "nitrogen", label: "Nitrogen", unit: "cu ft" },
        { key: "insul", label: "Insulation", unit: "ft" },
        { key: "cork", label: "Cork tape", unit: "ft", roll: 30 },
      ],
      "l-gauges": [
        { key: "refLb", label: "Refrigerant purged", unit: "lb" },
      ],
      "l-tu522": [
        { key: "cont", label: "Contactors", unit: "ea" },
        { key: "relay", label: "Fan relays", unit: "ea" },
        { key: "ledBlue", label: "Blue 40W LED", unit: "ea" },
        { key: "ledRed", label: "Red 40W LED", unit: "ea" },
        { key: "socket", label: "White sockets", unit: "ea" },
      ],
    };

    function labFields(id) {
      return LAB_FIELDS[id] || [];
    }

    function labLogs(lab) {
      return matRows().map(function (r, i) { return { row: r, i: i }; }).filter(function (x) {
        return x.row.labId === lab.id || x.row.lab === lab.title;
      });
    }

    function matCard(lab) {
      var fields = labFields(lab.id);
      var logs = labLogs(lab);
      var pack = MATS[lab.id];
      var heads = Math.max(1, Number(localStorage.getItem("lt-mat-heads") || "1") || 1);
      var perStudent = pack && pack.consumable.length
        ? "<p><strong>Per student</strong></p><ul class='ss-roster'>" + pack.consumable.map(function (c) {
            var unit = c[2] ? " " + c[2] : "";
            return "<li><b>" + c[1] + unit + "</b> " + c[0] + "</li>";
          }).join("") + "</ul>" +
          '<label>Students in this lab <input data-mat-heads type="number" min="1" step="1" value="' + heads + '"/></label>' +
          "<p><strong>This class · " + heads + (heads === 1 ? " student" : " students") + "</strong></p><ul class='ss-roster'>" +
          pack.consumable.map(function (c) {
            var qty = c[1] * heads;
            var unit = c[2] ? " " + c[2] : "";
            var shown = qty % 1 ? qty.toFixed(1) : String(qty);
            var roll = 0;
            var name = c[0];
            if (/cork/i.test(name)) roll = 30;
            else if (/tape/i.test(name)) roll = 66;
            else if (/copper/i.test(name)) roll = 25;
            else if (/Romex/i.test(name)) roll = 100;
            else if (/#10|black|red|green/i.test(name)) roll = 50;
            var buy = roll ? " · order " + Math.ceil(qty / roll) + " roll" + (Math.ceil(qty / roll) === 1 ? "" : "s") + " (" + roll + " ft)" : "";
            return "<li><b>" + shown + unit + "</b> " + name + buy + "</li>";
          }).join("") + "</ul>"
        : "<p>Nothing is used up. The trainer stays.</p>";
      var totals = {};
      logs.forEach(function (x) {
        fields.forEach(function (f) {
          var n = Number(x.row[f.key]) || 0;
          if (!n) return;
          var name = f.label;
          if (f.sizes) name += " " + (x.row[f.sizeKey] || f.sizes[0]);
          totals[name] = totals[name] || { n: 0, unit: f.unit, roll: f.roll || 0 };
          totals[name].n += n;
        });
      });
      var keys = Object.keys(totals);
      var tab = keys.length
        ? keys.map(function (name) {
            var t = totals[name];
            var shown = (Math.round(t.n * 10) / 10) + " " + t.unit;
            var roll = t.roll ? " · " + (Math.round((t.n / t.roll) * 10) / 10) + " of a " + t.roll + " ft roll" : "";
            return "<li><b>" + name + "</b> · " + shown + roll + "</li>";
          }).join("")
        : "<li>Nothing logged for this lab yet.</li>";
      var inputs = fields.map(function (f) {
        var id = "mf-" + lab.id + "-" + f.key;
        var size = "";
        if (f.sizes) {
          size = '<label>' + f.label + ' size <select id="' + id + '-size">' + f.sizes.map(function (s, i) {
            return "<option" + (i === 1 ? " selected" : "") + ">" + s + "</option>";
          }).join("") + "</select></label>";
        }
        return size + '<label>' + f.label + (f.unit ? ", " + f.unit : "") + ' <input id="' + id + '" type="number" min="0" step="1" value="0"/></label>';
      }).join("");
      var history = logs.length
        ? logs.map(function (x) {
            return "<li>" + (x.row.date || "") + " · " + fields.map(function (f) {
              var n = Number(x.row[f.key]) || 0;
              if (!n) return "";
              var name = f.label + (f.sizes ? " " + (x.row[f.sizeKey] || "") : "");
              return name + " " + n;
            }).filter(Boolean).join(", ") + " <button type='button' class='btn' data-mat-del='" + x.i + "'>Remove</button></li>";
          }).join("")
        : "";
      return (
        '<div class="card" data-mat-card="' + lab.id + '">' +
        "<h3>Materials · " + lab.title + "</h3>" +
        perStudent +
        "<p><strong>Running tab</strong> · " + logs.length + (logs.length === 1 ? " log" : " logs") + "</p>" +
        "<ul class='ss-roster'>" + tab + "</ul>" +
        (fields.length
          ? '<div class="ss-add" style="flex-wrap:wrap;gap:8px">' + inputs +
            '<button type="button" class="btn primary" data-mat-log="' + lab.id + '">Add to this lab</button></div>' +
            (history ? "<ul class='ss-roster'>" + history + "</ul>" : "")
          : "") +
        "</div>"
      );
    }

    function bindMatCards() {
      host.querySelectorAll("[data-mat-heads]").forEach(function (input) {
        input.onchange = function () {
          var n = Math.max(1, Number(input.value) || 1);
          localStorage.setItem("lt-mat-heads", String(n));
          paint();
        };
      });
      host.querySelectorAll("[data-mat-log]").forEach(function (btn) {
        btn.onclick = function () {
          var id = btn.getAttribute("data-mat-log");
          var lab = LABS.filter(function (l) { return l.id === id; })[0];
          if (!lab) return;
          var card = btn.closest("[data-mat-card]");
          var row = { labId: lab.id, lab: lab.title, date: new Date().toISOString().slice(0, 10) };
          var any = false;
          labFields(id).forEach(function (f) {
            var input = card.querySelector("#mf-" + id + "-" + f.key);
            var n = Number(input && input.value) || 0;
            row[f.key] = n;
            if (f.sizes) {
              var sel = card.querySelector("#mf-" + id + "-" + f.key + "-size");
              row[f.sizeKey] = sel ? sel.value : f.sizes[0];
            }
            if (n) any = true;
          });
          if (!any) return;
          localStorage.setItem("lt-mat-used-v1", JSON.stringify([row].concat(matRows()).slice(0, 80)));
          paint();
        };
      });
      host.querySelectorAll("[data-mat-del]").forEach(function (b) {
        b.onclick = function () {
          var next = matRows().slice();
          next.splice(+b.getAttribute("data-mat-del"), 1);
          localStorage.setItem("lt-mat-used-v1", JSON.stringify(next));
          paint();
        };
      });
    }

    function wearGet() {
      try {
        var w = JSON.parse(localStorage.getItem("lt-mat-wear-v1") || "{}");
        return w && typeof w === "object" ? w : {};
      } catch (e) {
        return {};
      }
    }
    function shelfOf(key) {
      if (!key) return 0;
      var s = stockGet();
      if (key === "nitrogen") return Number(s.nitrogen) || 0;
      if (key === "driers") return Number(s.driers) || 0;
      if (key === "ref410") return Number(s.ref410) || 0;
      if (key === "insul") return Number(s.insul) || 0;
      if (key === "nut38") return Number(s.nut38) || 0;
      if (key === "cap38") return Number(s.cap38) || 0;
      if (key === "coup38") return Number(s.coup38) || 0;
      var spec = ROLLS.filter(function (r) { return r.id === key; })[0];
      if (!spec) return 0;
      return (Number(s.rolls[spec.id]) || 0) * spec.ft;
    }
    function ariBuild(courseId, heads, throughDay) {
      var co = courseOf(courseId);
      var days = MOD_DAYS[courseId] || [];
      var bag = {};
      var shelfUsed = {};
      days.forEach(function (d) {
        if (d.day > throughDay) return;
        (d.use || []).forEach(function (u) {
          var k = u.item + "|" + (u.size || "") + "|" + u.unit;
          if (!bag[k]) bag[k] = { item: u.item, size: u.size || "", unit: u.unit, qty: 0, shelf: u.shelf || "", roll: u.roll || 0, mod: co.label || co.name };
          bag[k].qty += u.qty * heads;
        });
      });
      var buy = Object.keys(bag).map(function (k) {
        var row = bag[k];
        var shelf = 0;
        if (row.shelf && !shelfUsed[row.shelf]) {
          shelf = shelfOf(row.shelf);
          shelfUsed[row.shelf] = true;
        }
        var order = Math.max(0, Math.round((row.qty - shelf) * 10) / 10);
        return { item: row.item, size: row.size, qty: order, unit: row.unit, mod: row.mod, roll: row.roll, shelf: shelf };
      }).filter(function (r) { return r.qty > 0; });
      var wearOn = wearGet();
      var wear = [];
      days.forEach(function (d) {
        if (d.day > throughDay) return;
        (d.wear || []).forEach(function (w) {
          if (!wearOn[w.id]) return;
          if (wear.some(function (x) { return x.id === w.id; })) return;
          wear.push({ id: w.id, item: w.item, size: "", qty: 1, unit: "ea", mod: co.label || co.name });
        });
      });
      return { course: co, buy: buy, wear: wear, through: throughDay, heads: heads };
    }
    var CAMPUSES = [
      ["levittown", "Levittown, PA"],
      ["mahwah", "Mahwah, NJ"],
      ["union", "Union, NJ"],
      ["moorestown", "Moorestown, NJ"],
      ["eastwindsor", "East Windsor, CT"],
      ["newbritain", "New Britain, CT"],
      ["shelton", "Shelton, CT"],
      ["lincolnri", "Lincoln, RI"],
      ["columbia", "Columbia, MD"],
      ["indianapolis", "Indianapolis, IN"],
      ["melrose", "Melrose Park, IL"],
      ["denver", "Denver, CO"],
      ["nashville", "Nashville, TN"],
      ["houston", "Houston, TX"],
      ["grandprairie", "Grand Prairie, TX"],
      ["other", "Other shop"],
    ];
    function campusId() {
      var id = localStorage.getItem("lt-desk-campus") || "levittown";
      return CAMPUSES.some(function (c) { return c[0] === id; }) ? id : "levittown";
    }
    function campusLabel() {
      var id = campusId();
      var row = CAMPUSES.filter(function (c) { return c[0] === id; })[0];
      return row ? row[1] : "Levittown, PA";
    }
    function supplierBook() {
      var raw = localStorage.getItem("lt-suppliers-v1");
      if (raw == null) return {};
      try {
        var data = JSON.parse(raw);
        if (Array.isArray(data)) {
          var old = data.filter(function (s) { return s && s.name; });
          if (!old.some(function (s) { return s.id === "amazon"; })) old = old.concat(supplierSeed("levittown").filter(function (s) { return s.id === "amazon"; }));
          if (!old.some(function (s) { return s.id === "ari"; })) old = supplierSeed("levittown").filter(function (s) { return s.id === "ari"; }).concat(old);
          return { levittown: old };
        }
        return data && typeof data === "object" ? data : {};
      } catch (e) {
        return {};
      }
    }
    function supplierSeed(campus) {
      if (campus === "levittown") {
        return [
          { id: "ari", name: "Associate Refrigeration Inc.", email: "", phone: "", sells: "Refrigerant, copper, fittings" },
          { id: "amazon", name: "Amazon", email: "", phone: "", sells: "Tools and small parts" },
        ];
      }
      return [];
    }
    function cleanSup(s) {
      return {
        id: String(s.id || ""),
        name: String(s.name).slice(0, 60),
        email: String(s.email || "").slice(0, 80),
        phone: String(s.phone || "").slice(0, 24),
        sells: String(s.sells || "").slice(0, 80),
      };
    }
    function suppliersGet() {
      var campus = campusId();
      var book = supplierBook();
      if (!Object.prototype.hasOwnProperty.call(book, campus)) return supplierSeed(campus);
      var list = book[campus];
      if (!Array.isArray(list)) return supplierSeed(campus);
      return list.filter(function (s) { return s && s.name; }).map(cleanSup);
    }
    function suppliersSave(list) {
      var book = supplierBook();
      book[campusId()] = list;
      localStorage.setItem("lt-suppliers-v1", JSON.stringify(book));
    }
    function supplierPick() {
      var list = suppliersGet();
      var id = localStorage.getItem("lt-supplier-pick-" + campusId()) || "";
      return list.filter(function (s) { return s.id === id; })[0] || list[0] || { id: "", name: "the supplier", email: "", phone: "", sells: "" };
    }
    function suppliersHtml() {
      var list = suppliersGet();
      var pick = supplierPick();
      var campus = campusId();
      var options = CAMPUSES.map(function (c) {
        return "<option value='" + c[0] + "'" + (c[0] === campus ? " selected" : "") + ">" + esc(c[1]) + "</option>";
      }).join("");
      var rows = list.length
        ? list.map(function (s) {
            var on = s.id === pick.id;
            return "<li><label><input type='radio' name='ss-sup' data-sup-pick='" + esc(s.id) + "'" + (on ? " checked" : "") + "/> <b>" + esc(s.name) + "</b>" +
              (s.email ? " · " + esc(s.email) : "") +
              (s.phone ? " · " + esc(s.phone) : "") +
              (s.sells ? " · " + esc(s.sells) : "") +
              "</label> <button type='button' class='btn' data-sup-del='" + esc(s.id) + "'>Remove</button></li>";
          }).join("")
        : "<li>No suppliers yet. Add the houses this campus orders from.</li>";
      var note = campus === "levittown"
        ? "Levittown orders from ARI and Amazon. Select the one this email goes to. Add another house if the campus uses it."
        : "This campus starts empty. Add the houses it orders from. The email goes to the one you select.";
      return (
        '<div class="card" id="ss-suppliers">' +
        "<h3>Suppliers</h3>" +
        '<label>Campus <select id="ss-campus">' + options + "</select></label>" +
        "<p class='ss-fine'>" + note + "</p>" +
        "<ul class='ss-roster'>" + rows + "</ul>" +
        '<div class="ss-add" style="flex-wrap:wrap;gap:8px">' +
        '<label>Name <input id="ss-sup-name" maxlength="60" placeholder="Supply house"/></label>' +
        '<label>Email <input id="ss-sup-email" maxlength="80" placeholder="orders@"/></label>' +
        '<label>Phone <input id="ss-sup-phone" maxlength="24" placeholder="Phone"/></label>' +
        '<label>What they send <input id="ss-sup-sells" maxlength="80" placeholder="Wire, tape, fittings"/></label>' +
        '<button type="button" class="btn primary" id="ss-sup-add">Add supplier</button>' +
        "</div></div>"
      );
    }
    function bindSuppliers() {
      var campusSel = host.querySelector("#ss-campus");
      if (campusSel) campusSel.onchange = function () {
        localStorage.setItem("lt-desk-campus", campusSel.value);
        paint();
      };
      host.querySelectorAll("[data-sup-pick]").forEach(function (el) {
        el.onchange = function () {
          localStorage.setItem("lt-supplier-pick-" + campusId(), el.getAttribute("data-sup-pick"));
          paint();
        };
      });
      host.querySelectorAll("[data-sup-del]").forEach(function (btn) {
        btn.onclick = function () {
          var id = btn.getAttribute("data-sup-del");
          var next = suppliersGet().filter(function (s) { return s.id !== id; });
          suppliersSave(next);
          var key = "lt-supplier-pick-" + campusId();
          if (!next.some(function (s) { return s.id === localStorage.getItem(key); })) {
            localStorage.setItem(key, next[0] ? next[0].id : "");
          }
          paint();
        };
      });
      var add = host.querySelector("#ss-sup-add");
      if (!add) return;
      add.onclick = function () {
        var name = ((host.querySelector("#ss-sup-name") || {}).value || "").trim().slice(0, 60);
        if (!name) return;
        var email = ((host.querySelector("#ss-sup-email") || {}).value || "").trim().slice(0, 80);
        var phone = ((host.querySelector("#ss-sup-phone") || {}).value || "").trim().slice(0, 24);
        var sells = ((host.querySelector("#ss-sup-sells") || {}).value || "").trim().slice(0, 80);
        var list = suppliersGet();
        var id = "s" + Date.now();
        list.push({ id: id, name: name, email: email, phone: phone, sells: sells });
        suppliersSave(list);
        localStorage.setItem("lt-supplier-pick-" + campusId(), id);
        paint();
      };
    }
    function ariText(built) {
      var who = supplierPick();
      var school = (global.SchoolPack && (global.SchoolPack.school || global.SchoolPack.org)) || "the campus";
      var mod = built.course.label || built.course.name;
      var lines = [
        "To: " + who.name + (who.email ? " <" + who.email + ">" : ""),
        "Subject: Lab materials — " + mod + " — " + school,
        "",
        who.name + ",",
        "",
        "Please ship the materials below for our HVAC lab.",
        "",
        "School: " + school,
        "Campus: " + campusLabel(),
        "Ship to:",
        "Attention:",
        "Phone:",
        "Needed by:",
        "",
        "Item | size | quantity | unit | mod",
      ];
      if (!built.buy.length && !built.wear.length && !extrasGet().length) lines.push("Nothing to order. The days that ran did not use anything up, or the shelf still covers it.");
      built.buy.forEach(function (r) {
        var rolls = r.roll ? Math.ceil(r.qty / r.roll) : 0;
        var roll = rolls ? " (" + rolls + " × " + r.roll + " " + r.unit + (rolls === 1 ? " roll)" : " rolls)") : "";
        lines.push(r.item + " | " + (r.size || "—") + " | " + r.qty + " | " + r.unit + " | " + r.mod + roll);
      });
      built.wear.forEach(function (r) {
        lines.push(r.item + " | — | " + r.qty + " | " + r.unit + " | " + r.mod + " (wear, marked done)");
      });
      extrasGet().forEach(function (p) {
        lines.push(p.item + " | " + (p.size || "—") + " | " + p.qty + " | " + p.unit + " | " + mod);
      });
      lines.push("");
      lines.push("The shelf is already subtracted. Please ship only the quantities on the list.");
      lines.push("");
      lines.push("Thank you,");
      return lines.join("\n");
    }
    function extrasGet() {
      try {
        var book = JSON.parse(localStorage.getItem("lt-order-extras-v1") || "{}");
        var list = book && book[campusId()];
        if (!Array.isArray(list)) return [];
        return list.filter(function (p) { return p && p.item; }).map(function (p) {
          return {
            id: String(p.id || ""),
            item: String(p.item).slice(0, 60),
            size: String(p.size || "").slice(0, 24),
            qty: Math.max(0, Number(p.qty) || 0),
            unit: String(p.unit || "ea").slice(0, 12),
          };
        }).filter(function (p) { return p.qty > 0; });
      } catch (e) {
        return [];
      }
    }
    function extrasSave(list) {
      var book = {};
      try { book = JSON.parse(localStorage.getItem("lt-order-extras-v1") || "{}") || {}; } catch (e) {}
      book[campusId()] = list;
      localStorage.setItem("lt-order-extras-v1", JSON.stringify(book));
    }
    function extrasHtml() {
      var list = extrasGet();
      var rows = list.map(function (p) {
        return "<li><b>" + p.qty + " " + esc(p.unit) + "</b> " + esc(p.item) + (p.size ? " · " + esc(p.size) : "") +
          " <button type='button' class='btn' data-extra-del='" + esc(p.id) + "'>Remove</button></li>";
      }).join("");
      return (
        "<h3>Add a product</h3>" +
        "<p class='ss-fine'>Something this order needs that a class day does not already count. The quantity is what you type. It is not multiplied by the class.</p>" +
        (rows ? "<ul class='ss-roster'>" + rows + "</ul>" : "") +
        '<div class="ss-add" style="flex-wrap:wrap;gap:8px">' +
        '<label>Product <input id="ss-extra-item" maxlength="60" placeholder="Coil cleaner"/></label>' +
        '<label>Size <input id="ss-extra-size" maxlength="24" placeholder="1 gal"/></label>' +
        '<label>Qty <input id="ss-extra-qty" type="number" min="1" step="1" value="1"/></label>' +
        '<label>Unit <select id="ss-extra-unit"><option>ea</option><option>ft</option><option>lb</option><option>roll</option><option>box</option></select></label>' +
        '<button type="button" class="btn primary" id="ss-extra-add">Add product</button>' +
        "</div>"
      );
    }
    function bindExtras() {
      host.querySelectorAll("[data-extra-del]").forEach(function (btn) {
        btn.onclick = function () {
          var id = btn.getAttribute("data-extra-del");
          extrasSave(extrasGet().filter(function (p) { return p.id !== id; }));
          paint();
        };
      });
      var add = host.querySelector("#ss-extra-add");
      if (!add) return;
      add.onclick = function () {
        var item = ((host.querySelector("#ss-extra-item") || {}).value || "").trim().slice(0, 60);
        var qty = Math.max(0, Number((host.querySelector("#ss-extra-qty") || {}).value) || 0);
        if (!item || !qty) return;
        var size = ((host.querySelector("#ss-extra-size") || {}).value || "").trim().slice(0, 24);
        var unit = ((host.querySelector("#ss-extra-unit") || {}).value || "ea").slice(0, 12);
        var list = extrasGet();
        list.push({ id: "p" + Date.now(), item: item, size: size, qty: qty, unit: unit });
        extrasSave(list);
        paint();
      };
    }

    function dayCardsHtml(courseId, throughDay) {
      var days = MOD_DAYS[courseId] || [];
      var co = courseOf(courseId);
      var shown = days.filter(function (d) { return d.day <= co.days; });
      if (!shown.length) return "<p>Nothing is used up in this mod. The trainer stays.</p>";
      return shown.map(function (d) {
        var ran = d.day <= throughDay ? "In this class day." : "Not yet. The class is not on this day.";
        var use = (d.use || []).length
          ? "<ul class='ss-roster'>" + d.use.map(function (u) {
              var q = u.qty % 1 ? u.qty : String(u.qty);
              return "<li><b>" + q + " " + u.unit + "</b> " + esc(u.item) + (u.size ? " · " + esc(u.size) : "") + " · per student</li>";
            }).join("") + "</ul>"
          : "<p>Nothing is used up.</p>";
        var wear = (d.wear || []).map(function (w) {
          var on = !!wearGet()[w.id];
          return "<label class='ss-toggle'><input type='checkbox' data-wear='" + w.id + "'" + (on ? " checked" : "") + "/> " + esc(w.item) + " is done. " + esc(w.note) + "</label>";
        }).join("");
        return "<article class='card'><h3>Day " + d.day + " · " + esc(d.name) + "</h3><p class='ss-fine'>" + ran + "</p>" + use + wear + "</article>";
      }).join("");
    }

    function paintExtra() {
      var lincoln = window.SchoolPack && window.SchoolPack.id === "lincoln";
      var trainer = (window.LtBrand && window.LtBrand.trainer) || "Hubconnect";
      var labs = [
        { mode: "recover", title: "Recovery bench", why: "The book says recover it. They weigh the tank." },
        { mode: "gauges", title: "Manifold school", why: "The day names superheat and never hangs a hose." },
        { mode: "sandbox", title: "System sandbox", why: "The fault is one sentence. They build it and read the needles." },
        { mode: "iconnect", title: trainer + " trainers", why: "TU-522, TU-601, and the boiler. The picture is not the machine." },
        { mode: "service", title: "Service call", why: "The lab ended early. A customer is still on the phone." },
        { mode: "braze", title: "Braze bench", why: "Copper day was a video. Nitrogen, then the torch." },
        { mode: "flare", title: "Flare station", why: "The mini-split lab skipped the nut." },
        { mode: "elguide", title: "Land the lugs", why: "Electricity day never touched a disconnect." },
        { mode: "defusal", title: "Saturday callback", why: "They need a live 24-volt string and the book is done." },
        { mode: "cutaway", title: "See inside", why: "The cycle lecture has no part to point at." },
        { mode: "epa608", title: "608 drill", why: "Card day is short. Core, Type II, the vacuum table." },
      ];
      host.innerHTML =
        chrome("Extra labs") +
        '<div class="ss-body">' +
        "<p>" +
        (lincoln
          ? "Lincoln's lab is the course. These fill the block when that lab is light."
          : "The course lab is first. These fill the block when that lab is light.") +
        " Open one. The written sheet is under Labs.</p>" +
        "<ul class='ss-list'>" +
        labs.map(function (lab) {
          return "<li><button type='button' class='ss-row' data-extra='" + lab.mode + "'><strong>" +
            esc(lab.title) + "</strong><span>" + esc(lab.why) + "</span></button></li>";
        }).join("") +
        "</ul></div></div>";
      bindChrome();
      host.querySelectorAll("[data-extra]").forEach(function (b) {
        b.onclick = function () { goMode(b.getAttribute("data-extra")); };
      });
    }

    function paintMaterials() {
      if (!opts || !opts.desk) {
        if (!isInstructor()) {
          tab = "today";
          paintToday();
          return;
        }
      }
      var c = activeCls();
      var ariView = {};
      try { ariView = JSON.parse(sessionStorage.getItem("lt-ari-view") || "{}"); } catch (e) {}
      var courseId = ariView.course || c.course || "elec";
      var co = courseOf(courseId);
      var classDay = courseId === (c.course || "elec") ? Math.max(1, Math.min(co.days, Number(c.day) || 1)) : co.days;
      var through = Math.max(1, Math.min(co.days, Number(ariView.day) || classDay));
      var heads = Math.max(1, Number(localStorage.getItem("lt-mat-heads") || "1") || 1);
      var built = ariBuild(courseId, heads, through);
      var options = COURSES().map(function (x) {
        return "<option value='" + x.id + "'" + (x.id === courseId ? " selected" : "") + ">" + esc(x.label || x.name) + "</option>";
      }).join("");
      host.innerHTML =
        chrome("Materials") +
        '<div class="ss-body">' +
        "<p>Suppliers are the houses this campus orders from. The order is class size times the days that already ran, minus what is still on the shelf. Wear items go on the list only when you mark them done.</p>" +
        suppliersHtml() +
        '<div class="card" id="ss-ari">' +
        "<h3>End of mod</h3>" +
        "<p class='ss-fine'>Copy the email. It is addressed to the supplier you selected. Fill the blanks, then send it. No account.</p>" +
        '<label>Mod <select id="ss-ari-mod">' + options + "</select></label>" +
        '<label>Students <input id="ss-ari-heads" type="number" min="1" step="1" value="' + heads + '"/></label>' +
        '<label>Through day <input id="ss-ari-day" type="number" min="1" max="' + co.days + '" step="1" value="' + through + '"/> of ' + co.days + "</label>" +
        dayCardsHtml(courseId, through) +
        extrasHtml() +
        '<textarea id="ss-ari-out" readonly rows="16"></textarea>' +
        '<button type="button" class="btn primary" id="ss-ari-copy">Copy the email</button>' +
        '<p class="ss-fine" id="ss-ari-status"></p>' +
        "</div>" +
        "<p>Each card below is one lab. Per student is the estimate. The running tab is what that lab actually used.</p>" +
        LABS.map(matCard).join("") +
        "</div></div>";
      bindChrome();
      bindMatCards();
      bindSuppliers();
      bindExtras();
      var out = host.querySelector("#ss-ari-out");
      if (out) out.value = ariText(built);
      var modSel = host.querySelector("#ss-ari-mod");
      if (modSel) modSel.onchange = function () {
        var next = courseOf(modSel.value);
        sessionStorage.setItem("lt-ari-view", JSON.stringify({ course: modSel.value, day: next.days }));
        paint();
      };
      var headsIn = host.querySelector("#ss-ari-heads");
      if (headsIn) headsIn.onchange = function () {
        var n = Math.max(1, Number(headsIn.value) || 1);
        if (String(n) === (localStorage.getItem("lt-mat-heads") || "1")) return;
        localStorage.setItem("lt-mat-heads", String(n));
        paint();
      };
      var dayIn = host.querySelector("#ss-ari-day");
      if (dayIn) dayIn.onchange = function () {
        var n = Math.max(1, Math.min(co.days, Number(dayIn.value) || 1));
        var prev = {};
        try { prev = JSON.parse(sessionStorage.getItem("lt-ari-view") || "{}"); } catch (e) {}
        if (prev.course === courseId && Number(prev.day) === n) return;
        sessionStorage.setItem("lt-ari-view", JSON.stringify({ course: courseId, day: n }));
        paint();
      };
      host.querySelectorAll("[data-wear]").forEach(function (box) {
        box.onchange = function () {
          var w = wearGet();
          w[box.getAttribute("data-wear")] = !!box.checked;
          localStorage.setItem("lt-mat-wear-v1", JSON.stringify(w));
          paint();
        };
      });
      var copyBtn = host.querySelector("#ss-ari-copy");
      if (copyBtn) copyBtn.onclick = function () {
        var text = host.querySelector("#ss-ari-out").value;
        var status = host.querySelector("#ss-ari-status");
        function ok() { if (status) status.textContent = "Copied. Paste it into the email to " + supplierPick().name + "."; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(ok).catch(function () { ok(); });
        } else ok();
      };
    }

    function paintGrades() {
      var meta = gradeMeta(gClass) || gradeMeta("hcr200");
      if (!gradeMeta(gClass)) gClass = "hcr200";
      var roster = gradeRoster(gClass);
      var ids = Object.keys(roster);
      var classes = []
        .concat(Object.keys(GRADE_BUILTIN).map(function (id) { return { id: id, name: GRADE_BUILTIN[id].name }; }))
        .concat(Object.keys(customClasses()).map(function (id) {
          var c = customClasses()[id];
          return { id: id, name: (c && c.name) || "Class" };
        }));
      var classOpts = classes.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === gClass ? " selected" : "") + ">" + esc(c.name) + "</option>";
      }).join("");
      var log = loadGradeLog();
      var byId = {};
      log.forEach(function (g) { byId[g.id] = g; });
      var logHtml = log.length
        ? log.map(function (g) {
            return "<div><strong>" + esc(g.name) + "</strong><br><span>Lab " + esc(g.grade) + " · Sharp " + esc(g.sharp) + (g.notes ? " · " + esc(g.notes) : "") + "</span></div>";
          }).join("")
        : "<div>No grades yet today</div>";
      var rosterHtml = ids.length
        ? ids.map(function (id) {
            var last = byId[id];
            var on = gScanFor === id && gScanning ? " lg-on" : "";
            var label = gScanning && gScanFor === id ? "Stop" : "Scan";
            return (
              '<div class="lg-person' + on + '"><div><strong>' + esc(roster[id]) + "</strong><p>" +
              (last ? "Lab " + esc(last.grade) + " · Sharp " + esc(last.sharp) : "No grade today") +
              '</p></div><div class="lg-btns">' +
              '<button type="button" class="btn" data-pic="' + esc(id) + '">Picture</button>' +
              '<button type="button" class="btn primary" data-scan="' + esc(id) + '">' + label + "</button></div></div>"
            );
          }).join("")
        : "<p>No names in this class.</p>";
      host.innerHTML =
        chrome("Grade scanner") +
        '<div class="ss-body" id="lg">' +
        '<p class="lg-label">Class</p>' +
        '<div class="lg-row"><select id="lg-class">' + classOpts + '</select>' +
        '<button type="button" class="btn" id="lg-del">Delete</button></div>' +
        '<button type="button" class="btn primary lg-bigscan" id="lg-any">' +
        (gScanning && !gScanFor ? "Close camera" : "Scan whoever is ready") +
        "</button>" +
        '<div class="lg-actions">' +
        '<button type="button" class="btn" id="lg-print">Print cards</button>' +
        '<button type="button" class="btn" id="lg-new">New class</button>' +
        "</div>" +
        '<div class="lg-scan">' +
        '<video id="lg-video" class="' + (gScanning ? "" : "is-off") + '" autoplay playsinline muted></video>' +
        '<div class="lg-frame' + (gScanning ? " on" : "") + '"></div></div>' +
        (gStatus ? '<p class="lg-status' + (gStatusBad ? " bad" : "") + '">' + esc(gStatus) + "</p>" : "") +
        '<p class="lg-label">Roster</p>' +
        '<div class="lg-roster">' + rosterHtml + "</div>" +
        (gOpen === "create"
          ? '<div class="lg-card"><strong>New class</strong>' +
            '<input id="lg-cname" maxlength="48" placeholder="Class or program name"/>' +
            '<p class="lg-label">Student names, one per line</p>' +
            '<textarea id="lg-cnames" rows="6" placeholder="First Last"></textarea>' +
            '<div class="lg-actions"><button type="button" class="btn primary" id="lg-save-class">Save class</button>' +
            '<button type="button" class="btn" id="lg-close-create">Close</button></div></div>'
          : "") +
        (gStudent
          ? '<div class="lg-card"><h3>' + esc(gStudent.name) + "</h3>" +
            '<p class="lg-label">Lab grade</p><p class="lg-grade" id="lg-num">' + gScore + "</p>" +
            '<input id="lg-score" type="range" min="0" max="100" step="1" value="' + gScore + '"/>' +
            '<p class="lg-label">Sharp points</p><p class="lg-grade lg-sharp" id="lg-sharp">' + gSharp + "</p>" +
            '<input id="lg-sharpin" type="range" min="0" max="10" step="1" value="' + gSharp + '"/>' +
            '<textarea id="lg-note" rows="2" maxlength="240" placeholder="Notes, optional">' + esc(gNotes) + "</textarea>" +
            '<div class="lg-actions"><button type="button" class="btn primary" id="lg-save">Save</button>' +
            '<button type="button" class="btn" id="lg-cancel">Cancel</button></div></div>'
          : "") +
        '<div class="lg-card"><strong>Today’s grades</strong><div class="lg-log">' + logHtml + "</div>" +
        '<button type="button" class="btn" id="lg-csv">Export CSV</button></div>' +
        '<p class="lg-fine">Picture saves a clear code on their phone. Do not crop the white border.</p>' +
        "</div></div>" +
        (gPicture && roster[gPicture]
          ? '<div class="lg-shot"><canvas id="lg-shot-canvas" width="1080" height="1440"></canvas>' +
            "<p>Press and hold the picture. Save it to Photos. Leave the white border.</p>" +
            '<button type="button" class="btn primary" id="lg-shot-save">Save picture</button>' +
            '<button type="button" class="btn" id="lg-shot-close">Close</button></div>'
          : "");
      bindChrome();
      var classSel = host.querySelector("#lg-class");
      if (classSel) classSel.onchange = function () {
        gClass = classSel.value;
        gStudent = null;
        gOpen = "";
        gStatus = "";
        gScanning = false;
        gScanFor = "";
        gKeepScan = false;
        gPicture = "";
        paint();
      };
      var del = host.querySelector("#lg-del");
      if (del) del.onclick = function () {
        if (GRADE_BUILTIN[gClass]) {
          gStatus = "Those two classes stay.";
          gStatusBad = true;
          paint();
          return;
        }
        if (!window.confirm("Delete this class and today’s grades for it?")) return;
        var map = customClasses();
        delete map[gClass];
        saveCustomMap(map);
        try { localStorage.removeItem(gradeKey()); } catch (e) {}
        gClass = "hcr200";
        gStudent = null;
        gStatus = "";
        paint();
      };
      var studentSel = host.querySelector("#lg-student");
      if (studentSel) studentSel.onchange = function () {
        var id = studentSel.value;
        if (!id || !roster[id]) {
          gStudent = null;
          paint();
          return;
        }
        gScanning = false;
        gScanFor = "";
        gStudent = { id: id, name: roster[id] };
        gScore = 100;
        gSharp = 10;
        gNotes = "";
        gStatus = "";
        gOpen = "";
        paint();
      };
      host.querySelectorAll("[data-pic]").forEach(function (b) {
        b.onclick = function () {
          gPicture = b.getAttribute("data-pic") || "";
          gScanning = false;
          gScanFor = "";
          paint();
        };
      });
      var shotClose = host.querySelector("#lg-shot-close");
      if (shotClose) shotClose.onclick = function () { gPicture = ""; paint(); };
      var shotSave = host.querySelector("#lg-shot-save");
      if (shotSave) shotSave.onclick = function () {
        var canvas = host.querySelector("#lg-shot-canvas");
        if (!canvas) return;
        var fileName = String(roster[gPicture] || "student").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".png";
        canvas.toBlob(function (blob) {
          if (!blob) return;
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, "image/png");
      };
      if (gPicture && roster[gPicture]) {
        var shot = host.querySelector("#lg-shot-canvas");
        var metaName = (gradeMeta(gClass) && gradeMeta(gClass).name) || "";
        cardCanvas(roster[gPicture], metaName, gPicture).then(function (drawn) {
          if (!shot || !drawn) return;
          shot.getContext("2d").drawImage(drawn, 0, 0);
        }).catch(function () {});
      }
      host.querySelectorAll("[data-scan]").forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute("data-scan");
          if (gScanning && gScanFor === id) {
            gScanning = false;
            gScanFor = "";
            gKeepScan = false;
            gStatus = "";
            paint();
            return;
          }
          gScanFor = id;
          gKeepScan = false;
          gScanning = true;
          gStudent = null;
          gOpen = "";
          gStatus = "Point at " + (roster[id] || "their") + "’s picture.";
          gStatusBad = false;
          paint();
        };
      });
      var anyBtn = host.querySelector("#lg-any");
      if (anyBtn) anyBtn.onclick = function () {
        if (gScanning && !gScanFor) {
          gScanning = false;
          gKeepScan = false;
          gStatus = "";
          paint();
          return;
        }
        gScanFor = "";
        gKeepScan = true;
        gScanning = true;
        gStudent = null;
        gOpen = "";
        gStatus = "Point at whoever is ready.";
        gStatusBad = false;
        paint();
      };
      var printBtn = host.querySelector("#lg-print");
      if (printBtn) printBtn.onclick = function () { printGradeCards(); };
      var newBtn = host.querySelector("#lg-new");
      if (newBtn) newBtn.onclick = function () {
        gScanning = false;
        gOpen = gOpen === "create" ? "" : "create";
        paint();
      };
      var closeCreate = host.querySelector("#lg-close-create");
      if (closeCreate) closeCreate.onclick = function () { gOpen = ""; paint(); };
      var saveClass = host.querySelector("#lg-save-class");
      if (saveClass) saveClass.onclick = function () {
        var nameEl = host.querySelector("#lg-cname");
        var listEl = host.querySelector("#lg-cnames");
        var name = ((nameEl && nameEl.value) || "").trim().slice(0, 48);
        var lines = ((listEl && listEl.value) || "").split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
        if (!name || !lines.length) {
          gStatus = "Put a class name and at least one student.";
          gStatusBad = true;
          paint();
          return;
        }
        var id = "custom_" + Date.now().toString(36);
        var next = {};
        lines.forEach(function (n, i) {
          next[id + "-" + String(i + 1).padStart(2, "0")] = n.slice(0, 40);
        });
        var map = customClasses();
        map[id] = { name: name, roster: next };
        saveCustomMap(map);
        gClass = id;
        gOpen = "";
        gStudent = null;
        gStatus = "Class saved. Show the codes when you are ready.";
        gStatusBad = false;
        paint();
      };
      var score = host.querySelector("#lg-score");
      var sharp = host.querySelector("#lg-sharpin");
      var num = host.querySelector("#lg-num");
      var sharpEl = host.querySelector("#lg-sharp");
      var note = host.querySelector("#lg-note");
      if (score) score.oninput = function () {
        gScore = Math.max(0, Math.min(100, parseInt(score.value, 10) || 0));
        if (num) num.textContent = String(gScore);
      };
      if (sharp) sharp.oninput = function () {
        gSharp = Math.max(0, Math.min(10, parseInt(sharp.value, 10) || 0));
        if (sharpEl) sharpEl.textContent = String(gSharp);
      };
      if (note) note.oninput = function () { gNotes = note.value.slice(0, 240); };
      var saveBtn = host.querySelector("#lg-save");
      if (saveBtn) saveBtn.onclick = function () {
        if (!gStudent) return;
        var entry = {
          id: gStudent.id,
          name: gStudent.name,
          grade: gScore,
          sharp: gSharp,
          notes: gNotes.trim(),
          time: new Date().toLocaleTimeString()
        };
        var data = loadGradeLog();
        var idx = -1;
        data.forEach(function (g, i) { if (g.id === entry.id) idx = i; });
        if (idx >= 0) data[idx] = entry;
        else data.push(entry);
        localStorage.setItem(gradeKey(), JSON.stringify(data));
        gStudent = null;
        gNotes = "";
        gScore = 100;
        gSharp = 10;
        gStatus = gKeepScan ? "Saved. Point at the next picture." : "Saved";
        gStatusBad = false;
        if (gKeepScan) {
          gScanning = true;
          gScanFor = "";
        }
        paint();
      };
      var cancel = host.querySelector("#lg-cancel");
      if (cancel) cancel.onclick = function () {
        gStudent = null;
        gStatus = gKeepScan ? "Point at whoever is ready." : "";
        gStatusBad = false;
        if (gKeepScan) {
          gScanning = true;
          gScanFor = "";
        }
        paint();
      };
      var csvBtn = host.querySelector("#lg-csv");
      if (csvBtn) csvBtn.onclick = function () {
        var data = loadGradeLog();
        if (!data.length) {
          gStatus = "No grades to export.";
          gStatusBad = true;
          paint();
          return;
        }
        var csv = "ID,Name,Lab Grade,Sharp Points,Notes,Time\n" + data.map(function (g) {
          return '"' + String(g.id).replace(/"/g, '""') + '","' + String(g.name).replace(/"/g, '""') + '",' +
            g.grade + "," + g.sharp + ',"' + String(g.notes || "").replace(/"/g, '""') + '","' + String(g.time || "") + '"';
        }).join("\n");
        var blob = new Blob([csv], { type: "text/csv" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "grades_" + gClass + "_" + gradeDay() + ".csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      if (gScanning) startGradeScan(roster);
    }

    function cardCanvas(name, className, code) {
      return new Promise(function (ok, fail) {
        if (!global.QRCode || !global.QRCode.toCanvas) { fail(); return; }
        var qr = document.createElement("canvas");
        global.QRCode.toCanvas(qr, code, {
          width: 860,
          margin: 1,
          errorCorrectionLevel: "H",
          color: { dark: "#14181c", light: "#ffffff" }
        }).then(function () {
          var canvas = document.createElement("canvas");
          canvas.width = 1080;
          canvas.height = 1440;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 1080, 1440);
          ctx.textAlign = "center";
          ctx.fillStyle = "#C8102E";
          ctx.font = "700 40px Arial, sans-serif";
          ctx.fillText("LINCOLN TECH", 540, 110);
          ctx.fillStyle = "#14181c";
          var size = 78;
          ctx.font = "700 " + size + "px Arial, sans-serif";
          while (size > 40 && ctx.measureText(name).width > 960) {
            size -= 4;
            ctx.font = "700 " + size + "px Arial, sans-serif";
          }
          ctx.fillText(name, 540, 210);
          ctx.font = "36px Arial, sans-serif";
          var words = String(className || "").split(" ");
          var lines = [];
          var line = "";
          words.forEach(function (w) {
            var next = line ? line + " " + w : w;
            if (line && ctx.measureText(next).width > 960) {
              lines.push(line);
              line = w;
            } else line = next;
          });
          if (line) lines.push(line);
          lines.slice(0, 2).forEach(function (ln, i) { ctx.fillText(ln, 540, 280 + i * 46); });
          ctx.drawImage(qr, 110, 390);
          ctx.font = "32px Arial, sans-serif";
          ctx.fillText("Save this picture. Do not crop the white.", 540, 1340);
          ok(canvas);
        }).catch(fail);
      });
    }

    function printGradeCards() {
      var meta = gradeMeta(gClass);
      var roster = gradeRoster(gClass);
      var ids = Object.keys(roster);
      if (!meta || !ids.length) {
        gStatus = "The cards did not draw.";
        gStatusBad = true;
        paint();
        return;
      }
      Promise.all(ids.map(function (id) {
        return cardCanvas(roster[id], meta.name, id).then(function (canvas) {
          return { url: canvas.toDataURL("image/png") };
        });
      })).then(function (rows) {
        var cards = rows.map(function (r) {
          return '<section class="card"><img alt="" src="' + r.url + '"/></section>';
        }).join("");
        printBlock(
          "<style>@page{size:letter;margin:0.35in}body{max-width:none!important;padding:0!important}" +
          ".card{page-break-after:always;text-align:center}" +
          ".card img{width:7.2in;height:auto}</style>" + cards
        );
      }).catch(function () {
        gStatus = "The cards did not draw.";
        gStatusBad = true;
        paint();
      });
    }

    function startGradeScan(roster) {
      var video = host.querySelector("#lg-video");
      if (!video || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        gScanning = false;
        gStatus = "This phone has no camera here. Choose the name instead.";
        gStatusBad = true;
        paint();
        return;
      }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false }).then(function (stream) {
        if (!gScanning) {
          stream.getTracks().forEach(function (t) { t.stop(); });
          return;
        }
        scanStream = stream;
        video.srcObject = stream;
        video.classList.remove("is-off");
        var play = video.play();
        if (play && play.catch) play.catch(function () {});
        if (!("BarcodeDetector" in window)) {
          gStatus = "This browser cannot read a code in the app. Choose the name, or use Chrome.";
          gStatusBad = true;
          var say = host.querySelector(".lg-status");
          if (!say) {
            var p = document.createElement("p");
            p.className = "lg-status bad";
            p.textContent = gStatus;
            video.parentNode.appendChild(p);
          }
          return;
        }
        var det = new BarcodeDetector({ formats: ["qr_code"] });
        scanTimer = setInterval(function () {
          if (!gScanning) return;
          det.detect(video).then(function (codes) {
            if (!gScanning || !codes || !codes[0] || !codes[0].rawValue) return;
            var id = String(codes[0].rawValue).trim();
            var say = host.querySelector(".lg-status");
            if (gScanFor && id !== gScanFor) {
              gStatus = roster[id]
                ? "That’s " + roster[id] + ", not " + roster[gScanFor] + "."
                : "That code is not " + (roster[gScanFor] || "this student") + ".";
              gStatusBad = true;
              if (say) {
                say.textContent = gStatus;
                say.className = "lg-status bad";
              }
              return;
            }
            if (!roster[id]) {
              gStatus = "That code is not in this class.";
              gStatusBad = true;
              if (say) {
                say.textContent = gStatus;
                say.className = "lg-status bad";
              }
              return;
            }
            gScanning = false;
            gScanFor = "";
            gStudent = { id: id, name: roster[id] };
            gScore = 100;
            gSharp = 10;
            gNotes = "";
            gStatus = "";
            gOpen = "";
            paint();
          }).catch(function () {});
        }, 350);
      }).catch(function () {
        gScanning = false;
        gStatus = "Camera blocked. Choose the name instead.";
        gStatusBad = true;
        paint();
      });
    }

    function paintClass() {
      var list = roster();
      var c = activeCls();
      var roll = c.roll || {};
      host.innerHTML =
        chrome("Class") +
        '<div class="ss-body">' +
        dayBoardHtml() +
        "<p>This class. Add names. P present · L late · A absent · E excused. Engagement: seat 40% / lab 35% / worksheets 25%. Ghost = present with no product.</p>" +
        '<div class="ss-add"><input id="ss-name" maxlength="24" placeholder="Tech name"/><button type="button" class="btn primary" id="ss-add">Add</button></div>' +
        "<ul class='ss-roster' id='ss-roster'>" +
        (list.length
          ? list
              .map(function (n, i) {
                var st = roll[n] || "P";
                return (
                  "<li><strong>" +
                  n +
                  "</strong> " +
                  ["P", "L", "A", "E"]
                    .map(function (k) {
                      return (
                        "<button type='button" +
                        "' class='btn" +
                        (st === k ? " primary" : "") +
                        "' data-roll='" +
                        i +
                        "' data-k='" +
                        k +
                        "'>" +
                        k +
                        "</button>"
                      );
                    })
                    .join("") +
                  " <button type='button' class='btn' data-del='" +
                  i +
                  "'>Remove</button></li>"
                );
              })
              .join("")
          : "<li>No names yet. Don't invent a class.</li>") +
        "</ul>" +
        "<h3>6-hour block</h3><textarea id='ss-plan' rows='6' placeholder='Hour 1 safety…'>" +
        (c.plan || "") +
        "</textarea>" +
        '<div class="ss-actions">' +
        '<button type="button" class="btn primary" id="ss-packet">Print all tests + keys</button>' +
        "</div></div></div>";
      bindChrome();
      bindDayBoard();
      var addBtn = host.querySelector("#ss-add");
      if (addBtn) addBtn.onclick = function () {
        var nameEl = host.querySelector("#ss-name");
        var n = ((nameEl && nameEl.value) || "").trim().slice(0, 24);
        if (!n) return;
        var r = roster().slice();
        if (r.indexOf(n) < 0) r.push(n);
        saveCls({ roster: r });
        paint();
      };
      host.querySelectorAll("[data-roll]").forEach(function (b) {
        b.onclick = function () {
          var cur = activeCls();
          var next = Object.assign({}, cur.roll || {});
          next[roster()[+b.getAttribute("data-roll")]] = b.getAttribute("data-k");
          saveCls({ roll: next });
          paint();
        };
      });
      host.querySelectorAll("[data-del]").forEach(function (b) {
        b.onclick = function () {
          var r = roster().slice();
          r.splice(+b.getAttribute("data-del"), 1);
          saveCls({ roster: r });
          paint();
        };
      });
      var plan = host.querySelector("#ss-plan");
      if (plan) {
        plan.onchange = function () {
          saveCls({ plan: plan.value });
        };
      }
      var _ssN = host.querySelector("#ss-packet"); if (_ssN) _ssN.onclick = function () {
        var html = SHEETS.map(function (sh) { return sheetHtml(sh, true); }).join("") + LABS.map(labHtml).join("");
        printBlock(html);
      };
    }

    paint();
    return { stop: function () { stopScan(); } };
  }

  global.ShopSchool = {
    start: function (root, opts) {
      if (!root) return { stop: function () {} };
      if (!document.getElementById("ss-phone-fit")) {
        var fit = document.createElement("style");
        fit.id = "ss-phone-fit";
        fit.textContent = [
          "#desk .ss-head h2{flex:1 0 100%;margin:4px 0 0}",
          "#desk .ss-row{display:flex;flex-direction:column;align-items:flex-start;text-align:left;width:100%;white-space:normal;gap:2px}",
          "#desk .ss-row strong,#desk .ss-row span{display:block;white-space:normal}",
          "@media (max-width:720px){#desk .ss-table,#desk .ss-table tr,#desk .ss-table th,#desk .ss-table td{display:block;width:100%;text-align:left}#desk .ss-table td:first-child,#desk .ss-table th:first-child{font-weight:700;padding-top:10px}}",
          "#desk #ss-ari-out{width:100%;max-width:100%;box-sizing:border-box;white-space:pre-wrap}",
          "#desk #ss-ari label{display:block;margin:8px 0}",
          "#desk #ss-grade-scan,#desk #lg .lg-bigscan{width:100%;min-height:64px;font-size:1.15rem;margin:0 0 14px}",
          "#desk #lg .lg-label{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#9aa3ad;font-weight:700;margin:14px 0 6px}",
          "#desk #lg select,#desk #lg textarea{width:100%;box-sizing:border-box;margin:0 0 10px;padding:12px 14px;border-radius:12px;border:1px solid #3a4654;background:#1b2229;color:#f4efe6;font:500 16px/1.3 'IBM Plex Sans',system-ui,sans-serif}",
          "#desk #lg video{width:100%;border-radius:16px;background:#000;margin:0 0 10px;max-height:240px;object-fit:cover}",
          "#desk #lg video.is-off{display:none}",
          "#desk #lg .lg-card{background:#161b21;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px;margin-top:12px}",
          "#desk #lg .lg-grade{font-size:64px;font-weight:700;text-align:center;line-height:1;margin:0}",
          "#desk #lg .lg-letter{text-align:center;font-weight:700;margin:4px 0 8px}",
          "#desk #lg input[type=range]{width:100%;margin:0 0 10px;accent-color:#CE0034}",
          "#desk #lg .lg-person{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(255,255,255,.12)}",
          "#desk #lg .lg-person .btn{width:auto;min-width:72px;flex:0 0 auto}",
          "#desk #lg .lg-btns{display:flex;gap:6px;flex:0 0 auto}",
          "#desk .lg-shot{position:fixed;inset:0;z-index:80;background:#fff;color:#14181c;overflow:auto;text-align:center;padding:12px 16px 28px}",
          "#desk .lg-shot canvas{width:min(100%,440px);height:auto;background:#fff}",
          "#desk .lg-shot p{margin:10px auto;max-width:440px;font-size:16px}",
          "#desk .lg-shot .btn{display:block;width:min(100%,440px);margin:8px auto;min-height:48px;background:#1c1c1e;color:#fff}",
          "#desk .lg-shot .btn.primary{background:#C8102E}",
          "#desk #lg .lg-person.lg-on{outline:2px solid #d4b45a;border-radius:12px;padding:10px}",
          "#desk #lg .lg-qr{width:96px;height:96px;background:#fff;border-radius:8px;flex:0 0 auto}",
          "#desk #lg .lg-person p{margin:2px 0 6px;color:#c9d0d6;font-size:14px}",
          "#desk #lg .lg-log{max-height:240px;overflow:auto}",
          "#desk #lg .lg-log div{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.12);font-size:14px}",
          "#desk #lg .lg-actions{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}",
          "#desk #lg .lg-actions .btn{flex:1 1 120px;min-height:44px}",
          "#desk #lg .lg-row{display:flex;gap:8px;align-items:center}",
          "#desk #lg .lg-row select{flex:1;margin:0}",
          "#desk #lg .lg-row .btn{width:auto;min-height:44px}",
          "#desk #lg .lg-qrs{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;margin-top:10px}",
          "#desk #lg .lg-qrwrap{text-align:center}",
          "#desk #lg .lg-qrwrap span{display:block;font-size:12px;color:#9aa3ad;margin-top:4px}",
          "#desk #lg .lg-sharp{font-size:40px}",
          "#desk #lg .lg-status{text-align:center;font-weight:650;color:#30d158;min-height:1.2em}",
          "#desk #lg .lg-status.bad{color:#ff6b6b}",
          "#desk #lg .lg-fine{color:#9aa3ad;font-size:12px;text-align:center;margin-top:16px}",
          "#desk #lg .lg-scan{position:relative}",
          "#desk #lg .lg-frame{display:none;position:absolute;left:50%;top:50%;width:180px;height:180px;transform:translate(-50%,-50%);border:2px solid #CE0034;border-radius:16px;pointer-events:none}",
          "#desk #lg .lg-frame.on{display:block}",
          "#desk #lg input[type=text],#desk #lg input:not([type]){width:100%;box-sizing:border-box;margin:0 0 10px;padding:12px 14px;border-radius:12px;border:1px solid #3a4654;background:#1b2229;color:#f4efe6;font:500 16px/1.3 inherit}",
        ].join("");
        document.head.appendChild(fit);
      }
      try {
        root.innerHTML = "";
        return ShopSchool(root, opts || {});
      } catch (err) {
        try {
          root.innerHTML = "<div class='ss-shell'><p>Shop School could not open.</p><button type='button' class='btn' id='ss-hub'>Shop floor</button></div>";
          var b = root.querySelector("#ss-hub");
          if (b) b.onclick = function () { try { if (opts && opts.onHub) opts.onHub(); } catch (e) {} };
        } catch (e2) {}
        return { stop: function () {} };
      }
    },
    printQuiz: printQuiz,
    printBlock: printBlock,
    quizHtml: quizHtml,
    dayTitle: dayTitle,
    activeClass: activeCls,
  };
  try {
    var _open = new URLSearchParams(location.search).get("open");
    if (_open && typeof global.ltPlay === "function") global.ltPlay(_open);
  } catch (_e) {}
})(window);
