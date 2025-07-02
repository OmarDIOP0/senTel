package com.example.backend.request;

import com.example.backend.model.enums.TypeAttenuation;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AttenuationRequest {
    private TypeAttenuation nomAttenuation;
    private double valeur;
    private double longueurCable;
}
