import type { WorkflowStatus } from '../../types/specification';

export const statusMeta: Record<WorkflowStatus, { label: string; tone: 'orange' | 'blue' | 'green' | 'amber' | 'neutral'; group: 'progress' | 'review' | 'completed' | 'draft' }> = {
  draft: { label: 'Draft', tone: 'neutral', group: 'draft' },
  generating: { label: 'Generating', tone: 'blue', group: 'progress' },
  awaiting_approval: { label: 'Awaiting Approval', tone: 'amber', group: 'review' },
  queued: { label: 'Queued', tone: 'neutral', group: 'progress' },
  running: { label: 'In Progress', tone: 'orange', group: 'progress' },
  validating: { label: 'In Review', tone: 'blue', group: 'review' },
  awaiting_merge: { label: 'Awaiting Merge', tone: 'amber', group: 'review' },
  verifying_main: { label: 'Verifying Main', tone: 'blue', group: 'review' },
  completed: { label: 'Completed', tone: 'green', group: 'completed' },
  needs_attention: { label: 'Needs Attention', tone: 'amber', group: 'review' },
};

export const statusOptions: { value: WorkflowStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(statusMeta).map(([value, meta]) => ({ value: value as WorkflowStatus, label: meta.label })),
];
