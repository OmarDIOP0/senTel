package com.example.backend.model.abstracts;


import com.example.backend.model.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 3, message = "Le nom complet doit contenir au moins 3 caractères.")
    private String nomComplet;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(unique = true)
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(
            regexp = "^[a-zA-Z0-9]{8,20}$",
            message = "Le mot de passe doit être alphanumérique, entre 8 et 20 caractères."
    )
    private String password;

    @Pattern(
            regexp = "\\d{7,9}",
            message = "Le numéro de téléphone doit contenir entre 7 et 9 chiffres."
    )
    private String telephone;
    private boolean actif;
}
