package com.kilo.blog.service;

import com.kilo.blog.domain.Comment;
import com.kilo.blog.domain.CommentStatus;
import com.kilo.blog.domain.Post;
import com.kilo.blog.domain.User;
import com.kilo.blog.dto.request.CreateCommentRequest;
import com.kilo.blog.dto.request.ModerateRequest;
import com.kilo.blog.dto.response.CommentResponse;
import com.kilo.blog.dto.response.PageResponse;
import com.kilo.blog.exception.BadRequestException;
import com.kilo.blog.exception.NotFoundException;
import com.kilo.blog.mapper.CommentMapper;
import com.kilo.blog.repository.CommentRepository;
import com.kilo.blog.repository.PostRepository;
import com.kilo.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse create(String postSlug, CreateCommentRequest req, String userEmailOrNull) {
        Post post = postRepository.findBySlug(postSlug)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        Comment.CommentBuilder builder = Comment.builder()
                .post(post)
                .content(req.content())
                .status(CommentStatus.PENDING);

        if (userEmailOrNull != null) {
            User u = userRepository.findByEmail(userEmailOrNull)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            builder.author(u);
        } else {
            if (req.guestName() == null || req.guestName().isBlank()) {
                throw new BadRequestException("guestName is required for anonymous comments");
            }
            builder.guestName(req.guestName());
            builder.guestEmail(req.guestEmail());
        }

        if (req.parentId() != null) {
            Comment parent = commentRepository.findById(req.parentId())
                    .orElseThrow(() -> new NotFoundException("Parent comment not found"));
            if (!parent.getPost().getId().equals(post.getId())) {
                throw new BadRequestException("Parent comment belongs to a different post");
            }
            builder.parent(parent);
        }

        return CommentMapper.toResponse(commentRepository.save(builder.build()));
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> listApprovedForPost(String postSlug) {
        Post post = postRepository.findBySlug(postSlug)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        return commentRepository.findByPostIdAndStatusOrderByCreatedAtAsc(post.getId(), CommentStatus.APPROVED)
                .stream()
                .map(CommentMapper::toResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> listPendingForModeration(int page, int size) {
        Page<Comment> result = commentRepository.findByStatusOrderByCreatedAtDesc(
                CommentStatus.PENDING,
                PageRequest.of(page, size)
        );
        return PageResponse.from(result.map(CommentMapper::toResponse));
    }

    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Transactional
    public CommentResponse moderate(UUID id, ModerateRequest req, String moderatorEmail) {
        Comment c = commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Comment not found"));
        User moderator = userRepository.findByEmail(moderatorEmail)
                .orElseThrow(() -> new NotFoundException("Moderator not found"));
        c.setStatus(req.status());
        c.setModeratedAt(Instant.now());
        c.setModeratedBy(moderator);
        return CommentMapper.toResponse(c);
    }
}
