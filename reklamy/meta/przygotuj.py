#!/usr/bin/env python3
"""Kadry do reklam Meta z prawdziwych zdjęć DEWAX (zdjecia/*.jpg, img/*.webp).
Uruchom z katalogu głównego repozytorium: python3 reklamy/meta/przygotuj.py
Wymaga Pillow. Wynik: reklamy/meta/*.jpg (4:5 = 1080x1350 do reklam pojedynczych,
1:1 = 1080x1080 do karuzeli). Bez renderów, bez zdjęć obcych, bez nakładek tekstowych."""
from PIL import Image, ImageOps
import os

OUT = os.path.join('reklamy', 'meta')

def kadr(src, dst, ratio, anchor_y=0.5, anchor_x=0.5, size=None):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    W, H = im.size
    rw, rh = ratio
    # największy prostokąt o proporcji rw:rh mieszczący się w obrazie
    if W / H > rw / rh:
        h = H; w = int(round(H * rw / rh))
    else:
        w = W; h = int(round(W * rh / rw))
    x = int(round((W - w) * anchor_x)); y = int(round((H - h) * anchor_y))
    im = im.crop((x, y, x + w, y + h))
    tw, th = size
    im = im.resize((tw, th), Image.LANCZOS)
    im.save(os.path.join(OUT, dst), 'JPEG', quality=88, optimize=True, progressive=True)
    print(f'{dst}: z {src} {W}x{H} -> kadr {w}x{h} @({x},{y}) -> {tw}x{th}')

P45 = ((4, 5), (1080, 1350))
P11 = ((1, 1), (1080, 1080))

# Reklamy pojedyncze (4:5): operator przy wiertnicy, odwiert przy istniejącym domu, kotłownia
kadr('zdjecia/77.jpg', 'dzien-wiercenia-4x5.jpg', P45[0], anchor_y=1.0, size=P45[1])
kadr('zdjecia/76.jpg', 'odwiert-przy-domu-4x5.jpg', P45[0], anchor_y=0.6, size=P45[1])
kadr('zdjecia/90.jpg', 'kotlownia-thermokrafft-4x5.jpg', P45[0], anchor_y=0.75, size=P45[1])

# Karuzela (1:1): 1 wiercimy sami, 2 sonda w otworze, 3 próba ciśnieniowa, 4 kotłownia
kadr('zdjecia/77.jpg', 'k1-wiercimy-sami-1x1.jpg', P11[0], anchor_y=0.95, size=P11[1])
kadr('img/otwor.webp', 'k2-sonda-w-otworze-1x1.jpg', P11[0], anchor_x=0.45, size=P11[1])
kadr('img/manometr.webp', 'k3-proba-cisnieniowa-1x1.jpg', P11[0], anchor_x=0.0, size=P11[1])
kadr('zdjecia/90.jpg', 'k4-kotlownia-1x1.jpg', P11[0], anchor_y=1.0, size=P11[1])

# Wersje 1:1 reklam pojedynczych (Meta i tak kadruje 4:5 do 1:1 w części miejsc; te są ręczne)
kadr('zdjecia/76.jpg', 'odwiert-przy-domu-1x1.jpg', P11[0], anchor_y=0.75, size=P11[1])
