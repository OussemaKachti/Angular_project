package com.example.backend_spring_angular.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParticipationRequest(
        @Email @NotBlank String email,
        @NotNull @Min(1) Integer seats,
        @NotNull Long userId
) {}

