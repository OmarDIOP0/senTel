package com.example.backend.Service.dimensionnement;

import com.example.backend.Service.rapport.RapportService;
import com.example.backend.model.*;
import com.example.backend.model.enums.Status;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.repository.NotificationRepo;
import com.example.backend.repository.RapportRepo;
import com.example.backend.request.ConfigurationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DimensionnementService implements IDimensionnementService {
    private final ConfigurationRepo configurationRepo;
    private final RapportRepo rapportRepo;
    private final NotificationRepo notificationRepo;

    @Override
    public Rapport genererRapportComplet(ConfigurationRequest request) {
        Rapport rapport = new Rapport();

        // Calculs techniques
        double puissanceRecue = calculerPuissanceRecue(request);
        double marge = calculerMargeLiaison5G(request, puissanceRecue);
        double debit = estimerDebit5G(config);
        double latence = estimerLatence5G(config);

        // Remplissage du rapport
        rapport.setPuissanceRecu(puissanceRecue);
        rapport.setMargeLiaison(marge);
        rapport.setDebitEstime(debit);
        rapport.setLatenceEstimee(latence);
        rapport.setNotePerformance(calculerScorePerformance(marge, debit, latence));
        rapport.determineStatus();
        rapport.setConclusion(genererConclusion(rapport.getStatus()));

        Notification notif = new Notification();
        notif.setLibelle("Nouveau rapport généré");
        notif.setDescription("Le rapport de la configuration #" + request() + " a été généré.");
        notif.setDate(LocalDateTime.now());
        notif.setStatus(pr > request.getRecepteur().getSensibilite() ? Status.CONFIRME : Status.EN_ATTENTE);
        notif.setClient(config.getClient());
        notif.setConfiguration(config);
        notificationRepository.save(notif);

        return rapport;
    }

    @Override
    public Double calculerPuissanceRecue(ConfigurationRequest request) {
        Emetteur emetteur = request.getEmetteur();
        Recepteur recepteur = request.getRecepteur();

        return emetteur.getPuissanceEntree()
                + emetteur.getFrequence()
                + recepteur.getGainReception()
                - calculerPertePropagation(request)
                - calculerPerteAttenuation(request);
    }

    @Override
    public Double calculerPertePropagation(ConfigurationRequest request) {
        double distance = request.getDistance();
        double frequence = request.getEmetteur().getFrequence();

        return 20 * Math.log10(distance) + 20 * Math.log10(frequence) + 92.45;
    }

    @Override
    public Double calculerPerteAttenuation(ConfigurationRequest request) {
        return request.getAttenuations().stream()
                .mapToDouble(a -> a.getValeur() * a.getLongueurCable())
                .sum();
    }

    @Override
    public Double calculerMargeLiaison(ConfigurationRequest request,double puissanceRecue) {
        return puissanceRecue - request.getRecepteur().getSensibilite();
    }

    @Override
    public Rapport getRapport(Long id) {
        return null;
    }
    private String genererConclusion(Status status) {
        return switch (status) {
            case EXCELLENT -> "La liaison présente des performances excellentes pour la 5G";
            case BON -> "La liaison est de bonne qualité pour les applications 5G";
            case MOYEN -> "La liaison est acceptable mais pourrait nécessiter des optimisations";
            default -> "La liaison ne répond pas aux exigences minimales pour la 5G";
        };
    }


}
