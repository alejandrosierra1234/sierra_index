# SIERRA material identity

For all new or edited SIERRA materials, preserve these brand components:

- Departments in invitations: a solid triangle with strongly rounded corners followed by the department name. The color may change; the shape, proportions and name pairing must remain consistent. Use `sierraDepartmentHtml`, not a generic triangle icon or a square. Do not add this graphic to memos/communications or their event blocks.
- Events: a white date tile with a subtle gray rounded border, red uppercase month and a large dark day. Use `sierraEventDateHtml`. It represents the event date, not the document issue date.
- Keep these components consistent in the editor, preview, PNG/JPG and PDF exports. Do not independently redraw them per template.
- Memos may contain event invitation blocks using only the shared event date tile, not the department graphic. Retain the memo's formal header, metadata and signatures. An event block does not convert the entire memo into an invitation.
- Original links must remain visible in CTAs. Do not introduce URL shortening.
- Event blocks in memos use one compact white card with a subtle gray border and a restrained type scale. Supporting icons sit inside colored, rounded plaques; never use bare decorative icons. Preserve the event date tile's established typography.
- Reserve the left column exclusively for the event calendar, aligned at the top. All copy, schedule, location and links belong to the right column. Do not place information below the calendar or span logistics across both columns.
- Memo event details use neutral icon plaques: light gray (#f5f5f5) backgrounds and black (#0b0b0b) icons. Detail labels and links are neutral too; keep links underlined. This does not change the SIERRA calendar's red month or other modules' palettes.
- Memo CTA cards default to neutral colors but support custom text, background and button colors. Keep the illustration on the right, filling the card height without distortion, and all CTA content on the left. Always enclose the QR in a white rounded sticker with 1.5mm padding, independently of the card palette. Do not recolor the QR background or remove its internal quiet zone.

Shared renderers live in `index.html`; regression coverage lives in `tests/communications/management.cjs`.
