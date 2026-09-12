# Kampania Meta Ads: pompy.dewax.pl

Stan na 12 września 2026. Kampania, zestaw reklam i cztery reklamy są założone za zgodą właściciela
i **włączone 12.09.2026 na jego polecenie** (kampania, zestaw i reklamy w statusie ACTIVE). Reklamy
przechodzą weryfikację Meta, zwykle do 24 godzin; dopiero potem zaczynają się wyświetlać i wydawać
budżet. Gałąź z pikselem została tego samego dnia scalona na `main` (wdrożenie run 20).

## Cel i logika

Meta (Facebook, Instagram) to ruch zimny: ludzie nie szukają pompy w tej chwili. Dlatego reklama nie
sprzedaje pompy, tylko obiecuje odpowiedź na pytanie, które właściciel domu naprawdę ma: „ile to kosztuje
u mnie i czy na mojej działce da się wiercić”. Strona odpowiada kalkulatorem i DEWAX GEO, a dopiero potem
prosi o dane do wyceny. Lejek jest ten sam co na stronie: kalkulator, GEO, formularz wyceny, oględziny.

Zasada tekstów: OUTCOME-FIRST z `CLAUDE.md`. Najpierw efekt dla klienta (ciepły dom, spokój, jeden
wykonawca), technologia jako dowód. Bez ekologii, bez zwrotu inwestycji, bez liczb, których nie da się
obronić. Bez pauz „—”.

## Konto, strona, piksel

| Element | Wartość | Uwaga |
|---|---|---|
| Konto reklamowe | `1413741105666132` „nowe konto reklamowe 1”, firma „Dewax” (`159657032930324`), PLN | Jedyne konto firmowe dostępne przez integrację. Dziś prowadzi kampanię Multilan (farby), więc kampania pomp ma wyraźną nazwę z prefiksem „DEWAX pompy” |
| Konto „Dewax gruntowe pompy ciepła” | `955522616312255`, firma „Gruntowe pompy ciepła” | Integracja Meta jeszcze go nie obsługuje („gradually being rolled out”). Jeśli właściciel woli prowadzić kampanię tam, całość niżej da się odtworzyć ręcznie z tego opisu |
| Konto „Adam Demczyszak” | `10203979568391826` | Status UNSETTLED (nieuregulowana płatność). Nie używać do kampanii |
| Strona (Page) | preferowana „Dewax gruntowe pompy ciepła” `105889812346061`; zapasowa „DEWAX” `160091957504131` | Do konta `1413741105666132` przypięta jest tylko strona „DEWAX”. Jeśli kreacje nie przyjmą strony pomp, trzeba ją udostępnić firmie „Dewax” w Ustawieniach firmowych |
| Piksel (zestaw danych) | `1032857169399673` „dewax.pl” | Założony 4.06.2026, **nigdy nie odpalił**: nie był wpięty w żadną stronę. Od tej gałęzi jest w `<head>` każdej strony pompy.dewax.pl, bramkowany zgodą marketingową Cookiebota. Zdarzenia: `docs/ANALITYKA.md` |
| Kampania | `120249004354710355` „DEWAX pompy \| Leady \| Kalkulator kosztu \| 2026-09” | Cel: kontakty (OUTCOME_LEADS), aukcja, budżet kampanii 60 zł/dzień, limit wydatków 2 000 zł, najniższy koszt bez limitu stawki. **PAUSED**: włączenie dopiero po wdrożeniu piksela |
| Zestaw reklam A | `120249004665300355` „A \| 200 km od Dobrzycy + Warszawa (14 kół) \| Lead” | Decyzja właściciela 12.09.2026: 200 km od Dobrzycy plus Warszawa. Optymalizacja na Lead z piksela, PAUSED |
| Reklamy | R1 `120249004678800355`, R2 `120249004679490355`, R3 `120249004686060355`, R4 `120249004690330355` | Wszystkie PAUSED, z kreacjami z sekcji „Kreacje w koncie” |

Obserwacja przy okazji: istniejąca kampania Multilan „Nowa kampania z celem Kontakty” optymalizuje na
konwersję niestandardową „kontakt dewax.pl” z tego samego piksela. Skoro piksel nigdy nie odpalił,
ta kampania od czerwca nie dostaje żadnego sygnału konwersji (300 zł wydane, 808 kliknięć, 0 wyników).
Piksel trzeba wpiąć także w dewax.pl (WordPress), inaczej optymalizacja tam nie ma na czym się uczyć.

## Struktura kampanii

```
Kampania: DEWAX pompy | Leady | Kalkulator kosztu | 2026-09   (id 120249004354710355)
  cel OUTCOME_LEADS, aukcja, budżet kampanii (CBO) 60 zł/dzień, limit wydatków 2 000 zł,
  strategia stawek: najniższy koszt bez limitu
  └── Zestaw A: 200 km od Dobrzycy + Warszawa   (id 120249004665300355)
        lokalizacja: Meta ogranicza promień wokół punktu do 80 km, więc obszar 200 km od Dobrzycy
        (51,868 N, 17,618 E) odwzorowuje 13 kół o promieniach dobranych tak, żeby zewnętrzna krawędź
        nie wychodziła dalej niż ok. 210 km, plus Warszawa 80 km na życzenie właściciela:
          Dobrzyca 80, Poznań 80, Wrocław 80, Łódź 80, Wieluń 80, Opole 75, Bydgoszcz 68,
          Zielona Góra 65, Piła 55, Częstochowa 53, Płock 49, Jelenia Góra 41, Gorzów Wlkp. 21,
          Warszawa 80 (km); osoby mieszkające tam lub ostatnio tam przebywające
        wiek 30–65 jako sugestia dla Advantage+ audience (Meta nie pozwala na twardy próg
        powyżej 25 lat przy Advantage+), obie płcie, bez zainteresowań (szerokie)
        umiejscowienia: automatyczne (Advantage+), witryna jako miejsce docelowe
        optymalizacja: konwersje w witrynie, zdarzenie Lead z piksela 1032857169399673
        rozliczenie: wyświetlenia, okno atrybucji domyślne (7 dni klik, 1 dzień wyświetlenie)
        DSA: beneficjent i płatnik DEWAX Sp. z o.o.
        reklamy: R1 120249004678800355, R2 120249004679490355, R3 120249004686060355,
                 R4 120249004690330355 (wszystkie PAUSED)
  Zestaw B z pierwotnej propozycji (dalsze regiony) nie powstał: jego miasta mieszczą się
  w zestawie A albo są poza 200 km (Katowice, Kraków, Szczecin, Kielce, Radom); do rozważenia
  jako rozszerzenie po pierwszych wynikach.
```

Dlaczego tak:

- **Cel „kontakty” i optymalizacja na Lead**, a nie ruch. Ruch daje tanie kliknięcia od osób, które
  nie kupią systemu za 90–120 tys. zł. Lead z formularza to sygnał jakości. Na starcie piksel nie ma
  historii, więc pierwsze 2–3 tygodnie to nauka algorytmu; to normalne.
- **Szeroko, bez zainteresowań.** Meta nie ma dobrego segmentu „buduje dom w Wielkopolsce”. Lepiej dać
  algorytmowi sygnał z piksela (kalkulator, Lead) niż zgadywać zainteresowania.
- **200 km od Dobrzycy plus Warszawa, nie cała Polska.** Pierwotna propozycja (70 km i osobny
  zestaw na dalsze miasta) została zmieniona decyzją właściciela 12.09.2026 na jeden zestaw o zasięgu
  200 km z dodaną Warszawą. Obszar pokrywa wielkopolskie, łódzkie, kujawsko-pomorskie, dolnośląskie,
  opolskie, lubuskie, północ śląskiego (Częstochowa) i zachód mazowieckiego, a osobne koło obejmuje
  aglomerację warszawską. Poza zasięgiem zostają Katowice, Kraków, Szczecin, Kielce i Radom.
- **Budżet 60 zł/dzień (ok. 1 800 zł/mies.) i limit 2 000 zł.** Limit to bezpiecznik: kampania
  zatrzyma się sama, gdyby nikt na nią nie patrzył. Do zmiany jednym polem w Menedżerze reklam.
- **Jedna kampania, dwa zestawy.** Przy tym budżecie więcej zestawów tylko rozprasza naukę.

## Reklamy

Wszystkie prowadzą na stronę główną (hero: „Najpierw sprawdź koszt systemu i geologię swojej działki”)
z parametrami UTM do GA4. Wyświetlany adres: `pompy.dewax.pl`. Przycisk: „Więcej informacji” (LEARN_MORE).
Zdjęcia: wyłącznie prawdziwe zdjęcia DEWAX z `zdjecia/` i `img/`, kadry w `reklamy/meta/*.jpg`
(skrypt `przygotuj.py`). Bez renderów, bez zdjęć stockowych, bez nakładek tekstowych.

Adres docelowy: `https://pompy.dewax.pl/?utm_source=facebook&utm_medium=paid_social&utm_campaign=pompy-leady-2026-09&utm_content=<nazwa reklamy>`

### Reklama 1: „Dzień wiercenia” (obraz 4:5 `dzien-wiercenia-4x5.jpg`)

Tekst główny:

> Dziś wiercimy. Później możesz o tym zapomnieć.
>
> Ciepły dom i ciepła woda z Twojej działki: bez komina, bez dostaw paliwa, bez jednostki na elewacji. Odwiert, dolne źródło i pompę Thermokrafft wykonuje jedna firma z Dobrzycy, własną wiertnicą, więc za całość odpowiada jeden wykonawca.
>
> Zanim z kimkolwiek podpiszesz umowę, policz koszt systemu dla swojego domu. 2 minuty, bez podawania telefonu.

Nagłówek: **Policz koszt gruntowej pompy ciepła** · Opis: „Kalkulator w 2 minuty, bez telefonu” · `utm_content=dzien-wiercenia`

### Reklama 2: „Dom, który już stoi” (obraz 4:5 `odwiert-przy-domu-4x5.jpg`)

Tekst główny:

> Masz stary kocioł albo drogie ogrzewanie i zastanawiasz się, czy gruntówka ma sens w Twoim domu?
>
> Sprawdź to, zanim ktoś Ci ją sprzeda. Kalkulator na pompy.dewax.pl liczy koszt całego systemu: pompa, odwierty, montaż. Osobno, bez logowania, sprawdzisz w DEWAX GEO, czy na Twojej działce da się wiercić.
>
> Odwierty wykonujemy własną wiertnicą, także kilka metrów od ściany istniejącego domu. Jedna umowa, jeden wykonawca od odwiertu po kotłownię.

Nagłówek: **Czy gruntówka ma sens w Twoim domu?** · Opis: „Koszt systemu i geologia działki” · `utm_content=dom-ktory-juz-stoi`

### Reklama 3: „Kotłownia” (obraz 4:5 `kotlownia-thermokrafft-4x5.jpg`)

Tekst główny:

> Ciepło i ciepła woda z jednego urządzenia w kotłowni. Cicho, bez komina, bez dostaw paliwa.
>
> Ile to kosztuje u Ciebie? Policz w 2 minuty: metraż, ogrzewanie, działka. Dostaniesz moc pompy, długość odwiertów i widełki ceny całego systemu, nie samej pompy.
>
> DEWAX z Dobrzycy: własna wiertnica, pompy Thermokrafft, serwis po montażu. Jedna firma od ziemi po kotłownię.

Nagłówek: **Ile kosztuje gruntowa pompa ciepła u Ciebie** · Opis: „Cały system, nie sama pompa” · `utm_content=kotlownia`

### Reklama 4: karuzela „Zobacz, co dostajesz” (4 karty 1:1)

Tekst główny:

> Nie kupuj pompy w ciemno. Zobacz, co naprawdę dostajesz: odwiert własną wiertnicą DEWAX, sondę w otworze, próbę ciśnieniową dolnego źródła i pompę Thermokrafft w kotłowni. Potem policz koszt systemu dla swojego domu, zanim podpiszesz z kimkolwiek.

| Karta | Obraz | Nagłówek | Opis |
|---|---|---|---|
| 1 | `k1-wiercimy-sami-1x1.jpg` | Wiercimy własną wiertnicą | Dzień wiercenia na Twojej działce |
| 2 | `k2-sonda-w-otworze-1x1.jpg` | Sonda schodzi do otworu | Dolne źródło Twojego domu |
| 3 | `k3-proba-cisnieniowa-1x1.jpg` | Próba ciśnieniowa dolnego źródła | Sprawdzamy szczelność przed zasypaniem |
| 4 | `k4-kotlownia-1x1.jpg` | Pompa Thermokrafft w kotłowni | Ciepło i ciepła woda. Cicho. |

`utm_content=karuzela`

### Reklama 5 (rezerwa, nieutworzona): „Moje Ciepło do 31.12.2026”

Do włączenia dopiero po potwierdzeniu naboru i kwot (`CLAUDE.md`: dotacje zweryfikowane 15.08.2026,
sprawdzić przed publikacją). Obraz: `dzien-wiercenia-4x5.jpg` albo `kotlownia-thermokrafft-4x5.jpg`.

> Budujesz dom? Nabór do programu Moje Ciepło (do 21 000 zł na gruntową pompę ciepła w nowym domu) trwa do 31 grudnia 2026. Wniosek składa się po odbiorze domu, więc liczy się, kiedy zaplanujesz system.
>
> Policz, ile kosztuje gruntówka dla Twojego metrażu, i sprawdź, czy na działce da się wiercić. 2 minuty, bez podawania telefonu.

Nagłówek: **Moje Ciepło: nabór do 31.12.2026** · Opis: „Policz koszt systemu dla swojego domu”

## Czego w reklamach świadomie nie ma

- Gwarancji w latach, liczby wykonanych instalacji, cen za metr, COP/SCOP: brak potwierdzonych danych
  (`CONTENT_NEEDED.md`). Karuzela mówi o próbie ciśnieniowej, nie o „protokole dla klienta”, bo zakres
  dokumentacji dla klienta nie jest potwierdzony.
- Chłodzenia latem: wymaga modułu chłodzenia pasywnego, nie każda instalacja go ma.
- Ekologii i „zwrotu w X lat”: zasada ze strategii, forum odrzuca oba argumenty.
- Opinii klientów: brak pisemnych zgód.
- Obietnic o prywatności DEWAX GEO: właściciel narzędzia ich nie potwierdził.

## Co zostało do zrobienia (w tej kolejności)

1. **Scalić tę gałąź na `main`** (wdrożenie automatyczne). Potem sprawdzić na pompy.dewax.pl: zaakceptować
   cookies marketingowe, przejść kalkulator, wysłać testowe zapytanie. W Menedżerze zdarzeń Meta
   (zestaw danych „dewax.pl”, zakładka „Testuj zdarzenia”) muszą pojawić się `PageView`,
   `KalkulatorUkonczony`, `Lead`. Bez działającego piksela kampanii nie włączać.
2. **Cookiebot**: uruchomić ponowne skanowanie domeny, żeby cookie `_fbp` (Meta) pojawiło się
   w deklaracji cookies na stronie polityki prywatności.
3. **Ustawienia firmowe Meta**: zweryfikować domenę `dewax.pl` (Bezpieczeństwo marki, Domeny) i, jeśli
   kampania ma iść ze strony „Dewax gruntowe pompy ciepła”, udostępnić tę stronę firmie „Dewax”.
4. **Budżet, zestaw reklam, reklamy: zrobione 12.09.2026** za zgodą właściciela (budżet 60 zł/dzień,
   limit 2 000 zł, zestaw A, reklamy R1–R4, wszystko wstrzymane). Przed startem przejrzeć zestaw
   w Menedżerze reklam: ostrzeżenie o pikselu bez aktywności zniknie po wdrożeniu, strona nadawcy
   ma być właściwa.
5. **Włączyć kampanię: zrobione 12.09.2026** na polecenie właściciela, równolegle ze scaleniem gałęzi
   na `main`. Pierwsze 14 dni bez zmian (nauka algorytmu). Punkty 2–3 (test piksela, Cookiebot,
   weryfikacja domeny, strona nadawcy) pozostają do wykonania przez właściciela.

## Kreacje w koncie

Utworzone 12.09.2026 na koncie `1413741105666132` ze strony „Dewax gruntowe pompy ciepła”
(`105889812346061`). Obrazy Meta pobrała z publicznych adresów tej gałęzi (`reklamy/meta/*.jpg`)
i zapisała po swojej stronie, więc po scaleniu na `main` adresy źródłowe nie mają już znaczenia.

| Reklama | Id kreacji | Podgląd (kanał mobilny; link wymaga zalogowania do Facebooka i po pewnym czasie wygasa) |
|---|---|---|
| R1 Dzień wiercenia | `1118102437550084` | https://business.facebook.com/ads/api/preview_iframe.php?d=AQJe8yMTEBTntWv1wYU3PVx7Nr3VvBl0FoupUNaIxJ2gnj5Z49gFxzQgghy9eFvLBPuXioBKMGtr_MIElwpTqpSn8OP5-iuQi0CJut_cyO8WOldgg0Zqt9tXSBcNAhuOIgdaFsfehcKjlIjvGnBUUMRkMf4viLN9kZxTffib3fWLP3si2jA09HvfuKRk1qqEJH2dk6Sn__YewPRtSHhRS6LRBDB3_p0G6leqLZPXLcv8hA&t=AQLuk9U-jc1PXR-oCz0 |
| R2 Dom, który już stoi | `2495774117578323` | https://business.facebook.com/ads/api/preview_iframe.php?d=AQIGFrPOVlU8Y-w18aWsNxlExZzHndPjOwMuaamzVt-Czp_OVboDLs97CbGf_vbFQBJtSElclnnpDduVkIXRsJSALIzio_BQ6Geibh-xuFRw247RfWy19s_SPUEv5Bc1gY9Ad9cKd9RQKvZFJOtELbPsQ-DlX_dkgJpOAYKoqm--onNb-S9gE5JVDMrQxg1HKBvKyktJAQSgCPHnbjY3ry1q2ian2jkhuw-q_JcTrNqz-A&t=AQK17bQZ13BfWIM1m24 |
| R3 Kotłownia | `1603924627788594` | https://business.facebook.com/ads/api/preview_iframe.php?d=AQJ4F81afWapSHAfFlUtIhTWZRlxPxCvW7pPjMJjpUR3g9RHGNaN4XdiS2jIhnPfb1wYF4gWrd4PIhsjWNuNpnT6cHA17ub6kG-k7RJDPyrGmifhljLY0TvDg8Renk9CJfIeU1GdtquLQ-qXhUIE2Ww78aQH3s4UYNP0jrTV99a1dBujE33519iihs0ClMkXTKuOFmqfOwV-K0VAkdNfjwR8vJXcGTvaUs674lXH8fI7cQ&t=AQIHdNExoaigwzTim8M |
| R4 Karuzela „Zobacz, co dostajesz” | `1076299701657815` | https://business.facebook.com/ads/api/preview_iframe.php?d=AQIG4Dxqbu5QpG9j6YuswyA5zqyxdrQDTqF3ModZMgKchNwB_6EwO6DL7rtMtcM7xf_nXurOPzXGkdUwkHIpjIWEZP1rSWU51vg_WuDxlOkEJpmaQpQrZUTzqGKOYrxl58oO11HTvFt62zNlE-nfmHVhUQrq9Wf99jdZQM39EjWOqf78vH09JIVpyUXY3qgu30kZRmUKYu2DSYZMqMqjdldRrb_O4GnQzTHWbJ3n1Bqllg&t=AQI6vd49IzQzZvuTuI0 |

W Menedżerze reklam kreacje są w bibliotece pod nazwami „DEWAX pompy | R1…R4”. Przy tworzeniu reklamy
w zestawie wystarczy wybrać „Użyj istniejącej kreacji”. Deklaracja o treściach AI: obrazy to prawdziwe
zdjęcia bez obróbki generatywnej, więc właściciel może w razie pytania Meta zaznaczyć, że reklama nie
zawiera treści wygenerowanych przez AI (pole `self_ai_disclosure` zostało celowo niewypełnione).

## Plan prowadzenia

| Kiedy | Co sprawdzić | Decyzja |
|---|---|---|
| Dzień 3 | Czy reklamy przeszły weryfikację, czy piksel raportuje `PageView` z ruchu reklamowego | Jeśli odrzucone: poprawić tekst, nie obraz |
| Dzień 7 | Koszt na `KalkulatorUkonczony`, CTR (cel powyżej 1%), odsetek sesji z kalkulatorem w GA4 | Reklama z CTR poniżej 0,6% po 3 000 wyświetleń: wyłączyć |
| Dzień 14 | Liczba `Lead`, koszt na Lead, `phone_clicked` w GA4 | Poniżej 3 leadów: przełączyć optymalizację na `KalkulatorUkonczony` (zdarzenie własne) na 2 tygodnie, potem wrócić na Lead |
| Dzień 14 | Zasięg | Jeśli koszt na Lead jest stabilny, rozważyć osobny zestaw na Katowice, Kraków lub Szczecin (bez nakładania się na zestaw A) |
| Dzień 30 | Wynik całości: leady, oględziny, umowy z CRM (HubSpot) | Skalować budżet o maks. 20% tygodniowo, gdy koszt na Lead jest akceptowalny |

Wskaźniki, od których zależy sens kampanii, są po stronie firmy, nie Meta: ile z leadów kończy się
oględzinami i umową. Bez tej liczby koszt na Lead nic nie mówi.

## Oczekiwania (bez gwarancji)

Konto nie ma historii dla pomp, piksel startuje od zera, produkt kosztuje 90–120 tys. zł. Realistyczny
obraz pierwszego miesiąca: kilkadziesiąt ukończeń kalkulatora, kilka zapytań o wycenę. Kampania ma
zbudować sygnał w pikselu i sprawdzić, która obietnica (koszt, dom, który już stoi, kotłownia, dowód
z działki) działa na tym rynku. Skalowanie ma sens dopiero po pierwszych oględzinach z Meta.
