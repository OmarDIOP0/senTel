package com.example.backend.Service.attenuation;

import com.example.backend.model.Attenuation;
import com.example.backend.request.AttenuationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AttenuationService implements IAttenuationService {
    @Override
    public Attenuation getAttenuations() {
        return null;
    }

    @Override
    public Attenuation creerAttenuation(AttenuationRequest request) {
        return null;
    }

    @Override
    public Attenuation updateAttenuation(AttenuationRequest request) {
        return null;
    }

    @Override
    public Attenuation getAttenuation(Long id) {
        return null;
    }

    @Override
    public void deleteAttenuation(Long id) {

    }
}
