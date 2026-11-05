# Dashboard Spec Delta

## MODIFIED Requirements

### Requirement: Main dashboard overview

The application SHALL provide a dashboard displaying all known specifications and their current workflow states, with Grid as the initial display mode.

#### Scenario: Opening the dashboard
- WHEN the user opens the main dashboard in a new application session
- THEN the application displays the specification cards in grid view
- AND the Grid display mode control is selected
- AND summary metrics are visible
- AND the active agent count is displayed
- AND the Attention Inbox indicator is accessible

#### Scenario: Choosing list view
- WHEN the user selects List from the dashboard display mode control
- THEN the specification cards are displayed in list view
- AND the List display mode control is selected
