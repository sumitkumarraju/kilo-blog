package com.kilo.blog.dto.response;

import com.kilo.blog.domain.PostStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PostResponse(
        UUID id,
        String slug,
        String title,
        String excerpt,
        String content,
        String coverImageUrl,
        Integer readingTimeMinutes,
        PostStatus status,
        UserResponse author,
        List<TagResponse> tags,
        Instant createdAt,
        Instant updatedAt,
        Instant publishedAt,
        Long viewCount,
        String rejectionReason
) {}
