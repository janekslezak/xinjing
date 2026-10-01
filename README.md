# Xinjing 心經 — Heart Sutra Practice

A standalone PWA for copying and chanting the **Heart Sutra** (般若波羅蜜多心經) in
**traditional Chinese characters**, using Xuanzang's classic translation
(唐三藏法師玄奘譯) — 260 characters of perfect wisdom, plus the 8-character title.

## Features

- **Copy 臨摹** — watch every stroke and copy each of the 268 characters by hand:
  step through the whole sutra in reading order with animated stroke order
  (hanzi-writer), a toggleable 田字格 practice grid and character outline, plus
  the source line for context. Stroke data for 經 is shown via its variant 掛.
- **Chant 誦讀** — full-text chant-along playback (Web Speech API, zh-TW voice
  preferred) with speed control (0.5×–1.25×), loop mode, and per-line listen
  buttons. The active line is highlighted as the chant advances.
- **Offline PWA** — installable, app shell precached, stroke data cached on
  first use; works fully offline afterwards.

## Stack

React 19 · TypeScript · Vite · vite-plugin-pwa (Workbox) · Tailwind CSS ·
framer-motion · lucide-react · hanzi-writer + hanzi-writer-data · react-router

## Develop

```sh
npm install
npm run dev      # dev server on :3000
npm run build    # type-check + production build (dist/)
npm run preview  # preview the production build
```

Stroke-order data (`public/hanzidata/*.json`) is extracted from the
`hanzi-writer-data` npm package by `scripts/copy-hanzidata.mjs`:

```sh
node scripts/copy-hanzidata.mjs
```

App icons are generated from the seal SVG with `scripts/make-icons.py`.

## Deploy

Static SPA — deploy `dist/` to any static host with SPA fallback
(`public/_redirects` included). This site is powered by
[Netlify](https://www.netlify.com/).

## Links

- GitHub: https://github.com/janekslezak/xinjing
- Code of Conduct: https://github.com/janekslezak/xinjing/blob/main/CODE_OF_CONDUCT.md
- Support: https://buycoffee.to/zhishui
