package com.tracknote.dao;

import com.tracknote.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan,Integer> {

        Optional<Plan> findByName(String name);

        Optional<Plan> findByStripePriceId(String stripePriceId);
}
