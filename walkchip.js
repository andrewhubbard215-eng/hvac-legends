/* First-visit walk-through for bays that open on a tool wall.
   Close it or drag it. It stays dismissed on this device. */
(function (global) {
  "use strict";
  var KEY = "lt-walk-off";
  var COPY = {
    furnace: ["Pick gas, oil, or boiler.", "Hit Call heat.", "Watch the lamps in order before you touch the gas valve.", "Then set the fault and hit the fix that matches it."],
    electrical: ["New here: open Land the lugs.", "The gold bar names the screw.", "Drag that wire color onto it.", "Meter the part only after the wire is landed."],
    elguide: ["The bar names the next screw.", "Drag that wire color onto it.", "Got it moves you to the next one.", "Wrong color does not land."],
    sandbox: ["Drop four parts: compressor, condenser, metering device, evaporator.", "Hit Start.", "Read superheat and subcool.", "Do not add gas to a dirty coil or a filter problem."],
    braze: ["Nitrogen through the pipe first. Never oxygen.", "Heat the fitting, not the rod.", "Touch the rod when the copper is ready to melt it.", "Both sides of the cup, then kill the torch and leave the nitrogen on."],
    call90: ["Read both meters before you pick a part.", "24 volts on one side of the limit and 0 on the other means the limit is open.", "The ignitor stays dark because the limit ate the call.", "Change the part the meter names."],
    recover: ["Set the tank on the scale before you open a hose.", "Pull until the scale stops climbing.", "0 psi is not empty if that weight never moved.", "Then prove it tight, then weigh the new charge."],
    defusal: ["Hit Walk it with me if this is your first Saturday.", "Meter the part before you replace it.", "The new part has to pass the same test."],
  };

  function off() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }

  function hide(mode) {
    var chip = document.getElementById("walk-chip");
    if (chip) chip.hidden = true;
    if (!mode) return;
    var seen = off();
    seen[mode] = 1;
    try { localStorage.setItem(KEY, JSON.stringify(seen)); } catch (e) {}
  }

  function show(mode) {
    var steps = COPY[mode];
    if (!steps) {
      hide();
      return;
    }
    if (off()[mode]) return;
    var chip = document.getElementById("walk-chip");
    if (!chip) {
      chip = document.createElement("aside");
      chip.id = "walk-chip";
      chip.className = "walk-chip";
      (document.getElementById("app") || document.body).appendChild(chip);
      if (global.LtDrag && global.LtDrag.makeMoveable) {
        chip._dragReady = true;
      }
    }
    chip.hidden = false;
    chip.classList.remove("open");
    chip.innerHTML =
      '<header class="walk-chip-head" id="walk-chip-head">' +
      "<strong>Walk-through</strong>" +
      '<span class="walk-chip-actions">' +
      '<button type="button" id="walk-chip-steps">Steps</button>' +
      '<button type="button" id="walk-chip-x">Close</button></span></header>' +
      '<ol id="walk-chip-ol">' + steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
    chip.querySelector("#walk-chip-x").onclick = function (e) {
      e.stopPropagation();
      hide(mode);
    };
    chip.querySelector("#walk-chip-steps").onclick = function (e) {
      e.stopPropagation();
      var open = chip.classList.toggle("open");
      e.currentTarget.textContent = open ? "Hide" : "Steps";
    };
    if (global.LtDrag && global.LtDrag.makeMoveable) {
      global.LtDrag.makeMoveable(chip.querySelector("#walk-chip-head"), chip, "lt-walk-pos");
    }
  }

  function onMode(mode) {
    setTimeout(function () { show(mode); }, 350);
  }

  global.LtWalk = { onMode: onMode, hide: hide };
})(window);
