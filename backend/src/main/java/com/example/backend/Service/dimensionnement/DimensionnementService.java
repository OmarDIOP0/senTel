package com.example.backend.Service.dimensionnement;

import com.example.backend.Service.rapport.RapportService;
import com.example.backend.model.Rapport;
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
    public Rapport calculerBilanLiaison5G(ConfigurationRequest request) {
        // 1. Calcul de la puissance reçue
        double puissanceRecue = calculerPuissanceRecue(config);

        // 2. Calcul de la marge de liaison
        double marge = calculerMargeLiaison(config, puissanceRecue);

        // 3. Vérification de la faisabilité
        boolean faisable = marge > 0;

        // 4. Création du rapport
        Rapport rapport = new Rapport();

        rapport.setPuissanceRecue(puissanceRecue);
        rapport.setMargeLiaison(marge);
        rapport.setFaisable(faisable);
        rapport.setConfiguration(config);

        return rapport;
    }

    @Override
    public Double calculerPuissanceRecue(ConfigurationRequest request) {
        return 0.0;
    }

    @Override
    public Double calculerPertePropagation(ConfigurationRequest request) {
        return 0.0;
    }

    @Override
    public Double calculerPerteAttenuation(ConfigurationRequest request) {
        return 0.0;
    }

    @Override
    public Double calculerMargeLiaison(ConfigurationRequest request) {
        return 0.0;
    }

    @Override
    public Rapport getRapport(Long id) {
        return null;
    }
}
