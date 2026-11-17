/* Voltmeter class — Klein CL445 HVAC clamp (the one on the truck). */
(function (global) {
  "use strict";
  function landTurn(screenId) {
    try {
      if (sessionStorage.getItem("land-upright-off")) return;
    } catch (e) {}
    var cssId = "land-css-" + screenId;
    if (!document.getElementById(cssId)) {
      var st = document.createElement("style");
      st.id = cssId;
      st.textContent = ".land-turn{display:none}@media (orientation:landscape) and (max-height:500px){body.land-on:has(#" + screenId + ".active) .land-turn{display:flex;position:fixed;z-index:220;inset:0;align-items:center;justify-content:center;padding:8px;background:rgba(8,10,12,.55);color:#f6f0e2;box-sizing:border-box}body.land-on:has(#" + screenId + ".active) .land-card{display:flex;flex-direction:column;align-items:center;gap:4px;width:min(200px,52vw);padding:8px 10px;background:#1c2126;border:1px solid #e8c450;border-radius:12px;text-align:center}body.land-on:has(#" + screenId + ".active) .land-phone{width:22px;height:36px;border:2px solid #e8c450;border-radius:6px;position:relative}body.land-on:has(#" + screenId + ".active) .land-phone:before{content:\"\";position:absolute;left:50%;bottom:3px;width:10px;height:2px;margin-left:-5px;background:#e8c450;border-radius:2px}body.land-on:has(#" + screenId + ".active) .land-turn strong{font:700 15px/1.2 system-ui,sans-serif;color:#fff}body.land-on:has(#" + screenId + ".active) .land-turn span{font:600 12px/1.3 system-ui,sans-serif;color:#d7d0c4;max-width:180px}body.land-on:has(#" + screenId + ".active) .land-turn button{min-height:32px;margin-top:2px;padding:0 10px;background:transparent;color:#f6f0e2;border:1px solid #6d5b3c;border-radius:8px;cursor:pointer;font:600 13px system-ui,sans-serif}}";
      document.head.appendChild(st);
    }
    document.body.classList.add("land-on");
    if (!document.getElementById("land-turn")) {
      var bar = document.createElement("div");
      bar.className = "land-turn";
      bar.id = "land-turn";
      bar.innerHTML = "<div class=\"land-card\"><div class=\"land-phone\" aria-hidden=\"true\"></div><strong>Turn the phone upright</strong><span>Rotate it. This card goes away on its own.</span><button type=\"button\" id=\"land-dismiss-btn\">Stay sideways</button></div>";
      document.body.appendChild(bar);
      document.getElementById("land-dismiss-btn").addEventListener("click", function () {
        try { sessionStorage.setItem("land-upright-off", "1"); } catch (e2) {}
        document.body.classList.remove("land-on");
        bar.remove();
      });
    }
  }
  function floorFit(id, css) {
    let st = document.getElementById(id);
    if (!st) {
      st = document.createElement("style");
      st.id = id;
      document.head.appendChild(st);
    }
    st.textContent = css;
    document.head.appendChild(st);
    function bump() { if (st.parentNode) document.head.appendChild(st); }
    requestAnimationFrame(bump);
    setTimeout(bump, 80);
    setTimeout(bump, 400);
  }

  const BRAND = (global.LtBrand && global.LtBrand.org) || "HVAC Legends";

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

  const MEG_DIALS = [
    { id: "off", label: "OFF", tip: "Megger asleep. Lock the disconnect out before you wake it." },
    { id: "m500", label: "500 V", tip: "Insulation test. Black on the shell. Red on one terminal. Good is OL or hundreds of megohms." },
    { id: "m1000", label: "1000 V", tip: "Same test, higher voltage. Still terminal to shell. Never winding to winding." },
    { id: "ohm", label: "Ω", tip: "Winding test. C to R, C to S, R to S. R to S should equal the other two added." },
  ];

  const MEG_STATIONS = [
    { id: "comp", name: "Compressor", blurb: "Scroll. C, R, S, and the shell. Meg each terminal to the shell. Ohm the windings after." },
    { id: "fan", name: "Fan motor", blurb: "Condenser fan. Two leads and the shell. Same megger test." },
    { id: "blower", name: "Blower", blurb: "Indoor blower. Two leads and the shell." },
  ];

  const MEG_GUIDE = [
    { id: "dead", title: "Lock it out", say: "Power off. A megger on a live compressor bites you and the board.", station: "comp", wait: "dead" },
    { id: "v500", title: "500 volts", say: "Tap 500 V. That is insulation, not the winding.", station: "comp", wait: "dial:m500" },
    { id: "csh", title: "Common to shell", say: "Drag BLACK onto SHELL. Drag RED onto C. Good insulation reads OL.", station: "comp", wait: "meg:c:shell:high" },
    { id: "rsh", title: "Run to shell", say: "Move RED onto R. Same rule. Low megohms means that winding is grounded.", station: "comp", wait: "meg:r:shell:high" },
    { id: "ssh", title: "Start to shell", say: "Move RED onto S.", station: "comp", wait: "meg:s:shell:high" },
    { id: "wind", title: "Ohm the windings", say: "Tap Ω. C to R is a few ohms. That is not the megger.", station: "comp", wait: "wind:c:r" },
    { id: "fan", title: "Fan to the shell", say: "Open the fan motor. Power stays off. 500 V. One lead to the shell.", station: "fan", wait: "meg:l1:shell:high" },
    { id: "free", title: "Find the bad one", say: "Unguided is a motor with a ground or an open winding. The ohmmeter can miss a soft ground. The megger will not." },
  ];

  function VoltMeter(host, opts) {
    floorFit("vm-floor-fit", [
      "@media (max-width:820px){",
      "html body:has(#screen-voltmeter.active) #drip-ear.drip-ear{position:fixed!important;top:96px!important;left:8px!important;right:8px!important;bottom:auto!important;width:auto!important;max-width:none!important;max-height:56px!important;overflow:hidden!important;z-index:30!important;align-items:center!important;padding:4px 8px!important}",
      "html body:has(#screen-voltmeter.active) #drip-ear img{width:32px!important;height:32px!important;flex:0 0 32px!important}",
      "html body:has(#screen-voltmeter.active) #drip-ear p{display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;margin:0!important;font-size:12px!important;line-height:1.25!important;color:#f7f3ea!important}",
      "#voltmeter-root .vm-split{margin-top:58px!important}",
      "body:has(#screen-voltmeter.active) .ld-replay{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important;z-index:40!important}",
      "body:has(#screen-voltmeter.active) #toast-host{top:46px!important;right:8px!important;left:auto!important;width:min(140px,42vw)!important}",
      "}",
      "@media (min-width:821px){",
      "body:has(#screen-voltmeter.active) #drip-ear{left:8px!important;bottom:8px!important;top:auto!important;right:auto!important;width:min(240px,28vw)!important;max-height:56px!important;overflow:auto!important}",
      "#voltmeter-root .vm-meter{padding-bottom:64px!important;box-sizing:border-box}",
      "}",
      "@media (orientation:landscape) and (max-height:500px){",
      "body:has(#screen-voltmeter.active) #drip-ear{display:none!important}",
      "body:has(#screen-voltmeter.active) .ld-replay{top:4px!important;right:8px!important;bottom:auto!important;left:auto!important;max-width:112px!important}",
      "body:has(#screen-voltmeter.active) #toast-host{top:4px!important;left:8px!important;right:auto!important;bottom:auto!important;width:min(140px,28vw)!important;max-height:28px!important}",
      "#voltmeter-root .vm-meter{padding-bottom:0!important}",
      "}",
    ].join(""));
    landTurn("screen-voltmeter");
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let guideOn = !(opts && opts.unguided);
    let coachShut = window.innerWidth < 720;
    let tool = opts && opts.meg ? "meg" : "dmm";
    let megFault = "good";
    let gi = 0;
    let station = tool === "meg" ? "comp" : "outlet";
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
    let zeusSent = false;
    let checkOn = false;
    let check240 = false;
    let check24 = false;
    let checkFail = false;
    let checkPassed = false;

    if (tool === "meg" && !guideOn) megFault = "ground_r";

    function steps() {
      return tool === "meg" ? MEG_GUIDE : GUIDE;
    }
    function stations() {
      return tool === "meg" ? MEG_STATIONS : STATIONS;
    }
    function dials() {
      return tool === "meg" ? MEG_DIALS : DIALS;
    }

    function gStep() {
      const list = steps();
      return list[gi] || list[list.length - 1];
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

    function insulationMeg() {
      if (power || !redOn || !blkOn) return null;
      const shell = redOn === "shell" || blkOn === "shell";
      if (!shell) return 0;
      /* Windings are a few ohms, so one short to the shell looks like ~0 from every terminal. */
      if (station === "comp" && megFault === "ground_r") return 0;
      if (station === "fan" && megFault === "fan_ground") return 0;
      if (station === "comp" || station === "fan" || station === "blower") return 480;
      return null;
    }

    function windingOhms() {
      if (power) return null;
      if (station === "comp") {
        if (pair("c", "r")) return 1.4;
        if (pair("c", "s")) return megFault === "open_s" ? Infinity : 3.1;
        if (pair("r", "s")) return megFault === "open_s" ? Infinity : 4.5;
        return Infinity;
      }
      if (station === "fan" || station === "blower") {
        if (pair("l1", "l2")) return station === "blower" ? 8.6 : 18.4;
        return Infinity;
      }
      return null;
    }

    function megRead() {
      if (dial === "off") return { val: " ", unit: "", note: "Megger is off. Lock out, then tap 500 V." };
      if (power) return { val: "LIVE", unit: "", note: "Power is still on. Lock out before you meg." };
      if (!redOn || !blkOn || redOn === blkOn) {
        return { val: " ", unit: dial === "ohm" ? "Ω" : "MΩ", note: "Drag BLACK and RED onto the points. Shell for insulation. Two terminals for windings." };
      }
      if (dial === "ohm") {
        const r = windingOhms();
        if (redOn === "shell" || blkOn === "shell") {
          return { val: "OL", unit: "Ω", note: "The ohmmeter says OL to the shell. A soft ground hides here. Switch to 500 V." };
        }
        if (r == null || !isFinite(r)) return { val: "OL", unit: "Ω", note: "Open winding. That pair is not a complete circuit." };
        const note = station === "comp" && pair("r", "s")
          ? "R to S should be about C–R plus C–S."
          : "Winding resistance. A few ohms is a motor. OL is an open winding.";
        return { val: r.toFixed(1), unit: "Ω", note: note };
      }
      if (dial === "m500" || dial === "m1000") {
        const shell = redOn === "shell" || blkOn === "shell";
        if (!shell) return { val: "0.0", unit: "MΩ", note: "A good winding looks like a short on the megger. Meg each terminal to the shell. A real short to the shell reads about 0." };
        const v = insulationMeg();
        if (v == null) return { val: " ", unit: "MΩ", note: "Black on the shell. Red on one terminal." };
        if (v >= 100) return { val: String(Math.round(v)), unit: "MΩ", note: "Good winding to ground. Open — hundreds of megohms. Check the other terminals." };
        if (v < 0.05) return { val: "0.00", unit: "MΩ", note: "Short to ground. About 0 megohms. That winding comes out." };
        return { val: v.toFixed(2), unit: "MΩ", note: "Low. That winding is leaking to the shell. The motor comes out." };
      }
      return { val: " ", unit: "", note: "" };
    }

    function read() {
      if (tool === "meg") return megRead();
      if (fused && dial !== "aac" && dial !== "temp" && dial !== "off") {
        return { val: "0.00", unit: "FUSE", note: "Fuse open." };
      }
      if (dial === "off") {
        if (ncv) {
          const live = power && station !== "flame";
          return { val: live ? "NCV" : "---", unit: live ? "LIVE" : "", note: live ? "Jaw NCV is screaming. That's voltage nearby — not a measurement. Confirm with leads." : "NCV quiet. Still prove dead with V~." };
        }
        return { val: " ", unit: "", note: "OFF. Roll to V~ . That's the Klein HVAC clamp — CL445." };
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
        return { val: " ", unit: "", note: "Black in COM. First jack, every time. CL445 only has COM and VΩµA." };
      }
      if (!paired && jackRed !== "v" && dial !== "aac" && dial !== "temp") {
        return { val: " ", unit: "", note: "Red in VΩµA. Volts, ohms, continuity, µA — same hole. Amps are the clamp." };
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
          if (checkOn) {
            checkFail = true;
            checkPassed = false;
            check240 = false;
            check24 = false;
          }
          whisper("vm.ohm-live", true);
          return { val: "0.00", unit: "FUSE", note: "Fuse open." };
        }
        return { val: "OL", unit: "Ω", note: "Power is on." };
      }
      if (!redOn || !blkOn) {
        return { val: " ", unit: "", note: "Drag the RED lead onto a screw. Drag the BLACK lead onto the other." };
      }
      if (redOn === blkOn) {
        return { val: "0.00", unit: dial === "vac" ? "V~" : "", note: "Both leads on the same screw. That's a jumper, not a measurement." };
      }
      if (checkOn && dial !== "aac" && dial !== "temp" && dial !== "off") {
        if (jackBlk !== "com") return { val: " ", unit: "", note: "Black in COM." };
        if (jackRed !== "v") return { val: " ", unit: "", note: "Red in VΩ." };
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
      return { val: " ", unit: "", note: "" };
    }

    function whisper(id, force) {
      if (global.LtDrip) global.LtDrip.say(id, force);
    }

    function stepMet(s) {
      if (!guideOn || !s || !s.wait) return false;
      if (s.wait === "dead") return !power;
      if (s.wait.indexOf("meg:") === 0) {
        const p = s.wait.split(":");
        if (dial !== "m500" && dial !== "m1000") return false;
        if (power || redOn !== p[1] || blkOn !== p[2]) return false;
        const v = insulationMeg();
        if (p[3] === "high") return v != null && v >= 20;
        return v != null && v < 2;
      }
      if (s.wait.indexOf("wind:") === 0) {
        const p = s.wait.split(":");
        if (dial !== "ohm" || power || redOn !== p[1] || blkOn !== p[2]) return false;
        const r = windingOhms();
        return r != null && isFinite(r) && r < 80;
      }
      if (s.wait === "jacks") return jacksOkV();
      if (s.wait.indexOf("dial:") === 0) return dial === s.wait.split(":")[1];
      if (s.wait.indexOf("read:") === 0) {
        if (dial !== "vac" || fused) return false;
        const p = s.wait.split(":");
        const want = Number(p[3]);
        if (redOn !== p[1] || blkOn !== p[2]) return false;
        if (s.needOn && !swOn) return false;
        if (s.needOff && swOn) return false;
        const v = vac();
        if (want === 0) return v < 3;
        return v >= want;
      }
      if (s.wait === "ohm-lesson") return !fused && dial === "ohm" && !power;
      if (s.wait === "clamp") return dial === "aac" && !clampAlso && (clampOn === "l1" || clampOn === "t1");
      if (s.wait === "ua") return dial === "ua" && power && redOn === "rod" && (blkOn === "mod" || blkOn === "ch");
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
      if (tool !== "meg" && id === "ohm" && power) {
        feel(host.querySelector('[data-dial="ohm"]'), "Power is on.", "bad");
      }
    }

    function plug(jack, fromLead) {
      const who = fromLead || "";
      if (who === "red" && jack === "com") {
        feel(host.querySelector("#vm-jack-com"), "Reversed leads. Red goes in VΩ. Black goes in COM.", "bad");
        return;
      }
      if (who === "blk" && jack !== "com") {
        feel(host.querySelector("#vm-jack-v"), "Reversed leads. Black goes in COM. Red goes in VΩ.", "bad");
        return;
      }
      if (jack === "com") jackBlk = "com";
      else jackRed = jack;
      paint();
      feel(host.querySelector(jack === "com" ? "#vm-jack-com" : "#vm-jack-v"), jack === "com" ? "Black in COM" : "Red in VΩ", "ok");
    }

    function pointPhrase(id) {
      if (id === "shell") return "the shell";
      const t = terms().find(function (x) { return x.id === id; });
      if (t && t.name) return t.name;
      const names = {
        hot: "HOT", neu: "NEU", gnd: "GND", line: "LINE", load: "LOAD",
        l1: "L1", l2: "L2", t1: "T1", t2: "T2", r: "R", c: "C", s: "S",
        coil: "COIL", rod: "ROD", mod: "MOD", ch: "CHAS",
      };
      return names[id] || String(id || "").toUpperCase();
    }

    function leadCue(redId, blkId, altBlk) {
      const blkOk = blkOn === blkId || (altBlk && blkOn === altBlk);
      if (redOn !== redId) return "Put red on " + pointPhrase(redId) + ".";
      if (!blkOk) return "Put black on " + pointPhrase(blkId) + ".";
      return "Read it. Red is on " + pointPhrase(redId) + ".";
    }

    function megCue() {
      if (power) return "Turn Power off.";
      if (dial === "off" || (dial !== "m500" && dial !== "m1000" && dial !== "ohm")) return "Dial 500 V.";
      if (dial === "ohm") {
        if (station === "comp") return leadCue("c", "r");
        return leadCue("l1", "l2");
      }
      if (blkOn !== "shell") return "Put black on the shell.";
      if (!redOn || redOn === "shell") return "Put red on " + pointPhrase(station === "comp" ? "c" : "l1") + ".";
      const v = insulationMeg();
      if (v != null && v < 1) return "Short to ground. About 0 megohms. That motor comes out.";
      const order = station === "comp" ? ["c", "r", "s"] : ["l1", "l2"];
      const idx = order.indexOf(redOn);
      const nxt = order[(idx + 1) % order.length];
      if (v != null && v >= 100 && idx === order.length - 1) return "Shell is open. Dial Ω. OL on a winding is an open motor.";
      return "Move red to " + pointPhrase(nxt) + ". Black stays on the shell.";
    }

    function coachLine() {
      if (!guideOn || (gStep() && gStep().id === "free")) {
        if (tool === "meg") return megCue();
        if (jackBlk !== "com") return "Put black in COM.";
        if (jackRed !== "v" && dial !== "aac" && dial !== "temp") return "Put red in VΩ.";
        if (dial === "ohm" && power) return "Kill the disconnect.";
        if (dial === "aac") return "Put the jaw on L1. One hot only.";
        if (station === "flame" || dial === "ua") return leadCue("rod", "mod");
        if (station === "outlet") return leadCue("hot", "neu");
        if (station === "switch") return leadCue("line", "load");
        if (station === "hvac240") return leadCue("l1", "l2");
        if (station === "xfmr" || station === "hvac24") return leadCue("r", "c");
        if (station === "coil") return leadCue("coil", "c");
        return "Put red on one point.";
      }
      const s = gStep();
      if (!s) return "";
      const w = s.wait || "";
      if (w === "jacks") {
        if (jackBlk !== "com") return "Put black in COM.";
        return "Put red in VΩ.";
      }
      if (w === "dial:vac" || w === "dial:m500" || w === "dial:m1000") {
        if (w === "dial:m500" || w === "dial:m1000") return dial === "m500" || dial === "m1000" ? "Put black on the shell." : "Dial 500 V.";
        return dial === "vac" ? "Put red on HOT." : "Dial V~.";
      }
      if (w.indexOf("dial:") === 0) return "Dial the meter.";
      if (w.indexOf("meg:") === 0) {
        const p = w.split(":");
        if (blkOn !== p[2]) return "Put black on " + pointPhrase(p[2]) + ".";
        if (redOn !== p[1]) return "Put red on " + pointPhrase(p[1]) + ".";
        return "Read it. Black is on the shell.";
      }
      if (w.indexOf("read:") === 0 || w.indexOf("wind:") === 0) {
        const p = w.split(":");
        return leadCue(p[1], p[2]);
      }
      if (w === "clamp") return dial === "aac" ? "Put the jaw on L1. One hot only." : "Dial A~.";
      if (w === "ua") return dial === "ua" ? leadCue("rod", "mod") : "Dial µA.";
      if (w === "dead") return power ? "Turn Power off." : "Dial 500 V.";
      if (w === "ohm-lesson") {
        if (power) return "Kill the disconnect.";
        if (dial !== "ohm") return "Dial Ω.";
        return "Power is off. Leave the dial on Ω.";
      }
      if (tool === "meg") return megCue();
      return "Put red on one point.";
    }

    function stepTarget() {
      if (!guideOn) return null;
      const s = gStep();
      if (!s || s.id === "free") return null;
      const w = s.wait || "";
      if (w.indexOf("read:") === 0 || w.indexOf("meg:") === 0 || w.indexOf("wind:") === 0) {
        const p = w.split(":");
        return { red: p[1], black: p[2] };
      }
      if (w === "ua") return { red: "rod", black: "mod", alt: "ch" };
      if (w === "clamp") return { jaw: true };
      return { none: true, wait: w };
    }

    function explainLand(term, how) {
      if (tool !== "meg" && dial === "ohm" && power && how !== "jaw") {
        const other = lead === "red" ? blkOn : redOn;
        if (other && other !== term) return { kind: "bad", text: "Failed." };
        return { kind: "bad", text: "Power is on." };
      }
      if (tool === "meg" && power && how !== "jaw") {
        return { kind: "bad", text: "Power is still on. Lock out before you meg." };
      }
      if (tool === "meg" && dial === "off" && how !== "jaw") {
        return { kind: "bad", text: "Megger is off. Dial 500 V after lockout." };
      }
      if (tool === "meg" && (dial === "m500" || dial === "m1000") && how !== "jaw") {
        const other = lead === "red" ? blkOn : redOn;
        if (other && other !== term && term !== "shell" && other !== "shell") {
          return { kind: "bad", text: "A good winding looks like a short on the megger. Meg the terminal to the shell." };
        }
      }
      if (how === "jaw") {
        const mate = { l1: "l2", l2: "l1", t1: "t2", t2: "t1" };
        if (clampOn && !clampAlso && mate[clampOn] === term) {
          return { kind: "bad", text: "Both hots in the jaw cancel. Clamp one hot only." };
        }
      }
      const tgt = stepTarget();
      if (!tgt) {
        if (how === "jaw") return { kind: "ok", text: "Jaw on " + pointPhrase(term) };
        return { kind: "ok", text: (lead === "red" ? "Red on " : "Black on ") + pointPhrase(term) };
      }
      if (tgt.none) {
        if (tgt.wait === "jacks") return { kind: "bad", text: "Not a test point yet. Put black in COM, then red in VΩ." };
        if (tgt.wait && tgt.wait.indexOf("dial:") === 0) return { kind: "bad", text: "Dial first. Then put the leads on." };
        if (tgt.wait === "dead") return { kind: "bad", text: "Lock it out. Power off before the leads land." };
        if (tgt.wait === "ohm-lesson") {
          if (power) return { kind: "bad", text: "Power is on." };
          if (dial !== "ohm") return { kind: "bad", text: "Dial Ω. Power is already off." };
          return { kind: "ok", text: "Power is off." };
        }
        return null;
      }
      if (tgt.jaw) {
        if (how !== "jaw") return { kind: "bad", text: "That's a lead. Put the jaw on L1. One hot only." };
        if (term !== "l1" && term !== "t1") return { kind: "bad", text: "Wrong point. Put the jaw on L1. One hot only." };
        return { kind: "ok", text: "Jaw on " + pointPhrase(term) };
      }
      if (how === "jaw") return { kind: "bad", text: "That's the jaw. Put red on " + pointPhrase(tgt.red) + "." };
      const blackOk = term === tgt.black || (tgt.alt && term === tgt.alt);
      if (lead === "red") {
        if (term === tgt.red) return { kind: "ok", text: "Red on " + pointPhrase(term) };
        if (blackOk) return { kind: "bad", text: "Reversed leads. Red goes on " + pointPhrase(tgt.red) + ", black on " + pointPhrase(tgt.black) + "." };
        return { kind: "bad", text: "Wrong point. Put red on " + pointPhrase(tgt.red) + "." };
      }
      if (blackOk) return { kind: "ok", text: "Black on " + pointPhrase(term) };
      if (term === tgt.red) return { kind: "bad", text: "Reversed leads. Red goes on " + pointPhrase(tgt.red) + ", black on " + pointPhrase(tgt.black) + "." };
      return { kind: "bad", text: "Wrong point. Put black on " + pointPhrase(tgt.black) + "." };
    }

    function feel(el, text, kind) {
      if (!window.PlayFeel || !text) return;
      const node = el || host || document.body;
      if (kind === "bad") window.PlayFeel.deny(node);
      else window.PlayFeel.bump(node);
      window.PlayFeel.pop(node, text, kind === "bad" ? "bad" : "ok");
    }

    function coachPlay() {}

    function land(term, how) {
      if (!term) return;
      const verdict = explainLand(term, how);
      if (how === "jaw") {
        const mate = { l1: "l2", l2: "l1", t1: "t2", t2: "t1" };
        if (clampOn && !clampAlso && mate[clampOn] === term) clampAlso = term;
        else {
          clampOn = term;
          clampAlso = null;
        }
        dial = "aac";
        paint();
        if (verdict) feel(host.querySelector('[data-term="' + term + '"]'), verdict.text, verdict.kind);
        return;
      }
      if (dial === "off" && tool !== "meg") dial = "vac";
      const w = guideOn && gStep() ? (gStep().wait || "") : "";
      if (verdict && verdict.kind === "bad" && (w === "jacks" || w === "dead" || w.indexOf("dial:") === 0)) {
        feel(host.querySelector('[data-term="' + term + '"]'), verdict.text, "bad");
        return;
      }
      const skipJack = w === "jacks" || checkOn;
      if (lead === "red") {
        redOn = term;
        if (!skipJack && !jackRed) jackRed = "v";
      } else {
        blkOn = term;
        if (!skipJack) jackBlk = "com";
      }
      paint();
      if (verdict) feel(host.querySelector('[data-term="' + term + '"]'), verdict.text, verdict.kind);
    }

    function terms() {
      if (station === "comp") {
        return [
          { id: "c", x: 28, y: 78, name: "C", sub: "common" },
          { id: "r", x: 50, y: 78, name: "R", sub: "run" },
          { id: "s", x: 72, y: 78, name: "S", sub: "start" },
          { id: "shell", x: 50, y: 22, name: "SHELL", sub: "meg to ground" },
        ];
      }
      if (station === "fan" || station === "blower") {
        return [
          { id: "l1", x: 32, y: 74, name: "L1", sub: "lead" },
          { id: "l2", x: 68, y: 74, name: "L2", sub: "lead" },
          { id: "shell", x: 50, y: 24, name: "SHELL", sub: "meg to ground" },
        ];
      }
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
      if (station === "comp") return '<img alt="Compressor" src="parts/compressor.png" />';
      if (station === "fan" || station === "blower") return '<img alt="Fan motor" src="parts/fanmotor.png" />';
      if (station === "hvac240") return '<img alt="" src="parts/disconnect.png" />';
      if (station === "xfmr" || station === "hvac24") return '<img alt="" src="parts/transformer.png" />';
      if (station === "coil") return '<img alt="" src="parts/contactor.png" />';
      if (station === "outlet") return '<div class="vm-plate vm-fill"><div class="vm-outlet"><i class="hot"></i><i class="neu"></i><i class="gnd"></i></div></div>';
      if (station === "switch") return '<div class="vm-plate vm-fill"><div class="vm-switch"><div class="rocker"><b></b></div></div></div>';
      return '<div class="vm-plate vm-fill"><div class="vm-flame">FLAME</div></div>';
    }

    function nextStep() {
      return steps()[gi + 1] || null;
    }

    function nextLeaves() {
      const n = nextStep();
      return !!(n && n.station && n.station !== station);
    }

    function beginCheck() {
      if (tool === "meg") {
        guideOn = false;
        checkOn = false;
        return;
      }
      checkOn = true;
      guideOn = false;
      check240 = false;
      check24 = false;
      checkFail = false;
      checkPassed = false;
      coachShut = true;
      dial = "off";
      redOn = null;
      blkOn = null;
      clampOn = null;
      clampAlso = null;
      jackBlk = "";
      jackRed = "";
      lead = "red";
      power = true;
      hpcOpen = false;
      callY = true;
      fused = false;
      inrush = false;
      station = "hvac240";
    }

    function scoreCheck() {
      if (!checkOn || checkFail || checkPassed || tool !== "dmm") return;
      if (fused || dial !== "vac" || !power) return;
      if (jackBlk !== "com" || jackRed !== "v") return;
      if (!redOn || !blkOn || redOn === blkOn) return;
      const v = vac();
      if (station === "hvac240" && pair("l1", "l2") && v >= 200) check240 = true;
      if ((station === "xfmr" || station === "hvac24") && pair("r", "c") && v >= 20) check24 = true;
      if (check240 && check24) {
        checkPassed = true;
        if (onXp) onXp(40);
        if (!zeusSent && window.LtZeus && window.LtZeus.grant) {
          zeusSent = true;
          window.LtZeus.grant();
        }
      }
    }

    function paint() {
      if (!shellOn) buildShell();
      if (guideOn && tool === "dmm" && gStep() && gStep().id === "free") beginCheck();
      if (shellStation !== station) mountStage();
      syncFace();
      // Same-station follow-up can move the coach while the number stays on the meter.
      // A station change waits so the reading they just made stays up until Next.
      if (guideOn && stepMet(gStep()) && gi < steps().length - 1 && !nextLeaves()) {
        gi += 1;
        applyStation();
        if (onXp) onXp(8);
        if (tool === "dmm" && gStep() && gStep().id === "free") beginCheck();
        if (shellStation !== station) mountStage();
        syncFace();
      }
      coachPlay();
    }

    function ensureDragScale() {
      if (typeof document === "undefined" || document.getElementById("vm-drag-scale")) return;
      const st = document.createElement("style");
      st.id = "vm-drag-scale";
      st.textContent = [
        "#voltmeter-root .vm-school .el-zoom-work{width:min(100%,52vh)!important;max-width:100%!important;height:auto!important;aspect-ratio:1/1!important;min-height:0!important;margin-left:auto!important;margin-right:auto!important;overflow:hidden}",
        "#voltmeter-root .vm-school .el-zoom-work img{position:absolute!important;inset:0!important;left:0!important;top:0!important;transform:none!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;aspect-ratio:auto!important;object-fit:contain!important;object-position:center!important;padding:0!important}",
        "#voltmeter-root .vm-school .el-zoom-svg{width:100%;height:100%;object-fit:contain}",
        "#voltmeter-root .el-zoom-spools .el-spool i{width:18px;height:40px;object-fit:contain;flex:none}",
        "@media (max-width:820px){#voltmeter-root .vm-split{grid-template-columns:minmax(132px,38%) minmax(0,1fr)!important;height:auto;min-height:0}#voltmeter-root .vm-meter,#voltmeter-root .vm-device{overflow:auto;height:auto;max-height:none}#voltmeter-root .vm-school .el-zoom-work{width:min(100%,42vw,220px)!important}#voltmeter-root .el-zoom-spools{flex-wrap:wrap;overflow:visible;max-width:100%}#voltmeter-root .el-zoom-screw{width:48px;height:48px}}",
      ].join("");
      document.head.appendChild(st);
    }

    function buildShell() {
      shellOn = true;
      ensureDragScale();
      shellStation = "";
      host.innerHTML =
        '<div class="vm-school">' +
        "<style>" +
        "#voltmeter-root{height:100%}" +
        "#voltmeter-root .vm-school{height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;padding:6px;box-sizing:border-box;gap:6px}" +
        "#voltmeter-root .vm-top{flex:0 0 auto;display:flex;flex-wrap:wrap;gap:6px;align-items:center}" +
        "#voltmeter-root .vm-top h2{margin:0;font-size:18px}" +
        "#voltmeter-root .vm-split{flex:1;min-height:0;display:grid;grid-template-columns:minmax(200px,300px) minmax(0,1fr);gap:8px;align-items:stretch}" +
        "#voltmeter-root .vm-meter{min-height:0;overflow:auto;background:transparent;color:#f4efe6;border:none;padding:2px}" +
        "#voltmeter-root .vm-device{min-height:0;overflow:auto;background:#f7f3ea;color:#1a1612;border-radius:14px;padding:6px;display:flex;flex-direction:column}" +
        "#voltmeter-root .vm-case{position:relative;background:linear-gradient(180deg,#f6c62a,#c8920c);border-radius:46% 46% 22px 22px;padding:54px 7px 7px;box-shadow:0 10px 0 #070809}#voltmeter-root .vm-case:before{content:'';position:absolute;left:18%;right:18%;top:8px;height:36px;border:10px solid #1a1a1a;border-bottom:0;border-radius:36px 36px 0 0;background:#101214}" +
        "#voltmeter-root .vm-boot{background:linear-gradient(180deg,#f6c62a 0%,#e0aa10 55%,#c8920c 100%);border-radius:16px 16px 22px 22px;padding:8px 8px 12px;box-shadow:inset 0 0 0 3px #1a1a1a}" +
        "#voltmeter-root .vm-logo{margin:0 0 6px;text-align:center;font-size:11px;letter-spacing:.14em;color:#1a1a1a;font-weight:800}" +
        "#voltmeter-root .vm-lcd{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:flex-end;gap:6px;min-height:54px;margin:0;padding:8px 8px 6px;background:linear-gradient(180deg,#c5d4ae,#8fa37a);color:#12160e;border:4px solid #111;border-radius:4px;box-shadow:inset 0 2px 0 rgba(255,255,255,.35);font-family:ui-monospace,monospace;white-space:nowrap;overflow:hidden}" +
        "#voltmeter-root .vm-lcd #vm-val{font-size:30px;line-height:1;letter-spacing:.03em;white-space:nowrap}" +
        "#voltmeter-root .vm-lcd>.sf-bar,#voltmeter-root .vm-lcd>.sf-tag{flex:1 0 100%;width:auto;max-width:100%}" +
        "#voltmeter-root .vm-lcd small{font-size:13px;font-weight:800;margin-bottom:3px}" +
        "#voltmeter-root .vm-dial{position:relative;width:min(100%,220px);aspect-ratio:1;margin:6px auto 2px;--orbit:82px}" +
        "#voltmeter-root .vm-dial button{position:absolute;left:50%;top:50%;width:44px;height:28px;margin:-14px 0 0 -22px;padding:0;min-height:0;border-radius:8px;border:0;background:transparent;color:#1a1a1a;font-size:13px;font-weight:800;line-height:1;box-shadow:none;transform:rotate(calc(var(--i) * 360deg / var(--n))) translateY(calc(var(--orbit) * -1)) rotate(calc(var(--i) * -360deg / var(--n))) !important}" +
        "#voltmeter-root .vm-dial button.on{background:transparent;color:#1a1a1a;border:0;text-decoration:underline}" +
        "#voltmeter-root .vm-knob{position:absolute;left:50%;top:50%;width:72px;height:72px;margin:-36px 0 0 -36px;border-radius:50%;background:#1a1a1a;box-shadow:inset 0 0 0 6px #2a2a2a,0 2px 0 #000;pointer-events:none;transform:rotate(calc(var(--sel) * 360deg / var(--n))) !important}" +
        "#voltmeter-root .vm-knob:before{content:'';position:absolute;left:50%;top:7px;width:5px;height:16px;margin-left:-2.5px;background:#f6c62a;border-radius:2px}" +
        "#voltmeter-root .vm-funcs{display:flex;justify-content:center;gap:6px;margin:0 0 8px}" +
        "#voltmeter-root .vm-funcs .el-meter-pick{min-height:26px;padding:2px 7px;font-size:10px;background:#1a1a1a;color:#f4efe6;border-color:#111;box-shadow:none}" +
        "#voltmeter-root .vm-funcs .el-meter-pick.on{background:#fff4c4;color:#1a1a1a}" +
        "#voltmeter-root .vm-jacks{display:flex;justify-content:center;gap:22px;margin:0}" +
        "#voltmeter-root .vm-jacks .el-lead-jack{width:56px;height:56px;min-height:56px;padding:0;border-radius:50%;font-size:12px;font-weight:800;line-height:1.05;color:#f4efe6;border:3px solid #111;box-shadow:inset 0 0 0 7px #2a2a2a;background:radial-gradient(circle at 40% 35%,#555,#111 62%)}" +
        "#voltmeter-root .vm-jacks #vm-jack-v{background:radial-gradient(circle at 40% 35%,#ff5a48,#8d140e 62%)}" +
        "#voltmeter-root .vm-jacks .el-lead-jack.in{box-shadow:inset 0 0 0 7px #f6c62a,0 0 0 2px #f6c62a}" +
        "#voltmeter-root .vm-meter .el-lead-note{color:#d5dde4;font-size:12px;margin:6px 2px}" +
        "#voltmeter-root #vm-toggles{margin-top:6px}" +
        "#voltmeter-root .vm-device .el-zoom-spools{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 4px;padding:0}" +
        "#voltmeter-root .vm-device .el-spool{flex:1 1 90px;min-height:52px;padding:8px 10px;margin:0}" +
        "#voltmeter-root .vm-device .el-spool span{font-size:16px;line-height:1.15}" +
        "#voltmeter-root .vm-move{margin:0 0 6px;padding:8px 10px;min-height:44px;border-radius:12px;background:#1c2126;color:#f6f0e2;font:800 16px/1.3 system-ui,sans-serif;border:2px solid #e8c450}" +
        "#voltmeter-root .vm-move:empty{display:none}" +
        "#voltmeter-root #vm-check{display:flex;flex-direction:column;gap:6px;margin:0 0 6px}" +
        "#voltmeter-root #vm-check[hidden]{display:none !important}" +
        "#voltmeter-root .vm-ck-row{display:flex;gap:6px}" +
        "#voltmeter-root .vm-ck-row button{flex:1;min-height:52px;padding:8px;border-radius:12px;border:2px solid #6a5740;background:#efe6d6;color:#1a1612;font:800 16px/1.1 system-ui,sans-serif}" +
        "#voltmeter-root .vm-ck-row button.on{outline:3px solid #e8c450}" +
        "#voltmeter-root .vm-ck-row button.ok{background:#1b8f4a;color:#fff;border-color:#0d5c2e}" +
        "#voltmeter-root .vm-ck-row button.bad{background:#CE0034;color:#fff;border-color:#7a1020}" +
        "#voltmeter-root #vm-ck-retry{min-height:52px;font-size:18px;width:100%}" +
        "#voltmeter-root .vm-big{display:flex;gap:6px;margin:4px 0 6px}" +
        "#voltmeter-root .vm-big button{flex:1;min-height:48px;border-radius:12px;border:2px solid #111;background:#1a1a1a;color:#f6c62a;font:800 18px/1 system-ui,sans-serif}" +
        "#voltmeter-root .vm-big button.on{background:#f6c62a;color:#1a1a1a}" +
        "#voltmeter-root .el-zoom-work{position:relative;width:min(100%,52vh);max-width:100%;height:auto!important;aspect-ratio:1/1;min-height:0;margin:2px auto;background:#0e1216;border-radius:12px;overflow:hidden}" +
        "#voltmeter-root .el-zoom-screw{transform:translate(-50%,-50%) !important}" +
        "#voltmeter-root .vm-coach{position:relative;z-index:6;width:100%;max-height:120px;overflow:auto;margin:0 0 6px;display:block;padding:6px;background:#1c2126;border:1px solid #e8c450;border-radius:10px}" +
        "#voltmeter-root .vm-coach[hidden]{display:none !important}" +
        "#voltmeter-root .vm-coach-head{display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:grab;touch-action:none}" +
        "#voltmeter-root .vm-coach-head button{margin:0}" +
        "#voltmeter-root .vm-coach-body{display:flex;gap:8px}" +
        "#voltmeter-root .vm-coach img{width:36px;height:36px;border-radius:8px;object-fit:cover}" +
        "#voltmeter-root .vm-coach p{margin:2px 0 0;font-size:13px;color:#d8cbb0}" +
        "#voltmeter-root .vm-meter .el-lead-note{color:#d5dde4}" +
        "#voltmeter-root .el-zoom-work img{object-fit:contain;max-width:100%;max-height:100%}" +
        "#voltmeter-root .vm-device #vm-desc{display:block;color:#3a3228}" +
        "#voltmeter-root #vm-stations{flex-wrap:wrap}" +
        "#voltmeter-root .el-meter-pick.on{border-color:#e8c450;color:#e8c450}" +
        "body:has(#screen-voltmeter.active) #drip-ear{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important;width:min(240px,32vw)!important;max-height:64px!important}body:has(#screen-voltmeter.active) .ld-replay{bottom:78px!important;right:8px!important;top:auto!important;left:auto!important}body:has(#screen-voltmeter.active) #toast-host{top:auto!important;bottom:8px!important;left:260px!important;right:auto!important;width:min(200px,24vw)!important}" +
        "@media (max-width:820px){#voltmeter-root{max-width:100%;overflow-x:hidden}#voltmeter-root .vm-school{overflow:hidden}#voltmeter-root .vm-split{grid-template-columns:minmax(168px,46%) minmax(0,1fr)!important;height:100%;min-height:0;flex:1}#voltmeter-root .vm-meter,#voltmeter-root .vm-device{overflow:auto;height:100%;max-height:100%}#voltmeter-root .vm-device .eyebrow{display:none}#voltmeter-root #vm-skip{white-space:normal;max-width:100%;font-size:12px}#voltmeter-root .el-zoom-work{width:100%!important;max-height:42vh}#voltmeter-root .vm-dial{width:172px;--orbit:64px}#voltmeter-root .vm-dial button{width:44px;height:28px;margin:-14px 0 0 -22px;font-size:12px;background:transparent;color:#1a1a1a;border:0}#voltmeter-root .vm-lcd #vm-val{font-size:22px}#voltmeter-root .vm-coach{position:relative!important;top:auto!important;left:auto!important;bottom:auto!important;width:100%!important;max-height:72px!important}body:has(#screen-voltmeter.active) #drip-ear{display:flex!important;top:8px!important;bottom:auto!important;left:8px!important;right:8px!important;width:auto!important;max-height:52px!important}body:has(#screen-voltmeter.active) .ld-replay{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important}body:has(#screen-voltmeter.active) #toast-host{top:auto!important;bottom:8px!important;left:auto!important;right:8px!important;width:min(132px,38vw)!important}}@media (orientation:landscape) and (max-height:500px){#screen-voltmeter.screen.active{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}#voltmeter-root{height:100%!important;max-height:100dvh!important;overflow:hidden!important;display:flex!important;flex-direction:column!important}#voltmeter-root .vm-coach{max-height:32px!important;overflow:hidden!important;margin:0!important}#voltmeter-root .vm-split{flex:1 1 auto!important;min-height:0!important;height:auto!important;grid-template-columns:minmax(200px,32%) minmax(0,1fr)!important}#voltmeter-root .vm-meter,#voltmeter-root .vm-device{overflow:auto!important;min-height:0!important;max-height:100%!important}#voltmeter-root .vm-dial{width:104px!important;--orbit:38px!important;margin:0 auto!important}#voltmeter-root .el-zoom-work{max-height:46vh!important;width:min(100%,46vh)!important}#voltmeter-root .vm-meter{padding:0 4px 4px!important}#voltmeter-root .vm-top{flex:0 0 auto!important;max-height:36px!important;overflow:hidden!important;display:flex!important;flex-wrap:nowrap!important;align-items:center!important}#voltmeter-root .vm-top h2{font-size:15px!important;margin:0!important}#voltmeter-root .vm-logo,#voltmeter-root .el-lead-note,#voltmeter-root .vm-device .eyebrow,#voltmeter-root #vm-skip,#voltmeter-root .vm-funcs{display:none!important}#voltmeter-root .vm-coach{max-height:22px!important;margin:0!important;padding:2px 6px!important}#voltmeter-root .vm-coach-body img{display:none!important}#voltmeter-root .vm-coach p{margin:0!important;font-size:12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}#voltmeter-root .vm-jacks{margin:2px 0 0!important}#voltmeter-root .vm-jacks .el-lead-jack{width:32px!important;height:32px!important}#voltmeter-root .vm-device{padding-top:30px!important;box-sizing:border-box!important}body:has(#screen-voltmeter.active) #drip-ear{display:none!important}body:has(#screen-voltmeter.active) .ld-replay{top:44px!important;right:8px!important;bottom:auto!important;left:auto!important;max-width:108px!important;max-height:26px!important}body:has(#screen-voltmeter.active) #hub-ai-fab{top:44px!important;right:124px!important;bottom:auto!important;left:auto!important;max-height:26px!important}body:has(#screen-voltmeter.active) #toast-host{top:4px!important;left:8px!important;right:auto!important;bottom:auto!important;width:min(120px,22vw)!important;max-height:24px!important}}" +
        "</style>" +
        '<header class="vm-top">' +
        '<button type="button" class="el-meter-pick" id="vm-hub">Shop floor</button>' +
        '<h2 id="vm-h2">' + (tool === "meg" ? "Megohmmeter" : "Voltmeter") + "</h2>" +
        '<button type="button" class="el-meter-pick" id="vm-tool-dmm">Voltmeter</button>' +
        '<button type="button" class="el-meter-pick" id="vm-tool-meg">Megohmmeter</button>' +
        '<button type="button" class="el-meter-pick" id="vm-steps">Steps</button>' +
        '<button type="button" class="el-meter-pick" id="vm-guided">Guided</button>' +
        '<button type="button" class="el-meter-pick" id="vm-free">Unguided</button>' +
        "</header>" +
        '<div class="vm-split">' +
        '<aside class="vm-meter">' +
        '<div class="vm-coach" id="vm-coach"><header class="vm-coach-head" id="vm-coach-head">' +
        '<p class="eyebrow" id="vm-step">HUB</p><button type="button" id="vm-coach-x">Close</button></header>' +
        '<div class="vm-coach-body"><img src="hub-portrait.jpg?v=3" alt="Professor HUB" /><div>' +
        '<strong id="vm-title"></strong><p id="vm-say"></p>' +
        "</div></div></div>" +
        '<button type="button" class="el-meter-pick" id="vm-skip">Stuck</button>' +
        '<div class="vm-case"><div class="vm-boot">' +
        '<p class="vm-logo">' + (tool === "meg" ? "INSULATION <b>500–1000 V</b>" : "CLAMP METER <b>CL445</b>") + "</p>" +
        '<div class="el-lead-lcd vm-lcd"><span id="vm-val"> </span><small id="vm-unit"></small></div>' +
        '<div class="vm-dial" id="vm-dials" style="--n:' + dials().length + ';--sel:0">' +
        dials().map(function (d, i) {
          return '<button type="button" data-dial="' + d.id + '" style="--i:' + i + '">' + d.label + "</button>";
        }).join("") +
        '<span class="vm-knob" aria-hidden="true"></span></div>' +
        '<div class="vm-big" id="vm-big">' +
        (tool === "meg" ? "" : '<button type="button" data-quick="off">OFF</button><button type="button" data-quick="vac">V~</button><button type="button" data-quick="ohm">Ω</button>') +
        "</div>" +
        '<div class="vm-funcs">' +
        (tool === "meg" ? "" : '<button type="button" class="el-meter-pick" id="vm-sel">SEL</button><button type="button" class="el-meter-pick" id="vm-inrush">InRush</button><button type="button" class="el-meter-pick" id="vm-ncv">NCV</button>') +
        "</div>" +
        '<div class="el-lead-jacks vm-jacks">' +
        '<button type="button" class="el-lead-jack" data-jack="com" id="vm-jack-com">COM</button>' +
        '<button type="button" class="el-lead-jack" data-jack="v" id="vm-jack-v">' + (tool === "meg" ? "LINE" : "VΩ") + "</button>" +
        "</div></div></div>" +
        '<p class="el-lead-note" id="vm-note"></p>' +
        '<button type="button" class="el-meter-pick" id="vm-fuse" hidden>Replace meter fuse</button>' +
        '<div class="el-meter-picks" id="vm-toggles">' +
        '<label class="el-meter-pick"><input type="checkbox" id="vm-power"/> Disconnect ON</label>' +
        '<label class="el-meter-pick" id="vm-sw-lab"><input type="checkbox" id="vm-sw"/> Switch ON</label>' +
        '<label class="el-meter-pick" id="vm-y-lab"><input type="checkbox" id="vm-y"/> Y call</label>' +
        '<label class="el-meter-pick" id="vm-hpc-lab"><input type="checkbox" id="vm-hpc"/> HPC open</label>' +
        '<label class="el-meter-pick" id="vm-flame-lab"><input type="checkbox" id="vm-flame"/> Flame proven</label>' +
        "</div></aside>" +
        '<section class="vm-device">' +
        '<p id="vm-move" class="vm-move"></p>' +
        '<div id="vm-check" hidden>' +
        '<div class="vm-ck-row">' +
        '<button type="button" id="vm-ck-240">240 string</button>' +
        '<button type="button" id="vm-ck-24">24 string</button>' +
        "</div>" +
        '<button type="button" class="el-meter-pick" id="vm-ck-retry" hidden>Retry</button>' +
        "</div>" +
        '<p class="eyebrow">Drag a lead onto a test point</p>' +
        '<strong id="vm-name"></strong>' +
        '<div class="el-spools el-zoom-spools" id="vm-spools">' +
        '<button type="button" class="el-spool red" data-leadhand="red" id="vm-lead-red"><i></i><span><b>RED</b></span></button>' +
        '<button type="button" class="el-spool blk" data-leadhand="blk" id="vm-lead-blk"><i></i><span><b>BLACK</b></span></button>' +
        (tool === "meg" ? "" : '<button type="button" class="el-spool" data-leadhand="jaw" id="vm-jaw"><i></i><span><b>JAW</b></span></button>') +
        "</div>" +
        '<div id="vm-stage"></div>' +
        '<div class="el-meter-picks" id="vm-stations">' +
        stations().map(function (x) {
          return '<button type="button" class="el-meter-pick" data-st="' + x.id + '">' + x.name + "</button>";
        }).join("") +
        "</div>" +
        '<p class="el-lead-note" id="vm-tip"></p>' +
        "</section></div></div>";
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
      if (checkOn) scoreCheck();
      lastNote = r.note;
      const s = gStep();
      const last = gi >= steps().length - 1;
      const st = stations().find(function (x) { return x.id === station; }) || stations()[0];
      const coach = host.querySelector("#vm-coach");
      if (coach) coach.hidden = checkOn || !guideOn || coachShut;
      const stepEl = host.querySelector("#vm-step");
      if (stepEl) stepEl.textContent = checkOn ? "Unguided check" : (tool === "meg" ? "Megger" : BRAND) + " · " + (gi + 1) + "/" + steps().length;
      const title = host.querySelector("#vm-title");
      if (title) title.textContent = s.title;
      const say = host.querySelector("#vm-say");
      if (say) {
        let extra = "";
        if (guideOn && s.station && s.station !== station) {
          const need = stations().find(function (x) { return x.id === s.station; });
          extra = " This step is on " + (need ? need.name : s.station) + ".";
        }
        if (guideOn && s.needOn && !swOn) extra += " Flip Switch ON.";
        if (guideOn && s.needOff && swOn) extra += " Switch stays OFF.";
        if (guideOn && stepMet(s) && nextLeaves()) extra += " That's the reading. Tap Next.";
        say.textContent = s.say + extra;
      }
      const move = host.querySelector("#vm-move");
      if (move) {
        if (checkOn && checkFail) move.textContent = "Failed.";
        else if (checkOn && checkPassed) move.textContent = "Both strings proved.";
        else if (checkOn) move.textContent = "Prove the 240 string and the 24 string. Dial VAC.";
        else if (guideOn && fused) move.textContent = "Failed.";
        else if (guideOn) move.textContent = coachLine();
        else move.textContent = "";
      }
      const bar = host.querySelector("#vm-check");
      if (bar) bar.hidden = !checkOn;
      const p240 = host.querySelector("#vm-ck-240");
      const p24 = host.querySelector("#vm-ck-24");
      if (p240) {
        p240.classList.toggle("on", station === "hvac240");
        p240.classList.toggle("ok", check240 && !checkFail);
        p240.classList.toggle("bad", !!checkFail);
      }
      if (p24) {
        p24.classList.toggle("on", station === "xfmr" || station === "hvac24");
        p24.classList.toggle("ok", check24 && !checkFail);
        p24.classList.toggle("bad", !!checkFail);
      }
      const retry = host.querySelector("#vm-ck-retry");
      if (retry) retry.hidden = !(checkOn && checkFail);
      const skip = host.querySelector("#vm-skip");
      if (skip) {
        skip.hidden = !guideOn && !checkOn;
        if (checkOn) skip.textContent = "Stuck";
        else {
          const ready = guideOn && stepMet(s) && !last;
          skip.textContent = last ? "On your own" : ready ? "Next" : "Stuck";
        }
      }
      const gBtn = host.querySelector("#vm-guided");
      const fBtn = host.querySelector("#vm-free");
      if (gBtn) gBtn.classList.toggle("on", guideOn && !checkOn);
      if (fBtn) fBtn.classList.toggle("on", !guideOn);
      const dmmBtn = host.querySelector("#vm-tool-dmm");
      const megBtn = host.querySelector("#vm-tool-meg");
      if (dmmBtn) dmmBtn.classList.toggle("on", tool === "dmm");
      if (megBtn) megBtn.classList.toggle("on", tool === "meg");
      const name = host.querySelector("#vm-name");
      if (name) {
        if (checkOn && station === "hvac240") name.textContent = "240 string";
        else if (checkOn && (station === "xfmr" || station === "hvac24")) name.textContent = "24 string";
        else name.textContent = st.name;
      }
      const desc = host.querySelector("#vm-desc");
      if (desc) desc.textContent = st.blurb + (tool === "meg" && !guideOn ? " Unguided. One motor is grounded or open. Find it." : " Drag RED and BLACK onto the points — or tap a lead, then tap the point.");
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
      const dialInfo = dials().find(function (d) { return d.id === dial; }) || dials()[0];
      if (tip) tip.textContent = dialInfo.tip;
      host.querySelectorAll("[data-dial]").forEach(function (b, i) {
        const on = b.getAttribute("data-dial") === dial;
        b.classList.toggle("on", on);
        if (on) {
          const box = host.querySelector("#vm-dials");
          if (box) box.style.setProperty("--sel", String(i));
        }
      });
      host.querySelectorAll("[data-st]").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-st") === station);
      });
      const stBox = host.querySelector("#vm-stations");
      if (stBox) stBox.hidden = !!checkOn;
      host.querySelectorAll("[data-quick]").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-quick") === dial);
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
                plug(jack.getAttribute("data-jack"), lead);
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
      const coachBox = host.querySelector("#vm-coach");
      const coachHead = host.querySelector("#vm-coach-head");
      const coachX = host.querySelector("#vm-coach-x");
      const stepsBtn = host.querySelector("#vm-steps");
      if (coachBox && coachHead && window.LtDrag && window.LtDrag.makeMoveable) {
        window.LtDrag.makeMoveable(coachHead, coachBox, "lt-vm-coach-pos2");
      }
      if (coachX && coachBox) coachX.onclick = function (e) {
        e.stopPropagation();
        coachShut = true;
        coachBox.hidden = true;
      };
      if (stepsBtn && coachBox) stepsBtn.onclick = function () {
        coachShut = false;
        coachBox.hidden = !guideOn;
      };
      const modeBtn = host.querySelector("#vm-guided");
      if (modeBtn) modeBtn.onclick = function () {
        checkOn = false;
        checkFail = false;
        checkPassed = false;
        check240 = false;
        check24 = false;
        guideOn = true;
        coachShut = false;
        megFault = "good";
        gi = 0;
        dial = "off";
        redOn = null;
        blkOn = null;
        jackBlk = "";
        jackRed = "";
        fused = false;
        station = tool === "meg" ? "comp" : "outlet";
        power = true;
        applyStation();
        paint();
      };
      const freeBtn = host.querySelector("#vm-free");
      if (freeBtn) freeBtn.onclick = function () {
        if (tool === "meg") {
          guideOn = false;
          checkOn = false;
          megFault = ["ground_r", "open_s", "fan_ground"][Math.floor(Math.random() * 3)];
          paint();
          return;
        }
        beginCheck();
        paint();
      };
      function setTool(next) {
        if (tool === next) return;
        tool = next;
        gi = 0;
        dial = "off";
        redOn = null;
        blkOn = null;
        clampOn = null;
        clampAlso = null;
        station = next === "meg" ? "comp" : "outlet";
        power = true;
        megFault = "good";
        checkOn = false;
        checkFail = false;
        checkPassed = false;
        check240 = false;
        check24 = false;
        shellOn = false;
        paint();
      }
      const dmmBtn = host.querySelector("#vm-tool-dmm");
      if (dmmBtn) dmmBtn.onclick = function () { setTool("dmm"); };
      const megBtn = host.querySelector("#vm-tool-meg");
      if (megBtn) megBtn.onclick = function () { setTool("meg"); };
      const skip = host.querySelector("#vm-skip");
      if (skip) skip.onclick = function () {
        if (checkOn) {
          if (jackBlk !== "com" || jackRed !== "v" || dial !== "vac") whisper("vm.class", true);
          else whisper("elec.kvl", true);
          return;
        }
        if (!guideOn) return;
        if (gi >= steps().length - 1) {
          if (tool === "dmm") beginCheck();
          else guideOn = false;
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
      const go240 = host.querySelector("#vm-ck-240");
      if (go240) go240.onclick = function () {
        station = "hvac240";
        redOn = null;
        blkOn = null;
        clampOn = null;
        clampAlso = null;
        paint();
      };
      const go24 = host.querySelector("#vm-ck-24");
      if (go24) go24.onclick = function () {
        station = "xfmr";
        redOn = null;
        blkOn = null;
        clampOn = null;
        clampAlso = null;
        paint();
      };
      const retry = host.querySelector("#vm-ck-retry");
      if (retry) retry.onclick = function () { beginCheck(); paint(); };
      host.querySelectorAll("[data-dial]").forEach(function (b) {
        b.onclick = function () { setDial(b.getAttribute("data-dial")); };
      });
      host.querySelectorAll("[data-quick]").forEach(function (b) {
        b.onclick = function () { setDial(b.getAttribute("data-quick")); };
      });
      host.querySelectorAll("[data-jack]").forEach(function (b) {
        b.onclick = function () { plug(b.getAttribute("data-jack"), lead); };
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

    if (opts && opts.unguided && tool !== "meg") beginCheck();
    else applyStation();
    paint();
    if (!checkOn) whisper("vm.class");
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
