# Proposal

## Why

SpecOps currently launches directly into the dashboard, leaving its account connection screen inaccessible in the normal startup flow. The existing Continue button is disabled, so users cannot move from that screen to the dashboard while account connections are still placeholders.

## What Changes

- Open the existing account connection onboarding screen when the application starts.
- Enable Continue and make it open the existing dashboard, even when neither account is connected.
- Keep account connection controls as placeholders for now; connection status does not gate Continue.

## Capabilities

### New Capabilities

- `desktop-onboarding`: Define the startup screen and its transition to the dashboard. This updates the earlier `initial-login-screen` change's disabled Continue behavior; that capability has no main spec yet.

### Modified Capabilities

None.

## Impact

- `src/App.tsx` startup view selection and Continue button behavior.
- No new authentication integration, route dependency, or dashboard data source.
