import { useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { ArrowLeft, Bell, Check, ChevronDown, ListOrdered, Moon, Plus, Search, Settings2, Sun } from 'lucide-react';
import type { Theme } from '../theme';
import { SpecOpsLogo } from './SpecOpsLogo';
import './application-header.css';

type CommonProps = {
  theme: Theme;
  onTheme: (theme: Theme) => void;
  activeAgents: number;
  limit: number;
  attentionCount: number;
  inboxOpen: boolean;
  queueOpen: boolean;
  onQueue: (trigger: HTMLButtonElement) => void;
  onInbox: () => void;
  onSettings: () => void;
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
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const darkOptionRef = useRef<HTMLButtonElement>(null);
  const lightOptionRef = useRef<HTMLButtonElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (props.mode === 'dashboard' && !props.enabled) setProfileOpen(false);
  }, [props.mode, props.mode === 'dashboard' ? props.enabled : true]);

  useEffect(() => {
    if (!profileOpen) return;
    (props.theme === 'dark' ? darkOptionRef : lightOptionRef).current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const current = document.activeElement;
        if (current === darkOptionRef.current || current === lightOptionRef.current) {
          event.preventDefault();
          (current === darkOptionRef.current ? lightOptionRef : darkOptionRef).current?.focus();
        }
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [profileOpen, props.theme]);

  useEffect(() => {
    if (props.mode !== 'dashboard' || !props.enabled || profileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [props.mode, props.mode === 'dashboard' ? props.enabled : false, profileOpen]);

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
      <div className="application-header__profile" ref={profileRef}>
        <button ref={profileButtonRef} className="application-header__account" type="button" onClick={() => setProfileOpen(value => !value)} aria-label="Profile and appearance" aria-haspopup="menu" aria-expanded={profileOpen}><span>TM</span><ChevronDown size={16}/></button>
        {profileOpen && <div className="application-header__profile-menu" role="menu" aria-label="Appearance">
          <div className="application-header__profile-heading">Appearance</div>
          <button ref={darkOptionRef} type="button" role="menuitemradio" aria-checked={props.theme === 'dark'} onClick={() => { props.onTheme('dark'); setProfileOpen(false); profileButtonRef.current?.focus(); }}><Moon size={16}/>Dark{props.theme === 'dark' && <Check size={16} className="profile-check"/>}</button>
          <button ref={lightOptionRef} type="button" role="menuitemradio" aria-checked={props.theme === 'light'} onClick={() => { props.onTheme('light'); setProfileOpen(false); profileButtonRef.current?.focus(); }}><Sun size={16}/>Light{props.theme === 'light' && <Check size={16} className="profile-check"/>}</button>
        </div>}
      </div>
    </div>
  </header>;
}
