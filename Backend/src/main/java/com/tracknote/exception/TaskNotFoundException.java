package com.tracknote.exception;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(int task_id) {
        super(String.format("Task with id '%s' not found",task_id));
    }
}

