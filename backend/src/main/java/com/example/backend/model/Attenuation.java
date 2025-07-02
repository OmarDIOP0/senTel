package com.example.backend.model;

import com.example.backend.model.enums.TypeAttenuation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class Attenuation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private TypeAttenuation nomAttenuation;
    private double valeur;
    private double longueurCable;
}
