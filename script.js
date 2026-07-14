// ============================================================
// SCRIPT — gestor de ventanas + boot + efectos
// ============================================================

/* ---------- estrellas de fondo (canvas ligero) ---------- */
function initStars(canvasId, density){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const count = Math.floor((canvas.width * canvas.height) / (9000 / density));
    stars = Array.from({length:count}, ()=>({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.2 + 0.3,
      phase: Math.random()*Math.PI*2,
      speed: Math.random()*0.02 + 0.01
    }));
  }
  let t = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#c4b5fd';
    stars.forEach(s=>{
      const a = reduced ? 0.6 : 0.4 + 0.4*Math.sin(t*s.speed*10 + s.phase);
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    t++;
    if(!reduced) requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ---------- boot sequence ---------- */
function runBoot(onDone){
  const statusEl = document.getElementById('bootStatus');
  const fillEl = document.getElementById('bootFill');
  const steps = [
    'cargando Microsoft 365 SDK…',
    'verificando Azure…',
    'sincronizando Entra ID…',
    'aplicando ITIL Service Framework…',
    'montando Power Automate…',
    'preparando escritorio…'
  ];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;
  function step(){
    if(i >= steps.length){ onDone(); return; }
    statusEl.textContent = steps[i];
    const pct = Math.round(((i+1)/steps.length)*100);
    fillEl.style.width = pct + '%';
    i++;
    setTimeout(step, reduced ? 40 : 380);
  }
  step();
}

/* ---------- reloj ---------- */
function startClock(){
  const el = document.getElementById('clock');
  function update(){
    const d = new Date();
    const days = ['dom','lun','mar','mié','jue','vie','sáb'];
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    el.textContent = `${days[d.getDay()]} · ${hh}:${mm}`;
  }
  update();
  setInterval(update, 15000);
}

/* ---------- gestor de ventanas ---------- */
const WindowManager = (function(){
  let zTop = 10;
  const registry = {}; // id -> {el, state}

  function buildWindow(id, def){
    const el = document.createElement('div');
    el.className = 'window';
    el.id = 'win-' + id;
    el.innerHTML = `
      <div class="win-titlebar" data-drag>
        <button class="tdot r" data-act="close" aria-label="Cerrar"></button>
        <button class="tdot y" data-act="min" aria-label="Minimizar"></button>
        <button class="tdot g" data-act="max" aria-label="Maximizar"></button>
        <span class="win-title">${def.title}</span>
      </div>
      <div class="win-body">${def.html}</div>
    `;
    document.getElementById('windowsRoot').appendChild(el);
    registry[id] = { el, open:false, min:false, max:false };

    // offset windows so they don't stack exactly
    const openCount = Object.keys(registry).length;
    el.style.top = (70 + openCount*22) + 'px';
    el.style.left = (90 + openCount*26) + 'px';

    // buttons
    el.querySelector('[data-act="close"]').addEventListener('click', (e)=>{e.stopPropagation(); closeWindow(id);});
    el.querySelector('[data-act="min"]').addEventListener('click', (e)=>{e.stopPropagation(); minimizeWindow(id);});
    el.querySelector('[data-act="max"]').addEventListener('click', (e)=>{e.stopPropagation(); toggleMaximize(id);});
    el.addEventListener('mousedown', ()=>focusWindow(id));
    el.addEventListener('touchstart', ()=>focusWindow(id), {passive:true});

    // dragging
    const handle = el.querySelector('[data-drag]');
    let dragging = false, offX = 0, offY = 0;
    function start(clientX, clientY){
      if(registry[id].max) return;
      dragging = true;
      const rect = el.getBoundingClientRect();
      offX = clientX - rect.left;
      offY = clientY - rect.top;
      focusWindow(id);
    }
    function move(clientX, clientY){
      if(!dragging) return;
      el.style.left = Math.max(0, clientX - offX) + 'px';
      el.style.top = Math.max(30, clientY - offY) + 'px';
    }
    function end(){ dragging = false; }
    handle.addEventListener('mousedown', e=>{ start(e.clientX, e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', e=> move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);
    handle.addEventListener('touchstart', e=>{ const t=e.touches[0]; start(t.clientX,t.clientY); }, {passive:true});
    window.addEventListener('touchmove', e=>{ if(dragging){ const t=e.touches[0]; move(t.clientX,t.clientY); } }, {passive:true});
    window.addEventListener('touchend', end);

    return el;
  }

  function openWindow(id){
    const w = registry[id];
    if(!w) return;
    w.el.classList.add('open');
    w.el.style.display = 'flex';
    w.open = true; w.min = false;
    focusWindow(id);
    updateDock();
    // animate skill bars if present
    w.el.querySelectorAll('.skill-fill').forEach(bar=>{
      const pct = bar.dataset.pct;
      requestAnimationFrame(()=> bar.style.width = pct + '%');
    });
    if(id === 'terminal') runTerminalDemo(w.el);
  }

  function closeWindow(id){
    const w = registry[id];
    if(!w) return;
    w.el.classList.remove('open');
    w.el.style.display = 'none';
    w.open = false; w.min = false;
    updateDock();
  }

  function minimizeWindow(id){
    const w = registry[id];
    if(!w) return;
    w.el.style.display = 'none';
    w.min = true;
    updateDock();
  }

  function toggleMaximize(id){
    const w = registry[id];
    if(!w) return;
    w.max = !w.max;
    w.el.classList.toggle('maximized', w.max);
  }

  function focusWindow(id){
    const w = registry[id];
    if(!w || !w.open) return;
    if(w.min){ w.min = false; w.el.style.display = 'flex'; }
    Object.values(registry).forEach(r=>r.el.classList.remove('focused'));
    zTop++;
    w.el.style.zIndex = zTop;
    w.el.classList.add('focused');
    updateDock();
  }

  function toggleFromDock(id){
    const w = registry[id];
    if(!w) return;
    if(!w.open){ openWindow(id); return; }
    if(w.min || !w.el.classList.contains('focused')){ focusWindow(id); }
    else { minimizeWindow(id); }
  }

  function updateDock(){
    const dock = document.getElementById('dock');
    dock.innerHTML = '';
    Object.keys(registry).forEach(id=>{
      const w = registry[id];
      const btn = document.createElement('button');
      btn.className = 'dock-item' + (w.open ? ' running' : '');
      const glyphClass = document.querySelector(`.icon[data-window="${id}"] .glyph`).className;
      btn.innerHTML = `<div class="${glyphClass}" style="width:100%;height:100%;box-shadow:none;"></div>`;
      btn.title = id;
      btn.addEventListener('click', ()=> toggleFromDock(id));
      dock.appendChild(btn);
    });
  }

  return { buildWindow, openWindow, closeWindow, minimizeWindow, toggleMaximize, focusWindow, updateDock };
})();

/* ---------- mini terminal dentro de la app Terminal ---------- */
function runTerminalDemo(winEl){
  const log = winEl.querySelector('#termLog');
  if(!log || log.dataset.done) return;
  log.dataset.done = '1';
  const lines = [
    {t:'', cls:''},
    {t:CV_DATA.name, cls:'amber'},
    {t:CV_DATA.role, cls:'dim'},
    {t:'', cls:''},
    {t:'stack: Microsoft 365 · Azure · Entra ID · ITIL', cls:'ok'},
    {t:'', cls:''},
    {t:'guest@cv:~$ echo "gracias por curiosear 👋"', cls:''},
    {t:'gracias por curiosear 👋', cls:'ok'},
  ];
  let i = 0;
  function next(){
    if(i >= lines.length) return;
    const {t, cls} = lines[i]; i++;
    const div = document.createElement('div');
    if(cls) div.className = cls;
    div.textContent = t;
    log.appendChild(div);
    setTimeout(next, 220);
  }
  next();
}

/* ---------- menú contextual ---------- */
function initContextMenu(){
  const menu = document.getElementById('ctxMenu');
  const desktop = document.getElementById('desktop');
  const bgs = [
    ['#140f28','#1f1640'],
    ['#0f1e2e','#14273b'],
    ['#1e1024','#2a1140'],
    ['#0b1a1a','#0f2d2d'],
  ];
  let bgIdx = 0;

  desktop.addEventListener('contextmenu', e=>{
    e.preventDefault();
    menu.style.top = e.clientY + 'px';
    menu.style.left = Math.min(e.clientX, window.innerWidth - 210) + 'px';
    menu.hidden = false;
  });
  document.addEventListener('click', ()=> menu.hidden = true);

  menu.querySelector('[data-action="wallpaper"]').addEventListener('click', ()=>{
    bgIdx = (bgIdx + 1) % bgs.length;
    const [a,b] = bgs[bgIdx];
    desktop.style.background = `radial-gradient(ellipse at 20% 0%, ${b} 0%, ${a} 55%, #0b0818 100%)`;
  });
  menu.querySelector('[data-action="about"]').addEventListener('click', ()=> WindowManager.toggleFromDock ? WindowManager.openWindow('about') : null);
  menu.querySelector('[data-action="arrange"]').addEventListener('click', ()=>{
    document.querySelectorAll('.window').forEach((el,idx)=>{
      el.style.top = (70 + idx*22) + 'px';
      el.style.left = (90 + idx*26) + 'px';
    });
  });
}

/* ---------- inicialización ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  initStars('stars-boot', 1);

  Object.entries(CV_DATA.windows).forEach(([id, def])=>{
    WindowManager.buildWindow(id, def);
  });
  WindowManager.updateDock();

  document.querySelectorAll('.icon').forEach(btn=>{
    btn.addEventListener('click', ()=> WindowManager.openWindow(btn.dataset.window));
  });

  initContextMenu();

  runBoot(()=>{
    document.getElementById('boot').classList.add('fade-out');
    setTimeout(()=>{
      document.getElementById('boot').style.display = 'none';
      document.getElementById('desktop').hidden = false;
      initStars('stars-desktop', 0.6);
      startClock();
      // abre "Sobre mí" automáticamente para dar la bienvenida
      WindowManager.openWindow('about');
    }, 600);
  });
});
