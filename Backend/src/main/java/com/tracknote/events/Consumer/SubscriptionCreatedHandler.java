package com.tracknote.events.Consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracknote.events.EventHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SubscriptionCreatedHandler implements EventHandler {
    private final ObjectMapper mapper;

    @Override
    public String getHandledEventType(){
        return "SUBSCRIPTION_CREATED";
    }


    @Override
    public void handle(String payload){
        try {
            SubscriptionCreatedMessage message = mapper.readValue(payload, SubscriptionCreatedMessage.class);
            log.info("Handled SUBSCRIPTION_CREATED for userId={} username={} planName={}",
                    message.userId(), message.username(), message.planName());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize SUBSCRIPTION_CREATED payload", e);
        }
    }

}
