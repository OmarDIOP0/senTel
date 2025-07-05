package com.example.backend.Service.authentification;

import com.example.backend.Service.security.JwtService;
import com.example.backend.model.Administrateur;
import com.example.backend.model.Client;
import com.example.backend.model.IngenieurReseau;
import com.example.backend.model.abstracts.Utilisateur;
import com.example.backend.model.enums.Role;
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.request.AuthenticationRequest;
import com.example.backend.request.RegisterRequest;
import com.example.backend.response.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public AuthenticationResponse register(RegisterRequest request) throws IllegalAccessException {
        Role role = request.getRole() != null ? request.getRole() : Role.CLIENT;
        Utilisateur user = switch (role) {
            case ADMIN -> Administrateur.builder()
                    .nomComplet(request.getNomComplet())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            case INGENIEUR_RESEAU -> IngenieurReseau.builder()
                    .nomComplet(request.getNomComplet())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .role(Role.INGENIEUR_RESEAU)
                    .actif(false)
                    .build();
            default -> Client.builder()
                    .nomComplet(request.getNomComplet())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .role(Role.CLIENT)
                    .actif(false)
                    .build();
        };

        var existingEmail = utilisateurRepository.findByEmail(request.getEmail());
        if(existingEmail.isPresent()){
            throw new IllegalAccessException("Un utilisateur avec cet email existe déjà.");
        }

        utilisateurRepository.save(user);
        var jwtToken = jwtService.getToken(user.getEmail());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request)
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user  = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow();
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Les administrateurs doivent se connecter via l'espace admin.");
        }
        var jwtToken = jwtService.getToken(user.getEmail());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
