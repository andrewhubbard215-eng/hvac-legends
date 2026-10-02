(() => {
  "use strict";

  const SAVE = "lt-hvac-allstars-html-v1";
  const ACCOUNTS = "lt-hvac-allstars-accounts-v1";
  const RANKS = [
    { id: "helper", title: "Helper", min: 0 },
    { id: "apprentice", title: "Apprentice", min: 180 },
    { id: "journeyman", title: "Journeyman", min: 520 },
    { id: "master", title: "Master Tech", min: 1100 },
    { id: "allstar", title: "All-Star", min: 2000 },
  ];

  const state = {
    screen: "title",
    callsign: "",
    spec: "residential",
    campus: "shop",
    classSection: "",
    look: "hardhat",
    photo: "",
    xp: 0,
    kills: 0,
    cash: 0,
    jobsCompleted: 0,
    lifetimeEarnings: 0,
    gaugesOfGod: false,
    raptureSeen: false,
    bestStreet: 0,
    bestArena: 0,
    vehicle: "falcon", // "falcon" | "van"
    spicy: false,
    extraSpicy: false,
    roastLevel: 1,
    diff: "medium",
    seenTip: false,
    seenTutorial: false,
    hubAuthed: false,
    passHash: "",
    sessionOk: false,
    activeUnit: null,
    hubAiOn: true,
  };

  const VEHICLES = {
    falcon: {
      id: "falcon",
      name: "1964 Falcon V8",
      label: "Falcon",
      imgKey: "falconRed",
      speed: 1.15,
      hpMult: 1,
      blurb: "Red · black stripe · convertible · fast",
    },
    van: {
      id: "van",
      name: "HVAC service van",
      label: "HVAC Van",
      imgKey: "hvacVan",
      speed: 0.88,
      hpMult: 1.35,
      blurb: "Roof racks · refrigerant tanks · tanky",
    },
  };

  const PAY = {
    minisplit: 850,
    minisplitBonus: 150,
    serviceTicket: 95,
    sandboxRun: 40,
  };

  const keys = new Set();
  let mode = null; // "street" | "arena"
  let raf = 0;
  let last = 0;
  let sandboxCtl = null;
  let minisplitCtl = null;
  let aiHelperCtl = null;
  let curriculumCtl = null;
  let quizCtl = null;
  let competeCtl = null;
  let brosCtl = null;
  let electricalCtl = null;
  let cmdCtl = null;

  // ---- persistence ----
  const ROAST_COPY = [
    "Classroom — no jokes. Straight 608.",
    "Mild — shop talk. 608 stays clean.",
    "Spicy — customers get mouthy.",
    "Extra — HUB unhinged. Answers still clean.",
  ];
  function applyRoast(n) {
    const v = Math.max(0, Math.min(3, Number(n) || 0));
    state.roastLevel = v;
    state.spicy = v >= 2;
    state.extraSpicy = v >= 3;
    const lab = document.getElementById("hub-roast-label");
    if (lab) lab.textContent = ROAST_COPY[v];
    const sl = document.getElementById("hub-roast");
    if (sl) sl.value = String(v);
    return v;
  }

  const DIFF_COPY = {
    easy: "Easy — labeled HIGH/LOW, HUB names the fingerprint.",
    medium: "Medium — live needles, you call it.",
    spicy: "Spicy — 45 seconds, pressures only, hard tickets.",
  };
  function applyDiff(id) {
    const v = id === "easy" || id === "spicy" ? id : "medium";
    state.diff = v;
    window.LtDiff = v;
    document.querySelectorAll("[data-diff]").forEach(function (b) {
      b.classList.toggle("primary", b.getAttribute("data-diff") === v);
    });
    const lab = document.getElementById("hub-diff-label");
    if (lab) lab.textContent = DIFF_COPY[v];
    return v;
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE);
      if (!raw) return;
      Object.assign(state, JSON.parse(raw));
    } catch {}
    if (typeof state.cash !== "number") state.cash = 0;
    if (typeof state.jobsCompleted !== "number") state.jobsCompleted = 0;
    if (typeof state.lifetimeEarnings !== "number") state.lifetimeEarnings = 0;
    if (typeof state.roastLevel !== "number") {
      state.roastLevel = state.extraSpicy ? 3 : state.spicy ? 2 : 1;
    }
    applyRoast(state.roastLevel);
    if (!state.diff || ["easy", "medium", "spicy"].indexOf(state.diff) < 0) state.diff = "medium";
    applyDiff(state.diff);
    if (typeof state.hubAuthed !== "boolean") state.hubAuthed = false;
    if (typeof state.seenTutorial !== "boolean") state.seenTutorial = false;
    if (typeof state.hubAiOn !== "boolean") state.hubAiOn = true;
    if (state.vehicle !== "van" && state.vehicle !== "falcon") state.vehicle = "falcon";
  }
  function save() {
    localStorage.setItem(
      SAVE,
      JSON.stringify({
        callsign: state.callsign,
        spec: state.spec,
        campus: state.campus,
        classSection: state.classSection,
        look: state.look,
        photo: state.photo,
        xp: state.xp,
        kills: state.kills,
        cash: state.cash,
        jobsCompleted: state.jobsCompleted,
        lifetimeEarnings: state.lifetimeEarnings,
        gaugesOfGod: state.gaugesOfGod,
        raptureSeen: state.raptureSeen,
        bestStreet: state.bestStreet,
        bestArena: state.bestArena,
        vehicle: state.vehicle,
        spicy: state.spicy,
        extraSpicy: !!state.extraSpicy,
        roastLevel: state.roastLevel,
        diff: state.diff,
        seenTip: state.seenTip,
        seenTutorial: state.seenTutorial,
        hubAiOn: state.hubAiOn !== false,
        hubAuthed: state.hubAuthed,
        passHash: state.passHash || "",
      })
    );
    persistCurrentAccount();
  }

  function applyHubAiPref() {
    const on = state.hubAiOn !== false;
    window.LtHubAiOn = on;
    if (window.HubAI && window.HubAI.setEnabled) window.HubAI.setEnabled(on);
    document.querySelectorAll("[data-hubai-toggle]").forEach((b) => {
      b.textContent = on ? "HUB AI · On" : "HUB AI · Off";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try {
      window.dispatchEvent(new CustomEvent("lt-hubai", { detail: { on } }));
    } catch (_) {}
  }

  function toggleHubAi() {
    state.hubAiOn = !(state.hubAiOn !== false);
    save();
    applyHubAiPref();
    toast(state.hubAiOn !== false ? "Professor HUB is on. Ask away." : "Professor HUB muted. Turn him back on anytime.", "ok");
  }

  function accountKey(name) {
    return String(name || "")
      .trim()
      .toLowerCase();
  }

  function loadAccounts() {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS) || "{}");
    } catch {
      return {};
    }
  }

  function writeAccounts(map) {
    localStorage.setItem(ACCOUNTS, JSON.stringify(map));
  }

  function persistCurrentAccount() {
    const key = accountKey(state.callsign);
    if (!key || !state.passHash) return;
    const map = loadAccounts();
    map[key] = {
      callsign: state.callsign,
      passHash: state.passHash,
      spec: state.spec,
      campus: state.campus,
      classSection: state.classSection,
      look: state.look,
      photo: state.photo,
      xp: state.xp,
      cash: state.cash,
      jobsCompleted: state.jobsCompleted,
      lifetimeEarnings: state.lifetimeEarnings,
      gaugesOfGod: state.gaugesOfGod,
      raptureSeen: state.raptureSeen,
      spicy: state.spicy,
      extraSpicy: !!state.extraSpicy,
      roastLevel: state.roastLevel,
      diff: state.diff,
      seenTip: state.seenTip,
      seenTutorial: state.seenTutorial,
      hubAuthed: !!state.hubAuthed && isHubName(state.callsign),
    };
    writeAccounts(map);
  }

  function applyAccount(rec) {
    if (!rec) return;
    state.callsign = rec.callsign || "";
    state.passHash = rec.passHash || "";
    state.spec = rec.spec || "residential";
    state.campus = rec.campus || "shop";
    state.classSection = rec.classSection || "";
    state.look = rec.look || "hardhat";
    state.photo = rec.photo || "";
    state.xp = rec.xp || 0;
    state.cash = rec.cash || 0;
    state.jobsCompleted = rec.jobsCompleted || 0;
    state.lifetimeEarnings = rec.lifetimeEarnings || 0;
    state.gaugesOfGod = !!rec.gaugesOfGod;
    state.raptureSeen = !!rec.raptureSeen;
    state.spicy = !!rec.spicy;
    state.extraSpicy = !!rec.extraSpicy;
    if (typeof rec.roastLevel === "number") applyRoast(rec.roastLevel);
    else applyRoast(state.extraSpicy ? 3 : state.spicy ? 2 : 1);
    applyDiff(rec.diff || state.diff || "medium");
    state.seenTip = !!rec.seenTip;
    state.seenTutorial = !!rec.seenTutorial;
    state.hubAuthed = !!rec.hubAuthed && isHubName(rec.callsign);
  }

  function logoutAccount() {
    state.callsign = "";
    state.passHash = "";
    state.hubAuthed = false;
    state.sessionOk = false;
    save();
    show("title");
    toast("Logged out", "ok");
  }

  function addXp(n, label) {
    window.ltAddXp = addXp;
    const v = Math.max(0, Math.round(n));
    state.xp += v;
    if (v > 0) toast("+" + v + " XP" + (label ? " · " + label : ""), "xp");
    save();
    return v;
  }
  window.ltAddXp = addXp;

  function pay(amount, reason) {
    const n = Math.max(0, Math.round(amount));
    state.cash += n;
    state.lifetimeEarnings += n;
    save();
    if (n > 0) toast("+" + money(n) + " · wallet " + money(state.cash), "cash");
    return n;
  }

  function money(n) {
    return "$" + Math.round(Number(n) || 0).toLocaleString("en-US");
  }

  function toast(msg, kind) {
    window.toast = toast;
    let host = document.getElementById("toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "toast-host";
      document.getElementById("app").appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " toast-" + kind : "");
    el.textContent = msg;
    host.appendChild(el);
    if (window.LtHaptic) {
      if (kind === "bad") window.LtHaptic.bad();
      else if (kind === "ok" || kind === "xp" || kind === "cash") window.LtHaptic.tick();
    }
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 280);
    }, 2200);
  }

  function showPayStub(opts) {
    const {
      title = "Paid",
      body = "",
      amount = 0,
      xp = 0,
      onClose = null,
    } = opts || {};
    let ov = document.getElementById("pay-overlay");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "pay-overlay";
      ov.className = "overlay";
      ov.innerHTML = `
        <div class="panel pay-stub">
          <p class="eyebrow" id="pay-brand">Payroll</p>
          <h2 id="pay-title">Paid</h2>
          <p class="pay-amount" id="pay-amount">$0</p>
          <p id="pay-body" class="lede"></p>
          <p id="pay-balance" class="pay-balance"></p>
          <button class="btn primary" id="pay-close">Bank it</button>
        </div>`;
      document.getElementById("app").appendChild(ov);
    }
    ov.classList.remove("hidden");
    const brandLine = document.getElementById("pay-brand");
    if (brandLine) brandLine.textContent = "Payroll · " + ((window.LtBrand && window.LtBrand.title) || "HVAC Legends");
    document.getElementById("pay-title").textContent = title;
    document.getElementById("pay-amount").textContent = "+" + money(amount);
    document.getElementById("pay-body").textContent =
      body + (xp ? " · +" + xp + " XP" : "");
    document.getElementById("pay-balance").textContent =
      "Wallet " + money(state.cash) + " · Lifetime " + money(state.lifetimeEarnings) + " · Jobs " + state.jobsCompleted;
    document.getElementById("pay-close").onclick = () => {
      ov.classList.add("hidden");
      if (onClose) onClose();
    };
    sfx.win();
  }

  function rankFor(xp) {
    let cur = RANKS[0];
    for (const r of RANKS) if (xp >= r.min) cur = r;
    return cur;
  }

  const HUB_KDF = {
    v: 2,
    algo: "PBKDF2",
    hash: "SHA-256",
    iter: 150000,
    salt: textToHex("lt-allstars-hub-salt-v1"),
    hashHex: "693ba1162376081c07f494e8447df11fd89f8245dc351f7936c12fe63ef64b9f",
  };
  const HUB_PASS_SHA256_LEGACY = "6bf1f6537cf327986333ccca2ad0d046ebdf74acf722b1036efc6169925708f9";
  const KDF_ITER = 150000;

  function textToHex(s) {
    return Array.from(new TextEncoder().encode(s))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function bufToHex(buf) {
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function hexToBuf(hex) {
    const clean = String(hex || "").replace(/[^0-9a-f]/gi, "");
    const out = new Uint8Array(clean.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
    return out;
  }

  function randomSaltHex(bytes) {
    const a = new Uint8Array(bytes || 16);
    crypto.getRandomValues(a);
    return bufToHex(a);
  }

  async function sha256hex(s) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return bufToHex(buf);
  }

  async function pbkdf2Hex(password, saltHex, iter) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: hexToBuf(saltHex), iterations: iter },
      key,
      256
    );
    return bufToHex(bits);
  }

  async function makePassRecord(password) {
    const salt = randomSaltHex(16);
    const hashHex = await pbkdf2Hex(password, salt, KDF_ITER);
    return { v: 2, algo: "PBKDF2", hash: "SHA-256", iter: KDF_ITER, salt, hashHex };
  }

  function timingSafeEq(a, b) {
    const x = String(a || "");
    const y = String(b || "");
    if (x.length !== y.length) return false;
    let d = 0;
    for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i);
    return d === 0;
  }

  async function verifyPassRecord(password, rec) {
    if (!rec) return false;
    if (typeof rec === "string") {
      const h = await sha256hex(password);
      return timingSafeEq(h, rec);
    }
    if (rec.algo === "PBKDF2" && rec.salt && rec.hashHex) {
      const got = await pbkdf2Hex(password, rec.salt, rec.iter || KDF_ITER);
      return timingSafeEq(got, rec.hashHex);
    }
    return false;
  }

  async function verifyHubPassword(password) {
    const kdf = await pbkdf2Hex(password, HUB_KDF.salt, HUB_KDF.iter);
    if (timingSafeEq(kdf, HUB_KDF.hashHex)) return true;
    const legacy = await sha256hex(password);
    return timingSafeEq(legacy, HUB_PASS_SHA256_LEGACY);
  }
  function isHubName(n) {
    const s = String(n || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
    return (
      s === "hub" ||
      s === "professor hub" ||
      s === "hubbard" ||
      s === "andrew hubbard" ||
      s === "professor hubbard" ||
      s === "professor andrew hubbard"
    );
  }

  function isHub() {
    return !!state.hubAuthed && isHubName(state.callsign);
  }

  function raptureUnlocked() {
    return state.gaugesOfGod || state.xp >= 2000 || isHub() || state.raptureSeen;
  }

  // ---- screens ----
  function enterShopFloor(name) {
    const n = String(name || state.callsign || "Guest").trim().slice(0, 16) || "Guest";
    state.callsign = n;
    state.sessionOk = true;
    state.seenTip = true;
    state.seenTutorial = true;
    if (!state.campus) state.campus = "shop";
    if (!state.spec) state.spec = "residential";
    try {
      save();
    } catch (_) {}
    refreshHub();
    show("hub");
  }

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const el = document.getElementById("screen-" + id);
    if (!el) {
      console.warn("missing screen", id);
      return;
    }
    el.classList.add("active");
    el.classList.add("screen-in");
    setTimeout(() => el.classList.remove("screen-in"), 320);
    state.screen = id;
    if (id !== "rapture") stopChant();
    if (id !== "game" && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    // show first-day tip once on hub
    document.body.classList.toggle(
      "lab-open",
      ["sandbox", "electrical", "quiz", "minisplit", "compchange", "service", "phonetools", "commandments", "epa608", "ptchart", "aihelper", "curriculum", "compete", "furnace", "flare", "braze", "gauges", "ohms", "bible", "factory", "fieldsoft", "voltmeter", "shopschool", "cutaway", "iconnect", "recover", "call"].indexOf(id) >= 0
    );
    if (id === "hub") {
      const tip = document.getElementById("hub-tip");
      if (tip && !state.seenTip) tip.classList.remove("hidden");
      /* tutorial is opt-in from the HUB tutorial card */
    }
    postCompete("screen", { screen: id, mode: id });
    if (window.LtClass && window.LtClass.isHost()) window.LtClass.push(id);
  }

  function refreshHub() {
    const nameEl = document.getElementById("hub-name");
    if (nameEl) nameEl.textContent = state.callsign || "Tech";
    const meta = document.getElementById("hub-meta");
    if (meta) {
      const campus = {
        levittown: "Levittown, PA",
        mahwah: "Mahwah, NJ",
        union: "Union, NJ",
        moorestown: "Moorestown, NJ",
        eastwindsor: "East Windsor, CT",
        newbritain: "New Britain, CT",
        shelton: "Shelton, CT",
        lincolnri: "Rhode Island",
        columbia: "Columbia, MD",
        indianapolis: "Indianapolis, IN",
        melrose: "Melrose Park, IL",
        denver: "Denver, CO",
        nashville: "Nashville, TN",
        houston: "Houston, TX",
        grandprairie: "Grand Prairie, TX",
        other: "Other shop",
      };
      const store = window.LtBrand && window.LtBrand.isStore;
      let place = campus[state.campus] || ((window.LtBrand && window.LtBrand.org) || "HVAC Legends");
      if (store && place === "HVAC Legends") place = "Shop";
      const bits = [place];
      if (state.classSection) bits.push(state.classSection);
      if (state.look) bits.push(state.look);
      meta.textContent = bits.join(" · ");
    }
    const stu = document.getElementById("hub-student");
    if (stu) {
      if (state.photo) {
        stu.src = state.photo;
        stu.classList.remove("hidden");
      } else stu.classList.add("hidden");
    }
    document.getElementById("hub-cash").textContent = money(state.cash);
    document.getElementById("hub-jobs").textContent = state.jobsCompleted + " jobs";
    document.getElementById("hub-xp").textContent = state.xp + " XP";
    const killsEl = document.getElementById("hub-kills");
    if (killsEl) killsEl.textContent = "";
    const rank = rankFor(state.xp);
    document.getElementById("hub-rank").textContent = rank.title;
    const copy = document.getElementById("rapture-copy");
    if (state.gaugesOfGod) copy.textContent = "Gauges seated. He’ll list the Commandments again anytime.";
    else if (raptureUnlocked()) copy.textContent = "HVAC Jesus will list the Commandments — and the Gauges of God are yours.";
    else copy.textContent = "Hear the Commandments from HVAC Jesus. All-Star unlocks the Gauges of God.";
    if (window.HvacCommandments && window.HvacCommandments.paintHub) {
      window.HvacCommandments.paintHub(document.getElementById("screen-hub"));
    }
    const hubSpicy = document.getElementById("hub-spicy");
    applyRoast(state.roastLevel);
    applyDiff(state.diff || "medium");
    if (document.querySelector(".vehicle-card")) setVehicle(state.vehicle || "falcon");

    // Professor HUB Deadpool banter
    let chip = document.getElementById("hub-banter");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "hub-banter";
      chip.className = "hub-chip";
      const grid = document.querySelector("#screen-hub .hub-grid");
      if (grid) grid.parentNode.insertBefore(chip, grid);
    }
    if (window.ProfessorHUB) {
      const line = window.ProfessorHUB.banter("hub", { extra: !!state.extraSpicy, level: state.roastLevel });
      const roast = window.ProfessorHUB.banter("rank", { title: rank.title });
      chip.innerHTML = '<img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" /><div><strong>Professor Andrew Hubbard</strong><p>' + line + " " + roast + "</p></div>";
    }
    const rack = document.getElementById("badge-rack");
    if (rack && window.Badges) window.Badges.renderPanel(rack);
    if (window.Badges && state.xp >= 2000) window.Badges.unlock("allstar_rank");

    const dailyRoot = document.getElementById("daily-root");
    if (dailyRoot && window.DailyTrain) {
      const before = window.DailyTrain.get();
      const after = window.DailyTrain.touchLogin();
      if (before.lastDay !== after.lastDay && after.streak >= 1) {
        const b = window.DailyTrain.streakBonus(after.streak);
        if (b.xp) {
          state.xp += b.xp;
          if (b.cash) pay(b.cash, "streak");
          save();
          document.getElementById("hub-xp").textContent = state.xp + " XP";
          document.getElementById("hub-cash").textContent = money(state.cash);
        }
      }
      window.DailyTrain.renderPanel(dailyRoot, {
        onStart(mode) {
          const card = document.querySelector('#screen-hub .mode-card[data-mode="' + mode + '"]');
          if (card) card.click();
          else if (mode === "minisplit") startMiniSplit();
          else if (mode === "sandbox") startSandbox();
          else if (mode === "curriculum") startCurriculum();
        },
      });
    }
  }

  function markDaily(drillId, meta) {
    if (window.DailyTrain) window.DailyTrain.recordPractice(drillId, meta || null);
  }

  // ---- images ----
  const img = {};
  function loadImg(key, src) {
    const i = new Image();
    i.src = src;
    img[key] = i;
  }
  function bootAssets() {
    for (let n = 1; n <= 4; n++) {
      loadImg("run" + n, "hub/run-" + n + ".png");
      loadImg("idle" + n, "hub/idle-" + n + ".png");
      loadImg("zom" + n, "zombie/walk-" + n + ".png");
      loadImg("ali" + n, "alien/walk-" + n + ".png");
      loadImg("mz" + n, "muzzle/fx-" + n + ".png");
    }
    loadImg("falcon", "falcon.png");
    loadImg("falconRed", "falcon-red.png");
    loadImg("hvacVan", "hvac-van.png");
    loadImg("pistol", "pistol.png");
    loadImg("hood", "hoodgun.png");
    loadImg("street", "street.jpg");
    loadImg("arena", "arena.jpg");
    loadImg("gauges", "gauges.png");
  }

  function currentVehicle() {
    return VEHICLES[state.vehicle] || VEHICLES.falcon;
  }

  function setVehicle(id) {
    if (!VEHICLES[id]) return;
    state.vehicle = id;
    save();
    document.querySelectorAll(".vehicle-card").forEach((b) => {
      b.classList.toggle("selected", b.dataset.vehicle === id);
    });
    const v = currentVehicle();
    const title = document.getElementById("arena-title");
    const copy = document.getElementById("arena-copy");
    if (title) title.textContent = v.label + " arena";
    if (copy) {
      copy.textContent =
        id === "falcon"
          ? "1964 Falcon V8 · red with black stripe · Twisted yard combat"
          : "HVAC service van · roof racks · tanky · Twisted yard combat";
    }
  }

  // ---- audio ----
  let actx = null;
  function ac() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  let muted = false;
  function beep(type, f0, f1, dur, vol) {
    if (muted) return;
    const a = ac();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = f0;
    g.gain.value = vol;
    o.connect(g).connect(a.destination);
    o.start();
    if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), a.currentTime + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.stop(a.currentTime + dur + 0.02);
  }
  const sfx = {
    gun: () => beep("square", 180, 70, 0.08, 0.05),
    flame: () => beep("sawtooth", 90, 60, 0.12, 0.03),
    ice: () => beep("triangle", 1400, 320, 0.22, 0.04),
    boom: () => beep("sawtooth", 70, 28, 0.28, 0.07),
    reload: () => beep("triangle", 400, 220, 0.15, 0.03),
    hit: () => beep("square", 90, 40, 0.1, 0.04),
    pickup: () => beep("sine", 520, 880, 0.12, 0.04),
    click: () => beep("square", 720, 480, 0.04, 0.03),
    drop: () => beep("triangle", 220, 140, 0.08, 0.04),
    correct: () => {
      [523, 659, 784].forEach((f, i) => setTimeout(() => beep("sine", f, f * 1.02, 0.16, 0.05), i * 80));
    },
    wrong: () => beep("sawtooth", 160, 70, 0.22, 0.05),
    tick: () => beep("square", 880, 880, 0.03, 0.025),
    compressor: () => beep("sawtooth", 55, 48, 0.45, 0.04),
    compressorOff: () => beep("triangle", 70, 40, 0.2, 0.03),
    badge: () => {
      [392, 523, 659, 784].forEach((f, i) => setTimeout(() => beep("triangle", f, f, 0.14, 0.04), i * 90));
    },
    rapture: () => startChant(),
    win: () => {
      [440, 554, 659, 880].forEach((f, i) => setTimeout(() => beep("sine", f, f, 0.2, 0.045), i * 70));
    },
    setMuted(on) {
      muted = !!on;
      if (muted) stopChant();
    },
    isMuted() {
      return muted;
    },
  };
  window.LtSfx = sfx;

  // ---- classic rock driving music (procedural) ----
  // 120 BPM garage / classic rock: kick-snare, walking bass, power-chord stabs
  const rock = {
    on: false,
    timer: null,
    step: 0,
    master: null,
  };

  function noiseBuf(a, sec) {
    const n = Math.floor(a.sampleRate * sec);
    const buf = a.createBuffer(1, n, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function hiss(dur, vol, freq, type) {
    if (muted) return;
    const a = ac();
    const src = a.createBufferSource();
    src.buffer = noiseBuf(a, dur);
    const f = a.createBiquadFilter();
    f.type = type || "highpass";
    f.frequency.value = freq || 2200;
    const g = a.createGain();
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    src.connect(f).connect(g).connect(a.destination);
    src.start();
    src.stop(a.currentTime + dur + 0.02);
  }
  sfx.leak = () => hiss(0.4, 0.04, 2600, "highpass");
  sfx.n2 = () => hiss(0.5, 0.045, 1400, "bandpass");
  sfx.fan = () => hiss(0.35, 0.03, 800, "bandpass");

  const chant = { on: false, timer: null, nodes: [], master: null, step: 0 };

  function stopChant() {
    chant.on = false;
    if (chant.timer) {
      clearInterval(chant.timer);
      chant.timer = null;
    }
    (chant.nodes || []).forEach((n) => {
      try {
        n.stop();
      } catch (_) {}
    });
    chant.nodes = [];
    if (chant.master) {
      try {
        const a = actx;
        if (a) chant.master.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.35);
      } catch (_) {}
    }
  }

  function startChant() {
    if (muted) return;
    stopChant();
    const a = ac();
    const master = a.createGain();
    master.gain.value = 0.11;
    const delay = a.createDelay();
    delay.delayTime.value = 0.42;
    const fb = a.createGain();
    fb.gain.value = 0.42;
    const wet = a.createGain();
    wet.gain.value = 0.48;
    master.connect(a.destination);
    master.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(a.destination);
    chant.master = master;
    chant.nodes = [];
    function drone(freq, type, vol) {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g).connect(master);
      o.start();
      chant.nodes.push(o);
    }
    drone(73.42, "sine", 0.38);
    drone(110.0, "sine", 0.22);
    drone(146.83, "triangle", 0.1);
    const phrase = [146.83, 174.61, 196.0, 220.0, 196.0, 174.61, 146.83, 130.81, 146.83, 196.0, 174.61, 146.83];
    chant.step = 0;
    chant.on = true;
    function note() {
      if (!chant.on || muted) return;
      const f = phrase[chant.step % phrase.length];
      chant.step += 1;
      const t = a.currentTime;
      const o = a.createOscillator();
      const o2 = a.createOscillator();
      const g = a.createGain();
      o.type = "sine";
      o2.type = "triangle";
      o.frequency.value = f;
      o2.frequency.value = f * 2;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.28);
      g.gain.linearRampToValueAtTime(0.1, t + 1.15);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.55);
      o.connect(g);
      o2.connect(g);
      g.connect(master);
      o.start(t);
      o2.start(t);
      o.stop(t + 2.6);
      o2.stop(t + 2.6);
    }
    note();
    chant.timer = setInterval(note, 1650);
  }

  function rockHit(kind) {
    const a = ac();
    if (!rock.master) {
      rock.master = a.createGain();
      rock.master.gain.value = 0.22;
      rock.master.connect(a.destination);
    }
    const t = a.currentTime;
    if (kind === "kick") {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g).connect(rock.master);
      o.start(t);
      o.stop(t + 0.2);
    } else if (kind === "snare") {
      const src = a.createBufferSource();
      src.buffer = noiseBuf(a, 0.15);
      const g = a.createGain();
      const f = a.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 1800;
      g.gain.setValueAtTime(0.55, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      src.connect(f).connect(g).connect(rock.master);
      src.start(t);
      src.stop(t + 0.15);
      const o = a.createOscillator();
      const g2 = a.createGain();
      o.type = "triangle";
      o.frequency.value = 180;
      g2.gain.setValueAtTime(0.2, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.connect(g2).connect(rock.master);
      o.start(t);
      o.stop(t + 0.1);
    } else if (kind === "hat") {
      const src = a.createBufferSource();
      src.buffer = noiseBuf(a, 0.05);
      const g = a.createGain();
      const f = a.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 7000;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      src.connect(f).connect(g).connect(rock.master);
      src.start(t);
      src.stop(t + 0.05);
    } else if (kind === "bass") {
      const freq = arguments[1] || 55;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = "sawtooth";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      const f = a.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 400;
      o.connect(f).connect(g).connect(rock.master);
      o.start(t);
      o.stop(t + 0.25);
    } else if (kind === "chord") {
      // power chord: root + fifth
      const root = arguments[1] || 110;
      [root, root * 1.5].forEach((freq, i) => {
        const o = a.createOscillator();
        const g = a.createGain();
        o.type = "sawtooth";
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.1 - i * 0.02, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        const f = a.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 1200;
        o.connect(f).connect(g).connect(rock.master);
        o.start(t);
        o.stop(t + 0.4);
      });
    }
  }

  // Classic rock progression in E: E5 A5 G5 D5 (power chords)
  const ROCK_BASS = [82.41, 82.41, 110, 110, 98, 98, 73.42, 73.42]; // E E A A G G D D
  const ROCK_CHORD = [164.81, 164.81, 220, 220, 196, 196, 146.83, 146.83];

  function rockTick() {
    if (!rock.on) return;
    const s = rock.step % 16; // 16th notes at 120bpm → 125ms
    // kick on 1 & 3 (steps 0, 8)
    if (s === 0 || s === 8) rockHit("kick");
    // extra kick on "and" of 2 for drive feel
    if (s === 6 || s === 14) rockHit("kick");
    // snare on 2 & 4
    if (s === 4 || s === 12) rockHit("snare");
    // hats on 8ths
    if (s % 2 === 0) rockHit("hat");
    // bass every quarter
    if (s % 2 === 0) {
      const bi = Math.floor(rock.step / 2) % ROCK_BASS.length;
      rockHit("bass", ROCK_BASS[bi]);
    }
    // power chord stabs on downbeats of each bar half
    if (s === 0 || s === 8) {
      const ci = Math.floor(rock.step / 8) % ROCK_CHORD.length;
      rockHit("chord", ROCK_CHORD[ci]);
    }
    rock.step++;
  }

  function startRockMusic() {
    stopRockMusic();
    ac();
    rock.on = true;
    rock.step = 0;
    // 120 BPM → quarter = 500ms → 16th = 125ms
    rock.timer = setInterval(rockTick, 125);
    rockTick();
  }

  function stopRockMusic() {
    rock.on = false;
    if (rock.timer) {
      clearInterval(rock.timer);
      rock.timer = null;
    }
    if (rock.master) {
      try {
        rock.master.gain.value = 0;
      } catch {}
      rock.master = null;
    }
  }

  // ---- service calls (see service.js) ----
  let serviceCtl = null;

  function startQuiz() {
    if (!window.ServiceCalls || !window.ServiceCalls.start) {
      toast("Service calls didn't load. Hard-refresh.", "bad");
      return;
    }
    if (window.EpaHeat) window.EpaHeat.showLurk(true);
    show("service");
    const host = document.getElementById("screen-service");
    serviceCtl = window.ServiceCalls.start(host, {
      spicy: !!state.spicy,
      extraSpicy: !!state.extraSpicy,
      roastLevel: state.roastLevel,
      onRoast(n) {
        applyRoast(n);
        save();
      },
      onSpicy(v) {
        state.spicy = !!v;
        save();
      },
      onExtra(v) {
        state.extraSpicy = !!v;
        if (v) state.spicy = true;
        save();
      },
      onSfx(kind) {
        if (kind === "win") sfx.win();
      },
      onHub() {
        serviceCtl = null;
        refreshHub();
        show("hub");
      },
      onHook(call) {
        startSandbox({ dispatch: call });
      },
      onComplete({ right, total, stars, ticket }) {
        if (ticket) return;
        const xp = right * 45 + Math.round(stars * 15);
        state.xp += xp;
        if (window.Badges && stars >= 4) window.Badges.unlock("service_star");
        markDaily("service", { stars: stars });
        const ticketPay = right * PAY.serviceTicket + (stars >= 4 ? 80 : 0);
        if (ticketPay > 0) {
          state.jobsCompleted += 1;
          pay(ticketPay, "service");
        }
        save();
        postCompete("score", { mode: "service", score: right * 100 + Math.round(stars * 50) });
        if (ticketPay > 0) {
          showPayStub({
            title: "Service route closed",
            body: right + "/" + total + " solid calls · rating " + "★".repeat(Math.round(stars)) + "☆".repeat(5 - Math.round(stars)),
            amount: ticketPay,
            xp,
            onClose() {
              serviceCtl = null;
              refreshHub();
              show("hub");
            },
          });
        } else {
          sfx.win();
        }
      },
    });
  }

  // ---- STREET MODE ----
  const street = {
    x: 80,
    y: 0,
    vx: 0,
    vy: 0,
    facing: 1,
    hp: 100,
    ammo: 12,
    mag: 12,
    reserve: 48,
    reloading: 0,
    gunCd: 0,
    flameCd: 0,
    iceCd: 0,
    iceCharges: 3,
    kills: 0,
    score: 0,
    wave: 1,
    spawnT: 0,
    anim: 0,
    over: false,
    win: false,
    boss: null,
    mobs: [],
    sparks: [],
    pickups: [],
    msg: "",
    msgT: 0,
  };

  function resetStreet() {
    Object.assign(street, {
      x: 80,
      y: 0,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      ammo: 12,
      mag: 12,
      reserve: 48,
      reloading: 0,
      gunCd: 0,
      flameCd: 0,
      iceCd: 0,
      iceCharges: state.gaugesOfGod ? 5 : 2,
      kills: 0,
      score: 0,
      wave: 1,
      spawnT: 0,
      anim: 0,
      over: false,
      win: false,
      boss: null,
      mobs: [],
      sparks: [],
      pickups: [],
      msg: "Wave 1 — clear the block",
      msgT: 2.5,
    });
  }

  function streetMsg(t, sec) {
    street.msg = t;
    street.msgT = sec || 2;
  }

  function spawnMob(kind, x) {
    const isBoss = kind === "boss";
    street.mobs.push({
      x: x,
      y: 0,
      vx: isBoss ? -55 : kind === "alien" ? -140 - street.wave * 6 : -85 - street.wave * 4,
      hp: isBoss ? 40 + street.wave * 8 : kind === "alien" ? 2 + Math.floor(street.wave / 2) : 3 + Math.floor(street.wave / 2),
      maxHp: 0,
      kind,
      frozen: 0,
      frame: 0,
    });
    street.mobs[street.mobs.length - 1].maxHp = street.mobs[street.mobs.length - 1].hp;
  }

  function updateStreet(dt) {
    const p = street;
    if (p.over) return;
    const k = keys;
    let ax = 0;
    if (k.has("KeyA") || k.has("ArrowLeft")) ax -= 1;
    if (k.has("KeyD") || k.has("ArrowRight")) ax += 1;
    p.vx += (ax * 420 - p.vx) * 8 * dt;
    if (ax) p.facing = ax > 0 ? 1 : -1;
    if ((k.has("Space") || k.has("KeyW") || k.has("ArrowUp")) && p.y >= -1) {
      p.vy = -620;
    }
    p.vy += 1600 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.y > 0) {
      p.y = 0;
      p.vy = 0;
    }
    p.x = Math.max(40, Math.min(9000, p.x));
    p.gunCd = Math.max(0, p.gunCd - dt);
    p.flameCd = Math.max(0, p.flameCd - dt);
    p.iceCd = Math.max(0, p.iceCd - dt);
    p.reloading = Math.max(0, p.reloading - dt);
    p.msgT = Math.max(0, p.msgT - dt);
    p.anim += dt * (Math.abs(p.vx) > 40 ? 10 : 4);

    // reload
    if ((k.has("KeyR") || (p.ammo === 0 && k.has("KeyF"))) && p.reloading <= 0 && p.ammo < p.mag && p.reserve > 0) {
      p.reloading = 1.1;
      sfx.reload();
      streetMsg("Reloading…", 1.1);
    }
    if (p.reloading > 0 && p.reloading - dt <= 0) {
      const need = p.mag - p.ammo;
      const take = Math.min(need, p.reserve);
      p.ammo += take;
      p.reserve -= take;
    }

    // gun
    if ((k.has("KeyF") || k.has("KeyK")) && p.reloading <= 0 && p.gunCd <= 0) {
      if (p.ammo > 0) {
        p.gunCd = 0.11;
        p.ammo--;
        sfx.gun();
        p.sparks.push({
          x: p.x + p.facing * 42,
          y: p.y - 52,
          vx: p.facing * (980 + Math.random() * 80),
          vy: -12 + Math.random() * 24,
          life: 0.55,
          kind: "gun",
          dmg: 1.6,
        });
      } else if (p.reserve > 0) {
        p.reloading = 1.1;
        sfx.reload();
      }
    }

    // flame
    if (k.has("KeyJ")) {
      p.flameCd += dt;
      if (p.flameCd > 0.08) {
        p.flameCd = 0;
        sfx.flame();
        for (let i = 0; i < 3; i++) {
          p.sparks.push({
            x: p.x + p.facing * 36,
            y: p.y - 48,
            vx: p.facing * (380 + Math.random() * 160),
            vy: -40 + Math.random() * 80,
            life: 0.3,
            kind: "flame",
            dmg: 0.9,
          });
        }
      }
    }

    // ice
    if ((k.has("KeyG") || k.has("KeyL")) && p.iceCd <= 0 && p.iceCharges > 0) {
      p.iceCd = 1.6;
      p.iceCharges--;
      sfx.ice();
      for (let i = 0; i < 10; i++) {
        p.sparks.push({
          x: p.x + p.facing * 20,
          y: p.y - 50,
          vx: p.facing * (280 + Math.random() * 220),
          vy: -120 + Math.random() * 160,
          life: 0.5,
          kind: "ice",
          dmg: 0,
        });
      }
    }

    // sparks move
    for (const s of p.sparks) {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
    }
    p.sparks = p.sparks.filter((s) => s.life > 0);

    // spawns
    const targetMobs = 6 + p.wave * 2;
    p.spawnT += dt;
    if (!p.boss && p.mobs.length < targetMobs && p.spawnT > Math.max(0.45, 1.2 - p.wave * 0.08)) {
      p.spawnT = 0;
      const kind = Math.random() > 0.4 ? "alien" : "zombie";
      spawnMob(kind, p.x + 700 + Math.random() * 500);
    }

    // wave clear → next or boss
    if (!p.boss && p.kills >= 8 + p.wave * 6) {
      if (p.wave % 3 === 0) {
        p.boss = true;
        spawnMob("boss", p.x + 800);
        streetMsg("BOSS — rogue RTU on legs", 3);
        sfx.boom();
      } else {
        p.wave++;
        p.reserve += 24;
        p.iceCharges = Math.min(5, p.iceCharges + 1);
        streetMsg("Wave " + p.wave + " — +ammo", 2.2);
        sfx.pickup();
      }
    }

    // mobs
    for (const m of p.mobs) {
      m.frozen = Math.max(0, m.frozen - dt);
      m.frame += dt * 8;
      if (m.frozen <= 0) m.x += m.vx * dt;
      for (const s of p.sparks) {
        if (Math.abs(s.x - m.x) < (m.kind === "boss" ? 60 : 38) && Math.abs(s.y - (m.y - 40)) < 55) {
          if (s.kind === "ice") {
            m.frozen = m.kind === "boss" ? 1.2 : 1.8;
            s.life = 0;
          } else {
            m.hp -= s.dmg;
            s.life = 0;
          }
        }
      }
      // flame cone
      if (k.has("KeyJ") && Math.abs(m.x - (p.x + p.facing * 90)) < 160 && Math.abs(m.y - p.y) < 70) {
        m.hp -= 5 * dt;
      }
      // contact
      if (Math.abs(m.x - p.x) < (m.kind === "boss" ? 50 : 34) && Math.abs(m.y - p.y) < 50 && m.frozen <= 0) {
        p.hp -= (m.kind === "boss" ? 28 : 16) * dt;
      }
    }

    // deaths
    for (let i = p.mobs.length - 1; i >= 0; i--) {
      if (p.mobs[i].hp <= 0) {
        const m = p.mobs[i];
        sfx.boom();
        p.kills++;
        p.score += m.kind === "boss" ? 500 : m.kind === "alien" ? 100 : 75;
        // pickups
        if (Math.random() < 0.35 || m.kind === "boss") {
          const types = ["ammo", "health", "ice"];
          p.pickups.push({
            x: m.x,
            y: -20,
            kind: m.kind === "boss" ? "ammo" : types[(Math.random() * 3) | 0],
            life: 12,
          });
        }
        if (m.kind === "boss") {
          p.boss = null;
          p.wave++;
          p.score += 250;
          streetMsg("RTU down. Wave " + p.wave, 2.5);
          p.reserve += 36;
          p.iceCharges = Math.min(6, p.iceCharges + 2);
        }
        p.mobs.splice(i, 1);
      }
    }

    // pickups
    for (const pk of p.pickups) {
      pk.life -= dt;
      if (Math.abs(pk.x - p.x) < 36 && Math.abs(pk.y - p.y) < 50) {
        if (pk.kind === "ammo") {
          p.reserve += 18;
          streetMsg("+18 rounds", 1.2);
        }
        if (pk.kind === "health") {
          p.hp = Math.min(100, p.hp + 30);
          streetMsg("+30 HP", 1.2);
        }
        if (pk.kind === "ice") {
          p.iceCharges = Math.min(6, p.iceCharges + 2);
          streetMsg("+ice charges", 1.2);
        }
        sfx.pickup();
        pk.life = 0;
      }
    }
    p.pickups = p.pickups.filter((pk) => pk.life > 0);

    if (p.hp <= 0) {
      p.hp = 0;
      p.over = true;
      endStreet(false);
    } else if (p.wave > 9) {
      p.win = true;
      p.over = true;
      endStreet(true);
    }
  }

  function endStreet(win) {
    state.kills += street.kills;
    state.xp += Math.min(200, Math.floor(street.score / 10) + (win ? 80 : 20));
    state.bestStreet = Math.max(state.bestStreet, street.score);
    save();
    stopRockMusic();
    const ov = getOverlay();
    if (!ov) return;
    ov.classList.remove("hidden");
    const t = document.getElementById("ov-title");
    const b = document.getElementById("ov-body");
    const r = document.getElementById("ov-resume");
    if (t) t.textContent = win ? "Block secured" : "Down";
    if (b) b.textContent =
      "Score " + street.score + " · " + street.kills + " KOs · Wave " + street.wave + (win ? " · +All-Star progress" : "");
    if (r) {
      r.textContent = "Run it again";
      r.onclick = () => {
        ov.classList.add("hidden");
        resetStreet();
        startRockMusic();
        last = performance.now();
        loop(last);
      };
    }
  }

  function drawStreet(ctx, w, h) {
    const p = street;
    const ground = h * 0.78;
    const cam = p.x - w * 0.28;
    // bg
    if (img.street.complete) {
      const pw = h * (img.street.naturalWidth / img.street.naturalHeight);
      const ox = -((cam * 0.35) % pw);
      ctx.drawImage(img.street, ox, 0, pw, h);
      ctx.drawImage(img.street, ox + pw - 1, 0, pw, h);
    } else {
      ctx.fillStyle = "#1b2430";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = "rgba(11,18,32,0.35)";
    ctx.fillRect(0, ground, w, h - ground);

    // pickups
    for (const pk of p.pickups) {
      ctx.fillStyle = pk.kind === "ammo" ? "#e8c450" : pk.kind === "health" ? "#7fd99a" : "#7ec8d3";
      ctx.beginPath();
      ctx.arc(pk.x - cam, ground + pk.y - 10, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // sparks
    for (const s of p.sparks) {
      if (s.kind === "gun") {
        ctx.fillStyle = "#e8c450";
        ctx.fillRect(s.x - cam, ground + s.y - 2, 10, 3);
      } else {
        ctx.fillStyle = s.kind === "ice" ? "rgba(126,200,211,0.9)" : "rgba(255,140,40,0.9)";
        ctx.fillRect(s.x - cam, ground + s.y - 6, 7, 7);
      }
    }

    // mobs
    for (const m of p.mobs) {
      const sheet = m.kind === "alien" || m.kind === "boss" ? "ali" : "zom";
      const fr = 1 + (Math.floor(m.frame) % 4);
      const im = img[sheet + fr];
      const mx = m.x - cam;
      const scale = m.kind === "boss" ? 1.55 : 1;
      const mw = 88 * scale;
      const mh = 114 * scale;
      const my = ground + m.y - mh;
      if (m.frozen) ctx.filter = "hue-rotate(160deg) brightness(1.2)";
      if (im && im.complete) ctx.drawImage(im, mx - mw / 2, my, mw, mh);
      ctx.filter = "none";
      // hp bar for boss
      if (m.kind === "boss") {
        ctx.fillStyle = "#000";
        ctx.fillRect(mx - 40, my - 12, 80, 6);
        ctx.fillStyle = "#f07178";
        ctx.fillRect(mx - 40, my - 12, 80 * (m.hp / m.maxHp), 6);
      }
    }

    // hero
    const fi = 1 + (Math.floor(p.anim) % 4);
    const hero = Math.abs(p.vx) > 40 ? img["run" + fi] : img["idle" + fi];
    const hx = p.x - cam;
    const hy = ground + p.y - 118;
    if (hero && hero.complete) {
      ctx.save();
      if (p.facing < 0) {
        ctx.translate(hx, hy);
        ctx.scale(-1, 1);
        ctx.drawImage(hero, -48, 0, 96, 120);
      } else ctx.drawImage(hero, hx - 48, hy, 96, 120);
      ctx.restore();
    }
    // pistol
    if (img.pistol.complete) {
      const pw = 42;
      const ph = pw * (img.pistol.naturalHeight / img.pistol.naturalWidth);
      ctx.save();
      if (p.facing < 0) {
        ctx.translate(hx, hy + 58);
        ctx.scale(-1, 1);
        ctx.drawImage(img.pistol, 10, 0, pw, ph);
      } else ctx.drawImage(img.pistol, hx + 10, hy + 58, pw, ph);
      ctx.restore();
    }
    // muzzle
    if (keys.has("KeyF") && p.ammo > 0 && p.reloading <= 0) {
      const mz = img["mz" + (1 + (Math.floor(performance.now() / 50) % 4))];
      if (mz && mz.complete) {
        ctx.save();
        if (p.facing < 0) {
          ctx.translate(hx, hy + 62);
          ctx.scale(-1, 1);
          ctx.drawImage(mz, 40, -8, 36, 28);
        } else ctx.drawImage(mz, hx + 40, hy + 54, 36, 28);
        ctx.restore();
      }
    }
    // flame cone
    if (keys.has("KeyJ")) {
      const range = 180;
      const grd = ctx.createLinearGradient(hx, hy + 50, hx + p.facing * range, hy + 50);
      grd.addColorStop(0, "rgba(255,180,40,0.85)");
      grd.addColorStop(1, "rgba(255,60,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(hx + p.facing * 20, hy + 42);
      ctx.lineTo(hx + p.facing * range, hy + 18);
      ctx.lineTo(hx + p.facing * range, hy + 78);
      ctx.closePath();
      ctx.fill();
    }
  }

  // ---- ARENA MODE ----
  const arena = {
    x: 0,
    z: 0,
    yaw: 0,
    speed: 0,
    hp: 100,
    ammo: 60,
    mag: 60,
    reserve: 120,
    reloading: 0,
    gunCd: 0,
    flame: 0,
    iceCd: 0,
    iceCharges: 3,
    kills: 0,
    score: 0,
    wave: 1,
    over: false,
    bots: [],
    sparks: [],
    msg: "",
    msgT: 0,
  };

  function resetArena() {
    const v = currentVehicle();
    Object.assign(arena, {
      x: 0,
      z: 0,
      yaw: 0,
      speed: 0,
      hp: Math.round(100 * v.hpMult),
      maxHp: Math.round(100 * v.hpMult),
      ammo: 60,
      mag: 60,
      reserve: 120,
      reloading: 0,
      gunCd: 0,
      flame: 0,
      iceCd: 0,
      iceCharges: state.gaugesOfGod ? 5 : 2,
      kills: 0,
      score: 0,
      wave: 1,
      over: false,
      bots: [],
      sparks: [],
      msg: v.name + " online — clear the yard",
      msgT: 2.5,
      vehSpeed: v.speed,
    });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      arena.bots.push({
        x: Math.cos(a) * 420,
        z: Math.sin(a) * 420,
        yaw: a + Math.PI,
        hp: i % 3 === 0 ? 10 : 4,
        maxHp: i % 3 === 0 ? 10 : 4,
        kind: i % 3 === 0 ? "car" : "walk",
        frozen: 0,
      });
    }
  }

  function updateArena(dt) {
    const c = arena;
    if (c.over) return;
    const k = keys;
    let steer = 0;
    if (k.has("KeyA") || k.has("ArrowLeft")) steer += 1;
    if (k.has("KeyD") || k.has("ArrowRight")) steer -= 1;
    const vMul = c.vehSpeed || 1;
    if (k.has("KeyW") || k.has("ArrowUp")) c.speed += 520 * vMul * dt;
    if (k.has("KeyS") || k.has("ArrowDown")) c.speed -= 640 * vMul * dt;
    c.speed *= Math.pow(0.24, dt);
    const maxSpd = 420 * vMul;
    c.speed = Math.max(-140 * vMul, Math.min(maxSpd, c.speed));
    const speedFactor = Math.min(1, Math.abs(c.speed) / 180);
    const reverse = c.speed >= 0 ? 1 : -1;
    c.yaw += steer * 2.6 * Math.max(0.25, speedFactor) * reverse * dt;
    const fx = Math.sin(c.yaw);
    const fz = -Math.cos(c.yaw);
    c.x += fx * c.speed * dt;
    c.z += fz * c.speed * dt;
    const lim = 900;
    c.x = Math.max(-lim, Math.min(lim, c.x));
    c.z = Math.max(-lim, Math.min(lim, c.z));
    c.gunCd = Math.max(0, c.gunCd - dt);
    c.iceCd = Math.max(0, c.iceCd - dt);
    c.reloading = Math.max(0, c.reloading - dt);
    c.msgT = Math.max(0, c.msgT - dt);

    if ((k.has("KeyR") || (c.ammo === 0 && k.has("KeyF"))) && c.reloading <= 0 && c.ammo < c.mag && c.reserve > 0) {
      c.reloading = 1.4;
      sfx.reload();
      c.msg = "Reloading guns…";
      c.msgT = 1.4;
    }
    if (c.reloading > 0 && c.reloading - dt <= 0) {
      const need = c.mag - c.ammo;
      const take = Math.min(need, c.reserve);
      c.ammo += take;
      c.reserve -= take;
    }

    // guns
    if ((k.has("KeyF") || k.has("KeyK")) && c.reloading <= 0 && c.gunCd <= 0) {
      if (c.ammo > 0) {
        c.gunCd = 0.09;
        c.ammo--;
        sfx.gun();
        const spread = (Math.random() - 0.5) * 0.1;
        const sx = Math.sin(c.yaw + spread);
        const sz = -Math.cos(c.yaw + spread);
        c.sparks.push({
          x: c.x + fx * 70,
          z: c.z + fz * 70,
          vx: sx * 780,
          vz: sz * 780,
          life: 0.7,
          kind: "gun",
          dmg: 1.8,
        });
      }
    }

    // flame
    if (k.has("Space") || k.has("KeyJ")) {
      c.flame += dt;
      if (c.flame > 0.07) {
        c.flame = 0;
        sfx.flame();
        c.sparks.push({
          x: c.x + fx * 50,
          z: c.z + fz * 50,
          vx: fx * 380,
          vz: fz * 380,
          life: 0.32,
          kind: "flame",
          dmg: 1.2,
        });
      }
    }

    // ice
    if (k.has("KeyG") && c.iceCd <= 0 && c.iceCharges > 0) {
      c.iceCd = 1.8;
      c.iceCharges--;
      sfx.ice();
      for (let i = -2; i <= 2; i++) {
        const a = c.yaw + i * 0.12;
        c.sparks.push({
          x: c.x,
          z: c.z,
          vx: Math.sin(a) * 420,
          vz: -Math.cos(a) * 420,
          life: 0.55,
          kind: "ice",
          dmg: 0,
        });
      }
    }

    for (const s of c.sparks) {
      s.x += s.vx * dt;
      s.z += s.vz * dt;
      s.life -= dt;
    }
    c.sparks = c.sparks.filter((s) => s.life > 0);

    for (const b of c.bots) {
      b.frozen = Math.max(0, b.frozen - dt);
      if (b.frozen <= 0) {
        const dx = c.x - b.x;
        const dz = c.z - b.z;
        const ang = Math.atan2(dx, -dz);
        b.yaw += Math.atan2(Math.sin(ang - b.yaw), Math.cos(ang - b.yaw)) * 2 * dt;
        const sp = b.kind === "car" ? 130 + c.wave * 8 : 70 + c.wave * 5;
        b.x += Math.sin(b.yaw) * sp * dt;
        b.z += -Math.cos(b.yaw) * sp * dt;
      }
      for (const s of c.sparks) {
        const ddx = s.x - b.x;
        const ddz = s.z - b.z;
        if (ddx * ddx + ddz * ddz < 55 * 55) {
          if (s.kind === "ice") {
            b.frozen = 2;
            s.life = 0;
          } else {
            b.hp -= s.dmg;
            s.life = 0;
          }
        }
      }
      if (k.has("Space") || k.has("KeyJ")) {
        const nx = c.x + fx * 90;
        const nz = c.z + fz * 90;
        const ddx = b.x - nx;
        const ddz = b.z - nz;
        if (ddx * ddx + ddz * ddz < 120 * 120) b.hp -= 5 * dt;
      }
      const hitx = b.x - c.x;
      const hitz = b.z - c.z;
      if (hitx * hitx + hitz * hitz < 48 * 48) {
        c.hp -= (b.kind === "car" ? 22 : 10) * dt;
        c.speed *= 0.98;
      }
    }

    for (let i = c.bots.length - 1; i >= 0; i--) {
      if (c.bots[i].hp <= 0) {
        sfx.boom();
        c.kills++;
        c.score += c.bots[i].kind === "car" ? 150 : 80;
        const a = Math.random() * Math.PI * 2;
        const kind = c.bots[i].kind;
        c.bots[i] = {
          x: Math.cos(a) * 700,
          z: Math.sin(a) * 700,
          yaw: a + Math.PI,
          hp: kind === "car" ? 10 + c.wave * 2 : 4 + c.wave,
          maxHp: kind === "car" ? 10 + c.wave * 2 : 4 + c.wave,
          kind,
          frozen: 0,
        };
        if (c.kills % 10 === 0) {
          c.wave++;
          c.reserve += 40;
          c.msg = "Wave " + c.wave + " — denser yard";
          c.msgT = 2;
        }
      }
    }

    if (c.hp <= 0) {
      c.hp = 0;
      c.over = true;
      state.kills += c.kills;
      state.xp += Math.min(160, Math.floor(c.score / 12) + 15);
      state.bestArena = Math.max(state.bestArena, c.score);
      save();
      stopRockMusic();
      const ov = getOverlay();
      if (!ov) return;
      ov.classList.remove("hidden");
      const t = document.getElementById("ov-title");
      const b = document.getElementById("ov-body");
      const r = document.getElementById("ov-resume");
      if (t) t.textContent = "Wrecked";
      if (b) b.textContent = c.kills + " taken out · Score " + c.score + " · Wave " + c.wave;
      if (r) {
        r.textContent = "Restart";
        r.onclick = () => {
          ov.classList.add("hidden");
          resetArena();
          startRockMusic();
          last = performance.now();
          loop(last);
        };
      }
    }
  }

  function drawArena(ctx, w, h) {
    const c = arena;
    ctx.save();
    ctx.translate(w / 2, h * 0.66);
    ctx.rotate(-c.yaw);
    ctx.translate(-c.x, -c.z);
    if (img.arena.complete) ctx.drawImage(img.arena, -1100, -1100, 2200, 2200);
    else {
      ctx.fillStyle = "#2a241c";
      ctx.fillRect(-1100, -1100, 2200, 2200);
    }
    ctx.strokeStyle = "rgba(201,164,108,0.35)";
    ctx.strokeRect(-900, -900, 1800, 1800);

    for (const s of c.sparks) {
      ctx.fillStyle = s.kind === "gun" ? "#e8c450" : s.kind === "ice" ? "rgba(126,200,211,0.9)" : "rgba(255,140,40,0.9)";
      ctx.beginPath();
      ctx.arc(s.x, s.z, s.kind === "gun" ? 3.5 : s.kind === "ice" ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const b of c.bots) {
      ctx.save();
      ctx.translate(b.x, b.z);
      ctx.rotate(b.yaw);
      if (b.kind === "car") {
        ctx.fillStyle = b.frozen ? "#7ec8d3" : "#5a2a24";
        ctx.fillRect(-18, -28, 36, 56);
        ctx.fillStyle = "#c9a46c";
        ctx.fillRect(-14, -32, 8, 8);
        ctx.fillRect(6, -32, 8, 8);
      } else {
        const im = img.zom1;
        if (b.frozen) ctx.filter = "hue-rotate(160deg)";
        if (im && im.complete) ctx.drawImage(im, -22, -28, 44, 56);
        ctx.filter = "none";
      }
      ctx.restore();
    }
    ctx.restore();

    // flame overlay
    if (keys.has("Space") || keys.has("KeyJ")) {
      const grd = ctx.createLinearGradient(w / 2, h * 0.5, w / 2, h * 0.18);
      grd.addColorStop(0, "rgba(255,170,40,0.8)");
      grd.addColorStop(1, "rgba(255,40,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 16, h * 0.52);
      ctx.lineTo(w / 2 + 16, h * 0.52);
      ctx.lineTo(w / 2 + 40, h * 0.18);
      ctx.lineTo(w / 2 - 40, h * 0.18);
      ctx.closePath();
      ctx.fill();
    }

    const v = currentVehicle();
    const sprite = img[v.imgKey] && img[v.imgKey].complete ? img[v.imgKey] : img.falcon;
    if (sprite && sprite.complete) {
      const fh = Math.min(v.id === "van" ? 230 : 210, h * (v.id === "van" ? 0.38 : 0.34));
      const fw = fh * (sprite.naturalWidth / sprite.naturalHeight);
      ctx.drawImage(sprite, w / 2 - fw / 2, h * 0.66 - fh * 0.72, fw, fh);
      // hood gun only on Falcon
      if (v.id === "falcon" && img.hood && img.hood.complete) {
        const gh = fh * 0.42;
        const gw = gh * (img.hood.naturalWidth / img.hood.naturalHeight);
        ctx.drawImage(img.hood, w / 2 - gw / 2, h * 0.66 - fh * 0.78 - gh * 0.35, gw, gh);
      }
      if (keys.has("KeyF") && c.ammo > 0) {
        const mz = img["mz" + (1 + (Math.floor(performance.now() / 40) % 4))];
        if (mz && mz.complete) ctx.drawImage(mz, w / 2 - 22, h * 0.66 - fh * 0.95, 44, 36);
      }
    }
  }

  // ---- HUD / loop ----
  function getOverlay() {
    return document.getElementById("overlay");
  }

  function updateHud() {
    const isStreet = mode === "street";
    const p = isStreet ? street : arena;
    const modeEl = document.getElementById("hud-mode");
    if (!modeEl) return;
    modeEl.textContent = isStreet
      ? "Street"
      : currentVehicle().label;
    document.getElementById("hud-wave").textContent = "Wave " + p.wave;
    document.getElementById("hud-score").textContent = p.score;
    const maxHp = p.maxHp || 100;
    document.getElementById("hp-fill").style.width = Math.max(0, Math.min(100, (p.hp / maxHp) * 100)) + "%";
    document.getElementById("hp-txt").textContent = Math.round(p.hp);
    const ammoPct = (p.ammo / p.mag) * 100;
    document.getElementById("ammo-fill").style.width = ammoPct + "%";
    document.getElementById("ammo-txt").textContent = p.ammo + " / " + p.reserve + (p.reloading > 0 ? " …" : "");
    document.getElementById("hud-msg").textContent = p.msgT > 0 ? p.msg : p.iceCharges ? "Ice ×" + p.iceCharges : "";
  }

  function loop(now) {
    if (state.screen !== "game") return;
    let dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (mode === "street") updateStreet(dt);
    else updateArena(dt);
    updateHud();

    const canvas = document.getElementById("game");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (mode === "street") drawStreet(ctx, w, h);
    else drawArena(ctx, w, h);

    raf = requestAnimationFrame(loop);
  }

  function startMode(m) {
    toast("Driving is retired. Use sandbox, quiz, and AI helper.", "ok");
    refreshHub();
    show("hub");
  }

  // ---- UI wiring ----
  function initUI() {
    load();
    bootAssets();

    document.querySelectorAll(".vehicle-card").forEach((btn) => {
      btn.onclick = () => {
        setVehicle(btn.dataset.vehicle);
        ac();
        sfx.pickup();
      };
    });
    setVehicle(state.vehicle || "falcon");

    // Returning player: show Continue
    const btnCont = document.getElementById("btn-continue");
    if (btnCont && state.callsign) {
      btnCont.classList.remove("hidden");
      btnCont.textContent = "Log in as " + state.callsign;
      btnCont.onclick = () => {
        ac();
        enterShopFloor(state.callsign);
      };
    }

    const startBtn = document.getElementById("btn-start");
    if (startBtn) {
      startBtn.onclick = () => {
        ac();
        enterShopFloor(state.callsign || "Guest");
        toast("On the floor. Locker is optional — tap Locker anytime.", "ok");
      };
    }
    try {
      const q = new URLSearchParams(location.search);
      if (q.get("demo") === "1" || q.get("demo") === "lincoln" || q.get("try") === "1") {
        if (!(window.LtBrand && window.LtBrand.isStore)) {
          state.callsign = state.callsign || "Campus demo";
          state.campus = state.campus || "shop";
        }
        enterShopFloor(state.callsign || "Guest");
      }
    } catch (_) {}
    const closeClock = document.getElementById("btn-close-clockin");
    const miniIn = document.getElementById("btn-clockin-mini");
    if (closeClock) {
      closeClock.onclick = (e) => {
        e.stopPropagation();
        const card = document.getElementById("title-card");
        if (card) card.classList.add("hidden");
        if (miniIn) miniIn.classList.remove("hidden");
      };
    }
    if (miniIn) {
      miniIn.onclick = () => {
        const card = document.getElementById("title-card");
        if (card) card.classList.remove("hidden");
        miniIn.classList.add("hidden");
      };
    }

    const tipDismiss = document.getElementById("hub-tip-dismiss");
    if (tipDismiss) {
      tipDismiss.onclick = () => {
        state.seenTip = true;
        save();
        const tip = document.getElementById("hub-tip");
        if (tip) tip.classList.add("hidden");
      };
    }
    const tipTour = document.getElementById("hub-tip-tour");
    if (tipTour) {
      tipTour.onclick = () => {
        state.seenTip = true;
        save();
        const tip = document.getElementById("hub-tip");
        if (tip) tip.classList.add("hidden");
        startTutorial();
      };
    }
    const howto = document.getElementById("hub-howto");
    if (howto) howto.onclick = () => startTutorial();

    const inp = document.getElementById("callsign");
    const btnIn = document.getElementById("btn-clockin");
    const photoInp = document.getElementById("char-photo");
    const preview = document.getElementById("char-preview");
    if (preview) {
      preview.removeAttribute("src");
      preview.classList.add("char-preview-empty");
      preview.alt = "No photo yet";
    }
    if (state.campus) {
      const csel = document.getElementById("campus");
      if (csel) csel.value = state.campus;
    }
    if (state.classSection) {
      const cs = document.getElementById("class-section");
      if (cs) cs.value = state.classSection;
    }
    document.querySelectorAll(".char-look").forEach((b) => {
      b.classList.toggle("on", b.dataset.look === (state.look || "hardhat"));
      b.onclick = () => {
        document.querySelectorAll(".char-look").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        state.look = b.dataset.look;
      };
    });
    if (photoInp) {
      photoInp.onchange = () => {
        const file = photoInp.files && photoInp.files[0];
        if (!file) return;
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 256;
          canvas.height = 256;
          const ctx = canvas.getContext("2d");
          const m = Math.min(img.width, img.height);
          ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, 256, 256);
          state.photo = canvas.toDataURL("image/jpeg", 0.82);
          if (preview) {
            preview.src = state.photo;
            preview.classList.remove("char-preview-empty");
          }
          URL.revokeObjectURL(url);
        };
        img.src = url;
      };
    }
    if (inp) {
      inp.oninput = () => {
        if (btnIn) btnIn.disabled = !inp.value.trim();
        refreshAcctHint();
      };
    }
    const passListen = document.getElementById("acct-pass");
    if (passListen) passListen.oninput = () => { if (btnIn && inp.value.trim()) btnIn.disabled = false; };
    function refreshAcctHint() {
      if (!inp || !btnIn) return;
      const name = inp.value.trim();
      const key = accountKey(name);
      const existing = loadAccounts()[key];
      const wrap2 = document.getElementById("acct-pass2-wrap");
      const hint = document.getElementById("acct-hint");
      const isHubLogin = isHubName(name);
      if (wrap2) wrap2.classList.toggle("hidden", !!(existing && existing.passHash));
      if (hint) {
        if (existing && existing.passHash) hint.textContent = "Locker found. Enter your password. Forgot it? Reset this locker on this device.";
        else hint.textContent = "New locker. Type a password, confirm it, then Create locker. Min 4 characters. HUB picks a password too.";
      }
      btnIn.textContent = existing && existing.passHash ? "Log in · clock in" : "Create locker · clock in";
    }
    refreshAcctHint();
    btnIn.onclick = () => {
      const name = inp.value.trim();
      if (!name) return;
      const pwEl = document.getElementById("acct-pass");
      const pw2El = document.getElementById("acct-pass2");
      const pw = pwEl ? pwEl.value : "";
      const pw2 = pw2El ? pw2El.value : "";
      if (state.sessionOk && accountKey(name) === accountKey(state.callsign) && !pw) {
        state.spec = document.getElementById("spec").value;
        const camp = document.getElementById("campus");
        if (camp) state.campus = camp.value;
        const sec = document.getElementById("class-section");
        if (sec) state.classSection = sec.value.trim();
        const onLook = document.querySelector(".char-look.on");
        if (onLook) state.look = onLook.dataset.look;
        save();
        refreshHub();
        show("hub");
        toast("Shop floor · pick a game", "ok");
        return;
      }
      if (!pw || pw.length < 4) {
        toast("Password must be at least 4 characters", "bad");
        return;
      }
      if (!window.crypto || !crypto.subtle) {
        toast("This browser can't store passwords safely", "bad");
        return;
      }
      const key = accountKey(name);
      const map = loadAccounts();
      const existing = map[key];
      (async () => {
        if (existing && existing.passHash) {
          const ok = await verifyPassRecord(pw, existing.passHash);
          if (!ok) {
            toast("Wrong password for that locker", "bad");
            return;
          }
          applyAccount(existing);
          state.passHash = await makePassRecord(pw);
          state.sessionOk = true;
          if (isHubName(name)) state.hubAuthed = true;
          if (pwEl) pwEl.value = "";
          if (pw2El) pw2El.value = "";
          save();
          refreshHub();
          show("hub");
          toast("Shop floor · pick a game (sandbox, quiz, electrical)", "ok");
          return;
        }
        if (pw !== pw2) {
          toast("Passwords don't match", "bad");
          return;
        }
        state.callsign = name;
        state.passHash = await makePassRecord(pw);
        state.spec = document.getElementById("spec").value;
        const camp = document.getElementById("campus");
        if (camp) state.campus = camp.value;
        const sec = document.getElementById("class-section");
        if (sec) state.classSection = sec.value.trim();
        const onLook = document.querySelector(".char-look.on");
        if (onLook) state.look = onLook.dataset.look;
        state.hubAuthed = isHubName(name);
        state.sessionOk = true;
        if (isHub()) state.pendingRapture = true;
        if (pwEl) pwEl.value = "";
        if (pw2El) pw2El.value = "";
        save();
        if (window.Badges) window.Badges.unlock("first_clock");
        postCompete("profile");
        refreshHub();
        show("hub");
        toast("Shop floor · pick a game (sandbox, quiz, electrical)", "ok");
      })().catch(() => toast("Password check failed", "bad"));
    };
    const logoutBtn = document.getElementById("hub-logout");
    if (logoutBtn) logoutBtn.onclick = () => logoutAccount();
    const resetBtn = document.getElementById("acct-reset");
    if (resetBtn) {
      resetBtn.onclick = () => {
        const name = inp.value.trim();
        if (!name) {
          toast("Type the locker name first", "bad");
          return;
        }
        const map = loadAccounts();
        const key = accountKey(name);
        if (!map[key]) {
          toast("No locker with that name on this device", "ok");
          return;
        }
        delete map[key];
        writeAccounts(map);
        if (accountKey(state.callsign) === key) {
          state.passHash = "";
          state.sessionOk = false;
          state.hubAuthed = false;
        }
        const p2 = document.getElementById("acct-pass2-wrap");
        if (p2) p2.classList.remove("hidden");
        refreshAcctHint();
        toast("Locker cleared. Create a new password.", "ok");
      };
    }
    const locker = document.getElementById("hub-locker");
    if (locker) {
      locker.onclick = () => {
        show("character");
        if (inp && state.callsign) {
          inp.value = state.callsign;
          btnIn.disabled = false;
          btnIn.textContent = "Save locker · back to shop";
          refreshAcctHint();
        }
      };
    }
    const formBtn = document.getElementById("hub-form-toggle");
    if (formBtn) {
      formBtn.textContent = window.LtForm && window.LtForm.isPc ? "Phone layout" : "PC bench";
      formBtn.onclick = () => {
        if (window.LtForm) window.LtForm.set(window.LtForm.isPc ? "phone" : "pc");
      };
    }

    const hubRoast = document.getElementById("hub-roast");
    if (hubRoast) {
      applyRoast(state.roastLevel);
      hubRoast.oninput = () => {
        applyRoast(hubRoast.value);
        save();
        toast(ROAST_COPY[state.roastLevel], "ok");
      };
    }
    const hubDiff = document.getElementById("hub-diff");
    if (hubDiff) {
      applyDiff(state.diff || "medium");
      hubDiff.onclick = function (e) {
        const b = e.target.closest("[data-diff]");
        if (!b) return;
        applyDiff(b.getAttribute("data-diff"));
        save();
        toast(DIFF_COPY[state.diff], "ok");
      };
    }
    const hubSfx = document.getElementById("hub-sfx");
    if (hubSfx) {
      hubSfx.checked = !sfx.isMuted();
      hubSfx.onchange = () => {
        sfx.setMuted(!hubSfx.checked);
        toast(hubSfx.checked ? "SFX on." : "SFX muted.", "ok");
      };
    }
    const hubHaptic = document.getElementById("hub-haptic");
    const pats = document.getElementById("haptic-pats");
    if (hubHaptic && window.LtHaptic) {
      hubHaptic.checked = window.LtHaptic.isOn();
      if (pats && window.LtHaptic.patterns) {
        pats.innerHTML = window.LtHaptic.patterns
          .map(function (p) {
            return '<button type="button" class="btn" data-hap="' + p.id + '" title="' + p.job + '">' + p.label + "</button>";
          })
          .join("");
        pats.addEventListener("click", function (e) {
          const b = e.target.closest("[data-hap]");
          if (!b) return;
          e.preventDefault();
          e.stopPropagation();
          window.LtHaptic.setOn(true);
          hubHaptic.checked = true;
          window.LtHaptic.play(b.getAttribute("data-hap"));
        });
      }
      hubHaptic.onchange = () => {
        window.LtHaptic.setOn(hubHaptic.checked);
        var motor = window.LtHaptic.hw ? window.LtHaptic.hw() : "";
        toast((hubHaptic.checked ? "Haptics on. " : "Haptics off. ") + motor, "ok");
        if (hubHaptic.checked) window.LtHaptic.land();
      };
    }
    function missingLab(m) {
      const map = {
        service: ["ServiceCalls", "Service calls"],
        sandbox: ["HVACSandbox", "Sandbox"],
        minisplit: ["MiniSplitInstall", "Mini-split lab"],
        compchange: ["CompressorChange", "Compressor change-out"],
        aihelper: ["AIHelper", "AI helper"],
        curriculum: ["CurriculumTrain", "Course"],
        quiz: ["QuizArena", "Quiz Game"],
        compete: ["CompeteArena", "Arena"],
        network: ["LtNet", "Classroom Wi-Fi", "mount"],
        electrical: ["ElectricalLab", "Electrical sim"],
        elguide: ["ElectricalLab", "Electrical sim"],
        defusal: ["ElectricalLab", "Electrical sim"],
        meter: ["VoltMeter", "Voltmeter class"],
        meterfree: ["VoltMeter", "Voltmeter class"],
        voltmeter: ["VoltMeter", "Voltmeter class"],
        furnace: ["FurnaceLab", "Heat plant"],
        ohms: ["OhmsLab", "Ohm's Law"],
        bible: ["HvacBible", "HVAC Bible"],
        flare: ["FlareLab", "Flaring lab"],
        braze: ["BrazingLab", "Brazing lab"],
        phonetools: ["PhoneTools", "Phone testers"],
        commandments: ["HvacCommandments", "Commandments"],
        epa608: ["Epa608Tutor", "608 tutor"],
        e608type: ["Epa608Labs", "608 labs"],
        e608vac: ["Epa608Labs", "608 labs"],
        e608cyl: ["Epa608Labs", "608 labs"],
        e608rrr: ["Epa608Labs", "608 labs"],
        shopschool: ["ShopSchool", "Shop School"],
        ptchart: ["PtChart", "P/T chart"],
        gauges: ["GaugeSchool", "Manifold school"],
        gaugeguide: ["GaugeSchool", "Manifold school"],
        cutaway: ["CutawayLab", "See inside"],
        call: ["TheCall", "Take the call"],
        iconnect: ["IConnectLab", "iConnect lab"],
        recover: ["RecoverLab", "Recovery lab"],
        tutorial: ["HubTutorial", "Tutorial"],
      };
      const spec = map[m];
      if (!spec) return "";
      const g = window[spec[0]];
      const method = spec[2] || "start";
      if (g && typeof g[method] === "function") return "";
      return spec[1];
    }
    function studentDock(m) {
      let dock = document.getElementById("student-dock");
      const home = !m || m === "hub" || m === "title" || m === "character";
      if (home) {
        if (dock) dock.hidden = true;
        document.body.classList.remove("student-on");
        return;
      }
      if (!dock) {
        dock = document.createElement("div");
        dock.id = "student-dock";
        dock.innerHTML = '<button type="button" class="btn" id="student-home">Shop floor</button><button type="button" class="btn primary" id="student-next">What next</button><span id="student-line">Gold line is the next move. Drag onto the photo.</span>';
        document.body.appendChild(dock);
        dock.querySelector("#student-home").onclick = function () {
          if (window.ltPlay) window.ltPlay("hub");
        };
        dock.querySelector("#student-next").onclick = function () {
          const line = document.querySelector("#rc-guide, #sb-hint, .qa-exam-question, .rc-note, .el-step.now, .now");
          const span = document.getElementById("student-line");
          if (line && line.scrollIntoView) line.scrollIntoView({ block: "center", behavior: "smooth" });
          if (span) span.textContent = line ? String(line.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140) : "Look for the gold outline. That is the next move.";
        };
      }
      dock.hidden = false;
      document.body.classList.add("student-on");
      const span = document.getElementById("student-line");
      if (span) span.textContent = "One next move. Gold outline is the part. Shop floor brings you home.";
    }

    function playMode(m, opts) {
      if (!m) return;
      studentDock(m);
      try {
        if (window.LtDrip && window.LtDrip.onMode) window.LtDrip.onMode(m);
      } catch (_) {}
      try {
        ac();
      } catch (_) {}
      try {
        if (sfx && sfx.click) sfx.click();
      } catch (_) {}
      try {
        try {
          if (m !== "tutorial" && window.HubTutorial && typeof window.HubTutorial.stop === "function") {
            window.HubTutorial.stop();
          }
        } catch (_) {}
        try {
          if (m !== "aihelper" && window.HubAI && typeof window.HubAI.close === "function") {
            window.HubAI.close();
          }
        } catch (_) {}
        const gone = missingLab(m);
        if (gone) {
          toast(gone + " didn't load. Hard-refresh (Ctrl+Shift+R).", "bad");
          return;
        }
        if (m === "service") startQuiz();
        else if (m === "sandbox") startSandbox();
        else if (m === "minisplit") startMiniSplit();
        else if (m === "compchange") startCompChange();
        else if (m === "aihelper") startAIHelper();
        else if (m === "curriculum") startCurriculum();
        else if (m === "quiz") startQuizArena();
        else if (m === "compete") startCompete();
        else if (m === "network") startNetwork();
        else if (m === "electrical") startElectrical();
        else if (m === "elguide") startElectrical({ guide: true });
        else if (m === "meter") startVoltMeter({ guide: true });
        else if (m === "meterfree") startVoltMeter({ unguided: true });
        else if (m === "defusal") startElectrical({ defuse: true });
        else if (m === "furnace") startFurnace();
        else if (m === "ohms") startOhms();
        else if (m === "bible") startBible();
        else if (m === "factory") startFactory();
        else if (m === "fieldsoft") startFieldSoft();
        else if (m === "voltmeter") startVoltMeter({ guide: true });
        else if (m === "flare") startFlare();
        else if (m === "braze") startBrazing();
        else if (m === "phonetools") startPhoneTools();
        else if (m === "commandments") startCommandments();
        else if (m === "epa608") startEpa608();
        else if (m === "e608type" || m === "e608vac" || m === "e608cyl" || m === "e608rrr") startE608Lab(m);
        else if (m === "shopschool") startShopSchool();
        else if (m === "ptchart") startPtChart();
        else if (m === "gauges") startGaugeSchool();
        else if (m === "gaugeguide") startGaugeSchool({ guide: true });
        else if (m === "cutaway") startCutaway(opts);
        else if (m === "call") startTheCall();
        else if (m === "iconnect") startIConnect();
        else if (m === "recover") startRecover();
        else if (m === "tutorial") startTutorial();
        else if (m === "character") show("character");
        else if (m === "rapture") openRapture();
        else if (m === "hub") {
          refreshHub();
          show("hub");
        } else {
          toast("Couldn't open " + m + ". That lab isn't on this floor.", "bad");
        }
      } catch (err) {
        console.warn("playMode", m, err);
        try {
          refreshHub();
          show("hub");
        } catch (_) {}
        toast((m || "That lab") + " didn't load. Hard-refresh (Ctrl+Shift+R).", "bad");
      }
    }
    window.ltPlayGo = playMode;
    window.ltPlay = playMode;
    if (window.__ltPlayWait) {
      const w = window.__ltPlayWait;
      window.__ltPlayWait = null;
      playMode(w);
    }

    let deferredInstall = null;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredInstall = e;
    });
    function offerInstall() {
      const go = () => {
        if (deferredInstall && deferredInstall.prompt) {
          deferredInstall.prompt();
          deferredInstall = null;
          return;
        }
        const ua = navigator.userAgent || "";
        const isAndroid = /Android/i.test(ua);
        const isIOS = /iPhone|iPad|iPod/i.test(ua);
        toast(
          isAndroid
            ? "Chrome menu ⋮ → Install app / Add to Home screen"
            : isIOS
              ? "Share → Add to Home Screen"
              : "Edge or Chrome: Install HVAC Legends in the address bar. Or run START-WINDOWS-APP.bat",
          "ok"
        );
      };
      go();
    }
    const instHub = document.getElementById("hub-install-app");
    const instBtn = document.getElementById("btn-install-app");
    if (instHub) instHub.onclick = (e) => { e.preventDefault(); e.stopPropagation(); offerInstall(); };
    if (instBtn) instBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); offerInstall(); };

    document.querySelectorAll(".mode-card, .quiz-launch, .start-door").forEach((card) => {
      card.addEventListener("click", () => {
        const m = card.getAttribute("data-mode");
        if (!m || card.tagName === "LABEL") return;
        playMode(m);
      });
    });

    const accBtn = document.getElementById("btn-accept");
    if (accBtn) accBtn.onclick = () => {
      if (!state.gaugesOfGod) state.xp += 100;
      state.gaugesOfGod = true;
      state.raptureSeen = true;
      if (window.Badges) window.Badges.unlock("gauges_of_god");
      save();
      sfx.win();
      toast("Gauges of God seated. SH/SC will never be a coin flip again.", "ok");
      refreshHub();
      show("hub");
    };
    const rapHub = document.getElementById("btn-rapture-hub");
    if (rapHub) rapHub.onclick = () => {
      refreshHub();
      show("hub");
    };

    const svcHub = document.getElementById("btn-svc-hub");
    if (svcHub) svcHub.onclick = () => {
      refreshHub();
      show("hub");
    };

    const ovHub = document.getElementById("ov-hub");
    if (ovHub) ovHub.onclick = () => {
      const ov = getOverlay();
      if (ov) ov.classList.add("hidden");
      stopRockMusic();
      mode = null;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      refreshHub();
      show("hub");
    };

    const pauseBtn = document.getElementById("btn-pause");
    if (pauseBtn) pauseBtn.onclick = () => {
      const ov = getOverlay();
      if (!ov) return;
      ov.classList.remove("hidden");
      const t = document.getElementById("ov-title");
      const b = document.getElementById("ov-body");
      const r = document.getElementById("ov-resume");
      if (t) t.textContent = "Paused";
      if (b) b.textContent = "Shop floor or resume.";
      if (r) {
        r.textContent = "Resume";
        r.onclick = () => {
          ov.classList.add("hidden");
          last = performance.now();
          loop(last);
        };
      }
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // keyboard
    window.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "");
      if (!typing) keys.add(e.code);
      if (
        !typing &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyG", "KeyR", "KeyK"].includes(e.code)
      ) {
        e.preventDefault();
      }
      if (e.code === "Escape") {
        const ai = document.getElementById("hub-ai-panel");
        if (ai && !ai.classList.contains("hidden") && window.HubAI) {
          window.HubAI.close();
          return;
        }
        if (state.screen && state.screen !== "hub" && state.screen !== "title" && state.screen !== "character") {
          if (state.screen === "game") {
            const ov = getOverlay();
            if (ov) ov.classList.remove("hidden");
            const t = document.getElementById("ov-title");
            const b = document.getElementById("ov-body");
            if (t) t.textContent = "Paused";
            if (b) b.textContent = "Esc · pause menu";
            cancelAnimationFrame(raf);
            raf = 0;
          } else {
            refreshHub();
            show("hub");
            toast("Back on the shop floor", "ok");
          }
        }
      }
    });
    window.addEventListener("keyup", (e) => keys.delete(e.code));
    window.addEventListener("blur", () => keys.clear());

    // touch pads
    document.querySelectorAll("#touch button[data-k]").forEach((btn) => {
      const code = btn.dataset.k;
      const down = (e) => {
        e.preventDefault();
        keys.add(code);
        btn.classList.add("held");
      };
      const up = (e) => {
        e.preventDefault();
        keys.delete(code);
        btn.classList.remove("held");
      };
      btn.addEventListener("pointerdown", down);
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointerleave", up);
      btn.addEventListener("pointercancel", up);
    });

    // if returning player
    if (state.callsign) {
      const cs = document.getElementById("callsign");
      const clock = document.getElementById("btn-clockin");
      if (cs) cs.value = state.callsign;
      if (clock) clock.disabled = false;
      const specEl = document.getElementById("spec");
      if (specEl && state.spec) specEl.value = state.spec;
    }

    const wantSkip =
      /[?&](play|skip|demo|desk)=1/i.test(location.search || "") ||
      /#play|#skip|#demo/i.test(location.hash || "");
    if (wantSkip) {
      const q = new URLSearchParams(location.search || "");
      const nick = (q.get("nick") || q.get("name") || "").trim().slice(0, 14);
      enterShopFloor(nick || state.callsign || "Student");
      const joinPin = (q.get("join") || q.get("pin") || "").replace(/\D/g, "").slice(0, 6);
      const roomPin = (q.get("room") || q.get("classpin") || "").replace(/\D/g, "").slice(0, 6);
      const wantQuiz = q.get("quiz") === "1" || q.get("exam") === "1";
      const wantClass = q.get("class") === "1" || q.get("door") === "class" || roomPin.length === 6;
      setTimeout(function () {
        if (joinPin.length === 6) startQuizArena({ joinPin: joinPin, nickname: nick || state.callsign || "Student" });
        else if (wantQuiz) playMode("quiz");
        else if (q.get("desk") === "1") {
          location.href = "desk.html";
        }
        else if (q.get("course") === "1") playMode("curriculum");
        else if (/^e608(type|vac|cyl|rrr)$/.test(q.get("lab") || "")) playMode(q.get("lab"));
        else if (wantClass) showClassDoor(roomPin);
        else if (window.LtDrip) window.LtDrip.say("hub.floor");
      }, 80);
    }
  }

  function classShareUrl(extra) {
    try {
      const u = new URL(location.href);
      u.search = "play=1&sku=campus&class=1" + (extra ? "&" + extra : "");
      u.hash = "";
      return u.toString();
    } catch (_) {
      return location.href;
    }
  }

  function showClassDoor(prefillPin) {
    let el = document.getElementById("class-door");
    if (!el) {
      el = document.createElement("div");
      el.id = "class-door";
      el.className = "class-door";
      (document.getElementById("app") || document.body).appendChild(el);
    }
    const share = classShareUrl(prefillPin ? "room=" + prefillPin : "");
    el.hidden = false;
    el.innerHTML =
      '<div class="class-door-card">' +
      "<h2>Class door</h2>" +
      "<p>Type your name. Join the live class PIN on the board, or walk the shop solo.</p>" +
      '<label>Callsign<input id="cd-nick" maxlength="14" value="' +
      (state.callsign || "Student").replace(/"/g, "") +
      '" /></label>' +
      '<p class="eyebrow">Live class — follow HUB</p>' +
      '<label>6-digit class PIN<input id="cd-room" maxlength="6" inputmode="numeric" placeholder="000000" value="' +
      (prefillPin || "") +
      '" /></label>' +
      '<button type="button" class="btn primary" id="cd-class">Join class</button>' +
      '<button type="button" class="btn" id="cd-shop">Enter shop floor solo</button>' +
      '<p class="eyebrow">All-Star Exam — sealed paper</p>' +
      '<label>Exam PIN (optional)<input id="cd-pin" maxlength="6" inputmode="numeric" placeholder="exam only" /></label>' +
      '<button type="button" class="btn" id="cd-join">Join exam</button>' +
      '<p class="qa-muted">Instructor: Classroom Wi-Fi → Start class → write the PIN. Same school Wi-Fi. Scores compete on the class board.</p>' +
      '<p class="net-url" id="cd-url">' +
      share +
      "</p>" +
      '<button type="button" class="btn" id="cd-copy">Copy class link</button>' +
      "</div>";
    const nickEl = el.querySelector("#cd-nick");
    function nick() {
      return ((nickEl && nickEl.value) || "Student").trim().slice(0, 14) || "Student";
    }
    el.querySelector("#cd-shop").onclick = function () {
      state.callsign = nick();
      try { save(); } catch (_) {}
      el.hidden = true;
      refreshHub();
      show("hub");
    };
    el.querySelector("#cd-class").onclick = function () {
      const rp = (el.querySelector("#cd-room").value || "").replace(/\D/g, "").slice(0, 6);
      if (rp.length !== 6) {
        toast("Need the 6-digit class PIN from the board.", "bad");
        return;
      }
      state.callsign = nick();
      try { save(); } catch (_) {}
      if (!window.LtClass) {
        toast("Class session didn't load. Hard-refresh.", "bad");
        return;
      }
      window.LtClass.join(rp, nick()).then(function () {
        el.hidden = true;
        toast("In class " + rp + ". Follow HUB.", "ok");
        refreshHub();
        show("hub");
      }).catch(function (err) {
        toast((err && err.message) || "No class with that PIN.", "bad");
      });
    };
    el.querySelector("#cd-join").onclick = function () {
      const pin = (el.querySelector("#cd-pin").value || "").replace(/\D/g, "").slice(0, 6);
      if (pin.length !== 6) {
        toast("Need the 6-digit PIN from the board.", "bad");
        return;
      }
      state.callsign = nick();
      try { save(); } catch (_) {}
      el.hidden = true;
      startQuizArena({ joinPin: pin, nickname: nick() });
    };
    el.querySelector("#cd-copy").onclick = function () {
      const t = share;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { toast("Class link copied.", "ok"); }).catch(function () {});
      }
    };
  }

  function openRapture(fromQuiz, source) {
    show("rapture");
    const root = document.getElementById("screen-rapture");
    const kicker = document.getElementById("cut-kicker");
    if (kicker) {
      kicker.textContent = source === "defusal"
        ? "Rooftop · callback defused · the heavens open"
        : ((window.LtBrand && window.LtBrand.roof) || "Rooftop · the heavens open");
    }
    if (window.HvacCommandments && window.HvacCommandments.playWinCutscene) {
      window.HvacCommandments.playWinCutscene(root, {
        fromQuiz: !!fromQuiz,
        fromDefusal: source === "defusal",
      });
    } else if (window.HvacCommandments && window.HvacCommandments.paintRapture) {
      window.HvacCommandments.paintRapture(root);
    }
    if (sfx.rapture) sfx.rapture();
    else if (sfx.win) sfx.win();
    const v = document.getElementById("heaven-vid");
    if (v) {
      try {
        if (v.play) {
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(function () {});
        }
      } catch (_) {}
    }
  }

  function grantQuizVictory() {
    const bonus = 250;
    state.xp += bonus;
    state.gaugesOfGod = true;
    state.raptureSeen = true;
    if (window.Badges) {
      window.Badges.unlock("quiz_champ");
      window.Badges.unlock("gauges_of_god");
    }
    save();
    toast("Quiz Champion · HVAC Jesus · Gauges of God · +" + bonus + " XP", "xp");
    try {
      if (sfx.rapture) sfx.rapture();
      else if (sfx.win) sfx.win();
    } catch (_) {}
    setTimeout(function () {
      try { openRapture(true); } catch (err) { console.warn("rapture", err); }
    }, 900);
  }

  function grantDefusalVictory() {
    const bonus = 250;
    if (!state.gaugesOfGod) state.xp += bonus;
    state.gaugesOfGod = true;
    state.raptureSeen = true;
    if (window.Badges) {
      window.Badges.unlock("gauges_of_god");
    }
    save();
    toast("Callback defused · HVAC Jesus · Gauges of God", "xp");
    if (sfx.win) sfx.win();
  }

  function startCommandments() {
    if (!window.HvacCommandments || !window.HvacCommandments.start) {
      toast("Commandments didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("commandments-root");
    if (!root) {
      toast("Commandments screen missing.", "bad");
      return;
    }
    show("commandments");
    window.HvacCommandments.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startPtChart() {
    if (!window.PtChart || !window.PtChart.start) {
      toast("P/T chart didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("ptchart-root");
    if (!root) {
      toast("P/T screen missing.", "bad");
      return;
    }
    show("ptchart");
    window.PtChart.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startGaugeSchool(opts) {
    if (!window.GaugeSchool || !window.GaugeSchool.start) {
      toast("Manifold school didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("gauges-root");
    if (!root) {
      toast("Manifold screen missing.", "bad");
      return;
    }
    if (window.__gaugeCtl && window.__gaugeCtl.stop) {
      window.__gaugeCtl.stop();
      window.__gaugeCtl = null;
    }
    show("gauges");
    window.__gaugeCtl = window.GaugeSchool.start(root, {
      unguided: opts && opts.guide ? false : !!(opts && (opts.unguided || opts.practice)) || state.diff !== "easy",
      guide: !!(opts && opts.guide) || (state.diff === "easy" && !(opts && (opts.unguided || opts.practice))),
      onXp(n) {
        addXp(n, "manifold school");
      },
      onHub() {
        if (window.__gaugeCtl && window.__gaugeCtl.stop) window.__gaugeCtl.stop();
        window.__gaugeCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startCutaway(opts) {
    if (!window.CutawayLab || !window.CutawayLab.start) {
      toast("See inside didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("cutaway-root");
    if (!root) {
      toast("See inside screen missing.", "bad");
      return;
    }
    if (window.__cutawayCtl && window.__cutawayCtl.stop) {
      window.__cutawayCtl.stop();
      window.__cutawayCtl = null;
    }
    show("cutaway");
    window.__cutawayCtl = window.CutawayLab.start(root, {
      clip: opts && opts.clip,
      onXp(n) {
        addXp(n, "see inside");
      },
      onHub() {
        if (window.__cutawayCtl && window.__cutawayCtl.stop) window.__cutawayCtl.stop();
        window.__cutawayCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startTheCall() {
    if (!window.TheCall || !window.TheCall.start) {
      toast("Take the call didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("call-root");
    if (!root) {
      toast("Take the call screen missing.", "bad");
      return;
    }
    if (window.__callCtl && window.__callCtl.stop) window.__callCtl.stop();
    show("call");
    window.__callCtl = window.TheCall.start(root, {
      onXp(n) { addXp(n, "the call"); },
      onHub() {
        if (window.__callCtl && window.__callCtl.stop) window.__callCtl.stop();
        window.__callCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startEpa608() {
    if (!window.Epa608Tutor || !window.Epa608Tutor.start) {
      toast("608 tutor didn't load. Hard-refresh.", "bad");
      return;
    }
    let root = document.getElementById("epa608-root");
    if (!root) {
      let scr = document.getElementById("screen-epa608");
      if (!scr) {
        scr = document.createElement("section");
        scr.id = "screen-epa608";
        scr.className = "screen";
        document.getElementById("app").appendChild(scr);
      }
      root = document.createElement("div");
      root.id = "epa608-root";
      scr.appendChild(root);
    }
    show("epa608");
    window.Epa608Tutor.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
      onExam() {
        startQuizArena();
      },
      onStamp() {
        markDaily("epa608");
      },
      onLab(id) {
        startE608Lab(id);
      },
    });
  }

  function startE608Lab(station) {
    if (!window.Epa608Labs || !window.Epa608Labs.start) {
      toast("608 labs didn't load. Hard-refresh.", "bad");
      return;
    }
    let root = document.getElementById("epa608-root");
    if (!root) {
      let scr = document.getElementById("screen-epa608");
      if (!scr) {
        scr = document.createElement("section");
        scr.id = "screen-epa608";
        scr.className = "screen";
        document.getElementById("app").appendChild(scr);
      }
      root = document.createElement("div");
      root.id = "epa608-root";
      scr.appendChild(root);
    }
    show("epa608");
    window.Epa608Labs.start(root, {
      station: station,
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startShopSchool() {
    if (!window.ShopSchool || !window.ShopSchool.start) {
      toast("Shop School didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("shopschool-root");
    if (!root) return;
    show("shopschool");
    window.ShopSchool.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  let phoneToolsCtl = null;
  function startPhoneTools() {
    show("phonetools");
    const host = document.getElementById("phonetools-root");
    if (!host || !window.PhoneTools) {
      toast("Phone testers didn't load. Hard-refresh.", "bad");
      return;
    }
    if (phoneToolsCtl && phoneToolsCtl.stop) phoneToolsCtl.stop();
    phoneToolsCtl = window.PhoneTools.start(host, {
      onHub() {
        if (phoneToolsCtl && phoneToolsCtl.stop) phoneToolsCtl.stop();
        phoneToolsCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startBrazing() {
    if (!window.BrazingLab || !window.BrazingLab.start) {
      toast("Brazing lab didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("braze-root");
    if (!root) {
      toast("Brazing screen missing.", "bad");
      return;
    }
    if (window.__brazeCtl && window.__brazeCtl.stop) {
      window.__brazeCtl.stop();
      window.__brazeCtl = null;
    }
    show("braze");
    window.__brazeCtl = window.BrazingLab.start(root, {
      onXp(n) {
        addXp(n, "brazing");
      },
      onHub() {
        if (window.__brazeCtl && window.__brazeCtl.stop) window.__brazeCtl.stop();
        window.__brazeCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startFlare() {
    if (!window.FlareLab || !window.FlareLab.start) {
      toast("Flaring lab didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("flare-root");
    if (!root) {
      toast("Flaring screen missing.", "bad");
      return;
    }
    if (window.__flareCtl && window.__flareCtl.stop) {
      window.__flareCtl.stop();
      window.__flareCtl = null;
    }
    show("flare");
    window.__flareCtl = window.FlareLab.start(root, {
      onXp(n) {
        addXp(n, "flaring");
      },
      onHub() {
        if (window.__flareCtl && window.__flareCtl.stop) window.__flareCtl.stop();
        window.__flareCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startFurnace() {
    if (!window.FurnaceLab || !window.FurnaceLab.start) {
      toast("Heat plant didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("furnace-root");
    if (!root) {
      toast("Heat plant screen missing.", "bad");
      return;
    }
    if (window.__furnaceCtl && window.__furnaceCtl.stop) {
      window.__furnaceCtl.stop();
      window.__furnaceCtl = null;
    }
    show("furnace");
    window.__furnaceCtl = window.FurnaceLab.start(root, {
      onXp(n) {
        addXp(n, "heat plant");
      },
      onHub() {
        if (window.__furnaceCtl && window.__furnaceCtl.stop) window.__furnaceCtl.stop();
        window.__furnaceCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startOhms() {
    if (!window.OhmsLab || !window.OhmsLab.start) {
      toast("Ohm's Law didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("ohms-root");
    if (!root) {
      toast("Ohm's Law screen missing.", "bad");
      return;
    }
    if (window.__ohmsCtl && window.__ohmsCtl.stop) {
      window.__ohmsCtl.stop();
      window.__ohmsCtl = null;
    }
    show("ohms");
    window.__ohmsCtl = window.OhmsLab.start(root, {
      onXp(n) {
        addXp(n, "ohm's law");
      },
      onHub() {
        if (window.__ohmsCtl && window.__ohmsCtl.stop) window.__ohmsCtl.stop();
        window.__ohmsCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startBible() {
    if (!window.HvacBible || !window.HvacBible.start) {
      toast("HVAC Bible didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("bible-root");
    if (!root) {
      toast("HVAC Bible screen missing.", "bad");
      return;
    }
    show("bible");
    window.HvacBible.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startFactory() {
    if (!window.FactoryApps || !window.FactoryApps.start) {
      toast("Factory apps didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("factory-root");
    if (!root) {
      toast("Factory apps screen missing.", "bad");
      return;
    }
    show("factory");
    window.FactoryApps.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startFieldSoft() {
    if (!window.FieldSoft || !window.FieldSoft.start) {
      toast("Field software didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("fieldsoft-root");
    if (!root) {
      toast("Field software screen missing.", "bad");
      return;
    }
    show("fieldsoft");
    window.FieldSoft.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startVoltMeter(opts) {
    if (!window.VoltMeter || !window.VoltMeter.start) {
      toast("Voltmeter class didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("voltmeter-root");
    if (!root) {
      toast("Voltmeter screen missing.", "bad");
      return;
    }
    if (window.__vmCtl && window.__vmCtl.stop) {
      window.__vmCtl.stop();
      window.__vmCtl = null;
    }
    show("voltmeter");
    window.__vmCtl = window.VoltMeter.start(root, {
      guide: !(opts && opts.unguided),
      unguided: !!(opts && opts.unguided),
      onXp(n) {
        addXp(n, "voltmeter");
      },
      onHub() {
        if (window.__vmCtl && window.__vmCtl.stop) window.__vmCtl.stop();
        window.__vmCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startElectrical(opts) {
    if (!window.ElectricalLab || !window.ElectricalLab.start) {
      toast("Electrical sim didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("electrical-root");
    if (!root) {
      toast("Electrical screen missing.", "bad");
      return;
    }
    if (electricalCtl) {
      electricalCtl.stop();
      electricalCtl = null;
    }
    show("electrical");
    try {
      electricalCtl = window.ElectricalLab.start(root, {
        defuse: !!(opts && opts.defuse),
        guide: !!(opts && opts.guide),
        meter: !!(opts && opts.meter),
        onXp(n) {
          state.xp += n;
          save();
          postCompete("score", { mode: "electrical", score: 350 + n });
        },
        onWin(info) {
          if (!info || !info.clockOut) return;
          grantDefusalVictory();
        },
      });
    } catch (err) {
      toast("Electrical sim failed to start.", "bad");
      return;
    }
    const hubEl = electricalCtl && electricalCtl.getHubBtn && electricalCtl.getHubBtn();
    if (hubEl) hubEl.onclick = () => {
      if (electricalCtl) {
        electricalCtl.stop();
        electricalCtl = null;
      }
      refreshHub();
      show("hub");
    };
  }

  function startSandbox(opts) {
    show("sandbox");
    const root = document.getElementById("sandbox-root");
    if (!root) {
      toast("Sandbox screen missing.", "bad");
      return;
    }
    if (!window.HVACSandbox || !window.HVACSandbox.start) {
      root.innerHTML = "<div class='panel' style='margin:20px'><h2>System sandbox</h2><p>Script did not load. Hard-refresh (Ctrl+Shift+R).</p><button class='btn' onclick=\"window.ltPlay('hub')\">Shop floor</button></div>";
      toast("Sandbox script didn't load. Hard-refresh.", "bad");
      return;
    }
    try {
      if (sandboxCtl) {
        sandboxCtl.stop();
        sandboxCtl = null;
      }
      sandboxCtl = window.HVACSandbox.start(root, {
        nickname: state.callsign || "Tech",
        dispatch: opts && opts.dispatch ? opts.dispatch : null,
        onDispatchGrade(ok) {
          if (serviceCtl && serviceCtl.grade) serviceCtl.grade(ok);
          if (ok) {
            const payAmt = PAY.serviceTicket || 45;
            state.jobsCompleted += 1;
            pay(payAmt, "service");
            toast(ok ? "Ticket closed. Next fault is random." : "Wrong call. System stays as-is.", "xp");
          }
        },
        onDispatchNext(call) {
          if (serviceCtl && serviceCtl.adopt) serviceCtl.adopt(call);
          toast("New ticket. Gauges already on. Read it.", "ok");
        },
        onXp(n) {
          state.xp += n;
          save();
          if (window.Badges) window.Badges.unlock("sandbox_tech");
          markDaily("sandbox");
          postCompete("score", { mode: "sandbox", score: 400 + n });
        },
        onRace(pts, row) {
          state.xp += Math.max(5, Math.round((pts || 0) / 12));
          save();
          postCompete("score", { mode: "sandbox-race", score: pts || 0, circuit: row && row.ch });
          toast((row && row.name ? row.name : "Tech") + " · sandbox race " + pts + " pts", "xp");
        },
      });
      const hubSb = sandboxCtl && sandboxCtl.getHubBtn && sandboxCtl.getHubBtn();
      if (hubSb) hubSb.onclick = () => {
        if (sandboxCtl) {
          sandboxCtl.stop();
          sandboxCtl = null;
        }
        refreshHub();
        show("hub");
      };
    } catch (err) {
      if (typeof console !== "undefined") console.warn("startSandbox", err);
      root.innerHTML = "<div class='panel' style='margin:20px'><h2>System sandbox</h2><p>" + String(err && err.message ? err.message : err) + "</p><p>Hard-refresh (Ctrl+Shift+R) then Clock In → System sandbox.</p><button class='btn' onclick=\"window.ltPlay('hub')\">Shop floor</button></div>";
      toast("Sandbox failed to start. Hard-refresh.", "bad");
    }
  }

  function startAIHelper() {
    if (!window.AIHelper || !window.AIHelper.start) {
      toast("AI helper didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("aihelper-root");
    if (!root) return;
    if (aiHelperCtl) {
      aiHelperCtl.stop();
      aiHelperCtl = null;
    }
    show("aihelper");
    aiHelperCtl = window.AIHelper.start(root, {
      onHub() {
        aiHelperCtl = null;
        refreshHub();
        show("hub");
      },
    });
  }

  function startCompChange() {
    if (!window.CompressorChange || !window.CompressorChange.start) {
      toast("Compressor change-out didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("compchange-root");
    if (!root) return;
    show("compchange");
    window.CompressorChange.start(root, {
      onDone: function (success) {
        if (success) {
          if (window.CurriculumTrain) window.CurriculumTrain.stamp("compchange");
          state.xp += 40;
          save();
          toast("Compressor change-out done.", "ok");
        }
        refreshHub();
        show("hub");
      },
    });
  }

  function startMiniSplit() {
    if (!window.MiniSplitInstall || !window.MiniSplitInstall.start) {
      toast("Mini-split lab didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("minisplit-root");
    if (!root) return;
    if (window.EpaHeat) window.EpaHeat.showLurk(true);
    if (minisplitCtl) {
      minisplitCtl.stop();
      minisplitCtl = null;
    }
    show("minisplit");
    try {
      minisplitCtl = window.MiniSplitInstall.start(root, {
      systemName: "Daikin Aurora · Single-zone mini-split",
      onXp(n) {
        state.xp += n;
        save();
      },
      onDone(success) {
        minisplitCtl = null;
        if (success) {
          if (window.CurriculumTrain) window.CurriculumTrain.stamp("minisplit");
          if (window.Badges) {
            window.Badges.unlock("clean_install");
            if (window.EpaHeat && window.EpaHeat.getStars() === 0) window.Badges.unlock("no_vent");
          }
          markDaily("minisplit", { paid: true });
          const base = PAY.minisplit;
          const bonus = PAY.minisplitBonus;
          const total = base + bonus;
          state.jobsCompleted += 1;
          pay(total, "minisplit");
          showPayStub({
            title: "Install complete — paid",
            body:
              "Daikin Aurora mini-split commissioned. Labor " +
              money(base) +
              " + clean-start bonus " +
              money(bonus) +
              ".",
            amount: total,
            xp: 0,
            onClose() {
              postCompete("score", { mode: "minisplit", score: 1000 });
              refreshHub();
              show("hub");
            },
          });
        } else {
          refreshHub();
          show("hub");
        }
      },
    });
    } catch (err) {
      console.warn("startMiniSplit", err);
      root.innerHTML =
        "<div class='panel' style='margin:20px'><h2>Mini-split lab</h2><p>" +
        String(err && err.message ? err.message : err) +
        "</p><button class='btn' onclick=\"window.ltPlay('hub')\">Shop floor</button></div>";
      toast("Mini-split failed to start. Hard-refresh.", "bad");
    }
  }

  function postCompete(type, extra) {
    const payload = Object.assign(
      {
        source: "lt-allstars",
        v: 1,
        type,
        callsign: state.callsign || "Tech",
        xp: state.xp,
        jobs: state.jobsCompleted,
        spec: state.spec || "residential",
      },
      extra || {}
    );
    try {
      if (type === "score" && window.LtClass) {
        window.LtClass.score(payload.mode, payload.score);
      }
    } catch (_) {}
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, window.location.origin);
      }
    } catch (_) {}
  }

  function onShellMessage(ev) {
    if (ev.origin !== window.location.origin) return;
    if (ev.source !== window.parent) return;
    const d = ev.data;
    if (!d || d.source !== "lt-allstars") return;
    if (d.type === "hello") {
      const active = document.querySelector(".screen.active");
      const screen = active && active.id ? active.id.replace(/^screen-/, "") : "title";
      postCompete("ready", { screen: screen, mode: screen });
      return;
    }
    if (d.type === "clockin") {
      enterShopFloor(state.callsign || "Guest");
      return;
    }
    if (d.type === "play" && d.mode && typeof window.ltPlay === "function") {
      window.ltPlay(d.mode, d.opts || {});
    }
  }

  window.addEventListener("message", onShellMessage);

  function startRecover() {
    const root = document.getElementById("recover-root");
    if (!root || !window.RecoveryRoom) {
      if (root && window.RecoverLab) {
        show("recover");
        window.RecoverLab.start(root);
        return;
      }
      toast("Recovery room didn't load. Hard-refresh.", "bad");
      return;
    }
    show("recover");
    window.RecoveryRoom.start(root, {
      onHub() {
        refreshHub();
        show("hub");
      },
    });
  }

  function startIConnect() {
    const root = document.getElementById("iconnect-root");
    if (!root || !window.IConnectLab) {
      toast("iConnect lab didn't load. Hard-refresh.", "bad");
      return;
    }
    show("iconnect");
    window.IConnectLab.start(root);
  }

  function startTutorial() {
    show("hub");
    const host = document.getElementById("tutorial-root");
    if (!host || !window.HubTutorial) {
      toast("Tutorial failed to load", "bad");
      return;
    }
    window.HubTutorial.start(host, {
      onDone() {
        state.seenTutorial = true;
        state.seenTip = true;
        save();
      },
      onLaunch(mode) {
        state.seenTutorial = true;
        save();
        if (mode === "quiz") startQuizArena();
        else if (mode === "sandbox") startSandbox();
        else if (mode === "electrical") startElectrical();
        else if (mode === "elguide") startElectrical({ guide: true });
        else if (mode === "aihelper") startAIHelper();
        else if (mode === "commandments") startCommandments();
        else if (mode === "epa608") startEpa608();
        else if (mode === "shopschool") startShopSchool();
        else if (mode === "gauges") startGaugeSchool();
        else if (mode === "cutaway") startCutaway();
        else if (mode === "compete") startCompete();
      },
    });
  }

  function startCompete() {
    if (!window.CompeteArena || !window.CompeteArena.start) {
      toast("Arena didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("compete-root");
    if (!root) return;
    if (competeCtl) {
      competeCtl.stop();
      competeCtl = null;
    }
    show("compete");
    competeCtl = window.CompeteArena.start(root, {
      onHub() {
        competeCtl = null;
        refreshHub();
        show("hub");
      },
    });
    if (window.StudentChat && window.StudentChat.setRoom) window.StudentChat.setRoom("compete");
  }

  function startNetwork() {
    show("network");
    const root = document.getElementById("network-root");
    if (!root) return;
    if (!window.LtNet || !window.LtNet.mount) {
      root.innerHTML = "<div class='panel' style='margin:20px'><h2>Classroom Wi-Fi</h2><p>Network script did not load. Hard-refresh.</p><button class='btn' onclick=\"window.ltPlay('hub')\">Shop floor</button></div>";
      return;
    }
    window.LtNet.mount(root);
  }

  function startBros() {
    toast("HVAC BROS is retired. Use sandbox, quiz, and AI helper.", "ok");
    refreshHub();
    show("hub");
  }

  function startQuizArena(opts) {
    if (!window.QuizArena || !window.QuizArena.start) {
      toast("Quiz Game script didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("quiz-root");
    if (!root) {
      toast("Quiz screen missing.", "bad");
      return;
    }
    if (quizCtl) {
      quizCtl.stop();
      quizCtl = null;
    }
    show("quiz");
    quizCtl = window.QuizArena.start(root, {
      nickname: (opts && opts.nickname) || state.callsign || "Tech",
      joinPin: opts && opts.joinPin,
      extraSpicy: !!state.extraSpicy,
      roastLevel: state.roastLevel,
      onRoast(n) {
        applyRoast(n);
        save();
      },
      onExtra(v) {
        state.extraSpicy = !!v;
        save();
      },
      onHub() {
        if (quizCtl) {
          quizCtl.stop();
          quizCtl = null;
        }
        refreshHub();
        show("hub");
      },
      onComplete({ scores, winner, packId }) {
        const myName = state.callsign || "Tech";
        const my = scores[myName] != null ? scores[myName] : scores[Object.keys(scores)[0]] || 0;
        const xp = Math.min(200, Math.round(my / 25) + 40);
        state.xp += xp;
        const payAmt = Math.min(300, Math.round(my / 20));
        if (payAmt > 0) {
          state.jobsCompleted += 1;
          pay(payAmt, "quiz");
        }
        save();
        toast("Quiz done · +" + xp + " XP", "xp");
        if (window.Badges) {
          if (packId === "epa608" || packId === "mixed") window.Badges.unlock("epa_quiz");
          if (packId === "osha30" || packId === "mixed") window.Badges.unlock("osha_quiz");
        }
        markDaily("quiz", { pack: packId });
        postCompete("score", { mode: "quiz", score: my });
        const names = Object.keys(scores);
        const winName = winner && winner[0];
        const iWon = !winName || winName === myName || names.length <= 1;
        if (iWon) grantQuizVictory();
        else if (winName) toast("🏆 " + winName + " took first. Run it back.", "ok");
      },
    });
  }

  function startCurriculum() {
    if (!window.CurriculumTrain || typeof window.CurriculumTrain.start !== "function") {
      toast("Course didn't load. Hard-refresh.", "bad");
      return;
    }
    const root = document.getElementById("curriculum-root");
    if (!root) {
      toast("Course screen missing.", "bad");
      return;
    }
    if (curriculumCtl) {
      curriculumCtl.stop();
      curriculumCtl = null;
    }
    show("curriculum");
    curriculumCtl = window.CurriculumTrain.start(root, {
      onBack() {
        curriculumCtl = null;
        refreshHub();
        show("hub");
      },
      onLaunch(mode) {
        curriculumCtl = null;
        if (window.ltPlay) window.ltPlay(mode);
      },
      onAskHub(unitId, coach) {
        state.activeUnit = unitId || null;
        save();
        if (window.HubAI) {
          window.HubAI.open();
          if (window.HubAI.coachUnit) window.HubAI.coachUnit(unitId, coach);
          else if (coach && coach.open) {
            // fallback: user sees open prompt via coachUnit
          }
        }
      },
    });
  }

  try {
    initUI();
  } catch (err) {
    console.warn("initUI", err);
    window.ltPlayGo = window.ltPlayGo || function (mode) {
      try {
        show(mode === "character" ? "character" : mode === "title" ? "title" : "hub");
      } catch (_) {}
    };
    window.ltPlay = window.ltPlayGo;
  }

  // Student shop chat — live rooms for co-op and competition
  if (window.StudentChat) {
    try {
      window.StudentChat.mount({
        getCallsign() {
          return state.callsign || "Tech";
        },
        getSandbox() {
          return sandboxCtl && sandboxCtl.getSnapshot ? sandboxCtl.getSnapshot() : null;
        },
        loadSandbox(snap) {
          if (!sandboxCtl) startSandbox();
          if (sandboxCtl && sandboxCtl.loadSnapshot) sandboxCtl.loadSnapshot(snap);
          show("sandbox");
        },
        onChallenge() {
          startQuizArena();
        },
        onToast(msg, kind) {
          toast(msg, kind);
        },
      });
    } catch (err) {
      console.warn("StudentChat mount skipped", err);
    }
  }

  // Professor HUB interactive AI
  if (window.HubAI) {
    try {
      window.HubAI.init({
        getContext() {
          return {
            mode: state.screen,
            step: null,
            unit: state.activeUnit,
          };
        },
      });
    } catch (err) {
      console.warn("HubAI init skipped", err);
    }
  }
  applyHubAiPref();
  window.toggleHubAi = toggleHubAi;
  document.querySelectorAll("[data-hubai-toggle]").forEach((b) => {
    b.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleHubAi();
    };
  });

})();
