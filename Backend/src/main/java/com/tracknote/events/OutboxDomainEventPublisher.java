package com.tracknote.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracknote.dao.OutboxEventRepository;
import com.tracknote.model.OutboxEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class OutboxDomainEventPublisher implements DomainEventPublisher{
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void publish(DomainEvent domainEvent) {
        String eventTypeForError = describeEventType(domainEvent);
        try {
            String payload = objectMapper.writeValueAsString(domainEvent);
            String eventType = required(domainEvent.getEventType(), "eventType");
            String aggregateType = required(domainEvent.getAggregateType(), "aggregateType");
            String aggregateId = normalizeAggregateId(domainEvent);

            OutboxEvent event = OutboxEvent.builder()
                    .aggregateType(aggregateType)
                    .aggregateId(aggregateId)
                    .type(eventType)
                    .payload(payload)
                    .build();

            outboxEventRepository.save(event);
        }
        catch(Exception e){
            throw new RuntimeException("Failed to serialize and persist domain event: " + eventTypeForError, e);
        }
    }

    private String normalizeAggregateId(DomainEvent domainEvent) {
        String aggregateId = domainEvent.getAggregateId();
        if (aggregateId != null && !aggregateId.isBlank()) {
            return aggregateId;
        }

        return required(domainEvent.getEventId(), "eventId");
    }

    private String required(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Domain event " + fieldName + " must not be blank");
        }
        return value;
    }

    private String describeEventType(DomainEvent domainEvent) {
        String rawEventType = domainEvent.getEventType();
        if (rawEventType == null || rawEventType.isBlank()) {
            return "<unknown>";
        }
        return rawEventType;
    }
}
