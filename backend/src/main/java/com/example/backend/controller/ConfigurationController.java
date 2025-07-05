package com.example.backend.controller;

import com.example.backend.Service.configuration.ConfigurationService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Configuration;
import com.example.backend.request.ConfigurationRequest;
import com.example.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("${api.prefix}/configuration")
@RequiredArgsConstructor
public class ConfigurationController {

    private final ConfigurationService configurationService;

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
        } catch (IllegalArgumentException e) {
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
        } catch (RuntimeException e) {
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
}
