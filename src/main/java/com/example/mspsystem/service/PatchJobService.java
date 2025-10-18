package com.example.mspsystem.service;

import com.example.mspsystem.model.PatchJob;
import com.example.mspsystem.repository.PatchJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatchJobService {
    @Autowired
    private PatchJobRepository patchJobRepository;

    public PatchJob schedulePatchJob(String patchName, LocalDateTime scheduleTime) {
        PatchJob job = new PatchJob();
        job.setPatchName(patchName);
        job.setScheduledTime(scheduleTime);
        job.setStatus("Scheduled");
        return patchJobRepository.save(job);
    }

    public List<PatchJob> getAllJobs() {
        return patchJobRepository.findAll();
    }
}