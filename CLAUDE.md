# DEWAX — pompy.dewax.pl

Kontekst projektu. Przeczytaj w całości, zanim cokolwiek zmienisz.

## Co to za projekt

DEWAX Sp. z o.o. (Dobrzyca, KRS 0000298299) montuje **gruntowe pompy ciepła** i wykonuje
odwierty **własną wiertnicą**. `pompy.dewax.pl` to strona sprzedażowa dla właścicieli domów.
Główna idea: **„Nie kupuj pompy w ciemno. Najpierw sprawdź koszt systemu i geologię swojej działki.”**

Główne konwersje, w tej kolejności: ukończenie kalkulatora → przejście do DEWAX GEO →
zamówienie dokładnej wyceny (formularz) → umówienie oględzin → telefon.

## Stan (4 września 2026)

Ten folder to **produkcja**, nie prototyp. Żywa strona stoi na nazwa.pl
(`server420780.nazwa.pl`, katalog `/pompy/webroot`), wdrażana workflow
`.github/workflows/wdrozenie.yml` po zmianie plików strony na `main`. Dlatego:
**pracuj na osobnej gałęzi, na `main` scalaj dopiero po akceptacji właściciela.**

Stos: statyczny HTML + `css/dewax.css` + `js/kalkulator.js` + `js/dewax.js`, formularz przez
`wyslij.php` (PHP `mail()`). Brak kroku budowania. Node służy tylko do testów i serwera
deweloperskiego: `npm start`, `npm run check`. Szczegóły: `README.md`.

| Plik | Co to |
|---|---|
| `index.html` | strona główna (hero 55/45, wybór koszt/geologia, kalkulator, GEO, realizacje, jedna firma, proces, obawy, porównanie, dolne źródło, pompy, gwarancja, dotacje, FAQ, wycena) |
| `pompy.html` | pełna specyfikacja Thermokrafft TK |
| `dla-instalatorow.html` | B2B: podwykonawstwo, kreator ofertowy (kod dostępu), warunki partnerskie |
| `js/kalkulator.js` | algorytm kalkulatora; czysta funkcja `oblicz(S)`; test regresji `testy/kalkulator.test.mjs` porównuje z `testy/kalkulator-wzorzec.json` |
| `CONTENT_NEEDED.md` | czego brakuje i co potwierdzić przed publikacją |
| `docs/ANALITYKA.md` | zdarzenia GA4 i plan mierzenia |
| `tresci/strategia.md` | strategia z 15.08: psychologia klienta, konkurencja, źródła, czego nie wolno twierdzić |

## Narzędzia zewnętrzne

- **DEWAX GEO** `https://dewax-geo.netlify.app/`: raport geologiczny z danych PIG-PIB.
  **Dziś za logowaniem Netlify (SSO zespołu).** Strona linkuje do niego i mówi o tym uczciwie
  (akapit `.geo-access` w sekcji `#geo`). Nie obiecuj publicznego dostępu, dopóki nie zostanie
  otwarty. Linki mają atrybut `data-geo` (zdarzenie `geo_clicked`).
- **Kreator ofertowy** `https://dewax-kreator.netlify.app/`: chroniony, dla partnerów.
  Linkowany wyłącznie z `dla-instalatorow.html`. Nie promuj go klientom indywidualnym.
- GA4 `G-XHZDND4X1W`, Cookiebot `7a55c023-…`, HubSpot `49004516`: blok zgody w `<head>`
  każdej strony musi być identyczny (test `strona.test.mjs` to sprawdza).

## Kalkulator: nie zmieniaj wyników

Algorytm, ceny, pola i walidacja są przeniesione 1:1 z produkcji z 25.08.2026.
Każda zmiana liczb wymaga (1) decyzji właściciela, (2) aktualizacji wzorca testów,
(3) opisu w podsumowaniu. Stałe: `POMPY`, `EFF`, `PALIWA`, `PRAD 1,04`, `VAT 1,08`,
`STAWKA 130–145`, `MONTAZ 9000`, `MAX_OTWOR 100`, `W_NA_METR 50`.

```
moc       = m2 × W/m² / 1000 + osoby × 0,2 kW
pompa     = najmniejszy model, dla którego moc ≤ 0,9 × max; brak → kaskada
pGrunt    = moc × (1 − 1/eff)
metry     = ceil(pGrunt / 0,05 / 10) × 10, podział na otwory ≤ 100 m, głębokość do 5 m
kWh       = (pCO × 1900 + osoby × 900) / eff
koszt     = cena pompy + metry × 130…145 × 1,08 + 9000 × 1,08
```

## Zasady pisania tekstów

**OUTCOME-FIRST (zasada nadrzędna, od właściciela, 4.09.2026).** Klient nie kupuje wiertnicy,
odwiertu ani pompy. Kupuje ciepły dom, ciepłą wodę, niskie i przewidywalne koszty, niezawodność
i święty spokój. Technologia, własna wiertnica, operatorzy i doświadczenie są DOWODEM, nie
bohaterem. Hierarchia każdego tekstu: 1) efekt dla klienta, 2) korzyść, 3) poczucie
bezpieczeństwa, 4) dowód, 5) na końcu technologia i parametry. Test zdania: „Co z tego ma
klient?”. Jeśli zdanie opisuje tylko DEWAX, sprzęt albo proces, przepisz je tak, żeby zaczynało
się od rezultatu. Przykład: nie „Nasza wiertnica i nasz operator podczas odwiertu”, tylko
„Dziś wiercimy. Później możesz o tym zapomnieć.”

**Nigdy nie wymyślaj** realizacji, opinii, parametrów, COP/SCOP, gwarancji, certyfikatów,
liczby instalacji, cen ani dotacji. Brak danych → wpis w `CONTENT_NEEDED.md`, nie domysł.

**Język.** Konkretnie, bez superlatywów, bez „kompleksowej obsługi” i „innowacyjnych rozwiązań”.
Każde zdanie wyjaśnia, przekonuje, rozbraja obiekcję, dowodzi albo prowadzi dalej.
**Bez pauz „—”** w treści widocznej (lint to sprawdza): przecinki, dwukropki, kropki.

**Słownik klienta.** Używaj: gruntówka, dolne źródło, odwierty, sonda, glikol, podłogówka,
bufor, wiertnica, CWU. Nie używaj: wymiennik gruntowy, sonda geotermalna, górotwór, solanka,
efektywność energetyczna, rozwiązanie ekologiczne. **Ekologia nie sprzedaje.**

## Czego nie wolno twierdzić

- „Sonda ma 50 lat żywotności wg VDI” → poprawnie: „w analizie kosztów PORT PC przyjęto
  dla pionowego wymiennika okres 50 lat”.
- „Pompa jest bezemisyjna” (polski miks: ok. 225 g CO₂/kWh ciepła).
- „Zwraca się w X lat”. Nie sprzedajemy zwrotem inwestycji.
- Wartości W/mb z powołaniem na PORT PC.
- Dostęp do DEWAX GEO „bez logowania”, dopóki jest za SSO.

**Wolno, ze źródłem:** SPF 3,5 (grunt) vs 2,5 (powietrze) wg decyzji KE 2013/114/UE;
Fraunhofer ISE 3,9 vs 2,9; EER chłodzenia pasywnego 15–30; 20 lat (grunt) vs 18 (powietrze)
wg VDI 2067; niedowymiarowane dolne źródło jako najczęstszy błąd instalacyjny (Fraunhofer ISE).

## Dotacje (zweryfikowane 15.08.2026, sprawdzić przed publikacją)

Moje Ciepło: tylko nowe domy (odbiór po 1.01.2021), 30%, maks. 21 000 zł, 45% z KDR,
nabór do 31.12.2026, wniosek po odbiorze. Czyste Powietrze: tylko istniejące, 3 poziomy,
kwoty wg Załącznika nr 2. Ulga termomodernizacyjna: do 53 000 zł odliczenia od dochodu.

## Zdjęcia

Wyłącznie prawdziwe zdjęcia DEWAX z `img/` i `zdjecia/`. **Nie używaj `img/diag.webp`**
(render) ani zdjęć stockowych/AI. Warianty responsywne: `img/nazwa-SZEROKOŚĆ.webp`
(generowane Pillow z `zdjecia/*.jpg` i oryginalnych `img/*.webp`). Ilustracje edukacyjne
tylko jako własne SVG z podpisem „ilustracja poglądowa”.

## Projekt wizualny

Fonty: Archivo (nagłówki) + IBM Plex Sans (tekst), Google Fonts. Kolory: granat `#000050`
(tekst, ciemne sekcje), niebieski `#2F6D9E` (akcje), zielony (potwierdzenia), żółty tylko
jako akcent (kropki logo, znacznik pilności). Jeden system odstępów (`--s1…--s8`),
narożniki `12/8/6 px`, jeden cień. Bez animacji dekoracyjnych; jedyna animacja to
przepływ glikolu w SVG, wyłączana przy `prefers-reduced-motion`.
