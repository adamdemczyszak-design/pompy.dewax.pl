# Jak zacząć w Claude Code

## 1. Rozpakuj

Wypakuj `dewax.zip` do `C:\Users\Adam\dewax`. W folderze mają być `index.html`, `CLAUDE.md` i reszta.

## 2. Otwórz jako projekt

W aplikacji Claude przełącz się na zakładkę **Code** i dodaj folder `dewax`. Claude sam przeczyta `CLAUDE.md` przy starcie — to plik z całym kontekstem projektu, nie musisz nic streszczać.

## 3. Zainstaluj impeccable

W terminalu, w folderze projektu:

```
npx impeccable install
```

Wybierz instalację **project**, nie global — skill zostanie w `.claude` tego folderu i nie będzie się mieszał do innych rzeczy.

Potem doinstaluj parsery, bez których detektor działa w trybie okrojonym i zaniża wyniki:

```
npm i htmlparser2 css-select css-tree domutils
```

Zamknij i otwórz projekt jeszcze raz — skille wczytują się przy starcie.

**Nie przełączaj się na „Bypass permissions".** To skill z zewnętrznego repozytorium, który wykonuje polecenia w Twoim folderze. Potwierdzanie akcji przy takim narzędziu jest sensownym zabezpieczeniem, nie utrudnieniem.

## 4. Sprawdź, czy działa

```
node .claude/skills/impeccable/scripts/detect.mjs index.html
```

Powinno pokazać 9 ostrzeżeń o interlinii. Jeśli raport zaczyna się od `DEGRADED`, parsery nie doszły — powtórz `npm i` w katalogu skilla.

## 5. Pierwsze polecenia

```
/impeccable init
/impeccable critique index.html
```

`critique` uruchamia dwie niezależne oceny i podsumowuje je. `polish` wprowadza poprawki w pliku, `audit` sprawdza dostępność.

Pamiętaj o jednym: **impeccable poprawia wygląd, nie dopisze brakujących danych.** Siedemnaście miejsc oznaczonych `[BRAK DANYCH]` zostanie do uzupełnienia ręcznie.

---

## Od czego zacząć merytorycznie

Nie od wyglądu. Prototyp jest wizualnie w porządku — przeszedł już z 62 problemów do 9.

Zacznij od trzech liczb, bez których ta strona przegra z każdą konkurencją, która je podaje:

1. **Ile bierzecie za metr odwiertu** — z sondą i bez, netto czy brutto, jaki VAT
2. **Jedna realizacja z odczytem licznika** — miejscowość, metraż, odwierty, moc, zużycie w kWh po pełnym sezonie
3. **Kto płaci, gdy trzeba wiercić głębiej, niż zakładała umowa**

Gdy je masz, powiedz Claude'owi:

```
Uzupełnij [BRAK DANYCH] w index.html i konfigurator.html.
Stawka za metr to X zł. Realizacja: ...
```

Reszta listy braków jest na końcu `tresci/strategia.md`.

## Co zrobić z żywą stroną równolegle

Te trzy rzeczy nie czekają na przebudowę:

- wyciąć `<iframe>` do `old.a-pic.pl` z podstrony `/kalkulator`
- poprawić „29 450 zł" na „21 000 zł" na podstronie Dotacje
- wgrać zdjęcia z folderu `zdjecia/` do `/pompy/webroot/uploads/galleries/big/` — nazwy plików pasują do rekordów w bazie, więc podmienią się w miejscu bez ruszania galerii

Kopia poprzednich zdjęć leży w `zdjecia/kopia-starych/`, gdybyś chciał się cofnąć.
