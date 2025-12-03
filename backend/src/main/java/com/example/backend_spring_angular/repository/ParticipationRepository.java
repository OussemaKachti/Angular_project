package com.example.backend_spring_angular.repository;

import com.example.backend_spring_angular.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByEventId(Long eventId);
    
    @Query("SELECT p FROM Participation p JOIN FETCH p.event WHERE p.userId = :userId")
    List<Participation> findByUserId(@Param("userId") Long userId);
}

