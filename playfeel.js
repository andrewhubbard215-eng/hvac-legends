/* Shared play feel for the shop bays.
   Labs call this. They do not restyle themselves.
   PlayFeel.coach(root, text) — one next move, replaces the last line.
   PlayFeel.pop(anchor, text, "ok"|"bad"|"xp") — floats off the thing you touched.
   PlayFeel.bump(el) / PlayFeel.deny(el) — the piece reacts. */
(function (global) {
  "use strict";

  function coach(root, text) {
    var bar = document.getElementById("pf-coach-bar");
    var opener = document.getElementById("pf-coach-open");
    if (!text) {
      if (bar) bar.hidden = true;
      if (opener) opener.hidden = true;
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "pf-coach-bar";
      bar.className = "pf-coach";
      bar.innerHTML =
        '<header class="pf-coach-head"><b>Steps</b><button type="button" id="pf-coach-x">Close</button></header>' +
        '<p id="pf-coach-line"></p>';
      document.body.appendChild(bar);
      bar.querySelector("#pf-coach-x").onclick = function (e) {
        e.stopPropagation();
        bar.dataset.shut = "1";
        bar.hidden = true;
        var open = ensureOpener();
        if (open) open.hidden = false;
      };
      if (global.LtDrag && global.LtDrag.makeMoveable) {
        global.LtDrag.makeMoveable(bar.querySelector(".pf-coach-head"), bar, "lt-pf-coach-pos");
      }
    }
    var line = bar.querySelector("#pf-coach-line");
    if (line) line.textContent = text;
    if (bar.dataset.shut === "1") {
      var open = ensureOpener();
      if (open) open.hidden = false;
      return;
    }
    bar.hidden = false;
    if (opener) opener.hidden = true;
  }

  function ensureOpener() {
    var opener = document.getElementById("pf-coach-open");
    if (opener) return opener;
    opener = document.createElement("button");
    opener.id = "pf-coach-open";
    opener.type = "button";
    opener.className = "pf-coach-open";
    opener.textContent = "Steps";
    opener.hidden = true;
    opener.onclick = function () {
      var bar = document.getElementById("pf-coach-bar");
      if (!bar) {
        opener.hidden = true;
        return;
      }
      bar.dataset.shut = "";
      bar.hidden = false;
      opener.hidden = true;
    };
    document.body.appendChild(opener);
    return opener;
  }

  function pop(anchor, text, kind) {
    if (!text) return;
    var el = document.createElement("div");
    el.className = "pf-pop pf-" + (kind || "ok");
    el.textContent = text;
    var r = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
    if (!r || r.width < 2) {
      el.style.left = "50%";
      el.style.top = "28%";
    } else {
      el.style.left = Math.round(r.left + r.width / 2) + "px";
      el.style.top = Math.round(r.top + 8) + "px";
    }
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 280);
    }, 900);
  }

  function kick(el, cls) {
    if (!el || !el.classList) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  global.PlayFeel = {
    coach: coach,
    pop: pop,
    bump: function (el) { kick(el, "pf-bump"); },
    deny: function (el) { kick(el, "pf-deny"); },
  };
})(window);
