package com.example.backend.model;

import com.example.backend.model.abstracts.Utilisateur;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

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

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Configuration> configurations;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Notification> notifications;
}
