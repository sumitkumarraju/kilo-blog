package com.kilo.blog.dto.response;

import com.kilo.blog.domain.CommentStatus;

import java.time.Instant;
import java.util.UUID;

public record CommentResponse(
        UUID id,
        UUID postId,
        UserResponse author,
        String guestName,
        String content,
        CommentStatus status,
        UUID parentId,
        Instant createdAt,
        Instant moderatedAt
) {}
