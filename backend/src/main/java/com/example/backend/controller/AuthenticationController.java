package com.example.backend.controller;

import com.example.backend.Service.authentification.AuthenticationService;
import com.example.backend.Service.security.JwtService;
import com.example.backend.model.abstracts.Utilisateur;
import com.example.backend.model.enums.Role;
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.request.AuthenticationRequest;
import com.example.backend.request.RegisterRequest;
import com.example.backend.response.ApiResponse;
import com.example.backend.response.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) throws IllegalAccessException {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ){
        UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()
        );

        Authentication authentication = authenticationManager.authenticate(creds);
        String token = jwtService.getToken(authentication.getName());
        AuthenticationResponse response = authenticationService.authenticate(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/admin/login")
    public ResponseEntity<AuthenticationResponse> authenticateAdmin(
            @RequestBody AuthenticationRequest request
    ){
        UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()
        );

        Authentication authentication = authenticationManager.authenticate(creds);
        String email = authentication.getName();

        // Vérifier que l'utilisateur est bien un administrateur
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        if (utilisateur.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AuthenticationResponse());
        }

        String token = jwtService.getToken(email);
        AuthenticationResponse response = AuthenticationResponse.builder()
                .token(token)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Profil récupéré avec succès",
                    utilisateur
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                    false,
                    "Erreur lors de la récupération du profil: " + e.getMessage(),
                    null
            ));
        }
    }
}
