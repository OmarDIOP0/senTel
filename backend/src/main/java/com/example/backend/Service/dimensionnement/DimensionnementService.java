package com.example.backend.Service.dimensionnement;

import com.example.backend.model.Rapport;
import com.example.backend.request.ConfigurationRequest;

public class DimensionnementService implements IDimensionnementService {
    @Override
    public Rapport calculerBilanLiaison5G(ConfigurationRequest request) {
        return null;
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
