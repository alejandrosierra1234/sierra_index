# SIERRA material identity

For all new or edited SIERRA materials, preserve these brand components:

- Departments: a solid triangle with strongly rounded corners followed by the department name. The color may change; the shape, proportions and name pairing must remain consistent. Use `sierraDepartmentHtml`, not a generic triangle icon or a square.
- Events: a white date tile with a subtle gray rounded border, red uppercase month and a large dark day. Use `sierraEventDateHtml`. It represents the event date, not the document issue date.
- Keep these components consistent in the editor, preview, PNG/JPG and PDF exports. Do not independently redraw them per template.
- Memos may contain event invitation blocks; retain the memo's formal header, metadata and signatures. An event block does not convert the entire memo into an invitation.
- Original links must remain visible in CTAs. Do not introduce URL shortening.

Shared renderers live in `index.html`; regression coverage lives in `tests/communications/management.cjs`.
