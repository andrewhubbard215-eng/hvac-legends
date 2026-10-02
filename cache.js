/* Offline cache card. Talks to this app's service worker only. */
(function (global) {
  "use strict";

  function html() {
    return (
      '<div class="card" id="cache-card">' +
      "<h3>Offline cache</h3>" +
      "<p>The phone keeps a copy of this app. The other app has its own copy.</p>" +
      '<p id="cache-status">Checking the saved copy…</p>' +
      '<div class="ss-actions">' +
      '<button type="button" class="btn primary" id="cache-refresh">Save for offline</button>' +
      '<button type="button" class="btn" id="cache-clear">Clear this app</button>' +
      "</div></div>"
    );
  }

  function worker(reg) {
    return reg.active || reg.waiting || reg.installing;
  }

  function ask(type) {
    if (!navigator.serviceWorker) return Promise.reject(new Error("no worker"));
    return navigator.serviceWorker.register("sw.js").then(function (reg) {
      reg.update();
      return navigator.serviceWorker.ready;
    }).then(function (reg) {
      var w = worker(reg);
      if (!w) throw new Error("not ready");
      return new Promise(function (resolve) {
        var channel = new MessageChannel();
        var timer = setTimeout(function () { resolve({ type: "timeout" }); }, 5000);
        channel.port1.onmessage = function (ev) {
          clearTimeout(timer);
          resolve(ev.data || { type: "timeout" });
        };
        w.postMessage({ type: type }, [channel.port2]);
      });
    });
  }

  function paint(status, data) {
    if (!data || data.type === "timeout") {
      status.textContent = "The saved copy did not answer. Open the shop floor once, then come back.";
      return;
    }
    status.textContent = data.ver + " · " + data.count + " files on this phone." + (data.note ? " " + data.note : "");
  }

  function mount(root) {
    var box = root.querySelector("#cache-card");
    if (!box) return;
    var status = box.querySelector("#cache-status");
    ask("cache-status").then(function (data) { paint(status, data); }).catch(function () {
      status.textContent = "This browser will not keep an offline copy.";
    });
    box.querySelector("#cache-refresh").onclick = function () {
      status.textContent = "Saving this app…";
      ask("cache-refresh").then(function (data) { paint(status, data); }).catch(function (e) {
        status.textContent = e.message;
      });
    };
    box.querySelector("#cache-clear").onclick = function () {
      status.textContent = "Clearing this app only…";
      ask("cache-clear").then(function (data) { paint(status, data); });
    };
  }

  global.LtCache = { html: html, mount: mount };
})(window);
