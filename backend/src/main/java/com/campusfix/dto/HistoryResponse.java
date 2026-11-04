package com.campusfix.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HistoryResponse {
    private Long id;
    private String oldStatus;
    private String newStatus;
    private String changedByName;
    private String remarks;
    private LocalDateTime changedAt;
}
