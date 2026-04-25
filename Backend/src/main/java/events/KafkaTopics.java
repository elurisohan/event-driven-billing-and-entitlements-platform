package events;

import java.util.Map;

public final class KafkaTopics {

    private KafkaTopics() {} // Utility class - no instantiation

    // Naming convention: <app>.<aggregate>.<past-tense-verb>
    // This matches what consumers expect and makes logs readable.
    public static final String SUBSCRIPTION_CREATED   = "tracknote.subscription.created";
    public static final String SUBSCRIPTION_UPGRADED  = "tracknote.subscription.upgraded";
    public static final String SUBSCRIPTION_CANCELLED = "tracknote.subscription.cancelled";
    public static final String PAYMENT_FAILED         = "tracknote.payment.failed";
    public static final String SUBSCRIPTION_CREATED_DLT   = SUBSCRIPTION_CREATED + ".dlt";
    public static final String SUBSCRIPTION_UPGRADED_DLT  = SUBSCRIPTION_UPGRADED + ".dlt";
    public static final String SUBSCRIPTION_CANCELLED_DLT = SUBSCRIPTION_CANCELLED + ".dlt";
    public static final String PAYMENT_FAILED_DLT         = PAYMENT_FAILED + ".dlt";
    // Add new topics here as you add new event types

    /*
     * Maps event type strings to their Kafka topics.
     * OutboxRelay calls this to route any event without knowing its type.
     */
    public static final Map<String, String> EVENT_TYPE_TO_TOPIC = Map.of(
            "SUBSCRIPTION_CREATED",   SUBSCRIPTION_CREATED,
            "SUBSCRIPTION_UPGRADED",  SUBSCRIPTION_UPGRADED,
            "SUBSCRIPTION_CANCELLED", SUBSCRIPTION_CANCELLED,
            "PAYMENT_FAILED",         PAYMENT_FAILED
    );

    public static String topicFor(String eventType) {
        String topic = EVENT_TYPE_TO_TOPIC.get(eventType);
        if (topic == null) {
            throw new IllegalArgumentException(
                    "No Kafka topic registered for event type: " + eventType +
                            ". Add it to KafkaTopics.EVENT_TYPE_TO_TOPIC.");
        }
        return topic;
    }

    public static String dltTopicFor(String eventType) {
        return topicFor(eventType) + ".dlt";
    }
}