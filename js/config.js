/* ==========================================================================
   config.js - the ONE place for contact details and message wording.
   Edit values here; the wizard and the contact form read them.
   ========================================================================== */
window.YIS_CONFIG = {
  email: 'clicktrade_yis@outlook.com',
  whatsapp: { egypt: '201060413413', germany: '4917670639509' },   // digits only, with country code

  /* Contact-form delivery. Fill ONE of these (free accounts):
       web3formsKey : access key from web3forms.com (sent to your email)
       formspreeId  : the id in your formspree.io form URL (e.g. "xyzabcde")
     If both are empty, the form opens the visitor's email app instead. */
  web3formsKey: '9b0ba13f-6547-40f0-b928-5542d4002d69',
  formspreeId: '',

  /* wording used when answers are turned into a message */
  labels: {
    en: { hello: 'Hello ClickTradE Y.I.S,', intro: 'I would like to send a request:', service: 'Service', details: 'Details', from: 'From', to: 'To', name: 'Name', email: 'Email', phone: 'Phone', message: 'Message', thanks: 'Thank you.', subject: 'Request – ClickTradE Y.I.S' },
    de: { hello: 'Hallo ClickTradE Y.I.S,', intro: 'ich möchte eine Anfrage senden:', service: 'Leistung', details: 'Details', from: 'Von', to: 'Nach', name: 'Name', email: 'E-Mail', phone: 'Telefon', message: 'Nachricht', thanks: 'Vielen Dank.', subject: 'Anfrage – ClickTradE Y.I.S' },
    ar: { hello: 'مرحباً ClickTradE Y.I.S،', intro: 'أود إرسال طلب:', service: 'الخدمة', details: 'التفاصيل', from: 'من', to: 'إلى', name: 'الاسم', email: 'البريد', phone: 'الهاتف', message: 'الرسالة', thanks: 'شكراً.', subject: 'طلب – ClickTradE Y.I.S' }
  }
};

/* small helpers shared by the scripts */
window.YIS_UTIL = {
  lang() { const r = document.querySelector('input[name=lang]:checked'); return r ? r.id.slice(2) : 'en'; },
  wa(number, text) { return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text); },
  mailto(text) {
    const L = window.YIS_CONFIG.labels[this.lang()];
    return 'mailto:' + window.YIS_CONFIG.email + '?subject=' + encodeURIComponent(L.subject) + '&body=' + encodeURIComponent(text);
  },
  /* turns {service, details, from, to, name, email, phone, message} into a readable text */
  message(f) {
    const L = window.YIS_CONFIG.labels[this.lang()];
    const keys = ['service', 'details', 'from', 'to', 'message', 'name', 'email', 'phone'];
    const lines = keys.filter(k => f[k]).map(k => L[k] + ': ' + f[k]);
    return [L.hello, L.intro, ''].concat(lines, ['', L.thanks]).join('\n');
  }
};
