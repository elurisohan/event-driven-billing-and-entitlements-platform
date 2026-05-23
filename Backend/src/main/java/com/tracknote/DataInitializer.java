package com.tracknote;

import com.tracknote.dao.PlanRepository;
import com.tracknote.model.Plan;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {
//Use Logger to write logs, also check how to use Cacheable and if we have a need to schedule a cron job
    @Autowired
    PlanRepository planRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Value("${STRIPE_FREE_PRICE_ID:${gateflow.plans.free.price-id:}}")
    private String free_StripeId;

    @Value("${STRIPE_PRO_PRICE_ID:${gateflow.plans.pro.price-id:}}")
    private String pro_StripeId;

    @Override
    public void run(String... args) throws Exception{
        migrateOutboxPayloadColumn();

        if (planRepository.findByName("FREE").isEmpty()){
            planRepository.save(Plan.builder().name("FREE").stripePriceId(free_StripeId).maxProjects(1).maxTasksPerProject(10).isDefault(true).build());
            System.out.println("Seeded FREE plan into database.");
        }

        if (planRepository.findByName("PRO").isEmpty()){
            planRepository.save(Plan.builder().name("PRO").stripePriceId(pro_StripeId).maxProjects(null).maxTasksPerProject(null).isDefault(false).build());
            System.out.println("Seeded PRO plan into database.");
        }
    }

    private void migrateOutboxPayloadColumn() {
        try {
            String dataType = jdbcTemplate.queryForObject(
                    """
                    SELECT data_type
                    FROM information_schema.columns
                    WHERE table_schema = current_schema()
                      AND table_name = 'outbox_events'
                      AND column_name = 'payload'
                    """,
                    String.class);
            if ("character varying".equals(dataType)) {
                jdbcTemplate.execute("ALTER TABLE outbox_events ALTER COLUMN payload TYPE TEXT");
                log.info("Migrated outbox_events.payload from varchar to TEXT");
            }
        } catch (Exception e) {
            log.debug("outbox_events.payload migration skipped: {}", e.getMessage());
        }
    }

}
