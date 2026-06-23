export default function ModeSelectPage({ onSelect, onBack }) {
  return (
    <div className="mode-select-page">
      <div className="scan-bar">
        <button className="btn-back" onClick={onBack}>← Retour</button>
        <span className="status-msg">Choisissez votre mode d'analyse</span>
      </div>

      <div className="mode-select-body">
        <p className="mode-select-sub">
          Deux façons d'explorer les zones de votre visage
        </p>

        <div className="mode-cards">
          <button className="mode-card" onClick={() => onSelect('tap')}>
            <div className="mode-card-visual tap-visual">
              <div className="tap-cursor" />
            </div>
            <div className="mode-card-title">Mode Classique</div>
            <div className="mode-card-desc">
              Tapez directement sur une zone du visage pour la sélectionner et accéder au tutoriel
            </div>
            <div className="mode-card-cta">Commencer →</div>
          </button>

          <button className="mode-card" onClick={() => onSelect('hover')}>
            <div className="mode-card-visual hover-visual">
              <div className="hover-wave" />
              <div className="hover-wave" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="mode-card-title">Mode Guidé</div>
            <div className="mode-card-desc">
              Glissez votre doigt sur le visage — la zone se met en surbrillance et zoome automatiquement, puis validez
            </div>
            <div className="mode-card-cta">Commencer →</div>
          </button>
        </div>
      </div>
    </div>
  );
}
