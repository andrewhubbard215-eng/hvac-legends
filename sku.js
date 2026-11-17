/* Dual SKU: campus (Lincoln Tech, default) vs store (unbranded HVAC Allstars).
   ?sku=store | ?sku=campus  — also persisted. Store hostnames force store. */
(function (global) {
  "use strict";
  var params = new URLSearchParams(location.search);
  var saved = "";
  try {
    saved = localStorage.getItem("lt-sku") || "";
  } catch (_) {}
  var host = (location.hostname || "").toLowerCase();
  var sku = "campus";
  if (/hvacallstars\.(app|com|net)|play\.google/.test(host)) sku = "store";
  if (saved === "store" || saved === "campus") sku = saved;
  var q = (params.get("sku") || params.get("edition") || "").toLowerCase();
  if (q === "store" || q === "campus") {
    sku = q;
    try {
      localStorage.setItem("lt-sku", sku);
    } catch (_) {}
  }

  var isStore = sku === "store";
  var brand = {
    sku: sku,
    isStore: isStore,
    org: isStore ? "HVAC Allstars" : "Lincoln Tech",
    title: isStore ? "HVAC Allstars" : "Lincoln Tech HVAC Allstars",
    mark: isStore ? "HA" : "LT",
    exam: isStore ? "EPA 608 · OSHA 30 · shop curriculum" : "EPA 608 · OSHA 30 · Lincoln Tech",
    school: isStore ? "trade school" : "Lincoln Tech",
    roof: isStore ? "Rooftop · the heavens open" : "Lincoln Tech roof · the heavens open",
    packCurriculum: isStore ? "Shop curriculum" : "Lincoln Tech",
  };

  var pack = global.SchoolPack || null;
  if (pack) {
    if (pack.org) brand.org = pack.org;
    if (pack.title) brand.title = pack.title;
    if (pack.mark) brand.mark = pack.mark;
    if (pack.exam) brand.exam = pack.exam;
    if (pack.school) brand.school = pack.school;
    if (pack.roof) brand.roof = pack.roof;
    if (pack.packCurriculum) brand.packCurriculum = pack.packCurriculum;
    if (pack.unbranded) {
      brand.isStore = true;
      brand.sku = "store";
      isStore = true;
    }
  }

  var doc = document.documentElement;
  doc.setAttribute("data-sku", brand.sku);
  var pathName = location.pathname || "";
  var baseHref = "";
  try {
    var baseEl = document.querySelector("base");
    baseHref = (baseEl && baseEl.getAttribute("href")) || "";
  } catch (_) {}
  var isLegends = !!(pack && pack.id === "legends");
  if (pack && pack.id === "lincoln") isLegends = false;
  if (/\/allstars(\/|$)/.test(pathName)) isLegends = false;
  doc.setAttribute("data-app", isLegends ? "legends" : "allstars");
  brand.trainer = isLegends ? "Hubconnect" : "iConnect";
  doc.classList.toggle("sku-store", brand.isStore);
  doc.classList.toggle("sku-campus", !brand.isStore);

  var DESK_TOKEN = "instructor";
  var deskKey = "lt-desk-pass-" + ((pack && pack.id) || "lincoln");
  function deskPass() {
    var ok = false;
    try {
      if (localStorage.getItem("lt-desk-owner") === "1") ok = true;
      if (localStorage.getItem("hvac-legends-code") === "FALCON1") ok = true;
      if (params.get("desk") === DESK_TOKEN) {
        localStorage.setItem(deskKey, "1");
        ok = true;
      } else if (localStorage.getItem(deskKey) === "1") ok = true;
      else if (pack && pack.id === "lincoln" && localStorage.getItem("lt-desk-pass-allstars") === "1") ok = true;
    } catch (_) {}
    if (pack && pack.id === "lincoln") ok = true;
    if (pack && pack.id === "legends") ok = true;
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
        brand.title + " — vocational HVAC trainer. Recovery, charging, electrical, the system sandbox, and EPA 608."
      );
    }
    var apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute("content", isStore ? "HVAC Allstars" : "HVAC Allstars");
    document.querySelectorAll(".brand-mark").forEach(function (el) {
      el.textContent = brand.mark;
    });
    document.querySelectorAll(".brand-word strong").forEach(function (el) {
      el.textContent = brand.org.toUpperCase();
    });
    var deskLink = document.getElementById("btn-shopschool");
    var deskHead = document.getElementById("hub-desk");
    var deskBay = document.getElementById("floor-desk");
    [deskLink, deskHead, deskBay].forEach(function (el) {
      if (!el) return;
      var lincoln = (pack && pack.id === "lincoln") || /\/allstars(\/|$)/.test(pathName);
      var deskHref = lincoln
        ? "/allstars/desk.html?sku=campus&desk=" + DESK_TOKEN
        : "/legends/desk.html?sku=" + encodeURIComponent(sku) + "&desk=" + DESK_TOKEN;
      el.setAttribute("href", deskHref);
      el.hidden = !deskOk;
      if (deskOk) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    });
    var tip = document.querySelector("#hub-tip p");
    if (tip && !deskOk) {
      tip.textContent = "Shop floor is the map. Manifold school is hookup and superheat. Sandbox is a live system. Pick a lab.";
    }
    var kick = document.getElementById("cut-kicker");
    if (kick) kick.textContent = brand.roof;
    if (pack && pack.wordmark) {
      var h1 = document.querySelector(".title-hero h1");
      if (h1) h1.innerHTML = pack.wordmark;
    }
    if (pack && pack.eyebrow) {
      var eye = document.querySelector(".title-hero .eyebrow");
      if (eye) eye.textContent = pack.eyebrow;
    }
    if (!isStore) return;
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
