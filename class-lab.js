/* Class session — school Wi-Fi. Instructor hosts a PIN. Students follow the lab and compete. */
(function (global) {
  "use strict";

  var LABS = {
    hub: "Shop floor",
    sandbox: "System sandbox",
    ohms: "Ohm's Law",
    electrical: "Land lugs / 24V",
    voltmeter: "CL445 meter",
    gauges: "Manifold school",
    minisplit: "Mini-split install",
    furnace: "Furnace",
    flare: "Flaring",
    braze: "Brazing",
    quiz: "All-Star Exam",
    epa608: "EPA 608 tutor",
    shopschool: "Shop School",
    service: "Service call",
    defusal: "Saturday callback",
  };

  var pin = "";
  var role = "";
  var name = "Student";
  var room = null;
  var follow = true;
  var timer = 0;
  var lastLab = "";
  var pollBusy = false;

  function api(path, body) {
    var opts = body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      : { credentials: "include" };
    return fetch(path, opts).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error || "class");
        return j;
      });
    });
  }

  function boardHtml() {
    if (!room) return "";
    var list = (room.students || []).slice().sort(function (a, b) {
      return (b.score || 0) - (a.score || 0);
    });
    return list
      .map(function (s, i) {
        var me = s.name === name ? " me" : "";
        return (
          "<li class='" +
          me +
          "'><b>" +
          (i + 1) +
          "</b> " +
          (s.name || "Tech") +
          " <span>" +
          (s.score || 0) +
          "</span></li>"
        );
      })
      .join("");
  }

  function paintHud() {
    var el = document.getElementById("class-hud");
    if (!pin) {
      if (el) el.hidden = true;
      return;
    }
    if (!el) {
      el = document.createElement("div");
      el.id = "class-hud";
      el.className = "class-hud";
      (document.getElementById("app") || document.body).appendChild(el);
    }
    el.hidden = false;
    var title = (room && (room.title || LABS[room.lab])) || "Class";
    var n = (room && room.students && room.students.length) || 0;
    el.innerHTML =
      '<div class="class-hud-row">' +
      "<strong>CLASS " +
      pin +
      "</strong>" +
      "<span>" +
      title +
      " · " +
      n +
      " techs</span>" +
      (role === "host"
        ? '<button type="button" class="btn" id="ch-copy">Copy link</button>'
        : '<label class="class-follow"><input type="checkbox" id="ch-follow"' +
          (follow ? " checked" : "") +
          "/> Follow HUB</label>") +
      '<button type="button" class="btn" id="ch-board">Board</button>' +
      "</div>" +
      '<ol class="class-hud-board" id="ch-list" hidden>' +
      boardHtml() +
      "</ol>";
    var copy = el.querySelector("#ch-copy");
    if (copy) copy.onclick = function () {
      var u = studentLink();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function () {
          copy.textContent = "Copied";
        }).catch(function () {});
      }
    };
    var fol = el.querySelector("#ch-follow");
    if (fol) fol.onchange = function () { follow = !!fol.checked; };
    var bd = el.querySelector("#ch-board");
    if (bd) {
      bd.onclick = function () {
        var list = el.querySelector("#ch-list");
        if (list) list.hidden = !list.hidden;
      };
    }
  }

  function studentLink() {
    try {
      var u = new URL(location.href);
      u.search = "play=1&sku=campus&class=1&room=" + pin;
      u.hash = "";
      return u.toString();
    } catch (_) {
      return location.href;
    }
  }

  function applyRoom(next) {
    room = next;
    paintHud();
    if (role !== "host" && follow && room && room.lab && room.lab !== lastLab && room.lab !== "hub") {
      lastLab = room.lab;
      if (global.ltPlay) global.ltPlay(room.lab);
    } else if (room) {
      lastLab = room.lab;
    }
  }

  function poll() {
    if (!pin || pollBusy) return;
    pollBusy = true;
    api("/api/class-lab?pin=" + encodeURIComponent(pin))
      .then(applyRoom)
      .catch(function () {})
      .then(function () {
        pollBusy = false;
      });
  }

  function startPoll() {
    stopPoll();
    poll();
    timer = setInterval(poll, 2500);
  }
  function stopPoll() {
    if (timer) clearInterval(timer);
    timer = 0;
  }

  function host(hostName) {
    name = (hostName || "HUB").slice(0, 18);
    role = "host";
    return api("/api/class-lab", { action: "create", host: name }).then(function (r) {
      pin = r.pin;
      lastLab = r.lab || "hub";
      applyRoom(r);
      startPoll();
      return r;
    });
  }

  function join(roomPin, studentName) {
    pin = String(roomPin || "").replace(/\D/g, "").slice(0, 6);
    name = (studentName || "Student").slice(0, 18);
    role = "student";
    return api("/api/class-lab", { action: "join", pin: pin, name: name }).then(function (r) {
      applyRoom(r);
      startPoll();
      return r;
    });
  }

  function push(lab) {
    if (role !== "host" || !pin) return;
    var id = String(lab || "hub");
    if (id === "network" || id === "compete" || id === "character") return;
    var title = LABS[id] || id;
    if (global.ShopSchool && typeof global.ShopSchool.dayTitle === "function") {
      var d = global.ShopSchool.dayTitle();
      if (d) title = d + " · " + title;
    }
    api("/api/class-lab", {
      action: "lab",
      pin: pin,
      lab: id,
      title: title,
    }).then(applyRoom).catch(function () {});
  }

  function score(mode, n) {
    if (!pin) return;
    var add = Math.max(0, Number(n) || 0);
    if (!add) return;
    api("/api/class-lab", { action: "score", pin: pin, name: name, score: add, lab: mode })
      .then(applyRoom)
      .catch(function () {});
  }

  global.LtClass = {
    host: host,
    join: join,
    push: push,
    score: score,
    studentLink: studentLink,
    isHost: function () { return role === "host"; },
    isIn: function () { return !!pin; },
    pin: function () { return pin; },
    room: function () { return room; },
    labs: LABS,
    stop: stopPoll,
  };
})(window);
