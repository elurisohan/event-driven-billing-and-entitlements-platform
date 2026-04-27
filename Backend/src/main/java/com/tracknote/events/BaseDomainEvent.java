package com.tracknote.events;

import lombok.Getter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Getter
@SuperBuilder
public abstract class BaseDomainEvent implements DomainEvent {

    // UUID generated at construction time.
    // Every event instance gets a globally unique ID automatically.
    private final String eventId = UUID.randomUUID().toString();

    private final Instant occurredAt = Instant.now();

    @Override
    public abstract String getEventType();

    @Override
    public abstract String getAggregateType();

    @Override
    public abstract String getAggregateId();

}


