/* =========================================================
   florianmachnow.de  ·  main.js
   Kein Tracking. Der Cal.com-Embed laedt ausschliesslich
   nach aktiver Zustimmung (Opt-in, DSGVO Art. 6 Abs. 1 a).
   ========================================================= */

/* -------------------------------------------------------
   1) ZENTRALE KONFIGURATION
   Nur diese Zeilen anpassen, wenn sich der Cal.com-Link
   oder die Zielseite nach der Buchung aendert.
   calLink = der Teil hinter cal.com/ , ohne https://
   ------------------------------------------------------- */
window.SITE_CONFIG = {
  calLink: 'florian-machnow-cmykql/30min',
  calOrigin: 'https://app.cal.com',
  consentKey: 'fm-cal-consent-v1',
  thankYouDe: '/danke.html',
  thankYouEn: '/en/thank-you.html'
};

(function () {
  'use strict';

  /* ---------- Footer-Jahr ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Cal.com Consent-Gate ---------- */
  var gate = document.getElementById('cal-consent');
  var target = document.getElementById('cal-embed');
  var acceptBtn = document.getElementById('cal-accept');
  if (!gate || !target || !acceptBtn) return;

  var cfg = window.SITE_CONFIG;
  var loaded = false;

  function loadCal() {
    if (loaded) return;
    loaded = true;

    gate.classList.add('is-hidden');
    target.setAttribute('aria-busy', 'true');

    /* Offizieller Cal.com Embed-Loader, erst jetzt ausgefuehrt */
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else { p(cal, ar); }
          return;
        }
        p(cal, ar);
      };
    })(window, cfg.calOrigin + '/embed/embed.js', 'init');

    window.Cal('init', { origin: 'https://cal.com' });
    window.Cal('inline', {
      elementOrSelector: '#cal-embed',
      calLink: cfg.calLink,
      layout: 'month_view'
    });
    window.Cal('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: { light: { 'cal-brand': '#B5451F' } }
    });

    /* Weiterleitung auf die eigene Danke-Seite.
       Cal.com bietet den Redirect nur in bezahlten Tarifen an.
       Der Embed sendet aber ein Ereignis, sobald eine Buchung
       durch ist. Darauf hoeren wir und leiten selbst weiter. */
    try {
      window.Cal('on', {
        action: 'bookingSuccessful',
        callback: function () {
          var isEN = window.location.pathname.indexOf('/en/') === 0;
          var url = isEN ? cfg.thankYouEn : cfg.thankYouDe;
          window.setTimeout(function () { window.location.href = url; }, 700);
        }
      });
    } catch (e) { /* Ohne Ereignis bleibt die Cal.com-Bestaetigung stehen */ }

    target.removeAttribute('aria-busy');
  }

  acceptBtn.addEventListener('click', function () {
    try { localStorage.setItem(cfg.consentKey, '1'); } catch (e) { /* Speicher blockiert */ }
    loadCal();
  });

  /* Frueher erteilte Zustimmung wiederherstellen */
  var stored = null;
  try { stored = localStorage.getItem(cfg.consentKey); } catch (e) { stored = null; }
  if (stored === '1') loadCal();

  /* Widerruf: Link mit data-consent-revoke */
  document.querySelectorAll('[data-consent-revoke]').forEach(function (el) {
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      try { localStorage.removeItem(cfg.consentKey); } catch (e) { /* noop */ }
      location.reload();
    });
  });
})();
