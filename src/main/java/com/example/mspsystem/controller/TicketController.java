package com.example.mspsystem.controller;

import com.example.mspsystem.model.Ticket;
import com.example.mspsystem.service.EmailService;
import com.example.mspsystem.service.OpenAiService;
import com.example.mspsystem.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
//@CrossOrigin(origins = "http://localhost:8081")

@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;
    @Autowired
    private OpenAiService emailService;


    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket, "majee.bikash1998@gmail.com");
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PutMapping("/{id}/complete")
    public Ticket completeTicket(@PathVariable Long id) {
        return ticketService.updateTicketCompletion(id, true);
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<?> escalateTicketNow(@PathVariable Long id) {
        Ticket ticket = ticketService.findById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }
        if (ticket.isEscalated()) {
            return ResponseEntity.badRequest().body("Ticket already escalated");
        }
        emailService.sendAiEscalationEmail(ticket);
        ticket.setEscalated(true);
        ticketService.save(ticket);
        return ResponseEntity.ok("Escalation sent");
    }

}
