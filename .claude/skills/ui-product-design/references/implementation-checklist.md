# Implementation Checklist

Use the relevant checks; do not perform ceremony unrelated to the change.

## Source of truth

- Current project instructions and design-system authority were located.
- Normative rules were distinguished from examples, history, deprecation notes, and migration debt.
- Existing components and comparable product surfaces were inspected.
- Any ambiguity, deviation, or required system change is explicit.

## Product and content

- Page purpose, current context, primary action, and hierarchy are clear.
- Labels use established product language and actions describe their outcome.
- Long, localized, missing, partial, and high-density content remain usable.
- Essential names and decision data are not silently lost through truncation.
- Empty states explain the condition and offer a relevant next step when one exists.

## Components and visual system

- Shared components and tokens are reused where their semantics match.
- New variants have a reusable purpose and do not duplicate an existing contract.
- Spacing, typography, icons, density, borders, elevation, and motion follow project rules.
- Brand, navigation, selection, status, and destructive semantics remain distinct.
- Legacy values are not promoted into new canonical rules.

## Interaction

- Relevant default, hover, focus, pressed, selected, disabled, loading, success, warning, error, partial, and permission states exist.
- Keyboard order and operation are logical; focus remains visible and is managed through overlays and dynamic changes.
- Pointer and touch targets are usable; hover is never the only path to essential information.
- Pending actions resist accidental duplication and failures preserve context with a recovery path.
- Destructive actions communicate scope and reversibility with proportionate confirmation.

## Responsive and themes

- Representative narrow, intermediate, and wide layouts were inspected.
- Reflow preserves task completion, hierarchy, and required information.
- Overlays, tables, dense controls, navigation, and long content work without inaccessible clipping.
- Supported themes preserve contrast, hierarchy, state, and semantic meaning.
- Zoom, text scaling, and reduced motion do not break the experience.

## Accessibility and quality

- Structure and controls use appropriate native semantics where practical.
- Controls have meaningful accessible names; instructions and errors are programmatically associated.
- Color is not the sole carrier of information and contrast meets the project's target.
- Important dynamic changes are announced appropriately without excessive noise.
- The primary flow and relevant edge states were exercised, not only rendered.
- Visual inspection found no unintended overlap, clipping, jitter, or inconsistent alignment.
- Verification limits and remaining risks are reported honestly.
