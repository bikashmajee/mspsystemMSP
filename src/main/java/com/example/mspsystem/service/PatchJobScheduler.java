package com.example.mspsystem.service;

import com.example.mspsystem.model.PatchJob;
import com.example.mspsystem.repository.PatchJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatchJobScheduler {

    @Autowired
    private PatchJobRepository patchJobRepository;

    // Runs every hour and executes pending jobs
    @Scheduled(cron = "0 0 * * * *")
    public void runScheduledPatchJobs() {
        List<PatchJob> jobs = patchJobRepository.findAll().stream()
                .filter(job -> job.getStatus().equals("Scheduled") && job.getScheduledTime().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        for (PatchJob job : jobs) {
            // Perform patch operation here (e.g., call patch script/logic)
            job.setStatus("Completed");
            patchJobRepository.save(job);
        }
    }
}
