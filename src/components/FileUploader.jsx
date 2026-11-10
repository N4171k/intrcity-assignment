import { useRef, useState } from 'react';

export default function FileUploader({ onFile, loading, error, compact = false }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (files) => files && files[0] && onFile(files[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files);
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept=".xlsx,.xls,.csv"
      hidden
      onChange={(e) => {
        pick(e.target.files);
        e.target.value = ''; // allows re-uploading the same file
      }}
    />
  );

  if (compact) {
    return (
      <div className="uploader-compact">
        <button className="btn" onClick={() => inputRef.current.click()} disabled={loading}>
          {loading ? 'Reading…' : 'Upload another file'}
        </button>
        {input}
        {error && <span className="error-text">{error}</span>}
      </div>
    );
  }

  return (
    <div
      className={`dropzone glass ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current.click()}
    >
      
      <h1>Fleet Breakdown Analytics</h1>
      <p className="muted">{loading ? 'Reading your file…' : 'Drag & drop your Breakdown Tracker here, or click to browse'}</p>
      <p className="hint">.xlsx (also accepts .xls / .csv) · required columns: sno, date, service id, operator, route, issue, type, result</p>
      {error && <p className="error-text">⚠ {error}</p>}
      {input}
    </div>
  );
}
