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
    let mix = 0;
    let ace = 0;
    let oxy = 0;
    let flameOk = false;
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
    let flame = { x: 71, y: 48 };
    let rod = { x: 58, y: 66 };
    let holding = null;
    let gi = 0;
    let msg = "Pick the joint. Then tap the schrader if it's a valve.";
    let hub = "Pretty outside, sandpaper inside — that's a braze with no nitrogen.";
    let timer = 0;
    let mounted = false;
    let filletPopped = false;
    let coachShown = "";
    let missKey = "";
    let stepStamp = "";
    let watching = false;
    let watchTimer = 0;
    const JOINT = { L: { x: 64, y: 49 }, R: { x: 78, y: 47 }, cup: { x: 71, y: 48 }, body: { x: 90, y: 56 }, n2: { x: 22, y: 49 } };

    function sayCoach() {}
    function sayMiss(key, el, text) {
      if (missKey === key) return;
      missKey = key;
      if (!window.PlayFeel) return;
      const node = el || host;
      window.PlayFeel.deny(node);
      window.PlayFeel.pop(node, text, "bad");
    }
    function failTag() {
      if (purge === "o2" || purge === "air" || badGas) return "Wrong gas";
      if (!alloyObj().ok) return "Wrong rod";
      if (glob) return "Rod too early";
      if (!(purge === "n2" && n2on && n2 >= 2)) return "No nitrogen";
      if (n2 > 5 || blown) return "Too much N₂";
      if (job.cores && !cores) return "Cores in";
      if (job.rag && !rag) return "No rag";
      if (!sanded) return "Dirty cup";
      if (mixKind() !== "neutral") return "Bad flame";
      if (oxide >= 32) return "No nitrogen";
      if (cooked >= 40) return "Burned it";
      if (burned >= 40) return "Burned the joint";
      if (!cooled && (heatL < 60 || heatR < 60)) return "One side";
      return fillet < 90 ? "No fillet" : "No pass";
    }
    function feelVerdict() {
      if (!window.PlayFeel) {
        syncPlay(false);
        return;
      }
      const el = host.querySelector(".bz-fillet") || host.querySelector("#bz-aim") || host.querySelector("#bz-photo") || host;
      if (verdict === "pass") {
        window.PlayFeel.bump(el);
        window.PlayFeel.pop(el, "Pass", "ok");
      } else if (verdict === "fail" && !missKey) {
        window.PlayFeel.deny(el);
        window.PlayFeel.pop(el, failTag(), "bad");
      }
      syncPlay(false);
    }

    function alloyObj() {
      return ALLOYS.filter(function (a) { return a.id === alloy; })[0];
    }
    function heat() {
      return (heatL + heatR) / 2;
    }
    function n2ok() {
      return purge === "n2" && n2on && n2 >= 2 && n2 <= 5;
    }
    function applyMix() {
      if (ace < 1) mix = 8;
      else mix = Math.max(0, Math.min(100, 10 + (oxy / ace) * 40));
    }
    function flameLine() {
      if (ace < 1) return "Acetylene is shut. Nothing to light.";
      if (oxy < 0.5) return "Acetylene only. Yellow and smoky. Add oxygen.";
      if (mixKind() === "carb") return "Feather past the cone. Add oxygen until the feather is gone.";
      if (mixKind() === "ox") return "Short hissing cone. Back off the oxygen.";
      return "Sharp inner cone. Feather is gone. That's the braze setting.";
    }
    function setFlame(a, o) {
      ace = Math.max(0, Math.min(15, a));
      oxy = Math.max(0, Math.min(20, o));
      applyMix();
      if (torch && mixKind() === "neutral") flameOk = true;
      const as = host.querySelector("#bz-ace");
      const os = host.querySelector("#bz-oxy");
      const ao = host.querySelector("#bz-aceo");
      const oo = host.querySelector("#bz-oxyo");
      const say = host.querySelector("#bz-flame-say");
      if (as) as.value = String(ace);
      if (os) os.value = String(oxy);
      if (ao) ao.textContent = ace.toFixed(1) + " psi" + (ace >= 15 ? " · stop" : "");
      if (oo) oo.textContent = oxy.toFixed(1) + " psi";
      if (say) say.textContent = flameLine();
      paintDials();
    }
    function dialArc(cx, cy, r, a0, a1, color) {
      const p = function (a) {
        const rad = a * Math.PI / 180;
        return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
      };
      const s = p(a0);
      const e = p(a1);
      const large = a1 - a0 > 180 ? 1 : 0;
      return '<path d="M' + s[0].toFixed(1) + " " + s[1].toFixed(1) + " A" + r + " " + r + " 0 " + large + " 1 " + e[0].toFixed(1) + " " + e[1].toFixed(1) + '" fill="none" stroke="' + color + '" stroke-width="3"/>';
    }
    function regDial(label, value, max, color) {
      const cx = 60;
      const cy = 64;
      const r = 40;
      const start = 135;
      const sweep = 270;
      const marks = max === 15 ? [0, 5, 10, 15] : [0, 5, 10, 15, 20];
      let ticks = "";
      marks.forEach(function (n) {
        const rad = (start + (n / max) * sweep) * Math.PI / 180;
        const x1 = cx + Math.cos(rad) * (r - 7);
        const y1 = cy + Math.sin(rad) * (r - 7);
        const x2 = cx + Math.cos(rad) * r;
        const y2 = cy + Math.sin(rad) * r;
        const lx = cx + Math.cos(rad) * (r - 15);
        const ly = cy + Math.sin(rad) * (r - 15);
        ticks += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#d9d0c0" stroke-width="1.6"/>';
        ticks += '<text x="' + lx.toFixed(1) + '" y="' + (ly + 3).toFixed(1) + '" text-anchor="middle" fill="#e7d7b0" font-size="8" font-family="sans-serif">' + n + "</text>";
      });
      const frac = Math.max(0, Math.min(1, value / max));
      const nd = (start + frac * sweep) * Math.PI / 180;
      const nx = cx + Math.cos(nd) * 26;
      const ny = cy + Math.sin(nd) * 26;
      const zone = max === 15 ? dialArc(cx, cy, r + 4, start + (12 / 15) * sweep, start + sweep, "#c0392b") : "";
      return (
        '<svg viewBox="0 0 120 108" aria-label="' + label + ' regulator ' + value.toFixed(1) + ' psi">' +
        '<circle cx="60" cy="64" r="48" fill="#1a1714" stroke="' + color + '" stroke-width="3"/>' +
        '<circle cx="60" cy="64" r="40" fill="#0e0c0a" stroke="#3a342c"/>' +
        zone + ticks +
        '<line x1="60" y1="64" x2="' + nx.toFixed(1) + '" y2="' + ny.toFixed(1) + '" stroke="#f6f1e6" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="60" cy="64" r="3.2" fill="' + color + '"/>' +
        '<text x="60" y="86" text-anchor="middle" fill="#f6f1e6" font-size="12" font-weight="700" font-family="sans-serif">' + value.toFixed(1) + "</text>" +
        '<text x="60" y="14" text-anchor="middle" fill="' + color + '" font-size="9" font-weight="700" font-family="sans-serif">' + label + "</text>" +
        "</svg>"
      );
    }
    function paintDials() {
      const a = host.querySelector("#bz-dial-ace");
      const o = host.querySelector("#bz-dial-oxy");
      if (a) a.innerHTML = regDial("ACETYLENE", ace, 15, "#e23b3b");
      if (o) o.innerHTML = regDial("OXYGEN", oxy, 20, "#2e9e4f");
    }
    function mixKind() {
      if (mix < 38) return "carb";
      if (mix > 64) return "ox";
      return "neutral";
    }
    function dist(a, x, y) {
      return Math.hypot(a.x - x, a.y - y);
    }
    function moveStamp() {
      if (watching) return "watch";
      const m = nextMove();
      return m.title + "\n" + m.act;
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

    function syncPlay(onJoint) {
      if (!window.PlayFeel) return;
      if (onJoint == null) {
        onJoint = !!(torch && (dist(flame, JOINT.L.x, JOINT.L.y) < 12 || dist(flame, JOINT.R.x, JOINT.R.y) < 12 || dist(flame, JOINT.cup.x, JOINT.cup.y) < 11));
      }
      const hot = heatL >= 70 && heatR >= 70;
      const full = fillet >= 90;
      if (!verdict && full && !filletPopped) {
        filletPopped = true;
        const el = host.querySelector(".bz-fillet") || host.querySelector("#bz-aim") || host.querySelector("#bz-photo") || host;
        window.PlayFeel.bump(el);
        window.PlayFeel.pop(el, "Fillet", "ok");
      }
      let line;
      if (verdict === "pass") line = "That's a braze. Hit New joint for another rep.";
      else if (verdict === "fail") line = msg + " Hit New joint.";
      else if (job.cores && !cores) line = "Pull the schrader cores before the torch.";
      else if (job.rag && !rag) line = "Wet rag the body. Packing burns before the copper.";
      else if (purge === "o2" || purge === "air" || badGas) line = (badGas === "air" || purge === "air") ? "Shop air fails this joint. Nitrogen only. Hit New joint." : "Oxygen fails this joint. Nitrogen only. Hit New joint.";
      else if (!(purge === "n2" && n2on && n2 >= 2)) line = "Nitrogen through the pipe. Set the flow to 2–5 SCFH.";
      else if (n2 > 5) line = "Nitrogen is too hard. Back it to 2–5 or it blows the cup cold.";
      else if (!sanded) line = "Sand the cup bright. Tap the fitting.";
      else if (!alloyObj().ok) line = alloy === "stay" ? "Stay-Brite is solder. Pick Sil-Fos." : "Wrong rod on copper. Pick Sil-Fos.";
      else if (mixKind() !== "neutral") line = mixKind() === "ox" ? "Oxidizing flame. Back off the oxygen." : "Feathers on the flame. Add oxygen until the cone is sharp.";
      else if (glob) line = "Rod was too early. Hit New joint.";
      else if (burned >= 40) line = "You burned the joint. Hit New joint.";
      else if (burned >= 18) line = "Too hot. Feed the rod and get off the joint.";
      else if (full) line = "Torch off. Keep nitrogen on until the copper goes dark.";
      else if (hot) line = "Both sides are cherry. Touch the rod to the seam. The copper melts the rod.";
      else if (!torch) line = "Light the torch. Put the inner cone on the boss, where the stub enters the shell. Both sides.";
      else if (!onJoint) line = "Cone is off the copper. Drag it onto the boss — tube side and shell side.";
      else line = heatL + 8 < heatR ? "Stay on the tube side of the boss." : heatR + 8 < heatL ? "Stay on the shell side of the boss." : "Walk the cone around the boss until both sides are cherry.";
      sayCoach(line);
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
      const onL = torch && dist(flame, JOINT.L.x, JOINT.L.y) < 12;
      const onR = torch && dist(flame, JOINT.R.x, JOINT.R.y) < 12;
      const onCup = torch && dist(flame, JOINT.cup.x, JOINT.cup.y) < 11;
      const onBody = torch && dist(flame, JOINT.body.x, JOINT.body.y) < 14;
      const mk = mixKind();
      const heatRate = mk === "neutral" ? 9 : mk === "ox" ? 12 : 5;
      if (torch) {
        if (onL || onCup) heatL = Math.min(100, heatL + heatRate * dt * 10);
        if (onR || onCup) heatR = Math.min(100, heatR + heatRate * dt * 10);
        if (!onL && !onR && !onCup) {
          heatL = Math.max(0, heatL - 4 * dt * 10);
          heatR = Math.max(0, heatR - 4 * dt * 10);
        }
        if (purge === "n2" && n2on && n2 > 5) {
          const chill = Math.min(24, (n2 - 5) * 2.4) * dt * 10;
          heatL = Math.max(0, heatL - chill);
          heatR = Math.max(0, heatR - chill);
        }
        if (heatL > 92 && heatR > 92) burned = Math.min(100, burned + 10 * dt);
        if (purge === "o2" || purge === "air") badGas = purge;
        if (!n2ok() || mk === "ox") oxide = Math.min(100, oxide + (mk === "ox" ? 22 : 16) * dt);
        if (job.rag && (!rag || onBody)) cooked = Math.min(100, cooked + (onBody ? 24 : 7) * dt);
        if (mk === "carb") oxide = Math.min(100, oxide + 6 * dt);
      } else {
        heatL = Math.max(0, heatL - 4 * dt * 10);
        heatR = Math.max(0, heatR - 4 * dt * 10);
        if (fillet >= 96 && heat() < 28 && n2ok() && !glob && !blown && oxide < 32 && cooked < 40 && burned < 40 && alloyObj().ok && sanded && flameOk) {
          cooled = true;
        } else if (!n2ok() && fillet > 40) {
          oxide = Math.min(100, oxide + 10 * dt);
        }
      }
      if (feeding && torch) {
        const onJoint = dist(rod, JOINT.cup.x, JOINT.cup.y) < 11;
        const tooHard = purge === "n2" && n2on && n2 > 5;
        if (heat() < 68 || heatL < 55 || heatR < 55) {
          if (onJoint && tooHard) {
            blown = true;
            msg = "Nitrogen is too hard. It blew the cup cold before the rod could wet.";
            hub = "2–5 SCFH. A blast chills the cup.";
          } else if (onJoint) {
            glob = true;
            msg = heatL < 55 && heatR >= 70
              ? "Rod too early. Right side is cherry. Left side is still cold."
              : heatR < 55 && heatL >= 70
                ? "Rod too early. Left side is cherry. Right side is still cold."
                : "Rod too early. Both sides of the cup have to be cherry. The pipe melts the rod.";
            hub = "Heat the joint, then the rod. A glob does not pass.";
          } else {
            msg = "Keep the rod off the cup until both sides are cherry.";
          }
        } else if (!alloyObj().ok) {
          if (onJoint) {
            glob = true;
            msg = alloy === "stay"
              ? "Stay-Brite is solder. Refrigerant copper is brazed, not soldered. That does not pass."
              : "That rod is not the braze for this copper. It does not pass.";
            hub = "Sil-Fos on copper-to-copper. Solder stays on the water line.";
          }
        } else if (purge === "o2" || purge === "air") {
          msg = purge === "o2"
            ? "Oxygen in the tube. That braze is a fail."
            : "Shop air in the tube. That braze is a fail.";
          hub = "Nitrogen flows while you braze. Oxygen and shop air do not.";
        } else if (tooHard && onJoint) {
          blown = true;
          fillet = Math.max(0, fillet - 30 * dt);
          msg = "Nitrogen is too hard. It blows the cup cold and the fillet out. 2–5 SCFH.";
          hub = "A whisper through the pipe. Not a blast.";
        } else if (!sanded) {
          msg = "Oil on the cup. It beads. Sand it.";
          hub = "Sil-Fos doesn't hide dirt.";
        } else if (mk !== "neutral") {
          msg = mk === "ox" ? "Oxidizing flame is burning the copper. Back off the O₂." : "Feathers on the flame. More O₂ — you want a sharp inner cone.";
        } else if (!n2ok()) {
          msg = "No nitrogen through the pipe. The inside of that joint is scaling.";
          hub = "2–5 SCFH while the torch is on the copper.";
        } else if (onJoint && alloyObj().ok && !glob && !blown) {
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
      const torchEl = host.querySelector("#bz-torch-tool");
      const rodEl = host.querySelector("#bz-rod-tool");
      if (torch && (badGas || purge === "o2" || purge === "air")) sayMiss("gas", torchEl, badGas === "air" || purge === "air" ? "Shop air" : "Oxygen");
      else if (glob && !alloyObj().ok) sayMiss("rod", rodEl, "Wrong rod");
      else if (glob) sayMiss("rod", rodEl, "Rod too early");
      else if (blown) sayMiss("hard", torchEl, "Too much N₂");
      else if (burned >= 40) sayMiss("burn", torchEl, "Burned the joint");
      else if (cooked >= 40) sayMiss("cook", torchEl, job.rag && !rag ? "No rag" : "Burned it");
      else if (oxide >= 32) sayMiss("scale", torchEl, "No nitrogen");
      else if (torch && purge === "n2" && n2 > 5) sayMiss("hard", torchEl, "Too much N₂");
      else if (torch && (onL || onR || onCup) && !n2ok()) sayMiss("n2", torchEl, "No nitrogen");
      else if (torch && mixKind() !== "neutral") sayMiss("mix", torchEl, "Bad flame");
      maybeGuide();
      if (glob || burned >= 40 || badGas || oxide >= 32 || cooked >= 40 || blown) {
        finish(true);
        return;
      }
      if (cooled && fillet >= 96) {
        finish(true);
        return;
      }
      if (moveStamp() !== stepStamp) paintChrome();
      else updateSvg();
      syncPlay(!!(onL || onR || onCup));
    }

    function finish(ok) {
      if (verdict) return;
      torch = false;
      feeding = false;
      holding = null;
      if (watching) {
        if (watchTimer) clearTimeout(watchTimer);
        watchTimer = 0;
        verdict = ok && fillet >= 90 && !glob && !badGas ? "pass" : "fail";
        msg = verdict === "pass"
          ? "That's the braze. Your turn. Same order."
          : "Watch it again. Core, rag, nitrogen, clean, heat, rod, torch off.";
        hub = "1 pull the core. 2 wet rag. 3 nitrogen at 3. 4 clean the ring. 5 heat both sides. 6 touch the rod. 7 torch off.";
        paintChrome();
        setTimeout(function () {
          watching = false;
          hardReset(true);
          msg = "Your turn. The gold button is the next move. Or tap the picture.";
          hub = "Same order you just watched.";
          paintChrome();
          syncPlay();
        }, verdict === "pass" ? 1700 : 700);
        return;
      }
      if (!ok) {
        verdict = "fail";
        if (window.LtHaptic) window.LtHaptic.bad();
        paintChrome();
        feelVerdict();
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
        if (!/rod too early|solder|not the braze/i.test(msg)) {
          msg = "Rod too early. Both sides of the cup get cherry, then the rod.";
        }
        hub = "Both sides cherry, then the rod. The pipe melts the rod.";
      } else if (!(purge === "n2" && n2on && n2 >= 2)) {
        verdict = "fail";
        msg = "No nitrogen through the pipe while you brazed. That joint does not pass.";
        hub = "2–5 SCFH of nitrogen. Not oxygen. Not shop air.";
      } else if (n2 > 5 || blown) {
        verdict = "fail";
        msg = "Nitrogen was too hard. It blows the cup cold. 2–5 SCFH, a whisper, not a blast.";
        hub = "Flow you can feel on the back of your hand. A blast chills the cup.";
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
      } else if (!cooled && (heatL < 60 || heatR < 60)) {
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
        if (global.LtDrip) global.LtDrip.say("epa.weigh");
        if (onXp) onXp(32);
        if (window.CurriculumTrain) window.CurriculumTrain.stamp("braze");
        if (window.LtHaptic) window.LtHaptic.land();
      }
      if (verdict === "fail" && window.LtHaptic) window.LtHaptic.bad();
      paintChrome();
      feelVerdict();
    }

    function photoPt(ev) {
      const box = host.querySelector("#bz-photo");
      if (!box) return { x: 0, y: 0 };
      const r = box.getBoundingClientRect();
      return {
        x: ((ev.clientX - r.left) / Math.max(1, r.width)) * 100,
        y: ((ev.clientY - r.top) / Math.max(1, r.height)) * 100,
      };
    }

    function hitAt(p) {
      if (job.cores && dist(p, 16, 40) < 9) return "core";
      if (job.rag && dist(p, 86, 30) < 10) return "valve";
      if (dist(p, JOINT.n2.x, JOINT.n2.y) < 10) return "n2";
      if (dist(p, JOINT.cup.x, JOINT.cup.y) < 10) return "cup";
      if (p.x > 28 && p.x < 80 && p.y > 40 && p.y < 58) return "pipe";
      return null;
    }

    function flameColors() {
      const mk = mixKind();
      if (mk === "carb") return { outer: "#ff7a18", inner: "#ffe7a0", tip: "FEATHERS" };
      if (mk === "ox") return { outer: "#6ec8ff", inner: "#e8f6ff", tip: "OXIDIZING" };
      return { outer: "#ffb020", inner: "#fff6c8", tip: "NEUTRAL" };
    }

    function torchArt(force) {
      const lit = !!(force || torch);
      const k = ace < 1 ? "off" : oxy < 0.5 ? "ace" : mixKind();
      const uid = "bz" + Math.round(Math.random() * 1e6);
      const defs =
        "<defs>" +
        '<filter id="' + uid + 'soft" x="-40%" y="-50%" width="180%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>' +
        '<linearGradient id="' + uid + 'cone" x1="118" y1="70" x2="185" y2="70" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="0.55" stop-color="#f2f8ff"/><stop offset="1" stop-color="#c5e4ff" stop-opacity=".15"/></linearGradient>' +
        '<linearGradient id="' + uid + 'hot" x1="118" y1="70" x2="155" y2="70" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f4e9ff"/><stop offset="0.45" stop-color="#d9d0ff"/><stop offset="1" stop-color="#8a78e0" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="' + uid + 'feather" x1="140" y1="70" x2="236" y2="70" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".15"/><stop offset=".35" stop-color="#f7f3e4" stop-opacity=".92"/><stop offset="1" stop-color="#efe6c4" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="' + uid + 'env" cx="42%" cy="50%" r="70%"><stop offset="0" stop-color="#e7f2ff" stop-opacity=".25"/><stop offset=".55" stop-color="#4e90d8" stop-opacity=".78"/><stop offset="1" stop-color="#1d4f96" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + uid + 'envc" cx="40%" cy="50%" r="72%"><stop offset="0" stop-color="#e7f1ff" stop-opacity=".2"/><stop offset=".5" stop-color="#3f86d4" stop-opacity=".7"/><stop offset="1" stop-color="#1a4a90" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + uid + 'envo" cx="32%" cy="50%" r="68%"><stop offset="0" stop-color="#efe8ff" stop-opacity=".35"/><stop offset=".5" stop-color="#6a74d8" stop-opacity=".8"/><stop offset="1" stop-color="#2a3488" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + uid + 'acea" cx="45%" cy="48%" r="62%"><stop offset="0" stop-color="#fff6c8"/><stop offset=".45" stop-color="#ffb020"/><stop offset="1" stop-color="#e07010" stop-opacity=".15"/></radialGradient>' +
        '<radialGradient id="' + uid + 'aceb" cx="40%" cy="50%" r="55%"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#ffe36a"/><stop offset="1" stop-color="#ff9a20" stop-opacity="0"/></radialGradient>' +
        "</defs>";
      let fire = "";
      if (lit && k === "ace") {
        fire =
          '<g class="bz-fire">' +
          '<path d="M118 80 C148 18 236 -4 278 42 C318 86 246 134 176 122 C138 114 116 98 118 80 Z" fill="url(#' + uid + 'acea)" filter="url(#' + uid + 'soft)"/>' +
          '<path d="M124 74 C158 36 214 26 246 56 C268 80 222 108 168 102 C140 96 124 86 124 74 Z" fill="url(#' + uid + 'aceb)"/>' +
          '<path d="M210 16 C222 4 244 2 248 16" fill="none" stroke="#1c1c1c" stroke-width="3.2" opacity=".4" stroke-linecap="round"/>' +
          '<path d="M236 12 C250 0 270 2 266 16" fill="none" stroke="#111" stroke-width="2.2" opacity=".28" stroke-linecap="round"/>' +
          "</g>";
      } else if (lit && k === "carb") {
        fire =
          '<g class="bz-fire">' +
          '<path d="M118 70 C148 42 214 38 262 70 C214 102 148 98 118 70 Z" fill="url(#' + uid + 'envc)" filter="url(#' + uid + 'soft)"/>' +
          '<path d="M118 70 C142 56 188 54 228 70 C188 86 142 84 118 70 Z" fill="url(#' + uid + 'feather)"/>' +
          '<path d="M118 70 C130 64 150 65 164 70 C150 75 130 76 118 70 Z" fill="url(#' + uid + 'cone)"/>' +
          '<path d="M118 70 C126 67 142 67 154 70 C142 73 126 73 118 70 Z" fill="#fff" opacity=".8"/>' +
          "</g>";
      } else if (lit && k === "ox") {
        fire =
          '<g class="bz-fire">' +
          '<path d="M118 70 C132 56 156 54 174 70 C156 86 132 84 118 70 Z" fill="url(#' + uid + 'envo)" filter="url(#' + uid + 'soft)"/>' +
          '<path d="M118 70 C126 65 140 66 150 70 C140 74 126 75 118 70 Z" fill="url(#' + uid + 'hot)"/>' +
          '<path d="M118 70 C124 67 134 68 142 70 C134 72 124 73 118 70 Z" fill="#f4eeff" opacity=".85"/>' +
          "</g>";
      } else if (lit && k === "neutral") {
        fire =
          '<g class="bz-fire">' +
          '<path d="M118 70 C146 44 198 42 236 70 C198 98 146 96 118 70 Z" fill="url(#' + uid + 'env)" filter="url(#' + uid + 'soft)"/>' +
          '<path d="M118 70 C132 62 160 63 178 70 C160 77 132 78 118 70 Z" fill="url(#' + uid + 'cone)"/>' +
          '<path d="M118 70 C128 66 148 66 166 70 C148 74 128 74 118 70 Z" fill="#fff" opacity=".72"/>' +
          "</g>";
      }
      return (
        '<svg viewBox="0 0 320 140" width="320" height="140" aria-hidden="true">' +
        defs +
        '<rect x="8" y="58" width="78" height="24" rx="12" fill="#1a1a1a" stroke="#3a3a3a"/>' +
        '<rect x="22" y="64" width="16" height="12" rx="2" fill="#4a4a4a"/>' +
        '<rect x="82" y="60" width="22" height="20" fill="#6e4b24"/>' +
        '<polygon points="104,62 122,66 122,74 104,78" fill="#e0c27a" stroke="#6b4a22" stroke-width="0.8"/>' +
        fire +
        "</svg>"
      );
    }

    function rodArt() {
      const melted = feeding && heat() > 62;
      return (
        '<svg viewBox="0 0 168 22" width="168" height="22" aria-hidden="true">' +
        '<rect x="0" y="7" width="140" height="7" rx="2" fill="' + (alloyObj().ok ? "#d9d3c4" : "#c4a574") + '" stroke="#5c5648" stroke-width="0.7"/>' +
        '<circle cx="150" cy="10.5" r="' + (melted ? 6 : 4.5) + '" fill="' + (melted ? "#fff4c8" : "#eee8d8") + '" stroke="#6b4a22"/>' +
        "</svg>"
      );
    }

    function scene() {
      const hot = Math.max(heatL, heatR);
      const glow = Math.min(1, Math.max(0, (hot - 28) / 72));
      const filletOn = fillet > 4;
      const idFill = oxide > 20 ? "#120e0a" : "#c4784a";
      const idLabel = oxide > 20 ? "black scale" : n2ok() ? "clean ID" : "air in the tube";
      return (
        '<div class="bz-photo" id="bz-photo">' +
        '<img class="bz-bg" src="braze/joint.jpg" alt="Compressor stub with nitrogen hose" draggable="false" />' +
        '<div class="bz-heat" style="opacity:' + glow.toFixed(2) + ";background:radial-gradient(circle at 72% 48%," + copperColor(hot) + ",transparent 62%)\"></div>" +
        '<div class="bz-aim' + (hot > 55 ? " hot" : "") + '" id="bz-aim"></div>' +
        (filletOn
          ? '<svg class="bz-fillet" viewBox="0 0 80 80" aria-hidden="true" style="opacity:' + Math.min(1, fillet / 80).toFixed(2) + '">' +
            '<path d="M18 40 C28 18, 52 18, 62 40" fill="none" stroke="#f3efe4" stroke-width="' + (4 + fillet / 40).toFixed(1) + '" stroke-linecap="round"/>' +
            '<path d="M18 40 C28 62, 52 62, 62 40" fill="none" stroke="#c9b896" stroke-width="' + (3 + fillet / 50).toFixed(1) + '" stroke-linecap="round"/>' +
            "</svg>"
          : "") +
        (n2on
          ? '<span class="bz-flow' + (n2 > 5 ? " hard" : "") + '">' + (n2 > 5 ? "N₂ BLAST" : "N₂ " + n2.toFixed(1) + " scfh") + "</span>"
          : "") +
        '<button type="button" class="bz-spot n2' + (n2on ? " on" : "") + '" data-spot="n2">N₂ hose</button>' +
        (job.cores
          ? '<button type="button" class="bz-spot core' + (cores ? " on" : "") + '" data-spot="core">' + (cores ? "CORES OUT" : "PULL CORE") + "</button>"
          : "") +
        (job.rag
          ? '<button type="button" class="bz-spot rag' + (rag ? " on" : "") + '" data-spot="rag">' + (rag ? "WET RAG" : "RAG THE SHELL") + "</button>"
          : "") +
        '<div class="bz-tool torch' + (torch ? " lit" : "") + '" id="bz-torch-tool" style="left:' + flame.x + "%;top:" + flame.y + '%">' + torchArt() + "</div>" +
        '<div class="bz-tool rod' + (feeding ? " live" : "") + '" id="bz-rod-tool" style="left:' + rod.x + "%;top:" + rod.y + '%">' + rodArt() + "</div>" +
        '<aside class="bz-id"><b>INSIDE THE STUB</b><svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="' + idFill + '" stroke="#a8643a" stroke-width="10"/><circle cx="32" cy="32" r="11" fill="' + (oxide > 20 ? "#050505" : "#e7b089") + '"/></svg><span>' + idLabel + "</span></aside>" +
        '<p class="bz-read">tube ' + Math.round(heatL) + " · shell " + Math.round(heatR) + " · fillet " + Math.round(fillet) + "%</p>" +
        "</div>"
      );
    }

    function bindScene() {
      const el = host.querySelector("#bz-scene");
      if (!el) return;
      el.style.touchAction = "none";
      el.onpointerdown = function (e) {
        if (verdict) return;
        const tool = e.target.closest && e.target.closest(".bz-tool");
        if (tool && tool.id === "bz-torch-tool") {
          holding = "torch";
          torch = true;
          flame = photoPt(e);
          try { el.setPointerCapture(e.pointerId); } catch (_) {}
          return;
        }
        if (tool && tool.id === "bz-rod-tool") {
          holding = "rod";
          feeding = true;
          rod = photoPt(e);
          try { el.setPointerCapture(e.pointerId); } catch (_) {}
          return;
        }
        const p = photoPt(e);
        let hit = hitAt(p);
        const spot = e.target.closest && e.target.closest("[data-spot]");
        if (spot) {
          const kind = spot.getAttribute("data-spot");
          hit = kind === "rag" ? "valve" : kind;
        }
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
        if (p.x < 18 && p.y < 24 && job.rag) {
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
        const p = photoPt(e);
        if (holding === "torch") flame = p;
        if (holding === "rod") rod = p;
        if (holding === "rag" && hitAt(p) === "valve") {
          rag = true;
          holding = null;
          maybeGuide();
          paintChrome();
        }
      };
      el.onpointerup = function () {
        holding = null;
        syncPlay();
      };
      el.onpointercancel = function () {
        holding = null;
        syncPlay();
      };
    }

    function setN2(v) {
      n2 = v;
      const sl = host.querySelector("#bz-n2");
      if (sl) sl.value = String(v);
      const o = host.querySelector("#bz-n2o");
      if (o) o.textContent = v.toFixed(1) + " SCFH" + (v >= 2 && v <= 5 ? " · whisper" : "");
    }

    function nextMove() {
      if (verdict === "pass") {
        return { title: "That's a braze.", say: "Hit New joint and run it again.", act: "New joint", spot: "", go: function () { hardReset(true); } };
      }
      if (verdict === "fail") {
        return { title: "That joint failed.", say: msg, act: "New joint", spot: "", go: function () { hardReset(true); } };
      }
      if (job.cores && !cores) {
        return {
          title: "1. Pull the core",
          say: "Tap the gold PULL CORE button on the picture.",
          act: "Pull the core",
          spot: "core",
          go: function () {
            cores = true;
            msg = "Cores out. Wet rag next.";
            hub = "The seat can breathe. Nitrogen can flow.";
            maybeGuide();
            paintChrome();
          },
        };
      }
      if (job.rag && !rag) {
        return {
          title: "2. Wet rag on the shell",
          say: "Tap RAG THE SHELL. Keep the flame off the valve body.",
          act: "Put the rag on",
          spot: "rag",
          go: function () {
            rag = true;
            msg = "Rag is on. Nitrogen next.";
            hub = "Wet rag. Not on the joint.";
            maybeGuide();
            paintChrome();
          },
        };
      }
      if (!n2ok()) {
        return {
          title: "3. Turn nitrogen on",
          say: "Tap the N₂ hose. Flow stays at 3. Not oxygen. Not shop air.",
          act: "Nitrogen on",
          spot: "n2",
          go: function () {
            purge = "n2";
            n2on = true;
            setN2(3);
            msg = "Nitrogen is whispering through the tube. Clean the ring next.";
            hub = "2 to 5 on the flow. A blast blows the joint cold.";
            maybeGuide();
            paintChrome();
          },
        };
      }
      if (!sanded) {
        return {
          title: "4. Clean the ring",
          say: "Tap the gold ring on the copper. Bright metal. No oil.",
          act: "Clean the ring",
          spot: "aim",
          go: function () {
            sanded = true;
            msg = "Cup is bright. Light the torch.";
            hub = "Oil beads. Clean copper wets.";
            maybeGuide();
            paintChrome();
          },
        };
      }
      if (!torch && fillet >= 90) {
        return {
          title: "8. Torch off",
          say: "Nitrogen stays on until the copper goes dark. Don't light it again.",
          act: "Nitrogen stays",
          spot: "",
          go: function () {
            torch = false;
            feeding = false;
            msg = "Torch stays off. Nitrogen stays on while it cools.";
            hub = "If you kill the nitrogen now, the inside scales.";
            paintChrome();
          },
        };
      }
      if (!torch) {
        return {
          title: "5. Set the flame",
          say: "Acetylene under 15. Add oxygen until the inner cone is sharp and the feather is gone. Then light it.",
          act: "Light the torch",
          spot: "aim",
          go: function () {
            if (ace < 1) {
              msg = "Open the acetylene. Both tanks shut is not a flame.";
              hub = "Crack acetylene, light it, then add oxygen.";
              paintChrome();
              return;
            }
            torch = true;
            feeding = false;
            cooled = false;
            if (mixKind() === "neutral") flameOk = true;
            flame = { x: JOINT.cup.x, y: JOINT.cup.y };
            msg = mixKind() === "neutral"
              ? "Cone is sharp. Drag it around the ring. Both sides."
              : flameLine();
            hub = "Heat the copper. The rod waits.";
            paintChrome();
          },
        };
      }
      if (heatL < 70 || heatR < 70) {
        return {
          title: "6. Heat both sides",
          say: "Drag the torch around the gold ring. Left number and right number both over 70.",
          act: "Flame on the ring",
          spot: "aim",
          go: function () {
            torch = true;
            flame = { x: JOINT.cup.x, y: JOINT.cup.y };
            msg = "Cone is on the ring. Keep it there until both sides are cherry.";
            paintChrome();
          },
        };
      }
      if (fillet < 90) {
        return {
          title: "7. Touch the rod",
          say: "Copper is hot. Drag the silver rod onto the gold ring. The pipe melts the rod.",
          act: "Rod on the ring",
          spot: "aim",
          go: function () {
            feeding = true;
            torch = true;
            rod = { x: JOINT.cup.x, y: JOINT.cup.y };
            msg = "Rod is on the ring. Leave it until the fillet walks around.";
            hub = "Don't melt the rod in the flame and drip it.";
            paintChrome();
          },
        };
      }
      return {
        title: "8. Torch off",
        say: "Kill the torch. Leave the nitrogen on until the copper goes dark.",
        act: "Torch off",
        spot: "",
        go: function () {
          torch = false;
          feeding = false;
          msg = "Torch off. Nitrogen stays on while it cools.";
          hub = "If you kill the nitrogen now, the inside scales.";
          paintChrome();
        },
      };
    }

    function stopWatch() {
      if (watchTimer) clearTimeout(watchTimer);
      watchTimer = 0;
      watching = false;
    }

    function watchIt() {
      if (watching) return;
      stopWatch();
      hardReset(true);
      watching = true;
      msg = "Watch. Pull the core first.";
      hub = "Same seven moves. Then you do it.";
      paintChrome();
      const beats = [
        function () {
          cores = true;
          msg = "Watch. Core is out.";
        },
        function () {
          rag = true;
          msg = "Watch. Wet rag on the shell. Not on the joint.";
        },
        function () {
          purge = "n2";
          n2on = true;
          setN2(3);
          sanded = true;
          msg = "Watch. Nitrogen at 3. Ring is clean.";
        },
        function () {
          setFlame(5, 5);
          torch = true;
          flameOk = true;
          flame = { x: JOINT.L.x, y: JOINT.L.y };
          msg = "Watch. Acetylene at 5. Oxygen at 5. Sharp cone, no feather.";
        },
        function () {
          flame = { x: JOINT.R.x, y: JOINT.R.y };
          msg = "Watch. Now the shell side. Both sides get hot.";
        },
        function () {
          flame = { x: JOINT.cup.x, y: JOINT.cup.y };
          msg = "Watch. Keep the cone on the ring.";
        },
      ];
      let i = 0;
      function step() {
        if (!watching || verdict) return;
        if (i < beats.length) {
          beats[i]();
          i += 1;
          maybeGuide();
          paintChrome();
          watchTimer = setTimeout(step, 1000);
          return;
        }
        if (heatL < 72 || heatR < 72) {
          torch = true;
          flame = { x: JOINT.cup.x, y: JOINT.cup.y };
          msg = "Watch. Both sides have to pass 70.";
          paintChrome();
          watchTimer = setTimeout(step, 180);
          return;
        }
        if (fillet < 96) {
          feeding = true;
          torch = true;
          rod = { x: JOINT.cup.x, y: JOINT.cup.y };
          flame = { x: JOINT.cup.x, y: JOINT.cup.y };
          msg = "Watch. Cherry copper. Touch the rod. The pipe melts it.";
          paintChrome();
          watchTimer = setTimeout(step, 180);
          return;
        }
        torch = false;
        feeding = false;
        msg = "Watch. Torch off. Nitrogen stays until the copper is dark.";
        paintChrome();
      }
      watchTimer = setTimeout(step, 700);
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
        '<div class="bz-now" id="bz-now">' +
        '<strong id="bz-now-title">1. Pull the core</strong>' +
        '<p id="bz-now-say">Tap the gold PULL CORE button on the picture.</p>' +
        '<div class="bz-now-row">' +
        '<button type="button" class="btn primary" id="bz-do">Pull the core</button>' +
        '<button type="button" class="btn" id="bz-watch">Watch it first</button>' +
        "</div></div>" +
        '<div class="bz-bench" id="bz-bench">' +
        '<div class="bz-torch-face" id="bz-torch-face"></div>' +
        '<label class="ace"><span class="bz-dial" id="bz-dial-ace"></span>Acetylene<input id="bz-ace" type="range" min="0" max="15" step="0.5" value="0" /><output id="bz-aceo">0 psi</output></label>' +
        '<label class="oxy"><span class="bz-dial" id="bz-dial-oxy"></span>Oxygen<input id="bz-oxy" type="range" min="0" max="20" step="0.5" value="0" /><output id="bz-oxyo">0 psi</output></label>' +
        '<p class="bz-flame-say" id="bz-flame-say">Acetylene is shut. Nothing to light.</p>' +
        "</div>" +
        '<div class="bz-acts" hidden>' +
        '<button type="button" class="btn primary" id="bz-torch">Light torch</button>' +
        '<button type="button" class="btn" id="bz-feed">Hold rod</button>' +
        '<button type="button" class="btn" id="bz-off">Torch off</button>' +
        "</div>" +
        '<div class="bz-jobs" id="bz-jobs"></div>' +
        '<div class="bz-traps" id="bz-traps">' +
        '<div class="bz-jobs" id="bz-purge"></div>' +
        '<div class="bz-alloys" id="bz-alloys"></div>' +
        "</div>" +
        '<button type="button" class="btn bz-traps-btn" id="bz-show-traps">Show the wrong gases</button>' +
        '<div class="bz-coach" id="bz-coach" hidden></div>' +
        '<div class="bz-scene" id="bz-scene"></div>' +
        '<p class="bz-status" id="bz-status"></p>' +
        '<p class="bz-hub" id="bz-hubtalk"></p>' +
        '<div class="bz-sliders">' +
        '<label class="bz-n2">Nitrogen flow<input id="bz-n2" type="range" min="0" max="20" step="0.5" value="0" /><output id="bz-n2o">0 SCFH</output></label>' +
        "</div>" +
        '<p class="bz-hint" hidden>Drag the torch around the gold ring. Drag the rod onto it when both sides are hot.</p>' +
        "<style>" +
        "#braze-root .bz-photo{position:relative;width:min(100%,960px,calc(46vh * 16 / 9));max-width:100%;margin:8px auto;aspect-ratio:16/9;background:#111;border-radius:12px;overflow:hidden;touch-action:none}" +
        "#braze-root .bz-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;display:block;pointer-events:none}" +
        "#braze-root .bz-heat{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen}" +
        "#braze-root .bz-aim{position:absolute;left:60%;top:34%;width:24%;height:28%;border:2px dashed rgba(232,196,80,.85);border-radius:50%;pointer-events:none;z-index:2}" +
        "#braze-root .bz-aim.hot{border-style:solid;border-color:#ffb25a;box-shadow:0 0 18px #ff7a18}" +
        "#braze-root .bz-fillet{position:absolute;left:63%;top:34%;width:16%;height:28%;pointer-events:none;z-index:3;filter:drop-shadow(0 0 6px #fff6c8)}" +
        "#braze-root .bz-flow{position:absolute;left:28%;top:40%;z-index:3;color:#9fd7ff;font-size:12px;font-weight:800;text-shadow:0 1px 2px #000;pointer-events:none}" +
        "#braze-root .bz-flow.hard{color:#ffb4a8}" +
        "#braze-root .bz-id{position:absolute;left:8px;top:8px;z-index:4;background:rgba(12,16,20,.88);color:#f4efe6;border:1px solid #3a3228;border-radius:10px;padding:6px 8px;display:flex;align-items:center;gap:6px}" +
        "#braze-root .bz-id b{display:block;font-size:10px;letter-spacing:.06em;color:#e8c450}" +
        "#braze-root .bz-id span{display:block;font-size:11px}" +
        "#braze-root .bz-tool{position:absolute;z-index:5;cursor:grab;touch-action:none;user-select:none}" +
        "#braze-root .bz-tool.torch{width:min(280px,62%);height:auto;transform:translate(-48%,-50%)}" +
        "#braze-root .bz-tool.torch svg{width:100%;height:auto;display:block}" +
        "#braze-root .bz-tool.rod{width:min(168px,44%);height:auto;transform:translate(-96%,-50%)}" +
        "#braze-root .bz-tool.rod svg{width:100%;height:auto;display:block}" +
        "#braze-root .bz-spot{position:absolute;z-index:4;border:1px solid #e8c450;background:rgba(12,16,20,.82);color:#f4efe6;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700}" +
        "#braze-root .bz-spot.on{border-color:#7fd99a;color:#7fd99a}" +
        "#braze-root .bz-spot.n2{left:12%;top:36%}" +
        "#braze-root .bz-spot.core{left:4%;top:58%}" +
        "#braze-root .bz-spot.rag{right:6%;top:12%}" +
        "#braze-root .bz-read{position:absolute;left:8px;bottom:8px;margin:0;background:rgba(12,16,20,.8);color:#e8c450;border-radius:8px;padding:4px 8px;font-size:12px;font-weight:700}" +
        "#braze-root .bz-head{display:flex;align-items:center;gap:8px;padding:8px 12px 0}" +
        "#braze-root .brand-bar,#braze-root #bz-reset,#braze-root #bz-jobs,#braze-root .bz-traps,#braze-root .bz-traps-btn,#braze-root .bz-status,#braze-root .bz-hub,#braze-root .bz-sliders,#braze-root .bz-coach,#braze-root .bz-acts{display:none!important}" +
        "body:has(#screen-braze.active) .walk-chip,body:has(#screen-braze.active) .ld-replay,body:has(#screen-braze.active) .pf-coach{display:none!important}" +
        "body:has(#screen-braze.active) #drip-ear{top:8px!important;bottom:auto!important;left:auto!important;right:8px!important;width:min(168px,44vw)!important;max-height:44px!important;z-index:30!important}" +
        "body:has(#screen-braze.active) #toast-host{top:auto!important;bottom:8px!important;right:8px!important;left:auto!important;width:min(150px,42vw)!important;max-height:32px!important;overflow:hidden!important}" +
        "#braze-root .bz-now{margin:8px 12px 4px;padding:14px 16px;border:1px solid #e8c450;border-radius:14px;background:#1a160e}" +
        "#braze-root .bz-now strong{display:block;font-size:26px;color:#f6f1e6;line-height:1.15}" +
        "#braze-root .bz-now p{margin:6px 0 0;color:#e7d7b0;font-size:18px;line-height:1.35}" +
        "#braze-root .bz-now-row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}" +
        "#braze-root .bz-now .btn{min-height:52px;font-size:18px;padding:0 18px}" +
        "#braze-root .bz-photo{width:min(100% - 24px,980px);max-height:46vh}" +
        "#braze-root .bz-bench{margin:8px 12px;padding:10px 12px;border:1px solid #6d5b3c;border-radius:12px;background:#14110e;display:grid;grid-template-columns:1fr 1fr;gap:8px 12px}" +
        "#braze-root .bz-torch-face{grid-column:1 / -1;background:#0c0e12;border-radius:10px;min-height:150px;display:flex;align-items:center;justify-content:center;overflow:hidden}" +
        "#braze-root .bz-torch-face svg{width:min(100%,520px);height:auto;display:block}" +
        "#braze-root .bz-fire{transform-box:fill-box;transform-origin:0% 50%;animation:bz-flicker .14s ease-in-out infinite alternate}" +
        "@keyframes bz-flicker{from{transform:scale(1,1)}to{transform:scale(1.045,.94)}}" +
        "#braze-root .bz-torch-face.is-neutral{background:radial-gradient(circle at 68% 50%,#16324a,#0c0e12 72%)}" +
        "#braze-root .bz-torch-face.is-carb{background:radial-gradient(circle at 68% 50%,#16324a,#0c0e12 72%)}" +
        "#braze-root .bz-torch-face.is-ace{background:radial-gradient(circle at 68% 50%,#4a3a10,#0c0e12 72%)}" +
        "#braze-root .bz-torch-face.is-ox{background:radial-gradient(circle at 68% 50%,#123044,#0c0e12 72%)}" +
        "#braze-root .bz-bench label{display:flex;flex-direction:column;gap:2px;color:#f6f1e6;font-size:15px;font-weight:700}" +
        "#braze-root .bz-dial{display:block;height:96px}" +
        "#braze-root .bz-dial svg{width:100%;height:96px;display:block}" +
        "#braze-root .bz-bench output{font-weight:600;color:#e7d7b0;font-size:13px}" +
        "#braze-root .bz-bench input{width:100%;height:40px;accent-color:#c0392b}" +
        "#braze-root .bz-bench label.oxy input{accent-color:#2e9e4f}" +
        "#braze-root .bz-flame-say{grid-column:1 / -1;margin:0;color:#f6f1e6;font-size:16px;line-height:1.3}" +
        "#braze-root .bz-spot.pulse,#braze-root .bz-aim.pulse{animation:bz-pulse .7s ease-in-out infinite}" +
        "@keyframes bz-pulse{50%{box-shadow:0 0 0 8px rgba(232,196,80,.55)}}" +
        "</style>" +
        "</div>";

      host.querySelector("#bz-hub").onclick = function () { if (onHub) onHub(); };
      host.querySelector("#bz-reset").onclick = function () { stopWatch(); hardReset(); };
      host.querySelector("#bz-do").onclick = function () {
        if (watching) return;
        const move = nextMove();
        if (move.go) move.go();
        syncPlay();
      };
      host.querySelector("#bz-watch").onclick = function () { watchIt(); };
      host.querySelector("#bz-show-traps").onclick = function () {
        host.classList.toggle("show-traps");
        this.textContent = host.classList.contains("show-traps") ? "Hide the wrong gases" : "Show the wrong gases";
      };
      host.querySelector("#bz-n2").oninput = function () {
        n2 = +host.querySelector("#bz-n2").value;
        host.querySelector("#bz-n2o").textContent =
          n2.toFixed(1) + " SCFH" + (n2 >= 2 && n2 <= 5 ? " · whisper" : n2 > 5 ? " · TOO HARD" : "");
        if (n2 >= 2 && n2 <= 5 && window.LtHaptic) window.LtHaptic.tick();
        maybeGuide();
        paintChrome();
      };
      host.querySelector("#bz-ace").oninput = function () {
        setFlame(+host.querySelector("#bz-ace").value, oxy);
        maybeGuide();
        paintChrome();
      };
      host.querySelector("#bz-oxy").oninput = function () {
        setFlame(ace, +host.querySelector("#bz-oxy").value);
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
        holding = null;
        if (flame.x > 96 || flame.y > 96 || flame.x < 2 || flame.y < 2) flame = { x: JOINT.cup.x, y: JOINT.cup.y };
        if (window.LtHaptic) window.LtHaptic.kick();
        msg = "Flame is lit. Drag the inner cone into the ring — both sides of the cup.";
        hub = mixKind() === "neutral" ? "Heat the pipe. The rod waits until both sides are cherry." : "Fix the mix first. Neutral cone.";
        paintChrome();
        syncPlay(false);
      };
      host.querySelector("#bz-feed").onclick = function () {
        if (verdict) return;
        if (!torch) {
          feeding = false;
          msg = "Torch is off. Heat the joint before the rod.";
          hub = "The pipe melts the rod. You don't melt the rod and drip it.";
          paintChrome();
          syncPlay(false);
          sayMiss("rod", host.querySelector("#bz-rod-tool"), "Rod too early");
          return;
        }
        feeding = true;
        holding = null;
        if (rod.x > 96 || rod.y > 96 || rod.x < 2 || rod.y < 2) rod = { x: JOINT.L.x, y: 66 };
        if (window.LtHaptic) window.LtHaptic.tick();
        msg = heatL >= 70 && heatR >= 70 ? "Drag the rod onto the cherry cup." : "Not yet. Both sides cherry, then the rod.";
        paintChrome();
        syncPlay(false);
      };
      host.querySelector("#bz-off").onclick = function () {
        if (verdict) return;
        torch = false;
        feeding = false;
        holding = null;
        if (badGas) {
          msg = badGas === "air"
            ? "Shop air was on that joint with the torch lit. That braze stays a fail."
            : "Oxygen was on that joint with the torch lit. That braze stays a fail.";
          hub = "Nitrogen has to be flowing the whole time. Switching the hose later does not save it.";
        } else if (fillet >= 90) {
          msg = "Torch off. Keep nitrogen on until the copper is dark.";
          hub = "Oxide forms on the way down if you kill the nitrogen.";
        } else {
          msg = "Torch off. The cup is cooling. Keep N₂ on until it's dark.";
          hub = "Oxide forms on the way down too if you kill the nitrogen.";
        }
        paintChrome();
        syncPlay(false);
      };
      mounted = true;
      paintChrome();
      paintDials();
      bindScene();
      syncPlay();
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
      const move = nextMove();
      stepStamp = watching ? "watch" : move.title + "\n" + move.act;
      const title = host.querySelector("#bz-now-title");
      const say = host.querySelector("#bz-now-say");
      const go = host.querySelector("#bz-do");
      const watch = host.querySelector("#bz-watch");
      if (title) title.textContent = watching ? "Watching the braze" : move.title;
      if (say) say.textContent = watching ? msg : move.say;
      if (go) {
        go.textContent = watching ? "Watching…" : move.act;
        go.disabled = !!watching;
      }
      if (watch) {
        watch.textContent = watching ? "Watching…" : "Watch it first";
        watch.disabled = !!watching;
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
      const face = host.querySelector("#bz-torch-face");
      if (face) {
        const mark = (torch ? "1" : "0") + mixKind() + ":" + ace + ":" + oxy;
        if (face.dataset.flame !== mark) {
          face.dataset.flame = mark;
          const k = ace < 1 ? "off" : oxy < 0.5 ? "ace" : mixKind();
          face.className = "bz-torch-face is-" + k;
          face.innerHTML = torchArt(ace >= 1);
        }
      }
      const el = host.querySelector("#bz-scene");
      if (!el) return;
      const photo = el.querySelector("#bz-photo");
      if (!photo || photo.dataset.job !== job.id) {
        el.innerHTML = scene();
        const built = el.querySelector("#bz-photo");
        if (built) built.dataset.job = job.id;
        bindScene();
        return;
      }
      const hot = Math.max(heatL, heatR);
      const glow = photo.querySelector(".bz-glow");
      if (glow) glow.style.opacity = String(Math.min(1, Math.max(0, (hot - 28) / 72)));
      let filletEl = photo.querySelector(".bz-fillet");
      if (fillet > 4) {
        if (!filletEl) {
          filletEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          filletEl.setAttribute("class", "bz-fillet");
          filletEl.setAttribute("viewBox", "0 0 80 80");
          filletEl.setAttribute("aria-hidden", "true");
          filletEl.innerHTML =
            '<path d="M18 40 C28 18, 52 18, 62 40" fill="none" stroke="#f3efe4" stroke-linecap="round"/>' +
            '<path d="M18 40 C28 62, 52 62, 62 40" fill="none" stroke="#c9b896" stroke-linecap="round"/>';
          photo.appendChild(filletEl);
        }
        filletEl.style.opacity = String(Math.min(1, fillet / 80));
        const paths = filletEl.querySelectorAll("path");
        if (paths[0]) paths[0].setAttribute("stroke-width", (4 + fillet / 40).toFixed(1));
        if (paths[1]) paths[1].setAttribute("stroke-width", (3 + fillet / 50).toFixed(1));
      } else if (filletEl) {
        filletEl.remove();
      }
      const torchEl = photo.querySelector("#bz-torch-tool");
      if (torchEl) {
        torchEl.style.left = flame.x + "%";
        torchEl.style.top = flame.y + "%";
        torchEl.classList.toggle("lit", !!torch);
        const mark = (torch ? "1" : "0") + mixKind() + ":" + ace + ":" + oxy;
        if (torchEl.dataset.flame !== mark) {
          torchEl.dataset.flame = mark;
          torchEl.innerHTML = torchArt();
        }
      }
      const rodEl = photo.querySelector("#bz-rod-tool");
      if (rodEl) {
        rodEl.style.left = rod.x + "%";
        rodEl.style.top = rod.y + "%";
        rodEl.classList.toggle("live", !!feeding);
        const label = rodEl.querySelector("b");
        if (label) label.textContent = alloyObj().ok ? "15% ROD" : "ROD";
      }
      const n2btn = photo.querySelector(".bz-spot.n2");
      if (n2btn) n2btn.classList.toggle("on", !!n2on);
      const coreBtn = photo.querySelector(".bz-spot.core");
      if (coreBtn) {
        coreBtn.classList.toggle("on", !!cores);
        coreBtn.textContent = cores ? "CORES OUT" : "PULL CORE";
      }
      const ragBtn = photo.querySelector(".bz-spot.rag");
      if (ragBtn) {
        ragBtn.classList.toggle("on", !!rag);
        ragBtn.textContent = rag ? "RAG ON" : "WET RAG";
      }
      const read = photo.querySelector(".bz-read");
      if (read) {
        read.textContent = "L " + Math.round(heatL) + " · R " + Math.round(heatR) + " · fillet " + Math.round(fillet) + "%" + (oxide > 20 ? " · SCALE" : n2ok() ? " · N₂ CLEAN" : "");
      }
      const aim = photo.querySelector(".bz-aim");
      if (aim) aim.classList.toggle("hot", heatL >= 70 && heatR >= 70);
      const move = watching ? null : nextMove();
      const spot = watching
        ? (!cores && job.cores ? "core" : job.rag && !rag ? "rag" : !n2ok() ? "n2" : "aim")
        : (move && move.spot) || "";
      photo.querySelectorAll(".bz-spot").forEach(function (b) {
        b.classList.toggle("pulse", b.getAttribute("data-spot") === spot);
      });
      if (aim) aim.classList.toggle("pulse", spot === "aim");
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
      mix = 0;
      ace = 0;
      oxy = 0;
      flameOk = false;
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
      filletPopped = false;
      coachShown = "";
      missKey = "";
      flame = { x: JOINT.cup.x, y: JOINT.cup.y };
      rod = { x: JOINT.L.x, y: 66 };
      msg = job.cores ? "Tap the schrader. Cores out first." : job.rag ? "Rag the body. Then nitrogen." : "Sand the cup. Then nitrogen.";
      hub = job.say;
      skipJobSteps();
      const sl = host.querySelector("#bz-n2");
      if (sl) sl.value = "0";
      const o = host.querySelector("#bz-n2o");
      if (o) o.textContent = "0 SCFH";
      const mx = host.querySelector("#bz-ace");
      if (mx) setFlame(0, 0);
      paintChrome();
      syncPlay();
    }

    mount();
    timer = setInterval(tick, 80);
    return {
      stop: function () {
        clearInterval(timer);
        if (watchTimer) clearTimeout(watchTimer);
        watching = false;
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
