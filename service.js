/* HVAC Legends — Service Calls
   Real job scenarios + optional Spicy customer dialogue.
   Designed to feel less clunky than dry quiz trainers. */
(function (global) {
  "use strict";

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
        { t: "Light a match to check for gas", ok: false },
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
    if (heat() >= 2 && c.quote.extra) return c.quote.extra;
    if (heat() >= 1 && c.quote.spicy) return c.quote.spicy;
    return c.quote.pro;
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
    let a = shuffle(choices);
    let n = 0;
    while (a[0] && a[0].ok && a.length > 1 && n++ < 12) a = shuffle(choices);
    if (a[0] && a[0].ok && a.length > 1) {
      const j = 1 + ((Math.random() * (a.length - 1)) | 0);
      const tmp = a[0];
      a[0] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function ensureStyle() {
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
      "#screen-service .svc-choice{padding:8px 10px;font-size:13px}" +
      "#screen-service .svc-prompt{font-size:14px;margin-bottom:6px}" +
      "#screen-service .svc-top{margin-bottom:6px}" +
      "#screen-service .svc-avatar{width:36px;height:36px;font-size:18px}" +
      "#screen-service.svc-min{background:transparent!important;pointer-events:none;z-index:260!important}" +
      "#screen-service.svc-min .bg-plate,#screen-service.svc-min .svc-wrap{display:none!important}" +
      "#screen-service .svc-qbar{display:none;pointer-events:auto;position:absolute;right:12px;bottom:12px;z-index:8;border:0;border-radius:999px;padding:10px 16px;background:#CE0034;color:#fff;font-weight:700;cursor:pointer;box-shadow:0 8px 18px rgba(0,0,0,.35)}" +
      "#screen-service.svc-min .svc-qbar{display:inline-flex}" +
      "#svc-min{border:1px solid rgba(255,255,255,.25);background:rgba(20,28,36,.92);color:#fff;border-radius:999px;padding:6px 10px;cursor:pointer;font:inherit;font-size:12px}";
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
    ensureStyle();
    ensureMin();
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
    mixChoices(c.choices || []).forEach(function (ch) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "svc-choice";
      b.textContent = ch.t;
      b.onclick = function () {
        if (locked) return;
        locked = true;
        grade(!!ch.ok);
        if (ch.ok) {
          b.classList.add("correct");
          if (fb) {
            fb.className = "svc-feedback good";
            fb.innerHTML = "<strong>Correct.</strong> " + ((c.why && c.why.ok) || "") +
              "<br/><em>" + replyOf(c, true) + "</em>";
          }
          if (hooks.onSfx) hooks.onSfx("win");
        } else {
          b.classList.add("wrong");
          const right = (c.choices || []).find(function (x) { return x.ok; });
          let bad = (c.why && c.why.bad) || "Wrong move.";
          if (bad.toLowerCase().indexOf("callback") < 0) bad += " That's the callback you just bought.";
          if (fb) {
            fb.className = "svc-feedback bad";
            fb.innerHTML = "<strong>Not the best call.</strong> " + bad +
              (right ? "<br/><strong>Better:</strong> " + right.t : "") +
              "<br/><em>" + replyOf(c, false) + "</em>";
          }
          if (hooks.onSfx) hooks.onSfx("miss");
        }
        box.querySelectorAll("button").forEach(function (btn) { btn.disabled = true; });
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
  }

  function start(host, opts) {
    root = host;
    if (!root) {
      return { stop: function () {}, current: current, adopt: adopt, grade: grade, randomCall: randomCall, setSpicy: function () {} };
    }
    hooks = opts || {};
    callI = 0;
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
    DIFF_POOLS: DIFF_POOLS,
    currentDiff: currentDiff,
  };
})(window);
