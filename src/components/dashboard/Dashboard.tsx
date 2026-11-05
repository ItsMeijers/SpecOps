import { useMemo, useState } from 'react';
import { Grid2X2, List, X } from 'lucide-react';
import { ApplicationHeader } from '../ApplicationHeader';
import { concurrencyLimit, mockAttentionEvents, mockSpecifications } from '../../data/mockSpecifications';
import type { SortMode, Specification, ViewMode, WorkflowStatus } from '../../types/specification';
import { AttentionInbox } from './AttentionInbox';
import { SpecificationGrid } from './SpecificationGrid';
import { statusMeta, statusOptions } from './status';
import './dashboard.css';

type Group = 'all' | 'progress' | 'review' | 'completed' | 'draft';
const groups: { value: Group; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'progress', label: 'In Progress' },
  { value: 'review', label: 'Review' }, { value: 'completed', label: 'Completed' }, { value: 'draft', label: 'Draft' },
];

function matchesSearch(spec: Specification, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  return [spec.title, spec.repository, spec.description, `#${spec.issueNumber ?? ''}`, String(spec.issueNumber ?? ''), ...spec.tags].some(part => part.toLowerCase().includes(value));
}

export function Dashboard({ active, queueOrder, queueOpen, onOpenQueue, onOpenSpecification }: { active: boolean; queueOrder: string[]; queueOpen: boolean; onOpenQueue: (trigger: HTMLButtonElement) => void; onOpenSpecification: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<Group>('all');
  const [repository, setRepository] = useState('all');
  const [status, setStatus] = useState<WorkflowStatus | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('default');
  const [view, setView] = useState<ViewMode>('list');
  const [inboxOpen, setInboxOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const activeAgents = mockSpecifications.filter(spec => spec.status === 'running' || spec.status === 'generating').length;
  const repositories = [...new Set(mockSpecifications.map(spec => spec.repository))].sort();
  const groupCount = (value: Group) => value === 'all' ? mockSpecifications.length : mockSpecifications.filter(spec => statusMeta[spec.status].group === value).length;

  const visibleSpecifications = useMemo(() => {
    const filtered = mockSpecifications.filter(spec =>
      (group === 'all' || statusMeta[spec.status].group === group) &&
      (repository === 'all' || spec.repository === repository) &&
      (status === 'all' || spec.status === status) && matchesSearch(spec, query));
    if (sort === 'recent') filtered.sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
    if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'priority') filtered.sort((a, b) => a.priority - b.priority);
    return filtered;
  }, [group, repository, status, query, sort]);

  const clearFilters = () => { setQuery(''); setGroup('all'); setRepository('all'); setStatus('all'); setSort('default'); };
  const selectSpec = (id: string) => { setInboxOpen(false); onOpenSpecification(id); };
  return <div className="dashboard">
    <div className="application-header-area">
    <ApplicationHeader mode="dashboard" enabled={active && !queueOpen} query={query} onQuery={setQuery} activeAgents={activeAgents} limit={concurrencyLimit} attentionCount={mockAttentionEvents.length} inboxOpen={inboxOpen} queueOpen={queueOpen} onQueue={onOpenQueue} onInbox={() => setInboxOpen(value => !value)} onNew={() => setNotice('Specification creation will be available in a future change.')} onSettings={() => setNotice('Account settings will be available in a future change.')} onAccount={() => setNotice('Account settings will be available in a future change.')} />
    {inboxOpen && <AttentionInbox events={mockAttentionEvents} specifications={mockSpecifications} onClose={() => setInboxOpen(false)} onSelect={selectSpec} />}
    </div>
    <main className="dashboard-content">
      <div className="dashboard-toolbar"><div className="filter-tabs" role="tablist" aria-label="Workflow groups">{groups.map(item => <button key={item.value} type="button" role="tab" aria-selected={group === item.value} className={group === item.value ? 'selected' : ''} onClick={() => setGroup(item.value)}>{item.label}<span>{groupCount(item.value)}</span></button>)}</div>
        <div className="toolbar-controls"><label className="select-control"><span className="sr-only">Repository</span><select value={repository} onChange={event => setRepository(event.target.value)}><option value="all">Repository</option>{repositories.map(repo => <option key={repo} value={repo}>{repo}</option>)}</select></label>
          <label className="select-control"><span className="sr-only">Workflow status</span><select value={status} onChange={event => setStatus(event.target.value as WorkflowStatus | 'all')}>{statusOptions.map(option => <option key={option.value} value={option.value}>{option.value === 'all' ? 'Status' : option.label}</option>)}</select></label>
          <label className="select-control sort-control"><span className="sr-only">Sort specifications</span><select value={sort} onChange={event => setSort(event.target.value as SortMode)}><option value="default">Sort</option><option value="recent">Recent activity</option><option value="title">Title</option><option value="priority">Priority</option></select></label>
          <div className="view-switch" role="group" aria-label="Display mode"><button type="button" className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'}><List size={20}/></button><button type="button" className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')} aria-label="Grid view" aria-pressed={view === 'grid'}><Grid2X2 size={19}/></button></div>
        </div>
      </div>
      <div className="dashboard-collection"><SpecificationGrid specifications={visibleSpecifications} view={view} queueOrder={queueOrder} onSelect={selectSpec} onClear={clearFilters}/></div>
    </main>
    {notice && <div className="dashboard-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notice"><X size={16}/></button></div>}
  </div>;
}
