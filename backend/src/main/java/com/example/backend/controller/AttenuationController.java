package com.example.backend.controller;

import com.example.backend.Service.attenuation.AttenuationService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Attenuation;
import com.example.backend.request.AttenuationRequest;
import com.example.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("${api.prefix}/attenuation")
@RequiredArgsConstructor
public class AttenuationController {
    private final AttenuationService attenuationService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        try {
            List<Attenuation> list = attenuationService.getAttenuations();
            return ResponseEntity.ok(new ApiResponse(true, "Liste des atténuations", list));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse(false, "Erreur lors de la récupération", e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        try {
            Attenuation attenuation = attenuationService.getAttenuation(id);
            return ResponseEntity.ok(new ApiResponse(true, "Atténuation trouvée", attenuation));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse(false, "Atténuation non trouvée", e.getMessage())
            );
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody AttenuationRequest request) {
        try {
            Attenuation attenuation = attenuationService.creerAttenuation(request);
            return ResponseEntity.status(201).body(
                    new ApiResponse(true, "Atténuation créée", attenuation)
            );
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse(false, "Erreur lors de la création", e.getMessage())
            );
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse> update(@RequestBody AttenuationRequest request) {
        try {
            Attenuation attenuation = attenuationService.updateAttenuation(request);
            return ResponseEntity.ok(new ApiResponse(true, "Atténuation mise à jour", attenuation));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse(false, "Erreur lors de la mise à jour", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        try {
            attenuationService.deleteAttenuation(id);
            return ResponseEntity.ok(new ApiResponse(true, "Atténuation supprimée", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse(false, "Erreur lors de la suppression", e.getMessage())
            );
        }
    }
}
