package com.example.backend_spring_angular.service;

import com.example.backend_spring_angular.entity.Event;
import com.example.backend_spring_angular.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

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

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
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
}
