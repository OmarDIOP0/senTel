package com.example.backend.repository;

import com.example.backend.model.Attenuation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttenuationRepo extends JpaRepository<Attenuation, Long> {
}
