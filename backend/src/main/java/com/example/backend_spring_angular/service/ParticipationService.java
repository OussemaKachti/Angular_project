package com.example.backend_spring_angular.service;

import com.example.backend_spring_angular.dto.ParticipationRequest;
import com.example.backend_spring_angular.entity.Event;
import com.example.backend_spring_angular.entity.Participation;
import com.example.backend_spring_angular.repository.EventRepository;
import com.example.backend_spring_angular.repository.ParticipationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id " + eventId));

        int seatsRequested = request.seats();
        if (event.getNbPlaces() < seatsRequested) {
            throw new IllegalArgumentException("Not enough seats available");
        }

        double totalPrice = event.getPrix() * seatsRequested;

        Participation participation = new Participation();
        participation.setEmail(request.email());
        participation.setSeats(seatsRequested);
        participation.setTotalPrice(totalPrice);
        participation.setEvent(event);

        event.setNbPlaces(event.getNbPlaces() - seatsRequested);
        eventRepository.save(event);

        return participationRepository.save(participation);
    }
}

