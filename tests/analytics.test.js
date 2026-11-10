import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as XLSX from 'xlsx';
import { normalizeRows, toISODate } from '../src/utils/parseWorkbook.js';
import { alpha, applyFilters, buildComparison, countBy, operatorLabel, pieData, routeCountByOperator, topOf, trendByDate, uniqueSorted } from '../src/utils/analytics.js';

const csv = process.env.TRACKER_CSV || new URL('../sample/Anonymized_Breakdown_Tracker.csv', import.meta.url).pathname;
const wb = XLSX.read(readFileSync(csv), { type: 'buffer' });
const rows = normalizeRows(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' }));

test('parses every row of the tracker', () => assert.equal(rows.length, 751));
test('dates', () => {
  assert.equal(toISODate(46023), '2026-01-01'); // Excel serial
  assert.equal(toISODate('31/01/2026'), '2026-01-31');
  assert.equal(toISODate('2026-01-31'), '2026-01-31');
});
test('missing columns are reported', () => assert.throws(() => normalizeRows([{ sno: 1, date: 'x' }]), /Missing required/));
test('summary metrics', () => {
  assert.equal(topOf(rows, 'issue').name, 'Accident');
  assert.equal(topOf(rows, 'route').name, 'Bangalore - Chennai');
  assert.equal(topOf(rows, 'route').count, 39);
});
test('dropdown values are alphabetically sorted', () => {
  for (const k of ['operator', 'route', 'type', 'result']) {
    const v = uniqueSorted(rows, k);
    assert.deepEqual(v, [...v].sort(alpha));
  }
  assert.deepEqual(uniqueSorted(rows, 'operator').slice(0, 3), ['Operator 1', 'Operator 2', 'Operator 3']);
});
test('operator labels show route counts only when > 1', () => {
  const rc = routeCountByOperator(rows);
  assert.equal(operatorLabel('Operator 93', rc), 'Operator 93 (27 routes)');
  assert.equal(operatorLabel('Operator 28', rc), 'Operator 28'); // single route
});
test('filters combine with AND', () => {
  const f = applyFilters(rows, { route: 'Bangalore - Chennai', type: 'AC' });
  assert.ok(f.length > 0 && f.every((r) => r.route === 'Bangalore - Chennai' && r.type === 'AC'));
});
test('comparison hidden for none / single operator, shown for route or 2+ operators', () => {
  assert.equal(buildComparison(rows, {}).show, false);
  assert.equal(buildComparison(rows, { operators: ['Operator 93'] }).show, false);
  assert.equal(buildComparison(rows, { operators: ['Operator 93', 'Operator 73'] }).show, true);
  assert.equal(buildComparison(rows, { route: 'Bangalore - Chennai' }).show, true);
});
test('route comparison lists all operators on that route; tooltip types add up to the bar', () => {
  const c = buildComparison(rows, { route: 'Bangalore - Chennai' });
  const expectedOps = new Set(rows.filter((r) => r.route === 'Bangalore - Chennai').map((r) => r.operator));
  assert.equal(c.bars.length, expectedOps.size);
  assert.equal(c.bars.reduce((s, b) => s + b.total, 0), 39);
  c.bars.forEach((b) => assert.equal(b.types.reduce((s, t) => s + t.count, 0), b.total));
});
test('checked operators stay visible with 0 when route excludes them', () => {
  const c = buildComparison(rows, { route: 'Bangalore - Chennai', operators: ['Operator 28', 'Operator 93'] });
  assert.deepEqual(c.bars.map((b) => b.name).sort(), ['Operator 28', 'Operator 93']);
});
test('pie slices sum to total; trend is chronological', () => {
  assert.equal(pieData(rows).reduce((s, d) => s + d.count, 0), rows.length);
  const t = trendByDate(rows).map((d) => d.date);
  assert.deepEqual(t, [...t].sort());
  assert.equal(countBy(rows, 'result').reduce((s, d) => s + d.count, 0), rows.length);
});
