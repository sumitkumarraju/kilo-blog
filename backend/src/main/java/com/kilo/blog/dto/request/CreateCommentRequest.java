package com.kilo.blog.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
        @NotBlank @Size(max = 5000) String content,
        @Size(max = 80) String guestName,
        @Email String guestEmail,
        java.util.UUID parentId
) {}
