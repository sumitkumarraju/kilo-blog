package com.kilo.blog.seed;

import com.kilo.blog.domain.*;
import com.kilo.blog.repository.CommentRepository;
import com.kilo.blog.repository.PostRepository;
import com.kilo.blog.repository.TagRepository;
import com.kilo.blog.repository.UserRepository;
import com.kilo.blog.service.ReadingTimeCalculator;
import com.kilo.blog.service.SlugService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Component
@ConditionalOnProperty(name = "kilo.seed.enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;
    private final SlugService slugService;
    private final ReadingTimeCalculator readingTimeCalculator;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Data already seeded, skipping");
            return;
        }
        log.info("Seeding kilo-blog data...");

        Users users = seedUsers();
        Map<String, Tag> tags = seedTags();
        seedPosts(users, tags);

        log.info("Seed complete: {} users, {} tags, {} posts, {} comments",
                userRepository.count(), tagRepository.count(),
                postRepository.count(), commentRepository.count());
    }

    private Users seedUsers() {
        User admin = userRepository.save(User.builder()
                .email("admin@kilo.blog")
                .passwordHash(passwordEncoder.encode("Admin123!"))
                .displayName("Admin")
                .bio("Keeps the lights on at Kilo.")
                .role(Role.ADMIN)
                .avatarUrl("https://i.pravatar.cc/150?u=admin")
                .build());

        User editor = userRepository.save(User.builder()
                .email("editor@kilo.blog")
                .passwordHash(passwordEncoder.encode("Editor123!"))
                .displayName("Mira Patel")
                .bio("Editor-in-chief. Curious about everything that moves the craft forward.")
                .role(Role.EDITOR)
                .avatarUrl("https://i.pravatar.cc/150?u=editor")
                .build());

        User sara = userRepository.save(User.builder()
                .email("sara@kilo.blog")
                .passwordHash(passwordEncoder.encode("Author123!"))
                .displayName("Sara Lin")
                .bio("Design engineer. Writes about the small details that shape product feel.")
                .role(Role.AUTHOR)
                .avatarUrl("https://i.pravatar.cc/150?u=sara")
                .build());

        User ari = userRepository.save(User.builder()
                .email("ari@kilo.blog")
                .passwordHash(passwordEncoder.encode("Author123!"))
                .displayName("Ari Okafor")
                .bio("Backend engineer turned writer. Distributed systems, databases, and the occasional rant.")
                .role(Role.AUTHOR)
                .avatarUrl("https://i.pravatar.cc/150?u=ari")
                .build());

        return new Users(admin, editor, sara, ari);
    }

    private Map<String, Tag> seedTags() {
        Map<String, Tag> tags = new LinkedHashMap<>();
        record T(String name, String desc, String color) {}
        List<T> defs = List.of(
                new T("Design", "Visual craft, interaction, brand systems.", "#7C5CFF"),
                new T("Engineering", "How we build, ship, and keep things running.", "#0EA5E9"),
                new T("Product", "Decisions, tradeoffs, and customer signal.", "#F97316"),
                new T("Culture", "Teams, rituals, and how work gets done.", "#10B981"),
                new T("Research", "Interviews, experiments, and what we learn.", "#EAB308"),
                new T("Tutorials", "Step-by-step walkthroughs you can follow.", "#EC4899"),
                new T("Opinion", "Sharp takes from people on our team.", "#EF4444"),
                new T("Interviews", "Conversations with makers we admire.", "#8B5CF6")
        );
        for (T t : defs) {
            String slug = t.name().toLowerCase(Locale.ROOT);
            Tag saved = tagRepository.save(Tag.builder()
                    .slug(slug)
                    .name(t.name())
                    .description(t.desc())
                    .color(t.color())
                    .build());
            tags.put(slug, saved);
        }
        return tags;
    }

    private void seedPosts(Users users, Map<String, Tag> tags) {
        Instant now = Instant.now();

        // 8 PUBLISHED posts
        publish(users.sara, tags, List.of("design", "engineering"), now.minus(2, ChronoUnit.DAYS),
                "The quiet craft of empty states",
                "Empty states are the moments where products tell users they belong. Sweat the copy, the spacing, and the illustration ratio.",
                """
                Most products treat empty states as an afterthought. A grey illustration, a one-line message, a button. But empty states are some of the most loaded surfaces in a product. They greet new users on day one, they show up when a customer has cleaned things up after a long week, and they appear when a search returns nothing.

                The pattern that works for us starts with three questions: what does the user need to know, what should they do next, and how do we make this moment feel light instead of heavy? A good empty state is generous. It explains the value of the surface, offers a clear path forward, and resists the temptation to oversell.

                Treat empty states like onboarding. Reuse the voice you set on day one. Match the illustration style to the rest of the product. And remember: an empty state seen often is a workflow problem in disguise. If users land on the same empty state every Monday morning, that is a product brief.
                """);

        publish(users.ari, tags, List.of("engineering", "tutorials"), now.minus(4, ChronoUnit.DAYS),
                "Cache invalidation is hard. Here is how we got it less hard",
                "Caching saved our database, but it almost cost us trust. A walk through the architecture we landed on and the assumptions we had to give up.",
                """
                Our first cache was a Redis layer in front of Postgres. It worked, until it did not. Stale rows showed up at the worst times: an admin would change a price, the customer support team would refresh, and the old number would smile back at them. The fix was not a smarter TTL. The fix was admitting that the cache and the database had different jobs.

                We split the work in three layers. Static data lives in a long-lived CDN. Per-user data lives in a short-lived Redis cache. Anything that needs to be exactly right is read straight from the database with a tagged query that the orchestration layer can invalidate. We used CDC events from Postgres to publish invalidations, which gave us a deterministic story when things went wrong.

                The biggest lesson is that cache invalidation is not a technical problem first. It is a product problem. Decide what staleness your customers can tolerate, and then build the simplest thing that meets that bar. The fanciest cache is the one you do not need.
                """);

        publish(users.sara, tags, List.of("design", "product"), now.minus(6, ChronoUnit.DAYS),
                "Designing for the second visit",
                "First impressions get all the attention. The second visit is where the product actually starts working for you.",
                """
                Most of our research is biased toward the first run. We watch users land on the homepage, sign up, and complete the first task. We celebrate when conversion goes up. But the second visit is where retention lives, and that surface is almost always under-designed.

                What makes the second visit work is recognition. The product should remember you, not in a creepy way, but in a useful one. The dashboard should pick up where you left off. A reminder should reflect what you actually need now, not the canned suggestion every user gets. The home screen should feel like it has been waiting for you.

                We started designing the second visit as a first-class surface. We sketched it, we prototyped it, and we ran it past users. The numbers moved in a way the homepage redesign never could.
                """);

        publish(users.ari, tags, List.of("engineering", "opinion"), now.minus(7, ChronoUnit.DAYS),
                "Stop apologising for monoliths",
                "Microservices have a real place. Most teams do not need them on day one. Here is a frame for choosing on purpose.",
                """
                Every few years a new architecture wins the conference stage and then trickles down to teams who do not need it yet. Microservices were the loudest version of this. They solved real problems at scale, and they introduced an enormous tax on teams who were not at scale yet.

                A modular monolith with clear seams is, in my experience, the right starting point for almost every product team. You get one deploy, one log stream, one database story, and the ability to refactor across boundaries without negotiating a contract change. The boundaries you find through that refactoring are real, lived boundaries.

                Once you start to feel friction, pull a service out. But pull it out because you measured the friction, not because a slide deck told you the future was distributed.
                """);

        publish(users.editor, tags, List.of("culture", "interviews"), now.minus(9, ChronoUnit.DAYS),
                "How we run a writer's room for a product team",
                "A conversation with our content lead on the rituals that keep our writing tight.",
                """
                A writers' room sounds grand, but ours is one hour on Wednesday afternoons with a shared doc and a kettle. The format is simple. Anyone with a piece in flight reads the first two paragraphs aloud. The rest of the room writes silent notes. Then we go around and share the one thing we noticed.

                The trick is that we never debate edits in the room. We use the room to surface signal, and we trust the writer to act on it offline. That single rule keeps the meeting useful and keeps egos out of the way. New writers leave with a sense of the bar, and senior writers leave with notes they would not have caught on their own.

                The output speaks for itself. Our drafts are shorter, our headlines are sharper, and our publishing cadence has doubled without burning anyone out.
                """);

        publish(users.sara, tags, List.of("design", "research"), now.minus(11, ChronoUnit.DAYS),
                "A small study on hover, tap, and trust",
                "We ran a study on how hover state strength changes perceived trust on a checkout page. The numbers surprised us.",
                """
                Hover states are usually a styling decision. We treat them as a brand thing, or we let the framework provide a default and move on. But hover is also a signal. When a user moves a cursor over a button on a checkout page, the way that button responds is a small promise about how the rest of the experience is going to behave.

                We ran a study with 240 participants on three variants of a checkout button: no hover state, a subtle hover, and a strong hover. The conversion difference between the no-hover and strong-hover variants was significant. More interesting, the post-purchase trust scores trended in the same direction. The button told users what kind of product they were buying.

                We are not suggesting you crank up every hover state to maximum. But on surfaces where trust matters, the interaction layer is doing more than you think it is.
                """);

        publish(users.ari, tags, List.of("engineering", "tutorials"), now.minus(14, ChronoUnit.DAYS),
                "A pragmatic guide to Postgres indexing",
                "Indexes are where most teams over-index or under-index. Here is the simple decision tree we use.",
                """
                Most teams I work with hit a Postgres performance ceiling at one of three places: a missing index, a too-wide index, or an index that the planner cannot use because of a function or implicit cast in the query. The fix is almost never adding more indexes blindly.

                Start by collecting the slow queries with auto_explain. Read the plan. If you see a sequential scan on a large table, ask whether there is a sensible compound index that would let the planner do an index-only scan. If you see a function call in the WHERE clause, consider a functional index, but only if that exact form is the one your application uses.

                The thing that took me the longest to internalise is that an index is a contract with the optimiser. The optimiser only honours that contract if the query matches. Read your EXPLAIN ANALYZE output the way you would read a code review. The plan tells you what is actually happening.
                """);

        publish(users.sara, tags, List.of("product", "opinion"), now.minus(16, ChronoUnit.DAYS),
                "The roadmap is not the strategy",
                "A roadmap tells you what is shipping in the next quarter. A strategy tells you why that quarter matters at all.",
                """
                The mistake I see most often on product teams is the equation of roadmap with strategy. They are different documents with different jobs. A roadmap is a forecast. A strategy is a claim about what the world will look like and what the company is going to do about it.

                When a team treats the roadmap as the strategy, every quarter starts with a sequencing argument. Should we ship feature A before feature B? Who has the most leverage in the planning meeting? The team that has the strategy in writing makes those decisions in five minutes. The team that does not, debates for a week and ships whatever wins the loudest meeting.

                Write the strategy down. Make it short. Test it against the next two roadmap candidates and watch how quickly the right answer falls out.
                """);

        // 2 DRAFTs
        draft(users.sara, tags, List.of("design"),
                "Notes on motion design for productivity tools",
                "An outline of the principles I keep coming back to on motion in serious software.",
                """
                Motion is treated as decoration in most productivity software, and it is the cheapest way to make a product feel alive. The trick is not how much motion you add. It is how purposeful each piece of motion is.

                This is a working draft.
                """);

        draft(users.ari, tags, List.of("engineering"),
                "When event sourcing is the wrong answer",
                "A draft listing the symptoms that suggest a team has reached for event sourcing prematurely.",
                """
                Event sourcing is one of those architectures that solves a real problem at the cost of a lot of incidental complexity. I want to sketch out the symptoms I see that signal it is the wrong call.

                More to come.
                """);

        // 1 PENDING_REVIEW
        pending(users.sara, tags, List.of("research", "product"),
                "What we learned from 50 customer calls in a quarter",
                "A summary of the themes that emerged when we cleared our calendars and just listened.",
                """
                We spent a quarter doing one thing: talking to customers. Fifty calls, mostly thirty minutes long, almost all unstructured. We made the calls cheap to book and we resisted the temptation to demo anything.

                Three themes emerged. First, our customers care less about feature parity than we thought and more about predictability. Second, the language they use for our product is older than the language we use internally, and that mismatch costs us. Third, the moments of delight come from the boring surfaces: invoicing, settings, the change log.

                Each of those themes turned into a workstream this quarter, and the work is already changing the shape of the product.
                """);

        // 1 ARCHIVED
        archived(users.ari, tags, List.of("engineering", "opinion"), now.minus(120, ChronoUnit.DAYS),
                "Why we rewrote our scheduler in Rust (and what we would do differently)",
                "An older post we have since superseded, kept here for the record.",
                """
                We rewrote the scheduler in Rust two years ago. The throughput numbers were real, but the cost was higher than we admitted at the time. This post stays up for the historical record, and we have a follow-up that supersedes it.

                The short version: pick the language for the team you have, not the team you wish you had.
                """);

        archived(users.sara, tags, List.of("design", "opinion"), now.minus(150, ChronoUnit.DAYS),
                "On skeuomorphism, and why we got rid of it",
                "A historical look at the original brand system, kept for posterity.",
                """
                The first version of our product shipped with a heavily skeuomorphic interface. Felt-textured backgrounds, leather-bound cards, lighting effects that simulated depth. It looked beautiful in screenshots and felt clumsy in daily use.

                The lesson, three years later, is that skeuomorphism is craft borrowed from a different medium. It is gorgeous on a marketing site and exhausting on a tool you use every day. We pulled it out in stages and the product is calmer for it.

                We keep this post here as a reminder of what the early team valued. It is also a reminder that brand language is allowed to grow up.
                """);

        archived(users.editor, tags, List.of("culture", "interviews"), now.minus(180, ChronoUnit.DAYS),
                "A retrospective on our first hire",
                "An older piece on how we picked the first non-founder engineer.",
                """
                The first non-founder engineer at any startup is a load-bearing decision. We wrote about ours four years ago, and the advice in it has aged unevenly. Some of it holds up. Some of it does not.

                The part that aged well: hire someone who is a better engineer than the founders, and give them ownership of one part of the system from day one. The part that did not: the screening rubric. We have replaced it twice since.

                The post stays up because the spirit of it is still right, even if the specifics have moved on.
                """);

        archived(users.ari, tags, List.of("engineering", "tutorials"), now.minus(220, ChronoUnit.DAYS),
                "A guide to NoSQL stores that we no longer recommend",
                "An old tutorial for a database we have migrated off. Kept for the curious.",
                """
                We wrote this tutorial when our primary store was a NoSQL database. The advice was good at the time and we got real value out of the system. Two years later we migrated to Postgres, and we have not looked back.

                The tutorial is preserved because the patterns it describes are still useful in the right context. The disclaimer at the top: if you are starting a new product today, default to a relational store. The reasons we ended up moving were not failures of the original system. They were the predictable cost of using a tool optimised for a different problem.

                For everyone who comes across this post via search, the follow-up is on the homepage: it walks through the migration in detail.
                """);

        archived(users.sara, tags, List.of("product", "opinion"), now.minus(260, ChronoUnit.DAYS),
                "The first pricing page (and everything we got wrong)",
                "A retired write-up of our original three-tier pricing experiment.",
                """
                Our first pricing page had three tiers, an annual toggle, and a long footnote about overages. It converted poorly and confused everyone who looked at it. We rebuilt it eighteen months ago, and the new version is what is on the site today.

                The post is preserved for context. The takeaway, after three years of pricing experiments: simple beats clever, defaults beat configuration, and a clear free tier closes more enterprise deals than any sales motion we have tried.

                If you read this and recognise yourself in the original page, the new one is a quick read.
                """);

        archived(users.editor, tags, List.of("culture"), now.minus(310, ChronoUnit.DAYS),
                "How we used to run all-hands (and what changed)",
                "A snapshot of a meeting format that does not survive at our current scale.",
                """
                When we were thirty people, all-hands was a single hour-long meeting with one slide and a lot of conversation. It worked. When we hit eighty people it stopped working, and we kept running the same format for another four months before we admitted it.

                The post is preserved as a record of a specific era. The new format is documented separately. If you are at the size we were when this was written, the original recipe is probably still right. If you are bigger, do not copy us. Copy yourself, six months from now, after you have actually noticed it has stopped working.
                """);

        // ---- additional published articles for search testing ----
        publish(users.editor, tags, List.of("design", "tutorials"), now.minus(18, ChronoUnit.DAYS),
                "A practical guide to building accessible color systems",
                "Contrast ratios, color tokens, and the tradeoffs between elegance and accessibility on the web.",
                """
                Color is the most personal part of a design system and the easiest to get wrong. The teams that ship the most reliable color systems treat color as data: every token is a row in a table, every pair of tokens has a measured contrast ratio, every dark-mode value is derived from the light-mode one with documented math.

                Start with the surfaces, not the palette. Map every place a color is used to a semantic token. Background, surface, surface-elevated, line, ink, ink-muted, accent. Then walk those tokens through the contrast checker as a unit. A token system is only as accessible as its weakest pair.

                The work that pays off the most is the boring work: writing the documentation, generating the contrast report, and forbidding new colors that have not been through the same audit. Designers will complain at first. They will thank you in six months.
                """);

        publish(users.ari, tags, List.of("engineering", "research"), now.minus(20, ChronoUnit.DAYS),
                "Search ranking for small datasets without ElasticSearch",
                "Postgres full-text search will take you further than you think, especially below a million documents.",
                """
                Reaching for ElasticSearch on day one is one of the most common over-engineering mistakes in early-stage products. Postgres ships with full-text search, trigram similarity, and a query planner that has been tuned for thirty years. For most teams under a million documents, that combination is enough.

                We use a generated tsvector column with a GIN index. We rank with ts_rank_cd weighted toward the title. We add pg_trgm similarity for fuzzy matches on author names. The full implementation fits in one migration and three lines of application code.

                There is a real ceiling. Above a few million documents, the cost of keeping the index hot in shared buffers starts to matter. But that ceiling is much higher than the panic threshold most teams use to justify a separate service.
                """);

        publish(users.sara, tags, List.of("design", "engineering"), now.minus(22, ChronoUnit.DAYS),
                "On dropdowns, popovers, and the geometry of attention",
                "Why dropdowns should animate from their trigger and why modals are the exception.",
                """
                The default transform-origin in CSS is the center of the element. For modals that is correct. For everything else that is anchored to a trigger it is wrong. A dropdown that scales from its center looks like it has been teleported in. A dropdown that scales from its trigger feels like it grew out of the click.

                Radix UI and Base UI both expose a CSS variable that points to the trigger. Use it. The change is small, the difference in feel is enormous. The same principle applies to tooltips, context menus, and date pickers.

                The exception is the modal. A modal is not anchored to a trigger, it is anchored to the viewport. Keep it center-origin. That is the one place where the default is right.
                """);

        publish(users.ari, tags, List.of("engineering", "tutorials"), now.minus(24, ChronoUnit.DAYS),
                "Streaming server-sent events to a React app in 2026",
                "A short tour of the modern stack for live updates: SSE, fetch streams, and useSyncExternalStore.",
                """
                WebSockets are the right answer when you need duplex traffic. For everything else, server-sent events are simpler, easier to operate, and easier to debug. They go through the same proxy chain as the rest of your HTTP traffic, they reconnect automatically, and they survive corporate firewalls that strip WebSocket upgrades.

                On the server, we emit events with a small Spring Boot endpoint and a Sinks.Many. On the client, we read them with the fetch streaming API and route updates into a Zustand store. The whole pipeline is maybe two hundred lines of code.

                The trick is making the React side push updates without re-rendering everything. We expose the store with useSyncExternalStore, which is the modern primitive for subscribing to external state without thrashing the reconciler.
                """);

        publish(users.editor, tags, List.of("culture", "product"), now.minus(26, ChronoUnit.DAYS),
                "The standup is not the problem",
                "Why daily standups get a bad rap and what they are actually for.",
                """
                Standups are a cliché on engineering team blogs. Everyone has an opinion about them, most of those opinions are wrong, and the loudest one is usually that standups should be cancelled. They should not. They should be run well.

                The point of a standup is not to status-report to a manager. It is to surface what is in the way today, while there is still time to clear it. A well-run standup is short, has a facilitator, and ends with a list of one-on-ones that need to happen after.

                If your standups feel like a tax, the format is broken, not the ritual. Try a different facilitator. Try a different question. Try writing answers in a thread and only meeting if there is a blocker. The shape can change. The need it serves does not.
                """);

        publish(users.sara, tags, List.of("design", "research"), now.minus(28, ChronoUnit.DAYS),
                "What we learned shipping a mobile-first redesign",
                "A debrief from six months of iteration on the dashboard, mostly from a phone.",
                """
                We rebuilt the dashboard mobile-first this year. Not because most of our traffic is mobile, but because the constraint forced clarity. When you cannot lean on a sidebar and three navigation rails, you have to decide what actually matters.

                The redesign cut the number of primary navigation items from nine to four. We pushed three of them into a search-driven flow. Mobile usage rose by twelve percent, but the more interesting number is that desktop engagement rose by seven percent. The constraint made the desktop product better too.

                The lesson we keep coming back to is that the small screen is a forcing function. If a feature does not earn its place on the phone, ask whether it really earns its place on the desktop either.
                """);

        publish(users.ari, tags, List.of("engineering", "opinion"), now.minus(31, ChronoUnit.DAYS),
                "Stop writing your own ORM",
                "The repository pattern, dynamic queries, and the limits of leaving JPA behind.",
                """
                Every few years I meet a team that is mid-way through writing their own ORM on top of a JDBC template. The motivation is real: their JPA setup got out of hand, queries are slow, and the abstraction is leaking. The solution is almost never a hand-rolled mapper.

                The good news is that modern JPA, used with care, is fast and predictable. Use named entity graphs to control eager loading. Use projection interfaces for list views. Use native queries when the planner needs help. None of that requires leaving the ecosystem.

                The bad news is that the discipline to use JPA well is harder than the discipline to write your own. You have to know what each annotation costs. The teams I see succeed have a senior engineer who can read a generated SQL statement and explain why each clause is there.
                """);

        publish(users.sara, tags, List.of("product", "interviews"), now.minus(34, ChronoUnit.DAYS),
                "A conversation with the team behind Linear's keyboard shortcuts",
                "Notes from a long talk about latency, muscle memory, and why no shortcut is ever final.",
                """
                Linear is famous for its keyboard shortcuts, and we sat down with two of the engineers behind them. The conversation kept coming back to one number: the millisecond budget between a keypress and visible feedback.

                Every shortcut they ship has a budget. If the action cannot be acknowledged within sixteen milliseconds, it gets a different design. Sometimes that means an optimistic update. Sometimes it means the shortcut does not ship at all. The product feels fast because they sweat the budget on every single action.

                The other lesson was that no shortcut is final. They review the mapping every quarter and they will move a key if usage data shows the assignment is wrong. The keyboard layer is a product surface, not a hidden setting.
                """);

        publish(users.editor, tags, List.of("culture", "opinion"), now.minus(37, ChronoUnit.DAYS),
                "Burnout is a systems problem",
                "Why individual self-care advice misses the point, and what teams can change instead.",
                """
                The advice that gets handed to burned-out engineers is almost always individual. Sleep more. Meditate. Take a walk. Those are all good ideas, and none of them fix burnout. Burnout is a systems problem, and systems are fixed by leaders, not individuals.

                The signals are usually visible months in advance. PRs that take a week to merge. On-call rotations that load up on one person. A backlog that grows by the size of the team every quarter. None of those are personal failings. They are organisational debt, and they compound.

                Treat burnout like a postmortem. Read the signals. Make a list of changes. Hold a manager accountable for each one. The follow-through is the difference between a team that learns and a team that grinds.
                """);

        publish(users.ari, tags, List.of("engineering", "tutorials"), now.minus(40, ChronoUnit.DAYS),
                "Connection pooling: what HikariCP is doing for you",
                "An accessible tour of HikariCP, why the defaults are good, and the two settings worth tuning.",
                """
                HikariCP is one of those libraries that quietly handles ninety percent of what a backend needs. The defaults are good, the implementation is small, and the only reason you would notice it is when something is wrong.

                Two settings actually matter for most teams. maximumPoolSize: set it based on the database, not the application. A common mistake is sizing the pool to the JVM rather than to the database's connection limit. connectionTimeout: keep it short. If you cannot get a connection in two seconds, your pool is exhausted and the right answer is to fail fast.

                Everything else is fine on the default. Resist the urge to add knobs for the sake of having knobs.
                """);

        publish(users.sara, tags, List.of("design"), now.minus(43, ChronoUnit.DAYS),
                "Type pairing for editorial products",
                "A practical reference on serif/sans pairings that hold up over a long-form read.",
                """
                Editorial type pairing is one of those craft skills that looks like an opinion and is actually a set of decisions. Pick a serif for headings that has enough x-height to survive at sixteen pixels. Pair it with a sans that has matching proportions in the lowercase. Set the body in the serif if the read is long, the sans if the read is fast.

                Our default is Fraunces for display and Inter for UI. We use the same body font as the heading on long-form pages because the rhythm of reading benefits from a single voice. We use Inter on listings and dashboards because the eye scans better on geometric sans-serifs.

                The most common mistake is treating fonts as decoration. They are infrastructure. Choose them with the same care you would choose a database.
                """);

        publish(users.editor, tags, List.of("product", "research"), now.minus(46, ChronoUnit.DAYS),
                "How we run lightweight customer research without a researcher",
                "A small playbook for product teams who cannot hire a UX researcher yet.",
                """
                Most early-stage teams cannot afford a full-time researcher, and most of them try to research anyway. The output is usually thin: a few interview notes, a survey nobody reads, and a Notion page that goes stale within a quarter. The playbook below is the one we wish we had had when we started.

                Run two interviews a week. Same day, same time, same template. Recruit through the product, not LinkedIn. Pay them well. Record the calls, transcribe them, and dump the transcripts into a single document with a header for each session. Read the document end-to-end every Friday.

                The patterns will start to surface around interview ten. By interview thirty, you will know more about your users than most researcher-led teams know after a year. The trick is consistency, not technique.
                """);

        publish(users.ari, tags, List.of("engineering", "opinion"), now.minus(50, ChronoUnit.DAYS),
                "Notes on building software for hospitals",
                "Health software is a different sport. A small list of what changes when lives are downstream.",
                """
                Building software for hospitals is not the same as building software for any other industry. The user is a clinician with thirty minutes of training. The workflow is interrupted by alarms, codes, and the occasional cardiac event. The data is incomplete, contradictory, and arrives in a different format every shift.

                The lesson that took us the longest to internalise is that latency is a safety feature. A loading spinner that takes three seconds in a normal product is a frustration. The same spinner in front of a clinician at four in the morning is a missed dose. You design for the worst possible user state, not the best.

                We ended up with a much smaller, much more conservative product than we set out to build. That is the right outcome. Healthcare software should feel boring. Boring saves lives.
                """);

        publish(users.sara, tags, List.of("design", "tutorials"), now.minus(54, ChronoUnit.DAYS),
                "Building a custom focus ring you do not hate",
                "How to ship a focus state that is accessible, on-brand, and stops looking like a default browser ring.",
                """
                The browser default focus ring is good. It is also ugly, and that ugliness is the reason most teams remove it without replacing it. The result is a product that fails accessibility audits and frustrates keyboard users.

                The solution is to build a custom focus style that you actually want in your design system. Two outlines, layered. The inner one is your brand colour. The outer one is the background colour, which creates a halo that survives on any surface. Total cost: six lines of CSS.

                Wire it up with :focus-visible so it only appears on keyboard interactions and not on every mouse click. Test it in dark mode. Test it on disabled buttons. Then write it into your component library and never think about it again.
                """);

        publish(users.editor, tags, List.of("opinion", "culture"), now.minus(58, ChronoUnit.DAYS),
                "The internet does not need another newsletter platform",
                "On the proliferation of writing platforms and the small case for choosing constraint.",
                """
                There are too many newsletter platforms. The space has been productized to death, and most of the new entrants are competing on features that no writer asked for. The interesting work right now is happening at the opposite end of the spectrum: small, focused, opinionated platforms that constrain rather than enable.

                Constraint is the feature. A platform that gives you fewer choices forces a clearer voice. The writers I read every week are on platforms that make the writing harder, not easier. Markdown only. Single-column layouts. No analytics dashboard. The friction is intentional.

                The lesson for builders is that not every customer needs a swiss army knife. Some of the best products are simple in a way that looks like restraint until you realise it is a stance.
                """);

        publish(users.ari, tags, List.of("engineering", "research"), now.minus(62, ChronoUnit.DAYS),
                "A note on idempotency keys for payment systems",
                "Why idempotency keys matter, where to put them, and how to recover from the worst case.",
                """
                Payment systems fail in ways that other systems do not. A network blip in the middle of a charge can result in the customer being charged twice, or not at all, with no clean signal about which one happened. Idempotency keys are the standard answer.

                The pattern is simple. The client generates a unique key for each user-initiated operation. The server stores the key alongside the result of the operation. When a duplicate request comes in with the same key, the server returns the stored result rather than performing the action again.

                The implementation is harder than it looks. The store has to survive crashes. The key has to be wider than a UUID to prevent collisions across customers. The TTL has to be long enough to cover human retries but short enough to keep the table from growing forever. Read the Stripe docs. Steal their schema.
                """);

        publish(users.sara, tags, List.of("design", "product"), now.minus(67, ChronoUnit.DAYS),
                "Designing for delight without designing for novelty",
                "How to make a product feel good without piling on novelty effects that age badly.",
                """
                There is a difference between a delightful product and a novel one. Delight survives the second use. Novelty does not. The mistake most teams make is conflating the two, and the cost is a product that feels exciting on day one and exhausting by day thirty.

                Delight lives in the boring surfaces. The way the toast confirms a save. The way a button gives haptic feedback. The way the empty state hands you a useful next action. None of those moments is novel. All of them compound.

                The test we use is: would I want to see this animation a hundred times this week. If yes, keep it. If no, kill it. Novelty is a one-time tax. Delight is an asset.
                """);

        publish(users.editor, tags, List.of("interviews", "engineering"), now.minus(72, ChronoUnit.DAYS),
                "An hour with the maintainers of a single-person open source library",
                "How one person keeps a library used by millions running without burning out.",
                """
                We spent an hour with the maintainer of a popular open source library. The library is in the dependency tree of most Node projects. The maintainer is one person, working evenings and weekends.

                The conversation kept returning to triage. They do not respond to every issue. They do not fix every bug. They keep a public list of what they will and will not work on, and they enforce it without apology. The discipline is the only reason the project is still alive.

                The other lesson was about saying yes. They accept contributions, but only ones that come with a test and a written rationale. The bar is high because the cost of accepting a bad contribution is paid by them, alone, for years. The asymmetry is what keeps the work sustainable.
                """);

        publish(users.ari, tags, List.of("engineering", "tutorials"), now.minus(78, ChronoUnit.DAYS),
                "Migrating from REST to GraphQL: a measured retrospective",
                "A year of moving a public API to GraphQL, with the wins and the regrets.",
                """
                We migrated our public API to GraphQL last year and it is the right call for our product. It is also far more work than the original proposal suggested, and the parts of the work that turned out to be hard were not the parts we expected.

                The schema design took twice as long as the resolvers. We underestimated the cost of agreeing on naming. We over-estimated the cost of N+1 query problems, which DataLoader handled cleanly. The hardest part of the year was deprecating old REST endpoints, not building the new ones.

                Would we do it again? Yes, but we would budget twelve months for the cutover, not six. And we would document the schema design process before writing any code. The schema is the API. Everything else is implementation.
                """);

        publish(users.sara, tags, List.of("design", "opinion"), now.minus(85, ChronoUnit.DAYS),
                "Animation is craft, not decoration",
                "A short manifesto on motion in serious product software.",
                """
                Animation is the most undervalued part of product design. The instinct in most teams is to treat it as decoration, a sprinkle of motion that gets added after the layout is done. That is exactly backwards. Animation is part of the layout. It is how the product explains itself to the user.

                A modal that appears without a transition is a different product than one that scales in from a trigger. A list that adds an item with a fade is a different product than one that snaps. The motion is not the polish. The motion is the meaning.

                The teams that ship the best products treat animation as a first-class design output. They sketch it, they prototype it, they review it. They cut the animations that do not earn their place. That is the difference between a product that feels alive and one that feels like a slideshow.
                """);

        publish(users.ari, tags, List.of("engineering", "product"), now.minus(95, ChronoUnit.DAYS),
                "Feature flags are not a release strategy",
                "Why feature flag tooling is necessary but not sufficient for safe releases.",
                """
                Feature flags are the most over-prescribed solution in modern software. Every team has them. Every postmortem mentions them. Most teams use them poorly. The pattern is the same: a flag gets added, the feature ships behind it, and then the flag stays in the code forever, polluting the call graph and confusing every engineer who touches the file.

                Flags are a tool. A release strategy is a process. The process answers questions that flags cannot: who decides to roll forward, who decides to roll back, what metrics gate the next step, how long does a flag live before it must be removed.

                The good teams have a release calendar, a flag inventory, and a deletion ritual. The flag is a means. The decision is the work.
                """);

        publish(users.editor, tags, List.of("culture", "product"), now.minus(105, ChronoUnit.DAYS),
                "What good written communication looks like on a remote team",
                "A small set of rules that have made our async work less exhausting.",
                """
                Remote teams live and die on the quality of their written communication. The teams that thrive write deliberately. The teams that struggle write reactively. The difference is mostly a few small habits.

                Lead with the conclusion. Most readers will only read the first paragraph. If the first paragraph does not contain the decision, you have wasted the reader's time. Use bold for the verbs in your asks. The recipient should be able to scan for what they are being asked to do without parsing the prose.

                Keep threads short. If a thread is going past five replies, schedule a call. The opposite is also true: if a discussion is happening in a meeting, write the conclusion down. Calls and threads are tools, and the choice is part of the work.
                """);
    }

    private void publish(User author, Map<String, Tag> tags, List<String> tagSlugs, Instant publishedAt,
                         String title, String excerpt, String content) {
        Post post = buildPost(author, tags, tagSlugs, title, excerpt, content);
        post.setStatus(PostStatus.PUBLISHED);
        post.setPublishedAt(publishedAt);
        post.setViewCount(20L + (long) (Math.random() * 500));
        Post saved = postRepository.save(post);
        seedCommentsFor(saved, author);
    }

    private void draft(User author, Map<String, Tag> tags, List<String> tagSlugs,
                       String title, String excerpt, String content) {
        Post post = buildPost(author, tags, tagSlugs, title, excerpt, content);
        post.setStatus(PostStatus.DRAFT);
        postRepository.save(post);
    }

    private void pending(User author, Map<String, Tag> tags, List<String> tagSlugs,
                         String title, String excerpt, String content) {
        Post post = buildPost(author, tags, tagSlugs, title, excerpt, content);
        post.setStatus(PostStatus.PENDING_REVIEW);
        postRepository.save(post);
    }

    private void archived(User author, Map<String, Tag> tags, List<String> tagSlugs, Instant publishedAt,
                          String title, String excerpt, String content) {
        Post post = buildPost(author, tags, tagSlugs, title, excerpt, content);
        post.setStatus(PostStatus.ARCHIVED);
        post.setPublishedAt(publishedAt);
        postRepository.save(post);
    }

    private Post buildPost(User author, Map<String, Tag> tags, List<String> tagSlugs,
                           String title, String excerpt, String content) {
        Set<Tag> tagSet = new HashSet<>();
        for (String s : tagSlugs) {
            if (tags.containsKey(s)) tagSet.add(tags.get(s));
        }
        return Post.builder()
                .slug(slugService.uniquePostSlug(title))
                .title(title)
                .excerpt(excerpt)
                .content(content.trim())
                .readingTimeMinutes(readingTimeCalculator.minutesFor(content))
                .author(author)
                .tags(tagSet)
                .coverImageUrl(coverFor(title))
                .build();
    }

    private String coverFor(String title) {
        int hash = Math.abs(title.hashCode()) % 1000;
        return "https://picsum.photos/seed/kilo" + hash + "/1200/600";
    }

    private void seedCommentsFor(Post post, User author) {
        String[] approved = {
                "This was a great read, thanks for writing it up.",
                "Saving this and sharing it with my team on Monday.",
                "Strong agree on the section about predictability."
        };
        String[] pending = {
                "Could you share the data behind that claim?",
                "Curious how this scales past a team of ten."
        };
        for (String c : approved) {
            commentRepository.save(Comment.builder()
                    .post(post)
                    .author(author)
                    .content(c)
                    .status(CommentStatus.APPROVED)
                    .moderatedAt(Instant.now())
                    .build());
        }
        if (Math.random() > 0.4) {
            for (String c : pending) {
                commentRepository.save(Comment.builder()
                        .post(post)
                        .guestName("Guest Reader")
                        .guestEmail("reader@example.com")
                        .content(c)
                        .status(CommentStatus.PENDING)
                        .build());
            }
        }
    }

    private record Users(User admin, User editor, User sara, User ari) {}
}
