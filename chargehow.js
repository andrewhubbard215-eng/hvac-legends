/* How to charge. Service ticket and install proposal.
   Training bands from published 2026 residential ranges. Not a bid. Not a supply house. */
(function (global) {
  "use strict";

  var REPAIRS = [
    { id: "cap", name: "Run capacitor", time: "0.5–1 hour", low: 180, high: 350, price: 275, cost: 95 },
    { id: "cont", name: "Contactor", time: "0.5–1 hour", low: 200, high: 400, price: 300, cost: 110 },
    { id: "ign", name: "Igniter or flame sensor", time: "0.5–1 hour", low: 180, high: 350, price: 265, cost: 90 },
    { id: "fan", name: "Condenser fan motor", time: "1–1.5 hours", low: 400, high: 750, price: 575, cost: 210 },
    { id: "ecm", name: "ECM blower motor", time: "1.5–2 hours", low: 600, high: 1400, price: 1000, cost: 380 },
    { id: "board", name: "Control board", time: "1–1.5 hours", low: 450, high: 900, price: 675, cost: 240 },
    { id: "leak", name: "Find the leak, repair, weigh in", time: "2–3 hours", low: 450, high: 1200, price: 825, cost: 280 },
  ];

  var INSTALL = [
    { id: "good", name: "Good", price: 7239, line: "14 SEER. Single stage. One-year parts and labor. The house gets cool." },
    { id: "better", name: "Better", price: 8134, rec: true, line: "16 SEER and a Wi-Fi thermostat. Two-year parts and labor. This is the one you recommend." },
    { id: "best", name: "Best", price: 10589, line: "Inverter and a variable-speed air handler. Quieter. Lower bills. Five-year parts and labor." },
  ];

  var root = null;
  var hooks = null;
  var view = "home";
  var when = "day";
  var credit = true;
  var repairId = "cap";
  var approved = true;
  var tier = "better";
  var financed = false;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function money(n) {
    return "$" + Math.round(Number(n) || 0).toLocaleString("en-US");
  }

  function repair() {
    for (var i = 0; i < REPAIRS.length; i++) if (REPAIRS[i].id === repairId) return REPAIRS[i];
    return REPAIRS[0];
  }

  function tierRow() {
    for (var i = 0; i < INSTALL.length; i++) if (INSTALL[i].id === tier) return INSTALL[i];
    return INSTALL[1];
  }

  function diag() {
    return when === "after" ? 225 : 125;
  }

  function servicePay() {
    var d = diag();
    var r = repair();
    if (!approved) return d;
    if (credit) return r.price;
    return r.price + d;
  }

  function ensureStyle() {
    if (document.getElementById("ch-style")) return;
    var style = document.createElement("style");
    style.id = "ch-style";
    style.textContent =
      "#chargehow-root{min-height:100dvh;background:#0b1014;color:#e8eef2}" +
      ".ch{box-sizing:border-box;width:100%;max-width:720px;margin:0 auto;padding:16px 16px 96px;display:flex;flex-direction:column;gap:12px;font-family:'IBM Plex Sans',sans-serif}" +
      ".ch *{box-sizing:border-box}" +
      ".ch-bar{display:flex;align-items:flex-start;gap:12px}" +
      ".ch-bar h1{margin:0;font-size:26px;line-height:1.15;font-weight:600}" +
      ".ch-kicker{margin:0 0 4px;color:#8b98a5;font-size:11px;letter-spacing:.08em;text-transform:uppercase}" +
      ".ch button{min-height:44px;border-radius:8px;border:1px solid #2c3844;background:#141b22;color:#e8eef2;font:600 15px/1.3 'IBM Plex Sans',sans-serif;padding:10px 12px;cursor:pointer}" +
      ".ch-back{flex:0 0 auto}" +
      ".ch-lead,.ch-note{margin:0;color:#c5ccd6;font-size:15px;line-height:1.45}" +
      ".ch-note{padding:12px 14px;border-left:3px solid #d4a24a;background:#141b22;border-radius:0 8px 8px 0}" +
      ".ch-grid{display:grid;gap:8px}" +
      ".ch-go,.ch-pick{display:flex;text-align:left;width:100%}" +
      ".ch-go{flex-direction:column;gap:4px}" +
      ".ch-go b{font-size:17px}" +
      ".ch-go span,.ch-pick span{color:#8b98a5;font-weight:500;font-size:13px}" +
      ".ch-row{display:flex;gap:8px;flex-wrap:wrap}" +
      ".ch-row button{flex:1;min-width:140px}" +
      ".ch-on{border-color:#d4a24a!important;color:#f2e2c2!important}" +
      ".ch-pick{display:flex;justify-content:space-between;gap:10px;align-items:center;width:100%}" +
      ".ch-card{border:1px solid #2c3844;border-radius:12px;background:#12181e;padding:12px 14px}" +
      ".ch-card h2{margin:0 0 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8b98a5}" +
      ".ch-price{margin:0;font-size:28px;font-weight:600;letter-spacing:-.02em}" +
      ".ch-hide{border-color:#3a2a22}" +
      ".ch-soft{margin:6px 0 0;color:#8b98a5;font-size:13px;line-height:1.4}" +
      ".ch-src{margin:0;color:#6d7b88;font-size:12px;line-height:1.4}" +
      "@media (max-width:800px){.ch{padding-bottom:108px}}";
    document.head.appendChild(style);
  }

  function bar(title, kicker) {
    return (
      '<header class="ch-bar"><button type="button" class="ch-back" data-act="back">' +
      (view === "home" ? "Shop" : "Back") + "</button><div><p class=\"ch-kicker\">" +
      esc(kicker) + "</p><h1>" + esc(title) + "</h1></div></header>"
    );
  }

  function sources() {
    return '<p class="ch-src">Training bands from published 2026 residential ranges. A weekday diagnostic is about $75 to $200. After hours is about $150 to $350. Flat-rate repairs are the published task bands, not an open clock. Install numbers are the training book already in Job file. Not a bid for this city.</p>';
  }

  function software() {
    return (
      '<section class="ch-card"><h2>What the job software does</h2>' +
      "<p class=\"ch-lead\">Jobber sends a quote they approve, then an invoice. Housecall Pro puts a flat-rate book on the phone and a good, better, best proposal on the bigger plan, with financing on the screen. ServiceTitan is the fleet pricebook and the scorecards. You do not need their subscription to charge this way. You need the order: diagnostic, one flat price, three options on a replacement, a signature, and money or a finance approval before the equipment is ordered.</p>" +
      '<p class="ch-soft">Published plan bands, 2026: Jobber about $69 to $349 a month. Housecall Pro about $79 to $279 a month. ServiceTitan is quote-only, often about $245 to $400 a technician a month, plus a setup fee.</p></section>'
    );
  }

  function paintHome() {
    root.innerHTML =
      '<div class="ch">' + bar("How to charge", "Service and install") +
      '<p class="ch-lead">Say the price before the work. One number for a repair. Three numbers for a change-out. Your cost never faces the customer.</p>' +
      '<div class="ch-grid">' +
      '<button type="button" class="ch-go" data-act="service"><b>Charge a service call</b><span>Diagnostic first. Then one flat-rate repair.</span></button>' +
      '<button type="button" class="ch-go" data-act="install"><b>Charge an install</b><span>Good, better, best. Half down before you order it.</span></button>' +
      "</div>" + software() + sources() + "</div>";
  }

  function paintService() {
    var r = repair();
    var pay = servicePay();
    var d = diag();
    var say = approved
      ? (credit
        ? "The diagnostic is " + money(d) + ". If you approve the repair, that comes off. This repair is " + money(r.price) + ", done. That is the whole ticket."
        : "The diagnostic is " + money(d) + " and it stays on the bill. The repair is " + money(r.price) + " on top. Say that before you start.")
      : "They said no. They still owe the diagnostic, " + money(d) + ". You do not fix it for free.";
    var list = REPAIRS.map(function (item) {
      return '<button type="button" class="ch-pick' + (item.id === r.id ? " ch-on" : "") + '" data-act="repair" data-id="' + item.id + '"><span><b>' +
        esc(item.name) + "</b><br>" + esc(item.time) + " · published " + money(item.low) + "–" + money(item.high) +
        '</span><b>' + money(item.price) + "</b></button>";
    }).join("");
    root.innerHTML =
      '<div class="ch">' + bar("Service call", "Flat rate") +
      '<div class="ch-row">' +
      '<button type="button" class="' + (when === "day" ? "ch-on" : "") + '" data-act="when" data-id="day">Weekday · ' + money(125) + "</button>" +
      '<button type="button" class="' + (when === "after" ? "ch-on" : "") + '" data-act="when" data-id="after">After hours · ' + money(225) + "</button>" +
      "</div>" +
      '<div class="ch-row">' +
      '<button type="button" class="' + (credit ? "ch-on" : "") + '" data-act="credit" data-id="1">Diagnostic comes off if they approve</button>' +
      '<button type="button" class="' + (!credit ? "ch-on" : "") + '" data-act="credit" data-id="0">Diagnostic stays on the bill</button>' +
      "</div>" +
      '<div class="ch-grid">' + list + "</div>" +
      '<div class="ch-row">' +
      '<button type="button" class="' + (approved ? "ch-on" : "") + '" data-act="yes">They approve the repair</button>' +
      '<button type="button" class="' + (!approved ? "ch-on" : "") + '" data-act="no">They decline</button>' +
      "</div>" +
      '<section class="ch-card"><h2>What they see</h2><p class="ch-price">' + money(pay) + "</p>" +
      '<p class="ch-note">' + esc(say) + "</p></section>" +
      '<section class="ch-card ch-hide"><h2>Your screen. Do not turn this around.</h2>' +
      "<p class=\"ch-lead\">Your cost on this task is about " + money(r.cost) + ". The flat rate is " + money(r.price) +
      ". That gap is the truck, the warranty callback, and the shop. It is not a line on their invoice.</p></section>" +
      sources() + "</div>";
  }

  function paintInstall() {
    var row = tierRow();
    var down = Math.round(row.price / 2);
    var cards = INSTALL.map(function (item) {
      return '<button type="button" class="ch-pick' + (item.id === row.id ? " ch-on" : "") + '" data-act="tier" data-id="' + item.id + '"><span><b>' +
        esc(item.name) + (item.rec ? " · recommend this" : "") + "</b><br>" + esc(item.line) +
        '</span><b>' + money(item.price) + "</b></button>";
    }).join("");
    var say = financed
      ? "Three prices. I recommend Better. If the finance company approves the full " + money(row.price) + ", we can order it. A soft check is not an approval."
      : "Three prices. I recommend Better, " + money(row.price) + ". Half is " + money(down) + " before I order the equipment. The rest is due when it runs and the house is right.";
    root.innerHTML =
      '<div class="ch">' + bar("Install", "Good, better, best") +
      '<p class="ch-lead">Hand them the phone with all three. Do not give one number and wait. Do not show your cost. A handshake is not a deposit.</p>' +
      '<div class="ch-grid">' + cards + "</div>" +
      '<div class="ch-row">' +
      '<button type="button" class="' + (!financed ? "ch-on" : "") + '" data-act="cash">Half down, cash or card</button>' +
      '<button type="button" class="' + (financed ? "ch-on" : "") + '" data-act="finance">Financing on the phone</button>' +
      "</div>" +
      '<section class="ch-card"><h2>What they see</h2><p class="ch-price">' + money(row.price) + "</p>" +
      "<p class=\"ch-lead\">" + (financed ? "Finance approval for the full price before you order." : "Deposit " + money(down) + ". Balance " + money(row.price - down) + " at start-up.") + "</p>" +
      '<p class="ch-note">' + esc(say) + "</p></section>" +
      '<p class="ch-soft">A full 3-ton change-out in 2026 often runs higher than this book once the city, the duct, and the electrical are real. These three numbers match Job file.</p>' +
      sources() + "</div>";
  }

  function paint() {
    if (view === "service") paintService();
    else if (view === "install") paintInstall();
    else paintHome();
  }

  function onClick(e) {
    var b = e.target.closest("[data-act]");
    if (!b || !root.contains(b)) return;
    var act = b.getAttribute("data-act");
    if (act === "back") {
      if (view === "home") {
        if (hooks && hooks.onHub) hooks.onHub();
      } else {
        view = "home";
        paint();
      }
      return;
    }
    if (act === "service") view = "service";
    else if (act === "install") view = "install";
    else if (act === "when") when = b.getAttribute("data-id") === "after" ? "after" : "day";
    else if (act === "credit") credit = b.getAttribute("data-id") === "1";
    else if (act === "repair") repairId = b.getAttribute("data-id");
    else if (act === "yes") approved = true;
    else if (act === "no") approved = false;
    else if (act === "tier") tier = b.getAttribute("data-id");
    else if (act === "cash") financed = false;
    else if (act === "finance") financed = true;
    paint();
  }

  function start(el, opts) {
    root = el;
    hooks = opts || {};
    view = "home";
    ensureStyle();
    root.addEventListener("click", onClick);
    paint();
    return { stop: stop };
  }

  function stop() {
    if (root) root.removeEventListener("click", onClick);
    root = null;
  }

  global.ChargeHow = { start: start, stop: stop };
})(window);
