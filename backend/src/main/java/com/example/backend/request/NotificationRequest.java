package com.example.backend.request;
import com.example.backend.model.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationRequest {
    private String libelle;
    private String description;
    private Status status;
}
