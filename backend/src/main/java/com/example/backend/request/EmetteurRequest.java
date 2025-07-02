package com.example.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmetteurRequest {
    private Long configId;
    private double puissanceEntree;
    private double frequence;
}
