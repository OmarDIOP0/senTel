package com.example.backend.request;
import com.example.backend.model.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RapportRequest {
    private double notePerformance;
    private Status status;
    private double puissanceRecu;
    private String niveauQualite;
    private String conclusion;
    private Long configId;
}
