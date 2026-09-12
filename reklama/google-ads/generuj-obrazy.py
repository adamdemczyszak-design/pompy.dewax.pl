#!/usr/bin/env python3
"""Obrazy do zasobów graficznych Google Ads z prawdziwych zdjęć DEWAX.

Uruchomienie z katalogu głównego repozytorium:  python3 reklama/google-ads/generuj-obrazy.py
Wymaga Pillow (pip install pillow). Źródła: zdjecia/*.jpg i img/*.webp (te same, które są na stronie).
Świadomie pominięte: img/diag.webp (render), img/glowica.webp (materiał producenta), zdjecia/91.jpg
i 92.jpg (pochodzenie do potwierdzenia, CONTENT_NEEDED.md pkt 4.13).

Formaty wg wymagań Google Ads dla zasobów graficznych w kampaniach w sieci wyszukiwania:
  poziomy 1,91:1  1200x628 (min. 600x314), kwadrat 1:1 1200x1200 (min. 300x300),
  pionowy 4:5     960x1200 (min. 480x600). Logo: kwadrat (min. 128x128), poziome 4:1 (min. 512x128).
Zdjęć nie powiększamy więcej niż o ok. 10 %; mniejsze źródła dają mniejszy plik w tej samej proporcji.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'reklama', 'google-ads', 'obrazy')
os.makedirs(OUT, exist_ok=True)
MAX_UPSCALE = 1.10

def crop_ratio(im, w_ratio, h_ratio, anchor_y=0.5, anchor_x=0.5):
    W, H = im.size
    target = w_ratio / h_ratio
    if W / H > target:
        nw = int(round(H * target)); nh = H
    else:
        nw = W; nh = int(round(W / target))
    x = int(round((W - nw) * anchor_x)); y = int(round((H - nh) * anchor_y))
    return im.crop((x, y, x + nw, y + nh))

def zapisz(im, nazwa, w, h):
    scale = min(1.0 * w / im.width, MAX_UPSCALE)
    if im.width < w:
        # nie powiększamy ponad MAX_UPSCALE: wynik mniejszy, ale w tej samej proporcji
        nw = int(round(im.width * scale)); nh = int(round(nw * h / w))
    else:
        nw, nh = w, h
    out = im.resize((nw, nh), Image.LANCZOS).convert('RGB')
    path = os.path.join(OUT, f'{nazwa}-{nw}x{nh}.jpg')
    out.save(path, 'JPEG', quality=88, optimize=True, progressive=True)
    print(f'{path[len(ROOT)+1:]}  {nw}x{nh}  {os.path.getsize(path)//1024} KB')

def src(p):
    return Image.open(os.path.join(ROOT, p)).convert('RGB')

# (plik źródłowy, nazwa wyjściowa, kotwica pionowa 0..1, kotwica pozioma 0..1)
POZIOME = [
    ('img/hero_wide.webp',              'wiertnica-na-dzialce',  0.45, 0.5),
    ('img/maszt-wiertnicy-1100.webp',   'maszt-wiertnicy',       0.5,  0.5),
    ('img/sonda-w-otworze-1100.webp',   'sonda-w-otworze',       0.5,  0.5),
    ('img/proba-cisnieniowa-1100.webp', 'proba-cisnieniowa',     0.5,  0.5),
    ('img/pluczka.webp',                'wiercenie-pluczka',     0.5,  0.5),
    ('img/helix.webp',                  'sonda-helix',           0.5,  0.5),
]
KWADRATY = [
    ('zdjecia/76.jpg',     'odwiert-przy-domu',   0.55, 0.5),
    ('zdjecia/75.jpg',     'wiertnica-w-pracy',   0.5,  0.5),
    ('zdjecia/90.jpg',     'kotlownia-bufor',     0.5,  0.5),
    ('img/hero_wide.webp', 'wiertnica-na-dzialce', 0.5, 0.55),
    ('zdjecia/77.jpg',     'operator-wiertnicy',  0.5,  0.5),
]
PIONOWE = [
    ('zdjecia/76.jpg', 'odwiert-przy-domu',  0.5, 0.5),
    ('zdjecia/75.jpg', 'wiertnica-w-pracy',  0.5, 0.5),
    ('zdjecia/90.jpg', 'kotlownia-bufor',    0.5, 0.5),
    ('zdjecia/77.jpg', 'operator-wiertnicy', 0.5, 0.5),
]

for p, n, ay, ax in POZIOME:
    zapisz(crop_ratio(src(p), 1.91, 1, ay, ax), 'poziom-' + n, 1200, 628)
for p, n, ay, ax in KWADRATY:
    zapisz(crop_ratio(src(p), 1, 1, ay, ax), 'kwadrat-' + n, 1200, 1200)
for p, n, ay, ax in PIONOWE:
    zapisz(crop_ratio(src(p), 4, 5, ay, ax), 'pion-' + n, 960, 1200)

# Logo na białym tle, bez powiększania rastra (źródło 479x134 px).
logo = Image.open(os.path.join(ROOT, 'img', 'logo.png')).convert('RGBA')
def logo_na_tle(w, h, margines, nazwa):
    tlo = Image.new('RGB', (w, h), 'white')
    lw, lh = logo.size
    s = min((w - 2 * margines) / lw, (h - 2 * margines) / lh, 1.0)
    l = logo.resize((int(lw * s), int(lh * s)), Image.LANCZOS)
    tlo.paste(l, ((w - l.width) // 2, (h - l.height) // 2), l)
    path = os.path.join(OUT, f'{nazwa}-{w}x{h}.png')
    tlo.save(path, 'PNG', optimize=True)
    print(f'{path[len(ROOT)+1:]}  {w}x{h}  {os.path.getsize(path)//1024} KB')
logo_na_tle(512, 512, 24, 'logo-kwadrat')
logo_na_tle(512, 128, 8, 'logo-poziome')
