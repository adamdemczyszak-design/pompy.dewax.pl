# Analityka: zdarzenia i plan mierzenia konwersji

Mechanizm bez zmian względem produkcji: GA4 `G-XHZDND4X1W` przez `gtag`, Consent Mode v2,
Cookiebot (blokowanie automatyczne), HubSpot w kategorii marketing. Nie dodano żadnego
nowego systemu. Wszystkie zdarzenia wysyła jedna funkcja `dx.track(nazwa, parametry)`
w `js/dewax.js`, która woła `gtag('event', ...)` tylko wtedy, gdy `gtag` istnieje.
Bez zgody na statystyki GA4 działa w trybie bez cookies (Consent Mode), tak jak dotychczas.

## Zdarzenia

| Zdarzenie | Kiedy | Parametry | Plik |
|---|---|---|---|
| `calculator_started` | pierwsza interakcja z krokiem 1 (suwak, pole, standard) | brak | `js/kalkulator.js` |
| `calculator_step_completed` | przejście do następnego kroku | `step` (1, 2, 3) | `js/kalkulator.js` |
| `calculator_completed` | pokazanie wyniku | `moc`, `model`, `metry`, `otwory`, `cenaOd`, `cenaDo` | `js/kalkulator.js` |
| `dobor_step`, `dobor_result` | jak dotychczas (zachowane dla ciągłości raportów) | jak dotychczas | `js/kalkulator.js` |
| `geo_clicked` | kliknięcie dowolnego linku do DEWAX GEO | `miejsce` (sekcja, stopka, instalatorzy) | `js/dewax.js` |
| `geo_completed` | **nie wysyłane**: DEWAX GEO działa w innej domenie i nie przekazuje wyniku; nie da się tego uczciwie wykryć. Do rozważenia: zdarzenie po stronie aplikacji GEO w tej samej usłudze GA4. | | |
| `phone_clicked` | kliknięcie `tel:` | `miejsce` (topbar, kontakt, stopka, pasek, instalatorzy) | `js/dewax.js` |
| `realization_viewed` | wyróżniona realizacja widoczna w 50% (raz na odsłonę) | `id` | `js/dewax.js` |
| `quote_started` | pierwszy fokus w formularzu wyceny | brak | `js/dewax.js` |
| `quote_submitted` | formularz przeszedł walidację i jest wysyłany | `z_kalkulatora` (0/1), `telefon` (0/1) | `js/dewax.js` |
| `form_error` | walidacja zatrzymała wysyłkę | `pola` (lista nazw) | `js/dewax.js` |
| `generate_lead` | (od 12.09.2026) odsłona `podziekowanie.html?ok=1`, czyli formularz wyceny realnie wysłany mailem przez `wyslij.php` | `formularz` (`wycena`) | `podziekowanie.html` |

Konwersja docelowa to `generate_lead`: w GA4 oznaczyć jako kluczowe zdarzenie i zaimportować do
Google Ads jako konwersję główną (instrukcja krok po kroku: `docs/GOOGLE-ADS.md`, punkt 2).
Zdarzenie nie wysyła się dla `?zgoda=1` (zgoda na opinię) ani dla wejść bez parametru
(przekierowania odrzuconych botów). `quote_submitted` zostaje zdarzeniem pomocniczym po stronie
przeglądarki, `phone_clicked` i `calculator_completed` nadają się na konwersje pomocnicze (obserwacja).

## Źródło wejścia w zgłoszeniu (od 12.09.2026)

`js/dewax.js` czyta z adresu parametry `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
`utm_content` i `gclid`, dokłada `lp` (ścieżka strony wejścia), zapamiętuje je w `sessionStorage`
(`dx_zrodlo`) i dopisuje do linków prowadzących na własne strony HTML, żeby przetrwały przejście
z podstrony poradnika na stronę z formularzem. Przy wysyłce formularz dostaje ukryte pole `zrodlo`
(do 300 znaków), a `wyslij.php` wpisuje je do maila jako linię „Źródło:”. Dzięki temu każde
zapytanie da się przypisać do kampanii i słowa kluczowego bez logowania do GA4. Bez parametrów
w adresie nic nie jest zapisywane ani dopisywane.

Od 09.09.2026 na `podziekowanie.html` trafia też formularz zgody na publikację opinii, z parametrem
`?zgoda=1` i bez `?ok=1`. Jeśli konwersja w GA4 lub Google Ads jest zdefiniowana na samym adresie
strony podziękowania, trzeba ją zawęzić do `?ok=1`, inaczej zgody będą liczone jak wyceny.

## Lejek do zbudowania w GA4 (eksploracja „ścieżka”)

1. `page_view` strony głównej
2. `calculator_started`
3. `calculator_completed`
4. `geo_clicked` (równolegle)
5. `quote_started`
6. `quote_submitted`
7. `page_view` `podziekowanie.html`

Do porównania po wdrożeniu: udział sesji z `calculator_completed`, udział `quote_submitted`
z `z_kalkulatora = 1`, udział `phone_clicked` wg `miejsce`, odsetek `form_error` względem
`quote_started` (jeśli wysoki, przejrzeć komunikaty pól).

## Cookies i pamięć

Strona nie ustawia własnych cookies. `sessionStorage` przechowuje trzy wpisy na czas sesji:
`dx_calc` (wynik kalkulatora, żeby pokazać baner „masz już koszt i geologię”), `dx_geo`
(kliknięto GEO) i `dx_zrodlo` (parametry kampanii z adresu, tylko gdy były w adresie).
Na serwer trafia wyłącznie `dx_zrodlo`, i tylko razem z formularzem, który użytkownik sam wysyła. Skrypty własne mają atrybut
`data-cookieconsent="ignore"`, więc Cookiebot ich nie blokuje.
