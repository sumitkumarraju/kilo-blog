package com.kilo.blog.mapper;

import com.kilo.blog.domain.Post;
import com.kilo.blog.dto.response.PostResponse;
import com.kilo.blog.dto.response.PostSummaryResponse;

import java.util.List;

public final class PostMapper {
    private PostMapper() {}

    public static PostResponse toResponse(Post p) {
        if (p == null) return null;
        return new PostResponse(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getExcerpt(),
                p.getContent(),
                p.getCoverImageUrl(),
                p.getReadingTimeMinutes(),
                p.getStatus(),
                UserMapper.toResponse(p.getAuthor()),
                tagList(p),
                p.getCreatedAt(),
                p.getUpdatedAt(),
                p.getPublishedAt(),
                p.getViewCount(),
                p.getRejectionReason()
        );
    }

    public static PostSummaryResponse toSummary(Post p) {
        if (p == null) return null;
        return new PostSummaryResponse(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getExcerpt(),
                p.getCoverImageUrl(),
                p.getReadingTimeMinutes(),
                p.getStatus(),
                UserMapper.toResponse(p.getAuthor()),
                tagList(p),
                p.getPublishedAt(),
                p.getUpdatedAt(),
                p.getViewCount()
        );
    }

    private static List<com.kilo.blog.dto.response.TagResponse> tagList(Post p) {
        if (p.getTags() == null) return List.of();
        return p.getTags().stream()
                .map(TagMapper::toResponseLight)
                .sorted(java.util.Comparator.comparing(com.kilo.blog.dto.response.TagResponse::name))
                .toList();
    }
}
