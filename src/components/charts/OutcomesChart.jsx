import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../ChartCard.jsx';
import ChartTooltip from '../ChartTooltip.jsx';
import { countBy } from '../../utils/analytics.js';
import { SERIES_COLORS } from '../../utils/constants.js';

export default function OutcomesChart({ rows }) {
  const data = useMemo(() => countBy(rows, 'result'), [rows]);
  return (
    <ChartCard title="Outcomes" subtitle="Distribution of the Result column" className="span-6">
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--grid)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} interval={0} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--text-2)', fontSize: 12 }} tickLine={false} axisLine={false} width={32} />
            <Tooltip content={<ChartTooltip total={rows.length} />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="count" fill={SERIES_COLORS[2]} radius={[4, 4, 0, 0]} maxBarSize={56}>
              <LabelList dataKey="count" position="top" fill="var(--text-1)" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
