import { topOf } from '../utils/analytics.js';

export default function SummaryCards({ rows, totalRows }) {
  const issue = topOf(rows, 'issue');
  const route = topOf(rows, 'route');
  const cards = [
    { label: 'Total breakdowns', value: rows.length.toLocaleString(), sub: rows.length === totalRows ? 'All records' : `of ${totalRows.toLocaleString()} (filtered)` },
    { label: 'Most frequent issue', value: issue ? issue.name : '—', sub: issue ? `${issue.count} breakdowns` : '' },
    { label: 'Worst-performing route', value: route ? route.name : '—', sub: route ? `${route.count} breakdowns` : '' },
  ];
  return (
    <section className="cards">
      {cards.map((c) => (
        <div key={c.label} className="card glass">
          <span className="card-label">{c.label}</span>
          <strong className="card-value" title={c.value}>{c.value}</strong>
          <span className="muted">{c.sub}</span>
        </div>
      ))}
    </section>
  );
}
