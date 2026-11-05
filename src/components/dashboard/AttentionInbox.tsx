import { Bell, ChevronRight, X } from 'lucide-react';
import type { AttentionEvent, Specification } from '../../types/specification';

type Props = { events: AttentionEvent[]; specifications: Specification[]; onClose: () => void; onSelect: (id: string) => void };
const kindLabel: Record<AttentionEvent['kind'], string> = { approval: 'Approval', merge: 'Merge', agent_failure: 'Agent failure', verification_failure: 'Verification' };

export function AttentionInbox({ events, specifications, onClose, onSelect }: Props) {
  return <div className="inbox-popover" role="dialog" aria-label="Attention Inbox"><div className="inbox-heading"><div><Bell size={17}/><strong>Attention Inbox</strong><span>{events.length}</span></div><button type="button" aria-label="Close Attention Inbox" onClick={onClose}><X size={17}/></button></div>
    {events.length === 0 ? <div className="inbox-empty">All caught up. Nothing needs your attention.</div> : <div className="inbox-items">{events.map(event => { const spec = specifications.find(item => item.id === event.specificationId); return <button type="button" key={event.id} onClick={() => onSelect(event.specificationId)}><span className="attention-type">{kindLabel[event.kind]} · {event.time}</span><strong>{spec?.title ?? 'Specification'}</strong><small>{event.reason}</small><ChevronRight size={16}/></button>; })}</div>}
  </div>;
}
