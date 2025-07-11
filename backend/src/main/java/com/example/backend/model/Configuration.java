package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
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
    private List<Attenuation> attenuations = new ArrayList<>();

    @OneToOne(mappedBy = "configuration", cascade = CascadeType.ALL, orphanRemoval = true)
    private Notification notification;

    @OneToOne(optional = true, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "emetteur_id")
    private Emetteur emetteur;

    @OneToOne(optional = true, cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "recepteur_id")
    private Recepteur recepteur;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true)
    @JsonIgnore
    private Client client;

    @ManyToOne
    @JoinColumn(name = "projet_id", nullable = false)
    @JsonIgnore
    private Projet projet;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = true)
    @JsonIgnore
    private Administrateur administrateur;

}
