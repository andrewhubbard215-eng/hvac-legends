/* 90% natural-gas call. Twelve cards. Last card is a furnace that heats.
   Allstars may say Lincoln Tech. Legends must not. */
(function (global) {
  "use strict";

  var CARDS = [
    {
      file: "limitopen.js",
      title: "Limit open",
      scene: "limit",
      lines: ["Cold cabinet. Disc is bare.", "About 24 V across the limit.", "Igniter stays dark. About 0 V.", "Pressure switch is closed."],
      fix: "Lock the power out. Replace that limit.",
      choices: [
        ["Replace the limit", true, ""],
        ["Replace the pressure switch", false, "That switch is already closed. About 0 V is across it."],
        ["Replace the igniter", false, "About 0 V is at the igniter. The open limit never let the call through."],
      ],
    },
    {
      file: "ignopen.js",
      title: "Igniter open",
      scene: "igniter",
      lines: ["Limit is new and closed. About 0 V.", "About 120 V at the igniter.", "The element is broken open. It stays dark.", "Burners never light."],
      fix: "Lock the power out. Replace that igniter. Do not ohm it live.",
      choices: [
        ["Replace the igniter", true, ""],
        ["Replace the limit again", false, "The limit is already new and closed. The voltage is already at the igniter."],
        ["Replace the board", false, "The board already sent about 120 V. The element is open."],
      ],
    },
    {
      file: "valvestuck.js",
      title: "Valve seat stuck",
      scene: "valve",
      lines: ["Igniter is new and it glows.", "About 24 V stays across the coil.", "Inlet about 7. Manifold stays about 0.", "No gas at the burners."],
      fix: "Lock the power out and the gas. Replace that valve.",
      choices: [
        ["Replace the valve", true, ""],
        ["Replace the igniter again", false, "This igniter already glows. The coil pulls in. The seat will not pass gas."],
        ["Jumper the valve", false, "Do not jumper the valve. Do not drill the seat.", "a gas explosion"],
      ],
    },
    {
      file: "rodout.js",
      title: "Rod out of the flame",
      scene: "rod",
      lines: ["Valve is new. Manifold about 3.5.", "All five flames light, blue and seated.", "The rod is clean and standing out of the flame.", "Microamps stay about 0. Then the valve drops."],
      fix: "Shut the burners off. Put that rod back in the flame.",
      choices: [
        ["Put the rod back in the flame", true, ""],
        ["Replace the valve", false, "The valve already opens. The manifold is about 3.5."],
        ["Replace the rod", false, "The rod is clean. It is just not in the flame."],
      ],
    },
    {
      file: "crosspack.js",
      title: "Crossover packed",
      scene: "cross",
      lines: ["Rod is in burner 1. Microamps about 2.5.", "Burner 1 stays lit.", "Burners 2 through 5 stay dark.", "Crossover slots are packed with scale. Manifold about 3.5."],
      fix: "Shut the burners off. Clean those crossover slots. Do not drill them.",
      choices: [
        ["Clean the crossover slots", true, ""],
        ["Replace the valve", false, "The manifold is already about 3.5. Burner 1 is lit."],
        ["Move the rod", false, "The rod is already in the flame. The carryover cannot jump the packed slots."],
      ],
    },
    {
      file: "orifplug.js",
      title: "Orifice packed",
      scene: "orifice",
      lines: ["Crossover slots are open.", "Burners 1 and 2 are lit and blue.", "Burners 3, 4, and 5 stay dark.", "Orifice 3 is packed. A wire will not pass."],
      fix: "Shut the burners off. Clear that orifice, or replace it with the book size. Do not drill it.",
      choices: [
        ["Clear orifice 3", true, ""],
        ["Clean the crossover again", false, "The slots are already open. Burner 2 lit. The flame dies at burner 3."],
        ["Replace the valve", false, "The manifold is about 3.5. The seat is passing gas."],
      ],
    },
    {
      file: "shuttershut.js",
      title: "Shutters shut",
      scene: "shutter",
      lines: ["All five burners light and stay.", "Flames are yellow. Soot is on the faces.", "Air shutters are slammed shut.", "Manifold about 3.5. CO in the supply is zero."],
      fix: "Shut the burners off. Open the shutters until the flames are blue and seated.",
      choices: [
        ["Open the shutters", true, ""],
        ["Replace the orifices", false, "The orifices are already the book size and a wire passes them."],
        ["Condemn the heat exchanger", false, "CO in the supply is zero. The secondary is whole."],
      ],
    },
    {
      file: "manihigh.js",
      title: "Manifold high",
      scene: "mani",
      lines: ["Shutters are open. Flames are blue.", "They lift off the ports and roar.", "Manifold about 5.5. The book is about 3.5.", "Inlet about 7. The regulator is turned up."],
      fix: "Shut the burners off. Set the manifold back to about 3.5.",
      choices: [
        ["Set the manifold to about 3.5", true, ""],
        ["Close the shutters", false, "The shutters are already open. The flames are already blue. The pressure is the miss."],
        ["Replace the valve", false, "The seat passes gas. The inlet is already about 7. Turn the regulator back."],
      ],
    },
    {
      file: "noblower.js",
      title: "No blower",
      scene: "noblower",
      lines: ["Flames were blue and seated at about 3.5.", "The 24 V heat-speed tap is unplugged.", "Wheel is still. 120 V is already on the motor power plug.", "Rise about 95. Cabinet gets hot. Limit opens."],
      fix: "Lock the power out. Plug that 24 V heat-speed tap in.",
      choices: [
        ["Plug the heat-speed tap in", true, ""],
        ["Replace the blower motor", false, "120 V is already on the power plug. The motor never got the 24 V speed call."],
        ["Turn the regulator down", false, "The manifold is already about 3.5. The blower never started."],
      ],
    },
    {
      file: "heattap.js",
      title: "Heat on the low pin",
      scene: "tap",
      lines: ["The tap is on the low pin. The wheel turns slow.", "The 24 V heat call is on low. The high pin is empty.", "120 V is on the motor power plug. Blades are clean.", "Rise about 95. Limit still opens."],
      fix: "Lock the power out. Move the 24 V heat call to the high pin.",
      choices: [
        ["Move the heat call to the high pin", true, ""],
        ["Replace the blower motor", false, "The motor already turns and it already has 120 V power. The 24 V call is on the wrong pin."],
        ["Pull the plug off", false, "The tap is already on. It is on the low pin."],
      ],
    },
    {
      file: "ductoff.js",
      title: "Trunk off",
      scene: "duct",
      lines: ["Heat call is on the high pin. Wheel at heat speed.", "Rise about 55. Limit stays closed.", "Supply trunk is off the plenum.", "Air pours into the attic. Rooms stay cold."],
      fix: "Shut the burners off. Put the trunk back on and seal it.",
      choices: [
        ["Put the trunk back on and seal it", true, ""],
        ["Replace the blower motor", false, "The wheel is already turning at heat speed."],
        ["Add refrigerant", false, "The heat is going into the attic. This is not low charge."],
      ],
    },
    {
      file: "doorscrew.js",
      title: "Door screw missing",
      scene: "door",
      lines: ["Rooms are warm. Rise about 55. Limit stays closed.", "Flames stay seated and blue. Supply CO is zero.", "One burner-door screw hole is empty.", "CO in the vestibule is high."],
      fix: "Shut the burners off. Put that screw in, or replace the door if the hole is stripped. Do not tape the hole.",
      choices: [
        ["Put the screw in the empty hole", true, ""],
        ["Condemn the heat exchanger", false, "The supply is clean and the secondary is whole. The empty screw hole is the miss."],
        ["Tape the hole", false, "Do not leave the burners lit with CO in the vestibule. Do not tape the hole.", "carbon monoxide"],
      ],
    },
    {
      file: "heatrun.js",
      title: "Furnace working",
      scene: "run",
      lines: ["Trunk is on and sealed. The door screws are in.", "Flames blue and seated. Manifold about 3.5.", "Rise about 55. The book is about 40 to 70.", "Limit stays closed. Supply CO is zero. Vestibule CO is zero."],
      fix: "Stop. Do not sell a part. Do not keep taking it apart.",
      choices: [
        ["Stop. Do not sell a part", true, ""],
        ["Replace the limit", false, "The limit is closed. You read about 0 V across it."],
        ["Replace the blower motor", false, "It is already turning at heat speed. The rooms are warm."],
      ],
    },
  ];

  var ESTIMATE = {
    file: "estimate",
    title: "Written estimate",
    scene: "ticket",
    lines: ["One visit. Philadelphia. Not thirteen trips.", "Sell the limit, the igniter, and the valve.", "About $1,200 to $2,000. Midpoint about $1,500.", "The screw is on the ticket. The heat exchanger is not."],
    fix: "Write about $1,200 to $2,000. Put the screw in. Do not sell a heat exchanger or a blower.",
    choices: [
      ["Write $1,200 to $2,000", true, ""],
      ["Add a heat exchanger", false, "Supply CO is zero. That line is about $1,800 to $3,500 and it is the wrong fix."],
      ["Add a blower motor", false, "The blower already has about 120 V and it turns at heat speed."],
    ],
  };

  var TESTS = {
    limit: [["24 V", "Limit", "limit"], ["0 V", "Igniter", "igniter"], ["Closed", "Switch", "switch"], ["Cold", "Cabinet", "cabinet"]],
    igniter: [["0 V", "Limit", "limit"], ["120 V", "Igniter", "igniter"], ["Open", "Element", "element"], ["Dark", "Burners", "burner"]],
    valve: [["Glows", "Igniter", "igniter"], ["24 V", "Coil", "coil"], ["7 in.", "Inlet", "valve"], ["0 in.", "Manifold", "mani"]],
    rod: [["3.5", "Manifold", "mani"], ["Blue", "Burners", "burner"], ["0 µA", "Flame rod", "rod"], ["Drops", "Valve", "valve"]],
    cross: [["2.5 µA", "Rod", "rod"], ["Lit", "Burner 1", "burner"], ["Dark", "2–5", "burners"], ["3.5", "Manifold", "mani"]],
    orifice: [["Open", "Slots", "slots"], ["Lit", "1 and 2", "burner"], ["Dark", "3–5", "burners"], ["Packed", "Orifice 3", "orifice"]],
    shutter: [["Yellow", "Flames", "flame"], ["Shut", "Shutters", "shutter"], ["3.5", "Manifold", "mani"], ["0", "Supply CO", "co"]],
    mani: [["Blue", "Flames", "flame"], ["5.5", "Manifold", "mani"], ["3.5", "Book", "book"], ["7 in.", "Inlet", "valve"]],
    noblower: [["Open", "Speed tap", "tap"], ["120 V", "Motor", "motor"], ["Still", "Wheel", "wheel"], ["95°F", "Rise", "rise"]],
    tap: [["Low", "Speed tap", "tap"], ["120 V", "Motor", "motor"], ["Slow", "Wheel", "wheel"], ["95°F", "Rise", "rise"]],
    duct: [["High", "Speed tap", "tap"], ["55°F", "Rise", "rise"], ["Off", "Trunk", "duct"], ["Cold", "Rooms", "room"]],
    door: [["55°F", "Rise", "rise"], ["0", "Supply CO", "co"], ["Empty", "Door screw", "screw"], ["High", "Vestibule", "co"]],
    run: [["3.5", "Manifold", "mani"], ["55°F", "Rise", "rise"], ["Closed", "Limit", "limit"], ["0", "CO", "co"]],
    ticket: [["$1,500", "Ticket", "ticket"], ["3 parts", "Sold", "parts"], ["Screw", "Door", "screw"], ["Not this", "Exchanger", "hx"]],
  };

  function bit(kind) {
    var g = {
      limit: '<circle cx="18" cy="18" r="8" fill="none" stroke="#d7e0e8" stroke-width="1.6"/><path d="M12 24 L24 12" stroke="#CE0034" stroke-width="1.6"/>',
      igniter: '<path d="M8 26 H16 V14 H28" fill="none" stroke="#d7e0e8" stroke-width="1.6"/><path d="M28 14 H32" stroke="#CE0034" stroke-width="1.6" stroke-dasharray="2 2"/>',
      element: '<path d="M10 18 H22" stroke="#d7e0e8" stroke-width="1.6"/><path d="M24 18 H30" stroke="#CE0034" stroke-width="1.6" stroke-dasharray="2 2"/>',
      switch: '<rect x="8" y="14" width="20" height="8" rx="4" fill="none" stroke="#7dcea0"/>',
      cabinet: '<rect x="8" y="8" width="20" height="20" rx="2" fill="none" stroke="#d7e0e8"/>',
      coil: '<rect x="8" y="12" width="20" height="12" rx="2" fill="#1c2630" stroke="#d7e0e8"/>',
      valve: '<rect x="6" y="12" width="24" height="12" rx="2" fill="none" stroke="#d7e0e8"/>',
      mani: '<rect x="6" y="16" width="24" height="4" rx="1" fill="#d7e0e8"/>',
      rod: '<rect x="17" y="6" width="2" height="16" fill="#d7e0e8"/>',
      burner: '<path d="M12 26 C16 16 14 10 18 8 C22 10 20 16 24 26 Z" fill="#7eb6e8"/>',
      burners: '<path d="M6 26 C8 18 8 14 10 12 C12 14 12 18 14 26 Z" fill="#2a3340"/><path d="M16 26 C18 18 18 14 20 12 C22 14 22 18 24 26 Z" fill="#2a3340"/>',
      flame: '<path d="M12 26 C16 16 14 8 18 6 C22 8 20 16 24 26 Z" fill="#e2b04a"/>',
      slots: '<rect x="6" y="16" width="6" height="4" fill="#8a5a32"/><rect x="15" y="16" width="6" height="4" fill="#8a5a32"/><rect x="24" y="16" width="6" height="4" fill="#8a5a32"/>',
      orifice: '<circle cx="18" cy="18" r="6" fill="none" stroke="#e7a23a" stroke-width="1.6"/>',
      shutter: '<rect x="6" y="16" width="24" height="4" rx="1" fill="#2a3340" stroke="#d7e0e8"/>',
      book: '<rect x="10" y="8" width="16" height="20" rx="1" fill="none" stroke="#d7e0e8"/>',
      tap: '<rect x="8" y="10" width="20" height="7" rx="1" fill="#1c2630" stroke="#e2b04a"/><rect x="8" y="19" width="20" height="7" rx="1" fill="#1c2630" stroke="#3d4c5c"/>',
      motor: '<circle cx="18" cy="18" r="8" fill="none" stroke="#d7e0e8"/>',
      wheel: '<circle cx="18" cy="18" r="8" fill="none" stroke="#8b98a5" stroke-dasharray="3 2"/>',
      rise: '<path d="M10 24 L18 10 L26 24" fill="none" stroke="#e7a23a" stroke-width="1.6"/>',
      duct: '<rect x="6" y="12" width="10" height="12" fill="none" stroke="#d7e0e8"/><path d="M16 18 H24" stroke="#CE0034" stroke-dasharray="2 2"/><rect x="24" y="14" width="8" height="8" fill="none" stroke="#d7e0e8"/>',
      room: '<rect x="8" y="12" width="20" height="14" rx="1" fill="none" stroke="#8b98a5"/>',
      screw: '<circle cx="18" cy="18" r="5" fill="none" stroke="#CE0034"/><path d="M18 13 V23 M13 18 H23" stroke="#CE0034" stroke-width="1.2"/>',
      co: '<circle cx="18" cy="18" r="8" fill="none" stroke="#CE0034"/>',
      ticket: '<rect x="10" y="6" width="16" height="24" rx="1" fill="none" stroke="#d7e0e8"/>',
      parts: '<rect x="6" y="14" width="8" height="8" fill="none" stroke="#d7e0e8"/><rect x="16" y="14" width="8" height="8" fill="none" stroke="#d7e0e8"/>',
      hx: '<rect x="8" y="8" width="20" height="20" fill="none" stroke="#8a5a32"/>',
    };
    return g[kind] || g.cabinet;
  }

  function meter(read, name, kind) {
    return (
      '<svg class="c90-meter" viewBox="0 0 320 72" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<rect x="1" y="2" width="96" height="64" rx="7" fill="#1a1e24" stroke="#3a4450"/>' +
      '<rect x="8" y="8" width="82" height="24" rx="2" fill="#0c2418"/>' +
      '<text x="49" y="25" text-anchor="middle" fill="#b6f5c8" font-size="13" font-weight="700" font-family="IBM Plex Sans,sans-serif">' + esc(read) + "</text>" +
      '<text x="22" y="44" text-anchor="middle" fill="#c5ccd4" font-size="8" font-family="IBM Plex Sans,sans-serif">COM</text>' +
      '<text x="74" y="44" text-anchor="middle" fill="#CE0034" font-size="8" font-family="IBM Plex Sans,sans-serif">V</text>' +
      '<circle cx="22" cy="54" r="4.5" fill="#111" stroke="#c5ccd4" stroke-width="1.4"/>' +
      '<circle cx="74" cy="54" r="4.5" fill="#111" stroke="#CE0034" stroke-width="1.6"/>' +
      '<path d="M22 58 C28 68 130 68 214 38" fill="none" stroke="#c5ccd4" stroke-width="2.6"/>' +
      '<path d="M74 58 C90 66 160 62 258 32" fill="none" stroke="#CE0034" stroke-width="2.4"/>' +
      '<circle cx="214" cy="38" r="3.5" fill="#111" stroke="#c5ccd4"/>' +
      '<circle cx="258" cy="32" r="3.5" fill="#CE0034"/>' +
      '<g transform="translate(228,2)">' + bit(kind) + "</g>" +
      '<text x="246" y="66" text-anchor="middle" fill="#8b98a5" font-size="9" font-family="IBM Plex Sans,sans-serif">' + esc(name) + "</text>" +
      "</svg>"
    );
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&" + "amp;")
      .replace(/</g, "&" + "lt;")
      .replace(/>/g, "&" + "gt;")
      .replace(/"/g, "&" + "quot;");
  }

  function storeSku() {
    return !!(global.LtBrand && global.LtBrand.isStore);
  }

  function kicker(teach) {
    if (teach) return storeSku() ? "Training deck · 90% natural gas" : ((global.LtBrand && global.LtBrand.org) || "HVAC Legends") + " · training deck";
    return storeSku() ? "90% natural gas · two pipes · ECM" : ((global.LtBrand && global.LtBrand.org) || "HVAC Legends") + " · 90% natural gas · two pipes · ECM";
  }

  function svg(inner) {
    return (
      '<svg viewBox="0 0 640 200" width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<rect width="640" height="200" fill="#0e141a"/>' +
      inner +
      "</svg>"
    );
  }

  function plate() {
    return '<rect x="16" y="16" width="368" height="168" rx="8" fill="#141b22" stroke="#2c3844"/>';
  }

  function rail(rows) {
    var html = '<line x1="404" y1="28" x2="404" y2="172" stroke="#2c3844"/>';
    for (var i = 0; i < rows.length; i++) {
      var y = 48 + i * 56;
      html +=
        '<text x="424" y="' + y + '" fill="#8b98a5" font-size="11" letter-spacing="0.8" font-family="IBM Plex Sans,sans-serif">' + esc(rows[i][0]) + "</text>" +
        '<text x="424" y="' + (y + 24) + '" fill="#f2f6f8" font-size="20" font-weight="600" font-family="IBM Plex Sans,sans-serif">' + esc(rows[i][1]) + "</text>";
    }
    return html;
  }

  function flame(x, y, color, lift) {
    var top = y - 28 - (lift || 0);
    return (
      '<path d="M' + x + " " + (y + 6) + " C" + (x + 7) + " " + (y - 10) + " " + (x + 5) + " " + top + " " + (x + 12) + " " + top +
      " C" + (x + 19) + " " + top + " " + (x + 17) + " " + (y - 10) + " " + (x + 24) + " " + (y + 6) + ' Z" fill="' + color + '"/>'
    );
  }

  function burners(n, color, lift, x0) {
    var html = "";
    for (var i = 0; i < n; i++) html += flame((x0 || 48) + i * 36, 132, color, lift || 0);
    return html;
  }

  function cap(x, y, label) {
    return '<text x="' + x + '" y="' + y + '" fill="#8b98a5" font-size="12" font-family="IBM Plex Sans,sans-serif">' + esc(label) + "</text>";
  }

  function scene(id) {
    var base = plate();
    if (id === "limit") {
      return svg(base +
        '<circle cx="78" cy="78" r="22" fill="none" stroke="#d7e0e8" stroke-width="2"/>' +
        '<path d="M64 92 L92 64" stroke="#CE0034" stroke-width="2.5"/>' +
        cap(128, 72, "Limit") + cap(128, 92, "Open") +
        '<rect x="48" y="124" width="72" height="8" rx="2" fill="#2a3340"/>' +
        cap(128, 132, "Igniter dark") +
        rail([["ACROSS LIMIT", "24 V"], ["AT IGNITER", "0 V"]]));
    }
    if (id === "igniter") {
      return svg(base +
        '<path d="M48 140 H120 M84 140 V96 H150" fill="none" stroke="#d7e0e8" stroke-width="3"/>' +
        '<path d="M150 96 H186" fill="none" stroke="#CE0034" stroke-width="3" stroke-dasharray="5 4"/>' +
        cap(48, 64, "Element open") +
        rail([["AT IGNITER", "120 V"], ["ELEMENT", "Dark"]]));
    }
    if (id === "valve") {
      return svg(base +
        flame(56, 130, "#e7a23a", 0) +
        '<rect x="140" y="78" width="92" height="48" rx="4" fill="#1c2630" stroke="#d7e0e8"/>' +
        '<text x="186" y="106" text-anchor="middle" fill="#f2f6f8" font-size="14" font-family="IBM Plex Sans,sans-serif">24 V</text>' +
        cap(48, 64, "Coil pulled in") +
        rail([["INLET", "7 in. w.c."], ["MANIFOLD", "0 in. w.c."]]));
    }
    if (id === "rod") {
      return svg(base + burners(5, "#7eb6e8", 0, 40) +
        '<rect x="168" y="36" width="5" height="34" fill="#d7e0e8"/>' +
        cap(180, 52, "Rod out of flame") +
        rail([["FLAME SIGNAL", "0 µA"], ["THEN", "Valve drops"]]));
    }
    if (id === "cross") {
      return svg(base + flame(48, 128, "#7eb6e8", 0) +
        '<rect x="92" y="124" width="28" height="8" rx="1" fill="#8a5a32"/>' +
        '<rect x="132" y="124" width="28" height="8" rx="1" fill="#8a5a32"/>' +
        '<rect x="172" y="124" width="28" height="8" rx="1" fill="#8a5a32"/>' +
        '<rect x="212" y="124" width="28" height="8" rx="1" fill="#8a5a32"/>' +
        cap(48, 64, "Only burner 1") +
        rail([["MANIFOLD", "3.5 in. w.c."], ["CARRYOVER", "Packed"]]));
    }
    if (id === "orifice") {
      return svg(base + flame(48, 128, "#7eb6e8", 0) + flame(88, 128, "#7eb6e8", 0) +
        '<circle cx="150" cy="132" r="8" fill="none" stroke="#e7a23a" stroke-width="2"/>' +
        cap(168, 136, "Orifice 3 packed") +
        cap(48, 64, "Slots are open") +
        rail([["MANIFOLD", "3.5 in. w.c."], ["BURNERS 3–5", "Dark"]]));
    }
    if (id === "shutter") {
      return svg(base + burners(5, "#e2b04a", 0, 44) +
        '<rect x="44" y="142" width="180" height="6" rx="1" fill="#2a3340"/>' +
        cap(48, 64, "Shutters closed") +
        rail([["MANIFOLD", "3.5 in. w.c."], ["FLAME", "Yellow"]]));
    }
    if (id === "mani") {
      return svg(base + burners(5, "#7eb6e8", 18, 44) +
        cap(48, 64, "Flames lifting") +
        rail([["MANIFOLD", "5.5 in. w.c."], ["BOOK", "3.5 in. w.c."]]));
    }
    if (id === "noblower") {
      return svg(base +
        '<circle cx="92" cy="104" r="28" fill="none" stroke="#d7e0e8" stroke-width="2"/>' +
        cap(70, 108, "Still") +
        '<rect x="180" y="78" width="36" height="16" rx="2" fill="#1c2630" stroke="#d7e0e8"/>' +
        '<rect x="230" y="108" width="36" height="16" rx="2" fill="#1c2630" stroke="#CE0034"/>' +
        cap(180, 148, "Speed tap open") +
        rail([["MOTOR POWER", "120 V"], ["RISE", "95°F"]]));
    }
    if (id === "tap") {
      return svg(base +
        '<circle cx="86" cy="108" r="28" fill="none" stroke="#d7e0e8" stroke-width="2"/>' +
        cap(68, 112, "Slow") +
        '<rect x="170" y="70" width="64" height="22" rx="3" fill="#1c2630" stroke="#3d4c5c"/>' +
        '<text x="202" y="85" text-anchor="middle" fill="#8b98a5" font-size="11" font-family="IBM Plex Sans,sans-serif">HIGH</text>' +
        '<rect x="170" y="104" width="64" height="22" rx="3" fill="#2a2418" stroke="#e2b04a"/>' +
        '<text x="202" y="119" text-anchor="middle" fill="#f2f6f8" font-size="11" font-family="IBM Plex Sans,sans-serif">LOW</text>' +
        rail([["MOTOR POWER", "120 V"], ["RISE", "95°F"]]));
    }
    if (id === "duct") {
      return svg(base +
        '<rect x="40" y="70" width="88" height="64" rx="4" fill="#1c2630" stroke="#2c3844"/>' +
        cap(62, 106, "Plenum") +
        '<path d="M140 102 H210" stroke="#CE0034" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<rect x="220" y="78" width="110" height="32" rx="4" fill="#1c2630" stroke="#d7e0e8"/>' +
        '<text x="275" y="98" text-anchor="middle" fill="#f2f6f8" font-size="13" font-family="IBM Plex Sans,sans-serif">Trunk off</text>' +
        rail([["RISE", "55°F"], ["ROOMS", "Cold"]]));
    }
    if (id === "door") {
      return svg(base +
        '<rect x="48" y="40" width="200" height="100" rx="4" fill="#1c2630" stroke="#d7e0e8"/>' +
        '<circle cx="78" cy="64" r="5" fill="#d7e0e8"/>' +
        '<circle cx="214" cy="64" r="6" fill="none" stroke="#CE0034" stroke-width="2"/>' +
        '<circle cx="78" cy="116" r="5" fill="#d7e0e8"/>' +
        '<circle cx="214" cy="116" r="5" fill="#d7e0e8"/>' +
        cap(48, 164, "One hole empty") +
        rail([["VESTIBULE CO", "High"], ["SUPPLY CO", "Zero"]]));
    }
    if (id === "ticket") {
      return svg(
        '<rect x="150" y="20" width="340" height="160" rx="8" fill="#141b22" stroke="#2c3844"/>' +
        '<text x="320" y="52" text-anchor="middle" fill="#8b98a5" font-size="12" letter-spacing="1.2" font-family="IBM Plex Sans,sans-serif">ONE VISIT</text>' +
        '<text x="190" y="88" fill="#f2f6f8" font-size="16" font-family="IBM Plex Sans,sans-serif">Limit · igniter · valve</text>' +
        '<text x="190" y="114" fill="#8b98a5" font-size="14" font-family="IBM Plex Sans,sans-serif">Door screw included</text>' +
        '<text x="190" y="150" fill="#f2f6f8" font-size="20" font-weight="600" font-family="IBM Plex Sans,sans-serif">$1,200 – $2,000</text>'
      );
    }
    return svg(base + burners(5, "#7eb6e8", 0, 48) +
      '<rect x="250" y="48" width="52" height="20" rx="3" fill="#163226" stroke="#7dcea0"/>' +
      '<text x="276" y="62" text-anchor="middle" fill="#d5ecdf" font-size="11" font-family="IBM Plex Sans,sans-serif">ON</text>' +
      cap(48, 64, "Seated and blue") +
      rail([["RISE", "55°F"], ["MANIFOLD", "3.5 in. w.c."]]));
  }

  function deckOf(teach) {
    return teach ? CARDS.concat([ESTIMATE]) : CARDS;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var n = a.length - 1; n > 0; n--) {
      var j = Math.floor(Math.random() * (n + 1));
      var tmp = a[n];
      a[n] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function freshDeck(teach) {
    return deckOf(teach).map(function (card) {
      return Object.assign({}, card, { choices: shuffle(card.choices) });
    });
  }

  function soFar(deck, i, picked) {
    var bits = [];
    for (var n = 0; n < i; n++) {
      if (picked[n] && picked[n].ok) bits.push(deck[n].title);
    }
    if (!bits.length) return "";
    return '<p class="c90-sofar">Already on this furnace: ' + bits.map(esc).join(" · ") + "</p>";
  }

  function kept(deck, i, picked) {
    if (i < 1 || !(picked[i - 1] && picked[i - 1].ok)) return "";
    var prev = deck[i - 1];
    return '<figure class="c90-kept"><figcaption>Last step still on the furnace · ' + esc(prev.title) + "</figcaption>" + scene(prev.scene) + "</figure>";
  }

  function paint(root, i, picked, teach, hold, deck) {
    deck = deck || deckOf(teach);
    var card = deck[i];
    var choice = picked[i];
    var buttons = card.choices
      .map(function (ch, n) {
        var revealed = !!choice;
        var mark = "";
        if (revealed && ch[1]) mark = " is-ok";
        if (choice && choice.n === n && !ch[1]) mark = " is-bad";
        var tag = revealed && ch[1] ? '<span class="c90-tag">Correct</span>' : "";
        return (
          '<div class="c90-opt">' +
          '<button type="button" class="c90-choice' + mark + '" data-choice="' + n + '">' +
          '<span class="c90-key">' + "ABC".charAt(n) + "</span>" +
          "<span>" + esc(ch[0]) + "</span>" +
          tag +
          "</button>" +
          "</div>"
        );
      })
      .join("");
    var note = "";
    if (hold) note = hold;
    else if (choice && !choice.ok) note = card.choices[choice.n][2];
    else if (choice && choice.ok) note = card.fix;
    var tests = (TESTS[card.scene] || []).map(function (row, n) {
      return (
        '<li class="c90-probe">' +
        '<span class="c90-let">' + "ABCD".charAt(n) + "</span>" +
        meter(row[0], row[1], row[2]) +
        "</li>"
      );
    }).join("");
    var pct = Math.round(((i + 1) / deck.length) * 100);
    root.innerHTML =
      '<div class="c90">' +
      '<header class="c90-bar">' +
      '<button type="button" class="c90-back" data-act="back">Shop</button>' +
      "<div class=\"c90-id\"><p class=\"c90-kicker\">" + esc(kicker(teach)) + "</p>" +
      "<h1>" + esc(card.title) + "</h1></div>" +
      '<p class="c90-count">' + (i + 1) + "<span> / " + deck.length + "</span></p>" +
      "</header>" +
      '<div class="c90-progress" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
      soFar(deck, i, picked) +
      kept(deck, i, picked) +
      '<figure class="c90-scene"><figcaption>What you see</figcaption>' + scene(card.scene) + "</figure>" +
      '<section class="c90-panel"><h2>Test</h2><ul class="c90-probes">' + tests + "</ul></section>" +
      '<section class="c90-panel"><h2>Your call</h2><div class="c90-choices">' + buttons + "</div></section>" +
      '<p class="c90-note" role="status">' + esc(note) + "</p>" +
      '<footer class="c90-nav">' +
      '<button type="button" data-act="prev"' + (i === 0 ? " disabled" : "") + ">Previous</button>" +
      '<button type="button" class="c90-next" data-act="next">' +
      (i === deck.length - 1 ? (teach ? "End of deck" : "End of call") : "Next card") +
      "</button></footer></div>";
  }

  function ensureStyle() {
    if (document.getElementById("c90-style")) return;
    var style = document.createElement("style");
    style.id = "c90-style";
    var accent = storeSku() ? "#d4a24a" : "#CE0034";
    style.textContent =
      "#call90-root{min-height:100dvh;max-width:100%;background:#0b1014;color:#e8eef2;overflow-x:auto}" +
      ".c90{box-sizing:border-box;width:100%;max-width:min(720px,100%);margin:0 auto;padding:16px 16px 28px;display:flex;flex-direction:column;gap:12px;min-width:0;font-family:'IBM Plex Sans',sans-serif}" +
      ".c90 *{box-sizing:border-box}" +
      ".c90-bar,.c90-scene,.c90-kept,.c90-panel,.c90-probe,.c90-id{min-width:0;max-width:100%}" +
      ".c90-bar{display:flex;align-items:flex-start;gap:12px}" +
      ".c90-id{min-width:0;flex:1}" +
      ".c90-bar h1{margin:0;font-size:26px;line-height:1.15;font-weight:600;letter-spacing:-.02em}" +
      ".c90-kicker{margin:0 0 4px;color:#8b98a5;font-size:11px;letter-spacing:.08em;text-transform:uppercase}" +
      ".c90-count{margin:2px 0 0 auto;color:#e8eef2;font-size:18px;font-weight:600;white-space:nowrap}" +
      ".c90-count span{color:#8b98a5;font-weight:500;font-size:14px}" +
      ".c90-progress{height:3px;background:#24303a;border-radius:99px;overflow:hidden}" +
      ".c90-progress i{display:block;height:100%;background:" + accent + "}" +
      ".c90-sofar{margin:0;color:#c5ccd6;font-size:14px;line-height:1.4}" +
      ".c90-back,.c90-nav button,.c90-choice{min-height:44px;border-radius:8px;border:1px solid #2c3844;background:#141b22;color:#e8eef2;font:600 15px/1.3 'IBM Plex Sans',sans-serif;padding:8px 12px;cursor:pointer}" +
      ".c90-back{flex:0 0 auto}" +
      ".c90-scene,.c90-kept{margin:0;border-radius:12px;overflow:hidden;border:1px solid #2c3844;background:#10161c}" +
      ".c90-scene figcaption,.c90-kept figcaption{margin:0;padding:8px 12px;color:#8b98a5;font-size:11px;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #2c3844}" +
      ".c90-scene svg,.c90-kept svg,.c90-meter{display:block;width:100%;max-width:100%;height:auto;object-fit:contain;background:#10161c}" +
      ".c90-panel{border:1px solid #2c3844;border-radius:12px;background:#12181e;padding:12px 14px}" +
      ".c90-panel h2{margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8b98a5;font-weight:600}" +
      ".c90-probes{margin:0;padding:0;list-style:none;display:grid;gap:8px}" +
      ".c90-probe{display:grid;grid-template-columns:22px minmax(0,1fr);align-items:center;gap:8px;padding:4px 6px;border:1px solid #2c3844;border-radius:10px;background:#10161c;min-width:0;max-width:100%}" +
      ".c90-let{height:22px;border-radius:6px;background:#1c2630;color:#f2f6f8;font-size:12px;font-weight:700;display:grid;place-items:center}" +
      ".c90-meter{display:block}" +
      ".c90-choices{display:grid;gap:8px}" +
      ".c90-choice{display:flex;align-items:center;gap:10px;text-align:left;width:100%}" +
      ".c90-key{flex:0 0 22px;color:#8b98a5;font-size:12px;letter-spacing:.04em}" +
      ".c90-tag{margin-left:auto;color:" + accent + ";font-size:11px;letter-spacing:.06em;text-transform:uppercase}" +
      ".c90-choice.is-ok{border-color:" + accent + "}" +
      ".c90-choice.is-bad{border-color:#8a5a32}" +
      ".c90-why{margin:4px 0 0 32px;color:#8b98a5;font-size:13px;line-height:1.4}" +
      ".c90-note{min-height:20px;margin:0;padding:12px 14px;border-left:3px solid " + accent + ";background:#141b22;border-radius:0 8px 8px 0;font-size:15px;line-height:1.45}" +
      ".c90-note:empty{display:none}" +
      ".c90-nav{display:flex;gap:8px}" +
      ".c90-nav button{flex:1}" +
      ".c90-next{background:#1c2630}" +
      ".c90-nav button:disabled{opacity:.4;cursor:default}" +
      "body:has(#screen-call90.active) #walk-chip,body:has(#screen-call90.active) #drip-ear{display:none!important}" +
      "body:has(#screen-call90.active) #pf-coach-bar,body:has(#screen-call90.active) .pf-coach,body:has(#screen-call90.active) #pf-coach-open{display:none!important}" +
      "body:has(#screen-call90.active) #form-badge{top:8px!important;bottom:auto!important;right:8px!important;left:auto!important;z-index:40!important}" +
      "#screen-call90.screen.active{overflow:auto!important}" +
      ".c90-scene svg,.c90-scene .c90-meter{max-height:220px}" +
      "@media (max-width:800px){.c90{gap:8px;padding-bottom:84px}.c90-scene svg,.c90-scene .c90-meter{max-height:84px}.c90-kept svg{display:none}.c90-probe{padding:2px 4px}.c90-probe .c90-meter{height:44px;width:auto;max-width:100%}.c90-nav{position:fixed;left:0;right:0;bottom:0;z-index:40;background:#0b1014;padding:8px 12px calc(8px + env(safe-area-inset-bottom));box-shadow:0 -10px 24px rgba(0,0,0,.55)}.c90-next{box-shadow:0 0 0 2px #e8c450, 0 0 16px rgba(232,196,80,.85);background:#3a2e12;color:#fff8e6}}" +
      "#c90-trail{position:fixed;inset:0;z-index:80;background:#061206;display:flex;align-items:center;justify-content:center;padding:16px}" +
      "#c90-trail .trail{width:min(440px,100%);text-align:center;color:#b6f5a8;font-family:'Courier New',Courier,monospace}" +
      "#c90-trail h2{margin:8px 0 0;font-size:22px;letter-spacing:.12em;font-weight:700}" +
      "#c90-trail p{margin:8px 0 0;font-size:16px;line-height:1.4;color:#d8ffcf}" +
      "#c90-trail .trail-kicker{margin:0;font-size:12px;letter-spacing:.22em;color:#7dca6e}" +
      "#c90-trail svg{display:block;width:100%;height:auto;margin:0 auto;image-rendering:pixelated;background:#071407;border:4px solid #1d4a18}" +
      "#c90-trail button{margin-top:14px;min-height:44px;padding:8px 16px;border:2px solid #b6f5a8;background:#102810;color:#d8ffcf;font:700 14px/1 'Courier New',Courier,monospace;letter-spacing:.08em;cursor:pointer}";
    document.head.appendChild(style);
  }

  function trailArt(boom) {
    var puff = boom ? "#e8a030" : "#7dca6e";
    return (
      '<svg viewBox="0 0 320 180" role="img" aria-label="A cartoon tech has fallen beside a tombstone">' +
      '<rect width="320" height="180" fill="#071407"/>' +
      '<rect y="138" width="320" height="42" fill="#163018"/>' +
      '<rect x="36" y="46" width="36" height="14" fill="#c5cbb8"/>' +
      '<rect x="24" y="58" width="60" height="80" fill="#c5cbb8"/>' +
      '<rect x="40" y="74" width="28" height="6" fill="#071407"/>' +
      '<rect x="48" y="82" width="12" height="22" fill="#071407"/>' +
      '<rect x="118" y="96" width="22" height="18" fill="#f2e2b0"/>' +
      '<rect x="116" y="88" width="26" height="8" fill="#ce0034"/>' +
      '<rect x="120" y="102" width="6" height="6" fill="#071407"/>' +
      '<rect x="132" y="102" width="6" height="6" fill="#071407"/>' +
      '<rect x="140" y="104" width="70" height="22" fill="#2450a0"/>' +
      '<rect x="148" y="112" width="28" height="6" fill="#d8c070"/>' +
      '<rect x="206" y="108" width="28" height="8" fill="#2450a0"/>' +
      '<rect x="230" y="116" width="10" height="18" fill="#1a1a1a"/>' +
      '<rect x="168" y="92" width="36" height="6" fill="#c8c8c8"/>' +
      '<rect x="248" y="96" width="28" height="34" fill="#6a6a6a"/>' +
      '<rect x="254" y="78" width="16" height="18" fill="' + puff + '"/>' +
      '<rect x="246" y="70" width="10" height="10" fill="' + puff + '"/>' +
      "</svg>"
    );
  }

  function showTrail(cause, back) {
    if (!document.getElementById("c90-trail-style")) {
      var style = document.createElement("style");
      style.id = "c90-trail-style";
      style.textContent =
        "#c90-trail{position:fixed;inset:0;z-index:80;background:#061206;display:flex;align-items:center;justify-content:center;padding:16px}" +
        "#c90-trail .trail{width:min(440px,100%);text-align:center;color:#b6f5a8;font-family:'Courier New',Courier,monospace}" +
        "#c90-trail h2{margin:8px 0 0;font-size:22px;letter-spacing:.12em;font-weight:700}" +
        "#c90-trail p{margin:8px 0 0;font-size:16px;line-height:1.4;color:#d8ffcf}" +
        "#c90-trail .trail-kicker{margin:0;font-size:12px;letter-spacing:.22em;color:#7dca6e}" +
        "#c90-trail svg{display:block;width:100%;height:auto;margin:0 auto;image-rendering:pixelated;background:#071407;border:4px solid #1d4a18}" +
        "#c90-trail button{margin-top:14px;min-height:44px;padding:8px 16px;border:2px solid #b6f5a8;background:#102810;color:#d8ffcf;font:700 14px/1 'Courier New',Courier,monospace;letter-spacing:.08em;cursor:pointer}";
      document.head.appendChild(style);
    }
    var old = document.getElementById("c90-trail");
    if (old) old.remove();
    var boom = /explosion|gas|oxygen|ruptur/i.test(cause);
    var el = document.createElement("div");
    el.id = "c90-trail";
    el.innerHTML =
      '<div class="trail" role="dialog" aria-modal="true">' +
      '<p class="trail-kicker">HVAC TRAIL</p>' +
      trailArt(boom) +
      "<h2>YOU HAVE DIED OF</h2>" +
      "<p>" + esc(cause).toUpperCase() + ".</p>" +
      "<p>Here lies a tech. That call ends the trip.</p>" +
      '<button type="button" data-trail="ok">' + esc(back || "Back to the call") + "</button>" +
      "</div>";
    document.body.appendChild(el);
    var btn = el.querySelector("[data-trail]");
    if (btn) btn.onclick = function () { el.remove(); };
  }

  function mount(root, opts) {
    var teach = !!(opts && opts.teach);
    var deck = freshDeck(teach);
    var len = deck.length;
    var i = 0;
    var picked = {};
    var hold = "";
    ensureStyle();
    function coach() {
      if (!window.PlayFeel) return;
      var deckNow = deck;
      var card = deckNow[i];
      var choice = picked[i];
      var line = "";
      if (hold) line = hold;
      else if (!choice) line = "Next: one call that matches the meters.";
      else if (!choice.ok) line = card.choices[choice.n][2] || "That does not match the meters.";
      else if (i >= deck.length - 1) line = card.fix;
      else line = "Next card, and the picture stays until you do.";
      window.PlayFeel.coach(root, line);
    }
    function showFeedback() {
      var next = root.querySelector(".c90-next");
      if (next && next.scrollIntoView) next.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    function draw() {
      paint(root, i, picked, teach, hold, deck);
      coach();
      showFeedback();
    }
    root.onclick = function (e) {
      var t = e.target.closest("[data-act],[data-choice]");
      if (!t || !root.contains(t)) return;
      var act = t.getAttribute("data-act");
      if (act === "back") {
        if (opts.onHub) opts.onHub();
        return;
      }
      if (act === "prev" && i > 0) {
        hold = "";
        i -= 1;
        draw();
        return;
      }
      if (act === "next") {
        var cur = picked[i];
        if (!cur || !cur.ok) {
          var deckNow = deck;
          hold = !cur
            ? "Make the call on this card before the next one."
            : deckNow[i].choices[cur.n][2];
          if (window.PlayFeel) {
            window.PlayFeel.deny(t);
            window.PlayFeel.pop(t, "Not yet", "bad");
          }
          draw();
          return;
        }
        if (i >= len - 1) {
          if (opts && opts.onHub) opts.onHub();
          return;
        }
        hold = "";
        i += 1;
        draw();
        return;
      }
      var n = t.getAttribute("data-choice");
      if (n == null) return;
      n = Number(n);
      var ch = deck[i].choices[n];
      if (!ch) return;
      hold = "";
      picked[i] = { n: n, ok: !!ch[1] };
      if (window.PlayFeel) {
        if (ch[1]) window.PlayFeel.pop(t, "That's the call", "ok");
        else {
          window.PlayFeel.deny(t);
          window.PlayFeel.pop(t, "Not that", "bad");
        }
      }
      draw();
      if (ch[3]) showTrail(ch[3]);
    };
    draw();
    return {
      stop: function () {
        var trail = document.getElementById("c90-trail");
        if (trail) trail.remove();
        root.onclick = null;
        root.innerHTML = "";
      },
    };
  }

  global.Call90 = { start: mount };
  global.HvacTrail = { show: showTrail };
})(window);
