(function () {
  var demos = document.querySelectorAll("[data-sharp-demo]");
  if (!demos.length) return;

  demos.forEach(function (root) {
    var blur = "9";
    var first = false;
    var base = root.getAttribute("data-base") || "";
    if (base.slice(-1) !== "/") base += "/";

    function apply() {
      var prefix = first ? "blurredfirst_" : "";
      root.querySelectorAll("[data-sharp-file]").forEach(function (img) {
        var file = img.getAttribute("data-sharp-file")
          .replace(/\{p\}/g, prefix)
          .replace(/\{b\}/g, blur);
        img.src = base + file;
      });
      root.querySelectorAll("[data-sharp-blur]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-sharp-blur") === blur ? "true" : "false");
      });
      root.querySelectorAll("[data-sharp-first]").forEach(function (btn) {
        var on = btn.getAttribute("data-sharp-first") === "1";
        btn.setAttribute("aria-pressed", on === first ? "true" : "false");
      });
    }

    root.querySelectorAll("[data-sharp-blur]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        blur = btn.getAttribute("data-sharp-blur");
        apply();
      });
    });
    root.querySelectorAll("[data-sharp-first]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        first = btn.getAttribute("data-sharp-first") === "1";
        apply();
      });
    });
  });
})();
