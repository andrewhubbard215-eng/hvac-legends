/* HVAC Legends — Online student arena */
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
      err = "Board warming up — sign in, finish a quiz or install, then refresh.";
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
    const techs = board.techs || [];
    root.innerHTML = `
      <div class="comp-shell">
        <header class="comp-head">
          <div>
            <div class="brand-bar" style="justify-content:flex-start;margin-bottom:6px">
              <div class="brand-mark" style="width:28px;height:28px;font-size:13px">${(window.LtBrand && window.LtBrand.mark) || "LT"}</div>
              <div class="brand-word">
                <strong style="font-size:13px">${((window.LtBrand && window.LtBrand.org) || "HVAC Legends").toUpperCase()}</strong>
                <span>Online student arena · Professor HUB</span>
              </div>
            </div>
            <h2>All-Star competition</h2>
            <p class="comp-sub">Quiz, service, and sandbox races post here. Host a class PIN in System sandbox → Class race so everyone builds the same circuit against the clock.</p>
          </div>
          <div class="comp-actions">
            <button class="btn primary" id="comp-login">Sign in / create account</button>
            <button class="btn" id="comp-refresh">Refresh board</button>
            <button class="btn" id="comp-hub">Shop floor</button>
          </div>
        </header>
        <div class="hub-chip" style="max-width:none;margin:0 0 14px">
          <img src="hub-portrait.jpg?v=3" alt="" class="hub-chip-av photo" />
          <div><strong>Professor HUB</strong><p>Clock a score, then watch the board. Fast and right beats loud and wrong.</p></div>
        </div>
        ${err ? `<p class="comp-err">${err}</p>` : ""}
        ${loading ? `<p class="comp-muted">Loading live board…</p>` : ""}
        <div class="comp-grid">
          <section>
            <h3>Top posted scores</h3>
            <ol class="comp-list">
              ${
                scores.length
                  ? scores
                      .map(
                        (row, i) =>
                          `<li><span class="n">${i + 1}</span><div><strong>${escapeHtml(row.callsign)}</strong><small>${escapeHtml(row.mode)}</small></div><b>${row.score}</b></li>`
                      )
                      .join("")
                  : "<li class='empty'>No posted scores yet. Sign in, run Quiz Arena, then refresh.</li>"
              }
            </ol>
          </section>
          <section>
            <h3>XP locker</h3>
            <ol class="comp-list">
              ${
                techs.length
                  ? techs
                      .map(
                        (t, i) =>
                          `<li><span class="n">${i + 1}</span><div><strong>${escapeHtml(t.callsign)}</strong><small>${t.jobs} jobs</small></div><b>${t.xp} XP</b></li>`
                      )
                      .join("")
                  : "<li class='empty'>Locker is empty. Signed-in techs show here.</li>"
              }
            </ol>
          </section>
        </div>
        <p class="comp-how">How to compete: 1) Sign in  2) Clock in  3) Finish All-Star Exam, mini-split, sandbox, or service  4) Scores post here. Host a class PIN so phones can join the same exam.</p>
      </div>`;
    root.querySelector("#comp-login").onclick = signIn;
    root.querySelector("#comp-refresh").onclick = loadBoard;
    root.querySelector("#comp-hub").onclick = () => hooks.onHub && hooks.onHub();
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
