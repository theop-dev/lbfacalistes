import { useRef, useEffect, useState, useCallback } from 'react';
import ZONES from '../data/zones';

// ── Geometry ──────────────────────────────────────────────────────────────────

function convexHull(pts) {
  if (pts.length < 3) return pts;
  const s = [...pts].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo = [], hi = [];
  for (const p of s) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = s.length - 1; i >= 0; i--) {
    const p = s[i];
    while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop();
    hi.push(p);
  }
  hi.pop(); lo.pop();
  return lo.concat(hi);
}

function getPolyPts(zone, lm, w, h) {
  const pts = zone.poly.map(i => ({ x: lm[i].x * w, y: lm[i].y * h }));
  return zone.sortByAngle ? convexHull(pts) : pts;
}

function inPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y, xj = pts[j].x, yj = pts[j].y;
    if (((yi > py) !== (yj > py)) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function polyArea(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += (pts[j].x + pts[i].x) * (pts[j].y - pts[i].y);
  }
  return Math.abs(a / 2);
}

function hexRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FaceMapPage({ captureData, onBack, onZoneSelect }) {
  const { imageData, landmarks: lm } = captureData;
  const canvasRef  = useRef(null);
  const activeRef  = useRef(null);

  const [selectedZone, setSelectedZone] = useState(null);
  const [mode,         setMode]         = useState('tap'); // 'tap' | 'hover'
  const [zoomStyle,    setZoomStyle]    = useState({});

  // ── Draw ──────────────────────────────────────────────────────────────────

  const draw = useCallback((activeZone) => {
    const canvas = canvasRef.current;
    if (!canvas || !lm) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const sorted = [...ZONES].sort((a, b) => b.poly.length - a.poly.length);
    for (const zone of sorted) {
      const pts = getPolyPts(zone, lm, w, h);
      if (pts.length < 3) continue;
      const active = activeZone?.id === zone.id;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();

      if (active) {
        ctx.shadowColor = hexRgba(zone.color, 0.9);
        ctx.shadowBlur  = 24;
        ctx.fillStyle   = hexRgba(zone.color, 0.42);
        ctx.fill();
        ctx.shadowBlur  = 0;
      }

      ctx.strokeStyle = active ? hexRgba(zone.color, 1) : hexRgba(zone.color, 0.4);
      ctx.lineWidth   = active ? 2.5 : 0.9;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.stroke();

      if (active) {
        const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        const label = zone.name;
        ctx.font = '700 13px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tw = ctx.measureText(label).width + 20;
        ctx.fillStyle = 'rgba(7,7,15,0.88)';
        if (ctx.roundRect) ctx.roundRect(cx - tw / 2, cy - 13, tw, 26, 6);
        else ctx.rect(cx - tw / 2, cy - 13, tw, 26);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(label, cx, cy);
      }

      ctx.restore();
    }
  }, [lm]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap   = canvas?.parentElement;
    if (!canvas || !wrap) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    draw(activeRef.current);
  }, [draw]);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    activeRef.current = selectedZone;
    draw(selectedZone);
  }, [selectedZone, draw]);

  // ── Zone finding (area-based) ─────────────────────────────────────────────

  const findZoneAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || !lm) return null;
    const r  = canvas.getBoundingClientRect();
    const rx = (clientX - r.left) * (canvas.width / r.width);
    const ry = (clientY - r.top)  * (canvas.height / r.height);
    const px = canvas.width - rx, py = ry; // mirror x

    const candidates = ZONES
      .map(zone => ({ zone, pts: getPolyPts(zone, lm, canvas.width, canvas.height) }))
      .filter(x => x.pts.length >= 3)
      .map(x => ({ ...x, area: polyArea(x.pts) }))
      .sort((a, b) => a.area - b.area);

    for (const { zone, pts } of candidates) {
      if (inPoly(px, py, pts)) return zone;
    }
    return null;
  }, [lm]);

  // ── Zoom helper ───────────────────────────────────────────────────────────

  const applyZoom = useCallback((zone, pts) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const zoneW = Math.max(...xs) - Math.min(...xs);
    const zoneH = Math.max(...ys) - Math.min(...ys);
    const vizX = (1 - cx / canvas.width) * r.width;
    const vizY = (cy / canvas.height) * r.height;
    const dispW = (zoneW / canvas.width) * r.width;
    const dispH = (zoneH / canvas.height) * r.height;
    const scale = Math.min(
      dispW > 0 ? r.width * 0.75 / dispW : 3,
      dispH > 0 ? r.height * 0.75 / dispH : 3,
      3.2,
    );
    setZoomStyle({
      transform: `scale(${scale.toFixed(2)})`,
      transformOrigin: `${vizX.toFixed(1)}px ${vizY.toFixed(1)}px`,
      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
    });
  }, []);

  // ── Interaction ───────────────────────────────────────────────────────────

  const switchMode = (newMode) => {
    setMode(newMode);
    setZoomStyle({});
    setSelectedZone(null);
  };

  const handleTap = useCallback((clientX, clientY) => {
    if (mode !== 'tap') return;
    const z = findZoneAt(clientX, clientY);
    setSelectedZone(z ?? null);
  }, [mode, findZoneAt]);

  const handleMove = useCallback((clientX, clientY) => {
    if (mode !== 'hover') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const z = findZoneAt(clientX, clientY);
    if (z?.id !== activeRef.current?.id) {
      setSelectedZone(z ?? null);
      if (z) {
        const pts = getPolyPts(z, lm, canvas.width, canvas.height);
        applyZoom(z, pts);
      } else {
        setZoomStyle({});
      }
    }
  }, [mode, findZoneAt, lm, applyZoom]);

  // ── Render ────────────────────────────────────────────────────────────────
  const showHoverValidate = mode === 'hover' && selectedZone;

  return (
    <div className="scanner">
      <div className="scan-bar">
        <button className="btn-back" onClick={onBack}>← Nouveau scan</button>

        {showHoverValidate ? (
          <>
            <span className="status-msg" style={{ color: '#fff', fontWeight: 600 }}>
              {selectedZone.name}
            </span>
            <button className="btn-validate" onClick={() => onZoneSelect(selectedZone)}>
              Valider →
            </button>
          </>
        ) : (
          <>
            <span className="status-msg">
              {mode === 'hover'
                ? 'Glissez pour explorer'
                : (selectedZone ? selectedZone.name : 'Touchez une zone du visage')}
            </span>
            <div className="mode-toggle">
              <button className={`mode-btn${mode === 'tap' ? ' active' : ''}`} onClick={() => switchMode('tap')}>Taper</button>
              <button className={`mode-btn${mode === 'hover' ? ' active' : ''}`} onClick={() => switchMode('hover')}>Glisser</button>
            </div>
            {mode === 'tap' && selectedZone && (
              <button className="btn-back" style={{ padding: '0.4rem 0.6rem' }} onClick={() => setSelectedZone(null)}>✕</button>
            )}
          </>
        )}
      </div>

      <div className="cam-wrap" style={zoomStyle}>
        <img src={imageData} className="cam-video" alt="" draggable={false} />
        <canvas
          ref={canvasRef}
          className="cam-canvas"
          onClick={(e) => handleTap(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (!e.changedTouches.length) return;
            const t = e.changedTouches[0];
            handleTap(t.clientX, t.clientY);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            if (!e.touches.length) return;
            const t = e.touches[0];
            handleMove(t.clientX, t.clientY);
          }}
        />
      </div>

      {mode === 'tap' && selectedZone && (
        <div className="facemap-panel">
          <div className="facemap-header">
            <div className="facemap-zone-dot" style={{ background: selectedZone.color }} />
            <div className="facemap-meta">
              <div className="facemap-name">{selectedZone.name}</div>
              <div className="facemap-desc">{selectedZone.desc}</div>
            </div>
          </div>
          <div className="facemap-links">
            {selectedZone.tutorials.map((t, i) => (
              <a
                key={i}
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t.q)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="facemap-link"
              >
                <span className="tuto-yt-badge">YT</span>
                <span className="facemap-link-title">{t.title}</span>
                <span className="facemap-link-dur">{t.dur}</span>
              </a>
            ))}
          </div>
          <button className="btn-confirm-yes facemap-full-btn" onClick={() => onZoneSelect(selectedZone)}>
            Tutoriel complet →
          </button>
        </div>
      )}
    </div>
  );
}
