import { Check, CircleAlert, Clock3, FileText, GitBranch, MoreHorizontal, RotateCw } from 'lucide-react';
import type { Specification, ViewMode } from '../../types/specification';
import { StatusBadge } from './StatusBadge';
import { statusMeta } from './status';

type Props = { specification: Specification; view: ViewMode; queuePosition?: number; onSelect: () => void };

export function SpecificationCard({ specification: spec, view, queuePosition, onSelect }: Props) {
  const meta = statusMeta[spec.status];
  const progress = spec.progress;
  const percent = progress && progress.total ? Math.round(progress.done / progress.total * 100) : 0;
  const showProgress = ['running', 'generating', 'validating', 'completed', 'draft'].includes(spec.status);
  return <article
    className={`spec-card ${view === 'grid' ? 'grid-card' : ''}`}
    role="button" tabIndex={0} aria-label={`Open ${spec.title}`}
    onClick={onSelect} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(); } }}
  >
    <span className={`spec-file-icon tone-${meta.tone}`}>{spec.status === 'completed' ? <Check size={25}/> : spec.status === 'needs_attention' ? <CircleAlert size={25}/> : <FileText size={26}/>}</span>
    <div className="spec-main"><h3 title={spec.title}>{spec.title}</h3><p>{spec.description}</p><div className="spec-tags"><span className="repo-label"><GitBranch size={15}/>{spec.repository}</span>{spec.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></div>
    <div className="spec-progress"><StatusBadge status={spec.status}/>
      {showProgress && progress ? <><div className={`progress-track tone-${meta.tone}`}><span style={{ width: `${percent}%` }}/></div><div className="progress-label"><span>{progress.done} / {progress.total} steps</span><span>{percent}%</span></div></> :
        <div className="status-message">{queuePosition ? `Queue position #${queuePosition}` : spec.status === 'awaiting_approval' ? 'Approval required' : spec.status === 'awaiting_merge' ? 'Merge approval required' : spec.status === 'needs_attention' ? 'Intervention required' : 'Checking main branch'}</div>}
    </div>
    <div className="spec-activity"><span className="spec-agent">{spec.agent ? <><span className="codex-knot">◎</span>{spec.agent}</> : <span className="muted-agent">No agent assigned</span>}</span><span className="spec-last"><Clock3 size={16}/>{spec.activityLabel}<GitBranch size={16}/>{spec.prNumber ? `#${spec.prNumber}` : spec.issueNumber ? `#${spec.issueNumber}` : '—'}</span><span className="activity-summary">{spec.activity}</span></div>
    <span className="card-more" aria-hidden="true">{spec.status === 'validating' ? <RotateCw size={16}/> : <MoreHorizontal size={19}/>}</span>
  </article>;
}
