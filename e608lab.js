/* EPA 608 shop labs. Published levels and appliance rules.
   Original calls. Not an ESCO / Mainstream / HVAC Excellence bank. */
(function (global) {
  "use strict";

  const LABS = {
    e608type: {
      title: "Which card opens it",
      hub: "608 follows the appliance, not the jug. Same R-410A changes cards when the box changes.",
      steps: [
        {
          say: "Factory-sealed window unit. Nameplate says 3 lb of R-410A.",
          choices: [
            ["Type I", true, "Factory sealed and 5 lb or under. Type I."],
            ["Type II", false, "A split is Type II. This one never had a lineset."],
            ["Type III", false, "Type III is a low-pressure chiller."],
          ],
        },
        {
          say: "3-ton split heat pump. R-410A. You are opening the lineset.",
          choices: [
            ["Type I", false, "Type I stops at a factory-sealed 5 lb appliance. A split is not that."],
            ["Type II", true, "High-pressure appliance that is not a small sealed unit. Type II. R-410A is high-pressure, not very-high."],
            ["Type III", false, "Type III is R-11 / R-123 territory. The evaporator sits in a vacuum."],
          ],
        },
        {
          say: "Centrifugal chiller. R-123. Purge unit on the condenser.",
          choices: [
            ["Type I", false, "Not a window box."],
            ["Type II", false, "Type II is the high-pressure floor. This machine runs below atmosphere."],
            ["Type III", true, "Low-pressure chiller. Type III. The purge is not a license to vent."],
          ],
        },
        {
          say: "Walk-in cooler. 6 lb of R-448A. Someone says it is small, so Type I.",
          choices: [
            ["Type I", false, "Type I needs both: factory hermetic AND a manufactured charge of 5 lb or less. A walk-in fails both."],
            ["Type II", true, "Commercial box you open in the field. Type II."],
            ["No card. It is under 15 lb.", false, "Charge size picks the recovery level. The card is still the appliance type."],
          ],
        },
      ],
    },
    e608vac: {
      title: "How empty before you open it",
      hub: "This is 608 recovery. It is not the 500-micron pull after you braze. 0 inches of mercury is 0 psig. You did not pull a vacuum.",
      steps: [
        {
          say: "House 3-ton R-410A. Under 200 lb. Recovery machine built after Nov 15, 1993. You are opening the system.",
          choices: [
            ["0\" Hg (0 psig)", true, "High-pressure, under 200 lb, modern machine: 0 inches. Atmospheric. Then the vacuum pump does the microns."],
            ["10\" Hg", false, "10 inches is the big high-pressure job, 200 lb or more."],
            ["500 microns", false, "Microns dry the system after it is open. 608 does not ask for 500."],
          ],
        },
        {
          say: "R-22 parallel rack. 250 lb. Same modern machine.",
          choices: [
            ["0\" Hg", false, "Under 200 lb of high-pressure is 0 inches. This rack is over 200."],
            ["10\" Hg", true, "High-pressure, 200 lb or more, machine after Nov 15, 1993: 10 inches of mercury vacuum."],
            ["15\" Hg", false, "15 inches is medium-pressure at 200 lb or more. R-134a, not R-22."],
          ],
        },
        {
          say: "Window unit. Compressor still runs. How much do you take out?",
          choices: [
            ["90% of the charge, or 4\" Hg", true, "Running small appliance: 90% or 4 inches. Either one satisfies it."],
            ["80% or 4\" Hg", false, "80% is the dead compressor. A running one has to hit 90% or 4 inches."],
            ["Vent it. It is under 5 lb.", false, "Under 5 lb picks Type I. It does not make venting legal."],
          ],
        },
        {
          say: "Low-pressure chiller. Recovery machine built after November 15, 1993. Required level before you open it to atmosphere.",
          choices: [
            ["25 mm Hg absolute", true, "After November 15, 1993, Type III is 25 millimeters of mercury absolute."],
            ["25\" Hg", false, "25 inches of mercury vacuum is the older machine, built before November 15, 1993. This one is after that date."],
            ["0 psig", false, "0 psig still leaves a chiller full of vapor. After 1993 the table says 25 mm Hg absolute."],
          ],
        },
      ],
    },
    e608cyl: {
      title: "The cylinder",
      hub: "Gray body, yellow top. Weigh it. Never refill a disposable. Never oxygen.",
      steps: [
        {
          say: "How full can the recovery cylinder go?",
          choices: [
            ["80% by weight", true, "80% liquid. The rest is vapor space so a hot truck does not hydrostatic the bottle."],
            ["100%. It is rated for it.", false, "A full bottle of liquid has nowhere to expand."],
            ["Until the gauge hits 200 psig", false, "You fill by weight, not by a pressure you like."],
          ],
        },
        {
          say: "Which cylinder are you allowed to recover into?",
          choices: [
            ["Refillable DOT cylinder, gray body, yellow top", true, "That is the recovery bottle. Hydrotest on the stamp, typically 5 years."],
            ["The green disposable the 410A came in", false, "Disposable DOT-39 gets the heel pulled, the valve killed, and it goes to scrap. You do not recover into it."],
            ["Any empty cylinder on the truck", false, "Empty is not the same as rated for recovery. And you never mix gases in one bottle."],
          ],
        },
        {
          say: "The bottle already holds R-22. The next job is R-410A.",
          choices: [
            ["New bottle. Do not mix.", true, "Mixed gas cannot go back in a system and a reclaimer may refuse it."],
            ["410A on top. They are both HFCs.", false, "R-22 is an HCFC. Mixing is still illegal even if both were HFCs."],
            ["Bleed the R-22 to the roof, then fill.", false, "That is venting. Recover it into its own bottle."],
          ],
        },
        {
          say: "System is empty and open. You need to find the leak. What do you pressurize with?",
          choices: [
            ["Dry nitrogen", true, "Nitrogen. Trace dye or a soap bubble is fine. Oxygen is not."],
            ["Oxygen", false, "Oil plus oxygen is a fire. Never."],
            ["Shop air", false, "Shop air carries water and oxygen. You just wet a system you meant to dry."],
          ],
        },
      ],
    },
    e608rrr: {
      title: "Recover, recycle, reclaim",
      hub: "Recovered and recycled gas stays with that owner. A new owner means reclaim.",
      steps: [
        {
          say: "You pull the charge into a cylinder on the truck and stop.",
          choices: [
            ["Recover", true, "Out of the appliance and into a cylinder. That is recovery. It is not clean enough to sell."],
            ["Reclaim", false, "Reclaim is an off-site plant to AHRI 700."],
            ["Recycle", false, "Recycle means you cleaned it on the truck. A raw pull is only recovery."],
          ],
        },
        {
          say: "Oil separator and a filter-drier on the machine. The same store gets the gas back.",
          choices: [
            ["Recycle", true, "Cleaned on site, same owner. Recycled. You still cannot sell it to the shop next door."],
            ["Reclaim", false, "Reclaim leaves the truck and comes back as AHRI 700."],
            ["You can sell it. It went through a drier.", false, "A truck drier is not a reclaimer."],
          ],
        },
        {
          say: "You send a cylinder to a plant. It comes back certified AHRI 700.",
          choices: [
            ["Reclaim", true, "Off-site, AHRI 700. That gas can go to a different owner."],
            ["Recycle", false, "Recycle never left the job in a legal sense. It stays with the owner."],
            ["Recover", false, "Recovery was the first pull. This step is the plant."],
          ],
        },
        {
          say: "You want to put truck-cleaned R-410A into a different customer's condenser.",
          choices: [
            ["No. Different owner needs reclaim.", true, "Recycled gas is that owner only. A new customer waits on AHRI 700."],
            ["Yes. The drier made it new.", false, "The drier made it recycled. Recycled is not new."],
            ["Yes, if both systems are 410A.", false, "Same refrigerant is not the same owner."],
          ],
        },
      ],
    },
  };

  function Lab(host, opts) {
    const id = (opts && opts.station) || "e608type";
    const lab = LABS[id] || LABS.e608type;
    const onHub = opts && opts.onHub;
    let step = 0;
    let note = "";
    let done = false;

    function paint() {
      const s = lab.steps[step];
      const buttons = done
        ? ""
        : s.choices
            .map(function (c, i) {
              return '<button type="button" class="btn e608-choice" data-i="' + i + '">' + c[0] + "</button>";
            })
            .join("");
      host.innerHTML =
        '<div class="e608-shell">' +
        '<header class="e608-head"><div><p class="eyebrow">EPA 608 lab</p><h2>' +
        lab.title +
        "</h2></div><button type=\"button\" class=\"btn\" id=\"e6l-hub\">Shop floor</button></header>" +
        '<div class="hub-chip" style="max-width:none;margin:0 0 14px"><img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" /><div><strong>Professor HUB</strong><p>' +
        lab.hub +
        "</p></div></div>" +
        (done
          ? '<p class="e608-progress">Lab complete. That one posts. The card is still a real sitting.</p>'
          : '<p class="e608-progress">Call ' + (step + 1) + " of " + lab.steps.length + "</p>" +
            "<p>" + s.say + "</p>" +
            '<div class="e608-choices">' + buttons + "</div>") +
        (note ? '<p class="e608-fine">' + note + "</p>" : "") +
        '<p class="e608-fine">Shop law from EPA test topics and 40 CFR 82. Not the live exam bank.</p>' +
        "</div>";
      const back = host.querySelector("#e6l-hub");
      if (back) back.onclick = function () { if (onHub) onHub(); };
      host.querySelectorAll(".e608-choice").forEach(function (btn) {
        btn.onclick = function () {
          const c = s.choices[Number(btn.getAttribute("data-i"))];
          note = c[2];
          if (!c[1]) {
            if (global.LtHaptic) global.LtHaptic.bad();
            paint();
            return;
          }
          if (global.LtHaptic) global.LtHaptic.land();
          if (step < lab.steps.length - 1) {
            step += 1;
            paint();
            return;
          }
          done = true;
          if (global.CurriculumTrain) global.CurriculumTrain.stamp(id);
          paint();
        };
      });
    }

    paint();
    return { stop: function () {} };
  }

  global.Epa608Labs = { start: Lab, ids: Object.keys(LABS) };
})(window);
