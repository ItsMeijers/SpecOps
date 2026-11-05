# Proposal

## Why

The dashboard reserves a large right column for specification details even though selecting a specification immediately opens its full workspace. The same column holds the priority queue, constraining both list and grid views despite queue management being an occasional action.

## What Changes

- Remove the dashboard's specification detail panel and persistent priority queue column, giving the specification collection the available content width in list and grid modes.
- Add a Priority Queue button to the shared top header on both the dashboard and specification workspace. It opens a modal containing the existing queued specifications and reorder controls.
- Preserve queue order and queue position labels on dashboard cards. Selecting a queued specification from the modal opens its workspace.
- Keep the existing search, filters, sorting, display mode, Attention Inbox, and specification navigation behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `dashboard`: The specification collection uses the available dashboard width, while priority queue management moves into a header-opened modal.
- `specification-workspace`: The shared header exposes the Priority Queue modal while a workspace is open.

## Impact

- Dashboard layout, specification cards, queue presentation, and shared application header in the React frontend.
- Existing mock queue state and local reordering behavior remain; no backend, data migration, or new dependency is required.
