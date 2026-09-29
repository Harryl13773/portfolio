#!/usr/bin/env python3
"""
Regenerates public/front.png, the link preview image, using the colors in index.css
"""

import glob
import os
import re
import sys
import tempfile

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

os.chdir(os.path.join(os.path.dirname(__file__), '..'))  # Run from frontend/ regardless of cwd

# Read the dark theme colors from index.css
css = open('src/index.css').read()
root = css.split(':root')[1].split('}')[0]

def var(name):
    m = re.search(rf'--{name}:\s*(#[0-9a-fA-F]{{6}})', root)
    if not m:
        sys.exit(f'could not find --{name} in index.css :root')
    return m.group(1)

BG, HEADING, TEXT, DIM, BORDER = var('bg'), var('text-h'), var('text'), var('text-dim'), var('border')

# Convert the site's bundled fonts to TTF for Pillow
def ttf(package_glob, name):
    matches = glob.glob(package_glob)
    if not matches:
        sys.exit(f'font not found ({package_glob}); run npm install first')
    f = TTFont(matches[0])
    f.flavor = None
    out = os.path.join(tempfile.gettempdir(), name)
    f.save(out)
    return out

heading_ttf = ttf('node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2', 'og-heading.ttf')
body_ttf = ttf('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2', 'og-body.ttf')

# Layout mirrors the site: name, tagline, tab row, rule, footer
W, H, M = 1200, 630, 88
img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)

name_f = ImageFont.truetype(heading_ttf, 128)
tagline_f = ImageFont.truetype(body_ttf, 38)
tab_f = ImageFont.truetype(heading_ttf, 46)
url_f = ImageFont.truetype(body_ttf, 28)

d.text((M - 6, 70), 'Harry Lian', font=name_f, fill=HEADING)
d.text((M, 236), 'Computer engineer and full-stack developer', font=tagline_f, fill=TEXT)

# Tab row with About active, like the site's first screen
x = M
for i, label in enumerate(['About', 'Experience', 'Projects', 'Contact']):
    d.text((x, 420), label, font=tab_f, fill=HEADING if i == 0 else DIM)
    x += d.textlength(label, font=tab_f) + 52

d.line([(M, 500), (W - M, 500)], fill=BORDER, width=2)
d.text((M, 534), 'harrylian.com', font=url_f, fill=TEXT)

img.save('public/front.png', optimize=True)
print(f'public/front.png regenerated from palette: bg {BG}, heading {HEADING}, text {TEXT}')
