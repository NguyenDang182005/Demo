package com.example.demo.service;

import com.example.demo.entity.Flight;
import com.example.demo.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    public List<Flight> searchFlights(String departureCode, String arrivalCode, LocalDateTime startDate, LocalDateTime endDate) {
        return flightRepository.searchFlights(departureCode, arrivalCode, startDate, endDate);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
}
