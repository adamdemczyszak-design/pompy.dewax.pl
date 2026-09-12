# -*- coding: utf-8 -*-
"""Kampania Google Ads pompy.dewax.pl: jedno źródło prawdy.

Z tego pliku powstają: pliki importu do Google Ads Editor (narzedzia.py eksport),
kontrola długości i zasad Google Ads (narzedzia.py kontrola) oraz wgranie do konta
przez API (opis w docs/GOOGLE-ADS.md). Zmieniasz kampanię: zmieniasz TEN plik.

Zasady tekstów: nagłówek do 30 znaków, opis do 90, bez wykrzykników w nagłówkach,
bez numeru telefonu w treści (Google tego zabrania, telefon idzie jako zasób połączenia),
bez pauz „—”, tylko twierdzenia, które stoją na stronie (CLAUDE.md: nic nie wymyślamy).
"""

DOMENA = 'https://pompy.dewax.pl/'
TELEFON = '62 741 32 27'          # zasób połączenia, kraj PL
JEZYK = 'pl'

# Województwa obsługiwane przez DEWAX (zgodnie ze stroną i danymi strukturalnymi).
# Identyfikatory geo (geo target constant) uzupełnia narzedzia.py z pliku geotargets.csv Google,
# jeśli jest w katalogu; bez pliku zostają nazwy do wpisania ręcznie w Google Ads Editor.
WOJEWODZTWA = ['wielkopolskie', 'łódzkie', 'kujawsko-pomorskie', 'dolnośląskie', 'śląskie', 'mazowieckie']
# Zapasowe targetowanie promieniowe (gdy wgrywamy przez API bez identyfikatorów regionów):
# okręgi dobrane tak, żeby objąć 6 województw i nie wchodzić w Kraków, Lublin, Gdańsk, Zieloną Górę, Opole.
GEO_PROMIENIE_KM = [
    ('Wielkopolska', 52.30, 17.30, 120),
    ('Łódzkie', 51.65, 19.45, 90),
    ('Kujawsko-Pomorskie', 53.10, 18.50, 90),
    ('Dolny Śląsk', 51.10, 16.50, 100),
    ('Śląsk: Katowice i okolice', 50.26, 19.02, 60),
    ('Śląsk: Częstochowa i okolice', 50.81, 19.12, 40),
    ('Mazowsze', 52.30, 21.00, 130),
]
GEO_NAZWY_EN = {
    'wielkopolskie': 'Greater Poland Voivodeship',
    'łódzkie': 'Lodz Voivodeship',
    'kujawsko-pomorskie': 'Kuyavian-Pomeranian Voivodeship',
    'dolnośląskie': 'Lower Silesian Voivodeship',
    'śląskie': 'Silesian Voivodeship',
    'mazowieckie': 'Masovian Voivodeship',
}

# Wspólne nagłówki (używane w wielu grupach), żeby każda reklama miała komplet 15.
H_WSPOLNE = {
    'policz': 'Policz koszt w 2 minuty',
    'geo': 'Sprawdź geologię działki',
    'umowa': 'Odwiert i pompa na 1 umowie',
    'wiertnica': 'Wiercimy własną wiertnicą',
    'dewax': 'DEWAX Dobrzyca, od 2007 roku',
    'woj': 'Działamy w 6 województwach',
    'telefon': 'Bez podawania telefonu',
    'protokol': 'Protokół próby ciśnieniowej',
    'odpowiedz': 'Odpowiedź w 1 dzień roboczy',
}
H = H_WSPOLNE

# Sufiks adresu docelowego (dopisywany do każdego adresu w kampanii). gclid dochodzi z autotagowania.
# {keyword}, {matchtype}, {device} podstawia Google Ads. utm_campaign wpisujemy czytelnie per kampania.
SUFIKS = 'utm_source=google&utm_medium=cpc&utm_campaign={kampania}&utm_term={keyword}&utm_content={matchtype}-{device}'

KAMPANIE = [
    {
        'id': 'gruntowa',
        'nazwa': 'DEWAX | Gruntowa pompa ciepła',
        'budzet_dzienny': 55,
        'pulap_cpc': 6.0,
        'grupy': [
            {
                'id': 'gruntowa-ogolnie',
                'nazwa': 'Gruntowa ogólnie',
                'url': DOMENA,
                'sciezki': ('gruntowa', 'pompa-ciepla'),
                'exact': ['gruntowa pompa ciepła', 'pompa ciepła gruntowa', 'gruntowe pompy ciepła', 'pompy ciepła gruntowe',
                          'pompa gruntowa', 'pompa ciepła głębinowa', 'głębinowa pompa ciepła'],
                'phrase': ['gruntowa pompa ciepła', 'pompa ciepła gruntowa', 'gruntowe pompy ciepła', 'pompa gruntowa', 'pompy gruntowe',
                           'pompa ciepła głębinowa', 'głębinowa pompa ciepła', 'pompa ciepła ziemna', 'ziemna pompa ciepła',
                           'pompa ciepła geotermalna', 'geotermalna pompa ciepła', 'pompa ciepła z ziemi', 'ogrzewanie z ziemi',
                           'pompa ciepła solanka woda', 'pompa ciepła glikol woda', 'pompa ciepła z odwiertem', 'pompa ciepła z odwiertami',
                           'ogrzewanie gruntowe domu', 'pompa ciepła z gruntu', 'ogrzewanie głębinowe'],
                'naglowki': ['Gruntowa pompa ciepła', H['policz'], H['umowa'], H['wiertnica'], 'Ciepły dom bez gazu i węgla',
                             'Bez jednostki zewnętrznej', 'Chłodzenie latem z gruntu', H['dewax'], H['geo'], H['telefon'],
                             H['woj'], H['protokol'], 'Jedna firma za cały system', 'Ile kosztuje u Ciebie?', 'Pompa ciepła z odwiertem'],
                'opisy': ['Policz koszt pompy z odwiertem i sprawdź, co jest pod Twoją działką. Bez telefonu.',
                          'Projekt, odwiert własną wiertnicą, montaż i serwis na 1 umowie. Nie ma komu zwalać winy.',
                          'Ciepło i ciepła woda z gruntu pod działką. Źródło 8 do 10°C, sprawność także w mróz.',
                          'Protokół próby ciśnieniowej i dokumentacja z rzeczywistą głębokością otworów. Od 2007.'],
                'wykluczenia_grupy': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
            },
            {
                'id': 'cena',
                'nazwa': 'Cena i koszt',
                'url': DOMENA + 'gruntowa-pompa-ciepla-cena.html',
                'sciezki': ('gruntowa', 'cena'),
                'exact': ['gruntowa pompa ciepła cena', 'pompa ciepła gruntowa cena', 'ile kosztuje gruntowa pompa ciepła',
                          'koszt gruntowej pompy ciepła', 'pompa gruntowa cena', 'gruntowa pompa ciepła cena z montażem'],
                'phrase': ['gruntowa pompa ciepła cena', 'pompa ciepła gruntowa cena', 'gruntowa pompa ciepła koszt', 'koszt gruntowej pompy ciepła',
                           'ile kosztuje gruntowa pompa ciepła', 'ile kosztuje pompa ciepła gruntowa', 'pompa gruntowa cena', 'pompa gruntowa koszt',
                           'koszt pompy gruntowej', 'gruntowa pompa ciepła cena z montażem', 'pompa ciepła gruntowa cena z montażem',
                           'cena gruntowej pompy ciepła', 'gruntowe pompy ciepła cena', 'pompa ciepła głębinowa cena', 'ile kosztuje pompa ciepła głębinowa',
                           'ile kosztuje pompa gruntowa', 'pompa ciepła gruntowa koszt instalacji', 'gruntowa pompa ciepła koszty eksploatacji',
                           'ile prądu zużywa gruntowa pompa ciepła', 'koszt montażu gruntowej pompy ciepła', 'pompa ciepła z odwiertami cena',
                           'pompa ciepła z odwiertem cena', 'ile kosztuje pompa ciepła z odwiertem'],
                'naglowki': ['Gruntowa pompa ciepła: cena', 'Thermokrafft od 23 990 zł', 'Odwiert 130 do 145 zł/m netto', 'Dom 150 m²: 51 do 55 tys. zł',
                             H['policz'], 'Cena z odwiertem i montażem', 'Trudny grunt: zapis w umowie', 'Oferta pozycja po pozycji',
                             'Ile prądu zużyje pompa', 'Wycena po oględzinach działki', 'VAT 8% z montażem w domu', H['odpowiedz'],
                             'Rozbicie ceny na 3 składniki', H['telefon'], H['dewax']],
                'opisy': ['Cena pompy z odwiertem i montażem. Przykład: dom 150 m² i roczny rachunek za prąd.',
                          'Pompa od 23 990 zł, odwiert 130 do 145 zł/m netto, montaż. Każda pozycja osobno.',
                          'Policz koszt dla swojego domu w 2 minuty, bez telefonu. Dokładna oferta po oględzinach.',
                          'Cena przy trudnym gruncie zapisana w umowie przed startem. Wiercimy własną wiertnicą.'],
                'wykluczenia_grupy': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
            },
            {
                'id': 'montaz',
                'nazwa': 'Montaż i wykonawca',
                'url': DOMENA,
                'sciezki': ('gruntowa', 'montaz'),
                'exact': ['montaż gruntowej pompy ciepła', 'gruntowa pompa ciepła z montażem', 'montaż pompy ciepła gruntowej'],
                'phrase': ['montaż gruntowej pompy ciepła', 'montaż pompy ciepła gruntowej', 'gruntowa pompa ciepła z montażem',
                           'pompa ciepła gruntowa z montażem', 'pompa gruntowa z montażem', 'wykonawca gruntowej pompy ciepła',
                           'firma gruntowe pompy ciepła', 'instalacja gruntowej pompy ciepła', 'gruntowe pompy ciepła montaż',
                           'montaż pomp ciepła gruntowych', 'kto montuje gruntowe pompy ciepła', 'gruntowa pompa ciepła wykonawca',
                           'wymiana pieca na gruntową pompę ciepła', 'gruntowa pompa ciepła do starego domu', 'gruntowa pompa ciepła nowy dom'],
                'naglowki': ['Montaż gruntowej pompy ciepła', 'Odwiert i montaż: 1 wykonawca', H['wiertnica'], 'Termin z naszego grafiku',
                             'Jedna umowa na cały system', 'Serwis: ta sama ekipa', 'Dokumentacja powykonawcza', H['protokol'],
                             'Od projektu po pierwsze ciepło', H['dewax'], H['policz'], H['woj'], 'Ciepły dom bez gazu i węgla',
                             'Dokumenty przygotowujemy my', 'Pompy Thermokrafft i Buderus'],
                'opisy': ['Odwiert własną wiertnicą, montaż pompy i serwis na jednej umowie. Nie ma komu zwalać winy.',
                          'Termin z naszego grafiku, nie z cudzej kolejki. Protokół próby, dokumentacja powykonawcza.',
                          'Projekt robót geologicznych i zgłoszenie do starostwa przygotowujemy my. Ty podpisujesz.',
                          'Policz koszt w 2 minuty. Potem oględziny: wjazd wiertnicy, miejsce na odwierty, trasa rur.'],
                'wykluczenia_grupy': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
            },
            {
                'id': 'porownanie',
                'nazwa': 'Gruntowa czy powietrzna',
                'url': DOMENA + 'pompa-ciepla-czy-warto.html',
                'sciezki': ('gruntowa', 'czy-warto'),
                'exact': ['pompa ciepła gruntowa czy powietrzna', 'gruntowa czy powietrzna pompa ciepła', 'pompa gruntowa czy powietrzna',
                          'gruntowa pompa ciepła czy warto'],
                'phrase': ['pompa ciepła gruntowa czy powietrzna', 'gruntowa czy powietrzna pompa ciepła', 'pompa gruntowa czy powietrzna',
                           'powietrzna czy gruntowa', 'gruntowa pompa ciepła a powietrzna', 'pompa ciepła gruntowa vs powietrzna',
                           'czy warto gruntowa pompa ciepła', 'gruntowa pompa ciepła czy warto', 'gruntowa pompa ciepła opinie',
                           'gruntowa pompa ciepła wady i zalety', 'czy pompa ciepła gruntowa się opłaca', 'głębinowa czy powietrzna pompa ciepła',
                           'różnica między pompą ciepła powietrzną a gruntową', 'która pompa ciepła lepsza gruntowa czy powietrzna',
                           'gruntowa pompa ciepła zużycie prądu', 'sprawność gruntowej pompy ciepła'],
                'naglowki': ['Gruntowa czy powietrzna?', 'Liczby z podaniem źródeł', 'SPF 3,5 wobec 2,5 (decyzja KE)', '26 do 29% mniej prądu',
                             'Kiedy gruntową odradzamy', 'Cicha, bez jednostki na domu', 'Sprawność także w mróz', 'Chłodzenie latem z gruntu',
                             '20 lat wobec 18 wg VDI 2067', H['policz'], 'Sprawdź, czy pasuje do domu', 'Grzejniki czy podłogówka?',
                             H['dewax'], 'Uczciwie: kiedy nie warto', 'Porównanie na jednych danych'],
                'opisy': ['SPF 3,5 wobec 2,5 (decyzja KE). Mróz, hałas, chłodzenie latem, trwałość wg VDI 2067.',
                          'Kiedy odradzamy: stare grzejniki na 55°C, dom nieocieplony, sprzedaż domu za 2, 3 lata.',
                          'Ten sam dom: ok. 3 430 kWh prądu przy SPF 3,5, ok. 4 800 kWh przy SPF 2,5. Źródła podane.',
                          'Policz koszt gruntowej pompy z odwiertem dla swojego domu w 2 minuty, bez telefonu.'],
                'wykluczenia_grupy': [],
            },
            {
                'id': 'thermokrafft',
                'nazwa': 'Pompy Thermokrafft R290',
                'url': DOMENA + 'pompy.html',
                'sciezki': ('pompy', 'thermokrafft'),
                'exact': ['thermokrafft', 'thermokrafft pompa ciepła', 'gruntowa pompa ciepła r290'],
                'phrase': ['thermokrafft', 'thermokrafft pompa ciepła', 'pompa ciepła thermokrafft', 'gruntowa pompa ciepła r290',
                           'pompa ciepła r290 gruntowa', 'polska gruntowa pompa ciepła', 'gruntowa pompa ciepła buderus',
                           'pompa ciepła gruntowa buderus', 'buderus logatherm wps', 'gruntowa pompa ciepła inverter',
                           'gruntowa pompa ciepła z chłodzeniem', 'gruntowa pompa ciepła 10 kw', 'gruntowa pompa ciepła 8 kw',
                           'gruntowa pompa ciepła 12 kw', 'gruntowa pompa ciepła 6 kw'],
                'naglowki': ['Pompy Thermokrafft R290', 'Gruntowe pompy 2 do 23 kW', 'Modele, moce, COP, ceny', 'Thermokrafft od 23 990 zł',
                             'Także pompy Buderus', 'Czynnik R290, DC Inverter', 'COP wg PN-EN 14511', 'Montaż z odwiertem, 1 umowa',
                             'Części i wsparcie w kraju', 'Cztery modele TK', H['policz'], H['dewax'], H['wiertnica'],
                             'Ciepła woda i chłodzenie', 'Ceny brutto na stronie'],
                'opisy': ['Cztery modele Thermokrafft TK na R290, 2 do 23 kW: moce, COP, EER i ceny brutto.',
                          'Pompę dobieramy z zapotrzebowania domu, dolne źródło z geologii działki. Jedna umowa.',
                          'Części i wsparcie do Thermokrafft w kraju. Serwis: ta sama firma, która montowała.',
                          'Policz koszt systemu z odwiertem w 2 minuty, bez telefonu. DEWAX, Dobrzyca, od 2007 roku.'],
                'wykluczenia_grupy': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
            },
        ],
    },
    {
        'id': 'odwierty',
        'nazwa': 'DEWAX | Odwierty i dolne źródło',
        'budzet_dzienny': 25,
        'pulap_cpc': 6.0,
        'wykluczenia_kampanii_dodatkowe': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
        'grupy': [
            {
                'id': 'odwierty',
                'nazwa': 'Odwierty pod pompę ciepła',
                'url': DOMENA + 'odwierty-pod-pompe-ciepla.html',
                'sciezki': ('odwierty', 'pompa-ciepla'),
                'exact': ['odwierty pod pompę ciepła', 'odwiert pod pompę ciepła', 'odwierty pod pompy ciepła', 'odwierty pod pompę ciepła cena',
                          'ile kosztuje odwiert pod pompę ciepła', 'wiercenie pod pompę ciepła'],
                'phrase': ['odwierty pod pompę ciepła', 'odwiert pod pompę ciepła', 'odwierty pod pompy ciepła', 'odwierty do pompy ciepła',
                           'odwiert do pompy ciepła', 'odwierty pod pompę ciepła cena', 'odwiert pod pompę ciepła cena', 'cena odwiertu pod pompę ciepła',
                           'koszt odwiertu pod pompę ciepła', 'ile kosztuje odwiert pod pompę ciepła', 'ile kosztuje metr odwiertu pod pompę ciepła',
                           'ile odwiertów pod pompę ciepła', 'ile odwiertów do pompy ciepła', 'wiercenie pod pompę ciepła',
                           'wiercenie odwiertów pod pompy ciepła', 'odwierty pionowe pod pompy ciepła', 'odwierty pod gruntową pompę ciepła',
                           'głębokość odwiertu pod pompę ciepła', 'jak głęboko wiercić pod pompę ciepła', 'odwierty geotermalne pod pompę ciepła',
                           'firma wiertnicza pompy ciepła', 'projekt geologiczny pod pompę ciepła', 'odwierty do pomp ciepła cennik',
                           'pompa ciepła odwierty cena', 'odwiert pionowy pompa ciepła'],
                'naglowki': ['Odwierty pod pompę ciepła', 'Własna wiertnica, własna ekipa', '130 do 145 zł za metr netto', 'Ile metrów potrzebuje dom',
                             'Dzień wiercenia krok po kroku', 'Do 100 m na otwór', H['protokol'], 'Co zostaje na działce',
                             'Odwiert przy gotowym domu', 'Płuczka albo młotek', 'Formalności robimy my', H['umowa'],
                             'Policz metry w 2 minuty', H['dewax'], H['woj']],
                'opisy': ['Ile otworów potrzebuje dom, co dzieje się na działce w dniu wiercenia, cena za metr.',
                          'Własna wiertnica wjedzie na ciasną działkę przy gotowym domu. Termin z naszego grafiku.',
                          'Próba ciśnieniowa przed wypełnieniem otworu, protokół i dokumentacja powykonawcza.',
                          'Powyżej 30 m projekt robót geologicznych i zgłoszenie: przygotowujemy my, Ty podpisujesz.'],
                'wykluczenia_grupy': [],
            },
            {
                'id': 'dolne-zrodlo',
                'nazwa': 'Dolne źródło',
                'url': DOMENA + 'dolne-zrodlo-pompy-ciepla.html',
                'sciezki': ('dolne-zrodlo', 'pompa-ciepla'),
                'exact': ['dolne źródło pompy ciepła', 'dolne źródło pompa ciepła', 'pompa ciepła dolne źródło'],
                'phrase': ['dolne źródło pompy ciepła', 'dolne źródło pompa ciepła', 'dolne źródło ciepła', 'pompa ciepła dolne źródło',
                           'dolne źródło gruntowe', 'wykonanie dolnego źródła', 'sondy pionowe pompa ciepła', 'sonda pionowa pompa ciepła',
                           'kolektor poziomy pompa ciepła', 'pompa ciepła z kolektorem poziomym', 'gruntowa pompa ciepła pozioma',
                           'pompa ciepła gruntowa pozioma', 'wymiennik gruntowy pompa ciepła', 'pompa ciepła woda woda', 'pompa ciepła ze studni',
                           'kolektor pionowy pompa ciepła', 'sondy gruntowe pompa ciepła', 'pompa ciepła z wymiennikiem gruntowym'],
                'naglowki': ['Dolne źródło pompy ciepła', '4 technologie, 1 wykonawca', 'Odwiert, Helix, kolektor, woda', 'Długość źródła z geologii',
                             'Za krótkie źródło psuje system', 'Sondy koszowe DEWAX Helix', 'Kolektor poziomy albo pionowy', 'Układy woda-woda',
                             'Próba szczelności z protokołem', H['wiertnica'], 'Policz metry w 2 minuty', H['umowa'], H['dewax'],
                             'Które pasuje do Twojej działki', H['geo']],
                'opisy': ['Odwiert pionowy, sondy Helix, kolektor poziomy, woda-woda. Które pasuje do Twojej działki.',
                          'Długość źródła liczymy z mocy odbieranej z gruntu i geologii działki, nie z metrażu domu.',
                          'Za krótkie źródło: tańsza oferta dziś, droższe zimy później. Liczymy pod geologię działki.',
                          'Próba ciśnieniowa przed wypełnieniem otworu, protokół, dokumentacja. Jedna umowa.'],
                'wykluczenia_grupy': [],
            },
            {
                'id': 'helix',
                'nazwa': 'Sondy koszowe Helix',
                'url': DOMENA + 'sondy-koszowe-helix.html',
                'sciezki': ('sondy-koszowe', 'helix'),
                'exact': ['sondy koszowe', 'sonda koszowa pompa ciepła'],
                'phrase': ['sondy koszowe', 'sonda koszowa', 'sondy koszowe pompa ciepła', 'sonda koszowa pompa ciepła', 'sondy spiralne pompa ciepła',
                           'kolektor spiralny pompa ciepła', 'helix pompa ciepła', 'sonda helix', 'wymiennik spiralny pompa ciepła',
                           'pompa ciepła bez odwiertu', 'gruntowa pompa ciepła bez odwiertu', 'gruntowa pompa ciepła mała działka'],
                'naglowki': ['Sondy koszowe DEWAX Helix', 'Bez głębokiego odwiertu', 'Gdy wiertnica nie wjedzie', 'Szeroki, płytki otwór',
                             'Kiedy ma sens, kiedy nie', 'Rura zwinięta w spiralę', 'Próba szczelności z protokołem', 'Alternatywa dla kolektora',
                             'Montaż, wypełnienie, próba', H['policz'], H['geo'], H['dewax'], H['woj'], H['umowa'], 'Ciepło z gruntu, mała działka'],
                'opisy': ['Rura zwinięta w spiralę w szerokim, płytkim otworze. Kiedy ma sens zamiast odwiertu.',
                          'Dolne źródło tam, gdzie głęboki odwiert nie wchodzi w grę. Montaż, próba i wypełnienie.',
                          'Powiemy wprost, kiedy Helix odradzamy. Źródło liczymy z mocy pompy i geologii działki.',
                          'Jedna firma za dolne źródło, pompę i uruchomienie. DEWAX, Dobrzyca, 6 województw.'],
                'wykluczenia_grupy': [],
            },
        ],
    },
    {
        'id': 'dotacje',
        'nazwa': 'DEWAX | Dotacje',
        'budzet_dzienny': 10,
        'pulap_cpc': 4.0,
        'wykluczenia_kampanii_dodatkowe': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
        'grupy': [
            {
                'id': 'dotacje',
                'nazwa': 'Dotacje na gruntową pompę',
                'url': DOMENA + 'dotacje-pompa-ciepla.html',
                'sciezki': ('dotacje', 'pompa-ciepla'),
                'exact': ['dotacja gruntowa pompa ciepła', 'dofinansowanie gruntowa pompa ciepła', 'moje ciepło pompa ciepła',
                          'dotacja na gruntową pompę ciepła'],
                'phrase': ['dotacja gruntowa pompa ciepła', 'dotacja na gruntową pompę ciepła', 'dofinansowanie gruntowa pompa ciepła',
                           'dofinansowanie do gruntowej pompy ciepła', 'gruntowa pompa ciepła dofinansowanie', 'pompa ciepła gruntowa dotacja',
                           'moje ciepło pompa gruntowa', 'moje ciepło gruntowa pompa ciepła', 'moje ciepło pompa ciepła', 'moje ciepło 2026',
                           'czyste powietrze gruntowa pompa ciepła', 'czyste powietrze pompa gruntowa', 'ulga termomodernizacyjna pompa ciepła gruntowa',
                           'dotacja odwierty pompa ciepła', 'moje ciepło odwierty', 'dotacje na gruntowe pompy ciepła', 'dofinansowanie pompa gruntowa',
                           'jakie dofinansowanie do gruntowej pompy ciepła', 'dotacja pompa ciepła nowy dom', 'dofinansowanie pompa ciepła nowy dom'],
                'naglowki': ['Dotacje na gruntową pompę', 'Moje Ciepło do 21 000 zł', 'Nabór tylko do 31.12.2026', 'Czyste Powietrze: wg dochodu',
                             'Ulga do 53 000 zł odliczenia', 'Ile realnie dostaniesz', 'Nowy dom: Moje Ciepło', 'Stary dom: Czyste Powietrze',
                             'Co robi DEWAX, a czego nie', 'Wniosek po odbiorze domu', H['umowa'], H['policz'], H['dewax'],
                             '45% z Kartą Dużej Rodziny', 'Terminy i kwoty w 1 miejscu'],
                'opisy': ['Moje Ciepło do 21 000 zł tylko dla nowych domów, nabór do 31.12.2026, wniosek po odbiorze.',
                          'Czyste Powietrze dla istniejących domów wg dochodu. Ulga termomodernizacyjna do 53 000 zł.',
                          'Ile realnie dostaniesz i kiedy. Co robi DEWAX, a czego nie. Kwoty sprawdzone w 2026.',
                          'W Moim Cieple liczy się termin odbioru domu. Pompę zaplanuj przed wylewkami, policz koszt.'],
                'wykluczenia_grupy': [],
            },
        ],
    },
    {
        'id': 'marka',
        'nazwa': 'DEWAX | Marka',
        'budzet_dzienny': 5,
        'pulap_cpc': 3.0,
        'grupy': [
            {
                'id': 'marka',
                'nazwa': 'DEWAX',
                'url': DOMENA,
                'sciezki': ('dewax', 'dobrzyca'),
                'exact': ['dewax', 'dewax pompy ciepła', 'dewax dobrzyca'],
                'phrase': ['dewax', 'dewax pompy ciepła', 'dewax dobrzyca', 'dewax odwierty', 'dewax pompy', 'pan krecik pompy ciepła',
                           'dewax geo', 'dewax gruntowe pompy ciepła', 'pompy dewax'],
                'naglowki': ['DEWAX Dobrzyca', 'Gruntowe pompy ciepła DEWAX', 'Odwierty własną wiertnicą', 'Od 2007 roku', H['policz'], H['geo'],
                             'Ul. Ostrowska 1, Dobrzyca', 'Pan Krecik: marka wykonawcza', 'Oficjalna strona', H['umowa'], H['woj'],
                             'Pompy Thermokrafft i Buderus', 'Dla instalatorów: dolne źródło', 'Zamów dokładną wycenę', 'Kalkulator kosztu online'],
                'opisy': ['Strona DEWAX: gruntowe pompy ciepła z odwiertem własną wiertnicą. Dobrzyca, od 2007 roku.',
                          'Policz koszt pompy z odwiertem, sprawdź geologię w DEWAX GEO i zamów dokładną wycenę.',
                          'Projekt, odwiert, montaż i serwis na jednej umowie. Odpisujemy w jeden dzień roboczy.',
                          'Instalatorze: wykonamy dolne źródło pod Twój montaż, odwierty, sondy Helix, dokumentacja.'],
                'wykluczenia_grupy': [],
            },
        ],
    },
    {
        'id': 'regiony',
        'nazwa': 'DEWAX | Regiony',
        'budzet_dzienny': 10,
        'pulap_cpc': 4.0,
        'wykluczenia_kampanii_dodatkowe': ['powietrzna', 'powietrznej', 'powietrzne', 'powietrznych'],
        'grupy': [],   # generowane niżej z REGIONY
    },
]

# Strony wojewódzkie: miejscownik, miasta (max ~30 znaków w nagłówku), nagłówek regionalny, opis geologii.
REGIONY = [
    dict(id='wielkopolskie', plik='wielkopolskie', naz='Wielkopolska', loc='w Wielkopolsce', adj='wielkopolskie',
         miasta=['Kalisz', 'Ostrów Wielkopolski', 'Pleszew', 'Jarocin', 'Krotoszyn', 'Konin', 'Poznań', 'Leszno', 'Gniezno', 'Kępno'],
         h_miasta='Kalisz, Ostrów, Konin, Poznań', h_region='Gruntowe pompy: Wielkopolska', h_odwierty='Odwierty w Wielkopolsce',
         d_miasta='Kalisz, Konin, Poznań', geologia='piaski i gliny, płuczka'),
    dict(id='lodzkie', plik='lodzkie', naz='Łódzkie', loc='w Łódzkiem', adj='łódzkie',
         miasta=['Łódź', 'Sieradz', 'Wieluń', 'Piotrków Trybunalski', 'Zduńska Wola', 'Bełchatów', 'Pabianice', 'Zgierz'],
         h_miasta='Łódź, Sieradz, Piotrków', h_region='Gruntowe pompy: Łódzkie', h_odwierty='Odwierty w Łódzkiem',
         d_miasta='Łódź, Sieradz, Wieluń', geologia='gliny i piaski, margle, wapienie'),
    dict(id='kujawsko-pomorskie', plik='kujawsko-pomorskie', naz='Kujawsko-Pomorskie', loc='w Kujawsko-Pomorskiem', adj='kujawsko-pomorskie',
         miasta=['Bydgoszcz', 'Toruń', 'Włocławek', 'Inowrocław', 'Grudziądz', 'Brodnica'],
         h_miasta='Bydgoszcz, Toruń, Włocławek', h_region='Kujawsko-Pomorskie: odwierty', h_odwierty='Odwierty na Kujawach',
         d_miasta='Bydgoszcz, Toruń', geologia='piaski pradoliny, gliny Kujaw'),
    dict(id='dolnoslaskie', plik='dolnoslaskie', naz='Dolny Śląsk', loc='na Dolnym Śląsku', adj='dolnośląskie',
         miasta=['Wrocław', 'Legnica', 'Oleśnica', 'Świdnica', 'Wałbrzych', 'Jelenia Góra', 'Oława', 'Trzebnica'],
         h_miasta='Wrocław, Legnica, Świdnica', h_region='Gruntowe pompy: Dolny Śląsk', h_odwierty='Odwierty na Dolnym Śląsku',
         d_miasta='Wrocław, Legnica', geologia='piaski i iły, granity w Sudetach'),
    dict(id='slaskie', plik='slaskie', naz='Śląsk', loc='w Śląskiem', adj='śląskie',
         miasta=['Częstochowa', 'Katowice', 'Gliwice', 'Bielsko-Biała', 'Rybnik', 'Tychy', 'Lubliniec'],
         h_miasta='Częstochowa, Katowice, Gliwice', h_region='Gruntowe pompy: Śląskie', h_odwierty='Odwierty w Śląskiem',
         d_miasta='Częstochowa, Katowice', geologia='wapienie jury, tereny górnicze'),
    dict(id='mazowieckie', plik='mazowieckie', naz='Mazowsze', loc='na Mazowszu', adj='mazowieckie',
         miasta=['Warszawa', 'Płock', 'Radom', 'Siedlce', 'Ostrołęka', 'Pruszków', 'Grodzisk Mazowiecki', 'Piaseczno'],
         h_miasta='Warszawa, Płock, Radom', h_region='Gruntowe pompy: Mazowsze', h_odwierty='Odwierty na Mazowszu',
         d_miasta='Warszawa, Płock, Radom', geologia='gliny i piaski, dolina Wisły'),
]

def _grupa_regionu(r):
    phrase = []
    for m in r['miasta']:
        ml = m.lower()
        phrase += [f'gruntowa pompa ciepła {ml}', f'pompa ciepła gruntowa {ml}', f'odwierty pod pompę ciepła {ml}', f'pompa gruntowa {ml}']
    phrase += [f'gruntowe pompy ciepła {r["adj"]}', f'odwierty pod pompy ciepła {r["adj"]}', f'pompa ciepła gruntowa {r["adj"]}',
               f'gruntowa pompa ciepła {r["naz"].lower()}', f'odwierty pod pompę ciepła {r["naz"].lower()}']
    return {
        'id': 'region-' + r['id'],
        'nazwa': 'Region: ' + r['naz'],
        'url': DOMENA + 'gdzie-dzialamy/' + r['plik'] + '.html',
        'sciezki': ('gdzie-dzialamy', r['plik'][:15]),
        'exact': [f'gruntowa pompa ciepła {r["miasta"][0].lower()}', f'odwierty pod pompę ciepła {r["miasta"][0].lower()}'],
        'phrase': phrase,
        'naglowki': [r['h_region'], r['h_odwierty'], r['h_miasta'], 'Dojazd z Dobrzycy', 'Geologia regionu wg PIG-PIB', 'Płuczka czy młotek',
                     H['wiertnica'], H['umowa'], H['policz'], H['geo'], 'Umów oględziny działki', H['dewax'], 'Formalności w regionie',
                     'Cały region, wszystkie powiaty', H['odpowiedz']],
        'opisy': [f'Odwierty własną wiertnicą {r["loc"]}: {r["d_miasta"]} i wszystkie powiaty.',
                  f'Geologia regionu wg danych PIG-PIB: {r["geologia"]}. Dojazd z Dobrzycy.',
                  'Sprawdź, co jest pod Twoją działką, zanim ktokolwiek poda cenę. Policz koszt w 2 minuty.',
                  'Umów oględziny: wjazd wiertnicy, miejsce na odwierty, trasa rur. Odpowiedź w 1 dzień.'],
        'wykluczenia_grupy': [],
    }

for _k in KAMPANIE:
    if _k['id'] == 'regiony':
        _k['grupy'] = [_grupa_regionu(r) for r in REGIONY]

# Wykluczenia wspólne dla wszystkich kampanii (dopasowanie do wyrażenia), zbudowane na raporcie
# wyszukiwanych haseł z kampanii z sierpnia 2026 (595 haseł) i na ofercie DEWAX (tylko gruntowe).
WYKLUCZENIA_WSPOLNE = {
    'inne typy pomp i urządzeń': ['powietrze woda', 'powietrze powietrze', 'monoblok', 'split', 'klimatyzacja', 'klimatyzator', 'klimatyzatory',
                                  'basen', 'basenowa', 'basenowe', 'do cwu', 'cwu', 'bojler', 'podgrzewacz', 'grzałka', 'hybrydowa', 'kocioł gazowy cena'],
    'informacje, DIY, schematy': ['schemat', 'schematy', 'instrukcja', 'jak podłączyć', 'podłączenie', 'sterownik', 'samodzielny montaż', 'zrób sam',
                                  'jak działa', 'zasada działania', 'na czym polega', 'co to jest', 'definicja', 'wikipedia', 'forum', 'ranking',
                                  'pdf', 'test'],
    'praca, kursy, serwis, części': ['praca', 'zatrudnię', 'zatrudnimy', 'kurs', 'szkolenie', 'uprawnienia', 'serwis', 'naprawa', 'awaria', 'błąd',
                                     'kod błędu', 'usterka', 'części', 'część', 'sprężarka', 'używana', 'używane', 'używany', 'olx', 'allegro',
                                     'sprzedam', 'najtańsza', 'najtańsze', 'tania', 'tanie', 'chińska', 'przemysłowa', 'przemysłowe', 'hala'],
    'studnie i pompy do wody': ['studnia', 'studnie', 'studniarz', 'do studni', 'hydrofor', 'pompa głębinowa do', 'pompy głębinowe do', '1 cal', '3 cale', '4 cale'],
    'poza obszarem': ['kraków', 'krakow', 'gdańsk', 'gdansk', 'gdynia', 'szczecin', 'lublin', 'rzeszów', 'rzeszow', 'białystok', 'bialystok',
                      'olsztyn', 'kielce', 'opole', 'zielona góra', 'gorzów', 'koszalin', 'słupsk', 'tarnów', 'nowy sącz', 'zakopane',
                      'niemcy', 'deutschland'],
    'producenci i konkurenci (DEWAX montuje Thermokrafft i Buderus)': ['nibe', 'vaillant', 'viessmann', 'daikin', 'stiebel', 'stiebel eltron', 'thermia',
                      'galmet', 'gejzer', 'dimplex', 'ctc', 'mitsubishi', 'panasonic', 'bosch', 'kaisai', 'haier', 'york', 'qvantum', 'apic', 'a-pic',
                      'konceptus', 'vitocal', 'altherma', 'calibra', 'geodan', 'flexotherm', 'flexocompact', 'wolf', 'samsung', 'gree', 'midea',
                      'hewalex', 'ciepłozziemi', 'jurkowski', 'sevro', 'pan studniarz'],
}

# Zasoby (rozszerzenia) na poziomie kampanii, te same we wszystkich kampaniach.
LINKI = [  # tekst do 25 znaków, opisy do 35
    ('Policz koszt w 2 minuty', DOMENA + '#kreator', 'Pompa, odwiert i montaż', 'Bez telefonu i logowania'),
    ('Odwierty pod pompę ciepła', DOMENA + 'odwierty-pod-pompe-ciepla.html', 'Ile metrów potrzebuje dom', 'Dzień wiercenia krok po kroku'),
    ('Ile to kosztuje', DOMENA + 'gruntowa-pompa-ciepla-cena.html', 'Przykład dla domu 150 m²', 'Cena z odwiertem i montażem'),
    ('Dotacje 2026', DOMENA + 'dotacje-pompa-ciepla.html', 'Moje Ciepło do 21 000 zł', 'Czyste Powietrze, ulga'),
    ('Gruntowa czy powietrzna', DOMENA + 'pompa-ciepla-czy-warto.html', 'Liczby z podaniem źródeł', 'Kiedy gruntową odradzamy'),
    ('Pompy Thermokrafft', DOMENA + 'pompy.html', 'Cztery modele na R290', 'Modele, moce, COP, ceny'),
    ('Dolne źródło', DOMENA + 'dolne-zrodlo-pompy-ciepla.html', 'Odwiert, Helix, kolektor', 'Jak liczymy długość źródła'),
    ('Zamów wycenę', DOMENA + '#kontakt', 'Odpowiedź w 1 dzień roboczy', 'Oferta pozycja po pozycji'),
]
OBJASNIENIA = ['Własna wiertnica', 'Odwiert i pompa: 1 umowa', 'Od 2007 roku', 'Kalkulator kosztu online', 'Próba szczelności',
               '6 województw', 'Dokumentacja powykonawcza', 'Thermokrafft i Buderus', 'Bez podawania telefonu', 'Serwis z Dobrzycy']
ROZSZERZENIE_USLUGI = ('Katalog usług', ['Odwierty pionowe', 'Sondy koszowe Helix', 'Kolektor poziomy', 'Układy woda-woda',
                                        'Montaż pompy ciepła', 'Uruchomienie i serwis', 'Projekt dolnego źródła', 'Formalności geologiczne'])
