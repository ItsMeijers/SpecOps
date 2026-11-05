
# Design: SpecOps Main Dashboard

## 1. Technology

Extend the existing application.

- Tauri 2
- Rust backend (existing scaffold)
- React + TypeScript
- Tailwind CSS
- Lucide icons

Do not replace the existing frontend architecture or introduce an additional UI framework.

## 2. Visual Reference

Reference image:
`designs/main-dashboard.png`

Use this image as the primary visual design reference.

Visual characteristics:
- Near-black application background.
- Dark charcoal panels.
- Muted orange accent (#F97316).
- Subtle borders and shadows.
- Compact, refined typography.
- Rounded but not excessively soft cards.
- Minimal decorative effects.
- No neon glow.
- No illustrated background.
- No permanent left navigation sidebar.
- No custom OS window controls.

The interface should resemble a premium developer desktop tool.

## 3. Main Layout

The dashboard consists of four areas.

### A. Application Header

A compact horizontal header containing:

Left:
- SpecOps logo and name.

Center:
- Global specification search.

Right:
- Active agent count.
- Attention Inbox icon and unread count.
- Settings icon.
- User/account indicator.

Use the operating system's native window controls.
Do not recreate minimize, maximize, or close buttons.

### B. Workspace Header

Display:
- Title: "Specifications"
- Short subtitle describing the workspace.
- Primary orange button: "+ New Specification"

Below this, display compact summary metrics:
- Total specifications.
- Active agents / configured limit.
- Queued specifications.
- Needs attention.

### C. Specification Grid

The primary dashboard area.

Specifications appear as approximately square cards in a responsive grid.

Cards should contain:

1. Specification title.
2. GitHub issue reference, if available.
3. Repository name.
4. Current workflow status.
5. Agent identity (Codex).
6. Current activity summary.
7. Task progress, where available.
8. GitHub PR reference, where available.
9. Last activity timestamp.

Use a consistent card size.

Cards should show useful information without requiring the user to open them.

Use restrained orange emphasis for active execution, amber for human attention, green for verified completion, and neutral colors for inactive work.

Do not represent every workflow status using the same progress bar.

For example:
- Running: task progress.
- Awaiting approval: approval indicator.
- Queued: queue position.
- CI running: validation indicator.
- Completed: verified status.

Clicking a card should select the specification and prepare navigation to its detailed workspace.

Until that workspace is implemented, display a lightweight placeholder detail panel or view.

### D. Priority Queue

A compact secondary section for approved specifications awaiting execution.

Display:
- Queue position.
- Specification title.
- Repository.
- Current queue status.

Allow drag-and-drop reordering.

Use local state only.

The queue should visually reflect the configured concurrency limit.

Default mock concurrency:
3 active agents maximum.

## 4. Attention Inbox

Use a compact header notification indicator.

When clicked, display an inbox popover or panel.

Group pending actions such as:
- Specifications awaiting approval.
- Pull requests awaiting merge approval.
- Agent execution failures requiring intervention.
- Post-merge verification failures.

Each item should display:
- Specification title.
- Reason attention is required.
- Time of event.
- Action to open the relevant specification.

Mock interactions are sufficient.

Do not use intrusive modal dialogs or automatic pop-ups.

## 5. Workflow States

Use a shared TypeScript enum or union type for:

- draft
- generating
- awaiting_approval
- queued
- running
- validating
- awaiting_merge
- verifying_main
- completed
- needs_attention

These are presentation states for this change.

The complete workflow state machine is out of scope.

## 6. Mock Data

Create realistic mock specifications with varied statuses.

Use examples such as:
- Authentication & SSO
- Billing API
- Data Export
- Notification Service
- Search Improvements
- UI Refresh

Include:
- GitHub issue references.
- Repository names.
- Agent status.
- Activity summaries.
- Task completion counts.
- PR numbers.
- Queue priorities.
- Timestamps.

Keep mock data separate from UI components.

Define reusable TypeScript types so mock data can later be replaced with Rust backend events.

## 7. Interactions

Implement:

- Search by specification title, repository, or GitHub issue.
- Filter by workflow status.
- Sort by recent activity, title, or priority.
- Click specification card to open placeholder details.
- Return to overview.
- Open and close Attention Inbox.
- Reorder queued specifications.
- Visually update the queue after reordering.
- Show clear empty states.

All interactions operate on mock data.

The New Specification button may open a placeholder explaining that creation will be implemented in a future change.

## 8. Component Structure

Suggested structure:

src/
  components/
    dashboard/
      DashboardHeader.tsx
      DashboardMetrics.tsx
      SpecificationGrid.tsx
      SpecificationCard.tsx
      PriorityQueue.tsx
      AttentionInbox.tsx
      StatusBadge.tsx
  data/
    mockSpecifications.ts
  types/
    specification.ts

Adapt naming and paths to the existing project conventions.

Avoid a large monolithic dashboard component.

## 9. Responsive Behavior

Target desktop applications first.

- Wide windows: multi-column specification grid.
- Medium windows: fewer card columns.
- Narrow windows: single-column cards.
- Queue and inbox remain accessible.

The dashboard should not depend on a particular screen resolution.

## 10. Architecture

For this change, all state lives in the React frontend.

Do not create Rust commands or backend functionality solely for mock interactions.

Keep data access separated so a future workflow engine can replace mock data with real application state.

Avoid unnecessary global state libraries.

## 11. Non-Goals

Do not implement:
- Real agent conversations.
- Codex authentication or execution.
- GitHub API integration.
- OpenSpec file editing.
- Branch creation.
- GitHub Actions monitoring.
- Persistent execution state.
- The full specification detail workspace.

These belong to subsequent OpenSpec changes.
