# DEWAX — przebudowa pompy.dewax.pl

Kontekst projektu. Przeczytaj w całości, zanim cokolwiek zmienisz.

## Co to za projekt

DEWAX Sp. z o.o. (Dobrzyca, KRS 0000298299) montuje **gruntowe pompy ciepła** i wykonuje odwierty **własnymi wiertnicami**. Strona `pompy.dewax.pl` ma zostać przebudowana z broszury w narzędzie sprzedaży.

Cel: doprowadzić inwestora od „nie wiem, czy gruntowa pompa ma sens" do „chcę policzyć swoją inwestycję / chcę ofertę".

## Stan obecny

W tym folderze są **prototypy**, nie produkcja. Żywa strona to aplikacja **CakePHP 4** na serwerze `server420780.nazwa.pl` (nazwa.pl), katalog `/pompy`, document root `/pompy/webroot`. Treść siedzi w bazie i edytuje się przez panel administracyjny — nie przez pliki.

| Plik | Co to |
|---|---|
| `index.html` | prototyp nowej strony głównej, wersja 3 |
| `konfigurator.html` | konfigurator ceny inwestycji, wersja 2 |
| `tresci/strategia.md` | pełna strategia: psychologia klienta, konkurencja, architektura, SEO |
| `tresci/teksty-thermokrafft.md` | gotowe teksty zastępcze do wklejenia w panelu |
| `zdjecia/` | nowe zdjęcia gotowe do wgrania (nazwy pasują do rekordów w bazie) |
| `zdjecia/kopia-starych/` | kopia bezpieczeństwa poprzednich zdjęć |

## Trzy rzeczy do naprawienia na żywej stronie, niezależnie od przebudowy

1. **Podstrona `/kalkulator` zawiera `<iframe>` do `https://www.old.a-pic.pl/kalkulator/`** — to kalkulator konkurencyjnego producenta pomp ciepła. Wysyła najcenniejszy ruch do konkurencji. Do usunięcia.
2. **Podstrona Dotacje podaje „do 29 450 zł" z programu Moje Ciepło.** To nieprawda — maksimum to **21 000 zł**. Błąd faktyczny, ryzyko sporu z klientem.
3. **Piksel Meta `1032857169399673` nigdy nie wystrzelił** (`last_fired_time` = epoch 0) i nie ma go w kodzie strony, mimo że działają 4 konta reklamowe. GTM `GTM-T4DV2B3G` i HubSpot `49004516` są poprawnie osadzone na wszystkich podstronach.

## Pozycjonowanie

> **Wiercimy sami. Dlatego odpowiadamy za całość.**

Analiza 17 stron konkurencji: dziewięć firm wspomina o własnym sprzęcie, żadna nie zrobiła z tego argumentu. Fakt jest zajęty, znaczenie wolne. Firma podzlecająca wiercenia nie skopiuje tego, choćby chciała.

Cztery luki rynkowe, których nikt nie zajął: **dzień wiercenia na działce**, **kto odpowiada, gdy źródło nie wyrabia**, **geologia konkretnej gminy**, **kto płaci za dodatkowe metry**.

## Zasady pisania tekstów

Bezwzględnie obowiązujące. Były już łamane i kosztowało to jedną rundę poprawek.

**Nigdy nie wymyślaj** realizacji, opinii, parametrów, COP/SCOP, gwarancji, certyfikatów, liczby instalacji, lat doświadczenia, cen ani dotacji. Brak danych oznaczaj jako `[BRAK DANYCH — czego potrzeba]` i pracuj dalej nad resztą.

**Język.** Pisz jak człowiek znający branżę. Bez superlatywów, bez „kompleksowej obsługi", „innowacyjnych rozwiązań", „indywidualnego podejścia". Każde zdanie ma wyjaśniać, przekonywać, rozbrajać obiekcję, przedstawiać dowód albo prowadzić do kolejnego kroku. Jeśli nie robi żadnej z tych rzeczy — usuń je.

**Uwaga na myślniki.** Detektor impeccable wykrył 72 pauzy w `index.html` jako sygnał rytmu charakterystycznego dla AI. Przy pisaniu nowych treści używaj przecinków, dwukropków i kropek.

**Słownik klienta.** Używaj: gruntówka, dolne źródło, odwierty, sonda, glikol, podłogówka, bufor, grzałka, wiertnica, CWU, ciepełko, cisza za oknem, bezobsługowe, opłaca się.
Nie używaj: wymiennik gruntowy, sonda geotermalna, górotwór, jednostkowy uzysk ciepła, biwalencja, solanka, efektywność energetyczna, rozwiązanie ekologiczne, inwestycja w przyszłość.

**Ekologia nie sprzedaje.** Research forów pokazał, że inwestorzy wprost odrzucają ten argument. Sprzedają: cisza, stabilność przy mrozie, chłodzenie latem, brak zajmowania się ogrzewaniem.

## Czego nie wolno twierdzić

Ustalone na podstawie materiałów PORT PC. Łamanie tych zasad to ryzyko prawne i utrata wiarygodności.

- **Żadnych wartości W/mb powołując się na PORT PC** — tych danych w otrzymanych materiałach nie ma.
- **„Sonda ma 50 lat żywotności wg normy VDI"** to nadinterpretacja. VDI 2067 nie zawiera pozycji „dolne źródło". Poprawna formuła: *„w analizie kosztów PORT PC przyjęto dla pionowego wymiennika okres 50 lat"*.
- **„Pompa ciepła jest bezemisyjna"** — przy polskim miksie to ok. 225 g CO₂/kWh ciepła.
- **„Zawsze bije kotły pod względem emisji"** — nieprawda, kocioł na pelet ma niższą emisję CO₂.
- **„Zwraca się w X lat"** — materiały nie zawierają okresu zwrotu dla domu jednorodzinnego. Forum ma na tę ramę wyostrzoną nieufność; nie sprzedawaj zwrotem inwestycji.
- **Dane rynkowe z raportu jako aktualne** — 12 500 szt./rok i 4% udziału to rok 2012.

**Co wolno,** z podaniem źródła: SPF 3,5 (grunt) vs 2,5 (powietrze) wg decyzji KE 2013/114/UE; pomiary Fraunhofer ISE 3,9 vs 2,9 w budynkach nowych; EER chłodzenia pasywnego 15–30; okres użytkowania 20 lat (grunt) vs 18 (powietrze) wg VDI 2067; **niedowymiarowane dolne źródło jako pierwszy na liście najczęstszych błędów instalacyjnych** — to najcenniejszy argument, jaki mamy.

## Dotacje — stan zweryfikowany

| Program | Dla kogo | Kwota |
|---|---|---|
| Moje Ciepło | tylko nowe domy, odbiór po 1.01.2021 | 30% kosztów, **maks. 21 000 zł** (45% z Kartą Dużej Rodziny) |
| Czyste Powietrze | tylko domy istniejące, 3 poziomy wg dochodu | kwoty **do weryfikacji w Załączniku nr 2** |
| Ulga termomodernizacyjna | **tylko budynek już wybudowany** | do 53 000 zł *odliczenia od dochodu* (realnie 12% lub 32% tej kwoty) |

**Moje Ciepło kończy nabór 31 grudnia 2026**, bez ogłoszonego następcy. Wniosek składa się **po zakończeniu inwestycji i odbiorze budynku** — dla kogoś, kto dziś buduje, prawdziwym terminem jest odbiór, nie data naboru. NFOŚiGW rozpatruje obecnie wnioski z grudnia 2025.

## Kalkulator — jak liczy

```
moc      = powierzchnia × wskaźnik(standard) + zapas CWU     [zaokrąglone do 0,5 kW]
mocŹródła = moc × (1 − 1/COP)                                [COP = 4,3]
metry    = mocŹródła / uzysk_W_mb                            [zaokrąglone w górę do 10 m]
podział  = żaden odwiert < 80 m ani > 150 m
```

Wskaźniki: 100 / 65 / 30 / 25 W/m². Uzysk: 25 / 25 / 35 / 45 W/mb. **Wszystkie te liczby są ostrożnymi wartościami z literatury i muszą zostać zastąpione tym, co DEWAX realnie przyjmuje.** Świadomie nie ma opcji 50 W/mb — strona ostrzega przed firmami, które tak liczą.

Cennik w `konfigurator.html` siedzi w jednym obiekcie `CENNIK` na początku skryptu. **Wszystkie ceny w nim są zmyślonymi wartościami zastępczymi.**

## Stan po impeccable

Przejście przez detektor: **62 problemy → 9**. Naprawione: kontrasty WCAG w obu motywach, mikroskopijne rozmiary tekstu, płaska hierarchia typograficzna, boczne kolorowe paski przy kartach, numerki 01/02/03 przy nagłówkach, jedenaście wersalikowych etykiet nad nagłówkami, Inter zamieniony na IBM Plex Sans.

Zostało 9 ostrzeżeń o interlinii 1,25 na nagłówkach — zamierzone. Oraz uwaga o nadmiarze pauz w tekście.

Przy dalszej pracy uruchamiaj:
```bash
node ~/.claude/skills/impeccable/scripts/detect.mjs index.html konfigurator.html
```
Jeśli raport zaczyna się od `DEGRADED`, doinstaluj parsery: `npm i htmlparser2 css-select css-tree domutils` w katalogu skilla.

## Werdykt czerwonego zespołu

Sceptyczny inwestor (dom 170 m² pod Jarocinem, budżet 100 tys.) przeszedł prototyp i **odmówił wysłania formularza**. Powód nie dotyczył układu ani tekstów:

> Strona formułuje moją obiekcję precyzyjniej, niż sam bym potrafił, a potem stawia w tym miejscu żółte pudełko z napisem „brak danych".

Trzy rzeczy, które zmieniają tę stronę ze sprawnie napisanej w skuteczną: **stawka za metr odwiertu**, **jedna realizacja z odczytem licznika po sezonie**, **zdanie o tym, kto płaci za dodatkowe metry**.

Pełna lista siedemnastu braków jest na końcu `tresci/strategia.md`.

## Kolejność prac

1. Usunąć iframe A-PIC, poprawić 29 450 zł, wgrać zdjęcia z `zdjecia/`, wpiąć piksel Meta przez GTM
2. Uzupełnić dane z listy braków, zacząć od stawki za metr
3. Nowa strona główna + `/odwierty-pod-pompy-ciepla/cennik/` + `/ile-odwiertow/`
4. `/dofinansowania/moje-cieplo/` — okno zamyka się 31.12.2026
5. Podstrony lokalne: Pleszew, Dobrzyca, Jarocin, Krotoszyn, Kalisz, Ostrów
