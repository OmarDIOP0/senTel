package com.example.backend.Service.attenuation;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Attenuation;
import com.example.backend.model.Configuration;
import com.example.backend.repository.AttenuationRepo;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.request.AttenuationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttenuationService implements IAttenuationService {
    private final AttenuationRepo attenuationRepo;
    private final ConfigurationRepo configurationRepo;

    @Override
    public List<Attenuation> getAttenuations() {
        return attenuationRepo.findAll();
    }

    @Override
    public Attenuation creerAttenuation(AttenuationRequest request) {
        Configuration config = configurationRepo.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException("Configuration introuvable"));

        Attenuation attenuation = new Attenuation();
        attenuation.setNomAttenuation(request.getNomAttenuation());
        attenuation.setValeur(request.getValeur());
        attenuation.setLongueurCable(request.getLongueurCable());
        attenuation.setConfiguration(config);

        return attenuationRepo.save(attenuation);
    }

    @Override
    public Attenuation updateAttenuation(AttenuationRequest request) {
        Attenuation attenuation = attenuationRepo.findById(request.getConfigId())
                .orElseThrow(() -> new ResourceNotFoundException("Atténuation introuvable"));

        attenuation.setNomAttenuation(request.getNomAttenuation());
        attenuation.setValeur(request.getValeur());
        attenuation.setLongueurCable(request.getLongueurCable());

        return attenuationRepo.save(attenuation);
    }

    @Override
    public Attenuation getAttenuation(Long id) {
        return attenuationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atténuation introuvable"));
    }

    @Override
    public void deleteAttenuation(Long id) {
        Attenuation attenuation = attenuationRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atténuation introuvable"));
        attenuationRepo.delete(attenuation);
    }
}
