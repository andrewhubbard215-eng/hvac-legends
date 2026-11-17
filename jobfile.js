/* Job file — photos on the house, then a good / better / best price.
   Training numbers. Not a supply house. Stays on this phone. */
(function (global) {
  "use strict";

  var BOOK = [
    { id: "cond14", name: "3-ton condenser, 14 SEER", cost: 1650, price: 2895 },
    { id: "cond16", name: "3-ton condenser, 16 SEER", cost: 2100, price: 3690 },
    { id: "cond18", name: "3-ton inverter condenser, 18 SEER", cost: 2850, price: 4995 },
    { id: "ahu", name: "3-ton air handler", cost: 980, price: 1740 },
    { id: "ahumod", name: "3-ton variable-speed air handler", cost: 1450, price: 2590 },
    { id: "lineset", name: "Line set, 25 ft", cost: 180, price: 320 },
    { id: "pad", name: "Pad, disconnect, whip", cost: 140, price: 265 },
    { id: "drier", name: "Filter-drier", cost: 28, price: 65 },
    { id: "stat", name: "Thermostat", cost: 85, price: 189 },
    { id: "statwi", name: "Wi-Fi thermostat", cost: 140, price: 289 },
    { id: "drain", name: "Condensate and safety switch", cost: 45, price: 120 },
    { id: "permit", name: "Permit", cost: 75, price: 150 },
    { id: "haul", name: "Haul away old equipment", cost: 40, price: 95 },
    { id: "recover", name: "Recover, evacuate, weigh in", cost: 180, price: 420 },
    { id: "labor", name: "Set and start, labor", cost: 440, price: 980 },
    { id: "laborinv", name: "Set and start, inverter", cost: 560, price: 1280 },
  ];

  var KITS = {
    good: ["cond14", "ahu", "lineset", "pad", "drier", "stat", "drain", "permit", "haul", "recover", "labor"],
    better: ["cond16", "ahu", "lineset", "pad", "drier", "statwi", "drain", "permit", "haul", "recover", "labor"],
    best: ["cond18", "ahumod", "lineset", "pad", "drier", "statwi", "drain", "permit", "haul", "recover", "laborinv"],
  };

  var OPTS = [
    { id: "good", name: "Good", line: "Replaces it. 14 SEER. Gets the house cool." },
    { id: "better", name: "Better", line: "16 SEER and a Wi-Fi stat. The one most houses should buy." },
    { id: "best", name: "Best", line: "Inverter. Quieter, lower bills, variable-speed air handler." },
  ];

  var CHECKS = [
    ["words", "Write the complaint the way they said it"],
    ["stat", "Thermostat picture. Setpoint and what it reads."],
    ["filter", "Filter picture. Dirty or missing before any gas."],
    ["outdoor", "Outdoor unit. Clearance on the sides and the top."],
    ["plate", "Nameplate. Model, serial, factory charge."],
    ["disc", "Disconnect. Off before you ohm anything."],
    ["drain", "Drain and the safety switch."],
    ["cover", "Panel back on before you leave it live."],
  ];

  var TAGS = ["Before", "After", "Nameplate", "Indoor", "Outdoor", "Electrical", "Drain"];

  var root = null;
  var hooks = null;
  var dbp = null;
  var jobs = [];
  var memOnly = false;
  var view = "list";
  var jobId = "";
  var tab = "photos";
  var opt = "better";
  var photoId = "";
  var tagFilter = "";
  var nextTag = "Before";
  var drawing = false;
  var pen = "#CE0034";
  var strokes = [];
  var drawImg = null;
  var signedInk = false;
  var needInk = false;

  function uid(p) {
    return p + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function money(n) {
    var v = Math.round(Number(n) || 0);
    return "$" + v.toLocaleString("en-US");
  }

  function bookItem(id) {
    for (var i = 0; i < BOOK.length; i++) if (BOOK[i].id === id) return BOOK[i];
    return null;
  }

  function lineFrom(id) {
    var b = bookItem(id);
    return { id: uid("l"), book: id, name: b.name, qty: 1, cost: b.cost, price: b.price };
  }

  function kits() {
    var out = {};
    OPTS.forEach(function (o) {
      out[o.id] = { lines: KITS[o.id].map(lineFrom) };
    });
    return out;
  }

  function blankJob(customer, address, complaint) {
    return {
      id: uid("j"),
      customer: customer || "New customer",
      address: address || "",
      complaint: complaint || "",
      created: Date.now(),
      updated: Date.now(),
      tax: 0,
      recommended: "better",
      accepted: "",
      acceptedAt: 0,
      signature: "",
      checks: {},
      photos: [],
      options: kits(),
    };
  }

  function starter() {
    var j = blankJob("Dana Ruiz", "418 Maple Street", "It runs all day. The house sits at 80.");
    j.id = "maple-418";
    return j;
  }

  function job() {
    for (var i = 0; i < jobs.length; i++) if (jobs[i].id === jobId) return jobs[i];
    return null;
  }

  function optMeta(id) {
    for (var i = 0; i < OPTS.length; i++) if (OPTS[i].id === id) return OPTS[i];
    return OPTS[1];
  }

  function linesOf(j, id) {
    if (!j || !j.options || !j.options[id]) return [];
    return j.options[id].lines || [];
  }

  function totals(j, id) {
    var lines = linesOf(j, id);
    var cost = 0;
    var price = 0;
    lines.forEach(function (l) {
      var q = Math.max(0, Number(l.qty) || 0);
      cost += q * (Number(l.cost) || 0);
      price += q * (Number(l.price) || 0);
    });
    var tax = price * ((Number(j.tax) || 0) / 100);
    return { cost: cost, price: price, tax: tax, total: price + tax, margin: price ? (price - cost) / price : 0 };
  }

  function when(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  }

  function css() {
    if (document.getElementById("jf-css")) return;
    var st = document.createElement("style");
    st.id = "jf-css";
    st.textContent =
      ".jf{max-width:720px;margin:0 auto;padding:12px 12px 36px;box-sizing:border-box;color:#f6f1e6}" +
      ".jf *{box-sizing:border-box}" +
      ".jf-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:0 0 8px}" +
      ".jf-kicker{margin:0;color:#e8c450;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}" +
      ".jf h1{margin:2px 0 0;font:700 26px/1.05 system-ui,sans-serif}" +
      ".jf h2{margin:0 0 4px;font:700 18px/1.2 system-ui,sans-serif}" +
      ".jf-lead,.jf p{color:#c5ced6;font:15px/1.4 system-ui,sans-serif}" +
      ".jf-lead{margin:0 0 12px}" +
      ".jf-steps{margin:0 0 12px;padding:0 0 0 18px}" +
      ".jf-steps li{margin:0 0 6px;color:#d5dde4;font:14px/1.35 system-ui,sans-serif}" +
      ".jf-hint{margin:0 0 8px;color:#d5dde4;font:14px/1.35 system-ui,sans-serif}" +
      ".jf .btn{min-height:44px}" +
      ".jf .btn+.btn{margin-left:0}" +
      ".jf-row{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}" +
      ".jf-card{display:block;width:100%;text-align:left;border:1px solid #4a5560;border-radius:14px;background:#12161b;color:#f6f1e6;padding:12px;margin:0 0 8px;box-shadow:inset 3px 0 0 #CE0034;cursor:pointer}" +
      ".jf-card b{display:block;font-size:16px}" +
      ".jf-card span{display:block;margin-top:2px;color:#b7c0c8;font-size:13px}" +
      ".jf-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:0 0 12px}" +
      ".jf-tab,.jf-pill,.jf-tag{min-height:40px;border-radius:10px;border:1px solid #4a5560;background:#1c2126;color:#f6f1e6;font:700 13px/1.1 system-ui,sans-serif;padding:6px 8px;cursor:pointer}" +
      ".jf-tab.on,.jf-pill.on,.jf-tag.on{background:#e8c450;color:#1a1408;border-color:#e8c450}" +
      ".jf-pills,.jf-tags{display:flex;flex-wrap:wrap;gap:6px;overflow:visible;padding-bottom:4px;margin:0 0 10px}" +
      ".jf-pill,.jf-tag{flex:0 0 auto}" +
      ".jf-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
      ".jf-shot{padding:0;overflow:hidden;min-height:0}" +
      ".jf-shot img{display:block;width:100%;aspect-ratio:1;object-fit:cover;background:#070b10}" +
      ".jf-shot span{padding:6px 8px 8px}" +
      ".jf-file{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:12px;background:#CE0034;color:#fff;font:700 15px/1 system-ui,sans-serif;cursor:pointer}" +
      ".jf-file input{position:absolute;width:1px;height:1px;opacity:0}" +
      ".jf-file.alt{background:#1c2126;color:#f6f1e6;border:1px solid #4a5560}" +
      ".jf label{display:block;margin:0 0 8px;color:#b7c0c8;font:700 12px/1.2 system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase}" +
      ".jf input,.jf textarea{width:100%;margin-top:4px;padding:10px;border-radius:10px;border:1px solid #3a424a;background:#10161c;color:#f6f1e6;font:600 16px/1.3 system-ui,sans-serif}" +
      ".jf-row .jf-file{position:relative;display:flex;flex:1 1 0;align-items:center;justify-content:center;min-width:0;min-height:48px;margin:0;overflow:hidden}" +
      ".jf .jf-file input{position:absolute;left:0;top:0;width:100%;height:100%;margin:0;padding:0;opacity:0;font-size:16px;cursor:pointer}" +
      ".jf textarea{min-height:72px;text-transform:none;letter-spacing:0}" +
      ".jf-line{border:1px solid #3a424a;border-radius:12px;padding:10px;margin:0 0 8px;background:#10161c}" +
      ".jf-line-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}" +
      ".jf-qty{display:flex;align-items:center;gap:6px;margin-top:6px}" +
      ".jf-qty button{width:36px;height:36px;border-radius:8px;border:1px solid #4a5560;background:#1c2126;color:#f6f1e6;font:700 18px/1 system-ui,sans-serif;cursor:pointer}" +
      ".jf-split{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
      ".jf-total{border:1px solid #e8c450;border-radius:12px;padding:10px 12px;margin:8px 0}" +
      ".jf-total b{color:#e8c450;font-size:22px}" +
      ".jf-check{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;background:#12161b;color:#f6f1e6;border:1px solid #3a424a;border-radius:12px;padding:10px;margin:0 0 8px;cursor:pointer}" +
      ".jf-check.on{border-color:#3d7a52}" +
      ".jf-box{width:22px;height:22px;flex:0 0 22px;border-radius:6px;border:2px solid #e8c450;margin-top:1px}" +
      ".jf-check.on .jf-box{background:#e8c450}" +
      ".jf-add{margin:8px 0}" +
      ".jf-add button{display:block;width:100%;text-align:left;margin:0 0 6px;min-height:40px;border-radius:10px;border:1px solid #3a424a;background:#1c2126;color:#f6f1e6;padding:8px 10px;cursor:pointer}" +
      ".jf-offer{border:1px solid #4a5560;border-radius:14px;padding:12px;margin:0 0 10px;background:#12161b}" +
      ".jf-offer.rec{border-color:#e8c450}" +
      ".jf-offer .big{color:#e8c450;font:700 28px/1 system-ui,sans-serif;margin:4px 0}" +
      "#jf-sign,#jf-draw{width:100%;border-radius:12px;background:#f6f1e6;touch-action:none;display:block}" +
      "#jf-draw{background:#070b10}" +
      "#jf-sheet{display:none}" +
      "@media print{body *{visibility:hidden!important}#jf-sheet,#jf-sheet *{visibility:visible!important}#jf-sheet{display:block!important;position:absolute;left:0;top:0;width:100%;background:#fff;color:#14171a;padding:16px}#jf-sheet h1{font:700 22px/1.2 system-ui,sans-serif;color:#14171a}#jf-sheet img{max-width:100%;height:auto}}" +
      "@media (max-width:720px){body:has(#screen-jobfile.active) #drip-ear,body:has(#screen-jobfile.active) #form-badge{display:none!important}body:has(#screen-jobfile.active) .ld-replay{top:8px!important;bottom:auto!important;left:8px!important;right:auto!important;max-width:120px!important;z-index:35!important}}";
    document.head.appendChild(st);
  }

  function openDb() {
    if (dbp) return dbp;
    dbp = new Promise(function (ok, fail) {
      if (!global.indexedDB) {
        memOnly = true;
        ok(null);
        return;
      }
      var req = indexedDB.open("lt-jobfile-v1", 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains("jobs")) req.result.createObjectStore("jobs", { keyPath: "id" });
      };
      req.onsuccess = function () { ok(req.result); };
      req.onerror = function () { memOnly = true; ok(null); };
    });
    return dbp;
  }

  function loadAll() {
    return openDb().then(function (db) {
      if (!db) {
        if (!jobs.length) jobs = [starter()];
        return jobs;
      }
      return new Promise(function (ok) {
        var tx = db.transaction("jobs", "readonly");
        var req = tx.objectStore("jobs").getAll();
        req.onsuccess = function () {
          jobs = req.result || [];
          if (!jobs.length) {
            jobs = [starter()];
            saveJob(jobs[0]);
          }
          jobs.sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); });
          ok(jobs);
        };
        req.onerror = function () {
          memOnly = true;
          if (!jobs.length) jobs = [starter()];
          ok(jobs);
        };
      });
    });
  }

  function saveJob(j) {
    if (!j) return Promise.resolve();
    j.updated = Date.now();
    var i;
    var found = false;
    for (i = 0; i < jobs.length; i++) if (jobs[i].id === j.id) { jobs[i] = j; found = true; }
    if (!found) jobs.unshift(j);
    return openDb().then(function (db) {
      if (!db) return;
      return new Promise(function (ok) {
        var tx = db.transaction("jobs", "readwrite");
        tx.objectStore("jobs").put(j);
        tx.oncomplete = function () { ok(); };
        tx.onerror = function () { ok(); };
      });
    });
  }

  function dropJob(id) {
    jobs = jobs.filter(function (j) { return j.id !== id; });
    return openDb().then(function (db) {
      if (!db) return;
      return new Promise(function (ok) {
        var tx = db.transaction("jobs", "readwrite");
        tx.objectStore("jobs").delete(id);
        tx.oncomplete = function () { ok(); };
        tx.onerror = function () { ok(); };
      });
    });
  }

  function shrink(file) {
    return new Promise(function (ok, fail) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1280;
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * s));
        c.height = Math.max(1, Math.round(img.height * s));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        fail(new Error("photo"));
      };
      img.src = url;
    });
  }

  function photo() {
    var j = job();
    if (!j) return null;
    for (var i = 0; i < j.photos.length; i++) if (j.photos[i].id === photoId) return j.photos[i];
    return null;
  }

  function head(title, kicker) {
    return (
      '<header class="jf-head"><div><p class="jf-kicker">' + esc(kicker) + "</p><h1>" + esc(title) + "</h1></div>" +
      '<button type="button" class="btn" data-act="hub">Shop floor</button></header>'
    );
  }

  function howTo() {
    return (
      '<ol class="jf-steps">' +
      "<li><b>Open the house</b>, or tap New job. Put the name, the street, and what they said.</li>" +
      "<li><b>Photos.</b> Tap the tag first, then Take photo or From the roll. Open a picture to write a note, mark it up, or stamp where you are.</li>" +
      "<li><b>Check.</b> Tap a line when that part of the walk is done.</li>" +
      "<li><b>Price.</b> Good, Better, and Best start as a 3-ton change-out. Change the numbers. Your cost stays on this tab. Sell this one is the option you want them to buy.</li>" +
      "<li><b>Show.</b> Hand them the phone. They pick one and sign the line. Print it if they want paper.</li>" +
      "</ol>"
    );
  }

  function cue(which) {
    var line = {
      photos: "Tag the next shot, then take it. Tap the picture to note it or mark it up.",
      check: "Tap a line when that part of the walk is done.",
      price: "The gold number is their price. Your cost stays on this screen.",
      show: "Hand them the phone. They pick one and sign. A blank line is not a yes.",
    }[which] || "";
    return '<p class="jf-hint">' + line + "</p>";
  }

  function fileKicker() {
    var pack = window.SchoolPack;
    if (pack && pack.id === "lincoln") return "Lincoln";
    if (pack && pack.id === "legends") return "Legends";
    return "Shop";
  }
  function paintList() {
    var cards = jobs.map(function (j) {
      var t = totals(j, j.recommended || "better");
      var extra = j.accepted ? " · They said yes to " + optMeta(j.accepted).name : "";
      return (
        '<button type="button" class="jf-card" data-act="open" data-id="' + esc(j.id) + '"><b>' + esc(j.customer) + "</b><span>" +
        esc(j.address || "No address") + " · " + (j.photos || []).length + " photos · " + money(t.total) + extra + "</span></button>"
      );
    }).join("");
    root.innerHTML =
      '<div class="jf">' + head("Job file", fileKicker()) +
      '<p class="jf-lead">Pictures stay with the house. Then you price good, better, and best. Training prices. Not your supply house. ' +
      (memOnly ? "This phone will forget the file when you leave." : "Saved on this phone.") + "</p>" +
      howTo() +
      '<div class="jf-row"><button type="button" class="btn primary" data-act="new">New job</button></div>' +
      cards + '<div id="jf-sheet"></div></div>';
  }

  function paintNew() {
    root.innerHTML =
      '<div class="jf">' + head("New job", "Job file") +
      '<label>Customer<input id="jf-name" placeholder="Name"></label>' +
      '<label>Address<input id="jf-addr" placeholder="Street"></label>' +
      '<label>What they said<textarea id="jf-comp" placeholder="Ice, noise, no cool, and how long."></textarea></label>' +
      '<p class="jf-hint">The price starts as a 3-ton change-out. Change the numbers after you open the file.</p>' +
      '<div class="jf-row"><button type="button" class="btn primary" data-act="create">Open the file</button>' +
      '<button type="button" class="btn" data-act="list">Back</button></div><div id="jf-sheet"></div></div>';
  }

  function fileButtons() {
    return (
      '<div class="jf-row"><label class="jf-file">Take photo<input id="jf-cam" type="file" accept="image/*" capture="environment"></label>' +
      '<label class="jf-file alt">From the roll<input id="jf-roll" type="file" accept="image/*"></label></div>'
    );
  }

  function paintPhotos(j) {
    var list = j.photos.filter(function (p) { return !tagFilter || p.tag === tagFilter; });
    var tags = '<button type="button" class="jf-tag' + (tagFilter ? "" : " on") + '" data-act="filter" data-tag="">All</button>' +
      TAGS.map(function (t) {
        return '<button type="button" class="jf-tag' + (tagFilter === t ? " on" : "") + '" data-act="filter" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
      }).join("");
    var next = '<div class="jf-tags" aria-label="Tag the next photo">' + TAGS.map(function (t) {
      return '<button type="button" class="jf-tag' + (nextTag === t ? " on" : "") + '" data-act="next-tag" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("") + "</div>";
    var grid = list.map(function (p) {
      return '<button type="button" class="jf-card jf-shot" data-act="photo" data-id="' + esc(p.id) + '"><img src="' + p.src + '" alt=""><span>' + esc(p.tag || "Photo") + " · " + esc(when(p.at)) + "</span></button>";
    }).join("");
    return fileButtons() +
      '<p class="jf-hint"><b>Next shot.</b> Tap a tag, then take the picture. Nameplate, filter, outdoor unit.</p>' + next +
      '<p class="jf-hint"><b>On the job.</b> Filter what you already shot.</p>' +
      '<div class="jf-tags">' + tags + "</div>" +
      (grid ? '<div class="jf-grid">' + grid + "</div>" : '<p>No pictures yet.</p>') +
      '<div class="jf-row"><button type="button" class="btn" data-act="print" data-kind="photos">Print the photos</button></div>';
  }

  function paintOnePhoto(j) {
    var p = photo();
    if (!p) return "<p>That photo is gone.</p>";
    if (drawing) {
      return '<div class="jf-row"><button type="button" class="btn" data-act="pen" data-pen="#CE0034">Red</button>' +
        '<button type="button" class="btn" data-act="pen" data-pen="#e8c450">Gold</button>' +
        '<button type="button" class="btn" data-act="undo">Undo</button></div>' +
        '<canvas id="jf-draw"></canvas>' +
        '<p class="jf-hint">Draw on the picture. Red or gold. Save marks when the circle is where you want it.</p>' +
        '<div class="jf-row" style="margin-top:8px"><button type="button" class="btn primary" data-act="draw-save">Save marks</button>' +
        '<button type="button" class="btn" data-act="draw-cancel">Cancel</button></div>';
    }
    var tags = TAGS.map(function (t) {
      return '<button type="button" class="jf-tag' + (p.tag === t ? " on" : "") + '" data-act="set-tag" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");
    return '<button type="button" class="btn" data-act="close-photo">Back to photos</button>' +
      '<p class="jf-lead">' + esc(when(p.at)) + (p.place ? " · " + esc(p.place) : "") + "</p>" +
      '<img src="' + p.src + '" alt="" style="width:100%;border-radius:12px;display:block;margin:0 0 8px">' +
      '<div class="jf-tags">' + tags + "</div>" +
      '<label>Note<textarea id="jf-note">' + esc(p.note || "") + "</textarea></label>" +
      '<div class="jf-row"><button type="button" class="btn primary" data-act="save-note">Save note</button>' +
      '<button type="button" class="btn" data-act="draw">Mark it up</button>' +
      '<button type="button" class="btn" data-act="stamp">Stamp where I am</button>' +
      '<button type="button" class="btn" data-act="del-photo">Delete</button></div>';
  }

  function paintChecks(j) {
    var n = 0;
    CHECKS.forEach(function (c) { if (j.checks && j.checks[c[0]]) n++; });
    var rows = CHECKS.map(function (c) {
      var on = j.checks && j.checks[c[0]];
      return '<button type="button" class="jf-check' + (on ? " on" : "") + '" data-act="check" data-id="' + c[0] + '"><i class="jf-box"></i><span>' + esc(c[1]) + "</span></button>";
    }).join("");
    return "<p class=\"jf-hint\">" + n + " of " + CHECKS.length + " done.</p>" + rows;
  }

  function paintPrice(j) {
    var meta = optMeta(opt);
    var t = totals(j, opt);
    var pills = OPTS.map(function (o) {
      var tt = totals(j, o.id);
      return '<button type="button" class="jf-pill' + (opt === o.id ? " on" : "") + '" data-act="opt" data-opt="' + o.id + '">' + o.name + " " + money(tt.total) + "</button>";
    }).join("");
    var lines = linesOf(j, opt).map(function (l) {
      return '<div class="jf-line"><div class="jf-line-top"><b>' + esc(l.name) + '</b><button type="button" class="btn" data-act="del-line" data-line="' + esc(l.id) + '">Remove</button></div>' +
        '<div class="jf-qty"><button type="button" data-act="qty" data-line="' + esc(l.id) + '" data-dir="-1">−</button><span>' + (Number(l.qty) || 0) + '</span><button type="button" data-act="qty" data-line="' + esc(l.id) + '" data-dir="1">+</button></div>' +
        '<div class="jf-split"><label>Price<input data-field="price" data-line="' + esc(l.id) + '" type="number" min="0" step="1" value="' + Math.round(l.price) + '"></label>' +
        '<label>My cost<input data-field="cost" data-line="' + esc(l.id) + '" type="number" min="0" step="1" value="' + Math.round(l.cost) + '"></label></div></div>';
    }).join("");
    var adds = BOOK.map(function (b) {
      return '<button type="button" data-act="add-book" data-id="' + b.id + '">' + esc(b.name) + " · " + money(b.price) + "</button>";
    }).join("");
    var rec = j.recommended === opt ? " This is the one you are selling." : " Tap Sell this one if this is the option they should buy.";
    return '<div class="jf-pills">' + pills + "</div><h2>" + esc(meta.name) + "</h2><p>" + esc(meta.line) + rec + "</p>" +
      '<p class="jf-hint">Change Price if the number is wrong. My cost never shows when you tap Show.</p>' +
      lines +
      '<div class="jf-total"><div>Customer price <b>' + money(t.total) + "</b></div><div>My cost " + money(t.cost) + " · keep " + Math.round(t.margin * 100) + "% before tax</div></div>" +
      '<div class="jf-split"><label>Tax percent<input id="jf-tax" type="number" min="0" max="30" step="0.1" value="' + (Number(j.tax) || 0) + '"></label>' +
      '<label> </label></div>' +
      '<div class="jf-row"><button type="button" class="btn" data-act="recommend">Sell this one</button></div>' +
      "<details class=\"jf-add\"><summary>Add from the pricebook</summary>" + adds + "</details>" +
      '<div class="jf-line"><b>Custom line</b><label>Name<input id="jf-cname" placeholder="Part or labor"></label>' +
      '<div class="jf-split"><label>Price<input id="jf-cprice" type="number" min="0" value="0"></label><label>My cost<input id="jf-ccost" type="number" min="0" value="0"></label></div>' +
      '<button type="button" class="btn" data-act="add-custom">Add line</button></div>';
  }

  function offerCard(j, id, pick) {
    var meta = optMeta(id);
    var t = totals(j, id);
    var month = Math.round(t.total / 60);
    var rec = j.recommended === id;
    return '<article class="jf-offer' + (rec ? " rec" : "") + '"><p class="jf-kicker">' + (rec ? "The one to sell" : "Option") + "</p><h2>" + esc(meta.name) + "</h2><p>" + esc(meta.line) + '</p><div class="big">' + money(t.total) + "</div><p>About " + money(month) + " a month for 60 months. Training math. Not a loan.</p>" +
      (pick ? '<button type="button" class="btn primary" data-act="pick" data-opt="' + id + '">They want ' + esc(meta.name) + "</button>" : "") +
      "</article>";
  }

  function paintShow(j) {
    var cards = OPTS.map(function (o) { return offerCard(j, o.id, !j.accepted); }).join("");
    var shots = (j.photos || []).slice(0, 6).map(function (p) {
      return '<img src="' + p.src + '" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px">';
    }).join("");
    var signed = "";
    if (j.accepted) {
      signed = '<p class="jf-lead">They said yes to ' + esc(optMeta(j.accepted).name) + " · " + esc(when(j.acceptedAt)) + ".</p>" +
        (j.signature ? '<img src="' + j.signature + '" alt="Signature" style="width:100%;background:#f6f1e6;border-radius:12px">' : "") +
        '<div class="jf-row"><button type="button" class="btn" data-act="void">Undo the yes</button></div>';
    } else {
      signed = "<h2>Sign</h2><p class=\"jf-hint\">Finger on the line, then they pick one. A blank line is not a yes.</p>" +
        (needInk ? '<p class="jf-hint">Sign the line first.</p>' : "") +
        "<canvas id=\"jf-sign\" width=\"640\" height=\"200\"></canvas>" +
        '<div class="jf-row"><button type="button" class="btn" data-act="sign-clear">Clear</button></div>';
    }
    return cards + (shots ? '<div class="jf-grid" style="margin-bottom:10px">' + shots + "</div>" : "<p>No job photos on the proposal yet.</p>") + signed +
      '<div class="jf-row"><button type="button" class="btn" data-act="print" data-kind="proposal">Print the proposal</button></div>';
  }

  function paintJob() {
    var j = job();
    if (!j) { view = "list"; paintList(); return; }
    var tabs = [
      ["photos", "Photos"],
      ["check", "Check"],
      ["price", "Price"],
      ["show", "Show"],
    ].map(function (pair) {
      return '<button type="button" class="jf-tab' + (tab === pair[0] ? " on" : "") + '" data-act="tab" data-tab="' + pair[0] + '">' + pair[1] + "</button>";
    }).join("");
    var body = "";
    if (tab === "photos") body = photoId ? paintOnePhoto(j) : paintPhotos(j);
    else if (tab === "check") body = paintChecks(j);
    else if (tab === "price") body = paintPrice(j);
    else body = paintShow(j);
    root.innerHTML =
      '<div class="jf"><header class="jf-head"><div><p class="jf-kicker">Job file</p><h1>' + esc(j.customer) + "</h1></div>" +
      '<button type="button" class="btn" data-act="list">Jobs</button></header>' +
      "<p class=\"jf-lead\">" + esc(j.address || "No address") + (j.complaint ? " · " + esc(j.complaint) : "") + "</p>" +
      '<div class="jf-tabs">' + tabs + "</div>" + cue(tab) + body +
      '<div class="jf-row"><button type="button" class="btn" data-act="del-job">Delete job</button></div><div id="jf-sheet"></div></div>';
    bindFields();
    if (tab === "show" && !j.accepted) armSign();
    if (tab === "photos" && photoId && drawing) armDraw();
  }

  function render() {
    css();
    if (!root) return;
    if (view === "new") paintNew();
    else if (view === "job") paintJob();
    else paintList();
  }

  function bindFields() {
    if (!root) return;
    root.querySelectorAll("[data-field]").forEach(function (el) {
      el.onchange = function () {
        var j = job();
        if (!j) return;
        var line = null;
        var id = el.getAttribute("data-line");
        linesOf(j, opt).forEach(function (l) { if (l.id === id) line = l; });
        if (!line) return;
        var n = Math.max(0, Math.round(Number(el.value) || 0));
        line[el.getAttribute("data-field")] = n;
        saveJob(j).then(render);
      };
    });
    var tax = root.querySelector("#jf-tax");
    if (tax) tax.onchange = function () {
      var j = job();
      if (!j) return;
      j.tax = Math.max(0, Math.min(30, Number(tax.value) || 0));
      saveJob(j).then(render);
    };
    ["jf-cam", "jf-roll"].forEach(function (id) {
      var input = root.querySelector("#" + id);
      if (!input) return;
      input.onchange = function () {
        var file = input.files && input.files[0];
        if (!file) return;
        var j = job();
        if (!j) return;
        shrink(file).then(function (src) {
          j.photos.unshift({ id: uid("p"), src: src, tag: nextTag, note: "", at: Date.now(), place: "" });
          return saveJob(j);
        }).then(render).catch(function () {});
      };
    });
  }

  function armSign() {
    var canvas = root.querySelector("#jf-sign");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f6f1e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1a1408";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    var down = false;
    signedInk = false;
    function pt(ev) {
      var r = canvas.getBoundingClientRect();
      var src = ev.touches ? ev.touches[0] : ev;
      return { x: (src.clientX - r.left) * (canvas.width / r.width), y: (src.clientY - r.top) * (canvas.height / r.height) };
    }
    function start(ev) { down = true; signedInk = true; var p = pt(ev); ctx.beginPath(); ctx.moveTo(p.x, p.y); ev.preventDefault(); }
    function move(ev) { if (!down) return; var p = pt(ev); ctx.lineTo(p.x, p.y); ctx.stroke(); ev.preventDefault(); }
    function end() { down = false; }
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointerleave", end);
  }

  function redraw() {
    var canvas = root && root.querySelector("#jf-draw");
    if (!canvas || !drawImg) return;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drawImg, 0, 0, canvas.width, canvas.height);
    strokes.forEach(function (s) {
      if (!s.pts.length) return;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      s.pts.forEach(function (p, i) {
        var x = p.x * canvas.width;
        var y = p.y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }

  function armDraw() {
    var p = photo();
    var canvas = root.querySelector("#jf-draw");
    if (!p || !canvas) return;
    drawImg = new Image();
    drawImg.onload = function () {
      var w = canvas.parentElement ? canvas.parentElement.clientWidth : 360;
      w = Math.max(280, Math.min(w - 24, 680));
      canvas.width = w;
      canvas.height = Math.max(180, Math.round(w * (drawImg.height / drawImg.width)));
      redraw();
    };
    drawImg.src = p.src;
    var current = null;
    function rel(ev) {
      var r = canvas.getBoundingClientRect();
      var src = ev.touches ? ev.touches[0] : ev;
      return {
        x: Math.min(1, Math.max(0, (src.clientX - r.left) / r.width)),
        y: Math.min(1, Math.max(0, (src.clientY - r.top) / r.height)),
      };
    }
    canvas.onpointerdown = function (ev) {
      current = { color: pen, pts: [rel(ev)] };
      strokes.push(current);
      canvas.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    };
    canvas.onpointermove = function (ev) {
      if (!current) return;
      current.pts.push(rel(ev));
      redraw();
      ev.preventDefault();
    };
    canvas.onpointerup = function () { current = null; };
  }

  function proposalHtml(j) {
    var blocks = OPTS.map(function (o) {
      var t = totals(j, o.id);
      var rows = linesOf(j, o.id).map(function (l) {
        return "<tr><td>" + esc(l.name) + "</td><td>" + (Number(l.qty) || 0) + "</td><td>" + money((Number(l.qty) || 0) * (Number(l.price) || 0)) + "</td></tr>";
      }).join("");
      return "<h2>" + esc(o.name) + (j.recommended === o.id ? " · selling this one" : "") + "</h2><p>" + esc(o.line) + "</p><table>" + rows + "</table><p><b>" + money(t.total) + "</b></p>";
    }).join("");
    var pics = (j.photos || []).map(function (p) {
      return "<figure><img src=\"" + p.src + "\" alt=\"\"><figcaption>" + esc(p.tag || "") + " " + esc(p.note || "") + "</figcaption></figure>";
    }).join("");
    var sign = j.signature ? "<img src=\"" + j.signature + "\" alt=\"Signature\">" : "";
    return "<h1>" + esc(j.customer) + "</h1><p>" + esc(j.address) + "</p><p>" + esc(j.complaint) + "</p>" + blocks + pics + sign + "<p>Training prices. Not a contract.</p>";
  }

  function photoReport(j) {
    var pics = (j.photos || []).map(function (p) {
      return "<figure><img src=\"" + p.src + "\" alt=\"\"><figcaption>" + esc((p.tag || "Photo") + " · " + when(p.at) + (p.note ? " · " + p.note : "") + (p.place ? " · " + p.place : "")) + "</figcaption></figure>";
    }).join("");
    var checks = CHECKS.map(function (c) {
      return "<li>" + ((j.checks && j.checks[c[0]]) ? "Done. " : "Open. ") + esc(c[1]) + "</li>";
    }).join("");
    return "<h1>" + esc(j.customer) + "</h1><p>" + esc(j.address) + "</p><p>" + esc(j.complaint) + "</p><ul>" + checks + "</ul>" + (pics || "<p>No photos.</p>");
  }

  function onClick(e) {
    var t = e.target.closest("[data-act]");
    if (!t || !root.contains(t)) return;
    var act = t.getAttribute("data-act");
    var j = job();
    if (act === "hub") { if (hooks && hooks.onHub) hooks.onHub(); return; }
    if (act === "list") { view = "list"; photoId = ""; drawing = false; render(); return; }
    if (act === "new") { view = "new"; render(); return; }
    if (act === "create") {
      var name = (root.querySelector("#jf-name") || {}).value || "";
      var addr = (root.querySelector("#jf-addr") || {}).value || "";
      var comp = (root.querySelector("#jf-comp") || {}).value || "";
      var made = blankJob(name.trim() || "New customer", addr.trim(), comp.trim());
      jobs.unshift(made);
      jobId = made.id;
      view = "job";
      tab = "photos";
      saveJob(made).then(render);
      return;
    }
    if (act === "open") {
      jobId = t.getAttribute("data-id");
      view = "job";
      tab = "photos";
      photoId = "";
      opt = (job() && job().recommended) || "better";
      render();
      return;
    }
    if (act === "del-job") {
      if (!j) return;
      if (!global.confirm("Delete this job off this phone?")) return;
      var id = j.id;
      dropJob(id).then(function () { view = "list"; jobId = ""; render(); });
      return;
    }
    if (act === "tab") {
      tab = t.getAttribute("data-tab");
      photoId = "";
      drawing = false;
      render();
      return;
    }
    if (act === "opt") { opt = t.getAttribute("data-opt"); render(); return; }
    if (act === "filter") { tagFilter = t.getAttribute("data-tag") || ""; render(); return; }
    if (act === "next-tag") { nextTag = t.getAttribute("data-tag") || "Before"; render(); return; }
    if (act === "photo") { photoId = t.getAttribute("data-id"); drawing = false; render(); return; }
    if (act === "close-photo") { photoId = ""; drawing = false; render(); return; }
    if (act === "set-tag") {
      var ph = photo();
      if (!ph || !j) return;
      ph.tag = t.getAttribute("data-tag");
      saveJob(j).then(render);
      return;
    }
    if (act === "save-note") {
      var noteEl = root.querySelector("#jf-note");
      var ph2 = photo();
      if (!ph2 || !j || !noteEl) return;
      ph2.note = noteEl.value.slice(0, 400);
      saveJob(j).then(render);
      return;
    }
    if (act === "stamp") {
      var ph3 = photo();
      if (!ph3 || !j || !navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(function (pos) {
        ph3.place = pos.coords.latitude.toFixed(5) + ", " + pos.coords.longitude.toFixed(5);
        saveJob(j).then(render);
      }, function () {
        ph3.place = "Location off";
        saveJob(j).then(render);
      }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
      return;
    }
    if (act === "del-photo") {
      if (!j) return;
      j.photos = j.photos.filter(function (p) { return p.id !== photoId; });
      photoId = "";
      saveJob(j).then(render);
      return;
    }
    if (act === "draw") { drawing = true; strokes = []; render(); return; }
    if (act === "draw-cancel") { drawing = false; strokes = []; render(); return; }
    if (act === "pen") { pen = t.getAttribute("data-pen") || "#CE0034"; return; }
    if (act === "undo") { strokes.pop(); redraw(); return; }
    if (act === "draw-save") {
      var canvas = root.querySelector("#jf-draw");
      var ph4 = photo();
      if (!canvas || !ph4 || !j) return;
      ph4.src = canvas.toDataURL("image/jpeg", 0.72);
      drawing = false;
      strokes = [];
      saveJob(j).then(render);
      return;
    }
    if (act === "check") {
      if (!j) return;
      var cid = t.getAttribute("data-id");
      j.checks = j.checks || {};
      j.checks[cid] = !j.checks[cid];
      saveJob(j).then(render);
      return;
    }
    if (act === "add-book") {
      if (!j) return;
      j.options[opt].lines.push(lineFrom(t.getAttribute("data-id")));
      saveJob(j).then(render);
      return;
    }
    if (act === "add-custom") {
      if (!j) return;
      var nm = (root.querySelector("#jf-cname") || {}).value || "";
      if (!String(nm).trim()) return;
      j.options[opt].lines.push({
        id: uid("l"),
        book: "",
        name: String(nm).trim().slice(0, 80),
        qty: 1,
        cost: Math.max(0, Math.round(Number((root.querySelector("#jf-ccost") || {}).value) || 0)),
        price: Math.max(0, Math.round(Number((root.querySelector("#jf-cprice") || {}).value) || 0)),
      });
      saveJob(j).then(render);
      return;
    }
    if (act === "qty") {
      if (!j) return;
      var lid = t.getAttribute("data-line");
      var dir = Number(t.getAttribute("data-dir")) || 0;
      linesOf(j, opt).forEach(function (l) {
        if (l.id === lid) l.qty = Math.max(1, (Number(l.qty) || 1) + dir);
      });
      saveJob(j).then(render);
      return;
    }
    if (act === "del-line") {
      if (!j) return;
      var drop = t.getAttribute("data-line");
      j.options[opt].lines = linesOf(j, opt).filter(function (l) { return l.id !== drop; });
      saveJob(j).then(render);
      return;
    }
    if (act === "recommend") {
      if (!j) return;
      j.recommended = opt;
      saveJob(j).then(render);
      return;
    }
    if (act === "pick") {
      if (!j) return;
      if (!signedInk) { needInk = true; render(); return; }
      needInk = false;
      var canvas = root.querySelector("#jf-sign");
      j.accepted = t.getAttribute("data-opt") || j.recommended || "better";
      j.acceptedAt = Date.now();
      j.signature = canvas ? canvas.toDataURL("image/png") : "";
      saveJob(j).then(render);
      return;
    }
    if (act === "sign-clear") { armSign(); return; }
    if (act === "void") {
      if (!j) return;
      j.accepted = "";
      j.acceptedAt = 0;
      j.signature = "";
      saveJob(j).then(render);
      return;
    }
    if (act === "print") {
      if (!j) return;
      var sheet = root.querySelector("#jf-sheet");
      if (!sheet) return;
      sheet.innerHTML = t.getAttribute("data-kind") === "photos" ? photoReport(j) : proposalHtml(j);
      global.print();
    }
  }

  function start(host, h) {
    root = host;
    hooks = h || {};
    view = "list";
    css();
    if (root && !root.__jf) {
      root.__jf = true;
      root.addEventListener("click", onClick);
    }
    root.innerHTML = '<div class="jf"><p class="jf-lead">Opening the job file…</p></div>';
    loadAll().then(render).catch(function () {
      memOnly = true;
      if (!jobs.length) jobs = [starter()];
      render();
    });
  }

  global.JobFile = { start: start };
})(window);
