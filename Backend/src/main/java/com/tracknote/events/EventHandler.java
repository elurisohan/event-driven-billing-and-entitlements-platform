package com.tracknote.events;

public interface EventHandler {

    String getHandledEventType();
    void handle(String payload);
}
