export default function ChartTooltip({ active, payload, label, valueLabel = 'Breakdowns', total }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = label ?? p.name;
  const pct = total ? ` (${((p.value / total) * 100).toFixed(1)}%)` : '';
  return (
    <div className="tooltip">
      <div className="tooltip-title">{p.payload?.fullName || name}</div>
      <div className="tooltip-row"><span>{valueLabel}</span><strong>{p.value}{pct}</strong></div>
    </div>
  );
}
