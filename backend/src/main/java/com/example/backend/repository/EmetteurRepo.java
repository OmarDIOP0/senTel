package com.example.backend.repository;

import com.example.backend.model.Emetteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmetteurRepo extends JpaRepository<Emetteur, Long> {
}
