#!/usr/bin/env node
/* Lint tonu dla macierzy kreacji: node reklamy/generator/lint.mjs
   Sprawdza wszystkie bloki i wszystkie 180 złożeń: zakazane znaki i słowa, długość zdań,
   długość tekstu głównego, nagłówka i opisu. Wynik niezerowy = coś do poprawy. */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KAT = dirname(fileURLToPath(import.meta.url));
const src = await readFile(join(KAT, 'tresci.js'), 'utf8');
const window = {};
new Function('window', src)(window);
const T = window.DX_TRESCI;
const Z = T.zasady;

const bledy = [];
function sprawdzTekst(gdzie, tekst, { naglowek = false, opis = false } = {}) {
  for (const zn of Z.zakazaneZnaki) if (tekst.includes(zn)) bledy.push(`${gdzie}: zakazany znak „${zn}”`);
  const low = tekst.toLowerCase();
  for (const s of Z.zakazane) if (low.includes(s)) bledy.push(`${gdzie}: zakazane słowo „${s}”`);
  if (naglowek && tekst.length > Z.maksZnakowNaglowka) bledy.push(`${gdzie}: nagłówek ${tekst.length} znaków (maks ${Z.maksZnakowNaglowka})`);
  if (opis && tekst.length > Z.maksZnakowOpisu) bledy.push(`${gdzie}: opis ${tekst.length} znaków (maks ${Z.maksZnakowOpisu})`);
  if (!naglowek && !opis) {
    for (const zd of tekst.split(/(?<=[.?])\s+/)) {
      const slow = zd.trim().split(/\s+/).filter(Boolean).length;
      if (slow > Z.maksSlowWZdaniu) bledy.push(`${gdzie}: zdanie ma ${slow} słów (maks ${Z.maksSlowWZdaniu}): „${zd.trim().slice(0, 60)}…”`);
    }
  }
}

for (const h of T.hooki) sprawdzTekst(`hook ${h.id}`, h.tekst);
for (const b of T.korzysci) { sprawdzTekst(`korzyść ${b.id}`, b.tekst); sprawdzTekst(`korzyść ${b.id} opis`, b.opis, { opis: true }); }
for (const c of T.cta) { sprawdzTekst(`CTA ${c.id}`, c.tekst); sprawdzTekst(`CTA ${c.id} nagłówek`, c.naglowek, { naglowek: true }); sprawdzTekst(`CTA ${c.id} opis`, c.opis, { opis: true }); }
/* Wzorzec to reklamy już zatwierdzone przez Meta: sprawdzamy tylko ton, nie limity długości. */
for (const w of T.wzorzec) sprawdzTekst(`wzorzec ${w.kod}`, w.tekst);

let n = 0, maks = 0, najdluzszy = '';
for (const h of T.hooki) for (const b of T.korzysci) for (const c of T.cta) {
  const tekst = `${h.tekst}\n\n${b.tekst}\n\n${c.tekst}`;
  n++;
  if (tekst.length > maks) { maks = tekst.length; najdluzszy = `${h.id}-${b.id}-${c.id}`; }
  if (tekst.length > Z.maksZnakowTekstu) bledy.push(`złożenie ${h.id}-${b.id}-${c.id}: ${tekst.length} znaków (maks ${Z.maksZnakowTekstu})`);
}

console.log(`Bloki: ${T.hooki.length} hooków, ${T.korzysci.length} korzyści, ${T.cta.length} CTA. Złożeń: ${n}. Najdłuższe: ${najdluzszy} (${maks} znaków).`);
const zUwaga = [...T.hooki, ...T.korzysci, ...T.cta].filter(x => x.uwaga).map(x => x.id);
if (zUwaga.length) console.log(`Bloki wymagające potwierdzenia właściciela (uwaga): ${zUwaga.join(', ')}`);
if (bledy.length) { console.error(`\nBłędy (${bledy.length}):`); for (const b of bledy) console.error('  ✗ ' + b); process.exit(1); }
console.log('✓ Ton: bez pauz, bez wykrzykników, bez słów zakazanych, zdania w limicie.');
