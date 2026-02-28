package com.tracknote.service;

import com.tracknote.dao.PlanRepository;
import com.tracknote.dto.PlanResponseDTO;
import com.tracknote.model.Plan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public List<PlanResponseDTO> getPlans() {
        return planRepository.findAll().stream()
                .map(this::toPlanResponseDTO)
                .collect(Collectors.toList());
    }

    private PlanResponseDTO toPlanResponseDTO(Plan plan){
        return PlanResponseDTO.builder()
                .name(plan.getName())
                .stripePriceId(plan.getStripePriceId())
                .maxProjects(plan.getMaxProjects())
                .maxTasksPerProject(plan.getMaxTasksPerProject())
                .build();
    }
}
