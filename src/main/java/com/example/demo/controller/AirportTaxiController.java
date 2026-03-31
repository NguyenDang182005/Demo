package com.example.demo.controller;

import com.example.demo.entity.AirportTaxi;
import com.example.demo.service.AirportTaxiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airport-taxis")
@CrossOrigin(origins = "*")
public class AirportTaxiController {

    @Autowired
    private AirportTaxiService airportTaxiService;

    @GetMapping
    public List<AirportTaxi> getAllTaxis() {
        return airportTaxiService.getAllTaxis();
    }

    @GetMapping("/search")
    public List<AirportTaxi> searchTaxis(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String airportCode,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime pickupTime) {
        return airportTaxiService.searchTaxis(city, airportCode, pickupTime);
    }
}
