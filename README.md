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
| `odwierty-pod-pompe-ciepla.html`, `dolne-zrodlo-pompy-ciepla.html`, `sondy-koszowe-helix.html`, `gruntowa-pompa-ciepla-cena.html`, `dotacje-pompa-ciepla.html`, `pompa-ciepla-czy-warto.html` | poradnik (Etap 2, 09.09.2026): sześć podstron tematycznych pod osobne frazy, każda z własnym `title`, opisem, `canonical`, breadcrumbs (schema.org) i sekcją FAQ. Rozwijają sekcje strony głównej, nie zastępują ich; kotwice one-pagera zostają. Linkowane z sekcji `#poradnik` na stronie głównej, z kolumny „Poradnik” w stopce każdej strony i wzajemnie |
| `gdzie-dzialamy/*.html` | strony wojewódzkie (Etap 3, 09.09.2026): wielkopolskie, łódzkie, kujawsko-pomorskie, dolnośląskie, śląskie, mazowieckie. Każda: miasta i powiaty, geologia regionu na podstawie ogólnodostępnych danych PIG-PIB (miejsca niepewne oznaczone `<!-- DO WERYFIKACJI -->`), płuczka czy młotek, formalności, dojazd z Dobrzycy (OSRM/OpenStreetMap), link do DEWAX GEO, `LocalBusiness` z `areaServed`. Ścieżki względne z `../`. Świadomie bez stron dla pojedynczych miast |
| `zgoda-na-publikacje-opinii.html` | (Etap 4, 09.09.2026) formularz pisemnej zgody klienta na publikację opinii: zakres (imię czy imię i nazwisko, miejscowość, dane techniczne), klauzula RODO, podpis i data, wersja do druku. Wysyła przez `wyslij.php` z polem `formularz=zgoda-opinia` (osobna gałąź w PHP, temat „Zgoda na publikację opinii”, przekierowanie na `podziekowanie.html?zgoda=1`, bez `?ok=1`). `noindex`. Sekcja `#opinie` w `index.html` jest ukryta (`hidden`) z jednym wpisem SZABLON i szablonem `Review` w komentarzu; instrukcja odsłonięcia w komentarzu nad sekcją |
| `css/dewax.css` | jeden arkusz dla wszystkich stron (tokeny marki, komponenty, responsywność, druk) |
| `js/kalkulator.js` | algorytm kalkulatora (czysta funkcja `oblicz(S)`, eksport do testów) + interfejs kroków |
| `js/dewax.js` | nawigacja, pomiar zdarzeń (gtag), walidacja formularza, pasek mobilny, wspólny stan „koszt + geologia” |
| `wyslij.php`, `podziekowanie.html`, `404.html`, `polityka-prywatnosci.html`, `.htaccess`, `robots.txt`, `sitemap.xml`, `og.jpg`, `favicon.png` | bez zmian funkcjonalnych (404 i sitemap uzupełnione o nowe podstrony) |
| `img/` | zdjęcia DEWAX w wariantach WebP (`nazwa-SZEROKOŚĆ.webp`) oraz oryginalne pliki z poprzedniej wersji |
| `zdjecia/` | źródła JPG wyższej rozdzielczości (z nich powstały warianty hero i realizacji) |
| `testy/` | testy Node, wzorzec wyników kalkulatora, serwer deweloperski, lint |
| `googlee4c582b5162d1cb9.html` | plik weryfikacyjny Google Search Console. **Nie kasować**, inaczej usługa traci weryfikację |
| `CONTENT_NEEDED.md` | lista danych i zdjęć do uzupełnienia przez właściciela |
| `docs/ANALITYKA.md` | zdarzenia GA4 i plan mierzenia konwersji (w tym `generate_lead` na `podziekowanie.html?ok=1` i linia „Źródło:” w mailu z formularza) |
| `docs/GOOGLE-ADS.md` | (od 12.09.2026) plan i instrukcja kampanii Google Ads: stan konta, konwersje, struktura, budżet, optymalizacja, lista dla właściciela |
| `reklama/google-ads/` | (od 12.09.2026) źródło kampanii (`kampania.py`), kontrola i eksport (`narzedzia.py`), pliki importu do Google Ads Editor (`import/`), obrazy do reklam z prawdziwych zdjęć (`obrazy/`). **Nie wchodzi do pakietu wdrożenia** |
| `.github/workflows/wdrozenie.yml`, `wdroz.sh` | wdrożenie na nazwa.pl (pakiet obejmuje `css/`, `js/`, nowe podstrony) |

## Pamięć podręczna CDN nazwa.pl (ważne przy każdej zmianie stylów i skryptów)

Przed stroną stoi CDN nazwa.pl. Pliki HTML mają `no-cache`, więc zmiany w treści widać
od razu, ale `css/dewax.css` jest tam trzymany do 30 dni, a `js/*.js` i `sitemap.xml`
do 14 dni. Bez obejścia klient przez wiele dni dostawałby stary arkusz stylów do nowego HTML-a.

Dlatego adresy arkusza i skryptów mają znacznik wersji, np. `css/dewax.css?v=2026-09-04`.
**Po każdej zmianie w `css/` albo `js/` podnieś ten znacznik na wszystkich stronach**, które
dany plik ładują (dziś 16 plików HTML: strona główna, pompy, instalatorzy, poradnik, strony
wojewódzkie, zgoda na opinię; lista: `grep -rl 'dewax.js?v=' --include=*.html .`). Nowy adres to
dla CDN nowy plik, więc pobierze go od razu. Sprawdzenie, czy serwer ma aktualną wersję:

```bash
curl -s "https://pompy.dewax.pl/css/dewax.css?kontrola=1" | head -3
```

Adres z dowolnym nowym parametrem omija pamięć podręczną. Jeśli trzeba wyczyścić
pamięć CDN dla adresów bez parametru (np. `sitemap.xml`), robi się to w panelu
`admin.nazwa.pl` w sekcji CDN.

## Wdrożenie

Nie wdrażaj bez decyzji właściciela. Workflow `wdrozenie.yml` startuje automatycznie po
zmianie plików strony na gałęzi `main`, dlatego prace prowadź na osobnej gałęzi, a na `main`
scalaj dopiero po akceptacji. Lista braków blokujących publikację: `CONTENT_NEEDED.md`, punkt 1.
