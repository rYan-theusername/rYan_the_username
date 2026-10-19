(function () {
  document.querySelectorAll("[data-flip-demo]").forEach(function (root) {
    var flipped = false;

    function apply() {
      root.classList.toggle("is-flipped", flipped);
      root.querySelectorAll(".flip-result img").forEach(function (img) {
        img.style.transform = flipped ? "rotate(180deg)" : "";
      });
      root.querySelectorAll("[data-flip]").forEach(function (btn) {
        var isDown = btn.getAttribute("data-flip") === "down";
        btn.setAttribute("aria-pressed", isDown === flipped ? "true" : "false");
      });
      var caption = root.querySelector(".flip-result figcaption");
      if (caption) {
        var next = root.getAttribute(flipped ? "data-caption-down" : "data-caption-up");
        if (next) caption.textContent = next;
      }
    }

    root.querySelectorAll("[data-flip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        flipped = btn.getAttribute("data-flip") === "down";
        apply();
      });
    });
  });
})();
