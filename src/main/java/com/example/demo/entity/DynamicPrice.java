package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "dynamic_prices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DynamicPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "dynamic_price")
    private BigDecimal dynamicPrice;

    @Column(name = "multiplier")
    private BigDecimal multiplier;
}
