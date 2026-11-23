/* HVAC diagnostic flowcharts. Phone-first. Air first. Prove then buy. */
(function (global) {
  "use strict";

  const TREES = [
    {
      id: "nocoool",
      title: "No cool",
      first: "Is air moving across the coil?",
      steps: [
        { q: "Is air moving? Filter clear? Blower running?", yes: "Go to gauges.", no: "Clean the filter. Prove the wheel. Clear the coil. Do not add gas." }
      ]
    },
    {
      id: "shsc",
      title: "Superheat and subcooling",
      first: "Do the two numbers agree?",
      steps: [
        { q: "High SH + Low SC?", yes: "Low charge. Find the leak. Do not top off.", no: "Check next." },
        { q: "High SH + High SC?", yes: "Restriction. Temperature drop across the drier. Do not add gas.", no: "Check next." }
      ]
    }
  ];

  function start(root) {
    if (!root) return;
    root.innerHTML = "<h2>Diagnostic flowcharts</h2><p>Air first. Then the numbers. Then the part.</p>" +
      TREES.map(function (t) {
        return "<button class=\"btn\" data-tree=\"" + t.id + "\">" + t.title + "</button><p>" + t.first + "</p>";
      }).join("");
  }

  global.Flowcharts = { start: start };
})(window);
