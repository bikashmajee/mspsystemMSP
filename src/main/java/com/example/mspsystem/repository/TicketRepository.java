package com.example.mspsystem.repository;

import com.example.mspsystem.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT t FROM Ticket t WHERE t.completed = false AND t.createdTime < :threshold AND t.escalated = false")
    List<Ticket> findPendingTicketsOlderThan(LocalDateTime threshold);
}
