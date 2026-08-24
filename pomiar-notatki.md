# Pomiar ruchu na pompy.dewax.pl — ustalenia

Notatka robocza. Nie jest częścią kodu strony i nie trafia na serwer
(nie ma jej na liście `paths` w `.github/workflows/wdrozenie.yml`).

Stan na 2026-08-24.

## Dlaczego pomiar przestał działać 20 sierpnia

Usługa GA4 „pompy.dewax.pl" zbierała dane do ok. 20.08.2026, potem spadek do zera.

Tego samego dnia statyczna strona z tego repozytorium zastąpiła aplikację
CakePHP. Commity z 20 sierpnia:

    16:26  Mapa przekierowan 301 ze starej strony CakePHP
    16:39  Automatyczne wdrozenie strony przez GitHub Actions
    16:47  Gotowa strona do wgrania na serwer

Na starej stronie CakePHP był osadzony kontener **GTM-T4DV2B3G** oraz
**HubSpot 49004516**, na wszystkich dziewięciu podstronach. Potwierdza to
audyt (`audyt/audyt-strony.html`, linia 109).

Nowa strona statyczna nie ma ani jednego, ani drugiego. Przeszukanie
wszystkich 12 plików HTML w repozytorium pod kątem `gtag`, `googletagmanager`,
`GTM-`, `G-`, `AW-`, `analytics.js`, `dataLayer`, `fbq`, `hs-scripts`:
zero loaderów, zero kontenerów.

**Wniosek: tag GA4 nie „wypadł z kodu". Wypadł kontener GTM, który go trzymał.**
Razem z nim zniknął HubSpot — to osobna strata, dotąd niezgłoszona.

## Kontener GTM-T4DV2B3G — czego NIE udało się ustalić

Zawartości kontenera nie sprawdziłem. Definicja kontenera jest publiczna pod
adresem `https://www.googletagmanager.com/gtm.js?id=GTM-T4DV2B3G`, ale
środowisko robocze ma zablokowany ruch wychodzący — zarówno `curl`, jak
i pobieranie przez narzędzie sieciowe zwracają odmowę na poziomie proxy.

Nie ustaliłem więc:

  * czy kontener zawiera tag GA4, a jeśli tak, to z jakim identyfikatorem
  * czy jest przypisany do `pompy.dewax.pl`, do `dewax.pl`, czy do obu
  * czy należy do konta Dewaxu, czy do agencji, która go kiedyś zakładała
  * czy nadal istnieje, czy został skasowany

### Jak to sprawdzić, jedno z dwóch

**Z panelu.** tagmanager.google.com, konto Dewaxu. Jeśli kontener
GTM-T4DV2B3G jest na liście, wejdź w Tagi i zobacz, czy jest tam tag typu
„Google Analytics: zdarzenie GA4" lub „Tag Google". Identyfikator zaczyna
się od `G-`. Sprawdź też zakładkę Administracja, żeby zobaczyć, kto ma
dostęp — jeśli kontener założyła agencja, może być poza kontem Dewaxu.

**Z przeglądarki, bez dostępu do panelu.** Wejdź na
`https://www.googletagmanager.com/gtm.js?id=GTM-T4DV2B3G` i przeszukaj
odpowiedź (Ctrl+F) pod kątem ciągu `G-`. Jeśli plik wraca pusty albo bardzo
krótki, kontener nie istnieje lub jest pusty.

## Co to zmienia dla wdrożenia

Nic nie blokuje. Na produkcji **nie ma dziś żadnego loadera ani kontenera**,
więc wstawienie `gtag.js` nie zdubluje odsłon — nie ma z czym kolidować.

Rzecz do zapamiętania na później: gdyby kiedyś wrócił kontener GTM-T4DV2B3G,
a w środku miał tag GA4 tej samej usługi, to razem z blokiem `gtag.js`
odsłony liczyłyby się dwa razy. Wtedy trzeba usunąć jedno z dwóch źródeł.
Usunięcie bloku `gtag.js` to skasowanie sześciu linii z czterech plików.

## Zdarzenia kreatora

Kalkulator doboru raportował `dobor_step` i `dobor_result` przez
`dataLayer.push({event:…})`, czyli konwencją GTM. `gtag.js` takich obiektów
nie czyta, więc zdarzenia nie docierały nigdzie i nie dotarłyby także po
wstawieniu samego loadera GA4.

Zmienione na bezpośrednie `gtag('event', nazwa, parametry)` — osobny PR.
Nazwy zdarzeń i parametry bez zmian.

Po wdrożeniu trzeba zarejestrować parametry niestandardowe w GA4
(Administracja → Definicje niestandardowe), inaczej nie będą widoczne
w raportach:

    dobor_step    step
    dobor_result  moc_kw, model, metry, otwory, cena_od, cena_do

## Formularz i strona podziękowania

`wyslij.php` przekierowuje na `podziekowanie.html` w trzech miejscach:
po udanej wysyłce (linia 78) oraz po odrzuceniu bota przez honeypot
(linia 12) i przez próg 3 sekund (linia 17). Bez rozróżnienia każdy
zablokowany bot liczyłby się jako zgłoszenie.

Poprawka: `?ok=1` dochodzi wyłącznie do przekierowania po sukcesie —
osobny PR.

## Otwarte

  * identyfikator pomiaru GA4 w formacie `G-XXXXXXXXXX` — bez niego nie da
    się wstawić loadera
  * zawartość i właściciel kontenera GTM-T4DV2B3G
  * HubSpot 49004516 — czy ma wrócić na stronę
  * piksel Meta 1032857169399673 — nadal nigdy nie wystrzelił
    (`last_fired_time` = epoch 0), sprawa sprzed przebudowy
