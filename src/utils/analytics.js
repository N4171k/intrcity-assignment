import { BLANK, PIE_SLICES } from './constants.js';

export const alpha = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

export const uniqueSorted = (rows, key) => [...new Set(rows.map((r) => r[key]))].sort(alpha);

export function routeCountByOperator(rows) {
  const map = {};
  rows.forEach((r) => {
    if (r.route === BLANK.route) return;
    (map[r.operator] ||= new Set()).add(r.route);
  });
  return Object.fromEntries(Object.entries(map).map(([op, set]) => [op, set.size]));
}



export const operatorLabel = (name, routeCounts) =>
  routeCounts[name] > 1 ? `${name} (${routeCounts[name]} routes)` : name;


export function applyFilters(rows, { operators = [], route = '', type = '', result = '' }) {
  return rows.filter(
    (r) =>
      (!operators.length || operators.includes(r.operator)) &&
      (!route || r.route === route) &&
      (!type || r.type === type) &&
      (!result || r.result === result),
  );
}


export function countBy(rows, key) {
  const m = new Map();
  rows.forEach((r) => m.set(r[key], (m.get(r[key]) || 0) + 1));
  return [...m].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || alpha(a.name, b.name));
}

export const topOf = (rows, key) => countBy(rows, key)[0] || null;


export function trendByDate(rows) {
  const m = new Map();
  rows.forEach((r) => r.date && m.set(r.date, (m.get(r.date) || 0) + 1));
  return [...m].sort(([a], [b]) => (a < b ? -1 : 1)).map(([date, count]) => ({ date, count }));
}


export function pieData(rows, n = PIE_SLICES) {
  const all = countBy(rows, 'operator');
  const head = all.slice(0, n);
  const tail = all.slice(n);
  const out = head.map((d) => ({ ...d }));
  if (tail.length) out.push({ name: `Others (${tail.length} operator${tail.length > 1 ? 's' : ''})`, count: tail.reduce((s, d) => s + d.count, 0), isOther: true });
  return out;
}


export function buildComparison(allRows, { operators = [], route = '', type = '', result = '' }) {
  const show = Boolean(route) || operators.length >= 2;
  if (!show) return { show: false, bars: [] };

  const scoped = applyFilters(allRows, { route, type, result }); // everything except the operator filter
  const names = operators.length ? operators : [...new Set(scoped.map((r) => r.operator))];

  const bars = names
    .map((name) => {
      const mine = scoped.filter((r) => r.operator === name);
      return { name, total: mine.length, types: countBy(mine, 'type').map(({ name: t, count }) => ({ type: t, count })) };
    })

    .filter((b) => operators.length || b.total > 0)
    .sort((a, b) => b.total - a.total || alpha(a.name, b.name));

  return { show: true, bars, title: route ? `Operators on ${route}` : 'Selected operators' };
}


export function largestGap(trend) {
  let best = null;
  for (let i = 1; i < trend.length; i++) {
    const days = Math.round((new Date(trend[i].date) - new Date(trend[i - 1].date)) / 86400000);
    if (!best || days > best.days) best = { days, from: trend[i - 1].date, to: trend[i].date };
  }
  return best;
}
