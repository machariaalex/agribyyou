'use strict';
/* ── TECH BY YOU — Animation layer ── */

/* 1. Word-by-word hero title split */
(function splitHeroWords() {
  const title = document.querySelector('.t-hero-title');
  if (!title) return;
  let n = 0;
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.textContent)) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (/\S/.test(part)) {
          const s = document.createElement('span');
          s.className = 'tw';
          s.textContent = part;
          s.style.setProperty('--d', (60 + n++ * 110) + 'ms');
          frag.appendChild(s);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      [...node.childNodes].forEach(walk);
    }
  }
  [...title.childNodes].forEach(walk);
})();

/* 2. Bar stagger indices for CSS */
document.querySelectorAll('.t-bar').forEach((b, i) => {
  b.style.setProperty('--bi', i);
});

/* 3. Scroll-triggered reveal with stagger */
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    if (el.matches('.t-bc, .t-hl-card')) {
      /* Stagger by sibling index */
      const idx = [...el.parentElement.children].indexOf(el);
      setTimeout(() => el.classList.add('t-in'), idx * 110);
    } else {
      el.classList.add('t-in');
    }
    obs.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

/* Mark elements and observe */
document.querySelectorAll('.t-bento-intro, .t-hl-header').forEach(el => {
  el.classList.add('t-sr');
  obs.observe(el);
});

document.querySelectorAll('.t-bc, .t-hl-card').forEach(el => {
  el.classList.add('t-sr');
  obs.observe(el);
});
