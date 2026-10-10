# Policy numbering — migration 50

Apply `update50.sql` after 49 to activate atomic numbering. The UI may deploy first:
`policy-catalog.js` supplies the official workbook vocabulary even when RPC 50 is
unavailable, and `policy-numbering.js` blocks approval until the server catalog is
verified. Editing and saving drafts remain available. This is not a fallback
browser counter. Never claim numbering is active until the migration is verified.
It is transactional and repeatable. Read-only preflight must confirm historical
codes, company mapping, and area mapping. Never approve user documents as test data.

The official identity is `country-company-area-POL-serial`. Country derives from the
company; the company's document abbreviation is distinct from its internal badge
code. Areas come from the workbook's 001–013 catalog. Only POL is enabled.
Company choices use registered organization IDs and shared logos, not invented
IDs for spreadsheet rows. Country comes from that company's country record.
Unmapped companies (including AMTEX) remain usable for drafts but cannot obtain
an official code. Unknown legacy departments remain visible and unchanged until
the user chooses an area; exact names and workbook aliases RRHH/Admon are mapped
without guessing. Process, title and document content are editorial text, not
closed catalogs supplied by the workbook.

Drafts have no serial. A separate `policy_approve(id, revision)` transaction validates
permissions and classification, locks the document, increments the prefix counter,
registers a unique identity, changes status, and records a revision. A repeated
approval returns the existing result. A failed transaction consumes no number.
Prefix allocation is serialized by PostgreSQL's counter row, including distinct
documents approved simultaneously. The browser never guesses the next serial.

Issued identities cannot change company or area. Archiving/reopening/reapproving
does not recycle or reallocate a number. Duplicates start with no issued identity.
Historical version restoration keeps the current identity and approval state.
Three-digit exhaustion at 999 blocks approval: it does not wrap or silently expand
the nomenclature. Authorized owners must decide a new format before exhaustion.

Migration preserves valid historical official codes, reserves their numbers and
raises counter floors accordingly. Old `POL-year-number` references are retained
as `legacyCode` and in immutable revisions, not adopted as official identities.
An ambiguous or mismatched historical code aborts migration rather than renumbering.
AMTEX is intentionally not mapped: no abbreviation was supplied in the workbook.

Production checks: migration marker 50, RLS and no direct authenticated privileges
on the four catalogs/registries, no duplicate registered codes, counter >= max
serial, existing comment counts unchanged, historical references retained. Do not
equate PGlite tests with a production deployment or a mathematical zero-risk claim.

Verified in production on 2026-10-10: marker 50, 13 areas, five mapped companies,
five documents, two reserved historical official identities and correct counter
floors (001 area: 2; 008 area: 1). RLS enabled on catalogs, registries and revision
history; no direct anonymous reads or authenticated writes. Content fingerprints
(excluding migrated identity fields), threads, messages and comment events were
identical before/after. Three old references retained as legacyCode, including
the case where the former legacyCode was an empty string. No real document was
approved for testing.
