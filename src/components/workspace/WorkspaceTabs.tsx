import { Activity, FileText, Folder, Github, LayoutDashboard, MessageCircle } from 'lucide-react';
import type { KeyboardEvent } from 'react';

export type WorkspaceTab = 'Overview' | 'Specification' | 'Conversation' | 'Activity' | 'Files' | 'GitHub';
const tabs = [
  { name: 'Overview', Icon: LayoutDashboard },
  { name: 'Specification', Icon: FileText },
  { name: 'Conversation', Icon: MessageCircle },
  { name: 'Activity', Icon: Activity },
  { name: 'Files', Icon: Folder },
  { name: 'GitHub', Icon: Github },
] as const;

export function WorkspaceTabs({ active, onChange }: { active: WorkspaceTab; onChange: (tab: WorkspaceTab) => void }) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, name: WorkspaceTab) => {
    const index = tabs.findIndex(tab => tab.name === name);
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    onChange(tabs[next].name);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next]?.focus();
  };
  return <nav className="workspace-tabs" role="tablist" aria-label="Workspace views">{tabs.map(({ name, Icon }) => <button
    key={name}
    id={`workspace-tab-${name.toLowerCase()}`}
    type="button"
    role="tab"
    aria-selected={active === name}
    aria-controls="workspace-tab-panel"
    tabIndex={active === name ? 0 : -1}
    className={active === name ? 'active' : ''}
    onClick={() => onChange(name)}
    onKeyDown={event => onKeyDown(event, name)}
  ><Icon size={17}/>{name}</button>)}</nav>;
}
