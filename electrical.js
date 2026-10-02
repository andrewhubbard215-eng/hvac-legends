/* HVAC Legends — Electrical sandbox + timed callback-bomb trainer.
   Field faults only. Not explosive devices.
   Player runs the box: black = hot, off-white = neutral, green = ground. */
(function (global) {
  "use strict";

  const PARTS = [
    { id: "breaker", name: "2-pole breaker", group: "line", img: null, icon: "⬛", slot: "breaker", desc: "L1 / L2 feed · 240 VAC" },
    { id: "disconnect", name: "Fused disconnect", group: "line", img: "parts/disconnect.png", icon: "🔌", slot: "disconnect", desc: "Outdoor disconnect" },
    { id: "ground", name: "Equipment ground", group: "line", img: null, icon: "⏚", slot: "ground", desc: "Green / bare to chassis" },
    { id: "contactor", name: "2-pole contactor", group: "line", img: "parts/contactor.png", icon: "🧲", slot: "contactor", desc: "24V coil · T1/T2 to loads" },
    { id: "capacitor", name: "Dual run capacitor", group: "line", img: "parts/capacitor.png", icon: "🔋", slot: "capacitor", desc: "HERM / FAN / C" },
    { id: "hardstart", name: "Hard-start kit", group: "line", img: null, icon: "⚡", slot: "hardstart", desc: "Start cap + potential relay" },
    { id: "transformer", name: "24V transformer", group: "control", img: "parts/transformer.png", icon: "🔁", slot: "transformer", desc: "Primary 240 · secondary R/C" },
    { id: "fuse", name: "3A control fuse", group: "control", img: "parts/fuse.png", icon: "🧯", slot: "fuse", desc: "R leg protection" },
    { id: "thermostat", name: "Thermostat", group: "control", img: "parts/thermostat.png", icon: "🌡️", slot: "thermostat", desc: "R Y G W O/B C" },
    { id: "hpc", name: "High-pressure switch", group: "control", img: "parts/pressuresw.png", icon: "⬆️", slot: "hpc", desc: "Opens on high head" },
    { id: "lpc", name: "Low-pressure switch", group: "control", img: "parts/pressuresw.png", icon: "⬇️", slot: "lpc", desc: "Opens on low suction" },
    { id: "float", name: "Condensate float", group: "control", img: null, icon: "💧", slot: "float", desc: "Breaks Y or R on high water" },
    { id: "relay", name: "Blower relay", group: "control", img: "parts/relay.png", icon: "📦", slot: "relay", desc: "G call · indoor fan" },
    { id: "solenoid", name: "Reversing valve solenoid", group: "control", img: null, icon: "🧲", slot: "solenoid", desc: "Heat-pump O/B" },
    { id: "limit", name: "High-limit switch", group: "control", img: "parts/pressuresw.png", icon: "🔥", slot: "limit", desc: "Furnace high limit in series with W" },
    { id: "sequencer", name: "Heat sequencer", group: "control", img: "parts/relay.png", icon: "📶", slot: "sequencer", desc: "Stages electric strips" },
    { id: "defrost", name: "Defrost control board", group: "control", img: null, icon: "🧊", slot: "defrost", desc: "Heat-pump defrost logic" },
    { id: "lockout", name: "Lockout relay", group: "control", img: "parts/relay.png", icon: "🔒", slot: "lockout", desc: "Holds out after a safety trip" },
    { id: "presssw", name: "Inducer pressure switch", group: "control", img: "parts/pressuresw.png", icon: "🌬️", slot: "presssw", desc: "Must close before ignition" },
    { id: "compressor", name: "Compressor (C/R/S)", group: "loads", img: "parts/compressor.png", icon: "🌀", slot: "compressor", desc: "Common / run / start" },
    { id: "fan", name: "Condenser fan motor", group: "loads", img: "parts/fanmotor.png", icon: "🌬️", slot: "fan", desc: "PSC outdoor fan" },
    { id: "heater", name: "Crankcase heater", group: "loads", img: null, icon: "🔥", slot: "heater", desc: "Off-cycle heat" },
    { id: "inducer", name: "Inducer / draft motor", group: "loads", img: null, icon: "💨", slot: "inducer", desc: "Gas furnace draft · 120 VAC" },
    { id: "pump", name: "Condensate pump", group: "loads", img: null, icon: "💧", slot: "pump", desc: "120V pump · float interlock" },
    { id: "strips", name: "Electric heat strips", group: "loads", img: null, icon: "♨️", slot: "strips", desc: "Air-handler electric heat" },
    { id: "gasvalve", name: "Gas valve", group: "loads", img: null, icon: "🟠", slot: "gasvalve", desc: "24V valve · furnace" },
    { id: "blower", name: "Indoor blower", group: "loads", img: "parts/fanmotor.png", icon: "🌀", slot: "blower", desc: "PSC / ECM indoor fan" },
    { id: "dmm", name: "Digital multimeter", group: "tools", img: "parts/dmm.png", icon: "📟", slot: null, desc: "Click terminals to probe" },
  ];

  const SLOTS = [
    { id: "breaker", x: 4, y: 6, w: 16, label: "Breaker" },
    { id: "disconnect", x: 22, y: 6, w: 16, label: "Disconnect" },
    { id: "ground", x: 40, y: 6, w: 12, label: "Ground" },
    { id: "transformer", x: 54, y: 6, w: 22, label: "24V transformer" },
    { id: "fuse", x: 78, y: 6, w: 18, label: "3A fuse" },
    { id: "contactor", x: 4, y: 28, w: 20, label: "Contactor" },
    { id: "capacitor", x: 26, y: 28, w: 18, label: "Run cap" },
    { id: "hardstart", x: 46, y: 28, w: 14, label: "Hard start" },
    { id: "lockout", x: 62, y: 28, w: 16, label: "Lockout" },
    { id: "defrost", x: 80, y: 28, w: 16, label: "Defrost" },
    { id: "compressor", x: 4, y: 50, w: 20, label: "Compressor" },
    { id: "fan", x: 26, y: 50, w: 18, label: "OD fan" },
    { id: "heater", x: 46, y: 50, w: 14, label: "CCH" },
    { id: "thermostat", x: 62, y: 50, w: 16, label: "Stat" },
    { id: "blower", x: 80, y: 50, w: 16, label: "Blower" },
    { id: "hpc", x: 4, y: 72, w: 15, label: "HPC" },
    { id: "lpc", x: 21, y: 72, w: 15, label: "LPC" },
    { id: "float", x: 38, y: 72, w: 15, label: "Float" },
    { id: "relay", x: 55, y: 72, w: 13, label: "Relay" },
    { id: "solenoid", x: 70, y: 72, w: 13, label: "RV" },
    { id: "limit", x: 85, y: 72, w: 13, label: "Limit" },
    { id: "inducer", x: 4, y: 90, w: 18, label: "Inducer" },
    { id: "presssw", x: 24, y: 90, w: 18, label: "Pressure SW" },
    { id: "gasvalve", x: 44, y: 90, w: 16, label: "Gas valve" },
    { id: "sequencer", x: 62, y: 90, w: 16, label: "Sequencer" },
    { id: "strips", x: 80, y: 90, w: 16, label: "Heat strips" },
    { id: "pump", x: 4, y: 108, w: 18, label: "Cond. pump" },
  ];

  const PROBES = [
    { id: "l1", label: "L1 (line)", group: "line" },
    { id: "l2", label: "L2 (line)", group: "line" },
    { id: "gnd", label: "Ground", group: "line" },
    { id: "load1", label: "Disconnect load L1", group: "line" },
    { id: "load2", label: "Disconnect load L2", group: "line" },
    { id: "t1", label: "Contactor T1", group: "line" },
    { id: "t2", label: "Contactor T2", group: "line" },
    { id: "compc", label: "Compressor C", group: "comp" },
    { id: "compr", label: "Compressor R (run)", group: "comp" },
    { id: "comps", label: "Compressor S (start)", group: "comp" },
    { id: "caph", label: "Cap HERM", group: "cap" },
    { id: "capf", label: "Cap FAN", group: "cap" },
    { id: "capc", label: "Cap C", group: "cap" },
    { id: "r", label: "R (24V hot)", group: "24" },
    { id: "c24", label: "C (24V common)", group: "24" },
    { id: "y", label: "Y (cool call)", group: "24" },
    { id: "g", label: "G (fan call)", group: "24" },
    { id: "w", label: "W (heat call)", group: "24" },
    { id: "o", label: "O/B (reversing valve)", group: "24" },
    { id: "coil", label: "Contactor coil", group: "24" },
    { id: "hpc", label: "HPC switch", group: "24" },
    { id: "lpc", label: "LPC switch", group: "24" },
    { id: "limit", label: "High-limit", group: "24" },
    { id: "fanlead", label: "OD fan lead", group: "line" },
    { id: "striplead", label: "Heat strip lead", group: "line" },
  ];

  const KITS = {
    split: {
      name: "Straight-cool split",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float"],
    },
    heatpump: {
      name: "Heat pump (O/B)",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "solenoid", "defrost"],
    },
    gasac: {
      name: "Gas furnace + A/C",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "relay", "limit", "inducer", "presssw", "gasvalve", "blower"],
    },
    package: {
      name: "Package unit",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "heater", "blower"],
    },
    electric: {
      name: "Air handler + electric heat",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "sequencer", "strips", "blower", "relay"],
    },
    accessory: {
      name: "120V condensate / CCH",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "thermostat", "float", "heater", "pump"],
    },
  };

  /* Shop-floor colors. Neutral is off-white so it never vanishes on the white box.
     Thermostat G is fan green — not equipment ground. */
  const WIRE = {
    hot: { id: "hot", name: "L1 hot", code: "black", fill: "#1a1a1a", stroke: "#000000", cls: "hot" },
    l2: { id: "l2", name: "L2 hot", code: "red", fill: "#c0392b", stroke: "#7a1f16", cls: "l2" },
    neutral: { id: "neutral", name: "Neutral", code: "off-white", fill: "#cbb892", stroke: "#6a5740", cls: "neu" },
    ground: { id: "ground", name: "Equip ground", code: "green", fill: "#1b8f4a", stroke: "#0d5c2e", cls: "gnd" },
    herm: { id: "herm", name: "HERM (start)", code: "yellow", fill: "#e8c450", stroke: "#8a6a10", cls: "herm" },
    fan: { id: "fan", name: "FAN (aux)", code: "brown", fill: "#6b3a1f", stroke: "#3a1e0e", cls: "fan" },
    capc: { id: "capc", name: "Cap C", code: "purple", fill: "#6c3cb4", stroke: "#3d1f6e", cls: "capc" },
    run: { id: "run", name: "Run (R)", code: "black", fill: "#1a1a1a", stroke: "#000", cls: "hot" },
    start: { id: "start", name: "Start (S)", code: "yellow", fill: "#e8c450", stroke: "#8a6a10", cls: "herm" },
    common: { id: "common", name: "Common (C)", code: "purple", fill: "#6c3cb4", stroke: "#3d1f6e", cls: "capc" },
    r24: { id: "r24", name: "R 24V", code: "red", fill: "#c0392b", stroke: "#7a1f16", cls: "r24" },
    c24: { id: "c24", name: "C common", code: "blue", fill: "#3d7ec9", stroke: "#1e4a80", cls: "c24" },
    y: { id: "y", name: "Y cool", code: "yellow", fill: "#e8c450", stroke: "#8a6a10", cls: "y" },
    gfan: { id: "gfan", name: "G fan", code: "green (stat)", fill: "#2ecc71", stroke: "#1a7a40", cls: "gfan" },
    w: { id: "w", name: "W heat", code: "white", fill: "#d8d0c0", stroke: "#6a5740", cls: "w" },
    o: { id: "o", name: "O/B RV", code: "orange", fill: "#e67e22", stroke: "#8a4208", cls: "o" },
    coil: { id: "coil", name: "24V coil", code: "red", fill: "#c0392b", stroke: "#7a1f16", cls: "r24" },
  };

  const NEUTRAL_SLOTS = { transformer: 1, fuse: 1, inducer: 1, pump: 1, blower: 1, heater: 1 };

  const DEVICE_LUGS = {
    src: [
      { id: "hot", label: "L1", sub: "LINE", accept: "hot", x: 14, y: 72 },
      { id: "l2", label: "L2", sub: "LINE", accept: "l2", x: 38, y: 72 },
      { id: "n", label: "N", sub: "NEUTRAL", accept: "neutral", x: 62, y: 72 },
      { id: "gnd", label: "GND", sub: "BOND", accept: "ground", x: 86, y: 72 },
    ],
    breaker: [
      { id: "hot", label: "L1", sub: "LINE", accept: "hot", x: 24, y: 28 },
      { id: "l1load", label: "L1", sub: "LOAD", accept: "hot", x: 24, y: 78 },
      { id: "l2", label: "L2", sub: "LINE", accept: "l2", x: 76, y: 28 },
      { id: "l2load", label: "L2", sub: "LOAD", accept: "l2", x: 76, y: 78 },
    ],
    disconnect: [
      { id: "hot", label: "L1", sub: "LINE", accept: "hot", x: 22, y: 22 },
      { id: "l2", label: "L2", sub: "LINE", accept: "l2", x: 78, y: 22 },
      { id: "l1load", label: "L1", sub: "LOAD", accept: "hot", x: 22, y: 70 },
      { id: "l2load", label: "L2", sub: "LOAD", accept: "l2", x: 78, y: 70 },
      { id: "gnd", label: "GND", sub: "LUG", accept: "ground", x: 50, y: 84 },
    ],
    ground: [{ id: "gnd", label: "GND", sub: "BAR", accept: "ground", x: 50, y: 70 }],
    contactor: [
      { id: "hot", label: "L1", sub: "LINE", accept: "hot", x: 20, y: 20 },
      { id: "l2", label: "L2", sub: "LINE", accept: "l2", x: 80, y: 20 },
      { id: "t1", label: "T1", sub: "LOAD", accept: "hot", x: 20, y: 82 },
      { id: "t2", label: "T2", sub: "LOAD", accept: "l2", x: 80, y: 82 },
      { id: "coil", label: "A1", sub: "COIL", accept: "r24", x: 36, y: 50 },
      { id: "coilc", label: "A2", sub: "COIL", accept: "c24", x: 64, y: 50 },
    ],
    compressor: [
      { id: "hot", label: "R", sub: "RUN", accept: "run", x: 50, y: 22 },
      { id: "c", label: "C", sub: "COMMON", accept: "common", x: 22, y: 78 },
      { id: "s", label: "S", sub: "START", accept: "start", x: 78, y: 78 },
      { id: "gnd", label: "GND", sub: "SHELL", accept: "ground", x: 50, y: 94 },
    ],
    capacitor: [
      { id: "fan", label: "FAN", sub: "BROWN", accept: "fan", x: 20, y: 38 },
      { id: "herm", label: "HERM", sub: "YELLOW", accept: "herm", x: 80, y: 38 },
      { id: "c", label: "C", sub: "PURPLE", accept: "capc", x: 50, y: 82 },
    ],
    hardstart: [
      { id: "pr1", label: "1", sub: "START CAP", accept: "start", x: 22, y: 70 },
      { id: "pr2", label: "2", sub: "HERM/C", accept: "capc", x: 50, y: 70 },
      { id: "pr5", label: "5", sub: "COMP S", accept: "herm", x: 78, y: 70 },
    ],
    transformer: [
      { id: "hot", label: "PRI", sub: "240", accept: "hot", x: 22, y: 26 },
      { id: "l2", label: "PRI", sub: "240", accept: "l2", x: 78, y: 26 },
      { id: "r24", label: "R", sub: "SEC", accept: "r24", x: 22, y: 74 },
      { id: "n", label: "C", sub: "SEC", accept: "c24", x: 78, y: 74 },
      { id: "gnd", label: "GND", sub: "CHASSIS", accept: "ground", x: 50, y: 90 },
    ],
    fuse: [
      { id: "in", label: "IN", sub: "FROM R", accept: "r24", x: 28, y: 50 },
      { id: "out", label: "OUT", sub: "TO STAT", accept: "r24", x: 72, y: 50 },
    ],
    thermostat: [
      { id: "r", label: "R", sub: "24V", accept: "r24", x: 12, y: 72 },
      { id: "y", label: "Y", sub: "COOL", accept: "y", x: 28, y: 72 },
      { id: "g", label: "G", sub: "FAN", accept: "gfan", x: 44, y: 72 },
      { id: "w", label: "W", sub: "HEAT", accept: "w", x: 60, y: 72 },
      { id: "c", label: "C", sub: "COM", accept: "c24", x: 76, y: 72 },
      { id: "o", label: "O/B", sub: "RV", accept: "o", x: 90, y: 72 },
    ],
    hpc: [
      { id: "com", label: "COM", sub: "FROM Y", accept: "y", x: 28, y: 70 },
      { id: "no", label: "NC", sub: "TO COIL", accept: "y", x: 72, y: 70 },
    ],
    lpc: [
      { id: "com", label: "COM", sub: "FROM HPC", accept: "y", x: 28, y: 70 },
      { id: "no", label: "NC", sub: "TO COIL", accept: "y", x: 72, y: 70 },
    ],
    float: [
      { id: "com", label: "COM", sub: "Y or R", accept: "y", x: 28, y: 70 },
      { id: "nc", label: "NC", sub: "OPENS WET", accept: "y", x: 72, y: 70 },
    ],
    relay: [
      { id: "coil", label: "COIL", sub: "G", accept: "gfan", x: 22, y: 70 },
      { id: "coilc", label: "COIL", sub: "C", accept: "c24", x: 50, y: 70 },
      { id: "no", label: "NO", sub: "BLOWER", accept: "hot", x: 78, y: 70 },
    ],
    solenoid: [
      { id: "ob", label: "O/B", sub: "24V", accept: "o", x: 32, y: 70 },
      { id: "c", label: "C", sub: "COM", accept: "c24", x: 68, y: 70 },
    ],
    limit: [
      { id: "com", label: "COM", sub: "FROM W", accept: "w", x: 28, y: 70 },
      { id: "nc", label: "NC", sub: "TO VALVE", accept: "w", x: 72, y: 70 },
    ],
    sequencer: [
      { id: "h1", label: "1", sub: "24V", accept: "w", x: 22, y: 28 },
      { id: "h2", label: "2", sub: "24V", accept: "c24", x: 78, y: 28 },
      { id: "m1", label: "M1", sub: "HEAT", accept: "hot", x: 22, y: 78 },
      { id: "m2", label: "M2", sub: "HEAT", accept: "l2", x: 78, y: 78 },
    ],
    defrost: [
      { id: "r", label: "R", sub: "24V", accept: "r24", x: 16, y: 72 },
      { id: "c", label: "C", sub: "COM", accept: "c24", x: 34, y: 72 },
      { id: "y", label: "Y", sub: "COOL", accept: "y", x: 52, y: 72 },
      { id: "o", label: "O", sub: "RV", accept: "o", x: 70, y: 72 },
      { id: "dft", label: "DFT", sub: "SENSOR", accept: "c24", x: 88, y: 72 },
    ],
    lockout: [
      { id: "coil", label: "COIL", sub: "24V", accept: "r24", x: 25, y: 70 },
      { id: "nc1", label: "NC", sub: "Y IN", accept: "y", x: 50, y: 70 },
      { id: "nc2", label: "NC", sub: "Y OUT", accept: "y", x: 75, y: 70 },
    ],
    presssw: [
      { id: "com", label: "COM", sub: "FROM IND", accept: "r24", x: 28, y: 70 },
      { id: "no", label: "NO", sub: "TO IGN", accept: "r24", x: 72, y: 70 },
    ],
    compressor: [
      { id: "hot", label: "R", sub: "RUN", accept: "run", x: 50, y: 22 },
      { id: "c", label: "C", sub: "COMMON", accept: "common", x: 22, y: 78 },
      { id: "s", label: "S", sub: "START", accept: "start", x: 78, y: 78 },
      { id: "gnd", label: "GND", sub: "SHELL", accept: "ground", x: 50, y: 94 },
    ],
    fan: [
      { id: "c", label: "C", sub: "COMMON", accept: "common", x: 22, y: 70 },
      { id: "fan", label: "FAN", sub: "TO CAP", accept: "fan", x: 50, y: 70 },
      { id: "hot", label: "HI", sub: "LINE", accept: "hot", x: 78, y: 70 },
      { id: "gnd", label: "GND", sub: "FRAME", accept: "ground", x: 50, y: 90 },
    ],
    heater: [
      { id: "hot", label: "L1", sub: "240", accept: "hot", x: 25, y: 70 },
      { id: "l2", label: "L2", sub: "240", accept: "l2", x: 50, y: 70 },
      { id: "gnd", label: "GND", sub: "LEAD", accept: "ground", x: 75, y: 70 },
    ],
    inducer: [
      { id: "hot", label: "L", sub: "120 HOT", accept: "hot", x: 22, y: 70 },
      { id: "n", label: "N", sub: "NEUTRAL", accept: "neutral", x: 50, y: 70 },
      { id: "gnd", label: "GND", sub: "GREEN", accept: "ground", x: 78, y: 70 },
    ],
    pump: [
      { id: "hot", label: "L", sub: "120", accept: "hot", x: 18, y: 70 },
      { id: "n", label: "N", sub: "NEUTRAL", accept: "neutral", x: 40, y: 70 },
      { id: "gnd", label: "GND", sub: "GREEN", accept: "ground", x: 62, y: 70 },
      { id: "nc", label: "NC", sub: "SAFETY", accept: "y", x: 84, y: 70 },
    ],
    strips: [
      { id: "hot", label: "L1", sub: "FROM M1", accept: "hot", x: 25, y: 70 },
      { id: "l2", label: "L2", sub: "FROM M2", accept: "l2", x: 50, y: 70 },
      { id: "gnd", label: "GND", sub: "FRAME", accept: "ground", x: 75, y: 70 },
    ],
    gasvalve: [
      { id: "th", label: "TH", sub: "FROM W", accept: "w", x: 32, y: 70 },
      { id: "tr", label: "TR", sub: "TO C", accept: "c24", x: 68, y: 70 },
    ],
    blower: [
      { id: "c", label: "C", sub: "COMMON", accept: "common", x: 20, y: 70 },
      { id: "hot", label: "HI", sub: "SPEED", accept: "hot", x: 45, y: 70 },
      { id: "fan", label: "CAP", sub: "TO FAN", accept: "fan", x: 70, y: 70 },
      { id: "gnd", label: "GND", sub: "FRAME", accept: "ground", x: 88, y: 70 },
    ],
  };

  const DEVICE_SAY = {
    src: "Service feed. Black L1, red L2, off-white N, green bond.",
    breaker: "2-pole. L1/L2 line on top, load out the bottom. No neutral on this breaker.",
    disconnect: "Pullout: LINE on top, LOAD on the bottom, green on the ground lug.",
    ground: "Green / bare on the ground bar. Bond the can.",
    contactor: "L1/L2 line in the top. T1/T2 load out the bottom. A1/A2 are the 24V coil.",
    capacitor: "HERM · FAN · C. Yellow on HERM, brown on FAN, purple on C. Not hot-neutral-ground.",
    hardstart: "Potential relay 5-2-1. 5 to compressor S, 2 to C/HERM, 1 to the start cap.",
    transformer: "Primary is 240 (two hots). Secondary is R and C.",
    fuse: "In-line on R. In from transformer R, out to the stat.",
    thermostat: "R Y G W C O/B. G is fan — not equipment ground.",
    hpc: "Two terminals in the Y string. Opens on high head.",
    lpc: "Two terminals in the Y string after HPC. Opens on low suction.",
    float: "NC float in Y or R. Opens when the pan is a lake.",
    relay: "24V coil on G and C. NO contact feeds the blower.",
    solenoid: "O/B and C. 24V reversing valve.",
    limit: "NC high-limit in the W string.",
    sequencer: "1-2 are 24V heat. M1-M2 pass 240 to the strips.",
    defrost: "Board lugs: R C Y O DFT.",
    lockout: "Coil plus NC in Y.",
    presssw: "Inducer proving switch. COM/NO. Hose is not a wire.",
    compressor: "C / R / S on the fusite. Ground the shell.",
    fan: "PSC outdoor: common, FAN (to cap), high to line, green on the frame.",
    heater: "Two 240 leads plus ground.",
    inducer: "Most are 120: hot, neutral, green.",
    pump: "120 pump: L N G plus NC safety.",
    strips: "Sequencer M1/M2 feed L1/L2. Bond the frame.",
    gasvalve: "TH from W, TR back to C. 24V valve.",
    blower: "PSC indoor: common, speed tap, cap lead, frame ground.",
  };


  /* Timed HVAC electrical trainer. Known field faults — not explosive devices. */
  const JOBS = [
    {
      id: "hpc",
      name: "No-cool at 4:58",
      seconds: 90,
      kit: "split",
      fault: "open_hpc",
      cool: true,
      fan: false,
      brief: "House is 86°. Y is calling. Contactor is out. 24V series string is open. Meter Y through the safeties. Cut the OPEN safety — not R, not the compressor run.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "c", color: "#1a1a1a", label: "C · 24V common", cut: "boom" },
        { id: "y", color: "#e8c450", label: "Y · cool call", cut: "boom" },
        { id: "hpc", color: "#4aa3ff", label: "HPC series lead (open)", cut: "win" },
        { id: "g", color: "#3dba6a", label: "G · indoor fan", cut: "ok" },
      ],
      replaceWin: "hpc",
    },
    {
      id: "cap",
      name: "Hum, no start",
      seconds: 80,
      kit: "split",
      fault: "open_cap",
      cool: true,
      fan: false,
      brief: "Contactor is in. Compressor hums, no start. Lock it out. Do not cut a winding. Replace the dual run cap — or you eat a compressor.",
      wires: [
        { id: "herm", color: "#c0392b", label: "HERM (run winding)", cut: "boom" },
        { id: "fan", color: "#3dba6a", label: "FAN (OD motor)", cut: "ok" },
        { id: "ccommon", color: "#c08a5a", label: "Cap C (common)", cut: "boom" },
        { id: "t1", color: "#e8c450", label: "Contactor T1 (hot)", cut: "boom" },
      ],
      replaceWin: "capacitor",
    },
    {
      id: "fuse",
      name: "3A keeps popping",
      seconds: 100,
      kit: "split",
      fault: "grounded",
      cool: false,
      fan: false,
      brief: "Control fuse is toast. Something is shorted. Find the winding-to-ground BEFORE you slap a new 3A in. Cut the grounded compressor C lead to isolate, then replace the fuse.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "compc", color: "#4aa3ff", label: "Compressor C (grounded)", cut: "win" },
        { id: "gnd", color: "#3dba6a", label: "Chassis ground", cut: "boom" },
        { id: "c24", color: "#1a1a1a", label: "Transformer C", cut: "ok" },
      ],
      replaceWin: null,
    },
    {
      id: "swap",
      name: "Stat wired drunk",
      seconds: 75,
      kit: "split",
      fault: "none",
      cool: false,
      fan: true,
      brief: "Last helper landed Y on G and G on Y. Fan runs, condenser never starts. Yellow is the cool call and it is sitting on G. Green is the fan, not Y.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "ywrong", color: "#3dba6a", label: "Green wire sitting on Y (it's G)", cut: "ok" },
        { id: "gwrong", color: "#e8c450", label: "Yellow wire sitting on G (it's Y)", cut: "win" },
        { id: "c", color: "#1a1a1a", label: "C · common", cut: "boom" },
      ],
      replaceWin: null,
    },
    {
      id: "coil",
      name: "Contactor never pulls in",
      seconds: 85,
      kit: "heatpump",
      fault: "open_coil",
      cool: true,
      fan: false,
      brief: "Y is through HPC/LPC/float. About 24V is on the coil and it does not pull in. The winding is open. Don't cut T1/T2 live.",
      wires: [
        { id: "t1", color: "#c0392b", label: "T1 load hot", cut: "boom" },
        { id: "t2", color: "#4aa3ff", label: "T2 load hot", cut: "boom" },
        { id: "coil+", color: "#e8c450", label: "Coil + (open winding)", cut: "ok" },
        { id: "y", color: "#3dba6a", label: "Y arriving at coil", cut: "ok" },
      ],
      replaceWin: "contactor",
    },
    {
      id: "float",
      name: "Pan is a lake",
      seconds: 70,
      kit: "split",
      fault: "float_open",
      cool: true,
      fan: true,
      brief: "Indoor coil overflowing. Float opened Y. Cut the float out of the cool call ONLY after you confirm it's the open — jumping R to Y live is how you flood the house.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · jumper to Y (cheat)", cut: "boom" },
        { id: "float", color: "#4aa3ff", label: "Float series (open)", cut: "win" },
        { id: "y", color: "#e8c450", label: "Y to outdoor", cut: "ok" },
        { id: "g", color: "#3dba6a", label: "G blower", cut: "ok" },
      ],
      replaceWin: "float",
    },
    {
      id: "lpc",
      name: "Iced solid, 2° SH",
      seconds: 85,
      kit: "split",
      fault: "open_lpc",
      cool: true,
      fan: true,
      brief: "LPC is open. Don't add gas until you prove it's not a frozen coil. Cut the open LPC series — not R.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "lpc", color: "#4aa3ff", label: "LPC series lead (open)", cut: "win" },
        { id: "y", color: "#e8c450", label: "Y · cool call", cut: "boom" },
        { id: "g", color: "#3dba6a", label: "G · indoor fan", cut: "ok" },
      ],
      replaceWin: "lpc",
    },
    {
      id: "disc",
      name: "Dead set, 86° house",
      seconds: 70,
      kit: "split",
      fault: "open_disc",
      cool: true,
      brief: "No 240 past the disconnect. Don't cut control wiring. Isolate at the open disconnect — not L1 live.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V (still dead)", cut: "ok" },
        { id: "l1", color: "#e8c450", label: "L1 line (live)", cut: "boom" },
        { id: "disc", color: "#4aa3ff", label: "Disconnect load (open)", cut: "win" },
        { id: "gnd", color: "#3dba6a", label: "Equipment ground", cut: "boom" },
      ],
      replaceWin: "disconnect",
    },
    {
      id: "limit",
      name: "Furnace limit trip",
      seconds: 80,
      kit: "gasac",
      fault: "open_limit",
      heat: true,
      cool: false,
      brief: "W is calling. Inducer ran. Limit is open — dirty filter or plugged exchanger until proven otherwise. Cut the open limit, not the gas valve.",
      wires: [
        { id: "w", color: "#c0392b", label: "W · heat call", cut: "boom" },
        { id: "limit", color: "#4aa3ff", label: "High-limit series (open)", cut: "win" },
        { id: "gv", color: "#e8c450", label: "Gas valve 24V", cut: "boom" },
        { id: "g", color: "#3dba6a", label: "G blower", cut: "ok" },
      ],
      replaceWin: "limit",
    },
    {
      id: "rv",
      name: "Heat pump, 3A dead",
      seconds: 90,
      kit: "heatpump",
      fault: "blown_fuse",
      cool: true,
      rev: true,
      brief: "Control fuse is open. RV solenoid is shorted. Isolate the O lead before you slam a new 3A. Cut O, not R.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "o", color: "#4aa3ff", label: "O/B to RV solenoid (shorted)", cut: "win" },
        { id: "y", color: "#e8c450", label: "Y cool call", cut: "ok" },
        { id: "c", color: "#1a1a1a", label: "C common", cut: "boom" },
      ],
      replaceWin: "fuse",
    },
  ];

  const BAYS = [
    { id: "safeties", name: "24-volt safeties", note: "Y is calling. A switch in the string is open.", jobs: ["hpc", "lpc", "float", "coil"] },
    { id: "line", name: "Line voltage", note: "No 240. Don't chase the stat yet.", jobs: ["disc"] },
    { id: "comp", name: "Compressor", note: "Contactor is in, or the 3A is toast.", jobs: ["cap", "fuse"] },
    { id: "stat", name: "Stat and heat", note: "The call is wrong, or the furnace stopped itself.", jobs: ["swap", "limit"] },
    { id: "hp", name: "Heat pump", note: "O/B and the control fuse.", jobs: ["rv"] },
  ];
  const JOB_FACE = {
    hpc: { symptom: "No cool. Contactor is out." },
    lpc: { symptom: "Iced coil. Indoor fan is still running." },
    float: { symptom: "Water in the pan. Outdoor unit is off." },
    coil: { symptom: "Safeties look closed. Contactor never pulls in." },
    disc: { symptom: "Dead set. The house is hot." },
    cap: { symptom: "Contactor is in. Compressor hums and won't start." },
    fuse: { symptom: "The 3A fuse is open." },
    swap: { symptom: "Fan runs. The condenser never starts." },
    limit: { symptom: "No heat. The inducer ran, then stopped." },
    rv: { symptom: "Heat pump. The control fuse is dead." },
  };
  JOBS.forEach(function (j) {
    j.symptom = (JOB_FACE[j.id] && JOB_FACE[j.id].symptom) || j.name;
  });
  (function tagIsolate() {
    var fuse = JOBS.find(function (j) { return j.id === "fuse"; });
    var swap = JOBS.find(function (j) { return j.id === "swap"; });
    var rv = JOBS.find(function (j) { return j.id === "rv"; });
    if (fuse) fuse.isolate = { wire: "compc", label: "Isolate compressor C", after: "comp" };
    if (swap) swap.isolate = { wire: "gwrong", label: "Move Y off G", after: "stat" };
    if (rv) rv.isolate = { wire: "o", label: "Isolate O", after: "fuse" };
  })();

  const PROVE = {
    hpc: "hpc",
    lpc: "lpc",
    float: "float",
    coil: "coil",
    disc: "disc",
    cap: "cap",
    fuse: "comp",
    swap: "stat",
    limit: "limit",
    rv: "fuse",
  };

  let host, onXp, onWin;
  let placed = {};
  let callCool = false;
  let callFan = false;
  let callHeat = false;
  let callRev = false;
  let fault = "none";
  let mode = "vac";
  let red = "l1";
  let black = "l2";
  let fusedBlown = false;
  let meterFuse = false;
  let ladderProof = false;
  let labMode = "build";
  let guideOn = false;
  let guideI = 0;
  const GUIDE = [
    { id: "intro", title: "Follow the call", say: "This is one 24-volt series string. Same current in every device. The drops add up to about 24. Tap R." },
    { id: "y", title: "Call for cool", say: "Hit Y on the stat so the string is live. That's a cool call." },
    { id: "walk", title: "Walk it", say: "A good closed contact drops about 0 V. An open safety shows about 24 V across it, and the coil sees about 0. Don't jump a safety to make it run." },
    { id: "kit", title: "Now land lugs", say: "Tap the disconnect. Wiring is on the close-up — real stamps, not generic H/N/G.", wait: "zoom:disconnect" },
    { id: "hot", title: "Land L1", say: "Black → L1 LINE (top left). That's the line-side hot.", wait: "land:hot:disconnect" },
    { id: "l2", title: "Land L2", say: "Red → L2 LINE (top right). 240 needs both hots.", wait: "land:l2:disconnect" },
    { id: "gnd", title: "Bond the can", say: "Green → GND lug. Equipment ground, not the stat G.", wait: "land:ground:disconnect" },
    { id: "done", title: "You can run the box", say: "Follow the call to diagnose. Land lugs to wire. Saturday callback is the timed fault." },
  ];
  let job = null;
  let satBay = null;
  let tutOn = false;
  let tutStep = 0;
  let satI = 0;
  let cutSet = {};
  let timeLeft = 0;
  let timerId = 0;
  let defused = false;
  let boom = false;
  let activeKit = "split";
  let probed = false;
  let wonFired = false;
  let isolated = false;
  let fusePopped = false;
  let satDone = {};
  let satClocked = false;
  let runs = [];
  let spool = "hot";
  let pending = null;
  let runSeq = 1;
  let resizeObs = null;
  let zoomSlot = null;
  let view = "ladder"; /* ladder | lugs */
  let meteredOpen = false;
  let ladderTap = null;
  let tsOn = true;
  let tsI = 0;
  let tsDone = {};
  let sheetNote = "";
  let meterSchool = false;
  let meterGuideOn = false;
  let meterGuideI = 0;
  let leadZoom = false;
  let openingLeadZoom = false;
  let queuedLeadBoard = "";
  let leadOpenHops = 0;
  let leadBoard = "line";
  let leadHand = "red";
  let dmmJackRed = "v";
  let dmmJackBlk = "com";
  let dmmLead = "red";
  const METER_GUIDE = [
    { id: "jacks", title: "Plug the leads", say: "Same card as land lugs. Drag the BLACK lead onto COM and the RED lead onto VΩ. Voltage in the A jack blows the meter fuse.", wait: "jacks" },
    { id: "dial", title: "Dial VAC", say: "Tap VAC under the screen. House power and control voltage are AC. VDC lies on a transformer.", wait: "dial:vac" },
    { id: "l1l2", title: "Drag line to line", say: "Disconnect close-up. Drag RED onto L1 LINE. Drag BLACK onto L2 LINE. VAC should show about 240.", wait: "read:l1:l2:200" },
    { id: "l1g", title: "Drag line to ground", say: "Leave red on L1. Drag black off L2 and drop it on the GND lug. About 120 VAC.", wait: "read:l1:gnd:100" },
    { id: "rc", title: "Drag R and C", say: "Transformer close-up. Drag red onto R. Drag black onto C. Same VAC dial. A healthy transformer is 24–28.", wait: "read:r:c24:20" },
    { id: "ohm", title: "Don't ohm live", say: "Ohms on a live circuit toasts the fuse. Pull the disconnect, then dial OHMS.", wait: "ohm-lesson" },
    { id: "free", title: "You're on the meter", say: "Pick a device. Drag the leads onto the screws. Turn the dial. The screen shows whatever that setting measures." },
  ];
  const METER_FACES = [
    { id: "disconnect", short: "Disconnect", slot: "disconnect", probes: { hot: "l1", l2: "l2", l1load: "load1", l2load: "load2", gnd: "gnd" } },
    { id: "contactor", short: "Contactor", slot: "contactor", probes: { hot: "l1", l2: "l2", t1: "t1", t2: "t2", coil: "coil", coilc: "c24" } },
    { id: "capacitor", short: "Run cap", slot: "capacitor", probes: { herm: "caph", fan: "capf", c: "capc" } },
    { id: "compressor", short: "Compressor", slot: "compressor", probes: { hot: "compr", c: "compc", s: "comps", gnd: "gnd" } },
    { id: "transformer", short: "Transformer", slot: "transformer", probes: { hot: "l1", l2: "l2", r24: "r", n: "c24" } },
    { id: "thermostat", short: "Stat", slot: "thermostat", probes: { r: "r", y: "y", g: "g", w: "w", c: "c24", o: "o" } },
  ];

  /* Field no-cool sheet — the order you walk on a truck, not a textbook appendix. */
  const TS_NOCOOL = [
    { id: "call", n: "1", title: "Confirm the call", say: "Hit Y on the stat. No Y, no cool.", node: "stat", wantCall: true },
    { id: "l1", n: "2", title: "Line voltage", say: "Tap L1. You want ~240 VAC. No line is a feeder or breaker — not a capacitor.", node: "l1", minV: 200 },
    { id: "disc", n: "3", title: "Disconnect load", say: "Tap DISC. Line live / load dead = puller open.", node: "disc", minV: 200, openFault: "open_disc" },
    { id: "r", n: "4", title: "R to C", say: "Tap R. 24–28 VAC. No 24V = 3A fuse or transformer.", node: "xfmr", minV: 20, openFault: "blown_fuse" },
    { id: "y", n: "5", title: "Y at the board", say: "Tap STAT. Y–C should be 24V with a cool call.", node: "stat", minV: 20 },
    { id: "hpc", n: "6", title: "High-pressure switch", say: "Tap HPC. A closed contact drops about 0 V. About 24 V across it means the HPC is open and the coil sees 0. Don't jump it.", node: "hpc", across: true, openFault: "open_hpc" },
    { id: "lpc", n: "7", title: "Low-pressure switch", say: "Tap LPC. About 0 V means closed. About 24 V across it means open. Don't add gas, and don't jump it.", node: "lpc", across: true, openFault: "open_lpc" },
    { id: "float", n: "8", title: "Condensate float", say: "Tap FLOAT. About 24 V across an open float means the pan is full. The coil sees 0. The indoor fan is a different branch. Don't jump it.", node: "float", across: true, openFault: "float_open" },
    { id: "coil", n: "9", title: "Contactor coil", say: "Tap COIL. About 24 V and no pull-in is an open winding. About 0 V means a safety upstream is still open.", node: "coil", minV: 20, openFault: "open_coil" },
    { id: "t1", n: "10", title: "Load 240", say: "Tap T1. Contactor in should pass about 240 to the load.", node: "t1", minV: 200 },
    { id: "comp", n: "11", title: "Compressor / cap", say: "Tap COMP. 240 V and a hum is locked-rotor, not running amps. Open HERM cap. The outdoor fan can still run. Don't size a breaker from inrush.", node: "comp", minV: 200, openFault: "open_cap" },
  ];

  function has(id) {
    return !!placed[id];
  }

  function lugsFor(slotId) {
    return DEVICE_LUGS[slotId] || [];
  }

  function lugKind(id) {
    if (!id) return "";
    if (id.endsWith(".hot") || id === "src.hot") return "hot";
    if (id.endsWith(".n") || id === "src.n") return "n";
    if (id.endsWith(".gnd") || id === "src.gnd") return "gnd";
    return "";
  }

  function neighbors(node, color) {
    const out = [];
    runs.forEach((r) => {
      if (r.color !== color) return;
      if (r.a === node) out.push(r.b);
      if (r.b === node) out.push(r.a);
    });
    return out;
  }

  function connected(color, from, to) {
    if (!from || !to) return false;
    if (from === to) return true;
    const seen = new Set([from]);
    const q = [from];
    while (q.length) {
      const n = q.shift();
      const next = neighbors(n, color);
      for (let i = 0; i < next.length; i++) {
        const m = next[i];
        if (seen.has(m)) continue;
        if (m === to) return true;
        seen.add(m);
        q.push(m);
      }
    }
    return false;
  }

  function hotAt(lug) { return connected("hot", "src.hot", lug); }
  function neuAt(lug) { return connected("neutral", "src.n", lug); }
  function gndAt(lug) { return connected("ground", "src.gnd", lug); }

  function hasGroundFault() {
    return runs.some((r) => {
      const ka = lugKind(r.a);
      const kb = lugKind(r.b);
      const mixHG = (ka === "hot" && kb === "gnd") || (ka === "gnd" && kb === "hot");
      if (mixHG) return true;
      if (r.color === "hot" && (ka === "gnd" || kb === "gnd")) return true;
      return false;
    });
  }

  function landWire(color, a, b) {
    if (!a || !b || a === b) return false;
    if (!WIRE[color]) return false;
    const dup = runs.some((r) => r.color === color && ((r.a === a && r.b === b) || (r.a === b && r.b === a)));
    if (dup) return false;
    runs.push({ id: "w" + (runSeq++), color: color, a: a, b: b });
    return true;
  }

  function originForColor(color) {
    return "feed." + (color || "hot");
  }

  function termOf(lug) {
    if (!lug) return null;
    const parts = String(lug).split(".");
    const slot = parts[0];
    const tid = parts.slice(1).join(".");
    return (DEVICE_LUGS[slot] || []).find(function (x) { return x.id === tid; }) || null;
  }
  function colorFromLug(id) {
    const tm = termOf(id);
    if (tm && tm.accept) return tm.accept;
    const k = lugKind(id);
    if (k === "hot") return "hot";
    if (k === "n") return "neutral";
    if (k === "gnd") return "ground";
    return spool;
  }

  function wireGhostHtml(color) {
    const w = WIRE[color] || WIRE.hot;
    return '<i class="el-wire-lead ' + w.id + '"></i><strong>' + w.name + " · " + w.code + "</strong>";
  }

  function resolveDropTarget(el, color) {
    if (!el) return null;
    if (el.dataset && el.dataset.lug) return el.dataset.lug;
    const lugChild = el.closest ? el.closest("[data-lug]") : null;
    if (lugChild && lugChild.dataset.lug) return lugChild.dataset.lug;
    const slot = el.dataset && el.dataset.slot;
    if (!slot) return null;
    const suffix = color === "hot" ? "hot" : color === "neutral" ? "n" : "gnd";
    const want = slot + "." + suffix;
    if (host.querySelector('[data-lug="' + want + '"]')) return want;
    return null;
  }

  function lugMatch(color, lugId) {
    const tm = termOf(lugId);
    return !!(tm && tm.accept === color);
  }

  function highlightWireTargets(color, hoverEl) {
    if (!host) return;
    host.querySelectorAll("[data-lug]").forEach((b) => {
      const tm = termOf(b.dataset.lug);
      b.classList.toggle("wire-match", !!(tm && tm.accept === color));
      const hovered = !!(hoverEl && (hoverEl === b || (hoverEl.contains && hoverEl.contains(b)) || hoverEl.dataset.lug === b.dataset.lug));
      b.classList.toggle("over", hovered);
    });
  }

  function clearWireTargets() {
    if (!host) return;
    host.querySelectorAll("[data-lug]").forEach((b) => {
      b.classList.remove("wire-match", "over");
    });
  }

  function hideSpentSpools() {
    if (!host) return;
    const box = host.querySelector("#el-zoom-spools");
    if (!box) return;
    box.querySelectorAll(".el-spool").forEach(function (chip) {
      const lug = chip.getAttribute("data-for");
      const color = chip.getAttribute("data-spool");
      const spent = !!(lug && (wireOnLug(lug, color) || lugOccupied(lug)));
      if (spent) {
        chip.hidden = true;
        chip.classList.add("el-spent");
        chip.setAttribute("aria-hidden", "true");
        if (chip.parentNode) chip.parentNode.removeChild(chip);
      }
    });
    const left = box.querySelectorAll(".el-spool:not(.el-spent)");
    if (!left.length) {
      box.hidden = true;
      box.innerHTML = "";
      box.classList.add("el-spent-tray");
    } else {
      box.hidden = false;
      box.classList.remove("el-spent-tray");
    }
    if (window.LtDrag && typeof window.LtDrag.killGhost === "function") window.LtDrag.killGhost();
    host.querySelectorAll(".el-spool.dragging").forEach(function (n) {
      n.classList.remove("dragging");
    });
  }

  function refuseWire(color, toLug) {
    const tm = termOf(toLug);
    const w = WIRE[color] || WIRE.hot;
    const want = tm && WIRE[tm.accept] ? WIRE[tm.accept] : null;
    let why = want
      ? w.code + " does not land on " + (tm.label || "that screw") + ". That screw takes " + want.code + "."
      : "That color does not belong on that screw.";
    if (tm && tm.accept === "ground" && (color === "hot" || color === "l2")) why = "That's a hot on the ground screw. It pops the breaker.";
    if (tm && (tm.accept === "hot" || tm.accept === "l2") && color === "ground") why = "Green is equipment ground. It does not land on a hot screw.";
    if (tm && tm.accept === "hot" && color === "l2") why = "Red is L2. L1 takes black.";
    if (tm && tm.accept === "l2" && color === "hot") why = "Black is L1. L2 takes red.";
    if (tm && color === "neutral" && tm.accept !== "neutral" && tm.accept !== "c24") why = "Off-white is neutral. This screw is not the neutral.";
    const hint = host && host.querySelector("#el-zoom-hint");
    if (hint) hint.textContent = why;
    const say = host && host.querySelector("#el-guide-say");
    if (say && guideOn) say.textContent = why;
    const st = host && host.querySelector("#el-status");
    if (st) st.textContent = why;
    if (host && toLug) {
      host.querySelectorAll('[data-lug="' + toLug + '"]').forEach((n) => {
        n.classList.add("landed-bad");
        setTimeout(() => n.classList.remove("landed-bad"), 700);
      });
    }
    if (global.LtDrip) global.LtDrip.say("elec.bad");
    paintZoomSpools();
  }

  function dropWireOnLug(color, toLug, fromLug) {
    if (labMode === "defusal" || !toLug || !WIRE[color]) return false;
    if (!lugMatch(color, toLug)) {
      refuseWire(color, toLug);
      return false;
    }
    const from = fromLug || originForColor(color);
    if (!from || from === toLug) return false;
    landWire(color, from, toLug);
    eatSpoolChip(toLug, color);
    spool = color;
    pending = null;
    paintLugState();
    paintRuns();
    paintMeter();
    const slot = toLug.split(".")[0];
    if (zoomSlot === slot) syncZoom();
    else if (slot && labMode === "build") openZoom(slot === "src" ? "src" : slot);
    const ok = lugMatch(color, toLug);
    host.querySelectorAll('[data-lug="' + toLug + '"]').forEach((n) => {
      n.classList.add(ok ? "landed-ok" : "landed-bad");
      setTimeout(() => n.classList.remove("landed-ok", "landed-bad"), 700);
    });
    paintZoomSpools();
    hideSpentSpools();
    if (onXp) onXp(ok ? 3 : 1);
    onGuideEvent("land", { color: color, slot: slot, lug: toLug, ok: ok });
    if (ok) maybeAdvanceZoom();
    else {
      paintZoomNeed();
      paintZoomSpools();
    }
    hideSpentSpools();
    if (global.LtDrip) global.LtDrip.say(ok ? "elec.ok" : "elec.bad");
    return true;
  }

  function maybeAdvanceZoom() {
    if (!zoomSlot) return;
    paintZoomNeed();
    paintZoomSpools();
    paintZoomSvg();
    if (missingTerms(zoomSlot).length) return;
    const info = slotInfo(zoomSlot);
    const okEl = host && host.querySelector("#el-zoom-ok");
    if (okEl) {
      okEl.hidden = false;
      okEl.textContent = "Correct — " + info.name + " is landed like the can.";
    }
    if (onXp) onXp(12);
    if (window.CurriculumTrain) window.CurriculumTrain.stamp("electrical");
    markWiredSlots();
  }

  function markWiredSlots() {
    if (!host) return;
    host.querySelectorAll(".el-slot").forEach(function (el) {
      const id = el.dataset.slot;
      el.classList.toggle("wired-done", !!(id && termsFor(id).length && !missingTerms(id).length));
    });
  }

  function beginGuide() {
    guideOn = true;
    guideI = 0;
    labMode = "build";
    view = "ladder";
    callCool = true;
    loadKit("split");
    refreshSlots();
    paintMeter();
    closeZoom();
    paintGuide();
    setView("ladder");
  }

  function stopGuide() {
    guideOn = false;
    guideI = 0;
    paintGuide();
  }

  function guideStep() {
    return GUIDE[guideI] || GUIDE[GUIDE.length - 1];
  }

  function paintGuide(extra) {
    if (!host) return;
    const box = host.querySelector("#el-guide");
    if (!box) return;
    if (!guideOn) {
      if (!meterGuideOn) box.classList.remove("show");
      host.querySelectorAll(".el-guide-target").forEach((n) => n.classList.remove("el-guide-target"));
      const zc = host.querySelector("#el-zoom-coach");
      if (zc) zc.hidden = true;
      if (meterGuideOn) paintMeterGuide();
      return;
    }
    const s = guideStep();
    const last = guideI >= GUIDE.length - 1;
    box.classList.add("show");
    box.querySelector("#el-guide-step").textContent = "GUIDED WIRING · " + (guideI + 1) + "/" + GUIDE.length;
    box.querySelector("#el-guide-title").textContent = s.title;
    box.querySelector("#el-guide-say").textContent = extra || s.say;
    const zoomCoach = host.querySelector("#el-zoom-coach");
    if (zoomCoach) {
      zoomCoach.hidden = false;
      zoomCoach.textContent = extra || s.say;
    }
    const next = box.querySelector("#el-guide-next");
    if (next) {
      next.textContent = last ? "Done · free build" : (s.wait ? "I'm stuck — show me" : "Next");
      next.hidden = false;
    }
    paintGuideTarget();
    if (zoomSlot) paintZoomNeed();
  }

  function paintGuideTarget() {
    if (!host) return;
    host.querySelectorAll(".el-guide-target").forEach((n) => n.classList.remove("el-guide-target"));
    if (!guideOn) return;
    const s = guideStep();
    if (!s.wait) return;
    const parts = s.wait.split(":");
    if (parts[0] === "zoom") {
      const slot = host.querySelector('.el-slot[data-slot="' + parts[1] + '"]');
      if (slot) slot.classList.add("el-guide-target");
    }
    if (parts[0] === "land") {
      const color = parts[1];
      const slot = parts[2];
      const suffix = color === "hot" ? "hot" : color === "l2" ? "l2" : color === "neutral" ? "n" : color === "ground" ? "gnd" : color;
      host.querySelectorAll('[data-lug="' + slot + "." + suffix + '"]').forEach((n) => n.classList.add("el-guide-target"));
      const want = slot + "." + suffix;
      const spoolBtn = host.querySelector('.el-spool[data-for="' + want + '"]') || host.querySelector('.el-spool[data-spool="' + color + '"]');
      if (spoolBtn) spoolBtn.classList.add("el-guide-target");
    }
  }

  function onGuideEvent(type, detail) {
    if (!guideOn) return;
    const s = guideStep();
    if (!s || !s.wait) return;
    const parts = s.wait.split(":");
    if (parts[0] === "zoom" && type === "zoom" && detail === parts[1]) {
      advanceGuide();
      return;
    }
    if (parts[0] === "land" && type === "land" && detail && detail.color === parts[1] && detail.slot === parts[2]) {
      const suffix = parts[1] === "hot" ? "hot" : parts[1] === "l2" ? "l2" : parts[1] === "neutral" ? "n" : parts[1] === "ground" ? "gnd" : parts[1];
      const wantLug = parts[2] + "." + suffix;
      if (detail.lug && detail.lug !== wantLug) {
        const w = WIRE[parts[1]] || WIRE.hot;
        paintGuide("Wrong screw. " + w.code + " goes on " + suffix.toUpperCase() + ", not that one.");
        return;
      }
      if (detail.ok) advanceGuide();
      else {
        const w = WIRE[parts[1]] || WIRE.hot;
        paintGuide("Wrong screw. " + w.code + " goes on the matching stamp.");
      }
    }
  }

  function advanceGuide() {
    if (guideI < GUIDE.length - 1) {
      guideI += 1;
      const s = guideStep();
      if (s && s.id === "kit") setView("lugs");
      paintGuide();
    } else {
      stopGuide();
    }
  }

  function guideLandSpec() {
    if (!guideOn) return null;
    const s = guideStep();
    if (!s || !s.wait || s.wait.indexOf("land:") !== 0) return null;
    const parts = s.wait.split(":");
    const color = parts[1];
    const slot = parts[2];
    const suffix = color === "hot" ? "hot" : color === "l2" ? "l2" : color === "neutral" ? "n" : color === "ground" ? "gnd" : color;
    return { color: color, slot: slot, lug: slot + "." + suffix, say: s.say };
  }

  function guideStuck() {
    const s = guideStep();
    if (!s) return;
    if (!s.wait) {
      advanceGuide();
      return;
    }
    const parts = s.wait.split(":");
    if (parts[0] === "zoom") {
      openZoom(parts[1]);
      return;
    }
    if (parts[0] === "land") {
      const spec = guideLandSpec();
      if (!spec) return;
      openZoom(spec.slot);
      const landed = dropWireOnLug(spec.color, spec.lug, originForColor(spec.color));
      if (!landed) paintGuide("Do this: " + s.say);
      return;
    }
    paintGuide("Do this: " + s.say);
  }

  function bindWireDrags() {
    if (!window.LtDrag || labMode === "defusal") return;
    host.querySelectorAll(".el-spool[data-spool]").forEach((el) => {
      if (el.dataset.wireBound) return;
      el.dataset.wireBound = "1";
      const color = el.dataset.spool;
      const prefer = el.dataset.for || "";
      window.LtDrag.bindSource(el, {
        id: color + "|" + prefer,
        allowButtons: true,
        ghostClass: "el-wire-ghost",
        html: wireGhostHtml(color),
        dropSelector: ".el-zoom-screw",
        onDragStart() {
          el.dataset.skipClick = "1";
          spool = color;
          paintLugState();
          highlightWireTargets(color);
          const want = prefer && host.querySelector('.el-zoom-screw[data-lug="' + prefer + '"]');
          if (want) want.classList.add("el-guide-target");
        },
        onHover(target) {
          highlightWireTargets(color, target);
        },
        onHoverEnd() {
          clearWireTargets();
          hideLoupe();
        },
        onDrop(_key, _id, dropEl) {
          clearWireTargets();
          hideLoupe();
          const screw = dropEl && dropEl.closest ? dropEl.closest(".el-zoom-screw") : null;
          if (screw && screw.dataset.lug) {
            dropWireOnLug(color, screw.dataset.lug, originForColor(color));
            hideSpentSpools();
          }
        },
      });
    });
  }

  function pullRun(id) {
    runs = runs.filter((r) => r.id !== id);
    paintRuns();
    paintMeter();
  }

  function landFactory() {
    runs = [];
    pending = null;
    const add = (color, a, b) => landWire(color, a, b);
    if (has("breaker")) add("hot", "src.hot", "breaker.hot");
    const hotPrev = has("disconnect") ? "disconnect.hot" : (has("breaker") ? "breaker.hot" : "src.hot");
    if (has("disconnect") && has("breaker")) add("hot", "breaker.hot", "disconnect.hot");
    if (has("transformer")) {
      add("hot", hotPrev, "transformer.hot");
      add("neutral", "src.n", "transformer.n");
    }
    if (has("ground")) add("ground", "src.gnd", "ground.gnd");
    else if (has("disconnect")) add("ground", "src.gnd", "disconnect.gnd");
    else if (has("breaker")) add("ground", "src.gnd", "breaker.gnd");
    const gndPrev = has("ground") ? "ground.gnd" : (has("disconnect") ? "disconnect.gnd" : "breaker.gnd");
    ["contactor", "compressor", "fan", "blower", "heater", "inducer", "pump", "strips", "fuse"].forEach((id) => {
      if (!has(id)) return;
      add("hot", hotPrev, id + ".hot");
      add("ground", gndPrev, id + ".gnd");
      if (NEUTRAL_SLOTS[id] && id !== "transformer") add("neutral", "src.n", id + ".n");
    });
  }

  function circuit() {
    const groundedHot = hasGroundFault();
    const disc = has("disconnect") && fault !== "open_disc";
    const brk = has("breaker");
    const hotBrk = hotAt("breaker.hot");
    const gndOk = gndAt("disconnect.gnd") || gndAt("ground.gnd") || gndAt("breaker.gnd");
    const line = brk && hotBrk && gndOk && !groundedHot;
    const loadHot = line && disc && hotAt("disconnect.hot");
    const xfmrWired = !has("transformer") || hotAt("transformer.hot");
    const xfmr = loadHot && has("transformer") && fault !== "no_xfmr" && xfmrWired;
    const fuseOk = has("fuse") && !fusedBlown && fault !== "blown_fuse";
    const rHot = xfmr && fuseOk;
    const y = rHot && has("thermostat") && callCool;
    const g = rHot && has("thermostat") && callFan;
    const limitOk = fault !== "open_limit";
    const w = rHot && has("thermostat") && callHeat && limitOk;
    const o = rHot && has("thermostat") && callRev && has("solenoid");
    const hpc = has("hpc") && fault !== "open_hpc";
    const lpc = has("lpc") && fault !== "open_lpc";
    const flt = has("float") && fault !== "float_open";
    const path = y && hpc && lpc && flt;
    const lockoutHeld = has("lockout") && fault === "lockout";
    const coil = path && has("contactor") && fault !== "open_coil" && !lockoutHeld;
    const pulled = coil;
    const cap = has("capacitor") && fault !== "open_cap";
    const grounded = fault === "grounded";
    const compHot = !has("compressor") || hotAt("compressor.hot");
    const fanHot = !has("fan") || hotAt("fan.hot");
    const compPower = pulled && loadHot && has("compressor") && !grounded && compHot;
    const compRun = compPower && cap;
    /* HERM and FAN are parallel sections. An open herm cap does not kill the outdoor fan. */
    const fanRun = pulled && loadHot && has("fan") && has("capacitor") && fanHot;
    const heater = has("heater") && loadHot && !pulled && hotAt("heater.hot");
    const inducerRun = loadHot && has("inducer") && callHeat && limitOk && hotAt("inducer.hot") && neuAt("inducer.n");
    const gasOn = w && has("gasvalve") && inducerRun && (has("presssw") ? fault !== "open_press" : true);
    const stripsOn = loadHot && has("strips") && has("sequencer") && w && hotAt("strips.hot");
    const blowerRun = loadHot && has("blower") && (g || w || pulled) && hotAt("blower.hot");
    const rla = compRun ? 13.4 : 0;
    const lraAttempt = compPower && !cap ? 62 : 0;
    return {
      line, disc, loadHot, xfmr, rHot, y, g, w, o, hpc, lpc, flt, path, coil, pulled,
      cap, grounded, groundedHot, compPower, compRun, fanRun, heater, inducerRun, gasOn, stripsOn,
      blowerRun, rla, lraAttempt, fuseOk, hotBrk, gndOk, xfmrWired,
    };
  }

  function vacBetween(a, b, c) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair("l1", "l2") && c.line) return 241.0;
    if ((pair("l1", "gnd") || pair("l2", "gnd")) && c.line) return 120.6;
    if (pair("load1", "load2")) return c.loadHot ? 240.4 : 0;
    if (pair("t1", "t2")) return c.pulled && c.loadHot ? 239.8 : 0;
    if (pair("r", "c24")) return c.rHot ? 27.2 : 0;
    if (pair("y", "c24")) return c.y ? 26.8 : 0;
    if (pair("g", "c24")) return c.g ? 26.9 : 0;
    if (pair("w", "c24")) return c.w ? 26.7 : 0;
    if (pair("o", "c24")) return c.o ? 26.6 : 0;
    /* Across a series safety: closed ~0 V, open ~24 V. Output-to-common stays below. */
    if (pair("y", "hpc")) {
      if (!c.y) return 0;
      return c.hpc ? 0.2 : 26.5;
    }
    if (pair("hpc", "lpc")) {
      if (!(c.y && c.hpc)) return 0;
      return c.lpc ? 0.2 : 26.5;
    }
    if (pair("lpc", "float")) {
      if (!(c.y && c.hpc && c.lpc)) return 0;
      return c.flt ? 0.2 : 26.4;
    }
    if (pair("w", "limit")) {
      const wIn = c.rHot && has("thermostat") && callHeat;
      if (!wIn) return 0;
      return c.w ? 0.2 : 26.4;
    }
    if (pair("coil", "c24")) return c.path && has("contactor") ? 26.4 : 0;
    if (pair("hpc", "c24")) return c.y && c.hpc ? 26.5 : 0;
    if (pair("lpc", "c24")) return c.y && c.hpc && c.lpc ? 26.5 : 0;
    if (pair("float", "c24")) return c.path ? 26.4 : 0;
    if (pair("limit", "c24")) return c.w ? 26.4 : 0;
    if (pair("compr", "compc") || pair("t1", "compc")) return c.compPower ? 239.2 : 0;
    if (pair("fanlead", "t2")) return c.fanRun ? 238.5 : 0;
    if (pair("striplead", "l2")) return c.stripsOn ? 239.0 : 0;
    if (pair("load1", "l1")) return c.disc ? 0.04 : (c.line ? 240.2 : 0);
    return 0;
  }

  function ohmsBetween(a, b, c) {
    if (c.loadHot || c.rHot) return null;
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair("compr", "compc") && has("compressor")) return c.grounded ? 0.2 : 1.8;
    if (pair("comps", "compc") && has("compressor")) return c.grounded ? 0.2 : 2.6;
    if (pair("compr", "comps") && has("compressor")) return 4.3;
    if (pair("compc", "gnd") && has("compressor")) return c.grounded ? 0.4 : 9999;
    if (pair("caph", "capc") && has("capacitor")) return 9999;
    if (pair("capf", "capc") && has("capacitor")) return 9999;
    if (pair("caph", "capf") && has("capacitor")) return 9999;
    if (pair("coil", "c24") && has("contactor")) return fault === "open_coil" ? 9999 : 48;
    if (pair("hpc", "y") && has("hpc")) return fault === "open_hpc" ? 9999 : 0.3;
    if (pair("lpc", "y") && has("lpc")) return fault === "open_lpc" ? 9999 : 0.3;
    if (pair("limit", "w") && has("limit")) return fault === "open_limit" ? 9999 : 0.3;
    return 9999;
  }

  function capBetween(a, b) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (!has("capacitor")) return 0;
    /* HERM and FAN share C and are parallel sections. An open HERM does not open FAN. */
    const herm = fault === "open_cap" ? 0 : 35.2;
    const fan = 5.1;
    if (pair("caph", "capc")) return herm;
    if (pair("capf", "capc")) return fan;
    /* HERM to FAN is the two sections in series, not the sum. */
    if (pair("caph", "capf")) {
      if (!herm || !fan) return 0;
      return Math.round((herm * fan) / (herm + fan) * 10) / 10;
    }
    return 0;
  }

  function compAmps(c) {
    if (c.compRun) return 13.4;
    if (c.compPower && !c.cap) return 62;
    return 0;
  }

  function bothHots(a, b) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    return pair("l1", "l2") || pair("t1", "t2") || pair("load1", "load2");
  }

  function ampAt(probe, c) {
    const compA = compAmps(c);
    const fanA = c.fanRun ? 1.1 : 0;
    if (probe === "compr" || probe === "compc") return compA;
    if (probe === "fanlead") return fanA;
    if (probe === "t1" || probe === "t2") return compA + fanA;
    if (probe === "striplead") return c.stripsOn ? 18.4 : 0;
    if (probe === "l1" || probe === "l2" || probe === "load1" || probe === "load2") {
      return compA + fanA + (c.stripsOn ? 18.4 : 0);
    }
    return 0;
  }

  function onMeterEvent(type, val) {
    if (!meterGuideOn) return;
    const s = METER_GUIDE[meterGuideI];
    if (!s || !s.wait) return;
    const parts = s.wait.split(":");
    if (s.wait === "jacks" && type === "jack" && dmmJackBlk === "com" && dmmJackRed === "v") { meterGuideI += 1; paintMeterGuide(); return; }
    if (parts[0] === "dial" && type === "dial" && mode === parts[1]) { meterGuideI += 1; paintMeterGuide(); return; }
    if (parts[0] === "read" && type === "read") {
      const pair = (red === parts[1] && black === parts[2]) || (red === parts[2] && black === parts[1]);
      if (pair && typeof val === "number" && val >= Number(parts[3] || 0)) { meterGuideI += 1; paintMeterGuide(); if (onXp) onXp(8); }
    }
    if (s.wait === "ohm-lesson" && (type === "ohm-live" || type === "ohm-ok" || (type === "dial" && mode === "ohm"))) { meterGuideI += 1; paintMeterGuide(); }
  }
  let pendingLeadBoard = "";
  function paintMeterGuide() {
    const box = host && host.querySelector("#el-guide");
    if (!box || !meterGuideOn) return;
    const s = METER_GUIDE[meterGuideI] || METER_GUIDE[METER_GUIDE.length - 1];
    const last = meterGuideI >= METER_GUIDE.length - 1;
    box.classList.add("show");
    box.querySelector("#el-guide-step").textContent = "METER SCHOOL · " + (meterGuideI + 1) + "/" + METER_GUIDE.length;
    box.querySelector("#el-guide-title").textContent = s.title;
    box.querySelector("#el-guide-say").textContent = s.say;
    const next = box.querySelector("#el-guide-next");
    if (next) { next.textContent = last ? "Practice on your own" : "Next"; next.hidden = false; }
    if (s.id === "rc" && leadBoard !== "transformer") pendingLeadBoard = "transformer";
    else if ((s.id === "l1l2" || s.id === "l1g" || s.id === "jacks" || s.id === "dial" || s.id === "ohm") && leadBoard !== "disconnect") pendingLeadBoard = "disconnect";
    else pendingLeadBoard = "";
    if (pendingLeadBoard && pendingLeadBoard !== leadBoard) {
      const next = pendingLeadBoard;
      pendingLeadBoard = "";
      openLeadZoom(next);
    }
  }
  function askHubMeter() {
    const s = METER_GUIDE[meterGuideI] || METER_GUIDE[0];
    const q = "How do I use a voltmeter? " + s.title + ". " + s.say;
    if (window.HubAI && window.HubAI.say) window.HubAI.say(q);
    else if (window.HubAI) { window.HubAI.open(); window.HubAI.ask(q); }
  }
  function paintDmmJacks() {
    if (!host) return;
    const a = host.querySelector("#dmm-jack-a");
    const c = host.querySelector("#dmm-jack-com");
    const v = host.querySelector("#dmm-jack-v");
    if (a) a.classList.toggle("in", dmmJackRed === "a");
    if (c) c.classList.toggle("in", dmmJackBlk === "com");
    if (v) v.classList.toggle("in", dmmJackRed === "v");
    const lr = host.querySelector("#dmm-lead-red");
    const lb = host.querySelector("#dmm-lead-blk");
    if (lr) lr.classList.toggle("active", dmmLead === "red");
    if (lb) lb.classList.toggle("active", dmmLead === "blk");
  }
  function plugJack(jack) {
    if (jack === "com") dmmJackBlk = "com";
    else dmmJackRed = jack;
    onMeterEvent("jack");
    paintDmmJacks();
    paintMeter();
  }
  function isContactNode(id) {
    return id === "hpc" || id === "lpc" || id === "float" || id === "limit";
  }

  /* A 0 V reading is a closed contact only after the call has reached that box. */
  function contactFed(id, c) {
    if (id === "limit") return !!(c && c.rHot && has("thermostat") && callHeat);
    if (id === "hpc" || id === "lpc" || id === "float") return !!(c && c.y);
    return false;
  }

  function defusalVacNote(v) {
    const id = ladderTap;
    const c = circuit();
    const onOpen = !!(job && id && PROVE[job.id] === id);
    if (isContactNode(id)) {
      if (!contactFed(id, c)) return "No call on this side yet. About 0 V is not a closed contact until the call arrives. Don't jump it.";
      if (v >= 20) return "About " + Math.round(v) + " V across this safety. That's the open. The coil sees about 0. Don't jump it.";
      return "About 0 V. A good closed contact drops about 0. Keep walking. Same current, next box.";
    }
    if (id === "coil") {
      if (v >= 20 && job && job.id === "coil") return "About 24 V on the coil and it never pulls in. Open winding. Replace the contactor.";
      if (v >= 20) return "About 24 V on the coil. The call made it through the safeties.";
      return "Coil sees about 0. The open safety upstream has about 24 V across it. Don't replace the coil.";
    }
    if (v > 200) return "About " + Math.round(v) + " volts. Hot. Keep walking.";
    if (v > 20) return "About " + Math.round(v) + " volts. This box is live. Keep walking.";
    if (!onOpen) {
      if (v > 20) return "About " + Math.round(v) + " volts. This box is live. Keep walking.";
      return "0 volts. Something ahead of this load is open. Meter the next box in order.";
    }
    if (job.id === "disc") return "0 volts on the load. Line is still about 240. The puller is open.";
    if (job.id === "swap") return "0 volts on Y. Yellow was landed on G. The fan runs. The condenser never starts.";
    if (job.id === "rv") return "0 volts past the 3A. The reversing valve is shorted. Isolate O, then replace the fuse.";
    if (job.id === "cap") return "Contactor is in. This is not a 24 V open. Read the cap with power off.";
    return "0 volts on the open. The call dies here.";
  }

  function readMeter() {
    const c = circuit();
    if (mode === "aac") {
      if (bothHots(red, black)) {
        return { val: "0.0", unit: "A", note: "Both hots of a 240 V load are in the jaw. They cancel toward 0. Clamp one hot." };
      }
      const a = ampAt(red, c);
      let note = "Clamp one hot only. Both hots in the jaw cancel toward 0.";
      if (a >= 40) note = "Locked-rotor, not running amps. Don't size a breaker from inrush. Outdoor fan is a parallel branch and can still run.";
      else if (a > 10) note = "Running amps on one hot. Not inrush. Don't put both hots in the jaw.";
      return { val: a.toFixed(1), unit: "A", note: note };
    }
    if (meterFuse && !ladderProof) {
      return { val: "0.00", unit: "FUSE", note: "Meter fuse is open. That is not the equipment 3A. Replace the meter fuse. The jaw still reads amps." };
    }
    if (dmmJackBlk !== "com") return { val: "—.—", unit: "", note: "Black lead isn't in COM. First jack, every time." };
    if (dmmJackRed === "a") {
      meterFuse = true;
      return { val: "0.00", unit: "FUSE", note: "Voltage into the amp jack opens the meter fuse. Not the equipment 3A. Red goes in VΩ. Clamp one hot for amps." };
    }
    if (dmmJackRed !== "v") {
      return { val: "—.—", unit: "", note: "Red lead in VΩ for volts and ohms." };
    }
    if (mode === "ohm" || mode === "cont" || mode === "cap") {
      if ((c.loadHot || c.rHot) && !ladderProof) {
        meterFuse = true;
        onMeterEvent("ohm-live");
        return { val: "0.00", unit: "FUSE", note: "You ohmed a live circuit. That opens the meter fuse, not the equipment 3A. Kill power and replace the meter fuse." };
      }
      if (ladderProof && mode === "cap") {
        const u = capBetween(red, black);
        const fanLeg = (red === "capf" && black === "capc") || (black === "capf" && red === "capc");
        const hermLeg = (red === "caph" && black === "capc") || (black === "caph" && red === "capc");
        let note = u
          ? "Power-off µF. Don't read a live cap — that opens the meter fuse."
          : "Power-off µF. OL on this section. Don't read a live cap — that opens the meter fuse.";
        if (fault === "open_cap" && hermLeg) note = "Power-off µF. OL on HERM. FAN is a parallel section and can still read microfarads. Outdoor fan can still run.";
        if (fault === "open_cap" && fanLeg && u) note = "Power-off µF. FAN section is still about " + u.toFixed(1) + " µF. HERM is the open parallel section. The outdoor fan can still run.";
        return { val: u ? u.toFixed(1) : "OL", unit: "µF", note: note };
      }
      if (ladderProof && mode === "ohm") {
        return { val: "0.4", unit: "Ω", note: "Power-off. 0.4 Ω common to ground. Don't ohm a live circuit — that opens the meter fuse. Isolate compressor C." };
      }
    }
    if (mode === "vac") {
      const v = vacBetween(red, black, c);
      onMeterEvent("read", v);
      let note = v > 200 ? "Line voltage." : v > 20 ? "Control voltage." : "Dead — check disconnect, fuse, transformer, or call.";
      if (isContactNode(red) || isContactNode(black) || (red === "y" && black === "hpc") || (red === "hpc" && black === "y")) {
        const which = isContactNode(red) ? red : (isContactNode(black) ? black : "hpc");
        if (!contactFed(which, c)) note = "No call on this side yet. About 0 V is not a closed contact until the call arrives. Don't jump a safety.";
        else note = v >= 20 ? "About 24 V across an open safety. The coil sees about 0. Don't jump it." : "About 0 V. A good closed contact drops about 0.";
      }
      if (labMode === "defusal" && job && !defused && !boom) note = defusalVacNote(v);
      return { val: v.toFixed(1), unit: "VAC", note: note };
    }
    if (mode === "vdc") {
      const v = vacBetween(red, black, c);
      return { val: v > 15 ? "0.2" : "0.0", unit: "VDC", note: v > 15 ? "That's AC. Dial VAC." : "No DC on this circuit." };
    }
    if (mode === "ohm") {
      const r = ohmsBetween(red, black, c);
      if (r == null) return { val: "OL", unit: "Ω", note: "Lock it out first." };
      const onCap = has("capacitor") && (
        (red === "caph" || red === "capf" || black === "caph" || black === "capf") &&
        (red === "capc" || black === "capc" || red === "caph" || red === "capf")
      );
      if (r >= 9999) {
        if (onCap) return { val: "OL", unit: "Ω", note: "A run cap charges to OL on ohms. That is not a short, and it is not the µF. Kill power, then read µF. HERM and FAN are parallel — an open HERM does not kill the fan section." };
        return { val: "OL", unit: "Ω", note: "Open circuit." };
      }
      const winding = (red === "compr" && (black === "compc" || black === "comps")) ||
        (black === "compr" && (red === "compc" || red === "comps")) ||
        ((red === "comps" && black === "compc") || (black === "comps" && red === "compc"));
      if (winding && has("compressor") && fault !== "grounded") {
        return { val: r.toFixed(1), unit: "Ω", note: "Copper only. Do not treat V ÷ R as running current. RLA is on the nameplate. LRA is locked-rotor, not this ohm reading." };
      }
      if (r < 1 && fault === "grounded") return { val: r.toFixed(1), unit: "Ω", note: "Winding to ground — bad compressor." };
      const coilPair = (red === "coil" && black === "c24") || (black === "coil" && red === "c24");
      if (coilPair && has("contactor")) {
        return { val: r.toFixed(1), unit: "Ω", note: "Contactor coil. R = V ÷ I. About 48 Ω on 24 V is about 0.5 A. That is coil current, not a motor winding." };
      }
      if (r < 1) return { val: r.toFixed(1), unit: "Ω", note: "About 0 Ω. Closed contact. An open safety reads OL. Don't jump it." };
      return { val: r.toFixed(1), unit: "Ω", note: "Power off. A motor winding's ohms are copper only — do not treat V ÷ R as running amps." };
    }
    if (mode === "cont") {
      const r = ohmsBetween(red, black, c);
      if (r == null) return { val: "OL", unit: "CONT", note: "Lockout first." };
      return { val: r < 50 ? "BEEP" : "OL", unit: "CONT", note: r < 50 ? "Path closed." : "Open." };
    }
    if (mode === "cap") {
      const u = capBetween(red, black);
      const fanLeg = (red === "capf" && black === "capc") || (black === "capf" && red === "capc");
      const hermLeg = (red === "caph" && black === "capc") || (black === "caph" && red === "capc");
      let note = u ? "Power off. Discharge the cap, then read HERM–C or FAN–C." : "No cap in circuit, or that section is open. Read µF with power off — ohms on a cap goes to OL and is not the microfarad.";
      if (fault === "open_cap" && hermLeg) note = "OL µF on HERM. Open herm section. FAN is parallel and can still read microfarads. Outdoor fan can still run. Don't size a breaker from inrush.";
      if (fault === "open_cap" && fanLeg && u) note = "FAN section is still about 5 µF. HERM is the open parallel section. The outdoor fan can still run.";
      return { val: u ? u.toFixed(1) : "OL", unit: "µF", note: note };
    }
    return { val: "—. —", unit: "", note: "" };
  }

  function statusLine(c) {
    if (labMode === "defusal" && job) {
      if (boom) return "Callback lost. You cut the live or ran out of time.";
      if (job.id === "rv" && fusePopped && !isolated && !defused) return "New 3A pops. The reversing valve is still shorted.";
      if (defused) return "Call closed. Next call stays on this bay.";
      if (c.compRun) return "Compressor is running — but this callback is still armed. Cut the open, not the live.";
      if (fault === "open_hpc" || fault === "open_lpc" || fault === "float_open") {
        return "Y is calling and a safety is open. Meter the 24V series string.";
      }
      if (fault === "open_cap") return "Contactor in. Compressor amps are locked-rotor, not RLA. Outdoor fan can still run. Read µF with power off.";
      if (fault === "grounded") return "Lock it out. Ohm C to ground before you touch the 3A. Live ohms open the meter fuse.";
      if (fault === "open_coil") return "About 24 V is on the coil and it does not pull in. Open winding. 0 V at the coil means a safety upstream. Don't jump a safety.";
      if (fault === "open_disc") return "No 240 past the disconnect. Meter load side.";
      if (fault === "open_limit") return "W is up, limit is open. Don't jump the gas valve.";
      if (fault === "blown_fuse") return "3A is open. Find the short on O/B before you slap a new fuse.";
      return job.brief;
    }
    if (c.groundedHot) return "You landed hot on ground. That's a dead short. Pull that wire — black is HOT, green is GROUND.";
    if (!has("breaker")) return "Drop the 2-pole breaker — nothing is live yet.";
    if (!c.hotBrk) return "Drag BLACK onto the breaker H screw. Black is hot.";
    if (!has("disconnect")) return "Line is at the disconnect. Drop it, then drag black from the breaker H to the disconnect H.";
    if (!hotAt("disconnect.hot")) return "Drag BLACK onto the disconnect H screw. Hot doesn't jump by itself.";
    if (!c.gndOk) return "Drag GREEN onto the disconnect G (or the ground lug). Green is ground.";
    if (!has("transformer")) return "No 24V. Drop the control transformer.";
    if (!hotAt("transformer.hot") || !neuAt("transformer.n")) {
      return "Drag BLACK onto transformer H and OFF-WHITE onto N. Neutral is cream so it shows on the white box.";
    }
    if (!has("fuse") || fusedBlown) return "Control fuse missing or blown. Replace the 3A on R.";
    if (!has("thermostat")) return "24V is up. Drop a thermostat and call Y.";
    if (!callCool && !callHeat) return "Stat is in. Turn on COOL (Y) or HEAT (W).";
    if (callCool && (!has("hpc") || !has("lpc") || !has("float"))) return "Y is calling. Series safety: HPC, LPC, and float must be in.";
    if (callCool && !has("contactor")) return "Safeties closed. Drop the contactor.";
    if (has("contactor") && !hotAt("contactor.hot")) return "Run BLACK from the disconnect H to the contactor H.";
    if (callCool && !has("capacitor")) return "Contactor will pull in, compressor will hum. Drop the dual run cap.";
    if (callCool && !has("compressor")) return "Power path is ready. Drop the compressor.";
    if (has("compressor") && !hotAt("compressor.hot")) return "Run BLACK to the compressor H and GREEN to its G. That's the load.";
    if (c.compRun) return "Legal start — compressor and OD fan running. Probe RLA and 24V to prove it.";
    if (c.stripsOn) return "Electric heat is on. Clamp the strip lead.";
    if (c.gasOn) return "Gas valve is open, inducer running. Limit is closed.";
    if (c.grounded) return "Shorted winding — meter C to ground. Bad compressor, not a charge problem.";
    if (c.compPower && !c.cap) return "Hum, no start. Locked-rotor amps, not RLA. Outdoor fan is parallel and can still run. Power off before µF. Don't size a breaker from inrush.";
    if (fault === "open_coil") return "About 24 V is across the coil and it never pulls in. The winding is open. A safety upstream leaves the coil at about 0.";
    if (c.y && !c.path) return "Y is calling but a safety is open. About 24 V across that switch. The coil sees about 0. Don't jump it.";
    if (c.pulled && !c.loadHot) return "Coil in, no 240 on T1/T2. Check disconnect and breaker.";
    if (c.rHot && !c.y && !c.w) return "24V is up. Turn on Y or W.";
    return "Circuit incomplete — finish line, control, and loads. Load a kit, then RUN the wires: black hot, off-white neutral, green ground.";
  }

  function thumb(p) {
    if (p.img) return '<img class="part-img" src="' + p.img + '" alt="" draggable="false" />';
    return '<span class="ico">' + p.icon + "</span>";
  }

  function clearTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = 0;
    }
  }

  function loadKit(kitId) {
    const kit = KITS[kitId] || KITS.split;
    activeKit = kitId;
    placed = {};
    kit.parts.forEach((id) => {
      const def = PARTS.find((p) => p.id === id);
      if (def && def.slot) placed[def.slot] = id;
    });
    fusedBlown = fault === "blown_fuse";
    if (labMode !== "defusal") {
      runs = [];
      pending = null;
    }
    landFactory();
  }

  function setLabMode(next) {
    const wantGuide = next === "guide";
    labMode = next === "defusal" ? "defusal" : "build";
    guideOn = wantGuide;
    guideI = 0;
    satBay = null;
    tutOn = false;
    tutStep = 0;
    satI = 0;
    if (labMode === "defusal" || wantGuide) {
      tsOn = false;
    } else {
      tsOn = true;
      sheetNote = (TS_NOCOOL[tsI] && TS_NOCOOL[tsI].say) || TS_NOCOOL[0].say;
    }
    view = "ladder";
    meteredOpen = false;
    ladderTap = null;
    isolated = false;
    fusePopped = false;
    clearTimer();
    job = null;
    cutSet = {};
    defused = false;
    boom = false;
    wonFired = false;
    probed = false;
    timeLeft = 0;
    runs = [];
    pending = null;
    if (labMode === "build") {
      fault = "none";
      fusedBlown = false;
      meterFuse = false;
      ladderProof = false;
    }
    build();
    wire();
    if (wantGuide) beginGuide();
  }

  function startJob(jobId, asTut) {
    const found = JOBS.find((j) => j.id === jobId) || JOBS[0];
    job = found;
    labMode = "defusal";
    tutOn = !!asTut;
    tutStep = 0;
    satI = 0;
    tsOn = false;
    view = "ladder";
    meteredOpen = false;
    ladderTap = null;
    isolated = false;
    fusePopped = false;
    cutSet = {};
    defused = false;
    boom = false;
    wonFired = false;
    probed = false;
    fault = found.fault || "none";
    callCool = !!found.cool;
    callFan = !!found.fan;
    callHeat = !!found.heat;
    callRev = !!found.rev;
    fusedBlown = fault === "blown_fuse";
    meterFuse = false;
    ladderProof = false;
    loadKit(found.kit || "split");
    if (found.id === "fuse") fusedBlown = true;
    landFactory();
    armJobMeter();
    timeLeft = found.seconds;
    clearTimer();
    sheetNote = satCue(satStepsFor(found)[0], found);
    if (!tutOn) timerId = setInterval(tick, 1000);
    build();
    wire();
    if (onXp) onXp(5);
  }

  function tick() {
    if (defused || boom || labMode !== "defusal" || !job) return;
    timeLeft -= 1;
    paintTimer();
    if (timeLeft <= 0) {
      timeLeft = 0;
      boomOut("time");
    }
  }

  function cutWire(wid) {
    if (!job || defused || boom) return { result: "idle" };
    const w = job.wires.find((x) => x.id === wid);
    if (!w || cutSet[wid]) return { result: "idle" };
    cutSet[wid] = true;
    if (w.cut === "boom") {
      boomOut("cut");
      return { result: "boom" };
    }
    paintDefusal();
    if (w.cut === "win") {
      winOut();
      return { result: "win" };
    }
    return { result: "ok" };
  }

  function replacePart() {
    if (!job || !job.replaceWin || defused || boom) return { result: "idle" };
    if (job.isolate && job.id !== "rv") return { result: "idle" };
    if (!meteredOpen) {
      sheetNote = "Meter it first. " + (satWantId() ? satCue(satWantId(), job) : "Meter the next box in order. An open safety is about 24 V across it. Then replace.");
      const st = host && host.querySelector("#el-status");
      if (st) st.textContent = sheetNote;
      const read = host && host.querySelector("#el-ladder-read");
      if (read) read.textContent = sheetNote;
      const kick = host && host.querySelector(".el-ladder-kicker");
      if (kick) kick.textContent = sheetNote;
      return { result: "need-meter" };
    }
    if (job.id === "rv" && !isolated) {
      fusePopped = true;
      fusedBlown = true;
      sheetNote = "New 3A pops. The reversing valve is still shorted. Hit Isolate O, then replace the fuse.";
      const read = host && host.querySelector("#el-ladder-read");
      if (read) read.textContent = sheetNote;
      paintMeter();
      return { result: "pop" };
    }
    placed[job.replaceWin] = job.replaceWin;
    if (job.replaceWin === "fuse") fusedBlown = false;
    fault = "none";
    refreshSlots();
    paintMeter();
    winOut();
    return { result: "win" };
  }

  function boomOut(why) {
    if (defused || boom) return;
    boom = true;
    clearTimer();
    const ov = host.querySelector("#el-boom");
    if (ov) {
      ov.classList.add("show");
      const msg = ov.querySelector(".el-overlay-msg");
      if (msg) {
        msg.textContent = why === "time"
          ? "Clock hit zero. Customer is still hot. That's a callback."
          : "You guessed without a meter. That's a callback.";
      }
    }
    paintDefusal();
    paintMeter();
  }

  function winOut() {
    if (defused || boom) return;
    defused = true;
    clearTimer();
    if (job && job.id) markSatDone(job.id);
    const ov = host.querySelector("#el-win");
    if (ov) {
      ov.classList.add("show");
      const msg = ov.querySelector(".el-overlay-msg");
      if (msg) {
        msg.textContent = tutOn
          ? "You metered the open and replaced it. That's a Saturday callback. The other bays are the same move, on a clock."
          : "Call closed. Next call stays on this bay. Clock out from the bay list when the day is done.";
      }
    }
    if (tutOn) {
      try { localStorage.setItem("lt-sat-tut-v1", "1"); } catch (_) {}
    }
    paintDefusal();
    paintMeter();
    if (onXp) onXp(80);
    if (window.CurriculumTrain) window.CurriculumTrain.stamp("defusal");
  }

  function renderPalette(tab) {
    const box = host.querySelector("#el-items");
    if (!box) return;
    box.innerHTML = "";
    let list = PARTS.filter((p) => p.group === tab);
    if (labMode === "defusal" && job) {
      list = PARTS.filter((p) => p.id === "dmm" || (job.replaceWin && p.slot === job.replaceWin));
    }
    list.forEach((p) => {
      const el = document.createElement("div");
      el.className = "sb-item";
      el.draggable = !!p.slot;
      el.dataset.id = p.id;
      el.innerHTML = thumb(p) + "<div><strong>" + p.name + "</strong><small>" + p.desc + "</small></div>";
      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", p.id);
        e.dataTransfer.effectAllowed = "copy";
        if (window.LtDrag && window.LtDrag.setHtml5Image) {
          window.LtDrag.setHtml5Image(e, { html: thumb(p), label: p.name });
        }
      });
      if (window.LtDrag && p.slot) {
        window.LtDrag.bindSource(el, {
          id: p.id,
          html: thumb(p) + "<strong>" + p.name + "</strong>",
          slotSelector: "#el-board .el-slot",
          onHover(slot, id, ev) {
            showLoupe(id, slot, ev);
          },
          onHoverEnd() {
            hideLoupe();
          },
          onDrop(slotId, id) {
            place(slotId, id);
            openZoom(slotId);
          },
        });
      }
      el.onclick = () => {
        if (p.slot && (!placed[p.slot] || (labMode === "defusal" && job && job.replaceWin === p.slot))) {
          place(p.slot, p.id);
        }
      };
      box.appendChild(el);
    });
  }

  function place(slot, id) {
    const def = PARTS.find((p) => p.id === id);
    if (!def || def.slot !== slot) return;
    if (labMode === "defusal" && job) {
      if (job.replaceWin !== slot) return;
      if (!meteredOpen) {
        const st = host && host.querySelector("#el-status");
        if (st) st.textContent = "HUB: meter the bad box first. Don't shotgun the part.";
        return;
      }
    }
    placed[slot] = id;
    if (labMode === "defusal" && job && job.replaceWin === slot && !boom && !defused) {
      if (job.id === "rv" && !isolated) {
        delete placed[slot];
        fusePopped = true;
        fusedBlown = true;
        const read = host && host.querySelector("#el-ladder-read");
        if (read) read.textContent = "New 3A pops. The reversing valve is still shorted.";
        refreshSlots();
        paintMeter();
        return;
      }
      if (job.id === "fuse") {
        delete placed[slot];
        const st = host && host.querySelector("#el-status");
        if (st) st.textContent = "New 3A pops. The compressor is still shorted to ground.";
        refreshSlots();
        paintMeter();
        return;
      }
      if (slot === "fuse") fusedBlown = false;
      fault = "none";
      refreshSlots();
      paintMeter();
      winOut();
      return;
    }
    refreshSlots();
    paintMeter();
    if (labMode === "build") openZoom(slot);
    if (onXp && Object.keys(placed).length === 8) onXp(20);
  }

  function lugButtons(slotId) {
    const lugs = lugsFor(slotId);
    if (!lugs.length) return "";
    return '<div class="el-lugs">' + lugs.map((l) =>
      '<button type="button" class="el-lug ' + l.cls + (pending === slotId + "." + l.id ? " pending" : "") +
      '" data-lug="' + slotId + "." + l.id + '" title="' + l.title + '"' +
      (labMode === "defusal" ? " disabled" : "") + ">" + l.label + "</button>"
    ).join("") + "</div>";
  }

  function bindLugs(root) {
    (root || host).querySelectorAll("[data-lug]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onLug(b.dataset.lug);
      };
      bindLugWire(b);
    });
  }

  function bindLugWire(el) {
    if (!window.LtDrag || labMode === "defusal" || el.disabled) return;
    if (el.dataset.wireBound) return;
    el.dataset.wireBound = "1";
    const fromId = el.dataset.lug;
    const color = colorFromLug(fromId);
    window.LtDrag.bindSource(el, {
      id: fromId,
      allowButtons: true,
      ghostClass: "el-wire-ghost",
      html: wireGhostHtml(color),
      dropSelector: ".el-zoom-screw",
      onDragStart() {
        spool = colorFromLug(fromId);
        pending = fromId;
        paintLugState();
        highlightWireTargets(spool);
      },
      onHover(target, id) {
        highlightWireTargets(colorFromLug(id), target);
      },
      onHoverEnd() {
        clearWireTargets();
      },
      onDrop(_key, id, dropEl) {
        clearWireTargets();
        const screw = dropEl && dropEl.closest ? dropEl.closest(".el-zoom-screw") : dropEl;
        const lug = screw && screw.dataset.lug;
        dropWireOnLug(colorFromLug(id), lug, id);
        hideSpentSpools();
      },
    });
  }

  function onLug(id) {
    if (labMode === "defusal") return;
    const slot = id.split(".")[0];
    if (!zoomSlot || zoomSlot !== slot) {
      openZoom(slot === "src" ? "src" : slot);
      pending = id;
      paintLugState();
      syncZoom();
      return;
    }
    if (!pending) {
      if (spool) {
        dropWireOnLug(spool, id, originForColor(spool));
        return;
      }
      pending = id;
      paintLugState();
      syncZoom();
      return;
    }
    if (pending === id) {
      pending = null;
      paintLugState();
      syncZoom();
      return;
    }
    if (String(pending).indexOf("feed.") === 0) {
      dropWireOnLug(spool, id, pending);
      return;
    }
    if (!lugMatch(spool, id)) {
      refuseWire(spool, id);
      return;
    }
    landWire(spool, pending, id);
    eatSpoolChip(id, spool);
    const landedOk = lugMatch(spool, id) || lugMatch(spool, pending);
    pending = null;
    paintRuns();
    paintMeter();
    syncZoom();
    hideSpentSpools();
    if (onXp) onXp(2);
    if (landedOk) maybeAdvanceZoom();
  }

  function paintLugState() {
    if (!host) return;
    host.querySelectorAll("[data-lug]").forEach((b) => {
      b.classList.toggle("pending", b.dataset.lug === pending);
    });
    host.querySelectorAll(".el-spool").forEach((b) => {
      b.classList.toggle("active", b.dataset.spool === spool);
    });
  }

  function srcLugs() {
    return [
      { id: "hot", cls: "hot", label: "H", title: "HOT · black" },
      { id: "n", cls: "neu", label: "N", title: "NEUTRAL · off-white" },
      { id: "gnd", cls: "gnd", label: "G", title: "GROUND · green" },
    ];
  }

  function termsFor(slotId) {
    return (DEVICE_LUGS[slotId] || []).map(function (l) {
      const w = WIRE[l.accept] || WIRE.hot;
      return Object.assign({ cls: w.cls, title: l.label + " · " + l.sub + " · " + w.code }, l);
    });
  }

  function lugId(slotId, termId) {
    return (slotId === "src" ? "src." : slotId + ".") + termId;
  }

  function wireOnLug(lug, color) {
    return runs.some((r) => r.color === color && (r.a === lug || r.b === lug));
  }

  function lugOccupied(lug) {
    return runs.some((r) => r.a === lug || r.b === lug);
  }

  function eatSpoolChip(lug, color) {
    if (!host) return;
    const box = host.querySelector("#el-zoom-spools");
    if (!box) return;
    box.querySelectorAll(".el-spool").forEach(function (chip) {
      const forLug = chip.getAttribute("data-for");
      const spoolColor = chip.getAttribute("data-spool");
      if (forLug !== lug && !(color && spoolColor === color && forLug === lug)) return;
      chip.hidden = true;
      chip.classList.add("el-spent");
      if (chip.parentNode) chip.parentNode.removeChild(chip);
    });
  }

  function missingTerms(slotId) {
    return termsFor(slotId).filter(function (t) {
      return !wireOnLug(lugId(slotId, t.id), t.accept);
    });
  }

  function nextNeedySlot() {
    const order = ["src"].concat(SLOTS.map((s) => s.id));
    const start = Math.max(0, order.indexOf(zoomSlot));
    for (let i = 1; i <= order.length; i++) {
      const id = order[(start + i) % order.length];
      if (id !== "src" && !placed[id]) continue;
      if (!termsFor(id).length) continue;
      if (missingTerms(id).length) return id;
    }
    return null;
  }

  function slotInfo(slotId) {
    if (slotId === "src") {
      return {
        name: "LINE IN",
        desc: DEVICE_SAY.src,
        img: null,
        icon: "⚡",
      };
    }
    const cid = placed[slotId];
    const def = PARTS.find((p) => p.id === cid) || PARTS.find((p) => p.slot === slotId);
    const s = SLOTS.find((x) => x.id === slotId);
    return {
      name: def ? def.name : (s ? s.label : slotId),
      desc: DEVICE_SAY[slotId] || (def ? def.desc : "Land the stamped terminals."),
      img: def && def.img,
      icon: def ? def.icon : "•",
    };
  }

  function zoomScrewsHtml(slotId) {
    const terms = termsFor(slotId);
    if (!terms.length) {
      return '<p class="el-zoom-empty">24V device — no line screws. Wire this from the thermostat / transformer.</p>';
    }
    return terms.map((t) => {
      const id = lugId(slotId, t.id);
      const color = t.accept;
      const w = WIRE[color] || WIRE.hot;
      const on = wireOnLug(id, color);
      return (
        '<button type="button" class="el-zoom-screw el-lug ' + w.cls +
        (on ? " wired wired-" + w.cls : "") +
        (pending === id ? " pending" : "") +
        '" data-lug="' + id + '" data-need="' + color + '" title="' + t.title +
        '" style="left:' + t.x + '%;top:' + t.y + '%">' +
        "<b>" + t.label + "</b><small>" + t.sub + "</small></button>"
      );
    }).join("");
  }

  function paintZoomNeed() {
    const box = host && host.querySelector("#el-zoom-need");
    const hint = host && host.querySelector("#el-zoom-hint");
    const nextBtn = host && host.querySelector("#el-zoom-next");
    if (!box || !zoomSlot) return;
    const terms = termsFor(zoomSlot);
    if (!terms.length) {
      box.innerHTML = "";
      if (hint) hint.textContent = "This one lives on 24V. Close and grab a line-voltage device.";
      if (nextBtn) nextBtn.hidden = !nextNeedySlot();
      return;
    }
    box.innerHTML = terms.map((t) => {
      const color = t.accept || (t.id === "hot" ? "hot" : t.id === "n" ? "neutral" : "ground");
      const w = WIRE[color] || WIRE.hot;
      const on = wireOnLug(lugId(zoomSlot, t.id), color);
      return '<li class="' + (on ? "ok" : "miss") + '"><i style="background:' + w.fill + ";border-color:" + w.stroke + '"></i>' +
        (on ? "Landed" : "Need") + " " + w.code + " → " + t.label + "</li>";
    }).join("");
    const miss = missingTerms(zoomSlot);
    const spec = guideLandSpec();
    const guideTerm = spec && spec.slot === zoomSlot
      ? miss.find(function (t) { return lugId(zoomSlot, t.id) === spec.lug; })
      : null;
    if (hint) {
      if (!miss.length) hint.textContent = "All screws landed on this device. Next device, or close.";
      else if (guideTerm) {
        const w = WIRE[spec.color] || WIRE.hot;
        hint.textContent = "Drag " + w.code + " onto " + guideTerm.label + " " + guideTerm.sub + ".";
        if (!pending) spool = spec.color;
      } else {
        const w = WIRE[spool] || WIRE.hot;
        hint.textContent = "Drag " + w.code + " onto the matching screw on this close-up.";
      }
    }
    if (nextBtn) {
      const n = nextNeedySlot();
      nextBtn.hidden = !n;
      nextBtn.textContent = n ? "Next device →" : "Next device";
    }
  }

  function clickSpoolChip(b) {
    if (!b) return;
    if (b.dataset.skipClick === "1") {
      delete b.dataset.skipClick;
      return;
    }
    const color = b.dataset.spool;
    const forLug = b.getAttribute("data-for") || "";
    const spec = guideLandSpec();
    if (spec) {
      if (color !== spec.color) {
        refuseWire(color, spec.lug);
        return;
      }
      if (forLug && forLug !== spec.lug) {
        const bad = termOf(forLug);
        const wantT = termOf(spec.lug);
        const w = WIRE[color] || WIRE.hot;
        const why = "Not " + (bad ? bad.label + " " + bad.sub : "that screw") + ". " +
          w.code + " goes on " + (wantT ? wantT.label + " " + wantT.sub : "the screw this step named") + ".";
        const hint = host && host.querySelector("#el-zoom-hint");
        if (hint) hint.textContent = why;
        const say = host && host.querySelector("#el-guide-say");
        if (say) say.textContent = why;
        const st = host && host.querySelector("#el-status");
        if (st) st.textContent = why;
        host.querySelectorAll('[data-lug="' + forLug + '"]').forEach((n) => {
          n.classList.add("landed-bad");
          setTimeout(() => n.classList.remove("landed-bad"), 700);
        });
        if (global.LtDrip) global.LtDrip.say("elec.bad");
        return;
      }
      dropWireOnLug(color, spec.lug, originForColor(color));
      return;
    }
    if (forLug) {
      dropWireOnLug(color, forLug, originForColor(color));
      return;
    }
    spool = color;
    pending = originForColor(color);
    paintLugState();
    highlightWireTargets(color);
  }

  function paintZoomSpools() {
    const box = host && host.querySelector("#el-zoom-spools");
    if (!box || !zoomSlot) return;
    const miss = termsFor(zoomSlot).filter(function (tm) {
      return !lugOccupied(lugId(zoomSlot, tm.id));
    });
    if (!miss.length) {
      box.hidden = true;
      box.innerHTML = "";
      box.classList.add("el-spent-tray");
      if (window.LtDrag && typeof window.LtDrag.killGhost === "function") window.LtDrag.killGhost();
      return;
    }
    box.hidden = false;
    box.classList.remove("el-spent-tray");
    if (miss.every(function (tm) { return tm.accept !== spool; })) spool = miss[0].accept;
    box.innerHTML = miss.map(function (tm) {
      const w = WIRE[tm.accept] || WIRE.hot;
      const lug = lugId(zoomSlot, tm.id);
      return (
        '<button type="button" class="el-spool el-lead ' +
        w.cls +
        (spool === tm.accept ? " active" : "") +
        '" data-spool="' +
        tm.accept +
        '" data-for="' +
        lug +
        '"><i style="background:' +
        w.fill +
        ";border-color:" +
        w.stroke +
        '"></i><span><b>' +
        w.code +
        "</b> → " +
        tm.label +
        " <small>" +
        tm.sub +
        "</small></span></button>"
      );
    }).join("");
    hideSpentSpools();
    box.querySelectorAll(".el-spool").forEach(function (b) {
      b.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        clickSpoolChip(b);
      };
    });
    bindWireDrags();
  }

  function paintZoomSvg() {
    const svg = host && host.querySelector("#el-zoom-svg");
    if (!svg || !zoomSlot) return;
    const terms = termsFor(zoomSlot);
    const paths = terms.map(function (tm, i) {
      const color = tm.accept;
      const w = WIRE[color] || WIRE.hot;
      const on = wireOnLug(lugId(zoomSlot, tm.id), color);
      const dock = 8 + (i % 4) * 6;
      const d = "M " + dock + " 6 C " + dock + " " + (tm.y * 0.4) + ", " + tm.x + " " + (tm.y * 0.62) + ", " + tm.x + " " + tm.y;
      const ghost = '<path d="' + d + '" fill="none" stroke="' + w.fill + '" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="2.2 1.6" opacity="0.85"/>';
      const live = on
        ? '<path d="' + d + '" fill="none" stroke="' + w.stroke + '" stroke-width="7" stroke-linecap="round"/>' +
          '<path d="' + d + '" fill="none" stroke="' + w.fill + '" stroke-width="4.2" stroke-linecap="round"/>' +
          '<circle cx="' + tm.x + '" cy="' + tm.y + '" r="3.4" fill="' + w.fill + '" stroke="' + w.stroke + '" stroke-width="0.7"/>'
        : "";
      const label = '<text x="' + dock + '" y="5" fill="' + (w.fill === "#d8d0c0" || w.fill === "#cbb892" || w.fill === "#e8c450" ? "#3a2e20" : w.fill) + '" font-size="3.1" font-weight="700">' + w.code + "</text>";
      return ghost + live + label;
    }).join("");
    svg.innerHTML = paths;
  }

  function syncZoom() {
    if (!host || !zoomSlot) return;
    const z = host.querySelector("#el-zoom");
    if (!z || !z.classList.contains("show")) return;
    z.querySelectorAll(".el-zoom-screw").forEach((b) => {
      const lug = b.dataset.lug;
      const color = b.dataset.need;
      const w = WIRE[color] || WIRE.hot;
      const on = wireOnLug(lug, color);
      b.classList.toggle("wired", on);
      ["hot", "neu", "gnd", "l2", "herm", "fan", "capc", "r24", "c24", "y", "gfan", "w", "o"].forEach(function (c) {
        b.classList.remove("wired-" + c);
      });
      if (on) b.classList.add("wired-" + w.cls);
      b.classList.toggle("pending", pending === lug);
    });
    paintZoomNeed();
    paintZoomSvg();
    paintZoomSpools();
    paintLugState();
    paintGuideTarget();
  }

  function openZoom(slotId) {
    if (!host || labMode === "defusal" || !slotId) return;
    if (slotId !== "src" && !placed[slotId]) return;
    leadZoom = false;
    zoomSlot = slotId;
    const z = host.querySelector("#el-zoom");
    if (!z) return;
    z.classList.remove("lead-mode");
    const leadFace = z.querySelector("#el-lead-face");
    if (leadFace) leadFace.hidden = true;
    const leadEye = z.querySelector(".eyebrow");
    if (leadEye) leadEye.textContent = "Wire this device";
    const info = slotInfo(slotId);
    const img = z.querySelector("#el-zoom-img");
    const ico = z.querySelector("#el-zoom-ico");
    if (info.img) {
      img.src = info.img;
      img.hidden = false;
      ico.hidden = true;
    } else {
      img.removeAttribute("src");
      img.hidden = true;
      ico.hidden = false;
      ico.textContent = info.icon;
    }
    z.querySelector("#el-zoom-name").textContent = info.name;
    z.querySelector("#el-zoom-desc").textContent = (info.desc || "Drag the matching color onto each screw.") + " Dashed line is the jacket that belongs on that screw. Solid line means it is landed.";
    const screws = z.querySelector("#el-zoom-screws");
    if (screws) screws.innerHTML = zoomScrewsHtml(slotId);
    bindLugs(z);
    bindWireDrags();
    const okEl = z.querySelector("#el-zoom-ok");
    if (okEl) okEl.hidden = true;
    z.classList.add("show");
    paintZoomNeed();
    paintZoomSvg();
    paintZoomSpools();
    paintLugState();
    onGuideEvent("zoom", slotId);
    ensureHubReachable();
  }

  function dialName() {
    if (mode === "vac") return "VAC";
    if (mode === "vdc") return "VDC";
    if (mode === "aac") return "AAC";
    if (mode === "ohm") return "OHMS";
    if (mode === "cont") return "CONT";
    if (mode === "cap") return "µF";
    return String(mode || "").toUpperCase();
  }

  function meterFace(id) {
    const face = METER_FACES.find(function (f) { return f.id === id; }) || METER_FACES[0];
    const lugs = DEVICE_LUGS[face.slot] || [];
    const part = PARTS.find(function (p) { return p.slot === face.slot; });
    const points = [];
    lugs.forEach(function (l) {
      const probe = face.probes[l.id];
      if (!probe) return;
      points.push({ id: probe, label: l.label, sub: l.sub, x: l.x, y: l.y });
    });
    return {
      id: face.id,
      short: face.short,
      name: part ? part.name : face.short,
      img: part && part.img ? part.img : "",
      say: (DEVICE_SAY[face.slot] || "Drag the leads onto the screws.") + " Drag RED and BLACK onto the screws — same close-up as land lugs.",
      points: points,
    };
  }

  function leadGhostHtml(hand) {
    const blk = hand === "blk";
    return '<i class="el-wire-lead" style="background:' + (blk ? "#1a1a1a" : "#c0392b") + ";border:1px solid " + (blk ? "#000" : "#7a1c12") + '"></i><strong>' + (blk ? "BLACK · COM" : "RED lead") + "</strong>";
  }

  function guideProbePair() {
    if (!meterGuideOn) return [];
    const s = METER_GUIDE[meterGuideI];
    if (!s || !s.wait || s.wait.indexOf("read:") !== 0) return [];
    const p = s.wait.split(":");
    return [p[1], p[2]];
  }

  function paintLeadFace(reading) {
    if (!leadZoom || !host) return;
    const face = host.querySelector("#el-lead-face");
    if (face) face.hidden = false;
    const val = host.querySelector("#el-lead-val");
    const unit = host.querySelector("#el-lead-unit");
    const dial = host.querySelector("#el-lead-dial");
    const note = host.querySelector("#el-lead-note");
    if (val) val.textContent = reading ? reading.val : "—.—";
    if (unit) unit.textContent = reading ? reading.unit : "";
    if (dial) dial.textContent = "Dial · " + dialName();
    if (note) {
      note.textContent = !red || !black
        ? "Drag the red lead and the black lead onto two screws. The number follows the dial."
        : (reading ? reading.note : "");
    }
    paintLeadControls();
  }

  function paintLeadControls() {
    if (!host) return;
    host.querySelectorAll("[data-mdial]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-mdial") === mode);
      b.classList.remove("el-guide-target");
    });
    host.querySelectorAll("[data-mjack]").forEach(function (b) {
      const j = b.getAttribute("data-mjack");
      const inn = (j === "com" && dmmJackBlk === "com") || (j === "v" && dmmJackRed === "v") || (j === "a" && dmmJackRed === "a");
      b.classList.toggle("in", inn);
      b.classList.remove("el-guide-target");
    });
    host.querySelectorAll("[data-mlead]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-mlead") === dmmLead);
    });
    host.querySelectorAll("[data-leadboard]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-leadboard") === leadBoard);
    });
    const power = host.querySelector("#el-meter-power");
    if (power) power.textContent = fault === "open_disc" ? "Disconnect is OPEN · push it in" : "Pull the disconnect";
    if (!meterGuideOn) return;
    const s = METER_GUIDE[meterGuideI];
    if (!s) return;
    if (s.wait === "jacks") {
      host.querySelectorAll("[data-mjack]").forEach(function (b) {
        const j = b.getAttribute("data-mjack");
        if ((j === "com" && dmmJackBlk !== "com") || (j === "v" && dmmJackRed !== "v")) b.classList.add("el-guide-target");
      });
    }
    if (s.wait === "dial:vac" && mode !== "vac") {
      const vac = host.querySelector('[data-mdial="vac"]');
      if (vac) vac.classList.add("el-guide-target");
    }
  }

  function paintLeadPoints() {
    if (!leadZoom || !host) return;
    const board = meterFace(leadBoard);
    const want = guideProbePair();
    host.querySelectorAll(".el-lead-point").forEach(function (b) {
      const id = b.dataset.probe;
      b.classList.toggle("land-red", red === id && black !== id);
      b.classList.toggle("land-blk", black === id && red !== id);
      b.classList.toggle("land-both", red === id && black === id);
      const need = want.indexOf(id) >= 0 && red !== id && black !== id;
      b.classList.toggle("el-guide-target", need);
    });
    const tray = host.querySelector("#el-zoom-spools");
    if (tray && want.length) {
      const redLanded = want.indexOf(red) >= 0;
      const blkLanded = want.indexOf(black) >= 0;
      tray.querySelectorAll("[data-leadhand]").forEach(function (b) {
        const hand = b.getAttribute("data-leadhand");
        const pulse = (hand === "red" && !redLanded) || (hand === "blk" && redLanded && !blkLanded);
        b.classList.toggle("el-guide-target", pulse);
      });
    }
    const svg = host.querySelector("#el-zoom-svg");
    if (!svg) return;
    const pathFor = function (id, color) {
      const p = board.points.find(function (x) { return x.id === id; });
      if (!p) return "";
      const x0 = color === "red" ? 16 : 84;
      const stroke = color === "red" ? "#c0392b" : "#1a1a1a";
      const d = "M " + x0 + " 0 C " + x0 + " " + (p.y * 0.4).toFixed(1) + ", " + p.x + " " + (p.y * 0.55).toFixed(1) + ", " + p.x + " " + p.y;
      return '<path d="' + d + '" fill="none" stroke="#f7f3ea" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="3.6" stroke-linecap="round"/>';
    };
    svg.innerHTML = pathFor(red, "red") + pathFor(black, "blk");
  }

  function landLead(probeId) {
    if (!probeId) return;
    const hand = leadHand === "blk" ? "blk" : "red";
    if (hand === "blk") {
      if (red === probeId) red = "";
      black = probeId;
      dmmJackBlk = "com";
      leadHand = "red";
      dmmLead = "red";
    } else {
      if (black === probeId) black = "";
      red = probeId;
      if (dmmJackRed !== "a") dmmJackRed = "v";
      leadHand = "blk";
      dmmLead = "blk";
    }
    if (red && black) {
      dmmJackBlk = "com";
      if (dmmJackRed !== "a") dmmJackRed = "v";
    }
    probed = true;
    if (dmmJackBlk === "com" && (dmmJackRed === "v" || dmmJackRed === "a")) onMeterEvent("jack");
    paintDmmJacks();
    paintMeter();
  }

  function bindLeadDrags() {
    const box = host && host.querySelector("#el-zoom-spools");
    if (!box) return;
    box.querySelectorAll("[data-leadhand]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        leadHand = b.dataset.leadhand === "blk" ? "blk" : "red";
        dmmLead = leadHand === "blk" ? "blk" : "red";
        box.querySelectorAll("[data-leadhand]").forEach(function (x) {
          x.classList.toggle("active", x === b);
        });
        paintLeadControls();
      };
      if (!window.LtDrag || b.dataset.leadBound) return;
      b.dataset.leadBound = "1";
      window.LtDrag.bindSource(b, {
        id: b.dataset.leadhand,
        allowButtons: true,
        ghostClass: "el-wire-ghost",
        html: leadGhostHtml(b.dataset.leadhand),
        dropSelector: ".el-lead-point, .el-lead-jack, [data-probe], [data-mjack]",
        onDragStart: function () {
          leadHand = b.dataset.leadhand === "blk" ? "blk" : "red";
          dmmLead = leadHand === "blk" ? "blk" : "red";
        },
        onDrop: function (_key, id, dropEl) {
          const hand = id === "blk" ? "blk" : "red";
          const jack = dropEl && dropEl.closest ? dropEl.closest(".el-lead-jack, [data-mjack]") : null;
          if (jack && (jack.dataset.mjack || jack.getAttribute("data-mjack"))) {
            leadHand = hand;
            dmmLead = hand;
            plugJack(jack.dataset.mjack || jack.getAttribute("data-mjack"));
            return;
          }
          const pt = dropEl && dropEl.closest ? dropEl.closest(".el-lead-point, [data-probe]") : dropEl;
          const probe = pt && (pt.dataset.probe || pt.getAttribute("data-probe"));
          if (!probe) return;
          leadHand = hand;
          dmmLead = hand;
          landLead(probe);
        },
      });
    });
    host.querySelectorAll(".el-lead-point").forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        landLead(b.dataset.probe);
      };
    });
  }

  function openLeadZoom(boardId) {
    if (openingLeadZoom) {
      queuedLeadBoard = boardId || queuedLeadBoard;
      return;
    }
    if (leadOpenHops > 4) return;
    leadOpenHops += 1;
    openingLeadZoom = true;
    try {
      const board = meterFace(boardId);
      if (!host) return;
      const ids = board.points.map(function (p) { return p.id; });
      if (ids.indexOf(red) < 0) red = "";
      if (ids.indexOf(black) < 0) black = "";
      leadZoom = true;
      leadBoard = board.id;
      zoomSlot = null;
      const z = host.querySelector("#el-zoom");
      if (!z) return;
      if (meterSchool) {
        const main = host.querySelector(".el-main");
        if (main && z.parentElement !== main) main.appendChild(z);
      }
      z.classList.add("show", "lead-mode");
      const eyebrow = z.querySelector(".eyebrow");
      if (eyebrow) eyebrow.textContent = "Drag the test leads";
      z.querySelector("#el-zoom-name").textContent = board.name;
      z.querySelector("#el-zoom-desc").textContent = board.say;
      const img = z.querySelector("#el-zoom-img");
      const ico = z.querySelector("#el-zoom-ico");
      if (img && board.img) {
        img.src = board.img;
        img.hidden = false;
        if (ico) ico.hidden = true;
      } else {
        if (img) { img.removeAttribute("src"); img.hidden = true; }
        if (ico) { ico.hidden = false; ico.textContent = "⌁"; }
      }
      const screws = z.querySelector("#el-zoom-screws");
      if (screws) {
        screws.innerHTML = board.points.map(function (p) {
          return '<button type="button" class="el-zoom-screw el-lead-point" data-probe="' + p.id +
            '" style="left:' + p.x + "%;top:" + p.y + '%"><b>' + p.label + "</b><small>" + p.sub + "</small></button>";
        }).join("");
      }
      const tray = z.querySelector("#el-zoom-spools");
      if (tray) {
        tray.hidden = false;
        tray.classList.remove("el-spent-tray");
        tray.innerHTML =
          '<button type="button" class="el-spool red' + (leadHand !== "blk" ? " active" : "") + '" data-leadhand="red"><i></i><span><b>RED</b> test lead</span></button>' +
          '<button type="button" class="el-spool blk' + (leadHand === "blk" ? " active" : "") + '" data-leadhand="blk"><i></i><span><b>BLACK</b> COM lead</span></button>';
      }
      const face = z.querySelector("#el-lead-face");
      if (face) face.hidden = false;
      z.querySelectorAll("[data-mlead]").forEach(function (b) { b.hidden = true; });
      const boards = z.querySelector("#el-lead-boards");
      if (boards) {
        boards.innerHTML = METER_FACES.map(function (f) {
          return '<button type="button" class="el-meter-pick' + (f.id === leadBoard ? " on" : "") + '" data-leadboard="' + f.id + '">' + f.short + "</button>";
        }).join("");
        boards.querySelectorAll("[data-leadboard]").forEach(function (b) {
          b.onclick = function (e) {
            e.stopPropagation();
            openLeadZoom(b.dataset.leadboard);
          };
        });
      }
      const hint = z.querySelector("#el-zoom-hint");
      if (hint) hint.textContent = "Drag RED onto one screw. Drag BLACK onto the other. Drop a lead on COM or VΩ to plug the jack. Same move as landing a lug.";
      const need = z.querySelector("#el-zoom-need");
      if (need) need.innerHTML = "";
      bindLeadDrags();
      paintLeadPoints();
      paintMeter();
    } finally {
      openingLeadZoom = false;
    }
    const nextBoard = queuedLeadBoard;
    queuedLeadBoard = "";
    if (nextBoard && nextBoard !== leadBoard) openLeadZoom(nextBoard);
    else leadOpenHops = 0;
  }

  function closeZoom() {
    if (meterSchool) return;
    zoomSlot = null;
    leadZoom = false;
    const z = host && host.querySelector("#el-zoom");
    if (z) {
      z.classList.remove("show", "lead-mode");
      const face = z.querySelector("#el-lead-face");
      if (face) face.hidden = true;
      const eyebrow = z.querySelector(".eyebrow");
      if (eyebrow) eyebrow.textContent = "Wire this device";
    }
  }

  function showLoupe(partId, slotEl, ev) {
    const loupe = host && host.querySelector("#el-loupe");
    if (!loupe) return;
    const p = PARTS.find((x) => x.id === partId);
    const slotId = slotEl && slotEl.dataset.slot;
    const occupying = slotId && placed[slotId];
    const show = occupying ? PARTS.find((x) => x.id === occupying) || p : p;
    const shot = loupe.querySelector(".el-loupe-shot");
    if (show && show.img) {
      shot.innerHTML = '<img src="' + show.img + '" alt="" />';
    } else {
      shot.innerHTML = '<span class="ico">' + ((show && show.icon) || "•") + "</span>";
    }
    const s = SLOTS.find((x) => x.id === slotId);
    let label = show ? show.name : (p ? p.name : "Part");
    if (occupying) label = "Wiring · " + label;
    else if (s) label = label + " → " + s.label;
    loupe.querySelector(".el-loupe-name").textContent = label;
    loupe.classList.add("on");
    if (ev) {
      const w = 188;
      const x = ev.clientX + 28 + w > window.innerWidth ? ev.clientX - w - 16 : ev.clientX + 28;
      const y = Math.max(8, ev.clientY - 150);
      loupe.style.left = x + "px";
      loupe.style.top = y + "px";
    }
  }

  function hideLoupe() {
    const loupe = host && host.querySelector("#el-loupe");
    if (loupe) loupe.classList.remove("on");
  }

  function onKeyZoom(e) {
    if (e.key === "Escape") closeZoom();
  }

  function refreshSlots() {
    host.querySelectorAll(".el-slot").forEach((el) => {
      const id = el.dataset.slot;
      const cid = placed[id];
      el.classList.toggle("filled", !!cid);
      if (labMode === "defusal" && !cid) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      const canRm = labMode !== "defusal" || (job && job.replaceWin === id);
      if (cid) {
        const def = PARTS.find((p) => p.id === cid) || { name: cid, icon: "•" };
        el.innerHTML = thumb(def) + "<strong>" + def.name + "</strong>" +
          (canRm ? "<button class='rm' data-rm='" + id + "'>×</button>" : "") +
          lugButtons(id);
        el.onclick = (e) => {
          if (e.target.closest(".rm, [data-lug]")) return;
          openZoom(id);
        };
      } else {
        const s = SLOTS.find((x) => x.id === id);
        el.innerHTML = "<span class='empty'>Drop " + (s ? s.label : id) + "</span>";
        el.onclick = null;
      }
    });
    host.querySelectorAll(".rm").forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        if (labMode === "defusal" && job && job.replaceWin !== b.dataset.rm) return;
        const gone = b.dataset.rm;
        delete placed[gone];
        runs = runs.filter((r) => r.a.indexOf(gone + ".") !== 0 && r.b.indexOf(gone + ".") !== 0);
        refreshSlots();
        paintMeter();
      };
    });
    bindLugs();
    requestAnimationFrame(paintRuns);
  }

  function paintRuns() {
    const svg = host && host.querySelector("#el-runs");
    const inner = host && host.querySelector("#el-board-inner");
    if (!svg || !inner) return;
    const box = inner.getBoundingClientRect();
    const w = Math.max(1, inner.clientWidth);
    const h = Math.max(1, inner.clientHeight);
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    const pos = (lid) => {
      const el = host.querySelector('#el-board [data-lug="' + lid + '"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    };
    svg.innerHTML = runs.map((r) => {
      const a = pos(r.a);
      const b = pos(r.b);
      if (!a || !b) return "";
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 + 22;
      const col = WIRE[r.color] || WIRE.hot;
      return '<path class="el-run-hit" data-run="' + r.id + '" d="M ' + a.x.toFixed(1) + " " + a.y.toFixed(1) +
        " Q " + mx.toFixed(1) + " " + my.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1) +
        '" fill="none" stroke="' + col.stroke + '" stroke-width="8" stroke-linecap="round"></path>' +
        '<path class="el-run-core" data-run="' + r.id + '" d="M ' + a.x.toFixed(1) + " " + a.y.toFixed(1) +
        " Q " + mx.toFixed(1) + " " + my.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1) +
        '" fill="none" stroke="' + col.fill + '" stroke-width="4.5" stroke-linecap="round"></path>';
    }).join("");
    svg.querySelectorAll("[data-run]").forEach((p) => {
      p.addEventListener("click", (e) => {
        e.stopPropagation();
        if (labMode === "defusal") return;
        pullRun(p.getAttribute("data-run"));
      });
    });
  }

  function paintSchematic() {
    paintRuns();
  }

  function paintTimer() {
    const el = host.querySelector("#el-timer");
    if (!el) return;
    if (tutOn) {
      el.textContent = "WALK";
      el.classList.remove("panic", "dead");
      el.classList.toggle("won", defused);
      return;
    }
    const s = Math.max(0, timeLeft);
    const mm = String(Math.floor(s / 60)).padStart(1, "0");
    const ss = String(s % 60).padStart(2, "0");
    el.textContent = mm + ":" + ss;
    el.classList.toggle("panic", s <= 20 && !defused && !boom);
    el.classList.toggle("dead", boom || s <= 0);
    el.classList.toggle("won", defused);
  }

  function paintDefusal() {
    if (labMode !== "defusal") return;
    paintTimer();
    const bar = host.querySelector("#el-wires");
    if (bar && job) {
      bar.querySelectorAll(".el-wire-btn").forEach((b) => {
        const id = b.dataset.wire;
        b.classList.toggle("cut", !!cutSet[id]);
        b.disabled = !!cutSet[id] || defused || boom;
      });
    }
    const st = host.querySelector("#el-defuse-state");
    if (st) {
      st.textContent = defused ? "DEFUSED" : boom ? "CALLBACK" : tutOn ? "WALK" : "ARMED";
      st.className = "el-defuse-state" + (defused ? " ok" : boom ? " bad" : "");
    }
    const say = host.querySelector("#el-sat-say");
    if (say) say.textContent = satHubSay();
    paintDefuseActions();
  }

  function paintMeter() {
    if (!host) return;
    const c = circuit();
    const r = readMeter();
    const lcd = host.querySelector("#el-lcd");
    if (!lcd) return;
    lcd.textContent = r.val;
    host.querySelector("#el-unit").textContent = r.unit;
    host.querySelector("#el-note").textContent = (labMode === "defusal" && job && sheetNote && !defused && !boom) ? sheetNote : r.note;
    const mf = host.querySelector("#el-meter-fuse");
    if (mf) mf.hidden = !meterFuse;
    const modeEl = host.querySelector("#el-mode");
    if (modeEl && modeEl.value !== mode) modeEl.value = mode;
    if (leadZoom) {
      paintLeadPoints();
      paintLeadFace(r);
    }
    const stEl = host.querySelector("#el-status");
    const coachOn = !!(sheetNote && !defused && !boom && !meterSchool && view === "ladder" && (
      (labMode === "defusal" && job) || (labMode !== "defusal" && tsOn)
    ));
    if (stEl) stEl.textContent = coachOn ? sheetNote : statusLine(c);
    const runLamp = host.querySelector("#el-run");
    if (runLamp) runLamp.classList.toggle("on", c.compRun);
    const l24 = host.querySelector("#el-24");
    if (l24) l24.classList.toggle("on", c.rHot);
    const lcoil = host.querySelector("#el-coil");
    if (lcoil) lcoil.classList.toggle("on", c.pulled);
    const ly = host.querySelector("#el-y");
    if (ly) ly.classList.toggle("on", c.y);
    const wLamp = host.querySelector("#el-w");
    if (wLamp) wLamp.classList.toggle("on", c.w);
    const oLamp = host.querySelector("#el-o");
    if (oLamp) oLamp.classList.toggle("on", c.o);
    const chips = [];
    chips.push(c.loadHot ? "240 VAC load" : "load dead");
    chips.push(c.rHot ? "27 VAC R–C" : "no 24V");
    chips.push(c.pulled ? "contactor IN" : "contactor OUT");
    chips.push(c.compRun ? "comp RUN " + c.rla.toFixed(1) + " A" : (c.lraAttempt ? "comp LOCKED " + c.lraAttempt.toFixed(0) + " A" : "comp OFF"));
    if (c.fanRun) chips.push("OD fan 1.1 A");
    if (c.stripsOn) chips.push("strips ON");
    if (c.gasOn) chips.push("gas valve OPEN");
    if (c.groundedHot) chips.push("DEAD SHORT");
    const chipsEl = host.querySelector("#el-chips");
    if (chipsEl) chipsEl.textContent = chips.join(" · ");
    const redn = PROBES.find((p) => p.id === red);
    const blkn = PROBES.find((p) => p.id === black);
    host.querySelector("#el-redn").textContent = redn ? redn.label : red;
    host.querySelector("#el-blkn").textContent = blkn ? blkn.label : black;
    paintSchematic();
    paintDefusal();
    paintLadder();
  }

  function ladderNodes() {
    const c = circuit();
    const n = [];
    const proveId = labMode === "defusal" && job ? PROVE[job.id] : "";
    const add = (row, id, label, sub, probeRed, probeBlk, zoom, live, open) => {
      const keep = !!(proveId && id === proveId);
      if (!keep && zoom && zoom !== "thermostat" && zoom !== "transformer" && zoom !== "src" && !has(zoom) && id !== "xfmr" && id !== "stat") return;
      if (n.some((x) => x.id === id)) return;
      n.push({ row, id, label, sub, probeRed, probeBlk, zoom, live: !!live, open: open || null });
    };
    add("pwr", "l1", "L1", "240 hot", "l1", "l2", "breaker", c.line);
    add("pwr", "disc", "DISC", "shutoff", "load1", "load2", "disconnect", c.loadHot, "open_disc");
    add("pwr", "t1", "T1", "load", "t1", "t2", "contactor", c.pulled && c.loadHot);
    add("pwr", "comp", "COMP", "herm", "t1", "compc", "compressor", (c.compRun || c.compPower) && fault !== "grounded");
    add("pwr", "cap", "CAP", "µF", "caph", "capc", "capacitor", has("capacitor") && fault !== "open_cap", "open_cap");
    add("pwr", "fan", "FAN", "ODU", "fanlead", "t2", "fan", c.fanRun);
    add("ctl", "xfmr", "R", "24V hot", "r", "c24", "transformer", c.rHot);
    add("ctl", "fuse", "3A", "fuse", "r", "c24", "fuse", c.fuseOk && c.xfmr, "blown_fuse");
    add("ctl", "stat", "STAT", "Y call", "y", "c24", "thermostat", c.y);
    add("ctl", "hpc", "HPC", "high PS", "y", "hpc", "hpc", c.y && c.hpc, "open_hpc");
    add("ctl", "lpc", "LPC", "low PS", "hpc", "lpc", "lpc", c.y && c.hpc && c.lpc, "open_lpc");
    add("ctl", "float", "FLOAT", "pan", "lpc", "float", "float", c.path, "float_open");
    add("ctl", "coil", "COIL", "24V coil", "coil", "c24", "contactor", c.path && has("contactor"), "open_coil");
    add("ctl", "c24", "C", "common", "c24", "r", "transformer", c.rHot);
    if (has("limit") || has("gasvalve") || proveId === "limit") {
      add("heat", "limit", "LIMIT", "furnace", "w", "limit", "limit", c.w, "open_limit");
      add("heat", "gas", "GAS", "valve", "w", "c24", "gasvalve", c.gasOn);
    }
    if (has("solenoid") || proveId === "ob") add("heat", "ob", "O/B", "RV", "o", "c24", "solenoid", c.o);
    if (proveId && !n.some((x) => x.id === proveId)) {
      const spec = {
        hpc: ["ctl", "HPC", "high PS", "y", "hpc", "hpc", "open_hpc"],
        lpc: ["ctl", "LPC", "low PS", "hpc", "lpc", "lpc", "open_lpc"],
        float: ["ctl", "FLOAT", "pan", "lpc", "float", "float", "float_open"],
        coil: ["ctl", "COIL", "24V coil", "coil", "c24", "contactor", "open_coil"],
        disc: ["pwr", "DISC", "shutoff", "load1", "load2", "disconnect", "open_disc"],
        cap: ["pwr", "CAP", "µF", "caph", "capc", "capacitor", "open_cap"],
        comp: ["pwr", "COMP", "herm", "t1", "compc", "compressor", null],
        stat: ["ctl", "STAT", "Y call", "y", "c24", "thermostat", null],
        limit: ["heat", "LIMIT", "furnace", "w", "limit", "limit", "open_limit"],
        fuse: ["ctl", "3A", "fuse", "r", "c24", "fuse", "blown_fuse"],
      }[proveId];
      if (spec) n.push({ row: spec[0], id: proveId, label: spec[1], sub: spec[2], probeRed: spec[3], probeBlk: spec[4], zoom: spec[5], live: false, open: spec[6] });
    }
    return n;
  }

  function nodeVolts(node) {
    const c = circuit();
    const v = vacBetween(node.probeRed, node.probeBlk, c);
    return typeof v === "number" ? v : 0;
  }

  function ladderMarkup() {
    return `<div class="el-ladder" id="el-ladder">
      <div class="el-statpad" role="group" aria-label="Thermostat">
        <span class="el-statpad-k">Thermostat</span>
        <button type="button" class="el-stat-key" data-call="cool">Y · Cool</button>
        <button type="button" class="el-stat-key" data-call="fan">G · Fan</button>
        <button type="button" class="el-stat-key" data-call="heat">W · Heat</button>
        <button type="button" class="el-stat-key" data-call="rev">O/B · RV</button>
      </div>
      <p class="el-ladder-kicker" style="position:sticky;top:0;z-index:4;background:#f4eee2;padding:8px 2px;margin:0 0 8px">Hit Y on the stat. No Y, no cool.</p>
      <div class="el-rail" data-rail="pwr"></div>
      <div class="el-rail el-rail-24" data-rail="ctl"></div>
      <div class="el-rail" data-rail="heat" hidden></div>
      <div class="el-ladder-read" id="el-ladder-read">Tap R, then walk Y through the safeties.</div>
      ${labMode === "defusal" ? "" : `<ol class="el-ts" id="el-ts"></ol>
      <div class="el-ts-actions">
        <button type="button" class="btn primary" id="el-ts-go">Start no-cool sheet</button>
        <button type="button" class="btn" id="el-ts-practice">Practice a no-cool</button>
        <button type="button" class="btn primary" id="el-wire-this">Land lugs on this device</button>
      </div>`}
    </div>`;
  }

  function paintLadder() {
    const root = host && host.querySelector("#el-ladder");
    if (!root) return;
    const nodes = ladderNodes();
    ["pwr", "ctl", "heat"].forEach((rail) => {
      const row = root.querySelector('[data-rail="' + rail + '"]');
      if (!row) return;
      const list = nodes.filter((n) => n.row === rail);
      row.hidden = list.length === 0;
      row.innerHTML = list.map((n, i) => {
        const v = nodeVolts(n);
        const prove = labMode === "defusal" && job && PROVE[job.id] === n.id;
        const isOpen = !!(n.open && fault === n.open) || prove;
        const tapped = ladderTap === n.id;
        const faultHere = !!(n.open && fault === n.open);
        let face = v.toFixed(1) + " V";
        if (isContactNode(n.id)) {
          if (v >= 20) face = Math.round(v) + " V across";
          else if (!contactFed(n.id, circuit())) face = "no call";
          else face = "0.0 V drop";
        }
        if (n.id === "coil") face = v >= 20 ? Math.round(v) + " V on coil" : (circuit().y ? "0.0 V at coil" : "no call");
        if (tapped && n.id === "cap") face = (fault === "open_cap" ? "OL" : "35") + " µF";
        if (tapped && job && job.id === "fuse" && n.id === "comp") face = "0.4 Ω to GND";
        if (tapped && job && job.id === "swap" && n.id === "stat") face = "Y landed on G";
        const curTs = labMode !== "defusal" && tsOn ? TS_NOCOOL[tsI] : null;
        const foundSheet = !!(curTs && curTs.node === n.id && tsDone[curTs.id] === "found");
        const cls = [
          "el-node",
          n.live ? "live" : "dead",
          tapped && isOpen ? "open" : "",
          tapped ? "picked" : "",
          curTs && !curTs.wantCall && curTs.node === n.id ? "ts-now" : "",
          labMode === "defusal" && job && !meteredOpen && !defused && satWantId() === n.id ? "ts-now" : "",
          foundSheet ? "found" : "",
          labMode === "defusal" && meteredOpen && tapped && isOpen ? "found" : "",
        ].filter(Boolean).join(" ");
        const wire = i < list.length - 1 ? '<i class="el-node-wire' + (n.live ? " on" : "") + '"></i>' : "";
        return '<button type="button" class="' + cls + '" data-node="' + n.id + '"><b>' + n.label + "</b><small>" +
          (tapped && faultHere ? "OPEN · " : "") + face + "</small>" + wire + "</button>";
      }).join("");
    });
    root.querySelectorAll("[data-call]").forEach((b) => {
      const k = b.getAttribute("data-call");
      const needY = !!(labMode !== "defusal" && tsOn && tsStep() && tsStep().wantCall && !callCool && k === "cool");
      b.classList.toggle("on", (k === "cool" && callCool) || (k === "fan" && callFan) || (k === "heat" && callHeat) || (k === "rev" && callRev));
      b.style.boxShadow = needY ? "0 0 0 3px #CE0034" : "";
    });
    const read = host.querySelector("#el-ladder-read");
    const kick = root.querySelector(".el-ladder-kicker");
    if (labMode === "defusal" && job && sheetNote && !defused) {
      if (kick) kick.textContent = sheetNote;
      if (read) read.textContent = sheetNote;
    } else if (labMode !== "defusal" && tsOn && sheetNote) {
      if (kick) kick.textContent = sheetNote;
      if (read) read.textContent = sheetNote;
      const hubP = host.querySelector(".sb-palette .hub-chip p");
      if (hubP && !meterSchool && view === "ladder") hubP.textContent = sheetNote;
    } else if (read) {
      const n = nodes.find((x) => x.id === ladderTap);
      if (n && labMode === "defusal" && job) {
        const v = nodeVolts(n);
        if (job.id === "rv" && isolated && !defused) {
          read.textContent = "O is isolated. Replace the fuse. The reversing valve is off the short.";
        } else if (job.id === "rv" && fusePopped && !isolated && !defused) {
          read.textContent = "New 3A pops. The reversing valve is still shorted. Isolate O, then replace the fuse.";
        } else {
          const hit = PROVE[job.id] === n.id || (n.open && fault === n.open);
          read.textContent = hit
            ? (job.id === "cap"
              ? "Cap reads OL µF with power off. Locked-rotor, not running amps. Outdoor fan can still run. Replace the dual run cap."
              : job.id === "fuse"
                ? "0.4 Ω to ground. That's copper to the chassis. Isolate compressor C. A new 3A pops on that short."
                : job.id === "swap"
                  ? "Yellow is on G. Move Y off G. Green is the fan, not the cool call."
                  : job.id === "coil"
                    ? "About 24 V on the coil and it never pulls in. Open winding. Replace the contactor."
                    : isContactNode(n.id)
                      ? n.label + " is about 24 V across the open. The coil sees 0. Replace it. Don't jump it."
                      : job.isolate
                        ? n.label + " is the bad box. " + job.isolate.label + "."
                        : n.label + " is the open. Replace it.")
            : (isContactNode(n.id)
              ? (v >= 20
                ? n.label + " → about " + Math.round(v) + " V across. That's the open."
                : !contactFed(n.id, circuit())
                  ? n.label + " → no call yet. 0 V is not a closed contact."
                  : n.label + " → about 0 V drop. Closed. Keep walking.")
              : n.id === "coil"
                ? (v >= 20 ? "Coil → about 24 V. The call made it." : "Coil → 0 V. Open is upstream.")
                : n.label + " → " + v.toFixed(1) + " VAC. " + (v > 20
                  ? (n.id === "comp" && circuit().compPower && !circuit().cap
                    ? "About 240 V and it is not running. Locked-rotor, not running amps. Outdoor fan can still run. Don't size a breaker from inrush."
                    : "Hot. Keep walking.")
                  : "0 volts. Something ahead of this load is open."));
        }
      } else if (n && !tutOn) {
        const v = nodeVolts(n);
        const cNow = circuit();
        let tail;
        if (isContactNode(n.id)) {
          tail = v >= 20
            ? "about 24 V across the open. Coil sees 0. Don't jump it."
            : !contactFed(n.id, cNow)
              ? "no call yet. 0 V is not a closed contact. Don't jump it."
              : "about 0 V drop. Closed contact.";
        } else if (n.id === "coil") {
          tail = v >= 20
            ? (fault === "open_coil" ? "24 V and no pull-in. Open winding." : "call is on the coil.")
            : (cNow.y ? "coil sees 0. Open is upstream." : "no Y call. The coil sees 0. That is not an open winding.");
        } else if (n.id === "comp" && v > 200 && cNow.compPower && !cNow.cap) {
          tail = "about 240 V and it is not running. Locked-rotor, not running amps. Outdoor fan can still run. Don't size a breaker from inrush.";
        } else if (v > 20) tail = "hot. Keep walking.";
        else if (n.open && fault === n.open) tail = "that's the open on this measurement.";
        else tail = "dead. Who killed it?";
        read.textContent = n.label + " → " + v.toFixed(1) + " VAC  ·  " + tail;
      } else if (labMode === "defusal") {
        read.textContent = satHubSay();
      } else {
        read.textContent = sheetNote || "Hit Y on the stat. No Y, no cool.";
      }
    }
    const wireBtn = host.querySelector("#el-wire-this");
    if (wireBtn) {
      const n = nodes.find((x) => x.id === ladderTap);
      const step = tsOn && labMode !== "defusal" ? tsStep() : null;
      const sheetBusy = !!(step && tsDone[step.id] !== "ok" && tsDone[step.id] !== "found");
      wireBtn.disabled = sheetBusy || !(n && n.zoom);
      wireBtn.textContent = sheetBusy ? "Finish the step named above" : (n && n.zoom ? "Land lugs · " + n.label : "Tap a device, then land lugs");
    }
    paintTs();
    const focus = root.querySelector(".el-node.ts-now");
    if (focus) revealInLadder(focus);
  }

  function tsStep() {
    return TS_NOCOOL[tsI] || null;
  }

  function beginTs(practice) {
    tsOn = true;
    tsI = 0;
    tsDone = {};
    callCool = false;
    sheetNote = TS_NOCOOL[0].say;
    if (practice) {
      const pool = ["open_hpc", "open_lpc", "float_open", "open_disc", "open_coil", "open_cap", "blown_fuse"];
      fault = pool[Math.floor(Math.random() * pool.length)];
      fusedBlown = fault === "blown_fuse";
      const sel = host && host.querySelector("#el-fault");
      if (sel) sel.value = fault;
    }
    paintMeter();
    paintTs();
  }

  function paintTs() {
    const ol = host && host.querySelector("#el-ts");
    if (!ol) return;
    ol.innerHTML = TS_NOCOOL.map((s, i) => {
      const mark = tsDone[s.id] || "";
      const cls = "el-ts-step" + (i === tsI && tsOn ? " now" : "") + (mark ? " " + mark : "");
      const tag = mark === "ok" ? "PASS" : mark === "found" ? "OPEN" : mark === "fail" ? "FAIL" : (i === tsI && tsOn ? "NOW" : String(s.n));
      return '<li class="' + cls + '" data-ts="' + s.id + '"><span class="el-ts-n">' + tag + "</span><div><strong>" + s.n + ". " + s.title + "</strong><p>" +
        (i === tsI && tsOn ? s.say : "") + "</p></div></li>";
    }).join("");
    const go = host.querySelector("#el-ts-go");
    if (go) go.textContent = tsOn ? "Reset sheet" : "Start no-cool sheet";
  }

  function armJobMeter() {
    mode = "vac";
    if (job && (job.id === "disc" || job.id === "cap" || job.id === "fuse" || job.id === "rv")) {
      red = "l1";
      black = "l2";
    } else {
      red = "r";
      black = "c24";
    }
  }

  function meterForNode(n) {
    ladderProof = false;
    if (labMode !== "defusal" || !job || !n) return;
    if (n.id === "cap") {
      mode = "cap";
      ladderProof = true;
    } else if (job.id === "fuse" && n.id === "comp") {
      mode = "ohm";
      red = "compc";
      black = "gnd";
      ladderProof = true;
    } else mode = "vac";
  }

  function scoreTs(node, v, c) {
    if (!tsOn) return;
    const s = tsStep();
    if (!s) return;
    if (s.node !== node.id) {
      sheetNote = "Not that box. Step " + s.n + " is " + s.title + ". " + s.say;
      return;
    }
    if (s.wantCall && !callCool) {
      sheetNote = "Hit Y first. No call, no cool. The outdoor unit stays off.";
      return;
    }
    if (s.wantCall && callCool) {
      tsDone[s.id] = "ok";
      tsI = Math.min(TS_NOCOOL.length - 1, tsI + 1);
      const nxt = tsStep();
      sheetNote = nxt ? nxt.say : "Y is calling. Walk the string.";
      paintTs();
      return;
    }
    if (s.across && !contactFed(s.node, c)) {
      sheetNote = "No call on " + s.title.toLowerCase() + ". About 0 V is not a closed contact. Put the call in, then meter this box. Don't jump it.";
      paintTs();
      return;
    }
    if (s.id === "coil" && !c.y) {
      sheetNote = "No Y call. 0 V at the coil is not an open winding. Hit Y and walk the safeties.";
      paintTs();
      return;
    }
    const isThisOpen = !!(s.openFault && fault === s.openFault);
    const acrossOpen = !!(s.across && v >= 20);
    const capFound = !!(s.openFault === "open_cap" && fault === "open_cap");
    const coilFound = !!(s.id === "coil" && fault === "open_coil" && v >= 20);
    const pass = s.across ? v < 3 : v >= (s.minV || 0);
    if (acrossOpen || capFound || coilFound || (!pass && isThisOpen)) {
      tsDone[s.id] = "found";
      meteredOpen = true;
      if (acrossOpen) sheetNote = "About " + Math.round(v) + " V across " + s.title.toLowerCase() + ". That's the open. The coil sees about 0. Don't jump it.";
      else if (capFound) sheetNote = "Voltage is here and it won't run. Locked-rotor amps, not running amps. Open HERM cap. The outdoor fan is parallel and can still run. Don't size a breaker from inrush.";
      else if (coilFound) sheetNote = "About 24 V on the coil and it doesn't pull in. Open winding. 0 V at the coil would mean a safety upstream. Don't jump a safety.";
      else sheetNote = "0 volts on " + s.title.toLowerCase() + ". That's the open on this measurement. Don't shotgun the next part.";
      paintTs();
      return;
    }
    if (pass) {
      tsDone[s.id] = "ok";
      if (tsI < TS_NOCOOL.length - 1) {
        tsI += 1;
        const nxt = tsStep();
        const bit = s.across ? " drops about 0 V. Closed contact." : " reads about " + Math.round(v) + " volts.";
        sheetNote = s.title + bit + " Next: " + (nxt ? nxt.say : "done.");
      } else {
        sheetNote = "Sheet's done. You walked stat, line, disconnect, R-C, Y, safeties, coil, load, and the compressor.";
      }
      paintTs();
      return;
    }
    tsDone[s.id] = "fail";
    sheetNote = s.title + " failed. " + s.say;
    paintTs();
  }

  function tapLadder(nodeId) {
    const n = ladderNodes().find((x) => x.id === nodeId);
    if (!n) return;
    if (labMode === "defusal" && job && !defused && !boom && !meteredOpen) {
      const want = satWantId();
      if (want && nodeId !== want) {
        sheetNote = "Not that box. " + satCue(want, job);
        paintLadder();
        paintDefusal();
        const note = host.querySelector("#el-note");
        if (note) note.textContent = sheetNote;
        const st = host.querySelector("#el-status");
        if (st) st.textContent = sheetNote;
        return;
      }
    }
    ladderTap = nodeId;
    red = n.probeRed;
    black = n.probeBlk;
    probed = true;
    meterForNode(n);
    const v = nodeVolts(n);
    if (tutOn && n.id === "xfmr" && v >= 8) tutStep = Math.max(tutStep, 1);
    if (labMode === "defusal" && job) scoreSat(n.id);
    else scoreTs(n, v, circuit());
    paintLadder();
    paintMeter();
    if (labMode !== "defusal" && tsOn && sheetNote) {
      const note = host.querySelector("#el-note");
      if (note) note.textContent = sheetNote;
    }
    onGuideEvent("ladder", nodeId);
    if (guideOn) {
      const s = guideStep();
      if (s && s.wait && s.wait.indexOf("zoom:") === 0 && n.zoom === s.wait.split(":")[1]) openZoom(n.zoom);
    }
  }

  function setView(v) {
    view = v === "lugs" ? "lugs" : "ladder";
    const lad = host && host.querySelector("#el-ladder");
    const lug = host && host.querySelector("#el-lugs-wrap");
    const pal = host && host.querySelector(".sb-palette");
    if (lad) lad.hidden = view !== "ladder";
    if (lug) lug.hidden = view !== "lugs";
    if (pal) pal.classList.toggle("el-pal-off", view === "ladder" && !meterSchool);
    if (host) host.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    if (view === "lugs") {
      runs = [];
      pending = null;
      refreshSlots();
      requestAnimationFrame(paintRuns);
      const first = ["src"].concat(SLOTS.map(function (s) { return s.id; })).find(function (id) {
        if (id !== "src" && !placed[id]) return false;
        return termsFor(id).length && missingTerms(id).length > 0;
      });
      if (first) openZoom(first);
    } else {
      if (!runs.length) landFactory();
      paintLadder();
    }
    fitChrome();
  }

  function sourceBarMarkup() {
    return `<div class="el-source" id="el-source">
      <span class="el-source-kicker">LINE IN</span>
      <button type="button" class="el-lug hot" data-lug="src.hot" title="Hot · black" ${labMode === "defusal" ? "disabled" : ""}>H</button>
      <span class="el-source-name">Hot · black</span>
      <button type="button" class="el-lug neu" data-lug="src.n" title="Neutral · off-white" ${labMode === "defusal" ? "disabled" : ""}>N</button>
      <span class="el-source-name">Neutral · off-white</span>
      <button type="button" class="el-lug gnd" data-lug="src.gnd" title="Ground · green" ${labMode === "defusal" ? "disabled" : ""}>G</button>
      <span class="el-source-name">Ground · green</span>
    </div>`;
  }

  function schematicMarkup() {
    return `<svg id="el-runs" class="el-runs" aria-hidden="true"></svg>`;
  }

  function satStepsFor(j) {
    const id = j && j.id;
    const map = {
      hpc: ["xfmr", "fuse", "stat", "hpc"],
      lpc: ["xfmr", "fuse", "stat", "hpc", "lpc"],
      float: ["xfmr", "fuse", "stat", "hpc", "lpc", "float"],
      coil: ["xfmr", "fuse", "stat", "hpc", "lpc", "float", "coil"],
      disc: ["l1", "disc"],
      cap: ["l1", "t1", "cap"],
      fuse: ["comp"],
      swap: ["stat"],
      limit: ["xfmr", "limit"],
      rv: ["fuse"],
    };
    return (id && map[id]) || (id && PROVE[id] ? [PROVE[id]] : []);
  }

  function satCue(nodeId, j) {
    const who = j || job;
    const steps = satStepsFor(who);
    const last = !!(steps.length && steps[steps.length - 1] === nodeId);
    if (last && who && who.id === "hpc") return "Tap HPC. About 24 V across it, after a live stat, is the open high-pressure switch. The coil sees 0. Hit Replace. Don't jump it.";
    if (last && who && who.id === "lpc") return "Tap LPC. About 24 V across it is the open low-pressure switch. Hit Replace. Don't add gas, and don't jump it.";
    if (last && who && who.id === "float") return "Tap FLOAT. About 24 V across the float means it opened Y. The coil sees 0. Hit Replace. Don't jump the float.";
    if (last && who && who.id === "coil") return "Tap COIL. About 24 V and the contactor never pulls in. The winding is open. Hit Replace contactor.";
    if (last && who && who.id === "disc") return "Tap DISC. Load at 0 with L1 still hot means the puller is open. Hit Replace fused disconnect.";
    if (last && who && who.id === "cap") return "Tap CAP. Power-off OL µF is an open HERM cap. Locked-rotor, not running amps. The outdoor fan can still run. Hit Replace. Don't condemn the compressor.";
    if (last && who && who.id === "fuse") return "Tap COMP. About 0.4 Ω to ground means the compressor is shorted. Hit Isolate compressor C. A new 3A pops on that short.";
    if (last && who && who.id === "swap") return "Tap STAT. Yellow is landed on G. Hit Move Y off G. Green is the fan, not the cool call.";
    if (last && who && who.id === "limit") return "Tap LIMIT. About 24 V across the limit on a heat call means it is open. The gas valve sees 0. Hit Replace high-limit. Don't jump it.";
    if (last && who && who.id === "rv") return "Tap the 3A. It is open. Hit Isolate O before you replace the fuse. A new 3A on a shorted reversing valve pops.";
    const mid = {
      xfmr: "Tap R. You want about 24 volts. That proves the transformer before you blame a safety.",
      fuse: "Tap the 3A. R to C should still be about 24 volts. Don't skip to the open safety.",
      stat: "Tap STAT. Y is calling, so this box should be about 24 volts.",
      hpc: "Tap HPC. A closed contact drops about 0 V. About 24 V across it means stop — that's the open. Don't jump a safety.",
      lpc: "Tap LPC. A closed contact drops about 0 V. Keep walking if it does. Don't jump a safety.",
      float: "Tap FLOAT. A closed contact drops about 0 V. The coil is next.",
      l1: "Tap L1. You want about 240 volts before you blame the disconnect or the cap.",
      t1: "Tap T1. The contactor is in, so this should be about 240.",
    };
    return mid[nodeId] || ("Tap " + String(nodeId || "").toUpperCase() + ".");
  }

  function satWantId() {
    if (!job || meteredOpen || defused || boom) return "";
    const steps = satStepsFor(job);
    if (!steps.length) return "";
    return steps[Math.min(satI, steps.length - 1)] || "";
  }

  function scoreSat(nodeId) {
    if (!job || defused || boom) return;
    const steps = satStepsFor(job);
    if (!steps.length) return;
    if (job.id === "rv" && fusePopped && !isolated) {
      sheetNote = "New 3A pops. The reversing valve is still shorted. Hit Isolate O, then replace the fuse.";
      return;
    }
    if (job.id === "rv" && isolated && !defused) {
      sheetNote = "O is isolated. Hit Replace 3A control fuse. The reversing valve is off the short.";
      return;
    }
    if (meteredOpen) {
      sheetNote = "Meter confirmed. " + satCue(steps[steps.length - 1], job);
      return;
    }
    const want = steps[satI] || steps[steps.length - 1];
    if (nodeId !== want) {
      sheetNote = "Not that box. " + satCue(want, job);
      return;
    }
    const nNow = ladderNodes().find((x) => x.id === nodeId);
    const vNow = nNow ? nodeVolts(nNow) : 0;
    const last = nodeId === steps[steps.length - 1];
    const safetyJob = job.id === "hpc" || job.id === "lpc" || job.id === "float" || job.id === "limit";
    let proved = true;
    let block = "";
    if (job.id === "cap") {
      proved = last || vNow >= 200;
      if (!proved) block = "This box is not about 240 yet. Meter it before you blame the cap.";
    } else if (job.id === "disc") {
      proved = nodeId === "l1" ? vNow >= 200 : vNow < 5;
      if (!proved) block = nodeId === "l1"
        ? "L1 is not about 240. Don't call the disconnect open until line is hot and the load is dead."
        : "Load still has voltage. That's not an open puller.";
    } else if (job.id === "fuse" || job.id === "swap" || job.id === "rv") {
      proved = true;
    } else if (last && (safetyJob || job.id === "coil")) {
      proved = vNow >= 20;
      if (!proved) block = "The meter does not show about 24 V here. Put the call in and read it again. Don't replace a part you have not proved, and don't jump a safety.";
    } else if (isContactNode(nodeId)) {
      if (!contactFed(nodeId, circuit())) {
        proved = false;
        block = "No call on this contact. About 0 V is not a closed contact. Put the call in, then meter it.";
      } else if (vNow >= 20) {
        proved = false;
        block = "About 24 V across this safety. That's the open. Stop. Don't keep walking, and don't jump it.";
      } else proved = vNow < 3;
    } else if (nodeId === "l1" || nodeId === "t1") {
      proved = vNow >= 200;
      if (!proved) block = "Not about 240 yet. Stay on this box.";
    } else if (nodeId === "coil") {
      proved = vNow >= 20;
      if (!proved) block = "Coil sees about 0. The open is still upstream. Don't replace the contactor.";
    } else {
      proved = vNow >= 20;
      if (!proved) block = "Not about 24 V. This box is not proved. Meter it before the next one.";
    }
    if (!proved) {
      sheetNote = block || satCue(nodeId, job);
      return;
    }
    if (satI < steps.length - 1) {
      satI += 1;
      sheetNote = "Good. " + satCue(steps[satI], job);
      return;
    }
    meteredOpen = true;
    tutStep = Math.max(tutStep, 2);
    sheetNote = "Meter confirmed. " + satCue(want, job);
  }

  function revealInLadder(el) {
    const sc = host && host.querySelector("#el-ladder");
    if (!sc || !el) return;
    const er = el.getBoundingClientRect();
    const sr = sc.getBoundingClientRect();
    const topGuard = 44;
    if (er.top >= sr.top + topGuard && er.bottom <= sr.bottom - 8 && er.left >= sr.left - 2 && er.right <= sr.right + 2) return;
    const delta = (er.top + er.height / 2) - (sr.top + sr.height / 2);
    sc.scrollTop += delta;
  }

  function fitChrome() {
    if (!host) return;
    const pal = host.querySelector(".sb-palette");
    const trayOff = !!(pal && pal.classList.contains("el-pal-off"));
    const partsT = host.querySelector("#el-parts-toggle");
    if (partsT) partsT.style.display = trayOff ? "none" : "";
    const hideBench = labMode === "build" && view === "ladder" && !meterSchool;
    host.querySelectorAll(".el-bench").forEach(function (el) {
      el.style.display = hideBench ? "none" : "";
    });
    const lad = host.querySelector("#el-ladder");
    if (lad) lad.style.paddingBottom = (window.innerWidth || 390) <= 800 ? "96px" : "";
  }

  function onResizeChrome() { fitChrome(); }

  function tutDone() {
    try { return localStorage.getItem("lt-sat-tut-v1") === "1"; } catch (_) { return false; }
  }

  function satHubSay() {
    if (defused) return "Call closed. Next call stays on this bay.";
    if (boom) return "The clock won, or you guessed. The customer is still hot.";
    if (job && sheetNote) return sheetNote;
    if (tutOn) {
      if (defused) return "That's the job. Meter the string, then replace the open. The other bays are the same move, on a clock.";
      if (tutStep >= 2 || meteredOpen) return "That safety is open. About 24 V across it, and the coil sees 0. Hit Replace. Don't jump it, and don't change the compressor.";
      if (tutStep >= 1) return "R is hot. Walk the safeties in order. A closed contact drops about 0 V. About 24 V across one means that's the open.";
      return "House is hot. Y is already calling. Don't change a part. Tap R on the 24-volt string.";
    }
    if (!job) return "Pick a bay. One kind of call at a time.";
    if (defused) return "Call closed. Next call stays on this bay.";
    if (boom) return "The clock won, or you guessed. The customer is still hot.";
    if (job.id === "swap") {
      return meteredOpen
        ? "Yellow was landed on G. Move Y off G. Fan is not the cool call."
        : "Yellow was landed on G. The fan runs and the condenser never starts. Tap STAT.";
    }
    if (job.id === "rv" && isolated) return "O is isolated. Replace the fuse. The reversing valve is off the short.";
    if (job.id === "rv" && fusePopped) return "New 3A pops. The reversing valve is still shorted.";
    if (job.id === "rv" && meteredOpen) return "The fuse is open because O/B is shorted. Isolate O before you replace the 3A.";
    if (job.id === "fuse" && meteredOpen) return "Compressor C is shorted to ground. Isolate compressor C. A new 3A on that short pops again.";
    if (job.isolate && isolateReady() && job.id !== "rv") return "You found it. " + job.isolate.label + ". Don't put a new part on a short.";
    if (meteredOpen && job.replaceWin) {
      if (job.id === "cap") return "Cap reads OL. Replace the dual run cap. Don't condemn the compressor.";
      return "That's the open. Replace it. Don't shotgun the next part.";
    }
    if (job.id === "cap") return "Contactor is in and the compressor hums. Tap CAP. Open run cap reads OL µF.";
    if (job.id === "fuse") return "The 3A is open because the compressor is shorted to ground. Tap COMP, then isolate C. A new fuse on a short pops again.";
    if (job.id === "rv") return "The 3A is open. Tap the fuse, then isolate O. Don't slam a new fuse on a shorted reversing valve.";
    if (job.isolate) return "Meter " + String(job.isolate.after).toUpperCase() + " first. Then " + job.isolate.label.toLowerCase() + ".";
    const openLine = {
      hpc: "No cool. Contactor is out. Walk in order. About 24 V across the HPC, and the coil sees 0.",
      lpc: "Iced coil, indoor fan still running. About 24 V across the LPC is the open. Don't jump it.",
      float: "Water in the pan. Outdoor unit is off. About 24 V across the float means it opened Y. Don't jump it.",
      coil: "Safeties are closed. About 24 V on the coil and it never pulls in. The winding is open.",
      disc: "Dead set. House is hot. Meter the disconnect. Line live and load at 0 means the puller is open.",
      limit: "No heat. The inducer ran, then stopped. About 24 V across the limit. The gas valve sees 0.",
    };
    if (openLine[job.id]) return openLine[job.id];
    return "Meter the next box in order. Closed contacts drop about 0 V. An open safety shows about 24 V across it.";
  }

  function isolateReady() {
    if (!job || !job.isolate) return false;
    return ladderTap === job.isolate.after || meteredOpen;
  }

  function isolatePart() {
    if (!job || !job.isolate || defused || boom) return;
    if (!meteredOpen && ladderTap !== job.isolate.after) {
      sheetNote = "Meter it first. " + satCue(satWantId() || (job.isolate && job.isolate.after), job);
      const read = host.querySelector("#el-ladder-read");
      if (read) read.textContent = sheetNote;
      paintLadder();
      return;
    }
    if (job.id === "rv") {
      isolated = true;
      fusePopped = false;
      sheetNote = "O is isolated. Hit Replace 3A control fuse. The reversing valve is off the short.";
      const read = host.querySelector("#el-ladder-read");
      if (read) read.textContent = sheetNote;
      paintMeter();
      return;
    }
    winOut();
  }

  function loadSatDone() {
    satDone = {};
    try {
      String(localStorage.getItem("lt-sat-done-v1") || "").split(",").forEach(function (id) {
        id = String(id || "").trim();
        if (id) satDone[id] = true;
      });
    } catch (_) {}
  }

  function satDoneIds() {
    return JOBS.map(function (j) { return j.id; }).filter(function (id) { return satDone[id]; });
  }

  function saveSatDone() {
    try { localStorage.setItem("lt-sat-done-v1", satDoneIds().join(",")); } catch (_) {}
  }

  function markSatDone(id) {
    if (!id) return;
    satDone[id] = true;
    saveSatDone();
  }

  function returnToSameBay() {
    const id = job && job.id;
    const fromJob = id && BAYS.find(function (x) { return x.jobs.indexOf(id) >= 0; });
    if (fromJob) satBay = fromJob.id;
    const bay = satBay;
    clearTimer();
    job = null;
    tutOn = false;
    tutStep = 0;
    satI = 0;
    defused = false;
    boom = false;
    meteredOpen = false;
    ladderTap = null;
    cutSet = {};
    isolated = false;
    fusePopped = false;
    timeLeft = 0;
    probed = false;
    view = "ladder";
    labMode = "defusal";
    satBay = bay;
    build();
    wire();
  }

  function clockOutSaturday() {
    if (!satDoneIds().length || satClocked) return;
    satClocked = true;
    if (onWin) onWin({ mode: "defusal", clockOut: true, done: satDoneIds().slice() });
    const note = host && host.querySelector(".el-jobs-note");
    if (note) note.textContent = "Clocked out. You're still on Saturday. Hit Shop floor when you want to leave.";
    const btn = host && host.querySelector("#el-clock-out");
    if (btn) btn.hidden = true;
  }

  function paintDefuseActions() {
    if (!host || labMode !== "defusal" || !job) return;
    const iso = host.querySelector("#el-isolate");
    const rep = host.querySelector("#el-replace");
    const locked = !!(defused || boom);
    if (job.id === "rv") {
      if (iso) iso.hidden = locked || !meteredOpen || !!isolated;
      if (rep) rep.hidden = locked || !meteredOpen || !isolated;
      return;
    }
    if (job.isolate) {
      if (iso) iso.hidden = locked || !meteredOpen;
      if (rep) rep.hidden = true;
      return;
    }
    if (iso) iso.hidden = true;
    if (rep) rep.hidden = locked || !meteredOpen;
  }

  function jobPickerMarkup() {
    const hub = !tutDone()
      ? `<div class="el-sat-intro" style="padding:10px 12px;gap:10px">
          <img src="hub-portrait.jpg?v=3" alt="Professor HUB" style="width:56px;height:56px" />
          <div>
            <p class="eyebrow">Professor HUB · first Saturday</p>
            <h2 style="font-size:22px;margin:0 0 4px">Walk the first call with me</h2>
            <p style="margin:0 0 8px">Hit Walk it with me, or pick a bay if you already know the move.</p>
            <button type="button" class="btn primary" id="el-sat-start">Walk it with me</button>
          </div>
        </div>`
      : "";
    if (!satBay) {
      const clock = satDoneIds().length
        ? `<div class="el-jobs-backrow"><button type="button" class="btn primary" id="el-clock-out"${satClocked ? " hidden" : ""}>Clock out</button></div>`
        : "";
      return `<div class="el-jobs" id="el-jobs">
        ${hub}
        <p class="el-jobs-kicker">Saturday callback</p>
        ${hub ? "" : `<p class="el-jobs-note">Pick a bay. One kind of call at a time. Meter the bad box, then replace it or isolate it.</p>`}
        ${clock}
        ${BAYS.map((b) => {
          const doneN = b.jobs.filter((id) => satDone[id]).length;
          return `<button type="button" class="el-job-card el-bay-card" data-bay="${b.id}" style="min-height:0;padding:8px 12px">
          <strong>${b.name}</strong>
          <small>${doneN ? doneN + " done · " : ""}${b.jobs.length} call${b.jobs.length === 1 ? "" : "s"}</small>
          <p>${b.note}</p>
        </button>`;
        }).join("")}
      </div>`;
    }
    const bay = BAYS.find((b) => b.id === satBay) || BAYS[0];
    const list = JOBS.filter((j) => bay.jobs.indexOf(j.id) >= 0);
    return `<div class="el-jobs" id="el-jobs">
      <div class="el-jobs-backrow"><button type="button" class="btn" id="el-bay-back">All bays</button></div>
      <p class="el-jobs-kicker">${bay.name}</p>
      <p class="el-jobs-note">${bay.note}</p>
      ${list.map((j) => `<button type="button" class="el-job-card" data-job="${j.id}">
        <span class="el-job-time">${j.seconds}s</span>
        <strong>${j.name}${satDone[j.id] ? " · done" : ""}</strong>
        <small>${KITS[j.kit] ? KITS[j.kit].name : j.kit}</small>
        <p>${j.symptom}</p>
      </button>`).join("")}
    </div>`;
  }

  function defusalBarMarkup() {
    if (!job) return "";
    const replaceName = job.replaceWin
      ? (PARTS.find((p) => p.slot === job.replaceWin || p.id === job.replaceWin) || { name: job.replaceWin }).name
      : "";
    const wantsReplace = !!(replaceName && !(job.isolate && job.id !== "rv"));
    const isolateLabel = job.isolate ? job.isolate.label : "";
    const clock = tutOn
      ? "WALK"
      : String(Math.floor(timeLeft / 60)) + ":" + String(timeLeft % 60).padStart(2, "0");
    return `<div class="el-defuse-bar" id="el-defuse-bar">
      <div class="el-defuse-top">
        <div class="el-timer ${!tutOn && timeLeft <= 20 ? "panic" : ""}" id="el-timer">${clock}</div>
        <div>
          <p class="eyebrow">${tutOn ? "First call · clock off" : "Saturday callback"}</p>
          <strong id="el-job-name">${tutOn ? "Walk it with Hub" : job.name}</strong>
          <span class="el-defuse-state" id="el-defuse-state">${tutOn ? "WALK" : "LIVE CALL"}</span>
        </div>
      </div>
      <div class="el-sat-hub" id="el-sat-hub">
        <img src="hub-portrait.jpg?v=3" alt="Professor HUB" />
        <div>
          <p class="eyebrow">Professor HUB</p>
          <p id="el-sat-say">${satHubSay()}</p>
        </div>
      </div>
      ${wantsReplace ? `<button type="button" class="btn primary" id="el-replace">Replace ${replaceName}</button>` : ""}
      ${isolateLabel ? `<button type="button" class="btn primary" id="el-isolate" hidden>${isolateLabel}</button>` : ""}
    </div>`;
  }

  function spoolBarMarkup() {
    if (labMode !== "build") return "";
    return `<div class="el-spools" role="group" aria-label="Wire spool">
      <button type="button" class="el-spool hot ${spool === "hot" ? "active" : ""}" data-spool="hot"><i></i> Hot · black</button>
      <button type="button" class="el-spool neu ${spool === "neutral" ? "active" : ""}" data-spool="neutral"><i></i> Neutral · off-white</button>
      <button type="button" class="el-spool gnd ${spool === "ground" ? "active" : ""}" data-spool="ground"><i></i> Ground · green</button>
      <button type="button" class="btn" id="el-pull">Pull last</button>
    </div>`;
  }

  function meterBenchMarkup() {
    return `<div class="el-meter-bench" id="el-meter-bench">
      <p class="eyebrow">Same close-up as land lugs</p>
      <strong>Drag the test leads onto the screws.</strong>
      <p>Pick a device. Drag RED and BLACK onto the terminals. The screen follows the dial.</p>
      <div class="el-meter-picks">${METER_FACES.map(function (f) {
        return '<button type="button" class="el-meter-pick" data-mface="' + f.id + '">' + f.short + "</button>";
      }).join("")}</div>
    </div>`;
  }

  function build() {
    const kitOpts = Object.keys(KITS).map((k) =>
      `<option value="${k}"${k === activeKit ? " selected" : ""}>${KITS[k].name}</option>`
    ).join("");
    const showPicker = labMode === "defusal" && !job;
    host.innerHTML = `
      <div class="el-layout ${labMode === "defusal" ? "defusal" : "build"}${meterSchool ? " meter-on" : ""}">
        <aside class="sb-palette">
          <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
            <div class="brand-mark" style="width:28px;height:28px;font-size:13px">LT</div>
            <div class="brand-word"><strong style="font-size:13px">${(window.LtBrand && window.LtBrand.org) || "HVAC Legends"}</strong><span>${labMode === "defusal" ? "Saturday callback · meter the open" : "Follow the 24V call"}</span></div>
          </div>
          <p class="eyebrow">${meterSchool ? "Meter school · drag the leads" : view === "lugs" ? "Parts · drop then zoom" : "You don't need the tray on the ladder"}</p>
          <div class="sb-tabs">
            <button class="sb-tab active" data-tab="line">Line 240</button>
            <button class="sb-tab" data-tab="control">Control 24</button>
            <button class="sb-tab" data-tab="loads">Loads</button>
            <button class="sb-tab" data-tab="tools">Tools</button>
          </div>
          <div id="el-items" class="sb-items"></div>
          <p class="sb-hint">${labMode === "defusal"
            ? "Walk the 24V string in order. Closed contacts drop about 0 V. An open safety shows about 24 V across it, and the coil sees 0. Then replace that part. Don't jump a safety."
            : meterSchool
              ? "Same close-up as land lugs. Drag the red lead and the black lead onto the screws. Dial is on the card."
            : view === "lugs"
              ? "Drop a part, tap it. Drag black / off-white / green onto the screws on the close-up."
              : "This is a wiring diagram, not a junk drawer. Tap a box to meter it. Y on the stat makes the string live."}</p>
          <div class="hub-chip" style="margin-top:10px;max-width:none">
            <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
            <div><strong>Professor HUB</strong><p>${labMode === "defusal"
              ? (tutOn
                ? "Clock is off. Tap the box I name. About 24 V across a safety is the open. The coil sees 0. Don't jump it."
                : "One bay at a time. Meter the open, then replace it. Don't shotgun.")
              : meterSchool
                ? "Drag RED and BLACK onto the screws. COM first, then VΩ, then VAC. Don't ohm it live."
              : "Follow the call first. Land lugs when you need to actually land a color on a screw."}</p></div>
          </div>
        </aside>
        <main class="el-main">
          <header class="sb-toolbar">
            <div class="el-modes" role="tablist" style="flex:1 1 100%;flex-wrap:wrap;margin:0">
              <button type="button" class="el-mode-btn ${labMode !== "defusal" && view === "ladder" && !guideOn && !meterSchool ? "active" : ""}" data-lab="build" data-view="ladder">Follow the call</button>
              <button type="button" class="el-mode-btn ${labMode !== "defusal" && view === "lugs" && !meterSchool ? "active" : ""}" data-view="lugs">Land lugs</button>
              <button type="button" class="el-mode-btn ${guideOn ? "active" : ""}" data-lab="guide">HUB walk</button>
              <button type="button" class="el-mode-btn ${meterSchool && meterGuideOn ? "active" : ""}" data-lab="meter">Meter school</button>
              <button type="button" class="el-mode-btn ${meterSchool && !meterGuideOn ? "active" : ""}" data-lab="meterfree">Meter practice</button>
              <button type="button" class="el-mode-btn ${labMode === "defusal" ? "active" : ""}" data-lab="defusal" id="el-mode-defuse">Saturday callback</button>
            </div>
            <div class="lab-drawers" role="toolbar" aria-label="Phone trays">
              <button type="button" class="btn lab-drawer-btn" id="el-parts-toggle">Parts</button>
              <button type="button" class="btn lab-drawer-btn" id="el-meter-toggle">DMM</button>
            </div>
            ${labMode === "build" ? `
            <label class="el-bench">Kit
              <select id="el-kit-sel">${kitOpts}</select>
            </label>
            <label class="el-bench">Fault
              <select id="el-fault">
                <option value="none">Healthy circuit</option>
                <option value="open_cap">Open run capacitor</option>
                <option value="open_coil">Open contactor coil</option>
                <option value="open_hpc">Open high-pressure switch</option>
                <option value="open_lpc">Open low-pressure switch</option>
                <option value="float_open">Float switch open (full pan)</option>
                <option value="open_disc">Disconnect open</option>
                <option value="no_xfmr">Open transformer</option>
                <option value="blown_fuse">Blown 3A fuse</option>
                <option value="grounded">Compressor winding to ground</option>
                <option value="open_limit">Open high-limit</option>
                <option value="lockout">Lockout relay held</option>
              </select>
            </label>
            <button class="btn el-bench" id="el-kit">Load kit</button>
            <button class="btn el-bench" id="el-clear">Clear</button>
            ` : `
            <button class="btn" id="el-jobs-back" ${job ? "" : "style='display:none'"}>All callbacks</button>
            `}
            <button class="btn" id="el-hub">Shop floor</button>
          </header>
          ${showPicker ? jobPickerMarkup() : `
          ${labMode === "defusal" ? defusalBarMarkup() : ""}
          ${meterSchool ? meterBenchMarkup() : ""}
          ${ladderMarkup()}
          <div id="el-lugs-wrap" ${view === "lugs" ? "" : "hidden"}>
          ${labMode === "build" ? spoolBarMarkup() : ""}
          <div class="el-board" id="el-board">
            <div class="el-board-inner" id="el-board-inner">
            ${sourceBarMarkup()}
            ${schematicMarkup()}
            </div>
          </div>
          </div>
          <p class="el-status" id="el-status"></p>
          <p class="el-chips" id="el-chips"></p>`}
        </main>
        <aside class="el-meter">
          <p class="eyebrow">Digital multimeter</p>
          <img src="parts/dmm.png" alt="DMM" class="el-dmm-img" />
          <div class="dmm-lcd el-lcd"><span id="el-lcd">241.0</span><small id="el-unit">VAC</small></div>
          <div class="el-leads">
            <div><i class="red"></i> RED <b id="el-redn">L1 (line)</b></div>
            <div><i class="blk"></i> COM <b id="el-blkn">L2 (line)</b></div>
          </div>
          <label>Function
            <select id="el-mode">
              <option value="vac">VAC</option>
              <option value="vdc">VDC</option>
              <option value="aac">AAC (clamp)</option>
              <option value="ohm">OHMS (lockout)</option>
              <option value="cont">Continuity</option>
              <option value="cap">CAPACITANCE µF</option>
            </select>
          </label>
          <div class="dmm-jacks">
            <p class="eyebrow">Jacks · pick a lead, tap a jack</p>
            <div class="dmm-lead-pick">
              <button type="button" class="dmm-lead red" data-lead="red" id="dmm-lead-red">RED</button>
              <button type="button" class="dmm-lead blk" data-lead="blk" id="dmm-lead-blk">BLACK</button>
            </div>
            <div class="dmm-jack-row">
              <button type="button" class="dmm-jack" data-jack="a" id="dmm-jack-a">A<small>10A fused</small></button>
              <button type="button" class="dmm-jack com" data-jack="com" id="dmm-jack-com">COM<small>black</small></button>
              <button type="button" class="dmm-jack v" data-jack="v" id="dmm-jack-v">VΩ<small>volts / ohms</small></button>
            </div>
          </div>
          <button type="button" class="btn" id="el-hub-stuck">I'm stuck · ask HUB</button>
          <p class="eyebrow el-probe-kicker" style="margin-top:10px" ${meterSchool ? "hidden" : ""}>Probe points — click sets RED, shift-click sets COM</p>
          <button type="button" class="btn primary" id="el-land-leads" ${meterSchool ? "hidden" : ""}>Open the lead close-up</button>
          <div id="el-probes" class="el-probes" ${meterSchool ? "hidden" : ""}></div>
          <p class="dmm-note" id="el-note"></p>
          <button type="button" class="btn" id="el-meter-fuse" hidden>Replace meter fuse</button>
          <div class="el-lamps">
            <span id="el-24">24V</span>
            <span id="el-y">Y</span>
            <span id="el-w">W</span>
            <span id="el-o">O/B</span>
            <span id="el-coil">COIL</span>
            <span id="el-run">COMP</span>
          </div>
        </aside>
        <div class="el-overlay" id="el-boom">
          <div class="el-overlay-card bad">
            <p class="eyebrow">Callback</p>
            <h2>CALLBACK</h2>
            <p class="el-overlay-msg">Clock ran out. Customer is still hot.</p>
            <div class="row" style="gap:8px;justify-content:center;margin-top:12px">
              <button type="button" class="btn primary" id="el-retry">Retry this call</button>
              <button type="button" class="btn" id="el-boom-jobs">All callbacks</button>
            </div>
          </div>
        </div>
        <div class="el-overlay" id="el-win">
          <div class="el-overlay-card ok">
            <img src="jesus.png" alt="HVAC Jesus" class="el-win-jesus" />
            <p class="eyebrow">Defused</p>
            <h2>CALL CLOSED</h2>
            <p class="el-overlay-msg">Call closed. Next call stays on this bay.</p>
            <div class="row" style="gap:8px;justify-content:center;margin-top:12px">
              <button type="button" class="btn primary" id="el-win-next">Next call</button>
              <button type="button" class="btn" id="el-win-bays">Back to Saturday</button>
            </div>
          </div>
        </div>
        <div class="el-guide" id="el-guide">
          <img src="hub-portrait.jpg?v=3" alt="Professor HUB" />
          <div>
            <p class="eyebrow" id="el-guide-step">GUIDED WIRING</p>
            <strong id="el-guide-title">Three colors</strong>
            <p id="el-guide-say">Black is hot. Off-white is neutral. Green is ground.</p>
            <div class="el-guide-row">
              <button type="button" class="btn primary" id="el-guide-next">Next</button>
              <button type="button" class="btn" id="el-guide-skip">Skip</button>
            </div>
          </div>
        </div>
        <div class="el-zoom" id="el-zoom">
          <div class="el-zoom-card">
            <button type="button" class="el-zoom-close" id="el-zoom-close" aria-label="Close close-up">×</button>
            <p class="eyebrow">Wire this device</p>
            <strong id="el-zoom-name">Device</strong>
            <p id="el-zoom-desc"></p>
            <p class="el-zoom-coach" id="el-zoom-coach" hidden></p>
            <div class="el-zoom-stage">
            <div class="el-spools el-zoom-spools" id="el-zoom-spools"></div>
            <div class="el-zoom-work" id="el-zoom-work">
              <img id="el-zoom-img" alt="" hidden />
              <span id="el-zoom-ico" class="ico" hidden></span>
              <svg id="el-zoom-svg" class="el-zoom-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
              <div id="el-zoom-screws" class="el-zoom-screws"></div>
            </div>
            </div>
            <p class="el-zoom-ok" id="el-zoom-ok" hidden>Correct</p>
            <ul class="el-zoom-need" id="el-zoom-need"></ul>
            <p class="el-zoom-hint" id="el-zoom-hint">Drag the matching color onto each screw on this close-up.</p>
            <div class="el-lead-face" id="el-lead-face" hidden>
              <div class="el-lead-lcd"><span id="el-lead-val">—.—</span><small id="el-lead-unit"></small></div>
              <div class="el-lead-dials" id="el-lead-dials">
                <button type="button" data-mdial="vac">VAC</button>
                <button type="button" data-mdial="vdc">VDC</button>
                <button type="button" data-mdial="aac">AAC</button>
                <button type="button" data-mdial="ohm">OHMS</button>
                <button type="button" data-mdial="cont">CONT</button>
                <button type="button" data-mdial="cap">µF</button>
              </div>
              <div class="el-lead-jacks">
                <button type="button" class="el-meter-pick" data-mlead="red" hidden>RED plug</button>
                <button type="button" class="el-meter-pick" data-mlead="blk" hidden>BLACK plug</button>
                <button type="button" class="el-lead-jack" data-mjack="a">A<small>10A</small></button>
                <button type="button" class="el-lead-jack" data-mjack="com">COM</button>
                <button type="button" class="el-lead-jack" data-mjack="v">VΩ</button>
              </div>
              <p class="el-lead-dial" id="el-lead-dial">Dial · VAC</p>
              <p class="el-lead-note" id="el-lead-note"></p>
              <button type="button" class="el-meter-pick" id="el-meter-power">Pull the disconnect</button>
              <div class="el-lead-boards" id="el-lead-boards"></div>
            </div>
            <button type="button" class="btn primary" id="el-zoom-next">Next device →</button>
          </div>
        </div>
        <div class="el-loupe" id="el-loupe" aria-hidden="true">
          <div class="el-loupe-shot"></div>
          <strong class="el-loupe-name"></strong>
        </div>
      </div>`;
    const board = host.querySelector("#el-board");
    const inner = host.querySelector("#el-board-inner") || board;
    if (inner && board) {
      SLOTS.forEach((s) => {
        const el = document.createElement("div");
        el.className = "el-slot";
        el.dataset.slot = s.id;
        el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("over"); });
        el.addEventListener("dragleave", () => el.classList.remove("over"));
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          el.classList.remove("over");
          place(s.id, e.dataTransfer.getData("text/plain"));
        });
        inner.appendChild(el);
      });
    }
    const pb = host.querySelector("#el-probes");
    if (pb) {
      PROBES.forEach((p) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "el-probe";
        b.textContent = p.label;
        b.onclick = (e) => {
          if (e.shiftKey) black = p.id;
          else red = p.id;
          probed = true;
          paintMeter();
        };
        pb.appendChild(b);
      });
    }
    if (board) {
      refreshSlots();
      renderPalette("line");
      paintMeter();
    } else {
      renderPalette("line");
    }
    bindLugs();
    if (host.querySelector("#el-ladder")) setView(view);
    else {
      const pal = host.querySelector(".sb-palette");
      if (pal && !meterSchool) pal.classList.add("el-pal-off");
    }
    fitChrome();
    if (meterGuideOn) paintMeterGuide();
    paintDmmJacks();
    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }
    if (inner && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(() => paintRuns());
      resizeObs.observe(inner);
    }
  }

  function ensureHubReachable() {
    const btn = host && host.querySelector("#el-hub");
    if (!btn) return;
    const zoomOn = !!(host.querySelector("#el-zoom.show"));
    if (!zoomOn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth || 390;
    const vh = window.innerHeight || 844;
    const onScreen = r.width > 8 && r.height > 8 && r.left < vw - 8 && r.right > 8 && r.top < vh - 8 && r.bottom > 8;
    const cx = Math.min(vw - 2, Math.max(2, r.left + r.width / 2));
    const cy = Math.min(vh - 2, Math.max(2, r.top + r.height / 2));
    const hit = onScreen ? document.elementFromPoint(cx, cy) : null;
    const mine = !!(hit && (hit === btn || btn.contains(hit)));
    if (onScreen && mine) return;
    const layout = host.querySelector(".el-layout");
    if (layout && btn.parentNode !== layout) layout.appendChild(btn);
    btn.style.position = "fixed";
    btn.style.zIndex = "90";
    btn.style.left = "12px";
    btn.style.right = "12px";
    btn.style.bottom = "8px";
    btn.style.top = "auto";
    btn.style.width = "auto";
    btn.style.margin = "0";
  }

  function wire() {
    host.querySelectorAll(".el-mode-btn").forEach((t) => {
      t.onclick = () => {
        if (t.dataset.view === "lugs" && !t.dataset.lab) {
          meterSchool = false;
          meterGuideOn = false;
          leadZoom = false;
          labMode = "build";
          guideOn = false;
          view = "lugs";
          job = null;
          if (!Object.keys(placed).length) loadKit("split");
          build();
          wire();
          setView("lugs");
          return;
        }
        if (t.dataset.lab === "meter" || t.dataset.lab === "meterfree") {
          meterSchool = true;
          meterGuideOn = t.dataset.lab === "meter";
          meterGuideI = 0;
          dmmJackRed = meterGuideOn ? "none" : "v";
          dmmJackBlk = meterGuideOn ? "none" : "com";
          dmmLead = "red";
          red = "";
          black = "";
          leadHand = "red";
          leadBoard = "disconnect";
          labMode = "build";
          guideOn = false;
          view = "ladder";
          tsOn = false;
          callCool = true;
          fault = "none";
          fusedBlown = false;
          meterFuse = false;
          ladderProof = false;
          mode = "vac";
          loadKit("split");
          build();
          wire();
          setView("ladder");
          openLeadZoom("disconnect");
          paintMeterGuide();
          paintMeter();
          return;
        }
        meterSchool = false;
        meterGuideOn = false;
        setLabMode(t.dataset.lab || "build");
        if (t.dataset.view === "ladder") setView("ladder");
      };
    });
    const gNext = host.querySelector("#el-guide-next");
    if (gNext) {
      gNext.onclick = () => {
        if (meterGuideOn) {
          if (meterGuideI >= METER_GUIDE.length - 1) { meterGuideOn = false; paintGuide(); }
          else { meterGuideI += 1; paintMeterGuide(); }
          return;
        }
        if (!guideOn) return;
        const s = guideStep();
        if (guideI >= GUIDE.length - 1) stopGuide();
        else if (s && s.wait) guideStuck();
        else advanceGuide();
      };
    }
    const gSkip = host.querySelector("#el-guide-skip");
    if (gSkip) gSkip.onclick = () => { meterGuideOn = false; stopGuide(); };
    function toggleDrawer(sel) {
      const el = host.querySelector(sel);
      if (!el) return;
      const open = el.classList.toggle("drawer-open");
      host.querySelectorAll(".sb-palette, .el-meter").forEach((n) => {
        if (n !== el) n.classList.remove("drawer-open");
      });
      let veil = host.querySelector(".lab-veil");
      if (!veil) {
        veil = document.createElement("div");
        veil.className = "lab-veil";
        host.appendChild(veil);
        veil.onclick = () => {
          host.querySelectorAll(".drawer-open").forEach((n) => n.classList.remove("drawer-open"));
          veil.classList.remove("show");
        };
      }
      veil.classList.toggle("show", open);
    }
    const partsT = host.querySelector("#el-parts-toggle");
    if (partsT) partsT.onclick = () => toggleDrawer(".sb-palette");
    const meterT = host.querySelector("#el-meter-toggle");
    if (meterT) meterT.onclick = () => toggleDrawer(".el-meter");
    host.querySelectorAll(".sb-tab").forEach((t) => {
      t.onclick = () => {
        host.querySelectorAll(".sb-tab").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        renderPalette(t.dataset.tab);
      };
    });
    host.querySelectorAll(".el-spool").forEach((b) => {
      b.onclick = () => {
        spool = b.dataset.spool;
        pending = null;
        paintLugState();
        if (zoomSlot) syncZoom();
      };
    });
    bindWireDrags();
    const pull = host.querySelector("#el-pull");
    if (pull) {
      pull.onclick = () => {
        if (!runs.length) return;
        runs.pop();
        paintRuns();
        paintMeter();
      };
    }
    const modeEl = host.querySelector("#el-mode");
    if (modeEl) modeEl.onchange = (e) => { mode = e.target.value; ladderProof = false; onMeterEvent("dial"); paintMeter(); };
    host.querySelectorAll("[data-lead]").forEach(function (b) {
      b.onclick = function () { dmmLead = b.dataset.lead; paintDmmJacks(); };
    });
    host.querySelectorAll("[data-jack]").forEach(function (b) {
      b.onclick = function () { plugJack(b.dataset.jack); };
    });
    const stuck = host.querySelector("#el-hub-stuck");
    if (stuck) stuck.onclick = askHubMeter;
    const meterFuseBtn = host.querySelector("#el-meter-fuse");
    if (meterFuseBtn) meterFuseBtn.onclick = () => { meterFuse = false; ladderProof = false; paintMeter(); };
    const landLeads = host.querySelector("#el-land-leads");
    if (landLeads) landLeads.onclick = () => openLeadZoom(leadBoard || "disconnect");
    host.querySelectorAll("[data-mface]").forEach(function (b) {
      b.onclick = function () { openLeadZoom(b.getAttribute("data-mface")); };
    });
    host.querySelectorAll("[data-mdial]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        mode = b.getAttribute("data-mdial");
        ladderProof = false;
        const modeEl = host.querySelector("#el-mode");
        if (modeEl) modeEl.value = mode;
        onMeterEvent("dial");
        paintMeter();
      };
    });
    host.querySelectorAll("[data-mlead]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        dmmLead = b.getAttribute("data-mlead") === "blk" ? "blk" : "red";
        leadHand = dmmLead === "blk" ? "blk" : "red";
        paintDmmJacks();
        paintLeadControls();
      };
    });
    host.querySelectorAll("[data-mjack]").forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        plugJack(b.getAttribute("data-mjack"));
      };
    });
    const meterPower = host.querySelector("#el-meter-power");
    if (meterPower) {
      meterPower.onclick = function (e) {
        e.stopPropagation();
        if (fault === "open_disc") fault = "none";
        else if (fault === "none") fault = "open_disc";
        const faultEl = host.querySelector("#el-fault");
        if (faultEl && (fault === "none" || fault === "open_disc")) faultEl.value = fault;
        paintMeter();
      };
    }
    const faultEl = host.querySelector("#el-fault");
    if (faultEl) {
      faultEl.value = fault;
      faultEl.onchange = (e) => {
        fault = e.target.value;
        fusedBlown = fault === "blown_fuse";
        paintMeter();
      };
    }
    const cool = host.querySelector("#el-cool");
    if (cool) cool.onchange = (e) => { callCool = e.target.checked; paintMeter(); };
    const fan = host.querySelector("#el-fan");
    if (fan) fan.onchange = (e) => { callFan = e.target.checked; paintMeter(); };
    const heat = host.querySelector("#el-heat");
    if (heat) heat.onchange = (e) => { callHeat = e.target.checked; paintMeter(); };
    const rev = host.querySelector("#el-rev");
    if (rev) rev.onchange = (e) => { callRev = e.target.checked; paintMeter(); };
    host.querySelectorAll("[data-call]").forEach((b) => {
      b.onclick = () => {
        const k = b.getAttribute("data-call");
        if (labMode === "defusal" && job && !defused && !boom) {
          callCool = !!job.cool;
          callFan = !!job.fan;
          callHeat = !!job.heat;
          callRev = !!job.rev;
          const leave = "Leave the stat. The customer already set the call. ";
          if (sheetNote.indexOf(leave) !== 0) sheetNote = leave + (sheetNote || "Meter the box the note names.");
          paintMeter();
          paintLadder();
          return;
        }
        if (k === "cool") callCool = !callCool;
        if (k === "fan") callFan = !callFan;
        if (k === "heat") callHeat = !callHeat;
        if (k === "rev") callRev = !callRev;
        if (tsOn && tsStep() && tsStep().wantCall && k === "cool") {
          if (callCool) {
            tsDone[tsStep().id] = "ok";
            tsI = Math.min(TS_NOCOOL.length - 1, tsI + 1);
            const nxt = tsStep();
            sheetNote = nxt ? nxt.say : "Y is calling. Walk the string.";
          } else {
            sheetNote = "You dropped the call. Hit Y. No Y, no cool.";
          }
        }
        paintMeter();
        paintLadder();
        onGuideEvent("call", k);
      };
    });
    const ladder = host.querySelector("#el-ladder");
    if (ladder) {
      ladder.onclick = (e) => {
        const n = e.target.closest("[data-node]");
        if (n) tapLadder(n.getAttribute("data-node"));
      };
    }
    const tsGo = host.querySelector("#el-ts-go");
    if (tsGo) tsGo.onclick = () => beginTs(false);
    const tsPr = host.querySelector("#el-ts-practice");
    if (tsPr) tsPr.onclick = () => beginTs(true);
    const wireThis = host.querySelector("#el-wire-this");
    if (wireThis) {
      wireThis.onclick = () => {
        const n = ladderNodes().find((x) => x.id === ladderTap);
        if (n && n.zoom) openZoom(n.zoom);
      };
    }
    const clr = host.querySelector("#el-clear");
    if (clr) {
      clr.onclick = () => {
        placed = {};
        runs = [];
        pending = null;
        callCool = false;
        callFan = false;
        callHeat = false;
        callRev = false;
        fusedBlown = false;
        meterFuse = false;
        ladderProof = false;
        fault = "none";
        const c1 = host.querySelector("#el-cool");
        const c2 = host.querySelector("#el-fan");
        const c3 = host.querySelector("#el-heat");
        const c4 = host.querySelector("#el-rev");
        if (c1) c1.checked = false;
        if (c2) c2.checked = false;
        if (c3) c3.checked = false;
        if (c4) c4.checked = false;
        if (faultEl) faultEl.value = "none";
        closeZoom();
        refreshSlots();
        paintMeter();
      };
    }
    const kitBtn = host.querySelector("#el-kit");
    if (kitBtn) {
      kitBtn.onclick = () => {
        const sel = host.querySelector("#el-kit-sel");
        loadKit(sel ? sel.value : "split");
        closeZoom();
        refreshSlots();
        paintMeter();
        if (onXp) onXp(15);
      };
    }
    host.querySelectorAll(".el-job-card[data-job]").forEach((b) => {
      b.onclick = () => startJob(b.dataset.job);
    });
    const satStart = host.querySelector("#el-sat-start");
    if (satStart) satStart.onclick = () => startJob("hpc", true);
    host.querySelectorAll("[data-bay]").forEach((b) => {
      b.onclick = () => { satBay = b.dataset.bay; build(); wire(); };
    });
    const bayBack = host.querySelector("#el-bay-back");
    if (bayBack) bayBack.onclick = () => { satBay = null; build(); wire(); };
    const iso = host.querySelector("#el-isolate");
    if (iso) iso.onclick = () => isolatePart();
    const winNext = host.querySelector("#el-win-next");
    if (winNext) winNext.onclick = () => returnToSameBay();
    const winBays = host.querySelector("#el-win-bays");
    if (winBays) winBays.onclick = () => setLabMode("defusal");
    host.querySelectorAll(".el-wire-btn").forEach((b) => {
      b.onclick = () => cutWire(b.dataset.wire);
    });
    const rep = host.querySelector("#el-replace");
    if (rep) rep.onclick = () => replacePart();
    const retry = host.querySelector("#el-retry");
    if (retry) retry.onclick = () => { if (job) startJob(job.id, tutOn); };
    const boomJobs = host.querySelector("#el-boom-jobs");
    if (boomJobs) boomJobs.onclick = () => setLabMode("defusal");
    const jobsBack = host.querySelector("#el-jobs-back");
    if (jobsBack) jobsBack.onclick = () => setLabMode("defusal");
    const clockBtn = host.querySelector("#el-clock-out");
    if (clockBtn) clockBtn.onclick = () => clockOutSaturday();
    const hubBtn = host.querySelector("#el-hub");
    if (hubBtn) {
      hubBtn.onclick = function () {
        clearTimer();
        closeZoom();
        hideLoupe();
        document.removeEventListener("keydown", onKeyZoom);
        window.removeEventListener("resize", onResizeChrome);
        if (resizeObs) {
          resizeObs.disconnect();
          resizeObs = null;
        }
        if (typeof global.ltPlay === "function") global.ltPlay("hub");
      };
    }
    ensureHubReachable();
    fitChrome();
    window.removeEventListener("resize", onResizeChrome);
    window.addEventListener("resize", onResizeChrome);
    const zClose = host.querySelector("#el-zoom-close");
    if (zClose) zClose.onclick = (e) => { e.stopPropagation(); closeZoom(); };
    const zNext = host.querySelector("#el-zoom-next");
    if (zNext) {
      zNext.onclick = (e) => {
        e.stopPropagation();
        const n = nextNeedySlot();
        if (n) openZoom(n);
        else closeZoom();
      };
    }
    const z = host.querySelector("#el-zoom");
    if (z) {
      z.onclick = (e) => {
        if (meterSchool) return;
        if (e.target === z) closeZoom();
      };
    }
    const src = host.querySelector("#el-source");
    if (src) {
      src.addEventListener("click", (e) => {
        if (e.target.closest("[data-lug]")) return;
        openZoom("src");
      });
    }
  }

  function start(root, opts) {
    host = root;
    onXp = opts && opts.onXp;
    onWin = opts && opts.onWin;
    placed = {};
    callCool = false;
    callFan = false;
    callHeat = false;
    callRev = false;
    fault = "none";
    fusedBlown = false;
    meterFuse = false;
    ladderProof = false;
    mode = "vac";
    red = "r";
    black = "c24";
    labMode = opts && opts.defuse ? "defusal" : "build";
    if (labMode === "defusal") tsOn = false;
    meterSchool = !!(opts && opts.meter);
    meterGuideOn = meterSchool && !!(opts && opts.guide);
    meterGuideI = 0;
    dmmJackRed = meterGuideOn ? "none" : "v";
    dmmJackBlk = meterGuideOn ? "none" : "com";
    dmmLead = "red";
    guideOn = !!(opts && opts.guide) && labMode === "build" && !meterSchool;
    guideI = 0;
    view = "ladder";
    meteredOpen = false;
    ladderTap = null;
    isolated = false;
    fusePopped = false;
    satClocked = false;
    loadSatDone();
    tsOn = labMode === "build" && !guideOn && !meterSchool;
    sheetNote = tsOn ? TS_NOCOOL[0].say : "";
    tsI = 0;
    tsDone = {};
    job = null;
    satBay = null;
    tutOn = false;
    tutStep = 0;
    satI = 0;
    cutSet = {};
    timeLeft = 0;
    defused = false;
    boom = false;
    wonFired = false;
    probed = false;
    activeKit = "split";
    runs = [];
    spool = "hot";
    pending = null;
    zoomSlot = null;
    if (labMode === "build") loadKit("split");
    clearTimer();
    document.removeEventListener("keydown", onKeyZoom);
    document.addEventListener("keydown", onKeyZoom);
    build();
    wire();
    if (meterSchool) {
      openLeadZoom("disconnect");
      if (meterGuideOn) paintMeterGuide();
    }
    if (guideOn) {
      beginGuide();
      /* Land lugs card: skip the ladder intro and put them on the disconnect screws. */
      guideI = 3;
      setView("lugs");
      try { openZoom("disconnect"); } catch (_) {}
      paintGuide();
      ensureHubReachable();
    }
    return {
      stop() {
        clearTimer();
        closeZoom();
        hideLoupe();
        document.removeEventListener("keydown", onKeyZoom);
        window.removeEventListener("resize", onResizeChrome);
        if (resizeObs) {
          resizeObs.disconnect();
          resizeObs = null;
        }
      },
      getHubBtn() { return host.querySelector("#el-hub"); },
      startJob,
      cutWire,
      replacePart,
      landWire,
      landFactory,
      dropWireOnLug,
      getState() {
        return {
          labMode,
          job: job && job.id,
          timeLeft,
          defused,
          boom,
          fault,
          cutSet: Object.assign({}, cutSet),
          spool,
          zoomSlot,
          runs: runs.map((r) => ({ id: r.id, color: r.color, a: r.a, b: r.b })),
        };
      },
    };
  }

  global.ElectricalLab = { start, JOBS, KITS, PARTS, WIRE };
})(window);
