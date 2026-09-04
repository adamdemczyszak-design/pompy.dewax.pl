/* =====================================================================
   DEWAX · kalkulator kosztu systemu (publiczny, bez logowania)
   ---------------------------------------------------------------------
   ALGORYTM, CENY I ZAŁOŻENIA SĄ PRZENIESIONE 1:1 Z WERSJI PRODUKCYJNEJ
   (index.html z 25.08.2026). Zmieniono wyłącznie warstwę prezentacji,
   dostępność i zdarzenia analityczne. Testy: testy/kalkulator.test.mjs
   porównują wyniki z zapisanym wzorcem testy/kalkulator-wzorzec.json.

   Dane źródłowe (bez zmian):
   - ceny pomp: katalog Thermokrafft TK R290 2026 (brutto, sugerowane detaliczne)
   - stawka odwiertu: 130-145 zł/m netto (DEWAX)
   - montaż + materiał: 9 000 zł netto - ZAŁOŻENIE do potwierdzenia
   - ceny energii: prąd 1,04 zł/kWh (średnia G11 2026), gaz 0,42 zł/kWh ciepła,
     ekogroszek 0,32, olej 0,55
   - efektywność sezonowa to jawne założenie kalkulatora, nie SCOP urządzenia
   ===================================================================== */
(function (root) {
  'use strict';

  var POMPY = [
    { id: 'TK-G2S/R290', min: 2,  max: 11, cena: 23990 },
    { id: 'TK-G3S/R290', min: 4,  max: 13, cena: 26190 },
    { id: 'TK-G5S/R290', min: 6,  max: 18, cena: 27990 },
    { id: 'TK-G6S/R290', min: 10, max: 23, cena: 30790 }
  ];
  var EFF = { podl: 4.2, mix: 3.8, grz: 3.5 };
  var PALIWA = {
    gaz:    { n: 'gazem ziemnym',   c: 0.42 },
    wegiel: { n: 'ekogroszkiem',    c: 0.32 },
    olej:   { n: 'olejem opałowym', c: 0.55 },
    prad:   { n: 'prądem',          c: 1.04 },
    brak:   null
  };
  var PRAD = 1.04, VAT = 1.08, STAWKA_MIN = 130, STAWKA_MAX = 145, MONTAZ = 9000, MAX_OTWOR = 100;
  var W_NA_METR = 50; // 0,05 kW z metra odwiertu - założenie kalkulatora
  var MIN_M2 = 30, MAX_M2 = 1500;

  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function pl(n) { return String(n).replace('.', ','); }

  /* ---------- czysta funkcja: stan -> wynik ---------- */
  function oblicz(S) {
    var pCO = S.m2 * S.std / 1000;
    var pCWU = S.os * 0.2;
    var moc = pCO + pCWU;

    var pompa = null;
    for (var i = 0; i < POMPY.length; i++) { if (moc <= POMPY[i].max * 0.9) { pompa = POMPY[i]; break; } }
    var kaskada = !pompa;
    if (kaskada) pompa = POMPY[POMPY.length - 1];

    var eff = EFF[S.odb];
    var pGrunt = moc * (1 - 1 / eff);
    var metry = Math.ceil(pGrunt / (W_NA_METR / 1000) / 10) * 10;
    var otwory = Math.max(1, Math.ceil(metry / MAX_OTWOR));
    var glebokosc = Math.round(metry / otwory / 5) * 5;
    metry = otwory * glebokosc;

    var eCO = pCO * 1900;
    var eCWU = S.os * 900;
    var kwh = (eCO + eCWU) / eff;
    var kosztRok = kwh * PRAD;

    var cOdwMin = metry * STAWKA_MIN * VAT, cOdwMax = metry * STAWKA_MAX * VAT;
    var cMont = MONTAZ * VAT;
    var sumaMin = pompa.cena + cOdwMin + cMont, sumaMax = pompa.cena + cOdwMax + cMont;

    var zrodlo, uwaga = '';
    var odw = otwory + ' odwiert' + (otwory > 1 ? 'y' : '') + ' pionow' + (otwory > 1 ? 'e' : 'y') + ' po ' + glebokosc + ' m';
    if (S.wj === 'nie') {
      zrodlo = otwory + ' × ' + glebokosc + ' m, do potwierdzenia po oględzinach';
      uwaga = 'Zaznaczyłeś, że wjazd wiertnicy jest niepewny. Jeśli okaże się niemożliwy, alternatywą są sondy koszowe HELIX albo kolektor poziomy. Wtedy koszt dolnego źródła policzymy inaczej.';
    } else if (S.dz === 'duza') {
      zrodlo = odw;
      uwaga = 'Przy tej wielkości działki alternatywą jest kolektor poziomy: tańszy w wykonaniu, ale zajmuje dużą powierzchnię. Porównamy oba warianty przy wycenie.';
    } else {
      zrodlo = odw;
    }
    if (kaskada) {
      uwaga = 'Twoje zapotrzebowanie (' + pl(moc.toFixed(1)) + ' kW) przekracza zakres, w którym pojedyncze urządzenie z serii TK pracuje z 10% zapasu (do ' + pl((POMPY[POMPY.length - 1].max * 0.9).toFixed(1)) + ' kW). Taki dom obsługuje układ kaskadowy z dwóch pomp. Dobór robimy po oględzinach, bo w tej skali liczy się też rozłożenie odwiertów i sposób sterowania. ' + uwaga;
    }

    var por = '';
    var stare = null, osz = null;
    if (S.pal !== 'brak' && PALIWA[S.pal]) {
      stare = (eCO + eCWU) * PALIWA[S.pal].c;
      osz = stare - kosztRok;
      if (osz > 0) por = 'Przy obecnym ogrzewaniu ' + PALIWA[S.pal].n + ' to samo ciepło kosztuje ok. ' + fmt(stare) + ' zł rocznie, czyli o ' + fmt(osz) + ' zł więcej.';
      else por = 'Uwaga: przy obecnym ogrzewaniu ' + PALIWA[S.pal].n + ' koszt roczny jest zbliżony. Oszczędność będzie niewielka i mówimy to wprost.';
    }

    return {
      moc: moc, pCO: pCO, pCWU: pCWU, pompa: pompa, kaskada: kaskada, eff: eff, pGrunt: pGrunt,
      metry: metry, otwory: otwory, glebokosc: glebokosc, kwh: kwh, kosztRok: kosztRok,
      cOdwMin: cOdwMin, cOdwMax: cOdwMax, cMont: cMont, sumaMin: sumaMin, sumaMax: sumaMax,
      zrodlo: zrodlo, uwaga: uwaga.trim(), por: por, stare: stare, osz: osz,
      cenaOd: Math.round(sumaMin), cenaDo: Math.round(sumaMax),
      cenaTekst: kaskada ? 'wycena po oględzinach' : fmt(Math.floor(sumaMin / 1000) * 1000) + ' – ' + fmt(Math.ceil(sumaMax / 1000) * 1000),
      WYNIK: { moc: +moc.toFixed(1), model: pompa.id, metry: metry, otwory: otwory, cenaOd: Math.round(sumaMin), cenaDo: Math.round(sumaMax) }
    };
  }

  var api = { POMPY: POMPY, EFF: EFF, PALIWA: PALIWA, PRAD: PRAD, VAT: VAT, STAWKA_MIN: STAWKA_MIN, STAWKA_MAX: STAWKA_MAX, MONTAZ: MONTAZ, MAX_OTWOR: MAX_OTWOR, W_NA_METR: W_NA_METR, MIN_M2: MIN_M2, MAX_M2: MAX_M2, oblicz: oblicz, fmt: fmt };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  root.DEWAX_KALK = api;

  /* ---------- warstwa interfejsu (tylko w przeglądarce) ---------- */
  if (typeof document === 'undefined') return;

  var $ = function (id) { return document.getElementById(id); };
  var card = $('kreator-karta');
  if (!card) return;

  var track = function (name, params) { if (root.dx && root.dx.track) root.dx.track(name, params); };
  var S = { m2: 150, std: 50, odb: 'podl', os: 4, pal: 'gaz', dz: 'mala', wj: 'tak', miasto: '' };
  var WYNIK = null, started = false, maxStep = 1, current = 1;

  function zaczeto() { if (started) return; started = true; track('calculator_started', {}); }

  /* opcje (segmenty) */
  function seg(box, key) {
    var el = $(box); if (!el) return;
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      Array.prototype.forEach.call(el.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var v = b.getAttribute('data-v'); S[key] = isNaN(+v) ? v : +v;
      zaczeto();
    });
  }
  seg('oStd', 'std'); seg('oOdb', 'odb'); seg('oPal', 'pal'); seg('oDz', 'dz'); seg('oWj', 'wj');

  /* metraż: suwak + pole */
  function setM2(v, fromInput) {
    v = Math.round(v || 0);
    if (!fromInput) v = Math.min(MAX_M2, Math.max(MIN_M2, v));
    S.m2 = v;
    var sl = $('m2'), nb = $('m2num');
    sl.value = Math.min(+sl.max, Math.max(+sl.min, v));
    if (!fromInput) nb.value = v;
    $('m2out').textContent = v + ' m²';
  }
  $('m2').addEventListener('input', function () { setM2(+this.value); zaczeto(); });
  $('m2num').addEventListener('input', function () { var v = parseInt(this.value, 10); if (isNaN(v)) return; setM2(v, true); zaczeto(); });
  $('m2num').addEventListener('blur', function () { var v = parseInt(this.value, 10); if (isNaN(v) || v < MIN_M2) v = MIN_M2; if (v > MAX_M2) v = MAX_M2; this.value = v; setM2(v); });
  $('m2num').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); this.blur(); go(2); } });
  $('os').addEventListener('input', function () { S.os = +this.value; $('vOs').textContent = S.os + (S.os === 1 ? ' osoba' : (S.os < 5 ? ' osoby' : ' osób')); zaczeto(); });
  $('miasto').addEventListener('input', function () { S.miasto = this.value.trim(); });

  /* kroki */
  function go(n, opts) {
    opts = opts || {};
    if (n > current && !opts.wynik) { track('calculator_step_completed', { step: current }); track('dobor_step', { step: n }); }
    current = n; if (n > maxStep) maxStep = n;
    for (var i = 1; i <= 4; i++) {
      var p = $('p' + i), t = $('t' + i);
      p.hidden = (i !== n);
      t.setAttribute('aria-selected', i === n ? 'true' : 'false');
      t.classList.toggle('done', i < n);
      t.disabled = !(i <= maxStep && (i < 4 || WYNIK));
    }
    if (!opts.cicho) {
      var y = card.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: Math.max(y, 0), behavior: reduced() ? 'auto' : 'smooth' });
      var h = $('p' + n).querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }
  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  Array.prototype.forEach.call(card.querySelectorAll('[data-go]'), function (b) {
    b.addEventListener('click', function () { var n = +this.getAttribute('data-go'); if (n === 4) policz(); else go(n); });
  });
  for (var k = 1; k <= 4; k++) { (function (n) { $('t' + n).addEventListener('click', function () { if (!this.disabled) go(n); }); })(k); }

  /* wynik */
  function policz() {
    var r = oblicz(S);
    WYNIK = r.WYNIK;
    $('rDom').textContent = S.m2 + ' m²' + (S.miasto ? ', ' + S.miasto : '');
    $('rTytul').textContent = r.kaskada ? 'Układ kaskadowy, dobór po oględzinach' : 'Thermokrafft ' + r.pompa.id;
    $('rZrodlo').textContent = 'Dolne źródło: ' + r.zrodlo;
    $('rCena').textContent = r.cenaTekst;
    $('rZlSuf').hidden = r.kaskada;
    $('rCenaU').textContent = r.kaskada ? 'zapotrzebowanie przekracza zakres pojedynczego urządzenia' : 'brutto, VAT 8% · pompa + dolne źródło + montaż i uruchomienie';
    $('rMoc').textContent = pl(r.moc.toFixed(1));
    $('rOdw').textContent = r.otwory + ' × ' + r.glebokosc;
    $('rKwh').textContent = fmt(r.kwh);
    $('rRok').textContent = fmt(r.kosztRok);
    $('pmW').innerHTML = Math.round(r.moc * 1000 / S.m2) + ' <small>W/m²</small>';
    $('pmKwh').innerHTML = pl((r.kwh / S.m2).toFixed(1)) + ' <small>kWh/m²·rok</small>';
    $('pmZl').innerHTML = pl((r.kosztRok / S.m2).toFixed(1)) + ' <small>zł/m²·rok</small>';
    $('pmInw').innerHTML = r.kaskada ? '— <small>wycena indywidualna</small>' : fmt(r.sumaMin / S.m2) + '–' + fmt(r.sumaMax / S.m2) + ' <small>zł/m²</small>';

    var rows = (r.kaskada
      ? '<tr><td>Pompa ciepła, układ kaskadowy z dwóch urządzeń</td><td>wycena po oględzinach</td></tr>'
      : '<tr><td>Pompa ciepła Thermokrafft ' + r.pompa.id + ' (' + r.pompa.min + '–' + r.pompa.max + ' kW)</td><td>' + fmt(r.pompa.cena) + ' zł</td></tr>')
      + '<tr><td>Dolne źródło: ' + r.metry + ' m odwiertu z sondami, wypełnieniem i próbą szczelności</td><td>' + fmt(r.cOdwMin) + ' – ' + fmt(r.cOdwMax) + ' zł</td></tr>'
      + '<tr><td>Montaż, uruchomienie i materiał kotłowni <span class="zal">· założenie</span></td><td>' + fmt(r.cMont) + ' zł</td></tr>'
      + '<tr class="sum"><td>Razem, szacunkowo</td><td>' + (r.kaskada ? 'wycena po oględzinach' : fmt(r.sumaMin) + ' – ' + fmt(r.sumaMax) + ' zł') + '</td></tr>';
    $('tbl').innerHTML = rows;

    var w = $('wBox'); w.hidden = !r.uwaga; w.innerHTML = r.uwaga ? '<b>Do sprawdzenia na działce.</b> ' + r.uwaga : '';

    $('rNote').innerHTML = '<p><b>Moc:</b> ' + S.m2 + ' m² × ' + S.std + ' W/m² plus ' + fmt(r.pCWU * 1000) + ' W na ciepłą wodę dla ' + S.os + ' os.</p>'
      + '<p><b>Długość odwiertu:</b> ' + pl(r.pGrunt.toFixed(1)) + ' kW odbierane z gruntu przy założonych ' + W_NA_METR + ' W z metra, maksymalnie ' + MAX_OTWOR + ' m na otwór (limit naszej wiertnicy HR-606S). Rzeczywistą wydajność metra ustala geologia działki, dlatego następnym krokiem jest DEWAX GEO.</p>'
      + '<p><b>Zużycie prądu:</b> przy założonej efektywności sezonowej ' + pl(r.eff) + ' i cenie 1,04 zł/kWh. ' + r.por + '</p>'
      + '<p>Efektywność sezonowa jest <b>założeniem kalkulatora</b>, a nie deklarowanym parametrem urządzenia. W szacunku nie ma zasobnika CWU, bufora, instalacji wewnątrz domu ani projektu robót geologicznych. To wyliczenie orientacyjne i nie stanowi oferty. Dokładną kwotę podajemy po obejrzeniu działki i sprawdzeniu geologii.</p>';

    go(4, { wynik: true });
    track('calculator_step_completed', { step: 3 });
    track('calculator_completed', WYNIK);
    track('dobor_result', { moc_kw: WYNIK.moc, model: WYNIK.model, metry: WYNIK.metry, otwory: WYNIK.otwory, cena_od: WYNIK.cenaOd, cena_do: WYNIK.cenaDo });
    try { sessionStorage.setItem('dx_calc', JSON.stringify(WYNIK)); } catch (e) {}
    if (root.dx && root.dx.obaKroki) root.dx.obaKroki();
  }

  /* przekazanie wyniku do formularza wyceny */
  var cta = $('ctaOferta');
  if (cta) cta.addEventListener('click', function () {
    var f = document.forms['wycena']; if (!f) return;
    if (f.metraz && !f.metraz.value) f.metraz.value = S.m2;
    if (f.miejscowosc && !f.miejscowosc.value && S.miasto) f.miejscowosc.value = S.miasto;
    if (WYNIK && f.wiadomosc && !f.wiadomosc.value) {
      f.wiadomosc.value = 'Z kalkulatora: pompa ' + WYNIK.model + ', moc ' + pl(WYNIK.moc) + ' kW, ' + WYNIK.otwory + ' x odwiert, razem ' + WYNIK.metry + ' m. Szacunek ' + fmt(WYNIK.cenaOd) + '-' + fmt(WYNIK.cenaDo) + ' zl.';
    }
  });

  go(1, { cicho: true });
})(typeof window !== 'undefined' ? window : globalThis);
