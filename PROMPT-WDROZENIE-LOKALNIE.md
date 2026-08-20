# Instrukcja wdrożenia — dla sesji Claude Code działającej na komputerze Adama

Ten plik jest instrukcją dla Ciebie, asystencie. Adam wskazał Ci go jednym zdaniem —
wszystko, czego potrzebujesz, jest poniżej. Nie pytaj go o rzeczy opisane w tym pliku.

**Adam nie jest programistą.** Mów prosto, dawaj jedno zadanie naraz i czekaj na
potwierdzenie. Nie wypisuj po pięć poleceń w jednej wiadomości — to go gubi.
Nie tłumacz, jak coś działa, dopóki nie zapyta.

---

## Cel

Zastąpić starą stronę pod adresem `pompy.dewax.pl` nową, gotową wersją.

## Co jest już zrobione — NIE POWTARZAJ TEGO

**Kopie zapasowe są wykonane.** 20.08.2026 Adam zrobił w panelu nazwa.pl kopię
na żądanie: pliki strony (100%) oraz baza danych (100%). Leżą po stronie nazwa.pl,
przechowywane 14 dni. **Nie trać czasu na pobieranie kopii na dysk lokalny.**

Pliki są przygotowane, sprawdzone i wypchnięte na GitHub. Nie buduj ich od nowa.

## Skąd wziąć pliki

```
git clone -b main https://github.com/adamdemczyszak-design/pompy.dewax.pl
```

Na serwer trafia **wyłącznie**:

```
index.html  wyslij.php  podziekowanie.html  404.html  .htaccess
polityka-prywatnosci.html  og.jpg  favicon.png  robots.txt  sitemap.xml
img/  (15 plików)
```

Reszta zawartości repozytorium — `CLAUDE.md`, `START.md`, `konfigurator.html`,
`audyt/`, `tresci/`, `zdjecia/`, `wdroz.sh`, pliki `.md` — **zostaje w repozytorium
i nie trafia na serwer**.

Nie przepisuj tych plików, nie refaktoryzuj, nie zmieniaj treści ani stylów.

## Czego pod żadnym pozorem nie cofać

W `wyslij.php` znajduje się warunek:

```php
$czas = (int)($_POST['czas'] ?? 0);
if ($czas > 0 && $czas < 3) { header('Location: podziekowanie.html'); exit; }
```

Wygląda nietypowo, ale jest celowy. Naprawia błąd, przez który formularz pokazywał
stronę podziękowania **bez wysłania maila**, gdy JavaScript się nie wykonał — klient
widział potwierdzenie, a zgłoszenie nie docierało do nikogo. Nie zmieniaj go z powrotem
na `(int)$_POST['czas'] < 3`.

W `wyslij.php` wolno zmienić wyłącznie `$ODBIORCA` i `$NADAWCA`.

## Serwer

- nazwa.pl, pakiet CloudHosting Biznes
- `server420780.nazwa.pl`, IP `85.128.139.207`
- Panel: `admin.nazwa.pl` (Adam wchodzi przez autologowanie z panelu klienta)
- Stoi tam stara aplikacja **CakePHP 4**, która trzyma treść w bazie danych
- Na serwerze aktywny jest **CDN nazwa.pl**

Poproś Adama o dane FTP. Nie zapisuj ich w żadnym pliku ani w repozytorium.

## Kolejność działań — po jednym kroku, z potwierdzeniem

### Krok 1 — znajdź katalog
Połącz się i wylistuj katalogi. **Nie zakładaj, że to `/pompy`** — sprawdź.
Pokaż Adamowi drzewo i potwierdźcie razem, który katalog obsługuje `pompy.dewax.pl`.

### Krok 2 — mapa przekierowań 301
Zanim cokolwiek skasujesz, pobierz stary `https://pompy.dewax.pl/sitemap.xml`
i wypisz adresy starych podstron. Po wdrożeniu wszystkie zwrócą 404 razem
z pozycjami w Google.

W `.htaccess` jest pusta sekcja między znacznikami
`--- początek listy przekierowań ---` i `--- koniec listy przekierowań ---`.

Format: `Redirect 301 /kalkulator  https://pompy.dewax.pl/#kreator`

Dostępne kotwice na nowej stronie: `#kreator` `#pompy` `#zrodla` `#krecik` `#geo`
`#realizacje` `#proces` `#faq` `#instalatorzy` `#kontakt` `#dofinansowanie`

Pokaż Adamowi proponowaną mapę do zatwierdzenia przed wgraniem.

### Krok 3 — wgranie
Wyczyść katalog i wgraj pliki do **katalogu głównego** domeny, nie do podfolderu.
`img/` zostaje podkatalogiem. Uprawnienia: pliki `644`, katalogi `755`.

**Po wgraniu sprawdź, czy `.htaccess` faktycznie jest na serwerze.** Zaczyna się
od kropki i bywa pomijany przez narzędzia FTP. Bez niego nie ma HTTPS ani kompresji.

### Krok 4 — CDN
Wyczyść pamięć podręczną CDN w panelu nazwa.pl, inaczej strona będzie pokazywać
starą wersję mimo poprawnego wgrania.

### Krok 5 — testy
Nie łącz `curl -I` z `-X POST` — przy POST daje mylący wynik.
Używaj `curl -s -o /dev/null -w "%{http_code}"`.

| Test | Oczekiwany wynik |
|---|---|
| `http://pompy.dewax.pl` | 301 na https |
| `https://pompy.dewax.pl` | 200 |
| nagłówek gzip | `content-encoding: gzip` |
| `/img/hero_wide.webp` | 200 |
| `/og.jpg` | 200 |
| `/polityka-prywatnosci.html` | 200 |
| `/nie-ma-takiej-strony` | 404 |
| `/sitemap.xml` | poprawny XML |
| `/wyslij.php` metodą GET | 302 |
| POST z błędnymi danymi | 422 |
| POST z `bot-field=spam` | 302 |
| **POST bez pola `czas`** | **422 — nie 302** |

Ostatni test jest najważniejszy. Jeśli zwróci 302, ktoś cofnął poprawkę
opisaną w sekcji „Czego pod żadnym pozorem nie cofać".

### Krok 6 — test formularza
Poproś Adama, żeby wysłał formularz z przeglądarki i sprawdził skrzynkę
`sprzedaz@dewax.pl` **oraz folder spam** — domena nie ma jeszcze DKIM ani DMARC,
więc powiadomienia mogą tam trafiać.

### Krok 7 — podsumowanie
Krótko: co wgrane, jaka mapa 301, wyniki testów, co wymaga decyzji Adama.
Przypomnij o zgłoszeniu `sitemap.xml` w Google Search Console.

## Czego nie robić

- Nie instaluj CMS-a, nie stawiaj Node ani buildów
- Nie dodawaj bibliotek ani narzędzi analitycznych — zdarzenia `dataLayer`
  są już w kodzie, GA4 Adam podepnie sam
- Nie zmieniaj rekordów DNS
- Nie wysyłaj testowych maili masowo — jeden wystarczy
- Nie zakładaj repozytorium git na serwerze

## Zadanie na później, nie teraz

W repozytorium jest `poczta-dkim-dmarc.md` z instrukcją dodania DKIM i DMARC
w panelu nazwa.pl. Zaproponuj to Adamowi dopiero po udanym wdrożeniu.
