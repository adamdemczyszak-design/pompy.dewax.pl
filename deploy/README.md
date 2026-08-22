# Poprawki zgodności — pliki do wgrania ręcznie

Audyt z 22.08.2026, punkty 1–4. Te pliki **nie są częścią prototypu** —
to gotowce do wgrania na serwery, bo źródła obu żywych stron nie leżą w gicie.

## Dlaczego ręcznie

| Co | Gdzie faktycznie żyje | W repozytorium? |
|---|---|---|
| dewax.pl | nieznany serwer, brak źródeł | nie ma w żadnym repo |
| pompy.dewax.pl | CakePHP 4, `server420780.nazwa.pl`, `/pompy/webroot` | nie, treść w bazie |
| prototyp nowej strony | ten folder, `index.html` | tak |

## Co jest w tym folderze

### `dewax.pl/.htaccess` — punkty 1 i 2

Wymuszenie HTTPS (301) + komplet nagłówków bezpieczeństwa.
Wgraj do document rootu dewax.pl. **Jeśli plik już tam istnieje — nie nadpisuj**,
przenieś bloki zgodnie z komentarzem w nagłówku pliku.

Test po wdrożeniu:

```bash
curl -sI http://dewax.pl | head -3          # ma być 301 + location: https://
curl -sI https://dewax.pl | grep -i "strict-transport\|content-security\|x-frame"
```

### `pompy.dewax.pl/.htaccess` — punkt 2

Same nagłówki (przekierowania HTTPS audyt tu nie zgłosił).

**Nie nadpisuj `/pompy/webroot/.htaccess`** — są w nim reguły routingu CakePHP.
Dopisz blok `<IfModule mod_headers.c>` na końcu istniejącego pliku.

CSP jest tu rozszerzone o GTM i HubSpot względem treści zadania — powód
opisany w komentarzu w pliku. Wersja dosłowna też tam jest, zakomentowana.

Test:

```bash
curl -sI https://pompy.dewax.pl | grep -i "strict-transport\|content-security\|x-frame\|referrer"
```

Potem przeklikaj: formularz kontaktowy, kreator, kalkulator, galerię —
i sprawdź konsolę przeglądarki pod kątem błędów CSP.

### `dewax.pl/stopka.html` — punkt 3

Stopka z danymi spółki (art. 206 § 1 KSH). Do wklejenia przed `</body>`
na dewax.pl. Nie mogłem tego zrobić sam — nie mam źródeł tej strony.

## Punkt 4 — zrobiony w repo

Stopka `index.html` (prototyp) ma już sąd rejestrowy i kapitał zakładowy.
**To nie naprawia żywej strony** — jej stopkę trzeba poprawić w panelu
administracyjnym CakePHP. Docelowa treść:

```
Sąd Rejonowy Poznań – Nowe Miasto i Wilda w Poznaniu, IX Wydział Gospodarczy KRS · KRS 0000298299 · NIP 6080071501 · REGON 300706044 · Kapitał zakładowy: 50 000,00 zł
```

## Do sprawdzenia przy okazji

Audyt stwierdza, że obie strony nie mają trackerów i nie ustawiają ciasteczek,
i na tej podstawie odpada baner zgody. CLAUDE.md tego repozytorium mówi coś
innego o żywej pompy.dewax.pl: GTM `GTM-T4DV2B3G` i HubSpot `49004516`
osadzone na wszystkich podstronach. HubSpot ustawia ciasteczka (`__hstc`,
`hubspotutk`), a GA4 przez GTM — swoje. Jedno z tych ustaleń jest nieaktualne.
Warto rozstrzygnąć, zanim temat banera uzna się za zamknięty.
