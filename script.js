/* ── NAVBAR: scroll behaviour ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.querySelectorAll('span')[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '1';
  hamburger.querySelectorAll('span')[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
});

/* close menu on nav link click */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

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

/* mirror email into _replyto so Formspree threads replies to the customer */
document.getElementById('email')?.addEventListener('input', e => {
  document.getElementById('replyto').value = e.target.value;
});

/* ── CONTACT FORM ── */
const form    = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  formMsg.textContent = '';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#3d6b1e';
      formMsg.style.color = '#3d6b1e';
      formMsg.textContent = '✓ Thank you! We\'ll get back to you within 24 hours.';
      form.reset();
    } else {
      const data = await res.json();
      throw new Error(data?.errors?.[0]?.message || 'Submission failed.');
    }
  } catch (err) {
    formMsg.style.color = '#c0392b';
    formMsg.textContent = '✗ ' + err.message + ' Please try again or contact us directly.';
    btn.textContent = 'Send Message';
    btn.disabled = false;
    btn.style.background = '';
    return;
  }

  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    btn.style.background = '';
    formMsg.textContent = '';
  }, 5000);
});

/* ── SMOOTH ACTIVE NAV HIGHLIGHT on scroll ── */
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

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

/* ── PARALLAX on hero bg ── */
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroImg) {
    heroImg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.18}px)`;
  }
}, { passive: true });

/* ── COUNT-UP ANIMATION for stats ── */
function animateCount(el, target) {
  let start = 0;
  const duration = 1600;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target === 0 ? '0' : Math.round(ease * target)) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9]/g, '');
      const suffix = el.textContent.replace(/[0-9]/g, '');
      el.dataset.suffix = suffix;
      animateCount(el, parseInt(raw, 10));
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));
