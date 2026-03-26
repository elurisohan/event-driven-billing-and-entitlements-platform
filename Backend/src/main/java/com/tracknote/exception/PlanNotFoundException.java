package com.tracknote.exception;

public class PlanNotFoundException extends RuntimeException {
    public PlanNotFoundException(String planName) {
        super("Plan not found: " + planName);
    }
}
