package com.example.backend.Service.configuration;

import com.example.backend.model.Configuration;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.request.ConfigurationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConfigurationService implements IConfigurationService{
    private final ConfigurationRepo configurationRepo;
    @Override
    public Configuration creerConfiguration(ConfigurationRequest request) {
        Configuration configuration = new Configuration();
        configuration.setDistance(request.getDistance());
        configuration.setBandePassante(request.getBandePassante());
        return configurationRepo.save(configuration);
    }

    @Override
    public Configuration modifierConfiguration(ConfigurationRequest request, Long id) {
        Configuration existingConfig = configurationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Le configuration n'existe pas"));
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
