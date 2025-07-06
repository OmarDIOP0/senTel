package com.example.backend.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ProjetRequest {
    private String nom;
    private String description;
}
