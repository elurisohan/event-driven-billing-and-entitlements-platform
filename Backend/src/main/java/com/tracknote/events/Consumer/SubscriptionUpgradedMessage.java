package com.tracknote.events.Consumer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SubscriptionUpgradedMessage(
        int userId,
        String username,
        String fromPlan,
        String toPlan,
        String stripeSubscriptionId,
        String eventId,
        String occurredAt
) {}


