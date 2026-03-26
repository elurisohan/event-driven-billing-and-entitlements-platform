package com.tracknote.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "stripe_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StripeEvent {

    @Id
    @Column(name = "event_id", nullable = false, length = 255)
    private String id;

    @Column(name = "type", length = 255)
    private String type;

    @Column(name = "payload")
    @JdbcTypeCode(SqlTypes.JSON)
    private String payload;

    @Column(name = "processed_at")
    @Builder.Default
    private LocalDateTime processedAt = LocalDateTime.now();
}
