import React from 'react';

export default function BlobBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div className="blob" style={{ width: 400, height: 400, background: 'var(--color-primary)', top: -100, left: -100, animationDelay: '0s' }} />
      <div className="blob" style={{ width: 300, height: 300, background: 'var(--color-accent)', bottom: -80, right: -80, animationDelay: '-4s' }} />
      <div className="blob" style={{ width: 200, height: 200, background: 'var(--color-primary)', top: '40%', right: '20%', animationDelay: '-8s' }} />
    </div>
  );
}
