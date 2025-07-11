package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
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

    @OneToOne(optional = true, cascade = CascadeType.ALL)
    @JoinColumn(name = "emetteur_id")
    private Emetteur emetteur;

    @OneToOne(optional = true, cascade = CascadeType.ALL)
    @JoinColumn(name = "recepteur_id")
    private Recepteur recepteur;

    @ManyToOne
    @JoinColumn(name = "client_id",nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "projet_id", nullable = false)
    private Projet projet;

}
