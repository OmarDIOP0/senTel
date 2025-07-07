package com.example.backend.controller;

import com.example.backend.Service.dimensionnement.DimensionnementService;
import com.example.backend.model.Configuration;
import com.example.backend.model.Rapport;
import com.example.backend.request.ConfigurationRequest;
import com.example.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/dimensionnement")
@RequiredArgsConstructor
public class DimensionnementController {

    private final DimensionnementService dimensionnementService;

    @PostMapping("/rapport")
    public ResponseEntity<ApiResponse> genererRapport(@RequestBody Configuration request) {
        try {
            Rapport rapport = dimensionnementService.genererRapportComplet(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(true, "Rapport généré", rapport));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Erreur interne", e.getMessage()));
        }
    }

    @GetMapping("/rapport/{id}")
    public ResponseEntity<ApiResponse> getRapport(@PathVariable Long id) {
        try {
            Rapport rapport = dimensionnementService.getRapport(id);
            return ResponseEntity.ok(new ApiResponse(true, "Rapport trouvé", rapport));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @GetMapping("/rapport")
    public ResponseEntity<ApiResponse> getAllRapports() {
        try {
            List<Rapport> rapports = dimensionnementService.getAllRapports();
            return ResponseEntity.ok(new ApiResponse(true, "Tous les rapports", rapports));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Erreur serveur", e.getMessage()));
        }
    }

    @PutMapping("/rapport/{id}")
    public ResponseEntity<ApiResponse> updateRapport(@PathVariable Long id, @RequestBody Configuration request) {
        try {
            Rapport rapport = dimensionnementService.updateRapport(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Rapport mis à jour", rapport));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/rapport/{id}")
    public ResponseEntity<ApiResponse> deleteRapport(@PathVariable Long id) {
        try {
            dimensionnementService.deleteRapport(id);
            return ResponseEntity.ok(new ApiResponse(true, "Rapport supprimé", id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}

