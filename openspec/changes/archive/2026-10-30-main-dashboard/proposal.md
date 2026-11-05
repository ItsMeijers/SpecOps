
# Main Dashboard

## Why

SpecOps needs a central workspace where users can monitor and manage multiple specification-driven AI workflows concurrently.

The dashboard should make it immediately clear:
- What specifications exist.
- Which agents are running.
- What work is queued.
- What requires human attention.
- Which workflows are ready to merge or completed.

The interface should feel like a modern desktop developer application rather than a traditional project management tool.

## What Changes

Implement the main SpecOps dashboard using the existing Tauri, Rust, React, and TypeScript application.

The dashboard includes:
- A compact application header.
- Summary indicators for active agents and pending actions.
- A grid of specification cards.
- A priority-ordered execution queue.
- A central Attention Inbox.
- Search, filtering, and sorting.
- Mock GitHub and Codex workflow information.
- Responsive desktop layouts.

## Scope

This change implements the frontend and local mock interactions only.

No real:
- GitHub API requests.
- Codex agent execution.
- OpenSpec generation.
- Git operations.
- CI/CD execution.
- Authentication changes.
- Database persistence.

## Outcome

A functional, visually polished dashboard that can later connect to the Rust workflow orchestrator without requiring a significant UI redesign.
