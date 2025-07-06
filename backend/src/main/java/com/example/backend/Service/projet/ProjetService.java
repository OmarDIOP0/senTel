package com.example.backend.Service.projet;

import com.example.backend.exception.ResourceAlreadyExistException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Projet;
import com.example.backend.repository.ProjetRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetService implements IProjetService{
    private final ProjetRepo projetRepo;
    @Override
    public List<Projet> getAllProjets() {
        return projetRepo.findAll();
    }

    @Override
    public Projet addProjet(Projet projet) {
        Projet existingProject = projetRepo.findByNom(projet.getNom());
        if (existingProject != null) {
            throw new ResourceAlreadyExistException("Le projet existe deja !");
        }
        return projetRepo.save(projet);
    }

    @Override
    public Projet updateProjet(Projet projet, Long id) {
        Projet projetFound = projetRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Le projet non trouvé"));
        projetFound.setNom(projet.getNom());
        projetFound.setDescription(projet.getDescription());
        projetRepo.save(projetFound);
        return projetFound;
    }

    @Override
    public void deleteProjet(Long id) {
        Projet projetFound = projetRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Le projet non trouvé"));
        projetRepo.delete(projetFound);
    }

    @Override
    public Projet getProjetById(Long id) {
        return projetRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Le projet non trouvé"));
    }
}
