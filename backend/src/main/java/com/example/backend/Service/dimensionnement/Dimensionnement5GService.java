package com.example.backend.Service.dimensionnement;

import com.example.backend.model.*;
import com.example.backend.model.enums.Status;
import com.example.backend.repository.*;
import com.example.backend.request.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class Dimensionnement5GService implements IDimensionnementService {

    private final ConfigurationRepo configurationRepo;
    private final RapportRepo rapportRepo;
    private final NotificationRepo notificationRepo;
    private final EmetteurRepo emetteurRepo;
    private final RecepteurRepo recepteurRepo;
    private final ClientRepo clientRepo;
    private final ProjetRepo projetRepo;

    private static final double BOLTZMANN_CONSTANT = -228.6; // dBW/Hz/K
    private static final double TEMPERATURE_NOISE = 290; // Kelvin

    @Override
    @Transactional
    public Rapport genererRapportComplet(ConfigurationRequest request) {
        // Récupération des entités complètes
        Emetteur emetteur = emetteurRepo.findById(request.getEmetteurId())
                .orElseThrow(() -> new IllegalArgumentException("Émetteur non trouvé"));
        Recepteur recepteur = recepteurRepo.findById(request.getRecepteurId())
                .orElseThrow(() -> new IllegalArgumentException("Récepteur non trouvé"));
        Client client = clientRepo.findById(request.getClientId())
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé"));
        Projet projet = projetRepo.findById(request.getProjetId())
                .orElseThrow(() -> new IllegalArgumentException("Projet non trouvé"));

        // Calculs techniques
        PuissanceDetaillee puissanceDetail = calculerPuissanceRecue(emetteur, recepteur, request.getDistance());
        MargeResult marge = calculerMargeLiaison(recepteur, puissanceDetail.puissanceRecue());
        double debit = estimerDebit5G(emetteur, recepteur, request.getBandePassante());
        double latence = estimerLatence5G(request.getDistance());
        double snr = calculerSNR(puissanceDetail.puissanceRecue(), request.getBandePassante());

        // Création et sauvegarde de la configuration
        Configuration configuration = new Configuration();
        configuration.setDistance(request.getDistance());
        configuration.setBandePassante(request.getBandePassante());
        configuration.setEmetteur(emetteur);
        configuration.setRecepteur(recepteur);
        configuration.setClient(client);
        configuration.setProjet(projet);
        Configuration savedConfig = configurationRepo.save(configuration);

        // Création du rapport
        Rapport rapport = new Rapport();
        rapport.setDate(LocalDateTime.now());
        rapport.setPuissanceRecu(puissanceDetail.puissanceRecue());
        rapport.setMargeLiaison(marge.marge());
        rapport.setDebitEstime(debit);
        rapport.setLatenceEstimee(latence);
        // rapport.setSnr(snr);
        rapport.setNotePerformance(calculerScorePerformance(marge.marge(), debit, latence));
        // rapport.setNiveauQualite(marge.niveauQualite());
        rapport.setConclusion(genererDetailsCalcul(puissanceDetail, marge, debit, latence));
        rapport.setConfiguration(savedConfig);

        Rapport savedRapport = rapportRepo.save(rapport);

        // Création de la notification
        creerNotification(client, savedConfig, savedRapport);

        return savedRapport;
    }

    @Override
    public PuissanceDetaillee calculerPuissanceRecue(Emetteur emetteur, Recepteur recepteur, double distance) {
        double pertePropagation = calculerPertePropagation(emetteur.getFrequence(), distance);
        double perteAttenuation = 0; // À remplacer si vous avez des données d'atténuation

        double puissanceRecue = emetteur.getPuissanceEntree()
                + emetteur.getPuissanceEntree()
                + recepteur.getGainReception()
                - pertePropagation
                - perteAttenuation;

        return new PuissanceDetaillee(
                emetteur.getPuissanceEntree(),
                emetteur.getFrequence(),
                recepteur.getGainReception(),
                pertePropagation,
                perteAttenuation,
                puissanceRecue
        );
    }

    @Override
    public double calculerPertePropagation(double frequence, double distance) {
        double distanceKm = distance / 1000;
        double frequenceMHz = frequence;

        return 20 * Math.log10(distanceKm) + 20 * Math.log10(frequenceMHz) + 92.45;
    }

    @Override
    public MargeResult calculerMargeLiaison(Recepteur recepteur, double puissanceRecue) {
        double sensibilite = recepteur.getSensibilite();
        double marge = puissanceRecue - sensibilite;

        String niveauQualite;
        if (marge > 15) {
            niveauQualite = "Excellent";
        } else if (marge > 8) {
            niveauQualite = "Bon";
        } else if (marge > 3) {
            niveauQualite = "Acceptable";
        } else if (marge > 0) {
            niveauQualite = "Marginal";
        } else {
            niveauQualite = "Inacceptable";
        }

        return new MargeResult(marge, sensibilite, niveauQualite);
    }

    private double estimerDebit5G(Emetteur emetteur, Recepteur recepteur, double bandePassante) {
        // Formule simplifiée prenant en compte la bande passante
        double efficaciteSpectrale = 5.0; // bps/Hz (dépend de la modulation)
        return bandePassante * efficaciteSpectrale;
    }

    private double estimerLatence5G(double distance) {
        // Estimation basique de la latence 5G
        double latenceBase = 2.0; // ms
        double facteurDistance = distance / 1000 * 0.01; // 0.01ms/km
        return latenceBase + facteurDistance;
    }

    private double calculerSNR(double puissanceRecue, double bandePassante) {
        // Bruit thermique = kTB
        double bruitThermique = BOLTZMANN_CONSTANT
                + 10 * Math.log10(bandePassante * 1e6)
                + 10 * Math.log10(TEMPERATURE_NOISE);

        return puissanceRecue - bruitThermique;
    }

    private double calculerScorePerformance(double marge, double debit, double latence) {
        // Formule de scoring personnalisée (à adapter)
        return (marge * 0.4) + (debit * 0.4) + ((100 - latence) * 0.2);
    }

    private String genererDetailsCalcul(PuissanceDetaillee puissance, MargeResult marge, double debit, double latence) {
        return String.format("""
            Détails du calcul:
            - Puissance émission: %.2f dBm
            - Gain émission: %.2f dBi
            - Gain réception: %.2f dBi
            - Pertes propagation: %.2f dB
            - Pertes atténuation: %.2f dB
            - Puissance reçue: %.2f dBm
            - Marge de liaison: %.2f dB (%s)
            - Débit estimé: %.2f Mbps
            - Latence estimée: %.2f ms
            """,
                puissance.puissanceEmission(),
                puissance.gainEmission(),
                puissance.gainReception(),
                puissance.pertePropagation(),
                puissance.perteAttenuation(),
                puissance.puissanceRecue(),
                marge.marge(),
                marge.niveauQualite(),
                debit,
                latence);
    }

    private void creerNotification(Client client, Configuration config, Rapport rapport) {
        Notification notification = new Notification();
        notification.setLibelle("Rapport de dimensionnement 5G");
        notification.setDescription(String.format(
                "Nouveau rapport généré - Marge: %.2f dB (%s)",
                rapport.getMargeLiaison(),
                rapport.getNiveauQualite()
        ));
        notification.setDate(LocalDateTime.now());
        notification.setStatus(rapport.getMargeLiaison() > 0 ? Status.CONFIRME : Status.EN_ATTENTE);
        notification.setClient(client);
        notification.setConfiguration(config);

        notificationRepo.save(notification);
    }

    @Override
    public Rapport getRapport(Long id) {
        return rapportRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rapport non trouvé"));
    }

    // Records pour les résultats intermédiaires
    public record PuissanceDetaillee(
            double puissanceEmission,
            double gainEmission,
            double gainReception,
            double pertePropagation,
            double perteAttenuation,
            double puissanceRecue
    ) {}

    public record MargeResult(
            double marge,
            double seuilSensibilite,
            String niveauQualite
    ) {}
}