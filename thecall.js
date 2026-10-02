/* Take the Call — say the first move, then the gauges prove it.
   R-410A pocket-chart pressures. Superheat and subcool are read together.
   Airflow before charge. Do not add gas to a leak. Do not jump a float. */
(function (global) {
  var CALLS = [
    {
      id: "air",
      photo: "call/filter.jpg",
      who: "Homeowner",
      complaint: "It runs all day. The vents barely blow. The house sits at 80.",
      ask: "What do you do first?",
      choices: [
        "Pull the filter and feel the blower. Do not touch the jug.",
        "Add refrigerant. Low airflow means it is low on charge.",
        "Change the TXV. A warm house means the valve is stuck."
      ],
      right: 0,
      low: { psi: "105", sat: "34°F", line: "36°F", sh: "2°F", note: "Superheat is almost nothing." },
      high: { psi: "300", sat: "96°F", line: "82°F", sc: "14°F", note: "Subcool is a little high." },
      why: "Heat is not reaching the coil, so the refrigerant is not boiling off. Superheat collapses and the vents tell you why. If you only stare at subcool, you will add gas to a system that is already stacking liquid. Air first."
    },
    {
      id: "charge",
      photo: "call/gauges.jpg",
      who: "Homeowner",
      complaint: "It runs. The house only drops two degrees. The big line never sweats.",
      ask: "What do you do first?",
      choices: [
        "Hook the gauges and clamp both lines. Write superheat and subcool before you add anything.",
        "Add two pounds and leave. A warm house is always a short charge.",
        "Change the blower capacitor. Cooling complaints start at the fan."
      ],
      right: 0,
      low: { psi: "93", sat: "28°F", line: "62°F", sh: "34°F", note: "Superheat is way high." },
      high: { psi: "250", sat: "84°F", line: "80°F", sc: "4°F", note: "Subcool is almost gone." },
      why: "High superheat and low subcool together mean there is not enough liquid in the condenser. That is a short charge. Find the leak. Gassing it and driving off teaches the next tech nothing, and the house is low again next week."
    },
    {
      id: "fan",
      photo: "call/condenser.jpg",
      who: "Homeowner",
      complaint: "On hot days it runs five minutes, clicks, and dies. The fan on top of the outdoor unit is not turning.",
      ask: "What do you do first?",
      choices: [
        "Prove the outdoor fan and the contactor before you condemn the compressor.",
        "Recover the charge and change the compressor. A click means the compressor is done.",
        "Add refrigerant so the head pressure comes down."
      ],
      right: 0,
      low: { psi: "150", sat: "52°F", line: "63°F", sh: "11°F", note: "Superheat can look normal." },
      high: { psi: "470", sat: "128°F", line: "90°F", sc: "38°F", note: "Head is through the roof." },
      why: "The outdoor coil cannot dump heat with the fan stopped. Pressure climbs until the high-pressure switch opens. Superheat will not save you here. The compressor is the victim, not the fault."
    },
    {
      id: "txv",
      photo: "call/txv.jpg",
      who: "Homeowner",
      complaint: "New filter. Clean outdoor coil. Still no cooling. The little line is warm and the big line is barely cool.",
      ask: "What do you do first?",
      choices: [
        "Compare superheat to subcool. If subcool is there and superheat is huge, the valve is not feeding.",
        "It is low. Add gas until the suction line sweats.",
        "The compressor is weak. Change it."
      ],
      right: 0,
      low: { psi: "88", sat: "26°F", line: "72°F", sh: "46°F", note: "Superheat is huge." },
      high: { psi: "340", sat: "104°F", line: "86°F", sc: "18°F", note: "Subcool is still there." },
      why: "A short charge loses subcool. A TXV that will not open keeps the liquid stacked in the condenser and starves the evaporator. Adding gas raises the head and still does not feed the coil. The two numbers have to be read together."
    }
  ];

  var FIT = [
    "#call-root .call-lab{max-width:880px;margin:0 auto;padding:8px 12px 28px;color:#e8eef2}",
    "#call-root .call-top{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}",
    "#call-root .call-top .btn{padding:8px 12px;min-height:44px}",
    "#call-root .call-photo{display:block;width:100%;height:112px;max-height:112px;object-fit:cover;border-radius:12px;margin-top:8px;background:#111}",
    "#call-root .call-lab.is-locked .call-photo{display:none}",
    "#call-root .call-who-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}",
    "#call-root .call-who{margin:0}",
    "#call-root .call-hear{padding:8px 12px;min-height:40px;font-size:13px}",
    "#call-root .call-complaint{font-size:18px;line-height:1.3;margin:4px 0 8px}",
    "#call-root .call-lab h3{margin:0 0 8px;font-size:16px}",
    "#call-root .call-choices{display:grid;gap:8px}",
    "#call-root .call-choice{text-align:left;font-size:15px;line-height:1.3;padding:10px 12px;min-height:44px}",
    "#call-root .call-gauges{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}",
    "#call-root .call-g{padding:8px 10px}",
    "#call-root .call-g strong{font-size:28px;line-height:1}",
    "#call-root .call-g span,#call-root .call-g small{font-size:13px;line-height:1.25}",
    "#call-root .call-delta{display:block;margin-top:4px;color:#f0d878;font-size:16px}",
    "#call-root .call-why{margin:8px 0;font-size:15px;line-height:1.4}",
    "#call-root .call-next{display:block;width:100%;min-height:48px;margin-top:8px}",
    "@media (min-width:900px){",
    "#call-root .call-photo{height:168px;max-height:168px}",
    "#call-root .call-complaint{font-size:22px}",
    "#call-root .call-g strong{font-size:34px}",
    "}"
  ].join("");

  var speakTimer = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  function hush() {
    try {
      if (speakTimer) global.clearTimeout(speakTimer);
      speakTimer = 0;
      if (global.speechSynthesis) global.speechSynthesis.cancel();
    } catch (err) {}
  }

  function speak(text) {
    try {
      if (!global.speechSynthesis || !global.SpeechSynthesisUtterance) return;
      var synth = global.speechSynthesis;
      var line = new global.SpeechSynthesisUtterance(String(text || ""));
      line.lang = "en-US";
      line.rate = 0.96;
      if (synth.speaking || synth.pending) {
        synth.cancel();
        if (speakTimer) global.clearTimeout(speakTimer);
        speakTimer = global.setTimeout(function () {
          try { synth.speak(line); } catch (err) {}
        }, 80);
        return;
      }
      synth.speak(line);
    } catch (err) {}
  }

  function start(root, opts) {
    opts = opts || {};
    var i = 0;
    var firstRight = 0;
    var locked = false;
    var picked = -1;

    function screenEl() {
      return root.closest ? root.closest(".screen") : null;
    }

    function gauge(side, g, kind) {
      var delta = kind === "low" ? "SH " + g.sh : "SC " + g.sc;
      var second = kind === "low"
        ? "Line " + g.line
        : "Line " + g.line;
      return (
        '<div class="call-g ' + side + '">' +
        "<em>" + (side === "low" ? "Low side" : "High side") + "</em>" +
        "<strong>" + esc(g.psi) + "</strong><span>psig · sat " + esc(g.sat) + "</span>" +
        "<span>" + esc(second) + "</span>" +
        '<b class="call-delta">' + esc(delta) + "</b>" +
        "<small>" + esc(g.note) + "</small></div>"
      );
    }

    function sayCall(c, showProof) {
      if (!c) return;
      if (!showProof) {
        speak(c.who + ". " + c.complaint);
        return;
      }
      var hit = picked === c.right;
      speak(
        (hit ? "That's the first move. " : "Not the first move. ") +
        "Low side " + c.low.psi + " psi, superheat " + c.low.sh + ". " +
        "High side " + c.high.psi + " psi, subcool " + c.high.sc + ". " +
        c.why
      );
    }

    function fit() {
      var screen = screenEl();
      if (!screen) return;
      if (!locked) {
        screen.scrollTop = 0;
        var last = root.querySelector(".call-choice:last-child");
        if (!last) return;
        var lr = last.getBoundingClientRect();
        var sr = screen.getBoundingClientRect();
        if (lr.bottom > sr.bottom - 8) screen.scrollTop += lr.bottom - sr.bottom + 16;
        return;
      }
      var proof = root.querySelector(".call-proof");
      if (!proof) return;
      var pr = proof.getBoundingClientRect();
      var sr2 = screen.getBoundingClientRect();
      if (pr.height <= sr2.height - 16) {
        if (pr.bottom > sr2.bottom - 8) screen.scrollTop += pr.bottom - sr2.bottom + 12;
        pr = proof.getBoundingClientRect();
        if (pr.top < sr2.top + 4) screen.scrollTop += pr.top - sr2.top - 4;
        return;
      }
      screen.scrollTop += pr.top - sr2.top;
    }

    function paint() {
      if (i >= CALLS.length) {
        root.innerHTML =
          '<style>' + FIT + "</style>" +
          '<div class="call-lab">' +
          '<div class="call-top"><p class="eyebrow">Take the call</p>' +
          '<button type="button" class="btn" data-act="hub">Shop floor</button></div>' +
          "<h2>You called " + firstRight + " of " + CALLS.length + " on the first try.</h2>" +
          "<p class=\"call-why\">The rule you just used: one pressure lies. Superheat and subcool together tell you whether it is air, charge, a fan, or a valve. Say the first move out loud next time, before the hoses are on. Airflow before charge. Do not add gas to a leak. Do not jump a float.</p>" +
          '<button type="button" class="btn primary call-next" data-act="again">Run the calls again</button></div>';
        speak("You called " + firstRight + " of " + CALLS.length + " on the first try. Airflow before charge. Do not add gas to a leak. Do not jump a float.");
        global.requestAnimationFrame(fit);
        return;
      }
      var c = CALLS[i];
      var choices = c.choices.map(function (text, n) {
        var cls = "call-choice";
        if (locked && n === c.right) cls += " is-right";
        if (locked && n === picked && n !== c.right) cls += " is-wrong";
        return '<button type="button" class="' + cls + '" data-act="pick" data-i="' + n + '"' +
          (locked ? " disabled" : "") + ">" + esc(text) + "</button>";
      }).join("");
      var proof = "";
      if (locked) {
        var hit = picked === c.right;
        proof =
          '<div class="call-proof">' +
          '<div class="call-gauges">' + gauge("low", c.low, "low") + gauge("high", c.high, "high") + "</div>" +
          '<p class="call-why"><b>' + (hit ? "That's the first move." : "Not the first move.") + "</b> " + esc(c.why) + "</p>" +
          '<button type="button" class="btn primary call-next" data-act="next">' +
          (i === CALLS.length - 1 ? "See how you did" : "Next call") + "</button></div>";
      }
      root.innerHTML =
        '<style>' + FIT + "</style>" +
        '<div class="call-lab' + (locked ? " is-locked" : "") + '">' +
        '<div class="call-top"><p class="eyebrow">Call ' + (i + 1) + " of " + CALLS.length + " · R-410A</p>" +
        '<button type="button" class="btn" data-act="hub">Shop floor</button></div>' +
        '<img class="call-photo" src="' + esc(c.photo) + '" alt="" />' +
        '<div class="call-who-row"><p class="call-who">' + esc(c.who) + "</p>" +
        '<button type="button" class="btn call-hear" data-act="hear">Hear it</button></div>' +
        '<p class="call-complaint">“' + esc(c.complaint) + "”</p>" +
        "<h3>" + esc(c.ask) + "</h3>" +
        '<div class="call-choices">' + choices + "</div>" +
        proof + "</div>";
      sayCall(c, locked);
      global.requestAnimationFrame(fit);
    }

    root.onclick = function (e) {
      var t = e.target;
      if (t && t.nodeType !== 1) t = t.parentElement;
      var b = t && t.closest ? t.closest("[data-act]") : null;
      if (!b || !root.contains(b)) return;
      var act = b.getAttribute("data-act");
      if (act === "hub") {
        hush();
        if (opts.onHub) opts.onHub();
        return;
      }
      if (act === "hear") {
        if (CALLS[i]) speak(CALLS[i].who + ". " + CALLS[i].complaint);
        return;
      }
      if (act === "again") {
        i = 0;
        firstRight = 0;
        locked = false;
        picked = -1;
        paint();
        return;
      }
      if (act === "next") {
        if (!locked) return;
        i += 1;
        locked = false;
        picked = -1;
        paint();
        return;
      }
      if (act === "pick" && !locked) {
        picked = Number(b.getAttribute("data-i"));
        if (picked !== picked || picked < 0 || picked >= CALLS[i].choices.length) return;
        locked = true;
        if (picked === CALLS[i].right) {
          firstRight += 1;
          if (opts.onXp) opts.onXp(40);
        } else if (opts.onXp) {
          opts.onXp(10);
        }
        paint();
      }
    };

    paint();
    return {
      stop: function () {
        hush();
        root.onclick = null;
        root.innerHTML = "";
      }
    };
  }

  global.TheCall = { start: start };
})(window);
