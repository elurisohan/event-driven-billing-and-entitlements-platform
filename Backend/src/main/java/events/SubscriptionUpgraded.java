package events;

import lombok.Builder;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
public class SubscriptionUpgraded extends BaseDomainEvent {

    private final int userId;
    private final String username;
    private final String fromPlan;
    private final String toPlan;
    private final String stripeSubscriptionId;


    @Override public String getEventType()     { return "SUBSCRIPTION_UPGRADED"; }
    @Override public String getAggregateType() { return "subscription"; }
    @Override public String getAggregateId()   { return stripeSubscriptionId; }
}