package com.example.backend.Service.emetteur;

import com.example.backend.model.Configuration;
import com.example.backend.model.Emetteur;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.repository.EmetteurRepo;
import com.example.backend.request.EmetteurRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmetteurService implements IEmetteurService {
    private final ConfigurationRepo configurationRepo;
    private final EmetteurRepo emetteurRepo;
    @Override
    public Emetteur addEmetteur(Long ConfigId, EmetteurRequest request) {
        Configuration config = configurationRepo.findById(ConfigId)
                .orElseThrow(() -> new IllegalArgumentException("Config not found"));
        if(config.getEmetteur() != null){
            throw new IllegalArgumentException("Un emetteur est déjà associé à cette configuration");
        }
        Emetteur emetteur = new Emetteur();
        emetteur.setConfiguration(config);
        emetteur.setFrequence(request.getFrequence());
        emetteur.setPuissanceEntree(request.getPuissanceEntree());
        config.setEmetteur(emetteur);
        return emetteurRepo.save(emetteur);
    }

    @Override
    public Emetteur updateEmetteur(EmetteurRequest request,Long id) {
        return null;
    }

    @Override
    public Emetteur deleteEmetteur(EmetteurRequest request) {
        return null;
    }

    @Override
    public List<Emetteur> getAllEmetteurs() {
        return List.of();
    }

    @Override
    public Emetteur getEmetteurById(Long id) {
        return null;
    }
}
