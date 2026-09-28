(function () {
  document.querySelectorAll("[data-hybrid-demo]").forEach(function (root) {
    var far = false;
    var out = parseFloat(root.getAttribute("data-hybrid-out"));
    if (!(out > 0)) out = 8;
    var scale = 1 / out;

    function apply() {
      root.classList.toggle("is-far", far);
      root.querySelectorAll(".hybrid-result img").forEach(function (img) {
        img.style.transform = far ? "scale(" + scale + ")" : "";
      });
      root.querySelectorAll("[data-hybrid-zoom]").forEach(function (btn) {
        var isFar = btn.getAttribute("data-hybrid-zoom") === "out";
        btn.setAttribute("aria-pressed", isFar === far ? "true" : "false");
      });
    }

    root.querySelectorAll("[data-hybrid-zoom]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        far = btn.getAttribute("data-hybrid-zoom") === "out";
        apply();
      });
    });
  });
})();
