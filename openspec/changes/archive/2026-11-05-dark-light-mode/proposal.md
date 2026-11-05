# Proposal

## Why

SpecOps currently has a single dark appearance and no way to change it. A light dashboard reference is now available, and users need a consistent choice of dark or light colors throughout the frontend.

## What Changes

- Add Dark and Light choices to a dropdown opened from the shared user-profile button on the dashboard and specification workspace.
- Apply the selected scheme immediately across the dashboard, workspace, onboarding screen, Priority Queue modal, Attention Inbox, menus, and notices. Keep Dark as the initial choice and save the user's explicit choice on this device across application restarts.
- Use `designs/main-dashboard-light.png` as the visual reference for light surfaces, text, borders, controls, and status colors. Extend that palette to screens and states absent from the image while preserving their layout and behavior.
- Keep the current dark appearance, the existing status meanings, and the onboarding background image. Do not reintroduce persistent selected-card styling from the older reference.

## Capabilities

### New Capabilities

- `appearance-preferences`: App-wide dark/light selection, profile-menu access, persistence, and consistent presentation across frontend surfaces.

### Modified Capabilities

- `dashboard`: Visual presentation supports both selected color schemes instead of requiring dark colors.
- `specification-workspace`: The shared account control opens the appearance menu, and workspace visual consistency supports both schemes.

## Impact

The React application state and shared header, onboarding, dashboard, workspace, queue modal, inbox, and their styles are affected. The change uses local device storage for the preference; it needs no backend, external API, or new dependency.
