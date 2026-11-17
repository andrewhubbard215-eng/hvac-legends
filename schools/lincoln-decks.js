/* Lincoln Tech lecture decks. Original class slides for the course list.
   Not the publisher files from Canvas. Delete this file and its script tag to remove them. */
(function (global) {
  "use strict";

  var lectures = [
    {
      id: "hcr101",
      code: "HCR101",
      title: "Introduction to Climate Control",
      deck: [
        { kicker: "HCR101", title: "Heat moves. It does not vanish.", points: ["The condenser rejects heat. The evaporator picks heat up.", "If the house is still hot, something in that path is stuck.", "You do not create cold. You move heat."] },
        { kicker: "HCR101", title: "Three ways heat travels", points: ["Conduction: through the copper and the coil fins.", "Convection: air moving across the coil.", "Radiation: the sun on a roof, a hot attic on a duct."] },
        { kicker: "HCR101", title: "Sensible and latent", points: ["Sensible is the temperature you can read on a thermometer.", "Latent is moisture. The coil has to pull both.", "A cold coil with no airflow just ices. It does not dry the house."] },
        { kicker: "HCR101", title: "Temperature and pressure", points: ["One refrigerant, one temperature, one saturation pressure.", "R-410A at 40°F saturation is about 118 psig.", "The P/T chart is the translator. The nameplate says which chart."] },
        { kicker: "HCR101", title: "Copper before the torch", points: ["Cut square. Ream. Deburr. No shavings in the line.", "The flare nut goes on before you flare.", "A cracked flare is a leak you already built."] },
        { kicker: "HCR101", title: "PPE, then the lab", points: ["Glasses on. Gloves that fit. No oil on an oxygen fitting.", "Know where the fire extinguisher is before the torch is lit.", "Lab: build the cycle in the sandbox, then flare a line."] },
      ],
    },
    {
      id: "elec",
      code: "HCR102",
      title: "Electricity",
      deck: [
        { kicker: "HCR102", title: "Two voltages, two jobs", points: ["24 volts is the call. Thermostat, coil, board.", "208 or 240 is the power. Compressor, heat strip, fan.", "Do not meter them the same way and do not land them on the same lug."] },
        { kicker: "HCR102", title: "Ohm's law on a truck", points: ["Volts = amps × ohms.", "Low voltage at a contactor coil means the call never arrived.", "A motor that should pull amps and does not is not running."] },
        { kicker: "HCR102", title: "How you use the meter", points: ["Volts while it is live. Leads where the power is.", "Ohms only after lockout and a prove-dead.", "A beep is not a diagnosis. Read the number."] },
        { kicker: "HCR102", title: "Capacitor and contactor", points: ["The microfarads are on the can. Test against that, not a guess.", "Discharge the capacitor before you grab the terminals.", "The coil is 24 volts. The contacts carry line voltage."] },
        { kicker: "HCR102", title: "Read the schematic", points: ["Start at the thermostat call.", "Follow it to the board, then the contactor coil.", "If the coil is not getting 24, the compressor will not start. Do not condemn the compressor."] },
        { kicker: "HCR102", title: "Lab", points: ["Land black, off-white, and green where the silk screen says.", "One right ohms reading before you button it up.", "TU-522: find the open. Do not jumper a safety to make it run."] },
      ],
    },
    {
      id: "ref",
      code: "HCR105",
      title: "Basic Refrigeration",
      deck: [
        { kicker: "HCR105", title: "Four parts, one loop", points: ["Compressor pumps vapor.", "Condenser rejects heat and makes liquid.", "Metering device drops the pressure.", "Evaporator boils the refrigerant and takes heat from the air."] },
        { kicker: "HCR105", title: "What the needles mean", points: ["Blue is suction. Red is head.", "Off, both sides equalize. On a 95°F day, R-410A sits near 295 psig.", "Running, a healthy 410A split is about 118 suction and about 380 head."] },
        { kicker: "HCR105", title: "Superheat", points: ["Suction line temperature minus suction saturation.", "High superheat: the coil is starved.", "Near 0: liquid is getting back toward the compressor."] },
        { kicker: "HCR105", title: "Subcooling", points: ["Saturation at the head minus liquid line temperature.", "A TXV is charged by subcooling, about 8 to 14°F.", "High subcooling with high head is extra liquid. High head with normal subcooling is airflow."] },
        { kicker: "HCR105", title: "Fingerprints", points: ["Low suction and low head, high superheat, no subcooling: undercharge. Find the leak.", "Low suction, superheat at 0, ice: airflow. Do not add gas.", "High suction and low head: the compressor is not pumping."] },
        { kicker: "HCR105", title: "Vacuum and recovery", points: ["Recover first. Never vent.", "Nitrogen to leak-check. Oxygen is not a test gas.", "Evacuate to 500 microns, valve off the pump, and watch the rise.", "Lab: manifold school, then the recovery bench."] },
      ],
    },
    {
      id: "ac",
      code: "HCR117",
      title: "Air Conditioning Systems",
      deck: [
        { kicker: "HCR117", title: "What kind of unit", points: ["Split: outdoor condensing unit, indoor coil, duct.", "Package: everything in one box.", "Ductless: line set, flares, and a wall head. It is not a 24-volt thermostat job."] },
        { kicker: "HCR117", title: "Mini-split order", points: ["Mount, penetration, outdoor pad, flares, torque.", "Nitrogen, vacuum, decay, then open the service valves.", "Electrical and the communication wire last, then commission."] },
        { kicker: "HCR117", title: "Extra charge", points: ["The factory charge covers the length on the install card.", "Longer than that, weigh the additional ounces. Do not spray it in by feel.", "The plate says the refrigerant. Do not mix."] },
        { kicker: "HCR117", title: "Heat pump", points: ["The reversing valve swaps which coil is the condenser.", "Defrost is a mode. It is not a failed compressor.", "In heat, the outdoor coil is the cold one. Expect frost in cold weather."] },
        { kicker: "HCR117", title: "Commission it", points: ["Airflow first. Then leak check, vacuum, charge.", "Temperature split on a cooling call is the report card.", "Write the pressures and the line temps. A shrug is not a start-up."] },
        { kicker: "HCR117", title: "Lab", points: ["Run the full mini-split install.", "Then a furnace call for heat, all the way to the blower.", "If a step is wrong, the picture does not advance. That is the point."] },
      ],
    },
    {
      id: "hcr108",
      code: "HCR108",
      title: "Design and Energy",
      deck: [
        { kicker: "HCR108", title: "Load is not square footage", points: ["Load is the heat the building gains.", "Windows, insulation, people, and the kitchen all count.", "A rule of thumb is a guess. The Manual J is the number."] },
        { kicker: "HCR108", title: "Bigger is not better", points: ["An oversized unit short-cycles.", "Short cycling does not pull humidity.", "Match capacity to the load, then check the duct can move the air."] },
        { kicker: "HCR108", title: "SEER is not what the truck sees", points: ["SEER is a seasonal number on a yellow sticker.", "On the job you see capacity, airflow, and the charge.", "A high-SEER unit with a crushed duct is still a bad install."] },
        { kicker: "HCR108", title: "Air has to leave", points: ["Dirty filter, closed dampers, undersized return: the coil suffers.", "Low airflow ices a coil in cooling and trips limits in heat.", "Do not fix a duct problem by adding refrigerant."] },
        { kicker: "HCR108", title: "Lab", points: ["Open two brand systems in the sandbox.", "Watch the pressures. Do not chase the charge.", "Write what changed when the airflow changed."] },
      ],
    },
    {
      id: "hcr109",
      code: "HCR109",
      title: "Commercial Refrigeration",
      deck: [
        { kicker: "HCR109", title: "Same cycle, colder box", points: ["A reach-in and a walk-in are still compressor, condenser, metering, evaporator.", "A cooler coil runs warmer than a freezer coil.", "The box temperature is not the saturation temperature. Know which one you measured."] },
        { kicker: "HCR109", title: "Ice is not always low charge", points: ["Off-cycle, electric, or hot-gas defrost. Know which one this box uses.", "A failed defrost builds a block of ice and the suction falls.", "Add gas to an iced coil and you flood it when the ice melts."] },
        { kicker: "HCR109", title: "Restriction or low charge", points: ["Both can show low suction and high superheat.", "Low charge: subcooling is gone.", "Restriction: subcooling is high. Feel both sides of the drier."] },
        { kicker: "HCR109", title: "Racks", points: ["One high side can feed many cases.", "One warm case is not a dead rack.", "Find the circuit before you condemn the compressor."] },
        { kicker: "HCR109", title: "Open it the right way", points: ["Recover first. The charge is bigger than a house split.", "Nitrogen, not oxygen, if you pressure test.", "Replace the drier if you opened the system after a burnout."] },
      ],
    },
    {
      id: "hcr110",
      code: "HCR110",
      title: "Troubleshooting",
      deck: [
        { kicker: "HCR110", title: "Their words first", points: ["Write the complaint the way they said it.", "One picture of the equipment and the thermostat.", "Then decide the first test. Do not start by adding gas."] },
        { kicker: "HCR110", title: "Order", points: ["Is it calling? Thermostat and 24 volts.", "Is there airflow? Filter, blower, coil.", "Then the meter. Then the gauges."] },
        { kicker: "HCR110", title: "One fault", points: ["Low and low with high superheat is a leak, not a dirty roof.", "High head and normal subcooling is outdoor airflow.", "High and low walking together is a weak compressor. Check the amps."] },
        { kicker: "HCR110", title: "Say it out loud", points: ["Name the fault before you name the part.", "Tell the customer what you found in one sentence.", "A parts cannon is not a diagnosis."] },
        { kicker: "HCR110", title: "Lab", points: ["Close a service ticket.", "The paid call is the one you got right.", "If you are stuck, ask for the order. Do not skip to the answer."] },
      ],
    },
    {
      id: "epa",
      code: "EPA 608",
      title: "Refrigerant Certification",
      deck: [
        { kicker: "EPA 608", title: "Venting is not a shortcut", points: ["Section 608 of the Clean Air Act.", "You recover. You do not blow it off.", "The fine is real. So is the license."] },
        { kicker: "EPA 608", title: "Which card", points: ["Type I: small appliances, 5 pounds or less.", "Type II: high-pressure equipment, the house split and most commercial.", "Type III: low-pressure chillers. Universal is all three."] },
        { kicker: "EPA 608", title: "How empty", points: ["The required recovery level depends on the appliance.", "Know 0 inches, 10 inches, 90 percent, and the vacuum numbers on the card.", "A guess does not pass."] },
        { kicker: "EPA 608", title: "The cylinder", points: ["Fill to 80 percent by weight. Not by the frost line.", "Do not heat a recovery tank with a torch.", "Pressure test with nitrogen. Never oxygen."] },
        { kicker: "EPA 608", title: "Three R's", points: ["Recover: pull it out and store it.", "Recycle: clean it for reuse in the same owner's equipment.", "Reclaim: a facility returns it to virgin spec. A new owner means reclaim."] },
        { kicker: "EPA 608", title: "Lab, then the real sitting", points: ["Which card, how empty, the cylinder, the three R's.", "Then the 80 percent drill.", "This is reps. The card is still a proctored exam."] },
      ],
    },
    {
      id: "copper",
      code: "Shop",
      title: "Brazing and Piping",
      deck: [
        { kicker: "Shop", title: "The nut goes on first", points: ["Slide the flare nut on the copper before you flare.", "Forget it and you cut the flare off and start over.", "That is the whole lesson, and people still miss it."] },
        { kicker: "Shop", title: "Cut it clean", points: ["Square cut. Ream the inside. Deburr the outside.", "Shavings left in the tube end up in the metering device.", "Oil the cone. Do not oil the inside of the line."] },
        { kicker: "Shop", title: "A flare that holds", points: ["45 degrees. No cracks. No thin lip.", "Look at it before it goes in the nut.", "Torque to the spec. Tight-by-feel is how flares crack later."] },
        { kicker: "Shop", title: "Braze with nitrogen", points: ["A low flow of nitrogen keeps the inside from scaling.", "Too much flow and you blow the heat out of the joint.", "Heat the cup. The rod follows the heat. A blob on the outside is not a joint."] },
        { kicker: "Shop", title: "Then prove it", points: ["Nitrogen pressure test. Watch the gauge.", "Soap the joints. Bubbles are the answer.", "Do not evacuate a system that is still leaking."] },
      ],
    },
    {
      id: "iconnect",
      code: "Lab",
      title: "iConnect Trainers",
      deck: [
        { kicker: "Trainers", title: "These are the machines in this lab", points: ["The manual did not come with them. This is the manual.", "At the trainer, follow the phone sheet and fill it in.", "At home, practice the picture until the order is boring."] },
        { kicker: "TU-522", title: "Compressor fault board", points: ["Land the cords where the silk screen shows.", "Find the open with the meter.", "Do not jumper a safety to make the compressor run."] },
        { kicker: "TU-601", title: "Mini-split trainer", points: ["Read the plate. It is R-410A.", "Two line sets. Torque the flares.", "There is no Nest on this unit. Do not hunt for a 24-volt stat."] },
        { kicker: "TU-210G", title: "Boiler trainer", points: ["Water moves the heat. Leave the manifold on the cart.", "Three zones. The gas valve is last.", "Do not hook gauges to a water pipe."] },
      ],
    },
  ];

  if (global.SchoolPack) global.SchoolPack.lectures = lectures;
  global.LincolnLectures = lectures;
})(window);
