package com.campusfix.service;

import com.campusfix.dto.DashboardStats;
import com.campusfix.model.ComplaintStatus;
import com.campusfix.model.Role;
import com.campusfix.repository.ComplaintRepository;
import com.campusfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {
        long total = complaintRepository.count();
        long open = complaintRepository.countByStatus(ComplaintStatus.OPEN);
        long assigned = complaintRepository.countByStatus(ComplaintStatus.ASSIGNED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long closed = complaintRepository.countByStatus(ComplaintStatus.CLOSED);

        List<Object[]> byCategory = complaintRepository.countGroupByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] row : byCategory) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }

        long totalUsers = userRepository.findByRole(Role.STUDENT).size();
        long totalTechnicians = userRepository.findByRole(Role.TECHNICIAN).size();

        return DashboardStats.builder()
                .totalComplaints(total)
                .openComplaints(open)
                .assignedComplaints(assigned)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .closedComplaints(closed)
                .complaintsByCategory(categoryMap)
                .totalUsers(totalUsers)
                .totalTechnicians(totalTechnicians)
                .build();
    }
}
