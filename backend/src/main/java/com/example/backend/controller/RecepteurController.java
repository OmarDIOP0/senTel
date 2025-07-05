package com.example.backend.controller;

import com.example.backend.Service.recepteur.RecepteurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/recepteur")
public class RecepteurController {
    private RecepteurService recepteurService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllAdresses() {
        try {
            List<Adresse> adresses = adresseService.getAllAdresses();
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Found",
                    adresses
            ));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Error",
                    e.getMessage()
            ));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAdresseById(@PathVariable Long id) {
        try{
            Adresse adresse = adresseService.getAdresseById(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Found",
                    adresse
            ));
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> addAdresse(@RequestBody AddAdresseRequest adresse) {
        try{
            Adresse adresseResult = adresseService.addAdresse(adresse);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Add Adress success",
                    adresseResult
            ));
        }
        catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
        catch (ResourceAlreadyExistException e){
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
    public ResponseEntity<ApiResponse> updateAdresse(@RequestBody AdresseUpdateRequest adresse, @PathVariable Long id) {
        try {
            Adresse adresseResult = adresseService.updateAdresse(adresse, id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Adress Updated Successfully",
                    adresseResult
            ));
        }catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Error",
                    e.getMessage()
            ));
        }
    }
    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse> deleteAdresse(@PathVariable Long id) {
        try {
            adresseService.deleteAdresse(id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Adress deleted successfully",
                    id
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                    false,
                    e.getMessage(),
                    null
            ));
        }
    }
}
