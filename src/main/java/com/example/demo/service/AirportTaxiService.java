package com.example.demo.service;

import com.example.demo.entity.AirportTaxi;
import com.example.demo.repository.AirportTaxiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirportTaxiService {
    @Autowired
    private AirportTaxiRepository airportTaxiRepository;

    public List<AirportTaxi> searchTaxis(String city, String airportCode, java.time.LocalDateTime pickupTime) {
        java.time.LocalDateTime start = null;
        java.time.LocalDateTime end = null;
        
        if (pickupTime != null) {
            start = pickupTime.minusHours(2);
            end = pickupTime.plusHours(2);
        } else {
            // Default window if no time provided, to reuse the query logic
            start = java.time.LocalDateTime.now().minusYears(100); 
            end = java.time.LocalDateTime.now().plusYears(100);
        }

        if (city != null && !city.isEmpty()) {
            return airportTaxiRepository.findAvailableTaxisByCity(city, start, end);
        } else if (airportCode != null && !airportCode.isEmpty()) {
            return airportTaxiRepository.findAvailableTaxis(airportCode, start, end);
        }
        
        return airportTaxiRepository.findAll();
    }
    
    public List<AirportTaxi> getAllTaxis() {
        return airportTaxiRepository.findAll();
    }
}
