export default function ConfirmDialog({ zone, onConfirm, onCancel }) {
  if (!zone) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-zone-dot" style={{ background: zone.color }} />
        <div className="confirm-label">Zone sélectionnée</div>
        <div className="confirm-name">{zone.name}</div>
        <div className="confirm-desc">{zone.desc}</div>
        <div className="confirm-actions">
          <button className="btn-confirm-yes" onClick={onConfirm}>
            Oui, voir les tutoriels →
          </button>
          <button className="btn-confirm-no" onClick={onCancel}>
            ← Corriger ma sélection
          </button>
        </div>
      </div>
    </div>
  );
}
