(function () {
  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("hidden", "");

  var img = document.createElement("img");
  img.alt = "";
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    img.removeAttribute("src");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (event) {
    if (event.target === overlay || event.target === img) {
      close();
      return;
    }

    var target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (!target.closest("main")) return;

    event.preventDefault();
    open(target.currentSrc || target.src, target.alt);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();
