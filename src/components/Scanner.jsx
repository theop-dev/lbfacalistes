import { useRef, useEffect, useCallback, useState } from 'react';
// FaceMesh loaded via CDN in index.html — do NOT npm-import (WASM can't be bundled)
import ZONES from '../data/zones';
import ConfirmDialog from './ConfirmDialog';

// ── Geometry ──────────────────────────────────────────────────────────────────

function toCanvas(clientX, clientY, canvas) {
  const r = canvas.getBoundingClientRect();
  const rx = (clientX - r.left) * (canvas.width / r.width);
  const ry = (clientY - r.top) * (canvas.height / r.height);
  return { x: canvas.width - rx, y: ry };
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

// ── Scanner ───────────────────────────────────────────────────────────────────

export default function Scanner({ mode = 'tap', onBack, onConfirm, onCapture }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const streamRef = useRef(null);
  const fmRef     = useRef(null);
  const lmRef     = useRef(null);
  const hovIdRef  = useRef(null);
  const pendIdRef = useRef(null);
  const guideRef  = useRef(null);
  const faceWas   = useRef(false);

  const [loaderText,  setLoaderText]  = useState('Initialisation...');
  const [loading,     setLoading]     = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const [pendZone,    setPendZone]    = useState(null);
  const [guideZone,   setGuideZone]   = useState(null);
  const [faceAlert,   setFaceAlert]   = useState(null);

  // ── Draw — zones are INVISIBLE by default; only active zone is drawn ──────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const lm = lmRef.current;
    ctx.clearRect(0, 0, w, h);
    if (!lm) return;

    // Draw all zones but only render the active one
    const sortedZones = [...ZONES].sort((a, b) => b.poly.length - a.poly.length);
    for (const zone of sortedZones) {
      const isHov   = hovIdRef.current === zone.id;
      const isPend  = pendIdRef.current === zone.id;
      const isGuide = guideRef.current?.id === zone.id;
      const active  = isHov || isPend || isGuide;
      if (!active) continue; // invisible resting state

      const pts = getPolyPts(zone, lm, w, h);
      if (pts.length < 3) continue;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();

      ctx.shadowColor = hexRgba(zone.color, 0.85);
      ctx.shadowBlur  = 22;
      ctx.fillStyle   = hexRgba(zone.color, 0.36);
      ctx.fill();

      ctx.shadowBlur  = 0;
      ctx.strokeStyle = hexRgba(zone.color, 1);
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.stroke();

      // Zone name label
      const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
      const label = zone.name;
      ctx.font = '600 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tw = ctx.measureText(label).width;
      const pad = 8;
      ctx.fillStyle = 'rgba(7,7,15,0.88)';
      if (ctx.roundRect) ctx.roundRect(cx - tw / 2 - pad, cy - 12, tw + pad * 2, 24, 6);
      else ctx.rect(cx - tw / 2 - pad, cy - 12, tw + pad * 2, 24);
      ctx.fill();
      ctx.strokeStyle = hexRgba(zone.color, 0.5);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText(label, cx, cy);

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

  // ── MediaPipe ─────────────────────────────────────────────────────────────

  const onResults = useCallback((results) => {
    resize();
    const faces = results.multiFaceLandmarks;
    if (!faces?.length) {
      lmRef.current = null;
      if (faceWas.current) {
        faceWas.current = false;
        setFaceAlert({ msg: 'Repositionnez-vous face à la caméra', type: 'warn' });
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
      setFaceAlert({ msg: 'Visage détecté', type: 'ok' });
      setTimeout(() => setFaceAlert(null), 2500);
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
      setLoaderText('Activation de la caméra...');
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
        setLoaderText('Détection du visage...');
        async function loop() {
          resize();
          if (video.readyState >= 2) { try { await fm.send({ image: video }); } catch (_) {} }
          animRef.current = requestAnimationFrame(loop);
        }
        loop();
      } catch {
        setLoaderText('Accès caméra refusé — vérifiez les permissions');
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

  // ── Zone finding (area-based) ──────────────────────────────────────────────

  const findZone = useCallback((px, py) => {
    const lm = lmRef.current;
    const canvas = canvasRef.current;
    if (!lm || !canvas) return null;
    const w = canvas.width, h = canvas.height;
    const candidates = ZONES
      .map(zone => ({ zone, pts: getPolyPts(zone, lm, w, h) }))
      .filter(x => x.pts.length >= 3)
      .map(x => ({ ...x, area: polyArea(x.pts) }))
      .sort((a, b) => a.area - b.area);
    for (const { zone, pts } of candidates) {
      if (inPoly(px, py, pts)) return zone;
    }
    return null;
  }, []);

  // ── Interaction ───────────────────────────────────────────────────────────

  // Tap mode: click → pending zone → ConfirmDialog
  const handleTap = useCallback((clientX, clientY) => {
    if (mode !== 'tap' || !lmRef.current || pendIdRef.current) return;
    const p = toCanvas(clientX, clientY, canvasRef.current);
    const z = findZone(p.x, p.y);
    if (z) {
      pendIdRef.current = z.id;
      hovIdRef.current = null;
      setPendZone(z);
      draw();
    }
  }, [mode, findZone, draw]);

  // Tap mode: mouse hover (cosmetic highlight)
  const handleMouseMove = useCallback((e) => {
    if (mode !== 'tap' || !lmRef.current || pendIdRef.current) return;
    const p = toCanvas(e.clientX, e.clientY, canvasRef.current);
    const z = findZone(p.x, p.y);
    const id = z?.id ?? null;
    if (id !== hovIdRef.current) {
      hovIdRef.current = id;
      draw();
    }
  }, [mode, findZone, draw]);

  const handleMouseLeave = useCallback(() => {
    if (mode !== 'tap' || pendIdRef.current) return;
    hovIdRef.current = null;
    draw();
  }, [mode, draw]);

  const handleClick    = useCallback(e => handleTap(e.clientX, e.clientY), [handleTap]);
  const handleTouchEnd = useCallback(e => {
    e.preventDefault();
    if (mode === 'tap' && e.changedTouches.length)
      handleTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }, [mode, handleTap]);

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

  // Guided mode: select zone from list
  const selectGuideZone = useCallback((z) => {
    guideRef.current = z;
    setGuideZone(z);
    draw();
  }, [draw]);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const lm    = lmRef.current;
    if (!video || !lm) return;
    const off = document.createElement('canvas');
    off.width  = video.videoWidth  || video.clientWidth;
    off.height = video.videoHeight || video.clientHeight;
    off.getContext('2d').drawImage(video, 0, 0);
    const imageData = off.toDataURL('image/jpeg', 0.9);
    const landmarks = Array.from(lm).map(p => ({ x: p.x, y: p.y, z: p.z || 0 }));
    onCapture({ imageData, landmarks });
  }, [onCapture]);

  const handleBack = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    onBack();
  }, [onBack]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="scanner">
      <div className="scan-bar">
        <button className="btn-back" onClick={handleBack}>← Retour</button>
        {mode === 'hover' ? (
          guideZone ? (
            <>
              <span className="status-msg" style={{ color: '#fff', fontWeight: 600 }}>{guideZone.name}</span>
              <button className="btn-validate" onClick={() => onConfirm(guideZone)}>Valider →</button>
            </>
          ) : (
            <span className="status-msg">Sélectionnez une zone ci-dessous</span>
          )
        ) : (
          <>
            <span className="status-msg">
              {hintVisible ? 'Touchez une zone du visage' : 'Placez votre visage face à la caméra'}
            </span>
            {hintVisible && !pendZone && (
              <button className="btn-capture" onClick={captureFrame}>Carte</button>
            )}
          </>
        )}
      </div>

      <div className="cam-wrap" style={mode === 'hover' ? { flex: '0 0 52%' } : {}}>
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

        {faceAlert && (
          <div className={`face-alert ${faceAlert.type}`}>{faceAlert.msg}</div>
        )}

        <ConfirmDialog zone={pendZone} onConfirm={confirmZone} onCancel={cancelPending} />
      </div>

      {mode === 'hover' && (
        <div className="zone-guide-panel">
          <div className="zone-guide-chips">
            {ZONES.map(z => (
              <button
                key={z.id}
                className={`zone-chip${guideZone?.id === z.id ? ' selected' : ''}`}
                style={guideZone?.id === z.id ? {
                  borderColor: z.color,
                  color: z.color,
                  background: `${z.color}22`,
                } : {}}
                onClick={() => selectGuideZone(guideZone?.id === z.id ? null : z)}
              >
                {z.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
