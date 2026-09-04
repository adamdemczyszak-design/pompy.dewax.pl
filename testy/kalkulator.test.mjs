/* Test regresji kalkulatora: algorytm z js/kalkulator.js musi dawać dokładnie
   te same liczby, które produkcyjna wersja strony (25.08.2026) pokazywała dla
   pięciu zestawów danych zapisanych w kalkulator-wzorzec.json. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const K = require('../js/kalkulator.js');
const wzorzec = JSON.parse(await readFile(new URL('./kalkulator-wzorzec.json', import.meta.url), 'utf8'));

for (const p of wzorzec.przypadki) {
  test(`przypadek ${p.n}: ${JSON.stringify(p.wejscie)}`, () => {
    const r = K.oblicz({ ...p.wejscie, miasto: '' });
    assert.deepEqual(r.WYNIK, p.wynik, 'WYNIK (moc, model, metry, otwory, cenaOd, cenaDo)');
    assert.equal(r.cenaTekst, p.ekran.cena, 'widełki ceny na ekranie');
    assert.equal(K.fmt(r.kwh), p.ekran.kwh, 'zużycie prądu kWh/rok');
    assert.equal(K.fmt(r.kosztRok), p.ekran.rok, 'koszt ogrzewania zł/rok');
    assert.equal(Math.round(r.moc * 1000 / p.wejscie.m2) + ' W/m²', p.ekran.pmW);
    assert.equal((r.kwh / p.wejscie.m2).toFixed(1).replace('.', ',') + ' kWh/m²·rok', p.ekran.pmKwh);
    assert.equal((r.kosztRok / p.wejscie.m2).toFixed(1).replace('.', ',') + ' zł/m²·rok', p.ekran.pmZl);
    if (p.ekran.pmInw && !r.kaskada) assert.equal(K.fmt(r.sumaMin / p.wejscie.m2) + '–' + K.fmt(r.sumaMax / p.wejscie.m2) + ' zł/m²', p.ekran.pmInw);
    const kaskadaWzor = p.ekran.tytul.startsWith('Układ kaskadowy');
    assert.equal(r.kaskada, kaskadaWzor, 'flaga kaskady');
    if (p.ekran.porownanie) {
      const m = p.ekran.porownanie.match(/ok\. ([\d ]+) zł rocznie, o ([\d ]+) zł/);
      assert.equal(K.fmt(r.stare), m[1].trim(), 'koszt starego ogrzewania');
      assert.equal(K.fmt(r.osz), m[2].trim(), 'różnica roczna');
    }
  });
}

test('stałe algorytmu nie zmieniły się względem produkcji', () => {
  assert.deepEqual(K.POMPY.map(p => [p.id, p.min, p.max, p.cena]), [
    ['TK-G2S/R290', 2, 11, 23990], ['TK-G3S/R290', 4, 13, 26190], ['TK-G5S/R290', 6, 18, 27990], ['TK-G6S/R290', 10, 23, 30790]]);
  assert.deepEqual(K.EFF, { podl: 4.2, mix: 3.8, grz: 3.5 });
  assert.equal(K.PRAD, 1.04); assert.equal(K.VAT, 1.08);
  assert.equal(K.STAWKA_MIN, 130); assert.equal(K.STAWKA_MAX, 145);
  assert.equal(K.MONTAZ, 9000); assert.equal(K.MAX_OTWOR, 100); assert.equal(K.W_NA_METR, 50);
});

test('przypadki brzegowe: zakres metrażu i podział na otwory', () => {
  const a = K.oblicz({ m2: 30, std: 20, odb: 'podl', os: 1, pal: 'brak', dz: 'mala', wj: 'tak' });
  assert.equal(a.otwory, 1); assert.ok(a.glebokosc >= 5);
  const b = K.oblicz({ m2: 1500, std: 120, odb: 'grz', os: 8, pal: 'prad', dz: 'duza', wj: 'tak' });
  assert.ok(b.kaskada); assert.ok(b.glebokosc <= 100); assert.equal(b.metry, b.otwory * b.glebokosc);
});
