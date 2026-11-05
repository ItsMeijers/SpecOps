
# Tasks

## 1. Selected specification and navigation

- [x] 1.1 Define workspace types and keyed mock records for the existing dashboard specification IDs, reusing shared workflow statuses; verify opening two different IDs shows their own title, repository, issue, status, and optional-field empty states.
- [x] 1.2 Route dashboard card, queue, and Attention Inbox selections to the full workspace; verify each path opens the selected ID without leaving the dashboard detail panel beside it.
- [x] 1.3 Implement Back to overview while preserving dashboard view state; verify search, filters, display mode, and queue order remain after opening and leaving a workspace.

## 2. Workspace shell and Overview

- [x] 2.1 Compose the compact workspace header from existing visual elements, without dashboard search or New Specification controls; verify its logo, Back control, agent count, inbox count, settings, and account indicator match `designs/spec-workspace.png`.
- [x] 2.2 Build the selected specification header with title, issue, repository, optional branch, status, and action controls; verify a record without a branch or assigned agent shows no borrowed values.
- [x] 2.3 Build the Overview conversation and read-only task checklist from selected mock data; verify chronological sender/timestamp display, completed/running/pending indicators, and conversation scrolling with the composer accessible.
- [x] 2.4 Build the agent status, progress, current activity, GitHub, and recent activity panels; verify counts agree with checklist data and missing fields show clear unavailable states.

## 3. Workspace views

- [x] 3.1 Add Overview, Specification, Conversation, Activity, Files, and GitHub tabs with visible active state and accessible selection; verify each tab switches its displayed content and Overview is selected on entry.
- [x] 3.2 Show a read-only mock Specification document for the selected item with proposal, requirements, design, tasks, and acceptance criteria; verify the content is present and cannot be edited.
- [x] 3.3 Show dedicated Conversation and Activity views using the selected item's messages and timeline; verify the views agree with Overview and display chronological events.
- [x] 3.4 Show mock changed files and GitHub issue, repository, branch, PR, and CI details for the selected item; verify missing files or references use explicit empty states.

## 4. Local mock interactions

- [x] 4.1 Implement local message submission by button and Enter, with blank messages ignored; verify a submitted message appears once, clears the input, and no Codex response or network request occurs.
- [x] 4.2 Implement local Pause/Resume display state for an assigned running agent; verify both transitions update the label and status without changing dashboard records or starting a process.
- [x] 4.3 Implement a dismissible actions menu and notices for unavailable attachment, context, and action controls; verify closing the menu leaves agent state intact and each unavailable control explains its status.
- [x] 4.4 Open GitHub references only when the selected mock record provides an explicit URL; verify missing URLs show an unavailable notice and never navigate to a guessed address.

## 5. Integrated presentation

- [x] 5.1 Match the wide workspace layout, typography, spacing, and colors to `designs/spec-workspace.png`; verify a visual comparison while keeping selected data consistent with the dashboard record.
- [x] 5.2 Adapt the layout for medium and narrow desktop windows; verify the information panel stacks when needed, tabs remain reachable, and the page has no horizontal overflow.
- [x] 5.3 Run `npm run build` and exercise selection, Back, tabs, composer, Pause/Resume, menu, and empty states; verify the build passes and no Codex execution, GitHub API, Git operation, or CI call is made by mock controls.
