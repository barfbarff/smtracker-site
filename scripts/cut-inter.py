# Cuts the site's text font from Inter 4.1 by The Inter Project Authors
# (SIL OFL 1.1, app/fonts/inter/LICENSE.txt). Every weight and optical size and every OpenType feature are kept
# (the stylistic sets the landing page uses, ss07 and ss08, among them: Google Fonts' copy has none); only the
# characters are cut to what the site's English and scientific text needs, in two files, as Google Fonts does,
# so a page loads only what it uses (app/global.css gives each its unicode-range):
#   app/fonts/inter/Inter-core.woff2         Latin, Latin-1, punctuation, € ™ − and the common arrows: every page
#   app/fonts/inter/Inter-extended.woff2     accented Latin beyond Latin-1, Greek, super- and subscripts, currency,
#                                            letterlike, number forms, arrows, maths, technical, shapes: on demand
#
# The source is the variable web font from https://github.com/rsms/inter (docs/font-files/InterVariable.woff2,
# Inter 4.001, SHA-256 693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3), not kept in the project.
# fonttools and brotli live in .toolchain/fonttools (see scripts/cut-allo-titles.py).
# Run:  python3 -I scripts/cut-inter.py <InterVariable.woff2> app/fonts/inter "$PWD/.toolchain/fonttools"
import io
import sys

sys.path.insert(0, sys.argv[3])
from fontTools import subset  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402

src, outdir = sys.argv[1], sys.argv[2]


def load():
    f = TTFont(src, lazy=False)
    buf = io.BytesIO()
    f.flavor = None
    f.save(buf)
    buf.seek(0)
    return TTFont(buf, lazy=False)


def expand(ranges):
    return [c for a, b in ranges for c in range(a, b + 1)]


# keep these in step with the unicode-range lines in app/global.css
CORE = [
    (0x0020, 0x007E),  # Basic Latin
    (0x00A0, 0x00FF),  # Latin-1
    (0x0131, 0x0131),
    (0x0152, 0x0153),  # Œ œ
    (0x02C6, 0x02C6),
    (0x02DA, 0x02DA),
    (0x02DC, 0x02DC),
    (0x2000, 0x206F),  # general punctuation
    (0x20AC, 0x20AC),  # €
    (0x2122, 0x2122),  # ™
    (0x2190, 0x2193),  # ← ↑ → ↓
    (0x2212, 0x2212),  # −
    (0x2215, 0x2215),
    (0xFEFF, 0xFEFF),
]
EXTENDED = [
    (0x0100, 0x0130),
    (0x0132, 0x0151),
    (0x0154, 0x024F),  # Latin Extended-A and -B
    (0x0250, 0x02C5),
    (0x02C7, 0x02D9),
    (0x02DB, 0x02DB),
    (0x02DD, 0x02FF),  # IPA and spacing modifiers
    (0x0300, 0x036F),  # combining accents
    (0x0370, 0x03FF),  # Greek (μ σ α β γ δ λ τ …)
    (0x1E00, 0x1EFF),  # Latin Extended Additional
    (0x2070, 0x209F),  # super- and subscripts
    (0x20A0, 0x20AB),
    (0x20AD, 0x20CF),  # currency
    (0x2100, 0x2121),
    (0x2123, 0x214F),  # letterlike (℃ № Å …)
    (0x2150, 0x218F),  # number forms (fractions)
    (0x2194, 0x21FF),  # arrows
    (0x2200, 0x2211),
    (0x2213, 0x2214),
    (0x2216, 0x22FF),  # mathematical operators (± ≈ ≤ ∞ …)
    (0x2300, 0x23FF),  # technical (⌘ ⌥ …)
    (0x25A0, 0x25FF),  # geometric shapes
    (0x2713, 0x2713),
    (0x2715, 0x2715),
]

for name, ranges in (('Inter-core.woff2', CORE), ('Inter-extended.woff2', EXTENDED)):
    f = load()
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.name_languages = ['*']
    opts.notdef_outline = True
    opts.glyph_names = False
    s = subset.Subsetter(opts)
    s.populate(unicodes=expand(ranges))
    s.subset(f)
    f.flavor = 'woff2'
    f.save(f'{outdir}/{name}')
    g = TTFont(f'{outdir}/{name}')
    feats = sorted({fr.FeatureTag for fr in g['GSUB'].table.FeatureList.FeatureRecord})
    print(name, 'axes', [a.axisTag for a in g['fvar'].axes], '| ss07/ss08:', 'ss07' in feats and 'ss08' in feats)
