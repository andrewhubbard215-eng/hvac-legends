/* All-Star cert badges — learn + celebrate */
(function (global) {
  "use strict";

  const DEFS = [
    {
      id: "first_clock",
      name: "Clocked In",
      desc: "Created your tech and hit the shop floor.",
      icon: "🪪",
    },
    {
      id: "clean_install",
      name: "Clean Install",
      desc: "Finished a mini-split sequence the right way.",
      icon: "❄️",
    },
    {
      id: "no_vent",
      name: "No-Vent Hero",
      desc: "Kept EPA heat at 0★ through a job window.",
      icon: "🌍",
    },
    {
      id: "epa_quiz",
      name: "608 Scholar",
      desc: "Scored well on an EPA 608 quiz round.",
      icon: "📜",
    },
    {
      id: "epa_tutor",
      name: "608 Stamp",
      desc: "Passed an EPA 608 tutor section drill at 80%.",
      icon: "📋",
    },
    {
      id: "epa_universal",
      name: "Universal Track",
      desc: "Stamped Core, Type I, II, and III in the 608 tutor.",
      icon: "🏅",
    },
    {
      id: "osha_quiz",
      name: "Safety First",
      desc: "Strong OSHA 30 quiz performance.",
      icon: "🦺",
    },
    {
      id: "service_star",
      name: "Customer Whisperer",
      desc: "Finished a service route with high stars.",
      icon: "⭐",
    },
    {
      id: "sandbox_tech",
      name: "Cycle Crafter",
      desc: "Built and ran a sandbox refrigeration cycle.",
      icon: "🔄",
    },
    {
      id: "curriculum_3",
      name: "Study Streak",
      desc: "Marked 3 curriculum units practiced.",
      icon: "📚",
    },
    {
      id: "hub_friend",
      name: "Asked HUB",
      desc: "Used Professor HUB AI for real help.",
      icon: "🦸",
    },
    {
      id: "quiz_champ",
      name: "Quiz Champion",
      desc: "Took first on the All-Star Exam.",
      icon: "🥇",
    },
    {
      id: "gauges_of_god",
      name: "Gauges of God",
      desc: "Won the Quiz Game. HVAC Jesus seated the gauges.",
      icon: "⚖️",
    },
    {
      id: "allstar_rank",
      name: "All-Star Rank",
      desc: "Reached 2000 XP All-Star rank.",
      icon: "🏆",
    },
  ];

  const KEY = "lt-hvac-badges-v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function save(map) {
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch (_) {}
  }

  function earned() {
    return load();
  }

  function has(id) {
    return !!load()[id];
  }

  function unlock(id) {
    const map = load();
    if (map[id]) return false;
    const def = DEFS.find((d) => d.id === id);
    if (!def) return false;
    map[id] = Date.now();
    save(map);
    showUnlock(def);
    if (window.LtSfx && window.LtSfx.badge) window.LtSfx.badge();
    return true;
  }

  function showUnlock(def) {
    let host = document.getElementById("badge-toast");
    if (!host) {
      host = document.createElement("div");
      host.id = "badge-toast";
      const app = document.getElementById("app") || document.body;
      app.appendChild(host);
    }
    host.innerHTML =
      '<div class="badge-toast-card">' +
      '<span class="badge-toast-icon">' +
      def.icon +
      "</span><div><strong>Cert unlocked</strong><p>" +
      def.name +
      " — " +
      def.desc +
      "</p></div></div>";
    host.classList.add("show");
    setTimeout(() => host.classList.remove("show"), 3200);
    if (global.toast) global.toast(def.icon + " " + def.name, "xp");
  }

  function renderPanel(parent) {
    if (!parent) return;
    const map = load();
    const n = Object.keys(map).length;
    parent.innerHTML =
      '<div class="badge-panel"><h3>Cert badges <span>' +
      n +
      "/" +
      DEFS.length +
      '</span></h3><div class="badge-grid">' +
      DEFS.map((d) => {
        const on = !!map[d.id];
        return (
          '<div class="badge-item' +
          (on ? " on" : "") +
          '" title="' +
          d.desc +
          '"><span>' +
          d.icon +
          "</span><em>" +
          d.name +
          "</em></div>"
        );
      }).join("") +
      "</div></div>";
  }

  global.Badges = { DEFS, unlock, has, earned, renderPanel };
})(window);
