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

    @ManyToOne
    @JoinColumn(name = "emetteur_id",nullable = false)
    private Emetteur emetteur;

    @ManyToOne
    @JoinColumn(name = "recepteur_id",nullable = false)
    private Recepteur recepteur;

    @ManyToOne
    @JoinColumn(name = "client_id",nullable = false)
    private Client client;
}
