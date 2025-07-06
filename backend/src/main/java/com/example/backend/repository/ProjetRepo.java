package com.example.backend.repository;

import com.example.backend.model.Projet;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProjetRepo extends JpaRepository<Projet, Long> {
    Projet findByNom(String nom);
}
