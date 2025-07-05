package com.example.backend.model;

import com.example.backend.model.abstracts.Utilisateur;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class IngenieurReseau extends Utilisateur {
    private String specialite;
    private String zoneResponsable;
    private boolean accesAvance;
}
