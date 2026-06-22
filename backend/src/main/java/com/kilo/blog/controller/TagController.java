package com.kilo.blog.controller;

import com.kilo.blog.dto.request.CreateTagRequest;
import com.kilo.blog.dto.response.TagResponse;
import com.kilo.blog.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<TagResponse> list() {
        return tagService.listAll();
    }

    @GetMapping("/popular")
    public List<TagResponse> popular() {
        return tagService.listPopular();
    }

    @GetMapping("/{slug}")
    public TagResponse getBySlug(@PathVariable String slug) {
        return tagService.getBySlug(slug);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    public ResponseEntity<TagResponse> create(@Valid @RequestBody CreateTagRequest req) {
        return ResponseEntity.ok(tagService.create(req));
    }
}
