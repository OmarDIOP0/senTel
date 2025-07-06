package com.example.backend.Service.projet;

import com.example.backend.model.Projet;

import java.util.List;

public interface IProjetService {
    List<Projet> getAllProjets();
    Projet addProjet(Projet projet);
    Projet updateProjet(Projet projet ,Long id);
    void deleteProjet(Long id);
    Projet getProjetById(Long id);
}
