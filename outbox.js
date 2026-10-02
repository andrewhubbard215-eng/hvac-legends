/* Write on this phone first. Send when the network is back. A 400 is a real rejection and is not kept. */
(function (global) {
  "use strict";
  var KEY = "lt-outbox-v1";
  var sending = false;

  function load() {
    try {
      var rows = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      return [];
    }
  }

  function save(rows) {
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-80)));
  }

  function post(url, body) {
    return fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) {
          var err = new Error(j.error || "Not saved");
          err.status = r.status;
          throw err;
        }
        return j;
      });
    });
  }

  function send(url, body) {
    return post(url, body).catch(function (err) {
      if (err && err.status && err.status < 500) throw err;
      var rows = load();
      rows.push({ id: Date.now() + "-" + rows.length, url: url, body: body });
      save(rows);
      return { queued: true };
    });
  }

  function flush() {
    if (sending) return Promise.resolve(load().length);
    var rows = load();
    if (!rows.length) return Promise.resolve(0);
    sending = true;
    var left = [];
    var chain = Promise.resolve();
    rows.forEach(function (item) {
      chain = chain.then(function () {
        return post(item.url, item.body).catch(function (err) {
          if (!(err && err.status && err.status < 500)) left.push(item);
        });
      });
    });
    return chain.then(function () {
      save(left);
      sending = false;
      try {
        global.dispatchEvent(new CustomEvent("lt-outbox-flushed"));
      } catch (e) {}
      return left.length;
    });
  }

  global.LtOutbox = { send: send, flush: flush, waiting: function () { return load().length; } };
  global.addEventListener("online", flush);
  if (document.readyState === "complete") flush();
  else global.addEventListener("load", flush);
})(window);
