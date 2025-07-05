package com.example.backend.Service.attenuation;

import com.example.backend.model.Attenuation;
import com.example.backend.request.AttenuationRequest;

public interface IAttenuationService {
    Attenuation getAttenuations();
    Attenuation creerAttenuation(AttenuationRequest request);
    Attenuation updateAttenuation(AttenuationRequest request);
    Attenuation getAttenuation(Long id);
    void deleteAttenuation(Long id);
}
