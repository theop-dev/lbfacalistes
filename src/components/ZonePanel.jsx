function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="38" height="38">
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white" />
    </svg>
  );
}

export default function ZonePanel({ zone, onClose }) {
  const ytUrl = (q) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  return (
    <div className={`zone-panel${zone ? ' open' : ''}`}>
      {zone && (
        <>
          <div className="panel-head">
            <div className="panel-icon">{zone.icon}</div>
            <div className="panel-info">
              <h2>{zone.name}</h2>
              <p>{zone.desc}</p>
            </div>
            <button className="btn-close-panel" onClick={onClose} title="Fermer">
              ×
            </button>
          </div>

          <div className="tuts-grid">
            {zone.tutorials.map((t, i) => (
              <a
                key={i}
                className="tut-card"
                href={ytUrl(t.q)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="tut-thumb">
                  <div className="tut-play">
                    <PlayIcon />
                  </div>
                </div>
                <div className="tut-body">
                  <div className="tut-title">{t.title}</div>
                  <div className="tut-meta">
                    <span className="tut-yt">YouTube</span>
                    <span>{t.dur}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
