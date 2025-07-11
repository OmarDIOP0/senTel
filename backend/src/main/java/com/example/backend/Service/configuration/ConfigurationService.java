package com.example.backend.Service.configuration;

import com.example.backend.Service.dimensionnement.DimensionnementService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.request.AttenuationConfigRequest;
import com.example.backend.request.ConfigurationRequest;
import com.example.backend.request.EmetteurConfigRequest;
import com.example.backend.request.RecepteurConfigRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConfigurationService implements IConfigurationService{
    private final ConfigurationRepo configurationRepo;
    private final EmetteurRepo emetteurRepo;
    private final RecepteurRepo recepteurRepo;
    private final ClientRepo clientRepo;
    private final ProjetRepo projetRepo;
    private final AttenuationRepo attenuationRepo;
    private final DimensionnementService dimensionnementService;
    private final AdminRepo adminRepo;

    @Override
    public Configuration creerConfiguration(ConfigurationRequest request) {
        Projet projet = projetRepo.findById(request.getProjetId())
                .orElseThrow(() -> new ResourceNotFoundException("Projet introuvable"));
        Configuration configuration = new Configuration();
        configuration.setDistance(request.getDistance());
        configuration.setBandePassante(request.getBandePassante());
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
        if (request.getClientId() != null) {
            Client client = clientRepo.findById(request.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));
            configuration.setClient(client);
        } else if (request.getAdminId() != null) {
            Administrateur admin = adminRepo.findById(request.getAdminId())
                    .orElseThrow(() -> new ResourceNotFoundException("Administrateur introuvable"));
            configuration.setAdministrateur(admin);
        } else {
            throw new IllegalArgumentException("Un client ou un administrateur doit être spécifié");
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
    public Configuration addEmetteur(Long configId, EmetteurConfigRequest request) {
        Configuration config = configurationRepo.findById(configId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuration non trouvée"));

        Emetteur emetteur = new Emetteur();
        emetteur.setPuissanceEntree(request.getPuissanceEntree());
        emetteur.setFrequence(request.getFrequence());
        emetteur.setConfiguration(config);
        config.setEmetteur(emetteurRepo.save(emetteur));
        return configurationRepo.save(config);
    }
    public Configuration addRecepteur(Long configId, RecepteurConfigRequest request) {
        Configuration config = configurationRepo.findById(configId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuration non trouvée"));

        Recepteur recepteur = new Recepteur();
        recepteur.setSensibilite(request.getSensibilite());
        recepteur.setGainReception(request.getGainReception());
        recepteur.setConfiguration(config);
        config.setRecepteur(recepteurRepo.save(recepteur));
        return configurationRepo.save(config);
    }
    @Transactional
    public Configuration addAttenuations(Long configId, List<AttenuationConfigRequest> attenuations) {
        Configuration config = configurationRepo.findById(configId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuration non trouvée"));
        config.getAttenuations().clear();

        for(AttenuationConfigRequest req: attenuations){
            Attenuation att = new Attenuation();
            att.setNomAttenuation(req.getNomAttenuation());
            att.setValeur(req.getValeur());
            att.setLongueurCable(req.getLongueurCable());
            att.setConfiguration(config);
            config.getAttenuations().add(att);
        }
        return configurationRepo.save(config);
    }

    public Rapport simulerConfiguration(Long configId) {
        Configuration config = configurationRepo.findById(configId)
                .orElseThrow(() -> new ResourceNotFoundException("Configuration non trouvée"));
        return dimensionnementService.genererRapportComplet(config);
    }

}
