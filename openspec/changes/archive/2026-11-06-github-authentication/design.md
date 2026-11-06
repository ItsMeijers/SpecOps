# Design

## Context

See `proposal.md` for motivation and the two delta specs for behavior. The Rust backend currently registers no Tauri commands, and the React onboarding screen renders a reusable integration card with inert connection buttons. The existing onboarding contract keeps Continue available without an account. GitHub CLI owns its credentials and offers browser-based login plus machine-readable authentication status.

## Goals / Non-Goals

**Goals:**

- Keep process execution, CLI output parsing, and authentication state classification in Rust; send only a small non-secret state object to React.
- Keep the Tauri UI responsive throughout a login that may take minutes.
- Use the same status and login behavior on Windows, macOS, and Linux, with a usable fallback when a terminal cannot be opened.

**Non-Goals:**

- Managing GitHub CLI's account list, switching accounts, signing out, or changing its credential store.
- Implementing an OAuth client, processing a GitHub token, supporting GitHub Enterprise, or adding GitHub repository operations.
- Making GitHub connection a prerequisite for Continue.

## Decisions

### Rust service and command boundary

Add a focused `src-tauri/src/github_auth.rs` service and register two async Tauri commands in `lib.rs`: `github_auth_status` and `github_auth_start`. Use `@tauri-apps/api/core` only to invoke those commands from the onboarding UI. A typed status result distinguishes CLI missing, signed out, signed in with a login, and status error; it includes the OS family for installation guidance. A launch result distinguishes terminal started from a fallback command. No persistent SpecOps account state is needed: each status check asks GitHub CLI for the current active account.

Alternative: run `gh` through a frontend shell plugin. That would move process authority and CLI output handling into the webview and conflict with the Rust-only authentication boundary.

### Status and identity

Locate an executable `gh` and run it with fixed arguments. On CLI versions that support it, check `gh auth status --active --hostname github.com --json hosts`; parse the active `github.com` entry and require `state: success` before returning its `login`. JSON mode can exit zero for authentication problems, so the process exit code alone is insufficient. Some installed CLI versions, including 2.45.0, lack `--active` and `--json` for this command. When the CLI reports an unsupported flag, fall back to `gh api user --hostname github.com --jq .login` for identity. If that command reports an authentication issue, use the older `gh auth status --hostname github.com` output only to distinguish a missing login from invalid credentials; never display or log its raw output. Treat no account as signed out, and preserve an explicit error state for malformed output, failed execution, unavailable network, or invalid credentials. Bound each CLI call so a stalled process cannot leave the UI waiting indefinitely. Show only the login; an avatar or display name is unnecessary here.

Alternative: require users to upgrade GitHub CLI. The compatibility fallback avoids imposing an undocumented minimum version on existing desktop users. Parsing the older human-readable status is limited to a known signed-out message after `gh api user` has already reported an authentication issue.

### Login handoff

Run `gh auth login --web --hostname github.com` in a visible native terminal. Use a platform adapter for Windows, macOS, and Linux, passing the resolved executable path and fixed arguments safely. Launch the terminal promptly and return control to React; do not wait for authentication to finish in a Tauri command. On Linux, try known available terminal emulators; on any platform, if launching fails, present the exact copyable `gh auth login --web --hostname github.com` command and a Refresh status action. Do not parse the CLI's interactive prompts or one-time code. After the user completes or cancels the flow, Refresh status determines the actual account state. Avoid duplicate terminal launches while the UI is in a handoff state, but let the user retry.

Alternative: launch `gh auth login --web` as a hidden child and parse its stderr to extract a device code. That output is designed for people, is not a stable machine-readable API, and requires SpecOps to reproduce part of the CLI login experience. A full embedded terminal or PTY adds more dependencies and UI scope.

### Onboarding and credentials

Give the GitHub card its own state and actions while keeping the ChatGPT card visual-only. On mount, check status. Show platform-specific official installation guidance if `gh` is absent; show the active login if connected; otherwise offer Connect GitHub and Refresh status. Keep errors in the card without blocking Continue. Revise the SecurityCard text to say that GitHub CLI manages its credentials and SpecOps does not store GitHub tokens; GitHub CLI can fall back to file storage when the OS credential store is unavailable.

Never invoke `gh auth token` or `gh auth status --show-token`, log raw CLI output, or persist a credential in Rust or React. If `GH_TOKEN` or `GITHUB_TOKEN` is present in the process environment, GitHub CLI may select it ahead of stored credentials; report the active identity from CLI status and surface a login failure instead of silently changing the user's environment.

## Risks / Trade-offs

- GUI applications may have a different PATH from the user's terminal, especially on macOS and Linux -> detect the CLI through the app environment and common installation locations; provide installation or manual-command guidance when it cannot be located.
- Terminal launch commands and available Linux emulators vary -> isolate them in a small platform adapter and test a successful launch and fallback on each supported OS.
- A visible terminal can be closed or authentication can fail after SpecOps has launched it -> treat launch as pending, never as success; use Refresh status and offer retry.
- `gh auth status --json` can return zero while an account is invalid -> inspect the JSON state, not only the exit code, and test empty, failed, and malformed results.
- Older GitHub CLI versions reject the JSON status flags -> detect the unsupported-flag error and use the authenticated-user API command; test both command paths.
- GitHub CLI may use an environment token or plain text credential fallback -> avoid token-related output and make the onboarding copy accurate without altering GitHub CLI configuration.

## Migration Plan

Add the Rust service and command registration, then wire the existing GitHub card. Update the security explanation and verify the onboarding remains optional. There is no SpecOps credential data to migrate. Rollback removes the new commands and UI wiring; GitHub CLI credentials remain under the user's control.
