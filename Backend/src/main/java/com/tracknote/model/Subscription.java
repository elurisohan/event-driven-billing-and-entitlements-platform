package com.tracknote.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;

    private String stripeSubscriptionId; // ID from Stripe (sub_...)

    private String status; // active, trialing, canceled, past_due

    private LocalDateTime currentPeriodEnd;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}