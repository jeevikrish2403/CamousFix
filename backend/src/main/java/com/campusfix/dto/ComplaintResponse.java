package com.campusfix.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ComplaintResponse {
    private Long id;
    private String ticketNumber;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String location;
    private String imageUrl;
    private String categoryName;
    private Long categoryId;
    private String submittedByName;
    private Long submittedById;
    private String assignedToName;
    private Long assignedToId;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private List<CommentResponse> comments;
    private List<HistoryResponse> history;
}
