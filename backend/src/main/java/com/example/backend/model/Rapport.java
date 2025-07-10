package com.example.backend.model;

import com.example.backend.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    private double notePerformance;

    private double puissanceRecu;

    private double margeLiaison;

    private double debitEstime;

    private double latenceEstimee;

    private String niveauQualite;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(length = 2000)
    private String conclusion;

    @OneToOne
    @JoinColumn(name = "configuration_id", nullable = false)
    private Configuration configuration;

    public void determineStatus() {
        if (margeLiaison > 10) {
            this.status = Status.EXCELLENT;
        } else if (margeLiaison > 5) {
            this.status = Status.BON;
        } else if (margeLiaison > 0) {
            this.status = Status.MOYEN;
        } else {
            this.status = Status.INSUFFISANT;
        }
    }
}
