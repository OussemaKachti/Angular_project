package com.example.backend_spring_angular.controller;

import com.example.backend_spring_angular.dto.ParticipationRequest;
import com.example.backend_spring_angular.entity.Participation;
import com.example.backend_spring_angular.service.ParticipationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/participations")
@CrossOrigin(origins = "http://localhost:4200")
public class ParticipationController {

    private final ParticipationService participationService;

    public ParticipationController(ParticipationService participationService) {
        this.participationService = participationService;
    }

    @GetMapping
    public ResponseEntity<List<Participation>> getParticipations(@PathVariable Long eventId) {
        return ResponseEntity.ok(participationService.getParticipationsForEvent(eventId));
    }

    @PostMapping
    public ResponseEntity<?> createParticipation(@PathVariable Long eventId,
                                                 @Valid @RequestBody ParticipationRequest request) {
        try {
            Participation participation = participationService.createParticipation(eventId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(participation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

