/* AI Install Helper + Troubleshoot
   Guided flows powered by Professor HUB knowledge */
(function (global) {
  "use strict";

  const INSTALL_GUIDE = [
    {
      id: "prep",
      title: "Pre-job check",
      tips: [
        "Confirm model match indoor + outdoor, line sizes, and electrical (MCA/MOP on nameplate).",
        "Pad or bracket level, clearances per manual, disconnect in sight of ODU.",
        "Have torque wrench, flaring tool, N₂, micron gauge, vacuum pump, core tools ready.",
      ],
      ask: "mini-split pre-job checklist tools clearances nameplate",
    },
    {
      id: "mount",
      title: "Mount IDU & penetration",
      tips: [
        "Mounting plate level on structure — not hollow soft wall without backing.",
        "Wall hole ~2.5–3 in, slope slightly downward to the outside.",
        "Bundle liquid, suction, drain, and comms. Protect insulation from abrasion.",
      ],
      ask: "mini-split mount indoor head wall penetration slope drain",
    },
    {
      id: "flare",
      title: "Flare & torque",
      tips: [
        "Flare nut ON the tube first — then cut square, deburr, eccentric 45° flare.",
        "Inspect for cracks or ovality. Light film of POE/Nylog on flare face.",
        "Hand-start nuts, backup wrench on body, torque to OEM ft-lb. Never 'good and tight'.",
      ],
      ask: "flare copper tubing torque flare nuts mini-split leak",
    },
    {
      id: "pressure",
      title: "Nitrogen test",
      tips: [
        "Dry nitrogen only — never oxygen or compressed air.",
        "Typical test band ~450–550 psig on lineset + IDU with service valves CLOSED.",
        "Soap every joint. Any drop = find the leak before vacuum.",
      ],
      ask: "nitrogen pressure test mini-split leak check dry nitrogen",
    },
    {
      id: "vacuum",
      title: "Deep vacuum & decay",
      tips: [
        "Micron gauge at the system, not at the pump. Valve-core tools speed the pull.",
        "Target ≤500 microns. Triple-evac with N₂ breaks is best practice on long lines.",
        "Isolate pump 10–15 min. Continuous rise = leak. High plateau = moisture still in lines.",
      ],
      ask: "deep vacuum 500 microns decay test triple evacuation mini-split",
    },
    {
      id: "charge",
      title: "Open valves & charge",
      tips: [
        "Only open service valves after vacuum + decay pass.",
        "Liquid valve first, then suction. Factory charge covers rated lineset length only.",
        "Longer linesets need additional charge by weight per the nameplate chart.",
      ],
      ask: "open service valves additional charge by weight lineset length",
    },
    {
      id: "commission",
      title: "Commission",
      tips: [
        "Power up, run cool and heat. Check supply ΔT, drain flow, error codes.",
        "Verify comms polarity if the head won't talk to the outdoor board.",
        "Seal penetration, educate customer, log model/serial and charge notes.",
      ],
      ask: "commission mini-split delta-T error codes communication wiring",
    },
  ];

  const TROUBLE = [
    {
      id: "no-cool-e",
      title: "No-cool electrical sheet",
      checks: [
        "1. Confirm the call — Y on the stat. No Y, no cool.",
        "2. Line voltage at L1–L2 (~240).",
        "3. Disconnect load side. Line live / load dead = puller open.",
        "4. R to C (24–28 VAC). No 24V = 3A or transformer.",
        "5. Y to C at the board.",
        "6–8. Walk HPC, LPC, float. First 0V after gold is the open.",
        "9. Coil 24V. Voltage and no pull-in = open coil.",
        "10–11. T1 240, then compressor. Hum no start = run cap.",
      ],
      ask: "no cool electrical troubleshooting 24V string HPC LPC float contactor capacitor",
    },
    {
      id: "no-cool",
      title: "No cooling / weak cooling (refrigeration)",
      checks: [
        "Indoor airflow first — filter, coil, blower.",
        "Outdoor fan and coil — high head / low SC is air, not gas.",
        "Start the compressor. Static isn't a diagnosis.",
        "Superheat AND subcooling together.",
        "High SH + low SC = leak. High SH + high SC = restriction. High head + low SC = condenser or non-condensables.",
      ],
      ask: "no cooling weak cooling diagnose superheat subcooling airflow",
    },
    {
      id: "ice",
      title: "Indoor coil icing",
      checks: [
        "Airflow first: dirty filter, blocked return, failing blower.",
        "Low refrigerant can ice the coil — confirm with gauges, not guess-and-add.",
        "TXV/piston restriction or metering issue.",
        "Outdoor ambient too low for cooling mode without low-ambient kit.",
      ],
      ask: "evaporator coil icing causes low airflow low charge",
    },
    {
      id: "lockout",
      title: "Unit locked out / won't start",
      checks: [
        "Line voltage at disconnect and contactor — L1/L2 present?",
        "Float switch / condensate safety open?",
        "Pressure switches, high-limit, or board lockout after repeated faults.",
        "Communication wiring swapped on mini-split (common no-run).",
      ],
      ask: "unit lockout won't start float switch communication wires voltage",
    },
    {
      id: "noise",
      title: "Noise / vibration",
      checks: [
        "ODU level on pad? Isolation feet installed?",
        "Line set rubbing structure — pad and secure.",
        "Fan blade balance, loose panels, failing bearings.",
        "TXV hunting or liquid line flash can sound like turbulence.",
      ],
      ask: "outdoor unit noise vibration line set rubbing",
    },
    {
      id: "leak",
      title: "Suspected refrigerant leak",
      checks: [
        "Electronic detector or soap at flares, schraders, coils, service valves.",
        "Never use oxygen to pressure test. Dry nitrogen only.",
        "Recover, repair, evacuate to ≤500 microns, weigh in correct charge.",
        "Document leak rate rules when applicable (AIM / larger systems).",
      ],
      ask: "refrigerant leak find repair nitrogen test evacuate weigh charge",
    },
    {
      id: "electrical",
      title: "Electrical / breaker trips",
      checks: [
        "Correct breaker size vs nameplate MCA/MOP — never oversize blindly.",
        "Shorted contactor, grounded compressor, or seized compressor amp draw.",
        "Loose lugs at disconnect — heat and intermittent trips.",
        "Control voltage present? Transformer and fuse intact?",
      ],
      ask: "breaker trips MCA MOP compressor amps contactor",
    },
  ];

  let root = null;
  let tab = "install"; // install | trouble
  let selected = 0;
  let hooks = {};

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function askHub(q) {
    if (window.HubAI) {
      window.HubAI.open();
      window.HubAI.ask(q);
    }
  }

  function render() {
    if (!root) return;
    const isInstall = tab === "install";
    const list = isInstall ? INSTALL_GUIDE : TROUBLE;
    const item = list[Math.min(selected, list.length - 1)];

    root.innerHTML = `
      <div class="aih-shell">
        <header class="aih-head">
          <div>
            <div class="brand-bar" style="justify-content:flex-start;margin-bottom:6px">
              <div class="brand-mark" style="width:28px;height:28px;font-size:13px">LT</div>
              <div class="brand-word">
                <strong style="font-size:13px">LINCOLN TECH</strong>
                <span>AI field helper</span>
              </div>
            </div>
            <p class="eyebrow">Professor HUB · AI field helper</p>
            <h2>${isInstall ? "Install helper" : "Troubleshoot helper"}</h2>
            <p class="aih-sub">Step guides + instant Ask HUB. Shop-floor coaching, offline.</p>
          </div>
          <div class="hub-face-wrap compact" style="margin:0">
            <img src="hub-portrait.jpg?v=3" alt="Professor HUB" class="hub-face" />
            <div class="hub-face-meta">
              <strong>Professor HUB</strong>
              <span>Your instructor on the floor</span>
            </div>
          </div>
          <button class="btn" id="aih-hub">Shop floor</button>
        </header>
        <div class="aih-tabs">
          <button class="aih-tab ${isInstall ? "on" : ""}" data-tab="install">Install helper</button>
          <button class="aih-tab ${!isInstall ? "on" : ""}" data-tab="trouble">Troubleshoot</button>
        </div>
        <div class="aih-body">
          <aside class="aih-nav">
            ${list
              .map(
                (it, i) =>
                  `<button class="aih-nav-btn ${i === selected ? "on" : ""}" data-i="${i}"><span>${i + 1}</span>${it.title}</button>`
              )
              .join("")}
          </aside>
          <main class="aih-card">
            <p class="eyebrow">Guide ${selected + 1} / ${list.length}</p>
            <h3>${item.title}</h3>
            <ul class="aih-list">
              ${(isInstall ? item.tips : item.checks).map((t) => `<li>${t}</li>`).join("")}
            </ul>
            <div class="aih-actions">
              <button class="btn primary" id="aih-ask">Ask HUB about this</button>
              <button class="btn" id="aih-prev" ${selected === 0 ? "disabled" : ""}>Previous</button>
              <button class="btn" id="aih-next">${selected >= list.length - 1 ? "Done" : "Next tip"}</button>
            </div>
            <p class="aih-hint">Tip: You can also open <strong>Ask HUB</strong> anytime from the bottom-right button and type free-form questions.</p>
          </main>
        </div>
      </div>`;

    root.querySelectorAll(".aih-tab").forEach((b) => {
      b.onclick = () => {
        tab = b.dataset.tab;
        selected = 0;
        render();
      };
    });
    root.querySelectorAll(".aih-nav-btn").forEach((b) => {
      b.onclick = () => {
        selected = +b.dataset.i;
        render();
      };
    });
    root.querySelector("#aih-ask").onclick = () => askHub(item.ask);
    root.querySelector("#aih-prev").onclick = () => {
      if (selected > 0) {
        selected--;
        render();
      }
    };
    root.querySelector("#aih-next").onclick = () => {
      if (selected >= list.length - 1) {
        if (hooks.onHub) hooks.onHub();
        return;
      }
      selected++;
      render();
    };
    root.querySelector("#aih-hub").onclick = () => hooks.onHub && hooks.onHub();
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    tab = (opts && opts.tab) || "install";
    selected = 0;
    render();
    return { stop() {} };
  }

  global.AIHelper = { start, INSTALL_GUIDE, TROUBLE };
})(window);
