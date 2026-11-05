# Spec Delta

## ADDED Requirements

### Requirement: Open on account connection screen

The application SHALL show the existing account connection onboarding screen when a new application session starts.

#### Scenario: Application launch
- **WHEN** the user opens SpecOps
- **THEN** the account connection onboarding screen is visible before the dashboard

### Requirement: Continue to dashboard without connected accounts

The onboarding screen SHALL provide an enabled Continue button that opens the main dashboard regardless of whether GitHub or ChatGPT is connected.

#### Scenario: Continue with no connected accounts
- **WHEN** the user starts the application without connected accounts and activates Continue
- **THEN** the main dashboard is displayed

#### Scenario: Continue remains available
- **WHEN** the account connection screen is shown
- **THEN** Continue is enabled without requiring an account connection action

## MODIFIED Requirements

### Requirement: Visual-only account controls
The application SHALL display GitHub and ChatGPT connection buttons without starting authentication, and SHALL display an enabled Continue button.

#### Scenario: User views connection choices
- **WHEN** the onboarding screen is shown
- **THEN** both connection buttons are visible and Continue is enabled

#### Scenario: User clicks a connection button
- **WHEN** the user clicks either connection button
- **THEN** the screen remains on the onboarding view and no external authentication starts
