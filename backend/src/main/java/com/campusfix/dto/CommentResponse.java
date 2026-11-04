package com.campusfix.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String message;
    private String commentedByName;
    private String commentedByRole;
    private LocalDateTime createdAt;
}
