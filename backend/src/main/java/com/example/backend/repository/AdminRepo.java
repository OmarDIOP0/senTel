package com.example.backend.repository;

import com.example.backend.model.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<Administrateur,Long> {
}
