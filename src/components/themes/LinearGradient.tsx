
import React from 'react';
import { View } from 'react-native';

export default function LinearGradient({ colors, start, end, style, children, ...props }: any) {
  let dir = '180deg';
  if (start && end) {
    const dy = end.y - start.y;
    const dx = end.x - start.x;
    dir = `${Math.atan2(dx, dy) * (180 / Math.PI)}deg`;
  }
  const backgroundImage = `linear-gradient(${dir}, ${colors.join(', ')})`;
  return <View style={[style, { backgroundImage } as any]} {...props}>{children}</View>;
}
