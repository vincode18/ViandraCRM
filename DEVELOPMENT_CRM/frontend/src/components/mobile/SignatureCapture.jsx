import { useRef, useState, useEffect } from 'react';

/**
 * SignatureCapture — HTML5 Canvas signature pad.
 * Per PWA-PRD-02 §5.8.4: 400×160px canvas at 2×DPR, #1A1A1A stroke on white.
 *
 * Props:
 *   onAccept: (blob: Blob) => void  — called with PNG blob when user accepts
 *   onClear?: () => void
 */
export default function SignatureCapture({ onAccept, onClear }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const lastPos = useRef(null);

  const CANVAS_W = 400;
  const CANVAS_H = 160;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    canvas.style.width = '100%';
    canvas.style.height = `${CANVAS_H}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => setIsDrawing(false);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsEmpty(true);
    onClear?.();
  };

  const handleAccept = () => {
    if (isEmpty) return;
    canvasRef.current?.toBlob((blob) => {
      if (blob) onAccept(blob);
    }, 'image/png');
  };

  return (
    <div>
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 12,
          touchAction: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Signature pad — draw your signature here"
          style={{ display: 'block', cursor: 'crosshair', touchAction: 'none' }}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
        />
      </div>

      {isEmpty && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12 }}>
          Draw your signature above
        </p>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={handleClear} className="btn-secondary" style={{ flex: 1, minHeight: 44 }}>
          Clear
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="btn-primary"
          disabled={isEmpty}
          style={{ flex: 1, minHeight: 44, opacity: isEmpty ? 0.5 : 1 }}
        >
          Accept Signature
        </button>
      </div>
    </div>
  );
}
