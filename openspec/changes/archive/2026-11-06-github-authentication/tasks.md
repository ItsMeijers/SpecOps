# Tasks

## 1. Rust status service

- [x] 1.1 Add the GitHub authentication Rust module and async Tauri command registration; verify the desktop app builds with `cargo build --manifest-path src-tauri/Cargo.toml`.
- [x] 1.2 Implement GitHub CLI discovery and bounded authentication status checks, including a compatible identity path for older `gh` versions without JSON status flags; return typed missing, signed-out, signed-in, and error states, and verify Rust tests cover those states, unsupported flags, malformed output, and timeout.
- [x] 1.3 Ensure status output returns only non-secret identity and state, with no token command or raw CLI logging; verify the serialized response and Rust tests contain no access-token field or raw CLI output.

## 2. Authentication handoff

- [x] 2.1 Add a Rust terminal-launch adapter for Windows, macOS, and Linux that runs the fixed GitHub CLI web-login command without waiting for completion; verify launch and fallback behavior using adapter tests and a desktop smoke check on each supported OS.
- [x] 2.2 Return a copyable manual login command when terminal launch fails, and classify launch errors without claiming authentication succeeded; verify a simulated launch failure returns the fallback and a successful launch returns a pending handoff.

## 3. Onboarding integration

- [x] 3.1 Connect the existing GitHub card to the two Rust commands, showing installation guidance, active login, pending handoff, retry, and Refresh status while leaving ChatGPT visual-only and Continue enabled; verify `npm run build` and manually exercise each GitHub card state without blocking navigation.
- [x] 3.2 Update the SecurityCard explanation to reflect GitHub CLI credential ownership and possible file-storage fallback; verify the rendered copy makes no claim that SpecOps stores or secures GitHub tokens.

## 4. End-to-end verification

- [x] 4.1 Run `openspec validate github-authentication`, `cargo test --manifest-path src-tauri/Cargo.toml`, and `npm run build`; verify an installed unauthenticated CLI can start login, an already authenticated CLI shows its active login, and a cancelled or failed login remains recoverable on Windows, macOS, and Linux.
