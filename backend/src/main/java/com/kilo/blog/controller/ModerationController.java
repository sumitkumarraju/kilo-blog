package com.kilo.blog.controller;

import com.kilo.blog.dto.response.ModerationStatsResponse;
import com.kilo.blog.service.ModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/moderation")
@RequiredArgsConstructor
public class ModerationController {

    private final ModerationService moderationService;

    @GetMapping("/stats")
    public ModerationStatsResponse stats() {
        return moderationService.getStats();
    }
}
