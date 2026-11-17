/* SCHOOL PACK — HVAC Legends.
   Same trainer as Lincoln Tech. This file is the only difference.
   Another school: copy this file, change the name and the courses, then point
   index.html and desk.html at schools/yourschool.js. Delete the school file you are leaving. */
window.SchoolPack = {
  id: "legends",
  org: "HVAC Legends",
  title: "HVAC Legends",
  mark: "HL",
  wordmark: 'HVAC <span class="lt-red">Legends</span>',
  eyebrow: "Vocational HVAC trainer",
  exam: "EPA 608 · OSHA 30 · HVAC Legends",
  school: "HVAC Legends",
  roof: "Rooftop · the heavens open",
  packCurriculum: "HVAC Legends",
  unbranded: true,
  coachMap: { call: "call", copper: "copper", elec: "elec", charge: "charge", heat: "heat", epa: "epa" },
  units: [
    {
      id: "hl-call",
      code: "HL1",
      title: "The call",
      hours: "Shop",
      credits: "Field",
      topics: ["Write the complaint in their words", "One picture", "Name the first move before the gauges"],
      labGoal: "Hear the house. Commit. Then let the pressures prove it.",
      practice: [
        { mode: "call", label: "Take the call" },
        { mode: "call90", label: "90% furnace call" },
      ],
    },
    {
      id: "hl-copper",
      code: "HL2",
      title: "Copper",
      hours: "Shop",
      credits: "Field",
      topics: ["Nut on before the flare", "Nitrogen, then the torch", "A blob on the outside is not a braze"],
      labGoal: "Make a flare and a braze that would hold on a real line set.",
      practice: [
        { mode: "flare", label: "Flare station" },
        { mode: "braze", label: "Braze bench" },
      ],
    },
    {
      id: "hl-elec",
      code: "HL3",
      title: "The board",
      hours: "Shop",
      credits: "Field",
      topics: ["Volts while it is live", "Ohms only after lockout", "Do not jumper a safety"],
      labGoal: "Land the cord the silk screen shows. Then find the open on the TU-522.",
      practice: [
        { mode: "elguide", label: "Land the lugs" },
        { mode: "iconnect", label: "TU-522 jumper board" },
        { mode: "voltmeter", label: "Multimeter" },
      ],
    },
    {
      id: "hl-charge",
      code: "HL4",
      title: "The charge",
      hours: "Shop",
      credits: "Field",
      topics: ["Airflow before charge", "Superheat and subcool together", "Recover first. Never vent"],
      labGoal: "Read the manifold, recover, and weigh. Do not top off a leak.",
      practice: [
        { mode: "gauges", label: "Manifold school" },
        { mode: "recover", label: "Recovery" },
        { mode: "sandbox", label: "Build the system" },
      ],
    },
    {
      id: "hl-heat",
      code: "HL5",
      title: "Heat",
      hours: "Shop",
      credits: "Field",
      topics: ["Furnace sequence ends at the gas valve", "A mini-split is not a 24-volt stat", "Defrost is not a failed compressor"],
      labGoal: "Prove each heat step, then commission a mini-split.",
      practice: [
        { mode: "furnace", label: "Furnace sequence" },
        { mode: "minisplit", label: "Mini-split install" },
      ],
    },
    {
      id: "hl-card",
      code: "HL6",
      title: "The card",
      hours: "Prep",
      credits: "608",
      topics: ["Which 608 card", "How empty is empty", "80% on the cylinder", "Recover, recycle, reclaim"],
      labGoal: "The card is a real sitting. The drill is the practice.",
      practice: [
        { mode: "epa608", label: "608 drill" },
      ],
    },
  ],
  coach: {
    call: {
      focus: ["the complaint", "first move", "filter before charge"],
      open: "HVAC Legends, the call. Make me say the first move before I see the gauges.",
      drills: ["Diagnostic order", "No cooling", "Airflow before charge"],
    },
    copper: {
      focus: ["flare", "nut on first", "nitrogen purge"],
      open: "HVAC Legends copper. Walk the flare, then nitrogen while I braze.",
      drills: ["Flare steps", "Brazing", "Nitrogen pressure test"],
    },
    elec: {
      focus: ["lockout", "TU-522", "do not jumper a safety"],
      open: "HVAC Legends board. Control string first. I do not jumper a pressure control.",
      drills: ["TU-522", "Voltmeter", "Lockout"],
    },
    charge: {
      focus: ["superheat", "subcool", "recover"],
      open: "HVAC Legends charge. High superheat and low subcool. Then how I recover instead of topping off.",
      drills: ["High SH and low SC means?", "EPA recovery rules", "Manifold hookup"],
    },
    heat: {
      focus: ["furnace sequence", "mini-split", "gas valve last"],
      open: "HVAC Legends heat. Furnace order up to the gas valve, then a mini-split that is not a Nest.",
      drills: ["Furnace sequence", "Mini-split install order", "Defrost"],
    },
    epa: {
      focus: ["recovery", "cylinder", "three R's"],
      open: "HVAC Legends card. Recovery levels, 80% fill, and why reclaim is not recycle.",
      drills: ["EPA recovery rules", "Cylinder fill", "Three R's"],
    },
  },
  track: [
    {
      id: "call",
      code: "Call",
      title: "The house",
      blurb: "Hear it. Commit. The gauges come after the first move.",
      labs: [
        { id: "call", mode: "call", label: "Take the call", xp: 25, what: "Write the complaint. Name the first part you will touch." },
        { id: "call90", mode: "call90", label: "Furnace call", xp: 25, what: "One picture. Say the open limit before the gauges." },
      ],
    },
    {
      id: "copper",
      code: "Copper",
      title: "The joint",
      blurb: "A flare and a braze. The picture does not count until the joint is good.",
      labs: [
        { id: "flare", mode: "flare", label: "Flare a line", xp: 25, what: "Nut on first. Deburr. Clean 45°." },
        { id: "braze", mode: "braze", label: "Braze with nitrogen", xp: 25, what: "Both sides of the cup. Nitrogen flowing, not blasting." },
      ],
    },
    {
      id: "elec",
      code: "Board",
      title: "The board",
      blurb: "Meter it, land it, then walk the TU-522. A safety stays in the string.",
      labs: [
        { id: "ohms", mode: "ohms", label: "Ohm's law", xp: 20, what: "One right reading on a real load." },
        { id: "lugs", mode: "elguide", label: "Land the lugs", xp: 25, what: "Black, red, green. Green is not the stat G." },
        { id: "tu522", mode: "iconnect", label: "TU-522", xp: 40, what: "Guided string, then the board someone left wrong." },
      ],
    },
    {
      id: "charge",
      code: "Charge",
      title: "The refrigerant",
      blurb: "Airflow, then the manifold, then recovery. Do not top off a leak.",
      labs: [
        { id: "gauges", mode: "gauges", label: "Manifold school", xp: 30, what: "Call the charge from superheat and subcool." },
        { id: "recover", mode: "recover", label: "Recovery", xp: 40, what: "Recover, nitrogen hold, decay, weigh." },
        { id: "service", mode: "service", label: "Service call", xp: 25, what: "Name the fault. One right call." },
        { id: "route", mode: "route", label: "Service route", xp: 40, what: "Comic call. Tools first, then the part. The customer talks." },
      ],
    },
    {
      id: "bros",
      code: "Bros",
      title: "HVAC Bros",
      blurb: "Two techs. One rooftop. Stomp the dust, jump the ice, close the call.",
      labs: [
        { id: "bros", mode: "bros", label: "HVAC Bros", xp: 30, what: "Run it. The brother in red is right behind you." },
      ],
    },
    {
      id: "heat",
      code: "Heat",
      title: "Heat",
      blurb: "Furnace sequence, then a mini-split. They are not the same control.",
      labs: [
        { id: "furnace", mode: "furnace", label: "Furnace sequence", xp: 30, what: "Inducer, draft, igniter, valve, flame." },
        { id: "minisplit", mode: "minisplit", label: "Mini-split", xp: 50, what: "Its own control. Not a 24-volt Nest." },
      ],
    },
    {
      id: "epa",
      code: "608",
      title: "The card",
      blurb: "Name the card, the vacuum, the cylinder, then the three R's. 80% is the drill. The sitting is still real.",
      labs: [
        { id: "e608type", mode: "e608type", label: "Which card", xp: 25, what: "Type I, II, or III from the appliance." },
        { id: "e608vac", mode: "e608vac", label: "How empty", xp: 30, what: "0 inches, 10 inches, 90%, or 25 mm Hg." },
        { id: "e608cyl", mode: "e608cyl", label: "The cylinder", xp: 25, what: "80% by weight. Nitrogen, not oxygen." },
        { id: "e608rrr", mode: "e608rrr", label: "Three R's", xp: 25, what: "Recover, recycle, reclaim." },
        { id: "epa608", mode: "epa608", label: "608 drill", xp: 40, what: "80% on a section." },
      ],
    },
    {
      id: "iconnect",
      code: "Lab",
      title: "Hubconnect trainers",
      blurb: "The machines in the lab. The phone sheet is for standing there. The picture is for home.",
      labs: [
        { id: "ic522", mode: "iconnect", label: "TU-522 board", xp: 40, what: "At the machine. Land the cords. Do not jumper a safety." },
        { id: "ic601", mode: "iconnect", label: "TU-601 mini-split", xp: 40, what: "Read the plate. Two line sets. R-410A. No Nest." },
        { id: "ic210", mode: "iconnect", label: "TU-210G boiler", xp: 40, what: "Water, three zones, gas valve last. No gauges on the copper." },
      ],
    },
  ],
};
