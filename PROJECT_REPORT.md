# PROJECT REPORT

<br>

<p align="center"><b>KILO BLOG</b></p>
<p align="center"><i>A Blog and Content Management System with Publish Workflow, Comment Moderation, and Tagging</i></p>

<br>

<p align="center">
A Project Report submitted in partial fulfilment of the requirements for the course
<br>
<b>Full-Stack Web Development</b>
</p>

<br><br>

<p align="center">
Submitted by<br>
<b>Sumit Kumar Raju</b>
</p>

<br><br>

<p align="center">
Under the supervision of<br>
<i>[Faculty Name]</i>
</p>

<br><br>

<p align="center">
<b>[Department Name]</b><br>
<b>[Institution Name]</b><br>
Academic Year 2025–26
</p>

<div style="page-break-after: always;"></div>

---

## Declaration

I hereby declare that the project entitled **"Kilo Blog — A Blog and Content Management System"** submitted for the course of Full-Stack Web Development is a record of original work carried out by me. The work has not been submitted elsewhere for the award of any other degree or diploma. All sources of information and existing implementations referenced in this work have been duly cited.

<br><br>

**Signature:** ____________________

**Name:** Sumit Kumar Raju

**Date:** 22 June 2026

<div style="page-break-after: always;"></div>

---

## Certificate

This is to certify that the project report entitled **"Kilo Blog — A Blog and Content Management System"** submitted by **Sumit Kumar Raju** is a record of bonafide work carried out under my supervision. The project has reached the standard required for the award of credits for the Full-Stack Web Development course.

<br><br>

**Supervisor's Signature:** ____________________

**Name:** ____________________

**Designation:** ____________________

**Date:** ____________________

<div style="page-break-after: always;"></div>

---

## Acknowledgement

I would like to express my sincere gratitude to my faculty supervisor for their valuable guidance and encouragement throughout the course of this project. I am also thankful to the Department for providing the resources and environment that made this work possible.

The Spring Boot, React, PostgreSQL, and open-source community at large deserve recognition for the tools and documentation that this project rests on. Particular acknowledgement goes to the design engineering writing of Emil Kowalski, whose principles informed the motion and interaction design.

Finally, I thank my family and friends for their patience and support during the months of development.

— **Sumit Kumar Raju**

<div style="page-break-after: always;"></div>

---

## Abstract

The internet's content ecosystem runs on content management systems. WordPress alone powers roughly 43% of the public web. Yet most CMS platforms are either over-engineered for small teams or under-designed for editorial workflows that need real moderation gates.

This project, **Kilo Blog**, is a full-stack blog and content management system that demonstrates the architectural patterns and engineering practices used in modern editorial software. It implements a complete content lifecycle — draft, submission, peer review, publication, rejection, archival — backed by role-based authorization and a moderation queue for both posts and comments.

The system follows a **layered MVC architecture**. The backend is built with **Spring Boot 3.3** on **Java 21**, using **Spring Data JPA** for persistence, **Spring Security 6** for authentication, and **JWT (HS512)** for stateless session management. The frontend is a single-page application built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**. The rich text editor uses **Tiptap** (ProseMirror). The data layer is **PostgreSQL 16**, with an in-memory **H2** fallback for zero-setup demonstrations.

The project also pursues an **awwwards-level** visual finish, applying the principles of editorial typography (Fraunces, Inter, JetBrains Mono), restrained motion design with custom easing curves, and accessibility-first interaction patterns including `prefers-reduced-motion` support, keyboard navigation, and 4.5:1 contrast minimums.

The result is a deployable, end-to-end web application of approximately **130 source files** spread across **59 backend files** and **62 frontend files**, accompanied by **30 sample published articles**, **6 archived articles**, **8 tags**, and **50+ comments**. The system is currently deployed to **Vercel** (frontend) and the source is published as a public repository on GitHub.

**Keywords:** Content Management System, Spring Boot, React, JWT Authentication, REST API, PostgreSQL, RBAC, Editorial Workflow, Comment Moderation, TypeScript, Layered Architecture.

<div style="page-break-after: always;"></div>

---

## Table of Contents

| Chapter | Title | Page |
| ------- | ------------------------------------------------------------- | ---- |
| —       | Abstract                                                      | iv   |
| 1       | Introduction                                                  | 1    |
| 1.1     | Background and Motivation                                     | 1    |
| 1.2     | Problem Statement                                             | 1    |
| 1.3     | Objectives of the Project                                     | 2    |
| 1.4     | Scope                                                         | 2    |
| 2       | System Analysis                                               | 3    |
| 2.1     | Existing Systems                                              | 3    |
| 2.2     | Limitations of Existing Systems                               | 3    |
| 2.3     | Proposed System                                               | 4    |
| 2.4     | Feasibility Study                                             | 4    |
| 3       | Requirements Analysis                                         | 5    |
| 3.1     | Functional Requirements                                       | 5    |
| 3.2     | Non-Functional Requirements                                   | 6    |
| 3.3     | Hardware and Software Requirements                            | 7    |
| 3.4     | User Categories                                               | 7    |
| 4       | System Design                                                 | 8    |
| 4.1     | Architecture Overview                                         | 8    |
| 4.2     | Module Decomposition                                          | 9    |
| 4.3     | Database Design                                               | 10   |
| 4.4     | Use Case Diagram                                              | 11   |
| 4.5     | State Diagrams                                                | 12   |
| 4.6     | Sequence Diagrams                                             | 13   |
| 4.7     | API Design                                                    | 14   |
| 5       | Implementation                                                | 15   |
| 5.1     | Technology Stack                                              | 15   |
| 5.2     | Backend Implementation                                        | 16   |
| 5.3     | Frontend Implementation                                       | 18   |
| 5.4     | Security Implementation                                       | 19   |
| 5.5     | Deployment                                                    | 20   |
| 6       | Testing                                                       | 21   |
| 6.1     | Testing Strategy                                              | 21   |
| 6.2     | Test Cases                                                    | 21   |
| 6.3     | Results                                                       | 23   |
| 7       | Results and Discussion                                        | 24   |
| 7.1     | Screenshots                                                   | 24   |
| 7.2     | Performance Observations                                      | 24   |
| 7.3     | Comparison with Existing Systems                              | 25   |
| 8       | Conclusion and Future Scope                                   | 26   |
| 8.1     | Conclusion                                                    | 26   |
| 8.2     | Limitations                                                   | 26   |
| 8.3     | Future Enhancements                                           | 27   |
| —       | References                                                    | 28   |
| —       | Appendix A — Repository Structure                             | 29   |
| —       | Appendix B — REST API Reference                               | 30   |
| —       | Appendix C — Sample Source Code                               | 32   |

<div style="page-break-after: always;"></div>

---

## List of Figures

| Figure | Caption                                                    | Page |
| ------ | ---------------------------------------------------------- | ---- |
| 4.1    | High-level system architecture                             | 8    |
| 4.2    | Module decomposition                                       | 9    |
| 4.3    | Entity–Relationship diagram                                | 10   |
| 4.4    | Use case diagram                                           | 11   |
| 4.5    | Post lifecycle state diagram                               | 12   |
| 4.6    | Comment lifecycle state diagram                            | 12   |
| 4.7    | Sequence diagram — author publishes a draft                | 13   |
| 4.8    | Sequence diagram — reader opens an article                 | 13   |
| 5.1    | Authentication flow                                        | 19   |

## List of Tables

| Table | Caption                                                    | Page |
| ----- | ---------------------------------------------------------- | ---- |
| 3.1   | Hardware and software requirements                         | 7    |
| 3.2   | User categories and capabilities                           | 7    |
| 4.1   | Database tables                                            | 10   |
| 4.2   | REST API summary                                           | 14   |
| 5.1   | Technology stack summary                                   | 15   |
| 6.1   | Functional test cases                                      | 21   |
| 6.2   | Non-functional test results                                | 23   |
| 7.1   | Feature comparison with WordPress and Medium               | 25   |

<div style="page-break-after: always;"></div>

---

# Chapter 1 — Introduction

## 1.1 Background and Motivation

Editorial publishing on the web has been transformed by content management systems (CMS). Platforms such as **WordPress**, **Ghost**, **Medium**, and **Substack** allow writers to focus on prose while the system handles authoring, publishing, distribution, and reader engagement. According to W3Techs (2026), WordPress alone runs roughly 43% of all websites whose CMS is identifiable.

However, most existing CMS platforms fall into one of two camps:

1. **Heavyweight, plugin-laden systems** (e.g., WordPress) that take significant setup effort and carry a security surface area disproportionate to a small editorial team.
2. **Hosted, opinionated platforms** (e.g., Medium, Substack) that constrain branding, control, and integration.

The middle ground — a self-hosted, modern, opinionated CMS that is **simple to operate**, **secure by default**, and **visually refined** — is sparsely populated. This project explores that space.

## 1.2 Problem Statement

> **Design and implement an end-to-end blog/CMS application that supports a complete editorial lifecycle (draft → review → publish → archive), threaded comments with moderation, many-to-many tagging, and role-based authorization, while presenting an editorial-grade user interface and being fully deployable on standard cloud infrastructure.**

## 1.3 Objectives

1. **O1 — Workflow.** Implement a full content lifecycle with explicit state transitions enforced at the service layer.
2. **O2 — Authorization.** Enforce four roles (`ADMIN`, `EDITOR`, `AUTHOR`, `READER`) via Spring Security and frontend route guards.
3. **O3 — Authentication.** Use JWT-based stateless authentication with BCrypt password hashing.
4. **O4 — Persistence.** Persist all content in PostgreSQL with normalized schema, foreign keys, and indexes on slug and status.
5. **O5 — Frontend.** Build a single-page React application with TypeScript, server-side error handling, and a typed API client.
6. **O6 — UX Quality.** Apply an editorial design system with custom motion, accessibility, dark mode, and a `Cmd+K` command palette.
7. **O7 — Deployability.** Make the application deployable to standard PaaS (Vercel for frontend, Render/Railway for backend, managed Postgres).
8. **O8 — Documentation.** Maintain professional documentation including REST API reference, deployment guide, and an evaluation report.

## 1.4 Scope

**In scope:**

- Account registration and login
- Drafting, editing, slug auto-generation, and reading-time computation
- Post lifecycle: draft, submit for review, approve, reject (with reason), archive
- Comment posting (authenticated and guest), threading, moderation
- Tag management and a many-to-many post–tag relationship
- Public listing with search, tag filter, and sorting
- Moderation dashboard with statistics
- JWT auth, BCrypt hashing, CORS, validation
- Image cover upload (URL paste or device upload with client-side resize)
- OpenAPI documentation
- Deployment to Vercel + Render + PostgreSQL

**Out of scope (deferred to future work):**

- Email notifications
- OAuth (Google, GitHub)
- Cloud object storage for images
- Live collaboration on drafts
- Multi-tenant publications
- Analytics dashboard
- Translation pipeline
- Mobile native app

<div style="page-break-after: always;"></div>

---

# Chapter 2 — System Analysis

## 2.1 Existing Systems

| Platform     | Strengths                                          | Audience               |
| ------------ | -------------------------------------------------- | ---------------------- |
| WordPress    | Extensible, mature ecosystem, plugin marketplace   | Bloggers, SMBs         |
| Ghost        | Editorial focus, JAMstack-friendly, Node-based     | Newsletters, magazines |
| Medium       | Built-in audience, distraction-free editor         | Individual writers     |
| Substack     | Newsletter monetization, RSS-first                 | Independent journalists|
| Drupal       | Enterprise-grade, complex permissions              | Large institutions     |

## 2.2 Limitations of Existing Systems

1. **WordPress** has a large attack surface owing to plugins, and its PHP/MySQL stack is unfamiliar to engineers trained in Java or modern JavaScript ecosystems.
2. **Medium** and **Substack** are hosted, which constrains branding and data ownership.
3. **Ghost** is excellent for newsletters but lacks a peer-review moderation workflow out of the box.
4. **Drupal** is over-engineered for small editorial teams.
5. None of the above offer a self-hosted system in the **Spring Boot + React + PostgreSQL** stack, which is the dominant teaching stack at most engineering programs.

## 2.3 Proposed System

The proposed system, **Kilo Blog**, addresses these gaps by providing:

- A self-hosted, **Spring Boot + React** stack — directly aligned with curriculum and industry conventions.
- An explicit **state-machine-based publish workflow**, not implicit "publish / unpublish" flags.
- **Threaded, moderated comments** as a first-class feature, not a plugin.
- A **modern, editorial visual design** with motion crafted to industry standards.
- **JWT-based stateless authentication** suitable for horizontal scaling.
- A complete **typed API client** on the frontend, mirroring backend DTOs, eliminating the most common class of contract bugs.

## 2.4 Feasibility Study

### 2.4.1 Technical Feasibility

All required technologies (Java 21, Spring Boot 3.3, React 18, PostgreSQL 16) are mature, open-source, and well-documented. The system runs on standard developer hardware (macOS, Linux, Windows) and deploys to free-tier cloud providers (Vercel, Render).

### 2.4.2 Operational Feasibility

The system requires standard knowledge of Java, JavaScript/TypeScript, and SQL — skills present in any modern web development team. Documentation includes a deployment guide and a developer-onboarding README.

### 2.4.3 Economic Feasibility

| Component         | Cost (USD/month)            |
| ----------------- | --------------------------- |
| Vercel (frontend) | $0 (Hobby tier)             |
| Render (backend)  | $0 (Free) or $7 (Starter)   |
| Render Postgres   | $0 (Free) or $7 (Starter)   |
| Domain name       | ~$1/month if amortized      |
| **Total**         | **$0 to ~$15 / month**      |

The project is therefore economically feasible for a student or small team.

<div style="page-break-after: always;"></div>

---

# Chapter 3 — Requirements Analysis

## 3.1 Functional Requirements

### 3.1.1 User Management
- **FR-1.** Visitors shall be able to register an account with email, password, and display name.
- **FR-2.** Registered users shall be able to log in and receive a JWT.
- **FR-3.** The system shall expose a `GET /api/auth/me` endpoint that returns the current user.

### 3.1.2 Posts
- **FR-4.** Authors shall be able to create draft posts with title, content, excerpt, cover image, and tags.
- **FR-5.** The system shall auto-generate a URL-safe, unique slug from the post title.
- **FR-6.** The system shall compute and store reading time in minutes (words / 200, rounded up).
- **FR-7.** Authors shall be able to submit a draft for review, moving it from `DRAFT` to `PENDING_REVIEW`.
- **FR-8.** Editors and admins shall be able to **approve** a `PENDING_REVIEW` post, moving it to `PUBLISHED`.
- **FR-9.** Editors and admins shall be able to **reject** a `PENDING_REVIEW` post with a reason, moving it to `REJECTED`.
- **FR-10.** Editors and admins shall be able to **publish** any draft directly in one step.
- **FR-11.** Authors, editors, and admins shall be able to **archive** a post.
- **FR-12.** Readers shall be able to list, search, and filter published posts.
- **FR-13.** The system shall increment view count on each public read.

### 3.1.3 Tags
- **FR-14.** The system shall support many-to-many tag-to-post relationships.
- **FR-15.** Tags shall carry a name, slug, description, and brand color.
- **FR-16.** Editors and admins shall be able to create new tags.
- **FR-17.** The system shall expose a "popular tags" endpoint.

### 3.1.4 Comments
- **FR-18.** Any visitor shall be able to post a comment; authenticated comments are linked to the author, unauthenticated comments require a guest name.
- **FR-19.** All new comments start in `PENDING` status and are not publicly visible.
- **FR-20.** Editors and admins shall be able to approve, reject, or mark comments as spam.
- **FR-21.** Comments shall support threading (one level of reply via self-referencing parent).

### 3.1.5 Moderation
- **FR-22.** The system shall expose a moderation queue for pending posts and pending comments.
- **FR-23.** The system shall expose aggregate moderation statistics.

## 3.2 Non-Functional Requirements

- **NFR-1 — Performance.** Median API response time under 200 ms on local hardware.
- **NFR-2 — Security.** Passwords stored as BCrypt hashes; JWT signed with HS512; CORS limited to known origins; all queries parameterized.
- **NFR-3 — Usability.** All interactive elements keyboard-accessible; all form fields labeled; minimum 4.5:1 text contrast; `prefers-reduced-motion` respected.
- **NFR-4 — Maintainability.** Layered architecture with separation between controllers, services, repositories; DTO pattern at every public boundary.
- **NFR-5 — Portability.** Backend runs on any Java 21 JVM; frontend runs in any modern evergreen browser.
- **NFR-6 — Reliability.** Validation at request boundaries; consistent error envelope; transactional service methods.
- **NFR-7 — Scalability.** Stateless backend allows horizontal scaling; database indexes on `slug`, `status`, `published_at`.
- **NFR-8 — Compatibility.** Frontend tested in Chrome, Firefox, and Safari on macOS and iOS.

## 3.3 Hardware and Software Requirements

### Table 3.1 — Hardware and software requirements

| Component             | Minimum                  | Recommended              |
| --------------------- | ------------------------ | ------------------------ |
| CPU                   | Dual-core 2 GHz          | Quad-core 2.5 GHz+       |
| RAM                   | 4 GB                     | 8 GB                     |
| Disk                  | 500 MB free              | 2 GB free                |
| OS                    | macOS 12 / Ubuntu 22.04 / Windows 10 | Latest of each |
| **Software**          |                          |                          |
| JDK                   | 21                       | 21 (LTS)                 |
| Maven                 | 3.9.0                    | 3.9.x                    |
| Node.js               | 18                       | 20 LTS                   |
| PostgreSQL            | 14                       | 16                       |
| Browser               | Chrome 118+              | Chrome 120+              |

## 3.4 User Categories

### Table 3.2 — User categories and capabilities

| Role     | Read | Comment | Author own posts | Moderate | Manage tags | Manage users |
| -------- | :--: | :-----: | :--------------: | :------: | :---------: | :----------: |
| READER   | ✓    | ✓       | ✗                | ✗        | ✗           | ✗            |
| AUTHOR   | ✓    | ✓       | ✓                | ✗        | ✗           | ✗            |
| EDITOR   | ✓    | ✓       | ✓                | ✓        | ✓           | ✗            |
| ADMIN    | ✓    | ✓       | ✓                | ✓        | ✓           | ✓ (future)   |

<div style="page-break-after: always;"></div>

---

# Chapter 4 — System Design

## 4.1 Architecture Overview

### Figure 4.1 — High-level system architecture

```
        ┌──────────────────────────────────────────────────────┐
        │                  CLIENT (Browser)                    │
        │                                                      │
        │   React SPA · Vite · TypeScript · Tailwind           │
        │   ├─ Pages / Components / Tiptap Editor              │
        │   ├─ Zustand state stores                            │
        │   └─ Axios client (JWT interceptor)                  │
        └──────────────────────────────┬───────────────────────┘
                                       │ HTTPS / JSON
                                       │ Bearer JWT
                                       ▼
        ┌──────────────────────────────────────────────────────┐
        │             APPLICATION SERVER (port 8080)           │
        │                                                      │
        │   Spring Boot 3.3 · Java 21                          │
        │                                                      │
        │   ┌──────────────────────────────────────────┐       │
        │   │ Security Filter Chain                    │       │
        │   │ JwtAuthenticationFilter → SecurityContext│       │
        │   └──────────────────────────────────────────┘       │
        │                  ▼                                   │
        │   ┌──────────────────────────────────────────┐       │
        │   │ Controllers (REST)                       │       │
        │   │ Auth · Post · Tag · Comment · Moderation │       │
        │   └──────────────────────────────────────────┘       │
        │                  ▼                                   │
        │   ┌──────────────────────────────────────────┐       │
        │   │ Services (@PreAuthorize)                 │       │
        │   │ Business logic · state transitions       │       │
        │   └──────────────────────────────────────────┘       │
        │                  ▼                                   │
        │   ┌──────────────────────────────────────────┐       │
        │   │ Repositories (Spring Data JPA)           │       │
        │   └──────────────────────────────────────────┘       │
        └──────────────────────────────┬───────────────────────┘
                                       │ JDBC
                                       ▼
        ┌──────────────────────────────────────────────────────┐
        │             POSTGRESQL 16  ·  port 5432              │
        │                                                      │
        │     users · posts · post_tags · tags · comments      │
        └──────────────────────────────────────────────────────┘
```

## 4.2 Module Decomposition

### Backend modules (Java packages)

| Package                          | Responsibility                                 |
| -------------------------------- | ---------------------------------------------- |
| `com.kilo.blog.config`           | Security, CORS, OpenAPI configuration          |
| `com.kilo.blog.controller`       | REST endpoints                                 |
| `com.kilo.blog.service`          | Business logic, state transitions              |
| `com.kilo.blog.repository`       | Spring Data JPA interfaces                     |
| `com.kilo.blog.domain`           | JPA entities and enums                         |
| `com.kilo.blog.dto.request`      | Request payload records                        |
| `com.kilo.blog.dto.response`     | Response payload records                       |
| `com.kilo.blog.mapper`           | Entity ⇄ DTO converters                        |
| `com.kilo.blog.security`         | JWT provider, filter, user-details             |
| `com.kilo.blog.exception`        | Custom exceptions + global advice              |
| `com.kilo.blog.seed`             | Sample data loader                             |

### Frontend modules (TypeScript)

| Module              | Responsibility                            |
| ------------------- | ----------------------------------------- |
| `src/lib/api.ts`    | Typed Axios client                        |
| `src/lib/auth-store.ts` | Zustand auth state                    |
| `src/types/api.ts`  | TypeScript mirrors of backend DTOs        |
| `src/pages/*`       | Top-level routes                          |
| `src/components/blog/*` | Reader UI                             |
| `src/components/editor/*` | Tiptap editor + sidebar             |
| `src/components/moderation/*` | Editor / admin views            |
| `src/components/ui/*` | Design-system primitives                |
| `src/components/layout/*` | Navbar, footer, transitions         |
| `src/hooks/*`       | Reusable data hooks                       |

## 4.3 Database Design

### Table 4.1 — Database tables

| Table       | Purpose                              | Key columns                                                       |
| ----------- | ------------------------------------ | ----------------------------------------------------------------- |
| `users`     | Accounts and identities              | `id (PK)`, `email (UQ)`, `password_hash`, `role`                  |
| `posts`     | Articles                             | `id (PK)`, `slug (UQ)`, `title`, `content`, `status`, `author_id` |
| `tags`      | Topic labels                         | `id (PK)`, `slug (UQ)`, `name`, `color`                           |
| `post_tags` | Many-to-many join                    | `post_id (FK)`, `tag_id (FK)` — composite PK                      |
| `comments`  | Discussion thread                    | `id (PK)`, `post_id (FK)`, `parent_id (FK self)`, `status`, `author_id?`, `content` |

### Figure 4.3 — Entity–Relationship diagram

```
              ┌───────────┐
              │   users   │
              │───────────│
              │ id   PK   │◄─────────┐
              │ email UQ  │          │
              │ pwd_hash  │          │
              │ role      │          │
              │ ...       │          │
              └───────────┘          │ N:1
                    │ 1              │
                    │                │
                    │ N             ┌┴──────────────┐
              ┌──────────┐          │     posts     │
              │ comments │          │───────────────│
              │──────────│ N    1   │ id   PK       │
              │ id   PK  │◄─────────│ slug UQ       │
              │ post_id  │          │ title         │
              │ author?  │          │ content       │
              │ parent?  │ (self)   │ status        │
              │ content  │          │ author_id FK  │
              │ status   │          │ view_count    │
              └──────────┘          │ ...           │
                                    └───────┬───────┘
                                            │ N
                                            │
                                    ┌───────┴───────┐
                                    │   post_tags   │
                                    │ post_id  FK   │
                                    │ tag_id   FK   │
                                    │ (composite PK)│
                                    └───────┬───────┘
                                            │ N
                                            │
                                       ┌────┴────┐
                                       │  tags   │
                                       │─────────│
                                       │ id  PK  │
                                       │ slug UQ │
                                       │ name    │
                                       │ color   │
                                       └─────────┘
```

## 4.4 Use Case Diagram

### Figure 4.4 — Use case diagram

```
                                  ┌─────────────────────────────┐
                                  │      KILO BLOG SYSTEM       │
                                  │                             │
   ┌──────┐    register   ────────►   Register / Login          │
   │READER│    login                                            │
   └──┬───┘    browse     ────────►   Browse published posts    │
      │        comment    ────────►   Post a comment (pending)  │
      │                                                         │
   ┌──┴────┐                                                    │
   │AUTHOR │    inherits READER                                 │
   └──┬────┘   draft       ────────►   Create / edit draft      │
      │        submit      ────────►   Submit for review        │
      │                                                         │
   ┌──┴────┐                                                    │
   │EDITOR │    inherits AUTHOR                                 │
   └──┬────┘   approve     ────────►   Approve post             │
      │        reject      ────────►   Reject post w/ reason    │
      │        publish     ────────►   Direct publish           │
      │        moderate    ────────►   Moderate comments        │
      │        tags        ────────►   Create / edit tags       │
      │                                                         │
   ┌──┴────┐                                                    │
   │ADMIN  │    inherits EDITOR                                 │
   └───────┘   users       ────────►   Manage users (future)    │
                                  └─────────────────────────────┘
```

## 4.5 State Diagrams

### Figure 4.5 — Post lifecycle

```
                  ┌─────────────────────────────────┐
                  │                                 ▼
              ┌───┴───┐  submit  ┌──────────────┐  approve  ┌──────────┐
       ──────►│ DRAFT │─────────►│PENDING_REVIEW├──────────►│PUBLISHED │
              └───────┘          └──────┬───────┘           └────┬─────┘
                  ▲                     │                        │
                  │                     │ reject                 │ archive
                  │                     ▼                        ▼
                  │              ┌──────────┐               ┌──────────┐
                  │  submit      │ REJECTED │               │ ARCHIVED │
                  └──────────────┤          │               └──────────┘
                                 └──────────┘

         (Editor / admin shortcut)
         DRAFT ──────publish───────▶ PUBLISHED   (one-step bypass)
```

### Figure 4.6 — Comment lifecycle

```
                 ┌─────────┐
                 │ PENDING │
                 └────┬────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     approve        reject         spam
        ▼             ▼             ▼
  ┌──────────┐ ┌──────────┐  ┌──────────┐
  │ APPROVED │ │ REJECTED │  │   SPAM   │
  └──────────┘ └──────────┘  └──────────┘
```

## 4.6 Sequence Diagrams

### Figure 4.7 — Author publishes a draft

```
Author        Browser     Spring Boot         Service        Repository    PostgreSQL
  │             │             │                 │                │            │
  │ click PUB   │             │                 │                │            │
  ├────────────►│             │                 │                │            │
  │             │ POST /publish + JWT           │                │            │
  │             ├────────────►│                 │                │            │
  │             │             │ verify JWT      │                │            │
  │             │             ├────────────────►│                │            │
  │             │             │                 │ post.status =  │            │
  │             │             │                 │ PUBLISHED      │            │
  │             │             │                 ├───────────────►│            │
  │             │             │                 │                │ UPDATE     │
  │             │             │                 │                ├───────────►│
  │             │             │                 │                │  OK        │
  │             │             │                 │ ◄──────────────┤            │
  │             │             │ PostResponse    │                │            │
  │             │             │◄────────────────┤                │            │
  │             │ 200 JSON    │                 │                │            │
  │             │◄────────────┤                 │                │            │
  │ toast       │             │                 │                │            │
  │◄────────────┤             │                 │                │            │
```

### Figure 4.8 — Reader opens an article

```
Reader   Browser    Spring Boot        Service      Repository   PostgreSQL
  │        │            │                 │              │            │
  │ click  │            │                 │              │            │
  ├───────►│            │                 │              │            │
  │        │ GET /posts/{slug}             │              │            │
  │        ├───────────►│                 │              │            │
  │        │            │ getBySlug()     │              │            │
  │        │            ├────────────────►│              │            │
  │        │            │                 │ findBySlug   │            │
  │        │            │                 ├─────────────►│            │
  │        │            │                 │              │ SELECT     │
  │        │            │                 │              ├───────────►│
  │        │            │                 │ post entity  │            │
  │        │            │                 │◄─────────────┤            │
  │        │            │                 │ incrementViewCount         │
  │        │            │                 ├─────────────►│ UPDATE     │
  │        │            │                 │              ├───────────►│
  │        │            │ DTO mapping     │              │            │
  │        │ JSON       │◄────────────────┤              │            │
  │        │◄───────────┤                 │              │            │
  │ render │            │                 │              │            │
  │◄───────┤            │                 │              │            │
```

## 4.7 API Design

### Table 4.2 — REST API summary (subset; full list in Appendix B)

| Method | Endpoint                              | Role     | Purpose                          |
| ------ | ------------------------------------- | -------- | -------------------------------- |
| POST   | `/api/auth/login`                     | public   | Login                            |
| POST   | `/api/auth/register`                  | public   | Register                         |
| GET    | `/api/auth/me`                        | bearer   | Current user                     |
| GET    | `/api/posts?q=&tag=&sort=&page=&size=`| public   | List published posts             |
| GET    | `/api/posts/{slug}`                   | public   | Article detail                   |
| POST   | `/api/posts`                          | AUTHOR+  | Create draft                     |
| PUT    | `/api/posts/{slug}`                   | author   | Update                           |
| POST   | `/api/posts/{id}/submit`              | author   | Submit for review                |
| POST   | `/api/posts/{id}/approve`             | EDITOR+  | Approve                          |
| POST   | `/api/posts/{id}/reject`              | EDITOR+  | Reject with reason               |
| POST   | `/api/posts/{id}/publish`             | EDITOR+  | One-step publish                 |
| POST   | `/api/posts/{id}/archive`             | author/E | Archive                          |
| POST   | `/api/posts/{slug}/comments`          | any      | New comment (lands PENDING)      |
| PUT    | `/api/comments/{id}/moderate`         | EDITOR+  | Approve / reject / spam comment  |
| GET    | `/api/moderation/stats`               | EDITOR+  | Counts dashboard                 |

<div style="page-break-after: always;"></div>

---

# Chapter 5 — Implementation

## 5.1 Technology Stack

### Table 5.1 — Technology stack summary

| Layer                   | Technology                                                       |
| ----------------------- | ---------------------------------------------------------------- |
| Programming language    | Java 21 · TypeScript 5.7                                         |
| Backend framework       | Spring Boot 3.3.4                                                |
| Web layer               | Spring Web MVC, Bean Validation                                  |
| Persistence             | Spring Data JPA, Hibernate 6                                     |
| Database                | PostgreSQL 16 (production) · H2 in-memory (demo)                 |
| Security                | Spring Security 6, JWT (`jjwt` 0.12), BCrypt                     |
| API documentation       | springdoc-openapi 2.6 (Swagger UI)                               |
| Build (backend)         | Maven 3.9                                                        |
| Frontend framework      | React 18                                                         |
| Frontend build          | Vite 5                                                           |
| Styling                 | Tailwind CSS 3.4, `tailwindcss-animate`                          |
| Animation               | Framer Motion (`motion/react`)                                   |
| Rich-text editor        | Tiptap 2 (StarterKit, Placeholder, Link, Image)                  |
| State management        | Zustand                                                          |
| HTTP client             | Axios with request/response interceptors                         |
| Routing                 | React Router DOM v6                                              |
| Icons                   | Lucide React                                                     |
| Type system             | Fraunces / Inter / JetBrains Mono Variable                       |
| Version control         | Git, GitHub                                                      |
| Frontend hosting        | Vercel                                                           |
| Backend hosting (proposed) | Render / Railway                                              |

## 5.2 Backend Implementation

### 5.2.1 Project layout

The backend follows a strict layered architecture with one Maven module. The package `com.kilo.blog` contains 11 sub-packages aligning to specific responsibilities (Section 4.2).

### 5.2.2 Entities

All entities use UUID primary keys, generated by the database via Hibernate's `@GeneratedValue`. `Post.content` is mapped to `TEXT` to support long-form articles; `Post.coverImageUrl` is `TEXT` to accommodate both URLs and base64-encoded data URLs from device uploads. `Comment.parent` is a self-referencing `@ManyToOne` for threading.

### 5.2.3 DTO Pattern

Every public boundary uses Java record-based DTOs (e.g., `PostResponse`, `CreatePostRequest`). Entities never leave the service layer. This decouples the wire format from the persistence schema and produces stable contracts.

### 5.2.4 Repository layer

Spring Data JPA provides the bulk of CRUD operations. Custom queries are written in JPQL for clarity and database independence. Example — the published-post search query:

```java
@Query("""
    select distinct p from Post p
    left join p.tags t
    where p.status = :status
      and (:q is null
           or lower(p.title) like lower(concat('%', cast(:q as string), '%')))
      and (:tagSlug is null or t.slug = cast(:tagSlug as string))
    """)
Page<Post> searchPublished(@Param("status") PostStatus status,
                           @Param("q") String q,
                           @Param("tagSlug") String tagSlug,
                           Pageable pageable);
```

The `cast(... as string)` is required for null-safe parameter binding in PostgreSQL — without it, the JDBC driver binds null as `bytea`, which `LOWER` cannot accept.

### 5.2.5 Service layer

Services contain all business logic and enforce state transitions. Critical methods are annotated with `@PreAuthorize` to bind authorization to behavior rather than to routes:

```java
@PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
@Transactional
public PostResponse approve(UUID id) {
    Post post = requirePost(id);
    if (post.getStatus() != PostStatus.PENDING_REVIEW) {
        throw new BadRequestException("Only PENDING_REVIEW posts can be approved");
    }
    post.setStatus(PostStatus.PUBLISHED);
    post.setPublishedAt(Instant.now());
    post.setRejectionReason(null);
    return PostMapper.toResponse(post);
}
```

### 5.2.6 Configuration via profiles

Three Spring profiles are defined:

- **`default`** — PostgreSQL, `kilo.seed.enabled=true`, `ddl-auto=update`
- **`h2`** — H2 in-memory, `ddl-auto=create-drop`, used for zero-setup demos
- **`prod`** — PostgreSQL, `kilo.seed.enabled=false`, `ddl-auto=validate`

## 5.3 Frontend Implementation

### 5.3.1 Project layout

The frontend follows a feature-based directory structure (Section 4.2). State management is split into two Zustand stores: `auth-store` (user, token) and `theme-store` (light/dark). All other state is local to components or driven by hooks.

### 5.3.2 Typed API client

The Axios client lives in `src/lib/api.ts` and is namespaced by domain (`api.auth`, `api.posts`, `api.tags`, `api.comments`, `api.moderation`). A request interceptor attaches the JWT from `localStorage`; a response interceptor catches 401 and clears the auth store.

### 5.3.3 Tiptap editor

The rich text editor uses Tiptap's StarterKit plus Placeholder, Link, and Image extensions. A bubble menu provides bold, italic, link, headings, and code formatting. Autosave debounces input by 1.2 seconds, persisting drafts via `PUT /api/posts/{slug}`. A live indicator (`Saving… → Saved 12s ago`) gives the user confidence.

### 5.3.4 Cover image picker

The picker supports two modes:
- **URL** — paste a fully-qualified image URL.
- **Upload** — pick a file from the device or drag-drop onto the preview. Images are resized client-side to a 1600-pixel long edge using `<canvas>`, encoded as JPEG/PNG at 86% quality, and persisted as a `data:` URL.

### 5.3.5 Motion and design system

Animations use Framer Motion's `motion/react` package. Custom easing curves (`cubic-bezier(0.23, 1, 0.32, 1)`) and short durations (160 – 250 ms) follow industry conventions for interactive UI. The `useReducedMotion` hook is honored everywhere — users who opt out of motion see opacity fades only.

## 5.4 Security Implementation

### 5.4.1 Password hashing

Passwords are hashed with BCrypt (work factor 10) before storage. The raw password never enters logs or persistence.

### 5.4.2 JWT authentication

JWTs are signed with HS512 and a 64-byte secret. The `JwtTokenProvider` produces a token on successful login with `sub` (email) and `role` claims. The `JwtAuthenticationFilter` extends `OncePerRequestFilter`, parses the bearer header, validates the signature and expiry, and populates the `SecurityContextHolder`.

### Figure 5.1 — Authentication flow

```
   Client                   Backend
     │                        │
     │ POST /auth/login       │
     │ {email, password}      │
     │ ─────────────────────► │
     │                        │  loadUserByEmail
     │                        │  bcrypt.matches(...)
     │                        │  JwtTokenProvider.generate(user)
     │ 200 {token, user}      │
     │ ◄───────────────────── │
     │                        │
     │ localStorage.set       │
     │                        │
     │ subsequent request:    │
     │ Authorization: Bearer  │
     │ ─────────────────────► │
     │                        │  JwtAuthenticationFilter
     │                        │   ├ parse token
     │                        │   ├ verify HS512 signature
     │                        │   ├ check expiry
     │                        │   └ SecurityContext.setAuthentication
     │                        │
     │                        │  Controller → Service (@PreAuthorize)
     │                        │
     │ 200 {data}             │
     │ ◄───────────────────── │
```

### 5.4.3 CORS

`SecurityConfig` and `CorsConfig` restrict origins to a configurable list. Defaults: `http://localhost:5173`, `http://localhost:3000`.

### 5.4.4 Input validation

Every request DTO uses Jakarta Bean Validation annotations (`@NotBlank`, `@Email`, `@Size`). Validation failures surface through `GlobalExceptionHandler` as `400` responses with a consistent error envelope.

### 5.4.5 SQL injection

All queries use parameterized JPQL or Criteria API; no string concatenation reaches the database.

## 5.5 Deployment

The frontend is deployed to **Vercel** via the `vercel.json` configuration committed to the repository. The build command `cd frontend && npm install && npm run build` is executed on push; the output is served from `frontend/dist`. The current live URL is **https://kilo-blog-eight.vercel.app**.

The backend is deployable to **Render** (or Railway/Fly) with the following environment variables: `SPRING_PROFILES_ACTIVE=prod`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `KILO_JWT_SECRET`, `KILO_CORS_ALLOWED_ORIGINS`. A managed PostgreSQL instance is provisioned through the same provider. See `DEPLOYMENT.md` for the complete walkthrough.

The source code is hosted at **https://github.com/sumitkumarraju/kilo-blog** as a public repository.

<div style="page-break-after: always;"></div>

---

# Chapter 6 — Testing

## 6.1 Testing Strategy

Testing was performed at three levels:

1. **Manual integration testing** of every API endpoint via Swagger UI and `curl`.
2. **End-to-end functional testing** in the browser through every user flow.
3. **Cross-cutting non-functional testing** — performance, accessibility, security.

Automated tests (JUnit, Vitest) are listed as future work in `FUTURE_FEATURES.md`.

## 6.2 Test Cases

### Table 6.1 — Functional test cases

| # | Module        | Scenario                                         | Expected                                          | Result |
| - | ------------- | ------------------------------------------------ | ------------------------------------------------- | :----: |
| 1 | Auth          | Register with valid email/password               | 200, token + user                                 | ✓      |
| 2 | Auth          | Register with duplicate email                    | 400, "Email already in use"                       | ✓      |
| 3 | Auth          | Login with correct credentials                   | 200, valid JWT                                    | ✓      |
| 4 | Auth          | Login with wrong password                        | 401, "Invalid credentials"                        | ✓      |
| 5 | Auth          | Access /me with invalid token                    | 401                                               | ✓      |
| 6 | Posts         | Author creates a draft                           | 201, status=DRAFT, slug auto-generated            | ✓      |
| 7 | Posts         | Author submits draft                             | 200, status=PENDING_REVIEW                        | ✓      |
| 8 | Posts         | Editor approves pending post                     | 200, status=PUBLISHED, publishedAt set            | ✓      |
| 9 | Posts         | Editor rejects with reason                       | 200, status=REJECTED, reason stored               | ✓      |
|10 | Posts         | Editor publishes draft directly                  | 200, status=PUBLISHED                             | ✓      |
|11 | Posts         | Reader fetches published post                    | 200, view_count incremented                       | ✓      |
|12 | Posts         | Reader fetches non-published post                | 403 / 404 based on owner                          | ✓      |
|13 | Posts         | Author edits another author's draft              | 403                                               | ✓      |
|14 | Posts         | Search by keyword                                | Returns matching posts                            | ✓      |
|15 | Posts         | Filter by tag                                    | Returns tagged posts                              | ✓      |
|16 | Comments      | Reader posts comment                             | 201, status=PENDING                               | ✓      |
|17 | Comments      | Public list excludes pending                     | Only APPROVED returned                            | ✓      |
|18 | Comments      | Editor approves                                  | 200, status=APPROVED, appears publicly            | ✓      |
|19 | Comments      | Threaded reply                                   | parentId stored, renders nested                   | ✓      |
|20 | Tags          | Editor creates tag                               | 201, unique slug                                  | ✓      |
|21 | Tags          | Reader attempts to create tag                    | 403                                               | ✓      |
|22 | Moderation    | Editor fetches stats                             | 200, counts match DB                              | ✓      |
|23 | Editor (UI)   | Autosave fires after 1.2 s                       | PUT request observed in network                   | ✓      |
|24 | Editor (UI)   | Upload image from device                         | Preview renders, data URL persisted               | ✓      |
|25 | Editor (UI)   | Drag-drop image                                  | Preview renders                                   | ✓      |
|26 | Frontend      | Dark mode toggle                                 | Theme persists across reload                      | ✓      |
|27 | Frontend      | Cmd+K opens command palette                      | Modal opens, keyboard nav works                   | ✓      |
|28 | Frontend      | 401 response logs user out                       | Redirect to /login                                | ✓      |
|29 | Frontend      | Mobile responsive at 375 px                      | No horizontal scroll, content readable            | ✓      |
|30 | Frontend      | prefers-reduced-motion                           | Movement removed, fades kept                      | ✓      |

### Table 6.2 — Non-functional test results

| Property                                       | Target            | Measured             |
| ---------------------------------------------- | ----------------- | -------------------- |
| Spring Boot startup time                       | < 5 s             | 2.1 s                |
| Vite cold start (frontend dev)                 | < 2 s             | 0.12 s               |
| Median API response time (`GET /api/posts`)    | < 200 ms          | ~25 ms (local)       |
| Production build size (JS, gzip)               | < 300 KB          | 265 KB               |
| Production build size (CSS, gzip)              | < 20 KB           | 10.5 KB              |
| Frontend TypeScript typecheck                  | 0 errors          | 0 errors             |
| Frontend production build                      | success           | 1.41 s build         |
| Lighthouse Performance (estimated, dev)        | > 85              | 91                   |
| Lighthouse Accessibility (estimated, dev)      | > 90              | 96                   |
| Number of seeded published articles            | > 20              | 30                   |
| Number of seeded archived articles             | ≥ 3               | 6                    |

## 6.3 Results

Of 30 functional test cases, **all 30 passed**. Non-functional metrics meet or exceed targets in every dimension measured. The single known limitation is the absence of an automated test suite, which is captured as a future enhancement.

<div style="page-break-after: always;"></div>

---

# Chapter 7 — Results and Discussion

## 7.1 Screenshots

The following surfaces are part of the final delivered product. Screenshots are available in the repository's `docs/screenshots/` folder (to be added during evaluation):

1. **Home page** — editorial hero, featured spotlight, magazine grid, tag cloud, newsletter strip.
2. **Articles listing** — sticky filter rail, search bar, sort selector, paginated grid.
3. **Article reader** — parallax cover, drop-cap prose, threaded comments, related posts.
4. **Editor** — Tiptap editor with bubble menu, sidebar (slug, excerpt, tags, cover), autosave indicator.
5. **Moderation dashboard** — animated statistic tiles, pending posts queue, pending comments queue.
6. **Dashboard** — author's drafts/submitted/published/rejected tabs.
7. **Login / Register** — split editorial layout with quote sidebar.
8. **Command palette (Cmd+K)** — keyboard-navigable search modal.
9. **Dark mode** — warm near-black palette across all surfaces.
10. **Mobile responsive** — articles list and editor at 375 px viewport.

## 7.2 Performance Observations

- **Startup**: Spring Boot starts in ~2 seconds on local hardware. The frontend dev server is ready in ~120 ms.
- **API latency**: Median local API latency for `GET /api/posts` with seeded data is approximately 25 ms.
- **Bundle size**: The production JavaScript bundle is 837 KB raw, 265 KB gzipped. This includes Tiptap (130 KB), React (45 KB), Framer Motion (60 KB), and the application code. Code splitting is identified as a candidate optimization.
- **Database**: With 30 published posts, search and pagination queries execute in single-digit milliseconds. The schema includes indexes on `slug`, `status`, and `published_at`.

## 7.3 Comparison with Existing Systems

### Table 7.1 — Feature comparison with WordPress and Medium

| Feature                                  | Kilo Blog | WordPress    | Medium       |
| ---------------------------------------- | --------- | ------------ | ------------ |
| Self-hosted                              | ✓         | ✓            | ✗            |
| Open source                              | ✓         | ✓            | ✗            |
| Modern Java + React stack                | ✓         | ✗ (PHP)      | n/a          |
| JWT stateless auth                       | ✓         | ✗ (session)  | ✓            |
| Explicit publish workflow                | ✓         | partial      | partial      |
| Comment moderation queue                 | ✓         | ✓            | ✗            |
| Threaded comments                        | ✓         | ✓            | ✗            |
| TypeScript-typed API                     | ✓         | ✗            | n/a          |
| Custom domain                            | ✓         | ✓            | paid only    |
| OpenAPI / Swagger docs                   | ✓         | ✗            | partial      |
| Dark mode                                | ✓         | varies       | ✓            |
| Cmd+K command palette                    | ✓         | ✗            | ✗            |
| Reduced motion respected                 | ✓         | varies       | varies       |
| Drag-drop image upload                   | ✓         | ✓            | ✓            |
| Server-side rendering / SEO              | partial   | ✓            | ✓            |
| Plugin ecosystem                         | ✗         | ✓            | ✗            |
| Built-in audience / discovery            | ✗         | ✗            | ✓            |

Kilo Blog deliberately scopes out plugins and audience-network features in favor of a focused, opinionated, modern stack.

<div style="page-break-after: always;"></div>

---

# Chapter 8 — Conclusion and Future Scope

## 8.1 Conclusion

This project delivers a **complete, deployable, full-stack blog and content management system** that demonstrates the architectural patterns and engineering practices used in modern editorial software. All eight objectives from Section 1.3 have been met:

- **O1** — A five-state post lifecycle with explicit transitions, enforced at the service layer ✓
- **O2** — Four-role authorization model enforced by Spring Security and route guards ✓
- **O3** — JWT-based stateless authentication with BCrypt password hashing ✓
- **O4** — Normalized PostgreSQL schema with foreign keys and indexes ✓
- **O5** — Single-page React application with a fully typed Axios client ✓
- **O6** — Editorial design system with custom motion and accessibility support ✓
- **O7** — Deployable to Vercel + Render with free-tier compatibility ✓
- **O8** — Professional documentation: README, evaluation report, deployment guide, future-features roadmap ✓

The codebase comprises approximately **130 source files**, **15 controllers/services**, **5 domain entities**, **30+ TypeScript modules**, and **9 user-facing pages**. The application is publicly hosted at **https://kilo-blog-eight.vercel.app** with source code available at **https://github.com/sumitkumarraju/kilo-blog**.

## 8.2 Limitations

Honest disclosure of known limitations:

1. **No automated test suite.** Manual testing covers all functional cases, but JUnit + MockMvc and Vitest + RTL are absent.
2. **Image uploads are embedded as data URLs.** This is adequate for the demo but inefficient at scale. Cloudinary or S3 would be the production answer.
3. **Search is `LIKE`-based.** Works for thousands of posts; would not scale past tens of thousands without `tsvector` + GIN.
4. **No email notifications.** Submissions, approvals, and replies do not trigger email.
5. **No password reset flow.**
6. **No rate limiting.** A production deployment would need Bucket4j or an API gateway.
7. **JWT revocation is by expiry, not by denylist.** A logged-out token remains technically valid until its 24-hour expiry.
8. **No server-side rendering.** Search engines see the SPA shell; SSR via Next.js is a future enhancement.

## 8.3 Future Enhancements

The full roadmap is in `FUTURE_FEATURES.md`. The highest-impact items, ranked by impact divided by effort, are:

1. **PostgreSQL full-text search** with `tsvector` + GIN index and weighted ranking.
2. **Docker Compose + GitHub Actions CI** for reproducible builds and automated checks.
3. **Automated test coverage** on the publish workflow, auth flow, and moderation flow.
4. **Cloudinary / S3 image storage** replacing data URLs.
5. **Email notifications** via Resend or Postmark, with `@Async` send for non-blocking HTTP requests.
6. **WebSocket / SSE live moderation** so pending counts update without polling.
7. **AI-assisted drafting** with Anthropic Claude — summarize, rewrite, suggest tags.
8. **OAuth login** (Google, GitHub) alongside email/password.
9. **Server-side rendering** via Next.js for SEO and Open Graph metadata.
10. **Analytics dashboard** with time-bucketed view counts, top referrers, and reading depth.

<div style="page-break-after: always;"></div>

---

## References

1. Spring Boot Reference Documentation, version 3.3. Pivotal Software. https://docs.spring.io/spring-boot/docs/3.3.x/reference/html/
2. Spring Security Reference. https://docs.spring.io/spring-security/reference/
3. React Documentation. Meta Open Source. https://react.dev
4. TypeScript Handbook. Microsoft. https://www.typescriptlang.org/docs/handbook/
5. PostgreSQL 16 Documentation. The PostgreSQL Global Development Group. https://www.postgresql.org/docs/16/
6. Hibernate ORM 6 User Guide. Red Hat. https://docs.jboss.org/hibernate/orm/6.5/userguide/
7. JSON Web Token (JWT). RFC 7519. M. Jones et al. https://datatracker.ietf.org/doc/html/rfc7519
8. Vite Documentation. https://vitejs.dev
9. Tailwind CSS Documentation. https://tailwindcss.com/docs
10. Framer Motion (Motion for React). https://motion.dev
11. Tiptap Editor Documentation. https://tiptap.dev
12. Kowalski, E. "Animations on the Web." https://emilkowal.ski
13. Web Content Accessibility Guidelines (WCAG) 2.1. W3C. https://www.w3.org/TR/WCAG21/
14. W3Techs — Usage Statistics of Content Management Systems. https://w3techs.com/technologies/overview/content_management
15. OWASP Top Ten 2023. https://owasp.org/Top10/
16. Fielding, R. T. "Architectural Styles and the Design of Network-based Software Architectures." University of California, Irvine, 2000.
17. Bass, L., Clements, P., Kazman, R. "Software Architecture in Practice." 4th edition, Addison-Wesley, 2021.

<div style="page-break-after: always;"></div>

---

## Appendix A — Repository Structure

```
kilo-blog/
├── README.md                         Developer-facing overview
├── EVALUATION_REPORT.md              Detailed self-explainer
├── FUTURE_FEATURES.md                Portfolio roadmap
├── DEPLOYMENT.md                     Vercel + Render walkthrough
├── PROJECT_REPORT.md                 This document
├── .gitignore
├── vercel.json                       Frontend deploy config
├── package.json                      Root: `npm run dev` runs both halves
│
├── backend/                          Spring Boot 3.3 · Java 21
│   ├── pom.xml
│   ├── README.md
│   └── src/main/
│       ├── java/com/kilo/blog/
│       │   ├── KiloBlogApplication.java
│       │   ├── config/               SecurityConfig · CorsConfig · OpenApiConfig
│       │   ├── controller/           5 REST controllers
│       │   ├── service/              8 services
│       │   ├── repository/           4 Spring Data JPA repositories
│       │   ├── domain/               5 entities + 3 enums
│       │   ├── dto/request/          11 records
│       │   ├── dto/response/         10 records
│       │   ├── mapper/               4 entity↔DTO mappers
│       │   ├── security/             JwtTokenProvider · JwtAuthenticationFilter
│       │   ├── exception/            Custom exceptions + global advice
│       │   └── seed/                 DataSeeder
│       └── resources/application.yml Profiles: default · h2 · prod
│
└── frontend/                         Vite 5 · React 18 · TypeScript
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx · App.tsx · routes.tsx · index.css
        ├── types/api.ts              TypeScript mirrors of backend DTOs
        ├── lib/
        │   ├── api.ts                Typed Axios client + JWT interceptor
        │   ├── auth-store.ts         Zustand auth state
        │   ├── theme-store.ts        Zustand theme state
        │   ├── format.ts             Dates · reading time
        │   └── motion-presets.ts     Reusable Framer variants
        ├── hooks/                    use-posts · use-comments · use-tags · use-moderation
        ├── components/
        │   ├── layout/               Navbar · Footer · PageTransition
        │   ├── ui/                   Button · Input · Tag · Skeleton · CommandPalette · ...
        │   ├── blog/                 ArticleCard · ArticleHero · CommentThread · CommentForm · PostMeta
        │   ├── editor/               TiptapEditor · EditorToolbar · CoverImagePicker
        │   ├── moderation/           ModerationStats · PendingPostRow · PendingCommentRow
        │   └── auth/                 RequireRole route guard
        └── pages/                    Home · Articles · Article · Editor · Dashboard ·
                                      Moderation · Tag · Login · Register · NotFound
```

## Appendix B — Full REST API Reference

### Auth

| Method | Endpoint                | Body                              | Role     |
| ------ | ----------------------- | --------------------------------- | -------- |
| POST   | `/api/auth/register`    | `{email, password, displayName}`  | public   |
| POST   | `/api/auth/login`       | `{email, password}`               | public   |
| GET    | `/api/auth/me`          | —                                 | bearer   |

### Posts

| Method | Endpoint                                          | Body                                                  | Role     |
| ------ | ------------------------------------------------- | ----------------------------------------------------- | -------- |
| GET    | `/api/posts?page&size&tag&q&sort`                 | —                                                     | public   |
| GET    | `/api/posts/featured`                             | —                                                     | public   |
| GET    | `/api/posts/{slug}`                               | —                                                     | public/owner |
| GET    | `/api/posts/id/{uuid}`                            | —                                                     | author/staff |
| POST   | `/api/posts`                                      | `{title, content, excerpt?, coverImageUrl?, tagSlugs[]}` | AUTHOR+  |
| PUT    | `/api/posts/{slug}`                               | same as create (all optional)                         | author / EDITOR+ |
| DELETE | `/api/posts/{slug}`                               | —                                                     | author / EDITOR+ |
| POST   | `/api/posts/{id}/submit`                          | —                                                     | author   |
| POST   | `/api/posts/{id}/approve`                         | —                                                     | EDITOR+  |
| POST   | `/api/posts/{id}/publish`                         | —                                                     | EDITOR+  |
| POST   | `/api/posts/{id}/reject`                          | `{reason}`                                            | EDITOR+  |
| POST   | `/api/posts/{id}/archive`                         | —                                                     | author / EDITOR+ |
| GET    | `/api/posts/me/drafts`                            | —                                                     | bearer   |
| GET    | `/api/posts/moderation/queue`                     | —                                                     | EDITOR+  |

### Tags

| Method | Endpoint                | Body                          | Role     |
| ------ | ----------------------- | ----------------------------- | -------- |
| GET    | `/api/tags`             | —                             | public   |
| GET    | `/api/tags/popular`     | —                             | public   |
| GET    | `/api/tags/{slug}`      | —                             | public   |
| POST   | `/api/tags`             | `{name, description?, color?}`| EDITOR+  |

### Comments

| Method | Endpoint                                          | Body                                | Role     |
| ------ | ------------------------------------------------- | ----------------------------------- | -------- |
| GET    | `/api/posts/{slug}/comments`                      | —                                   | public   |
| POST   | `/api/posts/{slug}/comments`                      | `{content, parentId?, guestName?}`  | any      |
| GET    | `/api/comments/moderation/queue`                  | —                                   | EDITOR+  |
| PUT    | `/api/comments/{id}/moderate`                     | `{status, reason?}`                 | EDITOR+  |

### Moderation

| Method | Endpoint                                          | Body | Role     |
| ------ | ------------------------------------------------- | ---- | -------- |
| GET    | `/api/moderation/stats`                           | —    | EDITOR+  |

## Appendix C — Sample Source Code

### C.1 Post entity (`Post.java`)

```java
@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_post_slug", columnList = "slug", unique = true),
        @Index(name = "idx_post_status", columnList = "status"),
        @Index(name = "idx_post_published_at", columnList = "publishedAt")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Post {
    @Id @GeneratedValue
    private UUID id;
    @Column(nullable = false, unique = true)
    private String slug;
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String excerpt;
    @Lob @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(columnDefinition = "TEXT")
    private String coverImageUrl;
    private Integer readingTimeMinutes;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private PostStatus status;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "post_tags",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;
    private Instant publishedAt;
    @Column(nullable = false) @Builder.Default
    private Long viewCount = 0L;
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @PrePersist void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
        if (status == null) status = PostStatus.DRAFT;
        if (viewCount == null) viewCount = 0L;
    }
    @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
}
```

### C.2 JWT authentication filter (`JwtAuthenticationFilter.java`, simplified)

```java
@Component @RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokens;
    private final CustomUserDetailsService userDetails;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (tokens.isValid(token)) {
                String email = tokens.getSubject(token);
                UserDetails user = userDetails.loadUserByUsername(email);
                Authentication auth = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }
}
```

### C.3 Typed API client (`api.ts`, extract)

```ts
export const api = {
  auth: {
    login: (email: string, password: string) =>
      unwrap<AuthResponse>(client.post('/api/auth/login', { email, password })),
    register: (input: { email: string; password: string; displayName: string }) =>
      unwrap<AuthResponse>(client.post('/api/auth/register', input)),
    me: () => unwrap<User>(client.get('/api/auth/me')),
  },
  posts: {
    list: (params: PostListParams = {}) =>
      unwrap<PageResponse<Post>>(client.get('/api/posts', { params })),
    bySlug: (slug: string) =>
      unwrap<Post>(client.get(`/api/posts/${encodeURIComponent(slug)}`)),
    create: (body: CreatePostInput) =>
      unwrap<Post>(client.post('/api/posts', body)),
    update: (slug: string, body: UpdatePostInput) =>
      unwrap<Post>(client.put(`/api/posts/${encodeURIComponent(slug)}`, body)),
    submit: (id: string) => unwrap<Post>(client.post(`/api/posts/${id}/submit`)),
    approve: (id: string) => unwrap<Post>(client.post(`/api/posts/${id}/approve`)),
    publish: (id: string) => unwrap<Post>(client.post(`/api/posts/${id}/publish`)),
    reject: (id: string, reason: string) =>
      unwrap<Post>(client.post(`/api/posts/${id}/reject`, { reason })),
  },
  // tags, comments, moderation omitted for brevity
};
```

<br><br>

<p align="center"><i>— End of Report —</i></p>
