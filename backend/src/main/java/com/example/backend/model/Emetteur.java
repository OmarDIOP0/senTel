package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

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

    @OneToMany(mappedBy = "emetteur",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Configuration> configurations;

}
