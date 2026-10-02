/* Factory apps — free manufacturer software that matches the OEM packs.
   Training notes. Not a dealer login and not a substitute for gauges. */
(function (global) {
  "use strict";

  var APPS = [
    {
      brand: "Danfoss",
      unit: "TR6 and T2 TXV",
      name: "Ref Tools",
      price: "Free download",
      who: "Every tech",
      does: "The old Refrigerant Slider, plus more. Pressure-temperature for well over 80 refrigerants, a troubleshooter, a low-GWP retrofit check, a magnetic solenoid-coil test, and a TXV superheat tuner that tells you which way to turn that Danfoss valve. Coolselector 2 is the free PC program for picking their valves and driers. KoolProg is the free PC program for their ERC and ETC case controls.",
      wont: "The tuner is a recommendation, not a gauge. Read superheat on the manifold before you turn the stem. It does not talk to a Carrier, Trane, or Goodman board, and it is not a license.",
      store: "https://play.google.com/store/apps/details?id=com.danfoss.koolapp"
    },
    {
      brand: "Trane",
      unit: "XR17 and Link XV",
      name: "Trane Technician",
      price: "Free download",
      who: "The tech",
      does: "Install and commission Link systems, Link zoning, and Link relay panels. Guided wiring and dip switches. Literature, videos, refrigerant calculators, and a barcode scan. The homeowner opts in through the Trane Home app if the shop monitors alerts.",
      wont: "It will not make a Bluetooth connection to a ComfortLink II. An XR17 is still a gauges-and-nameplate unit. The app does not weigh the charge and it is not EPA 608.",
      store: "https://play.google.com/store/apps/details?id=com.tranetechnologies.tranediagnostics"
    },
    {
      brand: "American Standard",
      unit: "Same family as Trane",
      name: "American Standard Technician",
      price: "Free download",
      who: "The tech",
      does: "The sister app on the American Standard badge. Same job: commission, look up the unit, read the alert.",
      wont: "A different badge is not a different refrigerant. Silver and gold nameplates still follow the charging chart.",
      store: ""
    },
    {
      brand: "Goodman and Amana",
      unit: "GSX14, GMVC96, ASX16",
      name: "CoolCloud HVAC 2.0",
      price: "Free download",
      who: "The tech",
      does: "Bluetooth to Goodman and Amana premium air-handler and furnace boards. Status, fault history, and configuration. Some replacement boards will not finish setup without it.",
      wont: "It does not talk to a Carrier, Trane, or Rheem board. A phone setting can override the board, so read the tonnage before you walk away.",
      store: "https://play.google.com/store/apps/details?id=com.daikin.coolcloud"
    },
    {
      brand: "Rheem and Ruud",
      unit: "RP17 Prestige",
      name: "Rheem Contractor App",
      price: "Free download",
      who: "The tech",
      does: "Bluetooth commissioning and diagnostics on Rheem and Ruud equipment. EcoNet is the separate free app the homeowner uses on an EcoNet thermostat.",
      wont: "EcoNet on the customer's phone is not your manifold. Confirm subcooling on the gauges.",
      store: ""
    },
    {
      brand: "LG",
      unit: "Multi F",
      name: "LATS HVAC",
      price: "Free, account on LG's site",
      who: "The designer",
      does: "Picks Multi V, Multi F, and single-zone equipment, checks piping rules, and writes the schedule. The LGMV phone app is also a free download. The Wi-Fi module that feeds it is hardware you buy.",
      wont: "A piping report is not a flare you already made. Leak-check the fittings anyway.",
      store: "https://lghvac.com/lg-design-and-service-tools/"
    },
    {
      brand: "York, Coleman, Luxaire",
      unit: "Affinity YXV",
      name: "Hx Thermostat",
      price: "Free download",
      who: "The homeowner",
      does: "Remote control for Hx thermostats on York, Coleman, Luxaire, and Champion. Setpoints, faults, and zoning when the stat supports it.",
      wont: "It is not a service checker for the outdoor unit. Bosch publishes the app. It does not commission an IDS inverter.",
      store: "https://play.google.com/store/apps/details?id=com.jci.RIPL"
    },
    {
      brand: "Fujitsu",
      unit: "Halcyon",
      name: "FGLair or anywAiR",
      price: "Free download",
      who: "The homeowner",
      does: "The Wi-Fi app has to match the dongle. Built-in FGLair hardware uses FGLair. A wall tablet uses anywAiR. A USB adaptor uses myanywAiR Next. They are not interchangeable.",
      wont: "The wrong free app will not find the head. None of them replace a leak check on the flare.",
      store: ""
    },
    {
      brand: "Mitsubishi",
      unit: "MSZ-FS",
      name: "kumo cloud",
      price: "App is free",
      who: "The homeowner",
      does: "Remote control once the kumo adapter is on the indoor unit.",
      wont: "The adapter is not free. The app does not weigh a lineset.",
      store: ""
    },
    {
      brand: "Carrier and Bryant",
      unit: "Comfort, Infinity, Evolution",
      name: "Carrier Home",
      price: "Free download",
      who: "The homeowner",
      does: "The connected stat app for Infinity and Evolution houses. Bryant uses the same idea under its own name.",
      wont: "There is no free public app that replaces the gauges on a Comfort 16. Factory Authorized is a dealer status, not a download.",
      store: ""
    },
    {
      brand: "Daikin",
      unit: "Fit and Aurora",
      name: "No free service checker",
      price: "The phone app is free. The tool is not.",
      who: "The tech",
      does: "Daikin's service-checker app needs the Bluetooth checker dongle. Without that hardware you are on the gauges, the nameplate, and the fault code on the board.",
      wont: "Do not tell a student the Fit commissions from a free app the way a Goodman board does.",
      store: ""
    },
    {
      brand: "Samsung and Bosch",
      unit: "WindFree and IDS 2.0",
      name: "SmartThings, and no IDS checker",
      price: "SmartThings is free",
      who: "The homeowner",
      does: "A WindFree with Wi-Fi can sit on SmartThings. The IDS 2.0 is diagnosed from the fault code, the airflow, and the gauges. Do not condemn the inverter from one amp reading.",
      wont: "Neither app is a license to open the circuit.",
      store: ""
    }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  function start(host, hooks) {
    var back = (hooks && hooks.onHub) || function () {};
    host.innerHTML =
      '<div class="e608-shell">' +
      '<header class="e608-head"><div class="brand-bar" style="justify-content:flex-start">' +
      '<div class="brand-mark" style="width:28px;height:28px;font-size:13px">APP</div>' +
      '<div class="brand-word"><strong style="font-size:15px">FACTORY APPS</strong>' +
      '<span>Free downloads only · the gauges still win</span></div></div>' +
      '<button class="btn" id="factory-hub">Shop floor</button></header>' +
      '<p style="color:#e8edf2;font-size:16px;line-height:1.45;margin:0 0 12px">These are the free apps that match the units in OEM packs. Danfoss Ref Tools is the one every tech can use on any brand. Trane is on the board twice: the XR17, which you still charge with gauges, and the Link XV, which is the communicating unit the Trane Technician app is built for. The Danfoss pack is the TR6 valve on a split.</p>' +
      APPS.map(function (a) {
        var link = a.store
          ? '<p style="margin:8px 0 0"><a href="' + esc(a.store) + '" target="_blank" rel="noopener">Open the official page</a></p>'
          : "";
        return (
          '<article style="margin:0 0 12px;padding:12px 14px;border-radius:12px;background:#10161c;border:1px solid #2a3644">' +
          '<p style="margin:0;color:#CE0034;font-size:12px;letter-spacing:.06em">' + esc(a.brand) + " · " + esc(a.unit) + "</p>" +
          '<h3 style="margin:4px 0">' + esc(a.name) + "</h3>" +
          '<p style="margin:0 0 6px;color:#a8b0b8">' + esc(a.price) + " · " + esc(a.who) + "</p>" +
          "<p style=\"margin:0 0 6px\">" + esc(a.does) + "</p>" +
          '<p style="margin:0;color:#f0d2a0"><strong>It will not: </strong>' + esc(a.wont) + "</p>" +
          link +
          "</article>"
        );
      }).join("") +
      "</div>";
    host.querySelector("#factory-hub").onclick = back;
  }

  global.FactoryApps = { start: start };
})(window);
