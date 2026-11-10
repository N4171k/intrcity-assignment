import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from '../ChartCard.jsx';
import ChartTooltip from '../ChartTooltip.jsx';
import { pieData } from '../../utils/analytics.js';
import { OTHER_COLOR, SERIES_COLORS } from '../../utils/constants.js';

export default function OperatorPieChart({ rows }) {
  // 100+ operators can't all be readable slices, so top 8 are shown and the long tail is grouped as "Others".
  const data = useMemo(() => pieData(rows), [rows]);
  const colorOf = (d, i) => (d.isOther ? OTHER_COLOR : SERIES_COLORS[i % SERIES_COLORS.length]);

  return (
    <ChartCard title="Operator distribution" subtitle="Share of breakdowns by operator" className="span-5">
      <div className="pie-wrap">
        <div style={{ height: 260, flex: '1 1 220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="name" innerRadius="52%" outerRadius="90%" paddingAngle={2} stroke="none">
                {data.map((d, i) => <Cell key={d.name} fill={colorOf(d, i)} />)}
              </Pie>
              <Tooltip content={<ChartTooltip total={rows.length} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="legend">
          {data.map((d, i) => (
            <li key={d.name}>
              <span className="dot" style={{ background: colorOf(d, i) }} />
              <span className="truncate">{d.name}</span>
              <strong>{((d.count / rows.length) * 100).toFixed(1)}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
