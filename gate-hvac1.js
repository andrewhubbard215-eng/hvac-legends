/* Front door. Students go to the shop. Pitch, Allstars, and the desk ask for HVAC1. */
(function () {
  var KEY = "lt-hvac1";
  var PASS = "HVAC1";
  try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  var script = document.currentScript;
  var doors = script && script.getAttribute("data-doors") === "1";
  function open() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function grant() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    document.documentElement.classList.add("hvac1-open");
    document.documentElement.classList.remove("hvac1-lock");
    var gate = document.getElementById("hvac1-gate");
    if (gate) gate.remove();
  }
  function doorsHtml() {
    return (
      '<nav class="hvac1-doors" id="hvac1-doors">' +
      '<a class="student" href="/legends/index.html?play=1">Student shop</a>' +
      '<a data-lock="1" href="/legends/pitch.html">The pitch</a>' +
      '<a data-lock="1" href="/allstars/index.html?play=1">Allstars</a>' +
      '<a data-lock="1" href="/allstars/desk.html">Instructor desk</a>' +
      "</nav>"
    );
  }
  var css = document.createElement("style");
  css.textContent = [
    "html:not(.hvac1-open) .as-pitch,",
    "html:not(.hvac1-open) #btn-quiz-box,",
    "html:not(.hvac1-open) #hub-desk,",
    "html:not(.hvac1-open) #btn-shopschool,",
    "html:not(.hvac1-open) #floor-desk{display:none!important}",
    "html.hvac1-lock #app,html.hvac1-lock #desk,html.hvac1-lock .deck,html.hvac1-lock body>*{display:none!important}",
    "html.hvac1-lock #hvac1-gate{display:flex!important}",
    "#hvac1-gate{position:fixed;inset:0;z-index:10000;align-items:center;justify-content:center;padding:24px;background:#0c1014;color:#f4efe6;font:500 16px/1.4 'IBM Plex Sans',system-ui,sans-serif}",
    "#hvac1-gate .card{width:min(440px,100%);background:#161b21;border:2px solid #CE0034;border-radius:16px;padding:20px}",
    "#hvac1-gate h1{font:700 32px/1 'Bebas Neue',Impact,sans-serif;letter-spacing:.04em;margin:0 0 8px}",
    "#hvac1-gate p{margin:0 0 12px;color:#d8dde3}",
    ".hvac1-doors{display:flex;flex-wrap:wrap;gap:8px}",
    "#screen-hub > .hvac1-doors{position:sticky;top:0;z-index:60;padding:8px;background:#1a1208;border-bottom:1px solid #e8c450}",
    "body:has(#hvac1-doors) #toast-host{top:128px!important}",
    ".hvac1-doors a{flex:1 1 46%;text-align:center;text-decoration:none;color:#10161c;background:#e8c450;border-radius:999px;padding:12px 8px;font-weight:800}",
    ".hvac1-doors a.student{background:#f4efe6}",
    "#hvac1-gate label{display:block;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#d4b45a;margin-top:12px}",
    "#hvac1-gate input{display:block;width:100%;margin:6px 0 12px;min-height:48px;padding:8px 12px;border-radius:10px;border:1px solid #3a4654;background:#0c1014;color:#fff;font:500 18px/1 system-ui,sans-serif}",
    "#hvac1-gate button{width:100%;min-height:48px;border:0;border-radius:999px;background:#CE0034;color:#fff;font:700 16px/1 system-ui,sans-serif}",
    "#hvac1-gate .bad{color:#ffb4be;font-weight:700}"
  ].join("");
  document.head.appendChild(css);
  if (open()) document.documentElement.classList.add("hvac1-open");

  var nextHref = "";
  function ask(done) {
    var gate = document.getElementById("hvac1-gate");
    if (!gate) {
      gate = document.createElement("div");
      gate.id = "hvac1-gate";
      document.body.appendChild(gate);
    }
    gate.innerHTML =
      '<div class="card"><form>' +
      "<h1>Password</h1>" +
      "<p>Students use the shop. This door is for the pitch.</p>" +
      '<label>Password<input type="password" name="pw" autocomplete="current-password" required /></label>' +
      '<p class="bad" hidden></p>' +
      '<button type="submit">Open</button>' +
      "</form></div>";
    var input = gate.querySelector("input");
    var err = gate.querySelector(".bad");
    gate.querySelector("form").onsubmit = function (e) {
      e.preventDefault();
      if (String(input.value || "").trim() !== PASS) {
        err.hidden = false;
        err.textContent = "Wrong password.";
        input.focus();
        return;
      }
      var href = nextHref;
      grant();
      if (done) done();
      if (href) location.href = href;
    };
    input.focus();
  }

  function lockedTarget(node) {
    if (!node || !node.closest) return null;
    return node.closest("[data-lock], #btn-quiz-box, #hub-desk, #btn-shopschool, #floor-desk, .as-pitch a, a[href*='pitch.html'], a[href*='desk.html'], a[href*='/allstars/']");
  }

  document.addEventListener("click", function (e) {
    if (open()) return;
    var hit = lockedTarget(e.target);
    if (!hit) return;
    if (hit.classList && hit.classList.contains("student")) return;
    e.preventDefault();
    e.stopPropagation();
    nextHref = hit.href || "";
    ask(function () {
      if (!nextHref && hit.click) hit.click();
    });
  }, true);

  function bar() {
    if (!doors || document.querySelector("#screen-hub > .hvac1-doors")) return;
    var hub = document.getElementById("screen-hub");
    if (!hub) return;
    hub.insertAdjacentHTML("afterbegin", doorsHtml());
  }

  function mount() {
    if (doors) {
      bar();
      return;
    }
    if (open()) return;
    document.documentElement.classList.add("hvac1-lock");
    var gate = document.createElement("div");
    gate.id = "hvac1-gate";
    gate.innerHTML =
      '<div class="card"><h1>Where are you going?</h1>' +
      "<p>Students open the shop. The pitch, Allstars, and the desk ask for the password.</p>" +
      doorsHtml() +
      "</div>";
    document.body.appendChild(gate);
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
