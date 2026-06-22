package com.kilo.blog.service;

import com.kilo.blog.domain.Role;
import com.kilo.blog.domain.User;
import com.kilo.blog.dto.request.LoginRequest;
import com.kilo.blog.dto.request.RegisterRequest;
import com.kilo.blog.dto.response.AuthResponse;
import com.kilo.blog.exception.BadRequestException;
import com.kilo.blog.mapper.UserMapper;
import com.kilo.blog.repository.UserRepository;
import com.kilo.blog.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("Email already in use");
        }
        User user = User.builder()
                .email(req.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.password()))
                .displayName(req.displayName())
                .role(Role.AUTHOR)
                .build();
        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserMapper.toResponse(user));
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email().toLowerCase(), req.password())
        );
        User user = userRepository.findByEmail(req.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserMapper.toResponse(user));
    }
}
