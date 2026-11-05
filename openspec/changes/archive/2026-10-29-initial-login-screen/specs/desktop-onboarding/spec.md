# Spec Delta

## Purpose

Defines the first-run desktop onboarding view that introduces SpecOps and displays account connection options before functional integrations exist.

## ADDED Requirements

### Requirement: Initial onboarding presentation
The application SHALL open to a two-section onboarding view with SpecOps branding, introduction, three progress steps, and account connection content matching the supplied visual reference's layout and text.

#### Scenario: App starts
- **WHEN** the user opens the desktop application
- **THEN** the branding section and account connection panel are visible within one window

### Requirement: Authentication screen background
The application SHALL display the supplied `background.png` image as the background across the onboarding screen behind both sections, without the former cropped landscape artwork.

#### Scenario: Onboarding background is visible
- **WHEN** the onboarding screen is shown
- **THEN** the city background image is visible behind the branding content and authentication panel

### Requirement: Native desktop window
The application SHALL use the operating system's native window decorations and title bar. The onboarding webview SHALL fill the available client area without a fabricated window frame, title bar, or macOS traffic lights.

#### Scenario: App opens on a desktop operating system
- **WHEN** the user opens SpecOps on macOS, Windows, or Linux
- **THEN** the operating system provides the window frame and controls, and the onboarding content starts inside the native client area

### Requirement: Visual-only account controls
The application SHALL display GitHub and ChatGPT connection buttons without starting authentication, and SHALL display a disabled Continue button.

#### Scenario: User views connection choices
- **WHEN** the onboarding screen is shown
- **THEN** both connection buttons are visible and Continue appears disabled

#### Scenario: User clicks a connection button
- **WHEN** the user clicks either connection button
- **THEN** the screen remains on the onboarding view and no external authentication starts

### Requirement: Desktop resize support
The onboarding view SHALL retain readable content and usable spacing when the desktop window is resized.

#### Scenario: Window is narrower than reference
- **WHEN** the user narrows the desktop window
- **THEN** the content remains readable without overlapping cards or controls
