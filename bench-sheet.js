/* Worksheet for the real iConnect trainer. One step on the phone.
   The virtual board is the other door. This one is for standing at the machine. */
(function (global) {
  "use strict";

  if (!document.getElementById("bs-phone-css")) {
    var phoneCss = document.createElement("style");
    phoneCss.id = "bs-phone-css";
    phoneCss.textContent = [
      ".bs{padding:8px 12px 20px;max-width:100%;box-sizing:border-box}",
      ".bs-count{color:#e8c450;font-weight:700;margin:0 0 6px}",
      ".bs-say{font-size:20px;line-height:1.35;margin:0 0 10px;color:#f6f1e6}",
      ".bs-choices{display:flex;flex-direction:column;gap:8px}",
      ".bs-choice{min-height:52px;border-radius:12px;border:1px solid #6d5b3c;background:#1c2126;color:#f6f0e2;font-weight:700;font-size:18px;text-align:left;padding:8px 12px}",
      ".bs-choice.on{background:#e8c450;color:#1a1408}",
      ".bs-write{width:100%;box-sizing:border-box;min-height:48px;font-size:18px;border-radius:10px;padding:8px 10px}",
      ".bs-nav{display:flex;gap:8px;margin-top:12px}",
      ".bs-nav .btn{min-height:48px;flex:1}",
      ".bs-block{color:#ffb4a8}",
      ".bs-sheet{padding-left:18px}",
    ].join("\n");
    document.head.appendChild(phoneCss);
  }

  function sheets() {
    return {
      tu522: [
        { id: "name", say: "You are at the TU-522. Write your name.", kind: "text", placeholder: "Name" },
        { id: "power", say: "Look at the disconnect before any cord moves. Is it off?", kind: "choice", choices: ["Off", "On"], must: "Off", block: "Stop. Turn the disconnect off before anyone lands a cord." },
        { id: "ref", say: "Read the plate out loud. Write the refrigerant. This board is not R-410A.", kind: "text", placeholder: "R-____", accept: ["134"], miss: "Look again. This compressor board is R-134a." },
        { id: "c1", say: "Land L1 to the temperature control. That switch is the call for cool. Mark it when the cord is on.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The cord is not on yet. L1 to the temperature control." },
        { id: "c2", say: "Temperature control to the pump-down switch. The board will not run in pump-down.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Land the pump-down before the pressure controls." },
        { id: "c3", say: "Pump-down out to the low pressure control. Do not jumper it.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Low pressure control is still open on the bench." },
        { id: "c4", say: "Low pressure out to the high pressure control. They are not the same switch.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "High pressure control is still waiting." },
        { id: "c5", say: "High pressure out to one side of the contactor coil.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The coil does not have the string yet." },
        { id: "c6", say: "The other side of the coil to L2.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The coil still needs L2." },
        { id: "c7", say: "Contactor T1 to the overload, then overload to compressor common.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "Common is still open. Overload, then common." },
        { id: "c8", say: "Compressor run to the run capacitor. Start capacitor only through the potential relay.", kind: "choice", choices: ["Landed", "Not yet"], must: "Landed", block: "The start circuit is not finished." },
        { id: "jump", say: "Did anyone jumper a safety to make it run?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Pull that jumper. A safety stays in the string." },
        { id: "fault", say: "On the real exercise, write the cord that was wrong.", kind: "text", placeholder: "What was wrong" },
        { id: "left", say: "Board left the way the silk screen shows. No cord across a safety.", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "Put it back before you leave the trainer." },
      ],
      tu601: [
        { id: "name", say: "You are at the TU-601. Write your name.", kind: "text", placeholder: "Name" },
        { id: "ref", say: "Read the plate out loud. Which refrigerant is on it?", kind: "choice", choices: ["R-410A", "R-134a", "R-22"], must: "R-410A", block: "Wrong bottle. The plate on this mini-split says R-410A." },
        { id: "volts", say: "Voltage on that same plate.", kind: "choice", choices: ["208/240", "120", "24"], must: "208/240", block: "This outdoor unit is 208/240, not a 24-volt stat." },
        { id: "out", say: "Put your hand on the outdoor unit. Which one is it?", kind: "choice", choices: ["Daikin on the floor", "Ceiling cassette", "High wall"], must: "Daikin on the floor", block: "The cassette is indoor. The Daikin on the floor is the condenser." },
        { id: "lines", say: "Count the line sets. The high wall is one pair. The cassette is another. Write the number.", kind: "text", placeholder: "How many", accept: ["2", "two"], miss: "Two indoor heads. Two pairs. Count them on the frame." },
        { id: "hose", say: "Blue hose is suction. If the gauges are not on, the answer is still suction.", kind: "choice", choices: ["Suction", "Liquid"], must: "Suction", block: "Blue is suction. Red is liquid." },
        { id: "nest", say: "Is a 24-volt Nest landed on this Daikin?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Take it off. This compressor keeps its own control." },
        { id: "note", say: "Write one thing you would tell the next class before they touch a hose.", kind: "text", placeholder: "One line" },
        { id: "left", say: "Caps on. Trainer left the way you found it.", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "Caps on before you walk away." },
      ],
      tu210g: [
        { id: "name", say: "You are at the TU-210G. Write your name.", kind: "text", placeholder: "Name" },
        { id: "moves", say: "What moves the heat on this trainer?", kind: "choice", choices: ["Water", "Refrigerant"], must: "Water", block: "This is a boiler. Water moves the heat. Leave the manifold on the cart." },
        { id: "zones", say: "Name the three zones you can point at.", kind: "text", placeholder: "Radiator, baseboard, unit heater", accept: ["rad", "base", "heat"], miss: "Radiator, baseboard, and the unit heater. Each has its own valve." },
        { id: "tank", say: "The tank on the water side is a what?", kind: "choice", choices: ["Expansion tank", "Receiver"], must: "Expansion tank", block: "A receiver holds refrigerant. This tank is on the water." },
        { id: "water", say: "Is there water in the boiler, and is the high limit closed?", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "Stop. No gas until water is in the boiler and the high limit is closed." },
        { id: "gauges", say: "Is a manifold hooked to that copper?", kind: "choice", choices: ["No", "Yes"], must: "No", block: "Take the gauges off. That pipe is water." },
        { id: "gas", say: "Gas valve last. Did the class wait until the water was proved?", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "Back up. Water and the high limit, then the valve." },
        { id: "left", say: "Trainer left safe. Valve where the instructor says. No gauges on the copper.", kind: "choice", choices: ["Yes", "No"], must: "Yes", block: "Do not leave it until the valve and the gauges are right." },
      ],
    };
  }

  function rowsFor(unit) {
    var custom = sheets()[unit.id];
    if (custom) return custom;
    var rows = [{ id: "name", say: "You are at the " + unit.model + ". Write your name.", kind: "text", placeholder: "Name" }];
    (unit.steps || []).forEach(function (text, i) {
      rows.push({ id: "s" + i, say: text, kind: "text", placeholder: "What you found on the trainer" });
    });
    rows.push({
      id: "left",
      say: "Trainer left the way the plate says. No safety jumped.",
      kind: "choice",
      choices: ["Yes", "No"],
      must: "Yes",
      block: "Put it back before you leave.",
    });
    return rows;
  }

  function storeKey(id) {
    var school = (global.SchoolPack && global.SchoolPack.id) || "school";
    return "lt-bench-" + school + "-" + id;
  }

  function load(id) {
    try { return JSON.parse(localStorage.getItem(storeKey(id)) || "{}"); } catch (e) { return {}; }
  }
  function save(id, data) {
    try { localStorage.setItem(storeKey(id), JSON.stringify(data)); } catch (e) {}
  }

  function good(item, value) {
    var v = String(value || "").trim();
    if (!v) return false;
    if (item.must) return v === item.must;
    if (item.accept) {
      var n = v.toLowerCase();
      return item.accept.some(function (a) { return n.indexOf(String(a).toLowerCase()) >= 0; });
    }
    return true;
  }

  function mount(host, unit, hooks) {
    if (!host || !unit) return { stop: function () {} };
    hooks = hooks || {};
    var rows = rowsFor(unit);
    var saved = load(unit.id);
    var step = saved.done ? rows.length : (saved.step || 0);
    var answers = saved.answers || {};
    var say = "";

    function persist() {
      save(unit.id, { step: step, answers: answers, done: step >= rows.length });
    }
    function render() {
      if (step >= rows.length) {
        host.innerHTML = summary();
        bindSummary();
        return;
      }
      var item = rows[step];
      var val = answers[item.id] || "";
      var field = item.kind === "choice"
        ? '<div class="bs-choices">' + item.choices.map(function (c) {
            return '<button type="button" class="bs-choice' + (val === c ? " on" : "") + '" data-choice="' + c.replace(/"/g, "") + '">' + c + "</button>";
          }).join("") + "</div>"
        : '<input class="bs-write" id="bs-write" type="text" enterkeyhint="done" placeholder="' + (item.placeholder || "Write it") + '" value="' + String(val).replace(/&/g, "").replace(/"/g, "").replace(/</g, "") + '" />';
      host.innerHTML =
        '<div class="bs">' +
        '<p class="bs-count">At the machine · ' + (step + 1) + " of " + rows.length + "</p>" +
        '<p class="bs-say">' + item.say + "</p>" +
        (say ? '<p class="bs-block">' + say + "</p>" : "") +
        field +
        '<div class="bs-nav">' +
        '<button type="button" class="btn" id="bs-back"' + (step === 0 ? " disabled" : "") + ">Back</button>" +
        '<button type="button" class="btn primary" id="bs-next">Next</button>' +
        "</div></div>";
      host.querySelectorAll("[data-choice]").forEach(function (b) {
        b.onclick = function () {
          answers[item.id] = b.getAttribute("data-choice");
          say = "";
          persist();
          render();
        };
      });
      var write = host.querySelector("#bs-write");
      if (write) {
        write.oninput = function () { answers[item.id] = write.value; persist(); };
        write.focus();
      }
      var back = host.querySelector("#bs-back");
      if (back) back.onclick = function () { if (step > 0) { step -= 1; say = ""; persist(); render(); } };
      host.querySelector("#bs-next").onclick = function () {
        var live = write ? write.value : answers[item.id];
        answers[item.id] = live || "";
        if (!good(item, answers[item.id])) {
          say = item.block || item.miss || "Write what you see on the trainer, then go on.";
          persist();
          render();
          return;
        }
        say = "";
        step += 1;
        if (step >= rows.length && hooks.onDone) hooks.onDone();
        persist();
        render();
      };
    }
    function summary() {
      var lines = rows.map(function (item) {
        return "<li><b>" + (answers[item.id] || "—") + "</b><span>" + item.say + "</span></li>";
      }).join("");
      return (
        '<div class="bs">' +
        '<p class="bs-count">' + unit.model + " · sheet done</p>" +
        "<p class=\"bs-say\">Show this phone to the instructor. Then practice the same trainer at home.</p>" +
        '<ol class="bs-sheet">' + lines + "</ol>" +
        '<button type="button" class="btn" id="bs-again">Start the sheet over</button>' +
        "</div>"
      );
    }
    function bindSummary() {
      var again = host.querySelector("#bs-again");
      if (again) again.onclick = function () {
        step = 0;
        answers = {};
        say = "";
        persist();
        render();
      };
    }
    render();
    return { stop: function () { host.innerHTML = ""; } };
  }

  function finished(id) {
    return !!(load(id) && load(id).done);
  }

  global.BenchSheet = { mount: mount, finished: finished };
})(window);
