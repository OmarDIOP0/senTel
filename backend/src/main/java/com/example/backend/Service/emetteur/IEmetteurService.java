package com.example.backend.Service.emetteur;

import com.example.backend.model.Emetteur;
import com.example.backend.request.EmetteurRequest;

import java.util.List;

public interface IEmetteurService {
    Emetteur addEmetteur(Long ConfigId,EmetteurRequest request);
    Emetteur updateEmetteur(EmetteurRequest request,Long id);
    void deleteEmetteur(Long id);
    List<Emetteur> getAllEmetteurs();
    Emetteur getEmetteurById(Long id);
}
