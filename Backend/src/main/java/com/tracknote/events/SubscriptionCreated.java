package com.tracknote.events;


import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class SubscriptionCreated extends BaseDomainEvent{

    private final int userId;

    private final String username;

    private final String planName;
    private final String stripeSubscriptionId;


    @Override public String getEventType()     { return "SUBSCRIPTION_CREATED"; }
    @Override public String getAggregateType() { return "subscription"; }
    @Override public String getAggregateId()   { return stripeSubscriptionId; }

}
