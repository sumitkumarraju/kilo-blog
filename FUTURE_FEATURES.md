# Future Features — Portfolio Roadmap

> Suggestions for evolving Kilo Blog into a flagship portfolio project. Ordered by
> **portfolio impact ÷ implementation effort**. Each item names the skill it demonstrates
> so you can pick the ones that match the role you're targeting.

---

## Tier 1 — High impact, low effort (do these first)

### 1. Full-text search with PostgreSQL `tsvector`
**Demonstrates:** Database design, query optimization, indexing strategy.

Replace the current `LIKE`-based search with a `tsvector` column on the `posts` table, populated via a generated column and indexed with `GIN`. Weight title higher than body. Add typo tolerance with `pg_trgm` similarity.

Roughly 1 day of work, but it shows you understand the difference between "works on demo data" and "scales to real volume."

### 2. Docker Compose + GitHub Actions CI
**Demonstrates:** DevOps fluency, reproducible builds.

Add a `docker-compose.yml` that brings up Postgres + the backend in one command. Add a `.github/workflows/ci.yml` that runs `mvn test` and `npm run typecheck` on every PR. Add a `Dockerfile` for the backend so it can deploy to any container host.

### 3. Test coverage on critical paths
**Demonstrates:** Quality discipline.

- Backend: JUnit + MockMvc for the publish workflow, the auth flow, and the moderation flow. Aim for 60%+ on services.
- Frontend: Vitest + React Testing Library for the editor save flow, the comment form, and the role guard.

### 4. Cloud image storage (Cloudinary or S3)
**Demonstrates:** External service integration, separation of concerns.

Replace the data URL embed with a real upload pipeline: signed POST URLs from the backend, direct browser-to-cloud uploads, return the CDN URL. Drop the column from TEXT back to VARCHAR(512). Add an `images` table to track uploaded assets.

### 5. Email notifications
**Demonstrates:** Async messaging, templated email, transactional patterns.

Use Spring's `JavaMailSender` (or Resend / Postmark for a modern API). Send:
- Welcome email on register
- "Your post was approved" on publish
- "Your post needs changes" on reject
- "Someone replied to your comment" on approved reply

Wrap sends in `@Async` so the HTTP request doesn't block.

---

## Tier 2 — Medium impact, medium effort

### 6. Real-time moderation updates via WebSockets
**Demonstrates:** Reactive systems, browser push.

When a new comment is submitted, push the pending count to all connected moderators. Use Spring's STOMP-over-WebSocket or server-sent events (SSE). On the frontend, integrate with the Zustand store so the moderation page badge updates without polling.

### 7. AI-assisted drafting (Anthropic Claude)
**Demonstrates:** API integration, modern AI features, product thinking.

Add three buttons to the editor:
- **Summarize for excerpt** — generate a 2-sentence excerpt from the article body
- **Rewrite this paragraph** — selected text passes through Claude with a tone preset
- **Suggest tags** — model picks from existing tags based on content

Use the Anthropic SDK on the backend. Stream tokens back via SSE. Add a per-user daily cap to avoid runaway bills.

### 8. OAuth login (Google + GitHub)
**Demonstrates:** OAuth2 / OIDC flows, identity provider integration.

Add Spring Security OAuth2 client config for Google and GitHub. Link OAuth identities to existing accounts by email. Add an "Account" page where users can connect/disconnect providers.

### 9. Multi-author publications
**Demonstrates:** Multi-tenancy patterns, hierarchical authorization.

Each user can create a `Publication` (think Substack/Medium). Each publication has its own subdomain, editors, color palette, and writers. Posts belong to a publication, not directly to the platform.

### 10. Analytics dashboard
**Demonstrates:** Data aggregation, time-series queries, charting.

Track:
- View counts over time (daily buckets)
- Top referrers (parse the `Referer` header)
- Reading depth (client-side scroll tracker → backend ping)
- Top posts in the last 7 / 30 / 90 days

Render with Recharts on the frontend. The data layer is the interesting part: pre-aggregate with a materialized view that refreshes hourly.

### 11. Newsletter delivery
**Demonstrates:** Scheduled jobs, list management, deliverability.

Subscribers table. Weekly digest of the latest published posts. Render with `mjml` on the backend or hand-rolled HTML email with table-based layout. Track opens via a pixel.

---

## Tier 3 — High effort, high payoff for specific roles

### 12. Live collaborative editing (Yjs + Tiptap)
**Demonstrates:** CRDTs, real-time collaboration, WebSocket scaling.

Two authors editing the same draft simultaneously, like Google Docs. Yjs handles the merge, Tiptap has first-class collaboration extensions, you provide a Spring Boot WebSocket server that fans out updates.

### 13. RBAC with custom permissions
**Demonstrates:** Authorization design at scale.

Replace the four-role enum with a permissions table. Editors can be scoped to specific tags. Authors can be invited to specific publications. Each operation checks against a permission set, not a role.

### 14. Search-as-you-type with Meilisearch / Typesense
**Demonstrates:** Specialized search infrastructure.

When the dataset grows past Postgres FTS comfort zone, drop in Meilisearch. Trigger sync on publish/update. Add faceted filters (tag + author + date range). Search latency drops to single-digit milliseconds.

### 15. Translation pipeline
**Demonstrates:** i18n, translation APIs, content fan-out.

When a post is published, kick off a translation job via DeepL or Claude. Each post has multiple `PostTranslation` rows. URL becomes `/{lang}/article/{slug}`. Reader picks language; default falls back to original.

### 16. Comments with rich text + reactions
**Demonstrates:** UI complexity, real-time UX.

Tiptap-powered comment composer with mentions (@author). Reactions like 👏/💯 (rendered as SVGs, not emojis). Live reaction counters via WebSocket. Edit history.

### 17. Mobile app with React Native
**Demonstrates:** Cross-platform development, code sharing.

Reuse the API, the type definitions, the auth store, and the design tokens. Native navigation. Push notifications via FCM/APNs. App Store submission as a portfolio talking point.

---

## Tier 4 — Polish and operational maturity

### 18. Structured logging + OpenTelemetry tracing
Spring's `micrometer-tracing` exports spans to Jaeger or Honeycomb. Logs as JSON via Logback's JSON encoder. Every log line carries a `traceId` you can pivot on.

### 19. Rate limiting + abuse prevention
Bucket4j in front of `/api/auth/*` and `/api/posts/{slug}/comments`. CAPTCHA on signup (hCaptcha). Comment-burst detection.

### 20. Performance budget + Lighthouse CI
GitHub Action runs Lighthouse on every PR. Fails the build if performance drops below 90. Bundle size guard via `size-limit`.

### 21. Accessibility audit
Pa11y in CI. Manual screen-reader pass. Keyboard nav video as part of the README.

### 22. SEO infrastructure
Server-side rendered article pages (move to Next.js, or add a small SSR layer). Open Graph cards generated from cover image + title via `@vercel/og`. JSON-LD article schema.

### 23. Sitemap + RSS feed
`GET /sitemap.xml` and `GET /rss.xml` driven by the published posts table. Trivial backend work, big SEO wins.

### 24. Dark/light mode preview in editor
Toggle in the editor sidebar that previews the post in both themes. Surfaces color contrast issues before publishing.

### 25. Comment subscription
Reader opts in to "notify me of replies to this comment." Sends email on approved reply.

---

## Picking what to add for your portfolio

For a **backend-focused interview**, prioritize:
- #1 (full-text search)
- #2 (Docker + CI)
- #3 (tests)
- #6 (WebSockets)
- #13 (RBAC) or #15 (translation pipeline)

For a **frontend-focused interview**, prioritize:
- #7 (AI-assisted drafting)
- #10 (analytics dashboard with charts)
- #12 (live collaboration)
- #16 (rich comments)
- #20 (Lighthouse CI)
- #21 (accessibility)

For a **full-stack interview**, prioritize:
- #2 (Docker + CI)
- #4 (cloud uploads)
- #5 (emails)
- #6 (WebSockets)
- #10 (analytics)
- #20 (perf) + #21 (a11y)

For a **design-engineering interview**, prioritize:
- #7 (AI in the editor)
- #10 (charts)
- #16 (rich comments + reactions)
- #20 + #21 (perf + a11y)
- A custom illustration system, a typographic refinement pass, a motion system documented in Storybook

---

<sub>Pick three. Ship them. Talk about the tradeoffs in interviews.</sub>
