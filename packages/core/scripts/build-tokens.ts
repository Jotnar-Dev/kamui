import * as fs from 'fs';
import { tokens } from '../src/tokens/tokens';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para convertir camelCase a kebab-case (ej. fontSize -> font-size)
function toKebabCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

let css = ':root {\n';

for (const [category, values] of Object.entries(tokens)) {
  const kebabCategory = toKebabCase(category);

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'object') {
      // Para colores anidados (ej. color.gray.100)
      for (const [subKey, subValue] of Object.entries(value)) {
        css += `  --kamui-${kebabCategory}-${key}-${subKey}: ${subValue};\n`;
      }
    } else {
      // Para valores planos (ej. space.4, fontSize.md)
      css += `  --kamui-${kebabCategory}-${key}: ${value};\n`;
    }
  }
}

css += '}\n';

// Guardar el archivo CSS resultante en la carpeta de tokens
const outputPath = path.resolve(__dirname, '../src/tokens/tokens.css');
fs.writeFileSync(outputPath, css, 'utf8');

console.log('✅ tokens.css generado exitosamente en src/tokens/');
