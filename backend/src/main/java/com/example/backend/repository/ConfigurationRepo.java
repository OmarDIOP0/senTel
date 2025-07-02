package com.example.backend.repository;

import com.example.backend.model.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigurationRepo extends JpaRepository<Configuration, Long> {
}
