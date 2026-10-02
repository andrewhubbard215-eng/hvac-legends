/* Voltmeter class — Klein CL445 HVAC clamp (the one on the truck). */
(function (global) {
  "use strict";

  const BRAND = "HVAC Legends";

  const DIALS = [
    { id: "off", label: "OFF", tip: "CL445 asleep. Roll off OFF to wake it. Auto-off in 10 minutes on the real meter." },
    { id: "vac", label: "V~", tip: "AC volts · auto-range TRMS · 750 V. Houses, transformers, contactors. Leads in parallel." },
    { id: "vdc", label: "V⎓", tip: "DC volts · 600 V. Inverter boards, batteries. A 24 V transformer is AC — this dial lies." },
    { id: "ohm", label: "Ω )))", tip: "SEL cycles continuity → ohms → cap → diode. POWER OFF. Live Ω toasts the fuse." },
    { id: "ua", label: "µA", tip: "DC microamps · flame sensor. Leads in SERIES with the rod. Healthy ~1–10 µA." },
    { id: "aac", label: "A~", tip: "AC amps in the JAW · 600 A. Clamp ONE hot. Don't open the circuit. InRush for LRA." },
    { id: "temp", label: "°F", tip: "K-type thermocouple. Slide the jack cover to the temp ports. Suction / liquid line temp." },
  ];

  const STATIONS = [
    { id: "outlet", name: "Outlet", blurb: "Duplex 120 V. Hot / neutral / ground." },
    { id: "switch", name: "Switch", blurb: "Single-pole. Line in, load out, ground." },
    { id: "hvac240", name: "Disconnect", blurb: "240 V close-up. Leads for volts. Jaw for amps." },
    { id: "xfmr", name: "Transformer", blurb: "Secondary R and C. A healthy transformer is 24 to 28." },
    { id: "coil", name: "Contactor", blurb: "Coil screws. The call has to arrive here or it never pulls in." },
    { id: "flame", name: "Flame rod", blurb: "µA DC in series. Furnace proves flame." },
  ];

  const GUIDE = [
    { id: "jacks", title: "Plug the leads", say: "Drag BLACK onto COM. Drag RED onto VΩ. Same move as landing a lug. Amps go through the jaw — there is no 10 A hole.", station: "outlet", wait: "jacks" },
    { id: "dial", title: "Dial V~", say: "Tap V~ under the screen. House power and HVAC control are AC.", station: "outlet", wait: "dial:vac" },
    { id: "out-hn", title: "Hot to neutral", say: "Drag RED onto the hot slot. Drag BLACK onto the neutral slot. You want about 120.", station: "outlet", wait: "read:hot:neu:100" },
    { id: "out-hg", title: "Hot to ground", say: "Leave red on hot. Drag black onto the ground. Still about 120.", station: "outlet", wait: "read:hot:gnd:100" },
    { id: "out-ng", title: "Neutral to ground", say: "Drag red onto neutral and black onto ground. About 0. More than 5 volts is a bad neutral.", station: "outlet", wait: "read:neu:gnd:0" },
    { id: "sw-open", title: "Across an open switch", say: "Switch is OFF. Drag red onto LINE and black onto LOAD. About 120 — the open is dropping it.", station: "switch", wait: "read:line:load:100", needOff: true },
    { id: "sw-shut", title: "Closed switch reads about 0", say: "Flip the switch ON. Line to load falls to about 0.", station: "switch", wait: "read:line:load:0", needOn: true },
    { id: "l1l2", title: "Line to line", say: "Disconnect close-up. Drag RED onto L1 and BLACK onto L2. About 240.", station: "hvac240", wait: "read:l1:l2:200" },
    { id: "clamp", title: "Jaw on one hot", say: "Dial A~. Drag the JAW chip onto L1 only. Both hots in the jaw cancel.", station: "hvac240", wait: "clamp" },
    { id: "rc", title: "R to C", say: "Transformer close-up. Drag red onto R and black onto C. 24 to 28 is a healthy transformer.", station: "xfmr", wait: "read:r:c:20" },
    { id: "coil", title: "Across the coil", say: "Contactor close-up. Drag red onto COIL and black onto C. Call is on. About 24.", station: "coil", wait: "read:coil:c:20" },
    { id: "flame", title: "Flame sensor", say: "Dial µA. Drag red onto ROD and black onto MOD. Series, not across. A few microamps is healthy.", station: "flame", wait: "ua" },
    { id: "ohm", title: "Don't ohm live", say: "Kill power before Ω. Ohms on a live outlet buys you a fuse.", station: "outlet", wait: "ohm-lesson" },
    { id: "free", title: "You're on the CL445", say: "Flip stations. Practice NCV on the jaw, InRush on a motor, °F on a suction line. Ask HUB if you're stuck." },
  ];

  function VoltMeter(host, opts) {
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let guideOn = !(opts && opts.unguided);
    let gi = 0;
    let station = "outlet";
    let dial = "off";
    let jackRed = "";
    let jackBlk = "";
    let lead = "red";
    let redOn = null;
    let blkOn = null;
    let power = true;
    let swOn = false;
    let hpcOpen = false;
    let callY = true;
    let fused = false;
    let lastNote = "";
    let clampOn = null;
    let clampAlso = null;
    let inrush = false;
    let ncv = false;
    let flameOk = true;
    let ohmSel = "cont";
    let shellOn = false;
    let shellStation = "";

    function gStep() {
      return GUIDE[gi] || GUIDE[GUIDE.length - 1];
    }

    function jacksOkV() {
      return jackBlk === "com" && jackRed === "v";
    }

    function pair(a, b) {
      return (redOn === a && blkOn === b) || (redOn === b && blkOn === a);
    }

    function vac() {
      if (!redOn || !blkOn || redOn === blkOn) return 0;
      if (station === "outlet") {
        if (!power) return 0;
        if (pair("hot", "neu") || pair("hot", "gnd")) return 121.4;
        if (pair("neu", "gnd")) return 0.3;
        return 0;
      }
      if (station === "switch") {
        if (!power) return 0;
        if (pair("line", "gnd")) return 120.8;
        if (pair("load", "gnd")) return swOn ? 120.6 : 0.1;
        if (pair("line", "load")) return swOn ? 0.2 : 120.5;
        if (pair("line", "neu") || pair("load", "neu")) return swOn && pair("load", "neu") ? 120.4 : pair("line", "neu") ? 120.7 : 0.1;
        return 0;
      }
      if (station === "hvac240") {
        if (!power) return 0;
        if (pair("l1", "l2")) return 241.0;
        if (pair("l1", "gnd") || pair("l2", "gnd")) return 120.6;
        if (pair("t1", "t2")) return 241.0;
        if (pair("l1", "t1") || pair("l2", "t2")) return 0.2;
        return 0;
      }
      if (station === "xfmr" || station === "hvac24") {
        if (!power) return 0;
        if (pair("r", "c")) return 27.2;
        return 0;
      }
      if (station === "coil") {
        if (!power) return 0;
        if (pair("coil", "c")) return callY && !hpcOpen ? 27.2 : 0;
        return 0;
      }
      return 0;
    }

    function ohms() {
      if (power) return null;
      if (!redOn || !blkOn || redOn === blkOn) return Infinity;
      if (station === "outlet") {
        if (pair("neu", "gnd")) return 0.3;
        return Infinity;
      }
      if (station === "switch") {
        if (pair("line", "load")) return swOn ? 0.2 : Infinity;
        if (pair("line", "gnd") || pair("load", "gnd")) return Infinity;
        return Infinity;
      }
      if (station === "hvac240") {
        if (pair("l1", "t1") || pair("l2", "t2")) return 0.2;
        if (pair("l1", "l2")) return Infinity;
        return Infinity;
      }
      if (station === "coil" || station === "hvac24") {
        if (pair("coil", "c")) return 48;
        return Infinity;
      }
      return Infinity;
    }

    function read() {
      if (fused && dial !== "aac" && dial !== "temp" && dial !== "off") {
        return { val: "0.00", unit: "FUSE", note: "Fuse is toast. Volts, ohms, and µA share VΩµA. The jaw still reads amps — there is no 10 A hole." };
      }
      if (dial === "off") {
        if (ncv) {
          const live = power && station !== "flame";
          return { val: live ? "NCV" : "---", unit: live ? "LIVE" : "", note: live ? "Jaw NCV is screaming. That's voltage nearby — not a measurement. Confirm with leads." : "NCV quiet. Still prove dead with V~." };
        }
        return { val: "—.—", unit: "", note: "OFF. Roll to V~ . That's the Klein HVAC clamp — CL445." };
      }
      if (dial === "aac") {
        if (!power) return { val: "0.00", unit: "A", note: "No power, no amps. Jaw still clamps one hot when it's running." };
        if (clampAlso && ((clampOn === "l1" && clampAlso === "l2") || (clampOn === "l2" && clampAlso === "l1") || (clampOn === "t1" && clampAlso === "t2") || (clampOn === "t2" && clampAlso === "t1"))) {
          return { val: "0.0", unit: "A", note: "Both hots of a 240 V load are in the jaw. They cancel toward 0. Clamp one hot only." };
        }
        if (clampOn === "l1" || clampOn === "t1") {
          const a = inrush ? 62.0 : 13.4;
          return { val: a.toFixed(1), unit: inrush ? "A inrush" : "A", note: inrush ? "InRush · LRA. That's locked-rotor, not RLA. Don't size a breaker off this." : "Jaw on ONE hot. ~RLA for a 3-ton. Both legs in the jaw cancel to 0." };
        }
        if (clampOn === "l2" || clampOn === "t2") return { val: inrush ? "62.0" : "13.4", unit: inrush ? "A inrush" : "A", note: "Other hot. Same story. Never both." };
        if (clampOn) return { val: "0.00", unit: inrush ? "A inrush" : "A", note: "Jaw is on " + String(clampOn).toUpperCase() + ". No running load on that point. Clamp L1 on the disconnect for condenser amps." };
        return { val: "0.00", unit: inrush ? "A inrush" : "A", note: inrush ? "InRush armed. Drag the JAW onto L1 — one hot only." : "Dial is A~. Drag the JAW onto one hot. Do not unbolt the lug." };
      }
      if (dial === "temp") {
        const t = station === "xfmr" || station === "coil" || station === "hvac240" || station === "hvac24" ? 52.0 : 74.0;
        return { val: t.toFixed(1), unit: "°F", note: "K-type in the temp ports — leads come OUT of the jacks. Suction line ~52 on a running 410A is in the neighborhood." };
      }
      const paired = !!(redOn && blkOn && redOn !== blkOn);
      if (!paired && jackBlk !== "com") {
        return { val: "—.—", unit: "", note: "Black in COM. First jack, every time. CL445 only has COM and VΩµA." };
      }
      if (!paired && jackRed !== "v" && dial !== "aac" && dial !== "temp") {
        return { val: "—.—", unit: "", note: "Red in VΩµA. Volts, ohms, continuity, µA — same hole. Amps are the clamp." };
      }
      if (dial === "ua") {
        if (station !== "flame") return { val: "0.00", unit: "µA", note: "µA is the flame rod. Open the Flame rod station. Leads in SERIES." };
        if (!power) return { val: "0.00", unit: "µA", note: "Furnace has to be running to prove flame." };
        if (!pair("rod", "ch") && !pair("rod", "mod")) return { val: "0.00", unit: "µA", note: "Break the rod wire. Red to rod, black to module. Series — not across." };
        const ua = flameOk ? 3.8 : 0.2;
        return { val: ua.toFixed(1), unit: "µA DC", note: flameOk ? "Healthy flame sensor. Spec is usually >1 µA. Don't polish it with sandpaper — scotch-brite or replace." : "Weak. Dirty rod, cracked porcelain, or no flame. Don't jump it out." };
      }
      if (dial === "ohm" && power) {
        if (redOn && blkOn && redOn !== blkOn) {
          fused = true;
          whisper("vm.ohm-live", true);
          return { val: "0.00", unit: "FUSE", note: "You ohmed a live circuit. Kill the disconnect first. Replace the meter fuse." };
        }
        return { val: "OL", unit: "Ω", note: "Power is still on. Kill it before Ω — leads on a live circuit open the fuse." };
      }
      if (!redOn || !blkOn) {
        return { val: "—.—", unit: "", note: "Drag the RED lead onto a screw. Drag the BLACK lead onto the other." };
      }
      if (redOn === blkOn) {
        return { val: "0.00", unit: dial === "vac" ? "V~" : "", note: "Both leads on the same screw. That's a jumper, not a measurement." };
      }
      if (dial === "vac") {
        const v = vac();
        let note = "V~ TRMS. Meter is parallel — circuit stays together.";
        if (station === "outlet" && pair("hot", "neu") && v > 100) note = "Hot to neutral ~120. That's a fed outlet.";
        if (station === "outlet" && pair("neu", "gnd") && v < 2) note = "Neutral to ground ~0. Bonded at the panel. 5+ V is a problem.";
        if (station === "switch" && pair("line", "load") && v > 100) note = "Open switch. About 120 V across it. A closed contact drops about 0. Same rule as a 24 V safety — don't jump it.";
        if (station === "switch" && pair("line", "load") && v < 2) note = "Closed switch drops about 0 V. The load has the voltage now.";
        if (station === "hvac240" && v > 200) note = "Line to line ~240. One leg to ground is ~120 on split-phase.";
        if (station === "xfmr" && pair("r", "c") && v > 20) note = "R to C is 24–28. That's the transformer. The coil is the next device.";
        if (station === "coil" && hpcOpen) note = "Coil sees about 0. About 24 V is across the open high-pressure switch. A closed contact drops about 0. Don't jump a safety to make it run.";
        else if (station === "coil" && pair("coil", "c") && !callY) note = "No Y call. The coil sees 0. That's not an open safety until Y is calling.";
        else if (station === "coil" && pair("coil", "c") && v > 20) note = "About 24 V is across the coil. If it doesn't pull in, the winding is open — the call already arrived.";
        return { val: v.toFixed(1), unit: "V~", note: note };
      }
      if (dial === "vdc") {
        const v = vac();
        return { val: v > 15 ? "0.2" : "0.0", unit: "V⎓", note: v > 15 ? "That's AC. Dial V~. V⎓ is boards and batteries." : "No DC here." };
      }
      if (dial === "ohm") {
        if (ohmSel === "cap") return { val: "OL", unit: "µF", note: "SEL is on capacitance. No capacitor on this station — OL, not a made-up µF." };
        if (ohmSel === "diode") return { val: "OL", unit: "V", note: "SEL is on diode. No junction on this station." };
        const r = ohms();
        if (ohmSel === "cont") {
          if (r == null) return { val: "OL", unit: "", note: "Kill power before continuity." };
          const closed = isFinite(r) && r < 5;
          return { val: closed ? "BEEP" : "OL", unit: closed ? ")))" : "", note: closed ? "SEL = continuity. Path is closed." : "Open. Hit SEL for ohms if you need a number." };
        }
        if (r == null) return { val: "OL", unit: "Ω", note: "Kill power." };
        if (!isFinite(r)) return { val: "OL", unit: "Ω", note: "Open. Switch off, fuse open, or a dead winding." };
        if ((station === "coil" || station === "hvac24") && pair("coil", "c")) {
          whisper("ohms.coil");
          return { val: r.toFixed(1), unit: "Ω", note: "Contactor coil ~48 Ω. Near 0 is shorted — that 40 VA will smoke." };
        }
        return { val: r.toFixed(1), unit: "Ω", note: r < 1 ? "Closed / bonded." : "Resistance of that path." };
      }
      return { val: "—.—", unit: "", note: "" };
    }

    function whisper(id, force) {
      if (global.LtDrip) global.LtDrip.say(id, force);
    }

    function stepMet(s) {
      if (!guideOn || !s || !s.wait) return false;
      if (s.wait === "jacks") return jacksOkV();
      if (s.wait.indexOf("dial:") === 0) return dial === s.wait.split(":")[1];
      if (s.wait.indexOf("read:") === 0) {
        if (dial !== "vac" || fused) return false;
        const p = s.wait.split(":");
        const want = Number(p[3]);
        if (!pair(p[1], p[2])) return false;
        if (s.needOn && !swOn) return false;
        if (s.needOff && swOn) return false;
        const v = vac();
        if (want === 0) return v < 3;
        return v >= want;
      }
      if (s.wait === "ohm-lesson") return fused || (dial === "ohm" && !power);
      if (s.wait === "clamp") return dial === "aac" && !clampAlso && (clampOn === "l1" || clampOn === "t1");
      if (s.wait === "ua") return dial === "ua" && power && (pair("rod", "mod") || pair("rod", "ch"));
      return false;
    }

    function applyStation() {
      const s = gStep();
      if (!s) return;
      if (s.station && s.station !== station) {
        station = s.station;
        redOn = null;
        blkOn = null;
        clampOn = null;
        clampAlso = null;
      }
      if (s.needOff) swOn = false;
      if (s.wait && s.wait.indexOf("read:") === 0 && dial !== "vac" && !fused) dial = "vac";
    }

    function setDial(id) {
      dial = id;
      if (id === "vac") whisper("elec.kvl");
      paint();
    }

    function plug(jack) {
      if (jack === "com") jackBlk = "com";
      else jackRed = jack;
      paint();
    }

    function land(term, how) {
      if (!term) return;
      if (how === "jaw") {
        const mate = { l1: "l2", l2: "l1", t1: "t2", t2: "t1" };
        if (clampOn && !clampAlso && mate[clampOn] === term) clampAlso = term;
        else {
          clampOn = term;
          clampAlso = null;
        }
        dial = "aac";
        paint();
        return;
      }
      if (dial === "off") dial = "vac";
      if (lead === "red") {
        redOn = term;
        if (!jackRed) jackRed = "v";
      } else {
        blkOn = term;
        jackBlk = "com";
      }
      paint();
    }

    function terms() {
      if (station === "outlet") {
        return [
          { id: "hot", x: 38, y: 42, name: "HOT", sub: "small slot · brass" },
          { id: "neu", x: 62, y: 42, name: "NEU", sub: "tall slot · silver" },
          { id: "gnd", x: 50, y: 68, name: "GND", sub: "U-ground · green" },
        ];
      }
      if (station === "switch") {
        return [
          { id: "line", x: 28, y: 38, name: "LINE", sub: "feed in · brass" },
          { id: "load", x: 72, y: 38, name: "LOAD", sub: "to the light" },
          { id: "gnd", x: 50, y: 72, name: "GND", sub: "green screw" },
          { id: "neu", x: 50, y: 24, name: "NEU", sub: "not on the switch — in the box" },
        ];
      }
      if (station === "hvac240") {
        return [
          { id: "l1", x: 22, y: 28, name: "L1", sub: "LINE" },
          { id: "l2", x: 78, y: 28, name: "L2", sub: "LINE" },
          { id: "t1", x: 22, y: 58, name: "T1", sub: "LOAD" },
          { id: "t2", x: 78, y: 58, name: "T2", sub: "LOAD" },
          { id: "gnd", x: 50, y: 76, name: "GND", sub: "LUG" },
        ];
      }
      if (station === "xfmr" || station === "hvac24") {
        return [
          { id: "r", x: 22, y: 74, name: "R", sub: "SEC" },
          { id: "c", x: 78, y: 74, name: "C", sub: "SEC" },
        ];
      }
      if (station === "coil") {
        return [
          { id: "coil", x: 36, y: 50, name: "COIL", sub: "A1" },
          { id: "c", x: 64, y: 50, name: "C", sub: "A2" },
        ];
      }
      return [
        { id: "rod", x: 32, y: 40, name: "ROD", sub: "flame sensor · series" },
        { id: "mod", x: 68, y: 40, name: "MOD", sub: "control module" },
        { id: "ch", x: 50, y: 68, name: "CHAS", sub: "burner chassis" },
      ];
    }

    function deviceSvg() {
      const ts = terms();
      const dots = ts
        .map(function (t) {
          const onR = redOn === t.id;
          const onB = blkOn === t.id;
          const fill = onR ? "#CE0034" : onB ? "#1a1a1a" : "#e8c450";
          return (
            '<g class="vm-term" data-term="' +
            t.id +
            '" style="cursor:pointer">' +
            '<circle cx="' +
            t.x +
            '" cy="' +
            t.y +
            '" r="7" fill="' +
            fill +
            '" stroke="#f4efe6" stroke-width="1.5"/>' +
            '<text x="' +
            t.x +
            '" y="' +
            (t.y - 11) +
            '" text-anchor="middle" fill="#f4efe6" font-size="7" font-weight="700">' +
            t.name +
            "</text></g>"
          );
        })
        .join("");
      let art = "";
      if (station === "outlet") {
        art =
          '<rect x="28" y="22" width="44" height="58" rx="6" fill="#f4efe6" stroke="#2a3238"/>' +
          '<rect x="34" y="32" width="6" height="18" rx="1" fill="#1a1a1a"/>' +
          '<rect x="60" y="30" width="6" height="22" rx="1" fill="#cbb892"/>' +
          '<path d="M44 62 h12 v6 a6 6 0 0 1 -12 0 z" fill="#1b8f4a"/>';
      } else if (station === "switch") {
        art =
          '<rect x="30" y="20" width="40" height="62" rx="6" fill="#f4efe6" stroke="#2a3238"/>' +
          '<rect x="42" y="28" width="16" height="28" rx="3" fill="#1c2126"/>' +
          '<rect x="' +
          (swOn ? 46 : 42) +
          '" y="' +
          (swOn ? 30 : 40) +
          '" width="8" height="14" rx="2" fill="#e8c450"/>';
      } else if (station === "hvac240") {
        art =
          '<rect x="12" y="18" width="76" height="64" rx="4" fill="#1c2126" stroke="#e8c450"/>' +
          '<text x="50" y="80" text-anchor="middle" fill="#8b98a5" font-size="7">DISCONNECT</text>';
      } else if (station === "flame") {
        art =
          '<rect x="18" y="20" width="64" height="56" rx="4" fill="#3a2a22" stroke="#e8c450"/>' +
          '<circle cx="50" cy="42" r="8" fill="#ffb347"/>' +
          '<text x="50" y="80" text-anchor="middle" fill="#8b98a5" font-size="7">GAS BURNER</text>';
      } else {
        art =
          '<rect x="8" y="16" width="84" height="70" rx="4" fill="#1c2126" stroke="#CE0034"/>' +
          '<text x="50" y="84" text-anchor="middle" fill="#8b98a5" font-size="7">CONTROL BOARD</text>';
      }
      return '<svg class="vm-svg" viewBox="0 0 100 90">' + art + dots + "</svg>";
    }

    function screwHtml() {
      return terms().map(function (t) {
        const onR = redOn === t.id;
        const onB = blkOn === t.id;
        const cls = "el-zoom-screw el-lead-point" + (onR && onB ? " land-both" : onR ? " land-red" : onB ? " land-blk" : "");
        const sub = String(t.sub || "").split("·")[0];
        return '<button type="button" class="' + cls + '" data-term="' + t.id + '" style="left:' + t.x + "%;top:" + t.y + '%"><b>' + t.name + "</b><small>" + sub + "</small></button>";
      }).join("");
    }

    function leadPaths() {
      const ts = terms();
      function path(id, color) {
        const p = ts.find(function (t) { return t.id === id; });
        if (!p) return "";
        const x0 = color === "red" ? 16 : 84;
        const stroke = color === "red" ? "#c0392b" : "#1a1a1a";
        const d = "M " + x0 + " 0 C " + x0 + " " + (p.y * 0.4).toFixed(1) + ", " + p.x + " " + (p.y * 0.55).toFixed(1) + ", " + p.x + " " + p.y;
        return '<path d="' + d + '" fill="none" stroke="#f7f3ea" stroke-width="7" stroke-linecap="round"/>' +
          '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="3.6" stroke-linecap="round"/>';
      }
      return path(redOn, "red") + path(blkOn, "blk");
    }

    function stageArt() {
      if (station === "hvac240") return '<img alt="" src="parts/disconnect.png" />';
      if (station === "xfmr" || station === "hvac24") return '<img alt="" src="parts/transformer.png" />';
      if (station === "coil") return '<img alt="" src="parts/contactor.png" />';
      if (station === "outlet") return '<div class="vm-plate vm-fill"><div class="vm-outlet"><i class="hot"></i><i class="neu"></i><i class="gnd"></i></div></div>';
      if (station === "switch") return '<div class="vm-plate vm-fill"><div class="vm-switch"><div class="rocker"><b></b></div></div></div>';
      return '<div class="vm-plate vm-fill"><div class="vm-flame">FLAME</div></div>';
    }

    function nextStep() {
      return GUIDE[gi + 1] || null;
    }

    function nextLeaves() {
      const n = nextStep();
      return !!(n && n.station && n.station !== station);
    }

    function paint() {
      if (!shellOn) buildShell();
      if (shellStation !== station) mountStage();
      syncFace();
      // Same-station follow-up can move the coach while the number stays on the meter.
      // A station change waits so the reading they just made stays up until Next.
      if (guideOn && stepMet(gStep()) && gi < GUIDE.length - 1 && !nextLeaves()) {
        gi += 1;
        applyStation();
        if (onXp) onXp(8);
        if (shellStation !== station) mountStage();
        syncFace();
      }
    }

    function buildShell() {
      shellOn = true;
      shellStation = "";
      host.innerHTML =
        '<div class="vm-school">' +
        "<style>" +
        "#voltmeter-root{height:100%}" +
        "#voltmeter-root .vm-school{height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;padding:8px;box-sizing:border-box}" +
        "#voltmeter-root .vm-top{flex:0 0 auto}" +
        "#voltmeter-root .vm-card{flex:1 1 auto;min-height:0;overflow:auto;width:min(720px,100%);max-height:none}" +
        "#voltmeter-root .vm-coach{padding:8px;margin-bottom:6px;max-height:96px;overflow:auto}" +
        "#voltmeter-root .vm-coach img{width:36px;height:36px}" +
        "#voltmeter-root .vm-coach p{margin:2px 0 0;font-size:13px}" +
        "#voltmeter-root .vm-meter-sticky{position:sticky;top:0;z-index:6;background:#f7f3ea;padding-bottom:4px}" +
        "#voltmeter-root .el-zoom-work{height:180px !important;margin:4px 0}" +
        "#voltmeter-root .el-lead-lcd{font-size:28px;padding:4px 10px}" +
        "#voltmeter-root .el-zoom-spools{padding:0 0 4px;background:#f7f3ea}" +
        "#voltmeter-root #vm-desc,.vm-card>.eyebrow{display:none}" +
        "#voltmeter-root #vm-stations{flex-wrap:nowrap;overflow-x:auto}" +
        "@media (min-width:1000px) and (min-height:700px){#voltmeter-root .el-zoom-work{height:220px !important}#voltmeter-root .vm-coach{max-height:none}#voltmeter-root #vm-desc{display:block}}" +
        "</style>" +
        '<header class="vm-top">' +
        '<button type="button" class="el-meter-pick" id="vm-hub">Shop floor</button>' +
        "<h2>Multimeter <span style=\"font-size:12px;font-weight:700;color:#e8c450\">" +
        BRAND +
        "</span></h2>" +
        '<button type="button" class="el-meter-pick" id="vm-mode">Practice</button>' +
        "</header>" +
        '<div class="el-zoom-card vm-card">' +
        '<div class="vm-coach" id="vm-coach"><img src="hub-portrait.jpg?v=3" alt="Professor HUB" /><div>' +
        '<p class="eyebrow" id="vm-step">HUB</p><strong id="vm-title"></strong><p id="vm-say"></p>' +
        "</div></div>" +
        '<button type="button" class="el-meter-pick" id="vm-skip">I\'m stuck — next</button>' +
        '<div class="vm-meter-sticky">' +
        '<div class="el-spools el-zoom-spools" id="vm-spools">' +
        '<button type="button" class="el-spool red" data-leadhand="red" id="vm-lead-red"><i></i><span><b>RED</b> test lead</span></button>' +
        '<button type="button" class="el-spool blk" data-leadhand="blk" id="vm-lead-blk"><i></i><span><b>BLACK</b> COM lead</span></button>' +
        '<button type="button" class="el-spool" data-leadhand="jaw" id="vm-jaw"><i></i><span><b>JAW</b> clamp one hot</span></button>' +
        "</div>" +
        '<div class="el-lead-lcd"><span id="vm-val">—.—</span><small id="vm-unit"></small></div>' +
        '<div class="el-lead-dials" id="vm-dials">' +
        DIALS.map(function (d) {
          return '<button type="button" data-dial="' + d.id + '">' + d.label + "</button>";
        }).join("") +
        "</div>" +
        '<div class="el-lead-jacks">' +
        '<button type="button" class="el-lead-jack" data-jack="com" id="vm-jack-com">COM</button>' +
        '<button type="button" class="el-lead-jack" data-jack="v" id="vm-jack-v">VΩµA</button>' +
        '<button type="button" class="el-meter-pick" id="vm-sel">SEL</button>' +
        '<button type="button" class="el-meter-pick" id="vm-inrush">InRush</button>' +
        '<button type="button" class="el-meter-pick" id="vm-ncv">NCV</button>' +
        "</div>" +
        '<p class="el-lead-note" id="vm-note"></p>' +
        '<button type="button" class="el-meter-pick" id="vm-fuse" hidden>Replace meter fuse</button>' +
        '<div class="el-meter-picks" id="vm-toggles">' +
        '<label class="el-meter-pick"><input type="checkbox" id="vm-power"/> Power</label>' +
        '<label class="el-meter-pick" id="vm-sw-lab"><input type="checkbox" id="vm-sw"/> Switch ON</label>' +
        '<label class="el-meter-pick" id="vm-y-lab"><input type="checkbox" id="vm-y"/> Y call</label>' +
        '<label class="el-meter-pick" id="vm-hpc-lab"><input type="checkbox" id="vm-hpc"/> HPC open</label>' +
        '<label class="el-meter-pick" id="vm-flame-lab"><input type="checkbox" id="vm-flame"/> Flame proven</label>' +
        "</div></div>" +
        '<p class="eyebrow">Drag a lead onto a point</p>' +
        '<strong id="vm-name"></strong>' +
        '<p id="vm-desc"></p>' +
        '<div id="vm-stage"></div>' +
        '<div class="el-meter-picks" id="vm-stations">' +
        STATIONS.map(function (x) {
          return '<button type="button" class="el-meter-pick" data-st="' + x.id + '">' + x.name + "</button>";
        }).join("") +
        "</div>" +
        '<p class="el-lead-note" id="vm-tip"></p>' +
        "</div></div>";
      bindShell();
    }

    function mountStage() {
      shellStation = station;
      const stage = host.querySelector("#vm-stage");
      if (!stage) return;
      stage.innerHTML =
        '<div class="el-zoom-stage"><div class="el-zoom-work">' + stageArt() +
        '<svg id="vm-paths" class="el-zoom-svg" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>' +
        '<div class="el-zoom-screws" id="vm-screws">' + screwHtml() + "</div></div></div>";
      bindStage();
    }

    function syncFace() {
      const r = read();
      lastNote = r.note;
      const s = gStep();
      const last = gi >= GUIDE.length - 1;
      const st = STATIONS.find(function (x) { return x.id === station; }) || STATIONS[0];
      const coach = host.querySelector("#vm-coach");
      if (coach) coach.hidden = !guideOn;
      const stepEl = host.querySelector("#vm-step");
      if (stepEl) stepEl.textContent = BRAND + " · " + (gi + 1) + "/" + GUIDE.length;
      const title = host.querySelector("#vm-title");
      if (title) title.textContent = s.title;
      const say = host.querySelector("#vm-say");
      if (say) {
        let extra = "";
        if (guideOn && s.station && s.station !== station) {
          const need = STATIONS.find(function (x) { return x.id === s.station; });
          extra = " This step is on " + (need ? need.name : s.station) + ".";
        }
        if (guideOn && s.needOn && !swOn) extra += " Flip Switch ON.";
        if (guideOn && s.needOff && swOn) extra += " Switch stays OFF.";
        if (guideOn && stepMet(s) && nextLeaves()) extra += " That's the reading. Tap Next.";
        say.textContent = s.say + extra;
      }
      const skip = host.querySelector("#vm-skip");
      if (skip) {
        skip.hidden = !guideOn;
        const ready = guideOn && stepMet(s) && !last;
        skip.textContent = last ? "Practice on your own" : ready ? "Next" : "I'm stuck — next";
      }
      const modeBtn = host.querySelector("#vm-mode");
      if (modeBtn) modeBtn.textContent = guideOn ? "Practice" : "Walk me through";
      const name = host.querySelector("#vm-name");
      if (name) name.textContent = st.name;
      const desc = host.querySelector("#vm-desc");
      if (desc) desc.textContent = st.blurb + " Drag RED and BLACK onto the points — or tap a lead, then tap the point.";
      const val = host.querySelector("#vm-val");
      if (val) val.textContent = r.val;
      const unit = host.querySelector("#vm-unit");
      if (unit) unit.textContent = r.unit;
      const note = host.querySelector("#vm-note");
      if (note) {
        const live = power && station !== "flame";
        note.textContent = ncv && dial !== "off" ? (live ? "NCV LIVE. " : "NCV quiet. ") + r.note : r.note;
      }
      const tip = host.querySelector("#vm-tip");
      const dialInfo = DIALS.find(function (d) { return d.id === dial; }) || DIALS[0];
      if (tip) tip.textContent = dialInfo.tip;
      host.querySelectorAll("[data-dial]").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-dial") === dial);
      });
      host.querySelectorAll("[data-st]").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-st") === station);
      });
      const com = host.querySelector("#vm-jack-com");
      const vj = host.querySelector("#vm-jack-v");
      if (com) com.classList.toggle("in", jackBlk === "com");
      if (vj) vj.classList.toggle("in", jackRed === "v");
      const sel = host.querySelector("#vm-sel");
      if (sel) sel.textContent = "SEL · " + (dial === "ohm" ? ohmSel : "Ω");
      const ir = host.querySelector("#vm-inrush");
      if (ir) ir.classList.toggle("on", inrush);
      const nv = host.querySelector("#vm-ncv");
      if (nv) nv.classList.toggle("on", ncv);
      const fuseBtn = host.querySelector("#vm-fuse");
      if (fuseBtn) fuseBtn.hidden = !fused;
      const pwr = host.querySelector("#vm-power");
      if (pwr) pwr.checked = power;
      const swLab = host.querySelector("#vm-sw-lab");
      const yLab = host.querySelector("#vm-y-lab");
      const hLab = host.querySelector("#vm-hpc-lab");
      const fLab = host.querySelector("#vm-flame-lab");
      if (swLab) swLab.hidden = station !== "switch";
      if (yLab) yLab.hidden = station !== "coil";
      if (hLab) hLab.hidden = station !== "coil";
      if (fLab) fLab.hidden = station !== "flame";
      const sw = host.querySelector("#vm-sw");
      if (sw) sw.checked = swOn;
      const y = host.querySelector("#vm-y");
      if (y) y.checked = callY;
      const h = host.querySelector("#vm-hpc");
      if (h) h.checked = hpcOpen;
      const fl = host.querySelector("#vm-flame");
      if (fl) fl.checked = flameOk;
      host.querySelectorAll("[data-leadhand]").forEach(function (b) {
        const id = b.getAttribute("data-leadhand");
        b.classList.toggle("active", (id === "red" && lead === "red") || (id === "blk" && lead === "blk") || (id === "jaw" && dial === "aac"));
      });
      host.querySelectorAll("[data-term]").forEach(function (g) {
        const id = g.getAttribute("data-term");
        const onR = redOn === id;
        const onB = blkOn === id;
        g.classList.toggle("land-red", onR && !onB);
        g.classList.toggle("land-blk", onB && !onR);
        g.classList.toggle("land-both", onR && onB);
      });
      const paths = host.querySelector("#vm-paths");
      if (paths) paths.innerHTML = leadPaths();
      const rocker = host.querySelector(".vm-switch .rocker b");
      if (rocker) rocker.style.top = swOn ? "18%" : "52%";
    }

    function bindLeads() {
      const lr = host.querySelector("#vm-lead-red");
      const lb = host.querySelector("#vm-lead-blk");
      if (lr) lr.onclick = function () { lead = "red"; paint(); };
      if (lb) lb.onclick = function () { lead = "blk"; paint(); };
      const jaw = host.querySelector("#vm-jaw");
      if (jaw) {
        let jawDragged = false;
        jaw.addEventListener("pointerdown", function (e) {
          jawDragged = false;
          const x0 = e.clientX;
          const y0 = e.clientY;
          function move(ev) {
            if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) jawDragged = true;
          }
          function up() {
            window.removeEventListener("pointermove", move, true);
            window.removeEventListener("pointerup", up, true);
          }
          window.addEventListener("pointermove", move, true);
          window.addEventListener("pointerup", up, true);
        });
        jaw.onclick = function () {
          /* A drag ends in a click. Don't wipe the second hot the drop just clamped. */
          if (jawDragged) { jawDragged = false; return; }
          dial = "aac";
          clampAlso = null;
          const hot = terms().find(function (t) {
            return t.id === "l1" || t.id === "t1" || t.id === "hot" || t.id === "line";
          });
          if (hot) {
            clampOn = hot.id;
            paint();
          } else paint();
        };
      }
      if (!window.LtDrag) return;
      host.querySelectorAll("[data-leadhand]").forEach(function (b) {
        window.LtDrag.bindSource(b, {
          id: b.getAttribute("data-leadhand"),
          allowButtons: true,
          ghostClass: "el-wire-ghost",
          html: "<b>" + (b.getAttribute("data-leadhand") === "blk" ? "BLACK" : b.getAttribute("data-leadhand") === "jaw" ? "JAW" : "RED") + "</b>",
          dropSelector: ".el-lead-point, .el-lead-jack",
          onDrop: function (_k, id, dropEl) {
            try {
              if (!dropEl || typeof dropEl.closest !== "function") return;
              const jack = dropEl.closest("[data-jack]");
              if (jack && id !== "jaw") {
                lead = id === "blk" ? "blk" : "red";
                plug(jack.getAttribute("data-jack"));
                return;
              }
              const pt = dropEl.closest("[data-term]");
              if (!pt) return;
              const term = pt.getAttribute("data-term");
              if (!term) return;
              if (id === "jaw") land(term, "jaw");
              else {
                lead = id === "blk" ? "blk" : "red";
                land(term);
              }
            } catch (err) {}
          },
        });
      });
    }

    function bindShell() {
      const hub = host.querySelector("#vm-hub");
      if (hub) hub.onclick = function () { if (onHub) onHub(); };
      const modeBtn = host.querySelector("#vm-mode");
      if (modeBtn) modeBtn.onclick = function () { guideOn = !guideOn; paint(); };
      const skip = host.querySelector("#vm-skip");
      if (skip) skip.onclick = function () {
        if (!guideOn) return;
        if (gi >= GUIDE.length - 1) {
          guideOn = false;
          paint();
          return;
        }
        gi += 1;
        applyStation();
        paint();
      };
      host.querySelectorAll("[data-st]").forEach(function (b) {
        b.onclick = function () {
          station = b.getAttribute("data-st");
          redOn = null;
          blkOn = null;
          clampOn = null;
          clampAlso = null;
          paint();
        };
      });
      host.querySelectorAll("[data-dial]").forEach(function (b) {
        b.onclick = function () { setDial(b.getAttribute("data-dial")); };
      });
      host.querySelectorAll("[data-jack]").forEach(function (b) {
        b.onclick = function () { plug(b.getAttribute("data-jack")); };
      });
      const pwr = host.querySelector("#vm-power");
      if (pwr) pwr.onchange = function () { power = pwr.checked; paint(); };
      const sw = host.querySelector("#vm-sw");
      if (sw) sw.onchange = function () { swOn = sw.checked; paint(); };
      const y = host.querySelector("#vm-y");
      if (y) y.onchange = function () { callY = y.checked; paint(); };
      const h = host.querySelector("#vm-hpc");
      if (h) h.onchange = function () { hpcOpen = h.checked; paint(); };
      const fl = host.querySelector("#vm-flame");
      if (fl) fl.onchange = function () { flameOk = fl.checked; paint(); };
      const fuseBtn = host.querySelector("#vm-fuse");
      if (fuseBtn) fuseBtn.onclick = function () { fused = false; jackRed = "v"; dial = dial === "ohm" ? "vac" : dial; paint(); };
      const sel = host.querySelector("#vm-sel");
      if (sel) sel.onclick = function () {
        if (dial !== "ohm") dial = "ohm";
        else ohmSel = ohmSel === "cont" ? "ohm" : ohmSel === "ohm" ? "cap" : ohmSel === "cap" ? "diode" : "cont";
        paint();
      };
      const ir = host.querySelector("#vm-inrush");
      if (ir) ir.onclick = function () {
        inrush = !inrush;
        if (inrush) dial = "aac";
        paint();
      };
      const nv = host.querySelector("#vm-ncv");
      if (nv) nv.onclick = function () { ncv = !ncv; paint(); };
      bindLeads();
    }

    function bindStage() {
      host.querySelectorAll("[data-term]").forEach(function (g) {
        g.onclick = function (e) {
          e.preventDefault();
          land(g.getAttribute("data-term"));
        };
      });
    }

    applyStation();
    paint();
    whisper("vm.class");
    return {
      stop: function () {},
    };
  }

  global.VoltMeter = {
    start: function (host, opts) {
      return VoltMeter(host, opts || {});
    },
  };
})(window);
