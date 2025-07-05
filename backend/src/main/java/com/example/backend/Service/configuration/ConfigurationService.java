package com.example.backend.Service.configuration;

import com.example.backend.Service.emetteur.EmetteurService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Client;
import com.example.backend.model.Configuration;
import com.example.backend.model.Emetteur;
import com.example.backend.model.Recepteur;
import com.example.backend.repository.ClientRepo;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.repository.EmetteurRepo;
import com.example.backend.repository.RecepteurRepo;
import com.example.backend.request.ConfigurationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfigurationService implements IConfigurationService{
    private final ConfigurationRepo configurationRepo;
    private final EmetteurRepo emetteurRepo;
    private final RecepteurRepo recepteurRepo;
    private final ClientRepo clientRepo;

    @Override
    public Configuration creerConfiguration(ConfigurationRequest request) {
        Emetteur emetteur = emetteurRepo.findById(request.getEmetteurId())
                .orElseThrow(() -> new ResourceNotFoundException("Émetteur introuvable"));
        Recepteur recepteur = recepteurRepo.findById(request.getRecepteurId())
                .orElseThrow(() -> new ResourceNotFoundException("Récepteur introuvable"));
        Client client = clientRepo.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));
        Configuration configuration = new Configuration();
        configuration.setDistance(request.getDistance());
        configuration.setBandePassante(request.getBandePassante());
        configuration.setEmetteur(emetteur);
        configuration.setRecepteur(recepteur);
        configuration.setClient(client);
        return configurationRepo.save(configuration);
    }

    @Override
    public Configuration modifierConfiguration(ConfigurationRequest request, Long id) {
        Configuration existingConfig = configurationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("La configuration n'existe pas"));
        existingConfig.setDistance(request.getDistance());
        existingConfig.setBandePassante(request.getBandePassante());
        return configurationRepo.save(existingConfig);
    }


    @Override
    public Configuration getConfiguration(Long id) {
        return configurationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuration Introuvable"));
    }

    @Override
    public void supprimerConfiguration(Long id) {
        Configuration config = configurationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuration Introuvable"));

        configurationRepo.delete(config);
    }
}
