/* Recovery room. The bench, then the drills that belong in that bay. */
(function () {
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
  var STATIONS = [
    { id: "bench", name: "Recovery bench", line: "Pull the charge into a DOT tank. 0 psig on a split. Never vent." },
    { id: "n2", name: "Nitrogen hold", line: "Pressure-test with nitrogen. A falling needle is a leak. Oxygen is not a test gas." },
    { id: "decay", name: "Decay test", line: "Pull a vacuum, valve off the pump, and watch the microns. A leak does not level off." },
    { id: "weigh", name: "Weigh the charge", line: "The condenser already holds the 15 ft. This lineset is 40 ft. Add only the extra." },
    { id: "charge", name: "Charge it", line: "Same 75°F day. Each refrigerant sits at a different pressure. The scale, not the needle, says how much went in." },
    { id: "leak", name: "Find the leak", line: "A sniffer screams at the whole cabinet. Soap shows you the joint." },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  var activeStop = null;

  function floorFit(id, css) {
    var st = document.getElementById(id);
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

  function start(root, opts) {
    landTurn("screen-recover");
    floorFit("rr-floor-fit", [
      "#screen-recover.screen.active:has(#rr-hub),#screen-recover.screen.active:has(#rr-back){display:block!important;height:auto!important;min-height:100%!important;max-height:none!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}",
      "#recover-root:has(#rr-hub),#recover-root:has(#rr-back){display:block!important;flex:none!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:visible!important;padding-bottom:24px!important}",
      "#recover-root:has(#rr-back) .hub-head{margin:4px 8px 0!important}",
      "#recover-root:has(#rr-hub) .rr-lead,#recover-root:has(#rr-back) .rr-lead{display:block!important;-webkit-line-clamp:unset!important;max-height:none!important;overflow:visible!important;margin:6px 10px!important}",
      "#recover-root:has(#rr-back) .rc-board{display:flex!important;flex-direction:column!important;height:auto!important;max-height:none!important;overflow:visible!important;width:100%!important}",
      "#recover-root:has(#rr-back) .rc-play{order:1!important;height:auto!important;max-height:none!important;overflow:visible!important;display:block!important}",
      "#recover-root:has(#rr-back) .rc-stage{position:relative!important;height:auto!important;min-height:0!important;overflow:visible!important;display:block!important}",
      "#recover-root:has(#rr-back) .rc-unit-img{display:block!important;width:100%!important;height:auto!important;min-height:180px!important;max-height:none!important;object-fit:contain!important}",
      "#recover-root:has(#rr-back) .rc-controls{height:auto!important;overflow:visible!important}",
      "#recover-root:has(#rr-back) .rc-bin{order:2!important;position:relative!important;z-index:2!important;height:auto!important;max-height:118px!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;border-top:2px solid #CE0034!important}",
      "#recover-root:has(#rr-back) .rc-bin .eyebrow{display:none!important}",
      "#recover-root:has(#rr-back) .rc-bin .rc-piece{flex:0 0 86px!important;width:86px!important}",
      "#recover-root .rr-shot>.btn{position:absolute!important;z-index:5!important;min-height:40px!important}",
      "#recover-root .rc-next,#recover-root .mach-switch.rc-next{outline:2px solid #e8c450!important;box-shadow:0 0 0 4px rgba(232,196,80,.35)!important}",
      "body:has(#screen-recover.active) .walk-chip,body:has(#screen-recover.active) .ld-replay,body:has(#screen-recover.active) #drip-ear,body:has(#screen-recover.active) .version-strip{display:none!important}",
      "body:has(#screen-recover.active) .hub-ai-fab{top:8px!important;bottom:auto!important;left:8px!important;right:auto!important;z-index:30!important;max-width:112px!important;padding:6px 8px!important}",
      "body:has(#screen-recover.active) .hub-ai-panel{top:52px!important;left:8px!important;right:auto!important;bottom:auto!important;width:min(320px,calc(100vw - 16px))!important;max-height:min(42dvh,380px)!important}",
      "body:has(#screen-recover.active) .pf-coach,body:has(#screen-recover.active) #pf-coach-bar{top:52px!important;bottom:auto!important;left:8px!important;right:auto!important;width:min(200px,70vw)!important;max-height:72px!important;z-index:28!important}",
      "#recover-root .rc-bin{position:relative!important;z-index:8!important;padding-right:8px!important}",
      "#recover-root .rr-joints{position:static!important;display:flex!important;gap:8px!important;flex-wrap:wrap!important;padding:8px 0 0!important}",
      "#recover-root:has(#rr-back) .rc-scale-face{max-width:168px!important}",
      "#recover-root:has(#rr-back) .rc-scale-face strong{font-size:20px!important}",
      "#recover-root:has(#rr-back) .rc-controls{flex:0 0 auto!important}",
      "#recover-root .rc-digi{width:148px!important;max-width:46vw!important;margin:0!important;padding:4px 6px 0!important;background:#07090c!important;color:#e7eef4!important;font-family:ui-monospace,monospace!important;border-radius:4px!important;border:2px solid #12161b!important;box-shadow:inset 0 0 0 1px #2a323a!important}",
      "#recover-root .rc-digi-top{font-size:9px!important;letter-spacing:.06em!important;color:#c5ced6!important}",
      "#recover-root .rc-digi-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important}",
      "#recover-root .rc-digi small{display:block!important;font-size:8px!important}",
      "#recover-root .rc-digi .lo strong{display:block!important;color:#4db2ff!important;font-size:16px!important;line-height:1!important}",
      "#recover-root .rc-digi .hi strong{display:block!important;color:#ff5a45!important;font-size:16px!important;line-height:1!important}",
      "#recover-root .rc-digi-hoses{display:flex!important;justify-content:space-between!important;height:28px!important;padding:4px 14px 0!important}",
      "#recover-root .rc-digi-hoses i{display:block!important;width:8px!important;height:28px!important;border-radius:4px!important}",
      "#recover-root .rc-digi-hoses .b{background:#3d8bfd!important}#recover-root .rc-digi-hoses .r{background:#e23b4a!important}#recover-root .rc-digi-hoses .y{background:#e8c450!important}",
      "#recover-root:has(#rr-back) .rc-bin .btn{flex:0 0 84px!important;width:84px!important;min-height:0!important;padding:4px!important;font-size:11px!important}",
      "#recover-root:has(#rr-back) .rc-bin .btn.rc-next{outline:2px solid #e8c450!important}",
      "#recover-root .rr-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;padding:8px 8px 72px!important;max-width:100%!important}",
      "body:has(#screen-recover.active) #toast-host{top:6px!important;bottom:auto!important;left:8px!important;right:auto!important;width:max-content!important;max-width:42vw!important;max-height:26px!important;overflow:hidden!important;transform:none!important;z-index:40!important;pointer-events:none!important}",
      "#recover-root .rr-shot{position:relative!important}",
      "#recover-root .rr-joints{position:absolute!important;inset:0!important;display:block!important;padding:0!important;pointer-events:none!important}",
      "#recover-root .rr-joints .btn{position:absolute!important;pointer-events:auto!important;min-height:34px!important;padding:4px 8px!important;font-size:12px!important}",
      "@media (min-width:900px){#recover-root .rr-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;padding:12px 16px 64px!important}#recover-root:has(#rr-back) .rc-board{flex-direction:row!important}#recover-root:has(#rr-back) .rc-bin{order:0!important;flex:0 0 220px!important;width:220px!important;height:auto!important;max-height:none!important;flex-direction:column!important;overflow-x:hidden!important;overflow-y:auto!important;border-top:0!important;border-right:2px solid #CE0034!important}#recover-root:has(#rr-back) .rc-piece{width:100%!important;max-width:none!important;min-width:0!important;flex:0 0 auto!important}#recover-root:has(#rr-back) .rc-unit-img{max-height:46vh!important}#recover-root:has(#rr-back) .rc-play{order:1!important}}",
    ].join(""));
    opts = opts || {};
    if (activeStop) {
      try { activeStop(); } catch (err) {}
      activeStop = null;
    }
    if (!root) return { stop: function () {} };
    if (!document.getElementById("rr-style")) {
      var st = document.createElement("style");
      st.id = "rr-style";
      st.textContent = [
        ".rr-ticket{margin:6px 10px 0;padding:6px 10px;border-left:3px solid #e8c450;background:#1c2126;border-radius:0 10px 10px 0;color:#f3e7c8;font-size:14px;line-height:1.3}",
        ".rr-ticket b{display:block;color:#e8c450;font-size:11px;letter-spacing:.08em;text-transform:uppercase}",
        ".rr-win{margin:8px 10px 0;padding:8px 10px;border-radius:12px;background:#14301c;color:#d9ffe4;font-weight:700;display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
        ".rr-win .btn{margin-left:auto}",
        "#recover-root .rc-next,#recover-root .btn.rc-next,#recover-root .mach-switch.rc-next{outline:2px solid #e8c450;box-shadow:0 0 0 4px rgba(232,196,80,.35)}",
        "#recover-root .rr-shot>.btn{position:absolute;z-index:5;min-height:40px}",
        ".rr-baybar{height:8px;margin:8px 10px 0;border-radius:99px;background:#242a31;overflow:hidden}",
        ".rr-baybar i{display:block;height:100%;background:#7fd99a}",
        ".mode-card.rr-cleared{box-shadow:inset 4px 0 0 #7fd99a}",
        ".mode-card.rr-open{outline:2px solid #e8c450}",
        ".rc-scale-face.rr-hot{outline:2px solid #7fd99a;box-shadow:0 0 0 4px rgba(127,217,154,.28)}",
        ".rc-scale-face.rr-over{outline:2px solid #ff5a6a}",
        ".rr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;padding:12px 16px 20px}",
        ".rr-joints{position:absolute;left:8px;right:8px;bottom:8px;z-index:4;display:flex;gap:8px;flex-wrap:wrap}",
        "#recover-root .rr-grid .mode-card{text-align:left}",
        "@media (max-width:720px){#recover-root .rr-lead{margin:4px 10px 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}#recover-root .rr-grid{grid-template-columns:1fr 1fr;gap:8px;padding:8px 8px 60px}#recover-root .mode-card{padding:8px}#recover-root .mode-card h3{margin:0;font-size:15px}#recover-root .mode-card p{margin:4px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}body:has(#screen-recover.active) .walk-chip{left:8px!important;right:auto!important;bottom:6px!important;top:auto!important;width:min(148px,42vw)!important;max-height:44px!important}body:has(#screen-recover.active) .ld-replay{left:auto!important;right:8px!important;bottom:78px!important;top:auto!important}body:has(#screen-recover.active) #toast-host{top:auto!important;bottom:168px!important;left:8px!important;right:auto!important;width:min(140px,40vw)!important}}",
        "@media (min-width:721px){#recover-root .rr-grid{padding-bottom:56px}body:has(#screen-recover.active) .walk-chip{bottom:8px!important;max-height:40px!important}body:has(#screen-recover.active) .ld-replay{bottom:78px!important;right:8px!important;top:auto!important;left:auto!important}body:has(#screen-recover.active) #toast-host{top:8px!important;right:168px!important;left:auto!important;bottom:auto!important;width:min(200px,24vw)!important}}",
      ].join("");
      document.head.appendChild(st);
    }
    var station = "door";
    var timer = null;
    var note = "Tap Recovery bench.";
    var n2 = freshN2();
    var decay = freshDecay();
    var weigh = freshWeigh();
    var leak = freshLeak();
    var charge = freshCharge();

    function freshN2() {
      return { gauges: false, gas: false, wrench: false, tight: false, on: false, psi: 0, hold: false, holdFrom: 0, ticks: 0, done: false };
    }
    function freshDecay() {
      return { pump: false, gauge: false, hoses: false, capHand: false, drierHand: false, cap: false, drier: false, on: false, microns: 760000, isolated: false, ticks: 0, done: false };
    }
    function freshWeigh() {
      return { scale: false, tank: false, gauges: false, measured: false, liquid: false, oz: 0, stopped: false, done: false };
    }
    function freshLeak() {
      return { tool: "", found: false };
    }
    var CHARGE_REFS = [
      { id: "R-410A", sat: 217, suction: 118, head: 340 },
      { id: "R-22", sat: 132, suction: 68, head: 243 },
      { id: "R-134a", sat: 79, suction: 35, head: 135 },
      { id: "R-32", sat: 228, suction: 122, head: 360 },
      { id: "R-454B", sat: 200, suction: 108, head: 315 },
    ];
    function freshCharge() {
      return { jug: "", plate: false, lb: 0, lo: 0, hi: 0, on: false, run: false };
    }
    function chargeRef() {
      var i;
      for (i = 0; i < CHARGE_REFS.length; i++) if (CHARGE_REFS[i].id === charge.jug) return CHARGE_REFS[i];
      return null;
    }

    function stopTick() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function say(text) {
      note = text;
    }

    function boot() {
      stopTick();
      paint();
      if (station === "n2" || station === "decay" || station === "weigh" || station === "charge") {
        timer = setInterval(tick, 200);
      }
    }

    function tick() {
      if (station === "n2") tickN2();
      else if (station === "decay") tickDecay();
      else if (station === "weigh") tickWeigh();
      else if (station === "charge") tickCharge();
      var psi = root.querySelector("#rr-psi");
      var mic = root.querySelector("#rr-mic");
      var oz = root.querySelector("#rr-oz");
      var line = root.querySelector("#rr-note");
      if (psi) psi.textContent = Math.round(n2.psi) + " psig";
      if (mic) mic.textContent = showMic(decay.microns);
      var vn = root.querySelector("#rr-vn");
      var vt = root.querySelector("#rr-vt");
      if (vn && vt) {
        var shown = decay.microns >= 760000 ? 0 : decay.microns > 25000 ? (760000 - decay.microns) / (760000 - 25000) : 1;
        var ang = (-130 + shown * 250) * Math.PI / 180;
        vn.setAttribute("x2", (46 + Math.sin(ang) * 28).toFixed(1));
        vn.setAttribute("y2", (46 - Math.cos(ang) * 28).toFixed(1));
        vt.setAttribute("x2", (46 - Math.sin(ang) * 8).toFixed(1));
        vt.setAttribute("y2", (46 + Math.cos(ang) * 8).toFixed(1));
        var tag = root.querySelector(".rr-vac-gauge text:last-of-type");
        if (tag) tag.textContent = shown >= 1 ? "PINNED" : shown <= 0 ? "ATM" : "MOVING";
      }
      if (oz) oz.textContent = weigh.oz.toFixed(1) + " oz";
      var face = oz && oz.closest ? oz.closest(".rc-scale-face") : null;
      if (face && station === "weigh") {
        face.classList.toggle("rr-hot", weigh.liquid && weigh.oz >= 13 && weigh.oz <= 17);
        face.classList.toggle("rr-over", weigh.liquid && weigh.oz > 17);
      }
      if (line) line.textContent = note;
    }

    function showMic(m) {
      if (m >= 1000) return Math.round(m).toLocaleString() + " microns";
      return Math.round(m) + " microns";
    }

    function tickN2() {
      if (n2.done) return;
      if (n2.on && n2.gauges && n2.gas) n2.psi = Math.min(320, n2.psi + 22);
      if (!n2.hold) return;
      n2.ticks += 1;
      if (!n2.tight) n2.psi = Math.max(0, n2.psi - 14);
      if (n2.ticks < 8) return;
      if (n2.tight && n2.psi > 200 && Math.abs(n2.psi - n2.holdFrom) < 12) {
        n2.done = true;
        say("It held.");
        markClear("n2");
        paint();
      } else if (!n2.tight) {
        say("Tighten the flare.");
        buzz();
        n2.hold = false;
        n2.ticks = 0;
      }
    }

    function tickDecay() {
      if (decay.done) return;
      var floor = 240;
      if (decay.on && decay.pump && decay.gauge && decay.hoses) {
        decay.microns += (floor - decay.microns) * 0.18;
        if (!decay.isolated) {
          say(decay.microns > 500 ? "Wait under 500." : "Shut the pump off.");
        }
      }
      if (!decay.isolated) return;
      decay.ticks += 1;
      if (!decay.cap) decay.microns += 18000;
      else if (!decay.drier) decay.microns += (1400 - decay.microns) * 0.12;
      if (decay.ticks < 8) return;
      if (!decay.cap) {
        say("Seat the cap.");
        buzz();
        decay.isolated = false;
        decay.ticks = 0;
        decay.on = false;
      } else if (!decay.drier && decay.microns > 500) {
        say("Tap the new drier.");
        decay.isolated = false;
        decay.ticks = 0;
      } else if (decay.drier && decay.cap && decay.microns < 500) {
        decay.done = true;
        say("Held under 500.");
        markClear("decay");
        paint();
      }
    }

    function tickWeigh() {
      if (weigh.done || weigh.stopped || !weigh.liquid) return;
      if (!(weigh.scale && weigh.tank && weigh.gauges)) return;
      weigh.oz += 0.2;
      if (weigh.oz >= 13 && weigh.oz <= 17) { say("Stop the charge."); aimLive("#rr-stop"); }
      else if (weigh.oz > 17 && weigh.oz <= 25) { say("Hit Stop."); aimLive("#rr-stop"); }
    }

    function paint() {
      if (station === "door") paintDoor();
      else if (station === "n2") paintN2();
      else if (station === "decay") paintDecay();
      else if (station === "weigh") paintWeigh();
      else if (station === "charge") paintCharge();
      else if (station === "leak") paintLeak();
      markNext();
      bindNext();
      var fit = document.getElementById("rr-floor-fit");
      if (fit && fit.parentNode) document.head.appendChild(fit);
    }

    function markNext() {
      var id = "";
      var hot = "";
      if (station === "n2") {
        if (!n2.gauges) id = "gauges";
        else if (!n2.gas) id = "n2";
        else if (!n2.wrench) id = "wrench";
        else if (!n2.tight) hot = "#rr-flare";
        else if (!n2.done && n2.psi < 180) hot = "#rr-on";
        else if (!n2.done) hot = "#rr-hold";
      } else if (station === "decay") {
        if (!decay.hoses) id = "hoses";
        else if (!decay.pump) id = "pump";
        else if (!decay.gauge) id = "gauge";
        else if (!decay.capHand) id = "cap";
        else if (!decay.cap) hot = "#rr-cap";
        else if (!decay.drierHand) id = "drier";
        else if (!decay.drier) hot = "#rr-drier";
        else if (decay.on && decay.microns <= 500) hot = "#rr-vac";
        else if (!decay.on && decay.microns > 500) hot = "#rr-vac";
        else if (!decay.isolated) hot = "#rr-iso";
      } else if (station === "weigh") {
        if (!weigh.scale) id = "scale";
        else if (!weigh.tank) id = "tank";
        else if (!weigh.gauges) id = "gauges";
        else if (!weigh.measured) hot = "#rr-line";
        else if (!weigh.done && weigh.oz >= 13) hot = "#rr-stop";
        else if (!weigh.done) hot = "#rr-liq";
      } else if (station === "leak") {
        if (!leak.tool) id = "soap";
        else hot = '[data-joint="flare"]';
      } else if (station === "charge") {
        if (!charge.plate) hot = "#ch-plate";
        else if (!charge.jug) {
          var jug = root.querySelector('[data-jug="R-410A"]');
          if (jug) jug.classList.add("rc-next");
        } else if (!charge.run && charge.lb >= 5.4 && charge.lb <= 6.6 && !charge.on) hot = "#ch-run";
        else if (!charge.run) hot = "#ch-on";
      }
      if (id) {
        var el = root.querySelector('[data-piece="' + id + '"]');
        if (el) el.classList.add("rc-next");
      }
      if (hot) {
        var btn = root.querySelector(hot);
        if (btn) btn.classList.add("rc-next");
      }
      var bin = root.querySelector(".rc-bin");
      var next = root.querySelector(".rc-bin .rc-next");
      if (bin && next && bin.scrollWidth > bin.clientWidth + 8) {
        var left = next.offsetLeft - 8;
        if (left < bin.scrollLeft || left + next.offsetWidth > bin.scrollLeft + bin.clientWidth) bin.scrollLeft = Math.max(0, left);
      }
    }

    function aimLive(sel) {
      var el = root.querySelector(sel);
      if (!el) return;
      root.querySelectorAll(".rc-next").forEach(function (n) { if (n !== el) n.classList.remove("rc-next"); });
      el.classList.add("rc-next");
    }

    function head(title) {
      return '<header class="hub-head ic-head"><div><p class="eyebrow">Recovery room</p><h2>' + esc(title) + "</h2></div>" +
        '<button type="button" class="btn" id="rr-back">Recovery room</button></header>' +
        '<p class="rr-lead" id="rr-note">' + esc(note) + "</p>" + ticket() + winStrip();
    }

    function bayClears() {
      try { return JSON.parse(sessionStorage.getItem("rr-bay-clear") || "[]"); } catch (e) { return []; }
    }
    function markClear(id) {
      var list = bayClears();
      if (list.indexOf(id) >= 0) return false;
      list.push(id);
      try { sessionStorage.setItem("rr-bay-clear", JSON.stringify(list)); } catch (e) {}
      try { if (window.LtSfx && window.LtSfx.win) window.LtSfx.win(); } catch (e2) {}
      try { if (window.ltAddXp) window.ltAddXp(15, "bay " + id); } catch (e3) {}
      return true;
    }
    var TICKETS = {
      n2: { who: "Mrs. Alvarez", job: "If it leaks, she will not smell it." },
      decay: { who: "Overnight install", job: "Cap is loose and the drier is old." },
      weigh: { who: "40 ft lineset", job: "Factory charge covers the first 15 ft." },
      charge: { who: "Empty 3-ton", job: "Her brother left the wrong jug." },
      leak: { who: "Hiss by the unit", job: "Name the joint." },
    };
    var QUIPS = {
      n2: "She will not smell a leak. The needle stayed.",
      decay: "It held. Last night's open system is closed.",
      weigh: "15 ounces. The nameplate stayed in the condenser.",
      charge: "6.0 lb. The standing 217 was a liar.",
      leak: "The flare. Not the whole cabinet.",
    };
    function ticket() {
      var t = TICKETS[station];
      if (!t) return "";
      return '<p class="rr-ticket"><b>' + esc(t.who) + "</b> " + esc(t.job) + "</p>";
    }
    function trail(cause, joke) {
      var old = document.getElementById("rr-trail");
      if (old) old.remove();
      if (!document.getElementById("rr-trail-style")) {
        var st = document.createElement("style");
        st.id = "rr-trail-style";
        st.textContent = "#rr-trail{position:fixed;inset:0;z-index:90;background:#061206;display:flex;align-items:center;justify-content:center;padding:16px}#rr-trail .trail{width:min(440px,100%);text-align:center;color:#b6f5a8;font-family:'Courier New',Courier,monospace}#rr-trail h2{margin:8px 0 0;font-size:clamp(16px,4vw,22px);letter-spacing:.08em}#rr-trail p{margin:8px 0 0;font-size:16px;line-height:1.4;color:#d8ffcf}#rr-trail .trail-kicker{margin:0;font-size:12px;letter-spacing:.22em;color:#7dca6e}#rr-trail svg{display:block;width:100%;height:auto;margin:0 auto;background:#071407;border:4px solid #1d4a18}#rr-trail button{margin-top:14px;min-height:48px;padding:8px 16px;border:2px solid #b6f5a8;background:#102810;color:#d8ffcf;font:700 14px/1.2 'Courier New',Courier,monospace;cursor:pointer}";
        document.head.appendChild(st);
      }
      buzz();
      var el = document.createElement("div");
      el.id = "rr-trail";
      el.innerHTML =
        '<div class="trail" role="dialog" aria-modal="true">' +
        '<p class="trail-kicker">HVAC TRAIL</p>' +
        '<svg viewBox="0 0 320 180" role="img" aria-label="A cartoon tech has fallen beside a tombstone">' +
        '<rect width="320" height="180" fill="#071407"/><rect y="138" width="320" height="42" fill="#163018"/>' +
        '<rect x="24" y="58" width="60" height="80" fill="#c5cbb8"/><rect x="40" y="74" width="28" height="6" fill="#071407"/>' +
        '<rect x="118" y="96" width="22" height="18" fill="#f2e2b0"/><rect x="116" y="88" width="26" height="8" fill="#ce0034"/>' +
        '<rect x="140" y="104" width="70" height="22" fill="#2450a0"/><rect x="248" y="96" width="28" height="34" fill="#6a6a6a"/>' +
        '<rect x="254" y="78" width="16" height="18" fill="#7dca6e"/></svg>' +
        "<h2>YOU HAVE DIED OF</h2><p>" + esc(cause) + ".</p><p>" + esc(joke) + "</p>" +
        '<button type="button">Turn the page</button></div>';
      document.body.appendChild(el);
      el.querySelector("button").onclick = function () { el.remove(); };
    }
    function buzz() {
      try { if (window.LtSfx && window.LtSfx.wrong) window.LtSfx.wrong(); } catch (e) {}
    }
    function tap() {
      try { if (window.LtSfx && window.LtSfx.valve) window.LtSfx.valve(); } catch (e) {}
    }
    function nextOpen() {
      var list = bayClears();
      var i;
      for (i = 0; i < STATIONS.length; i++) if (list.indexOf(STATIONS[i].id) < 0) return STATIONS[i];
      return null;
    }
    function winStrip() {
      if (bayClears().indexOf(station) < 0) return "";
      var nxt = nextOpen();
      var all = !nxt;
      return '<div class="rr-win"><b>' + (all ? "Bay clear." : "Station clear.") + "</b>" +
        (all ? "" : '<button type="button" class="btn primary rc-next" id="rr-next">' + esc(nxt.name) + "</button>") +
        "</div>";
    }
    function bindNext() {
      var nxt = root.querySelector("#rr-next");
      if (!nxt) return;
      nxt.onclick = function () {
        var n = nextOpen();
        if (n) openStation(n.id);
      };
    }
    function noteBox() {
      return '<p class="rc-note" id="rr-note">' + esc(note) + "</p>";
    }

    function paintDoor() {
      var cleared = bayClears();
      var doneN = 0;
      var i;
      for (i = 0; i < STATIONS.length; i++) if (cleared.indexOf(STATIONS[i].id) >= 0) doneN += 1;
      var nxt = nextOpen();
      note = !nxt ? "Bay clear." : "Tap " + nxt.name + ".";
      root.innerHTML =
        '<header class="hub-head ic-head"><div><p class="eyebrow">Recovery room</p><h2>Refrigerant bay</h2></div>' +
        '<button type="button" class="btn" id="rr-hub">Shop floor</button></header>' +
        '<div class="rr-baybar" aria-hidden="true"><i style="width:' + Math.round(doneN / STATIONS.length * 100) + '%"></i></div>' +
        '<div class="rr-grid">' +
        STATIONS.map(function (s) {
          var cls = cleared.indexOf(s.id) >= 0 ? " rr-cleared" : (nxt && nxt.id === s.id ? " rr-open" : "");
          return '<button type="button" class="mode-card' + cls + '" data-st="' + s.id + '"><h3>' + esc(s.name) +
            (cleared.indexOf(s.id) >= 0 ? " ✓" : "") + "</h3></button>";
        }).join("") +
        "</div>" + noteBox();
      var hub = root.querySelector("#rr-hub");
      if (hub) hub.onclick = function () { if (opts.onHub) opts.onHub(); };
      root.querySelectorAll("[data-st]").forEach(function (b) {
        b.onclick = function () { openStation(b.getAttribute("data-st")); };
      });
    }

    function openStation(id) {
      stopTick();
      if (id === "bench") {
        if (!window.RecoverLab) {
          say("Recovery bench didn't load. Hard-refresh.");
          station = "door";
          paintDoor();
          return;
        }
        window.RecoverLab.start(root, {
          onBack: function () {
            station = "door";
            note = "Tap the gold card.";
            boot();
          },
        });
        return;
      }
      station = id;
      if (id === "n2") {
        n2 = freshN2();
        note = "Tap the manifold.";
      } else if (id === "decay") {
        decay = freshDecay();
        note = "Tap the hoses.";
      } else if (id === "weigh") {
        weigh = freshWeigh();
        note = "Tap the scale.";
      } else if (id === "leak") {
        leak = freshLeak();
        note = "Tap the soap.";
      } else if (id === "charge") {
        charge = freshCharge();
        note = "Tap the nameplate.";
      }
      boot();
    }

    function piece(id, name, img) {
      return '<button type="button" class="rc-piece" data-piece="' + id + '"><img src="' + img + '?v=1" alt="" /><span>' + esc(name) + "</span></button>";
    }

    function bindPieces(fn) {
      root.querySelectorAll("[data-piece]").forEach(function (b) {
        b.onclick = function () { fn(b.getAttribute("data-piece")); };
      });
      var back = root.querySelector("#rr-back");
      if (back) back.onclick = function () {
        station = "door";
        note = "Tap the gold card.";
        boot();
      };
    }

    function chAng(p) {
      var span = 500;
      var x = Math.max(0, Math.min(span, p));
      return -118 + (x / span) * 236;
    }

    function tickCharge() {
      var ref = chargeRef();
      var loT = 0;
      var hiT = 0;
      if (charge.on && ref && charge.lb < 8) charge.lb = Math.min(8, charge.lb + 0.09);
      else if (!charge.on && !charge.run && ref && ref.id === "R-410A" && charge.lb > 6.6) {
        charge.lb = Math.max(6.0, charge.lb - 0.09);
        if (charge.lb > 6.05) note = "Wait for 6.0.";
      }
      if (ref) {
        var frac = Math.max(0, Math.min(1, charge.lb / 1.4));
        var sat = ref.sat * (1 - Math.pow(1 - frac, 2));
        if (!charge.run) {
          loT = sat;
          hiT = sat;
        } else {
          var ratio = charge.lb / 6;
          loT = ref.suction;
          hiT = ref.head;
          if (ratio < 0.85) { loT = ref.suction * 0.62; hiT = ref.head * 0.72; }
          else if (ratio > 1.15) { loT = ref.suction * 1.25; hiT = ref.head * 1.18; }
        }
      }
      if (!charge.loQ) charge.loQ = [];
      if (!charge.hiQ) charge.hiQ = [];
      charge.loQ.push(loT);
      charge.hiQ.push(hiT);
      var loAim = charge.loQ.length < 5 ? charge.loQ[0] : charge.loQ.shift();
      var hiAim = charge.hiQ.length < 5 ? charge.hiQ[0] : charge.hiQ.shift();
      charge.lo += Math.max(-0.7, Math.min(0.7, loAim - charge.lo));
      charge.hi += Math.max(-0.45, Math.min(0.7, hiAim - charge.hi));
      var lo = root.querySelector("#ch-lo");
      var hi = root.querySelector("#ch-hi");
      var nlo = root.querySelector("#ch-nlo");
      var nhi = root.querySelector("#ch-nhi");
      var lb = root.querySelector("#ch-lb");
      if (lo) lo.textContent = Math.round(charge.lo) + " psig";
      if (hi) hi.textContent = Math.round(charge.hi) + " psig";
      if (nlo) nlo.style.transform = "rotate(" + chAng(charge.lo).toFixed(1) + "deg)";
      if (nhi) nhi.style.transform = "rotate(" + chAng(charge.hi).toFixed(1) + "deg)";
      if (lb) lb.textContent = charge.lb.toFixed(1) + " / 6.0 lb";
      if (charge.on && ref && charge.lb > 1.6 && !charge.run && Math.abs(charge.lo - ref.sat) < 12) {
        note = ref.id + " sits at " + ref.sat + ".";
        if (ref.id !== "R-410A") note = "Do not start it.";
        else if (charge.lb < 5.4) note = "Keep charging.";
        else if (charge.lb > 6.6) note = "Shut the liquid.";
        else { note = "Start the compressor."; aimLive("#ch-run"); }
      }
    }

    function paintCharge() {
      var ref = chargeRef();
      root.innerHTML = head("Charge it") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Jugs</p>' +
        CHARGE_REFS.map(function (r) {
          return '<button type="button" class="btn' + (charge.jug === r.id ? " primary" : "") + (r.id === "R-410A" && charge.plate && !charge.jug ? " rc-next" : "") + '" data-jug="' + r.id + '">' + r.id + (r.id === "R-410A" ? " · nameplate" : "") + "<br>" + r.sat + " at 75°F</button>";
        }).join("") +
        '</aside><div class="rc-play"><div class="rc-stage rr-shot">' +
        '<img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Empty 3-ton waiting on a charge" />' +
        '<button type="button" class="btn' + (charge.plate ? " primary" : " rc-next") + '" id="ch-plate" style="left:70%;top:62%">Nameplate</button>' +
        '<div class="rc-digi"><div class="rc-digi-top"><b>' + (ref ? ref.id : "NO JUG") + '</b></div>' +
        '<div class="rc-digi-row"><div class="lo"><small>LOW</small><strong id="ch-lo">' + Math.round(charge.lo) + '</strong></div>' +
        '<div class="hi"><small>HIGH</small><strong id="ch-hi">' + Math.round(charge.hi) + '</strong></div></div>' +
        '<div class="rc-digi-hoses" aria-hidden="true"><i class="b"></i><i class="r"></i><i class="y"></i></div></div>' +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>SCALE</em><strong id="ch-lb">' + charge.lb.toFixed(1) + ' / 6.0 lb</strong><span>' +
        (ref ? ref.id + " jug" : "no jug") + (charge.run ? " · compressor ON" : charge.on ? " · charging" : " · idle") + "</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (charge.on ? " on" : "") + '" id="ch-on"><i></i><span>' + (charge.on ? "ON" : "OFF") + "</span><em>Liquid</em></button>" +
        '<button type="button" class="btn primary" id="ch-run">Start compressor</button></div>' +
        "</div></div></div>";
      root.querySelectorAll("[data-jug]").forEach(function (b) {
        b.onclick = function () {
          if (!charge.plate) { note = "Tap the nameplate."; buzz(); paintCharge(); return; }
          if (charge.run) { note = "Shut it down first."; paintCharge(); return; }
          charge.jug = b.getAttribute("data-jug");
          charge.on = false;
          charge.run = false;
          charge.lb = 0;
          charge.lo = 0;
          charge.hi = 0;
          charge.loQ = [];
          charge.hiQ = [];
          note = "Open liquid.";
          paintCharge();
        };
      });
      var plate = root.querySelector("#ch-plate");
      if (plate) plate.onclick = function () {
        charge.plate = true;
        tap();
        note = "Tap the R-410A jug.";
        paintCharge();
      };
      var on = root.querySelector("#ch-on");
      if (on) on.onclick = function () {
        if (charge.run) { note = "Leave liquid off."; paintCharge(); return; }
        if (!charge.jug) { note = "Tap the R-410A jug."; paintCharge(); return; }
        charge.on = !charge.on;
        charge.loQ = [charge.lo, charge.lo, charge.lo, charge.lo];
        charge.hiQ = [charge.hi, charge.hi, charge.hi, charge.hi];
        note = charge.on ? "Watch the scale." : (charge.lb > 6.6 ? "Wait for 6.0." : "Liquid is shut.");
        paintCharge();
      };
      var run = root.querySelector("#ch-run");
      if (run) run.onclick = function () {
        var picked = chargeRef();
        if (!picked) { note = "Tap the R-410A jug."; paintCharge(); return; }
        if (picked.id !== "R-410A") {
          trail("THE WRONG JUG", "Standing pressure was " + picked.sat + ", not 217. That is " + picked.id + " in an R-410A condenser.");
          note = "Tap the R-410A jug.";
          paintCharge();
          return;
        }
        if (charge.lb < 5.4) { note = "Scale is still light."; paintCharge(); return; }
        if (charge.lb > 6.6) { note = "Shut the liquid."; paintCharge(); return; }
        charge.on = false;
        charge.run = true;
        charge.loQ = [charge.lo, charge.lo, charge.lo, charge.lo];
        charge.hiQ = [charge.hi, charge.hi, charge.hi, charge.hi];
        var ratio = charge.lb / 6;
        if (ratio < 0.85) note = "Running light. Not full.";
        else if (ratio > 1.15) note = "Running heavy. Recover some.";
        else {
          note = "6.0 lb. Scale, not 217.";
          markClear("charge");
        }
        paintCharge();
      };
      var back = root.querySelector("#rr-back");
      if (back) back.onclick = function () {
        station = "door";
        note = "Tap the gold card.";
        boot();
      };
      markNext();
    }

    function paintN2() {
      root.innerHTML = head("Nitrogen hold") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Parts</p>' +
        piece("gauges", "Manifold", "parts/gauges.png") +
        piece("n2", "Nitrogen", "ms/tools/n2.jpg") +
        piece("wrench", "Flare wrench", "ms/tools/torque.jpg") +
        piece("o2", "Oxygen", "ms/tools/n2.jpg") +
        piece("air", "Shop air", "ms/tools/n2.jpg") +
        piece("jug", "Refrigerant jug", "recover/junk.jpg") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage rr-shot"><img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Split waiting on a pressure test" />' +
        '<button type="button" class="btn' + (n2.tight ? " primary" : (n2.wrench ? " rc-next" : "")) + '" id="rr-flare" style="left:14%;top:56%">' + (n2.tight ? "Tight" : "Flare") + "</button>" +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>NITROGEN</em><strong id="rr-psi">' + Math.round(n2.psi) + ' psig</strong><span>' +
        (n2.tight ? "flare tight" : "flare loose") + "</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (n2.on ? " on" : "") + '" id="rr-on" style="touch-action:none"><i></i><span>' + (n2.on ? "ON" : "OFF") + "</span><em>Hold</em></button>" +
        '<button type="button" class="btn primary" id="rr-hold">Watch the hold</button>' +
        '<button type="button" class="btn" id="rr-vent">Vent it</button></div>' +
        "</div></div></div>";
      bindPieces(function (id) {
        if (id === "o2") { trail("PURE OXYGEN", "Oil plus oxygen is a fire."); paintN2(); return; }
        if (id === "air") { say("Shop air is wet."); buzz(); paintN2(); return; }
        if (id === "jug") { say("That is refrigerant."); paintN2(); return; }
        if (id === "gauges") { n2.gauges = true; say("Tap the nitrogen."); }
        else if (id === "n2") {
          if (!n2.gauges) say("Tap the manifold.");
          else { n2.gas = true; say("Tap the flare wrench."); }
        } else if (id === "wrench") { n2.wrench = true; say("Tap the flare."); }
        paintN2();
      });
      var on = root.querySelector("#rr-on");
      if (on) {
        var down = function (ev) {
          ev.preventDefault();
          if (!n2.gas || !n2.gauges) { say("Hook gauges and nitrogen."); }
          else if (!n2.tight) { say("Tap the flare."); buzz(); }
          else {
            n2.on = true;
            n2.hold = false;
            on.classList.add("on");
            var s = on.querySelector("span");
            if (s) s.textContent = "ON";
            say("Hold near 300.");
          }
          var line = root.querySelector("#rr-note");
          if (line) line.textContent = note;
        };
        var up = function () {
          if (!n2.on) return;
          n2.on = false;
          on.classList.remove("on");
          var s = on.querySelector("span");
          if (s) s.textContent = "OFF";
          say(n2.psi >= 180 ? "Tap Watch the hold." : "Hold near 300.");
          var line = root.querySelector("#rr-note");
          if (line) line.textContent = note;
        };
        on.addEventListener("pointerdown", down);
        on.addEventListener("pointerup", up);
        on.addEventListener("pointerleave", up);
        on.addEventListener("pointercancel", up);
      }
      var flare = root.querySelector("#rr-flare");
      if (flare) flare.onclick = function () {
        if (!n2.wrench) { say("Tap the flare wrench."); buzz(); paintN2(); return; }
        n2.tight = true;
        tap();
        say("Hold near 300.");
        paintN2();
      };
      var hold = root.querySelector("#rr-hold");
      if (hold) hold.onclick = function () {
        if (n2.on) { say("Let go of nitrogen."); paintN2(); return; }
        if (n2.psi < 180) { say("Hold near 300."); paintN2(); return; }
        n2.hold = true;
        n2.ticks = 0;
        n2.holdFrom = n2.psi;
        say("Watch the needle.");
        paintN2();
      };
      var vent = root.querySelector("#rr-vent");
      if (vent) vent.onclick = function () {
        trail("A VENT TO ATMOSPHERE", "The charge belongs in a DOT tank. Mrs. Alvarez is still inside.");
        note = "Nobody vents.";
        paintN2();
      };
      markNext();
    }

    function vacGaugeSvg(m) {
      var shown = m >= 760000 ? 0 : m > 25000 ? (760000 - m) / (760000 - 25000) : 1;
      var ang = (-130 + shown * 250) * Math.PI / 180;
      var x2 = (46 + Math.sin(ang) * 28).toFixed(1);
      var y2 = (46 - Math.cos(ang) * 28).toFixed(1);
      var xt = (46 - Math.sin(ang) * 8).toFixed(1);
      var yt = (46 + Math.cos(ang) * 8).toFixed(1);
      var pin = shown >= 1 ? "PINNED" : shown <= 0 ? "ATM" : "MOVING";
      return '<svg class="rr-vac-gauge" viewBox="0 0 92 108" width="92" height="108" aria-label="System vacuum gauge">' +
        '<circle cx="46" cy="46" r="40" fill="#0e141c" stroke="#3d8bfd" stroke-width="4"/>' +
        '<circle cx="46" cy="46" r="32" fill="#f3f0e8"/>' +
        '<text x="46" y="28" text-anchor="middle" fill="#333" font-size="8">inHg</text>' +
        '<text x="16" y="72" fill="#333" font-size="9">0</text>' +
        '<text x="64" y="72" fill="#333" font-size="9">30</text>' +
        '<line id="rr-vt" x1="46" y1="46" x2="' + xt + '" y2="' + yt + '" stroke="#222" stroke-width="3" stroke-linecap="round"/>' +
        '<line id="rr-vn" x1="46" y1="46" x2="' + x2 + '" y2="' + y2 + '" stroke="#e10600" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="46" cy="46" r="5" fill="#c0392b"/>' +
        '<text x="46" y="96" text-anchor="middle" fill="#f3e2b0" font-size="9">' + pin + "</text></svg>";
    }

    function paintDecay() {
      root.innerHTML = head("Decay test") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Parts</p>' +
        piece("hoses", "Hoses", "recover/hoses.jpg") +
        piece("pump", "Vacuum pump", "ms/tools/pump.jpg") +
        piece("gauge", "Micron gauge", "ms/tools/micron.jpg") +
        piece("cap", "Service cap", "recover/core.jpg") +
        piece("drier", "New filter-drier", "recover/tank.jpg") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage rr-shot"><img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Split ready to evacuate" />' +
        '<button type="button" class="btn' + (decay.cap ? " primary" : (decay.capHand ? " rc-next" : "")) + '" id="rr-cap" style="left:18%;top:48%">Cap</button>' +
        '<button type="button" class="btn' + (decay.drier ? " primary" : (decay.drierHand ? " rc-next" : "")) + '" id="rr-drier" style="left:30%;top:62%">Drier</button>' +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>MICRONS</em><strong id="rr-mic">' + showMic(decay.microns) + "</strong><span>" +
        (decay.on ? "pump ON" : decay.isolated ? "valve SHUT" : "pump OFF") + "</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (decay.on ? " on" : "") + '" id="rr-vac"><i></i><span>' + (decay.on ? "ON" : "OFF") + "</span><em>Vacuum</em></button>" +
        '<button type="button" class="btn primary" id="rr-iso">Valve off and watch</button></div>' +
        "</div></div></div>";
      bindPieces(function (id) {
        if (id === "hoses") { decay.hoses = true; say("Tap the pump."); }
        else if (id === "pump") {
          if (!decay.hoses) say("Tap the hoses.");
          else { decay.pump = true; say("Tap the micron gauge."); }
        } else if (id === "gauge") { decay.gauge = true; say("Tap the cap."); }
        else if (id === "cap") { decay.capHand = true; say("Tap the cap."); }
        else if (id === "drier") { decay.drierHand = true; say(decay.cap ? "Tap the drier." : "Tap the cap."); }
        paintDecay();
      });
      var capBtn = root.querySelector("#rr-cap");
      if (capBtn) capBtn.onclick = function () {
        if (!decay.capHand) { say("Tap the cap."); buzz(); paintDecay(); return; }
        decay.cap = true;
        tap();
        say(decay.drier ? "Tap Vacuum." : "Tap the drier.");
        paintDecay();
      };
      var drierBtn = root.querySelector("#rr-drier");
      if (drierBtn) drierBtn.onclick = function () {
        if (!decay.drierHand) { say("Tap the new drier."); buzz(); paintDecay(); return; }
        decay.drier = true;
        tap();
        say(decay.cap ? "Tap Vacuum." : "Tap the cap.");
        paintDecay();
      };
      var vac = root.querySelector("#rr-vac");
      if (vac) vac.onclick = function () {
        if (!(decay.pump && decay.gauge && decay.hoses)) { say("Hook the pump first."); paintDecay(); return; }
        decay.on = !decay.on;
        decay.isolated = false;
        if (decay.on) say(decay.microns > 500 ? "Wait under 500." : "Shut the pump off.");
        else if (decay.microns > 500) say("Turn the pump on.");
        else say("Tap Valve off.");
        paintDecay();
      };
      var iso = root.querySelector("#rr-iso");
      if (iso) iso.onclick = function () {
        if (decay.on) {
          say(decay.microns > 500 ? "Wait under 500." : "Shut the pump off.");
          paintDecay();
          return;
        }
        if (decay.microns > 500) { say("Turn the pump on."); paintDecay(); return; }
        decay.isolated = true;
        decay.ticks = 0;
        say("Watch the microns.");
        paintDecay();
      };
      markNext();
    }

    function paintWeigh() {
      root.innerHTML = head("Weigh the charge") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Parts</p>' +
        piece("scale", "Digital scale", "recover/tank-scale.jpg") +
        piece("tank", "Virgin R-410A", "recover/tank.jpg") +
        piece("gauges", "Manifold", "parts/gauges.png") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage rr-shot"><img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Condenser with a factory charge" />' +
        '<button type="button" class="btn' + (weigh.measured ? " primary" : (weigh.scale && weigh.tank && weigh.gauges ? " rc-next" : "")) + '" id="rr-line" style="left:28%;top:70%">' + (weigh.measured ? "40 ft" : "Lineset") + "</button>" +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>ADDED</em><strong id="rr-oz">' + weigh.oz.toFixed(1) + " oz</strong><span>13–17</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (weigh.liquid ? " on" : "") + '" id="rr-liq"><i></i><span>' + (weigh.liquid ? "OPEN" : "SHUT") + "</span><em>Liquid</em></button>" +
        '<button type="button" class="btn primary" id="rr-stop">Stop the charge</button>' +
        '<button type="button" class="btn" id="rr-sweat">Charge till it sweats</button></div>' +
        "</div></div></div>";
      bindPieces(function (id) {
        if (id === "scale") { weigh.scale = true; say("Tap the tank."); }
        else if (id === "tank") {
          if (!weigh.scale) say("Tap the scale.");
          else { weigh.tank = true; say("Tap the manifold."); }
        } else if (id === "gauges") { weigh.gauges = true; say("Tap the lineset."); }
        paintWeigh();
      });
      var lineBtn = root.querySelector("#rr-line");
      if (lineBtn) lineBtn.onclick = function () {
        weigh.measured = true;
        tap();
        say("Add 15 oz.");
        paintWeigh();
      };
      var liq = root.querySelector("#rr-liq");
      if (liq) liq.onclick = function () {
        if (!(weigh.scale && weigh.tank && weigh.gauges)) { say("Tap the scale."); paintWeigh(); return; }
        if (!weigh.measured) { say("Tap the lineset."); buzz(); paintWeigh(); return; }
        if (weigh.stopped) { say("Read the ounces."); paintWeigh(); return; }
        weigh.liquid = !weigh.liquid;
        say(weigh.liquid ? "Stop at 15." : "Liquid is shut.");
        paintWeigh();
      };
      var stop = root.querySelector("#rr-stop");
      if (stop) stop.onclick = function () {
        weigh.liquid = false;
        weigh.stopped = true;
        if (weigh.oz >= 13 && weigh.oz <= 17) {
          weigh.done = true;
          say("15 oz. Lineset only.");
          markClear("weigh");
        } else if (weigh.oz > 17) {
          weigh.oz = 10;
          weigh.stopped = false;
          say("Open liquid again.");
          buzz();
        } else {
          say("Short. Stop at 15.");
          buzz();
          weigh.stopped = false;
        }
        paintWeigh();
      };
      var sweat = root.querySelector("#rr-sweat");
      if (sweat) sweat.onclick = function () {
        say("Weigh it. Do not guess.");
        paintWeigh();
      };
      markNext();
    }

    function paintLeak() {
      root.innerHTML = head("Find the leak") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Tools</p>' +
        piece("soap", "Soap bubbles", "ms/tools/soap.jpg") +
        piece("sniff", "Sniffer", "ms/tools/micron.jpg") +
        piece("dye", "UV dye", "recover/junk.jpg") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage rr-shot"><img class="rc-unit-img" src="recover/split-on.jpg?v=1" alt="Outdoor unit. The leak is the big flare on the blue hose." />' +
        '<div class="rr-joints">' +
        '<button type="button" class="btn" data-joint="flare" style="left:38%;top:58%">Flare</button>' +
        '<button type="button" class="btn" data-joint="schrader" style="left:58%;top:50%">Schrader</button>' +
        '<button type="button" class="btn" data-joint="king" style="left:68%;top:28%">King valve</button>' +
        "</div></div>" +
        '<div class="rc-controls"></div></div></div>';
      bindPieces(function (id) {
        leak.tool = id;
        if (id === "soap") say("Soap the flare.");
        else if (id === "sniff") say("Sniff the flare.");
        else say("Soap it. Dye waits.");
        paintLeak();
      });
      root.querySelectorAll("[data-joint]").forEach(function (b) {
        b.onclick = function () {
          var joint = b.getAttribute("data-joint");
          if (!leak.tool) { say("Tap the soap."); paintLeak(); return; }
          if (leak.tool === "sniff") {
            if (joint === "flare") {
              leak.found = true;
              say("Peaks on the flare.");
              markClear("leak");
            } else {
              say("Sniff the flare.");
              buzz();
            }
            paintLeak();
            return;
          }
          if (leak.tool === "dye") { say("Soap the flare."); paintLeak(); return; }
          if (joint === "flare") {
            leak.found = true;
            say("Bubbles on the flare.");
            markClear("leak");
          } else {
            say("Soap the flare.");
            buzz();
          }
          paintLeak();
        };
      });
      markNext();
    }

    function stopAll() {
      stopTick();
      if (activeStop === stopAll) activeStop = null;
    }

    boot();
    activeStop = stopAll;
    return { stop: stopAll };
  }

  window.RecoveryRoom = { start: start };
})();
