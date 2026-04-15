package com.example.demo.service;

import com.example.demo.entity.Flight;
import com.example.demo.entity.ServiceType;
import com.example.demo.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightService {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private PricingService pricingService;

    public List<Flight> searchFlights(String departureCode, String arrivalCode, LocalDateTime startDate, LocalDateTime endDate) {
        List<Flight> flights = flightRepository.searchFlights(departureCode, arrivalCode, startDate, endDate);
        for (Flight f : flights) {
            f.setDynamicPrice(pricingService.calculatePrice(ServiceType.FLIGHT, f.getId(), f.getDepartureTime().toLocalDate(), f.getPrice()));
        }
        return flights;
    }

    public List<Flight> getAllFlights() {
        List<Flight> flights = flightRepository.findAll();
        for (Flight f : flights) {
            f.setDynamicPrice(pricingService.calculatePrice(ServiceType.FLIGHT, f.getId(), f.getDepartureTime().toLocalDate(), f.getPrice()));
        }
        return flights;
    }
}
