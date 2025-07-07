package com.example.backend.Service.dimensionnement;

import com.example.backend.model.Rapport;
import com.example.backend.request.ConfigurationRequest;

public interface IDimensionnementService {
    Rapport calculerBilanLiaison5G(ConfigurationRequest request);
    Double calculerPuissanceRecue(ConfigurationRequest request);
    Double calculerPertePropagation(ConfigurationRequest request);
    Double calculerPerteAttenuation(ConfigurationRequest request);
    Double calculerMargeLiaison(ConfigurationRequest request);
    Rapport getRapport(Long id);
}
