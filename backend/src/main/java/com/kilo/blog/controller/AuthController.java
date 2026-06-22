package com.kilo.blog.controller;

import com.kilo.blog.domain.User;
import com.kilo.blog.dto.request.LoginRequest;
import com.kilo.blog.dto.request.RegisterRequest;
import com.kilo.blog.dto.response.AuthResponse;
import com.kilo.blog.dto.response.UserResponse;
import com.kilo.blog.exception.NotFoundException;
import com.kilo.blog.mapper.UserMapper;
import com.kilo.blog.repository.UserRepository;
import com.kilo.blog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.kilo.blog.security.SecurityUser;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal SecurityUser principal) {
        if (principal == null) {
            throw new NotFoundException("Not authenticated");
        }
        User u = userRepository.findById(principal.getId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return ResponseEntity.ok(UserMapper.toResponse(u));
    }
}
