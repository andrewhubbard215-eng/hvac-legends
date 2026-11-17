/* HVAC Legends seat. Pay once. A restore code brings the seat back after a browser wipe. */
(function () {
  var PAY = "https://buy.stripe.com/bJe00dc2E6YU3PU3wJ1B600";
  var KEY = "hvac-legends-seat";
  var CODE = "hvac-legends-code";
  var DEMO_ENDS = Date.parse("2026-10-31T04:00:00Z");
  var SHOW_WALL = false;
  var OWNER = "FALCON1";

  function norm(raw) {
    return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function deviceId() {
    var key = "hvac-legends-device";
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    try {
      var id = localStorage.getItem(key) || "";
      if (id.length >= 8) return id;
      id = "";
      for (var i = 0; i < 16; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
      localStorage.setItem(key, id);
      return id;
    } catch (e) {
      return "";
    }
  }

  function paid() {
    try { if (localStorage.getItem(KEY) === "1") return true; } catch (e) {}
    return document.cookie.indexOf(KEY + "=1") !== -1;
  }
  function savedCode() {
    try { return localStorage.getItem(CODE) || ""; } catch (e) { return ""; }
  }
  function openDesk() {
    try {
      localStorage.setItem("lt-desk-owner", "1");
      localStorage.setItem("lt-desk-pass-legends", "1");
      localStorage.setItem("lt-desk-pass-allstars", "1");
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem("lt-shop-school-v1") || "{}"); } catch (e) {}
      saved.instructor = true;
      localStorage.setItem("lt-shop-school-v1", JSON.stringify(saved));
    } catch (e) {}
  }
  function mark(code) {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    document.cookie = KEY + "=1; Max-Age=31536000; Path=/; SameSite=Lax";
    if (code) {
      try { localStorage.setItem(CODE, code); } catch (e) {}
    }
  }
  function css() {
    if (document.getElementById("seat-css")) return;
    var st = document.createElement("style");
    st.id = "seat-css";
    st.textContent = [
      "#seat-wall,#seat-code{position:fixed;inset:0;z-index:400;display:flex;align-items:flex-start;justify-content:center;padding:24px;overflow:auto;background:#0b1014;color:#f7f3ea;font:500 16px/1.4 'IBM Plex Sans',system-ui,sans-serif}",
      "#seat-code{z-index:410;background:rgba(11,16,20,.92)}",
      "#seat-wall .seat-card,#seat-code .seat-card{width:min(420px,100%);margin:auto;text-align:center}",
      "#seat-wall h1,#seat-code h1{margin:0 0 8px;font:400 64px/0.9 'Bebas Neue',sans-serif;letter-spacing:.04em}",
      "#seat-wall h1 span{color:#CE0034}",
      "#seat-wall p,#seat-code p{margin:0 0 18px;color:#c8c0b0}",
      "#seat-wall .price{color:#e8c450;font:400 42px/1 'Bebas Neue',sans-serif;letter-spacing:.06em}",
      "#seat-code .code{margin:0 0 12px;color:#e8c450;font:400 40px/1 'Bebas Neue',sans-serif;letter-spacing:.12em}",
      "#seat-wall .btn,#seat-code .btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border:0;border-radius:10px;background:#CE0034;color:#fff;text-decoration:none;font-weight:700;cursor:pointer}",
      "#seat-wall .fine{margin-top:14px;font-size:13px}",
      "#seat-restore{display:flex;flex-direction:column;gap:8px;margin-top:16px;text-align:left}",
      "#seat-restore label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#e8c450}",
      "#seat-restore input{display:block!important;width:100%!important;height:52px!important;min-height:52px!important;box-sizing:border-box;border-radius:10px;border:2px solid #e8c450!important;background:#10161c!important;color:#fff!important;padding:0 12px;font:600 18px/1 'IBM Plex Sans',system-ui,sans-serif}",
      "#seat-restore .btn{width:100%}",
      "#seat-miss{color:#CE0034;font-size:13px;min-height:1.2em}"
    ].join("");
    document.head.appendChild(st);
  }
  function showCode(code) {
    if (!code || document.getElementById("seat-code")) return;
    css();
    var el = document.createElement("div");
    el.id = "seat-code";
    el.innerHTML = '<div class="seat-card"><h1>SAVE THIS</h1><p class="code"></p><p>This restore code is for one person. It opens HVAC Legends on your phone and your PC. It will not work for anyone else.</p><button type="button" class="btn">I wrote it down</button></div>';
    el.querySelector(".code").textContent = code;
    el.querySelector("button").onclick = function () { el.remove(); };
    document.body.appendChild(el);
  }
  function issue(session) {
    var have = savedCode();
    if (have) {
      showCode(have);
      return Promise.resolve(have);
    }
    return fetch("/api/seat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "issue", session: session || "", device: deviceId() }),
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (data && data.code) {
        mark(data.code);
        showCode(data.code);
      }
      return data && data.code;
    }).catch(function () { return ""; });
  }
  function wall() {
    if (document.getElementById("seat-wall")) return;
    css();
    var el = document.createElement("div");
    el.id = "seat-wall";
    el.innerHTML = '<div class="seat-card"><p>ANDREW HUBBARD</p><h1>HVAC <span>LEGENDS</span></h1><p class="price">$14.99</p><p>One-time seat. Shop floor, sandbox, gauges, charging, recovery, electrical, and EPA 608 practice.</p><a class="btn" href="' + PAY + '">Buy this seat</a><p class="fine">After you pay, save the restore code. It works on your phone and your PC only.</p><form id="seat-restore"><label for="seat-code-input">Restore code</label><input id="seat-code-input" name="code" autocomplete="off" placeholder="Type the code" aria-label="Restore code"><button class="btn" type="submit">Restore</button></form><p id="seat-miss"></p></div>';
    document.body.appendChild(el);
    el.querySelector("#seat-restore").onsubmit = function (ev) {
      ev.preventDefault();
      var input = el.querySelector("input");
      var miss = document.getElementById("seat-miss");
      miss.textContent = "";
      if (norm(input.value) === OWNER) {
        mark(OWNER);
        openDesk();
        el.remove();
        location.reload();
        return;
      }
      fetch("/api/seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", code: input.value, device: deviceId() }),
      }).then(function (r) {
        return r.text().then(function (text) {
          var data = {};
          try { data = JSON.parse(text); } catch (e) {}
          return { ok: r.ok, data: data };
        });
      }).then(function (res) {
        if (!res.ok || !res.data.ok) throw new Error(res.data.error || "That code is not on file.");
        mark(res.data.code || input.value);
        el.remove();
      }).catch(function (err) {
        miss.textContent = (err && err.message) || "That code is not on file.";
      });
    };
  }
  function boot() {
    if (!SHOW_WALL) {
      var w = document.getElementById("seat-wall");
      var c = document.getElementById("seat-code");
      if (w) w.remove();
      if (c) c.remove();
      return;
    }
    var q = new URLSearchParams(location.search);
    var back = q.get("paid") === "1";
    if (back) {
      mark();
      var session = q.get("session_id") || "";
      q.delete("paid");
      q.delete("session_id");
      history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q.toString() : "") + location.hash);
      issue(session);
      return;
    }
    if (paid()) {
      if (!savedCode()) issue("");
      return;
    }
    wall();
  }
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
