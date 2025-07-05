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
    public Emetteur addEmetteur(EmetteurRequest request) {
        Configuration config = configurationRepo.findById(request.getConfigurationId())
                .orElseThrow(() -> new IllegalArgumentException("Config not found"));
        if(config.getEmetteur() != null){
            throw new IllegalArgumentException("Un emetteur est déjà associé à cette configuration");
        }
        Emetteur emetteur = new Emetteur();
        emetteur.setFrequence(request.getFrequence());
        emetteur.setPuissanceEntree(request.getPuissanceEntree());
        emetteurRepo.save(emetteur);
        config.setEmetteur(emetteur);
        configurationRepo.save(config);
        return emetteur;
    }

    @Override
    public Emetteur updateEmetteur(EmetteurRequest request,Long id) {
        Emetteur emetteur = emetteurRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Emetteur not found"));
        emetteur.setFrequence(request.getFrequence());
        emetteur.setPuissanceEntree(request.getPuissanceEntree());
        return emetteurRepo.save(emetteur);
    }

    @Override
    public void deleteEmetteur(Long id) {
        Emetteur emetteur = emetteurRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Emetteur not found"));
        emetteurRepo.delete(emetteur);
    }

    @Override
    public List<Emetteur> getAllEmetteurs() {
        return emetteurRepo.findAll();
    }

    @Override
    public Emetteur getEmetteurById(Long id) {
        return emetteurRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Emetteur not found"));
    }
}
