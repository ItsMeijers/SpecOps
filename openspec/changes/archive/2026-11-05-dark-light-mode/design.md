# Design

## Context

See `proposal.md` for motivation and the delta specs for behavior. `App.tsx` owns navigation and shared queue state, while both application screens render `ApplicationHeader`. Its account button currently invokes an unavailable-action notice. Onboarding is rendered before the dashboard and uses `background.png`. Styles across `styles.css`, `application-header.css`, dashboard CSS, workspace CSS, and modal CSS contain fixed dark colors; the Priority Queue modal is rendered into `document.body`.

## Goals / Non-Goals

**Goals:**

- Use one theme choice across every React screen and overlay, including portal content.
- Preserve the established dark look and make the supplied light dashboard image the palette reference.
- Apply a saved choice before the first visible screen and keep user workflows and state intact while switching.

**Non-Goals:**

- Account synchronization, an OS-following third mode, or theme controls before the profile button is available.
- Recreating a persistent selected specification card shown in the light reference; current card activation navigates to a workspace.
- Replacing the onboarding background image or changing native window decorations.

## Decisions

1. **One app-level theme value.** Keep `dark | light` above onboarding, dashboard, and workspace in `App`, and pass the value and selection callback to the shared header. Initialize from a single local-storage key, accepting only those two values and defaulting to dark when the value is missing or unreadable. Write the choice when it changes. An app-level value avoids one screen or the queue modal lagging behind another; separate screen state would make navigation inconsistent.
2. **Set the root theme before first paint.** Apply a `data-theme` attribute and matching `color-scheme` to the document root before React mounts, using the same validated preference read as React initialization. Update the root attribute when the choice changes. The queue modal is portaled to `document.body`, so a document-root selector reaches it as well. A React-only effect could briefly show dark colors before a saved light choice appears.
3. **Use semantic color tokens.** Define dark and light values for page, surface, raised surface, border, primary/muted text, hover, focus, accent, and status treatments. Replace hard-coded colors across the active frontend styles with those tokens, preserving intentional status hues and existing layout metrics. Use the light image for dashboard colors; derive equivalent light surfaces for workspace, onboarding, inbox, queue, menus, and notices. A long layer of light-only overrides would leave components and interaction states easy to miss.
4. **Make the existing account control a real shared menu.** Implement the dropdown once in `ApplicationHeader`, anchored to the profile button in both modes. Expose Dark and Light as keyboard-operable choices with the active option announced to assistive technology. Support Escape and outside-click dismissal, return focus to the trigger after Escape, and retain the existing placeholder feedback for the separate Settings control. A shared menu keeps the behavior identical on dashboard and workspace.
5. **Preserve screen behavior.** Theme changes update presentation in place and do not remount the dashboard or workspace, reset search, filters, sort, view mode, queue order, selected workspace, or selected tab. Preserve the onboarding image under a light overlay that keeps its content readable. Keep the light reference's orange emphasis on focus and hover without reviving persistent card selection.

## Risks / Trade-offs

- [Fixed dark colors remain in a component] → Audit every active CSS file and inspect dashboard list/grid, all workspace tabs, onboarding, popovers, modal, notices, hover, disabled, and focus states in both schemes.
- [Light status colors lose contrast] → Tune text, badge backgrounds, progress tracks, and focus outlines against light surfaces while keeping orange, blue, and green meanings distinct.
- [Saved light choice flashes dark on launch] → Set the root attribute before React renders and test a fresh launch with Light saved.
- [Profile menu is inaccessible at narrow widths] → Keep the trigger reachable at existing header breakpoints and verify keyboard and pointer dismissal at narrow and wide windows.

## Migration Plan

No stored data migration is needed. Missing or invalid preference values resolve to Dark. Removing the preference restores the existing dark default; the CSS tokens retain dark values matching the current appearance. No backend or dependency changes are required.
