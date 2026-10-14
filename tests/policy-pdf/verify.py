"""Run after npm test. Requires pypdf; render every page separately for visual QA."""
from pathlib import Path
from collections import Counter
import json
import re
from pypdf import PdfReader

folder = Path(__file__).parent / 'tmp'
metrics = json.loads((folder / 'metrics.json').read_text())
pdf = PdfReader(folder / 'policy.pdf')
batch = PdfReader(folder / 'batch.pdf')
assert len(pdf.pages) == metrics['pages'] == 5
assert len(batch.pages) == 10
text = '\n'.join(page.extract_text() for page in pdf.pages)
words = lambda value: Counter(re.findall(r'[^\W\d_]+|\d+', value, re.UNICODE))
missing = words(metrics['text']) - words(text)
assert not missing, missing
assert 'PRIVATE_COMMENT_MUST_NOT_EXPORT' not in text
for i, page in enumerate(pdf.pages):
    assert f'PÁGINA {i + 1} DE 5' in page.extract_text()
    assert abs(float(page.mediabox.width) - 216 * 72 / 25.4) < 0.01
    assert abs(float(page.mediabox.height) - 792) < 0.01
    # Embedded real fonts and thousands of visible text glyphs, not page images.
    for ref in page['/Resources']['/Font'].values():
        font = ref.get_object()
        desc = font['/DescendantFonts'][0].get_object()['/FontDescriptor'].get_object()
        assert '/FontFile2' in desc
        assert '/ToUnicode' in font
    assert len(page.extract_text()) > 250
assert 'CONFIDENCIAL' not in ''.join(page.extract_text() for page in batch.pages[5:])
assert 'Logotipo pendiente' in batch.pages[5].extract_text()
print(json.dumps({'pages': len(pdf.pages), 'batch_pages': len(batch.pages), 'missing_words': dict(missing), 'characters': len(text), 'fonts_embedded': True}, ensure_ascii=False))
