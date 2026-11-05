import { Check, Circle, CircleAlert } from 'lucide-react';
import type { WorkflowStatus } from '../../types/specification';
import { statusMeta } from './status';

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  const meta = statusMeta[status];
  return <span className={`status-badge tone-${meta.tone}`}>
    {status === 'completed' ? <Check size={12} strokeWidth={3} /> : status === 'needs_attention' ? <CircleAlert size={12} /> : <Circle size={10} fill="currentColor" strokeWidth={0} />}
    {meta.label}
  </span>;
}
