package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class Emetteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double puissanceEntree;

    private double frequence;

    @OneToOne
    @JoinColumn(name = "configuration_id", nullable = false, unique = true)
    private Configuration configuration;
}
