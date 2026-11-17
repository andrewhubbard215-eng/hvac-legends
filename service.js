/* Lincoln Tech HVAC Allstars — Service Calls
   Real job scenarios + optional Spicy customer dialogue.
   Designed to feel less clunky than dry quiz trainers. */
(function (global) {
  "use strict";
  function landTurn(screenId) {
    try {
      if (sessionStorage.getItem("land-upright-off")) return;
    } catch (e) {}
    var cssId = "land-css-" + screenId;
    if (!document.getElementById(cssId)) {
      var st = document.createElement("style");
      st.id = cssId;
      st.textContent = ".land-turn{display:none}@media (orientation:landscape) and (max-height:500px){body.land-on:has(#" + screenId + ".active) .land-turn{display:flex;position:fixed;z-index:220;inset:0;align-items:center;justify-content:center;padding:8px;background:rgba(8,10,12,.55);color:#f6f0e2;box-sizing:border-box}body.land-on:has(#" + screenId + ".active) .land-card{display:flex;flex-direction:column;align-items:center;gap:4px;width:min(200px,52vw);padding:8px 10px;background:#1c2126;border:1px solid #e8c450;border-radius:12px;text-align:center}body.land-on:has(#" + screenId + ".active) .land-phone{width:22px;height:36px;border:2px solid #e8c450;border-radius:6px;position:relative}body.land-on:has(#" + screenId + ".active) .land-phone:before{content:\"\";position:absolute;left:50%;bottom:3px;width:10px;height:2px;margin-left:-5px;background:#e8c450;border-radius:2px}body.land-on:has(#" + screenId + ".active) .land-turn strong{font:700 15px/1.2 system-ui,sans-serif;color:#fff}body.land-on:has(#" + screenId + ".active) .land-turn span{font:600 12px/1.3 system-ui,sans-serif;color:#d7d0c4;max-width:180px}body.land-on:has(#" + screenId + ".active) .land-turn button{min-height:32px;margin-top:2px;padding:0 10px;background:transparent;color:#f6f0e2;border:1px solid #6d5b3c;border-radius:8px;cursor:pointer;font:600 13px system-ui,sans-serif}}";
      document.head.appendChild(st);
    }
    document.body.classList.add("land-on");
    if (!document.getElementById("land-turn")) {
      var bar = document.createElement("div");
      bar.className = "land-turn";
      bar.id = "land-turn";
      bar.innerHTML = "<div class=\"land-card\"><div class=\"land-phone\" aria-hidden=\"true\"></div><strong>Turn the phone upright</strong><span>Rotate it. This card goes away on its own.</span><button type=\"button\" id=\"land-dismiss-btn\">Stay sideways</button></div>";
      document.body.appendChild(bar);
      document.getElementById("land-dismiss-btn").addEventListener("click", function () {
        try { sessionStorage.setItem("land-upright-off", "1"); } catch (e2) {}
        document.body.classList.remove("land-on");
        bar.remove();
      });
    }
  }

  const CALLS = [
    {
      name: "Mrs. Delgado",
      avatar: "🏠",
      job: "Goodman GSX14 · row home · AC blowing warm",
      jobId: "leak",
      vitals: "SH 28° · SC 4° · Suction low · Head low",
      quote: {
        pro: "It's been blowing warm since yesterday and the baby's room is a sauna. Can you fix it today?",
        spicy:
          "If this house gets any hotter I'm walking around in nothing but a thermostat. Get me cold air before I melt into the hardwood.",
        extra:
          "It's so hot I could fry an egg on this tstat and I am not wearing enough clothes for your leak search. Fix the charge before I file a noise complaint about my own AC.",
      },
      prompt: "High SH + low SC. Best fix path?",
      choices: [
        { t: "Hunt undercharge / leak → recover, repair, evacuate, charge", ok: true },
        { t: "Add two pounds and leave", ok: false },
        { t: "Condemn compressor, sell a full system", ok: false },
        { t: "Set thermostat to 60° and hope", ok: false },
      ],
      why: {
        ok: "High SH + low SC is the undercharge fingerprint. Find the leak — don't just top off.",
        bad: "You jumped a float or added gas. That's the callback you just bought.",
      },
      reply: {
        pro: { ok: "Thank you — I'll open windows until you're done.", bad: "Another guy said that last summer…" },
        spicy: {
          ok: "Bless you. Pants go back on when the supply air drops.",
          bad: "Top it off and bounce and I will review you like a Yelp demon.",
        },
        extra: {
          ok: "Air's dropping. I might even put pants back on. Might.",
          bad: "You top off a leaker and I will write a review that makes your manifold blush.",
        },
      },
    },
    {
      name: "Ken · Barbershop",
      avatar: "💈",
      job: "Carrier Comfort 16 · storefront · suction line iced",
      jobId: "dirty-idu",
      vitals: "SH ~0° · SC normal · Filter black · Low airflow",
      quote: {
        pro: "The pipe in the closet is a popsicle and the shop smells musty.",
        spicy:
          "Copper's frozen like a gas-station Otter Pop and my barber chair is sweating. Fix it before the fade clients revolt.",
        extra:
          "That suction line is an Otter Pop and my last customer left because the shop smells like a wet gym sock. Don't add gas. Un-ice my life.",
      },
      prompt: "Iced suction + low SH. First move?",
      choices: [
        { t: "Power down, thaw, new filter, check blower & coil, recheck SH", ok: true },
        { t: "Add refrigerant because low pressure = low charge", ok: false },
        { t: "Front-seat liquid line and leave in pump-down", ok: false },
        { t: "Chip ice off with a screwdriver", ok: false },
      ],
      why: {
        ok: "Ice + low SH is usually airflow (or overcharge) — not 'add gas.' Fix air first.",
        bad: "Adding gas to an airflow problem is the callback you just bought.",
      },
      reply: {
        pro: { ok: "Shop stays open. Appreciate it.", bad: "We already had three no-shows…" },
        spicy: {
          ok: "MVP. Free fade if you want that helmet hair sorted.",
          bad: "My clippers got more airflow than this coil, man.",
        },
        extra: {
          ok: "You're a hero. Fade's on me. Keep the helmet hair jokes to yourself.",
          bad: "You added gas to an ice sculpture. Bold. Stupid. Kind of hot in the worst way.",
        },
      },
    },
    {
      name: "Priya · Office manager",
      avatar: "🏢",
      job: "LG Multi F · small office · one zone dead",
      jobId: "drier",
      vitals: "That zone SH 35° · SC 14° · Liquid cold at evaporator",
      quote: {
        pro: "Conference room is unbearable. Client pitch in two hours.",
        spicy:
          "If my boss melts in there I will rate you one star and a crayon drawing of a sad compressor.",
        extra:
          "If that conference room stays a sauna I will describe your TXV skills in the company Slack with GIFs. Fix the starved zone. I have a pitch and a migraine.",
      },
      prompt: "High SH, healthy SC on one zone — best theory?",
      choices: [
        { t: "Liquid-line restriction or stuck/closed TXV on that zone", ok: true },
        { t: "Whole-system undercharge", ok: false },
        { t: "Bad condenser fan only", ok: false },
        { t: "Thermostat batteries", ok: false },
      ],
      why: {
        ok: "Good SC means liquid is there; high SH means the evaporator is starved → restriction/TXV.",
        bad: "Calling it a whole-system undercharge is the callback you just bought.",
      },
      reply: {
        pro: { ok: "Pitch is saved. Invoice accounting.", bad: "They're already in the lobby…" },
        spicy: {
          ok: "Bagels and residual panic sweat await you at the debrief.",
          bad: "I can hear the PowerPoint of doom from here.",
        },
        extra: {
          ok: "Pitch saved. There's leftover bagels and shame in the break room.",
          bad: "They're in the lobby. I am one wrong TXV away from becoming a LinkedIn story.",
        },
      },
    },
    {
      name: "Uncle Ray",
      avatar: "🏡",
      job: "Trane XR17 · ranch · condenser in the junipers",
      jobId: "dirty-odu",
      vitals: "High head · SC about normal · High amps · Coil matted",
      quote: {
        pro: "It runs all day and never catches up. Bushes grew into the box.",
        spicy:
          "That condenser lost a fight with a hedge and my electric bill is dating a loan shark.",
        extra:
          "The bushes ate my condenser and the power company is texting me like an ex. Wash the coil. Don't steal my charge. Ray didn't survive '78 to get robbed by junipers.",
      },
      prompt: "High head + dirty outdoor coil. Best action?",
      choices: [
        { t: "Shut down, clean condenser, fix clearances, recheck pressures", ok: true },
        { t: "Recover half the charge to lower head", ok: false },
        { t: "Install a bigger breaker", ok: false },
        { t: "Hose it while running and leave", ok: false },
      ],
      why: {
        ok: "Dirty condenser can't reject heat. Clean it — don't remove charge to 'fix' head pressure.",
        bad: "Pulling charge to hide a dirty coil is the callback you just bought.",
      },
      reply: {
        pro: { ok: "Cooler already. I'll trim the bushes.", bad: "Bill still looks scary…" },
        spicy: {
          ok: "You and a coil brush just saved my marriage to the power company.",
          bad: "Touch that charge without cleaning and Ray will haunt your manifold.",
        },
        extra: {
          ok: "Coil's naked again. Electric bill can sleep in the guest room.",
          bad: "You pulled charge instead of weeds. Ray's ghost just grabbed a manifold.",
        },
      },
    },
    {
      name: "DIY Dave",
      avatar: "🔧",
      job: "Rheem RP17 · garage · system already opened",
      jobId: "leak",
      vitals: "Open to atmosphere · oil smell · no recovery gear",
      quote: {
        pro: "I took the valve apart to see if it was clogged. Can you just recharge it?",
        spicy:
          "I YouTubed it. Refrigerant went psshh into the sky. You got a can of 410 I can borrow?",
        extra:
          "I vented it like a soda can and now I want you to make it rain 410A. Extra spicy news, Dave: that's a federal vibe and also dumb.",
      },
      prompt: "Opened without recovery. Correct path?",
      choices: [
        { t: "Explain EPA 608, recover if possible, repair, evacuate, charge by weight", ok: true },
        { t: "Hand him a can and a hose", ok: false },
        { t: "Ignore it — small amount doesn't count", ok: false },
        { t: "Light a match to check for gas", ok: false, die: "YOU LIT A MATCH ON AN OPEN SYSTEM", joke: "You found the gas. The gas found you." },
      ],
      why: {
        ok: "Venting is illegal. Educate, recover if you can, evacuate, charge right.",
        bad: "Handing him a can is the callback you just bought — and your 608.",
      },
      reply: {
        pro: { ok: "Okay… show me the right way once.", bad: "My cousin always tops it off…" },
        spicy: {
          ok: "Teach me like I'm five and slightly radioactive.",
          bad: "The atmosphere says thanks for nothing, Dave.",
        },
        extra: {
          ok: "Okay I'll recover like a grown-up. Don't tell OSHA I had feelings.",
          bad: "You handed Dave a can. The atmosphere and your cert just unswiped you.",
        },
      },
    },
    {
      name: "Jess & Marcus",
      avatar: "🌙",
      job: "Daikin Fit · apartment · long lineset, low subcooling",
      jobId: "leak",
      vitals: "SH 22° · SC 2° · Long lineset · Bubble in glass",
      quote: {
        pro: "It worked two days then quit. We're on her mom's couch. Please.",
        spicy:
          "One more tech says 'give it time' and you're getting a one-star review in all caps.",
        extra:
          "We're on her mom's couch and the lineset is long. It ran two days and died. Don't dump a jug in it.",
      },
      prompt: "Ran two days, then low SC and a bubble. Likely issue?",
      choices: [
        { t: "Find the leak, then recover, repair, evacuate, and weigh in nameplate plus the lineset chart", ok: true },
        { t: "Replace the compressor tonight", ok: false },
        { t: "Blame outdoor humidity", ok: false },
        { t: "Close liquid valve halfway to raise pressure", ok: false },
      ],
      why: {
        ok: "It ran, then quit. High SH and low SC is a short charge. A long lineset still gets weighed in — after the leak is fixed. Do not top it off.",
        bad: "Guessing the charge is the callback you just bought.",
      },
      reply: {
        pro: { ok: "Mom's couch is hereby retired. Thank you.", bad: "We'll be up all night…" },
        spicy: {
          ok: "You saved a relationship and a very loud floor fan.",
          bad: "Her mom's couch has springs with names. Don't make us go back.",
        },
        extra: {
          ok: "Mom's couch is retired. The floor fan can finally shut up. Thank you.",
          bad: "Guess without the chart again and you're sleeping on that couch with us.",
        },
      },
    },
    {
      name: "Ms. Cho",
      avatar: "🏠",
      job: "Mitsubishi MSZ-FS · wall head · oil at the flare",
      jobId: "leak",
      vitals: "SH 26° · SC 3° · Suction low · Oil at the outdoor flare",
      quote: {
        pro: "The bedroom head is warm and I can see oil on the fitting outside.",
        spicy: "Oil is weeping on that flare and the bedroom is a sauna. Do not top this thing off.",
        extra: "That flare is wet with oil. Add gas and I will show the photo to the next tech.",
      },
      prompt: "Mini-split, high SH, low SC, oil at the flare. First move?",
      choices: [
        { t: "Recover, fix the flare, nitrogen, vacuum, weigh the charge", ok: true },
        { t: "Add a pound through the suction port and leave", ok: false },
        { t: "Replace the indoor head", ok: false },
        { t: "Crank the EEV with a screwdriver", ok: false },
      ],
      why: {
        ok: "Oil at a flare plus the undercharge fingerprint is a leak. Repair it. Do not top off.",
        bad: "Adding gas to a leaking flare is the callback you just bought.",
      },
      reply: {
        pro: { ok: "Bedroom is dropping. Thank you.", bad: "It was warm again by morning." },
        spicy: { ok: "Flare's dry. So is my attitude.", bad: "You fed a leak. I have the photo." },
        extra: { ok: "Dry flare. Cold room. We're good.", bad: "That pound is already gone. So is my patience." },
      },
    },
    {
      name: "Andre",
      avatar: "🏡",
      job: "Bosch IDS 2.0 · heat pump · aux heat only",
      jobId: "dirty-idu",
      vitals: "Inverter outdoor quiet · Furnace running · Filter packed · Outdoor 40°F",
      quote: {
        pro: "The heat pump never seems to run. The furnace does all the work and the bill jumped.",
        spicy: "This inverter is loafing and the gas furnace is paying for it. Don't sell me a board.",
        extra: "Forty degrees outside and the furnace is the only thing working. Check the air before you condemn that compressor.",
      },
      prompt: "Inverter heat pump locked to aux heat. First check?",
      choices: [
        { t: "Filter, coil, and static. Then the outdoor fault code. Amps follow the load.", ok: true },
        { t: "Condemn the inverter because amps look low", ok: false },
        { t: "Add refrigerant until the furnace stops", ok: false },
        { t: "Jump the outdoor board so it runs full", ok: false },
      ],
      why: {
        ok: "An IDS unit will not run a dirty coil at full tilt. Read the fault and the air before you buy a compressor.",
        bad: "Low amps on an inverter at mild weather is not a dead compressor.",
      },
      reply: {
        pro: { ok: "Furnace finally shut off. Bill might survive.", bad: "You priced a compressor I didn't need." },
        spicy: { ok: "Filter was the villain. The board stays.", bad: "You jumped a board. The furnace is still mad." },
        extra: { ok: "Air first. That was the call.", bad: "Low amps was the inverter doing its job. You sold a ghost." },
      },
    },
    {
      name: "Mrs. Alvarez",
      avatar: "🏠",
      job: "Amana ASX16 · compressor hums, then clicks off",
      jobId: "bad-cap",
      vitals: "Contactor pulled in · Compressor hums · Trips in a few seconds · Cap under rated µF",
      quote: {
        pro: "It clicks on, hums, then clicks off. The house never cools.",
        spicy: "That outdoor unit hums like a bad karaoke night and then quits. Meter the cap.",
        extra: "Do not condemn that compressor until the capacitor is on the meter.",
      },
      prompt: "Scroll hums and drops out. Capacitor reads low. Next move?",
      choices: [
        { t: "Replace the run capacitor with the rated µF, then recheck amp draw", ok: true },
        { t: "Replace the compressor tonight", ok: false },
        { t: "Add gas because it will not stay running", ok: false },
        { t: "Up-size the breaker", ok: false },
      ],
      why: {
        ok: "A weak run cap will make a good compressor hum and trip. Match the µF. Then read the amps.",
        bad: "A new compressor on a bad capacitor is the callback you just bought.",
      },
      reply: {
        pro: { ok: "It stayed running. Thank you.", bad: "It hummed and died again." },
        spicy: { ok: "Cap was tired. Compressor was not.", bad: "You sold a compressor to a bad capacitor." },
        extra: { ok: "Right microfarads. House is dropping.", bad: "Breaker is not the capacitor. It's humming again." },
      },
    },
    {
      name: "Kenji",
      avatar: "❄️",
      job: "Fujitsu Halcyon · no heat below freezing",
      jobId: "no-defrost",
      vitals: "Outdoor 18°F · Coil iced uneven · Outdoor fan runs · Filter clean",
      quote: {
        pro: "It heated fine in October. Below freezing it ices up and blows cool.",
        spicy: "This cold-climate head is acting like a window unit. Don't tell me to buy a furnace yet.",
        extra: "Uneven ice and no heat. Check defrost and the coil before you condemn the compressor.",
      },
      prompt: "Cold-climate mini-split, uneven outdoor ice, no heat. First move?",
      choices: [
        { t: "Confirm defrost, coil clearance, and the filter. Then the fault code.", ok: true },
        { t: "Add refrigerant because cold weather means low charge", ok: false },
        { t: "Chip the ice and leave it running", ok: false },
        { t: "Replace the outdoor unit today", ok: false },
      ],
      why: {
        ok: "A Halcyon that ices unevenly is airflow or defrost until the numbers say otherwise. Don't add gas for the weather.",
        bad: "Charging by the weather, or breaking ice off a live coil, is the callback.",
      },
      reply: {
        pro: { ok: "It went into heat after the coil was clear.", bad: "Still cool air." },
        spicy: { ok: "Defrost did its job. So did you.", bad: "You added gas to a frozen coil." },
        extra: { ok: "Heat's back. Leave the screwdriver off the coil.", bad: "Chipped ice is not a repair." },
      },
    },
    {
      name: "Mr. Pell",
      avatar: "🔩",
      job: "Danfoss TR6 · high superheat · coil is warm at the end",
      jobId: "drier",
      vitals: "SH 22° · SC 11° · Suction a little low · Bulb at 4 o'clock on a clean suction line",
      quote: {
        pro: "The house never quite cools. The guy before me said the valve was bad and priced a coil.",
        spicy: "Don't sell me a coil until somebody turns that TR6 the right way.",
        extra: "Twenty-two degrees of superheat and a healthy subcool. That is a valve adjustment, not a new system.",
      },
      prompt: "Danfoss TR6, high superheat, subcooling looks normal. First move?",
      choices: [
        { t: "Confirm the bulb, then open the TR6 a little and recheck superheat", ok: true },
        { t: "Add refrigerant until the suction line sweats", ok: false },
        { t: "Replace the compressor", ok: false },
        { t: "Crank the stem shut to raise head pressure", ok: false },
      ],
      why: {
        ok: "Normal subcooling means you are not low on charge. A TR6 that is too far closed starves the coil. Ref Tools can suggest the turn. The manifold says if it worked.",
        bad: "Adding gas to a starved TXV is the callback you just bought.",
      },
      reply: {
        pro: { ok: "Supply air dropped. Leave the coil.", bad: "Still warm at the register." },
        spicy: { ok: "One turn. Not a new system.", bad: "You fed it gas. Superheat is still high." },
        extra: { ok: "Bulb was right. Stem needed to come out.", bad: "Shutting the valve made it worse." },
      },
    },
  ];

  let root = null;
  let callI = 0;
  let callRight = 0;
  let locked = false;
  let stars = 5;
  let spicy = false;
  let extraSpicy = false;
  let hooks = {};
  let deck = [];
  let hooked = false;
  let minimized = false;

  function heat() {
    return extraSpicy ? 2 : spicy ? 1 : 0;
  }
  function quoteOf(c) {
    var full = "";
    if (heat() >= 2 && c.quote.extra) full = c.quote.extra;
    else if (heat() >= 1 && c.quote.spicy) full = c.quote.spicy;
    else full = c.quote.pro;
    var parts = String(full || "").split(/(?<=[.?!])\s+/).filter(Boolean);
    if (!parts.length) return full;
    for (var i = 0; i < parts.length; i++) {
      if (/don't|do not|never|\bnot\b|kill|stop|shut|nitrogen|glasses|goggles|glove/i.test(parts[i])) return parts[i];
    }
    return parts[0];
  }
  function replyOf(c, ok) {
    const k = ok ? "ok" : "bad";
    if (heat() >= 2 && c.reply.extra) return c.reply.extra[k];
    if (heat() >= 1 && c.reply.spicy) return c.reply.spicy[k];
    return c.reply.pro[k];
  }

  function safeFix(fix) {
    const text = String(fix || "").trim();
    const lower = text.toLowerCase();
    const tellsYouNotTo = /don't|do not|never/.test(lower);
    const dangerous = /^(jump|add gas|add refrigerant|top off|vent|bypass)/i.test(text) ||
      (!tellsYouNotTo && /\b(jump the float|add gas|top off|vent the)\b/i.test(lower));
    if (!text || dangerous) {
      return "Meter it. Recover if the circuit is open. Do not add gas to a leak. Do not jump a float.";
    }
    return text;
  }

  function synthetic(job) {
    const fix = safeFix(job && job.fix);
    return {
      name: "Dispatch",
      avatar: "📻",
      job: job.name,
      jobId: job.id,
      vitals: "Hook the gauges. Don't guess from the truck.",
      quote: {
        pro: job.complaint,
        spicy: job.complaint + " And don't top it off.",
        extra: job.complaint + " Read SH and SC or I'm leaving a review.",
      },
      prompt: "Live system is on the board. What's the safe next move?",
      choices: [
        { t: fix, ok: true },
        { t: "Add gas to the leak and leave", ok: false },
        { t: "Jump the float switch so it runs tonight", ok: false },
        { t: "Skip the meter and condemn the compressor", ok: false },
      ],
      why: {
        ok: fix,
        bad: "That's the callback you just bought. Don't add gas to a leak, and don't jump a float.",
      },
      reply: {
        pro: { ok: "House is behaving. Thanks.", bad: "Still broken…" },
        spicy: { ok: "Finally. Cold air.", bad: "Wrong. Look at the needles." },
        extra: { ok: "Cold air. You can stay for coffee.", bad: "That's not the fingerprint. Try again." },
      },
    };
  }

  const DIFF_POOLS = {
    easy: ["leak", "dirty-odu", "dirty-idu", "overcharge"],
    medium: ["leak", "dirty-odu", "dirty-idu", "overcharge", "drier", "od-fan", "air", "txv-bulb"],
    spicy: ["drier", "txv-bulb", "txv-flood", "air", "rv-stuck", "rv-bleed", "no-defrost", "stuck-defrost", "od-fan", "weak-pump", "bad-cap"],
  };

  function currentDiff() {
    const d = global.LtDiff;
    return d === "easy" || d === "spicy" ? d : "medium";
  }

  function jobsPool() {
    const all = (global.HVACSandbox && global.HVACSandbox.FIELD_JOBS) || [];
    const ids = DIFF_POOLS[currentDiff()] || DIFF_POOLS.medium;
    const pool = all.filter(function (j) {
      return ids.indexOf(j.id) >= 0;
    });
    return pool.length ? pool : all;
  }

  function forJob(job) {
    if (!job) return CALLS[0];
    return CALLS.find(function (c) { return c.jobId === job.id; }) || synthetic(job);
  }

  function randomCall(exceptJobId) {
    const jobs = jobsPool();
    if (jobs.length) {
      const pool = jobs.filter(function (j) { return j.id !== exceptJobId; });
      const job = (pool.length ? pool : jobs)[Math.floor(Math.random() * (pool.length ? pool.length : jobs.length))];
      return forJob(job);
    }
    const pool = CALLS.filter(function (c) { return c.jobId !== exceptJobId; });
    return (pool.length ? pool : CALLS)[Math.floor(Math.random() * (pool.length ? pool.length : CALLS.length))];
  }

  function current() {
    return deck[callI] || null;
  }

  function adopt(call) {
    if (!call) return current();
    if (!deck.length) deck = [call];
    else deck[callI] = call;
    locked = false;
    render();
    return call;
  }

  function grade(ok) {
    if (ok) {
      callRight++;
      if (global.CurriculumTrain) global.CurriculumTrain.stamp("service");
    }
    else stars = Math.max(1, stars - 1);
    if (root) {
      const r = root.querySelector("#svc-rating");
      if (r) r.textContent = starsStr(stars);
      const s = root.querySelector("#svc-score");
      if (s) s.textContent = "Closed " + callRight + " · streak live on the system";
    }
    return { right: callRight, stars: stars };
  }

  function starsStr(n) {
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function mixChoices(choices) {
    return shuffle(choices);
  }

  function choiceOrder(c) {
    if (!c._mixed) c._mixed = mixChoices(c.choices || []);
    return c._mixed;
  }

  var UNIT_OF = {
    leak: "leak",
    "dirty-idu": "dirty-idu",
    "dirty-odu": "dirty-odu",
    overcharge: "overcharge",
    drier: "drier",
    "txv-bulb": "txv-bulb",
    "txv-flood": "txv-flood",
    air: "air",
    "bad-cap": "bad-cap",
    "rv-stuck": "rv-stuck",
    "rv-bleed": "rv-bleed",
    "no-defrost": "no-defrost",
    "stuck-defrost": "stuck-defrost",
    "od-fan": "od-fan",
    "weak-pump": "weak-pump",
    "tony-walkin": "leak",
    "luis-torch": "leak",
    "ruiz-fan": "od-fan",
    "boone-cap": "bad-cap",
    "nadine-o2": "air",
    "ppe-eyes": "leak",
    "ppe-chem": "dirty-odu",
    "ppe-burn": "overcharge",
    "bypass-disc": "dirty-odu",
    float: "dirty-idu",
    "june-co": "no-defrost",
    "inj-ladder": "dirty-odu",
    "inj-roof": "dirty-odu",
    "inj-cap": "bad-cap",
    "inj-phos": "leak",
    "inj-o2": "air",
    "inj-co": "no-defrost",
    "inj-attic": "dirty-idu",
    "inj-fan": "od-fan",
    "inj-frost": "leak",
    "inj-back": "dirty-odu",
    "inj-hose": "air",
    "inj-foot": "dirty-odu",
    "inj-heat": "dirty-odu",
    "inj-scald": "overcharge",
    "inj-ears": "od-fan",
  };

  var WALKS = {
    leak: [
      "Open the unit. Start the compressor and read both gauges before you pick a hose.",
      "High superheat and low subcool means the coil is starved. Do not add gas.",
      "Find the leak with soap or a sniffer. Recover what is left.",
      "Repair it, pressure-test with nitrogen, pull a vacuum, then weigh the nameplate charge.",
    ],
    "dirty-idu": [
      "Start it. Low superheat and ice on the suction line is airflow until the numbers say otherwise.",
      "Kill power. Pull the filter. Look at the blower and the indoor coil.",
      "Thaw the coil. Do not chip ice off a live wheel.",
      "New filter, clear the coil, then recheck superheat before anyone mentions refrigerant.",
    ],
    "dirty-odu": [
      "Start it. High head with a furry outdoor coil is heat that cannot leave.",
      "Shut it down. Wash the condenser and cut the bushes back.",
      "Do not recover charge to hide a dirty coil.",
      "Start it again and read head pressure after the coil can breathe.",
    ],
    overcharge: [
      "Start it. High head and high subcool after somebody 'added a little' is too much refrigerant.",
      "Recover down to the nameplate weight. Do not keep adding.",
      "Run it and recheck subcool after it settles.",
    ],
    drier: [
      "Start it. High superheat and a cold drier outlet is a restriction, not a low charge.",
      "The sight glass can flash on a restriction even when the charge is right.",
      "Recover, replace the filter-drier, evacuate, and weigh the charge back in.",
    ],
    "txv-bulb": [
      "Start it. A starved coil with normal subcool points at the valve, not the jug.",
      "Check the bulb. It belongs on the suction line, at 4 or 8 o'clock, insulated.",
      "If the bulb is right and superheat stays high, the TXV is the part.",
    ],
    "txv-flood": [
      "Start it. Superheat near zero and a cold suction line is a valve that will not shut.",
      "Do not add a hard-start and leave. The compressor is taking liquid.",
      "Replace the TXV, evacuate, weigh the charge, then recheck superheat.",
    ],
    "rv-stuck": [
      "It is hot outside and the unit is still heating. Read the reversing valve before the compressor.",
      "Check for 24 volts at the solenoid. A click means the coil tried.",
      "If the coil is powered and the slider did not move, the valve is the part. Do not condemn the compressor first.",
    ],
    "rv-bleed": [
      "It runs in both modes and still has no capacity. Suction and discharge are too close.",
      "Put a thermometer on the three reversing-valve tubes.",
      "If it is bypassing, replace the valve. This is not a charge problem.",
    ],
    "stuck-defrost": [
      "The outdoor unit is steaming and the house is getting cool air in winter. It is stuck in defrost.",
      "Check the coil sensor. It should open the defrost around 50 to 70°F.",
      "Terminate defrost. Do not leave the fan off and the valve in cool all night.",
    ],
    "weak-pump": [
      "It runs all day and the house does not move. Suction is high, head is low, amps are light.",
      "Prove airflow and charge before you buy a compressor. Those two can fake this.",
      "If air is right and the charge is the nameplate weight, the pump is done.",
    ],
    "bad-cap": [
      "Listen. A hum and a dead fan with sane pressures is not a refrigerant call.",
      "Kill power at the breaker and prove zero. The disconnect handle can lie.",
      "Discharge the capacitor with a resistor. Read microfarads against the nameplate.",
      "Replace the cap if it is out of range. Then start it and watch the fan.",
    ],
    "od-fan": [
      "High head and a condenser fan that is not spinning. Do not add gas.",
      "Kill power before you touch the blade. A stopped fan can start.",
      "Check the capacitor, then the fan motor. The high-pressure switch did its job.",
    ],
    air: [
      "High head after a sloppy braze is air in the system, not 'a little extra gas.'",
      "Do not bleed it off a 410A system. Recover it.",
      "New drier, nitrogen while brazing, deep vacuum, then weigh the charge.",
    ],
    "no-defrost": [
      "Outdoor coil iced in heat, and the board never left heating. Do not add gas for the weather.",
      "Check the defrost sensor and force a defrost: reversing valve to cool, outdoor fan off.",
      "If it never terminates, the sensor or the board is the call.",
    ],
    float: [
      "The system never started. Do not hook gauges and hunt a charge problem.",
      "The pan is full and the float is open. The switch did its job.",
      "Kill power, clear the drain, and leave the float in the circuit.",
    ],
    "june-co": [
      "This is the furnace, not the condenser. Leave the split alone.",
      "Lazy yellow flame and a rusty exchanger: shut the gas and the power.",
      "Open a window. Red-tag it. Do not tape a crack and relight it for choir.",
    ],
    "nadine-o2": [
      "She rolled out oxygen. Put that cylinder back.",
      "Pressure-test with dry nitrogen only. Oxygen plus oil is a fire.",
      "If it holds, evacuate and weigh the charge. If it drops, find the leak first.",
    ],
    "bypass-disc": [
      "The disconnect handle says off and the unit is still running. Someone jumped it.",
      "Kill it at the breaker. Prove zero volts on the line side.",
      "Then pull the jumper. Do not grab the lugs because the handle looks off.",
    ],
    "ppe-chem": [
      "The outdoor coil is the dirty one on the pad. Goggles on before the sprayer.",
      "Shut the unit down, then wash the coil. Do not fog yourself.",
      "Rinse, let it dry, start it, and read the head again.",
    ],
    "ppe-burn": [
      "This unit is running hot. The discharge line is the burn.",
      "Gloves on. Do not grab copper to see if it is hot.",
      "Read the gauges. High head is the complaint. Skin is not a thermometer.",
    ],
    "inj-ladder": [
      "The condenser is on the wall, off the side of the ladder.",
      "Climb down. Move the ladder under the work. Then go back up.",
      "Do not reach outside the rails. Wash or read it only when it is between the rails.",
    ],
    "inj-roof": [
      "The unit is near the roof edge. Stay back from the line.",
      "Work from the safe side. Do not walk the edge to get a better look at the fan.",
      "If you cannot reach it without your foot on the edge, come down and reset.",
    ],
    "inj-cap": [
      "The compressor hums and the fan is lazy. That is the capacitor, and it can still be charged.",
      "Kill power and prove zero before you pull the cap wires.",
      "Discharge it with a resistor, read the microfarads, then replace it if it is low.",
    ],
    "inj-phos": [
      "The line is still charged. The torch does not come out yet.",
      "Recover what is in it. Nitrogen on while you braze.",
      "Then vacuum and weigh the charge. Do not braze a live line.",
    ],
    "inj-o2": [
      "The basement has refrigerant in the air. Leave the torch on the truck.",
      "Ventilate. Do not stay in the room to 'finish one more joint.'",
      "Recover, repair, nitrogen, vacuum, weigh in. Oxygen never goes in the system.",
    ],
    "inj-co": [
      "The heat call is dead. This one is the furnace, not a low charge.",
      "Shut the gas and the power if the exchanger looks cracked or the flame is lazy.",
      "Air the room. Red-tag it. Do not add refrigerant to a furnace problem.",
    ],
    "inj-attic": [
      "The air handler is over the joists. Step on the wood, not the drywall.",
      "Filter and coil are the airflow check. Do not add gas from a hole in the ceiling.",
      "When you come down, the coil should be clear and you should still be on the joists.",
    ],
    "inj-fan": [
      "Outdoor fan is not spinning and the head is high. Do not stick a hand in the blade.",
      "Kill power and prove zero. A stopped fan can start.",
      "Capacitor first, then the motor. The high-pressure switch already did its job.",
    ],
    "inj-frost": [
      "Liquid refrigerant on skin is a burn. Gloves and glasses on.",
      "This system is low. Find the leak. Do not vent liquid to 'see it.'",
      "Recover, repair, vacuum, weigh in.",
    ],
    "inj-back": [
      "The condenser is the heavy box in the yard. Do not lift it alone.",
      "If the coil is packed, wash it in place. Do not pick the cabinet up to 'get the back.'",
      "A second person or a lift. Then recheck the head.",
    ],
    "inj-hose": [
      "Nitrogen hose is the one that will whip if the fitting is loose.",
      "Regulator on, connection tight, then crack the bottle slow.",
      "Soap the joints. Do not open the bottle into a hose you are still holding.",
    ],
    "inj-foot": [
      "Roof unit, and the surface is slick. Boots with a tread, or you do not go up.",
      "The coil can be dirty. Wash it from a planted stance.",
      "Come down before you are tired. The edge is not a shortcut.",
    ],
    "inj-heat": [
      "The roof unit is in the sun and the head is high. Water first.",
      "If you are dizzy, climb down. The coil will still be there.",
      "Wash the condenser when you can stand the heat. Do not pull charge to lower the head.",
    ],
    "inj-scald": [
      "This is a hot boiler, not a charge problem. The gauges on the split are the wrong tool.",
      "Let it cool. Gloves on. Do not open a hot boiler bare-handed.",
      "Bleed it only after the pressure and the temperature are down.",
    ],
    "inj-ears": [
      "The outdoor fan is the noise. Plugs in before you lean on the cabinet.",
      "Read the gauges with your ears protected. High head is still high head.",
      "If the fan is the fault, kill power before you touch the blade.",
    ],
  };

  function unitFor(call) {
    if (!call) return "leak";
    if (call.jobId && UNIT_OF[call.jobId]) return UNIT_OF[call.jobId];
    if (call.jobId) return call.jobId;
    return "leak";
  }

  function walkFor(call) {
    if (!call) return [];
    if (WALKS[call.jobId]) return WALKS[call.jobId];
    var unit = unitFor(call);
    if (unit && WALKS[unit]) return WALKS[unit];
    var fix = call.choices && call.choices.filter(function (ch) { return ch.ok; })[0];
    return [
      "Read the complaint before you open a panel.",
      "Meter it, or read both gauges. Do not name a part from the truck.",
      fix ? fix.t : "Make the repair the readings name, then run it and recheck.",
    ];
  }

  function funnyCalls() {
    return [
      {
        name: "Big Tony · pizza",
        avatar: "🍕",
        job: "Walk-in cooler · warm dough · customers waiting",
        jobId: "tony-walkin",
        scene: "call/gauges.jpg",
        vitals: "Box 55°F · Door gasket torn · Evap fan running · Sight glass flashing",
        quote: {
          pro: "The dough is rising into a science project. Don't vent that charge in my kitchen. My last guy did and the pepperoni filed a complaint.",
          spicy: "If you hose refrigerant over my pies I will name a pizza after your obituary.",
          extra: "The walk-in is a sauna and I already ate a gas-station burrito. Fix the box. Do not die in my kitchen. I don't have the staff for that.",
        },
        prompt: "Warm walk-in, flashing sight glass, torn gasket. Safe path?",
        choices: [
          { t: "Find the leak, recover, fix the gasket, evacuate, weigh the charge", ok: true },
          { t: "Crack a hose and sniff for the leak over the pizza", ok: false, die: "A KITCHEN FULL OF REFRIGERANT", joke: "Here lies a tech. The wagon rolled on. The pepperoni did not." },
          { t: "Add gas through the door and leave", ok: false },
          { t: "Unplug the evap fan so it 'rests'", ok: false },
        ],
        why: {
          ok: "A flashing glass and a torn gasket is a leak, not a top-off. Recover it. Don't dump it on the food.",
          bad: "Venting in a kitchen is how you empty the charge and the room.",
        },
        reply: {
          pro: { ok: "Dough is behaving. Slice is on the house.", bad: "My kitchen smells like a parts house." },
          spicy: { ok: "Cold box. You can stay for a slice.", bad: "You gassed the pepperoni. Tony is not amused." },
          extra: { ok: "Box is cold. The burrito was the only casualty.", bad: "You opened a hose over my pies. That's a closed casket and a bad review." },
        },
      },
      {
        name: "Coach Ruiz",
        avatar: "🏋️",
        job: "Gym condenser · pad behind the treadmills · no cool",
        jobId: "ruiz-fan",
        scene: "call/condenser.jpg",
        vitals: "Outdoor fan is not spinning · Head high · Unit is still powered",
        quote: {
          pro: "Forty people are sweating through a spin class. The fan looks lazy. Do not stick a hand in it to 'give it a push.'",
          spicy: "That fan will take a finger faster than my freshman take a water break.",
          extra: "Push that fan with a screwdriver and I will put your name on the memorial whiteboard. Next to the guy who died of the burrito.",
        },
        prompt: "Condenser fan is stopped and the unit is still hot. First move?",
        choices: [
          { t: "Kill power, prove zero, then check the capacitor and the fan motor", ok: true },
          { t: "Stick a screwdriver in and spin the blade to get it going", ok: false, die: "A SPINNING CONDENSER FAN", scene: "died/fan.jpg", joke: "You have died of a helpful shove. The class kept spinning." },
          { t: "Add refrigerant to bring the head down", ok: false },
          { t: "Hose the coil while it is running", ok: false },
        ],
        why: {
          ok: "A dead outdoor fan with the unit powered is a capacitor or a motor. Kill it before you touch the blade.",
          bad: "A stopped fan can start. Your hand is not a tool.",
        },
        reply: {
          pro: { ok: "Fan's turning. Class can suffer the normal way.", bad: "You reached in. Sit down." },
          spicy: { ok: "Meter first. I respect that.", bad: "The blade did not want help." },
          extra: { ok: "Zero volts, then the cap. That's a grown-up call.", bad: "Screwdriver in the fan. The whiteboard has a new name." },
        },
      },
      {
        name: "Aunt June",
        avatar: "⛪",
        job: "Church basement furnace · headache · rusty exchanger",
        jobId: "june-co",
        scene: "call/gauges.jpg",
        vitals: "CO alarm chirped once · Flame is lazy and yellow · Exchanger looks cracked",
        quote: {
          pro: "The ladies' circle has a headache and the flame looks like a candle in a draft. Don't tell me to 'just run it through the service.'",
          spicy: "If you leave that furnace on I will put you in the church bulletin under obituaries.",
          extra: "Yellow flame, rusty holes, and a room full of hymn books. Shut it down. I did not survive the potluck to die of the furnace.",
        },
        prompt: "Suspected cracked heat exchanger. What's the call?",
        choices: [
          { t: "Shut the furnace off, ventilate, and red-tag it until the exchanger is proven safe", ok: true },
          { t: "Leave it running so the basement stays warm for choir", ok: false, die: "CARBON MONOXIDE", joke: "You have died of staying for one more hymn." },
          { t: "Tape the crack and light it again", ok: false },
          { t: "Turn the gas up so the flame looks better", ok: false },
        ],
        why: {
          ok: "A cracked exchanger is not a comfort call. Kill it, air the room, and don't relight it.",
          bad: "Warm air from a cracked exchanger is the call you don't walk away from.",
        },
        reply: {
          pro: { ok: "We'll use the hall heater. Thank you.", bad: "My head hurts worse." },
          spicy: { ok: "Red tag. I'll tell the choir.", bad: "You left it lit. June is writing the bulletin." },
          extra: { ok: "Furnace is dead. The congregation is not.", bad: "Tape on a crack is not a repair. It's a headline." },
        },
      },
      {
        name: "Luis · food truck",
        avatar: "🌮",
        job: "Truck reach-in · line set rubbed through · he already opened it",
        jobId: "luis-torch",
        scene: "call/gauges.jpg",
        vitals: "Line is open · Oil at the rub · Torch is in his hand · Charge is not recovered",
        quote: {
          pro: "I rubbed a hole with the door and I already feel like I died of dysentery from a gas-station burrito. Don't braze that line while it's still full.",
          spicy: "Torch is hot. The line is not empty. I can die of the burrito or you can die of the torch. Pick the burrito.",
          extra: "Braze a charged line and the truck becomes a parade float. Recover it. Then the fire.",
        },
        prompt: "Open line, charge still in it, torch in the customer's hand. Move?",
        choices: [
          { t: "Take the torch. Recover what's left. Then braze, evacuate, and weigh in.", ok: true },
          { t: "Braze it now. The hiss means it's almost empty.", ok: false, die: "A TORCH ON A CHARGED LINE", scene: "died/braze.jpg", joke: "You have died of skipping recovery. The burrito is still undefeated." },
          { t: "Hand him a hose and a can of refrigerant", ok: false },
          { t: "Light the torch so you can see the oil better", ok: false },
        ],
        why: {
          ok: "A hissing line still has refrigerant. Recover, then braze. Fire on a charged line is not a shortcut.",
          bad: "Almost empty is still enough to push oil and fire at your face.",
        },
        reply: {
          pro: { ok: "Truck's cold. Burrito was the only casualty.", bad: "That flash singed my menu." },
          spicy: { ok: "You took the torch. I owe you a taco.", bad: "You brazed a live line. Luis is writing a ballad." },
          extra: { ok: "Recovered, brazed, weighed. That's the order.", bad: "The hiss was the warning. You used it as a timer." },
        },
      },
      {
        name: "Nadine · nails",
        avatar: "💅",
        job: "Mini-split · she wants it 'pressure tested with the good air'",
        jobId: "nadine-o2",
        scene: "call/gauges.jpg",
        vitals: "She rolled out an oxygen cylinder · Nitrogen bottle is still on the truck",
        quote: {
          pro: "My cousin said oxygen makes a better leak test because the bubbles are livelier. He also set a shop rag on fire, so.",
          spicy: "Use the oxygen. Nitrogen is boring and I have a 2 o'clock fill.",
          extra: "Oxygen in a refrigeration system is how a salon becomes a headline. Nitrogen. Only nitrogen.",
        },
        prompt: "Customer offers an oxygen cylinder for the pressure test. Call?",
        choices: [
          { t: "No. Nitrogen only. Oxygen does not go in this system.", ok: true },
          { t: "A short shot of oxygen is fine if you crack it slow", ok: false, die: "PURE OXYGEN", scene: "died/o2.jpg", joke: "You have died of a livelier bubble. The fill is cancelled." },
          { t: "Use shop air from the compressor", ok: false },
          { t: "Skip the pressure test and add refrigerant", ok: false },
        ],
        why: {
          ok: "Oxygen plus oil is a fire. Pressure test with dry nitrogen.",
          bad: "There is no small shot of oxygen that belongs in a system.",
        },
        reply: {
          pro: { ok: "Fine. Use the boring bottle.", bad: "That popped louder than my playlist." },
          spicy: { ok: "Nitrogen. I'll move the 2 o'clock.", bad: "You used oxygen. Nadine is booking a new tech and a new wall." },
          extra: { ok: "Dry nitrogen. The rag stays unburned.", bad: "Slow oxygen is still oxygen." },
        },
      },
      {
        name: "Mr. Boone",
        avatar: "🚐",
        job: "Trailer condenser · hums · no fan · capacitor looks pregnant",
        jobId: "boone-cap",
        scene: "call/condenser.jpg",
        vitals: "Compressor hums · Fan still · Cap is swollen · Disconnect is on",
        quote: {
          pro: "It hums like a hymn and the fan sits there. The silver can looks pregnant. Don't poke the terminals to 'see if it bites.'",
          spicy: "That can is swollen and rude. Discharge it with a screwdriver if you enjoy being a cartoon.",
          extra: "A charged capacitor does not care that the fan is lazy. Kill power, discharge it with a resistor, then read the microfarads.",
        },
        prompt: "Swollen capacitor, unit still powered. What's the move?",
        choices: [
          { t: "Kill power, prove zero, discharge the cap with a resistor, then ohm it", ok: true },
          { t: "Short the terminals with a screwdriver while it's still hooked up", ok: false, die: "A CHARGED CAPACITOR", scene: "died/cap.jpg", joke: "You have died of a screwdriver. The trailer kept the fan." },
          { t: "Add a pound so the compressor has something to do", ok: false },
          { t: "Replace the breaker with a bigger one", ok: false },
        ],
        why: {
          ok: "A swollen cap can still hold a charge after the disconnect. Kill it, bleed it, then test it.",
          bad: "Shorting a live cap is a weld, a shock, and a new story for the park.",
        },
        reply: {
          pro: { ok: "Fan's back. The can was the whole plot.", bad: "That spark woke the neighbor's dog." },
          spicy: { ok: "Resistor, not a screwdriver. I like you.", bad: "You poked it. The hymn stopped." },
          extra: { ok: "Zero volts, then microfarads. Trailer is cooling.", bad: "The screwdriver won. You are the punchline." },
        },
      },
    ];
  }

  function ppeCalls() {
    return [
      {
        name: "Basement · braze",
        avatar: "🔥",
        job: "Leaking joint · torch lit · glasses still on the box",
        jobId: "ppe-eyes",
        scene: "call/gauges.jpg",
        scenePos: "center 42%",
        vitals: "Nitrogen is on · Joint is bright · No glasses on your face",
        quote: {
          pro: "Just braze it. The glasses are right there if you want them.",
          spicy: "Those glasses are a suggestion. The joint is leaking.",
          extra: "Skip the glasses. I have seen sparks before.",
        },
        prompt: "Torch is lit. What's the move?",
        choices: [
          { t: "Glasses on. Then braze the joint.", ok: true },
          { t: "Braze it. The glasses can stay on the box.", ok: false, die: "YOU BRAZED WITHOUT SAFETY GLASSES", scene: "svc-ppe-eyes.jpg", kicker: "YOU ARE HURT BECAUSE", joke: "The glasses had a great view of the box." },
          { t: "Add refrigerant with the torch still lit", ok: false },
          { t: "Aim the flame at the TXV bulb to warm it", ok: false },
        ],
        why: {
          ok: "A torch throws UV and splatter. Glasses go on before the flame.",
          bad: "You looked into the joint with bare eyes. That's a flash burn.",
        },
        reply: {
          pro: { ok: "Glasses on. Finish the joint.", bad: "You can't see the joint now." },
          spicy: { ok: "About time.", bad: "The glasses were a foot away." },
          extra: { ok: "Eyes still work.", bad: "Flash burn. Truck time." },
        },
      },
      {
        name: "Side yard · coil",
        avatar: "🧴",
        job: "Matted condenser · coil cleaner out · goggles on the door",
        jobId: "ppe-chem",
        scene: "call/condenser.jpg",
        scenePos: "center 40%",
        vitals: "Fan is off · Cleaner is alkaline · Goggles are not on you",
        quote: {
          pro: "Spray it and rinse it. I don't care about the goggles.",
          spicy: "That green stuff is fine. My uncle never wore goggles.",
          extra: "Leave the goggles on the door. Just don't get it on the brick.",
        },
        prompt: "Coil cleaner is in the sprayer. What's the move?",
        choices: [
          { t: "Goggles on. Fan off. Spray the coil, then rinse.", ok: true },
          { t: "Spray it. The goggles can stay on the door.", ok: false, die: "YOU SPRAYED COIL CLEANER WITH NO GOGGLES", scene: "svc-ppe-chem.jpg", kicker: "YOU ARE HURT BECAUSE", joke: "Uncle was wrong. Your eyes took the call." },
          { t: "Spray it with the condenser fan running", ok: false },
          { t: "Wash the coil with a jug of refrigerant", ok: false },
        ],
        why: {
          ok: "Coil cleaner burns eyes. Goggles on, fan off, then spray and rinse.",
          bad: "That cleaner is alkaline. Bare eyes are how you leave the call.",
        },
        reply: {
          pro: { ok: "Coil's clean. Eyes are fine.", bad: "Rinse your eyes. Now." },
          spicy: { ok: "Goggles were the whole job.", bad: "Uncle was wrong." },
          extra: { ok: "Brick is fine. So are you.", bad: "Cleaner in the eye. That's the day." },
        },
      },
      {
        name: "Pad · discharge",
        avatar: "🧤",
        job: "Compressor just shut off · discharge line still hot · gloves on the unit",
        jobId: "ppe-burn",
        scene: "call/gauges.jpg",
        scenePos: "center 45%",
        vitals: "Discharge is too hot to hold · Gloves are on the top panel",
        quote: {
          pro: "Grab that copper and see if it's the hot one.",
          spicy: "It's just a pipe. Gloves are for winter.",
          extra: "Bare hand. Tell me if it bites.",
        },
        prompt: "The discharge line is still hot. What's the move?",
        choices: [
          { t: "Gloves on. Don't grab a hot discharge line.", ok: true },
          { t: "Grab it. Find out if it's hot.", ok: false, die: "YOU GRABBED A HOT DISCHARGE LINE", scene: "svc-ppe-burn.jpg", kicker: "YOU ARE HURT BECAUSE", joke: "It was hot. You are the gauge now." },
          { t: "Add gas so the compressor runs cooler", ok: false },
          { t: "Wrap the line in electrical tape", ok: false },
        ],
        why: {
          ok: "Discharge line burns. Gloves on, or you don't touch it.",
          bad: "That line was still hot. Bare skin is a burn.",
        },
        reply: {
          pro: { ok: "Leave it. Gloves first.", bad: "That's a burn. Truck." },
          spicy: { ok: "Gloves were on the unit.", bad: "It bit you." },
          extra: { ok: "You kept your hand.", bad: "Tape doesn't fix a burn." },
        },
      },
    ];
  }

  function injuryCalls() {
    function one(o) {
      var died = o.died;
      return {
        name: o.name,
        avatar: o.avatar,
        job: o.job,
        jobId: o.id,
        scene: /roof|ladder|fan|foot|heat|back/.test(o.id) ? "call/condenser.jpg" : "call/gauges.jpg",
        scenePos: "center 38%",
        vitals: o.vitals,
        quote: { pro: o.q, spicy: o.q, extra: o.q },
        prompt: o.prompt,
        choices: [
          { t: o.safe, ok: true },
          { t: o.bad, ok: false, die: o.die, scene: o.scene, kicker: died ? "YOU HAVE DIED BECAUSE" : "YOU ARE HURT BECAUSE", joke: o.joke },
          { t: o.w1, ok: false },
          { t: o.w2, ok: false },
        ],
        why: { ok: o.okWhy, bad: o.badWhy },
        reply: {
          pro: { ok: o.okSay, bad: o.badSay },
          spicy: { ok: o.okSay, bad: o.badSay },
          extra: { ok: o.okSay, bad: o.badSay },
        },
      };
    }
    return [
      one({
        id: "inj-ladder", died: true, avatar: "🪜", name: "Gable · ladder",
        scene: "died/ladder.jpg",
        job: "Wall condenser · ladder is beside it, not under it",
        vitals: "You are ten feet up · The unit is outside the rails",
        q: "Just reach it. I don't want the ladder in the flowers.",
        prompt: "The unit sits off the side of the ladder. What's the move?",
        safe: "Climb down. Move the ladder. Then go back up.",
        bad: "Reach for the unit. The ladder will hold.",
        w1: "Tie the ladder to the gutter with a charge hose",
        w2: "Jump from the ladder onto the roof",
        die: "YOU REACHED OFF THE LADDER",
        joke: "The flowers are fine. You are not.",
        okWhy: "Falls kill techs. Move the ladder so the work stays between the rails.",
        badWhy: "Reaching past the rails is how the ladder leaves without you.",
        okSay: "Down, move it, back up.",
        badSay: "The ladder went. You went with it.",
      }),
      one({
        id: "inj-roof", died: true, avatar: "🏢", name: "Roof · edge",
        scene: "svc-inj-roof.jpg",
        job: "Rooftop unit · parapet is low · you are walking the edge",
        vitals: "Open edge on your right · No spotter · Unit is behind you",
        q: "Keep walking. The unit is right there.",
        prompt: "You are walking the roof edge. What's the move?",
        safe: "Stop. Turn around. Stay two steps off the edge.",
        bad: "Keep walking the edge while you look at the unit.",
        w1: "Run so the call goes faster",
        w2: "Sit on the parapet and eat",
        die: "YOU WALKED THE ROOF EDGE",
        joke: "The unit is still up there.",
        okWhy: "A roof edge does not give a second step. Face the work and stay back.",
        badWhy: "Walking the edge with your eyes on the unit is how techs leave the roof.",
        okSay: "Two steps in. Now work.",
        badSay: "The edge was closer than the unit.",
      }),
      one({
        id: "inj-cap", died: true, avatar: "⚡", name: "Pad · capacitor",
        scene: "died/cap.jpg",
        job: "Run capacitor · panel off · terminals still hot",
        vitals: "Disconnect is open · Capacitor has not been bled",
        q: "Short it with the screwdriver so we can change it.",
        prompt: "The capacitor is still in the unit. What's the move?",
        safe: "Power off. Prove zero. Bleed the cap.",
        bad: "Short the terminals with your screwdriver.",
        w1: "Add a hard start and leave the old cap",
        w2: "Charge the system so the cap heals",
        die: "YOU SHORTED A CHARGED CAPACITOR",
        joke: "The screwdriver sends its regards.",
        okWhy: "A run cap holds a charge with the disconnect off. Bleed it before you touch it.",
        badWhy: "A screwdriver across a charged cap is a shock.",
        okSay: "Zero volts. Cap is bled.",
        badSay: "That spark was the charge.",
      }),
      one({
        id: "inj-phos", died: true, avatar: "🔥", name: "Basement · charged line",
        scene: "died/braze.jpg",
        job: "Joint to braze · gauges still show pressure · refrigerant still in the line",
        vitals: "Low side is not at zero · Torch is lit",
        q: "Just braze it. The charge will push out.",
        prompt: "The line still has refrigerant. What's the move?",
        safe: "Recover the charge. Purge with nitrogen. Then braze.",
        bad: "Braze it. The gauges are already on.",
        w1: "Heat the line to drive the refrigerant out",
        w2: "Add dye and keep the torch on the joint",
        die: "YOU BRAZED A LINE THAT STILL HAD REFRIGERANT",
        joke: "Nice joint. Shame about the air.",
        okWhy: "Heat on a charged line makes gas you cannot breathe. Recover, purge, then braze.",
        badWhy: "You do not braze a line that still has refrigerant in it.",
        okSay: "Empty, purged, then the torch.",
        badSay: "That smoke is why the line gets recovered first.",
      }),
      one({
        id: "inj-o2", died: true, avatar: "💨", name: "Basement · vapor",
        scene: "svc-inj-o2.jpg",
        job: "Cylinder dumped · basement is full of refrigerant vapor",
        vitals: "Door behind you · Cloud is at your knees and rising",
        q: "Stay in there and find the leak. I'm not paying for a second trip.",
        prompt: "The room is full of refrigerant. What's the move?",
        safe: "Get out. Ventilate. Do not hunt the leak in the cloud.",
        bad: "Stay in the cloud and look for the leak.",
        w1: "Spray coil cleaner so you can see the vapor",
        w2: "Open another cylinder so the pressure comes back",
        die: "YOU STAYED IN A ROOM FULL OF REFRIGERANT",
        joke: "The leak is still in there.",
        okWhy: "Refrigerant vapor pushes the air out. You leave, then you ventilate.",
        badWhy: "A basement full of refrigerant is not a place to stand and look.",
        okSay: "Out. Air it out. Then we look.",
        badSay: "The cloud does not leave room for you.",
      }),
      one({
        id: "inj-co", died: true, avatar: "☠️", name: "Basement · furnace",
        scene: "svc-inj-co.jpg",
        job: "Furnace cabinet cracked · it is still firing · windows are shut",
        vitals: "Flame is on · Crack is open · People are in the house",
        q: "Let it run. I want heat tonight.",
        prompt: "The furnace is cracked and firing. What's the move?",
        safe: "Shut the gas. Kill power. Get everyone out.",
        bad: "Let it run so you can watch the flame.",
        w1: "Tape the crack and start it again",
        w2: "Turn the fan to ON and go upstairs",
        die: "YOU STAYED WITH A CRACKED FURNACE",
        joke: "The house has heat. You do not.",
        okWhy: "A cracked heat exchanger puts carbon monoxide in the house. Gas off. People out.",
        badWhy: "You do not stand in a closed house with a cracked furnace running.",
        okSay: "Gas is off. They are outside.",
        badSay: "That crack was feeding the room.",
      }),
      one({
        id: "inj-attic", died: true, avatar: "🪵", name: "Attic · joists",
        scene: "svc-inj-attic.jpg",
        job: "Air handler in the attic · drywall between the joists",
        vitals: "Joists are the only floor · The ceiling is not a floor",
        q: "Just step across. The ceiling held the last guy.",
        prompt: "You have to cross the attic. What's the move?",
        safe: "Stay on the joists. Lay a board if you must cross.",
        bad: "Step on the drywall. It looks solid.",
        w1: "Walk on top of the insulation",
        w2: "Jump to the air handler",
        die: "YOU STEPPED OFF THE JOIST",
        joke: "The living room has a new skylight.",
        okWhy: "Drywall is the ceiling, not a floor. Joists or a board.",
        badWhy: "Stepping off the joist is how you go through the ceiling.",
        okSay: "Joists only.",
        badSay: "The ceiling was not a floor.",
      }),
      one({
        id: "inj-crawl", died: true, avatar: "🕷️", name: "Crawlspace · flare nut",
        scene: "died/crawl.jpg",
        vitals: "No light on you · Dust on the joists · Droppings on the ground · The nut is still rolling",
        q: "Just go get it. It's only a nut.",
        prompt: "The flare nut rolled into a dark crawlspace. What's the move?",
        safe: "Light first. Mask on. Do not chase it into the dark.",
        bad: "Crawl in after the nut with no light and no mask.",
        w1: "Sweep the dust with your hand so you can see",
        w2: "Blow the webs out with your mouth",
        die: "YOU CRAWLED INTO THE DARK AFTER A FLARE NUT",
        joke: "The nut is still in there. So is whatever was living on the joists.",
        okWhy: "An old crawlspace can hold rodent dust and old insulation. Light and a mask come before the nut.",
        badWhy: "You do not chase a fitting into a dark crawlspace and breathe the dust.",
        okSay: "Light. Mask. Then the nut.",
        badSay: "The nut was not worth the crawl.",
      }),
      one({
        id: "inj-fan", died: false, avatar: "🌀", name: "Roof · fan",
        scene: "died/fan.jpg",
        job: "Condenser top off · fan blade still spinning",
        vitals: "Blade is moving · Disconnect has not been proved",
        q: "Grab the blade and stop it. I need this done.",
        prompt: "The fan is still spinning. What's the move?",
        safe: "Kill power. Prove the blade is still. Then work.",
        bad: "Stop the blade with your hand.",
        w1: "Spray the spinning fan with coil cleaner",
        w2: "Stick a screwdriver in to slow it down",
        die: "YOU REACHED INTO THE CONDENSER FAN",
        joke: "The blade did not want a high five.",
        okWhy: "A condenser fan does not get a hand until power is off and the blade is still.",
        badWhy: "Hands and tools stay out of a spinning fan.",
        okSay: "Power is off. Blade is still.",
        badSay: "The blade was faster than your hand.",
      }),
      one({
        id: "inj-frost", died: false, avatar: "❄️", name: "Pad · liquid",
        scene: "svc-inj-frost.jpg",
        job: "Liquid port cracked · refrigerant spraying at your bare hand",
        vitals: "High side is up · No gloves on the valve",
        q: "Just see if it is cold. That tells us the charge.",
        prompt: "Liquid refrigerant is spraying. What's the move?",
        safe: "Shut the port. Gloves on before you touch it.",
        bad: "Put your hand in it and see if it is cold.",
        w1: "Add more gas so the spray gets stronger",
        w2: "Point the spray at the fan to cool the unit",
        die: "YOU VENTED LIQUID REFRIGERANT ON YOUR HAND",
        joke: "Your hand is the new suction line.",
        okWhy: "Liquid refrigerant freezes skin. Shut it off. Gloves on.",
        badWhy: "You do not test a charge with your hand in the spray.",
        okSay: "Port is shut. Hand is dry.",
        badSay: "That spray burns cold.",
      }),
      one({
        id: "inj-back", died: false, avatar: "🏋️", name: "Yard · condenser",
        scene: "svc-inj-back.jpg",
        job: "Condenser has to come off the pad · you are the only tech",
        vitals: "Unit is heavy · No second person · No lift",
        q: "Just pick it up. I did it myself for years.",
        prompt: "The condenser has to move. What's the move?",
        safe: "Wait for a second person. Lift with your legs.",
        bad: "Bend over and pick the condenser up yourself.",
        w1: "Drag it off the pad by the copper",
        w2: "Kick it upright and hope",
        die: "YOU LIFTED THE CONDENSER ALONE",
        joke: "Your back just filed a grievance.",
        okWhy: "A condenser is a two-person lift. Your back does not get a vote.",
        badWhy: "One tech, straight legs, rounded back. That is a blown back.",
        okSay: "Two sets of hands.",
        badSay: "The unit won. Your back lost.",
      }),
      one({
        id: "inj-hose", died: false, avatar: "💨", name: "Pad · nitrogen",
        scene: "svc-inj-hose.jpg",
        job: "Nitrogen hose is finger-tight · regulator is about to open",
        vitals: "Flare is not wrenched · Cylinder valve is next",
        q: "Open it. If it leaks we will hear it.",
        prompt: "The nitrogen hose is loose. What's the move?",
        safe: "Wrench the hose. Then crack the nitrogen.",
        bad: "Open the nitrogen. The hose looks close enough.",
        w1: "Use refrigerant instead of nitrogen to find the leak",
        w2: "Hold the hose on with your hand while it charges",
        die: "YOU OPENED NITROGEN ON A LOOSE HOSE",
        joke: "The hose had plans. You were in them.",
        okWhy: "A loose hose on nitrogen becomes a whip. Wrench it first.",
        badWhy: "Pressure on a loose hose hits you on the way by.",
        okSay: "Tight. Then the valve.",
        badSay: "The hose left the fitting.",
      }),
      one({
        id: "inj-n2face", died: true, avatar: "🟢", name: "Yard · nitrogen",
        scene: "died/n2.jpg",
        vitals: "Cap is off · A hoagie in one hand · A vape in the other · You are in front of the valve",
        q: "I got it. Hold still. I need a bite.",
        prompt: "He is walking a live nitrogen cylinder past your face while he eats and vapes. What's the move?",
        safe: "Stop him. Cap on. Both hands on the cylinder. Food and the vape wait.",
        bad: "Let him walk it past your face while he eats.",
        w1: "Tell him to rest the valve on your shoulder",
        w2: "Open the valve so the cylinder gets lighter",
        die: "YOU TOOK A NITROGEN TANK TO THE FACE",
        joke: "He wanted a hoagie and a vape. The cylinder wanted a clear path.",
        okWhy: "A nitrogen cylinder gets a cap, two hands, and your full attention. Food and a vape do not ride along.",
        badWhy: "A dropped cylinder becomes a rocket. Your face does not get to be the stop.",
        okSay: "Cap on. Both hands. Eat after it is chained.",
        badSay: "The tank left his arm and found your face.",
      }),
      one({
        id: "inj-foot", died: false, avatar: "👢", name: "Roof · boots",
        scene: "svc-inj-foot.jpg",
        job: "Condenser tipping · you are in sneakers · boots are by the van",
        vitals: "Unit is coming off the pad · Toes are not covered",
        q: "Catch it. The boots take too long.",
        prompt: "The condenser is tipping. What's the move?",
        safe: "Get clear. Boots on before anyone lifts it.",
        bad: "Catch it in sneakers.",
        w1: "Let it fall and catch it with your foot",
        w2: "Kick a brick under it while it falls",
        die: "YOU TRIED TO CATCH A CONDENSER IN SNEAKERS",
        joke: "The boots watched from the van.",
        okWhy: "A condenser on a sneaker breaks a foot. Clear out, then boots.",
        badWhy: "You do not catch a falling unit in sneakers.",
        okSay: "Clear. Boots. Then we set it.",
        badSay: "The unit found your foot.",
      }),
      one({
        id: "inj-heat", died: false, avatar: "☀️", name: "Roof · heat",
        scene: "svc-inj-heat.jpg",
        job: "Open roof · no shade · water bottle is empty",
        vitals: "You are dizzy · Sun is straight overhead",
        q: "Finish the roof. Water is in the van.",
        prompt: "You are cooked and the bottle is empty. What's the move?",
        safe: "Get off the roof. Water. Then come back.",
        bad: "Stay up and finish. The bottle can wait.",
        w1: "Drink from the condensate pan",
        w2: "Take the shirt off and keep going",
        die: "YOU STAYED ON A HOT ROOF TOO LONG",
        joke: "The condenser is comfortable. You are not.",
        okWhy: "Heat exhaustion ends the call. Get down and drink before you finish.",
        badWhy: "A hot roof with no water puts you down.",
        okSay: "Down. Water. Then the unit.",
        badSay: "The roof finished you first.",
      }),
      one({
        id: "inj-scald", died: false, avatar: "♨️", name: "Boiler room",
        scene: "svc-inj-scald.jpg",
        job: "Boiler drain is open · steam is coming out · gloves are on the pipe",
        vitals: "Steam at the valve · Your hands are bare",
        q: "Just crack it the rest of the way. Gloves are right there.",
        prompt: "Steam is coming off the boiler. What's the move?",
        safe: "Back up. Gloves on. Then crack it slow.",
        bad: "Open it the rest of the way with bare hands.",
        w1: "Stand in the steam so you can see the valve",
        w2: "Wrap the valve in electrical tape",
        die: "YOU OPENED A HOT BOILER WITH BARE HANDS",
        joke: "The gloves had a front-row seat.",
        okWhy: "Boiler steam scalds. Gloves on, then a slow crack.",
        badWhy: "Bare hands and live steam do not share a valve.",
        okSay: "Gloves. Slow crack.",
        badSay: "The steam got there first.",
      }),
      one({
        id: "inj-ears", died: false, avatar: "👂", name: "Pad · noise",
        scene: "svc-inj-ears.jpg",
        job: "Condenser fan screaming · ear plugs sitting on the disconnect",
        vitals: "You are kneeling at the fan · Plugs are not in",
        q: "It is one unit. You do not need plugs.",
        prompt: "The condenser is loud. What's the move?",
        safe: "Ear plugs in. Then the panel comes off.",
        bad: "Leave the plugs. It is only one unit.",
        w1: "Stick your head in the fan opening to hear the bearing",
        w2: "Turn the fan to high so the noise is shorter",
        die: "YOU WORKED A LOUD CONDENSER WITH NO EAR PLUGS",
        joke: "Your ears just put in their notice.",
        okWhy: "A condenser fan is loud enough to damage hearing. Plugs in first.",
        badWhy: "One loud unit is enough. The plugs were on the disconnect.",
        okSay: "Plugs in.",
        badSay: "Your ears will ring after this one.",
      }),
    ];
  }

  function bypassCall() {
    return {
      name: "Roof · last tech",
      avatar: "⚡",
      job: "Condenser on the roof · disconnect door open · still humming",
      jobId: "bypass-disc",
      scene: "svc-roof-bypass.jpg",
      vitals: "Disconnect looks OFF · Unit still running · No meter reading yet",
      quote: {
        pro: "The last guy said the disconnect was bad, so he jumped it. Can you just get it running?",
        spicy: "He bypassed the disconnect and left. Don't be a hero with those wires.",
        extra: "That disconnect is a decoration. The last tech jumped it and walked. Prove it dead or you're the next story.",
      },
      prompt: "The disconnect is bypassed. What's the move?",
      choices: [
        { t: "Kill it at the breaker. Prove zero volts. Then pull the jumper.", ok: true },
        { t: "Grab the line wires. The disconnect handle is already off.", ok: false, die: "SOMEONE BYPASSED THE DISCONNECT", scene: "svc-inj-cap.jpg", joke: "The handle was off. The wires did not care. No gloves on that lug." },
        { t: "Add a pound so the house has cool air tonight", ok: false },
        { t: "Shut the door and tell them the disconnect is fine", ok: false },
      ],
      why: {
        ok: "A jumped disconnect is still hot. Kill the breaker, prove zero, then pull the jumper.",
        bad: "The handle was off and the wires were still live. That's how you get hurt.",
      },
      reply: {
        pro: { ok: "Okay. Kill it for real.", bad: "I told you he jumped it." },
        spicy: { ok: "You metered it. Good.", bad: "Those lugs were hot. Sit down." },
        extra: { ok: "Zero volts. Now pull the jumper.", bad: "You grabbed a live bypass. The roof wins." },
      },
    };
  }

  let deathOpen = false;
  let safeSinceDeath = 0;
  let lastTechI = 0;

  function lastTechCard() {
    safeSinceDeath++;
    if (safeSinceDeath < 2) return null;
    if (safeSinceDeath < 4 && Math.random() >= 0.3) return null;
    safeSinceDeath = 0;
    const cards = [
      { die: "THE LAST TECH SWAPPED LINE AND LOAD", joke: "Glasses on. Gloves on. The handle was a liar.", scene: "svc-last-swap.jpg", pos: "center 32%" },
      { die: "THE LAST TECH JUMPED THE CONTACTOR", joke: "You killed the disconnect. The jumper did not.", scene: "svc-last-jumper.jpg", pos: "center 38%" },
      { die: "THE LAST TECH CROSSED THE HOSES", joke: "Goggles on. The red hose was on the wrong port.", scene: "svc-last-hoses.jpg", pos: "center 40%" },
      { die: "THE LAST TECH HOOKED THE CYLINDER BACKWARDS", joke: "Goggles on. The basement filled up anyway.", scene: "svc-last-tank.jpg", pos: "center 42%" },
    ];
    const card = cards[lastTechI % cards.length];
    lastTechI++;
    return card;
  }

  function dieKey(e) {
    if (!deathOpen) return;
    if (e.code === "Space" || e.key === "Enter") {
      e.preventDefault();
      closeDeath();
    }
  }

  function dieArt(reason, scene) {
    var r = String(reason || "").toLowerCase();
    var s = String(scene || "");
    if (/^died\//.test(s)) return s;
    if (/ladder|reached off the ladder/.test(r)) return "died/ladder.jpg";
    if (/capacitor/.test(r)) return "died/cap.jpg";
    if (/brazed a line|torch on a charged/.test(r)) return "died/braze.jpg";
    if (/pure oxygen/.test(r)) return "died/o2.jpg";
    if (/flare nut|crawled into the dark/.test(r)) return "died/crawl.jpg";
    if (/fan/.test(r)) return "died/fan.jpg";
    if (/nitrogen tank|to the face/.test(r)) return "died/n2.jpg";
    if (/recovery cylinder|relief valve|ruptur/.test(r)) return "died/cyl.jpg";
    if (s && !/^call\//.test(s)) return s;
    return "";
  }

  function showTrailCard(cause, joke, scene) {
    var old = document.getElementById("svc-trail");
    if (old) old.remove();
    if (!document.getElementById("svc-trail-style")) {
      var st = document.createElement("style");
      st.id = "svc-trail-style";
      st.textContent = "#svc-trail{position:fixed;inset:0;z-index:80;background:#14081c;display:flex;align-items:center;justify-content:center;padding:12px}#svc-trail .trail{width:min(520px,100%);text-align:center;color:#f0c36a;font-family:'Courier New',Courier,monospace;border:3px solid #6a4a28;border-radius:10px;background:#1a0e22;padding:10px}#svc-trail h2{margin:12px 8px 0;font-size:clamp(14px,3.6vw,18px);letter-spacing:.04em;font-weight:700;line-height:1.45;color:#f0c36a}#svc-trail p{margin:8px 8px 0;font-size:15px;line-height:1.45;color:#f6e2b0}#svc-trail .trail-kicker{margin:0;font-size:12px;letter-spacing:.22em;color:#c9a15a}#svc-trail img{display:block;width:100%;height:auto;margin:8px auto 0;image-rendering:pixelated;border:4px solid #3a2418;background:#000}#svc-trail button{margin-top:14px;min-height:48px;padding:8px 16px;border:2px solid #f0c36a;background:#3a220c;color:#f0c36a;font:700 14px/1.2 'Courier New',Courier,monospace;letter-spacing:.08em;cursor:pointer}#svc-trail .trail-hint{letter-spacing:.16em;font-size:12px;color:#a07840}";
      document.head.appendChild(st);
    }
    var line = String(cause || "A BAD CALL");
    var head = "YOU HAVE DIED OF";
    var under = joke || "Here lies a tech. That call ends the trip.";
    if (/^YOU /i.test(line)) {
      head = line;
      under = joke || "Here lies a tech. That call ends the trip.";
    }
    function esc(s) {
      return String(s || "").replace(/[&<>]/g, function (c) {
        return c === "&" ? "&" : c === "<" ? "<" : ">";
      });
    }
    var art = dieArt(line, scene);
    var el = document.createElement("div");
    el.id = "svc-trail";
    el.innerHTML =
      '<div class="trail" role="dialog" aria-modal="true">' +
      '<p class="trail-kicker">YOU HAVE DIED</p>' +
      (art ? '<img src="' + esc(art) + '" alt="" />' : "") +
      "<h2>" + esc(head) + "</h2>" +
      (/^YOU /i.test(line) ? "" : "<p>" + esc(line) + ".</p>") +
      (under ? "<p>" + esc(under) + "</p>" : "") +
      '<button type="button">CONTINUE</button>' +
      '<p class="trail-hint">- PRESS SPACE BAR TO CONTINUE -</p></div>';
    document.body.appendChild(el);
    el.querySelector("button").onclick = function () {
      el.remove();
      closeDeath();
    };
  }

  function showDeath(reason, kicker, scene, pos, joke) {
    if (!root) return;
    deathOpen = true;
    if (root) root.classList.add("is-dead");
    showTrailCard(reason, joke, scene);
    document.addEventListener("keydown", dieKey);
  }

  function closeDeath() {
    if (!deathOpen) return;
    deathOpen = false;
    document.removeEventListener("keydown", dieKey);
    var trail = document.getElementById("svc-trail");
    if (trail) trail.remove();
    if (root) root.classList.remove("is-dead");
    const died = root.querySelector("#svc-died");
    if (died) died.hidden = true;
    const stage = root.querySelector("#svc-stage");
    if (stage) stage.classList.remove("is-full");
    const go = root.querySelector("#svc-died-go");
    if (go) go.hidden = true;
    callI++;
    locked = false;
    render();
  }

  function fmtPt(p) {
    if (p < 0) return String(Math.round(-p * 2.036)) + '" vac';
    return p.toFixed(1) + " psig";
  }

  let ptRef = "R-410A";

  function paintPt() {
    const card = root && root.querySelector("#svc-pt");
    const PT = window.PtChart;
    if (!card || !PT || !PT.TABLES) return;
    const pack = PT.TABLES[ptRef] || PT.TABLES["R-410A"];
    const refs = card.querySelector("#svc-pt-refs");
    if (refs && !refs.childElementCount) {
      Object.keys(PT.TABLES).forEach(function (name) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = name;
        b.onclick = function () {
          ptRef = name;
          refs.querySelectorAll("button").forEach(function (n) { n.classList.toggle("on", n.textContent === name); });
          paintPt();
        };
        if (name === ptRef) b.classList.add("on");
        refs.appendChild(b);
      });
    }
    const note = card.querySelector("#svc-pt-note");
    if (note) note.textContent = pack.note || "";
    const p = parseFloat(card.querySelector("#svc-pt-p").value);
    const t = parseFloat(card.querySelector("#svc-pt-t").value);
    const fromP = card.querySelector("#svc-pt-from-p");
    const fromT = card.querySelector("#svc-pt-from-t");
    if (fromP) {
      if (!isFinite(p)) fromP.textContent = "Type a gauge pressure.";
      else {
        const sat = PT.satT(ptRef, p);
        const dew = PT.satTDew ? PT.satTDew(ptRef, p) : sat;
        const bubble = PT.satTBubble ? PT.satTBubble(ptRef, p) : sat;
        fromP.textContent = Math.abs(dew - bubble) < 0.05
          ? sat.toFixed(1) + "°F sat"
          : "Dew " + dew.toFixed(1) + "°F for superheat. Start of boiling " + bubble.toFixed(1) + "°F for subcooling.";
      }
    }
    if (fromT) {
      fromT.textContent = isFinite(t) ? fmtPt(PT.satP(ptRef, t)) : "Type a saturation temperature.";
    }
    const box = card.querySelector("#svc-pt-table");
    if (!box) return;
    let best = 0;
    let bestD = Infinity;
    pack.rows.forEach(function (row, i) {
      const d = Math.abs(row[1] - (isFinite(p) ? p : row[1]));
      if (d < bestD) { bestD = d; best = i; }
    });
    box.innerHTML = "<table><thead><tr><th>°F</th><th>psig</th></tr></thead><tbody>" +
      pack.rows.map(function (row, i) {
        return "<tr" + (i === best ? " class=\"on\"" : "") + "><td>" + row[0] + "</td><td>" + fmtPt(row[1]) + "</td></tr>";
      }).join("") + "</tbody></table>";
    const on = box.querySelector("tr.on");
    if (on) box.scrollTop = Math.max(0, on.offsetTop - 36);
  }

  function ensurePtCard() {
    if (!root || root.querySelector("#svc-pt")) return;
    const nav = root.querySelector(".svc-nav");
    if (nav && !nav.querySelector("#btn-svc-pt")) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn";
      b.id = "btn-svc-pt";
      b.textContent = "P/T chart";
      b.onclick = function () {
        const card = root.querySelector("#svc-pt");
        if (!card) return;
        card.hidden = !card.hidden;
        if (!card.hidden) paintPt();
      };
      nav.appendChild(b);
    }
    const card = document.createElement("div");
    card.id = "svc-pt";
    card.className = "svc-pt";
    card.hidden = true;
    card.innerHTML =
      '<header class="svc-pt-bar" id="svc-pt-bar"><strong>Saturation</strong><button type="button" class="svc-pt-x" id="svc-pt-x">Close</button></header>' +
      '<div class="svc-pt-refs" id="svc-pt-refs"></div>' +
      '<p class="svc-pt-note" id="svc-pt-note"></p>' +
      '<label>Gauge psig <input id="svc-pt-p" type="number" inputmode="decimal" value="118"></label>' +
      '<p class="svc-pt-ans" id="svc-pt-from-p"></p>' +
      '<label>Sat °F <input id="svc-pt-t" type="number" inputmode="decimal" value="40"></label>' +
      '<p class="svc-pt-ans" id="svc-pt-from-t"></p>' +
      '<div class="svc-pt-table" id="svc-pt-table"></div>';
    root.appendChild(card);
    card.querySelector("#svc-pt-x").onclick = function () { card.hidden = true; };
    card.querySelector("#svc-pt-p").oninput = paintPt;
    card.querySelector("#svc-pt-t").oninput = paintPt;
    const bar = card.querySelector("#svc-pt-bar");
    let press = false, sx = 0, sy = 0, ox = 0, oy = 0;
    bar.addEventListener("pointerdown", function (e) {
      if (e.target && e.target.id === "svc-pt-x") return;
      press = true;
      sx = e.clientX;
      sy = e.clientY;
      const r = card.getBoundingClientRect();
      ox = r.left;
      oy = r.top;
      card.style.right = "auto";
      card.style.bottom = "auto";
      try { bar.setPointerCapture(e.pointerId); } catch (_) {}
    });
    bar.addEventListener("pointermove", function (e) {
      if (!press) return;
      const w = card.offsetWidth || 280;
      const h = card.offsetHeight || 200;
      let x = ox + e.clientX - sx;
      let y = oy + e.clientY - sy;
      x = Math.max(8, Math.min(window.innerWidth - Math.min(w, window.innerWidth - 16) - 8, x));
      y = Math.max(8, Math.min(window.innerHeight - 48, y));
      card.style.left = x + "px";
      card.style.top = y + "px";
    });
    function up() { press = false; }
    bar.addEventListener("pointerup", up);
    bar.addEventListener("pointercancel", up);
  }

  function ensureDeathChrome() {
    if (!root) return;
    if (!root.querySelector("#svc-stage")) {
      const stage = document.createElement("div");
      stage.id = "svc-stage";
      stage.className = "svc-stage";
      stage.innerHTML = '<img id="svc-scene" alt="The unit on this call." src="call/gauges.jpg">';
      root.insertBefore(stage, root.firstChild);
    }
    if (!root.querySelector("#svc-died")) {
      const died = document.createElement("div");
      died.id = "svc-died";
      died.className = "svc-died";
      died.hidden = true;
      died.innerHTML = '<div class="svc-died-card"><p class="svc-died-k">YOU HAVE DIED BECAUSE</p><h3 id="svc-died-why"></h3><p class="svc-died-joke" id="svc-died-joke"></p><p class="svc-died-orn">—— ✦ ——</p></div>';
      root.appendChild(died);
    }
    if (!root.querySelector("#svc-died-go")) {
      const go = document.createElement("button");
      go.type = "button";
      go.id = "svc-died-go";
      go.className = "svc-died-go";
      go.hidden = true;
      go.textContent = "Turn the page";
      go.onclick = function () { closeDeath(); };
      root.appendChild(go);
    }
  }

  function ensureDeathStyle() {
    if (document.getElementById("svc-death-style")) return;
    const st = document.createElement("style");
    st.id = "svc-death-style";
    st.textContent = [
      "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');",
      "#screen-service.screen.active{display:flex!important;flex-direction:column!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;background:#07080c!important}",
      "#screen-service .bg-plate{display:none!important}",
      "#screen-service .svc-stage{flex:0 0 auto;width:auto;max-width:min(92vw,720px);margin:8px auto 0;height:auto;max-height:none;aspect-ratio:auto;border:4px solid #cbb892;background:#111;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center}",
      "#screen-service .svc-stage img{width:auto;height:auto;max-width:min(92vw,720px);max-height:42vh;object-fit:contain;object-position:center;image-rendering:pixelated;display:block;background:#111}",
      "#screen-service .svc-wrap{position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:min(100% - 16px,920px)!important;max-width:920px!important;max-height:none!important;flex:1 1 auto;min-height:0;margin:0 auto;overflow:auto}",
      "#screen-service.is-dead .svc-wrap{display:none!important}",
      "#screen-service.is-dead .svc-stage{width:min(92vw,640px);height:auto;max-height:none;aspect-ratio:16/10;margin:8px auto 0;overflow:hidden}",
      "#screen-service.is-dead .svc-stage img{width:100%;height:100%;max-height:none;object-fit:cover;object-position:center top;background:#07080c}",
      "#screen-service.is-dead{justify-content:center!important}",
      "#screen-service .svc-died{position:relative;left:auto;right:auto;bottom:auto;z-index:30;display:flex;justify-content:center;width:min(640px,calc(100% - 16px));margin:8px auto}",
      "#screen-service .svc-died[hidden]{display:none!important}",
      "#screen-service .svc-died-card{width:min(640px,100%);background:#100e0c;color:#f3ecdf;border:3px solid #6d5b3c;box-shadow:inset 0 0 0 2px #2a2318, 0 12px 30px rgba(0,0,0,.45);padding:16px 14px 12px;text-align:center}",
      "#screen-service .svc-died-k,#screen-service .svc-died-why,#screen-service #svc-died-why{font-family:'Press Start 2P',ui-monospace,monospace;letter-spacing:.5px;line-height:1.55;margin:0}",
      "#screen-service .svc-died-k{font-size:clamp(11px,2.8vw,16px);color:#f6f1e6}",
      "#screen-service #svc-died-why{font-size:clamp(13px,3.4vw,22px);color:#fff8ea;margin-top:10px}",
      "#screen-service .svc-died-joke{font-family:'Press Start 2P',ui-monospace,monospace;font-size:clamp(8px,2.1vw,11px);color:#e7c56a;line-height:1.65;margin:12px 0 0}",
      "#screen-service .svc-died-joke[hidden]{display:none!important}",
      "#screen-service .svc-died-orn{color:#8d7a58;margin:10px 0 0;letter-spacing:4px}",
      "#screen-service .svc-died-go{position:relative;left:auto;bottom:auto;transform:none;z-index:31;min-height:48px;margin:8px auto 12px;padding:10px 14px;border:2px solid #e6d7b0;background:#1a140e;color:#f6f1e6;font-family:'Press Start 2P',ui-monospace,monospace;font-size:10px;line-height:1.4;cursor:pointer;width:min(420px,calc(100% - 20px))}",
      "#screen-service .svc-died-go[hidden]{display:none!important}",
      "#screen-service .svc-pt{position:fixed;z-index:40;right:10px;bottom:10px;width:min(340px,calc(100% - 16px));max-height:min(68vh,520px);overflow:auto;background:#100e0c;color:#f6f1e6;border:3px solid #6d5b3c;box-shadow:0 12px 30px rgba(0,0,0,.5)}",
      "#screen-service .svc-pt[hidden]{display:none!important}",
      "#screen-service.is-dead .svc-pt{display:none!important}",
      "#screen-service .svc-pt-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px;cursor:grab;touch-action:none;background:#1a140e;position:sticky;top:0}",
      "#screen-service .svc-pt-bar strong{font-family:'Press Start 2P',ui-monospace,monospace;font-size:10px}",
      "#screen-service .svc-pt-x{min-height:36px;padding:6px 10px;background:#1a140e;color:#f6f1e6;border:2px solid #e6d7b0;cursor:pointer}",
      "#screen-service .svc-pt-refs{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px 0}",
      "#screen-service .svc-pt-refs button{min-height:32px;padding:4px 8px;border:1px solid #6d5b3c;background:#1a140e;color:#f6f1e6;cursor:pointer}",
      "#screen-service .svc-pt-refs button.on{background:#CE0034;border-color:#CE0034}",
      "#screen-service .svc-pt-note{margin:8px 10px 0;font-size:12px;line-height:1.35;color:#cbb892}",
      "#screen-service .svc-pt label{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px 0;font-size:13px}",
      "#screen-service .svc-pt input{width:108px;min-height:36px;font:inherit;background:#07080c;color:#fff;border:1px solid #6d5b3c;padding:4px 6px}",
      "#screen-service .svc-pt-ans{margin:2px 10px 0;font-weight:700;font-size:14px}",
      "#screen-service .svc-pt-table{max-height:160px;overflow:auto;margin:8px 10px 10px;border:1px solid #6d5b3c}",
      "#screen-service .svc-pt-table table{width:100%;border-collapse:collapse;font-size:13px}",
      "#screen-service .svc-pt-table th,#screen-service .svc-pt-table td{padding:3px 8px;text-align:right}",
      "#screen-service .svc-pt-table tr.on td{background:#3a2a12}",
      "@media (max-width:720px){#screen-service .svc-pt{left:8px;right:8px;width:auto;max-height:56vh}#screen-service .svc-nav{display:flex;flex-wrap:nowrap;gap:6px;padding-right:146px;box-sizing:border-box}#screen-service .svc-nav .btn{flex:1 1 0;min-width:0}body:has(#screen-service.active) .ld-replay{top:auto!important;bottom:12px!important;right:8px!important;left:auto!important;z-index:30!important}}",
      "@media (max-width:720px){#screen-service .svc-stage{height:auto;max-height:none;aspect-ratio:auto;overflow:hidden}#screen-service .svc-stage img{width:100%;height:auto;max-height:42vh;object-fit:contain;object-position:center}#screen-service.is-dead .svc-stage{width:min(92vw,640px);height:auto;max-height:none;aspect-ratio:16/10}#screen-service .svc-quote{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}#screen-service .svc-vitals{max-height:2.4em;overflow:hidden}#screen-service .spicy-toggle{display:none}#screen-service .svc-card{padding:8px 10px}#screen-service .svc-choice{min-height:42px;padding:6px 8px}}",
      "@media (max-height:820px) and (min-width:721px){#screen-service .svc-stage{height:auto;max-height:none;aspect-ratio:auto;width:auto}#screen-service .svc-stage img{max-height:40vh;max-width:min(92vw,640px);width:auto;height:auto;object-fit:contain;object-position:center}#screen-service.is-dead .svc-stage{width:min(92vw,640px);height:auto;max-height:none;aspect-ratio:16/10}}",
      "@media (max-width:720px){body:has(#screen-service.active) #toast-host{top:8px!important;bottom:auto!important;left:auto!important;right:8px!important;width:min(132px,40vw)!important;max-height:32px!important;overflow:hidden!important;z-index:28!important;pointer-events:none!important}body:has(#screen-service.active) .ld-replay{top:8px!important;bottom:auto!important;right:auto!important;left:8px!important;max-width:112px!important;z-index:30!important}#screen-service .svc-nav{padding-right:0!important}#screen-service .svc-feedback{padding-bottom:4px}}",
      "@media (min-width:721px){body:has(#screen-service.active) .ld-replay{right:156px!important;bottom:16px!important;top:auto!important;left:auto!important;z-index:30!important}}",
      "@media (orientation:landscape) and (max-height:500px){#screen-service.screen.active{display:flex!important;flex-direction:row!important;align-items:stretch!important;overflow:hidden!important;height:100dvh!important;max-height:100dvh!important;gap:6px!important;padding:4px!important;box-sizing:border-box!important}#screen-service .svc-stage{flex:1 1 52%!important;width:auto!important;height:auto!important;max-height:100%!important;min-height:0!important;aspect-ratio:auto!important;margin:0!important;align-self:stretch!important}#screen-service .svc-stage img{width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important}#screen-service .svc-wrap{flex:0 1 46%!important;width:46%!important;max-width:46%!important;height:auto!important;max-height:100%!important;min-height:0!important;overflow-y:auto!important;position:relative!important;inset:auto!important}#screen-service .svc-quote{display:-webkit-box!important;-webkit-line-clamp:1!important;-webkit-box-orient:vertical!important;overflow:hidden!important;max-height:1.4em!important}#screen-service .svc-vitals{display:none!important}#screen-service .svc-card{padding:4px 8px!important}body:has(#screen-service.active) .ld-replay{top:4px!important;right:8px!important;bottom:auto!important;left:auto!important;max-width:112px!important;max-height:28px!important}body:has(#screen-service.active) #hub-ai-fab{top:4px!important;right:128px!important;bottom:auto!important;left:auto!important;max-height:28px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(st);
  }

  function ensureStyle() {
    ensureDeathStyle();
    if (document.getElementById("svc-compact-style")) return;
    const st = document.createElement("style");
    st.id = "svc-compact-style";
    st.textContent =
      "#screen-service .bg-plate{opacity:.28}" +
      "#screen-service .svc-wrap{position:absolute;right:12px;bottom:12px;left:auto;top:auto;width:min(400px,calc(100% - 24px));max-width:400px;max-height:min(68vh,520px);margin:0;padding:8px;overflow:auto;z-index:6}" +
      "#screen-service .svc-wrap.is-moved{left:var(--svc-x)!important;top:var(--svc-y)!important;right:auto!important;bottom:auto!important}" +
      "#screen-service .svc-top{cursor:grab;touch-action:none}" +
      "#screen-service .svc-card{padding:12px 14px}" +
      "#screen-service .svc-quote{font-size:13px;line-height:1.35;max-height:4.6em;overflow:auto;padding:8px 10px;margin:0 0 8px}" +
      "#screen-service .svc-choice{display:flex;align-items:flex-start;gap:8px;text-align:left}" +
      "#screen-service .svc-key{flex:0 0 1.2em;font-weight:800;color:#CE0034}" +
      "#screen-service .svc-walk{margin:8px 0 0;padding:8px 10px;border:1px solid #6d5b3c;background:#14110e}" +
      "#screen-service .svc-walk p{margin:0 0 8px;font-size:14px;line-height:1.4}" +
      "#screen-service #svc-walk-next{min-height:42px}" +
      "#screen-service .svc-prompt{font-size:14px;margin-bottom:6px}" +
      "#screen-service .svc-top{margin-bottom:6px}" +
      "#screen-service .svc-avatar{width:36px;height:36px;font-size:18px}" +
      "#screen-service.svc-min{background:transparent!important;pointer-events:none;z-index:260!important}" +
      "#screen-service.svc-min .bg-plate,#screen-service.svc-min .svc-wrap{display:none!important}" +
      "#screen-service .svc-qbar{display:none;pointer-events:auto;position:absolute;right:12px;bottom:12px;z-index:8;border:0;border-radius:999px;padding:10px 16px;background:#CE0034;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,.35)}" +
      "#screen-service.svc-min .svc-qbar{display:inline-flex}" +
      "#svc-min{border:1px solid rgba(255,255,255,.25);background:rgba(20,28,36,.92);color:#fff;border-radius:999px;padding:6px 10px;cursor:pointer;font:inherit;font-size:12px}" +
      "@media (max-width:720px){" +
      "#screen-service .svc-stage{height:168px!important;max-height:168px!important;min-height:0!important;width:min(92vw,720px)!important;margin:4px auto 0!important;overflow:hidden!important;background:#111!important}" +
      "#screen-service .svc-stage img{width:100%!important;height:100%!important;max-height:none!important;object-fit:contain!important;object-position:center!important;background:#111!important}" +
      "#screen-service .svc-wrap{position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:min(100% - 12px,920px)!important;max-width:none!important;max-height:none!important;flex:1 1 auto!important;min-height:0!important;margin:0 auto!important;z-index:2!important;padding-bottom:8px!important}" +
      "body:has(#screen-service.active) #drip-ear,body:has(#screen-call.active) #drip-ear{display:none!important}" +
      "body:has(#screen-service.active) #form-badge,body:has(#screen-call.active) #form-badge{display:none!important}" +
      "body:has(#screen-service.active) .ld-replay,body:has(#screen-call.active) .ld-replay{top:8px!important;bottom:auto!important;left:8px!important;right:auto!important;max-width:120px!important;z-index:35!important}" +
      "}";
    (document.head || document.documentElement).appendChild(st);
  }

  function setMin(on) {
    minimized = !!on;
    if (root) root.classList.toggle("svc-min", minimized);
    const bar = root && root.querySelector("#svc-qbar");
    if (bar) bar.hidden = !minimized;
  }

  function ensureMin() {
    if (!root || root.querySelector("#svc-min")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "svc-min";
    btn.textContent = "Minimize";
    btn.onclick = function () { setMin(true); };
    const meters = root.querySelector(".svc-meters") || root.querySelector(".svc-top") || root.querySelector(".svc-card");
    if (meters) meters.appendChild(btn);
    const bar = document.createElement("button");
    bar.type = "button";
    bar.id = "svc-qbar";
    bar.className = "svc-qbar";
    bar.textContent = "Question";
    bar.hidden = !minimized;
    bar.onclick = function () { setMin(false); };
    root.appendChild(bar);
    bindSvcDrag();
  }

  function bindSvcDrag() {
    if (!root || root._svcDrag) return;
    const wrap = root.querySelector(".svc-wrap");
    const handle = root.querySelector(".svc-top");
    if (!wrap || !handle) return;
    root._svcDrag = true;
    let press = false, sx = 0, sy = 0, ox = 0, oy = 0;
    handle.addEventListener("pointerdown", function (e) {
      if (e.target.closest && e.target.closest("button")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      press = true;
      const r = wrap.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      ox = r.left;
      oy = r.top;
      try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    });
    handle.addEventListener("pointermove", function (e) {
      if (!press) return;
      const w = wrap.offsetWidth || 280;
      let x = ox + e.clientX - sx;
      let y = oy + e.clientY - sy;
      x = Math.max(8, Math.min(window.innerWidth - Math.min(w, window.innerWidth - 16) - 8, x));
      y = Math.max(8, Math.min(window.innerHeight - 64, y));
      wrap.classList.add("is-moved");
      wrap.style.setProperty("--svc-x", x + "px");
      wrap.style.setProperty("--svc-y", y + "px");
    });
    function up() { press = false; }
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  }

  function txt(sel, value) {
    const n = root && root.querySelector(sel);
    if (n && value != null) n.textContent = value;
    return n;
  }

  function render() {
    if (!root) return;
    ensureDeathChrome();
    ensurePtCard();
    ensureStyle();
    ensureMin();
    const scene = root.querySelector("#svc-scene");
    if (scene) {
      const pic = (deck[callI] && deck[callI].scene) || "call/gauges.jpg";
      if (scene.getAttribute("src") !== pic) scene.src = pic;
    }
    if (!deathOpen) root.classList.remove("is-dead");
    if (root) root.classList.toggle("svc-min", minimized);
    const fb = root.querySelector("#svc-feedback");
    if (fb) {
      fb.textContent = "";
      fb.className = "svc-feedback";
    }
    txt("#svc-score", "Call " + Math.min(callI + 1, deck.length || CALLS.length) + " / " + (deck.length || CALLS.length));
    txt("#svc-rating", starsStr(stars));

    if (callI >= deck.length) {
      deck.push(randomCall(deck.length ? deck[deck.length - 1].jobId : ""));
    }

    const c = deck[callI];
    if (!c) return;
    txt("#svc-eyebrow", extraSpicy ? "Service call · Extra spicy" : spicy ? "Service call · Spicy" : "Dispatch · live system");
    txt("#svc-title", hooked ? "Gauges on" : "On site");
    txt("#svc-avatar", c.avatar);
    txt("#svc-name", c.name);
    txt("#svc-job", c.job);
    txt("#svc-quote", "“" + quoteOf(c) + "”");
    txt("#svc-vitals", hooked
      ? "System is live. Read SH/SC, then lock the call."
      : (c.vitals || "Read the complaint. Lock the call."));
    txt("#svc-prompt", c.prompt || "What's the honest call?");

    const box = root.querySelector("#svc-choices");
    if (!box) return;
    box.innerHTML = "";
    var letters = ["A", "B", "C", "D", "E"];
    choiceOrder(c).forEach(function (ch, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "svc-choice";
      const key = document.createElement("span");
      key.className = "svc-key";
      key.textContent = letters[i] || "";
      const lab = document.createElement("span");
      lab.textContent = ch.t;
      b.appendChild(key);
      b.appendChild(lab);
      b.onclick = function () {
        if (locked) return;
        locked = true;
        grade(!!ch.ok);
        if (ch.ok) {
          b.classList.add("correct");
          if (fb) {
            fb.className = "svc-feedback good";
            fb.textContent = replyOf(c, true);
          }
          if (hooks.onSfx) hooks.onSfx("win");
        } else {
          b.classList.add("wrong");
          if (fb) {
            fb.className = "svc-feedback bad";
            fb.textContent = replyOf(c, false);
          }
          if (hooks.onSfx) hooks.onSfx("miss");
        }
        box.querySelectorAll("button").forEach(function (btn) { btn.disabled = true; });
        if (ch.die) {
          showDeath(ch.die, ch.kicker, ch.scene || c.scene, ch.pos || c.scenePos, ch.joke);
          return;
        }
        if (ch.ok) {
          const ambush = lastTechCard();
          if (ambush) {
            showDeath(ambush.die, "YOU HAVE DIED BECAUSE", ambush.scene, ambush.pos, ambush.joke);
            return;
          }
        }
        setTimeout(function () {
          callI++;
          locked = false;
          render();
        }, 1100);
      };
      box.appendChild(b);
    });
    const hookBtn = document.createElement("button");
    hookBtn.type = "button";
    hookBtn.className = "svc-choice svc-hook";
    hookBtn.textContent = hooked ? "Back to the live system" : "Hook gauges on the system";
    hookBtn.onclick = function () {
      hooked = true;
      if (hooks.onHook) hooks.onHook(c);
    };
    box.appendChild(hookBtn);
    var oldWalk = root.querySelector("#svc-walk");
    if (oldWalk) oldWalk.remove();
  }

  function start(host, opts) {
    root = host;
    if (!root) {
      return { stop: function () {}, current: current, adopt: adopt, grade: grade, randomCall: randomCall, setSpicy: function () {} };
    }
    hooks = opts || {};
    landTurn("screen-service");
    callI = 0;
    safeSinceDeath = 0;
    lastTechI = 0;
    callRight = 0;
    locked = false;
    hooked = false;
    stars = 5;
    extraSpicy = !!(opts && (opts.extraSpicy || opts.roastLevel >= 3));
    spicy = extraSpicy || !!(opts && opts.spicy) || (opts && opts.roastLevel >= 2);
    if (typeof (opts && opts.roastLevel) === "number") {
      extraSpicy = opts.roastLevel >= 3;
      spicy = opts.roastLevel >= 2;
    }
    deck = [randomCall("")];
    if (!deck.some(function (c) { return c && c.jobId === "float"; })) {
      deck.push({
        name: "Dana · Basement",
        avatar: "💧",
        job: "Lennox SL25XCV · pan full · float switch open · no cool",
        jobId: "float",
        vitals: "Y open at the float · Pan full · System never started",
        quote: {
          pro: "It died after the pan filled. Can you jumper it so we have air tonight?",
          spicy: "Jump that float. I will deal with the ceiling later.",
          extra: "Bypass the float. I want cold air more than I want a dry ceiling.",
        },
        prompt: "Condensate float is open. Safe next move?",
        choices: [
          { t: "Kill power, clear the drain, leave the float in the circuit", ok: true },
          { t: "Jump the float switch so the customer has cool air tonight", ok: false },
          { t: "Add gas — it must be low if it will not run", ok: false },
          { t: "Wire-nut the float and the overflow switch out of the circuit", ok: false },
        ],
        why: {
          ok: "The float did its job. Find the water. Meter it if you need to. Do not jump it.",
          bad: "You jumped a float. That's the ceiling callback you just bought.",
        },
        reply: {
          pro: { ok: "Drain is moving. Thank you for not flooding us.", bad: "The ceiling is wet now." },
          spicy: { ok: "Fine. Dry ceiling, cold air.", bad: "You jumped it. The drywall is a sponge." },
          extra: { ok: "You left the float in. I respect that.", bad: "That jumper just bought you a callback and a stain." },
        },
      });
    }
    if (jobsPool().length < 2) deck = shuffle(CALLS);
    var injuryIds = { "inj-ladder": 1, "inj-roof": 1, "inj-cap": 1, "inj-phos": 1, "inj-o2": 1, "inj-co": 1, "inj-attic": 1, "inj-fan": 1, "inj-frost": 1, "inj-back": 1, "inj-hose": 1, "inj-foot": 1, "inj-heat": 1, "inj-scald": 1, "inj-ears": 1 };
    deck = funnyCalls().concat([bypassCall()]).concat(ppeCalls()).concat(injuryCalls()).concat(deck.filter(function (c) {
      var id = c && c.jobId;
      return id && id !== "bypass-disc" && id !== "ppe-eyes" && id !== "ppe-chem" && id !== "ppe-burn" && !injuryIds[id];
    }));

    // ensure structure exists (in case host is empty root)
    if (!root.querySelector("#svc-choices")) {
      root.innerHTML =
        '<div class="svc-wrap"><header class="svc-top"><div><p class="eyebrow" id="svc-eyebrow">Service call</p><h2 id="svc-title">Dispatch</h2></div><div class="svc-meters"><span id="svc-score">Call 0</span><span id="svc-rating"></span></div></header>' +
        '<div class="svc-card"><div class="svc-customer"><div class="svc-avatar" id="svc-avatar"></div><div><p class="svc-name" id="svc-name"></p><p class="svc-job" id="svc-job"></p></div></div>' +
        '<blockquote class="svc-quote" id="svc-quote"></blockquote><div class="svc-vitals" id="svc-vitals"></div><p class="svc-prompt" id="svc-prompt"></p>' +
        '<div id="svc-choices" class="svc-choices"></div><p id="svc-feedback" class="svc-feedback"></p>' +
        '<div class="svc-nav"><button class="btn" id="btn-svc-hub" type="button">Shop floor</button></div></div></div>';
    }

    const roastEl = document.getElementById("svc-roast");
    if (roastEl) {
      roastEl.value = String(heat());
      roastEl.oninput = () => {
        const v = +roastEl.value;
        extraSpicy = v >= 3;
        spicy = v >= 2;
        if (hooks.onRoast) hooks.onRoast(v);
        if (hooks.onSpicy) hooks.onSpicy(spicy);
        if (hooks.onExtra) hooks.onExtra(extraSpicy);
        render();
      };
    }

    const hub = document.getElementById("btn-svc-hub");
    if (hub) hub.onclick = function () { if (hooks.onHub) hooks.onHub(); };

    ensureStyle();
    ensureMin();
    render();
    return {
      stop() {},
      current: current,
      adopt: adopt,
      grade: grade,
      randomCall: randomCall,
      setSpicy(v) {
        spicy = !!v;
        render();
      },
    };
  }

  global.ServiceCalls = {
    start: start,
    CALLS: CALLS,
    forJob: forJob,
    randomCall: randomCall,
    walkFor: walkFor,
    unitFor: unitFor,
    DIFF_POOLS: DIFF_POOLS,
    currentDiff: currentDiff,
  };

  /* Phone HUB chip and the PHONE badge were sitting on the answer row. */
  if (!document.getElementById("svc-phone-park")) {
    var park = document.createElement("style");
    park.id = "svc-phone-park";
    park.textContent = "@media (max-width:720px){body:has(#screen-call.active) #drip-ear,body:has(#screen-service.active) #drip-ear{display:none!important}body:has(#screen-call.active) #form-badge,body:has(#screen-service.active) #form-badge{display:none!important}body:has(#screen-call.active) .ld-replay,body:has(#screen-service.active) .ld-replay{top:8px!important;bottom:auto!important;left:8px!important;right:auto!important;max-width:120px!important;z-index:35!important}body:has(#screen-call.active) #call-root .call-photo{max-height:120px!important}}";
    document.head.appendChild(park);
  }
})(window);
