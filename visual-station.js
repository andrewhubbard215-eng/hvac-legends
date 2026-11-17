/* Visual stations for the two machines on this floor that are not the TU-522.
   Tap the gold part. The picture is the lesson. */
(function (global) {
  "use strict";

  var SCENES = {
    tu601: {
      plate: "TU-601 · R-410A only · 208/240 V · 20 A · two indoor heads",
      guide: [
        { id: "plate", say: "Our lab. Read the plate out loud. R-410A. 208/240. Tap it." },
        { id: "outdoor", say: "The outdoor unit is the box on the floor. Tap it." },
        { id: "wall", say: "Zone 1 is the high wall. Its own line set. Tap it." },
        { id: "cassette", say: "Zone 2 is the ceiling cassette. A second pair. Tap it." },
        { id: "yellow", say: "Yellow stays capped. Blue is suction. Red is liquid. Tap the yellow hose." },
        { id: "glass", say: "Six sight glasses show the refrigerant. Do not open a valve. Tap the glasses." },
        { id: "louver", say: "The louver in front of the outdoor coil is how they restrict airflow. Tap it." },
        { id: "faults", say: "Fault switches insert a short, a ground, or an open. Tap them. Do not flip one yet." },
        { id: "compressor", say: "Find the compressor. Do not ohm it live. Tap it." },
      ],
      exerciseSay: "Someone landed a Nest on the Daikin, stole the cassette's line set, and left the yellow hose open. Tap the gold part.",
      fixes: [
        { id: "nest", say: "Pull the Nest off the outdoor unit. It does not run this compressor." },
        { id: "cassette", say: "Give the ceiling cassette its own line set." },
        { id: "yellow", say: "Cap the yellow hose. It is not on a port until you mean it." },
      ],
    },
    tu210: {
      plate: "TU-210G · gas boiler · water, not refrigerant · three zones",
      guide: [
        { id: "plate", say: "Read the plate. Gas boiler. Water moves the heat. Tap the plate." },
        { id: "rad", say: "Zone one is the radiator. It has its own valve. Tap it." },
        { id: "base", say: "Zone two is the baseboard. Tap it." },
        { id: "heater", say: "Zone three is the unit heater. Tap it." },
        { id: "tank", say: "The expansion tank is on the water. It is not a refrigerant receiver. Tap it." },
        { id: "water", say: "Prove water is in the boiler and the high limit is closed. Tap the sight glass." },
        { id: "gas", say: "Now the gas valve. Not before the water. Tap it." },
        { id: "manifold", say: "The manifold does not belong on that copper. Tap it to leave it on the cart." },
      ],
      exerciseSay: "The manifold is on the boiler copper, the gas valve is open with no water proved, and the tank says receiver. Tap the gold part.",
      fixes: [
        { id: "manifold", say: "Take the manifold off the copper. This is water." },
        { id: "water", say: "Prove water and the high limit before anyone touches gas." },
        { id: "tank", say: "That tank is an expansion tank, not a receiver." },
      ],
    },
  };

  function ensureNowCss() {
    if (typeof document === "undefined" || document.getElementById("vs-now-css")) return;
    var st = document.createElement("style");
    st.id = "vs-now-css";
    st.textContent = ".vs-now{margin:0 0 8px;padding:12px 14px;border:1px solid #e8c450;border-radius:14px;background:#1a160e}.vs-now strong{display:block;font-size:22px;color:#f6f1e6;line-height:1.2}.vs button{min-height:44px}";
    document.head.appendChild(st);
  }

  function mount(host, id, hooks) {
    var scene = SCENES[id];
    if (!host || !scene) return { stop: function () {} };
    ensureNowCss();
    hooks = hooks || {};
    var mode = "guide";
    var step = 0;
    var guideCleared = false;
    var left = scene.fixes.map(function (f) { return f.id; });
    var say = scene.guide[0].say;

    function hotId() {
      if (mode === "guide") return scene.guide[step] ? scene.guide[step].id : "";
      return left[0] || "";
    }
    function render() {
      var hot = hotId();
      host.innerHTML =
        '<div class="vs">' +
        '<div class="vs-now"><strong>' + say + "</strong></div>" +
        '<div class="vs-modes">' +
        '<button type="button" class="btn' + (mode === "guide" ? " primary" : "") + '" data-mode="guide">Guided</button>' +
        '<button type="button" class="btn' + (mode === "exercise" ? " primary" : "") + '" data-mode="exercise"' + (guideCleared ? "" : " disabled") + ">Exercise</button>" +
        '<button type="button" class="btn" id="vs-hint">Hint</button>' +
        '<button type="button" class="btn" id="vs-ask">Ask HUB</button>' +
        (mode === "exercise" ? '<button type="button" class="btn primary" id="vs-check">Check the machine</button>' : "") +
        "</div>" +
        '<p class="vs-plate">' + scene.plate + "</p>" +
        '<div class="vs-hub"><img src="hub-portrait.jpg?v=3" alt="" /><p>' + say + "</p></div>" +
        picture(id, hot) +
        "</div>";
      host.querySelectorAll("[data-mode]").forEach(function (b) {
        b.onclick = function () { setMode(b.getAttribute("data-mode")); };
      });
      host.querySelectorAll("[data-part]").forEach(function (b) {
        b.onclick = function () { tap(b.getAttribute("data-part")); };
      });
      var hint = host.querySelector("#vs-hint");
      if (hint) hint.onclick = function () {
        say = mode === "guide"
          ? (scene.guide[step] ? scene.guide[step].say : "Guided is done. Press Exercise.")
          : (left.length ? "Gold part. " + fixSay(left[0]) : "The machine is right. Check it.");
        render();
      };
      var ask = host.querySelector("#vs-ask");
      if (ask) ask.onclick = function () {
        var q = scene.plate + " " + say;
        if (global.HubAI && global.HubAI.say) global.HubAI.say(q);
      };
      var check = host.querySelector("#vs-check");
      if (check) check.onclick = function () {
        if (left.length) {
          say = "Not yet. " + fixSay(left[0]);
          render();
          return;
        }
        say = "Machine is right. The picture matches the plate.";
        if (hooks.onExerciseClear) hooks.onExerciseClear();
        render();
      };
    }
    function fixSay(part) {
      var f = scene.fixes.filter(function (x) { return x.id === part; })[0];
      return f ? f.say : "";
    }
    function tap(part) {
      if (mode === "guide") {
        var want = scene.guide[step];
        if (!want) return;
        if (part !== want.id) {
          say = "Not that part. " + want.say;
          render();
          return;
        }
        step += 1;
        if (step >= scene.guide.length) {
          guideCleared = true;
          say = "You walked the machine. Press Exercise. It is set up wrong on purpose.";
          if (hooks.onGuideDone) hooks.onGuideDone();
        } else {
          say = scene.guide[step].say;
        }
        render();
        return;
      }
      if (left[0] !== part) {
        say = left.length ? "Not yet. " + fixSay(left[0]) : "That part is already right.";
        render();
        return;
      }
      left.shift();
      say = left.length ? fixSay(left[0]) : "Faults are off the machine. Check it.";
      render();
    }
    function setMode(next) {
      if (next === "exercise" && !guideCleared) {
        say = "Walk the gold parts first. The exercise stays locked until the picture is learned.";
        render();
        return;
      }
      mode = next;
      if (next === "guide") {
        step = guideCleared ? scene.guide.length : 0;
        say = guideCleared ? "Guided is already done. Exercise is the machine left wrong." : scene.guide[0].say;
      } else {
        left = scene.fixes.map(function (f) { return f.id; });
        say = scene.exerciseSay;
      }
      render();
    }
    render();
    return { stop: function () { host.innerHTML = ""; } };
  }

  function picture(id, hot) {
    function cls(part, extra) {
      return ' class="vs-part' + (extra ? " " + extra : "") + (part === hot ? " hot" : "") + '" data-part="' + part + '"';
    }
    if (id === "tu601") {
      return (
        '<div class="vs-frame vs-split">' +
        '<button type="button"' + cls("plate", "vs-tag") + '><b>Nameplate</b><span>R-410A · 208/240 · 20A</span></button>' +
        '<button type="button"' + cls("outdoor", "vs-outdoor") + '><i class="vs-fan"></i><b>Daikin outdoor</b><span>Condenser on the floor</span></button>' +
        '<div class="vs-row">' +
        '<button type="button"' + cls("wall", "vs-head") + '><i class="vs-copper"></i><b>High wall</b><span>Its own line set</span></button>' +
        '<button type="button"' + cls("cassette", "vs-head") + '><i class="vs-copper"></i><b>Ceiling cassette</b><span>Zone 2</span></button>' +
        "</div>" +
        '<div class="vs-row">' +
        '<button type="button"' + cls("glass", "vs-zone") + "><b>Sight glasses</b><span>Six on the frame</span></button>" +
        '<button type="button"' + cls("louver", "vs-zone") + "><b>Outdoor louver</b><span>Air over the coil</span></button>" +
        "</div>" +
        '<div class="vs-row">' +
        '<button type="button"' + cls("faults", "vs-zone") + "><b>Fault switches</b><span>One at a time</span></button>" +
        '<button type="button"' + cls("compressor", "vs-zone") + "><b>Compressor</b><span>Not live for ohms</span></button>" +
        "</div>" +
        '<div class="vs-row">' +
        '<button type="button"' + cls("blue", "vs-hose is-blue") + ">Blue · suction</button>" +
        '<button type="button"' + cls("red", "vs-hose is-red") + ">Red · liquid</button>" +
        '<button type="button"' + cls("yellow", "vs-hose is-yellow") + ">Yellow · cap it</button>" +
        "</div>" +
        '<button type="button"' + cls("nest", "vs-nest") + "><b>Nest</b><span>24 volt. Does not belong here.</span></button>" +
        "</div>"
      );
    }
    return (
      '<div class="vs-frame vs-hydro">' +
      '<button type="button"' + cls("plate", "vs-tag") + '><b>Nameplate</b><span>Gas boiler · water</span></button>' +
      '<button type="button"' + cls("boiler", "vs-boiler") + '><b>Boiler</b><span>Heat source. Not a condenser.</span></button>' +
      '<div class="vs-row">' +
      '<button type="button"' + cls("rad", "vs-zone") + "><b>Radiator</b><span>Zone 1</span></button>" +
      '<button type="button"' + cls("base", "vs-zone") + "><b>Baseboard</b><span>Zone 2</span></button>" +
      '<button type="button"' + cls("heater", "vs-zone") + "><b>Unit heater</b><span>Zone 3</span></button>" +
      "</div>" +
      '<div class="vs-row">' +
      '<button type="button"' + cls("tank", "vs-zone") + "><b>Expansion tank</b><span>On the water</span></button>" +
      '<button type="button"' + cls("water", "vs-zone") + "><b>Water · high limit</b><span>Prove this first</span></button>" +
      "</div>" +
      '<button type="button"' + cls("gas", "vs-gas") + "><b>Gas valve</b><span>Last. After the water.</span></button>" +
      '<button type="button"' + cls("manifold", "vs-nest") + "><b>Manifold</b><span>Leave it on the cart.</span></button>" +
      "</div>"
    );
  }

  global.VisualStation = { mount: mount };
})(window);
