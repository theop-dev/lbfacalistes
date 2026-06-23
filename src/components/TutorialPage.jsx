function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function hexToRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

function seed(id, offset) {
  return id.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0) + offset;
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
  const s    = seed(zone.id, 0);
  const views        = (1400 + (s * 47) % 3800).toLocaleString('fr');
  const practitioners = 80  + (s * 13) % 220;
  const rating       = (4.5 + (s % 5) * 0.1).toFixed(1);

  const tips = (zone.tips || []).map((tip, i) => ({
    ...MEMBERS[(s + i) % MEMBERS.length], tip,
  }));

  const ytUrl = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

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
        <div className="tuto-hero" style={{ '--rgb': rgb }}>
          <h1 className="tuto-hero-title">{zone.name}</h1>
          <p className="tuto-hero-desc">{zone.desc}</p>
          <div className="tuto-hero-stats">
            <span className="tuto-hstat"><b>{views}</b> vues</span>
            <span className="tuto-hstat-dot" />
            <span className="tuto-hstat"><b>{practitioners}</b> praticiennes</span>
            <span className="tuto-hstat-dot" />
            <span className="tuto-hstat"><b>{rating}★</b> note</span>
          </div>
        </div>

        {/* ── Tutorials ── */}
        <div className="tuto-section">
          <span className="tuto-label">Tutoriels</span>
          <div className="tuto-rows">
            {zone.tutorials.map((t, i) => (
              <a key={i} href={ytUrl(t.q)} target="_blank" rel="noopener noreferrer"
                className="tuto-row" style={{ '--rgb': rgb }}>
                <div className="tuto-row-thumb"><PlayIcon /></div>
                <div className="tuto-row-body">
                  <div className="tuto-row-title">{t.title}</div>
                  <div className="tuto-row-meta">
                    <span className="tuto-yt-badge">YouTube</span>
                    <span>{t.dur}</span>
                  </div>
                </div>
                <span className="tuto-row-arrow"><ArrowIcon /></span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Community tips ── */}
        {tips.length > 0 && (
          <div className="tuto-section">
            <span className="tuto-label">Conseils de la communauté</span>
            <div className="tuto-tips-list">
              {tips.map((item, i) => (
                <div key={i} className="tuto-tip" style={{ '--rgb': rgb }}>
                  <p className="tuto-tip-text">"{item.tip}"</p>
                  <div className="tuto-tip-footer">
                    <div className="tuto-tip-avatar">{item.initials}</div>
                    <div>
                      <span className="tuto-tip-name">{item.name}</span>
                      <span className="tuto-tip-role">{item.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn-rescan" onClick={onBack}>← Analyser une autre zone</button>

      </div>
    </div>
  );
}
