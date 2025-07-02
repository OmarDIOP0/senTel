package com.example.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecepteurRequest {
    private double sensibilite;
    private double gainReception;
}
