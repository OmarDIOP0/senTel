package com.example.backend.model;

import com.example.backend.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String libelle;

    private String description;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    @JoinColumn(name = "configuration_id", nullable = false)
    @JsonIgnore
    private Configuration configuration;

    @ManyToOne
    @JoinColumn(name = "client_id",nullable = true)
    @JsonIgnore
    private Client client;

    @ManyToOne
    @JoinColumn(name = "admin_id",nullable = true)
    @JsonIgnore
    private Administrateur administrateur;

}
