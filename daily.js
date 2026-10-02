/* Daily Training Aid — streak, today's plan, practice log */
(function (global) {
  "use strict";

  const KEY = "lt-hvac-daily-v1";

  const DRILLS = [
    {
      id: "minisplit",
      mode: "minisplit",
      title: "Mini-split install",
      minutes: 12,
      skill: "install",
      why: "Flare · torque · N₂ · vacuum · valves · commission",
    },
    {
      id: "sandbox",
      mode: "sandbox",
      title: "Cycle sandbox",
      minutes: 8,
      skill: "cycle",
      why: "Pressures, SH/SC, refrigerant flow on real brand templates",
    },
    {
      id: "service",
      mode: "service",
      title: "Service calls",
      minutes: 10,
      skill: "diagnose",
      why: "Customer talk + fault diagnosis under pressure",
    },
    {
      id: "quiz",
      mode: "quiz",
      title: "Quiz arena",
      minutes: 8,
      skill: "theory",
      why: "EPA 608 · OSHA · P/T · shop practice",
    },
    {
      id: "epa608",
      mode: "epa608",
      title: "EPA 608 tutor",
      minutes: 10,
      skill: "theory",
      why: "Core · Type I/II/III · recovery vacuum table",
    },
    {
      id: "curriculum",
      mode: "curriculum",
      title: "Curriculum unit",
      minutes: 10,
      skill: "study",
      why: "Shop practice units mapped to the labs",
    },
  ];

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

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

  function get() {
    const data = load();
    if (!data.skills) data.skills = {};
    if (!data.log) data.log = [];
    if (typeof data.streak !== "number") data.streak = 0;
    if (!data.lastDay) data.lastDay = "";
    if (!data.todayDone) data.todayDone = [];
    return data;
  }

  /** Call once when hub opens — updates streak if new day */
  function touchLogin() {
    const data = get();
    const t = todayKey();
    if (data.lastDay === t) {
      return data;
    }
    if (data.lastDay === yesterdayKey()) {
      data.streak = (data.streak || 0) + 1;
    } else if (data.lastDay) {
      data.streak = 1;
    } else {
      data.streak = 1;
    }
    data.lastDay = t;
    data.todayDone = [];
    save(data);
    return data;
  }

  function recordPractice(drillId, meta) {
    const data = get();
    const t = todayKey();
    if (data.lastDay !== t) touchLogin();
    const d2 = get();
    if (!d2.todayDone.includes(drillId)) d2.todayDone.push(drillId);
    const skill = (DRILLS.find((d) => d.id === drillId) || {}).skill || drillId;
    d2.skills[skill] = (d2.skills[skill] || 0) + 1;
    d2.log.unshift({
      day: t,
      drill: drillId,
      at: Date.now(),
      meta: meta || null,
    });
    d2.log = d2.log.slice(0, 60);
    save(d2);
    return d2;
  }

  function goalMet(data) {
    data = data || get();
    return (data.todayDone || []).length >= 1;
  }

  function recommend() {
    const data = get();
    const counts = data.skills || {};
    const skillOrder = ["install", "cycle", "diagnose", "theory", "study"];
    // prefer least-practiced skill not done today
    const ranked = DRILLS.slice().sort((a, b) => {
      const ca = counts[a.skill] || 0;
      const cb = counts[b.skill] || 0;
      return ca - cb;
    });
    const done = data.todayDone || [];
    const pick = ranked.find((d) => !done.includes(d.id)) || ranked[0];
    const second = ranked.find((d) => d.id !== pick.id && !done.includes(d.id));
    return { primary: pick, secondary: second || null, data };
  }

  function streakBonus(streak) {
    if (streak >= 14) return { xp: 40, cash: 25 };
    if (streak >= 7) return { xp: 25, cash: 15 };
    if (streak >= 3) return { xp: 15, cash: 10 };
    if (streak >= 1) return { xp: 8, cash: 5 };
    return { xp: 0, cash: 0 };
  }

  function renderPanel(host, opts) {
    if (!host) return;
    const onStart = (opts && opts.onStart) || function () {};
    const data = touchLogin();
    const rec = recommend();
    const primary = rec.primary;
    const secondary = rec.secondary;
    const met = goalMet(data);
    const bonus = streakBonus(data.streak);

    host.innerHTML = `
      <div class="daily-panel">
        <div class="daily-top">
          <div>
            <p class="eyebrow">Daily training aid</p>
            <h3>${met ? "Goal hit — keep going" : "Today's practice"}</h3>
            <p class="daily-sub">${data.streak} day streak${bonus.xp ? " · login bonus +" + bonus.xp + " XP" : ""}</p>
          </div>
          <div class="daily-streak-badge" title="Consecutive days practiced">
            <span>${data.streak}</span>
            <small>day streak</small>
          </div>
        </div>
        <div class="daily-goal ${met ? "met" : ""}">
          <strong>${met ? "✓ Daily goal complete" : "Daily goal"}</strong>
          <span>${met ? "You practiced today. Optional: stack another drill." : "Complete 1 drill (about 8–12 min)."}</span>
        </div>
        <div class="daily-drills">
          <button type="button" class="daily-drill primary" data-mode="${primary.mode}" data-drill="${primary.id}">
            <div>
              <strong>${primary.title}</strong>
              <span>${primary.why}</span>
            </div>
            <em>~${primary.minutes} min</em>
          </button>
          ${
            secondary
              ? `<button type="button" class="daily-drill" data-mode="${secondary.mode}" data-drill="${secondary.id}">
            <div>
              <strong>${secondary.title}</strong>
              <span>${secondary.why}</span>
            </div>
            <em>~${secondary.minutes} min</em>
          </button>`
              : ""
          }
        </div>
        <p class="daily-tip">Tip: 10 focused minutes beats one long cram. Flare → vacuum → diagnose on rotation.</p>
      </div>
    `;

    host.querySelectorAll(".daily-drill").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-mode");
        const drill = btn.getAttribute("data-drill");
        onStart(mode, drill);
      };
    });
  }

  global.DailyTrain = {
    DRILLS,
    touchLogin,
    recordPractice,
    recommend,
    goalMet,
    streakBonus,
    get,
    renderPanel,
    todayKey,
  };
})(window);
