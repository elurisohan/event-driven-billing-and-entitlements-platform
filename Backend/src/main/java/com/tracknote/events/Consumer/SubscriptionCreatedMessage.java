package com.tracknote.events.Consumer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Kafka wire contract for SUBSCRIPTION_CREATED. Separate from the domain event
 * ({@link com.tracknote.events.SubscriptionCreated}) so consumers can deserialize
 * without a Jackson-capable builder hierarchy.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record SubscriptionCreatedMessage(
        int userId,
        String username,
        String planName,
        String stripeSubscriptionId,
        String eventId,
        String occurredAt
) {}
