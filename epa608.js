/* EPA Section 608 tutor — shop law, not a dump of the question bank.
   Training aid. Official exam is an EPA-approved proctor. CFR / door card wins. */
(function (global) {
  "use strict";

  const KEY = "lt-e608-tutor-v1";

  const SECTIONS = [
    { id: "core", n: "0", name: "Core", blurb: "Ozone, venting, three R's, cylinders. Required for every card." },
    { id: "type1", n: "I", name: "Type I", blurb: "Factory-sealed, ≤5 lb. Windows, PTAC, fridge." },
    { id: "type2", n: "II", name: "Type II", blurb: "Splits, RTUs, racks. The HVAC card. 0\" or 10\" Hg." },
    { id: "type3", n: "III", name: "Type III", blurb: "Low-pressure chillers. 25 mm Hg absolute." },
  ];

  const LESSONS = {
    core: [
      {
        title: "The four cards + Core",
        hub: "Core is the law paper. Fail Core, you fail the cert. Core alone does not let you open a box.",
        body: `
          <p>608 is the <strong>appliance</strong>, not the jug. Same R-410A in a window unit is Type I. In a split it is Type II.</p>
          <table class="e608-table">
            <tr><th>Cert</th><th>What you can open</th></tr>
            <tr><td>Core</td><td>Nothing by itself</td></tr>
            <tr><td>Type I</td><td>Small appliances</td></tr>
            <tr><td>Type II</td><td>High / very-high pressure (splits, racks)</td></tr>
            <tr><td>Type III</td><td>Low-pressure chillers</td></tr>
            <tr><td>Universal</td><td>Core + I + II + III</td></tr>
          </table>
          <p><strong>609</strong> is cars. Different law. 608 does not expire. Universal Core must be <strong>proctored</strong> — open-book Core does not stack.</p>
          <p>Typical paper: 25 questions a section, 18/25 (72%) proctored.</p>`,
      },
      {
        title: "Ozone and the families",
        hub: "Chlorine eats ozone. HFCs do not. HFCs still heat the planet. Memorize the pattern, not the formula.",
        body: `
          <table class="e608-table">
            <tr><th>Family</th><th>Cl?</th><th>ODP</th><th>Shop gas</th></tr>
            <tr><td>CFC</td><td>Yes</td><td>Highest</td><td>R-12, R-11, R-502</td></tr>
            <tr><td>HCFC</td><td>Yes</td><td>Lower</td><td><strong>R-22</strong>, R-123</td></tr>
            <tr><td>HFC</td><td>No</td><td>Zero</td><td>R-134a, R-410A, R-32</td></tr>
            <tr><td>HFO</td><td>No</td><td>Zero</td><td>R-1234yf / ze</td></tr>
          </table>
          <p>One chlorine atom can knock out on the order of <strong>100,000</strong> ozone molecules. Montreal Protocol (1987) is the treaty. Clean Air Act <strong>Section 608</strong> is you, the tech.</p>`,
      },
      {
        title: "Don't vent. Dates. Penalty. Sales.",
        hub: "De minimis is a good-faith recovery with certified gear — not opening a system and walking away.",
        body: `
          <table class="e608-table">
            <tr><th>Date</th><th>Rule</th></tr>
            <tr><td><strong>July 1, 1992</strong></td><td>Illegal to vent CFC and HCFC</td></tr>
            <tr><td><strong>Nov 15, 1995</strong></td><td>Illegal to vent HFC / non-exempt substitutes</td></tr>
          </table>
          <p>The civil penalty is inflation-indexed under 40 CFR Part 19 and can be tens of thousands of dollars per day, per violation. Don't memorize an old dollar figure.</p>
          <p>To <strong>buy</strong> regulated refrigerant you need the 608 card. Wholesaler can ask.</p>
          <p>Exempt examples (listed uses): CO₂, nitrogen. That is not an excuse to blow 410A.</p>`,
      },
      {
        title: "The three R's",
        hub: "Recovered gas goes back in that system or another box the same owner has. Different customer = reclaim.",
        body: `
          <table class="e608-table">
            <tr><th>Word</th><th>What it is</th><th>Sell to a new owner?</th></tr>
            <tr><td><strong>Recover</strong></td><td>Take it out into a cylinder</td><td>No</td></tr>
            <tr><td><strong>Recycle</strong></td><td>Clean on the truck (oil sep + filter-drier)</td><td>No — same owner</td></tr>
            <tr><td><strong>Reclaim</strong></td><td>Off-site plant, <strong>AHRI 700</strong></td><td>Yes</td></tr>
          </table>
          <p><strong>Self-contained</strong> recovery has its own compressor. <strong>System-dependent (passive)</strong> uses the appliance compressor — <em>Type I only</em>.</p>`,
      },
      {
        title: "Cylinders, 80%, oils",
        hub: "Gray body, yellow top. Weigh it. Never refill a disposable. There is no drop-in.",
        body: `
          <ul class="e608-ul">
            <li>Recovery bottle: <strong>gray with yellow top</strong>, DOT refillable.</li>
            <li>Fill to <strong>80% by weight</strong> — vapor space so it doesn't hydro-lock in a hot truck.</li>
            <li>Disposable (DOT 39): recover the heel, kill the valve, scrap. Never recover into it.</li>
            <li>Hydrotest refillables typically <strong>every 5 years</strong>.</li>
            <li>Never mix refrigerants in one recovery bottle.</li>
          </ul>
          <p>HFC (R-134a / 410A) typically wants <strong>POE</strong>. CFC mineral oil does not drop in. Blends <strong>fractionate</strong> — you can't top off forever.</p>
          <p>Leak test with <strong>dry nitrogen</strong>. Never oxygen. Never shop air. Oil + O₂ is a bomb.</p>`,
      },
    ],
    type1: [
      {
        title: "The 5-pound rule",
        hub: "Both must be true: factory hermetic AND manufactured charge ≤ 5 lb. Nameplate, not what some animal stuffed in later.",
        body: `
          <p><strong>In:</strong> household fridge/freezer, window AC, PTAC, dehumidifier, vending, water cooler.</p>
          <p><strong>Out:</strong> any split, any 3-ton package, any walk-in. Those are Type II even at 6 lb.</p>
          <p>A 3 lb window box overcharged to 6 lb in the field is still Type I.</p>`,
      },
      {
        title: "90 / 80 or 4 inches",
        hub: "A running compressor helps push gas out, so the bar is higher. Dead compressor, they cut you slack — still not 'vent it.'",
        body: `
          <p>Post–Nov 15, 1993 recovery machine:</p>
          <table class="e608-table">
            <tr><th>Compressor</th><th>Recover at least</th></tr>
            <tr><td>Running</td><td><strong>90%</strong> of the charge <em>or</em> <strong>4" Hg</strong></td></tr>
            <tr><td>Dead</td><td><strong>80%</strong> <em>or</em> <strong>4" Hg</strong></td></tr>
          </table>
          <p>Passive (system-dependent) recovery is <strong>Type I only</strong>. Don't ride a split's compressor to empty it.</p>
          <p>Piercing valve is a Type I tool. Don't leave it on as a permanent port.</p>`,
      },
    ],
    type2: [
      {
        title: "This is the HVAC card",
        hub: "House splits, heat pumps, RTUs, racks. Not a window box. Not an R-123 chiller.",
        body: `
          <p>EPA buckets by <strong>liquid sat pressure at 104°F</strong>, not by 'it feels high.'</p>
          <table class="e608-table">
            <tr><th>Bucket</th><th>Shop gas</th></tr>
            <tr><td>Very high</td><td>R-13, R-23, R-503</td></tr>
            <tr><td><strong>High</strong></td><td><strong>R-22, R-407C, R-410A, R-502</strong></td></tr>
            <tr><td>Medium</td><td>R-12, R-134a, R-500</td></tr>
            <tr><td>Low (Type III)</td><td>R-11, R-123</td></tr>
          </table>
          <p>R-410A is <strong>high-pressure</strong> on that cut, not very-high.</p>`,
      },
      {
        title: "Recovery vacuum table",
        hub: "This is 608 recovery — how empty before you open. It is NOT the 500-micron dehydration pull after you braze.",
        body: `
          <p>Inches of Hg vacuum. Date is the <strong>recovery machine</strong>, not the condensing unit. Today's truck is post-1993.</p>
          <table class="e608-table">
            <tr><th>Appliance</th><th>Charge</th><th>Pre-1993</th><th>Post-1993</th></tr>
            <tr><td>Very high</td><td>any</td><td>0"</td><td>0"</td></tr>
            <tr><td>High</td><td>< 200 lb</td><td>0"</td><td><strong>0"</strong></td></tr>
            <tr><td>High</td><td>≥ 200 lb</td><td>4"</td><td><strong>10"</strong></td></tr>
            <tr><td>Medium</td><td>< 200 lb</td><td>4"</td><td>10"</td></tr>
            <tr><td>Medium</td><td>≥ 200 lb</td><td>4"</td><td><strong>15"</strong></td></tr>
          </table>
          <p><strong>0" vacuum = 0 psig = atmospheric.</strong> You did not pull a vacuum. That is the #1 trick.</p>
          <div class="e608-calc" id="e608-vac">
            <p class="eyebrow">Run the table</p>
            <label>Appliance
              <select id="vac-kind">
                <option value="vh">Very high-pressure</option>
                <option value="hi" selected>High-pressure (R-22 / 410A)</option>
                <option value="med">Medium-pressure (R-134a)</option>
              </select>
            </label>
            <label>Full charge
              <select id="vac-lbs">
                <option value="under" selected>Less than 200 lb</option>
                <option value="over">200 lb or more</option>
              </select>
            </label>
            <label>Recovery machine
              <select id="vac-year">
                <option value="post" selected>On/after Nov 15, 1993</option>
                <option value="pre">Before Nov 15, 1993</option>
              </select>
            </label>
            <p class="e608-vac-out" id="vac-out">0" Hg (0 psig)</p>
          </div>
          <p>House 3-ton 410A, modern machine: <strong>0 psig</strong>. 250 lb R-22 rack, modern machine: <strong>10" Hg</strong>. 300 lb R-134a: <strong>15"</strong> — 15" is medium, not 'the big high-pressure one.'</p>`,
      },
      {
        title: "Leaks, isolation, exceptions",
        hub: "The inches are measured on the system after the machine is off and the needle settles. Not while it's still sucking.",
        body: `
          <ul class="e608-ul">
            <li>You may recover an <strong>isolated component</strong> if you can valve it off. Charge size is then that piece.</li>
            <li>Leaking so bad you cannot hit the number: recover what you can and <strong>document</strong> why you stopped. Not 'I got bored.'</li>
            <li>Non-major repair that will not open to atmosphere: medium/high/very-high only need <strong>0 psig</strong>.</li>
            <li>AIM leak-repair (owner's duty) generally starts at <strong>15 lb</strong> HFC charge. Comfort cooling threshold <strong>10%</strong>, commercial refrigeration <strong>20%</strong>, IPR <strong>30%</strong>.</li>
          </ul>
          <p>Hitting 0 psig on a 2-ton <strong>satisfies 608</strong>. It does not dry the system. Microns are a different pump.</p>`,
      },
    ],
    type3: [
      {
        title: "Low-pressure chillers",
        hub: "The evaporator often sits in a vacuum. Air leaks in. That's why old CFC/HCFC machines have a purge.",
        body: `
          <p>Type III: centrifugal / low-pressure. R-11, R-123, R-1233zd class. Most residential shops never need this. Universal covers you if a plant calls.</p>
          <p><strong>Recovery depends on the machine date.</strong> Gear built before November 15, 1993: 25 inches of mercury vacuum. Gear built on or after that date: 25 mm Hg absolute, about 29 inches of vacuum. Do not swap the units.</p>
          <ul class="e608-ul">
            <li>Leak check with <strong>dry nitrogen</strong>. Never oxygen.</li>
            <li>Rupture disc on the vessel, typically around 15 psig.</li>
            <li>Pressurize for leak check with controlled heat / warm water — not a nitrogen blast you'll purge with refrigerant.</li>
          </ul>`,
      },
    ],
  };

  const DRILLS = {
    core: [
      { q: "Before opening a system that contains refrigerant you must:", choices: ["Vent carefully", "Recover the refrigerant", "Add nitrogen until empty", "Pump down and walk away"], a: 1, why: "608 requires recovery before opening. Venting is illegal." },
      { q: "R-22 is which family?", choices: ["CFC", "HCFC", "HFC", "HFO"], a: 1, why: "R-22 is an HCFC. R-12 is CFC. R-134a / 410A are HFC." },
      { q: "Venting CFCs and HCFCs became illegal on:", choices: ["Jan 1, 1987", "July 1, 1992", "Nov 15, 1995", "Jan 1, 2010"], a: 1, why: "July 1, 1992 for CFC/HCFC. Nov 15, 1995 added HFC/substitutes." },
      { q: "Venting HFCs (R-134a, R-410A) became illegal on:", choices: ["July 1, 1992", "Nov 15, 1995", "Jan 1, 2010", "It is still legal if you are certified"], a: 1, why: "Nov 15, 1995. Certified does not mean you can vent." },
      { q: "Recovered refrigerant can be sold to a new owner only after:", choices: ["Recycling on the truck", "Reclaim to AHRI 700", "Sitting 30 days", "Mixing with virgin"], a: 1, why: "Reclaim off-site to AHRI 700. Recycle stays with the same owner." },
      { q: "A recovery cylinder is filled to no more than about:", choices: ["100% liquid", "80% by weight", "Until the relief dumps", "Whatever fits"], a: 1, why: "80% by weight leaves vapor headspace. Weigh it." },
      { q: "A recovery cylinder is typically colored:", choices: ["All yellow", "Gray body, yellow top", "Green with a red stripe", "Whatever the wholesaler painted"], a: 1, why: "Gray with yellow top. DOT refillable. Not a disposable." },
      { q: "The three R's are:", choices: ["Recover, recycle, reclaim", "Repair, replace, recharge", "Recover, reclaim, destroy", "Reduce, reuse, vent"], a: 0, why: "Recover into a bottle. Recycle on the truck (same owner). Reclaim to AHRI 700 off-site." },
      { q: "Section 609 covers:", choices: ["House splits", "Motor vehicle air conditioning", "Low-pressure chillers", "The same as 608 Universal"], a: 1, why: "609 is cars. 608 is stationary appliances. Different card." },
      { q: "Disposable (DOT 39) cylinders:", choices: ["Are great recovery tanks", "Must never be used for recovery — recover the heel, disable, scrap", "Can be refilled once", "Are gray/yellow refillables"], a: 1, why: "Never recover into a disposable. Heel out, kill the valve, scrap." },
      { q: "A2L refrigerants (R-32, R-454B) require:", choices: ["A new Type IV 608 card", "They sit inside Core / Type II like other 608 gases — no Type IV", "Only a 609 card", "No certification"], a: 1, why: "There is no Type IV. Mildly flammable still 608. Extra shop safety is on you, not a new card." },
      { q: "Self-contained recovery equipment:", choices: ["Uses the appliance compressor", "Has its own compressor / pump", "Is Type I only", "Is illegal on 410A"], a: 1, why: "Self-contained has its own pump. System-dependent (passive) uses the box compressor — Type I only." },
      { q: "HFC oils are typically:", choices: ["Mineral oil, drop-in for R-22", "POE — hygroscopic, not a drop-in from CFC mineral", "Alkylbenzene only", "Whatever was in the jug"], a: 1, why: "POE for 134a / 410A. It drinks water. There is no drop-in." },
      { q: "Leak-test a sealed system with:", choices: ["Oxygen", "Shop air from the compressor", "Dry nitrogen", "More refrigerant until it hisses"], a: 2, why: "Dry nitrogen. Oxygen + oil is a bomb. Shop air is wet and oily." },
    ],
    type1: [
      { q: "Type I covers appliances that are:", choices: ["Any unit under 5 tons", "Factory hermetic with manufactured charge ≤ 5 lb", "Any split under 5 lb remaining", "MVAC on cars"], a: 1, why: "Both: factory sealed AND nameplate ≤ 5 lb. Remaining charge doesn't reclassify it." },
      { q: "A residential split with 6 lb of 410A is:", choices: ["Type I", "Type II", "Type III", "609"], a: 1, why: "Splits are Type II. Type I is factory-sealed small appliances." },
      { q: "Compressor running on a small appliance, post-1993 machine. Recover at least:", choices: ["50%", "80%", "90% or 4\" Hg", "10\" Hg"], a: 2, why: "90% if the compressor runs, or 4 inches Hg. 80% if the compressor is dead." },
      { q: "Compressor dead on a small appliance, post-1993. Recover at least:", choices: ["90% or 4\" Hg", "80% or 4\" Hg", "10\" Hg", "25 mm Hg abs"], a: 1, why: "Dead compressor: 80% of the charge or 4\" Hg." },
      { q: "System-dependent (passive) recovery is legal on:", choices: ["Type I only", "Type II splits", "Type III chillers", "Any 608 appliance"], a: 0, why: "Passive uses the appliance compressor. Type I only." },
      { q: "A piercing valve on a Type I box:", choices: ["Is a permanent service port", "Is a temporary access — don't leave it as the only port", "Replaces recovery", "Makes it Type II"], a: 1, why: "Pierce, recover, repair. A piercing valve left on leaks." },
      { q: "Which of these is Type I?", choices: ["3-ton 410A split", "Window AC with 4.5 lb nameplate", "Walk-in cooler", "R-123 chiller"], a: 1, why: "Window / PTAC / fridge / dehumidifier — factory hermetic ≤ 5 lb." },
      { q: "Passive recovery with a dead compressor on Type I needs:", choices: ["Only the suction line", "Access to both high and low sides", "A Type II machine", "No recovery — it's empty"], a: 1, why: "Dead compressor won't push. Open both sides or you leave a puddle." },
    ],
    type2: [
      { q: "House 3-ton 410A, modern recovery machine. Required recovery level:", choices: ["10\" Hg", "15\" Hg", "0\" (0 psig)", "25 mm Hg abs"], a: 2, why: "High-pressure, under 200 lb, post-1993 = 0 inches vacuum = 0 psig." },
      { q: "250 lb R-22 rack, recovery machine made in 2020. Pull to:", choices: ["0\"", "4\"", "10\" Hg", "15\" Hg"], a: 2, why: "High-pressure ≥ 200 lb, post-1993 = 10 inches Hg. 15\" is medium-pressure ≥ 200 lb." },
      { q: "0 inches of mercury vacuum means:", choices: ["Deep vacuum / 500 microns", "0 psig (atmospheric)", "29.9\" on the compound gauge", "25 mm Hg absolute"], a: 1, why: "0\" vacuum is atmospheric — 0 psig. Not a dehydration pull." },
      { q: "R-410A on the 104°F EPA cut is:", choices: ["Low-pressure", "Medium-pressure", "High-pressure", "Type I always"], a: 2, why: "R-410A is high-pressure. Very-high is R-13 / R-23 class." },
      { q: "R-134a on that same 104°F cut is:", choices: ["Low-pressure", "Medium-pressure", "Very-high", "Type III"], a: 1, why: "R-12 / R-134a class is medium. 15\" Hg is the ≥200 lb medium, post-1993 number." },
      { q: "AIM leak-repair for comfort cooling generally uses a threshold of:", choices: ["5%", "10%", "20%", "30%"], a: 1, why: "Comfort cooling 10%. Commercial refrigeration 20%. IPR 30%. Scope typically 15 lb+." },
      { q: "Commercial refrigeration AIM leak threshold is typically:", choices: ["10%", "15%", "20%", "50%"], a: 2, why: "Comfort cooling 10%. Commercial refrigeration 20%. Industrial process 30%." },
      { q: "Industrial process refrigeration (IPR) leak threshold is typically:", choices: ["10%", "20%", "30%", "No threshold"], a: 2, why: "IPR 30%. Comfort 10%. Commercial refrigeration 20%." },
      { q: "After you braze a 3-ton 410A, 608 recovery to 0 psig is:", choices: ["The same as 500 microns", "Enough to open the system legally — microns are a different pump", "Illegal — you must hit 10\" Hg", "Only for Type III"], a: 1, why: "0 psig satisfies 608 on a small high-pressure box. Dehydration is a vacuum pump and a micron gauge." },
      { q: "You can recover an isolated compressor if:", choices: ["You feel like it", "You can valve it off the rest of the system", "The owner says skip 608", "It's under 5 lb remaining"], a: 1, why: "Isolated component: charge size is that piece. Still recover it. Don't vent the rest." },
      { q: "Non-major repair that will not open a medium/high-pressure system to atmosphere needs:", choices: ["25 mm Hg abs", "10\" Hg always", "0 psig", "Nitrogen until 500 psig"], a: 2, why: "If you're not opening it to air, 0 psig on medium/high/very-high is the 608 bar." },
      { q: "Very-high-pressure appliances (R-13 / R-23 class) recover to:", choices: ["10\" Hg", "15\" Hg", "0\" (0 psig)", "25 mm Hg abs"], a: 2, why: "Very-high: 0\" Hg either side of the 1993 date." },
      { q: "Pre-1993 recovery machine, high-pressure, 250 lb. Pull to:", choices: ["0\"", "4\" Hg", "10\" Hg", "15\" Hg"], a: 1, why: "Old machine, high-pressure ≥ 200 lb = 4\". Today's truck is post-1993 = 10\"." },
      { q: "The 200 lb cut is based on:", choices: ["What is left in the system today", "The full nameplate charge of the appliance", "The recovery tank size", "Whatever the customer says"], a: 1, why: "Full charge on the nameplate — not the puddle you found." },
      { q: "A tech who will only work house splits should sit:", choices: ["Core only", "Type I only", "Core + Type II (Universal if they might see a chiller later)", "Type III only"], a: 2, why: "HVAC truck is Type II. Core is required. Universal is Core+I+II+III — worth it if they might work a plant." },
      { q: "The inches in the recovery table are read:", choices: ["While the machine is still pulling hard", "On the system after the machine is off and the needle settles", "On the micron gauge", "On the tank only"], a: 1, why: "Settle the gauge on the appliance. Don't cheat with a running pump." },
    ],
    type3: [
      { q: "Type III recovery target is:", choices: ["0 psig", "10\" Hg", "15\" Hg", "25 mm Hg absolute"], a: 3, why: "Low-pressure appliances: 25 mm Hg absolute, not 25 inches." },
      { q: "Type III equipment is typically:", choices: ["Window AC", "Residential 410A splits", "Low-pressure centrifugal chillers", "Car AC"], a: 2, why: "Chillers. R-11 / R-123 class. Splits are Type II." },
      { q: "Leak-test a low-pressure chiller with:", choices: ["Oxygen", "Shop air", "Dry nitrogen / controlled heat — stay under the rupture disc", "More refrigerant until it hisses"], a: 2, why: "Nitrogen or warm water / blankets. Do not exceed the rupture-disc rating (~15 psig)." },
      { q: "25 mm Hg absolute is about:", choices: ["25 inches on the compound gauge", "A deep vacuum near 29\" Hg — not 25 inches", "0 psig", "10\" Hg"], a: 1, why: "Millimeters of mercury absolute. Techs who read 25 inches fail this section." },
      { q: "If leaks keep you from hitting 25 mm Hg abs on a low-pressure box, you:", choices: ["Vent the rest and walk", "Recover as low as you can without contaminating the gas — not above 0 psig — and document", "Call 15 inches Hg good enough", "Pressurize it with oxygen"], a: 1, why: "Pull what you can without ruining the recovered refrigerant. That pressure cannot sit above 0 psig. A leak is not a license to vent." },
      { q: "A rupture disc on a low-pressure chiller is typically around:", choices: ["150 psig", "15 psig", "500 psig", "There is never a disc"], a: 1, why: "About 15 psig. That is why you do not nitrogen-blast a chiller like a 410A split." },
      { q: "Air leaks into a low-pressure chiller because:", choices: ["The evaporator often sits in a vacuum in operation", "R-123 is heavier than 410A", "Purge units push air in", "Type III machines run at 400 psig"], a: 0, why: "Evaporator in a vacuum. Air in. That's why old machines have a purge." },
      { q: "A purge unit on a low-pressure chiller:", choices: ["Is how you legally vent the charge", "Removes non-condensables (air) that leaked in", "Replaces recovery", "Makes it Type II"], a: 1, why: "Purge dumps a little refrigerant with the air — keep it maintained. It is not a license to vent the charge." },
    ],
  };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (_) {
      return {};
    }
  }
  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (_) {}
  }
  function prog() {
    const p = load();
    SECTIONS.forEach((s) => {
      if (!p[s.id]) p[s.id] = { lesson: 0, drillBest: 0, stamped: false };
    });
    return p;
  }

  function vacLevel(kind, lbs, year) {
    if (kind === "vh") return { n: 0, say: "0\" Hg (0 psig) — very-high never needs a deep 608 pull." };
    const over = lbs === "over";
    const post = year === "post";
    if (kind === "hi") {
      if (!over) return { n: 0, say: "0\" Hg (0 psig) — high-pressure under 200 lb." };
      return post
        ? { n: 10, say: "10\" Hg — high-pressure, 200 lb or more, modern machine." }
        : { n: 4, say: "4\" Hg — high-pressure, 200 lb or more, pre-1993 machine." };
    }
    if (!over) {
      return post
        ? { n: 10, say: "10\" Hg — medium-pressure under 200 lb, modern machine." }
        : { n: 4, say: "4\" Hg — medium-pressure, pre-1993 machine." };
    }
    return post
      ? { n: 15, say: "15\" Hg — medium-pressure, 200 lb or more. Not the high-pressure trap." }
      : { n: 4, say: "4\" Hg — medium-pressure, 200 lb or more, pre-1993 machine." };
  }

  function wireVac(host) {
    const box = host.querySelector("#e608-vac");
    if (!box) return;
    const out = host.querySelector("#vac-out");
    function paint() {
      const k = host.querySelector("#vac-kind").value;
      const l = host.querySelector("#vac-lbs").value;
      const y = host.querySelector("#vac-year").value;
      const r = vacLevel(k, l, y);
      out.textContent = r.say;
    }
    box.querySelectorAll("select").forEach((el) => {
      el.onchange = paint;
    });
    paint();
  }

  function printDrills(which) {
    var ids = which === "all" ? SECTIONS.map(function (s) { return s.id; }) : [which || "core"];
    var items = [];
    var titleBits = [];
    ids.forEach(function (id) {
      var sdef = SECTIONS.find(function (s) { return s.id === id; });
      titleBits.push(sdef ? sdef.name : id);
      (DRILLS[id] || []).forEach(function (d) {
        items.push({ q: (sdef ? "[" + sdef.name + "] " : "") + d.q, choices: d.choices, a: d.a, why: d.why });
      });
    });
    var title = "EPA 608 drills · " + titleBits.join(" / ");
    if (global.ShopSchool && global.ShopSchool.printQuiz) global.ShopSchool.printQuiz(title, items);
    else window.print();
  }

  function start(host, opts) {
    const hooks = opts || {};
    let view = "home";
    let sec = "core";
    let li = 0;
    let drillI = 0;
    let drillScore = 0;
    let answered = false;

    function goHub() {
      if (hooks.onHub) hooks.onHub();
    }
    function goExam() {
      if (hooks.onExam) hooks.onExam();
      else goHub();
    }

    function paint() {
      if (host._pathTimer) {
        clearInterval(host._pathTimer);
        host._pathTimer = null;
      }
      if (view === "home") paintHome();
      else if (view === "guide") paintGuide();
      else if (view === "lesson") paintLesson();
      else if (view === "drill") paintDrill();
      else if (view === "result") paintResult();
    }

    function paintHome() {
      const p = prog();
      const stamps = SECTIONS.filter((s) => p[s.id].stamped).length;
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div class="brand-bar" style="justify-content:flex-start">
              <div class="brand-mark" style="width:28px;height:28px;font-size:13px">608</div>
              <div class="brand-word">
                <strong style="font-size:15px">EPA 608 TUTOR</strong>
                <span>Professor HUB · shop law · not the official exam</span>
              </div>
            </div>
            <button class="btn" id="e608-hub">Shop floor</button>
          </header>
          <div class="hub-chip" style="max-width:none;margin:0 0 14px">
            <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
            <div>
              <strong>Professor HUB</strong>
              <p>608 is the appliance, not the jug. Read the pass guide. Walk Core, then Type II if you're HVAC. Stamp at 80% on the longer drills. Then sit the All-Star Exam — that's a study pack, not the live federal bank.</p>
            </div>
          </div>
          <figure class="e608-film" style="margin:0 0 14px">
            <video src="career-paths.mp4?v=5" poster="career-paths.jpg?v=5" controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#0b1218"></video>
            <figcaption style="color:#a8b0b8;font-size:14px;margin-top:8px">The four gates, then the path reel. School, the 608 card, OSHA, NATE, and the permit are not the same thing.</figcaption>
          </figure>
          <div id="path-reel" style="margin:0 0 14px;border-radius:12px;background:#10161c;border:1px solid #2a3644;overflow:hidden">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;padding:8px 12px;background:#CE0034;color:#fff">
              <strong id="path-kicker">Path 1 / 5</strong>
              <span style="font-size:12px">Plays with the career film</span>
            </div>
            <div style="min-height:168px;padding:16px 16px 8px">
              <h3 id="path-title" style="margin:0 0 8px;font-size:28px;line-height:1">Four ways in</h3>
              <p id="path-body" style="margin:0;color:#e8edf2;font-size:16px;line-height:1.45"></p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;padding:8px 12px 12px">
              <button type="button" class="btn" id="path-prev">Back</button>
              <button type="button" class="btn primary" id="path-next">Next</button>
            </div>
          </div>
          <figure class="e608-film" style="margin:0 0 14px">
            <video src="films/shop-loop.mp4?v=4" poster="films/shop-loop.jpg?v=2" controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#0b1218"></video>
            <figcaption style="color:#a8b0b8;font-size:14px;margin-top:8px">One film. The loop, then the ghost-shell parts, then the gases. R-410A is the house air conditioner, about 200 psig at 70°F. R-134a is the reach-in and the car, about 70 psig. R-22 is legacy, recover it, do not mix it into 410A. R-32 is an A2L on some new mini-splits. It is not a drop-in. Match the nameplate.</figcaption>
          </figure>
          <div class="e608-gates" style="display:grid;gap:14px;margin:0 0 14px">
            <figure class="e608-film" style="margin:0">
              <video src="gate-608.mp4?v=2" poster="gate-608.jpg?v=2" controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#0b1218"></video>
              <figcaption style="color:#a8b0b8;font-size:14px;margin-top:8px">EPA 608. Federal. About 18 of 25 on each section. Type II is the house unit. Universal adds the chiller. The card does not expire. It lets you buy refrigerant. It does not put your name on a permit.</figcaption>
            </figure>
            <figure class="e608-film" style="margin:0">
              <video src="gate-osha.mp4?v=2" poster="gate-osha.jpg?v=2" controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#0b1218"></video>
              <figcaption style="color:#a8b0b8;font-size:14px;margin-top:8px">OSHA 10 is the job-site card. OSHA 30 is the lead course. Philadelphia commercial work wants 30 on the supervisor. Neither one is the 608 card.</figcaption>
            </figure>
            <figure class="e608-film" style="margin:0">
              <video src="gate-nate.mp4?v=2" poster="gate-nate.jpg?v=2" controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#0b1218"></video>
              <figcaption style="color:#a8b0b8;font-size:14px;margin-top:8px">NATE is after time on the truck. Voluntary. It can raise the rate. It is not a license, and it does not replace 608.</figcaption>
            </figure>
            <figure class="e608-film" style="margin:0">
              <video src="gate-license.mp4?v=2" poster="gate-license.jpg?v=2" controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#0b1218"></video>
              <figcaption style="color:#a8b0b8;font-size:14px;margin-top:8px">Pennsylvania has no state HVAC license and no journeyman card. The license is the contractor registration and the city's mechanical permit. Philadelphia does not issue a master HVAC card. A diploma does not replace the hours.</figcaption>
            </figure>
          </div>
          <p class="e608-progress">${stamps} / 4 sections stamped${stamps === 4 ? " · Universal track complete" : ""}</p>
          <div class="e608-actions" style="margin-bottom:12px">
            <button class="btn primary" id="e608-guide">Study-and-pass guide</button>
            <button class="btn primary" id="e608-exam">All-Star Exam · 608 pack</button>
            <button class="btn" id="e608-lab-type">Lab · which card</button>
            <button class="btn" id="e608-lab-vac">Lab · how empty</button>
            <button class="btn" id="e608-lab-cyl">Lab · cylinder</button>
            <button class="btn" id="e608-lab-rrr">Lab · three R's</button>
            <button class="btn" id="e608-print-all">Print all drills + key</button>
          </div>
          <div class="e608-secs">
            ${SECTIONS.map((s) => {
              const st = p[s.id];
              return `<button type="button" class="e608-sec${st.stamped ? " stamped" : ""}" data-sec="${s.id}">
                <b>Type ${s.n}</b>
                <strong>${s.name}</strong>
                <span>${s.blurb}</span>
                <em>${st.stamped ? "STAMPED " + st.drillBest + "%" : st.lesson ? "Lesson " + st.lesson : "Not started"}</em>
              </button>`;
            }).join("")}
          </div>
          <p class="e608-fine">Training aid from EPA published test topics and 40 CFR 82. Not a substitute for an EPA-approved certifying organization. Does not dump the live federal question bank. Penalty amounts index. Door card / CFR wins.</p>
        </div>`;
      host.querySelector("#e608-hub").onclick = goHub;
      bindPathReel();
      host.querySelector("#e608-exam").onclick = goExam;
      host.querySelector("#e608-guide").onclick = function () {
        view = "guide";
        paint();
      };
      [["e608-lab-type", "e608type"], ["e608-lab-vac", "e608vac"], ["e608-lab-cyl", "e608cyl"], ["e608-lab-rrr", "e608rrr"]].forEach(function (pair) {
        var b = host.querySelector("#" + pair[0]);
        if (b) b.onclick = function () { if (hooks.onLab) hooks.onLab(pair[1]); };
      });
      var pa = host.querySelector("#e608-print-all");
      if (pa) pa.onclick = function () { printDrills("all"); };
      host.querySelectorAll(".e608-sec").forEach((btn) => {
        btn.onclick = () => {
          sec = btn.getAttribute("data-sec");
          const st = prog()[sec];
          li = Math.min(st.lesson || 0, (LESSONS[sec] || []).length - 1);
          view = "lesson";
          paint();
        };
      });
    }


    function bindPathReel() {
      var slides = [
        { t: "Four ways in", d: "A certificate is about 6 to 12 months. A private diploma is about a year, often 1,200 hours of class and shop. An associate degree is about two years, and those credits can transfer. An apprenticeship is about four years, paid from the first day. Those are the hours a license board counts." },
        { t: "608 is not a license", d: "Section 608 is federal, in every state. It lets you buy refrigerant and open a system. Type II is the house unit. Universal adds the chiller. About 18 of 25 on each section. The card does not expire. It does not put your name on a permit." },
        { t: "Pennsylvania", d: "No state HVAC board. No state journeyman card. No state HVAC exam. You still need 608. A residential contractor who does more than $5,000 of home-improvement work in a year registers with the Attorney General. A job over $500 needs a written contract." },
        { t: "Philadelphia", d: "The city does not issue a master HVAC license. Commercial work needs a city contractor license, insurance on file, city taxes current, and a supervisor with OSHA 30. A one- or two-family house uses the state home-improvement registration. Either way, pull the mechanical permit before the equipment goes in." },
        { t: "Hours still count", d: "OSHA 10 is the job site. OSHA 30 is the lead course. NATE is voluntary, after time on the truck. A diploma gets you the labs and the 608 sitting. It does not replace field hours, and the rule changes when the job crosses a county line." }
      ];
      var i = 0;
      var title = host.querySelector("#path-title");
      var body = host.querySelector("#path-body");
      var kicker = host.querySelector("#path-kicker");
      if (!title) return;
      function show() {
        title.textContent = slides[i].t;
        body.textContent = slides[i].d;
        kicker.textContent = "Path " + (i + 1) + " / " + slides.length;
      }
      function step(n) {
        i = (i + n + slides.length) % slides.length;
        show();
      }
      show();
      host.querySelector("#path-next").onclick = function () { step(1); };
      host.querySelector("#path-prev").onclick = function () { step(-1); };
      host._pathTimer = setInterval(function () { step(1); }, 9000);
    }

    function paintGuide() {
      host.innerHTML =
        '<div class="e608-shell e608-guide">' +
        '<header class="e608-head"><div><p class="eyebrow">Instructor desk</p><h2>EPA 608 · study and pass</h2></div>' +
        '<div class="e608-actions"><button class="btn" id="e608-print">Print handout</button>' +
        '<button class="btn" id="e608-back">Tutor home</button></div></header>' +
        '<div class="hub-chip" style="max-width:none;margin:0 0 14px">' +
        '<img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />' +
        "<div><strong>Professor HUB</strong><p>This is how the paper is built. Drills here are labeled study. I will not dump the live federal bank.</p></div></div>" +
        "<h3>How the exam is built</h3>" +
        '<table class="e608-table"><tr><th>Section</th><th>Questions</th><th>Pass (closed-book)</th></tr>' +
        "<tr><td>Core</td><td>25</td><td>18 / 25 (72%)</td></tr>" +
        "<tr><td>Type I</td><td>25</td><td>18 / 25</td></tr>" +
        "<tr><td>Type II</td><td>25</td><td>18 / 25</td></tr>" +
        "<tr><td>Type III</td><td>25</td><td>18 / 25</td></tr>" +
        "<tr><td><strong>Universal</strong></td><td>100</td><td>Each section scored <em>alone</em></td></tr></table>" +
        "<p><strong>HVAC truck = Core + Type II.</strong> Universal if they might see a chiller. 608 does not expire. 609 is cars. No Type IV for A2Ls.</p>" +
        "<h3>How to sit it</h3>" +
        "<ul class='e608-ul'>" +
        "<li>Closed book when it is the proctored card. Photo ID. Phone off the table. Open-book Core does not stack into Universal.</li>" +
        "<li>Read the whole stem. The last line is the question. Dates and units are the trap.</li>" +
        "<li>Throw out the answer that vents refrigerant, uses oxygen, or mixes the units. Then pick between what is left.</li>" +
        "<li>Do not change an answer unless you misread the stem.</li>" +
        "<li>Skip a stuck item and come back. Do not die on one recovery-table row.</li>" +
        "</ul>" +
        "<h3>What this paper fails people on</h3>" +
        "<ul class='e608-ul'>" +
        "<li>0 inches Hg on a house 410A is 0 psig. Atmospheric. You did not pull a vacuum. That is 608 recovery, not microns.</li>" +
        "<li>The date on the table is the recovery machine. Modern machine, 3-ton 410A under 200 lb: 0 psig. 250 lb high-pressure rack: 10 inches Hg. 15 inches is the big medium-pressure number.</li>" +
        "<li>Type I is factory-sealed and 5 lb or less. A split is Type II.</li>" +
        "<li>Type III: before November 15, 1993, 25 inches of mercury vacuum. On or after that date, 25 mm Hg absolute. Do not swap them.</li>" +
        "<li>Recover, recycle, reclaim. Recycle stays with the same owner. Reclaim to AHRI 700 can be sold.</li>" +
        "<li>Gray body, yellow top, 80% by weight. Never recover into a disposable. Nitrogen for a leak check, never oxygen.</li>" +
        "<li>July 1, 1992: CFC and HCFC. November 15, 1995: HFC. A card does not make venting legal.</li>" +
        "</ul>" +
        "<h3>7–14 day plan</h3>" +
        "<ol><li>Core, two days.</li><li>Type II vacuum table, three days.</li><li>Type I, one sitting. Passive recovery is Type I only.</li><li>Type III, one sitting. Say the units.</li><li>Untimed 100, then timed. Tables only the night before.</li></ol>" +
        "<p class='e608-fine'>Study drills in this app are original shop questions from published topics. Not the live federal bank.</p>" +
        "</div>";
      host.querySelector("#e608-back").onclick = function () {
        view = "home";
        paint();
      };
      host.querySelector("#e608-print").onclick = function () {
        global.print();
      };
    }

    function paintLesson() {
      const list = LESSONS[sec] || [];
      const L = list[li] || list[0];
      const sdef = SECTIONS.find((s) => s.id === sec) || SECTIONS[0];
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div>
              <p class="eyebrow">${sdef.name} · ${li + 1} / ${list.length}</p>
              <h2>${L.title}</h2>
            </div>
            <button class="btn" id="e608-back">Sections</button>
          </header>
          <div class="hub-chip" style="max-width:none;margin:0 0 12px">
            <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
            <div><strong>HUB</strong><p>${L.hub}</p></div>
          </div>
          <div class="e608-body">${L.body}</div>
          <div class="e608-actions">
            <button class="btn" id="e608-prev" ${li === 0 ? "disabled" : ""}>Back</button>
            <button class="btn primary" id="e608-next">${li < list.length - 1 ? "Next lesson" : "Drill this section"}</button>
          </div>
        </div>`;
      host.querySelector("#e608-back").onclick = () => {
        view = "home";
        paint();
      };
      const prev = host.querySelector("#e608-prev");
      if (prev) {
        prev.onclick = () => {
          if (li > 0) {
            li -= 1;
            paint();
          }
        };
      }
      host.querySelector("#e608-next").onclick = () => {
        const p = prog();
        p[sec].lesson = Math.max(p[sec].lesson || 0, li + 1);
        save(p);
        if (li < list.length - 1) {
          li += 1;
          paint();
        } else {
          drillI = 0;
          drillScore = 0;
          answered = false;
          view = "drill";
          paint();
        }
      };
      wireVac(host);
    }

    function paintDrill() {
      const bank = DRILLS[sec] || [];
      const item = bank[drillI];
      if (!item) {
        view = "result";
        paint();
        return;
      }
      const sdef = SECTIONS.find((s) => s.id === sec) || SECTIONS[0];
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div>
              <p class="eyebrow">${sdef.name} drill · ${drillI + 1} / ${bank.length}</p>
              <h2>${item.q}</h2>
            </div>
            <button class="btn" id="e608-back">Sections</button>
          </header>
          <div class="e608-choices" id="e608-choices">
            ${item.choices
              .map(
                (c, i) =>
                  `<button type="button" class="e608-choice" data-i="${i}"><span>${"ABCD"[i]}</span>${c}</button>`
              )
              .join("")}
          </div>
          <p class="e608-why hidden" id="e608-why"></p>
          <div class="e608-actions">
            <button class="btn primary hidden" id="e608-dnext">Next</button>
          </div>
        </div>`;
      host.querySelector("#e608-back").onclick = () => {
        view = "home";
        paint();
      };
      const why = host.querySelector("#e608-why");
      const next = host.querySelector("#e608-dnext");
      host.querySelectorAll(".e608-choice").forEach((btn) => {
        btn.onclick = () => {
          if (answered) return;
          answered = true;
          const i = +btn.getAttribute("data-i");
          const ok = i === item.a;
          if (ok) drillScore += 1;
          btn.classList.add(ok ? "ok" : "bad");
          host.querySelectorAll(".e608-choice").forEach((b) => {
            if (+b.getAttribute("data-i") === item.a) b.classList.add("ok");
            b.disabled = true;
          });
          why.textContent = (ok ? "Why it's right: " : "Why it's wrong: ") + item.why;
          why.classList.remove("hidden");
          next.classList.remove("hidden");
        };
      });
      next.onclick = () => {
        answered = false;
        drillI += 1;
        if (drillI >= bank.length) view = "result";
        paint();
      };
    }

    function paintResult() {
      const bank = DRILLS[sec] || [];
      const pct = bank.length ? Math.round((drillScore / bank.length) * 100) : 0;
      const pass = pct >= 80;
      const p = prog();
      p[sec].drillBest = Math.max(p[sec].drillBest || 0, pct);
      if (pass) p[sec].stamped = true;
      save(p);
      if (pass && hooks.onStamp) hooks.onStamp();
      if (pass && global.CurriculumTrain) global.CurriculumTrain.stamp("epa608");
      if (pass && global.Badges && global.Badges.unlock) {
        global.Badges.unlock("epa_tutor");
        const all = SECTIONS.every((s) => prog()[s.id].stamped);
        if (all) global.Badges.unlock("epa_universal");
      }
      const sdef = SECTIONS.find((s) => s.id === sec) || SECTIONS[0];
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div>
              <p class="eyebrow">${sdef.name} drill</p>
              <h2>${drillScore} / ${bank.length} · ${pct}%</h2>
            </div>
            <button class="btn" id="e608-hub">Shop floor</button>
          </header>
          <div class="hub-chip" style="max-width:none;margin:0 0 12px">
            <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
            <div>
              <strong>HUB</strong>
              <p>${pass
                ? "Stamped. That's a prove path, not a lucky guess. Sit the exam when you're ready."
                : "Under 80%. Read the why, run the lessons again. The test does not grade effort."}</p>
            </div>
          </div>
          <div class="e608-actions">
            <button class="btn" id="e608-retry">Retry drill</button>
            <button class="btn" id="e608-print-sec">Print this drill + key</button>
            <button class="btn" id="e608-back">Sections</button>
            <button class="btn primary" id="e608-exam">All-Star Exam</button>
          </div>
        </div>`;
      host.querySelector("#e608-hub").onclick = goHub;
      host.querySelector("#e608-back").onclick = () => {
        view = "home";
        paint();
      };
      host.querySelector("#e608-exam").onclick = goExam;
      var ps = host.querySelector("#e608-print-sec");
      if (ps) ps.onclick = function () { printDrills(sec); };
      host.querySelector("#e608-retry").onclick = () => {
        drillI = 0;
        drillScore = 0;
        answered = false;
        view = "drill";
        paint();
      };
    }

    paint();
    return { stop() {} };
  }

  global.Epa608Tutor = { start, SECTIONS };
})(window);
