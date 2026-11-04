package com.campusfix.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DashboardStats {
    private long totalComplaints;
    private long openComplaints;
    private long assignedComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private Map<String, Long> complaintsByCategory;
    private long totalUsers;
    private long totalTechnicians;
}
