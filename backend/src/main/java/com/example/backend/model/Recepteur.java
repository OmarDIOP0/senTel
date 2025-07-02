package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class Recepteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double sensibilite;

    private double gainReception;

    @OneToOne
    @JoinColumn(name = "configuration_id", nullable = false, unique = true)
    private Configuration configuration;
}
