package com.example.backend.Service.recepteur;

import com.example.backend.model.Recepteur;
import com.example.backend.request.RecepteurRequest;

import java.util.List;

public interface IRecepteurService {
    Recepteur addRecepteur(Long configId,RecepteurRequest request);
    Recepteur getRecepteur(Long id);
    List<Recepteur> getRecepteurs();
    Recepteur updateRecepteur(RecepteurRequest request, Long id);
    void deleteRecepteur(Long id);
}
