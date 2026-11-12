/* ==========================================================================
   hero.js - the live shipment console + animated counters
   Texts live in index.html (so they stay translatable); this file only
   moves things and toggles CSS classes.
   ========================================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEP_DELAY = 2600;      // ms each step stays active
  const GLIDE_TIME = 1300;      // ms the marker needs to reach the next step
  const easeInOut = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  /* ---------- Counters: numbers count up when first seen ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length || reduceMotion) return;
    const run = el => {
      const target = Number(el.dataset.count), start = performance.now(), time = 1200;
      const tick = now => {
        const t = Math.min((now - start) / time, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    };
    const seen = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { run(e.target); seen.unobserve(e.target); }
    }));
    counters.forEach(el => seen.observe(el));
  }

  /* ---------- Console: marker travels along the route as steps advance ---------- */
  function initConsole() {
    const box = document.querySelector('[data-console]');
    if (!box) return;

    const route  = box.querySelector('[data-route]');
    const trail  = box.querySelector('[data-trail]');
    const marker = box.querySelector('[data-marker]');
    const steps  = Array.from(box.querySelectorAll('.track li'));
    const goods  = Array.from(box.querySelectorAll('.goods button'));
    const length = route.getTotalLength();

    trail.style.strokeDasharray = length;
    let current = 0, progress = 0, timer = null;

    // place marker + draw trail for progress 0..1
    function draw(p) {
      const pt = route.getPointAtLength(p * length);
      marker.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      trail.style.strokeDashoffset = length * (1 - p);
    }

    // smoothly move from the current progress to a target
    function glide(target, time) {
      const from = progress, begin = performance.now();
      const frame = now => {
        const t = Math.min((now - begin) / time, 1);
        progress = from + (target - from) * easeInOut(t);
        draw(progress);
        if (t < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }

    function showStep(index, time) {
      current = index;
      steps.forEach((li, n) => {
        li.classList.toggle('done', n < index);
        li.classList.toggle('active', n === index);
      });
      glide(index / (steps.length - 1), time || GLIDE_TIME);
    }

    const next = () => showStep((current + 1) % steps.length, current === steps.length - 1 ? 700 : GLIDE_TIME);
    const play = () => { if (!reduceMotion && !timer) timer = setInterval(next, STEP_DELAY); };
    const stop = () => { clearInterval(timer); timer = null; };

    // interactions
    steps.forEach((li, n) => li.addEventListener('click', () => { stop(); showStep(n); }));
    goods.forEach(btn => btn.addEventListener('click', () => {
      box.dataset.goods = btn.dataset.goods;
      goods.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      stop(); showStep(0, 600); play();
    }));
    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', play);

    showStep(0, 1);
    play();
  }

  document.addEventListener('DOMContentLoaded', () => { initCounters(); initConsole(); });
})();
