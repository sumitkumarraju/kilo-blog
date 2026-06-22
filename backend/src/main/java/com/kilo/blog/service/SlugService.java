package com.kilo.blog.service;

import com.kilo.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class SlugService {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

    private final PostRepository postRepository;

    public String generate(String input) {
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("").toLowerCase(Locale.ROOT);
        slug = slug.replaceAll("-{2,}", "-").replaceAll("^-|-$", "");
        if (slug.isEmpty()) slug = "post";
        return slug;
    }

    public String uniquePostSlug(String base) {
        String slug = generate(base);
        String candidate = slug;
        int i = 2;
        while (postRepository.existsBySlug(candidate)) {
            candidate = slug + "-" + i++;
        }
        return candidate;
    }
}
