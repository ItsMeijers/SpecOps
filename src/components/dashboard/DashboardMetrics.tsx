import { AlertCircle, Bot, FileText, ListOrdered } from 'lucide-react';

type Props = { total: number; activeAgents: number; limit: number; queued: number; attention: number; onQueue: () => void; onAttention: () => void };

export function DashboardMetrics({ total, activeAgents, limit, queued, attention, onQueue, onAttention }: Props) {
  return <div className="dashboard-metrics" aria-label="Workspace summary">
    <span><FileText size={14}/><strong>{total}</strong> specifications</span>
    <span><Bot size={14}/><strong>{activeAgents} / {limit}</strong> active agents</span>
    <button type="button" onClick={onQueue}><ListOrdered size={14}/><strong>{queued}</strong> queued</button>
    <button type="button" onClick={onAttention}><AlertCircle size={14}/><strong>{attention}</strong> need attention</button>
  </div>;
}
