# Guide Complet : Backend Spring Boot pour le Projet Events

## 📋 Vue d'ensemble

Ce guide vous accompagne pour créer un backend Spring Boot complet avec base de données MySQL/PostgreSQL qui remplacera les services locaux Angular.

---

## 🎯 Étape 1 : Créer le Projet Spring Boot

### Option A : Via Spring Initializr (Recommandé)
1. Allez sur https://start.spring.io/
2. Configurez le projet :
   - **Project**: Maven
   - **Language**: Java
   - **Spring Boot**: 3.2.x (ou dernière version stable)
   - **Group**: `com.events`
   - **Artifact**: `events-backend`
   - **Name**: `events-backend`
   - **Package name**: `com.events.backend`
   - **Packaging**: Jar
   - **Java**: 17 ou 21

3. **Dependencies à ajouter** :
   - Spring Web
   - Spring Data JPA
   - MySQL Driver (ou PostgreSQL Driver)
   - Lombok (optionnel mais recommandé)
   - Spring Boot DevTools

4. Cliquez sur **Generate** et téléchargez le projet

### Option B : Via IntelliJ IDEA
1. File → New → Project
2. Spring Initializr
3. Suivez les mêmes configurations que ci-dessus

---

## 🗄️ Étape 2 : Configuration de la Base de Données

### 2.1 Créer la Base de Données

**MySQL** :
```sql
CREATE DATABASE events_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**PostgreSQL** :
```sql
CREATE DATABASE events_db;
```

### 2.2 Configuration dans `application.properties`

Créez/modifiez `src/main/resources/application.properties` :

```properties
# Server Configuration
server.port=8080

# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/events_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# CORS Configuration (pour permettre Angular d'accéder à l'API)
spring.web.cors.allowed-origins=http://localhost:4200
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

**Pour PostgreSQL**, remplacez par :
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/events_db
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

## 📦 Étape 3 : Créer les Entités JPA

### 3.1 Structure des Packages

Créez cette structure dans `src/main/java/com/events/backend` :
```
├── entity/
│   ├── Address.java
│   └── Event.java
├── repository/
│   └── EventRepository.java
├── service/
│   └── EventService.java
├── controller/
│   └── EventController.java
└── config/
    └── CorsConfig.java
```

### 3.2 Entité Address

Créez `src/main/java/com/events/backend/entity/Address.java` :

```java
package com.events.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    private String street;
    private String city;
    private String governorate;
    private String zipcode;
}
```

### 3.3 Entité Event

Créez `src/main/java/com/events/backend/entity/Event.java` :

```java
package com.events.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String lieu;

    @Column(nullable = false)
    private Double prix;

    @Column(nullable = false)
    private Long organisateurId;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer nbPlaces;

    @Column(nullable = false)
    private Integer nbrLikes = 0;

    @ElementCollection
    @CollectionTable(name = "event_domaines", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "domaine")
    private List<String> domaines = new ArrayList<>();

    @Embedded
    private Address detailedAddress;
}
```

**Note** : Si vous n'utilisez pas Lombok, ajoutez les getters/setters et constructeurs manuellement.

---

## 🔄 Étape 4 : Créer le Repository

Créez `src/main/java/com/events/backend/repository/EventRepository.java` :

```java
package com.events.backend.repository;

import com.events.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTitreContainingIgnoreCase(String titre);
}
```

---

## 🛠️ Étape 5 : Créer le Service

Créez `src/main/java/com/events/backend/service/EventService.java` :

```java
package com.events.backend.service;

import com.events.backend.entity.Event;
import com.events.backend.repository.EventRepository;
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
```

---

## 🌐 Étape 6 : Créer le Controller REST

Créez `src/main/java/com/events/backend/controller/EventController.java` :

```java
package com.events.backend.controller;

import com.events.backend.entity.Event;
import com.events.backend.service.EventService;
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
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
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
}
```

---

## 🔧 Étape 7 : Configuration CORS (Alternative)

Si vous préférez une configuration CORS globale, créez `src/main/java/com/events/backend/config/CorsConfig.java` :

```java
package com.events.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

---

## 🚀 Étape 8 : Tester le Backend

1. **Démarrer le serveur** :
   ```bash
   ./mvnw spring-boot:run
   # ou
   mvn spring-boot:run
   ```

2. **Tester avec Postman ou cURL** :
   ```bash
   # GET all events
   curl http://localhost:8080/api/events

   # GET event by id
   curl http://localhost:8080/api/events/1

   # POST create event
   curl -X POST http://localhost:8080/api/events \
     -H "Content-Type: application/json" \
     -d '{
       "titre": "Test Event",
       "description": "Description test",
       "date": "2025-12-01T10:00:00",
       "lieu": "Test Location",
       "prix": 50.0,
       "organisateurId": 1,
       "imageUrl": "images/event.png",
       "nbPlaces": 100,
       "nbrLikes": 0,
       "domaines": ["Music", "Concert"],
       "detailedAddress": {
         "street": "Test Street",
         "city": "Tunis",
         "governorate": "Tunis",
         "zipcode": "1000"
       }
     }'
   ```

---

## 📝 Étape 9 : Modifier le Service Angular

Une fois le backend prêt, nous modifierons le `DataService` Angular pour consommer l'API REST au lieu d'utiliser des données locales.

**Prochaines étapes** :
1. Installer HttpClient dans Angular
2. Modifier DataService pour utiliser HttpClient
3. Créer un service d'environnement pour l'URL de l'API
4. Tester la connexion

---

## ✅ Checklist de Vérification

- [ ] Projet Spring Boot créé
- [ ] Base de données créée et configurée
- [ ] Entités JPA créées (Event, Address)
- [ ] Repository créé
- [ ] Service créé avec toutes les méthodes
- [ ] Controller REST créé avec tous les endpoints
- [ ] CORS configuré
- [ ] Backend démarre sans erreur
- [ ] Tests avec Postman réussis

---

## 🎯 Prochaines Étapes

Une fois ce backend fonctionnel, nous passerons à l'intégration Angular :
1. Installation de HttpClient
2. Modification du DataService
3. Création d'un fichier d'environnement pour l'URL API
4. Tests de l'intégration complète

---

**Note** : Ce guide est complet et prêt à être suivi étape par étape. Commencez par l'étape 1 et avancez progressivement.

