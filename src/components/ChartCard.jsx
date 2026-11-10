export default function ChartCard({ title, subtitle, className = '', actions, children }) {
  return (
    <div className={`chart-card glass ${className}`}>
      <div className="chart-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
