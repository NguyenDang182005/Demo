package com.example.demo.service;

import com.example.demo.entity.DynamicPrice;
import com.example.demo.entity.ServiceType;
import com.example.demo.repository.DynamicPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class PricingService {

    @Autowired
    private DynamicPriceRepository dynamicPriceRepository;

    public BigDecimal calculatePrice(ServiceType type, Long serviceId, LocalDate targetDate, BigDecimal basePrice) {
        if (basePrice == null) {
            basePrice = BigDecimal.ZERO;
        }

        Optional<DynamicPrice> dpOpt = dynamicPriceRepository.findByServiceTypeAndServiceIdAndTargetDate(type, serviceId, targetDate);
        if (dpOpt.isPresent()) {
            DynamicPrice dp = dpOpt.get();
            if (dp.getDynamicPrice() != null) {
                return dp.getDynamicPrice();
            } else if (dp.getMultiplier() != null) {
                return basePrice.multiply(dp.getMultiplier());
            }
        }
        return basePrice;
    }
}
