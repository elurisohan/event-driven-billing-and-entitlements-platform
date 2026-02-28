package com.tracknote.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlanResponseDTO {
   private String name;

   private String stripePriceId;

   private Integer maxProjects;

   private Integer maxTasksPerProject;
}
