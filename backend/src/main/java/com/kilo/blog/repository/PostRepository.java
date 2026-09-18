package com.kilo.blog.repository;

import com.kilo.blog.domain.Post;
import com.kilo.blog.domain.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    Optional<Post> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    Page<Post> findByStatusOrderByPublishedAtDesc(PostStatus status, Pageable pageable);

    Page<Post> findByAuthorId(UUID authorId, Pageable pageable);

    Page<Post> findByAuthorIdAndStatus(UUID authorId, PostStatus status, Pageable pageable);

    @Query("""
            select p from Post p
            where p.status = :status
              and (:q is null or lower(p.title) like lower(concat('%', cast(:q as string), '%'))
                   or lower(coalesce(p.excerpt, '')) like lower(concat('%', cast(:q as string), '%'))
                   or lower(p.content) like lower(concat('%', cast(:q as string), '%')))
              and (:tagSlug is null or exists (
                    select 1 from p.tags t where t.slug = :tagSlug
                  ))
            """)
    Page<Post> searchPublished(@Param("status") PostStatus status,
                               @Param("q") String q,
                               @Param("tagSlug") String tagSlug,
                               Pageable pageable);

    Page<Post> findByStatusInOrderByUpdatedAtDesc(java.util.Collection<PostStatus> statuses, Pageable pageable);

    java.util.List<Post> findTop4ByStatusOrderByViewCountDesc(PostStatus status);

    @Modifying(flushAutomatically = true)
    @Query("update Post p set p.viewCount = p.viewCount + 1 where p.id = :id")
    void incrementViewCount(@Param("id") UUID id);
}
