# Tasks

## 1. Appearance State and Profile Menu

- [x] 1.1 Add one app-level Dark/Light preference with validated local-device storage and a pre-render document theme; verify first launch defaults to Dark, a saved Light choice appears on onboarding without a dark flash, and the choice survives a restart.
- [x] 1.2 Replace the shared header's account placeholder action with a Dark/Light profile dropdown; verify both dashboard and workspace open the same menu, announce the current choice, support keyboard selection, close on Escape and outside click, and return focus to the trigger after Escape.
- [x] 1.3 Apply a new choice in place without remounting screens; verify dashboard search, filters, sort, display mode, queue order, current workspace, and active workspace tab remain unchanged when toggling themes.

## 2. Dark and Light Presentation

- [x] 2.1 Introduce semantic dark and light color tokens across active frontend styles; verify the Dark scheme matches the current appearance and the root theme reaches the portaled Priority Queue modal.
- [x] 2.2 Style dashboard list and grid in Light using `designs/main-dashboard-light.png` for surfaces, borders, text, controls, and status colors; verify both display modes at wide and narrow windows without horizontal overflow or persistent selected-card styling.
- [x] 2.3 Style the workspace header, all tabs and content panels, conversation, status details, and action controls in Light; verify representative workspaces and tabs remain readable at wide and narrow windows with visible keyboard focus.
- [x] 2.4 Style onboarding, the Priority Queue modal, Attention Inbox, profile menu, notices, hover and disabled states in Light while keeping the onboarding background image visible; verify each surface is readable and status meanings remain distinct in both schemes.

## 3. Integration Check

- [x] 3.1 Run the frontend build and exercise switching and relaunching from both headers, navigating between screens, opening overlays, and resizing in both schemes; verify the appearance-preferences, dashboard, and specification-workspace delta scenarios hold without a theme flash or lost screen state.
