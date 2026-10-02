/* Professor HUB — Deadpool-energy instructor
   Fourth-wall breaks, roasts, HVAC chaos. Voice of the shop. */
(function (global) {
  "use strict";

  const HUB = {
    name: "Professor Andrew Hubbard",
    title: "America's HVAC Instructor · Merc with a Manifold",
    avatar: "🦸",

    // Random one-liners for hub / idle
    hubLines: [
      "Professor Andrew Hubbard in the building. Try not to vent the planet today.",
      "Grok built the sim. I built the standards. You bring the hustle.",
      "Best HVAC classroom in the country — and yes, I said it.",
      "I'm the instructor. You're the plot armor. Let's go.",
      "This isn't Interplay. We have jokes *and* microns.",
      "Clock in. Clock violence on bad superheat.",
      "If HVAC Jesus shows up, act surprised. He likes that. Then recover anyway.",
      "The Gauges of God still need a leak found. Magic manifold, mortal work.",
      "Your callsign is showing. Wear it like a cape.",
      "Sandbox is therapy. Service calls are character development.",
      "I break the fourth wall so you don't break the compressor.",
      "Maximum effort. Minimum venting. I'm basically Deadpool with a recovery machine.",
      "Fourth wall? Shattered. Your 80% tank fill? Not so much. Leave headspace, hero.",
      "I'd do a chimichanga bit, but EPA 608 said no food on the manifold.",
      "You're not the main character yet. Recover, then we'll talk origin story.",
      "Spoiler: the dirty filter was the villain the whole time.",
      "I know I'm an NPC. I still won't let you ohm a live circuit.",
      "Red suit optional. Safety glasses not optional. That's the joke and the law.",
      "If this were a Marvel movie I'd regenerate. Your compressor will not. LOTO.",
      "EPA 608, OSHA 30, and the shop. That's the holy trinity. Everything else is DLC.",
      "Occasional dirty joke: LOTO isn't a kink. Tag it, then eat your sandwich.",
    ],

    // Curriculum unit openers keyed loosely by id
    unitOpen: {
      bench: "The bench. The meter first. The story second.",
      copper: "Flares and torches. Slide the nut on first or I will narrate your failure in slow motion.",
      charge: "Read both numbers. Superheat without subcooling is a guess.",
      controls: "The call has a path. Do not jump a safety to make it go.",
      install: "Commission it. The vacuum is not optional.",
      card: "EPA 608. Venting is illegal. So is my patience for people who still do it.",
      default: "Pick a course. Practice here. Fail here. Succeed on the truck. That's the deal.",
    },

    // After correct / wrong service answers
    serviceOk: [
      "Correct. I'd high-five you but I'm holding imaginary gauges.",
      "Look at you — diagnosing like somebody who reads the book.",
      "Nailed it. Customer keeps their cool. You keep your stars.",
      "Yes. That's the one. Frame it. Or don't. I'm not your mom.",
      "Textbook answer. Gross. Effective. I respect the hustle.",
    ],
    serviceBad: [
      "Nope. That answer just joined a pyramid scheme.",
      "Wrong. The compressor filed a restraining order.",
      "That's a callback with extra steps. Try again next life.",
      "Bold choice. Incorrect. Iconic combination.",
      "You just selected chaos. Chaos selected you back.",
    ],

    // Mini-split step flavor
    install: {
      "mount-idu": "Level the plate or the head sits crooked forever. Like my posture.",
      penetration: "Slope the hole out. Water is not your coworker.",
      "set-odu": "Give the outdoor unit personal space. It's not a subway.",
      flare: "Nut on first. Then cut. Then deburr. Then flare. In that order or I haunt you.",
      torque: "Torque wrench. Not 'good and tight,' Kevin.",
      nitrogen: "Dry nitrogen only. Oxygen is for lungs, not leak tests.",
      vacuum: "Microns or it didn't happen. Compound gauges are cosplay.",
      decay: "If it rises forever, you have a leak. Or feelings. Check the leak first.",
      valves: "Open liquid, then suction. Factory charge does a little dance into the lines.",
      electrical: "Comms wires swapped = no cool + existential crisis.",
      commission: "ΔT, drain, no error codes. Then you get paid. Capitalism, baby.",
    },

    // Pay / end of route
    paid: [
      "Money landed. Don't spend it all on manifold gauges you already own.",
      "Payroll hits different when you didn't explode the unit.",
      "Bank it. Future you needs tools and slightly better decisions.",
    ],

    extraOk: [
      "Correct. I'd kiss the manifold but that's a lawsuit and also unsanitary.",
      "Nailed it. Put your shirt back on, hero — the SH is decent now.",
      "That's the one. Save the victory dance for off the customer's lawn.",
      "Hot take: you're actually good at this. Don't let it go to your... gauges.",
      "Yes. Maximum effort. Minimum pants-on-head. I'm proud in a weird way.",
    ],
    extraBad: [
      "Wrong. That answer needs a cigarette and a better lawyer.",
      "Nope. You just tried to pick up the compressor. It said it's not that drunk.",
      "That's not a diagnosis, that's a booty call with a recovery machine.",
      "Incorrect. Even HVAC Jesus looked away. Recover your dignity.",
      "You selected chaos. Chaos unbuttoned. Try the book.",
    ],
    classroom: [
      "Recover before you open it. That's 608.",
      "Airflow before charge. SH and SC together.",
      "LOTO. Microns, not compound gauges.",
      "Match the nameplate cylinder. Weigh-in.",
      "Dirty coil is not low charge. Clean it first.",
    ],
    extraHub: [
      "Extra spicy is ON. Keep the 608 answers clean. Keep the jokes filthy. That's the brand.",
      "LOTO isn't a safe word. Tag it anyway.",
      "If the TXV's stuck open, that's flooding. If you're stuck open, that's HR.",
      "Recover before you open it. That's 608 and also dating advice.",
      "Subcooling first, then superheat, then whatever you do on Friday. In that order.",
      "I'm Deadpool with a micron gauge. You're the intern. Don't vent.",
    ],

    roastRank(title) {
      const map = {
        Helper: "Helper rank. Adorable. Like training wheels with a death wish.",
        Apprentice: "Apprentice. You're dangerous in a promising way.",
        Journeyman: "Journeyman. People might trust you. Terrifying.",
        "Master Tech": "Master Tech. Bow lightly. Ego stays in the truck.",
        "All-Star": "All-Star. HVAC Jesus is checking his calendar.",
      };
      return map[title] || "Keep grinding. Rank is a state of mind and also XP.";
    },
  };

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function lineForUnit(id) {
    return HUB.unitOpen[id] || HUB.unitOpen.default;
  }

  function banter(kind, ctx) {
    switch (kind) {
      case "hub":
        if (ctx && ctx.level === 0) return pick(HUB.classroom);
        if (ctx && (ctx.extra || ctx.level >= 3)) return pick(HUB.extraHub.concat(HUB.hubLines));
        return pick(HUB.hubLines);
      case "service-ok":
        if (ctx && ctx.level === 0) return "Correct. That's the 608 / SH-SC path.";
        return pick(ctx && (ctx.extra || ctx.level >= 3) ? HUB.extraOk : HUB.serviceOk);
      case "service-bad":
        if (ctx && ctx.level === 0) return "Not that one. Check the fingerprint again.";
        return pick(ctx && (ctx.extra || ctx.level >= 3) ? HUB.extraBad : HUB.serviceBad);
      case "paid":
        return pick(HUB.paid);
      case "unit":
        return lineForUnit(ctx && ctx.unit);
      case "install":
        return (HUB.install && HUB.install[ctx && ctx.step]) || "Do it right. I'm watching. Metaphorically.";
      case "rank":
        return HUB.roastRank(ctx && ctx.title);
      default:
        return pick(HUB.hubLines);
    }
  }

  /** Small floating instructor chip */
  function mountChip(parent, text) {
    if (!parent) return null;
    let chip = parent.querySelector(".hub-chip");
    if (!chip) {
      chip = document.createElement("div");
      chip.className = "hub-chip";
      parent.appendChild(chip);
    }
    chip.innerHTML =
      '<img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" /><div><strong>' +
      HUB.name +
      "</strong><p>" +
      text +
      "</p></div>";
    return chip;
  }

  global.ProfessorHUB = { HUB, banter, mountChip, pick };
})(window);
