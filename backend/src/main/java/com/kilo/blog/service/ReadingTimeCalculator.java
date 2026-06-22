package com.kilo.blog.service;

import org.springframework.stereotype.Service;

@Service
public class ReadingTimeCalculator {

    private static final int WORDS_PER_MINUTE = 200;

    public int minutesFor(String content) {
        if (content == null || content.isBlank()) return 1;
        int words = content.trim().split("\\s+").length;
        int minutes = (int) Math.ceil(words / (double) WORDS_PER_MINUTE);
        return Math.max(1, minutes);
    }
}
