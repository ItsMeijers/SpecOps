# Dashboard Spec Delta

## MODIFIED Requirements

### Requirement: Visual presentation

The dashboard SHALL follow the SpecOps visual design language in the selected Dark or Light appearance.

#### Scenario: Rendering the application
- WHEN the dashboard is displayed
- THEN it uses the selected appearance with orange accents and readable status colors
- AND no permanent navigation sidebar or specification detail panel is displayed
- AND no permanent priority queue panel is displayed
- AND native operating-system window controls are preserved
- AND the specification list and grid use the available dashboard content width
- AND the specification cards adapt to available window width

#### Scenario: Switching display modes
- WHEN the user switches between list and grid modes
- THEN the selected mode continues to use the available dashboard content width
- AND grid cards form additional columns when the window is wide enough
- AND the collection remains usable without horizontal page overflow at narrow widths

#### Scenario: Light dashboard reference
- WHEN Light is active on the dashboard
- THEN its background, cards, borders, controls, text, and status treatments follow `designs/main-dashboard-light.png` where depicted
- AND card activation still opens the workspace without retaining a dashboard selection state
