# Kilo Blog — Frontend

An editorial blog and CMS frontend built with Vite, React, TypeScript, Tailwind,
Framer Motion and Tiptap.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` and talks to the API at
`VITE_API_URL` (default `http://localhost:8080`).

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and produce a production build in `dist/`
- `npm run preview` — preview the production build
- `npm run typecheck` — run TypeScript without emitting

## Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3.4 + `tailwindcss-animate`
- Framer Motion (`motion/react`)
- React Router v6
- Axios + a typed API client (`src/lib/api.ts`)
- Zustand for auth + theme state
- Tiptap rich-text editor
- `lucide-react` icons, `date-fns`, `react-hot-toast`

## Auth

In dev a "Demo as Admin" shortcut is rendered on the login page. It calls
`POST /api/auth/login` with the seeded admin credentials. The JWT is stored in
`localStorage` and attached to every request by an Axios interceptor.

## Folder layout

```
src/
├── lib/        api client, stores, helpers, motion presets
├── types/      shared API types
├── hooks/      data-fetching hooks (typed wrappers over api.ts)
├── components/ ui + layout + blog + editor + moderation + auth pieces
├── pages/      route components
└── routes.tsx  router config with role guards
```
