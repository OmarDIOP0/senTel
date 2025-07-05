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
public class Client extends Utilisateur {
    private String entreprise; // s’il s'agit d’un client pro
    private String profilUsage; // Exemple : "Mobile", "IoT", "Streaming"
    private String scenarioPredefini;
}
