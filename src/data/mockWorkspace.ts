import { mockSpecifications } from './mockSpecifications';
import type { WorkflowStep } from '../types/specification';

export type WorkspaceMessage = { id: string; sender: 'Codex' | 'You'; time: string; body: string };
export type WorkspaceActivity = { id: string; description: string; time: string; current?: boolean };
export type WorkspaceFile = { path: string; status: 'Added' | 'Modified' | 'Deleted' };
export type WorkspaceDocument = { proposal: string; requirements: string; design: string; tasks: string; acceptance: string };
export type WorkspaceDetails = {
  branch?: string;
  worktree?: string;
  started?: string;
  elapsed?: string;
  issueUrl?: string;
  prUrl?: string;
  ciStatus?: string;
  messages: WorkspaceMessage[];
  activities: WorkspaceActivity[];
  files: WorkspaceFile[];
  tasks: WorkflowStep[];
  document: WorkspaceDocument;
};

const defaults = Object.fromEntries(mockSpecifications.map(spec => [spec.id, {
  messages: [], activities: [], files: [], tasks: spec.steps ?? [],
  document: {
    proposal: spec.description,
    requirements: `Review the requirements for ${spec.title}.`,
    design: 'Design preview is unavailable for this mock specification.',
    tasks: spec.steps?.map(step => `• ${step.label}`).join('\n') ?? 'No implementation tasks available.',
    acceptance: 'Acceptance criteria will appear with the complete specification.',
  },
} satisfies WorkspaceDetails])) as Record<string, WorkspaceDetails>;

export const mockWorkspace: Record<string, WorkspaceDetails> = {
  ...defaults,
  'auth-sso': {
    ...defaults['auth-sso'],
    branch: 'feature/authentication-sso',
    worktree: 'spec-482-authentication',
    started: '12 minutes ago',
    elapsed: '12m',
    ciStatus: 'Not run yet',
    messages: [
      { id: 'a1', sender: 'Codex', time: '12 minutes ago', body: "I've implemented the authentication routes and callback handler. Next I'll add token storage and integration tests." },
      { id: 'a2', sender: 'You', time: '5 minutes ago', body: 'Can you also support GitHub OAuth as a provider?' },
      { id: 'a3', sender: 'Codex', time: '4 minutes ago', body: "Yes, I'll add GitHub OAuth support and extend the tests to cover the new provider." },
    ],
    activities: [
      { id: 't1', description: 'Analyzed codebase and issue requirements', time: '11m ago' },
      { id: 't2', description: 'Generated specification', time: '9m ago' },
      { id: 't3', description: 'Implementing authentication backend', time: 'Now', current: true },
    ],
    files: [
      { path: 'src/auth/oauth/callback.rs', status: 'Modified' },
      { path: 'src/components/auth/OAuthButton.tsx', status: 'Added' },
    ],
    document: {
      proposal: 'Implement enterprise SSO with SAML and OIDC, including user provisioning and audit logging.',
      requirements: 'Users can authenticate through configured SAML and OIDC providers. Failed authentication is reported without exposing credentials.',
      design: 'Add provider adapters and a callback handler. Keep token storage isolated from presentation components.',
      tasks: defaults['auth-sso'].tasks.map(step => `• ${step.label}`).join('\n'),
      acceptance: 'Provider sign-in, callback handling, and audit events are verified with integration tests.',
    },
  },
  billing: {
    ...defaults.billing,
    branch: 'feature/billing-portal',
    messages: [{ id: 'b1', sender: 'Codex', time: '4 hours ago', body: 'The billing portal changes are ready for validation.' }],
    activities: [{ id: 'b2', description: 'Reviewing validation results', time: 'Now', current: true }],
    ciStatus: 'Validation in progress',
  },
};
