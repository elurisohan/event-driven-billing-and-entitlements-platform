package com.tracknote.events.Consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class SubscriptionCreatedMessageTest {

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Test
    void deserializesOutboxPayloadWithExtraProperties() throws Exception {
        String payload = """
                {"eventId":"8c8a1ce1-c4d8-487c-81aa-de41bc946ab0","occurredAt":"2026-05-17T22:52:55.220151100Z","userId":2102,"username":"johnd1","planName":"FREE","stripeSubscriptionId":null,"aggregateId":null,"eventType":"SUBSCRIPTION_CREATED","aggregateType":"subscription"}
                """;

        SubscriptionCreatedMessage message = mapper.readValue(payload, SubscriptionCreatedMessage.class);

        assertEquals(2102, message.userId());
        assertEquals("johnd1", message.username());
        assertEquals("FREE", message.planName());
        assertNull(message.stripeSubscriptionId());
        assertEquals("8c8a1ce1-c4d8-487c-81aa-de41bc946ab0", message.eventId());
    }
}
