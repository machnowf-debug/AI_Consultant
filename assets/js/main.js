/* =========================================================
   florianmachnow.de  ·  main.js
   1) Cal.com Consent-Gate (Opt-in, DSGVO Art. 6 Abs. 1 a)
   2) Scroll-Reveal fuer Headlines und Bloecke
   3) Hochzaehlende Kennzahlen
   4) Hero als KI-Raum: neuronale Schichten auf Canvas
   Kein Tracking, keine externen Bibliotheken.
   ========================================================= */

window.SITE_CONFIG = {
  calLink: 'florian-machnow-cmykql/30min',
  calOrigin: 'https://app.cal.com',
  consentKey: 'fm-cal-consent-v1',
  thankYouDe: '/danke.html',
  thankYouEn: '/en/thank-you.html',
  aiDelayMs: 3000            /* Wann der Hero in den KI-Raum kippt */
};

(function () {
  'use strict';

  var cfg = window.SITE_CONFIG;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Footer-Jahr
     --------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------
     1) Scroll-Reveal
     --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal]');

  function showAll() {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (!('IntersectionObserver' in window) || reduced) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });

    /* Sicherheitsnetz.
       Die Einblendung darf niemals dazu fuehren, dass Inhalte dauerhaft
       unsichtbar bleiben. Das waere der schlimmste denkbare Fehlerfall.
       Deshalb zwei zusaetzliche Absicherungen:

       1) Alles, was beim Laden ohnehin schon im Bild steht, wird sofort
          gezeigt, ohne auf den Observer zu warten. Ein Element, das
          hoeher ist als das Fenster, erreicht den Schwellwert von 18 %
          sonst unter Umstaenden nie.
       2) Nach zwei Sekunden wird ohne Wenn und Aber alles eingeblendet,
          falls der Observer aus irgendeinem Grund nicht ausloest. */
    var showIfVisible = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var due = [];
      revealTargets.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) due.push(el);
      });
      if (!due.length) return;

      /* Wichtig: erst zeichnen lassen, dann die Klasse setzen.
         Wird beides im selben Frame erledigt, hat der Browser den
         Ausgangszustand nie dargestellt und ueberspringt die
         Ueberblendung. Die Zeilen stuenden dann einfach da,
         statt von links hereinzufahren. Zwei Frames Abstand
         genuegen zuverlaessig. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          due.forEach(function (el) {
            el.classList.add('is-in');
            revealObserver.unobserve(el);
          });
        });
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showIfVisible);
    } else {
      showIfVisible();
    }
    window.addEventListener('load', showIfVisible);
    window.setTimeout(showAll, 2000);
  }

  /* ---------------------------------------------------------
     2) Kennzahlen hochzaehlen
     --------------------------------------------------------- */
  var lang = document.documentElement.lang === 'en' ? 'en-GB' : 'de-DE';

  function formatNumber(value, decimals) {
    try {
      return value.toLocaleString(lang, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } catch (e) {
      return decimals ? value.toFixed(decimals) : String(Math.round(value));
    }
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = parseInt(el.getAttribute('data-duration') || '1500', 10);

    if (reduced) {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
      return;
    }

    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);          /* easeOutQuart, kein Nachwippen */
      el.textContent = prefix + formatNumber(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + formatNumber(target, decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------------------------------------------------------
     3) Hero: neuronale Schichten
     --------------------------------------------------------- */
  var hero = document.getElementById('hero');
  var canvas = document.getElementById('neural');

  if (hero && canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var nodes = [], edges = [], pulses = [];
    var W = 0, H = 0, dpr = 1;
    var aiMode = false, visible = true, rafId = null;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = hero.getBoundingClientRect();
      W = Math.max(rect.width, 320);
      H = Math.max(rect.height, 420);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var narrow = W < 760;
      var layout = narrow ? [4, 7, 7, 3] : [6, 10, 10, 10, 4];

      nodes = [];
      edges = [];
      pulses = [];

      var padX = W * (narrow ? 0.10 : 0.07);
      var usableW = W - padX * 2;
      var padY = H * 0.14;
      var usableH = H - padY * 2;

      layout.forEach(function (count, li) {
        var x = padX + (usableW * li) / (layout.length - 1);
        for (var i = 0; i < count; i++) {
          var y = padY + (usableH * (i + 0.5)) / count;
          nodes.push({
            x: x + (Math.random() - 0.5) * 14,
            y: y + (Math.random() - 0.5) * 18,
            r: li === 0 || li === layout.length - 1 ? 3.4 : 2.6,
            layer: li,
            act: Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2
          });
        }
      });

      /* Kanten zur naechsten Schicht */
      for (var li2 = 0; li2 < layout.length - 1; li2++) {
        var from = nodes.filter(function (n) { return n.layer === li2; });
        var to = nodes.filter(function (n) { return n.layer === li2 + 1; });
        from.forEach(function (a) {
          var picks = Math.min(narrow ? 2 : 3, to.length);
          var used = {};
          for (var k = 0; k < picks; k++) {
            var idx = Math.floor(Math.random() * to.length);
            if (used[idx]) continue;
            used[idx] = true;
            edges.push({ a: a, b: to[idx] });
          }
        });
      }
    }

    function spawnPulse() {
      var inputs = edges.filter(function (e) { return e.a.layer === 0; });
      if (!inputs.length) return;
      var e = inputs[Math.floor(Math.random() * inputs.length)];
      pulses.push({ e: e, t: 0, v: 0.010 + Math.random() * 0.010 });
    }

    function advancePulse(p) {
      p.e.b.act = 1;
      var next = edges.filter(function (e) { return e.a === p.e.b; });
      if (!next.length) return;
      var branches = Math.random() < 0.55 ? 2 : 1;
      for (var i = 0; i < branches && i < next.length; i++) {
        if (pulses.length > 90) break;
        pulses.push({ e: next[Math.floor(Math.random() * next.length)], t: 0, v: p.v });
      }
    }

    var palette = {
      light: { edge: 'rgba(20,33,61,0.16)', node: 'rgba(20,33,61,0.34)', hot: 'rgba(93,58,114,0.75)', pulse: 'rgba(93,58,114,0.85)' },
      dark:  { edge: 'rgba(199,176,217,0.16)', node: 'rgba(199,176,217,0.42)', hot: 'rgba(201,169,106,0.95)', pulse: 'rgba(228,201,240,0.95)' }
    };

    var lastSpawn = 0;

    function frame(ts) {
      rafId = requestAnimationFrame(frame);
      if (!visible) return;

      var c = aiMode ? palette.dark : palette.light;
      ctx.clearRect(0, 0, W, H);

      /* Kanten */
      ctx.lineWidth = 1;
      ctx.strokeStyle = c.edge;
      ctx.beginPath();
      for (var i = 0; i < edges.length; i++) {
        ctx.moveTo(edges[i].a.x, edges[i].a.y);
        ctx.lineTo(edges[i].b.x, edges[i].b.y);
      }
      ctx.stroke();

      /* Pulse */
      if (aiMode) {
        if (ts - lastSpawn > 190 && pulses.length < 70) { spawnPulse(); lastSpawn = ts; }
        for (var p = pulses.length - 1; p >= 0; p--) {
          var pu = pulses[p];
          pu.t += pu.v;
          if (pu.t >= 1) { advancePulse(pu); pulses.splice(p, 1); continue; }
          var px = pu.e.a.x + (pu.e.b.x - pu.e.a.x) * pu.t;
          var py = pu.e.a.y + (pu.e.b.y - pu.e.a.y) * pu.t;

          ctx.strokeStyle = c.pulse;
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.moveTo(pu.e.a.x + (pu.e.b.x - pu.e.a.x) * Math.max(0, pu.t - 0.16),
                     pu.e.a.y + (pu.e.b.y - pu.e.a.y) * Math.max(0, pu.t - 0.16));
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.globalAlpha = 1;

          ctx.fillStyle = c.pulse;
          ctx.beginPath();
          ctx.arc(px, py, 1.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* Knoten */
      for (var n = 0; n < nodes.length; n++) {
        var nd = nodes[n];
        nd.act *= 0.955;
        var breathe = 0.5 + 0.5 * Math.sin(ts / 1600 + nd.phase);
        var r = nd.r + nd.act * 3.2 + breathe * 0.5;

        if (nd.act > 0.05 && aiMode) {
          ctx.fillStyle = c.hot;
          ctx.globalAlpha = Math.min(nd.act, 1) * 0.28;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, r + 9 * nd.act, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = nd.act > 0.12 && aiMode ? c.hot : c.node;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    build();

    if (reduced) {
      /* Ein statisches Bild, keine Bewegung */
      aiMode = false;
      var cS = palette.light;
      ctx.strokeStyle = cS.edge;
      ctx.beginPath();
      edges.forEach(function (e) { ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); });
      ctx.stroke();
      ctx.fillStyle = cS.node;
      nodes.forEach(function (n) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); });
    } else {
      rafId = requestAnimationFrame(frame);

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }, { threshold: 0 }).observe(hero);
      }

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 220);
      });

      /* Umschlag in den KI-Raum */
      window.setTimeout(function () {
        aiMode = true;
        hero.classList.add('is-ai');
        scramble(document.querySelector('[data-scramble]'));
      }, cfg.aiDelayMs);
    }
  }

  /* ---------------------------------------------------------
     4) Kurzer Scramble auf der zweiten Headline-Zeile
     --------------------------------------------------------- */
  function scramble(el) {
    if (!el || reduced) return;
    var original = el.textContent;
    var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>{}[]|+=';
    var start = null, duration = 820;

    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var settled = Math.floor(original.length * p);
      var out = '';
      for (var i = 0; i < original.length; i++) {
        var ch = original.charAt(i);
        if (i < settled || ch === ' ' || ch === '.') out += ch;
        else out += glyphs.charAt(Math.floor(Math.random() * glyphs.length));
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = original;
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     5) Cal.com Consent-Gate
     --------------------------------------------------------- */
  var gate = document.getElementById('cal-consent');
  var target = document.getElementById('cal-embed');
  var acceptBtn = document.getElementById('cal-accept');
  if (!gate || !target || !acceptBtn) return;

  var loaded = false;

  function loadCal() {
    if (loaded) return;
    loaded = true;

    gate.classList.add('is-hidden');
    target.setAttribute('aria-busy', 'true');

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
      cssVarsPerTheme: { light: { 'cal-brand': '#5D3A72' } }
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

  var stored = null;
  try { stored = localStorage.getItem(cfg.consentKey); } catch (e) { stored = null; }
  if (stored === '1') loadCal();

  document.querySelectorAll('[data-consent-revoke]').forEach(function (el) {
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      try { localStorage.removeItem(cfg.consentKey); } catch (e) { /* noop */ }
      location.reload();
    });
  });
})();
