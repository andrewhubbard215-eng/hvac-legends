/* Line and 24. Fifteen cards. The picture is a condenser, not a kitchen. */
(function (global) {
  "use strict";
  var KEY = "lt-eleccard-v1";

  var CARDS = [
    {
      n: 1, hot: ["legs"], title: "The push",
      kicker: "Introduction",
      say: "Voltage is the push. On this condenser, L1 to L2 is about 240 volts.",
      more: "One leg to ground is about 120. The compressor does not run on 120, and it does not run on the thermostat's 24.",
      q: "L1 to L2 at the condenser should read about",
      choices: ["24 volts", "120 volts", "240 volts"],
      ok: 2,
      why: "Two hots. About 240 between them. 24 is the control circuit. 120 is one leg to ground."
    },
    {
      n: 2, hot: ["contactor", "stat"], title: "Two circuits",
      kicker: "Circuits and parts",
      say: "This unit has two circuits. Line voltage does the work. 24 volts only asks for it.",
      more: "Breaker, disconnect, contactor, compressor, fan: that is the line. Transformer, thermostat, coil: that is the ask.",
      q: "The thermostat calls for cool. What actually passes 240 to the compressor?",
      choices: ["The thermostat contacts", "The contactor, after the coil pulls in", "The capacitor, by itself"],
      ok: 1,
      why: "The stat only switches 24 volts. The contactor's line contacts pass the 240. A dark stat is not a bad compressor."
    },
    {
      n: 3, hot: ["coil"], title: "Three numbers",
      kicker: "Voltage, current, resistance",
      say: "V = I × R. Name two numbers and the third is not a guess.",
      more: "A healthy 24-volt coil at about 0.5 amp is about 48 ohms. A coil at a few ohms is a short. Read ohms only after the disconnect is off.",
      q: "24 volts on a coil, 0.5 amp. What is the resistance?",
      choices: ["12 ohms", "48 ohms", "480 ohms"],
      ok: 1,
      why: "R = V ÷ I. 24 ÷ 0.5 = 48 ohms. That is a coil. Four ohms on 24 volts is about 6 amps, and that transformer will not live."
    },
    {
      n: 4, hot: ["coil", "contactor"], title: "The marks",
      kicker: "Symbols on the print",
      say: "The print is the map. The fat contacts are the line. The little coil is the 24.",
      more: "Y lands on the coil. It does not land on the compressor terminals. If the print and the wire disagree, believe the print, then meter.",
      q: "On the schematic, the cool call lands on",
      choices: ["The compressor terminals", "The contactor coil", "The breaker handle"],
      ok: 1,
      why: "Y is the coil. The compressor is on the load side of the contacts. Landing Y on a line lug puts 240 where 24 belongs."
    },
    {
      n: 5, hot: ["breaker", "disc"], title: "The meter",
      kicker: "Using the meter",
      say: "Volts while it is live. Ohms only after the disconnect is off and the capacitor is discharged.",
      more: "Dial first, then the screws. Black in COM. Red in the volts jack. The amp jack is a fuse you will blow if you read volts through it.",
      q: "You want ohms on the compressor. First move?",
      choices: ["Dial ohms and stab the terminals while it is running", "Pull the disconnect and discharge the capacitor", "Add refrigerant so the numbers look normal"],
      ok: 1,
      why: "A live ohm reading is a dead meter, or worse. The capacitor can still hold a charge with the disconnect out. Bleed it, then ohm."
    },
    {
      n: 6, hot: ["panel"], title: "Two hots in",
      kicker: "Service entrance",
      say: "The house gets two hots, a neutral, and a ground. A straight-cool condenser uses two hots and the equipment ground.",
      more: "The neutral stays in the panel. There is no 120-volt load in that cabinet. A furnace with a 120 fan is a different box. Read the plate.",
      q: "A straight-cool condenser is fed with",
      choices: ["Two hots and a neutral", "Two hots and an equipment ground", "A neutral only"],
      ok: 1,
      why: "L1, L2, and ground. The neutral is for 120. Do not land a neutral on the condenser and call it a ground."
    },
    {
      n: 7, hot: ["breaker"], title: "The breaker",
      kicker: "The panel",
      say: "The condenser breaker feeds the disconnect. You pull the disconnect. The breaker can still be hot.",
      more: "MOP on the plate is the biggest breaker. A breaker that trips is a fault until you prove it is not. Do not hold the handle on. Do not tape it.",
      q: "The plate says MOP 40. The breaker may be",
      choices: ["Any size in the truck", "40 amps maximum, unless the plate says otherwise", "15 amps, because the wire looks small"],
      ok: 1,
      why: "MOP is the max breaker. Bigger is not safer. MCA is the wire. They are two different numbers on the same plate."
    },
    {
      n: 8, hot: ["fuse"], title: "What opened",
      kicker: "Breakers and fuses",
      say: "A breaker you reset. A fuse you replace. Both opened because something asked for too much current.",
      more: "Pull the disconnect before you ohm a fuse. An open fuse reads open. A bigger fuse is not the repair.",
      q: "The disconnect fuse is open. You",
      choices: ["Replace it with the next size up", "Tape the pullout so it cannot open", "Find why it opened, then put the same size back"],
      ok: 2,
      why: "The fuse did its job. A larger one lets the wire be the fuse. Same amp rating as the plate, after you know the fault."
    },
    {
      n: 9, hot: ["whip"], title: "The wire",
      kicker: "Conductor size",
      say: "MCA is the smallest wire. MOP is the biggest breaker. The plate beats a number you memorized.",
      more: "Length still matters. A long run can need a larger wire than the MCA minimum. If you are not sure, stop and size it. Do not guess at the truck.",
      q: "The plate says MCA 24 and MOP 40. The wire is sized from",
      choices: ["40 amps, same as the breaker", "24 amps, the MCA, then check the length", "The compressor RLA only"],
      ok: 1,
      why: "MCA is minimum circuit ampacity. That is the wire. MOP is the breaker. RLA is what the compressor draws, not the circuit size."
    },
    {
      n: 10, hot: ["whip"], title: "The whip",
      kicker: "Raceway",
      say: "The whip is the raceway. The copper inside it is the conductor. Land the green wire.",
      more: "Liquidtight is not a ground you invent. On a first-year job, the equipment ground is a wire you can see on a screw. Seal the connector. A nick in the whip is a future short.",
      q: "The liquidtight whip is",
      choices: ["The equipment ground by itself", "The raceway the wires run in", "The same thing as the neutral"],
      ok: 1,
      why: "Raceway carries the wires. The green wire is the ground you land. Do not skip it because the metal looks continuous."
    },
    {
      n: 11, hot: ["disc"], title: "Land the lugs",
      kicker: "Line and load",
      say: "High side lands line, then load. Breaker, disconnect, then the contactor. Pull the disconnect and prove the load side dead.",
      more: "The line lugs stay hot back to the breaker. If the blades in your hand are still live, line and load are swapped. Ground on the green screw. No neutral on this condenser.",
      q: "The disconnect is in your hand. Which lugs should be dead?",
      choices: ["The line lugs", "The load lugs", "The ground screw, if you did it right"],
      ok: 1,
      why: "Line stays hot. That is the point of the disconnect. Load goes dead. If load is still hot, the line and load are swapped or the pullout is not the thing you think it is."
    },
    {
      n: 12, hot: ["contactor", "comp"], title: "The loads",
      kicker: "What the contactor feeds",
      say: "The fan can run while the compressor sits. Read the line side, then the coil, then the load side.",
      more: "240 on L1 and L2 only means the disconnect is passing power. If the coil has no 24, the contacts stay open and the compressor never sees it. A new compressor will not invent a call.",
      q: "240 is on the line side. The compressor is silent. Next reading?",
      choices: ["Superheat", "24 volts at the coil", "Add gas and see if it starts"],
      ok: 1,
      why: "Line is already there. The coil has to pull before the load side is a question. Gas does not close a contactor."
    },
    {
      n: 13, hot: ["ground"], title: "The ground",
      kicker: "Grounding and bonding",
      say: "Neutral and ground bond once, at the service. Not in the condenser. Not at the thermostat.",
      more: "The green wire is the fault path. It is not a second neutral. Bond them again at the unit and the cabinet can carry current.",
      q: "Where do neutral and equipment ground bond?",
      choices: ["In the condenser cabinet", "Once, at the service", "On the thermostat subbase"],
      ok: 1,
      why: "One bond, at the service. After that, ground and neutral stay apart. The unit gets an equipment ground, not a bootleg neutral."
    },
    {
      n: 14, hot: ["stat", "coil"], title: "The 24",
      kicker: "The control circuit",
      say: "R to C is the transformer. Y to C is the cool call. No Y, the contactor has no reason to pull.",
      more: "G is the fan. W is heat. Read R to C first. If that is not about 24, you are not at the stat yet. You are at the transformer, the fuse, or the door switch.",
      q: "R to C is 24. Y to C is 0 with the stat set to cool. The open is",
      choices: ["The compressor windings", "The stat, or the wire from Y", "The condenser breaker"],
      ok: 1,
      why: "The transformer is alive. The cool call is not leaving the stat. The breaker is a line-voltage question, and you already have 24."
    },
    {
      n: 15, hot: ["meter", "comp"], title: "Prove the part",
      kicker: "Test, then leave",
      say: "Meter the part you think is bad. Meter the new part under a call before you close the panel.",
      more: "A new contactor still has to pull, and the load side still has to show 240. Capacitor before the compressor. The charge is a different card. Air before gas.",
      q: "You just landed a new contactor. Before you leave you",
      choices: ["Tape the disconnect closed and go", "Meter the coil and the load side under a call", "Add refrigerant so the amps look right"],
      ok: 1,
      why: "The new part gets the same meter the old part got. Coil in, 240 through the contacts, then the compressor is allowed to be the question."
    }
  ];

  function readDone() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      return raw && raw.done ? raw.done : {};
    } catch (e) {
      return {};
    }
  }
  function writeDone(done) {
    try { localStorage.setItem(KEY, JSON.stringify({ done: done })); } catch (e) {}
  }

  function esc(s) {
    return String(s).replace(/&/g, "\u0026amp;").replace(/</g, "\u0026lt;").replace(/>/g, "\u0026gt;");
  }

  function svgPicture() {
    return (
      '<svg class="ec-svg" viewBox="0 0 390 228" role="img" aria-label="High voltage from the breaker through the disconnect">' +
      '<rect x="1" y="1" width="388" height="226" rx="12" fill="#10161c" stroke="#3a424a"/>' +
      '<text x="12" y="18" fill="#c8102e" font-size="12" font-weight="700">HIGH VOLTAGE</text>' +
      '<text x="118" y="18" fill="#9aa3ad" font-size="11">breaker → disconnect → contactor</text>' +
      '<g data-hot="panel" data-card="6">' +
      '<rect x="8" y="28" width="70" height="96" rx="6" fill="#1a1e22" stroke="#8a93a0" stroke-width="2"/>' +
      '<text x="43" y="48" text-anchor="middle" fill="#f4efe6" font-size="11" font-weight="700">MAIN</text>' +
      '<text x="43" y="64" text-anchor="middle" fill="#9aa3ad" font-size="10">service</text></g>' +
      '<g data-hot="legs">' +
      '<path d="M78 58 H96" stroke="#f4efe6" stroke-width="3"/>' +
      '<path d="M78 74 H96" stroke="#c8102e" stroke-width="3"/></g>' +
      '<g data-hot="breaker" data-card="7">' +
      '<rect x="96" y="28" width="86" height="96" rx="6" fill="#1a1e22" stroke="#7fd99a" stroke-width="2"/>' +
      '<text x="139" y="48" text-anchor="middle" fill="#d8ffe8" font-size="11" font-weight="700">BREAKER</text>' +
      '<rect x="112" y="58" width="22" height="36" rx="2" fill="#14301f" stroke="#7fd99a"/>' +
      '<rect x="144" y="58" width="22" height="36" rx="2" fill="#14301f" stroke="#c8102e"/>' +
      '<text x="123" y="80" text-anchor="middle" fill="#f4efe6" font-size="9">L1</text>' +
      '<text x="155" y="80" text-anchor="middle" fill="#ffd0d0" font-size="9">L2</text>' +
      '<text x="139" y="112" text-anchor="middle" fill="#9aa3ad" font-size="10">2-pole</text></g>' +
      '<g data-hot="whip" data-card="10">' +
      '<path d="M182 58 H204" stroke="#f4efe6" stroke-width="3"/>' +
      '<path d="M182 74 H204" stroke="#c8102e" stroke-width="3"/>' +
      '<text x="193" y="50" text-anchor="middle" fill="#e8c450" font-size="9" font-weight="700">WHIP</text></g>' +
      '<g data-hot="disc" data-card="11">' +
      '<rect x="204" y="26" width="78" height="100" rx="6" fill="#1a1e22" stroke="#e8c450" stroke-width="2"/>' +
      '<text x="243" y="44" text-anchor="middle" fill="#f4efe6" font-size="11" font-weight="700">DISC</text>' +
      '<text x="243" y="58" text-anchor="middle" fill="#e8c450" font-size="9">LINE</text></g>' +
      '<g data-hot="fuse" data-card="8">' +
      '<rect x="218" y="64" width="16" height="32" rx="2" fill="#2a2418" stroke="#e8c450"/>' +
      '<rect x="252" y="64" width="16" height="32" rx="2" fill="#2a2418" stroke="#c8102e"/>' +
      '<text x="243" y="112" text-anchor="middle" fill="#e8c450" font-size="9" font-weight="700">FUSES</text>' +
      '<text x="243" y="122" text-anchor="middle" fill="#9aa3ad" font-size="8">LOAD</text></g>' +
      '<g data-hot="legs">' +
      '<path d="M282 58 H300" stroke="#f4efe6" stroke-width="3"/>' +
      '<path d="M282 74 H300" stroke="#c8102e" stroke-width="3"/></g>' +
      '<g data-hot="contactor" data-card="12">' +
      '<rect x="300" y="26" width="82" height="72" rx="6" fill="#1a1e22" stroke="#9ad" stroke-width="2"/>' +
      '<text x="341" y="42" text-anchor="middle" fill="#f4efe6" font-size="10" font-weight="700">L1  L2</text>' +
      '<text x="341" y="88" text-anchor="middle" fill="#9ad" font-size="10">T1  T2</text></g>' +
      '<g data-hot="coil" data-card="14">' +
      '<rect x="322" y="50" width="38" height="16" rx="3" fill="#3a2a12" stroke="#e8c450"/>' +
      '<text x="341" y="62" text-anchor="middle" fill="#e8c450" font-size="9" font-weight="700">COIL</text></g>' +
      '<g data-hot="comp" data-card="15">' +
      '<circle cx="341" cy="118" r="14" fill="#1a1e22" stroke="#f4efe6" stroke-width="2"/>' +
      '<text x="341" y="122" text-anchor="middle" fill="#f4efe6" font-size="8" font-weight="700">COMP</text></g>' +
      '<g data-hot="ground" data-card="13">' +
      '<circle cx="368" cy="118" r="10" fill="none" stroke="#7fd99a" stroke-width="2"/>' +
      '<text x="368" y="122" text-anchor="middle" fill="#7fd99a" font-size="9" font-weight="700">G</text></g>' +
      '<g data-hot="stat" data-card="14">' +
      '<rect x="8" y="164" width="374" height="54" rx="8" fill="#14120c" stroke="#3a424a"/>' +
      '<text x="18" y="186" fill="#e8c450" font-size="12" font-weight="700">24 VOLT</text>' +
      '<text x="92" y="186" fill="#f4efe6" font-size="12">R — STAT — Y — COIL — C</text>' +
      '<text x="18" y="196" fill="#9aa3ad" font-size="12">R to C is the transformer. Not L1 to L2.</text></g>' +
      "</svg>"
    );
  }

  function mountCss() {
    if (document.getElementById("ec-css")) return;
    var st = document.createElement("style");
    st.id = "ec-css";
    st.textContent = [
      "#screen-eleccard.screen.active{overflow:auto;height:100dvh;background:#0c1014}",
      "#eleccard-root{color:#f4efe6;font:500 16px/1.35 'IBM Plex Sans',system-ui,sans-serif}",
      "#eleccard-root .ec{max-width:720px;margin:0 auto;padding:8px 10px 28px;box-sizing:border-box}",
      "#eleccard-root .ec-top{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:40px}",
      "#eleccard-root .ec-top .btn{min-height:36px}",
      "#eleccard-root .ec-count{color:#e8c450;font-weight:800}",
      "#eleccard-root .ec-lead{margin:6px 0 8px;font:700 20px/1.25 'IBM Plex Sans',system-ui,sans-serif;color:#f6f1e4}",
      "#eleccard-root .ec-svg [data-card]{cursor:pointer}",
      "#eleccard-root .ec-svg [data-hot].on rect,#eleccard-root .ec-svg [data-hot].on circle,#eleccard-root .ec-svg [data-hot].on path{stroke:#e8c450;stroke-width:3}",
      "#eleccard-root .ec-svg [data-hot].on text{fill:#e8c450}",
      "#eleccard-root .ec-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}",
      "#eleccard-root .ec-card{min-height:96px;text-align:left;border-radius:12px;border:2px solid #3a424a;background:#10161c;color:#f4efe6;padding:8px 10px;cursor:pointer}",
      "#eleccard-root .ec-card small{display:block;color:#9aa3ad;font-weight:700;font-size:12px}",
      "#eleccard-root .ec-card b{display:block;margin-top:4px;font-size:16px}",
      "#eleccard-root .ec-card em{display:block;margin-top:4px;font-style:normal;color:#c8c0b0;font-size:13px}",
      "#eleccard-root .ec-card.next{border-color:#e8c450;box-shadow:inset 0 0 0 1px #e8c450}",
      "#eleccard-root .ec-card.done{border-color:#246b45}",
      "#eleccard-root .ec-card.done small{color:#7fd99a}",
      "#eleccard-root .ec-lesson{margin-top:8px}",
      "#eleccard-root .ec-more{margin:0 0 8px;color:#d5dde4}",
      "#eleccard-root .ec-formula{margin:0 0 8px;color:#e8c450;font:700 28px/1 'IBM Plex Sans',system-ui,sans-serif}",
      "#eleccard-root .ec-q{margin:0 0 8px;font-weight:700}",
      "#eleccard-root .ec-choices{display:flex;flex-direction:column;gap:8px}",
      "#eleccard-root .ec-choices button{min-height:48px;text-align:left;border-radius:12px;border:2px solid #3a424a;background:#10161c;color:#f4efe6;padding:8px 12px;font:700 16px/1.25 'IBM Plex Sans',system-ui,sans-serif}",
      "#eleccard-root .ec-choices button.bad{border-color:#c8102e}",
      "#eleccard-root .ec-choices button.good{border-color:#7fd99a}",
      "#eleccard-root .ec-why{margin:8px 0;color:#f6f1e4}",
      "#eleccard-root .ec-why.bad{color:#ffb4be}",
      "#eleccard-root .ec-next{margin-top:8px;width:100%;min-height:48px;border:0;border-radius:12px;background:#c8102e;color:#fff;font:700 16px/1 system-ui,sans-serif}",
      "@media (max-width:720px){#eleccard-root .ec-lead{font-size:18px}#eleccard-root .ec-grid{grid-template-columns:1fr 1fr}}"
    ].join("");
    document.head.appendChild(st);
  }

  function ElecCards() {}

  ElecCards.start = function (root, opts) {
    if (!root) return { stop: function () {} };
    mountCss();
    var onHub = opts && opts.onHub;
    var onXp = opts && opts.onXp;
    var done = readDone();
    var open = null;
    var picked = null;
    var awarded = {};

    function count() {
      return CARDS.filter(function (c) { return done[c.n]; }).length;
    }
    function nextN() {
      var i;
      for (i = 0; i < CARDS.length; i++) if (!done[CARDS[i].n]) return CARDS[i].n;
      return 0;
    }
    function cardBy(n) {
      return CARDS.filter(function (c) { return c.n === n; })[0];
    }

    function paint() {
      var n = count();
      var lead = open
        ? cardBy(open).say
        : "High side first. Breaker, then the disconnect, then L1 and L2.";
      var grid = CARDS.map(function (c) {
        var cls = "ec-card" + (done[c.n] ? " done" : "") + (!done[c.n] && c.n === nextN() ? " next" : "");
        return '<button type="button" class="' + cls + '" data-card="' + c.n + '">' +
          "<small>" + (done[c.n] ? "Done · " : "") + c.n + " · " + esc(c.kicker) + "</small>" +
          "<b>" + esc(c.title) + "</b>" +
          "<em>" + esc(c.say) + "</em></button>";
      }).join("");
      var lesson = "";
      if (open) {
        var c = cardBy(open);
        var why = "";
        if (picked != null) {
          var right = picked === c.ok;
          why = '<p class="ec-why' + (right ? "" : " bad") + '">' + esc(right ? c.why : "Not that. " + c.why) + "</p>";
          if (right) why += '<button type="button" class="ec-next" id="ec-next">' + (nextN() ? "Next card" : "Back to the cards") + "</button>";
        }
        lesson =
          '<div class="ec-lesson">' +
          (c.n === 3 ? '<p class="ec-formula">V = I × R</p>' : "") +
          '<p class="ec-more">' + esc(c.more) + "</p>" +
          '<p class="ec-q">' + esc(c.q) + "</p>" +
          '<div class="ec-choices">' +
          c.choices.map(function (ch, i) {
            var mark = picked == null ? "" : i === c.ok && picked === c.ok ? " good" : i === picked ? " bad" : "";
            return '<button type="button" data-choice="' + i + '" class="' + mark + '">' + esc(ch) + "</button>";
          }).join("") +
          "</div>" + why + "</div>";
      }
      root.innerHTML =
        '<div class="ec">' +
        '<div class="ec-top"><button type="button" class="btn" id="ec-floor">' + (open ? "Cards" : "Floor") + "</button>" +
        '<span class="ec-count">' + n + " / 15</span></div>" +
        '<p class="ec-lead" id="ec-lead">' + esc(lead) + "</p>" +
        svgPicture() +
        (open ? lesson : '<div class="ec-grid">' + grid + "</div>") +
        "</div>";
      var svg = root.querySelector(".ec-svg");
      var hots = open ? cardBy(open).hot : (nextN() ? cardBy(nextN()).hot : []);
      if (svg) {
        svg.querySelectorAll("[data-hot]").forEach(function (el) {
          el.classList.toggle("on", hots.indexOf(el.getAttribute("data-hot")) >= 0);
        });
      }
      var floor = root.querySelector("#ec-floor");
      if (floor) floor.onclick = function () {
        if (open) { open = null; picked = null; paint(); return; }
        if (onHub) onHub();
      };
      root.querySelectorAll("[data-card]").forEach(function (b) {
        b.onclick = function () {
          open = +b.getAttribute("data-card");
          picked = null;
          paint();
          var leadEl = root.querySelector("#ec-lead");
          if (leadEl && leadEl.scrollIntoView) leadEl.scrollIntoView({ block: "start" });
        };
      });
      root.querySelectorAll("[data-choice]").forEach(function (b) {
        b.onclick = function () {
          if (picked != null && picked === cardBy(open).ok) return;
          picked = +b.getAttribute("data-choice");
          var c = cardBy(open);
          if (picked === c.ok && !done[c.n]) {
            done[c.n] = 1;
            writeDone(done);
            if (!awarded[c.n] && onXp) onXp(4);
            awarded[c.n] = 1;
            if (count() === 15 && onXp) onXp(20);
          }
          paint();
        };
      });
      var next = root.querySelector("#ec-next");
      if (next) next.onclick = function () {
        var nxt = nextN();
        if (!nxt) { open = null; picked = null; paint(); return; }
        open = nxt;
        picked = null;
        paint();
      };
    }

    paint();
    return { stop: function () { root.innerHTML = ""; } };
  };

  global.ElecCards = ElecCards;
})(window);
