/* =====================================================================
   DEWAX · generator kreacji Meta · treści macierzy
   Rejestr: Adam z Dobrzycy. Krótkie zdania. Konkret. Zero entuzjazmu.
   Bez pauz „—”, bez wykrzykników, bez „innowacji” i „ekologii”.
   Każdy blok ma pole `zrodlo`: skąd wzięty fakt (sekcja strony pompy.dewax.pl,
   post z fanpage'a albo dokument w repozytorium). Nic nie jest wymyślone.
   Bloki z polem `uwaga` wymagają potwierdzenia przez właściciela przed użyciem.
   ===================================================================== */
window.DX_TRESCI = {

  wersja: '2026-09-12',
  strona: 'https://pompy.dewax.pl/',
  utm: { source: 'facebook', medium: 'paid_social', campaign: 'pompy-leady-2026-09' },

  /* Wzorzec rejestru: cztery reklamy z kampanii startowej (12.09.2026). */
  wzorzec: [
    { kod: 'R1', nazwa: 'Dzień wiercenia', tekst: 'Dziś wiercimy. Później możesz o tym zapomnieć.\n\nCiepły dom i ciepła woda z Twojej działki: bez komina, bez dostaw paliwa, bez jednostki na elewacji. Odwiert, dolne źródło i pompę Thermokrafft wykonuje jedna firma z Dobrzycy, własną wiertnicą, więc za całość odpowiada jeden wykonawca.\n\nZanim z kimkolwiek podpiszesz umowę, policz koszt systemu dla swojego domu. 2 minuty, bez podawania telefonu.', naglowek: 'Policz koszt gruntowej pompy ciepła', opis: 'Kalkulator w 2 minuty, bez telefonu', foto: 'dzien-wiercenia' },
    { kod: 'R2', nazwa: 'Dom, który już stoi', tekst: 'Masz stary kocioł albo drogie ogrzewanie i zastanawiasz się, czy gruntówka ma sens w Twoim domu?\n\nSprawdź to, zanim ktoś Ci ją sprzeda. Kalkulator na pompy.dewax.pl liczy koszt całego systemu: pompa, odwierty, montaż. Osobno, bez logowania, sprawdzisz w DEWAX GEO, czy na Twojej działce da się wiercić.\n\nOdwierty wykonujemy własną wiertnicą, także kilka metrów od ściany istniejącego domu. Jedna umowa, jeden wykonawca od odwiertu po kotłownię.', naglowek: 'Czy gruntówka ma sens w Twoim domu?', opis: 'Koszt systemu i geologia działki', foto: 'odwiert-przy-domu' },
    { kod: 'R3', nazwa: 'Kotłownia', tekst: 'Ciepło i ciepła woda z jednego urządzenia w kotłowni. Cicho, bez komina, bez dostaw paliwa.\n\nIle to kosztuje u Ciebie? Policz w 2 minuty: metraż, ogrzewanie, działka. Dostaniesz moc pompy, długość odwiertów i widełki ceny całego systemu, nie samej pompy.\n\nDEWAX z Dobrzycy: własna wiertnica, pompy Thermokrafft, serwis po montażu. Jedna firma od ziemi po kotłownię.', naglowek: 'Ile kosztuje gruntowa pompa ciepła u Ciebie', opis: 'Cały system, nie sama pompa', foto: 'kotlownia-thermokrafft' },
    { kod: 'R4', nazwa: 'Karuzela: zobacz, co dostajesz', tekst: 'Nie kupuj pompy w ciemno. Zobacz, co naprawdę dostajesz: odwiert własną wiertnicą DEWAX, sondę w otworze, próbę ciśnieniową dolnego źródła i pompę Thermokrafft w kotłowni. Potem policz koszt systemu dla swojego domu, zanim podpiszesz z kimkolwiek.', naglowek: 'Zobacz, co dostajesz. Potem policz koszt.', opis: '', foto: 'k1-wiercimy-sami' }
  ],

  /* HOOK: pierwsze zdania. Jeden, dwa, najwyżej trzy krótkie zdania. */
  hooki: [
    { id: 'h01', typ: 'problem', nazwa: 'Co roku to samo',
      tekst: 'Co roku to samo: dostawa, noszenie, popiół, przegląd komina. A rachunek za zimę i tak zaskakuje.',
      foto: 'kotlownia-thermokrafft', zrodlo: 'strona: sekcja Porównanie i Dolne źródło (ciepło bez komina i dostaw paliwa)' },
    { id: 'h02', typ: 'ciekawość', nazwa: 'Pod trawnikiem',
      tekst: 'Pod Twoim trawnikiem, kilkadziesiąt metrów niżej, jest ciepło na całą zimę. Pytanie tylko, ile metrów sondy potrzebuje Twój dom.',
      foto: 'sonda-w-otworze', zrodlo: 'strona: sekcja Dolne źródło i kalkulator (metry sondy zależą od domu)' },
    { id: 'h03', typ: 'lokalnie', nazwa: 'U sąsiadów',
      tekst: 'Pleszew, Jarocin, Krotoszyn, Kalisz, Ostrów. Wiercimy u sąsiadów, siedzibę mamy w Dobrzycy. Zimą przyjeżdżamy stąd, nie z ogólnopolskiej kolejki zgłoszeń.',
      foto: 'dzien-wiercenia', zrodlo: 'strona: sekcja Po montażu (serwis z Dobrzycy) i Gdzie działamy' },
    { id: 'h04', typ: 'konkret cenowy', nazwa: 'Metr odwiertu',
      tekst: 'Metr odwiertu kosztuje u nas 130 do 145 zł netto, z sondą, wypełnieniem i próbą ciśnieniową. Reszta ceny zależy od Twojego domu, nie od cennika.',
      foto: 'proba-cisnieniowa', zrodlo: 'strona: sekcja Obawy „Ile kosztuje cały system” (130–145 zł netto) i tabela wyniku kalkulatora',
      uwaga: 'CONTENT_NEEDED punkt 3: potwierdzić, że stawka obejmuje sondę, wypełnienie i próbę. Do potwierdzenia użyj wariantu bez zakresu.' },
    { id: 'h05', typ: 'zdjęcie z placu', nazwa: 'Zdjęcie, nie katalog',
      tekst: 'Zdjęcie z placu, nie z katalogu. Tak wygląda odwiert pod gruntówkę na zwykłej działce, kilka metrów od ściany domu.',
      foto: 'odwiert-przy-domu', zrodlo: 'strona: wyróżniona realizacja (odwiert kilka metrów od ściany istniejącego domu)' },
    { id: 'h06', typ: 'obalenie mitu', nazwa: 'Wielka działka',
      tekst: 'Gruntówka nie potrzebuje wielkiej działki. Odwiert idzie w dół, nie wszerz, i na powierzchni zajmuje kilka metrów kwadratowych.',
      foto: 'sonda-w-otworze', zrodlo: 'strona: sekcja Obawy „Czy można wykonać odwiert na mojej działce”' },
    { id: 'h07', typ: 'pilność', nazwa: 'Moje Ciepło do 31.12',
      tekst: 'Moje Ciepło: nabór do 31 grudnia 2026, tylko nowe domy, do 21 000 zł. Wniosek składa się po odbiorze domu, więc liczy się, kiedy zaplanujesz system.',
      foto: 'dzien-wiercenia', zrodlo: 'strona: sekcja Dotacje (stan zweryfikowany 15.08.2026)',
      uwaga: 'Przed użyciem potwierdzić nabór i kwoty programu Moje Ciepło (CLAUDE.md: sprawdzić przed publikacją).' },
    { id: 'h08', typ: 'porównanie', nazwa: 'Powietrzna jest tańsza na start',
      tekst: 'Powietrzna jest tańsza na start. Gruntowa pracuje na źródle, które w styczniu ma tę samą temperaturę co w lipcu, i nie wisi na ścianie.',
      foto: 'kotlownia-thermokrafft', zrodlo: 'strona: sekcja Obawy „Czym gruntowa różni się od powietrznej”' },
    { id: 'h09', typ: 'pytanie', nazwa: 'Ile metrów',
      tekst: 'Ile metrów odwiertu potrzebuje Twój dom? Zależy od metrażu, ogrzewania i gruntu, nie od tego, kto wyceni.',
      foto: 'wiercenie-pluczka', zrodlo: 'strona: kalkulator (moc, metry, otwory z danych domu)' },
    { id: 'h10', typ: 'historia', nazwa: 'Od danych PIG do kotłowni',
      tekst: 'Najpierw sprawdzamy w danych PIG-PIB, co jest pod działką. Potem wiercimy. Sonda dostaje protokół próby ciśnieniowej, zanim zasypiemy otwór. Zostaje cicha kotłownia i papiery z prawdziwą głębokością otworów.',
      foto: 'proba-cisnieniowa', zrodlo: 'strona: sekcja Po montażu (protokół próby, dokumentacja powykonawcza z rzeczywistą głębokością) i sekcja GEO' }
  ],

  /* BENEFIT: dwa, trzy zdania z dowodem. `opis` to krótki opis pod nagłówkiem w reklamie (do 30 znaków). */
  korzysci: [
    { id: 'b1', nazwa: 'koszt ogrzewania',
      tekst: 'Przy tym samym domu gruntówka zużywa około 29% mniej prądu niż powietrzna (SPF 3,5 wobec 2,5 według decyzji KE 2013/114/UE). Rachunek liczy się ze sprawności sezonowej, nie z COP z katalogu. W kalkulatorze widzisz zużycie prądu policzone z jawnie podanej sprawności.',
      opis: 'SPF, nie COP z katalogu', foto: 'kotlownia-thermokrafft', zrodlo: 'strona: sekcja Porównanie i Obawy „Dlaczego SPF jest ważniejszy od COP”; CLAUDE.md: wolno ze źródłem' },
    { id: 'b2', nazwa: 'jeden wykonawca',
      tekst: 'Odwiert, dolne źródło, pompa Thermokrafft i serwis: jedna firma z Dobrzycy, własna wiertnica, jedna umowa. Co dzieje się z ceną, gdy geologia okaże się gorsza, masz w umowie przed startem. Gdy coś się dzieje, przyjeżdżają ci sami ludzie, nie infolinia.',
      opis: 'Jedna firma, jedna umowa', foto: 'dzien-wiercenia', zrodlo: 'strona: sekcja Jedna firma, Obawy „Co, jeśli trzeba wiercić głębiej”, Po montażu (serwis)' },
    { id: 'b3', nazwa: 'brak komina',
      tekst: 'Bez komina, bez dostaw paliwa, bez popiołu. Ciepło i ciepła woda z jednego urządzenia w kotłowni, zasilanego prądem.',
      opis: 'Bez komina i dostaw paliwa', foto: 'kotlownia-thermokrafft', zrodlo: 'strona: hero i sekcja Dolne źródło' },
    { id: 'b4', nazwa: 'brak jednostki na elewacji',
      tekst: 'Nic nie wisi na ścianie i nic nie szumi pod oknem sypialni ani u sąsiada. Całość stoi w kotłowni, a źródło ciepła leży pod trawnikiem, którego po zasypaniu nie widać.',
      opis: 'Cicho, nic na elewacji', foto: 'odwiert-przy-domu', zrodlo: 'strona: sekcja Porównanie (cisza, brak jednostki zewnętrznej)' },
    { id: 'b5', nazwa: 'chłodzenie latem',
      tekst: 'Latem ten sam obieg glikolu może chłodzić dom prawie bez pracy sprężarki i doładowuje grunt na zimę. Powietrzna tego nie ma bez pracy sprężarki.',
      opis: 'Może chłodzić latem', foto: 'kotlownia-bufor', zrodlo: 'strona: FAQ „Czy pompa chłodzi latem”',
      uwaga: 'Wymaga modułu chłodzenia pasywnego w instalacji. Potwierdzić, że jest w ofercie, zanim ta korzyść pójdzie do Meta.' },
    { id: 'b6', nazwa: 'niezależność od pogody',
      tekst: 'Grunt kilkadziesiąt metrów pod działką ma w styczniu tę samą temperaturę co w lipcu. Pompa nie traci sprawności w mróz, nie odszrania się i nie zależy od tego, co wieje za oknem.',
      opis: 'Mróz nie zmienia sprawności', foto: 'wiercenie-pluczka', zrodlo: 'strona: sekcja Porównanie (stabilne źródło, brak spadku sprawności w mróz)' }
  ],

  /* CTA: ostatni akapit, nagłówek reklamy i adres docelowy (utm_content dopisuje generator). */
  cta: [
    { id: 'c1', nazwa: 'policz koszt',
      tekst: 'Zanim z kimkolwiek podpiszesz umowę, policz koszt całego systemu dla swojego domu: pompa, odwierty, montaż. Kalkulator na pompy.dewax.pl, 2 minuty.',
      naglowek: 'Policz koszt gruntowej pompy ciepła', opis: 'Kalkulator w 2 minuty', kotwica: '', zrodlo: 'strona: hero i kalkulator' },
    { id: 'c2', nazwa: 'sprawdź działkę',
      tekst: 'Sprawdź w DEWAX GEO, co jest pod Twoją działką i czy da się tam wiercić. Bez logowania, z archiwalnych danych PIG-PIB.',
      naglowek: 'Sprawdź geologię swojej działki', opis: 'Dane PIG-PIB, bez logowania', kotwica: '#geo', zrodlo: 'strona: sekcja GEO; CLAUDE.md: wolno pisać, że bez logowania' },
    { id: 'c3', nazwa: 'bez telefonu',
      tekst: 'Sprawdź liczby, zanim ktoś Ci ją sprzeda. Kalkulator i raport geologiczny działają bez podawania telefonu. Dzwonimy tylko wtedy, gdy sam zostawisz numer.',
      naglowek: 'Sprawdź, zanim ktoś Ci ją sprzeda', opis: 'Bez telefonu, bez handlowca', kotwica: '', zrodlo: 'strona: FAQ „Muszę podać numer telefonu?”' }
  ],

  /* Zdjęcia: wyłącznie prawdziwe zdjęcia DEWAX z repozytorium. Kadry do Meta w reklamy/meta/, źródła w zdjecia/ i img/. */
  zdjecia: [
    { id: 'dzien-wiercenia', nazwa: 'Operator przy wiertnicy (dzień wiercenia)', plik: 'reklamy/meta/dzien-wiercenia-4x5.jpg', zrodlo: 'zdjecia/77.jpg', format: '4:5', opis: 'Operator DEWAX przy własnej wiertnicy na działce, słoneczny dzień, budynek w tle.' },
    { id: 'odwiert-przy-domu', nazwa: 'Odwiert kilka metrów od domu', plik: 'reklamy/meta/odwiert-przy-domu-4x5.jpg', zrodlo: 'zdjecia/76.jpg', format: '4:5', opis: 'Wiertnica tuż przy ścianie istniejącego domu z panelami na dachu.' },
    { id: 'kotlownia-thermokrafft', nazwa: 'Kotłownia: pompa Thermokrafft i bufor', plik: 'reklamy/meta/kotlownia-thermokrafft-4x5.jpg', zrodlo: 'zdjecia/90.jpg', format: '4:5', opis: 'Czarna pompa Thermokrafft obok dużego zasobnika, czysta kotłownia.' },
    { id: 'kotlownia-bufor', nazwa: 'Kotłownia z bufora (kadr 1:1)', plik: 'reklamy/meta/k4-kotlownia-1x1.jpg', zrodlo: 'zdjecia/90.jpg', format: '1:1', opis: 'Ten sam widok kotłowni w kadrze kwadratowym.' },
    { id: 'k1-wiercimy-sami', nazwa: 'Wiercimy sami (kadr 1:1)', plik: 'reklamy/meta/k1-wiercimy-sami-1x1.jpg', zrodlo: 'zdjecia/77.jpg', format: '1:1', opis: 'Operator i wiertnica, kadr kwadratowy do karuzeli.' },
    { id: 'sonda-w-otworze', nazwa: 'Sonda w otworze', plik: 'reklamy/meta/k2-sonda-w-otworze-1x1.jpg', zrodlo: 'img/otwor.webp', format: '1:1', opis: 'Niebieska rura sondy opuszczona do otworu, widok z góry.' },
    { id: 'proba-cisnieniowa', nazwa: 'Próba ciśnieniowa (manometr)', plik: 'reklamy/meta/k3-proba-cisnieniowa-1x1.jpg', zrodlo: 'img/manometr.webp', format: '1:1', opis: 'Manometr pokazujący około 4 bar podczas próby dolnego źródła.' },
    { id: 'wiercenie-pluczka', nazwa: 'Wiercenie na płuczkę', plik: 'zdjecia/75.jpg', zrodlo: 'zdjecia/75.jpg', format: 'pion 3:4 (do przycięcia)', opis: 'Wiertnica nad otworem, woda z urobkiem wokół rury.' },
    { id: 'sonda-helix', nazwa: 'Sonda koszowa Helix', plik: 'img/helix.webp', zrodlo: 'img/helix.webp', format: 'poziom (do przycięcia)', opis: 'Rura zwinięta w spiralę w szerokim otworze przed wypełnieniem.' },
    { id: 'kotlownia-k1', nazwa: 'Kotłownia nowego domu', plik: 'img/k1.webp', zrodlo: 'img/k1.webp', format: '4:3 (do przycięcia)', opis: 'Pompa Thermokrafft z rozdzielaczem i przyłączami dolnego źródła.' },
    { id: 'maszt-wiertnicy', nazwa: 'Maszt wiertnicy na tle nieba', plik: 'img/hero_wide.webp', zrodlo: 'img/hero_wide.webp', format: 'poziom', opis: 'Maszt z głowicą i przewodami hydraulicznymi.' }
  ],

  /* Zasady tonu sprawdzane przez lint (panel i lint.mjs). */
  zasady: {
    zakazane: ['odkryj', 'nowoczesn', 'innowac', 'rewoluc', 'ekolog', 'postaw na', 'kompleksow', 'najlepsz', 'najtańsz', 'super', 'wyjątkow', 'gwarantujemy', 'zwrot inwestycji', 'zwraca się', 'bezemisyjn', 'przyszłość ogrzewania', 'nie czekaj', 'już dziś', 'promocj', 'okazj', 'tylko teraz'],
    zakazaneZnaki: ['—', '!', '…'],
    maksSlowWZdaniu: 20,
    maksZnakowTekstu: 650,
    maksZnakowNaglowka: 40,
    maksZnakowOpisu: 30
  }
};
