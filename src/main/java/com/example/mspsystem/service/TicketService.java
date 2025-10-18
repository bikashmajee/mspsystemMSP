package com.example.mspsystem.service;

import com.example.mspsystem.model.Employee;
import com.example.mspsystem.model.Ticket;
import com.example.mspsystem.repository.EmployeeRepository;
import com.example.mspsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AiEscalationService aiEscalationService;

//    public Ticket createTicket(Ticket ticket) {
//        ticket.setCreatedTime(LocalDateTime.now());
//        ticket.setUpdatedTime(LocalDateTime.now());
//        ticket.setCompleted(false);
//        ticket.setEscalated(false);
//        return ticketRepository.save(ticket);
//    }
@Autowired
private EmployeeRepository employeeRepository;

    public Ticket createTicket(Ticket ticket, String creatorEmail) {
        Optional<Employee> creatorOpt = employeeRepository.findByEmployeeEmail(creatorEmail);

        if (creatorOpt.isPresent()) {
            Employee creator = creatorOpt.get();

            ticket.setCreatorName(creator.getEmployeeName());
            ticket.setCreatorEmail(creator.getEmployeeEmail());
            ticket.setCreatorManagerName(creator.getManagerName());
            ticket.setCreatorManagerEmail(creator.getManagerEmail());
        }

        ticket.setCreatedTime(LocalDateTime.now());
        // save ticket
        return ticketRepository.save(ticket);
    }


    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket updateTicketCompletion(Long id, boolean completed) {
        Ticket t = ticketRepository.findById(id).orElseThrow();
        t.setCompleted(completed);
        t.setUpdatedTime(LocalDateTime.now());
        return ticketRepository.save(t);
    }

    @Scheduled(fixedRate = 3600000) // every hour
    public void checkEscalations() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);
        List<Ticket> pendingTickets = ticketRepository.findPendingTicketsOlderThan(threshold);
        for (Ticket ticket : pendingTickets) {
            if (!ticket.isEscalated() && aiEscalationService.shouldEscalate(ticket)) {
//                emailService.sendEscalationEmail(ticket);
                ticket.setEscalated(true);
                ticketRepository.save(ticket);
            }
        }
    }
    public Ticket findById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public Ticket save(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
    @Autowired
    private OpenAiService openAiService;

    public void escalateTicket(Ticket ticket) {
        openAiService.sendAiEscalationEmail(ticket);
        ticket.setEscalated(true);
        ticketRepository.save(ticket);
    }

}
