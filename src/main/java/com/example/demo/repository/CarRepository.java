package com.example.demo.repository;

import com.example.demo.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT c FROM Car c JOIN FETCH c.location " +
           "WHERE LOWER(c.location.city) LIKE LOWER(CONCAT('%', :city, '%')) " +
           "AND c.id NOT IN (" +
           "    SELECT crb.car.id FROM CarRentalBooking crb " +
           "    WHERE crb.pickupDatetime < :dropoff " +
           "    AND crb.dropoffDatetime > :pickup" +
           ")")
    List<Car> findAvailableCars(
            @org.springframework.data.repository.query.Param("city") String city,
            @org.springframework.data.repository.query.Param("pickup") LocalDateTime pickup,
            @org.springframework.data.repository.query.Param("dropoff") LocalDateTime dropoff);
}
