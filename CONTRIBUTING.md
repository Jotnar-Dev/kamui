# Contribuir a KamUI

Esta guía documenta el proceso estándar para agregar nuevos componentes a `@jotnardev/core`. Nace de las lecciones (varias, dolorosas) de los componentes `Button` e `Input` — cada regla acá abajo existe porque algo se rompió en silencio antes de tenerla.

## 🏗️ Blueprint para nuevos componentes

### 1. Estructura base

Crea el directorio correspondiente en `packages/core/src/components/<NombreComponente>/`.

### 2. El componente (`<NombreComponente>.tsx`)

- Declara los tipos extendiendo estrictamente los atributos nativos de React (ej. `HTMLAttributes<HTMLDivElement>`).
- Importa los estilos con `import styles from './<NombreComponente>.module.css';`.
- Concatena siempre el `className` nativo (el que viene por props) con las clases del módulo.

### 3. Los estilos (`<NombreComponente>.module.css`)

- Consume únicamente variables CSS globales (`var(--kamui-...)`).
- **Regla estricta: si necesitas un token que no existe, agrégalo primero en `packages/core/src/tokens/tokens.ts`.** Nunca hardcodees colores o espaciados en el CSS del componente, y nunca uses un `var(--kamui-...)` "a ojo" sin confirmar que ese token existe de verdad.
- **Por qué esta regla es estricta y no una sugerencia:** el `Input` tuvo justo este bug — su estado `:disabled` usaba `var(--kamui-color-gray-400)` y `var(--kamui-color-gray-200)`, que no existían en la escala de grises (`100/300/500/700/900`). Nada en el pipeline lo detectó — ni `tsc`, ni `eslint`, ni `prettier`, ni `tsup`, ni el build de Storybook — porque una `var()` que apunta a una custom property indefinida no es un error de sintaxis, el navegador simplemente cae al valor heredado. Solo se nota mirando el componente renderizado. Antes de dar por buena la CSS de un componente nuevo, cruza cada `var(--kamui-...)` contra `tokens.css` generado (`pnpm --filter @jotnardev/core tokens:build` y revisa `src/tokens/tokens.css`), no contra lo que "debería" existir.

### 4. El re-export interno (`index.ts`)

Dentro de la carpeta del componente:

```ts
export { <NombreComponente> } from './<NombreComponente>';
```

### 5. El export global (`packages/core/src/index.ts`)

Agrega el componente a la API pública de la librería:

```ts
export { <NombreComponente> } from './components/<NombreComponente>';
```

### 6. La documentación (`apps/storybook/src/stories/<NombreComponente>.stories.tsx`)

- Importa el componente directamente desde el paquete consumible: `import { <NombreComponente> } from '@jotnardev/core';` (nunca desde una ruta relativa a `src/` — así se prueba lo que un consumidor real va a instalar, no el código fuente).
- Define la configuración `meta` y documenta al menos el estado `Default` en los `args`.

### 7. Validación local antes de cualquier commit

```bash
pnpm typecheck && pnpm lint && pnpm exec prettier --write . && pnpm build && pnpm --filter storybook-app build-storybook
```

Este comando es el mínimo indispensable — es el mismo criterio de aceptación que se usó para verificar Button, la migración a tsup, e Input. Corre los cinco pasos en ese orden porque cada uno atrapa una clase de error distinta que los anteriores no ven:

| Paso               | Qué atrapa                                                                                                                 | Qué **no** atrapa                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `typecheck`        | Imports rotos, tipos incorrectos                                                                                           | Rutas de assets (CSS, etc.) — `tsc` no valida imports de `.css`                                                                                |
| `lint`             | Problemas de código (reglas de ESLint)                                                                                     | Formato, tipos, rutas de assets                                                                                                                |
| `prettier --write` | Formato — y lo corrige automáticamente                                                                                     | Todo lo demás                                                                                                                                  |
| `build`            | Que el paquete compile y genere `dist/`                                                                                    | Que los assets copiados (CSS) terminen en la ruta que el bundle realmente espera, y que los tokens `var(--kamui-...)` usados existan de verdad |
| `build-storybook`  | La prueba real: si un consumidor externo (`@jotnardev/core`) puede resolver e importar el componente completo, con estilos | — este es el único paso que hubiera detectado tanto el bug de rutas de Fase 1 como el bug de tokens de Input                                   |

**Nota:** este comando usa `prettier --write` (autoarregla el formato), que es distinto de lo que corre en CI (`.github/workflows/ci.yml` usa `prettier --check`, que solo valida y falla si algo no está formateado). Para uso local antes de un commit, `--write` es más cómodo porque deja los archivos listos para `git add`; solo ten en cuenta que si el commit final no incluye esos cambios de formato, CI sí lo va a marcar en rojo con `--check`.

Ningún paso de este checklist es opcional, y el orden importa: no tiene sentido revisar lint si `typecheck` ya falló, y no tiene sentido dar un componente por terminado solo porque `pnpm build` pasó — `build` no prueba que el componente realmente funcione para un consumidor externo, solo que el compilador no tiró error. Eso solo lo prueba `build-storybook`.
