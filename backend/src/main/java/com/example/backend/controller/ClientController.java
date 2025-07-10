package com.example.backend.controller;

import com.example.backend.Service.client.ClientService;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Client;
import com.example.backend.model.Configuration;
import com.example.backend.request.ClientRequest;
import com.example.backend.request.ConfigurationRequest;
import com.example.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/client")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllClients() {
        try{
            List<Client> clients = clientService.getAllCLients();
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Liste des clients",
                    clients
            ));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Erreur lors de la mise à jour",
                    e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateClient(@PathVariable Long id, @RequestBody ClientRequest request) {
        try {
            Client client = clientService.updateClient(request, id);
            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Client mise à jour avec succès",
                    client
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
}
