// ============================================================
// Óscar Arés Martínez — Portfolio
// JavaScript vanilla, sin dependencias.
// ============================================================

(function () {
  "use strict";

  // ---- Menú móvil ----
  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("navMobile");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Cierra el menú móvil al pulsar un enlace
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Revelado suave de secciones al hacer scroll ----
  var animatedEls = document.querySelectorAll(
    ".fit-card, .proj-card, .timeline__item, .edu-group, .fact"
  );

  if ("IntersectionObserver" in window && animatedEls.length) {
    animatedEls.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
