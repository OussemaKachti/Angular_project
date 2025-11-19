package com.example.backend_spring_angular.repository;

import com.example.backend_spring_angular.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByEventId(Long eventId);
}

