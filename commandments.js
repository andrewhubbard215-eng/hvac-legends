/* The HVAC Commandments — shop law, not church.
   Same list on the hub, the gospel screen, and HVAC Jesus. */
(function (global) {
  "use strict";

  const COMMANDMENTS = [
    {
      n: 1,
      title: "Recover first",
      line: "Venting is illegal. Recover into an approved cylinder before you open the system.",
    },
    {
      n: 2,
      title: "Nut on first",
      line: "Slide the flare nut onto the tube before you cut, deburr, or flare. Forever.",
    },
    {
      n: 3,
      title: "Dry nitrogen only",
      line: "Pressure-test with dry N₂. Never oxygen. Never shop air. Oil + O₂ is a bomb.",
    },
    {
      n: 4,
      title: "Microns, not vibes",
      line: "Deep vacuum is a micron gauge on the system — not a compound gauge at 29 inHg.",
    },
    {
      n: 5,
      title: "Don't top off a leaker",
      line: "High SH + low SC is undercharge. Find the leak. Recover, repair, evacuate, weigh in.",
    },
    {
      n: 6,
      title: "Lock it out",
      line: "Kill power and LOTO before ohms or µF. A live winding will eat your meter and your day.",
    },
    {
      n: 7,
      title: "Nameplate is law",
      line: "MCA, MOP, factory charge, and additional ounces per foot come off the unit — not memory.",
    },
    {
      n: 8,
      title: "SH and SC are math",
      line: "SH = suction temp − evap sat. SC = cond sat − liquid temp. Guessing is not a method.",
    },
    {
      n: 9,
      title: "Airflow before charge",
      line: "Iced suction and near-zero SH is usually a filter or blower. Don't add gas to a dirty coil.",
    },
    {
      n: 10,
      title: (window.LtBrand && window.LtBrand.isStore) ? "The shop is home base" : "The shop is home base",
      line: "Log the job. Teach the next helper. HVAC Jesus still makes you do the work.",
    },
  ];

  const PT = {
    "R-410A": [
      [-20, 26.2], [0, 49.7], [20, 83.6], [32, 101], [40, 130.3], [45, 144.4],
      [50, 159.4], [70, 231.2], [80, 274.8], [95, 351.4], [105, 410.8], [115, 477.5],
    ],
    "R-22": [
      [-20, 10.1], [0, 24.0], [20, 43.0], [32, 57.5], [40, 68.5], [45, 76.0],
      [50, 84.0], [70, 121.4], [80, 143.6], [95, 181.8], [105, 210.8], [115, 242.8],
    ],
    "R-134a": [
      [-20, 2.3], [0, 16.5], [20, 37.1], [32, 53.8], [40, 65.2], [45, 73.6],
      [50, 82.5], [70, 124.8], [80, 150.2], [95, 194.5], [105, 228.5], [115, 266.5],
    ],
    "R-32": [
      [-20, 28.0], [0, 52.0], [20, 87.0], [32, 116], [40, 137.0], [45, 152.5],
      [50, 169.0], [70, 248.5], [80, 297.0], [95, 382.0], [105, 448.0], [115, 522.0],
    ],
  };

  function satP(ref, tF) {
    const chart = PT[ref] || PT["R-410A"];
    if (tF <= chart[0][0]) return chart[0][1];
    if (tF >= chart[chart.length - 1][0]) return chart[chart.length - 1][1];
    for (let i = 0; i < chart.length - 1; i++) {
      const t0 = chart[i][0], p0 = chart[i][1], t1 = chart[i + 1][0], p1 = chart[i + 1][1];
      if (tF >= t0 && tF <= t1) return p0 + ((tF - t0) / (t1 - t0)) * (p1 - p0);
    }
    return chart[0][1];
  }
  function satT(ref, p) {
    const chart = PT[ref] || PT["R-410A"];
    if (p <= chart[0][1]) return chart[0][0];
    if (p >= chart[chart.length - 1][1]) return chart[chart.length - 1][0];
    for (let i = 0; i < chart.length - 1; i++) {
      const t0 = chart[i][0], p0 = chart[i][1], t1 = chart[i + 1][0], p1 = chart[i + 1][1];
      if (p >= p0 && p <= p1) return t0 + ((p - p0) / (p1 - p0)) * (t1 - t0);
    }
    return chart[0][0];
  }

  function ptWidgetHtml(idPrefix) {
    return (
      '<p class="eyebrow">P/T chart · commandment 8</p>' +
      "<h3>Saturation is law</h3>" +
      "<p class='pt-note'>SH = suction T − evap sat. SC = cond sat − liquid T. Pick the refrigerant, slide pressure, read sat °F.</p>" +
      '<label>Refrigerant <select id="' + idPrefix + '-ref">' +
      '<option>R-410A</option><option>R-22</option><option>R-134a</option><option>R-32</option></select></label>' +
      '<label>psig <input id="' + idPrefix + '-psig" type="range" min="0" max="550" value="118" /><span id="' + idPrefix + '-psig-v">118 psig</span></label>' +
      '<p class="pt-sat" id="' + idPrefix + '-sat">40.0 °F sat (R-410A)</p>' +
      '<div class="pt-table" id="' + idPrefix + '-table"></div>'
    );
  }

  function wirePt(prefix) {
    const refEl = document.getElementById(prefix + "-ref");
    const pEl = document.getElementById(prefix + "-psig");
    if (!refEl || !pEl) return;
    function paint() {
      const ref = refEl.value;
      const p = +pEl.value;
      const t = satT(ref, p);
      const pv = document.getElementById(prefix + "-psig-v");
      const sat = document.getElementById(prefix + "-sat");
      if (pv) pv.textContent = p + " psig";
      if (sat) sat.textContent = t.toFixed(1) + " °F sat (" + ref + ")";
      const box = document.getElementById(prefix + "-table");
      if (box) {
        const temps = [-20, 0, 20, 32, 40, 45, 50, 70, 80, 95, 105, 115];
        box.innerHTML =
          "<div class='pt-row pt-head'><span>°F sat</span><span>psig</span></div>" +
          temps
            .map(function (tf) {
              const on = Math.abs(tf - t) < 6;
              return (
                "<div class='pt-row" +
                (on ? " on" : "") +
                "'><span>" +
                tf +
                "°</span><span>" +
                satP(ref, tf).toFixed(1) +
                "</span></div>"
              );
            })
            .join("");
      }
    }
    refEl.onchange = paint;
    pEl.oninput = paint;
    paint();
  }

  function listHtml() {
    return COMMANDMENTS.map(
      (c) =>
        `<li>
          <span class="cmd-num">${c.n}</span>
          <div class="cmd-body">
            <p class="cmd-title">${c.title}</p>
            <p class="cmd-line">${c.line}</p>
          </div>
        </li>`
    ).join("");
  }

  function start(host, opts) {
    const hooks = opts || {};
    host.innerHTML = `
      <div class="cmd-shell">
        <header class="cmd-head">
          <div class="brand-bar" style="justify-content:flex-start">
            <div class="brand-mark" style="width:28px;height:28px;font-size:14px">LT</div>
            <div class="brand-word">
              <strong style="font-size:15px">THE HVAC COMMANDMENTS</strong>
              <span>${(window.LtBrand && window.LtBrand.org) || "HVAC Legends"} · HVAC Jesus · Professor HUB</span>
            </div>
          </div>
          <button class="btn" id="cmd-hub">Shop floor</button>
        </header>
        <div class="hub-chip" style="max-width:none;margin:0 0 14px">
          <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
          <div><strong>Professor HUB</strong><p>Memorize these. Quiz will ask. Jesus will grade. I will roast.</p></div>
        </div>
        <ol class="cmd-list">${listHtml()}</ol>
        <div id="cmd-pt" class="hub-pt cmd-pt">${ptWidgetHtml("cmdpt")}</div>
      </div>`;
    host.querySelector("#cmd-hub").onclick = () => hooks.onHub && hooks.onHub();
    wirePt("cmdpt");
    return { stop() {} };
  }

  function paintRapture(root) {
    if (!root) return;
    const speak = root.querySelector("#jesus-speak");
    if (speak) {
      speak.textContent =
        "“You won the Quiz Game. I am HVAC Jesus. Receive the Gauges of God — SH and SC will never be a coin flip again. Write these ten on the truck door.”";
    }
    const ol = root.querySelector("#rapture-commandments");
    if (ol) ol.innerHTML = listHtml();
  }

  function playWinCutscene(root, opts) {
    if (!root) return function () {};
    const fromQuiz = !!(opts && opts.fromQuiz);
    paintRapture(root);
    const speak = root.querySelector("#jesus-speak");
    if (speak) {
      speak.textContent = (opts && opts.fromDefusal)
        ? "“You cut the open, not the live. I am HVAC Jesus. Hard hat, tool belt, white shirt. Receive the Gauges of God — SH and SC will never be a coin flip again.”"
        : fromQuiz
        ? "“You won the Quiz Game. I am HVAC Jesus. Kneel if you want — I’m here for the Gauges of God. SH and SC will never be a coin flip again.”"
        : "“I am HVAC Jesus. You opened the HVAC Commandments. Recover, don’t vent. These ten are the law of the shop. Repeat them. Then receive the Gauges of God.”";
    }
    root.classList.remove("cut-open", "cut-jesus", "cut-gauges", "cut-lore");
    const timers = [];
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    later(80, () => root.classList.add("cut-open"));
    later(600, () => root.classList.add("cut-jesus"));
    later(2800, () => root.classList.add("cut-gauges"));
    later(4200, () => root.classList.add("cut-lore"));
    function skip() {
      timers.forEach(clearTimeout);
      root.classList.add("cut-open", "cut-jesus", "cut-gauges", "cut-lore");
    }
    const skipBtn = root.querySelector("#btn-skip-cut");
    if (skipBtn) skipBtn.onclick = skip;
    root.addEventListener("dblclick", skip, { once: true });
    return skip;
  }

  function paintHub(root) {
    const box = root && root.querySelector("#hub-commandments");
    if (box) {
      box.innerHTML =
        `<p class="eyebrow">The HVAC Commandments</p><ol class="cmd-list compact">${listHtml()}</ol>`;
    }
    const pt = root && root.querySelector("#hub-pt");
    if (pt) {
      pt.innerHTML = ptWidgetHtml("hubpt");
      wirePt("hubpt");
    }
  }

  global.HvacCommandments = { COMMANDMENTS, start, listHtml, paintRapture, paintHub, playWinCutscene };
})(window);
