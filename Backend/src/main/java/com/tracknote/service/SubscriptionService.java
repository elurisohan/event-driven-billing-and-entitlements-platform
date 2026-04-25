package com.tracknote.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.tracknote.dao.PlanRepository;
import com.tracknote.dao.StripeEventRepository;
import com.tracknote.dao.SubscriptionRepository;
import com.tracknote.dao.UserRepository;
import com.tracknote.exception.PlanNotFoundException;
import com.tracknote.exception.UserNotFoundException;
import com.tracknote.model.Plan;
import com.tracknote.model.StripeEvent;
import com.tracknote.model.Subscription;
import com.tracknote.model.User;
import events.OutboxDomainEventPublisher;
import events.SubscriptionUpgraded;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final StripeEventRepository stripeEventRepository;
    private final PlanRepository planRepository;
    private final OutboxDomainEventPublisher outboxDomainEventPublisher;

    public String createCheckoutSession(String username, String priceId) throws StripeException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        String customerId = user.getStripeCustomerId();
        if (customerId == null || customerId.isBlank()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .build();
            Customer customer = Customer.create(customerParams);
            customerId = customer.getId();
            user.setStripeCustomerId(customerId);
            userRepository.save(user);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(customerId)
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build())
                .putMetadata("userId", String.valueOf(user.getId()))
                .putMetadata("priceId", priceId)
                .setSuccessUrl("http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:5173/checkout/cancel")
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    @Transactional
    public void handleStripeEvent(String rawPayload, Event event) throws StripeException {
        if (stripeEventRepository.existsById(event.getId())) {
            log.debug("Stripe event {} already processed; skipping", event.getId());
            return;
        }
//I think this is where we need to add another line to create an event within Outbox Event. Here, which is my domain Code or High level object. I will depend on Interface. called
        switch (event.getType()) {
            case "checkout.session.completed":
                handleCheckoutSessionCompleted(rawPayload, event);
                break;
            default:
                log.info("Unhandled Stripe event type: {}", event.getType());
        }

        //another case to handle checkout.session failed.

        stripeEventRepository.save(StripeEvent.builder()
                .id(event.getId())
                .type(event.getType())
                .payload(rawPayload)
                .processedAt(LocalDateTime.now())
                .build());
    }

    private void handleCheckoutSessionCompleted(String rawPayload, Event event) throws StripeException {
        Session session = deserializeSession(event, rawPayload);
        if (!"subscription".equals(session.getMode())) {
            log.debug("Ignoring checkout session {} mode {}", session.getId(), session.getMode());
            return;
        }

        String subId = session.getSubscription();
        if (subId == null) {
            log.warn("checkout.session.completed missing subscription id for session {}", session.getId());
            return;
        }

        User user = resolveUser(session);
        Plan plan = resolvePlan(session);

        com.stripe.model.Subscription stripeSubscription = com.stripe.model.Subscription.retrieve(subId);

        Subscription subscription = subscriptionRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("No subscription row for user " + user.getId()));

        subscription.setPlan(plan);
        subscription.setStripeSubscriptionId(subId);
        subscription.setStatus(stripeSubscription.getStatus());
        Long periodEnd = stripeSubscription.getCurrentPeriodEnd();
        if (periodEnd != null) {
            subscription.setCurrentPeriodEnd(Instant.ofEpochSecond(periodEnd)
                    .atZone(ZoneOffset.UTC)
                    .toLocalDateTime());
        }
        subscriptionRepository.save(subscription);
        log.info("Subscription updated for user {} to plan {}", user.getUsername(), plan.getName());

        outboxDomainEventPublisher.publish(SubscriptionUpgraded.builder().userId(user.getId()).username(user.getUsername()).stripeSubscriptionId(subscription.getStripeSubscriptionId()).build());

        //set fromPlan - SYSDATE and toPlan to +30 days
    }

    private Session deserializeSession(Event event, String rawPayload) throws StripeException {
        try {
            Optional<StripeObject> obj = event.getDataObjectDeserializer().getObject();
            if (obj.isPresent() && obj.get() instanceof Session) {
                return (Session) obj.get();
            }
        } catch (Exception e) {
            log.warn("Stripe session deserialization failed, retrieving by id: {}", e.toString());
        }
        JsonObject root = JsonParser.parseString(rawPayload).getAsJsonObject();
        String sessionId = root.getAsJsonObject("data").getAsJsonObject("object").get("id").getAsString();
        return Session.retrieve(sessionId);
    }

    private User resolveUser(Session session) {
        Map<String, String> meta = session.getMetadata();
        if (meta != null && meta.containsKey("userId")) {
            int userId = Integer.parseInt(meta.get("userId"));
            return userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalStateException("User not found for id " + userId));
        }
        String customerId = session.getCustomer();
        if (customerId != null) {
            return userRepository.findByStripeCustomerId(customerId)
                    .orElseThrow(() -> new IllegalStateException(
                            "User not found for Stripe customer " + customerId));
        }
        throw new IllegalStateException("Cannot resolve user from checkout session " + session.getId());
    }

    private Plan resolvePlan(Session session) {
        Map<String, String> meta = session.getMetadata();
        if (meta != null && meta.containsKey("priceId")) {
            return planRepository.findByStripePriceId(meta.get("priceId"))
                    .orElseThrow(() -> new PlanNotFoundException(meta.get("priceId")));
        }
        throw new IllegalStateException("Cannot resolve plan from checkout session " + session.getId()
                + " (missing priceId metadata)");
    }
}
