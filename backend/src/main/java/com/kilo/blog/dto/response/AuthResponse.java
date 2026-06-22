package com.kilo.blog.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {}
