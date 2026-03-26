package com.tracknote.dao;

import com.tracknote.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
    //to look at the list of users who're on a same project
    public List<com.tracknote.model.User> findAllBySharedProjects_Id(int project_id);

    Optional<com.tracknote.model.User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    Optional<User> findByStripeCustomerId(String stripeCustomerId);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
