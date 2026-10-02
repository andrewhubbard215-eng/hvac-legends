/* HVAC Legends — student shop chat */
(function (global) {
  "use strict";

  const SAVE_ROOM = "lt-chat-room";
  let room = "lobby";
  let lastId = 0;
  let seen = {};
  let poll = 0;
  let open = false;
  let unread = 0;
  let hooks = {};
  let root = null;

  function callsign() {
    return (hooks.getCallsign && hooks.getCallsign()) || "Tech";
  }

  function roomLabel(id) {
    if (id === "lobby") return "Shop floor";
    if (id === "compete") return "All-Star Arena";
    if (id.indexOf("quiz-") === 0) return "Class " + id.slice(5);
    if (id.indexOf("lab-") === 0) return "Lab " + id.slice(4);
    return id;
  }

  async function apiGet(after) {
    const r = await fetch("/api/chat?room=" + encodeURIComponent(room) + (after ? "&after=" + after : ""), {
      credentials: "include",
    });
    return r.json();
  }

  async function apiPost(payload) {
    const r = await fetch("/api/chat", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return r.json();
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderMsg(m, box) {
    if (seen[m.id]) return;
    seen[m.id] = 1;
    const row = el("div", "sc-msg" + (m.callsign === callsign() ? " mine" : ""));
    const who = el("b", "", m.callsign);
    const body = el("p", "", m.waiting ? m.body + " · sends when online" : m.body);
    row.appendChild(who);
    row.appendChild(body);
    if (m.kind === "share") {
      const btn = el("button", "btn sc-load", "Load this board");
      btn.onclick = () => {
        try {
          const snap = JSON.parse(m.meta || "{}");
          if (hooks.loadSandbox) hooks.loadSandbox(snap);
          if (hooks.onToast) hooks.onToast("Loaded " + m.callsign + "'s system", "ok");
        } catch (_) {}
      };
      row.appendChild(btn);
    }
    if (m.kind === "challenge") {
      const btn = el("button", "btn sc-load", "Accept quiz");
      btn.onclick = () => {
        if (hooks.onChallenge) hooks.onChallenge(m.meta);
      };
      row.appendChild(btn);
    }
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
    lastId = Math.max(lastId, m.id);
  }

  function paint() {
    if (!root) return;
    const title = root.querySelector("#sc-title");
    const badge = root.querySelector("#sc-badge");
    if (title) title.textContent = roomLabel(room);
    if (badge) {
      badge.textContent = unread > 9 ? "9+" : String(unread);
      badge.classList.toggle("on", unread > 0 && !open);
    }
    root.classList.toggle("open", open);
  }

  async function pull(initial) {
    try {
      const data = await apiGet(initial ? 0 : lastId);
      const box = root && root.querySelector("#sc-log");
      if (!box || !data.messages) return;
      const msgs = data.messages;
      msgs.forEach((m) => {
        const isNew = !seen[m.id];
        renderMsg(m, box);
        if (isNew && !initial && m.callsign !== callsign() && !open) unread += 1;
      });
      paint();
    } catch (_) {}
  }

  async function send(kind, body, meta) {
    const text = String(body || "").trim();
    if (!text) return;
    const payload = {
      room,
      callsign: callsign(),
      kind: kind || "text",
      body: text,
      meta: meta ? JSON.stringify(meta) : "{}",
    };
    try {
      const sent = global.LtOutbox ? await global.LtOutbox.send("/api/chat", payload) : await apiPost(payload);
      const box = root && root.querySelector("#sc-log");
      if (sent && sent.queued && box) {
        renderMsg({ id: "wait-" + Date.now(), callsign: callsign(), body: text, kind: kind || "text", waiting: true }, box);
        return;
      }
      await pull(false);
    } catch (_) {}
  }

  global.addEventListener("lt-outbox-flushed", function () {
    if (!root) return;
    root.querySelectorAll(".sc-msg").forEach(function (row) {
      if (/sends when online/.test(row.textContent || "")) row.remove();
    });
    pull(false);
  });

  function joinRoom(id) {
    room = id;
    lastId = 0;
    seen = {};
    try { localStorage.setItem(SAVE_ROOM, room); } catch (_) {}
    const box = root.querySelector("#sc-log");
    if (box) box.innerHTML = "";
    paint();
    pull(true);
  }

  function pinGen() {
    return String((Math.random() * 900000 + 100000) | 0);
  }

  function mount(opts) {
    hooks = opts || {};
    try { room = localStorage.getItem(SAVE_ROOM) || "lobby"; } catch (_) {}
    if (!/^(lobby|compete|quiz-\d{6}|lab-\d{6})$/.test(room)) room = "lobby";

    root = document.getElementById("shop-chat");
    if (!root) {
      root = el("div", "");
      root.id = "shop-chat";
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <button type="button" id="sc-fab" class="sc-fab" aria-label="Shop chat">
        <span>Chat</span>
        <i id="sc-badge"></i>
      </button>
      <div class="sc-panel">
        <header class="sc-drag">
          <div>
            <p class="eyebrow">Drag me · students</p>
            <strong id="sc-title">Shop floor</strong>
          </div>
          <button type="button" id="sc-close" class="btn">–</button>
        </header>
        <div class="sc-rooms">
          <button type="button" data-room="lobby">Shop</button>
          <button type="button" data-room="compete">Arena</button>
          <button type="button" id="sc-class">Class PIN</button>
          <button type="button" id="sc-lab">Lab PIN</button>
        </div>
        <div id="sc-log" class="sc-log"></div>
        <div class="sc-tools">
          <button type="button" id="sc-share">Share board</button>
          <button type="button" id="sc-duel">Challenge</button>
        </div>
        <form id="sc-form">
          <input id="sc-input" maxlength="400" placeholder="Talk to the class…" autocomplete="off" />
          <button class="btn primary" type="submit">Send</button>
        </form>
      </div>`;

    if (window.LtDrag && window.LtDrag.makeMoveable) {
      window.LtDrag.makeMoveable(root.querySelector(".sc-panel header"), root, "lt-chat-pos");
      window.LtDrag.makeMoveable(root.querySelector("#sc-fab"), root, "lt-chat-pos");
    }

    root.querySelector("#sc-fab").onclick = () => {
      if (root.dataset.dragged === "1") {
        root.dataset.dragged = "";
        return;
      }
      open = !open;
      if (open) unread = 0;
      paint();
      if (open) pull(false);
    };
    root.querySelector("#sc-close").onclick = () => { open = false; paint(); };
    root.querySelectorAll(".sc-rooms [data-room]").forEach((b) => {
      b.onclick = () => joinRoom(b.getAttribute("data-room"));
    });
    root.querySelector("#sc-class").onclick = () => {
      const pin = window.prompt("Class quiz PIN (6 digits)", room.indexOf("quiz-") === 0 ? room.slice(5) : "");
      if (pin && /^\d{6}$/.test(pin.trim())) joinRoom("quiz-" + pin.trim());
    };
    root.querySelector("#sc-lab").onclick = () => {
      const cur = room.indexOf("lab-") === 0 ? room.slice(4) : "";
      const pin = window.prompt("Lab PIN — blank creates a new lab", cur);
      if (pin === null) return;
      if (!pin.trim()) {
        const n = pinGen();
        joinRoom("lab-" + n);
        send("join", "Opened lab " + n + " — teammates join this PIN to work the same board.");
        if (hooks.onToast) hooks.onToast("Lab PIN " + n, "ok");
        return;
      }
      if (/^\d{6}$/.test(pin.trim())) joinRoom("lab-" + pin.trim());
    };
    root.querySelector("#sc-share").onclick = () => {
      const snap = hooks.getSandbox && hooks.getSandbox();
      if (!snap || !snap.placed || !Object.keys(snap.placed).length) {
        if (hooks.onToast) hooks.onToast("Build a system first, then share.", "bad");
        return;
      }
      send("share", "Shared a live system board — load it to work together.", snap);
    };
    root.querySelector("#sc-duel").onclick = () => {
      send("challenge", "Quiz duel — EPA/OSHA mix. Accept if you want the smoke.", { packId: "mixed" });
    };
    root.querySelector("#sc-form").onsubmit = (e) => {
      e.preventDefault();
      const input = root.querySelector("#sc-input");
      const v = input.value;
      input.value = "";
      send("text", v);
    };

    paint();
    pull(true);
    if (poll) clearInterval(poll);
    poll = setInterval(() => pull(false), 2500);
    global.StudentChat.setRoom = joinRoom;
    global.StudentChat.open = function () {
      open = true;
      unread = 0;
      paint();
    };
    return {
      setRoom: joinRoom,
      open: global.StudentChat.open,
      stop() { if (poll) clearInterval(poll); poll = 0; },
    };
  }

  global.StudentChat = { mount };
})(window);
