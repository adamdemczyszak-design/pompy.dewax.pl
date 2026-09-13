#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Narzędzia kampanii Google Ads: kontrola zasad i eksport do Google Ads Editor.

  python3 reklama/google-ads/narzedzia.py kontrola   # długości, wykrzykniki, pauzy, telefony, duplikaty
  python3 reklama/google-ads/narzedzia.py eksport    # pliki CSV w reklama/google-ads/import/ + kampania.json
"""
import csv, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kampania as K

TU = os.path.dirname(os.path.abspath(__file__))
IMPORT = os.path.join(TU, 'import')
LIMITY = {'naglowek': 30, 'opis': 90, 'sciezka': 15, 'link': 25, 'link_opis': 35, 'objasnienie': 25, 'snippet': 25, 'slowo': 80}

def dl(s):
    return len(s)

def kontrola():
    bledy = []
    def spr(rodzaj, tekst, gdzie):
        lim = LIMITY[rodzaj]
        if dl(tekst) > lim: bledy.append(f'{gdzie}: {rodzaj} ma {dl(tekst)} > {lim} znaków: „{tekst}”')
        if '—' in tekst: bledy.append(f'{gdzie}: pauza „—” w „{tekst}”')
        if rodzaj == 'naglowek' and '!' in tekst: bledy.append(f'{gdzie}: wykrzyknik w nagłówku „{tekst}”')
        if rodzaj == 'opis' and tekst.count('!') > 1: bledy.append(f'{gdzie}: więcej niż jeden wykrzyknik w opisie „{tekst}”')
        if re.search(r'\d{2}\s?\d{3}\s?\d{2}\s?\d{2}', tekst) and rodzaj in ('naglowek', 'opis'): bledy.append(f'{gdzie}: numer telefonu w treści „{tekst}”')
        if re.search(r'[A-ZĄĆĘŁŃÓŚŹŻ]{4,}', tekst) and 'DEWAX' not in tekst and 'VAT' not in tekst and 'PIG-PIB' not in tekst and 'COP' not in tekst and 'EER' not in tekst and 'SPF' not in tekst and 'VDI' not in tekst and 'DC' not in tekst:
            bledy.append(f'{gdzie}: wielkie litery „{tekst}”')
    for c in K.KAMPANIE:
        for g in c['grupy']:
            gdzie = f'{c["nazwa"]} / {g["nazwa"]}'
            if not (3 <= len(g['naglowki']) <= 15): bledy.append(f'{gdzie}: liczba nagłówków {len(g["naglowki"])}')
            if not (2 <= len(g['opisy']) <= 4): bledy.append(f'{gdzie}: liczba opisów {len(g["opisy"])}')
            if len(set(g['naglowki'])) != len(g['naglowki']): bledy.append(f'{gdzie}: powtórzony nagłówek')
            if len(set(g['opisy'])) != len(g['opisy']): bledy.append(f'{gdzie}: powtórzony opis')
            for h in g['naglowki']: spr('naglowek', h, gdzie)
            for o in g['opisy']: spr('opis', o, gdzie)
            for s in g['sciezki']:
                spr('sciezka', s, gdzie)
                if not re.fullmatch(r'[a-z0-9-]+', s): bledy.append(f'{gdzie}: ścieżka z niedozwolonymi znakami „{s}”')
            for s in g['exact'] + g['phrase']:
                spr('slowo', s, gdzie)
                if len(s.split()) > 10: bledy.append(f'{gdzie}: słowo kluczowe ponad 10 wyrazów „{s}”')
            if len(set(g['phrase'])) != len(g['phrase']): bledy.append(f'{gdzie}: powtórzone słowo kluczowe (phrase)')
            if len(set(g['exact'])) != len(g['exact']): bledy.append(f'{gdzie}: powtórzone słowo kluczowe (exact)')
            if not g['url'].startswith('https://pompy.dewax.pl/'): bledy.append(f'{gdzie}: adres poza domeną {g["url"]}')
    # słowa kluczowe nie mogą się powtarzać między grupami tej samej kampanii (kanibalizacja)
    for c in K.KAMPANIE:
        widziane = {}
        for g in c['grupy']:
            for s in g['phrase']:
                if s in widziane: bledy.append(f'{c["nazwa"]}: „{s}” w grupach {widziane[s]} i {g["nazwa"]}')
                widziane[s] = g['nazwa']
    for (t, u, d1, d2) in K.LINKI:
        spr('link', t, 'link'); spr('link_opis', d1, 'link ' + t); spr('link_opis', d2, 'link ' + t)
    for o in K.OBJASNIENIA: spr('objasnienie', o, 'objaśnienie')
    for v in K.ROZSZERZENIE_USLUGI[1]: spr('snippet', v, 'rozszerzenie')
    if not (3 <= len(K.ROZSZERZENIE_USLUGI[1]) <= 10): bledy.append('rozszerzenie: 3 do 10 wartości')
    # wykluczenia nie mogą blokować własnych słów kluczowych
    wykl = [w for lst in K.WYKLUCZENIA_WSPOLNE.values() for w in lst]
    for c in K.KAMPANIE:
        for g in c['grupy']:
            for s in g['exact'] + g['phrase']:
                for w in wykl + c.get('wykluczenia_kampanii_dodatkowe', []) + g.get('wykluczenia_grupy', []):
                    if re.search(r'(^|\s)' + re.escape(w) + r'(\s|$)', s):
                        bledy.append(f'{c["nazwa"]} / {g["nazwa"]}: wykluczenie „{w}” blokuje słowo „{s}”')
    return bledy

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('ł', 'l').replace('ą', 'a').replace('ę', 'e').replace('ó', 'o').replace('ś', 's').replace('ż', 'z').replace('ź', 'z').replace('ć', 'c').replace('ń', 'n')).strip('-')

def geo_ids():
    """Identyfikatory geo z pliku geotargets.csv Google (jeśli leży obok). Zwraca {województwo: id} albo {}."""
    p = os.path.join(TU, 'geotargets.csv')
    if not os.path.exists(p): return {}
    out = {}
    with open(p, encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row.get('Country Code') == 'PL' and row.get('Target Type') in ('Region', 'Province', 'State', 'Voivodeship'):
                for w, en in K.GEO_NAZWY_EN.items():
                    if row.get('Name') == en: out[w] = row['Criteria ID']
    return out

def eksport():
    os.makedirs(IMPORT, exist_ok=True)
    def zapisz(nazwa, kolumny, wiersze):
        p = os.path.join(IMPORT, nazwa)
        with open(p, 'w', encoding='utf-8', newline='') as f:
            w = csv.DictWriter(f, fieldnames=kolumny, extrasaction='ignore')
            w.writeheader(); w.writerows(wiersze)
        print(f'{os.path.relpath(p)}: {len(wiersze)} wierszy')
    lokalizacje = '; '.join(K.GEO_NAZWY_EN[w] for w in K.WOJEWODZTWA)
    zapisz('01-kampanie.csv', ['Campaign', 'Campaign Type', 'Campaign Status', 'Budget', 'Budget type', 'Bid Strategy Type', 'Networks', 'Languages', 'Location', 'Final URL suffix'],
           [{'Campaign': c['nazwa'], 'Campaign Type': 'Search', 'Campaign Status': 'Paused', 'Budget': c['budzet_dzienny'], 'Budget type': 'Daily',
             'Bid Strategy Type': 'Maximize clicks', 'Networks': 'Google search', 'Languages': 'pl', 'Location': lokalizacje,
             'Final URL suffix': K.SUFIKS.replace('{kampania}', c['id'])} for c in K.KAMPANIE])
    zapisz('02-grupy.csv', ['Campaign', 'Ad Group', 'Ad Group Type', 'Ad Group Status'],
           [{'Campaign': c['nazwa'], 'Ad Group': g['nazwa'], 'Ad Group Type': 'Standard', 'Ad Group Status': 'Enabled'} for c in K.KAMPANIE for g in c['grupy']])
    slowa = []
    for c in K.KAMPANIE:
        for g in c['grupy']:
            slowa += [{'Campaign': c['nazwa'], 'Ad Group': g['nazwa'], 'Keyword': s, 'Criterion Type': 'Exact', 'Status': 'Enabled'} for s in g['exact']]
            slowa += [{'Campaign': c['nazwa'], 'Ad Group': g['nazwa'], 'Keyword': s, 'Criterion Type': 'Phrase', 'Status': 'Enabled'} for s in g['phrase']]
    zapisz('03-slowa-kluczowe.csv', ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Status'], slowa)
    wykl = []
    for c in K.KAMPANIE:
        for grupa_w, lst in K.WYKLUCZENIA_WSPOLNE.items():
            wykl += [{'Campaign': c['nazwa'], 'Ad Group': '', 'Keyword': w, 'Criterion Type': 'Negative Phrase', 'Grupa wykluczeń': grupa_w} for w in lst]
        wykl += [{'Campaign': c['nazwa'], 'Ad Group': '', 'Keyword': w, 'Criterion Type': 'Negative Phrase', 'Grupa wykluczeń': 'tylko gruntowe'} for w in c.get('wykluczenia_kampanii_dodatkowe', [])]
        for g in c['grupy']:
            wykl += [{'Campaign': c['nazwa'], 'Ad Group': g['nazwa'], 'Keyword': w, 'Criterion Type': 'Negative Phrase', 'Grupa wykluczeń': 'poziom grupy'} for w in g.get('wykluczenia_grupy', [])]
    zapisz('04-wykluczenia.csv', ['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Grupa wykluczeń'], wykl)
    kol = ['Campaign', 'Ad Group', 'Ad type'] + [f'Headline {i}' for i in range(1, 16)] + [f'Description {i}' for i in range(1, 5)] + ['Final URL', 'Path 1', 'Path 2', 'Status']
    reklamy = []
    for c in K.KAMPANIE:
        for g in c['grupy']:
            r = {'Campaign': c['nazwa'], 'Ad Group': g['nazwa'], 'Ad type': 'Responsive search ad', 'Final URL': g['url'], 'Path 1': g['sciezki'][0], 'Path 2': g['sciezki'][1], 'Status': 'Enabled'}
            for i, h in enumerate(g['naglowki'], 1): r[f'Headline {i}'] = h
            for i, o in enumerate(g['opisy'], 1): r[f'Description {i}'] = o
            reklamy.append(r)
    zapisz('05-reklamy-rsa.csv', kol, reklamy)
    zapisz('06-linki.csv', ['Campaign', 'Link Text', 'Description Line 1', 'Description Line 2', 'Final URL'],
           [{'Campaign': c['nazwa'], 'Link Text': t, 'Description Line 1': d1, 'Description Line 2': d2, 'Final URL': u} for c in K.KAMPANIE for (t, u, d1, d2) in K.LINKI])
    zapisz('07-objasnienia.csv', ['Campaign', 'Callout Text'], [{'Campaign': c['nazwa'], 'Callout Text': o} for c in K.KAMPANIE for o in K.OBJASNIENIA])
    zapisz('08-rozszerzenia-uslugi.csv', ['Campaign', 'Header', 'Values'], [{'Campaign': c['nazwa'], 'Header': K.ROZSZERZENIE_USLUGI[0], 'Values': '; '.join(K.ROZSZERZENIE_USLUGI[1])} for c in K.KAMPANIE])
    zapisz('09-polaczenia.csv', ['Campaign', 'Phone Number', 'Country Code'], [{'Campaign': c['nazwa'], 'Phone Number': K.TELEFON, 'Country Code': 'PL'} for c in K.KAMPANIE])
    dane = {'domena': K.DOMENA, 'jezyk': K.JEZYK, 'telefon': K.TELEFON, 'wojewodztwa': K.WOJEWODZTWA, 'geo_ids': geo_ids(), 'geo_promienie_km': K.GEO_PROMIENIE_KM, 'sufiks': K.SUFIKS,
            'kampanie': K.KAMPANIE, 'wykluczenia_wspolne': K.WYKLUCZENIA_WSPOLNE, 'linki': K.LINKI, 'objasnienia': K.OBJASNIENIA, 'rozszerzenie_uslugi': K.ROZSZERZENIE_USLUGI}
    with open(os.path.join(TU, 'kampania.json'), 'w', encoding='utf-8') as f:
        json.dump(dane, f, ensure_ascii=False, indent=1)
    print('reklama/google-ads/kampania.json zapisany')

if __name__ == '__main__':
    tryb = sys.argv[1] if len(sys.argv) > 1 else 'kontrola'
    b = kontrola()
    for x in b: print('  ✗ ' + x)
    n_h = sum(len(g['naglowki']) for c in K.KAMPANIE for g in c['grupy']); n_o = sum(len(g['opisy']) for c in K.KAMPANIE for g in c['grupy'])
    n_s = sum(len(g['exact']) + len(g['phrase']) for c in K.KAMPANIE for g in c['grupy'])
    print(f'Kontrola: {len(K.KAMPANIE)} kampanii, {sum(len(c["grupy"]) for c in K.KAMPANIE)} grup, {n_s} słów kluczowych, {n_h} nagłówków, {n_o} opisów, błędów: {len(b)}')
    if tryb == 'eksport':
        if b: sys.exit('Popraw błędy przed eksportem.')
        eksport()
    elif b:
        sys.exit(1)
