/* Brazing lab — torch in your hand. Neutral flame, both sides of the cup, cutaway oxide. */
(function (global) {
  "use strict";

  const ALLOYS = [
    { id: "sf15", name: "Sil-Fos 15 (BCuP-5)", ok: true, note: "Cu→Cu. Phosphorus is the flux. No extra flux." },
    { id: "sf5", name: "Sil-Fos 5", ok: true, note: "Cu→Cu. Tighter cup." },
    { id: "ag45", name: "Stay-Silv 45", ok: false, note: "Cu→brass / steel. Needs flux. Wrong on a copper sweat." },
    { id: "stay", name: "Stay-Brite / soft solder", ok: false, note: "Water line. Not 410A." },
  ];

  const JOBS = [
    { id: "valve", name: "Service valve", cores: true, rag: true, tag: "VALVE", say: "Packing melts before copper cherries. Rag the body." },
    { id: "drier", name: "Filter-drier", cores: false, rag: true, tag: "DRIER", say: "Don't cook the drier. Rag the can. Heat the stubs." },
    { id: "coupling", name: "Sweat coupling", cores: false, rag: false, tag: "CPLG", say: "Both cups. Walk the flame. No valve to hide behind." },
  ];

  const GUIDE = [
    { id: "cores", title: "Pull the cores", say: "Tap the schrader. Cores out or you cook the seat and N₂ never flows." },
    { id: "rag", title: "Wet rag the body", say: "Drag the rag onto the valve / drier. Packing and paint burn first." },
    { id: "n2", title: "Whisper of N₂", say: "Tap the port, set 2–5 SCFH. Puff on the back of your hand — not 200 psig." },
    { id: "sand", title: "Clean the cup", say: "Tap the fitting. Oil and oxide kill wetting. Sand, don't smear flux on Sil-Fos." },
    { id: "alloy", title: "Pick the rod", say: "Sil-Fos 15 on copper-to-copper. 45% is brass + flux. Stay-Brite is condensate." },
    { id: "mix", title: "Neutral flame", say: "Inner cone sharp, no feathers, no hissing extra O₂. Carburizing soots. Oxidizing burns copper." },
    { id: "heat", title: "Both sides of the cup", say: "Drag the inner cone around the copper — left AND right. One-side heat = a blob, not a fillet." },
    { id: "feed", title: "Feed when cherry", say: "Touch the rod to the joint. The PIPE melts the rod. Don't drip it." },
    { id: "cool", title: "N₂ till it's dark", say: "Torch off. Nitrogen stays. Then soap the joint, then microns." },
  ];

  function BrazingLab(host, opts) {
    host.style.position = "absolute";
    host.style.inset = "0";
    host.style.overflow = "auto";
    host.style.webkitOverflowScrolling = "touch";
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let job = JOBS[0];
    let cores = false;
    let rag = false;
    let sanded = false;
    let n2on = false;
    let n2 = 0;
    let purge = "off";
    let glob = false;
    let mix = 50;
    let alloy = "sf15";
    let torch = false;
    let feeding = false;
    let heatL = 0;
    let heatR = 0;
    let fillet = 0;
    let oxide = 0;
    let cooked = 0;
    let burned = 0;
    let blown = false;
    let badGas = "";
    let cooled = false;
    let verdict = null;
    let flame = { x: 86, y: 108 };
    let rod = { x: 200, y: 40 };
    let holding = null;
    let gi = 0;
    let msg = "Pick the joint. Then tap the schrader if it's a valve.";
    let hub = "Pretty outside, sandpaper inside — that's a braze with no nitrogen.";
    let timer = 0;
    let mounted = false;

    function alloyObj() {
      return ALLOYS.filter(function (a) { return a.id === alloy; })[0];
    }
    function heat() {
      return (heatL + heatR) / 2;
    }
    function n2ok() {
      return purge === "n2" && n2on && n2 >= 2 && n2 <= 5;
    }
    function mixKind() {
      if (mix < 38) return "carb";
      if (mix > 64) return "ox";
      return "neutral";
    }
    function dist(a, x, y) {
      return Math.hypot(a.x - x, a.y - y);
    }
    function stepId() {
      return (GUIDE[gi] || GUIDE[GUIDE.length - 1]).id;
    }
    function skipJobSteps() {
      if (!job.cores && gi === 0) gi = 1;
      if (!job.rag && gi === 1) gi = 2;
    }
    function maybeGuide() {
      skipJobSteps();
      const s = stepId();
      if (s === "cores" && (cores || !job.cores)) gi = 1;
      if (stepId() === "rag" && (rag || !job.rag)) gi = 2;
      if (stepId() === "n2" && n2ok()) gi = 3;
      if (stepId() === "sand" && sanded) gi = 4;
      if (stepId() === "alloy" && alloyObj().ok) gi = 5;
      if (stepId() === "mix" && mixKind() === "neutral") gi = 6;
      if (stepId() === "heat" && heatL >= 70 && heatR >= 70) gi = 7;
      if (stepId() === "feed" && fillet >= 90) gi = 8;
    }

    function copperColor(h) {
      const cherry = Math.max(0, (h - 40) / 60);
      const r = Math.round(201 + cherry * 54);
      const g = Math.round(162 - cherry * 90);
      const b = Math.round(39 - cherry * 25);
      return "rgb(" + r + "," + g + "," + b + ")";
    }

    function tick() {
      if (verdict) return;
      const dt = 0.08;
      const onL = torch && dist(flame, 80, 100) < 36;
      const onR = torch && dist(flame, 190, 100) < 34;
      const onCup = torch && dist(flame, 144, 100) < 28;
      const onBody = torch && dist(flame, 240, 100) < 34;
      const mk = mixKind();
      const heatRate = mk === "neutral" ? 9 : mk === "ox" ? 12 : 5;
      if (torch) {
        if (onL || onCup) heatL = Math.min(100, heatL + heatRate * dt * 10);
        if (onR || onCup) heatR = Math.min(100, heatR + heatRate * dt * 10);
        if (!onL && !onR && !onCup) {
          heatL = Math.min(100, heatL + 1.2 * dt * 10);
          heatR = Math.min(100, heatR + 1.2 * dt * 10);
        }
        if (heatL > 92 && heatR > 92) burned = Math.min(100, burned + 10 * dt);
        if (purge === "o2" || purge === "air") badGas = purge;
        if (!n2ok() || mk === "ox") oxide = Math.min(100, oxide + (mk === "ox" ? 22 : 16) * dt);
        if (job.rag && (!rag || onBody)) cooked = Math.min(100, cooked + (onBody ? 24 : 7) * dt);
        if (n2 > 12) blown = true;
        if (mk === "carb") oxide = Math.min(100, oxide + 6 * dt);
      } else {
        heatL = Math.max(0, heatL - 16 * dt * 10);
        heatR = Math.max(0, heatR - 16 * dt * 10);
        if (fillet >= 96 && heat() < 28 && n2ok() && !glob && !blown && oxide < 32 && cooked < 40 && burned < 40 && alloyObj().ok && sanded && mk === "neutral") {
          cooled = true;
        } else if (!n2ok() && fillet > 40) {
          oxide = Math.min(100, oxide + 10 * dt);
        }
      }
      if (feeding && torch) {
        const onJoint = dist(rod, 144, 100) < 28;
        if (heat() < 68 || heatL < 55 || heatR < 55) {
          glob = true;
          msg = heatL < 55 && heatR >= 70
            ? "Right side's cherry. Left side is a cold joint. That glob does not pass."
            : heatR < 55 && heatL >= 70
              ? "Left's hot. Right is a cold joint. A glob does not pass."
              : "Cold joint. The rod globbed. A glob does not pass.";
          hub = "Both sides of the cup have to be cherry before the rod. Recut this one.";
        } else if (!alloyObj().ok) {
          glob = true;
          msg = alloy === "stay"
            ? "Stay-Brite is solder. Refrigerant copper is brazed, not soldered. That does not pass."
            : "That rod is not the braze for this copper. It does not pass.";
          hub = "Sil-Fos on copper-to-copper. Solder stays on the water line.";
        } else if (purge === "o2" || purge === "air") {
          msg = purge === "o2"
            ? "Oxygen in the tube. That braze is a fail."
            : "Shop air in the tube. That braze is a fail.";
          hub = "Nitrogen flows while you braze. Oxygen and shop air do not.";
        } else if (!sanded) {
          msg = "Oil on the cup. It beads. Sand it.";
          hub = "Sil-Fos doesn't hide dirt.";
        } else if (mk !== "neutral") {
          msg = mk === "ox" ? "Oxidizing flame is burning the copper. Back off the O₂." : "Feathers on the flame. More O₂ — you want a sharp inner cone.";
        } else if (blown) {
          fillet = Math.max(0, fillet - 30 * dt);
          msg = "Nitrogen is too hard. Flow, don't blast the fillet out.";
        } else if (onJoint && alloyObj().ok && !glob) {
          const walk = Math.min(heatL, heatR) / 100;
          fillet = Math.min(100, fillet + 20 * dt * 10 * walk);
          msg = fillet > 70 ? "It's walking around. Don't pile a kiss." : "It's sucking in. Keep the cone on the copper.";
          hub = "Capillary pulls 15% into the cup.";
        } else if (!onJoint) {
          msg = "Rod isn't on the joint. Touch the cherry cup.";
        }
      } else if (heatL >= 70 && heatR >= 70 && torch && !feeding) {
        msg = "Both sides cherry. Touch the rod to the joint.";
        hub = "The pipe melts the rod. You don't melt the rod and drip it.";
      }
      if (badGas && !verdict) {
        msg = badGas === "air"
          ? "Shop air was on this joint with the torch lit. That braze stays a fail."
          : "Oxygen was on that joint with the torch lit. That braze stays a fail.";
        hub = "Switching the hose does not save it. Nitrogen has to be flowing the whole time.";
      }
      maybeGuide();
      if (cooled && fillet >= 96) finish(true);
      updateSvg();
    }

    function finish(ok) {
      if (verdict) return;
      torch = false;
      feeding = false;
      holding = null;
      if (!ok) {
        verdict = "fail";
        if (window.LtHaptic) window.LtHaptic.bad();
        paintChrome();
        return;
      }
      if (purge === "o2" || purge === "air" || badGas) {
        verdict = "fail";
        const which = purge === "air" || badGas === "air" ? "air" : "o2";
        msg = which === "air"
          ? "Shop air is a fail. It is wet, and it is not nitrogen."
          : "Oxygen in the tube is a fail. Refrigerant copper is brazed with nitrogen flowing.";
        hub = "Nitrogen flows while the torch is on the joint. Oxygen and shop air stay on the truck. That choice stays a fail.";
      } else if (!alloyObj().ok) {
        verdict = "fail";
        msg = alloy === "stay"
          ? "You soldered a refrigerant line. Refrigerant copper is brazed, not soldered."
          : "45% on copper-to-copper is not this joint. Sil-Fos next time.";
        hub = "BCuP on Cu to Cu. Stay-Brite is a water line.";
      } else if (glob) {
        verdict = "fail";
        msg = "Cold joint. The rod globbed. A glob does not pass.";
        hub = "Both sides cherry, then the rod. The pipe melts the rod.";
      } else if (!n2ok()) {
        verdict = "fail";
        msg = "Nitrogen was not flowing while you brazed. That joint does not pass.";
        hub = "2–5 SCFH of nitrogen. Not oxygen. Not shop air.";
      } else if (job.cores && !cores) {
        verdict = "fail";
        msg = "Cores were in. You cooked a schrader and the N₂ never flowed.";
        hub = "Cores out before the torch. Always.";
      } else if (job.rag && !rag) {
        verdict = "fail";
        msg = "No rag. Packing / drier paint is cooked.";
        hub = "Wet rag on the body. Not on the joint.";
      } else if (!sanded) {
        verdict = "fail";
        msg = "Dirty cup. Pretty fillet over oil is a leaker.";
        hub = "Sand bright. No fingerprints.";
      } else if (!alloyObj().ok) {
        verdict = "fail";
        msg = alloy === "stay"
          ? "You soldered a refrigerant line. That's a callback and a 608 lecture."
          : "45% on copper-to-copper. You needed flux and you didn't. Sil-Fos next time.";
        hub = "BCuP on Cu→Cu. 45% is brass. Stay-Brite is condensate.";
      } else if (mixKind() !== "neutral") {
        verdict = "fail";
        msg = mixKind() === "ox" ? "Oxidizing flame. Copper is burned. Neutral cone next time." : "Carburizing flame sooted the cup. Sharpen the inner cone.";
        hub = "Inner cone: sharp, no feathers, no hiss.";
      } else if (oxide >= 32) {
        verdict = "fail";
        msg = "Look at the cutaway — black scale inside. TXV candy. 2–5 SCFH.";
        hub = "Pretty outside, sandpaper inside.";
      } else if (cooked >= 40) {
        verdict = "fail";
        msg = "You parked the flame on the body. Rag wasn't enough.";
        hub = "Heat the stubs. Hide the can with a rag.";
      } else if (burned >= 40) {
        verdict = "fail";
        msg = "Fitting is burned / over-annealed. Walk the heat. Don't soak it.";
        hub = "Cherry, feed, get out.";
      } else if (heatL < 60 || heatR < 60) {
        verdict = "fail";
        msg = "One-sided heat. Fillet didn't walk. Both sides of the cup.";
        hub = "Left AND right. That's the whole joint.";
      } else if (blown || fillet < 90) {
        verdict = "fail";
        msg = blown ? "N₂ too hard — blew the fillet out. Flow, don't pressurize." : "Fillet never filled.";
        hub = "2–5 SCFH. Not 200 psig.";
      } else {
        verdict = "pass";
        msg = "Fillet walked. Cutaway is clean. N₂ stayed till dark. That's a braze.";
        hub = "Soap it. Then microns. Don't charge a pretty leak.";
        if (onXp) onXp(32);
        if (window.CurriculumTrain) window.CurriculumTrain.stamp("braze");
        if (window.LtHaptic) window.LtHaptic.land();
      }
      if (verdict === "fail" && window.LtHaptic) window.LtHaptic.bad();
      paintChrome();
    }

    function svgPt(ev) {
      const svg = host.querySelector(".bz-vis");
      if (!svg) return { x: 0, y: 0 };
      const r = svg.getBoundingClientRect();
      return {
        x: ((ev.clientX - r.left) / Math.max(1, r.width)) * 280,
        y: ((ev.clientY - r.top) / Math.max(1, r.height)) * 200,
      };
    }

    function hitAt(p) {
      if (job.cores && dist(p, 248, 48) < 22) return "core";
      if (job.rag && dist(p, 240, 100) < 28) return "valve";
      if (dist(p, 36, 128) < 22) return "n2";
      if (dist(p, 144, 100) < 26) return "cup";
      if (p.x > 20 && p.x < 230 && p.y > 78 && p.y < 122) return "pipe";
      return null;
    }

    function flameColors() {
      const mk = mixKind();
      if (mk === "carb") return { outer: "#ff7a18", inner: "#ffe7a0", tip: "FEATHERS" };
      if (mk === "ox") return { outer: "#6ec8ff", inner: "#e8f6ff", tip: "OXIDIZING" };
      return { outer: "#ffb020", inner: "#fff6c8", tip: "NEUTRAL" };
    }

    function scene() {
      const ox = oxide / 100;
      const fc = flameColors();
      const flameG = torch
        ? '<g class="bz-flame" transform="translate(' +
          (flame.x - 86) +
          "," +
          (flame.y - 108) +
          ')"><ellipse cx="86" cy="108" rx="16" ry="24" fill="' +
          fc.outer +
          '" opacity="0.88"/><ellipse cx="86" cy="98" rx="6" ry="11" fill="' +
          fc.inner +
          '"/><text x="68" y="140" fill="' +
          fc.outer +
          '" font-size="8">' +
          fc.tip +
          "</text></g>"
        : "";
      const rodG =
        '<g class="bz-rod" transform="translate(' +
        (rod.x - 210) +
        "," +
        (rod.y - 36) +
        ')"><rect x="196" y="28" width="72" height="8" rx="2" fill="' +
        (alloyObj().ok ? "#c9a227" : "#8b98a5") +
        '"/><text x="198" y="24" fill="#e8c450" font-size="8">ROD</text></g>';
      const n2dots = n2ok()
        ? '<g class="bz-n2">' +
          '<circle class="d1" cx="40" cy="92" r="3" fill="#8ec8ff"/>' +
          '<circle class="d2" cx="70" cy="88" r="2.5" fill="#8ec8ff"/>' +
          '<circle class="d3" cx="110" cy="90" r="3" fill="#8ec8ff"/>' +
          '<circle class="d4" cx="160" cy="86" r="2" fill="#8ec8ff"/>' +
          "</g>"
        : "";
      const walk = Math.min(heatL, heatR) / 100;
      const filletW = 6 + fillet * 0.2 * (0.45 + walk);
      const filletCol = blown ? "#F43F5E" : "#c9a227";
      const ragG = rag
        ? '<rect x="218" y="78" width="44" height="22" rx="6" fill="#3a6ea5" opacity="0.9"/><text x="224" y="93" fill="#fff" font-size="8">WET RAG</text>'
        : job.rag
          ? '<g class="bz-ragpile"><rect x="8" y="8" width="44" height="18" rx="4" fill="#3a6ea5"/><text x="12" y="21" fill="#fff" font-size="8">RAG</text></g>'
          : "";
      const coreG = !job.cores
        ? ""
        : cores
          ? '<text x="210" y="42" fill="#7fd99a" font-size="9">CORES OUT</text>'
          : '<g class="bz-core"><circle cx="248" cy="48" r="10" fill="#c0392b"/><text x="232" y="32" fill="#e8c450" font-size="8">SCHRADER</text></g>';
      const sandMark = sanded
        ? '<text x="118" y="76" fill="#7fd99a" font-size="8">CUP BRIGHT</text>'
        : '<text x="112" y="76" fill="#e8c450" font-size="8">TAP CUP TO SAND</text>';
      const inside = ox > 0.08
        ? '<circle cx="54" cy="178" r="14" fill="#1a1a1a"/><circle cx="54" cy="178" r="9" fill="#3a2a22"/><text x="74" y="182" fill="#F43F5E" font-size="9">INSIDE · SCALE</text>'
        : n2ok()
          ? '<circle cx="54" cy="178" r="14" fill="#c9a882"/><circle cx="54" cy="178" r="9" fill="#8ec8ff" opacity="0.45"/><text x="74" y="182" fill="#7fd99a" font-size="9">INSIDE · CLEAN N₂</text>'
          : '<circle cx="54" cy="178" r="14" fill="#c9a882"/><circle cx="54" cy="178" r="9" fill="#5a4a3a"/><text x="74" y="182" fill="#8b98a5" font-size="9">CUTAWAY · no flow</text>';
      const bodyFill = cooked > 40 ? "#5a2018" : "#3a4550";
      return (
        '<svg class="bz-vis" viewBox="0 0 280 200" role="img" aria-label="Brazing joint" style="width:100%;max-width:560px;max-height:280px;height:auto;display:block;touch-action:none">' +
        '<rect width="280" height="200" rx="12" fill="#10161c"/>' +
        '<rect x="20" y="86" width="110" height="28" rx="3" fill="' + copperColor(heatL) + '"/>' +
        '<rect x="130" y="80" width="28" height="40" fill="' + (sanded ? "#9aa3ad" : "#6a5740") + '"/>' +
        '<rect x="158" y="86" width="62" height="28" rx="3" fill="' + copperColor(heatR) + '"/>' +
        '<rect x="220" y="70" width="40" height="60" rx="4" fill="' + bodyFill + '"/>' +
        '<text x="224" y="118" fill="#e8c450" font-size="8">' + job.tag + "</text>" +
        '<circle cx="36" cy="128" r="10" fill="' + (n2on ? "#3d7ec9" : "#2a3238") + '" stroke="#8ec8ff" stroke-width="2"/>' +
        '<text x="8" y="154" fill="#8ec8ff" font-size="8">N₂ PORT</text>' +
        '<text x="24" y="84" fill="#8b98a5" font-size="8">L ' + Math.round(heatL) + "°</text>" +
        '<text x="168" y="84" fill="#8b98a5" font-size="8">R ' + Math.round(heatR) + "°</text>" +
        ragG +
        coreG +
        sandMark +
        (fillet > 4
          ? '<ellipse cx="144" cy="100" rx="' + filletW + '" ry="' + (5 + fillet * 0.07 * walk) + '" fill="' + filletCol + '" opacity="0.95"/>'
          : "") +
        n2dots +
        rodG +
        flameG +
        '<rect x="8" y="160" width="264" height="32" rx="6" fill="#0c1014"/>' +
        inside +
        '<text x="200" y="182" fill="#e8c450" font-size="9">fillet ' +
        Math.round(fillet) +
        "%</text>" +
        "</svg>"
      );
    }

    function bindScene() {
      const el = host.querySelector("#bz-scene");
      if (!el) return;
      el.style.touchAction = "none";
      el.onpointerdown = function (e) {
        if (verdict) return;
        const p = svgPt(e);
        const hit = hitAt(p);
        if (hit === "core" && !cores) {
          cores = true;
          msg = "Cores out. Wet rag next.";
          hub = "Seat lives. N₂ can actually flow.";
          if (window.LtHaptic) window.LtHaptic.tick();
          maybeGuide();
          paintChrome();
          return;
        }
        if (hit === "cup" && !sanded) {
          sanded = true;
          msg = "Cup is bright. Nitrogen, then flame.";
          hub = "Bright metal wets. Oil beads.";
          if (window.LtHaptic) window.LtHaptic.tick();
          maybeGuide();
          paintChrome();
          return;
        }
        if ((hit === "valve" || (p.x < 56 && p.y < 30)) && job.rag && !rag) {
          if (hit === "valve" || holding === "rag") {
            rag = true;
            holding = null;
            msg = "Rag on. Nitrogen whisper next.";
            hub = "Keep it wet. Dry rag is a lie.";
            if (window.LtHaptic) window.LtHaptic.tick();
            maybeGuide();
            paintChrome();
            return;
          }
        }
        if (p.x < 56 && p.y < 30 && job.rag) {
          holding = "rag";
          return;
        }
        if (hit === "n2") {
          if (purge === "o2" || purge === "air") {
            msg = purge === "o2"
              ? "That hose is oxygen. It stays a fail. Switch the purge to nitrogen."
              : "That hose is shop air. It stays a fail. Nitrogen is the purge.";
            paintChrome();
            return;
          }
          purge = "n2";
          n2on = true;
          msg = "Nitrogen on the tube. Set 2–5 SCFH. Whisper, not a blast.";
          hub = "Purge the oxygen out before you cherry it. Shop air is a fail.";
          maybeGuide();
          paintChrome();
          return;
        }
        if (torch) {
          holding = "torch";
          flame = p;
          try { el.setPointerCapture(e.pointerId); } catch (_) {}
          return;
        }
        if (feeding) {
          holding = "rod";
          rod = p;
          try { el.setPointerCapture(e.pointerId); } catch (_) {}
        }
      };
      el.onpointermove = function (e) {
        if (!holding) return;
        const p = svgPt(e);
        if (holding === "torch") flame = p;
        if (holding === "rod") rod = p;
        if (holding === "rag" && hitAt(p) === "valve") {
          rag = true;
          holding = null;
          maybeGuide();
          paintChrome();
        }
      };
      el.onpointerup = function () { holding = null; };
      el.onpointercancel = function () { holding = null; };
    }

    function mount() {
      host.innerHTML =
        '<div class="bz-lab">' +
        '<header class="bz-head">' +
        '<button type="button" class="btn" id="bz-hub">Shop floor</button>' +
        '<div class="brand-bar"><div class="brand-mark">' +
        ((window.LtBrand && window.LtBrand.mark) || "HA") +
        '</div><div class="brand-word"><strong>BRAZE</strong><span>neutral cone · both sides · cutaway</span></div></div>' +
        '<button type="button" class="btn" id="bz-reset">New joint</button></header>' +
        '<div class="bz-acts">' +
        '<button type="button" class="btn primary" id="bz-torch">Light torch · drag on copper</button>' +
        '<button type="button" class="btn" id="bz-feed">Hold rod · touch the cup</button>' +
        '<button type="button" class="btn" id="bz-off">Torch off · keep N₂</button>' +
        "</div>" +
        '<div class="bz-jobs" id="bz-jobs"></div>' +
        '<div class="bz-jobs" id="bz-purge"></div>' +
        '<div class="bz-coach" id="bz-coach"></div>' +
        '<div class="bz-scene" id="bz-scene"></div>' +
        '<p class="bz-status" id="bz-status"></p>' +
        '<p class="bz-hub" id="bz-hubtalk"></p>' +
        '<div class="bz-sliders">' +
        '<label class="bz-n2">N₂ flow (SCFH)<input id="bz-n2" type="range" min="0" max="20" step="0.5" value="0" /><output id="bz-n2o">0 SCFH</output></label>' +
        '<label class="bz-n2">O₂ mix · inner cone<input id="bz-mix" type="range" min="0" max="100" step="1" value="50" /><output id="bz-mixo">NEUTRAL</output></label>' +
        "</div>" +
        '<div class="bz-alloys" id="bz-alloys"></div>' +
        '<p class="bz-hint">Cutaway at the bottom is the inside of the tube. If it goes black, you skipped nitrogen or ran an oxidizing flame.</p>' +
        "</div>";

      host.querySelector("#bz-hub").onclick = function () { if (onHub) onHub(); };
      host.querySelector("#bz-reset").onclick = function () { hardReset(); };
      host.querySelector("#bz-n2").oninput = function () {
        n2 = +host.querySelector("#bz-n2").value;
        host.querySelector("#bz-n2o").textContent =
          n2.toFixed(1) + " SCFH" + (n2 >= 2 && n2 <= 5 ? " · whisper" : n2 > 12 ? " · TOO HARD" : "");
        if (n2 >= 2 && n2 <= 5 && window.LtHaptic) window.LtHaptic.tick();
        maybeGuide();
        paintChrome();
      };
      host.querySelector("#bz-mix").oninput = function () {
        mix = +host.querySelector("#bz-mix").value;
        const k = mixKind();
        host.querySelector("#bz-mixo").textContent =
          k === "neutral" ? "NEUTRAL" : k === "ox" ? "OXIDIZING — back off O₂" : "CARBURIZING — more O₂";
        maybeGuide();
        paintChrome();
      };
      host.querySelector("#bz-alloys").onclick = function (e) {
        const b = e.target.closest("[data-alloy]");
        if (!b) return;
        alloy = b.getAttribute("data-alloy");
        maybeGuide();
        paintChrome();
      };
      host.querySelector("#bz-jobs").onclick = function (e) {
        const b = e.target.closest("[data-job]");
        if (!b || verdict) return;
        const id = b.getAttribute("data-job");
        job = JOBS.filter(function (j) { return j.id === id; })[0] || JOBS[0];
        hardReset(true);
      };
      const purgeEl = host.querySelector("#bz-purge");
      if (purgeEl) purgeEl.onclick = function (e) {
        const b = e.target.closest("[data-purge]");
        if (!b || verdict) return;
        purge = b.getAttribute("data-purge");
        if (purge === "n2") {
          n2on = true;
          if (badGas) {
            msg = badGas === "air"
              ? "Shop air already touched this joint with the torch lit. Nitrogen now does not save it."
              : "Oxygen already touched this joint with the torch lit. Nitrogen now does not save it.";
            hub = "That braze stays a fail. Start a new joint.";
          } else {
            msg = "Nitrogen is the purge. Set 2–5 SCFH before the torch.";
            hub = "Oxygen and shop air are a fail on refrigerant copper.";
          }
        } else if (purge === "o2") {
          n2on = false;
          msg = "Oxygen stays a fail. Refrigerant copper is brazed under nitrogen, not oxygen.";
          hub = "That tank does not belong on this joint.";
        } else {
          n2on = false;
          msg = "Shop air stays a fail. It is wet. Nitrogen flows while you braze.";
          hub = "Don't braze on compressor air.";
        }
        paintChrome();
      };
      host.querySelector("#bz-torch").onclick = function () {
        if (verdict) return;
        torch = true;
        feeding = false;
        cooled = false;
        flame = { x: 90, y: 108 };
        holding = "torch";
        if (window.LtHaptic) window.LtHaptic.kick();
        msg = "Flame on. Drag the inner cone around BOTH sides of the cup.";
        hub = mixKind() === "neutral" ? "Heat the pipe. Rod waits." : "Fix the mix first. Neutral cone.";
        paintChrome();
      };
      host.querySelector("#bz-feed").onclick = function () {
        if (verdict) return;
        feeding = true;
        holding = "rod";
        if (!torch) {
          msg = "Torch is off. Nothing to feed.";
          paintChrome();
          return;
        }
        if (window.LtHaptic) window.LtHaptic.tick();
        msg = "Drag the rod onto the cherry cup.";
        paintChrome();
      };
      host.querySelector("#bz-off").onclick = function () {
        torch = false;
        feeding = false;
        holding = null;
        if (fillet >= 96) finish(true);
        else if (badGas) {
          msg = badGas === "air"
            ? "Shop air was on that joint with the torch lit. That braze stays a fail."
            : "Oxygen was on that joint with the torch lit. That braze stays a fail.";
          hub = "Nitrogen has to be flowing the whole time. Switching the hose later does not save it.";
        } else {
          msg = "Cooling. Keep N₂ on until it's dark.";
          hub = "Oxide forms on the way down too if you kill the nitrogen.";
        }
        paintChrome();
      };
      mounted = true;
      paintChrome();
      bindScene();
    }

    function paintChrome() {
      if (!mounted) return;
      skipJobSteps();
      const st = host.querySelector("#bz-status");
      const hb = host.querySelector("#bz-hubtalk");
      const coach = host.querySelector("#bz-coach");
      const g = GUIDE[Math.min(gi, GUIDE.length - 1)];
      if (coach) {
        coach.innerHTML =
          '<p class="eyebrow">BRAZE · ' +
          job.name +
          " · " +
          (gi + 1) +
          "/" +
          GUIDE.length +
          "</p><strong>" +
          g.title +
          "</strong><p>" +
          g.say +
          "</p>";
      }
      if (st) {
        st.textContent = msg;
        st.className = "bz-status" + (verdict === "pass" ? " good" : verdict === "fail" ? " bad" : "");
      }
      if (hb) hb.textContent = hub;
      const jobs = host.querySelector("#bz-jobs");
      if (jobs) {
        jobs.innerHTML = JOBS.map(function (j) {
          return (
            '<button type="button" class="bz-tog' +
            (job.id === j.id ? " on" : "") +
            '" data-job="' +
            j.id +
            '">' +
            j.name +
            "</button>"
          );
        }).join("");
      }
      const purgeBox = host.querySelector("#bz-purge");
      if (purgeBox) {
        const purges = [
          ["n2", "Purge · nitrogen"],
          ["o2", "Purge · oxygen"],
          ["air", "Purge · shop air"],
        ];
        purgeBox.innerHTML = purges.map(function (p) {
          return '<button type="button" class="bz-tog' + (purge === p[0] ? " on" : "") + '" data-purge="' + p[0] + '">' + p[1] + "</button>";
        }).join("");
      }
      host.querySelector("#bz-alloys").innerHTML = ALLOYS.map(function (a) {
        return (
          '<button type="button" class="bz-tog' +
          (alloy === a.id ? " on" : "") +
          '" data-alloy="' +
          a.id +
          '">' +
          a.name +
          "</button>"
        );
      }).join("");
      const t = host.querySelector("#bz-torch");
      const f = host.querySelector("#bz-feed");
      if (t) t.disabled = !!verdict;
      if (f) f.disabled = !!verdict;
      updateSvg();
      bindScene();
    }

    function updateSvg() {
      const el = host.querySelector("#bz-scene");
      if (!el) return;
      el.innerHTML = scene();
    }

    function hardReset(keepJob) {
      if (!keepJob) job = JOBS[0];
      cores = !job.cores;
      rag = !job.rag;
      sanded = false;
      n2on = false;
      n2 = 0;
      purge = "off";
      glob = false;
      mix = 50;
      alloy = "sf15";
      torch = false;
      feeding = false;
      heatL = 0;
      heatR = 0;
      fillet = 0;
      oxide = 0;
      cooked = 0;
      burned = 0;
      blown = false;
      badGas = "";
      cooled = false;
      verdict = null;
      gi = 0;
      holding = null;
      flame = { x: 86, y: 108 };
      rod = { x: 200, y: 40 };
      msg = job.cores ? "Tap the schrader. Cores out first." : job.rag ? "Rag the body. Then nitrogen." : "Sand the cup. Then nitrogen.";
      hub = job.say;
      skipJobSteps();
      const sl = host.querySelector("#bz-n2");
      if (sl) sl.value = "0";
      const o = host.querySelector("#bz-n2o");
      if (o) o.textContent = "0 SCFH";
      const mx = host.querySelector("#bz-mix");
      if (mx) mx.value = "50";
      const mo = host.querySelector("#bz-mixo");
      if (mo) mo.textContent = "NEUTRAL";
      paintChrome();
    }

    mount();
    timer = setInterval(tick, 80);
    return {
      stop: function () {
        clearInterval(timer);
      },
    };
  }

  global.BrazingLab = {
    start: function (host, opts) {
      host.innerHTML = "";
      return BrazingLab(host, opts || {});
    },
  };
})(window);
