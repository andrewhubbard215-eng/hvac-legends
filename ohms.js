/* Ohm's Law school — projector demo + HVAC tickets.
   V = I × R. P = V × I. Transformer VA is a fuse with manners. */
(function (global) {
  "use strict";

  const BRAND = "HVAC Legends";

  function round(n, d) {
    const p = Math.pow(10, d == null ? 2 : d);
    return Math.round(n * p) / p;
  }

  const PRESETS = [
    { id: "coil", name: "24V coil (healthy)", V: 24, R: 48, va: 40, note: "Contactor / relay coil. ~0.5 A." },
    { id: "short", name: "24V coil (shorted)", V: 24, R: 4, va: 40, note: "Few ohms. Current cooks the 40 VA transformer." },
    { id: "heat", name: "5 kW strip @ 240V", V: 240, R: 11.52, va: 0, note: "About 20.8 A and about 11.5 Ω. I = 5000 W ÷ 240 V. R = V ÷ I." },
    { id: "crank", name: "Crankcase heater", V: 240, R: 1440, va: 0, note: "40 W belly-band. Warm, not a space heater." },
    { id: "pump", name: "120 V resistive load", V: 120, R: 80, va: 0, note: "I = 120 ÷ 80 = 1.5 A and P = V × I = 180 W. A motor winding's ohm reading is copper only — do not treat V ÷ R as its running amps." },
  ];

  const JOBS = [
    {
      id: "coil-r",
      title: "Healthy contactor coil",
      scene: "Coil pulled in on 24 VAC. Clamp says 0.50 A.",
      find: "R",
      formula: "R = V ÷ I",
      V: 24, I: 0.5, R: 48, P: 12,
      answer: 48,
      unit: "Ω",
      choices: [12, 24, 48, 96],
      why: "R = 24 / 0.5 = 48 Ω. That's a normal 24V coil. Don't condemn it.",
    },
    {
      id: "coil-short",
      title: "Shorted coil",
      scene: "Same 24 VAC. Coil reads 4 Ω on the meter. 40 VA transformer.",
      find: "I",
      formula: "I = V ÷ R",
      V: 24, I: 6, R: 4, P: 144,
      answer: 6,
      unit: "A",
      choices: [0.5, 1.67, 6, 24],
      why: "I = 24 / 4 = 6 A. Transformer max is 40 VA / 24 V = 1.67 A. That coil is a dead short. Swap the coil — the transformer may already be toasted.",
    },
    {
      id: "xfmr-va",
      title: "Will the 40 VA hold?",
      scene: "40 VA, 24 V secondary. Three contactors at 0.40 A each, thermostat 0.10 A.",
      find: "I",
      formula: "Imax = VA ÷ V",
      V: 24, I: 1.3, R: 18.5, P: 31.2,
      answer: 1.67,
      unit: "A",
      choices: [0.4, 1.3, 1.67, 40],
      why: "Max current = 40 / 24 = 1.67 A. Load is 1.30 A. It holds — barely leave room for a humidistat. Add a fourth contactor and you're in the smoke.",
      extra: "The question is the NAMEPLATE max, 1.67 A — not the present load.",
    },
    {
      id: "strip-i",
      title: "Electric heat amps",
      scene: "4.8 kW strip at 240 V. What's the current?",
      find: "I",
      formula: "I = P ÷ V",
      plug: "4800 W ÷ 240 V",
      V: 240, I: 20, R: 12, P: 4800,
      answer: 20,
      unit: "A",
      choices: [4.8, 12, 20, 240],
      why: "I = 4800 W / 240 V = 20 A. Two-pole 30 A is the usual breaker. Don't put it on a 15.",
    },
    {
      id: "strip-r",
      title: "Strip heat resistance",
      scene: "Same 240 V / 20 A strip. What should an ohm reading be with power OFF?",
      find: "R",
      formula: "R = V ÷ I",
      V: 240, I: 20, R: 12, P: 4800,
      answer: 12,
      unit: "Ω",
      choices: [0.8, 12, 20, 240],
      why: "R = 240 / 20 = 12 Ω. Infinite = open element. Near 0 = dead short. Kill power before you ohm it.",
    },
    {
      id: "drop",
      title: "Long 18-gauge run",
      scene: "24.0 V at the transformer. 21.0 V at the coil. Coil current 0.50 A. Extra resistance in the wire?",
      find: "R",
      formula: "R = (Vxfmr − Vcoil) ÷ I",
      V: 3, I: 0.5, R: 6, P: 1.5,
      answer: 6,
      unit: "Ω",
      choices: [1.5, 3, 6, 21],
      why: "Voltage drop 3 V. R = 3 / 0.5 = 6 Ω of wire. That's a long, skinny 24V run. Upsize the thermostat cable or the coil chatters.",
    },
    {
      id: "pump",
      title: "Condensate pump watts",
      scene: "Pump on 120 V, 1.50 A. Power?",
      find: "P",
      formula: "P = V × I",
      V: 120, I: 1.5, R: 80, P: 180,
      answer: 180,
      unit: "W",
      choices: [80, 120, 180, 800],
      why: "P = 120 × 1.5 = 180 W. Watts are V × I, not the ohm reading. If it hums and draws 8 A, the impeller is locked — that's not running amps.",
    },
    {
      id: "lra",
      title: "Compressor running amps",
      scene: "Power off, the compressor winding reads 2.4 Ω of copper. Nameplate: 240 V, RLA 13.4 A, LRA 60 A. What is the running current?",
      find: "I",
      formula: "Running amps are nameplate RLA — not V ÷ R, and not LRA",
      V: 240, I: 13.4, R: 2.4, P: 3216,
      answer: 13.4,
      unit: "A",
      choices: [2.4, 13.4, 60, 100],
      why: "The ohm reading is copper only. V ÷ R = 240 / 2.4 = 100 A is not the running current. LRA 60 A is locked-rotor inrush, not RLA. Don't size a breaker from inrush. Running current is the nameplate RLA, 13.4 A.",
    },
  ];

  const GUIDE = [
    {
      id: "hose",
      title: "It's a garden hose",
      say: "Tap Next. Forget the letters and look at the hose. Water in a hose. Pressure is how hard you push. Flow is how much comes out. A kink is resistance. Electricity is the same trick with different names.",
    },
    {
      id: "letters",
      title: "Three letters. That's the whole law.",
      say: "V = volts = pressure (the transformer push). I = amps = flow (what the wire actually carries). R = ohms = how tight the pipe is (coil, heater, skinny thermostat wire). More kink, less flow. Always.",
    },
    {
      id: "triangle",
      title: "Cover what you want",
      say: "Want amps? Cover I. What's left is V ÷ R. Want ohms? Cover R. That's V ÷ I. Want volts? Cover V. That's I × R. You are not memorizing. You are covering a letter.",
    },
    {
      id: "drag",
      title: "Drag the kink",
      say: "That slider is R — how tight the pipe is. Slide it LEFT (less ohms). Watch amps climb. Slide it RIGHT. Amps drop. That's Ohm's law in your thumb. Do it.",
      wait: "drag",
    },
    {
      id: "healthy",
      title: "A healthy 24V coil",
      say: "Tap “24V coil (healthy)”. 24 volts, about 48 ohms. Current should sit near 0.5 A. Transformer is happy. That's a pulled-in contactor on a good day.",
      wait: "preset:coil",
    },
    {
      id: "short",
      title: "Now short it",
      say: "Tap “24V coil (shorted)”. Few ohms. Current goes stupid. 40 VA transformer max is 1.67 A — this coil asks for 6. That's smoke. Swap the coil before you cook the transformer.",
      wait: "preset:short",
    },
    {
      id: "va",
      title: "VA is a fuse with manners",
      say: "VA ÷ volts = how many amps that transformer can give. 40 ÷ 24 = 1.67 A. Add coils until you go over and the 24V sags. That's chatter, not a bad thermostat.",
    },
    {
      id: "drop",
      title: "Long skinny wire",
      say: "Transformer says 24 V. Coil only sees 21 V. The missing 3 volts got spent in the wire. That's voltage drop. Upsize the cable or the coil chatters. Same law: leftover volts ÷ amps = ohms of wire.",
    },
    {
      id: "ticket",
      title: "You try one. I'll hold the formula.",
      say: "Tickets next. Formula stays on the card. Plug the numbers in. Wrong is fine — I'll walk the math. Cover the letter you want.",
    },
  ];

  function currentDiff() {
    const d = global.LtDiff;
    return d === "easy" || d === "spicy" ? d : "medium";
  }

  function shuffle(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = x[i];
      x[i] = x[j];
      x[j] = t;
    }
    return x;
  }

  function OhmsLab(host, opts) {
    const onHub = opts && opts.onHub;
    const onXp = opts && opts.onXp;
    let tab = "tickets";
    let preset = PRESETS[0];
    let V = preset.V;
    let R = preset.R;
    let jobI = 0;
    let locked = false;
    let streak = 0;
    let right = 0;
    let deadline = 0;
    let timer = 0;
    let lastFb = "";
    let gi = 0;
    let dragged = false;
    let lives = 3;
    let score = 0;
    let cleared = false;
    let dead = false;
    let order = null;
    let orderFor = "";
    let lastPick = null;

    function Iof() {
      return R > 0.01 ? V / R : 99;
    }
    function Pof() {
      return V * Iof();
    }
    function vaMax() {
      return preset.va ? preset.va / V : 0;
    }
    function overloaded() {
      const m = vaMax();
      return m > 0 && Iof() > m * 0.98;
    }

    function job() {
      return JOBS[jobI] || JOBS[0];
    }

    function circuitSvg(v, i, r, smoke) {
      const glow = smoke ? "#CE0034" : "#3dd68c";
      return (
        '<svg class="ohms-svg" viewBox="0 0 360 160" aria-hidden="true">' +
        '<rect x="8" y="40" width="70" height="80" rx="8" fill="#1c2126" stroke="#CE0034" stroke-width="3"/>' +
        '<text x="43" y="74" text-anchor="middle" fill="#f4efe6" font-size="11" font-family="IBM Plex Sans,sans-serif">SOURCE</text>' +
        '<text x="43" y="94" text-anchor="middle" fill="#e8c450" font-size="16" font-weight="700">' +
        round(v, 1) +
        " V</text>" +
        '<line x1="78" y1="55" x2="150" y2="55" stroke="' +
        glow +
        '" stroke-width="4"/>' +
        '<rect x="150" y="18" width="70" height="28" rx="4" fill="#111" stroke="#e8c450"/>' +
        '<text x="185" y="38" text-anchor="middle" fill="#e8c450" font-size="12">A ' +
        round(i, 2) +
        "</text>" +
        '<line x1="220" y1="55" x2="280" y2="55" stroke="' +
        glow +
        '" stroke-width="4"/>' +
        '<rect x="280" y="40" width="70" height="80" rx="8" fill="#1c2126" stroke="#e8c450" stroke-width="3"/>' +
        '<text x="315" y="74" text-anchor="middle" fill="#f4efe6" font-size="11">LOAD</text>' +
        '<text x="315" y="94" text-anchor="middle" fill="#e8c450" font-size="16" font-weight="700">' +
        round(r, 1) +
        " Ω</text>" +
        '<line x1="315" y1="120" x2="315" y2="140" stroke="' +
        glow +
        '" stroke-width="4"/>' +
        '<line x1="315" y1="140" x2="43" y2="140" stroke="' +
        glow +
        '" stroke-width="4"/>' +
        '<line x1="43" y1="140" x2="43" y2="120" stroke="' +
        glow +
        '" stroke-width="4"/>' +
        (smoke
          ? '<text x="180" y="158" text-anchor="middle" fill="#CE0034" font-size="12" font-weight="700">TRANSFORMER OVERLOADED</text>'
          : "") +
        "</svg>"
      );
    }

    function triangleSvg(cover) {
      const dim = function (k) {
        return cover === k ? 'opacity="0.15"' : "";
      };
      return (
        '<svg class="ohms-tri" viewBox="0 0 180 110" aria-hidden="true">' +
        '<polygon points="90,8 170,100 10,100" fill="#1c2126" stroke="#e8c450" stroke-width="3"/>' +
        '<text x="90" y="42" text-anchor="middle" fill="#e8c450" font-size="22" font-weight="700" ' +
        dim("V") +
        ">V</text>" +
        '<line x1="40" y1="72" x2="140" y2="72" stroke="#3a4550"/>' +
        '<text x="55" y="96" text-anchor="middle" fill="#8ec8ff" font-size="20" font-weight="700" ' +
        dim("I") +
        ">I</text>" +
        '<text x="90" y="96" text-anchor="middle" fill="#8b98a5" font-size="16">×</text>' +
        '<text x="125" y="96" text-anchor="middle" fill="#7fd99a" font-size="20" font-weight="700" ' +
        dim("R") +
        ">R</text>" +
        "</svg>"
      );
    }

    function guideStep() {
      return GUIDE[Math.min(gi, GUIDE.length - 1)];
    }

    function maybeGuide(kind, extra) {
      const s = guideStep();
      if (tab !== "guide" || !s || !s.wait) return;
      if (s.wait === "drag" && kind === "drag") {
        gi = Math.min(gi + 1, GUIDE.length - 1);
        paint();
      }
      if (s.wait === "preset:" + extra && kind === "preset") {
        gi = Math.min(gi + 1, GUIDE.length - 1);
        paint();
      }
    }

    function paint() {
      const d = currentDiff();
      const i = Iof();
      const p = Pof();
      const smoke = overloaded();
      const j = job();
      host.innerHTML =
        '<div class="ohms">' +
        '<header class="ohms-bar">' +
        '<button type="button" class="btn" id="ohms-hub">Shop floor</button>' +
        "<h2>Ohm's Law</h2>" +
        '<span class="ohms-scoreboard"><b>' +
        score +
        "</b> pts</span>" +
        '<span class="ohms-lives" aria-label="' +
        lives +
        ' lives">' +
        "♥".repeat(Math.max(0, lives)) +
        "♡".repeat(Math.max(0, 3 - lives)) +
        "</span>" +
        "</header>" +
        '<p class="ohms-eq">' +
        BRAND +
        " · V = I × R &nbsp;·&nbsp; I = V ÷ R &nbsp;·&nbsp; R = V ÷ I &nbsp;·&nbsp; P = V × I</p>" +
        '<div class="ohms-tabs" id="ohms-tabs">' +
        '<button type="button" class="btn' +
        (tab === "guide" ? " primary" : "") +
        '" data-tab="guide">Guided · hold my hand</button>' +
        '<button type="button" class="btn' +
        (tab === "demo" ? " primary" : "") +
        '" data-tab="demo">Play with it</button>' +
        '<button type="button" class="btn' +
        (tab === "tickets" ? " primary" : "") +
        '" data-tab="tickets">Play the bay</button>' +
        "</div>" +
        (tab === "guide" ? paintGuide(i, p, smoke) : tab === "demo" ? paintDemo(i, p, smoke, d) : paintTickets(j, d)) +
        "</div>";
      bind();
      if (smoke && global.LtDrip) global.LtDrip.say("ohms.smoke");
      else if (preset && preset.id === "coil" && global.LtDrip) global.LtDrip.say("ohms.coil");
      else if (preset && preset.id === "short" && global.LtDrip) global.LtDrip.say("ohms.smoke");
    }

    function paintDemo(i, p, smoke, d) {
      return (
        '<div class="ohms-demo">' +
        '<p class="ohms-hub-line">Throw this on the projector. Drag resistance. Watch current. Short the coil — the 40 VA dies.</p>' +
        circuitSvg(V, i, R, smoke) +
        '<div class="ohms-read">' +
        '<div><b>V</b><span>' +
        round(V, 1) +
        " V</span></div>" +
        '<div><b>I</b><span class="' +
        (smoke ? "hot" : "") +
        '">' +
        round(i, 2) +
        " A</span></div>" +
        '<div><b>R</b><span>' +
        round(R, 1) +
        " Ω</span></div>" +
        '<div><b>P</b><span>' +
        round(p, 0) +
        " W</span></div>" +
        "</div>" +
        (preset.va
          ? '<p class="ohms-va">Transformer ' +
            preset.va +
            " VA · max " +
            round(vaMax(), 2) +
            " A" +
            (smoke ? " · <strong>OVERLOADED</strong>" : " · holding") +
            "</p>"
          : "") +
        '<label class="ohms-slide">Resistance (coil / heater / wire)' +
        '<input id="ohms-r" type="range" min="1" max="2000" step="1" value="' +
        Math.min(2000, Math.max(1, Math.round(R))) +
        '" /></label>' +
        '<div class="ohms-presets" id="ohms-presets">' +
        PRESETS.map(function (pr) {
          return (
            '<button type="button" class="btn' +
            (preset.id === pr.id ? " primary" : "") +
            '" data-pre="' +
            pr.id +
            '">' +
            pr.name +
            "</button>"
          );
        }).join("") +
        "</div>" +
        '<p class="ohms-note">' +
        preset.note +
        (d === "easy"
          ? " HUB: drop R and I climbs. That's a shorted coil cooking the transformer."
          : "") +
        "</p>" +
        "</div>"
      );
    }

    function paintGuide(i, p, smoke) {
      const s = guideStep();
      const last = gi >= GUIDE.length - 1;
      const cover = s.id === "triangle" ? "I" : s.id === "letters" ? "" : "";
      const plug =
        s.id === "healthy"
          ? "I = V ÷ R = 24 ÷ 48 = 0.50 A"
          : s.id === "short"
            ? "I = V ÷ R = 24 ÷ 4 = 6 A  ·  xfmr max 40÷24 = 1.67 A"
            : s.id === "va"
              ? "Imax = VA ÷ V = 40 ÷ 24 = 1.67 A"
              : s.id === "drop"
                ? "Rwire = (24 − 21) ÷ 0.50 = 6 Ω"
                : s.id === "drag"
                  ? "Slide left → R drops → I climbs. Slide right → I falls."
                  : "Pressure × how open the pipe is = flow. V = I × R.";
      return (
        '<div class="ohms-demo ohms-guided">' +
        '<div class="ohms-coach"><p class="eyebrow">GUIDED · ' +
        (gi + 1) +
        "/" +
        GUIDE.length +
        "</p><strong>" +
        s.title +
        "</strong><p>" +
        s.say +
        "</p></div>" +
        (s.id === "hose" || s.id === "letters" || s.id === "triangle"
          ? '<div class="ohms-hose">' +
            '<div><b>V · volts</b><span>Pressure. How hard the transformer pushes.</span></div>' +
            '<div><b>I · amps</b><span>Flow. What actually runs in the wire.</span></div>' +
            '<div><b>R · ohms</b><span>Kink. Coil, heater, or skinny cable fighting the flow.</span></div>' +
            "</div>"
          : "") +
        (s.id === "triangle" || s.id === "ticket" ? triangleSvg(s.id === "triangle" ? "I" : "") : "") +
        (s.id === "triangle" ? '<p class="ohms-formula">Cover I → <strong>I = V ÷ R</strong>. Cover R → <strong>R = V ÷ I</strong>. Cover V → <strong>V = I × R</strong>.</p>' : "") +
        (s.id !== "hose" && s.id !== "letters" && s.id !== "triangle" && s.id !== "ticket"
          ? circuitSvg(V, i, R, smoke)
          : "") +
        (s.id === "drag" || s.id === "healthy" || s.id === "short" || s.id === "va"
          ? '<div class="ohms-read">' +
            '<div class="' +
            (s.id === "va" ? "lit" : "") +
            '"><b>V</b><span>' +
            round(V, 1) +
            " V</span></div>" +
            '<div class="lit"><b>I</b><span class="' +
            (smoke ? "hot" : "") +
            '">' +
            round(i, 2) +
            " A</span></div>" +
            '<div class="lit"><b>R</b><span>' +
            round(R, 1) +
            " Ω</span></div>" +
            '<div><b>P</b><span>' +
            round(p, 0) +
            " W</span></div></div>"
          : "") +
        (preset.va && (s.id === "short" || s.id === "healthy" || s.id === "va")
          ? '<p class="ohms-va">Transformer ' +
            preset.va +
            " VA · max " +
            round(vaMax(), 2) +
            " A" +
            (smoke ? " · <strong>OVERLOADED — that's the smoke</strong>" : " · holding") +
            "</p>"
          : "") +
        (s.id === "drag" || s.id === "healthy" || s.id === "short"
          ? '<label class="ohms-slide">Resistance — this is the kink in the hose' +
            '<input id="ohms-r" type="range" min="1" max="200" step="1" value="' +
            Math.min(200, Math.max(1, Math.round(R))) +
            '" /></label>'
          : "") +
        (s.id === "healthy" || s.id === "short"
          ? '<div class="ohms-presets" id="ohms-presets">' +
            '<button type="button" class="btn' +
            (preset.id === "coil" ? " primary" : "") +
            '" data-pre="coil">24V coil (healthy)</button>' +
            '<button type="button" class="btn' +
            (preset.id === "short" ? " primary" : "") +
            '" data-pre="short">24V coil (shorted)</button></div>'
          : "") +
        '<p class="ohms-formula">' +
        plug +
        "</p>" +
        '<div class="ohms-nav">' +
        '<button type="button" class="btn" id="ohms-gback"' +
        (gi === 0 ? " disabled" : "") +
        ">Back</button>" +
        '<button type="button" class="btn primary" id="ohms-gnext">' +
        (last ? "Got it · tickets" : s.wait ? "I'm stuck — next" : "Next") +
        "</button>" +
        "</div></div>"
      );
    }

    function ensureOrder() {
      const j = job();
      if (!order || orderFor !== j.id) {
        order = shuffle(j.choices.slice());
        orderFor = j.id;
      }
    }

    function paintTickets(j, d) {
      ensureOrder();
      const clock =
        d === "spicy" && deadline
          ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
          : 0;
      if (cleared) {
        return (
          '<div class="ohms-tickets ohms-bay">' +
          '<p class="ohms-win">Bay cleared</p>' +
          "<h3>" + score + " points</h3>" +
          "<p>Eight calls. You covered the letter and the math held.</p>" +
          '<button type="button" class="btn primary" id="ohms-retry">Run it again</button>' +
          "</div>"
        );
      }
      if (dead) {
        return (
          '<div class="ohms-tickets ohms-bay">' +
          '<p class="ohms-dead">Out of lives</p>' +
          "<h3>Score " + score + "</h3>" +
          "<p>" + lastFb + "</p>" +
          '<button type="button" class="btn primary" id="ohms-retry">New bay</button>' +
          "</div>"
        );
      }
      return (
        '<div class="ohms-tickets ohms-bay">' +
        '<div class="ohms-level"><span>Call ' +
        (jobI + 1) +
        " / " +
        JOBS.length +
        "</span><span>Streak ×" +
        Math.max(1, streak) +
        "</span>" +
        (d === "spicy" ? '<span class="ohms-clock">' + clock + "s</span>" : "") +
        "</div>" +
        "<h3>" +
        j.title +
        "</h3>" +
        "<p>" +
        j.scene +
        "</p>" +
        triangleSvg(j.find) +
        '<p class="ohms-formula">Cover <strong>' +
        j.find +
        "</strong>. " +
        (d === "spicy" ? "No formula on the card." : j.formula) +
        (j.extra ? " " + j.extra : "") +
        "</p>" +
        '<p class="ohms-ask">Tap the ' +
        (j.find === "P" ? "watts" : j.find === "I" ? "amps" : "ohms") +
        ", or type the number.</p>" +
        '<div class="ohms-choices" id="ohms-choices">' +
        order
          .map(function (c) {
            let mark = "";
            if (locked) {
              if (Math.abs(Number(c) - j.answer) < 0.051) mark = "outline:3px solid #7fd99a;";
              else if (lastPick != null && Math.abs(Number(c) - Number(lastPick)) < 0.051) mark = "outline:3px solid #CE0034;opacity:0.55;";
              else mark = "opacity:0.45;";
            }
            return (
              '<button type="button" class="ohms-tile" data-ans="' +
              c +
              '" style="' +
              mark +
              '"' +
              (locked ? " disabled" : "") +
              "><b>" +
              c +
              "</b><span>" +
              j.unit +
              "</span></button>"
            );
          })
          .join("") +
        "</div>" +
        (locked
          ? ""
          : '<div class="ohms-nav" id="ohms-num">' +
            '<input id="ohms-ans" inputmode="decimal" autocomplete="off" enterkeyhint="done" placeholder="Type ' +
            j.unit +
            '" aria-label="Answer in ' +
            j.unit +
            '" style="flex:1;min-width:120px;min-height:48px;padding:8px 12px;border-radius:12px;border:2px solid #3a4550;background:#1c2126;color:#fff;font-size:20px"/>' +
            '<button type="button" class="btn primary" id="ohms-check">Check</button></div>') +
        (lastFb ? '<p class="ohms-fb" id="ohms-fb">' + lastFb + "</p>" : "") +
        '<div class="ohms-nav">' +
        '<button type="button" class="btn primary" id="ohms-next"' +
        (locked ? "" : " hidden") +
        ">Next question</button>" +
        "</div></div>"
      );
    }

    function resetBay() {
      lives = 3;
      score = 0;
      streak = 0;
      right = 0;
      jobI = 0;
      locked = false;
      cleared = false;
      dead = false;
      lastFb = "";
      order = shuffle(JOBS[0].choices.slice());
      orderFor = JOBS[0].id;
      lastPick = null;
      deadline = currentDiff() === "spicy" ? Date.now() + 20000 : 0;
      paint();
    }

    function grade(val) {
      if (locked || dead || cleared) return;
      if (val == null || String(val).trim() === "" || !isFinite(Number(val))) {
        lastFb = "Type the number, or tap a tile. Blank doesn't count.";
        paint();
        return;
      }
      const j = job();
      const n = Number(val);
      const ok = Math.abs(n - j.answer) < 0.051;
      locked = true;
      lastPick = n;
      deadline = 0;
      if (ok) {
        streak++;
        right++;
        score += 100 * streak;
        lastFb = "<strong>That's the call.</strong> " + j.why;
        if (onXp) onXp(20);
        if (global.CurriculumTrain) global.CurriculumTrain.stamp("ohms");
        if (global.LtDrip) {
          if (j.id === "drop") global.LtDrip.say("ohms.drop", true);
          else if (j.id === "xfmr-va") global.LtDrip.say("ohms.va", true);
          else if (j.id === "coil-short") global.LtDrip.say("ohms.smoke", true);
        }
      } else {
        streak = 0;
        lives--;
        lastFb = "<strong>Not that one.</strong> " + j.answer + " " + j.unit + ". " + j.why;
        if (lives <= 0) dead = true;
      }
      paint();
    }

    function nextJob() {
      if (dead || cleared) return;
      if (jobI >= JOBS.length - 1) {
        cleared = true;
        locked = true;
        paint();
        return;
      }
      jobI += 1;
      locked = false;
      lastFb = "";
      lastPick = null;
      order = null;
      orderFor = "";
      const d = currentDiff();
      deadline = d === "spicy" ? Date.now() + 20000 : 0;
      paint();
    }

    function bind() {
      const hub = host.querySelector("#ohms-hub");
      if (hub) hub.onclick = function () {
        if (onHub) onHub();
      };
      const tabs = host.querySelector("#ohms-tabs");
      if (tabs) {
        tabs.onclick = function (e) {
          const b = e.target.closest("[data-tab]");
          if (!b) return;
          tab = b.getAttribute("data-tab");
          lastFb = "";
          if (tab !== "tickets") locked = false;
          if (tab === "tickets") {
            ensureOrder();
            if (currentDiff() === "spicy" && !deadline && !locked) deadline = Date.now() + 20000;
          }
          paint();
        };
      }
      const sl = host.querySelector("#ohms-r");
      if (sl) {
        sl.oninput = function () {
          R = +sl.value;
          dragged = true;
          paintKeepSlider(sl);
          maybeGuide("drag");
        };
      }
      const pres = host.querySelector("#ohms-presets");
      if (pres) {
        pres.onclick = function (e) {
          const b = e.target.closest("[data-pre]");
          if (!b) return;
          preset = PRESETS.find(function (p) {
            return p.id === b.getAttribute("data-pre");
          }) || PRESETS[0];
          V = preset.V;
          R = preset.R;
          maybeGuide("preset", preset.id);
          paint();
        };
      }
      const ch = host.querySelector("#ohms-choices");
      if (ch) {
        ch.onclick = function (e) {
          const b = e.target.closest("[data-ans]");
          if (!b || b.disabled) return;
          grade(b.getAttribute("data-ans"));
        };
      }
      const check = host.querySelector("#ohms-check");
      const ans = host.querySelector("#ohms-ans");
      if (check) {
        check.onclick = function () {
          grade(ans ? ans.value : "");
        };
      }
      if (ans) {
        ans.onkeydown = function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            grade(ans.value);
          }
        };
      }
      const retry = host.querySelector("#ohms-retry");
      if (retry) retry.onclick = resetBay;
      const nx = host.querySelector("#ohms-next");
      if (nx) nx.onclick = nextJob;
      const gb = host.querySelector("#ohms-gback");
      if (gb) {
        gb.onclick = function () {
          if (gi > 0) {
            gi--;
            paint();
          }
        };
      }
      const gn = host.querySelector("#ohms-gnext");
      if (gn) {
        gn.onclick = function () {
          if (gi >= GUIDE.length - 1) {
            tab = "tickets";
            resetBay();
            return;
          }
          gi++;
          if (GUIDE[gi] && GUIDE[gi].id === "healthy") {
            preset = PRESETS[0];
            V = preset.V;
            R = preset.R;
          }
          if (GUIDE[gi] && GUIDE[gi].id === "short") {
            preset = PRESETS[1];
            V = preset.V;
            R = preset.R;
          }
          paint();
        };
      }
    }

    function paintKeepSlider(sl) {
      /* full paint resets the range thumb mid-drag — update readouts only */
      const i = Iof();
      const p = Pof();
      const smoke = overloaded();
      const svg = host.querySelector(".ohms-svg");
      if (svg) {
        const wrap = document.createElement("div");
        wrap.innerHTML = circuitSvg(V, i, R, smoke);
        svg.replaceWith(wrap.firstChild);
      }
      const cells = host.querySelectorAll(".ohms-read span");
      if (cells[0]) cells[0].textContent = round(V, 1) + " V";
      if (cells[1]) {
        cells[1].textContent = round(i, 2) + " A";
        cells[1].classList.toggle("hot", smoke);
      }
      if (cells[2]) cells[2].textContent = round(R, 1) + " Ω";
      if (cells[3]) cells[3].textContent = round(p, 0) + " W";
      const va = host.querySelector(".ohms-va");
      if (va && preset.va) {
        va.innerHTML =
          "Transformer " +
          preset.va +
          " VA · max " +
          round(vaMax(), 2) +
          " A" +
          (smoke ? " · <strong>OVERLOADED</strong>" : " · holding");
      }
    }

    function tick() {
      if (tab === "tickets" && currentDiff() === "spicy" && deadline && !locked) {
        const left = Math.ceil((deadline - Date.now()) / 1000);
        const el = host.querySelector(".ohms-clock");
        if (el) el.textContent = Math.max(0, left) + "s";
        if (left <= 0) {
          locked = true;
          streak = 0;
          lives--;
          const j = job();
          lastFb = "<strong>Time.</strong> " + j.answer + " " + j.unit + ". " + j.why;
          if (lives <= 0) dead = true;
          paint();
        }
      }
    }

    paint();
    timer = setInterval(tick, 250);
    return {
      stop: function () {
        clearInterval(timer);
      },
    };
  }

  global.OhmsLab = {
    start: function (root, opts) {
      root.innerHTML = "";
      return OhmsLab(root, opts || {});
    },
  };
})(typeof window !== "undefined" ? window : this);
