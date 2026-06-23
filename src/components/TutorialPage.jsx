function YTLogo() {
  return (
    <svg viewBox="0 0 71 50" width="34" height="24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M69.5 7.8a8.9 8.9 0 00-6.3-6.3C57.8 0 35.5 0 35.5 0S13.2 0 7.8 1.5A8.9 8.9 0 001.5 7.8C0 13.2 0 24.5 0 24.5s0 11.3 1.5 16.7a8.9 8.9 0 006.3 6.3C13.2 49 35.5 49 35.5 49s22.3 0 27.7-1.5a8.9 8.9 0 006.3-6.3C71 35.8 71 24.5 71 24.5S71 13.2 69.5 7.8z" fill="#FF0000"/>
      <path d="M28.5 35l18.5-10.5L28.5 14v21z" fill="white"/>
    </svg>
  );
}

function hexToRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

export default function TutorialPage({ zone, onBack }) {
  if (!zone) return null;

  const rgb = hexToRgb(zone.color);
  const ytUrl = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  return (
    <div className="tuto-page">

      {/* Header */}
      <div className="tuto-header">
        <button className="btn-back-tuto" onClick={onBack}>← Retour</button>
        <div className="tuto-header-zone">
          <div className="tuto-header-dot" style={{ background: zone.color }} />
          <span className="tuto-header-name">{zone.name}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="tuto-content">

        {/* Zone hero */}
        <div className="tuto-hero-block" style={{ '--rgb': rgb }}>
          <div className="tuto-hero-icon" style={{ background: zone.color }} />
          <div className="tuto-hero-text">
            <h1 className="tuto-hero-name">{zone.name}</h1>
            <p className="tuto-hero-desc">{zone.desc}</p>
          </div>
        </div>

        {/* Grouped video list */}
        <p className="tuto-group-header">Tutoriels</p>
        <div className="tuto-group" style={{ '--rgb': rgb }}>
          {zone.tutorials.slice(0, 2).map((t, i) => (
            <a
              key={i}
              href={ytUrl(t.q)}
              target="_blank"
              rel="noopener noreferrer"
              className="tuto-group-row"
            >
              <YTLogo />
              <div className="tuto-row-body">
                <span className="tuto-row-title">{t.title}</span>
                <span className="tuto-row-meta">{t.dur}</span>
              </div>
              <span className="tuto-chevron">›</span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
