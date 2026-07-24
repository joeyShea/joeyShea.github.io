# Personal Portfolio

The source for [joeyshea.github.io](https://joeyshea.github.io/) — my personal
portfolio and résumé.

## Tech stack

- **React 19 + TypeScript**, built with **Vite**
- Plain CSS with a small design-token system (`frontend/src/index.css`)
- Static, dependency-light single page — no backend, no third-party runtime calls
- Deployed to **GitHub Pages** (`npm run deploy`)

## Develop

```bash
cd frontend
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build -> dist/
npm run preview    # serve the production build
npm run deploy     # build + publish to GitHub Pages
```

## Structure

```
frontend/
├── index.html                # head: fonts (preconnect + async), social meta
├── public/
│   ├── icons/                # tech logos (svg)
│   └── project_images/       # project screenshots (webp)
└── src/
    ├── index.css             # design tokens + base styles + shared chips
    ├── App.tsx               # renders Home
    ├── pages/Home/           # hero + section scaffolding
    └── components/           # About, Experience, Projects, Education, Contact,
                              # MenuButton, SineWave
```

## Notes

- Project screenshots ship as a **two-size WebP pair**: `name.webp` (2400px wide,
  opened in the lightbox) and `name-thumb.webp` (640px, shown in the gallery
  grid). The gallery derives the thumb path by convention, so always generate
  both:

  ```bash
  cwebp -q 90 -m 6 -sharp_yuv -resize 2400 0 shot.png -o name.webp
  cwebp -q 82 -m 6 -sharp_yuv -resize 640 0  shot.png -o name-thumb.webp
  ```

  Only thumbnails load with the page (lazily); full-res is fetched on click.
- Section content lives in plain data arrays inside each component
  (e.g. `components/Projects/index.tsx`) — add a project by appending an object.
