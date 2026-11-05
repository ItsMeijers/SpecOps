
# Dashboard Specification

## Purpose

Provides an overview of specifications, agent activity, workflow status, queue order, and items needing user attention in the desktop application.

## ADDED Requirements

### Requirement: Main dashboard overview

The application SHALL provide a dashboard displaying all known specifications and their current workflow states.

#### Scenario: Opening the dashboard
- WHEN the user opens the main dashboard
- THEN the application displays the specification grid
- AND summary metrics are visible
- AND the active agent count is displayed
- AND the Attention Inbox indicator is accessible

### Requirement: Specification cards

The dashboard SHALL represent each specification as an individual, approximately square card.

#### Scenario: Displaying a running specification
- GIVEN a specification is running
- WHEN its card is rendered
- THEN its title and repository are visible
- AND its workflow state is visible
- AND its assigned agent is identified
- AND its current activity is summarized
- AND available task progress is shown

#### Scenario: Displaying a queued specification
- GIVEN a specification is queued
- WHEN its card is rendered
- THEN its queued state is visible
- AND its queue position is displayed

#### Scenario: Opening a specification
- WHEN the user selects a specification card
- THEN the selected specification is opened in a placeholder detail view
- AND the user can return to the dashboard overview

### Requirement: Agent concurrency indicator

The dashboard SHALL display the number of active agents and the configured concurrency limit.

#### Scenario: Three agents are running
- GIVEN the concurrency limit is 3
- AND 3 mock agents are active
- WHEN the dashboard is displayed
- THEN the agent indicator displays 3 / 3

### Requirement: Priority queue

The dashboard SHALL display queued specifications in priority order.

#### Scenario: Reordering the queue
- GIVEN multiple specifications are queued
- WHEN the user moves a queued specification to a new position
- THEN the displayed queue order changes
- AND queue positions are recalculated
- AND running specifications remain unaffected

### Requirement: Attention Inbox

The dashboard SHALL provide a central inbox for actions requiring user intervention.

#### Scenario: Opening the inbox
- GIVEN at least one specification requires approval
- WHEN the user opens the Attention Inbox
- THEN the relevant specification appears
- AND the reason for requiring attention is displayed

#### Scenario: Navigating from the inbox
- WHEN the user selects an inbox item
- THEN the corresponding specification is opened

### Requirement: Search and filtering

The dashboard SHALL support searching and filtering specifications.

#### Scenario: Searching by title
- WHEN the user enters a search term
- THEN the dashboard displays matching specifications

#### Scenario: Filtering by status
- WHEN the user selects a workflow status
- THEN only specifications matching that status are displayed

#### Scenario: Empty result
- WHEN no specifications match the current search or filters
- THEN an informative empty state is displayed

### Requirement: Visual presentation

The dashboard SHALL follow the SpecOps visual design language.

#### Scenario: Rendering the application
- WHEN the dashboard is displayed
- THEN it uses the dark charcoal and orange theme
- AND no permanent navigation sidebar is displayed
- AND native operating-system window controls are preserved
- AND the specification cards adapt to available window width

### Requirement: Mock data isolation

The dashboard SHALL use structured mock data separated from presentation components.

#### Scenario: Loading dashboard data
- WHEN the dashboard initializes
- THEN it loads specifications from the mock data module
- AND it does not require GitHub, Codex, or an external service
