package com.example.backend_spring_angular.dto;

import java.time.LocalDateTime;

public record ParticipationResponse(
        Long id,
        String email,
        Integer seats,
        Double totalPrice,
        LocalDateTime createdAt,
        Long userId,
        EventInfo event
) {
    public record EventInfo(
            Long id,
            String titre,
            String lieu,
            String date,
            Double prix
    ) {}
}

