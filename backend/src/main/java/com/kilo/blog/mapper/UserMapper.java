package com.kilo.blog.mapper;

import com.kilo.blog.domain.User;
import com.kilo.blog.dto.response.UserResponse;

public final class UserMapper {
    private UserMapper() {}

    public static UserResponse toResponse(User u) {
        if (u == null) return null;
        return new UserResponse(
                u.getId(),
                u.getEmail(),
                u.getDisplayName(),
                u.getBio(),
                u.getAvatarUrl(),
                u.getRole(),
                u.getCreatedAt()
        );
    }
}
