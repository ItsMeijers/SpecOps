import type { AttentionEvent, Specification } from '../types/specification';

export const concurrencyLimit = 3;

export const mockSpecifications: Specification[] = [
  {
    id: 'auth-sso', title: 'User authentication and SSO',
    description: 'Implement enterprise SSO with SAML and OIDC, including user provisioning, role mapping, and audit logging.',
    repository: 'specops/app', issueNumber: 482, tags: ['auth', 'sso', 'security'], status: 'running', agent: 'ChatGPT Codex',
    activity: 'Implementing authentication backend', progress: { done: 3, total: 5 }, prNumber: 482,
    lastActivity: '2026-10-29T12:36:48Z', activityLabel: '2h 14m', priority: 1,
    steps: [
      { label: 'Analyze codebase and issue requirements', state: 'done', duration: '2m' },
      { label: 'Generate specification', state: 'done', duration: '5m' },
      { label: 'Implement authentication backend', state: 'running' },
      { label: 'Implement frontend components', state: 'pending' },
      { label: 'Add tests and update documentation', state: 'pending' },
    ],
    output: [
      '12:36:14   Running tests for auth module...',
      '12:36:18   ✓ 23/23 tests passed',
      '12:36:21   Checking types...',
      '12:36:25   ✓ Typecheck completed',
      '12:36:28   Implementing OAuth callback handler...',
      '12:36:31   › Writing src/auth/oauth/callback.rs',
      '12:36:34   Updating frontend components...',
      '12:36:37   › Writing src/components/auth/OAuthButton.tsx',
      '12:36:40   Running linter...',
      '12:36:45   ✓ No issues found',
      '12:36:48   Creating commit...',
    ],
  },
  { id: 'billing', title: 'Billing portal enhancements', description: 'Add subscription management and invoice history to the customer portal.', repository: 'specops/app', issueNumber: 479, tags: ['billing', 'payments'], status: 'validating', agent: 'ChatGPT Codex', activity: 'Reviewing validation results', progress: { done: 4, total: 5 }, prNumber: 479, lastActivity: '2026-10-29T11:48:00Z', activityLabel: '4h 32m', priority: 2 },
  { id: 'data-export', title: 'Data export (CSV, Parquet)', description: 'Enable data export in CSV and Parquet formats for all major reports.', repository: 'specops/app', issueNumber: 476, tags: ['data', 'export', 'analytics'], status: 'completed', agent: 'ChatGPT Codex', activity: 'Verified on main', progress: { done: 5, total: 5 }, prNumber: 476, lastActivity: '2026-10-27T09:00:00Z', activityLabel: '2d 3h', priority: 8 },
  { id: 'ui-refresh', title: 'UI/UX refresh for settings', description: 'Redesign settings pages with new component library.', repository: 'specops/app', issueNumber: 480, tags: ['frontend', 'ui/ux'], status: 'running', agent: 'ChatGPT Codex', activity: 'Updating settings components', progress: { done: 3, total: 5 }, prNumber: 480, lastActivity: '2026-10-29T12:01:00Z', activityLabel: '3h 12m', priority: 3 },
  { id: 'repo-onboarding', title: 'Repository onboarding', description: 'Improve repository setup and initial configuration.', repository: 'specops/cli', issueNumber: 488, tags: ['setup', 'devops'], status: 'draft', activity: 'Draft specification created', progress: { done: 0, total: 5 }, lastActivity: '2026-10-28T16:15:00Z', activityLabel: 'Yesterday', priority: 10 },
  { id: 'test-coverage', title: 'Test coverage expansion', description: 'Increase unit test coverage to greater than 90%.', repository: 'specops/app', issueNumber: 491, tags: ['testing', 'ci'], status: 'generating', agent: 'ChatGPT Codex', activity: 'Drafting test plan', progress: { done: 0, total: 5 }, lastActivity: '2026-10-29T10:20:00Z', activityLabel: '5h 05m', priority: 6 },
  { id: 'notifications', title: 'Notification Service', description: 'Add notification delivery for workflow events and approvals.', repository: 'specops/app', issueNumber: 493, tags: ['notifications', 'events'], status: 'awaiting_approval', activity: 'Specification needs approval', progress: { done: 1, total: 5 }, lastActivity: '2026-10-29T09:45:00Z', activityLabel: '6h 02m', priority: 4 },
  { id: 'search-improvements', title: 'Search Improvements', description: 'Improve relevance and query speed across specifications.', repository: 'specops/app', issueNumber: 497, tags: ['search', 'performance'], status: 'queued', activity: 'Approved and waiting for an agent', progress: { done: 1, total: 5 }, lastActivity: '2026-10-29T08:15:00Z', activityLabel: '7h 31m', priority: 1 },
  { id: 'audit-trail', title: 'Audit trail for agent actions', description: 'Record workflow decisions and agent activity for review.', repository: 'specops/engine', issueNumber: 501, tags: ['audit', 'agents'], status: 'queued', activity: 'Approved and waiting for an agent', progress: { done: 1, total: 5 }, lastActivity: '2026-10-29T07:40:00Z', activityLabel: '8h 04m', priority: 2 },
  { id: 'api-rate-limits', title: 'API rate limit handling', description: 'Handle upstream rate limits with clear retry states.', repository: 'specops/engine', issueNumber: 503, tags: ['api', 'reliability'], status: 'needs_attention', agent: 'ChatGPT Codex', activity: 'Agent execution failed; intervention required', progress: { done: 2, total: 5 }, lastActivity: '2026-10-29T12:10:00Z', activityLabel: '3h 01m', priority: 5 },
  { id: 'release-notes', title: 'Release notes automation', description: 'Generate release notes from verified changes.', repository: 'specops/cli', issueNumber: 505, tags: ['release', 'automation'], status: 'awaiting_merge', agent: 'ChatGPT Codex', activity: 'Pull request ready for merge approval', progress: { done: 5, total: 5 }, prNumber: 505, lastActivity: '2026-10-29T10:50:00Z', activityLabel: '4h 20m', priority: 7 },
  { id: 'main-verification', title: 'Main branch verification', description: 'Confirm the merged workflow remains healthy on main.', repository: 'specops/app', issueNumber: 506, tags: ['verification', 'ci'], status: 'verifying_main', agent: 'ChatGPT Codex', activity: 'Checking post-merge verification', progress: { done: 5, total: 5 }, prNumber: 506, lastActivity: '2026-10-29T09:10:00Z', activityLabel: '6h 45m', priority: 9 },
];

export const initialQueueOrder = ['search-improvements', 'audit-trail'];

export const mockAttentionEvents: AttentionEvent[] = [
  { id: 'attention-notifications', specificationId: 'notifications', kind: 'approval', reason: 'Specification awaiting approval', time: '6h ago' },
  { id: 'attention-release', specificationId: 'release-notes', kind: 'merge', reason: 'Pull request awaiting merge approval', time: '4h ago' },
  { id: 'attention-rate-limit', specificationId: 'api-rate-limits', kind: 'agent_failure', reason: 'Agent execution failed; needs intervention', time: '3h ago' },
  { id: 'attention-main', specificationId: 'main-verification', kind: 'verification_failure', reason: 'Post-merge verification needs review', time: '6h ago' },
];
