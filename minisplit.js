/* Mini-split install lab — real order, one tool per step. */
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

  const RATED_FT = 25;
  const OZ_PER_FT = 0.2;

  const STEPS = [
    {
      id: "mount",
      title: "1 · Mount",
      tip: "Level the mounting plate on an exterior wall. The level is the tool that does this step. The drill only makes holes.",
      detail: "Mark studs, bubble the plate, then hang the head. A crooked plate is a crooked head forever.",
      check: "Plate is level and secured to structure",
      photo: "ms/01-mount.jpg",
      tools: [
        { id: "level", name: "Level", img: "ms/tools/level.jpg", correct: true },
        { id: "plate", name: "Mounting plate", img: "ms/tools/plate.jpg", why: "The plate stays on the truck until the bubble is centered, because it does not level itself." },
        { id: "drill", name: "Drill", img: "ms/tools/drill.jpg", why: "The drill stays on the truck because it makes holes and does not level the head." },
      ],
      action: "Mount plate & hang IDU",
      metric: null,
    },
    {
      id: "penetration",
      title: "2 · Penetration",
      tip: "Hole saw, about 2.5–3 in, sloping down to the outside so condensate leaves. Sleeve and line set go through this hole.",
      detail: "Sleeve the bore. Drain keeps going downhill. Don't run the line set through a raw, uphill hole.",
      check: "Hole slopes out · line set and drain through the sleeve",
      photo: "ms/02-penetration.jpg",
      tools: [
        { id: "holesaw", name: "Hole saw", img: "ms/tools/holesaw.jpg", correct: true },
        { id: "sleeve", name: "PVC sleeve", img: "ms/tools/sleeve.jpg", why: "The sleeve stays on the truck until the hole exists, because it does not drill the penetration." },
        { id: "drill", name: "Twist drill", img: "ms/tools/drill.jpg", why: "A twist bit stays on the truck because this penetration is a hole saw, sloping out." },
      ],
      action: "Drill the wall",
      metric: null,
    },
    {
      id: "outdoor",
      title: "3 · Outdoor",
      tip: "Pad or bracket, level, with service clearance. The disconnect on the wall is later — it does not set the unit.",
      detail: "Keep the coil face open. Vibration pads cut noise transfer. Do not block airflow.",
      check: "Condenser level · clearance OK",
      photo: "ms/03-outdoor.jpg",
      tools: [
        { id: "pad", name: "Pad", img: "ms/tools/pad.jpg", correct: true },
        { id: "disc", name: "Disconnect", img: "ms/tools/disc.jpg", why: "The disconnect stays on the truck for this step because it does not set the condenser." },
        { id: "jug", name: "Refrigerant jug", img: "recover/junk.jpg", why: "The jug stays on the truck because you are setting the condenser, not charging it." },
      ],
      action: "Set the condenser",
      metric: null,
    },
    {
      id: "flare",
      title: "4 · Flare",
      tip: "Nut on first, then the seat. The flaring tool is what makes this picture.",
      detail: "A flare with the nut behind the block will not pass the nut. Cracks and over-torque are a recut, not a pass.",
      check: "Flares clean · nut on the tube · no cracks",
      photo: "ms/04-flare.jpg",
      tools: [
        { id: "flare", name: "Flaring tool", img: "ms/tools/flare.jpg", correct: true },
        { id: "cutter", name: "Tube cutter", img: "ms/tools/cutter.jpg", why: "The cutter stays on the truck until the flare nut is on the tube, because it does not make the seat." },
        { id: "deburr", name: "Deburr", img: "ms/tools/deburr.jpg", why: "The deburr tool stays on the truck for this step because it does not form the flare." },
      ],
      action: "Make flares",
      metric: { key: "flareQuality", label: "Flare quality", min: 80, unit: "%" },
    },
    {
      id: "torque",
      title: "5 · Torque",
      tip: "Torque wrench to the OEM chart. The backup wrench holds the body — it does not set the ft-lb.",
      detail: "1/4″ is often 10–13 ft-lb. 3/8″ is hotter. Over-torque cracks the flare. The manual on the truck beats a guess.",
      check: "Both ends torqued to spec · not cracked",
      photo: "ms/05-torque.jpg",
      tools: [
        { id: "torque", name: "Torque wrench", img: "ms/tools/torque.jpg", correct: true },
        { id: "backup", name: "Backup wrench", img: "ms/tools/backup.jpg", why: "The backup wrench stays on the truck alone because it only holds the valve and the torque wrench sets the ft-lb." },
        { id: "allen", name: "Allen key", img: "ms/tools/allen.jpg", why: "The Allen key stays on the truck because the service valves are still shut and this step is the flare nut." },
      ],
      action: "Torque connections",
      metric: { key: "torque", label: "Torque applied", min: 10, max: 13, unit: "ft-lb", target: 12 },
    },
    {
      id: "nitrogen",
      title: "6 · Nitrogen",
      tip: "Dry nitrogen only. Oxygen or shop air stays on the truck — that test is a fail.",
      detail: "Service valves still closed. Many OEMs want about 450–550 psig. Soap the flares after the nitrogen is in. Fix leaks before vacuum.",
      check: "Nitrogen holds · no oxygen · no shop air",
      photo: "ms/06-nitrogen.jpg",
      bench: true,
      tools: [
        { id: "n2", name: "Nitrogen", img: "ms/tools/n2.jpg", correct: true },
        { id: "o2", name: "Oxygen", img: "recover/tank.jpg", why: "Oxygen stays on the truck because it is a fuel, not a pressure test." },
        { id: "air", name: "Shop air", img: "recover/machine-tank.jpg", why: "Shop air stays on the truck because it is wet and not a nitrogen pressure test." },
      ],
      action: "Pressurize with N₂",
      metric: { key: "n2", label: "N₂ pressure", min: 450, max: 550, unit: "psig", target: 500 },
    },
    {
      id: "vacuum",
      title: "7 · Vacuum",
      tip: "Vacuum pump on the system. Pull to 500 microns. This picture is the pull, not the decay.",
      detail: "0 in Hg on a compound gauge is just 0 psig. The micron gauge proves the number on the next step.",
      check: "≤500 microns on the pull",
      photo: "ms/07-vacuum.jpg",
      bench: true,
      tools: [
        { id: "pump", name: "Vacuum pump", img: "ms/tools/pump.jpg", correct: true },
        { id: "micron", name: "Micron gauge", img: "ms/tools/micron.jpg", why: "The micron gauge is the next picture. This step is the pump pulling the system down." },
        { id: "gauges", name: "Compound gauges", img: "parts/gauges.png", why: "Compound gauges stay on the truck because 0 in Hg is not 500 microns." },
      ],
      action: "Pull the vacuum",
      metric: { key: "microns", label: "Microns", min: 500, unit: "µm", target: 350 },
    },
    {
      id: "decay",
      title: "8 · Decay",
      tip: "Isolate the pump and watch the micron gauge. A standing decay that holds at or under 500 is the pass. A rise is a leak or moisture.",
      detail: "Valve the pump off. Do not open the service valves until this number holds. The factory charge stays in the condenser until then.",
      check: "Decay holds ≤500 microns · no rise",
      photo: "ms/08-decay.jpg",
      bench: true,
      tools: [
        { id: "micron", name: "Micron gauge", img: "ms/tools/micron.jpg", correct: true },
        { id: "pump", name: "Vacuum pump", img: "ms/tools/pump.jpg", why: "The pump stays valved off. This picture is the standing decay, not another pull." },
        { id: "gauges", name: "Compound gauges", img: "parts/gauges.png", why: "Compound gauges stay on the truck because they cannot show a micron decay." },
      ],
      action: "Prove the decay",
      metric: { key: "decay", label: "Decay", min: 500, unit: "µm", target: 320 },
    },
    {
      id: "valves",
      title: "9 · Valves",
      tip: "Decay already held. Allen key. Liquid first, then suction. Caps back on. Do not open these valves before the decay holds.",
      detail: "The factory charge is already in the condenser and covers the rated lineset. Open the valves only after the vacuum and the decay both held.",
      check: "Both valves fully open · caps on",
      photo: "ms/09-valves.jpg",
      bench: true,
      tools: [
        { id: "allen", name: "Allen key", img: "ms/tools/allen.jpg", correct: true },
        { id: "torque", name: "Torque wrench", img: "ms/tools/torque.jpg", why: "The torque wrench stays on the truck because these valves are a hex, not a flare nut." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck, so don't start the unit with the valves still shut." },
      ],
      action: "Open service valves",
      metric: null,
    },
    {
      id: "electrical",
      title: "10 · Electrical",
      tip: "Disconnect, power, and the communication cable are landed. The meter proves voltage and that the comm wires are not swapped.",
      detail: "Breaker off while you land it. Polarity and the comm pair matter. Do not start the head until the meter agrees.",
      check: "Disconnect landed · power and comms proved",
      photo: "ms/10-electrical.jpg",
      bench: true,
      tools: [
        { id: "meter", name: "Meter", img: "ms/tools/meter.jpg", correct: true },
        { id: "strippers", name: "Strippers", img: "ms/tools/strippers.jpg", why: "Strippers stay on the truck because the conductors in this picture are already landed." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck until the meter has proved power and comms." },
      ],
      action: "Prove the circuit",
      metric: null,
    },
    {
      id: "commission",
      title: "11 · Commission",
      tip: "Run cool and heat. Thermometer on the supply. Look at drain flow and codes.",
      detail: "Power and comms are already landed. Seal the penetration. Factory charge covered the rated lineset — do not add gas to hide a low ΔT.",
      check: "Cooling ΔT good · drain flows · no error codes",
      photo: "ms/11-commission.jpg",
      bench: true,
      tools: [
        { id: "thermo", name: "Thermometer", img: "ms/tools/thermo.jpg", correct: true },
        { id: "gauges", name: "Manifold", img: "parts/gauges.png", why: "The manifold stays on the truck for this check because you are proving supply ΔT at the head." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck for this check because the thermometer proves the run." },
      ],
      action: "Run and check",
      metric: { key: "deltaT", label: "Supply ΔT", min: 15, unit: "°F", target: 20 },
    },
  ];

  let root = null;
  let step = 0;
  let view = 0;
  let done = {};
  let values = freshValues();
  let onXp = null;
  let onDone = null;
  let systemName = "Daikin Aurora Mini-Split";
  let finished = false;
  let toolHit = {};
  let toolMiss = {};
  let note = "";
  let lockedPop = {};

  function freshValues() {
    return { flareQuality: 88, torque: 12, n2: 500, microns: 350, decay: 320, lineset: 25, extraOz: 0, deltaT: 20 };
  }

  function brandMark() {
    return (window.LtBrand && window.LtBrand.mark) || "HA";
  }
  function brandOrg() {
    return (window.LtBrand && window.LtBrand.org) || "HVAC Allstars";
  }

  function owedOz(len) {
    if (len <= RATED_FT) return 0;
    return (len - RATED_FT) * OZ_PER_FT;
  }

  function photoFor(st) {
    const src = st && st.photo;
    if (src) return '<img class="ms-photo" data-step="' + st.id + '" src="' + src + '" alt="' + String(st.title || "Install step").replace(/"/g, "") + '" />';
    return scene(st ? st.id : "");
  }

  function storyBoard(focusIndex) {
    const focus = Math.max(0, Math.min(focusIndex, STEPS.length - 1));
    const st = STEPS[focus];
    const name = st.title.replace(/^\d+\s·\s/, "");
    const mark = done[st.id] ? " · in place" : (focus === step ? " · this step" : " · looking");
    return (
      '<div class="ms-story">' +
      '<figure class="now' + (done[st.id] ? " done" : "") + '">' + photoFor(st) +
      "<figcaption>" + (focus + 1) + " · " + name + mark + "</figcaption></figure></div>"
    );
  }

  function scene(id) {
    const s = STEPS.filter(function (x) { return x.id === id; })[0];
    const src = s && s.photo;
    if (src) return '<img class="ms-photo" data-step="' + id + '" src="' + src + '" alt="" />';
    const cap = 'font-size="11" fill="#e8c450" font-family="system-ui,sans-serif" font-weight="700"';
    const body =
      '<rect x="90" y="20" width="28" height="180" fill="#3a4550"/>' +
      '<line x1="40" y1="70" x2="200" y2="110" stroke="#CE0034" stroke-width="10" stroke-linecap="round"/>' +
      '<line x1="40" y1="70" x2="200" y2="110" stroke="#8ec8ff" stroke-width="4"/>' +
      '<path d="M200 118 l8 14 l-6 0 z" fill="#8ec8ff"/>' +
      "<text x='24' y='60' " + cap + ">INSIDE</text>" +
      "<text x='150' y='168' " + cap + ">SLOPE OUT</text>";
    return '<svg class="ms-vis" viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Wall penetration"><rect width="260" height="200" rx="12" fill="#10161c"/>' + body + "</svg>";
  }

  function hubLine(s) {
    try {
      if (window.ProfessorHUB && window.ProfessorHUB.banter) {
        return window.ProfessorHUB.banter("install", { step: s.id });
      }
    } catch (_) {}
    return s.tip;
  }

  function rangeBounds(m) {
    if (m.key === "n2") return { min: 0, max: 650 };
    if (m.key === "torque") return { min: 5, max: 30 };
    if (m.key === "microns" || m.key === "decay") return { min: 50, max: 3000 };
    if (m.key === "flareQuality") return { min: 40, max: 100 };
    if (m.key === "deltaT") return { min: 0, max: 30 };
    return { min: 0, max: 100 };
  }

  function metricBlock(s) {
    if (!s.metric) return "";
    const m = s.metric;
    const b = rangeBounds(m);
    return (
      '<div class="ms-metric"><label>' + m.label +
      ' <input type="range" id="ms-range" min="' + b.min + '" max="' + b.max + '" value="' + values[m.key] + '" />' +
      '<output id="ms-out">' + values[m.key] + " " + m.unit + "</output></label>" +
      '<p class="ms-target">' + targetText(m) + "</p></div>"
    );
  }

  function render() {
    if (!root) return;
    try { paint(); }
    catch (err) {
      root.innerHTML = '<div class="ms-layout"><p>Mini-split lab hit a snag. Hard-refresh.</p><p>' +
        String(err && err.message ? err.message : err) +
        '</p><button class="btn" id="ms-hub">Shop floor</button></div>';
      const b = root.querySelector("#ms-hub");
      if (b) b.onclick = function () { try { if (onDone) onDone(false); } catch (_) {} };
    }
  }

  function paint() {
    if (!document.getElementById("ms-phone-fit")) {
      const st = document.createElement("style");
      st.id = "ms-phone-fit";
      st.textContent = "@media (max-width:720px){#screen-minisplit.screen.active{display:block!important;overflow-x:hidden!important;overflow-y:auto!important;height:100dvh!important;max-height:100dvh!important;-webkit-overflow-scrolling:touch}#minisplit-root{padding-bottom:24px!important;overflow:visible!important;height:auto!important;max-height:none!important;display:block!important;flex:none!important}#minisplit-root .ms-layout{height:auto;display:block;overflow:visible}#minisplit-root .ms-head{padding:4px 8px}#minisplit-root .ms-head h2{font-size:16px;margin:0}#minisplit-root .ms-body{display:block;overflow:visible}#minisplit-root .ms-steps{display:flex;flex-wrap:nowrap;overflow-x:auto;max-height:none;gap:8px;padding:4px 2px 8px;-webkit-overflow-scrolling:touch}#minisplit-root .ms-step{flex:0 0 auto;min-width:92px;min-height:48px;padding:8px 12px!important}#minisplit-root .ms-step em{display:inline!important;font-size:14px;font-style:normal}#minisplit-root .ms-card{overflow:visible;display:block;padding:4px 8px 24px}#minisplit-root .ms-scene{overflow:visible}#minisplit-root .ms-story>figure.now .ms-photo,#minisplit-root .ms-story>figure.now .ms-vis{max-height:34vh!important;width:100%!important;object-fit:contain!important}#minisplit-root .ms-tools{display:flex;gap:6px}#minisplit-root .ms-tool{flex:1 1 0;min-width:0}#minisplit-root .ms-tool{min-height:48px}#minisplit-root .ms-tool img{height:72px!important}#minisplit-root .ms-ref,#minisplit-root .ms-detail,#minisplit-root .hub-chip,#minisplit-root .ms-check{display:none!important}#minisplit-root .ms-tip{margin:4px 0;font-size:13px}#minisplit-root .ms-card .eyebrow,#minisplit-root .ms-card h3{margin:2px 0}#minisplit-root .ms-card h3{font-size:16px}#minisplit-root .ms-actions{display:flex;flex-wrap:wrap;gap:6px}#minisplit-root .ms-actions .btn{min-height:48px;margin:0;font-size:16px;flex:1 1 42%}#minisplit-root .ms-actions #ms-hub{display:none!important}body:has(#screen-minisplit.active) #pf-coach-bar,body:has(#screen-minisplit.active) .pf-coach{left:8px!important;right:auto!important;bottom:4px!important;top:auto!important;width:min(190px,52vw)!important;max-height:48px!important}body:has(#screen-minisplit.active) .ld-replay{top:auto!important;bottom:8px!important;left:auto!important;right:8px!important;width:auto!important;max-width:124px!important}body:has(#screen-minisplit.active) #toast-host{top:2px!important;right:8px!important;left:auto!important;bottom:auto!important;transform:none!important;width:min(132px,38vw)!important;max-height:28px!important;overflow:hidden!important;z-index:40!important}}@media (max-height:800px) and (min-width:721px){#minisplit-root .ms-story>figure.now .ms-photo,#minisplit-root .ms-story>figure.now .ms-vis{max-height:min(22vh,180px)!important}}";
      document.head.appendChild(st);
      if (!document.getElementById("ms-desk-fit")) {
        const d = document.createElement("style");
        d.id = "ms-desk-fit";
        d.textContent = "#screen-minisplit.screen.active{display:block!important;overflow-x:hidden!important;overflow-y:auto!important;height:100%!important;max-height:100dvh!important;-webkit-overflow-scrolling:touch}#minisplit-root{height:auto!important;max-height:none!important;min-height:0!important;flex:none!important;overflow:visible!important}@media (min-width:721px){body:has(#screen-minisplit.active) .ld-replay{bottom:78px!important;right:8px!important;top:auto!important;left:auto!important}body:has(#screen-minisplit.active) #pf-coach-bar,body:has(#screen-minisplit.active) .pf-coach{left:8px!important;bottom:8px!important;top:auto!important;width:220px!important;max-width:220px!important;max-height:72px!important}#minisplit-root .ms-steps{max-height:calc(100dvh - 160px);overflow-y:auto}}";
        document.head.appendChild(d);
      }
    }
    if (!document.getElementById("ms-land")) {
      const land = document.createElement("style");
      land.id = "ms-land";
      land.textContent = [
        "@media (orientation:landscape) and (max-height:520px){",
        "#screen-minisplit.screen.active{overflow:hidden!important;height:100dvh!important;max-height:100dvh!important}",
        "#minisplit-root{height:100%!important;max-height:100dvh!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;padding:0!important}",
        "#minisplit-root .ms-layout{height:100%!important;max-height:100%!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}",
        "#minisplit-root .ms-head{flex:0 0 auto!important;padding:2px 8px!important;min-height:0!important}",
        "#minisplit-root .ms-progress{display:none!important}",
        "#minisplit-root .ms-body{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}",
        "#minisplit-root .ms-steps{flex:0 0 48px!important;max-height:48px!important;overflow-x:auto!important}",
        "#minisplit-root .ms-step{min-height:44px!important;min-width:84px!important;padding:6px 10px!important}",
        "#minisplit-root .ms-step em{display:inline!important}",
        "#minisplit-root .ms-card{position:relative!important;flex:1 1 auto!important;min-height:0!important;height:100%!important;max-height:100%!important;display:block!important;overflow:auto!important;padding:4px 8px 8px 52%!important;box-sizing:border-box!important}",
        "#minisplit-root .ms-scene{position:absolute!important;left:6px!important;top:6px!important;bottom:6px!important;width:48%!important;height:auto!important;max-height:none!important;min-height:0!important;margin:0!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important}",
        "#minisplit-root .ms-photo,#minisplit-root .ms-vis{width:100%!important;height:100%!important;max-height:100%!important;min-height:0!important;object-fit:contain!important;object-position:center!important}",
        "#minisplit-root .ms-tools{max-height:64px!important;overflow:hidden!important}",
        "#minisplit-root .ms-card .eyebrow{display:none!important}",
        "#minisplit-root .ms-card h3{margin:0!important}",
        "#minisplit-root .ms-tip{margin:2px 0!important;max-height:4.4em!important;overflow:hidden!important}",
        "#minisplit-root .ms-actions{position:sticky!important;bottom:0!important;background:#10161c!important;z-index:2!important;padding-top:4px!important}",
        "#minisplit-root .ms-check,#minisplit-root .hub-chip,#minisplit-root .ms-detail,#minisplit-root .ms-feedback:empty{display:none!important}",
        "body:has(#screen-minisplit.active) .ld-replay{top:4px!important;right:8px!important;bottom:auto!important;left:auto!important;max-width:112px!important;max-height:28px!important}",
        "body:has(#screen-minisplit.active) #toast-host{top:4px!important;left:8px!important;right:auto!important;max-height:28px!important}",
        "body:has(#screen-minisplit.active) .pf-coach,body:has(#screen-minisplit.active) #pf-coach-bar{bottom:4px!important;left:8px!important;top:auto!important;max-height:32px!important;max-width:160px!important}",
        "}",
      ].join("");
      document.head.appendChild(land);
    }
    landTurn("screen-minisplit");
    const s = STEPS[view] || STEPS[0];
    const completed = Object.keys(done).length;
    const pct = Math.round((completed / STEPS.length) * 100);
    const headCount = "Mini-split · " + (view + 1) + " / " + STEPS.length;
    const looking = view !== step;
    const canAct = !finished;
    const noteGood = !!(note && !looking && (done[s.id] || note.indexOf("did the job") !== -1));
    const visual = storyBoard(view);

    root.innerHTML =
      '<div class="ms-layout">' +
      '<header class="ms-head">' +
      '<button type="button" class="btn" id="ms-hub-top">Shop floor</button>' +
      "<h2>" + headCount + "</h2>" +
      '<div class="ms-progress"><div class="ms-bar"><i style="width:' + pct + '%"></i></div><span>' +
      completed + " done</span></div></header>" +
      '<div class="ms-body">' +
      '<aside class="ms-steps">' +
      STEPS.map(function (st, i) {
        const cls = (done[st.id] ? "done " : "") + (i === step ? "active " : "") + (i === view ? "viewing" : "");
        return '<button type="button" class="ms-step ' + cls + '" data-i="' + i + '" data-id="' + st.id + '"><span>' + (i + 1) + "</span><em>" +
          st.title.replace(/^\d+\s·\s/, "") + "</em></button>";
      }).join("") +
      "</aside>" +
      '<main class="ms-card">' +
      '<div class="ms-scene shown" id="ms-scene">' + visual +
      (done[s.id] ? '<span class="ms-scene-cta done">Step complete</span>' : "") +
      "</div>" +
      '<div class="ms-tools">' +
      s.tools.map(function (t) {
        const hit = toolHit[s.id] === t.id;
        const miss = toolMiss[s.id] && toolMiss[s.id][t.id];
        return '<button type="button" class="ms-tool' + (hit ? " good" : "") + (miss ? " bad" : "") +
          '" data-tool="' + t.id + '"><img src="' + t.img + '?v=1" alt="" /><span>' + t.name + "</span></button>";
      }).join("") +
      "</div>" +
      '<p class="ms-feedback' + (note ? (noteGood ? " good" : " bad") : "") + '" id="ms-feedback">' +
      (note || "") + "</p>" +
      '<p class="eyebrow">Step ' + (view + 1) + " of " + STEPS.length +
      (looking ? " · picture only — work is step " + (step + 1) : "") + "</p>" +
      "<h3>" + s.title + "</h3>" +
      '<p class="ms-tip">' + s.tip + "</p>" +
      metricBlock(s) +
      '<p class="ms-check">Success: <strong>' + s.check + "</strong></p>" +
      '<div class="ms-actions">' +
      '<button type="button" class="btn primary" id="ms-do"' + (canAct ? "" : " disabled") + ">" +
      (view < step ? "Next" : view > step ? "Back to step " + (step + 1) : done[s.id] ? (step >= STEPS.length - 1 ? "Finish" : "Next step") : s.action) +
      "</button>" +
      '<button type="button" class="btn" id="ms-back"' + (view === 0 ? " disabled" : "") + ">Back</button>" +
      '<button type="button" class="btn" id="ms-hub">Shop floor</button>' +
      (s.id === "flare" ? '<button type="button" class="btn" id="ms-flarelab">Flaring lab</button>' : "") +
      '<button type="button" class="btn" id="ms-ask">Ask HUB</button>' +
      "</div>" +
      '<div class="hub-chip" style="margin:10px 0"><img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" /><div><strong>Professor Andrew Hubbard</strong><p>' +
      hubLine(s) + "</p></div></div>" +
      '<p class="ms-detail">' + s.detail + "</p>" +
      "</main>" +
      '<aside class="ms-ref"><p class="eyebrow">Quick reference</p><ul>' +
      "<li><strong>Order</strong> — mount, penetration, outdoor, flare, torque, nitrogen, vacuum, decay, valves, electrical, commission</li>" +
      "<li><strong>Nut on first</strong> — then cut, deburr, flare</li>" +
      "<li><strong>Nitrogen</strong> — never oxygen or shop air</li>" +
      "<li><strong>≤500 microns</strong> and a decay hold</li>" +
      "<li><strong>Factory charge</strong> covers the rated lineset. Open valves only after decay holds</li>" +
      "</ul></aside></div></div>";

    root.querySelectorAll(".ms-step").forEach(function (b) {
      b.onclick = function () {
        const i = +b.dataset.i;
        if (!(i >= 0) || i >= STEPS.length) return;
        view = i;
        if (i === step + 1 && done[STEPS[step].id]) {
          step = i;
          note = "";
          render();
          return;
        }
        if (i > step) {
          const tool = (STEPS[step].tools.filter(function (t) { return t.correct; })[0] || {}).name || "the tool";
          note = done[STEPS[step].id]
            ? "Picture is step " + (i + 1) + ". The work still moves one step at a time."
            : "Picture is step " + (i + 1) + ". Finish step " + (step + 1) + " with the " + tool + " before the work moves ahead.";
        } else if (i !== step) {
          note = "Picture is step " + (i + 1) + ". Next and Back move the step. The work is step " + (step + 1) + ".";
        } else {
          note = "";
        }
        render();
      };
    });
    root.querySelectorAll(".ms-tool").forEach(function (b) {
      b.onclick = function () {
        if (view !== step || finished || done[s.id]) {
          if (done[s.id] && view === step && !finished) {
            note = step >= STEPS.length - 1 ? "Hit Finish. This picture stays with the step." : "This step is locked, so hit Next step.";
            render();
            return;
          }
          if (view !== step) {
            note = "This picture is step " + (view + 1) + ". The tool that counts is on step " + (step + 1) + ".";
          } else {
            note = "Do step " + (step + 1) + " first.";
          }
          if (window.PlayFeel) {
            window.PlayFeel.deny(b);
            window.PlayFeel.pop(b, "Not this step", "bad");
          }
          render();
          return;
        }
        const t = s.tools.find(function (x) { return x.id === b.getAttribute("data-tool"); });
        if (!t) return;
        if (t.correct) {
          toolHit[s.id] = t.id;
          note = t.name + " did the job. It stays in the picture.";
          if (window.PlayFeel) {
            window.PlayFeel.bump(b);
            window.PlayFeel.pop(b, t.name, "ok");
          }
          render();
          return;
        }
        toolMiss[s.id] = toolMiss[s.id] || {};
        toolMiss[s.id][t.id] = true;
        note = t.why || (t.name + " stays on the truck.");
        if (window.PlayFeel) {
          window.PlayFeel.deny(b);
          window.PlayFeel.pop(b, "Not this step", "bad");
        }
        render();
      };
    });
    const sceneEl = root.querySelector("#ms-scene");
    if (sceneEl) {
      sceneEl.onclick = function () {
        if (view !== step) {
          note = "This picture is step " + (view + 1) + ". Next and Back move steps. The work is still step " + (step + 1) + ".";
          const fb = root.querySelector("#ms-feedback");
          if (fb) { fb.textContent = note; fb.className = "ms-feedback"; }
          return;
        }
        if (done[s.id]) {
          note = step >= STEPS.length - 1 ? "Hit Finish while this picture stays." : "Hit Next step while this picture stays.";
          const fb = root.querySelector("#ms-feedback");
          if (fb) { fb.textContent = note; fb.className = "ms-feedback good"; }
          coachNow();
          return;
        }
        if (!toolHit[s.id]) {
          note = "Clicking the picture does not skip the tool, so pick the tool that does this step.";
          const fb = root.querySelector("#ms-feedback");
          if (fb) { fb.textContent = note; fb.className = "ms-feedback bad"; }
          if (window.PlayFeel) {
            window.PlayFeel.deny(sceneEl);
            window.PlayFeel.pop(sceneEl, "Not the tool", "bad");
          }
          coachNow();
          return;
        }
        note = "The picture is not the button, so next is " + s.action + ".";
        const fb = root.querySelector("#ms-feedback");
        if (fb) { fb.textContent = note; fb.className = "ms-feedback bad"; }
        coachNow();
      };
    }
    const range = root.querySelector("#ms-range");
    if (range && s.metric) {
      range.oninput = function () {
        values[s.metric.key] = +range.value;
        const out = root.querySelector("#ms-out");
        if (out) out.textContent = values[s.metric.key] + " " + s.metric.unit;
      };
    }
    const mic = root.querySelector("#ms-microns");
    if (mic) {
      mic.oninput = function () {
        values.microns = +mic.value;
        const out = root.querySelector("#ms-microns-out");
        if (out) out.textContent = values.microns + " µm";
        /* vacuum and decay keep their own pictures */
      };
    }
    const dec = root.querySelector("#ms-decay");
    if (dec) {
      dec.oninput = function () {
        values.decay = +dec.value;
        const out = root.querySelector("#ms-decay-out");
        if (out) out.textContent = values.decay + " µm";
      };
    }
    const len = root.querySelector("#ms-lineset");
    if (len) {
      len.oninput = function () {
        values.lineset = +len.value;
        const out = root.querySelector("#ms-lineset-out");
        if (out) out.textContent = values.lineset + " ft";
        const tgt = root.querySelector(".ms-target");
        if (tgt) tgt.textContent = "Rated " + RATED_FT + " ft. This run owes about " + owedOz(values.lineset).toFixed(1) + " oz. Zero extra if you are not past the rated length.";
      };
    }
    const extra = root.querySelector("#ms-extra");
    if (extra) {
      extra.oninput = function () {
        values.extraOz = +extra.value;
        const out = root.querySelector("#ms-extra-out");
        if (out) out.textContent = values.extraOz + " oz";
      };
    }
    const doBtn = root.querySelector("#ms-do");
    if (doBtn) doBtn.onclick = function () {
      if (view < step) {
        view++;
        note = "";
        render();
        return;
      }
      if (view > step) {
        view = step;
        note = "";
        render();
        return;
      }
      if (done[s.id]) {
        if (step >= STEPS.length - 1) {
          if (finished) return;
          finished = true;
          if (onDone) onDone(true, { lineset: values.lineset, extraOz: values.extraOz });
          return;
        }
        step++;
        view = step;
        note = "";
        render();
        return;
      }
      attempt(s);
    };
    const ask = root.querySelector("#ms-ask");
    if (ask) ask.onclick = function () {
      var line = hubLine(s);
      var narrow = false;
      try { narrow = window.matchMedia("(max-width:720px)").matches; } catch (_) {}
      if (!narrow) {
        try {
          if (window.HubAI) {
            if (window.HubAI.open) window.HubAI.open();
            if (window.HubAI.ask) window.HubAI.ask(s.id + " " + s.title + " " + s.tip + " — walk me through this mini-split install step");
          }
        } catch (_) {}
        return;
      }
      note = line;
      var fb = root.querySelector("#ms-feedback");
      if (fb) { fb.textContent = line; fb.className = "ms-feedback good"; }
      coachNow();
      keepOnScreen();
    };
    const back = root.querySelector("#ms-back");
    if (back) back.onclick = function () {
      if (view > 0) { view--; note = ""; render(); }
    };
    function goShop() { try { if (onDone) onDone(false); } catch (_) {} }
    const hub = root.querySelector("#ms-hub");
    if (hub) hub.onclick = goShop;
    const hubTop = root.querySelector("#ms-hub-top");
    if (hubTop) hubTop.onclick = goShop;
    const flab = root.querySelector("#ms-flarelab");
    if (flab) flab.onclick = function () { if (window.ltPlay) window.ltPlay("flare"); };
    if (window.PlayFeel && !finished) coachNow();
    else if (window.PlayFeel && finished) window.PlayFeel.coach(root, "Install is done. Service valves opened only after the vacuum held.");
    keepOnScreen();
  }

  function keepOnScreen() {
    if (!root || window.innerWidth > 720) return;
    var screen = document.getElementById("screen-minisplit");
    var btn = root.querySelector("#ms-do");
    var pic = root.querySelector(".ms-story > figure.now");
    if (!screen || !btn) return;
    var coach = document.querySelector("#pf-coach-bar, .walk-chip");
    var limit = window.innerHeight - 8;
    if (coach) {
      var ct = coach.getBoundingClientRect().top;
      if (ct > 120 && ct < limit) limit = ct - 8;
    }
    var br = btn.getBoundingClientRect();
    if (br.bottom > limit) screen.scrollTop += br.bottom - limit;
    if (!pic) return;
    var steps = root.querySelector(".ms-steps");
    var top = steps ? steps.getBoundingClientRect().bottom + 4 : 0;
    var pr = pic.getBoundingClientRect();
    var br2 = btn.getBoundingClientRect();
    if (pr.top < top && br2.bottom + (top - pr.top) <= limit) screen.scrollTop -= top - pr.top;
  }

  function coachNow() {
    if (!window.PlayFeel || !root) return;
    const live = STEPS[step];
    if (!live) return;
    if (finished) {
      window.PlayFeel.coach(root, "Install is done. Service valves opened only after the vacuum held.");
      return;
    }
    if (view !== step) {
      window.PlayFeel.coach(root, "This picture is step " + (view + 1) + ". The work is step " + (step + 1) + ".");
      return;
    }
    if (note && !done[live.id] && (!toolHit[live.id] || note.indexOf("did the job") === -1)) {
      window.PlayFeel.coach(root, note);
      return;
    }
    if (!toolHit[live.id]) {
      const t = live.tools.filter(function (x) { return x.correct; })[0];
      window.PlayFeel.coach(root, "Next tool: " + (t ? t.name : live.action) + ".");
      return;
    }
    if (!done[live.id]) {
      window.PlayFeel.coach(root, "Next: " + live.action + ".");
      return;
    }
    if (step >= STEPS.length - 1) {
      window.PlayFeel.coach(root, "Next is Finish, and the picture stays.");
      return;
    }
    window.PlayFeel.coach(root, "Next: " + STEPS[step + 1].title.replace(/^\d+\s·\s/, "") + ".");
  }

  function targetText(m) {
    if (m.key === "torque") return "Target: " + m.min + "–" + m.max + " " + m.unit + ". Over-torque cracks the flare. That is not a pass.";
    if (m.key === "n2") return "Target: " + m.min + "–" + m.max + " " + m.unit + " dry nitrogen. Not oxygen. Not shop air.";
    if (m.key === "flareQuality") return "Target: ≥ " + m.min + m.unit + ". A cracked flare is not a pass.";
    if (m.key === "deltaT") return "Target: ≥ " + m.min + " " + m.unit + " supply drop in cool";
    if (m.key === "microns") return "Target: ≤ 500 µm. Drag it up and the pull does not pass.";
    if (m.key === "decay") return "Target: ≤ 500 µm and no rise after the pump is isolated.";
    return "";
  }

  function attempt(s) {
    if (!root || view !== step || finished || done[s.id]) return;
    const fb = root.querySelector("#ms-feedback");
    if (!toolHit[s.id]) {
      const tool = (s.tools.filter(function (t) { return t.correct; })[0] || {}).name || "the tool";
      note = "Click the " + tool + ", which is the tool that does this step.";
      if (fb) { fb.textContent = note; fb.className = "ms-feedback bad"; }
      const btn = root.querySelector("#ms-do");
      if (window.PlayFeel) {
        window.PlayFeel.deny(btn || root);
        window.PlayFeel.pop(btn || root, "Not yet", "bad");
      }
      coachNow();
      return;
    }
    if (s.metric) {
      const m = s.metric;
      const v = values[m.key];
      let ok = true;
      let why = "";
      if (m.key === "flareQuality" && v < m.min) {
        ok = false;
        why = "The flare is rough or the nut was behind the block, so recut it.";
      }
      if (m.key === "torque" && (v < m.min || v > m.max)) {
        ok = false;
        why = v > m.max ? "Over-torqued, so the flare cracks and that is not a pass." : "Under-torqued, and that leak is the callback you just bought.";
      }
      if (m.key === "n2" && (v < m.min || v > m.max)) {
        ok = false;
        why = "Bring dry nitrogen into about 450–550 psig, and leave oxygen, shop air, and the service valves shut.";
      }
      if (m.key === "microns" && v > 500) {
        ok = false;
        why = "Still above 500 microns, so the pump has not proved the pull.";
      }
      if (m.key === "decay") {
        if (v > values.microns) {
          ok = false;
          why = "The microns rose after you isolated the pump, so do not open the service valves.";
        } else if (v > 500) {
          ok = false;
          why = "Still above 500 microns after isolation, so the decay has not held.";
        }
      }
      if (m.key === "deltaT" && v < m.min) {
        ok = false;
        why = "Low ΔT, so check valves, airflow, and mode instead of adding gas to hide it.";
      }
      if (!ok) {
        note = why;
        if (fb) { fb.textContent = why; fb.className = "ms-feedback bad"; }
        const btn = root.querySelector("#ms-do");
        if (window.PlayFeel) {
          window.PlayFeel.deny(btn || root);
          window.PlayFeel.pop(btn || root, "Out of range", "bad");
        }
        coachNow();
        return;
      }
    }
    done[s.id] = true;
    note = step >= STEPS.length - 1
      ? "Hit Finish, because the vacuum held before the service valves opened."
      : "Step complete, so take the next step while this picture stays.";
    if (!lockedPop[step]) {
      lockedPop[step] = true;
      const anchor = root.querySelector("#ms-scene figure.now") || root.querySelector("#ms-do") || root;
      if (window.PlayFeel) window.PlayFeel.pop(anchor, "Step locked", "ok");
    }
    if (onXp) onXp(12);
    if (step >= STEPS.length - 1 && onXp) onXp(40);
    if (window.LtHaptic) window.LtHaptic.land();
    render();
  }

  function ensureFit() {
    if (document.getElementById("ms-fit")) return;
    const st = document.createElement("style");
    st.id = "ms-fit";
    st.textContent =
      "#minisplit-root,#minisplit-root .ms-layout,#minisplit-root .ms-body,#minisplit-root .ms-card,#minisplit-root .ms-scene{max-width:100%;min-width:0}" +
      "#minisplit-root .ms-layout{box-sizing:border-box}" +
      "#minisplit-root .ms-photo,#minisplit-root .ms-vis,#minisplit-root .ms-tool img{max-width:100%!important;object-fit:contain!important;object-position:center;background:#10141a}" +
      "#minisplit-root .ms-story>figure.now{max-width:100%;background:#10141a;border-radius:12px}" +
      "#minisplit-root .ms-story>figure.now .ms-photo,#minisplit-root .ms-story>figure.now .ms-vis{display:block;width:100%!important;height:auto!important;max-height:min(42vh,320px)!important;object-fit:contain!important}" +
      "#minisplit-root .ms-built .ms-photo,#minisplit-root .ms-built .ms-vis{width:108px!important;height:76px!important;max-width:100%!important;object-fit:contain!important}" +
      "#minisplit-root .ms-tool img{width:100%!important;height:88px!important;object-fit:contain!important}" +
      "@media (max-width:900px){#minisplit-root .ms-photo,#minisplit-root .ms-vis{height:auto!important;max-height:min(42vh,320px)!important}#minisplit-root .ms-step{min-height:48px;min-width:72px}#minisplit-root .ms-step em{display:inline!important}#minisplit-root .ms-actions .btn{min-height:48px}}#minisplit-root .ms-step.viewing{box-shadow:inset 0 0 0 2px #e8c450;color:#fff}";
    document.head.appendChild(st);
  }

  function start(host, opts) {
    floorFit("ms-floor-fit", [
      "@media (max-width:720px){",
      "#minisplit-root .ms-photo,#minisplit-root .ms-vis{min-height:160px!important;max-height:34vh!important;height:auto!important;width:100%!important;object-fit:contain!important;background:#10141a}",
      "#minisplit-root .ms-tools{flex:0 0 auto}",
      "#minisplit-root .ms-tool{min-height:64px}#minisplit-root .ms-tool img{height:72px!important}",
      "#minisplit-root .ms-tip{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:2px 0}",
      "#minisplit-root .ms-card{display:flex!important;flex-direction:column!important}",
      "#minisplit-root .ms-card h3{order:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      "#minisplit-root .ms-scene{order:2}",
      "#minisplit-root .ms-tools{order:3}",
      "#minisplit-root .ms-metric{order:4;display:grid!important;grid-template-columns:1fr 1fr;gap:4px 8px;align-items:end}",
      "#minisplit-root .ms-metric .ms-target{grid-column:1 / -1;margin:2px 0 4px!important}",
      "#minisplit-root .ms-metric label{margin:0!important;font-size:11px}",
      "#minisplit-root .ms-feedback{order:5;margin:4px 0!important;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}",
      "#minisplit-root .ms-feedback:empty{display:none!important;min-height:0!important;margin:0!important}",
      "#minisplit-root .ms-actions{order:6;position:relative;z-index:3;margin-bottom:4px!important}",
      "#minisplit-root .ms-tip{order:7;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
      "#minisplit-root .ms-card .eyebrow{display:none!important}",
      "#minisplit-root .ms-built{display:none!important}",
      "#minisplit-root .ms-actions .btn{min-height:48px!important;font-size:16px}",
      "#minisplit-root .ms-actions #ms-hub{display:none!important}",
      "#minisplit-root .ms-step{min-height:48px!important;min-width:92px!important}",
      "#minisplit-root .ms-step em{display:inline!important;font-style:normal}",
      "#minisplit-root .ms-step.viewing{box-shadow:inset 0 0 0 2px #e8c450;color:#fff}",
      "#minisplit-root .ms-chapter{display:none!important}",
      "#minisplit-root .ms-built figure{flex:0 0 64px!important}",
      "#minisplit-root .ms-built .ms-photo,#minisplit-root .ms-built .ms-vis{width:64px!important;height:44px!important;max-height:44px!important}",
      "#minisplit-root .ms-built figcaption{display:none!important}",
      "#minisplit-root .ms-held{display:-webkit-box!important;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden!important;margin:2px 0!important}",
      "#minisplit-root .ms-tool span{font-size:12px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:4px 2px 6px!important}",
      "body:has(#screen-minisplit.active) .walk-chip,body:has(#screen-minisplit.active) #pf-coach-bar{left:8px!important;right:auto!important;bottom:8px!important;top:auto!important;width:min(188px,48vw)!important;max-height:56px!important;overflow:hidden!important}",
      "body:has(#screen-minisplit.active) #pf-coach-line{white-space:normal!important;line-height:1.2!important;max-height:2.4em!important;overflow:hidden!important}",
      "body:has(#screen-minisplit.active) #toast-host{top:2px!important;right:8px!important;left:auto!important;bottom:auto!important;transform:none!important;width:min(132px,38vw)!important;max-height:28px!important;overflow:hidden!important;z-index:40!important}",
      "body:has(#screen-minisplit.active) .ld-replay{top:auto!important;bottom:8px!important;right:8px!important;left:auto!important;max-width:124px!important}",
      "}",
    ].join(""));
    root = host;
    if (!root) return { stop: function () {} };
    ensureFit();
    onXp = opts && opts.onXp;
    onDone = opts && opts.onDone;
    systemName = (opts && opts.systemName) || "Daikin Aurora Mini-Split";
    step = 0;
    view = 0;
    toolHit = {};
    toolMiss = {};
    note = "";
    lockedPop = {};
    done = {};
    finished = false;
    values = freshValues();
    render();
    return { stop: function () {} };
  }

  global.MiniSplitInstall = { start: start, STEPS: STEPS };
})(window);
