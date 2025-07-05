package com.example.backend.request;

import com.example.backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String nomComplet;
    private String email;
    private String password;
    private String telephone;
    private Role role;
}
