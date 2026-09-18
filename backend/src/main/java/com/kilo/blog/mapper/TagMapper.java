package com.kilo.blog.mapper;

import com.kilo.blog.domain.PostStatus;
import com.kilo.blog.domain.Tag;
import com.kilo.blog.dto.response.TagResponse;

public final class TagMapper {
    private TagMapper() {}

    public static TagResponse toResponse(Tag t) {
        if (t == null) return null;
        return new TagResponse(
                t.getId(),
                t.getSlug(),
                t.getName(),
                t.getDescription(),
                t.getColor(),
                publishedCount(t)
        );
    }

    private static int publishedCount(Tag t) {
        if (t.getPosts() == null) return 0;
        return (int) t.getPosts().stream()
                .filter(p -> p.getStatus() == PostStatus.PUBLISHED)
                .count();
    }

    public static TagResponse toResponseLight(Tag t) {
        if (t == null) return null;
        return new TagResponse(
                t.getId(),
                t.getSlug(),
                t.getName(),
                t.getDescription(),
                t.getColor(),
                null
        );
    }
}
