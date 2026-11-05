import { useState } from 'react';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { SpecOpsLogo } from './components/SpecOpsLogo';
import { Dashboard } from './components/dashboard/Dashboard';
import { PriorityQueueModal } from './components/dashboard/PriorityQueueModal';
import { SpecificationWorkspace } from './components/workspace/SpecificationWorkspace';
import { concurrencyLimit, initialQueueOrder, mockSpecifications } from './data/mockSpecifications';

const asset = (name: string) => `/assets/${name}`;

const steps = [
  { title: 'Connect your accounts', description: 'Link GitHub and ChatGPT.' },
  { title: 'Select a repository', description: 'Start from an existing project.' },
  { title: 'Create or import a specification', description: 'Turn issues into actionable specs.' },
];

function OnboardingSteps() {
  return (
    <ol className="steps">
      {steps.map((step, index) => (
        <li className={`step ${index === 0 ? 'active' : ''}`} key={step.title}>
          <span className="step-node">{index > 0 && index + 1}</span>
          <span className="step-number">{index + 1}</span>
          <span className="step-copy flex flex-col"><strong>{step.title}</strong><small>{step.description}</small></span>
        </li>
      ))}
    </ol>
  );
}

function BrandSection() {
  return (
    <section className="brand-section" aria-label="About SpecOps">
      <div className="brand-content">
        <div className="brand-lockup flex items-start">
          <SpecOpsLogo className="brand-mark" />
          <div><div className="brand-word">Spec<span>Ops</span></div><div className="brand-subtitle">SPECIFICATION-DRIVEN<br/>AGENT OPERATIONS</div></div>
        </div>
        <h1>Turn ideas into<br/><span>working software.</span></h1>
        <p className="brand-description">Connect your tools, create specifications from GitHub issues, and let AI agents build, test and open pull requests.</p>
        <OnboardingSteps />
      </div>
    </section>
  );
}

type IntegrationCardProps = { name: string; description: React.ReactNode; icon: string; button: string };

function IntegrationCard({ name, description, icon, button }: IntegrationCardProps) {
  return (
    <article className="integration-card flex items-center">
      <img className="integration-icon" src={asset(icon)} alt="" />
      <div className="integration-copy"><h3>{name}</h3><p>{description}</p></div>
      <button className="connect-button" type="button">{button}</button>
    </article>
  );
}

function SecurityCard() {
  return (
    <aside className="security-card flex items-start">
      <span className="security-icon"><LockKeyhole size={31} strokeWidth={1.7} /></span>
      <div><h3>Your accounts, your data</h3><p>SpecOps connects directly with GitHub and OpenAI using secure authentication. Your credentials are stored securely on your device and are never shared with third parties.</p></div>
    </aside>
  );
}

function AuthPanel({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="auth-panel" aria-labelledby="auth-heading">
      <div className="auth-heading"><span className="eyebrow">GET STARTED</span><h2 id="auth-heading">Connect your accounts</h2><p>SpecOps uses your existing accounts. No separate API keys required.</p></div>
      <div className="integration-list grid">
        <IntegrationCard name="GitHub" icon="github-icon.png" description={<>Access your repositories, issues, pull requests<br className="wide-only"/> and GitHub Actions.</>} button="Connect GitHub" />
        <IntegrationCard name="ChatGPT" icon="chatgpt-icon.png" description={<>Use your own ChatGPT/Codex account for<br className="wide-only"/> specifications and AI agent execution.</>} button="Connect ChatGPT" />
      </div>
      <SecurityCard />
      <button className="continue-button flex items-center justify-center" type="button" onClick={onContinue}>Continue <ArrowRight size={20} strokeWidth={1.4}/></button>
    </section>
  );
}

export function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  return <main className="screen"><BrandSection/><AuthPanel onContinue={onContinue}/></main>;
}

export function App() {
  const [screen, setScreen] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [queueOrder, setQueueOrder] = useState(initialQueueOrder);
  const [queueOpen, setQueueOpen] = useState(false);
  const [queueTrigger, setQueueTrigger] = useState<HTMLButtonElement | null>(null);
  const openQueue = (trigger: HTMLButtonElement) => { setQueueTrigger(trigger); setQueueOpen(true); };
  const closeQueue = () => {
    setQueueOpen(false);
    requestAnimationFrame(() => queueTrigger?.focus());
  };
  const moveQueued = (id: string, targetIndex: number) => {
    setQueueOrder(current => {
      const from = current.indexOf(id);
      if (from < 0 || targetIndex < 0 || targetIndex >= current.length || from === targetIndex) return current;
      const next = [...current];
      next.splice(from, 1);
      next.splice(targetIndex, 0, id);
      return next;
    });
  };
  const selectedSpecification = mockSpecifications.find(spec => spec.id === workspaceId);
  const queued = queueOrder.map(id => mockSpecifications.find(spec => spec.id === id)).filter((spec): spec is NonNullable<typeof spec> => Boolean(spec));
  const activeAgents = mockSpecifications.filter(spec => spec.status === 'running' || spec.status === 'generating').length;

  if (screen === 'onboarding') return <OnboardingScreen onContinue={() => setScreen('dashboard')} />;

  return <>
    <div hidden={Boolean(selectedSpecification)}><Dashboard active={!selectedSpecification} queueOrder={queueOrder} queueOpen={queueOpen} onOpenQueue={openQueue} onOpenSpecification={setWorkspaceId}/></div>
    {selectedSpecification && <SpecificationWorkspace key={selectedSpecification.id} specification={selectedSpecification} queueOpen={queueOpen} onOpenQueue={openQueue} onBack={() => setWorkspaceId(null)} onOpenSpecification={setWorkspaceId}/>}
    {queueOpen && <PriorityQueueModal queued={queued} active={activeAgents} limit={concurrencyLimit} onMove={moveQueued} onClose={closeQueue} onSelect={id => { setQueueOpen(false); setWorkspaceId(id); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.spec-workspace .application-header__back')?.focus()); }}/>}
  </>;
}
