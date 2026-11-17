/* Funny HVAC — a card of clips. Not a lesson. */
(function (global) {
  "use strict";

  var CLIPS = [
    {
      id: "hqqoo1IgIrU",
      show: "Saturday Night Live",
      title: "Upfront Heating & Air Conditioning",
      line: "The commercial for the cheaper company.",
    },
  ];

  function css() {
    if (document.getElementById("fn-css")) return;
    var st = document.createElement("style");
    st.id = "fn-css";
    st.textContent =
      ".fn-shell{max-width:720px;margin:0 auto;padding:12px 12px 32px;box-sizing:border-box;color:#f6f1e6}" +
      ".fn-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin:0 0 8px}" +
      ".fn-kicker{margin:0;color:#e8c450;font:700 11px/1.2 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}" +
      ".fn-head h1{margin:2px 0 0;font:700 28px/1.05 system-ui,sans-serif}" +
      ".fn-lead{margin:0 0 14px;color:#b7c0c8;font:15px/1.4 system-ui,sans-serif}" +
      ".fn-list{display:flex;flex-direction:column;gap:12px}" +
      ".fn-card{border:1px solid #4a5560;border-radius:14px;background:#12161b;overflow:hidden;box-shadow:inset 3px 0 0 #CE0034}" +
      ".fn-film{position:relative;width:100%;aspect-ratio:16/9;background:#070b10}" +
      ".fn-film iframe{position:absolute;inset:0;width:100%;height:100%;border:0}" +
      ".fn-copy{padding:12px 14px 14px}" +
      ".fn-show{margin:0;color:#e8c450;font:700 12px/1.2 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}" +
      ".fn-copy h2{margin:4px 0 4px;font:700 18px/1.2 system-ui,sans-serif}" +
      ".fn-copy p{margin:0 0 10px;color:#b7c0c8;font:14px/1.35 system-ui,sans-serif}" +
      ".fn-open{color:#f6f1e6;font:700 15px/1 system-ui,sans-serif}";
    document.head.appendChild(st);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function start(root, hooks) {
    if (!root) return;
    css();
    var cards = CLIPS.map(function (c) {
      var watch = "https://youtu.be/" + encodeURIComponent(c.id);
      var embed =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(c.id) +
        "?rel=0";
      return (
        '<article class="fn-card">' +
        '<div class="fn-film"><iframe title="' +
        esc(c.title) +
        '" src="' +
        embed +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
        '<div class="fn-copy"><p class="fn-show">' +
        esc(c.show) +
        "</p><h2>" +
        esc(c.title) +
        "</h2><p>" +
        esc(c.line) +
        '</p><a class="fn-open" href="' +
        watch +
        '" target="_blank" rel="noopener">Open on YouTube</a></div></article>'
      );
    }).join("");
    root.innerHTML =
      '<div class="fn-shell">' +
      '<header class="fn-head"><div><p class="fn-kicker">Break room</p><h1>Funny HVAC</h1></div>' +
      '<button type="button" class="btn" id="fn-hub">Shop floor</button></header>' +
      '<p class="fn-lead">Clips from the trade. Not a lesson. Send the next one and it goes on this card.</p>' +
      '<div class="fn-list">' +
      cards +
      "</div></div>";
    var back = root.querySelector("#fn-hub");
    if (back) {
      back.onclick = function () {
        if (hooks && hooks.onHub) hooks.onHub();
      };
    }
  }

  global.FunnyHvac = { start: start, clips: CLIPS };
})(window);
