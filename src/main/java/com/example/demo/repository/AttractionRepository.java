package com.example.demo.repository;

import com.example.demo.entity.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {
    List<Attraction> findByCityContainingIgnoreCase(String city);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.city FROM Attraction a WHERE a.city IS NOT NULL")
    List<String> findDistinctCities();
}

