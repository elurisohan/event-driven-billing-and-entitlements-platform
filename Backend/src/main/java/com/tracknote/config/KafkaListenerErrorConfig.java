package com.tracknote.config;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.support.ExponentialBackOffWithMaxRetries;

import java.util.Objects;

@Configuration
public class KafkaListenerErrorConfig {

    @Bean
    public DefaultErrorHandler defaultErrorHandler(KafkaTemplate<Object, Object> kafkaTemplate) {
        ExponentialBackOffWithMaxRetries backOff = new ExponentialBackOffWithMaxRetries(5);
        backOff.setInitialInterval(1000L);
        backOff.setMultiplier(2.0);
        backOff.setMaxInterval(30000L);

        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(
                Objects.requireNonNull(kafkaTemplate),
                (ConsumerRecord<?, ?> record, Exception exception) ->
                        new TopicPartition(record.topic() + ".dlt", record.partition())
        );

        DefaultErrorHandler errorHandler = new DefaultErrorHandler(recoverer, backOff);
        errorHandler.addNotRetryableExceptions(IllegalArgumentException.class);
        return errorHandler;
    }
}
