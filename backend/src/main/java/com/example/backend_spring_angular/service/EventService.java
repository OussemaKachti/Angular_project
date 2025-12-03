package com.example.backend_spring_angular.service;

import com.example.backend_spring_angular.entity.Event;
import com.example.backend_spring_angular.entity.Participation;
import com.example.backend_spring_angular.repository.EventRepository;
import com.example.backend_spring_angular.repository.ParticipationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private ParticipationRepository participationRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        if (event.getNbrLikes() == null) {
            event.setNbrLikes(0);
        }
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        event.setTitre(eventDetails.getTitre());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setLieu(eventDetails.getLieu());
        event.setPrix(eventDetails.getPrix());
        event.setImageUrl(eventDetails.getImageUrl());
        event.setNbPlaces(eventDetails.getNbPlaces());
        event.setDomaines(eventDetails.getDomaines());
        event.setDetailedAddress(eventDetails.getDetailedAddress());

        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        System.out.println("EventService: Attempting to delete event with id: " + id);
        
        // Vérifier si l'événement existe
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> {
                    System.err.println("EventService: Event not found with id: " + id);
                    return new RuntimeException("Event not found with id: " + id);
                });
        
        System.out.println("EventService: Found event - " + event.getTitre());
        
        // Supprimer d'abord toutes les participations liées à cet événement
        List<Participation> participations = participationRepository.findByEventId(id);
        if (!participations.isEmpty()) {
            System.out.println("EventService: Found " + participations.size() + " participations to delete");
            participationRepository.deleteAll(participations);
            System.out.println("EventService: All participations deleted");
        }
        
        // Supprimer l'événement
        eventRepository.deleteById(id);
        System.out.println("EventService: Event " + id + " deleted successfully");
    }

    public List<Event> searchEvents(String searchTerm) {
        return eventRepository.findByTitreContainingIgnoreCase(searchTerm);
    }

    public Event incrementLikes(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setNbrLikes(event.getNbrLikes() + 1);
        return eventRepository.save(event);
    }

    public Event buyTicket(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        if (event.getNbPlaces() > 0) {
            event.setNbPlaces(event.getNbPlaces() - 1);
            return eventRepository.save(event);
        }
        throw new RuntimeException("No places available");
    }

    public List<Event> getEventsByOrganizerId(Long organisateurId) {
        return eventRepository.findByOrganisateurId(organisateurId);
    }
}
