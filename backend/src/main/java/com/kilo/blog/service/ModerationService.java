package com.kilo.blog.service;

import com.kilo.blog.domain.CommentStatus;
import com.kilo.blog.domain.PostStatus;
import com.kilo.blog.dto.response.ModerationStatsResponse;
import com.kilo.blog.repository.CommentRepository;
import com.kilo.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModerationService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Transactional(readOnly = true)
    public ModerationStatsResponse getStats() {
        long pendingPosts = postRepository.findByStatusInOrderByUpdatedAtDesc(
                List.of(PostStatus.PENDING_REVIEW),
                PageRequest.of(0, 1)
        ).getTotalElements();
        long publishedPosts = postRepository.findByStatusOrderByPublishedAtDesc(
                PostStatus.PUBLISHED, PageRequest.of(0, 1)
        ).getTotalElements();
        long pendingComments = commentRepository.countByStatus(CommentStatus.PENDING);
        long approvedComments = commentRepository.countByStatus(CommentStatus.APPROVED);

        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();

        return new ModerationStatsResponse(
                pendingPosts,
                pendingComments,
                publishedPosts,
                approvedComments,
                totalPosts,
                totalComments
        );
    }
}
