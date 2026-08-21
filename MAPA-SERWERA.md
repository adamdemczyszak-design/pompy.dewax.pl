# Mapa serwera — co gdzie stoi

Ustalone 21.08.2026 testami na żywym serwerze, nie z domysłów.

## Konto, do którego mamy dostęp

Serwer `server420780.nazwa.pl`, konto FTP `server420780_deploy` z katalogiem głównym `/`.
Dane logowania siedzą w sekretach repozytorium na GitHubie (`FTP_HOST`, `FTP_LOGIN`, `FTP_HASLO`)
i nigdzie indziej — nie ma ich w żadnym pliku.

| Katalog | Domena | Stan |
|---|---|---|
| `/pompy/webroot` | pompy.dewax.pl | **nowa strona wdrożona i działa** |
| `/thermokrafft` | thermokrafft.pl | osobna strona, nietknięta |
| `/` | **żadna** | leży tam nieużywana kopia WordPressa z 2022 roku |

## Czego na tym koncie NIE ma

`dewax.pl` (strona farb Multilan) **nie jest obsługiwana z tego serwera**. Sprawdzone testem:
ten sam plik wgrany jednocześnie do `/`, `/pompy/webroot` i `/thermokrafft` był widoczny
przez pompy.dewax.pl i thermokrafft.pl, ale przez dewax.pl zwracał 404.

Przeszukane i puste albo nieistotne: `/datadir`, `/backups`, `/bazy_danych`, `/images`,
`/migracja` (resztki przenosin z hostingu wuti.pl w 2021).

Wniosek: **dewax.pl stoi na drugiej usłudze hostingowej**, do której nie mamy jeszcze dostępu.
Wszystkie domeny mają ten sam adres IP (85.128.139.207), więc adres IP niczego tu nie rozstrzyga.

## Co jest gotowe i czeka

Brama dla dewax.pl (podział 50/50, DEWAX ENGINEERING i DEWAX PAINT) leży w katalogu `brama/`.
Wdrożenie uruchamia workflow `.github/workflows/brama.yml`. Katalog docelowy bierze ze zmiennej
repozytorium `KATALOG_DEWAX`, domyślnie `/`.

Do wdrożenia brakuje wyłącznie dostępu FTP do właściwej usługi.

## Automaty wdrożeniowe

| Plik | Do czego |
|---|---|
| `wdrozenie.yml` | wgrywa stronę pomp po każdej zmianie na gałęzi main, z kopią zapasową i 12 testami |
| `przywroc.yml` | odtwarza stan sprzed wybranego wdrożenia |
| `brama.yml` | wgrywa bramę na dewax.pl (czeka na dostęp) |

Kopie zapasowe z każdego wdrożenia leżą w artefaktach GitHub Actions przez 90 dni.
