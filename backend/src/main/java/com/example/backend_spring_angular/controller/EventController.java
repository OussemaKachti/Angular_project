package com.example.backend_spring_angular.controller;

import com.example.backend_spring_angular.entity.Event;
import com.example.backend_spring_angular.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        event.setId(null);
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        try {
            Event updatedEvent = eventService.updateEvent(id, event);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        System.out.println("EventController: Received DELETE request for event id: " + id);
        try {
            eventService.deleteEvent(id);
            System.out.println("EventController: Event " + id + " deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            System.err.println("EventController: Error deleting event " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("EventController: Unexpected error deleting event " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String q) {
        List<Event> events = eventService.searchEvents(q);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Event> incrementLikes(@PathVariable Long id) {
        try {
            Event event = eventService.incrementLikes(id);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/buy")
    public ResponseEntity<Event> buyTicket(@PathVariable Long id) {
        try {
            Event event = eventService.buyTicket(id);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/organizer/{organisateurId}")
    public ResponseEntity<List<Event>> getEventsByOrganizerId(@PathVariable Long organisateurId) {
        List<Event> events = eventService.getEventsByOrganizerId(organisateurId);
        return ResponseEntity.ok(events);
    }
}