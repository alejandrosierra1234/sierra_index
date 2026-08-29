# Interface Audit

Use this reference for an existing interface, a substantial redesign, or a request to assess product quality.

## Build an evidence base

Review the interface in context rather than judging a screenshot alone. Identify the user goal, entry points, common and high-risk flows, data conditions, supported viewports and themes, and the governing design-system sections. Inspect representative adjacent screens so consistency is evaluated across the product.

Separate findings into:

- **Normative violation:** conflicts with a current design-system or accessibility requirement.
- **Product usability issue:** obstructs comprehension, action, recovery, or confidence even if no written rule covers it.
- **Consistency gap:** diverges from an established component or pattern without a product reason.
- **Migration debt:** known legacy behavior awaiting reconciliation; do not present it as a valid precedent.
- **Opportunity:** an improvement whose value is plausible but not required for correctness.

Do not turn personal taste into a defect. Tie each finding to observed evidence, a governing rule, or a clear user consequence.

## Review in this order

1. **Purpose and hierarchy:** Can a user identify the page, current context, essential information, and primary action?
2. **Information architecture:** Are concepts grouped, named, ordered, and disclosed according to the user's task?
3. **Flow and recovery:** Can users start, continue, cancel, correct, retry, and understand outcomes?
4. **Components and semantics:** Are shared patterns used consistently and do visual treatments preserve their intended meaning?
5. **Content resilience:** Test long, missing, localized, ambiguous, and high-density content.
6. **Responsive behavior:** Verify task and information preservation, not just lack of horizontal overflow.
7. **Accessibility:** Check keyboard operation, focus order and visibility, labels, semantics, contrast, targets, zoom/reflow, and motion preferences.
8. **Operational states:** Check loading, empty, partial, offline/error, permission, and destructive-action states.
9. **Themes and modes:** Confirm equivalent hierarchy and semantics across supported themes; do not assume mechanical color inversion is sufficient.

## Report actionable findings

For each material issue, state:

- what and where it is;
- the evidence or governing rule;
- the user or system consequence;
- severity and confidence;
- the smallest coherent correction;
- whether the fix belongs locally, in a shared component, or in the design system.

Prioritize blocked tasks, data loss, inaccessible controls, misleading state, and systemic defects above visual refinement. Group repeated symptoms under their shared cause. If the request is review-only, do not implement fixes without authorization.

