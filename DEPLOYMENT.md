# Deployment Guide

> **Important:** Kilo Blog has two halves that deploy to different places.
> - **Frontend (React)** → Vercel (or any static host).
> - **Backend (Spring Boot)** → Render / Railway / Fly.io (Vercel cannot run a long-lived JVM).
> - **Database (PostgreSQL)** → Render Managed Postgres / Supabase / Neon.

The full free-tier stack: **Vercel (frontend) + Render (backend + Postgres)**.

---

## Step 1 — Deploy the backend to Render (free tier)

### 1.1 Provision a Postgres instance

1. Sign in at [render.com](https://render.com).
2. **New +** → **PostgreSQL**.
3. Name: `kilo-blog-db`. Plan: **Free**. Region: same as backend.
4. After it provisions, copy the **Internal Database URL**. It looks like:
   ```
   postgres://kilo:somerandompassword@dpg-xxx.oregon-postgres.render.com/kiloblog
   ```

### 1.2 Deploy the backend as a Web Service

1. Push the repo to GitHub first (see Step 3 below).
2. **New +** → **Web Service** → connect your GitHub repo.
3. **Root directory:** `backend`
4. **Runtime:** Docker is easiest, but you can use the native Java environment.

**Option A — Native Java environment (simplest)**

- **Build command:** `mvn -DskipTests clean package`
- **Start command:** `java -jar target/kilo-blog-backend-0.1.0.jar`
- **Instance type:** Free

**Option B — Docker (recommended for control)**

Create `backend/Dockerfile`:

```dockerfile
# Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Set the **Build command** field to blank and **Dockerfile path** to `backend/Dockerfile`.

### 1.3 Environment variables

Set these in **Environment** → **Add Environment Variable** on your Render service:

| Key                            | Value                                                                  |
| ------------------------------ | ---------------------------------------------------------------------- |
| `SPRING_PROFILES_ACTIVE`       | `prod`                                                                 |
| `SPRING_DATASOURCE_URL`        | Paste the **Internal Database URL** but prefix with `jdbc:` so it becomes `jdbc:postgresql://...` |
| `SPRING_DATASOURCE_USERNAME`   | from the Postgres dashboard                                            |
| `SPRING_DATASOURCE_PASSWORD`   | from the Postgres dashboard                                            |
| `KILO_JWT_SECRET`              | A 64-character base64 string. Generate one: `openssl rand -base64 64`  |
| `KILO_CORS_ALLOWED_ORIGINS`    | `https://<your-vercel-app>.vercel.app`                                 |
| `JAVA_TOOL_OPTIONS`            | `-Xmx450m` (fits free tier RAM)                                        |

> **Tip:** The default `application.yml` reads `DB_USER`, `DB_PASSWORD`, `KILO_JWT_SECRET`,
> and `KILO_CORS_ALLOWED_ORIGINS` from the environment. The `SPRING_DATASOURCE_*` vars
> override those automatically via Spring Boot's relaxed binding.

### 1.4 First boot

Render deploys, runs the JAR, and Spring Boot starts in ~30–60 seconds on the free tier. Watch the logs for `Started KiloBlogApplication`. On first boot, `DataSeeder` populates the database with 4 users, 8 tags, and the full sample content (if `kilo.seed.enabled=true`, which is the default).

### 1.5 Health check

Visit `https://<your-backend>.onrender.com/api/posts?size=1` — you should get a JSON page of posts.

---

## Step 2 — Deploy the frontend to Vercel

### 2.1 Vercel project setup

The repo already contains `vercel.json` with the right build settings. Vercel detects it automatically.

1. Sign in at [vercel.com](https://vercel.com).
2. **Add New** → **Project** → import your GitHub repo.
3. Vercel reads `vercel.json` and shows:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - Leave the framework preset on **Other** (since it's a custom monorepo).
4. **Environment Variables:**
   - `VITE_API_URL` = `https://<your-backend>.onrender.com` (no trailing slash)
5. **Deploy.**

### 2.2 First deploy

Vercel builds in ~30 seconds. You'll get a `*.vercel.app` URL.

### 2.3 Connect CORS

Go back to Render's backend service → Environment → update `KILO_CORS_ALLOWED_ORIGINS` to your Vercel URL. Save — Render redeploys.

### 2.4 Custom domain (optional)

Vercel: **Settings** → **Domains** → add your domain. Update the DNS as instructed. Add the custom domain to `KILO_CORS_ALLOWED_ORIGINS` too.

---

## Step 3 — Push to GitHub

```bash
cd ~/KILO/kilo-blog
git init -b main
git add .
git commit -m "Initial commit: full-stack blog/CMS with publish workflow and moderation"

# Create the repo via gh CLI (already authenticated)
gh repo create kilo-blog --public \
  --source=. \
  --description="Editorial blog and CMS — Spring Boot 3.3 + React 18 + PostgreSQL with publish workflow, moderation, JWT auth, and an awwwards-grade UI" \
  --push
```

That single `gh repo create` command:
1. Creates `<your-username>/kilo-blog` on GitHub.
2. Pushes your local `main` branch.
3. Sets the upstream tracking branch.

---

## Step 4 — Wire CI (optional but recommended)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin', cache: maven }
      - name: Compile backend
        run: cd backend && mvn -B -DskipTests compile

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: npm, cache-dependency-path: frontend/package-lock.json }
      - name: Install
        run: cd frontend && npm ci
      - name: Typecheck
        run: cd frontend && npx tsc --noEmit -p tsconfig.json
      - name: Build
        run: cd frontend && npm run build
```

This runs on every push and PR. Green status badges look great on a GitHub README.

---

## Troubleshooting

### Backend fails to start with "Connection refused"
Postgres isn't ready yet, or the URL is wrong. Verify the `SPRING_DATASOURCE_URL` starts with `jdbc:postgresql://` (the `jdbc:` prefix is mandatory).

### CORS errors in the browser
The Vercel URL isn't in `KILO_CORS_ALLOWED_ORIGINS`. Update the env var on Render, save, wait for redeploy.

### Vercel build fails on `tsc`
Run `npx tsc --noEmit -p tsconfig.json` locally to surface the same error. Most failures are missing types after a refactor — pin them down before redeploying.

### "Cold start" — backend hangs on first request
Render's free tier spins down idle services. First request after ~15 min of idle takes 30–60s. Either upgrade to the Starter plan ($7/mo) or accept the cold start.

### Database wiped between deploys
You're not on a managed Postgres instance — you're hitting H2 in-memory. Verify the `SPRING_PROFILES_ACTIVE=prod` env var is set.

### JWT validation fails after deploy
The `KILO_JWT_SECRET` is too short. It needs to be a 64-character base64 string for HS512. Regenerate with `openssl rand -base64 64`.

---

## Cost recap (free tier)

| Service                  | Cost |
| ------------------------ | ---- |
| Vercel (frontend)        | $0   |
| Render Web Service       | $0 (free tier, sleeps after 15min idle) |
| Render Postgres          | $0 (free tier, 90-day rolling expiry — set a calendar reminder) |
| Domain                   | ~$10/yr if you want a custom one |

For a permanent portfolio, the Render Starter plan ($7/mo) keeps the backend always-on and the database persistent. Vercel stays free indefinitely.

---

## Alternative: Railway

Railway is a slightly slicker deploy experience and supports private networking between services without env var juggling.

1. New project → deploy from GitHub.
2. Pick the backend folder. Railway detects Maven and builds.
3. Add a PostgreSQL service.
4. Use the auto-generated `${{Postgres.DATABASE_URL}}` reference in your service's env vars.
5. Set the same env vars from Step 1.3 (with Railway's `${{...}}` references for the DB URL).
6. Deploy frontend to Vercel as before.

Railway's free tier is more generous on CPU but caps total runtime hours. For a portfolio, Render is more predictable.

---

## Alternative: Fly.io

Fly.io runs full Docker images with persistent volumes for ~$0/mo on the hobby plan.

```bash
brew install flyctl
fly auth login
cd backend
fly launch                     # picks up Dockerfile, asks about Postgres
fly secrets set KILO_JWT_SECRET="$(openssl rand -base64 64)"
fly deploy
```

Best operational experience of the three, slightly higher learning curve.

---

<sub>When you ship, paste the live URLs into the top of the main `README.md` so anyone reading the repo can click through to the running app.</sub>
