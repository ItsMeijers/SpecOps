# Tasks

## 1. Shared Queue State and Modal

- [x] 1.1 Move queue order and reordering state from `Dashboard` to `App`; verify a reorder remains visible on dashboard cards after opening a workspace and returning.
- [x] 1.2 Present the existing queue list in one application-level modal with close control, Escape and backdrop dismissal, focus handling, and queue-item navigation; verify drag and move buttons work from both screens and closing restores focus to the invoking header button.

## 2. Shared Header Access

- [x] 2.1 Add a Priority Queue action to both modes of `ApplicationHeader`, with a visible label on wide screens and an accessible label at narrow widths; verify it opens the same modal from the dashboard and a workspace without hiding existing header controls.

## 3. Full-Width Dashboard

- [x] 3.1 Remove the dashboard detail panel, persistent queue panel, and transient selected-card state; verify selecting any card still opens its workspace and returning retains dashboard search, filters, sort, display mode, and queue order.
- [x] 3.2 Give the specification collection the available dashboard content width and make grid columns responsive; verify list and grid layouts at wide and narrow windows without horizontal overflow or oversized grid cards.

## 4. Integration Check

- [x] 4.1 Run the frontend build and manually exercise queue opening, closing, reordering, position labels, and workspace navigation from both screens; verify all behaviors in the dashboard and specification-workspace delta specs.
