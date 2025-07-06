package com.example.backend.Service.configuration;


import com.example.backend.model.Configuration;
import com.example.backend.request.ConfigurationRequest;

import java.util.List;
import java.util.Optional;

public interface IConfigurationService {
    Configuration creerConfiguration(ConfigurationRequest request);
    Configuration modifierConfiguration(ConfigurationRequest request , Long id);
    Configuration getConfiguration(Long id);
    void supprimerConfiguration(Long id);
    List<Configuration> getConfigurations();
    List<Configuration> getConfigurationByProjet(Long projetId);
}
