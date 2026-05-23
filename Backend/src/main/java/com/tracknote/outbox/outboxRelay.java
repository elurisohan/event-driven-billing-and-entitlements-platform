package com.tracknote.outbox;


import com.tracknote.dao.OutboxEventRepository;
import com.tracknote.model.OutboxEvent;
import com.tracknote.events.KafkaTopics;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class outboxRelay {

    private static final int BATCH_SIZE = 50;
    private static final int MAX_RETRIES = 8;
    private static final long INITIAL_BACKOFF_SECONDS = 5;
    private static final long MAX_BACKOFF_SECONDS = 300;

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Transactional
    @Scheduled(fixedDelayString = "${outbox.relay.fixed-delay-ms:5000}")
    public void relay() {
        List<OutboxEvent> outboxEvents = outboxEventRepository.lockNextRelayBatch(
                LocalDateTime.now(),
                PageRequest.of(0, BATCH_SIZE)
        );

        if (outboxEvents.isEmpty() )return;

        log.info("Relaying {} outbox event(s)", outboxEvents.size());
        for  (OutboxEvent outboxEvent : outboxEvents) {
            publishEvent(outboxEvent);
        }
    }

    public void publishEvent(OutboxEvent event){
        try {
            String topic = KafkaTopics.topicFor(event.getType());
            String messageKey = safeAggregateId(event);
            Message<String> message = MessageBuilder
                    .withPayload(safePayload(event))
                    .setHeader(KafkaHeaders.TOPIC, Objects.requireNonNull(topic))
                    .setHeader(KafkaHeaders.KEY, messageKey)
                    .setHeader("eventType", event.getType())
                    .setHeader("eventId", event.getId())
                    .build();

            SendResult<String, String> result = kafkaTemplate.send(message).get();

            event.setStatus(true);
            event.setPublishedAt(LocalDateTime.now());
            event.setLastError(null);
            event.setNextRetryAt(null);
            outboxEventRepository.save(event);
            log.info("Published event id={} type={} to topic={} partition={} offset={}",
                    event.getId(),
                    event.getType(),
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());

        } catch (IllegalArgumentException e) {
            // No topic registered for this event type - this is a developer error
            log.error("CONFIGURATION ERROR - {}", e.getMessage());
            // Don't mark as published, but also don't crash the relay
            scheduleRetryOrDeadLetter(event, e);
        } catch (Exception e) {
            log.error("Failed to publish event id={} type={}: {}",
                    event.getId(), event.getType(), e.getMessage(), e);
            scheduleRetryOrDeadLetter(event, e);
        }
    }

    private void scheduleRetryOrDeadLetter(OutboxEvent event, Exception error) {
        int attempt = event.getRetryCount() + 1;
        event.setRetryCount(attempt);
        event.setLastError(truncateError(error.getMessage()));

        if (attempt >= MAX_RETRIES) {
            publishToDeadLetter(event, error);
            return;
        }

        long delay = computeBackoffSeconds(attempt);
        event.setNextRetryAt(LocalDateTime.now().plusSeconds(delay));
        outboxEventRepository.save(event);
        log.warn("Scheduled retry for event id={} attempt={} nextRetryAt={}",
                event.getId(), attempt, event.getNextRetryAt());
    }

    private void publishToDeadLetter(OutboxEvent event, Exception error) {
        try {
            String dltTopic = KafkaTopics.dltTopicFor(event.getType());
            Message<String> dltMessage = MessageBuilder
                    .withPayload(safePayload(event))
                    .setHeader(KafkaHeaders.TOPIC, Objects.requireNonNull(dltTopic))
                    .setHeader(KafkaHeaders.KEY, safeAggregateId(event))
                    .setHeader("eventType", event.getType())
                    .setHeader("originalTopic", KafkaTopics.topicFor(event.getType()))
                    .setHeader("retryCount", event.getRetryCount())
                    .setHeader("failureReason", truncateError(error.getMessage()))
                    .build();

            kafkaTemplate.send(dltMessage).get();
            event.setStatus(true);
            event.setDeadLettered(true);
            event.setDeadLetteredAt(LocalDateTime.now());
            event.setNextRetryAt(null);
            outboxEventRepository.save(event);
            log.error("Sent event id={} type={} to DLT after {} attempts",
                    event.getId(), event.getType(), event.getRetryCount());
        } catch (Exception dltError) {
            long delay = computeBackoffSeconds(event.getRetryCount());
            event.setNextRetryAt(LocalDateTime.now().plusSeconds(delay));
            outboxEventRepository.save(event);
            log.error("Failed to publish event id={} to DLT: {}",
                    event.getId(), dltError.getMessage(), dltError);
        }
    }

    private long computeBackoffSeconds(int attempt) {
        long exponentialDelay = INITIAL_BACKOFF_SECONDS * (1L << Math.min(6, Math.max(0, attempt - 1)));
        return Math.min(exponentialDelay, MAX_BACKOFF_SECONDS);
    }

    private String truncateError(String errorMessage) {
        if (errorMessage == null) {
            return "unknown error";
        }
        return errorMessage.length() <= 2000 ? errorMessage : errorMessage.substring(0, 2000);
    }

    private String safePayload(OutboxEvent event) {
        return Objects.requireNonNullElse(event.getPayload(), "{}");
    }

    private String safeAggregateId(OutboxEvent event) {
        return Objects.requireNonNullElse(event.getAggregateId(), "unknown-aggregate");
    }

}