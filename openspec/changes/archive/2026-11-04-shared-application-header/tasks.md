# Tasks

## 1. Shared top bar

- [x] 1.1 Create a shared `ApplicationHeader` with typed dashboard and workspace modes for the common brand, agent count, inbox, settings, and account controls; verify `npm run build` passes.
- [x] 1.2 Move common top bar layout and control styling into one shared stylesheet, with mode-specific search/New Specification and Back to overview regions; verify the stylesheet is imported by the shared component and covers the existing narrow breakpoints.

## 2. Screen integration

- [x] 2.1 Render the shared header in the dashboard, retain its search, Cmd/Ctrl+K shortcut, New Specification action, inbox, settings, and account behavior, and remove superseded dashboard header markup/styles; verify those controls still work on the dashboard.
- [x] 2.2 Render the shared header in the specification workspace, retain Back to overview focus/navigation and the existing inbox, settings, and account behavior, and remove superseded workspace header markup/styles; verify the workspace header matches the dashboard style and omits search and New Specification.

## 3. Integration check

- [x] 3.1 Navigate between the dashboard and a specification workspace at wide and narrow window sizes; verify shared top bar styling, inbox placement and item navigation, keyboard access, and preserved dashboard search/filter/queue state, then confirm `npm run build` passes.
