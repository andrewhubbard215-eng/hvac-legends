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
      iconnect: ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + " lab",
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
    iconnect: ((window.LtBrand && window.LtBrand.trainer) || "Hubconnect") + " lab",
    furnace: "Furnace SOO",
    call90: "90% furnace call",
    train: "Training deck",
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
      fetch("/api/review-notes?code=" + code).then(function (r) {
        if (!r.ok) return { code: code, notes: [] };
        return r.json();
      }).then(function (pad) {
        if (!pad || pad.error) pad = { code: code, notes: [] };
        paint(pad);
      });
    };
    if (row.code) el.querySelector("#rv-load").click();
  }

  function instructorOn() {
    try {
      if (new URLSearchParams(location.search).get("desk") === "instructor") return true;
      if (localStorage.getItem("lt-desk-pass-allstars") === "1") return true;
      if (global.LtBrand && global.LtBrand.desk) return true;
    } catch (_) {}
    return false;
  }

  function fixNotes() {
    try {
      var rows = JSON.parse(localStorage.getItem("lt-fix-notes-v1") || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch (_) {
      return [];
    }
  }

  function keepFix(rows) {
    localStorage.setItem("lt-fix-notes-v1", JSON.stringify(rows.slice(0, 80)));
  }

  function escFix(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      if (c === "&") return "&" + "amp;";
      if (c === "<") return "&" + "lt;";
      if (c === ">") return "&" + "gt;";
      return "&" + "quot;";
    });
  }

  function paintFix(rows) {
    var list = document.getElementById("fix-list");
    if (!list) return;
    if (!rows.length) {
      list.innerHTML = "<li class=\"fix-empty\">No notes yet.</li>";
      return;
    }
    list.innerHTML = rows.map(function (n) {
      return "<li><b>" + escFix(n.screen || "Shop floor") + "</b> " + escFix(n.text) + "</li>";
    }).join("");
  }

  function mountFix() {
    if (!instructorOn() || /desk\.html/i.test(location.pathname)) return;
    if (document.getElementById("fix-notes")) return;
    var hub = document.getElementById("screen-hub");
    if (!hub) return;
    var style = document.createElement("style");
    style.textContent =
      ".fix-notes{max-width:1100px;margin:12px auto 16px;padding:14px;border-radius:16px;border:1px solid rgba(232,196,80,.65);background:#1a160f;color:#e8eef2}" +
      ".fix-notes h3{margin:0 0 4px;color:#f0d878;font-size:18px}" +
      ".fix-notes p{margin:0 0 8px;color:#d5dde4;font-size:14px}" +
      ".fix-notes select,.fix-notes textarea{width:100%;box-sizing:border-box;border-radius:10px;border:1px solid #6a5a32;background:#12100c;color:#fff;padding:10px;font:16px/1.4 'IBM Plex Sans',sans-serif}" +
      ".fix-notes textarea{min-height:72px;margin-top:8px}" +
      ".fix-notes .fix-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}" +
      "#fix-list{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}" +
      "#fix-list li{background:#12100c;border-radius:10px;padding:8px 10px;font-size:14px;line-height:1.4}" +
      "#fix-list b{color:#f0d878}";
    document.head.appendChild(style);
    var el = document.createElement("section");
    el.id = "fix-notes";
    el.className = "fix-notes";
    el.innerHTML =
      "<h3>What should we fix?</h3>" +
      "<p>Instructor only. One note about a card. It stays on this page.</p>" +
      "<select id=\"fix-card\">" +
      "<option>Shop floor</option><option>Take the call</option><option>See inside</option>" +
      "<option>Land the lugs</option><option>Saturday call</option><option>System sandbox</option>" +
      "<option>Recovery</option><option>Mini-split</option><option>90% furnace call</option><option>Training deck</option><option>Instructor desk</option><option>Other</option>" +
      "</select>" +
      "<textarea id=\"fix-text\" maxlength=\"500\" placeholder=\"On this card I would…\"></textarea>" +
      "<div class=\"fix-actions\">" +
      "<button type=\"button\" class=\"btn primary\" id=\"fix-save\">Save note</button>" +
      "<button type=\"button\" class=\"btn\" id=\"fix-copy\">Copy notes</button>" +
      "</div>" +
      "<p id=\"fix-status\"></p>" +
      "<ul id=\"fix-list\"></ul>";
    var anchor = hub.querySelector(".floor-start");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor.nextSibling);
    else hub.appendChild(el);
    paintFix(fixNotes());
    fetch("/api/review-notes?code=100001")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.notes) return;
        keepFix(j.notes);
        paintFix(j.notes);
      })
      .catch(function () {});
    el.querySelector("#fix-save").onclick = function () {
      var text = el.querySelector("#fix-text").value.trim();
      var status = el.querySelector("#fix-status");
      if (text.length < 4) {
        status.textContent = "Write the change first.";
        return;
      }
      var note = {
        name: "Instructor",
        screen: el.querySelector("#fix-card").value,
        text: text,
        at: Date.now(),
      };
      var rows = fixNotes();
      rows.unshift(note);
      keepFix(rows);
      paintFix(rows);
      el.querySelector("#fix-text").value = "";
      status.textContent = "Saved on this page.";
      post({ action: "fix", name: note.name, screen: note.screen, text: note.text }, true)
        .then(function (j) {
          if (j && j.notes) {
            keepFix(j.notes);
            paintFix(j.notes);
          }
          status.textContent = "Saved. It stays on this instructor page.";
        })
        .catch(function () {
          status.textContent = "Saved on this phone only. Save it again on Wi-Fi so the other phone can see it.";
        });
    };
    el.querySelector("#fix-copy").onclick = function () {
      var lines = fixNotes().map(function (n) {
        return (n.screen || "Shop floor") + ": " + n.text;
      });
      var blob = lines.length ? lines.join("\n") : "No notes yet.";
      var status = el.querySelector("#fix-status");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(blob).then(function () {
          status.textContent = "Copied. Paste it into the chat so it can be fixed.";
        }).catch(function () {
          status.textContent = blob;
        });
      } else {
        status.textContent = blob;
      }
    };
  }

  function mount() {
    const q = new URLSearchParams(location.search);
    const code = (q.get("review") || "").replace(/\D/g, "").slice(0, 6);
    if (/^\d{6}$/.test(code) && !/desk\.html/i.test(location.pathname)) {
      bar(code);
    }
    mountFix();
    if (!/desk\.html/i.test(location.pathname)) return;
    if (document.getElementById("review-fab")) return;
    const btn = document.createElement("button");
    btn.id = "review-fab";
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Review copy";
    btn.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:80";
    btn.onclick = openDesk;
    document.body.appendChild(btn);
    var desk = document.getElementById("desk");
    function park() {
      var head = document.querySelector("#desk .ss-head");
      if (!head || btn.parentElement === head) return;
      btn.style.cssText = "position:relative;left:auto;right:auto;top:auto;bottom:auto;z-index:2;margin:0";
      head.appendChild(btn);
    }
    if (desk) {
      park();
      new MutationObserver(park).observe(desk, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
