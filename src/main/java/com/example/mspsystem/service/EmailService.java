package com.example.mspsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
//import com.example.mspsystem.model.Ticket;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendEscalationEmail(String toEmail, Ticket ticket) {
//        SimpleMailMessage msg = new SimpleMailMessage();
//        msg.setTo(toEmail);
//        msg.setSubject("Ticket Escalation: " + ticket.getDescription());
//        msg.setText("Your ticket assigned to you is pending for more than 24 hours. Please take action immediately.");
//
//        mailSender.send(msg);
//    }
//}


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // This method now takes the email body from caller
    public void sendEscalationEmail(String toEmail, String emailContent) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        // Subject can be generic or dynamic
        msg.setSubject("Ticket Escalation Notification");
        msg.setText(emailContent);
        mailSender.send(msg);
    }
}
