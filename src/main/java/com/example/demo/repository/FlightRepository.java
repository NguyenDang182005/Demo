package com.example.demo.repository;

import com.example.demo.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    @org.springframework.data.jpa.repository.Query("SELECT f FROM Flight f " +
            "JOIN FETCH f.departureAirport " +
            "JOIN FETCH f.arrivalAirport " +
            "WHERE f.departureAirport.code = :departureCode AND f.arrivalAirport.code = :arrivalCode AND " +
            "f.departureTime >= :startDate AND f.departureTime <= :endDate")
    List<Flight> searchFlights(
            @org.springframework.data.repository.query.Param("departureCode") String departureCode,
            @org.springframework.data.repository.query.Param("arrivalCode") String arrivalCode,
            @org.springframework.data.repository.query.Param("startDate") LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") LocalDateTime endDate);
}
