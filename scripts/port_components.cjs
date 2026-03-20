const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Densingh/Downloads/projects/reactnative/src/components/themes';
const destDir = 'c:/Users/Densingh/Downloads/projects/react/src/components/themes';
const themeEngineSrc = 'c:/Users/Densingh/Downloads/projects/reactnative/src/components/ThemeEngine.tsx';
const themeEngineDest = 'c:/Users/Densingh/Downloads/projects/react/src/components/ThemeEngine.tsx';

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

// Copy themes directory
const files = fs.readdirSync(srcDir);
for (const file of files) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    content = content.replace(/'react-native-linear-gradient'/g, "'./LinearGradient'");
    fs.writeFileSync(path.join(destDir, file), content);
  }
}

// Copy ThemeEngine.tsx
let engineContent = fs.readFileSync(themeEngineSrc, 'utf8');
engineContent = engineContent.replace(/'react-native-linear-gradient'/g, "'./themes/LinearGradient'");
fs.writeFileSync(themeEngineDest, engineContent);

// Add LinearGradient stub
const gradientStub = `
import React from 'react';
import { View } from 'react-native';

export default function LinearGradient({ colors, start, end, style, children, ...props }: any) {
  let dir = '180deg';
  if (start && end) {
    const dy = end.y - start.y;
    const dx = end.x - start.x;
    dir = \`\${Math.atan2(dx, dy) * (180 / Math.PI)}deg\`;
  }
  const backgroundImage = \`linear-gradient(\${dir}, \${colors.join(', ')})\`;
  return <View style={[style, { backgroundImage } as any]} {...props}>{children}</View>;
}
`;
fs.writeFileSync(path.join(destDir, 'LinearGradient.tsx'), gradientStub);

console.log('Theme components ported!');
