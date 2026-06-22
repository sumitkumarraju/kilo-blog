package com.kilo.blog.repository;

import com.kilo.blog.domain.Comment;
import com.kilo.blog.domain.CommentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByPostIdAndStatusOrderByCreatedAtAsc(UUID postId, CommentStatus status);

    Page<Comment> findByStatusOrderByCreatedAtDesc(CommentStatus status, Pageable pageable);

    long countByStatus(CommentStatus status);
}
