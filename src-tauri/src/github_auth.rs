use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env;
use std::io;
use std::io::Read;
use std::path::{Path, PathBuf};
use std::process::{Command, ExitStatus, Stdio};
use std::thread;
use std::time::{Duration, Instant};

const STATUS_TIMEOUT: Duration = Duration::from_secs(15);
const LOGIN_COMMAND: &str = "gh auth login --web --hostname github.com";

#[derive(Debug, PartialEq, Eq, Serialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum GitHubStatus {
    Missing { platform: &'static str },
    SignedOut,
    SignedIn { login: String },
    Error { message: &'static str },
}

#[derive(Serialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum GitHubStart {
    Started,
    Fallback {
        command: String,
        message: &'static str,
    },
    Missing,
}

#[tauri::command]
pub async fn github_auth_status() -> GitHubStatus {
    tauri::async_runtime::spawn_blocking(check_status)
        .await
        .unwrap_or(GitHubStatus::Error {
            message: "Could not check GitHub authentication. Please retry.",
        })
}

#[tauri::command]
pub async fn github_auth_start() -> GitHubStart {
    tauri::async_runtime::spawn_blocking(start_login)
        .await
        .unwrap_or_else(|_| fallback())
}

fn start_login() -> GitHubStart {
    let Some(gh) = find_gh() else {
        return GitHubStart::Missing;
    };
    start_with(&gh, launch_terminal)
}

fn start_with(gh: &Path, launch: impl FnOnce(&Path) -> io::Result<()>) -> GitHubStart {
    match launch(gh) {
        Ok(()) => GitHubStart::Started,
        Err(_) => fallback(),
    }
}

fn fallback() -> GitHubStart {
    GitHubStart::Fallback {
        command: LOGIN_COMMAND.to_owned(),
        message:
            "Could not open a terminal. Run this command in your terminal, then refresh status.",
    }
}

fn login_args() -> [&'static str; 5] {
    ["auth", "login", "--web", "--hostname", "github.com"]
}

#[cfg(target_os = "windows")]
fn launch_terminal(gh: &Path) -> io::Result<()> {
    use std::os::windows::process::CommandExt;
    const CREATE_NEW_CONSOLE: u32 = 0x00000010;
    Command::new(gh)
        .args(login_args())
        .creation_flags(CREATE_NEW_CONSOLE)
        .spawn()
        .map(|_| ())
}

#[cfg(target_os = "macos")]
fn launch_terminal(gh: &Path) -> io::Result<()> {
    let script = mac_terminal_script(gh);
    let status = Command::new("osascript")
        .args(["-e", &script])
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()?;
    if status.success() {
        Ok(())
    } else {
        Err(io::Error::other("Terminal could not start GitHub CLI"))
    }
}

#[cfg(target_os = "linux")]
fn launch_terminal(gh: &Path) -> io::Result<()> {
    if env::var_os("DISPLAY").is_none() && env::var_os("WAYLAND_DISPLAY").is_none() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            "no graphical desktop session",
        ));
    }
    let candidates = [
        ("x-terminal-emulator", "-e"),
        ("gnome-terminal", "--"),
        ("konsole", "-e"),
        ("kitty", "--"),
        ("xterm", "-e"),
    ];
    let roots: Vec<PathBuf> = env::var_os("PATH")
        .map(|path| env::split_paths(&path).collect())
        .unwrap_or_default();
    for (terminal, flag) in candidates {
        if let Some(executable) = find_executable(&roots, terminal) {
            if let Ok(mut child) = Command::new(executable)
                .arg(flag)
                .arg(gh)
                .args(login_args())
                .stdin(Stdio::null())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
            {
                thread::sleep(Duration::from_millis(150));
                match child.try_wait() {
                    Ok(Some(status)) if !status.success() => continue,
                    Ok(_) => return Ok(()),
                    Err(_) => continue,
                }
            }
        }
    }
    Err(io::Error::new(
        io::ErrorKind::NotFound,
        "no supported terminal emulator",
    ))
}

#[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
fn launch_terminal(_gh: &Path) -> io::Result<()> {
    Err(io::Error::new(
        io::ErrorKind::Unsupported,
        "unsupported platform",
    ))
}

#[cfg(any(test, target_os = "macos"))]
fn mac_terminal_script(gh: &Path) -> String {
    let shell_path = format!("'{}'", gh.to_string_lossy().replace('\'', "'\\''"));
    let command = format!("{shell_path} {}", login_args().join(" "));
    let applescript_string = command.replace('\\', "\\\\").replace('"', "\\\"");
    format!("tell application \"Terminal\" to do script \"{applescript_string}\"")
}

fn check_status() -> GitHubStatus {
    let Some(gh) = find_gh() else {
        return GitHubStatus::Missing {
            platform: platform(),
        };
    };
    check_status_with_gh(&gh)
}

fn check_status_with_gh(gh: &Path) -> GitHubStatus {
    match run_status(gh, STATUS_TIMEOUT) {
        Ok(output) if output.status.success() => parse_status(&output.stdout),
        Ok(output) if unsupported_status_flags(&output.stderr) => check_legacy_status(gh),
        Ok(_) => GitHubStatus::Error {
            message: "GitHub CLI could not check authentication. Please retry.",
        },
        Err(message) => GitHubStatus::Error { message },
    }
}

fn unsupported_status_flags(stderr: &[u8]) -> bool {
    let message = String::from_utf8_lossy(stderr);
    message.contains("unknown flag: --active") || message.contains("unknown flag: --json")
}

fn check_legacy_status(gh: &Path) -> GitHubStatus {
    let output = match run_gh(
        gh,
        &["api", "user", "--hostname", "github.com", "--jq", ".login"],
        STATUS_TIMEOUT,
    ) {
        Ok(output) => output,
        Err(message) => return GitHubStatus::Error { message },
    };
    if output.status.success() {
        return match String::from_utf8(output.stdout) {
            Ok(login)
                if !login.trim().is_empty() && !login.trim().contains(char::is_whitespace) =>
            {
                GitHubStatus::SignedIn {
                    login: login.trim().to_owned(),
                }
            }
            _ => GitHubStatus::Error {
                message: "GitHub CLI did not return an account name. Please retry.",
            },
        };
    }
    if output.status.code() == Some(4) {
        if let Ok(auth) = run_gh(
            gh,
            &["auth", "status", "--hostname", "github.com"],
            STATUS_TIMEOUT,
        ) {
            if is_signed_out_message(&auth.stdout, &auth.stderr) {
                return GitHubStatus::SignedOut;
            }
        }
        return GitHubStatus::Error {
            message: "GitHub CLI could not authenticate the active account. Please retry sign-in.",
        };
    }
    GitHubStatus::Error {
        message: "GitHub CLI could not check authentication. Please retry.",
    }
}

fn is_signed_out_message(stdout: &[u8], stderr: &[u8]) -> bool {
    [stdout, stderr].iter().any(|output| {
        let message = String::from_utf8_lossy(output);
        message.contains("You are not logged into any GitHub hosts")
            || message.contains("You are not logged into any accounts on github.com")
    })
}

fn platform() -> &'static str {
    if cfg!(target_os = "windows") {
        "windows"
    } else if cfg!(target_os = "macos") {
        "macos"
    } else {
        "linux"
    }
}

fn executable_name() -> &'static str {
    if cfg!(target_os = "windows") {
        "gh.exe"
    } else {
        "gh"
    }
}

fn find_gh() -> Option<PathBuf> {
    let mut roots: Vec<PathBuf> = env::var_os("PATH")
        .map(|path| env::split_paths(&path).collect())
        .unwrap_or_default();

    #[cfg(target_os = "windows")]
    {
        if let Some(program_files) = env::var_os("ProgramFiles") {
            roots.push(PathBuf::from(program_files).join("GitHub CLI"));
        }
    }
    #[cfg(target_os = "macos")]
    roots.extend(["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin"].map(PathBuf::from));
    #[cfg(target_os = "linux")]
    roots.extend(
        [
            "/usr/bin",
            "/usr/local/bin",
            "/home/linuxbrew/.linuxbrew/bin",
        ]
        .map(PathBuf::from),
    );

    find_executable(&roots, executable_name())
}

fn find_executable(roots: &[PathBuf], name: &str) -> Option<PathBuf> {
    roots
        .iter()
        .map(|root| root.join(name))
        .find(|path| is_executable(path))
}

fn is_executable(path: &Path) -> bool {
    let Ok(metadata) = path.metadata() else {
        return false;
    };
    if !metadata.is_file() {
        return false;
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        metadata.permissions().mode() & 0o111 != 0
    }
    #[cfg(not(unix))]
    {
        true
    }
}

struct GhOutput {
    status: ExitStatus,
    stdout: Vec<u8>,
    stderr: Vec<u8>,
}

fn run_status(gh: &Path, timeout: Duration) -> Result<GhOutput, &'static str> {
    run_gh(
        gh,
        &[
            "auth",
            "status",
            "--active",
            "--hostname",
            "github.com",
            "--json",
            "hosts",
        ],
        timeout,
    )
}

fn run_gh(gh: &Path, args: &[&str], timeout: Duration) -> Result<GhOutput, &'static str> {
    let mut child = Command::new(gh)
        .args(args)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|_| "Could not start GitHub CLI. Please retry.")?;

    let stdout = child
        .stdout
        .take()
        .ok_or("Could not read GitHub CLI status.")?;
    let stderr = child
        .stderr
        .take()
        .ok_or("Could not read GitHub CLI status.")?;
    let stdout_reader = thread::spawn(move || capture_pipe(stdout));
    let stderr_reader = thread::spawn(move || capture_pipe(stderr));

    let deadline = Instant::now() + timeout;
    loop {
        match child.try_wait() {
            Ok(Some(_)) => {
                let status = child.wait().map_err(|_| "Could not wait for GitHub CLI.")?;
                let stdout = stdout_reader
                    .join()
                    .map_err(|_| "Could not read GitHub CLI status.")?
                    .map_err(|_| "GitHub CLI returned too much or unreadable status data.")?;
                let stderr = stderr_reader
                    .join()
                    .map_err(|_| "Could not read GitHub CLI status.")?
                    .map_err(|_| "GitHub CLI returned too much or unreadable status data.")?;
                return Ok(GhOutput {
                    status,
                    stdout,
                    stderr,
                });
            }
            Ok(None) if Instant::now() < deadline => thread::sleep(Duration::from_millis(50)),
            Ok(None) => {
                let _ = child.kill();
                let _ = child.wait();
                return Err("GitHub authentication check timed out. Please retry.");
            }
            Err(_) => {
                let _ = child.kill();
                let _ = child.wait();
                return Err("Could not wait for GitHub CLI. Please retry.");
            }
        }
    }
}

fn capture_pipe(mut pipe: impl Read) -> Result<Vec<u8>, ()> {
    let mut captured = Vec::new();
    let mut chunk = [0_u8; 4096];
    loop {
        let count = pipe.read(&mut chunk).map_err(|_| ())?;
        if count == 0 {
            return Ok(captured);
        }
        if captured.len() + count > 64 * 1024 {
            return Err(());
        }
        captured.extend_from_slice(&chunk[..count]);
    }
}

fn parse_status(output: &[u8]) -> GitHubStatus {
    let Ok(value) = serde_json::from_slice::<StatusEnvelope>(output) else {
        return GitHubStatus::Error {
            message: "GitHub CLI returned an unreadable status. Please retry.",
        };
    };
    let Some(entries) = value.hosts.get("github.com") else {
        return GitHubStatus::SignedOut;
    };
    let Some(active) = entries.iter().find(|entry| entry.active) else {
        return GitHubStatus::SignedOut;
    };
    if active.state != "success" {
        return GitHubStatus::Error {
            message: "GitHub CLI could not authenticate the active account. Please retry sign-in.",
        };
    }
    match active.login.as_deref().filter(|login| !login.is_empty()) {
        Some(login) => GitHubStatus::SignedIn {
            login: login.to_owned(),
        },
        None => GitHubStatus::Error {
            message: "GitHub CLI did not return an account name. Please retry.",
        },
    }
}

#[derive(Deserialize)]
struct StatusEnvelope {
    hosts: HashMap<String, Vec<StatusEntry>>,
}

#[derive(Deserialize)]
struct StatusEntry {
    active: bool,
    state: String,
    login: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn login_uses_fixed_arguments() {
        assert_eq!(
            login_args(),
            ["auth", "login", "--web", "--hostname", "github.com"]
        );
    }

    #[test]
    fn mac_script_quotes_executable_path() {
        let script = mac_terminal_script(Path::new("/Applications/Git Hub/bin/gh"));
        assert!(script
            .contains("'/Applications/Git Hub/bin/gh' auth login --web --hostname github.com"));
    }

    #[test]
    fn successful_launch_is_only_started() {
        assert!(matches!(
            start_with(Path::new("gh"), |_| Ok(())),
            GitHubStart::Started
        ));
    }

    #[test]
    fn launch_failure_returns_manual_command() {
        let result = start_with(Path::new("gh"), |_| {
            Err(io::Error::other("terminal failed"))
        });
        assert!(matches!(
            result,
            GitHubStart::Fallback { command, .. } if command == LOGIN_COMMAND
        ));
    }

    #[test]
    fn missing_executable() {
        assert_eq!(
            find_executable(&[PathBuf::from("/not/a/real/directory")], "gh"),
            None
        );
    }

    #[test]
    fn empty_hosts_are_signed_out() {
        assert_eq!(parse_status(br#"{"hosts":{}}"#), GitHubStatus::SignedOut);
    }

    #[test]
    fn active_account_is_signed_in() {
        assert_eq!(
            parse_status(br#"{"hosts":{"github.com":[{"active":true,"state":"success","login":"octocat"}]}}"#),
            GitHubStatus::SignedIn { login: "octocat".to_owned() }
        );
    }

    #[test]
    fn invalid_credentials_are_an_error() {
        assert!(matches!(
            parse_status(
                br#"{"hosts":{"github.com":[{"active":true,"state":"error","login":"octocat"}]}}"#
            ),
            GitHubStatus::Error { .. }
        ));
    }

    #[test]
    fn malformed_json_is_an_error() {
        assert!(matches!(
            parse_status(b"not JSON"),
            GitHubStatus::Error { .. }
        ));
    }

    #[test]
    fn serialized_status_excludes_cli_secrets() {
        let status = parse_status(br#"{"hosts":{"github.com":[{"active":true,"state":"success","login":"octocat","token":"secret-value","tokenSource":"environment"}]}}"#);
        let serialized = serde_json::to_string(&status).unwrap();
        assert_eq!(serialized, r#"{"kind":"signed_in","login":"octocat"}"#);
    }

    #[test]
    fn unsupported_status_flags_are_detected() {
        assert!(unsupported_status_flags(b"unknown flag: --active"));
        assert!(unsupported_status_flags(b"unknown flag: --json"));
        assert!(!unsupported_status_flags(b"network unavailable"));
    }

    #[cfg(unix)]
    fn fake_gh(name: &str, script: &str) -> PathBuf {
        use std::os::unix::fs::PermissionsExt;
        let path = env::temp_dir().join(format!("specops-{name}-{}", std::process::id()));
        std::fs::write(&path, script).unwrap();
        std::fs::set_permissions(&path, std::fs::Permissions::from_mode(0o700)).unwrap();
        path
    }

    #[cfg(unix)]
    #[test]
    fn older_cli_falls_back_to_authenticated_user() {
        let gh = fake_gh(
            "legacy-success",
            "#!/bin/sh\nif [ \"$1\" = auth ]; then echo 'unknown flag: --active' >&2; exit 1; fi\nif [ \"$1\" = api ]; then echo octocat; exit 0; fi\nexit 1\n",
        );
        let status = check_status_with_gh(&gh);
        std::fs::remove_file(gh).unwrap();
        assert_eq!(
            status,
            GitHubStatus::SignedIn {
                login: "octocat".to_owned()
            }
        );
    }

    #[cfg(unix)]
    #[test]
    fn older_cli_distinguishes_missing_login() {
        let gh = fake_gh(
            "legacy-signed-out",
            "#!/bin/sh\nif [ \"$1\" = api ]; then exit 4; fi\nif [ \"$3\" = --active ]; then echo 'unknown flag: --active' >&2; exit 1; fi\necho 'You are not logged into any GitHub hosts. To log in, run: gh auth login' >&2\nexit 1\n",
        );
        let status = check_status_with_gh(&gh);
        std::fs::remove_file(gh).unwrap();
        assert_eq!(status, GitHubStatus::SignedOut);
    }

    #[cfg(unix)]
    #[test]
    fn older_cli_keeps_invalid_credentials_as_error() {
        let gh = fake_gh(
            "legacy-invalid",
            "#!/bin/sh\nif [ \"$1\" = api ]; then exit 4; fi\nif [ \"$3\" = --active ]; then echo 'unknown flag: --active' >&2; exit 1; fi\necho 'Bad credentials' >&2\nexit 1\n",
        );
        let status = check_status_with_gh(&gh);
        std::fs::remove_file(gh).unwrap();
        assert!(matches!(status, GitHubStatus::Error { .. }));
    }

    #[cfg(unix)]
    #[test]
    fn stalled_command_times_out() {
        use std::os::unix::fs::PermissionsExt;
        let dir = env::temp_dir().join(format!("specops-gh-test-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let command = dir.join("slow-gh");
        std::fs::write(&command, "#!/bin/sh\nsleep 2\n").unwrap();
        std::fs::set_permissions(&command, std::fs::Permissions::from_mode(0o700)).unwrap();
        let started = Instant::now();
        let result = run_status(&command, Duration::from_millis(10));
        std::fs::remove_file(command).unwrap();
        std::fs::remove_dir(dir).unwrap();
        assert!(matches!(
            result,
            Err("GitHub authentication check timed out. Please retry.")
        ));
        assert!(started.elapsed() < Duration::from_secs(1));
    }
}
