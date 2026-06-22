package com.kilo.blog.dto.response;

import java.util.UUID;

public record TagResponse(
        UUID id,
        String slug,
        String name,
        String description,
        String color,
        Integer postCount
) {}
