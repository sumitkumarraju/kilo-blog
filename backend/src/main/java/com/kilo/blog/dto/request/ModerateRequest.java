package com.kilo.blog.dto.request;

import com.kilo.blog.domain.CommentStatus;
import jakarta.validation.constraints.NotNull;

public record ModerateRequest(
        @NotNull CommentStatus status,
        String reason
) {}
