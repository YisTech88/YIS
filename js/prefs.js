/* ==========================================================================
   prefs.js - remembers the visitor's colour theme + language,
              and builds the WhatsApp links with a ready-made message.
   Loaded in <head> so the saved theme is applied before the page paints.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Settings you may want to edit ---- */
  const DEFAULT_THEME = 'crimson';
  const WA_MESSAGE = {
    en: 'Hello ClickTradE Y.I.S, I would like to request a service.',
    de: 'Hallo ClickTradE Y.I.S, ich möchte eine Leistung anfragen.',
    ar: 'مرحباً ClickTradE Y.I.S، أود طلب خدمة.'
  };
  const KEY = { theme: 'yis-theme', lang: 'yis-lang' };

  /* ---- Safe storage helpers (storage can be blocked by the browser) ---- */
  const load = key => { try { return localStorage.getItem(key); } catch (e) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} };

  /* ---- Theme ---- */
  const root = document.documentElement;
  root.classList.add('js');                              // lets CSS know scripts are running
  function setTheme(name) {
    root.dataset.theme = name;
    document.querySelectorAll('[data-theme-set]').forEach(btn =>
      btn.setAttribute('aria-pressed', String(btn.dataset.themeSet === name)));
  }
  setTheme(load(KEY.theme) || DEFAULT_THEME);           // runs immediately

  /* ---- Language + WhatsApp (need the page to exist) ---- */
  function currentLang() {
    const checked = document.querySelector('input[name=lang]:checked');
    return checked ? checked.id.replace('l-', '') : 'en';
  }
  function updateWhatsApp() {
    const lang = currentLang();
    root.lang = lang;
    document.querySelectorAll('[data-wa]').forEach(link => {
      link.href = 'https://wa.me/' + link.dataset.wa + '?text=' + encodeURIComponent(WA_MESSAGE[lang]);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // theme buttons
    document.querySelectorAll('[data-theme-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        setTheme(btn.dataset.themeSet);
        save(KEY.theme, btn.dataset.themeSet);
        const picker = document.querySelector('.themes');
        if (picker) picker.removeAttribute('open');
      });
    });
    setTheme(root.dataset.theme);                       // refresh pressed states

    // language radios
    const saved = load(KEY.lang);
    if (saved && document.getElementById('l-' + saved)) document.getElementById('l-' + saved).checked = true;
    document.querySelectorAll('input[name=lang]').forEach(radio =>
      radio.addEventListener('change', () => { save(KEY.lang, currentLang()); updateWhatsApp(); }));
    updateWhatsApp();
  });
})();
