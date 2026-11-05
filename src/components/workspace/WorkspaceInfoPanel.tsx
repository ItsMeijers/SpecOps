import { ExternalLink } from 'lucide-react';
import type { Specification } from '../../types/specification';
import type { WorkspaceActivity, WorkspaceDetails } from '../../data/mockWorkspace';

export function ActivityTimeline({ activities }: { activities: WorkspaceActivity[] }) {
  if (activities.length === 0) return <p className="workspace-info-empty">No recent activity available.</p>;
  return <ol className="workspace-activity-list">{activities.map(item => <li key={item.id} className={item.current ? 'current' : ''}><span className="workspace-activity-dot"/><span>{item.description}</span><time>{item.time}</time></li>)}</ol>;
}

export function GitHubInfo({ specification, details, onOpenReference }: { specification: Specification; details: WorkspaceDetails; onOpenReference: (url?: string) => void }) {
  return <div className="workspace-github-fields">
    <div><span>Issue</span>{specification.issueNumber ? <button type="button" onClick={() => onOpenReference(details.issueUrl)}>#{specification.issueNumber} {specification.title}<ExternalLink size={13}/></button> : <strong>Not linked</strong>}</div>
    <div><span>Repository</span><strong>{specification.repository}</strong></div>
    <div><span>Branch</span><strong>{details.branch ?? 'Not available'}</strong></div>
    <div><span>Pull Request</span>{specification.prNumber ? <button type="button" onClick={() => onOpenReference(details.prUrl)}>#{specification.prNumber}<ExternalLink size={13}/></button> : <strong>Not created yet</strong>}</div>
  </div>;
}

export function WorkspaceInfoPanel({ specification, details, paused, onOpenReference }: { specification: Specification; details: WorkspaceDetails; paused: boolean; onOpenReference: (url?: string) => void }) {
  const done = details.tasks.filter(task => task.state === 'done').length;
  const total = details.tasks.length;
  const progress = total ? Math.round(done / total * 100) : 0;
  return <aside className="workspace-info" aria-label="Specification information">
    <section className="workspace-info-card"><div className="workspace-info-heading"><h2>Status</h2><span className={`workspace-agent-state ${paused ? 'paused' : ''}`}>{specification.agent ? paused ? 'Paused' : specification.status : 'Unassigned'}</span></div>
      {specification.agent ? <>
        <dl className="workspace-status-fields"><div><dt>Started</dt><dd>{details.started ?? 'Not available'}</dd></div><div><dt>Elapsed time</dt><dd>{details.elapsed ?? 'Not available'}</dd></div><div><dt>Agent</dt><dd>{specification.agent}</dd></div><div><dt>Worktree</dt><dd>{details.worktree ?? 'Not available'}</dd></div><div><dt>Branch</dt><dd>{details.branch ?? 'Not available'}</dd></div></dl>
        <div className="workspace-progress"><h3>Task Progress</h3>{total ? <><div className="workspace-progress-line"><span style={{ width: `${progress}%` }}/></div><small>{done} / {total}</small></> : <p className="workspace-info-empty">No task progress available.</p>}</div>
        <div className="workspace-current-activity"><h3>Current Activity</h3><p><span className="workspace-activity-ring"/>{specification.activity}</p></div>
      </> : <p className="workspace-info-empty">No agent is assigned. Runtime and worktree details are unavailable.</p>}
    </section>
    <section className="workspace-info-card"><h2>GitHub</h2><GitHubInfo specification={specification} details={details} onOpenReference={onOpenReference}/><div className="workspace-recent"><h3>Recent Activity</h3><ActivityTimeline activities={details.activities}/></div></section>
  </aside>;
}
