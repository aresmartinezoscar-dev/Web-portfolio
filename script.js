// ============================================================
// Óscar Arés Martínez — Portfolio
// JavaScript vanilla, sin dependencias.
// ============================================================

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1) MENÚ MÓVIL
  --------------------------------------------------------- */
  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("navMobile");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------
     2) MAPA DE RUTA
     Genera un trazado serpenteante que conecta cada sección,
     como una canalización que atraviesa "estaciones". El propio
     trazado y los puntos se calculan a partir de las mismas
     coordenadas, para que dibujo y navegación queden alineados.
  --------------------------------------------------------- */
  var VB_W = 120, VB_H = 900;
  var stations = [
    { x: 60,  y: 20,  label: "Inicio",         target: "#top" },
    { x: 18,  y: 135, label: "Especialización", target: "#especializacion" },
    { x: 100, y: 250, label: "Proyectos",       target: "#proyectos" },
    { x: 18,  y: 365, label: "Experiencia",     target: "#experiencia" },
    { x: 100, y: 480, label: "Formación",       target: "#formacion" },
    { x: 18,  y: 595, label: "Tecnologías",     target: "#tecnologias" },
    { x: 100, y: 710, label: "Sobre mí",        target: "#sobre-mi" },
    { x: 60,  y: 825, label: "Contacto",        target: "#contacto" }
  ];

  function buildPathD(points) {
    var d = "M" + points[0].x + "," + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var prev = points[i - 1], cur = points[i];
      var midY = (prev.y + cur.y) / 2;
      d += " C " + prev.x + "," + midY + " " + cur.x + "," + midY + " " + cur.x + "," + cur.y;
    }
    return d;
  }

  var routeTrack = document.getElementById("routeTrack");
  var routeProgress = document.getElementById("routeProgress");
  var routeStopsWrap = document.getElementById("routeStops");
  var routeLength = 0;

  if (routeTrack && routeProgress && routeStopsWrap) {
    var d = buildPathD(stations);
    routeTrack.setAttribute("d", d);
    routeProgress.setAttribute("d", d);
    routeLength = routeProgress.getTotalLength ? routeProgress.getTotalLength() : 1200;
    routeProgress.style.strokeDasharray = routeLength;
    routeProgress.style.strokeDashoffset = routeLength;

    stations.forEach(function (s) {
      var btn = document.createElement("button");
      btn.className = "route__stop";
      btn.style.left = (s.x / VB_W * 100) + "%";
      btn.style.top = (s.y / VB_H * 100) + "%";
      btn.setAttribute("data-target", s.target);
      btn.setAttribute("aria-label", "Ir a " + s.label);
      btn.innerHTML = '<span class="route__dot"></span><span class="route__label">' + s.label + "</span>";
      btn.addEventListener("click", function () {
        var el = document.querySelector(s.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      routeStopsWrap.appendChild(btn);
    });
  }

  var progressFill = document.querySelector("#progressBar span");

  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

    if (routeProgress && routeLength) {
      routeProgress.style.strokeDashoffset = routeLength * (1 - ratio);
    }
    if (progressFill) {
      progressFill.style.width = (ratio * 100) + "%";
    }
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------------------------------------------------------
     3) ESTACIÓN ACTIVA EN EL MAPA
  --------------------------------------------------------- */
  var routeStopButtons = document.querySelectorAll(".route__stop");
  var trackedSections = document.querySelectorAll("main > section, main#top");

  if (routeStopButtons.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = "#" + entry.target.id;
            if (!entry.target.id) id = "#top";
            routeStopButtons.forEach(function (btn) {
              btn.classList.toggle("is-active", btn.getAttribute("data-target") === id);
            });
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" }
    );

    document.querySelectorAll("main section[id], .hero").forEach(function (sec) {
      if (!sec.id) sec.id = "top";
      sectionObserver.observe(sec);
    });
  }

  /* ---------------------------------------------------------
     4) REVELADO CINEMATOGRÁFICO
     Cada "tramo" entra como una escena: opacidad + escala.
     Dentro de cada escena, los elementos internos aparecen
     con un ligero desfase (stagger).
  --------------------------------------------------------- */
  var scenes = document.querySelectorAll(".section, .hero__inner, .flow");
  var staggerGroups = [
    ".fit-card", ".proj-card", ".timeline__item", ".edu-group", ".fact", ".chips span"
  ];

  if ("IntersectionObserver" in window) {
    var sceneObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            sceneObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    scenes.forEach(function (el) { sceneObserver.observe(el); });

    staggerGroups.forEach(function (selector) {
      var items = document.querySelectorAll(selector);
      items.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
      });
    });
  } else {
    scenes.forEach(function (el) { el.classList.add("in-view"); });
  }
})();
