/* HVAC Legends — duplicate of the trainer. No Lincoln name, no HCR catalog. */
(function (global) {
  "use strict";
  var params = new URLSearchParams(location.search);
  var sku = "store";
  var isStore = true;
  var brand = {
    sku: sku,
    isStore: isStore,
    org: "HVAC Legends",
    title: "HVAC Legends",
    mark: "HL",
    exam: "EPA 608 · OSHA 30 · shop curriculum",
    school: "the shop",
    roof: "Rooftop · the heavens open",
    packCurriculum: "Shop curriculum",
  };

  var doc = document.documentElement;
  doc.setAttribute("data-sku", sku);
  doc.setAttribute("data-app", "legends");
  doc.classList.toggle("sku-store", isStore);
  doc.classList.toggle("sku-campus", !isStore);

  var DESK_TOKEN = "instructor";
  function deskPass() {
    var ok = false;
    try {
      if (params.get("desk") === DESK_TOKEN) {
        localStorage.setItem("lt-desk-pass-legends", "1");
        ok = true;
      } else {
        ok = localStorage.getItem("lt-desk-pass-legends") === "1";
      }
    } catch (_) {}
    return ok;
  }
  var deskOk = deskPass();
  brand.desk = deskOk;

  function applyHead() {
    document.title = /desk\.html$/i.test(location.pathname) ? "Instructor Desk · " + brand.title : brand.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        isStore
          ? "HVAC Legends — daily vocational trainer. EPA 608, OSHA 30, electrical box, DX sandbox, Professor HUB."
          : "HVAC Legends — daily vocational trainer. EPA 608, OSHA 30, electrical box, DX sandbox, Professor HUB."
      );
    }
    var apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute("content", "HVAC Legends");
    document.querySelectorAll(".brand-mark").forEach(function (el) {
      el.textContent = brand.mark;
    });
    var deskLink = document.getElementById("btn-shopschool");
    var deskHead = document.getElementById("hub-desk");
    [deskLink, deskHead].forEach(function (el) {
      if (!el) return;
      el.setAttribute("href", "desk.html?desk=instructor");
    });
    var kick = document.getElementById("cut-kicker");
    if (kick) kick.textContent = brand.roof;
    var other = document.querySelector('#campus option[value="other"]');
    if (other) other.textContent = "Other shop";
  }

  function t(campus, store) {
    return isStore ? store : campus;
  }

  global.LtBrand = brand;
  global.LtBrand.t = t;

  /* Phone vs PC classroom bench. ?form=pc | ?form=phone  — persisted. */
  var formQ = (params.get("form") || params.get("layout") || "").toLowerCase();
  if (params.get("pc") === "1") formQ = "pc";
  var formSaved = "";
  try {
    formSaved = localStorage.getItem("lt-form") || "";
  } catch (_) {}
  var inPreview = false;
  try {
    inPreview = !!(window.parent && window.parent !== window);
  } catch (_) {}
  var form = "phone";
  if (formQ === "pc" || formQ === "phone") {
    form = formQ;
    try {
      localStorage.setItem("lt-form", form);
    } catch (_) {}
  } else if (inPreview && formQ !== "pc") {
    form = "phone";
  } else if (formSaved === "pc" || formSaved === "phone") {
    form = formSaved;
  } else if (!inPreview && window.matchMedia && window.matchMedia("(min-width: 1100px) and (pointer: fine)").matches) {
    form = "pc";
  }
  doc.setAttribute("data-form", form);
  doc.classList.toggle("form-pc", form === "pc");
  doc.classList.toggle("form-phone", form !== "pc");
  brand.form = form;
  brand.isPc = form === "pc";

  function applyPcScale() {
    if (form !== "pc") {
      doc.removeAttribute("data-pc-scale");
      doc.style.removeProperty("--pc-zoom");
      return;
    }
    var w = window.innerWidth || 390;
    if (w < 1280) {
      var z = Math.max(0.22, Math.min(1, w / 1440));
      doc.setAttribute("data-pc-scale", "1");
      doc.style.setProperty("--pc-zoom", String(z));
    } else {
      doc.removeAttribute("data-pc-scale");
      doc.style.removeProperty("--pc-zoom");
    }
  }
  applyPcScale();
  window.addEventListener("resize", applyPcScale);

  function paintFormBadge() {
    var el = document.getElementById("form-badge");
    if (!el) {
      el = document.createElement("div");
      el.id = "form-badge";
      el.setAttribute("role", "status");
      (document.body || doc).appendChild(el);
    }
    var isPc = form === "pc";
    var open = false;
    try {
      open = localStorage.getItem("lt-form-badge") === "open";
    } catch (_) {}
    el.className = "form-badge " + (isPc ? "pc" : "phone") + (open ? " open" : " mini");
    el.innerHTML =
      '<button type="button" class="form-badge-tag" id="form-badge-tag" title="Preview layout">' +
      '<span class="form-badge-dot" aria-hidden="true"></span>' +
      "<strong>" +
      (isPc ? "PC" : "PHONE") +
      "</strong>" +
      "</button>" +
      '<div class="form-badge-extra">' +
      "<em>" +
      (isPc ? "classroom bench" : "phone glass") +
      "</em>" +
      '<button type="button" id="form-badge-switch">' +
      (isPc ? "Switch to phone" : "Switch to PC") +
      "</button>" +
      '<button type="button" class="form-badge-x" id="form-badge-close" aria-label="Hide switch">×</button>' +
      "</div>";
    var tag = document.getElementById("form-badge-tag");
    if (tag) {
      tag.onclick = function () {
        try {
          localStorage.setItem("lt-form-badge", "open");
        } catch (_) {}
        paintFormBadge();
      };
    }
    var close = document.getElementById("form-badge-close");
    if (close) {
      close.onclick = function (ev) {
        if (ev) ev.stopPropagation();
        try {
          localStorage.setItem("lt-form-badge", "mini");
        } catch (_) {}
        paintFormBadge();
      };
    }
    var btn = document.getElementById("form-badge-switch");
    if (btn) {
      btn.onclick = function (ev) {
        if (ev) ev.stopPropagation();
        global.LtForm.set(isPc ? "phone" : "pc");
      };
    }
  }

  global.LtForm = {
    value: form,
    isPc: form === "pc",
    set: function (next) {
      var v = next === "pc" ? "pc" : "phone";
      try {
        localStorage.setItem("lt-form", v);
      } catch (_) {}
      var u = new URL(location.href);
      u.searchParams.set("form", v);
      location.replace(u.toString());
    },
  };

  function bootUi() {
    applyHead();
    paintFormBadge();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootUi);
  } else {
    bootUi();
  }
})(window);
