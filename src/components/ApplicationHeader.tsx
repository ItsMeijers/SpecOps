import { useEffect, useRef } from 'react';
import type { Ref } from 'react';
import { ArrowLeft, Bell, ChevronDown, ListOrdered, Plus, Search, Settings2 } from 'lucide-react';
import { SpecOpsLogo } from './SpecOpsLogo';
import './application-header.css';

type CommonProps = {
  activeAgents: number;
  limit: number;
  attentionCount: number;
  inboxOpen: boolean;
  queueOpen: boolean;
  onQueue: (trigger: HTMLButtonElement) => void;
  onInbox: () => void;
  onSettings: () => void;
  onAccount: () => void;
};

type DashboardProps = CommonProps & {
  mode: 'dashboard';
  enabled: boolean;
  query: string;
  onQuery: (value: string) => void;
  onNew: () => void;
};

type WorkspaceProps = CommonProps & {
  mode: 'workspace';
  onBack: () => void;
  backButtonRef: Ref<HTMLButtonElement>;
};

type Props = DashboardProps | WorkspaceProps;

export function ApplicationHeader(props: Props) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.mode !== 'dashboard' || !props.enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [props.mode, props.mode === 'dashboard' ? props.enabled : false]);

  return <header className={`application-header application-header--${props.mode}`}>
    <div className="application-header__left">
      <div className="application-header__brand"><SpecOpsLogo className="application-header__logo"/><span>Spec<span>Ops</span></span></div>
      <span className="application-header__agents" title={`${props.activeAgents} of ${props.limit} agents active`}><span className="live-dot"/>{props.activeAgents} / {props.limit} agents</span>
    </div>
    {props.mode === 'dashboard'
      ? <label className="application-header__search"><Search size={20} strokeWidth={1.6}/><input ref={searchRef} value={props.query} onChange={event => props.onQuery(event.target.value)} placeholder="Search specifications, issues, or repositories..." aria-label="Search specifications"/><kbd>⌘ K</kbd></label>
      : <button ref={props.backButtonRef} className="application-header__back" type="button" onClick={props.onBack}><ArrowLeft size={17}/>Back to overview</button>}
    <div className="application-header__actions">
      <button className={`application-header__queue ${props.queueOpen ? 'is-active' : ''}`} type="button" onClick={event => props.onQueue(event.currentTarget)} aria-label="Priority Queue" aria-haspopup="dialog" aria-expanded={props.queueOpen}><ListOrdered size={19}/><span>Priority Queue</span></button>
      <button className={`application-header__icon inbox-trigger ${props.inboxOpen ? 'is-active' : ''}`} type="button" onClick={props.onInbox} aria-label={`Attention Inbox, ${props.attentionCount} items`} aria-expanded={props.inboxOpen}><Bell size={20}/>{props.attentionCount > 0 && <span className="application-header__notification-count">{props.attentionCount}</span>}</button>
      <button className="application-header__icon application-header__settings" type="button" onClick={props.onSettings} aria-label="Settings"><Settings2 size={20}/></button>
      {props.mode === 'dashboard' && <button className="application-header__new" type="button" onClick={props.onNew} aria-label="New Specification"><Plus size={18}/><span>New Specification</span></button>}
      <button className="application-header__account" type="button" onClick={props.onAccount} aria-label="Account options"><span>TM</span><ChevronDown size={16}/></button>
    </div>
  </header>;
}
