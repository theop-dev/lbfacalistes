function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white" />
    </svg>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function zoneStat(id, offset, min, range) {
  const h = id.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0);
  return min + ((h + offset) % range);
}

const MEMBERS = [
  { initials: 'ML', name: 'Marie L.',  role: 'Esthéticienne · Paris' },
  { initials: 'SA', name: 'Sophie A.', role: 'Coach beauté · Lyon' },
  { initials: 'JM', name: 'Julie M.',  role: 'Praticienne · Bordeaux' },
  { initials: 'CR', name: 'Clara R.',  role: 'Makeup artist · Marseille' },
  { initials: 'EN', name: 'Emma N.',   role: 'Thérapeute · Nantes' },
  { initials: 'LB', name: 'Léa B.',   role: 'Esthéticienne · Toulouse' },
];

export default function TutorialPage({ zone, onBack }) {
  if (!zone) return null;

  const rgb  = hexToRgb(zone.color);
  const seed = zone.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const stats = {
    views:         zoneStat(zone.id, 0,  1400, 4200),
    practitioners: zoneStat(zone.id, 7,  85,   280),
    rating:        (4.5 + (seed % 5) * 0.1).toFixed(1),
  };

  const communityTips = (zone.tips || []).map((tip, i) => ({
    ...MEMBERS[(seed + i) % MEMBERS.length],
    tip,
  }));

  const ytUrl = (q) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  return (
    <div className="tuto-page">

      {/* ── Header ── */}
      <div className="tuto-header">
        <button className="btn-back-tuto" onClick={onBack}>← Retour</button>
        <div className="tuto-header-zone">
          <div className="tuto-header-dot" style={{ background: zone.color }} />
          <span className="tuto-header-name">{zone.name}</span>
        </div>
      </div>

      <div className="tuto-body">

        {/* ── Hero ── */}
        <div
          className="tuto-hero"
          style={{ '--zone-rgb': rgb, '--zone-color': zone.color }}
        >
          <h1 className="tuto-hero-title">{zone.name}</h1>
          <p className="tuto-hero-desc">{zone.desc}</p>
        </div>

        {/* ── Community stats ── */}
        <div className="tuto-stats">
          <div className="tuto-stat">
            <span className="tuto-stat-value">{stats.views.toLocaleString('fr')}</span>
            <span className="tuto-stat-label">vues</span>
          </div>
          <div className="tuto-stat-sep" />
          <div className="tuto-stat">
            <span className="tuto-stat-value">{stats.practitioners}</span>
            <span className="tuto-stat-label">praticiennes</span>
          </div>
          <div className="tuto-stat-sep" />
          <div className="tuto-stat">
            <span className="tuto-stat-value">{stats.rating}★</span>
            <span className="tuto-stat-label">note</span>
          </div>
        </div>

        {/* ── Tutorials ── */}
        <div className="tuto-section-label">Tutoriels recommandés</div>
        <div className="tuto-grid">
          {zone.tutorials.map((t, i) => (
            <a
              key={i}
              className="tuto-card"
              href={ytUrl(t.q)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--zone-rgb': rgb }}
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

        {/* ── Community tips ── */}
        {communityTips.length > 0 && (
          <>
            <div className="tuto-section-label">Conseils de la communauté</div>
            <div className="tuto-community">
              {communityTips.map((item, i) => (
                <div key={i} className="tuto-community-item">
                  <div
                    className="tuto-avatar"
                    style={{ '--zone-rgb': rgb }}
                  >
                    {item.initials}
                  </div>
                  <div className="tuto-community-content">
                    <p className="tuto-community-tip">"{item.tip}"</p>
                    <span className="tuto-community-author">
                      {item.name} · {item.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Back CTA ── */}
        <button className="btn-rescan" onClick={onBack}>
          ← Analyser une autre zone
        </button>

      </div>
    </div>
  );
}
