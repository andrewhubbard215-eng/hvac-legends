/* TU-522 compressor fault board — patch cords, not a tap quiz.
   Guided walks the string. Exercise hands you a board that was left wrong. */
(function (global) {
  "use strict";

  const NODES = [
    { id: "l1", name: "L1", group: "Line" },
    { id: "tc", name: "Temperature control", group: "Control string" },
    { id: "pd", name: "Pump-down switch", group: "Control string" },
    { id: "lpc", name: "Low pressure control", group: "Control string" },
    { id: "hpc", name: "High pressure control", group: "Control string" },
    { id: "coil", name: "Contactor coil", group: "Control string" },
    { id: "l2", name: "L2", group: "Line" },
    { id: "t1", name: "Contactor T1", group: "Load" },
    { id: "ol", name: "Overload", group: "Load" },
    { id: "cc", name: "Compressor common", group: "Load" },
    { id: "cr", name: "Compressor run", group: "Start circuit" },
    { id: "cap", name: "Run capacitor", group: "Start circuit" },
    { id: "pot", name: "Potential relay", group: "Start circuit" },
    { id: "sc", name: "Start capacitor", group: "Start circuit" },
  ];

  const STEPS = [
    { a: "l1", b: "tc", say: "Drag L1 to temperature control.", why: "No call, no contactor. Prove the stat before you condemn the compressor." },
    { a: "tc", b: "pd", say: "Land on the pump-down switch.", why: "An open pump-down switch is a choice, not a bad compressor." },
    { a: "pd", b: "lpc", say: "Pump-down to low pressure control.", why: "Warm suction and an open low-pressure control means empty or restricted. Do not jumper it and walk away." },
    { a: "lpc", b: "hpc", say: "Low pressure to high pressure.", why: "A hot discharge line with the contactor out is often the high-pressure control, not the compressor." },
    { a: "hpc", b: "coil", say: "High pressure onto the coil.", why: "Every switch in that string has to be closed or the coil never sees the call." },
    { a: "coil", b: "l2", say: "Other side of the coil to L2.", why: "A coil with one side open is just a wire going nowhere." },
    { a: "t1", b: "ol", say: "T1 feeds the overload.", why: "The overload sits in series with common. Meter it before you change the compressor." },
    { a: "ol", b: "cc", say: "Overload out to common.", why: "Common is where the run and start windings meet. No common, no start." },
    { a: "cr", b: "cap", say: "Run winding to the capacitor.", why: "An open run capacitor hums and does not start. The overload is still closed." },
    { a: "pot", b: "sc", say: "Relay feeds the start cap.", why: "Leave the start capacitor in the circuit and the overload opens after the hum." },
  ];

  const EXERCISE = [
    ["l1", "tc"],
    ["tc", "coil"],
    ["pd", "l2"],
    ["t1", "ol"],
    ["ol", "cc"],
    ["sc", "cr"],
  ];

  function key(a, b) {
    return a < b ? a + "|" + b : b + "|" + a;
  }
  function name(id) {
    const n = NODES.find((x) => x.id === id);
    return n ? n.name : id;
  }

  function mount(host, hooks) {
    if (!host) return { stop: function () {} };
    hooks = hooks || {};
    let mode = "guide";
    let step = 0;
    let hint = 0;
    let wires = [];
    let say = STEPS[0].say;
    let drag = null;
    let checked = false;
    let guideCleared = false;
    let playing = true;

    function has(a, b) {
      const k = key(a, b);
      return wires.some((w) => key(w[0], w[1]) === k);
    }
    function goodSet() {
      const s = {};
      STEPS.forEach((st) => { s[key(st.a, st.b)] = 1; });
      return s;
    }
    function isGood(a, b) {
      return !!goodSet()[key(a, b)];
    }

    function hintText() {
      if (mode === "guide") {
        const st = STEPS[step];
        if (!st) return "The string is landed. Do not jumper a safety on a live unit to make it run.";
        if (hint < 1) return "One cord. From " + name(st.a) + ".";
        return "Drag " + name(st.a) + " to " + name(st.b) + ". " + st.why;
      }
      const bad = wires.filter((w) => !isGood(w[0], w[1]));
      const missing = STEPS.filter((st) => !has(st.a, st.b));
      if (hint < 1) return "A safety that is jumped is not protecting anyone. Pull the cord that skips the string.";
      if (bad.length && hint < 2) return "This cord does not belong: " + name(bad[0][0]) + " to " + name(bad[0][1]) + ".";
      if (missing.length) return "Still open: " + name(missing[0].a) + " to " + name(missing[0].b) + ". " + missing[0].why;
      return "The board matches the silk screen. Leave the safeties in the string.";
    }

    function askHub() {
      const q = "TU-522 compressor fault board. " + say + " " + hintText();
      if (global.HubAI && typeof global.HubAI.say === "function") global.HubAI.say(q);
      else say = hintText();
      render();
    }

    function addWire(a, b) {
      if (!a || !b || a === b || has(a, b)) return;
      if (mode === "guide") {
        const st = STEPS[step];
        if (!st) return;
        if (key(a, b) !== key(st.a, st.b)) {
          say = "Not this cord. " + st.say;
          hint = 0;
          if (global.PlayFeel) {
            global.PlayFeel.deny(host);
            global.PlayFeel.pop(host, "Wrong cord", "bad");
            global.PlayFeel.coach(host, "Next: " + name(st.a) + " to " + name(st.b) + ".");
          }
          render();
          return;
        }
        wires.push([a, b]);
        step += 1;
        hint = 0;
        checked = false;
        say = step >= STEPS.length
          ? "String is landed. Coil, overload, run capacitor, then the start capacitor through the potential relay. You did not jump a safety. Switch to Exercise and correct the board someone left wrong."
          : STEPS[step].say;
        if (global.PlayFeel) {
          global.PlayFeel.bump(host);
          global.PlayFeel.pop(host, "Landed", "ok");
          global.PlayFeel.coach(host, step >= STEPS.length ? "String is in. Switch to Exercise and fix the board." : "Next: " + name(STEPS[step].a) + " to " + name(STEPS[step].b) + ".");
        }
        if (step >= STEPS.length && hooks.onGuideDone) hooks.onGuideDone();
        if (step >= STEPS.length) guideCleared = true;
        render();
        return;
      }
      wires.push([a, b]);
      checked = false;
      say = name(a) + " to " + name(b) + " is on the board. Check it when you think the string is right.";
      render();
    }

    function pull(i) {
      const w = wires[i];
      wires.splice(i, 1);
      checked = false;
      say = "Pulled " + name(w[0]) + " to " + name(w[1]) + ".";
      render();
    }

    function check() {
      checked = true;
      const bad = wires.filter((w) => !isGood(w[0], w[1]));
      const missing = STEPS.filter((st) => !has(st.a, st.b));
      if (!bad.length && !missing.length) {
        say = "Board is right. The safeties are in the string, the overload feeds common, the run capacitor is on the run winding, and the start capacitor is only on the potential relay.";
        if (hooks.onExerciseClear) hooks.onExerciseClear();
      } else {
        say = bad.length + " cord" + (bad.length === 1 ? "" : "s") + " do not belong. " + missing.length + " still open. Pull the bad ones before you add more.";
      }
      render();
    }

    function setMode(next) {
      if (next === "exercise" && !guideCleared) {
        say = "This trainer is protected. Finish the guided string before the exercise. A safety does not get jumped to skip ahead.";
        render();
        return;
      }
      mode = next;
      step = 0;
      hint = 0;
      checked = false;
      wires = next === "exercise" ? EXERCISE.map((w) => w.slice()) : [];
      say = next === "exercise"
        ? "Someone left this board wrong. The pump-down and the pressure controls are not all in the string, and the start capacitor is on the wrong winding. Pull what does not belong. Land what the silk screen shows."
        : STEPS[0].say;
      render();
    }

    function render() {
      if (!document.getElementById("tu5-now-css")) {
        const css = document.createElement("style");
        css.id = "tu5-now-css";
        css.textContent =
          ".tu5-now{margin:0 0 8px;padding:12px 14px;border:1px solid #e8c450;border-radius:14px;background:#1a160e}" +
          ".tu5-now strong{display:block;font-size:22px;line-height:1.2;color:#f6f1e6}" +
          ".tu5-now p{margin:6px 0 0;color:#e7d7b0;font-size:16px;line-height:1.35}" +
          ".tu5-modes{display:flex;flex-wrap:wrap;gap:6px}" +
          ".tu5-jack{min-height:48px}" +
          ".tu5-jack.hot{animation:tu5-jack-glow .7s ease-in-out infinite;border-color:#e8c450}" +
          "@keyframes tu5-jack-glow{50%{box-shadow:0 0 0 8px rgba(232,196,80,.55)}}" +
          "@media (max-width:800px){#iconnect-root .tu5-board{order:1!important}#iconnect-root .tu5-live,#iconnect-root .tu5>.tu5-group,#iconnect-root .tu5-list{order:3!important}}";
        document.head.appendChild(css);
      }
      const hot = mode === "guide" && STEPS[step] ? STEPS[step] : null;
      const groups = [];
      NODES.forEach((n) => {
        let g = groups.find((x) => x.name === n.group);
        if (!g) {
          g = { name: n.group, nodes: [] };
          groups.push(g);
        }
        g.nodes.push(n);
      });
      const jacks = groups.map((g) => {
        return '<p class="tu5-group">' + g.name + "</p>" + g.nodes.map((n) => {
          const on = hot && (hot.a === n.id || hot.b === n.id);
          return '<button type="button" class="tu5-jack' + (on ? " hot" : "") + '" data-jack="' + n.id + '"><i></i><span>' + n.name + "</span></button>";
        }).join("");
      }).join("");
      const list = wires.map((w, i) => {
        const bad = checked && !isGood(w[0], w[1]);
        const ok = checked && isGood(w[0], w[1]);
        return '<li class="tu5-wire' + (bad ? " bad" : "") + (ok ? " ok" : "") + '"><span>' + name(w[0]) + " → " + name(w[1]) + '</span><button type="button" data-pull="' + i + '">Pull</button></li>';
      }).join("");
      const control = [["l1", "tc", "L1", "TC"], ["tc", "pd", "TC", "PD"], ["pd", "lpc", "PD", "LPC"], ["lpc", "hpc", "LPC", "HPC"], ["hpc", "coil", "HPC", "COIL"], ["coil", "l2", "COIL", "L2"]];
      const controlOn = control.filter((p) => has(p[0], p[1])).length;
      const coilIn = controlOn === control.length;
      const loadOn = has("t1", "ol") && has("ol", "cc");
      const runOn = has("cr", "cap");
      const startOn = has("pot", "sc");
      const stray = wires.some((w) => !isGood(w[0], w[1]));
      let live = coilIn ? "Coil is in. The safeties are in the string." : "Coil is out. " + controlOn + " of 6 control cords.";
      if (loadOn) live += " Common is fed.";
      if (runOn) live += " Run cap stays in.";
      if (startOn) live += " Start cap is on the relay.";
      if (stray) live += " A cord does not belong.";
      const seg = (a, b) => '<i class="tu5-seg' + (has(a, b) ? " on" : "") + '"></i>';
      const node = (label, lit) => '<span class="tu5-node' + (lit ? " on" : "") + '">' + label + "</span>";
      const ladder =
        '<div class="tu5-live"><p class="tu5-live-status">' + live + "</p>" +
        '<div class="tu5-ladder">' +
        control.map((p, i) => {
          const label = p[3] === "COIL" ? "C" : p[3];
          const lit = p[3] === "COIL" ? coilIn : has(p[0], p[1]);
          return (i ? "" : node("L1", has("l1", "tc"))) + seg(p[0], p[1]) + node(label, lit);
        }).join("") +
        "</div>" +
        '<div class="tu5-ladder">' +
        node("T1", has("t1", "ol")) + seg("t1", "ol") + node("OL", has("t1", "ol") && has("ol", "cc")) + seg("ol", "cc") + node("C", loadOn) +
        '<span class="tu5-gap"></span>' +
        node("RUN", runOn) + seg("cr", "cap") + node("CAP", runOn) +
        '<span class="tu5-gap"></span>' +
        node("POT", startOn) + seg("pot", "sc") + node("START", startOn) +
        "</div></div>";
      const now = hot
        ? '<div class="tu5-now"><strong>' + (step + 1) + ". " + name(hot.a) + " → " + name(hot.b) + "</strong><p>" + hot.say + "</p></div>"
        : (mode === "exercise"
          ? '<div class="tu5-now"><strong>Fix the board</strong><p>' + say + "</p></div>"
          : "");
      host.innerHTML =
        '<div class="tu5">' +
        now +
        '<div class="tu5-modes">' +
        '<button type="button" class="btn' + (mode === "guide" ? " primary" : "") + '" data-mode="guide">Guided</button>' +
        '<button type="button" class="btn' + (mode === "exercise" ? " primary" : "") + '" data-mode="exercise">Exercise</button>' +
        '<button type="button" class="btn" id="tu5-hint">Hint</button>' +
        '<button type="button" class="btn" id="tu5-reset">Reset</button>' +
        '<button type="button" class="btn" id="tu5-ask">Ask HUB</button>' +
        (mode === "exercise" ? '<button type="button" class="btn primary" id="tu5-check">Check the board</button>' : "") +
        "</div>" +
        '<p class="tu5-plate">Drag a jack to the glowing jack.</p>' +
        '<div class="tu5-hub"><img src="hub-portrait.jpg?v=3" alt="" /><p>' + say + "</p></div>" +
        ladder +
        '<div class="tu5-board">' + jacks + "</div>" +
        '<p class="tu5-group">Cords on the board</p>' +
        '<ul class="tu5-list">' + (list || "<li class=\"tu5-wire\"><span>None yet.</span></li>") + "</ul>" +
        "</div>";
      bind();
    }

    function bind() {
      host.querySelectorAll("[data-mode]").forEach((b) => {
        b.onclick = () => setMode(b.getAttribute("data-mode"));
      });
      const hintBtn = host.querySelector("#tu5-hint");
      if (hintBtn) hintBtn.onclick = () => {
        hint += 1;
        say = hintText();
        render();
      };
      const resetBtn = host.querySelector("#tu5-reset");
      if (resetBtn) resetBtn.onclick = () => setMode(mode);
      const ask = host.querySelector("#tu5-ask");
      if (ask) ask.onclick = askHub;
      const checkBtn = host.querySelector("#tu5-check");
      if (checkBtn) checkBtn.onclick = check;
      host.querySelectorAll("[data-pull]").forEach((b) => {
        b.onclick = () => pull(Number(b.getAttribute("data-pull")));
      });
      host.querySelectorAll("[data-jack]").forEach((b) => {
        b.addEventListener("pointerdown", onDown);
      });
    }

    function onDown(e) {
      const id = e.currentTarget.getAttribute("data-jack");
      drag = { id: id, x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.addEventListener("pointermove", onMove);
      e.currentTarget.addEventListener("pointerup", onUp);
      e.currentTarget.addEventListener("pointercancel", onUp);
    }
    function onMove(e) {
      if (!drag) return;
      drag.x = e.clientX;
      drag.y = e.clientY;
    }
    function onUp(e) {
      const from = drag && drag.id;
      drag = null;
      e.currentTarget.removeEventListener("pointermove", onMove);
      e.currentTarget.removeEventListener("pointerup", onUp);
      e.currentTarget.removeEventListener("pointercancel", onUp);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const jack = el && el.closest ? el.closest("[data-jack]") : null;
      const to = jack ? jack.getAttribute("data-jack") : "";
      if (from && to) addWire(from, to);
    }

    render();
    return { stop: function () { host.innerHTML = ""; } };
  }

  global.Tu522 = { mount: mount };
})(window);
