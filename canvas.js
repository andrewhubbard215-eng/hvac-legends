/* HVAC Legends. Canvas credit window is off for the first publish and classroom tryout.
   The button and the sheet do not mount. Lab credit calls stay quiet until this flag is turned on. */
(function (global) {
  "use strict";

  var WINDOW_ON = false;
  const KEY = "lt-canvas-v1";

  function campus() {
    if (/desk\.html/i.test(location.pathname)) return true;
    if (global.LtBrand && global.LtBrand.isStore) return false;
    return document.documentElement.getAttribute("data-sku") !== "store";
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function save(row) {
    localStorage.setItem(KEY, JSON.stringify(row));
  }

  function deviceName() {
    const ua = navigator.userAgent || "";
    if (/iPhone|Android|Mobile/i.test(ua)) return "phone";
    return "pc";
  }

  function post(body) {
    var send = global.LtOutbox ? global.LtOutbox.send : null;
    if (send) return send("/api/canvas-credit", body);
    return fetch("/api/canvas-credit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error || "Canvas credit did not save");
        return j;
      });
    });
  }

  function credit(mode, label) {
    if (!WINDOW_ON) return;
    const row = load();
    if (!row || !/^\d{6}$/.test(row.pin || "") || !row.name) return;
    post({
      action: "stamp",
      pin: row.pin,
      name: row.name,
      lab: label || mode,
      device: row.device || deviceName(),
    }).catch(function () {});
  }

  function sheet() {
    let el = document.getElementById("canvas-sheet");
    if (!el) {
      el = document.createElement("div");
      el.id = "canvas-sheet";
      document.body.appendChild(el);
    }
    return el;
  }

  function close() {
    const el = document.getElementById("canvas-sheet");
    if (el) el.remove();
  }

  function studentUrl(pin) {
    const u = new URL("index.html", location.href);
    u.search = "play=1&sku=campus&canvas=1&pin=" + pin;
    return u.href;
  }

  function csv(room) {
    const lines = ["Name,Device,Labs credited,Lab count"];
    (room.rows || []).forEach(function (r) {
      lines.push(
        '"' + r.name.replace(/"/g, "") + '","' + (r.devices || []).join(" ") + '","' + (r.labs || []).join("; ") + '",' + (r.labs || []).length
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "canvas-credit-" + room.pin + ".csv";
    a.click();
  }

  function openInstructor() {
    const el = sheet();
    const saved = load() || {};
    el.innerHTML =
      '<div class="canvas-card">' +
      "<h2>Canvas credit</h2>" +
      "<p>Paste the student link into a Canvas module. Students register once, with the same name, on the classroom PC and on their phone. A finished lab credits that name on both.</p>" +
      '<p class="canvas-url" id="cv-url">' + (saved.pin ? studentUrl(saved.pin) : "Create the class PIN first.") + "</p>" +
      '<div class="canvas-actions">' +
      '<button type="button" class="btn primary" id="cv-make">New class PIN</button>' +
      '<button type="button" class="btn" id="cv-load">Refresh roster</button>' +
      '<button type="button" class="btn" id="cv-csv">Download CSV</button>' +
      '<button type="button" class="btn" id="cv-close">Close</button>' +
      "</div>" +
      '<p id="cv-note"></p>' +
      '<div id="cv-roster"></div>' +
      "<p>In the course: Modules → add an External URL. Paste the link. Publish it. Until automatic grade passback is on, download the CSV and enter the lab count on the assignment.</p>" +
      "</div>";
    el.querySelector("#cv-close").onclick = close;
    function paintRoom(room) {
      save({ pin: room.pin, name: saved.name || "", device: "desk", instructor: true });
      el.querySelector("#cv-url").textContent = studentUrl(room.pin);
      const box = el.querySelector("#cv-roster");
      box.innerHTML = (room.rows || []).length
        ? "<ul>" + room.rows.map(function (r) {
            return "<li><b>" + r.name + "</b> · " + (r.devices || []).join(" + ") + " · " + (r.labs || []).join(", ") + "</li>";
          }).join("") + "</ul>"
        : "<p>Nobody registered yet.</p>";
    }
    el.querySelector("#cv-make").onclick = function () {
      post({ action: "create" }).then(paintRoom).catch(function (e) {
        el.querySelector("#cv-note").textContent = e.message;
      });
    };
    function refresh() {
      const pin = (load() || {}).pin;
      if (!pin) return;
      fetch("/api/canvas-credit?pin=" + pin).then(function (r) { return r.json(); }).then(paintRoom).catch(function (e) {
        el.querySelector("#cv-note").textContent = e.message || "No roster";
      });
    }
    el.querySelector("#cv-load").onclick = refresh;
    el.querySelector("#cv-csv").onclick = function () {
      const pin = (load() || {}).pin;
      if (!pin) return;
      fetch("/api/canvas-credit?pin=" + pin).then(function (r) { return r.json(); }).then(csv);
    };
    if (saved.pin) refresh();
  }

  function openStudent(prefill) {
    const el = sheet();
    const saved = load() || {};
    const pin = (prefill || saved.pin || "").replace(/\D/g, "").slice(0, 6);
    el.innerHTML =
      '<div class="canvas-card">' +
      "<h2>Register for credit</h2>" +
      "<p>Use the same name that is on the Canvas roster. Type it the same way on this " + deviceName() + " and on your other device. The class PIN is on the board.</p>" +
      '<label>Class PIN<input id="cv-pin" inputmode="numeric" maxlength="6" value="' + pin + '" /></label>' +
      '<label>Name on the roster<input id="cv-name" maxlength="40" value="' + (saved.name || "") + '" /></label>' +
      '<p id="cv-note"></p>' +
      '<div class="canvas-actions">' +
      '<button type="button" class="btn primary" id="cv-reg">Register this ' + deviceName() + "</button>" +
      '<button type="button" class="btn" id="cv-close">Close</button>' +
      "</div>" +
      "<p>Phone: Install, or Share → Add to Home Screen. PC: Install in Chrome or Edge. Open the installed copy and register with the same name. Credit follows the name, not the device.</p>" +
      '<div id="cv-mine"></div>' +
      "</div>";
    el.querySelector("#cv-close").onclick = close;
    el.querySelector("#cv-reg").onclick = function () {
      const next = {
        pin: el.querySelector("#cv-pin").value.replace(/\D/g, "").slice(0, 6),
        name: el.querySelector("#cv-name").value.trim().slice(0, 40),
        device: deviceName(),
      };
      const note = el.querySelector("#cv-note");
      if (!/^\d{6}$/.test(next.pin) || next.name.length < 2) {
        note.textContent = "Need the 6-digit PIN and the name on the roster.";
        return;
      }
      post({ action: "register", pin: next.pin, name: next.name, device: next.device })
        .then(function (j) {
          save(next);
          note.textContent = "Registered. Finished labs on this " + next.device + " credit " + next.name + ".";
          const mine = el.querySelector("#cv-mine");
          mine.textContent = (j.you.labs || []).length ? "Already credited: " + j.you.labs.join(", ") : "No labs credited yet.";
        })
        .catch(function (e) {
          note.textContent = e.message;
        });
    };
  }

  function mount() {
    if (!WINDOW_ON) return;
    if (!campus()) return;
    if (document.getElementById("canvas-fab")) return;
    const style = document.createElement("style");
    style.textContent =
      "#canvas-fab{position:fixed;left:12px;bottom:12px;z-index:80}" +
      "#canvas-sheet{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}" +
      ".canvas-card{width:min(520px,100%);max-height:86dvh;overflow:auto;background:#14171a;color:#e8edf2;border:1px solid #CE0034;border-radius:16px;padding:16px;display:grid;gap:8px}" +
      ".canvas-card h2{margin:0}" +
      ".canvas-card p,.canvas-card li{font-size:14px;line-height:1.4}" +
      ".canvas-card label{display:grid;gap:4px;font-size:12px;color:#c5ced6}" +
      ".canvas-card input{height:40px;border-radius:8px;border:1px solid #3a4450;background:#0e1216;color:#fff;padding:0 10px}" +
      ".canvas-actions{display:flex;flex-wrap:wrap;gap:8px}" +
      ".canvas-url{word-break:break-all;color:#e8c450}";
    document.head.appendChild(style);
    const instructor = /desk\.html/i.test(location.pathname);
    const btn = document.createElement("button");
    btn.id = "canvas-fab";
    btn.type = "button";
    btn.className = "btn primary";
    btn.textContent = instructor ? "Canvas roster" : "Canvas credit";
    btn.onclick = function () {
      if (instructor) openInstructor();
      else openStudent();
    };
    document.body.appendChild(btn);
    const q = new URLSearchParams(location.search);
    if (!instructor && (q.get("canvas") === "1" || q.get("pin"))) openStudent(q.get("pin") || "");
  }

  global.LtCanvas = { credit: credit, openStudent: openStudent, openInstructor: openInstructor };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
