/* Lincoln Tech HVAC Allstars — Curriculum Training Mode
   Maps program-style course units to in-game simulators so students
   can rehearse before physical lab. Course codes mirror common LT HVAC
   diploma structure (HCR / HV series) for study planning — not an
   official catalog replacement. */
(function (global) {
  "use strict";

  var PACK = global.SchoolPack || { units: [], coach: {}, track: [] };
  var UNITS = PACK.units || [];
  var AI_COACH = PACK.coach || {};
  var TRACK = PACK.track || [];


  let root = null;
  let progress = { done: {}, xp: 0 };
  let onLaunch = null;
  let onBack = null;
  let onAskHub = null;

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem("lt-course-" + ((global.SchoolPack && global.SchoolPack.id) || "school")) || "{}");
      progress = { done: raw.done || {}, xp: raw.xp || 0 };
    } catch (_) {
      progress = { done: {}, xp: 0 };
    }
  }

  function saveProgress() {
    localStorage.setItem("lt-course-" + ((global.SchoolPack && global.SchoolPack.id) || "school"), JSON.stringify(progress));
  }

  function labDone(id) {
    return !!(progress.done && progress.done[id]);
  }

  function viewTrack() {
    if (!global.SchoolPack || global.SchoolPack.id !== "lincoln") return TRACK;
    var track = TRACK.map(function (c) {
      return { id: c.id, code: c.code, title: c.title, blurb: c.blurb, labs: c.labs.slice() };
    });
    var seen = {};
    track.forEach(function (c) {
      c.labs.forEach(function (l) { seen[l.id] = 1; });
    });
    var icon = null;
    track.forEach(function (c) { if (c.id === "iconnect") icon = c; });
    var units = (global.IConnectCatalog && global.IConnectCatalog.units) || [];
    if (icon) {
      units.forEach(function (u) {
        if (seen[u.id]) return;
        seen[u.id] = 1;
        icon.labs.push({
          id: u.id,
          mode: "iconnect",
          label: u.model + " · " + u.name,
          xp: 20,
          what: (u.group || "Lab") + ". Open the trainer and finish the order."
        });
      });
    }
    return track;
  }

  function courseDone(c) {
    return c.labs.every(function (l) { return labDone(l.id); });
  }

  function stamp(mode, labId) {
    loadProgress();
    let gained = 0;
    let name = "";
    viewTrack().forEach(function (c) {
      c.labs.forEach(function (l) {
        var hit = false;
        if (labId) hit = l.id === labId || (labId === "tu522" && l.id === "ic522");
        else if (mode === "iconnect") hit = l.id === "ic522";
        else hit = l.mode === mode;
        if (hit && !progress.done[l.id]) {
          progress.done[l.id] = true;
          gained += l.xp;
          name = l.label;
        }
      });
    });
    if (!gained) return 0;
    progress.xp = (progress.xp || 0) + gained;
    saveProgress();
    const n = Object.keys(progress.done).length;
    if (n >= 3 && global.Badges) global.Badges.unlock("curriculum_3");
    if (global.ltAddXp) global.ltAddXp(gained, name);
    if (global.LtCanvas && global.LtCanvas.credit) global.LtCanvas.credit(mode, name || mode);
    return gained;
  }

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function render() {
    const brand = global.LtBrand || { mark: "LT", org: "HVAC Legends", isStore: false };
    const track = viewTrack();
    const labs = [];
    track.forEach(function (c) { c.labs.forEach(function (l) { labs.push(l); }); });
    const doneCount = labs.filter(function (l) { return labDone(l.id); }).length;
    const pct = labs.length ? Math.round((doneCount / labs.length) * 100) : 0;
    const xp = progress.xp || 0;
    const lectures = (global.SchoolPack && global.SchoolPack.lectures) || [];

    root.innerHTML = `
      <div class="cu-layout">
        <header class="cu-head">
          <div>
            <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
              <div class="brand-mark" style="width:28px;height:28px;font-size:14px">${brand.mark}</div>
              <div class="brand-word">
                <strong style="font-size:15px">${brand.org}</strong>
                <span>Course · labs you have to finish</span>
              </div>
            </div>
            <h2>${track.length} courses. Experience comes from the lab.</h2>
            <p class="cu-sub">Opening a lab does not count. A flare has to pass. A callback has to close. A 608 drill has to hit 80%.</p>
          </div>
          <div class="cu-progress">
            <div class="ms-bar"><i style="width:${pct}%"></i></div>
            <span>${doneCount} / ${labs.length} labs · ${xp} course XP</span>
            <button class="btn" id="cu-back">Shop floor</button>
          </div>
        </header>
        <div class="cu-grid">
          ${track.map(function (c) {
            const finished = courseDone(c);
            return `
              <article class="cu-card ${finished ? "done" : ""}">
                <header>
                  <span class="cu-code">${c.code}</span>
                  ${finished ? '<span class="cu-badge">Course complete</span>' : ""}
                </header>
                <h3>${c.title}</h3>
                <p class="cu-goal">${c.blurb}</p>
                <div class="cu-actions">
                  ${c.labs.map(function (l, i) {
                    const prev = i > 0 && !labDone(c.labs[i - 1].id);
                    const done = labDone(l.id);
                    return `<button class="btn ${done ? "" : "primary"} cu-launch" data-mode="${l.mode}" data-lab="${l.id}" ${prev ? "disabled" : ""}>${done ? "Done · " : ""}${l.label} · ${l.xp} XP</button><p class="cu-meta">${l.what}</p>`;
                  }).join("")}
                  <button class="btn cu-ask-hub" data-unit="${c.id}">Ask HUB</button>
                </div>
              </article>`;
          }).join("")}
        </div>
        ${lectures.length ? `<section class="cu-lectures"><h2>${esc((global.SchoolPack && global.SchoolPack.org) || "Shop")} lectures</h2><p>Class slides for these courses. Click through, then do the lab.</p><div class="cu-grid">${lectures.map(function (L, i) { return `<button type="button" class="cu-card cu-lecture" data-deck="${i}"><span class="cu-code">${esc(L.code)}</span><h3>${esc(L.title)}</h3><p class="cu-goal">${L.deck.length} slides</p></button>`; }).join("")}</div></section>` : ""}
        <p class="cu-foot">Same labs as the shop floor and the instructor desk. Finish the work. The course moves.</p>
      </div>`;

    root.querySelector("#cu-back").onclick = function () {
      if (onBack) onBack();
    };
    root.querySelectorAll(".cu-launch").forEach(function (btn) {
      btn.onclick = function () {
        if (btn.disabled) return;
        const mode = btn.getAttribute("data-mode");
        if (onLaunch) onLaunch(mode, btn.getAttribute("data-lab"));
      };
    });
    root.querySelectorAll(".cu-lecture").forEach(function (btn) {
      btn.onclick = function () {
        const i = Number(btn.getAttribute("data-deck"));
        const L = lectures[i];
        if (L) openDeck(L);
      };
    });
    root.querySelectorAll(".cu-ask-hub").forEach(function (btn) {
      btn.onclick = function () {
        const id = btn.getAttribute("data-unit");
        const map = (global.SchoolPack && global.SchoolPack.coachMap) || {};
        const coach = AI_COACH[map[id]] || AI_COACH[id] || {};
        if (onAskHub) onAskHub(id, coach);
      };
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  function openDeck(lecture) {
    const slides = lecture.deck || [];
    let i = 0;
    let el = document.getElementById("lt-deck");
    if (!el) {
      el = document.createElement("div");
      el.id = "lt-deck";
      document.body.appendChild(el);
    }
    function paint() {
      const s = slides[i] || { kicker: "", title: "", points: [] };
      el.innerHTML =
        '<div class="lt-slide" role="dialog" aria-modal="true" aria-label="' + esc(lecture.title) + '">' +
        '<p class="lt-kicker">' + esc(s.kicker || lecture.code) + " · " + (i + 1) + " / " + slides.length + "</p>" +
        "<h2>" + esc(s.title) + "</h2>" +
        "<ul>" + (s.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
        '<div class="lt-deck-bar">' +
        '<button type="button" class="btn" id="lt-deck-prev"' + (i === 0 ? " disabled" : "") + ">Back</button>" +
        '<button type="button" class="btn primary" id="lt-deck-next">' + (i === slides.length - 1 ? "Done" : "Next") + "</button>" +
        '<button type="button" class="btn" id="lt-deck-close">Close</button>' +
        "</div></div>";
      el.querySelector("#lt-deck-prev").onclick = function () { if (i > 0) { i--; paint(); } };
      el.querySelector("#lt-deck-next").onclick = function () {
        if (i < slides.length - 1) { i++; paint(); }
        else close();
      };
      el.querySelector("#lt-deck-close").onclick = close;
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") { if (i < slides.length - 1) { i++; paint(); } }
      else if (e.key === "ArrowLeft") { if (i > 0) { i--; paint(); } }
    }
    function close() {
      document.removeEventListener("keydown", onKey);
      if (el) el.remove();
    }
    document.addEventListener("keydown", onKey);
    el.onclick = function (e) { if (e.target === el) close(); };
    paint();
  }

  function nextRecommended() {
    for (let i = 0; i < viewTrack().length; i++) {
      const c = viewTrack()[i];
      for (let j = 0; j < c.labs.length; j++) {
        if (!labDone(c.labs[j].id)) return { code: c.code, title: c.labs[j].label };
      }
    }
    return null;
  }

  function start(host, opts) {
    root = host;
    onLaunch = opts && opts.onLaunch;
    onBack = opts && opts.onBack;
    onAskHub = opts && opts.onAskHub;
    loadProgress();
    render();
    return { stop: function () {}, refresh: render, nextRecommended: nextRecommended, AI_COACH: AI_COACH };
  }

  global.CurriculumTrain = { start: start, UNITS: UNITS, TRACK: TRACK, view: viewTrack, AI_COACH: AI_COACH, nextRecommended: nextRecommended, stamp: stamp };
})(window);
