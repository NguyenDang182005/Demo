package com.example.demo.repository;

import com.example.demo.entity.DynamicPrice;
import com.example.demo.entity.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DynamicPriceRepository extends JpaRepository<DynamicPrice, Long> {
    Optional<DynamicPrice> findByServiceTypeAndServiceIdAndTargetDate(ServiceType serviceType, Long serviceId, LocalDate targetDate);
}
