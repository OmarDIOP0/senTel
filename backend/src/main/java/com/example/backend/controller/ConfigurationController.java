package com.example.backend.controller;

import com.example.backend.Service.configuration.ConfigurationService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Configuration;
import com.example.backend.model.Rapport;
import com.example.backend.request.*;
import com.example.backend.response.ApiResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("${api.prefix}/configuration")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowedHeaders = "*",
        allowCredentials = "true")
public class ConfigurationController {

    private final ConfigurationService configurationService;

    @GetMapping
    public ResponseEntity<ApiResponse> getConfiguration() {
        try{
            List<Configuration> configs = configurationService.getConfigurations();
            return  ResponseEntity.status(HttpStatus.OK).body(
                    new ApiResponse(
                            true,
                            "Liste des configurations",
                            configs
                    )
            );
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Erreur lors de la création de la configuration",
                    e.getMessage()
            ));
        }
    }
    @GetMapping("/projet")
    public ResponseEntity<ApiResponse> getConfigurations() {
        try{
            List<Map<String, Object>> configs = configurationService.getConfigurationsWithProjetName();
            return  ResponseEntity.status(HttpStatus.OK).body(
                    new ApiResponse(
                            true,
                            "Liste des configurations:",
                            configs
                    )
            );
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Erreur lors de la création de la configuration",
                    e.getMessage()
            ));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createConfiguration(@RequestBody ConfigurationRequest request) {
        try {
                Configuration configuration = configurationService.creerConfiguration(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(
                        true,
                        "Configuration créée avec succès",
                        configuration
                ));
            } catch (ResourceNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                        false,
                        e.getMessage(),
                        null
                ));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                        false,
                        "Erreur lors de la création de la configuration",
                        e.getMessage()
                ));
            }
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse> updateConfiguration(@PathVariable Long id, @RequestBody ConfigurationRequest request) {
        try {
            Configuration updated = configurationService.modifierConfiguration(request, id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Configuration mise à jour avec succès",
                    updated
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Erreur lors de la mise à jour",
                    e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getConfiguration(@PathVariable Long id) {
        try {
            Configuration config = configurationService.getConfiguration(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Configuration trouvée",
                    config
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteConfiguration(@PathVariable Long id) {
        try {
            configurationService.supprimerConfiguration(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Configuration supprimée avec succès",
                    id
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
    }
    @GetMapping("/projet/{id}")
    public ResponseEntity<ApiResponse> getConfigurationByProjet(@PathVariable Long id) {
        try {
            List<Configuration> config = configurationService.getConfigurationByProjet(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Liste des configurations par projet :",
                    config
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }

    }
    @PostMapping("/{configId}/emetteur")
    public ResponseEntity<Configuration> addEmetteur(
            @PathVariable Long configId,
            @RequestBody EmetteurConfigRequest request) {
        return ResponseEntity.ok(configurationService.addEmetteur(configId, request));
    }

    @PostMapping("/{configId}/recepteur")
    public ResponseEntity<Configuration> addRecepteur(
            @PathVariable Long configId,
            @RequestBody RecepteurConfigRequest request) {
        return ResponseEntity.ok(configurationService.addRecepteur(configId, request));
    }

    @PostMapping("/{configId}/attenuations")
    public ResponseEntity<ApiResponse> addAttenuations(
            @PathVariable Long configId,
            @RequestBody List<AttenuationConfigRequest> attenuations) {
        try {
            Configuration config = configurationService.addAttenuations(configId, attenuations);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Atténuations ajoutées avec succès",
                    config
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
    }

    @PostMapping("/{configId}/simuler")
    public ResponseEntity<Rapport> simulerConfiguration(@PathVariable Long configId) {
        return ResponseEntity.ok(configurationService.simulerConfiguration(configId));
    }
}
