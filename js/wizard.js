/* ==========================================================================
   wizard.js - 4-step request wizard. Ends with a ready WhatsApp / email message.
   Markup: index.html -> <form data-wizard>
   ========================================================================== */
(function () {
  'use strict';
  const U = window.YIS_UTIL, CFG = window.YIS_CONFIG;

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-wizard]');
    if (!form) return;
    const panes = Array.from(form.querySelectorAll('.wiz-pane'));
    const dots = Array.from(form.querySelectorAll('.wiz-steps li'));
    const prev = form.querySelector('[data-prev]');
    const next = form.querySelector('[data-next]');
    const summary = form.querySelector('[data-summary]');
    const last = panes.length - 1;
    let step = 0;

    const value = name => (form.elements[name].value || '').trim();

    function fields() {
      const chosen = form.querySelector('input[name=service]:checked');
      return { service: chosen ? chosen.dataset[U.lang()] : '', details: value('details'), from: value('from'),
               to: value('to'), name: value('name'), email: value('email'), phone: value('phone') };
    }

    /* what must be filled before moving on */
    function isValid(n) {
      if (n === 0) return !!form.querySelector('input[name=service]:checked');
      if (n === 1) return !!value('details');
      if (n === 2) {
        const emailOk = !value('email') || form.elements.email.checkValidity();
        return !!value('name') && !!(value('email') || value('phone')) && emailOk;
      }
      return true;
    }

    function buildSummary() {
      const f = fields(), L = CFG.labels[U.lang()], text = U.message(f);
      summary.replaceChildren();
      ['service', 'details', 'from', 'to', 'name', 'email', 'phone'].forEach(key => {
        if (!f[key]) return;
        const dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = L[key]; dd.textContent = f[key];
        summary.append(dt, dd);
      });
      form.querySelector('[data-send=wa-eg]').href = U.wa(CFG.whatsapp.egypt, text);
      form.querySelector('[data-send=wa-de]').href = U.wa(CFG.whatsapp.germany, text);
      form.querySelector('[data-send=mail]').href = U.mailto(text);
    }

    function show(n) {
      step = n;
      panes.forEach((p, i) => p.classList.toggle('active', i === n));
      dots.forEach((d, i) => { d.classList.toggle('active', i === n); d.classList.toggle('done', i < n); });
      prev.hidden = n === 0;
      next.hidden = n === last;
      form.classList.remove('has-error');
      if (n === last) buildSummary();
    }

    function go(direction) {
      if (direction > 0 && !isValid(step)) { form.classList.add('has-error'); return; }
      show(Math.min(Math.max(step + direction, 0), last));
    }

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    form.addEventListener('submit', e => { e.preventDefault(); if (step < last) go(1); });
    document.querySelectorAll('input[name=lang]').forEach(r => r.addEventListener('change', () => { if (step === last) buildSummary(); }));

    /* buttons elsewhere ("Request this service") can pre-select a service */
    document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
      const radio = form.querySelector('input[name=service][value="' + link.dataset.service + '"]');
      if (radio) { radio.checked = true; show(1); }
    }));

    show(0);
  });
})();
