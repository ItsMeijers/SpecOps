import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Circle, Clock3, ExternalLink, GitBranch } from 'lucide-react';
import type { Specification, WorkflowStep } from '../../types/specification';
import { StatusBadge } from './StatusBadge';

type DetailTab = 'Overview' | 'Steps' | 'Changes' | 'Logs';
type Props = { specification: Specification | null; onBack: () => void; onNotice: (message: string) => void };

function stepsFor(spec: Specification): WorkflowStep[] {
  if (spec.steps) return spec.steps;
  const labels = ['Analyze codebase and issue requirements', 'Generate specification', 'Implement requested changes', 'Run tests and validation', 'Review and verify outcome'];
  const done = spec.progress?.done ?? 0;
  return labels.map((label, index) => ({ label, state: index < done ? 'done' : index === done && ['running', 'generating', 'validating'].includes(spec.status) ? 'running' : 'pending' }));
}

export function SpecificationDetail({ specification: spec, onBack, onNotice }: Props) {
  const [tab, setTab] = useState<DetailTab>('Steps');
  useEffect(() => setTab('Steps'), [spec?.id]);
  if (!spec) return <section className="detail-panel empty-detail"><div className="empty-detail-inner"><strong>Specification overview</strong><p>Select a card to inspect its workflow, steps, and recent activity.</p></div></section>;
  const steps = stepsFor(spec);
  return <section className="detail-panel" aria-label={`${spec.title} details`}>
    <div className="detail-top"><div className="detail-title-row"><span className="detail-file-icon">▤</span><h2 title={spec.title}>{spec.title}</h2><button type="button" className="github-placeholder" onClick={() => onNotice('GitHub integration is not connected in this mock dashboard.')}><GitBranch size={15}/>Open in GitHub<ExternalLink size={13}/></button></div>
      <div className="detail-meta"><span>◎&nbsp; {spec.repository}</span><span><GitBranch size={15}/> #{spec.issueNumber ?? '—'}</span><StatusBadge status={spec.status}/><button className="back-overview" type="button" onClick={onBack}><ArrowLeft size={14}/>Overview</button></div></div>
    <div className="detail-tabs" role="tablist" aria-label="Specification detail sections">{(['Overview','Steps','Changes','Logs'] as DetailTab[]).map(item => <button role="tab" aria-selected={tab === item} className={tab === item ? 'selected' : ''} type="button" key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
    <div className="detail-body">
      {tab === 'Steps' && <div className="steps-panel">{steps.map((step, index) => <div className={`workflow-step ${step.state}`} key={`${step.label}-${index}`}><span className="workflow-step-icon">{step.state === 'done' ? <Check size={16} strokeWidth={2.8}/> : step.state === 'running' ? <span className="running-diamond"/> : <Circle size={24} strokeWidth={2}/>}</span><span className="workflow-step-number">{index + 1}</span><span className="workflow-step-label">{step.label}</span><span className="workflow-step-time">{step.state === 'running' ? 'Running...' : step.duration ?? ''}</span></div>)}</div>}
      {tab === 'Overview' && <div className="detail-overview"><h3>About this specification</h3><p>{spec.description}</p><dl><div><dt>Repository</dt><dd>{spec.repository}</dd></div><div><dt>Current activity</dt><dd>{spec.activity}</dd></div><div><dt>Agent</dt><dd>{spec.agent ?? 'Not assigned'}</dd></div><div><dt>Task progress</dt><dd>{spec.progress ? `${spec.progress.done} of ${spec.progress.total} steps` : 'Not started'}</dd></div></dl></div>}
      {tab === 'Changes' && <div className="detail-placeholder"><GitBranch size={24}/><h3>No changes to show yet</h3><p>Mock workflow changes will appear here as the specification progresses.</p></div>}
      {tab === 'Logs' && <div className="detail-placeholder"><Clock3 size={24}/><h3>Recent activity</h3><p>{spec.activity} · {spec.activityLabel} ago</p></div>}
    </div>
    <div className="agent-output"><div className="agent-output-heading"><strong>Agent output</strong><span><span className="live-dot"/>{spec.status === 'running' ? 'Agent is working...' : spec.agent ? 'Latest mock output' : 'No agent assigned'}</span></div><div className="agent-output-lines">{(spec.output ?? [
      `12:10:04   ${spec.activity}`,
      spec.agent ? `12:10:07   ${spec.agent} updated workflow status` : '12:10:07   Waiting for an available agent',
      `12:10:11   Repository: ${spec.repository}`,
    ]).map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}</div></div>
  </section>;
}
