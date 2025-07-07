package com.example.backend.Service.dimensionnement;

import com.example.backend.Service.rapport.RapportService;
import com.example.backend.model.Configuration;
import com.example.backend.model.Emetteur;
import com.example.backend.model.Rapport;
import com.example.backend.model.Recepteur;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.repository.NotificationRepo;
import com.example.backend.repository.RapportRepo;
import com.example.backend.request.ConfigurationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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


}
