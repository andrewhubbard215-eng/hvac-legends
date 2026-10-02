/* Compressor change-out — same tool grid as the mini-split lab.
   The picture stays shut until the right tool is picked. */
(function (global) {
  "use strict";

  const STEPS = [
    {
      id: "recover",
      title: "1 · Recover",
      tip: "The recovery machine pulls the charge out before the compressor does, and a refrigerant jug fails because you are pulling charge out, not dumping a can in. DOT tank on a scale. Never vent.",
      detail: "Stop at 80% by weight. R-410A specific gravity at 77°F is 1.059, so the multiplier is 0.8472 times water capacity. Ice cools the tank. It does not raise the stop.",
      check: "Charge is in the tank",
      photo: "cc/01-recover.jpg",
      action: "Charge is out",
      tools: [
        { id: "machine", name: "Recovery machine", img: "recover/machine.jpg", correct: true },
        { id: "pump", name: "Vacuum pump", img: "ms/tools/pump.jpg", why: "The vacuum pump stays on the truck. It does not recover refrigerant." },
        { id: "jug", name: "Refrigerant jug", img: "recover/junk.jpg", why: "The jug stays on the truck. You are pulling charge out, not dumping a can in." },
      ],
    },
    {
      id: "lock",
      title: "2 · Lock out",
      tip: "Pull the disconnect and lock it. A tag is not a lock.",
      detail: "The condenser is 208/240. Prove it dead at the contactor before your hands are in the cabinet.",
      check: "Disconnect is locked",
      photo: "cc/02-lockout.jpg",
      action: "Locked out",
      tools: [
        { id: "lock", name: "Lockout", img: "cc/tool-lock.jpg", correct: true },
        { id: "strippers", name: "Wire strippers", img: "ms/tools/strippers.jpg", why: "Strippers stay on the truck. This step is a lock, not a splice." },
        { id: "disc", name: "Just the door", img: "ms/tools/disc.jpg", why: "A door stays on the truck as a lock. A tag is not a lockout." },
      ],
    },
    {
      id: "meter",
      title: "3 · Meter the new compressor",
      tip: "Ohms on the new scroll before it is brazed in. Windings to ground should be open.",
      detail: "Run to common and start to common are a few ohms. Run to start is the sum. A short to the shell is a bad compressor, still in the box.",
      check: "Windings good · shell open",
      photo: "cc/03-meter.jpg",
      action: "Compressor meters good",
      tools: [
        { id: "meter", name: "Multimeter", img: "ms/tools/meter.jpg", correct: true },
        { id: "thermo", name: "Thermometer", img: "ms/tools/thermo.jpg", why: "The thermometer stays on the truck. Windings are ohms, not degrees." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck. Meter the compressor before it is brazed in." },
      ],
    },
    {
      id: "cut",
      title: "4 · Cut the stubs",
      tip: "Tube cutter on the suction and discharge stubs. The charge is already out.",
      detail: "Do not saw into a line that still has refrigerant. Deburr the cuts so copper trash does not stay in the loop.",
      check: "Both stubs cut and deburred",
      photo: "cc/04-cut.jpg",
      action: "Stubs are cut",
      tools: [
        { id: "cutter", name: "Tube cutter", img: "ms/tools/cutter.jpg", correct: true },
        { id: "saw", name: "Hole saw", img: "ms/tools/holesaw.jpg", why: "The hole saw stays on the truck. Stubs get a tube cutter, not a wall saw." },
        { id: "torch", name: "Torch", img: "cc/tool-torch.jpg", why: "The torch stays on the truck until the stubs are cut. You do not burn a stub out." },
      ],
    },
    {
      id: "set",
      title: "5 · Set the new scroll",
      tip: "Rubber grommets. Stubs line up. Do not force a crooked compressor into the pipes.",
      detail: "Match the replacement to the nameplate. A different oil or a different refrigerant does not belong in this cabinet.",
      check: "New compressor is in the pan",
      photo: "cc/05-set.jpg",
      action: "Compressor is set",
      tools: [
        { id: "scroll", name: "New scroll", img: "cc/tool-scroll.jpg", correct: true },
        { id: "disc", name: "Contactor", img: "ms/tools/disc.jpg", why: "The contactor stays on the truck. This step is the compressor in the pan." },
        { id: "cap", name: "Capacitor", img: "ms/tools/pad.jpg", why: "The capacitor stays on the truck. You are setting the scroll, not the run cap." },
      ],
    },
    {
      id: "braze",
      title: "6 · Braze with nitrogen flowing",
      tip: "Nitrogen through the circuit while the torch is on the joint. No nitrogen, the inside of the pipe scales.",
      detail: "Low flow, just enough to feel at the far port. Bright copper, not a burned joint. The power head of a TXV stays cool and away from this flame.",
      check: "Joints made under nitrogen",
      photo: "cc/06-braze.jpg",
      action: "Joints are brazed",
      tools: [
        { id: "n2", name: "Nitrogen", img: "ms/tools/n2.jpg", flow: true },
        { id: "torch", name: "Torch", img: "cc/tool-torch.jpg", needsN2: true },
        { id: "o2", name: "Oxygen", img: "recover/tank.jpg", why: "Oxygen stays on the truck. Purging with oxygen is a fail, not a braze." },
        { id: "air", name: "Shop air", img: "recover/machine-tank.jpg", why: "Shop air stays on the truck. Wet air in a refrigerant joint is a fail." },
      ],
    },
    {
      id: "drier",
      title: "7 · New liquid-line drier",
      tip: "The old drier stays with the old compressor. Arrow points with the flow.",
      detail: "Any time the loop is open, the filter-drier is replaced. It is not cleaned and put back.",
      check: "New drier, arrow with the flow",
      photo: "cc/07-drier.jpg",
      action: "Drier is in",
      tools: [
        { id: "drier", name: "New filter-drier", img: "cc/tool-drier.jpg", correct: true },
        { id: "soap", name: "Soap", img: "ms/tools/soap.jpg", why: "Soap stays on the truck until the joint is cold. It does not install the drier." },
        { id: "micron", name: "Micron gauge", img: "ms/tools/micron.jpg", why: "The micron gauge stays on the truck until the new drier is in." },
      ],
    },
    {
      id: "nitrogen",
      title: "8 · Nitrogen pressure test",
      tip: "Dry nitrogen only. Soap the new joints. A drop on the gauge is a leak.",
      detail: "Do not use shop air or oxygen. Hold the test. Fix the leak before anyone hooks a vacuum pump.",
      check: "Pressure holds",
      photo: "cc/08-nitrogen.jpg",
      action: "Test held",
      tools: [
        { id: "n2", name: "Nitrogen", img: "ms/tools/n2.jpg", correct: true },
        { id: "o2", name: "Oxygen", img: "recover/tank.jpg", why: "Oxygen stays on the truck. A pressure test with oxygen is a fail." },
        { id: "air", name: "Shop air", img: "recover/machine-tank.jpg", why: "Shop air stays on the truck. It is wet, and it is not a nitrogen test." },
      ],
    },
    {
      id: "vacuum",
      title: "9 · Evacuate",
      tip: "Micron gauge at the system, not at the pump. About 500 microns, then a decay hold.",
      detail: "A compound gauge at 0 is only 0 psig. That is not a vacuum. Cores out to pull. Cores in before you charge.",
      check: "Deep vacuum held",
      photo: "cc/09-vacuum.jpg",
      action: "Vacuum held",
      tools: [
        { id: "core", name: "Core remover", img: "recover/core.jpg", cores: true },
        { id: "micron", name: "Micron gauge", img: "ms/tools/micron.jpg", needsCores: true },
        { id: "meter", name: "Multimeter", img: "ms/tools/meter.jpg", why: "The multimeter stays on the truck. This step is microns, not ohms." },
        { id: "gauges", name: "Compound gauges", img: "parts/gauges.png", why: "Compound gauges stay on the truck. 0 in Hg is 0 psig, not 500 microns." },
      ],
    },
    {
      id: "weigh",
      title: "10 · Weigh in the nameplate",
      tip: "The scale is the charge. The factory ounces are on the data plate, plus lineset if the plate says so.",
      detail: "Liquid into the liquid line. Do not add gas until the superheat looks happy. A leak is not a top-off.",
      check: "Nameplate charge is in",
      photo: "cc/10-weigh.jpg",
      action: "Charge is weighed",
      tools: [
        { id: "corein", name: "Cores back in", img: "recover/core.jpg", coresIn: true },
        { id: "scale", name: "Scale", img: "cc/tool-scale.jpg", needsCoresIn: true, correct: true },
        { id: "gauges", name: "Gauges only", img: "parts/gauges.png", why: "Gauges stay on the truck for the weigh-in. The nameplate is ounces on a scale." },
        { id: "pump", name: "Vacuum pump", img: "ms/tools/pump.jpg", why: "The vacuum pump stays on the truck. The vacuum is already proved." },
      ],
    },
    {
      id: "run",
      title: "11 · Run and read the gauges",
      tip: "Superheat is suction temperature minus suction saturation. Subcooling is head saturation minus liquid temperature.",
      detail: "High superheat and low subcooling is still low on charge. High head with normal subcooling is a dirty condenser, not an overcharge. Oil and acid from the dead compressor do not belong in the new one.",
      check: "SH and SC are in band",
      photo: "cc/11-run.jpg",
      action: "Change-out is done",
      tools: [
        { id: "gauges", name: "Manifold", img: "parts/gauges.png", correct: true },
        { id: "thermo", name: "Thermometer only", img: "ms/tools/thermo.jpg", why: "A thermometer alone stays on the truck. Superheat needs pressure and temperature." },
        { id: "remote", name: "Remote", img: "ms/tools/remote.jpg", why: "The remote stays on the truck. You read the manifold." },
      ],
    },
  ];

  let root = null;
  let step = 0;
  let view = 0;
  let done = {};
  let toolHit = {};
  let toolMiss = {};
  let note = "";
  let n2Flow = false;
  let coresOut = false;
  let coresIn = false;
  let finished = false;
  let onDone = null;

  function paint() {
    const s = STEPS[view] || STEPS[0];
    const completed = Object.keys(done).length;
    const show = !!(done[s.id] || toolHit[s.id]);
    const canDo = view === step && !done[s.id] && !finished;
    root.innerHTML =
      '<div class="ms-layout">' +
      '<header class="ms-head">' +
      '<button type="button" class="btn" id="cc-hub">Shop floor</button>' +
      "<h2>Compressor change-out · " + (view + 1) + "/" + STEPS.length + "</h2>" +
      '<div class="ms-progress"><div class="ms-bar"><i style="width:' + Math.round((completed / STEPS.length) * 100) + '%"></i></div><span>' + completed + " done</span></div></header>" +
      '<div class="ms-body">' +
      '<aside class="ms-steps">' +
      STEPS.map(function (st, i) {
      const cls = done[st.id] ? "done" : i === step ? "active" : "";
        return '<button type="button" class="ms-step ' + cls + '" data-i="' + i + '"><span>' + (i + 1) + "</span><em>" + st.title.replace(/^\d+\s·\s/, "") + "</em></button>";
      }).join("") +
      "</aside>" +
      '<main class="ms-card">' +
      '<div class="ms-scene' + (show ? " shown" : " locked") + '">' +
      (show
        ? '<img class="ms-photo cc-photo" src="' + s.photo + '?v=1" alt="" />'
        : '<div class="ms-photo cc-wait">' + (s.id === "braze" && n2Flow ? "Nitrogen is flowing. The picture opens when the torch hits the joint." : "Pick the tool. The picture of this step stays shut.") + "</div>") +
      "</div>" +
      '<div class="ms-tools">' +
      s.tools.map(function (t) {
        const hit = toolHit[s.id] === t.id;
        const miss = toolMiss[s.id] && toolMiss[s.id][t.id];
        return '<button type="button" class="ms-tool' + (hit ? " good" : "") + (miss ? " bad" : "") + '" data-tool="' + t.id + '"><img src="' + t.img + '?v=1" alt="" /><span>' + t.name + "</span></button>";
      }).join("") +
      "</div>" +
      '<p class="ms-feedback' + (note ? (toolHit[s.id] ? " good" : " bad") : "") + '">' + (note || "") + "</p>" +
      "<h3>" + s.title + "</h3>" +
      '<p class="ms-tip">' + s.tip + "</p>" +
      '<p class="ms-check">Success: <strong>' + s.check + "</strong></p>" +
      '<div class="ms-actions">' +
      '<button type="button" class="btn primary" id="cc-do"' + (canDo ? "" : " disabled") + ">" + (done[s.id] ? "Done" : s.action) + "</button>" +
      '<button type="button" class="btn" id="cc-back"' + (view === 0 ? " disabled" : "") + ">Back</button>" +
      "</div>" +
      '<p class="ms-detail">' + s.detail + "</p>" +
      "</main>" +
      '<aside class="ms-ref"><p class="eyebrow">Change-out order</p><ul>' +
      "<li><strong>Recover</strong> before the torch</li>" +
      "<li><strong>Lock out</strong> before the meter</li>" +
      "<li><strong>New drier</strong> every time the loop is open</li>" +
      "<li><strong>Nitrogen</strong> while brazing, then a pressure test</li>" +
      "<li><strong>Microns</strong> at the system</li>" +
      "<li><strong>Weigh</strong> the nameplate. Do not charge by feel.</li>" +
      "</ul></aside></div></div>";

    const hub = root.querySelector("#cc-hub");
    if (hub) hub.onclick = function () { try { if (onDone) onDone(false); } catch (_) {} };
    const back = root.querySelector("#cc-back");
    if (back) back.onclick = function () {
      if (view > 0) { view--; note = ""; paint(); }
    };
    root.querySelectorAll(".ms-step").forEach(function (b) {
      b.onclick = function () {
        const i = +b.dataset.i;
        if (i > step) {
          view = step;
          note = "Do step " + (step + 1) + " first. That picture stays shut until the right tool.";
          paint();
          return;
        }
        view = i;
        note = i === step ? "" : "Back on step " + (step + 1) + " when you are done looking. The marker did not move.";
        paint();
      };
    });
    root.querySelectorAll(".ms-tool").forEach(function (b) {
      b.onclick = function () {
        if (view !== step || finished || done[s.id]) {
          view = step;
          note = "Do step " + (step + 1) + " first. The picture stays shut.";
          paint();
          return;
        }
        const t = s.tools.find(function (x) { return x.id === b.getAttribute("data-tool"); });
        if (!t) return;
        if (t.why) {
          toolMiss[s.id] = toolMiss[s.id] || {};
          toolMiss[s.id][t.id] = true;
          note = t.why;
          paint();
          return;
        }
        if (t.flow) {
          n2Flow = true;
          note = "Nitrogen is flowing, about 3 SCFH. The torch is next. Oxygen and shop air stay on the truck.";
          paint();
          return;
        }
        if (t.cores) {
          coresOut = true;
          note = "Schrader cores are out. The micron gauge can pull now. Put the cores back in before you charge.";
          paint();
          return;
        }
        if (t.coresIn) {
          coresIn = true;
          note = "Cores are back in. Weigh the nameplate on the scale. An open core dumps the new charge.";
          paint();
          return;
        }
        if (t.needsN2 && !n2Flow) {
          toolMiss[s.id] = toolMiss[s.id] || {};
          toolMiss[s.id][t.id] = true;
          note = "The torch stays on the truck until nitrogen is flowing. Brazing on oxygen or shop air is a fail.";
          paint();
          return;
        }
        if (t.needsCores && !coresOut) {
          toolMiss[s.id] = toolMiss[s.id] || {};
          toolMiss[s.id][t.id] = true;
          note = "Pull the Schrader cores before the deep vacuum. A core left in the port is not a 500-micron pull.";
          paint();
          return;
        }
        if (t.needsCoresIn && !coresIn) {
          toolMiss[s.id] = toolMiss[s.id] || {};
          toolMiss[s.id][t.id] = true;
          note = "Put the Schrader cores back in before you charge. Leaving them out dumps the new charge.";
          paint();
          return;
        }
        if (t.correct || t.needsN2 || t.needsCores) {
          toolHit[s.id] = t.id;
          note = t.name + " did the job. That picture is the result.";
          done[s.id] = true;
          paint();
          if (step >= STEPS.length - 1) {
            finished = true;
            if (onDone) onDone(true);
            return;
          }
          setTimeout(function () {
            step++;
            view = step;
            n2Flow = false;
            note = "";
            paint();
          }, 500);
          return;
        }
        toolMiss[s.id] = toolMiss[s.id] || {};
        toolMiss[s.id][t.id] = true;
        note = t.name + " stays on the truck.";
        paint();
      };
    });
    const go = root.querySelector("#cc-do");
    if (go) go.onclick = function () {
      if (view !== step) {
        view = step;
        note = "";
        paint();
        return;
      }
      if (!toolHit[s.id]) {
        note = "Click the tool that does this step. The picture and the marker stay put.";
        paint();
      }
    };
    const fbEl = root.querySelector(".ms-feedback");
    if (fbEl && note) {
      try { fbEl.scrollIntoView({ block: "nearest" }); } catch (_) {}
    }
  }

  function start(host, opts) {
    root = host;
    step = 0;
    view = 0;
    done = {};
    toolHit = {};
    toolMiss = {};
    note = "";
    n2Flow = false;
    coresOut = false;
    coresIn = false;
    finished = false;
    onDone = opts && opts.onDone;
    if (!root) return { stop: function () {} };
    root.style.position = "absolute";
    root.style.inset = "0";
    root.style.overflow = "auto";
    root.style.webkitOverflowScrolling = "touch";
    try {
      paint();
    } catch (err) {
      root.innerHTML = '<div class="ms-layout"><p>Compressor change-out hit a snag.</p><button type="button" class="btn" id="cc-hub">Shop floor</button></div>';
      const b = root.querySelector("#cc-hub");
      if (b) b.onclick = function () { try { if (onDone) onDone(false); } catch (_) {} };
    }
    return { stop: function () { root = null; } };
  }

  global.CompressorChange = { start: start, STEPS: STEPS };
})(window);
