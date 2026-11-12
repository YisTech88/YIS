/* ==========================================================================
   compare.js - indicative freight comparison (no real prices).
   Scores are editable in MODES / WEIGHT below (1 = low, 5 = high).
   ========================================================================== */
(function () {
  'use strict';

  const MODES = {                       // speed, cost (5 = cheapest), fit per load type (0 = not suitable)
    road: { speed: 4, cost: 3, fit: { item: 5, container: 3 } },
    sea:  { speed: 2, cost: 5, fit: { item: 2, container: 5 } },
    air:  { speed: 5, cost: 1, fit: { item: 4, container: 0 } }
  };
  const WEIGHT = {                      // how much each priority values speed / cost / fit
    fastest:  { speed: 0.60, cost: 0.10, fit: 0.30 },
    balanced: { speed: 0.34, cost: 0.33, fit: 0.33 },
    cheapest: { speed: 0.10, cost: 0.60, fit: 0.30 }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-compare]');
    if (!root) return;

    function update() {
      const load = root.querySelector('input[name=load]:checked').value;
      const w = WEIGHT[root.querySelector('input[name=priority]:checked').value];

      Object.keys(MODES).map(key => {
        const m = MODES[key], fit = m.fit[load];
        return { key, m, fit, score: fit === 0 ? 0 : (m.speed * w.speed + m.cost * w.cost + fit * w.fit) / 5 };
      }).sort((a, b) => b.score - a.score).forEach((r, rank) => {
        const card = root.querySelector('[data-mode=' + r.key + ']');
        card.style.setProperty('--rank', rank);
        card.style.setProperty('--w', Math.round(r.score * 100) + '%');
        card.style.setProperty('--sp', r.m.speed * 20 + '%');
        card.style.setProperty('--co', r.m.cost * 20 + '%');
        card.style.setProperty('--fi', r.fit * 20 + '%');
        card.classList.toggle('best', rank === 0);
        card.classList.toggle('off', r.fit === 0);
      });
    }

    root.addEventListener('change', update);
    update();
  });
})();
