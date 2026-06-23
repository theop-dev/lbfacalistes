function YTIcon() {
  return (
    <svg viewBox="0 0 71 50" width="36" height="26" fill="none">
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

      <div className="tuto-header">
        <button className="btn-back-tuto" onClick={onBack}>← Retour</button>
        <div className="tuto-header-zone">
          <div className="tuto-header-dot" style={{ background: zone.color }} />
          <span className="tuto-header-name">{zone.name}</span>
        </div>
      </div>

      <div className="tuto-vids" style={{ '--rgb': rgb }}>
        <p className="tuto-zone-label">{zone.name} — tutoriels</p>
        {zone.tutorials.slice(0, 2).map((t, i) => (
          <a
            key={i}
            href={ytUrl(t.q)}
            target="_blank"
            rel="noopener noreferrer"
            className="tuto-yt-link"
          >
            <YTIcon />
            <div className="tuto-yt-text">
              <span className="tuto-yt-title">{t.title}</span>
              <span className="tuto-yt-dur">{t.dur} · Voir sur YouTube</span>
            </div>
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16" className="tuto-yt-arrow">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ))}
      </div>

    </div>
  );
}
