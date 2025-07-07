package com.example.backend.Service.dimensionnement;

import com.example.backend.model.Emetteur;
import com.example.backend.model.Rapport;
import com.example.backend.model.Recepteur;
import com.example.backend.request.ConfigurationRequest;

public interface IDimensionnementService {
    Rapport genererRapportComplet(ConfigurationRequest request);
    Dimensionnement5GService.PuissanceDetaillee calculerPuissanceRecue(Emetteur emetteur, Recepteur recepteur, double distance);
    double calculerPertePropagation(double frequence, double distance);
    Dimensionnement5GService.MargeResult calculerMargeLiaison(Recepteur recepteur, double puissanceRecue);
    Rapport getRapport(Long id);

}
