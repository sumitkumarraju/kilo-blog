package com.kilo.blog.repository;

import com.kilo.blog.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
    Optional<Tag> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("select t from Tag t left join t.posts p group by t order by count(p) desc")
    List<Tag> findTop10PopularTags(org.springframework.data.domain.Pageable pageable);
}
