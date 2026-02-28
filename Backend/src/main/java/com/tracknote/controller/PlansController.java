package com.tracknote.controller;


import com.tracknote.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/")
@RestController
@RequiredArgsConstructor
public class PlansController {

    private final PlanService planService;

    @GetMapping("plans")
    public ResponseEntity<?> getPlans(){
        return ResponseEntity.ok().body(planService.getPlans());
    }


}
