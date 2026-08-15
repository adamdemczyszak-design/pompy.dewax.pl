# DEWAX — strategia przebudowy pompy.dewax.pl
## Etap 1–4: audyt, research, konkurencja, strategia
### 15 sierpnia 2026

---

# CZĘŚĆ 0. TRZY RZECZY, KTÓRE TRZEBA NAPRAWIĆ W TYM TYGODNIU

Zanim strategia — trzy ustalenia, które nie mogą czekać na przebudowę.

## 0.1. Na stronie jest nieprawdziwa kwota dotacji

Strona twierdzi: *„Narodowy Fundusz Ochrony Środowiska i Gospodarki Wodnej oferuje aż do **29 450 zł** dofinansowania na zakup i montaż gruntowych pomp ciepła"* (podstrona Dotacje).

**Maksymalna dotacja z programu Moje Ciepło na gruntową pompę ciepła to 21 000 zł** i nie zmieniła się od początku programu. Kwota 29 450 zł nie odpowiada żadnemu progowi — ani w Moim Cieple, ani w Czystym Powietrzu, ani obecnie, ani historycznie.

Różnica to **8 450 zł**. Klient, który zaplanuje budżet na podstawie Waszej strony, a dostanie 21 000 zł, ma gotowy powód do sporu. Przy inwestycji za 90–120 tys. zł to nie jest drobiazg redakcyjny.

**Aktualne, zweryfikowane kwoty:**

| Program | Komu przysługuje | Pompa gruntowa | Dolne źródło | Razem |
|---|---|---|---|---|
| **Moje Ciepło** | tylko **nowe** domy (odbiór po 1.01.2021), EP ≤ 55 kWh/m²·rok | do **21 000 zł** | wliczone | **21 000 zł** |
| **Czyste Powietrze** — poziom podstawowy | dochód ≤ 135 000 zł/rok, budynek **istniejący** | 18 000 zł | **8 000 zł** | **26 000 zł** |
| **Czyste Powietrze** — poziom podwyższony | ≤ 2 250 zł/os./mies. | 31 500 zł | **14 000 zł** | **45 500 zł** |
| **Czyste Powietrze** — poziom najwyższy | ≤ 1 300 zł/os./mies. | 45 000 zł | **20 000 zł** | **65 000 zł** |

Do tego **ulga termomodernizacyjna: 53 000 zł na osobę, 106 000 zł na małżeństwo** — i odwierty się do niej kwalifikują, bo przepisy obejmują „pompę ciepła wraz z infrastrukturą niezbędną do jej funkcjonowania".

## 0.2. Moje Ciepło kończy się za cztery i pół miesiąca

Nabór trwa do **31 grudnia 2026**. Nie ogłoszono żadnego następcy. Od 1 stycznia 2027 nowe domy jednorodzinne zostają **bez dedykowanego programu** — Czyste Powietrze ich nie obejmuje.

To jest najsilniejszy argument sprzedażowy, jaki macie w tej chwili, i nikt w Wielkopolsce go nie używa. Wymaga jednak uczciwego dopowiedzenia: NFOŚiGW rozpatruje dziś wnioski złożone **9 grudnia 2025** — kolejka to około ośmiu miesięcy. Trzeba to powiedzieć od razu, bo inaczej dostaniecie falę telefonów „gdzie moje pieniądze".

## 0.3. Znalazłem APIC — jest w kalkulatorze

Poprzednio napisałem, że w tekstach nie ma śladu po APIC. To była prawda tylko o tekstach. Podstrona `/kalkulator` zawiera:

```html
<iframe src="https://www.old.a-pic.pl/kalkulator/" ...>
```

Wasz kalkulator to **osadzone okno cudzej firmy**. A-PIC to producent pomp ciepła, który sam sprzedaje pompy i dolne źródła — czyli Wasz konkurent. Sprawdziłem: adres działa i zwraca 39 kB treści.

Znaczy to trzy rzeczy jednocześnie:

- Wysyłacie najcenniejszy ruch — ludzi, którzy liczą własną inwestycję — na stronę konkurencji.
- Klient, który wpisze tam dane, zostawia je u nich, nie u Was.
- Kalkulator liczy pod urządzenia A-PIC, których już nie montujecie.

Do usunięcia natychmiast, jeszcze przed przebudową.

---

# CZĘŚĆ 1. MAPA PSYCHOLOGII KLIENTA

Zbudowana na realnych wypowiedziach z forum.budujemydom.pl, forumbudowlane.pl, elektroda.pl oraz relacjach inwestorów w Muratorze i Budujemy Dom. Nie na wyobrażeniach.

## 1.1. Kim jest ten człowiek

Dwa profile, wymagające różnych ścieżek:

**Profil A — buduje dom.** Nie ma jeszcze ogrzewania. Porównuje gruntową z powietrzną i z gazem. Ma czas, ale ma też deadline: Moje Ciepło kończy się w grudniu. Kwalifikuje się do 21 000 zł. Podłogówkę i tak robi, więc różnica w koszcie jest mniejsza, niż mu się wydaje.

**Profil B — modernizuje dom.** Ma stary kocioł, często węglowy. Kwalifikuje się do Czystego Powietrza, potencjalnie do 65 000 zł. Ale ma grzejniki, nie podłogówkę — i to jest realny problem techniczny, nie obiekcja do zbicia.

## 1.2. Tabela dziesięciu wymiarów

| Wymiar | Co ustalił research |
|---|---|
| **Czego chce** | Ciepła bez myślenia o nim. Ciszy. Niskiego rachunku za prąd. Świętego spokoju na 20 lat. Nie chce „ekologii" — to słowo forum wprost odrzuca jako argument sprzedażowy. |
| **Czego się boi** | Że wykonawca skróci odwierty i nigdy się o tym nie dowie. Że rozkopią mu działkę i zostawią błoto. Że po pięciu latach źródło się wychłodzi. Że zapłaci 90 tysięcy i będzie mu zimno. Że firma zniknie. |
| **Czego nie rozumie** | Że odwiert to nie „dziura, którą wycenia się za metr", tylko element o parametrach. Że im głębiej nie znaczy lepiej. Że pierwsza zima w nowym domu zawsze wypada źle, bo budynek schnie. Że gruntowa daje chłodzenie latem prawie za darmo. |
| **Czemu nie ufa** | Liczbom COP z katalogu. Obietnicy „połowa rachunku". Firmom, które „załatwią dotację" — po aferze z Czystym Powietrzem to dziś toksyczne sformułowanie. Zapewnieniom bez dokumentu. |
| **Jakie pytania zadaje** | „Ile metrów i dlaczego tyle?" „Ile prądu zużywa Wasza pompa — w kWh, nie w złotówkach?" „Ile biorą wykonawcy za metr?" „Co jeśli traficie na kamień?" „Kto to sprząta?" |
| **Co odwleka decyzję** | Papierologia. Nie wie, kto składa projekt robót geologicznych, do jakiego urzędu i ile to trwa. Cytat z forum: *„po przejrzeniu kilkunastu ofert nikt nam o tym nie wspomniał"*. |
| **Co powoduje rezygnację** | Jedna historia od znajomego, u którego „nie działa". Brak ceny na stronie. Formularz na kilkanaście pól. Poczucie, że rozmawia ze sprzedawcą, a nie z wykonawcą. |
| **Czego szuka w Google** | „odwierty pod pompę ciepła cena", „ile odwiertów pod pompę ciepła", „gruntowa czy powietrzna", „odwierty pod pompę ciepła Pleszew". |
| **Co musi zobaczyć, żeby zaufać** | Sprzęt z nazwy. Ludzi z twarzy. Realizację z adresu. Dokument, który dostaje po robocie. Kontakt do klienta sprzed pięciu lat. |
| **Co musi zrozumieć, żeby zaakceptować cenę** | Że porównuje niewłaściwe rzeczy: pompę do kotła, zamiast systemu do systemu. Że podłogówkę zrobi tak czy inaczej. Że różnica wobec powietrznej to około 20 tysięcy, nie sześćdziesiąt. Że dolne źródło pracuje 50 lat, a wymienia się tylko urządzenie w kotłowni. |

## 1.3. Piętnaście obiekcji w kolejności siły

Uszeregowane wg tego, jak często wracają i jak mocno blokują decyzję.

1. **„To kosztuje jak druga łazienka i pół dachu."** Najczęstsza. Rozbraja: rozbicie kwoty na składniki i pokazanie, że podłogówka (~30 tys.) jest wspólna dla każdego źródła ciepła.
2. **„Za te pieniądze wolę powietrzną."** Rozbraja: cisza, brak jednostki zewnętrznej, stabilność przy -20°C, chłodzenie pasywne, ~30% mniej prądu.
3. **„To się zwróci, jak umrę."** Rozbraja: **przestać sprzedawać zwrotem inwestycji.** Forum ma na tę ramę wyostrzoną nieufność. Najbardziej zadowoleni użytkownicy sami mówią, że nie liczą zwrotu — kupili spokój.
4. **„Wiertnik rozwali mi działkę i pojedzie."** *Największa nieobsłużona luka na całym rynku — żadna z 17 przeanalizowanych stron konkurencji tego nie opisuje.*
5. **„Wykonawca skróci odwierty, a ja nigdy się nie dowiem."** Rozbraja: dziennik wiertniczy, zdjęcia opuszczania sondy, protokół próby ciśnieniowej, dokumentacja powykonawczą zawsze.
6. **„Odstrasza mnie ta cała papierologia."** Rozbraja: konkretne kwoty (projekt robót geologicznych 1500–2000 zł, dokumentacja powykonawcza ~3500 zł) i jasny podział: kto co składa.
7. **„A jak źródło się wychłodzi po pięciu latach?"** Rozbraja: jawne założenie W/mb w projekcie. Część firm liczy 50 W/mb, gdy realny uzysk to 30–40.
8. **„Sprzedawca poda COP z sufitu."** Rozbraja: SCOP i realne zużycie z liczników, nie COP z karty katalogowej.
9. **„Namówią mnie na większą moc na zapas."** Rozbraja: OZC jako podstawa oferty i wytłumaczenie, że przewymiarowanie to podwójna strata — droższe odwierty i gorsza sprawność.
10. **„Bez podłogówki nie ma sensu."** *Ta obiekcja jest w dużej mierze słuszna.* Nie zbijać — potwierdzić i podać warunek brzegowy.
11. **„A serwis? Po dziesięciu latach wymiana."** Rozbraja najmocniej: **dolne źródło to 50 lat i zero serwisu. Wymienia się tylko urządzenie w kotłowni.**
12. **„Jak sonda pęknie 80 metrów pod ziemią?"** Rozbraja: klasa rury, ciśnienie próby, osobna gwarancja na szczelność źródła.
13. **„Po zmianie zasad fotowoltaiki to się już nie opłaca."** Najświeższa obiekcja. Rozbraja: im gorsza opłacalność PV, tym bardziej liczy się każda oszczędzona kWh — a gruntowa zużywa ~30% mniej niż powietrzna.
14. **„Mam za małą działkę."** *Hipoteza — nie znalazłem potwierdzenia na forach.* Do zweryfikowania na Waszych rozmowach handlowych.
15. **„Znajomy ma i chce to wyrzucić."** Najgroźniejsza, bo emocjonalna i wnoszona przez osobę trzecią. Rozbraja wyłącznie kontrhistoria o tej samej strukturze: imię, miejscowość, metraż, licznik, lata.

## 1.4. Słownik — jak oni naprawdę mówią

**Używać:** gruntówka, dolne źródło, odwierty, sonda, glikol, podłogówka, bufor, grzałka, wiertnica, CWU, ciepełko, cisza za oknem, bezobsługowe, opłaca się.

**Nie używać:** wymiennik gruntowy, sonda geotermalna, górotwór, jednostkowy uzysk ciepła, biwalencja, solanka, efektywność energetyczna, rozwiązanie ekologiczne, inwestycja w przyszłość, kompleksowa obsługa, innowacyjne rozwiązania.

---

# CZĘŚĆ 2. GDZIE JEST MIEJSCE DLA DEWAX

## 2.1. Co ustaliła analiza 17 stron konkurencji

**Wszyscy mówią to samo.** Frazy powtarzane przez ponad połowę firm: „cena uzależniona od warunków geologicznych", „bezpłatna wycena", „wieloletnie doświadczenie", „kompleksowa obsługa", „ekologiczne rozwiązanie", „75% energii z otoczenia".

Obecny nagłówek DEWAX — *„najtańszy i ekologiczny sposób ogrzewania"* — składa się z **dwóch najbardziej wyeksploatowanych fraz w branży jednocześnie**. Do tego „najtańszy" jest trudny do obrony przy cenie 90 tysięcy i przyciąga klientów cenowych, którzy i tak wybiorą powietrzną.

**Tylko 6 z 17 firm podaje jakiekolwiek ceny.** Kto nie podaje, ten przegrywa frazę „ile kosztuje", czyli najczęstsze pytanie kategorii.

**Nikt nie zamienia własnych wiertnic w argument.** Dziewięć firm deklaruje własny sprzęt, ale wszystkie wspominają o nim w zdaniu pobocznym. **Fakt jest zajęty, znaczenie jest wolne.**

## 2.2. Cztery luki, których nikt nie zajął

| Luka | Kto ją dziś obsługuje | Dlaczego DEWAX może ją zająć |
|---|---|---|
| **Co się dzieje na działce w dniu wiercenia** | Nikt z 17 firm | Możecie to sfilmować w dowolny wtorek. Firma podzlecająca nie ma nawet dostępu do placu w dniu wiercenia. |
| **Kto odpowiada, gdy źródło nie wyrabia** | Nikt tego nawet nie nazywa | Macie jedną odpowiedzialność, bo wiercicie sami. Konkurencja podzlecająca **nie może tego skopiować** — nie ma wiertnicy. |
| **Geologia konkretnej gminy** | Jedna firma, na poziomie województw | Macie archiwum odwiertów w promieniu 50 km, którego pośrednik nigdy nie zbuduje. |
| **Co się dzieje, gdy wiertnica trafi na problem** | Nikt | Możecie wziąć ryzyko dodatkowych metrów na siebie. Firma podzlecająca nie może — nie zna kosztu. |

## 2.3. Pozycjonowanie

> ## Wiercimy sami. Dlatego odpowiadamy za całość.

Jedno zdanie, z którego wynika wszystko inne:

- **Cena, którą możemy zagwarantować** — bo znamy koszt własnej maszyny, więc trudniejszy grunt jest naszym ryzykiem, nie Twoim.
- **Jedna gwarancja na odwiert i pompę razem** — bo nie ma kogo obwiniać.
- **Wiemy, co jest pod Twoją gminą** — bo już tam wierciliśmy.
- **Pokażemy Ci dzień wiercenia** — bo to nasza ekipa, nie wynajęta.

To jest pozycjonowanie, którego konkurencja podzlecająca nie przejmie, choćby chciała.

## 2.4. Czego NIE robić

- Nie walczyć o frazę „gruntowa pompa ciepła" — trzymają ją Bosch, Daikin, Buderus, Wolf. Przegrana z definicji.
- Nie zaczynać od Poznania — najdroższy i najdalszy rynek. Pleszew, Jarocin, Krotoszyn i Dobrzyca są **praktycznie nieobsadzone**; jedyny konkurent stoi tam na starej stronie bez HTTPS.
- Nie generować 40 podstron miejskich z szablonu. Google traktuje to jako doorway pages. **Osiem dobrych bije czterdzieści cienkich.**
- Nie sprzedawać ekologią. Forum odrzuca ten argument wprost.

---

# CZĘŚĆ 3. ŚCIEŻKA DECYZJI I ARCHITEKTURA

## 3.1. Strona główna — czternaście pytań, na które odpowiada po kolei

| # | Pytanie użytkownika | Sekcja | Czym rozbraja |
|---|---|---|---|
| 1 | Gdzie trafiłem? | Hero | Konkret: co, dla kogo, gdzie, jaki następny krok |
| 2 | Robią dokładnie to, czego szukam? | Pasek pod hero | Odwierty + montaż + serwis, południowa Wielkopolska |
| 3 | Czemu w ogóle gruntowa? | Trzy powody | Cisza, stabilność przy -20°C, chłodzenie latem — nie „ekologia" |
| 4 | Czy to pasuje do mojego domu? | Kwalifikacja | **Uczciwie: kiedy odradzamy** |
| 5 | Czemu drożej niż powietrzna? | Rozbicie kosztów | Podłogówkę i tak robisz; różnica to ~20 tys., nie 60 |
| 6 | Co właściwie kupuję? | Zakres | Odwiert + dolne źródło + pompa + uruchomienie + dokumenty |
| 7 | Czemu dolne źródło jest tak ważne? | Anatomia odwiertu | To 50 lat pracy, którego nie da się poprawić po zasypaniu |
| 8 | Czy oni to potrafią? | Sprzęt i ludzie | Maszyny z nazwy, ekipa z twarzy, NIP do sprawdzenia |
| 9 | Jak to wygląda u mnie na działce? | **Dzień wiercenia** | *Luka rynkowa — nikt tego nie pokazuje* |
| 10 | Ile to kosztuje? | Widełki | Konkretne liczby, nie „zapytaj o wycenę" |
| 11 | Co może pójść źle? | Ryzyka | Nazwane wprost, po imieniu |
| 12 | Jak oni te ryzyka ograniczają? | Nasze zobowiązania | Dokumenty, protokoły, gwarancja na szczelność |
| 13 | Są dowody? | Realizacje | Adres, metraż, metry, licznik po sezonie |
| 14 | Co mam zrobić teraz? | CTA | Jeden konkretny krok |

## 3.2. Hero

**Nagłówek:**
> ### Gruntowe pompy ciepła z odwiertem, który robimy własną wiertnicą

**Podtytuł:**
> Projektujemy dolne źródło, wiercimy, montujemy pompę Thermokrafft i serwisujemy ją potem sami. Jedna firma od pierwszego metra do pierwszego ciepła — południowa Wielkopolska, siedziba w Dobrzycy.

**CTA główne:**
> **Sprawdź, ile metrów potrzebuje Twoja działka**
> Podaj adres — odpowiemy w 24 h, ile odwiertów, jak głębokich i ile to kosztuje.

**CTA drugorzędne:** `Zobacz, jak wygląda dzień wiercenia →`

Dlaczego to działa: nagłówek zawiera trzy rzeczy, których nie ma dziś na stronie — odwiert, własną wiertnicę i region. CTA nie brzmi „skontaktuj się", tylko obiecuje konkretną odpowiedź na pytanie, które klient naprawdę ma.

## 3.3. Architektura serwisu

```
/                                   USP: własne wiertnice
│
├── /odwierty-pod-pompy-ciepla/     ★ FILAR 1 — rdzeń przewagi
│   ├── /cennik/                    ★ stawki zł/mb — decyzja o największym wpływie
│   ├── /ile-odwiertow/             ★ kalkulator: metraż → moc → metry
│   ├── /dzien-wiercenia/           ★ luka rynkowa
│   ├── /formalnosci/               kto składa, gdzie, ile trwa, ile kosztuje
│   └── /[miasto]/                  Pleszew, Dobrzyca, Jarocin, Krotoszyn, Kalisz, Ostrów
│
├── /dolne-zrodlo/                  ★ FILAR 2 — hub techniczny
│   ├── /sondy-pionowe/
│   ├── /kolektor-poziomy/
│   └── /sondy-czy-kolektor/
│
├── /gruntowe-pompy-ciepla/         ★ FILAR 3 — produkt
│   ├── /cena/                      pełny koszt: pompa + odwierty + montaż − dotacja
│   ├── /thermokrafft/              dlaczego jedna marka
│   └── /montaz/
│
├── /dofinansowania/                ★ FILAR 4 — pilność
│   ├── /moje-cieplo/               🔴 deadline 31.12.2026
│   ├── /czyste-powietrze/          osobne 8–20 tys. na dolne źródło
│   ├── /ulga-termomodernizacyjna/  53 tys. na osobę, odwierty się kwalifikują
│   └── /lista-zum/                 ★ differentiator zaufania
│
├── /sprzet-i-ludzie/               ★ dowód zamiast deklaracji
├── /realizacje/
├── /poradnik/
├── /wycena/                        główny cel konwersji
└── /kontakt/
```

**Kanibalizacja do rozdzielenia:** `/gruntowe-pompy-ciepla/cena/` to koszt **całej instalacji**. `/odwierty-pod-pompy-ciepla/cennik/` to wyłącznie **usługa wiertnicza w zł/mb**. Linkować wzajemnie.

## 3.4. Kolejność wdrożenia

| Etap | Co | Dlaczego teraz |
|---|---|---|
| **Tydzień 1** | Usunąć iframe A-PIC. Poprawić 29 450 zł. Wgrać nowe zdjęcia. Wstawić piksel Meta. | Każdy dzień zwłoki to stracone dane i ryzyko sporu |
| **Tydzień 2–3** | Nowa strona główna + `/odwierty.../cennik/` + `/ile-odwiertow/` | Frazy transakcyjne, niska konkurencja |
| **Tydzień 4** | `/dofinansowania/moje-cieplo/` | Okno zamyka się 31.12.2026 |
| **Miesiąc 2** | 6 podstron lokalnych Tier 1 + `/dzien-wiercenia/` | Nieobsadzone frazy, luka rynkowa |
| **Miesiąc 3** | Dolne źródło, porównania, realizacje, lista ZUM | Budowa autorytetu tematycznego |

---

# CZĘŚĆ 4. FUNDAMENT MERYTORYCZNY — CO WOLNO TWIERDZIĆ

Z materiałów PORT PC, z podaniem źródła. **Nie wolno kopiować tabel PORT PC na stronę** — wytyczne są chronione prawem autorskim, dozwolone jest powoływanie się z cytowaniem.

## 4.1. Argumenty, które można obronić

| Twierdzenie | Liczba | Źródło do podania |
|---|---|---|
| Gruntowa jest sprawniejsza od powietrznej — nie w reklamie, w akcie prawnym UE | SPF 3,5 vs 2,5 dla klimatu chłodnego | decyzja KE 2013/114/UE, za PORT PC 2013, s. 44 |
| Pomiary w realnych instalacjach, nie katalogi | gruntowe SPF 3,9 (56 instalacji), powietrzne 2,9 (18 instalacji) | Fraunhofer ISE, za PORT PC 2013, s. 71, 73 |
| Jakość wykonania decyduje | rozrzut SPF 3,0–5,2 przy średniej 3,9 | PORT PC 2013, s. 73 |
| Chłodzenie latem prawie za darmo — przewaga wyłączna gruntu | EER 15–30 vs ~3,5 dla klimatyzatora split | PORT PC 2013, s. 23–24 |
| Dłuższy okres użytkowania niż powietrznej | 20 lat vs 18 lat | VDI 2067-1, wyd. PORT PC 2015, s. 12 |
| Serwis poprawnie zamontowanej pompy jest tani | 0,3–0,5% wartości inwestycji rocznie | PORT PC 2013, s. 66 |
| Niższa temperatura zasilania to policzalne pieniądze | 35°C vs 55°C = różnica ok. 18% | VDI 4650-1, wyd. PORT PC 2014, s. 6 |
| Najczęstszy błąd instalacyjny w badaniach | **niedowymiarowane dolne źródło — pierwsze na liście** | Fraunhofer ISE, za PORT PC 2013, s. 72 |

Ostatni wiersz jest najcenniejszy. To niezależne, cytowalne potwierdzenie tezy, na której opieracie całą sprzedaż: **dolne źródło jest tym, co się psuje najczęściej, i dlatego nie warto go kupować najtaniej.**

## 4.2. Czego twierdzić nie wolno

- **„Sonda ma 50 lat żywotności wg normy VDI"** — to nadinterpretacja. Tabela VDI 2067 nie zawiera pozycji „dolne źródło". Liczba 50 lat pojawia się wyłącznie jako założenie autora analizy kosztowej. Uczciwa formuła: *„w analizie kosztów PORT PC przyjęto dla pionowego wymiennika okres 50 lat"*.
- **Żadnych W/mb powołując się na PORT PC** — tych danych w otrzymanych materiałach nie ma. Odpowiednika VDI 4640 nie było w komplecie.
- **„Pompa ciepła jest bezemisyjna"** — przy polskim miksie to 225 g CO₂/kWh ciepła.
- **„Zawsze bije kotły pod względem emisji"** — nieprawda, kocioł na pelet ma niższą emisję CO₂ (751 kg/rok vs 3 234 kg/rok).
- **„Zwraca się w X lat"** — materiały nie zawierają okresu zwrotu dla domu jednorodzinnego.
- **Dane rynkowe z raportu jako aktualne** — 12 500 szt./rok i 4% udziału to rok **2012**.

---

# CZĘŚĆ 5. CZEGO MI BRAKUJE, ŻEBY NAPISAĆ TĘ STRONĘ

Poniższych rzeczy **nie wymyślę**. Bez nich strona zostanie z pustymi miejscami albo z ogólnikami, czyli dokładnie tym, czego mamy uniknąć. Uszeregowane wg tego, jak bardzo blokują.

## 5.1. Blokujące — bez tego nie ma przewagi

**[BRAK DANYCH — 1] Ile kosztuje metr odwiertu u Was.**
Gdzie: `/odwierty-pod-pompy-ciepla/cennik/` oraz sekcja cenowa na stronie głównej.
Rynek: 75 zł/mb netto (sam odwiert, Wielkopolska) do 140 zł/mb z VAT (z pełną obsługą). Potrzebuję: stawka za metr z sondą i bez, czy netto czy brutto, jaki VAT stosujecie i od czego to zależy.
*To jest pojedyncza decyzja o największym wpływie na ruch transakcyjny w całym projekcie.*

**[BRAK DANYCH — 2] Trzy do pięciu gotowych pakietów: metraż domu → moc pompy → metry odwiertu → cena.**
Gdzie: strona główna, `/gruntowe-pompy-ciepla/cena/`.
Wzór, który działa u konkurencji: „dom 150 m² → pompa 9 kW → 200 mb → 82 000 zł".

**[BRAK DANYCH — 3] Jakie macie wiertnice.**
Gdzie: `/sprzet-i-ludzie/`, sekcja dowodowa na stronie głównej.
Potrzebuję: producent, model, rok, maksymalna głębokość, masa, szerokość wjazdu. Plus ile ich macie.
*Najlepszy w branży robi dokładnie to i wygląda przez to najpoważniej ze wszystkich.*

**[BRAK DANYCH — 4] Ile odwiertów wykonaliście i od kiedy działacie.**
Gdzie: hero, `/o-nas/`, każda podstrona lokalna.
Bez liczby „doświadczona ekipa" jest szumem. KRS pokazuje 2008 rok — mogę napisać „od 2008", jeśli potwierdzicie, że tyle działacie w pompach ciepła, a nie w czymś innym.

**[BRAK DANYCH — 5] Ile metrów przyjmujecie na kilowat i jakie W/mb zakładacie w projekcie.**
Gdzie: `/odwierty-pod-pompy-ciepla/ile-odwiertow/`, kalkulator.
To rozbraja obiekcję o wychłodzonym źródle. Część firm liczy 50 W/mb, gdy realny uzysk to 30–40 — jeśli liczycie uczciwie, to jest argument.

## 5.2. Ważne — bez tego strona będzie słabsza, ale powstanie

**[BRAK DANYCH — 6] Jaką dokumentację dostaje klient po robocie.**
Dziennik wiertniczy? Profil geologiczny? Protokół próby ciśnieniowej? Dokumentacja powykonawcza? To rozbraja obiekcję nr 5 — „skrócą mi odwierty".

**[BRAK DANYCH — 7] Gwarancje — dokładnie na co i na ile lat.**
Osobno: na urządzenie, na szczelność sondy, na wykonanie odwiertu. Konkurencja daje 5 lat na szczelność i 50 na sondę; jedna firma 10 lat na odwiert.

**[BRAK DANYCH — 8] Czym wypełniacie odwiert.**
Bentonit, termocement, żwir, gotowa mieszanka? Jaka przewodność? Klienci na forach pytają wprost, a wykonawcy nie umieją odpowiedzieć — to gotowa przewaga.

**[BRAK DANYCH — 9] Jakie sondy stosujecie.**
Producent, materiał (PE100RC?), średnica, ciśnienie próby, czy zgrzewane fabrycznie.

**[BRAK DANYCH — 10] Kto bierze ryzyko dodatkowych metrów.**
Jeśli traficie na kamień albo trzeba wiercić głębiej — kto płaci? *Jeśli Wy, to jest to najmocniejsze zdanie, jakie może się znaleźć na tej stronie.* Nikt w Polsce tego nie deklaruje.

**[BRAK DANYCH — 11] Trzy do pięciu realizacji z danymi.**
Miejscowość, metraż domu, liczba i głębokość odwiertów, moc pompy, rok, **zużycie prądu po pełnym sezonie w kWh**. To ostatnie jest najcenniejsze — nikt w branży tego nie pokazuje.

**[BRAK DANYCH — 12] Zgoda klientów na kontakt referencyjny.**
Forumowicze radzą sobie nawzajem: „poproś o kontakt do trzech klientów z instalacjami starszymi niż pięć lat". Jeśli możecie to zaoferować, wygrywacie rozmowę.

**[BRAK DANYCH — 13] Ile trwa robota na działce i co po niej zostaje.**
Ile dni, ile metrów kwadratowych zajmuje wiertnica, co z urobkiem, kto sprząta, w jakim stanie zostawiacie teren. Do sekcji `/dzien-wiercenia/` — luka, której nie zajął nikt.

**[BRAK DANYCH — 14] Który model Thermokrafft montujecie i czy jest na liście ZUM.**
Bez wpisu na listę ZUM klient nie dostanie dotacji z Czystego Powietrza — niezależnie od jakości urządzenia. Potrzebuję nazw modeli i identyfikatorów ZUM.

**[BRAK DANYCH — 15] Gdzie Thermokrafft jest produkowany.**
Pytanie z poprzedniej rundy, wciąż otwarte. Bez tego nie wracam do akapitu o polskiej produkcji.

**[BRAK DANYCH — 16] Zasięg terytorialny.**
Do ilu kilometrów od Dobrzycy jeździcie? Od tego zależy, ile podstron lokalnych ma sens.

**[BRAK DANYCH — 17] Zdjęcia ekipy.**
Twarze, imiona, staż, uprawnienia wiertnicze. **Nikt w branży tego nie pokazuje** — a to najtańszy sposób na wyróżnienie się.

## 5.3. Do zweryfikowania po Waszej stronie

- **Łączne pułapy Czystego Powietrza** — źródła podają rozbieżnie (66/99/136 tys. vs 68/119/170 tys.). Kwoty jednostkowe na pompę i dolne źródło są potwierdzone zgodnie, ale sumaryczne trzeba sprawdzić w Załączniku nr 2 do programu przed publikacją.
- **Obiekcja „za mała działka"** — nie znalazłem jej potwierdzenia na forach. Czy pojawia się w Waszych rozmowach handlowych?
- **Czy kalkulator ma powstać na nowo**, czy pozycję usuwamy z menu do czasu jego zbudowania. Pusta strona w menu szkodzi już teraz.
