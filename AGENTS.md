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

- Communication block tools are grouped into Texto (teal), Multimedia (blue), Personas y eventos (green), Acciones y destacados (orange), and Estructura (purple), using SIERRA palette colors and SI_ICON. Outline icons use the same category color; feature blocks show their chosen icon/color. Insert after the active block. Pointer dragging uses a dedicated handle, destination indicator, edge scrolling and cancellation; retain keyboard-accessible move actions. Preserve form, preview and outer scroll positions and restore popover focus with preventScroll.
- Separators support line style, SIERRA color and vertical spacing. Video blocks use an optional uploaded poster, a play link opening the original URL in a new tab, the visible original URL, and a QR with white padding. Regenerate the QR when the URL changes; discard stale async results. Use the shared renderer in preview and exports.

- Brief notices use kind `aviso` and AVI folios, with their own editor and library filter. Keep the title, main message and optional highlight independent from optional shared gallery, contact and CTA blocks. Do not add memo recipient tables or signatures. The fumigation example is opt-in and must not replace an existing message.

- Informative circulars use kind `circular`, CIR folios, and an editorial masthead with company, publication date and optional country. Do not render the memo's recipient table, salutation or signature block in circulars.
- Circulars reuse the existing event, gallery, CTA, contact and icon/text renderers. Their editorial blocks include attributed quotes and groups of collaborators; portraits keep their aspect ratio. Preserve block visibility and ordering in all exports.
- Circular identity: restrained SIERRA logo masthead and discreet publication date. "Circular informativa" uses the shared memo-doc-type hierarchy. Use a full-width regular-weight Replica headline, summary, then a wrapping byline row with the author and optional country, company/plant and department, followed by large photography. Context uses small neutral icons from SI_ICON, not badges. The circular editor exposes one public department; do not show legacy sender/internal department fields or print the legacy sender. Preserve their stored values. No colored masthead rule or section plaque. Quotes are unframed with subtle separators; collaborator captions remain left aligned. Keep the editorial hierarchy distinct from memo metadata tables and invitation date tiles.
