# Design

## Context

See `proposal.md` for the motivation and `specs/specification-workspace/spec.md` for the changed behavior. `DashboardHeader.tsx` owns the dashboard bar, including search focus on Cmd/Ctrl+K. `SpecificationWorkspace.tsx` renders a second header inline. Their CSS defines different heights, layout systems, badges, and account avatars. Both screens already use the same `AttentionInbox` and mock agent data.

## Goals / Non-Goals

**Goals:**

- Have one source for the top bar's structure and shared control styling.
- Preserve screen-owned state and callbacks: search and inbox on the dashboard; inbox, Back to overview, and initial back-button focus in the workspace.
- Keep the bar usable at the existing responsive breakpoints.

**Non-Goals:**

- Changing account connection, settings, New Specification, or inbox data behavior.
- Moving dashboard search into the workspace or introducing cross-screen search state.

## Decisions

1. Create a shared `ApplicationHeader` component under `src/components/` with a typed dashboard/workspace mode. It renders the brand, agent count, inbox trigger, settings control, and account indicator once. The dashboard mode renders search and New Specification; the workspace mode renders Back to overview. A mode-specific prop shape keeps irrelevant callbacks out of each screen. A single generic slot container was considered, but it would leave each caller responsible for more top bar structure and make visual drift easier.
2. Keep search query, inbox-open state, notices, and navigation callbacks in the existing screen components. Pass values and handlers to the header. Keep the dashboard keyboard shortcut scoped to its active screen and preserve focus on Back to overview when the workspace opens. Moving state into the header was considered, but those actions affect screen content and navigation outside the bar.
3. Move shared header layout and control styles to one stylesheet used by the shared component. Use mode-specific classes only for the search/New Specification versus back-control layout. Align the workspace to the dashboard's bar dimensions, color, brand, badges, icons, and avatar, then adapt both modes at narrow widths without hiding required workspace controls. Keeping two independent stylesheets was considered, but it would recreate the current maintenance problem.
4. Keep a single `AttentionInbox` implementation and the existing per-screen popover state. Check the popover's anchor and placement after the bar's dimensions change so it remains visible and keyboard reachable on both screens.

## Risks / Trade-offs

- [Narrow windows could crowd the shared controls] → Define a wrapping layout and verify both modes at the current breakpoints.
- [The refactor could change dashboard search or workspace keyboard focus] → Exercise Cmd/Ctrl+K, Back to overview focus, and inbox selection during verification.
- [Header layout changes could misplace the inbox popover] → Verify its position and clipping on both screens and at narrow widths.

## Migration Plan

Replace the two header render paths in one frontend change, remove superseded header-specific styles, then build and manually inspect both screens. Rollback is limited to the frontend component and CSS changes; no persisted data or external API is involved.
