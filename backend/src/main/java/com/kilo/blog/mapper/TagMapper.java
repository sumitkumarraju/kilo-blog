package com.kilo.blog.mapper;

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
                t.getPosts() == null ? 0 : t.getPosts().size()
        );
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
