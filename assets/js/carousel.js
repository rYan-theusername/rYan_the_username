(function () {
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var viewport = root.querySelector(".carousel-viewport");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-carousel-dot]"));
    if (!viewport || !slides.length) return;

    function index() {
      var width = viewport.clientWidth;
      if (!width) return 0;
      return Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / width)));
    }

    function update(i) {
      dots.forEach(function (dot, n) {
        if (n === i) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function go(i) {
      var count = slides.length;
      i = ((i % count) + count) % count;
      viewport.scrollTo({ left: i * viewport.clientWidth, behavior: "smooth" });
      update(i);
    }

    if (prev) prev.addEventListener("click", function () { go(index() - 1); });
    if (next) next.addEventListener("click", function () { go(index() + 1); });
    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () { go(n); });
    });
    viewport.addEventListener("scroll", function () { update(index()); }, { passive: true });
    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index() - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index() + 1);
      }
    });

    update(0);
  });
})();
