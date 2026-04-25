package com.tracknote.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name="outbox_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String aggregateType ;

    @Column(nullable = false)
    private String aggregateId ;

    @Column(nullable = false)
    private String type ;

    private String payload;

    @Builder.Default
    private boolean status=false;

    @Builder.Default
    private int retryCount = 0;

    private LocalDateTime nextRetryAt;

    @Column(length = 2000)
    private String lastError;

    private LocalDateTime publishedAt;

    @Builder.Default
    private boolean deadLettered = false;

    private LocalDateTime deadLetteredAt;

    @Builder.Default
    private LocalDateTime createdAt= LocalDateTime.now() ;
}

//snake_case - naming convention in DB
//camelCase - naming convention for Entities