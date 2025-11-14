package com.example.backend_spring_angular.entity;

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
