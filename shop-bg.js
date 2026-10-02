/* Host for shop.worker.js — gauges keep ticking while the worker logs trend. */
(function (global) {
  "use strict";
  let worker = null;
  let seq = 1;
  const wait = new Map();

  function boot() {
    if (typeof Worker === "undefined") return;
    try {
      worker = new Worker("shop.worker.js?v=1");
      worker.onmessage = function (e) {
        const d = e.data;
        if (!d) return;
        if (d.id && wait.has(d.id)) {
          const fn = wait.get(d.id);
          wait.delete(d.id);
          fn(d);
        }
        if (d.type === "trend" && typeof global.__shopTrend === "function") {
          global.__shopTrend(d.spark);
        }
      };
      worker.onerror = function () {
        worker = null;
      };
    } catch (_) {
      worker = null;
    }
  }
  boot();

  global.ShopBg = {
    live: function () {
      return !!worker;
    },
    post: function (type, payload) {
      return new Promise(function (resolve) {
        if (!worker) {
          resolve(null);
          return;
        }
        const id = seq++;
        const t = setTimeout(function () {
          if (wait.has(id)) {
            wait.delete(id);
            resolve(null);
          }
        }, 400);
        wait.set(id, function (d) {
          clearTimeout(t);
          resolve(d);
        });
        worker.postMessage({ id: id, type: type, payload: payload || {} });
      });
    },
    trend: function (sample) {
      if (!worker) return;
      worker.postMessage({ id: 0, type: "trend", payload: sample || {} });
    },
    reset: function () {
      if (!worker) return;
      worker.postMessage({ id: 0, type: "reset" });
    },
  };
})(window);
