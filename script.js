/* =========================================================
   BIRTHDAY SURPRISE – script.js
   ========================================================= */
 
/* ---------- Utility ---------- */
function $(id) { return document.getElementById(id); }
 
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active', 'fade-out');
    p.classList.add('fade-out');
  });
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('fade-out'));
    $(id).classList.add('active');
  }, 700);
}
 
/* =========================================================
   FLOATING SHAPES factory
   ========================================================= */
const EMOJIS = ['✨','💖','🌸','⭐','🎈','💫','🦋','🌟','💕','🎉','🎀','💝'];
 
function spawnShapes(containerId, count = 18) {
  const wrap = $(containerId);
  if (!wrap) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      font-size:${14 + Math.random()*22}px;
      opacity:0;
      animation: floatShape ${5 + Math.random()*8}s linear ${Math.random()*6}s infinite;
      pointer-events:none;
      user-select:none;
    `;
    wrap.appendChild(el);
  }
}
 
/* =========================================================
   CONFETTI
   ========================================================= */
const CONFETTI_COLORS = ['#ff6eb4','#a855f7','#fbbf24','#38bdf8','#34d399','#fb7185','#ffffff','#f9a8d4'];
 
function spawnConfetti(containerId, count = 80) {
  const wrap = $(containerId);
  if (!wrap) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 10;
    const isRound = Math.random() > .5;
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:-${size}px;
      width:${size}px;
      height:${size * (isRound ? 1 : 2.5)}px;
      background:${CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)]};
      border-radius:${isRound ? '50%' : '2px'};
      opacity:1;
      animation: confettiFall ${3 + Math.random()*5}s linear ${Math.random()*4}s infinite;
    `;
    wrap.appendChild(el);
  }
}
 
/* =========================================================
   FIREWORKS
   ========================================================= */
function launchFireworks() {
  const container = $('fireworks');
  if (!container) return;
  function burst() {
    const x = 10 + Math.random() * 80;
    const y = 5 + Math.random() * 60;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const particles = 14;
    for (let i = 0; i < particles; i++) {
      const dot = document.createElement('div');
      const angle = (i / particles) * 2 * Math.PI;
      const dist = 40 + Math.random() * 60;
      dot.style.cssText = `
        position:absolute;
        left:${x}%; top:${y}%;
        width:6px; height:6px;
        border-radius:50%;
        background:${color};
        box-shadow: 0 0 6px ${color};
        transform:translate(-50%,-50%);
        animation: fireworkBurst .9s ease forwards;
        --tx:${Math.cos(angle)*dist}px;
        --ty:${Math.sin(angle)*dist}px;
      `;
      dot.style.setProperty('--tx', `${Math.cos(angle)*dist}px`);
      dot.style.setProperty('--ty', `${Math.sin(angle)*dist}px`);
      /* manual keyframe via JS */
      dot.animate([
        { transform:`translate(-50%,-50%) scale(1)`, opacity:1 },
        { transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`, opacity:0 }
      ], { duration: 900, easing:'ease-out', fill:'forwards' });
      container.appendChild(dot);
      setTimeout(() => dot.remove(), 1100);
    }
  }
  const iv = setInterval(burst, 700);
  setTimeout(() => clearInterval(iv), 12000);
  burst(); burst();
}
 
/* =========================================================
   PAGE 1 – LOADING
   ========================================================= */
(function initLoading() {
  spawnShapes('loading-shapes', 20);
  /* Ring animation is pure CSS (fillRing), nothing extra needed */
  setTimeout(() => {
    showPage('page-wishes');
    initWishes();
  }, 3200);
})();
 
/* =========================================================
   PAGE 2 – WISHES
   ========================================================= */
function initWishes() {
  spawnShapes('wishes-shapes', 22);
  spawnConfetti('confetti-wishes', 70);
 
  $('btn-gift').addEventListener('click', () => {
    showPage('page-gift');
    initGift();
  });
}
 
/* =========================================================
   TYPING EFFECT
   ========================================================= */
function typeText(el, text, speed, onDone) {
  el.textContent = '';
  el.style.borderRight = '3px solid #ff6eb4';
  el.style.animation = 'typeCursor .7s step-end infinite';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      el.style.borderRight = 'none';
      el.style.animation = 'none';
      if (onDone) setTimeout(onDone, 600);
    }
  }, speed);
}
 
/* =========================================================
   PAGE 3 – GIFT MESSAGE
   ========================================================= */
const QUOTE1 = "Happiest birthday to the caring and kindest one existing in my life 😌";
const QUOTE2 = "The one who supports, stood and tolerates me through all my stupid nuisances 😂✨";
 
function initGift() {
  spawnShapes('gift-shapes', 20);
 
  const card1 = $('quote-card-1');
  const card2 = $('quote-card-2');
  const text1 = $('quote-text-1');
  const text2 = $('quote-text-2');
  const btnContinue = $('btn-continue');
 
  // Type first quote
  typeText(text1, QUOTE1, 45, () => {
    // Show second card
    card2.classList.remove('hidden');
    setTimeout(() => {
      typeText(text2, QUOTE2, 45, () => {
        btnContinue.classList.remove('hidden');
      });
    }, 400);
  });
 
  btnContinue.addEventListener('click', () => {
    showPage('page-balloons');
    initBalloons();
  });
}
 
/* =========================================================
   PAGE 4 – BALLOON GAME
   ========================================================= */
const BALLOON_DATA = [
  { color:'#e53935', label:'🔴', quote:' Sorry for the actions and words which I have done by my short temper that trembles you. 😔' },
  { color:'#1e88e5', label:'🔵', quote:'I always owes for being cautious and strict one to make me travel on right path 💝. 🌟' },
  { color:'#e91e8c', label:'🩷', quote:'You deserve all the happiness in the universe. 💖' },
  { color:'#f9a825', label:'🟡', quote:'You irritates me like Monday 😫 but still you are my Friday.🤪' },
  { color:'#8e24aa', label:'🟣', quote:'Be the strongest as ever you are. 🔥' },
];
 
function initBalloons() {
  spawnShapes('balloon-shapes', 14);
 
  const arena = $('balloons-arena');
  const reveal = $('quote-reveal');
  const revealText = $('quote-reveal-text');
  const btnFinal = $('btn-final');
  let popped = 0;
 
  /* Positions as percentages [left, bottom] */
  const positions = [
    [10, 10], [30, 18], [52, 8], [70, 20], [88, 12]
  ];
 
  BALLOON_DATA.forEach((b, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'balloon';
    wrap.style.left  = positions[idx][0] + '%';
    wrap.style.bottom = positions[idx][1] + '%';
    wrap.style.animationDelay = (idx * 0.4) + 's';
 
    const body = document.createElement('div');
    body.className = 'balloon-body';
    body.style.background = `radial-gradient(circle at 35% 35%, ${lighten(b.color)}, ${b.color})`;
 
    const num = document.createElement('div');
    num.className = 'balloon-num';
    num.textContent = b.label;
 
    const string = document.createElement('div');
    string.className = 'balloon-string';
 
    body.appendChild(num);
    wrap.appendChild(body);
    wrap.appendChild(string);
    arena.appendChild(wrap);
 
    wrap.addEventListener('click', () => {
      if (wrap.classList.contains('popped')) return;
      wrap.classList.add('popped');
      playPop();
      popped++;
 
      setTimeout(() => {
        wrap.style.visibility = 'hidden';
        revealText.textContent = b.quote;
        reveal.classList.remove('hidden');
        reveal.style.animation = 'none';
        void reveal.offsetWidth;
        reveal.style.animation = 'fadeInUp .6s ease';
 
        if (popped === BALLOON_DATA.length) {
          setTimeout(() => {
            btnFinal.classList.remove('hidden');
          }, 700);
        }
      }, 380);
    });
  });
 
  btnFinal.addEventListener('click', () => {
    showPage('page-final');
    initFinal();
  });
}
 
function lighten(hex) {
  /* Simple lighten: mix with white */
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+80)},${Math.min(255,g+80)},${Math.min(255,b+80)})`;
}
 
/* Pop sound via Web Audio API */
function playPop() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + .15);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + .18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + .2);
  } catch(e) { /* silent fail if audio blocked */ }
}
 
/* =========================================================
   PAGE 5 – FINAL
   ========================================================= */
function initFinal() {
  spawnShapes('final-shapes', 25);
  spawnConfetti('confetti-final', 100);
  launchFireworks();
}
 
