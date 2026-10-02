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
      note: "A2L. Many ductless. Higher pressure than 410A. Rated hoses and leak-smart.",
      rows: [
        [-40, 11.6], [-30, 19.2], [-20, 28.2], [-10, 39.0], [0, 51.2],
        [5, 58.2], [10, 65.8], [15, 74.0], [20, 82.8], [25, 92.4],
        [30, 102.6], [35, 113.6], [40, 125.4], [45, 138.0], [50, 151.4],
        [55, 165.8], [60, 181.2], [65, 197.6], [70, 215.2], [75, 234.0],
        [80, 254.0], [85, 275.4], [90, 298.2], [95, 322.4], [100, 348.2],
        [105, 375.6], [110, 404.8], [115, 435.8], [120, 468.8], [130, 540.0],
        [140, 620.0], [150, 710.0],
      ],
    },
    "R-454B": {
      note: "A2L · Puron Advance. ~2°F glide. Superheat uses the dew point. Subcooling uses the start of boiling. This table is the liquid pressure.",
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

  function fmtP(p) {
    if (p < 0) return String(Math.round(-p * 2.036)) + "\" vac";
    return p.toFixed(1) + " psig";
  }

  function render() {
    if (!host) return;
    const pack = TABLES[ref];
    const marks = { 32: "H₂O freeze", 40: "AC evap", 70: "room", 95: "AHRI OD", 115: "hot cond" };
    host.innerHTML =
      '<div class="ptlab">' +
      '<header class="ptlab-bar">' +
      '<div><p class="eyebrow">Pocket chart</p><h2>P/T · ' + ref + '</h2></div>' +
      '<button type="button" class="btn" id="ptlab-hub">Shop floor</button>' +
      "</header>" +
      '<p class="ptlab-note">' + pack.note + " Training table — cylinder card / OEM still wins.</p>" +
      '<div class="ptlab-refs" id="ptlab-refs"></div>' +
      '<div class="ptlab-calc">' +
      "<label>Suction psig <input id=\"ptlab-ps\" type=\"number\" value=\"125\"></label>" +
      "<label>Suction line °F <input id=\"ptlab-sl\" type=\"number\" value=\"55\"></label>" +
      "<label>Liquid psig <input id=\"ptlab-pl\" type=\"number\" value=\"391\"></label>" +
      "<label>Liquid line °F <input id=\"ptlab-ll\" type=\"number\" value=\"105\"></label>" +
      "</div>" +
      '<p class="ptlab-shsc" id="ptlab-shsc"></p>' +
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
