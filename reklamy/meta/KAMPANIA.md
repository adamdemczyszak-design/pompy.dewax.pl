# Kampania Meta Ads: pompy.dewax.pl

Stan na 12 września 2026. Kampania przygotowana do akceptacji właściciela. Nic nie wydaje pieniędzy,
dopóki właściciel nie ustawi budżetu i nie włączy kampanii w Menedżerze reklam.

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
| Kampania | `120249004354710355` „DEWAX pompy \| Leady \| Kalkulator kosztu \| 2026-09” | Cel: kontakty (OUTCOME_LEADS), aukcja, **PAUSED, bez budżetu**. Budżet, zestawy reklam i reklamy wymagają zgody właściciela (patrz „Co zostało do zrobienia”) |

Obserwacja przy okazji: istniejąca kampania Multilan „Nowa kampania z celem Kontakty” optymalizuje na
konwersję niestandardową „kontakt dewax.pl” z tego samego piksela. Skoro piksel nigdy nie odpalił,
ta kampania od czerwca nie dostaje żadnego sygnału konwersji (300 zł wydane, 808 kliknięć, 0 wyników).
Piksel trzeba wpiąć także w dewax.pl (WordPress), inaczej optymalizacja tam nie ma na czym się uczyć.

## Struktura kampanii

```
Kampania: DEWAX pompy | Leady | Kalkulator kosztu | 2026-09
  cel OUTCOME_LEADS, aukcja, budżet kampanii (CBO) 60 zł/dzień, limit wydatków 2 000 zł,
  strategia stawek: najniższy koszt bez limitu
  ├── Zestaw A: Rdzeń 70 km od Dobrzycy
  │     lokalizacja: promień 70 km od Dobrzycy (51,868 N, 17,618 E), osoby mieszkające tam lub ostatnio tam przebywające
  │     wiek 30–65 (jako sugestia dla Advantage+ audience), obie płcie, bez zainteresowań (szerokie)
  │     umiejscowienia: automatyczne (Advantage+), witryna jako miejsce docelowe
  │     optymalizacja: konwersje w witrynie, zdarzenie Lead z piksela 1032857169399673
  │     rozliczenie: wyświetlenia, okno atrybucji domyślne (7 dni klik, 1 dzień wyświetlenie)
  │     DSA: beneficjent i płatnik DEWAX Sp. z o.o.
  │     reklamy: 1, 2, 3, 4 (niżej)
  └── Zestaw B: Dalsze regiony (opcjonalny, do włączenia po 2 tygodniach zestawu A)
        lokalizacje bez nakładania się na zestaw A: Łódź 45 km, Wrocław 35 km, Bydgoszcz 50 km,
        Toruń 40 km, Katowice 50 km, Warszawa 50 km
        reszta jak w zestawie A; reklamy 1 i 4
```

Dlaczego tak:

- **Cel „kontakty” i optymalizacja na Lead**, a nie ruch. Ruch daje tanie kliknięcia od osób, które
  nie kupią systemu za 90–120 tys. zł. Lead z formularza to sygnał jakości. Na starcie piksel nie ma
  historii, więc pierwsze 2–3 tygodnie to nauka algorytmu; to normalne.
- **Szeroko, bez zainteresowań.** Meta nie ma dobrego segmentu „buduje dom w Wielkopolsce”. Lepiej dać
  algorytmowi sygnał z piksela (kalkulator, Lead) niż zgadywać zainteresowania.
- **Promień 70 km, nie cała Polska.** Strategia z 15.08: Pleszew, Jarocin, Krotoszyn, Kalisz, Ostrów
  są nieobsadzone, Poznań jest najdroższy. 70 km sięga południowych przedmieść Poznania, nie centrum.
  Zestaw B dokłada miasta z województw, dla których strona ma podstrony `gdzie-dzialamy/`.
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
4. **Budżet, zestawy reklam, reklamy.** Integracja zablokowała tworzenie obiektów z budżetem bez zgody
   właściciela. Do wyboru: (a) właściciel pozwala Claude dokończyć (zestawy A i B, reklamy 1–4 według
   tego pliku, wszystko wstrzymane), albo (b) właściciel klika sam w Menedżerze reklam:
   kampania `120249004354710355`, budżet kampanii 60 zł/dzień, limit wydatków 2 000 zł, zestaw A
   według tabeli wyżej, reklamy z kreacji wymienionych w sekcji „Kreacje w koncie”.
5. **Włączyć kampanię** dopiero po punkcie 1. Pierwsze 14 dni bez zmian (nauka algorytmu).

## Kreacje w koncie

Uzupełniane po wgraniu obrazów do biblioteki konta i utworzeniu kreacji (id, podglądy).

## Plan prowadzenia

| Kiedy | Co sprawdzić | Decyzja |
|---|---|---|
| Dzień 3 | Czy reklamy przeszły weryfikację, czy piksel raportuje `PageView` z ruchu reklamowego | Jeśli odrzucone: poprawić tekst, nie obraz |
| Dzień 7 | Koszt na `KalkulatorUkonczony`, CTR (cel powyżej 1%), odsetek sesji z kalkulatorem w GA4 | Reklama z CTR poniżej 0,6% po 3 000 wyświetleń: wyłączyć |
| Dzień 14 | Liczba `Lead`, koszt na Lead, `phone_clicked` w GA4 | Poniżej 3 leadów: przełączyć optymalizację na `KalkulatorUkonczony` (zdarzenie własne) na 2 tygodnie, potem wrócić na Lead |
| Dzień 14 | Zestaw B | Włączyć, jeśli zestaw A ma stabilny koszt na Lead |
| Dzień 30 | Wynik całości: leady, oględziny, umowy z CRM (HubSpot) | Skalować budżet o maks. 20% tygodniowo, gdy koszt na Lead jest akceptowalny |

Wskaźniki, od których zależy sens kampanii, są po stronie firmy, nie Meta: ile z leadów kończy się
oględzinami i umową. Bez tej liczby koszt na Lead nic nie mówi.

## Oczekiwania (bez gwarancji)

Konto nie ma historii dla pomp, piksel startuje od zera, produkt kosztuje 90–120 tys. zł. Realistyczny
obraz pierwszego miesiąca: kilkadziesiąt ukończeń kalkulatora, kilka zapytań o wycenę. Kampania ma
zbudować sygnał w pikselu i sprawdzić, która obietnica (koszt, dom, który już stoi, kotłownia, dowód
z działki) działa na tym rynku. Skalowanie ma sens dopiero po pierwszych oględzinach z Meta.
