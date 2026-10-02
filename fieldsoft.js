/* Field software — only the features techs actually praise.
   Slider (dew and bubble), a scored charge, and a TXV turn that knows when to stop.
   Training tables. The manifold still wins. Not a Danfoss or measureQuick product. */
(function (global) {
  "use strict";

  var REFS = ["R-410A", "R-22", "R-32", "R-134a", "R-454B"];

  function pt() { return global.PtChart || null; }

  function targetSH(wb, od) {
    var t = ((3 * wb) - 80 - od) / 2;
    return Math.round(t);
  }

  function verdict(m) {
    var sh = m.sh;
    var sc = m.sc;
    var txv = m.meter === "txv";
    var tsc = isFinite(m.tsc) ? m.tsc : 10;
    var target = m.target;
    var lowSc = sc < tsc - 2;
    var highSc = sc > tsc + 4;
    var highSh = sh > target + 4;
    var veryHighSh = sh > target + 15;
    var lowSh = sh < target - 4;
    if (m.ice) {
      return { tone: "bad", title: "Air first", text: "Near-zero superheat with ice is airflow first. Shut it down, thaw, then the filter, the coil, and the blower. Do not add gas." };
    }
    if (highSh && lowSc) {
      return { tone: "bad", title: "Do not turn the valve", text: "High superheat and low subcooling is a short charge. Do not turn the TXV. Find the leak. Do not top off. Recover, repair, evacuate, weigh it back." };
    }
    if (!txv && target < 5) {
      return { tone: "bad", title: "Wrong day to charge a piston", text: "The target is under 5°. The chart is not reliable here. Weigh to the nameplate, or come back closer to design." };
    }
    if (txv && veryHighSh && !lowSc) {
      return {
        tone: "bad",
        title: "Not a stem turn yet",
        text: highSc
          ? "Superheat is high and subcooling is high. That is a restriction, not a quarter turn. A plugged filter-drier flashes cold at the outlet. Bulb at 4 or 8 o'clock, tight and insulated, then the screen. Do not add gas."
          : "Superheat is too far off for a quarter turn. Bulb at 4 or 8 o'clock, tight and insulated. Then the drier and the screen."
      };
    }
    if (txv && highSh && highSc) {
      return { tone: "bad", title: "Restriction", text: "High superheat and high subcooling. The coil is starved while liquid is stacked. Check the filter-drier in the liquid line. A plugged drier flashes cold at the outlet. Do not turn the stem. Do not add gas." };
    }
    if (txv && highSh) {
      return { tone: "warn", title: "Open the valve", text: "Stem out, counterclockwise, a quarter turn. That increases flow and lowers superheat. Wait, then read it again. Subcooling is in the band, so this is the valve, not the charge." };
    }
    if (txv && lowSh && highSc) {
      return { tone: "warn", title: "Too much liquid", text: "Low superheat and high subcooling. Recover a little and weigh it. Do not close the valve to hide an overcharge. Do not add gas." };
    }
    if (txv && highSc) {
      return { tone: "warn", title: "High subcooling", text: "Subcooling is high and superheat has not collapsed. Extra liquid is stacked in the condenser. Wash a matted coil before you pull gas, then read it again. If subcooling is still high, recover a little and weigh it. A dirty coil by itself raises head pressure with subcooling about normal. That is not an overcharge." };
    }
    if (txv && lowSh) {
      return { tone: "warn", title: "Close the valve", text: "Stem in, clockwise, a quarter turn. That cuts flow and raises superheat. Wait, then read it again. Do not add gas." };
    }
    if (!txv && sh > target + 5) {
      return { tone: "bad", title: "Superheat is high for a piston", text: "Add only if you already proved there is no leak, and add by weight to the wet-bulb and outdoor target. A piston has no stem. Do not charge it by subcooling." };
    }
    if (!txv && sh < target - 5) {
      return { tone: "warn", title: "Superheat is low for a piston", text: "The coil is getting more liquid than this weather wants. Recover a little, or fix the airflow if the suction line is sweating back to the compressor. A piston has no stem. Do not add gas." };
    }
    if (txv && lowSc) {
      return { tone: "warn", title: "Subcooling is light", text: "A TXV is charged by subcooling. Superheat is not high, so the valve is still holding. Weigh in until you are near the nameplate target, then read it again. Do not clear the sight glass and walk. Do not turn the stem to fake the charge." };
    }
    if (!txv) {
      return { tone: "ok", title: "Close enough to leave", text: "Superheat is on the wet-bulb and outdoor target. A piston has no stem and is not charged by subcooling. Write the superheat down." };
    }
    return { tone: "ok", title: "Close enough to leave", text: "Both numbers are in the band. Write them down. If it fails tomorrow, you can show what you left." };
  }

  function start(host, hooks) {
    var back = (hooks && hooks.onHub) || function () {};
    var tab = "slider";
    var ref = "R-410A";
    var meter = "txv";
    var left = loadLeft();
    var live = null;

    function loadLeft() {
      try {
        var row = JSON.parse(localStorage.getItem("legends-field-left-v1") || "null");
        if (!row || typeof row.sh !== "string") return null;
        return row;
      } catch (_) { return null; }
    }

    function paint() {
      host.innerHTML =
        '<div class="e608-shell">' +
        '<header class="e608-head"><div class="brand-bar" style="justify-content:flex-start">' +
        '<div class="brand-mark" style="width:28px;height:28px;font-size:13px">APP</div>' +
        '<div class="brand-word"><strong style="font-size:15px">FIELD SOFTWARE</strong>' +
        '<span>Slider, scored charge, TXV turn</span></div></div>' +
        '<button class="btn" id="fs-hub">Shop floor</button></header>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px">' +
        '<button type="button" class="btn' + (tab === "slider" ? " primary" : "") + '" data-fs-tab="slider">Slider</button>' +
        '<button type="button" class="btn' + (tab === "call" ? " primary" : "") + '" data-fs-tab="call">The call</button>' +
        "</div>" +
        (tab === "slider" ? sliderHtml() : callHtml()) +
        "</div>";
      host.querySelector("#fs-hub").onclick = back;
      host.querySelectorAll("[data-fs-tab]").forEach(function (b) {
        b.onclick = function () { tab = b.getAttribute("data-fs-tab"); paint(); };
      });
      bind();
    }

    function refSelect() {
      return '<label style="display:block;margin:0 0 8px">Refrigerant <select id="fs-ref" style="font-size:16px;margin-left:8px">' +
        REFS.map(function (r) { return '<option' + (r === ref ? " selected" : "") + ">" + r + "</option>"; }).join("") +
        "</select></label>";
    }

    function num(id, label, value) {
      return '<label style="display:block;margin:0 0 8px">' + label +
        ' <input id="' + id + '" type="number" step="0.1" value="' + value + '" style="font-size:16px;width:6.5em;margin-left:8px"></label>';
    }

    function sliderHtml() {
      return '<article style="padding:12px 14px;border-radius:12px;background:#10161c;border:1px solid #2a3644">' +
        "<h3 style=\"margin:0 0 8px\">Pressure to temperature</h3>" +
        "<p style=\"margin:0 0 8px;color:#a8b0b8\">The feature techs keep. You type the pressure you measured. The dew point is for superheat. The start of boiling is for subcooling.</p>" +
        refSelect() +
        num("fs-psig", "Pressure, psig", "118") +
        '<p id="fs-sat" style="font-size:22px;line-height:1.35;margin:8px 0"></p>' +
        num("fs-temp", "Or a temperature, °F", "40") +
        '<p id="fs-back" style="margin:0;color:#d7dde3"></p></article>';
    }

    function callHtml() {
      return '<article style="padding:12px 14px;border-radius:12px;background:#10161c;border:1px solid #2a3644">' +
        "<h3 style=\"margin:0 0 8px\">Score the charge</h3>" +
        "<p style=\"margin:0 0 8px;color:#a8b0b8\">Both numbers, why they are what they are, and the next thing to measure. A piston uses wet-bulb and outdoor temperature. A TXV is charged by subcooling.</p>" +
        refSelect() +
        '<label style="display:block;margin:0 0 8px">Metering <select id="fs-meter" style="font-size:16px;margin-left:8px">' +
        '<option value="txv"' + (meter === "txv" ? " selected" : "") + ">TXV or EEV</option>" +
        '<option value="piston"' + (meter === "piston" ? " selected" : "") + ">Piston</option></select></label>" +
        num("fs-sp", "Suction psig", "118") +
        num("fs-st", "Suction line °F", "50") +
        num("fs-lp", "Liquid psig", "320") +
        num("fs-lt", "Liquid line °F", "90") +
        '<div id="fs-piston"' + (meter === "piston" ? "" : " hidden") + ">" +
        num("fs-wb", "Return wet-bulb °F", "67") +
        num("fs-od", "Outdoor dry-bulb °F", "95") +
        "</div>" +
        '<div id="fs-txv"' + (meter === "txv" ? "" : " hidden") + ">" +
        num("fs-tsc", "Target subcooling", "10") +
        num("fs-tsh", "Valve superheat target", "10") +
        "</div>" +
        '<p id="fs-score" style="font-size:20px;line-height:1.35;margin:10px 0 4px"></p>' +
        '<p id="fs-why" style="font-size:16px;line-height:1.45;margin:0 0 10px"></p>' +
        '<button type="button" class="btn primary" id="fs-leave">Leave this reading</button>' +
        '<p id="fs-left" style="color:#a8b0b8;margin:8px 0 0"></p></article>';
    }

    function bind() {
      var sel = host.querySelector("#fs-ref");
      if (sel) sel.onchange = function () { ref = sel.value; paint(); };
      var met = host.querySelector("#fs-meter");
      if (met) met.onchange = function () { meter = met.value; paint(); };
      host.querySelectorAll("input").forEach(function (el) { el.oninput = calculate; });
      var leave = host.querySelector("#fs-leave");
      if (leave) {
        leave.onclick = function () {
          if (!live) return;
          left = live;
          try { localStorage.setItem("legends-field-left-v1", JSON.stringify(left)); } catch (_) {}
          showLeft();
        };
      }
      showLeft();
      calculate();
    }

    function showLeft() {
      var el = host.querySelector("#fs-left");
      if (!el) return;
      el.textContent = left ? "Left on the job: " + left.ref + " · SH " + left.sh + "° · SC " + left.sc + "° · " + left.title : "Nothing left on this phone yet.";
    }

    function calculate() {
      var api = pt();
      if (!api) return;
      if (tab === "slider") calcSlider(api);
      else calcCall(api);
    }

    function calcSlider(api) {
      var p = Number(host.querySelector("#fs-psig").value);
      var t = Number(host.querySelector("#fs-temp").value);
      var sat = host.querySelector("#fs-sat");
      var back = host.querySelector("#fs-back");
      var glide = api.glideOf(ref);
      if (!isFinite(p)) sat.textContent = "Type a pressure.";
      else if (glide) {
        sat.textContent = p + " psig · start of boiling " + api.satTBubble(ref, p).toFixed(1) + "°F · dew " + api.satTDew(ref, p).toFixed(1) + "°F";
      } else {
        sat.textContent = p + " psig · " + api.satT(ref, p).toFixed(1) + "°F. Essentially no glide, so the dew point and the start of boiling are the same temperature.";
      }
      back.textContent = isFinite(t) ? t + "°F is about " + api.satP(ref, t).toFixed(1) + " psig on this table." : "";
    }

    function calcCall(api) {
      var sp = Number(host.querySelector("#fs-sp").value);
      var st = Number(host.querySelector("#fs-st").value);
      var lp = Number(host.querySelector("#fs-lp").value);
      var lt = Number(host.querySelector("#fs-lt").value);
      var score = host.querySelector("#fs-score");
      var why = host.querySelector("#fs-why");
      if (![sp, st, lp, lt].every(isFinite)) {
        score.textContent = "Need all four readings.";
        why.textContent = "";
        return;
      }
      var dew = api.satTDew(ref, sp);
      var bub = api.satTBubble(ref, lp);
      var sh = st - dew;
      var sc = bub - lt;
      var target = 10;
      var targetLine = "";
      if (meter === "piston") {
        var wb = Number(host.querySelector("#fs-wb").value);
        var od = Number(host.querySelector("#fs-od").value);
        target = targetSH(wb, od);
        targetLine = " Piston target superheat " + target + "°. That is the field shortcut from wet-bulb and outdoor temperature, not the OEM bead chart.";
      } else {
        target = Number(host.querySelector("#fs-tsh").value);
        var tsc = Number(host.querySelector("#fs-tsc").value);
        targetLine = " TXV targets: superheat " + target + "°, subcooling " + tsc + "°.";
      }
      var v = verdict({
        sh: sh,
        sc: sc,
        meter: meter,
        target: isFinite(target) ? target : 10,
        tsc: meter === "txv" && isFinite(tsc) ? tsc : 10,
        ice: sh < 2
      });
      var tone = v.tone === "ok" ? "#8fd18f" : v.tone === "warn" ? "#f0d2a0" : "#ff8b7a";
      score.style.color = tone;
      score.textContent = "SH " + sh.toFixed(1) + "°   SC " + sc.toFixed(1) + "°   " + v.title;
      why.textContent = "Dew " + dew.toFixed(1) + "° on the suction pressure. Start of boiling " + bub.toFixed(1) + "° on the liquid pressure." + targetLine + " " + v.text;
      live = { ref: ref, sh: sh.toFixed(1), sc: sc.toFixed(1), title: v.title };
    }

    paint();
  }

  global.FieldSoft = { start: start };
})(window);
