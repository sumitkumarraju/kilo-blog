# kilo-blog backend

Spring Boot 3.3 backend for the Kilo Blog/CMS. Java 21, Maven.

## Run

```bash
mvn spring-boot:run
```

Requires JDK 21 and Maven 3.9+ on `PATH`.

App starts on `http://localhost:8080`. H2 in-memory DB starts seeded.

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 console: `http://localhost:8080/h2-console` (jdbc url `jdbc:h2:mem:kiloblog`, user `sa`, no password)
- API docs JSON: `http://localhost:8080/v3/api-docs`

## Seeded accounts

| Role   | Email              | Password    |
| ------ | ------------------ | ----------- |
| ADMIN  | admin@kilo.blog    | Admin123!   |
| EDITOR | editor@kilo.blog   | Editor123!  |
| AUTHOR | sara@kilo.blog     | Author123!  |
| AUTHOR | ari@kilo.blog      | Author123!  |

Seeded content: 8 tags, 12 posts (8 published, 2 draft, 1 pending review, 1 archived), ~20 comments mixed pending/approved.

## API surface

All endpoints are prefixed with `/api`.

### Auth
- `POST /api/auth/register` — body: `{email,password,displayName}`
- `POST /api/auth/login` — body: `{email,password}` returns `{token,user}`
- `GET  /api/auth/me` — current user (Bearer token)

### Posts
- `GET    /api/posts?page=&size=&tag=&q=&sort=newest|oldest|popular` — public listing of published posts
- `POST   /api/posts` — create draft (auth)
- `GET    /api/posts/{slug}` — public if published, else author/editor only
- `PUT    /api/posts/{slug}` — update (author or editor+)
- `DELETE /api/posts/{slug}` — delete (author or editor+)
- `POST   /api/posts/{id}/submit` — move DRAFT|REJECTED to PENDING_REVIEW
- `POST   /api/posts/{id}/approve` — editor+
- `POST   /api/posts/{id}/reject` — editor+, body: `{status:..., reason:"..."}`
- `POST   /api/posts/{id}/archive` — author or editor+
- `GET    /api/posts/me/drafts` — current user's posts
- `GET    /api/posts/moderation/queue` — editor+

### Tags
- `GET  /api/tags`
- `GET  /api/tags/popular`
- `GET  /api/tags/{slug}`
- `POST /api/tags` — editor+

### Comments
- `GET  /api/posts/{slug}/comments` — approved comments only
- `POST /api/posts/{slug}/comments` — anyone (anon comments need `guestName`), saved as PENDING
- `GET  /api/comments/moderation/queue` — editor+
- `PUT  /api/comments/{id}/moderate` — editor+, body: `{status,reason}`

### Moderation
- `GET /api/moderation/stats` — editor+

## Auth

Pass the JWT in `Authorization: Bearer <token>`. Tokens are HS256, 24h expiry, secret configured in `application.yml` under `kilo.jwt.secret`.

## Profiles

- `default` (H2, create-drop, seeded) — `mvn spring-boot:run`
- `prod` (Postgres, jdbc:postgresql://localhost:5432/kiloblog) — `mvn spring-boot:run -Dspring-boot.run.profiles=prod`

## CORS

Allowed origins are configured at `kilo.cors.allowed-origins` (defaults to `http://localhost:5173,http://localhost:3000`).
