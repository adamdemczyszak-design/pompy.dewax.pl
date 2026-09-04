/* =====================================================================
   DEWAX · skrypt wspólny: nawigacja, pomiar zdarzeń (gtag, za zgodą przez
   Cookiebot), formularz wyceny, pasek mobilny, wspólny stan „koszt + geologia".
   Bez bibliotek zewnętrznych. Nie ustawia cookies; korzysta z sessionStorage
   (kategoria „niezbędne/funkcjonalne”) wyłącznie do zapamiętania, że użytkownik
   w tej sesji ukończył kalkulator i otworzył DEWAX GEO.
   ===================================================================== */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- pomiar: jedna funkcja, ta sama konwencja co dotychczas (gtag) ---------- */
  var dx = w.dx = w.dx || {};
  dx.track = function (name, params) {
    try { if (typeof w.gtag === 'function') w.gtag('event', name, params || {}); } catch (e) {}
    if (w.DX_DEBUG) { try { console.debug('[dx]', name, params || {}); } catch (e) {} }
  };
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- oba kroki wykonane: pokaż baner „poproś o ofertę” ---------- */
  dx.obaKroki = function () {
    var calc = !!ss('dx_calc'), geo = ss('dx_geo') === '1';
    $$('.both').forEach(function (b) { b.classList.toggle('on', calc && geo); });
    var wynikGeo = $('#wynik-geo-zrobione'); if (wynikGeo) wynikGeo.hidden = !geo;
  };

  /* ---------- nawigacja ---------- */
  var nav = $('#nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('stuck', w.scrollY > 8); };
    w.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    var brg = $('.burger', nav);
    if (brg) {
      brg.addEventListener('click', function () { var o = nav.classList.toggle('open'); brg.setAttribute('aria-expanded', String(o)); });
      $$('.links a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); brg.setAttribute('aria-expanded', 'false'); }); });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); brg.setAttribute('aria-expanded', 'false'); brg.focus(); } });
    }
    /* podświetlenie aktywnej sekcji */
    var linkFor = {}; $$('.links a[href^="#"]', nav).forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var secs = Object.keys(linkFor).map(function (id) { return d.getElementById(id); }).filter(Boolean);
    if ('IntersectionObserver' in w && secs.length) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { $$('.links a', nav).forEach(function (a) { a.removeAttribute('aria-current'); }); linkFor[en.target.id].setAttribute('aria-current', 'true'); } });
      }, { rootMargin: '-40% 0px -55% 0px' });
      secs.forEach(function (s) { io.observe(s); });
    }
  }

  /* ---------- zdarzenia: telefon, GEO, realizacja, kreator partnerski ---------- */
  $$('a[href^="tel:"]').forEach(function (a) { a.addEventListener('click', function () { dx.track('phone_clicked', { miejsce: a.getAttribute('data-miejsce') || 'strona' }); }); });
  $$('a[data-geo]').forEach(function (a) { a.addEventListener('click', function () { ss('dx_geo', '1'); dx.track('geo_clicked', { miejsce: a.getAttribute('data-geo') || 'strona' }); setTimeout(dx.obaKroki, 300); }); });
  var real = $('#realizacja-glowna');
  if (real && 'IntersectionObserver' in w) {
    var vio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { dx.track('realization_viewed', { id: real.getAttribute('data-id') || 'glowna' }); vio.disconnect(); } }); }, { threshold: .5 });
    vio.observe(real);
  }

  /* ---------- formularz wyceny: walidacja, komunikaty, blokada podwójnej wysyłki ---------- */
  var f = d.forms['wycena'];
  if (f) {
    var t0 = Date.now();
    var czas = $('#fczas');
    var started = false;
    var status = $('.status', f);
    var btn = $('button[type=submit]', f);
    var pola = [
      { el: f.imie, msg: 'Podaj imię, żebyśmy wiedzieli, jak się do Ciebie zwracać.', test: function (v) { return v.trim().length > 0; } },
      { el: f.email, msg: 'Podaj poprawny adres e-mail, na ten adres odeślemy wycenę.', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      { el: f.miejscowosc, msg: 'Podaj miejscowość inwestycji.', test: function (v) { return v.trim().length > 0; } },
      { el: f.metraz, msg: 'Metraż wpisz jako liczbę całkowitą, np. 150.', test: function (v) { return v === '' || /^\d+$/.test(v.trim()); } }
    ];
    f.setAttribute('novalidate', 'novalidate');
    f.addEventListener('focusin', function () { if (!started) { started = true; dx.track('quote_started', {}); } }, { once: true });

    function pokaz(p, zle) {
      var row = p.el.closest('.row'); var err = row && $('.err', row);
      p.el.setAttribute('aria-invalid', zle ? 'true' : 'false');
      if (row) row.classList.toggle('bad', zle);
      if (err) err.textContent = zle ? p.msg : '';
    }
    pola.forEach(function (p) { if (!p.el) return; p.el.addEventListener('blur', function () { if (p.el.value !== '' || p.el.required) pokaz(p, !p.test(p.el.value)); }); p.el.addEventListener('input', function () { if (p.el.getAttribute('aria-invalid') === 'true' && p.test(p.el.value)) pokaz(p, false); }); });

    f.addEventListener('submit', function (e) {
      var bledy = [];
      pola.forEach(function (p) { if (!p.el) return; var zle = !p.test(p.el.value); pokaz(p, zle); if (zle) bledy.push(p); });
      var zg = f.zgoda_dane; var zgRow = zg && zg.closest('.zgoda');
      var zgZle = zg && !zg.checked; if (zgRow) zgRow.classList.toggle('bad', !!zgZle);
      if (zgZle) bledy.push({ el: zg, msg: 'Potrzebujemy zgody na kontakt, żeby odpowiedzieć na zapytanie.' });
      if (bledy.length) {
        e.preventDefault();
        status.className = 'status err-all';
        status.textContent = bledy.length === 1 ? bledy[0].msg : 'Popraw ' + bledy.length + ' pola oznaczone na czerwono, potem wyślij ponownie.';
        bledy[0].el.focus();
        dx.track('form_error', { pola: bledy.map(function (b) { return b.el.name; }).join(',') });
        return;
      }
      if (f.getAttribute('data-sending') === '1') { e.preventDefault(); return; }
      f.setAttribute('data-sending', '1');
      if (czas) czas.value = Math.round((Date.now() - t0) / 1000);
      if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = 'Wysyłanie…'; }
      status.className = 'status ok'; status.textContent = 'Wysyłamy zapytanie…';
      dx.track('quote_submitted', { z_kalkulatora: /Z kalkulatora/.test(f.wiadomosc ? f.wiadomosc.value : '') ? 1 : 0, telefon: f.telefon && f.telefon.value ? 1 : 0 });
      /* jeśli przeglądarka wróci na stronę (wstecz) – odblokuj przycisk */
      setTimeout(function () { f.removeAttribute('data-sending'); if (btn) { btn.removeAttribute('aria-disabled'); btn.textContent = 'Wyślij zapytanie'; } }, 12000);
    });
  }

  /* ---------- pasek mobilny: nie zasłania formularza ani wyniku kalkulatora ---------- */
  var mbar = $('.mbar');
  if (mbar && 'IntersectionObserver' in w) {
    var hideWhen = ['form[name=wycena]', '#kreator-karta', 'footer.ft'].map(function (s) { return $(s); }).filter(Boolean);
    var vis = {};
    var mio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { vis[en.target.id || en.target.tagName] = en.isIntersecting; });
      var any = Object.keys(vis).some(function (k) { return vis[k]; });
      mbar.classList.toggle('hide', any);
    }, { threshold: .15 });
    hideWhen.forEach(function (el) { mio.observe(el); });
  }

  /* ---------- kotwice: focus na celu dla czytników ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.getAttribute('href').slice(1); var t = id && d.getElementById(id); if (!t) return;
      var h = t.matches('h1,h2,h3') ? t : $('h1,h2,h3', t);
      if (h) { h.setAttribute('tabindex', '-1'); setTimeout(function () { h.focus({ preventScroll: true }); }, 350); }
    });
  });

  dx.obaKroki();
})();
