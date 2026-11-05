# Proposal

## Why

The dashboard currently opens in list view even though the dashboard specification describes a grid of specification cards. Grid view should be the standard presentation when the dashboard first opens.

## What Changes

- Open the dashboard with Grid view selected and specification cards arranged in the grid.
- Keep the existing List view option available through the display mode control.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `dashboard`: Specify Grid as the initial display mode while retaining manual switching to List.

## Impact

The dashboard's initial display mode and its selected control state change. No APIs, data models, or dependencies change.
