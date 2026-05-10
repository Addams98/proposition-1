// Proposition 6 — "Feu & Gloire" script
(function () {
  'use strict';

  // === Navbar transparent → solid on scroll ===
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.style.background = window.scrollY > 50 ? 'rgba(6,11,18,0.98)' : 'rgba(6,11,18,0.96)';
    navbar.style.borderBottomColor = window.scrollY > 50 ? 'rgba(234,168,0,0.2)' : 'rgba(255,255,255,0.07)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // === Hamburger ===
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  // === Reveal on scroll ===
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));

  // === Active nav link ===
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === page) link.classList.add('active');
  });

  // === Progress bars ===
  const pbio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.progress-fill');
        if (fill) { const w = fill.style.width; fill.style.width = '0'; requestAnimationFrame(() => { fill.style.width = w; }); }
        pbio.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-bar').forEach(el => pbio.observe(el));

  // === Carousel engine ===
  function initCarousel(wrap) {
    const track    = wrap.querySelector('.carousel-track');
    const slides   = wrap.querySelectorAll('.carousel-slide');
    const btnPrev  = wrap.querySelector('.carousel-btn-prev');
    const btnNext  = wrap.querySelector('.carousel-btn-next');
    const dotsWrap = wrap.querySelector('.carousel-dots');
    if (!track || slides.length === 0) return;

    let current = 0;
    let perView = getPerView();
    let total   = Math.max(1, slides.length - perView + 1);
    let autoTimer;

    function getPerView() {
      if (window.innerWidth <= 580) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    if (dotsWrap) {
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
      const dotBtns = dotsWrap.querySelectorAll('.c-dot');
      dotBtns.forEach((d, i) => d.classList.toggle('active', i === Math.floor(current / perView)));
    }

    function goTo(idx) {
      perView = getPerView();
      total   = Math.max(1, slides.length - perView + 1);
      current = Math.max(0, Math.min(idx, total - 1));
      const gap = 20;
      const slideW = track.parentElement.offsetWidth;
      const cardW  = (slideW - gap * (perView - 1)) / perView;
      track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
      if (btnPrev) btnPrev.disabled = current === 0;
      if (btnNext) btnNext.disabled = current >= total - 1;
      updateDots();
    }

    if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
    });

    function startAuto() { autoTimer = setInterval(() => goTo(current + 1 >= total ? 0 : current + 1), 5000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

    window.addEventListener('resize', () => {
      perView = getPerView();
      total   = Math.max(1, slides.length - perView + 1);
      current = Math.min(current, total - 1);
      if (dotsWrap) {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < Math.ceil(slides.length / perView); i++) {
          const d = document.createElement('button');
          d.className = 'c-dot' + (Math.floor(current / perView) === i ? ' active' : '');
          d.setAttribute('aria-label', 'Diapositive ' + (i + 1));
          d.addEventListener('click', () => goTo(i * perView));
          dotsWrap.appendChild(d);
        }
      }
      goTo(current);
    }, { passive: true });

    goTo(0);
  }

  document.querySelectorAll('.carousel-wrap').forEach(initCarousel);

})();
