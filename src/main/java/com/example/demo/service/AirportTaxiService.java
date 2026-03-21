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

    public List<AirportTaxi> searchTaxisByAirport(String airportCode, java.time.LocalDateTime pickupTime) {
        if (pickupTime != null) {
            java.time.LocalDateTime start = pickupTime.minusHours(2);
            java.time.LocalDateTime end = pickupTime.plusHours(2);
            return airportTaxiRepository.findAvailableTaxis(airportCode, start, end);
        }
        return airportTaxiRepository.findAll().stream()
                 .filter(t -> t.getAirport() != null && t.getAirport().getCode().equalsIgnoreCase(airportCode))
                 .collect(Collectors.toList());
    }
    
    public List<AirportTaxi> getAllTaxis() {
        return airportTaxiRepository.findAll();
    }
}
