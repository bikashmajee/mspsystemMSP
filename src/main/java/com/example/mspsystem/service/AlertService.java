package com.example.mspsystem.service;

import com.example.mspsystem.model.Alert;
import com.example.mspsystem.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {
    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    public Alert createAlert(Alert alert) {
        alert.setCreatedTime(LocalDateTime.now());
        alert.setResolved(false);
        return alertRepository.save(alert);
    }

    public Alert resolveAlert(Long alertId) {
        Alert alert = alertRepository.findById(alertId).orElseThrow();
        alert.setResolved(true);
        return alertRepository.save(alert);
    }
}


