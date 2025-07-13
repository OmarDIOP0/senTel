package com.example.backend.request;

import com.example.backend.model.Attenuation;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class ConfigurationDto {
    private Long id;
    private double distance;
    private double bandePassante;
    private List<Attenuation> attenuations;
    private String projetNom;
}
