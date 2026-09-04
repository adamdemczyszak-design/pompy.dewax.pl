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

Konwersja docelowa w GA4 to nadal odsłona `podziekowanie.html` (potwierdzone dostarczenie
do `wyslij.php`), `quote_submitted` jest zdarzeniem pomocniczym po stronie przeglądarki.

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

Strona nie ustawia własnych cookies. `sessionStorage` przechowuje dwie flagi na czas sesji:
`dx_calc` (wynik kalkulatora, żeby pokazać baner „masz już koszt i geologię”) i `dx_geo`
(kliknięto GEO). Nic nie jest wysyłane na serwer. Skrypty własne mają atrybut
`data-cookieconsent="ignore"`, więc Cookiebot ich nie blokuje.
