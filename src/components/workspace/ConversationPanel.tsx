import { Check, Circle, Code2, Paperclip, Send } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { WorkflowStep } from '../../types/specification';
import type { WorkspaceMessage } from '../../data/mockWorkspace';

type Props = {
  messages: WorkspaceMessage[];
  tasks?: WorkflowStep[];
  draft: string;
  onDraft: (value: string) => void;
  onSend: () => void;
  onUnavailable: (label: string) => void;
};

function Message({ message }: { message: WorkspaceMessage }) {
  return <div className={`workspace-message ${message.sender === 'You' ? 'from-user' : 'from-codex'}`}>
    <span className="workspace-message-avatar">{message.sender === 'You' ? 'TM' : '✦'}</span>
    <div className="workspace-message-content"><div className="workspace-message-heading"><strong>{message.sender}</strong><time>{message.time}</time></div><p>{message.body}</p></div>
  </div>;
}

export function TaskChecklist({ tasks }: { tasks: WorkflowStep[] }) {
  if (tasks.length === 0) return <div className="workspace-empty">No implementation tasks available for this specification.</div>;
  return <ol className="workspace-task-list">{tasks.map((task, index) => <li className={`workspace-task ${task.state}`} key={`${task.label}-${index}`}>
    <span className="workspace-task-icon">{task.state === 'done' ? <Check size={14}/> : task.state === 'running' ? <span/> : <Circle size={20}/>}</span>
    <span>{task.label}</span><small>{task.state === 'done' ? task.duration ?? 'Completed' : task.state === 'running' ? 'In progress' : 'Not started'}</small>
  </li>)}</ol>;
}

export function ConversationPanel({ messages, tasks, draft, onDraft, onSend, onUnavailable }: Props) {
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSend(); }
  };
  return <section className="workspace-conversation" aria-label="Codex conversation">
    <div className="workspace-conversation-scroll">
      {messages.length === 0 ? <div className="workspace-empty">No conversation messages yet.</div> : messages.map((message, index) => <div key={message.id}>
        <Message message={message}/>
        {index === 0 && tasks && <TaskChecklist tasks={tasks}/>}
      </div>)}
      {messages.length === 0 && tasks && <TaskChecklist tasks={tasks}/>}
    </div>
    <div className="workspace-composer"><textarea aria-label="Message Codex" placeholder="Message Codex while it works..." value={draft} onChange={event => onDraft(event.target.value)} onKeyDown={onKeyDown} rows={1}/><div className="workspace-composer-actions"><button type="button" onClick={() => onUnavailable('Attachments')} aria-label="Attach a file"><Paperclip size={19}/></button><button type="button" onClick={() => onUnavailable('Code context')} aria-label="Add code context"><Code2 size={19}/></button><button className="workspace-send" type="button" onClick={onSend} aria-label="Send message"><Send size={18}/></button></div></div>
  </section>;
}
