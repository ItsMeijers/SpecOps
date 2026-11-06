import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

type GitHubStatus =
  | { kind: 'missing'; platform: 'windows' | 'macos' | 'linux' }
  | { kind: 'signed_out' }
  | { kind: 'signed_in'; login: string }
  | { kind: 'error'; message: string };

type GitHubStart =
  | { kind: 'started' }
  | { kind: 'fallback'; command: string; message: string }
  | { kind: 'missing' };

const installGuidance = {
  windows: { label: 'Windows', command: 'winget install --id GitHub.cli', url: 'https://github.com/cli/cli/blob/trunk/docs/install_windows.md' },
  macos: { label: 'macOS', command: 'brew install gh', url: 'https://github.com/cli/cli/blob/trunk/docs/install_macos.md' },
  linux: { label: 'Linux', command: 'Choose your distribution package', url: 'https://github.com/cli/cli/blob/trunk/docs/install_linux.md' },
};

const asset = (name: string) => `/assets/${name}`;

export function GitHubIntegration() {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [handoff, setHandoff] = useState<GitHubStart | null>(null);
  const [busy, setBusy] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const refreshStatus = useCallback(async () => {
    setBusy(true);
    try {
      const next = await invoke<GitHubStatus>('github_auth_status');
      setStatus(next);
      setHandoff(null);
    } catch {
      setStatus({ kind: 'error', message: 'Could not check GitHub authentication. Please retry.' });
      setHandoff(null);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => { void refreshStatus(); }, [refreshStatus]);

  const startAuthentication = async () => {
    setBusy(true);
    setCopyError(false);
    try {
      const result = await invoke<GitHubStart>('github_auth_start');
      if (result.kind === 'missing') {
        await refreshStatus();
      } else {
        setHandoff(result);
      }
    } catch {
      setStatus({ kind: 'error', message: 'Could not start GitHub authentication. Please retry.' });
      setHandoff(null);
    } finally {
      setBusy(false);
    }
  };

  const refreshAction = !status || status.kind === 'missing' || status.kind === 'signed_in' || Boolean(handoff);
  const buttonLabel = busy ? 'Checking...' : refreshAction ? 'Refresh status' : 'Connect GitHub';
  const install = status?.kind === 'missing' ? installGuidance[status.platform] : null;

  return (
    <article className="integration-card integration-card--github flex items-center" aria-label="GitHub connection">
      <img className="integration-icon" src={asset('github-icon.png')} alt="" />
      <div className="integration-copy">
        <h3>GitHub</h3>
        {!status && <p role="status">Checking GitHub CLI...</p>}
        {status?.kind === 'missing' && <p role="status">GitHub CLI is not installed. For {install?.label}, {install?.command}. <a href={install?.url} target="_blank" rel="noopener noreferrer">Installation guide</a></p>}
        {status?.kind === 'signed_out' && !handoff && <p role="status">No active GitHub account. Connect with GitHub CLI.</p>}
        {status?.kind === 'signed_in' && <p role="status">Connected as <strong>{status.login}</strong>.</p>}
        {status?.kind === 'error' && !handoff && <p role="alert">{status.message}</p>}
        {handoff?.kind === 'started' && <p role="status">Complete sign-in in the terminal, then refresh status.</p>}
        {handoff?.kind === 'fallback' && <div className="github-fallback" role="alert"><p>{handoff.message}</p><code>{handoff.command}</code><button type="button" onClick={() => { void navigator.clipboard.writeText(handoff.command).then(() => setCopyError(false)).catch(() => setCopyError(true)); }}>Copy command</button>{copyError && <p>Could not copy. Select the command above to copy it.</p>}</div>}
        {status?.kind === 'error' && !handoff && <button className="github-secondary" type="button" onClick={() => { void refreshStatus(); }} disabled={busy}>Retry status</button>}
      </div>
      <button className="connect-button" type="button" onClick={() => { void (refreshAction ? refreshStatus() : startAuthentication()); }} disabled={busy}>{buttonLabel}</button>
    </article>
  );
}
