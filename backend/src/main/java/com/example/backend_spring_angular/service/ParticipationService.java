package com.example.backend_spring_angular.service;

import com.example.backend_spring_angular.dto.ParticipationRequest;
import com.example.backend_spring_angular.dto.ParticipationResponse;
import com.example.backend_spring_angular.entity.Event;
import com.example.backend_spring_angular.entity.Participation;
import com.example.backend_spring_angular.repository.EventRepository;
import com.example.backend_spring_angular.repository.ParticipationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParticipationService {

    private final EventRepository eventRepository;
    private final ParticipationRepository participationRepository;

    public ParticipationService(EventRepository eventRepository, ParticipationRepository participationRepository) {
        this.eventRepository = eventRepository;
        this.participationRepository = participationRepository;
    }

    public List<Participation> getParticipationsForEvent(Long eventId) {
        return participationRepository.findByEventId(eventId);
    }

    @Transactional
    public Participation createParticipation(Long eventId, ParticipationRequest request) {
        System.out.println("ParticipationService: Creating participation for eventId: " + eventId);
        System.out.println("ParticipationService: Request - email: " + request.email() + ", seats: " + request.seats() + ", userId: " + request.userId());
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> {
                    System.err.println("Event not found with id: " + eventId);
                    return new IllegalArgumentException("Event not found with id " + eventId);
                });

        System.out.println("ParticipationService: Event found - " + event.getTitre() + ", available places: " + event.getNbPlaces());

        int seatsRequested = request.seats();
        if (event.getNbPlaces() < seatsRequested) {
            System.err.println("Not enough seats. Available: " + event.getNbPlaces() + ", Requested: " + seatsRequested);
            throw new IllegalArgumentException("Not enough seats available");
        }

        double totalPrice = event.getPrix() * seatsRequested;
        System.out.println("ParticipationService: Total price calculated: " + totalPrice);

        Participation participation = new Participation();
        participation.setEmail(request.email());
        participation.setSeats(seatsRequested);
        participation.setTotalPrice(totalPrice);
        participation.setEvent(event);
        participation.setUserId(request.userId());

        event.setNbPlaces(event.getNbPlaces() - seatsRequested);
        System.out.println("ParticipationService: Updating event places from " + (event.getNbPlaces() + seatsRequested) + " to " + event.getNbPlaces());
        
        eventRepository.save(event);
        Participation saved = participationRepository.save(participation);
        
        System.out.println("ParticipationService: Participation saved with id: " + saved.getId());
        return saved;
    }

    public List<Participation> getParticipationsByUserId(Long userId) {
        return participationRepository.findByUserId(userId);
    }

    public List<ParticipationResponse> getParticipationsByUserIdWithEvent(Long userId) {
        List<Participation> participations = participationRepository.findByUserId(userId);
        System.out.println("ParticipationService: Found " + participations.size() + " participations for userId: " + userId);
        
        return participations.stream()
                .map(p -> {
                    Event event = p.getEvent();
                    System.out.println("ParticipationService: Mapping participation - ID: " + p.getId() + ", Event ID: " + event.getId());
                    
                    ParticipationResponse response = new ParticipationResponse(
                            p.getId(),
                            p.getEmail(),
                            p.getSeats(),
                            p.getTotalPrice(),
                            p.getCreatedAt(),
                            p.getUserId(),
                            new ParticipationResponse.EventInfo(
                                    event.getId(),
                                    event.getTitre(),
                                    event.getLieu(),
                                    event.getDate().toString(),
                                    event.getPrix()
                            )
                    );
                    
                    System.out.println("ParticipationService: Created ParticipationResponse - ID: " + response.id() + ", Event ID: " + response.event().id());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteParticipation(Long participationId) {
        System.out.println("ParticipationService: Deleting participation with id: " + participationId);
        
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> {
                    System.err.println("Participation not found with id: " + participationId);
                    return new IllegalArgumentException("Participation not found with id " + participationId);
                });
        
        System.out.println("ParticipationService: Found participation - email: " + participation.getEmail() + ", seats: " + participation.getSeats());
        
        Event event = participation.getEvent();
        if (event != null) {
            int seatsToRestore = participation.getSeats();
            event.setNbPlaces(event.getNbPlaces() + seatsToRestore);
            System.out.println("ParticipationService: Restoring " + seatsToRestore + " seats to event " + event.getId() + ". New places: " + event.getNbPlaces());
            eventRepository.save(event);
        } else {
            System.err.println("ParticipationService: Event is null for participation " + participationId);
        }
        
        participationRepository.deleteById(participationId);
        System.out.println("ParticipationService: Participation " + participationId + " deleted successfully");
    }
}

