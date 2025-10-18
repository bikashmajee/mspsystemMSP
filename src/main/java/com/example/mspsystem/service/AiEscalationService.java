package com.example.mspsystem.service;

import com.example.mspsystem.model.Ticket;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AiEscalationService {

    // Simple rule - escalate if ticket pending over 24 hours
    public boolean shouldEscalate(Ticket ticket) {
        return LocalDateTime.now().isAfter(ticket.getCreatedTime().plusHours(24));
    }

}
