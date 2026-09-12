# Google Ads: kampania pompy.dewax.pl

Stan na 12 września 2026. Plan, struktura, teksty i instrukcja obsługi kampanii w sieci wyszukiwania.
Jedno źródło prawdy dla struktury i tekstów: `reklama/google-ads/kampania.py`. Pliki importu do
Google Ads Editor: `reklama/google-ads/import/`. Obrazy: `reklama/google-ads/obrazy/`.
Katalog `reklama/` nie wchodzi do pakietu wdrożenia na serwer (`wdrozenie.yml` go nie kopiuje).

## 0. Wgrane do konta 12 września 2026 (wszystko wstrzymane)

Kampanie utworzone przez API (Supermetrics: struktura, słowa, wykluczenia, reklamy, rozszerzenia;
Windsor.ai: pułapy CPC, lokalizacje z mnożnikiem, zasób połączenia). Stara kampania
„Pompy gruntowe - Konin 200km” (24130520616) została wstrzymana.

| Kampania | Id | Budżet/dzień | Pułap CPC | Grupy reklam (id) |
|---|---|---|---|---|
| DEWAX \| Gruntowa pompa ciepła | 24238597854 | 55 zł | 6 zł | Gruntowa ogólnie 199799185669, Cena i koszt 199799094189, Montaż i wykonawca 208567126508, Gruntowa czy powietrzna 195396439410, Pompy Thermokrafft R290 195396440770 |
| DEWAX \| Odwierty i dolne źródło | 24244183184 | 25 zł | 6 zł | Odwierty pod pompę ciepła 197330604422, Dolne źródło 201747877884, Sondy koszowe Helix 197330412942 |
| DEWAX \| Dotacje | 24244201406 | 10 zł | 4 zł | Dotacje na gruntową pompę 205765090048 |
| DEWAX \| Marka | 24238579395 | 5 zł | 3 zł | DEWAX 195396246610 |
| DEWAX \| Regiony | 24249730492 | 10 zł | 4 zł | Wielkopolska 203858994847, Łódzkie 200176185597, Kujawsko-Pomorskie 203858997767, Dolny Śląsk 203173282307, Śląsk 199799867029, Mazowsze 197893234777 |

Wspólne dla wszystkich: sieć wyszukiwania bez partnerów i bez sieci reklamowej, język polski,
lokalizacje wielkopolskie 20861, łódzkie 20850, kujawsko-pomorskie 20848, dolnośląskie 20847,
śląskie 20859, mazowieckie 20853 (mnożnik 0,85), opcja „obecność”, Maksymalizacja kliknięć,
134 wykluczenia wspólne (w Odwiertach, Dotacjach i Regionach dodatkowo „powietrzna”; w czterech
grupach kampanii Gruntowa na poziomie grupy), 8 linków do podstron, 10 objaśnień, rozszerzenie
„Katalog usług” (w API nagłówek nazywa się „Service catalog”, Google wyświetla go po polsku),
zasób połączenia 62 741 32 27, sufiks adresu z utm. Grupy reklam i reklamy są włączone,
kampanie wstrzymane, więc nic się nie wyświetla do czasu włączenia kampanii.

Do zrobienia ręcznie w panelu: obrazy (punkt 5), weryfikacja reklamodawcy, konwersje (punkt 2)
i włączenie kampanii po sprawdzeniu płatności (punkt 9). W Supermetrics ustawiono
„Going live: wymaga zatwierdzenia człowieka”, więc włączenie przez API i tak czeka na Twoje „tak”.

## 1. Co było w koncie przed zmianą

Konto Google Ads „Dewax”, numer 120-637-0043, waluta PLN, autotagowanie włączone, identyfikator
śledzenia konwersji 220609683804 (tag `AW-220609683804`). Odczyt przez Windsor.ai, 12.09.2026.

| Element | Stan |
|---|---|
| Kampanie | jedna: „Pompy gruntowe - Konin 200km” (id 24130520616), sieć wyszukiwania, Maksymalizacja kliknięć, 75,59 zł/dzień, promień 200 km wokół Konina, tylko wyszukiwarka Google (partnerzy i sieć reklamowa wyłączone), język polski |
| Wyniki | 14 do 25 sierpnia 2026: 885 zł, 472 kliknięcia, 4 365 wyświetleń, średni CPC ok. 1,88 zł, CTR 10,8 % |
| Konwersje | 0, bo w koncie nie ma żadnego działania powodującego konwersję. Kampania nie mogła się optymalizować ani niczego zmierzyć |
| Od 26 sierpnia | kampania ma status „niekwalifikująca się” (API nie podaje powodu). Nie wyświetla się. Najczęstsze przyczyny: płatność, weryfikacja reklamodawcy, odrzucona reklama. **Sprawdzić w panelu: Rozliczenia, powiadomienia na górze konta, kolumna „Stan” kampanii** |
| Reklama | jedna elastyczna reklama, 9 nagłówków, 4 opisy, „Siła reklamy: średnia”, prowadzi na stronę główną. Opis obiecuje „Pomagamy w dokumentach do dotacji Moje Ciepło” (tresci/strategia.md odradza taką obietnicę) i „bezpłatną wycenę” |
| Słowa kluczowe | 12, dopasowanie do wyrażenia, w jednej grupie. Najwięcej wydało „pompa ciepła gruntowa” (280 kliknięć, 516 zł) i ogólne „montaż pompy ciepła” (114 kliknięć, 212 zł), które ściągało ruch powietrznych pomp |

Wnioski z raportu 595 wyszukiwanych haseł (sierpień 2026):

- Ludzie mówią też „pompa ciepła głębinowa” (ponad 80 wyświetleń łącznie), „pompa ziemna”,
  „geotermalna”, „z ziemi”. Nowa kampania ma te synonimy.
- Około jedna trzecia wyświetleń to zapytania o cenę („ile kosztuje…”, „…cena z montażem”,
  „koszt… do domu 150m2”). Dostają osobną grupę i stronę `gruntowa-pompa-ciepla-cena.html`.
- Ogólne „pompa ciepła z montażem”, „pompa ciepła 10kw cena z montażem”, „monoblok”, „powietrze woda”
  to w Polsce prawie zawsze pompy powietrzne. Nowa kampania nie ma ogólnych słów, a wykluczenia
  blokują powietrzne, split, monoblok.
- Marki (nibe, vaillant, viessmann, daikin, stiebel, thermia, galmet, gejzer…) to ok. 50 wyświetleń
  osób, które szukają konkretnego producenta. Wykluczone. Buderus i Thermokrafft zostają, bo DEWAX je montuje.
- Warszawa dała 26 % wszystkich wyświetleń (1 129 z 4 365). Promień 200 km od Konina sięgał stolicy,
  a Dobrzyca ma do niej 250 km. W nowej kampanii Mazowsze dostaje niższy mnożnik stawki.
- Wyświetlenia poza 6 województwami (opolskie, pomorskie, lubuskie, świętokrzyskie, warmińsko-mazurskie,
  zachodniopomorskie): 477, czyli 11 % budżetu. Nowe targetowanie to wycina.

## 2. Cel kampanii i konwersje

Cel: zapytania o wycenę (formularz) i telefony od właścicieli domów z 6 województw, za policzalną cenę.
Zgodnie z hierarchią konwersji z `CLAUDE.md`: kalkulator → GEO → formularz → oględziny → telefon.

| Konwersja | Skąd | Rola w Google Ads |
|---|---|---|
| Wysłany formularz wyceny | zdarzenie GA4 `generate_lead` na `podziekowanie.html?ok=1` (dodane 12.09.2026, tylko po realnej wysyłce maila; `?zgoda=1` i odrzucone boty nie liczą się) | **główna** |
| Telefon z reklamy | zasób połączenia w Google Ads, konwersja „Połączenia z reklam”, min. 60 s | **główna** |
| Kliknięcie numeru na stronie | zdarzenie GA4 `phone_clicked` | pomocnicza (obserwacja) |
| Ukończony kalkulator | zdarzenie GA4 `calculator_completed` | pomocnicza (obserwacja) |
| Wejście do DEWAX GEO | zdarzenie GA4 `geo_clicked` | pomocnicza (obserwacja) |

Do maila z formularza trafia od 12.09.2026 linia „Źródło:” z parametrami kampanii
(`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `lp` = strona wejścia).
Dzięki temu każde zapytanie da się przypisać do kampanii i słowa kluczowego bez logowania do GA4.
Mechanizm opisany w `docs/ANALITYKA.md`.

### Jak podpiąć konwersje (raz, w panelach, ok. 20 minut)

1. **Połączyć GA4 z Google Ads.** W Google Ads: Narzędzia → Zarządzanie danymi → Połączone konta →
   Google Analytics (GA4) → usługa z identyfikatorem `G-XHZDND4X1W`. Albo od strony GA4:
   Administracja → Połączenia z usługami → Google Ads → konto 120-637-0043. Potrzebne uprawnienia
   edycji w obu narzędziach.
2. **Oznaczyć zdarzenia jako kluczowe w GA4.** Administracja → Zdarzenia → przełącznik „Oznacz jako
   kluczowe zdarzenie” przy `generate_lead` (obowiązkowo), `phone_clicked` i `calculator_completed`
   (opcjonalnie). Zdarzenie `generate_lead` pojawi się na liście po pierwszym wysłanym formularzu
   (można wysłać testowy i odpisać sobie „test”).
3. **Zaimportować do Google Ads.** Cele → Konwersje → Podsumowanie → Nowe działanie powodujące
   konwersję → Importuj → Usługi Google Analytics 4 → Sieć → zaznaczyć `generate_lead`
   (cel: Prześlij formularz kontaktowy, **główne**), `phone_clicked` i `calculator_completed`
   (**pomocnicze**, tylko obserwacja).
4. **Połączenia z reklam.** Cele → Konwersje → Nowe → Połączenia telefoniczne → „Połączenia z reklam
   korzystających z zasobów połączeń” → długość min. 60 s → główne.
5. Sprawdzić po tygodniu, czy w kolumnie „Konwersje” pojawiają się liczby.

Wariant bez GA4 (jeśli łączenie kont nie wyjdzie): w Google Ads utworzyć konwersję „Strona
internetowa” → „Użyj tagu Google” → skopiować etykietę (`AW-220609683804/XXXXXXXX`) i przekazać
do wdrożenia: jedna linia `gtag('event', 'conversion', {send_to: '…'})` na `podziekowanie.html?ok=1`
i `gtag('config', 'AW-220609683804')` w bloku zgody na każdej stronie. Consent Mode v2 na stronie
jest już kompletny (`ad_storage`, `ad_user_data`, `ad_personalization`), więc modelowanie konwersji
w Google Ads zadziała bez zmian w Cookiebocie.

## 3. Struktura kampanii

Pięć kampanii w sieci wyszukiwania, wszystkie na start **wstrzymane**, do włączenia po decyzji
o budżecie. Stawki: Maksymalizacja kliknięć z pułapem CPC, do czasu zebrania konwersji (punkt 7).

| Kampania | Budżet/dzień | Pułap CPC | Grupy reklam → strona docelowa |
|---|---|---|---|
| DEWAX \| Gruntowa pompa ciepła | 55 zł | 6 zł | Gruntowa ogólnie → `/`; Cena i koszt → `gruntowa-pompa-ciepla-cena.html`; Montaż i wykonawca → `/`; Gruntowa czy powietrzna → `pompa-ciepla-czy-warto.html`; Pompy Thermokrafft R290 → `pompy.html` |
| DEWAX \| Odwierty i dolne źródło | 25 zł | 6 zł | Odwierty pod pompę ciepła → `odwierty-pod-pompe-ciepla.html`; Dolne źródło → `dolne-zrodlo-pompy-ciepla.html`; Sondy koszowe Helix → `sondy-koszowe-helix.html` |
| DEWAX \| Dotacje | 10 zł | 4 zł | Dotacje na gruntową pompę → `dotacje-pompa-ciepla.html` |
| DEWAX \| Marka | 5 zł | 3 zł | DEWAX → `/` |
| DEWAX \| Regiony | 10 zł | 4 zł | sześć grup, po jednej na województwo → `gdzie-dzialamy/*.html` |
| **Razem** | **105 zł** | | 16 grup, 444 słowa kluczowe, 16 reklam elastycznych |

Dlaczego tak:

- Osobne kampanie, bo każda ma inny budżet i inną wartość zapytania: odwierty to zapytania od ludzi,
  którzy już zdecydowali się na gruntówkę, dotacje to wcześniejszy etap, marka to ochrona własnej nazwy
  za grosze.
- Grupa „Gruntowa czy powietrzna” istnieje po to, żeby porównania trafiały na stronę porównania,
  a nie na główną. Dlatego wykluczenie „powietrzna” jest ustawione na poziomie pozostałych grup,
  nie całej kampanii.
- Grupy regionalne mają mały ruch (w sierpniu „pompa ciepła Kalisz” miało 2 wyświetlenia w 12 dni),
  ale wysoką trafność: kto wpisuje miasto, szuka wykonawcy, nie wiedzy.

### Słowa kluczowe

Dopasowanie do wyrażenia dla wszystkich, plus dopasowanie ścisłe dla 2 do 7 najważniejszych fraz
w każdej grupie. Bez dopasowania przybliżonego: przy budżecie 3 tys. zł miesięcznie rozmyłoby ruch
na powietrzne pompy. Pełna lista: `reklama/google-ads/import/03-slowa-kluczowe.csv`.

### Wykluczenia

134 wykluczenia wspólne dla wszystkich kampanii, w sześciu grupach (inne typy urządzeń; informacje
i DIY; praca, serwis, części, używane; studnie i pompy do wody; miasta poza obszarem; producenci
i konkurenci) plus „powietrzna” w kampaniach, które nie mają grupy porównawczej. Lista:
`reklama/google-ads/import/04-wykluczenia.csv`. Zbudowana na raporcie haseł z sierpnia, więc
pierwszy przegląd haseł po tygodniu pewnie dołoży kilkanaście kolejnych.

### Targetowanie

- **Lokalizacja:** województwa wielkopolskie, łódzkie, kujawsko-pomorskie, dolnośląskie, śląskie,
  mazowieckie (zgodnie ze stroną i danymi `areaServed`). W panelu wybrać je z listy jako regiony;
  opcja „Obecność: osoby przebywające w lokalizacjach docelowych”, nie „zainteresowanie”.
  Przy wgrywaniu przez API bez identyfikatorów regionów plan zapasowy to 7 okręgów z
  `kampania.py` (`GEO_PROMIENIE_KM`), dobranych tak, żeby nie wchodzić w Kraków, Lublin,
  Gdańsk, Opole i Zieloną Górę. Mazowsze z mnożnikiem stawki 0,85 (daleko i drogo).
- **Język:** polski. **Sieci:** tylko wyszukiwarka Google, bez partnerów i bez sieci reklamowej
  (po utworzeniu kampanii sprawdzić te dwa pola, API potrafi zostawić domyślne).
- **Harmonogram:** bez ograniczeń na start. Po miesiącu spojrzeć na raport godzin; jeśli noc nie
  daje formularzy, obniżyć stawkę 23:00 do 6:00.
- **Urządzenia:** wszystkie. Strona jest responsywna, kalkulator działa na telefonie.
- **Sufiks adresu** (na poziomie kampanii): `utm_source=google&utm_medium=cpc&utm_campaign=<id kampanii>&utm_term={keyword}&utm_content={matchtype}-{device}`.
  `gclid` dokłada autotagowanie.

## 4. Teksty reklam

Szesnaście reklam elastycznych, każda z 15 nagłówkami i 4 opisami. Zasady:

- Kolejność OUTCOME-FIRST z `CLAUDE.md`: efekt dla klienta, potem dowód, na końcu sprzęt.
- Tylko to, co stoi na stronie: ceny z `gruntowa-pompa-ciepla-cena.html` (Thermokrafft od 23 990 zł,
  odwiert 130 do 145 zł/m netto, przykład domu 150 m² 51 do 55 tys. zł), kwoty dotacji ze strony
  dotacji, liczby SPF ze źródłami, „od 2007 roku”, „6 województw”, protokół próby ciśnieniowej.
- Bez „bezpłatnej wyceny” (wszyscy tak piszą), bez „załatwimy dotację”, bez „zwrotu w X lat”,
  bez ekologii, bez wykrzykników, bez numeru telefonu w treści (Google tego zabrania; numer idzie
  jako zasób połączenia).
- Kontrola automatyczna: `python3 reklama/google-ads/narzedzia.py kontrola` sprawdza długości
  (30/90/25/35 znaków), wykrzykniki, pauzy, wielkie litery, numery telefonu, duplikaty i to, czy
  żadne wykluczenie nie blokuje własnego słowa kluczowego.

Zmiana tekstu: edytujesz `kampania.py`, uruchamiasz `narzedzia.py eksport`, importujesz plik
`05-reklamy-rsa.csv` do Google Ads Editor (albo prosisz o wgranie przez API).

## 5. Zasoby (rozszerzenia)

Na poziomie każdej kampanii, z `kampania.py`:

- **8 linków do podstron:** kalkulator, odwierty, cena, dotacje, gruntowa czy powietrzna,
  pompy Thermokrafft, dolne źródło, wycena. Każdy z dwoma liniami opisu.
- **10 objaśnień:** własna wiertnica, odwiert i pompa na 1 umowie, od 2007 roku, kalkulator kosztu
  online, próba szczelności, 6 województw, dokumentacja powykonawcza, Thermokrafft i Buderus,
  bez podawania telefonu, serwis z Dobrzycy.
- **Rozszerzenie informacji „Katalog usług”:** odwierty pionowe, sondy koszowe Helix, kolektor poziomy,
  układy woda-woda, montaż pompy ciepła, uruchomienie i serwis, projekt dolnego źródła, formalności
  geologiczne.
- **Połączenie:** 62 741 32 27 (numer ze strony). Google będzie wyświetlać numer przekierowujący,
  żeby liczyć połączenia; to nie zmienia numeru firmy.
- **Obrazy** (do wgrania ręcznie w panelu, Zasoby → Obrazy): 17 plików w `reklama/google-ads/obrazy/`,
  wyłącznie z prawdziwych zdjęć DEWAX, w proporcjach 1,91:1, 1:1 i 4:5 oraz logo w dwóch
  formatach. Bez renderu `diag.webp`, bez zdjęć producenta. Google pokazuje obrazy tylko w części
  wyświetleń, ale podnoszą CTR i „siłę reklamy”.
- **Nazwa i logo firmy:** dostępne po weryfikacji reklamodawcy (panel prosi o dokumenty firmy).

## 6. Budżet

Propozycja: 105 zł dziennie, czyli ok. 3 200 zł miesięcznie, sezon grzewczy wrzesień do marca.
Punkt odniesienia: w sierpniu klik kosztował średnio 1,88 zł. Przy podobnej cenie pełny budżet
kupi ok. 50 kliknięć dziennie. Ile z nich zamieni się w zapytania, dowiemy się po 2 do 3 tygodniach
mierzenia; dopiero wtedy ma sens rozmowa o skalowaniu.

Jak skalować: nie zmieniać wszystkiego naraz. Po pierwszym miesiącu przenieść budżet do kampanii,
które dały zapytania (kolumna „Konwersje” i linia „Źródło:” w mailach), zwykle będzie to
„Gruntowa” i „Odwierty”. Podnosić o maks. 20 do 30 % na raz, co tydzień, żeby algorytm nie
tracił danych.

Jeśli 105 zł dziennie to za dużo, proporcje zostają: 52 % gruntowa, 24 % odwierty, 10 % dotacje,
10 % regiony, 5 % marka.

## 7. Strategia stawek i plan optymalizacji

| Kiedy | Co |
|---|---|
| Start | Maksymalizacja kliknięć z pułapem CPC (6 zł w głównych kampaniach, 3 do 4 zł w mniejszych). Stara kampania „Konin 200km” do wstrzymania w dniu włączenia nowych, żeby nie licytowała sama ze sobą |
| Co tydzień (15 minut) | Raport „Wyszukiwane hasła”: dodać wykluczenia (do listy w `kampania.py`, żeby nie zginęły), dopisać nowe frazy z konwersjami jako słowa kluczowe. Sprawdzić maile z formularza: linia „Źródło:” mówi, która kampania i słowo przyniosło zapytanie |
| Po 15 konwersjach w 30 dni (w jednej kampanii) | Przełączyć tę kampanię na Maksymalizację konwersji, bez docelowego CPA. Po kolejnych 30 dniach ustawić docelowy CPA równy średniemu kosztowi konwersji z tego okresu |
| Co miesiąc | Wstrzymać słowa z ponad 100 kliknięciami i zerem konwersji. Sprawdzić „siłę reklamy” (cel: „dobra” lub „doskonała”; poprawia się przez różnorodne nagłówki, nie przez powtarzanie słowa kluczowego). Sprawdzić udział w wyświetleniach: jeśli „utracony przez budżet” przekracza 30 % w kampanii z konwersjami, tam dołożyć budżet |
| Po 3 miesiącach | Rozważyć remarketing w sieci reklamowej (wymaga dopisania Google Ads do polityki prywatności i listy odbiorców) i kampanię Performance Max jako dodatek, nigdy zamiast wyszukiwania |

Czego nie robić: nie włączać rozszerzenia na sieć reklamową w kampaniach w wyszukiwarce, nie
używać dopasowania przybliżonego przed zebraniem 50 konwersji, nie akceptować hurtem
„rekomendacji” Google (część z nich rozszerza targetowanie i dodaje przybliżone słowa),
nie mierzyć sukcesu kliknięciami.

## 8. Jak wgrać kampanię do konta

**A. Przez API (zrobione 12.09.2026, punkt 0).** Dwie drogi, obie wymagały włączenia zapisu
przez właściciela: Supermetrics (Google Ads zalogowane w Supermetrics, „Campaign Write Access”
dla konta Dewax z opcją „Going live”, jedno wywołanie tworzy kampanię z grupami, słowami,
wykluczeniami, reklamami i rozszerzeniami) oraz Windsor.ai (Settings → API Access → „Enable write
actions”, osobne operacje: pułap CPC, lokalizacje z mnożnikiem, zasób połączenia, wstrzymanie
i włączanie). Uwagi techniczne: rozszerzenie usług przyjmuje nagłówek tylko po angielsku
(„Service catalog”), grupy reklam powstają wstrzymane i trzeba je włączyć osobnym wywołaniem,
ścieżki wyświetlanego adresu (path1/path2) API zignorowało, można je dopisać w panelu.
Zmiana tekstów: edytuj `kampania.py`, a potem poproś o aktualizację przez API albo zaimportuj
`05-reklamy-rsa.csv` w Editorze.

**B. Przez Google Ads Editor (darmowy program Google, 15 minut).**
Konto → Importuj → Z pliku, po kolei pliki `01` do `09` z `reklama/google-ads/import/`.
Przy pierwszym imporcie Editor pyta o dopasowanie kolumn; nazwy kolumn są angielskie
(Campaign, Ad Group, Keyword, Criterion Type, Headline 1…), więc zwykle dopasowuje je sam.
Lokalizacje i sieci po imporcie ustawić w Editorze albo w panelu. Potem „Opublikuj”.
Szczegóły: `reklama/google-ads/README.md`.

**C. Ręcznie w panelu.** Możliwe, ale 444 słowa i 240 nagłówków to kilka godzin klikania; B jest lepsze.

## 9. Lista dla właściciela

1. **Zrobione 12.09.2026:** zapis włączony w Supermetrics i Windsor, pięć kampanii wgranych
   i wstrzymanych, stara kampania wstrzymana (punkt 0).
2. **Konto Google Ads:** sprawdzić, dlaczego kampania „Konin 200km” była niekwalifikująca się od 26.08
   (Rozliczenia, weryfikacja reklamodawcy, powiadomienia). Bez tego nowe kampanie też nie ruszą.
3. **Konwersje:** wykonać punkt 2 (połączenie GA4, zdarzenia kluczowe, import, połączenia z reklam).
4. **Budżet:** potwierdzić 105 zł/dzień albo podać inną kwotę; proporcje w punkcie 6.
5. **Telefon:** potwierdzić, że 62 741 32 27 ma być numerem w reklamach i że ktoś odbiera
   w godzinach 8:00 do 16:00 (reklamy z zasobem połączenia wyświetlają się także poza tymi
   godzinami; można ustawić harmonogram samego zasobu).
6. **Obrazy i logo:** wgrać pliki z `reklama/google-ads/obrazy/` (punkt 5) i przejść weryfikację
   reklamodawcy, żeby pokazywać nazwę i logo firmy.
7. **Polityka prywatności:** przy najbliższej edycji dopisać, że do zgłoszenia z formularza
   dopisujemy źródło wejścia (parametry kampanii i identyfikator kliknięcia Google Ads) oraz
   że przeglądarka trzyma je w `sessionStorage` na czas wizyty (`CONTENT_NEEDED.md`, punkt 10).
8. **Włączenie:** po punktach 2 i 3 dać znak; kampanie zostaną włączone, stara wstrzymana,
   a pierwszy przegląd haseł zaplanowany po 7 dniach.

## 10. Jak czytać wyniki

- **Zapytania z formularza:** mail z linią „Źródło:”. `utm_campaign` = kampania, `utm_term` = słowo
  kluczowe, `lp` = strona wejścia. Brak linii = wejście organiczne, z polecenia albo wpisane z ręki.
- **Google Ads, co tydzień:** Konwersje, Koszt/konw., Wyszukiwane hasła, Udział w wyświetleniach,
  Siła reklamy. Kliknięcia i CTR to tylko wskaźniki pomocnicze.
- **GA4, co miesiąc:** eksploracja ścieżki z `docs/ANALITYKA.md` z segmentem „źródło = google / cpc”:
  ile sesji z reklam kończy kalkulator, ile wchodzi do GEO, ile wysyła formularz. Jeśli kalkulator
  kończy dużo osób, a formularz mało, problem jest na stronie, nie w reklamach.
