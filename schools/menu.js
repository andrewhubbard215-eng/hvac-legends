/* One school on each app. Legends does not offer Lincoln Tech. */
(function () {
  var pack = window.SchoolPack;
  if (pack && pack.id === "lincoln") {
    window.SchoolMenu = [
      { id: "lincoln", label: "Lincoln Tech", href: "/allstars/index.html?play=1&sku=campus" },
    ];
    return;
  }
  window.SchoolMenu = [
    { id: "legends", label: "HVAC Legends", href: "/legends/index.html?play=1" },
  ];
})();
