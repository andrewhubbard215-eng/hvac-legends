/* Virtual lab for the iConnect trainer lineup.
   TU-522 opens the patch-cord board. Every other unit is a job you do in order. */
(function (global) {
  "use strict";

  const UNITS = [
    { id: "tu522", model: "TU-522", name: "Compressor fault board", group: "On this floor", board: true,
      plate: "Single-phase compressor control board with faults. R-134a only. The catalog twin is the TU-521.",
      steps: ["Open the patch-cord board and land the control string before you touch a load."] },
    { id: "tu601", model: "TU-601", name: "Multi-head mini-split", group: "On this floor", scene: "tu601",
      plate: "Two-zone mini-split heat pump. High wall and ceiling cassette on the frame. R-410A only. 208/240 V, 20 A, 60 Hz.",
      steps: [
        "Read the plate out loud before a hose goes on. R-410A only. 208/240 volts, 20 amps.",
        "Put your hand on the outdoor unit. The Daikin on the floor is the condenser, not the cassette.",
        "Give each indoor head its own line set. The high wall is one pair. The cassette is another.",
        "Blue hose is suction. Red is liquid. Yellow stays capped until you mean to use it.",
        "Leave the Daikin control in place. A 24-volt Nest does not run this compressor."
      ], exercise: [4, 3, 1, 0, 2] },
    { id: "tu210g", model: "TU-210G", name: "Gas hydronic boiler", group: "On this floor", scene: "tu210",
      plate: "Gas boiler hydronic trainer. Radiator, baseboard, and unit heater. Three zone valves. Expansion tank. North Park Innovations, Ellicottville, NY.",
      steps: [
        "Read the plate. This is a gas boiler. Water moves the heat. It is not a refrigerant circuit.",
        "Name the three zones: radiator, baseboard, unit heater. Each has its own valve and thermostat.",
        "Find the expansion tank. It is on the water. It is not a refrigerant receiver.",
        "Prove water is in the boiler and the high limit is closed.",
        "Only then may anyone go near the gas valve. Do not hook a manifold to that copper."
      ], exercise: [4, 2, 0, 3, 1] },

    { id: "tu206c", model: "TU-206C", name: "Residential air conditioner", group: "Air conditioning",
      plate: "Full-size residential air conditioner. Students troubleshoot wiring, piping, and controls.",
      steps: [
        "Read the nameplate before a hose or a meter lead.",
        "Prove indoor airflow. Filter and blower before any charge talk.",
        "Prove the thermostat is calling and the contactor decides to pull.",
        "Hook gauges only to read. Blue suction, red liquid, yellow capped.",
        "Say the fault from superheat and subcool together. Do not add gas to a dirty coil."
      ], exercise: [4, 3, 2, 0, 1] },
    { id: "tu206cgf", model: "TU-206CGF", name: "Air conditioner with gas furnace", group: "Air conditioning",
      plate: "Deluxe residential air conditioner with a gas furnace on the same trainer.",
      steps: [
        "Decide which system the ticket is about. Cool and heat do not share a procedure.",
        "On a cool call, stay on the air conditioner: airflow, contactor, then gauges.",
        "On a heat call, prove inducer, pressure switch, and limit before the gas valve.",
        "Do not treat the gas valve like a contactor coil.",
        "Log which side you worked. The next student finds both systems."
      ], exercise: [3, 1, 0, 2, 4] },
    { id: "tu805", model: "TU-805", name: "Table-top air conditioner", group: "Air conditioning",
      plate: "Compact mobile trainer for the basic refrigeration cycle.",
      steps: [
        "Name the four parts out loud: compressor, condenser, metering device, evaporator.",
        "Watch the high side leave the compressor and reject heat at the condenser.",
        "Watch the metering device drop the pressure before the evaporator.",
        "Feel the suction line after the evaporator. That vapor is going home.",
        "Do not open the system. This pass is the cycle, not a repair."
      ], exercise: [2, 4, 0, 3, 1] },
    { id: "tu810", model: "TU-810", name: "EEV table-top", group: "Air conditioning",
      plate: "Table-top air conditioner with an electronic expansion valve.",
      steps: [
        "Find the electronic expansion valve. It is not a piston you unscrew.",
        "Prove the controller has power before you condemn the valve.",
        "Watch superheat while the valve steps. A stuck valve and a dead controller are different faults.",
        "Do not drive the valve full open to make it cool.",
        "Write what the valve did, then what the pressures did."
      ], exercise: [3, 1, 0, 4, 2] },
    { id: "tu806", model: "TU-806", name: "R-290 EEV table-top", group: "Air conditioning",
      plate: "Table-top air conditioner with an electronic expansion valve and R-290.",
      steps: [
        "Read the plate. R-290 is propane. It is flammable. You do not vent it.",
        "No spark and no torch on a circuit that still holds charge.",
        "Find the electronic expansion valve and prove the controller before the valve.",
        "Recover into an approved cylinder if the circuit has to be opened.",
        "The lesson is the valve and the refrigerant. Not a braze joint on a live circuit."
      ], exercise: [4, 2, 0, 1, 3] },
    { id: "tu9230", model: "TU-9230", name: "Refrigeration training system", group: "Air conditioning",
      plate: "Teaches medium-temperature and low-temperature refrigeration.",
      steps: [
        "Say which box you are on: medium temp or low temp. The coil temperature is not the same job.",
        "Find the metering device for that box before you touch a control.",
        "Medium temp and low temp do not share a cut-out setting.",
        "Defrost belongs to the coil that ices, not to every box.",
        "Write the box temperature you were asked for before you leave the trainer."
      ], exercise: [3, 2, 0, 4, 1] },

    { id: "tu406c", model: "TU-406C", name: "Residential heat pump", group: "Heat pumps",
      plate: "Working residential heat pump. Wiring, piping, and controls for a whole house.",
      steps: [
        "Read the plate and find the reversing valve before you pick a mode.",
        "Call for cool and watch which coil is cold.",
        "Call for heat and watch that coil swap jobs.",
        "Defrost is a cool cycle with the outdoor fan off. Do not condemn the compressor during defrost.",
        "Gauges come after you know which mode you are in."
      ], exercise: [4, 3, 1, 0, 2] },
    { id: "tu406cgf", model: "TU-406CGF", name: "Heat pump with gas furnace", group: "Heat pumps",
      plate: "Residential heat pump plus a gas furnace, so the house has two ways to make heat.",
      steps: [
        "Find both heat sources. Heat pump coil, and the furnace.",
        "A heat call may run the heat pump first. The furnace is the second stage, not the first guess.",
        "Do not open the gas valve to fix a heat pump that is still in defrost.",
        "Prove airflow before either source.",
        "Write which source actually ran."
      ], exercise: [2, 4, 0, 1, 3] },
    { id: "tu701", model: "TU-701", name: "Table-top heat pump", group: "Heat pumps",
      plate: "Table-top heat pump for theory plus wiring, piping, and controls.",
      steps: [
        "Name the reversing valve and which line is hot in cool.",
        "Switch to heat and say which coil just became the condenser.",
        "Find the defrost control. It is a board, not a pressure switch you jumper.",
        "Meter the control string before you condemn the compressor.",
        "Put the trainer back in cool when you leave."
      ], exercise: [3, 2, 4, 0, 1] },
    { id: "tu807", model: "TU-807", name: "Inverter table-top heat pump", group: "Heat pumps",
      plate: "Table-top heat pump with an inverter compressor.",
      steps: [
        "An inverter compressor does not start like a single-phase PSC. Do not listen for a hard start.",
        "Find the inverter drive before the compressor terminals.",
        "A fault code on the drive is the first reading. Gauges are second.",
        "Do not ohm the compressor while the drive is powered.",
        "Write the code, then the mode you were in."
      ], exercise: [3, 4, 0, 2, 1] },
    { id: "tu808", model: "TU-808", name: "Inverter heat pump, R-290", group: "Heat pumps",
      plate: "Heat pump with an inverter compressor and R-290.",
      steps: [
        "Read the plate. R-290 is flammable. No venting, no torch on a charged circuit.",
        "Read the inverter fault code before you pull a wire.",
        "Kill power and prove it dead before any ohm check on the compressor.",
        "Recover into an approved cylinder if the circuit has to come apart.",
        "The lesson is the inverter and the refrigerant class. Not a jumper."
      ], exercise: [4, 2, 0, 3, 1] },
    { id: "tu450", model: "TU-450", name: "Advanced heat pump faults", group: "Heat pumps",
      plate: "Residential and light commercial heat pump with refrigerant, wiring, piping, airflow, and control faults.",
      steps: [
        "Write the complaint before you touch a dial.",
        "Airflow and mode first. A dirty filter imitates a bad charge.",
        "Then the control string. A safety that is open is doing its job.",
        "Gauges only after the fan and the call are honest.",
        "Name one fault. Do not change three parts to clear one ticket."
      ], exercise: [4, 3, 1, 0, 2] },
    { id: "tu430", model: "TU-430", name: "Cold-climate dual fuel", group: "Heat pumps",
      plate: "Inverter heat pump with a two-stage gas furnace for cold-climate dual fuel.",
      steps: [
        "Find the lockout temperature. Below it, the furnace is supposed to carry the house.",
        "Above it, the inverter heat pump runs. Do not force the furnace on to make heat.",
        "Defrost and gas heat are not the same event.",
        "Prove the furnace inducer and limit only when the furnace is the source that was called.",
        "Write which source the control chose, and the outdoor temperature it saw."
      ], exercise: [1, 3, 0, 4, 2] },
    { id: "hp1212", model: "HP-1212", name: "Heat pump electrical simulator", group: "Heat pumps",
      plate: "Electrical simulator. Sequence of operation and schematic reading, with faults you introduce.",
      steps: [
        "Read the schematic before you land a lead.",
        "Call for a mode with the thermostat or the switches. Say which load should run.",
        "Meter the control string in series. An open safety drops everything downstream.",
        "Do not jumper a pressure control to make the compressor run.",
        "Clear the fault you introduced before the next student sits down."
      ], exercise: [3, 4, 1, 0, 2] },
    { id: "ep525", model: "EP-525", name: "Tool package", group: "Heat pumps",
      plate: "Residential air conditioner and heat pump tool set. This is the kit, not a refrigerant circuit.",
      steps: [
        "Lay the meters out: electrical meter, thermometers, and the manifold.",
        "Manifold hoses stay capped until a port is chosen.",
        "Electrical meter proves voltage before any ohm check.",
        "Thermometers go on the lines, not on the cabinet skin.",
        "Pack every tool back in the kit. A missing hose is the next class's leak."
      ], exercise: [1, 3, 4, 0, 2] },

    { id: "tu210e", model: "TU-210E", name: "Electric hydronic boiler", group: "Heating",
      plate: "Same hydronic trainer as the TU-210, with the electric boiler. Three zones, expansion tank, fault switches.",
      steps: [
        "This boiler makes heat with elements, not a gas valve.",
        "Water still has to be in the boiler before a contactor pulls.",
        "Three zones: radiator, baseboard, unit heater. One dead zone is a valve or a stat, not the whole boiler.",
        "The expansion tank is on the water.",
        "Do not hook refrigerant gauges to the copper."
      ], exercise: [4, 2, 0, 1, 3] },
    { id: "tu208", model: "TU-208", name: "Forced air and hydronic", group: "Heating",
      plate: "One trainer, two heat methods: a forced-air furnace and a hot-water loop.",
      steps: [
        "Point at the air side and the water side before you start a call.",
        "A no-heat ticket has to name which side is cold.",
        "Forced air: limit, blower, and the heat source for that cabinet.",
        "Hydronic: pump, zone valve, and water. Not a suction line.",
        "Do not braze the water pipe, and do not hook gauges to it."
      ], exercise: [4, 2, 0, 3, 1] },
    { id: "tu302", model: "TU-302", name: "Electric heat control board", group: "Heating",
      plate: "Electric-heat control board. Sequencers and strips, not a gas valve.",
      steps: [
        "Kill power and prove it dead before you ohm a strip.",
        "A heat call brings on the sequencer. Strips stage. They do not all slam on together.",
        "An open limit kills the strips. Do not jumper it.",
        "Measure one heater at a time. A shorted strip cooks the feed.",
        "The blower has to run with the strips. Heat with no air is how a limit earns its pay."
      ], exercise: [3, 2, 0, 4, 1] },
    { id: "tu502", model: "TU-502", name: "Gas heat control board", group: "Heating",
      plate: "Gas-fired heating control board. The sequence ends at the gas valve. It does not start there.",
      steps: [
        "Call for heat and say the order: inducer, prove draft, igniter, gas valve, flame sense.",
        "The pressure switch is a draft switch. It is not a refrigerant pressure control.",
        "Do not jumper the limit or the pressure switch to make the valve open.",
        "Flame sense is microamps in series, not volts across the rod.",
        "If the valve never got its call, the valve is not the failed part."
      ], exercise: [2, 4, 0, 3, 1] },
    { id: "tu620", model: "TU-620", name: "Airflow and electric heat", group: "Heating",
      plate: "Airflow, motors, and electric heat on one trainer.",
      steps: [
        "Measure airflow before you talk about heat.",
        "Name the motor type you are looking at before you meter it.",
        "Electric strips need the blower. No air, no heat call.",
        "A blower that runs and strips that do not is a heat circuit, not a motor.",
        "Write the cubic feet and the amp draw you actually read."
      ], exercise: [2, 4, 0, 1, 3] },
    { id: "cb1212", model: "CB-1212", name: "Gas package electrical simulator", group: "Heating",
      plate: "Electrical simulator for a gas package unit. Schematic and sequence, with faults.",
      steps: [
        "Read the schematic and find the gas valve on it.",
        "Walk the heat sequence up to the valve. Stop there if a switch is open.",
        "A package unit still has an inducer and a limit. They are not optional.",
        "Do not jumper a safety to light the burners.",
        "Clear the fault before you leave the simulator."
      ], exercise: [3, 1, 0, 4, 2] },
    { id: "un1213", model: "UN-1213", name: "Desktop gas furnace simulator", group: "Heating",
      plate: "Desktop electrical simulator of a gas furnace.",
      steps: [
        "Call for heat on the stat.",
        "Inducer first. Then the draft switch. Then ignition.",
        "The gas valve is last.",
        "An open limit means the heat is not leaving the exchanger. Look at the blower, not the valve.",
        "Do not jumper the limit to finish the lab."
      ], exercise: [2, 4, 0, 3, 1] },

    { id: "tu100", model: "TU-100", name: "Basic refrigeration", group: "Refrigeration",
      plate: "Demonstrates a domestic refrigerator, a self-contained air conditioner, and a reverse-cycle heat pump.",
      steps: [
        "Pick one system on the trainer and stay on it.",
        "Name compressor, condenser, metering device, and evaporator for that system.",
        "A refrigerator and an air conditioner do not share a thermostat setting.",
        "Reverse cycle means the coil jobs swap. Say which one is cold now.",
        "Hands off the service ports. This pass is the cycle."
      ], exercise: [4, 2, 0, 3, 1] },
    { id: "tu101", model: "TU-101", name: "Domestic build-up", group: "Refrigeration",
      plate: "Domestic refrigeration trainer you assemble, so the order of the build is the lesson.",
      steps: [
        "Lay the parts out and name them before a flare or a clamp.",
        "Compressor discharge goes to the condenser, not to the suction.",
        "The metering device sits between condenser and evaporator.",
        "Suction returns to the compressor. A crossed line set will not cool.",
        "Leak check the joints you made before anyone talks about a charge."
      ], exercise: [4, 1, 0, 2, 3] },
    { id: "tu105", model: "TU-105", name: "Commercial refrigeration", group: "Refrigeration",
      plate: "Advanced commercial refrigeration and air conditioning trainer.",
      steps: [
        "Read the box temperature you are supposed to hold.",
        "Find the evaporator for that box and the defrost it uses.",
        "A commercial control is a pressure or temperature control with a differential. Write both numbers.",
        "Do not set the cut-out so low the coil becomes a block of ice.",
        "Gauges after the box, the fan, and the control are known."
      ], exercise: [3, 4, 0, 2, 1] },
    { id: "tu106", model: "TU-106", name: "Dual-application commercial", group: "Refrigeration",
      plate: "Multi-evaporator trainer. Low temp and medium temp, plus electric defrost.",
      steps: [
        "Point at the low-temp evaporator and the medium-temp evaporator. They are not the same coil.",
        "Each coil has its own valve. Opening the wrong one feeds the wrong box.",
        "Electric defrost is a heater and a clock. It is not a refrigerant pressure trick.",
        "Defrost the coil that is iced. Leave the other box alone.",
        "Write which box you changed, and that you put defrost back to automatic."
      ], exercise: [2, 4, 0, 3, 1] },
    { id: "tu130", model: "TU-130", name: "Water-cooled condenser", group: "Refrigeration",
      plate: "Light commercial refrigeration with a dual pressure control, a digital thermostat, and a tube-in-tube water-cooled condenser.",
      steps: [
        "Find the water side of the condenser. No water, no heat rejection.",
        "The dual pressure control has a low cut-out and a high cut-out. They are different switches.",
        "Do not jumper the high-pressure control because the water valve is shut.",
        "Open the water, then watch head pressure come down.",
        "The digital thermostat is the box temperature. It is not the head pressure."
      ], exercise: [2, 3, 0, 4, 1] },
    { id: "tu155", model: "TU-155", name: "Industrial refrigeration", group: "Refrigeration",
      plate: "Commercial and industrial refrigeration principles on a working trainer.",
      steps: [
        "Walk the plant as a system: compressor, condenser, receiver, evaporator.",
        "A receiver level and a box temperature are different readings.",
        "Oil still has to come back to the compressor. A cold suction with no oil return is a problem.",
        "Do not pump the system down by jumping a safety.",
        "Write the pressure and the box you were sent to look at."
      ], exercise: [3, 1, 0, 4, 2] },
    { id: "tu355", model: "TU-355", name: "Recovery, evacuation, charge", group: "Refrigeration",
      plate: "Trainer for recovery, evacuation, and charging. The order is the whole lesson.",
      steps: [
        "Recover first. Never vent.",
        "Repair the leak while the system is empty, then pressure-test with dry nitrogen.",
        "Evacuate to microns at the system, not at the pump.",
        "Weigh the charge in. Do not guess with the suction gauge.",
        "Caps back on. The cylinder valve closed. The scale reads what you wrote down."
      ], exercise: [3, 1, 0, 4, 2] },

    { id: "tu521", model: "TU-521", name: "Single-phase compressor board", group: "Electrical",
      plate: "Catalog name for the single-phase compressor control board. On this floor that board is the TU-522.",
      steps: [
        "This is the same job as the TU-522 on this floor.",
        "Open the TU-522 card and land the patch cords there.",
        "Control string first: stat, pump-down, low pressure, high pressure, coil.",
        "Load second: overload, run capacitor, potential relay.",
        "Do not jumper a pressure control to make it run."
      ], exercise: [4, 2, 0, 1, 3] },
    { id: "tu9240", model: "TU-9240", name: "HVAC electrical control", group: "Electrical",
      plate: "Electrical trainer. Basics of electricity, then a control circuit you build.",
      steps: [
        "Prove the source voltage before you build anything.",
        "Land the control string in series. A switch that is parallel is not a safety.",
        "The load is the last device, not the first.",
        "Meter across an open switch. You should see the source. Across a closed switch you should see about zero.",
        "Pull the circuit apart the way the drawing shows before you leave."
      ], exercise: [2, 4, 0, 3, 1] },
    { id: "tu9250", model: "TU-9250", name: "Controls sequence", group: "Electrical",
      plate: "Companion to the TU-9240. Sequence of a residential heating and cooling system.",
      steps: [
        "Pick cool or heat and stay there.",
        "Say the next load that should start, then watch it.",
        "If that load does not start, meter the switch just before it.",
        "Do not skip ahead to the compressor or the gas valve.",
        "Write the sequence you actually saw."
      ], exercise: [3, 1, 0, 4, 2] },
    { id: "tu9242", model: "TU-9242", name: "Expansion panel", group: "Electrical",
      plate: "Add-on panel for the electrical trainers. More of the circuit, same rules.",
      steps: [
        "See what the panel adds before you move a wire from the main board.",
        "A new load still needs a switch in series ahead of it.",
        "Label the wire you pulled.",
        "Meter the new string the same way: open switch shows voltage, closed switch shows about zero.",
        "Put the panel back to the drawing."
      ], exercise: [1, 4, 0, 2, 3] },
    { id: "tue150", model: "TUE-150", name: "Residential wiring", group: "Electrical",
      plate: "Residential wiring trainer. Boxes, devices, and a circuit you can ring out.",
      steps: [
        "Kill the breaker and prove the box is dead.",
        "Hot, neutral, and equipment ground are three different conductors.",
        "A switch breaks the hot. It does not break the ground.",
        "Ring the circuit before you energize it.",
        "Energize only after the grounds are landed and the box is closed."
      ], exercise: [4, 2, 0, 3, 1] },
    { id: "tue200", model: "TUE-200", name: "Wiring demonstrator", group: "Electrical",
      plate: "Demonstrator for residential wiring. Watch the path, then build it.",
      steps: [
        "Trace the drawing with your finger before a conductor moves.",
        "Name the device the conductor lands on.",
        "Grounds land on the green or the box, not on a switch screw that is for the hot.",
        "Compare your landings to the drawing.",
        "Do not energize a demonstrator that does not match the drawing."
      ], exercise: [4, 2, 0, 1, 3] },
    { id: "tu501", model: "TU-501", name: "Motors and circuits", group: "Electrical",
      plate: "Build-up trainer for motors, controls, and the circuits that start them.",
      steps: [
        "Name the motor: PSC, capacitor start, or the one the plate says.",
        "The overload is in series with common.",
        "A run capacitor stays in. A start capacitor has to drop out.",
        "Meter the winding only with the power proved dead.",
        "A humming motor with a good overload is a capacitor or a relay, not a new compressor."
      ], exercise: [3, 4, 0, 2, 1] },
    { id: "tutstat", model: "TU-TSTAT", name: "Thermostat wiring", group: "Electrical",
      plate: "Thermostat and control wiring trainer.",
      steps: [
        "Kill power to the furnace or air handler before you land a stat wire.",
        "R is power. C is common. They are not the same terminal.",
        "Y is cool. G is fan. W is heat. O or B is the reversing valve.",
        "A wire on the wrong terminal runs the wrong load.",
        "Power back on only after you have read the terminals out loud."
      ], exercise: [4, 2, 0, 1, 3] },
    { id: "br001", model: "BR-001", name: "Brazing stand", group: "Electrical",
      plate: "Brazing practice stand. Nitrogen, then the torch. Not a charged system.",
      steps: [
        "Purge the tube with dry nitrogen. Never oxygen.",
        "The joint is clean and fluxed before the flame.",
        "Heat the tube, not the rod.",
        "The alloy is pulled into the joint. A blob on the outside is not a braze.",
        "Cap the nitrogen and cool the work before it goes back on a rack."
      ], exercise: [3, 1, 0, 4, 2] },

    { id: "pt181", model: "PT-181", name: "DDC portable", group: "Controls",
      plate: "Portable direct-digital-control trainer.",
      steps: [
        "Find the controller and the points it owns before you change a setpoint.",
        "A point that reads wrong may be a sensor, not the program.",
        "Change one setpoint. Watch one output.",
        "Put the setpoint back.",
        "A DDC override is not a jumper wire across a safety."
      ], exercise: [4, 2, 0, 3, 1] },
    { id: "pt201", model: "PT-201", name: "BAS with wire leads", group: "Controls",
      plate: "Case-mounted BAS controller with wire leads you can land.",
      steps: [
        "Read the point list. Input and output are not the same terminal.",
        "Land one sensor. Confirm the controller sees it.",
        "Land one output. Confirm the load it is supposed to start.",
        "A wire on the wrong point runs the wrong load.",
        "Unland what you added and leave the point list as you found it."
      ], exercise: [3, 4, 0, 2, 1] },
    { id: "bl01", model: "BL-01", name: "BAS controller", group: "Controls",
      plate: "BAS controller training unit.",
      steps: [
        "Identify the controller and how you talk to it.",
        "Read the inputs before you write a program.",
        "Command one output and watch the physical load.",
        "If the load does not move, the output point is the question, not the compressor.",
        "Release the command before you leave."
      ], exercise: [3, 1, 0, 4, 2] },
    { id: "bl02", model: "BL-02", name: "BAS controller plus", group: "Controls",
      plate: "BAS controller trainer with the extra points of the Plus unit.",
      steps: [
        "See which points the Plus unit adds.",
        "Name each new point as an input or an output.",
        "Prove one new input reads a real sensor.",
        "Prove one new output drives a real load.",
        "Clear overrides. Extra points are still safeties if they are wired as safeties."
      ], exercise: [4, 2, 0, 1, 3] },
    { id: "cs916", model: "CS-916", name: "Niagara BACnet case", group: "Controls",
      plate: "Case-mounted Niagara N4 BACnet trainer.",
      steps: [
        "Find the BACnet device on the network before you change a point.",
        "Read a point. Do not write one until you know what load it commands.",
        "Command one writable point and watch the equipment.",
        "A BACnet override left on is how the next class loses an hour.",
        "Release every override you made."
      ], exercise: [2, 4, 0, 3, 1] }
  ];

  const VIDEOS = {
    tu100: ["zxEDlowCQ4c", "Introduction to the TU-100"],
    tu106: ["j5nZAo0mO9o", "Lesson ideas for the TU-106"],
    tu130: ["dipx40NLejw", "Overview of the TU-130"],
    tu155: ["tSRgxs-SOFw", "Why instructors choose the TU-155"],
    tu208: ["75GT5eVgxHs", "TU-208 forced air and hydronic"],
    tu210e: ["i5_HQuhLAnU", "TU-210 electric and gas boilers"],
    tu210g: ["i5_HQuhLAnU", "TU-210 electric and gas boilers"],
    tu206cgf: ["35rAQvnFpWE", "Lessons on the TU-206CGF"],
    tu302: ["GfyxbJhjeeM", "Lesson ideas for the TU-302"],
    tu355: ["fL6mxKCbUgA", "TU-355 recovery, evacuation, and charge"],
    tu406c: ["xRkWYZScVkM", "How to set up the TU-406C"],
    tu430: ["tPNmz-20BXQ", "TU-430 cold-climate heat pump"],
    tu450: ["NZ4jnovi0Rw", "TU-450 advanced heat pump"],
    tu502: ["Ru76JpiWU84", "Lesson ideas for the TU-502"],
    tu601: ["zaTZ2biRINc", "Lesson ideas for the TU-601"],
    tu620: ["YdKLz_8_TjA", "TU-620 airflow, motor, and electric heat"],
    tu701: ["5iHjBMUXLaw", "Lesson ideas for the TU-701"],
    tu805: ["IbxfDenqjkY", "Lessons on the TU-805"],
    tu806: ["MdrqDiad-t4", "Introduction to the TU-806"],
    tu807: ["k5YF0zegy8s", "TU-807 inverter heat pump"],
    tu808: ["hDUQ34nWu-I", "Overview of the TU-808"],
    tu810: ["bTRQu51aCeY", "Introduction to the TU-810"],
    tu9230: ["UMQ_LsDkFoM", "Lesson ideas for the TU-9230"],
    tu9240: ["11yEY9HhDtI", "TU-9240 electrical control trainer"],
    tu9250: ["9kEfVZAplR8", "TU-9240 and TU-9250 controls"],
    tue150: ["3n59nYx6E-k", "TUE-150 residential wiring demo"],
    tue200: ["VqzvfZp2_SY", "TUE-200 residential wiring demonstrator"],
    tutstat: ["A2QZ9wxLA6Q", "TU-TSTAT thermostat and control wiring"],
    hp1212: ["E9aT7bUZ6LE", "HP-1212 heat pump electrical simulator"]
  };

  function videoHtml(u) {
    const v = u && VIDEOS[u.id];
    if (!v) return "";
    const watch = "https://www.youtube.com/watch?v=" + v[0];
    return '<figure class="icu-video"><iframe title="' + v[1] + '" src="https://www.youtube-nocookie.com/embed/' + v[0] + '?rel=0" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe><a href="' + watch + '" target="_blank" rel="noopener">iConnect how-to · ' + u.model + "</a></figure>";
  }

  function ensureDragScale() {
    if (typeof document === "undefined" || document.getElementById("icu-drag-scale")) return;
    const st = document.createElement("style");
    st.id = "icu-drag-scale";
    st.textContent = [
      "#ic-catalog .icu-chip img.tv-art,#ic-catalog .icu-chip img.tv-thumb{width:104px!important;height:58px!important;max-width:calc(100vw - 48px)!important;object-fit:contain!important;flex:0 0 auto!important;background:#101418}",
      "#ic-catalog .icu-chip svg.tv-art{width:140px!important;height:56px!important;max-width:calc(100vw - 48px)!important;object-fit:contain!important;flex:0 0 140px!important}",
      "#iconnect-root .tu5-jack{min-height:52px;max-width:100%}",
      "#iconnect-root .tu5-jack i{width:40px;height:40px;object-fit:contain;flex:none}",
    ].join("");
    document.head.appendChild(st);
  }

  function ensureNowCss() {
    if (typeof document === "undefined" || document.getElementById("icu-now-css")) return;
    const st = document.createElement("style");
    st.id = "icu-now-css";
    st.textContent = [
      ".icu-now{margin:8px 0;padding:12px 14px;border:1px solid #e8c450;border-radius:14px;background:#1a160e}",
      ".icu-now strong{display:block;font-size:22px;color:#f6f1e6;line-height:1.2}",
      ".icu-now p{margin:6px 0 0;color:#e7d7b0;font-size:16px;line-height:1.35}",
      ".icu-card.icu-next{border-color:#e8c450;animation:icu-next-glow .7s ease-in-out infinite}",
      "@keyframes icu-next-glow{50%{box-shadow:0 0 0 8px rgba(232,196,80,.55)}}",
      "#iconnect-root .icu-card,#iconnect-root .icu-chip{min-height:48px}",
      ".icu-how{margin:8px 0 12px;padding:12px;border:2px solid #CE0034;border-radius:14px;background:#14171a;color:#f7f3ea;display:flex;flex-direction:column;box-sizing:border-box}",
      ".icu-how h3{margin:0 0 8px;font-size:20px;flex:none}",
      ".icu-how-body{min-height:0;overflow:auto}",
      ".icu-how-row{margin:0 0 8px;padding:8px 10px;border:1px solid #3a4654;border-radius:10px;background:#10161c}",
      ".icu-how-row b{display:block;margin:0 0 2px}",
      ".icu-how-row span{display:block;color:#d8cbb0;font-size:14px;line-height:1.35}",
      ".icu-how .btn{width:100%;min-height:46px;margin-top:4px;flex:none}",
      "@media (max-width:720px){#iconnect-root .icu-how{max-height:min(240px,36dvh);overflow:hidden}#iconnect-root .icu-how-body{overflow:auto}#iconnect-root #icu-how-close{position:sticky;bottom:0}}",
      ".icu-video{margin:8px 0 12px}",
      ".icu-video iframe{width:100%;aspect-ratio:16/9;height:auto;border:0;border-radius:12px;background:#000}",
      ".icu-video a{display:inline-block;margin-top:6px;color:#e8c450;font-size:14px;font-weight:700}",
    ].join("");
    document.head.appendChild(st);
  }

  function mount(host, hooks) {
    if (!host) return { stop: function () {} };
    ensureDragScale();
    ensureNowCss();
    hooks = hooks || {};
    let unit = null;
    let mode = "guide";
    let step = 0;
    let order = [];
    let say = "Tap the gold card.";
    let hint = 0;
    let q = "";
    let dragId = "";
    let walking = false;
    let place = "home";
    let showHow = false;
    const KEY = "lt-iconnect-walk";

    function howHtml() {
      if (!showHow) return "";
      const rows = [
        ["Next", "Gold jack. Then the next one."],
      ];
      return '<div class="icu-how"><h3>How to run a lab</h3>' +
        '<div class="icu-how-body">' +
        rows.map(function (r) { return '<p class="icu-how-row"><b>' + r[0] + "</b><span>" + r[1] + "</span></p>"; }).join("") +
        '</div>' +
        '<button type="button" class="btn primary" id="icu-how-close">Close</button></div>';
    }

    function loadDone() {
      try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
    }
    function stamp(id) {
      const d = loadDone();
      d[id] = 1;
      try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    }
    function doneCount() {
      const d = loadDone();
      return UNITS.filter((u) => d[u.id]).length;
    }
    function nextOpenId(after) {
      const d = loadDone();
      const start = after ? UNITS.findIndex((u) => u.id === after) + 1 : 0;
      for (let i = start; i < UNITS.length; i++) if (!d[UNITS[i].id]) return UNITS[i].id;
      for (let i = 0; i < UNITS.length; i++) if (!d[UNITS[i].id]) return UNITS[i].id;
      return "";
    }

    function byId(id) {
      return UNITS.filter((u) => u.id === id)[0];
    }
    function groups() {
      const out = [];
      UNITS.forEach((u) => {
        if (out.indexOf(u.group) < 0) out.push(u.group);
      });
      return out;
    }
    function allowed(id) {
      const d = loadDone();
      if (d[id]) return true;
      return id === nextOpenId("");
    }
    function open(id, where) {
      where = where || "home";
      if (where === "home" && !allowed(id)) {
        const nxt = byId(nextOpenId(""));
        unit = null;
        place = "home";
        say = "That trainer is protected. Finish " + (nxt ? nxt.model : "the one in front of it") + " first. The class does not skip a machine.";
        render();
        return;
      }
      unit = byId(id);
      place = where === "pick" ? "pick" : where;
      mode = "guide";
      step = 0;
      hint = 0;
      order = unit.steps.map(function (_, i) { return i; });
      if (unit.exercise) order = unit.exercise.slice();
      say = place === "bench"
        ? "At the machine. One step on the phone. Write what you see."
        : unit.board
        ? "Instructor, read this. Student, drag the two gold jacks together. R-134a only. Do not jumper a safety."
        : unit.scene
        ? "Tap the gold part on the picture."
        : "Instructor, read this. Student, drag the gold line into the box. " + unit.steps[0];
      render();
    }
    function hintText() {
      if (!unit) return say;
      if (unit.board) return "Open the board. Control string from L1 through the safeties to the coil, then the overload and the capacitors.";
      if (mode === "guide") {
        if (step >= unit.steps.length) return "That trainer is done. Put it back the way the plate says.";
        return hint < 1 ? "One move. It is still on the bench." : unit.steps[step];
      }
      const wrongAt = order.findIndex((id, i) => id !== i);
      if (wrongAt < 0) return "The order matches the job. Check it, then go to the next trainer.";
      return "Drag the gold line onto the red line. Gold is: " + unit.steps[wrongAt];
    }
    function askHub() {
      const qv = (unit ? unit.model + " " + unit.name + ". " : ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + " trainers. ") + say;
      if (global.HubAI && global.HubAI.say) global.HubAI.say(qv);
      else say = hintText();
      render();
    }
    function land(id) {
      if (!unit || unit.board || mode !== "guide") return;
      const want = String(step);
      if (id !== want) {
        say = "Not this move. " + unit.steps[step];
        hint = 0;
        render();
        return;
      }
      step += 1;
      hint = 0;
      say = step >= unit.steps.length
        ? "Guided is done. Press Exercise. The same job is in the wrong order. The student drags the gold line onto the red line."
        : "Instructor, read this. Student, drag the gold line. " + unit.steps[step];
      render();
    }
    function swap(from, to) {
      if (mode !== "exercise") return;
      const a = order.indexOf(Number(from));
      const b = order.indexOf(Number(to));
      if (a < 0 || b < 0 || a === b) return;
      const hold = order[a];
      order[a] = order[b];
      order[b] = hold;
      say = hintText();
      render();
    }
    function check() {
      const ok = order.every((id, i) => id === i);
      if (ok) {
        stamp(unit.id);
        if (window.CurriculumTrain) window.CurriculumTrain.stamp("iconnect", unit.id);
        const nxt = nextOpenId(unit.id);
        say = nxt
          ? "This trainer is done. " + doneCount() + " of " + UNITS.length + ". Next is waiting."
          : "All " + UNITS.length + " trainers are done. The class can leave the bay.";
      } else {
        say = hintText();
      }
      render();
    }
    function setMode(next) {
      if (next === "exercise" && mode === "guide" && step < unit.steps.length && !loadDone()[unit.id]) {
        say = "This trainer is protected. Finish the guided moves before the exercise.";
        render();
        return;
      }
      mode = next;
      step = 0;
      hint = 0;
      order = unit.exercise ? unit.exercise.slice() : unit.steps.map(function (_, i) { return i; }).reverse();
      say = next === "exercise"
        ? hintText()
        : "Instructor, read this. Student, drag the gold line into the box. " + unit.steps[0];
      render();
    }

    function listHtml() {
      const query = q.trim().toLowerCase();
      const cards = groups().map((g) => {
        const items = UNITS.filter((u) => u.group === g && (!query || (u.model + " " + u.name + " " + u.plate).toLowerCase().indexOf(query) >= 0));
        if (!items.length) return "";
        return '<p class="icu-group">' + g + "</p>" + items.map((u) => {
          const done = loadDone()[u.id];
          const sheet = (global.TrainerVision && global.TrainerVision.finished(u.id)) || (global.BenchSheet && global.BenchSheet.finished(u.id));
          const locked = !done && u.id !== nextOpenId("");
          const mark = (done ? " · practice" : "") + (sheet ? " · sheet" : "") + (VIDEOS[u.id] ? " · video" : "") + (!done && locked ? " · practice locked" : "");
          const glow = !done && !locked && u.id === nextOpenId("") ? " icu-next" : "";
          return '<button type="button" class="icu-card' + (done ? " is-done" : "") + (locked ? " is-locked" : "") + glow + '" data-open="' + u.id + '"><b>' + u.model + mark + "</b><span>" + u.name + "</span></button>";
        }).join("");
      }).join("");
      return cards || '<p class="icu-say">No trainer matches that.</p>';
    }

    function footHtml() {
      if (!unit) return "";
      const nxt = nextOpenId(unit.id);
      const nextBtn = nxt
        ? '<button type="button" class="btn primary" id="icu-next">Next trainer</button>'
        : '<p class="icu-hands">Every trainer is done.</p>';
      if (unit.board) {
        return '<div id="icu-foot" class="icu-foot"><p class="icu-hands">Drag the gold jacks.</p></div>';
      }
      if (mode === "guide" && step >= unit.steps.length) {
        return '<div id="icu-foot" class="icu-foot"><button type="button" class="btn primary" id="icu-goex">Exercise is next</button></div>';
      }
      if (mode === "exercise" && order.every((id, i) => id === i) && loadDone()[unit.id]) {
        return '<div id="icu-foot" class="icu-foot">' + nextBtn + "</div>";
      }
      return '<div id="icu-foot" class="icu-foot"></div>';
    }

    function chooserHtml() {
      const homeLocked = !allowed(unit.id);
      return (
        '<p class="icu-hands">Two ways through ' + unit.model + ".</p>" +
        '<button type="button" class="icu-card" data-place="bench"><b>In front of the trainer</b><span>Hold the phone up. Match the real machine. Fill each step.</span></button>' +
        '<button type="button" class="icu-card' + (homeLocked ? " is-locked" : "") + '" data-place="home"' + (homeLocked ? " disabled" : "") + '><b>Practice at home</b><span>' + (homeLocked ? "Protected until the trainer in front of it is practiced." : "The virtual lab. Use it before class or on the way home.") + "</span></button>"
      );
    }

    function stepPic(text) {
      if (!global.TrainerVision) return "";
      var item = { look: text, say: text };
      return global.TrainerVision.art(global.TrainerVision.artFor(item, unit), item, true);
    }

    function labHtml() {
      if (place === "pick") return chooserHtml();
      if (place === "bench") return '<div id="icu-bench"></div>';
      if (unit.board || unit.scene) {
        var hands = unit.scene
          ? "Drag the gold part."
          : "Drag the gold jacks.";
        return '<p class="icu-hands">' + hands + "</p>" +
          '<div id="icu-board"></div>' + footHtml();
      }
      const done = mode === "guide" && step >= unit.steps.length;
      let body = "";
      if (mode === "guide") {
        const left = unit.steps.map((text, i) =>
          '<button type="button" class="icu-chip' + (i < step ? " done" : "") + (i === step ? " now" : "") + '" data-id="' + i + '"' + (i < step ? " disabled" : "") + ">" + stepPic(text) + "<span>" + (i === step ? "Drag this one. " : "") + text + "</span></button>"
        ).join("");
        body =
          (done ? "" : '<div class="icu-now"><strong>Step ' + (step+1) + ' of ' + unit.steps.length + '</strong><p>' + unit.steps[step] + '</p></div>') +
          '<p class="icu-drop" data-drop="next">' + (done ? "Guided is done." : "Drop the gold line here.") + "</p>" +
          '<div class="icu-tray">' + left + "</div>";
      } else {
        const wrongAt = order.findIndex((id, i) => id !== i);
        body = '<div class="icu-now"><strong>Put the gold line on the red line</strong><p>' + (hintText()) + '</p></div>' +
          '<ol class="icu-order">' + order.map((id) => {
          const now = wrongAt >= 0 && id === wrongAt;
          const bad = wrongAt >= 0 && id === order[wrongAt] && id !== wrongAt;
          return '<li class="icu-chip' + (now ? " now" : "") + (bad ? " bad" : "") + '" data-id="' + id + '">' + stepPic(unit.steps[id]) + "<span>" + (now ? "Drag this onto the red line. " : "") + unit.steps[id] + "</span></li>";
        }).join("") + "</ol>";
      }
      return (
        '<div class="icu-modes">' +
        '<button type="button" class="btn' + (mode === "guide" ? " primary" : "") + '" data-mode="guide">Guided</button>' +
        '<button type="button" class="btn' + (mode === "exercise" ? " primary" : "") + '" data-mode="exercise"' + (mode === "guide" && step < unit.steps.length && !loadDone()[unit.id] ? " disabled" : "") + ">Exercise</button>" +
        '<button type="button" class="btn" id="icu-hint">Hint</button>' +
        '<button type="button" class="btn" id="icu-ask">Ask HUB</button>' +
        (mode === "exercise" ? '<button type="button" class="btn primary" id="icu-check">Check the order</button>' : "") +
        "</div>" +
        '<p class="icu-hands">Trainer ' + (UNITS.findIndex((u) => u.id === unit.id) + 1) + " of " + UNITS.length + " · " + doneCount() + " done · Instructor reads. Student drags.</p>" +
        '<p class="icu-plate">' + unit.plate + "</p>" +
        '<div class="icu-hub"><img src="hub-portrait.jpg?v=3" alt="" /><p>' + say + "</p></div>" +
        body + footHtml()
      );
    }

    function onClear() {
      stamp(unit.id);
      const nxt = nextOpenId(unit.id);
      const foot = host.querySelector("#icu-foot");
      if (!foot) return;
      foot.innerHTML = nxt
        ? '<p class="icu-hands">' + doneCount() + " of " + UNITS.length + " done.</p>" + '<button type="button" class="btn primary" id="icu-next">Next trainer</button>'
        : '<p class="icu-hands">All ' + UNITS.length + " trainers are done.</p>";
      const btn = foot.querySelector("#icu-next");
      if (btn) btn.onclick = function () { walking = true; open(nxt); };
    }

    function render() {
      host.innerHTML =
        '<div class="icu">' +
        (unit
          ? '<button type="button" class="btn" id="icu-back">All trainers</button><h3 class="icu-title">' + unit.model + " · " + unit.name + "</h3>" + videoHtml(unit) + labHtml()
          : '<button type="button" class="btn primary" id="icu-walk">Walk the class · ' + doneCount() + " of " + UNITS.length + " done</button>" +
            '<button type="button" class="btn" id="icu-how">How to run a lab</button>' +
            howHtml() +
            '<label class="icu-search"><input id="icu-q" type="search" placeholder="Search trainers" value="' + q.replace(/[&"<>]/g, "") + '" /></label>' +
            '<p class="icu-count">Tap the gold card.</p>' +
            '<div class="icu-hub"><img src="hub-portrait.jpg?v=3" alt="" /><p>' + say + "</p></div>" +
            listHtml()) +
        "</div>";
      bind();
      if (unit && place === "bench") {
        const el = host.querySelector("#icu-bench");
        if (el && global.TrainerVision && global.TrainerVision.has(unit.id)) global.TrainerVision.mount(el, unit);
        else if (el && global.BenchSheet) global.BenchSheet.mount(el, unit, { onDone: function () {} });
      }
      if (unit && unit.board && place === "home") {
        const el = host.querySelector("#icu-board");
        if (el && global.Tu522) {
          global.Tu522.mount(el, {
            onGuideDone: function () {
              const foot = host.querySelector("#icu-foot");
              if (foot) foot.innerHTML = '<p class="icu-hands">Guided string is landed. On the board, press Exercise, fix the cords, then Check the board.</p>';
            },
            onExerciseClear: onClear,
          });
        } else if (hooks.openBoard) hooks.openBoard(el);
      }
      if (unit && unit.scene && place === "home" && global.VisualStation) {
        const el = host.querySelector("#icu-board");
        if (el) {
          global.VisualStation.mount(el, unit.scene, {
            onGuideDone: function () {
              const foot = host.querySelector("#icu-foot");
              if (foot) foot.innerHTML = '<p class="icu-hands">You walked the machine. Press Exercise, fix what is wrong, then Check the machine.</p>';
            },
            onExerciseClear: onClear,
          });
        }
      }
    }

    function bind() {
      const back = host.querySelector("#icu-back");
      if (back) back.onclick = () => { unit = null; walking = false; say = doneCount() + " of " + UNITS.length + " trainers done. Walk the class picks up where you stopped."; render(); };
      const walk = host.querySelector("#icu-walk");
      if (walk) walk.onclick = () => {
        const id = nextOpenId("");
        if (!id) { say = "All " + UNITS.length + " trainers are done."; render(); return; }
        walking = true;
        open(id);
      };
      const how = host.querySelector("#icu-how");
      if (how) how.onclick = () => { showHow = true; render(); };
      const howClose = host.querySelector("#icu-how-close");
      if (howClose) howClose.onclick = () => {
        showHow = false;
        try { localStorage.setItem("lt-icu-how", "1"); } catch (e) {}
        render();
      };
      const goex = host.querySelector("#icu-goex");
      if (goex) goex.onclick = () => setMode("exercise");
      const nxt = host.querySelector("#icu-next");
      if (nxt) nxt.onclick = () => { const id = nextOpenId(unit.id); if (id) open(id); else { unit = null; render(); } };
      const input = host.querySelector("#icu-q");
      if (input) input.oninput = () => { q = input.value; render(); const again = host.querySelector("#icu-q"); if (again) { again.focus(); again.setSelectionRange(q.length, q.length); } };
      host.querySelectorAll("[data-open]").forEach((b) => { b.onclick = () => open(b.getAttribute("data-open"), "pick"); });
      host.querySelectorAll("[data-place]").forEach((b) => {
        b.onclick = () => {
          if (b.disabled) return;
          open(unit.id, b.getAttribute("data-place"));
        };
      });
      host.querySelectorAll("[data-mode]").forEach((b) => { b.onclick = () => setMode(b.getAttribute("data-mode")); });
      const hintBtn = host.querySelector("#icu-hint");
      if (hintBtn) hintBtn.onclick = () => { hint += 1; say = hintText(); render(); };
      const ask = host.querySelector("#icu-ask");
      if (ask) ask.onclick = askHub;
      const checkBtn = host.querySelector("#icu-check");
      if (checkBtn) checkBtn.onclick = check;
      host.querySelectorAll(".icu-chip").forEach((chip) => {
        chip.addEventListener("pointerdown", onDown);
      });
    }

    function onDown(e) {
      const chip = e.currentTarget;
      if (chip.disabled) return;
      dragId = chip.getAttribute("data-id");
      chip.setPointerCapture(e.pointerId);
      const up = (ev) => {
        chip.removeEventListener("pointerup", up);
        chip.removeEventListener("pointercancel", up);
        const el = document.elementFromPoint(ev.clientX, ev.clientY);
        const hit = el && el.closest ? el.closest("[data-drop], .icu-chip") : null;
        const id = dragId;
        dragId = "";
        if (!hit || !id) return;
        if (hit.getAttribute("data-drop")) land(id);
        else if (hit !== chip) swap(id, hit.getAttribute("data-id"));
      };
      chip.addEventListener("pointerup", up);
      chip.addEventListener("pointercancel", up);
    }

    render();
    return { stop: function () { host.innerHTML = ""; } };
  }

  global.IConnectCatalog = { mount: mount, units: UNITS };
})(window);
