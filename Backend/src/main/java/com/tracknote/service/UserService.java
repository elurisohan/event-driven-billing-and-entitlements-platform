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
        /* Theobject creation without a builder would look like:

java
User newUser = new User(
    request.getUsername(),
    request.getName(),
    request.getEmail(),
    request.getPassword()
);
Downsides without builder:
The constructor call with multiple parameters can be confusing — it's not immediately clear which argument corresponds to which field.

If you have many fields or optional parameters, you might end up with many overloaded constructors or pass null for unused fields.

Immutable objects require many constructors or factory methods to accommodate different parameter combinations. */

        subscriptionRepository.save(subscription);
        log.info("New User {} has been created",newUser);
        userRepository.save(newUser);
        System.out.println("Saved user successfully");
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
