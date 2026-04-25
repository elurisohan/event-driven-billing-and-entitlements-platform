package events;


import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
public class EventDispatcher {

    // Spring injects ALL beans implementing EventHandler automatically.
    // You add a new handler? Spring finds it. This class never changes.
    private final Map<String, EventHandler> handlers;

    public EventDispatcher(List<EventHandler> handlerList) {
        this.handlers = handlerList.stream()
                .collect(Collectors.toMap(
                        EventHandler::getHandledEventType,
                        Function.identity()
                ));
        log.info("Registered {} event handlers: {}", handlers.size(), handlers.keySet());
    }

    @KafkaListener(
            topics = {
                    KafkaTopics.SUBSCRIPTION_CREATED,
                    KafkaTopics.SUBSCRIPTION_UPGRADED,
                    KafkaTopics.SUBSCRIPTION_CANCELLED
            },
            groupId = "tracknote-subscription-group"
    )
    public void dispatch(
            @Payload String payload,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(value = "eventType", required = false) String eventType) {

        log.debug("Received event from topic={} eventType={}", topic, eventType);

        if (eventType == null) {
            log.warn("Received message on topic={} with no eventType header. Skipping.", topic);
            return;
        }

        EventHandler handler = handlers.get(eventType);

        if (handler == null) {
            log.warn("No handler registered for eventType={}. Skipping.", eventType);
            return;
        }

        try {
            handler.handle(payload);
        } catch (Exception e) {
            log.error("Handler failed for eventType={}: {}", eventType, e.getMessage(), e);
            throw new IllegalStateException("Event handler failed for eventType=" + eventType, e);
        }
    }
}