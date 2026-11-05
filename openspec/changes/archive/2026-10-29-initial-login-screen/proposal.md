# Proposal

## Why

SpecOps needs a desktop foundation and a first-run screen that establishes its visual identity before account connections or agent features are built. The supplied 1536×1024 reference guides the layout and content; `background.png` is the requested background artwork.

## What Changes

- Add a Tauri 2 desktop shell with a React, TypeScript, and Tailwind frontend.
- Show a two-column onboarding screen with branding, progress steps, and account connection cards matching the supplied reference, using `public/assets/background.png` as the screen background.
- Use each operating system's native window frame and title bar; the onboarding content fills the webview without simulated macOS controls or an inset window frame.
- Keep connection controls as visual placeholders and Continue disabled.
- Document installation and launch commands.

## Capabilities

### New Capabilities

- `desktop-onboarding`: The initial, visual-only desktop onboarding experience and its responsive presentation.

### Modified Capabilities

None.

## Impact

Adds frontend and Rust application scaffolding, static visual assets, and npm/Cargo dependencies. No account, repository, API, or persistence behavior is added.
