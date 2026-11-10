import * as XLSX from 'xlsx';
import { REQUIRED_COLUMNS, BLANK } from './constants.js';

const clean = (v) => (v === null || v === undefined ? '' : String(v).replace(/\s+/g, ' ').trim());
const pad = (n) => String(n).padStart(2, '0');
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;


export function toISODate(value) {
  if (value instanceof Date && !isNaN(value)) return iso(value.getFullYear(), value.getMonth() + 1, value.getDate());
  if (typeof value === 'number') {
    // Excel serial = days since 1899-12-30 (correct for any date after Feb 1900); UTC math avoids timezone shifts
    const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(value) * 86400000);
    return isNaN(d) ? '' : iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  }
  const s = clean(value);
  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/); // 2026-01-31
  if (m) return iso(m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/); // 31/01/2026 (day first, common in India)
  if (m) return iso(m[3], +m[2], +m[1]);
  const t = Date.parse(s);
  return isNaN(t) ? '' : toISODate(new Date(t));
}


export function normalizeRows(rawRows) {
  if (!rawRows.length) throw new Error('The file has no data rows.');


  const headerMap = {};
  Object.keys(rawRows[0]).forEach((h) => (headerMap[clean(h).toLowerCase()] = h));
  const missing = REQUIRED_COLUMNS.filter((c) => !(c in headerMap));
  if (missing.length) throw new Error(`Missing required column(s): ${missing.join(', ')}`);

  const get = (r, col) => r[headerMap[col]];
  const rows = rawRows
    .map((r, i) => ({
      id: i,
      sno: clean(get(r, 'sno')),
      date: toISODate(get(r, 'date')),
      serviceId: clean(get(r, 'service id')),
      operator: clean(get(r, 'operator')) || BLANK.operator,
      route: clean(get(r, 'route')) || BLANK.route,
      issue: clean(get(r, 'issue')) || BLANK.issue,
      type: clean(get(r, 'type')) || BLANK.type,
      result: clean(get(r, 'result')) || BLANK.result,
    }))

    .filter((r) => r.serviceId || r.date || r.issue !== BLANK.issue || r.operator !== BLANK.operator);

  if (!rows.length) throw new Error('No usable rows found in the file.');
  return rows;
}


export async function parseFile(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' }); 
  const sheetName = wb.SheetNames[0];
  const rawRows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });
  return normalizeRows(rawRows);
}
