/* HVAC Legends Recovery loader — joins recovery.b64.*.txt then evals */
(function () {
  "use strict";
  var N = 5;
  var parts = [];
  var left = N;
  function done() {
    try {
      var bin = atob(parts.join(""));
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var src = new TextDecoder("utf-8").decode(bytes);
      (0, eval)(src);
    } catch (e) {
      console.error("Legends recovery load failed", e);
      var line = document.getElementById("rc-line");
      if (line) line.textContent = "Recovery failed to load — hard refresh.";
    }
  }
  for (var i = 0; i < N; i++) {
    (function (idx) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "recovery.b64." + idx + ".txt", true);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          parts[idx] = xhr.responseText.replace(/\s+/g, "");
        } else {
          parts[idx] = "";
        }
        left--;
        if (left <= 0) done();
      };
      xhr.onerror = function () { parts[idx] = ""; left--; if (left <= 0) done(); };
      xhr.send();
    })(i);
  }
})();
