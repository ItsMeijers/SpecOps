# Design

## Context

`App` currently renders `Dashboard` directly. `OnboardingScreen` and its account cards are already implemented in `src/App.tsx`, but Continue is disabled. The account buttons have no authentication behavior. See `proposal.md` for motivation and `specs/desktop-onboarding/spec.md` for the required flow.

## Goals / Non-Goals

**Goals:**

- Keep the screen transition local to the application root and reuse the existing screen components.
- Let Continue work independently of account state.

**Non-Goals:**

- Authentication, account persistence, or a return path to onboarding.

## Decisions

- Hold the active screen in local `App` state, initialized to onboarding; Continue changes it to the dashboard. This matches the current two-screen flow without introducing routing or persistence. A router would add a dependency and URL semantics that the current desktop application does not need.
- Pass a Continue handler into the existing onboarding panel and remove the button's disabled state. The account buttons remain placeholders. Deriving Continue availability from connection status would conflict with the temporary requirement.

## Risks / Trade-offs

- [A reload returns to onboarding] → Accept for this initial flow; persistent completion is a later decision.
- [The earlier `initial-login-screen` delta says Continue is disabled] → Treat this change's requirement as the current intended behavior when implementing and reconcile the older delta before archiving both into a main spec.
