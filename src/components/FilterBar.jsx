import { useMemo } from 'react';
import OperatorMultiSelect from './OperatorMultiSelect.jsx';
import { routeCountByOperator, uniqueSorted } from '../utils/analytics.js';

function SelectFilter({ label, allLabel, value, options, onChange }) {
  return (
    <label className="filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function FilterBar({ rows, filters, onChange, onReset }) {
  const options = useMemo(
    () => ({
      operators: uniqueSorted(rows, 'operator'),
      routes: uniqueSorted(rows, 'route'),
      types: uniqueSorted(rows, 'type'),
      results: uniqueSorted(rows, 'result'),
      routeCounts: routeCountByOperator(rows),
    }),
    [rows],
  );
  const set = (patch) => onChange({ ...filters, ...patch });
  const active = filters.operators.length || filters.route || filters.type || filters.result;

  return (
    <section className="filters glass">
      <OperatorMultiSelect
        operators={options.operators}
        routeCounts={options.routeCounts}
        selected={filters.operators}
        onChange={(operators) => set({ operators })}
      />
      <SelectFilter label="Route" allLabel="All Routes" value={filters.route} options={options.routes} onChange={(route) => set({ route })} />
      <SelectFilter label="Breakdown Type" allLabel="All Types" value={filters.type} options={options.types} onChange={(type) => set({ type })} />
      <SelectFilter label="Result" allLabel="All Results" value={filters.result} options={options.results} onChange={(result) => set({ result })} />
      <button className="btn ghost" onClick={onReset} disabled={!active}>Reset</button>
    </section>
  );
}
