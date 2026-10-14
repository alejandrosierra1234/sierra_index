# Component Consistency

Use this reference when creating, extending, or reconciling reusable UI.

## Decide whether to reuse, extend, or create

Search the component library and product for the same semantic job, not merely a similar shape.

- **Reuse** when an existing component already expresses the same role and behavior.
- **Extend** when the semantic role is shared and the difference can be represented by a deliberate state, size, slot, or variant.
- **Compose** existing primitives when the pattern is new but its parts and behavior already exist.
- **Create** a new component when it has a distinct reusable responsibility that cannot be expressed coherently by existing APIs.
- **Keep local** when abstraction would encode a single-screen accident or speculative reuse.

Do not force unrelated semantics into one component because their geometry matches. Do not duplicate a component solely to avoid understanding its API.

## Preserve the contract

For reusable UI, define or verify:

- semantic purpose and appropriate element or accessibility role;
- required and optional content;
- variants and the product meaning of each;
- sizes drawn from the project's canonical tiers;
- default, focus, active, selected, disabled, loading, error, and overflow behavior as applicable;
- keyboard and pointer interactions;
- responsive and localization behavior;
- theme behavior and token dependencies;
- composition rules and prohibited combinations.

Prefer content-driven layout within defined constraints. Avoid fixed dimensions when content, localization, user settings, or validation can expand. If truncation is allowed, ensure the full value remains available through an accessible, touch-compatible mechanism and confirm the information is nonessential at that point in the flow.

## Protect semantic consistency

Colors, icons, borders, elevation, and motion communicate categories. Follow the project's semantic mapping rather than choosing treatments screen by screen. Brand accent, navigation/wayfinding, selection, operational status, and destructive intent may use different systems even when an older implementation conflates them.

Component variants should be few, named by meaning where possible, and backed by tokens. A one-off numeric value is not a new canonical tier. Label unreconciled legacy values as debt rather than normalizing them through documentation.

## Change the system at the right level

Update a shared component only when the change is correct for its consumers. Inspect usages and avoid silently altering unrelated flows. If a new need exposes a missing design-system rule, record the ambiguity and propose the narrowest normative addition; do not smuggle a new rule into implementation and call it precedent.

