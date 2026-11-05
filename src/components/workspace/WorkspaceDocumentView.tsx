import type { WorkspaceDocument } from '../../data/mockWorkspace';

const sections = [
  ['Proposal', 'proposal'], ['Requirements', 'requirements'], ['Design', 'design'],
  ['Implementation tasks', 'tasks'], ['Acceptance criteria', 'acceptance'],
] as const;

export function WorkspaceDocumentView({ document }: { document: WorkspaceDocument }) {
  return <section className="workspace-view-card workspace-document" aria-label="Read-only specification preview"><div className="workspace-view-heading"><h2>Specification</h2><span>Read-only mock preview</span></div>
    {sections.map(([title, key]) => <section key={key}><h3>{title}</h3><p>{document[key]}</p></section>)}
  </section>;
}
