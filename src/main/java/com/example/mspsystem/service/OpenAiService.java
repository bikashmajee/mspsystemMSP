package com.example.mspsystem.service;

import com.example.mspsystem.model.Ticket;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
@Service
public class OpenAiService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private GeminiService geminiService;

    // Method to send the email using generated content
    public void sendAiEscalationEmail(Ticket ticket) {
        try {
            String prompt = String.format("""
                Generate a professional escalation email for ticket:
                Description: %s
                Assigned to: %s
                Severity: %d
                Created: %s
                The task is overdue and needs immediate action.
                
                Regards,
                %s
                Manager: %s (%s)
                """,
                                ticket.getDescription(),
                                ticket.getAssignedEmployeeEmail(),
                                ticket.getSeverity(),
                                ticket.getCreatedTime().toString(),
                                ticket.getCreatorName(),
                                ticket.getCreatorManagerName(),
                                ticket.getCreatorManagerEmail()
                        );

            String emailContent = generateEscalationEmail(prompt);
//            String emailContent = geminiService.generateEscalationEmail(prompt);;

            sendEmail(ticket.getAssignedEmployeeEmail(), "Ticket Escalation: " + ticket.getDescription(), emailContent);
        } catch (Exception e) {
            // Handle exceptions (logging, retry etc.)
            e.printStackTrace();
        }
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }



    public String generateEscalationEmail(String prompt) throws Exception {
        String API_KEY = "";// add api key
        String apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

        ObjectMapper mapper = new ObjectMapper();

        // Build the correct structure:
        ObjectNode payload = mapper.createObjectNode();
        ArrayNode contents = mapper.createArrayNode();
        ObjectNode contentItem = mapper.createObjectNode();
        ArrayNode parts = mapper.createArrayNode();
        ObjectNode partObj = mapper.createObjectNode();
        partObj.put("text", prompt);
        parts.add(partObj);
        contentItem.set("parts", parts);
        contents.add(contentItem);
        payload.set("contents", contents);

        String body = mapper.writeValueAsString(payload);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiEndpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode node = mapper.readTree(response.body());

        // Parse the returned content (update this if the response structure is slightly different)
        return node.at("/candidates/0/content/parts/0/text").asText();
    }

}
