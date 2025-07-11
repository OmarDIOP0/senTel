package com.example.backend.request;

import com.example.backend.model.enums.TypeAttenuation;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class AttenuationConfigRequest {
    private TypeAttenuation nomAttenuation;
    private double valeur;
    private double longueurCable;
}
