package com.example.backend_spring_angular.dto;

public record AuthResponse(
        UserDto user,
        String token
) {
    public record UserDto(
            Long id,
            String email,
            String firstName,
            String lastName,
            String role
    ) {}
}

