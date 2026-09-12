# reklama/google-ads: pliki kampanii Google Ads

Plan i instrukcja obsługi: `docs/GOOGLE-ADS.md`. Ten katalog nie jest wdrażany na serwer.

| Plik | Co to |
|---|---|
| `kampania.py` | jedno źródło prawdy: kampanie, budżety, grupy, słowa kluczowe, wykluczenia, teksty reklam, linki, objaśnienia, rozszerzenie usług, telefon, województwa, okręgi zapasowe |
| `narzedzia.py` | `kontrola` (limity znaków i zasady Google Ads) i `eksport` (pliki CSV do Google Ads Editor + `kampania.json`) |
| `kampania.json` | ta sama struktura w JSON, do wgrania przez API |
| `import/01…09-*.csv` | pliki do Google Ads Editor, UTF-8 |
| `generuj-obrazy.py` | tworzy obrazy do zasobów graficznych z prawdziwych zdjęć DEWAX (Pillow) |
| `obrazy/` | 15 zdjęć w trzech proporcjach + logo w dwóch formatach |

## Praca z tekstami

```bash
python3 reklama/google-ads/narzedzia.py kontrola   # sprawdza limity: nagłówek 30, opis 90, link 25, opis linku 35, objaśnienie 25
python3 reklama/google-ads/narzedzia.py eksport    # zapisuje import/*.csv i kampania.json (odmawia przy błędach)
```

Zmieniasz teksty albo słowa kluczowe wyłącznie w `kampania.py`. Nagłówki wspólne (`H_WSPOLNE`)
są używane w wielu grupach, żeby każda reklama miała 15 nagłówków.

## Import do Google Ads Editor

1. Zainstaluj Google Ads Editor, pobierz konto 120-637-0043.
2. Konto → Importuj → Z pliku. Wgrywaj pliki w kolejności numerów: `01-kampanie.csv`, `02-grupy.csv`,
   `03-slowa-kluczowe.csv`, `04-wykluczenia.csv`, `05-reklamy-rsa.csv`, `06-linki.csv`,
   `07-objasnienia.csv`, `08-rozszerzenia-uslugi.csv`, `09-polaczenia.csv`.
3. Editor pokaże dopasowanie kolumn. Nazwy są angielskie (Campaign, Ad Group, Keyword, Criterion Type,
   Headline 1…15, Description 1…4, Final URL, Path 1, Path 2). Kolumna „Grupa wykluczeń” w pliku 04
   jest tylko informacyjna, można ją pominąć.
4. W pliku 01 kolumna „Location” zawiera angielskie nazwy województw (tak nazywa je Google).
   Jeśli Editor ich nie dopasuje, ustaw lokalizacje ręcznie: 6 województw, opcja „Obecność”.
   Sieci: tylko wyszukiwarka Google, bez partnerów, bez sieci reklamowej. Język: polski.
5. Sprawdź, czy kampanie są „Wstrzymane”, i opublikuj. Włączenie to osobna decyzja
   (po ustawieniu konwersji i sprawdzeniu płatności, patrz `docs/GOOGLE-ADS.md`, punkt 9).

Jeśli diakrytyki wyglądają źle w Excelu, otwórz plik w Google Sheets albo w Editorze bezpośrednio;
pliki są w UTF-8 bez BOM.

## Obrazy

```bash
pip install pillow
python3 reklama/google-ads/generuj-obrazy.py
```

Wymagania Google Ads dla obrazów w kampaniach w wyszukiwarce: poziomy 1,91:1 (min. 600×314,
zalecane 1200×628), kwadrat 1:1 (min. 300×300, zalecane 1200×1200), pionowy 4:5 (min. 480×600,
zalecane 960×1200), do 5 MB, JPG/PNG. Logo: kwadrat min. 128×128, poziome 4:1 min. 512×128.
Skrypt nie powiększa zdjęć więcej niż o 10 %, więc część plików jest mniejsza niż zalecane
1200 px, ale wyżej niż minimum. Lepsze logo wymaga pliku wektorowego (SVG/PDF) od właściciela.

Nieużywane celowo: `img/diag.webp` (render), `img/glowica.webp` (materiał producenta),
`zdjecia/91.jpg` i `92.jpg` (pochodzenie do potwierdzenia, `CONTENT_NEEDED.md` pkt 4.13).
