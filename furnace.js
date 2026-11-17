/* Heat plant lab — gas furnace, oil burner, hydronics.
   Sequence + prove points + field faults. Not a combustion cartoon. */
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
    if (!st) { st = document.createElement("style"); st.id = id; document.head.appendChild(st); }
    st.textContent = css;
    document.head.appendChild(st);
    function bump() { if (st.parentNode) document.head.appendChild(st); }
    requestAnimationFrame(bump);
    setTimeout(bump, 80);
    setTimeout(bump, 400);
  }

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
    floorFit("fn-floor-fit", [
      "@media (max-width:720px){",
      "#furnace-root{padding-top:4px!important}",
      "#furnace-root .fn-frame{display:block!important}",
      "#furnace-root .fn-shot{display:block!important;width:100%!important;height:112px!important;min-height:96px!important;max-height:112px!important;object-fit:contain!important;object-position:center center!important;background:#10141a!important}",
      "#furnace-root .fn-frame figcaption{padding:2px 8px!important}",
      "#furnace-root .fn-lamps{display:none!important}",
      "#furnace-root .fn-meters{gap:2px!important}",
      "#furnace-root .fn-meters div{padding:2px 4px!important}",
      "body:has(#screen-furnace.active) #furnace-root .fn-dock{padding-right:148px!important;box-sizing:border-box!important}",
      "body:has(#screen-furnace.active) .ld-replay{top:8px!important;right:8px!important;bottom:auto!important;left:auto!important;z-index:20!important}",
      "}",
      "@media (min-width:721px){",
      "body:has(#screen-furnace.active) .ld-replay{top:auto!important;bottom:168px!important;right:16px!important;left:auto!important}",
      "}",
    ].join(""));
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
    let seqAt = 0;
    let held = null;
    let saidKvl = false;

    function injectPfCss() {
      if (document.getElementById("fn-pf-next")) return;
      const st = document.createElement("style");
      st.id = "fn-pf-next";
      st.textContent = [
        "#furnace-root,#furnace-root .fn-lab{max-width:100%;min-width:0;box-sizing:border-box}",
        "#furnace-root{padding:8px 10px 16px}",
        "#furnace-root .fn-lab{display:flex;flex-direction:column;gap:6px}",
        "#furnace-root .fn-dock{order:0}#furnace-root .fn-head{order:1}#furnace-root .fn-plants{order:2}#furnace-root .fn-fault{order:3}#furnace-root .fn-frame{order:4}#furnace-root .fn-steps{order:5}#furnace-root .fn-fixes{order:6}#furnace-root .fn-lamps{order:7}#furnace-root .fn-meters{order:8}#furnace-root .fn-status{order:9}#furnace-root .fn-hub{order:10}",
        "#furnace-root .fn-dock{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;justify-content:flex-end;margin:0;max-width:100%;position:relative;z-index:6}",
        "#furnace-root .fn-head,#furnace-root .fn-fixes,#furnace-root .fn-lamps{display:flex;flex-wrap:wrap;gap:8px;align-items:center;max-width:100%}",
        "#furnace-root .fn-plants{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch;max-width:100%}",
        "#furnace-root .fn-head .brand-bar{margin:0;flex:1 1 200px;min-width:0;justify-content:flex-start}",
        "#furnace-root .fn-head .brand-word{min-width:0}",
        "#furnace-root .fn-head .brand-word span{letter-spacing:0.04em;font-size:11px;line-height:1.3;white-space:normal}",
        "#furnace-root .fn-plant{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;flex:1 1 160px;min-width:0;max-width:100%;min-height:44px;padding:8px 10px;box-sizing:border-box;white-space:normal;text-align:left;border:1px solid #3a4550;border-radius:10px;background:#1c2126;color:#fff}",
        "#furnace-root .fn-plant.on{border-color:#e8c450}",
        "#furnace-root .fn-plant strong{font-size:14px}",
        "#furnace-root .fn-plant span{display:block;font-size:12px;line-height:1.3;white-space:normal}",
        "#furnace-root .fn-head .btn,#furnace-root .fn-fixes .btn{margin-left:0;min-height:44px;position:relative;z-index:2}",
        "#furnace-root .fn-fault{margin:4px 0}",
        "#furnace-root .fn-fault select{margin-top:4px;max-width:100%}",
        "#furnace-root .fn-steps{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:4px 2px 8px;list-style:none;max-width:100%;overflow:visible}",
        "#furnace-root .fn-steps li{margin:0;flex:0 0 auto;max-width:none}",
        "#furnace-root .fn-seq{max-width:none;min-height:44px;padding:8px 12px;box-sizing:border-box;border-radius:999px;border:1px solid #3a4550;background:#1c2126;color:#fff;font:600 13px/1.2 'IBM Plex Sans',system-ui,sans-serif;white-space:nowrap}",
        "#furnace-root .fn-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(108px,1fr));gap:6px;max-width:100%}",
        "#furnace-root .fn-meters div{min-width:0;background:#1c2126;border-radius:8px;padding:4px 6px}",
        "#furnace-root .fn-meters span{display:block;color:#8b98a5;font-size:10px;letter-spacing:0.04em;text-transform:uppercase}",
        "#furnace-root .fn-meters strong{display:block;font-size:16px;font-variant-numeric:tabular-nums}",
        "#furnace-root .fn-lamp{border:1px solid #3a4550;border-radius:999px;padding:4px 8px;font-size:12px}",
        "#furnace-root .fn-status,#furnace-root .fn-hub{margin:4px 0;line-height:1.35;max-width:100%}",
        "#furnace-root .fn-frame{margin:0;width:100%;max-width:100%;background:#10141a;border:1px solid #2c3844;border-radius:12px;overflow:hidden}",
        "#furnace-root .fn-shot{display:block;width:100%;max-width:100%;height:min(28vh,220px);max-height:min(28vh,220px);object-fit:contain;object-position:center center;background:#10141a}",
        "#furnace-root .fn-frame figcaption{margin:0;padding:6px 10px;color:#8b98a5;font-size:12px}",
        "body:has(#screen-furnace.active) #pf-coach-bar,body:has(#screen-furnace.active) #pf-coach-open{display:none !important}",
        "body:has(#screen-furnace.active) #furnace-root .fn-dock .walk-chip{position:relative !important;inset:auto !important;left:auto !important;right:auto !important;top:auto !important;bottom:auto !important;width:max-content !important;max-width:100% !important;margin:0 auto 0 0 !important;z-index:6}",
        "body:has(#screen-furnace.active) #furnace-root .fn-dock #form-badge{position:relative !important;inset:auto !important;left:auto !important;right:auto !important;top:auto !important;bottom:auto !important;width:auto !important;max-width:100%;margin:0 !important;z-index:6;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:4px 8px;background:#1c2126;color:#fff;border:1px solid #3a4550;border-radius:10px;box-sizing:border-box}",
        "body:has(#screen-furnace.active) #form-badge.mini .form-badge-extra{display:none !important}",
        "body:has(#screen-furnace.active) #form-badge .form-badge-extra{display:flex;flex-wrap:wrap;align-items:center;gap:6px}",
        "body:has(#screen-furnace.active) #form-badge button{margin:0;min-height:36px}",
        "body:has(#screen-furnace.active) #form-badge em{font-style:normal;font-size:12px}",
        "@media (max-width:720px){body:has(#screen-furnace.active) #toast-host{display:none !important}body:has(#screen-furnace.active) #furnace-root .fn-dock{justify-content:flex-start;padding-right:148px!important;box-sizing:border-box}body:has(#screen-furnace.active) .ld-replay{top:8px!important;bottom:auto!important;left:auto!important;right:8px!important}body:has(#screen-furnace.active) .drip-ear{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important;width:min(148px,40vw)!important;max-height:44px!important}}",
        "@media (max-height:800px){#furnace-root .fn-shot{height:min(22vh,168px);max-height:min(22vh,168px)}}",
        "@media (min-width:721px){body:has(#screen-furnace.active) .ld-replay{bottom:78px!important;right:8px!important;top:auto!important;left:auto!important}}",
        "@media (max-width:720px){#furnace-root{padding:4px 8px 8px;max-height:100dvh;overflow:hidden}#screen-furnace.screen.active{height:100dvh;max-height:100dvh;overflow:hidden}#furnace-root .fn-plants{flex-wrap:nowrap}#furnace-root .fn-plant{flex:1 1 0;min-width:0;padding:4px 6px;min-height:0}#furnace-root .fn-plant span{display:none}#furnace-root .fn-shot{height:112px!important;min-height:96px!important;max-height:112px!important;object-fit:contain!important}#furnace-root .fn-steps{flex-wrap:wrap;overflow:visible;max-height:none;gap:4px}#furnace-root .fn-seq{min-height:26px;padding:2px 6px;font-size:11px}#furnace-root .fn-meters div{padding:2px 4px}#furnace-root .fn-fault{margin:0}#furnace-root .fn-meters{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}#furnace-root .fn-meters strong{font-size:13px}#furnace-root .fn-hub{display:none}#furnace-root .fn-status{margin:2px 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}",
        "@media (orientation:landscape) and (max-height:520px){",
        "#screen-furnace.screen.active,#furnace-root{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}",
        "#furnace-root{padding:4px 6px!important;box-sizing:border-box!important}",
        "#furnace-root .fn-lab{display:grid!important;grid-template-columns:minmax(0,1.15fr) minmax(230px,0.85fr)!important;grid-template-rows:auto auto minmax(0,1fr) auto!important;height:100%!important;max-height:100%!important;gap:4px!important;overflow:hidden!important}",
        "#furnace-root .fn-dock{display:none!important}",
        "#furnace-root .fn-head{grid-column:2!important;grid-row:1!important;min-height:0!important}",
        "#furnace-root .fn-head .brand-word span{display:none!important}",
        "#furnace-root .fn-plants{grid-column:2!important;grid-row:2!important}",
        "#furnace-root .fn-fault{grid-column:2!important}",
        "#furnace-root .fn-frame{grid-column:1!important;grid-row:1 / span 4!important;min-height:0!important;height:100%!important;display:flex!important;flex-direction:column!important;margin:0!important}",
        "#furnace-root .fn-shot{flex:1 1 auto!important;width:100%!important;height:auto!important;max-height:none!important;min-height:0!important;object-fit:contain!important;object-position:center!important}",
        "#furnace-root .fn-steps{grid-column:2!important;overflow-x:auto!important;flex-wrap:nowrap!important;max-height:64px!important}",
        "#furnace-root .fn-meters,#furnace-root .fn-status{grid-column:2!important}",
        "#furnace-root .fn-hub,#furnace-root .fn-fixes,#furnace-root .fn-lamps{display:none!important}",
        "}",
        ".pf-next{outline:2px solid #e8c450;outline-offset:-2px}"
      ].join("");
      document.head.appendChild(st);
    }

    function stepList() {
      return plant === "gas" ? STEPS_GAS : plant === "oil" ? STEPS_OIL : STEPS_HYDRO;
    }

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
        limitOpen: false,
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
        s.status = "Pressure switch open. That stops the sequence. Inducer is running. No ignition.";
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
      if (f === "no_hsi") {
        s.ignitor = false;
        s.gas = false;
        s.step = STEPS_GAS[4];
        s.status = "HSI open. Board never gets glow. Valve stays shut.";
        s.hub = "Ohm the ignitor cold. Typically 40–90 Ω. Infinite = replace. An open ignitor stops the sequence before the gas valve.";
        return s;
      }
      s.ignitor = t < 4.6;
      s.gas = true;
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
          s.limitOpen = true;
          s.step = STEPS_GAS[8];
          s.status = "High limit OPEN. That stops the sequence. Burners off. Blower keeps running. Do not jumper the limit.";
          s.hub = "An open limit stops the call. Fix the filter or the blower. Do not jumper the limit and leave it.";
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
    let alive = true;

    function mount() {
      injectPfCss();
      landTurn("screen-furnace");
      host.innerHTML =
        '<div class="fn-lab">' +
        '<div class="fn-dock" id="fn-dock"></div>' +
        '<header class="fn-head">' +
        '<button type="button" class="btn" id="fn-hub">Shop floor</button>' +
        '<div class="brand-bar"><div class="brand-mark">' +
        ((window.LtBrand && window.LtBrand.mark) || "LT") +
        '</div><div class="brand-word"><strong>HEAT PLANT</strong><span>Gas · oil · hydronic — sequence, not a cartoon</span></div></div>' +
        '<button type="button" class="btn primary" id="fn-call">Call heat</button>' +
        '<button type="button" class="btn" id="fn-jump">Jump gas valve</button></header>' +
        '<div class="fn-plants" id="fn-plants"></div>' +
        '<label class="fn-fault">Fault <select id="fn-fault"></select></label>' +
        '<figure class="fn-frame"><img id="fn-shot" class="fn-shot" alt="" src="lesson-img/gas.jpg" data-src="lesson-img/gas.jpg" /><figcaption id="fn-shot-cap">Idle</figcaption></figure>' +
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
        seqAt = 0;
        held = null;
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
        seqAt = 0;
        held = null;
        paint();
      };
      host.querySelector("#fn-call").onclick = function () {
        calling = !calling;
        t = 0;
        lockout = false;
        jumped = false;
        spoiled = false;
        jumpNote = "";
        seqAt = 0;
        held = null;
        if (calling && window.LtHaptic) window.LtHaptic.kick();
        else if (window.LtHaptic) window.LtHaptic.stop();
        lastKick = calling;
        paint();
      };
      host.querySelector("#fn-jump").onclick = function () {
        const jumpBtn = host.querySelector("#fn-jump");
        if (plant !== "gas") {
          if (window.PlayFeel) {
            window.PlayFeel.deny(jumpBtn);
            window.PlayFeel.pop(jumpBtn, "Not this plant", "bad");
            window.PlayFeel.coach(host, "Oil and hydronic do not open a gas valve here. Follow the sequence on the screen.");
          }
          return;
        }
        const proved = calling && t >= 1.3 && fault !== "open_press" && fault !== "cracked_hose";
        if (!proved) {
          jumped = true;
          lockout = true;
          calling = false;
          if (window.PlayFeel) {
            window.PlayFeel.deny(jumpBtn);
            window.PlayFeel.pop(jumpBtn, "Valve stays shut", "bad");
            window.PlayFeel.coach(host, "Pressure switch has not closed. An open switch stops the sequence. Do not jump the gas valve.");
          }
          if (window.LtHaptic) window.LtHaptic.bad();
          paint();
          return;
        }
        const status = host.querySelector("#fn-status");
        const talk = host.querySelector("#fn-hubtalk");
        spoiled = true;
        jumpNote = "The pressure switch already proved. Jumping the valve anyway is not a win. The board opens it after the ignitor.";
        if (status) status.textContent = jumpNote;
        if (talk) talk.textContent = "Call for heat, inducer, pressure switch, ignitor, gas valve, flame sense, blower. A jumper is not the sequence.";
        if (window.PlayFeel) {
          window.PlayFeel.deny(jumpBtn);
          window.PlayFeel.pop(jumpBtn, "Not a win", "bad");
          window.PlayFeel.coach(host, "The board opens the valve after the ignitor. A jumper is not the sequence.");
        }
        if (window.LtHaptic) window.LtHaptic.bad();
      };
      host.querySelector("#fn-fixes").onclick = function (e) {
        const b = e.target.closest("[data-fix]");
        if (b) {
          if (b.getAttribute("data-fix") !== fault) {
            const status = host.querySelector("#fn-status");
            if (status) status.textContent = "That part is fine. The gold one is the fault.";
            try { if (window.LtSfx && window.LtSfx.wrong) window.LtSfx.wrong(); } catch (err) {}
            return;
          }
          fault = "none";
          t = 0;
          lockout = false;
          calling = true;
          lastKick = true;
          seqAt = 0;
          held = null;
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
          seqAt = 0;
          held = null;
          if (window.LtHaptic) window.LtHaptic.warn();
          paint();
        }
      };
      host.querySelector("#fn-steps").onclick = function (e) {
        const b = e.target.closest("button[data-seq]");
        if (!b) return;
        const stepsNow = stepList();
        const i = +b.getAttribute("data-seq");
        if (!(i >= 0) || i >= stepsNow.length) return;
        const snap = sim(0);
        function stop(msg, tag) {
          const status = host.querySelector("#fn-status");
          if (status) status.textContent = msg;
          if (window.PlayFeel) {
            window.PlayFeel.deny(b);
            window.PlayFeel.pop(b, tag || "Not proved", "bad");
            window.PlayFeel.coach(host, msg);
          }
        }
        if (snap.step === "LOCKOUT") {
          stop(jumped
            ? "You jumped the gas valve before the pressure switch closed. An open switch stops the sequence."
            : "Control is locked out. The last prove that failed stops the sequence.", "Locked out");
          return;
        }
        if (!calling) {
          stop("Call for heat first. Then inducer, pressure switch, ignitor, gas valve, flame sense, blower.", "No call");
          return;
        }
        if (i > seqAt) {
          let msg = "Prove " + stepsNow[seqAt] + " before " + stepsNow[i] + ".";
          const pressAt = STEPS_GAS.indexOf("Pressure switch");
          const hsiAt = STEPS_GAS.indexOf("HSI heat-up");
          const atNow = STEPS_GAS.indexOf(snap.step);
          if (plant === "gas" && snap.limitOpen) msg = "Limit is open. That stops the sequence. The blower stays on.";
          else if (plant === "gas" && (fault === "open_press" || fault === "cracked_hose") && i > pressAt) msg = "Pressure switch is open. That stops the sequence.";
          else if (plant === "gas" && fault === "no_hsi" && atNow >= hsiAt && i >= hsiAt) msg = "Ignitor is open. The gas valve stays shut.";
          else if (plant === "gas" && fault === "dirty_flame" && snap.step === "Flame prove" && i >= STEPS_GAS.indexOf("Flame prove")) msg = "Flame is not proved. That stops the sequence.";
          stop(msg, "Not proved");
          return;
        }
        if (i < seqAt) return;
        if (plant === "gas" && snap.limitOpen && i > STEPS_GAS.indexOf("Blower on delay")) {
          stop("Limit is open. That stops the sequence. Do not keep firing.", "Limit open");
          return;
        }
        if (plant === "gas" && (fault === "open_press" || fault === "cracked_hose") && (stepsNow[i] === "Pressure switch" || i > STEPS_GAS.indexOf("Pressure switch"))) {
          stop("Pressure switch is open. That stops the sequence. Do not go to the ignitor.", "Switch open");
          return;
        }
        if (plant === "gas" && fault === "no_hsi" && stepsNow[i] === "HSI heat-up" && snap.step === "HSI heat-up") {
          stop("Ignitor is open. The gas valve stays shut.", "Ignitor open");
          return;
        }
        if (plant === "gas" && fault === "no_hsi" && i > STEPS_GAS.indexOf("HSI heat-up")) {
          stop("Ignitor is open. The gas valve stays shut.", "Ignitor open");
          return;
        }
        if (plant === "gas" && fault === "dirty_flame" && !snap.flame && snap.step === "Flame prove" && i >= STEPS_GAS.indexOf("Flame prove")) {
          stop("Flame is not proved. That stops the sequence.", "No flame");
          return;
        }
        const at = stepsNow.indexOf(snap.step);
        if (calling && at >= 0 && i > at) {
          stop("The furnace is still on " + snap.step + ". Not " + stepsNow[i] + " yet.", "Not yet");
          return;
        }
        const name = stepsNow[i];
        seqAt += 1;
        if (window.PlayFeel) window.PlayFeel.pop(b, name, "ok");
        paint();
      };
      mounted = true;
      fillPlants();
      fillFaults();
      dockFloats();
      setTimeout(dockFloats, 400);
      setTimeout(dockFloats, 900);
    }

    function dockFloats() {
      if (!alive) return;
      const dock = host.querySelector("#fn-dock");
      if (!dock) return;
      ["form-badge", "walk-chip"].forEach(function (id) {
        const el = document.getElementById(id);
        if (!el || el.parentNode === dock) return;
        el.dataset.fnDocked = "1";
        dock.appendChild(el);
      });
    }

    function undock() {
      alive = false;
      ["form-badge", "walk-chip"].forEach(function (id) {
        const el = document.getElementById(id);
        if (!el || el.dataset.fnDocked !== "1") return;
        document.body.appendChild(el);
        delete el.dataset.fnDocked;
      });
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

    function shotSrc() {
      if (plant === "hydro") return "lesson-img/boiler.jpg";
      if (plant === "gas") return "lesson-img/gas.jpg";
      return "";
    }

    function syncShot(stepName) {
      const img = host.querySelector("#fn-shot");
      const cap = host.querySelector("#fn-shot-cap");
      if (cap) cap.textContent = stepName || "Idle";
      if (!img) return;
      const next = shotSrc();
      if (!next || img.getAttribute("data-src") === next) return;
      img.setAttribute("data-src", next);
      img.src = next;
    }

    function coachLine(s) {
      if (jumpNote) return "The board opens the valve after the ignitor. A jumper is not the sequence.";
      if (lockout && jumped) return "You jumped the gas valve before the pressure switch closed. An open switch stops the sequence.";
      if (lockout) return s.hub;
      if (!calling) return "Next: call for heat.";
      if (plant === "gas" && (fault === "open_press" || fault === "cracked_hose") && s.inducer && !s.press)
        return "Pressure switch is open. That stops the sequence.";
      if (plant === "gas" && fault === "no_hsi" && s.step === "HSI heat-up")
        return "Ignitor is open. The gas valve stays shut.";
      if (plant === "gas" && s.limitOpen)
        return "Limit is open. That stops the sequence. The blower stays on.";
      if (plant === "gas" && fault === "dirty_flame" && s.step === "Flame prove" && !s.flame)
        return "Flame is not proved. That stops the sequence.";
      const stepsNow = stepList();
      if (seqAt < stepsNow.length) return "Next: " + stepsNow[seqAt] + ".";
      return "Sequence proved.";
    }

    function paint() {
      if (!mounted) mount();
      fillPlants();
      let s = sim(0);
      if (s.step === "LOCKOUT" && held) {
        const msg = s.status;
        const talk = s.hub;
        s = Object.assign({}, held, {
          step: "LOCKOUT",
          ok: false,
          status: msg,
          hub: talk,
          gas: false,
          flame: false,
          flameUa: 0,
        });
      } else if (s.step !== "LOCKOUT") {
        held = Object.assign({}, s);
      }
      const steps = stepList();
      host.querySelectorAll(".pf-next").forEach(function (el) { el.classList.remove("pf-next"); });
      host.querySelector("#fn-steps").innerHTML = steps
        .map(function (name, i) {
          const on = s.step === name || (s.ok && name === steps[steps.length - 1]);
          const pressAt = STEPS_GAS.indexOf("Pressure switch");
          const hsiAt = STEPS_GAS.indexOf("HSI heat-up");
          const flameAt = STEPS_GAS.indexOf("Flame prove");
          const blocked = plant === "gas" && (
            ((fault === "open_press" || fault === "cracked_hose") && i >= pressAt && !s.press) ||
            (fault === "no_hsi" && s.step === "HSI heat-up" && i >= hsiAt) ||
            (fault === "dirty_flame" && s.step === "Flame prove" && !s.flame && i >= flameAt) ||
            (s.limitOpen && i > STEPS_GAS.indexOf("Blower on delay"))
          );
          const next = !lockout && !blocked && i === seqAt && seqAt < steps.length ? " pf-next" : "";
          return '<li class="' + (on ? "on" : "") + (s.step === "LOCKOUT" ? " lock" : "") + '">' +
            '<button type="button" class="fn-seq' + next + '" data-seq="' + i + '">' + name + "</button></li>";
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
                ["Limit", s.limitOpen ? "OPEN" : "CLOSED"],
              ];
      host.querySelector("#fn-meters").innerHTML = meters
        .map(function (m) {
          return "<div><span>" + m[0] + "</span><strong>" + m[1] + "</strong></div>";
        })
        .join("");
      host.querySelector("#fn-status").textContent = jumpNote || s.status;
      host.querySelector("#fn-hubtalk").textContent = jumpNote
        ? "Call for heat, inducer, pressure switch, ignitor, gas valve, flame sense, blower. A jumper is not the sequence."
        : s.hub;
      host.querySelector("#fn-call").textContent = calling ? "Drop the call" : "Call heat";
      syncShot(s.step === "LOCKOUT" && held ? held.step : s.step);
      host.querySelector("#fn-fixes").innerHTML =
        fixButtons() + (lockout ? '<button type="button" class="btn" id="fn-reset">Reset control</button>' : "");
      if (s.ok && lastKick && !spoiled && !jumped) {
        lastKick = false;
        if (onXp) onXp(10);
        if (window.CurriculumTrain) window.CurriculumTrain.stamp("furnace");
        if (window.LtHaptic) window.LtHaptic.land();
      }
      if (window.PlayFeel) window.PlayFeel.coach(host, coachLine(s));
      var openV = calling && !lockout && (
        (plant === "gas" && (fault === "open_press" || fault === "cracked_hose") && s.inducer && !s.press && t >= 1.3) ||
        (plant === "gas" && s.limitOpen) ||
        (plant === "hydro" && fault === "end_switch" && t >= 0.4 && !s.endSw) ||
        (plant === "hydro" && fault === "low_water" && t >= 1.2 && !s.lwco)
      );
      if (openV && !saidKvl) {
        saidKvl = true;
        if (global.LtDrip) global.LtDrip.say("fn.kvl");
      } else if (!openV) {
        saidKvl = false;
      }
      dockFloats();
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
        undock();
      },
    };
  }

  global.FurnaceLab = {
    start: function (host, opts) {
      ["form-badge", "walk-chip"].forEach(function (id) {
        const el = host.querySelector("#" + id);
        if (el) document.body.appendChild(el);
      });
      host.innerHTML = "";
      return FurnaceLab(host, opts || {});
    },
  };
})(window);
