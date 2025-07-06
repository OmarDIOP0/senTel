package com.example.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfigurationRequest {
    private double distance;
    private double bandePassante;
    private Long emetteurId;
    private Long recepteurId;
    private Long clientId;
    private Long projetId;
}
