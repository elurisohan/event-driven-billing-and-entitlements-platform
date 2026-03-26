package com.tracknote.controller;

import com.google.gson.JsonSyntaxException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import com.tracknote.dto.CheckoutRequestDTO;
import com.tracknote.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.google.gson.JsonSyntaxException;
import java.util.Map;
//Value annotation can only be used on class level
//method name should be descriptive and start with lower case
//Shift + Tb to move left
@RestController
@RequestMapping(value = "api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/billing/checkout-session")
    public ResponseEntity<?> createCheckoutSession(
            @RequestBody CheckoutRequestDTO request,
            @AuthenticationPrincipal UserDetails user) throws StripeException {

        String url = subscriptionService.createCheckoutSession(
                user.getUsername(), request.getPriceId());

        return ResponseEntity.ok(Map.of("checkoutUrl", url));
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String signHeader) {

        Event event;
        try {
            if (endpointSecret != null && !endpointSecret.isBlank() && signHeader != null) {
                event = Webhook.constructEvent(payload, signHeader, endpointSecret);
            } else {
                log.warn("Stripe webhook: signature verification skipped (set stripe.webhook.secret for production)");
                event = ApiResource.GSON.fromJson(payload, Event.class);
            }
        } catch (JsonSyntaxException e) {
            log.warn("Webhook error while parsing payload", e);
            return ResponseEntity.badRequest().build();
        } catch (SignatureVerificationException e) {
            log.warn("Webhook error while validating signature", e);
            return ResponseEntity.badRequest().build();
        }

        try {
            subscriptionService.handleStripeEvent(payload, event);
        } catch (StripeException e) {
            log.error("Stripe error while handling webhook", e);
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok().build();
    }
}
