/* The HVAC Bible — a shop dictionary. Operation, upkeep, and the repair. */
(function (global) {
  "use strict";

  var ENTRIES = [
    { id: "accumulator", name: "Accumulator", img: "parts/accumulator.png",
      op: "Sits in the suction line on a heat pump. Meters liquid that comes back in heat mode so the compressor sees vapor. A small oil-return orifice in the bottom lets oil go home.",
      keep: "Do not tip it open. It is not a service port. Leave the insulation on it.",
      fix: "A crushed accumulator or a plugged oil orifice starves the compressor of oil. Replace it with the compressor on a burnout, and on any heat pump where the accumulator is damaged. It is not a filter-drier." },
    { id: "filterair", name: "Air filter",
      op: "The filter is the first thing return air hits. It keeps the blower wheel and the evaporator from loading up with dust.",
      keep: "Change it every 30 days with pets or a remodel, 60 to 90 in a clean house. Match the size. A filter stuffed in crooked leaks around the edges. MERV 8 to 11 is the usual residential range. A thicker MERV needs a blower that can pull it.",
      fix: "A plugged filter drops airflow, drops superheat, and ices the coil. That is not a low charge. Replace the filter and prove the temperature split before you touch the refrigerant." },
    { id: "blower", name: "Blower motor", img: "parts/fanmotor.png",
      op: "Moves air across the evaporator or the heat exchanger. ECM motors ramp to hold airflow. PSC motors need a run capacitor and a set of speeds on the board.",
      keep: "Keep the wheel clean and the filter in. Check amp draw against the nameplate once a year. A belt-drive blower needs the belt tight enough not to squeal and loose enough to deflect about the thickness of the belt.",
      fix: "Motor hums and the wheel does not turn: kill power, spin the wheel by hand. Locked bearings get a motor. A PSC that will not start with a good capacitor is a bad motor. An ECM that flashes a code is often a module or a communication fault, not a winding. Do not put a hard-start kit on a blower." },
    { id: "capacitor", name: "Capacitor", img: "parts/capacitor.png",
      op: "A run capacitor stays in the circuit and shifts the phase so the motor starts and runs. A start capacitor is only in the circuit for a moment, then the relay drops it out. A dual cap has Herm, Fan, and C.",
      keep: "Look at it. A bulged top or an oil stain is already failed. Confirm microfarads under load only if you know the meter. Power off, discharge the cap, then read it. It should be within about 6 percent of the stamped rating.",
      fix: "Weak cap: compressor hums, amps climb, it may trip on overload. Replace with the same microfarad and at least the same voltage. Do not 'upsized' a run cap to make a weak compressor start. That hides a dying motor. Mark Herm, Fan, and C before you pull the wires." },
    { id: "compressor", name: "Compressor", img: "parts/compressor.png",
      op: "A scroll takes low-pressure cool vapor in the outer pocket and discharges high-pressure hot vapor at the center. One scroll is fixed. The other orbits. It pumps vapor only. Liquid in the scroll breaks it.",
      keep: "Keep the crankcase heater on before a cold start. Keep superheat at the suction inlet so liquid stays in the coil. Change the filter-drier when you open the system. Acid test the oil after a burnout.",
      fix: "Ohm the windings with power off. Run and start should both read a few ohms to common, and the highest reading is start to run. Near zero is shorted. OL is open. To ground, OL is what you want. Amp draw over RLA with the right pressures is a mechanical problem. Pressures walking together with low amps is a weak pump. Do not condemn it until the capacitor, the contactor, and the charge are proven." },
    { id: "drain", name: "Condensate drain",
      op: "The evaporator pulls water out of the air. That water leaves through a trap, then a line, to a floor drain or a pump. The trap holds a water seal so the blower does not suck air up the drain.",
      keep: "Pour a cup of water through the pan every maintenance. Clear the trap. Use a condensate tablet, not a bottle of bleach. Make sure the line falls downhill and is supported.",
      fix: "Water in the pan and a dry outlet means a trap plugged with slime. Vacuum it or blow it out from the pan end, not into the coil. A trap with no water seal pulls air and the pan overflows on a draw-through coil. Prime the trap. If the float switch is open, the outdoor unit will not run. That is the switch doing its job." },
    { id: "pump", name: "Condensate pump",
      op: "Lifts pan water when there is no gravity drain. A float starts the pump. A safety switch opens the control circuit if the reservoir fills.",
      keep: "Clean the reservoir so the float can move. Prove the safety by lifting the float. The call should drop.",
      fix: "Pump runs and moves no water: the impeller is locked or the outlet check is stuck. Pump never starts and the reservoir is full: the float switch or the motor is done. Do not bypass the safety and leave. Pipe the outlet so it cannot siphon back." },
    { id: "condenser", name: "Condenser coil", img: "parts/condenser.png",
      op: "Hot discharge vapor enters the top. Air across the fins pulls the heat out. The vapor condenses. Warm liquid leaves the bottom. That liquid is still warm, not cold.",
      keep: "Kill the disconnect. Rinse from the inside out with a hose, not a pressure washer. Keep two feet clear. Comb fins you folded. Cottonwood season means a second rinse.",
      fix: "Dirty coil: high head pressure, subcooling about normal, amps up. That is not an overcharge. Clean it and read the pressures again. A coil full of noncondensables acts like a dirty coil that will not clean. Recover, evacuate, and weigh in a fresh charge." },
    { id: "cfan", name: "Condenser fan", img: "parts/fanmotor.png",
      op: "Pulls outdoor air through the condenser. On most residential units the motor is on top and the blade blows air out the top. The blade pitch and the rotation both matter.",
      keep: "Power off before your hands go in the shroud. Check that the blade is tight on the shaft and not rubbing. Rinse the motor shell so the dirt blanket does not cook it.",
      fix: "Fan dead and the compressor is running: head pressure climbs and the high-pressure switch opens. Check the capacitor first on a PSC motor, then the motor ohms, then the board output. A blade on backwards moves some air and still overheats the compressor. Match the rotation and the pitch." },
    { id: "contactor", name: "Contactor", img: "parts/contactor.png",
      op: "A 24-volt coil pulls in a set of line-voltage contacts and sends power to the compressor and the fan. The coil is a load on the transformer. The contacts are the switch.",
      keep: "Look at the contacts every year. Pitted contacts pit worse. Ants nest in the coil on some units. A dust cover is not optional in those yards.",
      fix: "Coil ohms in the tens, not the ones. A few ohms is a shorted coil and it cooks the transformer. Contacts that will not pass line voltage with the coil pulled in get a new contactor. Do not file them. Match the pole count and the amp rating. One-pole contactors still break one leg. Prove the other leg is open at the disconnect before you grab the wires." },
    { id: "heater", name: "Crankcase heater",
      op: "A belly band or insertion heater keeps the oil warm so refrigerant does not migrate into the crankcase and boil out on startup. That boil-out washes oil off the bearings.",
      keep: "Leave the disconnect on in the off season if the heater is fed from the line side. Feel the bottom of the shell before a cold start. It should be warm, not hot enough to burn you.",
      fix: "A cold compressor that starts slug is often a dead heater. Ohm it with the wires off. OL is open. Replace it on the shell the way it came, tight, not dangling. Do not start a cold compressor with a failed heater just to 'see if it runs.'" },
    { id: "defrost", name: "Defrost board",
      op: "On a heat pump the outdoor coil is the evaporator in heat. Frost is normal. The board watches coil temperature and run time, then shifts the reversing valve and brings the outdoor fan off so hot gas can melt the coil.",
      keep: "Keep the coil sensor clipped tight on the tube it came on. A sensor hanging in the air ends defrost late or never.",
      fix: "Ice banked between the fins after a long run: prove the sensor, the board timing, and that the valve actually shifts. A heat pump that will not come out of defrost blows cold air inside and ices nothing outside. Do not condemn the compressor for a defrost fault." },
    { id: "disconnect", name: "Disconnect", img: "parts/disconnect.png",
      op: "The lockout point within sight of the unit. Pull-out or breaker style. It opens the line so you can touch the contactor and the capacitor.",
      keep: "Pull it and try to start the unit before you work. Look for melted stabs and water in the box. Keep the cover on.",
      fix: "Burned stabs from a loose pull-out get a new disconnect, not a bigger fuse. Fuse size follows the nameplate maximum overcurrent protection, not the wire you wish was there. Label the panel breaker while you are there." },
    { id: "evaporator", name: "Evaporator coil", img: "parts/evaporator.png",
      op: "Cold refrigerant enters after the metering device and boils in the tubes. Boiling takes heat from the room air. The last pass should be vapor only, superheated. Water on the fins is moisture from the air, not refrigerant.",
      keep: "Keep the filter clean and the drain open. A no-rinse coil cleaner is for the air-in side, and you still rinse if the cleaner says to. Straighten fins. Do not crush the distributor tubes.",
      fix: "High superheat with a warm coil is starvation: charge, drier, or the TXV. Low superheat and a cold suction line is floodback or low airflow. Ice on the vapor line back to the compressor is liquid. Kill it. Do not scrape ice off with a screwdriver." },
    { id: "drier", name: "Filter-drier", img: "parts/filter.png",
      op: "Sits in the liquid line. Screens and desiccant hold trash and moisture. Refrigerant passes. Inlet and outlet should both be warm liquid, about the same temperature.",
      keep: "Replace it any time the system is opened. Keep the new one capped until the moment you braze it. Arrow points with the flow.",
      fix: "A cold outlet, or frost after the drier, means the core is plugged. That is a restriction, not a normal pressure drop. Replace it. Do not try to flush a solid-core drier. After a burnout use a suction drier too, then pull it back out." },
    { id: "flame", name: "Flame sensor",
      op: "A thin metal rod in the flame. The flame itself rectifies a tiny microamp signal back to the board. No microamps, the board closes the gas valve.",
      keep: "Pull it once a year and polish it with a soft abrasive pad, not sandpaper that eats the rod. Put it back in the flame, not beside it.",
      fix: "The furnace lights and then drops out after a few seconds: read microamps in series with the sensor. Compare to the board's spec, often around 1 microamp or more. A clean rod that still will not hold is a bad ground or a bad board. Do not bend the rod into a bigger flame to fake the number." },
    { id: "floatsw", name: "Float switch",
      op: "A switch in the condensate pan or the pump. It opens the 24-volt circuit when water rises, so the compressor stops before the ceiling does.",
      keep: "Lift it on every maintenance and prove the outdoor unit shuts off. Put it back so it can still rise.",
      fix: "Unit dead and the pan is dry: the switch is stuck open or the wires are off. Ohm it. A wet pan and a closed switch means the switch is not the protection you think it is. Do not jump it and leave the jump." },
    { id: "fuse", name: "Fuse", img: "parts/fuse.png",
      op: "A fuse is a thin link that opens when current stays too high. Control fuses are often 3 or 5 amp on the transformer secondary. Line fuses in the disconnect protect the wire.",
      keep: "Correct amp rating. A spare of the right size in the truck, not a slug of copper.",
      fix: "A blown 3-amp fuse means a low-voltage short, usually a shorted contactor coil, a thermostat wire rubbed through, or a floated conductor. Find the short before you put the new fuse in. A fuse that blows as the contactor pulls in is the coil until proven otherwise." },
    { id: "gasvalve", name: "Gas valve",
      op: "The board proves inducer draft, then the ignitor, then it energizes the valve. Gas meets the ignitor. The flame sensor has to prove flame or the valve drops out.",
      keep: "Leak-check every joint you touch. Do not use the valve as a handle. Keep the vent on the regulator pointed as the maker drew it.",
      fix: "24 volts at the valve and no gas: the valve is done or the outlet pressure is wrong. No voltage: the board never got a prove from the pressure switch, the limit, or the flame circuit. Do not jump the valve to 'make it heat' while you stand there. Set manifold pressure with a manometer to the nameplate." },
    { id: "hardstart", name: "Hard-start kit",
      op: "A start capacitor and a potential relay, or a PTC, give the compressor a boost for a second on startup. The relay drops the start cap out as soon as the motor is up.",
      keep: "It is a help for a compressor that is hard to start because of tight bearings or low voltage, not a cure for a shorted winding. Write the date on it.",
      fix: "A start cap left in the circuit will explode. If the compressor stays on the start winding, the relay is wrong or wired wrong. Potential relay: 5 to the start winding, 2 to the run winding, 1 to the start cap. Terminal 2 is not compressor common. Match the relay number to the compressor. Do not add a second kit beside the first." },
    { id: "strips", name: "Heat strips",
      op: "Electric resistance heat in the air handler. Sequencers or relays bring the banks on in steps so the breaker does not see the whole load at once. Air has to be moving or the limit opens.",
      keep: "Prove airflow first. Keep the filter clean. Check amp draw of each bank against the kilowatt rating. About 5 kilowatts at 240 volts is about 21 amps.",
      fix: "No heat and the blower runs: ohm the element with power off. OL is an open element. Near zero is a short. A bank that never comes on is often a sequencer, not the strip. Replace an element that sags onto the cabinet. Do not straighten it and send it." },
    { id: "hps", name: "High-pressure switch", img: "parts/pressuresw.png",
      op: "Opens the control circuit when head pressure gets too high. It protects the compressor from a dead condenser fan, a plugged coil, or a gross overcharge.",
      keep: "Do not bypass it for a 'test run' and walk away. If you jump it to diagnose, pull the jump before you leave.",
      fix: "Switch open and the coil is dirty or the fan is dead: fix that, let the pressure fall, and see if the switch resets. A switch that will not close after the pressure is normal is failed open. Match the cut-out pressure. An automatic reset that chatters will burn the contactor." },
    { id: "ignitor", name: "Hot-surface ignitor",
      op: "A silicon carbide or nitride element that glows hot enough to light gas. The board powers it before the valve opens. It is brittle.",
      keep: "Do not touch the element with your fingers. Oil from skin shortens it. Look at it. A white crack is a crack.",
      fix: "No glow: ohm it against the board's range. Many carbide ignitors read about 40 to 90 ohms, but use the part in your hand, not a number from memory. A nitride ignitor reads higher. Cracked or OL gets replaced. Do not file it or wrap it." },
    { id: "inducer", name: "Inducer motor",
      op: "Pulls flue gas through the heat exchanger before the gas valve opens. The pressure switch proves that draft. Then, and only then, the board lights the burner.",
      keep: "Keep the wheel clear of rust scale. Keep the pressure-switch hose from kinking. The vent outside has to be the length and size on the furnace tag.",
      fix: "Inducer runs, pressure switch never closes: blocked vent, water in the hose, or a bad switch. Inducer never starts: check the capacitor if it has one, then the motor, then the board output. A wheel packed with scale spins and proves nothing." },
    { id: "limit", name: "Limit switch",
      op: "A temperature switch on the heat exchanger. It opens when the furnace gets too hot, usually from low airflow, and it drops the gas. The blower often keeps running to cool the exchanger.",
      keep: "The real maintenance is the filter, the blower wheel, and the ducts. A limit that trips is telling you about airflow.",
      fix: "Ohm it when the furnace is cool. It should be closed. A limit that is open cold is bad. A limit that opens during the call is doing its job. Find the plugged coil, the shut registers, or the weak blower. Do not jump a limit and leave it." },
    { id: "lps", name: "Low-pressure switch", img: "parts/pressuresw.png",
      op: "Opens when suction pressure falls too low. That saves a compressor from running in a vacuum because of a lost charge or a frozen coil.",
      keep: "Same rule as the high-pressure switch. A jump is a test, not a repair.",
      fix: "Open switch with a dirty filter and an iced coil: airflow, not the switch. Open switch and the system is empty: find the leak, do not keep resetting it. A switch that will not close at a normal suction is failed." },
    { id: "gauges", name: "Manifold gauges", img: "parts/gauges.png",
      op: "Blue hose on the suction service valve, red hose on the liquid service valve, yellow hose on the tank, the vacuum pump, or the recovery machine. Valves on the manifold stay closed to read pressure. Opening a valve connects that side to the yellow hose.",
      keep: "Change O-rings and hoses when they weep. Keep the low-loss fittings on. Purge hoses so you do not push air into a system. Calibrate to zero with the hoses off.",
      fix: "A gauge that does not return to zero is a bad gauge. A hose that bleeds at the Schrader depressor needs a core tool and a new core, not a tighter yank on the hose. Do not leave a manifold sitting on a running system overnight." },
    { id: "piston", name: "Piston (fixed orifice)", img: "parts/metering.png",
      op: "A small brass piston with a hole sized for the tonnage. It drops the pressure of the liquid. It does not adjust. Charge these by superheat, and the target superheat changes with indoor wet bulb and outdoor temperature.",
      keep: "The arrow, or the piston seat, has to point the right way. A piston in backwards hunts and will not meter. Match the number to the condenser and the evaporator.",
      fix: "High superheat that will not come down with a correct charge can be a piston that is too small or trash on the seat. Low superheat in mild weather is a piston that is too big. Do not put a TXV piston body back together without the piston. Screen first, then the seat." },
    { id: "receiver", name: "Receiver",
      op: "A tank in the liquid line on some commercial systems. It stores extra liquid so the condenser can drain and the valve still has a solid column when the load changes.",
      keep: "The king valve on the outlet is how you pump the system down. Know which way 'front-seat' is before you turn it. A receiver is not an accumulator.",
      fix: "A receiver that is hot all the way up is full. A receiver that is cold at the bottom and warm at the top has a liquid level you can use. Do not add charge until you know where that level is. A leaking king valve gets replaced or repacked, not cranked harder." },
    { id: "relay", name: "Fan relay", img: "parts/relay.png",
      op: "A small 24-volt relay that switches the blower or a fan. The coil is in the control circuit. The contacts carry the motor current.",
      keep: "Feel it pull in on a call. A relay that buzzes is a weak coil or low 24 volts, not a blower problem yet.",
      fix: "Coil energized and the motor dead: ohm across the contacts. Open contacts get a new relay. A coil that shorts takes the transformer with it, the same as a contactor coil. Match the coil voltage and the contact rating." },
    { id: "reversing", name: "Reversing valve",
      op: "A pilot-operated valve that swaps the indoor and outdoor coils. In cool, the indoor coil is the evaporator. In heat, the outdoor coil is the evaporator. The solenoid shifts a pilot, and system pressure slides the main valve.",
      keep: "Do not whack the valve body with a wrench to make it shift. Check the solenoid is getting 24 volts before you condemn the valve.",
      fix: "Pressures that walk together, discharge hot on the suction line, and a valve that will not shift: the slide may be bled or stuck. A solenoid that will not ohm is just the coil. Replace the coil first. A valve change is a compressor-level braze job. Keep the body cool with a wet rag and flowing nitrogen." },
    { id: "schrader", name: "Schrader core",
      op: "A spring-loaded core in the service port, the same idea as a tire valve. The hose depressor pushes it open. Caps are the real seal. The core is the second seal.",
      keep: "Put the cap back, with the rubber washer in it. A missing cap is how ports leak and how they get full of dirt.",
      fix: "Use a core-removal tool if the system is charged. Change a leaking core without dumping the charge. R-410A eats a tired core. If the port threads are damaged, the core tool will not save you. Recover and replace the valve." },
    { id: "sequencer", name: "Sequencer",
      op: "A stack of switches with a small heater. On a call for electric heat the heater warps bimetal discs and the banks of strips come on a few seconds apart. Off the call, they drop out in order.",
      keep: "Nothing to oil. Keep the 24-volt call honest and the strips' amp draw in range so the sequencer is not the thing that burns.",
      fix: "Call present and only some banks ever come on: the sequencer contacts for that bank are done. Replace the sequencer. Do not jumper every bank at once or the breaker becomes the sequencer." },
    { id: "sight", name: "Sight glass",
      op: "A window in the liquid line. A full glass of clear liquid means a solid column. Bubbles can mean a low charge, a restriction upstream, or just a cold start. The moisture indicator turns color when the system is wet.",
      keep: "Read it after the system is stable, not in the first minute. A yellow indicator means the drier is used up.",
      fix: "Bubbles with a correct subcooling are not automatically a low charge. A restriction ahead of the glass makes bubbles too. Flashing right at a TXV outlet is normal. Flashing in the glass is not. Change a wet drier. Do not keep adding refrigerant to 'clear the glass' on a TXV system." },
    { id: "stat", name: "Thermostat", img: "parts/thermostat.png",
      op: "A switch, or a set of switches, that calls for heat, cool, and fan. On a conventional stat, R is power, G is fan, Y is cool, W is heat, C is the common that lets a smart stat steal power.",
      keep: "Level a mercury stat, if you still find one. Set the fan on Auto for cooling so the coil can dehumidify. Change the batteries before the cooling season on a battery stat.",
      fix: "No call outside and the stat shows a call: prove 24 volts from R to C, then R to Y or W at the stat and again at the board. A missing C wire makes a smart stat ghost-call. A shorted stat wire blows the 3-amp fuse. Do not mount a stat on an outside wall or over a supply register and then chase the charge." },
    { id: "transformer", name: "Transformer", img: "parts/transformer.png",
      op: "Steps line voltage down to about 24 volts for the control circuit. The VA rating is how many amps it can feed. A 40 VA transformer at 24 volts can give about 1.7 amps. More than that and the voltage sags.",
      keep: "Add up the coils you hang on it. Contactors, a gas valve, and a smart stat all take a share. Leave headroom.",
      fix: "No 24 volts and the primary is live: the transformer or the fuse is open. Primary voltage missing: the door switch, the breaker, or the disconnect. A transformer that buzzes and runs hot is overloaded or shorted on the secondary. Find the short before you bolt a bigger one in the same hole." },
    { id: "txv", name: "TXV", img: "parts/metering.png",
      op: "Meters liquid into the evaporator and holds superheat. Bulb pressure opens the pin. Evaporator pressure and the spring close it. High superheat opens the valve. Low superheat lets it close. The pressure drop, and the flash, happen at the seat.",
      keep: "Strap the bulb to the suction line at the coil outlet, at 4 or 8 o'clock, tight, and insulate it. The external equalizer goes on the suction line, not on the liquid line. Charge a TXV system by subcooling.",
      fix: "Superheat stuck high with a solid liquid line: bulb loose, bulb warm from being uninsulated, plugged inlet screen, or a dead power head. Superheat at zero: bulb fell off or the valve is stuck open. Do not crank the stem to fix a low charge or a dirty filter. Airflow and charge first, then a small turn of the stem, then wait." },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  var BOOKS = [
    { title: "On every call", ids: ["filterair", "capacitor", "contactor", "evaporator", "txv", "compressor"] },
    { title: "The refrigerant loop", ids: ["compressor", "condenser", "cfan", "evaporator", "txv", "piston", "drier", "accumulator", "receiver", "reversing", "heater", "sight", "schrader"] },
    { title: "Air and water", ids: ["filterair", "blower", "drain", "pump"] },
    { title: "Power and controls", ids: ["capacitor", "contactor", "disconnect", "fuse", "relay", "transformer", "stat", "hps", "lps", "gauges", "hardstart"] },
    { title: "Heat", ids: ["defrost", "flame", "gasvalve", "ignitor", "inducer", "limit", "strips", "sequencer"] },
  ];

  function byId(id) {
    var i;
    for (i = 0; i < ENTRIES.length; i++) if (ENTRIES[i].id === id) return ENTRIES[i];
    return null;
  }

  function letterOf(name) {
    return name.charAt(0).toUpperCase();
  }

  function Bible(host, opts) {
    var onHub = opts && opts.onHub;
    var q = "";
    var only = "";
    var openId = "";

    function list() {
      var query = q.trim().toLowerCase();
      return ENTRIES.filter(function (e) {
        if (only && letterOf(e.name) !== only) return false;
        if (!query) return true;
        var blob = (e.name + " " + e.op + " " + e.keep + " " + e.fix).toLowerCase();
        return blob.indexOf(query) !== -1;
      });
    }

    function entry() {
      var i;
      for (i = 0; i < ENTRIES.length; i++) if (ENTRIES[i].id === openId) return ENTRIES[i];
      return null;
    }

    function letters() {
      var seen = {};
      var out = [];
      ENTRIES.forEach(function (e) {
        var L = letterOf(e.name);
        if (!seen[L]) {
          seen[L] = true;
          out.push(L);
        }
      });
      return out;
    }

    function paint() {
      var e = entry();
      var rows = list();
      host.innerHTML =
        '<div class="bible">' +
        '<header class="bible-bar">' +
        '<button type="button" class="btn" id="bible-hub">Shop floor</button>' +
        "<h2>The HVAC Bible</h2>" +
        '<span class="bible-count">' + ENTRIES.length + " parts</span>" +
        "</header>" +
        '<p class="bible-lead">Look up the part before you condemn it. Operation, upkeep, and the repair. Six parts decide most calls: filter, capacitor, contactor, evaporator, TXV, compressor.</p>' +
        (e ? paintEntry(e) : paintList(rows)) +
        "</div>";
      bind();
    }

    function rowHtml(items) {
      if (!items || !items.length) return '<p class="bible-empty">Nothing under that word. Try compressor, drain, or fuse.</p>';
      return items
        .map(function (item) {
          return (
            '<button type="button" class="bible-row" data-id="' +
            item.id +
            '">' +
            (item.img
              ? '<img src="' + item.img + '" alt="" />'
              : '<span class="bible-ph">' + letterOf(item.name) + "</span>") +
            "<span><b>" +
            esc(item.name) +
            "</b><small>" +
            esc(item.op.slice(0, 90)) +
            (item.op.length > 90 ? "…" : "") +
            "</small></span></button>"
          );
        })
        .join("");
    }

    function paintList(rows) {
      return (
        '<input id="bible-q" class="bible-search" type="search" placeholder="Search a part, a symptom, a tool" value="' +
        esc(q) +
        '" />' +
        '<div class="bible-az" id="bible-az">' +
        '<button type="button" class="btn' + (only === "" ? " primary" : "") + '" data-let="">All</button>' +
        letters()
          .map(function (L) {
            return '<button type="button" class="btn' + (only === L ? " primary" : "") + '" data-let="' + L + '">' + L + "</button>";
          })
          .join("") +
        "</div>" +
        '<div class="bible-list">' +
        (q.trim() || only
          ? rowHtml(rows)
          : BOOKS.map(function (book) {
              var items = book.ids.map(byId).filter(Boolean);
              return '<h4 class="bible-book">' + esc(book.title) + "</h4>" + rowHtml(items);
            }).join("")) +
        "</div>"
      );
    }

    function paintEntry(e) {
      return (
        '<article class="bible-entry">' +
        '<button type="button" class="btn" id="bible-back">All parts</button>' +
        (e.img ? '<img src="' + e.img + '" alt="" />' : '<span class="bible-ph big">' + letterOf(e.name) + "</span>") +
        "<h3>" +
        esc(e.name) +
        "</h3>" +
        '<section class="bible-sec"><b>Operation</b><p>' +
        esc(e.op) +
        "</p></section>" +
        '<section class="bible-sec"><b>Maintenance</b><p>' +
        esc(e.keep) +
        "</p></section>" +
        '<section class="bible-sec"><b>Repair</b><p>' +
        esc(e.fix) +
        "</p></section>" +
        "</article>"
      );
    }

    function bind() {
      var hub = host.querySelector("#bible-hub");
      if (hub) hub.onclick = function () { if (onHub) onHub(); };
      var back = host.querySelector("#bible-back");
      if (back) back.onclick = function () {
        openId = "";
        paint();
      };
      var input = host.querySelector("#bible-q");
      if (input) {
        input.oninput = function () {
          q = input.value;
          var listEl = host.querySelector(".bible-list");
          if (!listEl) {
            paint();
            return;
          }
          var rows = list();
          var hold = host.querySelector("#bible-q");
          var pos = hold ? hold.selectionStart : q.length;
          listEl.innerHTML = q.trim()
            ? rowHtml(rows)
            : BOOKS.map(function (book) {
                var items = book.ids.map(byId).filter(Boolean);
                return '<h4 class="bible-book">' + esc(book.title) + "</h4>" + rowHtml(items);
              }).join("");
          if (hold) {
            hold.focus();
            if (hold.setSelectionRange) hold.setSelectionRange(pos, pos);
          }
          hookRows();
        };
      }
      var az = host.querySelector("#bible-az");
      if (az) {
        az.onclick = function (ev) {
          var b = ev.target.closest("[data-let]");
          if (!b) return;
          only = b.getAttribute("data-let") || "";
          paint();
        };
      }
      hookRows();
    }

    function hookRows() {
      host.querySelectorAll(".bible-row").forEach(function (b) {
        b.onclick = function () {
          openId = b.getAttribute("data-id");
          paint();
        };
      });
    }

    paint();
    return { stop: function () {} };
  }

  global.HvacBible = {
    start: function (root, opts) {
      root.innerHTML = "";
      return Bible(root, opts || {});
    },
  };
})(typeof window !== "undefined" ? window : this);
