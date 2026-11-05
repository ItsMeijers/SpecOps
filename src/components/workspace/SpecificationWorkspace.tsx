import { useEffect, useRef, useState } from 'react';
import { ExternalLink, GitBranch, LockKeyhole, MoreHorizontal, Pause, Play, X } from 'lucide-react';
import type { Specification } from '../../types/specification';
import { ApplicationHeader } from '../ApplicationHeader';
import { mockWorkspace } from '../../data/mockWorkspace';
import { concurrencyLimit, mockAttentionEvents, mockSpecifications } from '../../data/mockSpecifications';
import { AttentionInbox } from '../dashboard/AttentionInbox';
import { StatusBadge } from '../dashboard/StatusBadge';
import { ConversationPanel } from './ConversationPanel';
import { ActivityTimeline, WorkspaceInfoPanel } from './WorkspaceInfoPanel';
import { WorkspaceTabs } from './WorkspaceTabs';
import type { WorkspaceTab } from './WorkspaceTabs';
import { WorkspaceDocumentView } from './WorkspaceDocumentView';
import { FilesView, GitHubView } from './WorkspaceReferenceViews';
import './workspace.css';

type Props = { specification: Specification; queueOpen: boolean; onOpenQueue: (trigger: HTMLButtonElement) => void; onBack: () => void; onOpenSpecification: (id: string) => void };

export function SpecificationWorkspace({ specification, queueOpen, onOpenQueue, onBack, onOpenSpecification }: Props) {
  const details = mockWorkspace[specification.id];
  const [inboxOpen, setInboxOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const moreWrapRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<WorkspaceTab>('Overview');
  const [messages, setMessages] = useState(details.messages);
  const [draft, setDraft] = useState('');
  const activeAgents = mockSpecifications.filter(item => item.status === 'running' || item.status === 'generating').length;
  useEffect(() => { backButtonRef.current?.focus(); }, []);
  useEffect(() => {
    if (!actionsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') { setActionsOpen(false); moreButtonRef.current?.focus(); } };
    const onPointerDown = (event: PointerEvent) => { if (!moreWrapRef.current?.contains(event.target as Node)) setActionsOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.removeEventListener('pointerdown', onPointerDown); };
  }, [actionsOpen]);
  const sendMessage = () => {
    const body = draft.trim();
    if (!body) return;
    setMessages(current => [...current, { id: `${specification.id}-${Date.now()}`, sender: 'You', time: 'Now', body }]);
    setDraft('');
  };
  const openGitHub = (url?: string) => url ? window.open(url, '_blank', 'noopener,noreferrer') : setNotice('No GitHub URL is available for this mock specification.');
  return <div className="spec-workspace">
    <div className="application-header-area">
    <ApplicationHeader mode="workspace" onBack={onBack} backButtonRef={backButtonRef} activeAgents={activeAgents} limit={concurrencyLimit} attentionCount={mockAttentionEvents.length} inboxOpen={inboxOpen} queueOpen={queueOpen} onQueue={onOpenQueue} onInbox={() => setInboxOpen(value => !value)} onSettings={() => setNotice('Account settings will be available in a future change.')} onAccount={() => setNotice('Account options will be available in a future change.')} />
    {inboxOpen && <AttentionInbox
      events={mockAttentionEvents}
      specifications={mockSpecifications}
      onClose={() => setInboxOpen(false)}
      onSelect={id => { setInboxOpen(false); onOpenSpecification(id); }}
    />}
    </div>
    <main className="workspace-shell">
      <div className="workspace-spec-heading">
        <div className="workspace-spec-main">
          <span className="workspace-spec-icon"><LockKeyhole size={29}/></span>
          <div className="workspace-spec-copy">
            <h1>{specification.title}</h1>
            <div className="workspace-spec-meta"><span>{specification.issueNumber ? `#${specification.issueNumber}` : 'No linked issue'} · {specification.repository}</span>{details?.branch && <span className="workspace-branch"><GitBranch size={13}/>{details.branch}</span>}</div>
          </div>
        </div>
        <div className="workspace-spec-actions">
          {paused ? <span className="workspace-paused-badge">Paused</span> : <StatusBadge status={specification.status}/>}
          {specification.agent && specification.status === 'running' && <button className="workspace-action-button" type="button" onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? 'Resume' : 'Pause'}</button>}
          <button className="workspace-action-button" type="button" onClick={() => openGitHub(details?.issueUrl)}><ExternalLink size={15}/>View on GitHub</button>
          <div className="workspace-more-wrap" ref={moreWrapRef}><button ref={moreButtonRef} className="workspace-action-button workspace-more-button" type="button" onClick={() => setActionsOpen(value => !value)} aria-expanded={actionsOpen} aria-label="More actions"><MoreHorizontal size={20}/></button>{actionsOpen && <div className="workspace-actions-menu" role="menu"><button type="button" role="menuitem" onClick={() => { setNotice('More actions will be available in a future change.'); setActionsOpen(false); moreButtonRef.current?.focus(); }}>More actions · Coming soon</button></div>}</div>
        </div>
      </div>
      <WorkspaceTabs active={tab} onChange={setTab}/>
      <div id="workspace-tab-panel" role="tabpanel" aria-labelledby={`workspace-tab-${tab.toLowerCase()}`} className="workspace-content">
        {tab === 'Overview' ? <>
        <ConversationPanel messages={messages} tasks={details.tasks} draft={draft} onDraft={setDraft} onSend={sendMessage} onUnavailable={label => setNotice(`${label} will be available in a future change.`)}/>
        <WorkspaceInfoPanel specification={specification} details={details} paused={paused} onOpenReference={openGitHub}/>
        </> : tab === 'Specification' ? <WorkspaceDocumentView document={details.document}/>
          : tab === 'Conversation' ? <div className="workspace-full-conversation"><ConversationPanel messages={messages} draft={draft} onDraft={setDraft} onSend={sendMessage} onUnavailable={label => setNotice(`${label} will be available in a future change.`)}/></div>
          : tab === 'Activity' ? <section className="workspace-view-card workspace-activity-view"><h2>Activity</h2><ActivityTimeline activities={details.activities}/></section>
          : tab === 'Files' ? <FilesView details={details}/>
          : tab === 'GitHub' ? <GitHubView specification={specification} details={details} onOpenReference={openGitHub}/>
          : <section className="workspace-view-card"><h2>{tab}</h2></section>}
      </div>
    </main>
    {notice && <div className="workspace-notice" role="status">{notice}<button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notice"><X size={16}/></button></div>}
  </div>;
}
