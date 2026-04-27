package com.tracknote.events;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;

import java.time.Instant;
import java.time.LocalDateTime;

public interface DomainEvent {
    /**
     * Unique identifier for this event instance.
     * Used for idempotency - if the relay crashes mid-publish,
     * we don't accidentally publish the same event twice.
     */
    String getEventId();

    /**
     * Human-readable event type identifier.
     * Convention: SCREAMING_SNAKE_CASE, e.g. "SUBSCRIPTION_CREATED"
     * This becomes the Kafka message header and is used to route
     * to the correct topic.
     */
    String getEventType();

    /**
     * The domain aggregate this event belongs to.
     * e.g. "subscription", "project", "user"
     * Used to group related events and for observability.
     */
    String getAggregateType();

    /**
     * The ID of the specific aggregate instance.
     * e.g. userId "42", subscriptionId "sub_123"
     * Used as the Kafka partition key - guarantees all events
     * for the same entity are processed in order.
     */
    String getAggregateId();

    /**
     * When this event occurred in the domain.
     * Use Instant (UTC) — never LocalDateTime for events.
     * Reason: events flow across systems and timezones. UTC is unambiguous.
     */
    Instant getOccurredAt();
}

//Why are we creating methods instead of variables?
