/* TU-210G gas hydronic boiler sandbox.
   Do something → something happens. Own sandbox. Phone-first. */
(function (global) {
  "use strict";

  function mount(host) {
    if (!host) return;
    let water = false;
    let limit = false;
    let zones = { radiator: false, baseboard: false, heater: false };
    let note = "This is a gas boiler. Water moves the heat. Prove water and the high limit before any gas.";

    function canGas() { return water && limit; }

    function render() {
      host.innerHTML =
        '<div class="tu210">' +
        '<p class="tu210-plate"><strong>TU-210G · gas boiler · hydronic heat.</strong><br>Water, not refrigerant. No gauges on the copper. Prove water. Prove the high limit. Then gas.</p>' +
        '<p class="tu210-note">' + note + '</p>' +
        '<button type="button" class="btn" id="tu210-water">' + (water ? "Water proved" : "Prove water") + '</button>' +
        '<button type="button" class="btn" id="tu210-limit">' + (limit ? "High limit closed" : "Prove high limit") + '</button>' +
        '<div class="zones">' +
        '<button type="button" class="btn" data-zone="radiator">Call radiator zone</button>' +
        '<button type="button" class="btn" data-zone="baseboard">Call baseboard zone</button>' +
        '<button type="button" class="btn" data-zone="heater">Call unit heater zone</button>' +
        '</div>' +
        '<p class="status">Circulator: ' + (Object.values(zones).some(Boolean) && canGas() ? "Running" : "Off") + '<br>Gas valve: ' + (canGas() ? "Allowed" : "Locked") + '</p>' +
        '<div class="zone-status">' +
        Object.keys(zones).map(function (z) {
          return '<span>' + z + ': ' + (zones[z] ? "Valve open" : "Closed") + '</span>';
        }).join(" · ") +
        '</div>' +
        '</div>';
      bind();
    }

    function bind() {
      host.querySelector("#tu210-water").onclick = function () {
        water = true;
        note = "Water is in the boiler. Now prove the high limit.";
        render();
      };
      host.querySelector("#tu210-limit").onclick = function () {
        limit = true;
        note = "High limit is closed. Gas is allowed. Call a zone.";
        render();
      };
      host.querySelectorAll("[data-zone]").forEach(function (b) {
        b.onclick = function () {
          var z = b.getAttribute("data-zone");
          if (!canGas()) {
            note = "Prove water and the high limit first. A dry boiler or open limit locks the gas.";
            render();
            return;
          }
          zones[z] = !zones[z];
          note = zones[z] ? z + " valve open. Circulator runs." : z + " valve closed.";
          render();
        };
      });
    }

    render();
  }

  global.Tu210gSandbox = { mount: mount };
})(window);
