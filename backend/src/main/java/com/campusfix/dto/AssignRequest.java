package com.campusfix.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignRequest {

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    private String remarks;
}
