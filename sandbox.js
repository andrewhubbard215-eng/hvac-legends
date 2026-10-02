/* HVAC Legends — Refrigeration Cycle Sandbox */
(function (global) {
  "use strict";

  // ---- Field P/T charts (psig). HVAC Legends pocket-chart numbers. ----
  const PT = {
    "R-410A": [
      [-40, 10.8], [-30, 17.2], [-20, 24.8], [-15, 29.5], [-10, 34.5],
      [-5, 40.0], [0, 48.6], [5, 55.2], [10, 62.3], [15, 70.0],
      [20, 78.3], [25, 87.3], [30, 96.8], [35, 107.0], [40, 118.0],
      [45, 130.0], [50, 142.0], [55, 155.0], [60, 170.0], [65, 185.0],
      [70, 201.0], [75, 217.0], [80, 235.0], [85, 254.0], [90, 274.0],
      [95, 295.0], [100, 317.0], [105, 340.0], [110, 365.0], [115, 391.0],
      [120, 418.0], [125, 446.0], [130, 476.0], [140, 539.0], [150, 608.0],
    ],
    "R-22": [
      [-40, 0.5], [-30, 4.9], [-20, 10.1], [-10, 16.5], [0, 24.0],
      [5, 28.3], [10, 32.8], [15, 37.7], [20, 43.0], [25, 48.8],
      [30, 54.9], [35, 61.5], [40, 68.5], [45, 76.0], [50, 84.0],
      [55, 92.6], [60, 101.6], [65, 111.2], [70, 121.4], [75, 132.2],
      [80, 143.6], [85, 155.7], [90, 168.4], [95, 181.8], [100, 195.9],
      [105, 210.8], [110, 226.4], [115, 242.8], [120, 260.0], [130, 297.0],
      [140, 337.0], [150, 381.0],
    ],
    "R-134a": [
      [-40, -7.4], [-30, -3.0], [-20, 0.6], [-10, 1.9], [0, 6.5],
      [5, 9.1], [10, 12.0], [15, 15.1], [20, 18.4], [25, 22.1],
      [30, 26.1], [35, 30.4], [40, 35.0], [45, 40.0], [50, 45.4],
      [55, 51.2], [60, 57.4], [65, 64.0], [70, 71.1], [75, 78.7],
      [80, 86.7], [85, 95.2], [90, 104.3], [95, 114.0], [100, 124.2],
      [105, 135.1], [110, 146.4], [115, 158.4], [120, 171.1], [130, 198.7],
      [140, 229.0], [150, 263.0],
    ],
    "R-32": [
      [-40, 11.6], [-30, 19.2], [-20, 28.2], [-10, 39.0], [0, 51.2],
      [5, 58.2], [10, 65.8], [15, 74.0], [20, 82.8], [25, 92.4],
      [30, 102.6], [35, 113.6], [40, 125.4], [45, 138.0], [50, 151.4],
      [55, 165.8], [60, 181.2], [65, 197.6], [70, 215.2], [75, 234.0],
      [80, 254.0], [85, 275.4], [90, 298.2], [95, 322.4], [100, 348.2],
      [105, 375.6], [110, 404.8], [115, 435.8], [120, 468.8], [130, 540.0],
      [140, 620.0], [150, 710.0],
    ],
  };
  const HPC_TRIP = { "R-410A": 610, "R-32": 610, "R-22": 400, "R-134a": 300 };
  const LPC_TRIP = { "R-410A": 50, "R-32": 50, "R-22": 25, "R-134a": 8 };


  function satP(ref, tF) {
    const chart = PT[ref] || PT["R-410A"];
    if (tF <= chart[0][0]) return chart[0][1];
    if (tF >= chart[chart.length - 1][0]) {
      const n = chart.length;
      const t0 = chart[n - 2][0], p0 = chart[n - 2][1];
      const t1 = chart[n - 1][0], p1 = chart[n - 1][1];
      return p1 + (tF - t1) * ((p1 - p0) / (t1 - t0));
    }
    for (let i = 0; i < chart.length - 1; i++) {
      const [t0, p0] = chart[i];
      const [t1, p1] = chart[i + 1];
      if (tF >= t0 && tF <= t1) {
        const u = (tF - t0) / (t1 - t0);
        return p0 + u * (p1 - p0);
      }
    }
    return chart[0][1];
  }

  function satT(ref, p) {
    const chart = PT[ref] || PT["R-410A"];
    if (p <= chart[0][1]) return chart[0][0];
    if (p >= chart[chart.length - 1][1]) return chart[chart.length - 1][0];
    for (let i = 0; i < chart.length - 1; i++) {
      const [t0, p0] = chart[i];
      const [t1, p1] = chart[i + 1];
      if (p >= p0 && p <= p1) {
        const u = (p - p0) / (p1 - p0);
        return t0 + u * (t1 - t0);
      }
    }
    return chart[0][0];
  }

  const COMPONENTS = [
    { id: "compressor", name: "Scroll compressor", group: "parts", icon: "⚡", img: "parts/compressor.png", slot: "compressor", required: true, desc: "Hermetic scroll · drag to compressor slot" },
    { id: "condenser", name: "Outdoor condenser", group: "parts", icon: "🔥", img: "parts/condenser.png", slot: "condenser", required: true, desc: "ODU cabinet · fan + coil" },
    { id: "metering", name: "TXV metering device", group: "parts", icon: "🔽", img: "parts/metering.png", slot: "metering", required: true, desc: "Thermostatic expansion valve" },
    { id: "piston", name: "Piston / fixed orifice", group: "parts", icon: "⚪", img: "parts/metering.png", slot: "metering", required: false, desc: "Fixed metering · charge by superheat" },
    { id: "capillary", name: "Capillary tube", group: "parts", icon: "〰️", img: null, slot: "metering", required: false, desc: "Cap-tube metering device" },
    { id: "evaporator", name: "Evaporator A-coil", group: "parts", icon: "❄️", img: "parts/evaporator.png", slot: "evaporator", required: true, desc: "Cased indoor coil · drain pan" },
    { id: "filter", name: "Filter-drier", group: "parts", icon: "🧪", img: "parts/filter.png", slot: "filter", required: false, desc: "Liquid-line drier" },
    { id: "accumulator", name: "Suction accumulator", group: "parts", icon: "🛢", img: "parts/accumulator.png", slot: "accumulator", required: false, desc: "Protects compressor from liquid slug" },
    { id: "receiver", name: "Liquid receiver", group: "parts", icon: "🫙", img: null, slot: "receiver", required: false, desc: "Stores liquid after the condenser" },
    { id: "solenoid", name: "Liquid solenoid", group: "parts", icon: "🧲", img: "parts/relay.png", slot: "solenoid", required: false, desc: "Pump-down valve in the liquid line" },
    { id: "revvalve", name: "Reversing valve (4-way)", group: "parts", icon: "🔀", img: "parts/relay.png", slot: "revvalve", required: false, desc: "Heat pump changeover · discharge in the middle" },
    { id: "sightglass", name: "Sight glass", group: "parts", icon: "👁", img: null, slot: "sightglass", required: false, desc: "Moisture / flash gas in the liquid line" },
    { id: "svcvalves", name: "Service valves", group: "parts", icon: "🔷", img: null, slot: "svcvalves", required: false, desc: "Liquid + suction king valves" },
    { id: "checkvalve", name: "Check valve", group: "parts", icon: "➡️", img: null, slot: "checkvalve", required: false, desc: "One-way in heat-pump piping" },
    { id: "disconnect", name: "Fused disconnect", group: "electrical", icon: "🔌", img: "parts/disconnect.png", slot: "disconnect", required: false, desc: "Outdoor disconnect · L1/L2" },
    { id: "contactor", name: "Contactor", group: "electrical", icon: "🧲", img: "parts/contactor.png", slot: "contactor", required: false, desc: "24V coil · line to compressor" },
    { id: "capacitor", name: "Dual run capacitor", group: "electrical", icon: "🔋", img: "parts/capacitor.png", slot: "capacitor", required: false, desc: "Herm / fan / common terminals" },
    { id: "startcap", name: "Start capacitor", group: "electrical", icon: "⚡", img: "parts/capacitor.png", slot: "startcap", required: false, desc: "Hard-start assist · not a diagnosis" },
    { id: "transformer", name: "24V transformer", group: "electrical", icon: "🔁", img: "parts/transformer.png", slot: "transformer", required: false, desc: "Control voltage · C and R" },
    { id: "thermostat", name: "Thermostat", group: "electrical", icon: "🌡️", img: "parts/thermostat.png", slot: "thermostat", required: false, desc: "Y call · 24V control" },
    { id: "hpsw", name: "High-pressure switch", group: "electrical", icon: "🔺", img: null, slot: "hpsw", required: false, desc: "Opens on high head · safety" },
    { id: "lpsw", name: "Low-pressure switch", group: "electrical", icon: "🔻", img: null, slot: "lpsw", required: false, desc: "Opens on low suction · safety" },
    { id: "odfan", name: "Condenser fan motor", group: "electrical", icon: "🌀", img: null, slot: "odfan", required: false, desc: "ODU fan · heat rejection" },
    { id: "blower", name: "Indoor blower motor", group: "electrical", icon: "💨", img: null, slot: "blower", required: false, desc: "IDU airflow · ECM or PSC" },
    { id: "defrostboard", name: "Defrost control board", group: "electrical", icon: "🧊", img: null, slot: "defrostboard", required: false, desc: "Heat pump defrost logic" },
    { id: "float", name: "Condensate float switch", group: "electrical", icon: "💧", img: null, slot: "float", required: false, desc: "Breaks Y on a full pan" },
    { id: "gauges", name: "Manifold gauge set", group: "tools", icon: "📊", img: "parts/gauges.png", slot: "gauges", required: false, equip: "gauges", desc: "Blue low · red high · drag onto Gauges" },
    { id: "dmm", name: "Digital multimeter", group: "tools", icon: "📟", img: "parts/dmm.png", slot: "dmm", required: false, equip: "dmm", desc: "VAC · AAC · ohms · continuity" },
    { id: "micron", name: "Micron gauge", group: "tools", icon: "📉", img: null, slot: "micron", required: false, equip: "micron", desc: "Deep vacuum readout" },
    { id: "vacpump", name: "Vacuum pump", group: "tools", icon: "⚙", img: null, slot: "vacpump", required: false, equip: "vac", desc: "Pull microns · oil in the sight glass" },
    { id: "recovery", name: "Recovery machine", group: "tools", icon: "♻️", img: null, slot: "recovery", required: false, equip: "recovery", desc: "Recover before you open it" },
    { id: "rectank", name: "Recovery cylinder", group: "tools", icon: "🧯", img: null, slot: "rectank", required: false, desc: "DOT tank · 80% fill by weight" },
    { id: "sniffer", name: "Electronic leak detector", group: "tools", icon: "📡", img: null, slot: "sniffer", required: false, equip: "sniffer", desc: "Move 1–2 in/s from below" },
    { id: "scale", name: "Charging scale", group: "tools", icon: "⚖️", img: null, slot: "chargecan", required: false, desc: "Weigh-in · never guess the charge" },
    { id: "soltest", name: "Solenoid tester", group: "tools", icon: "🧲", img: "parts/relay.png", slot: "soltest", required: false, equip: "soltest", desc: "Magnetic pull-in test · power off preferred" },
    { id: "copper", name: "Copper tubing", group: "materials", icon: "🔶", img: null, slot: "copper", required: false, desc: "Lineset / branch piping" },
    { id: "lineset", name: "Insulated line set", group: "materials", icon: "🔶", img: null, slot: "copper", required: false, desc: "3/8 liquid + 3/4 suction · roll out, insulate suction, nitrogen while brazing" },
    { id: "nitrogen", name: "Dry nitrogen", group: "materials", icon: "💨", img: null, slot: "nitrogen", required: false, equip: "nitrogen", desc: "Purge & pressure test only" },
    { id: "r410a", name: "R-410A cylinder", group: "materials", icon: "🧯", img: null, slot: "chargecan", required: false, desc: "Rose DOT tank · weigh-in · never mix refrigerants" },
    { id: "r22", name: "R-22 cylinder", group: "materials", icon: "🧯", img: null, slot: "chargecan", required: false, desc: "Legacy · recover/charge only if the nameplate says R-22" },
    { id: "r134a", name: "R-134a cylinder", group: "materials", icon: "🧯", img: null, slot: "chargecan", required: false, desc: "Medium-temp / auto / trainers · match the plate" },
    { id: "r32", name: "R-32 cylinder", group: "materials", icon: "🧯", img: null, slot: "chargecan", required: false, desc: "A2L · weigh-in · OEM lineset adder" },
    { id: "flare", name: "Flare fittings", group: "materials", icon: "🔩", img: null, slot: "flare", required: false, desc: "Mini-split line connections" },
    { id: "wire", name: "THHN / thermostat wire", group: "materials", icon: "🧵", img: null, slot: "wire", required: false, desc: "Line voltage + 18/8 control" },
    { id: "insulation", name: "Line-set insulation", group: "materials", icon: "🧱", img: null, slot: "insulation", required: false, desc: "Suction line armaflex" },
    { id: "schrader", name: "Schrader cores", group: "materials", icon: "🔘", img: null, slot: "schrader", required: false, desc: "Cores in / cores out for vac" },
  ];

  function partThumb(c) {
    if (c && c.img) return '<img class="part-img" src="' + c.img + '" alt="' + c.name + '" draggable="false" />';
    return '<span class="ico">' + (c && c.icon ? c.icon : "•") + "</span>";
  }

  // Leading OEM packages — training templates (not licensed replicas)
  const SYSTEMS = [
    {
      id: "goodman-gsx",
      brand: "Goodman",
      name: "GSX14 Split AC",
      type: "split",
      tons: 3,
      ref: "R-410A",
      metering: "orifice",
      seer: "14",
      notes: "Single-stage scroll · piston metering · value residential workhorse",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 20,
      approachEvap: 32,
      targetSH: 14,
      targetSC: 10,
    },
    {
      id: "goodman-gmvc",
      brand: "Goodman",
      name: "GMVC96 Gas Furnace + Coil",
      type: "split-hp-combo",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "16",
      notes: "Communicating furnace air handler with cased coil · TXV indoor",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 18,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 10,
    },
    {
      id: "carrier-comfort",
      brand: "Carrier",
      name: "Comfort 16 Split",
      type: "split",
      tons: 2.5,
      ref: "R-410A",
      metering: "txv",
      seer: "16",
      notes: "Two-stage outdoor · Puron · factory TXV indoor coil",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 17,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 12,
    },
    {
      id: "carrier-infinity",
      brand: "Carrier",
      name: "Infinity 26 Variable",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "24+",
      notes: "Variable-speed inverter · Greenspeed · tight SH control",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 28,
      targetSH: 8,
      targetSC: 10,
    },
    {
      id: "daikin-dx",
      brand: "Daikin",
      name: "DX20VC Fit Heat Pump",
      type: "split-hp",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "Daikin Fit inverter heat pump · swing compressor · EEV",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 15,
      approachEvap: 28,
      targetSH: 8,
      targetSC: 9,
    },
    {
      id: "daikin-aurora",
      brand: "Daikin",
      name: "Aurora Single-Zone Mini-Split",
      type: "minisplit",
      tons: 1.5,
      ref: "R-410A",
      metering: "eev",
      seer: "20+",
      notes: "Wall-mount IDU · hyper-heating ODU · flare lineset · inverter rotary",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 14,
      approachEvap: 26,
      targetSH: 7,
      targetSC: 8,
    },
    {
      id: "mitsubishi-msz",
      brand: "Mitsubishi",
      name: "MSZ-FS Hyper-Heat Mini-Split",
      type: "minisplit",
      tons: 1,
      ref: "R-410A",
      metering: "eev",
      seer: "28",
      notes: "Premium single-zone · 3D i-see sensor · cold-climate heat pump",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator" },
      approachCond: 12,
      approachEvap: 25,
      targetSH: 6,
      targetSC: 8,
    },
    {
      id: "lg-multi",
      brand: "LG",
      name: "Multi F Dual-Zone Mini-Split",
      type: "minisplit-multi",
      tons: 2,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "One ODU · two wall heads · branch box / electronic expansion",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 15,
      approachEvap: 27,
      targetSH: 7,
      targetSC: 9,
    },
    {
      id: "samsung-windfree",
      brand: "Samsung",
      name: "WindFree Mini-Split",
      type: "minisplit",
      tons: 1,
      ref: "R-32",
      metering: "eev",
      seer: "22",
      notes: "R-32 rotary inverter · wind-free panel · flare connections",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator" },
      approachCond: 13,
      approachEvap: 26,
      targetSH: 6,
      targetSC: 8,
    },
    {
      id: "trane-xr",
      brand: "Trane",
      name: "XR17 Split Heat Pump",
      type: "split-hp",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "17",
      notes: "Climatuff compressor · Spine Fin coil · dual-fuel ready",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 16,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 11,
    },
    {
      id: "trane-link",
      brand: "Trane",
      name: "Link XV Communicating Heat Pump",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "Communicating Link outdoor · the free Trane Technician app commissions Link, not a ComfortLink II over Bluetooth · still weigh the charge",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 27,
      targetSH: 8,
      targetSC: 10,
    },
    {
      id: "rheem-rp",
      brand: "Rheem",
      name: "RP17 Prestige Split",
      type: "split",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "17",
      notes: "Three-stage · EcoNet communicating · TXV coil",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 16,
      approachEvap: 29,
      targetSH: 9,
      targetSC: 11,
    },
    {
      id: "lennox-sl",
      brand: "Lennox",
      name: "SL25XCV Variable",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "26",
      notes: "Precise Comfort variable capacity · true communicating system",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 13,
      approachEvap: 27,
      targetSH: 7,
      targetSC: 9,
    },
    {
      id: "bryant-evolution",
      brand: "Bryant",
      name: "Evolution Extreme 24",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "24",
      notes: "Variable-speed · Evolution control · sister platform to Carrier Infinity",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 28,
      targetSH: 8,
      targetSC: 10,
    },
    {
      id: "york-affinity",
      brand: "York",
      name: "Affinity YXV Variable",
      type: "split-inverter",
      tons: 2.5,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "Variable-capacity side-discharge option · residential / light commercial",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 15,
      approachEvap: 29,
      targetSH: 9,
      targetSC: 10,
    },
    {
      id: "amana-asx",
      brand: "Amana",
      name: "ASX16 Split AC",
      type: "split",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "16",
      notes: "Goodman sister brand · volume S-series split · TXV coil · same charging rules, different badge",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 18,
      approachEvap: 30,
      targetSH: 12,
      targetSC: 10,
    },
    {
      id: "bosch-ids",
      brand: "Bosch",
      name: "IDS 2.0 Heat Pump",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "Inverter heat pump, often on an existing furnace · amps follow outdoor temp · do not condemn the compressor from one amp reading",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 27,
      targetSH: 8,
      targetSC: 9,
    },
    {
      id: "fujitsu-halcyon",
      brand: "Fujitsu",
      name: "Halcyon Extra Low Temp Mini-Split",
      type: "minisplit",
      tons: 1.5,
      ref: "R-410A",
      metering: "eev",
      seer: "27",
      notes: "Cold-climate wall mount · flare lineset · leak check the flares before you touch the charge",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 13,
      approachEvap: 26,
      targetSH: 7,
      targetSC: 8,
    },
    {
      id: "danfoss-tr6",
      brand: "Danfoss",
      name: "TR6 TXV on a 3-ton split",
      type: "split",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "16",
      notes: "The valve on a lot of cased coils · T2/TE2 is the service replacement · Ref Tools superheat tuner suggests the turn · the manifold confirms it",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 18,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 10,
    },
    {
      id: "generic-r22",
      brand: "Legacy",
      name: "R-22 Replacement Special",
      type: "split",
      tons: 2.5,
      ref: "R-22",
      metering: "orifice",
      seer: "10",
      notes: "Training only · legacy R-22 piston system for recovery practice",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 25,
      approachEvap: 35,
      targetSH: 15,
      targetSC: 10,
    },
    {
      id: "iconnect-tu102",
      brand: "iConnect",
      name: "TU-102 H-Block AC trainer",
      type: "split",
      tons: 1,
      ref: "R-410A",
      metering: "txv",
      seer: "lab",
      notes: "Shop-floor H-block: visible evap + condenser, sight glasses, receiver, accumulator, hermetic, TXV, drier. Vari-speed fans. Match the trainer on the floor.",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", receiver: "receiver" },
      approachCond: 20,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 10,
      lab: "tu102",
    },
    {
      id: "iconnect-tu601",
      brand: "iConnect",
      name: "TU-601 Multi-head mini-split HP",
      type: "minisplit-multi",
      tons: 2,
      ref: "R-410A",
      metering: "eev",
      seer: "lab",
      notes: "Daikin dual-zone lab: cassette + wall, four sight-glass linesets, R-410A ONLY, 208/240V 20A. Flares, not sweat.",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 26,
      targetSH: 8,
      targetSC: 8,
      lab: "tu601",
    },
  ];

  const LAB_VIDEOS = {
    tu102: [
      { t: "TU-100 H-block intro (iConnect)", url: "https://www.youtube.com/watch?v=zxEDlowCQ4c" },
      { t: "iConnect video library", url: "https://iconnecttraining.com/videos/" },
    ],
    tu601: [
      { t: "TU-601 lesson ideas (4 min)", url: "https://www.youtube.com/watch?v=zaTZ2biRINc" },
      { t: "TU-601 teaching opportunities", url: "https://www.youtube.com/watch?v=tNCLHfJMXFE" },
      { t: "iConnect TU-601 page", url: "https://iconnecttraining.com/training-units/tu-601-multi-head-mini-split-heat-pump-training-unit/" },
    ],
  };

  const TU102_TS = [
    { id: "power", t: "1 · Power & run", d: "Disconnect on. Contactor in. Hermetic humming. LOTO before you ohm windings." },
    { id: "air", t: "2 · Fans to 100%", d: "Evap + cond knobs full. A turned-down fan on this board IS a dirty coil. Airflow before charge." },
    { id: "glass", t: "3 · Sight glasses", d: "Liquid glass after the drier: clear vs bubbles. Suction: mostly vapor. Bubbles ≠ automatically add gas." },
    { id: "pt", t: "4 · SH and SC together", d: "Blends: SH = suction T − evap DEW point. SC = start of boiling in the condenser − liquid T. A pure refrigerant has one boiling temperature. One number is a coin flip." },
    { id: "fp", t: "5 · Fingerprint", d: "High SH + low SC = undercharge/leak. High SH + high SC = restriction or TXV closed — drier outlet is colder, don't add gas. Low SH + high SC = overcharge. Dirty condenser = high head, SC about normal (not an overcharge). Low airflow = SH toward 0 — don't add gas." },
    { id: "txv", t: "6 · TXV last", d: "Bulb tight and insulated. SC in band first. Then ¼-turn: CW raises SH, CCW lowers SH." },
    { id: "drier", t: "7 · Drier / restriction", d: "ΔT across the drier or flash after it = restriction. Replace the drier. Don't feed it more refrigerant." },
    { id: "charge", t: "8 · Charge last", d: "Weigh-in. TXV trims by SC. Never top off a leaker (608)." },
  ];

  function chargeSop(sys) {
    const m = (sys && sys.metering) || (placed.metering === "piston" || placed.metering === "capillary" ? "orifice" : "txv");
    const type = (sys && sys.type) || "split";
    const ref = (sys && sys.ref) || refrigerant || "R-410A";
    const brand = (sys && sys.brand) || "Custom build";
    const name = (sys && sys.name) || "DX loop";
    const tgtSH = (sys && sys.targetSH) || 12;
    const tgtSC = (sys && sys.targetSC) || 10;
    const pre = [
      { id: "air", t: "1 · Airflow first", d: "Filter, blower, coil, static. Commandment 9. Don't charge a starved evaporator." },
      { id: "plate", t: "2 · Nameplate", d: brand + " · " + name + " · " + ref + ". Factory charge + lineset adder. MCA/MOP. OCR is a hint — your eyes are final." },
      { id: "recover", t: "3 · Recover if you open it", d: "EPA 608. Never vent. Recovery cylinder DOT, labeled, 80% by weight. 0 in Hg on the compound gauge is 0 psig — not microns. Recovery machine, not the vacuum pump." },
      { id: "n2", t: "4 · Dry nitrogen proof", d: "Standing pressure. Regulator on. Never oxygen. Never shop air. Soap + sniffer after a drop." },
      { id: "vac", t: "5 · Evacuate", d: "Vacuum pump after the braze — a different machine than recovery. Micron gauge at the system, not the pump alone. About 500 microns and a decay hold. 0 in Hg is still just 0 psig. Cores out to pull, cores in to finish." },
    ];
    let method;
    if (type.indexOf("minisplit") >= 0 || m === "eev") {
      method = [
        { id: "weigh", t: "6 · Weigh-in only", d: "ODU factory charge covers the standard lineset. Extra length = oz/ft from the " + brand + " chart. Scale on the tank. Not a gauge guess." },
        { id: "valves", t: "7 · Open service valves", d: "Only after a passing vacuum. Back-seat. Torque flares / caps. Then power and comms." },
        { id: "run", t: "8 · Run cooling, wait for stable", d: "Inverter/EEV ramps. Low suction on start-up is not 'add gas.' Wait for stable Hz / outdoor RPM." },
        { id: "confirm", t: "9 · Confirm, don't trim by SH", d: "SH/SC are a health check. Additional charge is weight + OEM. Target SH ~" + tgtSH + "°F · SC ~" + tgtSC + "°F once stable." },
        { id: "codes", t: "10 · Commission", d: "Codes, ΔT, drain, line insulation, customer education. Mini-split: wall sleeve sealed, pitch out." },
      ];
    } else if (m === "orifice") {
      method = [
        { id: "weigh", t: "6 · Weigh near nameplate", d: "Get close to factory " + ref + " charge on the scale first." },
        { id: "sh", t: "7 · Charge by superheat", d: "Piston/orifice method. SH = suction line T − evap dew point (" + ref + " P/T). Target ~" + tgtSH + "°F. Use indoor WB / outdoor DB chart." },
        { id: "highsh", t: "8 · High SH → add vapor", d: "Starved coil. Add vapor into suction in small shots. Wait 5–10 min. Recheck SH." },
        { id: "lowsh", t: "9 · Low SH → recover", d: "Floodback risk. Recover a little. If SH is on the floor, prove airflow before you pull more gas." },
        { id: "scchk", t: "10 · SC is a check only", d: "Expect SC near " + tgtSC + "°F. Do not charge a piston by subcooling. High SC + low SH = overcharge. High SC + high SH = restriction. Dirty condenser is high head with SC about normal." },
      ];
    } else {
      method = [
        { id: "weigh", t: "6 · Weigh nameplate + adder", d: "TXV: scale first. Factory " + ref + " + lineset adder per " + brand + "." },
        { id: "sc", t: "7 · Trim by subcooling", d: "TXV method. SC = start of boiling − liquid line T. Target ~" + tgtSC + "°F. Probe on liquid line, out of the sun." },
        { id: "lowsc", t: "8 · Low SC → add", d: "Undercharge. Add per OEM (often liquid into liquid line, or slow vapor). Recheck SC after it settles." },
        { id: "highsc", t: "9 · High SC → recover", d: "Overcharge is high SC (piston also drops SH). Dirty condenser is high head with SC about normal — don't dump gas for a dirty coil. Non-condensables are high head and LOW SC." },
        { id: "shchk", t: "10 · SH is the TXV's job", d: "Expect SH ~" + tgtSH + "°F. Good SC + high SH = bulb or TXV, not a top-off. Low airflow collapses SH toward 0 — don't add gas." },
      ];
    }
    if (/\bhp\b|heat/.test(type)) {
      method.push({
        id: "hp",
        t: "HP · Charge in cooling",
        d: "When outdoor allows, charge in cool. Then verify heat and defrost. One-mode-only SH/SC fail = RV, sensors, or defrost — not a new charge.",
      });
    }
    method.push({
      id: "log",
      t: "Log it",
      d: "Pressures, SH, SC, amps, indoor/outdoor, weighed charge. If it isn't written, it didn't happen.",
    });
    return { title: brand + " · charging SOP", name, metering: m, type, ref, steps: pre.concat(method) };
  }

  const SLOTS = [
    { id: "compressor", x: 0.24, y: 0.50, label: "1 · Compressor", core: true },
    { id: "condenser", x: 0.50, y: 0.16, label: "2 · Condenser", core: true },
    { id: "filter", x: 0.68, y: 0.32, label: "Filter-drier" },
    { id: "metering", x: 0.78, y: 0.50, label: "3 · Metering", core: true },
    { id: "evaporator", x: 0.50, y: 0.84, label: "4 · Evaporator", core: true },
    { id: "accumulator", x: 0.32, y: 0.72, label: "Accumulator" },
    { id: "disconnect", x: 0.10, y: 0.14, label: "Disconnect" },
    { id: "contactor", x: 0.10, y: 0.38, label: "Contactor" },
    { id: "capacitor", x: 0.10, y: 0.62, label: "Capacitor" },
    { id: "transformer", x: 0.10, y: 0.86, label: "Transformer" },
    { id: "thermostat", x: 0.90, y: 0.14, label: "Thermostat" },
    { id: "gauges", x: 0.90, y: 0.38, label: "Gauges" },
    { id: "copper", x: 0.36, y: 0.30, label: "Line set" },
    { id: "nitrogen", x: 0.90, y: 0.62, label: "Nitrogen" },
    { id: "vacpump", x: 0.90, y: 0.86, label: "Vacuum" },
    { id: "chargecan", x: 0.72, y: 0.84, label: "Charge cylinder" },
  ];

  const RAIL = [
    { id: "receiver", label: "Receiver", rail: true },
    { id: "sightglass", label: "Sight glass", rail: true },
    { id: "revvalve", label: "Reversing valve", rail: true },
    { id: "solenoid", label: "Liquid solenoid", rail: true },
    { id: "hpsw", label: "HP switch", rail: true },
    { id: "lpsw", label: "LP switch", rail: true },
    { id: "float", label: "Float switch", rail: true },
    { id: "odfan", label: "Condenser fan", rail: true },
    { id: "blower", label: "Indoor blower", rail: true },
    { id: "defrostboard", label: "Defrost board", rail: true },
    { id: "svcvalves", label: "Service valves", rail: true },
    { id: "checkvalve", label: "Check valve", rail: true },
    { id: "startcap", label: "Start cap", rail: true },
    { id: "micron", label: "Micron gauge", rail: true },
    { id: "dmm", label: "Meter", rail: true },
    { id: "recovery", label: "Recovery machine", rail: true },
    { id: "rectank", label: "Recovery tank", rail: true },
    { id: "sniffer", label: "Leak detector", rail: true },
    { id: "flare", label: "Flares", rail: true },
    { id: "schrader", label: "Schraders", rail: true },
    { id: "wire", label: "Wire", rail: true },
    { id: "insulation", label: "Insulation", rail: true },
    { id: "soltest", label: "Solenoid tester", rail: true },
  ];

  // Side-column slots used to paint on top of the four. They live on the bench rail.
  const BENCH = {
    disconnect: 1,
    contactor: 1,
    capacitor: 1,
    transformer: 1,
    thermostat: 1,
    gauges: 1,
    nitrogen: 1,
    vacpump: 1,
  };

  function benchSlot(id) {
    return !!(id && (BENCH[id] || RAIL.some((s) => s.id === id)));
  }

  function openGaugeWin() {
    const win = document.getElementById("sb-gauges-panel");
    if (!win) return;
    win.classList.add("drawer-open");
    const gTog = document.getElementById("sb-gauges-toggle");
    if (gTog) gTog.setAttribute("aria-expanded", "true");
  }

  const CORE_ROLE = {
    compressor: "Vapor in · high vapor out",
    condenser: "Reject heat · high liquid",
    metering: "Pressure drop · TXV / piston",
    evaporator: "Absorb heat · low vapor",
  };

  const BUILD_STEPS = [
    { slot: "compressor", accept: ["compressor"], tab: "parts", title: "1 · Compressor", hub: "Heart of the DX loop. Drag the scroll compressor onto the glowing box." },
    { slot: "condenser", accept: ["condenser"], tab: "parts", title: "2 · Condenser", hub: "Outdoor coil — heat leaves the house. Drag the outdoor condenser onto the glowing box." },
    { slot: "filter", accept: ["filter"], tab: "parts", title: "3 · Filter-drier", hub: "Liquid line after the condenser, before metering. Moisture and junk stop here." },
    { slot: "metering", accept: ["metering", "piston", "capillary"], tab: "parts", title: "4 · Metering device", hub: "TXV, piston, or cap tube. Pressure drop lives here. TXV by SC; piston by SH." },
    { slot: "evaporator", accept: ["evaporator"], tab: "parts", title: "5 · Evaporator", hub: "Indoor A-coil. Heat into the refrigerant. Loop is almost closed — now the lineset." },
    { slot: "accumulator", accept: ["accumulator"], tab: "parts", title: "6 · Accumulator", hub: "Suction accumulator. Stops a liquid slug from eating the compressor." },
    { slot: "copper", accept: ["lineset", "copper", "insulation"], tab: "materials", title: "7 · Line set", hub: "Roll liquid + suction. Insulate suction. Dry N₂ while you braze. Flares on mini-splits. This is how the two boxes become one system." },
    { slot: "disconnect", accept: ["disconnect"], tab: "electrical", title: "8 · Disconnect", hub: "Fused disconnect at the ODU. LOTO. OSHA 30." },
    { slot: "contactor", accept: ["contactor"], tab: "electrical", title: "9 · Contactor", hub: "24V coil. Line in, load out. No Y = no pull-in." },
    { slot: "capacitor", accept: ["capacitor"], tab: "electrical", title: "10 · Dual run cap", hub: "HERM / FAN / C. Hum with no start is often a weak cap." },
    { slot: "transformer", accept: ["transformer"], tab: "electrical", title: "11 · 24V transformer", hub: "R and C. Dead R and the tstat is wall art." },
    { slot: "thermostat", accept: ["thermostat"], tab: "electrical", title: "12 · Thermostat", hub: "Y call, cool. Brain of the call." },
    { slot: "gauges", accept: ["gauges"], tab: "tools", title: "13 · Gauges", hub: "Manifold on the ports. Don't start it yet — N₂, vacuum, then charge." },
    { slot: "nitrogen", accept: ["nitrogen"], tab: "materials", title: "14 · Nitrogen proof", hub: "Dry N₂ standing test. Regulator on. Never oxygen. Never shop air. Watch decay. Then we pull microns." },
    { slot: "vacpump", accept: ["vacpump", "micron"], tab: "tools", title: "15 · Evacuate", hub: "Vacuum pump + micron gauge at the system — not the recovery machine. About 500 microns and a decay hold. 0 in Hg is 0 psig, not a deep vacuum. Cores out to pull, cores in to finish. 608." },
    { slot: "chargecan", accept: ["r410a", "r22", "r134a", "r32", "scale"], tab: "materials", title: "16 · Charge", hub: "Match the nameplate cylinder. Scale under the tank. Weigh-in, then trim SH or SC per metering. Then Start compressor." },
  ];

  // CoolGame-style timed circuit builds (HVAC Legends clone — not Danfoss IP)
  const CHALLENGES = [
    {
      id: "dx-basic",
      name: "1 · Basic DX circuit",
      time: 60,
      need: ["compressor", "condenser", "metering", "evaporator"],
      hint: "Four core: compressor → condenser → TXV → evaporator → suction home.",
    },
    {
      id: "dx-drier",
      name: "2 · DX + filter-drier",
      time: 70,
      need: ["compressor", "condenser", "filter", "metering", "evaporator"],
      hint: "Drier sits in the liquid line — after the condenser, before the TXV.",
    },
    {
      id: "dx-glass",
      name: "3 · DX + sight glass",
      time: 75,
      need: ["compressor", "condenser", "filter", "sightglass", "metering", "evaporator"],
      hint: "Sight glass after the drier so you can see flash gas / moisture.",
    },
    {
      id: "dx-acc",
      name: "4 · DX + accumulator",
      time: 80,
      need: ["compressor", "condenser", "filter", "metering", "evaporator", "accumulator"],
      hint: "Accumulator on the suction line, into the compressor.",
    },
    {
      id: "pumpdown",
      name: "5 · Pump-down circuit",
      time: 95,
      need: ["compressor", "condenser", "receiver", "filter", "solenoid", "metering", "evaporator"],
      hint: "Receiver after condenser. Liquid solenoid before the TXV — that's pump-down.",
    },
  ];

  const FIELD_JOBS = [
    {
      id: "dirty-odu",
      name: "Rooftop high head",
      complaint: "Unit trips on high pressure. 98°F sun, condenser looks furry.",
      outdoor: 98,
      indoor: 78,
      charge: 100,
      coilCond: "dirty",
      coilEvap: "clean",
      fault: "dirty_cond",
      fix: "Wash the outdoor coil. Don't add gas.",
    },
    {
      id: "dirty-idu",
      name: "Iced evaporator",
      complaint: "Blows cool then ices the A-coil. Filter was a carpet.",
      outdoor: 88,
      indoor: 74,
      charge: 100,
      coilCond: "clean",
      coilEvap: "dirty",
      fault: "dirty_evap",
      fix: "Clean indoor coil / filter / blower. Airflow before charge.",
    },
    {
      id: "leak",
      name: "Slow leak, not cooling",
      complaint: "Not cooling. Ice on suction. Gauges look starved.",
      outdoor: 92,
      indoor: 76,
      charge: 62,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "undercharge",
      fix: "Find leak, repair, recover leftover, evacuate, weigh in. Don't top off.",
    },
    {
      id: "overcharge",
      name: "Someone dumped a jug",
      complaint: "High head, high SC, compressor hot. Last tech 'added a little.'",
      outdoor: 90,
      indoor: 75,
      charge: 128,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "overcharge",
      fix: "Recover to nameplate weight. Don't keep adding.",
    },
    {
      id: "drier",
      name: "Restriction after drier",
      complaint: "High SH, high SC, cold drier outlet. Sight glass flashing.",
      outdoor: 95,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "restricted",
      fix: "Replace the filter-drier, then evacuate and weigh in.",
    },
    {
      id: "txv-bulb",
      name: "TXV lost its mind",
      complaint: "Starved coil, hunting then stuck high SH. Bulb looks kicked.",
      outdoor: 94,
      indoor: 76,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "txv_closed",
      fix: "Replace the TXV (and bulb on the suction line, insulated).",
    },
    {
      id: "txv-flood",
      name: "Flooding compressor",
      complaint: "Low SH, liquid hammer on start. TXV won't shut down.",
      outdoor: 85,
      indoor: 72,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "txv_open",
      fix: "Replace the TXV. Don't just add a hard-start.",
    },
    {
      id: "air",
      name: "Air in the circuit",
      complaint: "High head and high subcooling after a braze with no nitrogen and a short vacuum.",
      outdoor: 95,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "noncondensables",
      fix: "Recover, replace drier, deep vac, weigh in. You can't 'bleed air' from a 410 system.",
    },
    {
      id: "bad-cap",
      name: "Humming compressor",
      complaint: "Humming, hard start, might trip. If it runs, pressures aren't wild.",
      outdoor: 90,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "none",
      capBad: true,
      fix: "Lock out. Read HERM–C µF vs nameplate. Replace the dual run capacitor.",
    },
    {
      id: "rv-stuck",
      name: "Heat pump stuck in heat",
      complaint: "It's 90°F and it's still blowing hot. O at the board, valve never shifted.",
      outdoor: 90,
      indoor: 76,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "rv_stuck_heat",
      hpMode: "cool",
      fix: "24V at the solenoid (O or B). Click? If coil is hot and slider didn't move, replace the 4-way. Don't condemn the compressor first.",
    },
    {
      id: "rv-bleed",
      name: "Reversing valve bleeding",
      complaint: "Runs in both modes but no capacity. Suction line warm. Discharge and suction close.",
      outdoor: 88,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "rv_bleed",
      hpMode: "cool",
      fix: "Internal leak in the 4-way. Temp on the three tubes. If bypassing, replace the valve — not a charge problem.",
    },
    {
      id: "no-defrost",
      name: "Iced solid in heat",
      complaint: "28°F, outdoor coil is a glacier, house is cold. Board never goes to defrost.",
      outdoor: 28,
      indoor: 68,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "defrost_fail",
      hpMode: "heat",
      fix: "Defrost sensor / board. Force defrost: RV to cool, ODU fan OFF. If it never terminates, sensor or time/temp board.",
    },
    {
      id: "stuck-defrost",
      name: "Stuck in defrost",
      complaint: "Steaming outdoor unit, blowing cool in winter, aux heat screaming.",
      outdoor: 35,
      indoor: 70,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "stuck_defrost",
      hpMode: "heat",
      fix: "Terminate defrost. Check coil sensor (should open ~50–70°F). Don't leave it in cool with the fan off all night.",
    },
    {
      id: "od-fan",
      name: "Condenser fan dead",
      complaint: "Tripped on high head. Outdoor fan not spinning. Compressor was screaming.",
      outdoor: 95,
      indoor: 76,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "od_fan",
      fix: "OD fan motor / capacitor / blade. HPC did its job. Don't add gas.",
    },
    {
      id: "weak-pump",
      name: "No capacity, pressures close",
      complaint: "Runs all day, 82° house. Suction high, head low. Amp draw is light.",
      outdoor: 95,
      indoor: 78,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "weak_comp",
      fix: "Weak valves / inefficient compressor. Pump is done. Not a charge problem.",
    },
  ];

  // Cycle path as normalized [x,y] points for particle flow (clockwise from compressor discharge)
  // compressor → condenser → filter → metering → evaporator → accumulator → compressor
  const FLOW_PATH = [
    [0.22, 0.42],
    [0.34, 0.22],
    [0.50, 0.14],
    [0.66, 0.22],
    [0.74, 0.32],
    [0.84, 0.50],
    [0.74, 0.68],
    [0.50, 0.86],
    [0.32, 0.74],
    [0.20, 0.58],
  ];
  const FLOW_PATH_PHONE = [
    [0.22, 0.48],
    [0.36, 0.28],
    [0.50, 0.16],
    [0.64, 0.28],
    [0.76, 0.48],
    [0.64, 0.68],
    [0.50, 0.84],
    [0.36, 0.68],
  ];
  function flowPath() {
    return isPhoneLab() ? FLOW_PATH_PHONE : FLOW_PATH;
  }

  // Phase segments along path index ranges for coloring
  // 0-3 high vapor, 3-6 high liquid, 6-9 low mix, 9-14 low vapor
  function phaseAt(t) {
    // t 0..1 along path
    if (t < 0.22) return "high-vapor";
    if (t < 0.45) return "high-liquid";
    if (t < 0.65) return "low-mix";
    return "low-vapor";
  }

  const PHASE_COLOR = {
    "high-vapor": "#f07178",
    "high-liquid": "#c44e52",
    "low-mix": "#7ec8d3",
    "low-vapor": "#2dd4bf",
  };

  let host = null;
  let canvas = null;
  let ctx = null;
  let glCtl = null;
  let glView = false;
  let raf = 0;
  let placed = {}; // slotId -> componentId
  let inHand = null;

  function parkPartsTray() {
    const root = host || document.getElementById("sandbox-root");
    if (!root) return;
    root.querySelector(".sb-palette")?.classList.remove("drawer-open");
    root.classList.remove("parts-wide");
    root.classList.add("parts-parked");
    root.querySelector(".lab-veil")?.classList.remove("show");
    const pTog = document.getElementById("sb-parts-toggle");
    if (pTog) {
      pTog.textContent = "Parts";
      pTog.setAttribute("aria-expanded", "false");
    }
  }

  function paintInHand() {
    let chip = document.getElementById("sb-inhand");
    if (!chip) {
      const bar = document.querySelector("#sandbox-root .lab-drawers");
      if (!bar) return;
      chip = document.createElement("span");
      chip.id = "sb-inhand";
      chip.className = "sb-inhand";
      bar.appendChild(chip);
    }
    if (!inHand) {
      chip.textContent = "";
      chip.hidden = true;
      return;
    }
    chip.hidden = false;
    chip.textContent = inHand.name + " in hand — tap the box";
  }
  let challenge = null;
  let challengeLeft = 0;
  let challengeTimer = 0;
  let challengeWon = false;
  let onRace = null;
  let raceNick = "Tech";
  let racePin = "";
  let raceChannel = null;
  let raceLive = {};
  let running = false;
  let cutOut = null;
  let refrigerant = "R-410A";
  let outdoorF = 95;
  let indoorF = 75;
  let chargePct = 100;
  let fault = "none";
  let txvTarget = 12;
  let coilCond = "clean";
  let coilEvap = "clean";
  let jobMode = null; // null | recreate | mystery
  let activeJob = null;
  let jobAttempts = 0;
  let jobSolved = false;
  let leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
  function freshVac() {
    return { pump: false, gauge: false, oil: "milky", where: "pump", cores: "in", ballast: "open", microns: 760000, pulling: false, isolated: false, held: false, timer: null };
  }
  let vac = freshVac();
  function resetVac() {
    if (vac.timer) clearInterval(vac.timer);
    vac = freshVac();
  }
  let n2Acked = false;
  let capBad = false;
  let hpMode = "cool"; // cool | heat
  let frost = 0;
  let defrosting = false;
  let guidedOn = true;
  let guidedStep = 0;
  let lastGuideTab = "";
  let chargeChecks = {};
  let labId = null;
  let labFanEvap = 100;
  let labFanCond = 100;
  let labTs = {};
  let particles = [];
  let animT = 0;
  let onXp = null;
  let onDispatchGrade = null;
  let onDispatchNext = null;
  let dispatchCall = null;
  let dispatchLocked = false;
  let dispatchStreak = 0;
  let dispatchDeadline = 0;
  let gaugesEquipped = false;
  let dmmMode = "vac";
  let dmmProbe = "l1l2";
  let activeSystem = null; // SYSTEMS entry or null (custom)

  function lerpPath(t) {
    // t in [0,1)
    const n = flowPath().length;
    const f = t * n;
    const i = Math.floor(f) % n;
    const j = (i + 1) % n;
    const u = f - Math.floor(f);
    const path = flowPath();
    const a = path[i];
    const b = path[j];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }

  function requiredComplete() {
    return ["compressor", "condenser", "metering", "evaporator"].every((s) => placed[s]);
  }

  function stepSeated(step) {
    if (!step || !placed[step.slot]) return false;
    if (step.slot === "vacpump") return !!(vac.pump && vac.gauge && vac.held);
    return true;
  }

  function syncGuidedStep() {
    if (!guidedOn) return;
    let i = 0;
    while (i < BUILD_STEPS.length && stepSeated(BUILD_STEPS[i])) i++;
    guidedStep = i;
  }

  function vacStop() {
    if (vac.timer) clearInterval(vac.timer);
    vac.timer = null;
    vac.pulling = false;
  }

  function vacLimit() {
    if (vac.oil === "milky") return 12000;
    if (vac.cores === "in") return 2500;
    if (vac.ballast === "open") return 1800;
    return vac.where === "system" ? 480 : 320;
  }

  function paintVac() {
    const deck = document.getElementById("sb-vac");
    if (!deck) return;
    const show = vac.pump || vac.gauge || (guidedOn && currentBuildStep() && currentBuildStep().slot === "vacpump");
    if (!show) {
      deck.hidden = true;
      deck.innerHTML = "";
      return;
    }
    deck.hidden = false;
    const n = vac.microns >= 1000 ? Math.round(vac.microns).toLocaleString() : String(Math.round(vac.microns));
    deck.innerHTML =
      '<p class="eyebrow">Evacuate · step 15</p>' +
      '<p class="sb-vac-read">' + n + " microns</p>" +
      '<p class="sb-vac-line">' +
      (vac.held ? "Hold is good. The charge box can light." : vac.isolated ? "Valved off. Watch the number." : "Pull only counts at the system.") +
      "</p>" +
      '<button type="button" class="btn' + (vac.oil === "clear" ? " primary" : "") + '" data-vac="oil">' + (vac.oil === "clear" ? "Oil clear" : "Oil milky · change it") + "</button>" +
      '<button type="button" class="btn' + (vac.where === "system" ? " primary" : "") + '" data-vac="where">' + (vac.where === "system" ? "Gauge on the system" : "Gauge on the pump") + "</button>" +
      '<button type="button" class="btn' + (vac.cores === "out" ? " primary" : "") + '" data-vac="cores">' + (vac.cores === "out" ? "Cores backed out" : "Cores in") + "</button>" +
      '<button type="button" class="btn' + (vac.ballast === "shut" ? " primary" : "") + '" data-vac="ballast">' + (vac.ballast === "open" ? "Ballast open" : "Ballast shut") + "</button>" +
      '<button type="button" class="mach-switch' + (vac.pulling ? " on" : "") + '" data-vac="power" role="switch" aria-checked="' + (vac.pulling ? "true" : "false") + '"' + (vac.pump && vac.gauge && !vac.held ? "" : " disabled") + "><i></i><span>" + (vac.pulling ? "ON" : "OFF") + "</span><em>Vacuum pump</em></button>" +
      '<button type="button" class="btn" data-vac="off"' + (vac.pulling && vac.microns < 2000 ? "" : " disabled") + ">Valve the pump off</button>";
    deck.querySelectorAll("[data-vac]").forEach(function (b) {
      b.onclick = function () { vacAct(b.getAttribute("data-vac")); };
    });
  }

  function vacAct(kind) {
    if (kind === "oil") vac.oil = vac.oil === "milky" ? "clear" : "milky";
    if (kind === "where") vac.where = vac.where === "pump" ? "system" : "pump";
    if (kind === "cores") vac.cores = vac.cores === "in" ? "out" : "in";
    if (kind === "ballast") vac.ballast = vac.ballast === "open" ? "shut" : "open";
    if (kind === "oil" || kind === "where" || kind === "cores" || kind === "ballast") {
      vac.held = false;
      vac.isolated = false;
      vacStop();
      if (guidedOn) {
        syncGuidedStep();
        layoutSlots();
      }
      paintVac();
      return;
    }
    if (kind === "power") {
      if (vac.pulling) {
        vacStop();
        const st = document.getElementById("sb-status");
        if (st) st.textContent = "Pump switch is off. Valve it off if you want the decay to hold.";
        paintVac();
        return;
      }
      kind = "pull";
    }
    if (kind === "pull") {
      if (!vac.pump || !vac.gauge) return;
      vac.isolated = false;
      vac.held = false;
      vac.pulling = true;
      vacStop();
      vac.pulling = true;
      vac.timer = setInterval(function () {
        const floor = vacLimit();
        vac.microns += (floor - vac.microns) * 0.35;
        if (vac.microns < floor + 15) vac.microns = floor;
        const st = document.getElementById("sb-status");
        if (st) {
          st.textContent = floor > 500
            ? (vac.oil === "milky" ? "Milky oil. The pump is boiling water in the crankcase. Change it."
              : vac.cores === "in" ? "Cores are in. The pull is choked at the pin."
              : "Ballast is open. Close it for the deep pull.")
            : (vac.where === "system" ? "About 500 at the system. Valve the pump off and watch." : "That number is at the pump. It is not the system.");
        }
        paintVac();
      }, 400);
      return;
    }
    if (kind === "off") {
      vacStop();
      vac.isolated = true;
      const lied = vac.where !== "system" || vac.microns > 600;
      const tight = leak.nitrogen || !activeJob;
      let ticks = 0;
      vac.timer = setInterval(function () {
        ticks += 1;
        if (lied || !tight) vac.microns += lied ? 1800 : 400;
        else vac.microns += ticks < 3 ? 140 : ticks < 8 ? 20 : 0;
        const st = document.getElementById("sb-status");
        if (!lied && tight && ticks >= 8 && vac.microns < 1200) {
          vac.held = true;
          vacStop();
          leak.vac = true;
          if (st) st.textContent = "Decay held. Moisture and air are out. Cores back in, then the cylinder.";
          if (guidedOn) {
            syncGuidedStep();
            layoutSlots();
            paintHubCoach("Decay held. Next box is the charge.");
          }
        } else if (st) {
          st.textContent = lied
            ? "The number is climbing. The gauge was not on the system, or you never got deep."
            : "Still climbing. The standing nitrogen test was the leak check. This pull will not seal a hole.";
        }
        if (vac.microns > 50000) vacStop();
        paintVac();
      }, 400);
    }
  }

  function currentBuildStep() {
    return BUILD_STEPS[guidedStep] || null;
  }

  function stepOnPhone() {
    return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 1100px)").matches;
  }

  function ensureStepLine() {
    let line = document.getElementById("sb-hub-line");
    if (line) return line;
    line = document.createElement("p");
    line.id = "sb-hub-line";
    const coach = document.getElementById("sb-hub-coach");
    const holder = (coach && coach.querySelector("div")) || coach || document.getElementById("sb-sysbanner");
    if (holder) holder.appendChild(line);
    return line;
  }

  function mountStepLine() {
    const line = ensureStepLine();
    const ban = document.getElementById("sb-sysbanner");
    const coach = document.getElementById("sb-hub-coach");
    if (!line || !ban || !coach) return line;
    if (stepOnPhone()) {
      if (!ban.contains(line)) {
        ban.textContent = "";
        ban.appendChild(line);
      }
    } else {
      const holder = coach.querySelector("div") || coach;
      if (!holder.contains(line)) holder.appendChild(line);
    }
    return line;
  }

  function writeBanner(text) {
    const line = mountStepLine();
    const ban = document.getElementById("sb-sysbanner");
    if (line && ban && ban.contains(line)) {
      line.textContent = text || "";
      return;
    }
    if (ban) ban.textContent = text || "";
  }

  function paintHubCoach(extra) {
    mountStepLine();
    const coach = document.getElementById("sb-hub-coach");
    const aiOn = window.LtHubAiOn !== false;
    if (coach) coach.classList.toggle("hub-muted", !aiOn);
    const sbT = document.getElementById("sb-hubai-toggle");
    if (sbT) sbT.textContent = aiOn ? "HUB AI · On" : "HUB AI · Off";
    if (!aiOn) {
      const title = document.getElementById("sb-hub-title");
      const line = document.getElementById("sb-hub-line");
      if (title) title.textContent = "Professor HUB · muted";
      if (line) line.textContent = "AI is off. Use HUB AI · On on the shop floor or here to bring me back. Free build still works.";
      return;
    }
    const title = document.getElementById("sb-hub-title");
    const line = document.getElementById("sb-hub-line");
    const hint = document.getElementById("sb-hint");
    const prog = document.getElementById("sb-progress");
    const gOn = document.getElementById("sb-guide-on");
    const gFree = document.getElementById("sb-guide-free");
    if (gOn) gOn.classList.toggle("active", guidedOn);
    if (gFree) gFree.classList.toggle("active", !guidedOn);
    if (!guidedOn) {
      if (title) title.textContent = "Professor HUB · free build";
      if (line) line.textContent = extra || "All boxes are out. Build it your way. I still want SH and SC when you start it.";
      writeBanner(extra || "Free build. Every box is live. Drop a part, then start the compressor.");
      if (hint) hint.textContent = "Free build: every drop box is live. HUB guided puts them back in install order.";
      if (prog) {
        const n = ["compressor", "condenser", "metering", "evaporator"].filter((s) => placed[s]).length;
        prog.textContent = "Free build · core " + n + " / 4" + (running ? " · running" : "");
      }
      return;
    }
    const step = currentBuildStep();
    if (!step) {
      if (title) title.textContent = "Professor HUB · system built";
      if (line) line.textContent = extra || "That's a real split. Start the compressor. Gauges on. SH and SC together. Don't top off a leaker.";
      const banDone = document.getElementById("sb-sysbanner");
      if (banDone) banDone.textContent = "System is built. Start the compressor. Read superheat and subcool together.";
      if (hint) hint.textContent = "Guided build complete. Start compressor. Or Free build to add extras (RV, solenoid, N₂…).";
      if (prog) prog.textContent = "HUB guided · " + BUILD_STEPS.length + " / " + BUILD_STEPS.length + " · evac & charge done · start it";
      return;
    }
    if (title) title.textContent = "Professor HUB · " + step.title;
    if (line) line.textContent = extra || step.hub;
    const ban = document.getElementById("sb-sysbanner");
    if (ban) ban.textContent = extra || (step.title + ". " + step.hub);
    if (hint) {
      if (step.slot === "vacpump" && (placed.vacpump || vac.pump || vac.gauge) && !stepSeated(step)) {
        hint.textContent =
          (vac.pump ? "" : "Drop the vacuum pump on the glowing box. ") +
          (vac.gauge ? "" : "Drop the micron gauge on its chip — that gauge reads microns, not the compound psi. ") +
          "Oil clear, gauge on the system, cores out, ballast shut, pump ON, then valve the pump off. The charge box lights when the decay holds. 0 in Hg is 0 psig, not microns.";
      } else {
        hint.textContent = "Drop " + step.title + " on the glowing box. Next box appears after this one seats.";
      }
    }
    if (prog) prog.textContent = "HUB guided · step " + (guidedStep + 1) + " / " + BUILD_STEPS.length;
    const wantTab = step.tab;
    document.querySelectorAll(".sb-tab[data-tab]").forEach((t) => {
      t.classList.toggle("active", t.getAttribute("data-tab") === wantTab);
    });
    if (wantTab && wantTab !== lastGuideTab) {
      lastGuideTab = wantTab;
      renderPalette(wantTab);
    } else {
      markWantedParts();
    }
  }

  function markWantedParts() {
    const step = guidedOn ? currentBuildStep() : null;
    document.querySelectorAll("#sb-items .sb-item, #sb-xtra .sb-item").forEach((el) => {
      const id = el.dataset.id;
      el.classList.toggle("hub-want", !!(step && step.accept && step.accept.indexOf(id) >= 0));
    });
  }

  function meteringKind() {
    const m = placed.metering;
    if (m === "piston" || m === "capillary") return "orifice";
    if (activeSystem && (activeSystem.metering === "orifice" || activeSystem.metering === "piston")) return "orifice";
    return "txv";
  }

  function simulate() {
    if (!requiredComplete()) {
      return {
        running: false,
        pHigh: 0,
        pLow: 0,
        tSatHigh: 0,
        tSatLow: 0,
        tLiquid: 0,
        tSuction: 0,
        sh: 0,
        sc: 0,
        status: "Place the four — compressor, condenser, metering, evaporator.",
        fp: "HUB: close the loop before you read gauges.",
      };
    }

    const kind = meteringKind();
    const ac = activeSystem ? activeSystem.approachCond : 18;
    const ae = activeSystem ? activeSystem.approachEvap : 35;
    const tgtSH = kind === "orifice" ? 12 : (typeof txvTarget === "number" ? txvTarget : 10);
    const tgtSC = activeSystem ? activeSystem.targetSC : 10;

    let effectiveMode = hpMode;
    if (fault === "rv_stuck_heat") effectiveMode = "heat";
    if (fault === "rv_stuck_cool") effectiveMode = "cool";
    const inDefrost = !!(defrosting || fault === "stuck_defrost" || hpMode === "defrost");
    if (inDefrost) effectiveMode = "cool";

    let condSat;
    let evapSat;
    if (effectiveMode === "heat") {
      condSat = indoorF + ac;
      evapSat = outdoorF - Math.min(ae, Math.max(8, outdoorF + 20));
    } else {
      condSat = outdoorF + ac;
      evapSat = indoorF - ae;
    }

    let sh = tgtSH;
    let sc = tgtSC;
    let chargeFactor = chargePct / 100;
    let glass = "Clear";
    let deltaT = 18;
    let extraAmps = 1;
    let status = "";
    let fp = "";
    let trip = null;

    const condAir = (coilCond === "dirty" ? 40 : 100) * (labFanCond / 100);
    const evapAir = (coilEvap === "dirty" ? 40 : 100) * (labFanEvap / 100);
    if (condAir < 90 && fault !== "dirty_cond" && fault !== "od_fan") {
      condSat += (90 - condAir) * 0.35;
      extraAmps += (90 - condAir) * 0.008;
      deltaT = Math.min(deltaT, 14);
    }
    if (evapAir < 90 && fault !== "dirty_evap" && fault !== "blower_fail") {
      evapSat -= (90 - evapAir) * 0.28;
      sh = Math.max(0, sh - (90 - evapAir) * 0.28);
      sc += (90 - evapAir) * 0.02;
      deltaT = Math.max(5, 18 - (90 - evapAir) * 0.16);
    }

    if (fault !== "undercharge" && fault !== "overcharge") {
      if (chargeFactor < 0.95) {
        const d = 1 - chargeFactor;
        evapSat -= d * 22;
        condSat -= d * 20;
        sh += d * 28;
        sc = Math.max(1, sc - d * 18);
        if (chargeFactor < 0.85) glass = "Bubbles / flashing — starved";
      } else if (chargeFactor > 1.05) {
        const d = chargeFactor - 1;
        evapSat += d * 8;
        condSat += d * 22;
        sh = Math.max(2, sh - d * 16);
        sc += d * 28;
        extraAmps += d * 0.8;
      }
    }

    if (frost > 55 && effectiveMode === "heat" && !inDefrost) {
      evapSat -= Math.min(18, (frost - 55) * 0.4);
      sh += 6;
    }

    switch (fault) {
      case "undercharge":
        evapSat -= 14;
        condSat -= 22;
        sh = 28;
        sc = 2;
        glass = "Bubbles / flashing — starved";
        deltaT = 11;
        extraAmps *= 0.75;
        status = "Low side AND high side down. High SH, almost no SC. That's a leak — recover, repair, weigh-in. Don't top off.";
        fp = "HUB: LOW/LOW + high SH + low SC = undercharge. Find the leak.";
        break;
      case "overcharge":
        evapSat += 4;
        condSat += 20;
        if (kind === "orifice") {
          sh = 3;
          sc = 22;
          extraAmps += 0.32;
          status = "Piston flooded. Low SH, high SC, high head. Recover to nameplate before you slug the compressor.";
          fp = "HUB: fixed orifice + overcharge = liquid in the suction. TXV would have held SH.";
        } else {
          sh = Math.max(4, tgtSH - 4);
          sc = 20;
          extraAmps += 0.28;
          status = "High head, high SC. TXV still holds SH. Recover to the nameplate — don't keep adding.";
          fp = "HUB: HIGH SC is overcharge. SH will lie to you on a TXV.";
        }
        glass = "Solid — stacked liquid";
        deltaT = 16;
        break;
      case "dirty_cond":
        condSat += 20;
        sc = tgtSC;
        sh = tgtSH;
        extraAmps += 0.35;
        glass = "Clear";
        deltaT = 14;
        status = "High head, subcooling about normal. Dirty outdoor coil. Wash it. Not an overcharge — don't add gas.";
        fp = "HUB: high head + SC in band = condenser airflow. Overcharge would be HIGH SC.";
        break;
      case "od_fan":
        condSat += 38;
        sc = 2;
        sh = tgtSH + 6;
        extraAmps += 0.55;
        glass = "Clear";
        deltaT = 12;
        status = "OD fan dead. Head climbing. HPC will cut you out if you let it. A dirty coil keeps SC about normal — this fan isn't moving air. Don't add gas.";
        fp = "HUB: condenser fan. Amp the fan motor, not the cylinder. Dirty coil ≠ low SC.";
        break;
      case "dirty_evap":
        evapSat -= 12;
        sh = 0;
        sc = 13;
        deltaT = 24;
        glass = "Clear";
        extraAmps *= 0.9;
        status = "Low suction, superheat collapsed toward 0, A-coil icing. Filter / indoor coil / blower. Don't add gas.";
        fp = "HUB: SH toward 0 = starved for AIR, not gas. Don't add refrigerant.";
        break;
      case "blower_fail":
        evapSat -= 18;
        sh = 0;
        sc = 14;
        deltaT = 2;
        glass = "Clear";
        extraAmps *= 0.85;
        status = "Indoor blower dead. No supply air. Suction in the basement, SH at 0, coil a brick of ice. LPC next. Don't add gas.";
        fp = "HUB: no indoor airflow. SH collapsed. Amp the blower. Don't charge an iced coil.";
        break;
      case "restricted":
        evapSat -= 16;
        condSat -= 6;
        sh = 30;
        sc = 22;
        glass = "Flashing after the drier";
        deltaT = 9;
        extraAmps *= 0.85;
        status = "Low suction, high SH, high SC. Liquid-line restriction (drier / kink). Outlet of the drier is colder than the inlet. Don't add gas.";
        fp = "HUB: HIGH SH + HIGH SC = restriction. Cold drier outlet. Don't add gas.";
        break;
      case "noncondensables":
        condSat += 24;
        sc = Math.max(20, tgtSC + 10);
        sh = tgtSH;
        extraAmps += 0.22;
        glass = "Clear / haze";
        status = "High head, HIGH subcooling. Air in the condenser looks like an overcharge. The discharge line is hotter than the outdoor temperature explains. Recover, evacuate, weigh it back. Do not just pull a little gas.";
        fp = "HUB: high head + HIGH SC after a sloppy vacuum can be air, not a simple overcharge. The gauge reads total pressure. Recover and evacuate. You cannot bleed air off a running 410A system.";
        break;
      case "txv_closed":
        evapSat -= 20;
        condSat -= 10;
        sh = 38;
        sc = 18;
        glass = "Bubbles possible";
        deltaT = 8;
        extraAmps *= 0.8;
        status = "Starved coil. TXV stuck closed or bulb lost charge. High SH, high SC, suction in the basement.";
        fp = "HUB: bulb at 4 or 8 o'clock on a horizontal suction line, tight and insulated. Not 12. Not 6. Lost bulb charge acts like a closed valve.";
        break;
      case "txv_open":
        evapSat += 10;
        condSat -= 6;
        sh = 2;
        sc = 5;
        glass = "Clear";
        deltaT = 14;
        status = "Flooding. TXV stuck open. SH near 0. Slugging risk — accumulator earning its keep.";
        fp = "HUB: SH near 0. Kill it before you wash the compressor.";
        break;
      case "rv_bleed":
        evapSat += 14;
        condSat -= 16;
        sh = 5;
        sc = 4;
        extraAmps += 0.12;
        deltaT = 10;
        status = "Pressures walking toward each other. 4-way bleeding internally. Low capacity, suction warm.";
        fp = "HUB: discharge and suction closer than they should be. Replace the reversing valve.";
        break;
      case "weak_comp":
        evapSat += 16;
        condSat -= 22;
        sh = 18;
        sc = 4;
        extraAmps *= 0.7;
        deltaT = 10;
        status = "High suction, low head. Weak valves / inefficient compressor. Capacity is gone.";
        fp = "HUB: gauges look like the opposite of a restriction. Amp draw is low. That's the pump, not the charge.";
        break;
      case "defrost_fail":
        evapSat -= 16;
        sh = 22;
        sc = 6;
        deltaT = 8;
        extraAmps *= 0.8;
        if (frost < 70) frost = 78;
        status = "Heat call, outdoor coil a glacier. Defrost never ran. Sensor/board — not charge. House is cold.";
        fp = "HUB: force defrost. If the fan doesn't stop and the RV doesn't shift, it's defrost control.";
        break;
      case "stuck_defrost":
        condSat = outdoorF + ac + 28;
        extraAmps += 0.2;
        sh = 8;
        sc = 4;
        deltaT = 12;
        status = "DEFROST stuck ON: RV in cool, OD fan OFF, outdoor coil steaming. Indoor blowing COOL in winter. Aux screaming.";
        fp = "HUB: Defrost is COOL with the outdoor fan off. If it never ends, coil sensor / board.";
        break;
      case "rv_stuck_heat":
        status = hpMode === "cool"
          ? "Calling COOL but the 4-way is stuck in HEAT. Indoor coil is the condenser. House gets hotter."
          : "4-way is in heat — matches the heat call.";
        fp = "HUB: 24V on O/B? Click? If the solenoid is energized and the slider didn't move, it's the valve.";
        break;
      case "rv_stuck_cool":
        status = hpMode === "heat"
          ? "Calling HEAT but the 4-way is stuck in COOL. You're refrigerating the house."
          : "4-way is in cool — matches the cool call.";
        fp = "HUB: 24V on O/B? Click? If the solenoid is energized and the slider didn't move, it's the valve.";
        break;
      default:
        break;
    }

    if (fault === "none" && (coilEvap === "dirty" || evapAir < 55) && sh <= 3) {
      status = "Superheat collapsed toward 0. Indoor coil, filter, or blower. Don't add gas.";
      fp = "HUB: SH toward 0 = low airflow, not a low charge. Don't add refrigerant.";
    } else if (fault === "none" && (coilCond === "dirty" || condAir < 55)) {
      status = "High head, subcooling about normal. Dirty condenser or slow outdoor fan. Not an overcharge — don't add gas.";
      fp = "HUB: high head + SC about normal = condenser airflow. Overcharge is HIGH SC.";
    }
    if (capBad && fault === "none") {
      extraAmps *= 1.35;
      status = "Hum / hard start. Pressures can look almost honest. Meter the cap µF before you add gas.";
      fp = "HUB: pressures aren't the complaint. Discharge the cap. HERM–C vs nameplate.";
    }

    const iceEvap = running && (fault === "dirty_evap" || fault === "blower_fail" || coilEvap === "dirty");
    const iceOd = (fault === "defrost_fail") || (frost > 50 && effectiveMode === "heat" && !inDefrost);
    const odFanOn = running && fault !== "od_fan" && !inDefrost;
    const idFanOn = fault !== "blower_fail";
    const drierDrop = fault === "restricted" ? 32 : 0;
    const slugRisk = fault === "txv_open" || (kind === "orifice" && fault === "overcharge");
    let supplyF = null;
    if (idFanOn) {
      if (fault === "rv_stuck_heat" && hpMode === "cool") supplyF = indoorF + 30;
      else if (fault === "rv_stuck_cool" && hpMode === "heat") supplyF = indoorF - 18;
      else if (inDefrost) supplyF = indoorF - 10;
      else if (effectiveMode === "heat") supplyF = indoorF + Math.max(12, 32 - frost * 0.2);
      else supplyF = indoorF - deltaT;
    }

    const pHigh = satP(refrigerant, condSat);
    const pLow = Math.max(0, satP(refrigerant, evapSat));
    const tSatHigh = satT(refrigerant, pHigh);
    const tSatLow = satT(refrigerant, pLow);
    sh = Math.max(0, sh);
    sc = Math.max(0, sc);
    const tLiquid = tSatHigh - sc;
    const tSuction = tSatLow + sh;

    const hpc = HPC_TRIP[refrigerant] || 610;
    const lpc = LPC_TRIP[refrigerant] || 50;
    if (running && pHigh >= hpc) {
      trip = "hpc";
      status = "HPC OPEN — head hit " + Math.round(pHigh) + " psig. Compressor cut out. Coil, fan, overcharge, or non-condensables. Don't reset until you know which.";
      fp = "HUB: high-pressure switch did its job. Fix the head, then reset.";
    } else if (running && effectiveMode === "cool" && pLow > 0 && pLow <= lpc && (fault === "blower_fail" || fault === "txv_closed" || fault === "restricted" || fault === "undercharge")) {
      trip = "lpc";
      status = "LPC OPEN — suction " + Math.round(pLow) + " psig. Frozen coil, restriction, or a real leak. Don't add gas until you know which.";
      fp = "HUB: low-pressure switch. Prove airflow and restriction before you charge.";
    }

    const staticPsig = Math.max(0, satP(refrigerant, outdoorF));
    if (!running) {
      if (cutOut) {
        return Object.assign({}, cutOut, {
          running: false,
          static: false,
          tons: 0,
          btuh: 0,
          amps: 0,
          odFanOn: false,
          iceEvap: !!cutOut.iceEvap,
          iceOd: !!cutOut.iceOd,
        });
      }
      return {
        running: false,
        static: true,
        pHigh: staticPsig,
        pLow: staticPsig,
        tSatHigh: satT(refrigerant, staticPsig),
        tSatLow: satT(refrigerant, staticPsig),
        tLiquid: outdoorF,
        tSuction: outdoorF,
        sh: 0,
        sc: 0,
        status: "Static " + Math.round(staticPsig) + " psig both sides · " + refrigerant + " sitting at " + outdoorF + "°F outdoor. Start compressor.",
        fp: "HUB: equalized is normal off. Start it, then read SH and SC together.",
        condSat: outdoorF,
        evapSat: outdoorF,
        tons: 0,
        btuh: 0,
        cop: 0,
        amps: 0,
        tgtSH,
        tgtSC,
        shOk: false,
        scOk: false,
        deltaT: 0,
        glass: "Off",
        frost,
        defrosting: inDefrost,
        hpMode: effectiveMode,
        iceEvap: false,
        iceOd: frost > 50,
        odFanOn: false,
        idFanOn: false,
        supplyF: null,
        drierDrop: 0,
        slugRisk: false,
      };
    }

    if (!status) {
      if (activeSystem && fault === "none" && chargeFactor >= 0.9 && chargeFactor <= 1.1 && coilCond === "clean" && coilEvap === "clean") {
        status = activeSystem.brand + " " + activeSystem.name + " · healthy";
      } else {
        status = "Cycle running · SH " + Math.round(sh) + " / SC " + Math.round(sc);
      }
    }
    if (!fp) {
      if (Math.abs(sh - tgtSH) <= 4 && Math.abs(sc - tgtSC) <= 4 && coilCond === "clean" && coilEvap === "clean" && fault === "none") {
        fp = "HUB: SH/SC in band. That's a charged, breathing system.";
      } else {
        fp = "HUB: SH and SC together. Don't chase one number.";
      }
    }

    const tonsBase = activeSystem ? activeSystem.tons : 3;
    const load = Math.max(0.35, Math.min(1.25, ((indoorF - 65) / 15) * ((115 - outdoorF) / 40 + 0.55)));
    const derate = Math.max(0.35, 1 - Math.max(0, condSat - (outdoorF + 18)) / 80 - Math.max(0, (indoorF - 35) - evapSat) / 80);
    let tons = +(tonsBase * load * derate * (0.7 + 0.3 * Math.min(1, chargeFactor))).toFixed(2);
    if (fault === "weak_comp" || fault === "rv_bleed") tons = +(tons * 0.45).toFixed(2);
    if (fault === "undercharge") tons = +(tons * 0.55).toFixed(2);
    if (fault === "restricted" || fault === "txv_closed") tons = +(tons * 0.4).toFixed(2);
    if (fault === "dirty_evap") tons = +(tons * 0.65).toFixed(2);
    if (fault === "blower_fail") tons = +(tons * 0.15).toFixed(2);
    if (fault === "od_fan" || fault === "dirty_cond") tons = +(tons * 0.7).toFixed(2);
    if (fault === "defrost_fail") tons = +(tons * 0.25).toFixed(2);
    if (fault === "rv_stuck_heat" && hpMode === "cool") tons = 0;
    if (trip) tons = 0;
    const btuh = Math.round(tons * 12000);
    const tC = condSat + 460;
    const tE = evapSat + 460;
    const copCarnot = tE / Math.max(1, tC - tE);
    const cop = Math.max(1.2, copCarnot * 0.42);
    const kw = tons > 0 ? (btuh / 12000) * 3.517 / cop : 0;
    let amps = kw / (240 * 0.85) * 1000 * extraAmps;
    if (capBad) amps *= 1.4;
    if (trip) amps = 0;

    const shOk = !trip && Math.abs(sh - tgtSH) <= 4;
    const scOk = !trip && Math.abs(sc - tgtSC) <= 4;

    return {
      running: !trip,
      trip,
      static: false,
      pHigh,
      pLow,
      tSatHigh,
      tSatLow,
      tLiquid,
      tSuction,
      sh,
      sc,
      status,
      condSat,
      evapSat,
      tons,
      btuh,
      cop,
      amps,
      tgtSH,
      tgtSC,
      shOk,
      scOk,
      deltaT,
      glass,
      fp,
      frost,
      defrosting: inDefrost,
      hpMode: effectiveMode,
      iceEvap,
      iceOd,
      odFanOn,
      idFanOn,
      supplyF,
      drierDrop,
      slugRisk,
    };
  }

  function injectSandboxPolish() {
    if (document.getElementById("sb-polish")) return;
    const st = document.createElement("style");
    st.id = "sb-polish";
    st.textContent = [
      "#sandbox-root .sb-main{display:flex!important;flex-direction:column!important;min-height:0!important;overflow:hidden!important}",
      "#sandbox-root .sb-stage-wrap{flex:1 1 auto!important;min-height:0!important}",
      "#sandbox-root .sb-rail{display:flex!important;flex:0 0 auto!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:6px!important;overflow-x:auto!important;overflow-y:hidden!important;min-height:74px!important;max-height:96px!important;padding:6px 8px!important;background:#10161c!important;border-top:1px solid #2a3644!important;position:relative!important;z-index:8!important}",
      "#sandbox-root #sb-rail .sb-slot{position:relative!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;transform:none!important;flex:0 0 96px!important;width:96px!important;min-height:60px!important;max-height:80px!important;pointer-events:auto!important}",
      "#sandbox-root .sb-palette{display:flex!important;flex-direction:column!important;min-height:0!important;overflow:hidden!important}",
      "#sandbox-root .sb-palette .brand-bar,#sandbox-root .sb-palette .sb-tabs,#sandbox-root .sb-palette .sb-guide-bar,#sandbox-root .sb-palette .sb-build-progress{flex:0 0 auto!important}",
      "#sandbox-root .sb-tabs{flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;max-height:42px!important}",
      "#sandbox-root .sb-tab{flex:0 0 auto!important;min-width:64px!important;white-space:nowrap!important}",
      "#sandbox-root .sb-guide-bar{display:flex!important;flex-wrap:wrap!important;gap:4px!important}",
      "#sandbox-root .sb-guide-bar .btn{flex:1 1 30%!important;min-height:34px!important;padding:4px 6px!important}",
      "#sandbox-root #sb-items{flex:1 1 52%!important;min-height:300px!important;overflow-x:hidden!important;overflow-y:auto!important;position:relative!important}",
      "#sandbox-root .sb-xtra-wrap{flex:1 1 34%!important;min-height:112px!important;max-height:42%!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;border-top:1px solid #2a3644!important;margin-top:6px!important;position:relative!important;z-index:1!important}",
      "#sandbox-root .sb-xtra-wrap[hidden]{display:none!important}",
      "#sandbox-root .sb-xtra-label{flex:0 0 auto!important;margin:6px 0 4px!important}",
      "#sandbox-root #sb-xtra{flex:1 1 auto!important;min-height:0!important;overflow-x:hidden!important;overflow-y:auto!important;position:relative!important}",
      "#sandbox-root .sb-item{position:relative!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;transform:none!important;width:auto!important;max-width:100%!important;flex:0 0 auto!important;z-index:auto!important}",
      "#sandbox-root .sb-hint,#sandbox-root .sb-hub-coach{flex:0 1 auto!important;max-height:84px!important;overflow:auto!important}",
      "@media (max-width:700px){#sandbox-root #sb-sysbanner{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important;max-height:2.8em!important}}",
      "#sandbox-root #sb-sysbanner{display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important;max-height:2.8em!important;flex:0 0 auto!important;line-height:1.35!important;color:#f7f3ea!important;background:#10161c!important}",
      "#sandbox-root #sb-hub-line{display:block!important;visibility:visible!important;margin:0!important;white-space:normal!important;overflow:visible!important;height:auto!important;max-height:none!important;color:#f7f3ea!important;font-size:14px!important;line-height:1.35!important;font-style:normal!important}",
      "#sandbox-root .sb-stage-wrap{overflow:hidden!important;min-height:220px!important}",
      "#sandbox-root .sb-slots{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:8px!important;inset:8px!important;position:absolute!important}",
      "#sandbox-root .sb-slot:not(.sb-rail-slot){position:relative!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;transform:none!important;width:auto!important;max-width:none!important;height:100%!important;max-height:none!important;min-height:0!important;overflow:hidden!important;padding:4px!important}",
      "#sandbox-root .sb-slot.core:not(.sb-rail-slot){width:auto!important;max-height:none!important}",
      "#sandbox-root .sb-slot:not(.sb-rail-slot) .part-img,#sandbox-root .sb-slot:not(.sb-rail-slot) img{width:36px!important;height:36px!important;object-fit:contain!important}",
      "#sandbox-root .sb-dispatch{position:relative!important;z-index:6!important;flex:0 0 auto!important;max-height:22dvh!important;overflow:auto!important;background:#10161c!important;color:#f7f3ea!important;border-top:2px solid #CE0034!important}",
      "#sandbox-root .sb-dispatch-top{display:flex!important;flex-wrap:wrap!important;gap:6px!important;align-items:center!important;padding:6px 8px!important}",
      "#sandbox-root .sb-dispatch-choices{display:flex!important;flex-wrap:wrap!important;gap:6px!important;padding:0 8px 8px!important}",
      "#sandbox-root .sb-float-win{display:none!important}",
      "#sandbox-root .sb-float-win.is-open{display:flex!important;position:fixed!important;z-index:80!important;top:64px!important;right:12px!important;bottom:auto!important;left:auto!important;width:min(340px,92vw)!important;max-height:min(70dvh,560px)!important}",
      "#sandbox-root .sb-float-win.is-open.is-moved{left:var(--sb-fx)!important;top:var(--sb-fy)!important;right:auto!important;bottom:auto!important}",
      "@media (min-width:801px){#sandbox-root .sb-layout{display:grid!important;grid-template-columns:minmax(180px,220px) minmax(0,1fr) minmax(220px,280px)!important;grid-template-rows:minmax(0,1fr)!important;height:100%!important;max-height:100%!important}#sandbox-root .sb-palette{position:relative!important;transform:none!important;inset:auto!important;width:auto!important;height:100%!important;max-height:none!important;grid-column:1!important;grid-row:1!important;overflow:auto!important;border-radius:0!important;border-right:1px solid #2a3644!important}#sandbox-root .sb-palette .brand-bar,#sandbox-root .sb-palette .sb-hint,#sandbox-root .sb-palette .eyebrow,#sandbox-root .sb-palette .sb-build-progress{display:block!important}#sandbox-root .sb-palette .sb-guide-bar,#sandbox-root .sb-palette .sb-hub-coach{display:flex!important}#sandbox-root .sb-main{grid-column:2!important;grid-row:1!important;min-width:0!important;min-height:0!important}#sandbox-root aside.sb-gauges{position:relative!important;transform:none!important;inset:auto!important;display:flex!important;flex-direction:column!important;grid-column:3!important;grid-row:1!important;width:auto!important;height:100%!important;max-height:none!important;min-height:0!important;overflow:hidden!important;border-radius:0!important;z-index:2!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important}#sandbox-root .sb-gauges-scroll{overflow:auto!important;flex:1 1 auto!important;min-height:0!important}}",
      "@media (max-width:800px){#sandbox-root .sb-layout{display:flex!important;flex-direction:column!important;grid-template-columns:none!important;height:100%!important;max-height:100dvh!important}#sandbox-root .sb-palette{position:relative!important;transform:none!important;inset:auto!important;order:3!important;width:100%!important;height:auto!important;max-height:128px!important;min-height:96px!important;flex:0 0 auto!important;z-index:5!important;border-right:none!important;border-top:2px solid #CE0034!important;border-radius:0!important;overflow:hidden!important;padding:6px!important}#sandbox-root .sb-main{order:1!important;flex:1 1 auto!important;min-width:0!important;min-height:0!important;width:100%!important}#sandbox-root #sb-items{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;min-height:0!important;gap:8px!important;flex:1 1 auto!important}#sandbox-root .sb-item{flex:0 0 96px!important;width:96px!important;min-width:96px!important}#sandbox-root .sb-xtra-wrap{display:none!important}#sandbox-root aside.sb-gauges.sb-gauge-win{position:fixed!important;display:none!important;width:auto!important;height:min(50dvh,420px)!important;max-height:50dvh!important;overflow:hidden!important;z-index:90!important;border-radius:14px!important}#sandbox-root aside.sb-gauges.sb-gauge-win.drawer-open{display:flex!important;flex-direction:column!important;left:8px!important;right:8px!important;bottom:8px!important;top:auto!important;transform:none!important}#sandbox-root .sb-float-win.is-open{top:auto!important;bottom:8px!important;left:8px!important;right:8px!important;width:auto!important;max-height:46dvh!important}body.lt-dragging-part #sandbox-root .sb-palette{pointer-events:none!important}}",
    ].join("\n");
    document.head.appendChild(st);
  }

  function buildUI(root) {
    injectSandboxPolish();
    root.innerHTML = `
      <div class="sb-layout">
        <aside class="sb-palette" id="sb-palette">
          <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
            <div class="brand-mark" style="width:28px;height:28px;font-size:13px">${(window.LtBrand && window.LtBrand.mark) || "LT"}</div>
            <div class="brand-word">
              <strong style="font-size:13px">${((window.LtBrand && window.LtBrand.org) || "HVAC Legends").toUpperCase()}</strong>
              <span>System sandbox · four-part refrigeration cycle</span>
            </div>
          </div>
          <p class="eyebrow">Component tray</p>
          <div class="sb-build-progress" id="sb-progress">HUB guided · step 1 / 12</div>
          <div class="sb-guide-bar">
            <button type="button" class="btn primary" id="sb-guide-on">HUB guided</button>
            <button type="button" class="btn" id="sb-guide-free">Free build</button>
            <button type="button" class="btn" id="sb-hubai-toggle">HUB AI · On</button>
          </div>
          <div class="sb-tabs">
            <button class="sb-tab active" data-tab="parts">Cycle</button>
            <button class="sb-tab" data-tab="electrical">Electrical</button>
            <button class="sb-tab" data-tab="tools">Tools</button>
            <button class="sb-tab" data-tab="materials">Materials</button>
            <button class="sb-tab" data-tab="all">All parts</button>
            <button class="sb-tab" data-tab="challenges">CoolGame</button>
            <button class="sb-tab" data-tab="race">Class race</button>
            <button class="sb-tab" data-tab="field">Field jobs</button>
            <button class="sb-tab" data-tab="systems">OEM packs</button>
            <button class="sb-tab" data-tab="lab">Lab trainers</button>
          </div>
          <div id="sb-items" class="sb-items"></div>
          <div id="sb-xtra-wrap" class="sb-xtra-wrap">
            <p class="eyebrow sb-xtra-label">More parts · scroll</p>
            <div id="sb-xtra" class="sb-items sb-xtra"></div>
          </div>
          <p class="sb-hint" id="sb-hint">HUB guided: one drop box at a time, real install order. Follow the glowing box.</p>
          <div class="hub-chip sb-hub-coach" id="sb-hub-coach" style="margin:10px 0 0;max-width:none">
            <img src="hub-portrait.jpg?v=3" alt="Professor HUB" class="hub-chip-av photo" />
            <div>
              <strong id="sb-hub-title">Professor HUB · 1 · Compressor</strong>
              <p id="sb-hub-line">Heart of the DX loop. Drag the scroll compressor onto the glowing box.</p>
            </div>
          </div>
        </aside>
        <main class="sb-main">
          <header class="sb-toolbar">
            <div class="sb-controls">
              <label>Refrigerant
                <select id="sb-ref">
                  <option>R-410A</option>
                  <option>R-32</option>
                  <option>R-22</option>
                  <option>R-134a</option>
                </select>
              </label>
              <label>Outdoor °F
                <input id="sb-out" type="range" min="20" max="115" value="95" />
                <span id="sb-out-v">95</span>
              </label>
              <label>Indoor °F
                <input id="sb-in" type="range" min="65" max="85" value="75" />
                <span id="sb-in-v">75</span>
              </label>
              <label>Charge %
                <input id="sb-charge" type="range" min="50" max="130" value="100" />
                <span id="sb-charge-v">100</span>
              </label>
              <label>Mode
                <select id="sb-mode">
                  <option value="cool">Cool</option>
                  <option value="heat">Heat (HP)</option>
                  <option value="defrost">Defrost (force)</option>
                </select>
              </label>
              <label>Fault
                <select id="sb-fault">
                  <option value="none">None (healthy)</option>
                  <option value="undercharge">Undercharge / leak</option>
                  <option value="overcharge">Overcharge</option>
                  <option value="dirty_cond">Dirty condenser</option>
                  <option value="od_fan">OD fan dead</option>
                  <option value="dirty_evap">Dirty evaporator</option>
                  <option value="blower_fail">Indoor blower dead</option>
                  <option value="restricted">Liquid-line restriction</option>
                  <option value="noncondensables">Non-condensables (air)</option>
                  <option value="txv_closed">TXV stuck closed / lost bulb</option>
                  <option value="txv_open">TXV stuck open</option>
                  <option value="weak_comp">Weak compressor valves</option>
                  <option value="rv_stuck_heat">RV stuck in heat</option>
                  <option value="rv_stuck_cool">RV stuck in cool</option>
                  <option value="rv_bleed">RV internal bleed</option>
                  <option value="defrost_fail">Defrost never starts</option>
                  <option value="stuck_defrost">Stuck in defrost</option>
                </select>
              </label>
              <label>TXV SH target
                <input id="sb-txv" type="range" min="6" max="18" value="12" />
                <span id="sb-txv-v">12</span>
              </label>
            </div>
            <div class="sb-actions">
              <span id="sb-clock" class="sb-clock"></span>
              <div class="lab-drawers" role="toolbar" aria-label="Phone trays">
                <button type="button" class="btn lab-drawer-btn" id="sb-parts-toggle" aria-expanded="false" aria-controls="sb-palette">Parts</button>
                <button type="button" class="btn lab-drawer-btn" id="sb-gauges-toggle" aria-expanded="false" aria-controls="sb-gauges-panel">Gauges</button>
              </div>
              <button type="button" class="btn" id="sb-fs">Full screen</button>
              <button class="btn primary" id="sb-run">Start compressor</button>
              <button class="btn" id="sb-sound" type="button">Sound on</button>
              <button class="btn" id="sb-3d" type="button">3D WebGL</button>
              <button class="btn" id="sb-cutaway" type="button">See inside</button>
              <button class="btn hidden" id="sb-flat" type="button">GLSL: smooth</button>
              <button class="btn" id="sb-clear">Clear board</button>
              <button class="btn" id="sb-healthy">Healthy example</button>
              <button class="btn" id="sb-charge-open">Charging SOP</button>
              <button class="btn" id="sb-hub">Shop floor</button>
            </div>
          </header>
          <div id="sb-sysbanner" class="sb-sysbanner">The four: compressor → condenser → metering → evaporator. Drop them on the cycle.</div>
          <div class="sb-cycle-legend" id="sb-cycle-legend">
            <span class="hot">Discharge vapor</span>
            <span class="liq">Liquid</span>
            <span class="mix">Expansion</span>
            <span class="suc">Suction vapor</span>
          </div>
          <div class="lab-howto" id="sb-howto">
            <img src="hub-portrait.jpg?v=3" alt="" />
            <div>
              <strong>The four on the glass</strong>
              <p>Compressor · condenser · metering · evaporator. Drop them, Start compressor, read SH/SC on the strip.</p>
              <button type="button" class="btn primary" id="sb-howto-go">Got it</button>
            </div>
          </div>
          <div class="sb-stage-wrap">
            <canvas id="sb-canvas"></canvas>
            <canvas id="sb-gl" class="sb-gl hidden"></canvas>
            <div id="sb-slots" class="sb-slots"></div>
            <div id="sb-labboard" class="sb-labboard hidden"></div>
            <div id="sb-charge-win" class="sb-float-win collapsed">
              <div class="sb-float-head" id="sb-charge-drag">
                <span id="sb-charge-title">OEM charging SOP</span>
                <button type="button" id="sb-charge-min" title="Collapse">–</button>
              </div>
              <div class="sb-float-body" id="sb-charge-body"></div>
            </div>
          </div>
          <div class="sb-rail" id="sb-rail" aria-label="More parts"></div>
          <div class="sb-phone-vitals" id="sb-phone-vitals" aria-label="Live system">
            <span>L <b id="pv-l">—</b></span>
            <span>H <b id="pv-h">—</b></span>
            <span>SH <b id="pv-sh">—</b></span>
            <span>SC <b id="pv-sc">—</b></span>
            <span>SUP <b id="pv-sup">—</b></span>
            <canvas id="sb-trend" class="sb-trend" width="120" height="28" aria-label="Pressure trend"></canvas>
          </div>
        </main>
        <aside class="sb-gauges sb-gauge-win" id="sb-gauges-panel">
          <div class="sb-gauges-head" id="sb-gauges-drag">
            <p class="eyebrow">Manifold · drag this bar</p>
            <button type="button" class="btn" id="sb-gauges-close">Close</button>
          </div>
          <div class="sb-gauges-scroll" id="sb-gauges-scroll">
          <div id="sb-sysinfo" class="sb-sysinfo"></div>
          <div class="mf-set" id="mf-set">
            <canvas id="mf-canvas" width="560" height="300" aria-label="Analog manifold gauge set"></canvas>
            <div class="mf-valves">
              <button type="button" class="btn" id="mf-lo-v">Low valve CLOSED</button>
              <span class="mf-yel">YEL</span>
              <button type="button" class="btn" id="mf-hi-v">High valve CLOSED</button>
            </div>
            <p class="mf-read" id="mf-read">Blue suction · red liquid · yellow vac/charge. Valves CLOSED to read.</p>
          </div>
          <div class="gauge-pair">
            <div class="gauge blue">
              <span class="g-label">Low side</span>
              <span class="g-val" id="g-plow">—</span>
              <span class="g-unit">psig</span>
              <span class="g-sub" id="g-tsatl">sat — °F</span>
            </div>
            <div class="gauge red">
              <span class="g-label">High side</span>
              <span class="g-val" id="g-phigh">—</span>
              <span class="g-unit">psig</span>
              <span class="g-sub" id="g-tsath">sat — °F</span>
            </div>
          </div>
          <canvas id="sb-trend-desk" class="sb-trend sb-trend-desk" width="280" height="36" aria-label="High / low trend"></canvas>
          <p class="sb-trend-cap" id="sb-trend-cap">Trend runs in the background. Watch the spread — walking together is a bleeding 4-way.</p>
          <div class="pt-chart" id="sb-pt">
            <p class="eyebrow">P/T chart · HVAC Buddy style</p>
            <p class="pt-live" id="pt-live">Pick refrigerant. Slide pressure or sat temp. Training chart — OEM still wins.</p>
            <label>Pressure
              <input id="pt-psig" type="range" min="0" max="600" value="118" />
              <span id="pt-psig-v">118 psig</span>
            </label>
            <p class="pt-sat" id="pt-sat">sat — °F</p>
            <label>Saturation temp
              <input id="pt-tf" type="range" min="-40" max="120" value="40" />
              <span id="pt-tf-v">40°F</span>
            </label>
            <div id="pt-table" class="pt-table"></div>
            <p class="pt-note">Blends: SH = suction line T − evap dew. SC = start of boiling − liquid line T. A pure refrigerant has one boiling temperature. Don’t charge from this table alone.</p>
          </div>
          <div class="readouts">
            <div><span>Suction temp</span><b id="g-tsuc">—</b></div>
            <div><span>Liquid temp</span><b id="g-tliq">—</b></div>
            <div><span>Superheat</span><b id="g-sh">—</b></div>
            <div><span>Subcooling</span><b id="g-sc">—</b></div>
            <div><span>Target SH / SC</span><b id="g-tgt">—</b></div>
            <div><span>Delta T (split)</span><b id="g-dt">—</b></div>
            <div><span>Sight glass</span><b id="g-glass">—</b></div>
            <div><span>Capacity</span><b id="g-cap">—</b></div>
            <div><span>COP</span><b id="g-cop">—</b></div>
            <div><span>Comp amps</span><b id="g-amps">—</b></div>
          </div>
          <p class="sb-fp" id="sb-fp">HUB: close the loop, start the compressor, then read SH and SC together.</p>
          <p class="eyebrow">Defrost control circuit</p>
          <div id="sb-defrost-d" class="sb-defrost-d">
            <svg viewBox="0 0 340 230" xmlns="http://www.w3.org/2000/svg" aria-label="Heat pump defrost control diagram">
              <text x="8" y="16" fill="#8b98a5" font-size="11">24VAC control · heat pump ODU</text>
              <g id="df-r" class="df-node">
                <rect x="8" y="28" width="70" height="52" rx="6"/>
                <text x="43" y="48" text-anchor="middle" font-size="10">R / C</text>
                <text x="43" y="64" text-anchor="middle" font-size="9">24V xfmr</text>
              </g>
              <g id="df-stat" class="df-node">
                <rect x="98" y="28" width="78" height="52" rx="6"/>
                <text x="137" y="46" text-anchor="middle" font-size="10">T-stat</text>
                <text x="137" y="62" text-anchor="middle" font-size="9">Y  W  O/B</text>
              </g>
              <g id="df-board" class="df-node">
                <rect x="198" y="22" width="134" height="64" rx="6"/>
                <text x="265" y="42" text-anchor="middle" font-size="10">DEFROST BOARD</text>
                <text id="df-board-mode" x="265" y="58" text-anchor="middle" font-size="9">HEAT</text>
                <text id="df-board-led" x="265" y="74" text-anchor="middle" font-size="9">LED off</text>
              </g>
              <line class="df-wire" x1="78" y1="54" x2="98" y2="54"/>
              <line class="df-wire" x1="176" y1="54" x2="198" y2="54"/>
              <g id="df-coil" class="df-node">
                <rect x="8" y="108" width="96" height="48" rx="6"/>
                <text x="56" y="126" text-anchor="middle" font-size="10">ODU coil sensor</text>
                <text x="56" y="142" text-anchor="middle" font-size="9">terminate ~50–70°F</text>
              </g>
              <g id="df-amb" class="df-node">
                <rect x="118" y="108" width="90" height="48" rx="6"/>
                <text x="163" y="126" text-anchor="middle" font-size="10">Outdoor air</text>
                <text x="163" y="142" text-anchor="middle" font-size="9">enable < ~40°F</text>
              </g>
              <g id="df-rv" class="df-node">
                <rect x="224" y="108" width="108" height="48" rx="6"/>
                <text x="278" y="126" text-anchor="middle" font-size="10">RV solenoid O/B</text>
                <text id="df-rv-st" x="278" y="142" text-anchor="middle" font-size="9">de-energized</text>
              </g>
              <line class="df-wire" x1="56" y1="86" x2="56" y2="108"/>
              <line class="df-wire" x1="163" y1="86" x2="163" y2="108"/>
              <line class="df-wire" x1="265" y1="86" x2="265" y2="108"/>
              <g id="df-fan" class="df-node">
                <rect x="8" y="172" width="96" height="48" rx="6"/>
                <text x="56" y="190" text-anchor="middle" font-size="10">ODU fan</text>
                <text id="df-fan-st" x="56" y="206" text-anchor="middle" font-size="9">ON in heat/cool</text>
              </g>
              <g id="df-cc" class="df-node">
                <rect x="118" y="172" width="90" height="48" rx="6"/>
                <text x="163" y="190" text-anchor="middle" font-size="10">Contactor / Y</text>
                <text id="df-cc-st" x="163" y="206" text-anchor="middle" font-size="9">compressor</text>
              </g>
              <g id="df-aux" class="df-node">
                <rect x="224" y="172" width="108" height="48" rx="6"/>
                <text x="278" y="190" text-anchor="middle" font-size="10">Aux / strips W</text>
                <text id="df-aux-st" x="278" y="206" text-anchor="middle" font-size="9">off</text>
              </g>
              <line class="df-wire" x1="56" y1="156" x2="56" y2="172"/>
              <line class="df-wire" x1="163" y1="156" x2="163" y2="172"/>
              <line class="df-wire" x1="278" y1="156" x2="278" y2="172"/>
            </svg>
            <p class="sb-ph-cap">Live: gold = energized. Defrost = RV in cool + ODU fan OFF + aux often ON. Sensors feed the board — not the charge.</p>
          </div>
          <p class="eyebrow">P-H diagram (training sketch)</p>
          <canvas id="sb-ph" width="280" height="170"></canvas>
          <p class="sb-ph-cap">Coolselector-style: 1 suction · 2 discharge · 3 liquid · 4 after TXV. Not a design program.</p>
          <p class="eyebrow">Bill of materials</p>
          <ul id="sb-bom" class="sb-bom"></ul>
          <div class="phase-legend">
            <span class="ph hv">High vapor</span>
            <span class="ph hl">High liquid</span>
            <span class="ph lm">Low mix</span>
            <span class="ph lv">Low vapor</span>
          </div>
          <ol class="sb-ts" id="sb-ts" aria-label="DX troubleshooting sheet"></ol>
          <p class="sb-status" id="sb-status">Place the four core components to close the loop.</p>
          <div id="sb-vac" class="sb-vac" hidden></div>
          <div id="sb-field" class="sb-field">
            <p class="eyebrow">Field / troubleshoot</p>
            <p id="sb-job-talk" class="sb-job-talk">Recreate a job you saw, or take a mystery call. Clean coils and swap parts — the sim tells you if you actually fixed it.</p>
            <div class="sb-repairs" id="sb-repairs">
              <button type="button" class="btn" data-fix="clean-odu">Clean ODU coil</button>
              <button type="button" class="btn" data-fix="clean-idu">Clean IDU coil</button>
              <button type="button" class="btn" data-fix="replace-filter">Replace air filter</button>
              <button type="button" class="btn" data-fix="replace-odfan">Replace OD fan</button>
              <button type="button" class="btn" data-fix="replace-blower">Replace blower</button>
              <button type="button" class="btn" data-fix="replace-comp">Replace compressor</button>
              <button type="button" class="btn" data-fix="replace-cap">Replace capacitor</button>
              <button type="button" class="btn" data-fix="replace-rv">Replace reversing valve</button>
              <button type="button" class="btn" data-fix="shift-heat">Call HEAT (O/B)</button>
              <button type="button" class="btn" data-fix="force-defrost">Force defrost</button>
              <button type="button" class="btn" data-fix="end-defrost">Terminate defrost</button>
              <button type="button" class="btn" data-fix="replace-defrost">Replace defrost sensor</button>
              <button type="button" class="btn" data-fix="dirty-odu">Dirty ODU (recreate)</button>
              <button type="button" class="btn" data-fix="dirty-idu">Dirty IDU (recreate)</button>
              <button type="button" class="btn" data-fix="leak-visual">1 Visual leak</button>
              <button type="button" class="btn" data-fix="leak-soap">2 Soap bubbles</button>
              <button type="button" class="btn" data-fix="leak-sniffer">3 Sniffer</button>
              <button type="button" class="btn" data-fix="leak-n2">4 N₂ standing test</button>
              <button type="button" class="btn" data-fix="leak-repair">5 Repair leak</button>
              <button type="button" class="btn" data-fix="add-charge">Add 6% charge</button>
              <button type="button" class="btn" data-fix="pull-charge">Recover 6% charge</button>
              <button type="button" class="btn" data-fix="replace-txv">Replace TXV</button>
              <button type="button" class="btn" data-fix="replace-drier">Replace drier</button>
              <button type="button" class="btn" data-fix="vac-air">Evacuate / vac</button>
              <button type="button" class="btn" data-fix="weigh-in">7 Weigh-in charge</button>
            </div>
            <ol id="sb-leak-steps" class="sb-leak-steps">
              <li data-k="visual">1. Visual — oil stain, mechanical joint, schrader</li>
              <li data-k="soap">2. Soap bubbles on joints</li>
              <li data-k="sniffer">3. Electronic detector (slow, below the joint)</li>
              <li data-k="nitrogen">4. Dry nitrogen standing pressure (no oxygen)</li>
              <li data-k="repair">5. Repair — braze / replace the leaking part</li>
              <li data-k="vac">6. Evacuate to microns</li>
              <li data-k="charge">7. Weigh in nameplate charge — never top off a leaker</li>
            </ol>
            <p class="n2-banner" id="sb-n2-banner">N₂ SAFETY — regulator on the cylinder · dry nitrogen gas only · NEVER oxygen or shop air (oil + O₂ detonates) · N₂ displaces oxygen (asphyxiation) · stay at or below OEM test pressure · no liquid nitrogen on a lineset</p>
            <div id="sb-n2-modal" class="n2-modal hidden">
              <h3>Nitrogen safety — read it</h3>
              <ul>
                <li>Cylinder is ~2200+ psig. <strong>Regulator required.</strong> Never crack a bottle into a hose.</li>
                <li><strong>Dry nitrogen gas only.</strong> Not oxygen. Not shop air. Oil + oxygen can explode.</li>
                <li>Do not exceed the equipment / OEM test pressure. Watch the gauge. Relief path on the regulator.</li>
                <li>N₂ is inert — it will <strong>asphyxiate</strong> you in a closet, crawl, or van with no air.</li>
                <li>Purge while brazing at low flow. Standing test is a hold, not a fill-until-it-pops.</li>
                <li>This is not liquid nitrogen. Freeze burns and over-pressure are both on you.</li>
              </ul>
              <button type="button" class="btn primary" id="sb-n2-go">Regulator on · dry N₂ only · continue</button>
              <button type="button" class="btn" id="sb-n2-no">Cancel</button>
            </div>
            <p id="sb-coils" class="sb-coils">ODU coil: clean · IDU coil: clean · frost 0%</p>
          </div>
          <div class="dmm-panel" id="sb-dmm">
            <div class="dmm-head">
              <img src="parts/dmm.png" alt="" />
              <div>
                <p class="eyebrow">Digital multimeter</p>
                <strong>Probe live electrical</strong>
              </div>
            </div>
            <label>Function
              <select id="dmm-mode">
                <option value="vac">VAC</option>
                <option value="aac">AAC (clamp)</option>
                <option value="ohm">OHMS (locked out)</option>
                <option value="cont">Continuity</option>
              </select>
            </label>
            <label>Probe
              <select id="dmm-probe">
                <option value="l1l2">L1–L2 at disconnect</option>
                <option value="load">Load side of disconnect</option>
                <option value="coil">Contactor coil C–Y</option>
                <option value="ob">Reversing valve O/B solenoid</option>
                <option value="rc">Thermostat R–C</option>
                <option value="comp">Compressor amps</option>
                <option value="cap">Capacitor HERM–C</option>
                <option value="wind">Compressor windings (OHM)</option>
              </select>
            </label>
            <div class="dmm-lcd"><span id="dmm-val">—. —</span><small id="dmm-unit">VAC</small></div>
            <p class="dmm-note" id="dmm-note">Drop electrical parts, then probe. Never ohm a live circuit.</p>
          </div>
          <div class="manifold" id="sb-manifold">
            <div class="man-face">
              <div class="man-dial low"><span id="man-low">0</span></div>
              <div class="man-center">HVAC</div>
              <div class="man-dial high"><span id="man-high">0</span></div>
            </div>
            <p class="man-note">Digital twins the analog set above. Same law.</p>
          </div>
          </div>
        </aside>
      </div>
    `;
  }

  function updateSysBanner() {
    const ban = document.getElementById("sb-sysbanner");
    const info = document.getElementById("sb-sysinfo");
    if (!ban || !info) return;
    if (activeSystem) {
      const s = activeSystem;
      ban.innerHTML = `<strong>${s.brand}</strong> · ${s.name} · ${s.tons} ton · SEER ${s.seer} · ${s.ref} · ${s.metering.toUpperCase()}`;
      info.innerHTML = `
        <div class="sys-card">
          <p class="sys-brand">${s.brand}</p>
          <p class="sys-name">${s.name}</p>
          <p class="sys-meta">${s.tons} ton · SEER ${s.seer} · ${s.type}</p>
          <p class="sys-notes">${s.notes}</p>
        </div>`;
    } else {
      ban.textContent = "The four: compressor → condenser → metering → evaporator. Close the loop, then start it.";
      info.innerHTML = `<p class="sys-empty">Load Goodman, Amana, Carrier, Bryant, Trane, Rheem, Lennox, York, Daikin, Mitsubishi, Fujitsu, LG, Samsung, Bosch, Danfoss — or a mini-split package.</p>`;
    }
    paintChargeWin();
  }

  function paintChargeWin() {
    const body = document.getElementById("sb-charge-body");
    const title = document.getElementById("sb-charge-title");
    if (!body) return;
    const sop = chargeSop(activeSystem);
    if (title) title.textContent = sop.title;
    const nDone = sop.steps.filter((s) => chargeChecks[s.id]).length;
    body.innerHTML =
      "<p class='sb-charge-meta'>" +
      sop.ref +
      " · " +
      String(sop.metering).toUpperCase() +
      " · " +
      sop.type +
      " · " +
      nDone +
      "/" +
      sop.steps.length +
      " done</p><ol class='sb-charge-steps'>" +
      sop.steps
        .map(function (s) {
          const on = !!chargeChecks[s.id];
          return (
            "<li class='" +
            (on ? "done" : "") +
            "'><label><input type='checkbox' data-ch='" +
            s.id +
            "'" +
            (on ? " checked" : "") +
            "/> <strong>" +
            s.t +
            "</strong></label><span>" +
            s.d +
            "</span></li>"
          );
        })
        .join("") +
      "</ol><p class='sb-charge-foot'>Training SOP — OEM install guide still wins on ounces and torque.</p>";
    body.querySelectorAll("input[data-ch]").forEach((inp) => {
      inp.onchange = () => {
        chargeChecks[inp.getAttribute("data-ch")] = inp.checked;
        paintChargeWin();
      };
    });
  }

  function bindChargeDrag() {
    const win = document.getElementById("sb-charge-win");
    const handle = document.getElementById("sb-charge-drag");
    if (!win || !handle || handle._ltDrag) return;
    handle._ltDrag = true;
    let press = false, sx = 0, sy = 0, ox = 0, oy = 0;
    function moveTo(x, y) {
      const w = win.offsetWidth || 300;
      x = Math.min(Math.max(8, window.innerWidth - Math.min(w, window.innerWidth - 16) - 8), Math.max(8, x));
      y = Math.min(Math.max(8, window.innerHeight - 56), Math.max(8, y));
      win.classList.add("is-moved");
      win.style.setProperty("--sb-fx", x + "px");
      win.style.setProperty("--sb-fy", y + "px");
    }
    handle.addEventListener("pointerdown", (e) => {
      if (e.target && e.target.closest && e.target.closest("button")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      press = true;
      const r = win.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      ox = r.left;
      oy = r.top;
      win.classList.add("dragging");
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      try { e.preventDefault(); } catch (_) {}
    });
    handle.addEventListener("pointermove", (e) => {
      if (!press) return;
      try { e.preventDefault(); } catch (_) {}
      moveTo(ox + e.clientX - sx, oy + e.clientY - sy);
    });
    function up() {
      press = false;
      win.classList.remove("dragging");
    }
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
    win.classList.add("collapsed");
  }

  function bindGaugeDrag() {
    injectSandboxPolish();
    const win = document.getElementById("sb-gauges-panel");
    const handle = document.getElementById("sb-gauges-drag");
    if (!win || !handle || handle._ltDrag) return;
    handle._ltDrag = true;
    let press = false, sx = 0, sy = 0, ox = 0, oy = 0;
    function moveTo(x, y) {
      const w = win.offsetWidth || 360;
      const maxL = Math.max(8, window.innerWidth - Math.min(w, window.innerWidth - 16) - 8);
      const maxT = Math.max(8, window.innerHeight - 48);
      x = Math.min(maxL, Math.max(8, x));
      y = Math.min(maxT, Math.max(8, y));
      win.classList.add("is-moved");
      win.style.setProperty("--sb-gx", x + "px");
      win.style.setProperty("--sb-gy", y + "px");
      win.style.setProperty("left", x + "px", "important");
      win.style.setProperty("top", y + "px", "important");
      win.style.setProperty("right", "auto", "important");
      win.style.setProperty("bottom", "auto", "important");
    }
    handle.addEventListener("pointerdown", (e) => {
      if (e.target && e.target.closest && e.target.closest("button")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      press = true;
      const r = win.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      ox = r.left;
      oy = r.top;
      win.classList.add("dragging", "is-moved");
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      try { e.preventDefault(); } catch (_) {}
    });
    handle.addEventListener("pointermove", (e) => {
      if (!press) return;
      try { e.preventDefault(); } catch (_) {}
      moveTo(ox + e.clientX - sx, oy + e.clientY - sy);
    });
    function up() {
      press = false;
      win.classList.remove("dragging");
    }
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  }

  function applySystem(sys) {
    activeSystem = sys;
    labId = sys.lab || null;
    placed = Object.assign({}, sys.parts);
    refrigerant = sys.ref;
    running = false;
    particles = [];
    const refSel = document.getElementById("sb-ref");
    if (refSel) {
      refSel.value = sys.ref;
      // ensure option exists
      if (![...refSel.options].some((o) => o.value === sys.ref)) {
        const opt = document.createElement("option");
        opt.value = sys.ref;
        opt.textContent = sys.ref;
        refSel.appendChild(opt);
        refSel.value = sys.ref;
      }
    }
    refreshSlots();
    updateSysBanner();
    syncGuidedStep();
    layoutSlots();
    paintHubCoach(sys.brand + " pack on the board. Finish HUB steps or tap Free build.");
    paintLabBoard();
    document.getElementById("sb-status").textContent =
      sys.brand + " package loaded — start compressor to run the sim.";
    if (onXp) onXp(10);
  }

  function loadLab(sys) {
    labId = sys.lab || sys.id;
    guidedOn = false;
    applySystem(sys);
    placed.gauges = "gauges";
    placed.copper = "lineset";
    if (sys.lab === "tu102") {
      placed.receiver = "receiver";
      placed.accumulator = "accumulator";
    }
    placed.chargecan = "r410a";
    placed.vacpump = "vacpump";
    placed.nitrogen = "nitrogen";
    refrigerant = "R-410A";
    chargePct = 100;
    fault = "none";
    labFanEvap = 100;
    labFanCond = 100;
    gaugesEquipped = true;
    layoutSlots();
    paintLabBoard();
    const man = document.getElementById("sb-manifold");
    if (man) man.classList.add("on");
    paintHubCoach(
      sys.lab === "tu601"
        ? "TU-601 on the stand. R-410A only. Two indoor heads, sight glasses on every lineset. Watch the glasses for flash. How-to is on YouTube — links in Lab trainers."
        : "TU-102 H-block. You can SEE the cycle. Vari-speed fans starve a coil like dirt. Sight glasses tell the truth. Start it and read SH/SC."
    );
  }

  function paintLabBoard() {
    const el = document.getElementById("sb-labboard");
    if (!el) return;
    if (!labId) {
      el.classList.add("hidden");
      el.innerHTML = "";
      return;
    }
    el.classList.remove("hidden");
    const vids = LAB_VIDEOS[labId] || [];
    const vidHtml = vids
      .map((v) => '<a class="lab-yt" href="' + v.url + '" target="_blank" rel="noopener">' + v.t + "</a>")
      .join(" ");
    if (labId === "tu601") {
      el.innerHTML =
        "<div class='lab-head'><strong>iConnect TU-601</strong> · Multi-head mini-split · R-410A ONLY <button type='button' class='btn' id='lab-fold'>Board</button></div>" +
        "<div class='lab-tu601'>" +
        "<div class='lab-odu'>DAIKIN ODU</div>" +
        "<div class='lab-glass-row'><span class='lab-sg'>SG</span><span class='lab-sg'>SG</span><span class='lab-sg'>SG</span><span class='lab-sg'>SG</span></div>" +
        "<div class='lab-idu'>Cassette IDU</div>" +
        "<p class='lab-note'>Four sight-glass lines (liq/suc × zones). Flash in a glass = starved or restriction. Flares, not sweat. Nameplate law: R-410A only.</p>" +
        "</div><div class='lab-yt-row'>" + vidHtml + "</div>";
      wireLabFold(el);
      return;
    }
    el.innerHTML =
      "<div class='lab-head'><strong>iConnect TU-102</strong> · H-Block <button type='button' class='btn' id='lab-fold'>Board</button></div>" +
      "<div class='lab-hblock'>" +
      "<div class='lab-coil ev'>EVAPORATOR<div class='lab-sg'>sight glass</div></div>" +
      "<div class='lab-fans'>" +
      "<label>Evap fan <input id='lab-fe' type='range' min='20' max='100' value='" +
      labFanEvap +
      "' /><span id='lab-fe-v'>" +
      labFanEvap +
      "%</span></label>" +
      "<label>Cond fan <input id='lab-fc' type='range' min='20' max='100' value='" +
      labFanCond +
      "' /><span id='lab-fc-v'>" +
      labFanCond +
      "%</span></label>" +
      "</div>" +
      "<div class='lab-mid'>TXV · drier · service valves</div>" +
      "<div class='lab-txv'>" +
      "<strong>TXV stem</strong>" +
      "<button type='button' class='btn' id='lab-txv-ccw'>↺ CCW open · lower SH</button>" +
      "<span id='lab-txv-v'>target " +
      txvTarget +
      "° SH</span>" +
      "<button type='button' class='btn' id='lab-txv-cw'>CW close · raise SH ↻</button>" +
      "<p class='lab-note'>¼ turn, then re-read. CW = spring tighter = less feed = <em>higher</em> SH. CCW = more feed = <em>lower</em> SH. Do not touch the stem until fans are 100% and SC is in band.</p>" +
      "</div>" +
      "<div class='lab-coil cd'>CONDENSER<div class='lab-sg'>sight glass</div></div>" +
      "<div class='lab-bottom'><span>Receiver</span><span>Accumulator</span><span>Hermetic</span></div>" +
      "<p class='lab-note'>Turn a fan down = dirty coil fingerprint. Cond fan down: high head, SC about normal — not an overcharge. Evap fan down: SH collapses toward 0 — don't add gas. Glasses: bubbles on liquid = starved. Clear isn't always fully charged — check SH/SC.</p>" +
      "<div class='lab-ts'><strong>TU-102 troubleshooting</strong>" +
      "<ol class='sb-charge-steps'>" +
      TU102_TS.map(function (s) {
        const on = !!labTs[s.id];
        return (
          "<li class='" +
          (on ? "done" : "") +
          "'><label><input type='checkbox' data-ts='" +
          s.id +
          "'" +
          (on ? " checked" : "") +
          "/> <strong>" +
          s.t +
          "</strong></label><span>" +
          s.d +
          "</span></li>"
        );
      }).join("") +
      "</ol>" +
      "<div class='lab-inject'>" +
      "<span>Inject a fault:</span>" +
      "<button type='button' class='btn' data-labf='evap'>Evap fan 30%</button>" +
      "<button type='button' class='btn' data-labf='cond'>Cond fan 30%</button>" +
      "<button type='button' class='btn' data-labf='under'>Undercharge</button>" +
      "<button type='button' class='btn' data-labf='over'>Overcharge</button>" +
      "<button type='button' class='btn' data-labf='txv'>TXV closed</button>" +
      "<button type='button' class='btn' data-labf='rest'>Restriction</button>" +
      "<button type='button' class='btn' data-labf='air'>Non-condensables</button>" +
      "<button type='button' class='btn' data-labf='fan'>OD fan dead</button>" +
      "<button type='button' class='btn' data-labf='ok'>Reset healthy</button>" +
      "</div></div>" +
      "</div><div class='lab-yt-row'>" + vidHtml + "</div>";
    const fe = document.getElementById("lab-fe");
    const fc = document.getElementById("lab-fc");
    if (fe)
      fe.oninput = () => {
        labFanEvap = +fe.value;
        document.getElementById("lab-fe-v").textContent = labFanEvap + "%";
      };
    if (fc)
      fc.oninput = () => {
        labFanCond = +fc.value;
        document.getElementById("lab-fc-v").textContent = labFanCond + "%";
      };
    wireTxvStem();
    el.querySelectorAll("input[data-ts]").forEach((inp) => {
      inp.onchange = () => {
        labTs[inp.getAttribute("data-ts")] = inp.checked;
        const step = TU102_TS.find((s) => s.id === inp.getAttribute("data-ts"));
        if (inp.checked && step) paintHubCoach(step.t + " — " + step.d);
      };
    });
    el.querySelectorAll("[data-labf]").forEach((b) => {
      b.onclick = () => applyLabFault(b.getAttribute("data-labf"));
    });
    wireLabFold(el);
  }

  function wireLabFold(el) {
    if (!el) return;
    if (window.innerWidth < 700) el.classList.add("collapsed");
    const b = document.getElementById("lab-fold");
    if (b) b.onclick = () => el.classList.toggle("collapsed");
  }

  function applyLabFault(kind) {
    labFanEvap = 100;
    labFanCond = 100;
    if (kind !== "under" && kind !== "over") chargePct = 100;
    if (kind === "ok") {
      chargePct = 100;
      fault = "none";
      txvTarget = 10;
    } else if (kind === "evap") {
      labFanEvap = 30;
      fault = "none";
    } else if (kind === "cond") {
      labFanCond = 30;
      fault = "none";
    } else if (kind === "under") {
      chargePct = 70;
      fault = "undercharge";
    } else if (kind === "over") {
      chargePct = 125;
      fault = "overcharge";
    } else if (kind === "txv") {
      fault = "txv_closed";
    } else if (kind === "rest") {
      fault = "restricted";
    } else if (kind === "air") {
      fault = "noncondensables";
    } else if (kind === "fan") {
      fault = "od_fan";
    }
    const fe = document.getElementById("lab-fe");
    const fc = document.getElementById("lab-fc");
    if (fe) fe.value = String(labFanEvap);
    if (fc) fc.value = String(labFanCond);
    const fev = document.getElementById("lab-fe-v");
    const fcv = document.getElementById("lab-fc-v");
    if (fev) fev.textContent = labFanEvap + "%";
    if (fcv) fcv.textContent = labFanCond + "%";
    const ch = document.getElementById("sb-charge");
    const cv = document.getElementById("sb-charge-v");
    const fl = document.getElementById("sb-fault");
    if (ch) ch.value = String(chargePct);
    if (cv) cv.textContent = String(chargePct);
    if (fl) fl.value = fault;
    if (!running) setCompressor(true);
    const sim = simulate();
    updateGauges(sim);
    openGaugeWin();
    paintHubCoach(
      "TU-102 fault in. SH ~" +
        Math.round(sim.sh) +
        "° · SC ~" +
        Math.round(sim.sc) +
        "° · suction " +
        Math.round(sim.pLow) +
        " / head " +
        Math.round(sim.pHigh) +
        ". Work the 8 steps. Don't skip airflow."
    );
  }

  function wireTxvStem() {
    const cw = document.getElementById("lab-txv-cw");
    const ccw = document.getElementById("lab-txv-ccw");
    if (!cw && !ccw) return;
    const bump = (d) => {
      txvTarget = Math.max(6, Math.min(18, txvTarget + d));
      const sl = document.getElementById("sb-txv");
      const sv = document.getElementById("sb-txv-v");
      if (sl) sl.value = String(txvTarget);
      if (sv) sv.textContent = String(txvTarget);
      const lab = document.getElementById("lab-txv-v");
      if (lab) lab.textContent = "target " + txvTarget + "° SH";
      const sim = simulate();
      paintHubCoach(
        "Stem " +
          (d > 0 ? "CW (close)" : "CCW (open)") +
          ". Target SH " +
          txvTarget +
          "°. Live SH ~" +
          Math.round(sim.sh) +
          "° · SC ~" +
          Math.round(sim.sc) +
          "°. Quarter turn, then wait — on the steel that's 10–15 min."
      );
    };
    if (cw) cw.onclick = () => bump(1);
    if (ccw) ccw.onclick = () => bump(-1);
  }

  function loadTxvLab(sys) {
    loadLab(sys);
    txvTarget = 16;
    const sl = document.getElementById("sb-txv");
    const sv = document.getElementById("sb-txv-v");
    if (sl) sl.value = "16";
    if (sv) sv.textContent = "16";
    setCompressor(true);
    paintLabBoard();
    paintHubCoach(
      "TXV lab: SH is high — stem too closed (or bulb starving). Prove fans 100% and SC first. Then ¼-turn CCW to open and drop SH toward ~10°. Don't charge a TXV problem."
    );
  }

  function canForRef(ref) {
    if (ref === "R-22") return "r22";
    if (ref === "R-134a") return "r134a";
    if (ref === "R-32") return "r32";
    return "r410a";
  }

  function loadHealthyExample() {
    const sys = SYSTEMS.find((s) => s.id === "goodman-gsx") || SYSTEMS[0];
    guidedOn = false;
    applySystem(sys);
    placed.copper = "lineset";
    placed.nitrogen = "nitrogen";
    placed.vacpump = "vacpump";
    placed.gauges = "gauges";
    placed.chargecan = canForRef(sys.ref);
    placed.disconnect = "disconnect";
    placed.contactor = "contactor";
    placed.capacitor = "capacitor";
    placed.transformer = "transformer";
    placed.thermostat = "thermostat";
    outdoorF = 95;
    indoorF = 75;
    chargePct = 100;
    fault = "none";
    coilCond = "clean";
    coilEvap = "clean";
    gaugesEquipped = true;
    leak.vac = true;
    leak.nitrogen = true;
    const setv = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = String(v);
    };
    setv("sb-out", 95);
    setv("sb-in", 75);
    setv("sb-charge", 100);
    setv("sb-fault", "none");
    const ov = document.getElementById("sb-out-v");
    const iv = document.getElementById("sb-in-v");
    const cv = document.getElementById("sb-charge-v");
    if (ov) ov.textContent = "95";
    if (iv) iv.textContent = "75";
    if (cv) cv.textContent = "100";
    const man = document.getElementById("sb-manifold");
    if (man) man.classList.add("on");
    layoutSlots();
    guidedOn = false;
    setCompressor(true);
    const sim = simulate();
    const msg =
      "Textbook " +
      sys.brand +
      " " +
      sys.name +
      " · " +
      sys.ref +
      " · 95° OD / 75° ID. Suction ~" +
      Math.round(sim.pLow) +
      " psig · Head ~" +
      Math.round(sim.pHigh) +
      " psig · SH " +
      Math.round(sim.sh) +
      "° · SC " +
      Math.round(sim.sc) +
      "°. Line set, N₂, vac, and " +
      sys.ref +
      " cylinder are on. That's a fully operational split.";
    paintHubCoach(msg);
    const st = document.getElementById("sb-status");
    if (st) st.textContent = msg;
  }

  function paintClock() {
    const el = document.getElementById("sb-clock");
    if (!el) return;
    if (!challenge) {
      el.textContent = "";
      el.className = "sb-clock";
      return;
    }
    el.textContent = challengeWon ? "DONE  " + challenge.name : challengeLeft + "s  " + challenge.name;
    el.className = "sb-clock" + (challengeWon ? " ok" : challengeLeft <= 10 ? " low" : "");
  }

  function startChallenge(ch, fromNet) {
    challenge = ch;
    challengeWon = false;
    challengeLeft = ch.time;
    guidedOn = false;
    placed = {};
    running = false;
    particles = [];
    activeSystem = null;
    delete host.dataset.loopXp;
    if (challengeTimer) clearInterval(challengeTimer);
    challengeTimer = setInterval(() => {
      if (!challenge || challengeWon) return;
      challengeLeft -= 1;
      paintClock();
      if (challengeLeft <= 0) {
        challengeLeft = 0;
        clearInterval(challengeTimer);
        challengeTimer = 0;
        finishRace("time");
        const st = document.getElementById("sb-status");
        if (st) st.textContent = "Time. Circuit incomplete. HUB: " + ch.hint;
        paintClock();
      }
    }, 1000);
    refreshSlots();
    layoutSlots();
    updateSysBanner();
    paintClock();
    const ban = document.getElementById("sb-sysbanner");
    if (ban) ban.textContent = "RACE · " + ch.name + " · " + ch.hint;
    if (raceChannel && !fromNet) {
      try {
        raceChannel.postMessage({ type: "go", chId: ch.id, name: raceNick });
      } catch (_) {}
    }
    document.getElementById("sb-status") && (document.getElementById("sb-status").textContent =
      (racePin ? "PIN " + racePin + " · " : "") + "Place every required part. Clock is running. " + raceNick + " is on the board.");
  }

  function scoreBuild() {
    let pts = 0;
    const need = (challenge && challenge.need) || ["compressor", "condenser", "metering", "evaporator"];
    need.forEach((id) => {
      if (placed[id]) pts += 80;
    });
    pts += Math.max(0, challengeLeft) * 8;
    if (placed.copper) pts += 25;
    if (placed.vacpump) pts += 25;
    if (placed.chargecan) pts += 25;
    if (placed.filter) pts += 20;
    if (running) pts += 80;
    try {
      const sim = simulate();
      if (running && sim && sim.shOk && sim.scOk) pts += 150;
    } catch (_) {}
    return pts;
  }

  function raceBoardLoad() {
    try {
      return JSON.parse(localStorage.getItem("lt-sb-race-board") || "[]");
    } catch (_) {
      return [];
    }
  }

  function finishRace(why) {
    if (challengeWon) return;
    challengeWon = true;
    if (challengeTimer) {
      clearInterval(challengeTimer);
      challengeTimer = 0;
    }
    const pts = scoreBuild();
    const row = {
      name: raceNick,
      pts,
      ch: (challenge && challenge.name) || "Free build",
      why,
      t: Date.now(),
      pin: racePin || "",
    };
    const board = raceBoardLoad();
    board.unshift(row);
    try {
      localStorage.setItem("lt-sb-race-board", JSON.stringify(board.slice(0, 50)));
    } catch (_) {}
    raceLive[raceNick] = pts;
    if (raceChannel) {
      try {
        raceChannel.postMessage({ type: "score", name: raceNick, pts, ch: row.ch });
      } catch (_) {}
    }
    if (typeof onRace === "function") onRace(pts, row);
    const st = document.getElementById("sb-status");
    if (st && why !== "time") {
      st.textContent = "Circuit closed · " + pts + " pts · " + challengeLeft + "s left. " + raceNick + " posted.";
    }
    paintClock();
    if (why !== "time" && onXp) onXp(Math.min(40, 15 + Math.round(challengeLeft / 4)));
    if (why !== "time") running = true;
  }

  function openRaceChan(pin) {
    racePin = String(pin || "");
    if (raceChannel) {
      try {
        raceChannel.close();
      } catch (_) {}
      raceChannel = null;
    }
    if (!racePin || !window.BroadcastChannel) return;
    raceChannel = new BroadcastChannel("lt-sb-race-" + racePin);
    raceChannel.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === "go" && m.chId && m.name !== raceNick) {
        const ch = CHALLENGES.find((c) => c.id === m.chId);
        if (ch) startChallenge(ch, true);
      }
      if (m.type === "score" && m.name) raceLive[m.name] = m.pts;
    };
  }

  function hostRace() {
    const nickEl = document.getElementById("sb-race-nick");
    if (nickEl) raceNick = nickEl.value.trim() || "Tech";
    racePin = String((Math.random() * 900000 + 100000) | 0);
    const pinEl = document.getElementById("sb-race-pin");
    if (pinEl) pinEl.value = racePin;
    openRaceChan(racePin);
    const st = document.getElementById("sb-status");
    if (st) st.textContent = "PIN " + racePin + " — students Join, then you tap a circuit. GO syncs other tabs.";
  }

  function joinRace() {
    const nickEl = document.getElementById("sb-race-nick");
    if (nickEl) raceNick = nickEl.value.trim() || "Tech";
    const pinEl = document.getElementById("sb-race-pin");
    racePin = ((pinEl && pinEl.value.trim()) || "").replace(/\D/g, "");
    if (racePin.length < 4) {
      const st = document.getElementById("sb-status");
      if (st) st.textContent = "Ask the host for the PIN.";
      return;
    }
    openRaceChan(racePin);
    const st = document.getElementById("sb-status");
    if (st) st.textContent = raceNick + " joined " + racePin + ". Wait for GO or tap the same circuit.";
  }

  function checkChallenge() {
    if (!challenge || challengeWon) return;
    const ok = challenge.need.every((id) => placed[id] === id);
    if (!ok) return;
    finishRace("win");
    const ban = document.getElementById("sb-sysbanner");
    if (ban) ban.textContent = "RACE complete · " + challenge.name;
    if (running && requiredComplete()) seedFlow();
  }

  function paintCoils(sim) {
    sim = sim || {};
    const el = document.getElementById("sb-coils");
    if (el) {
      const bits = [
        "ODU: " + coilCond + (sim.iceOd ? " · ICED" : "") + (sim.odFanOn === false ? " · FAN OFF" : ""),
        "IDU: " + coilEvap + (sim.iceEvap ? " · ICED" : "") + (sim.idFanOn === false ? " · BLOWER OFF" : ""),
        "frost " + Math.round(frost) + "%",
        sim.drierDrop ? ("drier drop " + sim.drierDrop + "°F") : null,
        sim.supplyF != null ? ("supply " + Math.round(sim.supplyF) + "°F") : "no supply air",
      ].filter(Boolean);
      el.textContent = bits.join(" · ");
    }
    document.querySelectorAll(".sb-slot").forEach((s) => {
      const id = s.dataset.slot;
      s.classList.toggle("coil-dirty", (id === "condenser" && coilCond === "dirty") || (id === "evaporator" && coilEvap === "dirty"));
      s.classList.toggle("coil-frost",
        (id === "evaporator" && (sim.iceEvap || fault === "dirty_evap" || fault === "blower_fail" || coilEvap === "dirty")) ||
        (id === "condenser" && (sim.iceOd || fault === "defrost_fail" || (frost > 50 && hpMode === "heat")))
      );
      s.classList.toggle("coil-hot", id === "evaporator" && sim.supplyF != null && sim.supplyF > indoorF + 8);
      s.classList.toggle("fan-dead", (id === "condenser" && sim.odFanOn === false) || (id === "evaporator" && sim.idFanOn === false));
    });
    const talk = document.getElementById("sb-job-talk");
    if (talk && activeJob && jobMode === "mystery" && !jobSolved) {
      talk.textContent = "CUSTOMER: " + activeJob.complaint + "  ·  HUB: Gauges + SH/SC. Clean coils or swap the part. Don't shotgun.";
    }
  }

  function resetLeak() {
    leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
    resetVac();
    paintLeak();
  }

  function leakLocated() {
    return !!(leak.visual || leak.soap || leak.sniffer);
  }

  function leakReadyToCharge() {
    return leakLocated() && leak.nitrogen && leak.repair && leak.vac;
  }

  function paintLeak() {
    const ol = document.getElementById("sb-leak-steps");
    if (!ol) return;
    const done = {
      visual: leak.visual,
      soap: leak.soap,
      sniffer: leak.sniffer,
      nitrogen: leak.nitrogen,
      repair: leak.repair,
      vac: leak.vac,
      charge: leakReadyToCharge() && chargePct >= 94 && chargePct <= 108 && fault === "none",
    };
    ol.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("done", !!done[li.dataset.k]);
    });
  }

  function loadBasePack() {
    const sys = SYSTEMS.find((s) => s.id === "goodman-gsx") || SYSTEMS[0];
    applySystem(sys);
  }

  function startRecreate() {
    jobMode = "recreate";
    activeJob = null;
    jobSolved = false;
    jobAttempts = 0;
    resetLeak();
    capBad = false;
    loadBasePack();
    running = true;
    const faultEl = document.getElementById("sb-fault");
    if (faultEl) faultEl.disabled = false;
    const talk = document.getElementById("sb-job-talk");
    if (talk) {
      talk.textContent =
        "RECREATE: set outdoor/indoor and charge to what you saw. Toggle dirty coils. Swap TXV/drier/charge and watch SH/SC. This is your truck, not a mystery.";
    }
    paintCoils();
    document.getElementById("sb-status").textContent = "Field recreate · match the job you just left.";
  }

  function startMystery(job) {
    jobMode = "mystery";
    activeJob = job;
    jobSolved = false;
    jobAttempts = 0;
    resetLeak();
    loadBasePack();
    outdoorF = job.outdoor;
    indoorF = job.indoor;
    chargePct = job.charge;
    coilCond = job.coilCond;
    coilEvap = job.coilEvap;
    fault = job.fault;
    capBad = !!job.capBad;
    hpMode = job.hpMode || "cool";
    frost = job.fault === "defrost_fail" ? 88 : job.fault === "stuck_defrost" ? 20 : 0;
    defrosting = job.fault === "stuck_defrost";
    running = true;
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = String(v);
    };
    set("sb-out", outdoorF);
    set("sb-in", indoorF);
    set("sb-charge", chargePct);
    set("sb-mode", hpMode);
    const ov = document.getElementById("sb-out-v");
    const iv = document.getElementById("sb-in-v");
    const cv = document.getElementById("sb-charge-v");
    if (ov) ov.textContent = outdoorF;
    if (iv) iv.textContent = indoorF;
    if (cv) cv.textContent = chargePct;
    const faultEl = document.getElementById("sb-fault");
    if (faultEl) {
      faultEl.value = "none";
      faultEl.disabled = true;
    }
    paintCoils();
    guidedOn = false;
    placed.accumulator = "accumulator";
    placed.disconnect = "disconnect";
    placed.contactor = "contactor";
    placed.capacitor = "capacitor";
    placed.transformer = "transformer";
    placed.thermostat = "thermostat";
    paintHubCoach(
      "Live call. Disconnect, contactor, capacitor, transformer, and accumulator are already on the unit. Read the gauges. Don't rebuild it."
    );
    document.getElementById("sb-status").textContent =
      dispatchCall
        ? dispatchCall.name + " · " + (dispatchCall.job || "live call") + " · gauges on"
        : "Mystery call. Diagnose, then repair. Fault list is locked.";
  }

  function jobIsHealthy() {
    const chargeOk = chargePct >= 94 && chargePct <= 108;
    const coilsOk = coilCond === "clean" && coilEvap === "clean";
    const leakOk = !activeJob || activeJob.fault !== "undercharge" || leakReadyToCharge();
    const capOk = !activeJob || !activeJob.capBad || !capBad;
    const defrostOk =
      !activeJob ||
      (activeJob.fault !== "defrost_fail" && activeJob.fault !== "stuck_defrost") ||
      (fault === "none" && frost < 25 && !defrosting);
    return coilsOk && fault === "none" && chargeOk && leakOk && capOk && defrostOk;
  }

  function requestNitrogen(onOk) {
    const modal = document.getElementById("sb-n2-modal");
    if (!modal) {
      if (n2Acked || window.confirm("N₂ SAFETY: regulator, dry nitrogen only, never oxygen or shop air, asphyxiation hazard. Continue?")) {
        n2Acked = true;
        if (onOk) onOk();
      }
      return;
    }
    modal.classList.remove("hidden");
    const go = document.getElementById("sb-n2-go");
    const no = document.getElementById("sb-n2-no");
    const done = (ok) => {
      modal.classList.add("hidden");
      if (ok) {
        n2Acked = true;
        if (window.LtSfx && window.LtSfx.n2) window.LtSfx.n2();
        if (onOk) onOk();
      } else {
        document.getElementById("sb-status").textContent = "N₂ cancelled. No standing test without a regulator and dry nitrogen.";
      }
    };
    if (go) go.onclick = () => done(true);
    if (no) no.onclick = () => done(false);
  }

  function applyRepair(kind) {
    jobAttempts += 1;
    if (kind === "clean-odu") {
      coilCond = "clean";
      if (fault === "dirty_cond") fault = "none";
    }
    if (kind === "clean-idu") {
      coilEvap = "clean";
      if (fault === "dirty_evap") fault = "none";
    }
    if (kind === "replace-filter") {
      coilEvap = "clean";
      if (fault === "dirty_evap") fault = "none";
    }
    if (kind === "replace-odfan") {
      if (fault === "od_fan") fault = "none";
      cutOut = null;
    }
    if (kind === "replace-comp") {
      if (fault === "weak_comp") fault = "none";
    }
    if (kind === "replace-blower") {
      if (fault === "blower_fail") fault = "none";
    }
    if (kind === "replace-cap") {
      capBad = false;
      placed.capacitor = "capacitor";
      refreshSlots();
    }
    if (kind === "replace-rv") {
      placed.revvalve = "revvalve";
      if (fault === "rv_stuck_heat" || fault === "rv_stuck_cool" || fault === "rv_bleed") fault = "none";
      refreshSlots();
    }
    if (kind === "shift-heat") {
      hpMode = "heat";
      const m = document.getElementById("sb-mode");
      if (m) m.value = "heat";
    }
    if (kind === "shift-cool") {
      hpMode = "cool";
      defrosting = false;
      const m = document.getElementById("sb-mode");
      if (m) m.value = "cool";
    }
    if (kind === "force-defrost") {
      defrosting = true;
      hpMode = "heat";
      const m = document.getElementById("sb-mode");
      if (m) m.value = "defrost";
      document.getElementById("sb-status").textContent = "Forced defrost. RV → cool, ODU fan OFF. Watch frost % drop.";
    }
    if (kind === "end-defrost") {
      defrosting = false;
      if (fault === "stuck_defrost") fault = "none";
      hpMode = "heat";
      const m = document.getElementById("sb-mode");
      if (m) m.value = "heat";
    }
    if (kind === "replace-defrost") {
      if (fault === "defrost_fail" || fault === "stuck_defrost") fault = "none";
      defrosting = frost > 40;
      document.getElementById("sb-status").textContent = "Defrost sensor/board replaced. Force a defrost if the coil is still a brick.";
    }
    if (kind === "dirty-odu") coilCond = "dirty";
    if (kind === "dirty-idu") coilEvap = "dirty";
    if (kind === "leak-visual") {
      leak.visual = true;
      document.getElementById("sb-status").textContent = "Oil at the schrader / flare. Visual is step 1 — confirm with soap or a sniffer.";
    }
    if (kind === "leak-soap") {
      leak.soap = true;
      document.getElementById("sb-status").textContent = "Bubbles on the joint. Mark it. Don't bury it in dye and walk away.";
    }
    if (kind === "leak-sniffer") {
      leak.sniffer = true;
      if (window.LtSfx && window.LtSfx.leak) window.LtSfx.leak();
      document.getElementById("sb-status").textContent = "Sniffer hit. Move 1–2 in/s, from below — refrigerant is heavier than air.";
    }
    if (kind === "leak-n2") {
      requestNitrogen(function () {
        leak.nitrogen = true;
        document.getElementById("sb-status").textContent =
          "Standing N₂. Regulator on. Dry gas only. Never oxygen/shop air. Watch decay — then repair.";
        paintLeak();
        paintCoils();
      });
      return;
    }
    if (kind === "leak-repair") {
      if (!leakLocated()) {
        document.getElementById("sb-status").textContent = "HUB: you haven't found it. Visual, soap, or sniffer first.";
        paintLeak();
        return;
      }
      leak.repair = true;
      document.getElementById("sb-status").textContent = "Leak repaired (braze / new schrader / new TXV). Now N₂ prove-out if you haven't, then evacuate.";
    }
    if (kind === "weigh-in") {
      const leakJob = (fault === "undercharge") || (activeJob && activeJob.fault === "undercharge");
      if (leakJob && !leakReadyToCharge()) {
        chargePct = Math.min(90, chargePct + 8);
        const c = document.getElementById("sb-charge");
        if (c) c.value = String(chargePct);
        const cv = document.getElementById("sb-charge-v");
        if (cv) cv.textContent = chargePct;
        document.getElementById("sb-status").textContent =
          "Top-off of a leaker. Charge will bleed down. Locate → N₂ → repair → vac → weigh-in. Commandment 5.";
        paintLeak();
        paintCoils();
        return;
      }
      chargePct = 100;
      if (fault === "undercharge" || fault === "overcharge") fault = "none";
      const c = document.getElementById("sb-charge");
      if (c) c.value = "100";
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = "100";
    }
    if (kind === "add-charge") {
      chargePct = Math.min(130, chargePct + 6);
      const c = document.getElementById("sb-charge");
      if (c) c.value = String(chargePct);
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = chargePct;
    }
    if (kind === "pull-charge") {
      chargePct = Math.max(50, chargePct - 6);
      const c = document.getElementById("sb-charge");
      if (c) c.value = String(chargePct);
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = chargePct;
    }
    if (kind === "replace-txv") {
      placed.metering = "metering";
      if (fault === "txv_closed" || fault === "txv_open") fault = "none";
      refreshSlots();
    }
    if (kind === "replace-drier") {
      placed.filter = "filter";
      if (fault === "restricted") fault = "none";
      refreshSlots();
    }
    if (kind === "vac-air") {
      leak.vac = true;
      if (fault === "noncondensables") fault = "none";
      if (leak.repair && !leak.nitrogen) {
        document.getElementById("sb-status").textContent = "You pulled a vacuum without an N₂ proof. HUB: standing pressure first, then microns.";
      }
    }
    paintCoils();
    paintLeak();
    if (jobMode === "mystery" && activeJob && !jobSolved && jobIsHealthy()) {
      jobSolved = true;
      const xp = Math.max(20, 80 - jobAttempts * 8);
      if (onXp) onXp(xp);
      document.getElementById("sb-status").textContent =
        "FIXED in " + jobAttempts + " moves · +" + xp + " XP. HUB: " + activeJob.fix;
      const talk = document.getElementById("sb-job-talk");
      if (talk) talk.textContent = "Job closed. " + activeJob.fix;
      const faultEl = document.getElementById("sb-fault");
      if (faultEl) {
        faultEl.disabled = false;
        faultEl.value = "none";
      }
    } else if (jobMode === "mystery" && activeJob && !jobSolved) {
      document.getElementById("sb-status").textContent =
        "Still broken (" + jobAttempts + "). Read SH and SC together. HUB: airflow and charge before you condemn the TXV.";
    } else {
      document.getElementById("sb-status").textContent =
        "Repair applied · ODU " + coilCond + " · IDU " + coilEvap + " · charge " + chargePct + "%";
    }
  }

  function appendPartRow(c, box) {
    const el = document.createElement("div");
    el.className = "sb-item" + (c.required ? " sb-item-core" : "");
    el.draggable = true;
    el.dataset.id = c.id;
    el.innerHTML = partThumb(c) + `<div><strong>${c.name}</strong><small>${c.desc}</small></div>`;
    el.addEventListener("dragstart", (e) => {
      parkPartsTray();
      e.dataTransfer.setData("text/plain", c.id);
      e.dataTransfer.effectAllowed = "copy";
      if (window.LtDrag && window.LtDrag.setHtml5Image) {
        window.LtDrag.setHtml5Image(e, { html: partThumb(c), label: c.name });
      }
    });
    if (window.LtDrag) {
      window.LtDrag.bindSource(el, {
        id: c.id,
        html: partThumb(c) + "<strong>" + c.name + "</strong>",
        slotSelector: "#sb-slots .sb-slot, #sb-rail .sb-slot",
        onDragStart() {
          el.dataset.justDragged = "1";
          parkPartsTray();
        },
        onDrop(slotId, id) {
          place(slotId, id);
        },
      });
    }
    el.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });
    el.addEventListener("click", () => {
      if (el.dataset.justDragged) {
        delete el.dataset.justDragged;
        return;
      }
      const railPart = benchSlot(c.slot);
      if (guidedOn && !railPart) {
        const step = currentBuildStep();
        if (step && c.slot && step.accept.indexOf(c.id) < 0 && c.slot !== step.slot) {
          paintHubCoach("Not yet. I need " + step.title + " first. " + step.hub);
          const st0 = document.getElementById("sb-status");
          if (st0) st0.textContent = "Not yet. " + step.title + ".";
          return;
        }
      }
      if (!c.slot) {
        applyEquip(c);
        return;
      }
      if (place(c.slot, c.id)) {
        inHand = null;
        document.querySelectorAll(".sb-item.in-hand").forEach((n) => n.classList.remove("in-hand"));
        paintInHand();
        return;
      }
      inHand = c;
      document.querySelectorAll(".sb-item.in-hand").forEach((n) => n.classList.remove("in-hand"));
      el.classList.add("in-hand");
      parkPartsTray();
      paintInHand();
      const chip = railPart ? document.querySelector('#sb-rail .sb-slot[data-slot="' + c.slot + '"]') : null;
      if (chip && chip.scrollIntoView) chip.scrollIntoView({ inline: "nearest", block: "nearest" });
      const st = document.getElementById("sb-status");
      if (st) st.textContent = railPart
        ? c.name + " in hand. Tap its chip on the bench rail."
        : c.name + " in hand. Tray parked. Tap the box on the glass.";
      paintHubCoach(railPart
        ? c.name + " in hand. Tap its chip on the rail under the diagram."
        : c.name + " in hand. Tray's out of the way — tap its box on the diamond.");
    });
    box.appendChild(el);
    return el;
  }

  function renderXtra() {
    const wrap = document.getElementById("sb-xtra-wrap");
    const box = document.getElementById("sb-xtra");
    if (!wrap || !box) return;
    const shown = {};
    document.querySelectorAll("#sb-items .sb-item[data-id]").forEach((el) => {
      shown[el.dataset.id] = 1;
    });
    box.innerHTML = "";
    const list = COMPONENTS.filter((c) => !shown[c.id]);
    if (!list.length) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    list.forEach((c) => appendPartRow(c, box));
  }

  function renderPalette(tab) {
    const box = document.getElementById("sb-items");
    if (!box) return;
    box.innerHTML = "";
    fillPalette(tab, box);
    renderXtra();
    markWantedParts();
  }

  function fillPalette(tab, box) {
    if (tab === "challenges") {
      CHALLENGES.forEach((ch) => {
        const el = document.createElement("div");
        el.className = "sb-item system";
        el.innerHTML =
          `<span class="ico">⏱</span><div><strong>${ch.name}</strong><small>${ch.time}s · ${ch.need.length} parts · ${ch.hint}</small></div>`;
        el.onclick = () => startChallenge(ch);
        box.appendChild(el);
      });
      return;
    }
    if (tab === "race") {
      const pinHtml =
        "<div class='sb-item system'><div><strong>Class race</strong><small>Same circuit, clock running. Parts + speed + running SH/SC. Host a PIN so other tabs join the heat.</small></div></div>" +
        "<label class='sb-race-lab'>Callsign <input id='sb-race-nick' maxlength='14' value='" +
        raceNick.replace(/'/g, "") +
        "' /></label>" +
        "<div class='sb-race-row'><input id='sb-race-pin' maxlength='6' placeholder='PIN' value='" +
        racePin +
        "' /><button type='button' class='btn' id='sb-race-host'>Host</button><button type='button' class='btn primary' id='sb-race-join'>Join</button></div>";
      box.insertAdjacentHTML("beforeend", pinHtml);
      CHALLENGES.forEach((ch) => {
        const el = document.createElement("div");
        el.className = "sb-item system";
        el.innerHTML = `<span class="ico">🏁</span><div><strong>${ch.name}</strong><small>${ch.time}s · ${ch.need.length} parts · GO</small></div>`;
        el.onclick = () => startChallenge(ch);
        box.appendChild(el);
      });
      const live = Object.keys(raceLive);
      const board = raceBoardLoad().slice(0, 12);
      const ol = document.createElement("ol");
      ol.className = "sb-race-board";
      ol.innerHTML = (live.length
        ? live
            .sort((a, b) => raceLive[b] - raceLive[a])
            .map((n) => "<li><strong>" + n + "</strong> " + raceLive[n] + " pts</li>")
            .join("")
        : "") +
        board
          .map((r) => "<li>" + r.name + " · " + r.pts + " · " + (r.ch || "") + "</li>")
          .join("");
      const h = document.createElement("p");
      h.className = "sb-hint";
      h.textContent = "Scoring: 80/part · 8/sec left · +80 running · +150 SH/SC in band · extras for lineset/vac/charge.";
      box.appendChild(h);
      box.appendChild(ol);
      const nickEl = box.querySelector("#sb-race-nick");
      if (nickEl) nickEl.onchange = () => { raceNick = nickEl.value.trim() || "Tech"; };
      const hostBtn = box.querySelector("#sb-race-host");
      const joinBtn = box.querySelector("#sb-race-join");
      if (hostBtn) hostBtn.onclick = () => hostRace();
      if (joinBtn) joinBtn.onclick = () => joinRace();
      return;
    }
    if (tab === "field") {
      const rec = document.createElement("div");
      rec.className = "sb-item system";
      rec.innerHTML = `<span class="ico">📋</span><div><strong>Recreate field job</strong><small>Set temps, dirty/clean coils, charge — match what you saw</small></div>`;
      rec.onclick = startRecreate;
      box.appendChild(rec);
      FIELD_JOBS.forEach((j) => {
        const el = document.createElement("div");
        el.className = "sb-item system";
        el.innerHTML = `<span class="ico">🔧</span><div><strong>${j.name}</strong><small>${j.complaint}</small></div>`;
        el.onclick = () => startMystery(j);
        box.appendChild(el);
      });
      return;
    }
    if (tab === "lab") {
      [
        { id: "iconnect-tu102", title: "TU-102 H-Block AC", sub: "Visible evap + condenser · sight glasses · receiver · accumulator · hermetic" },
        { id: "iconnect-tu601", title: "TU-601 Multi-head mini-split", sub: "Daikin dual-zone · cassette + linesets · R-410A only · 208/240V 20A" },
        { id: "txv-lab", title: "Master TXV superheat", sub: "Stem turns on the TU-102 · CW raises SH · CCW lowers SH · SC first" },
      ].forEach((L) => {
        const el = document.createElement("div");
        el.className = "sb-item system";
        el.innerHTML = `<span class="ico">🏫</span><div><strong>${L.title}</strong><small>${L.sub}</small></div>`;
        el.onclick = () => {
          if (L.id === "txv-lab") {
            const sys = SYSTEMS.find((s) => s.id === "iconnect-tu102");
            if (sys) loadTxvLab(sys);
            return;
          }
          const sys = SYSTEMS.find((s) => s.id === L.id);
          if (sys) loadLab(sys);
        };
        box.appendChild(el);
      });
      const yt = document.createElement("p");
      yt.className = "sb-hint";
      yt.innerHTML =
        'How-to videos (iConnect): <a href="https://www.youtube.com/watch?v=zxEDlowCQ4c" target="_blank" rel="noopener">H-block intro</a> · <a href="https://www.youtube.com/watch?v=zaTZ2biRINc" target="_blank" rel="noopener">TU-601 lessons</a> · <a href="https://www.youtube.com/@iconnecttraining" target="_blank" rel="noopener">YouTube channel</a>';
      box.appendChild(yt);
      return;
    }
    if (tab === "systems") {
      const brands = [];
      SYSTEMS.forEach((s) => {
        if (!brands.includes(s.brand)) brands.push(s.brand);
      });
      brands.forEach((brand) => {
        const head = document.createElement("div");
        head.className = "sb-brand-head";
        head.textContent = brand;
        box.appendChild(head);
        SYSTEMS.filter((s) => s.brand === brand).forEach((s) => {
          const el = document.createElement("div");
          el.className = "sb-item system";
          el.dataset.sys = s.id;
          const tag =
            s.type.indexOf("minisplit") >= 0
              ? "Mini-split"
              : s.type.indexOf("inverter") >= 0
                ? "Inverter"
                : s.type.indexOf("hp") >= 0
                  ? "Heat pump"
                  : "Split AC";
          el.innerHTML = `<span class="ico">🏷</span><div><strong>${s.name}</strong><small>${s.tons}t · ${s.ref} · SEER ${s.seer} · ${tag}</small></div>`;
          el.onclick = () => applySystem(s);
          box.appendChild(el);
        });
      });
      return;
    }
    const lead = ["compressor", "condenser", "metering", "evaporator"];
    COMPONENTS.filter((c) => {
      if (tab !== "all" && c.group !== tab) return false;
      return true;
    }).slice().sort((a, b) => {
      const ia = lead.indexOf(a.id);
      const ib = lead.indexOf(b.id);
      return (ia < 0 ? 50 : ia) - (ib < 0 ? 50 : ib);
    }).forEach((c) => appendPartRow(c, box));
  }

  function applyEquip(def) {
    if (!def) return;
    const eq = def.equip || def.id;
    if (eq === "gauges") {
      gaugesEquipped = true;
      const m = document.getElementById("sb-manifold");
      if (m) m.classList.add("on");
      openGaugeWin();
      document.getElementById("sb-status").textContent = "Manifold on the ports. Read SH and SC together.";
    } else if (eq === "dmm") {
      const panel = document.getElementById("sb-dmm");
      if (panel) panel.classList.add("on");
      updateDmm(simulate());
      document.getElementById("sb-status").textContent = "DMM on the cart. Never ohm a live circuit.";
    } else if (eq === "micron") {
      vac.gauge = true;
      document.getElementById("sb-status").textContent = "Micron gauge is on the cart. Put it on the system, not on the pump.";
      paintVac();
    } else if (eq === "vac") {
      vac.pump = true;
      document.getElementById("sb-status").textContent = "Vacuum pump is on the cart. Oil, cores, gauge, then pull.";
      paintVac();
    } else if (eq === "recovery") {
      document.getElementById("sb-status").textContent = "Recovery machine on the cart. 0 in Hg on the compound gauge is 0 psig — not microns. Recover before you open it. The vacuum pump is the other machine. 608.";
    } else if (eq === "sniffer") {
      document.getElementById("sb-status").textContent = "Sniffer in hand. 1–2 in/s, from below. Refrigerant is heavier than air.";
    } else if (eq === "soltest") {
      document.getElementById("sb-status").textContent = "Solenoid tester: magnetic pull-in. Power off preferred. Don't guess a stuck valve.";
    } else if (eq === "nitrogen") {
      requestNitrogen(function () {
        leak.nitrogen = true;
        document.getElementById("sb-status").textContent =
          "Dry N₂ on the cart. Regulator on. Purge while brazing; standing test for leaks. Never oxygen. Never shop air.";
      });
    } else if (eq === "vac" || def.id === "vacpump" || def.id === "micron") {
      leak.vac = true;
      document.getElementById("sb-status").textContent =
        "Vacuum on the system. Micron gauge at the ports. About 500 microns and a decay hold — dehydration after the braze, not 0 in Hg recovery. Then the cylinder.";
    } else if (def.id === "r410a" || def.id === "r22" || def.id === "r134a" || def.id === "r32") {
      const map = { r410a: "R-410A", r22: "R-22", r134a: "R-134a", r32: "R-32" };
      const want = map[def.id];
      if (activeSystem && activeSystem.ref && activeSystem.ref !== want) {
        document.getElementById("sb-status").textContent =
          "Wrong tank. " + activeSystem.brand + " nameplate is " + activeSystem.ref + ". Don't mix.";
        if (window.LtHubAiOn !== false) paintHubCoach("That's " + want + ". This pack is " + activeSystem.ref + ". Match the plate.");
        return;
      }
      refrigerant = want;
      chargePct = 100;
      const refSel = document.getElementById("sb-ref");
      if (refSel) refSel.value = want;
      const ch = document.getElementById("sb-charge");
      if (ch) ch.value = "100";
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = "100";
      document.getElementById("sb-status").textContent =
        want + " cylinder on the scale. Weigh-in. Then start and read SH/SC.";
    } else if (def.id === "lineset" || def.id === "copper" || def.id === "insulation") {
      document.getElementById("sb-status").textContent =
        "Line set in. Suction insulated. Nitrogen while brazing. Then electrical and evac.";
    }
  }

  function place(slotId, compId) {
    const def = COMPONENTS.find((c) => c.id === compId);
    if (!def) return false;
    const railDest = RAIL.some((s) => s.id === slotId);
    if (railDest && def.slot !== slotId) {
      const msg = def.name + " does not sit on that chip.";
      paintHubCoach(msg);
      const st0 = document.getElementById("sb-status");
      if (st0) st0.textContent = msg;
      return false;
    }
    const step = guidedOn ? currentBuildStep() : null;
    const ownRail = railDest && def.slot === slotId;
    if (guidedOn && step && !ownRail) {
      const onStep = slotId === step.slot;
      const okPart = step.accept.indexOf(compId) >= 0 || def.slot === step.slot;
      if (!onStep || !okPart) {
        const msg = !onStep
          ? "Wrong box. Glowing one is " + step.title + "."
          : "That's not " + step.title + ". " + step.hub;
        paintHubCoach(msg);
        const st1 = document.getElementById("sb-status");
        if (st1) st1.textContent = msg;
        return false;
      }
    }
    const onBoard = SLOTS.concat(RAIL).some((s) => s.id === (def.slot || slotId));
    const accepted = !!(step && step.accept && step.accept.indexOf(compId) >= 0 && (!slotId || slotId === step.slot));
    if (def.slot && slotId && def.slot !== slotId && !accepted) {
      const st = document.getElementById("sb-status");
      const home = SLOTS.concat(RAIL).find((s) => s.id === def.slot);
      if (st) {
        st.textContent = onBoard
          ? def.name + " belongs on " + ((home && home.label) || def.slot) + "."
          : def.name + " stays in the tray — click it to equip. Not a cycle slot.";
      }
      applyEquip(def);
      return false;
    }
    if (!onBoard) {
      if (def.slot) placed[def.slot] = def.id;
      applyEquip(def);
      const st = document.getElementById("sb-status");
      if (st) st.textContent = (def.name || compId) + " on the cart / loop (no extra box).";
      if (challenge) checkChallenge();
      return true;
    }
    const dest = accepted ? slotId || def.slot : def.slot || slotId;
    if (dest) {
      placed[dest] = compId;
      activeSystem = null;
      if (window.LtSfx && window.LtSfx.drop) window.LtSfx.drop();
      if (window.LtHaptic) window.LtHaptic.land();
      refreshSlots();
      updateSysBanner();
      if (challenge) checkChallenge();
      if (requiredComplete() && onXp) {
        if (!host.dataset.loopXp) {
          host.dataset.loopXp = "1";
          onXp(25);
        }
      }
    }
    applyEquip(def);
    if (dest && RAIL.some((s) => s.id === dest) && !def.equip) {
      const st = document.getElementById("sb-status");
      const lab = (RAIL.find((s) => s.id === dest) || {}).label || dest;
      if (st) st.textContent = def.name + " installed · " + lab + ".";
    }
    if (dest) {
      const before = guidedStep;
      syncGuidedStep();
      layoutSlots();
      if (guidedOn && guidedStep > before) {
        const nxt = currentBuildStep();
        paintHubCoach(nxt ? "Seated. Next: " + nxt.title + ". " + nxt.hub : null);
      } else if (guidedOn && currentBuildStep() && currentBuildStep().slot === dest) {
        paintHubCoach();
      } else {
        paintHubCoach();
      }
    }
    paintVac();
    return !!dest;
  }

  function refreshSlots() {
    document.querySelectorAll(".sb-slot").forEach((el) => {
      const id = el.dataset.slot;
      const cid = placed[id];
      el.classList.toggle("filled", !!cid);
      el.classList.toggle("required", ["compressor", "condenser", "metering", "evaporator"].includes(id));
      if (cid) {
        const def = COMPONENTS.find((c) => c.id === cid);
        if (def) el.innerHTML = `${partThumb(def)}<strong>${def.name}</strong><button class="rm" data-rm="${id}">×</button>`;
        else el.innerHTML = `<span class="empty">Unknown part</span>`;
      } else {
        const slot = SLOTS.concat(RAIL).find((s) => s.id === id);
        const role = CORE_ROLE[id];
        el.innerHTML =
          `<span class="empty">${slot ? slot.label : id}</span>` +
          (role ? `<small class="sb-role">${role}</small>` : "");
      }
    });
    const prog = document.getElementById("sb-progress");
    if (prog) {
      const n = ["compressor", "condenser", "metering", "evaporator"].filter((s) => placed[s]).length;
      prog.textContent = "Core cycle: " + n + " / 4" + (running ? " · running" : "");
    }
    document.querySelectorAll(".rm").forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        delete placed[b.dataset.rm];
        syncGuidedStep();
        layoutSlots();
        paintHubCoach("You pulled a part. Back up the sequence — drop what I asked.");
        if (!requiredComplete()) running = false;
      };
    });
    paintCoils();
  }

  function isPhoneLab() {
    return typeof window.matchMedia === "function" && window.matchMedia("(max-width: 700px)").matches;
  }

  function slotXY(s) {
    if (!isPhoneLab()) return { x: s.x, y: s.y };
    const phone = {
      compressor: { x: 0.28, y: 0.50 },
      condenser: { x: 0.52, y: 0.16 },
      filter: { x: 0.68, y: 0.34 },
      metering: { x: 0.78, y: 0.52 },
      evaporator: { x: 0.52, y: 0.84 },
      accumulator: { x: 0.34, y: 0.70 },
      disconnect: { x: 0.12, y: 0.14 },
      contactor: { x: 0.12, y: 0.38 },
      capacitor: { x: 0.12, y: 0.62 },
      transformer: { x: 0.12, y: 0.86 },
      thermostat: { x: 0.88, y: 0.14 },
      gauges: { x: 0.88, y: 0.38 },
      copper: { x: 0.38, y: 0.32 },
      nitrogen: { x: 0.88, y: 0.62 },
      vacpump: { x: 0.88, y: 0.86 },
      chargecan: { x: 0.70, y: 0.68 },
      receiver: { x: 0.62, y: 0.32 },
      sightglass: { x: 0.78, y: 0.18 },
      revvalve: { x: 0.34, y: 0.32 },
      solenoid: { x: 0.34, y: 0.12 },
      hpsw: { x: 0.22, y: 0.12 },
      lpsw: { x: 0.22, y: 0.32 },
      float: { x: 0.22, y: 0.90 },
      odfan: { x: 0.50, y: 0.06 },
      blower: { x: 0.64, y: 0.92 },
      micron: { x: 0.92, y: 0.74 },
      dmm: { x: 0.08, y: 0.74 },
    };
    return phone[s.id] || { x: s.x, y: s.y };
  }

  function layoutSlots() {
    const wrap = document.getElementById("sb-slots");
    let rail = document.getElementById("sb-rail");
    if (!wrap) return;
    if (!rail) {
      const main = wrap.closest(".sb-main") || document.querySelector("#sandbox-root .sb-main");
      if (main) {
        rail = document.createElement("div");
        rail.className = "sb-rail";
        rail.id = "sb-rail";
        rail.setAttribute("aria-label", "More parts");
        const stage = main.querySelector(".sb-stage-wrap");
        if (stage && stage.parentNode === main) stage.insertAdjacentElement("afterend", rail);
        else main.appendChild(rail);
      }
    }
    wrap.innerHTML = "";
    if (rail) rail.innerHTML = "";
    SLOTS.concat(RAIL).forEach((s) => {
      const cell = {
        copper: [1, 1],
        condenser: [1, 2],
        filter: [1, 3],
        compressor: [2, 1],
        accumulator: [2, 2],
        metering: [2, 3],
        evaporator: [3, 2],
        chargecan: [3, 3],
      }[s.id];
      const onRail = !!s.rail || benchSlot(s.id) || !cell;
      const parent = onRail ? rail : wrap;
      if (!parent) return;
      const stepIdx = BUILD_STEPS.findIndex((b) => b.slot === s.id);
      const seated = !!placed[s.id];
      if (!onRail && !seated && !s.core && !guidedOn && jobMode === "mystery") return;
      const pos = onRail ? null : (slotXY(s) || { x: s.x, y: s.y });
      const el = document.createElement("div");
      el.className = "sb-slot" + (s.core ? " core" : "") + (onRail ? " sb-rail-slot" : "");
      el.dataset.slot = s.id;
      if (!onRail && pos) {
        el.style.gridColumn = String(cell[1]);
        el.style.gridRow = String(cell[0]);
      }
      if (guidedOn && stepIdx === guidedStep && !placed[s.id]) el.classList.add("hub-next", "magnet");
      el.addEventListener("dragover", (e) => {
        e.preventDefault();
        el.classList.add("over");
      });
      el.addEventListener("dragleave", () => el.classList.remove("over"));
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        el.classList.remove("over");
        const id = e.dataTransfer.getData("text/plain");
        if (id) place(s.id, id);
      });
      el.addEventListener("click", function () {
        if (!inHand) {
          paintHubCoach(onRail ? "Pick the matching part, then tap this chip." : "Pick a part from the tray. Tap it, then tap this box.");
          return;
        }
        const id = inHand.id;
        if (place(s.id, id)) {
          inHand = null;
          document.querySelectorAll(".sb-item.in-hand").forEach((n) => n.classList.remove("in-hand"));
          paintInHand();
        }
      });
      parent.appendChild(el);
      if (onRail && el.classList.contains("hub-next")) {
        requestAnimationFrame(function () {
          if (el.scrollIntoView) el.scrollIntoView({ inline: "center", block: "nearest" });
        });
      }
    });
    refreshSlots();
  }

  function paintDefrostDiagram(sim) {
    const root = document.getElementById("sb-defrost-d");
    if (!root) return;
    const on = (id, live) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("live", !!live);
    };
    const set = (id, t) => {
      const el = document.getElementById(id);
      if (el) el.textContent = t;
    };
    const run = !!(sim && sim.running);
    const df = !!(sim && sim.defrosting);
    const heat = !!(sim && sim.hpMode === "heat" && !df);
    const cool = !!(sim && sim.hpMode === "cool" && !df);
    const fail = fault === "defrost_fail";
    on("df-r", run);
    on("df-stat", run);
    on("df-board", run);
    on("df-coil", run && (heat || df || fail));
    on("df-amb", run && outdoorF < 42);
    on("df-rv", run && (cool || df));
    on("df-fan", run && !df);
    on("df-cc", run);
    on("df-aux", run && (df || frost > 70));
    set("df-board-mode", !run ? "OFF" : df ? "DEFROST" : heat ? "HEAT" : "COOL");
    set("df-board-led", !run ? "LED off" : fail ? "NO DEFROST FAULT" : df ? "LED ON · fan off" : "standby");
    set("df-rv-st", run && (cool || df) ? "ENERGIZED (O)" : "de-energized");
    set("df-fan-st", !run ? "off" : df ? "OFF for defrost" : "ON");
    set("df-cc-st", run ? "Y pulled in" : "open");
    set("df-aux-st", run && (df || frost > 70) ? "W ON" : "off");
  }

  function paintPTTable() {
    const box = document.getElementById("pt-table");
    if (!box) return;
    const temps = [-20, 0, 20, 32, 40, 45, 50, 70, 80, 95, 105, 115];
    box.innerHTML =
      "<div class='pt-row pt-head'><span>°F sat</span><span>psig</span></div>" +
      temps
        .map(function (t) {
          const p = satP(refrigerant, t);
          return "<div class='pt-row' data-t='" + t + "'><span>" + t + "°</span><span>" + p.toFixed(1) + "</span></div>";
        })
        .join("");
    const lab = document.getElementById("pt-ref-label");
    if (lab) lab.textContent = refrigerant;
  }

  function paintPTFromPsig() {
    const el = document.getElementById("pt-psig");
    if (!el) return;
    const p = +el.value;
    const t = satT(refrigerant, p);
    const pv = document.getElementById("pt-psig-v");
    const sat = document.getElementById("pt-sat");
    const tf = document.getElementById("pt-tf");
    const tv = document.getElementById("pt-tf-v");
    if (pv) pv.textContent = p + " psig";
    if (sat) sat.textContent = t.toFixed(1) + " °F start of boiling (" + refrigerant + "). Subcooling uses the start of boiling. Superheat uses the dew point." + (refrigerant === "R-410A" ? " — blend, don't swap them." : " — one refrigerant, one boiling temperature.");
    if (tf) tf.value = String(Math.round(Math.max(-40, Math.min(120, t))));
    if (tv) tv.textContent = Math.round(t) + "°F";
    highlightPT(simulate());
  }

  function paintPTFromTemp() {
    const el = document.getElementById("pt-tf");
    if (!el) return;
    const t = +el.value;
    const p = satP(refrigerant, t);
    const tv = document.getElementById("pt-tf-v");
    const ps = document.getElementById("pt-psig");
    const pv = document.getElementById("pt-psig-v");
    const sat = document.getElementById("pt-sat");
    if (tv) tv.textContent = t + "°F";
    if (ps) ps.value = String(Math.round(Math.max(0, Math.min(600, p))));
    if (pv) pv.textContent = p.toFixed(1) + " psig";
    if (sat) sat.textContent = t + " °F start of boiling = " + p.toFixed(1) + " psig (" + refrigerant + "). Subcooling uses the start of boiling. Superheat uses the dew point..";
    highlightPT(simulate());
  }

  function highlightPT(sim) {
    const live = document.getElementById("pt-live");
    if (live) {
      live.textContent =
        sim && sim.running
          ? refrigerant +
            " · suction " +
            sim.pLow.toFixed(0) +
            " psig → " +
            sim.tSatLow.toFixed(0) +
            "°F dew · liquid " +
            sim.pHigh.toFixed(0) +
            " psig → " +
            sim.tSatHigh.toFixed(0) +
            "°F start of boiling · SH " +
            sim.sh.toFixed(0) +
            " · SC " +
            sim.sc.toFixed(0)
          : refrigerant + " · HVAC Buddy style P/T. Slide pressure or sat temp. Training chart — OEM still wins.";
    }
    const tLow = sim && sim.running ? sim.tSatLow : null;
    const slider = document.getElementById("pt-psig");
    const focus = slider ? +slider.value : tLow;
    let bestT = null;
    let bestD = Infinity;
    document.querySelectorAll("#pt-table .pt-row[data-t]").forEach(function (row) {
      const t = +row.getAttribute("data-t");
      if (focus == null || !isFinite(focus)) return;
      const d = Math.abs(satP(refrigerant, t) - focus);
      if (d < bestD) {
        bestD = d;
        bestT = t;
      }
    });
    document.querySelectorAll("#pt-table .pt-row[data-t]").forEach(function (row) {
      const t = +row.getAttribute("data-t");
      row.classList.toggle("on", bestT != null && t === bestT);
    });
  }

  function updateGauges(sim) {
    if (!document.getElementById("g-plow")) return;
    sim = sim || { running: false, status: "—" };
    const liveP = typeof sim.pHigh === "number" && sim.pHigh > 0 && (sim.running || sim.static || sim.trip);
    const liveSH = !!(sim.running || sim.trip);
    const fmt = (n, d = 0) => (liveP && typeof n === "number" ? n.toFixed(d) : "—");
    document.getElementById("g-plow").textContent = fmt(sim.pLow, 1);
    document.getElementById("g-phigh").textContent = fmt(sim.pHigh, 1);
    document.getElementById("g-tsatl").textContent = liveP ? "dew " + sim.tSatLow.toFixed(0) + " °F" : "dew — °F";
    document.getElementById("g-tsath").textContent = liveP ? "start of boiling " + sim.tSatHigh.toFixed(0) + " °F" : "start of boiling — °F";
    document.getElementById("g-tsuc").textContent = liveSH ? sim.tSuction.toFixed(0) + " °F" : "—";
    document.getElementById("g-tliq").textContent = liveSH ? sim.tLiquid.toFixed(0) + " °F" : "—";
    document.getElementById("g-sh").textContent = liveSH ? sim.sh.toFixed(0) + " °F" : "—";
    document.getElementById("g-sc").textContent = liveSH ? sim.sc.toFixed(0) + " °F" : "—";
    const shEl = document.getElementById("g-sh");
    const scEl = document.getElementById("g-sc");
    if (shEl) shEl.classList.toggle("out", !!(sim.running && sim.shOk === false));
    if (shEl) shEl.classList.toggle("in", !!(sim.running && sim.shOk));
    if (scEl) scEl.classList.toggle("out", !!(sim.running && sim.scOk === false));
    if (scEl) scEl.classList.toggle("in", !!(sim.running && sim.scOk));
    const tgt = document.getElementById("g-tgt");
    const dt = document.getElementById("g-dt");
    const gl = document.getElementById("g-glass");
    const fp = document.getElementById("sb-fp");
    if (tgt) tgt.textContent = liveSH ? sim.tgtSH + " / " + sim.tgtSC + " °F" : "—";
    if (dt) dt.textContent = liveSH ? sim.deltaT.toFixed(0) + " °F" : "—";
    if (gl) gl.textContent = liveP ? (sim.drierDrop ? sim.glass + " · drier −" + sim.drierDrop + "°F" : sim.glass) : "—";
    if (fp) fp.textContent = sim.fp || "HUB: close the loop, start the compressor, then read SH and SC together.";
    paintDefrostDiagram(sim);
    const cap = document.getElementById("g-cap");
    const cop = document.getElementById("g-cop");
    const amps = document.getElementById("g-amps");
    if (cap) cap.textContent = sim.running ? sim.tons.toFixed(1) + " t · " + sim.btuh.toLocaleString() + " Btuh" : "—";
    if (cop) cop.textContent = sim.running ? sim.cop.toFixed(2) : "—";
    if (amps) amps.textContent = sim.running ? sim.amps.toFixed(1) + " A" : "—";
    const pvL = document.getElementById("pv-l");
    const pvH = document.getElementById("pv-h");
    const pvSh = document.getElementById("pv-sh");
    const pvSc = document.getElementById("pv-sc");
    if (pvL) pvL.textContent = fmt(sim.pLow, 0);
    if (pvH) pvH.textContent = fmt(sim.pHigh, 0);
    if (pvSh) pvSh.textContent = liveSH ? sim.sh.toFixed(0) : "—";
    if (pvSc) pvSc.textContent = liveSH ? sim.sc.toFixed(0) : "—";
    const pvSup = document.getElementById("pv-sup");
    if (pvSup) pvSup.textContent = sim.supplyF != null ? String(Math.round(sim.supplyF)) : "—";
    if (window.ShopBg && sim.running) {
      window.ShopBg.trend({ pHigh: sim.pHigh, pLow: sim.pLow, sh: sim.sh, sc: sim.sc });
    }
    highlightPT(sim);
    const st = document.getElementById("sb-status");
    if (st) st.textContent = sim.status || "";
    const ml = document.getElementById("man-low");
    const mh = document.getElementById("man-high");
    if (ml) ml.textContent = liveP ? String(Math.round(sim.pLow)) : "0";
    if (mh) mh.textContent = liveP ? String(Math.round(sim.pHigh)) : "0";
    if (window.ManifoldSet) window.ManifoldSet.paint(sim, refrigerant);
    const runBtn = document.getElementById("sb-run");
    if (runBtn) runBtn.textContent = running ? "Stop compressor" : "Start compressor";
    updateDmm(sim);
    drawPH(sim);
    updateBom();
    paintDxTs(sim);
  }

  function paintTrendSpark(spark) {
    if (!spark || !spark.hi || spark.hi.length < 2) return;
    const canvases = ["sb-trend", "sb-trend-desk"];
    canvases.forEach(function (id) {
      const c = document.getElementById(id);
      if (!c || !c.getContext) return;
      const ctx = c.getContext("2d");
      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);
      const hi = spark.hi;
      const lo = spark.lo;
      let max = 1;
      let min = 0;
      for (let i = 0; i < hi.length; i++) {
        if (hi[i] > max) max = hi[i];
        if (lo[i] < min) min = lo[i];
      }
      max = Math.max(max, 50);
      const span = max - min || 1;
      function line(arr, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < arr.length; i++) {
          const x = (i / (arr.length - 1)) * (w - 2) + 1;
          const y = h - 2 - ((arr[i] - min) / span) * (h - 4);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      line(hi, "#ce0034");
      line(lo, "#7ec8d3");
    });
    const cap = document.getElementById("sb-trend-cap");
    if (cap) {
      cap.textContent = spark.walking
        ? "Spread collapsing — pressures walking together. Bleeding 4-way until proven otherwise."
        : "Trend runs in the background. Red = high side. Teal = low side. Watch the spread.";
    }
  }
  if (typeof window !== "undefined") window.__shopTrend = paintTrendSpark;

  function paintDxTs(sim) {
    const ol = document.getElementById("sb-ts");
    if (!ol) return;
    sim = sim || {};
    const steps = [
      { n: 1, title: "Indoor airflow", ok: fault !== "blower_fail" && fault !== "dirty_evap" && coilEvap === "clean", say: "Filter, A-coil, blower before you add gas." },
      { n: 2, title: "Outdoor airflow", ok: fault !== "od_fan" && fault !== "dirty_cond" && coilCond === "clean", say: "Dirty condenser: high head, SC about normal — not an overcharge. Don't add gas." },
      { n: 3, title: "Compressor running", ok: !!(sim.running && !sim.trip), say: sim.trip === "hpc" ? "HPC cut out. Fix the head before you reset." : sim.trip === "lpc" ? "LPC cut out. Prove airflow and restriction." : "Start it. Static isn't a diagnosis." },
      { n: 4, title: "Superheat", ok: !!sim.shOk, say: !sim.running ? "Need a running system." : sim.sh > 20 ? "High SH — starved coil (leak, restriction, TXV closed)." : sim.sh < 5 ? "Low SH — flooding or low airflow." : "SH in band." },
      { n: 5, title: "Subcooling", ok: !!sim.scOk, say: !sim.running ? "Need a running system." : sim.sc > 16 ? "High SC — overcharge or restriction." : sim.sc < 4 ? "Low SC — leak or non-condensables." : "SC in band." },
      { n: 6, title: "SH + SC together", ok: !!(sim.shOk && sim.scOk && fault === "none"), say: sim.fp || "Never chase one number." },
    ];
    ol.innerHTML = steps.map((s) =>
      "<li class=\"" + (s.ok ? "ok" : "wait") + "\"><b>" + s.n + "</b><div><strong>" + s.title + "</strong><p>" + s.say + "</p></div></li>"
    ).join("");
  }

  function updateBom() {
    const ul = document.getElementById("sb-bom");
    if (!ul) return;
    const ids = Object.values(placed);
    if (!ids.length) {
      ul.innerHTML = "<li>Empty board</li>";
      return;
    }
    ul.innerHTML = ids
      .map((id) => {
        const c = COMPONENTS.find((x) => x.id === id);
        return "<li>" + (c ? c.name : id) + (c && c.desc ? " <small>" + c.desc + "</small>" : "") + "</li>";
      })
      .join("");
  }

  function drawPH(sim) {
    const c = document.getElementById("sb-ph");
    if (!c) return;
    const g = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    g.clearRect(0, 0, w, h);
    g.fillStyle = "#0c141c";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.strokeRect(0.5, 0.5, w - 1, h - 1);
    // dome
    g.beginPath();
    g.strokeStyle = "rgba(255,213,74,0.55)";
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = 24 + t * (w - 48);
      const y = h - 18 - Math.sin(t * Math.PI) * (h * 0.62);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = "rgba(242,245,248,0.45)";
    g.font = "9px sans-serif";
    g.fillText("h →", w - 28, h - 6);
    g.save();
    g.translate(10, h / 2);
    g.rotate(-Math.PI / 2);
    g.fillText("P", 0, 0);
    g.restore();
    if (!sim.running) {
      g.fillStyle = "#8b98a5";
      g.fillText("Start compressor to plot 1-2-3-4", 40, h / 2);
      return;
    }
    const pMin = 0;
    const pMax = Math.max(400, sim.pHigh * 1.15);
    const yP = (p) => h - 16 - ((p - pMin) / (pMax - pMin)) * (h - 32);
    const xH = (n) => 28 + n * (w - 56); // 0-1 enthalpy param
    // 1 suction vapor, 2 discharge, 3 liquid, 4 after TXV
    const pts = [
      { n: 1, x: 0.62, p: sim.pLow },
      { n: 2, x: 0.88, p: sim.pHigh },
      { n: 3, x: 0.28, p: sim.pHigh },
      { n: 4, x: 0.32, p: sim.pLow },
    ];
    g.strokeStyle = "#CE0034";
    g.lineWidth = 2;
    g.beginPath();
    pts.concat([pts[0]]).forEach((pt, i) => {
      const x = xH(pt.x);
      const y = yP(pt.p);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.stroke();
    pts.forEach((pt) => {
      const x = xH(pt.x);
      const y = yP(pt.p);
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(x, y, 4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ffd54a";
      g.fillText(String(pt.n), x + 6, y - 6);
    });
  }

  function elecReady() {
    return !!(placed.disconnect && placed.contactor && placed.capacitor && placed.transformer && placed.thermostat);
  }

  function updateDmm(sim) {
    const valEl = document.getElementById("dmm-val");
    const unitEl = document.getElementById("dmm-unit");
    const noteEl = document.getElementById("dmm-note");
    if (!valEl) return;
    const has = (id) => !!placed[id];
    const live = sim.running && has("disconnect") && has("contactor") && has("thermostat") && has("transformer");
    let val = "OL";
    let unit = "VAC";
    let note = "Drop electrical parts on the left column, then probe.";
    const mode = dmmMode;
    const probe = dmmProbe;

    if (mode === "vac") {
      unit = "VAC";
      if (probe === "l1l2") {
        val = has("disconnect") ? "240.2" : "240.2";
        note = has("disconnect") ? "Line voltage present at disconnect." : "You can still read line ahead of a missing disconnect — install one before load.";
      } else if (probe === "load") {
        val = has("disconnect") ? "239.8" : "0.00";
        note = has("disconnect") ? "Load side hot." : "No disconnect — load is dead. Do not jump it.";
      } else if (probe === "coil") {
        val = live ? "26.4" : has("transformer") && has("thermostat") ? "0.12" : "0.00";
        note = live ? "Y is calling. Coil pulled in." : "No 24V call — check R/C, stat, and transformer.";
      } else if (probe === "ob") {
        const energized = (hpMode === "cool"); // training: O energized in cool (most brands)
        val = live && has("revvalve") ? (energized ? "26.1" : "0.08") : live ? "0.00" : "0.00";
        note = !has("revvalve")
          ? "No reversing valve on the board — drop a 4-way for a heat pump."
          : fault === "rv_stuck_heat" && hpMode === "cool"
            ? "24V at the coil, slider didn't move. That's a stuck valve, not a dead solenoid."
            : energized
              ? "O energized (most brands shift in COOL). Listen for the click. Rheem/Ruud often use B in heat."
              : "O/B de-energized. Call the other mode and watch pressures swap.";
      } else if (probe === "rc") {
        val = has("transformer") ? "27.1" : "0.00";
        note = has("transformer") ? "Control transformer healthy." : "No transformer — C and R are dead.";
      } else {
        val = "—";
        note = "Switch function to AAC for compressor amps, OHMS for windings/cap.";
      }
    } else if (mode === "aac") {
      unit = "A";
      if (probe === "comp") {
        if (!has("capacitor") && live) {
          val = "0.0";
          note = "Open/weak cap — compressor will not start. Hum, no amps.";
        } else if (live) {
          val = (sim.amps ? sim.amps.toFixed(1) : "13.6");
          note = capBad
            ? "Amps high / start is ugly. Cap µF first."
            : "Running load amps. Clamp one leg only.";
        } else {
          val = "0.00";
          note = "Compressor not running. Get a Y call first.";
        }
      } else {
        val = "0.00";
        note = "Clamp the compressor lead (black) — not both L1 and L2.";
      }
    } else if (mode === "ohm") {
      unit = "Ω";
      if (sim.running) {
        val = "OL";
        note = "Never ohm a live circuit. Stop the compressor and lock it out.";
      } else if (probe === "cap") {
        val = has("capacitor") ? (capBad ? "8.1" : "35.4") : "OL";
        note = !has("capacitor")
          ? "No capacitor in the circuit."
          : capBad
            ? "µF is low vs nameplate. Replace the cap. Lock out first."
            : "HERM–C in the training band. Still confirm the can vs OEM.";
      } else if (probe === "wind") {
        val = has("compressor") ? "1.8" : "OL";
        note = has("compressor") ? "Common–run winding in spec. Compare C-S and C-R." : "No compressor to meg.";
      } else {
        val = "OL";
        note = "Use windings or capacitor probe in ohms. Lockout first.";
      }
    } else {
      unit = "CONT";
      if (probe === "coil") {
        val = has("contactor") ? "BEEP" : "OL";
        note = has("contactor") ? "Coil circuit closed." : "No contactor — open.";
      } else if (probe === "wind") {
        val = has("compressor") ? "BEEP" : "OL";
        note = has("compressor") ? "Winding continuity good. Still check to ground." : "Nothing to ring out.";
      } else {
        val = "OL";
        note = "Continuity is for coils and windings with power OFF.";
      }
    }
    valEl.textContent = val;
    unitEl.textContent = unit;
    noteEl.textContent = note;
    if (!elecReady() && sim.running) {
      const st = document.getElementById("sb-status");
      if (st && requiredComplete()) st.textContent = "Running on refrigerant loop — finish electrical (disconnect, contactor, cap, 24V, stat) for a legal start.";
    }
  }

  let staticLayer = null;
  let staticKey = "";
  let pxPath = [];
  let gaugeAcc = 0;

  function rebuildStatic(w, h, dpr) {
    staticKey = w + "x" + h + "@" + dpr;
    staticLayer = document.createElement("canvas");
    staticLayer.width = Math.max(1, Math.floor(w * dpr));
    staticLayer.height = Math.max(1, Math.floor(h * dpr));
    const s = staticLayer.getContext("2d");
    s.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = s.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0e1620");
    g.addColorStop(1, "#121c28");
    s.fillStyle = g;
    s.fillRect(0, 0, w, h);
    s.strokeStyle = "rgba(45,212,191,0.05)";
    s.lineWidth = 1;
    s.beginPath();
    for (let x = 0; x < w; x += 40) {
      s.moveTo(x, 0);
      s.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 40) {
      s.moveTo(0, y);
      s.lineTo(w, y);
    }
    s.stroke();
    pxPath = flowPath().map(function (p) {
      return [p[0] * w, p[1] * h];
    });
    s.lineWidth = 14;
    s.lineCap = "round";
    s.lineJoin = "round";
    s.strokeStyle = "#2a3644";
    s.beginPath();
    pxPath.forEach(function (p, i) {
      if (i === 0) s.moveTo(p[0], p[1]);
      else s.lineTo(p[0], p[1]);
    });
    s.closePath();
    s.stroke();
    s.fillStyle = "rgba(139,154,171,0.85)";
    s.font = "bold 13px IBM Plex Sans, sans-serif";
    s.fillText("Four-part vapor-compression cycle", 16, 22);
    s.font = "11px IBM Plex Sans, sans-serif";
    s.fillStyle = "#f07178";
    s.fillText("DISCHARGE", w * 0.28, h * 0.28);
    s.fillStyle = "#c44e52";
    s.fillText("LIQUID", w * 0.62, h * 0.28);
    s.fillStyle = "#7ec8d3";
    s.fillText("EXPANSION", w * 0.72, h * 0.68);
    s.fillStyle = "#2dd4bf";
    s.fillText("SUCTION", w * 0.26, h * 0.72);
  }

  function drawArrow(x, y, ang) {
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    ctx.beginPath();
    ctx.moveTo(x + 8 * c, y + 8 * s);
    ctx.lineTo(x - 5 * c + 5 * s, y - 5 * s - 5 * c);
    ctx.lineTo(x - 5 * c - 5 * s, y - 5 * s + 5 * c);
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const w = canvas.clientWidth || canvas.parentElement && canvas.parentElement.clientWidth || window.innerWidth || 640;
    const h = canvas.clientHeight || canvas.parentElement && canvas.parentElement.clientHeight || Math.max(280, Math.floor((window.innerHeight || 700) * 0.45));
    const bw = Math.max(1, Math.floor(w * dpr));
    const bh = Math.max(1, Math.floor(h * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      staticKey = "";
    }
    const key = w + "x" + h + "@" + dpr;
    if (!staticLayer || staticKey !== key) rebuildStatic(w, h, dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, bw, bh);
    ctx.drawImage(staticLayer, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (fxShake > 0.4) ctx.translate((Math.random() - 0.5) * fxShake, (Math.random() - 0.5) * fxShake);

    const segs = pxPath.length;
    if (requiredComplete() && segs) {
      ctx.lineCap = "round";
      ctx.lineWidth = 8;
      ctx.globalAlpha = running ? 0.9 : 0.4;
      for (let i = 0; i < segs; i++) {
        const a = pxPath[i];
        const b = pxPath[(i + 1) % segs];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.strokeStyle = running ? PHASE_COLOR[phaseAt(i / segs)] : "#3a4a5c";
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    if (running && segs) {
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      for (let i = 0; i < segs; i += 3) {
        const a = pxPath[i];
        const b = pxPath[(i + 1) % segs];
        drawArrow((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, Math.atan2(b[1] - a[1], b[0] - a[0]));
      }
    }

    const n = particles.length;
    for (let i = 0; i < n; i++) {
      const p = particles[i];
      const pt = lerpPath(p.t);
      ctx.fillStyle = PHASE_COLOR[phaseAt(p.t)];
      ctx.beginPath();
      ctx.arc(pt[0] * w, pt[1] * h, p.r, 0, 6.283185);
      ctx.fill();
    }

    if (running && requiredComplete() && pxPath[0]) {
      const cx = pxPath[0][0];
      const cy = pxPath[0][1];
      const pulse = 10 + Math.sin((animT || 0) / 120) * 4;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(206,0,52,0.55)";
      ctx.lineWidth = 2;
      ctx.arc(cx, cy, pulse, 0, 6.283185);
      ctx.stroke();
      ctx.fillStyle = "#CE0034";
      ctx.font = "bold 11px IBM Plex Sans, sans-serif";
      ctx.fillText("COMP ON", cx - 24, cy - 16);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((animT || 0) / 70);
      ctx.strokeStyle = "rgba(232,196,80,0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 9);
      ctx.stroke();
      ctx.restore();
    }
    if (frost > 30) {
      ctx.fillStyle = "rgba(126,200,211," + Math.min(0.28, frost / 400) + ")";
      ctx.fillRect(0, h * 0.55, w, h * 0.45);
    }
    if (fxFlash > 0.02) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(206,0,52," + (fxFlash * 0.45) + ")";
      ctx.fillRect(0, 0, w, h);
    }
  }

  let lastTick = 0;
  let lastFrostUi = -1;

  function seedFlow() {
    particles = [];
    for (let i = 0; i < 14; i++) {
      particles.push({
        t: i / 14,
        r: 3.4 + (i % 2),
        speed: 0.24 + (i % 4) * 0.04,
      });
    }
  }

  let fxShake = 0;
  let fxFlash = 0;
  let shopBedNodes = null;
  function shopHeard() {
    return !(window.LtSfx && window.LtSfx.isMuted && window.LtSfx.isMuted());
  }
  function shopBed() {
    if (shopBedNodes) return shopBedNodes;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const a = new AC();
    const master = a.createGain();
    master.gain.value = 0;
    master.connect(a.destination);
    const hum = a.createOscillator();
    hum.type = "sawtooth";
    hum.frequency.value = 58;
    const lp = a.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 160;
    const humG = a.createGain();
    humG.gain.value = 0.22;
    hum.connect(lp).connect(humG).connect(master);
    hum.start();
    const secs = 1;
    const buf = a.createBuffer(1, a.sampleRate * secs, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = a.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = a.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 520;
    bp.Q.value = 0.6;
    const nG = a.createGain();
    nG.gain.value = 0.08;
    noise.connect(bp).connect(nG).connect(master);
    noise.start();
    shopBedNodes = { a: a, master: master, hum: hum };
    return shopBedNodes;
  }
  function shopLevel(on) {
    const b = shopBed();
    if (!b) return;
    if (b.a.state === "suspended") b.a.resume();
    const target = on && shopHeard() ? 0.42 : 0;
    b.master.gain.setTargetAtTime(target, b.a.currentTime, on ? 0.06 : 0.14);
  }
  function shopDrive(sim) {
    const b = shopBedNodes;
    if (!b || !running) return;
    const head = sim && sim.pHigh ? sim.pHigh : 280;
    b.hum.frequency.setTargetAtTime(46 + Math.min(36, head / 16), b.a.currentTime, 0.25);
    if (!shopHeard()) b.master.gain.setTargetAtTime(0, b.a.currentTime, 0.05);
  }

  function setCompressor(on) {
    if (on && guidedOn && !(placed.copper && placed.vacpump && placed.chargecan)) {
      running = false;
      paintHubCoach("Line set, vacuum, and the right cylinder first. Then we start it.");
      const st = document.getElementById("sb-status");
      if (st) st.textContent = "Commission first: lineset → N₂ → evac ≤500µ → weigh-in.";
      return;
    }
    running = !!on;
    if (on) cutOut = null;
    if (on && window.ShopBg) window.ShopBg.reset();
    if (running && requiredComplete()) seedFlow();
    else particles = [];
    const btn = document.getElementById("sb-run");
    if (btn) btn.textContent = running ? "Stop compressor" : "Start compressor";
    if (window.LtSfx) {
      if (running) window.LtSfx.compressor();
      else window.LtSfx.compressorOff();
    }
    shopLevel(running && requiredComplete());
    fxShake = running ? 12 : 5;
    if (window.LtHaptic) {
      if (running) window.LtHaptic.kick();
      else window.LtHaptic.stop();
    }
  }

  function tick(now) {
    const dt = lastTick ? Math.min(0.05, (now - lastTick) / 1000) : 0.016;
    lastTick = now;
    animT = now;
    if (typeof document !== "undefined" && document.hidden) {
      raf = requestAnimationFrame(tick);
      return;
    }
    try {
      if (running && requiredComplete()) {
        if (hpMode === "heat" && outdoorF < 42 && !defrosting && fault !== "stuck_defrost") {
          const rate = fault === "defrost_fail" ? 8 : 3.2;
          frost = Math.min(100, frost + rate * dt);
        }
        if (defrosting && fault !== "stuck_defrost") {
          frost = Math.max(0, frost - 18 * dt);
          if (frost <= 4) {
            defrosting = false;
            hpMode = "heat";
            const m = document.getElementById("sb-mode");
            if (m) m.value = "heat";
          }
        }
        if (fault === "stuck_defrost") {
          defrosting = true;
          frost = Math.max(0, frost - 6 * dt);
        }
        if (fault === "defrost_fail") defrosting = false;
        if (!particles.length) seedFlow();
        for (const p of particles) {
          p.t += p.speed * dt;
          if (p.t >= 1) p.t -= Math.floor(p.t);
        }
      } else if (!running) {
        particles = [];
      }
      gaugeAcc += dt;
      if (gaugeAcc >= 0.12 || !running) {
        gaugeAcc = 0;
        const sim = simulate();
        if (sim.trip && running) {
          cutOut = sim;
          running = false;
          particles = [];
          const btn = document.getElementById("sb-run");
          if (btn) btn.textContent = "Reset / start";
          if (window.LtSfx) window.LtSfx.compressorOff();
          if (window.LtHaptic) window.LtHaptic.warn();
          shopLevel(false);
          fxFlash = 1;
          fxShake = 16;
        }
        updateGauges(sim);
        shopDrive(sim);
        paintDispatchLive(sim);
        paintCoils(sim);
      }
      const fi = Math.round(frost);
      if (fi !== lastFrostUi) {
        lastFrostUi = fi;
        paintCoils();
      }
      if (glView && glCtl && glCtl.draw) {
        glCtl.draw({ running: running && requiredComplete(), t: animT });
      } else {
        draw();
      }
      if (fxShake > 0.3) fxShake *= 0.9;
      else fxShake = 0;
      if (fxFlash > 0.02) fxFlash *= 0.9;
      else fxFlash = 0;
    } catch (err) {
      if (typeof console !== "undefined") console.warn("sandbox tick", err);
    }
    raf = requestAnimationFrame(tick);
  }

  function wire() {
    try {
    document.querySelectorAll(".sb-tab[data-tab]").forEach((tab) => {
      tab.onclick = () => {
        document.querySelectorAll(".sb-tab[data-tab]").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        lastGuideTab = tab.dataset.tab;
        renderPalette(tab.dataset.tab);
      };
    });
    renderPalette("parts");
    layoutSlots();
    updateSysBanner();
    paintHubCoach();
    paintChargeWin();
    bindChargeDrag();
    bindGaugeDrag();
    const chMin = document.getElementById("sb-charge-min");
    const chWin = document.getElementById("sb-charge-win");
    const chOpen = document.getElementById("sb-charge-open");
    if (chMin && chWin) chMin.onclick = (e) => {
      e.stopPropagation();
      chWin.classList.remove("is-open");
      chWin.classList.add("collapsed");
    };
    if (chOpen && chWin) chOpen.onclick = () => {
      chWin.classList.add("is-open");
      chWin.classList.remove("hidden", "collapsed");
      paintChargeWin();
    };
    const healthy = document.getElementById("sb-healthy");
    if (healthy) healthy.onclick = () => loadHealthyExample();
    const gOn = document.getElementById("sb-guide-on");
    const gFree = document.getElementById("sb-guide-free");
    if (gOn) gOn.onclick = () => {
      guidedOn = true;
      syncGuidedStep();
      lastGuideTab = "";
      layoutSlots();
      paintHubCoach("Guided is on. One box at a time. Follow me.");
    };
    if (gFree) gFree.onclick = () => {
      guidedOn = false;
      layoutSlots();
      paintHubCoach();
    };
    const sbAi = document.getElementById("sb-hubai-toggle");
    if (sbAi) sbAi.onclick = () => {
      if (window.toggleHubAi) window.toggleHubAi();
      else {
        window.LtHubAiOn = window.LtHubAiOn === false;
        paintHubCoach();
      }
    };
    function toggleSbDrawer(sel) {
      const root = host || document.getElementById("sandbox-root");
      if (!root) return;
      const el = root.querySelector(sel);
      if (!el) return;
      const open = el.classList.toggle("drawer-open");
      root.querySelectorAll(".sb-palette, .sb-gauges").forEach((n) => {
        if (n !== el) n.classList.remove("drawer-open");
      });
      const pTog = document.getElementById("sb-parts-toggle");
      const gTog = document.getElementById("sb-gauges-toggle");
      if (pTog) pTog.setAttribute("aria-expanded", String(!!root.querySelector(".sb-palette.drawer-open")));
      if (gTog) gTog.setAttribute("aria-expanded", String(!!root.querySelector(".sb-gauges.drawer-open")));
      let veil = root.querySelector(".lab-veil");
      if (!veil) {
        veil = document.createElement("div");
        veil.className = "lab-veil";
        root.appendChild(veil);
        veil.onclick = () => {
          root.querySelectorAll(".drawer-open").forEach((n) => n.classList.remove("drawer-open"));
          veil.classList.remove("show");
        };
      }
      veil.classList.remove("show");
    }
    const pTog = document.getElementById("sb-parts-toggle");
    if (pTog) {
      pTog.onclick = () => {
        const root = host || document.getElementById("sandbox-root");
        if (!root) return;
        root.classList.remove("parts-parked");
        if (window.innerWidth <= 800) {
          toggleSbDrawer(".sb-palette");
          const open = root.querySelector(".sb-palette")?.classList.contains("drawer-open");
          pTog.textContent = open ? "Hide parts" : "Parts";
          return;
        }
        const wide = root.classList.toggle("parts-wide");
        pTog.textContent = wide ? "Slim tray" : "Parts";
        root.querySelector(".sb-palette")?.classList.remove("drawer-open");
        const veil = root.querySelector(".lab-veil");
        if (veil) veil.classList.remove("show");
      };
    }
    const gTog = document.getElementById("sb-gauges-toggle");
    if (gTog) gTog.onclick = () => toggleSbDrawer(".sb-gauges");
    const fsBtn = document.getElementById("sb-fs");
    function paintFsBtn() {
      const on = !!(host && host.classList.contains("sb-fs")) || !!document.fullscreenElement;
      if (fsBtn) fsBtn.textContent = on ? "Exit full" : "Full screen";
    }
    function setSandboxFs(on) {
      const scr = document.getElementById("screen-sandbox");
      if (host) host.classList.toggle("sb-fs", !!on);
      document.documentElement.classList.toggle("sb-fs", !!on);
      paintFsBtn();
      if (on) {
        const el = scr || host;
        if (el && el.requestFullscreen && !document.fullscreenElement) {
          el.requestFullscreen().catch(function () {});
        }
      } else if (document.fullscreenElement) {
        document.exitFullscreen().catch(function () {});
      }
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 80);
    }
    if (fsBtn) {
      fsBtn.onclick = function () {
        const on = !(host && host.classList.contains("sb-fs"));
        setSandboxFs(on);
      };
    }
    document.addEventListener("fullscreenchange", paintFsBtn);
    const gClose = document.getElementById("sb-gauges-close");
    if (gClose) gClose.onclick = () => {
      const root = host || document.getElementById("sandbox-root");
      root?.querySelector(".sb-gauges")?.classList.remove("drawer-open");
      root?.querySelector(".lab-veil")?.classList.remove("show");
    };
    if (window.ManifoldSet) window.ManifoldSet.wire();
    function bindPanScroll(sc) {
      if (!sc || sc._ltPan) return;
      sc._ltPan = true;
      let on = false, y0 = 0, st = 0;
      sc.addEventListener("pointerdown", function (e) {
        const hit = e.target && e.target.closest && e.target.closest("button, input, select, a, textarea, label, .sb-item, .sb-slot");
        if (hit) return;
        on = true;
        y0 = e.clientY;
        st = sc.scrollTop;
      }, { passive: true });
      window.addEventListener("pointermove", function (e) {
        if (!on) return;
        sc.scrollTop = st - (e.clientY - y0);
      }, { passive: true });
      function up() { on = false; }
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      sc.addEventListener("wheel", function (e) {
        sc.scrollTop += e.deltaY;
      }, { passive: true });
    }
    bindPanScroll(document.getElementById("sb-gauges-scroll"));
    bindPanScroll(document.getElementById("sb-items"));
    bindPanScroll(document.getElementById("sb-xtra"));
    const pal = document.querySelector("#sandbox-root .sb-palette");
    const items = document.querySelector("#sandbox-root .sb-items");
    if (pal && items && !pal._ltTabPan) {
      pal._ltTabPan = true;
      let on = false, y0 = 0, st = 0;
      pal.addEventListener("pointerdown", function (e) {
        if (document.body.classList.contains("lt-dragging-part")) return;
        on = true;
        y0 = e.clientY;
        st = items.scrollTop;
      }, { passive: true });
      window.addEventListener("pointermove", function (e) {
        if (!on || document.body.classList.contains("lt-dragging-part")) return;
      }, { passive: true });
      window.addEventListener("pointerup", function () { on = false; });
      window.addEventListener("pointercancel", function () { on = false; });
    }
    const howto = document.getElementById("sb-howto");
    const howtoGo = document.getElementById("sb-howto-go");
    try {
      if (howto && localStorage.getItem("lt-sb-howto") === "1") howto.classList.add("hidden");
    } catch (_) {}
    if (howtoGo && howto) {
      howtoGo.onclick = () => {
        howto.classList.add("hidden");
        try { localStorage.setItem("lt-sb-howto", "1"); } catch (_) {}
      };
    }
    window.addEventListener("lt-hubai", () => paintHubCoach());
    if (host && host._ltResize) window.removeEventListener("resize", host._ltResize);
    if (host) {
      host._ltResize = function () {
        staticKey = "";
        layoutSlots();
      };
      window.addEventListener("resize", host._ltResize);
    }

    const refEl = document.getElementById("sb-ref");
    if (refEl) refEl.onchange = (e) => {
      refrigerant = e.target.value;
      paintPTTable();
      paintPTFromPsig();
      highlightPT(simulate());
    };
    const ptP = document.getElementById("pt-psig");
    const ptT = document.getElementById("pt-tf");
    if (ptP) ptP.oninput = () => paintPTFromPsig();
    if (ptT) ptT.oninput = () => paintPTFromTemp();
    paintPTTable();
    paintPTFromPsig();
    const outEl = document.getElementById("sb-out");
    if (outEl) outEl.oninput = (e) => {
      outdoorF = +e.target.value;
      const v = document.getElementById("sb-out-v");
      if (v) v.textContent = outdoorF;
    };
    const inEl = document.getElementById("sb-in");
    if (inEl) inEl.oninput = (e) => {
      indoorF = +e.target.value;
      const v = document.getElementById("sb-in-v");
      if (v) v.textContent = indoorF;
    };
    const chEl = document.getElementById("sb-charge");
    if (chEl) chEl.oninput = (e) => {
      chargePct = +e.target.value;
      const v = document.getElementById("sb-charge-v");
      if (v) v.textContent = chargePct;
    };
    const faultEl = document.getElementById("sb-fault");
    if (faultEl) faultEl.onchange = (e) => {
      fault = e.target.value;
      const wasCut = !!cutOut;
      cutOut = null;
      if (wasCut) running = true;
      if (fault === "defrost_fail" && frost < 70) frost = 78;
      if (fault !== "defrost_fail" && hpMode === "cool") frost = 0;
      updateGauges(simulate());
      paintCoils(simulate());
    };
    const modeEl = document.getElementById("sb-mode");
    if (modeEl) {
      modeEl.onchange = (e) => {
        const v = e.target.value;
        if (v === "defrost") {
          defrosting = true;
          hpMode = "heat";
        } else {
          defrosting = false;
          hpMode = v;
        }
      };
    }
    const txvEl = document.getElementById("sb-txv");
    if (txvEl) {
      txvEl.oninput = (e) => {
        txvTarget = +e.target.value;
        document.getElementById("sb-txv-v").textContent = txvTarget;
      };
    }
    const runBtn = document.getElementById("sb-run");
    if (runBtn) runBtn.onclick = () => {
      if (!requiredComplete()) {
        const st = document.getElementById("sb-status");
        if (st) st.textContent = "Need compressor, condenser, metering device, and evaporator.";
        return;
      }
      if (guidedOn && !(placed.copper && placed.vacpump && placed.chargecan) && !running) {
        paintHubCoach("Not a vacuum, not a charge, not a start. Finish the glowing boxes.");
        return;
      }
      setCompressor(!running);
      if (running && onXp) onXp(15);
      updateDmm(simulate());
    };
    const sndBtn = document.getElementById("sb-sound");
    if (sndBtn) sndBtn.onclick = () => {
      const mute = !(window.LtSfx && window.LtSfx.isMuted && window.LtSfx.isMuted());
      if (window.LtSfx && window.LtSfx.setMuted) window.LtSfx.setMuted(mute);
      sndBtn.textContent = mute ? "Sound off" : "Sound on";
      shopLevel(running && requiredComplete());
    };
    const btn3d = document.getElementById("sb-3d");
    const btnCut = document.getElementById("sb-cutaway");
    if (btnCut) {
      btnCut.onclick = function () {
        const kind = (placed.metering === "piston" || placed.metering === "capillary") ? "cycle" : "txv";
        if (typeof window.ltPlay === "function") window.ltPlay("cutaway", { clip: kind });
      };
    }
    const btnFlat = document.getElementById("sb-flat");
    if (btn3d) {
      btn3d.onclick = () => {
        const glc = document.getElementById("sb-gl");
        if (!glView) {
          if (!glCtl && window.LtWebGLCycle && glc) glCtl = window.LtWebGLCycle.attach(glc);
          if (!glCtl) {
            const st = document.getElementById("sb-status");
            if (st) st.textContent = "WebGL not available on this device — staying on Canvas 2D.";
            return;
          }
          glView = true;
          glc.classList.remove("hidden");
          canvas.classList.add("hidden");
          btn3d.textContent = "2D shop";
          if (btnFlat) {
            btnFlat.classList.toggle("hidden", !glCtl.webgl2);
            btnFlat.textContent = "GLSL: smooth";
          }
          const st = document.getElementById("sb-status");
          if (st) {
            st.textContent = glCtl.webgl2
              ? "WebGL 2. RGB floor = interpolation. Toggle GLSL:flat — one color per triangle (provoking vertex)."
              : "WebGL 1: smooth varyings only. Flat needs WebGL 2.";
          }
        } else {
          glView = false;
          if (glc) glc.classList.add("hidden");
          canvas.classList.remove("hidden");
          btn3d.textContent = "3D WebGL";
          if (btnFlat) btnFlat.classList.add("hidden");
        }
      };
    }
    if (btnFlat) {
      btnFlat.onclick = () => {
        if (!glCtl || !glCtl.webgl2) return;
        const nowFlat = !glCtl.isFlat();
        glCtl.setFlat(nowFlat);
        btnFlat.textContent = nowFlat ? "GLSL: flat" : "GLSL: smooth";
        const st = document.getElementById("sb-status");
        if (st) {
          st.textContent = nowFlat
            ? "FLAT: no blend. Whole triangle = last (provoking) vertex. Floor goes solid blue."
            : "SMOOTH: barycentric blend. Floor is RGB mix.";
        }
      };
    }
    const dmmModeEl = document.getElementById("dmm-mode");
    const dmmProbeEl = document.getElementById("dmm-probe");
    if (dmmModeEl) dmmModeEl.onchange = (e) => { dmmMode = e.target.value; updateDmm(simulate()); };
    if (dmmProbeEl) dmmProbeEl.onchange = (e) => { dmmProbe = e.target.value; updateDmm(simulate()); };
    document.getElementById("sb-dmm") && document.getElementById("sb-dmm").classList.add("on");
    document.querySelectorAll("#sb-repairs [data-fix]").forEach((b) => {
      b.onclick = () => applyRepair(b.dataset.fix);
    });
    const clr = document.getElementById("sb-clear");
    if (clr) clr.onclick = () => {
      placed = {};
      running = false;
      particles = [];
      gaugesEquipped = false;
      activeSystem = null;
      coilCond = "clean";
      coilEvap = "clean";
      jobMode = null;
      activeJob = null;
      const faultEl = document.getElementById("sb-fault");
      if (faultEl) faultEl.disabled = false;
      document.getElementById("sb-manifold").classList.remove("on");
      delete host.dataset.loopXp;
      guidedStep = 0;
      lastGuideTab = "";
      guidedOn = true;
      chargeChecks = {};
      labId = null;
      labFanEvap = 100;
      labFanCond = 100;
      layoutSlots();
      updateSysBanner();
      paintHubCoach("Board clear. Compressor first. Always.");
      paintLabBoard();
    };
    } catch (err) {
      if (typeof console !== "undefined") console.warn("sandbox wire", err);
    }
  }

  function currentDiff() {
    const d = (global.LtDiff || (global.ServiceCalls && global.ServiceCalls.currentDiff && global.ServiceCalls.currentDiff()));
    return d === "easy" || d === "spicy" ? d : "medium";
  }

  function wordBand(val, low, high) {
    if (val < low) return "LOW";
    if (val > high) return "HIGH";
    return "in band";
  }

  function easyFp(job) {
    const f = (job && job.fault) || "none";
    if (f === "undercharge") return "Both needles down + high SH + low SC = leak / light charge.";
    if (f === "overcharge") return "Head up + low SH + high SC = stacked liquid. Recover to nameplate.";
    if (f === "restricted" || f === "txv_closed") return "High SH AND high SC = restriction / starved TXV. Cold drier outlet. Don't add gas.";
    if (f === "txv_open") return "SH near 0 = flooding. Kill it before you wash the compressor.";
    if (f === "dirty_evap" || f === "blower_fail" || (job && job.coilEvap === "dirty")) return "SH toward 0 + ice = airflow. Don't add gas.";
    if (f === "od_fan") return "Dead condenser fan. Head climbs until you fix the fan. Don't add gas.";
    if (f === "dirty_cond" || (job && job.coilCond === "dirty")) return "High head, SC about normal = dirty condenser. Not an overcharge.";
    if (f === "noncondensables") return "High head + high SC after a sloppy braze can be air. It looks like an overcharge.";
    if (f === "weak_comp" || f === "rv_bleed") return "Suction up, head down — pump or 4-way bypassing.";
    if (f === "defrost_fail") return "Outdoor glacier in heat = defrost never ran.";
    if (f === "stuck_defrost") return "Steaming ODU in winter = stuck in defrost.";
    if (job && job.capBad) return "Humming, pressures not wild = capacitor.";
    return "SH and SC in band. Charge isn't the complaint.";
  }

  function shuffleDispatch(choices) {
    const a = (choices || []).slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    if (a[0] && a[0].ok && a.length > 1) {
      const j = 1 + ((Math.random() * (a.length - 1)) | 0);
      const t = a[0];
      a[0] = a[j];
      a[j] = t;
    }
    return a;
  }

  function callFromJob(job) {
    if (global.ServiceCalls && typeof global.ServiceCalls.forJob === "function") {
      return global.ServiceCalls.forJob(job);
    }
    return {
      name: "Dispatch",
      avatar: "📻",
      job: job.name,
      jobId: job.id,
      quote: { pro: job.complaint },
      prompt: "Read the live system. What's the call?",
      choices: [
        { t: job.fix, ok: true },
        { t: "Add two pounds and leave", ok: false },
        { t: "Condemn the compressor", ok: false },
        { t: "Set tstat to 60 and hope", ok: false },
      ],
      why: { ok: job.fix, bad: "Guessing without gauges is a callback." },
    };
  }

  function paintDispatchLive(sim) {
    const live = document.getElementById("sb-dispatch-live");
    if (!live || !dispatchCall) return;
    const clock = document.getElementById("sb-dispatch-clock");
    if (clock && dispatchDeadline) {
      const left = Math.max(0, Math.ceil((dispatchDeadline - Date.now()) / 1000));
      clock.textContent = left + "s";
      clock.hidden = false;
      if (left <= 0 && !dispatchLocked) {
        dispatchLocked = true;
        dispatchStreak = 0;
        const fb = document.getElementById("sb-dispatch-fb");
        if (fb) {
          fb.className = "sb-dispatch-fb bad";
          fb.innerHTML = "<strong>Time.</strong> Customer is calling the office. Next ticket still rolls.";
        }
        const next = document.getElementById("sb-next-call");
        if (next) {
          next.hidden = false;
          next.onclick = function () {
            rollNextDispatch();
          };
        }
        if (onDispatchGrade) onDispatchGrade(false, dispatchCall);
      }
    }
    if ((!sim || !sim.running) && dispatchCall && global.cutOut) {
      /* fall through with last shot if present below */
    }
    if (!sim || !sim.running) {
      if (cutOut && dispatchCall) {
        sim = cutOut;
        live.textContent =
          "HPC/LPC cut out. Last running Blue " +
          Math.round(sim.pLow) +
          " · Red " +
          Math.round(sim.pHigh) +
          " · SH " +
          Number(sim.sh).toFixed(0) +
          " · SC " +
          Number(sim.sc).toFixed(0);
        return;
      }
      live.textContent = "Static. Start the compressor — equalized is not a diagnosis.";
      return;
    }
    const d = currentDiff();
    const lo = Math.round(sim.pLow);
    const hi = Math.round(sim.pHigh);
    if (d === "spicy") {
      live.textContent = "Blue " + lo + " psig · Red " + hi + " psig · punch SH/SC yourself";
      return;
    }
    const sh = Number(sim.sh).toFixed(0);
    const sc = Number(sim.sc).toFixed(0);
    if (d === "easy") {
      live.textContent =
        "Blue " +
        lo +
        " " +
        wordBand(sim.pLow, 100, 140) +
        " · Red " +
        hi +
        " " +
        wordBand(sim.pHigh, 320, 420) +
        " · SH " +
        sh +
        "° " +
        wordBand(sim.sh, 7, 15) +
        " · SC " +
        sc +
        "° " +
        wordBand(sim.sc, 6, 14);
      const hint = document.getElementById("sb-dispatch-hint");
      if (hint) hint.textContent = "HUB: " + easyFp(activeJob);
      return;
    }
    live.textContent = "Blue " + lo + " psig · Red " + hi + " psig · SH " + sh + "° · SC " + sc + "°";
  }

  function mountDispatch(call) {
    dispatchCall = call;
    dispatchLocked = false;
    const d = currentDiff();
    dispatchDeadline = d === "spicy" ? Date.now() + 45000 : 0;
    let bar = document.getElementById("sb-dispatch");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sb-dispatch";
      bar.className = "sb-dispatch";
      const dock = (host && host.querySelector(".sb-main")) || host;
    if (dock && bar.parentNode !== dock) dock.appendChild(bar);
    }
    bar.classList.remove("hidden");
    if (host) host.classList.add("sb-call");
    const q =
      d === "spicy" && call.quote && call.quote.extra
        ? call.quote.extra
        : d !== "easy" && call.quote && call.quote.spicy
          ? call.quote.spicy
          : call.quote && (call.quote.pro || call.quote.spicy)
            ? call.quote.pro || call.quote.spicy
            : call.job || "";
    const wasMin = bar.classList.contains("min");
    bar.innerHTML =
      '<div class="sb-dispatch-top">' +
      '<span class="sb-dispatch-tag">' +
      (d === "spicy" ? "SPICY" : d === "easy" ? "EASY" : "LIVE CALL") +
      "</span>" +
      "<strong>" +
      (call.name || "Dispatch") +
      "</strong>" +
      "<span class=\"sb-dispatch-job\">" +
      (call.job || "") +
      "</span>" +
      '<span class="sb-dispatch-clock" id="sb-dispatch-clock"' +
      (d === "spicy" ? "" : " hidden") +
      ">45s</span>" +
      '<span class="sb-dispatch-streak" id="sb-dispatch-streak">Streak ' +
      dispatchStreak +
      "</span>" +
      '<button type="button" class="sb-dispatch-min" id="sb-dispatch-min">Hide</button>' +
      "</div>" +
      '<div class="sb-dispatch-body">' +
      '<p class="sb-dispatch-quote" id="sb-dispatch-quote" title="Tap to expand">“' +
      q +
      "”</p>" +
      '<p class="sb-dispatch-live" id="sb-dispatch-live">Needles coming up…</p>' +
      (d === "easy" ? '<p class="sb-dispatch-hint" id="sb-dispatch-hint"></p>' : "") +
      '<p class="sb-dispatch-prompt">' +
      (d === "spicy"
        ? "Clock is running. Pressures only. Lock it."
        : call.prompt || "Read SH and SC. Lock the call.") +
      "</p>" +
      '<div class="sb-dispatch-choices" id="sb-dispatch-choices"></div>' +
      '<p class="sb-dispatch-fb" id="sb-dispatch-fb"></p>' +
      '<div class="sb-dispatch-nav">' +
      '<button type="button" class="btn primary" id="sb-next-call" hidden>Next random ticket</button>' +
      "</div></div>";
    if (wasMin) bar.classList.add("min");
    const minBtn = bar.querySelector("#sb-dispatch-min");
    function syncMin() {
      const on = bar.classList.contains("min");
      if (minBtn) minBtn.textContent = on ? "Show call" : "Hide";
    }
    if (minBtn) {
      minBtn.onclick = function () {
        bar.classList.toggle("min");
        syncMin();
      };
    }
    syncMin();
    const quoteEl = bar.querySelector("#sb-dispatch-quote");
    if (quoteEl) {
      quoteEl.onclick = function () {
        bar.classList.toggle("expanded");
      };
    }
    const box = bar.querySelector("#sb-dispatch-choices");
    let choices = shuffleDispatch(call.choices || []);
    if (d === "easy" && choices.length > 3) {
      const ok = choices.filter(function (c) {
        return c.ok;
      });
      const bad = choices.filter(function (c) {
        return !c.ok;
      }).slice(0, 2);
      choices = shuffleDispatch(ok.concat(bad));
    }
    choices.forEach(function (ch) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "svc-choice";
      b.textContent = ch.t;
      b.onclick = function () {
        if (dispatchLocked) return;
        dispatchLocked = true;
        const fb = document.getElementById("sb-dispatch-fb");
        const next = document.getElementById("sb-next-call");
        if (ch.ok) {
          dispatchStreak++;
          b.classList.add("correct");
          if (fb) {
            fb.className = "sb-dispatch-fb good";
            fb.innerHTML = "<strong>Correct.</strong> " + ((call.why && call.why.ok) || "");
          }
          if (onXp) onXp(40);
          if (onDispatchGrade) onDispatchGrade(true, call);
        } else {
          dispatchStreak = 0;
          b.classList.add("wrong");
          if (fb) {
            fb.className = "sb-dispatch-fb bad";
            fb.innerHTML = "<strong>Wrong.</strong> " + ((call.why && call.why.bad) || "Read the needles.");
          }
          if (onDispatchGrade) onDispatchGrade(false, call);
        }
        const st = document.getElementById("sb-dispatch-streak");
        if (st) st.textContent = "Streak " + dispatchStreak;
        if (next) {
          next.hidden = false;
          next.onclick = function () {
            rollNextDispatch();
          };
        }
      };
      box.appendChild(b);
    });
  }

  function applyDispatch(call) {
    const jobs = FIELD_JOBS;
    let job = jobs.find(function (j) {
      return call && j.id === call.jobId;
    });
    if (!job) job = jobs[Math.floor(Math.random() * jobs.length)];
    startMystery(job);
    placed.gauges = "gauges";
    placed.copper = placed.copper || "lineset";
    gaugesEquipped = true;
    running = true;
    const btn = document.getElementById("sb-run");
    if (btn) btn.textContent = "Stop";
    mountDispatch(callFromJob(job));
    if (global.LtDrip) global.LtDrip.say("sandbox.job");
    const man = document.getElementById("sb-manifold");
    if (man) man.classList.add("on");
    layoutSlots();
    refreshSlots();
  }

  function rollNextDispatch() {
    const last = activeJob && activeJob.id;
    const ids = (global.ServiceCalls && global.ServiceCalls.DIFF_POOLS && global.ServiceCalls.DIFF_POOLS[currentDiff()]) || [];
    let pool = FIELD_JOBS.filter(function (j) {
      return j.id !== last && (!ids.length || ids.indexOf(j.id) >= 0);
    });
    if (!pool.length) {
      pool = FIELD_JOBS.filter(function (j) {
        return j.id !== last;
      });
    }
    const job = (pool.length ? pool : FIELD_JOBS)[Math.floor(Math.random() * (pool.length ? pool.length : FIELD_JOBS.length))];
    const call = callFromJob(job);
    applyDispatch(call);
    if (onDispatchNext) onDispatchNext(call);
  }

  function start(root, opts) {
    try {
      return startInner(root, opts);
    } catch (err) {
      if (typeof console !== "undefined") console.warn("sandbox start", err);
      if (root) {
        root.innerHTML =
          "<div class='panel' style='margin:16px;padding:16px'><h2>System sandbox</h2><p>Could not start: " +
          String(err && err.message ? err.message : err) +
          "</p><button class='btn' type='button' onclick=\"window.ltPlay('hub')\">Shop floor</button></div>";
      }
      return { stop: function () {}, getHubBtn: function () { return null; } };
    }
  }

  function startInner(root, opts) {
    host = root;
    onXp = opts && opts.onXp;
    onRace = opts && opts.onRace;
    onDispatchGrade = opts && opts.onDispatchGrade;
    onDispatchNext = opts && opts.onDispatchNext;
    dispatchCall = null;
    dispatchLocked = false;
    if (opts && opts.nickname) raceNick = String(opts.nickname);
    placed = {};
    running = false;
    cutOut = null;
    particles = [];
    refrigerant = "R-410A";
    outdoorF = 95;
    indoorF = 75;
    chargePct = 100;
    fault = "none";
    coilCond = "clean";
    coilEvap = "clean";
    jobMode = null;
    activeJob = null;
    jobSolved = false;
    leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
    resetVac();
    capBad = false;
    hpMode = "cool";
    frost = 0;
    defrosting = false;
    gaugesEquipped = false;
    lastTick = 0;
    lastFrostUi = -1;
    gaugeAcc = 0;
    staticLayer = null;
    staticKey = "";
    glCtl = null;
    glView = false;
    particles = [];
    activeSystem = null;
    guidedOn = true;
    guidedStep = 0;
    lastGuideTab = "";
    chargeChecks = {};
    labId = null;
    labFanEvap = 100;
    labFanCond = 100;
    buildUI(root);
    canvas = document.getElementById("sb-canvas");
    ctx = canvas && canvas.getContext("2d");
    if (!canvas || !ctx) {
      root.innerHTML = "<p class='sb-status'>Sandbox canvas failed to load. Hard-refresh.</p>";
      return { stop() {}, getHubBtn() { return null; } };
    }
    wire();
    if (opts && opts.dispatch) {
      applyDispatch(opts.dispatch);
    }
    const howto = document.getElementById("sb-howto");
    if (howto) howto.classList.add("hidden");
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
    return {
      stop() {
        if (host) host.classList.remove("sb-call", "sb-fs");
        document.documentElement.classList.remove("sb-fs");
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (challengeTimer) clearInterval(challengeTimer);
        challengeTimer = 0;
        if (host && host._ltResize) {
          window.removeEventListener("resize", host._ltResize);
          host._ltResize = null;
        }
      },
      getHubBtn() {
        return document.getElementById("sb-hub");
      },
      applyDispatch: applyDispatch,
      rollNextDispatch: rollNextDispatch,
      getSnapshot() {
        return {
          placed: Object.assign({}, placed),
          refrigerant,
          outdoorF,
          indoorF,
          chargePct,
          fault,
          activeSystem,
        };
      },
      loadSnapshot(snap) {
        if (!snap || typeof snap !== "object") return;
        placed = snap.placed && typeof snap.placed === "object" ? Object.assign({}, snap.placed) : {};
        if (snap.refrigerant) refrigerant = snap.refrigerant;
        if (typeof snap.outdoorF === "number") outdoorF = snap.outdoorF;
        if (typeof snap.indoorF === "number") indoorF = snap.indoorF;
        if (typeof snap.chargePct === "number") chargePct = snap.chargePct;
        if (snap.fault) fault = snap.fault;
        activeSystem = snap.activeSystem || null;
        const refEl = document.getElementById("sb-ref");
        const outEl = document.getElementById("sb-out");
        const inEl = document.getElementById("sb-in");
        const chEl = document.getElementById("sb-charge");
        const fEl = document.getElementById("sb-fault");
        if (refEl) refEl.value = refrigerant;
        if (outEl) outEl.value = String(outdoorF);
        if (inEl) inEl.value = String(indoorF);
        if (chEl) chEl.value = String(chargePct);
        if (fEl) fEl.value = fault;
        const ov = document.getElementById("sb-out-v");
        const iv = document.getElementById("sb-in-v");
        const cv = document.getElementById("sb-charge-v");
        if (ov) ov.textContent = String(outdoorF);
        if (iv) iv.textContent = String(indoorF);
        if (cv) cv.textContent = String(chargePct);
        refreshSlots();
        updateSysBanner();
      },
    };
  }

  global.HVACSandbox = { start: start, FIELD_JOBS: FIELD_JOBS };
})(window);
