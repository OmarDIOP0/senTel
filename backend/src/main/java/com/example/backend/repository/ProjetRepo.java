package com.example.backend.repository;

import com.example.backend.model.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetRepo extends JpaRepository<Projet, Long> {
}
