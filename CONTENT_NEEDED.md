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

## 7. Podstrony poradnika (Etap 2, 09.09.2026): miejsca oznaczone w kodzie komentarzem DO UZUPEŁNIENIA / DO WERYFIKACJI

| # | Plik | Czego brakuje |
|---|---|---|
| 7.1 | `sondy-koszowe-helix.html` | Parametry DEWAX Helix: głębokość i średnica otworu na kosz, długość rury w koszu, materiał rury, ciśnienie próby, typowy uzysk mocy z jednego kosza w gruncie wilgotnym i suchym. Bez tych danych strona opisuje zasadę działania, nie liczby. |
| 7.2 | `odwierty-pod-pompe-ciepla.html` | Standardowe postępowanie z urobkiem i minimalna szerokość wjazdu wiertnicy HR-606S (to samo co punkty 4.8 i 4.9). |
| 7.3 | `dotacje-pompa-ciepla.html` | Aktualny próg wskaźnika EP w Moim Cieple dla wniosków z 2026 oraz kwoty i progi dochodowe Czystego Powietrza z aktualnego Załącznika nr 2. Na stronie świadomie nie ma tych liczb. |
| 7.4 | wszystkie | Zdjęcie sondy koszowej w trakcie opuszczania i zdjęcie terenu po zakończeniu prac wzmocniłyby strony o Helix i o odwiertach (to samo co punkt 5). |

## 8. Strony wojewódzkie (Etap 3, 09.09.2026): miejsca oznaczone w kodzie komentarzem DO WERYFIKACJI

Opisy geologii są napisane na podstawie ogólnodostępnej wiedzy o budowie geologicznej regionów (materiały PIG-PIB, mapy geologiczne) i celowo unikają liczb. Przed dopisaniem konkretnych miąższości, głębokości stropu skał czy uzysków dla powiatu trzeba je sprawdzić w profilach CBDG PIG-PIB lub w DEWAX GEO.

| # | Plik | Do sprawdzenia |
|---|---|---|
| 8.1 | wszystkie | Zakresy miąższości czwartorzędu podane ogólnie („kilkadziesiąt metrów”); przed publikacją liczb dla powiatów sprawdzić profile archiwalne. |
| 8.2 | `lodzkie.html` | Zasięg terenu górniczego KWB Bełchatów i wymagane uzgodnienia dla odwiertów do 100 m. |
| 8.3 | `kujawsko-pomorskie.html`, `dolnoslaskie.html` | Zasady dla odwiertów w strefach ochrony uzdrowiskowej (Ciechocinek, Inowrocław, uzdrowiska sudeckie). |
| 8.4 | `slaskie.html` | Procedura uzgodnień odwiertów na terenach górniczych (OUG, przedsiębiorca górniczy, starostwo). |
| 8.5 | `mazowieckie.html` | Głębokość stropu skał mezozoicznych w rejonie Radomia i Szydłowca. |
| 8.6 | wszystkie | Odległości i czasy dojazdu z serwera tras OSRM (OpenStreetMap), stan 09.09.2026; jeśli DEWAX ma własne doświadczenie z czasem dojazdu, podmienić. |
| 8.7 | wszystkie | Jeśli DEWAX ma listę powiatów, w których faktycznie wykonano odwierty, warto dopisać zdanie „wierciliśmy w powiatach…” z realnymi nazwami; dziś strony tego nie twierdzą. |

## 9. Opinie (Etap 4, 09.09.2026)

Infrastruktura gotowa, treści brak. Sekcja `#opinie` w `index.html` jest ukryta; formularz zgody: `zgoda-na-publikacje-opinii.html`.

| # | Co | Uwaga |
|---|---|---|
| 9.1 | Zebrane zgody klientów (online przez formularz albo podpisany wydruk) | Bez zgody nie odsłaniać sekcji. Zakres danych przy opinii wyłącznie taki, jaki klient zaznaczył. |
| 9.2 | Konwersja w GA4 / Google Ads | Sprawdzić, czy jest zdefiniowana na adresie `podziekowanie.html` bez parametru; jeśli tak, zawęzić do `?ok=1` (patrz docs/ANALITYKA.md). |
| 9.3 | Polityka prywatności | Dopisać cel „publikacja opinii za zgodą” do listy celów przetwarzania przy najbliższej edycji dokumentu. |
| 9.4 | Test wysyłki na produkcji | Po wdrożeniu wysłać jedną testową zgodę i sprawdzić, czy mail dociera na sprzedaz@dewax.pl z tematem „Zgoda na publikację opinii”. |

## 10. Kampania Meta Ads (12.09.2026): do potwierdzenia przez właściciela

Piksel Meta `1032857169399673` jest wpięty w stronę (kategoria marketing, `docs/ANALITYKA.md`), kampania
`120249004354710355` czeka wstrzymana i bez budżetu. Pełny opis: `reklamy/meta/KAMPANIA.md`.

| # | Co | Uwaga |
|---|---|---|
| 10.1 | Konto reklamowe i strona (Page) | **Zrobione 12.09:** kampania `120248421653200027` zbudowana przez Windsor.ai na koncie „Dewax gruntowe pompy ciepła” `955522616312255` i włączona. Kampania `120249004354710355` na „nowe konto reklamowe 1” wstrzymana, do usunięcia. Szczegóły: `reklamy/meta/KAMPANIA.md`, sekcja „Przeniesienie”. |
| 10.1a | Domyślny beneficjent i płatnik (DSA) na koncie `955522616312255` | Ustawienia konta reklamowego, sekcja o przejrzystości w UE: wpisać „DEWAX Sp. z o.o.” jako beneficjenta i płatnika. Bez tego zestawy reklam tworzone przez Windsor.ai (które nie ma pola DSA) mogą zostać odrzucone. |
| 10.2 | Budżet | Ustawiony 12.09.2026 za zgodą właściciela: 60 zł/dzień, limit wydatków 2 000 zł; zestaw A (200 km od Dobrzycy plus Warszawa) i reklamy R1–R4 wstrzymane. Zmiany w Menedżerze reklam. |
| 10.3 | Zgoda operatora na zdjęcia w reklamach | `zdjecia/77.jpg` i `76.jpg` (operator przy wiertnicy) są już na stronie; upewnić się, że zgoda obejmuje także reklamy płatne na Facebooku i Instagramie. |
| 10.4 | Reklama „Moje Ciepło do 31.12.2026” | Utworzyć dopiero po sprawdzeniu, że nabór i kwoty (21 000 zł) są aktualne. |
| 10.5 | Piksel na dewax.pl (WordPress) | Kampania Multilan na koncie „nowe konto reklamowe 1” optymalizuje na konwersję z piksela „dewax.pl” `1032857169399673`, który nigdzie nie jest wpięty. Od 12.09 po południu pompy.dewax.pl używa piksela pomp `965779382154454`, więc piksel „dewax.pl” trzeba wpiąć w WordPressa dewax.pl (z bramkowaniem zgodą), inaczej kampania Multilan dalej nie ma sygnału. |
| 10.6 | Cookiebot | Po wdrożeniu ponownie przeskanować domenę, żeby cookie `_fbp` trafiło do deklaracji cookies. |
| 10.7 | Weryfikacja domeny w Meta | Ustawienia firmowe, Bezpieczeństwo marki, Domeny: dodać i zweryfikować `dewax.pl` (obejmuje pompy.dewax.pl). |
