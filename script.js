/* ── HERO SLIDER ── */
(function () {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dots   = slider.querySelectorAll('.dot');
  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  slider.querySelector('.slider-prev')?.addEventListener('click', () => goTo(current - 1));
  slider.querySelector('.slider-next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.dot)));

  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  resetTimer();
})();

/* ── NAVBAR: scroll behaviour ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', open);
    const spans = hamburger.querySelectorAll('span');
    if (spans[0]) spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    if (spans[1]) spans[1].style.opacity   = open ? '0' : '1';
    if (spans[2]) spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(
  '.about-grid, .product-card, .step, .gallery-item, .testimonial-card, .trust-item, .contact-grid, .section-header'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── CONTACT FORM ── */
const form    = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

document.getElementById('email')?.addEventListener('input', e => {
  const replyto = document.getElementById('replyto');
  if (replyto) replyto.value = e.target.value;
});

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  if (formMsg) formMsg.textContent = '';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#3d6b1e';
      if (formMsg) { formMsg.style.color = '#3d6b1e'; formMsg.textContent = '✓ Thank you! We\'ll get back to you within 24 hours.'; }
      form.reset();
    } else {
      const data = await res.json();
      throw new Error(data?.errors?.[0]?.message || 'Submission failed.');
    }
  } catch (err) {
    if (formMsg) { formMsg.style.color = '#c0392b'; formMsg.textContent = '✗ ' + err.message + ' Please try again or contact us directly.'; }
    btn.textContent = 'Send Message';
    btn.disabled = false;
    btn.style.background = '';
    return;
  }

  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    btn.style.background = '';
    if (formMsg) formMsg.textContent = '';
  }, 5000);
});

/* ── SMOOTH ACTIVE NAV HIGHLIGHT on scroll ── */
const sections   = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (navAnchors.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));
}

/* ── COUNT-UP ANIMATION for stats ── */
function animateCount(el, target) {
  let start = 0;
  const duration = 1600;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9]/g, '');
        el.dataset.suffix = el.textContent.replace(/[0-9]/g, '');
        animateCount(el, parseInt(raw, 10));
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));
}
