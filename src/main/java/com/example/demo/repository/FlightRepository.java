package com.example.demo.repository;

import com.example.demo.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f " +
            "JOIN FETCH f.departureAirport dep " +
            "JOIN FETCH f.arrivalAirport arr " +
            "WHERE dep.code = :departureCode AND arr.code = :arrivalCode AND " +
            "f.departureTime >= :startDate AND f.departureTime <= :endDate")
    List<Flight> searchFlights(
            @Param("departureCode") String departureCode,
            @Param("arrivalCode") String arrivalCode,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT f FROM Flight f " +
            "JOIN FETCH f.departureAirport dep " +
            "JOIN FETCH f.arrivalAirport arr " +
            "WHERE LOWER(arr.city) LIKE LOWER(CONCAT('%', :city, '%')) " +
            "ORDER BY f.price ASC")
    List<Flight> findByArrivalCity(@Param("city") String city);
}
