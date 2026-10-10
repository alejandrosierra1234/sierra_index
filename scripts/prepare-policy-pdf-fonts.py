"""Derive TrueType outlines from the repository's own CFF fonts for jsPDF.
Requires fonttools; never substitutes a different typeface or changes advances.
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen

root = Path(sys.argv[1])
out = root / 'assets' / 'pdf-fonts'
out.mkdir(parents=True, exist_ok=True)
for name in ['AeonikMono-Regular', 'AeonikMono-Medium', 'AeonikMono-Bold', 'Replica Regular', 'Replica Bold']:
    font = TTFont(root / (name + '.otf'))
    glyphs = font.getGlyphSet()
    converted = {}
    for key in font.getGlyphOrder():
        pen = TTGlyphPen(glyphs)
        glyphs[key].draw(Cu2QuPen(pen, max_err=0.5, reverse_direction=True))
        converted[key] = pen.glyph()
    del font['CFF ']
    if 'DSIG' in font:
        del font['DSIG']
    font['glyf'] = newTable('glyf')
    font['glyf'].glyphs = converted
    font['loca'] = newTable('loca')
    font['maxp'] = newTable('maxp')
    font['maxp'].tableVersion = 0x00010000
    font['maxp'].maxZones = 1
    for field in ['maxTwilightPoints', 'maxStorage', 'maxFunctionDefs', 'maxInstructionDefs', 'maxStackElements', 'maxSizeOfInstructions']:
        setattr(font['maxp'], field, 0)
    font.sfntVersion = '\x00\x01\x00\x00'
    font.save(out / (name.replace(' ', '-') + '.ttf'))
    print(name)
