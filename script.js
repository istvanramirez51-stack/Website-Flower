/* ===========================
   BUNGA CINTA — SCRIPT.JS
   =========================== */

// ── Custom cursor ──────────────────────────────────────
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// ── Falling petals ─────────────────────────────────────
const petalEmojis = ['🌸', '🌺', '🌹', '💮', '🌷'];
function createPetal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  p.style.left            = Math.random() * 100 + 'vw';
  p.style.animationDuration = (3 + Math.random() * 4) + 's';
  p.style.fontSize        = (0.8 + Math.random() * 1)  + 'rem';
  p.style.animationDelay  = Math.random() * 2 + 's';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 7000);
}
setInterval(createPetal, 800);

// ── Bloom flower on click / tap ────────────────────────
function bloomFlower(el) {
  el.classList.add('bloomed');
  const petals = el.querySelectorAll('.petal-path');
  const colors = ['#ff4d6d', '#ff7a8a', '#ffb3c1', '#c77dff', '#f9c74f'];
  petals.forEach(p => {
    p.style.fill = colors[Math.floor(Math.random() * colors.length)];
  });
  burstConfetti(el);
  setTimeout(() => el.classList.remove('bloomed'), 1000);
}

function burstConfetti(el) {
  const rect   = el.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const emojis = ['🌸', '💕', '✨', '🌺', '💖', '🌹'];
  for (let i = 0; i < 6; i++) {
    const c   = document.createElement('div');
    c.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:1.2rem;pointer-events:none;z-index:9998;transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94);`;
    c.textContent   = emojis[i];
    const angle = (i / 6) * 360;
    const rad   = angle * Math.PI / 180;
    const dist  = 60 + Math.random() * 40;
    document.body.appendChild(c);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        c.style.transform = `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`;
        c.style.opacity   = '0';
      });
    });
    setTimeout(() => c.remove(), 1000);
  }
}

// Touch support for flowers
document.querySelectorAll('.flower-svg').forEach(f => {
  f.addEventListener('touchstart', e => {
    e.preventDefault();
    bloomFlower(f);
  }, { passive: false });
});

// ── Send love button ───────────────────────────────────
function sendLove() {
  const colors = ['#e8637a', '#f4a7b5', '#c9976a', '#c8a8d4', '#fff5f0'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className    = 'confetti-piece';
      c.style.left   = Math.random() * 100 + 'vw';
      c.style.top    = '-10px';
      c.style.background      = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (2 + Math.random() * 2) + 's';
      c.style.animationDelay  = Math.random() * 0.5 + 's';
      c.style.width  = (6 + Math.random() * 8) + 'px';
      c.style.height = (6 + Math.random() * 8) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }, i * 50);
  }
  showToast('💕 Cintaku terkirim untukmu sayang!');
}

// ── Bouquet builder ────────────────────────────────────
const FLOWERS = [
  { id: 'rose',    label: 'Mawar',    svgId: 'svg-rose'    },
  { id: 'sakura',  label: 'Sakura',   svgId: 'svg-sakura'  },
  { id: 'sun',     label: 'Matahari', svgId: 'svg-sun'     },
  { id: 'tulip',   label: 'Tulip',    svgId: 'svg-tulip'   },
  { id: 'lavender',label: 'Lavender', svgId: 'svg-lavender'},
  { id: 'daisy',   label: 'Daisy',    svgId: 'svg-daisy'   },
  { id: 'hibiscus',label: 'Hibiscus', svgId: 'svg-hibiscus'},
  { id: 'lotus',   label: 'Lotus',    svgId: 'svg-lotus'   },
];

let bouquet = []; // array of flower ids

function addFlower(id) {
  if (bouquet.length >= 20) { showToast('🌸 Buket sudah penuh!'); return; }
  bouquet.push(id);
  updateBouquet();
  updateCounts();
  // flash card
  const card = document.getElementById('card-' + id);
  if (card) {
    card.classList.add('selected');
    setTimeout(() => card.classList.remove('selected'), 400);
  }
}

function removeFlower(index) {
  bouquet.splice(index, 1);
  updateBouquet();
  updateCounts();
}

function updateCounts() {
  FLOWERS.forEach(f => {
    const cnt  = bouquet.filter(b => b === f.id).length;
    const el   = document.getElementById('count-' + f.id);
    const card = document.getElementById('card-'  + f.id);
    if (el) {
      el.textContent = cnt > 0 ? `×${cnt} dipilih` : '';
      card.classList.toggle('has-count', cnt > 0);
    }
  });
}

function updateBouquet() {
  const canvas  = document.getElementById('bouquet-canvas');
  const counter = document.getElementById('bouquet-counter');
  const cnt     = bouquet.length;

  counter.textContent = cnt;
  counter.classList.toggle('visible', cnt > 0);

  if (cnt === 0) {
    canvas.innerHTML = `
      <div class="bouquet-empty">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(244,167,181,0.3)" stroke-width="1.5" stroke-dasharray="4 4"/>
          <text x="30" y="38" text-anchor="middle" font-size="22">💐</text>
        </svg>
        <p>Buket kamu akan muncul di sini</p>
      </div>
    `;
    return;
  }

  const items = bouquet.map((id, i) => {
    const flower  = FLOWERS.find(f => f.id === id);
    const svgNode = document.getElementById(flower.svgId);
    const svgHtml = svgNode ? svgNode.outerHTML.replace('id="' + flower.svgId + '"', 'class="item-svg"') : '💐';
    return `
      <div class="bouquet-item" onclick="removeFlower(${i})" title="Klik untuk hapus">
        <span class="remove-hint">✕</span>
        ${svgHtml}
      </div>`;
  }).join('');

  canvas.innerHTML = `<div class="bouquet-flowers">${items}</div>`;
}

function clearBouquet() {
  bouquet = [];
  updateBouquet();
  updateCounts();
}

function sendBouquet() {
  if (bouquet.length === 0) { showToast('🌸 Pilih bunga dulu ya!'); return; }
  const names = [...new Set(bouquet)].map(id => FLOWERS.find(f => f.id === id).label).join(', ');
  showToast(`💌 Buket ${names} terkirim dengan cinta!`);
  burstFromCenter();
  clearBouquet();
}

function burstFromCenter() {
  for (let i = 0; i < 25; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className   = 'petal';
      p.textContent = ['💕', '🌸', '✨', '💖', '🌺', '🌹'][Math.floor(Math.random() * 6)];
      p.style.left  = (20 + Math.random() * 60) + 'vw';
      p.style.animationDuration = '2s';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }, i * 70);
  }
}

// ── Toast ──────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Scroll reveal ──────────────────────────────────────
const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));