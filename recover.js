/* Recovery bench. Drag the real hookup onto the unit. Gauges fall. The tank heats. Ice is for the big system. */
(function () {
  const UNITS = [
    {
      id: "split",
      name: "3-ton split",
      ref: "R-410A",
      charge: 7.5,
      startP: 158,
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
      startP: 150,
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
      startP: 72,
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
    { id: "hoses", name: "Blue / red / yellow", kind: "hoses", img: "recover/hoses.jpg" },
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
    junk: "Never recover into a disposable. Gray body, yellow top. One refrigerant. Stop at 80% by weight. Never vent.",
    n2: "Nitrogen is for the pressure test. It is not a recovery cylinder.",
    wrong: "That cylinder is a different refrigerant. One gas per tank. Do not mix.",
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
    return unit.ref === "R-134a" ? 150 : Math.max(220, unit.startP + 40);
  }

  function needle(p, span) {
    const x = Math.max(-30, Math.min(span, p));
    return -118 + ((x + 30) / (span + 30)) * 236;
  }

  function liveP(j, unit) {
    let frac;
    if (unit.ports === 2 && j.loValve && !j.hiValve && (j.liquid || 0) > 0.05) {
      const vaporCap = Math.max(0.05, unit.charge - j.liquid);
      const vaporLeft = Math.max(0, j.charge - j.liquid);
      frac = vaporLeft / vaporCap;
    } else {
      frac = Math.max(0, Math.min(1, j.charge / unit.charge));
    }
    return unit.target + (unit.startP - unit.target) * Math.pow(frac, 0.7);
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
      "#recover-root .ic-tabs{margin:4px 12px}",
      "#recover-root .rc-board{flex:1 1 auto;min-height:380px;max-width:none;margin:0;padding:0 10px 8px;grid-template-columns:156px minmax(0,1fr);align-items:stretch}",
      "#recover-root .rc-bin{max-height:calc(100dvh - 132px);overflow-y:auto}",
      "#recover-root .rc-play{min-width:0;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 148px;grid-template-rows:minmax(220px,46vh) auto;gap:8px}",
      "#recover-root .rc-stage{grid-column:1;grid-row:1;min-height:220px;height:100%}",
      "#recover-root .rc-unit-img{width:100%;height:100%;max-height:46vh;object-fit:contain}",
      "#recover-root .rc-pad-floor{position:absolute;left:0;right:0;bottom:0;height:36%;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(8,10,12,.72) 30%,rgba(16,14,12,.92))}",
      "#recover-root .rc-guide{margin:0 12px 6px;padding:8px 10px;border-radius:8px;background:#1c140c;border:1px solid #8a6a10;color:#f3e2b0;font-size:13px;font-weight:700}",
      "#recover-root .rc-micron{margin-top:8px;background:#061018;border:2px solid #245;border-radius:8px;padding:6px 8px;text-align:center}",
      "#recover-root .rc-micron em{display:block;font-style:normal;letter-spacing:.16em;font-size:10px;color:#8eb}",
      "#recover-root .rc-micron strong{display:block;font-family:ui-monospace,monospace;font-size:28px;color:#9fd;line-height:1}",
      "#recover-root .rc-micron span{font-size:11px;color:#9ec5ff}",
      "#recover-root .rc-hoses path{stroke-width:8px;vector-effect:non-scaling-stroke;stroke-linecap:round;filter:drop-shadow(0 0 1px #000) drop-shadow(0 1px 0 #000)}",
      "#recover-root .rc-hoses path.open{stroke-opacity:1}",
      "#recover-root .rc-hoses path.flow{stroke-width:9px}",
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
      ".rc-stage,.rc-piece{touch-action:none}",
      "@media (max-width:720px){#recover-root .rc-play{grid-template-columns:minmax(0,1fr) 112px}#recover-root .rc-board{grid-template-columns:1fr}#recover-root .rc-bin{max-height:none}#recover-root .rc-scale-deck{left:4px;bottom:4px;width:112px;min-width:0}#recover-root .rc-lay.machine{left:auto;right:6px;bottom:8px;width:96px;height:84px;z-index:6}#recover-root .rc-lay.vac.seated{left:auto;right:6px;top:auto;bottom:8px;width:96px;height:84px;z-index:6}}",
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function start(root, opts) {
    opts = opts || {};
    if (!root) return { stop: function () {} };
    if (root._rcStop) root._rcStop();
    ensureStyle();
    let ui = 0;
    let coachMin = false;
    let note = "Step 1 · Drag the recovery tank onto the condenser photo. It lands on the scale. Yellow top. Upright.";
    let timer = null;
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
        core: false,
        vac: false,
        vacOn: false,
        vacTrip: false,
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
        microns: 760000,
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

    function nextPiece(j) {
      const unit = u();
      if (tankFull(unit) && j.charge > 0.02) return "fresh";
      if (j.done && j.machine) return "";
      if (j.done && !j.vac) return "vac";
      if (!j.tank) return "tank";
      if (!j.machine) return "machine";
      if (!j.gauges) return "gauges";
      if (!j.hoses) return "hoses";
      if (!j.core) return "core";
      if (j.done && !j.vac) return "vac";
      return "";
    }

    function guideLine(j, unit) {
      if (!j.tank) return "Step 1 · Drag the recovery tank onto the condenser photo. It lands on the scale.";
      if (!j.machine) return "Step 2 · Tank is on the scale. Drag the recovery machine onto the condenser. Outlet toward the tank.";
      if (!j.gauges) return "Step 3 · Drag the manifold onto the condenser. Blue is suction. Red is liquid.";
      if (!j.hoses) return "Step 4 · Drag the hoses onto the condenser. Blue on suction, red on liquid, yellow to the machine. You will see them hooked.";
      if (!j.core) return "Step 5 · Drag the service ports. Cores come out under the hoses.";
      if (!j.vapor || !j.loValve || (unit.ports === 2 && !j.hiValve)) return "Step 6 · Open tank vapor, the blue valve, and the red valve. Then hit Recovery ON.";
      if (!j.done) return "Step 7 · Recovery ON. Both needles fall. The scale climbs. On the 3-ton, drag the tank into the ice bucket. 80% is the stop.";
      if (!j.vac) return "Step 8 · Charge is in the tank. Drag the machine back to Parts. Drag the vacuum pump onto the condenser.";
      if (!j.vacOn) return "Step 9 · Shut the tank vapor valve. Hit Vacuum ON. The micron gauge falls. The manifold goes into inches of vacuum. The scale does not move.";
      const um = Math.round(j.microns || 760000);
      return "Pump is on. Microns " + um + ". A rise after you valve off is a leak or moisture. Tank weight stays put.";
    }

    function shotCap(unit, j) {
      if (!j.tank && !j.machine && !j.gauges) return "Picture · bare " + unit.name + ". Nothing is hooked.";
      if (!j.machine) return "Picture · recovery tank on the scale.";
      if (!j.gauges) return "Picture · recovery machine set, outlet toward the tank.";
      if (!j.hoses) return "Picture · manifold on the unit. Hoses are not on the ports yet.";
      if (!j.core) return "Picture · hoses on the manifold. Service ports still have the cores in.";
      return "Picture · service ports open, hoses hooked, machine and tank in line.";
    }

    function say(text) {
      note = text;
      const el = root.querySelector("#rc-note");
      if (el) el.textContent = text;
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

    function hosePath(cls, d, color) {
      return '<path id="' + cls + '" class="shut" d="' + d + '" fill="none" stroke="' + color + '" stroke-linecap="round"/>';
    }

    function hosesSvg(unit, j) {
      if (!j.gauges && !(j.vac && j.core)) return "";
      let svg = '<svg class="rc-hoses" viewBox="0 0 100 100" preserveAspectRatio="none">';
      const dash = j.hoses ? "" : ' stroke-dasharray="3 2" opacity="0.55"';
      function path(id, d, color) {
        return '<path id="' + id + '" d="' + d + '" fill="none" stroke="' + color + '" stroke-linecap="round"' + dash + "/>";
      }
      svg += path("rc-path-lo", "M66 44 C 62 58, 56 72, 48 84", "#3d8bfd");
      if (unit.ports === 2) svg += path("rc-path-hi", "M74 50 C 68 64, 58 76, 51 86", "#e23b4a");
      if (j.machine) svg += path("rc-path-y", "M40 84 C 36 88, 32 84, 28 78", "#e8c450");
      if (j.machine && j.tank) {
        svg += path("rc-path-v", j.ice ? "M18 80 C 40 96, 78 99, 99 70" : "M18 80 C 14 78, 10 74, 7 66", "#e8c450");
      }
      if (j.vac && j.core) svg += path("rc-path-vac", j.machine ? "M86 28 C 80 32, 74 38, 68 42" : "M48 72 C 42 70, 34 66, 28 60", "#b9d7ff");
      svg += "</svg>";
      return svg;
    }

    function tankHtml(j, unit, extra) {
      return '<div class="rc-tank ' + heatWord(j, unit) + (extra || "") + '" id="rc-tank"><img src="recover/tank.jpg?v=1" alt="" /><em id="rc-tf">' + Math.round(cylOf(unit).F) + "°F</em></div>";
    }

    function scaleHtml(j, unit) {
      const lb = j.tank ? cyl().lb.toFixed(1) : "0.0";
      const onDeck = j.tank && !j.ice;
      return '<div class="rc-scale-deck" data-slot="scale">' +
        (onDeck ? tankHtml(j, unit, "") : '<div class="rc-scale-wait">' + (j.ice && j.tank ? "Tank is in the ice" : "Set tank here") + "</div>") +
        '<div class="rc-scale-plat"></div>' +
        '<div class="rc-scale-face"><em>SCALE</em><strong id="rc-lb">' + lb + '</strong><span>lb</span></div></div>';
    }

    function alarmText(j) {
      if (j.vacTrip) return "Vacuum pump tripped. It does not push refrigerant into the tank. Reset it. Recover first, then isolate the tank.";
      if (j.trip && j.tripWhy === "deadhead") return "High-pressure trip. Dead-headed. The tank vapor valve is shut, so the machine had nowhere to push. Open it, then reset.";
      if (j.trip && j.tripWhy === "valves") return "High-pressure trip. Manifold valves are shut. Open the blue valve" + (u().ports === 2 ? " and the red valve" : "") + ", then reset.";
      if (j.trip && j.tripWhy === "pressure") return "Thermal / high-pressure trip. The tank got hot and the pressure switch opened. Ice the tank. Open the vapor valve. Then reset.";
      return "";
    }

    function paint() {
      const unit = u();
      const j = s();
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
        '<p class="rc-guide" id="rc-guide">' + guideLine(j, unit) + "</p>" +
        '<div class="rc-board">' +
        '<aside class="rc-bin" data-slot="bin"><p class="eyebrow">Parts</p><p class="rc-bin-hint">Drag onto the unit. After the pull, drag the recovery machine back into this box.</p>' +
        PIECES.map(function (p) {
          const used = (p.id === "tank" && j.tank) || (p.id === "machine" && j.machine) || (p.id === "gauges" && j.gauges) || (p.id === "hoses" && j.hoses) || (p.id === "core" && j.core) || (p.id === "vac" && j.vac);
          if (used) return "";
          const hideFresh = p.id === "fresh" && !full;
          const name = p.id === "tank" ? unit.ref + " tank" : p.id === "wrong" ? (unit.ref === "R-410A" ? "R-134a tank" : "R-410A tank") : p.id === "fresh" ? "Empty " + unit.ref + " tank" : p.name;
          return '<button type="button" class="rc-piece' + (p.id === nextPiece(j) ? " rc-next" : "") + (hideFresh ? " rc-hide" : "") + '" data-piece="' + p.id + '"' + (hideFresh ? " hidden" : "") + '><img src="' + p.img + '?v=1" alt="" /><span>' + name + "</span></button>";
        }).join("") +
        "</aside>" +
        '<div class="rc-play">' +
        '<div class="rc-stage" data-slot="unit">' +
        '<img class="rc-unit-img" src="' + unit.bare + '?v=1" alt="' + shotCap(unit, j) + '" />' +
        '<div class="rc-pad-floor"></div>' +
        hosesSvg(unit, j) +
        (j.core
          ? '<span class="rc-port-dot lo"><em>Suction</em></span>' +
            (unit.ports === 2 ? '<span class="rc-port-dot hi"><em>Liquid</em></span>' : "") +
            '<img class="rc-lay core" src="recover/core-on.jpg?v=1" alt="Service ports, cores out" />'
          : "") +
        (j.gauges ? '<img class="rc-lay gauges" src="parts/gauges.png?v=1" alt="Manifold hooked to the hoses" />' : "") +
        (j.machine ? '<img class="rc-lay machine' + (j.done ? " back" : "") + (j.run && !j.trip ? " run" : "") + '" src="recover/machine.jpg?v=1" alt="Recovery machine. Drag it back to Parts when the pull is done." />' : "") +
        scaleHtml(j, unit) +
        (j.vac ? '<img class="rc-lay vac' + (j.machine ? "" : " seated") + (j.vacOn && !j.vacTrip ? " run" : "") + '" src="ms/tools/pump.jpg?v=1" alt="Vacuum pump. Drag it back to Parts." />' : "") +
        '<div class="rc-coach' + (coachMin ? " min" : "") + '" id="rc-coach">' +
        '<button type="button" class="rc-coach-min" id="rc-coach-min" aria-expanded="' + (coachMin ? "false" : "true") + '">' + (coachMin ? "Coach +" : "Coach −") + "</button>" +
        '<div class="rc-coach-body"><p class="rc-note" id="rc-note">' + note + "</p><p class=\"rc-law\">" + unit.law + "</p></div></div>" +
        "</div>" +
        '<aside class="rc-ice-bay rc-ice' + (j.ice ? " on" : "") + '" data-slot="ice"><b>Ice bucket</b><span class="rc-ice-why">Beside the bench. Drag the tank in on a big system. Colder tank, lower pressure.</span>' +
        (j.ice && j.tank ? tankHtml(j, unit, " in-ice") : "") +
        "<i></i><i></i><i></i></aside>" +
        '<div class="rc-controls">' +
        '<p class="rc-alarm' + (alarm ? "" : " rc-hide") + '" id="rc-alarm"' + (alarm ? "" : " hidden") + ">" + alarm + "</p>" +
        '<div class="rc-switches">' +
        '<button type="button" class="mach-switch rc-go' + (j.run && !j.trip ? " on" : "") + (j.trip ? " tripped" : "") + '" id="rc-run" role="switch" aria-checked="' + (j.run && !j.trip ? "true" : "false") + '"><i></i><span>' + (j.trip ? "TRIP" : j.run ? "ON" : "OFF") + "</span><em>Recovery</em></button>" +
        '<button type="button" class="mach-switch' + (j.vacOn && !j.vacTrip ? " on" : "") + (j.vacTrip ? " tripped" : "") + '" id="rc-vac" role="switch" aria-checked="' + (j.vacOn && !j.vacTrip ? "true" : "false") + '"><i></i><span>' + (j.vacTrip ? "TRIP" : j.vacOn ? "ON" : "OFF") + "</span><em>Vacuum</em></button>" +
        '<button type="button" class="btn' + (j.trip || j.vacTrip ? "" : " rc-hide") + '" id="rc-reset"' + (j.trip || j.vacTrip ? "" : " hidden") + ">Reset trip</button>" +
        "</div>" +
        (j.hoses
          ? '<div class="rc-valves">' +
            '<button type="button" class="mach-switch rc-valve' + (j.vapor ? " on" : "") + '" id="rc-vapor" aria-pressed="' + (j.vapor ? "true" : "false") + '"><i></i><span>' + (j.vapor ? "OPEN" : "SHUT") + "</span><em>Tank vapor</em></button>" +
            '<button type="button" class="mach-switch rc-valve' + (j.loValve ? " on" : "") + '" id="rc-lo-v" aria-pressed="' + (j.loValve ? "true" : "false") + '"><i></i><span>' + (j.loValve ? "OPEN" : "SHUT") + "</span><em>Blue valve</em></button>" +
            (unit.ports === 2
              ? '<button type="button" class="mach-switch rc-valve' + (j.hiValve ? " on" : "") + '" id="rc-hi-v" aria-pressed="' + (j.hiValve ? "true" : "false") + '"><i></i><span>' + (j.hiValve ? "OPEN" : "SHUT") + "</span><em>Red valve</em></button>"
              : "") +
            "</div>"
          : '<p class="rc-manifold-wait">Valves show up when the hoses are on the manifold.</p>') +
        (j.tank
          ? '<div class="rc-fill' + (pct >= 75 ? " hot" : pct >= 65 ? " warn" : "") + '"><i style="width:' + pct.toFixed(1) + '%"></i><span id="rc-got">' + pct.toFixed(0) + "% full · 80% stop · recovered " + gotLb(j, unit).toFixed(1) + " lb</span></div>"
          : "") +
        (j.gauges
          ? '<div class="rc-manifold' + (j.run && !j.trip ? " run" : "") + (j.vacOn && !j.vacTrip ? " run" : "") + '">' +
            '<div class="rc-dial"><i class="rc-needle lo" style="transform:rotate(' + needle(reading ? j.lo : 0, span).toFixed(1) + 'deg)"></i><b>LO</b><em id="rc-lo">' + (reading ? showP(j.lo) : "—") + "</em></div>" +
            '<div class="rc-dial hi"><i class="rc-needle hi" style="transform:rotate(' + needle(reading ? j.hi : 0, span).toFixed(1) + 'deg)"></i><b>HI</b><em id="rc-hi">' + (reading ? showP(j.hi) : "—") + "</em></div>" +
            '<p class="rc-hose-key"><i class="b"></i> blue suction<br><i class="r"></i> red liquid<br><i class="y"></i> yellow center<br>Off: needles hold. On: both fall toward 0.</p></div>' +
            (j.vac
              ? '<div class="rc-micron"><em>MICRON</em><strong id="rc-um">' + Math.round(j.microns || 760000) + '</strong><span>µm · pump ' + (j.vacOn && !j.vacTrip ? "ON" : "OFF") + "</span></div>"
              : '<p class="rc-manifold-wait">Micron gauge shows up with the vacuum pump. It stays dark during recovery.</p>')
          : '<p class="rc-manifold-wait">Drop the manifold gauges on the unit. They stay dark until the hoses and service ports are hooked.</p>') +
        '<button type="button" class="btn primary" id="rc-close">' + (j.done ? "Tank closed" : "Close the tank") + "</button>" +
        (j.tank ? '<p class="rc-tankp" id="rc-tp">Tank ' + Math.round(tankP) + " psig · " + Math.round(cyl().F) + "°F · cutout " + cut + " · stop " + stopLb + " lb · " + heatWord(j, unit) + "</p>" : '<p class="rc-tankp" id="rc-tp">Drop the tank on the unit. It sits on the scale.</p>') +
        "</div></div></div>";

      const back = root.querySelector("#rc-back");
      if (back) back.onclick = goHub;
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
      const ice = root.querySelector("[data-slot=ice]");
      if (ice) ice.onclick = onIceTap;
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
      sync(u(), s(), tankP, cut);
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
        say("The machine is tripped. Clear the cause, then hit Reset trip. Gauges hold while it is tripped.");
        return;
      }
      if (j.run) {
        j.run = false;
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
        say("Dead-headed. The tank vapor valve is shut, so discharge pressure tripped the machine. Open the vapor valve, then hit Reset trip.");
        sync(unit, j, tankP0, cut);
        return;
      }
      if (!anySide(j, unit)) {
        j.run = false;
        j.vacOn = false;
        j.trip = true;
        j.tripWhy = "valves";
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
        say("Tank pressure is above the cutout. Thermal trip. Ice the tank. Reset stays locked until the vapor valve is open and the tank cools.");
        sync(unit, j, tankP0, cut);
        return;
      }
      j.vacOn = false;
      j.run = true;
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
        say("Vacuum pump is off. Gauges hold. Tank weight did not change.");
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
      say("Vacuum pump is on. This is evacuation, not recovery. The manifold will go into inches of vacuum. Tank weight stays put. Never vent.");
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
          say("Do not close. 0 psig is not empty. Liquid is still in the circuit, and the tank did not gain that weight. Recover the liquid. Never vent.");
          return;
        }
        say("Not yet. Suction has to reach the target and the scale has to move before you close the tank. Recovered " + gotLb(j, unit).toFixed(1) + " lb so far.");
        return;
      }
      j.run = false;
      j.vacOn = false;
      j.vapor = false;
      j.done = true;
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
      note = "Tank is in the ice, still on the scale. Colder liquid, lower saturation pressure, the machine can keep pushing. Ice does not let you fill past 80%.";
      paint();
    }

    function land(id, slot) {
      const unit = u();
      const j = s();
      const piece = PIECES.find(function (p) { return p.id === id; });
      if (!piece) return;
      if (piece.kind === "bad") {
        say(MISS[id] || "That does not land on this job.");
        return;
      }
      if (id === "vac") {
        j.vac = true;
        note = j.done
          ? "Vacuum pump is hooked to the suction port. Shut the tank vapor valve if it is open, then flip Vacuum ON. This pump does not push refrigerant into the tank."
          : "Vacuum pump is on the bench, not in the recover circuit. Leave it off while the system is charged. Recover into the tank first. Never vent.";
        paint();
        return;
      }
      if (j.done) {
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
        paint();
        return;
      }
      if (id === "machine" && (slot === "machine" || slot === "unit")) {
        if (!j.tank) { say("Scale the tank first. You cannot call 80% without a weight."); return; }
        j.machine = true;
        note = "Machine is in front of the unit. Inlet will take the yellow hose. Outlet goes to the tank vapor valve.";
        paint();
        return;
      }
      if (id === "gauges" && (slot === "gauges" || slot === "hoses" || slot === "unit")) {
        if (!j.machine) { say("Set the recovery machine before the manifold. The center hose needs a machine to land on."); return; }
        j.gauges = true;
        note = "Manifold is on the unit. Blue gauge is compound, suction. Red gauge is liquid. Needles stay dark until the hoses hit the service ports.";
        paint();
        return;
      }
      if (id === "hoses" && (slot === "hoses" || slot === "core" || slot === "unit")) {
        if (!j.gauges) { say("Set the manifold before the hoses. Blue, red, and yellow need the gauges to land on."); return; }
        j.hoses = true;
        note = unit.ports === 2
          ? "Hoses are hooked. Blue on suction, red on liquid, yellow from the center port to the machine inlet. Open the tank vapor valve. On R-410A, liquid first, then vapor. Never vent."
          : "One vapor port. Blue hose only, from the suction port to the manifold. Do not invent a liquid port on a reach-in.";
        paint();
        return;
      }
      if (id === "core" && (slot === "core" || slot === "hoses" || slot === "unit")) {
        if (!j.hoses) { say("Hoses first. The service ports take the hoses, then the cores come out under them."); return; }
        j.core = true;
        note = unit.ports === 2
          ? "Service ports are open. Cores are out so the hoses can flow. Open the tank vapor valve and the manifold. Liquid through red first, then vapor through blue. A shut vapor valve dead-heads the machine."
          : "Service port is open. Core is out. Open the vapor valve and the blue valve, then turn the machine on. A shut valve moves nothing.";
        if (unit.big) note += " On this 3-ton, ice the tank.";
        paint();
        return;
      }
      say("Drop it on the picture of the unit. Tank, machine, gauges, hoses, then the service ports.");
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
          e.preventDefault();
          let dragged = false;
          const id = el.getAttribute("data-piece");
          const ghost = document.createElement("div");
          ghost.className = "rc-ghost";
          ghost.innerHTML = el.innerHTML;
          document.body.appendChild(ghost);
          function move(ev) {
            if (Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > 8) dragged = true;
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
            if (!dragged) land(id, "unit");
            else if (hit) land(id, hit.getAttribute("data-slot"));
            else say("Drop it on the picture of the unit.");
          }
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerup", up);
          el.addEventListener("pointercancel", up);
          try { el.setPointerCapture(e.pointerId); } catch (err) {}
          move(e);
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

    function chase(cur, live, k) {
      let n = cur + (live - cur) * k;
      if (Math.abs(live - n) < 0.3) n = live;
      return n;
    }

    function pullVac(j) {
      const vacTarget = -14.4;
      j.lo = chase(j.lo, vacTarget, 0.18);
      j.hi = chase(j.hi, vacTarget, 0.14);
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
        if (j.vacOn && !j.vacTrip) {
          if (j.vapor || j.charge > 0.02) {
            j.vacOn = false;
            j.vacTrip = true;
            say("Vacuum pump tripped. Isolate the tank. This pump does not recover gas into it.");
          } else {
            const held = cyl().lb;
            pullVac(j);
            cyl().lb = held;
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
          say("Dead-heading. The vapor valve shut while the machine was running. It tripped. Open the vapor valve, then hit Reset trip.");
        } else if (!anySide(j, unit)) {
          j.run = false;
          j.trip = true;
          j.tripWhy = "valves";
          say(unit.ports === 2
            ? "Both manifold valves shut. High-pressure trip. Open blue and red, then hit Reset trip."
            : "Blue valve shut. High-pressure trip. Open it, then hit Reset trip.");
        } else if (tankP >= cut) {
          j.run = false;
          j.trip = true;
          j.tripWhy = "pressure";
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
            j.liquid = Math.max(0, j.liquid - flow);
          }
          if (j.charge < 0.0001) j.charge = 0;
          if (cyl().lb > limit) cyl().lb = limit;
          if (flow > 0.0001) j.moved = true;
          const live = liveP(j, unit);
          const loK = j.loValve ? 0.34 : 0;
          const hiK = (unit.ports === 2 ? j.hiValve : j.loValve) ? (j.hiValve && unit.ports === 2 ? 0.46 : 0.36) : 0;
          if (loK) j.lo = chase(j.lo, live, loK);
          if (unit.ports === 1) j.hi = chase(j.hi, live, j.loValve ? 0.3 : 0);
          else if (hiK) j.hi = chase(j.hi, live, hiK);
          if (cyl().lb >= limit - 0.05 && j.charge > 0.02) {
            j.run = false;
            j.fillLock = true;
            say("Stop at " + limit + " lb of " + unit.ref + ". The tank is at 80%. Drop the empty tank on the unit. Ice does not raise this stop.");
          } else if (bothSides(j, unit) && atLevel(j, unit)) {
            j.ready = true;
            j.run = false;
            say(unit.target >= 0
              ? "0 psig, and the scale shows " + gotLb(j, unit).toFixed(1) + " lb recovered. The needle is not the proof — the weight is. Liquid is out. Close the tank. Never vent."
              : "Suction is at about 4 in Hg and the scale moved. Close the tank. Never vent.");
          } else if (unit.ports === 2 && j.loValve && !j.hiValve && (j.liquid || 0) > 0.05 && (j.charge - j.liquid) <= 0.08 && Math.round(j.lo) === 0) {
            say("Suction is at 0 psig. That is not empty. Liquid is still in the circuit. The tank only gained the vapor — it did not take that liquid weight. Open the red valve. Never vent. A vacuum will not finish this.");
          } else if (unit.ports === 2 && j.hiValve && !j.loValve && j.charge < unit.charge * 0.35) {
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
      const lo = root.querySelector("#rc-path-lo");
      const hi = root.querySelector("#rc-path-hi");
      const y = root.querySelector("#rc-path-y");
      const v = root.querySelector("#rc-path-v");
      const vac = root.querySelector("#rc-path-vac");
      if (lo) lo.setAttribute("class", cls(j.loValve));
      if (hi) hi.setAttribute("class", cls(j.hiValve));
      if (y) y.setAttribute("class", cls(flow || j.hoses));
      if (v) v.setAttribute("class", cls(j.vapor));
      if (vac) vac.setAttribute("class", j.vacOn && !j.vacTrip ? "flow" : "open");
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
      if (nLo) nLo.style.transform = "rotate(" + needle(reading ? j.lo : 0, span).toFixed(1) + "deg)";
      if (nHi) nHi.style.transform = "rotate(" + needle(reading ? j.hi : 0, span).toFixed(1) + "deg)";
      const um = root.querySelector("#rc-um");
      if (um) um.textContent = String(Math.round(j.microns || 760000));
      const guide = root.querySelector("#rc-guide");
      if (guide) guide.textContent = guideLine(j, unit);
      if (lb) lb.textContent = j.tank ? cylOf(unit).lb.toFixed(1) : "0.0";
      if (tf) tf.textContent = Math.round(cylOf(unit).F) + "°F";
      if (tp && j.tank) tp.textContent = "Tank " + Math.round(tankP) + " psig · " + Math.round(cylOf(unit).F) + "°F · cutout " + cut + " · stop " + fillStop(unit.ref) + " lb · " + heatWord(j, unit);
      const tank = root.querySelector("#rc-tank");
      if (tank) {
        tank.classList.remove("hot", "warm", "iced", "cool");
        tank.classList.add(heatWord(j, unit));
        if (j.ice) tank.classList.add("in-ice");
      }
      const fill = root.querySelector(".rc-fill");
      if (fill) {
        const pct = volPct(unit.ref, cylOf(unit).lb);
        fill.classList.toggle("hot", pct >= 75);
        fill.classList.toggle("warn", pct >= 65 && pct < 75);
        const bar = fill.querySelector("i");
        const lab = fill.querySelector("span");
        if (bar) bar.style.width = pct.toFixed(1) + "%";
        if (lab) lab.textContent = pct.toFixed(0) + "% full · 80% stop · recovered " + gotLb(j, unit).toFixed(1) + " lb";
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
      const man = root.querySelector(".rc-manifold");
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
    }

    paint();
    timer = setInterval(tick, 200);
    root._rcStop = stop;
    return { stop: stop };
  }

  window.RecoverLab = { start: start };
})();
