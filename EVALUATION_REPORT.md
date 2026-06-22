# Kilo Blog — Evaluation Report

> A self-contained explainer suitable for course evaluations, technical interviews, and
> any audience that wants to understand what was built, why, and how it works.
> Written so a non-author can pick up the project and explain it on the spot.

---

## 1. Problem statement

Build a **blog and content management system** that lets:

- **Authors** draft, edit, and submit articles for review.
- **Editors / Admins** moderate posts and comments before they go public.
- **Readers** browse a public site, comment on articles (subject to moderation), and discover content via tags and search.

The system must enforce a clean **publish workflow** (draft → review → published) and a clean **comment moderation flow** (pending → approved). Both must be backed by role-based authorization.

---

## 2. Solution at a glance

A two-tier web application:

- **Frontend** — single-page React app served as static files. Talks to the backend over HTTP/JSON.
- **Backend** — stateless Spring Boot REST API. JWT-secured. PostgreSQL-backed.

Both halves are independently deployable. The backend exposes a documented OpenAPI surface; the frontend is one consumer of that surface and is fully replaceable.

---

## 3. Tech stack and why each piece was chosen

### Backend

| Choice                 | Reason                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **Java 21**            | LTS release, modern records and pattern matching, mature ecosystem.                     |
| **Spring Boot 3.3**    | De facto standard for production Java web apps; opinionated, batteries included.       |
| **Spring Web (MVC)**   | Mature HTTP server with familiar `@RestController` / `@RequestMapping` conventions.     |
| **Spring Data JPA**    | Removes boilerplate from data access; declarative repositories.                         |
| **Hibernate 6**        | Reliable ORM under JPA; handles entity lifecycles and relationships.                    |
| **Spring Security 6**  | Industry-standard auth framework with role hierarchy, password encoding, filters.       |
| **jjwt 0.12**          | Modern JWT library, focused API, well maintained.                                       |
| **PostgreSQL 16**      | Open source, ACID, supports advanced features (JSONB, full-text search, GIN indexes).  |
| **H2 (optional)**      | Zero-setup in-memory DB for instant demos. Switchable via Spring profile.               |
| **springdoc-openapi**  | Generates Swagger UI directly from controllers — free interactive docs.                 |
| **Lombok**             | Removes boilerplate (`@Getter/@Setter/@Builder`) without runtime cost.                  |
| **Maven**              | Dependency management; well-supported in Spring ecosystem.                              |

### Frontend

| Choice                      | Reason                                                                            |
| --------------------------- | --------------------------------------------------------------------------------- |
| **React 18**                | Industry-standard component model; rich ecosystem.                                |
| **TypeScript**              | Catches contract bugs at compile time; mirrors backend DTOs.                      |
| **Vite 5**                  | Sub-second cold start, native ESM dev server, fast HMR.                           |
| **Tailwind CSS**            | Utility-first; design tokens as first-class CSS variables for theme switching.    |
| **Framer Motion**           | Declarative animations, gestures, layout transitions.                             |
| **Tiptap**                  | Headless rich-text editor built on ProseMirror — semantic HTML output, extensible.|
| **React Router v6**         | Standard client-side routing.                                                     |
| **Zustand**                 | Tiny global state without Redux ceremony.                                         |
| **Axios**                   | Request/response interceptors are perfect for JWT and 401 handling.               |
| **Lucide React**            | Clean SVG icons (no emoji as icons — accessibility and consistency).              |
| **react-hot-toast**         | Lightweight, themeable toast notifications.                                       |

### Architecture patterns

- **Layered MVC** — separation between controllers, services, and repositories.
- **DTO pattern** — entities never leave the service boundary; requests and responses are explicit records.
- **Mapper pattern** — hand-written entity↔DTO converters for legibility (no MapStruct magic).
- **CMS workflow model** — post and comment lifecycles are explicit state machines.
- **Repository pattern** — Spring Data JPA abstractions over JDBC.
- **Stateless authentication** — JWT in headers, no server-side session storage.

---

## 4. Architecture diagram

```
                ┌────────────────────────────────────────┐
                │           USER'S BROWSER               │
                │                                        │
                │   React + Vite SPA                     │
                │   ─────────────────                    │
                │   • Pages (HomePage, ArticlePage, etc) │
                │   • Components (Editor, Comments)      │
                │   • Zustand stores (auth, theme)       │
                │   • Axios client with JWT interceptor  │
                └──────────────────┬─────────────────────┘
                                   │ HTTPS · JSON · Bearer JWT
                                   ▼
                ┌────────────────────────────────────────┐
                │     SPRING BOOT REST API (port 8080)   │
                │                                        │
                │  ┌──────────────────────────────────┐  │
                │  │  Security Filter Chain           │  │
                │  │  JwtAuthenticationFilter →       │  │
                │  │  SecurityContextHolder           │  │
                │  └──────────────────────────────────┘  │
                │              │                         │
                │              ▼                         │
                │  ┌──────────────────────────────────┐  │
                │  │  Controllers                     │  │
                │  │  AuthController · PostController │  │
                │  │  TagController · CommentController│ │
                │  │  ModerationController            │  │
                │  └──────────────────────────────────┘  │
                │              │                         │
                │              ▼                         │
                │  ┌──────────────────────────────────┐  │
                │  │  Services @PreAuthorize          │  │
                │  │  Business logic + state machines │  │
                │  └──────────────────────────────────┘  │
                │              │                         │
                │              ▼                         │
                │  ┌──────────────────────────────────┐  │
                │  │  Repositories (Spring Data JPA)  │  │
                │  └──────────────────────────────────┘  │
                │              │ Hibernate · JDBC        │
                └──────────────┼─────────────────────────┘
                               ▼
                ┌────────────────────────────────────────┐
                │           PostgreSQL 16                │
                │                                        │
                │   Tables: users · posts · tags ·       │
                │           comments · post_tags         │
                └────────────────────────────────────────┘
```

---

## 5. Data model

### Tables

**`users`** — authentication and identity.
- `id` (UUID, PK)
- `email` (unique)
- `password_hash` (BCrypt)
- `display_name`, `bio`, `avatar_url`
- `role` (`ADMIN`, `EDITOR`, `AUTHOR`, `READER`)
- `created_at`

**`posts`** — articles.
- `id` (UUID, PK)
- `slug` (unique)
- `title`, `excerpt`, `content` (TEXT)
- `cover_image_url` (TEXT — supports both URLs and data URLs for uploads)
- `reading_time_minutes`
- `status` (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `REJECTED`, `ARCHIVED`)
- `author_id` (FK → users)
- `view_count`, `rejection_reason`
- `created_at`, `updated_at`, `published_at`

**`tags`** — topic labels.
- `id` (UUID, PK), `slug` (unique), `name`, `description`, `color`

**`post_tags`** — many-to-many join (`post_id`, `tag_id`).

**`comments`** — threaded discussion.
- `id` (UUID, PK)
- `post_id` (FK → posts)
- `author_id` (FK → users, nullable for guest)
- `guest_name`, `guest_email` (for anonymous comments)
- `content`
- `status` (`PENDING`, `APPROVED`, `REJECTED`, `SPAM`)
- `parent_id` (self-ref FK → comments, for replies)
- `created_at`, `moderated_at`, `moderated_by`

### State machines

**Post lifecycle**

```
            (author)              (editor/admin)
DRAFT ────submit────▶ PENDING_REVIEW ────approve────▶ PUBLISHED ──archive──▶ ARCHIVED
                          │                                ▲
                          └─reject──▶ REJECTED ──submit────┘
                                                           │
                                            (editor/admin one-step)
                                          DRAFT ────publish────▶ PUBLISHED
```

**Comment lifecycle**

```
                  (editor/admin)
PENDING ────approve────▶ APPROVED
   │
   ├──reject──▶ REJECTED
   └──spam─────▶ SPAM
```

---

## 6. End-to-end request walkthrough — "open an article"

Use this for a verbal explanation in the evaluation:

1. **User clicks an article card.** The React Router navigates to `/article/the-quiet-craft-of-empty-states`. `ArticlePage` mounts.
2. **Frontend issues a fetch.** `useEffect` calls `api.posts.bySlug(slug)`.
3. **Axios attaches the JWT.** A request interceptor reads the token from `localStorage` and adds `Authorization: Bearer <jwt>`.
4. **The request crosses the network** as `GET /api/posts/the-quiet-craft-of-empty-states`.
5. **Spring Security intercepts.** `JwtAuthenticationFilter` parses the bearer token, validates the signature with the HS512 key, builds an `Authentication` object, and stores it in the `SecurityContextHolder`.
6. **The controller runs.** `PostController.getBySlug(slug)` calls `postService.getBySlug(slug)`.
7. **Service applies business rules.** It loads the entity via `postRepository.findBySlug(slug)`. If the post is `PUBLISHED`, the service increments the view count in a separate `@Modifying` JPQL query (so the read transaction stays clean).
8. **Hibernate generates SQL.**
   ```sql
   SELECT * FROM posts WHERE slug = ?;
   UPDATE posts SET view_count = view_count + 1 WHERE id = ?;
   ```
9. **PostgreSQL serves the row.** Hibernate hydrates the `Post` entity (with lazy associations on author and tags).
10. **DTO mapping.** `PostMapper.toResponse(post)` returns a `PostResponse` record — the entity stays in the service layer.
11. **JSON response** travels back to the browser.
12. **React renders.** The page shows the cover (with `useScroll` parallax), the article body via Tiptap's HTML output, a sidebar with the writer's bio, and the threaded comment section.

---

## 7. Authentication flow

### Login

```
Browser                          Backend
   │                                │
   │ POST /api/auth/login           │
   │ { email, password }            │
   │ ─────────────────────────────▶ │
   │                                │ AuthService.login(...)
   │                                │   - loadUserByEmail
   │                                │   - bcrypt.matches(rawPw, hash)
   │                                │   - JwtTokenProvider.generate(user)
   │                                │
   │ 200 { token, user }            │
   │ ◀───────────────────────────── │
   │                                │
   │ localStorage.setItem("kilo.token", token)
   │ Zustand store: { user, status: "authenticated" }
   │
   │ subsequent requests carry:     │
   │ Authorization: Bearer <token>  │
```

### Protected request

```
Browser                          Backend
   │ GET /api/posts/me/drafts       │
   │ Authorization: Bearer ...      │
   │ ─────────────────────────────▶ │
   │                                │ JwtAuthenticationFilter
   │                                │   - parse token
   │                                │   - validate signature & expiry
   │                                │   - build Authentication
   │                                │   - SecurityContextHolder.setAuthentication(auth)
   │                                │
   │                                │ Controller
   │                                │ → Service (@PreAuthorize if needed)
   │                                │ → Repository
   │                                │
   │ 200 { content: [...drafts] }   │
   │ ◀───────────────────────────── │
```

### 401 handling

Axios response interceptor detects 401 → clears the auth store → user is redirected to `/login`. No silent failures.

---

## 8. Authorization model

| Endpoint                                        | READER | AUTHOR | EDITOR | ADMIN |
| ----------------------------------------------- | :----: | :----: | :----: | :---: |
| Read published posts and approved comments      |   ✅   |   ✅   |   ✅   |   ✅  |
| Post a comment (lands in PENDING)               |   ✅   |   ✅   |   ✅   |   ✅  |
| Create / edit / delete OWN drafts               |   ❌   |   ✅   |   ✅   |   ✅  |
| Submit OWN post for review                      |   ❌   |   ✅   |   ✅   |   ✅  |
| Approve / reject / publish posts                |   ❌   |   ❌   |   ✅   |   ✅  |
| Moderate comments                               |   ❌   |   ❌   |   ✅   |   ✅  |
| Manage tags                                     |   ❌   |   ❌   |   ✅   |   ✅  |
| (Future) manage users and roles                 |   ❌   |   ❌   |   ❌   |   ✅  |

Enforcement is two-layered:

1. **Service-layer `@PreAuthorize`** — the source of truth. Even a malicious client cannot bypass this.
2. **Frontend `RequireRole` route guard** — UX layer that hides admin pages from non-admins.

---

## 9. Storage model — where blog data lives

### What gets stored

Every blog post is a row in the `posts` table. The `content` column is `TEXT` and holds the HTML produced by Tiptap. Tags are normalized into their own table and joined through `post_tags`. Comments are a separate table with a self-reference for threading.

### What happens when an author saves a draft

```
1. Editor page calls api.posts.create({ title, content, excerpt, coverImageUrl, tagSlugs })
2. Axios POSTs /api/posts with the JWT
3. JwtAuthenticationFilter sets the SecurityContext
4. PostController.create() reads the principal email from the context
5. PostService.create():
   - looks up the User entity by email
   - generates a unique slug via SlugService (slugify + uniqueness check)
   - computes reading time (words ÷ 200, rounded up)
   - resolves tagSlugs to Tag entities
   - builds a Post entity with status = DRAFT
   - saves via PostRepository.save()
6. Hibernate runs INSERT INTO posts ... and INSERT INTO post_tags ... in a single transaction
7. PostMapper.toResponse(saved) returns the DTO
8. The frontend updates its local state and shows "Saved 1s ago"
```

### What happens on update (autosave)

The editor debounces input by 1.2 seconds, then calls `PUT /api/posts/{slug}`. The service validates ownership (`author = current user` OR caller is `EDITOR+`), patches only provided fields, recomputes reading time if content changed, and saves.

### Where image uploads go

The cover image picker resizes images client-side to 1600px (long edge), encodes as JPEG/PNG, and embeds the result as a **data URL**. The data URL is stored in the `cover_image_url` TEXT column — no separate object store is required for the demo. (Future work upgrades this to Cloudinary / S3.)

---

## 10. How comment moderation works

```
1. Reader fills the comment form on /article/{slug}
2. Frontend POSTs /api/posts/{slug}/comments with { content, parentId? }
3. CommentService.create():
   - looks up the post by slug
   - identifies the author from the JWT (or stores guestName for anonymous)
   - persists the comment with status = PENDING
4. The comment does NOT appear on the public page
5. /api/posts/{slug}/comments only returns comments where status = APPROVED
6. The editor visits /moderation
7. Moderation page fetches:
   - /api/moderation/stats (counts)
   - /api/posts/moderation/queue (pending posts)
   - /api/comments/moderation/queue (pending comments)
8. Editor clicks Approve on a comment
9. Frontend PUTs /api/comments/{id}/moderate with { status: 'APPROVED' }
10. CommentService.moderate() sets status, moderated_at, moderated_by
11. The comment is now returned by /api/posts/{slug}/comments and appears publicly
```

---

## 11. Security highlights

- **Passwords** are stored as BCrypt hashes (work factor 10). The raw password never touches the database or the logs.
- **JWT** is signed with HS512 and a 64-character secret. Tokens carry only `sub` (email), `role`, and standard claims. Expiry is 24 hours.
- **CORS** is restricted to known origins (`http://localhost:5173`, `http://localhost:3000` in dev; configurable in prod).
- **Validation** on every request DTO with Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Size`).
- **Authorization** at the service layer with `@PreAuthorize` — defense in depth.
- **SQL injection** is impossible — every query is parameterized through JPA.
- **CSRF** is disabled because authentication is bearer-token based, not cookie based.
- **Stateless sessions** — `SessionCreationPolicy.STATELESS`. No server-side session storage means horizontal scaling is trivial.

---

## 12. Frontend quality bar

This is what separates a typical student project from a production-grade UI:

- **No emojis as icons.** Every icon is SVG via Lucide.
- **All clickable elements have `cursor-pointer`.**
- **Buttons feel pressed.** `whileTap={{ scale: 0.97 }}` on every interactive surface.
- **No layout shift on hover.** Hover effects are color-only.
- **No `scale(0)` entries.** Elements always start at `scale(0.95)` + `opacity: 0`.
- **Lists use `popLayout`.** Removing an item never causes the others to jump.
- **Reveals fire once.** Scroll past a section and animations don't replay.
- **`useReducedMotion` honored.** Users who have motion sickness see opacity fades only.
- **Dark mode uses warm near-black**, never pure black.
- **Type system is editorial.** Fraunces (serif, italic axis) for display, Inter for UI, JetBrains Mono for meta.
- **Loading states are skeletons**, not spinners, except for short async actions.
- **Cmd+K command palette** for power users.
- **`prefers-reduced-motion` media query** in CSS for animations not under Framer Motion.

---

## 13. Talking points for a 5-minute pitch

If you have **5 minutes** to demo:

1. **Open the home page.** Point out the editorial type, the warm palette, the magazine grid. Hover an article — note the color shift, not scale.
2. **Open an article.** Scroll — watch the cover parallax. Note the drop cap, the threaded comments below.
3. **Open Cmd+K.** Search "postgres" — watch instant results, navigate with the keyboard.
4. **Log in as admin.** Use the "Demo as Admin" shortcut.
5. **Open the editor.** Show Tiptap's bubble menu by selecting text. Upload an image from your machine — watch it resize and embed. Watch the autosave indicator change.
6. **Click "Publish now".** Watch the article appear on the home page immediately.
7. **Open the moderation page.** Show the animated stat tiles. Approve a pending comment — watch it fade out cleanly.
8. **Toggle dark mode.** Note the warm palette.

If you have **10 minutes**, add:

9. **Open Swagger UI** at `/swagger-ui.html`. Walk through `POST /api/posts` and `PUT /api/comments/{id}/moderate`.
10. **Open the H2 console** (or `psql`). Show the `posts` table, the `post_tags` join, the `comments` self-reference.
11. **Explain the authorization model** — `@PreAuthorize` at the service layer, `RequireRole` at the route level.

---

## 14. What I learned

- **Designing a state machine on paper before writing code saves days.** The post lifecycle survived three rounds of feature additions without refactoring because the states were defined first.
- **Layered architecture is worth the upfront ceremony.** When the frontend and backend were built by different contributors, mismatches were caught at the DTO boundary, not inside business logic.
- **Animation is part of the layout, not decoration.** Treating motion as a first-class design output produced a UI that feels alive without feeling busy.
- **Stateless JWT scales easily** but requires care with token revocation (we use short expiry rather than a denylist for the demo).
- **PostgreSQL is enough.** It handles relational data, full-text search, JSON, and even queue patterns. Most teams reach for additional infrastructure too early.

---

## 15. Known limitations and honest tradeoffs

- **Image uploads embed as data URLs.** Fine for a demo, not great at scale. Cloudinary or S3 would be the production answer.
- **Search is `LIKE`-based.** Works for hundreds of posts; would not scale past tens of thousands without `tsvector` + GIN.
- **No email integration.** Submitted/approved posts don't notify anyone via email yet.
- **No password reset flow.** Demo accounts only.
- **No test suite.** A real production push would add JUnit + MockMvc and Vitest + RTL.
- **No rate limiting.** Production would need Bucket4j or an API gateway.
- **JWT revocation is by expiry, not denylist.** Logging out clears the local token but the JWT itself remains technically valid until expiry.

These are intentional tradeoffs to keep the project scoped. Each is a candidate for the next phase.

---

<sub>Document prepared for technical evaluations. Pair with `README.md` for the developer-facing overview and `DEPLOYMENT.md` for the operations playbook.</sub>
