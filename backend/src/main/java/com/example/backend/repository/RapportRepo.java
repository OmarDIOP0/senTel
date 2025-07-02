package com.example.backend.repository;

import com.example.backend.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RapportRepo extends JpaRepository<Rapport,Long> {
}
