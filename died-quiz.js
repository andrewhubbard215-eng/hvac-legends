/* You Have Died — a shop quiz. A lethal answer shows the death card. */
(function (global) {
  "use strict";

  var CARDS = [
    {
      img: "died/n2.jpg",
      q: "The apprentice has a full nitrogen cylinder under one arm. A hoagie is in one hand. A vape is in the other. You are in front of the valve.",
      safe: "Stop him. Cap on. Both hands. The food waits.",
      die: "Let him walk it past your face while he eats.",
      other: ["Tell him to rest the valve on your shoulder", "Open the valve so the cylinder gets lighter"],
      death: "YOU HAVE DIED AFTER TAKING A NITROGEN TANK DIRECTLY TO THE FACE BECAUSE HE WAS EATING AND VAPING WHILE CARRYING IT.",
    },
    {
      img: "died/crawl.jpg",
      q: "A flare nut rolls into a dark old crawlspace. Dust is on the joists. You cannot see the nut.",
      safe: "Light first. Mask on. Then go get it.",
      die: "Crawl in after the nut. It is only a nut.",
      other: ["Sweep the dust with your bare hand", "Blow the webs out with your mouth"],
      death: "YOU HAVE DIED OF HANTAVIRUS AND ASBESTOS INHALATION IN AN OLD CRAWLSPACE WHILE CHASING A FLARE NUT THAT ROLLED INTO THE DARK.",
    },
    {
      img: "died/o2.jpg",
      q: "The lineset needs a leak test. The oxygen cylinder is closer than the nitrogen.",
      safe: "Dry nitrogen only. Never oxygen.",
      die: "Use pure oxygen. It finds the leak faster.",
      other: ["Shop air is close enough", "Use the refrigerant that is already in it"],
      death: "YOU HAVE DIED OF AN OXYGEN FIRE. OIL AND OXYGEN DO NOT SHARE A TEST.",
    },
    {
      img: "died/ladder.jpg",
      q: "The condenser sits off the side of the ladder. The homeowner does not want the ladder in the flowers.",
      safe: "Climb down. Move the ladder. Then go back up.",
      die: "Reach for the unit. The ladder will hold.",
      other: ["Tie the ladder to the gutter with a charge hose", "Jump from the ladder onto the roof"],
      death: "YOU HAVE DIED BECAUSE YOU REACHED OFF THE LADDER. THE FLOWERS ARE FINE.",
    },
    {
      img: "died/cap.jpg",
      q: "The run capacitor is still in the unit. The disconnect is open. It has not been bled.",
      safe: "Prove zero. Bleed the cap. Then change it.",
      die: "Short the terminals with your screwdriver.",
      other: ["Add a hard start and leave the old cap", "Charge the system so the cap heals"],
      death: "YOU HAVE DIED OF A CHARGED CAPACITOR. THE SCREWDRIVER SENDS ITS REGARDS.",
    },
    {
      img: "died/fan.jpg",
      q: "The condenser top is off. The fan blade is still spinning.",
      safe: "Kill power. Prove the blade is still. Then work.",
      die: "Stick a screwdriver in and slow the blade.",
      other: ["Grab the blade with your hand", "Spray the spinning fan with coil cleaner"],
      death: "YOU HAVE DIED OF A SPINNING CONDENSER FAN.",
    },
    {
      img: "died/cyl.jpg",
      q: "The recovery cylinder is getting heavy. The scale is in the van.",
      safe: "Stop at 80 percent. Leave headspace.",
      die: "Fill it until the relief valve dumps.",
      other: ["Heat the cylinder so more fits", "Use a disposable jug. It is empty."],
      death: "YOU HAVE DIED OF A RUPTURED RECOVERY CYLINDER.",
    },
    {
      img: "died/braze.jpg",
      q: "The joint needs a braze. The gauges still show pressure. The torch is lit.",
      safe: "Recover the charge. Purge with nitrogen. Then braze.",
      die: "Braze it now. The charge will push out.",
      other: ["Heat the line to drive the refrigerant out", "Add dye and keep the torch on the joint"],
      death: "YOU HAVE DIED BECAUSE YOU BRAZED A LINE THAT STILL HAD REFRIGERANT.",
    },
    {
      img: "died/roof.jpg",
      q: "The rooftop unit is behind you. The parapet is low. The edge is on your right.",
      safe: "Stop. Turn around. Stay two steps off the edge.",
      die: "Keep walking the edge while you look at the unit.",
      other: ["Run so the call goes faster", "Sit on the parapet and eat"],
      death: "YOU HAVE DIED BECAUSE YOU WALKED THE ROOF EDGE. THE UNIT IS STILL UP THERE.",
    },
    {
      img: "died/attic.jpg",
      q: "The air handler is across the attic. The only floor is the joists. The ceiling is drywall.",
      safe: "Stay on the joists. Lay a board if you have to cross.",
      die: "Step on the drywall. It looks solid.",
      other: ["Walk on top of the insulation", "Jump to the air handler"],
      death: "YOU HAVE DIED BECAUSE YOU STEPPED OFF THE JOIST. THE LIVING ROOM HAS A NEW SKYLIGHT.",
    },
    {
      img: "died/vapor.jpg",
      q: "A line blew. The basement is filling with refrigerant. The door is behind you.",
      safe: "Get out. Ventilate. Do not hunt the leak in the cloud.",
      die: "Stay in the cloud and look for the leak.",
      other: ["Spray coil cleaner so you can see the vapor", "Open another cylinder so the pressure comes back"],
      death: "YOU HAVE DIED BECAUSE YOU STAYED IN A ROOM FULL OF REFRIGERANT. THE LEAK IS STILL IN THERE.",
    },
    {
      img: "died/co.jpg",
      q: "The furnace cabinet is cracked. It is still firing. The windows are shut. People are in the house.",
      safe: "Shut the gas. Kill power. Get everyone out.",
      die: "Let it run so you can watch the flame.",
      other: ["Tape the crack and start it again", "Turn the fan to ON and go upstairs"],
      death: "YOU HAVE DIED BECAUSE YOU STAYED WITH A CRACKED FURNACE. THE HOUSE HAS HEAT. YOU DO NOT.",
    },
    {
      img: "died/frost.jpg",
      q: "Liquid refrigerant is spraying from the port. Your hand is bare. The high side is up.",
      safe: "Shut the port. Gloves on before you touch it.",
      die: "Put your hand in it and see if it is cold.",
      other: ["Add more gas so the spray gets stronger", "Point the spray at the fan to cool the unit"],
      death: "YOU HAVE DIED OF LIQUID REFRIGERANT ON YOUR HAND. YOUR HAND IS THE NEW SUCTION LINE.",
    },
    {
      img: "died/back.jpg",
      q: "The condenser has to come off the pad. You are the only tech. There is no lift.",
      safe: "Wait for a second person. Lift with your legs.",
      die: "Bend over and pick the condenser up yourself.",
      other: ["Drag it off the pad by the copper", "Kick it upright and hope"],
      death: "YOU HAVE DIED OF LIFTING THE CONDENSER ALONE. YOUR BACK FILED A GRIEVANCE.",
    },
    {
      img: "died/hose.jpg",
      q: "The nitrogen hose is finger-tight. The regulator is about to open. The flare is not wrenched.",
      safe: "Wrench the hose. Then crack the nitrogen.",
      die: "Open the nitrogen. The hose looks close enough.",
      other: ["Use refrigerant instead of nitrogen to find the leak", "Hold the hose on with your hand while it charges"],
      death: "YOU HAVE DIED BECAUSE YOU OPENED NITROGEN ON A LOOSE HOSE. THE HOSE HAD PLANS.",
    },
    {
      img: "died/foot.jpg",
      q: "The condenser is tipping off the pad. You are in sneakers. The boots are by the van.",
      safe: "Get clear. Boots on before anyone lifts it.",
      die: "Catch it in sneakers.",
      other: ["Let it fall and catch it with your foot", "Kick a brick under it while it falls"],
      death: "YOU HAVE DIED TRYING TO CATCH A CONDENSER IN SNEAKERS. THE BOOTS WATCHED FROM THE VAN.",
    },
  ];

  function esc(s) {
    return String(s || "").replace(/[&<>]/g, function (c) {
      return c === "&" ? "&" : c === "<" ? "<" : ">";
    });
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function start(root, opts) {
    if (!root) return { stop: function () {} };
    var i = 0;
    var lived = 0;
    var dead = 0;
    var phase = "ask";
    var onKey = null;

    function offKey() {
      if (onKey) {
        document.removeEventListener("keydown", onKey);
        onKey = null;
      }
    }

    function css() {
      if (document.getElementById("died-quiz-css")) return;
      var st = document.createElement("style");
      st.id = "died-quiz-css";
      st.textContent = [
        "#quiz-root .died{min-height:100%;background:#14081c;color:#f0c36a;font-family:'Courier New',Courier,monospace;padding:12px 12px 28px;box-sizing:border-box}",
        "#quiz-root .died-frame{max-width:520px;margin:0 auto;border:3px solid #6a4a28;border-radius:10px;background:#1a0e22;padding:10px;box-shadow:inset 0 0 0 1px #3a2414}",
        "#quiz-root .died-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:.14em;color:#c9a15a;margin:0 0 8px}",
        "#quiz-root .died-top button{background:transparent;border:0;color:#f0c36a;font:700 14px 'Courier New',monospace;min-height:44px;padding:0 8px;cursor:pointer}",
        "#quiz-root .died img{width:100%;height:auto;display:block;image-rendering:pixelated;border:4px solid #3a2418;background:#000}",
        "#quiz-root .died h2{margin:12px 8px 0;font-size:clamp(15px,4.2vw,20px);line-height:1.45;letter-spacing:.04em;font-weight:700;text-align:center;color:#f0c36a}",
        "#quiz-root .died .died-q{margin:8px;font-size:15px;line-height:1.45;color:#f6e2b0;text-align:center}",
        "#quiz-root .died .died-choices{display:grid;gap:8px;margin-top:12px}",
        "#quiz-root .died .died-choices button{text-align:left;min-height:52px;padding:12px 14px;border-radius:8px;border:2px solid #6a4a28;background:#241430;color:#f6e2b0;font:600 15px/1.35 'IBM Plex Sans',system-ui,sans-serif;cursor:pointer}",
        "#quiz-root .died .died-go{display:block;width:100%;margin-top:14px;min-height:52px;border:2px solid #f0c36a;background:#3a220c;color:#f0c36a;font:700 14px/1 'Courier New',monospace;letter-spacing:.12em;cursor:pointer}",
        "#quiz-root .died .died-hint{margin:10px 0 0;text-align:center;letter-spacing:.16em;font-size:12px;color:#a07840}",
      ].join("");
      document.head.appendChild(st);
    }

    function shell(inner) {
      root.innerHTML =
        '<div class="died"><div class="died-frame">' +
        '<div class="died-top"><button type="button" data-act="hub">Shop floor</button><span>' +
        (i + 1 > CARDS.length ? "END" : i + 1 + " / " + CARDS.length) +
        "</span><span>LIVED " + lived + "</span></div>" +
        inner +
        "</div></div>";
      var hub = root.querySelector("[data-act=hub]");
      if (hub) hub.onclick = function () {
        stop();
        if (opts && opts.onHub) opts.onHub();
      };
    }

    function ask() {
      phase = "ask";
      offKey();
      var card = CARDS[i];
      var choices = shuffle(
        [{ t: card.safe, kind: "safe" }, { t: card.die, kind: "die" }].concat(
          card.other.map(function (t) {
            return { t: t, kind: "miss" };
          })
        )
      );
      shell(
        '<p class="died-q">' + esc(card.q) + "</p>" +
          '<div class="died-choices">' +
          choices
            .map(function (c, n) {
              return '<button type="button" data-n="' + n + '">' + esc(c.t) + "</button>";
            })
            .join("") +
          "</div>"
      );
      root.querySelectorAll("[data-n]").forEach(function (btn) {
        btn.onclick = function () {
          var c = choices[Number(btn.getAttribute("data-n"))];
          if (!c || phase !== "ask") return;
          if (c.kind === "safe") {
            lived++;
            livedCard();
          } else if (c.kind === "die") {
            dead++;
            deathCard();
          } else {
            btn.disabled = true;
            btn.textContent = "Not that. It does not kill you. Look again.";
          }
        };
      });
    }

    function livedCard() {
      phase = "next";
      var card = CARDS[i];
      shell(
        '<img src="' + esc(card.img) + '" alt="" />' +
          "<h2>YOU LIVED.</h2>" +
          '<p class="died-q">' + esc(card.safe) + "</p>" +
          '<button type="button" class="died-go" data-act="next">NEXT</button>' +
          '<p class="died-hint">- PRESS SPACE BAR TO CONTINUE -</p>'
      );
      bindNext();
    }

    function deathCard() {
      phase = "next";
      var card = CARDS[i];
      shell(
        '<img src="' + esc(card.img) + '" alt="" />' +
          "<h2>" + esc(card.death) + "</h2>" +
          '<button type="button" class="died-go" data-act="next">CONTINUE</button>' +
          '<p class="died-hint">- PRESS SPACE BAR TO CONTINUE -</p>'
      );
      bindNext();
    }

    function endCard() {
      phase = "end";
      offKey();
      shell(
        "<h2>THE DAY IS OVER.</h2>" +
          '<p class="died-q">You lived ' + lived + " of " + CARDS.length + ". You died " + dead + ".</p>" +
          '<p class="died-q">A lethal answer ends the trip. The safe answer is the one you can walk away from.</p>' +
          '<button type="button" class="died-go" data-act="again">PLAY AGAIN</button>'
      );
      root.querySelector("[data-act=again]").onclick = function () {
        i = 0;
        lived = 0;
        dead = 0;
        ask();
      };
    }

    function next() {
      if (phase !== "next") return;
      i++;
      if (i >= CARDS.length) endCard();
      else ask();
    }

    function bindNext() {
      var b = root.querySelector("[data-act=next]");
      if (b) b.onclick = next;
      offKey();
      onKey = function (e) {
        if (e.code === "Space" || e.key === "Enter") {
          e.preventDefault();
          next();
        }
      };
      document.addEventListener("keydown", onKey);
    }

    function stop() {
      offKey();
      root.innerHTML = "";
    }

    css();
    ask();
    return { stop: stop };
  }

  global.DiedQuiz = { start: start };
})(window);
