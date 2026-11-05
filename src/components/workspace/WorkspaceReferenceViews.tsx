import { FileText } from 'lucide-react';
import type { Specification } from '../../types/specification';
import type { WorkspaceDetails } from '../../data/mockWorkspace';
import { GitHubInfo } from './WorkspaceInfoPanel';

export function FilesView({ details }: { details: WorkspaceDetails }) {
  return <section className="workspace-view-card"><h2>Changed Files</h2>{details.files.length ? <ul className="workspace-files-list">{details.files.map(file => <li key={file.path}><FileText size={18}/><span>{file.path}</span><strong className={`file-${file.status.toLowerCase()}`}>{file.status}</strong></li>)}</ul> : <p className="workspace-info-empty">No changed files available for this specification.</p>}</section>;
}

export function GitHubView({ specification, details, onOpenReference }: { specification: Specification; details: WorkspaceDetails; onOpenReference: (url?: string) => void }) {
  return <section className="workspace-view-card workspace-github-view"><h2>GitHub</h2><GitHubInfo specification={specification} details={details} onOpenReference={onOpenReference}/><div className="workspace-ci-status"><h3>CI status</h3><p>{details.ciStatus ?? 'Not available'}</p></div></section>;
}
