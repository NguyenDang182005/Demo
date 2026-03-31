package com.example.demo.repository;

import com.example.demo.entity.AirportTaxi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AirportTaxiRepository extends JpaRepository<AirportTaxi, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t FROM AirportTaxi t JOIN FETCH t.airport " +
            "WHERE t.airport.code = :airportCode " +
            "AND t.id NOT IN (" +
            "    SELECT tb.taxi.id FROM TaxiBooking tb " +
            "    WHERE tb.pickupDatetime BETWEEN :windowStart AND :windowEnd" +
            ")")
    java.util.List<AirportTaxi> findAvailableTaxis(
            @org.springframework.data.repository.query.Param("airportCode") String airportCode,
            @org.springframework.data.repository.query.Param("windowStart") java.time.LocalDateTime windowStart,
            @org.springframework.data.repository.query.Param("windowEnd") java.time.LocalDateTime windowEnd);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT t FROM AirportTaxi t JOIN FETCH t.airport " +
            "WHERE LOWER(t.airport.city) LIKE LOWER(CONCAT('%', :city, '%')) " +
            "AND t.id NOT IN (" +
            "    SELECT tb.taxi.id FROM TaxiBooking tb " +
            "    WHERE tb.pickupDatetime BETWEEN :windowStart AND :windowEnd" +
            ")")
    java.util.List<AirportTaxi> findAvailableTaxisByCity(
            @org.springframework.data.repository.query.Param("city") String city,
            @org.springframework.data.repository.query.Param("windowStart") java.time.LocalDateTime windowStart,
            @org.springframework.data.repository.query.Param("windowEnd") java.time.LocalDateTime windowEnd);
}
