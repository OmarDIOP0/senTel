package com.example.backend.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class RecepteurConfigRequest {
    private double sensibilite;
    private double gainReception;
}
