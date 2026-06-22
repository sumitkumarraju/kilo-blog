package com.kilo.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateTagRequest(
        @NotBlank @Size(max = 60) String name,
        @Size(max = 280) String description,
        @Pattern(regexp = "^#?[0-9a-fA-F]{6}$", message = "color must be a 6-digit hex string")
        String color
) {}
