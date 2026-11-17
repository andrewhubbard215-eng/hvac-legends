/* Real copy. The test clock is off. The floor does not close. */
(function () {
  function paint() {
    var old = document.getElementById("demo-clock");
    if (old) old.remove();
    document.documentElement.classList.remove("demo-closed");
  }
  if (document.body) paint();
  else document.addEventListener("DOMContentLoaded", paint);
})();