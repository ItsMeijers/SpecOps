export type WorkflowStatus =
  | 'draft'
  | 'generating'
  | 'awaiting_approval'
  | 'queued'
  | 'running'
  | 'validating'
  | 'awaiting_merge'
  | 'verifying_main'
  | 'completed'
  | 'needs_attention';

export type TaskProgress = { done: number; total: number };
export type WorkflowStep = { label: string; state: 'done' | 'running' | 'pending'; duration?: string };

export type Specification = {
  id: string;
  title: string;
  description: string;
  repository: string;
  issueNumber?: number;
  tags: string[];
  status: WorkflowStatus;
  agent?: string;
  activity: string;
  progress?: TaskProgress;
  prNumber?: number;
  lastActivity: string;
  activityLabel: string;
  priority: number;
  steps?: WorkflowStep[];
  output?: string[];
};

export type AttentionKind = 'approval' | 'merge' | 'agent_failure' | 'verification_failure';

export type AttentionEvent = {
  id: string;
  specificationId: string;
  kind: AttentionKind;
  reason: string;
  time: string;
};

export type SortMode = 'default' | 'recent' | 'title' | 'priority';
export type ViewMode = 'list' | 'grid';
