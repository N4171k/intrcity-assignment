import { useEffect, useMemo, useRef, useState } from 'react';
import { operatorLabel } from '../utils/analytics.js';

export default function OperatorMultiSelect({ operators, routeCounts, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);


  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const visible = useMemo(() => operators.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase())), [operators, query]);
  const toggle = (op) => onChange(selected.includes(op) ? selected.filter((o) => o !== op) : [...selected, op]);

  const summary = selected.length === 0 ? 'All Operators' : selected.length === 1 ? selected[0] : `${selected.length} operators selected`;

  return (
    <div className="filter multiselect" ref={ref}>
      <span>Operator</span>
      <button type="button" className="select-like" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="truncate">{summary}</span>
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="panel glass-strong">
          <input className="search" placeholder="Search operators…" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          <label className="check-row all">
            <input type="checkbox" checked={selected.length === 0} onChange={() => onChange([])} />
            <span className="box" />
            <span>All Operators</span>
          </label>
          <div className="options">
            {visible.map((op) => (
              <label key={op} className="check-row">
                <input type="checkbox" checked={selected.includes(op)} onChange={() => toggle(op)} />
                <span className="box" />
                <span>{operatorLabel(op, routeCounts)}</span>
              </label>
            ))}
            {!visible.length && <div className="muted pad">No operators found</div>}
          </div>
        </div>
      )}
    </div>
  );
}
