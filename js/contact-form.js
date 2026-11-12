/* ==========================================================================
   contact-form.js - sends the email form.
   1) web3formsKey or formspreeId set in config.js -> sent in the background
   2) otherwise -> opens the visitor's email app with the message prepared
   ========================================================================== */
(function () {
  'use strict';
  const U = window.YIS_UTIL, CFG = window.YIS_CONFIG;

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-mailform]');
    if (!form) return;

    async function post(url, payload) {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.elements.botcheck.value) return;                        // spam trap
      const topic = form.querySelector('input[name=topic]:checked');
      const data = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(),
                     service: topic ? topic.dataset[U.lang()] : '', message: form.elements.message.value.trim() };

      try {
        form.dataset.state = 'sending';
        if (CFG.web3formsKey) {
          await post('https://api.web3forms.com/submit', Object.assign({ access_key: CFG.web3formsKey, subject: CFG.labels[U.lang()].subject }, data));
        } else if (CFG.formspreeId) {
          await post('https://formspree.io/f/' + CFG.formspreeId, data);
        } else {
          window.location.href = U.mailto(U.message(data));
          form.dataset.state = 'mailto';
          return;
        }
        form.reset();
        form.dataset.state = 'ok';
      } catch (err) {
        form.dataset.state = 'err';
      }
    });
  });
})();
