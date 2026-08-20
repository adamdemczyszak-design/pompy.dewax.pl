# Prompt do wklejenia w Claude Code na własnym komputerze

Skopiuj wszystko poniżej poziomej linii i wklej jako pierwszą wiadomość.

---

Wdróż gotową stronę na hosting nazwa.pl, pod adres `pompy.dewax.pl`.

## Skąd wziąć pliki

Wszystko jest już przygotowane i zwersjonowane w repozytorium GitHub. Zacznij od:

```
git clone https://github.com/adamdemczyszak-design/pompy.dewax.pl
cd pompy.dewax.pl
```

Gałąź `main`, commit `3093abb` lub nowszy. W repozytorium znajdziesz:

- pakiet wdrożeniowy: `index.html`, `wyslij.php`, `podziekowanie.html`, `404.html`,
  `.htaccess`, `og.jpg`, `favicon.png`, `robots.txt`, `sitemap.xml`, `img/` (15 plików)
- `wdroz.sh` — etapowy skrypt wdrożenia (Linux/macOS)
- `poczta-dkim-dmarc.md` — zadanie na później, nie teraz
- `audyt/` — audyty strony i bezpieczeństwa

**Nie przepisuj tych plików, nie refaktoryzuj, nie zmieniaj treści ani stylów.**
Twoim zadaniem jest wymiana strony na serwerze i weryfikacja, że działa.

## Co już zostało zrobione — nie powtarzaj tego

1. Pakiet jest w repozytorium (nie trzeba go wersjonować od nowa).
2. **Naprawiono błąd cichej utraty zgłoszeń.** Pole `czas` w formularzu ma domyślnie `0`,
   a podmienia je JavaScript przy wysyłce. Stara wersja `wyslij.php` odrzucała takie
   zgłoszenie jako bota i pokazywała stronę podziękowania bez wysłania maila.
   Obecna logika odrzuca wyłącznie wysyłki zmierzone na 1–2 sekundy.
   **Nie przywracaj poprzedniej wersji tego warunku.**
3. Sekcji o dofinansowaniach nadano `id="dofinansowanie"`.

## Sytuacja na serwerze

Pod adresem `pompy.dewax.pl` stoi dziś aplikacja **CakePHP 4**, która trzyma treść
w **bazie danych**, nie w plikach. To jest kluczowe dla kopii zapasowej.

Hosting: nazwa.pl, serwer `server420780.nazwa.pl`, adres `85.128.139.207`.
Katalog aplikacji to prawdopodobnie `/pompy` z document rootem `/pompy/webroot`,
ale **nie zgaduj — najpierw wylistuj serwer i pokaż mi drzewo.**

## Kolejność działań

### Krok 1 — połączenie
Zapytaj mnie o host, login i hasło FTP (panel nazwa.pl → Serwery → Dane dostępowe).
Nie zapisuj ich w żadnym pliku. Jeśli pakiet ma SSH/SFTP, użyj go zamiast FTP.
Pokaż mi strukturę katalogów i ustalmy wspólnie, gdzie leży strona.

Możesz użyć gotowego skryptu: `./wdroz.sh drzewo`

### Krok 2 — kopia zapasowa, trzy elementy
Kopia plików przez FTP **nie wystarczy**, bo treść jest w bazie danych.

- **2a. Baza:** panel nazwa.pl → Bazy danych → phpMyAdmin → Eksport → SQL.
  Dane połączenia są w `config/app_local.php` starej aplikacji.
  Zapisz jako `~/Downloads/DEWAX_STRONA/backup_RRRR-MM-DD/baza.sql`
- **2b. Pliki:** cały katalog domeny na dysk lokalny
- **2c. Galeria:** osobno `/pompy/webroot/uploads/galleries/big/`

Gotowy skrypt: `KATALOG_ZDALNY=/pompy ./wdroz.sh kopia`

Pokaż mi liczbę plików, rozmiar w MB i rozmiar `baza.sql`. **Czekaj na moje „ok".**

### Krok 3 — mapa przekierowań 301
Zanim wyczyścisz katalog, pobierz stary `sitemap.xml` i wypisz adresy podstron
(sprawdź też routing w `config/routes.php`). Po wdrożeniu wszystkie stare adresy
zwrócą 404 razem z pozycjami w Google.

W `.htaccess` jest przygotowana pusta sekcja między znacznikami
`--- początek listy przekierowań ---` i `--- koniec listy przekierowań ---`.
Format wpisu:

```
Redirect 301 /kalkulator  https://pompy.dewax.pl/#kreator
```

Dostępne kotwice na nowej stronie: `#kreator`, `#pompy`, `#zrodla`, `#krecik`, `#geo`,
`#realizacje`, `#proces`, `#faq`, `#instalatorzy`, `#kontakt`, `#dofinansowanie`.

**Pokaż mi proponowaną mapę do zatwierdzenia przed wgraniem.**

### Krok 4 — wgranie
Wyczyść katalog i wgraj pakiet do katalogu głównego domeny (nie do podfolderu).
`img/` zostaje podkatalogiem. Uprawnienia: pliki `644`, katalogi `755`.

Gotowy skrypt: `KATALOG_ZDALNY=/pompy ./wdroz.sh wgraj`
(odmówi startu bez kopii i bez `baza.sql`, poprosi o wpisanie `WDRAZAM`)

**Po wgraniu zweryfikuj, że `.htaccess` faktycznie jest na serwerze** — zaczyna się
od kropki i bywa pomijany przez narzędzia FTP. Bez niego nie ma HTTPS ani kompresji.

### Krok 5 — testy
Gotowy skrypt: `./wdroz.sh testy` — wykonuje 12 testów i pokazuje tabelę.

**Uwaga na składnię:** nie łącz `curl -I` z `-X POST`. `-I` czyta tylko nagłówki
i przy POST daje mylący wynik. Do testów POST używaj `curl -s -o /dev/null -w "%{http_code}"`.

Testy obejmują: przekierowanie HTTPS (301), stronę główną (200), gzip, zdjęcia WebP,
logo, `og.jpg`, stronę 404, `sitemap.xml`, `wyslij.php` na GET (302), walidację (422),
honeypot (302) oraz zgłoszenie bez pola `czas` — to ostatnie musi zwrócić **422, nie 302**.
Jeśli zwróci 302, poprawka błędu cichej utraty zgłoszeń została cofnięta.

### Krok 6 — test formularza jak użytkownik
Wyślij formularz z przeglądarki. Potwierdź stronę podziękowania.
Ja sprawdzę skrzynkę `sprzedaz@dewax.pl` **oraz folder spam** — domena nie ma
jeszcze DKIM ani DMARC, więc powiadomienia mogą tam trafiać.

### Krok 7 — raport
Podsumuj: lokalizacja i rozmiar trzech kopii, zastosowana mapa 301, wyniki testów,
lista spraw wymagających mojej decyzji. Przypomnij o zgłoszeniu `sitemap.xml`
w Google Search Console.

## Czego NIE robić

- Nie modyfikuj `index.html`, `wyslij.php` ani `404.html` bez mojej zgody.
  W `wyslij.php` jedyne pola do zmiany to `$ODBIORCA` i `$NADAWCA` na górze.
- W `.htaccess` uzupełniasz **wyłącznie** sekcję przekierowań między znacznikami.
- Nie instaluj CMS-a, nie stawiaj Node ani buildów, nie dodawaj bibliotek
  ani narzędzi analitycznych. Zdarzenia `dataLayer` są w kodzie, GA4 podepnę sam.
- Nie zmieniaj rekordów DNS.
- Nie wysyłaj testowych maili masowo — jeden wystarczy.
- Nie zakładaj repozytorium git na serwerze.

## Po wdrożeniu
W repozytorium jest `poczta-dkim-dmarc.md` z instrukcją dodania DKIM i DMARC
w panelu nazwa.pl. To osobne zadanie, po udanym wdrożeniu.
