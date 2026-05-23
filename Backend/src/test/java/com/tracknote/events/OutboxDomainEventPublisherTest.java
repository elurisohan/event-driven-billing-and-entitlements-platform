package com.tracknote.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tracknote.dao.OutboxEventRepository;
import com.tracknote.model.OutboxEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OutboxDomainEventPublisherTest {

    private OutboxEventRepository outboxEventRepository;
    private OutboxDomainEventPublisher publisher;

    @BeforeEach
    void setUp() {
        outboxEventRepository = mock(OutboxEventRepository.class);
        when(outboxEventRepository.save(org.mockito.ArgumentMatchers.<OutboxEvent>any()))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        publisher = new OutboxDomainEventPublisher(outboxEventRepository, objectMapper);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void publish_whenAggregateIdMissing_fallsBackToEventId(String aggregateId) {
        TestDomainEvent event = new TestDomainEvent(
                "evt-123",
                "SUBSCRIPTION_CREATED",
                "subscription",
                aggregateId,
                Instant.parse("2026-04-26T23:00:00Z")
        );

        publisher.publish(event);

        ArgumentCaptor<OutboxEvent> captor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository).save(captor.capture());
        OutboxEvent saved = captor.getValue();

        assertEquals("evt-123", saved.getAggregateId());
        assertEquals("SUBSCRIPTION_CREATED", saved.getType());
        assertEquals("subscription", saved.getAggregateType());
        assertTrue(saved.getPayload().contains("\"eventId\":\"evt-123\""));
    }

    @Test
    void publish_whenAggregateIdPresent_persistsProvidedAggregateId() {
        TestDomainEvent event = new TestDomainEvent(
                "evt-777",
                "SUBSCRIPTION_CREATED",
                "subscription",
                "sub_abc123",
                Instant.parse("2026-04-26T23:00:00Z")
        );

        publisher.publish(event);

        ArgumentCaptor<OutboxEvent> captor = ArgumentCaptor.forClass(OutboxEvent.class);
        verify(outboxEventRepository).save(captor.capture());
        OutboxEvent saved = captor.getValue();

        assertEquals("sub_abc123", saved.getAggregateId());
    }

    @Test
    void subscriptionCreated_springStylePayload_exceedsVarchar255() throws Exception {
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        SubscriptionCreated event = SubscriptionCreated.builder()
                .userId(352)
                .username("doe1")
                .planName("FREE")
                .stripeSubscriptionId(null)
                .build();
        String payload = mapper.writeValueAsString(event);
        assertTrue(
                payload.length() > 255,
                "payload length=" + payload.length() + " chars: " + payload
        );
    }

    @Test
    void publish_whenRepositorySaveFails_wrapsExceptionWithEventTypeContext() {
        when(outboxEventRepository.save(org.mockito.ArgumentMatchers.any(OutboxEvent.class)))
                .thenThrow(new IllegalStateException("db failure"));

        TestDomainEvent event = new TestDomainEvent(
                "evt-999",
                "SUBSCRIPTION_CREATED",
                "subscription",
                null,
                Instant.parse("2026-04-26T23:00:00Z")
        );

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> publisher.publish(event));
        assertTrue(thrown.getMessage().contains("SUBSCRIPTION_CREATED"));
    }

    @Test
    void publish_whenEventTypeValidationFails_reportsUnknownEventTypeContext() {
        TestDomainEvent event = new TestDomainEvent(
                "evt-111",
                null,
                "subscription",
                "sub_abc123",
                Instant.parse("2026-04-26T23:00:00Z")
        );

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> publisher.publish(event));
        assertTrue(thrown.getMessage().contains("<unknown>"));
        assertTrue(thrown.getCause() instanceof IllegalArgumentException);
        assertTrue(thrown.getCause().getMessage().contains("eventType"));
    }

    private static final class TestDomainEvent implements DomainEvent {
        private final String eventId;
        private final String eventType;
        private final String aggregateType;
        private final String aggregateId;
        private final Instant occurredAt;

        private TestDomainEvent(String eventId, String eventType, String aggregateType, String aggregateId, Instant occurredAt) {
            this.eventId = eventId;
            this.eventType = eventType;
            this.aggregateType = aggregateType;
            this.aggregateId = aggregateId;
            this.occurredAt = occurredAt;
        }

        @Override
        public String getEventId() {
            return eventId;
        }

        @Override
        public String getEventType() {
            return eventType;
        }

        @Override
        public String getAggregateType() {
            return aggregateType;
        }

        @Override
        public String getAggregateId() {
            return aggregateId;
        }

        @Override
        public Instant getOccurredAt() {
            return occurredAt;
        }
    }
}
