import { useRef, useEffect, useCallback, useState } from 'react';
// FaceMesh is loaded as a global script from CDN (see index.html)
// Do NOT import from npm — Vite cannot bundle the MediaPipe WASM correctly
import ZONES from '../data/zones';
import ConfirmDialog from './ConfirmDialog';

// ── Geometry ──────────────────────────────────────────────────────────────

// Canvas is CSS scaleX(-1) — map screen click → canvas internal coord
function toCanvas(clientX, clientY, canvas) {
  const r = canvas.getBoundingClientRect();
  const rx = (clientX - r.left) * (canvas.width / r.width);
  const ry = (clientY - r.top) * (canvas.height / r.height);
  return { x: canvas.width - rx, y: ry };
}

// Ray-casting point-in-polygon
function inPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if (((yi > py) !== (yj > py)) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Convex hull via Andrew's monotone chain — always non-self-intersecting
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

// Hex color to rgba
function hexRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Scanner ───────────────────────────────────────────────────────────────

export default function Scanner({ onBack, onConfirm }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const streamRef = useRef(null);
  const fmRef     = useRef(null);
  const lmRef     = useRef(null);
  const hovIdRef  = useRef(null);
  const pendIdRef = useRef(null);
  const faceWas   = useRef(false);

  const [loaderText,  setLoaderText]  = useState('Chargement du modèle IA…');
  const [loading,     setLoading]     = useState(true);
  const [status,      setStatus]      = useState('Initialisation…');
  const [hintVisible, setHintVisible] = useState(false);
  const [hovZone,     setHovZone]     = useState(null);
  const [pendZone,    setPendZone]    = useState(null);
  const [faceAlert,   setFaceAlert]   = useState(null);

  // ── Draw ────────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const lm = lmRef.current;
    ctx.clearRect(0, 0, w, h);
    if (!lm) return;

    // 1. Point cloud — all 468 landmarks as tiny glowing dots
    for (let i = 0; i < Math.min(lm.length, 468); i++) {
      const x = lm[i].x * w, y = lm[i].y * h;
      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(181,123,238,0.35)';
      ctx.fill();
    }

    // 2. Zone polygons — draw large zones first so small ones render on top
    const sortedZones = [...ZONES].sort((a, b) => b.poly.length - a.poly.length);
    for (const zone of sortedZones) {
      const pts = getPolyPts(zone, lm, w, h);
      if (pts.length < 3) continue;

      const isHov  = hovIdRef.current === zone.id;
      const isPend = pendIdRef.current === zone.id;
      const active = isHov || isPend;

      ctx.save();

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();

      if (active) {
        ctx.shadowColor = hexRgba(zone.color, 0.9);
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = hexRgba(zone.color, 0.38);
        ctx.fill();
      }

      ctx.strokeStyle = active ? hexRgba(zone.color, 1) : hexRgba(zone.color, 0.55);
      ctx.lineWidth   = active ? 2.5 : 1.2;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.stroke();

      // Label when active
      if (active) {
        const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        const label = zone.icon + '  ' + zone.name;
        ctx.font = '600 12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tw = ctx.measureText(label).width;
        const pad = 8;
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(7,7,15,0.88)';
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(cx - tw / 2 - pad, cy - 12, tw + pad * 2, 24, 6)
          : (() => {
              const x = cx - tw / 2 - pad, y2 = cy - 12, bw = tw + pad * 2, bh = 24, r = 6;
              ctx.moveTo(x + r, y2); ctx.lineTo(x + bw - r, y2);
              ctx.quadraticCurveTo(x + bw, y2, x + bw, y2 + r);
              ctx.lineTo(x + bw, y2 + bh - r);
              ctx.quadraticCurveTo(x + bw, y2 + bh, x + bw - r, y2 + bh);
              ctx.lineTo(x + r, y2 + bh);
              ctx.quadraticCurveTo(x, y2 + bh, x, y2 + bh - r);
              ctx.lineTo(x, y2 + r);
              ctx.quadraticCurveTo(x, y2, x + r, y2);
            })();
        ctx.fill();
        ctx.strokeStyle = hexRgba(zone.color, 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillText(label, cx, cy);
      }

      ctx.restore();
    }
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }, []);

  // ── MediaPipe ───────────────────────────────────────────────────────────

  const onResults = useCallback((results) => {
    resize();
    const faces = results.multiFaceLandmarks;
    if (!faces?.length) {
      lmRef.current = null;
      if (faceWas.current) {
        faceWas.current = false;
        setFaceAlert({ msg: '⚠ Repositionnez-vous face à la caméra', type: 'warn' });
        setTimeout(() => setFaceAlert(null), 3000);
      }
      draw();
      return;
    }
    lmRef.current = faces[0];
    if (!faceWas.current) {
      faceWas.current = true;
      setLoading(false);
      setHintVisible(true);
      setStatus('Visage détecté — appuyez sur une zone');
      setFaceAlert({ msg: '✓ Visage détecté', type: 'ok' });
      setTimeout(() => setFaceAlert(null), 3000);
    }
    draw();
  }, [draw, resize]);

  useEffect(() => {
    let active = true;
    const fm = new window.FaceMesh({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
    });
    fm.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    fm.onResults(onResults);
    fmRef.current = fm;

    async function start() {
      setLoaderText('Activation de la caméra…');
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) { s.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = s;
        const video = videoRef.current;
        video.srcObject = s;
        await new Promise(res => { video.onloadedmetadata = res; });
        await video.play();
        setStatus('Placez votre visage face à la caméra');
        setLoaderText('Détection du visage…');
        async function loop() {
          resize();
          if (video.readyState >= 2) { try { await fm.send({ image: video }); } catch (_) {} }
          animRef.current = requestAnimationFrame(loop);
        }
        loop();
      } catch {
        setLoaderText('⚠ Accès caméra refusé — vérifiez les permissions');
        setStatus('Caméra inaccessible');
      }
    }
    start();
    return () => {
      active = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      fm.close().catch(() => {});
    };
  }, [onResults, resize]);

  useEffect(() => {
    const h = () => { resize(); draw(); };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [resize, draw]);

  // ── Interaction ─────────────────────────────────────────────────────────

  const findZone = useCallback((px, py) => {
    const lm = lmRef.current;
    const canvas = canvasRef.current;
    if (!lm || !canvas) return null;
    const w = canvas.width, h = canvas.height;
    // Smallest-area zone first (tightest match wins)
    const sorted = [...ZONES].sort((a, b) => a.poly.length - b.poly.length);
    for (const zone of sorted) {
      const pts = getPolyPts(zone, lm, w, h);
      if (inPoly(px, py, pts)) return zone;
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!lmRef.current || pendIdRef.current) return;
    const p = toCanvas(e.clientX, e.clientY, canvasRef.current);
    const z = findZone(p.x, p.y);
    const id = z?.id ?? null;
    if (id !== hovIdRef.current) {
      hovIdRef.current = id;
      setHovZone(z ?? null);
      draw();
    }
  }, [findZone, draw]);

  const handleMouseLeave = useCallback(() => {
    if (pendIdRef.current) return;
    hovIdRef.current = null;
    setHovZone(null);
    draw();
  }, [draw]);

  const handleTap = useCallback((clientX, clientY) => {
    if (!lmRef.current || pendIdRef.current) return;
    const p = toCanvas(clientX, clientY, canvasRef.current);
    const z = findZone(p.x, p.y);
    if (z) {
      pendIdRef.current = z.id;
      hovIdRef.current = null;
      setHovZone(null);
      setPendZone(z);
      draw();
    }
  }, [findZone, draw]);

  const handleClick    = useCallback(e => handleTap(e.clientX, e.clientY), [handleTap]);
  const handleTouchEnd = useCallback(e => {
    e.preventDefault();
    if (!e.changedTouches.length) return;
    const t = e.changedTouches[0];
    handleTap(t.clientX, t.clientY);
  }, [handleTap]);

  const cancelPending = useCallback(() => {
    pendIdRef.current = null;
    setPendZone(null);
    draw();
  }, [draw]);

  const confirmZone = useCallback(() => {
    const z = pendZone;
    pendIdRef.current = null;
    hovIdRef.current = null;
    setPendZone(null);
    draw();
    if (z) onConfirm(z);
  }, [pendZone, onConfirm, draw]);

  const handleBack = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    onBack();
  }, [onBack]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="scanner">
      <div className="scan-bar">
        <button className="btn-back" onClick={handleBack}>← Retour</button>
        <span className="status-msg">{status}</span>
        {hintVisible && <span className="hint-badge">Touchez une zone</span>}
      </div>

      <div className="cam-wrap">
        <video ref={videoRef} className="cam-video" playsInline muted />
        <canvas
          ref={canvasRef}
          className="cam-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onTouchEnd={handleTouchEnd}
        />

        {loading && (
          <div className="loader">
            <div className="face-outline"><div className="scan-line" /></div>
            <div className="loader-text">{loaderText}</div>
          </div>
        )}

        {hovZone && !pendZone && (
          <div className="tooltip-zone">
            <span className="tip-name">{hovZone.icon} {hovZone.name}</span>
            <span className="tip-desc">{hovZone.desc}</span>
          </div>
        )}

        {faceAlert && (
          <div className={`face-alert ${faceAlert.type}`}>{faceAlert.msg}</div>
        )}

        <ConfirmDialog zone={pendZone} onConfirm={confirmZone} onCancel={cancelPending} />
      </div>
    </div>
  );
}
