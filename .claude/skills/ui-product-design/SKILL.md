---
name: ui-product-design
description: Design, implement, or audit product interfaces by working from the project's existing design system, components, information architecture, interaction states, responsive behavior, and accessibility requirements. Use for application UI and product-design work; do not use for brand-only graphics or generic visual decoration.
---

# UI Product Design

Create interfaces that belong to the product rather than isolated screens that merely look polished.

## Establish the source of truth

Before proposing or changing UI:

1. Locate project instructions, the design system, tokens, component libraries, and representative implemented screens.
2. Identify which material is normative. Treat audit logs, historical notes, examples, deprecated patterns, and migration debt as context—not current permission to reproduce them.
3. Resolve conflicts by following the clearest current normative rule. If the authority remains ambiguous and the choice would materially alter the result, surface the conflict instead of silently inventing a rule.
4. Inspect existing components and patterns before creating a local variant. Prefer extending a shared primitive when the need recurs; keep a local solution local when it is genuinely one-off.

Do not copy project-specific fonts, colors, icon sources, measurements, or component names into this Skill. Read them from the current project.

## Work from product intent

Clarify the user's task, the audience, the primary decision or action, the information required to support it, and the states in which the interface will be used. Preserve the user's requested scope and established product language.

Define hierarchy and information architecture before styling. Make the primary path obvious, secondary actions available without competing with it, and destructive or exceptional actions proportionate to their risk.

When the task is an audit or substantial redesign, read [references/interface-audit.md](references/interface-audit.md). When creating or modifying reusable UI, read [references/component-consistency.md](references/component-consistency.md).

## Design the complete behavior

Account for every state that affects use: default, hover when applicable, keyboard focus, active/pressed, selected/current, disabled, loading, empty, success, warning, error, partial data, overflow, and permission-restricted states. Do not use hover to carry information required on touch devices or by keyboard users.

Read [references/interaction-states.md](references/interaction-states.md) whenever the work introduces or changes an interactive control, asynchronous flow, form, navigation pattern, or stateful component.

Responsive design must preserve meaning and task completion. Reflow, regroup, disclose progressively, or change the interaction model when compression would damage readability. Never solve constrained space by silently truncating essential identity or decision-making information unless the design system explicitly authorizes it and provides access to the full value.

Use semantic HTML and native controls where practical. Preserve keyboard operation, visible focus, meaningful labels, readable contrast, adequate targets, zoom/reflow, reduced-motion preferences, and announcements for important asynchronous changes.

## Implement with system discipline

- Reuse approved tokens and components; avoid near-duplicate local values.
- Keep interaction, status, selection, and brand semantics distinct according to the project's rules.
- Match established density, spacing rhythm, typography, icon treatment, content patterns, and motion behavior.
- Design content to reveal real constraints. Test long labels, localization, missing values, large counts, validation messages, and realistic data density.
- Keep motion functional: explain change, preserve spatial continuity, or confirm causality. Avoid motion that delays work or merely decorates routine actions.
- Do not change unrelated UI while completing a scoped task.

## Verify before completion

Inspect the result at representative viewport sizes and in every relevant theme. Exercise keyboard and pointer paths, state transitions, overflow, loading, empty and failure states, and realistic content extremes. Compare the implementation with its design-system authority and neighboring product surfaces.

For implementation or final review, read [references/implementation-checklist.md](references/implementation-checklist.md). Report unresolved design-system conflicts, intentional deviations, missing states, and verification limits. Do not declare the UI complete merely because it renders or the happy path works.

