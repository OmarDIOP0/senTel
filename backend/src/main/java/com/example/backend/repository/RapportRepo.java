package com.example.backend.repository;

import com.example.backend.model.Configuration;
import com.example.backend.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RapportRepo extends JpaRepository<Rapport,Long> {
    Optional<Rapport> findByConfiguration(Configuration configuration);

}
