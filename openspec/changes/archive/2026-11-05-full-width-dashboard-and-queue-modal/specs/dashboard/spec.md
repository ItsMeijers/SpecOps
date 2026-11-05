# Dashboard Spec Delta

## MODIFIED Requirements

### Requirement: Priority queue

The dashboard SHALL provide access to queued specifications in priority order through a Priority Queue button in the top application header. Activating it SHALL open a modal where the user can inspect and reorder the queue.

#### Scenario: Opening the priority queue
- WHEN the user activates Priority Queue in the dashboard header
- THEN a modal displays queued specifications in priority order
- AND the modal shows the active agent count and concurrency limit

#### Scenario: Reordering the queue
- GIVEN multiple specifications are queued
- WHEN the user moves a queued specification to a new position in the modal
- THEN the displayed queue order changes
- AND queue positions are recalculated on the dashboard cards and in the modal
- AND running specifications remain unaffected

#### Scenario: Opening a queued specification
- WHEN the user selects a queued specification in the modal
- THEN the modal closes
- AND the full workspace for that specification opens

#### Scenario: Closing the priority queue
- WHEN the user closes the modal using its close control, Escape key, or backdrop
- THEN the dashboard remains visible
- AND focus returns to the Priority Queue button

### Requirement: Visual presentation

The dashboard SHALL follow the SpecOps visual design language.

#### Scenario: Rendering the application
- WHEN the dashboard is displayed
- THEN it uses the dark charcoal and orange theme
- AND no permanent navigation sidebar or specification detail panel is displayed
- AND no permanent priority queue panel is displayed
- AND native operating-system window controls are preserved
- AND the specification list and grid use the available dashboard content width
- AND specification cards adapt to available window width

#### Scenario: Switching display modes
- WHEN the user switches between list and grid modes
- THEN the selected mode continues to use the available dashboard content width
- AND grid cards form additional columns when the window is wide enough
- AND the collection remains usable without horizontal page overflow at narrow widths
