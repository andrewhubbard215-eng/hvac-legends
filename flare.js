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
    let a = 1.5;
    let torque = 12;
    let st = resetState();
    let msg = "Nut on the tube before you cut. That's the whole class.";
    let hub = "Forget the nut and you recut. Every time.";
    let lastPass = false;

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

    function doAct(act) {
      lastPass = false;
      if (act === "nut") {
        if (st.flared) {
          msg = "Too late. The flare is already formed. The nut will not pass it. Recut.";
          hub = "Nut goes on before the block closes. Always.";
          return paint();
        }
        if (st.clamp) {
          st.nutBehind = true;
          st.nut = false;
          st.verdict = "fail";
          msg = "The block is already closed. That nut is behind the block. A flare made that way is wrong. Recut.";
          hub = "Slide the nut on, then cut, then deburr, then the bar.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        st.nut = true;
        st.nutBehind = false;
        msg = "Flare nut is on the tube, in front of the block. Now cut square.";
        hub = "R-410A nut is fatter than R-22. Don't grab the old 24 mm on a 1/2″ 410A.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return paint();
      }
      if (act === "cut") {
        if (!st.nut || st.nutBehind) {
          st.cutBeforeNut = true;
          st.cut = false;
          msg = "You cut before the nut was on. The cutter stays off this stick until the nut is in front of the block. Recut after the nut is on.";
          hub = "Nut on first. Then cut. Then deburr. Then the bar.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
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
        return paint();
      }
      if (act === "deburr") {
        if (!st.cut) {
          msg = "Nothing to deburr. Cut first.";
          hub = "Order of operations. Like charging — don't skip.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        st.deburr = true;
        msg = "ID is clean. Clamp in the bar. Set projection A for " + size.name + " " + (ref === "r410" ? "R-410A" : "R-22") + ".";
        hub = "R-410A A is a hair longer than R-22. Wrong die, wrong height, leak.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return paint();
      }
      if (act === "clamp") {
        if (!st.cut || !st.deburr) {
          msg = !st.cut ? "Cut the tube before the block." : "Deburr before the block. A ridge becomes a leak.";
          hub = "Nut, cut, deburr, then the bar.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        if (!st.nut || st.nutBehind) {
          st.clamp = true;
          st.nutBehind = true;
          st.verdict = "fail";
          msg = "You closed the block with the nut behind it. That flare will be wrong. Open it and start over.";
          hub = "The nut has to be on the tube before the bar closes.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        st.clamp = true;
        msg = "Tube is in the bar. Nut is in front of the block, not behind it. Set A, then the eccentric cone.";
        hub = "Yoke centered. If the cone walks you get an oval and a callback.";
        if (window.LtHaptic) window.LtHaptic.tick();
        return paint();
      }
      if (act === "flare") {
        if (!st.clamp) {
          msg = "Clamp it in the flaring bar first.";
          hub = "Freehand flaring is not a pass.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        if (!st.nut || st.nutBehind) {
          st.flared = true;
          st.nutBehind = true;
          st.verdict = "fail";
          lastPass = false;
          msg = "Flare made with the nut behind the block. That nut never reaches the seat. Not a pass. Recut.";
          hub = "Slide the nut on FIRST. Then cut. Then deburr. Then the block.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
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
          if (st.ridge) {
            msg = "Ridge left on the ID. That's a leak path. Not a pass.";
            hub = "Deburr. No burr, no excuses.";
          } else if (st.cracked) {
            msg = "Cracked flare. The wall is paper. That is not a pass. Recut.";
            hub = "A is millimeters, not feelings.";
          } else if (st.short) {
            msg = "A too short. Seat is skinny. It will leak at the nitrogen test. Not a pass.";
            hub = "Clutch-type: tube should stick out " + lo.toFixed(1) + "–" + hi.toFixed(1) + " mm.";
          } else {
            msg = "A a little long. Thin at the rim. Not a pass until you recut.";
            hub = "Target " + lo.toFixed(1) + "–" + hi.toFixed(1) + " mm.";
          }
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        msg = "Seat is even and the nut is in front of the block. Torque it. Over-torque cracks it — that is not a pass.";
        hub = "Chart for " + size.name + " is " + spec()[0] + "–" + spec()[1] + " ft-lb. Not 'good and tight.'";
        if (window.LtHaptic) window.LtHaptic.tick();
        return paint();
      }
      if (act === "torque") {
        if (!st.flared || st.verdict === "fail" || st.nutBehind || st.cracked || st.ridge || st.short || st.long) {
          st.verdict = "fail";
          lastPass = false;
          msg = st.nutBehind
            ? "Nut is behind the block. Torque will not save it."
            : st.cracked
              ? "That flare is already cracked. Over-torque is not a pass."
              : "Make a clean flare before you torque. A bad seat does not pass.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        const already = st.verdict === "pass";
        const band = spec();
        if (torque > band[1]) {
          st.cracked = true;
          st.verdict = "fail";
          lastPass = false;
          msg = "Over-torqued at " + torque + " ft-lb. The flare cracked. That is not a pass. Recut.";
          hub = "Chart is " + band[0] + "–" + band[1] + " ft-lb for " + size.name + ".";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        if (torque < band[0]) {
          st.verdict = null;
          lastPass = false;
          msg = "Under-torqued at " + torque + " ft-lb. It will leak. That is not a pass.";
          hub = "Come up to " + band[0] + "–" + band[1] + " ft-lb. Don't reef it past the chart.";
          if (window.LtHaptic) window.LtHaptic.bad();
          return paint();
        }
        st.verdict = "pass";
        lastPass = true;
        msg = "Torque " + torque + " ft-lb is on the chart. Nut is on the flare, not behind the block. That's a pass.";
        hub = "Soap it on the nitrogen test. A cracked flare from here is a recut.";
        if (onXp && !already) onXp(20);
        if (window.CurriculumTrain && !already) window.CurriculumTrain.stamp("flare");
        if (window.LtHaptic) window.LtHaptic.land();
        return paint();
      }
      if (act === "reset") {
        st = resetState();
        msg = "Fresh stick. Nut first.";
        hub = "Same tube size. Don't get cocky.";
        return paint();
      }
    }

    function svg() {
      let nut = "";
      if (st.nutBehind) {
        nut = '<circle cx="46" cy="100" r="16" fill="none" stroke="#F43F5E" stroke-width="6"/>' +
          '<text x="18" y="78" fill="#F43F5E" font-size="10" font-family="system-ui">NUT BEHIND BLOCK</text>';
      } else if (st.nut && st.flared) {
        nut = '<circle cx="122" cy="100" r="15" fill="none" stroke="#7fd99a" stroke-width="6"/>';
      } else if (st.nut) {
        nut = '<circle cx="58" cy="100" r="16" fill="none" stroke="#CE0034" stroke-width="6"/>';
      }
      const tube = '<rect x="20" y="88" width="' + (st.flared ? 118 : 140) + '" height="24" rx="2" fill="#c9a227"/>';
      let cone = "";
      if (st.flared) {
        const fill = st.verdict === "pass" ? "#c9a227" : "#F43F5E";
        cone = '<polygon points="138,84 178,100 138,116" fill="' + fill + '"/>';
        if (st.ridge) cone += '<circle cx="136" cy="100" r="5" fill="#1a1a1a"/>';
        if (st.cracked) cone += '<line x1="150" y1="90" x2="168" y2="108" stroke="#fff" stroke-width="2"/>';
      }
      const bar = st.clamp
        ? '<rect x="64" y="70" width="36" height="60" fill="none" stroke="#8b98a5" stroke-width="3"/>'
        : "";
      const aMark =
        '<text x="20" y="40" fill="#e8c450" font-size="13" font-weight="700" font-family="system-ui">A = ' +
        a.toFixed(1) +
        " mm</text>" +
        '<text x="20" y="58" fill="#8b98a5" font-size="11" font-family="system-ui">target ' +
        target()[0].toFixed(1) +
        "–" +
        target()[1].toFixed(1) +
        " mm</text>";
      return (
        '<svg class="fl-vis" viewBox="0 0 260 180" role="img" style="width:100%;max-width:480px;max-height:220px;height:auto;display:block">' +
        '<rect width="260" height="180" rx="12" fill="#10161c"/>' +
        aMark +
        tube +
        nut +
        cone +
        bar +
        "</svg>"
      );
    }

    function paint() {
      const brand = (window.LtBrand && window.LtBrand.mark) || "HA";
      const org = (window.LtBrand && window.LtBrand.org) || "HVAC Legends";
      host.innerHTML =
        '<div class="fl-lab">' +
        '<header class="fl-head">' +
        '<button type="button" class="btn" id="fl-hub">Shop floor</button>' +
        '<div class="brand-bar"><div class="brand-mark">' +
        brand +
        '</div><div class="brand-word"><strong>' +
        org +
        "</strong><span>Flaring lab · nut · cut · deburr · A · 45°</span></div></div>" +
        '<button type="button" class="btn" id="fl-reset">New tube</button></header>' +
        '<div class="fl-acts">' +
        '<button type="button" class="btn' +
        (st.nut ? " done" : " primary") +
        '" data-act="nut">1 · Nut on first</button>' +
        '<button type="button" class="btn' +
        (st.cut ? " done" : "") +
        '" data-act="cut">2 · Square cut</button>' +
        '<button type="button" class="btn' +
        (st.deburr ? " done" : "") +
        '" data-act="deburr">3 · Deburr ID</button>' +
        '<button type="button" class="btn' +
        (st.clamp ? " done" : "") +
        '" data-act="clamp">4 · Clamp in bar</button>' +
        '<button type="button" class="btn primary" data-act="flare">5 · Eccentric flare</button>' +
        '<button type="button" class="btn' +
        (st.verdict === "pass" ? " done" : "") +
        '" data-act="torque">6 · Torque to chart</button>' +
        "</div>" +
        '<div class="fl-pick">' +
        SIZES.map(function (z) {
          return (
            '<button type="button" class="fl-size' +
            (size.id === z.id ? " on" : "") +
            '" data-size="' +
            z.id +
            '">' +
            z.name +
            "</button>"
          );
        }).join("") +
        '<button type="button" class="fl-size' +
        (ref === "r410" ? " on" : "") +
        '" data-ref="r410">R-410A / R-32</button>' +
        '<button type="button" class="fl-size' +
        (ref === "r22" ? " on" : "") +
        '" data-ref="r22">R-22</button></div>' +
        '<div class="fl-scene">' +
        svg() +
        "</div>" +
        '<p class="fl-status' +
        (st.verdict === "pass" ? " good" : st.verdict === "fail" ? " bad" : "") +
        '">' +
        msg +
        "</p>" +
        '<p class="fl-hub">' +
        hub +
        "</p>" +
        '<label class="fl-a">Projection A ' +
        '<input id="fl-range" type="range" min="0" max="35" value="' +
        Math.round(a * 10) +
        '" />' +
        "<output>" +
        a.toFixed(1) +
        " mm</output></label>" +
        '<label class="fl-a">Torque <input id="fl-torque" type="range" min="5" max="70" value="' +
        torque +
        '" /><output id="fl-tq">' +
        torque +
        " ft-lb</output> · chart " +
        spec()[0] +
        "–" +
        spec()[1] +
        " ft-lb</label></div>";

      host.querySelector("#fl-hub").onclick = function () {
        if (onHub) onHub();
      };
      host.querySelector("#fl-reset").onclick = function () {
        doAct("reset");
      };
      host.querySelectorAll("[data-size]").forEach(function (b) {
        b.onclick = function () {
          size = SIZES.filter(function (z) {
            return z.id === b.getAttribute("data-size");
          })[0];
          st = resetState();
          const t = target();
          a = (t[0] + t[1]) / 2;
          msg = size.name + " " + (ref === "r410" ? "R-410A" : "R-22") + ". Nut first.";
          hub = "A target " + t[0].toFixed(1) + "–" + t[1].toFixed(1) + " mm.";
          paint();
        };
      });
      host.querySelectorAll("[data-ref]").forEach(function (b) {
        b.onclick = function () {
          ref = b.getAttribute("data-ref");
          st = resetState();
          const t = target();
          a = (t[0] + t[1]) / 2;
          msg = (ref === "r410" ? "R-410A/R-32" : "R-22") + " die. Nut first.";
          hub = "410A nut is larger. 1/2″ 24→26 mm, 5/8″ 27→29 mm.";
          paint();
        };
      });
      const rng = host.querySelector("#fl-range");
      rng.oninput = function () {
        a = +rng.value / 10;
        const outs = host.querySelectorAll("output");
        if (outs[0]) outs[0].textContent = a.toFixed(1) + " mm";
      };
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
    }

    paint();
    return { stop: function () {} };
  }

  global.FlareLab = {
    start: function (host, opts) {
      host.innerHTML = "";
      return FlareLab(host, opts || {});
    },
  };
})(window);
