/* Mini-split install lab — real order, one tool per step. */
(function (global) {
  "use strict";

  const RATED_FT = 25;
  const OZ_PER_FT = 0.2;

  const STEPS = [
    {
      id: "mount-idu",
      title: "1 · Mount indoor head",
      tip: "Level the mounting plate on an exterior wall. The level is the tool that does this step, and the drill fails because it makes holes and does not level the head.",
      detail: "Mark studs, bubble the plate, then hang the head. A crooked plate is a crooked head forever.",
      check: "Plate is level and secured to structure",
      photo: "ms/01-mount.jpg",
      tools: [
        { id: "level", name: "Level", img: "ms/tools/level.jpg", correct: true },
        { id: "plate", name: "Mounting plate", img: "ms/tools/plate.jpg", why: "The plate stays on the truck until the bubble is centered. It does not level itself." },
        { id: "drill", name: "Drill", img: "ms/tools/drill.jpg", why: "The drill stays on the truck for this step. It makes holes. It does not level the head." },
      ],
      action: "Mount plate & hang IDU",
      metric: null,
    },
    {
      id: "penetration",
      title: "2 · Wall penetration",
      tip: "Hole saw, about 2.5–3 in, sloping down to the outside so water leaves.",
      detail: "Sleeve comes after the hole. Don't run the line set through a raw, uphill bore.",
      check: "Hole slopes out",
      photo: "",
      tools: [
        { id: "holesaw", name: "Hole saw", img: "ms/tools/holesaw.jpg", correct: true },
        { id: "sleeve", name: "PVC sleeve", img: "ms/tools/sleeve.jpg", why: "The sleeve stays on the truck until the hole exists. It does not drill the penetration." },
        { id: "drill", name: "Twist drill", img: "ms/tools/drill.jpg", why: "A twist bit stays on the truck. This penetration is a hole saw, sloping out." },
      ],
      action: "Drill the wall",
      metric: null,
    },
    {
      id: "set-odu",
      title: "3 · Set condenser",
      tip: "Pad or bracket, level, with service clearance. Disconnect is later — it does not set the unit.",
      detail: "Keep the coil face open. Vibration pads cut noise transfer. Do not block airflow.",
      check: "Condenser level · clearance OK",
      photo: "ms/03-outdoor.jpg",
      tools: [
        { id: "pad", name: "Pad", img: "ms/tools/pad.jpg", correct: true },
        { id: "disc", name: "Disconnect", img: "ms/tools/disc.jpg", why: "The disconnect stays on the truck for this step. It does not set the condenser." },
        { id: "jug", name: "Refrigerant jug", img: "recover/junk.jpg", why: "The jug stays on the truck. You are setting the condenser, not charging it." },
      ],
      action: "Set the condenser",
      metric: null,
    },
    {
      id: "lineset",
      title: "4 · Line set",
      tip: "Run liquid, suction, drain, and the cable through the sleeve. Drain keeps going downhill.",
      detail: "Protect the insulation from the wall. The flare happens after the line set is through, not in the hole.",
      check: "Line set through the sleeve · drain downhill",
      photo: "ms/02-penetration.jpg",
      tools: [
        { id: "sleeve", name: "Line set & sleeve", img: "ms/tools/sleeve.jpg", correct: true },
        { id: "holesaw", name: "Hole saw", img: "ms/tools/holesaw.jpg", why: "The hole is already drilled. The saw stays on the truck." },
        { id: "flare", name: "Flaring tool", img: "ms/tools/flare.jpg", why: "The flaring tool stays on the truck until the line set is through the wall." },
      ],
      action: "Run the line set",
      metric: null,
    },
    {
      id: "flare",
      title: "5 · Flares",
      tip: "Nut on first, then the seat. The flaring tool is what makes this picture.",
      detail: "A flare with the nut behind the block will not pass the nut. Cracks and over-torque are a recut, not a pass.",
      check: "Flares clean · nut on the tube · no cracks",
      photo: "ms/04-flare.jpg",
      tools: [
        { id: "flare", name: "Flaring tool", img: "ms/tools/flare.jpg", correct: true },
        { id: "cutter", name: "Tube cutter", img: "ms/tools/cutter.jpg", why: "The cutter stays on the truck until the flare nut is on the tube. A cut before the nut does not count, and the cutter does not make the seat." },
        { id: "deburr", name: "Deburr", img: "ms/tools/deburr.jpg", why: "The deburr tool stays on the truck for this step. It does not form the flare." },
      ],
      action: "Make flares",
      metric: { key: "flareQuality", label: "Flare quality", min: 80, unit: "%" },
    },
    {
      id: "torque",
      title: "6 · Torque flare nuts",
      tip: "Torque wrench to the OEM chart. Backup wrench holds the body — it does not set the ft-lb.",
      detail: "1/4″ is often 10–13 ft-lb. 3/8″ is hotter. Over-torque cracks the flare. The manual on the truck beats a guess.",
      check: "Both ends torqued to spec · not cracked",
      photo: "ms/05-torque.jpg",
      tools: [
        { id: "torque", name: "Torque wrench", img: "ms/tools/torque.jpg", correct: true },
        { id: "backup", name: "Backup wrench", img: "ms/tools/backup.jpg", why: "The backup wrench stays on the truck if it is the only tool you picked. It holds the valve. The torque wrench sets the ft-lb." },
        { id: "allen", name: "Allen key", img: "ms/tools/allen.jpg", why: "The Allen key stays on the truck. Service valves are still shut. This step is the flare nut." },
      ],
      action: "Torque connections",
      metric: { key: "torque", label: "Torque applied", min: 10, max: 13, unit: "ft-lb", target: 12 },
    },
    {
      id: "nitrogen",
      title: "7 · Nitrogen pressure test",
      tip: "Dry nitrogen only. Oxygen or shop air stays on the truck — that test is a fail.",
      detail: "Service valves still closed. Many OEMs want about 450–550 psig. Soap the flares after the nitrogen is in. Fix leaks before vacuum.",
      check: "Nitrogen holds · no oxygen · no shop air",
      photo: "ms/06-nitrogen.jpg",
      tools: [
        { id: "n2", name: "Nitrogen", img: "ms/tools/n2.jpg", correct: true },
        { id: "o2", name: "Oxygen", img: "recover/tank.jpg", why: "Oxygen stays on the truck. It is a fuel, not a pressure test. That choice is a fail." },
        { id: "air", name: "Shop air", img: "recover/machine-tank.jpg", why: "Shop air stays on the truck. It is wet, and it is not nitrogen. A pressure test with air is a fail." },
      ],
      action: "Pressurize with N₂",
      metric: { key: "n2", label: "N₂ pressure", min: 450, max: 550, unit: "psig", target: 500 },
    },
    {
      id: "evacuate",
      title: "8 · Evacuate to 500 microns and decay",
      tip: "Micron gauge at the system, not at the pump. Pull to 500 microns, isolate, and watch the decay.",
      detail: "0 in Hg on a compound gauge is just 0 psig. A continuous rise is a leak. A high plateau is moisture. Do not open the valves until both numbers pass.",
      check: "≤500 microns · decay holds",
      photo: "ms/07-vacuum.jpg",
      tools: [
        { id: "micron", name: "Micron gauge", img: "ms/tools/micron.jpg", correct: true },
        { id: "gauges", name: "Compound gauges", img: "parts/gauges.png", why: "Compound gauges stay on the truck. 0 in Hg is not 500 microns, and they will not show decay." },
        { id: "jug", name: "Refrigerant jug", img: "recover/junk.jpg", why: "The jug stays on the truck. You evacuate before any extra charge." },
      ],
      action: "Pull and prove the vacuum",
      metric: { key: "evacuate", label: "Microns and decay" },
    },
    {
      id: "weigh",
      title: "9 · Weigh extra charge past the rated lineset",
      tip: "Factory charge covers the rated lineset only (this unit: " + RATED_FT + " ft). Weigh extra ounces only for the feet past that. A short run gets zero extra.",
      detail: "About " + OZ_PER_FT + " oz per extra foot on this lineset pair. The scale is the charge. Do not dump a jug because the glass bubbled.",
      check: "Extra ounces match the feet past " + RATED_FT + " ft · zero if the run is short",
      photo: "cc/10-weigh.jpg",
      tools: [
        { id: "scale", name: "Scale", img: "cc/tool-scale.jpg", correct: true },
        { id: "jug", name: "Jug with no scale", img: "recover/junk.jpg", why: "The jug stays on the truck until a scale is under it. Extra charge is weighed, and only past the rated lineset." },
        { id: "gauges", name: "Gauges", img: "parts/gauges.png", why: "Gauges stay on the truck for this step. Ounces come off the scale, not the needles." },
      ],
      action: "Weigh only what the chart owes",
      metric: { key: "weigh", label: "Lineset and extra charge", rated: RATED_FT, perFt: OZ_PER_FT },
    },
    {
      id: "valves",
      title: "10 · Open service valves",
      tip: "Allen key. Liquid first, then suction. Caps back on.",
      detail: "The factory charge is already in the condenser. Open the valves only after the vacuum held and any extra charge is weighed.",
      check: "Both valves fully open · caps on",
      photo: "ms/09-valves.jpg",
      tools: [
        { id: "allen", name: "Allen key", img: "ms/tools/allen.jpg", correct: true },
        { id: "torque", name: "Torque wrench", img: "ms/tools/torque.jpg", why: "The torque wrench stays on the truck. These valves are a hex, not a flare nut." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck. Don't start the unit with the valves still shut." },
      ],
      action: "Open service valves",
      metric: null,
    },
    {
      id: "commission",
      title: "11 · Run and check",
      tip: "Run cool and heat. Thermometer on the supply. Look at drain flow and codes.",
      detail: "Log lineset length and any extra ounces. Power and comms have to be landed before this run means anything. Seal the penetration.",
      check: "Cooling ΔT good · drain flows · no error codes",
      photo: "ms/11-commission.jpg",
      tools: [
        { id: "thermo", name: "Thermometer", img: "ms/tools/thermo.jpg", correct: true },
        { id: "gauges", name: "Manifold", img: "parts/gauges.png", why: "The manifold stays on the truck for this check. You are proving supply ΔT at the head." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck for this check. The thermometer is the tool that proves the run." },
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

  function freshValues() {
    return { flareQuality: 88, torque: 12, n2: 500, microns: 1800, decay: 1500, lineset: 49, extraOz: 0, deltaT: 20 };
  }

  function brandMark() {
    return (window.LtBrand && window.LtBrand.mark) || "HA";
  }
  function brandOrg() {
    return (window.LtBrand && window.LtBrand.org) || "HVAC Legends";
  }

  function owedOz(len) {
    if (len <= RATED_FT) return 0;
    return (len - RATED_FT) * OZ_PER_FT;
  }

  function scene(id) {
    const s = STEPS.filter(function (x) { return x.id === id; })[0];
    let src = s && s.photo;
    if (id === "evacuate" && values.microns <= 500) src = "ms/08-decay.jpg";
    if (src) return '<img class="ms-photo" src="' + src + '?v=1" alt="" />';
    const cap = 'font-size="11" fill="#e8c450" font-family="system-ui,sans-serif" font-weight="700"';
    const body =
      '<rect x="90" y="20" width="28" height="180" fill="#3a4550"/>' +
      '<line x1="40" y1="70" x2="200" y2="110" stroke="#CE0034" stroke-width="10" stroke-linecap="round"/>' +
      '<line x1="40" y1="70" x2="200" y2="110" stroke="#8ec8ff" stroke-width="4"/>' +
      '<path d="M200 118 l8 14 l-6 0 z" fill="#8ec8ff"/>' +
      "<text x='24' y='60' " + cap + ">INSIDE</text>" +
      "<text x='150' y='168' " + cap + ">SLOPE OUT</text>";
    return '<svg class="ms-vis" viewBox="0 0 260 200" role="img" aria-label="Wall penetration"><rect width="260" height="200" rx="12" fill="#10161c"/>' + body + "</svg>";
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
    if (m.key === "flareQuality") return { min: 40, max: 100 };
    if (m.key === "deltaT") return { min: 0, max: 30 };
    return { min: 0, max: 100 };
  }

  function metricBlock(s) {
    if (!s.metric) return "";
    const m = s.metric;
    if (m.key === "evacuate") {
      return (
        '<div class="ms-metric">' +
        '<label>Microns <input type="range" id="ms-microns" min="50" max="3000" value="' + values.microns + '" />' +
        '<output id="ms-microns-out">' + values.microns + " µm</output></label>" +
        '<label>Decay after isolation <input type="range" id="ms-decay" min="50" max="3000" value="' + values.decay + '" />' +
        '<output id="ms-decay-out">' + values.decay + " µm</output></label>" +
        '<p class="ms-target">Pull to ≤500 µm, isolate the pump, and do not let the microns rise. A rising reading is a leak or moisture, not a pass.</p></div>'
      );
    }
    if (m.key === "weigh") {
      const owed = owedOz(values.lineset);
      return (
        '<div class="ms-metric">' +
        '<label>Lineset <input type="range" id="ms-lineset" min="10" max="75" value="' + values.lineset + '" />' +
        '<output id="ms-lineset-out">' + values.lineset + " ft</output></label>" +
        '<label>Extra charge <input type="range" id="ms-extra" min="0" max="20" value="' + values.extraOz + '" />' +
        '<output id="ms-extra-out">' + values.extraOz + " oz</output></label>" +
        '<p class="ms-target">Rated ' + RATED_FT + " ft. This run owes about " + owed.toFixed(1) + " oz. Zero extra if you are not past the rated length.</p></div>"
      );
    }
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
    const s = STEPS[view] || STEPS[0];
    const completed = Object.keys(done).length;
    const pct = Math.round((completed / STEPS.length) * 100);
    const showResult = !!(done[s.id] || toolHit[s.id]);
    const canDo = view === step && !done[s.id] && !finished;
    const looking = view !== step;
    const visual = showResult
      ? scene(s.id)
      : '<div class="ms-wait"><p>Picture stays shut.</p><span>Pick the tool that does this step.</span></div>';

    root.innerHTML =
      '<div class="ms-layout">' +
      '<header class="ms-head">' +
      '<button type="button" class="btn" id="ms-hub-top">Shop floor</button>' +
      "<h2>Mini-split · " + (step + 1) + "/" + STEPS.length + "</h2>" +
      '<div class="ms-progress"><div class="ms-bar"><i style="width:' + pct + '%"></i></div><span>' +
      completed + " done</span></div></header>" +
      '<div class="ms-body">' +
      '<aside class="ms-steps">' +
      STEPS.map(function (st, i) {
        const cls = done[st.id] ? "done" : i === step ? "active" : "";
        return '<button type="button" class="ms-step ' + cls + '" data-i="' + i + '"><span>' + (i + 1) + "</span><em>" +
          st.title.replace(/^\d+\s·\s/, "") + "</em></button>";
      }).join("") +
      "</aside>" +
      '<main class="ms-card">' +
      '<div class="ms-scene' + (showResult ? " shown" : " locked") + '" id="ms-scene">' + visual +
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
      '<p class="ms-feedback' + (note ? (toolHit[s.id] && !looking ? " good" : " bad") : "") + '" id="ms-feedback">' +
      (note || "") + "</p>" +
      '<p class="eyebrow">Step ' + (step + 1) + " of " + STEPS.length +
      (looking ? " · sent back — live step is " + (step + 1) : "") + "</p>" +
      "<h3>" + s.title + "</h3>" +
      '<p class="ms-tip">' + s.tip + "</p>" +
      metricBlock(s) +
      '<p class="ms-check">Success: <strong>' + s.check + "</strong></p>" +
      '<div class="ms-actions">' +
      '<button type="button" class="btn primary" id="ms-do"' + (canDo || looking ? "" : " disabled") + ">" +
      (looking ? "Back to step " + (step + 1) : done[s.id] ? "Done" : s.action) +
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
      "<li><strong>Order</strong> — head, hole, condenser, line set, flares, torque, nitrogen, 500 microns and decay, weigh extra only past the rated lineset, valves, run</li>" +
      "<li><strong>Nut on first</strong> — then cut, deburr, flare</li>" +
      "<li><strong>Nitrogen</strong> — never oxygen or shop air</li>" +
      "<li><strong>≤500 microns</strong> and a decay hold</li>" +
      "<li><strong>Extra charge</strong> only for feet past the rated lineset</li>" +
      "</ul></aside></div></div>";

    root.querySelectorAll(".ms-step").forEach(function (b) {
      b.onclick = function () {
        const i = +b.dataset.i;
        if (!(i >= 0) || i >= STEPS.length) return;
        if (i > step) {
          view = step;
          note = "That picture is still ahead. You're on step " + (step + 1) + ". The later photo stays shut.";
          render();
          return;
        }
        view = i;
        if (i !== step) note = "Back to step " + (step + 1) + " when you're done looking.";
        else note = "";
        render();
      };
    });
    root.querySelectorAll(".ms-tool").forEach(function (b) {
      b.onclick = function () {
        if (view !== step || finished || done[s.id]) {
          view = step;
          note = "Do step " + (step + 1) + " first. That picture stays shut.";
          render();
          return;
        }
        const t = s.tools.find(function (x) { return x.id === b.getAttribute("data-tool"); });
        if (!t) return;
        if (t.correct) {
          toolHit[s.id] = t.id;
          note = t.name + " did the job. That picture is the result.";
          render();
          attempt(s);
          return;
        }
        toolMiss[s.id] = toolMiss[s.id] || {};
        toolMiss[s.id][t.id] = true;
        note = t.why || (t.name + " stays on the truck.");
        render();
      };
    });
    const sceneEl = root.querySelector("#ms-scene");
    if (sceneEl) {
      sceneEl.onclick = function () {
        if (view !== step) {
          view = step;
          note = "That picture isn't the live step. Back on step " + (step + 1) + ".";
          render();
          return;
        }
        if (!toolHit[s.id]) {
          note = "Clicking the picture does not skip the tool. Pick the tool that does this step.";
          const fb = root.querySelector("#ms-feedback");
          if (fb) { fb.textContent = note; fb.className = "ms-feedback bad"; }
          return;
        }
        attempt(s);
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
        const img = root.querySelector("#ms-scene .ms-photo");
        if (img) img.src = (values.microns <= 500 ? "ms/08-decay.jpg" : "ms/07-vacuum.jpg") + "?v=1";
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
      if (view !== step) {
        view = step;
        note = "";
        render();
        return;
      }
      attempt(s);
    };
    const ask = root.querySelector("#ms-ask");
    if (ask) ask.onclick = function () {
      try {
        if (window.HubAI) {
          if (window.HubAI.open) window.HubAI.open();
          if (window.HubAI.ask) window.HubAI.ask(s.id + " " + s.title + " " + s.tip + " — walk me through this mini-split install step");
        }
      } catch (_) {}
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
    const fbEl = root.querySelector("#ms-feedback");
    if (fbEl && note) {
      try { fbEl.scrollIntoView({ block: "nearest" }); } catch (_) {}
    }
  }

  function targetText(m) {
    if (m.key === "torque") return "Target: " + m.min + "–" + m.max + " " + m.unit + ". Over-torque cracks the flare. That is not a pass.";
    if (m.key === "n2") return "Target: " + m.min + "–" + m.max + " " + m.unit + " dry nitrogen. Not oxygen. Not shop air.";
    if (m.key === "flareQuality") return "Target: ≥ " + m.min + m.unit + ". A cracked flare is not a pass.";
    if (m.key === "deltaT") return "Target: ≥ " + m.min + " " + m.unit + " supply drop in cool";
    return "";
  }

  function attempt(s) {
    if (!root || view !== step || finished || done[s.id]) return;
    const fb = root.querySelector("#ms-feedback");
    if (!toolHit[s.id]) {
      note = "Click the tool that does this step. The picture stays shut until you do.";
      if (fb) { fb.textContent = note; fb.className = "ms-feedback bad"; }
      return;
    }
    if (s.metric) {
      const m = s.metric;
      const v = values[m.key];
      let ok = true;
      let why = "";
      if (m.key === "flareQuality" && v < m.min) {
        ok = false;
        why = "Flare is rough, cracked, or the nut was behind the block. Recut. That is not a pass.";
      }
      if (m.key === "torque" && (v < m.min || v > m.max)) {
        ok = false;
        why = v > m.max ? "Over-torqued. The flare cracks. That is not a pass." : "Under-torqued. That leak is the callback you just bought.";
      }
      if (m.key === "n2" && (v < m.min || v > m.max + 50)) {
        ok = false;
        why = "Bring dry nitrogen into the OEM band, about 450–550 psig. Oxygen and shop air stay on the truck.";
      }
      if (m.key === "evacuate") {
        if (values.microns > 500) {
          ok = false;
          why = "Still above 500 microns. The micron gauge has not proved the pull.";
        } else if (values.decay > values.microns) {
          ok = false;
          why = "The microns rose after you isolated the pump. A rising reading is a leak or moisture, not a pass.";
        }
      }
      if (m.key === "weigh") {
        const owed = owedOz(values.lineset);
        if (values.lineset <= RATED_FT && values.extraOz > 0) {
          ok = false;
          why = "This run is not past the rated " + RATED_FT + " ft lineset. Extra charge stays in the jug.";
        } else if (Math.abs(values.extraOz - owed) > 1) {
          ok = false;
          why = "Weigh about " + owed.toFixed(1) + " oz for the feet past " + RATED_FT + " ft. A guess is the callback you just bought.";
        }
      }
      if (m.key === "deltaT" && v < m.min) {
        ok = false;
        why = "Low ΔT. Valves, airflow, and mode — don't add gas to hide it.";
      }
      if (!ok) {
        note = why;
        if (fb) { fb.textContent = why; fb.className = "ms-feedback bad"; }
        return;
      }
    }
    done[s.id] = true;
    note = "Step complete.";
    if (fb) { fb.textContent = note; fb.className = "ms-feedback good"; }
    if (onXp) onXp(12);
    if (window.LtHaptic) window.LtHaptic.land();
    if (step >= STEPS.length - 1) {
      finished = true;
      if (fb) fb.textContent = "Install complete. Head, line set, flares, nitrogen, 500 microns, extra charge only past the rated lineset, valves open, running.";
      if (onXp) onXp(40);
      setTimeout(function () { if (onDone) onDone(true); }, 900);
      return;
    }
    setTimeout(function () {
      step++;
      view = step;
      note = "";
      render();
    }, 450);
  }

  function start(host, opts) {
    root = host;
    if (!root) return { stop: function () {} };
    onXp = opts && opts.onXp;
    onDone = opts && opts.onDone;
    systemName = (opts && opts.systemName) || "Daikin Aurora Mini-Split";
    step = 0;
    view = 0;
    toolHit = {};
    toolMiss = {};
    note = "";
    done = {};
    finished = false;
    values = freshValues();
    render();
    return { stop: function () {} };
  }

  global.MiniSplitInstall = { start: start, STEPS: STEPS };
})(window);
