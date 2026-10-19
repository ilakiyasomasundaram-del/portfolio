/* ================================================
   ILAKIYA S — Portfolio Scripts
   Vanilla JS (ES6+) · All Interactive Features
   ================================================ */

(function () {
  'use strict';

  /* -----------------------------------------------
     DOM References
     ----------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const loader         = $('#loader');
  const scrollProgress = $('#scroll-progress');
  const navbar         = $('#navbar');
  const navLinks       = $$('.nav-link');
  const navLinksWrap   = $('#nav-links');
  const hamburger      = $('#hamburger');
  const themeToggle    = $('#theme-toggle');
  const backToTop      = $('#back-to-top');
  const heroCanvas     = $('#hero-canvas');
  const typingEl       = $('#typing-text');
  const contactForm    = $('#contact-form');
  const formSuccess    = $('#form-success');
  const lightbox       = $('#lightbox');
  const lightboxImg    = lightbox ? $('.lightbox__img', lightbox) : null;
  const lightboxClose  = lightbox ? $('.lightbox__close', lightbox) : null;
  const certViewBtns   = $$('.cert-view-btn');
  const yearEl         = $('#current-year');
  const revealEls      = $$('.reveal');

  /* -----------------------------------------------
     1. LOADING SCREEN
     ----------------------------------------------- */
  function hideLoader() {
    if (!loader) return;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }

  window.addEventListener('load', () => setTimeout(hideLoader, 700));
  setTimeout(hideLoader, 3500); // fallback

  /* -----------------------------------------------
     2. DARK / LIGHT MODE
     ----------------------------------------------- */
  function getPreferredTheme() {
    const stored = localStorage.getItem('ilakiya-portfolio-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ilakiya-portfolio-theme', theme);
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  /* -----------------------------------------------
     3. STICKY NAVBAR + SCROLL PROGRESS
     ----------------------------------------------- */
  function updateNavAndProgress() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;

    navbar.classList.toggle('scrolled', y > 40);
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateNavAndProgress, { passive: true });
  updateNavAndProgress();

  /* -----------------------------------------------
     4. ACTIVE NAV HIGHLIGHTING
     ----------------------------------------------- */
  function highlightNav() {
    const sections = $$('section[id]');
    const y = window.scrollY + 130;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const h   = sec.offsetHeight;
      const id  = sec.getAttribute('id');
      if (y >= top && y < top + h) {
        navLinks.forEach((l) => {
          l.classList.toggle('active', l.getAttribute('data-section') === id);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* -----------------------------------------------
     5. SMOOTH SCROLL
     ----------------------------------------------- */
  function smoothScroll(target) {
    const el = document.querySelector(target);
    if (!el) return;
    const offset = navbar.offsetHeight;
    window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScroll(link.getAttribute('href'));
      closeMobileMenu();
    });
  });

  $$('.footer__links a').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) { e.preventDefault(); smoothScroll(href); }
    });
  });

  $$('.navbar__logo').forEach((l) => {
    l.addEventListener('click', (e) => { e.preventDefault(); smoothScroll('#hero'); });
  });

  /* -----------------------------------------------
     6. MOBILE MENU
     ----------------------------------------------- */
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeMobileMenu);
  }

  function openMobileMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    navLinksWrap.classList.add('open');
    if (!overlay) createOverlay();
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinksWrap.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinksWrap.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

  /* -----------------------------------------------
     7. TYPING ANIMATION
     ----------------------------------------------- */
  const roles = [
    'Software Developer',
    'Frontend Developer',
    'Web Developer',
    'AI Enthusiast'
  ];
  let ti = 0, ci = 0, deleting = false, delay = 100;

  function typeEffect() {
    if (!typingEl) return;
    const word = roles[ti];

    if (deleting) {
      typingEl.textContent = word.substring(0, ci - 1);
      ci--;
      delay = 45;
    } else {
      typingEl.textContent = word.substring(0, ci + 1);
      ci++;
      delay = 90;
    }

    if (!deleting && ci === word.length) { delay = 2200; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % roles.length; delay = 350; }

    setTimeout(typeEffect, delay);
  }

  setTimeout(typeEffect, 900);

  /* -----------------------------------------------
     8. BACK TO TOP
     ----------------------------------------------- */
  function toggleBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 380);
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* -----------------------------------------------
     9. SCROLL REVEAL
     ----------------------------------------------- */
  function revealOnScroll() {
    const trigger = window.innerHeight * 0.88;
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top < trigger) el.classList.add('visible');
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();

  /* -----------------------------------------------
     10. CERTIFICATE LIGHTBOX
     ----------------------------------------------- */
  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  }

  certViewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.certificate-card');
      if (card) openLightbox(card.getAttribute('data-cert'));
    });
  });

  // Also open on image click
  $$('.certificate-card__img').forEach((imgWrap) => {
    imgWrap.style.cursor = 'pointer';
    imgWrap.addEventListener('click', () => {
      const card = imgWrap.closest('.certificate-card');
      if (card) openLightbox(card.getAttribute('data-cert'));
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* -----------------------------------------------
     11. CONTACT FORM VALIDATION
     ----------------------------------------------- */
  const rules = {
    name: (v) => {
      if (!v.trim()) return 'Name is required.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: (v) => {
      if (!v.trim()) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email.';
      return '';
    },
    subject: (v) => {
      if (!v.trim()) return 'Subject is required.';
      if (v.trim().length < 4) return 'Subject must be at least 4 characters.';
      return '';
    },
    message: (v) => {
      if (!v.trim()) return 'Message is required.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  function validateField(name, value) {
    const input  = $(`#${name}`);
    const errorEl = input ? input.closest('.form-group').querySelector('.form-error') : null;
    const msg = rules[name] ? rules[name](value) : '';
    if (errorEl) errorEl.textContent = msg;
    if (input) input.classList.toggle('error', !!msg);
    return msg;
  }

  ['name', 'email', 'subject', 'message'].forEach((f) => {
    const input = $(`#${f}`);
    if (!input) return;
    input.addEventListener('blur', () => validateField(f, input.value));
    input.addEventListener('input', () => {
      const err = input.closest('.form-group').querySelector('.form-error');
      if (err && err.textContent) validateField(f, input.value);
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasErr = false;
      ['name', 'email', 'subject', 'message'].forEach((f) => {
        const input = $(`#${f}`);
        if (validateField(f, input ? input.value : '')) hasErr = true;
      });
      if (hasErr) return;

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
        btn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1400);
    });
  }

  /* -----------------------------------------------
     12. HERO PARTICLE CANVAS
     ----------------------------------------------- */
  function initCanvas() {
    if (!heroCanvas) return;
    const ctx = heroCanvas.getContext('2d');
    let w, h, particles, mouse = { x: -9999, y: -9999 };
    const COUNT = 55;
    const DIST  = 110;
    const MR    = 140;

    function resize() {
      const r = heroCanvas.parentElement.getBoundingClientRect();
      w = heroCanvas.width  = r.width;
      h = heroCanvas.height = r.height;
    }

    function spawn() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 1.8 + 0.8
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const pColor = dark ? 'rgba(108,99,255,' : 'rgba(108,99,255,';

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = pColor + ((1 - d / DIST) * 0.2) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MR) {
          const f = ((MR - d) / MR) * 0.015;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = pColor + '0.55)';
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    heroCanvas.parentElement.addEventListener('mousemove', (e) => {
      const r = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });

    heroCanvas.parentElement.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    resize();
    spawn();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); spawn(); }, 200);
    });
  }

  initCanvas();

  /* -----------------------------------------------
     13. LAZY LOADING
     ----------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (e.target.dataset.src) e.target.src = e.target.dataset.src;
          e.target.classList.add('loaded');
          imgObs.unobserve(e.target);
        }
      });
    }, { rootMargin: '200px 0px' });
    $$('img[loading="lazy"]').forEach((img) => imgObs.observe(img));
  }

  /* -----------------------------------------------
     14. FOOTER YEAR
     ----------------------------------------------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------
     15. KEYBOARD ACCESSIBILITY
     ----------------------------------------------- */
  $$('a.btn, button').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  /* -----------------------------------------------
     16. TILT EFFECT on skill cards
     ----------------------------------------------- */
  $$('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();