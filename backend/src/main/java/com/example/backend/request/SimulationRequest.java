package com.example.backend.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class SimulationRequest {
    private Long configurationId;
    private EmetteurRequest emetteur;
    private RecepteurRequest recepteur;
    private List<AttenuationRequest> attenuations;
}
