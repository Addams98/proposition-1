// PROPOSITION 3 — Stars + shared JavaScript
'use strict';

/* ---- STARFIELD ---- */
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'stars-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.5 + 0.2,
        drift: (Math.random() - 0.5) * 0.05
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed * 0.01;
      s.x += s.drift;
      if (s.x > canvas.width) s.x = 0;
      if (s.x < 0) s.x = canvas.width;
      const alpha = (Math.sin(s.a) * 0.5 + 0.5) * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize(); createStars(); draw();
})();

/* ---- NAVBAR SCROLL ---- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navMenu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(':scope > *').forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 110);
      });
      staggerObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.stagger').forEach(el => staggerObserver.observe(el));

/* ---- BACK TO TOP ---- */
const btt = document.createElement('button');
btt.innerHTML = '<i class="fa fa-arrow-up"></i>';
btt.setAttribute('aria-label', 'Retour en haut');
btt.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:900;width:44px;height:44px;border-radius:50%;background:rgba(124,58,237,0.8);color:#fff;border:1px solid rgba(167,139,250,0.4);cursor:pointer;font-size:0.9rem;box-shadow:0 0 20px rgba(124,58,237,0.5);display:none;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
document.body.appendChild(btt);
window.addEventListener('scroll', () => {
  btt.style.display = window.scrollY > 400 ? 'flex' : 'none';
}, { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Carousel engine ===== */
function initCarousel(wrap) {
  const track    = wrap.querySelector('.carousel-track');
  const slides   = wrap.querySelectorAll('.carousel-slide');
  const btnPrev  = wrap.querySelector('.carousel-btn-prev');
  const btnNext  = wrap.querySelector('.carousel-btn-next');
  const dotsWrap = wrap.querySelector('.carousel-dots');
  if (!track || slides.length === 0) return;
  let current = 0, autoTimer;
  let perView = getPerView();
  let total   = Math.max(1, slides.length - perView + 1);
  function getPerView() { return window.innerWidth <= 580 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < Math.ceil(slides.length / perView); i++) {
      const d = document.createElement('button');
      d.className = 'c-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Diapositive ' + (i + 1));
      d.addEventListener('click', () => goTo(i * perView));
      dotsWrap.appendChild(d);
    }
  }
  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === Math.floor(current / perView)));
  }
  function goTo(idx) {
    perView = getPerView(); total = Math.max(1, slides.length - perView + 1);
    current = Math.max(0, Math.min(idx, total - 1));
    const gap = 20, slideW = track.parentElement.offsetWidth;
    const cardW = (slideW - gap * (perView - 1)) / perView;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current >= total - 1;
    updateDots();
  }
  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); } });
  function startAuto() { autoTimer = setInterval(() => goTo(current + 1 >= total ? 0 : current + 1), 5000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
  startAuto();
  window.addEventListener('resize', () => { perView = getPerView(); total = Math.max(1, slides.length - perView + 1); current = Math.min(current, total - 1); buildDots(); goTo(current); }, { passive: true });
  buildDots(); goTo(0);
}
document.querySelectorAll('.carousel-wrap').forEach(initCarousel);
