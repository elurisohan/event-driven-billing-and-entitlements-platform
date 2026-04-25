package events;

public interface EventHandler {

    String getHandledEventType();
    void handle(String payload);
}
