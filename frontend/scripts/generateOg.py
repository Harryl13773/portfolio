#!/usr/bin/env python3
"""
Regenerates public/front.png 

The purpose of this: reading index.css, so webfront is adjusted
"""

import glob
import os
import re
import sys

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

os.chdir(os.path.join(os.path.dirname(__file__), '..'))  # run from frontend/ regardless of cwd

# parse from index.css
css = open('src/index.css').read()
root = css.split(':root')[1].split('}')[0]

def var(name):
    m = re.search(rf'--{name}:\s*(#[0-9a-fA-F]{{6}})', root)
    if not m:
        sys.exit(f'could not find --{name} in index.css :root')
    return m.group(1)

BG, HEADING, ACCENT, TEXT, BORDER = var('bg'), var('text-h'), var('accent'), var('text'), var('border')

def rgb(hexstr):
    return tuple(int(hexstr[i:i + 2], 16) for i in (1, 3, 5))

def blend(a, b, t):  # a..b at t in [0,1] — used to derive the dot-grid tone
    return tuple(round(x + (y - x) * t) for x, y in zip(rgb(a), rgb(b)))

# fonts section
def ttf(package_glob, out):
    matches = glob.glob(package_glob)
    if not matches:
        sys.exit(f'font not found ({package_glob}) — run npm install first')
    f = TTFont(matches[0])
    f.flavor = None
    f.save(out)
    return out

heading_ttf = ttf('node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2', '/tmp/og-heading.ttf')
mono_ttf = ttf('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', '/tmp/og-mono.ttf')

# rendering
img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)

for x in range(0, W, 32):  # dot grid, echoing the site background
    for y in range(0, H, 32):
        d.ellipse([x, y, x + 2, y + 2], fill=blend(BG, BORDER, 0.8))

glow = Image.new('L', (W, H), 0)  # soft accent glow behind the name, echoing the hero
gd = ImageDraw.Draw(glow)
cx, cy, r = W // 2, 140, 620
for i in range(r, 0, -4):
    gd.ellipse([cx - i, cy - i // 2, cx + i, cy + i // 2], fill=int(26 * (1 - i / r)))
img = Image.composite(Image.new('RGB', (W, H), ACCENT), img, glow)
d = ImageDraw.Draw(img)

name_f = ImageFont.truetype(heading_ttf, 118)
role_f = ImageFont.truetype(mono_ttf, 30)
url_f = ImageFont.truetype(mono_ttf, 26)

def centered(text, font, y, fill):
    d.text(((W - d.textlength(text, font=font)) / 2, y), text, font=font, fill=fill)

centered('Harry Lian', name_f, 200, HEADING)
centered('COMPUTER ENGINEER · FULL-STACK DEVELOPER', role_f, 360, ACCENT)

d.line([(80, 540), (W - 80, 540)], fill=rgb(BORDER), width=2)
d.text((80, 562), 'harrylian.com', font=url_f, fill=TEXT)
d.text((W - 80 - d.textlength('// portfolio', font=url_f), 562), '// portfolio', font=url_f, fill=ACCENT)

img.save('public/front.png', optimize=True)
print(f'public/front.png regenerated from palette: bg {BG}, heading {HEADING}, accent {ACCENT}')