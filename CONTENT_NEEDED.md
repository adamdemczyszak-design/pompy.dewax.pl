# CONTENT_NEEDED: dane, które ma uzupełnić właściciel

Stan na 4 września 2026. Strona działa bez tych danych: nic nie zostało zmyślone,
a każde miejsce, w którym danych brakuje, jest napisane tak, żeby było prawdziwe
także dziś. Każda pozycja niżej wzmacnia sprzedaż, ale żadna nie blokuje publikacji,
z wyjątkiem punktu 1.

## 1. Załatwione 4 września 2026

| # | Co | Stan |
|---|---|---|
| 1.1 | **Publiczny dostęp do DEWAX GEO.** Narzędzie było za logowaniem Netlify. | **Zrobione.** Widoczność projektu `dewax-geo` zmieniona na publiczną dla wersji produkcyjnej; podglądy robocze zostały prywatne. Sprawdzone: strona i jej API odpowiadają anonimowemu użytkownikowi, raport dla wskazanej miejscowości się generuje. Teksty na stronie poprawione. |

Do rozważenia na przyszłość, nie blokuje niczego: DEWAX GEO nazywa się „Asystent Wiertacza GSHP” i pyta o rzeczy, których właściciel domu nie zna (docelowa głębokość otworu, roczny czas pracy sprężarki, „Sporządził”, „Nr oferty”). Kto najpierw przejdzie kalkulator, ma moc w kW i głębokość, więc kolejność na stronie pomaga. Uproszczenie samego narzędzia wymaga jego kodu źródłowego, którego nie ma w repozytorium `dewax-geo` (jest tam tylko wersja zbudowana).

## 1b. Do potwierdzenia przed dalszą promocją narzędzia

| # | Co | Dlaczego |
|---|---|---|
| 1.2 | **Czy DEWAX GEO zapisuje adres albo dane osobowe.** | Na stronie świadomie NIE ma obietnic o prywatności. Jeśli narzędzie niczego nie zapisuje, można to dopisać jednym zdaniem. Jeśli zapisuje, trzeba dopisać je do polityki prywatności. |

## 2. Realizacje (największy zwrot za najmniejszy wysiłek)

Na stronie jest jedna wyróżniona realizacja i galeria wyłącznie z opisem tego, co widać
na zdjęciach. Żeby pokazać prawdziwe case study, dla **3–5 instalacji** potrzebne są:

- miejscowość lub region,
- rodzaj budynku (nowy / modernizacja) i metraż ogrzewany,
- model i moc pompy,
- rodzaj dolnego źródła, liczba i długość odwiertów,
- zakres prac (co robił DEWAX, co inny wykonawca),
- rok wykonania,
- **zużycie prądu po pełnym sezonie w kWh** (z licznika; najcenniejsza liczba w całej branży),
- koszt, jeśli może być publiczny,
- pisemna zgoda właściciela na publikację.

Miejsce w kodzie: `index.html`, sekcja `#realizacje`, blok `.real-feat` (wyróżniona)
i `.gal` (mniejsze). Pola `.spec` są gotowe na te dane.

## 3. Kalkulator: założenia do potwierdzenia

Algorytm i liczby są przeniesione 1:1 z wersji produkcyjnej (`js/kalkulator.js`,
test regresji `testy/kalkulator.test.mjs`). Trzy założenia wymagają potwierdzenia
przez DEWAX, bo klient widzi je w wyniku:

| Założenie | Wartość dziś | Uwaga |
|---|---|---|
| Uzysk ciepła z metra odwiertu | 50 W/m | `CLAUDE.md` z 15.08 uważał 50 W/mb za wartość zawyżoną i planował 25–45 W/mb wg gruntu. Produkcja od 20.08 liczy 50 W/m i tak zostało. Do decyzji: jaką wartość DEWAX realnie przyjmuje w projektach. Zmiana = jedna stała `W_NA_METR` i aktualizacja wzorca testów. |
| Montaż, uruchomienie i materiał kotłowni | 9 000 zł netto | oznaczone w wyniku jako „założenie”; potrzebne widełki DEWAX |
| Efektywność sezonowa | 4,2 / 3,8 / 3,5 (podłogówka / mieszane / grzejniki) | jawne założenie kalkulatora, nie SCOP urządzenia |
| Stawka za metr odwiertu | 130–145 zł netto | potwierdzić, czy obejmuje sondę, wypełnienie i próbę (tak mówi tabela wyniku) |
| Cena prądu | 1,04 zł/kWh | do okresowej aktualizacji |
| Ceny pomp Thermokrafft | katalog 2026 | do aktualizacji przy nowym cenniku |

Jedna zmiana treści komunikatu (nie algorytmu): przy zapotrzebowaniu między 20,7 a 23 kW
stary komunikat mówił, że moc „przekracza zakres najmocniejszego urządzenia (23 kW)”,
co było nieprawdą liczbowo. Teraz mówi o przekroczeniu zakresu z 10% zapasu (do 20,7 kW).

## 4. Fakty firmowe do potwierdzenia jednym zdaniem

1. **Rok założenia**: strona i dane strukturalne podają 2007; KRS wskazuje 2008 (z `tresci/pytania-o-dane.md`). Które?
2. **Gwarancja w latach**, osobno: urządzenie / szczelność sondy / wykonanie odwiertu. Dziś strona mówi tylko, że są trzy okresy zapisane w umowie.
3. **Kto płaci za dodatkowe metry**, dokładne brzmienie zapisu z umowy. Dziś: „co dzieje się z ceną przy gorszej geologii, zapisujemy w umowie przed startem”.
4. **Ile dni** trwa komplet odwiertów dla typowego domu i ile mija od umowy do wjazdu wiertnicy.
5. **Czas reakcji serwisu** w sezonie grzewczym; przeglądy okresowe: są, co ile, za ile.
6. **Które modele Thermokrafft są na liście ZUM** (Czyste Powietrze).
7. **Zasięg**: potwierdzić 6 województw i ewentualny limit kilometrów.
8. **Szerokość wjazdu** potrzebna wiertnicy HR-606S (w metrach) i powierzchnia placu na maszt.
9. **Urobek**: co z nim robicie standardowo i w jakim stanie oddajecie teren.
10. **Sondy**: producent, materiał (PE100-RC?), średnica, ciśnienie próby; **wypełnienie**: rodzaj zaczynu i przewodność.
11. **Klienci referencyjni**: ilu zgodziło się odbierać telefon.
12. **SCOP / etykieta energetyczna / hałas / masa** pomp Thermokrafft, gdy producent dostarczy.
13. **Skąd pochodzi zdjęcie `zdjecia/91.jpg` i `92.jpg`** (kotłownia „studyjna” i packshot). Na stronie użyto tylko packshotu 92.jpg z podpisem „zdjęcie producenta”. Jeśli to render, dopisać to lub usunąć.
14. **`img/glowica.webp`** (głowica sondy PRAWTEAM) wygląda jak materiał producenta, nie zdjęcie DEWAX. Nie jest już użyte na stronie. Potwierdzić pochodzenie przed ewentualnym przywróceniem.

## 5. Zdjęcia: czego brakuje i co warto mieć w lepszej jakości

Użyto wyłącznie zdjęć z repozytorium (`img/`, `zdjecia/`). Nie użyto `img/diag.webp`
(fotorealistyczny render, nie zdjęcie; zastąpiony własną ilustracją SVG oznaczoną jako
„ilustracja poglądowa”).

| Potrzeba | Dlaczego |
|---|---|
| **Zdjęcie hero w wyższej rozdzielczości**: użyto `zdjecia/77.jpg` (933×1400). Oryginał z aparatu (min. 2000 px wysokości) poprawi ostrość na ekranach Retina. | Największy obraz na stronie |
| **Zdjęcia ekipy**: twarze, imiona, staż. Nikt w branży tego nie pokazuje. | Sekcja „Wiercimy sami” ma dziś tylko maszynę |
| **Zdjęcie wiertnicy HR-606S w całości**, z widocznym wjazdem przez bramę. | Odpowiedź na „czy wiertnica ma jak wjechać” |
| **Zdjęcie terenu po zakończeniu prac** (uprzątnięty plac, zasypany otwór). | Odpowiedź na „co zostaje z trawnikiem” |
| **Zdjęcie dokumentacji**: protokół próby ciśnieniowej, dokumentacja powykonawcza (bez danych osobowych). | Dowód zamiast deklaracji |
| **Zdjęcie DEWAX GEO** (zrzut raportu) do sekcji GEO. | Dziś sekcja GEO ma tylko tekst i listę |
| `img/k2.webp`, `k1.webp`, `k3.webp` (kotłownie) są 960×720; jeśli istnieją oryginały, warto podmienić. | Galeria realizacji |
| Zdjęcia sond koszowych DEWAX Helix w trakcie opuszczania. | Karta technologii |

## 6. Informacje wymagające potwierdzenia przed publikacją

- Treść sekcji GEO opisuje narzędzie na podstawie tekstów w jego kodzie (zbudowany front
  w repozytorium `dewax-geo`): źródła CBDG PIG-PIB, Mapa Potencjału Geotermii
  Niskotemperaturowej, dane hydrogeologiczne, szacunek metrów dla mocy pompy.
  Właściciel narzędzia powinien to przeczytać i potwierdzić (sekcja `#geo`, blok „Jak to działa”).
- Kwoty dotacji: bez zmian względem wersji z 25.08 (Moje Ciepło 21 000 zł, termin 31.12.2026,
  ulga 53 000 zł odliczenia). Przed publikacją sprawdzić, czy nic się nie zmieniło.
- Dane pomp (COP, EER, ceny): bez zmian, z katalogu 2026.
- Polityka prywatności: nie zmieniano treści. Nowe pliki nie zbierają nowych danych;
  `sessionStorage` (dwie flagi: kalkulator ukończony, GEO otwarte) to pamięć przeglądarki
  na czas sesji, bez cookies. Warto to jedno zdanie dopisać do polityki przy najbliższej edycji.
- Nagłówek CSP: w repozytorium `.htaccess` nie ma Content-Security-Policy (wersja z 22.08 z
  restrykcyjną CSP nie jest tą wdrożoną). Jeśli na serwerze CSP jednak działa, musi dopuszczać
  `fonts.googleapis.com`, `fonts.gstatic.com`, `googletagmanager.com`, `consent.cookiebot.com`,
  `consentcdn.cookiebot.com`, `js.hs-scripts.com` i pozostałe skrypty HubSpot; własne CSS/JS są z tej samej domeny.
