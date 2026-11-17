/* Lincoln Tech HVAC Allstars — Online student arena */
(function (global) {
  "use strict";

  let root = null;
  let hooks = {};
  let board = { scores: [], techs: [] };
  let err = "";
  let loading = true;

  function postToParent(msg) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(Object.assign({ source: "lt-allstars", v: 1 }, msg), window.location.origin);
      }
    } catch (_) {}
  }

  async function loadBoard() {
    loading = true;
    err = "";
    render();
    try {
      const r = await fetch("/api/arena", { credentials: "include" });
      if (!r.ok) throw new Error("board");
      board = await r.json();
    } catch (_) {
      err = "Board didn't load. Finish a lab and hit Refresh.";
    }
    loading = false;
    render();
  }

  function signIn() {
    try {
      window.top.location.href = "/login";
    } catch (_) {
      window.location.href = "/login";
    }
  }

  function render() {
    if (!root) return;
    const scores = board.scores || [];
    const mine = hooks.callsign ? hooks.callsign() : "";
    root.innerHTML = `
      <div class="comp-shell">
        <header class="comp-head">
          <div>
            <p class="eyebrow">High score</p>
            <h2>The board</h2>
            <p class="comp-sub">One number. Your XP. The name above you is the one you have to beat.</p>
          </div>
          <div class="comp-actions">
            <button class="btn" id="comp-hub">Shop floor</button>
          </div>
        </header>
        <label class="comp-name">Name on the board
          <input id="comp-name" maxlength="16" autocomplete="off" value="${escapeHtml(mine)}" />
        </label>
        ${err ? `<p class="comp-err">${err}</p>` : ""}
        ${loading ? `<p class="comp-muted">Loading the board…</p>` : ""}
        <ol class="comp-list">
          ${
            scores.length
              ? scores
                  .map((row, i) => {
                    const you = row.callsign === mine ? " is-you" : "";
                    return `<li class="${you}"><span class="n">${i + 1}</span><div><strong>${escapeHtml(row.callsign)}</strong><small>${you ? "You" : "XP"}</small></div><b>${row.score}</b></li>`;
                  })
                  .join("")
              : "<li class='empty'>No scores yet. Put your name in and finish a lab.</li>"
          }
        </ol>
        <div class="comp-actions">
          <button class="btn primary" id="comp-run">Take the call</button>
          <button class="btn" id="comp-refresh">Refresh</button>
        </div>
      </div>`;
    const name = root.querySelector("#comp-name");
    name.onchange = () => hooks.onName && hooks.onName(name.value);
    root.querySelector("#comp-hub").onclick = () => hooks.onHub && hooks.onHub();
    root.querySelector("#comp-refresh").onclick = loadBoard;
    root.querySelector("#comp-run").onclick = () => hooks.onRun && hooks.onRun();
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[<>]/g, "");
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    loadBoard();
    return { stop() {} };
  }

  global.CompeteArena = { start, postToParent };
})(window);
