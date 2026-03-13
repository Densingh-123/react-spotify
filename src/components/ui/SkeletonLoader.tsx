import React from 'react';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export default function SkeletonLoader({ width = '100%', height = 100, style, className = '' }: Props) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: 12, ...style }}
    />
  );
}
