/* ==========================================================================
   services.js - scroll animations + sticky service menu + mouse tilt
   ========================================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Reveal: add .in-view the first time an element is visible */
  function initReveal() {
    const seen = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); seen.unobserve(entry.target); }
    }), { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => seen.observe(el));
  }

  /* 2. Sticky menu: highlight the chip of the service on screen */
  function initServiceNav() {
    const links = Array.from(document.querySelectorAll('.svc-nav a'));
    if (!links.length) return;
    const watch = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }), { rootMargin: '-40% 0px -50% 0px' });
    links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) watch.observe(s); });
  }

  /* 3. Tilt: the visual panel leans towards the mouse */
  function initTilt() {
    if (reduceMotion) return;
    document.querySelectorAll('.svc-visual').forEach(panel => {
      panel.addEventListener('pointermove', e => {
        const r = panel.getBoundingClientRect();
        panel.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 8 + 'deg');
        panel.style.setProperty('--rx', ((e.clientY - r.top) / r.height - 0.5) * -8 + 'deg');
      });
      panel.addEventListener('pointerleave', () => {
        panel.style.setProperty('--rx', '0deg'); panel.style.setProperty('--ry', '0deg');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => { initReveal(); initServiceNav(); initTilt(); });
})();
