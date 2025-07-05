package com.example.backend.Service.client;

import com.example.backend.model.Client;
import com.example.backend.repository.ClientRepo;
import com.example.backend.request.ClientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientService implements IClientService{
    private final ClientRepo clientRepo;
    @Override
    public Client updateClient(ClientRequest request, Long id) {
        Client client = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        client.setNomComplet(request.getNomComplet());
        client.setEmail(request.getEmail());
        client.setEntreprise(request.getEntreprise());
        client.setTelephone(request.getTelephone());
        client.setPassword(request.getPassword());
        client.setScenarioPredefini(request.getScenarioPredefini());
        client.setProfilUsage(request.getProfilUsage());
        return clientRepo.save(client);
    }
}
