function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white" />
    </svg>
  );
}

export default function TutorialPage({ zone, onBack }) {
  if (!zone) return null;

  const ytUrl = (q) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  return (
    <div className="tuto-page">
      {/* Header */}
      <div className="tuto-header">
        <button className="btn-back-tuto" onClick={onBack}>
          ← Retour au scan
        </button>
        <div className="tuto-header-zone">
          <span className="tuto-header-icon">{zone.icon}</span>
          <span className="tuto-header-name">{zone.name}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="tuto-body">
        {/* Zone info card */}
        <div className="tuto-zone-card">
          <div className="tuto-zone-hero">
            <span className="tuto-zone-big-icon">{zone.icon}</span>
            <div>
              <h1 className="tuto-zone-title">{zone.name}</h1>
              <p className="tuto-zone-desc">{zone.desc}</p>
            </div>
          </div>

          {zone.tips?.length > 0 && (
            <div className="tuto-tips">
              <div className="tuto-tips-label">✦ Conseils essentiels</div>
              <ul className="tuto-tips-list">
                {zone.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tutorial cards */}
        <div className="tuto-section-label">Tutoriels YouTube</div>
        <div className="tuto-grid">
          {zone.tutorials.map((t, i) => (
            <a
              key={i}
              className="tuto-card"
              href={ytUrl(t.q)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="tuto-card-thumb">
                <PlayIcon />
              </div>
              <div className="tuto-card-body">
                <div className="tuto-card-title">{t.title}</div>
                <div className="tuto-card-meta">
                  <span className="tuto-yt-badge">YouTube</span>
                  <span>{t.dur}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Back to scan */}
        <button className="btn-rescan" onClick={onBack}>
          ← Analyser une autre zone
        </button>
      </div>
    </div>
  );
}
