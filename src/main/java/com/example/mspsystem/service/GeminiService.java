package com.example.mspsystem.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    private static final String API_KEY = "YOUR_GEMINI_API_KEY";

    public String generateEscalationEmail(String prompt) throws Exception {
        String apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;

        ObjectMapper mapper = new ObjectMapper();
        String body = mapper.writeValueAsString(
                mapper.createObjectNode()
                        .putArray("contents")
                        .add(mapper.createObjectNode().put("parts", prompt))
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiEndpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode node = mapper.readTree(response.body());

        // Parse the returned content (This may differ based on Gemini's API response structure)
        return node.at("/candidates/0/content/parts/0/text").asText();
    }
}




