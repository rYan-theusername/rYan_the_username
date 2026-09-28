(function () {
  document.querySelectorAll("[data-blend-demo]").forEach(function (root) {
    var current = null;
    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-blend-choice]"));
    buttons.forEach(function (btn) {
      if (btn.getAttribute("aria-pressed") === "true" && !btn.disabled) {
        current = btn.getAttribute("data-blend-choice");
      }
    });
    if (!current) {
      var first = buttons.find(function (btn) { return !btn.disabled; });
      current = first ? first.getAttribute("data-blend-choice") : null;
    }

    function apply() {
      root.querySelectorAll("[data-blend-panel]").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-blend-panel") !== current;
      });
      buttons.forEach(function (btn) {
        var on = btn.getAttribute("data-blend-choice") === current;
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        current = btn.getAttribute("data-blend-choice");
        apply();
      });
    });

    apply();
  });
})();
