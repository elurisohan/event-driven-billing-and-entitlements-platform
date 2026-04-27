package com.tracknote.service;

import com.tracknote.Jwtutil;
import com.tracknote.dao.PlanRepository;
import com.tracknote.dao.SubscriptionRepository;
import com.tracknote.dao.UserRepository;
import com.tracknote.dto.AuthRequest;
import com.tracknote.dto.AuthResponse;
import com.tracknote.dto.RegisterRequest;
import com.tracknote.exception.InvalidCredentials;
import com.tracknote.exception.PlanNotFoundException;
import com.tracknote.exception.UserNotFoundException;
import com.tracknote.model.Plan;
import com.tracknote.model.Subscription;
import com.tracknote.model.User;
import com.tracknote.events.DomainEventPublisher;
import com.tracknote.events.SubscriptionCreated;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final Jwtutil jwtUtil;
    private final PlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final DomainEventPublisher domainEventPublisher;

    @Transactional
    public AuthResponse register(RegisterRequest request){
        if (userRepository.existsByUsername(request.getUsername())){
            //Throwable class - Errors and Exceptions (Checked and Unchecked (RTE)).
            throw new RuntimeException("Username already exists");
        } else if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User newUser=User.builder().username(request.getUsername()).fullname(request.getName()).email(request.getEmail()).password(request.getPassword()).build();

        Plan freePlan= planRepository.findByName("FREE")
                .orElseThrow(()->new PlanNotFoundException("FREE"));
        log.info("free plan: "+freePlan.getName());
        Subscription subscription = Subscription.builder()
                .user(newUser)
                .plan(freePlan)
                .stripeSubscriptionId(null)
                .status("active")
                .build();
        log.info("Subscription object created {} ",subscription);

        userRepository.save(newUser);
        System.out.println("Saved user successfully");
        subscriptionRepository.save(subscription);
        log.info("New User {} has been created",newUser);

        //writing to outbox
        domainEventPublisher.publish(
            SubscriptionCreated.builder()
                    .userId(newUser.getId())
                    .username(newUser.getUsername())
                    .planName(freePlan.getName())
                    .stripeSubscriptionId(null)
                        .build()
        );

        return new AuthResponse(jwtUtil.generateToken(newUser.getUsername()));
    }

    public AuthResponse login(AuthRequest request){
        User user=userRepository.findByEmail(request.getEmail()).orElseThrow(()->new UserNotFoundException(request.getEmail()));
        if (!user.getPassword().equals(request.getPassword())){
            throw new InvalidCredentials();
        }
        return new AuthResponse(jwtUtil.generateToken(user.getUsername()));
    }





}
