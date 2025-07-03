package com.example.backend.Service.recepteur;

import com.example.backend.model.Configuration;
import com.example.backend.model.Recepteur;
import com.example.backend.repository.ConfigurationRepo;
import com.example.backend.repository.RecepteurRepo;
import com.example.backend.request.RecepteurRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecepteurService implements IRecepteurService {
    private final ConfigurationRepo configurationRepo;
    private final RecepteurRepo recepteurRepo;

    @Override
    public Recepteur addRecepteur(Long configId, RecepteurRequest request) {
        Configuration config = configurationRepo.findById(configId)
                .orElseThrow(() -> new IllegalArgumentException("Configuration not found"));
        if(config.getRecepteur()!=null){
            throw new IllegalArgumentException("Recepteur deja associé a cette configuration");
        }
        Recepteur recepteur = new Recepteur();
        recepteur.setConfiguration(config);
        recepteur.setSensibilite(request.getSensibilite());
        recepteur.setGainReception(request.getGainReception());
        config.setRecepteur(recepteur);
        return recepteurRepo.save(recepteur);
    }

    @Override
    public Recepteur getRecepteur(Long id) {
        return null;
    }

    @Override
    public List<Recepteur> getRecepteurs() {
        return List.of();
    }

    @Override
    public Recepteur updateRecepteur(RecepteurRequest request, Long id) {
        return null;
    }

    @Override
    public void deleteRecepteur(Long id) {

    }
}
