/* Classroom Wi-Fi — this PC hosts, phones join the same shop. */
(function (global) {
  "use strict";
  var KEY = "lt-net";
  var fileInfo = null;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (_) {
      return {};
    }
  }
  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (_) {}
  }

  function origin() {
    return (location.origin || "").replace(/\/$/, "");
  }
  function isLoopback() {
    return /^(localhost|127\.0\.0\.1)$/i.test(location.hostname || "");
  }
  function isLan() {
    var h = location.hostname || "";
    return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(h);
  }

  function studentUrl() {
    var extra = "play=1&sku=campus&class=1";
    if (global.LtClass && global.LtClass.isIn()) extra += "&room=" + global.LtClass.pin();
    var s = load();
    if (s.customHost && /^https?:\/\//i.test(s.customHost)) {
      return s.customHost.replace(/\/$/, "") + "/allstars/index.html?" + extra;
    }
    try {
      var u = new URL(location.href);
      u.search = extra;
      u.hash = "";
      return u.toString();
    } catch (e) {
      return origin() + "/allstars/index.html?" + extra;
    }
  }

  function paint(root) {
    if (!root) return;
    var s = load();
    var share = s.share !== false;
    var join = studentUrl();
    var loop = isLoopback();
    var lanFile = !!(fileInfo && fileInfo.lan);
    var status;
    if (!share) status = "This device only. Phones will not join.";
    else if (lanFile) status = "Shop PC is hosting. Phones on the same Wi-Fi use the address below.";
    else if (loop) status = "You are on this PC. Double-click PLAY-PC.bat so phones can join the Wi-Fi address it prints.";
    else if (isLan()) status = "This phone/tablet is already on the shop Wi-Fi.";
    else status = "Online host. Share this link. Exam PIN still lives in All-Star Exam.";

    root.innerHTML =
      '<div class="net-lab">' +
      '<header class="sb-toolbar"><button type="button" class="btn" id="net-hub">Shop floor</button>' +
      '<strong>Classroom Wi-Fi</strong></header>' +
      '<div class="net-body">' +
      '<div class="hub-chip" style="max-width:none;margin:0 0 14px">' +
      '<img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo"/>' +
      "<div><strong>Professor HUB</strong><p>Same school Wi-Fi. You start a class PIN. Students paste the link, type a name, and follow you through every lab. Board keeps score.</p></div></div>" +
      '<div class="net-class" id="net-class"></div>' +
      '<p class="net-status">' +
      status +
      "</p>" +
      '<label class="net-row"><input type="checkbox" id="net-share"' +
      (share ? " checked" : "") +
      "/> Allow phones on this Wi-Fi to join the shop</label>" +
      '<p class="eyebrow">Student PCs open this (skips locker)</p>' +
      '<p class="net-url" id="net-url">' +
      (share ? join : "This device only") +
      "</p>" +
      '<div class="row" style="gap:8px;flex-wrap:wrap">' +
      '<button type="button" class="btn primary" id="net-copy">Copy address</button>' +
      '<a class="btn" href="' +
      join +
      '" id="net-open">Open on this PC</a>' +
      "</div>" +
      '<label class="net-host">Override host (optional — only if you put the zip on a known shop PC)' +
      '<input id="net-custom" placeholder="http://192.168.1.20:8080" value="' +
      (s.customHost || "") +
      '"/></label>' +
      "<ul class=\"net-steps\">" +
      "<li><b>You:</b> Start class → write the 6-digit PIN on the board.</li>" +
      "<li><b>Students:</b> same school Wi-Fi, paste the link, type a name, Join class.</li>" +
      "<li>Open Ohm’s, mini-split, gauges — their phones follow. Scores hit the class board.</li>" +
      "<li>All-Star Exam PIN is still inside the exam if you want a sealed paper.</li>" +
      "</ul>" +
      "</div></div>";

    paintClass(root.querySelector("#net-class"));

    var hub = root.querySelector("#net-hub");
    if (hub) hub.onclick = function () { if (global.ltPlay) global.ltPlay("hub"); };
    var box = root.querySelector("#net-share");
    if (box) {
      box.onchange = function () {
        var st = load();
        st.share = !!box.checked;
        save(st);
        paint(root);
      };
    }
    var copy = root.querySelector("#net-copy");
    if (copy) {
      copy.onclick = function () {
        var t = join;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(function () {
            copy.textContent = "Copied";
          }).catch(function () {
            copy.textContent = "Copy failed";
          });
        } else {
          copy.textContent = t;
        }
      };
    }
    var custom = root.querySelector("#net-custom");
    if (custom) {
      custom.onchange = function () {
        var st = load();
        st.customHost = custom.value.trim();
        save(st);
        paint(root);
      };
    }
  }

  function paintClass(box) {
    if (!box) return;
    var C = global.LtClass;
    if (!C) {
      box.innerHTML = "<p>Class session didn't load. Hard-refresh.</p>";
      return;
    }
    if (!C.isIn()) {
      box.innerHTML =
        '<p class="eyebrow">Class session</p>' +
        "<h3>Walk the labs together</h3>" +
        "<p>Start a class. Students join with the PIN. When you open Ohm’s or mini-split, their phones follow. Scores hit the board.</p>" +
        '<label>Your name on the board<input id="net-host-name" maxlength="18" value="HUB" /></label>' +
        '<button type="button" class="btn primary" id="net-start">Start class</button>';
      var go = box.querySelector("#net-start");
      if (go) {
        go.onclick = function () {
          var nm = (box.querySelector("#net-host-name").value || "HUB").trim().slice(0, 18);
          go.disabled = true;
          go.textContent = "Starting…";
          C.host(nm).then(function () {
            if (lastRoot) paint(lastRoot);
          }).catch(function (e) {
            go.disabled = false;
            go.textContent = "Start class";
            alert((e && e.message) || "Could not start class. Use the hosted app link, not a file:// page.");
          });
        };
      }
      return;
    }
    var room = C.room() || {};
    var link = C.studentLink();
    var roster = (room.students || [])
      .slice()
      .sort(function (a, b) { return (b.score || 0) - (a.score || 0); })
      .map(function (s, i) {
        return "<li><b>" + (i + 1) + "</b> " + s.name + " <span>" + (s.score || 0) + "</span></li>";
      })
      .join("");
    box.innerHTML =
      '<p class="eyebrow">Live class</p>' +
      '<p class="net-pin">PIN <strong>' +
      C.pin() +
      "</strong></p>" +
      '<p class="net-url">' +
      link +
      "</p>" +
      '<div class="row" style="gap:8px;flex-wrap:wrap">' +
      '<button type="button" class="btn primary" id="net-copy-class">Copy student link</button>' +
      "</div>" +
      "<p>Write the PIN on the board. Open a lab — they follow.</p>" +
      "<ol class='class-hud-board'>" +
      (roster || "<li>Waiting on techs…</li>") +
      "</ol>";
    var c = box.querySelector("#net-copy-class");
    if (c) {
      c.onclick = function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(function () { c.textContent = "Copied"; });
        }
      };
    }
  }

  var lastRoot = null;
  function mount(root) {
    if (!root) return { destroy: function () {} };
    lastRoot = root;
    function go() {
      paint(root);
    }
    fetch("classroom-net.json?ts=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        fileInfo = j;
        go();
      })
      .catch(function () {
        fileInfo = null;
        go();
      });
    go();
    return { destroy: function () {} };
  }

  global.LtNet = { mount: mount, studentUrl: studentUrl };
})(window);
