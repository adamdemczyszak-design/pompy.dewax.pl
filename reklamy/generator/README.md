# Generator kreacji Meta: `reklamy/generator`

Panel wewnętrzny DEWAX. Składa 180 gotowych kreacji reklamowych (10 hooków × 6 korzyści × 3 CTA)
z bloków napisanych w rejestrze reklam R1–R4, prowadzi kolejkę do Meta (najwyżej 8 kreacji naraz)
i pokazuje tabelę wyników: ile kreacji w bibliotece, ile w Meta, ile leadów z każdej, koszt zapytania.
Statyczne pliki bez kroku budowania, ten sam stos co kreator ofertowy. Nic nie jest wymyślone:
każdy blok ma podane źródło (zakładka „Źródła i zasady”).

## Gdzie działa

- **Netlify**, projekt `dewax-generator` (https://dewax-generator.netlify.app), ten sam zespół co
  `dewax-kreator`. Projekt jest założony, ale pusty: trzeba go raz połączyć z repozytorium.
  Netlify → `dewax-generator` → Site configuration → Build & deploy → Continuous deployment →
  Link repository → `adamdemczyszak-design/pompy.dewax.pl`, gałąź `main`, **Base directory
  `reklamy/generator`**. Katalog publikacji i brak polecenia budowania są w `netlify.toml`.
  Od tej pory każde scalenie na `main` odświeża panel. Pakiet wdrożenia na nazwa.pl
  (`wdrozenie.yml`) panelu nie zawiera i ma nie zawierać.
- **Lokalnie**: `npm start` w katalogu głównym i adres `http://localhost:8787/reklamy/generator/`.
- **Kod dostępu**: `dobrzyca` (stała `KOD_DOSTEPU` w `generator.js`, tak jak w kreatorze). To bariera
  przed przypadkowym wejściem, nie ochrona danych: w panelu nie ma danych klientów.

## Pliki

| Plik | Co to |
|---|---|
| `index.html` | układ panelu: brama z kodem, nagłówek ze statystykami, zakładki Biblioteka, Kolejka do Meta, Wyniki, Źródła i zasady |
| `generator.css` | style w tokenach DEWAX (Archivo, IBM Plex Sans, granat `#000050`, niebieski `#2F6D9E`), tryb jasny i ciemny |
| `generator.js` | logika: składanie kreacji, lint tonu, statusy, kolejka z limitem 8, podgląd z kopiowaniem pól, eksport i import stanu, tabela wyników |
| `tresci.js` | macierz treści `window.DX_TRESCI`: hooki `h01`–`h10`, korzyści `b1`–`b6`, CTA `c1`–`c3`, lista zdjęć, zasady tonu, teksty wzorcowe R1–R4 |
| `miniatury.js` | miniatury 11 zdjęć (base64, 220 px), plik generowany |
| `zbuduj-miniatury.py` | odbudowa `miniatury.js` po zmianie listy zdjęć w `tresci.js` (Pillow): `python3 reklamy/generator/zbuduj-miniatury.py` |
| `wyniki.json` | wyniki kreacji (wyświetlenia, kliknięcia, wydatki, leady), aktualizowane na polecenie |
| `lint.mjs` | `node reklamy/generator/lint.mjs`: sprawdza ton wszystkich 180 złożeń (zakazane słowa i znaki, długość zdań, limity pól Meta) |
| `netlify.toml` | ustawienia projektu Netlify: publikacja z tego katalogu, nagłówki `noindex`, `wyniki.json` bez cache |

## Jak powstaje kreacja

- Kod kreacji: `hook-korzyść-CTA`, np. `h03-b2-c1`. Po tym kodzie kreację widać w nazwie reklamy,
  w `utm_content` adresu i w zgłoszeniu z formularza.
- Tekst główny: hook, pusty wiersz, korzyść, pusty wiersz, CTA. Nagłówek z bloku CTA (do 40 znaków),
  opis z bloku korzyści (do 30 znaków, jak pole „Opis” w Meta).
- Zdjęcie: z hooka dla typów „zdjęcie z placu” i „historia”, w pozostałych z korzyści. Wyłącznie
  prawdziwe zdjęcia DEWAX z `reklamy/meta`, `zdjecia/`, `img/`; panel pokazuje miniaturę i ścieżkę
  pliku, obraz do Meta wgrywa się z repozytorium.
- Adres: `https://pompy.dewax.pl/?utm_source=facebook&utm_medium=paid_social&utm_campaign=pompy-leady-2026-09&utm_content=KOD`,
  CTA „sprawdź działkę” dodaje `#geo`.
- Nazwa reklamy w Meta: `KOD | nazwa hooka | nazwa korzyści`. Wpisana dokładnie tak pozwala
  przypisać wydatki z Meta do kreacji.
- Ton: krótkie zdania, konkret, spokój, bez wykrzykników, bez pauz (tylko dywiz), bez słów z listy
  zakazanych w `tresci.js` (`zasady`). Lint działa w panelu (znacznik „lint” przy kreacji) i w `lint.mjs`.

## Obieg pracy

1. **Biblioteka**: filtry po hooku, korzyści, CTA, statusie i tekście; „Podgląd” pokazuje komplet pól
   z przyciskami „Kopiuj”. „Do kolejki” przenosi kreację do kolejki. Kreacje ze znacznikiem
   „do potwierdzenia” (`h04` stawka 130–145 zł/m, `h07` termin Moje Ciepło, `b5` chłodzenie pasywne)
   wysyłać dopiero po potwierdzeniu właściciela.
2. **Kolejka do Meta**: „Kopiuj komplet” daje wszystkie kreacje z Meta i kolejki w jednym tekście
   (nazwa, zdjęcie, tekst, nagłówek, opis, przycisk, adres). W Menedżerze reklam: nowa reklama
   w zestawie A `120248421938940027`, wklejone pola, obraz z repozytorium, przycisk „Więcej informacji”.
   Panel sam nie zakłada reklam w Meta: kampanii nie rusza się bez zgody właściciela. Na wyraźne
   polecenie z kodem kreacji Claude może założyć reklamę przez Windsor.ai.
3. Po założeniu reklamy: „Oznacz: wysłana do Meta” i wpisany ID reklamy. Limit 8 w Meta: przy
   budżecie kilkudziesięciu złotych dziennie więcej kreacji nie zebrałoby danych. „Zatrzymaj” po
   wyłączeniu reklamy w Meta zwalnia miejsce dla następnej z kolejki.
4. Stan panelu (statusy, ID reklam, notatki, filtry) siedzi w `localStorage` przeglądarki. Przed
   zmianą komputera: „Zapisz stan do pliku”, potem „Wczytaj stan z pliku”.

## Wyniki i koszt zapytania

Zakładka „Wyniki” czyta `wyniki.json`. Leady liczone są z HubSpota: kod śledzący HubSpot na stronie zbiera
zgłoszenia z formularza wyceny (po zgodzie marketingowej) i zapisuje kontaktowi pierwszy adres wejścia
z `utm_content=KOD`. Wydatki, wyświetlenia i kliknięcia pochodzą z Meta (Windsor.ai, konto
`955522616312255`) po nazwie i identyfikatorze reklamy. Koszt zapytania = wydatki ÷ leady. Bez dodatkowych
połączeń.

Aktualizacja na polecenie „zaktualizuj wyniki generatora”:

1. HubSpot: kontakty utworzone od startu kampanii (12.09.2026), których `hs_analytics_first_url` zawiera
   `utm_content=` (narzędzie `search_crm_objects`, filtr `createdate` od daty startu). Kod kreacji z tego
   adresu grupuje kontakty; `hsa_ad` w tym samym adresie wskazuje reklamę w Meta.
2. Meta przez Windsor.ai (konektor `facebook`): `spend`, `impressions`, `clicks`, `link_clicks` per `ad_id`
   i `ad_name` od daty startu, filtr `campaign_id`.
3. Zapis do `wyniki.json` i scalenie na `main`. Format:

```json
{
  "aktualizacja": "2026-09-13",
  "zrodlo": "HubSpot (utm_content w pierwszym adresie wejścia kontaktu) + Windsor.ai (Meta Ads, konto 955522616312255)",
  "kreacje": { "R3": { "nazwa": "R3 Kotłownia (utm_content=kotlownia)", "wyswietlenia": 0, "klikniecia": 0, "wydatki": 0, "leady": 0 } }
}
```

Reklamy R1–R4 z 12.09.2026 mają klucze `R1`–`R4` i `utm_content` równe `dzien-wiercenia`,
`dom-ktory-juz-stoi`, `kotlownia`, `karuzela`. Kreacje z generatora mają klucz równy kodowi (`h03-b2-c1`).

## Lead do HubSpota: jak to działa i jak sprawdzić

Osobnego połączenia nie ma. Wystarczają dwie rzeczy, które już są w HubSpocie:

- **Kod śledzący HubSpot** (`js.hs-scripts.com/49004516.js`, w bloku zgody każdej strony, kategoria
  marketing) zbiera zgłoszenie z formularza wyceny jako „non-HubSpot form”. W HubSpocie to zdarzenie
  „Gruntowa pompa ciepła z odwiertem… | DEWAX Dobrzyca: .zap”. Kontakt dostaje pierwszy adres wejścia
  z parametrami `utm_*` i `hsa_*` oraz źródło „Paid social”.
- **Integracja HubSpot z Facebookiem** dokleja do adresów reklam parametry `hsa_*` i przypisuje kontakt
  do reklamy (HubSpot → Marketing → Ads). Formularze Lead Ads wewnątrz Facebooka trafiają do HubSpota
  tą samą integracją.

Ograniczenie: kod HubSpota ładuje się dopiero po zgodzie na cookies marketingowe. Kto odrzuci cookies,
wysyła formularz, mail dochodzi na `sprzedaz@dewax.pl` (z wierszem „Kreacja”), ale kontakt w HubSpocie
nie powstaje. Wielkość tej luki: `CONTENT_NEEDED.md`, punkt 10.8. Gdyby była duża, domknięcie bez Make
i bez sekretu: `wyslij.php` wysyła zgłoszenie do formularza HubSpot przez Forms API po stronie serwera.

Jak sprawdzić, że lead wpadł:

1. Wejdź na `https://pompy.dewax.pl/?utm_source=facebook&utm_medium=paid_social&utm_campaign=test&utm_content=h01-b2-c3`,
   zaakceptuj cookies marketingowe i wyślij formularz wyceny ze swoim e-mailem.
2. Mail na `sprzedaz@dewax.pl` ma wiersze `Źródło: facebook / paid_social`, `Kampania: test`, `Kreacja: h01-b2-c3`.
3. HubSpot → Kontakty → wyszukaj swój e-mail: w osi czasu jest „Form submission” z formularza `.zap`,
   we właściwościach „Original source” = Paid social, a pierwszy adres wejścia zawiera `utm_content=h01-b2-c3`.
4. Gdy kontaktu nie ma: najczęściej cookies zostały odrzucone. Sprawdź też w HubSpocie, czy zbieranie
   formularzy spoza HubSpota jest włączone (Settings → Marketing → Forms → „Collect data from website forms”).
