package com.example.backend.Service.dimensionnement;

import com.example.backend.Service.dimensionnement.IDimensionnementService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.model.enums.Status;
import com.example.backend.repository.*;
import com.example.backend.request.ConfigurationRequest;
import com.example.backend.request.RapportConfRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DimensionnementService implements IDimensionnementService {
    private final ConfigurationRepo configurationRepo;
    private final RapportRepo rapportRepo;
    private final NotificationRepo notificationRepo;
    private final AdminRepo adminRepo;
    private final ClientRepo clientRepo;

    @Override
    public Rapport genererRapportComplet(RapportConfRequest request) {
        Configuration config = configurationRepo.findById(request.getConfigurationId())
                .orElseThrow(() -> new RuntimeException("Configuration introuvable avec ID: " + request.getConfigurationId()));


        Rapport rapport = rapportRepo.findByConfiguration(config).orElse(new Rapport());

        rapport.setConfiguration(config);
        rapport.setDate(LocalDateTime.now());

        // Calculs techniques
        double puissanceRecue = calculerPuissanceRecue(config);
        double marge = calculerMargeLiaison(config, puissanceRecue);
        double debit = estimerDebit5G(config);
        double latence = estimerLatence5G(config);

        rapport.setPuissanceRecu(puissanceRecue);
        rapport.setMargeLiaison(marge);
        rapport.setDebitEstime(debit);
        rapport.setLatenceEstimee(latence);
        rapport.setNotePerformance(calculerScorePerformance(marge, debit, latence));
        rapport.determineStatus();
        rapport.setConclusion(genererConclusion(rapport.getStatus()));

        rapportRepo.save(rapport);

        // Création de la notification
        Notification notif = new Notification();
        notif.setLibelle("Nouveau rapport généré");
        notif.setDescription("Le rapport de la configuration #" + config.getId() + " a été généré.");
        notif.setDate(LocalDateTime.now());
        notif.setStatus(rapport.getStatus());
        notif.setConfiguration(config);

        if (request.getClientId() != null) {
            Client client = clientRepo.findById(request.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec ID: " + request.getClientId()));
            notif.setClient(client);
        } else if (request.getAdminId() != null) {
            Administrateur admin = adminRepo.findById(request.getAdminId())
                    .orElseThrow(() -> new ResourceNotFoundException("Administrateur introuvable avec ID: " + request.getAdminId()));
            notif.setAdministrateur(admin);
        } else {
            throw new IllegalArgumentException("Un client ou un administrateur doit être spécifié");
        }

        notificationRepo.save(notif);
        return rapport;
    }



    @Override
    public double calculerPuissanceRecue(Configuration config) {
        Emetteur emetteur = config.getEmetteur();
        Recepteur recepteur = config.getRecepteur();

        return emetteur.getPuissanceEntree()
                + recepteur.getGainReception()
                - calculerPertePropagation(config)
                - calculerPerteAttenuation(config);
    }

    @Override
    public double calculerPertePropagation(Configuration config) {
        double distance = config.getDistance();
        double frequence = config.getEmetteur().getFrequence();

        return 20 * Math.log10(distance) + 20 * Math.log10(frequence) + 32.44;
    }

    @Override
    public double calculerPerteAttenuation(Configuration config) {
        return config.getAttenuations().stream()
                .mapToDouble(a -> a.getValeur() * a.getLongueurCable())
                .sum();
    }

    @Override
    public double calculerMargeLiaison(Configuration config, double puissanceRecue) {
        return puissanceRecue - config.getRecepteur().getSensibilite();
    }

    private double estimerDebit5G(Configuration config) {
        double bandePassante = config.getBandePassante() * 1e6; // MHz to Hz
        double snr = 20; // valeur estimée ou déduite dans une version avancée
        double snrLinear = Math.pow(10, snr / 10);
        return bandePassante * (Math.log(1 + snrLinear) / Math.log(2));
    }

    private double estimerLatence5G(Configuration config) {
        return 1 + (config.getDistance() / 300000.0) * 1000; // propagation simplifiée (ms)
    }

    private double calculerScorePerformance(double marge, double debit, double latence) {
        double normalisedMarge = Math.min(marge / 20.0, 1.0);
        double normalisedDebit = Math.min(debit / 1e9, 1.0);
        double normalisedLatence = Math.max(0, 1.0 - latence / 10.0);
        return (normalisedMarge + normalisedDebit + normalisedLatence) / 3.0 * 100;
    }

    private String genererConclusion(Status status) {
        return switch (status) {
            case EXCELLENT -> "La liaison présente des performances excellentes pour la 5G";
            case BON -> "La liaison est de bonne qualité pour les applications 5G";
            case MOYEN -> "La liaison est acceptable mais pourrait nécessiter des optimisations";
            default -> "La liaison ne répond pas aux exigences minimales pour la 5G";
        };
    }

    @Override
    public Rapport getRapport(Long id) {
        return rapportRepo.findById(id).orElse(null);
    }

    @Override
    public List<Rapport> getAllRapports() {
        return rapportRepo.findAll();
    }

    @Override
    public void deleteRapport(Long id) {
        if (!rapportRepo.existsById(id)) {
            throw new IllegalArgumentException("Rapport non trouvé avec ID: " + id);
        }
        rapportRepo.deleteById(id);
    }

    @Override
    public Rapport updateRapport(Long id, Configuration request) {
        Rapport existing = rapportRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rapport non trouvé avec ID: " + id));

        Optional<Configuration> configOpt = configurationRepo.findById(request.getId());
        if (configOpt.isEmpty()) {
            throw new RuntimeException("Configuration introuvable avec ID: " + request.getId());
        }
        Configuration config = configOpt.get();

        double puissanceRecue = calculerPuissanceRecue(config);
        double marge = calculerMargeLiaison(config, puissanceRecue);
        double debit = estimerDebit5G(config);
        double latence = estimerLatence5G(config);

        existing.setConfiguration(config);
        existing.setPuissanceRecu(puissanceRecue);
        existing.setMargeLiaison(marge);
        existing.setDebitEstime(debit);
        existing.setLatenceEstimee(latence);
        existing.setNotePerformance(calculerScorePerformance(marge, debit, latence));
        existing.setDate(LocalDateTime.now());
        existing.determineStatus();
        existing.setConclusion(genererConclusion(existing.getStatus()));

        return rapportRepo.save(existing);
    }
}
