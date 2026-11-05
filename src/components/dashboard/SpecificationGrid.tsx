import type { Specification, ViewMode } from '../../types/specification';
import { SpecificationCard } from './SpecificationCard';

type Props = { specifications: Specification[]; view: ViewMode; queueOrder: string[]; onSelect: (id: string) => void; onClear: () => void };

export function SpecificationGrid({ specifications, view, queueOrder, onSelect, onClear }: Props) {
  if (specifications.length === 0) return <div className="spec-empty"><strong>No specifications found</strong><p>Try a different search, repository, or workflow status.</p><button type="button" onClick={onClear}>Clear filters</button></div>;
  return <div className={`specification-grid ${view === 'grid' ? 'is-grid' : 'is-list'}`}>
    {specifications.map(spec => <SpecificationCard key={spec.id} specification={spec} view={view} queuePosition={queueOrder.indexOf(spec.id) + 1 || undefined} onSelect={() => onSelect(spec.id)} />)}
  </div>;
}
