# Desktop Onboarding Spec Delta

## MODIFIED Requirements

### Requirement: Visual-only account controls
The application SHALL provide a functional GitHub connection control, display a visual-only ChatGPT connection control, and display an enabled Continue button.

#### Scenario: User views connection choices
- **WHEN** the onboarding screen is shown
- **THEN** the GitHub connection control shows its current connection state
- **AND** the ChatGPT connection button is visible
- **AND** Continue is enabled

#### Scenario: User clicks a connection button
- **WHEN** the user clicks the ChatGPT connection button
- **THEN** the screen remains on the onboarding view and no external authentication starts

#### Scenario: User clicks the GitHub connection button
- **WHEN** the user clicks Connect GitHub and GitHub CLI is available
- **THEN** GitHub CLI authentication starts as specified by the GitHub authentication capability
- **AND** the onboarding screen remains usable
