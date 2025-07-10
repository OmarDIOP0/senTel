package com.example.backend.controller;

import com.example.backend.Service.emetteur.EmetteurService;
import com.example.backend.exception.ResourceAlreadyExistException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Emetteur;
import com.example.backend.request.EmetteurRequest;
import com.example.backend.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/emetteur")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"},
        allowedHeaders = "*",
        allowCredentials = "true")
public class EmetteurController {
    private final EmetteurService emetteurService;
    @GetMapping
    public ResponseEntity<ApiResponse> getAllEmetteur() {
        try {
            List<Emetteur> emetteurs = emetteurService.getAllEmetteurs();
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Found",
                    emetteurs
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getEmetteurById(@PathVariable Long id) {
        try {
            Emetteur emetteur = emetteurService.getEmetteurById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Found", emetteur));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }


    @PostMapping
    public ResponseEntity<ApiResponse> addEmetteur(@Valid @RequestBody EmetteurRequest request) {
        try{
            Emetteur emetteurResult = emetteurService.addEmetteur(request);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Add Emetteur success",
                    emetteurResult
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
    public ResponseEntity<ApiResponse> updateEmetteur(@RequestBody EmetteurRequest request, @PathVariable Long id) {
        try {
            Emetteur emetteurResult = emetteurService.updateEmetteur(request, id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Emetteur updated successfully",
                    emetteurResult
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
    public ResponseEntity<ApiResponse> deleteEmetteur(@PathVariable Long id) {
        emetteurService.deleteEmetteur(id);
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Emetteur deleted successfully",
                id
        ));
    }
}
