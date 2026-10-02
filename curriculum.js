/* HVAC Legends — shop curriculum. Not a school catalog. */
(function (global) {
  "use strict";

  const UNITS = [
    {
      id: "bench",
      code: "01",
      title: "The bench",
      hours: "Shop",
      credits: "",
      topics: ["Meter before you touch it", "One right ohms reading", "Lockout before a live check"],
      labGoal: "Trust the meter before you trust the story.",
      practice: [{ mode: "ohms", label: "Ohms lab" }],
    },
    {
      id: "copper",
      code: "02",
      title: "Copper",
      hours: "Shop",
      credits: "",
      topics: ["Nut on the tube first", "A clean flare", "Nitrogen through the joint, not a blast"],
      labGoal: "The joint has to pass. A picture does not count.",
      practice: [
        { mode: "flare", label: "Flare a line" },
        { mode: "braze", label: "Braze with nitrogen" },
      ],
    },
    {
      id: "charge",
      code: "03",
      title: "The charge",
      hours: "Shop",
      credits: "",
      topics: ["Superheat and subcooling together", "Recovery hookup", "Name the fault before you add gas"],
      labGoal: "Read the manifold, move the refrigerant, then close the ticket.",
      practice: [
        { mode: "gauges", label: "Manifold school" },
        { mode: "recover", label: "Recovery hookup" },
        { mode: "service", label: "Service call" },
      ],
    },
    {
      id: "controls",
      code: "04",
      title: "The circuit",
      hours: "Shop",
      credits: "",
      topics: ["Land the lugs", "Find the open", "Do not jump a safety"],
      labGoal: "The call has a path. Follow it.",
      practice: [
        { mode: "electrical", label: "Land a device" },
        { mode: "defusal", label: "Saturday callback" },
        { mode: "iconnect", label: "Fault board" },
      ],
    },
    {
      id: "install",
      code: "05",
      title: "The install",
      hours: "Shop",
      credits: "",
      topics: ["Mini-split in order", "Compressor change-out", "A furnace that satisfies the heat call"],
      labGoal: "Commission it. Do not skip the vacuum.",
      practice: [
        { mode: "minisplit", label: "Mini-split install" },
        { mode: "compchange", label: "Compressor change-out" },
        { mode: "furnace", label: "Furnace sequence" },
      ],
    },
    {
      id: "card",
      code: "06",
      title: "The card",
      hours: "Shop",
      credits: "",
      topics: ["Which 608 type", "How empty", "80% by weight", "Recover, recycle, reclaim"],
      labGoal: "The card is a real sitting. The drill is the practice.",
      practice: [
        { mode: "e608type", label: "Which card" },
        { mode: "epa608", label: "608 drill" },
      ],
    },
  ];

  const AI_COACH = {
    bench: {
      focus: ["ohms", "meter", "lockout"],
      open: "Bench course — one right ohms reading, and why I lock out before I meter.",
      drills: ["Ohms", "Lockout", "Meter first"],
    },
    copper: {
      focus: ["flare", "torque", "nitrogen purge", "braze"],
      open: "Copper course — nut on first, then the flare, then nitrogen while I braze.",
      drills: ["Flare steps", "Torque", "Brazing"],
    },
    charge: {
      focus: ["superheat", "subcooling", "recovery", "do not top off"],
      open: "Charge course — read SH and SC together, then tell me when I am allowed to add gas.",
      drills: ["High SH and low SC means?", "Recovery hookup", "Airflow before charge"],
    },
    controls: {
      focus: ["contactor", "capacitor", "open circuit", "safety"],
      open: "Circuit course — land the lugs, find the open, and do not jump a safety.",
      drills: ["24 volt string", "Capacitor", "Diagnostic order"],
    },
    install: {
      focus: ["mini-split order", "vacuum", "compressor change", "furnace sequence"],
      open: "Install course — mini-split order, microns, then a heat call that actually satisfies.",
      drills: ["Mini-split install order", "How do I pull a vacuum?", "Furnace sequence"],
    },
    card: {
      focus: ["608 type", "recovery level", "80 percent", "three Rs"],
      open: "Card course — which 608 type, how empty, and why the tank stops at 80 percent.",
      drills: ["Which card", "EPA recovery rules", "80% fill"],
    },
  };

  /* Same shape as a Danfoss Learning program: short lesson, a level, a check, then a completion mark.
     The words are ours. Passing here is not a Danfoss certificate. */
  const PROGRAMS = [
    {
      id: "fund",
      level: "Basic",
      title: "Refrigeration fundamentals",
      blurb: "What the loop does before you touch a valve. The check is the last lesson.",
      lessons: [
        {
          id: "f1",
          title: "The compressor",
          text: "The compressor raises the pressure and temperature of vapor. It does not make cold. Cold happens later, when high-pressure liquid boils in the evaporator.",
          q: "What is the compressor doing?",
          choices: ["Raising vapor pressure and temperature", "Making cold air by itself", "Metering liquid into the coil"],
          ok: 0,
          why: "Cold is the evaporator boiling liquid. The compressor only moves and squeezes vapor."
        },
        {
          id: "f2",
          title: "The condenser",
          text: "Outdoors, the condenser rejects heat. Hot vapor in. Liquid out the bottom. The fan moves air, not refrigerant.",
          q: "What leaves the bottom of a working condenser?",
          choices: ["High-pressure liquid", "Cold vapor", "Oil only"],
          ok: 0,
          why: "If it rejected the heat, the refrigerant condensed. Liquid comes out the bottom."
        },
        {
          id: "f3",
          title: "Superheat and subcooling",
          text: "Superheat is suction-line temperature minus the dew point. Subcooling is the start of boiling minus liquid-line temperature. Read them together.",
          q: "High superheat and low subcooling means what?",
          choices: ["Not enough refrigerant in the system", "A dirty condenser", "The blower is too fast"],
          ok: 0,
          why: "The coil is starved and the condenser has little liquid stacked. That is an undercharge until a restriction proves otherwise."
        }
      ]
    },
    {
      id: "parts",
      level: "Basic",
      title: "Parts on the liquid line",
      blurb: "The valve, the drier, the glass, the coil. One job each.",
      lessons: [
        {
          id: "p1",
          title: "The TXV",
          text: "A TR6 or a T2 meters liquid. The bulb belongs on the suction line, at 4 or 8 o'clock, tight and insulated. Not at 6 o'clock in the oil. Opening the stem feeds more liquid and drops superheat.",
          q: "Superheat is high and subcooling is normal. What do you do first?",
          choices: ["Check the bulb, then open the valve a little", "Add refrigerant", "Close the valve to raise head pressure"],
          ok: 0,
          why: "Normal subcooling means the charge is not the story. A valve that is too far closed starves the coil."
        },
        {
          id: "p2",
          title: "The drier and the glass",
          text: "The filter-drier sits in the liquid line, arrow with the flow. Put a new one in whenever the circuit was opened. Bubbles in the sight glass can be a low charge, a restriction, or just the first minute after start. Bubbles alone are not an order to add gas.",
          q: "When do you replace the filter-drier?",
          choices: ["Whenever the refrigerant circuit was opened", "Only if the glass is clear", "Once a year, whether or not you opened it"],
          ok: 0,
          why: "Air and moisture went in when the system was open. The old drier is used up."
        },
        {
          id: "p3",
          title: "The solenoid coil",
          text: "A solenoid stops or starts liquid flow. The coil should click and pull in. A magnet on the stem tells you if the plunger moved. A coil that is powered and not seated will burn.",
          q: "The coil is powered and the valve did not click. What is the safe read?",
          choices: ["The plunger did not pull in. Check the coil and the valve.", "Add gas until it clicks", "Jump the coil out of the circuit and leave"],
          ok: 0,
          why: "No click means no pull-in. Gas will not fix a coil, and jumping it leaves the valve where it stuck."
        }
      ]
    },
    {
      id: "fix",
      level: "Intermediate",
      title: "Install and troubleshoot",
      blurb: "Put it in so it lasts, then do not treat every low pressure as a low charge.",
      lessons: [
        {
          id: "x1",
          title: "While you braze",
          text: "Nitrogen flows through the pipe while the joint is made. Oxygen does not. A nitrogen purge keeps the scale out of the TXV and the compressor.",
          q: "What flows through the pipe while you braze?",
          choices: ["Nitrogen, flowing, not blasting", "Oxygen, so the joint burns clean", "Refrigerant, to keep the pressure up"],
          ok: 0,
          why: "Oxygen and refrigerant do not belong in a brazing purge. Nitrogen does."
        },
        {
          id: "x2",
          title: "How you charge a TXV",
          text: "On a TXV system you weigh the nameplate plus the lineset adder, then prove it with subcooling. The sight glass is not the scale.",
          q: "The lineset is longer than the nameplate allows. What do you add?",
          choices: ["The ounces per foot from the chart, on a scale", "Gas until the glass clears", "Whatever the suction gauge looks like"],
          ok: 0,
          why: "Factory charge covers a rated length. Extra pipe needs a weighed adder, then a subcooling check."
        },
        {
          id: "x3",
          title: "Ice on the suction line",
          text: "A frozen suction line with superheat near zero is usually airflow. Filter, coil, blower. Thaw it before you trust the numbers. Do not add refrigerant to an iced coil.",
          q: "Suction line is iced and superheat is about zero. First move?",
          choices: ["Shut it down, thaw, fix the air, then recheck", "Add refrigerant because the pressure is low", "Chip the ice off while it runs"],
          ok: 0,
          why: "Low superheat means the coil is flooded or starved of air. Gas is the wrong direction."
        }
      ]
    },
    {
      id: "soft",
      level: "Field",
      title: "Field software",
      tool: "fieldsoft",
      blurb: "The slider, then the charge score. The tuner is not allowed to hide a leak.",
      lessons: [
        {
          id: "s1",
          title: "What the slider does",
          text: "A refrigerant slider converts a pressure you already measured into a saturation temperature. It does not clamp the pipe and it does not read your manifold. On a blend, superheat uses the dew point and subcooling uses the start of boiling.",
          q: "You type 118 psig for R-410A and the slider says about 40°F. What happened?",
          choices: ["It converted your pressure into saturation temperature", "It measured the suction line for you", "It added the factory charge"],
          ok: 0,
          why: "The number in is yours. The app only does the chart."
        },
        {
          id: "s2",
          title: "When not to turn the valve",
          text: "A tuner tells you which way to move the TXV stem. Stem out drops superheat. Stem in raises it. If subcooling is low and superheat is high, the tuner should stop you. That is a leak, not a stem.",
          q: "Superheat is 18°, target is 10°, subcooling is 4°. What should the tuner say?",
          choices: ["Do not turn the valve. Find the leak.", "Open the valve two full turns", "Add gas until the glass clears"],
          ok: 0,
          why: "Low subcooling with high superheat is an undercharge. Turning the valve hides it."
        },
        {
          id: "s3",
          title: "Piston or TXV",
          text: "On The call, a piston target comes from return wet-bulb and outdoor temperature. A TXV or EEV is charged by subcooling. When the numbers are in the band, leave the reading on the phone so the next tech can see what you left.",
          q: "Which metering device do you charge by subcooling?",
          choices: ["A TXV or an EEV", "A piston", "Whichever one has bubbles in the glass"],
          ok: 0,
          why: "The valve holds superheat. Subcooling tells you if the condenser has the right stack of liquid. A piston has no stem. You charge it to the wet-bulb chart."
        }
      ]
    }
  ];

  let lessonOpen = null;
  let lessonNote = "";

  function lessonDone(id) {
    return !!(progress.lessons && progress.lessons[id]);
  }

  function programDone(p) {
    return p.lessons.every(function (l) { return lessonDone(l.id); });
  }

  function findLesson(id) {
    for (let i = 0; i < PROGRAMS.length; i++) {
      for (let j = 0; j < PROGRAMS[i].lessons.length; j++) {
        if (PROGRAMS[i].lessons[j].id === id) return PROGRAMS[i].lessons[j];
      }
    }
    return null;
  }

  const TRACK = [
    {
      id: "bench",
      code: "01 Bench",
      title: "The bench",
      blurb: "The meter tells the truth. The story the last tech left does not.",
      labs: [
        { id: "ohms", mode: "ohms", label: "Ohms lab", xp: 20, what: "One right reading." },
      ],
    },
    {
      id: "copper",
      code: "02 Copper",
      title: "Copper",
      blurb: "A flare and a braze. The picture does not count until the joint is good.",
      labs: [
        { id: "flare", mode: "flare", label: "Flare a line", xp: 25, what: "Nut on first. Deburr. Clean 45°." },
        { id: "braze", mode: "braze", label: "Braze with nitrogen", xp: 25, what: "Both sides of the cup. Nitrogen flowing, not blasting." },
      ],
    },
    {
      id: "charge",
      code: "03 Charge",
      title: "The charge",
      blurb: "Read both numbers. Move the refrigerant. Then name the fault.",
      labs: [
        { id: "gauges", mode: "gauges", label: "Manifold school", xp: 30, what: "Call the charge from SH and SC." },
        { id: "recover", mode: "recover", label: "Recovery room", xp: 40, what: "Recover, nitrogen hold, decay test, weigh the extra, soap the leak." },
        { id: "service", mode: "service", label: "Service call", xp: 25, what: "Name the fault. One right call." },
      ],
    },
    {
      id: "controls",
      code: "04 Circuit",
      title: "The circuit",
      blurb: "Land it, meter the open, and leave the safeties in the circuit.",
      labs: [
        { id: "lugs", mode: "electrical", label: "Land a device", xp: 25, what: "Black, off-white, green. The can has to match." },
        { id: "callback", mode: "defusal", label: "Saturday callback", xp: 40, what: "Meter first. Close the no-cool." },
        { id: "tu522", mode: "iconnect", label: "Fault board", xp: 40, what: "Three faults. Do not jump a safety." },
      ],
    },
    {
      id: "install",
      code: "05 Install",
      title: "The install",
      blurb: "Commission the split, change the compressor, then satisfy a heat call.",
      labs: [
        { id: "minisplit", mode: "minisplit", label: "Mini-split install", xp: 50, what: "Right tool, then the whole install." },
        { id: "compchange", mode: "compchange", label: "Compressor change-out", xp: 40, what: "Recover, cut out, braze in, evacuate, weigh in." },
        { id: "furnace", mode: "furnace", label: "Furnace sequence", xp: 30, what: "Call for heat and let it run to blower." },
      ],
    },
    {
      id: "card",
      code: "06 Card",
      title: "The card",
      blurb: "Which card, how empty, the cylinder, the three R's, then the drill. The real sitting is still a proctor.",
      labs: [
        { id: "e608type", mode: "e608type", label: "Which card", xp: 25, what: "Type I, II, or III from the appliance." },
        { id: "e608vac", mode: "e608vac", label: "How empty", xp: 30, what: "0 inches, 10 inches, 90%, or 25 mm Hg." },
        { id: "e608cyl", mode: "e608cyl", label: "The cylinder", xp: 25, what: "80% by weight. Nitrogen, not oxygen." },
        { id: "e608rrr", mode: "e608rrr", label: "Three R's", xp: 25, what: "Recover, recycle, reclaim. New owner means reclaim." },
        { id: "epa608", mode: "epa608", label: "608 drill", xp: 40, what: "80% on a section." },
      ],
    },
  ];

  let root = null;
  let progress = { done: {}, xp: 0 };
  let onLaunch = null;
  let onBack = null;
  let onAskHub = null;

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem("lt-legends-course-v1") || "{}");
      progress = { done: raw.done || {}, xp: raw.xp || 0, lessons: raw.lessons || {} };
    } catch (_) {
      progress = { done: {}, xp: 0, lessons: {} };
    }
  }

  function saveProgress() {
    localStorage.setItem("lt-legends-course-v1", JSON.stringify(progress));
  }

  function labDone(id) {
    return !!(progress.done && progress.done[id]);
  }

  function viewTrack() {
    return TRACK;
  }

  function courseDone(c) {
    return c.labs.every(function (l) { return labDone(l.id); });
  }

  function stamp(mode) {
    loadProgress();
    let gained = 0;
    let name = "";
    TRACK.forEach(function (c) {
      c.labs.forEach(function (l) {
        if (l.mode === mode && !progress.done[l.id]) {
          progress.done[l.id] = true;
          gained += l.xp;
          name = l.label;
        }
      });
    });
    if (!gained) return 0;
    progress.xp = (progress.xp || 0) + gained;
    saveProgress();
    const n = Object.keys(progress.done).length;
    if (n >= 3 && global.Badges) global.Badges.unlock("curriculum_3");
    if (global.ltAddXp) global.ltAddXp(gained, name);
    if (global.LtCanvas && global.LtCanvas.credit) global.LtCanvas.credit(mode, name || mode);
    return gained;
  }

  function render() {
    const brand = global.LtBrand || { mark: "HL", org: "HVAC Legends", isStore: true };
    const track = viewTrack();
    const labs = [];
    track.forEach(function (c) { c.labs.forEach(function (l) { labs.push(l); }); });
    const doneCount = labs.filter(function (l) { return labDone(l.id); }).length;
    const pct = labs.length ? Math.round((doneCount / labs.length) * 100) : 0;
    const xp = progress.xp || 0;

    root.innerHTML =
      '<div class="cu-layout">' +
      '<header class="cu-head"><div>' +
      '<div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">' +
      '<div class="brand-mark" style="width:28px;height:28px;font-size:14px">' + brand.mark + "</div>" +
      '<div class="brand-word"><strong style="font-size:15px">' + brand.org + "</strong><span>Shop curriculum</span></div></div>" +
      "<h2>Four programs, then the shop labs.</h2>" +
      '<p class="cu-sub">A program is a short lesson and a check, the way a free cooling course is built. Pass the lesson before the next one unlocks. The shop labs under that are still the hands-on work. This completion mark is not a Danfoss certificate and not EPA 608.</p>' +
      "</div><div class=\"cu-progress\">" +
      '<div class="ms-bar"><i style="width:' + pct + '%"></i></div>' +
      "<span>" + doneCount + " / " + labs.length + " labs · " + xp + " course XP</span>" +
      '<button class="btn" id="cu-back">Shop floor</button></div></header>' +
      programHtml() +
      '<div class="cu-grid">' +
      track.map(function (c) {
        const finished = courseDone(c);
        return (
          '<article class="cu-card ' + (finished ? "done" : "") + '"><header><span class="cu-code">' + c.code + "</span>" +
          (finished ? '<span class="cu-badge">Course complete</span>' : "") +
          "</header><h3>" + c.title + '</h3><p class="cu-goal">' + c.blurb + '</p><div class="cu-actions">' +
          c.labs.map(function (l, i) {
            const prev = i > 0 && !labDone(c.labs[i - 1].id);
            const done = labDone(l.id);
            return '<button class="btn ' + (done ? "" : "primary") + ' cu-launch" data-mode="' + l.mode + '" data-lab="' + l.id + '"' + (prev ? " disabled" : "") + ">" + (done ? "Done · " : "") + l.label + " · " + l.xp + ' XP</button><p class="cu-meta">' + l.what + "</p>";
          }).join("") +
          '<button class="btn cu-ask-hub" data-unit="' + c.id + '">Ask HUB</button></div></article>'
        );
      }).join("") +
      '</div><p class="cu-foot">HVAC Legends. Programs first, then the bench. <a href="https://www.danfoss.com/en/service-and-support/learning/cooling-learning/" target="_blank" rel="noopener">Danfoss Learning</a> is their catalog. This one is ours.</p></div>';

    root.querySelector("#cu-back").onclick = function () {
      if (onBack) onBack();
    };
    root.querySelectorAll(".cu-launch").forEach(function (btn) {
      btn.onclick = function () {
        if (btn.disabled) return;
        if (onLaunch) onLaunch(btn.getAttribute("data-mode"), btn.getAttribute("data-lab"));
      };
    });
    root.querySelectorAll(".cu-ask-hub").forEach(function (btn) {
      btn.onclick = function () {
        const id = btn.getAttribute("data-unit");
        if (onAskHub) onAskHub(id, AI_COACH[id] || AI_COACH.charge);
      };
    });
    root.querySelectorAll(".cu-lesson").forEach(function (btn) {
      btn.onclick = function () {
        if (btn.disabled) return;
        lessonOpen = btn.getAttribute("data-lesson");
        lessonNote = "";
        render();
      };
    });
    root.querySelectorAll(".cu-tool").forEach(function (btn) {
      btn.onclick = function () {
        if (onLaunch) onLaunch(btn.getAttribute("data-mode"));
      };
    });
    root.querySelectorAll(".cu-answer").forEach(function (btn) {
      btn.onclick = function () {
        const lesson = findLesson(lessonOpen);
        if (!lesson) return;
        const pick = Number(btn.getAttribute("data-i"));
        if (pick === lesson.ok) {
          if (!progress.lessons) progress.lessons = {};
          progress.lessons[lesson.id] = true;
          lessonOpen = null;
          lessonNote = "";
          saveProgress();
          render();
          return;
        }
        lessonNote = lesson.why;
        render();
      };
    });
  }

  function programHtml() {
    const open = findLesson(lessonOpen);
    const panel = open
      ? '<article class="cu-card" style="margin:0 0 14px"><p class="cu-code">Lesson</p><h3>' + open.title + '</h3><p class="cu-goal">' + open.text + '</p><p><strong>' + open.q + '</strong></p><div class="cu-actions">' +
        open.choices.map(function (c, i) {
          return '<button class="btn cu-answer" data-i="' + i + '">' + c + '</button>';
        }).join("") +
        (lessonNote ? '<p class="cu-meta">' + lessonNote + '</p>' : '') +
        '</div></article>'
      : '';
    const cards = PROGRAMS.map(function (p) {
      const finished = programDone(p);
      return '<article class="cu-card ' + (finished ? 'done' : '') + '"><header><span class="cu-code">' + p.level + '</span>' +
        (finished ? '<span class="cu-badge">Program complete</span>' : '') +
        '</header><h3>' + p.title + '</h3><p class="cu-goal">' + p.blurb + '</p><div class="cu-actions">' +
        p.lessons.map(function (l, i) {
          const prev = i > 0 && !lessonDone(p.lessons[i - 1].id);
          const done = lessonDone(l.id);
          return '<button class="btn ' + (done ? '' : 'primary') + ' cu-lesson" data-lesson="' + l.id + '"' + (prev ? ' disabled' : '') + '>' +
            (done ? 'Done · ' : '') + (i + 1) + ' · ' + l.title + '</button>';
        }).join('') +
        (p.tool ? '<button class="btn primary cu-tool" data-mode="' + p.tool + '">Open the field tool</button>' : '') +
        '</div></article>';
    }).join('');
    return panel + '<div class="cu-grid" style="margin-bottom:18px">' + cards + '</div><h2 style="margin:0 0 8px">Shop labs</h2><p class="cu-sub" style="margin:0 0 12px">Opening a lab does not count. A flare has to pass. A callback has to close. A 608 drill has to hit 80%.</p>';
  }

  function nextRecommended() {
    for (let i = 0; i < viewTrack().length; i++) {
      const c = viewTrack()[i];
      for (let j = 0; j < c.labs.length; j++) {
        if (!labDone(c.labs[j].id)) return { code: c.code, title: c.labs[j].label };
      }
    }
    return null;
  }

  function start(host, opts) {
    root = host;
    onLaunch = opts && opts.onLaunch;
    onBack = opts && opts.onBack;
    onAskHub = opts && opts.onAskHub;
    loadProgress();
    render();
    return { stop: function () {}, refresh: render, nextRecommended: nextRecommended, AI_COACH: AI_COACH };
  }

  global.CurriculumTrain = { start: start, UNITS: UNITS, TRACK: TRACK, view: viewTrack, AI_COACH: AI_COACH, nextRecommended: nextRecommended, stamp: stamp };
})(window);
