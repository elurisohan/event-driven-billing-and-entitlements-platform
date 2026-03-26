package com.tracknote.exception;

public class PlanNotFoundException extends RuntimeException {
  public PlanNotFoundException(String message) {
    super(message);
  }
}
