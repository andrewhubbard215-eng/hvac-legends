/* See Inside TXV. Matches the cutaway: bulb, capillary, diaphragm, pin, strainer, spring, stem, equalizer. */
(function () {
  function scene() {
    var root = document.getElementById("cutaway-root");
    if (!root) return;
    if (document.getElementById("txv-match")) return;
    var wrap = document.createElement("div");
    wrap.id = "txv-match";
    wrap.style.cssText = "margin:8px;background:#10161c;border:1px solid #8a6a10;border-radius:12px;padding:8px;color:#f3e2b0;";
    wrap.innerHTML = '<p style="margin:0 0 6px;font-weight:700">TXV · same parts as the cutaway</p>' +
      '<svg viewBox="0 0 640 280" width="100%" style="background:#0c1218;border-radius:8px">' +
      '<text x="16" y="22" fill="#f3e2b0" font-size="14">Liquid in stops at the pin. Flash is born at the seat.</text>' +
      '<rect x="40" y="118" width="150" height="28" rx="8" fill="#c44e52"/>' +
      '<text x="52" y="136" fill="#fff" font-size="11">Liquid from condenser</text>' +
      '<rect x="168" y="122" width="36" height="20" fill="#b08a4a"/>' +
      '<text x="150" y="112" fill="#e8c450" font-size="11">Strainer</text>' +
      '<rect x="250" y="70" width="150" height="110" rx="10" fill="none" stroke="#c4a574" stroke-width="3"/>' +
      '<path d="M270 92 h110 q-16 22 -55 22 q-40 0 -55 -22z" fill="#d5dee6"/>' +
      '<text x="268" y="64" fill="#d5dee6" font-size="11">Diaphragm</text>' +
      '<rect id="txv-pin" x="316" y="112" width="10" height="46" fill="#e8c450"/>' +
      '<text x="332" y="140" fill="#e8c450" font-size="11">Pin</text>' +
      '<path d="M300 168 q20 28 -8 40" fill="none" stroke="#c5ced6" stroke-width="3"/>' +
      '<text x="250" y="198" fill="#c5ced6" font-size="11">Spring</text>' +
      '<rect x="308" y="188" width="26" height="10" fill="#9aa"/>' +
      '<text x="248" y="214" fill="#c5ced6" font-size="11">Stem in raises superheat</text>' +
      '<circle id="txv-flash" cx="430" cy="132" r="7" fill="#3aa0e0"/>' +
      '<rect x="410" y="122" width="150" height="22" rx="8" fill="#1d4e73"/>' +
      '<text x="424" y="137" fill="#d6f1ff" font-size="11">Flash stays in outlet</text>' +
      '<path d="M470 144 v40 h-20" fill="none" stroke="#4cc9f0" stroke-width="3"/>' +
      '<text x="490" y="176" fill="#4cc9f0" font-size="11">External equalizer</text>' +
      '<path d="M360 78 C460 40 520 70 540 110" fill="none" stroke="#b87333" stroke-width="3"/>' +
      '<rect x="528" y="108" width="18" height="40" rx="6" fill="#c47a3a"/>' +
      '<text x="552" y="128" fill="#e8c450" font-size="11">Bulb on suction line</text>' +
      '</svg>' +
      '<p style="margin:6px 0 0;font-size:13px">High superheat: bulb pressure pushes the diaphragm, pin opens, more liquid. Low superheat: spring closes the pin. Nothing leaves the power head.</p>';
    root.insertBefore(wrap, root.firstChild);
    var pin = document.getElementById("txv-pin");
    var flash = document.getElementById("txv-flash");
    var open = false;
    setInterval(function () {
      open = !open;
      if (pin) pin.setAttribute("height", open ? "28" : "46");
      if (flash) flash.setAttribute("r", open ? "9" : "3");
    }, 1600);
  }
  setInterval(scene, 800);
})();
