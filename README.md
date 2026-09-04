# pompy.dewax.pl

Strona sprzedażowa DEWAX: gruntowe pompy ciepła z odwiertem na jednej umowie.
Statyczny HTML + CSS + JS, formularz przez `wyslij.php` (PHP `mail()` na nazwa.pl).
Bez kroku budowania: pliki w repozytorium są tym, co trafia na serwer.

## Uruchomienie lokalne

Wymagany Node 20+ (bez zależności npm).

```bash
npm start
```

Serwer deweloperski (`testy/serwer-dev.mjs`) działa na `http://localhost:8787/`,
serwuje pliki statyczne i **naśladuje `wyslij.php`** (walidacja, honeypot, przekierowania,
kody 302/422), bo na komputerze deweloperskim nie ma PHP. Maila nie wysyła: wypisuje
zgłoszenie w konsoli. Inny port: `PORT=8000 npm start`.

## Testy i lint

```bash
npm run check
```

- `npm run lint` (`testy/lint.mjs`): składnia JS, zbalansowane klamry CSS i znaczniki HTML,
  powtórzone `id`, zakaz pauz „—” w treści widocznej (zasada z `CLAUDE.md`).
- `npm test`:
  - `testy/kalkulator.test.mjs`: algorytm kalkulatora musi dawać dokładnie te liczby, które
    produkcja pokazywała 4.09.2026 dla pięciu zestawów danych (`testy/kalkulator-wzorzec.json`),
    plus stałe algorytmu i przypadki brzegowe;
  - `testy/strona.test.mjs`: jeden H1 na stronę, `alt` na każdym obrazie, kotwice
    z nawigacji, `.htaccess` i `404.html` istnieją, pliki z `src`/`srcset` istnieją,
    JSON-LD parsuje się, obowiązkowa treść hero, blok zgody identyczny na każdej stronie.

Testy w przeglądarce (zrzuty ekranu, przejście kalkulatora, formularz, menu, klawiatura)
wykonano skryptami Playwright poza repozytorium; wyniki i zrzuty leżą w `docs/zrzuty/`
(katalog ignorowany przez git, generowany lokalnie).

## Struktura

| Ścieżka | Co to |
|---|---|
| `index.html` | strona główna dla właścicieli domów (hero, wybór koszt/geologia, kalkulator, DEWAX GEO, realizacje, jedna firma, proces, obawy, porównanie, dolne źródło, pompy, gwarancja, dotacje, FAQ, wycena) |
| `pompy.html` | pełna specyfikacja Thermokrafft TK (COP, EER, ceny), R290, Buderus |
| `dla-instalatorow.html` | podwykonawstwo dolnego źródła, warunki partnerskie, kreator ofertowy (kod dostępu), DEWAX GEO |
| `css/dewax.css` | jeden arkusz dla wszystkich stron (tokeny marki, komponenty, responsywność, druk) |
| `js/kalkulator.js` | algorytm kalkulatora (czysta funkcja `oblicz(S)`, eksport do testów) + interfejs kroków |
| `js/dewax.js` | nawigacja, pomiar zdarzeń (gtag), walidacja formularza, pasek mobilny, wspólny stan „koszt + geologia” |
| `wyslij.php`, `podziekowanie.html`, `404.html`, `polityka-prywatnosci.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, `og.jpg`, `favicon.png` | bez zmian funkcjonalnych (404 i sitemap uzupełnione o nowe podstrony) |
| `img/` | zdjęcia DEWAX w wariantach WebP (`nazwa-SZEROKOŚĆ.webp`) oraz oryginalne pliki z poprzedniej wersji |
| `zdjecia/` | źródła JPG wyższej rozdzielczości (z nich powstały warianty hero i realizacji) |
| `testy/` | testy Node, wzorzec wyników kalkulatora, serwer deweloperski, lint |
| `CONTENT_NEEDED.md` | lista danych i zdjęć do uzupełnienia przez właściciela |
| `docs/ANALITYKA.md` | zdarzenia GA4 i plan mierzenia konwersji |
| `.github/workflows/wdrozenie.yml`, `wdroz.sh` | wdrożenie na nazwa.pl (pakiet obejmuje `css/`, `js/`, nowe podstrony) |

## Wdrożenie

Nie wdrażaj bez decyzji właściciela. Workflow `wdrozenie.yml` startuje automatycznie po
zmianie plików strony na gałęzi `main`, dlatego prace prowadź na osobnej gałęzi, a na `main`
scalaj dopiero po akceptacji. Lista braków blokujących publikację: `CONTENT_NEEDED.md`, punkt 1.
