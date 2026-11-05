# Proposal

## Why

The dashboard and specification workspace currently use separate top bars with different heights, spacing, indicator styles, and account controls. This makes navigation between them feel inconsistent and requires the same application chrome to be maintained twice.

## What Changes

- Give the specification workspace the dashboard's top bar appearance and shared brand, agent count, Attention Inbox, settings, and account controls.
- Keep a workspace-specific Back to overview control in the bar. Dashboard search and New Specification remain dashboard-only.
- Consolidate the duplicated top bar markup and styling into one reusable component with screen-specific controls.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `specification-workspace`: Its application header matches the dashboard's shared top bar while retaining workspace navigation and controls.

## Impact

- Frontend header rendering in `src/components/dashboard/DashboardHeader.tsx` and `src/components/workspace/SpecificationWorkspace.tsx`, with shared styles moved out of their separate stylesheets.
- Existing inbox, settings, account, agent count, dashboard search, and dashboard creation actions keep their current local behavior. No backend, authentication, or new dependency is needed.
