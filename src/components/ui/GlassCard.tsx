import React from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}
export default function GlassCard({ className = '', style, children, onClick }: Props) {
  return (
    <div className={`glass-card ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
