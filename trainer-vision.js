/* Lincoln Tech lab manual for the three trainers on this floor.
   The factory books were never sent. This is the lab the students use. */
(function (global) {
  "use strict";

  var GUIDES = {
    tu522: {
      source: "Our lab. The factory manual was not sent with this trainer.",
      cover: "Land the cords in order. No jumper.",
      need: ["Disconnect off", "Patch cords in the tray", "No jumper on a safety"],
      steps: [
        { pic: "off", look: "Disconnect", say: "Is it off?", kind: "choice", choices: ["Off", "On"], must: "Off", block: "Turn it off." },
        { pic: "plate134", look: "Plate", say: "Write the refrigerant. It is R-134a.", kind: "text", placeholder: "R-134a", accept: ["134"], miss: "R-134a. Look at the plate." },
        { pic: "cordL1", look: "L1 to temperature control", say: "Land this cord. It is the call for cool.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Land L1 to the temperature control." },
        { pic: "cordPd", look: "Temperature control to pump-down", say: "Land this cord.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Land the pump-down." },
        { pic: "cordLp", look: "Pump-down to low pressure", say: "Land this cord. Do not jumper it.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Low pressure is still open." },
        { pic: "cordHp", look: "Low pressure to high pressure", say: "Land this cord. They are not the same switch.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "High pressure is still open." },
        { pic: "cordCoil", look: "High pressure to coil", say: "Land this cord.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The coil is still open." },
        { pic: "cordL2", look: "Coil to L2", say: "Land this cord.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The coil still needs L2." },
        { pic: "cordT1", look: "T1 to overload to common", say: "Land both cords.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Common is still open." },
        { pic: "cap", look: "Run cap and start cap", say: "Run cap stays in. Start cap goes through the relay.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The start circuit is not finished." },
        { pic: "safety", look: "Jumper", say: "Is there a jumper on a safety?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Pull the jumper." },
      ],
    },
    tu601: {
      source: "Our lab. The factory manual was not sent with this trainer.",
      cover: "Name the parts. Do not open a valve.",
      need: ["Do not open a valve", "Do not flip a fault switch", "Do not ohm it live"],
      steps: [
        { pic: "plate410", look: "Refrigerant", say: "What is on the plate?", kind: "choice", choices: ["R-410A", "R-134a", "R-22"], must: "R-410A", block: "Read the plate. R-410A." },
        { pic: "plate410", look: "Voltage", say: "What voltage is on the plate?", kind: "choice", choices: ["208/230", "120", "24"], must: "208/230", block: "208/230. Not 24 volts." },
        { pic: "outdoor", look: "Outdoor unit", say: "Point at the box on the floor. That is the condenser.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "The outdoor box. Not a head." },
        { pic: "wall", look: "High wall", say: "Zone 1. It has its own line set.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "High wall. Not the outdoor box." },
        { pic: "cassette", look: "Cassette", say: "Zone 2. A second pair of lines.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "The cassette is the second head." },
        { pic: "gauges", look: "Hoses", say: "Which hose stays capped?", kind: "choice", choices: ["Yellow", "Blue", "Red"], must: "Yellow", block: "Yellow stays capped. Blue is suction. Red is liquid." },
        { pic: "glass", look: "Sight glasses", say: "Will you open a valve?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Look only. Do not open a valve." },
        { pic: "louver", look: "Louver", say: "Point at the outdoor louver. Leave it.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "The louver is on the outdoor coil." },
        { pic: "faults", look: "Fault switches", say: "Leave the switches where they are.", kind: "choice", choices: ["Left alone", "I flipped one"], must: "Left alone", block: "Put the switch back." },
        { pic: "comp", look: "Compressor", say: "Will you ohm it while it is live?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Disconnect off before ohms." },
      ],
    },
    tu210g: {
      source: "Our lab. The factory manual was not sent with this trainer.",
      cover: "This is a boiler. Gas valve last.",
      need: ["No gauges on the copper", "Do not flip a fault switch", "Water before gas"],
      steps: [
        { pic: "boiler", look: "What moves the heat", say: "Water or refrigerant?", kind: "choice", choices: ["Water", "Refrigerant"], must: "Water", block: "Water. Gauges stay on the cart." },
        { pic: "rad", look: "Radiator", say: "Point at zone 1.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "Find the radiator." },
        { pic: "base", look: "Baseboard", say: "Point at zone 2.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "Find the baseboard." },
        { pic: "heater", look: "Unit heater", say: "Point at zone 3.", kind: "choice", choices: ["I see it", "Not yet"], must: "I see it", block: "Find the unit heater." },
        { pic: "tank", look: "Tank", say: "What is the tank on the water?", kind: "choice", choices: ["Expansion tank", "Receiver"], must: "Expansion tank", block: "Expansion tank. Not a receiver." },
        { pic: "faults", look: "Fault switch", say: "Leave the switch where it is.", kind: "choice", choices: ["Left alone", "I flipped one"], must: "Left alone", block: "Put the switch back." },
        { pic: "water", look: "Water", say: "Is there water, and is the high limit closed?", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "No gas until there is water." },
        { pic: "gas", look: "Gas valve", say: "Did you wait until the water was proved?", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "Water first. Then the valve." },
        { pic: "nogauge", look: "Manifold", say: "Are the gauges on the copper?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Take the gauges off." },
      ],
    },
  };

  function artFor(item, unit) {
    if (item && item.pic) return item.pic;
    var t = ((item && (item.look + " " + item.say)) || "").toLowerCase();
    var rules = [
      [/fault switch/, "faults"],
      [/disconnect|breaker/, "off"],
      [/jumper/, "safety"],
      [/run cap|start cap|capacitor|potential relay/, "cap"],
      [/sight glass/, "glass"],
      [/louver/, "louver"],
      [/ceiling cassette|\bcassette\b/, "cassette"],
      [/high wall/, "wall"],
      [/compressor|\bohm\b/, "comp"],
      [/manifold/, "nogauge"],
      [/gauge|superheat|subcool|suction hose|blue hose/, "gauges"],
      [/gas valve|inducer|igniter|flame/, "gas"],
      [/thermostat/, "stat"],
      [/airflow|blower wheel|\bfilter\b/, "fan"],
      [/expansion tank/, "tank"],
      [/radiator/, "rad"],
      [/baseboard/, "base"],
      [/unit heater/, "heater"],
      [/recover|evacuat|micron|nitrogen|weigh/, "charge"],
      [/braze|torch/, "torch"],
      [/r-410|208\/230|208\/240/, "plate410"],
      [/\bl1\b|patch cord|pump-down|low pressure|high pressure|contactor|overload|\bcommon\b/, "cord"],
      [/\bwater\b|boiler|hydronic/, "boiler"],
      [/nameplate|refrigerant|\bplate\b|\bvoltage\b|r-134/, "plate134"]
    ];
    for (var i = 0; i < rules.length; i++) if (rules[i][0].test(t)) return rules[i][1];
    if (unit && unit.id === "tu601") return "split";
    if (unit && unit.id === "tu210g") return "boiler";
    if (unit && unit.id === "tu522") return "board";
    return "trainer";
  }

  function tx(s) { return String(s || "").replace(/[&<>"]/g, ""); }

  function jacks(names) {
    var n = names.length;
    var xs = n === 3 ? [55, 160, 265] : [78, 242];
    var out = "";
    names.forEach(function (name, i) {
      var x = xs[i];
      if (i) out += "<path d='M" + (xs[i - 1] + 16) + " 52 H" + (x - 16) + "' stroke='#e8c450' stroke-width='5'/>";
      out += "<circle cx='" + x + "' cy='52' r='14' fill='#10161c' stroke='#e8c450' stroke-width='3'/>";
      out += "<circle cx='" + x + "' cy='52' r='4' fill='#e8c450'/>";
      out += "<text x='" + (x - 40) + "' y='92' fill='#f6f1e6' font-size='11' font-family='sans-serif'>" + tx(name).slice(0, 18) + "</text>";
    });
    return out;
  }

  function art(kind, item, thumb) {
    var photos = {
      off: "off.jpg?v=2", plate134: "plate134.jpg?v=7", plate410: "plate410.jpg?v=3", volts: "plate410.jpg?v=3",
      outdoor: "outdoor.jpg?v=1",
      cord: "cord.jpg", cord3: "cord-t1.jpg?v=1", board: "cord.jpg", cap: "cap.jpg", safety: "safety.jpg?v=2",
      cordL1: "cord-l1.jpg?v=1", cordPd: "cord-pd.jpg?v=1", cordLp: "cord-lp.jpg?v=1", cordHp: "cord-hp.jpg?v=1",
      cordCoil: "cord-coil.jpg?v=1", cordL2: "cord-l2.jpg?v=1", cordT1: "cord-t1.jpg?v=1",
      wall: "wall.jpg", cassette: "cassette.jpg", split: "wall.jpg", glass: "glass.jpg",
      faults: "faults.jpg", louver: "louver.jpg", comp: "comp.jpg", gauges: "gauges.jpg",
      nogauge: "nogauge.jpg", gas: "gas.jpg", tank: "tank.jpg", rad: "rad.jpg",
      base: "base.jpg", heater: "heater.jpg", water: "water.jpg", boiler: "boiler.jpg"
    };
    if (photos[kind]) {
      return "<img class='tv-art" + (thumb ? " tv-thumb" : "") + "' src='lesson-img/" + photos[kind] + "' alt='' />";
    }
    var names = item && item.look ? String(item.look).split(/ to /i) : ["From", "To"];
    if (kind === "cord3") names = ["T1", "Overload", "Common"];
    var common = "<rect width='320' height='128' rx='14' fill='#141b22'/><rect x='1' y='1' width='318' height='126' rx='13' fill='none' stroke='#3a4652'/>";
    var body = {
      off: "<rect x='108' y='28' width='104' height='72' rx='8' fill='#1c2630' stroke='#c5ced6' stroke-width='2'/><rect x='122' y='42' width='34' height='44' rx='4' fill='#e8c450'/><text x='166' y='70' fill='#f6f1e6' font-size='18' font-family='sans-serif'>OFF</text><text x='118' y='116' fill='#c5ced6' font-size='11' font-family='sans-serif'>Disconnect</text>",
      plate134: "<rect x='78' y='26' width='164' height='76' rx='4' fill='#e6ebf0' stroke='#8b97a3'/><text x='92' y='48' fill='#222' font-size='12' font-family='sans-serif'>TU-522</text><text x='92' y='72' fill='#111' font-size='18' font-family='sans-serif'>R-134a</text><text x='92' y='90' fill='#333' font-size='11' font-family='sans-serif'>Read the plate</text>",
      plate410: "<rect x='70' y='24' width='180' height='80' rx='4' fill='#e6ebf0' stroke='#8b97a3'/><text x='84' y='46' fill='#222' font-size='12' font-family='sans-serif'>TU-601</text><text x='84' y='70' fill='#111' font-size='18' font-family='sans-serif'>R-410A</text><text x='84' y='90' fill='#333' font-size='12' font-family='sans-serif'>208/230 V · 20 A</text>",
      volts: "<rect x='70' y='24' width='180' height='80' rx='4' fill='#e6ebf0' stroke='#8b97a3'/><text x='84' y='58' fill='#111' font-size='22' font-family='sans-serif'>208/230 V</text><text x='84' y='82' fill='#333' font-size='13' font-family='sans-serif'>Not 24 V · Not 120 V</text>",
      cord: jacks(names.slice(0, 2)),
      cord3: jacks(["T1", "Overload", "Common"]),
      board: "<text x='16' y='28' fill='#c5ced6' font-size='11' font-family='sans-serif'>Control string</text>" + jacks(["L1", "Safeties", "Coil"]),
      safety: "<rect x='118' y='30' width='84' height='50' rx='6' fill='#1c2630' stroke='#e07070' stroke-width='2'/><text x='132' y='60' fill='#f6f1e6' font-size='12' font-family='sans-serif'>LPC</text><path d='M128 38 L192 72 M192 38 L128 72' stroke='#e07070' stroke-width='4'/><text x='108' y='108' fill='#f6f1e6' font-size='13' font-family='sans-serif'>No jumper</text>",
      cap: "<rect x='36' y='34' width='52' height='58' rx='8' fill='#1c2630' stroke='#e8c450' stroke-width='2'/><text x='46' y='68' fill='#f6f1e6' font-size='11' font-family='sans-serif'>RUN</text><text x='40' y='110' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Stays in</text><rect x='134' y='40' width='52' height='36' rx='4' fill='#1c2630' stroke='#9ec0de'/><text x='140' y='62' fill='#f6f1e6' font-size='10' font-family='sans-serif'>RELAY</text><rect x='230' y='34' width='52' height='58' rx='8' fill='#1c2630' stroke='#9ec0de' stroke-width='2'/><text x='238' y='68' fill='#f6f1e6' font-size='11' font-family='sans-serif'>START</text><text x='214' y='110' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Drops out</text><path d='M88 62 H134 M186 58 H230' stroke='#e8c450' stroke-width='3'/>",
      wall: "<rect x='90' y='22' width='140' height='78' rx='6' fill='#1c2630' stroke='#e8c450' stroke-width='2'/><path d='M108 48 H212 M108 64 H212' stroke='#9ec0de'/><text x='112' y='116' fill='#f6f1e6' font-size='13' font-family='sans-serif'>High wall · zone 1</text>",
      cassette: "<rect x='100' y='28' width='120' height='70' rx='4' fill='#1c2630' stroke='#e8c450' stroke-width='2'/><rect x='124' y='46' width='72' height='34' fill='#10161c' stroke='#9ec0de'/><text x='96' y='116' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Cassette · zone 2</text>",
      split: "<rect x='16' y='36' width='84' height='58' rx='4' fill='#1c2630' stroke='#9ec0de'/><circle cx='58' cy='64' r='14' fill='none' stroke='#9ec0de'/><rect x='124' y='24' width='80' height='36' rx='4' fill='#1c2630' stroke='#e8c450'/><rect x='220' y='24' width='80' height='36' rx='4' fill='#1c2630' stroke='#e8c450'/><text x='28' y='112' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Outdoor</text><text x='136' y='78' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Wall</text><text x='224' y='78' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Cassette</text>",
      glass: "<rect x='148' y='18' width='24' height='78' rx='12' fill='#102433' stroke='#9ec0de' stroke-width='2'/><rect x='152' y='48' width='16' height='22' fill='#7ec8e3'/><circle cx='160' cy='70' r='2' fill='#fff'/><text x='108' y='114' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Sight glass</text>",
      louver: "<rect x='48' y='28' width='180' height='70' rx='4' fill='#1c2630' stroke='#8b97a3'/><path d='M64 44 H212 M64 60 H212 M64 76 H212' stroke='#e8c450' stroke-width='4'/><path d='M236 62 H286' stroke='#9ec0de' stroke-width='3'/><text x='100' y='116' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Louver open · air through</text>",
      faults: "<rect x='36' y='40' width='28' height='40' rx='3' fill='#e8c450'/><rect x='84' y='40' width='28' height='40' rx='3' fill='#3a4652'/><rect x='132' y='40' width='28' height='40' rx='3' fill='#3a4652'/><rect x='180' y='40' width='28' height='40' rx='3' fill='#3a4652'/><rect x='228' y='40' width='28' height='40' rx='3' fill='#3a4652'/><text x='86' y='108' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Leave the switches</text>",
      comp: "<circle cx='150' cy='58' r='34' fill='#1c2630' stroke='#e8c450' stroke-width='3'/><text x='138' y='62' fill='#f6f1e6' font-size='12' font-family='sans-serif'>C</text><rect x='200' y='36' width='70' height='44' rx='4' fill='#10161c' stroke='#e07070'/><text x='208' y='62' fill='#f6f1e6' font-size='11' font-family='sans-serif'>No live ohms</text>",
      gauges: "<circle cx='70' cy='58' r='28' fill='#102033' stroke='#3aa0ff' stroke-width='4'/><circle cx='160' cy='58' r='28' fill='#2a1214' stroke='#e07070' stroke-width='4'/><circle cx='250' cy='58' r='28' fill='#2a220c' stroke='#e8c450' stroke-width='4'/><text x='52' y='108' fill='#9ecbff' font-size='12' font-family='sans-serif'>Blue</text><text x='142' y='108' fill='#f0a0a0' font-size='12' font-family='sans-serif'>Red</text><text x='214' y='108' fill='#e8c450' font-size='12' font-family='sans-serif'>Yellow capped</text>",
      nogauge: "<rect x='24' y='40' width='70' height='48' rx='4' fill='#1c2630' stroke='#e07070'/><text x='36' y='68' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Boiler</text><path d='M110 64 H150' stroke='#8b97a3' stroke-width='4'/><circle cx='200' cy='58' r='24' fill='#102033' stroke='#3aa0ff' stroke-width='3'/><path d='M176 40 L224 80' stroke='#e07070' stroke-width='4'/><text x='70' y='112' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Gauges stay off this copper</text>",
      gas: "<rect x='20' y='48' width='58' height='28' rx='4' fill='#1c2630' stroke='#8b97a3'/><text x='28' y='66' fill='#f6f1e6' font-size='10' font-family='sans-serif'>Inducer</text><path d='M82 62 H100' stroke='#8b97a3'/><rect x='100' y='48' width='50' height='28' rx='4' fill='#1c2630' stroke='#8b97a3'/><text x='108' y='66' fill='#f6f1e6' font-size='10' font-family='sans-serif'>Prove</text><path d='M154 62 H172' stroke='#8b97a3'/><rect x='172' y='44' width='70' height='36' rx='4' fill='#1c2630' stroke='#e8c450' stroke-width='2'/><text x='180' y='66' fill='#e8c450' font-size='11' font-family='sans-serif'>VALVE</text><text x='86' y='108' fill='#f6f1e6' font-size='12' font-family='sans-serif'>Gas valve is last</text>",
      stat: "<rect x='118' y='18' width='84' height='92' rx='8' fill='#1c2630' stroke='#e8c450' stroke-width='2'/><text x='136' y='70' fill='#f6f1e6' font-size='28' font-family='sans-serif'>72</text>",
      fan: "<circle cx='150' cy='58' r='32' fill='none' stroke='#9ec0de' stroke-width='3'/><path d='M150 58 L150 30 M150 58 L178 72 M150 58 L122 72' stroke='#e8c450' stroke-width='3'/><text x='118' y='112' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Air first</text>",
      tank: "<ellipse cx='150' cy='62' rx='40' ry='30' fill='#1c2630' stroke='#9ec0de' stroke-width='3'/><path d='M150 92 V110 M120 110 H180' stroke='#9ec0de' stroke-width='3'/><text x='78' y='28' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Expansion tank · not a receiver</text>",
      rad: "<rect x='40' y='36' width='240' height='56' rx='4' fill='#1c2630' stroke='#e07070'/><path d='M60 36 V92 M100 36 V92 M140 36 V92 M180 36 V92 M220 36 V92' stroke='#e07070'/><text x='110' y='116' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Radiator · zone 1</text>",
      base: "<rect x='24' y='70' width='272' height='22' rx='3' fill='#1c2630' stroke='#e8c450'/><path d='M40 70 V92 M80 70 V92 M120 70 V92 M160 70 V92 M200 70 V92 M240 70 V92' stroke='#e8c450'/><text x='90' y='48' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Baseboard · zone 2</text>",
      heater: "<rect x='70' y='30' width='160' height='64' rx='4' fill='#1c2630' stroke='#e8c450'/><circle cx='200' cy='62' r='16' fill='none' stroke='#9ec0de'/><text x='96' y='114' fill='#f6f1e6' font-size='13' font-family='sans-serif'>Unit heater · zone 3</text>",
      water: "<rect x='90' y='20' width='70' height='88' rx='6' fill='#1c2630' stroke='#e07070'/><rect x='112' y='36' width='16' height='50' rx='4' fill='#102433' stroke='#9ec0de'/><rect x='116' y='58' width='8' height='24' fill='#3aa0ff'/><text x='176' y='64' fill='#f6f1e6' font-size='12' font-family='sans-serif'>Water in</text><text x='176' y='84' fill='#f6f1e6' font-size='12' font-family='sans-serif'>Limit closed</text>",
      boiler: "<rect x='28' y='34' width='78' height='56' rx='4' fill='#1c2630' stroke='#e07070' stroke-width='2'/><text x='40' y='66' fill='#f6f1e6' font-size='12' font-family='sans-serif'>Boiler</text><rect x='140' y='40' width='48' height='28' rx='3' fill='#1c2630' stroke='#e8c450'/><rect x='198' y='40' width='48' height='28' rx='3' fill='#1c2630' stroke='#e8c450'/><rect x='256' y='40' width='48' height='28' rx='3' fill='#1c2630' stroke='#e8c450'/><text x='130' y='96' fill='#f6f1e6' font-size='11' font-family='sans-serif'>Water · 3 zones</text>",
      charge: "<rect x='40' y='28' width='34' height='70' rx='6' fill='#1c2630' stroke='#e8c450'/><text x='46' y='68' fill='#f6f1e6' font-size='10' font-family='sans-serif'>REC</text><path d='M80 62 H130' stroke='#e8c450' stroke-width='3'/><circle cx='176' cy='62' r='26' fill='none' stroke='#9ec0de' stroke-width='3'/><text x='150' y='110' fill='#f6f1e6' font-size='12' font-family='sans-serif'>Recover, then vacuum</text>",
      torch: "<rect x='48' y='30' width='30' height='68' rx='6' fill='#1c2630' stroke='#9ec0de'/><text x='52' y='70' fill='#f6f1e6' font-size='9' font-family='sans-serif'>N2</text><path d='M90 70 H140' stroke='#9ec0de' stroke-width='3'/><path d='M160 78 C160 40 230 40 230 78' fill='none' stroke='#e07070' stroke-width='3'/><text x='100' y='112' fill='#f6f1e6' font-size='12' font-family='sans-serif'>Nitrogen on · not oxygen</text>",
      trainer: "<rect x='40' y='28' width='240' height='72' rx='8' fill='#1c2630' stroke='#8b97a3'/><text x='108' y='70' fill='#f6f1e6' font-size='16' font-family='sans-serif'>The trainer</text>"
    };
    return "<svg class='tv-art" + (thumb ? " tv-thumb" : "") + "' viewBox='0 0 320 128' role='img' aria-hidden='true'>" + common + (body[kind] || body.trainer) + "</svg>";
  }

  function guideFor(id) {
    if (GUIDES[id]) return GUIDES[id];
    var all = global.TrainerLessons || {};
    return all[id] || null;
  }
  function has(id) { return !!guideFor(id); }

  function key(id) {
    var school = (global.SchoolPack && global.SchoolPack.id) || "school";
    return "lt-vision-" + school + "-" + id;
  }
  function load(id) {
    try { return JSON.parse(localStorage.getItem(key(id)) || "{}"); } catch (e) { return {}; }
  }
  function save(id, data) {
    try { localStorage.setItem(key(id), JSON.stringify(data)); } catch (e) {}
  }
  function good(item, value) {
    var v = String(value || "").trim();
    if (!v) return false;
    if (item.must) return v === item.must;
    if (item.accept) return item.accept.some(function (a) { return v.toLowerCase().indexOf(a) >= 0; });
    return true;
  }

  function sw(x, y, open) {
    var arm = open
      ? '<line x1="' + (x - 16) + '" y1="' + (y + 14) + '" x2="' + (x + 16) + '" y2="' + (y - 10) + '" stroke="#1a1a1a" stroke-width="2"/>' +
        '<circle cx="' + (x - 16) + '" cy="' + (y + 8) + '" r="3" fill="#1a1a1a"/>'
      : '<line x1="' + (x - 16) + '" y1="' + (y - 12) + '" x2="' + (x + 16) + '" y2="' + (y + 12) + '" stroke="#1a1a1a" stroke-width="2"/>' +
        '<circle cx="' + (x - 16) + '" cy="' + (y - 8) + '" r="3" fill="#1a1a1a"/>' +
        '<circle cx="' + (x + 16) + '" cy="' + (y + 8) + '" r="3" fill="#1a1a1a"/>';
    return '<line x1="' + (x - 22) + '" y1="' + y + '" x2="' + (x + 22) + '" y2="' + y + '" stroke="#f7f4ee" stroke-width="7"/>' + arm;
  }
  function cap(x, y) {
    return '<line x1="' + (x - 18) + '" y1="' + y + '" x2="' + (x + 18) + '" y2="' + y + '" stroke="#f7f4ee" stroke-width="7"/>' +
      '<line x1="' + (x - 6) + '" y1="' + (y - 14) + '" x2="' + (x - 6) + '" y2="' + (y + 14) + '" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="' + (x + 6) + '" y1="' + (y - 14) + '" x2="' + (x + 6) + '" y2="' + (y + 14) + '" stroke="#1a1a1a" stroke-width="2"/>';
  }
  function circuitSvg() {
    return (
      '<svg class="tv-schematic" viewBox="0 0 400 900" role="img" aria-label="TU-522 schematic">' +
      '<rect width="400" height="900" fill="#f7f4ee"/>' +
      '<text x="16" y="28" fill="#1a1a1a" font-size="16" font-weight="700" font-family="sans-serif">TU-522 schematic</text>' +
      '<text x="16" y="48" fill="#444" font-size="11" font-family="sans-serif">Stop is closed. Start is open. Timer waits, then the coil.</text>' +
      '<text x="8" y="86" fill="#1a1a1a" font-size="13" font-weight="700" font-family="sans-serif">L1</text>' +
      '<text x="366" y="86" fill="#1a1a1a" font-size="13" font-weight="700" font-family="sans-serif">L2</text>' +
      '<line x1="24" y1="96" x2="24" y2="780" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="376" y1="96" x2="376" y2="780" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="32" y="124" fill="#666" font-size="10" font-family="sans-serif">CONTROL</text>' +
      '<line x1="24" y1="168" x2="376" y2="168" stroke="#1a1a1a" stroke-width="2"/>' +
      sw(70, 168, false) +
      '<text x="70" y="204" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">STOP</text>' +
      sw(150, 168, true) +
      '<text x="150" y="204" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">START</text>' +
      '<line x1="118" y1="168" x2="118" y2="128" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="182" y1="168" x2="182" y2="128" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="118" y1="128" x2="182" y2="128" stroke="#1a1a1a" stroke-width="2"/>' +
      sw(150, 128, true) +
      '<text x="150" y="112" text-anchor="middle" fill="#1a1a1a" font-size="9" font-family="sans-serif">SEAL</text>' +
      sw(240, 168, true) +
      '<text x="240" y="204" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">TC</text>' +
      sw(320, 168, true) +
      '<text x="320" y="204" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">PD</text>' +
      '<line x1="24" y1="270" x2="376" y2="270" stroke="#1a1a1a" stroke-width="2"/>' +
      sw(70, 270, true) +
      '<text x="70" y="306" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">LPC</text>' +
      sw(150, 270, true) +
      '<text x="150" y="306" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">HPC</text>' +
      sw(250, 270, true) +
      '<path d="M232 286 H268" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>' +
      '<path d="M260 280 L272 286 L260 292" fill="none" stroke="#1a1a1a" stroke-width="1.5"/>' +
      '<text x="250" y="322" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">TIMER</text>' +
      '<line x1="308" y1="270" x2="352" y2="270" stroke="#f7f4ee" stroke-width="7"/>' +
      '<circle cx="330" cy="270" r="14" fill="#f7f4ee" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="330" y="274" text-anchor="middle" fill="#1a1a1a" font-size="12" font-weight="700" font-family="sans-serif">C</text>' +
      '<text x="330" y="306" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">COIL</text>' +
      '<text x="32" y="370" fill="#666" font-size="10" font-family="sans-serif">LOAD</text>' +
      '<line x1="24" y1="410" x2="376" y2="410" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="70" y1="410" x2="130" y2="410" stroke="#f7f4ee" stroke-width="7"/>' +
      '<line x1="78" y1="396" x2="122" y2="410" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="66" y1="422" x2="134" y2="422" stroke="#1a1a1a" stroke-width="1.5"/>' +
      '<text x="100" y="446" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">T1</text>' +
      '<line x1="180" y1="410" x2="230" y2="410" stroke="#f7f4ee" stroke-width="7"/>' +
      '<path d="M188 410 C200 392 212 428 224 410" fill="none" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="205" y="446" text-anchor="middle" fill="#1a1a1a" font-size="11" font-weight="700" font-family="sans-serif">OL</text>' +
      '<circle cx="290" cy="410" r="4" fill="#1a1a1a"/>' +
      '<text x="290" y="446" text-anchor="middle" fill="#1a1a1a" font-size="12" font-weight="700" font-family="sans-serif">C</text>' +
      '<line x1="290" y1="410" x2="290" y2="520" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="24" y1="520" x2="376" y2="520" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="32" y="508" fill="#666" font-size="10" font-family="sans-serif">RUN · stays in</text>' +
      '<path d="M70 520 C82 500 94 540 106 520 C118 500 130 540 142 520" fill="none" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="106" y="556" text-anchor="middle" fill="#1a1a1a" font-size="10" font-family="sans-serif">RUN</text>' +
      cap(210, 520) +
      '<text x="210" y="556" text-anchor="middle" fill="#1a1a1a" font-size="10" font-family="sans-serif">RUN CAP</text>' +
      '<line x1="290" y1="520" x2="290" y2="660" stroke="#1a1a1a" stroke-width="2"/>' +
      '<line x1="24" y1="660" x2="376" y2="660" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="32" y="648" fill="#666" font-size="10" font-family="sans-serif">START · drops out</text>' +
      '<path d="M60 660 C72 640 84 680 96 660 C108 640 120 680 132 660" fill="none" stroke="#1a1a1a" stroke-width="2"/>' +
      '<text x="96" y="696" text-anchor="middle" fill="#1a1a1a" font-size="10" font-family="sans-serif">START</text>' +
      cap(190, 660) +
      '<text x="190" y="696" text-anchor="middle" fill="#1a1a1a" font-size="10" font-family="sans-serif">START CAP</text>' +
      sw(280, 660, true) +
      '<text x="280" y="696" text-anchor="middle" fill="#1a1a1a" font-size="10" font-family="sans-serif">POT</text>' +
      '<text x="16" y="760" fill="#8a1c2b" font-size="12" font-weight="700" font-family="sans-serif">Press START. The timer runs. Then the coil.</text>' +
      '<text x="16" y="784" fill="#333" font-size="11" font-family="sans-serif">On this trainer, land the safeties in order.</text>' +
      '<text x="16" y="804" fill="#333" font-size="11" font-family="sans-serif">Do not jumper a pressure control or the timer.</text>' +
      '<text x="16" y="836" fill="#555" font-size="11" font-family="sans-serif">Start, stop, and the timer are how this string</text>' +
      '<text x="16" y="854" fill="#555" font-size="11" font-family="sans-serif">works on a unit in the field.</text>' +
      "</svg>"
    );
  }

  function mount(host, unit) {
    if (!host || !unit || !guideFor(unit.id)) return { stop: function () {} };
    var guide = guideFor(unit.id);
    var rows = guide.steps;
    var saved = load(unit.id);
    var step = saved.done ? rows.length : (saved.step || 0);
    var page = saved.done ? "done" : (saved.step > 0 ? "steps" : (saved.page || "cover"));
    var answers = saved.answers || {};
    var say = "";

    function persist() { save(unit.id, { step: step, page: page, answers: answers, done: step >= rows.length && page === "steps" }); }
    function render() {
      if (page === "cover") {
        host.innerHTML =
          '<div class="tv"><p class="tv-src">' + ((global.LtBrand && global.LtBrand.org) || "HVAC Legends") + ' lab · ' + unit.model + '</p>' +
          art(artFor(null, unit), null) +
          '<p class="tv-look">' + unit.model + '</p>' +
          '<p class="tv-say">' + guide.cover + '</p>' +
          '<ul class="tv-need">' + guide.need.map(function (n) { return "<li>" + n + "</li>"; }).join("") + "</ul>" +
          '<p class="tv-src">' + guide.source + "</p>" +
          (unit.id === "tu522" ? '<button type="button" class="btn" id="tv-circuit">See the circuit</button>' : "") +
          '<button type="button" class="btn primary" id="tv-start">Start at the machine</button></div>';
        var circuitBtn = host.querySelector("#tv-circuit");
        if (circuitBtn) circuitBtn.onclick = function () { page = "circuit"; persist(); render(); };
        host.querySelector("#tv-start").onclick = function () { page = "steps"; persist(); render(); };
        return;
      }
      if (page === "circuit") {
        host.innerHTML =
          '<div class="tv">' + circuitSvg() +
          '<div class="bs-nav"><button type="button" class="btn" id="tv-circuit-back">Back</button>' +
          '<button type="button" class="btn primary" id="tv-start">Start at the machine</button></div></div>';
        host.querySelector("#tv-circuit-back").onclick = function () {
          page = step > 0 && step < rows.length ? "steps" : "cover";
          persist();
          render();
        };
        host.querySelector("#tv-start").onclick = function () { page = "steps"; persist(); render(); };
        return;
      }
      if (step >= rows.length) {
        host.innerHTML =
          '<div class="tv"><p class="tv-look">DONE</p><p class="tv-say">Show the phone to the instructor. Then practice the same trainer at home.</p>' +
          '<button type="button" class="btn" id="tv-again">Start over</button></div>';
        host.querySelector("#tv-again").onclick = function () { step = 0; page = "cover"; answers = {}; say = ""; persist(); render(); };
        return;
      }
      var item = rows[step];
      var prior = "";
      if (step > 0) {
        prior = '<div class="ms-built tv-built"><p class="ms-chapter">Already checked</p>';
        for (var p = 0; p < step; p++) {
          var prev = rows[p];
          prior += '<figure class="done">' + art(artFor(prev, unit), prev, true) + "<figcaption>" + (p + 1) + "</figcaption></figure>";
        }
        prior += "</div>";
      }
      var val = answers[item.id] || answers[step] || "";
      var field = item.kind === "text"
        ? '<input class="bs-write" id="tv-write" type="text" enterkeyhint="done" placeholder="' + (item.placeholder || "Write it") + '" value="' + String(val).replace(/["<>]/g, "") + '" />'
        : '<div class="bs-choices">' + item.choices.map(function (c) {
            return '<button type="button" class="bs-choice' + (val === c ? " on" : "") + '" data-choice="' + c.replace(/"/g, "") + '">' + c + "</button>";
          }).join("") + "</div>";
      var big = item.say;
      var small = "";
      if (item.look && item.say.toLowerCase().indexOf(item.look.toLowerCase()) !== 0) {
        big = item.look;
        small = item.say;
      }
      host.innerHTML =
        '<div class="tv">' +
        prior +
        art(artFor(item, unit), item) +
        '<p class="tv-count">Step ' + (step + 1) + " of " + rows.length + (unit.id === "tu522" ? ' · <button type="button" class="tv-link" id="tv-circuit">Circuit</button>' : "") + "</p>" +
        '<p class="tv-look">' + big + "</p>" +
        (small ? '<p class="tv-say">' + small + "</p>" : "") +
        (say ? '<p class="bs-block">' + say + "</p>" : "") +
        field +
        '<div class="bs-nav"><button type="button" class="btn" id="tv-back"' + (step ? "" : " disabled") + '>Back</button><button type="button" class="btn primary" id="tv-next">Next</button></div></div>';
      host.querySelectorAll("[data-choice]").forEach(function (b) {
        b.onclick = function () { answers[step] = b.getAttribute("data-choice"); say = ""; persist(); render(); };
      });
      var circuitLink = host.querySelector("#tv-circuit");
      if (circuitLink) circuitLink.onclick = function () { page = "circuit"; persist(); render(); };
      var write = host.querySelector("#tv-write");
      if (write) write.oninput = function () { answers[step] = write.value; persist(); };
      var back = host.querySelector("#tv-back");
      if (back) back.onclick = function () {
        if (step) { step -= 1; say = ""; persist(); render(); }
        else { page = "cover"; persist(); render(); }
      };
      host.querySelector("#tv-next").onclick = function () {
        var live = write ? write.value : answers[step];
        answers[step] = live || "";
        if (!good(item, answers[step])) {
          say = item.block || item.miss || "Look at the trainer, then answer.";
          persist();
          render();
          return;
        }
        say = "";
        step += 1;
        persist();
        render();
      };
    }
    render();
    return { stop: function () { host.innerHTML = ""; } };
  }

  function finished(id) { return !!(load(id) && load(id).done); }

  global.TrainerVision = { has: has, mount: mount, finished: finished, art: art, artFor: artFor };
})(window);
