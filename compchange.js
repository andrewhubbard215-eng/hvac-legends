/* Compressor change-out — same tool grid as the mini-split lab.
   The picture of the part stays up until the next step is picked. */
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
  let score = 0;
  let combo = 0;
  let skipClick = false;
  let tone = "";

  function setNote(text, kind) {
    note = text || "";
    tone = kind || "";
  }

  function toolNeeded(i) {
    const s = STEPS[i];
    if (!s) return null;
    if (s.id === "braze") {
      if (i === step && n2Flow && !done[s.id]) return s.tools.filter(function (t) { return t.needsN2; })[0];
      return s.tools.filter(function (t) { return t.flow; })[0];
    }
    if (s.id === "vacuum") {
      if (i === step && coresOut && !done[s.id]) return s.tools.filter(function (t) { return t.needsCores; })[0];
      return s.tools.filter(function (t) { return t.cores; })[0];
    }
    if (s.id === "weigh") {
      if (i === step && coresIn && !done[s.id]) return s.tools.filter(function (t) { return t.correct; })[0];
      return s.tools.filter(function (t) { return t.coresIn; })[0];
    }
    return s.tools.filter(function (t) { return t.correct; })[0] || s.tools[0];
  }

  function nextRequired() {
    if (finished) return null;
    for (let i = step; i < STEPS.length; i++) {
      if (done[STEPS[i].id]) continue;
      return toolNeeded(i);
    }
    return null;
  }

  function laterHint() {
    const s = STEPS[step];
    if (!s || done[s.id]) return "Hit Next.";
    if (s.id === "recover") return "Recover the charge before you cut.";
    if (s.id === "lock") return "Lock out before your hands are in the cabinet.";
    if (s.id === "meter") return "Meter the new compressor before you cut the stubs.";
    if (s.id === "cut") return "Cut the stubs before the new scroll goes in.";
    if (s.id === "set") return "Set the scroll before you braze.";
    if (s.id === "braze") return n2Flow ? "Nitrogen is flowing. Put the torch on the joint." : "Nitrogen before you braze.";
    if (s.id === "drier") return "New drier before the pressure test.";
    if (s.id === "nitrogen") return "Hold the nitrogen test before the vacuum.";
    if (s.id === "vacuum") return coresOut ? "Put the micron gauge on the system." : "Pull the cores before the vacuum.";
    if (s.id === "weigh") return coresIn ? "Weigh the nameplate on the scale." : "Cores back in before you weigh the charge.";
    if (s.id === "run") return "Read the manifold. Superheat needs pressure and temperature.";
    return "Do step " + (step + 1) + " first.";
  }

  function earlyPop() {
    const s = STEPS[step];
    if (!s) return "Not yet";
    if (s.id === "recover") return "Recover first";
    if (s.id === "lock") return "Lockout first";
    if (s.id === "meter") return "Meter first";
    if (s.id === "cut") return "Cut first";
    if (s.id === "set") return "Set it first";
    if (s.id === "braze") return n2Flow ? "Torch next" : "No nitrogen";
    if (s.id === "drier") return "Drier first";
    if (s.id === "nitrogen") return "Pressure test";
    if (s.id === "vacuum") return coresOut ? "Microns" : "Cores first";
    if (s.id === "weigh") return coresIn ? "Weigh in" : "Cores first";
    return "Not yet";
  }

  function missPopText(tool) {
    if (!tool) return "Wrong tool";
    if (tool.needsN2 && !n2Flow) return "No nitrogen";
    if (tool.needsCores && !coresOut) return "Cores first";
    if (tool.needsCoresIn && !coresIn) return "Cores first";
    if (tool.id === "o2" || tool.id === "air") return "Wrong gas";
    if (tool.why) {
      const bit = tool.why.split(". ")[0].replace(/\.$/, "");
      if (bit.length <= 42) return bit;
      return bit.slice(0, 42).replace(/\s+\S*$/, "");
    }
    return "Not yet";
  }

  function playTool(ok, tool, label) {
    if (!window.PlayFeel || !root) return;
    const el = (tool && root.querySelector('.ms-tool[data-tool="' + tool.id + '"]')) || root.querySelector(".cc-drop") || root;
    if (ok && tool) {
      window.PlayFeel.bump(el);
      window.PlayFeel.pop(el, tool.name, "ok");
    } else {
      window.PlayFeel.deny(el);
      window.PlayFeel.pop(el, label || "Wrong tool", "bad");
    }
  }

  function coachNext() {
    if (!window.PlayFeel || !root) return;
    if (finished) {
      window.PlayFeel.coach(document.body, "Change-out is done.");
      return;
    }
    if (tone === "bad" && note) {
      window.PlayFeel.coach(document.body, note);
      return;
    }
    const live = STEPS[step];
    if (live && done[live.id]) {
      window.PlayFeel.coach(document.body, step >= STEPS.length - 1 ? "Hit Finish." : "Hit Next.");
      return;
    }
    const t = nextRequired();
    if (t) window.PlayFeel.coach(document.body, "Drag " + t.name + " onto the unit.");
  }

  function storyBoard() {
    const last = Math.max(0, Math.min(view, STEPS.length - 1));
    let built = "";
    for (let i = 0; i < last; i++) {
      const prev = STEPS[i];
      const name = prev.title.replace(/^\d+\s·\s/, "");
      built += '<figure class="done"><img class="ms-photo" src="' + prev.photo + '?v=2" alt="" /><figcaption>' + (i + 1) + " · " + name + "</figcaption></figure>";
    }
    const st = STEPS[last];
    const name = st.title.replace(/^\d+\s·\s/, "");
    const mark = done[st.id] ? " · in place" : " · drop the tool";
    const hitId = toolHit[st.id];
    const hitTool = hitId && st.tools.filter(function (t) { return t.id === hitId; })[0];
    const need = !done[st.id] && last === step ? toolNeeded(last) : null;
    const badge = hitTool
      ? '<img class="cc-landed" src="' + hitTool.img + '?v=1" alt="" /><b class="cc-landed-name">' + hitTool.name + " landed</b>"
      : '<b class="cc-target">' + (need ? "Drop " + need.name + " here" : "Drop the tool here") + "</b>";
    return (
      '<div class="ms-story">' +
      (built ? '<div class="ms-built"><p class="ms-chapter">Already on the unit</p>' + built + "</div>" : "") +
      '<figure class="now cc-drop' + (done[st.id] ? " done" : "") + '" data-slot="unit"><img class="ms-photo cc-photo" src="' + st.photo + '?v=2" alt="" />' +
      badge +
      "<figcaption>" + (last + 1) + " · " + name + mark + "</figcaption></figure></div>"
    );
  }

  function useTool(t) {
    const s = STEPS[view] || STEPS[0];
    if (!t) return;
    if (view !== step || finished || done[s.id]) {
      const ahead = view > step && !finished;
      const onDoneStep = view === step && done[s.id] && !finished;
      view = step;
      if (finished) setNote("The change-out is already finished.", "");
      else if (onDoneStep) setNote("That step is in. Hit Next.", "ok");
      else setNote(laterHint(), "bad");
      paint();
      if (onDoneStep) {
        if (window.PlayFeel && root) {
          const el = root.querySelector("#cc-do") || root;
          window.PlayFeel.pop(el, "Next", "ok");
        }
        return;
      }
      playTool(false, t, ahead ? earlyPop() : "Wrong tool");
      return;
    }
    if (t.why) {
      toolMiss[s.id] = toolMiss[s.id] || {};
      toolMiss[s.id][t.id] = true;
      combo = 0;
      setNote(t.why, "bad");
      if (window.LtHaptic) window.LtHaptic.bad();
      paint();
      playTool(false, t, missPopText(t));
      return;
    }
    if (t.flow) {
      n2Flow = true;
      setNote("Nitrogen is flowing, about 3 SCFH. Drag the torch onto the joint.", "ok");
      if (window.LtHaptic) window.LtHaptic.tick();
      paint();
      playTool(true, t);
      return;
    }
    if (t.cores) {
      coresOut = true;
      setNote("Schrader cores are out. Drag the micron gauge on.", "ok");
      if (window.LtHaptic) window.LtHaptic.tick();
      paint();
      playTool(true, t);
      return;
    }
    if (t.coresIn) {
      coresIn = true;
      setNote("Cores are back in. Drag the scale on and weigh the nameplate.", "ok");
      if (window.LtHaptic) window.LtHaptic.tick();
      paint();
      playTool(true, t);
      return;
    }
    if (t.needsN2 && !n2Flow) {
      toolMiss[s.id] = toolMiss[s.id] || {};
      toolMiss[s.id][t.id] = true;
      combo = 0;
      setNote("No nitrogen. The torch stays off the joint until nitrogen is flowing.", "bad");
      if (window.LtHaptic) window.LtHaptic.bad();
      paint();
      playTool(false, t, "No nitrogen");
      return;
    }
    if (t.needsCores && !coresOut) {
      toolMiss[s.id] = toolMiss[s.id] || {};
      toolMiss[s.id][t.id] = true;
      combo = 0;
      setNote("Pull the Schrader cores before the deep vacuum.", "bad");
      if (window.LtHaptic) window.LtHaptic.bad();
      paint();
      playTool(false, t, "Cores first");
      return;
    }
    if (t.needsCoresIn && !coresIn) {
      toolMiss[s.id] = toolMiss[s.id] || {};
      toolMiss[s.id][t.id] = true;
      combo = 0;
      setNote("Put the Schrader cores back in before you charge.", "bad");
      if (window.LtHaptic) window.LtHaptic.bad();
      paint();
      playTool(false, t, "Cores first");
      return;
    }
    if (t.correct || t.needsN2 || t.needsCores) {
      const clean = !(toolMiss[s.id] && Object.keys(toolMiss[s.id]).length);
      combo = clean ? combo + 1 : 0;
      score += clean ? 100 + (combo - 1) * 25 : 40;
      toolHit[s.id] = t.id;
      setNote(t.name + " landed. +" + (clean ? 100 + (combo - 1) * 25 : 40) + ". Hit Next.", "ok");
      done[s.id] = true;
      if (window.LtHaptic) window.LtHaptic.land();
      paint();
      playTool(true, t);
      return;
    }
    toolMiss[s.id] = toolMiss[s.id] || {};
    toolMiss[s.id][t.id] = true;
    combo = 0;
    setNote(t.name + " stays on the truck.", "bad");
    if (window.LtHaptic) window.LtHaptic.bad();
    paint();
    playTool(false, t, "Wrong tool");
  }

  function paint() {
    const s = STEPS[view] || STEPS[0];
    const completed = Object.keys(done).length;
    const canDo = view === step && !finished;
    root.innerHTML =
      '<div class="ms-layout">' +
      '<header class="ms-head">' +
      '<button type="button" class="btn" id="cc-hub">Shop floor</button>' +
      "<h2>Compressor change-out · " + (view + 1) + "/" + STEPS.length + "</h2>" +
      '<div class="ms-progress"><div class="ms-bar"><i style="width:' + Math.round((completed / STEPS.length) * 100) + '%"></i></div><span>' + score + " pts · combo x" + combo + "</span></div></header>" +
      '<div class="ms-body">' +
      '<aside class="ms-steps">' +
      STEPS.map(function (st, i) {
      const cls = done[st.id] ? "done" : i === step ? "active" : "";
        return '<button type="button" class="ms-step ' + cls + '" data-i="' + i + '"><span>' + (i + 1) + "</span><em>" + st.title.replace(/^\d+\s·\s/, "") + "</em></button>";
      }).join("") +
      "</aside>" +
      '<main class="ms-card">' +
      '<div class="ms-scene shown">' + storyBoard() + "</div>" +
      '<div class="ms-tools"><p class="eyebrow">Drag the highlighted tool onto the unit</p>' +
      s.tools.map(function (t) {
        const hit = toolHit[s.id] === t.id;
        const miss = toolMiss[s.id] && toolMiss[s.id][t.id];
        const need = canDo && !done[s.id] ? toolNeeded(step) : null;
        const next = !!(need && need.id === t.id && !hit);
        return '<button type="button" class="ms-tool' + (hit ? " good" : "") + (miss ? " bad" : "") + (next ? " is-next" : "") + '" data-tool="' + t.id + '"><img src="' + t.img + '?v=1" alt="" /><span>' + t.name + "</span></button>";
      }).join("") +
      "</div>" +
      '<p class="ms-feedback' + (tone === "ok" ? " good" : tone === "bad" ? " bad" : "") + '">' + (note || "") + "</p>" +
      "<h3>" + s.title + "</h3>" +
      '<p class="ms-tip">' + s.tip + "</p>" +
      '<p class="ms-check">Success: <strong>' + s.check + "</strong></p>" +
      '<div class="ms-actions">' +
      '<button type="button" class="btn' + (done[s.id] ? " primary" : "") + '" id="cc-do"' + (canDo ? "" : " disabled") + ">" + (done[s.id] ? (view >= STEPS.length - 1 ? "Finish" : "Next step") : "Next step") + "</button>" +
      '<button type="button" class="btn" id="cc-back"' + (view === 0 ? " disabled" : "") + ">Back</button>" +
      "</div>" +
      '<p class="ms-detail">' + s.detail + "</p>" +
      "</main>" +
      "<style>" +
      "#compchange-root .cc-drop{position:relative}" +
      "#compchange-root .cc-target{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);background:rgba(12,16,20,.78);color:#e8c450;border:2px dashed #e8c450;border-radius:12px;padding:10px 14px;pointer-events:none}" +
      "#compchange-root .cc-landed{position:absolute;right:10px;bottom:36px;width:72px;height:72px;object-fit:contain;background:#10161c;border-radius:10px;border:2px solid #7fd99a}" +
      "#compchange-root .cc-landed-name{position:absolute;left:10px;bottom:36px;background:#14301c;color:#7fd99a;border-radius:8px;padding:4px 8px;font-size:12px}" +
      "#compchange-root .ms-tool{cursor:grab;touch-action:none}" +
      "#compchange-root .ms-story > figure.now .ms-photo,#compchange-root img.cc-photo{width:100%;height:auto;max-height:min(42vh,360px);object-fit:contain;background:#10141a;display:block}" +
      "#compchange-root .ms-built .ms-photo{width:108px;height:76px;max-height:76px;object-fit:contain}" +
      "#compchange-root .ms-tool img{width:100%;height:88px;object-fit:contain;background:#10141a}" +
      "#compchange-root .ms-tool.is-next{outline:2px solid #e8c450;outline-offset:2px}" +
      "#compchange-root .ms-tools .eyebrow{width:100%;margin:0 0 6px}" +
      "</style>" +
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
      if (view > 0) { view--; setNote("", ""); paint(); }
    };
    root.querySelectorAll(".ms-step").forEach(function (b) {
      b.onclick = function () {
        const i = +b.dataset.i;
        if (i > step) {
          if (i === step + 1 && done[STEPS[step].id]) {
            step = i;
            view = i;
            setNote("", "");
            paint();
            return;
          }
          if (window.PlayFeel) {
            window.PlayFeel.deny(b);
            window.PlayFeel.pop(b, earlyPop(), "bad");
          }
          view = step;
          setNote(laterHint(), "bad");
          paint();
          return;
        }
        view = i;
        setNote(i === step ? "" : "Back on step " + (step + 1) + " when you are done looking.", "");
        paint();
      };
    });
    root.querySelectorAll(".ms-tool").forEach(function (b) {
      b.onclick = function () {
        if (skipClick) {
          skipClick = false;
          return;
        }
        const t = s.tools.find(function (x) { return x.id === b.getAttribute("data-tool"); });
        useTool(t);
      };
      if (window.LtDrag && window.LtDrag.bindSource) {
        window.LtDrag.bindSource(b, {
          id: b.getAttribute("data-tool"),
          allowButtons: true,
          dropSelector: ".cc-drop",
          ghostClass: "cc-ghost",
          html: "<b>" + (b.querySelector("span") ? b.querySelector("span").textContent : "TOOL") + "</b>",
          onDrop: function (_slot, id) {
            skipClick = true;
            const t = s.tools.find(function (x) { return x.id === id; });
            useTool(t);
            setTimeout(function () { skipClick = false; }, 0);
          },
        });
      }
    });
    const go = root.querySelector("#cc-do");
    if (go) go.onclick = function () {
      if (view !== step) {
        view = step;
        setNote("", "");
        paint();
        return;
      }
      if (!done[s.id]) {
        const need = toolNeeded(step);
        setNote(need ? "Drag " + need.name + " onto the unit." : "Drag the tool onto the unit.", "bad");
        paint();
        playTool(false, null, "Drop it");
        return;
      }
      if (step >= STEPS.length - 1) {
        finished = true;
        if (onDone) onDone(true);
        return;
      }
      step += 1;
      view = step;
      n2Flow = false;
      setNote("", "");
      paint();
    };
    const fbEl = root.querySelector(".ms-feedback");
    if (fbEl && note) {
      try { fbEl.scrollIntoView({ block: "nearest" }); } catch (_) {}
    }
    coachNext();
  }

  function ensurePhone() {
    if (document.getElementById("cc-phone-fit")) return;
    const st = document.createElement("style");
    st.id = "cc-phone-fit";
    st.textContent = [
      "@media (max-width:720px){",
      "#screen-compchange.screen.active{overflow-x:hidden!important;overflow-y:auto!important;height:100dvh!important;max-height:100dvh!important}",
      "#compchange-root{position:relative!important;inset:auto!important;height:auto!important;max-height:none!important;overflow:visible!important}",
      "#compchange-root .ms-layout{padding:8px 8px 12px!important}",
      "#compchange-root .ms-head{margin:0 0 6px!important;align-items:center}",
      "#compchange-root .ms-head h2{font-size:16px;margin:0}",
      "#compchange-root .ms-body{display:block!important}",
      "#compchange-root .ms-steps{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;max-height:none!important;gap:6px}",
      "#compchange-root .ms-step{flex:0 0 auto!important;min-width:44px!important;min-height:40px!important;padding:6px 8px!important}",
      "#compchange-root .ms-step em{display:none!important}",
      "#compchange-root .ms-card{padding:8px!important}",
      "#compchange-root .ms-card h3,#compchange-root .ms-detail,#compchange-root .ms-check,#compchange-root .ms-ref{display:none!important}",
      "#compchange-root .ms-tip{margin:4px 0!important;font-size:13px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
      "#compchange-root .ms-story>figure.now .ms-photo,#compchange-root img.cc-photo{display:block!important;width:100%!important;height:auto!important;min-height:120px!important;max-height:28vh!important;object-fit:contain!important}",
      "#compchange-root .ms-tools{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}",
      "#compchange-root .ms-tools .eyebrow{grid-column:1 / -1;width:auto!important;margin:0 0 4px!important}",
      "#compchange-root .ms-tool{min-width:0!important;min-height:64px}",
      "#compchange-root .ms-tool img{height:64px!important;width:100%!important}",
      "#compchange-root .ms-actions{display:flex!important;gap:8px;position:relative;z-index:3}",
      "#compchange-root .ms-actions .btn{min-height:48px;flex:1 1 40%}",
      "body:has(#screen-compchange.active) #pf-coach-bar,body:has(#screen-compchange.active) .pf-coach{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important;width:min(180px,46vw)!important;max-height:52px!important;overflow:hidden!important}",
      "body:has(#screen-compchange.active) #drip-ear{top:8px!important;bottom:auto!important;left:auto!important;right:8px!important;width:min(140px,38vw)!important;max-height:40px!important}",
      "body:has(#screen-compchange.active) .ld-replay{top:auto!important;bottom:8px!important;right:8px!important;left:auto!important;max-width:124px!important}",
      "}",
    ].join("");
    document.head.appendChild(st);
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
    score = 0;
    combo = 0;
    skipClick = false;
    tone = "";
    onDone = opts && opts.onDone;
    ensurePhone();
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
