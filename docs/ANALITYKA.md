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

Strona nie ustawia własnych cookies. `sessionStorage` przechowuje dwie flagi na czas sesji:
`dx_calc` (wynik kalkulatora, żeby pokazać baner „masz już koszt i geologię”) i `dx_geo`
(kliknięto GEO). Nic nie jest wysyłane na serwer. Skrypty własne mają atrybut
`data-cookieconsent="ignore"`, więc Cookiebot ich nie blokuje.

## Piksel Meta (od 12.09.2026)

Zestaw danych „dewax.pl”, id `1032857169399673` (Business Manager „Dewax”). Kod bazowy siedzi w bloku
zgody w `<head>` każdej strony jako `<script type="text/plain" data-cookieconsent="marketing">`, więc
Cookiebot uruchamia go dopiero po zgodzie marketingowej. Bez zgody piksel nie ładuje się wcale i nic
nie wysyła (nie ma odpowiednika Consent Mode), dlatego liczby w Menedżerze zdarzeń będą niższe niż w GA4.
Bez znacznika `noscript`, bo obrazka nie da się bramkować zgodą.

| Zdarzenie Meta | Kiedy | Skąd |
|---|---|---|
| `PageView` | każda odsłona | kod bazowy |
| `KalkulatorUkonczony` (własne; `value` = cenaOd, `currency` PLN, `moc`, `model`, `metry`, `otwory`, `cenaDo`) | jak `calculator_completed` | `dx.track` w `js/dewax.js` |
| `GeoOtwarte` (własne; `miejsce`) | jak `geo_clicked` | `dx.track` |
| `Contact` (standardowe; `miejsce`) | jak `phone_clicked` | `dx.track` |
| `WycenaWyslana` (własne; `z_kalkulatora`, `telefon`) | jak `quote_submitted`, przed wysyłką | `dx.track` |
| `Lead` (standardowe; `content_name: wycena`) | odsłona `podziekowanie.html?ok=1`, czyli potwierdzone dostarczenie do `wyslij.php`; `?zgoda=1` nie liczy się | skrypt w `podziekowanie.html` |

Kampania Meta Ads optymalizuje na `Lead`. Gdy kalkulator zbierze ok. 50 zdarzeń tygodniowo, warto
rozważyć optymalizację na `KalkulatorUkonczony` (w zestawie reklam: `custom_event_type: OTHER`,
`custom_event_str: KalkulatorUkonczony`). Założenia kampanii: `reklamy/meta/KAMPANIA.md`.
