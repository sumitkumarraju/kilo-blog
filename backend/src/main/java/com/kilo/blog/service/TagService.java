package com.kilo.blog.service;

import com.kilo.blog.domain.Tag;
import com.kilo.blog.dto.request.CreateTagRequest;
import com.kilo.blog.dto.response.TagResponse;
import com.kilo.blog.exception.BadRequestException;
import com.kilo.blog.exception.NotFoundException;
import com.kilo.blog.mapper.TagMapper;
import com.kilo.blog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    @Transactional(readOnly = true)
    public List<TagResponse> listAll() {
        return tagRepository.findAll().stream()
                .map(TagMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TagResponse> listPopular() {
        return tagRepository.findTop10PopularTags(PageRequest.of(0, 10)).stream()
                .map(TagMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TagResponse getBySlug(String slug) {
        Tag t = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tag not found: " + slug));
        return TagMapper.toResponse(t);
    }

    @Transactional
    public TagResponse create(CreateTagRequest req) {
        String slug = slugify(req.name());
        if (tagRepository.existsBySlug(slug)) {
            throw new BadRequestException("Tag already exists: " + slug);
        }
        Tag t = Tag.builder()
                .slug(slug)
                .name(req.name())
                .description(req.description())
                .color(normalizeColor(req.color()))
                .build();
        return TagMapper.toResponse(tagRepository.save(t));
    }

    public Tag findOrCreate(String slug, String name, String color) {
        return tagRepository.findBySlug(slug).orElseGet(() ->
                tagRepository.save(Tag.builder()
                        .slug(slug)
                        .name(name)
                        .color(color)
                        .build())
        );
    }

    private String slugify(String input) {
        String norm = Normalizer.normalize(input.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return norm.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    private String normalizeColor(String color) {
        if (color == null || color.isBlank()) return null;
        return color.startsWith("#") ? color : "#" + color;
    }
}
