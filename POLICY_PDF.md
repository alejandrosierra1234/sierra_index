# Local policy PDF export

No export server, paid service, print dialog, or transmission of policy snapshots.
The existing jsPDF 2.5.2 and html2canvas 1.4.1 dependencies render the shared
`policyPageHtml` / `policyPaginateDom` layout through jsPDF's **vector canvas**.
Body text is visible selectable PDF text; pages are not flattened screenshots.
Only company logos are image assets. Fonts are embedded from the repository.

Export creates an isolated, light, fixed-width document without comments or UI.
It waits for fonts and logos before using the same pagination as the preview.
There is no second template, Helvetica substitution, or independent text wrapping.
Per-page progress yields to the UI; a shared guard rejects concurrent exports.
Errors leave the draft untouched, remove temporary DOM, and release the guard.
Missing logos/fonts, unsupported glyphs and overflowing content fail explicitly
instead of silently omitting content. Up to ten documents / 150 pages per file.

## Fonts

Existing Aeonik TTF files are reused as-is. `assets/pdf-fonts` contains TrueType
derivatives of the existing Aeonik Mono and Replica CFF assets, which jsPDF cannot
embed directly. `scripts/prepare-policy-pdf-fonts.py <repo>` reproduces these with
fonttools 4.66.1, preserving names, metrics, glyph order and character mappings;
outline conversion tolerance is 0.5 font units. No font is downloaded at runtime
from a new provider. Keep the original fonts and their licensing restrictions.

## Regression verification

`cd tests/policy-pdf && npm ci && npx playwright install chromium && npm test`
creates **synthetic** single and batch PDF fixtures and preview screenshots.
`python verify.py` (pypdf) checks all source words, embedded fonts, page size,
page counts, page numbers, comments exclusion and batch watermark isolation.
Render all pages with Poppler and compare to `tmp/preview-*.png` before releasing.

The test also covers a failed logo, unsupported character, retry after failure,
concurrent requests, cleanup, unchanged inputs and absence of external requests.
`node --test js/collaboration/test/*.test.js tests/communications/policy-*.cjs`
checks the surrounding policy editor behavior.

The browser layout is preserved for supported policy components; PDF and screen
anti-aliasing can differ. New document CSS/components or library upgrades require
visual revalidation. This is not a claim of identical rendering for arbitrary CSS
or every browser version.
