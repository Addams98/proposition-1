/* ============================================
   RÉVEIL SPIRITUEL - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // Navbar scroll behavior
  // ============================================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // Mobile hamburger menu
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // Scroll reveal animations
  // ============================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // ============================================
  // Particle system in hero
  // ============================================
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    const NUM_PARTICLES = 28;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 1.5;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ============================================
  // Smooth scroll for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // Counter animation for stats
  // ============================================
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  // ============================================
  // Bible verse rotator (if present)
  // ============================================
  const verseRotator = document.querySelector('.verse-rotator');
  if (verseRotator) {
    const verses = [
      { text: "C'est pourquoi il dit : Réveille-toi, toi qui dors, et relève-toi d'entre les morts, et le Mashiah brillera sur toi.", ref: "Éphésiens 5:14" },
      { text: "Car la Terre sera remplie de la connaissance de la gloire de YHWH, comme le fond de la mer par les eaux qui le couvrent.", ref: "Habaquq 2:14" },
      { text: "Ce livre de la torah ne s'éloignera pas de ta bouche, tu le méditeras jour et nuit, pour garder et faire tout ce qui y est écrit.", ref: "Josué 1:8" },
      { text: "Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie.", ref: "2 Corinthiens 9:7" },
      { text: "Et en allant, prêchez en disant : Le Royaume des cieux s'est approché ! Guérissez les malades, rendez purs les lépreux.", ref: "Matthieu 10:7-8" }
    ];

    let currentVerse = 0;
    const vText = verseRotator.querySelector('.v-text');
    const vRef = verseRotator.querySelector('.v-ref');
    const dots = verseRotator.querySelectorAll('.v-dot');

    function showVerse(idx) {
      vText.style.opacity = '0';
      vRef.style.opacity = '0';
      setTimeout(() => {
        vText.textContent = `"${verses[idx].text}"`;
        vRef.textContent = `— ${verses[idx].ref}`;
        vText.style.opacity = '1';
        vRef.style.opacity = '1';
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, 300);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { currentVerse = i; showVerse(i); });
    });

    setInterval(() => {
      currentVerse = (currentVerse + 1) % verses.length;
      showVerse(currentVerse);
    }, 6000);
  }

  // ============================================
  // Accordion / FAQ
  // ============================================
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ============================================
  // Back to top button
  // ============================================
  const topBtn = document.createElement('button');
  topBtn.innerHTML = '&#8679;';
  topBtn.setAttribute('aria-label', 'Retour en haut');
  topBtn.style.cssText = `
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 900;
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #4A4AC4, #3232a0);
    color: white; font-size: 1.5rem; font-weight: bold;
    border: none; cursor: pointer; opacity: 0;
    box-shadow: 0 4px 15px rgba(74,74,196,0.4);
    transition: all 0.35s ease; transform: translateY(10px);
    display: flex; align-items: center; justify-content: center;
  `;
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.style.opacity = '1';
      topBtn.style.transform = 'translateY(0)';
    } else {
      topBtn.style.opacity = '0';
      topBtn.style.transform = 'translateY(10px)';
    }
  }, { passive: true });

  topBtn.addEventListener('mouseenter', () => {
    topBtn.style.transform = 'translateY(-3px)';
    topBtn.style.boxShadow = '0 8px 25px rgba(74,74,196,0.6)';
  });
  topBtn.addEventListener('mouseleave', () => {
    topBtn.style.transform = 'translateY(0)';
    topBtn.style.boxShadow = '0 4px 15px rgba(74,74,196,0.4)';
  });

  // ===== Carousel engine =====
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

});
