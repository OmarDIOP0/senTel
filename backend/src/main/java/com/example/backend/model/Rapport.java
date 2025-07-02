package com.example.backend.model;

import com.example.backend.model.enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    private double notePerformance;
    private double puissanceRecu;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String conclusion;

}
