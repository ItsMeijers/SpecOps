# Spec Delta

## MODIFIED Requirements

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
- THEN the full workspace for the selected specification is displayed
- AND the user can return to the dashboard overview
