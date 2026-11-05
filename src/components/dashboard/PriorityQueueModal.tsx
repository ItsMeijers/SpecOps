import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Specification } from '../../types/specification';
import { PriorityQueue } from './PriorityQueue';
import './priority-queue-modal.css';

type Props = {
  queued: Specification[];
  active: number;
  limit: number;
  onClose: () => void;
  onMove: (id: string, targetIndex: number) => void;
  onSelect: (id: string) => void;
};

export function PriorityQueueModal({ queued, active, limit, onClose, onMove, onSelect }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeRefValue = useRef(onClose);
  closeRefValue.current = onClose;

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRefValue.current();
      }
      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex]:not([tabindex="-1"])') ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    const keepFocusInside = (event: FocusEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) closeRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', keepFocusInside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', keepFocusInside);
    };
  }, []);

  return createPortal(<div className="queue-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} className="queue-modal" role="dialog" aria-modal="true" aria-label="Priority Queue">
      <button ref={closeRef} className="queue-modal-close" type="button" onClick={onClose} aria-label="Close Priority Queue"><X size={19}/></button>
      <PriorityQueue queued={queued} active={active} limit={limit} onMove={onMove} onSelect={onSelect}/>
    </div>
  </div>, document.body);
}
