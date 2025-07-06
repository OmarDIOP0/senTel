package com.example.backend.Service.projet;

import com.example.backend.model.Projet;
import com.example.backend.request.ProjetRequest;

import java.util.List;

public interface IProjetService {
    List<Projet> getAllProjets();
    Projet addProjet(ProjetRequest request);
    Projet updateProjet(ProjetRequest request ,Long id);
    void deleteProjet(Long id);
    Projet getProjetById(Long id);
}
