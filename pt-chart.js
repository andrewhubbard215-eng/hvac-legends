/* Pocket P/T charts — training tables. OEM / CFR still wins. */
(function (global) {
  "use strict";

  const TABLES = {
    "R-410A": {
      note: "A1 · Puron-class. Essentially no glide — the dew point and the start of boiling are the same number. House 3-ton ~118 psig at 40°F sat, ~391 at 115°F cond.",
      rows: [
        [-40, 10.8], [-30, 17.2], [-20, 24.8], [-15, 29.5], [-10, 34.5],
        [-5, 40.0], [0, 48.6], [5, 55.2], [10, 62.3], [15, 70.0],
        [20, 78.3], [25, 87.3], [30, 96.8], [35, 107.0], [40, 118.0],
        [45, 130.0], [50, 142.0], [55, 155.0], [60, 170.0], [65, 185.0],
        [70, 201.0], [75, 217.0], [80, 235.0], [85, 254.0], [90, 274.0],
        [95, 295.0], [100, 317.0], [105, 340.0], [110, 365.0], [115, 391.0],
        [120, 418.0], [125, 446.0], [130, 476.0], [140, 539.0], [150, 608.0],
      ],
    },
    "R-22": {
      note: "HCFC · phased down. ~68.5 psig at 40°F, ~243 at 115°F. Don't mix with 410A oil or fittings.",
      rows: [
        [-40, 0.5], [-30, 4.9], [-20, 10.1], [-10, 16.5], [0, 24.0],
        [5, 28.3], [10, 32.8], [15, 37.7], [20, 43.0], [25, 48.8],
        [30, 54.9], [35, 61.5], [40, 68.5], [45, 76.0], [50, 84.0],
        [55, 92.6], [60, 101.6], [65, 111.2], [70, 121.4], [75, 132.2],
        [80, 143.6], [85, 155.7], [90, 168.4], [95, 181.8], [100, 195.9],
        [105, 210.8], [110, 226.4], [115, 242.8], [120, 260.0], [130, 297.0],
        [140, 337.0], [150, 381.0],
      ],
    },
    "R-134a": {
      note: "Medium pressure. Chillers, some autos. Negative psig is vacuum on the compound.",
      rows: [
        [-40, -7.4], [-30, -3.0], [-20, 0.6], [-10, 1.9], [0, 6.5],
        [5, 9.1], [10, 12.0], [15, 15.1], [20, 18.4], [25, 22.1],
        [30, 26.1], [35, 30.4], [40, 35.0], [45, 40.0], [50, 45.4],
        [55, 51.2], [60, 57.4], [65, 64.0], [70, 71.1], [75, 78.7],
        [80, 86.7], [85, 95.2], [90, 104.3], [95, 114.0], [100, 124.2],
        [105, 135.1], [110, 146.4], [115, 158.4], [120, 171.1], [130, 198.7],
        [140, 229.0], [150, 263.0],
      ],
    },
    "R-32": {
      note: "A2L · GWP 675 · pure, so one pressure column. 121 psig at 40°F, 206 at 70°F, 326 at 100°F. A little above R-410A. Rated hoses and a leak-smart.",
      rows: [
        [-40, 11.0], [-30, 18.2], [-20, 26.8], [-10, 37.1], [0, 49.3],
        [5, 56.1], [10, 63.5], [15, 71.4], [20, 80.0], [25, 89.2],
        [30, 99.1], [35, 109.7], [40, 121.0], [45, 133.0], [50, 145.8],
        [55, 159.5], [60, 174.0], [65, 189.5], [70, 205.8], [75, 223.2],
        [80, 241.5], [85, 260.9], [90, 281.3], [95, 302.9], [100, 325.7],
        [105, 349.6], [110, 374.9], [115, 401.4], [120, 429.3], [125, 458.7],
        [130, 489.5], [140, 555.8], [150, 628.8],
      ],
    },
    "R-454B": {
      note: "A2L · R-32 and R-1234yf. About 2°F of glide. This column is the bubble pressure, the liquid side, for subcooling. Superheat uses the dew point, about 2°F warmer at the same pressure. The two columns on a pocket card are those two.",
      glide: true,
      rows: [
        [-40, 9.5], [-30, 16.3], [-20, 24.3], [-10, 34.0], [0, 45.3],
        [10, 58.6], [20, 74.0], [30, 91.7], [40, 111.9], [45, 123.1],
        [50, 135.0], [55, 147.6], [60, 161.0], [65, 175.3], [70, 190.4],
        [75, 206.4], [80, 223.3], [85, 241.1], [90, 260.0], [95, 279.9],
        [100, 300.8], [105, 322.8], [110, 346.0], [115, 370.4], [120, 395.9],
        [125, 422.8], [130, 450.9], [140, 511.3], [150, 577.4],
      ],
    },
  };

  function satP(ref, tF) {
    const chart = (TABLES[ref] || TABLES["R-410A"]).rows;
    if (tF <= chart[0][0]) return chart[0][1];
    if (tF >= chart[chart.length - 1][0]) return chart[chart.length - 1][1];
    for (let i = 0; i < chart.length - 1; i++) {
      const t0 = chart[i][0], p0 = chart[i][1];
      const t1 = chart[i + 1][0], p1 = chart[i + 1][1];
      if (tF >= t0 && tF <= t1) {
        const u = (tF - t0) / (t1 - t0);
        return p0 + u * (p1 - p0);
      }
    }
    return chart[0][1];
  }

  function glideOf(ref) {
    const pack = TABLES[ref] || {};
    if (ref === "R-454B") return 2.2;
    return pack.glide ? 2 : 0;
  }

  function satTDew(ref, p) {
    return satT(ref, p) + glideOf(ref);
  }
  function satTBubble(ref, p) {
    return satT(ref, p);
  }

  function satT(ref, p) {
    const chart = (TABLES[ref] || TABLES["R-410A"]).rows;
    if (p <= chart[0][1]) return chart[0][0];
    if (p >= chart[chart.length - 1][1]) return chart[chart.length - 1][0];
    for (let i = 0; i < chart.length - 1; i++) {
      const t0 = chart[i][0], p0 = chart[i][1];
      const t1 = chart[i + 1][0], p1 = chart[i + 1][1];
      if (p >= p0 && p <= p1) {
        const u = (p - p0) / (p1 - p0);
        return t0 + u * (t1 - t0);
      }
    }
    return chart[0][0];
  }

  let host = null;
  let hooks = {};
  let ref = "R-410A";
  let lockT = 40;
  let side = "pt";

  const CYL = [
    ["R-11", "CCl3F", "Orange", "#f15a22", "100 (E), 200 (E), 650 (E)"],
    ["R-12", "CCl2F2", "White", "#f4f4f4", "30 (B), 50 (C), 145 (D)"],
    ["R-22", "CHClF2", "Green", "#7dba6a", "30 (B), 50 (C), 125 (D)"],
    ["R-502", "CHClF2/CClF2CF3", "Light purple", "#c9a0dc", "30 (B), 50 (C), 125 (D)"],
    ["R-134a", "CH2FCF3", "Light blue", "#7ec8e3", "30 (B), 125 (D)"],
    ["R-123", "CHCl2CF3", "Light blue-grey", "#b7c0c7", "100 (E), 200 (E)"],
    ["R-401A", "", "Pinkish-red", "#f27d8a", "30 (B), 125 (D)"],
    ["R-401B", "", "Mustard", "#c4a035", "30 (B), 125 (D)"],
    ["R-402A", "", "Sand", "#d4c4a8", "27 (B), 110 (D)"],
    ["R-402B", "", "Olive", "#6b6b3a", "13 (B)"],
    ["R-404A", "", "Orange", "#f15a22", "24 (B), 100 (D)"],
    ["R-409A", "", "Tan", "#c4a574", "30 (B), 125 (D)"],
    ["R-408A", "", "Medium purple", "#9b59b6", "24 (B), 100 (D)"],
    ["R-407C", "", "Brown", "#8b5a2b", "25 (B), 115 (D)"],
    ["R-410A", "", "Rose", "#e8a0b0", "25 (B), 100 (D)"],
    ["R-507", "", "Teal", "#2aa8a0", "25 (B), 100 (D)"],
  ];

  function ensureCss() {
    if (document.getElementById("pt-cyl-css")) return;
    const st = document.createElement("style");
    st.id = "pt-cyl-css";
    st.textContent =
      "#screen-ptchart.screen.active{display:block!important;overflow-x:hidden!important;overflow-y:auto!important;height:100%!important;max-height:100dvh!important;-webkit-overflow-scrolling:touch}" +
      "#ptchart-root{height:auto!important;max-height:none!important;overflow:visible!important;flex:none!important;padding-bottom:24px}" +
      ".ptlab{display:flex;flex-direction:column;gap:8px;min-width:0}" +
      ".ptlab-bar{order:1}.pt-tabs{order:2}.ptlab-refs{order:3}.ptlab-table-wrap{order:4}.ptlab-note{order:5}.ptlab-calc{order:6}.ptlab-shsc{order:7}.sf-row{order:8}.pt-jugs{order:9}" +
      "body:has(#screen-ptchart.active) .ld-replay,body:has(#screen-ptchart.active) #form-badge{top:8px!important;bottom:auto!important;right:8px!important;left:auto!important;z-index:35!important;max-width:112px}" +
      "body:has(#screen-ptchart.active) #drip-ear,body:has(#screen-ptchart.active) #pf-coach-bar,body:has(#screen-ptchart.active) .pf-coach{display:none!important}" +
      ".pt-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}" +
      ".pt-cyl{width:100%;border-collapse:collapse;font-size:14px}" +
      ".pt-cyl th,.pt-cyl td{border-bottom:1px solid #2a3644;padding:8px 6px;text-align:left;vertical-align:middle}" +
      ".pt-cyl th{color:#e8c450;font-size:11px;letter-spacing:.08em}" +
      ".pt-sw{display:inline-block;width:18px;height:18px;border-radius:4px;border:1px solid #111;vertical-align:-4px;margin-right:8px}" +
      ".pt-jugs{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}" +
      ".pt-jug{flex:1 1 140px;background:#14181c;border:1px solid #2a3644;border-radius:10px;padding:8px 10px;font-size:13px;line-height:1.35}" +
      ".pt-jug b{color:#e8c450}";
    document.head.appendChild(st);
  }

  function fmtP(p) {
    if (p < 0) return String(Math.round(-p * 2.036)) + "\" vac";
    return p.toFixed(1) + " psig";
  }

  function paintCyl() {
    host.innerHTML =
      '<div class="ptlab">' +
      '<header class="ptlab-bar">' +
      '<div><p class="eyebrow">Pocket chart</p><h2>Cylinder card</h2></div>' +
      '<button type="button" class="btn" id="ptlab-hub">Shop floor</button>' +
      '<a class="btn" href="pt-card.html" target="_blank" rel="noopener">Pocket card</a>' +
      "</header>" +
      '<div class="pt-tabs">' +
      '<button type="button" class="btn" id="pt-side-pt">Saturation</button>' +
      '<button type="button" class="btn primary" id="pt-side-cyl">Cylinders</button>' +
      "</div>" +
      '<p class="ptlab-note">Old shoulder colors, the way the field card prints them. A jug made after 2020 is light green-gray. Read the label. Color does not pick the bottle.</p>' +
      '<div class="ptlab-table-wrap"><table class="pt-cyl"><thead><tr><th>Type</th><th>Color</th><th>Net lb</th></tr></thead><tbody>' +
      CYL.map(function (r) {
        const name = r[1] ? r[0] + " <span style=\"color:#8b98a5\">" + r[1] + "</span>" : r[0];
        return "<tr><td>" + name + "</td><td><i class=\"pt-sw\" style=\"background:" + r[3] + "\"></i>" + r[2] + "</td><td>" + r[4] + "</td></tr>";
      }).join("") +
      "</tbody></table></div>" +
      '<div class="pt-jugs">' +
      "<div class=\"pt-jug\"><b>(B)</b><br>13, 24, 25, 27, 30 lb</div>" +
      "<div class=\"pt-jug\"><b>(C)</b><br>50 lb</div>" +
      "<div class=\"pt-jug\"><b>(D)</b><br>100, 110, 115, 125, 145 lb</div>" +
      "<div class=\"pt-jug\"><b>(E)</b><br>100, 200, 650 lb</div>" +
      "</div></div>";
    host.querySelector("#ptlab-hub").onclick = function () { if (hooks.onHub) hooks.onHub(); };
    host.querySelector("#pt-side-pt").onclick = function () { side = "pt"; render(); };
  }

  function render() {
    if (!host) return;
    ensureCss();
    if (side === "cyl") return paintCyl();
    const pack = TABLES[ref];
    const marks = { 32: "H₂O freeze", 40: "AC evap", 70: "room", 95: "AHRI OD", 115: "hot cond" };
    host.innerHTML =
      '<div class="ptlab">' +
      '<header class="ptlab-bar">' +
      '<div><p class="eyebrow">Pocket chart</p><h2>P/T · ' + ref + '</h2></div>' +
      '<button type="button" class="btn" id="ptlab-hub">Shop floor</button>' +
      '<a class="btn" href="pt-card.html" target="_blank" rel="noopener">Pocket card</a>' +
      "</header>" +
      '<div class="pt-tabs">' +
      '<button type="button" class="btn primary" id="pt-side-pt">Saturation</button>' +
      '<button type="button" class="btn" id="pt-side-cyl">Cylinders</button>' +
      "</div>" +
      '<p class="ptlab-note">' + pack.note + " Training table. The cylinder label still wins.</p>" +
      '<div class="ptlab-refs" id="ptlab-refs"></div>' +
      '<div class="ptlab-calc">' +
      "<label>Suction psig <input id=\"ptlab-ps\" type=\"number\" value=\"125\"></label>" +
      "<label>Suction line °F <input id=\"ptlab-sl\" type=\"number\" value=\"55\"></label>" +
      "<label>Liquid psig <input id=\"ptlab-pl\" type=\"number\" value=\"391\"></label>" +
      "<label>Liquid line °F <input id=\"ptlab-ll\" type=\"number\" value=\"105\"></label>" +
      "</div>" +
      '<p class="ptlab-shsc" id="ptlab-shsc"></p>' +
      '<div class="sf-row"><div class="sf-face" id="pt-sh"><em>Superheat</em><strong>—</strong><span>°F</span></div><div class="sf-face" id="pt-sc"><em>Subcooling</em><strong>—</strong><span>°F</span></div></div>' +
      '<div class="ptlab-table-wrap"><table class="ptlab-table"><thead><tr><th>°F sat</th><th>psig</th><th>Field</th></tr></thead><tbody id="ptlab-body"></tbody></table></div>' +
      "</div>";

    const refs = host.querySelector("#ptlab-refs");
    Object.keys(TABLES).forEach(function (k) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn" + (k === ref ? " primary" : "");
      b.textContent = k;
      b.onclick = function () {
        ref = k;
        render();
        if (global.LtDrip && (TABLES[k] || {}).glide) global.LtDrip.say("ptchart", true);
      };
      refs.appendChild(b);
    });

    const body = host.querySelector("#ptlab-body");
    pack.rows.forEach(function (row) {
      const tr = document.createElement("tr");
      if (row[0] === lockT) tr.className = "on";
      if (marks[row[0]]) tr.classList.add("mark");
      tr.innerHTML =
        "<td>" + row[0] + "</td><td>" + fmtP(row[1]) + "</td><td>" + (marks[row[0]] || "") + "</td>";
      tr.onclick = function () {
        lockT = row[0];
        render();
      };
      body.appendChild(tr);
    });

    function calc() {
      const ps = +host.querySelector("#ptlab-ps").value;
      const pl = +host.querySelector("#ptlab-pl").value;
      const sl = +host.querySelector("#ptlab-sl").value;
      const ll = +host.querySelector("#ptlab-ll").value;
      const evapSat = satTDew(ref, ps);
      const condSat = satTBubble(ref, pl);
      const sh = sl - evapSat;
      const sc = condSat - ll;
      lockT = Math.round(evapSat);
      const el = host.querySelector("#ptlab-shsc");
      const g = glideOf(ref);
      el.textContent =
        "Evap dew " +
        evapSat.toFixed(1) +
        "°F at " +
        fmtP(ps) +
        " suction → SH " +
        sh.toFixed(1) +
        "°F (" +
        sl +
        "°F line − " +
        evapSat.toFixed(1) +
        "°F sat). Start of boiling " +
        condSat.toFixed(1) +
        "°F at " +
        fmtP(pl) +
        " liquid → SC " +
        sc.toFixed(1) +
        "°F (" +
        condSat.toFixed(1) +
        "°F sat − " +
        ll +
        "°F line)." +
        (g ? " " + ref + " glide ~" + g.toFixed(1) + "° · dew point for superheat, start of boiling for subcooling." : " Essentially no glide, so the dew point and the start of boiling are the same temperature. Two pressures. Two line temps. Never one number.");
      var shFace = host.querySelector("#pt-sh");
      var scFace = host.querySelector("#pt-sc");
      if (shFace) {
        shFace.querySelector("strong").textContent = sh.toFixed(1);
        if (window.ShopFace) window.ShopFace.dress(shFace, sh.toFixed(1), "SH");
      }
      if (scFace) {
        scFace.querySelector("strong").textContent = sc.toFixed(1);
        if (window.ShopFace) window.ShopFace.dress(scFace, sc.toFixed(1), "SC");
      }
      function nearest(p) {
        let best = 0;
        let bestD = Infinity;
        pack.rows.forEach(function (row, i) {
          const d = Math.abs(row[1] - p);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        return best;
      }
      const iS = nearest(ps);
      const iL = nearest(pl);
      host.querySelectorAll("#ptlab-body tr").forEach(function (tr, i) {
        const hitS = i === iS;
        const hitL = i === iL;
        tr.classList.toggle("on", hitS || hitL);
        const field = tr.children[2];
        const base = marks[pack.rows[i][0]] || "";
        const tag = hitS && hitL ? "← " + fmtP(ps) : hitS ? "← suction " + fmtP(ps) : hitL ? "← liquid " + fmtP(pl) : "";
        if (field) field.textContent = [base, tag].filter(Boolean).join(" · ");
        if (hitS || hitL) {
          var wrap = tr.closest(".ptlab-table-wrap");
          if (wrap) wrap.scrollTop = Math.max(0, tr.offsetTop - wrap.clientHeight / 2);
        }
      });
    }
    ["ptlab-ps", "ptlab-pl", "ptlab-sl", "ptlab-ll"].forEach(function (id) {
      host.querySelector("#" + id).oninput = calc;
    });
    host.querySelector("#ptlab-hub").onclick = function () {
      if (hooks.onHub) hooks.onHub();
    };
    const cylBtn = host.querySelector("#pt-side-cyl");
    if (cylBtn) cylBtn.onclick = function () { side = "cyl"; render(); };
    calc();
  }

  global.PtChart = {
    TABLES: TABLES,
    satP: satP,
    satT: satT,
    satTDew: satTDew,
    satTBubble: satTBubble,
    glideOf: glideOf,
    start: function (root, opts) {
      host = root;
      hooks = opts || {};
      ref = "R-410A";
      lockT = 40;
      render();
      return { stop: function () { host = null; } };
    },
  };
})(window);
