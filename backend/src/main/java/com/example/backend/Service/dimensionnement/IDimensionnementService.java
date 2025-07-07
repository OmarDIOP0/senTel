package com.example.backend.Service.dimensionnement;

import com.example.backend.model.Configuration;
import com.example.backend.model.Emetteur;
import com.example.backend.model.Rapport;
import com.example.backend.model.Recepteur;
import com.example.backend.request.ConfigurationRequest;

import java.util.List;

public interface IDimensionnementService {
    Rapport genererRapportComplet(Configuration request);
    double calculerPuissanceRecue(Configuration request);
    double calculerPertePropagation(Configuration request);

    double calculerPerteAttenuation(Configuration config);

    double calculerMargeLiaison(Configuration config, double puissanceRecue);

    Rapport getRapport(Long id);

    List<Rapport> getAllRapports();

    void deleteRapport(Long id);

    Rapport updateRapport(Long id, Configuration request);
}
