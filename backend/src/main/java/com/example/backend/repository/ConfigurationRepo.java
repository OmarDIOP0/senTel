package com.example.backend.repository;

import com.example.backend.model.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConfigurationRepo extends JpaRepository<Configuration, Long> {
    List<Configuration> findByProjetId(Long aLong);
}
