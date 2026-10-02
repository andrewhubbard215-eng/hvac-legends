/* Professor HUB site tutorial — walks a student through the shop */
(function (global) {
  "use strict";

  const STEPS = [
    {
      id: "welcome",
      title: "Welcome to the floor",
      say: "I'm Professor Hubbard — HUB. Clock In dumps you on the shop floor. Every lab is a full screen. I'll walk the doors. Don't skip the exam. Don't vent.",
      highlight: null,
    },
    {
      id: "howto",
      title: "How this app works",
      say: "Top How-to button always restarts this tour. Cards open labs. On a phone, a lab fills the whole screen — Parts and Gauges hide until you tap them.",
      highlight: "#hub-howto",
    },
    {
      id: "locker",
      title: "Your locker",
      say: "Locker is optional. Name, campus, photo if you want the exam board to know you. Log out lives in the locker, not on the header.",
      highlight: "#hub-locker",
    },
    {
      id: "quiz",
      title: "All-Star Exam",
      say: "EPA 608, OSHA 30, shop curriculum. Pick an answer, Next stays on screen, why-right and why-wrong. Solo or a class PIN.",
      highlight: '[data-mode="quiz"]',
      launch: "quiz",
    },
    {
      id: "epa608",
      title: "EPA 608 tutor",
      say: "608 tutor is the prove path: Core, Type I, II, III. Run the vacuum table. Stamp a section at 80%, then sit the exam. Appliance, not the jug.",
      highlight: '[data-mode="epa608"]',
      launch: "epa608",
    },
    {
      id: "sandbox",
      title: "System sandbox",
      say: "Four-part cycle: compressor, condenser, metering, evaporator. Drop them, Start compressor, read live SH and SC. HUB guided lights one box at a time.",
      highlight: '[data-mode="sandbox"]',
      launch: "sandbox",
    },
    {
      id: "gauges",
      title: "Manifold school",
      say: "This is how you use the set. Blue on suction, red on liquid, yellow capped, handles seated. Then SH = suction temp minus evap sat. SC = cond sat minus liquid temp. Both numbers or you're guessing.",
      highlight: '[data-mode="gauges"]',
      launch: "gauges",
    },
    {
      id: "electrical",
      title: "Electrical sim",
      say: "Follow the call is the 24-volt string. Tap down the circuit until the open shows, then land the wire that belongs there.",
      highlight: '[data-mode="electrical"]',
      launch: "electrical",
    },
    {
      id: "guide",
      title: "Guided wiring",
      say: "Land the lugs is first. Drag black onto L1. A wrong color will not stick. Red goes on L2 after that.",
      highlight: '[data-mode="elguide"]',
      launch: "elguide",
    },
    {
      id: "ai",
      title: "Ask HUB",
      say: "AI helper is the step-by-step. The HUB button is me on every screen. Flare, vacuum, recovery tanks — ask. I'll talk like the shop.",
      highlight: '[data-mode="aihelper"]',
      launch: "aihelper",
    },
    {
      id: "laws",
      title: "Commandments",
      say: "Ten shop laws. Recover first. Nut on the tube before the flare. Dry nitrogen only. Microns, not a compound gauge.",
      highlight: '[data-mode="commandments"]',
      launch: "commandments",
    },
    {
      id: "iconnect",
      title: "iConnect trainers",
      say: "iConnect is the three machines in the lab. The first screen is the how-to: what you do on the real TU-522, TU-601, and TU-210G, then the same move on this screen. Meter the marked part. Do not jumper a safety. The boiler is water, not refrigerant.",
      highlight: '[data-mode="iconnect"]',
      launch: "iconnect",
    },
    {
      id: "jobs",
      title: "Labs and service",
      say: "Mini-split is an 11-step install. Pick the tool, then the picture changes. Saturday callback: meter the open part, then replace it or isolate it.",
      highlight: '[data-mode="minisplit"]',
    },
    {
      id: "done",
      title: "You're on the clock",
      say: "Start with See inside, Land the lugs, Saturday callback, and Build the system. Then take the call. Recover, don't vent.",
      highlight: null,
    },
  ];

  let root, hooks, i = 0;

  function clearHi() {
    document.querySelectorAll(".tut-hi").forEach((el) => el.classList.remove("tut-hi"));
  }

  function render() {
    if (!root) return;
    const s = STEPS[i];
    const last = i >= STEPS.length - 1;
    const first = i <= 0;
    clearHi();
    if (s.highlight) {
      const el = document.querySelector("#screen-hub " + s.highlight) || document.querySelector(s.highlight);
      if (el) {
        el.classList.add("tut-hi");
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    root.classList.remove("hidden");
    root.innerHTML =
      '<div class="tut-card">' +
      '<img src="hub-portrait.jpg?v=3" alt="Professor HUB" class="tut-face" />' +
      '<div class="tut-body">' +
      '<p class="eyebrow">Professor HUB · tutorial ' + (i + 1) + "/" + STEPS.length + "</p>" +
      "<h3>" + s.title + "</h3>" +
      "<p class=\"tut-say\">“" + s.say + "”</p>" +
      '<div class="tut-row">' +
      '<button type="button" class="btn" id="tut-back"' + (first ? " disabled" : "") + ">Back</button>" +
      (s.launch ? '<button type="button" class="btn" id="tut-try">Open it</button>' : "") +
      '<button type="button" class="btn primary" id="tut-next">' + (last ? "Got it · shop floor" : "Next") + "</button>" +
      '<button type="button" class="btn" id="tut-skip">Skip tour</button>' +
      "</div></div></div>";
    root.querySelector("#tut-back").onclick = () => {
      if (i > 0) {
        i -= 1;
        render();
      }
    };
    root.querySelector("#tut-next").onclick = () => {
      if (last) finish();
      else {
        i += 1;
        render();
      }
    };
    root.querySelector("#tut-skip").onclick = finish;
    const t = root.querySelector("#tut-try");
    if (t && s.launch) {
      t.onclick = () => {
        finish();
        if (hooks.onLaunch) hooks.onLaunch(s.launch);
      };
    }
  }

  function finish() {
    clearHi();
    if (root) {
      root.classList.add("hidden");
      root.innerHTML = "";
    }
    if (hooks && hooks.onDone) hooks.onDone();
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    i = 0;
    render();
    return { stop: finish };
  }

  global.HubTutorial = { start, stop: finish, STEPS };
})(window);
