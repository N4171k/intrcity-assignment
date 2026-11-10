import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../ChartCard.jsx';
import ChartTooltip from '../ChartTooltip.jsx';
import { largestGap, trendByDate } from '../../utils/analytics.js';
import { SERIES_COLORS } from '../../utils/constants.js';

const fmt = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });

export default function TrendChart({ rows }) {
  const data = useMemo(() => trendByDate(rows).map((d) => ({ ...d, label: fmt(d.date) })), [rows]);
  const gap = useMemo(() => largestGap(data), [data]);
  return (
    <ChartCard title="Breakdown trend" subtitle="Breakdowns per day, chronological (days with at least one breakdown)" className="span-7">
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--grid)" />
            <XAxis dataKey="label" tick={{ fill: 'var(--text-2)', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={28} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} width={32} />
            <Tooltip content={<ChartTooltip valueLabel="Breakdowns" />} />
            <Line type="linear" dataKey="count" stroke={SERIES_COLORS[0]} strokeWidth={2} dot={data.length < 40 ? { r: 3 } : false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {gap && gap.days > 60 && (
        <p className="note">⚠ The dates jump {gap.days} days between {fmt(gap.from)} and {fmt(gap.to)} — worth checking the date column in the source file.</p>
      )}
    </ChartCard>
  );
}
