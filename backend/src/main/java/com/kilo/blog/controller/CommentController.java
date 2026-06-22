package com.kilo.blog.controller;

import com.kilo.blog.dto.request.CreateCommentRequest;
import com.kilo.blog.dto.request.ModerateRequest;
import com.kilo.blog.dto.response.CommentResponse;
import com.kilo.blog.dto.response.PageResponse;
import com.kilo.blog.security.SecurityUser;
import com.kilo.blog.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/api/posts/{slug}/comments")
    public List<CommentResponse> listForPost(@PathVariable String slug) {
        return commentService.listApprovedForPost(slug);
    }

    @PostMapping("/api/posts/{slug}/comments")
    public ResponseEntity<CommentResponse> create(
            @PathVariable String slug,
            @Valid @RequestBody CreateCommentRequest req,
            @AuthenticationPrincipal SecurityUser principal
    ) {
        String email = principal == null ? null : principal.getUsername();
        return ResponseEntity.ok(commentService.create(slug, req, email));
    }

    @GetMapping("/api/comments/moderation/queue")
    public PageResponse<CommentResponse> moderationQueue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return commentService.listPendingForModeration(page, size);
    }

    @PutMapping("/api/comments/{id}/moderate")
    public CommentResponse moderate(
            @PathVariable UUID id,
            @Valid @RequestBody ModerateRequest req,
            @AuthenticationPrincipal SecurityUser principal
    ) {
        return commentService.moderate(id, req, principal.getUsername());
    }
}
