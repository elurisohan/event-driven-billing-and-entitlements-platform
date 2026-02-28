package com.tracknote.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String stripePriceId;

    private Integer maxProjects;
    private Integer maxTasksPerProject;

    @Builder.Default
    private boolean isDefault = false;
}