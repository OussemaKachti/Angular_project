package com.example.backend_spring_angular.repository;

import com.example.backend_spring_angular.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTitreContainingIgnoreCase(String titre);
    List<Event> findByOrganisateurId(Long organisateurId);
}