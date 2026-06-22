package com.kilo.blog.dto.response;

import com.kilo.blog.domain.PostStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PostSummaryResponse(
        UUID id,
        String slug,
        String title,
        String excerpt,
        String coverImageUrl,
        Integer readingTimeMinutes,
        PostStatus status,
        UserResponse author,
        List<TagResponse> tags,
        Instant publishedAt,
        Instant updatedAt,
        Long viewCount
) {}
