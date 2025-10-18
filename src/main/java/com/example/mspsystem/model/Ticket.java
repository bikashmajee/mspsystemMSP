package com.example.mspsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;

@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String assignedEmployeeEmail;
    private int severity;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    private boolean completed;
    private boolean escalated;


    // New fields for manager info who created the ticket
    private String creatorName;
    private String creatorEmail;

    public String getCreatorManagerName() {
        return creatorManagerName;
    }

    public void setCreatorManagerName(String creatorManagerName) {
        this.creatorManagerName = creatorManagerName;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public String getCreatorManagerEmail() {
        return creatorManagerEmail;
    }

    public void setCreatorManagerEmail(String creatorManagerEmail) {
        this.creatorManagerEmail = creatorManagerEmail;
    }

    private String creatorManagerName;
    private String creatorManagerEmail;


    public Ticket() {
        this.createdTime = LocalDateTime.now();
        this.updatedTime = LocalDateTime.now();
        this.completed = false;
        this.escalated = false;
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAssignedEmployeeEmail() { return assignedEmployeeEmail; }
    public void setAssignedEmployeeEmail(String assignedEmployeeEmail) { this.assignedEmployeeEmail = assignedEmployeeEmail; }

    public LocalDateTime getCreatedTime() { return createdTime; }
    public void setCreatedTime(LocalDateTime createdTime) { this.createdTime = createdTime; }

    public LocalDateTime getUpdatedTime() { return updatedTime; }
    public void setUpdatedTime(LocalDateTime updatedTime) { this.updatedTime = updatedTime; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isEscalated() { return escalated; }
    public void setEscalated(boolean escalated) { this.escalated = escalated; }
    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }

}
