/* Flaring sim — nut first, square cut, deburr, projection A, eccentric 45°. */
(function (global) {
  "use strict";

  const SIZES = [
    { id: "14", name: "1/4″", od: "6.35 mm", r22: [0.7, 1.3], r410: [1.3, 1.7] },
    { id: "38", name: "3/8″", od: "9.52 mm", r22: [1.0, 1.5], r410: [1.5, 2.0] },
    { id: "12", name: "1/2″", od: "12.7 mm", r22: [1.0, 1.5], r410: [1.6, 2.2] },
    { id: "58", name: "5/8″", od: "15.88 mm", r22: [1.5, 2.0], r410: [2.0, 2.5] },
  ];

  function FlareLab(host, opts) {
    host.style.position = "absolute";
    host.style.inset = "0";
    host.style.overflow = "auto";
    host.style.webkitOverflowScrolling = "touch";
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let size = SIZES[0];
    let ref = "r410";
    let a = 0.4;
    let torque = 8;
    let st = resetState();
    let msg = "Nut on the tube before you cut. That's the whole class.";
    let hub = "Forget the nut and you recut. Every time.";
    let lastPass = false;
    const NUT_FIRST = "Slide the flare nut onto the tube before you flare. You cannot put it on after.";
    let coachLine = NUT_FIRST;
    let playMark = null;
    let watchTimer = 0;
    let watching = false;
    let showTools = false;

    function stopWatch() {
      if (watchTimer) clearTimeout(watchTimer);
      watchTimer = 0;
      watching = false;
    }

    function gasName() {
      return ref === "r410" ? "R-410A" : "R-22";
    }

    function nextMove() {
      if (st.verdict === "pass") {
        return { title: "That's a flare.", say: "Nut was on first. A and the torque were on the chart.", act: "New tube", spot: "", go: "reset" };
      }
      if (st.nutBehind || st.cracked) {
        return { title: "That flare failed.", say: msg, act: "New tube", spot: "", go: "reset" };
      }
      if (!st.nut) return { title: "1. Slide the nut on", say: "Tap the gold nut. You cannot put it on after the flare.", act: "Slide the nut on", spot: "nut", go: "nut" };
      if (!st.cut) return { title: "2. Cut it square", say: "Tap the cutter. One wheel. Don't crush the tube.", act: "Cut it square", spot: "cut", go: "cut" };
      if (!st.deburr) return { title: "3. Deburr the inside", say: "Tap the reamer. Shavings left inside are a restriction.", act: "Deburr the ID", spot: "deburr", go: "deburr" };
      if (!st.clamp) return { title: "4. Clamp it in the bar", say: "Tap the bar. The nut stays in front of the block.", act: "Clamp it", spot: "clamp", go: "clamp" };
      if (!st.flared || st.verdict === "fail") {
        const band = target();
        return {
          title: "5. Set A, then the cone",
          say: size.name + " " + gasName() + " projection A is " + band[0].toFixed(1) + "–" + band[1].toFixed(1) + " mm. Then make the 45°.",
          act: "Make the 45°",
          spot: "flare",
          go: "flare",
        };
      }
      const chart = spec();
      return {
        title: "6. Torque to the chart",
        say: size.name + " chart is " + chart[0] + "–" + chart[1] + " ft-lb. Not good and tight.",
        act: "Torque it",
        spot: "torque",
        go: "torque",
      };
    }

    function watchIt() {
      if (watching) return;
      stopWatch();
      st = resetState();
      const bandA = target();
      const bandT = spec();
      a = Math.round(((bandA[0] + bandA[1]) / 2) * 10) / 10;
      torque = Math.round((bandT[0] + bandT[1]) / 2);
      watching = true;
      msg = "Watch. Slide the nut on before the cutter touches the tube.";
      hub = "Same six moves. Then you do it.";
      coachLine = msg;
      paint();
      const beats = [
        function () {
          st.nut = true;
          msg = "Watch. Nut is on the tube, in front of the block.";
        },
        function () {
          st.cut = true;
          st.square = true;
          msg = "Watch. Square cut. One wheel. Don't crush it.";
        },
        function () {
          st.deburr = true;
          msg = "Watch. Inside is clean. A ridge would be a restriction.";
        },
        function () {
          st.clamp = true;
          msg = "Watch. Clamped. The nut is still in front of the bar.";
        },
        function () {
          msg = "Watch. Projection A is " + a.toFixed(1) + " mm. Target " + bandA[0].toFixed(1) + "–" + bandA[1].toFixed(1) + ".";
        },
        function () {
          st.flared = true;
          st.ridge = false;
          st.short = false;
          st.long = false;
          st.cracked = false;
          st.verdict = null;
          msg = "Watch. Even 45°. Not paper-thin. Not cracked.";
        },
        function () {
          st.verdict = "pass";
          msg = "Watch. " + torque + " ft-lb is on the chart (" + bandT[0] + "–" + bandT[1] + "). That's a flare.";
          hub = "New tube. You set A and the torque. The chart is not a feeling.";
          watching = false;
        },
      ];
      let i = 0;
      function step() {
        if (!watching) return;
        if (i >= beats.length) return;
        beats[i]();
        i += 1;
        coachLine = msg;
        paint();
        if (watching) watchTimer = setTimeout(step, 900);
      }
      watchTimer = setTimeout(step, 700);
    }

    function expectedAct() {
      if (st.nutBehind || st.cracked) return "reset";
      if (!st.nut) return "nut";
      if (!st.cut) return "cut";
      if (!st.deburr) return "deburr";
      if (!st.clamp) return "clamp";
      if (!st.flared || st.verdict === "fail") return "flare";
      if (st.verdict !== "pass") return "torque";
      return "";
    }

    function armPlay(act, mode, line) {
      playMark = { act: act, mode: mode, line: line || "" };
    }

    function flushPlay() {
      const PF = window.PlayFeel;
      const mark = playMark;
      playMark = null;
      if (!PF) return;
      PF.coach(document.body, coachLine);
      if (!mark || !mark.mode) return;
      const el = host.querySelector('[data-act="' + mark.act + '"]') || host.querySelector("#fl-reset") || host;
      if (mark.mode === "bad") {
        PF.deny(el);
        PF.pop(el, mark.line || "Not yet", "bad");
      } else if (mark.mode === "ok") {
        PF.bump(el);
        PF.pop(el, st.verdict === "pass" ? "Pass" : "Good", "ok");
      }
    }

    function resetState() {
      return {
        nut: false,
        cut: false,
        square: true,
        deburr: false,
        clamp: false,
        flared: false,
        nutBehind: false,
        cutBeforeNut: false,
        cracked: false,
        short: false,
        long: false,
        ridge: false,
        verdict: null,
      };
    }

    function target() {
      return ref === "r410" ? size.r410 : size.r22;
    }

    function spec() {
      if (size.id === "14") return [10, 13];
      if (size.id === "38") return [24, 30];
      if (size.id === "12") return [36, 45];
      return [46, 58];
    }

    function finishPlay(act, mode, popText) {
      if (act === "reset") {
        coachLine = NUT_FIRST;
        playMark = null;
      } else if (mode === "bad") {
        coachLine = msg;
        armPlay(act, "bad", popText || "Not yet");
      } else if (act) {
        const nxt = expectedAct();
        const words = {
          nut: "Slide the flare nut on before anything else.",
          cut: "Cut it square.",
          deburr: "Deburr the inside of the tube.",
          clamp: "Clamp it in the bar. The nut stays in front.",
          flare: "Set projection A, then make the 45° flare.",
          torque: "Torque it to the chart. Not 'good and tight.'",
          reset: "New tube. Nut on first.",
        };
        coachLine = words[nxt] || "That's a flare. New tube when you want another rep.";
        armPlay(act, "ok", coachLine);
      }
      return paint();
    }

    function doAct(act) {
      if (act === "reset") stopWatch();
      else if (watching) return;
      lastPass = false;
      if (act === "nut") {
        if (st.flared) {
          msg = "Too late. The flare is already formed. The nut will not pass it. New tube.";
          hub = "Nut goes on before the block closes. Always.";
          return finishPlay(act, "bad", "Nut first");
        }
        if (st.clamp) {
          st.nutBehind = true;
          st.nut = false;
          st.verdict = "fail";
          msg = "The block is already closed. That nut is behind the block. New tube. Nut on first.";
          hub = "Slide the nut on, then cut, then deburr, then the bar.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Nut first");
        }
        st.nut = true;
        st.nutBehind = false;
        msg = "Flare nut is on the tube, in front of the block. Now cut square.";
        hub = "R-410A nut is fatter than R-22. Don't grab the old 24 mm on a 1/2″ 410A.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return finishPlay(act, "ok");
      }
      if (act === "cut") {
        if (!st.nut || st.nutBehind) {
          st.cutBeforeNut = true;
          st.cut = false;
          msg = "You cut before the nut was on. Nut on the tube first, then cut.";
          hub = "Nut on first. Then cut. Then deburr. Then the bar.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Nut first");
        }
        st.cut = true;
        st.square = true;
        st.flared = false;
        st.verdict = null;
        st.cracked = st.short = st.long = st.ridge = false;
        st.clamp = false;
        st.deburr = false;
        st.cutBeforeNut = false;
        msg = "Square cut. Deburr the ID next. Copper shavings left inside are future restrictions.";
        hub = "Cutter. One wheel. Don't crush the tube.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return finishPlay(act, "ok");
      }
      if (act === "deburr") {
        if (!st.cut) {
          msg = "Nothing to deburr. Cut first.";
          hub = "Order of operations. Like charging — don't skip.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Cut first");
        }
        st.deburr = true;
        msg = "ID is clean. Clamp in the bar. Set projection A for " + size.name + " " + (ref === "r410" ? "R-410A" : "R-22") + ".";
        hub = "R-410A A is a hair longer than R-22. Wrong die, wrong height, leak.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return finishPlay(act, "ok");
      }
      if (act === "clamp") {
        if (!st.cut || !st.deburr) {
          msg = !st.cut ? "Cut the tube before the block." : "Deburr before the block. A ridge becomes a leak.";
          hub = "Nut, cut, deburr, then the bar.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", !st.cut ? "Cut first" : "Deburr");
        }
        if (!st.nut || st.nutBehind) {
          st.clamp = true;
          st.nutBehind = true;
          st.verdict = "fail";
          msg = "You closed the block with the nut behind it. New tube. Nut on first.";
          hub = "The nut has to be on the tube before the bar closes.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Nut first");
        }
        st.clamp = true;
        msg = "Tube is in the bar. Nut is in front of the block. Set A, then the 45° cone.";
        hub = "Yoke centered. If the cone walks you get an oval and a callback.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return finishPlay(act, "ok");
      }
      if (act === "flare") {
        if (st.cracked || st.nutBehind) {
          msg = st.nutBehind
            ? "Nut is behind the block. New tube. Nut on first."
            : "That 45° is cracked. New tube. Nut on first.";
          hub = "A cracked flare is a recut. Another turn of the cone will not heal it.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", st.nutBehind ? "Nut first" : "Cracked");
        }
        if (!st.clamp) {
          msg = "Clamp it in the flaring bar first.";
          hub = "Freehand flaring is not a 45° pass.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Clamp first");
        }
        if (!st.nut) {
          st.flared = true;
          st.nutBehind = true;
          st.verdict = "fail";
          lastPass = false;
          msg = "Flare made with the nut behind the block. That nut never reaches the seat. New tube.";
          hub = "Slide the nut on FIRST. Then cut. Then deburr. Then the block.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Nut first");
        }
        const [lo, hi] = target();
        st.flared = true;
        st.ridge = !st.deburr;
        st.short = a < lo - 0.05;
        st.long = a > hi + 0.05;
        st.cracked = st.long && a > hi + 0.4;
        st.verdict = null;
        lastPass = false;
        if (st.ridge || st.short || st.long || st.cracked) {
          st.verdict = "fail";
          let pop = "Not 45";
          if (st.ridge) {
            msg = "Ridge left on the ID. Deburr before the 45° flare.";
            hub = "Deburr. No burr, no excuses.";
            pop = "Deburr";
          } else if (st.cracked) {
            msg = "Cracked flare. The wall is paper. That is not a 45°. New tube.";
            hub = "A is millimeters, not feelings.";
            pop = "Cracked";
          } else if (st.short) {
            msg = "A too short. Seat is skinny. Set A between " + lo.toFixed(1) + " and " + hi.toFixed(1) + " mm and flare again.";
            hub = "Clutch-type: tube should stick out " + lo.toFixed(1) + "–" + hi.toFixed(1) + " mm.";
            pop = "Check A";
          } else {
            msg = "A a little long. Thin at the rim. Bring A into " + lo.toFixed(1) + "–" + hi.toFixed(1) + " mm and flare again.";
            hub = "Target " + lo.toFixed(1) + "–" + hi.toFixed(1) + " mm.";
            pop = "Check A";
          }
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", pop);
        }
        msg = "45° seat is even. Nut is in front of the block. Torque it to the chart.";
        hub = "Chart for " + size.name + " is " + spec()[0] + "–" + spec()[1] + " ft-lb. Not 'good and tight.'";
        if (window.LtHaptic) window.LtHaptic.tick();
        return finishPlay(act, "ok");
      }
      if (act === "torque") {
        if (!st.flared || st.verdict === "fail" || st.nutBehind || st.cracked || st.ridge || st.short || st.long) {
          st.verdict = "fail";
          lastPass = false;
          msg = st.nutBehind
            ? "Nut is behind the block. Torque will not save it. New tube."
            : st.cracked
              ? "That flare is already cracked. New tube."
              : "Make a clean 45° flare before you torque. A bad seat does not pass.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", st.nutBehind ? "Nut first" : st.cracked ? "Cracked" : "Not 45");
        }
        const already = st.verdict === "pass";
        const band = spec();
        if (torque > band[1]) {
          st.cracked = true;
          st.verdict = "fail";
          lastPass = false;
          msg = "Over-torqued at " + torque + " ft-lb. The 45° cracked. New tube.";
          hub = "Chart is " + band[0] + "–" + band[1] + " ft-lb for " + size.name + ".";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Too tight");
        }
        if (torque < band[0]) {
          st.verdict = null;
          lastPass = false;
          msg = "Under-torqued at " + torque + " ft-lb. It will leak. Come up to the chart.";
          hub = "Come up to " + band[0] + "–" + band[1] + " ft-lb. Don't reef it past the chart.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return finishPlay(act, "bad", "Too loose");
        }
        st.verdict = "pass";
        lastPass = true;
        msg = "Torque " + torque + " ft-lb is on the chart. Nut is on the 45°. That's a pass.";
        hub = "Soap it on the nitrogen test. A cracked flare from here is a recut.";
        if (onXp && !already) onXp(20);
        if (window.CurriculumTrain && !already) window.CurriculumTrain.stamp("flare");
        if (window.LtHaptic) window.LtHaptic.land();
        if (global.LtDrip && !already && ref === "r410") global.LtDrip.say("charge.frac");
        return finishPlay(act, "ok");
      }
      if (act === "reset") {
        st = resetState();
        msg = "Fresh stick. Nut first.";
        hub = "Same tube size. Don't get cocky.";
        return finishPlay(act, "reset");
      }
    }

    function hexPts(cx, cy, r) {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const ang = Math.PI / 6 + (i * Math.PI) / 3;
        pts.push((cx + Math.cos(ang) * r).toFixed(1) + "," + (cy + Math.sin(ang) * r).toFixed(1));
      }
      return pts.join(" ");
    }

    function svg() {
      const band = target();
      const aPx = Math.max(10, Math.min(78, a * 18));
      const face = 392;
      const tubeEnd = st.clamp ? face + (st.flared ? 6 : aPx) : 500;
      const cy = 168;
      const od = size.id === "14" ? 16 : size.id === "38" ? 20 : size.id === "12" ? 24 : 28;
      const wall = Math.max(4, Math.round(od * 0.28));
      const nutR = ref === "r410" ? od + 8 : od + 4;
      let nutX = 118;
      if (st.nutBehind) nutX = Math.min(560, tubeEnd + nutR + 8);
      else if (st.flared && st.nut) nutX = face - nutR + 6;
      else if (st.nut) nutX = 168;
      const tubeW = Math.max(48, tubeEnd - 40);
      const lip = st.cracked || st.long ? od + 22 : st.short ? od + 6 : od + 14;
      const rim = st.cracked || st.long ? 1.6 : st.short ? 7 : 4.2;
      const bell = st.flared
        ? '<path d="M' + face + " " + (cy - (od - wall)) + " L" + (face + 34) + " " + (cy - lip) + '" fill="none" stroke="#c4784a" stroke-width="' + rim + '" stroke-linecap="round"/>' +
          '<path d="M' + face + " " + (cy + (od - wall)) + " L" + (face + 34) + " " + (cy + lip) + '" fill="none" stroke="#c4784a" stroke-width="' + rim + '" stroke-linecap="round"/>' +
          '<path d="M' + (face + 34) + " " + (cy - lip) + " L" + (face + 34) + " " + (cy + lip) + '" fill="none" stroke="#e7b089" stroke-width="' + Math.max(1.2, rim * 0.7) + '"/>' +
          (st.cracked ? '<path d="M' + (face + 8) + " " + (cy - lip + 8) + " L" + (face + 30) + " " + (cy - 4) + '" stroke="#fff" stroke-width="1.6"/>' : "") +
          (st.ridge ? '<circle cx="' + face + '" cy="' + (cy - (od - wall)) + '" r="4" fill="#1a120c"/>' : "")
        : "";
      const burr = st.cut && !st.deburr && !st.flared
        ? '<circle cx="' + tubeEnd + '" cy="' + (cy - od + 3) + '" r="3.5" fill="#1a120c"/>' +
          '<circle cx="' + tubeEnd + '" cy="' + (cy + od - 3) + '" r="3.5" fill="#1a120c"/>'
        : "";
      const bar = st.clamp
        ? '<rect x="312" y="78" width="80" height="' + (cy - od - 78) + '" rx="2" fill="#9aa3ab" stroke="#5c656d"/>' +
          '<rect x="312" y="' + (cy + od) + '" width="80" height="' + (250 - cy - od) + '" rx="2" fill="#9aa3ab" stroke="#5c656d"/>' +
          '<path d="M392 ' + (cy - od) + " L430 " + cy + " L392 " + (cy + od) + ' Z" fill="#1a1e22"/>' +
          '<path d="M338 86 H392 M338 70 H470 V96" fill="none" stroke="#4a5258" stroke-width="7" stroke-linejoin="round"/>' +
          '<rect x="400" y="70" width="8" height="28" fill="#d5d0c6"/>' +
          (st.flared ? '<polygon points="404,' + (cy - 16) + " 446," + cy + " 404," + (cy + 16) + '" fill="#e4e0d6" stroke="#6a655c"/>' : "")
        : "";
      const inBand = a >= band[0] && a <= band[1];
      const dim = st.clamp
        ? '<line x1="' + face + '" y1="58" x2="' + tubeEnd + '" y2="58" stroke="' + (inBand ? "#e8c450" : "#F43F5E") + '" stroke-width="1.5"/>' +
          '<text id="fl-a-label" x="' + (face + 4) + '" y="50" fill="' + (inBand ? "#e8c450" : "#F43F5E") + '" font-size="14" font-weight="700" font-family="system-ui">A = ' + a.toFixed(1) + " mm</text>"
        : '<text id="fl-a-label" x="40" y="48" fill="#e8c450" font-size="14" font-weight="700" font-family="system-ui">A = ' + a.toFixed(1) + " mm · target " + band[0].toFixed(1) + "–" + band[1].toFixed(1) + "</text>";
      return (
        '<svg class="fl-vis" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid meet" role="img" style="width:100%;max-width:100%;height:auto;display:block;margin:8px auto">' +
        '<rect width="640" height="300" rx="12" fill="#10161c"/>' +
        dim +
        '<text x="40" y="28" fill="#8b98a5" font-size="12" font-family="system-ui">' +
        size.name + " tube · " + (ref === "r410" ? "R-410A nut" : "R-22 nut") + " · clutch bar · 45° cone" +
        "</text>" +
        bar +
        '<rect x="40" y="' + (cy - od) + '" width="' + tubeW + '" height="' + od * 2 + '" rx="2" fill="#b87333"/>' +
        '<rect x="40" y="' + (cy - od + wall) + '" width="' + Math.max(8, tubeW - 2) + '" height="' + (od - wall) * 2 + '" fill="#6a341c"/>' +
        '<rect x="40" y="' + (cy - od + 3) + '" width="' + tubeW + '" height="4" fill="#f0c9a0" opacity=".5"/>' +
        burr +
        bell +
        '<polygon points="' + hexPts(nutX, cy, nutR) + '" fill="#d7b56a" stroke="#6b4a22" stroke-width="2"/>' +
        '<circle cx="' + nutX + '" cy="' + cy + '" r="' + (od - 2) + '" fill="#6a341c"/>' +
        (st.nutBehind ? '<text x="' + (nutX - 20) + '" y="' + (cy + nutR + 16) + '" fill="#F43F5E" font-size="11" font-family="system-ui">nut behind the block</text>' : "") +
        "</svg>"
      );
    }

    function paint() {
      const brand = (window.LtBrand && window.LtBrand.mark) || "HA";
      const org = (window.LtBrand && window.LtBrand.org) || "HVAC Allstars";
      const move = nextMove();
      const showA = move.go === "flare";
      const showTq = move.go === "torque";
      const spotLabel = { nut: "Nut", cut: "Cut", deburr: "Deburr", clamp: "Bar", flare: "Cone", torque: "Wrench" };
      const spot = move.spot
        ? '<button type="button" class="fl-spot pulse ' + move.spot + '" data-spot="' + move.go + '">' + spotLabel[move.spot] + "</button>"
        : "";
      host.classList.toggle("show-tools", showTools);
      host.innerHTML =
        '<div class="fl-lab">' +
        '<header class="fl-head">' +
        '<button type="button" class="btn" id="fl-hub">Shop floor</button>' +
        '<div class="brand-bar"><div class="brand-mark">' + brand +
        '</div><div class="brand-word"><strong>' + org +
        "</strong><span>Flaring lab · nut · cut · deburr · A · 45°</span></div></div>" +
        '<button type="button" class="btn" id="fl-reset">New tube</button></header>' +
        '<div class="fl-now" id="fl-now">' +
        "<strong>" + move.title + "</strong>" +
        "<p>" + move.say + "</p>" +
        '<div class="fl-now-row">' +
        '<button type="button" class="btn primary" id="fl-do"' + (watching ? " disabled" : "") + ">" + (watching ? "Watching…" : move.act) + "</button>" +
        '<button type="button" class="btn" id="fl-watch">Watch it first</button>' +
        "</div></div>" +
        (showA
          ? '<label class="fl-a">Projection A <input id="fl-range" type="range" min="0" max="35" value="' + Math.round(a * 10) + '" /><output id="fl-aout">' + a.toFixed(1) + " mm</output></label>"
          : "") +
        (showTq
          ? '<label class="fl-a">Torque <input id="fl-torque" type="range" min="5" max="70" value="' + torque + '" /><output id="fl-tq">' + torque + " ft-lb</output><span>chart " + spec()[0] + "–" + spec()[1] + " ft-lb</span></label>"
          : "") +
        '<div class="fl-scene">' + svg() + spot + "</div>" +
        '<p class="fl-status' + (st.verdict === "pass" ? " good" : st.verdict === "fail" ? " bad" : "") + '">' + msg + "</p>" +
        '<div class="fl-pick">' +
        SIZES.map(function (z) {
          return '<button type="button" class="fl-size' + (size.id === z.id ? " on" : "") + '" data-size="' + z.id + '">' + z.name + "</button>";
        }).join("") +
        '<button type="button" class="fl-size' + (ref === "r410" ? " on" : "") + '" data-ref="r410">R-410A / R-32</button>' +
        '<button type="button" class="fl-size' + (ref === "r22" ? " on" : "") + '" data-ref="r22">R-22</button></div>' +
        '<button type="button" class="btn fl-tools-btn" id="fl-tools">' + (showTools ? "Hide the other tools" : "Show the other tools") + "</button>" +
        '<div class="fl-acts">' +
        '<button type="button" class="btn' + (st.nut && !st.nutBehind ? " done" : "") + (expectedAct() === "nut" ? " primary" : "") + '" data-act="nut">1 · Nut on first</button>' +
        '<button type="button" class="btn' + (st.cut ? " done" : "") + (expectedAct() === "cut" ? " primary" : "") + '" data-act="cut">2 · Square cut</button>' +
        '<button type="button" class="btn' + (st.deburr ? " done" : "") + (expectedAct() === "deburr" ? " primary" : "") + '" data-act="deburr">3 · Deburr ID</button>' +
        '<button type="button" class="btn' + (st.clamp && !st.nutBehind ? " done" : "") + (expectedAct() === "clamp" ? " primary" : "") + '" data-act="clamp">4 · Clamp in bar</button>' +
        '<button type="button" class="btn' + (st.flared && st.verdict !== "fail" ? " done" : "") + (expectedAct() === "flare" ? " primary" : "") + '" data-act="flare">5 · 45° flare</button>' +
        '<button type="button" class="btn' + (st.verdict === "pass" ? " done" : "") + (expectedAct() === "torque" ? " primary" : "") + '" data-act="torque">6 · Torque to chart</button>' +
        "</div></div>" +
        "<style>" +
        "#flare-root .fl-head{display:flex;align-items:center;gap:8px;padding:8px 12px 0}" +
        "#flare-root .brand-bar{display:none!important}" +
        "#flare-root .fl-now{margin:8px 12px 4px;padding:14px 16px;border:1px solid #e8c450;border-radius:14px;background:#1a160e}" +
        "#flare-root .fl-now strong{display:block;font-size:26px;color:#f6f1e6;line-height:1.15}" +
        "#flare-root .fl-now p{margin:6px 0 0;color:#e7d7b0;font-size:18px;line-height:1.35}" +
        "#flare-root .fl-now-row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}" +
        "#flare-root .fl-now .btn{min-height:52px;font-size:18px;padding:0 18px}" +
        "#flare-root .fl-a{display:flex;flex-direction:column;gap:4px;margin:4px 12px;color:#f6f1e6;font-weight:700;font-size:16px}" +
        "#flare-root .fl-a input{width:100%;height:44px;accent-color:#e8c450}" +
        "#flare-root .fl-a span{font-weight:600;color:#e7d7b0;font-size:14px}" +
        "#flare-root .fl-scene{position:relative;width:100%;max-width:100%;min-width:0;margin:4px 0}" +
        "#flare-root .fl-vis{width:100%;max-width:100%;height:auto;max-height:min(38vh,420px);display:block}" +
        "#flare-root .fl-spot{position:absolute;z-index:3;min-height:44px;padding:6px 10px;border-radius:10px;border:1px solid #e8c450;background:rgba(12,16,20,.9);color:#f6f1e6;font-weight:700;font-size:14px}" +
        "#flare-root .fl-spot.pulse{animation:fl-pulse .7s ease-in-out infinite}" +
        "@keyframes fl-pulse{50%{box-shadow:0 0 0 8px rgba(232,196,80,.45)}}" +
        "#flare-root .fl-spot.nut{left:16%;top:18%}" +
        "#flare-root .fl-spot.cut{right:4%;top:8%}" +
        "#flare-root .fl-spot.deburr{right:4%;bottom:10%}" +
        "#flare-root .fl-spot.clamp{left:40%;top:8%}" +
        "#flare-root .fl-spot.flare{left:52%;top:46%}" +
        "#flare-root .fl-spot.torque{left:6%;bottom:8%}" +
        "#flare-root .fl-status{margin:8px 12px;font-size:16px;line-height:1.35;color:#f6f1e6}" +
        "#flare-root .fl-status.good{color:#7fd99a}" +
        "#flare-root .fl-status.bad{color:#ffb4a8}" +
        "#flare-root .fl-pick{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}" +
        "#flare-root .fl-size{min-height:44px;padding:0 12px;border-radius:10px;border:1px solid #6d5b3c;background:#1c2126;color:#f6f0e2;font-weight:700}" +
        "#flare-root .fl-size.on{background:#e8c450;color:#1a1408;border-color:#e8c450}" +
        "#flare-root .fl-tools-btn{margin:0 12px 16px;min-height:44px}" +
        "#flare-root .fl-acts{display:none;flex-wrap:wrap;gap:8px;padding:0 12px 16px}" +
        "#flare-root.show-tools .fl-acts{display:flex}" +
        "#flare-root .fl-acts .btn{min-height:44px}" +
        "body:has(#screen-flare.active) .walk-chip,body:has(#screen-flare.active) .ld-replay,body:has(#screen-flare.active) .pf-coach{display:none!important}" +
        "body:has(#screen-flare.active) #drip-ear{top:auto!important;bottom:8px!important;left:8px!important;right:auto!important;width:min(220px,48vw)!important;max-height:52px!important;z-index:40!important}" +
        "body:has(#screen-flare.active) #toast-host{top:auto!important;bottom:8px!important;right:8px!important;left:auto!important;width:min(160px,42vw)!important;max-height:36px!important;overflow:hidden!important}" +
        "</style>";

      host.querySelector("#fl-hub").onclick = function () {
        if (onHub) onHub();
      };
      host.querySelector("#fl-reset").onclick = function () {
        doAct("reset");
      };
      host.querySelector("#fl-do").onclick = function () {
        if (watching) return;
        doAct(move.go);
      };
      host.querySelector("#fl-watch").onclick = function () {
        watchIt();
      };
      host.querySelector("#fl-tools").onclick = function () {
        showTools = !showTools;
        paint();
      };
      const spotBtn = host.querySelector("[data-spot]");
      if (spotBtn) spotBtn.onclick = function () {
        if (watching) return;
        doAct(spotBtn.getAttribute("data-spot"));
      };
      host.querySelectorAll("[data-size]").forEach(function (b) {
        b.onclick = function () {
          stopWatch();
          size = SIZES.filter(function (z) {
            return z.id === b.getAttribute("data-size");
          })[0];
          st = resetState();
          a = 0.4;
          torque = 8;
          const t = target();
          msg = size.name + " " + gasName() + ". Nut first. A starts short on purpose.";
          hub = "A target " + t[0].toFixed(1) + "–" + t[1].toFixed(1) + " mm.";
          coachLine = NUT_FIRST;
          playMark = null;
          paint();
        };
      });
      host.querySelectorAll("[data-ref]").forEach(function (b) {
        b.onclick = function () {
          stopWatch();
          ref = b.getAttribute("data-ref");
          st = resetState();
          a = 0.4;
          torque = 8;
          const t = target();
          msg = gasName() + " die. Nut first. A starts short on purpose.";
          hub = "410A nut is larger. 1/2″ 24→26 mm, 5/8″ 27→29 mm. A target " + t[0].toFixed(1) + "–" + t[1].toFixed(1) + " mm.";
          coachLine = NUT_FIRST;
          playMark = null;
          paint();
        };
      });
      const rng = host.querySelector("#fl-range");
      if (rng) {
        rng.oninput = function () {
          a = +rng.value / 10;
          const o = host.querySelector("#fl-aout");
          if (o) o.textContent = a.toFixed(1) + " mm";
          const lab = host.querySelector("#fl-a-label");
          if (lab) lab.textContent = "A = " + a.toFixed(1) + " mm";
        };
      }
      const tq = host.querySelector("#fl-torque");
      if (tq) {
        tq.oninput = function () {
          torque = +tq.value;
          const o = host.querySelector("#fl-tq");
          if (o) o.textContent = torque + " ft-lb";
        };
      }
      host.querySelectorAll("[data-act]").forEach(function (b) {
        b.onclick = function () {
          doAct(b.getAttribute("data-act"));
        };
      });
      flushPlay();
    }

    paint();
    return { stop: function () { stopWatch(); } };
  }

  global.FlareLab = {
    start: function (host, opts) {
      host.innerHTML = "";
      return FlareLab(host, opts || {});
    },
  };
})(window);
