package com.example.demo.service;

import com.example.demo.entity.Car;
import com.example.demo.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    public List<Car> searchCars(String pickupCity, String dropoffCity, LocalDateTime pickupTime, LocalDateTime dropoffTime) {
         return carRepository.findAvailableCars(pickupCity, pickupTime, dropoffTime);
    }
    
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }
}
