package com.example.mspsystem.controller;

import com.example.mspsystem.model.Alert;
import com.example.mspsystem.model.PatchJob;
import com.example.mspsystem.service.AlertService;
import com.example.mspsystem.service.PatchJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = "http://localhost:8081")

public class ItSystemController {

    @Autowired
    private AlertService alertService;

    @Autowired
    private PatchJobService patchJobService;

    // Alerts
    @GetMapping("/alerts")
    public List<Alert> getAlerts() {
        return alertService.getAllAlerts();
    }

    @PostMapping("/alerts")
    public Alert createAlert(@RequestBody Alert alert) {
        return alertService.createAlert(alert);
    }

    @PostMapping("/alerts/{id}/resolve")
    public Alert resolveAlert(@PathVariable Long id) {
        return alertService.resolveAlert(id);
    }

    // Patch jobs
    @GetMapping("/patchjobs")
    public List<PatchJob> getPatchJobs() {
        return patchJobService.getAllJobs();
    }

    @PostMapping("/patchjobs")
    public PatchJob createPatchJob(@RequestParam String patchName, @RequestParam String scheduleTime) {
        LocalDateTime scheduledAt = LocalDateTime.parse(scheduleTime);
        return patchJobService.schedulePatchJob(patchName, scheduledAt);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getSystemDashboard() {
        long unresolvedAlerts = alertService.getAllAlerts().stream().filter(a -> !a.isResolved()).count();
        long pendingJobs = patchJobService.getAllJobs().stream().filter(j -> j.getStatus().equals("Scheduled")).count();

        return Map.of(
                "unresolvedAlerts", unresolvedAlerts,
                "pendingPatchJobs", pendingJobs,
                "serverHealth", "Healthy"  // Could be replaced by real health checks
        );
    }
}
