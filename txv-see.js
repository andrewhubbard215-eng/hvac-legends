(function () {
  function draw(c, open) {
    var w = c.width, h = c.height, g = c.getContext("2d");
    g.clearRect(0, 0, w, h);
    g.fillStyle = "#10161c";
    g.fillRect(0, 0, w, h);
    g.font = "600 13px IBM Plex Sans, sans-serif";
    g.fillStyle = "#f3e2b0";
    g.fillText("TXV · ghost shell · flash is born at the seat", 16, 24);
    g.strokeStyle = "#c9a46a";
    g.lineWidth = 3;
    g.globalAlpha = 0.9;
    g.beginPath();
    g.moveTo(70, 150); g.lineTo(250, 150); g.lineTo(250, 250); g.lineTo(70, 250); g.closePath();
    g.stroke();
    g.globalAlpha = 1;
    g.fillStyle = "#e07040";
    g.fillRect(16, 186, 54, 16);
    g.fillStyle = "#f0d0a0";
    g.fillText("Liquid in · strainer", 16, 176);
    g.strokeStyle = "#d7c4a0";
    g.strokeRect(78, 182, 28, 24);
    var pin = open ? 168 : 196;
    g.strokeStyle = "#d9dde2";
    g.beginPath(); g.moveTo(168, 120); g.lineTo(168, pin); g.stroke();
    g.fillStyle = "#9aa3ad";
    g.fillRect(160, pin, 16, 18);
    g.strokeStyle = "#c9a46a";
    g.beginPath(); g.moveTo(150, 250); g.lineTo(186, 250); g.lineTo(168, 300); g.closePath(); g.stroke();
    g.fillStyle = "#f0d0a0";
    g.fillText("Spring · stem in raises superheat", 16, 330);
    g.fillStyle = open ? "#3d8bfd" : "#1d4e89";
    g.fillRect(186, 198, open ? 90 : 24, 12);
    g.fillText(open ? "Blue flash born at the seat" : "Pin seated · low superheat", 200, 190);
    g.strokeStyle = "#c98bff";
    g.beginPath(); g.ellipse(168, 108, 46, 14, 0, 0, 6.28); g.stroke();
    g.fillStyle = "#f0d0a0";
    g.fillText("Diaphragm · bulb pressure on top", 200, 100);
    g.strokeStyle = "#e07040";
    g.beginPath(); g.moveTo(168, 94); g.bezierCurveTo(220, 40, 300, 40, 340, 70); g.stroke();
    g.fillStyle = "#c44e52";
    g.fillRect(332, 60, 18, 36);
    g.fillStyle = "#f0d0a0";
    g.fillText("Bulb on the suction line", 250, 54);
    g.strokeStyle = "#3d8bfd";
    g.beginPath(); g.moveTo(250, 200); g.lineTo(300, 200); g.lineTo(300, 120); g.stroke();
    g.fillText("External equalizer · outlet pressure under the diaphragm", 16, 360);
    g.fillStyle = "#9aa3ad";
    g.fillText(open ? "High superheat. Pin open. More liquid." : "Low superheat. Spring closes the pin. Do not add gas.", 16, 384);
  }
  function mount() {
    var root = document.getElementById("cutaway-root");
    if (!root || document.getElementById("txv-see")) return;
    var box = document.createElement("div");
    box.id = "txv-see";
    box.style.cssText = "position:relative;z-index:5;background:#10161c;padding:8px;";
    box.innerHTML = "<canvas id=\"txv-canvas\" width=\"420\" height=\"400\" style=\"width:100%;height:auto;background:#10161c\"></canvas><div style=\"display:flex;gap:8px;margin-top:8px\"><button type=\"button\" class=\"btn primary\" id=\"txv-open\">High superheat · pin opens</button><button type=\"button\" class=\"btn\" id=\"txv-shut\">Low superheat · pin closes</button></div>";
    root.insertBefore(box, root.firstChild);
    var canvas = document.getElementById("txv-canvas");
    function show(open) { draw(canvas, open); }
    document.getElementById("txv-open").onclick = function () { show(true); };
    document.getElementById("txv-shut").onclick = function () { show(false); };
    show(true);
  }
  setInterval(mount, 700);
})();
