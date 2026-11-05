# Design

## Context

See `proposal.md` for the motivation and the delta specs for expected behavior. `Dashboard.tsx` currently owns queue order, renders `SpecificationDetail` and `PriorityQueue` in a right column, and passes queue positions to cards. `App.tsx` keeps the dashboard mounted but hidden while a specification workspace is open. Both screens render the shared `ApplicationHeader`, so the queue must be available independently of dashboard visibility.

## Goals / Non-Goals

**Goals:**

- Provide one queue state and one modal instance for both screens.
- Keep queue order and card position labels synchronized after reordering.
- Make the expanded collection readable in wide and narrow windows.

**Non-Goals:**

- Persisting queue order across application restarts or changing real agent scheduling.
- Changing workspace content, GitHub integration, or the Attention Inbox.

## Decisions

1. Lift the mock queue order and modal open state to `App.tsx`, which already owns screen navigation. Render one `PriorityQueueModal` at the application level and pass its open action through the shared header on both screens. Pass queue order to `Dashboard` for card positions. This avoids separate queue copies or a modal trapped inside the hidden dashboard while a workspace is active.
2. Reuse the current `PriorityQueue` list and its drag and move-button behavior inside a dialog presentation. Keep the close control, Escape and backdrop dismissal, modal focus, and return focus to the header trigger. When selecting a queue item, close the dialog and navigate to that workspace; navigation focus goes to the workspace's existing Back to overview control. Rebuilding the queue list would duplicate ordering behavior.
3. Add a dashboard and workspace header queue action next to the Attention Inbox. Use a visible label where space permits and a clearly labeled icon at narrow widths. Preserve the shared header's existing search, back, and account controls.
4. Remove the dashboard detail and right-column rendering. Make the specification collection the sole content column. Keep list cards fluid; use responsive grid columns with a minimum card width so wider screens gain columns without creating oversized cards. Retain the current narrow-window card layout and the dashboard's outer padding.
5. Remove the dashboard's persistent selection state and selected-card styling, since card activation immediately navigates away. Keep the existing search, filters, sort, view mode, and queue order when returning from a workspace.

## Risks / Trade-offs

- [A shared header can become crowded at narrow widths] → Collapse the queue button to a labeled icon and verify wrapping at existing breakpoints.
- [Moving state can reset queue order on screen changes] → Keep queue order in `App.tsx`, above both screens, and verify reordering from each screen.
- [The dialog can interfere with keyboard navigation] → Trap focus while open, support Escape, restore focus on dismissal, and transfer focus appropriately after navigation.
- [Wide list rows or grid cards may become hard to scan] → Check both display modes at wide and narrow widths and adjust column sizing and card minimum widths.

## Migration Plan

Update the frontend state ownership and header/queue presentation together, then remove the unused detail panel and column styles. Verify the existing mock data flow and responsive layout. No stored data or external API migration is needed.
