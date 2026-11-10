# Fleet Breakdown Analytics Dashboard

Single-page dashboard: upload the Excel breakdown tracker in the browser, then slice it with filters.
React 18 + Vite + Recharts + SheetJS (`xlsx`). Everything runs client-side; no data leaves the browser.

## Run
    npm install
    npm run dev       # development
    npm run build     # static build -> dist/index.html (single file, also opens by double-click)
    npm test          # logic tests (node --test), uses sample/Anonymized_Breakdown_Tracker.csv

## Structure
    src/utils/parseWorkbook.js   file -> clean records (header matching, Excel dates, blank handling, validation)
    src/utils/analytics.js       PURE functions: filters, counts, trend, pie, comparison data (unit-tested)
    src/components/              FileUploader, FilterBar, OperatorMultiSelect, SummaryCards, ChartCard, ChartTooltip
    src/components/charts/       ComparisonChart, TopIssues, Outcomes, OperatorPie, Trend
    src/App.jsx                  state (rows + filters) and chart order

## Key decisions (good interview talking points)
- Logic is separate from UI: `analytics.js` has no React, so it is testable and the charts stay thin.
- Comparison chart shows when a Route is selected OR 2+ operators are checked.
  Route only -> all operators on that route. Operators checked -> exactly those (within the route, if set).
  Type/Result filters still apply. Tooltip lists the breakdown types for the hovered bar.
- Operator route count ("Operator X (3 routes)") is computed from the full file, so labels don't change as filters change.
- Dropdowns are built from the data and sorted with a natural alphabetical sort (Operator 2 before Operator 10).
- Blank cells become "Unspecified" / "Unknown route" instead of disappearing.
- Top Issues: the sample has ~410 unique free-text issues, so it shows Top 10 with a selector (20 / 50 / All, scrollable).
- Pie: top 8 operators + one "Others" slice (103 operators can't be read as slices).
- Chart grid is CSS Grid (12 columns), order: Comparison, Top Issues, Outcomes, Pie, Trend.

## Data quirks found in the sample (not silently "fixed")
- Dec 26-31 rows are dated 2026 but sit before Jan 2026 in the file: likely a year typo (2025). Trend shows a warning for large date gaps.
- Near-duplicate issue text ("Tire puncture" vs "Tyre puncture") and routes ("Delhi Amritsar", reversed directions) are kept as entered.
- 4 blank types, 7 blank results, 1 blank route.

## Known limits / next steps
- Issue text is not fuzzy-matched; a normalisation list would merge duplicates.
- Filters are independent (not cascading): picking a route doesn't shrink the Operator list.
