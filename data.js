

// ============================================================
// CONTENIDO — edita SOLO este archivo para actualizar tu CV.
// No hace falta tocar HTML/CSS/JS para cambiar textos.
// ============================================================

const NAME = "Óscar Arés Martínez";
const ROLE = "Técnico de Servicios Digitales (T1)";
const EMAIL = "aresmartinezoscar@gmail.com";
const PHONE = "+34 673 670 920";
const LINKEDIN = "https://www.linkedin.com/in/%C3%B3scar-ar%C3%A9s-mart%C3%ADnez/";
const CVLINK = "https://aresmartinezoscar-dev.github.io/Web-portfolio/cv-oscar-ares.pdf";

const CV_DATA = {
  name: NAME,
  role: ROLE,
  email: EMAIL,
  phone: PHONE,
  linkedin: LINKEDIN,
  cvLink: CVLINK,

  windows: {

    about: {
      title: "Sobre mí.app",
      html: `
        <h2>Óscar Arés</h2>
        <div class="meta">rol objetivo: Técnico de Servicios Digitales (T1)</div>
        <p>Técnico especializado en servicios digitales y transformación de
        procesos. Trabajo actualmente en EMASESA automatizando flujos con
        Microsoft 365, y antes gestioné digitalización de procesos en la
        Administración Pública (Perú) y proyectos tecnológicos en entornos
        internacionales (Colombia).</p>
        <p>Me interesa especialmente el punto de encuentro entre la parte
        técnica y las personas que usan lo que construyo: entender el problema
        real antes de automatizar cualquier cosa.</p>
      `
    },

    experiencia: {
      title: "Experiencia.app",
      html: `
        <div class="entry">
          <div class="meta">presente · Sevilla</div>
          <h2>EMASESA — Transformación Digital</h2>
          <p>Automatización de procesos, integración de IA en flujos de
          trabajo reales, gestión documental y colaboración con SharePoint
          y Teams.</p>
          <span class="tag">Power Automate</span>
          <span class="tag">SharePoint</span>
          <span class="tag">Teams</span>
          <span class="tag">IA</span>
        </div>
        <div class="entry">
          <div class="meta">2019 — 2021 · Perú</div>
          <h2>Administración Pública</h2>
          <p>Proyectos de digitalización de procesos administrativos.</p>
        </div>
        <div class="entry">
          <div class="meta">2021 — 2023 · Colombia</div>
          <h2>Proyectos tecnológicos internacionales</h2>
          <p>Gestión de proyectos en entornos internacionales, coordinando
          perfiles técnicos y funcionales.</p>
        </div>
      `
    },

    formacion: {
      title: "Formación.app",
      html: `
        <h2>Certificaciones</h2>
        <div class="skill-row"><div class="label">Microsoft 365</div><div class="skill-bar"><div class="skill-fill" data-pct="92"></div></div><div class="lvl">92%</div></div>
        <div class="skill-row"><div class="label">Azure</div><div class="skill-bar"><div class="skill-fill" data-pct="80"></div></div><div class="lvl">80%</div></div>
        <div class="skill-row"><div class="label">Entra ID</div><div class="skill-bar"><div class="skill-fill" data-pct="75"></div></div><div class="lvl">75%</div></div>
        <div class="skill-row"><div class="label">ITIL</div><div class="skill-bar"><div class="skill-fill" data-pct="85"></div></div><div class="lvl">85%</div></div>
        <div class="skill-row"><div class="label">Automatización</div><div class="skill-bar"><div class="skill-fill" data-pct="95"></div></div><div class="lvl">95%</div></div>
        <p style="margin-top:14px;">Formación reforzada específicamente tras revisar los requisitos
        del perfil de Técnico de Servicios Digitales.</p>
      `
    },

    proyectos: {
      title: "Proyectos.app",
      html: `
        <div class="entry">
          <div class="meta">EMASESA · 2020 — 2025 · datos reales de planta</div>
          <h2>Modelos predictivos de calidad del agua tratada</h2>
          <p>Desarrollo y evaluación de 7 modelos de Machine Learning
          (Random Forest, GBM y Ridge) para anticipar parámetros críticos
          de salida de planta &mdash; turbidez, UV254, THM, manganeso,
          aluminio y cloro libre &mdash; a partir de variables de proceso:
          dosificación de coagulante/floculante/cloro, caudales, pH,
          temperatura y estacionalidad.</p>
          <p>Entrené los modelos con datos de 2020&ndash;2023 y los validé
          contra todo 2025 como test real, comparando el resultado frente
          a un modelo de regresión lineal (RLM) previo de referencia.
          El análisis destapó dos hallazgos clave: la mayoría de modelos
          no superaban a ese baseline &mdash; varios con R&sup2; negativo
          en test&mdash;, y en THM_ED / THM_SD la cobertura de datos de
          entrenamiento apenas llegaba al 27&ndash;28%, lo que limita
          claramente su fiabilidad. Documenté ambos problemas y las
          métricas de cada modelo (R&sup2;, MAE, cobertura) para priorizar
          los siguientes pasos: mejorar la captura de datos antes de
          seguir optimizando algoritmos.</p>
          <span class="tag">Python</span><span class="tag">Random Forest</span>
          <span class="tag">GBM</span><span class="tag">Ridge Regression</span>
          <span class="tag">Análisis de datos</span>
        </div>
        <div class="entry">
          <h2>[completar: nombre del proyecto 2]</h2>
          <p>Breve descripción del reto y de la solución aportada.</p>
          <span class="tag">Azure</span><span class="tag">IA</span>
        </div>
        <p class="meta">el detalle ampliado está en tu CV descargable (app Contacto → CV)</p>
      `
    },

    contacto: {
      title: "Contacto.app",
      html: `
        <h2>Hablemos</h2>
        <div class="contact-row"><span class="k">email</span> <a class="win-link" href="mailto:${EMAIL}">${EMAIL}</a></div>
        <div class="contact-row"><span class="k">teléfono</span> ${PHONE}</div>
        <div class="contact-row"><span class="k">linkedin</span> <a class="win-link" href="${LINKEDIN}" target="_blank" rel="noopener">${LINKEDIN}</a></div>
        <div class="contact-row"><span class="k">cv</span> <a class="win-link" href="${CVLINK}" target="_blank" rel="noopener">descargar PDF</a></div>
        <p style="margin-top:14px;">Referencias disponibles a petición.</p>
      `
    },

    terminal: {
      title: "Terminal.app",
      html: `
        <div class="term-log" id="termLog">guest@cv:~$ <span class="amber">whoami</span>
</div>
      `
    }
  }
};

