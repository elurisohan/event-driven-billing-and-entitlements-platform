package events;

public interface DomainEventPublisher {
    //We use this method within handling stripe webhooks method. That high level component has to depend on this class.
    void publish(DomainEvent domainEvent);
}
