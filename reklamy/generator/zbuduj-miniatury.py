#!/usr/bin/env python3
"""Buduje reklamy/generator/miniatury.js: miniatury (220 px szerokości, JPEG, base64) zdjęć
z listy `zdjecia` w tresci.js. Panel pokazuje je w bibliotece i w podglądzie kreacji, żeby
dało się wybrać kadr bez otwierania repozytorium. Uruchomienie z katalogu głównego repozytorium:

    python3 reklamy/generator/zbuduj-miniatury.py

Wymaga Pillow (pip install pillow). Źródła: wyłącznie prawdziwe zdjęcia DEWAX z reklamy/meta,
zdjecia/ i img/ (ścieżki `plik` w tresci.js). Plik wynikowy jest generowany, nie edytować ręcznie.
"""
import base64
import io
import json
import re
import sys
from pathlib import Path

from PIL import Image

SZEROKOSC = 220
JAKOSC = 72

KATALOG = Path(__file__).resolve().parent
KORZEN = KATALOG.parent.parent
TRESCI = KATALOG / 'tresci.js'
WYNIK = KATALOG / 'miniatury.js'


def lista_zdjec() -> list[tuple[str, str]]:
    """Pary (id, plik) z bloku `zdjecia: [...]` w tresci.js; każdy wpis zajmuje jedną linię."""
    tekst = TRESCI.read_text(encoding='utf-8')
    blok = re.search(r'zdjecia:\s*\[(.*?)\n\s*\]', tekst, re.S)
    if not blok:
        sys.exit('tresci.js: nie znaleziono bloku zdjecia: [...]')
    pary = re.findall(r"\{\s*id:\s*'([^']+)'.*?plik:\s*'([^']+)'", blok.group(1))
    if not pary:
        sys.exit('tresci.js: blok zdjecia jest pusty')
    return pary


def miniatura(sciezka: Path) -> str:
    obraz = Image.open(sciezka)
    obraz = obraz.convert('RGB')
    if obraz.width > SZEROKOSC:
        wys = round(obraz.height * SZEROKOSC / obraz.width)
        obraz = obraz.resize((SZEROKOSC, wys), Image.LANCZOS)
    bufor = io.BytesIO()
    obraz.save(bufor, format='JPEG', quality=JAKOSC, optimize=True, progressive=False)
    return 'data:image/jpeg;base64,' + base64.b64encode(bufor.getvalue()).decode('ascii')


def main() -> None:
    wynik = {}
    for ident, plik in lista_zdjec():
        sciezka = KORZEN / plik
        if not sciezka.is_file():
            sys.exit(f'brak pliku {plik} (id {ident})')
        wynik[ident] = miniatura(sciezka)
        print(f'{ident:24} {plik:48} {len(wynik[ident]) // 1024:4d} KB')
    naglowek = ('/* Miniatury zdjęć DEWAX do panelu (220 px, wygenerowane z reklamy/meta, zdjecia/, img/). '
                'Nie edytować ręcznie: reklamy/generator/zbuduj-miniatury.py */\n')
    WYNIK.write_text(naglowek + 'window.DX_MINIATURY = ' + json.dumps(wynik, ensure_ascii=False) + ';\n', encoding='utf-8')
    print(f'zapisano {WYNIK.relative_to(KORZEN)}: {len(wynik)} miniatur, {WYNIK.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
