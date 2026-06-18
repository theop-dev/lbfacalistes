export default function Landing({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="brand">
          <div className="brand-dot" />
          Face Scan
          <div className="brand-dot" />
        </div>

        <h1>Analysez votre visage</h1>

        <p>
          Sélectionnez une zone de votre visage et découvrez
          les tutoriels beauté adaptés — sur mobile et PC.
        </p>

        <button className="btn-start" onClick={onStart}>
          Commencer l&apos;analyse
        </button>

        <div className="badges">
          <span className="badge">📱 Mobile &amp; PC</span>
          <span className="badge">🔒 100 % privé</span>
          <span className="badge">🤖 IA Google</span>
        </div>
      </div>
    </div>
  );
}
