package com.example.backend.request;

import com.example.backend.model.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ClientRequest {
    private String nomComplet;
    private String email;
    private String password;
    private String telephone;
    private String entreprise;
    private String profilUsage;
    private String scenarioPredefini;
}
