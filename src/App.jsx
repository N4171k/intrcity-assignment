import { useMemo, useState } from 'react';
import FileUploader from './components/FileUploader.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import FilterBar from './components/FilterBar.jsx';
import ComparisonChart from './components/charts/ComparisonChart.jsx';
import TopIssuesChart from './components/charts/TopIssuesChart.jsx';
import OutcomesChart from './components/charts/OutcomesChart.jsx';
import OperatorPieChart from './components/charts/OperatorPieChart.jsx';
import TrendChart from './components/charts/TrendChart.jsx';
import { parseFile } from './utils/parseWorkbook.js';
import { applyFilters, buildComparison } from './utils/analytics.js';

const NO_FILTERS = { operators: [], route: '', type: '', result: '' };

export default function App() {
  const [rows, setRows] = useState(null); // all parsed records
  const [fileName, setFileName] = useState('');
  const [filters, setFilters] = useState(NO_FILTERS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleFile(file) {
    setError('');
    setLoading(true);
    try {
      setRows(await parseFile(file));
      setFileName(file.name);
      setFilters(NO_FILTERS);
    } catch (e) {
      setError(e.message || 'Could not read that file.');
    } finally {
      setLoading(false);
    }
  }

  // Every chart reads from `filtered`; the comparison chart reads from `rows` + filters (it needs operators the filter would hide).
  const filtered = useMemo(() => (rows ? applyFilters(rows, filters) : []), [rows, filters]);
  const comparison = useMemo(() => (rows ? buildComparison(rows, filters) : { show: false, bars: [] }), [rows, filters]);

  if (!rows) {
    return (
      <main className="landing">
        <FileUploader onFile={handleFile} loading={loading} error={error} />
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="topbar glass">
        <div>
          <h1>Fleet Breakdown Analytics</h1>
          <p className="muted">
            {fileName} · {rows.length.toLocaleString()} records
          </p>
        </div>
        <FileUploader compact onFile={handleFile} loading={loading} error={error} />
      </header>

      <FilterBar rows={rows} filters={filters} onChange={setFilters} onReset={() => setFilters(NO_FILTERS)} />
      <SummaryCards rows={filtered} totalRows={rows.length} />

      {filtered.length === 0 && comparison.bars.every((b) => b.total === 0) ? (
        <div className="glass empty">No breakdowns match the selected filters.</div>
      ) : (
        <section className="grid">
          {/* Order matters: Comparison, Top Issues, Outcomes, Pie, Timeline */}
          {comparison.show && <ComparisonChart comparison={comparison} />}
          <TopIssuesChart rows={filtered} />
          <OutcomesChart rows={filtered} />
          <OperatorPieChart rows={filtered} />
          <TrendChart rows={filtered} />
        </section>
      )}
    </main>
  );
}
