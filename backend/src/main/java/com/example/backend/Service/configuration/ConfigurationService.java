package com.example.backend.Service.configuration;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.request.ConfigurationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConfigurationService implements IConfigurationService{
    private final ConfigurationRepo configurationRepo;
    private final EmetteurRepo emetteurRepo;
    private final RecepteurRepo recepteurRepo;
    private final ClientRepo clientRepo;
    private final ProjetRepo projetRepo;

    @Override
    public Configuration creerConfiguration(ConfigurationRequest request) {
        Client client = clientRepo.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));
        Projet projet = projetRepo.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet introuvable"));
        Configuration configuration = new Configuration();
        configuration.setDistance(request.getDistance());
        configuration.setBandePassante(request.getBandePassante());
        configuration.setClient(client);
        configuration.setProjet(projet);
        if (request.getEmetteurId() != null) {
            Emetteur emetteur = emetteurRepo.findById(request.getEmetteurId())
                    .orElseThrow(() -> new ResourceNotFoundException("Émetteur introuvable"));
            configuration.setEmetteur(emetteur);
        }

        if (request.getRecepteurId() != null) {
            Recepteur recepteur = recepteurRepo.findById(request.getRecepteurId())
                    .orElseThrow(() -> new ResourceNotFoundException("Récepteur introuvable"));
            configuration.setRecepteur(recepteur);
        }
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

    @Override
    public List<Configuration> getConfigurations() {
        return configurationRepo.findAll();
    }

    @Override
    public List<Configuration> getConfigurationByProjet(Long projetId) {
        return configurationRepo.findByProjetId(projetId);
    }

}
