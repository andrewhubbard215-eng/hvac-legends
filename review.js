/* Review copy for another instructor. Students never see this bar.
   Notes land on Instructor Desk. */
(function (global) {
  "use strict";

  const KEY = "lt-review-v1";

  function saved() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function keep(row) {
    localStorage.setItem(KEY, JSON.stringify(row));
  }

  function post(body, hold) {
    if (global.LtOutbox && !hold) return global.LtOutbox.send("/api/review-notes", body);
    return fetch("/api/review-notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error || "Note did not save");
        return j;
      });
    });
  }

  function reviewLink(code) {
    const u = new URL("index.html", location.href);
    u.search = "play=1&sku=campus&review=" + code;
    return u.href;
  }

  function screenName() {
    const el = document.querySelector(".screen.active");
    if (!el) return "Shop floor";
    const id = (el.id || "").replace(/^screen-/, "");
    const names = {
      hub: "Shop floor",
      sandbox: "System sandbox",
      service: "Service calls",
      gauges: "Manifold school",
      minisplit: "Mini-split install",
      compchange: "Compressor change-out",
      iconnect: "iConnect lab",
      recover: "Recovery",
      cutaway: "See inside",
      epa608: "EPA 608",
      electrical: "Electrical",
      quiz: "Exam",
      curriculum: "Curriculum",
    };
    return names[id] || id || "Shop floor";
  }

  function hideCanvas() {
    const fab = document.getElementById("canvas-fab");
    if (fab) fab.style.display = "none";
  }

  function bar(code) {
    if (document.getElementById("review-bar")) return;
    hideCanvas();
    const style = document.createElement("style");
    style.textContent =
      "#review-bar{position:fixed;top:0;left:0;right:0;z-index:90;display:flex;gap:8px;align-items:center;justify-content:space-between;padding:8px 12px;background:#CE0034;color:#fff;font:600 14px/1.3 'IBM Plex Sans',sans-serif}" +
      "#review-bar .btn{background:#14171a;color:#fff}" +
      "body.review-on{padding-top:48px}" +
      "#review-sheet{position:fixed;inset:0;z-index:130;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}" +
      ".review-card{width:min(520px,100%);background:#14171a;color:#e8edf2;border:1px solid #CE0034;border-radius:16px;padding:16px;display:grid;gap:8px}" +
      ".review-card h2{margin:0}" +
      ".review-card label{display:grid;gap:4px;font-size:12px;color:#c5ced6}" +
      ".review-card input,.review-card textarea{border-radius:8px;border:1px solid #3a4450;background:#0e1216;color:#fff;padding:8px 10px;font:16px/1.4 inherit}" +
      ".review-card textarea{min-height:110px}" +
      ".review-actions{display:flex;flex-wrap:wrap;gap:8px}" +
      "body.review-on #btn-shopschool,body.review-on .edition-bar,body.review-on #canvas-fab{display:none !important}";
    document.head.appendChild(style);
    document.body.classList.add("review-on");
    const el = document.createElement("div");
    el.id = "review-bar";
    el.innerHTML = "<span>Dave Labuono · try the cards. You can't change the app.</span>";
    document.body.appendChild(el);
    watchCards(code);
  }

  const CARDS = {
    sandbox: "System sandbox",
    service: "Service calls",
    gauges: "Manifold school",
    voltmeter: "Voltmeter class",
    ohms: "Ohm's Law",
    ptchart: "P/T charts",
    phonetools: "Phone testers",
    electrical: "Follow the call",
    defusal: "Saturday callback",
    elguide: "Land lugs",
    recover: "Recovery room",
    minisplit: "Mini-split install",
    compchange: "Compressor change-out",
    cutaway: "See inside",
    epa608: "EPA 608 tutor",
    iconnect: "iConnect lab",
    furnace: "Furnace SOO",
    flare: "Flaring lab",
    braze: "Brazing lab",
    quiz: "All-Star Exam",
    curriculum: "Curriculum",
    commandments: "HVAC Commandments",
  };
  let activeCard = "";
  let pending = "";
  const asked = {};

  function ask(code, mode) {
    if (!CARDS[mode] || asked[mode]) return;
    if (document.getElementById("review-sheet")) {
      pending = mode;
      return;
    }
    asked[mode] = true;
    openNote(code, CARDS[mode]);
  }

  function watchCards(code) {
    if (global.ltPlay && !global.ltPlay._rv) {
      const orig = global.ltPlay;
      const wrapped = function (mode) {
        const left = activeCard;
        if (CARDS[mode] && mode !== left) {
          if (left) ask(code, left);
          activeCard = mode;
        } else if (mode === "hub" && left) {
          ask(code, left);
          activeCard = "";
        }
        return orig.apply(this, arguments);
      };
      wrapped._rv = true;
      global.ltPlay = wrapped;
    }
    let onHub = true;
    setInterval(function () {
      const id = ((document.querySelector(".screen.active") || {}).id || "").replace(/^screen-/, "");
      const hub = !id || id === "hub" || id === "title" || id === "character";
      if (hub && !onHub && activeCard) {
        ask(code, activeCard);
        activeCard = "";
      }
      onHub = hub;
    }, 700);
  }

  function openNote(code, card) {
    const who = saved() || {};
    let el = document.getElementById("review-sheet");
    if (!el) {
      el = document.createElement("div");
      el.id = "review-sheet";
      document.body.appendChild(el);
    }
    el.innerHTML =
      '<div class="review-card">' +
      "<h2>" + card + "</h2>" +
      "<p>You tried this card. One note about the card, not each tap. It goes to Andrew. You are not changing the lab.</p>" +
      '<label>Your name<input id="rv-name" maxlength="40" value="' + (who.name || "Dave Labuono") + '" /></label>' +
      '<label>What should change?<textarea id="rv-text" maxlength="500" placeholder="On this card I would…"></textarea></label>' +
      '<p id="rv-note"></p>' +
      '<div class="review-actions"><button type="button" class="btn primary" id="rv-send">Send to Andrew</button><button type="button" class="btn" id="rv-fine">Nothing to change</button></div>' +
      "</div>";
    function done() {
      el.remove();
      if (pending) {
        const next = pending;
        pending = "";
        ask(code, next);
      }
    }
    el.querySelector("#rv-fine").onclick = function () {
      el.querySelector("#rv-text").value = "Nothing to change on this card.";
      el.querySelector("#rv-send").click();
    };
    el.querySelector("#rv-send").onclick = function () {
      const name = el.querySelector("#rv-name").value.trim();
      const text = el.querySelector("#rv-text").value.trim();
      const note = el.querySelector("#rv-note");
      if (text.length < 4) {
        note.textContent = "Write the change, or tap Nothing to change.";
        return;
      }
      post({ action: "note", code: code, name: name, screen: card, text: text })
        .then(function (j) {
          keep({ code: code, name: name });
          if (j && j.queued) {
            note.textContent = "Saved on this phone. It sends when you have Wi-Fi.";
            setTimeout(done, 900);
            return;
          }
          done();
        })
        .catch(function (e) {
          note.textContent = e.message;
        });
    };
  }

  function openDesk() {
    let el = document.getElementById("review-sheet");
    if (!el) {
      el = document.createElement("div");
      el.id = "review-sheet";
      document.body.appendChild(el);
    }
    const row = saved() || {};
    el.innerHTML =
      '<div class="review-card">' +
      "<h2>Review copy for Dave Labuono</h2>" +
      "<p>Send this link to Dave's phone. He can try each card. He cannot edit the app. When he leaves a card, one box asks what he would change about that card. The words show up here. Students do not get this link.</p>" +
      '<p class="review-url" id="rv-url">' + (row.code ? reviewLink(row.code) : "Make the link first.") + "</p>" +
      '<div class="review-actions">' +
      '<button type="button" class="btn primary" id="rv-make">Make review link</button>' +
      '<button type="button" class="btn" id="rv-load">Refresh notes</button>' +
      '<button type="button" class="btn" id="rv-close">Close</button>' +
      "</div>" +
      '<div id="rv-list"></div></div>';
    el.querySelector("#rv-close").onclick = function () { el.remove(); };
    function paint(pad) {
      keep({ code: pad.code, name: row.name || "" });
      el.querySelector("#rv-url").textContent = reviewLink(pad.code);
      const list = el.querySelector("#rv-list");
      list.innerHTML = (pad.notes || []).length
        ? "<ul>" + pad.notes.map(function (n) {
            return "<li><b>" + n.name + "</b> · " + n.screen + "<br>" + n.text + "</li>";
          }).join("") + "</ul>"
        : "<p>No notes yet.</p>";
    }
    el.querySelector("#rv-make").onclick = function () {
      post({ action: "create" }, true).then(paint);
    };
    el.querySelector("#rv-load").onclick = function () {
      const code = (saved() || {}).code;
      if (!code) return;
      fetch("/api/review-notes?code=" + code).then(function (r) { return r.json(); }).then(paint);
    };
    if (row.code) el.querySelector("#rv-load").click();
  }

  function mount() {
    const q = new URLSearchParams(location.search);
    const code = (q.get("review") || "").replace(/\D/g, "").slice(0, 6);
    if (/^\d{6}$/.test(code) && !/desk\.html/i.test(location.pathname)) {
      bar(code);
      return;
    }
    if (!/desk\.html/i.test(location.pathname)) return;
    if (document.getElementById("review-fab")) return;
    const btn = document.createElement("button");
    btn.id = "review-fab";
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Review copy";
    btn.style.cssText = "position:fixed;left:12px;bottom:64px;z-index:80";
    btn.onclick = openDesk;
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
