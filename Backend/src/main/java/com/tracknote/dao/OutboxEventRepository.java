package com.tracknote.dao;

import com.tracknote.model.OutboxEvent;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent,Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select e
            from OutboxEvent e
            where e.status = false
              and (e.nextRetryAt is null or e.nextRetryAt <= :now)
            order by e.createdAt asc
            """)
    List<OutboxEvent> lockNextRelayBatch(@Param("now") LocalDateTime now, Pageable pageable);
}



