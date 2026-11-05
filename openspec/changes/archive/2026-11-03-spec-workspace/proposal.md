
# Proposal

## Why

The dashboard shows workflow summaries, but users need a focused place to inspect one specification's progress, conversation, tasks, and linked GitHub work. A dedicated workspace provides that view without unrelated specification lists.

## What Changes

- Selecting a specification from the dashboard opens a full workspace for that selected item, replacing the current selection-only detail flow. Back to overview returns to the dashboard with its search, filters, and queue state intact.
- Add Overview, Specification, Conversation, Activity, Files, and GitHub views with the selected specification's mock information.
- Add a local mock conversation composer, Pause/Resume display state, an actions menu, and clear placeholders for unavailable controls.
- Present task progress, agent status, current activity, GitHub references, and recent activity in the design shown by `designs/spec-workspace.png`.

## Capabilities

### New Capabilities

- `specification-workspace`: Focused viewing and local mock interactions for the specification selected on the dashboard.

### Modified Capabilities

- `dashboard`: Selecting a specification card opens its full workspace instead of the former placeholder detail view.

## Impact

- Frontend selection and navigation in the dashboard and application root, plus new workspace components and structured mock data.
- Reuse existing workflow status definitions and visual styles. No new service, authentication, persistence, Codex execution, GitHub API, Git operation, or CI integration.
