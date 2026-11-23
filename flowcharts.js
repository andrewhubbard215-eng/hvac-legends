/* HVAC diagnostic flowcharts. Phone-first decision trees.
   Air first. Then the numbers. Then the part. Prove it, then buy it. */
(function (global) {
  "use strict";

  var TREES = {
    nocol: {
      title: "No cool / weak cool",
      start: "air",
      nodes: {
        air: {
          say: "Call for cool is in. Supply air is not cold. Is air moving across the coil? Filter clear? Blower running?",
          choices: [
            { t: "No. Air is weak or stopped.", next: "fixair", why: "Air before charge. Fix the air. Do not add gas to a low suction that air caused." },
            { t: "Yes. Air is moving. Filter and coil face are clear.", next: "gauges", why: "Air is honest. Now the numbers." }
          ]
        },
        fixair: {
          say: "Air first. Clean the filter. Prove the blower wheel. Clear the coil face. Then come back.",
          choices: [{ t: "Air is fixed. Recheck.", next: "air", why: "Good. Now prove the air again before any hose." }]
        },
        gauges: {
          say: "Hook the gauges. Blue is suction. Red is liquid. What do superheat and subcooling say?",
          choices: [
            { t: "High superheat. Low subcooling.", next: "lowcharge", why: "Starved evaporator. Low liquid in the condenser." },
            { t: "High superheat. High subcooling.", next: "restrict", why: "Liquid is stacked. Coil is starved. Restriction." },
            { t: "Low superheat. High subcooling.", next: "over", why: "Overcharge or overfeed. Liquid is piled up." },
            { t: "Both in range. Air is cold.", next: "done", why: "Numbers agree. Leave the charge alone. Look elsewhere." }
          ]
        },
        lowcharge: { say: "Low charge. Find the leak. Do not top it off.", choices: [{ t: "Next.", next: "done", why: "Oil is a clue. Easy spots first. Then detector. Then soap." }] },
        restrict: { say: "Restriction. Temperature drop across the drier or valve. Do not add gas.", choices: [{ t: "Next.", next: "done", why: "Prove the restriction. Then replace the part." }] },
        over: { say: "Overcharge or overfeed. Nameplate subcooling. Check the bulb or piston.", choices: [{ t: "Next.", next: "done", why: "Recover to the nameplate. Or strap the bulb." }] },
        done: { say: "Tree finished. Prove the part before you buy it. Practice only.", choices: [] }
      }
    },
    shsc: {
      title: "Superheat and subcooling",
      start: "start",
      nodes: {
        start: {
          say: "Air proved. Gauges on. Do the two numbers agree?",
          choices: [
            { t: "High SH + low SC", next: "low", why: "Low charge. Find the leak." },
            { t: "High SH + high SC", next: "rest", why: "Restriction. Do not add gas." },
            { t: "Low SH + high SC", next: "over", why: "Overcharge or overfeed." },
            { t: "Both in range", next: "ok", why: "Leave the charge alone." }
          ]
        },
        low: { say: "High superheat, low subcooling. Undercharge. Find the leak first.", choices: [{ t: "Done.", next: "done", why: "Do not top off a leak." }] },
        rest: { say: "High superheat, high subcooling. Restriction. Find the temperature drop.", choices: [{ t: "Done.", next: "done", why: "Prove it, then buy the part." }] },
        over: { say: "Low superheat, high subcooling. Overcharge or valve overfeeding.", choices: [{ t: "Done.", next: "done", why: "Nameplate is the target." }] },
        ok: { say: "Numbers agree. System is right. Leave it.", choices: [{ t: "Done.", next: "done", why: "Air was the first prove." }] },
        done: { say: "Tree finished. Practice only.", choices: [] }
      }
    },
    ice: {
      title: "Frozen coil",
      start: "start",
      nodes: {
        start: {
          say: "Ice on the evaporator. Stop. Do not add gas to ice.",
          choices: [{ t: "Air first.", next: "air", why: "Gauges lie on ice. Melt it. Prove the air." }]
        },
        air: {
          say: "Filter, blower, return, supply. Is air moving after the ice is gone?",
          choices: [
            { t: "No. Air is still weak.", next: "fix", why: "Air before charge." },
            { t: "Yes. Air is good. Ice is gone.", next: "done", why: "Now you can look at the charge." }
          ]
        },
        fix: { say: "Fix the air. Then recheck.", choices: [{ t: "Fixed.", next: "air", why: "Good." }] },
        done: { say: "Tree finished. Do not add gas to ice.", choices: [] }
      }
    },
    comp: {
      title: "Compressor will not start",
      start: "call",
      nodes: {
        call: {
          say: "Call for cool is in. Contactor in or out?",
          choices: [
            { t: "Contactor is out.", next: "string", why: "Meter the control string. Stat, safeties, coil." },
            { t: "Contactor is in. Compressor quiet or humming.", next: "load", why: "Meter the capacitor, overload, windings." }
          ]
        },
        string: { say: "Control string. Do not jumper a pressure control to make it run.", choices: [{ t: "Done.", next: "done", why: "Prove the open part." }] },
        load: { say: "Load side. Capacitor before the compressor. Overload in series with common.", choices: [{ t: "Done.", next: "done", why: "Prove the part before you buy it." }] },
        done: { say: "Tree finished. Practice only.", choices: [] }
      }
    },
    furnace: {
      title: "Furnace sequence",
      start: "start",
      nodes: {
        start: {
          say: "Call for heat. What runs first?",
          choices: [{ t: "Inducer.", next: "switch", why: "Inducer, then pressure switch, then ignitor, then gas valve." }]
        },
        switch: { say: "Pressure switch proves draft. Do not jump it.", choices: [{ t: "Next.", next: "gas", why: "A limit trip is airflow." }] },
        gas: { say: "Gas valve is last. Do not jump the gas valve.", choices: [{ t: "Done.", next: "done", why: "Sequence holds." }] },
        done: { say: "Tree finished. Practice only.", choices: [] }
      }
    },
    leak: {
      title: "Leak",
      start: "oil",
      nodes: {
        oil: { say: "Oil is a clue. Wind moves it. Check easy spots first: caps, cores, flares, packing.", choices: [{ t: "Next.", next: "detector", why: "Easy spots first." }] },
        detector: { say: "Electronic detector finds the area. Move it slowly. Then soap that joint.", choices: [{ t: "Next.", next: "n2", why: "A bubble that grows is the leak." }] },
        n2: { say: "Dry nitrogen confirms it. Never oxygen. Never shop air. Never above the data plate.", choices: [{ t: "Done.", next: "done", why: "Recover, repair, evacuate, weigh in." }] },
        done: { say: "Tree finished. Practice only. It does not issue a card.", choices: [] }
      }
    }
  };

  function mount(host) {
    if (!host) return;
    var current = null;
    var nodeId = null;

    function renderList() {
      var html = '<header class="hub-head"><h2>Diagnostic flowcharts</h2><button type="button" class="btn" id="fc-back">Shop floor</button></header>' +
        '<p class="eyebrow">Air first. Then the numbers. Then the part.</p>' +
        '<div class="mode-cards">';
      Object.keys(TREES).forEach(function (id) {
        html += '<button type="button" class="mode-card" data-tree="' + id + '"><h3>' + TREES[id].title + '</h3></button>';
      });
      html += '</div>';
      host.innerHTML = html;
      host.querySelector("#fc-back").onclick = function () { if (window.ltGo) window.ltGo("hub"); };
      host.querySelectorAll("[data-tree]").forEach(function (b) {
        b.onclick = function () { open(b.getAttribute("data-tree")); };
      });
    }

    function open(id) {
      current = TREES[id];
      nodeId = current.start;
      renderNode();
    }

    function renderNode() {
      var node = current.nodes[nodeId];
      var html = '<header class="hub-head"><h2>' + current.title + '</h2><button type="button" class="btn" id="fc-list">Trees</button></header>' +
        '<p class="ic-say">' + node.say + '</p>' +
        '<div class="ic-choices">';
      node.choices.forEach(function (c, i) {
        html += '<button type="button" class="btn ic-choice" data-i="' + i + '">' + c.t + '</button>';
      });
      html += '</div><p class="ic-note" id="fc-note"></p>';
      host.innerHTML = html;
      host.querySelector("#fc-list").onclick = renderList;
      host.querySelectorAll("[data-i]").forEach(function (b) {
        b.onclick = function () {
          var c = node.choices[Number(b.getAttribute("data-i"))];
          host.querySelector("#fc-note").textContent = c.why;
          if (c.next) {
            setTimeout(function () { nodeId = c.next; renderNode(); }, 900);
          }
        };
      });
    }

    renderList();
  }

  global.Flowcharts = { mount: mount };
})(window);
