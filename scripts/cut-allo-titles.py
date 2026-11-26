# Cuts the landing page's title font, app/fonts/allo/AlloTitles.woff2, from Allo 1.0.1 by Josh Puckett
# (SIL OFL 1.1, app/fonts/allo/LICENSE.txt): sharp corners only (roundness 0), optical size 14 to 32,
# weights 600 to 800, Latin and Latin-1 only, renamed "Allo Titles" as a modified version. About 76 KB.
#
# The source is the variable web font from https://github.com/joshpuckett/allo (fonts/webfonts/AlloVariable.woff2,
# SHA-256 830e2d0a802d19a92a4d142fba2db445c921a3a50d404ff8ae5c6a3fd011938b), not kept in the project.
# fonttools and brotli live in .toolchain/fonttools, installed there with:
#   python3 -m pip install --target .toolchain/fonttools fonttools==4.55.3 brotli==1.1.0
# Run:  python3 -I scripts/cut-allo-titles.py <AlloVariable.woff2> app/fonts/allo/AlloTitles.woff2 "$PWD/.toolchain/fonttools"
import sys
sys.path.insert(0, sys.argv[3])
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

src, out = sys.argv[1], sys.argv[2]
f = TTFont(src, lazy=False)
print('axes', [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in f['fvar'].axes])
# sharp only; optical size from text (14) to display (32); weights 600 to 800
f = instancer.instantiateVariableFont(f, {'ROND': 0, 'opsz': (14, 14, 32), 'wght': (600, 700, 800)}, updateFontNames=False)
# a distinct family name for the derivative (OFL: modified versions are named apart from the original)
for rec in f['name'].names:
    if rec.nameID in (1, 4, 16, 21):
        rec.string = str(rec.toUnicode()).replace('Allo', 'Allo Titles', 1)
    if rec.nameID in (6, 20):
        rec.string = str(rec.toUnicode()).replace('Allo', 'AlloTitles', 1)
import io
buf = io.BytesIO(); f.flavor = None; f.save(buf); buf.seek(0)
f = TTFont(buf, lazy=False)
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
opts.name_IDs = ['*']
opts.name_languages = ['*']
opts.notdef_outline = True
opts.glyph_names = False
# Latin and Latin-1 (the titles are English), general punctuation, superscripts, the euro, µ and the minus sign
unicodes = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + list(range(0x2000, 0x2070)) + [0x2070, 0x2074, 0x2075, 0x2076, 0x2077, 0x2078, 0x2079, 0x20AC, 0x3BC, 0x2212]
s = subset.Subsetter(opts)
s.populate(unicodes=unicodes)
s.subset(f)
f.flavor = 'woff2'
f.save(out)
g = TTFont(out)
print('axes after', [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in g['fvar'].axes])
print('family', g['name'].getDebugName(1), '|', g['name'].getDebugName(16))
