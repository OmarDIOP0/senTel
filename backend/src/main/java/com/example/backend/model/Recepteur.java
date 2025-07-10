package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Recepteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double sensibilite;

    private double gainReception;

    @OneToMany(mappedBy = "recepteur",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Configuration> configurations;
}
