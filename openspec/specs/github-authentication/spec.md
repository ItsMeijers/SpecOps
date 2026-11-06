# github-authentication Specification

## Purpose

Lets a desktop user connect SpecOps to the active GitHub.com account managed by the locally installed GitHub CLI, without SpecOps storing access tokens.

## Requirements

### Requirement: GitHub CLI availability

The application SHALL detect whether GitHub CLI is available and SHALL provide installation guidance appropriate to the user's operating system when it is unavailable.

#### Scenario: GitHub CLI is installed
- WHEN the GitHub connection screen checks local prerequisites
- THEN the application recognizes that GitHub CLI is available
- AND it checks the current GitHub authentication state

#### Scenario: GitHub CLI is missing
- WHEN the GitHub connection screen checks local prerequisites and GitHub CLI is unavailable
- THEN the application explains that GitHub CLI must be installed
- AND it provides official installation guidance for the user's Windows, macOS, or Linux system
- AND the user can check again after installing it

### Requirement: Active GitHub identity

The application SHALL detect and display only the active authenticated GitHub.com account selected by GitHub CLI. It SHALL distinguish a signed-out account from a failed status check.

#### Scenario: An active account is already authenticated
- WHEN the application checks GitHub authentication and GitHub CLI reports an active valid GitHub.com account
- THEN the application displays that account's GitHub login
- AND the connection is shown as established

#### Scenario: No active account is authenticated
- WHEN GitHub CLI is available but reports no active authenticated GitHub.com account
- THEN the application offers to start authentication

#### Scenario: Status cannot be confirmed
- WHEN the GitHub authentication check fails because of a CLI, credential, or network error
- THEN the application explains that the status could not be confirmed
- AND it offers a retry without presenting the account as connected

### Requirement: GitHub authentication handoff

The application SHALL let the user start GitHub CLI's browser-based authentication without blocking the SpecOps interface and SHALL provide a manual command when the terminal cannot be launched.

#### Scenario: Start authentication
- WHEN the user selects Connect GitHub and GitHub CLI is available
- THEN the application starts the GitHub CLI authentication flow in a visible terminal
- AND the SpecOps interface remains usable while the user completes the flow

#### Scenario: Terminal launch fails
- WHEN the application cannot open a terminal for GitHub CLI authentication
- THEN it explains the problem and presents a copyable GitHub CLI login command
- AND the user can retry the connection check after running the command

#### Scenario: Authentication completes
- WHEN the user completes GitHub CLI authentication and refreshes the connection state
- THEN the application displays the active authenticated GitHub login

#### Scenario: Authentication does not complete
- WHEN the user cancels authentication or GitHub CLI reports an authentication failure
- THEN the application does not present the account as connected
- AND the user can retry authentication or refresh the connection state

### Requirement: Credential ownership

The application SHALL leave GitHub credentials under GitHub CLI's control and SHALL NOT read, store, display, or log GitHub access tokens.

#### Scenario: Checking or starting authentication
- WHEN the application checks GitHub status or starts the GitHub CLI login flow
- THEN only non-secret connection state and account identity are returned to the interface
- AND SpecOps does not retain an access token
