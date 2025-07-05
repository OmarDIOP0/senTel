package com.example.backend.model;

import com.example.backend.model.enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
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
    private Configuration configuration;

    @ManyToOne
    @JoinColumn(name = "client_id",nullable = false)
    private Client client;
}
