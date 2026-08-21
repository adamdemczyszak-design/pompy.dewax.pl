# Zadanie: dokończyć wdrożenie bramy na dewax.pl

Adam nie ma czasu klikać po panelach. Zrób to za niego, prowadząc go tylko tam,
gdzie naprawdę potrzebne jest jego hasło.

**Adam nie jest programistą.** Jedno polecenie naraz, czekaj na potwierdzenie,
nie wypisuj pięciu kroków w jednej wiadomości.

---

## Cel

Na `dewax.pl` (strona farb Multilan) ma stanąć prosta strona wyboru działu:
**DEWAX ENGINEERING** (prowadzi na pompy.dewax.pl) i **DEWAX PAINT** (prowadzi na
istniejącą stronę farb). Strona farb ma zostać nietknięta — brama tylko staje przed nią.

Gotowe pliki leżą w repozytorium `adamdemczyszak-design/pompy.dewax.pl`, katalog `brama/`:
`index.html`, `pompy.webp`, `granit.webp`, `farba.webp`, `logo-biale-kropki.png`.

---

## Czego NIE rób — to już zrobione, nie powtarzaj

- **Nie przebudowuj bramy.** Jest zaakceptowana przez Adama, wygląd zatwierdzony.
- **Nie ruszaj pompy.dewax.pl.** Nowa strona jest tam wdrożona, działa, przeszła testy.
- **Nie szukaj katalogu na koncie FTP `server420780_deploy`.** Sprawdzone do końca, nie ma go tam.
- **Nie podejrzewaj CDN.** Wykluczone: pompy.dewax.pl stoi za tym samym CDN i aktualizuje się natychmiast.

---

## Co już ustalono testami na żywym serwerze

Serwer `server420780.nazwa.pl`, konto FTP `server420780_deploy` (katalog `/`),
dane w sekretach GitHub Actions: `FTP_HOST`, `FTP_LOGIN`, `FTP_HASLO`.

| Katalog na koncie FTP | Domena | Stan |
|---|---|---|
| `/pompy/webroot` | pompy.dewax.pl | nowa strona wdrożona, działa |
| `/thermokrafft` | thermokrafft.pl | osobna strona, nietknięta |
| `/` i wszystkie pozostałe | **żadna** | leży tam nieużywana kopia WordPressa z 2022 |

Test rozstrzygający: ten sam plik wgrany jednocześnie do dziewięciu katalogów
(`/`, `/datadir`, `/backups`, `/bazy_danych`, `/images`, `/migracja`,
`/migracja/ftp.d1063384-23091.wuti.pl`, `/wp-content`, `/pompy`) — przez dewax.pl
**każdy zwrócił 404**. Przez pompy.dewax.pl i thermokrafft.pl znaczniki były widoczne (200).

Drugi dowód: arkusz `wp-content/et-cache/2/et-core-unified-2.min.css` z żywej strony
ma 9296 bajtów, a ten sam plik na koncie FTP — 825 bajtów. `readme.html` też się różni.
To **dwie różne instalacje WordPressa**.

Wniosek: dewax.pl jest obsługiwana z katalogu, do którego konto `server420780_deploy` nie sięga.

---

## Co masz zrobić

### Krok 1 — znajdź katalog domeny dewax.pl

Poproś Adama, żeby otworzył **admin.nazwa.pl** (ciemnoniebieski panel z menu
POCZTA / WWW i FTP / BAZY DANYCH / DOMENY / CDN / BACKUP — nie mylić z `panel.nazwa.pl`).

Tam: górne menu → **DOMENY**. Ta lista pokazuje domeny podpięte do serwera
i katalog, na który każda wskazuje. Potrzebna jest wartość przy `dewax.pl`.

Jeśli w tej zakładce nie ma kolumny z katalogiem, sprawdź **WWW i FTP → lista serwisów WWW**.

Możliwe, że okaże się, iż dewax.pl jest obsługiwana przez osobną usługę hostingową
albo przez mechanizm aplikacji zarządzanej nazwa.pl. Wtedy trzeba tam założyć konto FTP:
**WWW i FTP → Konta FTP → Dodaj konto FTP**, nazwa `deploy`, **katalog `/`**, mocne hasło.

### Krok 2 — ustaw katalog i wdroż

Gdy znasz katalog, są dwie drogi:

**A. Jeśli to ten sam serwer, inny katalog** — wejdź na
https://github.com/adamdemczyszak-design/pompy.dewax.pl/settings/variables/actions
i dodaj zmienną `KATALOG_DEWAX` o wartości równej ścieżce katalogu (np. `/dewax`).

**B. Jeśli to inna usługa hostingowa** — podmień trzy sekrety pod
https://github.com/adamdemczyszak-design/pompy.dewax.pl/settings/secrets/actions
na dane nowego konta FTP.

Następnie uruchom wdrożenie: zmień plik `.github/brama-znacznik` w gałęzi `main`
(wystarczy wpisać tam bieżącą datę) i wypchnij. Workflow `.github/workflows/brama.yml`
zrobi resztę: pobierze kopię `.htaccess`, wgra pliki bramy, dopisze `DirectoryIndex index.html index.php`
i przepuści stronę przez testy.

### Krok 3 — sprawdź

- `https://dewax.pl/` pokazuje bramę z napisami DEWAX ENGINEERING i DEWAX PAINT
- kliknięcie w DEWAX PAINT prowadzi na starą stronę farb, która działa jak wcześniej
- `https://pompy.dewax.pl/` działa dalej bez zmian

---

## Wycofanie, gdyby coś poszło źle

Workflow zapisuje kopię `.htaccess` sprzed zmiany jako artefakt GitHub Actions (90 dni).
Żeby wrócić: usuń z `.htaccess` w katalogu domeny dwie dopisane linie
(`# brama DEWAX...` oraz `DirectoryIndex index.html index.php`) i skasuj `index.html`.
Strona farb wróci natychmiast — pliki WordPressa nie są w ogóle ruszane.

## Uwaga na pułapkę, w którą już wpadliśmy

Przy pierwszym podejściu workflow nadpisał własną kopię zapasową `.htaccess` swoją
zmodyfikowaną wersją. Jeśli uruchamiasz wdrożenie po raz drugi, sprawdź, czy plik
`.htaccess.kopia-przed-brama` nie zawiera już dopisanych linii.

## Czego już nie sprawdzaj — sprawdzone i bez wyniku

DNS nie rozstrzygnie, gdzie leży dewax.pl. Wszystkie domeny wskazują na ten sam
adres brzegowy nazwa.pl:

```
dewax.pl        85.128.139.207
www.dewax.pl    85.128.139.207
pompy.dewax.pl  85.128.139.207
thermokrafft.pl 85.128.139.207
server420780    85.128.139.207
```

To jest wspólny front CDN, a nie dowód na wspólny katalog. Jedyne wiarygodne
źródło to panel `admin.nazwa.pl` → DOMENY, wiersz `dewax.pl`, kolumna z katalogiem
albo z nazwą usługi hostingowej.
