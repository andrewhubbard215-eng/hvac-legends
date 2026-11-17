/* Recovery bench. Drag the real hookup onto the unit. Gauges fall. The tank heats. Ice is for the big system. */
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
  const UNITS = [
    {
      id: "split",
      name: "3-ton split",
      ref: "R-410A",
      charge: 7.5,
      startP: 217,
      target: 0,
      ports: 2,
      big: true,
      law: "Under 200 lb. A machine built after Nov 15, 1993 has to reach 0 psig. That meets 608. It does not dry the system.",
      bare: "recover/split-bare.jpg",
      on: "recover/split-on.jpg",
    },
    {
      id: "mini",
      name: "Mini-split",
      ref: "R-410A",
      charge: 3.1,
      startP: 217,
      target: 0,
      ports: 2,
      big: false,
      law: "Same 0 psig level. Its own tank. Do not dump R-410A into the R-134a bottle.",
      bare: "recover/mini-bare.jpg",
      on: "recover/mini-on.jpg",
    },
    {
      id: "box",
      name: "Reach-in",
      ref: "R-134a",
      charge: 0.75,
      startP: 79,
      target: -2,
      ports: 1,
      big: false,
      law: "Small appliance. 90% with the compressor running, or 4 inches of vacuum. This pull is the 4 inches. Passive recovery is Type I only.",
      bare: "recover/box-bare.jpg",
      on: "recover/box-on.jpg",
    },
  ];

  const SAT = {
    "R-410A": [
      [40, 118], [50, 144], [60, 170], [70, 201], [80, 236], [90, 274],
      [100, 317], [110, 365], [120, 418], [130, 476],
    ],
    "R-134a": [
      [40, 35], [50, 45], [60, 57], [70, 71], [80, 87], [90, 104],
      [100, 124], [110, 146], [120, 171], [130, 199],
    ],
  };

  const PIECES = [
    { id: "tank", name: "Recovery tank", kind: "tank", img: "recover/tank.jpg" },
    { id: "machine", name: "Recovery machine", kind: "machine", img: "recover/machine.jpg" },
    { id: "gauges", name: "Manifold gauges", kind: "gauges", img: "parts/gauges.png" },
    { id: "blue", name: "Blue hose", kind: "hose", img: "recover/hoses.jpg" },
    { id: "red", name: "Red hose", kind: "hose", img: "recover/hoses.jpg" },
    { id: "yellow", name: "Yellow hose", kind: "hose", img: "recover/hoses.jpg" },
    { id: "core", name: "Service ports", kind: "core", img: "recover/core.jpg" },
    { id: "vac", name: "Vacuum pump", kind: "vac", img: "ms/tools/pump.jpg" },
    { id: "junk", name: "Disposable jug", kind: "bad", img: "recover/junk.jpg" },
    { id: "wrong", name: "Wrong tank", kind: "bad", img: "recover/tank.jpg" },
    { id: "fresh", name: "Empty tank", kind: "fresh", img: "recover/tank.jpg" },
    { id: "n2", name: "Nitrogen", kind: "bad", img: "ms/tools/n2.jpg" },
  ];

  const FILL = {
    "R-410A": { sg: 1.059, mult: 0.8472 },
    "R-134a": { sg: 1.207, mult: 0.9656 },
  };
  const WC = 26.2;

  function fillStop(ref) {
    const f = FILL[ref] || FILL["R-410A"];
    return Math.round(f.mult * WC * 10) / 10;
  }

  function volPct(ref, lb) {
    const f = FILL[ref] || FILL["R-410A"];
    const full = WC * f.sg;
    if (!(full > 0)) return 0;
    return Math.max(0, Math.min(80, (lb / full) * 100));
  }

  const MISS = {
    junk: "Not a recovery tank.",
    n2: "Nitrogen is not a tank.",
    wrong: "Do not mix refrigerants.",
  };

  function satP(ref, t) {
    const row = SAT[ref] || SAT["R-410A"];
    if (t <= row[0][0]) return row[0][1];
    for (let i = 1; i < row.length; i++) {
      if (t <= row[i][0]) {
        const a = row[i - 1];
        const b = row[i];
        const k = (t - a[0]) / (b[0] - a[0]);
        return a[1] + (b[1] - a[1]) * k;
      }
    }
    return row[row.length - 1][1] + (t - row[row.length - 1][0]) * 4;
  }

  function showP(p) {
    if (!isFinite(p)) return "—";
    if (p >= -0.05) return Math.round(p) + " psig";
    const inHg = Math.round(-p * 2.036);
    return inHg + '" Hg';
  }

  function gaugeSpan(unit) {
    return unit.ref === "R-134a" ? 120 : 350;
  }

  function needle(p, span) {
    const x = Math.max(-30, Math.min(span, p));
    return -118 + ((x + 30) / (span + 30)) * 236;
  }

  function sideP(j, unit) {
    const liquidLeft = unit.ports === 2 && (j.liquid || 0) > 0.05;
    const vaporCap = Math.max(0.05, unit.charge * 0.3);
    const vaporLeft = Math.max(0, j.charge - (j.liquid || 0));
    const vaporFrac = Math.max(0, Math.min(1, vaporLeft / vaporCap));
    const allFrac = Math.max(0, Math.min(1, j.charge / Math.max(0.05, unit.charge)));
    const lo = unit.target + (unit.startP - unit.target) * Math.pow(liquidLeft ? vaporFrac : allFrac, 0.75);
    let hi;
    if (unit.ports === 1) hi = lo;
    else if (liquidLeft) {
      const liqFrac = Math.max(0, Math.min(1, j.liquid / (unit.charge * 0.7)));
      hi = unit.startP * (0.88 + 0.12 * liqFrac);
    } else hi = unit.target + (unit.startP - unit.target) * Math.pow(allFrac, 0.55);
    return { lo: lo, hi: hi };
  }

  function cutout(ref) {
    return ref === "R-134a" ? 160 : 400;
  }

  function resetAt(ref) {
    return ref === "R-134a" ? 120 : 300;
  }

  function ensureStyle() {
    if (typeof document === "undefined" || !document.getElementById) return;
    if (document.getElementById("rc-polish")) return;
    const st = document.createElement("style");
    st.id = "rc-polish";
    st.textContent = [
      "#screen-recover.screen.active{display:flex !important;flex-direction:column;height:100dvh;max-height:100dvh;overflow:hidden}",
      "#recover-root{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:auto}",
      "#recover-root .hub-head{margin:4px 12px 0}",
      "#recover-root .hub-head h2{font-size:22px;margin:0}",
      "#recover-root .ic-tabs{margin:2px 10px;display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px}",
      "#recover-root .ic-tabs .btn{flex:0 0 auto}",
      "#recover-root .rc-steps{flex-wrap:nowrap;overflow-x:auto;margin:2px 10px 4px}",
      "#recover-root .rc-board{flex:1 1 auto;min-height:0;max-width:none;margin:0;padding:0 10px 8px;grid-template-columns:168px minmax(0,1fr);align-items:stretch;overflow:hidden}",
      "#recover-root .rc-bin{max-height:100%;min-height:0;overflow-y:auto}",
      "#recover-root .rc-play{min-width:0;min-height:0;height:100%;display:grid;grid-template-columns:minmax(0,1fr) 168px;grid-template-rows:minmax(0,1fr) auto;gap:8px}",
      "#recover-root .rc-stage{grid-column:1;grid-row:1;min-height:0;height:100%;overflow:hidden}",
      "#recover-root .rc-unit-img{width:100%;height:100%;max-height:46vh;object-fit:contain}",
      "#recover-root .rc-pad-floor{position:absolute;left:0;right:0;bottom:0;height:36%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(8,10,12,.72) 30%,rgba(16,14,12,.92))}",
      "#recover-root .rc-hoses{z-index:2}",
      "#recover-root .rc-hoses path{stroke-width:8px;vector-effect:non-scaling-stroke;stroke-linecap:round;filter:drop-shadow(0 0 1px #000) drop-shadow(0 1px 0 #000)}",
      "#recover-root .rc-hoses path.open{stroke-opacity:1}",
      "#recover-root .rc-hoses path.flow{stroke-width:9px;stroke-dasharray:10 8;animation:rc-flow .5s linear infinite}",
      "@keyframes rc-flow{to{stroke-dashoffset:-36}}",
      "#recover-root .rc-hoses path.rc-bead{stroke:#f4fbff;stroke-width:3px}",
      "#recover-root .rc-hoses path.rc-bead.shut{stroke-opacity:0;animation:none}",
      "#recover-root .rc-hoses path.rc-bead.flow{stroke-opacity:.95;stroke-dasharray:3 16;animation:rc-bead .32s linear infinite}",
      "@keyframes rc-bead{to{stroke-dashoffset:-38}}",
      "#recover-root .rc-needle{transition:transform 1.15s cubic-bezier(.2,.7,.2,1)}",
      "#recover-root .rc-level{position:absolute;left:22%;right:22%;bottom:18%;height:0;border-radius:0 0 10px 10px;background:linear-gradient(180deg,rgba(255,255,255,.25),rgba(70,170,230,.75));pointer-events:none;transition:height .35s linear}",
      "#recover-root .rc-drop{margin:4px 0 0;min-height:1.2em;font-size:13px;font-weight:800;color:#9fd7ff}",
      "#recover-root .rc-feed{margin:0;font-size:11px;font-weight:800;color:#b7ecff;text-align:center}",
      "#recover-root .rc-ice.feeding{box-shadow:inset 0 0 28px rgba(160,220,255,.55)}",
      "#recover-root .rc-ice.feeding > i{animation:rc-ice-bob 1.2s ease-in-out infinite}",
      "#recover-root .rc-ice.feeding > i:nth-child(4){animation-delay:.2s}",
      "#recover-root .rc-ice.feeding > i:nth-child(5){animation-delay:.4s}",
      "@keyframes rc-ice-bob{50%{transform:translateY(-8px);opacity:.5}}",
      "#recover-root .rc-lay{z-index:3}",
      "#recover-root .rc-lay.machine{left:16%;bottom:18%;width:22%;height:28%;object-fit:cover;object-position:center;border-radius:10px;pointer-events:auto;cursor:grab}",
      "#recover-root .rc-lay.machine.back{outline:2px solid #e8c450}",
      "#recover-root .rc-lay.gauges{left:40%;bottom:2%;width:17%;height:36%;object-fit:contain;object-position:center bottom;background:transparent;filter:drop-shadow(0 8px 8px rgba(0,0,0,.6))}",
      "#recover-root .rc-lay.tank-wrap{left:1%;bottom:2%;width:13%;height:auto}",
      "#recover-root .rc-lay.tank-wrap img{width:100%;height:auto;max-height:120px;object-fit:cover}",
      "#recover-root .rc-lay.core{left:54%;top:32%;width:74px;height:48px;object-fit:cover;border-radius:8px}",
      "#recover-root .rc-lay.vac{left:auto;right:8px;top:40px;bottom:auto;width:96px;height:72px;object-fit:cover;border-radius:8px}",
      "#recover-root .rc-lay.vac.run{outline:2px solid #9ec5ff}",
      "#recover-root .rc-lay.vac.seated{left:16%;right:auto;top:auto;bottom:18%;width:22%;height:28%}",
      "#recover-root .rc-port-dot{position:absolute;z-index:4;width:16px;height:16px;border-radius:50%;border:2px solid #fff;transform:translate(-50%,-50%);box-shadow:0 0 0 3px rgba(0,0,0,.45);pointer-events:none}",
      "#recover-root .rc-port-dot.lo{left:66%;top:44%;background:#3d8bfd}",
      "#recover-root .rc-port-dot.hi{left:74%;top:50%;background:#e23b4a}",
      "#recover-root .rc-port-dot em{position:absolute;left:18px;top:-3px;font-style:normal;font-size:11px;font-weight:800;color:#fff;text-shadow:0 1px 2px #000;white-space:nowrap}",
      "#recover-root .rc-ice-bay{grid-column:2;grid-row:1;align-self:end;min-height:168px;margin:0;padding:8px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px}",
      "#recover-root .rc-ice-bay .rc-ice-why{font-size:11px;line-height:1.3;color:#d7f3ff}",
      "#recover-root .rc-ice-bay .rc-tank{position:relative;width:72px;margin-top:4px}",
      "#recover-root .rc-ice-bay .rc-tank img{width:72px;height:78px}",
      "#recover-root .rc-controls{grid-column:1 / -1;grid-row:2}",
      "#recover-root .rc-switches{display:flex;flex-wrap:wrap;gap:8px;align-items:center}",
      "#recover-root .rc-go{position:static;transform:none}",
      "#recover-root .rc-manifold{margin-top:8px}",
      "#recover-root .rc-lay.vac{pointer-events:auto;cursor:grab}",
      "#recover-root .rc-scale-deck .rc-tank{width:100%;height:auto;pointer-events:auto;cursor:grab}",
      "#recover-root .rc-tank em{position:absolute;left:50%;right:auto;bottom:6px;transform:translateX(-50%);padding:2px 7px;border-radius:6px;background:#121418;color:#fff6dc;font-style:normal;font-weight:800;font-size:14px;line-height:1.2;border:1px solid #e8c450;z-index:2;white-space:nowrap}",
      "#recover-root .rc-scale-deck{position:absolute;left:2%;bottom:3%;width:18%;min-width:108px;z-index:4;display:flex;flex-direction:column;align-items:stretch;gap:3px;pointer-events:none}",
      "#recover-root .rc-scale-wait{height:64px;border-radius:8px;border:1px dashed rgba(232,196,80,.55);color:#d5dde4;font-size:11px;font-weight:800;display:grid;place-items:center;background:rgba(8,10,12,.45)}",
      "#recover-root .rc-scale-plat{height:12px;border-radius:4px;background:linear-gradient(180deg,#f4f7f8,#8b949e 45%,#3e474e);box-shadow:0 6px 10px rgba(0,0,0,.5)}",
      "#recover-root .rc-scale-face{background:#06110c;border:2px solid #1d3a2c;border-radius:8px;padding:4px 6px 6px;text-align:center;box-shadow:inset 0 0 12px rgba(80,255,160,.12)}",
      "#recover-root .rc-scale-face em{display:block;font-style:normal;font-size:10px;letter-spacing:.16em;color:#7d9a88}",
      "#recover-root .rc-scale-face strong{display:block;font-family:ui-monospace,monospace;font-size:28px;line-height:1;color:#b6f5c8}",
      "#recover-root .rc-scale-face span{display:block;font-size:11px;color:#9ec5ff;letter-spacing:.08em}",
      "#recover-root .rc-bin.over{outline:2px solid #e8c450}",
      "#recover-root .rc-coach{position:absolute;left:8px;top:8px;z-index:5;width:min(260px,54%);max-height:68px;overflow:auto;background:rgba(12,16,20,.92);border:1px solid rgba(232,196,80,.5);border-radius:10px;padding:2px 8px 4px}",
      "#recover-root .rc-coach.min{max-height:28px;overflow:hidden}",
      "#recover-root .rc-coach.min .rc-coach-body{display:none}",
      "#recover-root .rc-coach-min{appearance:none;border:0;background:transparent;color:#e8c450;font-weight:800;font-size:12px;padding:0;cursor:pointer}",
      "#recover-root .rc-coach .rc-note,#recover-root .rc-coach .rc-law{margin:2px 0 0;font-size:12px;line-height:1.35;max-width:none}",
      "#recover-root .rc-alarm{margin:0 0 6px;padding:6px 8px;border-radius:8px;background:#4a1820;color:#ffd7dc;font-size:13px;font-weight:700}",
      "#recover-root .rc-fill::before{content:\"\";position:absolute;left:80%;top:0;bottom:0;width:2px;background:#fff;z-index:1}",
      "#recover-root .rc-hide{display:none !important}",
      "#rc-reset{margin:0}",
      ".mach-switch.tripped{background:#4a1820}",
      ".mach-switch.tripped i{background:#a32030}",
      ".rc-ice{cursor:pointer}",
      ".rc-piece{touch-action:none}",
      ".rc-stage{touch-action:pan-y}",
      "#recover-root .rc-ports{position:absolute;right:8px;top:34%;z-index:8;display:flex;flex-direction:column;gap:6px;width:112px}",
      "#recover-root .rc-port{min-height:44px;border-radius:10px;border:1px dashed #6a5a32;background:rgba(12,16,20,.92);color:#f4efe6;font-weight:800;font-size:12px}",
      "#recover-root .rc-port.gold{border-style:solid;border-color:#e8c450;box-shadow:0 0 0 3px rgba(232,196,80,.4)}",
      "#recover-root .rc-port.suction.on{border-style:solid;border-color:#3d8bfd}",
      "#recover-root .rc-port.liquid.on{border-style:solid;border-color:#e23b4a}",
      "#recover-root .rc-port.inlet.on{border-style:solid;border-color:#e8c450}",
      "#recover-root .rc-piece[data-piece=blue]{box-shadow:inset 6px 0 0 #3d8bfd}",
      "#recover-root .rc-piece[data-piece=red]{box-shadow:inset 6px 0 0 #e23b4a}",
      "#recover-root .rc-piece[data-piece=yellow]{box-shadow:inset 6px 0 0 #e8c450}",
      "#recover-root .rc-nextline{margin:4px 0 0;max-width:none;color:#f6f1e6;font-weight:700;font-size:16px;line-height:1.35}",
      "#recover-root .rc-guide{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin:0 12px 4px}",
      "#recover-root .rc-repbar{flex:1 1 180px;margin:0;height:10px}",
      "#recover-root .rc-repnote,#recover-root .rc-nextline{margin:0}",
      "#recover-root .xp-goals{flex:1 1 100%;margin:0}",
      "@keyframes rc-win{0%{box-shadow:0 0 0 rgba(232,196,80,0)}40%{box-shadow:0 0 28px rgba(232,196,80,.9)}100%{box-shadow:0 0 0 rgba(232,196,80,0)}}",
      "#recover-root .rc-guide b{display:block;color:#e8c450;font-size:12px;letter-spacing:.14em;text-transform:uppercase}",
      "#recover-root .rc-repbar{position:relative;height:14px;margin:8px 0 0;border-radius:999px;background:#10161c;border:1px solid rgba(232,196,80,.45);overflow:hidden}",
      "#recover-root .rc-repbar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#CE0034,#e8c450)}",
      "#recover-root .rc-repnote{margin:4px 0 6px;font-size:12px;font-weight:800;color:#f3e2b0}",
      "#recover-root .rc-target{outline:3px solid #e8c450;box-shadow:0 0 0 4px rgba(232,196,80,.35)}",
      "#recover-root .rc-piece.rc-next{outline:2px solid #e8c450}",
      "#recover-root .rc-gear{pointer-events:none}",
      "#recover-root .rc-gear .rc-lay,#recover-root .rc-gear .rc-scale-deck,#recover-root .rc-gear .rc-empty{pointer-events:auto}",
      "#recover-root .rc-micron{margin-top:8px;background:#061018;border:2px solid #245;border-radius:8px;padding:6px 8px;text-align:center}",
      "#recover-root .rc-micron em{display:block;font-style:normal;letter-spacing:.16em;font-size:10px;color:#8eb}",
      "#recover-root .rc-micron strong{display:block;font-family:ui-monospace,monospace;font-size:28px;color:#9fd;line-height:1}",
      "#recover-root .rc-micron span{font-size:11px;color:#9ec5ff}",
      "@media (max-width:720px){#screen-recover.screen.active{height:auto;max-height:none;overflow:auto}#recover-root{overflow:visible}#recover-root .rc-board{display:flex;flex-direction:column;overflow:visible;height:auto}#recover-root .rc-play{display:flex;flex-direction:column;height:auto;grid-template-columns:1fr}#recover-root .rc-stage{height:auto;min-height:0}#recover-root .rc-hook{grid-template-columns:1fr;height:auto}#recover-root .rc-hook .rc-unit-img{height:auto;max-height:38vh;width:100%;object-fit:contain}#recover-root .rc-hook .rc-lay{max-height:120px !important;width:auto !important;max-width:100% !important;object-fit:contain}#recover-root .rc-ice-bay{width:100%;min-height:72px;flex-direction:row;flex-wrap:wrap}#recover-root .rc-bin{max-height:none;flex-direction:row;overflow-x:auto}#recover-root .rc-bin .rc-piece{width:120px;flex:0 0 120px}}",
      "#recover-root .rc-stage{display:block}",
      "#recover-root .rc-hook{position:relative;z-index:3;display:grid;grid-template-columns:minmax(0,1.7fr) minmax(128px,.5fr) minmax(148px,.55fr);gap:8px;align-items:stretch;height:100%;min-height:0;padding:8px;box-sizing:border-box}",
      "#recover-root .rc-cond,#recover-root .rc-man,#recover-root .rc-gear{margin:0;min-width:0;min-height:0;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;overflow:hidden}",
      "#recover-root .rc-cond figcaption{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#e8c450}",
      "#recover-root .rc-hook .rc-unit-img{position:static;width:100%;height:100%;max-height:none;min-height:0;flex:1 1 auto;object-fit:contain;object-position:center bottom;border-radius:12px;background:#101418}",
      "#recover-root .rc-hook .rc-lay{position:static !important;left:auto !important;right:auto !important;top:auto !important;bottom:auto !important;width:auto !important;max-width:100% !important;height:auto !important;max-height:42% !important;object-fit:contain;border-radius:8px}",
      "#recover-root .rc-hook .rc-lay.gauges{height:64px !important}",
      "#recover-root .rc-hook .rc-manifold{display:flex;gap:8px;justify-content:center;margin:0}",
      "#recover-root .rc-hook .rc-dial{width:86px;height:86px}",
      "#recover-root .rc-hoses{z-index:6}",
      "#recover-root .rc-process{position:static;margin:0 0 8px;font-size:15px;font-weight:800;color:#f3e2b0;line-height:1.35}",
      "#recover-root .rc-empty{width:100%;min-height:72px;border:1px dashed rgba(232,196,80,.55);border-radius:10px;display:grid;place-items:center;color:#e8c450;font-weight:800;font-size:12px;background:rgba(8,10,12,.35)}",
      "#recover-root .rc-hook .rc-ports{position:static;width:100%;flex-direction:row;flex-wrap:wrap}",
      "#recover-root .rc-hook .rc-scale-deck{position:static;width:100%;min-width:0;left:auto;bottom:auto}",
      "#recover-root .rc-hook .rc-drop{text-align:center}",
      "@media (max-width:720px){#screen-recover.screen.active{display:flex !important;flex-direction:column;height:100dvh !important;max-height:100dvh !important;overflow:hidden !important}#recover-root{flex:1 1 auto;min-height:0;height:100%;overflow:hidden !important;display:flex;flex-direction:column}#recover-root .hub-head{margin:2px 8px 0}#recover-root .hub-head h2{font-size:18px}#recover-root .rc-board{display:flex !important;flex-direction:column;flex:1 1 auto;min-height:0;height:auto;overflow:hidden}#recover-root .rc-bin{flex:0 0 auto;flex-direction:row;overflow-x:auto;max-height:96px;max-width:100%}#recover-root .rc-bin .rc-piece{flex:0 0 108px;width:108px}#recover-root .rc-play{display:flex !important;flex-direction:column;flex:1 1 auto;min-height:0;height:auto}#recover-root .rc-stage{flex:1 1 auto;min-height:0;height:auto !important;overflow:hidden}#recover-root .rc-guide{max-height:58px;overflow:auto}#recover-root .xp-goals{display:none}#recover-root .rc-hook{display:block !important;height:100% !important;min-height:0;position:relative}#recover-root .rc-cond{height:100% !important;min-height:0}#recover-root .rc-man,#recover-root .rc-gear{position:absolute !important;bottom:4px;height:auto !important;max-height:108px;width:46% !important;z-index:4}#recover-root .rc-man{left:4px}#recover-root .rc-gear{right:4px}#recover-root .rc-hook .rc-unit-img{height:100% !important;max-height:none !important;min-height:0;width:100% !important;object-fit:contain !important}#recover-root .rc-hook .rc-lay{max-height:72px !important}#recover-root .rc-ice-bay{flex:0 0 auto;width:100%;min-height:0;max-height:48px;flex-direction:row;align-items:center}#recover-root .rc-controls{flex:0 0 auto;max-height:22vh;overflow:auto}}",
      "#recover-root:has(#rr-back) .rc-play{display:flex;flex-direction:column;height:auto;min-height:0;grid-template-columns:minmax(0,1fr)}",
      "#recover-root:has(#rr-back) .rc-stage{height:auto;min-height:0;overflow:visible}",
      "#recover-root:has(#rr-back) .rc-stage>.rc-unit-img{width:100%;height:auto;max-height:min(46dvh,calc(100dvh - 220px));object-fit:contain;object-position:center}",
      "#recover-root:has(#rr-back) .rc-scale-deck{position:static;width:auto;min-width:0;max-width:100%}",
      "#recover-root:has(#rr-back) .rc-bin{min-height:0;max-height:min(46dvh,calc(100dvh - 220px));overflow-x:hidden;overflow-y:auto}",
      "@media (max-width:720px){#screen-recover.screen.active:has(#rr-back){height:auto !important;max-height:none !important;overflow:auto !important}#recover-root:has(#rr-back){height:auto !important;overflow:auto !important}#recover-root:has(#rr-back) .rc-board{overflow:visible}#recover-root:has(#rr-back) .rc-bin{flex-direction:row;flex-wrap:nowrap;max-height:none;overflow-x:auto;overflow-y:hidden}#recover-root:has(#rr-back) .rc-piece{flex:0 0 120px;width:120px;touch-action:pan-x}#recover-root:has(#rr-back) .rc-controls{max-height:none;overflow:visible}}",
      "@media (min-width:721px){#recover-root:has(#rr-back) .rc-scale-deck{flex-direction:row;align-items:center;gap:12px}#recover-root:has(#rr-back) .rc-scale-deck .rc-scale-face{flex:1 1 auto;width:auto}}",
      "@media (min-width:721px){#recover-root:has(#rc-close){padding-bottom:100px}#recover-root:has(#rc-close) .rc-stage{max-height:calc(100dvh - 430px);overflow:hidden}}",
      "@media (max-width:720px){#screen-recover.screen.active:has(#rc-close){height:auto !important;max-height:none !important;overflow:auto !important}#recover-root:has(#rc-close){flex:0 0 auto !important;height:auto !important;min-height:100%;overflow:visible !important;padding-bottom:120px}#recover-root:has(#rc-close) .rc-board,#recover-root:has(#rc-close) .rc-play{flex:0 0 auto !important;height:auto !important;overflow:visible}#recover-root:has(#rc-close) .rc-controls{max-height:none;overflow:visible}#recover-root:has(#rc-close) .rc-stage{flex:0 0 auto !important;height:auto !important;min-height:180px;overflow:hidden}#recover-root:has(#rc-close) .rc-hook,#recover-root:has(#rc-close) .rc-cond{height:auto !important;min-height:180px}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{height:180px !important;max-height:34vh !important;min-height:140px !important;flex:none !important;width:100% !important;object-fit:contain !important}}",
      "@media (max-width:720px){#recover-root:has(#ch-run) .rc-stage{flex-wrap:wrap;max-width:100%}#recover-root:has(#ch-run) .rc-scale-deck,#recover-root:has(#ch-run) .rc-manifold{max-width:100%}}",
      "#recover-root .rc-steps,#recover-root .rc-guide,#recover-root .hub-head,#recover-root .ic-tabs{flex:0 0 auto;min-height:0}",
      "#recover-root .rc-steps{min-height:28px}",
      "#recover-root .rc-piece img,#recover-root .rc-tank img,#recover-root .rc-lay,#recover-root .rc-unit-img{object-fit:contain}",
      "#recover-root:has(#rr-back) .rc-board,#recover-root:has(#rr-back) .rc-play,#recover-root:has(#rr-back) .rc-stage{flex:0 0 auto !important;height:auto !important;min-height:0;overflow:visible}",
      "#recover-root:has(#rr-back) .rc-stage>.rc-unit-img{display:block;width:100% !important;height:auto !important;max-height:min(38vh,300px) !important;min-height:140px !important;object-fit:contain !important;object-position:center;background:#101418}",
      "@media (max-width:720px){#recover-root:has(#rr-back){padding-bottom:128px}#recover-root:has(#rr-back) .rc-stage>.rc-unit-img{max-height:min(32vh,220px) !important;min-height:120px !important}#recover-root:has(#rc-close) .rc-guide{max-height:none;overflow:visible}#recover-root:has(#rc-close) .rc-bin{flex:0 0 auto;flex-direction:row;flex-wrap:nowrap;align-items:flex-start;max-height:none !important;height:auto;overflow-x:auto;overflow-y:hidden;max-width:100%}#recover-root:has(#rc-close) .rc-bin .rc-bin-hint{display:none}#recover-root:has(#rc-close) .rc-bin .eyebrow{flex:0 0 auto;align-self:center;width:auto;margin:0 6px 0 0}#recover-root:has(#rc-close) .rc-bin .rc-piece{flex:0 0 112px;width:112px;height:auto;touch-action:pan-x}#recover-root:has(#rc-close) .rc-bin .rc-piece img{height:64px;width:100%;object-fit:contain;background:#101418}#recover-root:has(#rc-close) .rc-ice-bay{max-height:72px}#recover-root:has(#rc-close){padding-bottom:140px}}",
      "@media (min-width:721px){#recover-root .rc-bin{overflow-y:auto;min-height:0}#recover-root:has(#rc-close) .rc-bin .rc-piece{touch-action:pan-y}}",
      "@media (max-width:720px){#screen-recover.screen.active{display:block!important;overflow-x:hidden!important;overflow-y:auto!important;height:100dvh!important;max-height:100dvh!important}#recover-root{height:auto!important;max-height:none!important;overflow:visible!important;flex:none!important;display:block!important}#recover-root .rc-board,#recover-root .rc-play{height:auto!important;overflow:visible!important;flex:none!important;display:flex!important;flex-direction:column!important}#recover-root .rc-stage{overflow:visible!important;height:auto!important;min-height:0!important;max-height:none!important;flex:none!important}#recover-root .rc-hook{display:grid!important;grid-template-columns:1fr 1fr 1fr!important;height:auto!important;min-height:0!important;overflow:visible!important;position:relative!important;gap:4px!important;padding:4px!important}#recover-root .rc-cond,#recover-root .rc-man,#recover-root .rc-gear{position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto!important;max-width:100%!important;height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important}#recover-root .rc-hook .rc-unit-img{width:100%!important;height:auto!important;max-height:22vh!important;min-height:0!important;flex:none!important;object-fit:contain!important}#recover-root .rc-empty{min-height:52px!important;width:100%!important}#recover-root .rc-scale-face strong{font-size:16px!important}#recover-root .rc-bin{overflow-x:auto!important;overflow-y:hidden!important;max-width:100%!important;max-height:none!important;height:auto!important;flex-direction:row!important;flex-wrap:nowrap!important}#recover-root .rc-bin .eyebrow,#recover-root .rc-bin .rc-bin-hint{display:none!important}#recover-root .rc-bin .rc-piece{flex:0 0 112px!important;width:112px!important}#recover-root .rc-controls{max-height:none!important;overflow:visible!important}#recover-root .rc-guide{max-height:none!important;overflow:visible!important}body:has(#screen-recover.active) #toast-host{top:auto!important;bottom:64px!important;left:8px!important;right:auto!important;width:min(110px,30vw)!important;max-height:40px!important;overflow:hidden!important}body:has(#screen-recover.active) #walk-chip{top:auto!important;bottom:64px!important;left:124px!important;right:auto!important;width:min(118px,32vw)!important;max-height:40px!important;overflow:hidden!important;z-index:35!important}body:has(#screen-recover.active) .ld-replay{top:auto!important;bottom:64px!important;left:auto!important;right:8px!important;max-width:112px!important;z-index:35!important}}",
      "@media (orientation:landscape) and (max-height:500px){#screen-recover.screen.active:has(#rc-close){display:flex!important;flex-direction:column!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}#recover-root:has(#rc-close){flex:1 1 auto!important;height:auto!important;max-height:100%!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;padding-bottom:0!important}#recover-root:has(#rc-close) .hub-head{flex:0 0 auto!important;margin:0 8px!important;min-height:36px!important;padding-right:0!important}#recover-root:has(#rc-close) .hub-head p{display:none!important}#recover-root:has(#rc-close) .hub-head h2{font-size:16px!important;max-width:220px!important;white-space:nowrap!important;overflow:hidden!important}#recover-root:has(#rc-close) .ic-tabs{flex-wrap:nowrap!important;overflow-x:auto!important;max-height:36px!important}#recover-root:has(#rc-close) .rc-steps{max-height:24px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-guide{max-height:32px!important;overflow:hidden!important;flex:0 0 auto!important}#recover-root:has(#rc-close) .xp-goals{display:none!important}#recover-root:has(#rc-close) .rc-board{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-bin{flex:0 0 64px!important;flex-direction:row!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;max-height:64px!important}#recover-root:has(#rc-close) .rc-bin .rc-piece{flex:0 0 88px!important;width:88px!important}#recover-root:has(#rc-close) .rc-bin .rc-bin-hint,#recover-root:has(#rc-close) .rc-bin .eyebrow{display:none!important}#recover-root:has(#rc-close) .rc-play{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-stage{flex:1 1 auto!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-hook{display:grid!important;grid-template-columns:minmax(0,1.5fr) minmax(96px,.42fr) minmax(110px,.48fr)!important;height:100%!important;min-height:0!important;gap:4px!important}#recover-root:has(#rc-close) .rc-cond,#recover-root:has(#rc-close) .rc-man,#recover-root:has(#rc-close) .rc-gear{position:static!important;width:auto!important;height:100%!important;max-height:none!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{width:100%!important;height:100%!important;max-height:none!important;min-height:0!important;object-fit:contain!important}#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important;max-height:78px!important;overflow:auto!important}body:has(#screen-recover.active):has(#rc-close) .ld-replay{top:4px!important;left:240px!important;right:auto!important;bottom:auto!important;max-width:112px!important;max-height:28px!important}body:has(#screen-recover.active):has(#rc-close) #hub-ai-fab{top:4px!important;left:360px!important;right:auto!important;bottom:auto!important}body:has(#screen-recover.active):has(#rc-close) #walk-chip,body:has(#screen-recover.active):has(#rc-close) .pf-coach,body:has(#screen-recover.active):has(#rc-close) #pf-coach-bar{top:4px!important;left:500px!important;right:auto!important;bottom:auto!important;width:min(160px,22vw)!important;max-height:28px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-steps{display:none!important}#recover-root:has(#rc-close) .rc-guide{max-height:22px!important}#recover-root:has(#rc-close) .hub-head{max-height:32px!important;min-height:0!important}#recover-root:has(#rc-close) .rc-play{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-stage{flex:1 1 auto!important;min-height:100px!important;height:auto!important;max-height:none!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-hook{height:100%!important;min-height:100px!important}#recover-root:has(#rc-close) .rc-ice-bay{flex:0 0 24px!important;height:24px!important;min-height:0!important;max-height:24px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:6px!important;max-height:44px!important;height:44px!important;overflow-x:auto!important;overflow-y:hidden!important}#recover-root:has(#rc-close) .rc-process,#recover-root:has(#rc-close) .rc-manifold-wait,#recover-root:has(#rc-close) .rc-tankp,#recover-root:has(#rc-close) .rc-alarm{display:none!important}#recover-root:has(#rc-close) .rc-switches{display:flex!important;flex:0 0 auto!important;gap:6px!important}#recover-root:has(#rc-close) #rc-close{flex:0 0 auto!important;margin:0!important}#recover-root:has(#rc-close) .rc-bin{max-width:100%!important}}}",
    "@media (max-width:800px){#recover-root .rc-bin{max-height:88px!important}#recover-root .rc-bin .rc-piece{flex:0 0 72px!important;width:72px!important;max-width:72px!important;min-width:72px!important;padding:4px!important}#recover-root .rc-bin .rc-piece img{height:36px!important;max-height:36px!important;width:100%!important;object-fit:contain!important}#recover-root .rc-bin .rc-piece span{font-size:10px!important;line-height:1.1!important}#recover-root .rc-hook .rc-unit-img{max-height:110px!important;height:auto!important}#recover-root .rc-lay{max-height:64px!important;max-width:72px!important}#recover-root .rc-empty{min-height:48px!important;font-size:11px!important}#recover-root .rc-scale-face{max-width:84px!important}#recover-root .rc-scale-face strong{font-size:14px!important}}",
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
    if (!document.getElementById("rc-size")) {
      const s2 = document.createElement("style");
      s2.id = "rc-size";
      s2.textContent = "@media (max-width:800px){#screen-recover.screen.active{display:flex!important;flex-direction:column!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;overflow-y:hidden!important}#recover-root:has(#rc-close){flex:1 1 auto!important;min-height:0!important;height:100%!important;max-height:100%!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;padding-bottom:0!important}#recover-root:has(#rc-close) .rc-board{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-play{order:1!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;overflow:auto!important}#recover-root:has(#rc-close) .rc-bin{order:2!important;flex:0 0 96px!important;height:96px!important;max-height:96px!important;border-top:2px solid #CE0034!important;overflow-x:auto!important;overflow-y:hidden!important}#recover-root:has(#rc-close) .rc-hook{display:flex!important;flex-direction:row!important;align-items:flex-end!important;justify-content:center!important;gap:8px!important;height:auto!important;width:100%!important}#recover-root:has(#rc-close) .rc-cond{flex:1 1 auto!important;width:auto!important;min-width:0!important;height:auto!important;display:flex!important;flex-direction:column!important;align-items:center!important;overflow:visible!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{width:100%!important;max-width:none!important;height:auto!important;max-height:46vh!important;min-height:200px!important;object-fit:contain!important;object-position:center bottom!important}#recover-root:has(#rc-close) .rc-beside{flex:0 0 auto!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;max-width:34%!important}#recover-root:has(#rc-close) .rc-beside .rc-lay,#recover-root:has(#rc-close) .rc-beside .rc-digi,#recover-root:has(#rc-close) .rc-beside .rc-scale-deck,#recover-root:has(#rc-close) .rc-beside .rc-tank{width:84px!important;max-width:84px!important;max-height:84px!important;height:auto!important;object-fit:contain!important}#recover-root .rc-lay:not(.machine){max-height:56px!important;max-width:72px!important}#recover-root .rc-empty{min-height:36px!important;max-height:44px!important;width:auto!important;flex:1 1 72px!important;font-size:11px!important}#recover-root .rc-bin .rc-piece,#recover-root:has(#rc-close) .rc-bin .rc-piece{flex:0 0 72px!important;width:72px!important;max-width:72px!important;min-width:72px!important;padding:4px!important}#recover-root .rc-bin .rc-piece img,#recover-root:has(#rc-close) .rc-bin .rc-piece img{height:36px!important;max-height:36px!important;width:100%!important;object-fit:contain!important}#recover-root .rc-lay{max-height:64px!important;max-width:72px!important}#recover-root .rc-scale-face{max-width:84px!important}#recover-root .rc-scale-face strong{font-size:14px!important}#recover-root .rc-digi{width:148px!important;max-width:46vw!important;margin:0!important;padding:4px 6px 0!important;background:#07090c!important;color:#e7eef4!important;font-family:ui-monospace,monospace!important;border-radius:4px!important;border:2px solid #12161b!important;box-shadow:inset 0 0 0 1px #2a323a,inset 0 8px 12px rgba(0,0,0,.55)!important}#recover-root .rc-digi-top{font-size:9px!important;letter-spacing:.06em!important;color:#c5ced6!important}#recover-root .rc-digi-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important}#recover-root .rc-digi small{display:block!important;font-size:8px!important;letter-spacing:.08em!important}#recover-root .rc-digi .lo strong{display:block!important;color:#4db2ff!important;font-size:16px!important;line-height:1!important}#recover-root .rc-digi .hi strong{display:block!important;color:#ff5a45!important;font-size:16px!important;line-height:1!important}#recover-root .rc-digi-hoses{display:flex!important;justify-content:space-between!important;height:28px!important;padding:4px 14px 0!important}#recover-root .rc-digi-hoses i{display:block!important;width:8px!important;height:28px!important;border-radius:4px!important}#recover-root .rc-digi-hoses .b{background:#3d8bfd!important}#recover-root .rc-digi-hoses .r{background:#e23b4a!important}#recover-root .rc-digi-hoses .y{background:#e8c450!important}#recover-root .rc-man{width:auto!important;flex:0 0 auto!important;overflow:visible!important}#recover-root .rc-guide{max-height:64px!important;overflow:auto!important}#recover-root:has(#rc-close) .rc-play{display:flex!important;flex-direction:column!important;overflow:hidden!important;min-height:0!important}#recover-root:has(#rc-close) .rc-stage{flex:1 1 auto!important;min-height:0!important;overflow:auto!important}#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important}#recover-root:has(#rc-close) .rc-ice-bay{flex:0 0 28px!important;max-height:28px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-guide{max-height:36px!important}}@media (min-width:801px){#recover-root:has(#rc-close) .rc-hook{display:flex!important;flex-direction:row!important;align-items:flex-end!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{max-height:52vh!important;min-height:280px!important}#recover-root:has(#rc-close) .rc-beside{max-width:220px!important}#recover-root:has(#rc-close) .rc-beside .rc-lay,#recover-root:has(#rc-close) .rc-beside .rc-digi,#recover-root:has(#rc-close) .rc-beside .rc-scale-deck{width:140px!important;max-width:140px!important;max-height:140px!important}#recover-root:has(#rc-close) .rc-stage{overflow:visible!important;height:auto!important}}body:has(#screen-recover.active) .walk-chip{top:auto!important;bottom:108px!important;left:8px!important;right:auto!important;width:108px!important;max-height:26px!important;overflow:hidden!important;z-index:20!important}body:has(#screen-recover.active) .ld-replay{top:auto!important;bottom:108px!important;right:8px!important;left:auto!important;max-height:26px!important;max-width:108px!important;overflow:hidden!important;z-index:20!important}#recover-root:has(#rc-close) .rc-stage{flex:0 0 auto!important;min-height:0!important;height:auto!important;max-height:none!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-hook{max-height:220px!important;overflow:hidden!important;align-items:flex-end!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{display:block!important;width:100%!important;height:200px!important;min-height:160px!important;max-height:200px!important;object-fit:contain!important}#recover-root:has(#rc-close) .rc-beside{max-height:200px!important;overflow-y:auto!important;overflow-x:hidden!important}#recover-root:has(#rc-close) .rc-process,#recover-root:has(#rc-close) .rc-manifold-wait,#recover-root:has(#rc-close) .rc-tankp,#recover-root:has(#rc-close) .xp-goals,#recover-root:has(#rc-close) .rc-repnote,#recover-root:has(#rc-close) .rc-guide b,#recover-root:has(#rc-close) .rc-repbar{display:none!important}#recover-root:has(#rc-close) .rc-ice-bay{flex:0 0 48px!important;max-height:48px!important;height:48px!important;overflow:hidden!important;margin:0!important;display:flex!important;align-items:center!important;justify-content:center!important}#recover-root:has(#rc-close) .rc-ice-bay.on{flex-basis:72px!important;max-height:72px!important;height:72px!important}#recover-root:has(#rc-close) .rc-ice-bay b{font-size:15px!important;letter-spacing:.04em!important}#recover-root:has(#rc-close) .rc-ice-why{display:none!important}#recover-root:has(#rc-close) .rc-guide{max-height:none!important;overflow:visible!important;margin:0 8px!important}#recover-root:has(#rc-close) .rc-nextline{display:block!important;font-size:15px!important;line-height:1.3!important}#recover-root:has(#rc-close) .rc-play{overflow:hidden!important}#recover-root .rc-close-wait{display:none!important}body:has(#screen-recover.screen.active) .walk-chip,body:has(#screen-recover.screen.active) .ld-replay{display:none!important}@media (min-width:801px){#recover-root:has(#rc-close) .rc-hook{max-height:none!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{height:auto!important;min-height:240px!important;max-height:40vh!important}#recover-root:has(#rc-close) .rc-beside{max-height:40vh!important}}#recover-root .rc-bin .rc-piece span{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:10px!important}#recover-root:has(#rc-close) .rc-board{order:1!important}#recover-root:has(#rc-close) .ic-tabs,#recover-root:has(#rc-close) .rc-steps,#recover-root:has(#rc-close) .rc-guide{order:2!important}#recover-root:has(#rc-close) .rc-guide{max-height:22px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-play{overflow:hidden!important;display:flex!important;flex-direction:column!important}#recover-root:has(#rc-close) .rc-stage{flex:1 1 auto!important;min-height:210px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{min-height:200px!important;max-height:46vh!important;display:block!important}#recover-root:has(#rc-close) .rc-process{display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;max-height:2.7em!important;font-size:13px!important;margin:0!important}#recover-root:has(#rc-close) .rc-ice-bay{max-height:48px!important;height:48px!important;flex:0 0 48px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important;max-height:none!important;overflow:visible!important}body:has(#screen-recover.active) .ld-replay{top:auto!important;bottom:232px!important;right:8px!important;left:auto!important;max-width:112px!important;max-height:36px!important;z-index:30!important}body:has(#screen-recover.active) .walk-chip,body:has(#screen-recover.active) .ld-replay{display:none!important}#recover-root:has(#rc-close) .hub-head{order:0!important;flex:0 0 auto!important;display:flex!important;min-height:36px!important;height:auto!important}#recover-root:has(#rc-close) .ic-tabs{order:1!important;flex:0 0 40px!important;max-height:40px!important}#recover-root:has(#rc-close) .rc-steps{order:2!important;flex:0 0 28px!important;max-height:28px!important}#recover-root:has(#rc-close) .rc-guide{order:3!important;flex:0 0 auto!important;max-height:44px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-board{order:4!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important}#recover-root #rc-process{display:none!important}#recover-root .rc-close-wait{display:none!important}#recover-root:has(#rc-close) .rc-stage{max-height:230px!important;overflow:hidden!important}#recover-root:has(#rc-close) .rc-hook .rc-unit-img{height:180px!important;min-height:160px!important;max-height:180px!important}#recover-root:has(#rc-close) .rc-valves{display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;gap:4px!important}#recover-root:has(#rc-close) .rc-valves .mach-switch{flex:1 1 30%!important;min-height:36px!important;height:auto!important}#recover-root:has(#rc-close) .rc-steps{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;max-width:100%!important}#recover-root #rc-close:not(.rc-close-wait){position:fixed!important;left:8px!important;right:8px!important;bottom:104px!important;z-index:40!important;display:block!important;width:auto!important;margin:0!important}";
      (document.head || document.documentElement).appendChild(s2);
      if (!document.getElementById("rc-pc")) {
        const pc = document.createElement("style");
        pc.id = "rc-pc";
        pc.textContent = "@media (min-width:801px){" +
          "#recover-root:has(#rc-close){padding-bottom:0!important;overflow:hidden!important;height:100%!important;max-height:100%!important;display:flex!important;flex-direction:column!important}" +
          "#recover-root:has(#rc-close) .hub-head{flex:0 0 36px!important;min-height:0!important;margin:0 12px!important}" +
          "#recover-root:has(#rc-close) .hub-head h2{font-size:20px!important}" +
          "#recover-root:has(#rc-close) .ic-tabs{flex:0 0 36px!important;max-height:36px!important;margin:0 10px!important}" +
          "#recover-root:has(#rc-close) .rc-steps{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-guide{flex:0 0 auto!important;max-height:32px!important;overflow:hidden!important;margin:0 12px 4px!important}" +
          "#recover-root:has(#rc-close) .rc-guide b,#recover-root:has(#rc-close) .xp-goals,#recover-root:has(#rc-close) .rc-repbar,#recover-root:has(#rc-close) .rc-repnote{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-nextline{display:block!important;font-size:16px!important}" +
          "#recover-root:has(#rc-close) .rc-board{display:grid!important;grid-template-columns:200px minmax(0,1fr)!important;flex:1 1 auto!important;min-height:0!important;max-width:none!important;width:100%!important;align-items:stretch!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-bin{max-height:none!important;height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;flex-direction:column!important}" +
          "#recover-root:has(#rc-close) .rc-bin .rc-piece{width:100%!important;max-width:none!important;min-width:0!important;flex:0 0 auto!important}" +
          "#recover-root:has(#rc-close) .rc-bin .rc-piece img{height:72px!important;max-height:72px!important;object-fit:contain!important}" +
          "#recover-root:has(#rc-close) .rc-play{display:flex!important;flex-direction:column!important;min-height:0!important;height:100%!important;overflow:hidden!important;grid-template-columns:minmax(0,1fr)!important}" +
          "#recover-root:has(#rc-close) .rc-stage{flex:1 1 auto!important;min-height:0!important;max-height:none!important;height:auto!important;overflow:hidden!important;display:flex!important;align-items:stretch!important}" +
          "#recover-root:has(#rc-close) .rc-hook{position:relative!important;display:flex!important;flex-direction:row!important;align-items:flex-end!important;justify-content:center!important;gap:18px!important;width:100%!important;height:100%!important;max-height:none!important;min-height:0!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-cond{flex:1 1 auto!important;min-width:0!important;height:100%!important;max-height:none!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important}" +
          "#recover-root:has(#rc-close) .rc-hook .rc-unit-img{display:block!important;width:auto!important;max-width:100%!important;height:min(58vh,520px)!important;min-height:min(58vh,520px)!important;max-height:none!important;object-fit:contain!important;object-position:center bottom!important}" +
          "#recover-root:has(#rc-close) .rc-beside{flex:0 0 240px!important;width:240px!important;max-width:240px!important;max-height:none!important;height:100%!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;overflow:auto!important}" +
          "#recover-root:has(#rc-close) .rc-beside .rc-lay,#recover-root:has(#rc-close) .rc-beside .rc-digi,#recover-root:has(#rc-close) .rc-beside .rc-scale-deck{width:200px!important;max-width:200px!important;max-height:180px!important;height:auto!important}" +
          "#recover-root:has(#rc-close) .rc-hoses{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}" +
          "#recover-root:has(#rc-close) .rc-ice-bay{position:static!important;align-self:auto!important;grid-column:auto!important;width:auto!important;flex:0 0 40px!important;max-height:40px!important;height:40px!important;min-height:0!important;margin:4px 0 0!important}" +
          "#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important;max-height:108px!important;overflow:auto!important}" +
          "#recover-root #rc-close:not(.rc-close-wait){position:static!important;left:auto!important;right:auto!important;bottom:auto!important;width:auto!important}" +
          "}";
        (document.head || document.documentElement).appendChild(pc);
      }
      if (!document.getElementById("rc-phone-sw")) {
        const ph = document.createElement("style");
        ph.id = "rc-phone-sw";
        ph.textContent = "@media (max-width:800px){" +
          "#screen-recover.screen.active:has(#rc-close){display:flex!important;flex-direction:column!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close){flex:1 1 auto!important;min-height:0!important;height:100%!important;max-height:100%!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;padding-bottom:0!important}" +
          "#recover-root:has(#rc-close) .rc-board{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;height:auto!important}" +
          "#recover-root:has(#rc-close) .rc-play{order:1!important;flex:1 1 auto!important;min-height:0!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;display:flex!important;flex-direction:column!important}" +
          "#recover-root:has(#rc-close) .rc-stage{flex:0 0 auto!important;height:auto!important;max-height:none!important;overflow:visible!important;touch-action:pan-y!important}" +
          "#recover-root:has(#rc-close) .rc-hook{display:flex!important;flex-direction:column!important;align-items:stretch!important;max-height:none!important;height:auto!important;overflow:visible!important;gap:8px!important}" +
          "#recover-root:has(#rc-close) .rc-hook .rc-unit-img{height:42vh!important;min-height:280px!important;max-height:none!important;width:100%!important;object-fit:contain!important;object-position:center center!important}" +
          "#recover-root:has(#rc-close) .rc-ice-bay{flex:0 0 48px!important;height:48px!important;max-height:48px!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-process{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-alarm{display:block!important;max-height:none!important;overflow:visible!important;margin:0 0 4px!important;font-size:13px!important}" +
          "#recover-root:has(#rc-close) #rc-reset:not(.rc-hide){display:flex!important;width:100%!important;min-height:52px!important;margin:0 0 6px!important;align-items:center!important;justify-content:center!important;font-size:16px!important;font-weight:800!important;background:#e8c450!important;color:#1a1408!important;border-radius:12px!important}" +
          "#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important;position:sticky!important;bottom:0!important;z-index:8!important;background:#14171a!important;max-height:none!important;overflow:visible!important;padding-top:4px!important}" +
          "#recover-root:has(#rc-close) .rc-switches{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:6px!important;overflow-x:auto!important;align-items:center!important}" +
          "#recover-root:has(#rc-close) .rc-valves{display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;gap:6px!important;overflow:visible!important;align-items:center!important}" +
          "#recover-root:has(#rc-close) .rc-switches .mach-switch{flex:0 0 auto!important;min-height:48px!important}" +
          "#recover-root:has(#rc-close) .rc-valves .mach-switch{flex:1 1 46%!important;min-width:0!important;min-height:48px!important;max-width:calc(50% - 4px)!important}" +
          "#recover-root:has(#rc-close) .rc-bin{order:2!important;flex:0 0 84px!important;height:84px!important;max-height:84px!important;overflow-x:auto!important;overflow-y:hidden!important;position:relative!important;z-index:60!important}" +
          "body:has(#screen-recover.screen.active) #drip-ear{display:none!important}" +
          "}";
        (document.head || document.documentElement).appendChild(ph);
      }
      if (!document.getElementById("rc-see")) {
        const see = document.createElement("style");
        see.id = "rc-see";
        see.textContent =
          "#recover-root:has(#rc-close) .rc-play{overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}" +
          "#recover-root:has(#rc-close) .rc-stage{flex:0 0 auto!important;height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important;touch-action:pan-y!important}" +
          "#recover-root:has(#rc-close) .rc-hook{display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;height:auto!important;max-height:none!important;overflow:visible!important;gap:8px!important}" +
          "#recover-root:has(#rc-close) .rc-cond{position:relative!important;width:100%!important;max-width:none!important;height:auto!important;max-height:none!important;overflow:visible!important;flex:0 0 auto!important;justify-content:flex-start!important}" +
          "#recover-root:has(#rc-close) .rc-hook .rc-unit-img{display:block!important;width:100%!important;height:auto!important;min-height:280px!important;max-height:46vh!important;object-fit:contain!important;object-position:center center!important}" +
          "#recover-root:has(#rc-close) .rc-hoses{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:4!important;pointer-events:none!important}" +
          "#recover-root:has(#rc-close) .rc-ports{position:absolute!important;right:8px!important;top:22%!important;z-index:8!important}" +
          "#recover-root:has(#rc-close) .rc-beside{flex:0 0 auto!important;width:100%!important;max-width:none!important;height:auto!important;max-height:none!important;overflow-x:auto!important;overflow-y:hidden!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:flex-end!important;justify-content:flex-start!important;gap:8px!important}" +
          "#recover-root:has(#rc-close) .rc-beside .rc-lay,#recover-root:has(#rc-close) .rc-beside .rc-digi,#recover-root:has(#rc-close) .rc-beside .rc-scale-deck,#recover-root:has(#rc-close) .rc-beside .rc-tank{width:112px!important;max-width:112px!important;max-height:128px!important;height:auto!important;flex:0 0 auto!important;object-fit:contain!important}" +
          "@media (min-width:801px){#recover-root:has(#rc-close) .rc-hook .rc-unit-img{min-height:360px!important;max-height:52vh!important}#recover-root:has(#rc-close) .rc-beside .rc-lay,#recover-root:has(#rc-close) .rc-beside .rc-digi,#recover-root:has(#rc-close) .rc-beside .rc-scale-deck{width:150px!important;max-width:150px!important;max-height:160px!important}}";
        (document.head || document.documentElement).appendChild(see);
      }
      if (!document.getElementById("rc-fit")) {
        const fit = document.createElement("style");
        fit.id = "rc-fit";
        fit.textContent =
          "#recover-root #rc-back,#recover-root #rr-back{position:relative!important;z-index:7!important}" +
          "#recover-root:has(#rc-close) .hub-head{position:relative!important;z-index:6!important;flex:0 0 auto!important;min-height:48px!important;height:auto!important;align-items:center!important}" +
          "#recover-root:has(#rc-close) .ic-tabs{position:relative!important;z-index:1!important}" +
          "#recover-root .rc-shot{position:relative!important;width:100%!important}" +
          "#recover-root .rc-shot .rc-hoses{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:4!important;pointer-events:none!important}" +
          "#recover-root .rc-port-dot.gold{box-shadow:0 0 0 3px #e8c450!important}" +
          "#recover-root .rc-flowkey{margin:0 8px 4px!important;font:600 12px/1.3 system-ui,sans-serif!important;color:#e8c450!important}" +
          "@media (min-width:801px){" +
          "#recover-root:has(#rc-close){overflow:hidden!important;height:100%!important;max-height:100dvh!important;display:flex!important;flex-direction:column!important}" +
          "#recover-root:has(#rc-close) .rc-board{flex:1 1 auto!important;min-height:0!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-play{flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important}" +
          "#recover-root:has(#rc-close) .rc-stage{flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-hook{display:flex!important;flex-direction:row!important;align-items:stretch!important;height:100%!important;max-height:none!important;min-height:0!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-cond{flex:1 1 auto!important;min-width:0!important;height:100%!important;max-height:none!important}" +
          "#recover-root:has(#rc-close) .rc-shot{flex:1 1 auto!important;min-height:0!important;height:100%!important}" +
          "#recover-root:has(#rc-close) .rc-hook .rc-unit-img{width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;object-fit:contain!important}" +
          "#recover-root:has(#rc-close) .rc-beside{flex:0 0 220px!important;width:220px!important;max-width:220px!important;height:100%!important;max-height:none!important;overflow:auto!important;display:flex!important;flex-direction:column!important}" +
          "#recover-root:has(#rc-close) .rc-controls{flex:0 0 auto!important;max-height:none!important;overflow:visible!important}" +
          "}" +
          "@media (max-width:800px){" +
          "#screen-recover.screen.active,#screen-recover.screen.active:has(#rc-close){display:block!important;height:auto!important;min-height:100%!important;max-height:none!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}" +
          "#recover-root,#recover-root:has(#rc-close){display:block!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;flex:none!important;padding-bottom:28px!important}" +
          "#recover-root:has(#rc-close) .rc-board,#recover-root:has(#rc-close) .rc-play,#recover-root:has(#rc-close) .rc-stage,#recover-root:has(#rc-close) .rc-cond,#recover-root:has(#rc-close) .rc-controls{display:block!important;height:auto!important;max-height:none!important;min-height:0!important;overflow:visible!important;flex:none!important;position:relative!important}" +
          "#recover-root:has(#rc-close) .rc-hook{display:flex!important;flex-direction:column!important;height:auto!important;max-height:none!important;overflow:visible!important}" +
          "#recover-root:has(#rc-close) .hub-head{min-height:0!important;margin:0 8px!important}" +
          "#recover-root:has(#rc-close) .hub-head .eyebrow{display:none!important}" +
          "#recover-root:has(#rc-close) .hub-head h2{font-size:16px!important}" +
          "#recover-root:has(#rc-close) .rc-guide{max-height:none!important;overflow:visible!important;margin:4px 8px!important}" +
          "#recover-root:has(#rc-close) .rc-hook .rc-unit-img{display:block!important;width:100%!important;height:auto!important;min-height:210px!important;max-height:none!important;object-fit:contain!important;object-position:center center!important}" +
          "#recover-root:has(#rc-close) .rc-ports{position:static!important;inset:auto!important;top:auto!important;right:auto!important;left:auto!important;width:100%!important;height:auto!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:6px!important;margin:4px 0 0!important;z-index:1!important;background:transparent!important}" +
          "#recover-root:has(#rc-close) .rc-port{flex:1 1 0!important;min-width:0!important;min-height:40px!important;font-size:12px!important;padding:4px!important}" +
          "#recover-root:has(#rc-close) .rc-steps{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-cond figcaption{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-beside{position:relative!important;z-index:1!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:flex-end!important;gap:6px!important;height:auto!important;max-height:none!important;overflow:visible!important}" +
          "#recover-root:has(#rc-close) .rc-beside .rc-lay,#recover-root:has(#rc-close) .rc-beside .rc-digi,#recover-root:has(#rc-close) .rc-beside .rc-scale-deck{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;flex:0 0 31%!important;width:31%!important;max-width:31%!important;height:auto!important;max-height:120px!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-coach{display:block!important;position:relative!important;left:auto!important;top:auto!important;width:auto!important;max-width:none!important;max-height:none!important;margin:4px 8px 0!important;overflow:visible!important;background:transparent!important;border:0!important;padding:0!important}" +
          "#recover-root .rc-coach .rc-note{margin:0!important;font:800 16px/1.25 system-ui,sans-serif!important;color:#f6f1e6!important}" +
          "#recover-root .rc-guide>b,#recover-root .rc-law,#recover-root .rc-nextline,#recover-root .rc-bin-hint,#recover-root .rc-flowkey,#recover-root .rc-manifold-wait{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-ice-why,#recover-root:has(#rc-close) .rc-feed,#recover-root:has(#rc-close) .xp-goals,#recover-root:has(#rc-close) .rc-repbar{display:none!important}" +
          "#recover-root:has(#rc-close) .rc-ice-bay{height:auto!important;max-height:none!important;margin:6px 8px!important;padding:8px 10px!important}" +
          "#recover-root:has(#rc-close) .rc-tankp{display:block!important}" +
          "#recover-root:has(#rc-close) .rc-fill{height:18px!important;margin:6px 0!important}" +
          "#recover-root:has(#rc-close) #rc-close{min-height:40px!important;margin:6px 0 0!important}" +
          "#recover-root:has(#rc-close) .rc-port-dot.hi em{top:-14px!important;left:10px!important}" +
          "#recover-root:has(#rc-close) .rc-port-dot.lo em{top:8px!important;left:12px!important}" +
          "#recover-root:has(#rc-close) .rc-port-dot em{font-size:10px!important}" +
          "#recover-root:has(#rc-close) .rc-valves{position:relative!important;z-index:3!important;background:#14171a!important}" +
          "body:has(#screen-recover.active) #toast-host{top:6px!important;bottom:auto!important;left:8px!important;right:auto!important;width:min(150px,42vw)!important;max-height:36px!important;overflow:hidden!important}" +
          "#recover-root:has(#rc-close) .rc-board{display:flex!important;flex-direction:column!important;height:auto!important;max-height:none!important;overflow:visible!important}" +
          "#recover-root:has(#rc-close) .rc-play{order:1!important}" +
          "#recover-root:has(#rc-close) .rc-bin{order:2!important;position:relative!important;z-index:2!important;flex:none!important;height:auto!important;max-height:none!important;overflow:visible!important}" +
          "#recover-root:has(#rc-close) .rc-beside{flex-wrap:wrap!important}" +
          "}";
        (document.head || document.documentElement).appendChild(fit);
      }
      if (!document.getElementById("rc-keep")) {
        const keep = document.createElement("style");
        keep.id = "rc-keep";
        keep.textContent = [
          "@keyframes rc-gold{50%{box-shadow:0 0 0 5px rgba(232,196,80,.55)}}",
          "#recover-root .rc-piece.rc-next,#recover-root .rc-target,#recover-root .rc-port.gold{animation:rc-gold 1.1s ease-in-out infinite}",
          "#recover-root:has(#rc-close) .rc-beside .rc-scale-deck{max-height:none!important;overflow:visible!important}",
          "#recover-root:has(#rc-close) .rc-beside .rc-tank{max-height:72px!important}",
          "#recover-root .rc-scale-face{display:block!important;overflow:visible!important}",
          "#recover-root .rc-scale-face strong{display:block!important;font-size:22px!important;line-height:1!important;color:#b6f5c8!important}",
          "#recover-root .rc-scale-face.live strong{color:#e8c450!important}",
          "#recover-root .rc-tank em{font-size:16px!important;font-weight:800!important;color:#b6f5c8!important}",
          "#recover-root .rc-bin .rc-piece span{white-space:normal!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;text-overflow:unset!important;height:2.2em!important}",
          "#recover-root .rc-core-chip{flex:0 0 auto!important;margin:0!important;align-self:center!important;padding:8px 10px!important;border-radius:10px!important;background:#1c2126!important;color:#e8c450!important;font:800 13px/1.2 system-ui,sans-serif!important}",
          "#recover-root:has(#rc-close) .rc-ice-bay{display:flex!important;flex-direction:row!important;align-items:center!important;position:relative!important;height:48px!important;min-height:48px!important;max-height:48px!important;padding:0 12px 0 78px!important;overflow:hidden!important}",
          "#recover-root:has(#rc-close) .rc-ice-bay>i{position:absolute!important;left:8px!important;bottom:10px!important;width:16px!important;height:12px!important;margin:0!important}",
          "#recover-root:has(#rc-close) .rc-ice-bay>i:nth-of-type(2){left:28px!important;bottom:18px!important}",
          "#recover-root:has(#rc-close) .rc-ice-bay>i:nth-of-type(3){left:48px!important;bottom:8px!important}",
          "#recover-root:has(#rc-close) .rc-ice-bay b{position:relative!important;z-index:2!important;font-size:16px!important;line-height:1!important;margin:0!important}",
          "#recover-root:has(#rc-close) .rc-ice-bay.on{height:auto!important;max-height:108px!important;min-height:72px!important;padding:8px 12px 8px 78px!important}",
          "@media (max-width:800px){",
          "#screen-recover.screen.active:has(#rc-close){display:flex!important;flex-direction:column!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}",
          "#recover-root:has(#rc-close){display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;height:100%!important;max-height:100%!important;overflow:hidden!important;padding-bottom:0!important}",
          "#recover-root:has(#rc-close) .hub-head{position:relative!important;top:auto!important;order:0!important;flex:0 0 auto!important;min-height:44px!important;height:auto!important;max-height:none!important;z-index:5!important;background:#101418!important;margin:0 8px!important}",
          "#recover-root:has(#rc-close) .ic-tabs{position:relative!important;top:auto!important;order:1!important;flex:0 0 auto!important;display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;min-height:44px!important;max-height:none!important;height:auto!important;z-index:4!important;background:#101418!important;padding:0 8px 6px!important;gap:6px!important}",
          "#recover-root:has(#rc-close) .ic-tabs .btn{flex:0 0 auto!important;min-height:36px!important;font-size:13px!important}",
          "#recover-root:has(#rc-close) .rc-steps,#recover-root:has(#rc-close) .rc-guide{display:none!important}",
          "#recover-root:has(#rc-close) .rc-board{order:2!important;display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;overflow:hidden!important}",
          "#recover-root:has(#rc-close) .rc-play{order:1!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}",
          "#recover-root:has(#rc-close) .rc-stage,#recover-root:has(#rc-close) .rc-hook,#recover-root:has(#rc-close) .rc-cond{max-height:none!important;height:auto!important;overflow:visible!important}",
          "#recover-root:has(#rc-close) .rc-hook .rc-unit-img{display:block!important;width:100%!important;height:auto!important;min-height:210px!important;max-height:none!important;object-fit:contain!important;object-position:center center!important}",
          "#recover-root:has(#rc-close) .rc-bin{order:2!important;flex:0 0 118px!important;height:118px!important;max-height:118px!important;min-height:118px!important;overflow-x:auto!important;overflow-y:hidden!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:stretch!important}",
          "#recover-root:has(#rc-close) .rc-bin .rc-piece{flex:0 0 96px!important;width:96px!important;max-width:96px!important;min-width:96px!important;height:auto!important}",
          "#recover-root:has(#rc-close) .rc-bin .rc-piece img{height:52px!important;max-height:52px!important}",
          "body:has(#screen-recover.screen.active) #toast-host{top:auto!important;bottom:126px!important;left:8px!important;right:auto!important;width:min(140px,40vw)!important;max-height:28px!important;overflow:hidden!important;z-index:40!important}",
          "}",
        ].join("");
        (document.head || document.documentElement).appendChild(keep);
      }
    }
  }

  function start(root, opts) {
    opts = opts || {};
    if (!root) return { stop: function () {} };
    if (root._rcStop) root._rcStop();
    ensureStyle();
    landTurn("screen-recover");
    let ui = 0;
    let coachMin = true;
    let note = "Tank on the scale first. Upright. Yellow top. One refrigerant. Never vent.";
    let timer = null;
    let reps = 0;
    let lastXp = 0;
    let phaseCue = "";
    const REP_XP = 25;
    const cylinders = {
      "R-410A": { lb: 17.4, F: 76 },
      "R-134a": { lb: 6.2, F: 74 },
    };
    const job = {};
    UNITS.forEach(function (unit) {
      job[unit.id] = {
        tank: false,
        machine: false,
        gauges: false,
        hoses: false,
        hoseBlue: false,
        hoseRed: false,
        hoseYellow: false,
        core: false,
        vac: false,
        vacOn: false,
        vacTrip: false,
        microns: 760000,
        vacDry: false,
        isolating: false,
        holdTicks: 0,
        holdUm: 760000,
        told500: false,
        ice: false,
        vapor: false,
        loValve: false,
        hiValve: false,
        run: false,
        trip: false,
        tripWhy: "",
        ready: false,
        moved: false,
        done: false,
        fillLock: false,
        charge: unit.charge,
        liquid: unit.ports === 2 ? Math.round(unit.charge * 0.7 * 1000) / 1000 : 0,
        hi: unit.startP,
        lo: unit.startP,
      };
    });

    function u() { return UNITS[ui]; }
    function s() { return job[u().id]; }
    function cyl() { return cylinders[u().ref]; }
    function cylOf(unit) { return cylinders[unit.ref]; }

    function hooked() {
      const j = s();
      return j.tank && j.machine && j.gauges && j.hoses && j.core;
    }

    function readOn(j) {
      return !!(j.gauges && j.hoses && j.core);
    }

    function anySide(j, unit) {
      if (unit.ports === 1) return !!j.loValve;
      return !!(j.loValve || j.hiValve);
    }

    function bothSides(j, unit) {
      if (!j.loValve) return false;
      if (unit.ports === 2 && !j.hiValve) return false;
      return true;
    }

    function missing(j) {
      const need = [];
      if (!j.tank) need.push("the recovery tank");
      if (!j.machine) need.push("the recovery machine");
      if (!j.gauges) need.push("the manifold gauges");
      if (!j.hoses) need.push("the hoses");
      if (!j.core) need.push("the service ports");
      return need;
    }

    function atLevel(j, unit) {
      if ((j.liquid || 0) > 0.05) return false;
      const loOk = unit.target >= 0 ? j.lo < 0.5 : j.lo <= unit.target + 0.85;
      const hiOk = unit.target >= 0 ? j.hi < 0.5 : j.hi <= unit.target + 1.25;
      return j.moved && j.charge <= 0.001 && loOk && hiOk;
    }

    function tankFull(unit) {
      return cylOf(unit).lb >= fillStop(unit.ref) - 0.05;
    }

    function gotLb(j, unit) {
      return Math.max(0, unit.charge - j.charge);
    }

    function heatWord(j, unit) {
      const f = cylOf(unit).F;
      if (f >= 110) return "hot";
      if (f >= 95) return "warm";
      if (j.ice) return "iced";
      return "cool";
    }

    function hosesOn(j, unit) {
      if (!j.hoseBlue || !j.hoseYellow) return false;
      if (unit.ports === 2 && !j.hoseRed) return false;
      return true;
    }

    function nextPiece(j) {
      const unit = u();
      if (tankFull(unit) && j.charge > 0.02) return "fresh";
      if (j.done && j.machine) return "";
      if (j.done && !j.vac) return "vac";
      if (!j.tank) return "tank";
      if (!j.machine) return "machine";
      if (!j.gauges) return "gauges";
      if (!j.hoseBlue) return "blue";
      if (unit.ports === 2 && !j.hoseRed) return "red";
      if (!j.hoseYellow) return "yellow";
      if (!j.core) return "core";
      if (j.done && !j.vac) return "vac";
      return "";
    }

    function shotCap(unit, j) {
      if (!j.tank && !j.machine && !j.gauges) return "Picture · bare " + unit.name + ". Nothing is hooked.";
      if (!j.machine) return "Picture · recovery tank on the scale.";
      if (!j.gauges) return "Picture · recovery machine set, outlet toward the tank.";
      if (!j.hoses) return "Picture · manifold on the unit. Hoses are not on the ports yet.";
      if (!j.core) return "Picture · hoses on the manifold. Service ports still have the cores in.";
      return "Picture · service ports open, hoses hooked, machine and tank in line.";
    }

    function snd(name) {
      try {
        const s = window.LtSfx;
        if (s && typeof s[name] === "function") s[name]();
      } catch (err) {}
    }

    function say(text) {
      var clean = String(text || "").replace(/\s+/g, " ").trim();
      var n = clean ? clean.split(" ").length : 0;
      note = n > 8 ? nextLine(s()) : clean;
      const el = root.querySelector("#rc-note");
      if (el) el.textContent = note;
    }

    function goHub() {
      stop();
      if (opts.onBack) {
        opts.onBack();
        return;
      }
      try {
        if (window.ltGo) window.ltGo("hub");
      } catch (err) {}
    }

    function stepsHtml(j) {
      const rows = [
        ["tank", "Tank", j.tank],
        ["machine", "Machine", j.machine],
        ["gauges", "Gauges", j.gauges],
        ["hoses", "Hoses", j.hoses],
        ["core", "Ports", j.core],
        ["pull", "Pull", j.ready || j.done],
        ["close", "Close", j.done],
      ];
      return '<ol class="rc-steps" id="rc-steps">' + rows.map(function (r, i) {
        const earlier = rows.slice(0, i).every(function (x) { return x[2]; });
        const cls = r[2] ? "done" : earlier ? "now" : "";
        return '<li data-step="' + r[0] + '" class="' + cls + '">' + r[1] + "</li>";
      }).join("") + "</ol>";
    }

    function repProgress(j, unit) {
      const hook = [j.tank, j.machine, j.gauges, j.hoses, j.core, !!(j.vapor && j.loValve && (unit.ports === 1 || j.hiValve))];
      const hookN = hook.filter(Boolean).length;
      let pct = (hookN / hook.length) * 70;
      if (j.done) pct = 100;
      else if (hookN === hook.length) pct += Math.max(0, Math.min(1, (unit.charge - j.charge) / unit.charge)) * 30;
      pct = Math.round(pct);
      const label = j.done
        ? "Rep complete"
        : hookN < hook.length
          ? hookN + " of " + hook.length + " on the unit"
          : Math.round(((unit.charge - j.charge) / unit.charge) * 100) + "% of the charge out";
      return { pct: pct, label: label };
    }

    function nextLine(j) {
      const unit = u();
      const n = nextPiece(j);
      if (j.vacDry) return "Held under 500.";
      if (j.done && j.vacOn) return "Under 500, shut the pump.";
      if (j.done && j.isolating) return "Watch the microns.";
      if (j.done && j.vapor) return "Shut the tank vapor.";
      if (j.done && !j.vac) return "Drag the vacuum pump on.";
      if (j.done) return "Shut vapor. Tap Vacuum.";
      if (n === "tank") return "Drag the tank on.";
      if (n === "machine") return "Drag the machine on.";
      if (n === "gauges") return "Drag the manifold on.";
      if (n === "blue") return "Drag blue onto Suction.";
      if (n === "red") return "Drag red onto Liquid.";
      if (n === "yellow") return "Drag yellow onto Inlet.";
      if (n === "core") return "Drag the service ports on.";
      if (n === "fresh") return "Drag the empty tank on.";
      if (hooked() && !j.vapor) return "Open the tank vapor.";
      if (hooked() && unit.ports === 2 && !j.hiValve) return "Open the red valve.";
      if (hooked() && !j.loValve) return "Open the blue valve.";
      if (j.trip && j.tripWhy === "pressure" && !j.ice) return "Ice the tank.";
      if (j.trip && j.tripWhy === "deadhead") return "Open the tank vapor.";
      if (j.trip && j.tripWhy === "valves") return unit.ports === 2 ? "Open both valves." : "Open the blue valve.";
      if (j.trip) return "Hit Reset trip.";
      if (hooked() && !j.run && !j.ready) return "Turn Recovery ON.";
      if (j.run) return "Watch the scale.";
      if (j.ready) return "Close the tank.";
      return "Drag the gold part.";
    }

    function portsHtml(j, unit) {
      if (!j.gauges) return "";
      const n = nextPiece(j);
      function port(slot, label, on) {
        const gold = (slot === "suction" && n === "blue") || (slot === "liquid" && n === "red") || (slot === "inlet" && n === "yellow");
        return '<button type="button" class="rc-port ' + slot + (on ? " on" : "") + (gold ? " gold" : "") + '" data-slot="' + slot + '">' + label + "</button>";
      }
      return '<div class="rc-ports">' +
        port("suction", j.hoseBlue ? "Blue · vapor" : "Vapor valve", j.hoseBlue) +
        (unit.ports === 2 ? port("liquid", j.hoseRed ? "Red · liquid" : "Liquid valve", j.hoseRed) : "") +
        port("inlet", j.hoseYellow ? "Yellow · center" : "Center port", j.hoseYellow) +
        "</div>";
    }

    function hosePath(cls, d, color) {
      return '<path id="' + cls + '" class="shut" d="' + d + '" fill="none" stroke="' + color + '" stroke-linecap="round"/>' +
        '<path id="' + cls + '-bead" class="rc-bead shut" d="' + d + '" fill="none" stroke-linecap="round"/>';
    }

    function valveCap(unit) {
      if (unit.ports === 1) return "One vapor port. Blue hose only.";
      return "Big valve is vapor. Small valve is liquid.";
    }

    function valveSpots(unit) {
      if (unit.id === "mini") return { lo: [41, 56], hi: [32, 48] };
      if (unit.id === "box") return { lo: [50, 33], hi: null };
      return { lo: [31, 67], hi: [30, 55] };
    }

    function valveDots(j, unit) {
      if (!j.gauges) return "";
      const spot = valveSpots(unit);
      const n = nextPiece(j);
      function dot(kind, xy, on, gold, name) {
        if (!xy) return "";
        return '<i class="rc-port-dot ' + kind + (on ? " on" : "") + (gold ? " gold" : "") + '" style="left:' + xy[0] + '%;top:' + xy[1] + '%"><em>' + name + "</em></i>";
      }
      return dot("lo", spot.lo, j.hoseBlue, n === "blue", "Vapor") + (unit.ports === 2 ? dot("hi", spot.hi, j.hoseRed, n === "red", "Liquid") : "");
    }

    function hosesSvg(unit, j) {
      if (!j.hoseBlue && !j.hoseRed && !(j.vac && j.core)) return "";
      const spot = valveSpots(unit);
      let svg = '<svg class="rc-hoses" viewBox="0 0 100 100" preserveAspectRatio="none">';
      if (j.hoseBlue && spot.lo) {
        const x = spot.lo[0], y = spot.lo[1];
        svg += hosePath("rc-path-lo", "M" + x + " " + y + " C " + (x - 6) + " " + (y + 12) + ", 8 90, 6 100", "#3d8bfd");
      }
      if (j.hoseRed && spot.hi) {
        const x = spot.hi[0], y = spot.hi[1];
        svg += hosePath("rc-path-hi", "M" + x + " " + y + " C " + (x + 8) + " " + (y + 14) + ", 22 88, 20 100", "#e23b4a");
      }
      if (j.vac && j.core && spot.lo) svg += hosePath("rc-path-vac", "M" + spot.lo[0] + " " + spot.lo[1] + " C " + (spot.lo[0] + 10) + " " + (spot.lo[1] - 8) + ", " + (spot.lo[0] + 18) + " 40, " + (spot.lo[0] + 22) + " 28", "#b9d7ff");
      svg += "</svg>";
      return svg;
    }

    function tankHtml(j, unit, extra) {
      const pct = j.tank ? Math.min(72, volPct(unit.ref, cyl().lb)) : 0;
      return '<div class="rc-tank ' + heatWord(j, unit) + (extra || "") + '" id="rc-tank"><img src="recover/tank.jpg?v=1" alt="" /><i class="rc-level" id="rc-level" style="height:' + pct.toFixed(0) + '%"></i><em id="rc-tf">' + (j.tank ? cylOf(unit).lb.toFixed(1) + " lb" : "") + "</em></div>";
    }

    function scaleHtml(j, unit) {
      const lb = j.tank ? cyl().lb.toFixed(1) : "0.0";
      const onDeck = j.tank && !j.ice;
      return '<div class="rc-scale-deck" data-slot="scale">' +
        (onDeck ? tankHtml(j, unit, "") : '<div class="rc-scale-wait">' + (j.ice && j.tank ? "Tank is in the ice" : "Set tank here") + "</div>") +
        '<div class="rc-scale-plat"></div>' +
        '<div class="rc-scale-face" data-scale="tank"><em>SCALE</em><strong id="rc-lb">' + lb + '</strong><span>lb</span></div></div>';
    }

    function alarmText(j) {
      if (j.vacTrip) return "Vacuum tripped. Recover first.";
      if (j.trip && j.tripWhy === "deadhead") return "Dead-head. Vapor valve shut.";
      if (j.trip && j.tripWhy === "valves") return "Dead-head. Valves shut.";
      if (j.trip && j.tripWhy === "pressure") {
        if (!j.ice) return "Tank is hot.";
        if (!j.vapor) return "Open the vapor valve.";
        return "Tank is cool.";
      }
      return "";
    }

    function fitBench() {
      var stage = root.querySelector(".rc-stage");
      if (!stage) return;
      stage.style.height = "auto";
      stage.style.maxHeight = "none";
      stage.style.minHeight = "0";
      stage.style.overflow = "visible";
    }

    function paint() {
      const unit = u();
      const j = s();
      note = nextLine(j);
      const span = gaugeSpan(unit);
      const tankP = cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
      const cut = cutout(unit.ref);
      const stopLb = fillStop(unit.ref);
      const full = tankFull(unit) && j.charge > 0.02;
      const pct = volPct(unit.ref, cyl().lb);
      const reading = readOn(j);
      const alarm = alarmText(j);
      root.innerHTML =
        '<header class="hub-head ic-head"><div><p class="eyebrow">Recovery bench</p><h2>' +
        unit.name + " · " + unit.ref + "</h2></div>" +
        '<button type="button" class="btn" id="rc-back">' + (opts.onBack ? "Recovery room" : "Shop floor") + "</button></header>" +
        '<div class="ic-tabs">' +
        UNITS.map(function (x, i) {
          return '<button type="button" class="btn' + (i === ui ? " primary" : "") + '" data-u="' + i + '">' +
            x.name + (job[x.id].done ? " · out" : "") + "</button>";
        }).join("") +
        "</div>" +
        stepsHtml(j) +
        '<div class="rc-guide' + (j.done ? " win" : "") + '"><b>Guided · ' + (j.done ? reps + " done · +" + (lastXp || REP_XP) + " XP" : "rep " + (reps + 1) + " · " + REP_XP + " XP") + "</b>" +
        (function () { const p = repProgress(j, unit); return '<div class="rc-repbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p.pct + '"><i id="rc-repfill" style="width:' + p.pct + '%"></i></div>'; })() +
        (j.done ? '<button type="button" class="btn primary" id="rc-again">Run it again</button>' : "") +
        '<div class="xp-goals" data-xp-goals><div class="xp-goals-bar"><i></i>' +
        '<b data-at="10" style="left:4%">10</b><b data-at="50" style="left:20%">50</b><b data-at="100" style="left:40%">100</b><b data-at="250" style="left:100%">250</b>' +
        '</div><span class="xp-goals-next" data-xp-goal-next></span></div>' +
        "</div>" +
        '<div class="rc-board">' +
        '<aside class="rc-bin" data-slot="bin"><p class="eyebrow">Parts</p>' +
        PIECES.map(function (p) {
          const used = (p.id === "tank" && j.tank) || (p.id === "machine" && j.machine) || (p.id === "gauges" && j.gauges) || (p.id === "blue" && j.hoseBlue) || (p.id === "red" && (j.hoseRed || unit.ports === 1)) || (p.id === "yellow" && j.hoseYellow) || (p.id === "core" && j.core) || (p.id === "vac" && j.vac);
          if (used) return "";
          const hideFresh = p.id === "fresh" && !full;
          const name = p.id === "tank" ? unit.ref + " tank" : p.id === "wrong" ? (unit.ref === "R-410A" ? "R-134a tank" : "R-410A tank") : p.id === "fresh" ? "Empty " + unit.ref + " tank" : p.name;
          return '<button type="button" class="rc-piece' + (p.id === nextPiece(j) ? " rc-next" : "") + (hideFresh ? " rc-hide" : "") + '" data-piece="' + p.id + '"' + (hideFresh ? " hidden" : "") + '><img src="' + p.img + '?v=1" alt="" /><span>' + name + "</span></button>";
        }).join("") +
        "</aside>" +
        '<div class="rc-play">' +
        '<div class="rc-stage" data-slot="unit">' +
        '<div class="rc-hook">' +
        '<figure class="rc-cond"><div class="rc-shot"><img class="rc-unit-img" src="' + unit.bare + '?v=1" alt="' + shotCap(unit, j) + '" />' +
        valveDots(j, unit) + hosesSvg(unit, j) + '</div><figcaption>' + valveCap(unit) + '</figcaption>' +
        portsHtml(j, unit) + "</figure>" +
        (function () {
          var bits = "";
          if (j.gauges) bits += '<div class="rc-digi' + (j.run && !j.trip ? " run" : "") + '">' +
            '<div class="rc-digi-top"><b>' + unit.ref + "</b></div>" +
            '<div class="rc-digi-row"><div class="lo"><small>LOW</small><strong id="rc-lo">' + (reading ? showP(j.lo) : "—") + "</strong></div>" +
            '<div class="hi"><small>HIGH</small><strong id="rc-hi">' + (reading ? showP(j.hi) : "—") + "</strong></div></div>" +
            '<div class="rc-digi-hoses" aria-hidden="true"><i class="b"></i><i class="r"></i><i class="y"></i></div></div>';
          if (j.machine) bits += '<img class="rc-lay machine' + (j.done ? " back" : "") + (j.run && !j.trip ? " run" : "") + '" src="recover/machine.jpg?v=1" alt="Recovery machine" />';
          if (j.tank) bits += scaleHtml(j, unit);
          if (j.vac) bits += '<img class="rc-lay vac' + (j.vacOn && !j.vacTrip ? " run" : "") + '" src="ms/tools/pump.jpg?v=1" alt="Vacuum pump" />';
          if (j.core) bits += '<p class="rc-core-chip">Cores out</p>';
          return bits ? '<div class="rc-beside">' + bits + "</div>" : "";
        })() +
        "</div>" +
        '<div class="rc-coach" id="rc-coach"><p class="rc-note" id="rc-note">' + note + "</p></div>" +
        "</div>" +
        '<aside class="rc-ice-bay rc-ice' + (j.ice ? " on" : "") + (j.ice && j.tank && j.run && !j.trip && j.vapor && !j.done ? " feeding" : "") + '" data-slot="ice"><b>Ice the tank</b>' +
        (j.ice && j.tank ? tankHtml(j, unit, " in-ice") : "") +
        (j.ice && j.tank ? '<p class="rc-feed" id="rc-feed">' + (j.run && !j.trip && j.vapor && !j.done ? "Moving in." : "In the ice.") + "</p>" : "") +
        "<i></i><i></i><i></i></aside>" +
        '<div class="rc-controls">' +
        '<p class="rc-process" id="rc-process"></p>' +
        '<p class="rc-alarm' + (alarm ? "" : " rc-hide") + '" id="rc-alarm"' + (alarm ? "" : " hidden") + ">" + alarm + "</p>" +
        '<button type="button" class="btn' + (j.trip || j.vacTrip ? "" : " rc-hide") + '" id="rc-reset"' + (j.trip || j.vacTrip ? "" : " hidden") + ">Reset trip</button>" +
        '<div class="rc-switches">' +
        '<button type="button" class="mach-switch rc-go' + (j.run && !j.trip ? " on" : "") + (j.trip ? " tripped" : "") + '" id="rc-run" role="switch" aria-checked="' + (j.run && !j.trip ? "true" : "false") + '"><i></i><span>' + (j.trip ? "TRIP" : j.run ? "ON" : "OFF") + "</span><em>Recovery</em></button>" +
        '<button type="button" class="mach-switch' + (j.vacOn && !j.vacTrip ? " on" : "") + (j.vacTrip ? " tripped" : "") + '" id="rc-vac" role="switch" aria-checked="' + (j.vacOn && !j.vacTrip ? "true" : "false") + '"><i></i><span>' + (j.vacTrip ? "TRIP" : j.vacOn ? "ON" : "OFF") + "</span><em>Vacuum</em></button>" +
        '<button type="button" class="btn primary rc-hide" id="rc-ice-btn" hidden>Ice the tank</button>' +
        "</div>" +
        (j.hoses
          ? '<div class="rc-valves">' +
            '<button type="button" class="mach-switch rc-valve' + (j.vapor ? " on" : "") + '" id="rc-vapor" aria-pressed="' + (j.vapor ? "true" : "false") + '"><i></i><span>' + (j.vapor ? "OPEN" : "SHUT") + "</span><em>Tank vapor</em></button>" +
            '<button type="button" class="mach-switch rc-valve' + (j.loValve ? " on" : "") + '" id="rc-lo-v" aria-pressed="' + (j.loValve ? "true" : "false") + '"><i></i><span>' + (j.loValve ? "OPEN" : "SHUT") + "</span><em>Blue valve</em></button>" +
            (unit.ports === 2
              ? '<button type="button" class="mach-switch rc-valve' + (j.hiValve ? " on" : "") + '" id="rc-hi-v" aria-pressed="' + (j.hiValve ? "true" : "false") + '"><i></i><span>' + (j.hiValve ? "OPEN" : "SHUT") + "</span><em>Red valve</em></button>"
              : "") +
            "</div>"
          : "") +
        (j.tank
          ? '<div class="rc-fill' + (pct >= 75 ? " hot" : pct >= 65 ? " warn" : "") + '"><i style="width:' + pct.toFixed(1) + '%"></i><span id="rc-got">pulled ' + gotLb(j, unit).toFixed(1) + " lb · tank " + pct.toFixed(0) + "% · stop 80%</span></div>"
          : "") +
        (j.gauges
          ? (j.vac
              ? '<div class="rc-micron"><em>MICRON</em><strong id="rc-um">' + Math.round(j.microns || 760000) + '</strong><span>µm · pump ' + (j.vacOn && !j.vacTrip ? "ON" : "OFF") + (j.vacDry ? " · HELD" : "") + "</span></div>"
              : "") +
            (j.vac && !j.vacDry ? '<button type="button" class="btn" id="rc-needle">Call it on the blue needle</button>' : "")
          : "") +
        '<button type="button" class="btn primary' + (j.ready || j.done ? "" : " rc-close-wait") + '" id="rc-close">' + (j.done ? "Tank closed" : "Close the tank") + "</button>" +
        (j.tank ? '<p class="rc-tankp" id="rc-tp">Tank ' + Math.round(tankP) + " psig · " + Math.round(cyl().F) + "°F · cutout " + cut + " · stop " + stopLb + " lb · " + heatWord(j, unit) + "</p>" : '<p class="rc-tankp" id="rc-tp"></p>') +
        "</div></div></div>";

      const back = root.querySelector("#rc-back");
      if (back) back.onclick = goHub;
      const again = root.querySelector("#rc-again");
      if (again) again.onclick = runAgain;
      markGuide();
      requestAnimationFrame(function () {
        fitBench();
        var next = root.querySelector(".rc-bin .rc-next");
        var bin = root.querySelector(".rc-bin");
        if (!next || !bin || bin.scrollWidth <= bin.clientWidth + 8) return;
        var left = next.offsetLeft - 12;
        var right = left + next.offsetWidth + 24;
        if (left < bin.scrollLeft || right > bin.scrollLeft + bin.clientWidth) bin.scrollLeft = Math.max(0, left);
      });
      root.querySelectorAll("[data-u]").forEach(function (b) {
        b.onclick = function () {
          s().run = false;
          s().vacOn = false;
          ui = +b.getAttribute("data-u");
          const now = s();
          note = now.done
            ? u().name + " is already recovered. Vacuum is a later machine. It does not fill the tank."
            : u().big
              ? "3-ton R-410A. Liquid first, then vapor. Never vent. The tank will get hot. Put it in the ice or the pressure switch opens."
              : u().ref === "R-410A"
                ? "R-410A. Liquid through the red hose first, then vapor through the blue. Never vent. Do not mix refrigerants."
                : "Smaller charge. Vapor port only. You can finish without ice. Never vent. Do not mix refrigerants.";
          paint();
        };
      });
      const run = root.querySelector("#rc-run");
      if (run) run.onclick = onRun;
      const vac = root.querySelector("#rc-vac");
      if (vac) vac.onclick = onVac;
      const reset = root.querySelector("#rc-reset");
      if (reset) reset.onclick = onReset;
      const vapor = root.querySelector("#rc-vapor");
      if (vapor) vapor.onclick = function () { flipValve("vapor", "Tank vapor valve is open. The machine has somewhere to push.", "Tank vapor valve is shut. Running now dead-heads the machine."); };
      const loV = root.querySelector("#rc-lo-v");
      if (loV) loV.onclick = function () { flipValve("loValve", "Blue valve is open. Suction can move.", "Blue valve is shut. That side will not come down."); };
      const hiV = root.querySelector("#rc-hi-v");
      if (hiV) hiV.onclick = function () { flipValve("hiValve", "Red valve is open. Liquid can move. On R-410A, liquid first is the fast pull.", "Red valve is shut. Liquid stays in the system."); };
      const close = root.querySelector("#rc-close");
      if (close) close.onclick = onClose;
      const needleBtn = root.querySelector("#rc-needle");
      if (needleBtn) needleBtn.onclick = function () {
        say("Read the micron gauge.");
      };
      const ice = root.querySelector("[data-slot=ice]");
      if (ice) ice.onclick = onIceTap;
      const iceBtn = root.querySelector("#rc-ice-btn");
      if (iceBtn) iceBtn.onclick = onIceTap;
      const cbtn = root.querySelector("#rc-coach-min");
      if (cbtn) cbtn.onclick = function (ev) {
        if (ev && ev.stopPropagation) ev.stopPropagation();
        coachMin = !coachMin;
        const box = root.querySelector("#rc-coach");
        if (box) box.classList.toggle("min", coachMin);
        cbtn.setAttribute("aria-expanded", coachMin ? "false" : "true");
        cbtn.textContent = coachMin ? "Coach +" : "Coach −";
      };
      bindDrag();
      bindPlaced(".rc-lay.machine", "machine");
      bindPlaced(".rc-lay.vac", "vac");
      if (window.ltPaintXp) window.ltPaintXp();
      sync(u(), s(), tankP, cut);
    }

    function markGuide() {
      const j = s();
      const unit = u();
      const n = nextPiece(j);
      let slot = "";
      if (!j.done) {
        if (n === "tank") slot = "scale";
        else if (n === "blue") slot = "suction";
        else if (n === "red") slot = "liquid";
        else if (n === "yellow") slot = "inlet";
        else if (n === "machine" || n === "gauges" || n === "core" || n === "fresh") slot = "unit";
      }
      if (slot) {
        const el = root.querySelector('[data-slot="' + slot + '"]');
        if (el) el.classList.add("rc-target");
      }
      if (j.trip && j.tripWhy === "pressure" && !j.ice) {
        const ice = root.querySelector("[data-slot=ice]");
        if (ice) ice.classList.add("rc-target");
        return;
      }
      if (j.done || n) return;
      if (!hooked()) return;
      let btn = "";
      if (!j.vapor) btn = "#rc-vapor";
      else if (unit.ports === 2 && !j.hiValve) btn = "#rc-hi-v";
      else if (!j.loValve) btn = "#rc-lo-v";
      else if (j.trip) btn = "#rc-reset";
      else if (!j.run && !j.ready) btn = "#rc-run";
      else if (j.ready) btn = "#rc-close";
      if (btn) {
        const b = root.querySelector(btn);
        if (b) b.classList.add("rc-target");
      }
    }

    function runAgain() {
      const unit = u();
      const j = s();
      const pulled = Math.max(0, unit.charge - j.charge);
      cyl().lb = Math.max(1.2, Math.round((cyl().lb - pulled) * 10) / 10);
      if (cyl().F > 90) cyl().F = 76;
      job[unit.id] = {
        tank: false, machine: false, gauges: false, hoses: false,
        hoseBlue: false, hoseRed: false, hoseYellow: false, core: false,
        vac: false, vacOn: false, vacTrip: false, microns: 760000, vacDry: false,
        isolating: false, holdTicks: 0, holdUm: 760000, told500: false, ice: false,
        vapor: false, loValve: false, hiValve: false, run: false, trip: false, tripWhy: "",
        ready: false, moved: false, done: false, fillLock: false,
        charge: unit.charge,
        liquid: unit.ports === 2 ? Math.round(unit.charge * 0.7 * 1000) / 1000 : 0,
        hi: unit.startP, lo: unit.startP,
      };
      note = "Charge is back in the condenser. Rep " + (reps + 1) + ". Drag the tank onto the scale.";
      phaseCue = "";
      snd("click");
      paint();
    }

    function flipValve(key, sayOpen, sayShut) {
      const j = s();
      if (j.done && key !== "vapor") {
        say("Charge is already out. Leave the manifold shut unless you are isolating the tank for the vacuum pump.");
      }
      if (j.done && key === "vapor" && !j.vapor) {
        /* opening after close is allowed so the trip lesson still works, but coach warns */
      }
      j[key] = !j[key];
      snd(j[key] ? "valve" : "click");
      if (key === "vapor" && !j.vapor && j.ready && !j.done) say("Vapor valve is shut. Close the tank.");
      else if (j.done && key === "vapor" && j.vapor) say("Tank vapor is open again. Shut it before the vacuum pump. The pump must not pull the tank back out.");
      else say(j[key] ? sayOpen : sayShut);
      const id = key === "vapor" ? "#rc-vapor" : key === "loValve" ? "#rc-lo-v" : "#rc-hi-v";
      const btn = root.querySelector(id);
      if (btn) {
        btn.classList.toggle("on", j[key]);
        btn.setAttribute("aria-pressed", j[key] ? "true" : "false");
        const lab = btn.querySelector("span");
        if (lab) lab.textContent = j[key] ? "OPEN" : "SHUT";
      }
      syncHoses(j, u());
    }

    function onRun() {
      const unit = u();
      const j = s();
      const tankP0 = cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
      const cut = cutout(unit.ref);
      if (j.done) {
        say("This charge is already in the tank. Recovery stays off. The vacuum pump is the next machine, and it does not fill the tank.");
        return;
      }
      const miss = missing(j);
      if (miss.length) {
        j.run = false;
        say("Recovery stays off. Still need " + miss.join(", ") + ". The machine does not run until the rig is hooked.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (j.trip) {
        onReset();
        return;
      }
      if (j.run) {
        j.run = false;
        snd("compressorOff");
        say("Recovery is off. Gauges hold. The tank stops filling.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (j.ready) {
        say("Suction is already at the target. Close the tank. Do not vent the last bit.");
        return;
      }
      if (!j.vapor) {
        j.run = false;
        j.vacOn = false;
        j.trip = true;
        j.tripWhy = "deadhead";
        snd("wrong");
        say("Dead-headed. The tank vapor valve is shut, so discharge pressure tripped the machine. Open the vapor valve, then hit Reset trip.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (!anySide(j, unit)) {
        j.run = false;
        j.vacOn = false;
        j.trip = true;
        j.tripWhy = "valves";
        snd("wrong");
        say(unit.ports === 2
          ? "Manifold valves are shut. The machine dead-headed and tripped. Open blue and red, then hit Reset trip."
          : "Blue valve is shut. The machine dead-headed and tripped. Open it, then hit Reset trip.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (tankFull(unit) && j.charge > 0.02) {
        say("Stop at " + fillStop(unit.ref) + " lb. That is the 80% line. Drop the empty tank on the unit. Do not fill to 100%.");
        return;
      }
      if (tankP0 >= cut) {
        j.trip = true;
        j.tripWhy = "pressure";
        j.run = false;
        snd("wrong");
        say("Tank pressure is above the cutout. Thermal trip. Ice the tank. Reset stays locked until the vapor valve is open and the tank cools.");
        sync(unit, j, tankP0, cut);
        return;
      }
      j.vacOn = false;
      j.run = true;
      j.loQ = [j.lo, j.lo, j.lo, j.lo];
      j.hiQ = [j.hi, j.hi, j.hi, j.hi];
      snd("machineOn");
      if (unit.ports === 2 && j.hiValve && !j.loValve) {
        say("Red valve only. That is liquid recovery. It is the fast pull on " + unit.ref + ". Open the blue valve next for vapor. Never vent. Refrigerant is going into the tank.");
      } else if (unit.ports === 2 && j.loValve && !j.hiValve) {
        say("Blue valve only. You are pulling vapor and leaving liquid. Open the red valve. Liquid first, then vapor. Never vent.");
      } else if (unit.big && !j.ice) {
        say("Machine is on. Liquid is leaving through the red hose, then vapor through the blue. Both needles should fall. On this 3-ton, ice the tank or the pressure switch opens. Never vent.");
      } else if (unit.ref === "R-410A") {
        say("Machine is on. Liquid first through the red hose, then vapor through the blue. Both needles fall toward 0. The gas is going into the tank, not the air. Never vent.");
      } else {
        say("Machine is on. One vapor port. The needle should fall. Refrigerant is going into the tank. Never vent. The vacuum pump is not this step.");
      }
      sync(unit, j, tankP0, cut);
    }

    function onVac() {
      const unit = u();
      const j = s();
      const tankP0 = j.tank && cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
      const cut = cutout(unit.ref);
      const beforeLb = j.tank ? cyl().lb : 0;
      if (j.vacOn) {
        j.vacOn = false;
        if ((j.microns || 760000) > 500) {
          j.isolating = false;
          j.vacDry = false;
          say("Pump is off and you are still above 500 microns. The blue needle can be on the pin anyway. That is not dry. Turn the pump back on.");
        } else {
          j.isolating = true;
          j.holdTicks = 0;
          j.holdUm = j.microns;
          say("Pump is valved off at " + Math.round(j.microns) + " microns. Watch it. A hold is the pass. A rise is a leak or moisture. The clock is not the proof.");
        }
        sync(unit, j, tankP0, cut);
        return;
      }
      if (j.vacTrip) {
        say("Vacuum pump is tripped. Hit Reset trip. It still will not push gas into the tank.");
        return;
      }
      if (!j.vac) {
        say("Vacuum pump is still in the rail. It is not the recovery machine. Drop it on the unit only after the charge is in the tank.");
        return;
      }
      if (!j.done || j.charge > 0.02) {
        j.vacOn = false;
        j.run = false;
        j.vacTrip = true;
        if (j.tank) cyl().lb = beforeLb;
        say("Do not evacuate a charged system. The vacuum pump tripped. It does not recover refrigerant into the tank. Finish recovery, close the tank, then try again.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (j.vapor) {
        j.vacOn = false;
        j.vacTrip = true;
        say("Tank vapor valve is still open. Shut it so the pump cannot suck the tank back out. Then reset.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (!j.core || !j.hoses || !j.gauges) {
        say("Hook the manifold and service ports before the vacuum pump. The pump still does not fill the tank.");
        return;
      }
      j.run = false;
      j.vacOn = true;
      j.isolating = false;
      say("Vacuum pump is on. The blue needle will pin near 30 inches long before the system is dry. Read the micron gauge. Under 500, then shut the pump off. Tank weight stays put.");
      sync(unit, j, tankP0, cut);
    }

    function onReset() {
      const unit = u();
      const j = s();
      const tankP = j.tank && cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
      if (!j.trip && !j.vacTrip) {
        say("No trip to reset. The switches are already clear.");
        return;
      }
      if (j.vacTrip && !j.trip) {
        j.vacTrip = false;
        j.vacOn = false;
        say("Vacuum trip is cleared. The pump stays off. It does not fill the recovery tank.");
        sync(unit, j, tankP, cutout(unit.ref));
        return;
      }
      if (!j.vapor && j.tripWhy === "deadhead") {
        say("Open the tank vapor valve. Reset does not clear a dead-head trip while that valve is shut.");
        return;
      }
      if (j.tripWhy === "valves" && !anySide(j, unit)) {
        say("Open the manifold valves first. Reset will not hold if blue" + (unit.ports === 2 ? " and red are" : " is") + " still shut.");
        return;
      }
      if (j.tripWhy === "pressure" && tankP >= resetAt(unit.ref)) {
        say("Vapor valve is open, but the tank is still hot. Ice the tank. Reset stays locked until the pressure falls.");
        return;
      }
      j.trip = false;
      j.tripWhy = "";
      j.run = false;
      j.vacTrip = false;
      j.vacOn = false;
      say("Trip is cleared. Recovery is off. Open any valve that is still shut, then turn recovery ON.");
      sync(unit, j, tankP, cutout(unit.ref));
    }

    function onClose() {
      const unit = u();
      const j = s();
      if (j.done) {
        say("Tank is already closed. Leave the vapor valve shut. Vacuum is next, and it does not put gas back in the tank.");
        return;
      }
      if (!j.ready || !atLevel(j, unit)) {
        if (unit.ports === 2 && (j.liquid || 0) > 0.05 && Math.round(j.lo) === 0) {
          say("0 is not empty. Open red.");
          return;
        }
        say("Not yet. Suction has to reach the target and the scale has to move before you close the tank. Recovered " + gotLb(j, unit).toFixed(1) + " lb so far.");
        return;
      }
      j.run = false;
      j.vacOn = false;
      j.vapor = false;
      j.done = true;
      reps += 1;
      lastXp = 0;
      try {
        if (window.ltAddXp) lastXp = window.ltAddXp(REP_XP, "recovery rep") || REP_XP;
      } catch (err) {}
      snd("recoverDone");
      try {
        var bay = JSON.parse(sessionStorage.getItem("rr-bay-clear") || "[]");
        if (bay.indexOf("bench") < 0) {
          bay.push("bench");
          sessionStorage.setItem("rr-bay-clear", JSON.stringify(bay));
        }
      } catch (eBay) {}
      j.trip = false;
      j.tripWhy = "";
      note = "Tank is closed. Recovered " + gotLb(j, unit).toFixed(1) + " lb. Drag the recovery machine back into the parts box, then drop the vacuum pump where it was. Shut the tank vapor valve and turn Vacuum ON. The scale stays on the weight you recovered. This is not a deep vacuum.";
      if (UNITS.every(function (x) { return job[x.id].done; })) note += " Bench is complete.";
      try {
        if (window.CurriculumTrain) window.CurriculumTrain.stamp("recover");
      } catch (err) {}
      paint();
    }

    function onIceTap() {
      const j = s();
      if (!j.tank) {
        say("Put the tank on the unit first. Then drag it into the ice, or tap the bucket.");
        return;
      }
      if (j.ice) {
        say("Tank is already in the ice. Temperature and tank pressure ease together. The 80% stop does not move.");
        return;
      }
      j.ice = true;
      snd("ice");
      note = "Tank is in the ice, still on the scale. Colder liquid, lower saturation pressure, the machine can keep pushing. Ice does not let you fill past 80%.";
      paint();
    }

    function land(id, slot) {
      const unit = u();
      const j = s();
      const piece = PIECES.find(function (p) { return p.id === id; });
      if (!piece) return;
      if (piece.kind === "bad") {
        snd("wrong");
        say(MISS[id] || "That does not land on this job.");
        return;
      }
      if (id === "vac") {
        j.vac = true;
        note = j.done
          ? "Vacuum pump is hooked to the suction port. Shut the tank vapor valve if it is open, then flip Vacuum ON. This pump does not push refrigerant into the tank."
          : "Vacuum pump is on the bench, not in the recover circuit. Leave it off while the system is charged. Recover into the tank first. Never vent.";
        snd("drop");
        paint();
        return;
      }
      if (j.done) {
        snd("wrong");
        say("This charge is already in the tank. Switch units. Do not mix refrigerants.");
        return;
      }
      if (id === "fresh") {
        if (j.charge <= 0.02) {
          say("The charge is already in a tank. 80% is the maximum fill, not a target. Do not swap just to chase it.");
          return;
        }
        if (!tankFull(unit)) {
          say("This tank is under the 80% maximum. Keep recovering into it. 80% is a stop, not a fill target.");
          return;
        }
        cylinders[unit.ref] = { lb: 1.2, F: 72 };
        j.ice = false;
        j.trip = false;
        j.tripWhy = "";
        j.fillLock = false;
        j.run = false;
        j.tank = true;
        note = "Full " + unit.ref + " tank is off the scale. Empty " + unit.ref + " tank is on the scale. Same refrigerant. Stop at 80% again. Do not mix.";
        snd("pickup");
        paint();
        return;
      }
      if (slot === "ice" && id !== "tank") {
        if (!j.tank) say("The ice is for the recovery tank. Put the tank on the scale first.");
        else say("Drag the tank itself into the ice. The other gear stays on the unit.");
        return;
      }
      if (id === "tank" && (slot === "scale" || slot === "ice" || slot === "unit")) {
        if (tankFull(unit) && j.charge > 0.02) {
          say("That " + unit.ref + " tank is already at 80%. Drop the empty tank.");
          return;
        }
        j.tank = true;
        if (slot === "ice") j.ice = true;
        note = j.ice
          ? "Tank is in the ice, still on the scale. Weigh it. 80% is the stop, not the collar."
          : "Tank is on the scale, hose end waiting. Next is the recovery machine. Outlet goes to the vapor valve, not the liquid valve.";
        snd(j.ice ? "ice" : "drop");
        paint();
        return;
      }
      if (id === "machine" && (slot === "machine" || slot === "unit")) {
        if (!j.tank) { snd("wrong"); say("Scale the tank first. You cannot call 80% without a weight."); return; }
        j.machine = true;
        note = "Machine is in front of the unit. Inlet will take the yellow hose. Outlet goes to the tank vapor valve.";
        snd("pickup");
        paint();
        return;
      }
      if (id === "gauges" && (slot === "gauges" || slot === "hoses" || slot === "unit")) {
        if (!j.machine) { snd("wrong"); say("Set the recovery machine before the manifold. The center hose needs a machine to land on."); return; }
        j.gauges = true;
        note = "Manifold is on the unit. Suction is lit. Drag the blue hose onto it.";
        snd("pickup");
        paint();
        return;
      }
      if (id === "blue" || id === "red" || id === "yellow") {
        if (!j.gauges) { snd("wrong"); say("Set the manifold first. Hoses land on the ports, not on a bare cabinet."); return; }
        const want = nextPiece(j);
        if (id !== want) {
          snd("wrong");
          say(want === "blue" ? "Blue first. Fat vapor line, suction port." : want === "red" ? "Red next. Skinny liquid line." : "Yellow last. Center hose onto the machine inlet.");
          return;
        }
        const slotWant = id === "blue" ? "suction" : id === "red" ? "liquid" : "inlet";
        if (slot !== slotWant) {
          snd("wrong");
          say(id === "blue" ? "Blue does not go there. Drop it on Suction." : id === "red" ? "Red does not go there. Drop it on Liquid." : "Yellow does not go there. Drop it on Inlet.");
          return;
        }
        if (id === "blue") j.hoseBlue = true;
        if (id === "red") j.hoseRed = true;
        if (id === "yellow") j.hoseYellow = true;
        j.hoses = hosesOn(j, unit);
        note = id === "blue" && unit.ports === 2
          ? "Blue is on suction. Red hose onto Liquid next."
          : id === "blue"
            ? "Blue is on the vapor port. This reach-in has no liquid port. Yellow onto Inlet."
            : id === "red"
              ? "Red is on liquid. Yellow hose onto the machine inlet."
              : unit.ports === 2
                ? "Yellow is on the inlet. Blue, red, and yellow are hooked. Pull the cores."
                : "Yellow is on the inlet. Pull the core.";
        snd(j.hoses ? "correct" : "hose");
        paint();
        return;
      }
      if (id === "core" && (slot === "core" || slot === "hoses" || slot === "unit")) {
        if (!j.hoses) { snd("wrong"); say("Hoses first. The service ports take the hoses, then the cores come out under them."); return; }
        j.core = true;
        note = unit.ports === 2
          ? "Service ports are open. Cores are out so the hoses can flow. Open the tank vapor valve and the manifold. Liquid through red first, then vapor through blue. A shut vapor valve dead-heads the machine."
          : "Service port is open. Core is out. Open the vapor valve and the blue valve, then turn the machine on. A shut valve moves nothing.";
        if (unit.big) note += " On this 3-ton, ice the tank.";
        snd("correct");
        paint();
        return;
      }
      say("Drop it on the picture of the unit. Tank, machine, gauges, hoses, then the service ports.");
      snd("wrong");
    }

    function stow(id) {
      const j = s();
      if (id === "machine") {
        if (j.run && !j.trip) {
          say("Turn the recovery machine OFF before you unhook it.");
          return;
        }
        j.machine = false;
        j.run = false;
        note = j.done
          ? "Recovery machine is back in the parts box. Drop the vacuum pump on the unit. Shut the tank vapor valve, then turn Vacuum ON. The scale stays on the weight you pulled."
          : "Recovery machine is back in the parts box. The center hose is off it.";
        paint();
        return;
      }
      if (id === "vac") {
        if (j.vacOn && !j.vacTrip) {
          say("Turn the vacuum pump OFF before you put it back.");
          return;
        }
        j.vac = false;
        j.vacOn = false;
        j.vacTrip = false;
        note = "Vacuum pump is back in the parts box.";
        paint();
      }
    }

    function bindPlaced(sel, id) {
      const el = root.querySelector(sel);
      if (!el) return;
      el.onpointerdown = function (e) {
        if (e.button && e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const ghost = document.createElement("div");
        ghost.className = "rc-ghost";
        ghost.textContent = id === "vac" ? "Vacuum pump" : "Recovery machine";
        document.body.appendChild(ghost);
        function move(ev) {
          ghost.style.left = ev.clientX + "px";
          ghost.style.top = ev.clientY + "px";
          root.querySelectorAll("[data-slot]").forEach(function (n) { n.classList.remove("over"); });
          const hit = hitSlot(ev.clientX, ev.clientY, ghost);
          if (hit) hit.classList.add("over");
        }
        function up(ev) {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
          const hit = hitSlot(ev.clientX, ev.clientY, ghost);
          if (ghost.parentNode) ghost.remove();
          root.querySelectorAll("[data-slot]").forEach(function (n) { n.classList.remove("over"); });
          if (hit && hit.getAttribute("data-slot") === "bin") stow(id);
          else say("Drop it in the parts box on the left.");
        }
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        move(e);
      };
    }

    function bindDrag() {
      root.querySelectorAll("[data-piece]").forEach(function (el) {
        el.onpointerdown = function (e) {
          if (e.button && e.button !== 0) return;
          let dragged = false;
          let scrolling = false;
          const id = el.getAttribute("data-piece");
          const bin = el.closest(".rc-bin");
          const horiz = !!(bin && bin.scrollWidth > bin.clientWidth + 8);
          const vert = !!(bin && !horiz && bin.scrollHeight > bin.clientHeight + 8);
          let ghost = null;
          function move(ev) {
            const dx = ev.clientX - e.clientX;
            const dy = ev.clientY - e.clientY;
            if (!dragged && !scrolling && Math.hypot(dx, dy) > 8) {
              const along = (horiz && Math.abs(dx) >= Math.abs(dy)) || (vert && Math.abs(dy) > Math.abs(dx));
              if (along) {
                scrolling = true;
                return;
              }
              dragged = true;
              try { ev.preventDefault(); } catch (err) {}
              try { el.setPointerCapture(e.pointerId); } catch (err2) {}
              ghost = document.createElement("div");
              ghost.className = "rc-ghost";
              ghost.innerHTML = el.innerHTML;
              document.body.appendChild(ghost);
            }
            if (!dragged || !ghost) return;
            ghost.style.left = ev.clientX + "px";
            ghost.style.top = ev.clientY + "px";
            root.querySelectorAll("[data-slot]").forEach(function (n) { n.classList.remove("over"); });
            const hit = hitSlot(ev.clientX, ev.clientY, ghost);
            if (hit) hit.classList.add("over");
          }
          function up(ev) {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", up);
            el.removeEventListener("pointercancel", up);
            const hit = ghost ? hitSlot(ev.clientX, ev.clientY, ghost) : null;
            if (ghost && ghost.parentNode) ghost.remove();
            root.querySelectorAll("[data-slot]").forEach(function (n) { n.classList.remove("over"); });
            if (scrolling) return;
            if (!dragged) {
              const n = nextPiece(s());
              if (id === n && id === "blue") land(id, "suction");
              else if (id === n && id === "red") land(id, "liquid");
              else if (id === n && id === "yellow") land(id, "inlet");
              else if (id === "blue" || id === "red" || id === "yellow") say("Drag that hose onto the lit port. Blue is suction. Red is liquid. Yellow is the inlet.");
              else land(id, "unit");
            } else if (hit) land(id, hit.getAttribute("data-slot"));
            else say("Drop it on the picture of the unit.");
          }
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerup", up);
          el.addEventListener("pointercancel", up);
        };
      });
      const tank = root.querySelector("#rc-tank");
      if (tank && s().tank && !s().ice) {
        tank.onpointerdown = function (e) {
          e.preventDefault();
          e.stopPropagation();
          const ghost = document.createElement("div");
          ghost.className = "rc-ghost";
          ghost.textContent = "Tank";
          document.body.appendChild(ghost);
          function move(ev) {
            ghost.style.left = ev.clientX + "px";
            ghost.style.top = ev.clientY + "px";
          }
          function up(ev) {
            tank.removeEventListener("pointermove", move);
            tank.removeEventListener("pointerup", up);
            const hit = hitSlot(ev.clientX, ev.clientY, ghost);
            if (ghost.parentNode) ghost.remove();
            if (hit && hit.getAttribute("data-slot") === "ice") {
              s().ice = true;
              note = "Tank is in the ice, still on the scale. Temperature falls. Tank pressure falls with it. The 80% line does not move.";
              paint();
            } else {
              say("Drag the tank onto the ice bucket beside the bench.");
            }
          }
          tank.addEventListener("pointermove", move);
          tank.addEventListener("pointerup", up);
          try { tank.setPointerCapture(e.pointerId); } catch (err) {}
          move(e);
        };
      }
    }

    function hitSlot(x, y, ghost) {
      if (!document.elementFromPoint) return null;
      ghost.style.display = "none";
      const n = document.elementFromPoint(x, y);
      ghost.style.display = "";
      return n && n.closest ? n.closest("[data-slot]") : null;
    }

    function settleTemp(j, unit) {
      const running = j.run && !j.trip;
      if (!j.tank) return;
      if (j.ice) jF(unit, (36 - cylOf(unit).F) * 0.12);
      else if (running && unit.big) jF(unit, 1.35);
      else if (running) jF(unit, 0.22);
      else jF(unit, (74 - cylOf(unit).F) * 0.02);
      if (cylOf(unit).F < 33) cylOf(unit).F = 33;
      if (cylOf(unit).F > 160) cylOf(unit).F = 160;
    }

    function jF(unit, delta) {
      cylOf(unit).F += delta;
    }

    function creep(cur, live, step) {
      const gap = live - cur;
      if (Math.abs(gap) <= step) return live;
      return cur + Math.sign(gap) * step;
    }

    function delayed(q, live) {
      q.push(live);
      if (q.length < 5) return q[0];
      return q.shift();
    }

    function pullVac(j) {
      const vacTarget = -14.4;
      j.lo = creep(j.lo, vacTarget, 0.28);
      j.hi = creep(j.hi, vacTarget, 0.18);
      const now = j.microns || 760000;
      j.microns = Math.max(280, now * 0.78);
    }

    function tick() {
      const unit = u();
      const j = s();
      if (!j.tank && !j.gauges) return;
      settleTemp(j, unit);
      let tankP = j.tank && cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
      const cut = cutout(unit.ref);
      const limit = fillStop(unit.ref);

      if (j.done) {
        if (j.isolating && !j.vacOn && !j.vacDry) {
          j.holdTicks = (j.holdTicks || 0) + 1;
          j.microns = j.holdUm;
          if (j.holdTicks >= 12) {
            j.vacDry = true;
            j.isolating = false;
            snd("recoverDone");
            say("Held at " + Math.round(j.holdUm) + " microns. Dry and tight. Recovery is finished. The scale did not move. Go back and open Charge it to weigh the charge in.");
          }
        }
        if (j.vacOn && !j.vacTrip) {
          if (j.vapor || j.charge > 0.02) {
            j.vacOn = false;
            j.vacTrip = true;
            say("Vacuum pump tripped. Isolate the tank. This pump does not recover gas into it.");
          } else {
            const held = cyl().lb;
            pullVac(j);
            cyl().lb = held;
            if (j.microns <= 500 && !j.told500) {
              j.told500 = true;
              say("Under 500 microns. The blue needle pinned way before this. Shut the pump off and watch the micron gauge. Thirty minutes is not the proof.");
            }
          }
        }
        tankP = j.tank && cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
        sync(unit, j, tankP, cut);
        return;
      }

      if (!hooked()) {
        sync(unit, j, tankP, cut);
        return;
      }

      if (j.vacOn && !j.vacTrip) {
        j.vacOn = false;
        j.vacTrip = true;
        say("Vacuum pump tripped. The system is still charged. It does not push refrigerant into the tank.");
      }

      if (j.run && !j.trip) {
        if (!j.vapor) {
          j.run = false;
          j.trip = true;
          j.tripWhy = "deadhead";
          snd("wrong");
          say("Dead-heading. The vapor valve shut while the machine was running. It tripped. Open the vapor valve, then hit Reset trip.");
        } else if (!anySide(j, unit)) {
          j.run = false;
          j.trip = true;
          j.tripWhy = "valves";
          snd("wrong");
          say(unit.ports === 2
            ? "Both manifold valves shut. High-pressure trip. Open blue and red, then hit Reset trip."
            : "Blue valve shut. High-pressure trip. Open it, then hit Reset trip.");
        } else if (tankP >= cut) {
          j.run = false;
          j.trip = true;
          j.tripWhy = "pressure";
          snd("wrong");
          say("Thermal trip. Tank pressure hit the cutout. Drag the tank into the ice. Open the vapor valve if it is shut, then hit Reset trip.");
        } else if (cyl().lb >= limit - 0.05 && j.charge > 0.02) {
          j.run = false;
          j.fillLock = true;
          say("Stop at " + limit + " lb of " + unit.ref + ". The tank is at 80%. Drop the empty tank on the unit. Ice does not raise this stop.");
        } else {
          const rate = unit.charge >= 5 ? 0.068 : unit.charge >= 2 ? 0.052 : 0.038;
          let side = 1;
          if (unit.ports === 2 && j.hiValve && !j.loValve) side = 1.25;
          else if (unit.ports === 2 && j.loValve && !j.hiValve) side = 0.45;
          let ceiling = j.charge;
          if (unit.ports === 2 && j.loValve && !j.hiValve) ceiling = Math.max(0, j.charge - (j.liquid || 0));
          let flow = Math.min(ceiling, (j.ice ? rate * 1.05 : rate) * side, Math.max(0, limit - cyl().lb));
          if (flow < 0) flow = 0;
          j.charge -= flow;
          cyl().lb += flow;
          if (!(unit.ports === 2 && j.loValve && !j.hiValve) && j.liquid > 0) {
            const take = unit.ports === 2 && j.loValve && j.hiValve ? flow * 0.7 : flow;
            j.liquid = Math.max(0, j.liquid - take);
          }
          if (j.charge < 0.0001) j.charge = 0;
          if (cyl().lb > limit) cyl().lb = limit;
          if (flow > 0.0001) j.moved = true;
          const sides = sideP(j, unit);
          const liquidLeft = unit.ports === 2 && (j.liquid || 0) > 0.05;
          if (!j.loQ) j.loQ = [];
          if (!j.hiQ) j.hiQ = [];
          const loAim = delayed(j.loQ, sides.lo);
          const hiAim = delayed(j.hiQ, sides.hi);
          if (j.hoseBlue) j.lo = creep(j.lo, loAim, liquidLeft ? 0.45 : 4);
          if (unit.ports === 1) j.hi = creep(j.hi, loAim, liquidLeft ? 0.4 : 3);
          else if (j.hoseRed) j.hi = creep(j.hi, hiAim, liquidLeft ? 0.35 : 6);
          if (cyl().lb >= limit - 0.05 && j.charge > 0.02) {
            if (!j.fillLock) snd("wrong");
            j.run = false;
            j.fillLock = true;
            say("Stop at " + limit + " lb of " + unit.ref + ". The tank is at 80%. Drop the empty tank on the unit. Ice does not raise this stop.");
          } else if (bothSides(j, unit) && atLevel(j, unit)) {
            if (!j.ready) snd("badge");
            j.ready = true;
            j.run = false;
            say(unit.target >= 0
              ? "0 psig, and the scale shows " + gotLb(j, unit).toFixed(1) + " lb recovered. The needle is not the proof — the weight is. Liquid is out. Close the tank. Never vent."
              : "Suction is at about 4 in Hg and the scale moved. Close the tank. Never vent.");
          } else if (unit.ports === 2 && j.loValve && !j.hiValve && (j.liquid || 0) > 0.05 && (j.charge - j.liquid) <= 0.08 && Math.round(j.lo) === 0) {
            if (phaseCue !== "fake0") { phaseCue = "fake0"; snd("wrong"); }
            say("0 is not empty. Open red.");
          } else if (unit.ports === 2 && j.hiValve && !j.loValve && j.charge < unit.charge * 0.35) {
            if (phaseCue !== "vapor") { phaseCue = "vapor"; snd("correct"); }
            say("Liquid is about out. Open the blue valve and pull the vapor. Never vent.");
          }
        }
      }
      tankP = cyl().lb > 0.3 ? satP(unit.ref, cyl().F) : 0;
      sync(unit, j, tankP, cut);
    }

    function syncHoses(j, unit) {
      const flow = j.run && !j.trip && j.vapor;
      function cls(open) { return open ? (flow ? "flow" : "open") : "shut"; }
      function bead(open) {
        const on = open && flow;
        return "rc-bead " + (on ? "flow" : "shut");
      }
      const lo = root.querySelector("#rc-path-lo");
      const hi = root.querySelector("#rc-path-hi");
      const y = root.querySelector("#rc-path-y");
      const v = root.querySelector("#rc-path-v");
      const vac = root.querySelector("#rc-path-vac");
      const liquidLeft = (j.liquid || 0) > 0.05;
      if (lo) lo.setAttribute("class", j.loValve ? (flow && !liquidLeft ? "flow" : "open") : "shut");
      if (hi) hi.setAttribute("class", j.hiValve ? (flow && liquidLeft ? "flow" : "open") : "shut");
      if (y) y.setAttribute("class", cls(flow || j.hoses));
      if (v) v.setAttribute("class", flow && j.vapor ? "flow" : (j.vapor ? "open" : "shut"));
      if (vac) vac.setAttribute("class", j.vacOn && !j.vacTrip ? "flow" : "open");
      const loB = root.querySelector("#rc-path-lo-bead");
      const hiB = root.querySelector("#rc-path-hi-bead");
      const yB = root.querySelector("#rc-path-y-bead");
      const vB = root.querySelector("#rc-path-v-bead");
      if (loB) loB.setAttribute("class", bead(j.loValve && !liquidLeft));
      if (hiB) hiB.setAttribute("class", bead(j.hiValve && liquidLeft));
      if (yB) yB.setAttribute("class", bead(true));
      if (vB) vB.setAttribute("class", bead(j.vapor));
    }

    function phaseText(j, unit) {
      if (j.done || (j.ready && !j.run)) return "Recovered " + gotLb(j, unit).toFixed(1) + " lb. Needles are at the recovery level. The scale is the proof. Close the tank. Never vent.";
      if (j.fillLock) return "80% stop. This tank is full. Put an empty tank of the same refrigerant on the scale. Ice does not raise 80%.";
      if (j.trip && j.tripWhy === "pressure") return "Tank pressure hit the cutout. The machine stopped pushing. Ice the tank, then reset.";
      if (j.trip && j.tripWhy === "deadhead") return "Dead-headed. The vapor valve was shut, so the machine had nowhere to push the refrigerant.";
      if (!hooked()) return "Nothing moves yet. Tank on the scale, machine in line, gauges beside the condenser, blue and red on the service valves, yellow to the inlet, cores out.";
      if (!j.vapor) return "Open the tank vapor valve. Shut, the machine dead-heads the second you turn it on.";
      if (!j.run) {
        if (unit.ports === 2 && !j.hiValve) return "Open the red valve. Liquid first. Recovery stays off until the valves are open.";
        if (!j.loValve) return "Open the blue valve. Then turn Recovery ON.";
        return "Turn Recovery ON. Liquid leaves through the red hose first. Vapor follows through the blue. The yellow hose pushes it into the tank.";
      }
      if (unit.ports === 2 && (j.liquid || 0) > 0.05 && j.hiValve) return "Liquid recovery. Red hose is taking liquid out of the condenser. " + (j.liquid || 0).toFixed(1) + " lb of liquid is still in the system. Tank has " + cyl().lb.toFixed(1) + " lb.";
      if (unit.ports === 2 && (j.liquid || 0) > 0.05 && !j.hiValve) return "Vapor only. Suction can fall to 0 while liquid is still in the condenser. Open the red valve. That is not empty.";
      if (j.charge > 0.05) return "Vapor recovery. Blue hose is pulling vapor. Both needles fall toward 0. Yellow hose pushes it into the tank. " + j.charge.toFixed(1) + " lb still in the system." + (unit.big && !j.ice ? " The tank is warming. Ice it before the pressure switch opens." : "");
      return "Almost out. Hold it until the needles sit on 0 and the scale stops climbing.";
    }

    function sync(unit, j, tankP, cut) {
      const span = gaugeSpan(unit);
      const reading = readOn(j);
      const lo = root.querySelector("#rc-lo");
      const hi = root.querySelector("#rc-hi");
      const lb = root.querySelector("#rc-lb");
      const tf = root.querySelector("#rc-tf");
      const tp = root.querySelector("#rc-tp");
      const nLo = root.querySelector(".rc-needle.lo");
      const nHi = root.querySelector(".rc-needle.hi");
      if (lo) lo.textContent = reading ? showP(j.lo) : "—";
      if (hi) hi.textContent = reading ? showP(j.hi) : "—";
      const um = root.querySelector("#rc-um");
      if (um) {
        um.textContent = String(Math.round(j.microns || 760000));
        const tag = um.nextElementSibling;
        if (tag) tag.textContent = "µm · pump " + (j.vacOn && !j.vacTrip ? "ON" : "OFF") + (j.vacDry ? " · HELD" : "");
      }
      if (nLo) nLo.style.transform = "rotate(" + needle(reading ? j.lo : 0, span).toFixed(1) + "deg)";
      if (nHi) nHi.style.transform = "rotate(" + needle(reading ? j.hi : 0, span).toFixed(1) + "deg)";
      if (lb) lb.textContent = j.tank ? cylOf(unit).lb.toFixed(1) : "0.0";
      if (tf) tf.textContent = j.tank ? cylOf(unit).lb.toFixed(1) + " lb" : "";
      const face = root.querySelector(".rc-scale-face");
      if (face) face.classList.toggle("live", !!(j.run && !j.trip));
      if (tp && j.tank) tp.textContent = "Tank " + Math.round(tankP) + " psig · " + Math.round(cylOf(unit).F) + "°F · cutout " + cut + " · stop " + fillStop(unit.ref) + " lb · " + heatWord(j, unit);
      const tank = root.querySelector("#rc-tank");
      if (tank) {
        tank.classList.remove("hot", "warm", "iced", "cool");
        tank.classList.add(heatWord(j, unit));
        if (j.ice) tank.classList.add("in-ice");
      }
      const lvl = root.querySelector("#rc-level");
      if (lvl && j.tank) lvl.style.height = Math.min(72, volPct(unit.ref, cylOf(unit).lb)).toFixed(0) + "%";
      const proc = root.querySelector("#rc-process");
      if (proc) proc.textContent = phaseText(j, unit);
      const prog = repProgress(j, unit);
      const repFill = root.querySelector("#rc-repfill");
      const repNote = root.querySelector("#rc-repnote");
      const repBar = root.querySelector(".rc-repbar");
      if (repFill) repFill.style.width = prog.pct + "%";
      if (repNote) repNote.textContent = prog.label;
      if (repBar) repBar.setAttribute("aria-valuenow", String(prog.pct));
      const drop = root.querySelector("#rc-drop");
      if (drop) {
        if (j.run && !j.trip && reading && (j.liquid || 0) > 0.05 && j.hiValve) drop.textContent = "Blue " + showP(j.lo) + " and falling. Red " + showP(j.hi) + " — liquid is still in the condenser.";
        else if (j.run && !j.trip && reading && j.charge > 0.05) drop.textContent = "Vapor. Blue " + showP(j.lo) + " · Red " + showP(j.hi) + ". Both needles are falling toward 0.";
        else if (j.ready || j.done) drop.textContent = "At the recovery level. Blue " + showP(j.lo) + " · Red " + showP(j.hi) + ".";
        else drop.textContent = "";
      }
      const bay = root.querySelector(".rc-ice-bay");
      const feeding = !!(j.ice && j.tank && j.run && !j.trip && j.vapor && !j.done);
      if (bay) bay.classList.toggle("feeding", feeding);
      const feed = root.querySelector("#rc-feed");
      if (feed) feed.textContent = feeding ? "Moving in." : "In the ice.";
      const fill = root.querySelector(".rc-fill");
      if (fill) {
        const pct = volPct(unit.ref, cylOf(unit).lb);
        fill.classList.toggle("hot", pct >= 75);
        fill.classList.toggle("warn", pct >= 65 && pct < 75);
        const bar = fill.querySelector("i");
        const lab = fill.querySelector("span");
        if (bar) bar.style.width = pct.toFixed(1) + "%";
        if (lab) lab.textContent = "pulled " + gotLb(j, unit).toFixed(1) + " lb · tank " + pct.toFixed(0) + "% · stop 80%";
      }
      const btn = root.querySelector("#rc-run");
      if (btn) {
        const on = !!(j.run && !j.trip);
        btn.classList.toggle("on", on);
        btn.classList.toggle("tripped", !!j.trip);
        btn.setAttribute("aria-checked", on ? "true" : "false");
        const lab = btn.querySelector("span");
        if (lab) lab.textContent = j.trip ? "TRIP" : j.run ? "ON" : "OFF";
        btn.disabled = false;
      }
      const vacBtn = root.querySelector("#rc-vac");
      if (vacBtn) {
        const on = !!(j.vacOn && !j.vacTrip);
        vacBtn.classList.toggle("on", on);
        vacBtn.classList.toggle("tripped", !!j.vacTrip);
        vacBtn.setAttribute("aria-checked", on ? "true" : "false");
        const lab = vacBtn.querySelector("span");
        if (lab) lab.textContent = j.vacTrip ? "TRIP" : j.vacOn ? "ON" : "OFF";
      }
      const reset = root.querySelector("#rc-reset");
      if (reset) {
        const show = !!(j.trip || j.vacTrip);
        reset.classList.toggle("rc-hide", !show);
        reset.hidden = !show;
      }
      const iceBtn = root.querySelector("#rc-ice-btn");
      if (iceBtn) {
        const showIce = !!(j.trip && j.tripWhy === "pressure" && !j.ice);
        iceBtn.classList.toggle("rc-hide", !showIce);
        iceBtn.hidden = !showIce;
      }
      const closeBtn = root.querySelector("#rc-close");
      if (closeBtn) closeBtn.classList.toggle("rc-close-wait", !(j.ready || j.done));
      const alarm = root.querySelector("#rc-alarm");
      if (alarm) {
        const msg = alarmText(j);
        alarm.textContent = msg;
        alarm.classList.toggle("rc-hide", !msg);
        alarm.hidden = !msg;
      }
      const fresh = root.querySelector('[data-piece="fresh"]');
      if (fresh) {
        const show = tankFull(unit) && j.charge > 0.02;
        fresh.classList.toggle("rc-hide", !show);
        fresh.hidden = !show;
        fresh.classList.toggle("rc-next", show);
      }
      const mac = root.querySelector(".rc-lay.machine");
      if (mac) mac.classList.toggle("run", !!(j.run && !j.trip));
      const vacLay = root.querySelector(".rc-lay.vac");
      if (vacLay) vacLay.classList.toggle("run", !!(j.vacOn && !j.vacTrip));
      const man = root.querySelector(".rc-digi");
      if (man) man.classList.toggle("run", !!((j.run && !j.trip) || (j.vacOn && !j.vacTrip)));
      syncHoses(j, unit);
      const rows = [
        ["tank", j.tank],
        ["machine", j.machine],
        ["gauges", j.gauges],
        ["hoses", j.hoses],
        ["core", j.core],
        ["pull", j.ready || j.done],
        ["close", j.done],
      ];
      rows.forEach(function (r, i) {
        const li = root.querySelector('[data-step="' + r[0] + '"]');
        if (!li) return;
        const earlier = rows.slice(0, i).every(function (x) { return x[1]; });
        li.classList.toggle("done", !!r[1]);
        li.classList.toggle("now", !r[1] && earlier);
      });
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      if (parkTimer) clearTimeout(parkTimer);
      if (parkTimer2) clearTimeout(parkTimer2);
      window.removeEventListener("resize", fitBench);
      if (root && root.style) root.style.paddingBottom = "";
    }

    function parkChips() {
      var walk = document.getElementById("walk-chip");
      var demo = document.querySelector(".ld-replay");
      if (walk) {
        walk.style.setProperty("position", "fixed", "important");
        walk.style.setProperty("top", "auto", "important");
        walk.style.setProperty("bottom", "232px", "important");
        walk.style.setProperty("left", "8px", "important");
        walk.style.setProperty("right", "auto", "important");
      }
      if (demo) {
        demo.style.setProperty("position", "fixed", "important");
        demo.style.setProperty("top", "auto", "important");
        demo.style.setProperty("bottom", "232px", "important");
        demo.style.setProperty("right", "8px", "important");
        demo.style.setProperty("left", "auto", "important");
      }
    }
    var parkTimer = setTimeout(parkChips, 500);
    var parkTimer2 = setTimeout(parkChips, 1200);

    paint();
    timer = setInterval(tick, 200);
    window.addEventListener("resize", fitBench);
    root._rcStop = stop;
    return { stop: stop };
  }

  window.RecoverLab = { start: start };
})();
