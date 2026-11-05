
# Design

## Context

See `proposal.md` for motivation and `specs/specification-workspace/spec.md` for behavior. `App` currently owns the onboarding-to-dashboard transition. `Dashboard` owns search, filters, queue order, and a selected specification detail panel. Its `DashboardHeader` also contains search and New Specification controls that are absent from the workspace reference. The dashboard mock specifications provide stable IDs and shared workflow statuses, but not all workspace fields.

## Goals / Non-Goals

**Goals:** Keep dashboard state when moving into and out of a selected specification; use the existing specification ID and shared workflow status types; match the supplied visual layout with local mock interactions.

**Non-Goals:** Real Codex or GitHub integration, persistence, workflow execution, document editing, and a new routing dependency.

## Decisions

- Keep the dashboard mounted while its selected workspace is visible, or lift its view state to a common owner. This preserves search, filters, display mode, and queue order on Back to overview. Unmounting and recreating `Dashboard` would reset its current local state.
- Route card, queue, and Attention Inbox selections through one selected-specification handler. A selection opens the full workspace; the existing side detail panel is no longer the destination for a selection. Retaining both as competing destinations would make the user flow ambiguous.
- Build a compact workspace header from shared logo, status, inbox, settings, and account elements rather than rendering `DashboardHeader` unchanged. Its search and New Specification controls conflict with the approved workspace reference.
- Use the reference image for layout and visual treatment, and use dashboard data for identity and status. The image's sample issue, repository, and progress values differ from the current dashboard mock records; copying them into every workspace would show the wrong selected specification.
- Keep extra workspace data in a record keyed by existing specification IDs. Missing optional fields render clear unavailable or empty states. The alternative of one fixed workspace record would violate selection behavior.
- Keep message submission and Pause/Resume in local UI state. Those controls do not call backend services or mutate dashboard workflow records. A router or service layer is unnecessary for this mock experience.

## Risks / Trade-offs

- [Workspace data is incomplete for some dashboard records] → Render selected identity and existing status from dashboard data, plus explicit empty states for optional workspace fields.
- [The earlier dashboard delta describes a placeholder side detail on selection] → This change's selection behavior supersedes it; reconcile the deltas before archiving both.
- [Mock controls could imply a real action occurred] → Label unavailable actions clearly and keep simulated agent state local to the workspace.

## 1. Technology

Extend the existing SpecOps desktop application.

- Tauri 2
- Rust backend scaffold
- React + TypeScript
- Tailwind CSS
- Lucide React icons

Reuse existing styling, components, and TypeScript types from the main-dashboard implementation wherever possible.

Do not introduce another frontend framework or unnecessary dependencies.

## 2. Visual Reference

Reference image:

`designs/spec-workspace.png`

This is the authoritative visual reference.

Recreate the interface as faithfully as possible, including:

- Layout proportions.
- Typography and font weights.
- Spacing and alignment.
- Near-black backgrounds.
- Charcoal panels.
- Muted orange accents (#F97316).
- Subtle borders and rounded corners.
- Icons and buttons.
- Conversation message styling.
- Task checklist indicators.
- Status badges.
- Panel dimensions.

Do not redesign the interface.

Do not introduce a permanent left sidebar, illustrated background, excessive neon effects, or custom operating-system window controls.

## 3. Application Layout

The screen has three main horizontal sections:

1. Application header.
2. Specification header and navigation tabs.
3. Main specification workspace.

The main workspace is divided vertically into:

- Primary content area (approximately 70%).
- Right information panel (approximately 30%).

Use responsive proportions rather than rigid pixel dimensions.

## 4. Application Header

Reuse appropriate dashboard header elements and styling; do not render `DashboardHeader` unchanged because it includes search and New Specification controls that do not appear in the workspace design.

Display:

Left:
- SpecOps logo.
- Back to overview navigation.

Right:
- Active agent counter.
- Attention Inbox with notification count.
- Settings icon.
- Account avatar.

The Back to overview action must return the user to the existing dashboard with its search, filters, display mode, and queue order preserved.

Do not display unrelated specifications or a persistent specification list.

## 5. Specification Header

Display the selected specification's metadata:

- Specification title.
- GitHub issue number.
- Repository name.
- Git branch.
- Current workflow status.

The reference's `Authentication & SSO` example is visual guidance only. Use the selected dashboard record's title, repository, issue number, and status. Show branch only when the keyed workspace mock record contains one.

Right-aligned controls:

- Agent status badge.
- Pause/Resume control.
- View on GitHub button.
- More actions menu.

Pause/Resume changes local display state. View on GitHub opens an explicit URL from mock data or shows an unavailable notice. The more actions control opens a dismissible menu whose unavailable entries show a placeholder notice.

The specification header should remain visually distinct from the workspace content.

## 6. Workspace Tabs

Implement a horizontal navigation bar with:

- Overview
- Specification
- Conversation
- Activity
- Files
- GitHub

The selected tab uses an orange underline.

Tab changes must update visible content using local state.

### Overview

The Overview tab reproduces the reference screenshot and is the primary implementation target.

### Specification

Display a read-only mock OpenSpec document containing:

- Proposal
- Requirements
- Design
- Implementation tasks
- Acceptance criteria

This is a visual preview only.

### Conversation

Display a dedicated conversation view using the same mock Codex conversation data.

### Activity

Display a chronological timeline of mock agent activities.

### Files

Display mock changed files and their modification status.

### GitHub

Display mock issue, branch, PR, and CI information.

Secondary tabs may use concise mock content, but each must show the kind of data listed above for the selected specification, or an explicit empty state. A generic "Coming soon" panel is insufficient for these six views.

Do not implement full document editing, code diffs, or GitHub functionality.

## 7. Main Overview: Codex Conversation

The primary content panel contains a conversation between the user and Codex.

Display:

- Codex avatar.
- Agent name.
- Message timestamps.
- Codex messages.
- User messages.
- Task progress updates embedded within the conversation.

Use the design reference for message styling.

Codex messages should have subtly elevated dark backgrounds.

User messages should remain visually distinguishable.

The conversation should be vertically scrollable.

### Conversation Composer

Position the message composer at the bottom of the main panel.

Include:

- Text input area.
- Attachment icon.
- Code/context icon.
- Orange send button.

Support local mock interactions:

- Typing a message.
- Sending with the button or Enter.
- Displaying the submitted user message.
- Clearing the input after submission.
- Ignoring blank or whitespace-only submissions.

Do not generate AI responses.

Attachment and context controls may display a small "Coming soon" placeholder.

The composer should remain accessible as conversation content grows.

## 8. Task Checklist

Display specification implementation tasks within the Overview content.

Each task contains:

- Completion indicator.
- Task description.
- Optional file-change or activity summary.

Task states:

- Completed: green checkmark.
- Running: orange progress indicator.
- Pending: muted outlined circle.

Use the selected specification's task data, starting from its existing `WorkflowStep` entries when available. The seven authentication tasks in the image illustrate styling, not task text or counts that should replace the current dashboard record.

The task checklist is read-only for this change.

Keep task data separate from presentation components.

## 9. Right Information Panel

The right panel contains two vertically stacked information cards.

### A. Agent Status

Display:

- Current agent status.
- Started timestamp.
- Elapsed time.
- Selected agent name, or a clear unassigned state.
- Git worktree name.
- Current branch.
- Task progress bar.
- Completed/total task count.
- Current activity summary.

Use orange to indicate active execution.

All information comes from mock data.

### B. GitHub Information

Display:

- Linked GitHub issue.
- Repository.
- Branch.
- Pull request status.

Below this, show a recent activity timeline with:

- Activity description.
- Status indicator.
- Relative timestamp.

Use green for completed actions and orange for the current activity.

GitHub identifiers should appear as links where appropriate.

Links may open real GitHub URLs only when explicitly present in the mock data; otherwise they should be non-navigating placeholders.

## 10. Mock Data

Create structured TypeScript mock workspace records keyed by the existing dashboard specification IDs. The reference's detailed conversation and tasks may be used for a matching sample record; other specifications must retain their own title, repository, issue, and status, with concise mock data or clear empty states for optional details.

Include:

- Specification metadata.
- Workflow status.
- Agent runtime information.
- Tasks.
- Conversation messages.
- GitHub references.
- Recent activities.
- Changed files.
- OpenSpec document content.

Reuse shared types from the dashboard where possible.

Do not create duplicate workflow status definitions.

Mock data should be easily replaceable by future Rust backend events. Task counts shown in the checklist and status panel must agree; do not copy the reference image's inconsistent progress numbers literally.

## 11. Interactions

Implement:

- Return to dashboard.
- Switch workspace tabs.
- Type and submit mock chat messages.
- Scroll conversation.
- Open/close the actions menu, including dismissal without changing agent state.
- Simulate Pause/Resume locally.
- Display placeholder responses for unavailable actions.

Do not start real processes or execute commands.

The simulated Pause/Resume action must clearly be local UI state and must not suggest real agent control.

## 12. Responsive Behavior

Target desktop windows first.

At wide widths:
- Show conversation and information panel side by side.

At medium widths:
- Reduce the width of the information panel.
- Preserve readability.

At narrow widths:
- Stack the information panel below the primary content.
- Allow horizontal scrolling for workspace tabs when necessary.

Avoid horizontal page overflow.

## 13. Component Architecture

Suggested components:

src/components/workspace/
  SpecificationWorkspace.tsx
  SpecificationHeader.tsx
  WorkspaceTabs.tsx
  ConversationPanel.tsx
  ConversationMessage.tsx
  MessageComposer.tsx
  TaskChecklist.tsx
  AgentStatusPanel.tsx
  GitHubInfoPanel.tsx
  ActivityTimeline.tsx

Reuse shared pieces that exist today, including `SpecOpsLogo`, `StatusBadge`, and the types in `src/types/specification.ts`. Extract shared header pieces or build workspace-specific composition as needed; `AppHeader` and `ProgressBar` do not currently exist.

Adapt paths to the current project structure.

## 14. Navigation

Use the existing dashboard's specification IDs and route card, queue, and Attention Inbox selection through the same workspace-opening action.

The Back to overview control returns to the dashboard.

Preserve dashboard search, filters, display mode, and queue order on return.

Do not create a second application navigation system.

## 15. Non-Goals

Do not implement:

- Real Codex chat.
- Codex app-server communication.
- GitHub authentication.
- GitHub API integration.
- OpenSpec file generation or editing.
- Actual agent pause/resume.
- Real Git worktrees.
- CI/CD execution.
- Persistent chat history.
- Full code-diff viewers.
- Workflow state machine.

These features belong to future OpenSpec changes.
