package com.example.backend.repository;

import com.example.backend.model.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ConfigurationRepo extends JpaRepository<Configuration, Long> {
    List<Configuration> findByProjetId(Long aLong);
    @Query(value = "SELECT c.id, c.distance, c.bande_passante AS bandePassante, p.nom AS nomProjet " +
            "FROM configuration c " +
            "JOIN projet p ON c.projet_id = p.id", nativeQuery = true)
    List<Map<String, Object>> findAllConfigsWithProjetNameNative();

}
