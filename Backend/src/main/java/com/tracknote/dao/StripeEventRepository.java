package com.tracknote.dao;

import com.tracknote.model.StripeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StripeEventRepository extends JpaRepository<StripeEvent, String> {
}
