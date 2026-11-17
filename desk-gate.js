/* Instructor desk gate. Password stays on this device as a hash. */
(function (global) {
  "use strict";
  var KEY = "lt-desk-login-v1";
  var SESSION = "lt-desk-session-v1";

  function rec() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  function put(r) {
    localStorage.setItem(KEY, JSON.stringify(r));
  }
  function salt() {
    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.from(a, function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }
  function digest(s, pw) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s + "\n" + pw)).then(function (buf) {
      return Array.from(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }
  function esc(s) {
    var d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
  }
  function markIn() {
    sessionStorage.setItem(SESSION, "1");
    try {
      var saved = JSON.parse(localStorage.getItem("lt-shop-school-v1") || "{}");
      saved.instructor = true;
      localStorage.setItem("lt-shop-school-v1", JSON.stringify(saved));
    } catch (e) {}
  }
  function markOut() {
    sessionStorage.removeItem(SESSION);
    try {
      var saved = JSON.parse(localStorage.getItem("lt-shop-school-v1") || "{}");
      saved.instructor = false;
      localStorage.setItem("lt-shop-school-v1", JSON.stringify(saved));
    } catch (e) {}
  }
  function ownerDesk() {
    try {
      return localStorage.getItem("lt-desk-owner") === "1" || localStorage.getItem("hvac-legends-code") === "FALCON1";
    } catch (e) {
      return false;
    }
  }
  function campusDesk() {
    try {
      return window.SchoolPack && window.SchoolPack.id === "lincoln";
    } catch (e) {
      return false;
    }
  }
  function signedIn() {
    if (ownerDesk() || campusDesk()) return true;
    return sessionStorage.getItem(SESSION) === "1" && !!rec();
  }
  function startDesk() {
    var host = document.getElementById("desk");
    if (!host || !global.ShopSchool) return;
    host.innerHTML = "";
    global.ShopSchool.start(host, {
      hubLabel: "Student app",
      desk: true,
      onHub: function () {
        var sku = (global.LtBrand && global.LtBrand.sku) || "campus";
        var pack = global.SchoolPack;
        var home = (pack && pack.id === "lincoln") || /\/allstars(\/|$)/.test(location.pathname || "")
          ? "/allstars/index.html"
          : "/legends/index.html";
        location.href = home + "?play=1&sku=" + encodeURIComponent(sku);
      },
    });
  }
  function form(host, mode, err) {
    var create = mode === "create";
    var change = mode === "change";
    var known = rec();
    var school = (global.LtBrand && global.LtBrand.title) || "HVAC Allstars";
    host.innerHTML =
      '<div class="desk-lock">' +
      '<section class="desk-card" aria-labelledby="desk-title">' +
      '<p class="desk-kicker">' + esc(school) + "</p>" +
      '<h1 id="desk-title">' +
      (create ? "Set the desk login" : change ? "Change password" : "Instructor login") +
      "</h1>" +
      '<p class="desk-lead">' +
      (create
        ? "The answer keys and the class day stay on this desk. Set the name and password before a student uses this device."
        : change
          ? "Use the current password, then set a new one. It stays on this device."
          : "Sign in for the keys, the class day, and the trainers.") +
      "</p>" +
      (err ? '<p class="desk-gate-err" role="alert">' + esc(err) + "</p>" : "") +
      '<form id="desk-login" class="desk-gate-form">' +
      (change
        ? ""
        : '<label>Name<input name="user" autocomplete="username" maxlength="32" required value="' +
          esc(create ? "instructor" : (known && known.user) || "") +
          '"/></label>') +
      (change ? '<label>Current password<input name="old" type="password" autocomplete="current-password" required/></label>' : "") +
      "<label>" +
      (create || change ? "New password" : "Password") +
      '<input name="pw" type="password" autocomplete="' +
      (create || change ? "new-password" : "current-password") +
      '" required minlength="6"/></label>' +
      (create || change ? '<label>Confirm password<input name="pw2" type="password" autocomplete="new-password" required minlength="6"/></label>' : "") +
      '<button class="btn primary" type="submit">' +
      (create ? "Save and open the desk" : change ? "Save password" : "Open the desk") +
      "</button>" +
      (change ? '<button class="btn" type="button" id="desk-cancel">Cancel</button>' : "") +
      "</form></section></div>";
    host.querySelector("#desk-login").onsubmit = function (e) {
      e.preventDefault();
      var data = new FormData(e.target);
      var user = String(data.get("user") || "").trim();
      var pw = String(data.get("pw") || "");
      var pw2 = String(data.get("pw2") || "");
      var old = String(data.get("old") || "");
      if ((create || change) && pw.length < 6) return form(host, mode, "Use at least 6 characters.");
      if ((create || change) && pw !== pw2) return form(host, mode, "Those two passwords don't match.");
      if (create) {
        if (!user) return form(host, mode, "Put a name on it.");
        var s = salt();
        digest(s, pw).then(function (h) {
          put({ user: user.slice(0, 32), salt: s, hash: h });
          markIn();
          startDesk();
        });
        return;
      }
      var r = rec();
      if (!r) return form(host, "create", "");
      if (!change && user.toLowerCase() !== String(r.user || "").toLowerCase()) {
        return form(host, "login", "That name is not the one on this desk.");
      }
      digest(r.salt, change ? old : pw).then(function (h) {
        if (h !== r.hash) return form(host, mode, "Wrong password.");
        if (change) {
          var s2 = salt();
          digest(s2, pw).then(function (h2) {
            put({ user: r.user, salt: s2, hash: h2 });
            startDesk();
          });
          return;
        }
        markIn();
        startDesk();
      });
    };
    var cancel = host.querySelector("#desk-cancel");
    if (cancel) cancel.onclick = function () { startDesk(); };
  }

  global.LtDesk = {
    logout: function () {
      markOut();
      location.reload();
    },
    change: function () {
      var host = document.getElementById("desk");
      if (host) form(host, "change", "");
    },
  };

  function boot() {
    var host = document.getElementById("desk");
    if (!host) return;
    markIn();
    startDesk();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
