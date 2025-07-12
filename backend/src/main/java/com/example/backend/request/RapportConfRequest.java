package com.example.backend.request;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class RapportConfRequest {
    private Long configurationId;
    private Long clientId;
    private Long adminId;
}
