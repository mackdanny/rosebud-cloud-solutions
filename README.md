# React + TypeScript + Vite

## Icons: regenerate the subset after adding one

Material Symbols is self-hosted and subset to only the icons the site uses
(`src/assets/material-symbols-subset.woff2`, wired up in `src/fonts.css`). The
full font is 1.1MB and used to wreck LCP/CLS; the subset is ~100KB.

The catch: an icon whose name is not in the subset renders as its **literal
ligature text**, so a new `<span className="material-symbols-outlined">circle</span>`
prints the word "circle" on the page. That has shipped twice (`24a2eef`,
`ac3a9ba`).

So: **after adding or renaming an icon, run**

```bash
npm run icons
```

and commit the regenerated `.woff2` alongside your change. It re-downloads the
current upstream font, scans `src/` for the icon names in use, and rebuilds the
subset with exactly those ligatures. `npm run build` runs `npm run icons:check`
first, which fails with the offending names if the committed font is missing any.
The check is offline, and skips itself where python/fontTools is absent rather
than failing a build it cannot actually perform.

Requires `python3` with fontTools: `python3 -m pip install 'fonttools[woff]'`.

**This is enforced in CI.** Both deploy workflows install fontTools before
building, so a missing icon fails the run at the build step and nothing is
deployed: the dev site keeps serving the previous build, and a production promote
stops before the first Azure step, so prod is never touched. If PyPI is
unreachable that install is non-fatal and the check simply skips, which is why
running `npm run icons` locally is still the real habit rather than leaning on CI.

Notes:

- Icons chosen at runtime (`<span …>{item.icon}</span>`) are picked up from
  `icon: '…'` fields in the source. If one still renders as text, run a build
  and then `node scripts/subset-icons.mjs --include-dist` (reads the names out
  of the prerendered HTML), or list it in `scripts/icons.extra.txt`.
- `node scripts/subset-icons.mjs --list` prints every name the scan found and
  where it came from.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
