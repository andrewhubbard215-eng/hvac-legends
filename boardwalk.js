/* Live furnace-board sim. The meter reads the circuit you actually touch. */
(function (global) {
  var STEPS = [
    { id: "dial", title: "Dial V~", say: "The circuit is live. House power and the 24-volt call are both AC. Tap V~.", kind: "dial" },
    { id: "com", title: "Black in COM", say: "COM is the meter's reference. Drag the black lead onto COM, or tap Black, then tap COM.", kind: "jack", lead: "blk", spot: "com" },
    { id: "vohm", title: "Red in VΩ", say: "Red does the measuring. Drag it onto VΩ. Amps are the jaw, not a jack.", kind: "jack", lead: "red", spot: "v" },
    { id: "prove", title: "Prove the meter", say: "Known outlet. Black on neutral, red on hot. About 120, or do not trust the meter.", kind: "pair", blk: "neu", red: "hot", expect: 121.1, tol: 2 },
    { id: "hn", title: "Furnace hot to neutral", say: "Black on furnace neutral. Red on furnace hot. The breaker feeds this. About 120.", kind: "pair", blk: "fn", red: "fh", expect: 120.3, tol: 2 },
    { id: "hg", title: "Hot to ground", say: "Black on furnace ground. Red on furnace hot. About 120. It should match hot to neutral.", kind: "pair", blk: "fg", red: "fh", expect: 120.6, tol: 2 },
    { id: "ng", title: "Neutral to ground", say: "Black on ground. Red on neutral. A few tenths is normal. A high reading is a loose neutral.", kind: "pair", blk: "fg", red: "fn", expect: 0.3, tol: 0.4 },
    { id: "door-open", title: "Door switch open", say: "Let the door switch go. Measure across it. An open switch reads about 120. That is the switch, not a dead board.", kind: "pair", blk: "swa", red: "swb", door: false, expect: 120.3, tol: 2, wrongDoor: "You are holding the switch. Let it go. Open reads about 120 across it." },
    { id: "door-shut", title: "Door switch held in", say: "Hold the door. Measure across the switch again. A closed switch reads about 0, and the board gets power.", kind: "pair", blk: "swa", red: "swb", door: true, expect: 0, tol: 0.6, wrongDoor: "The switch is still open. Hold it, then measure." },
    { id: "pri", title: "Transformer primary", say: "Hold the door. The primary is after the switch. Black on white, red on black. About 120. Door open, this goes to about 0.", kind: "pair", blk: "xw", red: "xb", door: true, expect: 120.3, tol: 2, wrongDoor: "Door is open, so the primary is dead. Hold the switch." },
    { id: "rc", title: "R to C", say: "Door held. Black on C, red on R. About 24 to 28. This signal calls. It does not run the blower.", kind: "pair", blk: "c", red: "r", door: true, expect: 26.4, tol: 1.5, wrongDoor: "No 24 until the primary has 120. Hold the door." },
    { id: "w", title: "Heat call on W", say: "Tap Heat. Door stays held. Black on C, red on W. About 24 means the stat connected R to W.", kind: "pair", blk: "c", red: "w", door: true, call: "W", expect: 26.1, tol: 1.5, wrongCall: "W is not calling. Tap Heat.", wrongDoor: "Door is open. The transformer is off, so W is dead." },
    { id: "limit", title: "Limit with the call on", say: "Heat still calling. Measure across the limit. A closed safety is about 0 only after the call arrives. Do not jump it.", kind: "pair", blk: "lima", red: "limb", door: true, call: "W", expect: 0.2, tol: 0.5, wrongCall: "No heat call. A limit reading means nothing until W is up.", wrongDoor: "Door is open. Bring the 24-volt call back first." },
    { id: "g", title: "G is the fan", say: "Tap Fan. G is not ground. Black on C, red on G. About 24 asks the board for the blower. Heat drops off G.", kind: "pair", blk: "c", red: "g", door: true, call: "G", expect: 26, tol: 1.5, wrongCall: "Fan is not calling. G is the fan call, not a ground.", wrongDoor: "Door is open. No 24 on G until the transformer is live." },
    { id: "ind", title: "Inducer output", say: "Tap Heat again. Black on neutral, red on the inducer. About 120 means the board sent line voltage. Fan On does not run the inducer.", kind: "pair", blk: "fn", red: "ind", door: true, call: "W", expect: 119.2, tol: 2, wrongCall: "The inducer runs on a heat call, not Fan. Tap Heat.", wrongDoor: "Door is open. The board cannot send 120 to the inducer." }
  ];

  var GROUPS = [
    { name: "Meter jacks", ids: ["com", "v"] },
    { name: "Outlet", ids: ["hot", "neu"] },
    { name: "Furnace line", ids: ["fh", "fn", "fg"] },
    { name: "Door switch", ids: ["swa", "swb"] },
    { name: "Transformer", ids: ["xb", "xw", "r", "c"] },
    { name: "Call", ids: ["w", "g", "lima", "limb"] },
    { name: "Loads", ids: ["ind", "blw"] }
  ];

  var SPOTS = {
    com: "COM", v: "VΩ",
    hot: "Outlet hot", neu: "Outlet neutral",
    fh: "Furnace hot", fn: "Furnace neutral", fg: "Furnace ground",
    swa: "Switch line", swb: "Switch load",
    xb: "Primary black", xw: "Primary white",
    r: "R", c: "C", w: "W", g: "G",
    lima: "Limit in", limb: "Limit out",
    ind: "Inducer", blw: "Blower"
  };

  function BoardWalk() {}

  BoardWalk.start = function (root, opts) {
    opts = opts || {};
    var dock = document.getElementById("student-dock");
    if (dock) dock.hidden = true;
    var step = 0;
    var dial = "off";
    var jacks = { blk: "", red: "" };
    var placed = { blk: "", red: "" };
    var breaker = true;
    var door = false;
    var call = "";
    var hand = "blk";
    var note = STEPS[0].say;
    var fuse = false;
    var drag = null;
    var dead = false;

    function spec() { return STEPS[step]; }

    function nodes() {
      var line = breaker ? 120.6 : 0;
      var outlet = breaker ? 121.4 : 0;
      var neu = 0.3;
      var gnd = 0;
      var swa = line;
      var swb = door && breaker ? line : neu;
      var pri = door && breaker;
      var r = pri ? 26.4 : 0;
      var c = 0;
      var w = pri && call === "W" ? 26.1 : 0;
      var g = pri && call === "G" ? 26 : 0;
      var lima = w;
      var limb = w > 1 ? 25.9 : 0;
      var heatOut = pri && call === "W";
      var fanOut = pri && (call === "G" || call === "W");
      return {
        hot: outlet, neu: neu, fh: line, fn: neu, fg: gnd,
        swa: swa, swb: swb, xb: swb, xw: neu,
        r: r, c: c, w: w, g: g, lima: lima, limb: limb,
        ind: heatOut ? 119.5 : 0,
        blw: fanOut ? 119.2 : 0
      };
    }

    function live() {
      if (fuse) return { text: "FUSE", unit: "", n: null, bad: true };
      if (dial === "off") return { text: "OFF", unit: "", n: null };
      if (jacks.blk !== "com" || jacks.red !== "v") return { text: "—.—", unit: "", n: null };
      if (!placed.blk || !placed.red) return { text: "—.—", unit: dial === "ohm" ? "Ω" : dial === "vdc" ? "V⎓" : "V~", n: null };
      var map = nodes();
      var n = Math.abs((map[placed.red] || 0) - (map[placed.blk] || 0));
      if (dial === "ohm") {
        if (n > 5) {
          fuse = true;
          return { text: "FUSE", unit: "", n: null, bad: true };
        }
        return { text: "OL", unit: "Ω", n: null };
      }
      if (dial === "vdc") return { text: (n > 20 ? 0.2 : n).toFixed(1), unit: "V⎓", n: n > 20 ? 0.2 : n };
      return { text: n.toFixed(1), unit: "V~", n: n };
    }

    var lastShown = "";

    function face(m) {
      if (m.bad || m.text === "FUSE") return { tone: "fuse", bar: 100, tag: "Fuse open" };
      if (m.text === "OL") return { tone: "cold", bar: 0, tag: "Open circuit" };
      if (m.n == null) return { tone: "", bar: 0, tag: "Leads are not reading" };
      if (dial === "vdc") return { tone: "cold", bar: 3, tag: "DC on AC. Almost nothing." };
      if (m.n < 1) return { tone: "cold", bar: 3, tag: "Near zero" };
      if (m.n < 40) return { tone: "call", bar: Math.max(8, Math.round(m.n / 150 * 100)), tag: "24-volt call" };
      return { tone: "line", bar: Math.min(100, Math.round(m.n / 150 * 100)), tag: "Line voltage" };
    }

    function grade() {
      var s = spec();
      var m = live();
      if (!s) return { ok: false, note: "" };
      if (s.kind === "dial") {
        return dial === "vac"
          ? { ok: true, note: "Dial is on V~. The furnace is already energized. Black lead next." }
          : { ok: false, note: dial === "ohm" ? "Do not ohm it yet. Tap V~." : s.say };
      }
      if (s.kind === "jack") {
        var got = s.lead === "blk" ? jacks.blk : jacks.red;
        if (got === s.spot) {
          return { ok: true, note: s.lead === "blk" ? "Black is in COM. Red goes in VΩ." : "Red is in VΩ. Prove it on the outlet." };
        }
        return { ok: false, note: s.say };
      }
      if (m.bad) return { ok: false, note: "You ohmed a live circuit. The fuse opened. Tap V~ to put the meter back." };
      if (jacks.blk !== "com" || jacks.red !== "v" || dial !== "vac") {
        return { ok: false, note: "Black in COM, red in VΩ, dial on V~, or the meter is not reading the circuit." };
      }
      var polarity = placed.blk === s.blk && placed.red === s.red;
      var swapped = placed.blk && placed.red && placed.blk === s.red && placed.red === s.blk;
      if (swapped) return { ok: false, note: "The number is real. The leads are swapped. Black stays on the reference side." };
      if (!polarity) return { ok: false, note: s.say };
      if (s.door != null && door !== s.door) return { ok: false, note: s.wrongDoor };
      if (s.call && call !== s.call) return { ok: false, note: s.wrongCall };
      if (m.n == null || Math.abs(m.n - s.expect) > s.tol) {
        return { ok: false, note: "That reading is live, and it is not this step yet. " + s.say };
      }
      return { ok: true, note: m.text + " " + m.unit + ". That is the live circuit. Tap Next." };
    }

    function land(lead, spot) {
      var s = spec();
      if (!s) return;
      if (s.kind === "dial" && spot !== "com" && spot !== "v") {
        note = "Dial first. Tap V~.";
        paint();
        return;
      }
      if (spot === "com" || spot === "v") {
        if (lead === "blk" && spot === "v") note = "Black does not go in VΩ. Black stays in COM.";
        else if (lead === "red" && spot === "com") note = "Red does not go in COM. Red goes in VΩ.";
        else {
          jacks[lead] = spot;
          note = grade().note;
        }
        paint();
        return;
      }
      placed[lead] = spot;
      note = grade().note;
      if (global.PlayFeel) {
        var g = grade();
        if (g.ok) {
          global.PlayFeel.bump(root);
          global.PlayFeel.pop(root, "That's the circuit", "ok");
        } else {
          global.PlayFeel.deny(root);
          global.PlayFeel.pop(root, "Not this step", "bad");
        }
        global.PlayFeel.coach(root, s.say || note);
      }
      paint();
    }

    function refreshNote() {
      var g = grade();
      if (g.note) note = g.note;
    }

    function paint() {
      if (dead) return;
      var s = spec();
      var brand = (global.LtBrand && global.LtBrand.title) || "HVAC";
      if (!s) {
        root.innerHTML = doneHtml(brand);
        bindDone();
        return;
      }
      var m = live();
      var look = face(m);
      var shown = m.text + m.unit;
      var pulsed = shown !== lastShown;
      lastShown = shown;
      var g = grade();
      var map = nodes();
      var lamps = [
        lamp("Breaker", breaker),
        lamp("Door", door),
        lamp("24 V", map.r > 20),
        lamp("Inducer", map.ind > 20),
        lamp("Blower", map.blw > 20)
      ].join("");
      root.innerHTML =
        '<div class="bw">' +
          '<header class="bw-top"><p>' + brand + ' · Live board</p><button type="button" class="bw-back" id="bw-back">Shop floor</button></header>' +
          '<p class="bw-count">Step ' + (step + 1) + ' of ' + STEPS.length + ' · ' + s.title + '</p>' +
          '<p class="bw-say" id="bw-say">' + note + '</p>' +
          '<div class="bw-read' + (look.tone ? " tone-" + look.tone : "") + (pulsed ? " tick" : "") + '" aria-live="polite">' +
            '<div class="bw-digits"><b>' + m.text + '</b><span>' + m.unit + '</span></div>' +
            '<i class="bw-bar" aria-hidden="true"><em style="width:' + look.bar + '%"></em></i>' +
            '<small>' + look.tag + '</small>' +
          '</div>' +
          '<div class="bw-lamps">' + lamps + '</div>' +
          '<div class="bw-controls">' +
            '<button type="button" class="bw-extra' + (breaker ? " on" : "") + '" id="bw-brk">' + (breaker ? "Breaker on" : "Breaker off") + '</button>' +
            '<button type="button" class="bw-extra' + (door ? " on" : "") + '" id="bw-door">' + (door ? "Door held" : "Door open") + '</button>' +
            '<button type="button" class="bw-extra' + (call === "" ? " on" : "") + '" data-call="">Stat off</button>' +
            '<button type="button" class="bw-extra' + (call === "G" ? " on" : "") + '" data-call="G">Fan</button>' +
            '<button type="button" class="bw-extra' + (call === "W" ? " on" : "") + '" data-call="W">Heat</button>' +
          '</div>' +
          '<div class="bw-dial" role="group" aria-label="Meter dial">' +
            dialBtn("off", "OFF") + dialBtn("vac", "V~") + dialBtn("vdc", "V⎓") + dialBtn("ohm", "Ω") +
          '</div>' +
          '<div class="bw-leads">' +
            '<button type="button" class="bw-lead blk' + (hand === "blk" ? " on" : "") + '" id="bw-blk">Black lead</button>' +
            '<button type="button" class="bw-lead red' + (hand === "red" ? " on" : "") + '" id="bw-red">Red lead</button>' +
          '</div>' +
          '<div class="bw-board">' + GROUPS.map(groupHtml).join("") + '</div>' +
          '<button type="button" class="bw-next" id="bw-next"' + (g.ok ? "" : " disabled") + '>Next</button>' +
        '</div>';
      bind();
    }

    function lamp(label, on) {
      return '<span class="bw-lamp' + (on ? " on" : "") + '">' + label + '</span>';
    }

    function dialBtn(id, label) {
      return '<button type="button" class="bw-dialbtn' + (dial === id ? " on" : "") + '" data-dial="' + id + '">' + label + '</button>';
    }

    function groupHtml(group) {
      return '<div class="bw-group"><p>' + group.name + '</p><div class="bw-spots">' + group.ids.map(spotBtn).join("") + '</div></div>';
    }

    function spotBtn(id) {
      var s = spec();
      var gold = s && ((s.kind === "jack" && s.spot === id) || (s.kind === "pair" && (s.blk === id || s.red === id)));
      var seated = "";
      if (jacks.blk === id || placed.blk === id) seated += " blk";
      if (jacks.red === id || placed.red === id) seated += " red";
      var map = nodes();
      var hot = map[id] > 20 ? " hot" : "";
      return '<button type="button" class="bw-spot' + (gold ? " gold" : "") + seated + hot + '" data-spot="' + id + '">' + SPOTS[id] + '</button>';
    }

    function doneHtml(brand) {
      return '<div class="bw"><header class="bw-top"><p>' + brand + ' · Live board</p><button type="button" class="bw-back" id="bw-back">Shop floor</button></header>' +
        '<h2>You walked a live board</h2>' +
        '<ul class="bw-done"><li>The meter followed the leads. Nothing was a canned number.</li>' +
        '<li>Open the door and the transformer, the call, and the inducer die together.</li>' +
        '<li>Open switch: about 120 across it. Closed switch: about 0.</li>' +
        '<li>R to C is the 24-volt signal. G is the fan call, not ground.</li>' +
        '<li>Heat runs the inducer. Fan runs the blower. VDC does not show 120.</li>' +
        '<li>Ohms on a live circuit opens the fuse.</li></ul>' +
        '<button type="button" class="bw-next" id="bw-again">Walk it again</button></div>';
    }

    function bindDone() {
      var back = document.getElementById("bw-back");
      var again = document.getElementById("bw-again");
      if (back) back.onclick = function () { if (opts.onHub) opts.onHub(); };
      if (again) again.onclick = function () {
        step = 0; dial = "off"; jacks = { blk: "", red: "" }; placed = { blk: "", red: "" };
        breaker = true; door = false; call = ""; hand = "blk"; fuse = false;
        note = STEPS[0].say;
        paint();
      };
    }

    function bind() {
      var back = document.getElementById("bw-back");
      if (back) back.onclick = function () { if (opts.onHub) opts.onHub(); };
      root.querySelectorAll("[data-dial]").forEach(function (b) {
        b.onclick = function () {
          var nextDial = b.getAttribute("data-dial");
          if (nextDial === "vac" || nextDial === "off" || nextDial === "vdc") fuse = false;
          dial = nextDial;
          refreshNote();
          paint();
        };
      });
      ["blk", "red"].forEach(function (lead) {
        var el = document.getElementById(lead === "blk" ? "bw-blk" : "bw-red");
        if (!el) return;
        var moved = false;
        var x0 = 0;
        var y0 = 0;
        el.onpointerdown = function (e) {
          moved = false;
          x0 = e.clientX;
          y0 = e.clientY;
          drag = lead;
          hand = lead;
          try { el.setPointerCapture(e.pointerId); } catch (_) {}
        };
        el.onpointermove = function (e) {
          if (drag !== lead) return;
          if (Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 8) moved = true;
        };
        el.onpointerup = function (e) {
          if (drag !== lead) return;
          drag = null;
          if (!moved) { hand = lead; paint(); return; }
          var hit = document.elementFromPoint(e.clientX, e.clientY);
          var spot = hit && hit.closest ? hit.closest("[data-spot]") : null;
          if (spot) land(lead, spot.getAttribute("data-spot"));
          else { hand = lead; paint(); }
        };
      });
      root.querySelectorAll("[data-spot]").forEach(function (b) {
        b.onclick = function () { land(hand, b.getAttribute("data-spot")); };
      });
      var brk = document.getElementById("bw-brk");
      if (brk) brk.onclick = function () { breaker = !breaker; refreshNote(); paint(); };
      var doorBtn = document.getElementById("bw-door");
      if (doorBtn) doorBtn.onclick = function () { door = !door; refreshNote(); paint(); };
      root.querySelectorAll("[data-call]").forEach(function (b) {
        b.onclick = function () { call = b.getAttribute("data-call") || ""; refreshNote(); paint(); };
      });
      var next = document.getElementById("bw-next");
      if (next) next.onclick = function () {
        var g = grade();
        if (!g.ok) { note = g.note || "Do this step before Next."; paint(); return; }
        step += 1;
        if (STEPS[step]) note = STEPS[step].say;
        paint();
      };
    }

    var style = document.getElementById("bw-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "bw-style";
      document.head.appendChild(style);
    }
    style.textContent = [
      "#boardwalk-root{height:100%;overflow:auto;background:#0e141b;color:#f4efe6}",
      ".bw{box-sizing:border-box;max-width:560px;margin:0 auto;padding:12px 12px 28px}",
      ".bw-top{display:flex;justify-content:space-between;align-items:center;gap:8px}",
      ".bw-top p{margin:0;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#c9a227}",
      ".bw-back,.bw-extra,.bw-dialbtn,.bw-lead,.bw-spot,.bw-next{min-height:44px;border-radius:10px;border:1px solid #3d4a58;background:#1c2630;color:#f4efe6}",
      ".bw h2{margin:8px 0 4px;font-size:22px}",
      ".bw-count{margin:8px 0 0;color:#c9a227;font-size:13px}",
      ".bw-say{margin:4px 0 8px;line-height:1.4}",
      ".bw-read{display:grid;gap:6px;background:#121820;border:1px solid #3d4a58;border-radius:12px;padding:8px 12px}",
      ".bw-digits{display:flex;align-items:baseline;gap:8px}",
      ".bw-read b{font-size:32px;font-variant-numeric:tabular-nums}",
      ".bw-bar{display:block;height:8px;border-radius:99px;background:#1c2630;overflow:hidden}",
      ".bw-bar em{display:block;height:100%;width:0;background:#8d97a3;transition:width .2s ease}",
      ".bw-read small{font-size:12px;color:#cbb892}",
      ".bw-read.tone-cold{border-color:#7eb6d6}",
      ".bw-read.tone-cold b,.bw-read.tone-cold small{color:#9fd0ea}",
      ".bw-read.tone-cold .bw-bar em{background:#7eb6d6}",
      ".bw-read.tone-call{border-color:#e08a2c}",
      ".bw-read.tone-call b,.bw-read.tone-call small{color:#f0a35a}",
      ".bw-read.tone-call .bw-bar em{background:#e08a2c}",
      ".bw-read.tone-line{border-color:#e23b4a}",
      ".bw-read.tone-line b,.bw-read.tone-line small{color:#ff6b5a}",
      ".bw-read.tone-line .bw-bar em{background:#e23b4a}",
      ".bw-read.tone-fuse{border-color:#e23b4a;background:#3a1216}",
      ".bw-read.tone-fuse b,.bw-read.tone-fuse small{color:#ff6b5a}",
      ".bw-read.tone-fuse .bw-bar em{background:#e23b4a}",
      ".bw-read.tick b{animation:bw-tick .35s ease}",
      "@keyframes bw-tick{from{transform:translateY(-4px);opacity:.35}to{transform:none;opacity:1}}",
      "@media (prefers-reduced-motion:reduce){.bw-read.tick b,.bw-bar em{animation:none;transition:none}}",
      ".bw-lamps,.bw-controls,.bw-dial,.bw-leads,.bw-spots{display:flex;flex-wrap:wrap;gap:8px}",
      ".bw-lamps{margin-top:8px}",
      ".bw-lamp{font-size:12px;padding:4px 8px;border-radius:999px;border:1px solid #3d4a58;color:#8d97a3}",
      ".bw-lamp.on{color:#f3e2b0;animation:bw-glow 1.3s ease-in-out infinite}",
      ".bw-spot.hot{animation:bw-glow 1.3s ease-in-out infinite}",
      "@keyframes bw-glow{50%{filter:brightness(1.45)}}",
      "@media (prefers-reduced-motion:reduce){.bw-lamp.on,.bw-spot.hot,.bw-read.tick b{animation:none}}",
      ".bw-controls{margin-top:8px}",
      ".bw-dial{margin-top:8px}",
      ".bw-dialbtn.on,.bw-lead.on,.bw-extra.on{outline:2px solid #c9a227}",
      ".bw-lead.blk{box-shadow:inset 4px 0 0 #111}",
      ".bw-lead.red{box-shadow:inset 4px 0 0 #e23b4a}",
      ".bw-board{margin-top:8px;display:grid;gap:8px}",
      ".bw-group p{margin:0 0 4px;font-size:12px;color:#cbb892}",
      ".bw-spot{flex:1 1 96px}",
      ".bw-spot.gold{outline:2px solid #c9a227}",
      ".bw-spot.hot{color:#f3e2b0}",
      ".bw-spot.blk{box-shadow:inset 0 -3px 0 #e8e0d0}",
      ".bw-spot.red{box-shadow:inset 0 3px 0 #e23b4a}",
      ".bw-next{width:100%;margin-top:12px;background:#e23b4a;border-color:#e23b4a;font-weight:700}",
      ".bw-next:disabled{opacity:.45}",
      ".bw-done{padding-left:18px;line-height:1.45}",
      "#screen-boardwalk #student-dock{display:none !important}"
    ].join("");
    note = STEPS[0].say;
    paint();
    return { stop: function () { dead = true; root.innerHTML = ""; } };
  };

  global.BoardWalk = BoardWalk;
})(window);
