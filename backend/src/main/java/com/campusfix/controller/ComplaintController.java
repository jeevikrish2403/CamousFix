package com.campusfix.controller;

import com.campusfix.dto.*;
import com.campusfix.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // Student: create complaint with optional image upload
    @PostMapping(consumes = {"multipart/form-data"})
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ComplaintResponse> create(
            @RequestPart("data") @Valid ComplaintRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(complaintService.create(request, image, userDetails.getUsername()));
    }

    // Student: view own complaints
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(complaintService.getMyComplaints(userDetails.getUsername()));
    }

    // Technician: view assigned complaints
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<ComplaintResponse>> getAssignedComplaints(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(complaintService.getAssignedComplaints(userDetails.getUsername()));
    }

    // Admin: view all complaints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // All roles: view single complaint by ID
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getById(id));
    }

    // Admin: assign technician
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> assign(
            @PathVariable Long id,
            @Valid @RequestBody AssignRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(complaintService.assign(id, request, userDetails.getUsername()));
    }

    // Admin / Technician: update status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                complaintService.updateStatus(id, request, userDetails.getUsername()));
    }

    // Student: close own complaint
    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ComplaintResponse> close(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        StatusUpdateRequest req = new StatusUpdateRequest();
        req.setStatus("CLOSED");
        req.setRemarks("Closed by student");
        return ResponseEntity.ok(
                complaintService.updateStatus(id, req, userDetails.getUsername()));
    }

    // All roles: add comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                complaintService.addComment(id, request, userDetails.getUsername()));
    }
}
