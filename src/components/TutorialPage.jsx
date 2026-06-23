function PlayIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
      <circle cx="24" cy="24" r="23" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      <path d="M20 16l14 8-14 8V16z" fill="white"/>
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
        {zone.tutorials.slice(0, 2).map((t, i) => (
          <a
            key={i}
            href={ytUrl(t.q)}
            target="_blank"
            rel="noopener noreferrer"
            className="tuto-vid-card"
          >
            <div className="tuto-vid-thumb">
              <PlayIcon />
            </div>
            <div className="tuto-vid-title">{t.title}</div>
            <div className="tuto-vid-meta">{t.dur}</div>
          </a>
        ))}
      </div>

    </div>
  );
}
