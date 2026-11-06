# Proposal

## Why

The onboarding screen currently presents a GitHub connection button without authentication behavior. SpecOps needs a first, maintainable GitHub integration that uses the user's installed GitHub CLI and its existing credentials without taking ownership of access tokens.

## What Changes

- Detect whether GitHub CLI is available and show platform-appropriate installation guidance when it is missing.
- Detect the active authenticated GitHub.com account, display its login, and allow the user to start GitHub CLI's browser-based authentication.
- Show recoverable states for authentication, connectivity, and terminal-launch failures while keeping onboarding optional.
- Update the GitHub onboarding control and credential explanation; leave the ChatGPT control visual-only.
- Keep authentication and process execution in Rust. SpecOps will not read, store, or display GitHub access tokens.

## Capabilities

### New Capabilities

- `github-authentication`: GitHub CLI availability, active-account detection, authentication handoff, identity display, and recoverable failures.

### Modified Capabilities

- `desktop-onboarding`: Make the GitHub connection control functional while preserving the visual-only ChatGPT control and the ability to continue without connected accounts.

## Impact

The change affects the Tauri Rust backend, its command registration, the React onboarding GitHub card, and onboarding copy and styling. GitHub CLI is an external prerequisite; Windows, macOS, and Linux need installation guidance and a terminal handoff or manual-command fallback. Repository operations, account switching, GitHub Enterprise, and other GitHub workflows remain outside this change.
