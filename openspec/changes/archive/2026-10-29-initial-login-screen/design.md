# Design

## Context

The desktop scaffold already renders the initial onboarding screen. This revision replaces its cropped mountain artwork with the supplied city image. See `proposal.md` for the purpose and `specs/desktop-onboarding/spec.md` for observable behavior.

## Goals / Non-Goals

**Goals:** Preserve the reference layout and content at 1536×1024 while using the requested background, retain usable layout as the desktop window resizes, and keep the frontend independent of the minimal native shell.

**Non-Goals:** OAuth, account state, navigation, API calls, repository selection, or agent execution.

## Decisions

- Use a Vite React/TypeScript frontend and Tauri 2 native shell. Vite keeps the development setup small and works with Tauri's frontend URL and static build directory.
- Use Tailwind CSS 4 through its Vite plugin, with shared color and type tokens in the stylesheet. Small React components own repeated card and progress markup.
- Use `public/assets/background.png` as the background image across the onboarding webview, behind both the branding area and authentication panel. Render the logo, cards, and controls with frontend code. The webview content fills its available area without an inset frame.
- Enable standard Tauri window decorations and the normal platform title bar. Remove the custom React title bar, traffic lights, drag region, and its extra permission so window chrome comes from the operating system.

## Risks / Trade-offs

- The requested city background differs from the original mountain reference. Size it to cover the screen and keep text readable over its brighter left side.
- Native WebView font rendering may differ slightly across operating systems. System sans fallback and fixed reference dimensions limit drift.
- Native title bars differ in size and appearance across operating systems. Keep the webview layout responsive to the client area instead of positioning content around a simulated title bar.
