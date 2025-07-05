package com.example.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecepteurRequest {
    private Long configurationId;
    private double sensibilite;
    private double gainReception;
}
