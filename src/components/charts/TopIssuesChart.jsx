
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../ChartCard.jsx';
import ChartTooltip from '../ChartTooltip.jsx';
import { countBy } from '../../utils/analytics.js';
import { SERIES_COLORS } from '../../utils/constants.js';

const short = (s, n = 24) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export default function TopIssuesChart({ rows }) {
  // The tracker has hundreds of unique free-text issues, so show the top N (user can widen to all).
  const [limit, setLimit] = useState(10);
  const all = useMemo(() => countBy(rows, 'issue'), [rows]);
  const data = useMemo(
    () => (limit === 0 ? all : all.slice(0, limit)).map((d) => ({ ...d, label: short(d.name), fullName: d.name })),
    [all, limit],
  );

  const picker = (
    <select className="mini-select" value={limit} onChange={(e) => setLimit(+e.target.value)} aria-label="Number of issues">
      <option value={10}>Top 10</option>
      <option value={20}>Top 20</option>
      <option value={50}>Top 50</option>
      <option value={0}>All ({all.length})</option>
    </select>
  );

  return (
    <ChartCard title="Top issues" subtitle={`${all.length} unique issues`} className="span-6" actions={picker}>
      <div className="chart-scroll-y">
        <div style={{ height: Math.max(300, data.length * 28 + 20) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="var(--grid)" />
              <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="label" width={190} interval={0} tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="count" fill={SERIES_COLORS[0]} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
