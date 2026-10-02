/* See Inside — ghost-shell cutaway of the vapor-compression loop.
   The housing is open so the bore shows. Red and orange are heat. Blue is cold.
   No flames. Dye stays inside the pipe. */
(function (global) {
  "use strict";

  const CLIPS = [
    {
      id: "cycle",
      title: "Refrigeration cycle",
      sub: "Outdoor unit on the left. Indoor coil on the right.",
      src: "cutaway/cycle.mp4?v=10",
      poster: "cutaway/cycle-reel.jpg?v=1",
      say: "The compressor takes in cool low-pressure vapor and discharges hot high-pressure vapor. The condenser rejects that heat and turns the vapor into warm liquid. The metering device drops the pressure. The evaporator boils the mix and takes heat out of the air. Cool vapor goes back to the compressor.",
    },
    {
      id: "compressor",
      title: "Scroll compressor",
      sub: "Low-pressure vapor in · high-pressure vapor out",
      src: "cutaway/compressor.mp4?v=10",
      poster: "cutaway/compressor.jpg?v=10",
      say: "A scroll compressor pumps vapor only. Suction gas enters the outer pockets. The crank walks one scroll around the fixed scroll, the pockets close, and the gas leaves hot at the center. It does not compress liquid. A weak pump lets the high and low side walk together, and the amp draw stays light.",
    },
    {
      id: "condenser",
      title: "Condenser",
      sub: "Reject heat · vapor becomes liquid",
      src: "cutaway/condenser.mp4?v=10",
      poster: "cutaway/condenser.jpg?v=10",
      say: "Hot discharge vapor enters the top. Air across the coil pulls the heat out. The vapor condenses and warm liquid leaves the bottom. That liquid is still warm, not cold. A dirty coil raises head pressure. Subcooling stays about normal. That is not an overcharge.",
    },
    {
      id: "txv",
      title: "TXV",
      sub: "Meters liquid · holds superheat",
      src: "cutaway/txv.mp4?v=10",
      poster: "cutaway/txv.jpg?v=10",
      say: "High-pressure liquid comes in. The pin meters it. The pressure drop at the seat flashes part of the liquid into a cold mix. The bulb is strapped to the suction line. High superheat opens the pin. Low superheat lets the spring close it. Do not turn the stem to fix a charge problem.",
    },
    {
      id: "evaporator",
      title: "Evaporator",
      sub: "Boils the refrigerant · cools the air",
      src: "cutaway/evaporator.mp4?v=10",
      poster: "cutaway/evaporator.jpg?v=10",
      say: "Cold refrigerant enters and boils in the coil. That boiling takes heat from the room air. The liquid should be gone before the outlet, so the vapor going home is superheated. Water on the fins is moisture from the air, not refrigerant. High superheat means the coil is starved. Near-zero superheat with ice is airflow first. Do not add gas.",
    },
    {
      id: "drier",
      title: "Filter-drier",
      sub: "Passes liquid · keeps trash and moisture",
      src: "cutaway/drier.mp4?v=10",
      poster: "cutaway/drier.jpg?v=10",
      say: "The filter-drier sits in the liquid line. Refrigerant passes through. The screens and desiccant hold solid trash and moisture. Inlet and outlet should both be warm liquid at about the same temperature. A cold outlet means the core is plugged. That is a fault, not the job.",
    },
  ];

  function scene(id) {
    if (id === "compressor") {
      return (
        '<svg class="ca-svg" viewBox="0 0 960 540">' +
        '<rect width="960" height="540" fill="#0b1218"/>' +
        '<text x="36" y="48" fill="#3aa0e0" font-size="18">blue vapor in the outer pocket</text>' +
        '<text x="540" y="48" fill="#e23b2f" font-size="18">red vapor out the center</text>' +
        '<rect x="30" y="246" width="200" height="34" rx="8" fill="#1d4e73"/>' +
        '<circle class="ca-vin" cx="70" cy="263" r="7" fill="#3aa0e0"/>' +
        '<circle class="ca-vin d2" cx="70" cy="263" r="5" fill="#7ec8f0"/>' +
        '<circle class="ca-vin d3" cx="70" cy="263" r="6" fill="#3aa0e0"/>' +
        '<ellipse cx="500" cy="290" rx="210" ry="168" fill="#161d24" stroke="#9aa3ad" stroke-width="8"/>' +
        '<path d="M500 290c48 0 52-62 0-62-70 0-86 96 8 108 78 10 108-108 8-124" fill="none" stroke="#d5dee6" stroke-width="12" stroke-linecap="round"/>' +
        '<g class="ca-orbit">' +
        '<path d="M486 312c-48 0-52 62 0 62 70 0 86-96-8-108-78-10-108 108-8 124" fill="none" stroke="#e8c450" stroke-width="12" stroke-linecap="round"/>' +
        "</g>" +
        '<rect x="484" y="78" width="32" height="70" rx="6" fill="#9c221c"/>' +
        '<circle class="ca-hot" cx="500" cy="160" r="8" fill="#e23b2f"/>' +
        '<circle class="ca-hot" cx="500" cy="160" r="5" fill="#ff7a1a" style="animation-delay:.35s"/>' +
        '<text x="200" y="510" fill="#a8b0b8" font-size="16">Blue in. Red out. The gold scroll orbits. It does not spin.</text>' +
        "</svg>"
      );
    }
    if (id === "condenser") {
      return (
        '<svg class="ca-svg" viewBox="0 0 960 540">' +
        '<rect width="960" height="540" fill="#0b1218"/>' +
        '<text x="36" y="42" fill="#e23b2f" font-size="18">top: red vapor, no liquid</text>' +
        '<text x="460" y="42" fill="#ff7a1a" font-size="18">bottom: orange liquid, still warm</text>' +
        '<g class="ca-fan">' +
        '<line x1="470" y1="78" x2="530" y2="78" stroke="#c5ced6" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="500" y1="48" x2="500" y2="108" stroke="#c5ced6" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="478" y1="58" x2="522" y2="98" stroke="#c5ced6" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="522" y1="58" x2="478" y2="98" stroke="#c5ced6" stroke-width="6" stroke-linecap="round"/>' +
        "</g>" +
        tube(150, "red") +
        tube(210, "hot") +
        tube(270, "mid") +
        tube(330, "mid") +
        tube(390, "bot") +
        '<rect x="700" y="404" width="180" height="22" rx="6" fill="#9c4a16"/>' +
        '<circle class="ca-drop" cx="710" cy="415" r="6" fill="#ff7a1a"/>' +
        '<text x="150" y="500" fill="#a8b0b8" font-size="16">Heat leaves as color. Red vapor becomes orange liquid. Blue has not started.</text>' +
        "</svg>"
      );
    }
    if (id === "txv") {
      return (
        '<svg class="ca-svg" viewBox="0 0 960 540">' +
        '<rect width="960" height="540" fill="#0b1218"/>' +
        '<text x="36" y="42" fill="#ff7a1a" font-size="18">orange liquid in</text>' +
        '<text x="620" y="42" fill="#3aa0e0" font-size="18">blue mist is the flash</text>' +
        '<rect x="40" y="248" width="220" height="28" rx="6" fill="#c45a12"/>' +
        '<rect x="250" y="160" width="280" height="210" rx="16" fill="#1a222b" stroke="#c4a574" stroke-width="6"/>' +
        '<path class="ca-dia" d="M290 188 h200 q-20 28 -100 28 q-80 0 -100 -28z" fill="#d5dee6" opacity="0.9"/>' +
        '<rect x="372" y="214" width="16" height="36" rx="3" fill="#d5dee6"/>' +
        '<g class="ca-pin">' +
        '<rect x="374" y="248" width="12" height="70" fill="#e8c450"/>' +
        '<polygon points="368,318 392,318 380,338" fill="#e8c450"/>' +
        "</g>" +
        '<rect x="360" y="336" width="40" height="10" rx="2" fill="#6d7580"/>' +
        '<path d="M330 250 q-20 40 10 70" fill="none" stroke="#d5dee6" stroke-width="6"/>' +
        '<rect x="530" y="250" width="200" height="26" rx="6" fill="#1d4e73"/>' +
        '<circle class="ca-mist" cx="545" cy="263" r="7" fill="#3aa0e0"/>' +
        '<circle class="ca-mist d2" cx="545" cy="258" r="4" fill="#7ec8f0"/>' +
        '<circle class="ca-mist d3" cx="545" cy="268" r="5" fill="#3aa0e0"/>' +
        '<path d="M400 175 q80 -40 160 20" fill="none" stroke="#7ec8f0" stroke-width="3"/>' +
        '<rect x="560" y="150" width="70" height="22" rx="8" fill="#1d4e73"/>' +
        '<text x="120" y="500" fill="#a8b0b8" font-size="16">Orange stops at the pin. Blue starts at the seat.</text>' +
        "</svg>"
      );
    }
    if (id === "evaporator") {
      return (
        '<svg class="ca-svg" viewBox="0 0 960 540">' +
        '<rect width="960" height="540" fill="#0b1218"/>' +
        '<text x="36" y="42" fill="#7ec8f0" font-size="18">blue two-phase in, boiling</text>' +
        '<text x="500" y="42" fill="#3aa0e0" font-size="18">blue vapor out, that is superheat</text>' +
        '<rect x="80" y="120" width="760" height="250" rx="12" fill="#101820" stroke="#24556f" stroke-width="4"/>' +
        fins() +
        '<rect x="120" y="250" width="640" height="26" rx="8" fill="#1d4e73"/>' +
        '<circle class="ca-bub" cx="150" cy="263" r="7" fill="#3aa0e0"/>' +
        '<circle class="ca-bub d2" cx="150" cy="255" r="5" fill="#7ec8f0"/>' +
        '<circle class="ca-bub d3" cx="150" cy="270" r="6" fill="#3aa0e0"/>' +
        '<circle class="ca-bub d4" cx="150" cy="260" r="4" fill="#7ec8f0"/>' +
        '<circle class="ca-drip" cx="240" cy="300" r="4" fill="#7ec8f0"/>' +
        '<circle class="ca-drip d2" cx="420" cy="300" r="4" fill="#7ec8f0"/>' +
        '<circle class="ca-drip d3" cx="610" cy="300" r="4" fill="#7ec8f0"/>' +
        '<rect x="760" y="248" width="150" height="30" rx="8" fill="#163a58"/>' +
        '<text x="90" y="500" fill="#a8b0b8" font-size="16">The whole coil is cold. Bubbles die before the outlet. Water on the fins is room moisture, not refrigerant.</text>' +
        "</svg>"
      );
    }
    if (id === "drier") {
      return (
        '<svg class="ca-svg" viewBox="0 0 960 540">' +
        '<rect width="960" height="540" fill="#0b1218"/>' +
        '<text x="36" y="42" fill="#ff7a1a" font-size="18">inlet orange liquid, warm</text>' +
        '<text x="500" y="42" fill="#ff7a1a" font-size="18">outlet orange liquid, same warmth</text>' +
        '<rect x="40" y="246" width="160" height="28" rx="6" fill="#c45a12"/>' +
        '<rect x="180" y="170" width="520" height="180" rx="80" fill="#6b3e22" stroke="#e0b080" stroke-width="6"/>' +
        '<rect x="250" y="200" width="8" height="120" fill="#9aa3ad"/>' +
        beads() +
        '<rect x="600" y="200" width="10" height="120" fill="#2a2420"/>' +
        '<circle class="ca-liq" cx="120" cy="260" r="6" fill="#ff7a1a"/>' +
        '<circle class="ca-liq d2" cx="120" cy="260" r="4" fill="#e23b2f"/>' +
        '<circle class="ca-liq d3" cx="120" cy="260" r="5" fill="#ff7a1a"/>' +
        '<rect x="700" y="248" width="180" height="26" rx="6" fill="#c45a12"/>' +
        '<circle class="ca-liq" cx="760" cy="261" r="5" fill="#ff7a1a"/>' +
        '<text x="90" y="500" fill="#a8b0b8" font-size="16">Warm liquid in, warm liquid out. Trash sticks in the beads. A cold outlet is a plugged core — a fault.</text>' +
        "</svg>"
      );
    }
    return (
      '<svg class="ca-svg" viewBox="0 0 960 540">' +
      '<rect width="960" height="540" fill="#0b1218"/>' +
      '<text x="36" y="36" fill="#e23b2f" font-size="16">1 compressor</text>' +
      '<text x="250" y="36" fill="#ff7a1a" font-size="16">2 condenser</text>' +
      '<text x="470" y="36" fill="#7ec8f0" font-size="16">3 TXV flash</text>' +
      '<text x="680" y="36" fill="#3aa0e0" font-size="16">4 evaporator</text>' +
      '<rect x="40" y="200" width="150" height="110" rx="16" fill="#161d24" stroke="#9aa3ad" stroke-width="4"/>' +
      '<g class="ca-orbit"><path d="M100 255c20 0 22-24 0-24" fill="none" stroke="#e8c450" stroke-width="6"/></g>' +
      '<rect x="190" y="200" width="80" height="16" rx="4" fill="#9c221c"/>' +
      '<circle r="6" fill="#e23b2f"><animateMotion dur="2.4s" repeatCount="indefinite" path="M190 208 H270 V100 H390"/></circle>' +
      '<rect x="390" y="90" width="70" height="150" rx="6" fill="#1a222b" stroke="#9c221c" stroke-width="3"/>' +
      '<rect class="ca-bot" x="398" y="180" width="54" height="18" rx="3" fill="#ff7a1a"/>' +
      '<circle r="5" fill="#ff7a1a"><animateMotion dur="2.4s" repeatCount="indefinite" path="M430 200 H560 V250"/></circle>' +
      '<rect x="540" y="220" width="70" height="70" rx="8" fill="#1a222b" stroke="#c4a574" stroke-width="3"/>' +
      '<circle class="ca-mist" cx="610" cy="255" r="5" fill="#3aa0e0"/>' +
      '<rect x="680" y="180" width="220" height="120" rx="10" fill="#101820" stroke="#1d4e73" stroke-width="3"/>' +
      '<circle class="ca-bub" cx="700" cy="250" r="5" fill="#3aa0e0"/>' +
      '<circle class="ca-drip" cx="760" cy="290" r="3" fill="#7ec8f0"/>' +
      '<rect x="40" y="330" width="160" height="14" rx="4" fill="#1d4e73"/>' +
      '<circle r="5" fill="#3aa0e0"><animateMotion dur="3s" repeatCount="indefinite" path="M700 340 H200 V310 H70"/></circle>' +
      '<text x="36" y="430" fill="#e23b2f" font-size="16">red heat</text>' +
      '<text x="160" y="430" fill="#ff7a1a" font-size="16">orange heat</text>' +
      '<text x="330" y="430" fill="#3aa0e0" font-size="16">blue cold</text>' +
      '<text x="40" y="500" fill="#a8b0b8" font-size="16">Red discharge. Orange liquid. Blue after the valve. The suction line comes home blue.</text>' +
      "</svg>"
    );
  }
  function tube(y, tone) {
    var fill = "#e23b2f";
    var cls = "";
    var h = 20;
    var dy = 6;
    if (tone === "hot") fill = "#ff7a1a";
    if (tone === "mid") {
      fill = "#ff9a3c";
      cls = ' class="ca-mid"';
      h = 16;
      dy = 8;
    }
    if (tone === "bot") {
      fill = "#e07a2f";
      cls = ' class="ca-bot"';
    }
    return (
      '<rect x="140" y="' + y + '" width="520" height="32" rx="8" fill="#5c4030"/>' +
      '<rect' + cls + ' x="150" y="' + (y + dy) + '" width="500" height="' + h + '" rx="6" fill="' + fill + '"/>'
    );
  }
  function fins() {
    var s = "";
    var x = 140;
    while (x < 760) {
      s += '<line x1="' + x + '" y1="140" x2="' + x + '" y2="350" stroke="#2c3842" stroke-width="3"/>';
      x += 18;
    }
    return s;
  }
  function beads() {
    var s = "";
    var x = 290;
    while (x < 560) {
      var y = 230;
      while (y < 320) {
        s += '<circle cx="' + x + '" cy="' + y + '" r="7" fill="#c4a15a"/>';
        y += 22;
      }
      x += 26;
    }
    return s;
  }

  function font() {
    if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
      };
    }
    return "600 15px IBM Plex Sans, system-ui, sans-serif";
  }
  function label() {}
  function plate(ctx) {
    var g = ctx.createLinearGradient(0, 0, 0, 540);
    g.addColorStop(0, "#3c342e");
    g.addColorStop(0.48, "#1a1614");
    g.addColorStop(1, "#0b0908");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 960, 540);
    var bench = ctx.createLinearGradient(0, 340, 0, 540);
    bench.addColorStop(0, "#5a4c40");
    bench.addColorStop(1, "#2a211b");
    ctx.fillStyle = bench;
    ctx.fillRect(0, 392, 960, 148);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 392, 960, 3);
    var v = ctx.createRadialGradient(260, 36, 10, 500, 240, 700);
    v.addColorStop(0, "rgba(255, 232, 200, 0.26)");
    v.addColorStop(0.38, "rgba(255,255,255,0.05)");
    v.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 960, 540);
  }
  function heat(u) {
    var r, g, b, t;
    t = u < 0 ? 0 : u > 1 ? 1 : u;
    r = 58 + (226 - 58) * t;
    g = 160 + (59 - 160) * t;
    b = 224 + (47 - 224) * t;
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  }
  function fit(canvas) {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(280, r.width || 640);
    var h = Math.max(160, r.height || 360);
    var pw = Math.round(w * dpr);
    var ph = Math.round(h * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    var ctx = canvas.getContext("2d");
    ctx.setTransform((pw / 960), 0, 0, (ph / 540), 0, 0);
    return ctx;
  }
  function trace(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    var i;
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  }
  function metalPipe(ctx, pts, fluid, wallW, boreW) {
    if (!pts || pts.length < 2) return;
    wallW = wallW || 26;
    boreW = boreW || 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([]);
    ctx.save();
    ctx.translate(1.6, 2.4);
    trace(ctx, pts);
    ctx.strokeStyle = "rgba(0,0,0,0.38)";
    ctx.lineWidth = wallW;
    ctx.stroke();
    ctx.restore();
    trace(ctx, pts);
    ctx.strokeStyle = "#e7b27a";
    ctx.lineWidth = wallW;
    ctx.stroke();
    trace(ctx, pts);
    ctx.strokeStyle = "#8a4e28";
    ctx.lineWidth = wallW * 0.78;
    ctx.stroke();
    trace(ctx, pts);
    ctx.strokeStyle = "#4a2816";
    ctx.lineWidth = wallW * 0.5;
    ctx.stroke();
    ctx.save();
    ctx.translate(-1, -1.3);
    trace(ctx, pts);
    ctx.strokeStyle = "rgba(255, 214, 170, 0.42)";
    ctx.lineWidth = Math.max(2, wallW * 0.16);
    ctx.stroke();
    ctx.restore();
    trace(ctx, pts);
    ctx.strokeStyle = "#140e0b";
    ctx.lineWidth = boreW + 2.5;
    ctx.stroke();
    trace(ctx, pts);
    ctx.strokeStyle = fluid;
    ctx.lineWidth = boreW;
    ctx.stroke();
    ctx.save();
    ctx.translate(0, -Math.max(1.2, boreW * 0.22));
    trace(ctx, pts);
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = Math.max(1.4, boreW * 0.22);
    ctx.stroke();
    ctx.restore();
  }
  function finPack(ctx, x0, x1, y0, y1, step) {
    var x, g;
    for (x = x0; x <= x1; x += step) {
      g = ctx.createLinearGradient(x, y0, x + 5, y0);
      g.addColorStop(0, "#7e8a94");
      g.addColorStop(0.42, "#e7eef3");
      g.addColorStop(1, "#66727c");
      ctx.fillStyle = g;
      ctx.fillRect(x, y0, 3, y1 - y0);
    }
  }
  function arcPts(x, y1, y2, side) {
    var pts = [];
    var mid = (y1 + y2) / 2;
    var ry = Math.abs(y2 - y1) / 2;
    var rx = Math.min(32, ry);
    var i, a;
    for (i = 0; i <= 12; i++) {
      a = -Math.PI / 2 + (Math.PI * i) / 12;
      pts.push([x + side * Math.cos(a) * rx, mid + Math.sin(a) * ry]);
    }
    return pts;
  }
  function catPts(list) {
    var out = [];
    var i, j, p, last;
    for (i = 0; i < list.length; i++) {
      for (j = 0; j < list[i].length; j++) {
        p = list[i][j];
        last = out[out.length - 1];
        if (last && Math.abs(last[0] - p[0]) < 0.6 && Math.abs(last[1] - p[1]) < 0.6) continue;
        out.push(p);
      }
    }
    return out;
  }
  function along(pts, u) {
    var segL = [];
    var total = 0;
    var i, dx, dy, L, d, f, a, b;
    for (i = 1; i < pts.length; i++) {
      dx = pts[i][0] - pts[i - 1][0];
      dy = pts[i][1] - pts[i - 1][1];
      L = Math.sqrt(dx * dx + dy * dy);
      segL.push(L);
      total += L;
    }
    if (!total) return { x: pts[0][0], y: pts[0][1], seg: 0, f: 0 };
    d = Math.max(0, Math.min(0.9999, u)) * total;
    for (i = 0; i < segL.length; i++) {
      if (d <= segL[i] || i === segL.length - 1) {
        f = segL[i] ? d / segL[i] : 0;
        if (f < 0) f = 0;
        if (f > 1) f = 1;
        a = pts[i];
        b = pts[i + 1];
        return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, seg: i, f: f };
      }
      d -= segL[i];
    }
    return { x: pts[0][0], y: pts[0][1], seg: 0, f: 0 };
  }
  function dot(ctx, x, y, rad, color) {
    var g = ctx.createRadialGradient(x - rad * 0.35, y - rad * 0.4, rad * 0.05, x, y, rad);
    g.addColorStop(0, "rgba(255,255,255,0.8)");
    g.addColorStop(0.38, color);
    g.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  function bubble(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120, 196, 236, 0.28)";
    ctx.fill();
    ctx.lineWidth = 1.35;
    ctx.strokeStyle = "#e7f6ff";
    ctx.stroke();
  }
  function slug(ctx, x, y, r, color) {
    var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.2, r * 0.1, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(0.45, color);
    g.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  function springDraw(ctx, x, y0, y1, coils) {
    ctx.beginPath();
    ctx.moveTo(x, y0);
    var i, y, span;
    span = y1 - y0;
    for (i = 0; i <= coils; i++) {
      y = y0 + (span * i) / coils;
      ctx.lineTo(i % 2 === 0 ? x - 16 : x + 16, y);
    }
    ctx.lineTo(x, y1);
    ctx.strokeStyle = "#d5dee6";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
  }
  function fanIcon(ctx, x, y, r, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1a2228";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#c5ced6";
    ctx.stroke();
    ctx.rotate(t * 4.6);
    var i;
    for (i = 0; i < 5; i++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(r * 0.46, 0, r * 0.4, r * 0.15, 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#dbe3ea";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#5c6770";
      ctx.stroke();
    }
    ctx.restore();
    dot(ctx, x, y, r * 0.16, "#4e585f");
    dot(ctx, x - r * 0.04, y - r * 0.04, r * 0.06, "#c5ced6");
  }
  function airStreak(ctx, x, y) {
    ctx.strokeStyle = "rgba(198, 208, 214, 0.7)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 16, y);
    ctx.moveTo(x + 16, y);
    ctx.lineTo(x + 10, y - 3.5);
    ctx.moveTo(x + 16, y);
    ctx.lineTo(x + 10, y + 3.5);
    ctx.stroke();
  }
  function invLocal(th, mirror) {
    var rb = 3.15;
    var x = rb * (Math.cos(th) + th * Math.sin(th));
    var y = rb * (Math.sin(th) - th * Math.cos(th));
    if (mirror) x = -x;
    var scale = 5.15;
    return [x * scale, y * scale];
  }
  function scrollRibbon(ctx, cx, cy, mirror, fill, edge) {
    var th0 = 0.7;
    var th1 = Math.PI * 2.55;
    var n = 150;
    var left = [];
    var right = [];
    var half = 7;
    var i, th, p0, p1, dx, dy, len, nx, ny, px, py;
    var prevNx = 0;
    var prevNy = -1;
    for (i = 0; i <= n; i++) {
      th = th0 + (th1 - th0) * (i / n);
      p0 = invLocal(th, mirror);
      p1 = invLocal(Math.min(th1, th + 0.05), mirror);
      dx = p1[0] - p0[0];
      dy = p1[1] - p0[1];
      len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.01) {
        nx = prevNx;
        ny = prevNy;
      } else {
        nx = -dy / len;
        ny = dx / len;
        prevNx = nx;
        prevNy = ny;
      }
      px = cx + p0[0];
      py = cy + p0[1];
      left.push([px + nx * half, py + ny * half]);
      right.push([px - nx * half, py - ny * half]);
    }
    ctx.beginPath();
    ctx.moveTo(left[0][0], left[0][1]);
    for (i = 1; i < left.length; i++) ctx.lineTo(left[i][0], left[i][1]);
    for (i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = edge;
    ctx.stroke();
    return invLocal(th1, mirror);
  }
  function steelShell(ctx, cx, cy, r) {
    var i, ang;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 14, 0, Math.PI * 2);
    var glass = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, 8, cx, cy, r);
    glass.addColorStop(0, "rgba(210, 230, 240, 0.16)");
    glass.addColorStop(0.55, "rgba(120, 150, 170, 0.06)");
    glass.addColorStop(1, "rgba(20, 28, 34, 0.18)");
    ctx.fillStyle = glass;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx, cy, r - 18, 0, Math.PI * 2, true);
    var g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    g.addColorStop(0, "#f7fbfc");
    g.addColorStop(0.22, "#c5d0d6");
    g.addColorStop(0.48, "#6d7880");
    g.addColorStop(0.72, "#2a3136");
    g.addColorStop(1, "#e4ecef");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.stroke();
    for (i = 0; i < 10; i++) {
      ang = -0.4 + i * ((Math.PI * 2) / 10);
      dot(ctx, cx + Math.cos(ang) * (r - 9), cy + Math.sin(ang) * (r - 9), 4.4, "#2a3136");
      dot(ctx, cx + Math.cos(ang) * (r - 9), cy + Math.sin(ang) * (r - 9), 1.6, "#e8eef1");
    }
    ctx.restore();
  }
  function filmFinish(ctx, t) {
    ctx.save();
    var v = ctx.createRadialGradient(480, 250, 90, 480, 280, 620);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, 960, 540);
    ctx.restore();
  }
  function capsule(ctx, x, y, w, h) {
    var r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath();
  }
  function mesh(ctx, x, y, h, dirty) {
    var i, yy;
    ctx.strokeStyle = dirty ? "#241c16" : "#d5dee4";
    ctx.lineWidth = dirty ? 3.5 : 1.4;
    for (i = 0; i < 9; i++) {
      yy = y + (h * i) / 8;
      ctx.beginPath();
      ctx.moveTo(x, yy);
      ctx.lineTo(x + 16, yy);
      ctx.stroke();
    }
    for (i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 8, y);
      ctx.lineTo(x + i * 8, y + h);
      ctx.stroke();
    }
    if (dirty) {
      ctx.fillStyle = "#1a1410";
      ctx.fillRect(x - 2, y + 18, 20, h - 36);
      dot(ctx, x + 8, y + h * 0.35, 5, "#3a2c22");
      dot(ctx, x + 6, y + h * 0.62, 4, "#2a2218");
    }
  }
  function bead(ctx, x, y, r) {
    var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r);
    g.addColorStop(0, "#f3e6c8");
    g.addColorStop(0.7, "#c6a15a");
    g.addColorStop(1, "#8a6840");
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  function drawCompressor(ctx, t) {
    var cx = 500;
    var cy = 300;
    var R = 188;
    var orbitA = t * 2.15;
    var orbitR = 12;
    var ox = Math.cos(orbitA) * orbitR;
    var oy = Math.sin(orbitA) * orbitR;
    plate(ctx);
    label(ctx, "Blue vapor in the outer pocket", 36, 42, "#3aa0e0");
    label(ctx, "Red vapor leaves the center", 560, 42, "#e23b2f");
    metalPipe(ctx, [[24, cy], [cx - R + 10, cy]], "#163a58", 22, 10);
    steelShell(ctx, cx, cy, R);
    metalPipe(ctx, [[cx, cy - R + 8], [cx, 48]], "#9c221c", 22, 10);
    var fixedTip = scrollRibbon(ctx, cx, cy, false, "#d5dde4", "#5d6972");
    ctx.fillStyle = "#8b969e";
    ctx.fillRect(cx + fixedTip[0] - 4, cy + fixedTip[1] - 5, 26, 10);
    label(ctx, "FIXED", cx + fixedTip[0] - 8, cy + fixedTip[1] - 10, "#9aa6b0", 11);
    ctx.save();
    ctx.translate(ox, oy);
    var tip = scrollRibbon(ctx, cx, cy, true, "#e2b45a", "#6e5424");
    var mx = cx + tip[0];
    var my = cy + tip[1];
    ctx.fillStyle = "#1a1208";
    ctx.fillRect(mx - 3.5, my - 13, 7, 22);
    ctx.fillStyle = "#fff6dc";
    ctx.fillRect(mx - 1.6, my - 11, 3.2, 18);
    ctx.restore();
    dot(ctx, cx, cy, 12, "#5c1814");
    dot(ctx, cx, cy, 6.5, "#e23b2f");
    var k, s, p, ang, rad, pt, hy;
    for (k = 0; k < 4; k++) {
      s = ((t * 0.22) + k * 0.25) % 1;
      var sx = 36 + s * 340;
      var sd = Math.abs(sx - cx);
      if (sd > R - 16 && sd < R + 16) continue;
      dot(ctx, sx, cy, 4.2, "#3aa0e0");
    }
    for (k = 0; k < 7; k++) {
      p = ((t * 0.13) + k / 7) % 1;
      ang = Math.PI + p * Math.PI * 3.15;
      rad = 10 + (1 - p) * 128;
      pt = [cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad];
      if (Math.sqrt((pt[0] - cx) * (pt[0] - cx) + (pt[1] - cy) * (pt[1] - cy)) < R - 28) {
        dot(ctx, pt[0], pt[1], 5.1 - p * 2.2, heat(0.05 + p * 0.95));
      }
    }
    for (k = 0; k < 4; k++) {
      hy = ((t * 0.28) + k * 0.25) % 1;
      s = cy - hy * (cy - 52);
      if (s > cy - 16 || s < cy - R + 6) dot(ctx, cx, s, 4.4, "#e23b2f");
    }
    var bi;
    for (bi = 0; bi < 8; bi++) {
      ang = (bi / 8) * Math.PI * 2 + 0.35;
      if (Math.sin(ang) > 0.55) continue;
      dot(ctx, cx + Math.cos(ang) * (R + 8), cy + Math.sin(ang) * (R + 8), 5, "#6a737c");
      dot(ctx, cx + Math.cos(ang) * (R + 8), cy + Math.sin(ang) * (R + 8), 2, "#d5dee6");
    }
    label(ctx, "One scroll is fixed. The brass scroll orbits — the white mark stays upright. It does not spin.", 36, 496, "#a8b0b8", 14);
    label(ctx, "Vapor only. Pockets march inward and get hotter. No liquid in the compressor.", 36, 518, "#a8b0b8", 14);
  }
  function drawCondenser(ctx, t) {
    var y = [132, 202, 272, 342, 412];
    var L = 168;
    var R = 736;
    var top = catPts([
      [[96, y[0]], [R, y[0]]],
      arcPts(R, y[0], y[1], 1),
      [[R, y[1]], [L, y[1]]],
    ]);
    var mid = catPts([
      arcPts(L, y[1], y[2], -1),
      [[L, y[2]], [R, y[2]]],
      arcPts(R, y[2], y[3], 1),
      [[R, y[3]], [L, y[3]]],
    ]);
    var bot = catPts([
      arcPts(L, y[3], y[4], -1),
      [[L, y[4]], [R, y[4]]],
      [[R, y[4]], [918, y[4]]],
    ]);
    plate(ctx);
    label(ctx, "Top tubes: red vapor", 36, 40, "#e23b2f");
    label(ctx, "Bottom: orange liquid, still warm", 520, 40, "#ff7a1a");
    finPack(ctx, 150, 790, 100, 448, 9);
    ctx.fillStyle = "#5c6770";
    ctx.fillRect(146, 96, 10, 356);
    ctx.fillRect(786, 96, 10, 356);
    metalPipe(ctx, top, "#e23b2f", 24, 11);
    metalPipe(ctx, mid, "#ff5a22", 24, 11);
    metalPipe(ctx, bot, "#ff7a1a", 24, 11);
    fanIcon(ctx, 868, 168, 40, t);
    var i, u, p, ay;
    for (i = 0; i < 5; i++) {
      u = ((t * 0.33) + i * 0.19) % 1;
      ay = [167, 237, 307, 377][i % 4];
      airStreak(ctx, 210 + u * 480, ay);
    }
    label(ctx, "air", 828, 228, "#9aa6b0", 12);
    var k, q;
    for (k = 0; k < 8; k++) {
      q = along(top, ((t * 0.07) + k / 8) % 1);
      dot(ctx, q.x, q.y, 3.1, "#e23b2f");
    }
    for (k = 0; k < 10; k++) {
      u = ((t * 0.06) + k / 10) % 1;
      q = along(mid, u);
      if (u > 0.12) slug(ctx, q.x, q.y + 2.2, 1.3 + u * 2.6, "#ff7a1a");
      if (u < 0.82) dot(ctx, q.x, q.y - 2.2, 3.1 * (1 - u * 0.85), "#e23b2f");
    }
    for (k = 0; k < 8; k++) {
      q = along(bot, ((t * 0.08) + k / 8) % 1);
      slug(ctx, q.x, q.y, 4.1, "#ff7a1a");
    }
    label(ctx, "Desuperheat", 176, 118, "#e23b2f", 13);
    label(ctx, "Condensing", 176, 258, "#ff7a1a", 13);
    label(ctx, "Subcooled liquid · still warm", 176, 456, "#e08a3a", 13);
    label(ctx, "Dye stays in the copper. Fins stay bare aluminum. The fan moves air, not refrigerant.", 36, 508, "#a8b0b8", 14);
  }
  function drawTxv(ctx, t) {
    var phase = (t % 9) / 9;
    var open;
    if (phase < 0.34) open = 0;
    else if (phase < 0.48) open = (phase - 0.34) / 0.14;
    else if (phase < 0.82) open = 1;
    else open = 1 - (phase - 0.82) / 0.18;
    var pinX = 430;
    var seatY = 318;
    var tipY = seatY - 3 - open * 20;
    plate(ctx);
    label(ctx, open > 0.55 ? "Superheat high · diaphragm opens the pin" : "Superheat low · spring closes the pin", 36, 40, open > 0.55 ? "#7ec8f0" : "#e8c450");
    label(ctx, "Blue flash stays in the outlet", 620, 40, "#3aa0e0");
    metalPipe(ctx, [[24, seatY], [274, seatY]], "#c45a12", 26, 12);
    metalPipe(ctx, [[586, seatY], [936, seatY]], open > 0.22 ? "#163a58" : "#1a140f", 26, 12);
    var body = ctx.createLinearGradient(280, 80, 520, 420);
    body.addColorStop(0, "#f0d7a4");
    body.addColorStop(0.45, "#c4a46a");
    body.addColorStop(1, "#7a5a32");
    ctx.beginPath();
    ctx.roundRect(268, 92, 324, 292, 18);
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = body;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.roundRect(268, 92, 324, 292, 18);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#f3e2c4";
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(268, 110);
    ctx.lineTo(300, 110);
    ctx.lineTo(300, 360);
    ctx.lineTo(268, 366);
    ctx.closePath();
    ctx.fillStyle = "#8a6840";
    ctx.fill();
    ctx.strokeStyle = "#fff4e4";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(280, 108, 28, 250);
    ctx.clip();
    ctx.strokeStyle = "rgba(40, 28, 14, 0.28)";
    ctx.lineWidth = 1;
    var hi;
    for (hi = 0; hi < 28; hi++) {
      ctx.beginPath();
      ctx.moveTo(280 + hi, 108);
      ctx.lineTo(308, 128 + hi * 8);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "rgba(214, 226, 232, 0.12)";
    ctx.beginPath();
    ctx.roundRect(296, 148, 276, 214, 12);
    ctx.fill();
    ctx.fillStyle = "#c45a12";
    ctx.beginPath();
    ctx.roundRect(274, seatY - 7, pinX - 20 - 274, 14, 7);
    ctx.fill();
    ctx.fillStyle = open > 0.22 ? "#163a58" : "#140e0c";
    ctx.beginPath();
    ctx.roundRect(pinX + 16, seatY - 7, 586 - (pinX + 16), 14, 7);
    ctx.fill();
    var dome = ctx.createLinearGradient(320, 70, 540, 160);
    dome.addColorStop(0, "#f4e2bc");
    dome.addColorStop(1, "#a68448");
    ctx.beginPath();
    ctx.ellipse(pinX, 118, 92, 34, 0, 0, Math.PI * 2);
    ctx.fillStyle = dome;
    ctx.fill();
    ctx.strokeStyle = "#5c4630";
    ctx.lineWidth = 3;
    ctx.stroke();
    label(ctx, "sealed", pinX - 22, 114, "#3a2c1c", 12);
    ctx.beginPath();
    ctx.moveTo(330, 168);
    ctx.quadraticCurveTo(pinX, open > 0.5 ? 192 : 158, 530, 168);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#d5dee6";
    ctx.stroke();
    springDraw(ctx, pinX, 176, 250 - open * 30, 7);
    ctx.fillStyle = "#e2b45a";
    ctx.fillRect(pinX - 6, tipY - 78, 12, 78);
    ctx.beginPath();
    ctx.moveTo(pinX - 11, tipY);
    ctx.lineTo(pinX + 11, tipY);
    ctx.lineTo(pinX, tipY + 12);
    ctx.fill();
    ctx.fillStyle = "#8d969e";
    ctx.fillRect(pinX - 28, seatY - 8, 56, 16);
    ctx.fillStyle = open > 0.22 ? "#1d4e73" : "#1a120e";
    ctx.fillRect(pinX - 8, seatY - 5, 16, 10);
    ctx.strokeStyle = "#b87333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(690, seatY - 22);
    ctx.quadraticCurveTo(760, 70, pinX + 70, 96);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(676, seatY - 36, 22, 12, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#c4a46a";
    ctx.fill();
    ctx.strokeStyle = "#6a5030";
    ctx.lineWidth = 2;
    ctx.stroke();
    label(ctx, "bulb on the suction line", 600, seatY - 52, "#c5ced6", 12);
    var k, x;
    for (k = 0; k < 6; k++) {
      x = 36 + (((t * 64) + k * 48) % 360);
      if (x < pinX - 18) dot(ctx, x, seatY, 4.4, "#ff7a1a");
    }
    dot(ctx, pinX - 22, seatY, 4.6, "#ff7a1a");
    if (open > 0.22) {
      var n = 3 + Math.round(open * 4);
      for (k = 0; k < n; k++) {
        var m = ((t * 0.42) + k / n) % 1;
        dot(ctx, pinX + 22 + m * (900 - pinX), seatY, 2.2 + (1 - m) * 2.2, "#3aa0e0");
      }
    }
    label(ctx, "Orange liquid stops at the pin. Blue flash is born at the seat and stays in the outlet tube.", 36, 474, "#a8b0b8", 14);
    label(ctx, "Nothing leaves the power head. The spring and the diaphragm fight over superheat.", 36, 498, "#a8b0b8", 14);
  }
  function drawEvaporator(ctx, t) {
    var y = [178, 264, 350];
    var L = 176;
    var R = 784;
    var first = catPts([[[78, y[0]], [R, y[0]]]]);
    var second = catPts([
      arcPts(R, y[0], y[1], 1),
      [[R, y[1]], [L, y[1]]],
    ]);
    var last = catPts([
      arcPts(L, y[1], y[2], -1),
      [[L, y[2]], [900, y[2]]],
    ]);
    plate(ctx);
    label(ctx, "First tubes: liquid shrinks, bubbles grow", 36, 40, "#7ec8f0");
    label(ctx, "Last tube: vapor only · superheat", 520, 40, "#3aa0e0");
    finPack(ctx, 150, 820, 128, 402, 9);
    ctx.fillStyle = "#5c6770";
    ctx.fillRect(146, 124, 10, 282);
    ctx.fillRect(816, 124, 10, 282);
    metalPipe(ctx, first, "#143e5e", 24, 12);
    metalPipe(ctx, second, "#1a4e73", 24, 12);
    metalPipe(ctx, last, "#2a78aa", 24, 12);
    var k, u, q, liq, bub;
    for (k = 0; k < 7; k++) {
      u = ((t * 0.07) + k / 7) % 1;
      q = along(first, u);
      liq = 4.3 * (1 - u * 0.35);
      bub = 1.5 + u * 1.6;
      slug(ctx, q.x, q.y + 2, liq, "#14567e");
      bubble(ctx, q.x, q.y - 1.5, bub);
    }
    for (k = 0; k < 7; k++) {
      u = ((t * 0.07) + 0.08 + k / 7) % 1;
      q = along(second, u);
      liq = 2.8 * (1 - u);
      bub = 2.8 + u * 1.6;
      if (liq > 1.15) slug(ctx, q.x, q.y + 2, liq, "#14567e");
      bubble(ctx, q.x, q.y - 1.2, Math.min(3.5, bub));
    }
    for (k = 0; k < 8; k++) {
      u = ((t * 0.08) + k / 8) % 1;
      q = along(last, u);
      dot(ctx, q.x, q.y, 3.1, "#3aa0e0");
    }
    var cling = [230, 420, 610];
    for (k = 0; k < cling.length; k++) {
      dot(ctx, cling[k], 222, 3.2, "#d5e4ea");
      dot(ctx, cling[k] + 2, 220, 1.2, "#ffffff");
      dot(ctx, cling[k] + 90, 308, 2.8, "#d5e4ea");
    }
    var pan = ctx.createLinearGradient(140, 424, 140, 456);
    pan.addColorStop(0, "#c5ced4");
    pan.addColorStop(1, "#6a737c");
    ctx.beginPath();
    ctx.roundRect(140, 424, 700, 30, 6);
    ctx.fillStyle = pan;
    ctx.fill();
    ctx.fillStyle = "#c5d5dc";
    ctx.fillRect(156, 440, 668, 8);
    for (k = 0; k < 6; k++) {
      var drip = ((t * 0.45) + k * 0.16) % 1;
      var dx = 200 + k * 100;
      dot(ctx, dx, 402 + drip * 28, 3.1, "#d7e6ec");
      dot(ctx, dx - 1, 400 + drip * 28, 1.1, "#ffffff");
    }
    label(ctx, "condensate", 760, 444, "#3a4450", 12);
    label(ctx, "Water on the fins is not refrigerant. It drips into the pan. Liquid in the last tube means floodback.", 36, 508, "#a8b0b8", 14);
  }
  function drawDrier(ctx, t) {
    var plugged = (t % 16) > 11.4;
    var mid = 286;
    plate(ctx);
    label(ctx, plugged ? "FAULT · outlet screen plugged · outlet flashes cold" : "NORMAL · warm liquid in, warm liquid out", 36, 42, plugged ? "#7ec8f0" : "#ff7a1a");
    metalPipe(ctx, [[24, mid], [188, mid]], "#c45a12", 24, 11);
    metalPipe(ctx, [[742, mid], [930, mid]], plugged ? "#163a58" : "#c45a12", 24, 11);
    var shellG = ctx.createLinearGradient(200, 160, 200, 420);
    shellG.addColorStop(0, "#e6c49a");
    shellG.addColorStop(0.35, "#b8834e");
    shellG.addColorStop(1, "#5c3a28");
    capsule(ctx, 188, 168, 554, 230);
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = shellG;
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f6e0c8";
    ctx.stroke();
    ctx.fillStyle = "#6a4328";
    ctx.fillRect(188, 168, 554, 16);
    ctx.fillRect(188, 382, 554, 16);
    capsule(ctx, 210, 196, 510, 176);
    ctx.fillStyle = "rgba(214, 226, 232, 0.12)";
    ctx.fill();
    ctx.save();
    capsule(ctx, 196, 168, 80, 230);
    ctx.clip();
    ctx.strokeStyle = "rgba(40, 24, 12, 0.35)";
    ctx.lineWidth = 1;
    var hs;
    for (hs = 0; hs < 16; hs++) {
      ctx.beginPath();
      ctx.moveTo(196, 180 + hs * 14);
      ctx.lineTo(280, 196 + hs * 14);
      ctx.stroke();
    }
    ctx.restore();
    mesh(ctx, 248, 210, 150, false);
    mesh(ctx, 662, 210, 150, plugged);
    var x, y, n;
    n = 0;
    for (x = 292; x <= 630; x += 32) {
      for (y = 230; y <= 360; y += 30) {
        bead(ctx, x, y, 11);
        if (n % 4 === 0) dot(ctx, x + 3, y - 2, 2.1, "#3a2a20");
        if (n % 5 === 1) dot(ctx, x - 3, y + 3, 1.7, "rgba(214,228,232,0.95)");
        n++;
      }
    }
    var k, px;
    if (!plugged) {
      for (k = 0; k < 5; k++) {
        px = 40 + (((t * 90) + k * 70) % 200);
        dot(ctx, px, mid, 4.2, "#ff7a1a");
      }
      for (k = 0; k < 4; k++) {
        px = 300 + (((t * 70) + k * 80) % 340);
        dot(ctx, px, mid, 4, "#ff7a1a");
      }
      for (k = 0; k < 4; k++) {
        px = 760 + (((t * 90) + k * 40) % 150);
        dot(ctx, px, mid, 4.2, "#ff7a1a");
      }
    } else {
      for (k = 0; k < 7; k++) {
        px = 80 + (((t * 36) + k * 70) % 540);
        if (px > 640) px = 620 + (k % 3) * 8;
        dot(ctx, px, mid + ((k % 3) - 1) * 5, 4.2, "#ff7a1a");
      }
      for (k = 0; k < 4; k++) {
        px = 770 + (((t * 55) + k * 36) % 140);
        dot(ctx, px, mid, 3.6, "#3aa0e0");
      }
    }
    label(ctx, "in", 48, mid - 22, "#ff7a1a", 12);
    label(ctx, plugged ? "cold flash" : "out", 800, mid - 22, plugged ? "#3aa0e0" : "#ff7a1a", 12);
    label(ctx, "Moisture and trash stick in the beads. That is the job. A cold outlet means the core is stopped up.", 36, 508, "#a8b0b8", 14);
  }
  function drawCycle(ctx, t) {
    var step = Math.floor((t % 10) / 2.5) % 4;
    var lines = [
      "The compressor takes in cool vapor and discharges hot high-pressure vapor.",
      "The condenser rejects that heat. Vapor becomes warm liquid. Still warm, not cold.",
      "The expansion valve drops the pressure. Liquid flashes cold at the seat.",
      "The evaporator boils the mix and takes heat from the room. Cool vapor goes home.",
    ];
    var P = [
      [168, 392],
      [168, 168],
      [96, 188],
      [250, 208],
      [96, 236],
      [250, 264],
      [96, 292],
      [268, 318],
      [360, 336],
      [520, 336],
      [648, 268],
      [720, 168],
      [860, 188],
      [720, 216],
      [860, 244],
      [730, 148],
      [520, 96],
      [168, 96],
      [168, 330],
    ];
    function segColor(seg) {
      if (seg <= 1) return "#e23b2f";
      if (seg <= 4) return "#ff5c24";
      if (seg <= 9) return "#ff7a1a";
      return "#3aa0e0";
    }
    function tag(text, x, y, on, color) {
      ctx.font = (on ? "700 " : "600 ") + "16px IBM Plex Sans, system-ui, sans-serif";
      ctx.fillStyle = on ? "#fff6dc" : "#d7e0e6";
      ctx.textAlign = "left";
      ctx.fillText(text, x, y);
      ctx.strokeStyle = on ? color : "rgba(215,224,230,0.35)";
      ctx.lineWidth = on ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x, y + 6);
      ctx.lineTo(x + ctx.measureText(text).width, y + 6);
      ctx.stroke();
    }
    ctx.fillStyle = "#0c1218";
    ctx.fillRect(0, 0, 960, 540);
    ctx.fillStyle = "#f4efe6";
    ctx.font = "700 28px IBM Plex Sans, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Refrigeration Cycle", 480, 38);
    ctx.textAlign = "left";
    function cab(x, y, w, h) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 14);
      ctx.fillStyle = "rgba(186, 198, 206, 0.14)";
      ctx.fill();
      ctx.strokeStyle = "rgba(226, 232, 236, 0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    cab(48, 64, 300, 390);
    cab(612, 64, 300, 390);
    var i;
    for (i = 0; i < P.length - 1; i++) metalPipe(ctx, [P[i], P[i + 1]], segColor(i), 16, 7);
    steelShell(ctx, 168, 392, 52);
    var orbitA = t * 2.15;
    ctx.save();
    ctx.translate(Math.cos(orbitA) * 4, Math.sin(orbitA) * 4);
    ctx.strokeStyle = "#e2b45a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(168, 392, 16, 0.2, Math.PI * 1.15);
    ctx.stroke();
    ctx.fillStyle = "#fff6dc";
    ctx.fillRect(178, 378, 3, 10);
    ctx.restore();
    ctx.strokeStyle = "#d5dee6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(168, 392, 16, Math.PI, Math.PI * 1.9);
    ctx.stroke();
    fanIcon(ctx, 190, 108, 22, t);
    fanIcon(ctx, 860, 360, 20, t * 0.8);
    ctx.fillStyle = "#c4a574";
    ctx.beginPath();
    ctx.roundRect(628, 246, 36, 44, 6);
    ctx.fill();
    var pinOpen = Math.sin(t * 1.1) > 0;
    ctx.fillStyle = "#e2b45a";
    ctx.fillRect(642, pinOpen ? 252 : 264, 6, pinOpen ? 28 : 16);
    tag("Compressor", 64, 478, step === 0, "#e23b2f");
    tag("Condenser coil", 64, 88, step === 1, "#ff7a1a");
    tag("Expansion valve", 500, 372, step === 2, "#e8c450");
    tag("Evaporator coil", 628, 88, step === 3, "#3aa0e0");
    var k, u, q;
    for (k = 0; k < 14; k++) {
      u = ((t * 0.05) + k / 14) % 1;
      q = along(P, u);
      dot(ctx, q.x, q.y, 3.5, segColor(q.seg));
    }
    ctx.fillStyle = "rgba(8, 10, 12, 0.88)";
    ctx.fillRect(20, 492, 920, 38);
    ctx.fillStyle = "#f4efe6";
    ctx.font = "600 15px IBM Plex Sans, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(lines[step], 32, 516);
  }
  function drawFrame(canvas, t) {
    var ctx = fit(canvas);
    font();
    var id = (CLIPS[drawFrame.i] || CLIPS[0]).id;
    ctx.clearRect(0, 0, 960, 540);
    if (id === "compressor") drawCompressor(ctx, t);
    else if (id === "condenser") drawCondenser(ctx, t);
    else if (id === "txv") drawTxv(ctx, t);
    else if (id === "evaporator") drawEvaporator(ctx, t);
    else if (id === "drier") drawDrier(ctx, t);
    else drawCycle(ctx, t);
    filmFinish(ctx, t);
  }

  let hold = false;

  function start(host, opts) {
    if (!host) return { stop: function () {} };
    let i = 0;
    if (opts && opts.clip) {
      const n = CLIPS.findIndex(function (c) { return c.id === opts.clip; });
      if (n >= 0) i = n;
    }

    let raf = 0;
    let voice = null;
    let voiced = false;
    drawFrame.i = i;

    function clip() {
      return CLIPS[i] || CLIPS[0];
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (hold || clip().id === "cycle") return;
      var canvas = host.querySelector("#ca-canvas");
      if (!canvas) return;
      drawFrame.i = i;
      drawFrame(canvas, now / 1000);
    }

    function paintPlay() {
      var btn = host.querySelector("#ca-play");
      if (btn) btn.textContent = hold ? "Play" : "Pause";
    }

    function stopVoice() {
      if (voice) {
        voice.pause();
        voice = null;
      }
      if (global.speechSynthesis) global.speechSynthesis.cancel();
    }

    function hear() {
      stopVoice();
      voiced = true;
      voice = new Audio("cutaway/narration/" + clip().id + ".mp3");
      var play = voice.play();
      if (play && play.catch) play.catch(function () {});
    }

    function syncFilm() {
      var stage = host.querySelector("#ca-stage");
      var film = host.querySelector("#ca-film");
      var canvas = host.querySelector("#ca-canvas");
      var reel = clip().id === "cycle";
      if (stage) stage.classList.toggle("is-reel", reel);
      if (canvas) canvas.style.display = reel ? "none" : "block";
      if (!film) return;
      film.style.display = reel ? "block" : "none";
      if (reel && !hold) {
        var p = film.play();
        if (p && p.catch) p.catch(function () {});
      } else film.pause();
    }

    function paint() {
      const c = clip();
      const mark = (global.LtBrand && global.LtBrand.mark) || "LT";
      host.innerHTML =
        '<div class="ca-lab">' +
        '<header class="ca-head">' +
        '<div class="brand-bar" style="justify-content:flex-start;margin:0">' +
        '<div class="brand-mark" style="width:28px;height:28px;font-size:13px">' + mark + '</div>' +
        '<div class="brand-word"><strong style="font-size:14px">See inside</strong>' +
        "<span>Clear shell · refrigerant stays in the pipe</span></div></div>" +
        '<div class="ca-head-btns">' +
        '<button type="button" class="btn primary" id="ca-play">' + (hold ? "Play" : "Pause") + '</button>' +
        '<button type="button" class="btn" id="ca-voice">Hear Hub</button>' +
        '<button type="button" class="btn" id="ca-fs">Full screen</button>' +
        '<button type="button" class="btn" id="ca-hub">Shop floor</button>' +
        "</div></header>" +
        '<p class="ca-how">Pick a part. Pause if you want to look. Red and orange are heat. Blue is cold. Nothing leaves the pipe.</p>' +
        '<div class="ca-stage' + (c.id === "cycle" ? " is-reel" : "") + '" id="ca-stage">' +
        '<video id="ca-film" class="ca-film" src="cutaway/cycle-reel.mp4?v=1" playsinline loop muted poster="cutaway/cycle-reel.jpg?v=1"></video>' +
        '<canvas id="ca-canvas"></canvas>' +
        "</div>" +
        '<div class="hub-chip ca-coach">' +
        '<img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />' +
        "<div><strong id='ca-title'>Professor HUB · " + c.title + "</strong>" +
        "<p id='ca-say'>" + c.say + "</p></div></div>" +
        '<div class="ca-nav">' +
        '<button type="button" class="btn" id="ca-prev">Previous part</button>' +
        '<button type="button" class="btn primary" id="ca-next">Next part</button>' +
        "</div>" +
        '<div class="ca-clips" id="ca-clips">' +
        CLIPS.map(function (x, n) {
          return (
            '<button type="button" class="ca-clip' + (n === i ? " on" : "") + '" data-ca="' + x.id + '">' +
            '<img src="' + x.poster + '" alt="" />' +
            "<span><b>" + x.title + "</b><small>" + x.sub + "</small></span></button>"
          );
        }).join("") +
        "</div></div>";

      if (!raf) loop(0);
      syncFilm();
      const playBtn = host.querySelector("#ca-play");
      if (playBtn) playBtn.onclick = function () {
        hold = !hold;
        paintPlay();
        syncFilm();
        if (!hold && clip().id !== "cycle") {
          var canvas = host.querySelector("#ca-canvas");
          if (canvas) drawFrame(canvas, performance.now() / 1000);
        }
      };
      const voiceBtn = host.querySelector("#ca-voice");
      if (voiceBtn) voiceBtn.onclick = hear;
      const hub = host.querySelector("#ca-hub");
      if (hub) hub.onclick = function () {
        if (opts && opts.onHub) opts.onHub();
        else if (global.ltPlay) global.ltPlay("hub");
      };
      const fs = host.querySelector("#ca-fs");
      if (fs) fs.onclick = toggleFs;
      host.querySelector("#ca-prev").onclick = function () { showAt((i + CLIPS.length - 1) % CLIPS.length); };
      host.querySelector("#ca-next").onclick = function () { showAt((i + 1) % CLIPS.length); };
      host.querySelectorAll("[data-ca]").forEach(function (b) {
        b.onclick = function () {
          const n = CLIPS.findIndex(function (x) { return x.id === b.getAttribute("data-ca"); });
          if (n >= 0) showAt(n);
        };
      });
    }

    function showAt(n) {
      i = n;
      drawFrame.i = i;
      const c = clip();
      const t = host.querySelector("#ca-title");
      const s = host.querySelector("#ca-say");
      if (t) t.textContent = "Professor HUB · " + c.title;
      if (s) s.textContent = c.say;
      if (voiced) hear();
      host.querySelectorAll(".ca-clip").forEach(function (b) {
        b.classList.toggle("on", b.getAttribute("data-ca") === c.id);
      });
      if (opts && opts.onXp) opts.onXp(2);
      syncFilm();
    }

    function toggleFs() {
      const stage = host.querySelector("#ca-stage") || host;
      const root = host.querySelector(".ca-lab") || host;
      const on = document.fullscreenElement;
      if (on) {
        if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
        root.classList.remove("ca-fs");
        return;
      }
      const el = stage;
      const req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) {
        Promise.resolve(req.call(el)).catch(function () {});
      }
      root.classList.add("ca-fs");
    }

    paint();
    return {
      stop: function () {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        hold = false;
        voiced = false;
        stopVoice();
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(function () {});
        }
        host.innerHTML = "";
      },
      show: function (id) {
        const n = CLIPS.findIndex(function (c) { return c.id === id; });
        if (n >= 0) showAt(n);
      },
    };
  }

  global.CutawayLab = {
    start: start,
    CLIPS: CLIPS,
    hold: function (v) { hold = !!v; },
    frame: function (canvas, id, t) {
      var n = 0;
      var k;
      for (k = 0; k < CLIPS.length; k++) if (CLIPS[k].id === id) n = k;
      drawFrame.i = n;
      drawFrame(canvas, t);
    },
  };
})(window);
