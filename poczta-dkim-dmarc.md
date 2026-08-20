# Poczta: DKIM i DMARC dla dewax.pl — instrukcja dla panelu nazwa.pl

Zadanie po wdrożeniu strony. Wynika z audytu bezpieczeństwa z 15.08.2026.

## Dlaczego to jest pilne

Stan zweryfikowany zapytaniami DNS na dwóch niezależnych resolwerach (8.8.8.8 i 1.1.1.1):

| Mechanizm | Stan | Skutek |
|---|---|---|
| SPF | `v=spf1 mx a ~all` — **jest**, ale w trybie miękkim | podszycie się jest wykrywane, ale wiadomość i tak zwykle trafia do skrzynki |
| DKIM | **brak** (przeskanowano 18 typowych selektorów) | brak kryptograficznego dowodu, że mail wyszedł od Was |
| DMARC | **brak** (`_dmarc.dewax.pl` bez rekordu) | odbiorca nie ma instrukcji, co zrobić z podróbką — i nie odrzuca jej |

Dwa realne skutki:

1. **Formularz ze strony może trafiać do spamu.** `wyslij.php` wysyła przez `mail()` z serwera
   85.128.139.207. SPF to przepuści (mechanizmy `a` i `mx` wskazują ten sam adres), ale Gmail
   przy braku DKIM i DMARC traktuje taką wiadomość nieufnie. Objaw wygląda jak awaria
   formularza, choć wdrożenie jest poprawne — dlatego przy testach **zawsze sprawdzaj folder spam**.
2. **Ktoś może wysłać maila jako `@dewax.pl`.** Przy sprzedaży pomp ciepła i wysyłaniu wycen
   to gotowy scenariusz oszustwa: klient dostaje „ponaglenie do zapłaty" z Waszego adresu
   ze zmienionym numerem konta. Dziś nic tego nie blokuje, i nie dowiecie się o tym,
   dopóki nie zadzwoni oszukany klient.

---

## Krok 1 — włączyć DKIM (panel nazwa.pl)

1. Panel nazwa.pl → **Poczta** → wybierz domenę `dewax.pl`
2. Szukaj sekcji **Konfiguracja DKIM** albo **Podpisywanie wiadomości**
3. Włącz podpisywanie i pozwól panelowi wygenerować klucz — nazwa.pl w większości pakietów
   dodaje rekord TXT do DNS automatycznie
4. Zanotuj **selektor**, który panel poda (często `default`, `nazwa`, `mail`)

**Weryfikacja — wykonać po ok. 30 minutach (propagacja DNS):**

Wyślij maila z `formularz@dewax.pl` na prywatny Gmail. Otwórz wiadomość →
menu trzech kropek → **Pokaż oryginał**. Powinno być:

```
SPF:   PASS
DKIM:  PASS
```

Jeśli DKIM nadal pokazuje `neutral` albo go nie ma — podpisywanie nie zostało włączone
albo klucz jeszcze się nie rozpropagował. Jeśli w pakiecie hostingowym nie ma opcji DKIM,
trzeba napisać do wsparcia nazwa.pl z prośbą o włączenie.

---

## Krok 2 — DMARC w trybie obserwacji (bezpieczne, wdrożyć od razu)

Ten rekord **niczego nie blokuje** — wyłącznie zbiera raporty. Można go dodać nawet
przed uruchomieniem DKIM.

Panel nazwa.pl → **Domeny** → `dewax.pl` → **Konfiguracja DNS** → dodaj rekord:

```
Typ:     TXT
Nazwa:   _dmarc
Wartość: v=DMARC1; p=none; rua=mailto:dmarc@dewax.pl; ruf=mailto:dmarc@dewax.pl; fo=1; adkim=r; aspf=r; pct=100
TTL:     3600
```

Wymaga skrzynki **`dmarc@dewax.pl`** — trzeba ją założyć, bo inaczej raporty przepadną.
Będą to codzienne wiadomości XML od Gmaila, Microsoftu i innych operatorów.

**Weryfikacja:**

```bash
dig +short TXT _dmarc.dewax.pl
```

Powinno zwrócić dodany rekord. Dziś to zapytanie nie zwraca nic.

---

## Krok 3 — zaostrzenie (po 2–4 tygodniach zbierania raportów)

Dopiero gdy z raportów widać, że **cała** legalna poczta przechodzi — firmowa, z formularza,
z systemu księgowego, z newslettera, z CRM-u:

```
v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@dewax.pl; fo=1
```

Potem stopniowo `pct=50` → `pct=100`, a docelowo:

```
v=DMARC1; p=reject; rua=mailto:dmarc@dewax.pl; fo=1
```

---

## Krok 4 — SPF na twardo (na samym końcu)

Dopiero po osiągnięciu `p=reject` i potwierdzeniu, że nic nie ginie:

```
v=spf1 mx a -all
```

> ⚠️ **Kolejność jest obowiązkowa.** Zmiana `~all` → `-all` przed analizą raportów DMARC
> to najczęstsza przyczyna utraty poczty firmowej — faktury wysyłane przez zewnętrzny system
> księgowy nagle przestają docierać i nikt nie wie dlaczego. Nie skracać tej ścieżki.

---

## Przy okazji — dwa wpisy DNS do uprzątnięcia

Wyszły przy audycie, nie są pilne, ale warto:

- **`_domainkey.dewax.pl` ma rekord TXT o treści `"dnssec nsec record"`** — to zwykły tekst,
  nie mechanizm DNSSEC. Pozostałość po błędnej konfiguracji; zaciemnia diagnostykę DKIM.
- **Wildcard `*.dewax.pl` → 85.128.139.207** — dowolna zmyślona subdomena rozwiązuje się
  na Wasz serwer, np. `platnosc-faktura.dewax.pl`. Ułatwia phishing pod Waszą marką.
  Lepiej zadeklarować wyłącznie używane nazwy: `@`, `www`, `pompy`, `www.pompy`, `mail`,
  `smtp`, `poczta`.

## Na plus

Rekordy **CAA są skonfigurowane poprawnie** (`letsencrypt.org` i `certum.pl`, również
warianty `issuewild`). Ogranicza to ryzyko, że ktoś wystawi certyfikat dla Waszej domeny
w innym urzędzie certyfikacji. Zachować przy ewentualnej zmianie dostawcy.
