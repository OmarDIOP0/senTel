package com.example.backend.Service.client;

import com.example.backend.model.Client;
import com.example.backend.request.ClientRequest;

public interface IClientService {
    Client updateClient(ClientRequest request, Long id);
}
