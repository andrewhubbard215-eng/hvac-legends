/* Phone a11y: type size, drawer labels. Pinch-zoom is on in the viewport. */
(function () {
  "use strict";
  function apply(size) {
    if (size !== "sm" && size !== "lg") size = "md";
    document.documentElement.classList.remove("type-sm", "type-md", "type-lg");
    document.documentElement.classList.add("type-" + size);
    try { localStorage.setItem("lt-type", size); } catch (_) {}
    document.querySelectorAll("[data-type]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-type") === size ? "true" : "false");
    });
  }
  var start = "md";
  try { start = localStorage.getItem("lt-type") || "md"; } catch (_) {}
  apply(start);
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-type]");
    if (!b) return;
    apply(b.getAttribute("data-type"));
  });
  var floorAnim = 0;
  function easeFloor(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  function scrollFloor(scroller, top) {
    if (floorAnim) cancelAnimationFrame(floorAnim);
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var start = scroller.scrollTop;
    var change = top - start;
    if (reduce || Math.abs(change) < 2) {
      scroller.scrollTop = top;
      return;
    }
    var dur = Math.min(520, Math.max(260, Math.abs(change) * 0.22));
    var t0 = 0;
    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      scroller.scrollTop = start + change * easeFloor(p);
      if (p < 1) floorAnim = requestAnimationFrame(step);
      else floorAnim = 0;
    }
    floorAnim = requestAnimationFrame(step);
  }
  document.addEventListener("click", function (e) {
    var jump = e.target && e.target.closest && e.target.closest("[data-floor]");
    if (!jump) return;
    var dest = document.getElementById(jump.getAttribute("data-floor"));
    var scroller = document.getElementById("screen-hub");
    if (!dest || !scroller) return;
    var grid = document.getElementById("hub-options");
    if (grid && grid.hidden && grid.contains(dest)) {
      grid.hidden = false;
      var moreOpen = document.getElementById("hub-more");
      if (moreOpen) {
        moreOpen.textContent = "Hide labs";
        moreOpen.setAttribute("aria-expanded", "true");
      }
    }
    var nav = scroller.querySelector(".floor-tools") || scroller.querySelector(".floor-nav");
    var navH = nav ? nav.offsetHeight : 0;
    var top = dest.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - navH - 6;
    scrollFloor(scroller, Math.max(0, top));
    if (nav) {
      nav.querySelectorAll("[data-floor]").forEach(function (b) {
        b.setAttribute("aria-current", b === jump ? "true" : "false");
      });
    }
  });
  window.LtA11y = { apply: apply };

  document.addEventListener("click", function (e) {
    var moreBtn = e.target && e.target.closest && e.target.closest("#hub-more");
    if (!moreBtn) return;
    var grid = document.getElementById("hub-options");
    if (!grid) return;
    grid.hidden = !grid.hidden;
    var open = !grid.hidden;
    moreBtn.textContent = open ? "Hide labs" : "All labs";
    moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) return;
    var scroller = document.getElementById("screen-hub");
    if (!scroller) return;
    var nav = scroller.querySelector(".floor-tools");
    var navH = nav ? nav.offsetHeight : 0;
    var top = grid.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - navH - 6;
    scrollFloor(scroller, Math.max(0, top));
  });

  var TECH_KEY = "lt-tech-step";
  function techSteps() {
    return Array.prototype.slice.call(document.querySelectorAll("#floor-tech [data-tech]"));
  }
  function techAt() {
    var n = 0;
    try { n = parseInt(localStorage.getItem(TECH_KEY) || "0", 10) || 0; } catch (_) {}
    return n < 0 ? 0 : n;
  }
  function paintTech() {
    var steps = techSteps();
    if (!steps.length) return;
    var at = techAt();
    if (at > steps.length) at = steps.length;
    steps.forEach(function (b, i) {
      b.classList.toggle("is-done", i < at);
      b.classList.toggle("is-now", i === at);
      b.setAttribute("aria-current", i === at ? "step" : "false");
    });
    var lead = document.querySelector("#floor-tech .tech-lead");
    if (!lead) return;
    if (at >= steps.length) lead.textContent = "Job done. Tap any step to run it again.";
    else {
      var name = (steps[at].querySelector("b") || steps[at]).textContent.replace(/^\d+\s·\s/, "");
      lead.textContent = "You're on " + name + ".";
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("#floor-tech [data-tech]");
    if (!b) return;
    var steps = techSteps();
    var i = steps.indexOf(b);
    if (i !== techAt()) return;
    try { localStorage.setItem(TECH_KEY, String(Math.min(steps.length, i + 1))); } catch (_) {}
    paintTech();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintTech);
  else paintTech();

  function bindMenu() {
    var btn = document.getElementById("hub-menu");
    var panel = document.getElementById("hub-actions");
    if (!btn || !panel) return;
    var backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "hub-menu-backdrop";
    backdrop.hidden = true;
    backdrop.setAttribute("aria-label", "Close menu");
    document.body.appendChild(backdrop);
    function setOpen(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      backdrop.hidden = !open;
    }
    btn.addEventListener("click", function () { setOpen(panel.hidden); });
    backdrop.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
    panel.addEventListener("click", function (e) {
      var hit = e.target.closest("a, button");
      if (!hit || hit.hasAttribute("data-type")) return;
      setOpen(false);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindMenu);
  else bindMenu();

  var searchForced = false;
  function bindSearch() {
    var input = document.getElementById("floor-search");
    var empty = document.getElementById("floor-search-empty");
    if (!input) return;
    function markHeads(grid) {
      var nodes = grid.children;
      for (var i = 0; i < nodes.length; i++) {
        var h = nodes[i];
        if (!h.classList.contains("hub-section")) continue;
        var show = false;
        for (var j = i + 1; j < nodes.length; j++) {
          if (nodes[j].classList.contains("hub-section")) break;
          if (!nodes[j].classList.contains("search-miss")) show = true;
        }
        h.classList.toggle("search-miss", !show);
      }
    }
    function run() {
      var q = input.value.trim().toLowerCase();
      var grid = document.getElementById("hub-options");
      var more = document.getElementById("hub-more");
      var hits = 0;
      document.querySelectorAll("#screen-hub .shop-bay, #screen-hub .start-door, #screen-hub .mode-card").forEach(function (el) {
        var miss = !!q && (el.innerText || "").toLowerCase().indexOf(q) === -1;
        el.classList.toggle("search-miss", miss);
        if (!miss) hits++;
      });
      document.querySelectorAll("#screen-hub .shop-floor, #screen-hub .floor-start").forEach(function (sec) {
        var any = sec.querySelector(".shop-bay:not(.search-miss), .start-door:not(.search-miss)");
        sec.classList.toggle("search-miss", !!q && !any);
      });
      if (grid) {
        if (q) {
          if (grid.hidden) searchForced = true;
          grid.hidden = false;
          markHeads(grid);
        } else {
          document.querySelectorAll("#screen-hub .search-miss").forEach(function (el) {
            el.classList.remove("search-miss");
          });
          if (searchForced) {
            grid.hidden = true;
            searchForced = false;
            if (more) {
              more.textContent = "All labs";
              more.setAttribute("aria-expanded", "false");
            }
          }
        }
      }
      if (empty) empty.hidden = !q || hits > 0;
    }
    input.addEventListener("input", run);
  }
  function bindSchool() {
    if (/appassets\.androidplatform\.net/i.test(location.hostname || "")) {
      document.querySelectorAll(".preview-switch").forEach(function (n) { n.remove(); });
    }
    var sel = document.getElementById("school-switch");
    var list = window.SchoolMenu || [];
    if (!sel || !list.length) return;
    var current = (window.SchoolPack && window.SchoolPack.id) || "";
    sel.innerHTML = list.map(function (s) {
      var on = s.id === current ? " selected" : "";
      return '<option value="' + s.href + '"' + on + ">" + s.label + "</option>";
    }).join("");
    sel.addEventListener("change", function () {
      if (sel.value) location.href = sel.value;
    });
    if (list.length < 2) {
      var wrap = sel.closest(".school-switch");
      if (wrap) wrap.hidden = true;
    }
    document.querySelectorAll("[data-school]").forEach(function (el) {
      var id = el.getAttribute("data-school");
      var on = list.some(function (s) { return s.id === id; });
      el.hidden = !on;
      el.classList.toggle("search-miss", !on);
    });
    var app = document.documentElement.getAttribute("data-app");
    document.querySelectorAll("[data-preview]").forEach(function (a) {
      a.setAttribute("aria-current", a.getAttribute("data-preview") === app ? "true" : "false");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindSearch);
  else bindSearch();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindSchool);
  else bindSchool();
  if (!document.getElementById("phone-floor-nav")) {
    var st = document.createElement("style");
    st.id = "phone-floor-nav";
    st.textContent = "#screen-hub .floor-nav{flex-wrap:wrap!important;overflow:visible!important;padding:6px 10px!important;gap:6px!important}#screen-hub .floor-nav button{flex:1 1 calc(33% - 8px)!important;min-width:0!important;max-width:calc(33.33% - 4px)!important;min-height:44px!important;padding:8px 6px!important;font-size:15px!important}";
    document.head.appendChild(st);
  }
})();
