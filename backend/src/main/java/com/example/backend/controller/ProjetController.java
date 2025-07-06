package com.example.backend.controller;

import com.example.backend.Service.projet.ProjetService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Projet;
import com.example.backend.request.ProjetRequest;
import com.example.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/projet")
@RequiredArgsConstructor
public class ProjetController {
    private final ProjetService projetService;
    @GetMapping
    public ResponseEntity<ApiResponse> getProjet() {
        try{
            List<Projet> projets = projetService.getAllProjets();
            return  ResponseEntity.status(HttpStatus.OK).body(
                    new ApiResponse(
                            true,
                            "Liste des projets",
                            projets
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
    public ResponseEntity<ApiResponse> createProjet(@RequestBody ProjetRequest request) {
        try {
            Projet projet = projetService.addProjet(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(
                    true,
                    "Projet créé avec succès",
                    projet
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
    public ResponseEntity<ApiResponse> updateProjet(@PathVariable Long id, @RequestBody ProjetRequest request) {
        try {
            Projet updated = projetService.updateProjet(request, id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Projet mise à jour avec succès",
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
    public ResponseEntity<ApiResponse> getProjet(@PathVariable Long id) {
        try {
            Projet projet = projetService.getProjetById(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Projet trouvée",
                    projet
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
    public ResponseEntity<ApiResponse> deleteProjet(@PathVariable Long id) {
        try {
            projetService.deleteProjet(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Projet supprimée avec succès",
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
