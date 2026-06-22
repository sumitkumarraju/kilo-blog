package com.kilo.blog.service;

import com.kilo.blog.domain.Post;
import com.kilo.blog.domain.PostStatus;
import com.kilo.blog.domain.Role;
import com.kilo.blog.domain.Tag;
import com.kilo.blog.domain.User;
import com.kilo.blog.dto.request.CreatePostRequest;
import com.kilo.blog.dto.request.UpdatePostRequest;
import com.kilo.blog.dto.response.PageResponse;
import com.kilo.blog.dto.response.PostResponse;
import com.kilo.blog.dto.response.PostSummaryResponse;
import com.kilo.blog.exception.BadRequestException;
import com.kilo.blog.exception.ForbiddenException;
import com.kilo.blog.exception.NotFoundException;
import com.kilo.blog.mapper.PostMapper;
import com.kilo.blog.repository.PostRepository;
import com.kilo.blog.repository.TagRepository;
import com.kilo.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final SlugService slugService;
    private final ReadingTimeCalculator readingTimeCalculator;

    @Transactional
    public PostResponse create(CreatePostRequest req, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new NotFoundException("Author not found"));

        Post post = Post.builder()
                .slug(slugService.uniquePostSlug(req.title()))
                .title(req.title())
                .excerpt(req.excerpt())
                .content(req.content())
                .coverImageUrl(req.coverImageUrl())
                .readingTimeMinutes(readingTimeCalculator.minutesFor(req.content()))
                .status(PostStatus.DRAFT)
                .author(author)
                .tags(resolveTags(req.tagSlugs()))
                .build();

        return PostMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse update(String slug, UpdatePostRequest req, String userEmail) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        User user = requireUser(userEmail);
        requireAuthorOrEditor(post, user);

        if (req.title() != null && !req.title().isBlank()) {
            post.setTitle(req.title());
        }
        if (req.excerpt() != null) post.setExcerpt(req.excerpt());
        if (req.content() != null && !req.content().isBlank()) {
            post.setContent(req.content());
            post.setReadingTimeMinutes(readingTimeCalculator.minutesFor(req.content()));
        }
        if (req.coverImageUrl() != null) post.setCoverImageUrl(req.coverImageUrl());
        if (req.tagSlugs() != null) post.setTags(resolveTags(req.tagSlugs()));

        return PostMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public void delete(String slug, String userEmail) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        User user = requireUser(userEmail);
        requireAuthorOrEditor(post, user);
        postRepository.delete(post);
    }

    @Transactional
    public PostResponse submitForReview(UUID id, String userEmail) {
        Post post = requirePost(id);
        User user = requireUser(userEmail);
        if (!post.getAuthor().getId().equals(user.getId()) && !isEditorOrAdmin(user)) {
            throw new ForbiddenException("Only the author can submit this post");
        }
        if (post.getStatus() != PostStatus.DRAFT && post.getStatus() != PostStatus.REJECTED) {
            throw new BadRequestException("Only DRAFT or REJECTED posts can be submitted");
        }
        post.setStatus(PostStatus.PENDING_REVIEW);
        post.setRejectionReason(null);
        return PostMapper.toResponse(post);
    }

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

    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Transactional
    public PostResponse reject(UUID id, String reason) {
        Post post = requirePost(id);
        if (post.getStatus() != PostStatus.PENDING_REVIEW) {
            throw new BadRequestException("Only PENDING_REVIEW posts can be rejected");
        }
        post.setStatus(PostStatus.REJECTED);
        post.setRejectionReason(reason);
        return PostMapper.toResponse(post);
    }

    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Transactional
    public PostResponse publish(UUID id) {
        Post post = requirePost(id);
        post.setStatus(PostStatus.PUBLISHED);
        post.setRejectionReason(null);
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(Instant.now());
        }
        return PostMapper.toResponse(post);
    }

    @Transactional
    public PostResponse archive(UUID id, String userEmail) {
        Post post = requirePost(id);
        User user = requireUser(userEmail);
        requireAuthorOrEditor(post, user);
        post.setStatus(PostStatus.ARCHIVED);
        return PostMapper.toResponse(post);
    }

    @Transactional
    public PostResponse getBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        if (post.getStatus() == PostStatus.PUBLISHED) {
            // Increment via separate update query to avoid full entity rewrite and version conflicts.
            postRepository.incrementViewCount(post.getId());
            post.setViewCount(post.getViewCount() + 1);
        } else {
            String email = currentEmailOrNull();
            if (email == null) {
                throw new NotFoundException("Post not found");
            }
            User u = userRepository.findByEmail(email).orElse(null);
            boolean isAuthor = u != null && post.getAuthor().getId().equals(u.getId());
            boolean isStaff = u != null && isEditorOrAdmin(u);
            if (!isAuthor && !isStaff) {
                throw new NotFoundException("Post not found");
            }
        }
        return PostMapper.toResponse(post);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> listPublished(int page, int size, String tag, String q, String sort) {
        Sort s = switch (sort == null ? "newest" : sort) {
            case "oldest" -> Sort.by(Sort.Direction.ASC, "publishedAt");
            case "popular" -> Sort.by(Sort.Direction.DESC, "viewCount");
            default -> Sort.by(Sort.Direction.DESC, "publishedAt");
        };
        Page<Post> result = postRepository.searchPublished(
                PostStatus.PUBLISHED,
                (q == null || q.isBlank()) ? null : q.trim(),
                (tag == null || tag.isBlank()) ? null : tag.trim(),
                PageRequest.of(page, size, s)
        );
        return PageResponse.from(result.map(PostMapper::toSummary));
    }

    @Transactional(readOnly = true)
    public List<PostSummaryResponse> listFeatured() {
        return postRepository.findTop4ByStatusOrderByViewCountDesc(PostStatus.PUBLISHED)
                .stream()
                .map(PostMapper::toSummary)
                .toList();
    }

    @Transactional
    public PostResponse getById(UUID id) {
        Post post = requirePost(id);
        if (post.getStatus() != PostStatus.PUBLISHED) {
            String email = currentEmailOrNull();
            if (email == null) {
                throw new NotFoundException("Post not found");
            }
            User u = userRepository.findByEmail(email).orElse(null);
            boolean isAuthor = u != null && post.getAuthor().getId().equals(u.getId());
            boolean isStaff = u != null && isEditorOrAdmin(u);
            if (!isAuthor && !isStaff) {
                throw new NotFoundException("Post not found");
            }
        }
        return PostMapper.toResponse(post);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> listForAuthor(String email, int page, int size) {
        User u = requireUser(email);
        Page<Post> result = postRepository.findByAuthorId(
                u.getId(),
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"))
        );
        return PageResponse.from(result.map(PostMapper::toSummary));
    }

    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> listForModeration(int page, int size) {
        Page<Post> result = postRepository.findByStatusInOrderByUpdatedAtDesc(
                List.of(PostStatus.PENDING_REVIEW),
                PageRequest.of(page, size)
        );
        return PageResponse.from(result.map(PostMapper::toSummary));
    }

    private Set<Tag> resolveTags(Set<String> slugs) {
        if (slugs == null || slugs.isEmpty()) return new HashSet<>();
        Set<Tag> out = new HashSet<>();
        for (String slug : slugs) {
            tagRepository.findBySlug(slug).ifPresent(out::add);
        }
        return out;
    }

    private Post requirePost(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found"));
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private void requireAuthorOrEditor(Post post, User user) {
        if (!post.getAuthor().getId().equals(user.getId()) && !isEditorOrAdmin(user)) {
            throw new ForbiddenException("Not allowed to modify this post");
        }
    }

    private boolean isEditorOrAdmin(User user) {
        return user.getRole() == Role.EDITOR || user.getRole() == Role.ADMIN;
    }

    private String currentEmailOrNull() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return auth.getName();
    }
}
