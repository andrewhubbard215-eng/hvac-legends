/* Shared meter face. Blue near zero, orange for a call, red for line voltage. */
(function (global) {
  function num(text) {
    var n = parseFloat(String(text || "").replace(/,/g, ""));
    return isFinite(n) ? n : null;
  }

  function toneOf(text, unit) {
    var blob = (String(unit || "") + " " + String(text || "")).toLowerCase();
    var n = num(text);
    if (/fuse/.test(blob)) return { tone: "fuse", bar: 100, tag: "Fuse open" };
    if (n == null) return { tone: "", bar: 0, tag: "" };
    if (blob.indexOf("superheat") >= 0 || unit === "SH") {
      if (n < 3) return { tone: "line", bar: 90, tag: "Superheat collapsed" };
      if (n > 25) return { tone: "line", bar: 80, tag: "Superheat high" };
      return { tone: "cold", bar: 42, tag: "Superheat in band" };
    }
    if (blob.indexOf("subcool") >= 0 || unit === "SC") {
      if (n < 4) return { tone: "call", bar: 22, tag: "Subcooling low" };
      if (n > 16) return { tone: "line", bar: 84, tag: "Subcooling high" };
      return { tone: "cold", bar: 46, tag: "Subcooling in band" };
    }
    if (blob.indexOf("micron") >= 0) {
      if (n <= 500) return { tone: "cold", bar: 18, tag: "Tight vacuum" };
      if (n <= 2000) return { tone: "call", bar: 55, tag: "Still rising" };
      return { tone: "line", bar: 90, tag: "Not a vacuum yet" };
    }
    if (blob.indexOf("temp rise") >= 0) {
      return n >= 35 && n <= 65
        ? { tone: "cold", bar: 50, tag: "Rise in band" }
        : { tone: "line", bar: 80, tag: n < 35 ? "Rise too low" : "Rise too high" };
    }
    if (blob.indexOf("flame") >= 0) {
      return n >= 1
        ? { tone: "cold", bar: 40, tag: "Flame proved" }
        : { tone: "line", bar: 88, tag: "Weak flame signal" };
    }
    if (blob.indexOf("psig") >= 0 || blob.indexOf("inhg") >= 0) {
      if (n < 0) return { tone: "cold", bar: 30, tag: "In a vacuum" };
      if (n > 350) return { tone: "line", bar: Math.min(100, Math.round(n / 8)), tag: "High head" };
      if (n > 80) return { tone: "call", bar: Math.min(100, Math.round(n / 8)), tag: "Pressure" };
      return { tone: "cold", bar: Math.max(6, Math.round(n / 8)), tag: "Low pressure" };
    }
    if (blob.indexOf("oz") >= 0) {
      if (n >= 13 && n <= 17) return { tone: "cold", bar: 72, tag: "In the window" };
      if (n > 17) return { tone: "line", bar: 96, tag: "Over 17. Stop." };
      return { tone: "call", bar: Math.max(8, Math.round(n / 15 * 100)), tag: "Short of 15 oz" };
    }
    if (/(^| )a($| )/.test(blob) || blob.indexOf("amp") >= 0 || unit === "I") {
      return n > 20
        ? { tone: "line", bar: Math.min(100, Math.round(n / 40 * 100)), tag: "High amps" }
        : { tone: "call", bar: Math.max(8, Math.round(n / 40 * 100)), tag: "Amps" };
    }
    if (blob.indexOf("ω") >= 0 || blob.indexOf("ohm") >= 0 || unit === "R") {
      return { tone: "call", bar: Math.min(100, Math.round(Math.min(n, 200) / 2)), tag: "Ohms" };
    }
    if (unit === "W" || blob.indexOf("watt") >= 0) {
      return { tone: n > 40 ? "line" : "call", bar: Math.min(100, Math.round(n / 2)), tag: n > 40 ? "Overloaded" : "Watts" };
    }
    if (blob.indexOf(" lb") >= 0 || blob.indexOf("scale") >= 0) {
      if (blob.indexOf("tankweight") >= 0 || (blob.indexOf("scale") >= 0 && String(text).indexOf("/") < 0)) {
        if (n < 0.2) return { tone: "call", bar: 8, tag: "Set the tank" };
        return { tone: "cold", bar: Math.min(88, Math.round(n / 25 * 100)), tag: "Tank weight" };
      }
      if (n >= 5.4 && n <= 6.6) return { tone: "cold", bar: 78, tag: "On the nameplate" };
      if (n > 6.6) return { tone: "line", bar: 96, tag: "Heavy. Shut liquid." };
      return { tone: "call", bar: Math.max(6, Math.round(n / 6 * 100)), tag: n < 0.2 ? "Pick the jug" : "Light of 6.0" };
    }
    if (n < 1) return { tone: "cold", bar: 4, tag: "Near zero" };
    if (n < 40) return { tone: "call", bar: Math.max(8, Math.round(n / 150 * 100)), tag: "24-volt call" };
    return { tone: "line", bar: Math.min(100, Math.round(n / 150 * 100)), tag: "Line voltage" };
  }

  function dress(box, text, unit) {
    if (!box) return;
    var look = toneOf(text, unit);
    var key = look.tone + "|" + look.bar + "|" + look.tag + "|" + text + "|" + unit;
    if (box.getAttribute("data-sf") === key) return;
    box.setAttribute("data-sf", key);
    box.classList.remove("sf-cold", "sf-call", "sf-line", "sf-fuse", "sf-tick");
    if (look.tone) box.classList.add("sf-" + look.tone);
    var bar = box.querySelector(":scope > .sf-bar");
    if (!bar) {
      bar = document.createElement("i");
      bar.className = "sf-bar";
      bar.setAttribute("aria-hidden", "true");
      bar.appendChild(document.createElement("em"));
      box.appendChild(bar);
    }
    var tag = box.querySelector(":scope > .sf-tag");
    if (!tag) {
      tag = document.createElement("small");
      tag.className = "sf-tag";
      box.appendChild(tag);
    }
    bar.firstChild.style.width = look.bar + "%";
    tag.textContent = look.tag;
    void box.offsetWidth;
    box.classList.add("sf-tick");
  }

  function readBox(box) {
    if (!box || box.classList.contains("sf-bar")) return null;
    if (box.classList.contains("sf-face") || box.classList.contains("rc-scale-face")) {
      var strong = box.querySelector("strong");
      if (!strong) return null;
      var em = box.querySelector("em");
      var span = box.querySelector("span");
      return { text: strong.textContent, unit: ((em && em.textContent) || "") + " " + ((span && span.textContent) || "") + (box.getAttribute("data-scale") === "tank" ? " tankweight" : "") };
    }
    if (box.classList.contains("el-lead-lcd") || box.classList.contains("dmm-lcd")) {
      var val = box.querySelector("#vm-val, #el-lcd");
      var unitEl = box.querySelector("#vm-unit, #el-unit");
      if (!val) return null;
      return { text: val.textContent, unit: unitEl ? unitEl.textContent : "" };
    }
    if (box.parentElement && box.parentElement.id === "fn-meters") {
      var s = box.querySelector("strong");
      var lab = box.querySelector("span");
      if (!s) return null;
      return { text: s.textContent, unit: lab ? lab.textContent : "" };
    }
    if (box.parentElement && box.parentElement.classList.contains("ohms-read")) {
      var sp = box.querySelector("span");
      var b = box.querySelector("b");
      if (!sp) return null;
      return { text: sp.textContent, unit: b ? b.textContent : "" };
    }
    return null;
  }

  var painting = false;
  var queued = false;

  function scan(root) {
    if (painting) return;
    painting = true;
    try {
      var scope = root && root.querySelectorAll ? root : document;
      var nodes = scope.querySelectorAll(".el-lead-lcd, .dmm-lcd, .rc-scale-face, .sf-face, #fn-meters > div, .ohms-read > div");
      for (var i = 0; i < nodes.length; i++) {
        var got = readBox(nodes[i]);
        if (got) dress(nodes[i], got.text, got.unit);
      }
    } finally {
      painting = false;
    }
  }

  function queue() {
    if (painting || queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      scan(document);
    });
  }

  function boot() {
    var style = document.getElementById("sf-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "sf-style";
      style.textContent = [
        ".sf-bar{display:block;height:6px;width:100%;margin-top:4px;border-radius:99px;background:#1c2630;overflow:hidden}",
        ".sf-bar em{display:block;height:100%;width:0;background:#8d97a3;transition:width .2s ease}",
        ".sf-tag{display:block;margin-top:2px;font-size:11px;letter-spacing:.02em;color:#cbb892}",
        ".sf-row{display:flex;gap:8px;margin:8px 0}",
        ".sf-face{flex:1;min-width:0;background:#121820;border:1px solid #3d4a58;border-radius:12px;padding:8px 10px}",
        ".sf-face em{display:block;font-style:normal;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#c9a227}",
        ".sf-face strong{display:block;font-size:28px;font-variant-numeric:tabular-nums}",
        ".el-lead-lcd,.dmm-lcd,.rc-scale-face,#fn-meters > div,.ohms-read > div{box-sizing:border-box}",
        ".sf-cold{box-shadow:inset 0 0 0 2px #7eb6d6}",
        ".sf-cold .sf-bar em{background:#7eb6d6}",
        ".sf-cold .sf-tag,.sf-cold strong,.el-lead-lcd.sf-cold #vm-val,.dmm-lcd.sf-cold #el-lcd{color:#9fd0ea}",
        ".sf-call{box-shadow:inset 0 0 0 2px #e08a2c}",
        ".sf-call .sf-bar em{background:#e08a2c}",
        ".sf-call .sf-tag,.sf-call strong,.el-lead-lcd.sf-call #vm-val,.dmm-lcd.sf-call #el-lcd{color:#f0a35a}",
        ".sf-line{box-shadow:inset 0 0 0 2px #e23b4a}",
        ".sf-line .sf-bar em{background:#e23b4a}",
        ".sf-line .sf-tag,.sf-line strong,.el-lead-lcd.sf-line #vm-val,.dmm-lcd.sf-line #el-lcd{color:#ff6b5a}",
        ".sf-fuse{box-shadow:inset 0 0 0 2px #e23b4a;background:#3a1216}",
        ".sf-fuse .sf-bar em{background:#e23b4a}",
        ".sf-fuse .sf-tag,.sf-fuse strong{color:#ff6b5a}",
        ".sf-tick strong,.sf-tick #vm-val,.sf-tick #el-lcd{animation:sf-tick .4s ease}",
        "@keyframes sf-tick{from{transform:scale(1.06);opacity:.45}to{transform:none;opacity:1}}",
        "@keyframes sf-sheen{from{background-position:-40% 0}to{background-position:140% 0}}",
        "@keyframes sf-breathe{0%,100%{filter:brightness(1)}50%{filter:brightness(1.35)}}",
        "@keyframes sf-alarm{50%{filter:brightness(1.6)}}",
        "@keyframes sf-flow{to{stroke-dashoffset:-36}}",
        ".sf-line .sf-bar em,.sf-call .sf-bar em{background-image:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);background-size:40% 100%;background-repeat:no-repeat;animation:sf-sheen 1.3s linear infinite}",
        ".sf-fuse{animation:sf-alarm .45s steps(2) infinite}",
        ".fn-lamp{display:inline-flex;align-items:center;min-height:28px;margin:0 6px 6px 0;padding:4px 8px;border-radius:999px;border:1px solid #3d4a58;color:#8d97a3;font-size:12px}",
        ".fn-lamp.live{color:#f0a35a;border-color:#e08a2c;box-shadow:0 0 0 1px #e08a2c;animation:sf-breathe 1.3s ease-in-out infinite}",
        ".fn-lamp.lock{color:#ff6b5a;border-color:#e23b4a;animation:sf-alarm .5s steps(2) infinite}",
        ".mach-switch.on{animation:sf-breathe 1.4s ease-in-out infinite}",
        ".el-node.live,#el-run.on,#el-24.on{animation:sf-breathe 1.4s ease-in-out infinite}",
        ".ohms-svg .ohms-flow{stroke-dasharray:10 8;animation:sf-flow .7s linear infinite}",
        ".ohms-svg.smoke .ohms-flow{animation-duration:.22s}",
        ".btn.done{animation:sf-tick .35s ease}",
        "@keyframes sf-press{40%{transform:scale(.96)}}",
        "button.sf-press,.btn.sf-press,.mode-card.sf-press,.start-door.sf-press{animation:sf-press .16s ease}",
        "@keyframes sf-ripple{to{transform:scale(4);opacity:0}}",
        "#sf-wash{position:fixed;inset:0;z-index:3;pointer-events:none;opacity:0;transition:opacity .25s ease}",
        "button:not(.btn):not(.mode-card):not(.start-door):not(.bw-lead):not(.el-spool):not([data-hose]):not(.mach-switch){transition:transform .12s ease,box-shadow .12s ease,filter .12s ease,border-color .12s ease}",
        "@media (hover: hover) {button:not(.btn):not(.mode-card):not(.start-door):not(.bw-lead):not(.el-spool):not([data-hose]):not(.mach-switch):hover:not(:disabled){filter:brightness(1.2);border-color:#e8c450;box-shadow:0 4px 12px rgba(0,0,0,.28);transform:translateY(-1px)}}",
        "@media (prefers-reduced-motion:reduce){.sf-tick strong,.sf-tick #vm-val,.sf-tick #el-lcd,.sf-bar em,.sf-line .sf-bar em,.sf-call .sf-bar em,.sf-fuse,.fn-lamp.live,.fn-lamp.lock,.mach-switch.on,.el-node.live,#el-run.on,#el-24.on,.ohms-svg .ohms-flow,.btn.done,button.sf-press,.mode-card.sf-press,.start-door.sf-press,.sf-ripple{animation:none;transition:none}}"
      ].join("");
      document.head.appendChild(style);
    }
    scan(document);
    if (global.MutationObserver && document.body) {
      var obs = new MutationObserver(queue);
      obs.observe(document.body, { subtree: true, childList: true, characterData: true });
    }
    if (document.documentElement.getAttribute("data-sf-press") !== "1") {
      document.documentElement.setAttribute("data-sf-press", "1");
      document.addEventListener("pointerdown", function (e) {
        if (global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        var t = e.target;
        if (!t || !t.closest) return;
        var btn = t.closest("button, .btn, .mode-card, .start-door");
        if (!btn || btn.disabled) return;
        if (btn.classList.contains("mach-switch") || btn.classList.contains("bw-lead") || btn.classList.contains("el-spool") || btn.hasAttribute("data-leadhand") || btn.hasAttribute("data-hose")) {
          /* drag starts here — no scale, still a ring */
        } else {
          btn.classList.remove("sf-press");
          void btn.offsetWidth;
          btn.classList.add("sf-press");
        }
        var ring = document.createElement("i");
        ring.className = "sf-ripple";
        ring.setAttribute("aria-hidden", "true");
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
        document.body.appendChild(ring);
        setTimeout(function () { if (ring.parentNode) ring.parentNode.removeChild(ring); }, 300);
      }, true);
    }
    if (!document.getElementById("sf-wash")) {
      var wash = document.createElement("div");
      wash.id = "sf-wash";
      wash.setAttribute("aria-hidden", "true");
      document.body.appendChild(wash);
      document.addEventListener("pointermove", function (e) {
        if (global.matchMedia && !global.matchMedia("(hover: hover)").matches) return;
        wash.style.opacity = "1";
        wash.style.background = "radial-gradient(circle 220px at " + e.clientX + "px " + e.clientY + "px, rgba(232,196,80,0.16), transparent 68%)";
      }, { passive: true });
      document.addEventListener("pointerleave", function () { wash.style.opacity = "0"; });
    }
  }

  global.ShopFace = { dress: dress, toneOf: toneOf, scan: scan };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
