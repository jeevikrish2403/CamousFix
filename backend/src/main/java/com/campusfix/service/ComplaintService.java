package com.campusfix.service;

import com.campusfix.dto.*;
import com.campusfix.model.*;
import com.campusfix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ComplaintCommentRepository commentRepository;
    private final ComplaintHistoryRepository historyRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public ComplaintResponse create(ComplaintRequest req, MultipartFile image, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Priority priority = Priority.MEDIUM;
        if (req.getPriority() != null) {
            try { priority = Priority.valueOf(req.getPriority().toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.store(image);
        }

        Complaint complaint = Complaint.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .category(category)
                .submittedBy(user)
                .priority(priority)
                .location(req.getLocation())
                .imageUrl(imageUrl)
                .status(ComplaintStatus.OPEN)
                .build();

        complaint = complaintRepository.save(complaint);
        complaint.setTicketNumber("CMP" + String.format("%04d", complaint.getId()));
        complaint = complaintRepository.save(complaint);

        saveHistory(complaint, null, ComplaintStatus.OPEN, user, "Complaint submitted");

        return mapToResponse(complaint, true);
    }

    public List<ComplaintResponse> getMyComplaints(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findBySubmittedByOrderByCreatedAtDesc(user)
                .stream().map(c -> mapToResponse(c, false)).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAssignedComplaints(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByAssignedToOrderByCreatedAtDesc(user)
                .stream().map(c -> mapToResponse(c, false)).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(c -> mapToResponse(c, false)).collect(Collectors.toList());
    }

    public ComplaintResponse getById(Long id) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + id));
        return mapToResponse(c, true);
    }

    @Transactional
    public ComplaintResponse assign(Long id, AssignRequest req, String adminEmail) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        User technician = userRepository.findById(req.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setAssignedTo(technician);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        complaintRepository.save(complaint);

        saveHistory(complaint, oldStatus, ComplaintStatus.ASSIGNED, admin,
                req.getRemarks() != null ? req.getRemarks() : "Assigned to " + technician.getName());

        return mapToResponse(complaint, true);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, StatusUpdateRequest req, String userEmail) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ComplaintStatus newStatus;
        try {
            newStatus = ComplaintStatus.valueOf(req.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + req.getStatus());
        }

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(newStatus);

        if (req.getResolutionNotes() != null) {
            complaint.setResolutionNotes(req.getResolutionNotes());
        }
        if (newStatus == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        complaintRepository.save(complaint);

        saveHistory(complaint, oldStatus, newStatus, user, req.getRemarks());

        return mapToResponse(complaint, true);
    }

    @Transactional
    public CommentResponse addComment(Long id, CommentRequest req, String userEmail) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ComplaintComment comment = ComplaintComment.builder()
                .complaint(complaint)
                .commentedBy(user)
                .message(req.getMessage())
                .build();
        comment = commentRepository.save(comment);

        return CommentResponse.builder()
                .id(comment.getId())
                .message(comment.getMessage())
                .commentedByName(user.getName())
                .commentedByRole(user.getRole().name())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private void saveHistory(Complaint complaint, ComplaintStatus oldStatus,
                             ComplaintStatus newStatus, User changedBy, String remarks) {
        ComplaintHistory history = ComplaintHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .remarks(remarks)
                .build();
        historyRepository.save(history);
    }

    public ComplaintResponse mapToResponse(Complaint c, boolean includeDetails) {
        ComplaintResponse.ComplaintResponseBuilder builder = ComplaintResponse.builder()
                .id(c.getId())
                .ticketNumber(c.getTicketNumber())
                .title(c.getTitle())
                .description(c.getDescription())
                .status(c.getStatus().name())
                .priority(c.getPriority().name())
                .location(c.getLocation())
                .imageUrl(c.getImageUrl())
                .categoryName(c.getCategory().getName())
                .categoryId(c.getCategory().getId())
                .submittedByName(c.getSubmittedBy().getName())
                .submittedById(c.getSubmittedBy().getId())
                .assignedToName(c.getAssignedTo() != null ? c.getAssignedTo().getName() : null)
                .assignedToId(c.getAssignedTo() != null ? c.getAssignedTo().getId() : null)
                .resolutionNotes(c.getResolutionNotes())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .resolvedAt(c.getResolvedAt());

        if (includeDetails) {
            List<CommentResponse> comments = commentRepository
                    .findByComplaintOrderByCreatedAtAsc(c)
                    .stream()
                    .map(cm -> CommentResponse.builder()
                            .id(cm.getId())
                            .message(cm.getMessage())
                            .commentedByName(cm.getCommentedBy().getName())
                            .commentedByRole(cm.getCommentedBy().getRole().name())
                            .createdAt(cm.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());

            List<HistoryResponse> history = historyRepository
                    .findByComplaintOrderByChangedAtAsc(c)
                    .stream()
                    .map(h -> HistoryResponse.builder()
                            .id(h.getId())
                            .oldStatus(h.getOldStatus() != null ? h.getOldStatus().name() : null)
                            .newStatus(h.getNewStatus().name())
                            .changedByName(h.getChangedBy().getName())
                            .remarks(h.getRemarks())
                            .changedAt(h.getChangedAt())
                            .build())
                    .collect(Collectors.toList());

            builder.comments(comments).history(history);
        }

        return builder.build();
    }
}
