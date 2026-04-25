package events;

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
        //We write procedure to push this event to Outbox Event

        try {
            String payload = objectMapper.writeValueAsString(domainEvent);
            OutboxEvent event = OutboxEvent.builder()
                    .aggregateType(domainEvent.getAggregateType())
                    .aggregateId(domainEvent.getAggregateId())
                    .type(domainEvent.getEventType())
                    .payload(payload)
                    .build();

            outboxEventRepository.save(event);
        }
        catch(Exception e){
            throw new RuntimeException("Failed to serialize and persist domain event: " + domainEvent.getEventType(), e);
        }
    }
}
