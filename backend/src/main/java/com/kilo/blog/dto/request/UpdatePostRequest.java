package com.kilo.blog.dto.request;

import jakarta.validation.constraints.Size;

import java.util.Set;

public record UpdatePostRequest(
        @Size(max = 200) String title,
        @Size(max = 500) String excerpt,
        String content,
        String coverImageUrl,
        Set<String> tagSlugs
) {}
