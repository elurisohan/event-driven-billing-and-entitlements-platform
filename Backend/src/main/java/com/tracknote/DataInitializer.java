package com.tracknote;

import com.tracknote.dao.PlanRepository;
import com.tracknote.model.Plan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
//Use Logger to write logs, also check how to use Cacheable and if we have a need to schedule a cron job
    @Autowired
    PlanRepository planRepository;

    @Value("${STRIPE_FREE_PRICE_ID:${gateflow.plans.free.price-id:}}")
    private String free_StripeId;

    @Value("${STRIPE_PRO_PRICE_ID:${gateflow.plans.pro.price-id:}}")
    private String pro_StripeId;

    @Override
    public void run(String... args) throws Exception{

        if (planRepository.findByName("FREE").isEmpty()){
            planRepository.save(Plan.builder().name("FREE").stripePriceId(free_StripeId).maxProjects(1).maxTasksPerProject(10).isDefault(true).build());
            System.out.println("Seeded FREE plan into database.");
        }

        if (planRepository.findByName("PRO").isEmpty()){
            planRepository.save(Plan.builder().name("PRO").stripePriceId(pro_StripeId).maxProjects(null).maxTasksPerProject(null).isDefault(false).build());
            System.out.println("Seeded PRO plan into database.");
        }
    }


}
