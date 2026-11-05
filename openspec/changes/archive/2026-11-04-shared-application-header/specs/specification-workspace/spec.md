# Spec Delta

## MODIFIED Requirements

### Requirement: Workspace application header

The workspace SHALL display the same application top bar appearance as the dashboard, with shared branding, agent and attention indicators, settings and account controls, and workspace navigation.

#### Scenario: Viewing the workspace header
- **WHEN** the workspace opens
- **THEN** the top bar uses the dashboard's height, background, spacing, branding, and control styling
- **AND** the SpecOps identity, Back to overview control, active agent count, Attention Inbox count, settings control, and account indicator are visible
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
