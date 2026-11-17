/* Shop troubleshooting. Original lessons. Pictures are diagrams, not a channel's frames.
   Superheat, subcooling, then a card for each machine and each gas. */
(function (global) {
  "use strict";

  var KEY = "lt-trouble-v2";
  var root = null;
  var view = "home";
  var listId = "basic";
  var item = null;
  var step = 0;
  var picked = -1;

  function doneIds() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch (e) { return []; }
  }
  function mark(id) {
    var d = doneIds();
    if (d.indexOf(id) < 0) d.push(id);
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function svgWrap(inner) {
    return '<svg viewBox="0 0 360 200" class="tr-pic" role="img">' + inner + "</svg>";
  }
  function label(x, y, text, fill) {
    return '<text x="' + x + '" y="' + y + '" fill="' + (fill || "#f4efe6") + '" font-size="13" font-family="IBM Plex Sans,sans-serif" font-weight="700">' + text + "</text>";
  }
  function box(x, y, w, h, fill, stroke) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + fill + '" stroke="' + (stroke || "#3a4654") + '" stroke-width="2"/>';
  }

  var SCENES = {
    cycle: function () {
      return svgWrap(
        box(18, 28, 150, 64, "#14202b") +
        box(192, 28, 150, 64, "#2a1814") +
        box(192, 112, 150, 64, "#14281c") +
        box(18, 112, 150, 64, "#142028") +
        label(36, 54, "EVAPORATOR", "#9fd4ff") +
        label(36, 74, "Superheat here") +
        label(214, 54, "CONDENSER", "#ffb199") +
        label(214, 74, "Subcooling here") +
        label(214, 138, "METERING", "#b6f5cf") +
        label(214, 158, "Piston or TXV") +
        label(36, 138, "COMPRESSOR", "#f4efe6") +
        label(36, 158, "Vapor only") +
        '<path d="M168 60 H192 M342 92 V112 M192 144 H168 M18 144 V92" fill="none" stroke="#d4a24a" stroke-width="3"/>'
      );
    },
    sh: function () {
      return svgWrap(
        box(16, 20, 328, 160, "#101820") +
        label(32, 52, "SUCTION LINE", "#9fd4ff") +
        label(32, 86, "Line temperature     50") +
        label(32, 114, "Saturation            40") +
        label(32, 154, "Superheat              10", "#b6f5cf")
      );
    },
    sc: function () {
      return svgWrap(
        box(16, 20, 328, 160, "#101820") +
        label(32, 52, "LIQUID LINE", "#b6f5cf") +
        label(32, 86, "Saturation            110") +
        label(32, 114, "Line temperature     100") +
        label(32, 154, "Subcooling              10", "#b6f5cf")
      );
    },
    gauges: function () {
      return svgWrap(
        '<circle cx="110" cy="100" r="52" fill="#0c1828" stroke="#3aa0ff" stroke-width="6"/>' +
        '<circle cx="250" cy="100" r="52" fill="#280e0e" stroke="#ff5a3c" stroke-width="6"/>' +
        label(78, 104, "LOW") +
        label(214, 104, "HIGH") +
        label(70, 180, "Needles are not a charge")
      );
    },
    ice: function () {
      return svgWrap(
        box(24, 40, 140, 110, "#d7f3ff", "#9fd4ff") +
        label(48, 100, "ICE", "#123") +
        box(190, 50, 140, 90, "#1a1a1a", "#666") +
        label(214, 100, "FILTER", "#f4efe6") +
        label(24, 180, "Low superheat. Do not add gas.")
      );
    },
    leak: function () {
      return svgWrap(
        box(20, 40, 150, 120, "#1a140e", "#d4a24a") +
        label(36, 90, "WARM", "#ffb199") +
        label(36, 112, "suction") +
        box(190, 40, 150, 120, "#101820") +
        label(206, 90, "SC low", "#ffb199") +
        label(206, 112, "SH high") +
        label(20, 184, "Undercharge. Find the leak.")
      );
    },
    restrict: function () {
      return svgWrap(
        box(30, 70, 70, 36, "#9fd4ff", "#fff") +
        label(40, 92, "FROST", "#123") +
        box(140, 48, 180, 100, "#101820") +
        label(156, 88, "SH high", "#ffb199") +
        label(156, 114, "SC high", "#ffb199") +
        label(30, 170, "Starved coil. Liquid is stacked.")
      );
    },
    bulb: function () {
      return svgWrap(
        '<rect x="40" y="90" width="200" height="18" rx="8" fill="#8b98a5"/>' +
        '<rect x="230" y="40" width="70" height="28" rx="8" fill="#d4a24a"/>' +
        label(242, 59, "BULB", "#123") +
        '<path d="M248 68 V90" stroke="#d4a24a" stroke-width="3" stroke-dasharray="4 3"/>' +
        label(40, 150, "Bulb is not on the pipe") +
        label(40, 172, "The valve is guessing")
      );
    },
    dirty: function () {
      return svgWrap(
        box(30, 36, 140, 120, "#3a3a32", "#d4a24a") +
        label(52, 100, "MATTED", "#f4efe6") +
        box(190, 36, 140, 120, "#2a1210") +
        label(214, 90, "HEAD", "#ffb199") +
        label(214, 114, "HIGH") +
        label(30, 180, "Clean it before you move gas")
      );
    },
    ok: function () {
      return svgWrap(
        box(20, 40, 150, 110, "#10281c", "#3dff9a") +
        label(36, 88, "SH in range", "#b6f5cf") +
        label(36, 112, "SC in range") +
        box(190, 40, 150, 110, "#10281c", "#3dff9a") +
        label(206, 88, "Air is cold", "#b6f5cf") +
        label(206, 112, "Amps honest") +
        label(20, 178, "Leave the charge alone")
      );
    },
    furnace: function () {
      var names = ["Call", "Inducer", "Switch", "Ignitor", "Gas", "Flame"];
      var out = "";
      for (var i = 0; i < names.length; i++) {
        var x = 12 + i * 58;
        out += box(x, 70, 52, 44, i === 0 ? "#3a2018" : "#141b22", i === 0 ? "#ff6b4a" : "#3a4654");
        out += '<text x="' + (x + 6) + '" y="96" fill="#f4efe6" font-size="9" font-family="sans-serif" font-weight="700">' + names[i] + "</text>";
      }
      return svgWrap(out + label(16, 150, "In this order. Do not jump the gas valve."));
    },
    heat: function () {
      return svgWrap(
        box(24, 36, 150, 120, "#d7f3ff", "#9fd4ff") +
        label(48, 100, "OUTDOOR", "#123") +
        label(56, 118, "ICE", "#123") +
        box(190, 36, 146, 120, "#101820") +
        label(206, 90, "HEAT MODE", "#ffb199") +
        label(206, 114, "Defrost first")
      );
    },
    walkin: function () {
      return svgWrap(
        box(40, 30, 160, 140, "#101820", "#9fd4ff") +
        box(168, 50, 18, 100, "#d4a24a") +
        label(58, 100, "BOX WARM") +
        label(220, 90, "DOOR", "#d4a24a") +
        label(220, 112, "WON'T") +
        label(220, 132, "SEAL")
      );
    },
    freezer: function () {
      return svgWrap(
        box(70, 30, 220, 140, "#e7f7ff", "#fff") +
        label(110, 100, "COIL IS A", "#123") +
        label(110, 122, "BLOCK OF ICE", "#123") +
        label(16, 24, "") 
      );
    },
    fridge: function () {
      return svgWrap(
        box(80, 24, 200, 156, "#1a222c", "#9fd4ff") +
        box(96, 40, 168, 70, "#10161c") +
        label(118, 78, "LIGHT FROST", "#9fd4ff") +
        label(118, 140, "Not a snowball")
      );
    },
    icem: function () {
      return svgWrap(
        box(20, 40, 150, 120, "#10243a", "#3aa0ff") +
        label(48, 95, "FREEZE", "#9fd4ff") +
        label(36, 118, "makes the ice") +
        box(190, 40, 150, 120, "#2a2210", "#d4a24a") +
        label(214, 95, "HARVEST", "#d4a24a") +
        label(214, 118, "drops the ice")
      );
    },
    gas: function () {
      var names = ["410A", "454B", "32", "22", "134a", "404A", "448A", "290", "CO2"];
      var out = "";
      for (var i = 0; i < names.length; i++) {
        var x = 16 + (i % 5) * 70;
        var y = 28 + Math.floor(i / 5) * 78;
        out += box(x, y, 60, 60, "#141b22", "#d4a24a");
        out += '<text x="' + (x + 8) + '" y="' + (y + 36) + '" fill="#f4efe6" font-size="12" font-family="sans-serif" font-weight="700">' + names[i] + "</text>";
      }
      return svgWrap(out);
    },
    r290: function () {
      return svgWrap(
        box(80, 30, 200, 140, "#2a1210", "#ff5a3c") +
        label(110, 90, "NO PORTS", "#ffb199") +
        label(100, 116, "Do not gauge it")
      );
    },
    co2: function () {
      return svgWrap(
        box(40, 36, 280, 120, "#101820", "#ff5a3c") +
        label(58, 90, "CO2 IS NOT 410A", "#ffb199") +
        label(58, 116, "Read the data plate")
      );
    }
  };

  function pic(name) {
    return '<img class="tr-pic" alt="" src="trouble/' + name + '.jpg" />';
  }

  var CALLS = [
    {
      id: "b-sh", level: "basic", pic: "sh", title: "What superheat is",
      see: "Suction saturation is 40°. The suction line is 50°. Airflow is fine.",
      ask: "What is the superheat, and what does it tell you?",
      choices: [
        { t: "10°. The vapor picked up 10° after it finished boiling.", ok: true, why: "Superheat is line temperature minus saturation. Some superheat means liquid is not going back to the compressor." },
        { t: "90°. Add the two numbers.", ok: false, why: "You subtract. Line minus saturation." },
        { t: "It is subcooling.", ok: false, why: "Subcooling is on the liquid line. This clamp is on the suction line." }
      ]
    },
    {
      id: "b-sc", level: "basic", pic: "sc", title: "What subcooling is",
      see: "Liquid saturation is 110°. The liquid line is 100°.",
      ask: "What is the subcooling?",
      choices: [
        { t: "10°. The condenser made liquid and cooled it a little more.", ok: true, why: "Subcooling is saturation minus liquid-line temperature. You have a column of liquid, not a line full of bubbles." },
        { t: "210°. The condenser is empty.", ok: false, why: "Subtract. 110 minus 100." },
        { t: "0°. Pressure is the whole story.", ok: false, why: "Pressure only gave you saturation. The clamp gave you the rest." }
      ]
    },
    {
      id: "b-psi", level: "basic", pic: "gauges", title: "Pressure is not the charge",
      see: "Suction looks like a number you remember. You have no line temperature. Outdoor air is not the same as last time.",
      ask: "What do you do before you add gas?",
      choices: [
        { t: "Get saturation and both line temperatures. Then decide.", ok: true, why: "The same pressure can be a good charge, a low charge, or a dirty coil. The needles do not know." },
        { t: "Add gas until the blue needle matches memory.", ok: false, why: "That is how sealed systems get overcharged." },
        { t: "Recover until the red needle drops, no temps.", ok: false, why: "You still have not measured superheat or subcooling." }
      ]
    },
    {
      id: "b-air", level: "basic", pic: "ice", title: "Frozen coil",
      see: "Filter is packed. Evaporator is ice. Suction saturation is under 32°. Superheat is about 2°. Subcooling is ordinary.",
      ask: "What do you prove first?",
      choices: [
        { t: "Airflow. Filter, wheel, and the coil face.", ok: true, why: "Low superheat and a frozen coil means the refrigerant is not getting heat. Do not add gas to a low suction that ice caused." },
        { t: "Add refrigerant to raise suction.", ok: false, why: "The coil is already flooded with boiling liquid. More gas makes it worse." },
        { t: "Change the compressor. It is not pumping.", ok: false, why: "You have not proved the compressor. The air failed first." }
      ]
    },
    {
      id: "b-low", level: "basic", pic: "leak", title: "Undercharge",
      see: "Airflow is good. Superheat is high. Subcooling is almost nothing. Suction is low. Supply air is weak.",
      ask: "What is the picture?",
      choices: [
        { t: "Low charge. Find the leak before you top it off.", ok: true, why: "High superheat and low subcooling together means the evaporator ran out of liquid early and the condenser has little spare liquid." },
        { t: "Bad TXV. Replace it.", ok: false, why: "A valve that will not feed usually keeps subcooling high. This subcooling is low." },
        { t: "Dirty filter.", ok: false, why: "A dirty filter gives low superheat and ice, not a warm suction line." }
      ]
    },
    {
      id: "b-piston", level: "basic", pic: "cycle", title: "Piston uses the chart",
      see: "Fixed orifice. No bulb. You have indoor wet bulb and outdoor dry bulb. Superheat is the number that has to hit the chart.",
      ask: "How do you know a piston system is charged right?",
      choices: [
        { t: "Total superheat matches today's chart. Coil is sweaty, not ice.", ok: true, why: "A piston cannot think. The chart is the target. Subcooling is only a clue on a piston." },
        { t: "Subcooling matches a TXV nameplate.", ok: false, why: "That is the TXV method. A piston will hold a wrong charge and still show some subcooling." },
        { t: "Suction pressure matches last July.", ok: false, why: "Load changed. Use wet bulb and outdoor dry bulb." }
      ]
    },
    {
      id: "b-txv", level: "basic", pic: "cycle", title: "TXV uses subcooling",
      see: "The metering device has a bulb. Nameplate says 10° subcooling. Superheat is steady near 10°. Airflow is good.",
      ask: "How do you know this one is right?",
      choices: [
        { t: "Subcooling is on the nameplate and superheat stays in the valve's band.", ok: true, why: "You charge a TXV by subcooling. Superheat tells you the valve is still in control. You do not add gas just to move superheat." },
        { t: "Add gas until superheat is 10°, ignore subcooling.", ok: false, why: "The valve will chase superheat while the charge is still wrong." },
        { t: "Use the piston wet-bulb chart.", ok: false, why: "That chart is for a fixed orifice." }
      ]
    },
    {
      id: "b-dirty", level: "basic", pic: "dirty", title: "Dirty condenser",
      see: "Cooling. Head is high for the outdoor temperature. Coil is matted. Superheat is near normal. Fan is slow.",
      ask: "What do you prove first?",
      choices: [
        { t: "Coil and fan. Head should fall when the air moves.", ok: true, why: "Stuck heat raises head. Do not pull gas to hide a dirty coil." },
        { t: "Recover refrigerant until the head looks familiar.", ok: false, why: "You will be low on charge the hour the coil is clean." },
        { t: "Add gas. High head means it needs more.", ok: false, why: "More gas on a dirty coil drives the head higher." }
      ]
    },
    {
      id: "a-rest", level: "advanced", pic: "restrict", title: "Restriction",
      see: "Walk-in is warm. Superheat at the bulb is high. Subcooling is high. Frost ring on the drier. Suction is low.",
      ask: "What failed?",
      choices: [
        { t: "Something is stopping the liquid. Find the temperature drop.", ok: true, why: "High superheat and high subcooling means liquid is backed up and the coil is starved. A low charge would have low subcooling." },
        { t: "Add gas for the low suction.", ok: false, why: "That stacks more liquid and the head climbs. The drier is the cold part." },
        { t: "The compressor is weak.", ok: false, why: "A weak compressor does not put a frost ring on a drier." }
      ]
    },
    {
      id: "a-bulb", level: "advanced", pic: "bulb", title: "Bulb off the pipe",
      see: "TXV bulb is hanging in the air, not strapped. Superheat is very low. Suction is up. The compressor shell is sweating.",
      ask: "What do you do before you change the valve or the compressor?",
      choices: [
        { t: "Strap the bulb on a clean suction line and insulate it. Recheck.", ok: true, why: "A warm bulb drives the valve open. Floodback can be a loose bulb, not a bad compressor." },
        { t: "Replace the compressor for floodback.", ok: false, why: "You have not proved the compressor. The bulb is not even on the pipe." },
        { t: "Add gas to raise superheat.", ok: false, why: "The valve is already wide open. More gas makes the flood worse." }
      ]
    },
    {
      id: "a-over", level: "advanced", pic: "dirty", title: "Overcharge",
      see: "Coil is clean. Fan is right. TXV. Subcooling is 22° and the nameplate says 10°. Head is high. Superheat is falling. Amps are high.",
      ask: "What is the fix?",
      choices: [
        { t: "Recover until subcooling is back on the nameplate.", ok: true, why: "Clean coil, high subcooling, high amps. The condenser is stacked with liquid." },
        { t: "Hose the condenser and leave the gas.", ok: false, why: "You faked the head. The charge is still wrong when the hose is off." },
        { t: "Add more. The supply air is not cold enough.", ok: false, why: "An overcharge does not get colder because you add more." }
      ]
    },
    {
      id: "a-air", level: "advanced", pic: "gauges", title: "Air in the system",
      see: "Unit is off and fully equalized. Outdoor temperature is 75°. Pressure is higher than the PT chart for this refrigerant at 75°.",
      ask: "What does that prove?",
      choices: [
        { t: "Non-condensables. Recover, evacuate, weigh in a pure charge.", ok: true, why: "Off and equalized, pressure has to match the chart. If it sits high, air or nitrogen is in there. Running subcooling will lie until the gas is pure." },
        { t: "It is just overcharged. Bleed the high side to the air.", ok: false, why: "Venting is illegal, and you will not know what is left." },
        { t: "Add gas. The chart is only for running units.", ok: false, why: "The off check is the pure-gas check. The chart works at rest." }
      ]
    },
    {
      id: "a-hp", level: "advanced", pic: "heat", title: "Heat pump, outdoor ice",
      see: "Heat mode. Outdoor coil is a block of ice. Supply air is barely warm. You are about to call it low on charge.",
      ask: "What do you prove first?",
      choices: [
        { t: "Defrost. The outdoor coil is the evaporator in heat.", ok: true, why: "Ice on the outdoor coil in heat is a defrost or outdoor-air problem until you prove otherwise. A cooling pressure habit does not apply." },
        { t: "Add gas because suction is low.", ok: false, why: "Ice makes a low suction. You have not measured a clean coil." },
        { t: "Change the compressor.", ok: false, why: "You have not proved it will not defrost." }
      ]
    },
    {
      id: "a-ice", level: "advanced", pic: "icem", title: "Ice machine, long harvest",
      see: "Cube machine. Freeze looks normal. Harvest runs long. Ice is thin. Condenser is packed with lint. Scale on the plate.",
      ask: "What do you prove before a compressor or a sealed-system charge?",
      choices: [
        { t: "Which cycle it is in, then water, scale, and the condenser air.", ok: true, why: "Harvest and freeze are different machines for ten minutes. A dirty condenser and scale cause more bad ice than a bad compressor." },
        { t: "Add refrigerant. Harvest is slow.", ok: false, why: "You have not proved the hot-gas valve, the water, or the airflow." },
        { t: "Change the board because the lights look busy.", ok: false, why: "Name the cycle first. Then the simple parts." }
      ]
    },
    {
      id: "a-frz", level: "advanced", pic: "freezer", title: "Freezer coil is solid",
      see: "Reach-in freezer. Box is 20°. The evaporator is a snowball. Fans are spinning and moving almost nothing.",
      ask: "What is the first proof?",
      choices: [
        { t: "Defrost. Heater, termination, and the drain. Then the fan can move air.", ok: true, why: "A buried coil cannot boil refrigerant in any useful way. Low suction here is ice, not a charge." },
        { t: "Add gas through a piercing valve.", ok: false, why: "You will condemn a sealed system that only needed a heater." },
        { t: "Change the compressor. The box is warm.", ok: false, why: "The compressor may be running under a blanket of ice." }
      ]
    },
    {
      id: "a-ok", level: "advanced", pic: "ok", title: "It is operating correctly",
      see: "TXV split. Nameplate subcooling 10°. You measure 10°. Superheat is steady at 11°. Delta T is 18°. Amps are under RLA. Coil is sweaty.",
      ask: "What do you sell?",
      choices: [
        { t: "Nothing on the charge. Write the numbers and leave it.", ok: true, why: "Both numbers are in range, the air is cold, the amps are honest. That is a system operating correctly." },
        { t: "A pound of gas, so it is colder.", ok: false, why: "You would push subcooling off the nameplate." },
        { t: "A new TXV. Superheat should be zero.", ok: false, why: "Zero superheat is liquid headed for the compressor." }
      ]
    },
    {
      id: "b-24", level: "basic", pic: "contactor", title: "24 volts never arrived",
      see: "Thermostat says cool. Indoor fan may be running. Outdoor unit is silent. Contactor is not pulled in.",
      ask: "What do you prove first?",
      choices: [
        { t: "24V across the contactor coil. If it is missing, find the last place it still exists.", ok: true, why: "Stat, board, float switch, then the pressure switches in the yellow wire. A coil with 24V that does not pull in is the contactor. No 24V is not a compressor." },
        { t: "Change the compressor. The outdoor unit is quiet.", ok: false, why: "You have not proved it was ever told to start." },
        { t: "Change the thermostat and leave.", ok: false, why: "The break may be a float switch or a pressure switch outdoors." }
      ]
    },
    {
      id: "b-cap", level: "basic", pic: "cap", title: "Capacitor before the compressor",
      see: "Fan may run. Compressor hums and trips. Capacitor top is swollen. Shell is hot from repeated starts.",
      ask: "What do you prove before you condemn the compressor?",
      choices: [
        { t: "Power off. Discharge the capacitor. Microfarads within the stamp on the can.", ok: true, why: "A weak capacitor makes a good compressor look locked. Only a known-good capacitor earns a winding test." },
        { t: "New compressor. It only hums.", ok: false, why: "Hums and trips is the capacitor call until the microfarads say otherwise." },
        { t: "Leave a hard-start kit on it and close the ticket.", ok: false, why: "A kit can hide a bad run capacitor. It is not the repair." }
      ]
    },
    {
      id: "b-amp", level: "basic", pic: "ok", title: "Amps against RLA",
      see: "Compressor is running. You have amps on the common lead. The nameplate shows RLA and LRA. Voltage at the contactor is low.",
      ask: "How do you read it?",
      choices: [
        { t: "Running amps at or under RLA, after voltage and the capacitor are known. LRA is only the instant of start.", ok: true, why: "Amps that hang near LRA mean the rotor is not turning. Low voltage raises amps. High amps with a dirty coil is not an automatic compressor." },
        { t: "Any number under LRA means the compressor is good.", ok: false, why: "LRA is inrush. Running amps are compared with RLA." },
        { t: "Change it because the day is hot and the amps are up.", ok: false, why: "Check voltage, capacitor, and the coil before the compressor." }
      ]
    },
    {
      id: "a-rev", level: "advanced", pic: "rev", title: "Reversing valve",
      see: "Heat pump runs. Lukewarm in both modes. Pressures stay close. You can hear a hiss at the valve.",
      ask: "What do you prove before the valve comes out?",
      choices: [
        { t: "Is the solenoid powered in the mode the diagram says? Then did the pipes actually swap?", ok: true, why: "Most residential valves are energized in cool (O). Some are energized in heat (B). The diagram decides. No 24V is not a bad valve body." },
        { t: "New compressor. Both pressures look weak.", ok: false, why: "A bleeding valve can look like a weak compressor." },
        { t: "Tap it once and leave.", ok: false, why: "A tap that shifts it is a clue, not a repair." }
      ]
    },
    {
      id: "l-area", level: "leak", pic: "sniff", title: "Find the area, then the hole",
      see: "The electronic detector alarms at the outdoor coil. You have not seen a bubble yet.",
      ask: "What finishes the diagnosis?",
      choices: [
        { t: "Soap the joints in that area. A bubble that grows is the hole.", ok: true, why: "The detector finds the neighborhood. Soap, or a mirror on a coil you cannot see, finds the exact joint. Then you repair that joint." },
        { t: "Add refrigerant until the alarm stops.", ok: false, why: "The alarm stops because you buried the leak in new gas. The hole is still there." },
        { t: "Change the compressor. Detectors only alarm for compressors.", ok: false, why: "A detector alarms at the gas, wherever it is leaving." }
      ]
    },
    {
      id: "l-n2", level: "leak", pic: "n2", title: "Nitrogen, never oxygen",
      see: "The charge is recovered. You need to pressure-test the repair. A bottle of shop air and a bottle of oxygen are closer than the nitrogen.",
      ask: "What do you pressurize with?",
      choices: [
        { t: "Dry nitrogen, at a pressure the data plate allows.", ok: true, why: "Oxygen and oil can explode. Shop air carries moisture. Nitrogen is dry and inert. Do not exceed the lowest-rated part in the circuit you opened." },
        { t: "Oxygen. It makes a hotter test.", ok: false, why: "Oxygen plus compressor oil is a fire. Do not do it." },
        { t: "Refrigerant, then listen.", ok: false, why: "You just recovered it. Putting it back to hunt a leak vents it again." }
      ]
    },
    {
      id: "l-vac", level: "leak", pic: "micron", title: "Microns that will not stay",
      see: "You isolated the vacuum pump. The micron reading climbs fast and does not level off.",
      ask: "What does that usually mean?",
      choices: [
        { t: "A leak, until a nitrogen pressure test says otherwise.", ok: true, why: "Moisture climbs and then stalls. A leak keeps climbing. Vacuum can also hide a tiny leak that pressure opens, so the standing nitrogen test is the confirmation." },
        { t: "The pump is too good. Charge it.", ok: false, why: "A rising number with the pump valved off is not a finished vacuum." },
        { t: "Add dye and go home.", ok: false, why: "Dye does not prove a leak you already watched on a gauge." }
      ]
    },
    {
      id: "l-dye", level: "leak", pic: "dye", title: "Dye is not step one",
      see: "Someone wants ultraviolet dye in a system under warranty. The detector and the soap have not been used.",
      ask: "When is dye the right tool?",
      choices: [
        { t: "After the maker allows it, and after the sweep and the soap missed a leak you still have to find.", ok: true, why: "Dye can plug a metering device and it only shows up after enough refrigerant has left. It is a last look, not the first." },
        { t: "Every call, so the next tech can see it.", ok: false, why: "You may void the warranty and you still have not found today's hole." },
        { t: "Instead of nitrogen, because dye glows under pressure.", ok: false, why: "Dye does not replace a pressure test." }
      ]
    },
    {
      id: "l-a2l-tool", level: "leak", pic: "a2l", title: "A2L detector",
      see: "The nameplate says R-454B. Your old heated-diode sniffer was bought for R-22. It has a hot sensor in the tip.",
      ask: "What is wrong with that tool on this call?",
      choices: [
        { t: "It is not rated for this gas, and the hot tip is an ignition source. Use an infrared detector listed for A2L.", ok: true, why: "A heated diode or corona sensor can miss an A2L and it can light one. Infrared has no hot element. A combustible-gas meter only wakes up near a flammable mixture. It will not find a small fitting leak." },
        { t: "Any sniffer works if you turn the sensitivity up.", ok: false, why: "Sensitivity does not make a hot sensor safe, and it does not make it see this gas." },
        { t: "Use a halide torch. The flame changes color.", ok: false, why: "A halide torch is an open flame. Do not put a flame on a flammable refrigerant." }
      ]
    },
    {
      id: "l-a2l-low", level: "leak", pic: "a2l", title: "A2L sits low",
      see: "R-32 mini-split. You swept the ceiling and the top of the coil. The detector stayed quiet. The unit is in a basement.",
      ask: "Where do you sweep next?",
      choices: [
        { t: "The floor, the pit, and the bottom of the cabinet. These gases are heavier than air.", ok: true, why: "R-32 and R-454B sink. A ceiling sweep misses the cloud. Outdoors it usually blows away. Indoors, low and still is where it collects." },
        { t: "Only the ceiling. Flammables rise.", ok: false, why: "That is natural gas. These refrigerants are heavier than air." },
        { t: "Stop looking. A quiet detector means there is no leak.", ok: false, why: "You looked in the wrong place with the tool at the wrong height." }
      ]
    },
    {
      id: "l-a2l-sensor", level: "leak", pic: "a2lsense", title: "The sensor shut it down",
      see: "A larger A2L system is off. The mitigation sensor low on the wall is in alarm. The compressor never got the call.",
      ask: "What do you prove first?",
      choices: [
        { t: "The sensor and why it alarmed. Ventilate. Find the leak. Do not jump the shutdown.", ok: true, why: "The sensor did its job. It can close a valve, start a fan, and kill the compressor. Jumping it puts the machine back into a room that already has gas in it." },
        { t: "Jump the safety and change the compressor.", ok: false, why: "The compressor was told to stop. That is not a failed compressor." },
        { t: "Spray the sensor with cleaner until the alarm clears.", ok: false, why: "You silenced the warning. The leak is still there." }
      ]
    },
    {
      id: "l-a2l-tank", level: "leak", pic: "a2ltank", title: "A2L recovery",
      see: "You have to open an R-32 system to fix a flare. The only empty jug on the truck last had R-410A in it. The recovery machine has no A2L rating.",
      ask: "What is the move?",
      choices: [
        { t: "Stop. Use a machine and a cylinder rated for A2L. Do not mix it into the 410A jug.", ok: true, why: "An unrated recovery machine is an ignition source. A shared jug contaminates both gases and hides what you are putting back. Vent the room. Nitrogen in the pipe before any torch." },
        { t: "Recover it into the 410A jug. Close enough.", ok: false, why: "They are not the same gas. The jug is now a mixture you cannot weigh back in." },
        { t: "Braze it with the charge still in the line.", ok: false, why: "The torch is the ignition source, and you would vent the charge." }
      ]
    }
  ];

  var CARDS = [
    {
      id: "c-piston", title: "Split, piston", gear: "House",
      steps: [
        { pic: "ice", t: "Air first", d: "Filter, blower wheel, and a coil that is not ice. A frozen coil makes every gauge lie." },
        { pic: "gauges", t: "Both temperatures", d: "Indoor wet bulb. Outdoor dry bulb. Suction line temperature. Liquid line temperature." },
        { pic: "sh", t: "Target superheat", d: "The chart uses today's wet bulb and outdoor dry bulb. One memorized superheat is not the chart." },
        { pic: "ok", t: "Right looks like", d: "Measured superheat on the chart. Suction saturation above 32°. Coil sweaty, not white. Subcooling is only a clue." }
      ]
    },
    {
      id: "c-txv", title: "Split, TXV", gear: "House",
      steps: [
        { pic: "ice", t: "Air first", d: "Same as a piston. No airflow, no diagnosis." },
        { pic: "sc", t: "Nameplate subcooling", d: "Charge to the plate. If the plate is gone, do not invent a number and call it factory." },
        { pic: "sh", t: "Superheat is the valve", d: "It should sit in a steady band. You do not add gas to chase it." },
        { pic: "bulb", t: "Bulb on the pipe", d: "Clean copper, factory clock position, then insulated. A bulb in the air is a different call." },
        { pic: "ok", t: "Right looks like", d: "Subcooling on the plate. Superheat steady. Coil clear. Amps at or under RLA." }
      ]
    },
    {
      id: "c-hp", title: "Heat pump", gear: "House",
      steps: [
        { pic: "heat", t: "Name the mode", d: "Heat or cool. In heat the outdoor coil is the evaporator. Yesterday's cooling pressures do not apply." },
        { pic: "heat", t: "Ice outdoors", d: "A block of ice in heat is defrost or outdoor airflow until you prove it is not." },
        { pic: "cycle", t: "Did the valve shift", d: "Pressures have to swap when the mode changes. If they never swap, then look at the reversing valve." },
        { pic: "ok", t: "Right looks like", d: "The mode you are in matches the air from the registers. Defrost can start and finish. Charge by the maker's method, not a habit." }
      ]
    },
    {
      id: "c-fur", title: "Gas furnace", gear: "House",
      steps: [
        { pic: "furnace", t: "The order", d: "Call for heat. Inducer. Pressure switch. Ignitor. Gas valve. Flame sense. Blower on delay." },
        { pic: "furnace", t: "Do not skip", d: "If the inducer never starts, you are not at the gas valve yet." },
        { pic: "ice", t: "Limit open", d: "A limit that trips is airflow. Filter, wheel, coil, closed vents. Not a new board as the first part." },
        { pic: "ok", t: "Right looks like", d: "Flame stays. Blower comes on after the delay. The limit stays closed. No rollout." }
      ]
    },
    {
      id: "c-rtu", title: "Rooftop", gear: "Commercial",
      steps: [
        { pic: "cycle", t: "Dampers before gas", d: "An economizer stuck open makes a hot room while the compressor runs. Look at the damper before the charge." },
        { pic: "ice", t: "Filters and belts", d: "A loose belt is an airflow call. The gauges will look like a frozen house coil." },
        { pic: "dirty", t: "All the condenser fans", d: "One dead fan on a roof cooks the head. Count them spinning." },
        { pic: "ok", t: "Then the same numbers", d: "Piston or TXV, same rules as the house. Subcooling and superheat still have to agree." }
      ]
    },
    {
      id: "c-mini", title: "Mini-split", gear: "House",
      steps: [
        { pic: "cycle", t: "Read the code", d: "Indoor and outdoor have to be talking. The error code comes before a part." },
        { pic: "ice", t: "Filters and the wheel", d: "A packed indoor wheel freezes the coil on a system you were told not to gauge." },
        { pic: "gauges", t: "Do not open it for fun", d: "Most are a critical charge. If the maker says weigh in by line length, do that. Hoses lose the charge." },
        { pic: "ok", t: "Right looks like", d: "No code. Indoor air is cold or hot for the mode. The coil is not a block of ice. Lines are the length the charge allows." }
      ]
    },
    {
      id: "c-wic", title: "Walk-in cooler", gear: "Commercial",
      steps: [
        { pic: "walkin", t: "Box, door, product", d: "Gasket, curtain, and product piled on the coil. A warm box with a clear coil is often the door." },
        { pic: "fridge", t: "Fans and a clear coil", d: "Evaporator fans running. Coil sweaty or light frost, not a ball." },
        { pic: "cycle", t: "Is the solenoid open", d: "On a pump-down, the liquid solenoid has to be called. A closed solenoid looks like a restriction." },
        { pic: "gauges", t: "Sight glass is not a charge", d: "Bubbles can be a restriction or a low charge. Superheat and subcooling still decide." },
        { pic: "ok", t: "Right looks like", d: "Box temperature is falling. Superheat at the bulb is in the valve's range. No frost ring on the drier." }
      ]
    },
    {
      id: "c-wif", title: "Walk-in freezer", gear: "Commercial",
      steps: [
        { pic: "freezer", t: "Ice first", d: "A buried coil is a defrost call. Heater, termination, fan delay, and a drain that does not refreeze." },
        { pic: "ice", t: "Do not gas the ice", d: "Low suction under a snowball is not a low charge until the coil is clear and the fans move air." },
        { pic: "restrict", t: "Then the drop", d: "After it is clear, a frost ring on one part is a restriction. High superheat and high subcooling." },
        { pic: "ok", t: "Right looks like", d: "Coil clears after defrost. Fans wait until the coil is cold. Box holds." }
      ]
    },
    {
      id: "c-ref", title: "Reach-in refrigerator", gear: "Commercial",
      steps: [
        { pic: "fridge", t: "Is it running", d: "Compressor on or off. If it is off, start relay, overload, and the control. Not the sealed system yet." },
        { pic: "dirty", t: "Condenser and fan", d: "Lint on a reach-in kills it. Clean it and see if the box falls." },
        { pic: "fridge", t: "Frost pattern", d: "A light, even frost is normal on many of these. A snowball is defrost or a door." },
        { pic: "walkin", t: "Gasket", d: "A torn gasket runs the compressor all day. Feel the door with a piece of paper." },
        { pic: "r290", t: "Sealed system last", d: "Many small boxes are R-290 with no ports. You do not add gas. You do not pierce it." }
      ]
    },
    {
      id: "c-ice", title: "Ice machine", gear: "Commercial",
      steps: [
        { pic: "icem", t: "Name the cycle", d: "Freeze makes ice. Harvest drops it. If you do not know which one you are in, stop." },
        { pic: "walkin", t: "Bin and curtain", d: "A full bin or a curtain that never dropped will not start. That is not a compressor." },
        { pic: "ice", t: "Water", d: "No water, long freeze, thin ice. Inlet valve and scale on the plate." },
        { pic: "dirty", t: "Condenser air", d: "Lint. Same high head as a house. Clean it before a sealed-system guess." },
        { pic: "icem", t: "Harvest parts", d: "Long harvest: hot gas valve, inlet water, and a scaled plate. Then, and only then, the charge." },
        { pic: "ok", t: "Right looks like", d: "Full cubes. Harvest finishes. Bin fills. The machine stops when the curtain says full." }
      ]
    },
    {
      id: "c-leak", title: "Find the leak", gear: "Any system",
      steps: [
        { pic: "oil", t: "Oil is a clue", d: "Oil left the system with the gas. Follow the stain. The stain is not the proof. Wind and gravity move oil away from the hole." },
        { pic: "schrader", t: "Look at the easy spots", d: "Missing caps, schrader cores, flare nuts, king-valve packing, and a line that rubbed through a wall. Most leaks are not in the middle of a pipe." },
        { pic: "sniff", t: "Sweep for the area", d: "Electronic detector, moving slowly, out of the wind. It tells you the section. It does not tell you the thread. On an A2L, the detector has to be rated for that gas." },
        { pic: "soap", t: "Soap finds the hole", d: "Bubbles on the joint the detector named. A bubble that grows is the leak. A bubble you smeared on is not. Check the back of the joint too." },
        { pic: "ultra", t: "When you cannot hear it", d: "An ultrasonic detector listens for the hiss. Other shop noise and wind can lie. Use it to point, then soap what it pointed at." },
        { pic: "n2", t: "Dry nitrogen confirms it", d: "Recover first. Dry nitrogen only. Never oxygen. Never shop air. Hold at a pressure the data plate allows. Isolate a section if the whole system will not hold. Soap while it is under nitrogen." },
        { pic: "micron", t: "Vacuum is a second opinion", d: "Valve off the pump. Moisture rises and then stalls. A leak keeps rising. A tiny leak can seal under vacuum and open under pressure, so the nitrogen test still wins an argument." },
        { pic: "dye", t: "Dye is last", d: "Only if the manufacturer allows it. It shows up after more gas has escaped, and it can sit in a metering device. It is not the first tool out of the bag." }
      ]
    },
    {
      id: "c-a2l", title: "A2L leaks", gear: "R-32 and R-454B",
      steps: [
        { pic: "gas", t: "Read the plate first", d: "R-32 and R-454B are A2L. Mildly flammable. R-290 is A3, propane, and it is not this card. A whiff will not burn. A cloud in a small closed room can." },
        { pic: "a2l", t: "The detector has to be listed", d: "Use an infrared detector rated for that gas. A heated diode or a corona sniffer can miss it, and the hot tip can light it. A halide torch is an open flame. Do not use one." },
        { pic: "a2l", t: "Sweep low", d: "These gases are heavier than air. Start at the floor, the pit, and the bottom of the cabinet. A ceiling pass is the wrong pass. Outdoors, wind usually takes it. Indoors, still air at the floor is the hazard." },
        { pic: "soap", t: "Soap and nitrogen do not spark", d: "They are still how you prove the hole. Recover with rated equipment first. Dry nitrogen only. Never oxygen, never shop air. Hold only what the data plate allows." },
        { pic: "a2ltorch", t: "The torch waits", d: "No flame, no unrated drop light, no unrated recovery machine while gas can still be in the pipe. Flow nitrogen before you light anything. The torch is the ignition source." },
        { pic: "a2lsense", t: "Some units watch the room", d: "Larger equipment may have a sensor mounted low. In alarm it can start a fan, close a valve, and shut the compressor off. Prove that sensor before you condemn the compressor. Do not jump it." },
        { pic: "a2ltank", t: "Rated tank, rated machine", d: "Do not recover A2L into a jug that held 410A. Do not add extra pounds for a long line set unless the maker's chart allows it. The charge limit is about the size of the room, not about how cold you want it." },
        { pic: "r290", t: "Not the same as propane", d: "A2L rules are not R-290 rules. A sealed R-290 box still gets no gauges and no piercing valve. If the plate says 290, leave this card and use the refrigerator card." }
      ]
    }
  ];

  var GASES = [
    { id: "g-410", name: "R-410A", pic: "gas", d: "High-pressure blend. Old residential standard. Use the 410A column. A pressure that looks huge next to R-22 can be normal. The nameplate still sets subcooling or the chart." },
    { id: "g-454", name: "R-454B", pic: "gas", d: "A2L blend on a lot of new houses. Close to 410A and not the same column. Mildly flammable. Recovery machine, tank, and leak detector have to be rated for it. Bubble point for subcooling. Dew point for superheat." },
    { id: "g-32", name: "R-32", pic: "gas", d: "A2L. Many mini-splits. Higher pressure than 410A at the same coil temperature. Use the R-32 column. Do not borrow a 410A habit." },
    { id: "g-22", name: "R-22", pic: "gas", d: "Older mineral-oil systems. Lower pressure than 410A at the same temperature. Do not mix it with 410A. Do not vent it. Recover it." },
    { id: "g-134", name: "R-134a", pic: "gas", d: "Lower pressure. Reach-ins and some chillers. A suction that looks low next to 410A can be a normal 134a coil. Read the chart before you call it empty." },
    { id: "g-404", name: "R-404A", pic: "gas", d: "Older freezers and some ice machines. High head compared with 134a. Do not mix it with a replacement. 448A and 449A are different gases." },
    { id: "g-448", name: "R-448A / R-449A", pic: "gas", d: "Glide blends used where 404A used to be. Bubble point is the liquid number, so subcooling uses bubble. Dew point is the vapor number, so superheat uses dew. The wrong column lies." },
    { id: "g-290", name: "R-290", pic: "r290", d: "Propane. Ounces, not pounds. Most refrigerators and small ice machines have no service port. Do not hook gauges. Do not pierce the line. Flammable." },
    { id: "g-744", name: "R-744 CO2", pic: "co2", d: "Pressures are a different world. A healthy rack can look overcharged to someone who only knows 410A. The data plate is the only normal. Stand clear of relief valves." }
  ];

  var GAS_QUIZ = [
    {
      id: "gq1", pic: "gas", title: "Wrong column",
      see: "The drum says R-134a. You are looking at the R-410A column. Suction looks terribly low.",
      ask: "What is true?",
      choices: [
        { t: "Use the 134a column. That pressure may be a normal coil.", ok: true, why: "410A and 134a do not share a needle. The sticker on the machine picks the column." },
        { t: "Add gas until it looks like 410A.", ok: false, why: "You will overcharge it or burst a disc." },
        { t: "All gases use one chart.", ok: false, why: "They do not." }
      ]
    },
    {
      id: "gq2", pic: "gas", title: "Glide",
      see: "R-449A freezer. You used one saturation for both superheat and subcooling.",
      ask: "Which saturation goes where?",
      choices: [
        { t: "Dew point on the suction. Bubble point on the liquid.", ok: true, why: "Superheat uses dew. Subcooling uses bubble. One number in the middle is a guess." },
        { t: "Bubble on both.", ok: false, why: "The vapor leaving the evaporator follows the dew point." },
        { t: "Ignore glide. It is a few degrees.", ok: false, why: "A few degrees is the difference between a good charge and a flooded compressor." }
      ]
    },
    {
      id: "gq3", pic: "r290", title: "No ports",
      see: "Small refrigerator. Label says R-290. You cannot find a service port.",
      ask: "What is the move?",
      choices: [
        { t: "Do not pierce it. Clean the condenser, prove the start parts, then a sealed-system replacement if it is actually flat.", ok: true, why: "R-290 charges are tiny and flammable. A piercing valve is how people get hurt and how the charge is lost." },
        { t: "Pierce the process tube and add 410A.", ok: false, why: "Wrong gas, illegal venting risk, and a fire hazard." },
        { t: "Hook the manifold anyway and purge the hose in the room.", ok: false, why: "There is no port, and you do not purge propane into a kitchen." }
      ]
    },
    {
      id: "gq4", pic: "co2", title: "CO2",
      see: "First time on a CO2 rack. The high side number would be insane on a 410A house.",
      ask: "What do you trust?",
      choices: [
        { t: "The data plate and the CO2 chart. Not your 410A memory.", ok: true, why: "A normal CO2 pressure can look like a failed 410A condenser. Prove the design before you call it overcharged." },
        { t: "Recover until it looks like 410A.", ok: false, why: "You will shut the rack down and you may be in the wrong range entirely." },
        { t: "Bleed it to the roof so the number drops.", ok: false, why: "That is not a repair, and the relief valves are not a gauge." }
      ]
    }
  ];

  function listFor(id) {
    if (id === "basic") return CALLS.filter(function (c) { return c.level === "basic"; });
    if (id === "advanced") return CALLS.filter(function (c) { return c.level === "advanced"; });
    if (id === "cards") return CARDS;
    if (id === "gases") return GASES;
    if (id === "gasquiz") return GAS_QUIZ;
    if (id === "leaks") return CARDS.filter(function (c) { return c.id === "c-leak" || c.id === "c-a2l"; }).concat(CALLS.filter(function (c) { return c.level === "leak"; }));
    return [];
  }

  function progress(id) {
    var items = listFor(id);
    var d = doneIds();
    var n = 0;
    items.forEach(function (it) { if (d.indexOf(it.id) >= 0) n++; });
    return n + " / " + items.length;
  }

  function home() {
    return (
      '<p class="tr-kicker">Troubleshooting</p>' +
      "<h1>Prove it, then buy the part</h1>" +
      pic("cycle") +
      '<p class="tr-lead">Superheat on the suction line. Subcooling on the liquid line. If those two agree with the air, the system is operating correctly.</p>' +
      door("order", "The six questions", "Say them before you open the panel.") +
      door("basic", "Basic", progress("basic") + " · house and walk-in") +
      door("advanced", "Advanced", progress("advanced") + " · the call that moved") +
      door("cards", "Step-by-step cards", "Ice machine, refrigerator, freezer, rooftop, heat pump.") +
      door("leaks", "Leak detection", progress("leaks") + " · soap, nitrogen, and A2L") +
      door("gases", "Refrigerants", "410A, 454B, 32, 22, 134a, 404A, 448A, 290, CO2.")
    );
  }

  function door(id, title, sub) {
    return '<button type="button" class="tr-door" data-act="open" data-id="' + id + '"><strong>' + esc(title) + "</strong><span>" + esc(sub) + "</span></button>";
  }

  function order() {
    var rows = [
      ["1", "What should it be doing?", "Cool, heat, defrost, freeze, or harvest."],
      ["2", "Is air or water moving?", "Ice and a dead fan lie about the charge."],
      ["3", "Superheat", "Suction-line temperature minus saturation."],
      ["4", "Subcooling", "Saturation minus liquid-line temperature."],
      ["5", "Do the two numbers agree?", "High superheat is not one fault. Look at subcooling too."],
      ["6", "What will you prove?", "The part is the easy half."]
    ];
    return (
      head("The order") +
      rows.map(function (r) {
        return '<article class="tr-row"><b>' + r[0] + "</b><div><strong>" + esc(r[1]) + "</strong><p>" + esc(r[2]) + "</p></div></article>";
      }).join("") +
      pic("sh") +
      pic("sc")
    );
  }

  function head(title) {
    return '<button type="button" class="tr-back" data-act="home">Back</button><p class="tr-kicker">Troubleshooting</p><h1>' + esc(title) + "</h1>";
  }

  function listView() {
    var titles = { basic: "Basic", advanced: "Advanced", cards: "Cards", gases: "Refrigerants", gasquiz: "Check yourself", leaks: "Leak detection" };
    var items = listFor(listId);
    var d = doneIds();
    var body = items.map(function (it) {
      var name = it.title || it.name;
      var sub = it.gear || it.see || it.d || "";
      var markDone = d.indexOf(it.id) >= 0 ? " tr-done" : "";
      return '<button type="button" class="tr-door' + markDone + '" data-act="item" data-id="' + it.id + '"><strong>' + esc(name) + "</strong><span>" + esc(sub).slice(0, 90) + "</span></button>";
    }).join("");
    if (listId === "gases") {
      body += door("gasquiz", "Check yourself", progress("gasquiz") + " · four gases");
    }
    return head(titles[listId] || "List") + pic(listId === "gases" || listId === "gasquiz" ? "gas" : listId === "leaks" ? "soap" : "cycle") + body;
  }

  function callView(c) {
    var choices = c.choices.map(function (ch, i) {
      var cls = "tr-choice";
      if (picked === i) cls += ch.ok ? " is-right" : " is-wrong";
      return '<button type="button" class="' + cls + '" data-act="pick" data-i="' + i + '">' + esc(ch.t) + "</button>";
    }).join("");
    var why = "";
    if (picked >= 0) {
      var ch = c.choices[picked];
      why = '<p class="tr-why ' + (ch.ok ? "is-right" : "is-wrong") + '">' + esc(ch.why) + "</p>";
      if (ch.ok) why += '<button type="button" class="tr-next" data-act="next">Next</button>';
    }
    return head(c.title) + pic(c.pic) + '<p class="tr-see">' + esc(c.see) + "</p>" + '<p class="tr-ask">' + esc(c.ask) + "</p>" + choices + why;
  }

  function cardView(c) {
    var s = c.steps[step];
    var dots = c.steps.map(function (_, i) {
      return '<i class="' + (i === step ? "on" : "") + '"></i>';
    }).join("");
    var next = step < c.steps.length - 1
      ? '<button type="button" class="tr-next" data-act="step">Next step</button>'
      : '<button type="button" class="tr-next" data-act="finish">I can run this order</button>';
    return head(c.title) + '<p class="tr-kicker">' + esc(c.gear) + " · step " + (step + 1) + " of " + c.steps.length + "</p>" +
      '<div class="tr-dots">' + dots + "</div>" + pic(s.pic) + "<h2>" + esc(s.t) + "</h2>" + '<p class="tr-see">' + esc(s.d) + "</p>" + next;
  }

  function gasView(g) {
    return head(g.name) + pic(g.pic) + '<p class="tr-see">' + esc(g.d) + "</p>" +
      '<button type="button" class="tr-next" data-act="finish">Got it</button>';
  }

  function paint() {
    if (!root) return;
    var html = "";
    if (view === "home") html = home();
    else if (view === "order") html = order();
    else if (view === "list") html = listView();
    else if (view === "call") html = callView(item);
    else if (view === "card") html = cardView(item);
    else if (view === "gas") html = gasView(item);
    root.innerHTML = '<div class="tr">' + html + "</div>";
  }

  function findItem(id) {
    var pools = [CALLS, CARDS, GASES, GAS_QUIZ];
    for (var p = 0; p < pools.length; p++) {
      for (var i = 0; i < pools[p].length; i++) if (pools[p][i].id === id) return pools[p][i];
    }
    return null;
  }

  function onClick(e) {
    var b = e.target.closest("[data-act]");
    if (!b || !root || !root.contains(b)) return;
    var act = b.getAttribute("data-act");
    if (act === "home") {
      view = "home";
      item = null;
      picked = -1;
    } else if (act === "open") {
      var id = b.getAttribute("data-id");
      if (id === "order") view = "order";
      else {
        listId = id;
        view = "list";
      }
    } else if (act === "item") {
      item = findItem(b.getAttribute("data-id"));
      picked = -1;
      step = 0;
      if (!item) return;
      if (item.choices) view = "call";
      else if (item.steps) view = "card";
      else view = "gas";
    } else if (act === "pick") {
      picked = Number(b.getAttribute("data-i"));
      if (item && item.choices[picked] && item.choices[picked].ok) mark(item.id);
    } else if (act === "step") {
      if (item && step < item.steps.length - 1) step++;
    } else if (act === "finish") {
      if (item) mark(item.id);
      view = "list";
      item = null;
    } else if (act === "next") {
      var pool = listFor(item && item.level === "advanced" ? "advanced" : item && GAS_QUIZ.indexOf(item) >= 0 ? "gasquiz" : "basic");
      if (item && GASES.indexOf(item) < 0 && CALLS.indexOf(item) < 0 && GAS_QUIZ.indexOf(item) >= 0) pool = GAS_QUIZ;
      if (item && CALLS.indexOf(item) >= 0) pool = CALLS.filter(function (c) { return c.level === item.level; });
      var i = pool.indexOf(item);
      if (i >= 0 && i < pool.length - 1) {
        item = pool[i + 1];
        picked = -1;
        view = "call";
      } else {
        view = "list";
        item = null;
      }
    }
    paint();
  }

  function ensureStyle() {
    if (document.getElementById("tr-style")) return;
    var style = document.createElement("style");
    style.id = "tr-style";
    style.textContent = [
      "#trouble-root{position:absolute;inset:0;overflow:auto;background:#0b1014;color:#e8eef2}",
      ".tr{box-sizing:border-box;max-width:720px;margin:0 auto;padding:16px 16px 96px;font-family:'IBM Plex Sans',system-ui,sans-serif}",
      ".tr *{box-sizing:border-box}",
      ".tr h1{margin:0 0 8px;font-size:28px;line-height:1.1;font-weight:650}",
      ".tr h2{margin:8px 0;font-size:22px}",
      ".tr-kicker{margin:0 0 4px;color:#d4a24a;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}",
      ".tr-lead,.tr-see{margin:8px 0;color:#d5dde6;font-size:16px;line-height:1.45}",
      ".tr-ask{margin:8px 0 4px;font-weight:700;font-size:17px}",
      ".tr-pic{width:100%;height:210px;object-fit:cover;background:#10161c;border-radius:14px;border:1px solid #2c3844;margin:8px 0;display:block}",
      ".tr-door,.tr-choice,.tr-next,.tr-back{display:block;width:100%;text-align:left;margin:8px 0;padding:12px 14px;border-radius:12px;border:1px solid #2c3844;background:#141b22;color:#f4efe6;font:600 16px/1.35 'IBM Plex Sans',sans-serif}",
      ".tr-door strong,.tr-door span{display:block}",
      ".tr-door span{color:#9aa7b4;font-weight:500;font-size:13px;margin-top:4px}",
      ".tr-door.tr-done{border-color:#1f7a45}",
      ".tr-choice.is-right,.tr-why.is-right{border-color:#1f7a45;background:#10281c}",
      ".tr-choice.is-wrong,.tr-why.is-wrong{border-color:#8d2a32;background:#2a1214}",
      ".tr-why{padding:12px 14px;border-radius:12px;border:1px solid #2c3844}",
      ".tr-next{background:#C8102E;border-color:#C8102E;text-align:center}",
      ".tr-back{width:auto;padding:8px 12px}",
      ".tr-row{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #24303a}",
      ".tr-row b{color:#d4a24a;font-size:20px;width:24px}",
      ".tr-row p{margin:4px 0 0;color:#c5ccd6}",
      ".tr-dots{display:flex;gap:6px;margin:6px 0}",
      ".tr-dots i{width:10px;height:10px;border-radius:50%;background:#2c3844;display:block}",
      ".tr-dots i.on{background:#C8102E}"
    ].join("");
    document.head.appendChild(style);
  }

  function start(el) {
    root = el;
    view = "home";
    item = null;
    picked = -1;
    ensureStyle();
    root.addEventListener("click", onClick);
    paint();
    return { stop: stop };
  }
  function stop() {
    if (root) root.removeEventListener("click", onClick);
    root = null;
  }

  global.TroubleCourse = { start: start };
})(window);
