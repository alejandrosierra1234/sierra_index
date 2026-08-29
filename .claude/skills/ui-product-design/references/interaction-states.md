# Interaction States

Use this reference for controls, navigation, forms, asynchronous operations, stateful components, and flows with consequential actions.

## Specify state independently from styling

For each element, identify which states exist and what changes semantically, visually, and behaviorally:

- resting/default;
- hover for devices that support it;
- keyboard focus;
- pressed/active;
- selected, expanded, checked, or current;
- disabled or read-only;
- loading or pending;
- success, warning, or error;
- empty, partial, unavailable, or permission-restricted.

Do not collapse focus, hover, active, and selected into one treatment. They answer different questions: where attention is, what is being pointed at, what is being activated, and what persists as the current choice.

## Make transitions understandable

Every user action should have timely feedback. For asynchronous work:

1. acknowledge the action without destroying context;
2. prevent accidental duplicate submission when necessary;
3. preserve user input and navigation safety;
4. communicate progress only at a useful level of precision;
5. state the outcome and the next available action;
6. make retry or recovery possible when the operation can fail.

Use optimistic updates only when failure is unlikely, the change is reversible or reconcilable, and rollback will be clear. Avoid indefinite spinners; provide an appropriate empty, delayed, offline, or error state.

## Forms and validation

Labels must remain available after input. Mark requirements explicitly, connect instructions and errors programmatically, validate at a time that helps correction, and retain valid input after failure. Summarize multiple errors when that materially improves navigation. Do not use color alone to communicate validity.

For destructive or high-impact actions, match friction to consequence. State what will happen, identify the affected object, distinguish reversible from irreversible outcomes, and place confirmation at the point where it prevents realistic mistakes. Do not add confirmation to harmless routine actions.

## Navigation and disclosure

The current location must remain distinguishable without relying on hover. Expansion and selection are separate states. When content moves into menus, drawers, tabs, or progressive disclosure on smaller screens, preserve discoverability, focus management, reading order, and a clear way to dismiss and return.

Motion may connect cause and effect or clarify spatial change, but it must not be required to understand state. Respect reduced-motion preferences and keep focus stable through updates.

