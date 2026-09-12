/* =====================================================================
   DEWAX · generator kreacji Meta · logika panelu
   Bez bibliotek. Stan w localStorage (klucz dx_generator_v1), eksport i import JSON.
   Treści: tresci.js (window.DX_TRESCI), miniatury: miniatury.js (window.DX_MINIATURY),
   wyniki: wyniki.json (ładowane fetch-em, gdy panel stoi na serwerze) albo window.DX_WYNIKI.
   ===================================================================== */
(function () {
  'use strict';
  var T = window.DX_TRESCI, MIN = window.DX_MINIATURY || {};
  var KOD_DOSTEPU = 'dobrzyca';          /* kod dostępu jak w kreatorze; zmień tutaj */
  var LIMIT_META = 8;                     /* maksimum kreacji jednocześnie w Meta */
  var KLUCZ = 'dx_generator_v1';
  var d = document;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ---------- stan ---------- */
  var stan = { odblokowany: false, statusy: {}, posty: '', filtry: {} };
  function wczytaj() { try { var s = JSON.parse(localStorage.getItem(KLUCZ) || '{}'); Object.assign(stan, s); } catch (e) {} }
  function zapisz() { try { localStorage.setItem(KLUCZ, JSON.stringify(stan)); } catch (e) {} }
  wczytaj();

  /* ---------- składanie kreacji ---------- */
  function link(kod, cta) {
    var u = T.utm;
    return T.strona + '?utm_source=' + u.source + '&utm_medium=' + u.medium + '&utm_campaign=' + u.campaign + '&utm_content=' + kod + (cta.kotwica || '');
  }
  function zloz(h, b, c) {
    var kod = h.id + '-' + b.id + '-' + c.id;
    var fotoId = (h.typ === 'zdjęcie z placu' || h.typ === 'historia') ? h.foto : b.foto;
    var foto = T.zdjecia.filter(function (z) { return z.id === fotoId; })[0] || T.zdjecia[0];
    return {
      kod: kod, h: h, b: b, c: c,
      tekst: h.tekst + '\n\n' + b.tekst + '\n\n' + c.tekst,
      naglowek: c.naglowek, opis: b.opis, link: link(kod, c), foto: foto,
      nazwaReklamy: kod + ' | ' + h.nazwa + ' | ' + b.nazwa,
      uwagi: [h, b, c].filter(function (x) { return x.uwaga; }).map(function (x) { return x.id + ': ' + x.uwaga; })
    };
  }
  var KREACJE = [];
  T.hooki.forEach(function (h) { T.korzysci.forEach(function (b) { T.cta.forEach(function (c) { KREACJE.push(zloz(h, b, c)); }); }); });
  var wgKodu = {}; KREACJE.forEach(function (k) { wgKodu[k.kod] = k; });

  /* ---------- lint tonu (te same zasady co lint.mjs) ---------- */
  function lint(k) {
    var Z = T.zasady, out = [];
    var calosc = k.tekst + ' ' + k.naglowek + ' ' + k.opis;
    Z.zakazaneZnaki.forEach(function (zn) { if (calosc.indexOf(zn) >= 0) out.push('zakazany znak „' + zn + '”'); });
    var low = calosc.toLowerCase();
    Z.zakazane.forEach(function (s) { if (low.indexOf(s) >= 0) out.push('zakazane słowo „' + s + '”'); });
    k.tekst.split(/(?<=[.?])\s+/).forEach(function (zd) { var n = zd.trim().split(/\s+/).filter(Boolean).length; if (n > Z.maksSlowWZdaniu) out.push('zdanie ma ' + n + ' słów'); });
    if (k.tekst.length > Z.maksZnakowTekstu) out.push('tekst ' + k.tekst.length + ' znaków (maks ' + Z.maksZnakowTekstu + ')');
    if (k.naglowek.length > Z.maksZnakowNaglowka) out.push('nagłówek ' + k.naglowek.length + ' znaków');
    if (k.opis.length > Z.maksZnakowOpisu) out.push('opis ' + k.opis.length + ' znaków');
    return out;
  }

  /* ---------- statusy ---------- */
  var STATUSY = { biblioteka: 'w bibliotece', kolejka: 'w kolejce', meta: 'wysłana do Meta', stop: 'zatrzymana' };
  function statusK(kod) { return (stan.statusy[kod] || {}).status || 'biblioteka'; }
  function wpis(kod) { return stan.statusy[kod] = stan.statusy[kod] || { status: 'biblioteka' }; }
  function ileMeta() { return KREACJE.filter(function (k) { return statusK(k.kod) === 'meta'; }).length; }
  function ustawStatus(kod, s) {
    var w = wpis(kod);
    if (s === 'meta') {
      if (ileMeta() >= LIMIT_META) { komunikat('W Meta jest już ' + LIMIT_META + ' kreacji. Najpierw zatrzymaj jedną z nich.'); return false; }
      w.od = new Date().toISOString().slice(0, 10);
    }
    if (s === 'stop') w.do = new Date().toISOString().slice(0, 10);
    w.status = s; zapisz(); rysuj(); return true;
  }

  /* ---------- wyniki (wyniki.json) ---------- */
  var WYNIKI = window.DX_WYNIKI || { aktualizacja: null, kreacje: {} };
  function wczytajWyniki() {
    if (!window.fetch) return;
    fetch('wyniki.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) { WYNIKI = j; rysujWyniki(); rysujNaglowek(); } }).catch(function () {});
  }

  /* ---------- pomocnicze ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function komunikat(t) { var el = $('#komunikat'); el.textContent = t; el.hidden = false; clearTimeout(komunikat.t); komunikat.t = setTimeout(function () { el.hidden = true; }, 3500); }
  function kopiuj(tekst, co) {
    var ok = function () { komunikat('Skopiowano: ' + co); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tekst).then(ok, function () { kopiujStary(tekst); ok(); });
    else { kopiujStary(tekst); ok(); }
  }
  function kopiujStary(tekst) { var ta = d.createElement('textarea'); ta.value = tekst; d.body.appendChild(ta); ta.select(); try { d.execCommand('copy'); } catch (e) {} d.body.removeChild(ta); }
  function paczka(k) {
    var w = stan.statusy[k.kod] || {};
    return 'NAZWA REKLAMY: ' + k.nazwaReklamy + '\n' + 'ZDJĘCIE: ' + k.foto.plik + ' (' + k.foto.format + ')\n\n' + 'TEKST GŁÓWNY:\n' + k.tekst + '\n\n' + 'NAGŁÓWEK: ' + k.naglowek + '\nOPIS: ' + k.opis + '\nPRZYCISK: Więcej informacji\nADRES: ' + k.link + (w.adId ? '\nID REKLAMY W META: ' + w.adId : '') + '\n';
  }
  function zl(n) { return (Math.round(n * 100) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł'; }

  /* ---------- rysowanie ---------- */
  function rysujNaglowek() {
    var wMeta = ileMeta(), wKol = KREACJE.filter(function (k) { return statusK(k.kod) === 'kolejka'; }).length;
    var leady = 0; Object.keys(WYNIKI.kreacje || {}).forEach(function (kod) { leady += (WYNIKI.kreacje[kod].leady || 0); });
    $('#s-biblioteka').textContent = KREACJE.length;
    $('#s-meta').textContent = wMeta + ' / ' + LIMIT_META;
    $('#s-kolejka').textContent = wKol;
    $('#s-leady').textContent = leady;
    $('#s-aktualizacja').textContent = WYNIKI.aktualizacja ? 'wyniki z ' + WYNIKI.aktualizacja : 'wyniki: brak danych';
  }

  function wierszBiblioteki(k) {
    var s = statusK(k.kod), l = lint(k), w = stan.statusy[k.kod] || {};
    var mini = MIN[k.foto.id] ? '<img src="' + MIN[k.foto.id] + '" alt="' + esc(k.foto.nazwa) + '" loading="lazy">' : '';
    return '<tr data-kod="' + k.kod + '" class="st-' + s + '">' +
      '<td class="mono">' + k.kod + '</td>' +
      '<td><b>' + esc(k.h.typ) + '</b><br><span class="mut">' + esc(k.h.nazwa) + '</span></td>' +
      '<td>' + esc(k.b.nazwa) + '</td>' +
      '<td>' + esc(k.c.nazwa) + '</td>' +
      '<td class="foto">' + mini + '</td>' +
      '<td><span class="pill p-' + s + '">' + STATUSY[s] + '</span>' + (w.adId ? '<br><span class="mono mut">' + esc(w.adId) + '</span>' : '') + '</td>' +
      '<td>' + (k.uwagi.length ? '<span class="pill p-uwaga" title="' + esc(k.uwagi.join(' ')) + '">do potwierdzenia</span>' : '') + (l.length ? '<span class="pill p-lint" title="' + esc(l.join('; ')) + '">lint</span>' : '') + '</td>' +
      '<td class="akcje"><button class="btn b-out" data-akcja="podglad">Podgląd</button>' + (s === 'biblioteka' ? '<button class="btn b-pri" data-akcja="kolejka">Do kolejki</button>' : '') + '</td>' +
      '</tr>';
  }

  function rysujBiblioteke() {
    var f = stan.filtry, tb = $('#tabela tbody');
    var lista = KREACJE.filter(function (k) {
      if (f.hook && k.h.id !== f.hook) return false;
      if (f.korzysc && k.b.id !== f.korzysc) return false;
      if (f.cta && k.c.id !== f.cta) return false;
      if (f.status && statusK(k.kod) !== f.status) return false;
      if (f.szukaj) { var q = f.szukaj.toLowerCase(); if ((k.kod + ' ' + k.tekst + ' ' + k.naglowek).toLowerCase().indexOf(q) < 0) return false; }
      return true;
    });
    tb.innerHTML = lista.map(wierszBiblioteki).join('');
    $('#licznik').textContent = lista.length + ' z ' + KREACJE.length;
  }

  function rysujKolejke() {
    var wMeta = KREACJE.filter(function (k) { return statusK(k.kod) === 'meta'; });
    var wKol = KREACJE.filter(function (k) { return statusK(k.kod) === 'kolejka'; });
    var stop = KREACJE.filter(function (k) { return statusK(k.kod) === 'stop'; });
    function wiersz(k, akcje) {
      var w = stan.statusy[k.kod] || {};
      return '<li data-kod="' + k.kod + '"><div class="kol-op"><span class="mono">' + k.kod + '</span> <b>' + esc(k.h.nazwa) + '</b> · ' + esc(k.b.nazwa) + ' · ' + esc(k.c.nazwa) +
        (w.od ? '<span class="mut"> · w Meta od ' + w.od + '</span>' : '') + (w.do ? '<span class="mut"> · zatrzymana ' + w.do + '</span>' : '') +
        (w.adId ? '<span class="mono mut"> · ' + esc(w.adId) + '</span>' : '') + '</div><div class="akcje">' + akcje + '</div></li>';
    }
    $('#lista-meta').innerHTML = wMeta.length ? wMeta.map(function (k) { return wiersz(k, '<button class="btn b-out" data-akcja="podglad">Podgląd</button><button class="btn b-out" data-akcja="stop">Zatrzymaj</button>'); }).join('') : '<li class="mut">Nic jeszcze nie wysłano do Meta.</li>';
    $('#lista-kolejka').innerHTML = wKol.length ? wKol.map(function (k) { return wiersz(k, '<button class="btn b-out" data-akcja="podglad">Podgląd</button><button class="btn b-pri" data-akcja="meta"' + (ileMeta() >= LIMIT_META ? ' disabled title="Limit ' + LIMIT_META + ' w Meta"' : '') + '>Wysłana do Meta</button><button class="btn b-out" data-akcja="biblioteka">Wróć do biblioteki</button>'); }).join('') : '<li class="mut">Kolejka jest pusta. W bibliotece kliknij „Do kolejki”.</li>';
    $('#lista-stop').innerHTML = stop.length ? stop.map(function (k) { return wiersz(k, '<button class="btn b-out" data-akcja="podglad">Podgląd</button><button class="btn b-out" data-akcja="kolejka">Znów do kolejki</button>'); }).join('') : '<li class="mut">Brak.</li>';
    $('#limit-info').textContent = 'W Meta: ' + wMeta.length + ' z ' + LIMIT_META + '. Wolne miejsca: ' + (LIMIT_META - wMeta.length) + '.';
    $('#kopiuj-paczke').disabled = !wMeta.length && !wKol.length;
  }

  function rysujWyniki() {
    var tb = $('#wyniki tbody'), wiersze = [], sum = { leady: 0, wydatki: 0, wysw: 0, klik: 0 };
    var kody = {};
    Object.keys(stan.statusy).forEach(function (kod) { if (stan.statusy[kod].status === 'meta' || stan.statusy[kod].status === 'stop') kody[kod] = 1; });
    Object.keys(WYNIKI.kreacje || {}).forEach(function (kod) { kody[kod] = 1; });
    Object.keys(kody).sort().forEach(function (kod) {
      var w = WYNIKI.kreacje[kod] || {}, st = stan.statusy[kod] || {}, k = wgKodu[kod];
      var leady = w.leady || 0, wyd = w.wydatki || 0;
      sum.leady += leady; sum.wydatki += wyd; sum.wysw += (w.wyswietlenia || 0); sum.klik += (w.klikniecia || 0);
      wiersze.push('<tr><td class="mono">' + esc(kod) + '</td><td>' + (k ? esc(k.h.nazwa + ' · ' + k.b.nazwa + ' · ' + k.c.nazwa) : esc(w.nazwa || '')) + '</td>' +
        '<td><span class="pill p-' + (st.status || 'biblioteka') + '">' + STATUSY[st.status || 'biblioteka'] + '</span></td><td>' + (st.od || '') + '</td>' +
        '<td class="num">' + (w.wyswietlenia != null ? w.wyswietlenia.toLocaleString('pl-PL') : '') + '</td><td class="num">' + (w.klikniecia != null ? w.klikniecia.toLocaleString('pl-PL') : '') + '</td>' +
        '<td class="num">' + (w.wydatki != null ? zl(wyd) : '') + '</td><td class="num"><b>' + leady + '</b></td><td class="num">' + (leady ? zl(wyd / leady) : (wyd ? 'brak leadów' : '')) + '</td></tr>');
    });
    tb.innerHTML = wiersze.length ? wiersze.join('') : '<tr><td colspan="9" class="mut">Brak kreacji w Meta i brak danych w wyniki.json.</td></tr>';
    $('#wyniki tfoot').innerHTML = wiersze.length ? '<tr><th colspan="4">Razem</th><th class="num">' + sum.wysw.toLocaleString('pl-PL') + '</th><th class="num">' + sum.klik.toLocaleString('pl-PL') + '</th><th class="num">' + zl(sum.wydatki) + '</th><th class="num">' + sum.leady + '</th><th class="num">' + (sum.leady ? zl(sum.wydatki / sum.leady) : '') + '</th></tr>' : '';
    $('#wyniki-data').textContent = WYNIKI.aktualizacja ? 'Dane z ' + WYNIKI.aktualizacja + (WYNIKI.zrodlo ? ' (' + WYNIKI.zrodlo + ')' : '') : 'Plik wyniki.json nie ma jeszcze danych.';
  }

  function rysujZrodla() {
    var el = $('#zrodla-lista');
    var bloki = [].concat(T.hooki.map(function (h) { return { id: h.id, typ: 'hook · ' + h.typ, z: h.zrodlo, u: h.uwaga }; }), T.korzysci.map(function (b) { return { id: b.id, typ: 'korzyść · ' + b.nazwa, z: b.zrodlo, u: b.uwaga }; }), T.cta.map(function (c) { return { id: c.id, typ: 'CTA · ' + c.nazwa, z: c.zrodlo, u: c.uwaga }; }));
    el.innerHTML = bloki.map(function (b) { return '<li><span class="mono">' + b.id + '</span> <b>' + esc(b.typ) + '</b><br><span class="mut">' + esc(b.z) + '</span>' + (b.u ? '<br><span class="pill p-uwaga">do potwierdzenia</span> <span class="mut">' + esc(b.u) + '</span>' : '') + '</li>'; }).join('');
    $('#zdjecia-lista').innerHTML = T.zdjecia.map(function (z) { return '<li>' + (MIN[z.id] ? '<img src="' + MIN[z.id] + '" alt="' + esc(z.nazwa) + '" loading="lazy">' : '') + '<div><b>' + esc(z.nazwa) + '</b><br><span class="mono mut">' + esc(z.plik) + '</span> · ' + esc(z.format) + '<br><span class="mut">' + esc(z.opis) + '</span></div></li>'; }).join('');
    $('#zakazane').textContent = T.zasady.zakazane.join(', ') + ' oraz znaki: ' + T.zasady.zakazaneZnaki.join(' ');
    $('#posty').value = stan.posty || '';
  }

  function rysujPodglad(kod) {
    var k = wgKodu[kod]; if (!k) return;
    var w = stan.statusy[kod] || {}, s = statusK(kod), l = lint(k);
    var box = $('#podglad');
    box.innerHTML =
      '<div class="pg-head"><span class="mono">' + k.kod + '</span><span class="pill p-' + s + '">' + STATUSY[s] + '</span><button class="btn b-out" data-akcja="zamknij">Zamknij</button></div>' +
      '<div class="pg-grid">' +
      '<div class="pg-foto">' + (MIN[k.foto.id] ? '<img src="' + MIN[k.foto.id] + '" alt="' + esc(k.foto.nazwa) + '">' : '') + '<p><b>' + esc(k.foto.nazwa) + '</b><br><span class="mono mut">' + esc(k.foto.plik) + '</span><br><span class="mut">' + esc(k.foto.format) + '. Wgraj ten plik z repozytorium jako obraz reklamy.</span></p></div>' +
      '<div class="pg-tekst">' +
      '<label>Tekst główny <button class="btn b-mini" data-kopiuj="tekst">Kopiuj</button></label><pre>' + esc(k.tekst) + '</pre>' +
      '<div class="pg-2"><div><label>Nagłówek <button class="btn b-mini" data-kopiuj="naglowek">Kopiuj</button></label><p>' + esc(k.naglowek) + '</p></div><div><label>Opis <button class="btn b-mini" data-kopiuj="opis">Kopiuj</button></label><p>' + esc(k.opis) + '</p></div></div>' +
      '<label>Adres docelowy (z utm_content, po nim rozpoznasz kreację w GA4 i w leadach) <button class="btn b-mini" data-kopiuj="link">Kopiuj</button></label><p class="mono small">' + esc(k.link) + '</p>' +
      '<label>Nazwa reklamy w Meta (wpisz ją dokładnie tak, wtedy wyniki z Meta da się przypisać do kreacji) <button class="btn b-mini" data-kopiuj="nazwa">Kopiuj</button></label><p class="mono small">' + esc(k.nazwaReklamy) + '</p>' +
      (k.uwagi.length ? '<div class="uwaga"><b>Do potwierdzenia przed wysłaniem:</b><ul>' + k.uwagi.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul></div>' : '') +
      (l.length ? '<div class="uwaga"><b>Lint tonu:</b> ' + esc(l.join('; ')) + '</div>' : '') +
      '</div></div>' +
      '<div class="pg-foot">' +
      '<button class="btn b-pri" data-kopiuj="paczka">Kopiuj wszystko do Meta</button>' +
      (s !== 'kolejka' && s !== 'meta' ? '<button class="btn b-out" data-akcja="kolejka">Do kolejki</button>' : '') +
      (s === 'kolejka' ? '<button class="btn b-out" data-akcja="meta">Oznacz: wysłana do Meta</button>' : '') +
      (s === 'meta' ? '<button class="btn b-out" data-akcja="stop">Zatrzymaj (zwolnij miejsce)</button>' : '') +
      (s !== 'biblioteka' ? '<button class="btn b-out" data-akcja="biblioteka">Wróć do biblioteki</button>' : '') +
      '<label class="inl">ID reklamy w Meta <input id="pg-adid" value="' + esc(w.adId || '') + '" placeholder="np. 120248421960750027"></label>' +
      '<label class="inl">Notatka <input id="pg-notatka" value="' + esc(w.notatka || '') + '" placeholder="np. odrzucona 14.09, poprawiony tekst"></label>' +
      '<button class="btn b-out" data-akcja="zapisz">Zapisz</button>' +
      '</div>';
    box.dataset.kod = kod; box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function rysuj() { rysujNaglowek(); rysujBiblioteke(); rysujKolejke(); rysujWyniki(); }

  /* ---------- zdarzenia ---------- */
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var tr = b.closest('[data-kod]'); var kod = tr ? tr.dataset.kod : ($('#podglad').dataset.kod || '');
    var akcja = b.dataset.akcja, kop = b.dataset.kopiuj;
    if (kop && kod) {
      var k = wgKodu[kod];
      var mapa = { tekst: [k.tekst, 'tekst główny'], naglowek: [k.naglowek, 'nagłówek'], opis: [k.opis, 'opis'], link: [k.link, 'adres'], nazwa: [k.nazwaReklamy, 'nazwa reklamy'], paczka: [paczka(k), 'komplet kreacji ' + kod] };
      kopiuj(mapa[kop][0], mapa[kop][1]); return;
    }
    if (!akcja) return;
    if (akcja === 'podglad') rysujPodglad(kod);
    else if (akcja === 'zamknij') { $('#podglad').hidden = true; }
    else if (akcja === 'zapisz') { var w = wpis(kod); w.adId = $('#pg-adid').value.trim(); w.notatka = $('#pg-notatka').value.trim(); zapisz(); rysuj(); komunikat('Zapisano ' + kod); }
    else if (akcja in STATUSY) { if (ustawStatus(kod, akcja)) rysujPodglad(kod); }
    else if (akcja === 'kopiuj-paczke') {
      var lista = KREACJE.filter(function (k) { var s = statusK(k.kod); return s === 'meta' || s === 'kolejka'; });
      kopiuj(lista.map(paczka).join('\n' + '='.repeat(60) + '\n\n'), lista.length + ' kreacji (w Meta i w kolejce)');
    }
    else if (akcja === 'eksport') {
      var blob = new Blob([JSON.stringify({ wersja: T.wersja, data: new Date().toISOString(), stan: stan }, null, 2)], { type: 'application/json' });
      var a = d.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'generator-dewax-stan-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
    }
    else if (akcja === 'import') { $('#plik-import').click(); }
    else if (akcja === 'zapisz-posty') { stan.posty = $('#posty').value; zapisz(); komunikat('Zapisano posty w tej przeglądarce'); }
    else if (akcja === 'wyloguj') { stan.odblokowany = false; zapisz(); location.reload(); }
  });
  $('#plik-import').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var r = new FileReader(); r.onload = function () { try { var j = JSON.parse(r.result); if (j.stan) { Object.assign(stan, j.stan); zapisz(); rysuj(); rysujZrodla(); komunikat('Wczytano stan z pliku'); } } catch (e) { komunikat('To nie jest plik stanu generatora'); } }; r.readAsText(f);
  });
  $$('#filtry select, #filtry input').forEach(function (el) { el.addEventListener('input', function () { stan.filtry[el.name] = el.value; zapisz(); rysujBiblioteke(); }); });
  $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { $$('.tabs button').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); $$('.panel').forEach(function (p) { p.hidden = p.id !== b.dataset.panel; }); if (b.dataset.panel === 'p-wyniki') wczytajWyniki(); }); });

  /* ---------- brama z kodem ---------- */
  function otworz() { $('#brama').hidden = true; $('#app').hidden = false; wypelnijFiltry(); rysuj(); rysujZrodla(); wczytajWyniki(); }
  function wypelnijFiltry() {
    $('[name=hook]').innerHTML = '<option value="">wszystkie hooki</option>' + T.hooki.map(function (h) { return '<option value="' + h.id + '">' + esc(h.id + ' · ' + h.typ) + '</option>'; }).join('');
    $('[name=korzysc]').innerHTML = '<option value="">wszystkie korzyści</option>' + T.korzysci.map(function (b) { return '<option value="' + b.id + '">' + esc(b.id + ' · ' + b.nazwa) + '</option>'; }).join('');
    $('[name=cta]').innerHTML = '<option value="">wszystkie CTA</option>' + T.cta.map(function (c) { return '<option value="' + c.id + '">' + esc(c.id + ' · ' + c.nazwa) + '</option>'; }).join('');
    Object.keys(stan.filtry).forEach(function (n) { var el = $('[name=' + n + ']'); if (el) el.value = stan.filtry[n]; });
  }
  $('#brama form').addEventListener('submit', function (e) {
    e.preventDefault();
    if ($('#kod').value.trim().toLowerCase() === KOD_DOSTEPU) { stan.odblokowany = true; zapisz(); otworz(); }
    else { $('#brama .err').textContent = 'Zły kod. Poproś Adama.'; }
  });
  if (stan.odblokowany) otworz(); else { $('#brama').hidden = false; $('#kod').focus(); }
})();
