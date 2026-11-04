package com.campusfix.repository;

import com.campusfix.model.Complaint;
import com.campusfix.model.ComplaintStatus;
import com.campusfix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByTicketNumber(String ticketNumber);

    List<Complaint> findBySubmittedBy(User user);

    List<Complaint> findByAssignedTo(User technician);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findBySubmittedByOrderByCreatedAtDesc(User user);

    List<Complaint> findByAssignedToOrderByCreatedAtDesc(User technician);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = :status")
    Long countByStatus(ComplaintStatus status);

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT c.category.name, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countGroupByCategory();
}
