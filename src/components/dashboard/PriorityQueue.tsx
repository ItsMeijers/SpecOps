import { ArrowDown, ArrowUp, GripVertical, ListOrdered } from 'lucide-react';
import type { Specification } from '../../types/specification';

type Props = { queued: Specification[]; active: number; limit: number; onMove: (id: string, targetIndex: number) => void; onSelect: (id: string) => void };

export function PriorityQueue({ queued, active, limit, onMove, onSelect }: Props) {
  return <section className="queue-panel" id="priority-queue" aria-label="Priority queue">
    <div className="queue-heading"><div><ListOrdered size={18}/><h2>Priority Queue</h2></div><span>{active} / {limit} agents active</span></div>
    <p className="queue-description">Approved work starts when an agent becomes available. Drag items to change priority.</p>
    {queued.length === 0 ? <div className="queue-empty">No specifications are queued.</div> : <ol className="queue-list">{queued.map((spec, index) => <li key={spec.id} draggable
      onDragStart={event => { event.dataTransfer.setData('text/plain', spec.id); event.dataTransfer.effectAllowed = 'move'; }}
      onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }}
      onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) onMove(id, index); }}>
      <span className="queue-handle" title="Drag to reorder"><GripVertical size={17}/></span><span className="queue-position">{index + 1}</span>
      <button className="queue-item-main" type="button" onClick={() => onSelect(spec.id)}><strong>{spec.title}</strong><small>{spec.repository}</small></button>
      <span className="queue-waiting">Waiting</span>
      <div className="queue-move"><button type="button" aria-label={`Move ${spec.title} up`} disabled={index === 0} onClick={() => onMove(spec.id, index - 1)}><ArrowUp size={14}/></button><button type="button" aria-label={`Move ${spec.title} down`} disabled={index === queued.length - 1} onClick={() => onMove(spec.id, index + 1)}><ArrowDown size={14}/></button></div>
    </li>)}</ol>}
  </section>;
}
