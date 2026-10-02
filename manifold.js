/* Field analog manifold — blue compound, red high, yellow utility. */
(function (global) {
  "use strict";

  let loOpen = false;
  let hiOpen = false;

  const START = Math.PI * 0.75;
  const SWEEP = Math.PI * 1.5;

  function maxLow(ref) {
    return ref === "R-22" || ref === "R-134a" ? 250 : 500;
  }
  function maxHigh(ref) {
    return ref === "R-22" || ref === "R-134a" ? 500 : 800;
  }

  function ang(val, min, max) {
    const t = (val - min) / (max - min);
    return START + SWEEP * Math.max(0, Math.min(1, t));
  }

  function tick(ctx, a, r, major) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (r - (major ? 16 : 10)), Math.sin(a) * (r - (major ? 16 : 10)));
    ctx.lineTo(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4));
    ctx.strokeStyle = major ? "#f4efe6" : "#8b98a5";
    ctx.lineWidth = major ? 2 : 1;
    ctx.stroke();
  }

  function needle(ctx, a, r, color) {
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(r - 18, 0);
    ctx.lineTo(-10, 3.5);
    ctx.lineTo(-10, -3.5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#c4a45a";
    ctx.fill();
    ctx.restore();
  }

  function dial(ctx, x, y, r, opts) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = "#2a3238";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = opts.bezel;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0c1014";
    ctx.fill();

    const min = opts.min;
    const max = opts.max;
    const steps = opts.steps;
    ctx.font = "600 9px IBM Plex Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= steps; i++) {
      const v = min + ((max - min) * i) / steps;
      const a = ang(v, min, max);
      tick(ctx, a, r, i % 2 === 0);
      if (i % 2 === 0) {
        ctx.fillStyle = "#d8dde3";
        const label = v < 0 ? String(Math.round(-v)) + '"' : String(Math.round(v));
        ctx.fillText(label, Math.cos(a) * (r - 26), Math.sin(a) * (r - 26));
      }
    }

    ctx.fillStyle = opts.bezel;
    ctx.font = "700 11px IBM Plex Sans, sans-serif";
    ctx.fillText(opts.name, 0, r * 0.22);
    ctx.fillStyle = "#9aa3ad";
    ctx.font = "600 9px IBM Plex Sans, sans-serif";
    ctx.fillText(opts.unit, 0, r * 0.38);

    needle(ctx, ang(opts.value, min, max), r, "#f4efe6");
    ctx.restore();
  }

  function hose(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, y1 + 28, x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function paint(sim, ref) {
    const c = document.getElementById("mf-canvas");
    if (!c || !c.getContext) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = 560;
    const h = 300;
    if (c.width !== w * dpr) {
      c.width = w * dpr;
      c.height = h * dpr;
    }
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    sim = sim || {};
    ref = ref || "R-410A";
    const running = !!(sim.running || sim.trip);
    let pL = typeof sim.pLow === "number" ? sim.pLow : 0;
    let pH = typeof sim.pHigh === "number" ? sim.pHigh : 0;
    if (!running && sim.static) {
      pL = pH = sim.pLow || 0;
    }

    // Body
    ctx.fillStyle = "#3a434c";
    roundRect(ctx, 210, 108, 140, 86, 10);
    ctx.fill();
    ctx.fillStyle = "#c4a45a";
    ctx.font = "700 12px IBM Plex Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MANIFOLD", 280, 132);
    ctx.fillStyle = "#9aa3ad";
    ctx.font = "600 10px IBM Plex Sans, sans-serif";
    ctx.fillText(ref, 280, 148);
    ctx.fillText(loOpen || hiOpen ? "VALVES OPEN" : "VALVES SEATED", 280, 164);

    // Handwheels
    wheel(ctx, 236, 178, loOpen, "#3d8bd4");
    wheel(ctx, 324, 178, hiOpen, "#CE0034");

    dial(ctx, 118, 128, 96, {
      name: "LOW · COMPOUND",
      unit: pL < 0 ? "inHg" : "psig",
      bezel: "#3d8bd4",
      min: -30,
      max: maxLow(ref),
      steps: 10,
      value: pL,
    });
    dial(ctx, 442, 128, 96, {
      name: "HIGH",
      unit: "psig",
      bezel: "#CE0034",
      min: 0,
      max: maxHigh(ref),
      steps: 8,
      value: pH,
    });

    hose(ctx, 118, 224, 118, 278, "#3d8bd4");
    hose(ctx, 442, 224, 442, 278, "#CE0034");
    hose(ctx, 280, 194, 280, 278, "#e8c450");

    ctx.fillStyle = "#3d8bd4";
    ctx.font = "700 10px IBM Plex Sans, sans-serif";
    ctx.fillText("SUCTION", 118, 294);
    ctx.fillStyle = "#e8c450";
    ctx.fillText("VAC / CHARGE", 280, 294);
    ctx.fillStyle = "#CE0034";
    ctx.fillText("LIQUID", 442, 294);

    const note = document.getElementById("mf-read");
    if (note) {
      if (loOpen && hiOpen && running) {
        note.textContent = "Both valves OPEN on a running unit — high is feeding the low through the yellow. Seat the handles to READ.";
      } else if (!running) {
        note.textContent = "Equalized / off. Blue and red should match outdoor sat. Start the compressor, valves CLOSED, then read SH/SC.";
      } else {
        note.textContent =
          "Blue " +
          Math.round(pL) +
          " psig suction · red " +
          Math.round(pH) +
          " psig liquid · yellow capped. Valves closed. That's a reading.";
      }
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wheel(ctx, x, y, open, color) {
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = open ? color : "#1a2026";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function wire() {
    const lo = document.getElementById("mf-lo-v");
    const hi = document.getElementById("mf-hi-v");
    function sync() {
      if (lo) lo.textContent = loOpen ? "Low valve OPEN" : "Low valve CLOSED";
      if (hi) hi.textContent = hiOpen ? "High valve OPEN" : "High valve CLOSED";
      if (lo) lo.classList.toggle("open", loOpen);
      if (hi) hi.classList.toggle("open", hiOpen);
    }
    if (lo) lo.onclick = () => { loOpen = !loOpen; sync(); };
    if (hi) hi.onclick = () => { hiOpen = !hiOpen; sync(); };
    sync();
  }

  global.ManifoldSet = {
    paint: paint,
    wire: wire,
    isOpen: function () { return loOpen || hiOpen; },
  };
})(window);
