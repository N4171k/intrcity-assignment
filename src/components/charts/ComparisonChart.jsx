import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../ChartCard.jsx';
import { SERIES_COLORS } from '../../utils/constants.js';

/** Custom tooltip: instead of just the total, lists the breakdown TYPES behind the hovered bar (e.g. AC: 2, Engine: 1). */
function ComparisonTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const bar = payload[0].payload;
  return (
    <div className="tooltip">
      <div className="tooltip-title">{bar.name}</div>
      <div className="tooltip-row total"><span>Total breakdowns</span><strong>{bar.total}</strong></div>
      <div className="tooltip-sep" />
      {bar.types.length ? (
        bar.types.map((t) => (
          <div key={t.type} className="tooltip-row"><span>{t.type}</span><strong>{t.count}</strong></div>
        ))
      ) : (
        <div className="muted">No breakdowns</div>
      )}
    </div>
  );
}

export default function ComparisonChart({ comparison }) {
  const { bars, title } = comparison;
  const manyBars = bars.length > 12;
  return (
    <ChartCard title="Operator comparison" subtitle={`${title} · hover a bar for the breakdown types`} className="span-12">
      <div className="chart-scroll-x">
        <div style={{ minWidth: manyBars ? bars.length * 70 : 0, height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bars} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--grid)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis allowDecimals={false} tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} width={32} />
              <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="total" fill={SERIES_COLORS[0]} radius={[4, 4, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
