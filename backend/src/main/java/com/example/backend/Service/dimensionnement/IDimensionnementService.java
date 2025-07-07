package com.example.backend.Service.dimensionnement;

import com.example.backend.model.Rapport;
import com.example.backend.request.ConfigurationRequest;

public interface IDimensionnementService {
    Rapport genererRapportComplet(ConfigurationRequest request);
   // Rapport calculerBilanLiaison5G(ConfigurationRequest request);
    Double calculerPuissanceRecue(ConfigurationRequest request);
    Double calculerPertePropagation(ConfigurationRequest request);
    Double calculerPerteAttenuation(ConfigurationRequest request);
    Double calculerMargeLiaison(ConfigurationRequest request,double puissanceRecue);
    Rapport getRapport(Long id);

}
