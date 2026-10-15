# Ali Aldulaimi — Portfolio v2

Vite + TypeScript, no framework. All content lives in `src/data.ts`.

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build -> dist/
npm run preview  # serve the built site
```

## Structure
- `index.html` – page layout (hero, about, skills, projects, experience, contact)
- `src/data.ts` – projects, experience, education, skills, contact info (edit this to update the site)
- `src/mesh.ts` – animated BLE-mesh hero background (click to broadcast a packet)
- `src/main.ts` – rendering + interactions (filters, project popups, 3D viewer, counters, etc.)
- `src/style.css` – design system and styles
- `public/media`, `public/docs` – images, videos, 3D rack model, PDFs

## Adding a project
Add an object to `projects` in `src/data.ts`, put its images/videos in `public/media/`, and it appears automatically.

## Deploying
Deployed on Vercel (framework preset: Vite, build command `npm run build`, output `dist`).
Any static host works: upload the `dist/` folder.
Videos are compressed to 720p H.264 MP4 to keep the site fast.
