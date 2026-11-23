/* TU-601 multi-head mini-split sandbox.
   Do something → something happens. Own sandbox. Phone-first. */
(function (global) {
  "use strict";

  function mount(host) {
    if (!host) return;
    let plateRead = false;
    let airflow = false;
    let calling = false;
    let louver = 0; // 0-100 % blocked
    let fault = null; // null | 'dirty' | 'lowCharge' | 'badValve'
    let suction = 118;
    let head = 380;
    let sh = 12;
    let sc = 10;
    let sight = "clear";
    let note = "Read the plate first. R-410A only. 208/240 V, 20 A.";

    function updateReadings() {
      if (!calling || !airflow) {
        suction = 118; head = 380; sh = 12; sc = 10; sight = "clear";
        return;
      }
      // base good values
      suction = 118; head = 380; sh = 12; sc = 10; sight = "clear";
      if (louver > 60) { head += 40; sc -= 4; }
      if (fault === "dirty") { head += 60; sc -= 6; sight = "fog"; }
      if (fault === "lowCharge") { suction -= 30; head -= 40; sh += 15; sc -= 8; sight = "bubbles"; }
      if (fault === "badValve") { suction += 20; head -= 30; sh -= 4; }
    }

    function render() {
      updateReadings();
      host.innerHTML =
        '<div class="tu601">' +
        '<p class="tu601-plate"><strong>TU-601 · multi-head mini-split · R-410A only · 208/240 V · 20 A.</strong><br>Blue hose is suction. Red is liquid. Read the plate before any call.</p>' +
        '<div class="tu601-gauges">' +
        '<div class="gauge blue">Suction<br><b>' + suction + ' psig</b><br>SH ' + sh + '°</div>' +
        '<div class="gauge red">Liquid<br><b>' + head + ' psig</b><br>SC ' + sc + '°</div>' +
        '<div class="sight">Sight glass<br><b>' + sight + '</b></div>' +
        '</div>' +
        '<p class="tu601-note">' + note + '</p>' +
        '<button type="button" class="btn primary" id="tu601-plate">' + (plateRead ? "Plate read" : "Read the plate") + '</button>' +
        '<button type="button" class="btn" id="tu601-air">' + (airflow ? "Air proved" : "Prove the air") + '</button>' +
        '<button type="button" class="btn primary" id="tu601-call"' + (!plateRead || !airflow ? " disabled" : "") + '>' + (calling ? "Stop call" : "Call for cool") + '</button>' +
        '<label>Outdoor louver blocked <input type="range" id="tu601-louver" min="0" max="100" value="' + louver + '"></label>' +
        '<div class="faults">' +
        '<button type="button" class="btn" data-fault="dirty">Dirty coil</button>' +
        '<button type="button" class="btn" data-fault="lowCharge">Low charge</button>' +
        '<button type="button" class="btn" data-fault="badValve">Bad valve</button>' +
        '<button type="button" class="btn" data-fault="">Clear fault</button>' +
        '</div>' +
        '</div>';
      bind();
    }

    function bind() {
      host.querySelector("#tu601-plate").onclick = function () {
        plateRead = true;
        note = "Plate says R-410A only. 208/240. Now prove the air.";
        render();
      };
      host.querySelector("#tu601-air").onclick = function () {
        airflow = true;
        note = "Air is moving. Filter and fans are clear. Now call for cool.";
        render();
      };
      host.querySelector("#tu601-call").onclick = function () {
        if (!plateRead || !airflow) {
          note = "Air before charge. Prove the filter and the indoor fans first.";
          render();
          return;
        }
        calling = !calling;
        note = calling ? "Call is in. Watch the gauges." : "Call is out.";
        render();
      };
      host.querySelector("#tu601-louver").oninput = function (e) {
        louver = Number(e.target.value);
        note = louver > 60 ? "Outdoor air is blocked. Head is rising." : "Louver is open.";
        render();
      };
      host.querySelectorAll("[data-fault]").forEach(function (b) {
        b.onclick = function () {
          fault = b.getAttribute("data-fault") || null;
          note = fault ? "Fault set: " + fault + ". Watch what the gauges do." : "Fault cleared.";
          render();
        };
      });
    }

    render();
  }

  global.Tu601Sandbox = { mount: mount };
})(window);
