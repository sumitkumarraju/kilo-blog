package com.kilo.blog.controller;

import com.kilo.blog.dto.request.CreatePostRequest;
import com.kilo.blog.dto.request.ModerateRequest;
import com.kilo.blog.dto.request.UpdatePostRequest;
import com.kilo.blog.dto.response.PageResponse;
import com.kilo.blog.dto.response.PostResponse;
import com.kilo.blog.dto.response.PostSummaryResponse;
import com.kilo.blog.security.SecurityUser;
import com.kilo.blog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public PageResponse<PostSummaryResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "newest") String sort
    ) {
        return postService.listPublished(page, size, tag, q, sort);
    }

    @GetMapping("/featured")
    public List<PostSummaryResponse> featured() {
        return postService.listFeatured();
    }

    @PostMapping
    public ResponseEntity<PostResponse> create(
            @Valid @RequestBody CreatePostRequest req,
            @AuthenticationPrincipal SecurityUser principal
    ) {
        return ResponseEntity.ok(postService.create(req, principal.getUsername()));
    }

    @GetMapping("/{slug}")
    public PostResponse getBySlug(@PathVariable String slug) {
        return postService.getBySlug(slug);
    }

    @GetMapping("/id/{id}")
    public PostResponse getById(@PathVariable UUID id) {
        return postService.getById(id);
    }

    @PutMapping("/{slug}")
    public PostResponse update(
            @PathVariable String slug,
            @Valid @RequestBody UpdatePostRequest req,
            @AuthenticationPrincipal SecurityUser principal
    ) {
        return postService.update(slug, req, principal.getUsername());
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(
            @PathVariable String slug,
            @AuthenticationPrincipal SecurityUser principal
    ) {
        postService.delete(slug, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public PostResponse submit(@PathVariable UUID id, @AuthenticationPrincipal SecurityUser principal) {
        return postService.submitForReview(id, principal.getUsername());
    }

    @PostMapping("/{id}/approve")
    public PostResponse approve(@PathVariable UUID id) {
        return postService.approve(id);
    }

    @PostMapping("/{id}/reject")
    public PostResponse reject(@PathVariable UUID id, @RequestBody(required = false) ModerateRequest req) {
        return postService.reject(id, req == null ? null : req.reason());
    }

    @PostMapping("/{id}/archive")
    public PostResponse archive(@PathVariable UUID id, @AuthenticationPrincipal SecurityUser principal) {
        return postService.archive(id, principal.getUsername());
    }

    @PostMapping("/{id}/publish")
    public PostResponse publish(@PathVariable UUID id) {
        return postService.publish(id);
    }

    @GetMapping("/me/drafts")
    public PageResponse<PostSummaryResponse> myDrafts(
            @AuthenticationPrincipal SecurityUser principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return postService.listForAuthor(principal.getUsername(), page, size);
    }

    @GetMapping("/moderation/queue")
    public PageResponse<PostSummaryResponse> moderationQueue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return postService.listForModeration(page, size);
    }
}
