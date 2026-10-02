/* Heat plant lab — gas furnace, oil burner, hydronics.
   Sequence + prove points + field faults. Not a combustion cartoon. */
(function (global) {
  "use strict";

  const PLANTS = [
    { id: "gas", name: "Gas furnace", blurb: "80% induced draft · HSI · flame rod" },
    { id: "oil", name: "Oil furnace", blurb: "Gun burner · cad cell · primary lockout" },
    { id: "hydro", name: "Hydronic", blurb: "Boiler · circ · zone valve · ΔT" },
  ];

  const FAULTS = {
    gas: [
      { id: "none", name: "Healthy" },
      { id: "dirty_filter", name: "Dirty filter / low airflow" },
      { id: "open_press", name: "Pressure switch won't close" },
      { id: "cracked_hose", name: "Cracked inducer hose" },
      { id: "dirty_flame", name: "Dirty flame sensor" },
      { id: "no_hsi", name: "Open hot-surface ignitor" },
    ],
    oil: [
      { id: "none", name: "Healthy" },
      { id: "dirty_filter", name: "Dirty filter / low airflow" },
      { id: "cad_dark", name: "Sooted cad cell" },
      { id: "no_nozzle", name: "Plugged nozzle / no oil" },
      { id: "no_hsi", name: "Weak ignitor / no spark" },
    ],
    hydro: [
      { id: "none", name: "Healthy" },
      { id: "end_switch", name: "Zone valve end switch open" },
      { id: "air_bound", name: "Air-bound circulator" },
      { id: "low_water", name: "Low water cutoff open" },
      { id: "dirty_flame", name: "Dirty flame sensor (boiler)" },
    ],
  };

  const STEPS_GAS = [
    "Idle",
    "W call",
    "Inducer / pre-purge",
    "Pressure switch",
    "HSI heat-up",
    "Gas valve",
    "Flame prove",
    "Blower on delay",
    "Run — temp rise",
  ];
  const STEPS_OIL = [
    "Idle",
    "W call",
    "Burner motor",
    "Ignitor + oil",
    "Cad cell prove",
    "Blower on delay",
    "Run — stack / rise",
  ];
  const STEPS_HYDRO = [
    "Idle",
    "Zone call",
    "Zone valve",
    "End switch",
    "Circulator",
    "Aquastat / boiler",
    "Run — water ΔT",
  ];

  function FurnaceLab(host, opts) {
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let plant = "gas";
    let fault = "none";
    let calling = false;
    let t = 0;
    let lockout = false;
    let timer = 0;
    let lastKick = false;
    let jumped = false;
    let spoiled = false;
    let jumpNote = "";

    function blank() {
      return {
        step: "Idle",
        inducer: false,
        press: false,
        ignitor: false,
        gas: false,
        oil: false,
        flame: false,
        flameUa: 0,
        cadOhm: 120000,
        blower: false,
        burnerMotor: false,
        zv: false,
        endSw: false,
        circ: false,
        boiler: false,
        lwco: true,
        rise: 0,
        supply: 68,
        ret: 68,
        stack: 70,
        wtSup: 80,
        wtRet: 80,
        dT: 0,
        psi: 12,
        status: "Standing by. Call for heat when you're ready.",
        hub: "Pick the plant. Gas, oil, or hydronic. Then hit Call heat.",
        ok: false,
      };
    }

    function sim(dt) {
      const s = blank();
      s.ret = 68;
      const f = fault;
      if (lockout) {
        s.step = "LOCKOUT";
        s.ok = false;
        if (jumped) {
          s.status = "FAIL. You jumped the gas valve before the pressure switch proved. That is not a win.";
          s.hub = "Call for heat: inducer, prove the switch, ignitor, gas valve, then the blower. A jumper before the switch is raw gas.";
          return s;
        }
        s.status = plant === "oil"
          ? "Oil primary locked out. Cad cell never saw light. Reset after you fix the fire."
          : "Control locked out. Don't keep cycling. Find the prove that failed.";
        s.hub = plant === "oil"
          ? "Dark cad cell or no oil. Don't hold the reset. Fix nozzle / cell / spark, then one reset."
          : "Count the flashes if this were a real board. Here: last prove failed. Fix that, then call again.";
        return s;
      }
      if (!calling) {
        if (plant === "hydro") {
          s.wtSup = 140;
          s.wtRet = 140;
          s.psi = f === "low_water" ? 4 : 15;
          s.lwco = f !== "low_water";
        }
        return s;
      }
      t += dt;
      s.ret = 68;

      if (plant === "gas") return gas(s, f);
      if (plant === "oil") return oil(s, f);
      return hydro(s, f);
    }

    function gas(s, f) {
      s.step = STEPS_GAS[1];
      if (t < 0.4) {
        s.status = "W is up. Board should start the inducer.";
        s.hub = "Listen for the draft motor. No inducer, no pressure switch.";
        return s;
      }
      s.inducer = true;
      s.step = STEPS_GAS[2];
      if (t < 1.3) {
        s.status = "Inducer on. Pre-purge. Pressure switch should close.";
        s.hub = "Hose on the inducer housing. If it's cracked you never get a close.";
        return s;
      }
      const pressOk = f !== "open_press" && f !== "cracked_hose";
      s.press = pressOk;
      s.step = STEPS_GAS[3];
      if (!pressOk) {
        s.status = "Pressure switch open. Inducer is running. No ignition.";
        s.hub = f === "cracked_hose"
          ? "Cracked hose = inducer can't pull the switch. Replace the tubing, don't jumper the switch."
          : "Switch stuck open, blocked flue, or water in the hose. Prove draft, then the switch.";
        return s;
      }
      if (t < 2.2) {
        s.status = "Pressure switch proved closed. Ignitor is next. Do not jump the gas valve.";
        s.hub = "Inducer, prove the switch, then the ignitor, then the valve, then the blower.";
        return s;
      }
      if (t < 3.4) {
        s.ignitor = f !== "no_hsi";
        s.step = STEPS_GAS[4];
        if (f === "no_hsi") {
          s.status = "HSI open. Board never gets glow. Valve stays shut.";
          s.hub = "Ohm the ignitor cold. Typically 40–90 Ω. Infinite = replace. Don't oil it.";
          return s;
        }
        s.status = "HSI glowing. Valve next.";
        s.hub = "Hot surface needs a few seconds. Don't jump the valve to 'see if it lights.'";
        return s;
      }
      s.ignitor = t < 4.6 && f !== "no_hsi";
      s.gas = f !== "no_hsi";
      s.step = STEPS_GAS[5];
      if (t < 4.6) {
        s.status = "Gas valve energized. The switch already proved — the board opened it.";
        s.hub = "You should smell a second of gas, then fire. No fire means sensor or valve, not 'add charge.'";
        return s;
      }
      const flameOk = s.gas && f !== "dirty_flame" && f !== "no_hsi";
      s.flame = flameOk;
      s.flameUa = flameOk ? 2.8 : f === "dirty_flame" ? 0.15 : 0;
      s.step = STEPS_GAS[6];
      if (!flameOk) {
        if (t > 6.4) lockout = true;
        s.status = "No flame prove. µA is junk. Valve will drop.";
        s.hub = "Pull the rod. Scotch-Brite, not sandpaper. Looking for ~1–5 µA DC. Under 0.5 is a dropout.";
        s.gas = t < 6.4;
        return s;
      }
      s.ignitor = false;
      if (t < 7.0) {
        s.status = "Flame proven " + s.flameUa.toFixed(1) + " µA. Blower on delay.";
        s.hub = "Heat the exchanger before you move air. That's the delay. Don't jump it.";
        s.step = STEPS_GAS[7];
        s.rise = 8;
        s.supply = s.ret + s.rise;
        return s;
      }
      s.blower = true;
      s.step = STEPS_GAS[8];
      let rise = 42;
      if (f === "dirty_filter") rise = 88;
      s.rise = rise;
      s.supply = s.ret + rise;
      if (rise > 75) {
        s.status = "Temp rise " + rise + " °F. Limit will open. Filter or blower, not gas pressure first.";
        s.hub = "OEM rise is on the nameplate — often 30–60 °F. High rise = low airflow. Change the filter.";
        if (t > 9.2) {
          s.gas = false;
          s.flame = false;
          s.flameUa = 0;
          s.status = "High limit OPEN. Burners off. Blower should keep running.";
        }
        return s;
      }
      s.ok = true;
      s.status = "Running. Rise " + rise + " °F. Flame " + s.flameUa.toFixed(1) + " µA. That's a furnace.";
      s.hub = "Nameplate rise, static, flame µA. If it short-cycles, look at limit and airflow before the gas man.";
      return s;
    }

    function oil(s, f) {
      s.step = STEPS_OIL[1];
      if (t < 0.35) {
        s.status = "W is up. Oil primary should spin the burner motor.";
        s.hub = "Beckett-style: motor, ignitor, then cad cell has to see light or you lock out.";
        return s;
      }
      s.burnerMotor = true;
      s.step = STEPS_OIL[2];
      s.ignitor = f !== "no_hsi" && t < 4.5;
      if (t < 1.1) {
        s.status = "Burner motor on. Ignitor should be sparking.";
        s.hub = f === "no_hsi" ? "No spark, no fire. Check transformer and electrodes. Don't crank the reset." : "Interrupted ignition — spark drops after prove.";
        return s;
      }
      s.oil = f !== "no_nozzle" && f !== "no_hsi";
      s.step = STEPS_OIL[3];
      const light = s.oil && f !== "cad_dark";
      s.cadOhm = light ? 720 : 110000;
      s.flame = light;
      if (t < 3.8) {
        if (!s.oil) {
          s.status = "Motor running, no fire. Nozzle or pump.";
          s.hub = "Pump should be ~100 psi on most residential guns. Nozzle size is on the gun. Don't upsize to 'get more heat.'";
          return s;
        }
        if (!light) {
          s.status = "Fire may be there but cad cell is dark (" + Math.round(s.cadOhm / 1000) + " kΩ).";
          s.hub = "Cell in the light should be under ~1600 Ω. Dark is 100 kΩ+. Pull it, wipe soot, aim at the fire.";
          return s;
        }
        s.status = "Cad cell seeing light (" + s.cadOhm + " Ω). Spark will drop.";
        s.hub = "That's prove. Primary stays in run.";
        return s;
      }
      if (!light) {
        lockout = true;
        s.status = "Trial ended. Cad cell never dropped. LOCKOUT.";
        s.hub = "One reset after you fix fire or the cell. Holding reset is how you wet-stack a basement.";
        return s;
      }
      s.ignitor = false;
      if (t < 5.6) {
        s.step = STEPS_OIL[5];
        s.stack = 280;
        s.status = "Fire proven. Blower on delay.";
        s.hub = "Same idea as gas — heat the exchanger, then move air.";
        return s;
      }
      s.blower = true;
      s.step = STEPS_OIL[6];
      let rise = 48;
      if (f === "dirty_filter") rise = 86;
      s.rise = rise;
      s.supply = s.ret + rise;
      s.stack = f === "dirty_filter" ? 620 : 410;
      if (rise > 75) {
        s.status = "Rise " + rise + " °F, stack hot. Airflow. Limit country.";
        s.hub = "Oil likes a clean filter too. High stack + high rise = not enough air over the exchanger.";
        return s;
      }
      s.ok = true;
      s.status = "Oil running. Cad " + s.cadOhm + " Ω. Rise " + rise + " °F. Stack " + s.stack + " °F.";
      s.hub = "Smoke spot, pump psi, nozzle, cad ohms. Don't 'tune' with a bigger nozzle first.";
      return s;
    }

    function hydro(s, f) {
      s.psi = f === "low_water" ? 4 : 15;
      s.lwco = f !== "low_water";
      s.wtRet = 140;
      s.step = STEPS_HYDRO[1];
      if (t < 0.4) {
        s.status = "Zone calling. Valve should stroke open.";
        s.hub = "End switch is how the boiler/circ knows the valve actually opened.";
        return s;
      }
      s.zv = true;
      s.step = STEPS_HYDRO[2];
      s.endSw = f !== "end_switch";
      if (!s.endSw) {
        s.status = "Valve powered, end switch never closed. No circ, no boiler.";
        s.hub = "Head off, watch the cam. Don't jumper the end switch and walk away — you can overheat a dead zone.";
        return s;
      }
      if (t < 1.2) {
        s.status = "End switch closed. Circulator next.";
        s.hub = "End switch is just a switch. Circ is the water.";
        s.step = STEPS_HYDRO[3];
        return s;
      }
      if (!s.lwco) {
        s.status = "LWCO OPEN. Boiler won't fire. Pressure " + s.psi + " psi.";
        s.hub = "Find the leak. Fill to ~12–15 psi cold. Don't sit on the fill valve.";
        return s;
      }
      s.circ = f !== "air_bound";
      s.step = STEPS_HYDRO[4];
      if (!s.circ) {
        s.boiler = t > 2;
        s.wtSup = s.boiler ? 186 : 140;
        s.wtRet = 140;
        s.dT = s.wtSup - s.wtRet;
        s.status = "Circ air-bound. Boiler heading for high limit. No ΔT at the zone.";
        s.hub = "Purge the circ. Isolation flanges. If the impeller spins in foam you cook the boiler.";
        return s;
      }
      if (t < 2.2) {
        s.status = "Water moving. Aquastat should call the burner if below setpoint.";
        s.hub = "High limit / low limit. We're not jumping the aquastat.";
        s.step = STEPS_HYDRO[5];
        s.dT = 4;
        s.wtSup = 144;
        return s;
      }
      s.boiler = f !== "dirty_flame";
      s.flame = s.boiler;
      s.flameUa = s.boiler ? 3.1 : 0.12;
      s.step = STEPS_HYDRO[6];
      if (!s.boiler) {
        s.status = "Boiler tried. Flame rod dirty. Burner dropped.";
        s.hub = "Same rod as a furnace. Clean it. Hydronics still burns gas.";
        return s;
      }
      s.wtSup = 160;
      s.wtRet = 140;
      s.dT = 20;
      s.ok = true;
      s.status = "Zone running. ΔT " + s.dT + " °F. Loop ~" + s.psi + " psi. Flame " + s.flameUa.toFixed(1) + " µA.";
      s.hub = "Twenty degree ΔT is a common target. Zero ΔT with a hot boiler = no flow. Huge ΔT = no circ or starved zone.";
      return s;
    }

    function coachFix() {
      const map = {
        dirty_filter: "Filter's in. Rise should come back to nameplate.",
        open_press: "Switch replaced / draft proven. Don't leave a jumper.",
        cracked_hose: "New silicone hose. Watch the switch close on the next call.",
        dirty_flame: "Rod cleaned. Looking for 1–5 µA.",
        no_hsi: "New ignitor. Ohm it before you button the door.",
        cad_dark: "Cell wiped and seated. Under 1600 Ω in the light.",
        no_nozzle: "Nozzle/pump set. 100 psi unless the gun says otherwise.",
        end_switch: "End switch closing with the valve. Circ should run.",
        air_bound: "Purged. Impeller in water, not foam.",
        low_water: "Filled. LWCO closed. Find why it was empty.",
      };
      return map[fault] || "Cleared.";
    }

    function fixButtons() {
      const byPlant = {
        gas: [
          ["dirty_filter", "Replace filter"],
          ["open_press", "Prove draft / replace switch"],
          ["cracked_hose", "Replace inducer hose"],
          ["dirty_flame", "Clean flame rod"],
          ["no_hsi", "Replace HSI"],
        ],
        oil: [
          ["dirty_filter", "Replace filter"],
          ["cad_dark", "Clean cad cell"],
          ["no_nozzle", "Replace nozzle / set 100 psi"],
          ["no_hsi", "Fix spark"],
        ],
        hydro: [
          ["end_switch", "Repair zone-valve end switch"],
          ["air_bound", "Purge circulator"],
          ["low_water", "Fill loop / reset LWCO"],
          ["dirty_flame", "Clean flame rod"],
        ],
      };
      return (byPlant[plant] || [])
        .map(function (b) {
          const armed = fault === b[0];
          return (
            '<button type="button" class="btn' +
            (armed ? " primary" : "") +
            '" data-fix="' +
            b[0] +
            '"' +
            (armed ? "" : " disabled") +
            ">" +
            b[1] +
            "</button>"
          );
        })
        .join("");
    }

    let mounted = false;

    function mount() {
      host.innerHTML =
        '<div class="fn-lab">' +
        '<header class="fn-head">' +
        '<button type="button" class="btn" id="fn-hub">Shop floor</button>' +
        '<div class="brand-bar"><div class="brand-mark">' +
        ((window.LtBrand && window.LtBrand.mark) || "LT") +
        '</div><div class="brand-word"><strong>HEAT PLANT</strong><span>Gas · oil · hydronic — sequence, not a cartoon</span></div></div>' +
        '<button type="button" class="btn primary" id="fn-call">Call heat</button>' +
        '<button type="button" class="btn" id="fn-jump">Jump gas valve</button></header>' +
        '<div class="fn-plants" id="fn-plants"></div>' +
        '<label class="fn-fault">Fault <select id="fn-fault"></select></label>' +
        '<ol class="fn-steps" id="fn-steps"></ol>' +
        '<div class="fn-lamps" id="fn-lamps"></div>' +
        '<div class="fn-meters" id="fn-meters"></div>' +
        '<p class="fn-status" id="fn-status"></p>' +
        '<p class="fn-hub" id="fn-hubtalk"></p>' +
        '<div class="fn-fixes" id="fn-fixes"></div></div>';

      host.querySelector("#fn-hub").onclick = function () {
        if (onHub) onHub();
      };
      host.querySelector("#fn-plants").onclick = function (e) {
        const b = e.target.closest("[data-plant]");
        if (!b) return;
        plant = b.getAttribute("data-plant");
        fault = "none";
        calling = false;
        t = 0;
        lockout = false;
        jumped = false;
        spoiled = false;
        jumpNote = "";
        fillFaults();
        paint();
      };
      host.querySelector("#fn-fault").onchange = function () {
        fault = host.querySelector("#fn-fault").value;
        calling = false;
        t = 0;
        lockout = false;
        jumped = false;
        spoiled = false;
        jumpNote = "";
        paint();
      };
      host.querySelector("#fn-call").onclick = function () {
        calling = !calling;
        t = 0;
        lockout = false;
        jumped = false;
        spoiled = false;
        jumpNote = "";
        if (calling && window.LtHaptic) window.LtHaptic.kick();
        else if (window.LtHaptic) window.LtHaptic.stop();
        lastKick = calling;
        paint();
      };
      host.querySelector("#fn-jump").onclick = function () {
        const proved = plant === "gas" && calling && t >= 1.3 && fault !== "open_press" && fault !== "cracked_hose";
        if (!proved) {
          jumped = true;
          lockout = true;
          calling = false;
          if (window.LtHaptic) window.LtHaptic.bad();
          paint();
          return;
        }
        const status = host.querySelector("#fn-status");
        const talk = host.querySelector("#fn-hubtalk");
        spoiled = true;
        jumpNote = "The pressure switch already proved. Jumping the valve anyway is not a win. Let the board open it after the ignitor.";
        if (status) status.textContent = jumpNote;
        if (talk) talk.textContent = "Inducer, prove the switch, ignitor, gas valve, blower. A jumper is not the sequence.";
        if (window.LtHaptic) window.LtHaptic.bad();
      };
      host.querySelector("#fn-fixes").onclick = function (e) {
        const b = e.target.closest("[data-fix]");
        if (b) {
          if (b.getAttribute("data-fix") !== fault) return;
          fault = "none";
          t = 0;
          lockout = false;
          calling = true;
          lastKick = true;
          if (onXp) onXp(15);
          if (window.LtHaptic) window.LtHaptic.ok();
          fillFaults();
          paint();
          host.querySelector("#fn-status").textContent = coachFix() + " Calling again.";
          return;
        }
        if (e.target.id === "fn-reset") {
          lockout = false;
          t = 0;
          calling = false;
          jumped = false;
          spoiled = false;
          jumpNote = "";
          if (window.LtHaptic) window.LtHaptic.warn();
          paint();
        }
      };
      mounted = true;
      fillPlants();
      fillFaults();
    }

    function fillPlants() {
      host.querySelector("#fn-plants").innerHTML = PLANTS.map(function (p) {
        return (
          '<button type="button" class="fn-plant' +
          (plant === p.id ? " on" : "") +
          '" data-plant="' +
          p.id +
          '"><strong>' +
          p.name +
          "</strong><span>" +
          p.blurb +
          "</span></button>"
        );
      }).join("");
    }

    function fillFaults() {
      const sel = host.querySelector("#fn-fault");
      const faults = FAULTS[plant];
      sel.innerHTML = faults
        .map(function (x) {
          return (
            '<option value="' +
            x.id +
            '"' +
            (fault === x.id ? " selected" : "") +
            ">" +
            x.name +
            "</option>"
          );
        })
        .join("");
    }

    function paint() {
      if (!mounted) mount();
      fillPlants();
      const s = sim(0);
      const steps = plant === "gas" ? STEPS_GAS : plant === "oil" ? STEPS_OIL : STEPS_HYDRO;
      host.querySelector("#fn-steps").innerHTML = steps
        .map(function (name) {
          const on = s.step === name || (s.ok && name === steps[steps.length - 1]);
          return "<li class=\"" + (on ? "on" : "") + (s.step === "LOCKOUT" ? " lock" : "") + "\">" + name + "</li>";
        })
        .join("");
      const lamps =
        plant === "hydro"
          ? [
              ["Zone valve", s.zv],
              ["End switch", s.endSw],
              ["Circ", s.circ],
              ["Boiler", s.boiler],
            ]
          : plant === "oil"
            ? [
                ["Motor", s.burnerMotor],
                ["Ignitor", s.ignitor],
                ["Oil", s.oil],
                ["Cad prove", s.flame],
                ["Blower", s.blower],
              ]
            : [
                ["Inducer", s.inducer],
                ["Press sw", s.press],
                ["HSI", s.ignitor],
                ["Gas valve", s.gas],
                ["Flame", s.flame],
                ["Blower", s.blower],
              ];
      host.querySelector("#fn-lamps").innerHTML =
        lamps
          .map(function (L) {
            return '<span class="fn-lamp' + (L[1] ? " live" : "") + '">' + L[0] + "</span>";
          })
          .join("") + (lockout ? '<span class="fn-lamp lock">LOCKOUT</span>' : "");
      const meters =
        plant === "hydro"
          ? [
              ["Supply water", s.wtSup.toFixed(0) + " °F"],
              ["Return water", s.wtRet.toFixed(0) + " °F"],
              ["ΔT", s.dT.toFixed(0) + " °F"],
              ["Loop", s.psi.toFixed(0) + " psi"],
              ["LWCO", s.lwco ? "CLOSED" : "OPEN"],
              ["Flame", s.flameUa.toFixed(2) + " µA"],
            ]
          : plant === "oil"
            ? [
                ["Temp rise", s.rise.toFixed(0) + " °F"],
                ["Supply air", s.supply.toFixed(0) + " °F"],
                ["Cad cell", s.cadOhm > 10000 ? Math.round(s.cadOhm / 1000) + " kΩ" : s.cadOhm + " Ω"],
                ["Stack", s.stack.toFixed(0) + " °F"],
                ["Flame", s.flame ? "LIGHT" : "DARK"],
              ]
            : [
                ["Temp rise", s.rise.toFixed(0) + " °F"],
                ["Supply air", s.supply.toFixed(0) + " °F"],
                ["Return air", s.ret.toFixed(0) + " °F"],
                ["Flame rod", s.flameUa.toFixed(2) + " µA"],
                ["Pressure sw", s.press ? "CLOSED" : "OPEN"],
              ];
      host.querySelector("#fn-meters").innerHTML = meters
        .map(function (m) {
          return "<div><span>" + m[0] + "</span><strong>" + m[1] + "</strong></div>";
        })
        .join("");
      host.querySelector("#fn-status").textContent = jumpNote || s.status;
      host.querySelector("#fn-hubtalk").textContent = jumpNote
        ? "Inducer, prove the switch, ignitor, gas valve, blower. A jumper is not a win."
        : s.hub;
      host.querySelector("#fn-call").textContent = calling ? "Drop the call" : "Call heat";
      host.querySelector("#fn-fixes").innerHTML =
        fixButtons() + (lockout ? '<button type="button" class="btn" id="fn-reset">Reset control</button>' : "");
      if (s.ok && lastKick && !spoiled && !jumped) {
        lastKick = false;
        if (onXp) onXp(10);
        if (window.CurriculumTrain) window.CurriculumTrain.stamp("furnace");
        if (window.LtHaptic) window.LtHaptic.land();
      }
    }

    function tick() {
      if (!calling && !lockout) return;
      sim(0.35);
      paint();
    }

    paint();
    timer = setInterval(tick, 350);
    return {
      stop: function () {
        clearInterval(timer);
      },
    };
  }

  global.FurnaceLab = {
    start: function (host, opts) {
      host.innerHTML = "";
      return FurnaceLab(host, opts || {});
    },
  };
})(window);
