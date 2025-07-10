package com.example.backend.controller;

import com.example.backend.Service.recepteur.RecepteurService;
import com.example.backend.exception.ResourceAlreadyExistException;
import com.example.backend.model.Recepteur;
import com.example.backend.request.RecepteurRequest;
import com.example.backend.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.exception.ResourceNotFoundException;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/recepteur")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowedHeaders = "*",
        allowCredentials = "true")
public class RecepteurController {
    private final RecepteurService recepteurService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllRecepteur() {
        try {
            List<Recepteur> recepteurs = recepteurService.getRecepteurs();
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Found",
                    recepteurs
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getRecepteurById(@PathVariable Long id) {
        try {
            Recepteur recepteur = recepteurService.getRecepteur(id);
            return ResponseEntity.ok(new ApiResponse(true, "Found", recepteur));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }


    @PostMapping
    public ResponseEntity<ApiResponse> addRecepteur(@Valid @RequestBody RecepteurRequest request) {
        try{
            Recepteur recepteurResult = recepteurService.addRecepteur(request);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Add Recepteur success",
                    recepteurResult
            ));
        } catch (ResourceAlreadyExistException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Error",
                    e.getMessage()
            ));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateRecepteur(@RequestBody RecepteurRequest request, @PathVariable Long id) {
        try {
            Recepteur recepteurResult = recepteurService.updateRecepteur(request, id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Recepteur updated successfully",
                    recepteurResult
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Error",
                    e.getMessage()
            ));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRecepteur(@PathVariable Long id) {
        recepteurService.deleteRecepteur(id);
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Recepteur deleted successfully",
                id
        ));
    }
}
