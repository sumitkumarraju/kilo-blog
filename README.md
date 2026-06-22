# Kilo Blog

> An editorial blog and content management system with publish workflow, threaded comments, tagging, and a moderation dashboard. Built end-to-end with **Spring Boot 3.3 + Java 21** on the backend, **React 18 + TypeScript + Vite** on the frontend, **PostgreSQL** for persistence, and pushed to an **awwwards-grade visual finish** with Tailwind, Framer Motion, and a typographic system built around Fraunces and Inter.

<p align="center">
  <em>Words that take their time finding the page.</em>
</p>

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Domain model](#domain-model)
- [Project structure](#project-structure)
- [Quickstart (local)](#quickstart-local)
- [Seeded accounts](#seeded-accounts)
- [Feature tour](#feature-tour)
- [Design system](#design-system)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Future work](#future-work)
- [Credits](#credits)

---

## Highlights

- **Full content lifecycle.** `DRAFT → PENDING_REVIEW → PUBLISHED → REJECTED → ARCHIVED`, enforced server-side with explicit state transitions.
- **Role-based authorization.** `READER · AUTHOR · EDITOR · ADMIN`, enforced at the service layer with `@PreAuthorize` and at the route level on the frontend with `RequireRole`.
- **JWT auth.** HS512 token in `Authorization: Bearer`, 24h expiry, BCrypt password hashing.
- **Rich Tiptap editor** with bubble menu, link + image inserts, sticky toolbar, live autosave indicator, slug auto-derivation, role-aware action buttons (Save / Submit for review / Publish now), cover image picker with **URL paste OR device upload** (drag-drop, resize, data-URL embed).
- **Moderation dashboard** with animated stat tiles (rAF counter-up), tabbed Posts/Comments queue, inline rejection reasons, popLayout exits on approve.
- **Public reader experience.** Magazine grid, tag filters, search, paginated archive, parallax cover via `useScroll`, drop-cap prose, threaded comments, shared `layoutId` for card-to-hero transitions.
- **Awwwards-level UI.** Editorial type (Fraunces / Inter / JetBrains Mono), warm paper palette with single accent, custom `cubic-bezier(0.23, 1, 0.32, 1)` ease-out curve, 160–250ms UI durations, `useReducedMotion` honored everywhere, no `scale(0)` entries — informed by Emil Kowalski's design engineering principles.

---

## Tech stack

### Backend

| Layer            | Technology                                             |
| ---------------- | ------------------------------------------------------ |
| Language         | Java 21                                                |
| Framework        | Spring Boot 3.3.4                                      |
| Web              | Spring Web (MVC), Bean Validation                      |
| Persistence      | Spring Data JPA, Hibernate 6                           |
| Database         | PostgreSQL 16 (prod) · H2 in-memory (zero-setup demo)  |
| Security         | Spring Security 6, JWT (`jjwt` 0.12.6), BCrypt         |
| API docs         | springdoc-openapi 2.6 (Swagger UI)                     |
| Build            | Maven                                                  |
| Boilerplate      | Lombok                                                 |

### Frontend

| Layer            | Technology                                             |
| ---------------- | ------------------------------------------------------ |
| Language         | TypeScript 5.7                                         |
| Framework        | React 18                                               |
| Build            | Vite 5                                                 |
| Styling          | Tailwind CSS 3.4, `tailwindcss-animate`, CSS variables |
| Animation        | Framer Motion (`motion/react` v11)                     |
| Editor           | Tiptap 2 (StarterKit, Placeholder, Link, Image)        |
| Routing          | React Router DOM v6                                    |
| State            | Zustand (auth + theme)                                 |
| HTTP             | Axios (typed client, JWT interceptor)                  |
| Icons            | Lucide React                                           |
| Type             | Fraunces / Inter / JetBrains Mono Variable (`@fontsource`) |
| Utilities        | date-fns, clsx, react-hot-toast                        |

### Architecture patterns

- **Layered MVC** — Controller → Service → Repository
- **DTO pattern** — entities never leave the service layer
- **RESTful API** with consistent error envelope
- **CMS Workflow Model** — explicit state machine for posts and comments
- **Mapper pattern** — hand-written for legibility (`PostMapper`, `CommentMapper`, etc.)

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Browser                                   │
│                                                                        │
│   ┌───────────────────────────────────────────────────────────────┐    │
│   │  React + Vite (TypeScript)                                    │    │
│   │  ┌────────────┐  ┌───────────────┐  ┌──────────────────────┐  │    │
│   │  │ Pages      │  │ Components    │  │ State (Zustand)       │  │    │
│   │  │ /articles  │  │ Editor        │  │ auth-store            │  │    │
│   │  │ /editor    │  │ ArticleCard   │  │ theme-store           │  │    │
│   │  │ /moderation│  │ CommentThread │  │                       │  │    │
│   │  └────────────┘  └───────────────┘  └──────────────────────┘  │    │
│   │             ▲                              ▲                  │    │
│   │             └──────────────┬───────────────┘                  │    │
│   │                            ▼                                  │    │
│   │                   Typed Axios client                          │    │
│   │      JWT request interceptor · 401 → logout interceptor       │    │
│   └────────────────────────────┬──────────────────────────────────┘    │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │ HTTPS · JSON · Bearer JWT
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Spring Boot (Java 21)                            │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  JWT Filter → SecurityContext → @PreAuthorize on services    │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                  │                                     │
│   ┌──────────────────────────────▼───────────────────────────────┐     │
│   │  Controllers (Auth, Post, Tag, Comment, Moderation)          │     │
│   └──────────────────────────────┬───────────────────────────────┘     │
│                                  ▼                                     │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  Services (business logic, state transitions, validation)    │     │
│   │  AuthService · PostService · CommentService · TagService     │     │
│   │  ModerationService · SlugService · ReadingTimeCalculator     │     │
│   └──────────────────────────────┬───────────────────────────────┘     │
│                                  ▼                                     │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  Repositories (Spring Data JPA)                              │     │
│   │  UserRepository · PostRepository · TagRepository             │     │
│   │  CommentRepository                                           │     │
│   └──────────────────────────────┬───────────────────────────────┘     │
│                                  │ Hibernate · JDBC                    │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   ▼
                  ┌─────────────────────────────────┐
                  │       PostgreSQL 16             │
                  │       (or H2 in-memory)         │
                  └─────────────────────────────────┘
```

### Request lifecycle (example: open an article)

1. Browser navigates to `/article/the-quiet-craft-of-empty-states`.
2. `ArticlePage` calls `api.posts.bySlug(slug)`, which hits `GET /api/posts/the-quiet-craft-of-empty-states`.
3. Axios interceptor adds `Authorization: Bearer <jwt>` if present.
4. Spring's `JwtAuthenticationFilter` validates the token and populates the `SecurityContext`.
5. `PostController.getBySlug()` delegates to `PostService.getBySlug()`.
6. Service fetches the entity via `PostRepository.findBySlug()`, then increments the view count with a separate `@Modifying` query.
7. `PostMapper.toResponse()` converts the entity to a `PostResponse` DTO.
8. Hibernate runs `SELECT ... FROM posts WHERE slug = ?` against PostgreSQL.
9. Response flows back as JSON; React renders the long-form view with parallax cover and threaded comments.

---

## Domain model

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │    Post      │         │     Tag      │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (UUID)    │◄────────┤ author       │         │ id (UUID)    │
│ email        │  N:1    │ id (UUID)    │ N:N     │ slug         │
│ passwordHash │         │ slug         │◄────────┤ name         │
│ displayName  │         │ title        │         │ color        │
│ bio          │         │ content      │  via    │ description  │
│ avatarUrl    │         │ excerpt      │post_tags│              │
│ role         │         │ coverImageUrl│         │              │
│ createdAt    │         │ status       │         │              │
└──────────────┘         │ readingTime  │         └──────────────┘
                         │ viewCount    │
                         │ publishedAt  │
                         │ rejectionReason │
                         │ createdAt    │
                         │ updatedAt    │
                         └──────┬───────┘
                                │ 1:N
                                ▼
                         ┌──────────────┐
                         │   Comment    │
                         ├──────────────┤
                         │ id (UUID)    │
                         │ post         │
                         │ author?      │   (nullable for guest)
                         │ guestName    │
                         │ guestEmail   │
                         │ content      │
                         │ status       │   PENDING/APPROVED/REJECTED/SPAM
                         │ parent?      │   (self-ref → threaded)
                         │ createdAt    │
                         │ moderatedAt  │
                         │ moderatedBy  │
                         └──────────────┘
```

### State machines

**Post**

```
DRAFT ──submit──▶ PENDING_REVIEW ──approve──▶ PUBLISHED ──archive──▶ ARCHIVED
                        │                          ▲
                        └─reject──▶ REJECTED ──submit──┘
                                                   │
                                               (publish, EDITOR+ only)
                                              DRAFT ──publish──▶ PUBLISHED
```

**Comment**

```
PENDING ──approve──▶ APPROVED
   │
   ├──reject──▶ REJECTED
   └──spam─────▶ SPAM
```

---

## Project structure

```
kilo-blog/
├── README.md                   This file
├── EVALUATION_REPORT.md        Detailed report for evaluations / academic review
├── FUTURE_FEATURES.md          Portfolio-ready feature ideas
├── DEPLOYMENT.md               Vercel + Render / Railway / Fly walkthrough
├── package.json                Root scripts (concurrently runs both halves)
├── vercel.json                 Vercel frontend deployment config
│
├── backend/                    Spring Boot 3.3 · Java 21 · Maven
│   ├── pom.xml
│   ├── README.md               Backend-specific run notes
│   └── src/main/
│       ├── java/com/kilo/blog/
│       │   ├── KiloBlogApplication.java
│       │   ├── config/         SecurityConfig, CorsConfig, OpenApiConfig
│       │   ├── controller/     5 REST controllers (Auth, Post, Tag, Comment, Moderation)
│       │   ├── service/        Business logic (8 services)
│       │   ├── repository/     Spring Data JPA repos (4)
│       │   ├── domain/         JPA entities + enums
│       │   ├── dto/
│       │   │   ├── request/    11 request records
│       │   │   └── response/   10 response records
│       │   ├── mapper/         Entity ⇄ DTO converters
│       │   ├── security/       JwtTokenProvider, JwtAuthenticationFilter, SecurityUser
│       │   ├── exception/      Custom exceptions + @RestControllerAdvice
│       │   └── seed/           DataSeeder (39 posts, 8 tags, 4 users, ~50 comments)
│       └── resources/
│           └── application.yml Profiles: default (Postgres) · h2 · prod
│
└── frontend/                   Vite 5 · React 18 · TypeScript · Tailwind
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx · App.tsx · index.css · routes.tsx
        ├── types/api.ts        Hand-typed contracts mirroring backend DTOs
        ├── lib/
        │   ├── api.ts          Typed Axios client + JWT interceptor
        │   ├── auth-store.ts   Zustand: user, token, login/logout, hydrate
        │   ├── theme-store.ts  Zustand: light/dark persistence
        │   ├── format.ts       Dates, reading time, initials
        │   └── motion-presets.ts Reusable Framer Motion variants
        ├── hooks/              use-posts, use-comments, use-tags, use-moderation
        ├── components/
        │   ├── layout/         Navbar, Footer, PageTransition
        │   ├── ui/             Button, Input, Tag, Badge, Skeleton, EmptyState,
        │   │                   ThemeToggle, ScrollProgress, CommandPalette, Toast
        │   ├── blog/           ArticleCard, ArticleHero, CommentThread, CommentForm,
        │   │                   PostMeta, TagFilter
        │   ├── editor/         TiptapEditor, EditorToolbar, CoverImagePicker
        │   ├── moderation/     ModerationStats, PendingPostRow, PendingCommentRow
        │   └── auth/           RequireRole route guard
        └── pages/              Home, Articles, Article, Editor, Dashboard,
                                Moderation, Tag, Login, Register, NotFound
```

---

## Quickstart (local)

### Prerequisites

- **JDK 21** (`brew install openjdk@21`)
- **Maven 3.9+** (`brew install maven`)
- **Node 20+** + npm (`brew install node`)
- **PostgreSQL 16** (`brew install postgresql@16 && brew services start postgresql@16`)

### Database

```bash
createuser kilo --pwprompt   # password: kilo (or set DB_PASSWORD env var)
createdb kiloblog --owner=kilo
```

> **Zero-setup alternative:** run the backend with `SPRING_PROFILES_ACTIVE=h2` to use an in-memory H2 database instead. Data wipes on restart but it requires no Postgres install.

### Run both with one command

```bash
cd kilo-blog
npm install
npm run dev
```

`concurrently` boots the backend (`:8080`) and frontend (`:5173`) together. Both reload on file changes.

### Run individually

```bash
# Terminal 1
cd backend
mvn spring-boot:run

# Terminal 2
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Seeded accounts

The `DataSeeder` runs whenever the database is empty (controlled by `kilo.seed.enabled`, defaults to `true`).

| Role   | Email              | Password    |
| ------ | ------------------ | ----------- |
| ADMIN  | admin@kilo.blog    | Admin123!   |
| EDITOR | editor@kilo.blog   | Editor123!  |
| AUTHOR | sara@kilo.blog     | Author123!  |
| AUTHOR | ari@kilo.blog      | Author123!  |

Seed content: **8 tags · 30 published posts · 2 drafts · 1 pending review · 6 archived · ~50 comments** spanning approved and pending.

The login page exposes a **Demo as Admin** shortcut in dev mode.

---

## Feature tour

### Public reader

- **Home** — editorial hero with clamp-sized serif headline, featured spotlight (1 large + 2 small with shared `layoutId`), latest magazine grid, topic tag cloud, newsletter strip.
- **Article archive** — sticky filter rail, full-text search across titles, tag filter, sort newest/oldest/popular, paginated grid with skeletons.
- **Article reader** — parallax cover via `useScroll`+`useTransform`, drop-cap on the first paragraph, sticky share rail (copy link / X / save / share API), threaded comments, related-posts strip.
- **Cmd+K command palette** — keyboard navigation, instant post search, role-aware shortcuts (editor, moderation queue).

### Authoring

- **Tiptap editor** — bold/italic/link/H2/H3/blockquote/code via bubble menu, image insert, sticky toolbar, autosave with 1.2s debounce, status indicator (`Untouched → Unsaved → Saving → Saved 12s ago`).
- **Cover image** — paste URL **or** upload from device with drag-drop, client-side resize to 1600px, JPEG/PNG encoding, embedded as data URL (no separate storage required).
- **Slug** — auto-derived from title, with an Edit/Auto toggle to override.
- **Tags** — multi-select via colored pill toggles.
- **Submit for review** — author flow.
- **Publish now** — editor/admin shortcut from any draft.
- **Rejection feedback** — inline reason panel shown when a post comes back rejected.

### Moderation

- **Stats panel** — 4 tiles (pending posts, pending comments, published, total) with rAF counter-up animations.
- **Pending Posts tab** — preview + author + tags + timestamp, Approve / Reject buttons, expandable rejection-reason textarea.
- **Pending Comments tab** — author/guest + body + timestamp, single-click Approve or Remove.
- **popLayout exits** — items animate out cleanly when moderated.
- **Empty state** — calm "All clear" message with check icon (no emojis anywhere — Lucide SVG icons only).

### Cross-cutting

- **Dark mode** — toggle in navbar; persisted to localStorage; warm near-black palette, never pure black.
- **Scroll progress** — top reading bar using `useScroll` + `useSpring`.
- **Page transitions** — fade-up on route change.
- **Authorization** — `RequireRole` route guard; `useAuthStore` powers conditional UI.

---

## Design system

### Type

```
Display:  Fraunces                — serif, italic axis, used for headlines
Body:     Inter                   — geometric sans, UI surfaces
Mono:     JetBrains Mono Variable — eyebrow labels, dates, code
```

### Color tokens (CSS variables, light + dark)

| Token       | Light       | Dark        | Use                              |
| ----------- | ----------- | ----------- | -------------------------------- |
| `--paper`   | `#FAF7F2`   | `#0E0D0C`   | Background                       |
| `--ink`     | `#0D0D0F`   | `#F2EFE8`   | Primary text                     |
| `--muted`   | `#6B6B6B`   | `#9B9590`   | Secondary text                   |
| `--line`    | `#E8E2D6`   | `#26241F`   | Borders, hairlines               |
| `--accent`  | `#FF5C28`   | `#FF7A48`   | Single accent, used sparingly    |

### Motion

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

| Duration | Use                          |
| -------- | ---------------------------- |
| 160ms    | Button press, hover changes  |
| 200ms    | Tooltips, small popovers     |
| 240ms    | Modals, drawers              |
| 400ms    | Page transitions             |

**Rules:**
- Never animate from `scale(0)` — start at `scale(0.95)` + `opacity: 0`.
- Lists use `AnimatePresence mode="popLayout"`.
- Reveals fire once with `viewport={{ once: true, margin: '-80px' }}`.
- `useReducedMotion` removes movement, keeps opacity fades.
- Stagger between items: 50ms (decorative — never blocks interaction).

---

## API reference

All endpoints under `/api`. Full schemas in Swagger UI: `http://localhost:8080/swagger-ui.html`.

### Auth

| Method | Path                       | Body                                | Auth     |
| ------ | -------------------------- | ----------------------------------- | -------- |
| POST   | `/api/auth/register`       | `{email, password, displayName}`    | public   |
| POST   | `/api/auth/login`          | `{email, password}`                 | public   |
| GET    | `/api/auth/me`             | —                                   | bearer   |

### Posts

| Method | Path                                | Notes                                          |
| ------ | ----------------------------------- | ---------------------------------------------- |
| GET    | `/api/posts?page&size&tag&q&sort`   | Public; `sort=newest\|oldest\|popular`         |
| GET    | `/api/posts/featured`               | Top 4 most-viewed published                    |
| GET    | `/api/posts/{slug}`                 | Published OR owned; bumps view count           |
| GET    | `/api/posts/id/{uuid}`              | Author/staff load by id (editor re-open)       |
| POST   | `/api/posts`                        | `{title, content, excerpt?, coverImageUrl?, tagSlugs[]}` |
| PUT    | `/api/posts/{slug}`                 | Update by author or EDITOR+                    |
| DELETE | `/api/posts/{slug}`                 | Author or EDITOR+                              |
| POST   | `/api/posts/{id}/submit`            | DRAFT/REJECTED → PENDING_REVIEW                |
| POST   | `/api/posts/{id}/approve`           | PENDING_REVIEW → PUBLISHED (EDITOR+)           |
| POST   | `/api/posts/{id}/publish`           | Any → PUBLISHED (EDITOR+, one-step)            |
| POST   | `/api/posts/{id}/reject`            | `{reason}` (EDITOR+)                           |
| POST   | `/api/posts/{id}/archive`           | → ARCHIVED                                     |
| GET    | `/api/posts/me/drafts`              | Author dashboard                               |
| GET    | `/api/posts/moderation/queue`       | EDITOR+                                        |

### Tags

| Method | Path                       | Notes              |
| ------ | -------------------------- | ------------------ |
| GET    | `/api/tags`                | All tags           |
| GET    | `/api/tags/popular`        | Top by post count  |
| GET    | `/api/tags/{slug}`         | Single tag         |
| POST   | `/api/tags`                | EDITOR+            |

### Comments

| Method | Path                                 | Notes                                       |
| ------ | ------------------------------------ | ------------------------------------------- |
| GET    | `/api/posts/{slug}/comments`         | Approved comments                           |
| POST   | `/api/posts/{slug}/comments`         | Anyone (guest needs name); lands in PENDING |
| GET    | `/api/comments/moderation/queue`     | EDITOR+ pending queue                       |
| PUT    | `/api/comments/{id}/moderate`        | `{status, reason?}` (EDITOR+)               |

### Moderation

| Method | Path                       | Notes          |
| ------ | -------------------------- | -------------- |
| GET    | `/api/moderation/stats`    | EDITOR+ stats  |

---

## Deployment

See **`DEPLOYMENT.md`** for the full walkthrough. Summary:

- **Frontend → Vercel** (free tier).
  - Project root: this repo
  - Build command: `cd frontend && npm install && npm run build`
  - Output: `frontend/dist`
  - Env var: `VITE_API_URL` → your deployed backend URL
  - `vercel.json` is checked in.
- **Backend → Render / Railway / Fly.io** (free tier on Render).
  - Build: `cd backend && mvn -DskipTests package`
  - Start: `java -jar backend/target/*.jar`
  - Env vars: `SPRING_PROFILES_ACTIVE=prod`, `DB_USER`, `DB_PASSWORD`, `KILO_JWT_SECRET`, `KILO_CORS_ALLOWED_ORIGINS=https://your-app.vercel.app`
- **Database → Render Managed Postgres / Supabase / Neon** (all free tier).

---

## Future work

See **`FUTURE_FEATURES.md`** for the prioritized list. Top picks for a portfolio:

1. **Cloud image storage** (Cloudinary / S3) replacing data-URL embed
2. **Full-text search** via Postgres `tsvector` + GIN index, with weighted ranking
3. **Email notifications** on publish/reject/comment
4. **WebSocket live moderation** — pending counts update without refresh
5. **AI-assisted drafting** — Anthropic Claude summarize / rewrite buttons in the editor
6. **OAuth login** (Google, GitHub) alongside email/password
7. **Multi-tenant publications** — each user can own a sub-publication
8. **Analytics dashboard** — view counts over time, top referrers, reading depth
9. **Docker Compose** + GitHub Actions CI
10. **Test coverage** — JUnit + MockMvc on backend, Vitest + React Testing Library on frontend

---

## Credits

- Built end-to-end as a learning project showcasing full-stack engineering, layered architecture, REST API design, JWT-secured Spring Security, and a hand-crafted React UI.
- Type system: [Fraunces](https://fonts.google.com/specimen/Fraunces) · [Inter](https://rsms.me/inter/) · [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- Design philosophy informed by [Emil Kowalski's animation work](https://emilkowal.ski/) and Paul Graham's notion that "unseen details compound."
- Icons: [Lucide](https://lucide.dev/)
- Placeholder imagery: [Picsum Photos](https://picsum.photos/) (seeded), [Pravatar](https://pravatar.cc/) (avatars)

---

<p align="center"><sub>MIT-licensed. Built with care.</sub></p>
