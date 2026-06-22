package com.kilo.blog.mapper;

import com.kilo.blog.domain.Comment;
import com.kilo.blog.dto.response.CommentResponse;

public final class CommentMapper {
    private CommentMapper() {}

    public static CommentResponse toResponse(Comment c) {
        if (c == null) return null;
        return new CommentResponse(
                c.getId(),
                c.getPost() == null ? null : c.getPost().getId(),
                UserMapper.toResponse(c.getAuthor()),
                c.getGuestName(),
                c.getContent(),
                c.getStatus(),
                c.getParent() == null ? null : c.getParent().getId(),
                c.getCreatedAt(),
                c.getModeratedAt()
        );
    }
}
