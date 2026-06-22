package com.kilo.blog.dto.response;

public record ModerationStatsResponse(
        long pendingPosts,
        long pendingComments,
        long publishedPosts,
        long approvedComments,
        long totalPosts,
        long totalComments
) {}
