/* Recovery room. The bench, then the drills that belong in that bay. */
(function () {
  var STATIONS = [
    { id: "bench", name: "Recovery bench", line: "Pull the charge into a DOT tank. Never vent.", img: "recover/hoses.jpg" },
    { id: "n2", name: "Nitrogen hold", line: "Pressure-test with nitrogen. A falling needle is a leak.", img: "ms/tools/n2.jpg" },
    { id: "decay", name: "Decay test", line: "Pull a vacuum, valve off, watch the microns.", img: "ms/tools/micron.jpg" },
    { id: "weigh", name: "Weigh the charge", line: "Add only the lineset extra. Not the whole nameplate.", img: "recover/tank-scale.jpg" },
    { id: "leak", name: "Find the leak", line: "Soap shows the joint. A sniffer does not.", img: "ms/tools/soap.jpg" },
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  var activeStop = null;

  function start(root, opts) {
    opts = opts || {};
    if (activeStop) {
      try { activeStop(); } catch (err) {}
      activeStop = null;
    }
    if (!root) return { stop: function () {} };
    if (!document.getElementById("rr-style")) {
      var st = document.createElement("style");
      st.id = "rr-style";
      st.textContent = [
        ".rr-lead{margin:8px 16px 0;color:#d5dde4;max-width:720px;line-height:1.4}",
        ".rr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;padding:12px 16px 20px}",
        ".rr-joints{position:absolute;left:8px;right:8px;bottom:8px;z-index:4;display:flex;gap:8px;flex-wrap:wrap}",
        "#recover-root .rr-grid .mode-card{text-align:left}",
      ].join("");
      document.head.appendChild(st);
    }
    var station = "door";
    var timer = null;
    var note = "Pick a station. The charge comes out before anyone pressure-tests or weighs in.";
    var n2 = freshN2();
    var decay = freshDecay();
    var weigh = freshWeigh();
    var leak = freshLeak();

    function freshN2() {
      return { gauges: false, gas: false, tight: false, on: false, psi: 0, hold: false, holdFrom: 0, ticks: 0, done: false };
    }
    function freshDecay() {
      return { pump: false, gauge: false, hoses: false, cap: false, drier: false, on: false, microns: 760000, isolated: false, ticks: 0, done: false };
    }
    function freshWeigh() {
      return { scale: false, tank: false, gauges: false, liquid: false, oz: 0, stopped: false, done: false };
    }
    function freshLeak() {
      return { tool: "", found: false };
    }

    function stopTick() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function say(text) {
      note = text;
    }

    function boot() {
      stopTick();
      paint();
      if (station === "n2" || station === "decay" || station === "weigh") {
        timer = setInterval(tick, 200);
      }
    }

    function tick() {
      if (station === "n2") tickN2();
      else if (station === "decay") tickDecay();
      else if (station === "weigh") tickWeigh();
      var psi = root.querySelector("#rr-psi");
      var mic = root.querySelector("#rr-mic");
      var oz = root.querySelector("#rr-oz");
      var line = root.querySelector("#rr-note");
      if (psi) psi.textContent = Math.round(n2.psi) + " psig";
      if (mic) mic.textContent = showMic(decay.microns);
      if (oz) oz.textContent = weigh.oz.toFixed(1) + " oz";
      if (line) line.textContent = note;
    }

    function showMic(m) {
      if (m >= 1000) return Math.round(m).toLocaleString() + " microns";
      return Math.round(m) + " microns";
    }

    function tickN2() {
      if (n2.done) return;
      if (n2.on && n2.gauges && n2.gas) n2.psi = Math.min(320, n2.psi + 22);
      if (!n2.hold) return;
      n2.ticks += 1;
      if (!n2.tight) n2.psi = Math.max(0, n2.psi - 14);
      if (n2.ticks < 8) return;
      if (n2.tight && n2.psi > 200 && Math.abs(n2.psi - n2.holdFrom) < 12) {
        n2.done = true;
        say("It held. No leak at this pressure. Nitrogen did the test. Oxygen never did.");
      } else if (!n2.tight) {
        say("The needle fell. That flare is loose. Tighten it, bring it back to pressure, and hold again.");
        n2.hold = false;
        n2.ticks = 0;
      }
    }

    function tickDecay() {
      if (decay.done) return;
      var floor = 240;
      if (decay.on && decay.pump && decay.gauge && decay.hoses) {
        decay.microns += (floor - decay.microns) * 0.18;
        if (!decay.isolated) {
          say(decay.microns > 500
            ? "Leave the pump on until the gauge is under 500. Then shut it off and watch."
            : "Under 500. Shut the pump off, then hit Valve off and watch.");
        }
      }
      if (!decay.isolated) return;
      decay.ticks += 1;
      if (!decay.cap) decay.microns += 18000;
      else if (!decay.drier) decay.microns += (1400 - decay.microns) * 0.12;
      if (decay.ticks < 8) return;
      if (!decay.cap) {
        say("It ran away and did not level. The cap is loose. That is a leak. Seat it and pull again.");
        decay.isolated = false;
        decay.ticks = 0;
        decay.on = false;
      } else if (!decay.drier && decay.microns > 500) {
        say("It climbed and leveled off above 500. That is moisture, not a hole. Put the new drier on and pull again.");
        decay.isolated = false;
        decay.ticks = 0;
      } else if (decay.drier && decay.cap && decay.microns < 500) {
        decay.done = true;
        say("Held under 500. Cap was tight and the drier was new. That decay passes.");
      }
    }

    function tickWeigh() {
      if (weigh.done || weigh.stopped || !weigh.liquid) return;
      if (!(weigh.scale && weigh.tank && weigh.gauges)) return;
      weigh.oz += 1.1;
      if (weigh.oz > 80 && !weigh.done) {
        say("Stop. You are past the extra ounces and into the factory charge. That condenser was not empty.");
      }
    }

    function paint() {
      if (station === "door") paintDoor();
      else if (station === "n2") paintN2();
      else if (station === "decay") paintDecay();
      else if (station === "weigh") paintWeigh();
      else if (station === "leak") paintLeak();
    }

    function head(title) {
      return '<header class="hub-head ic-head"><div><p class="eyebrow">Recovery room</p><h2>' + esc(title) + "</h2></div>" +
        '<button type="button" class="btn" id="rr-back">Recovery room</button></header>';
    }

    function noteBox() {
      return '<p class="rc-note" id="rr-note">' + esc(note) + "</p>";
    }

    function paintDoor() {
      root.innerHTML =
        '<header class="hub-head ic-head"><div><p class="eyebrow">Recovery room</p><h2>Refrigerant bay</h2></div>' +
        '<button type="button" class="btn" id="rr-hub">Shop floor</button></header>' +
        '<p class="rr-lead">Five stations. Pull the charge into a DOT tank. 0 psig on a split is the level before you open the system. It does not mean the circuit is empty of liquid if that weight never hit the scale. Then prove it tight, then weigh the new charge.</p>' +
        '<div class="rr-grid">' +
        STATIONS.map(function (s) {
          return '<button type="button" class="mode-card" data-st="' + s.id + '"><img src="' + s.img + '" alt="" /><h3>' + esc(s.name) + "</h3><p>" + esc(s.line) + "</p></button>";
        }).join("") +
        "</div>" + noteBox();
      var hub = root.querySelector("#rr-hub");
      if (hub) hub.onclick = function () { if (opts.onHub) opts.onHub(); };
      root.querySelectorAll("[data-st]").forEach(function (b) {
        b.onclick = function () { openStation(b.getAttribute("data-st")); };
      });
    }

    function openStation(id) {
      stopTick();
      if (id === "bench") {
        if (!window.RecoverLab) {
          say("Recovery bench didn't load. Hard-refresh.");
          station = "door";
          paintDoor();
          return;
        }
        window.RecoverLab.start(root, {
          onBack: function () {
            station = "door";
            note = "Charge is a tank problem. The next stations prove the system, then weigh the new charge.";
            boot();
          },
        });
        return;
      }
      station = id;
      if (id === "n2") {
        n2 = freshN2();
        note = "Gauges first. Nitrogen on the center hose. Tighten the flare. Bring it up near 300, shut the nitrogen, and watch.";
      } else if (id === "decay") {
        decay = freshDecay();
        note = "This system was open. Cap is loose and the drier is the old one. Seat the cap, change the drier, pull down, then valve off.";
      } else if (id === "weigh") {
        weigh = freshWeigh();
        note = "New R-410A condenser. Factory charge covers 15 ft. Lineset is 40 ft. 0.6 oz per foot past that is 15 oz. Do not dump the nameplate in.";
      } else if (id === "leak") {
        leak = freshLeak();
        note = "Nitrogen already showed a drop. Find the joint. Soap on the leak. The sniffer will not name it.";
      }
      boot();
    }

    function piece(id, name, img) {
      return '<button type="button" class="rc-piece" data-piece="' + id + '"><img src="' + img + '?v=1" alt="" /><span>' + esc(name) + "</span></button>";
    }

    function bindPieces(fn) {
      root.querySelectorAll("[data-piece]").forEach(function (b) {
        b.onclick = function () { fn(b.getAttribute("data-piece")); };
      });
      var back = root.querySelector("#rr-back");
      if (back) back.onclick = function () {
        station = "door";
        note = "Back on the bay. Pick the next station.";
        boot();
      };
    }

    function paintN2() {
      root.innerHTML = head("Nitrogen hold") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Parts</p>' +
        piece("gauges", "Manifold", "parts/gauges.png") +
        piece("n2", "Nitrogen", "ms/tools/n2.jpg") +
        piece("wrench", "Flare wrench", "ms/tools/torque.jpg") +
        piece("o2", "Oxygen", "ms/tools/n2.jpg") +
        piece("air", "Shop air", "ms/tools/n2.jpg") +
        piece("jug", "Refrigerant jug", "recover/junk.jpg") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage"><img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Split waiting on a pressure test" />' +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>NITROGEN</em><strong id="rr-psi">' + Math.round(n2.psi) + ' psig</strong><span>' +
        (n2.tight ? "flare tight" : "flare loose") + "</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (n2.on ? " on" : "") + '" id="rr-on"><i></i><span>' + (n2.on ? "ON" : "OFF") + "</span><em>Nitrogen</em></button>" +
        '<button type="button" class="btn primary" id="rr-hold">Watch the hold</button></div>' +
        noteBox() + "</div></div></div>";
      bindPieces(function (id) {
        if (id === "o2") { say("Oxygen plus oil is a fire. Nitrogen is the test gas."); paintN2(); return; }
        if (id === "air") { say("Shop air carries water. It is not a pressure test."); paintN2(); return; }
        if (id === "jug") { say("That is refrigerant. A pressure test never puts refrigerant in."); paintN2(); return; }
        if (id === "gauges") { n2.gauges = true; say("Manifold is on. Blue and red can show the rise. Center hose is waiting on nitrogen."); }
        else if (id === "n2") {
          if (!n2.gauges) say("Gauges first. Nitrogen needs the center hose.");
          else { n2.gas = true; say("Nitrogen is on the center hose. Not oxygen."); }
        } else if (id === "wrench") { n2.tight = true; say("Flare is tight. A loose flare will fail the hold."); }
        paintN2();
      });
      var on = root.querySelector("#rr-on");
      if (on) on.onclick = function () {
        if (!n2.gas || !n2.gauges) { say("Hook the gauges and the nitrogen before you open it."); paintN2(); return; }
        n2.on = !n2.on;
        if (n2.on) { n2.hold = false; say("Nitrogen is open. Let it climb near 300, then shut it."); }
        else say("Nitrogen is shut. Watch the hold. The needle should stay.");
        paintN2();
      };
      var hold = root.querySelector("#rr-hold");
      if (hold) hold.onclick = function () {
        if (n2.on) { say("Shut the nitrogen first. You cannot watch a hold while the cylinder is still feeding."); paintN2(); return; }
        if (n2.psi < 180) { say("Nothing to hold yet. Open the nitrogen until the gauge is near 300."); paintN2(); return; }
        n2.hold = true;
        n2.ticks = 0;
        n2.holdFrom = n2.psi;
        say("Watching. A tight system stays. A leak falls.");
        paintN2();
      };
    }

    function paintDecay() {
      root.innerHTML = head("Decay test") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Parts</p>' +
        piece("hoses", "Hoses", "recover/hoses.jpg") +
        piece("pump", "Vacuum pump", "ms/tools/pump.jpg") +
        piece("gauge", "Micron gauge", "ms/tools/micron.jpg") +
        piece("cap", "Service cap", "recover/core.jpg") +
        piece("drier", "New filter-drier", "recover/tank.jpg") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage"><img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Split ready to evacuate" />' +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>MICRONS</em><strong id="rr-mic">' + showMic(decay.microns) + "</strong><span>" +
        (decay.cap ? "cap on" : "cap loose") + " · " + (decay.drier ? "new drier" : "old drier") + "</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (decay.on ? " on" : "") + '" id="rr-vac"><i></i><span>' + (decay.on ? "ON" : "OFF") + "</span><em>Vacuum</em></button>" +
        '<button type="button" class="btn primary" id="rr-iso">Valve off and watch</button></div>' +
        noteBox() + "</div></div></div>";
      bindPieces(function (id) {
        if (id === "hoses") { decay.hoses = true; say("Hoses are on the service ports."); }
        else if (id === "pump") {
          if (!decay.hoses) say("Hoses first. The pump needs a port.");
          else { decay.pump = true; say("Vacuum pump is on the center hose. It does not recover refrigerant."); }
        } else if (id === "gauge") { decay.gauge = true; say("Micron gauge is on the system, not on the pump blank-off if you can help it."); }
        else if (id === "cap") { decay.cap = true; say("Cap is seated. A loose cap is a leak the decay will catch."); }
        else if (id === "drier") { decay.drier = true; say("New drier is in. The old one was full of air from the open system."); }
        paintDecay();
      });
      var vac = root.querySelector("#rr-vac");
      if (vac) vac.onclick = function () {
        if (!(decay.pump && decay.gauge && decay.hoses)) { say("Hoses, pump, and the micron gauge. Then the switch."); paintDecay(); return; }
        decay.on = !decay.on;
        decay.isolated = false;
        if (decay.on) say(decay.microns > 500
          ? "Pump is on. Leave it pulling until the gauge is under 500. Then shut it off and watch."
          : "Under 500. Shut the pump off, then hit Valve off and watch.");
        else if (decay.microns > 500) say("Pump is off and the gauge is still above 500. Turn it back on and let it get under 500.");
        else say("Pump is off. Hit Valve off and watch.");
        paintDecay();
      };
      var iso = root.querySelector("#rr-iso");
      if (iso) iso.onclick = function () {
        if (decay.on) {
          say(decay.microns > 500
            ? "Still above 500. Leave the pump on. Shut it off only after the gauge is under 500."
            : "Shut the pump off first. A running pump hides the decay. Then hit Valve off and watch.");
          paintDecay();
          return;
        }
        if (decay.microns > 500) { say("Turn the vacuum pump back on. Leave it pulling until the gauge is under 500. Then shut it off and watch."); paintDecay(); return; }
        decay.isolated = true;
        decay.ticks = 0;
        say("Valved off. Watching the microns.");
        paintDecay();
      };
    }

    function paintWeigh() {
      root.innerHTML = head("Weigh the charge") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Parts</p>' +
        piece("scale", "Digital scale", "recover/tank-scale.jpg") +
        piece("tank", "Virgin R-410A", "recover/tank.jpg") +
        piece("gauges", "Manifold", "parts/gauges.png") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage"><img class="rc-unit-img" src="recover/split-bare.jpg?v=1" alt="Condenser with a factory charge" />' +
        '<div class="rc-scale-deck"><div class="rc-scale-face"><em>ADDED</em><strong id="rr-oz">' + weigh.oz.toFixed(1) + " oz</strong><span>target 15 oz extra</span></div></div></div>" +
        '<div class="rc-controls"><div class="rc-switches">' +
        '<button type="button" class="mach-switch' + (weigh.liquid ? " on" : "") + '" id="rr-liq"><i></i><span>' + (weigh.liquid ? "OPEN" : "SHUT") + "</span><em>Liquid</em></button>" +
        '<button type="button" class="btn primary" id="rr-stop">Stop the charge</button>' +
        '<button type="button" class="btn" id="rr-sweat">Charge till it sweats</button></div>' +
        noteBox() + "</div></div></div>";
      bindPieces(function (id) {
        if (id === "scale") { weigh.scale = true; say("Scale is under the tank. Ounces, not a suction guess."); }
        else if (id === "tank") {
          if (!weigh.scale) say("Scale first. You cannot call 15 oz without a weight.");
          else { weigh.tank = true; say("Virgin R-410A is upright on the scale. Liquid valve is still shut."); }
        } else if (id === "gauges") { weigh.gauges = true; say("Manifold is on. Liquid goes in the liquid line, not a vapor dump down the suction."); }
        paintWeigh();
      });
      var liq = root.querySelector("#rr-liq");
      if (liq) liq.onclick = function () {
        if (!(weigh.scale && weigh.tank && weigh.gauges)) { say("Scale, tank, and manifold. Then open liquid."); paintWeigh(); return; }
        if (weigh.stopped) { say("You already stopped. Read the ounces."); paintWeigh(); return; }
        weigh.liquid = !weigh.liquid;
        say(weigh.liquid ? "Liquid is open. Watch the ounces. Stop at 15." : "Liquid is shut.");
        paintWeigh();
      };
      var stop = root.querySelector("#rr-stop");
      if (stop) stop.onclick = function () {
        weigh.liquid = false;
        weigh.stopped = true;
        if (weigh.oz >= 13 && weigh.oz <= 17) {
          weigh.done = true;
          say("15 ounces, give or take. That is the lineset past 15 ft. The nameplate stayed in the condenser.");
        } else if (weigh.oz > 17) {
          say("Too much. You charged like the condenser was empty. Recover the extra. The target was 15 oz.");
          weigh.stopped = false;
        } else {
          say("Short. 40 minus 15 is 25 ft, times 0.6 oz, is 15 oz. Open liquid again.");
          weigh.stopped = false;
        }
        paintWeigh();
      };
      var sweat = root.querySelector("#rr-sweat");
      if (sweat) sweat.onclick = function () {
        say("Sweat on the suction line is not a charge. A flooded coil sweats too. Weigh the extra.");
        paintWeigh();
      };
    }

    function paintLeak() {
      var joints = [
        { id: "flare", name: "Flare nut" },
        { id: "schrader", name: "Schrader" },
        { id: "king", name: "King valve" },
      ];
      root.innerHTML = head("Find the leak") +
        '<div class="rc-board"><aside class="rc-bin"><p class="eyebrow">Tools</p>' +
        piece("soap", "Soap bubbles", "ms/tools/soap.jpg") +
        piece("sniff", "Sniffer", "ms/tools/micron.jpg") +
        piece("dye", "UV dye", "recover/junk.jpg") +
        "</aside><div class=\"rc-play\">" +
        '<div class="rc-stage"><img class="rc-unit-img" src="recover/split-on.jpg?v=1" alt="Outdoor unit with three joints to check" />' +
        '<div class="rr-joints">' + joints.map(function (j) {
          return '<button type="button" class="btn" data-joint="' + j.id + '">' + j.name + "</button>";
        }).join("") + "</div></div>" +
        '<div class="rc-controls">' + noteBox() +
        '<p class="rc-law">Tool in hand: ' + (leak.tool ? esc(leak.tool) : "none") + ".</p></div></div></div>";
      bindPieces(function (id) {
        leak.tool = id;
        if (id === "soap") say("Soap is in your hand. Put it on one joint.");
        else if (id === "sniff") say("Sniffer is in your hand. It will alarm. It will not show the bubble.");
        else say("Dye is in your hand. This flare is in front of you. Dye is for a leak you cannot stand on.");
        paintLeak();
      });
      root.querySelectorAll("[data-joint]").forEach(function (b) {
        b.onclick = function () {
          var joint = b.getAttribute("data-joint");
          if (!leak.tool) { say("Pick the tool first."); paintLeak(); return; }
          if (leak.tool === "sniff") { say("It screams everywhere in the cabinet. That is not the joint. Soap the flare."); paintLeak(); return; }
          if (leak.tool === "dye") { say("Dye needs a run and a light. The flare is right here. Soap it."); paintLeak(); return; }
          if (joint === "flare") {
            leak.found = true;
            say("Bubbles on the flare nut. That is the leak. Tighten it and hold the nitrogen again. The schrader and the king valve stayed dry.");
          } else {
            say("No bubbles on the " + (joint === "king" ? "king valve" : "schrader") + ". Keep going. The flare has not been soaped.");
          }
          paintLeak();
        };
      });
    }

    function stopAll() {
      stopTick();
      if (activeStop === stopAll) activeStop = null;
    }

    boot();
    activeStop = stopAll;
    return { stop: stopAll };
  }

  window.RecoveryRoom = { start: start };
})();
