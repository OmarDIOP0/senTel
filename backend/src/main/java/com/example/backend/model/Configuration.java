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
public class Configuration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double distance;

    private double bandePassante;

    @OneToOne(mappedBy = "configuration", cascade = CascadeType.ALL, orphanRemoval = true)
    private Rapport rapport;

    @OneToMany(mappedBy = "configuration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attenuation> attenuations;

    @OneToOne(mappedBy = "configuration", cascade = CascadeType.ALL, orphanRemoval = true)
    private Notification notification;

    @OneToOne(mappedBy = "configuration", cascade = CascadeType.ALL, orphanRemoval = true)
    private Emetteur emetteur;

    @OneToOne(mappedBy = "configuration", cascade = CascadeType.ALL, orphanRemoval = true)
    private Recepteur recepteur;
}
