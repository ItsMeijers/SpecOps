# Specification Workspace Spec Delta

## MODIFIED Requirements

### Requirement: Workspace application header

The workspace SHALL display a compact application header with navigation, a Priority Queue button, and the dashboard's shared account and attention indicators.

#### Scenario: Viewing the workspace header
- **WHEN** the workspace opens
- **THEN** the top bar uses the dashboard's height, background, spacing, branding, and control styling
- **AND** the SpecOps identity, Back to overview control, active agent count, Priority Queue button, Attention Inbox count, settings control, and account indicator are visible
- **AND** dashboard search and New Specification controls are absent

#### Scenario: Using the shared header controls
- **WHEN** the user activates Attention Inbox in the workspace top bar
- **THEN** the inbox opens with the same item count and selection behavior as on the dashboard

#### Scenario: Activating unavailable account controls
- **WHEN** the user activates settings or account options in the workspace top bar
- **THEN** the existing local unavailable-action feedback is shown

#### Scenario: Narrow workspace window
- **WHEN** the workspace window is too narrow for the top bar's wide layout
- **THEN** its controls remain visible and reachable without horizontal page overflow

#### Scenario: Opening the priority queue from a workspace
- **WHEN** the user activates Priority Queue in the workspace header
- **THEN** the same priority queue modal used from the dashboard opens with the current queue order and reorder controls
- **AND** closing it returns the user to the current workspace and restores focus to the Priority Queue button

#### Scenario: Selecting queued work from a workspace
- **WHEN** the user selects a queued specification in the modal
- **THEN** the modal closes
- **AND** the workspace for the selected specification opens
