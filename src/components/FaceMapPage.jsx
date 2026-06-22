import { useRef, useEffect, useState, useCallback } from 'react';
import ZONES from '../data/zones';

// ── Geometry (mirrors Scanner.jsx) ───────────────────────────────────────────

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
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if (((yi > py) !== (yj > py)) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
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

  const draw = useCallback((activeZone) => {
    const canvas = canvasRef.current;
    if (!canvas || !lm) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Large zones drawn first so small zones appear on top
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

      // Label when active
      if (active) {
        const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        const label = `${zone.icon}  ${zone.name}`;
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

  const handleTap = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || !lm) return;
    const r  = canvas.getBoundingClientRect();
    const rx = (clientX - r.left) * (canvas.width / r.width);
    const ry = (clientY - r.top)  * (canvas.height / r.height);
    // Mirror x — canvas has CSS scaleX(-1)
    const px = canvas.width - rx, py = ry;

    const sorted = [...ZONES].sort((a, b) => a.poly.length - b.poly.length);
    for (const zone of sorted) {
      const pts = getPolyPts(zone, lm, canvas.width, canvas.height);
      if (inPoly(px, py, pts)) { setSelectedZone(zone); return; }
    }
    setSelectedZone(null);
  }, [lm]);

  return (
    <div className="scanner">
      <div className="scan-bar">
        <button className="btn-back" onClick={onBack}>← Nouveau scan</button>
        <span className="status-msg">
          {selectedZone ? `${selectedZone.icon} ${selectedZone.name}` : 'Touchez une zone du visage'}
        </span>
        {selectedZone && (
          <button className="btn-back" onClick={() => setSelectedZone(null)}>✕</button>
        )}
      </div>

      <div className="cam-wrap">
        <img src={imageData} className="cam-video" alt="" draggable={false} />
        <canvas
          ref={canvasRef}
          className="cam-canvas"
          onClick={(e) => handleTap(e.clientX, e.clientY)}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (!e.changedTouches.length) return;
            const t = e.changedTouches[0];
            handleTap(t.clientX, t.clientY);
          }}
        />
      </div>

      {selectedZone && (
        <div className="facemap-panel">
          <div className="facemap-header">
            <span className="facemap-icon">{selectedZone.icon}</span>
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
