package com.example.backend_spring_angular.controller;

import com.example.backend_spring_angular.dto.ParticipationResponse;
import com.example.backend_spring_angular.service.ParticipationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participations")
@CrossOrigin(origins = "http://localhost:4200")
public class UserParticipationController {

    private final ParticipationService participationService;

    public UserParticipationController(ParticipationService participationService) {
        this.participationService = participationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ParticipationResponse>> getParticipationsByUserId(@PathVariable Long userId) {
        List<ParticipationResponse> participations = participationService.getParticipationsByUserIdWithEvent(userId);
        return ResponseEntity.ok(participations);
    }

    @DeleteMapping("/{participationId}")
    public ResponseEntity<Void> deleteParticipation(@PathVariable Long participationId) {
        System.out.println("Received DELETE request for participationId: " + participationId);
        try {
            participationService.deleteParticipation(participationId);
            System.out.println("Participation " + participationId + " deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            System.err.println("Error deleting participation " + participationId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Unexpected error deleting participation " + participationId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

