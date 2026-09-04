/* Testy struktury stron: jeden H1, kotwice z nawigacji i .htaccess istnieją,
   każdy <img> ma alt, pliki wskazane w src/href istnieją lokalnie,
   dane strukturalne są poprawnym JSON-em, kluczowe id kalkulatora są na miejscu. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const STRONY = ['index.html', 'pompy.html', 'dla-instalatorow.html', 'podziekowanie.html', '404.html', 'polityka-prywatnosci.html'];
const html = {};
for (const s of STRONY) html[s] = await readFile(join(ROOT, s), 'utf8');

const ids = (h) => new Set([...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));

for (const s of STRONY) {
  test(`${s}: dokładnie jeden H1`, () => {
    assert.equal((html[s].match(/<h1[\s>]/g) || []).length, 1);
  });
  test(`${s}: każdy obraz ma alt`, () => {
    for (const m of html[s].matchAll(/<img\b[^>]*>/g)) assert.match(m[0], /\salt="/, m[0].slice(0, 120));
  });
  test(`${s}: kotwice wewnętrzne prowadzą do istniejących id`, () => {
    const own = ids(html[s]);
    for (const m of html[s].matchAll(/href="(#|index\.html#)([^"]+)"/g)) {
      const target = m[1] === '#' ? own : ids(html['index.html']);
      assert.ok(target.has(m[2]), `brak celu kotwicy #${m[2]} (${m[1]})`);
    }
  });
  test(`${s}: lokalne pliki z src/href/srcset istnieją`, async () => {
    const refs = new Set();
    for (const m of html[s].matchAll(/\s(?:src|href)="([^"#?]+)"/g)) { const v = m[1]; if (!/^(https?:)?\/\/|^mailto:|^tel:|^javascript:|^data:/.test(v)) refs.add(v); }
    for (const m of html[s].matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) refs.add(part.trim().split(/\s+/)[0]);
    for (const m of html[s].matchAll(/imagesrcset="([^"]+)"/g)) for (const part of m[1].split(',')) refs.add(part.trim().split(/\s+/)[0]);
    for (const r of refs) {
      const p = join(ROOT, r.replace(/^\//, ''));
      await access(p).catch(() => assert.fail(`brak pliku ${r}`));
    }
  });
  test(`${s}: JSON-LD parsuje się`, () => {
    for (const m of html[s].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  });
}

test('index.html: kotwice używane w .htaccess i 404.html istnieją', async () => {
  const own = ids(html['index.html']);
  const ht = await readFile(join(ROOT, '.htaccess'), 'utf8');
  for (const m of ht.matchAll(/pompy\.dewax\.pl\/#([a-z-]+)/g)) assert.ok(own.has(m[1]), `.htaccess: #${m[1]}`);
  for (const m of html['404.html'].matchAll(/href="\/#([a-z-]+)"/g)) assert.ok(own.has(m[1]), `404.html: #${m[1]}`);
});

test('index.html: elementy wymagane przez kalkulator i formularz', () => {
  const h = html['index.html'];
  for (const id of ['kreator-karta', 't1', 't2', 't3', 't4', 'p1', 'p2', 'p3', 'p4', 'm2', 'm2num', 'oStd', 'oOdb', 'os', 'vOs', 'oPal', 'oDz', 'oWj', 'miasto', 'rDom', 'rTytul', 'rZrodlo', 'rCena', 'rZlSuf', 'rCenaU', 'rMoc', 'rOdw', 'rKwh', 'rRok', 'pmW', 'pmKwh', 'pmZl', 'pmInw', 'tbl', 'wBox', 'rNote', 'ctaOferta', 'fczas'])
    assert.ok(ids(h).has(id), `brak id="${id}"`);
  assert.match(h, /<form class="zap" name="wycena" method="POST" action="wyslij\.php"/);
  for (const name of ['imie', 'email', 'miejscowosc', 'metraz', 'telefon', 'wiadomosc', 'zgoda_dane', 'zgoda_telefon', 'bot-field', 'czas']) assert.match(h, new RegExp(`name="${name}"`), `pole ${name}`);
});

test('index.html: obowiązkowa treść hero i nawigacja', () => {
  const h = html['index.html'];
  assert.match(h, /Najpierw sprawdź koszt systemu i geologię swojej działki\./);
  assert.match(h, /Policz koszt w 2 minuty/);
  assert.match(h, /Sprawdź geologię działki/);
  for (const l of ['Koszt', 'Geologia', 'Jak to działa', 'Realizacje', 'Pompy', 'Dotacje', 'FAQ']) assert.match(h, new RegExp(`<a href="[^"]+">${l}</a>`), `link ${l}`);
  assert.doesNotMatch(h, /img\/diag\.webp/, 'render diag.webp nie może być użyty');
});

test('blok zgody (Consent Mode, Cookiebot, GA4, HubSpot) identyczny na każdej stronie publicznej', () => {
  const wyciag = (h) => ({ ga: /G-XHZDND4X1W/.test(h), cb: /data-cbid="7a55c023-e775-4510-b1af-bdb8eaadfff5"/.test(h), hs: /49004516\.js/.test(h), consent: /gtag\('consent', 'default'/.test(h) });
  for (const s of ['index.html', 'pompy.html', 'dla-instalatorow.html', 'podziekowanie.html', '404.html']) assert.deepEqual(wyciag(html[s]), { ga: true, cb: true, hs: true, consent: true }, s);
});
