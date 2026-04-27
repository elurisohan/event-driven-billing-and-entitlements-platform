package com.tracknote.events.Consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tracknote.events.SubscriptionCreated;
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
            SubscriptionCreated event = mapper.readValue(payload, SubscriptionCreated.class);
            log.info("Handled SUBSCRIPTION_CREATED for userId={} username={}",
                    event.getUserId(), event.getUsername());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize SUBSCRIPTION_CREATED payload", e);
        }
    }

}
