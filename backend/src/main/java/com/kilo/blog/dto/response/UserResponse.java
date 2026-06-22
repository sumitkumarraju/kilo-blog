package com.kilo.blog.dto.response;

import com.kilo.blog.domain.Role;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String displayName,
        String bio,
        String avatarUrl,
        Role role,
        Instant createdAt
) {}
